// ==UserScript==
// @name         KittyCats Profiler ID Popup
// @namespace    es.jessjon.kittycats.profileid
// @version      1.8.0.0
// @description  Open forebears' profiles by clicking names, and show dominance rankings
// @author       Jessica Jones
// @match        https://cat.kittycats.de/tools/pv.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kittycats.de
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://jessjon.es/kittytraits/jquery-csv.min.js#sha256=d16c525c691d359546d2a830ceb3d69bf2e7a35f999381df1ce973706655be0d
// @license      NO LICENSE - Please do not redistribute without permission ❤
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @connect      jessjon.es
// @downloadURL https://update.greasyfork.org/scripts/477079/KittyCats%20Profiler%20ID%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/477079/KittyCats%20Profiler%20ID%20Popup.meta.js
// ==/UserScript==

// ⚠ PLEASE NOTE ⚠
// This script makes several calls to my *personal* server
// (roughly seven a day any day you're looking at cat profiles).
// I ask that you **NOT** share this script with anyone who is not LazyCats staff.
// If you are LazyCats staff and you at some point part ways with LazyCats you may continue
// to use this script for yourself, but please refrain from distributing it to others.

/* global $ */
var version = GM_info.script.version;
var debug = false;

var popup;
var settingbutton;
var compressedstyle;
var ns = 'es.jessjon.kittycats.profileid.'

var traits = ["fur", "eye", "shade", "tail", "ear", "wc", "ws"];
var ordinals = [" !"," ²"," ³"];

var d = new Date();
var datestamp = "?" + d.getFullYear() + d.getMonth() + d.getDay();

var baseUrl = 'https://jessjon.es/kittytraits/';
var csvUrls = {
               fur:   baseUrl + 'fur.csv' + datestamp,
               eye:   baseUrl + 'eye.csv' + datestamp,
               shade: baseUrl + 'shade.csv' + datestamp,
               tail:  baseUrl + 'tail.csv' + datestamp,
               ear:   baseUrl + 'ear.csv' + datestamp,
               wc:    baseUrl + 'wcolor.csv' + datestamp,
               ws:    baseUrl + 'wshape.csv' + datestamp
              };

var last = {
            fur:   localStorage.getItem(ns+'last_fur'),
            eye:   localStorage.getItem(ns+'last_eye'),
            shade: localStorage.getItem(ns+'last_shade'),
            tail:  localStorage.getItem(ns+'last_tail'),
            ear:   localStorage.getItem(ns+'last_ear'),
            wc:    localStorage.getItem(ns+'last_wc'),
            ws:    localStorage.getItem(ns+'last_ws')
           };

var spanmap = {
               0: "fur",
               1: "eye",
               3: "shade",
               4: "tail",
               5: "ear",
               6: "wc",
               7: "ws"
              };

var settings = {
                compressed:  true,
                ctrlswap:    false,
                ordinals:    [" !"," ²",' ³'],
                showretired: true,
                showlimited: true,
                showorig:    false
               };

var screwmap = {
                "Odyssey Slime And Sky": "Odyssey Slime & Sky",
                "End o' The Rainbow": "End o'The Rainbow",
               };

var traitData = {};

//global $ = $;

function normalizeTrait(str) {
    return str.replace(/\s+-\s+/,"-").toLowerCase().trim();
}

function normalizeTraitData(obj) {
    var out = new Array();
    for (var i = 0; i < obj.length; i++) {
        out[i] = new Array();
        obj[i].forEach(function(t, x) {
            out[i][x] = normalizeTrait(String(t));
        });
    };
    return out;
}

