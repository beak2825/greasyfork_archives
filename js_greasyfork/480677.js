// ==UserScript==
// @name         Kinozal.tv improvements
// @namespace    http://tampermonkey.net/
// @version      2025.02.28
// @description  Adds ability to download torrent file from link to torrent details via ALT+Click in search page. Removes ads from left pane. Increases size of images in "Top torrents" page.
// @author       Epsil0neR
// @match        https://kinozal.tv/*
// @match        https://kinozal.me/*
// @icon         https://www.google.com/s2/favicons?domain=kinozal.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480677/Kinozaltv%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/480677/Kinozaltv%20improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let headerTable = document.querySelector("#header>table");
    if (headerTable){
        headerTable.remove();
    }
    //document.querySelector("#header>table").remove();
    document.querySelector("#header").style.height = "auto";
    const start = '/details.php?id=';
    var listener = function handleClick(event){
        if (!event.altKey){
            return;
        }
        let a = event.target;
        if (a.nodeName === "IMG" && a.parentElement.nodeName === "A"){
            a = a.parentElement;
        }
        if (a.nodeName !== "A"){
            return;
        }

        var href = a.attributes["href"].value;
        var starts = href.indexOf(start) === 0;

        event.preventDefault();
        event.cancelBubble = true;
        document.location = "https://dl.kinozal.me/download.php?id=" + href.slice(start.length);
    }

    document.addEventListener('click', listener, true);

    var wrapper = document.querySelector("#body_wrapper");
    wrapper.style.maxWidth = "initial";
    wrapper.style.background = "#BBB";

    // CSS:
    var css = `
.stable a img {
    width: 200px;// 150px;
    height: 300px;// 225px;
}
.zan_l, .zan_r {
    visibility: collapse;
}

#main {
    margin-top: 0px !important;
}
    `,
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    head.appendChild(style);

    style.type = 'text/css';
    if (style.styleSheet){
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    // Search with sort by Seeds.
    $('<input>').attr({
        type: 'hidden',
        name: 't',
        value: '1'
    }).prependTo('#srchform');

    //Remove ads on menu side.
    $('#main>.menu>div:not(.bx2_0)').remove();
    $('#main>.menu>script').remove();

    var windowWrap = {
        document: {
            write: function(){}
        },
        moveTo: function() {},
        resizeTo: function(){},
    };

    window.open_orig = window.open;
    window.open = function(url, target, windowFeatures) {
        console.error(`Epsil0neR: window.open call prevented with params: ${url}, ${target}, ${windowFeatures}`);

        return windowWrap;
    }
})();