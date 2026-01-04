// ==UserScript==
// @name         show JOI difficulty vote value
// @namespace    http://twitter.com/DeltaStruct
// @version      1.2
// @description  show JOI difficulty vote value user script
// @author       DeltaStruct
// @match        https://joi.goodbaton.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500075/show%20JOI%20difficulty%20vote%20value.user.js
// @updateURL https://update.greasyfork.org/scripts/500075/show%20JOI%20difficulty%20vote%20value.meta.js
// ==/UserScript==

window.onload = (function() {
    'use strict';
    var par = document.querySelectorAll("table.DifficultyList_self_KqSSj > tbody > tr");
    var name = document.getElementsByClassName("DifficultyListItem_taskname_CAZIu");
    var day = document.getElementsByClassName("DifficultyListItem_source_SGqCh");
    var attr = [
        "LevelColor_level0_r8zaq",
        "LevelColor_level1_We_DS",
        "LevelColor_level2_r_2Ty",
        "LevelColor_level3_alWBg",
        "LevelColor_level4_fOPlt",
        "LevelColor_level5_kB3gW",
        "LevelColor_level6_Z8Lpr",
        "LevelColor_level7_H7ZIo",
        "LevelColor_level8_vWDa8",
        "LevelColor_level9_izZRQ",
        "LevelColor_level10_ObLz5",
        "LevelColor_level11_xfLN8",
        "LevelColor_level12_qa8z6"
    ];
    var url = [];
    var nw = document.createElement("th");
    var txt = document.createTextNode("投票値");
    nw.appendChild(txt);
    document.querySelector("thead.DifficultyList_header_kKDc5 > tr").insertBefore(nw,document.querySelectorAll("thead.DifficultyList_header_kKDc5 > tr > th")[1]);
    for (var i = 0;i < name.length;++i){
        url.push(day[i].innerHTML.replace("一次予選","予選1-").replace("二次予選","予選2-").replace("春トレ","春合宿"));
        var ne = document.createElement("td");
        var text = document.createTextNode(":|");
        ne. classList.add("DifficultyListItem_level_WJAu6","vote_level");
        ne.appendChild(text);
        par[i].insertBefore(ne,name[i]);
    }
    var vote = document.getElementsByClassName("vote_level");
    try {
        const response = fetch("https://raw.githubusercontent.com/DeltaStruct/JOI_Difficulty_Acquisition/refs/heads/main/main.json").then(response => {
            return response.json();
        }).then(json => {
            for (var i = 0;i < name.length;++i) if (url[i] in json){
                var nw = vote[i];
                var lv = Math.max(0,Math.min(12,Math.round(parseFloat(json[url[i]]))));
                console.log(lv);
                nw. classList.add(attr[lv]);
                nw.textContent = json[url[i]];
            } else {
                var nw = vote[i];
                nw. classList.add("LevelColor_level0_r8zaq");
                nw.textContent = '?';
            }
        }).catch(e => {
            console.log(e.message);
            for (var i = 0;i < name.length;++i){
                var nw = vote[i];
                nw. classList.add("LevelColor_level0_r8zaq");
                nw.textContent = ':(';
            }
        });
    } catch(e) {
        console.log(e.message);
        for (var i = 0;i < name.length;++i){
            var nw = vote[i];
            nw. classList.add("LevelColor_level0_r8zaq");
            nw.textContent = ':(';
        }
    }
    /*
    return 0;
    for (var i = 0;i < name.length;++i){
        fetch(url[i]).then(response => {
            var idx = url.indexOf(decodeURI(response.url));
            if (response.ok){
                response.text().then(text => {
                    var nw = vote[idx];
                    var lv = Math.max(0,Math.min(12,Math.round(parseFloat(text))));
                    nw. classList.add(attr[lv]);
                    nw.textContent = text;
                });
            } else {
                var nw = vote[idx];
                nw. classList.add("LevelColor_level0_r8zaq");
                nw.textContent = '?';
            }
        });
    }*/
})();