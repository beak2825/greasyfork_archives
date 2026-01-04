// ==UserScript==
// @name         sf
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://segmentfault.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421916/sf.user.js
// @updateURL https://update.greasyfork.org/scripts/421916/sf.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('version')


    $('.pager').append('<button id="sad">click me open all tag</button>')

    $('.pager').append('<input id="sadinput" > </input>')
    $('.pager').append('<button id="submit">open</button>')
    var aList = []
    let flist = []


    $('#sad').click(function(){


        for (var i=0;i<$('.news__item-info a').length;i++){
            aList.push($('.news__item-info a')[i].href)

    }

        let setlist = new Set(aList)
        console.log(setlist)
        flist = Array.from(setlist)
        console.log(flist.length)
        $('.pager').append('<div>'+flist.length+'</div>')

    })

    $('#submit').click(function(){
        let amid = $('#sadinput').val().split(',')
        console.log(amid)

        for(var j=amid[0];j<amid[1];j++){
            console.log(1)
            window.open(flist[j], "_blank")

        }



    })



    // Your code here...
})();