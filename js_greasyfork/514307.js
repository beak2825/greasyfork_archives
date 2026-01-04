// ==UserScript==
// @name                speed bot 7.3
// @description         yo ye
// @version             7.3
// @author              küvü
// @match               *://gartic.io/*
// @match               *://www.croxyproxy.com/*
// @grant               GM_addStyle
// @grant               GM_openInTab
// @icon                https://i.hizliresim.com/mptijzd.png
// @namespace https://greasyfork.org/users/1225384
// @downloadURL https://update.greasyfork.org/scripts/514307/speed%20bot%2073.user.js
// @updateURL https://update.greasyfork.org/scripts/514307/speed%20bot%2073.meta.js
// ==/UserScript==

let adet = "3"; // açılacak proxy sayısını buradan ayarlayın ve 1-10 arsı değer verin

let site = location.href.toLowerCase(); // bulunduğunuz sitenin urlsini işler

if (site.indexOf('gartic.io') != -1) { // eğer bulunduğun sayfanın urlsinde gartic.io varsa alttaki kodlar çalışır
    /*Proxy i açan buton*/
    var bot = document.createElement('button'); // buton elementi oluşturur
    bot.innerHTML = '<button id="bot" class="btYellowBig" style="width:54px"><i class="gg-user-add"></i><strong></strong></button>'; // html değeri verilir
    bot.setAttribute('style', 'position:absolute;z-index: 2;'); // style verilir
    document.body.appendChild(bot); // butonu ekler
    document.getElementById("bot").addEventListener("click", openproxy, false); // butona tıklandığında openproxy i çalıştırır
    function openproxy(Event) {
        let link = "https://www.croxyproxy.com/?url=" + encodeURIComponent("https://gartic.io");
        for (let i = 0; i < adet; i++) {
            GM_openInTab(link);
        }
    }
}

setInterval(function () {
    let linkyeri = document.querySelector('input[id="url"]');
    if (site.indexOf('www.croxyproxy.com') != -1) {
        if (linkyeri && linkyeri.value === "") {
            linkyeri.value = "https://gartic.io"; // link yerine değer verir
            document.querySelector('i[class="fa fa-arrow-right"]').dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 })); // butona tıklatır
        }
    }
}, 300);

GM_addStyle(`.gg-close-o{box-sizing: border-box;position:relative;display: block;transform:scale(var(--ggs,1));width: 22px;height:22px;border: 2px solid;border-radius:40px}.gg-close-o::after,.gg-close-o::before{content:"";display:block;box-sizing: border-box;position:absolute;width:12px;height:2px;background:currentColor;transform:rotate(45deg);border-radius:5px;top: 8px;left: 3px}.gg-close-o::after{transform: rotate(-45deg)}.gg-user-add{display:block;transform:scale(var(--ggs,1));box-sizing:border-box;width:20px;height:18px;background:linear-gradient(to left,currentColor 8px,transparent 0)no-repeat 14px 6px/6px 2px,linear-gradient(to left,currentColor 8px,transparent 0)no-repeat 16px 4px/2px 6px}.gg-user-add::after,.gg-user-add::before{content:"";display:block;box-sizing:border-box;position:absolute;border:2px solid}.gg-user-add::before{width:8px;height:8px;border-radius:30px;top:0;left:20px}.gg-user-add::after{left:18px;width:12px;height:9px;border-bottom:0;border-top-left-radius:3px;border-top-right-radius:3px;top:9px}`);
