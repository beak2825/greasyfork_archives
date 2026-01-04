// ==UserScript==
// @name         下载L4D2创意工坊文件
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Download L4D2 workshop file.
// @author       TEAEGGY
// @match        https://steamcommunity.com/sharedfiles/filedetails/*
// @match        https://steamcommunity.com/workshop/filedetails/*
// @connect      steamworkshop.download
// @icon         https://media.st.dl.eccdnx.com/steamcommunity/public/images/apps/550/7d5a243f9500d2f8467312822f8af2a2928777ed.jpg
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/482296/%E4%B8%8B%E8%BD%BDL4D2%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/482296/%E4%B8%8B%E8%BD%BDL4D2%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const is550 = document.querySelector("div.apphub_HomeHeaderContent > div.apphub_HeaderTop.workshop > div.apphub_OtherSiteInfo.responsive_hidden > a").href.substring(35, 39);
    if (is550 != "550?") {
        return;
    }
    
    //设置标签模式开启与关闭
    function setTagCond() {
        GM_unregisterMenuCommand(tagMod);
        GM_getValue("tagCond") === "❌" ? GM_setValue("tagCond", "✅") : GM_setValue("tagCond", "❌");
        if (GM_getValue("tagCond") === "❌") {
            alert("❌标签模式已关闭❌");
        }
        else {
            alert("✅标签模式已开启✅");
        }
        
        tagMod = GM_registerMenuCommand(GM_getValue("tagCond", "❌") + "标签模式", setTagCond);
    }

    //格式化标签
    function formatTags(tags) {
        const tagsArry = tags.trim().split(/\s+/);
        const formattedArray = tagsArry.map((tag) => {
            return "【" + tag + "】";
        });
        const tagStr = formattedArray.join("");
        return tagStr;
    }

    //获取URL请求参数
    function getQueryString(url_string, name) {
        const url = new URL(url_string);
        return url.searchParams.get(name);
    }

    //获取下载信息
    function getDownloadInfo(url_string) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method:"GET",
                url:"http://steamworkshop.download/download/view/" + getQueryString(url_string, 'id'),
                onload:(e) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(e.response, 'text/html');
                    const download_name = doc.querySelector('#wrapper > div.width2 > div > table > tbody > tr > td > b > a').innerHTML.substring(10);
                    const download_link = doc.querySelector('#wrapper > div.width2 > div > table > tbody > tr > td > b > a').href;
                    resolve({
                        name:download_name,
                        link:download_link
                    });
                }
            })
        });
    }

    //创建按钮
    function createBtn(dom) {
        const container = document.createElement('div');
        const download = document.createElement('button');
        const cancel = document.createElement('button');
        dom === document.body ? container.className = "topbox" : container.className = "itembox";
 
        download.className = "button download_off";
        download.innerHTML = "wait...";
 
        cancel.className = "button";
        cancel.className = "button cancel_off";
        cancel.innerHTML = "X";
        dom.append(container);
        container.appendChild(download);
        container.appendChild(cancel);
        return {
            download:download,
            cancel:cancel
        }
    }

    //核心下载函数
    function downloadEvent(btn, downloadInfo) {
        btn.download.className = "button download_on";
        btn.download.innerHTML = "download";
 
        btn.download.addEventListener('click', () => {
            let tagStr = "";
            if (GM_getValue("tagCond") === "✅") {
                const tags = prompt("请输入标签，多个标签用空格隔开\n举个栗子\n原文件名：zoey.vpk\n输入标签：佐伊 人物\n下载后文件名为：【佐伊】【人物】zoey.vpk");
                tagStr = formatTags(tags);
            }
            const warnExit = (e) => {
                e.preventDefault();
            }
            window.addEventListener('beforeunload', warnExit);
            btn.download.innerHTML = "downloading...";
            btn.download.className = "button download_off";
            var dw = GM_download({
                url: downloadInfo.link,
                name: tagStr + downloadInfo.name + ".vpk",
                saveAs: false,
                onerror: (info) => {
                    if (info.error === "not_whitelisted") {
                        alert("请在Tampermonkey®设置页面添加'.vpk'的白名单！\n（ 可前往脚本发布页查看教程 ）");
                        btn.cancel.className = "button cancel_off";
                    }
                    else if (info.error === "aborted") {
                        alert("下载已取消");
                        btn.cancel.className = "button cancel_off";
                    }
                    else {
                        alert(info.error);
                        btn.cancel.className = "button cancel_off";
                    }
                    btn.download.innerHTML = "reload";
                    btn.download.className = "button download_on";
                },
                onprogress: (details) => {
                    btn.download.innerHTML = (details.loaded / details.total * 100).toFixed(2) + "%";
                },
                ontimeout: () => {
                    alert("下载超时，请重新尝试！");
                },
                onload: () => {
                    btn.download.innerHTML = "reload";
                    btn.download.className = "button download_on";
                    btn.cancel.className = "button cancel_off";

                    window.removeEventListener('beforeunload', warnExit);
                }
            });
            window.addEventListener('unload', () => {
                dw.abort();
            });

            btn.cancel.className = "button cancel_on";
            btn.cancel.addEventListener('click', () => {
                dw.abort();
                window.removeEventListener('beforeunload', warnExit);
            });
        })
    }

    //mod页面主函数
    async function main() {
        const btn = createBtn(document.body);
        const downloadInfo = await getDownloadInfo(window.location.href);
        downloadEvent(btn, downloadInfo);
    }

    //集合页面主函数
    async function collection_main() {
        const items = document.querySelectorAll('.collectionItem');
        items.forEach(async (e) => {
            const btn = createBtn(e);
            const downloadInfo = await getDownloadInfo(e.querySelector('.collectionItemDetails > a').href);
            downloadEvent(btn, downloadInfo);
        })
    }

    let tagMod = GM_registerMenuCommand(GM_getValue("tagCond", "❌") + "标签模式", setTagCond);
    const btnStyle = `
        .topbox { display: flex;flex-direction: row;justify-content: space-between;align-items: center;position: fixed;z-index: 9999;top: 30px;right: 10px; }
        .itembox { display: flex;flex-direction: row;justify-content: center;align-items: center;margin: 10px;writing-mode: horizontal-tb; }
        .button { padding: 10px 20px;border: none;text-align: center;text-decoration: none;color: white;font-size: 16px;cursor: pointer; }
        .button:hover { transform: scale(1.05); }
        .button:active { transform: scale(0.95); }
        .download_on { background: #718e05;pointer-events: auto; }
        .download_off { background: #1f3043;pointer-events: none; }
        .cancel_on { background: #c73809;pointer-events: auto; }
        .cancel_off { background: #16212e;pointer-events: none; }
    `
    GM_addStyle(btnStyle);

    const isCollection = document.querySelector('.collectionChildren');
    if (isCollection) {
        collection_main();
    }
    else {
        main();
    }

})();