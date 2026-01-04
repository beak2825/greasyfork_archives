// ==UserScript==
// @name         Instagram - Automatic Follower and Message Spammer 9/18/2022
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      0.1
// @description  On demand service to automaically follow and send a spam message to multiple instagram users.
// @author       hacker09
// @match        https://www.instagram.com/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.instagram.com/t&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465981/Instagram%20-%20Automatic%20Follower%20and%20Message%20Spammer%209182022.user.js
// @updateURL https://update.greasyfork.org/scripts/465981/Instagram%20-%20Automatic%20Follower%20and%20Message%20Spammer%209182022.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelector('.v1Nh3.kIKUG._bz0w > a').click(); //Auto clicks on the latest post of the opened user
  document.querySelector('a.zV_Nj').click(); //Auto clicks on the total amount of likes in the post

  //Open all users on a new tab increases by 11 every time it is scrolled down, either use mutation observer or auto scroll down, catch all user profile links, and open a couple every time?
  document.querySelectorAll('a.FPmhX.notranslate.MBL3Z').forEach(el => window.open(el.href, '_blank') ); //Open all users on a new tab
  document.querySelector('button.sqdOP.L3NKy.y3zKF').click(); //Follow the user so that we can spam a message

  //use arrive to detect if message button was created, otherwise the user has very strict privacy permissions on instagram and has to approve follow requests before authorazin anyone to send messages
  document.querySelector('button.sqdOP.L3NKy._8A5w5').click(); //Click on the message btn

  //wait hashchange, popstate change, onblur, before onload, timeout, arrive or whatever until messages page is fully loaded
  //then
  document.querySelector('textarea').value = "Hi, How are you?\n I'm kindly using a bot to spam you right now, please be patient!!!"; //Automatically write a spam message to the user
  document.querySelectorAll('button.sqdOP.yWX7d.y3zKF')[1].click(); //Automatically send the spam message to the user
  //https://gist.github.com/baptx/99f3cb6373d4a8cf869c25f0549b0c5c
  //https://drawcode.eu/projects/instagram-api-send-direct-messages-from-a-web-browser/

})();