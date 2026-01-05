// ==UserScript==
// @name         YouTube - turns 'Trending' into 'Paid promotions
// @description  Simply what it says!
// @namespace    https://youtube.com/
// @version      0.1.7
// @match        https://*.youtube.com/*
// @match        http://*.youtube.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25335/YouTube%20-%20turns%20%27Trending%27%20into%20%27Paid%20promotions.user.js
// @updateURL https://update.greasyfork.org/scripts/25335/YouTube%20-%20turns%20%27Trending%27%20into%20%27Paid%20promotions.meta.js
// ==/UserScript==

$(function() {
    setTimeout(function () {
        document.getElementById('appbar-guide-button').click();
        setTimeout(function () {
            document.getElementsByClassName('display-name')[2].innerHTML = "<span>Paid promotions</span>";
            document.getElementsByClassName('yt-valign-container')[2].style.paddingLeft = "7px";
            document.getElementsByClassName('yt-valign-container')[2].childNodes[1].className = "yt-sprite guide-paid-promotions-icon";
            if (location.pathname == "/feed/trending") {
                document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.background = "no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vflTyCFa9.webp) 0 -1143px";
                document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.backgroundSize = "auto";
                document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.width = "18px";
                document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.height = "18px";
                document.getElementsByTagName('title')[0].innerText = "Paid Promotions - YouTube";
            } else {
                document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.background = "no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vflTyCFa9.webp) 0 -473px";
                document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.backgroundSize = "auto";
                document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.width = "18px";
                document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.height = "18px";
                document.styleSheets[0].insertRule('.guide-item:hover .guide-paid-promotions-icon { background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vflTyCFa9.webp) 0 -1143px !important; }', document.styleSheets[0].cssRules.length);
            }
            document.getElementsByClassName('yt-valign-container')[2].parentElement.addEventListener("click", function() {
                setTimeout(function () {
                    document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.background = "no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vflTyCFa9.webp) 0 -1143px";
                    document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.backgroundSize = "auto";
                    document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.width = "18px";
                    document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.height = "18px";
                    document.getElementsByTagName('title')[0].innerText = "Paid Promotions - YouTube";
                }, 1000);
            });
            window.addEventListener("popstate", function () {
                setTimeout(function () {
                    document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.background = "no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vflTyCFa9.webp) 0 -473px";
                    document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.backgroundSize = "auto";
                    document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.width = "18px";
                    document.getElementsByClassName('yt-valign-container')[2].childNodes[1].style.height = "18px";
                    document.styleSheets[0].insertRule('.guide-item:hover .guide-paid-promotions-icon { background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vflTyCFa9.webp) 0 -1143px !important; }', document.styleSheets[0].cssRules.length);
                }, 1000);
            });
            document.getElementById('appbar-guide-button').click();
        }, 1000);
    }, 500);
});