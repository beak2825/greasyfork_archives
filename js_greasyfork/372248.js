// ==UserScript==
// @name         zdfans
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yungs
// @match        http*://www.zdfans.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372248/zdfans.user.js
// @updateURL https://update.greasyfork.org/scripts/372248/zdfans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var ElementArray;
    document.onload=Delay();
    function Delay()
    {
        setTimeout(GetAddress,200);
    }
    function GetAddress()
    {
        var p = document.getElementsByClassName("entry")[0];
        var pLen = p.children.length;
        for(var i = 0;i < pLen;i++)
        {
            var a = p.children[i].getElementsByTagName("a");
            if (a.length > 0)
            {
                var intxt = a[0].href;
                if (intxt.indexOf("http")>-1)
                {
                    p.insertBefore(p.children[i],p.children[0]);
                }
            }
        }
        //var dP = p.children[pLen-1];
        //var dPa = p.children[pLen-2];
        //p.insertBefore(dP,p.children[0]);
        //p.insertBefore(dPa,p.children[0]);
    }
})();