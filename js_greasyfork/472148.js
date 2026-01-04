// ==UserScript==
// @name         Gmod Collection To addonpresets.txt
// @namespace    https://ejew.in/
// @version      0.3
// @description  Convert collections to presets.
// @author       EntranceJew
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @run-at       context-menu
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/472148/Gmod%20Collection%20To%20addonpresetstxt.user.js
// @updateURL https://update.greasyfork.org/scripts/472148/Gmod%20Collection%20To%20addonpresetstxt.meta.js
// ==/UserScript==

(function() {
    // 'use strict';
    // from: https://raw.githubusercontent.com/eligrey/FileSaver.js/master/dist/FileSaver.min.js
    (function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});

    let data = {};
    let keys = [];

    let old_cache = GM_getValue("WorkshopCollectionCache", null);
    if (old_cache != null) {
        let old_key, old_value;
        for ([old_key, old_value] of Object.entries(old_cache)){
            keys.push(old_key);
            data[ old_key ] = old_value;
            GM_setValue(old_key, old_value);
        };
        GM_deleteValue("WorkshopCollectionCache");
        console.log("migrated workshop collection cache 0.2 => 0.3");
    } else {
        keys = GM_listValues();
    }

    keys.forEach((key) => {
        data[ key ] = GM_getValue(key, {
            "disabled": [],
            "enabled": [],
            "name": key,
            "newAction": "disable"
        });
    });

    if (!("clear" in data)) {
        data.clear = {
            "disabled": [],
            "enabled": [],
            "name": "clear",
            "newAction": "disable"
        };
    }

    let collection_id = new URLSearchParams(new URL(window.location.href).search).get('id');
    let title = document.querySelector('.collectionHeader .workshopItemTitle').textContent + ' (' + collection_id + ')';
    // blank the key
    data[ title ] = {
        "disabled": [],
        "enabled": [],
        "name": title,
        "newAction": "disable"
    };
    keys.push( title );

    document.querySelectorAll('.workshopItem a').forEach((e) => {
        data[ title ].enabled.push( new URLSearchParams(new URL(e.href).search).get('id') );
    });

    GM_setValue(title, data[ title ]);

    saveAs(new Blob([JSON.stringify(data)], {type: "text/plain;charset=utf-8"}), "addonpresets.txt");
    alert('install to "garrysmod\\settings\\addonpresets.txt"');
})();