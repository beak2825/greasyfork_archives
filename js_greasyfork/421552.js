// ==UserScript==
// @name 🎃👻 THE BEST SCRIPT 👻🎃 Youtube Downloader (MP3-MP4-HD-FullHD)
// @name:da 🎃👻 THE BEST SCRIPT 👻🎃 Youtube Downloader (MP3-MP4-HD-FullHD)
// @name:fr 🎃👻 THE BEST SCRIPT 👻🎃 Youtube Downloader (MP3-MP4-HD-FullHD)
// @name:ru 🎃👻 THE BEST SCRIPT 👻🎃 Youtube Downloader (MP3-MP4-HD-FullHD)
// @name:uk 🎃👻 THE BEST SCRIPT 👻🎃 Youtube Downloader (MP3-MP4-HD-FullHD)
// @name:pt-BR 🎃👻 THE BEST SCRIPT 👻🎃 Youtube Downloader (MP3-MP4-HD-FullHD)
// @name:ja Youtube Downloader（MP3-MP4-HD-FullHD)
// @name:zh-CN YouTube下载器（MP3-MP4-HD-FullHD）
// @description Este es el mejor script para descargar videos y música por YOUTUBE por ser rápido , bueno y mejor que los demás. Gracias RECOMENDACIÓN USAR ADBLOCK PARA MEJOR AUTONOMIA CON EL SCRIPT
// @description:da Dette script er en downloadknap til YouTube uden annoncer, der fungerer korrekt ANBEFALING TIL AT BRUGE ADBLOCK TIL BEDRE AUTONOMI MED SKRIPTET
// @description:fr Ce script est un bouton de téléchargement pour YouTube sans publicité fonctionnant correctement RECOMMANDATION D'UTILISER ADBLOCK POUR UNE MEILLEURE AUTONOMIE AVEC LE SCRIPT
// @description:ru Этот скрипт представляет собой кнопку загрузки для YouTube без корректной работы рекламы RECOMMANDATION D'UTILISER ADBLOCK POUR UNE MEILLEURE AUTONOMIE AVEC LE SCRIPT
// @description:uk Цей сценарій є кнопкою завантаження для YouTube без реклами, яка працює належним чином РЕКОМЕНДАЦІЯ ВИКОРИСТОВУВАТИ ADBLOCK ДЛЯ КРАЩОЇ АВТОНОМІЇ СЦЕНАРІЮ
// @description:pt-BR Este script é um botão de download para o YouTube sem anúncios funcionando corretamente RECOMENDAÇÃO DE USO DE ADBLOCK PARA MELHOR AUTONOMIA COM O SCRIPT
// @description:ja このスクリプトは、広告が正しく機能しないYouTubeのダウンロードボタンです。スクリプトでより良い自律性のためにADBLOCKを使用することをお勧めします
// @description:zh-CN 此脚本是YouTube的下载按钮，广告无法正常运行 建议使用ADBLOCK与脚本更好地自治
// @namespace   https://ysenmanuel.github.io/Web/
// @version     6.0
// @date        2020-10-16
// @author      ysEnmanuel
// @homepage    https://y2mate.com/
// @icon        https://i.imgur.com/bu8MIMk.jpg
// @icon64      https://i.imgur.com/bu8MIMk.jpg
// @include     https://www.youtube.com/*
// @include     https://www.youtube.com/*
// @run-at      document-end
// @grant       GM_listValues
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_info
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_notification
// @grant       GM_download
// @grant       GM.info
// @grant       GM.listValues
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.openInTab
// @grant       GM.setClipboard
// @grant       GM.xmlHttpRequest
// @connect     youtube.com
// @connect     m.youtube.com
// @connect     www.youtube.com
// @connect     youtube-nocookie.com
// @connect     youtu.be
// @connect     y2mate.com
// @connect     self
// @connect     *
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license CC BY-NC-ND 4.0 International. https://creativecommons.org/licenses/by-nc-nd/4.0/
// @antifeature referral-link
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/421552/%F0%9F%8E%83%F0%9F%91%BB%20THE%20BEST%20SCRIPT%20%F0%9F%91%BB%F0%9F%8E%83%20Youtube%20Downloader%20%28MP3-MP4-HD-FullHD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421552/%F0%9F%8E%83%F0%9F%91%BB%20THE%20BEST%20SCRIPT%20%F0%9F%91%BB%F0%9F%8E%83%20Youtube%20Downloader%20%28MP3-MP4-HD-FullHD%29.meta.js
// ==/UserScript==
var AKoiMain = {
    oXHttpReq: null,
    vid: null,
    oldUrl: null,
    DocOnLoad: function(o) {
        try {
            if (null != o && null != o.body && null != o.location && (AKoiMain.vid = AKoiMain.getVid(o), AKoiMain.vid)) {
                o.querySelector("#meta #notification-preference-button").setAttribute("style", "flex-wrap: wrap;");
                var t = o.querySelector("#notification-preference-button"),
                    e = o.querySelector("#y2mateconverter"),
                    n = AKoiMain.GetCommandButton();
                null == e && (null != t ? t.parentNode.insertBefore(n, t) : (t = o.querySelector("#eow-title")).parentNode.insertBefore(n, t)), AKoiMain.oldUrl = o.location.href, AKoiMain.checkChangeVid()
            }
            return !0
        } catch (o) {
            console.log("Ошибка в функции Y2mate.DocOnLoad. ", o)
        }
    },
    checkChangeVid: function() {
        setTimeout(function() {
            AKoiMain.oldUrl == window.location.href ? AKoiMain.checkChangeVid() : AKoiMain.WaitLoadDom(window.document)
        }, 1e3)
    },
    WaitLoadDom: function(o) {
        AKoiMain.vid = AKoiMain.getVid(o), AKoiMain.vid ? null != o.querySelector("#meta #notification-preference-button") ? AKoiMain.DocOnLoad(o) : setTimeout(function() {
            AKoiMain.WaitLoadDom(o)
        }, 1e3) : AKoiMain.checkChangeVid()
    },
    goToY2mate: function(o) {
        try {
            var t = "https://y2mate.com/youtube/" + AKoiMain.vid + "/?utm_source=chrome_addon";
            window.open(t, "_blank")
        } catch (o) {
            console.log("Ошибка в функции Y2mate.OnButtonClick. ", o)
        }
    },
    GetCommandButton: function() {
        try {
            var o = document.createElement("button");
            return o.id = "y2mateconverter", o.className = "yt-uix-tooltip", o.setAttribute("type", "button"), o.setAttribute("title", "Download by @ysEnma in Telegram"), o.innerHTML = "Download", o.addEventListener("click", function(o) {
                AKoiMain.goToY2mate(o)
            }, !0), o.setAttribute("style", "min-height:25px; position:relative; cursor: pointer; font: 13px Arial; background: #FC0A0A; color: #fff; text-transform: uppercase; display: block; padding: 10px 16px; margin:7px 7px; border: 1px solid #FC0A0A; border-radius: 2px; font-weight:bold"), o.setAttribute("onmouseover", "this.style.backgroundColor='#FC0A0A'"), o.setAttribute("onmouseout", "this.style.backgroundColor='#FC0A0A'"), o
        } catch (o) {
            console.log("Ошибка в функции Y2mate.GetCommandButton. ", o)
        }
    },
    getVid: function(o) {
        var t = o.location.toString().match(/^.*((m\.)?youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/);
        return !(!t || !t[3]) && t[3]
    }
};
AKoiMain.WaitLoadDom(window.document);