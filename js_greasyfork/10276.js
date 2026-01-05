// ==UserScript==
// @name           Prevent Twitter Popup
// @author         Mikhoul Based Heavily on Script From at_akada
// @description    This script bypass twitter popup and go straight to profile page.
// @version        1.00
// @include        https://twitter.com/*
// @namespace https://greasyfork.org/users/3930
// @downloadURL https://update.greasyfork.org/scripts/10276/Prevent%20Twitter%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/10276/Prevent%20Twitter%20Popup.meta.js
// ==/UserScript==
 
function bind(arg, f){
    return function(){
        return f(arg, arguments);
    };
}
function main(){
    var list = document.body.getElementsByTagName('a');
    for(var i=0; i<list.length;++i){
        if(list[i].className.indexOf('js-action-profile') >= 0 || list[i].className.indexOf('twitter-atreply') >= 0){
            list[i].className = '';
            list[i].addEventListener('click', 
                                     bind(list[i], function(link, args){
                                              document.location = link.href;
                                              args[0].stopPropagation();
                                              args[0].preventDefault();
                                          }));
        }
    }
}
setInterval(main, 1);
