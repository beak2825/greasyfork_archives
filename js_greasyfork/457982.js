// ==UserScript==
// @name         leise auf laut.de
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ignore all unwanted users on laut.de
// @author       CAPSLOCKFTW
// @match        https://www.laut.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=laut.de
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/458061/leise%20auf%20lautde.user.js
// @updateURL https://update.greasyfork.org/scripts/458061/leise%20auf%20lautde.meta.js
// ==/UserScript==

(async() => {
    'use strict';
    // init banlist as new Array
    var banlist = new Array;
    // load the greasemonkey value for the ignore list
    await GM.getValue("ignorelist", false).then((value) => {
        banlist = value;
    });
    // check if ignore list is empty, populate it if it is and stringify the list to JSON
    if(banlist==false){
       banlist=["64453"];
       GM.setValue("ignorelist",JSON.stringify(banlist))
    }
    // otherwise parse the JSON-Data
    else{
        banlist=JSON.parse(banlist);
    }
    // add ignore buttons to every comment and delete list button
    $("a.created_at").after(' <input type="button" value="ignore" style="border: none"></input>');
    $("#fuss").before("<input type='button' value='Ignorierliste löschen' id='bandel'>")
    // remove all comments by ids on the banlist
    for(var i in banlist){
        $("[data-user-id="+banlist[i]+"]").remove();
    }
    // add a function to all ignore buttons that adds their authors to the ignore list
    $("[value='ignore']").on('click', addAndReload);
    function addAndReload(){
        var potentialComment = $(this).parent().parent()[0];
        if(potentialComment.hasAttribute("data-user-id")){
            banlist.push(potentialComment.attributes["data-user-id"].value);
        }
        else{
            banlist.push(potentialComment.parentNode.attributes["data-user-id"].value);
        }
        for(var i in banlist){
            $("[data-user-id="+banlist[i]+"]").remove();
        }
        GM.setValue("ignorelist",JSON.stringify(banlist))
    }
    $("[id='bandel']").on('click',delBanlist);
    function delBanlist(){
        GM.deleteValue("ignorelist");
        window.location.reload();
    }
})();
