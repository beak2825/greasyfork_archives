(function() {
    'use strict';
// ==UserScript==
// @name         Prepare codius.ru
// @namespace    https://greasyfork.org/ru/scripts/373137-prepare-codius-ru
// @version      0.1
// @description  Kill class 'leftpart','linenumbers','pnum'
// @author       skirda
// @include /^https?://codius\.ru\/articles\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373137/Prepare%20codiusru.user.js
// @updateURL https://update.greasyfork.org/scripts/373137/Prepare%20codiusru.meta.js
// ==/UserScript==

console.log("Start Prepare codius.ru");
function main()
{
    if (document.readyState !== 'complete')
    {
        console.log(document.readyState);
        setTimeout(main, 1000);
        return;
    }

    console.log(document.readyState);

    var a=['leftpart','linenumbers','pnum'];
    for(let i=0; i < a.length; ++i)
    {
        while(1)
        {
            var t=document.getElementsByClassName(a[i]);
            if(!t.length) break;
            t[0].remove()
        }
    }

    var cnt=document.getElementsByClassName("codecontainer");
    console.log("cnt=",cnt.length);
    for(let i=0; i < cnt.length; ++i)
    {
        document.getElementsByClassName("codecontainer")[i].innerHTML="<pre>" + document.getElementsByClassName("codecontainer")[i].innerHTML + "</pre>"
    }
}

main();
})();