// ==UserScript==
// @name         Spiegel NoLaterPay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove LaterPay Paywall
// @author       You
// @match        http://www.spiegel.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21585/Spiegel%20NoLaterPay.user.js
// @updateURL https://update.greasyfork.org/scripts/21585/Spiegel%20NoLaterPay.meta.js
// ==/UserScript==
 
function rot(s, i)
{
         var nStr = "";
         
     for (var x = 0; x < s.length; x++)
     {
        var cc = s.charCodeAt(x);
        if (cc != 32)
                {
                        var c = String.fromCharCode(cc+i);
           nStr += c;
          }
                 else
                  {
            nStr += " ";
          }
       }
       return nStr;
         
}
 
 
function NoBlur()
{
        $('.obfuscated-content').attr('class', 'fagoff');
}
 
function Decrypt()
{
        $('.obfuscated').each(function(index)
        {              
                var html = $(this).html();
               
                while (html.indexOf('<a') !== -1)
                {
                        var start = html.indexOf('<a');
                        var end = html.indexOf('</a>', start + 2) + 4;
 
                        html = html.substr(0, start) + rot(html.substr(start, end - start), 1) + html.substr(end);
                }
               
                $(this).html(rot(html, -1));
                $(this).html($(this).html().replace(/;a=/g, '<b>').replace(/;.a=/g, '</b>'));
        $(this).html($(this).html().replace(/;h=/g, '<i>').replace(/;.h=/g, '</i>'));
        });
}
 
 
(function()
 {
    'use strict';
 
   
        NoBlur();
        Decrypt();
       
       
})();