traits.forEach(function(t, i) {
    if (last[t] == null || last[t] < (Date.now() - 86400)) {
        //console.log(t);
        GM_xmlhttpRequest({
            method: "GET",
            url: csvUrls[t],
            nocache: true,
            onload: function (response) {
                // parse the JSON data
                //console.log(response.status);
                traitData[t] = normalizeTraitData($.csv.toArrays(response.responseText));
                //console.log(traitData[t]);
                //console.log(last[t]);
                last[t] = Date.now();
                localStorage.setItem(ns+'last_'+t, Date.now());
                localStorage.setItem(ns+'traitdata_'+t, JSON.stringify(traitData[t]));
            }
        });
    } else {
        traitData[t] = normalizeTraitData(JSON.parse(localStorage.getItem(ns+'traitdata_'+t)));
        //console.log(traitData[t]);
    }
    // manually set Confetti dominance because it's just easier
    traitData.confetti = JSON.parse('[["Confetti-CocoBerry"],'+
                                     '["Confetti-BlueBerry"],'+
                                     '["Confetti-PlumBerry"],'+
                                     '["Confetti-OrangeBerry"],'+
                                     '["Confetti-CherryBerry"],'+
                                     '["Confetti-AppleBerry"],'+
                                     '["Confetti-LemonBerry"],'+
                                     '["Confetti-GrapeBerry"],'+
                                     '["Confetti-TealBerry"],'+
                                     '["Confetti-PinkBerry"],'+
                                     '["Confetti-LimeBerry"]]');
    //console.log(traitData['fur']);
});

function copyToClipboard(catid) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(catid).select();
    document.execCommand("copy");
    $temp.remove();
}

function getChildIndex (element) {
  return Array.from(element.parentNode.children).indexOf(element);
}

function toggleSettings() {
    var psb = document.getElementById("popupSettingsBox");
    if ($(psb).hasClass("hidden")) {
        $(psb).removeClass("hidden");
    } else {
        $(psb).addClass("hidden");
    }
}

function toggleCompressed() {
    var innerStyle = $(compressedstyle).html()
    if (innerStyle.substring(0,2) == "/*") {
        var len = innerStyle.length - 5;
        $(compressedstyle).html(innerStyle.substring(3, len));
        settings.compressed = true;
        $("#compressSettings").prop('checked',true);
        $(".infobox-bot").each(function() {
            $(this).children('span').first().prevAll().remove();
            $(this).html($(this).html().substring($(this).html().indexOf("<span")));
        });
    } else {
        $(compressedstyle).html("/*\n" + innerStyle + "\n*/");
        settings.compressed = false;
        $("#compressSettings").prop('checked',false);
        $(".infobox-bot").each(function() {
            $(this).html("&nbsp;<br>\n" + $(this).html());
        });
    }
    localStorage.setItem(ns+'settings', JSON.stringify(settings));
}

function toggleRetired() {
    settings.showretired = $("#showRetired").prop('checked');
    localStorage.setItem(ns+'settings', JSON.stringify(settings));
}

function toggleLimited() {
    settings.showlimited = $("#showLimited").prop('checked');
    localStorage.setItem(ns+'settings', JSON.stringify(settings));
}

function toggleOriginal() {
    settings.showorig = $("#showOrig").prop('checked');
    localStorage.setItem(ns+'settings', JSON.stringify(settings));
}

function traitReload() {
//    alert("This would reload traits");
    traits.forEach(function(t, i) {
        localStorage.setItem(ns+'last_'+t, 0);
        if (localStorage.getItem(ns+'traitdata_'+t) != null) {
            localStorage.removeItem(ns+'traitdata_'+t);
        }
    });
    location.reload();
}

function toggleDebug() {
    debug = $("#logDebug").prop('checked');
}

