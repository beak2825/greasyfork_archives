// ==UserScript==
// @name         dban_get_allUser_under_group
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.douban.com/group/crazymovie/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421506/dban_get_allUser_under_group.user.js
// @updateURL https://update.greasyfork.org/scripts/421506/dban_get_allUser_under_group.meta.js
// ==/UserScript==

(function() {
    function openall(){
        alert('afs')
    }
    'use strict';
    console.log('version')


    $('.nav-logo').append('<button id="sad">click me open all tag</button>')
    var aList = []

    $('#sad').click(function(){


        for (var i=0;i<$('.member-list ul li a').length;i++){
            aList.push($('.member-list ul li a')[i].href)
            

    }
        let setlist = new Set(aList)
        console.log(setlist)
        let flist = Array.from(setlist)
        for(var j=0;j<flist.length;j++){
            window.open(flist[j], "_blank")

        }


    })





    // Your code here...
})();

