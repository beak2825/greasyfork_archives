// ==UserScript==
// @name 把Google搜索伪装成百度搜索
// @namespace win.somereason.web.utils
// @version 2023.3.19
// @description 用Google搜索,很多人看到屏幕后会问你怎么上Google的.所以当我们把Google的logo换成百度,他们就不会问那么多问题了!
// @author somereason
// @license MIT
// @match *://www.google.com/search*
// @match *://www.google.com.*/search*
// @match *://www.google.com/
// @match *://www.google.com.*/
// @icon  https://www.baidu.com/favicon.ico
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/372883/%E6%8A%8AGoogle%E6%90%9C%E7%B4%A2%E4%BC%AA%E8%A3%85%E6%88%90%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/372883/%E6%8A%8AGoogle%E6%90%9C%E7%B4%A2%E4%BC%AA%E8%A3%85%E6%88%90%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
//

function addCSS() {
    let css =
        ".titleLink {" +
        "  color: #0000cc !important;" +
        "}"
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }
}

(function () {
    //addCSS()


    //伪装favicon
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://www.baidu.com/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);

    //搜索页
    if (window.location.href.indexOf("/search") > -1) {
        //伪装搜索结果页面logo
        var logo = document.getElementById("logo");
        var logoArr;
        //应对样式的变更,尝试用不同方式获取logo
        if (logo === null) {
            logoArr = document.getElementsByClassName("logo");
            if (logoArr.length > 0)
                logo = logoArr[0];
        }
        if (logo === null) {
            logoArr = document.getElementsByClassName("logocont");
            if (logoArr.length > 0)
                logo = logoArr[0];
        }
        if (logo === null) { //logo获取失败
            console.log("oops,google又改样式了.请静待更新");
        } else {
            var imgSize = getImgSize(logo);
            logo.innerHTML = '<a href="/" data-hveid="7"><img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_86d58ae1.png" alt="Baidu" data-atf="3" height="' + imgSize.height + 'px" width="' + imgSize.width + 'px"></a>';

            document.title = document.title.replace(/\s-\sGoogle\s(搜(索|尋)|Search)/g, " - 百度搜索"); //支持繁体,谢谢david082321提醒
        }

        //修改为百度的配色, 由于找不到办法覆盖a:visited, 取消
        //document.querySelectorAll("a h3").forEach(a => a.className += " titleLink");

        document.querySelectorAll("span.st").forEach(a => a.style.color = "#333333")
        document.querySelectorAll("em, .rbt b, .c b, .fl b").forEach(a => a.style.color = "#CC0000")

        //下面的翻页改成百度的脚丫子
        var navTabSpans = document.getElementsByClassName("SJajHc");
        for (var i = 0; i < navTabSpans.length; i++) {
            var naviImageUrl = "https://ss1.bdstatic.com/5eN1bjq8AAUYm2zgoY3K/r/www/cache/static/protocol/https/global/img/icons_5859e57.png";
            navTabSpans[i].style.width = "22px";
            if (i === 0) { //开始的大G
                navTabSpans[i].style.background = 'url("' + naviImageUrl + '") no-repeat 0px 0px';
            } else if (i == navTabSpans.length - 1) {
                navTabSpans[i].style.background = 'url("' + naviImageUrl + '") no-repeat 0px 0px';
            } else if (navTabSpans[i].classList.contains("NVbCr")) {// 变灰色的导航页
                navTabSpans[i].style.background = i % 2 == 1 ? 'url("' + naviImageUrl + '") no-repeat -144px -288px' : 'url("' + naviImageUrl + '") no-repeat -144px -282px'; //让页面底部的百度脚丫子错落有致,感谢Raka-loah
            } else { //当前导航页
                navTabSpans[i].style.background = 'url("' + naviImageUrl + '") no-repeat -96px -288px';
            }
        }
    } else {//首页
        let bannerLogo = document.querySelector("[alt=Google]")
        bannerLogo.src = "//www.baidu.com/img/bd_logo1.png";
        bannerLogo.removeAttribute("srcset");
        bannerLogo.width = 270;
        bannerLogo.height = 129;
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
        if (footnote !== null) //某些ip下,可能没有SIvCob,谢谢BeefOnionDumplings提醒.
            footnote.innerHTML = footnote.innerHTML.replace(/Google\s?/, "百度");
        //底部的google
        var footElements = document.getElementsByClassName("Fx4vi");
        for (var u = 0; u < footElements.length; u++) {
            footElements[u].innerHTML = footElements[u].innerHTML.replace(/Google\s?/, "百度");
        }

    }


    /**
     * 获取图片的大小
     * @param elLogo
     */
    function getImgSize(elLogo) {
        var elImg = elLogo.querySelector("img");
        if (elImg === null) {
            return {height: 30, width: 92}
        } else {
            return {height: elImg.height, width: elImg.width}
        }
    }
})();