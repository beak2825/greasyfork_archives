// ==UserScript==
// @name         Block Websites for your Kids
// @namespace    https://greasyfork.org/en/users/744284-moatazomr
// @version      0.6
// @description  Blocks Access to websites you do not want your kids seeing!
// @author       Moataz Omar
// @match        *://*/*
// @compatible   Chrome
// @compatible   Firefox
// @compatible   Edge
// @grant        none
// @copyright    GPL
// @downloadURL https://update.greasyfork.org/scripts/422777/Block%20Websites%20for%20your%20Kids.user.js
// @updateURL https://update.greasyfork.org/scripts/422777/Block%20Websites%20for%20your%20Kids.meta.js
// ==/UserScript==


(function() {
    'use strict';
// ---Variables---

var host = window.location.hostname.replace('www.', '');
 //   alert(host);

var result = searchHost(host);
    if(host.indexOf("duckduckgo")>-1)
       {

    $("a[data-zci-link=\"videos\"]").remove();
    $(".module").remove();

    if(location.href.toString().indexOf('videos') >0)
    {
       location.href= location.href.replace(/videos/g, ' ');
        //alert('open=' +location.href.replace(/videos/g, ' '));
    }

       }


})();

function blockedUrl()
{
    var doc = document;
var con = confirm;
var al = alert;
var page_reload = open('https://duckduckgo.com/', '_self').close();




// ---Functions---
doc.title = 'Forbiden Content';
//con("This Site is NOT for Kids! Go watch some YouTube instead!")&&window.open("");
//al("Website Blocked!");
page_reload;

al("Parental Advisory: Website Contains Explicit Content not suited for children!")
//window.open("");
}

function searchHost(host)
{
   // host = 'twinkbfvideos.com';
 fetch("https://raw.githubusercontent.com/chadmayfield/pihole-blocklists/master/lists/pi_blocklist_porn_top1m.list")
            .then(function (response) {
                response.text().then(function (responseText) {
               //   alert( (host)  );
                    if(responseText.indexOf(host)>= 0 || customlist.indexOf(host)>= 0 )
                    {
                        blockedUrl();
                    }
                });
            });
}
//https://github.com/StevenBlack/hosts

var customlist =
    'youm7.com;\
google.com;\
wikimedia.org;';
