// ==UserScript==
// @name        Kariyer.net üye girişi ekranı kaldır
// @namespace   Violentmonkey Scripts
// @match       https://www.kariyer.net
// @include     https://www.kariyer.net/*
// @grant       none
// @version     1.0
// @author      -
// @description 31.03.2021 20:48:26
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424276/Kariyernet%20%C3%BCye%20giri%C5%9Fi%20ekran%C4%B1%20kald%C4%B1r.user.js
// @updateURL https://update.greasyfork.org/scripts/424276/Kariyernet%20%C3%BCye%20giri%C5%9Fi%20ekran%C4%B1%20kald%C4%B1r.meta.js
// ==/UserScript==


$('ui-widget-overlay ui-front').remove();
