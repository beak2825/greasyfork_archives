// ==UserScript==
// @name         F365 Temporary Refresh Fix
// @description  Append random variable to links
// @grant        none
// @match        http://forum.football365.com/*
// @version 0.0.1.20150908100349
// @namespace https://greasyfork.org/users/14019
// @downloadURL https://update.greasyfork.org/scripts/12283/F365%20Temporary%20Refresh%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/12283/F365%20Temporary%20Refresh%20Fix.meta.js
// ==/UserScript==

$('a').each(function(){
     if (this.href.indexOf("?") > -1) {
         var randomString = '&'+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
         if (this.href.indexOf("#") > -1) { 
             this.href = this.href.slice(0, this.href.indexOf("#")) + randomString + this.href.slice(this.href.indexOf("#"));
         } else {
         this.href += randomString
         }
     }
})