function bindMouseover() {
    $("span").mouseover(function(e) {
        if (debug) console.log(e);
        var parent = this.parentNode;
        var p = parent.querySelectorAll('span:not(.iscostume)');
        var nodesArray = Array.from(p);
        var index = nodesArray.indexOf(this);
        var traitid = $(this).attr('trait');
        var recessiveness = $(this).attr('title');
        if (typeof recessiveness !== 'undefined') return;
        if (index < 0 || traitid === null) return;
        var selector = '[trait="'+traitid+'"]';
        var traitdivs = document.querySelectorAll(selector);
        var traittype = spanmap[index];
        if (traittype == null) return;
        var traitname = this.innerText;
        if (screwmap.hasOwnProperty(traitname)) {
            traitname = screwmap[traitname];
        }
        var traitpos = '';
        //console.log(traitname);
        var traitlist;
        if (traittype == 'fur' && traitname.startsWith("Confetti")) {
            traitlist = traitData.confetti;
        } else {
            traitlist = traitData[traittype];
        }
        traitname = normalizeTrait(traitname);
        for (var idx in traitlist) {
            var i = traitlist[idx].findIndex(element => {
                if(element.startsWith(traitname)) {
                    if (debug) console.log(idx + ": " + traitname);
                    var paren = element.indexOf('(');
                    var ast = element.indexOf('*');
                    var domo = element.indexOf(' is ');
                    var sub = element.substring(0, paren).trim();
                    if (traitname == sub) return true;
                    sub = element.substring(0, ast).trim();
                    if (traitname == sub) return true;
                    sub = element.substring(0, domo).trim();
                    if (traitname == sub) return true;
                    if (traitname == element.trim()) return true;
                }
                return false;
            });
            var t = traitlist[idx][i];
            var traitspec = '';
            if (i >= 0) {
                if (debug) console.log(t);
                if (t.includes(' *') && settings.showorig) traitspec += ' (OG)';
                if (t.includes('(retired)') && settings.showretired) traitspec += ' - Retired';
                else if (t.includes('(ltd.') && settings.showlimited) traitspec += ' - Limited';
            }
            var recessive = traitlist.length - idx - 1;
            var recInd = '';
            if (recessive < 3) {
                recInd = ordinals[recessive];
            }
            if (i === 0) {
                idx++;
                traitpos = `${idx}${recInd}${traitspec}`;
                break;
            } else if (i > 0) {
                idx++;
                traitpos = `≥ ${idx}${traitspec}`;
                break;
            }
        }
        traitdivs.forEach((trait) => {
            $(trait).attr('title',traitpos);
        });
    });
}

$(".infobox > .infobox-top > span").click(function(e) {
    var catId = $(this).attr("trait");
    var catName = $(this).text();
    if (e.ctrlKey) {
        window.open('https://cat.kittycats.de/tools/pv.php?id='+catId, '_blank');
        return false;
    }
    var pLeft = event.pageX;
    var pTop = event.pageY - 25;
    popup = $("#clipCopyNotice");
    var catNameSpan = $("#clipCopyNoticeCatName");
    //console.log(popup);
    catNameSpan.html(catName);
    popup.css("top", pTop);
    popup.css("left", pLeft);
    popup.fadeIn(200);
    popup.css("display", "flex");
    copyToClipboard(catId);
    window.setTimeout(function(p) {
        popup.fadeOut(200);
    }, 1000);
});

