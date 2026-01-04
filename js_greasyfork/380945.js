// ==UserScript==
// @name         muahahaha no fragment
// @namespace    muahahaha
// @version      1.1.0
// @description  fuck google, fuck w3, i have my own deeper link
// @include      *
// @grant        unsafeWindow
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/380945/muahahaha%20no%20fragment.user.js
// @updateURL https://update.greasyfork.org/scripts/380945/muahahaha%20no%20fragment.meta.js
// ==/UserScript==

(function() {

'use strict';

function run_wjq(func){
    if(
        typeof(unsafeWindow.$)==='function'
        &&typeof(unsafeWindow.$.fn)==='object'
        &&typeof(unsafeWindow.$.fn.jquery)==='string'
    ){
        func();
    }
    else{
        var s=document.createElement('script');
        s.setAttribute('src','https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js');
        s.addEventListener('load',func);
        document.querySelector('body').appendChild(s);
    }
}

function run_iir(func){
    if(document.readyState==='complete'){
        func();
    }
    else{
        window.addEventListener('load',func);
    }
}

function run_wjq_iir(func){
    run_wjq(function(){run_iir(func);});
}

run_wjq_iir(function(){
    console.log('muahahaha no fragment\nUSO:\thttps://api.jquery.com/contains-selector/\n\thttps://api.jquery.com/contains-selector/##:contains(Example)\nBUSCANDO: "'+decodeURIComponent(location.hash.slice(2))+'"\n',(new Date()));
    if(location.hash.slice(0,2)==='##'){
        var o=unsafeWindow.$(decodeURIComponent(location.hash.slice(2)));
        if(o.length){
            o=o.last().offset();
            window.scroll({
                top:o.top-99,
                left:o.left,
                behavior:'smooth'
            });
        }
        else{
            alert('No se encontro un elemento que coincida con el selector: "'+decodeURIComponent(location.hash.slice(2))+'"');
        }
    }
});

})();