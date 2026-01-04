// ==UserScript==
// @name         Mfw
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.mafengwo.cn/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420993/Mfw.user.js
// @updateURL https://update.greasyfork.org/scripts/420993/Mfw.meta.js
// ==/UserScript==

(function() {
    function openall(){
        alert('afs')
    }
    'use strict';
    console.log('version')


    $('.s-head-logo').append('<button id="sad">click me open all tag</button>')
    var aList = []
    console.log($('.att-list ul li div .flt1 a').length)
    for (var i=0;i<$('.att-list ul li div .flt1 a').length;i++){

        aList.push($('.att-list ul li div .flt1 a')[i].href)

    }
    console.log(aList)
    $('#sad').click(function(){
        for(i in aList){
            window.open(aList[i], "_blank")

        }

    })





    // Your code here...
})();

