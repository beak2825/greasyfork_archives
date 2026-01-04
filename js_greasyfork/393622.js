// ==UserScript==
// @name         trace.moe
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://trace.moe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393622/tracemoe.user.js
// @updateURL https://update.greasyfork.org/scripts/393622/tracemoe.meta.js
// ==/UserScript==


document.addEventListener("DOMContentLoaded",function(e){
    console.log( "DOMContentLoaded" );
});
document.addEventListener('readystatechange', function(e){
    console.log( 'readystatechange',this.readyState );
});
window.addEventListener('load', function(e){
    console.log( 'load' );
    poi();
});

function poi(){
    var aa = document.querySelector('.noselect');
    console.log( aa );
    aa.insertAdjacentHTML('beforebegin', '字beforebegin');
    aa.insertAdjacentHTML('afterbegin', '字afterbegin');
    aa.insertAdjacentHTML('beforeend', '字beforeend');
    aa.insertAdjacentHTML('afterend', '字afterend');

    var str='';
    str='<button class="btn191212" poi="111">poi</button>';
    aa.insertAdjacentHTML('beforebegin', '字'+str);
    str='<button class="btn191212" poi="222">ypa</button>';
    aa.insertAdjacentHTML('beforebegin', '字'+str);

    //var bb = document.querySelector('button');
    var bb = document.querySelectorAll('button');
    console.log( bb );

    var cc = [...document.querySelectorAll('button')];
    console.log( cc );
    cc.map(function(x){
        //console.log( x.innerText );
        return x.innerText;
    }).filter(function(x){
        //console.log( x );
        return x.includes('poi');
    }).forEach(function(x){
        //console.log( x );
    });
    //https://drafts.csswg.org/selectors/#overview
    var dd = document.querySelectorAll('button.btn191212[poi="111"]');
    console.log( dd[0] );
    dd[0].addEventListener("click", function(x){
        console.log( "click" );
        this.insertAdjacentHTML('afterend', '字');
        var ee = document.querySelector('video');
        console.log( ee.src );
    });



}//
