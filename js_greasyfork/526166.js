// ==UserScript== 
// @name         Tieba Post Backup Tool 
// @namespace    https://github.com/ZXPrism/TiebaPostBackupTool 
// @version      1.0.0 
// @description  Automatically backup tieba posts in a single click 
// @author       ZXP4 
// @license      MIT 
// @match        https://tieba.baidu.com/p/* 
// @grant        GM_registerMenuCommand 
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js 
// @downloadURL https://update.greasyfork.org/scripts/526166/Tieba%20Post%20Backup%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/526166/Tieba%20Post%20Backup%20Tool.meta.js
// ==/UserScript==   

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 916:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Database = void 0;
class Database {
    constructor() {
        this._DB = null;
        this._DBName = "TiebaPostBackupToolDB";
        this._TableName = "PostDB";
        this.AddPost = (post) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const db = this._DB ?? await this.OpenDatabase();
                    const transaction = db.transaction([this._TableName], "readwrite");
                    const store = transaction.objectStore(this._TableName);
                    const request = store.put(post);
                    request.onsuccess = () => {
                        resolve();
                    };
                    request.onerror = (event) => {
                        reject(`无法增加新条目：${event.target}！`);
                    };
                }
                catch (error) {
                    reject(error);
                }
            });
        };
    }
    OpenDatabase() {
        return new Promise((resolve, reject) => {
            try {
                const request = indexedDB.open(this._DBName);
                request.onsuccess = (event) => {
                    this._DB = request.result;
                    resolve(this._DB);
                };
                request.onerror = (event) => {
                    reject(`无法打开数据库：${event.target.error}`);
                };
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(this._TableName)) {
                        db.createObjectStore(this._TableName, { keyPath: "postInfo.postID" });
                    }
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }
    ;
    GetPost(postID) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = this._DB ?? await this.OpenDatabase();
                const transaction = db.transaction([this._TableName], "readonly");
                const store = transaction.objectStore(this._TableName);
                const request = store.get(postID);
                request.onsuccess = () => {
                    resolve(request.result);
                };
                request.onerror = (event) => {
                    reject(`无法获取条目：${event.target.error}`);
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }
    DeletePost(postID) {
        return new Promise(async (resolve, reject) => {
            try {
                const db = this._DB ?? await this.OpenDatabase();
                const transaction = db.transaction([this._TableName], "readwrite");
                const store = transaction.objectStore(this._TableName);
                const request = store.delete(postID);
                request.onsuccess = () => {
                    resolve();
                };
                request.onerror = (event) => {
                    reject(`无法删除条目：${event.target.error}`);
                };
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.Database = Database;
;


/***/ }),

/***/ 408:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Markdown = void 0;
const jszip_1 = __importDefault(__webpack_require__(511));
class Markdown {
    constructor() {
        this._MarkdownData = [];
        this._ImagePathDict = new Map();
    }
    Header(level, header) {
        if (level < 1 || level > 6) {
            throw new Error(`非法的 level: ${level}`);
        }
        this._MarkdownData.push(`${"#".repeat(level)} ${header}\n\n`);
    }
    TableHeader(header) {
        this._MarkdownData.push(`| ${header.join(" | ")} |\n`);
        const align = new Array(header.length).fill("---");
        this._MarkdownData.push(`| ${align.join(" | ")} |\n`);
    }
    TableData(data) {
        this._MarkdownData.push(`| ${data.join(" | ")} |\n`);
    }
    Text(text) {
        this._MarkdownData.push(`${this._ResolveTags(text)}\n\n`);
    }
    Quote(text) {
        this._MarkdownData.push(`> ${this._ResolveTags(text)}\n\n`);
    }
    Image(imgPath, imgMissingText) {
        this._MarkdownData.push(`![${imgMissingText ?? "image"}](${imgPath})\n\n`);
    }
    URL(url) {
        this._MarkdownData.push(`URL: [${url}](${url})\n\n`);
    }
    Separator() {
        this._MarkdownData.push("---\n\n");
    }
    async Generate(filename) {
        let zip = new jszip_1.default();
        const imgFolder = zip.folder("img");
        if (!imgFolder) {
            throw new Error("无法创建文件夹！");
        }
        for (const [imgSrc, imgPath] of this._ImagePathDict) {
            const imageData = await this._DownloadImage(imgSrc);
            imgFolder.file(imgPath, imageData);
        }
        zip.file(`${filename}.md`, this._MarkdownData.join(""));
        const file = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = `${filename}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    _ResolveTags(text) {
        const regexpExt = /(.+?\.)+(\w+)/g;
        const regexpCORS = /(gsp0\.baidu|(tb1|tb2)\.bdstatic)\.com/;
        return text
            .replace(/<img[^>]*?src="(.+?)"[^>]*>/g, (match, p1, offset) => {
            // 获得图像扩展名
            const matchExt = Array.from(p1.matchAll(regexpExt));
            if (matchExt.length == 0) {
                throw new Error("无法获得图像扩展名！");
            }
            const ext = matchExt[0][2];
            // 统一为 HTTPS 协议（否则下载图片可能失败）
            p1 = p1.replace(/http\b/, "https");
            // 对于某些图片（通常是贴吧表情），由于下载会触发 CORS
            // 而且也没有盗链限制，所以直接使用原链接，不另行下载
            const matchCORS = p1.match(regexpCORS);
            if (matchCORS) {
                return `\n![image](${p1})`;
            }
            else {
                if (!this._ImagePathDict.has(p1)) {
                    this._ImagePathDict.set(p1, `${this._ImagePathDict.size}.${ext}`);
                }
                return `\n![image](img/${this._ImagePathDict.get(p1)})\n`;
            }
        })
            .replace("<br>", "\n")
            .replace(/<[^>]*>/g, "") // 去除所有 html tag。FIX：可能会误伤正常内容..
            .replace("点击展开，查看完整图片", "");
    }
    async _DownloadImage(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`无法下载图片： ${url}`);
        }
        return await response.blob();
    }
}
exports.Markdown = Markdown;
;


/***/ }),

/***/ 118:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parser = void 0;
const Markdown_1 = __webpack_require__(408);
const Database_1 = __webpack_require__(916);
class Parser {
    constructor() {
        this._PostURLPrefix = "https://tieba.baidu.com/p";
        this._Markdown = new Markdown_1.Markdown();
        this._Database = new Database_1.Database();
    }
    /**
     * 重置数据库。
     */
    Reset() {
        sessionStorage.clear();
    }
    /**
     * 检查当前是否处于多页解析流程中
     * 如果是，则自动开始解析当前页，并返回 `true`，此时不显示解析按钮，防止误触
     * 如果不是，则什么也不做，并返回 `false`
     */
    ContinueParse() {
        const postInfo = this._ParsepostInfo();
        // 检查当前是否处于多页解析流程中
        const postID = postInfo.postID;
        const status = sessionStorage.getItem(postID);
        if (status) {
            this.Parse();
            return true;
        }
        return false;
    }
    /**
     * 解析贴子。
     * 1. 获取贴子的基本信息
     * 2. 解析所有主楼回复以及楼中楼回复
     * 3. 自动跳转至下一页进行解析
     */
    async Parse() {
        // 打开数据库
        await this._Database.OpenDatabase();
        // 获取贴子的基本信息
        const postInfo = this._ParsepostInfo();
        const postID = postInfo.postID;
        const postCurrPage = postInfo.postCurrPage;
        let postObj = {
            postInfo: postInfo,
            replies: []
        };
        if (!sessionStorage.getItem(postID)) { // 若还未设置多页解析流程标志
            sessionStorage.setItem(postID, "YES");
            // 创建数据库新条目
            postObj.postInfo = postInfo;
            await this._Database.AddPost(postObj);
            alert(`[TiebaPostBackupTool] 提示：备份过程中请勿操作本页面（如滚动页面、点击链接等）。\n预计花费时间：${postInfo.postReplyNum / 2}秒`);
            if (postCurrPage != 1) { //如果不在第一页，则自动跳转到第一页
                window.location.href = `${this._PostURLPrefix}/${postID}`;
                return;
            }
        }
        // 从数据库中获得 Post 对象
        postObj = await this._Database.GetPost(postID);
        // 模拟滚动屏幕以加载全部内容
        await this._SimulateScroll();
        // 解析所有主楼回复以及楼中楼回复
        const replies = this._ParseReplies();
        // 更新 Post 对象
        postObj.replies.push(...replies);
        // 判断是否为最后一页
        if (postCurrPage != postInfo.postPageNum) { // 自动跳转至下一页进行解析
            await this._Database.AddPost(postObj); // 更新数据库对应条目
            window.location.href = `${this._PostURLPrefix}/${postID}?pn=${postCurrPage + 1}`;
        }
        else {
            // 最后一页已处理完毕，写入 Markdown
            await this._SaveToMarkdown(postObj);
            // 删除数据库对应条目
            this._Database.DeletePost(postID);
            // 清除多页解析流程标志
            sessionStorage.removeItem(postID);
            alert("备份成功！");
        }
    }
    /**
     * 获取贴子的基本信息，包括：
     * 1. 标题 `postTitle`
     * 2. 所属贴吧 `postTieba`
     * 3. ID `postID`
     * 4. 页数 `postPageNum`
     * 5. 当前所在页 `postCurrPage`
     * 6. 回复数 `postReplyNum`
     */
    _ParsepostInfo() {
        // 获取标题
        const postTitleElement = document.querySelector(".core_title_txt");
        if (!postTitleElement) {
            throw new Error("无法获取贴子标题！");
        }
        const postTitle = postTitleElement.textContent?.trim() ?? "N/A"; // 贴子标题
        // 获取所属贴吧
        const postTiebaElement = document.querySelector("a.card_title_fname");
        if (!postTiebaElement) {
            throw new Error("无法获取所属贴吧！");
        }
        const postTieba = postTiebaElement.textContent?.trim() ?? "N/A"; // 所属贴吧
        // 获取贴子 ID
        const regexpPostID = /\d+/;
        const matchPostID = window.location.href.match(regexpPostID);
        if (!matchPostID) {
            throw new Error("无法获取贴子 ID！");
        }
        const postID = matchPostID[0]; // 贴子 ID
        // 获取页数和回复数
        const postStatusElement = document.querySelector("ul.l_posts_num");
        if (!postStatusElement) {
            throw new Error("无法获取贴子状态！");
        }
        const postStatus = postStatusElement.textContent ?? "N/A";
        const regexpPostStatus = /(\d+)回复贴，共(\d+)页/g;
        const matchPostStatus = Array.from(postStatus.matchAll(regexpPostStatus));
        if (matchPostStatus.length == 0) {
            throw new Error("无法获取页数和回复数！");
        }
        const postReplyNum = parseInt(matchPostStatus[0][1]); // 回复数
        const postPageNum = parseInt(matchPostStatus[0][2]); // 页数
        // 获取当前所在页
        let postCurrPage = 1;
        if (postPageNum != 1) {
            const postCurrPageElement = postStatusElement.querySelector("span.tP");
            if (!postCurrPageElement) {
                throw new Error("无法获取当前所在页！");
            }
            postCurrPage = parseInt(postCurrPageElement.textContent ?? "-1"); // 当前所在页
        }
        return {
            postTitle: postTitle,
            postTieba: postTieba,
            postID: postID,
            postPageNum: postPageNum,
            postCurrPage: postCurrPage,
            postReplyNum: postReplyNum
        };
    }
    /**
     * 解析贴子的所有回复。
     * 1. 通过选择器获取每一层楼（主楼）的回复
     * 2. 对于每个回复，调用 `_ParseMainReply(...)` 分别进行解析
     */
    _ParseReplies() {
        let replies = [];
        const mainReplies = document.querySelectorAll("div.l_post");
        mainReplies.forEach((mainReply) => {
            if (mainReply.getAttribute("data-field") != "{}") { // 跳过广告楼层
                replies.push(this._ParseMainReply(mainReply));
            }
        });
        return replies;
    }
    /**
     * 解析主楼回复 `mainReply`。
     * 1. 用户名 `author`
     * 2. 回复时间 `replyTime`
     * 3. 回复内容 `replyContent`
     * 4. 楼层号 `floor`
     * 5. 通过选择器获得所有楼中楼回复（可能不存在）
     * 6. 对于每个楼中楼回复，调用 `_ParseSubReply(...)` 分别进行解析
     */
    _ParseMainReply(mainReply) {
        let mainReplyObj = {
            author: "",
            replyTime: "",
            replyContent: "",
            floor: -1,
            subReplies: []
        };
        // 获取用户名
        const authorElement = mainReply.querySelector("a.p_author_name");
        if (!authorElement) {
            throw new Error("无法获取用户名！");
        }
        mainReplyObj.author = authorElement.textContent ?? "N/A"; // 用户名
        // 获取回复内容
        const replyContentElement = mainReply.querySelector("div.d_post_content");
        if (!replyContentElement) {
            throw new Error("无法获取回复内容！");
        }
        mainReplyObj.replyContent = replyContentElement.innerHTML.trim(); // 回复内容
        // 获取回复时间和楼层号
        const replyStatus = mainReply.querySelector("div.core_reply_tail")?.innerHTML;
        if (!replyStatus) {
            throw new Error("无法获取回复状态！");
        }
        const regexpReplyTime = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/;
        const matchReplyTime = replyStatus.match(regexpReplyTime);
        if (!matchReplyTime) {
            throw new Error("无法获取回复时间！");
        }
        mainReplyObj.replyTime = matchReplyTime[0]; // 回复时间
        const regexFloor = /(\d+)楼/g;
        const matchFloor = Array.from(replyStatus.matchAll(regexFloor));
        if (matchFloor.length == 0) {
            throw new Error("无法获取楼层号！");
        }
        mainReplyObj.floor = parseInt(matchFloor[0][1]); // 楼层号
        // console.log(`用户名：${mainReplyObj.author}`);
        // console.log(`回复内容：${mainReplyObj.replyContent}`);
        // console.log(`回复时间：${mainReplyObj.replyTime}`);
        // console.log(`楼层号：${mainReplyObj.floor}`);
        // 解析所有楼中楼回复
        const subReplies = mainReply.querySelectorAll(".lzl_cnt").forEach((subReply) => {
            mainReplyObj.subReplies.push(this._ParseSubReply(subReply));
        });
        // console.log("===");
        return mainReplyObj;
    }
    /**
     * 解析楼中楼回复 `subReply`。
     * 1. 用户名 `author`
     * 2. 回复时间 `replyTime`
     * 3. 回复内容 `replyContent`
     */
    _ParseSubReply(subReply) {
        let subReplyObj = {
            author: "",
            replyTime: "",
            replyContent: ""
        };
        // 获取用户名
        const authorElement = subReply.querySelector("a.j_user_card ");
        if (!authorElement) {
            throw new Error("无法获取楼中楼用户名！");
        }
        subReplyObj.author = authorElement.textContent ?? "N/A"; // 用户名
        // 获取回复时间
        const replyTimeElement = subReply.querySelector("span.lzl_time");
        if (!replyTimeElement) {
            throw new Error("无法获取楼中楼回复时间！");
        }
        subReplyObj.replyTime = replyTimeElement.textContent ?? "N/A"; // 回复时间
        // 获取回复内容
        const replyContentElement = subReply.querySelector("span.lzl_content_main");
        if (!replyContentElement) {
            throw new Error("无法获取楼中楼回复内容！");
        }
        const replyTextRaw = replyContentElement.innerHTML.trim(); // 回复内容
        const regexpRemoveUserLink = /<a [^>]*>(.*?)<\/a>/;
        subReplyObj.replyContent = replyTextRaw.replace(regexpRemoveUserLink, "$1");
        console.log("## 楼中楼 ##");
        console.log(`用户名：${subReplyObj.author}`);
        console.log(`回复内容：${subReplyObj.replyContent}`);
        console.log(`回复时间：${subReplyObj.replyTime}`);
        return subReplyObj;
    }
    /**
     * 模拟滚动屏幕以加载全部内容。
     */
    _SimulateScroll() {
        return new Promise(resolve => {
            window.scrollTo(0, 0);
            const task = setInterval(() => {
                window.scrollBy(0, 100);
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                if (window.scrollY + window.innerHeight >= maxScroll) {
                    // 等待一段时间，确保最后一层楼加载成功
                    setTimeout(() => {
                        clearInterval(task);
                        resolve();
                    }, 100);
                }
            }, 100);
        });
    }
    async _SaveToMarkdown(postObj) {
        const md = this._Markdown;
        md.Header(1, postObj.postInfo.postTitle);
        md.URL(`${this._PostURLPrefix}/${postObj.postInfo.postID}`);
        md.TableHeader(["贴吧", "楼层数", "回复数"]);
        md.TableData([
            postObj.postInfo.postTieba,
            postObj.replies.length.toString(),
            postObj.postInfo.postReplyNum.toString()
        ]);
        md.Header(2, "正文");
        postObj.replies.forEach((mainReply) => {
            md.Header(3, `${mainReply.floor} 楼`);
            md.Text(`**${mainReply.author}** 于 ${mainReply.replyTime}`);
            md.Quote(mainReply.replyContent);
            if (mainReply.subReplies.length > 0) {
                md.Header(4, "楼中楼");
            }
            mainReply.subReplies.forEach((subReply) => {
                md.Separator();
                md.Text(`**${subReply.author}** 于 ${subReply.replyTime}`);
                md.Quote(subReply.replyContent);
            });
        });
        await md.Generate(`${postObj.postInfo.postTitle}`);
    }
}
exports.Parser = Parser;
;


/***/ }),

/***/ 511:
/***/ ((module) => {

module.exports = JSZip;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const Parser_1 = __webpack_require__(118);
(function () {
    'use strict';
    const parser = new Parser_1.Parser();
    GM_registerMenuCommand("重置（出现 BUG 时使用）", () => {
        parser.Reset();
    });
    window.addEventListener("load", () => {
        if (!parser.ContinueParse()) {
            GM_registerMenuCommand("备份当前贴子", () => {
                parser.Parse();
            });
        }
    });
})();

})();

/******/ })()
;