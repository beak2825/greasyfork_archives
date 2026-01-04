// ==UserScript==
// @name         Change Wikipedia Style
// @name:zh-TW   更改維基百科佈景主題
// @name:zh-CN   改变维基百科皮肤
// @version      1.0.1
// @license      MIT
// @description  It's 2020 already! Wikipedia should looks better, shouldn't it?
// @description:zh-TW  都 2020 了，維基百科該看起來更好看了，不是嗎？
// @description:zh-CN  都 2020 了，维基百科咋还那么地丑？
// @author       kevin pan
// @include      *://*wiki*.org/*
// @include      *://*wiki.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/408060/Change%20Wikipedia%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/408060/Change%20Wikipedia%20Style.meta.js
// ==/UserScript==



function showMenu(){
    var menuElement = document.createElement('div');
    menuElement.setAttribute("style", "position: fixed; top: 8px; left: 8px; padding: 8px; background: #FFF; border-radius: 8px; box-shadow: 4px 4px 16px; z-index: 99999");
    document.querySelector("body").appendChild(menuElement);
    menuElement.innerHTML += '<select name="menu_wikipediaStyle">'
                           + '    <option value="vector">vector (Wikipedia Default)</option>'
                           + '    <option value="minerva">minerva (Wikipedia Default for Phone)</option>'
                           + '    <option value="modern">modern</option>'
                           + '    <option value="monobook">monobook</option>'
                           + '    <option value="timeless">timeless (The Best)</option>'
                           + '</select>'
                           + '<button id="menu_wikipediaStyle_save">Save</button>';

    document.querySelector("#menu_wikipediaStyle_save").addEventListener("click", function(event){
        var WikipediaStyle = document.querySelector("select[name=menu_wikipediaStyle]").value;
        GM_setValue("WikipediaStyle", WikipediaStyle);
        var StyleName = GM_getValue("WikipediaStyle","timeless");

        /*refresh*/
        var page_url = new URL(location.href);
        page_url.searchParams.set("useskin", StyleName);
        window.location.replace(page_url.href);
    });
}

GM_registerMenuCommand("Choose Your Style", showMenu);

(function() {
    'use strict';
    var StyleName = GM_getValue("WikipediaStyle","timeless");
    var page_url = new URL(location.href);
    var now_style = page_url.searchParams.get("useskin");
    if( now_style === null ){
        page_url.searchParams.set("useskin", StyleName);
        window.location.replace(page_url.href);
    }
})();

