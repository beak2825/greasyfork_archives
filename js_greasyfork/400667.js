// ==UserScript==
// @name Scanlation Plus
// @namespace surven
// @description Adds keyboard shortcut for certain scanlation & aggregator sites
// @include *://*scans.*/*
// @include *://*.*scans.*/*
// @include *://*scanz.*/*
// @include *://*.*scanz.*/*
// @include *://*manga.*/*
// @include *://*.*manga.*/*
// @include *://manga*.*/*
// @include *://*.manga*.*/*
// @include *://*.wuxiaworld.com/*
// @include *://wuxiaworld.com/*
// @include *://chessmoba.us/*
// @include *://totallytranslations.com/*
// @include *://sololeveling.club/*
// @version 0.0.1.20200415002734
// @downloadURL https://update.greasyfork.org/scripts/400667/Scanlation%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/400667/Scanlation%20Plus.meta.js
// ==/UserScript==
var Init = function() {
    var Name = window.location.href;
    try {
        var Periods = Name.split("/")[2].split(".");
        Name = (Periods.length === 3 && Periods[1] || Periods[0]);
    } catch(err) {
        Name = "Unknown";
    }
    var Controls = {"kissmanga": {"previous": "btnPrevious", "next": "btnNext", parentNode: true, click: false, selector: false}, "manganelo": {"previous": "navi-change-chapter-btn-prev a-h", "next": "navi-change-chapter-btn-next a-h", parentNode: false, click: false, selector: false}, "wuxiaworld": {"previous": "[src=\"/images/arrow-left.png\"]", "next": "[src=\"/images/arrow-right.png\"]", parentNode: true, click: false, selector: true}, "chessmoba": {"previous": "owl-direction-horizontal prev", "next": "owl-direction-horizontal next", parentNode: false, click: true, selector: false}, "saberscans": {"previous": "[rel=\"prev\"]", "next": "[rel=\"next\"]", parentNode: false, click: false, selector: true}, "totallytranslations": {"previous": "[rel=\"prev\"]", "next": "[rel=\"next\"]", parentNode: false, click: false, selector: true}, "sololeveling": {"previous": "[rel=\"prev\"]", "next": "[rel=\"next\"]", parentNode: false, click: false, selector: true}};
    function doc_keyUp(e) {
        switch (e.keyCode) {
            case 37:
                var ControlPrevious = Controls[Name] && Controls[Name].previous || "fas fa-arrow-left mr-2";
                var ToClickPrevious = Controls[Name] && Controls[Name].click || false;
                var ElementPrevious = Controls[Name] && Controls[Name].selector === true && document.querySelectorAll(ControlPrevious)[0] || document.getElementsByClassName(ControlPrevious)[0];
                try {
                    if (ToClickPrevious) {
                        ElementPrevious.click();
                    } else {
                        window.location.href = (Controls[Name] && Controls[Name].parentNode === true && ElementPrevious.parentNode.href || ElementPrevious.href || Controls[Name] == undefined && ElementPrevious.parentNode.href);
                    }
                }
                catch(err){}
                break;
            case 39:
                var ControlNext = Controls[Name] && Controls[Name].next || "fas fa-arrow-right ml-2";
                var ToClickNext = Controls[Name] && Controls[Name].click || false;
                var ElementNext = Controls[Name] && Controls[Name].selector === true && document.querySelectorAll(ControlNext)[0] || document.getElementsByClassName(ControlNext)[0];
                try {
                    if (ToClickNext) {
                        ElementNext.click();
                    } else {
                        window.location.href = (Controls[Name] && Controls[Name].parentNode === true && ElementNext.parentNode.href || ElementNext.href || Controls[Name] == undefined && ElementNext.parentNode.href);
                    }
                }
                catch(err){}
                break;
            default:
                break;
        }
    }
    document.addEventListener('keyup', doc_keyUp, false);
}
try {
    Init();
} catch (Error) {
    alert("Script Scanlation Plus ran into a issue while starting, error in console.");
    console.log(Error);
}