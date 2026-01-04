// ==UserScript==
// @name         写真的保存
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  不知道说什么...
// @license MIT
// @author       kOda
// @match        https://everia.club/*
// @match        https://everiaeveria.b-cdn.net/*
// @match        https://www.everiaclub.com/*
// @require       https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=everia.club
// @grant GM_xmlhttpRequest
// @grant GM_addElement
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477829/%E5%86%99%E7%9C%9F%E7%9A%84%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/477829/%E5%86%99%E7%9C%9F%E7%9A%84%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

// 将请求到的子页面转化成DOM对象，在DOM对象上进行操作。

'use strict';

// 时间单位 毫秒
// 延时尽量别整太低，限制访问就不好了
const CONFIG = {
    // 单图片保存后延时
    photoWait: 300,
    // 单写真页保存后延时
    pageWait: 3000,
    // 写真页的文件夹名是否简化
    cleanDirName: true,
    // 简单图片文件名
    simplePhotoName: false,
};

$(unsafeWindow.document).ready(function() {
    CONFIG.iseveriaclub = unsafeWindow.location.host == "www.everiaclub.com";

    var downBtn = document.createElement("button");
    var multiSaver = new MultiPhotoSaver(unsafeWindow.document);

    downBtn.style = `   display: block;
                        position: fixed;
                        left: 10%;
                        bottom: 15%;
                        text-align: center;
                        width: 10%;
                        height: 4%;      `;
    multiSaver.document.body.appendChild(downBtn);

    // 检测当前页面为写真页或主页。
    if (CONFIG.isSenntakuPeeji) {
        downBtn.innerText = "下载本页全部写真";
        downBtn.addEventListener("click", () => {
            multiSaver.downStart().then(() => {
                console.log("本页已下载完毕！(●ˇ∀ˇ●)");
                downBtn.innerText = "已全部下载完成"
            })
            downBtn.disabled = true;
        })
    } else {
        downBtn.innerText = "下载至本地"
        downBtn.addEventListener("click", (e) => {
            unsafeWindow.showDirectoryPicker({mode: "readwrite"}).then((value) => {
                // 油猴处于沙盒时（无// @grant none）使用unsafeWindow访问网页
                new PhotoSaver(unsafeWindow.document, value).pageSave().then(() => {
                    console.log(unsafeWindow.document.title + " 下载成功。");
                    downBtn.innerText = "已全部下载完成";
                    downBtn.disabled = true;
                })
            })
        })
    }
})

// 用于保存单页写真
class PhotoSaver {
    constructor(newDoc, relativeDir) {
        this.window = unsafeWindow;
        this.document = newDoc;
        this.topDir = relativeDir;
        this.index = 0;
        this.srcAttr = "";
        this.title = "";
        this.retryList = [];
        this.imgs = [];

        this.init();
    }

    init() {
        // https://everia.club/*
        // https://everiaeveria.b-cdn.net/*
        // 这两个网站写真页的有多个不同的网页结构，大概是更新了却没有把旧的去除。
        let selectors = ["body > div:nth-child(5) > div.mainleft > img", "#content > article > div.entry-content.clr > figure > figure > img", "#content > article > div.entry-content.clr > div > a > img"]

        // 标题，用于文件夹名.
        this.title = this.document.title;
        this.srcAttr = CONFIG.iseveriaclub ? "data-original" : "data-src";

        if (CONFIG.cleanDirName) {
            this.title = CONFIG.iseveriaclub ? this.title.split(", ").pop().split("-Everia club")[0] :
                                                this.title.split(", ").pop().split(" \u2013 EVERIA.CLUB")[0]
        }

        for (let i = 0; i < selectors.length; i++) {
            this.imgs = this.document.querySelectorAll(selectors[i]);
            if (this.imgs.length) {
                if (!CONFIG.iseveriaclub) {
                    // 2023 10月左右，部分页面除src外没有其它属性存储url。
                    this.imgs[0].getAttribute(this.srcAttr) ? 0 :
                        this.srcAttr = "src";
                }
                break;
            }
        }
    }

    isExist() {
        return new Promise(function(exist, noexist) {
            this.topDir.getDirectoryHandle(this.title).then(() => noexist(this.title)).catch(() => exist(this));
        }.bind(this))
    }

    getFileName(response, base) {
        // 这里用png只是随便选的，没什么深意。
        var temp = `${base}.png`;

        if (!CONFIG.simplePhotoName) {
            // 这个网站的文件名妹法从url上获取，但在返回头有着原文件名。
            if (response.finalUrl.includes("blogger.googleusercontent.com")) temp = response.responseHeaders.split("filename=\"").pop().split("\"")[0];
            else temp = decodeURIComponent(decodeURIComponent(response.finalUrl.split("/").pop()));
        }

        return temp;
    }

