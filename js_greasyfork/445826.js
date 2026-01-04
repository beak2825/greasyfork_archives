// ==UserScript==
// @name         ZenMarket Auto Translate Search
// @namespace    an0nyScripts
// @version      0.2
// @description  Auto translate search for better results on ZenMarket.
// @author       an0nymooose
// @match        *zenmarket.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zenmarket.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445826/ZenMarket%20Auto%20Translate%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/445826/ZenMarket%20Auto%20Translate%20Search.meta.js
// ==/UserScript==

//Zen market results lack when searching in english only, this auto translates your search.
//Usage: Translate icon translates+searches, normal search icon does not translate
//Enter by default now translates (Based on TRANSLATE_ON_ENTER)

//Auto translates on enter
var TRANSLATE_ON_ENTER = true;
//Makes the sort dropdown a little easier to click
var MAKE_SORT_DROP_BIGGER = true;

function addTranslateOnLoad(){
    var translateBtn = $("#header1_btnSearch").clone();
    //remove search button class, then add its css properites to new button
    $(translateBtn).attr({"href": "","id":"txtTranslate", "class": "btn btn-default btn-lg input-group-addon",});
    $(translateBtn).css({
        "color": '#555',
        "backgroundColor": '#fff',
        "borderTop": '1px solid #ccc',
        "borderBottom": '1px solid #ccc',
        "borderRight": '1px solid #ccc',
        "border-left": "1px solid #ccc"});
    $(translateBtn).find("span").attr("class","glyphicon glyphicon-transfer");
    $(translateBtn).click(function(e) {
        translateSearch();
    });

    if(TRANSLATE_ON_ENTER){
        $("input[name='header1$tbxSearch']").on('keypress',function(e) {
            if(e.which == 13) {
                e.preventDefault();
                translateSearch();
            }
        });
    }

    //Insert before search btn
    var ilen = $(".input-group").children().length;
    $(".input-group").append(translateBtn);
    $(".input-group").children().eq(ilen-1).before($(".input-group").children().last());
}

function translateSearch(){
    var searchText = $("input[name='header1$tbxSearch']").val();
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ja&hl=en-US&dt=t&dt=bd&dj=1&source=icon&q="+encodeURIComponent(searchText);
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        $("input[name='header1$tbxSearch']").val(data.sentences[0].trans);
        __doPostBack('header1$btnSearch','');
    }).catch(function() {
        console.log("ZenMarket Auto Translate Search: Couldn't translate, oops");
    });
}

(function() {
    'use strict';
    window.addEventListener('load', ()=> {
        if ($("#header1_btnSearch").length >=1) {
            addTranslateOnLoad();
            if(MAKE_SORT_DROP_BIGGER){
                $("#dropdownMenu1").css("width","63%");
                $("#top_panel").children().first().css("width","20%");
            }
        }
    });
})();