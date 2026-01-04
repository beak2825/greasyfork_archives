// ==UserScript==
// @name         SLive Core (IntUpdate)
// @namespace    http://tampermonkey.net/
// @version      21
// @match https://shikimori.one/*
// @match https://shikimori.org/*
// @match https://*.shikimorilive.top/*
// @match http://shikimorilive.test/*
// @description  SLive Userscript Core
// @author       JuniorDEV
// ==/UserScript==

var version = 21;
//alert('Update123');

/*var observer = new MutationObserver(function(e) {
    if (document.location.href.indexOf("animes") < 1) return !1;
    5 < e.length && Run()
});*/

function Run() {
    var e = detectIE();
    e && e < 11 && (alert("Oh nooo -_- Пожалуйста установите браузер или используйте IE Edge"), document.location.href = "https://www.srware.net/iron/");
    var t = document.querySelectorAll(".b-anime_status_tag")[0];
    if (!t.classList.contains("ongoing") && !t.classList.contains("released")) return !1;
    if ("complete" != document.readyState) window.setTimeout(Run, 100);
    else var n = setInterval(function() {
        if (document.body.classList.contains("p-animes-show") && 0 == document.querySelectorAll(".slPlayFreePlayButton").length) {
            var i = document.location.href.split("/")[4].split("-")[0];
            var e = document.createElement("div");
            e.classList.add("block"), e.classList.add("slPlayFreePlayButton"), e.innerHTML = '<a style="border: 1px solid #4c86c8!important; background-color: #daf1ff!important; color: #4c86c8!important; margin-top: 15px;" class="b-link_button dark watch_link watch-online" href="https://live.shikimorilive.top/online/' + i + '/1">Смотреть онлайн на Shikimøri Live<br><span style="color: green; padding-top: 4px;">(Бесплатно)</span></a>', document.querySelectorAll(".c-info-right")[0].appendChild(e)
        } else clearInterval(n)
    }, 1e3)
}

function detectIE() {
    var e = window.navigator.userAgent,
        t = e.indexOf("MSIE ");
    if (0 < t) return parseInt(e.substring(t + 5, e.indexOf(".", t)), 10);
    if (0 < e.indexOf("Trident/")) {
        var n = e.indexOf("rv:");
        return parseInt(e.substring(n + 3, e.indexOf(".", n)), 10)
    }
    var r = e.indexOf("Edge/");
    return 0 < r && parseInt(e.substring(r + 5, e.indexOf(".", r)), 10)
}
/*observer.observe(document, {
        attributes: !1,
        childList: !0,
        characterData: !1,
        subtree: !0
    }),
    function() {
        if (document.location.href.indexOf("animes") < 1) return;
        Run()
    }();*/

// Thanks about the idea - ImoutoChan
function runme(runfn) {
    document.addEventListener('turbolinks:load', runfn);
	document.addEventListener('page:load', runfn);

    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
        runfn();
    } else {
        document.addEventListener('DOMContentLoaded', runfn);
    }
}