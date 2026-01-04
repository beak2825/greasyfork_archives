// ==UserScript==
// @name         Quicker 动作主页自动改图标
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  目前只支持更换 png,svg 图标，支持少量 fontawesome 的图标
// @author       You
// @match        https://getquicker.net/Sharedaction?code=*
// @icon         https://www.google.com/s2/favicons?domain=getquicker.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435218/Quicker%20%E5%8A%A8%E4%BD%9C%E4%B8%BB%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%94%B9%E5%9B%BE%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/435218/Quicker%20%E5%8A%A8%E4%BD%9C%E4%B8%BB%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%94%B9%E5%9B%BE%E6%A0%87.meta.js
// ==/UserScript==

(function () {
    function setIcon(icon) {
        var link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = icon;
    }
    var image = document.querySelector("body > div.body-wrapper > div.container.bg-white.pb-2.rounded-bottom > div > div.col-12.col-md-9.d-flex > div.action-item.align-middle > img");
    if (image == null) {
        var font = document.querySelector("body > div.body-wrapper > div.container.bg-white.pb-2.rounded-bottom > div > div.col-12.col-md-9.d-flex > div.action-item.align-middle > i");
        var icon = font.getAttribute("class");
        function getSvgIcon(icon) {
            var link = "https://fa2png.app/svgs";
            //fal fa-alien-monster
            var code = icon.split(" ");
            var start = "";
            switch (code[0]) {
                case "fal":
                case "far": //start = "regular"; break;
                case "fas": start = "solid"; break;
                case "fab": start = "brands"; break;
            }
            return link + "/" + start + "/" + code[1].substring(3) + ".svg";
        }
        icon = getSvgIcon(icon);
        setIcon(icon);
        return icon;
    }
    else {
        var src = image.getAttribute("src");
        setIcon(src);
    }
})();

