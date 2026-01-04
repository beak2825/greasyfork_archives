// ==UserScript==
// @name         哔哩哔哩去除 6 分钟限制及 APP 下载
// @namespace    http://tampermonkey.net/
// @version      0.7.6
// @description  去除手机版 6 分钟限制，添加网页跳转
// @author       sl00p
// @match        https://m.bilibili.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/369746/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%206%20%E5%88%86%E9%92%9F%E9%99%90%E5%88%B6%E5%8F%8A%20APP%20%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/369746/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%206%20%E5%88%86%E9%92%9F%E9%99%90%E5%88%B6%E5%8F%8A%20APP%20%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function httpReq(url, callBack) {
        let xHttp = new XMLHttpRequest();
        xHttp.onreadystatechange = function () {
            if(this.readyState === 4 && this.status === 200) {
                callBack(xHttp.responseText);
            }
        };
        xHttp.open("Get", url, true);
        xHttp.send();
    }

    // inject wechat cookie
    (function injectCookie() {
        if(window.localStorage && window.localStorage.getItem("window.bsource") !== "wechat") {
            window.localStorage.setItem("window.bsource", "wechat");
        }
        if(document.cookie.indexOf("wechat") === -1) {
            document.cookie = "bsource=wechat";
        }
    })();

    let lastRelateUrl = "";
    let relateVideoInterVal;
    let ownerInterval;
    let relateEndVideoInterval;

    setInterval(function () {
        let relateUrl = "";
        let url = document.location.href.split("/");
        let vid = url[url.length - 1];
        if(vid.length <= 0) {
            return
        }
        if (url.indexOf("video") !== -1) {
            if(vid.indexOf("av") !== -1) {
                relateUrl = "https://api.bilibili.com/x/web-interface/archive/related?from=h5&aid=" + /\d+/g.exec(vid)[0] + "&context=";
            } else {
                relateUrl = "https://api.bilibili.com/x/web-interface/archive/related?bvid=" + vid;
            }
        } else if (url.indexOf("space") !== -1) {
            let mid = vid.split("?")[0];
            relateUrl = "https://api.bilibili.com/x/space/arc/search?pn=1&ps=100&order=click&keyword=&mid=" + mid;
        } else {
            return
        }
        if(relateUrl.length > 0 && relateUrl !== lastRelateUrl) {
            // parse relate video
            lastRelateUrl = relateUrl;
            clearInterval(relateVideoInterVal);
            clearInterval(ownerInterval);
            clearInterval(relateEndVideoInterval);
            httpReq(relateUrl, function (res) {
                let data = JSON.parse(res).data;
                // parse relate video path
                relateVideoInterVal = setInterval(function() {
                    let nodes = document.getElementsByClassName("v-card-toapp");
                    if (nodes !== undefined) {
                        for(let i = 0; i < nodes.length; ++i) {
                            for(let j = 0; j < data.length; ++j) {
                                let ownerNameApp = nodes[i].getElementsByClassName('open-app');
                                let title = nodes[i].getElementsByClassName('title');
                                if(title[0].textContent === data[j].title) {
                                    if(ownerNameApp && ownerNameApp.length > 0) {
                                        ownerNameApp[0].innerText = data[j].owner.name;
                                    }
                                    title[0].innerHTML="<p><a href=\""
                                        + data[j].bvid + "\" style=\"color:blue\">" + data[j].title + "</a></p>";
                                    if (nodes[i] && nodes[i].length > 0) {
                                        nodes[i].onclick = function() { return false };
                                    }
                                }
                            }
                        }
                    }
                }, 500);
                // parse owner name and remove app download tip
                ownerInterval = setInterval(function() {
                    let nodeList = ["m-video2-openapp-img", "open-app-btn m-nav-openapp", "open-app-btn m-float-openapp", "open-app-btn related-openapp",
                                    "open-app-btn home-float-openapp", "open-app-btn m-nav-openapp", "launch-app-btn m-nav-openapp",
                                    "m-video2-main-img", "launch-app-btn m-float-openapp", "launch-app-btn m-float-openapp",
                                    "launch-app-btn related-openapp", "player-mobile-control-dot", "player-mobile-widescreen-callapp"];
                    for(let i = 0; i < nodeList.length; ++i) {
                        if(document.getElementsByClassName(nodeList[i]).length > 0) {
                            document.getElementsByClassName(nodeList[i])[0].remove();
                        }
                    }
                }, 500);
                // parse end relate video
                relateEndVideoInterval = setInterval(function() {
                    let relateVideo = document.getElementsByClassName("player-mobile-ending-panel-title");
                    let app = document.getElementsByClassName("player-mobile-ending-panel-button");
                    if(relateVideo !== undefined && relateVideo.length > 0) {
                        for(let i = 0; i < data.length; ++i) {
                            if(relateVideo[0].textContent === data[i].title) {
                                relateVideo[0].innerHTML="<p><a href=\"" + data[i].bvid + "\" style=\"color:blue\">" + data[i].title + "</a></p>";
                                if(app !== undefined && app.length > 0) {
                                    app[0].innerText = data[i].owner.name;
                                }
                            }
                        }
                    }
                }, 500);
            })
            // parse series video
            setTimeout(function() {
                let seriesVideo = document.getElementsByClassName('video-card');
                for(let idx = 0; idx < seriesVideo.length; idx++) {
                    setTimeout(function(svideo) {
                        let sVideoInnerText = svideo.getElementsByClassName('title')[0].innerText;
                        let reg = /^\w\d+[-]*/;
                        let iText = sVideoInnerText.replace(reg, '');
                        let url = "https://api.bilibili.com/x/web-interface/search/all/v2?keyword=" + encodeURIComponent(iText) + "&page=1&pagesize=20";
                        httpReq(url, function(res) {
                            let data = JSON.parse(res).data;
                            // parse series video path
                            for(let jdx = 0; jdx < data.result.length; jdx++) {
                                let video = data.result[jdx];
                                if(video && video.result_type === "video" && video.data.length > 0) {
                                    let title = svideo.getElementsByClassName("title");
                                    let app = svideo.getElementsByClassName("open-app");
                                    if(title && title.length > 0) {
                                        title[0].innerHTML = "<p><a href=\"" + video.data[0].bvid + "\" style=\"color:blue\">" + iText + "</a></p>";
                                    }
                                    if(app && app.length > 0) {
                                        app[0].innerText = video.data[0].author;
                                    }
                                }
                            }
                        });
                    }, 1000 * idx, seriesVideo[idx]);
                }
            }, 1000);
        }
    }, 500);
})();