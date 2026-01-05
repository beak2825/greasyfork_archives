// ==UserScript==
// @name         Hangouts Backwards
// @version      1
// @description  dsrawkcab ffuts yaS | Say stuff backwards
// @match        *://hangouts.google.com/
// @grant        none
// @namespace https://greasyfork.org/users/117222
// @downloadURL https://update.greasyfork.org/scripts/29059/Hangouts%20Backwards.user.js
// @updateURL https://update.greasyfork.org/scripts/29059/Hangouts%20Backwards.meta.js
// ==/UserScript==

(function() {
    function back(r){var n=r.split(""),c="";return n=n.reverse(),n.forEach(function(r){c+=r;}),c;}
    setTimeout(function(){
        var b=window.frames[document.getElementsByTagName('iframe')[0].name].document, c=false;
        b.addEventListener('click',launch,false);
        function launch(){
            setTimeout(function(){
                if(window.frames[document.getElementsByTagName('iframe')[6].name].document){
                    var a=window.frames[document.getElementsByTagName('iframe')[6].name].document;
                    a.addEventListener('keydown',function(e){
                        if(e.keyCode==16){
                            c=true;
                        }
                        if(e.keyCode==13){
                            a.getElementsByClassName('editable')[0].innerHTML=back(a.getElementsByClassName('editable')[0].innerText);
                        }
                    },false);
                    a.addEventListener('keyup',function(e){
                        if(e.keycode==16){
                            c=false;
                        }
                    });
                }else{
                    console.info('Please open a converstion');
                }
            },100);
        }
    },4e3);
})();