    pageSave() {
        return new Promise(function(saveSuccess, saveFail) {
            this.topDir.getDirectoryHandle(this.title, {create: true})
                .then(function(saveDir) {
                    var timer = 0;
                    var currentList = [];
                    this.retryList.push(saveDir);

                    var temp2 = function() {
                        if (this.index == this.imgs.length) {
                            clearTimeout(timer);

                            this.retryList.push(currentList);
                            this.saveRetry(saveSuccess, saveFail);

                            return;
                        }

                        var url = this.imgs[this.index].getAttribute(this.srcAttr)
                        this.photoSave(url, this.index, saveDir).then(() => {
                            timer = setTimeout(temp2, CONFIG.photoWait)
                        }).catch(function(e) {
                            console.error(e)

                            currentList.push([url, this.index])
                            timer = setTimeout(temp2, 1)
                        }.bind(this)).finally(() => this.index++)
                    }.bind(this)

                    temp2();
                }.bind(this), (e) => saveFail(e));
        }.bind(this))
    }

    saveRetry(retrySuccess, retryFail) {
        // 目前只处理因网络波动而造成下载失败的图片
        if (this.retryList[1].length) {
            var tryCount = 0;
            var index = 0;
            var timer = 0;

            console.log(`开始重新下载：`)
            console.log(this.retryList);

            var temp3 = function () {
                if (index == this.retryList[1].length) {
                    console.log(`重下完成，大成功！`)
                    clearTimeout(timer);
                    retrySuccess();
                    return
                }

                var args = this.retryList[1][index];
                this.photoSave(args[0], args[1], this.retryList[0]).then(() => {
                    tryCount = 0;
                    console.log(`${args[0]} 重下成功！`)
                    timer = setTimeout(temp3, CONFIG.photoWait)
                }).catch((error) => {
                    if (tryCount++ > 2) {
                        tryCount = 0;
                        console.log(`${args[0]} \n 编号为：${args[1]} \n重下失败.... 建议自行下载。`)
                        timer = setTimeout(temp3, 1);
                    }

                    index--;
                    timer = setTimeout(temp3, CONFIG.photoWait);
                }).finally(() => index++)
            }.bind(this)

            temp3();
        } else {
            retrySuccess();
        }
    }

    photoSave(url, index, saveDir) {
        return new Promise(function(resolve, reject) {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                timeout: 5000,
                ontimeout: (e) => reject(new Error("Timeout!")),
                onload: function(response) {
                    var name = this.getFileName(response, String(index))

                    saveDir.getFileHandle(name, {create: true})
                    .then((value) => {
                        return value.createWritable()})
                    .then((writer) => {
                        console.log(`保存图片：${name}`)
                        writer.write({
                            type: "write",
                            data: response.response
                        })
                        writer.close().then(function() {
                            resolve()
                        });
                    }).catch((e) => reject(e))
                }.bind(this)
            });
        }.bind(this))
    }
}

class MultiPhotoSaver {
    constructor(newDoc) {
        this.document = newDoc;
        this.existedDirs = [];
        this.photoSelector = "";
        this.photoLinks = [];

        this.init();
    }

    // initialization
    init() {
        // 指向写真页的a标签的选择器
        // https://www.everiaclub.com： .leftp  a(search、tags)
        // https://everia.club/          .search-entry-inner .thumbnail-link(search) .blog-entry-inner div > a（tags）
        // https://everiaeveria.b-cdn.net

        // 就两三个选择器，懒得再去做什么判断了
        if (!CONFIG.iseveriaclub) {
            let t1 = this.document.querySelectorAll(".search-entry-inner .thumbnail-link");
            let t2 = this.document.querySelectorAll(".blog-entry-inner div > a");

            t1.length ? this.photoLinks = t1 : this.photoLinks = t2;
        } else {
            this.photoLinks = this.document.querySelectorAll(".leftp > a");
        }

        this.photoLinks.length ? CONFIG.isSenntakuPeeji = true : 0;
    }

    downStart() {
        return new Promise(function(resolve, reject) {
            unsafeWindow.showDirectoryPicker({mode: "readwrite"}).then(function(picker) {
                var index = 0;
                var retryCount = 0;
                var timer = 0;

                var saverHand = function (photoDoc) {
                    new PhotoSaver(photoDoc, picker).isExist().then((saver) => {saver.pageSave()
                        .then(() => {
                            console.log(photoDoc.title + " 下载成功。");
                            timer = setTimeout(temp1, CONFIG.pageWait);
                        }, (error) => {
                            console.log(photoDoc.title + " 下载失败了");
                            console.error(error)
                        })
                    }, function(fileName) {
                        console.log(`${fileName} 已存在`)
                        this.existedDirs.push(fileName);
                        timer = setTimeout(temp1, 1);
                    }.bind(this));
                }.bind(this)

                // 为避免ip封禁
                // 使用该函数进行请求延时处理。
                var temp1 = function () {
                    if (index == this.photoLinks.length) {
                        if (this.existedDirs.length) {
                            console.log("以下写真已存在，如需下载，请先删除同名文件夹...")
                            console.log(this.existedDirs)
                        }

                        resolve();
                        clearTimeout(timer);
                        return;
                    }

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: this.photoLinks[index++].href,
                        timeout: 5000,
                        ontimeout: function(error) {
                            if (retryCount++ > 2) {
                                console.log("重试失败...")
                                console.log("IP可能被限制")
                                console.log("请您在一段时间重试。")
                            }
                            console.log("请求文件超时，自动重试...");
                            temp1();
                        },
                        onload: function(response) {
                            retryCount = 0;
                            saverHand(new DOMParser().parseFromString(response.response, "text/html"));
                        }
                    });
                }.bind(this)

                temp1();
            }.bind(this));
        }.bind(this))
    }
}
