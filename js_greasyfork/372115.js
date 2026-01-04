// ==UserScript==
// @name         SymLite NLU mailto tweak
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Predefined mail template for NLU followups
// @author       TBurkert
// @include      https://symlite.moravia.com/Document?requestId=*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/372115/SymLite%20NLU%20mailto%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/372115/SymLite%20NLU%20mailto%20tweak.meta.js
// ==/UserScript==


var links = document.querySelectorAll('a[href^="mailto:"');
for (var x=0; x<links.length; x++) {
    if(links[x].classList.contains("btn")) {continue;}
    var mailto = links[x];

    var row = mailto.parentElement.parentElement.parentElement;
    var link = mailto.parentElement.parentElement.parentElement.querySelector("td.text-ellipsis > a");
    if(!link) continue;
    var docURL = link.getAttribute("href");
    var docname = link.outerText;
    var href = mailto.getAttribute("href");
    var linguist = mailto.outerText;
    var reqID = document.querySelector("#req-name").getAttribute("value");
    var reqname = document.querySelector("h3").outerText;
    //var lang = link.outerText.match(/[a-zA-Z0-9\-]+/);
    var lang = row.querySelector("span.flag").nextElementSibling.innerText;
    var type = "";
    if(reqname.match(/GDP/)) {
        type = "[GDP] ";
    }
    else if (reqname.match(/conversational/i)) {
        type = "[Conversational] ";
    }
    else if(reqname.match(/intent factory/i)) {
        type = "[IF] ";
    }
    var subject = "Assistant NLU | " +"[" + lang + "] " + type + "[" + reqID + "] pre-delivery check issue";
    var body = "Dear " + linguist + ",\n\nWe have found the following problem(s) during the pre-delivery checks of project " + docname + " ( " +docURL+ " ):\n\n\n\n\nPlease confirm you will be able to fix the files ASAP and send us a confirmation after you have finished fixing the issues.\n\nThanks in advance.\n\nBest,\nMoravia production team";
    body = body.replace(/\n/g,"%0A");
    mailto.setAttribute("href",href+";Google_Assistant@moravia.com&subject=" + subject +"&body=" + body);

}