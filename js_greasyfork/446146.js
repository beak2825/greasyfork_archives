// ==UserScript==
// @name         Malware site Blocker
// @namespace    http://tampermonkey.net
// @namespace    https://violentmonkey.github.io
// @namespace    https://www.greasespot.net
// @version      15.0
// @description  Block Sites that contain malware.
// @author       Thundercatcher
// @match        http://*/*
// @match        https://grabify.link/*
// @match        https://leancoding.co/*
// @match        https://stopify.co/*
// @match        https://fortnight.space/*
// @match        https://fortnitechat.site/*
// @match        https://joinmy.site/*
// @match        https://catsnthings.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446146/Malware%20site%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/446146/Malware%20site%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    alert("Darn it you are using the number one malware protection, malware site blocker. Now i can’t put malware on your computer :( ");


     document.write('<h1 style="text-align: center;">Site Blocked by Malware site Blocker</h1>');
    document.write('<h3 style="text-align: center;">We found Malware on this site, this is a not secure site. Please delete this tab and go back</h3>');
    document.write('<h3 style="text-align: center;">If you want to ignore this warning you can stop running the script, but before you do that please confirm that this site is safe.</h3>');
document.write('<h3 style="text-align: center;">To leave site click <a href="chrome://newtab">HERE</a></h3>');
    document.write('<h3 style="text-align: center;">(optional) If this warning seems correct Please <a href="https://safebrowsing.google.com/safebrowsing/report_badware/?hl=en">Report this site</a> to google, to insure yours and others safety on the internet</h3>');
    document.write('<h3 style="text-align: center;"><a href="https://greasyfork.org/en/scripts/446146-malware-site-blocker">Malware site blocker</a> just possibly prevented you from being hacked, scammed, etc, it would really help if you <a href="https://greasyfork.org/en/scripts/446146-malware-site-blocker/feedback#post-discussion">Post a positve review</a>, it would really help me grow and and improve the script.</h3>');
    document.write('<h3 style="text-align: center;">We do our best to ensure the internet is a safe and fun place for everyone. As an important reminder, we will not be held responsible if your computer has been hacked. Remember to be cautious and be safe.</h3>');
    document.write('<h3 style="text-align: center;">All credits belong to <a href="https://greasyfork.org/en/users/918560-thundercatcher">Thundercatcher</a></h3>');
document.write('<h3 style="text-align: center;"><a href="https://www.youtube.com/watch?v=6-HUgzYPm9g ">Surprise</a></h3>');
document.write('<h3 style="text-align: center;">For support and updates, join our <a href="https://discord.gg/E48Ujm5dZZ">Discord server</a></h3>');


(document.body.style.backgroundColor = "#b80000");
})();