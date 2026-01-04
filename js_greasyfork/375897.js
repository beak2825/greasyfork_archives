// ==UserScript==
// @name         抖音PC版網頁測試
// @namespace    https://greasyfork.org/zh-TW/scripts/375897
// @version      2019.01.05.0001
// @description  try to take over the world!
// @author       You
// @match        https://www.iesdouyin.com/*
// @match        https://www.dyshortvideo.com/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375897/%E6%8A%96%E9%9F%B3PC%E7%89%88%E7%B6%B2%E9%A0%81%E6%B8%AC%E8%A9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/375897/%E6%8A%96%E9%9F%B3PC%E7%89%88%E7%B6%B2%E9%A0%81%E6%B8%AC%E8%A9%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    poi();
    console.log( 'poi' );

    // Your code here...
})();
function poi0(){
    var x = document.querySelectorAll(".video-player");
    for(var i = 0; i < x.length; i++){
        console.log( x[i].attributes );
        console.log( x[i].getAttribute('style') );
        var x2 = window.getComputedStyle(x[i], null);
        console.log( x2.backgroundImage );

        var patt = new RegExp("url(.*)");
        var res = patt.test(x2.backgroundImage);
        console.log( res );

        patt = new RegExp("(http.*jpg)");
        //res = patt.test(x2.backgroundImage);
        var x3 = x2.backgroundImage.match(patt);//
        console.log( x3 );
        console.log( x3.length,x3[0] );
    }
}

function poi(){
    document.addEventListener("readystatechange", function(e){
        //console.log( e,this,this.readyState );
        console.log( this.readyState );
    });
    document.addEventListener("DOMContentLoaded", function(e){
        console.log( 'DOMContentLoaded' );
    });
	var id01=document.getElementById('pageletReflowVideo');
    id01.setAttribute("style", "color:red; border: 1px solid blue;");

    var y = document.querySelector(".video-player");
    var y2 = window.getComputedStyle(y, null);
    var patt = new RegExp("(http.*jpg)");
    var y3 = y2.backgroundImage.match(patt);//
    console.log( y3[0] );
    var y4 = '<img src="'+y3[0]+'">';
    id01.insertAdjacentHTML('afterEnd', y4);



}