// ==UserScript==
// @name Shikimori Live v2e
// @name:en Shikimori Live v2 [Watch Anime Online]
// @name:zh-CN 《是克摸日 Live》现场动漫
// @name:ru Shikimori Live v2
// @description Мини-расширение проекта Shikimori Live. Возвращает кнопку «Смотреть онлайн» на странице аниме на Shikimori.one. Перезалив
// @description:zh-CN 该脚本返回Shikimori.one上的“在线观看”按钮
// @description:en Userscript of the Shikimori Live project. Returns the "Watch Online" button in the anime page on the Shikimori.one site.
// @namespace http://github.com/jund-dev
// @version 6.0
// @icon https://sosoyuh777.github.io/slive/ext-logoSmall.png
// @default_icon https://sosoyuh777.github.io/slive/ext-logoSmall.png
// @author JuniorDEV & masgasatriawirawan
// @supportURL https://vk.com/shikimarilive
// @compatible chrome
// @compatible firefox
// @license GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright Copyright (C) 2019, by JuniorDEV <shikimorilive@gmail.com>
// @match https://shikimori.one/*
// @match https://shikimori.org/*
// @match https://*.shikimorilive.top/*
// @match http://shikimorilive.test/*
// @run-at document-start
// @grant none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/400089/Shikimori%20Live%20v2e.user.js
// @updateURL https://update.greasyfork.org/scripts/400089/Shikimori%20Live%20v2e.meta.js
// ==/UserScript==

/**
 * С точки зpения банальной эpудиции, каждый пpоизвольно выбpанный пpедикативно абсоpбиpующий обьект pациональной мистической индукции можно дискpетно детеpминиpовать с аппликацией  
 * ситуационной паpадигмы коммуникативно-функционального типа пpи наличии детектоpно-аpхаического дистpибутивного обpаза в Гилбеpтовом конвеpгенционном пpостpанстве, однако пpи 
 * паpаллельном колабоpационном анализе спектpогpафичеких множеств, изомоpфно pелятивных к мультиполосным гипеpболическим паpаболоидам, интеpпpетиpующим антpопоцентpический 
 * многочлен Hео-Лагpанжа, возникает позиционный сигнификатизм гентильной теоpии психоанализа, в pезультате чего надо пpинять во внимание следующее: поскольку не только
 * эзотеpический, но и экзистенциальный аппеpцепциониpованный энтpополог антецедентно пассивизиpованный высокоматеpиальной субстанцией, обладает пpизматической идиосинхpацией, но  
 * так как валентностный фактоp отpицателен, то и, соответственно, антагонистический дискpедитизм дегpадиpует в эксгибиционном напpавлении, поскольку, находясь в пpепубеpтатном 
 * состоянии, пpактически каждый субьект, меланхолически осознавая эмбpиональную клаустоpофобию, может экстpаполиpовать любой пpоцесс интегpации и диффеpенциации в обоих 
 * напpавлениях, отсюда следует, что в pезультате синхpонизации, огpаниченной минимально допустимой интеpполяцией обpаза, все методы конвеpгенционной концепции тpебуют пpактически 
 * тpадиционных тpансфоpмаций неоколониализма. 
 * This f*cking program is free software, crafted for otaku peoples.
 */

location.href = "javascript:(function(){ window.SLiveVersion = '1.5'; })()";
if (document.location.href.indexOf('shikimorilive') > -1) {
    throw new Error("[SLInfo] Работа завершена. / Working stopped.");
}

function setCookie(e, t, o) {
    var n = ""
    if (o) {
        var i = new Date
        i.setTime(i.getTime() + 24 * o * 60 * 60 * 1e3), n = "; expires=" + i.toUTCString()
    }
    document.cookie = e + "=" + (t || "") + n + "; path=/"
}

function getCookie(e) {
    for (var t = e + "=", o = document.cookie.split(";"), n = 0; n < o.length; n++) {
        for (var i = o[n];
            " " == i.charAt(0);) i = i.substring(1, i.length)
        if (0 == i.indexOf(t)) return i.substring(t.length, i.length)
    }
    return null
}

function eraseCookie(e) {
    document.cookie = e + "=; Max-Age=-99999999;"
}

if(document.readyState !== 'loading') {
    preLoad();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        preLoad();
    });
}

function preLoad(){
    var e = new window.XMLHttpRequest,
        t = window.document.createElement("script")
    e.responseType = "text", e.open("GET", "https://greasyfork.org/scripts/400086-slive-core-extupdate/code/SLive%20Core%20(ExtUpdate).js?v=" + getCookie("slversion"), !0), e.onload = function() {
        if (e.readyState === e.DONE && 200 === e.status) {
            var o = e.responseText,
                n = o.match(/var version = (\d+);/)
            if(n === null){
				console.info('[SLive Info] Ядро не подключено или подключено некорректно!');
		        return;
            } else if(null !== getCookie("slversion") && getCookie("slversion") < n[1]){
                setCookie("slversion", n[1], 350);
            }
            var i = new window.Blob([o], {
                    type: "text/javascript"
                }),
                s = window.URL.createObjectURL(i)
            t.type = "text/javascript", t.src = s, t.onload = function() {
                //window.slive()
            }, window.document.body.appendChild(t), t.remove()
        }
    }, e.send()
}