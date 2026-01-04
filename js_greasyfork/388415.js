// ==UserScript==
// @name         kusonime direct download
// @namespace    kusonime
// @version      2
// @description  yes
// @author       Yakult
// @match        https://kusonime.com/*
// @icon         https://www.google.com/s2/favicons?domain=kusonime.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/388415/kusonime%20direct%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/388415/kusonime%20direct%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lth = $(`.dlbod
    > .smokeddl
    > .smokeurl
    > a`
               ).length
    /*var j =
    $('.smokeurl > a')[0].href.split('&url=')
    [1].replace('&type=2','')
    $('.dlbod')
    [0].append
    (decodeURIComponent(j)
    )*/
    for(let i=0;
        i<lth;
        i++){
        var x = atob($('.smokeurl > a'
                                    )[i].href.split('&url='
                                                   )[1].replace('&type=2',''
                                                               )
                                  )
        var br = document.createElement('br'
                                       )
        var xhref = document.createElement('a'
                                          )
        xhref.innerHTML = x
        xhref.href = x
        /*$('.dlbod')[0].append(xhref)        $('.dlbod')[0].append(br)*/
        $('.smokeurl > a'
         )[i].href = x;
    }
    function mousedwn(e
    ){
        try{
            if(event.button==2||event.button==3)
                return true
        }catch(
            e
            ){
            if(e.which==3
              )return true
        }}
    document.oncontextmenu=function(){
        return true};
    document.ondragstart=function(){
        return true};
    document.onmousedown=mousedwn
    document.onkeydown=function(
    e){
        e=e||window.event;
        if(
            e.keyCode==123||e.keyCode==18
        ){
            return true
        }
    }
    // Your code here...
})();