// ==UserScript==
// @name         Baiduing
// @namespace    Starry
// @version      2.0.1
// @description  替换百度搜索首页背景为微软必应每日壁纸
// @homepage     https://greasyfork.org/zh-CN/scripts/371549-baiduing
// @author       Starry
// @license      MIT License
// @grant        GM_xmlhttpRequest
// @connect      cn.bing.com
// @include      *://www.baidu.com/
// @include      *://www.baidu.com/home*
// @include      *://www.baidu.com/?tn=*
// @include      *://www.baidu.com/index.php*
// @downloadURL https://update.greasyfork.org/scripts/371549/Baiduing.user.js
// @updateURL https://update.greasyfork.org/scripts/371549/Baiduing.meta.js
// ==/UserScript==

//获取bing壁纸
GM_xmlhttpRequest({
    method: 'GET',
    url: "https://cn.bing.com/HPImageArchive.aspx?format=js&n=1&mkt=zh-CN",
    onload: function (result) {
        try {
            let jsonData = JSON.parse(result.responseText);
            let imgUrl = "https://cn.bing.com" + jsonData.images[0].url;
            let imgUrlUHD = imgUrl.replace("1920x1080", "UHD");
            setWallpaper(imgUrl);
            let copyrightLink = jsonData.images[0].copyrightlink;
            let baiduLink = "https://www.baidu.com/s?wd=" + copyrightLink.slice(30, copyrightLink.indexOf("&"));
            addBingCopyright("© " + jsonData.images[0].copyright, baiduLink);
            if (window.screen.width > 1920 && imgUrlValid(imgUrlUHD)) {
                setWallpaper(imgUrlUHD);
            }
        } catch (e) {
            console.log(e);
        }
    }
});

async function imgUrlValid(imgUrl) {
    try {
        return new Promise(function (resolve, reject) {
            let ImgObj = new Image(); //判断图片是否存在
            ImgObj.src = imgurl;
            ImgObj.onload = function (res) {
                resolve(res);
            };
            ImgObj.onerror = function (err) {
                reject(err);
            };
        });
    } catch (e) { }
}

function setWallpaper(imgUrl) {
    if (document.getElementsByClassName("s-skin-container s-isindex-wrap")[0]) {
        document.getElementsByClassName("s-skin-container s-isindex-wrap")[0].style.backgroundImage = "url(" + imgUrl + ")";
    }
    else { // 未登录状态
        let wallpaperDiv = document.createElement("div");
        wallpaperDiv.className = "s-skin-container s-isindex-wrap";
        wallpaperDiv.style.backgroundImage = "url(" + imgUrl + ")";
        wallpaperDiv.style.position = "fixed";
        wallpaperDiv.style.top = "0";
        wallpaperDiv.style.left = "0";
        wallpaperDiv.style.height = "100%";
        wallpaperDiv.style.width = "100%";
        wallpaperDiv.style.minWidth = "1000px";
        wallpaperDiv.style.zIndex = "-10";
        wallpaperDiv.style.backgroundPosition = "center";
        wallpaperDiv.style.backgroundRepeat = "no-repeat";
        wallpaperDiv.style.backgroundSize = "cover";
        wallpaperDiv.style.webkitBackgroundSize = "cover";
        wallpaperDiv.style.zoom = "1";
        wallpaperDiv.cssText = "-webkit-background-size:cover;zoom:1"
        document.getElementById("wrapper").appendChild(wallpaperDiv);
    }
}

// 右下角添加bing图片信息
function addBingCopyright(copyrightText, baiduLink) {
    let bingCopyright = document.createElement("a");
    bingCopyright.innerText = copyrightText;
    bingCopyright.href = baiduLink;
    bingCopyright.target = "_black"
    bingCopyright.className = "1h";
    bingCopyright.style.color = "rgba(255,255,255,0.9)";
    bingCopyright.style.marginRight = "20px";
    document.getElementById("s-bottom-layer-right").appendChild(bingCopyright);
}

// 百度热榜(未登录时)
if (document.getElementById("s-hotsearch-wrapper")) {
    document.getElementsByClassName("title-text c-font-medium c-color-t")[0].style.color = "rgb(255,255,255)";
    document.getElementsByClassName("title-text c-font-medium c-color-t")[0].style.textShadow = "1px 1px 2px #000000";
    let hotsearch = document.getElementsByClassName("title-content c-link c-font-medium c-line-clamp1");
    for (let i = 0; i < hotsearch.length; i++) {
        hotsearch[i].style.color = "rgb(255,255,255)";
        hotsearch[i].style.textShadow = "1px 1px 2px #000000";
    }
}

// 顶部banner
if (document.getElementById("s_top_wrap")) {
    document.getElementById("s_top_wrap").style.background = "rgba(0,0,0,0.3)";
    let topBannerText = document.getElementsByClassName("c-font-normal c-color-t");
    for (let i = 0; i < topBannerText.length; i++) {
        // 跳过 7 - 15 (更多弹出框)
        if (i == 7) {
            i = 15;
        }
        topBannerText[i].style.color = "rgba(255,255,255,0.9)";
    }
}

// 底部banner
if (document.getElementById("bottom_layer")) {
    document.getElementById("bottom_layer").style.background = "rgba(0,0,0,0.3)";
    let bottomBannerTextLeft = document.getElementsByClassName("c-color-gray2");
    for (let i = 0; i < bottomBannerTextLeft.length; i++) {
        bottomBannerTextLeft[i].style.color = "rgba(255,255,255,0.9)";
    }
    let bottomBannerTextRight = document.getElementsByClassName("lh");
    for (let i = 0; i < bottomBannerTextRight.length; i++) {
        if (i > 6) {
            bottomBannerTextRight[i].style.display = "none";
        }
        else {
            bottomBannerTextRight[i].style.color = "rgba(255,255,255,0.9)";
        }
    }
}