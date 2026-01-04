// ==UserScript==
// @encoding		utf-8
// @name			Разрешение экрана в Хроники Хаоса
// @name:en			Screen resolution in Hero Wars
// @version			1.1
// @description		Возвращаем старое разрешение экрана в игре Хроники Хаоса
// @description:en	Returning the old screen resolution in the game Hero Wars
// @namespace    http://tampermonkey.net/
// @author       ZingerY & OWL
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @include			https://*.hero-wars*.com/*
// @match			https://*.hero-wars*.com/*
// @downloadURL https://update.greasyfork.org/scripts/462723/%D0%A0%D0%B0%D0%B7%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%20%D0%B2%20%D0%A5%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%A5%D0%B0%D0%BE%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/462723/%D0%A0%D0%B0%D0%B7%D1%80%D0%B5%D1%88%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0%20%D0%B2%20%D0%A5%D1%80%D0%BE%D0%BD%D0%B8%D0%BA%D0%B8%20%D0%A5%D0%B0%D0%BE%D1%81%D0%B0.meta.js
// ==/UserScript==

const style = document.createElement('style');
style.innerText = "#flash-wrapper{max-width:1000px !important;max-height:640px !important;}";
document.head.appendChild(style);