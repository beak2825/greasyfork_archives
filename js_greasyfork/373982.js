// ==UserScript==
// @name         Steamgift DynSign to AWA
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Convert Mybb code to html code ([img] -> <img>)
// @author       Mhaw
// @match        https://www.steamgifts.com/giveaway/*/signature
// @grant        none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/373982/Steamgift%20DynSign%20to%20AWA.user.js
// @updateURL https://update.greasyfork.org/scripts/373982/Steamgift%20DynSign%20to%20AWA.meta.js
// ==/UserScript==

(function() {
    function myFunction() {
  var copyText = document.getElementById("myInput");
  copyText.select();
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}
    'use strict';
    document.body.innerHTML = document.body.innerHTML.replace('[url=','&lt;p&gt;&lt;a href="');
    document.body.innerHTML = document.body.innerHTML.replace('][img]','" rel="nofollow\"&gt[img]');
    document.body.innerHTML = document.body.innerHTML.replace('[img]','&lt;img alt="" src="');
    document.body.innerHTML = document.body.innerHTML.replace('[/img][/url]','" /&gt;&lt;/a&gt;&lt;/p&gt;');
    document.body.innerHTML = document.body.innerHTML.replace(/strong/g,'textarea');
    document.body.innerHTML = document.body.innerHTML.replace('textarea', 'br /><div style="width: 75%;"><textarea id="AWAcode" style="height: 50px; max-height: 50px; width: 90%;"');
    document.body.innerHTML = document.body.innerHTML.replace('</textarea>', '</textarea><button id="clipcopy" class="featured__column featured__column--group" style="cursor: pointer; float: right; height: 100%; padding: 10px; padding-left: 15px; padding-right: 15px;">Copy</button></div><span id="AWAcodeS" style="color: #FF00FF; display: none;">AWA code have been copied to your clipboard !</span>');
    document.getElementById('clipcopy').addEventListener('click', function() {
        var copyText = document.getElementById("AWAcode");
        copyText.select();
        document.execCommand("copy");
        document.getElementById("AWAcodeS").style.display = "block";

    }, true);
})();