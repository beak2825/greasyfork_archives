// ==UserScript==
// @name        Slack automatic redirect (open with browser)
// @namespace   slackwebversion
// @description automatically use Slack in browser (web version)
// @include     https://*.slack.com/*
// @version     1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448523/Slack%20automatic%20redirect%20%28open%20with%20browser%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448523/Slack%20automatic%20redirect%20%28open%20with%20browser%29.meta.js
// ==/UserScript==
console.log('started script on Slack, title = "', document.title, '"');

const slack_title = "Weiterleitung erfolgt";
const slack_redir = "auch in deinem Browser"; /* "diesen Link auch in deinem Browser öffnen" or "Slack auch in deinem Browser verwenden" */

function redirectFunc() {
    console.log("redirect function started");

    Array.from(document.getElementsByTagName('a')).forEach(link => {
        var txt = link.innerText;
        var uri = link.href;
        console.log("link text=", txt, ", href=", uri);
        if (txt && txt.includes(slack_redir)) {
            console.log("found : URL = ", uri);
            stopped = true; // stop timer while redirecting
            window.location.replace(uri);
            return; /* break; */
        }
    });

    console.log("no link found"); // output this message: if code has reached there, means no appropriate link found (return not working)

}

/* interval timer: https://stackoverflow.com/a/66690340/14776523 */

var i = 0; // counter for the timer
var stopped = false;

function doTimer() {
    if (stopped)
        return;
    console.log("1 second... check", i); // your actual code here, alternatively ...
    redirectFunc(); // ... call an other function here
    if (++i < 15) { // only reset the timer when maximum of 10 times it is fired 
        console.log("reset the timer");
        setTimeout(doTimer, 1000); // reset the timer
    }
    else {
        console.log("timer ended");
    }
}


// check if we are on the startpage
if (document.title.includes(slack_title)) // falls wir auf der Startseite sind
{
    console.log("SLACK startpage detected.");
    setTimeout(doTimer, 1000); // init the first
}