$(document).ready(function() {
    var catid = window.location.href.split('id=')[1];
    var selector = '[trait="'+catid+'"]';
    var catname = document.querySelector(selector).innerText;
    var $title = $("<title>"+catname+" - cat.kittycats.de</title>");
    $("head").append($title);
    var $popup = $("<div>");
    $popup.attr("id","clipCopyNotice");
    $popup.html("<span id=\"clipCopyNoticeCatName\"></span>'s ID copied to clipboard!");
    $("body").append($popup);
    var $setbtn = $("<div>");
    $setbtn.attr("id","profilerPopupSettings");
    $setbtn.attr("title","KittyCats Profiler ID Popup Settings");
    $setbtn.html(`<?xml version="1.0" encoding="utf-8"?>
<svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px" viewBox="192 192 128 128" xml:space="preserve">
<path d="M319.7,263.8v37c0,5.3-2.2,10.1-5.6,13.6c-3.5,3.5-8.3,5.6-13.6,5.6h-89c-5.3,0-10.1-2.2-13.6-5.6
c-3.5-3.5-5.6-8.3-5.6-13.6v-89.6c0-5.3,2.2-10.1,5.6-13.6c3.5-3.5,8.3-5.6,13.6-5.6h36.8v15.5h-36.8c-1,0-2,0.4-2.6,1.1
c-0.7,0.7-1.1,1.6-1.1,2.6v89.6c0,1,0.4,2,1.1,2.6c0.7,0.7,1.6,1.1,2.6,1.1h89c1,0,2-0.4,2.6-1.1c0.7-0.7,1.1-1.6,1.1-2.6v-37H319.7
z M304.2,217.9l-15.4,15.9c-3,3-7.9,3.1-10.9,0.1c-3-3-3.1-7.9-0.1-10.9l15.1-15.5h-15.5c-4.3,0-7.7-3.5-7.7-7.7
c0-4.3,3.5-7.7,7.7-7.7H312c4.3,0,7.7,3.5,7.7,7.7v33.8c0,4.3-3.5,7.7-7.7,7.7c-4.3,0-7.7-3.5-7.7-7.7V217.9z"/>
<g><g><path d="M222.2,245.1l6.8,6.8c-1.7,2.5-2.8,5.2-3.3,8.1H216v8.9h9.6c0.6,2.8,1.7,5.6,3.3,8.1l-6.8,6.8l6.3,6.3l6.8-6.8
c2.5,1.7,5.2,2.8,8.1,3.3v9.6h8.9v-9.6c2.8-0.6,5.6-1.7,8.1-3.3l6.8,6.8l6.3-6.3l-6.8-6.8c1.7-2.5,2.8-5.2,3.3-8.1h9.6v-8.9h-9.6
c-0.6-2.8-1.7-5.6-3.3-8.1l6.8-6.8l-6.3-6.3l-6.8,6.8c-2.5-1.7-5.2-2.8-8.1-3.3v-9.6h-8.9v9.6c-2.8,0.6-5.6,1.7-8.1,3.3l-6.8-6.8
L222.2,245.1z M257.4,274.1c-5.3,5.3-14,5.3-19.4,0c-5.3-5.3-5.3-14,0-19.4c5.3-5.3,14-5.3,19.4,0
C262.8,260,262.8,268.7,257.4,274.1z"/></g></g></svg>`);
    $("body").append($setbtn);
    document.getElementById("profilerPopupSettings").addEventListener("click", toggleSettings, false);
    var $settingbox = $("<div id=\"popupSettingsBox\">");
    var $settingframe = $("<div class=\"popupSettingsDialog\">");
    $settingframe.append("<div><input type=\"checkbox\" id=\"compressSettings\" checked=\"checked\"></input><label for=\"compressSettings\">Compact profiles</label></div>");
    $settingframe.append("<div><input type=\"checkbox\" id=\"showRetired\" checked=\"checked\"></input><label for=\"showRetired\">Label retired traits</label></div>");
    $settingframe.append("<div><input type=\"checkbox\" id=\"showLimited\" checked=\"checked\"></input><label for=\"showLimited\">Label limited edition traits</label></div>");
    $settingframe.append("<div><input type=\"checkbox\" id=\"showOrig\"></input><label for=\"showOrig\">Label original (first release) traits</label></div>");
    $settingframe.append("<div><input type=\"checkbox\" id=\"logDebug\"></input><label for=\"logDebug\">Output debug logging to console 🛠️</label></div>");
    $settingframe.append("<div class=\"noticebox\" id=\"beKind\"><p><button id=\"traitReload\">Reload traits</button></p></div>");
    $settingframe.append("<div class=\"version\">v"+version+"</div>");
    $settingbox.append($settingframe);
    $settingbox.addClass("hidden");
    $settingbox.append("<div id=\"popupSettingsClose\">X</div>");
    $("body").append($settingbox);
    $("#beKind").prepend("<p>⚠️ <b>Please be kind!</b></p><p>Reloading traits makes an extra set of calls to my server; please try to not use it too frequently.</p>");
    document.getElementById("traitReload").addEventListener("click", traitReload, false);
    document.getElementById("compressSettings").addEventListener("click", toggleCompressed, false);
    document.getElementById("showRetired").addEventListener("click", toggleRetired, false);
    document.getElementById("showLimited").addEventListener("click", toggleLimited, false);
    document.getElementById("showOrig").addEventListener("click", toggleOriginal, false);
    document.getElementById("logDebug").addEventListener("click", toggleDebug, false);
    document.getElementById("popupSettingsClose").addEventListener("click", toggleSettings, false);
    compressedstyle = GM_addStyle (`
    .infobox {
        width: 180px !important;
    }
    .infobox-bot {
        height: 82px !important;
    }
    .gen4col .pbox {
        height: 208px !important;
    }
    .gen5col .pbox {
        height: 102px !important;
    }
    .gen2col, .gen3col, .gen4col {
        width: 196px !important;
    }
    .gen2col .boxspacer {
        height: 335px !important;
    }
    .gen3col .boxspacer {
        height: 114px !important;
    }
    .gen3col .pboxspacer {
        height: 88px !important;
    }
    `);
//    console.log($(compressedStyle).html());
//    $(compressedStyle).html('/*' + $(compressedStyle).html() + '*/');
//    console.log($(compressedStyle).html());
    GM_addStyle (`
    #profilerPopupSettings {
        position: fixed;
        height: 25px;
        width: 25px;
        z-index: 1000;
        top: 1px;
        left: 1px;
        padding: 2px;
        border-radius: 4px;
        background-color: #999;
        cursor: pointer;
    }
    #clipCopyNotice {
        position: fixed;
        height: 25px;
        width: 200px;
        background-color: #666;
        color: #ccc;
        font-family: Arial;
        font-size: 12px;
        border-radius: 10px;
        text-align: center;
        padding: 5px;
        display: none;
        align-items: center;
    }
    #popupSettingsClose {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        background-color: #a00;
        color: #fff;
        border-radius: 3px;
        text-align: center;
        font-family: arial, helvetica, sans-serif;
        font-weight: 900;
        font-size: 14px;
        cursor: pointer;
    }
    #popupSettingsBox {
        position: fixed;
        z-index: 1001;
        top: 20px;
        left: 20px;
        width: 455px;
        height: 300px;
        border: 2px solid black;
        border-radius: 4px;
        background-color: #999;
    }
    div.popupSettingsDialog {
        margin: 2em;
        font-family: Arial;
        font-size: 14px;
    }
    #popupSettingsBox.hidden {
        top: -1px;
        left: -1px;
        width: 1px;
        height: 1px;
        border: none;
        display: none;
    }
    .noticebox {
        border: 1px solid #633;
        padding: 0.5em;
        margin-top: 0.5em;
    }
    .noticebox>p {
        margin: 0.5em 0.5em;
    }
    .version {
        font-size: 80%;
        font-weight: bold;
        color: #333;
        position: absolute;
        bottom: 3px;
        right: 3px;
        text-align: right;
    }
    @media (prefers-color-scheme: dark) {
        body {
            background-color: #444;
        }
        .infobox-top {
            color: #EEE;
        }
        .infobox-bot {
            background-color: #333;
            color: #CCC;
        }
        .infobox-top.fem {
            background-color: #656;
            border-color: #636;
        }
        .infobox-bot.fem {
            border-color: #636;
        }
        .infobox-top.mal {
            background-color: #566;
            border-color: #366;
        }
        .infobox-bot.mal {
            border-color: #366;
        }
    }
    `);
    var setstr = localStorage.getItem(ns+'settings');
    if (typeof setstr == "string" && setstr.length > 0) {
        settings = JSON.parse(setstr);
        toggleCompressed();
        toggleCompressed();
        bindMouseover();
        console.log(settings);
    }

});