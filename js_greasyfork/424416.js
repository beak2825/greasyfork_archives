// ==UserScript==
// @name         福利部落自动保存
// @namespace    https://dfulibl.net/
// @version      3.1.3
// @description  致敬永远的神小落！
// @author       小落
// @match        https://www.afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.afulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.tokyobl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://www.afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.tokyobl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.ifulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.club/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.bfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.bfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://down.tokyobl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.tokyobl.com/wp-content/plugins/erphpdown/download.php*
// @match        https://afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://afulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.tokyobl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.kasawaa.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.kasawaa.org/wp-content/plugins/erphpdown/download.php*
// @match        https://afulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://ifulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://ifulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.club/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://tokyobl.xyz/wp-content/plugins/erphpdown/download.php*
// @match        https://bfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://bfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://tokyobl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://tokyobl.com/wp-content/plugins/erphpdown/download.php*
// @match        https://cfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://cfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://cfulibl.com/wp-content/plugins/erphpdown/download.php*
// @match        https://www.cfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.cfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.cfulibl.com/wp-content/plugins/erphpdown/download.php*
// @match        https://efulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://efulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.efulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.efulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://gfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://gfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://kfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://kfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://www.gfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.gfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://dfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://dfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.yookaasaa.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.yookaasaa.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.iwatee.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.iwatee.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.kamaasaki.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.kamaasaki.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.yuyookamaa.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.yuyookamaa.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.akita.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.akitaken.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.miyagi.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.miyagi.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.kanagawa.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.kanagawa.org/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.sugiikasi.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.fulibl.sugiikasi.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.dfulibl.org/wp-content/plugins/erphpdown/download.php*
// @match        https://www.dfulibl.net/wp-content/plugins/erphpdown/download.php*
// @match        https://fulibl.kyotoo.org/wp-content/plugins/erphpdown/download.php*
// @match        https://openapi.baidu.com/oauth/2.0/login_success*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @require      https://cdn.staticfile.org/jszip/3.5.0/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/tampermonkey-toastr@1.0.6
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/424416/%E7%A6%8F%E5%88%A9%E9%83%A8%E8%90%BD%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/424416/%E7%A6%8F%E5%88%A9%E9%83%A8%E8%90%BD%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==
let zip = new JSZip();
let max_faile_upload_num = 8;
let UA = "netdisk;"; // 自定义User-Agent
//初始化显示框
let showtextouter = document.createElement("div");
let showtext = document.createElement("div");
showtext.innerHTML = "";
showtextouter.append(showtext);
showtextouter.className = "card-wrap";
showtext.className = "card";
document.body.append(showtextouter);
//页面吐司框
function toast_tip(str) {
    toastr.info(str);
}
//页面模态框
function page_tip(title, text, icon) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "确认",
    });
}
//同步GM_xmlhttpRequest
function sync_xhr(config) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            url: config.url,
            responseType: config.responseType,
            data: config.data,
            headers: config.headers,
            method: config.method,
            onload: function (xhr) {
                resolve(xhr);
            },
        });
    });
}
//等待promise
function wati_time(time = 3000) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}
//下载链接并利用zip解压搜索链接
async function SaveHrelFile(href) {
    toast_tip("已开始寻找路径...");
    let xhr = await sync_xhr({
        url: href,
        method: "GET",
    });
    toast_tip("寻找路径成功，开始分析...");
    if (xhr.response.indexOf("pan.baidu.com") != -1) {
        page_tip("错误", "该文件非百度秒传，请手动处理!", "error");
        return;
    }
    console.log("有罪推定", xhr);
    let finalurl = xhr.response
        .replace("<script type='text/javascript'>window.location='", "")
        .replace("';</script>", "");
    toast_tip("开始下载秒传压缩包");
    xhr = await sync_xhr({
        url: finalurl,
        method: "GET",
        responseType: "arraybuffer",
    });
    toast_tip("下载完成，开始解压分析");
    try {
        let zipfile = await zip.loadAsync(xhr.response);
        let filelist = Object.keys(zipfile.files);
        if (filelist.length != 0) {
            for (let index = 0; index < filelist.length; index++) {
                let data = await zipfile.file(filelist[index]).async("string");
                let baiduurl = FindBaiDuURL(data);
                if (baiduurl == "error" && data.indexOf("Sync链接") === -1) {
                    page_tip("错误", "解析文本失败，请手动处理！", "error");
                }
                ShowHtmlText(data, baiduurl[0]);
                for (let index = 0; index < baiduurl.length; index++) {
                    await SaveBaiduFile(baiduurl[index]);
                    //await wati_time()
                }
            }
        } else {
            page_tip("错误", "解析文件失败或无文件，请手动处理！", "error");
        }
    } catch (err) {
        console.log("err", err);
        page_tip("错误", "下载文件失败，或此非度盘秒传链接，请重试！", "error");
    }
}
//保存百度文件
async function SaveBaiduFile(url) {
    let token = GM_getValue("bdtoken", "");
    if (token == "") {
        //如果不存在token，则刷新Token
        token = await RefreshToken();
        if (token === false) {
            return;
        }
    }
    console.log("获取当前token", token);
    await getLink(url, token);
}
function generateRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}
//原网页函数进行抽离吧
async function getLink(link, token) {
    let bdstoken = "";
    let bdsfield = token;
    if (bdsfield == "") {
        page_tip("错误", "未输入bdstoken，请阅读使用教程", "error");
        return;
    } else if (bdsfield.match(/[0-9a-zA-Z]{32}/) == null) {
        if (bdsfield.includes("-6")) {
            page_tip(
                "错误",
                "未登录百度账号，请登录百度网盘网页版后再次获取",
                "error"
            );
        } else {
            page_tip("错误", "未检测到有效bdstoken，请阅读使用教程", "error");
        }
        return;
    } else {
        bdstoken = bdsfield.match(/[0-9a-zA-Z]{32}/)[0];
        console.log("修改了bsdtoken", bdstoken);
    }

    let bdpan = link.match(/bdpan:\/\/(.+)/);
    let pcs = link.match("BaiduPCS-Go");
    let mengji = link.match(/.{32}#.{32}/);
    let bdlink = link.match("bdlink(.+)");
    let pan = link.match(/^pan:\/\//);

    if (mengji) {
        let input = link;
        let md5 = input.match(/^(.{32})#/)[1];
        let slicemd5 = input.match(/#(.{32})#/)[1];
        let file_length = input.match(/#([0-9]+)#/)[1];
        let file_name = input.match(/#[0-9]+#(.+)$/)[1];
        file_name = Trim(file_name);
        var charCount = md5
            .toLowerCase()
            .split("")
            .filter(function (c) {
                return c >= "a" && c <= "z";
            }).length;
        var maxCombination = 1 << charCount;
        var attempts = [0, maxCombination - 1];
        var gen = 5;
        while (attempts.length < maxCombination && gen > 0) {
            var n = void 0;
            do {
                n = generateRandomInt(maxCombination - 1);
            } while (attempts.includes(n));
            attempts.push(n);
            gen--;
        }

        await saveFile(
            md5,
            slicemd5,
            attempts,
            file_length,
            file_name,
            mengji,
            token,
            link
        );
    } else {
        page_tip("错误", "未检测到有效秒传链接", "error");
    }
}
function convertData(Dataobj) {
    return `&path=%2F${Dataobj.path}&content-length=${Dataobj.contentLength
        }&content-md5=${Dataobj.contentMd5
        }&slice-md5=${Dataobj.sliceMd5.toLowerCase()}&rtype=0`;
}

function transformCase(str, mask) {
    var next = mask;
    return str
        .toLowerCase()
        .split("")
        .map(function (c) {
            if (c >= "a" && c <= "z") {
                if (next % 2 === 1) {
                    c = c.toUpperCase();
                }
                next = next >> 1;
            }
            return c;
        })
        .join("");
}

async function preCreateFile(config) {
    const { name, md5, slicemd5, attempts, token, length, retry } = config;
    let contentMd5 =
        retry === 0 ? md5 : transformCase(md5.toLowerCase(), attempts[retry]);
    //// rtype=3覆盖文件, rtype=0则返回报错, 不覆盖文件, 默认为rtype=1(自动重命名)
    const authToken = document.querySelector('.authToken').value
    const url = `https://pan.baidu.com/rest/2.0/xpan/file?method=create&access_token=${authToken}&bdstoken=` + token
    debugger
    let xhr = await sync_xhr({
        url: url,
        method: "POST",
        data: `&block_list=%5B%22${contentMd5}%22%5D&path=%2F${name}&size=${length}&isdir=0&rtype=0`,
    });
    xhr = JSON.parse(xhr.response);
    return xhr;
}
//保存百度函数
async function saveFile(
    md5,
    slicemd5,
    attempts,
    length,
    name,
    method,
    token,
    url,
    randomobfs = false,
    retry = 0
) {
    let json = await preCreateFile({
        name,
        md5,
        attempts,
        slicemd5,
        token,
        length,
        retry,
    });
    if (json.errno === 0) {
        page_tip("成功", "保存" + name + "文件成功！", "success");
    } else if (json.errno === -6) {
        page_tip("错误", "保存文件失败！,百度账号未登录", "error");
        GM_setValue("bdtoken", "");
    } else if (json.errno === -8) {
        toast_tip(name + "存在同名文件");
    } else if (json.errno === 2) {
        GM_setValue("bdtoken", "");
        //如果不存在token，则刷新Token
        if(retry===0){
        let token = await RefreshToken();
        if (token === false) {
            return;
        }
        }
        if (retry < max_faile_upload_num) {
            saveFile(
                md5,
                slicemd5,
                attempts,
                length,
                name,
                method,
                token,
                url,
                randomobfs,
                retry + 1
            );
        }
    } else {
        if (json.errno === 404) {
            if (retry < max_faile_upload_num) {
                await saveFile(
                    md5,
                    slicemd5,
                    attempts,
                    length,
                    name,
                    method,
                    token,
                    url,
                    true,
                    retry + 1
                );
            } else {
                page_tip("错误", "错误码404，obfs启动无效", "error");
            }
        } else {
            page_tip("错误", "保存文件失败！，好可惜！错误码" + json.errno, "error");
        }
    }
}
//随机字符串
function randomstring(text, status) {
    if (status === false) {
        return text;
    }
    const tempString = [];
    for (let i of text) {
        if (!Math.round(Math.random())) {
            tempString.push(i.toLowerCase());
        } else {
            tempString.push(i.toUpperCase());
        }
    }
    return tempString.join("");
}
//编码函数
function atou(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
//trim函数
function Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
//刷新Token
async function RefreshToken() {
    toast_tip("正在解析百度Token");
    let xhr = await sync_xhr({
        url: "https://pan.baidu.com/api/gettemplatevariable?fields=[%22bdstoken%22]",
        method: "GET",
    });
    let json = JSON.parse(xhr.responseText);
    if (json.errno === 0) {
        toast_tip("解析百度Token成功");
        GM_setValue("bdtoken", json.result.bdstoken);
        return json.result.bdstoken;
    } else if (json.errno === -6) {
        page_tip("错误", "保存文件失败！,百度账号未登录", "error");
        GM_setValue("bdtoken", "");
    } else {
        page_tip(
            "错误",
            "刷新百度token失败，请检查是否登陆百度账户！错误码:" + json.errno,
            "error"
        );
    }
    return false;
}
//将提取到的zip内的txt文件显示到页面中
function ShowHtmlText(url, name) {
    if (showtext.innerHTML.indexOf(name) == -1) {
        let textlist = url.split(/[\s\n]/);
        for (let index = 0; index < textlist.length; index++) {
            let temp = textlist[index];
            if (temp != "") {
                let item = document.createElement("div");
                item.innerHTML = temp;
                showtext.className = "btn-class card";
                showtext.append(item);
            }
        }
    }
}
//寻找百度URL链接
function FindBaiDuURL(text) {
    let textlist = text.split(/[\s\n]/);
    let retlist = [];
    for (let index = 0; index < textlist.length; index++) {
        let temp = textlist[index];
        if (temp != "") {
            if (temp.indexOf("#") != -1) {
                let listnum = temp.split("#").length;
                console.log("listnum", listnum);
                if (listnum == 4) {
                    retlist.push(temp);
                }
            }
        }
    }
    if (retlist.length != 0) {
        return retlist;
    }
    return "error";
}
function main() {
    const hrefBlockList = document.querySelectorAll(".msg p");
    const btnDomList = [];
    if (hrefBlockList.length > 0) {
        btnDomList.push(hrefBlockList[0]);
    }
    btnDomList.forEach((domItem) => {
        let div = document.createElement("div");
        div.innerHTML = '<button class="btn-class btnhover-class">一键保存</button>';
        div.onclick = async function (event) {
            if (document.querySelector('.authToken').value === "") {
                alert('无授权码！')
                return
            }
            toast_tip("开始运行，请勿重复点击！");
            let lista = domItem.querySelectorAll("a");
            let num = 0;
            for (let index = 0; index < lista.length; index++) {
                num++;
                await SaveHrelFile(lista[index].href);
            }
        };
        domItem.append(div);
    });
    const tilte = document.querySelector('.title')
    let div = document.createElement("div");
    div.innerHTML = '<input class="authToken" style="margin-right:5px"></input><a href="https://openapi.baidu.com/oauth/2.0/authorize?response_type=token&amp;client_id=L6g70tBRRIXLsY0Z3HwKqlRE&amp;redirect_uri=oob&amp;scope=netdisk" class="swal2-styled" id="mzf-accesstoken-acquire" rel="noreferrer" target="_blank">获取授权码</a>';
    tilte.append(div);
    toast_tip("脚本注入成功!");
    //插入美化css
    GM_addStyle(
        ".btn-class {color: #409eff;background-color: rgb(236, 245, 255);border-color: #b3d8ff;border-style: solid;border-width: 1px;padding: 4.9px 8.5px;border-radius: 4.3px;cursor: pointer;}.btnhover-class:hover{background: #409eff;border-color: #409eff;color: #fff;}.card-wrap{display: flex;justify-content: center;}.card{padding: 10.9px;line-height: 22px;cursor: auto;}"
    );
}

function getAuthToken() {
    if (document.location.pathname === "/oauth/2.0/login_success") {
        var match = document.location.hash.match(/&access_token=([^ =&]+)&/);
        if (match) {
            GM_setValue("saveAuthToken", match[1]);
        }

    } else {
        main()
        var listenerId = GM_addValueChangeListener("saveAuthToken", function (key, oldValue, newValue, remote) {
            GM_removeValueChangeListener(listenerId)
            GM_deleteValue("saveAuthToken")
            document.querySelector('.authToken').value = newValue
        });
    }
}
getAuthToken()




