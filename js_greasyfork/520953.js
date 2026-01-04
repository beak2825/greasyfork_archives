// ==UserScript==
// @name         Bricklink Toolbar
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Restore toolbar as far as possible
// @author       Me
// @license MIT
// @match        https://*.bricklink.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/520953/Bricklink%20Toolbar.user.js
// @updateURL https://update.greasyfork.org/scripts/520953/Bricklink%20Toolbar.meta.js
// ==/UserScript==
/* global $ */
'use strict';

function handleChameleon() {
    $('#bl-header').css({"position": "relative", "width": $('#id-main-legacy-table').css("width"), "margin-left": $('#id-main-legacy-table').css("margin-left")});
    $('#js-blp-header').children().first().css({"height": "70px", "margin-top": "-15px", "margin-bottom": "-10px"});
    $('.blp-header__logo').css({"overflow":"hidden","width":"30px"});
    $('#js-blp-nav').css({"position":"absolute","left":"75px"});
    $('.blp .blp-nav').css("display","inline");
    $('#js-blp-search').insertBefore($('#js-trigger-marketplace').parent());
    $('#js-blp-search').css("width", "400px");
    var search = window.location.href.match(/(\?|&)q=([^#&]+)?/);
    if(search) {
        $('input.blp-adv-search__input').val(decodeURIComponent(search[2])); }
    $('#js-trigger-marketplace').html('<button class="blp-btn" id="js-trigger-marketplace" aria-current="false" data-state="closed" aria-expanded="false" aria-controls="content-marketplace" style="font-size:12px; margin-left:-30px"><img loading="lazy" src="https://static.bricklink.com/renovate/img/nav-shop-new.svg" style="margin-left:21.9865px;margin-right:22.002px;background-clip:border-box;background-color:rgba(0, 0, 0, 0);border-radius:18px;display:block;height:28px;width:28px;">Market</button>');
    $('#js-trigger-studio').html('<button class="blp-btn" id="js-trigger-studio" aria-current="false" data-state="closed" aria-expanded="false" aria-controls="content-studio" style="font-size:12px; margin-left:-50px"><img loading="lazy"  src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAyOCAyOCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7Ij48ZyBpZD0iYnVpbGQiPjxjaXJjbGUgaWQ9ImNpcmNsZSIgY3g9IjE0IiBjeT0iMTQiIHI9IjE0IiBzdHlsZT0iZmlsbDojZDcwMDAwOyIvPjxwYXRoIGlkPSJicmljayIgZD0iTTIxLDEwYzAuNTUzLDAuMDAxIDEsMC40NDkgMSwxbDAsN2MwLDAuNTUyIC0wLjQ0OCwxIC0xLDFsLTE0LDBjLTAuNTUyLDAgLTEsLTAuNDQ4IC0xLC0xbDAsLTdjMCwtMC41NTEgMC40NDcsLTAuOTk5IDEsLTFsMTQsMFpNMTIsN2MwLjU1MywwLjAwMSAxLDAuNDQ5IDEsMWwwLDFsLTUsMGwwLC0xYzAsLTAuNTUxIDAuNDQ3LC0wLjk5OSAxLC0xbDMsMFpNMTksN2MwLjU1MywwLjAwMSAxLDAuNDQ5IDEsMWwwLDFsLTUsMGwwLC0xYzAsLTAuNTUxIDAuNDQ3LC0wLjk5OSAxLC0xbDMsMFoiIHN0eWxlPSJmaWxsOiNmZmY7Ii8+PC9nPjwvc3ZnPg==" style="margin-left:21.9865px;margin-right:22.002px;background-clip:border-box;background-color:rgba(0, 0, 0, 0);border-radius:18px;display:block;height:28px;width:28px;" title="">Studio</button>');
    $('#js-trigger-bricklink-designer-program').hide();
    $('#js-trigger-community').html('<button class="blp-btn" id="js-trigger-community" aria-current="false" data-state="closed" aria-expanded="false" aria-controls="content-community" style="font-size:12px; margin-left:-70px"><img loading="lazy" src="https://static.bricklink.com/renovate/img/nav-community.svg" style="margin-left:21.9865px;margin-right:22.002px;background-clip:border-box;background-color:rgba(0, 0, 0, 0);border-radius:18px;display:block;height:28px;width:28px;">Community</button>');
    $('.blp-nav-dropdown').css({"width": $('#id-main-legacy-table').css("width"),"margin-top": "-25px", "margin-right": "auto", "margin-left": $('#id-main-legacy-table').css("margin-left")});
    $('.blp-nav-dropdown__wrapper').css("margin-left","-150px");
    $('#js-blp-icon-nav').prepend('<a href="https://www.bricklink.com/v2/wanted/list.page"><button style="cursor:pointer; font-size:12px; margin-left:-30px"><img loading="lazy" src="https://static.bricklink.com/renovate/img/nav-heart-empty.svg" style="height:28px;width:28px;"></button></a>');
    $('#js-blp-icon-nav').css({"position":"absolute","left":"700px"});
    $('#bannerCarousel').hide();
    $('#chmln-dom').hide();
    $('#js-blp-footer').hide();
}

function handlestorePopup() {
    $("h2.blp-nav-dropdown__column-label:contains('My Store')").wrap('<a href="https://store.bricklink.com/' + unsafeWindow._var_username + '" />');
    $('#js-notification-sell').text(($("span[data-store='ordersIncomplete']")).text());
}

const observer = new MutationObserver(function (mutations, mutationInstance) {
    const chameleon = document.getElementById('chmln-dom');
    if (chameleon) {
        handleChameleon();
        mutationInstance.disconnect();
    }
});

observer.observe(document, {
    childList: true,
    subtree:   true
});

const observer2 = new MutationObserver(function (mutations, mutationInstance) {
    const storePopup = ($( "span[data-store='ordersIncomplete']"))[0];
    if (storePopup) {
        handlestorePopup();
        mutationInstance.disconnect();
    }
});

observer2.observe(document, {
    childList: true,
    subtree:   true
});



