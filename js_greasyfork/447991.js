// ==UserScript==
// @name         Turkanime Bolum Navigasyonu
// @namespace    https://deadlybro-baglantilar.blogspot.com
// @description  TürkAnime sitesinde kolayca bölüm değiştirebileceksiniz. ( Klavye Kombinasyonu: A veya ← tuşu = Önceki Bölüm, D veya → tuşu = Sonraki Bölüm. )
// @author       DeadLyBro
// @copyright    2022, DeadLyBro (https://openuserjs.org/users/DeadLyBro)
// @version      4.4
// @match        https://www.turkanime.tv/*
// @icon         https://i.hizliresim.com/cbr4snl.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447991/Turkanime%20Bolum%20Navigasyonu.user.js
// @updateURL https://update.greasyfork.org/scripts/447991/Turkanime%20Bolum%20Navigasyonu.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author DeadLyBro
// ==/OpenUserJS==

if (document.querySelector("#arkaplan > div:nth-child(3) > div.col-xs-8 > div > div:nth-child(3) > div > div.panel-ust > div > a:nth-child(1)").innerHTML === `<i class="fa fa-angle-double-left fa-fw"></i>`) {
document.addEventListener('keyup', function (e) {
	if ( e.key == "a" && e.which === 65 && !$("input").is(":focus") || e.key == "ArrowLeft" && e.which === 37 && !$("input").is(":focus") ) {
        document.querySelector("#arkaplan > div:nth-child(3) > div.col-xs-8 > div > div:nth-child(3) > div > div.panel-ust > div > a:nth-child(1)").click();
	}
});
}

if (document.querySelector("#arkaplan > div:nth-child(3) > div.col-xs-8 > div > div:nth-child(3) > div > div.panel-ust > div > a:nth-child(2)").innerHTML === `<i class="fa fa-angle-double-right fa-fw"></i>`) {
document.addEventListener('keyup', function (e) {
	if ( e.key == "d" && e.which === 68 && !$("input").is(":focus") || e.key == "ArrowRight" && e.which === 39 && !$("input").is(":focus") ) {
        document.querySelector("#arkaplan > div:nth-child(3) > div.col-xs-8 > div > div:nth-child(3) > div > div.panel-ust > div > a:nth-child(2)").click();
	}
});
}

if (document.querySelector("#arkaplan > div:nth-child(3) > div.col-xs-8 > div > div:nth-child(3) > div > div.panel-ust > div > a:nth-child(3)").innerHTML === `<i class="fa fa-angle-double-right fa-fw"></i>`) {
document.addEventListener('keyup', function (e) {
	if ( e.key == "d" && e.which === 68 && !$("input").is(":focus") || e.key == "ArrowRight" && e.which === 39 && !$("input").is(":focus") ) {
        document.querySelector("#arkaplan > div:nth-child(3) > div.col-xs-8 > div > div:nth-child(3) > div > div.panel-ust > div > a:nth-child(3)").click();
	}
});
}