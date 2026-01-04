// ==UserScript==
// @name 把Google搜索伪装成百度搜索
// @namespace Disguise_Google_as_Baidu
// @version 2022.12.04.1
// @description 用Google搜索,很多人看到屏幕后会问你怎么上Google的.所以当我们把Google的logo换成百度,他们就不会问那么多问题了!
// @author BigKiller
// @license MIT
// @match *://*.google.*/
// @match *://*.google.*/search*
// @match *://*.google.co.jp/
// @match *://*.google.co.jp/search*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/440916/%E6%8A%8AGoogle%E6%90%9C%E7%B4%A2%E4%BC%AA%E8%A3%85%E6%88%90%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/440916/%E6%8A%8AGoogle%E6%90%9C%E7%B4%A2%E4%BC%AA%E8%A3%85%E6%88%90%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
//


(function() {
    //伪装favicon
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '//sm.bdimg.com/static/wiseindex/img/favicon64.ico';
    document.getElementsByTagName('head')[0].appendChild(link);

    //搜索页
    if (window.location.href.indexOf("/search") > -1) {
        //伪装搜索结果页面logo
        let logo = document.getElementById("logo");
        let userIco = document.getElementById("gb");
        if (userIco != null) {
            userIco.classList.remove("gb_Zd");
        }
        var logoArr;
        let modOuter = false;
        let modImgSrc = false;
        //应对样式的变更,尝试用不同方式获取logo
        if (logo === null) {
            logoArr = document.querySelectorAll("div.logo img");
            if (logoArr.length > 0) {
                logo = logoArr[0];
                modImgSrc = true;
            }
        }
        if (logo === null) {
            logoArr = document.getElementsByClassName("logo");
            if (logoArr.length > 0){
                logo = logoArr[0];
            }
        }
        if (logo === null) {
            logoArr = document.getElementsByClassName("logocont");
            if (logoArr.length > 0){
                logo = logoArr[0];
            }
        }
        if (logo === null) {
            logoArr = document.querySelectorAll("[aria-label='Google']");
            if (logoArr.length > 0) {
                logo = logoArr[0];
                modOuter = true;
            }
        }
        if (logo === null) {
            logoArr = document.querySelectorAll("img[alt='Google']");
            if (logoArr.length > 0) {
                logoArr[0].width = logoArr[0].offsetWidth;
                logoArr[0].src = "//www.baidu.com/img/flexible/logo/pc/result.png";
            }
        }
        if (logo !== null) {
            if (modImgSrc) {
                logo.src = "//www.baidu.com/img/flexible/logo/pc/result.png";
            } else {
                let newHTML = '<a href="/" data-hveid="7"><img src="//www.baidu.com/img/flexible/logo/pc/result.png" alt="Baidu" data-atf="3" height="' + logo.offsetHeight + 'px"></a>';
                if (modOuter) {
                    logo.outerHTML = newHTML;
                } else {
                    logo.innerHTML = newHTML;
                }
            }
            document.title = document.title.replace(/\s-\sGoogle\s搜(索|尋)/g, " - 百度搜索"); //支持繁体,谢谢david082321提醒
        }
        //修改为百度的配色
        document.querySelectorAll("a h3").forEach(a => {a.style.color = "#0000cc"});
        document.querySelectorAll("span.st").forEach(a => {a.style.color = "#333333"});
        document.querySelectorAll("em, .rbt b, .c b, .fl b").forEach(a => {a.style.color = "#CC0000"});

        //下面的翻页改成百度的脚丫子
        var navTabSpans = document.getElementsByClassName("SJajHc");
        for (let i = 0; i < navTabSpans.length; i++) {
            var naviImageUrl = "//ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/global/img/icons_5859e57.png";
            navTabSpans[i].style.width = "22px";
            if (i === 0) { //开始的大G
                navTabSpans[i].style.background = 'url("' + naviImageUrl + '") no-repeat 0px 0px';
            } else if (i == navTabSpans.length - 1) {
                navTabSpans[i].style.background = 'url("' + naviImageUrl + '") no-repeat 0px 0px';
            } else if (navTabSpans[i].classList.contains("NVbCr")) { // 变灰色的导航页
                navTabSpans[i].style.background = i % 2 == 1 ? 'url("' + naviImageUrl + '") no-repeat -144px -288px' : 'url("' + naviImageUrl + '") no-repeat -144px -282px'; //让页面底部的百度脚丫子错落有致,感谢Raka-loah
            } else { //当前导航页
                navTabSpans[i].style.background = 'url("' + naviImageUrl + '") no-repeat -96px -288px';
            }
        }
    } else { //首页
        let bannerLogo = document.querySelector("[alt=Google]");
        bannerLogo.src = "//www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png";
        bannerLogo.removeAttribute("srcset");
        bannerLogo.height = (bannerLogo.width / 540) * 258;
        //修改paddingtop的设置方式,改为原值-20px.避免硬性设置.造成不同浏览器下位置错乱.
        let paddingTop = bannerLogo.style.paddingTop.replace("px", "");
        let paddingTopInt = parseInt(paddingTop);
        bannerLogo.style.paddingTop = (paddingTopInt - 20) + "px";

        var searchBtns = document.getElementsByName("btnK");
        for (var x = 0; x < searchBtns.length; x++) {
            searchBtns[x].value = searchBtns[x].value.replace(/Google\s?/, "百度");
        }

        document.title = document.title.replace(/Google/g, "百度一下，你就知道");
        //按钮下语言切换的提示 arnes提供
        var footnote = document.getElementById("SIvCob");
        if (footnote !== null){ //某些ip下,可能没有SIvCob,谢谢BeefOnionDumplings提醒.
            footnote.innerHTML = footnote.innerHTML.replace(/Google\s?/, "百度");
        }
        //底部的google
        var footElements = document.getElementsByClassName("Fx4vi");
        for (var u = 0; u < footElements.length; u++) {
            footElements[u].innerHTML = footElements[u].innerHTML.replace(/Google\s?/, "百度");
        }
    }

})();