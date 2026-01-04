// ==UserScript==
// @name         kolNovel Coloring Characters Names
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change the name of characters
// @author       Hussain7Abbas
// @match        https://kolnovel.com/*
// @grant        hussain7abbas
// @downloadURL https://update.greasyfork.org/scripts/423244/kolNovel%20Coloring%20Characters%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/423244/kolNovel%20Coloring%20Characters%20Names.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
 
    var nameList = [
//      ["Color", "Character Name"],
        ["#6e9bff", "تشاو فنغ"],
        ["#ff7878", "تشاو كون"],
        ["#ff7878", "تشاو قان"]
    ];
 
 
 
    var tagsList = document.getElementsByTagName("p");
    for (var i = 0; i < tagsList.length; i++){
        var innerHTML = tagsList[i].innerHTML;
        nameList.forEach(name=>{
            var index = innerHTML.indexOf(name[1]);
            while (index >= 0){
                innerHTML = innerHTML.substring(0,index) + "<span style='color: "+ name[0] + "'>" + innerHTML.substring(index,index+name[1].length) + "</span>" + innerHTML.substring(index + name[1].length);
                index = innerHTML.indexOf(name[1], index+=30);
            }
            tagsList[i].innerHTML = innerHTML;
        });
    }
 
 
})();