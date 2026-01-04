// ==UserScript==
// @name         Unique URL Scripts for Mturk
// @description  generates header and unique url for mturk userscripts
// @author       DCI
// @version      1.2
// @namespace    www.redpandanetework.org/
// @match        https://worker.mturk.com/projects/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/36667/Unique%20URL%20Scripts%20for%20Mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/36667/Unique%20URL%20Scripts%20for%20Mturk.meta.js
// ==/UserScript==

// Open HIT Details to copy userscript header to clipboard

var author = "DCI";
var namespace = "www.redpandanetework.org";
var icon = "http://i.imgur.com/ZITD8b1.jpg";
var description = "I'm so fancy.";

var createHeader = function(){
    var header =
        '// ==UserScript==\n' +
        '// @name ' + requester + ' - ' + title + ' - ' + reward + '\n' +
        '// @description ' + description + '\n' +
        '// @version 1.0\n' +
        '// @author ' + author + '\n' +
        '// @namespace ' + namespace + '\n' +
        '// @icon ' + icon + '\n' +
        '// @include ' + parenturl + '\n' +
        '// @include ' + includeurl + '\n' +
        '// @timer ' + timer + '\n' +
        '// @frameurl ' + frameurl + '\n' +
        '// @grant GM_setClipboard\n' +
        '// @grant GM_openInTab\n' +
        '// @grant GM_setValue\n' +
        '// @grant GM_getValue\n' +
        '// @grant GM_deleteValue\n' +
        '// @grant GM_xmlhttpRequest\n' +
        '// @require http://code.jquery.com/jquery-latest.min.js\n' +
        '// ==/UserScript==\n\n' +
        'if (~window.location.toString().indexOf("https://worker.mturk.com/projects/")){\n' +
        '    var groupId = window.location.toString().split("/")[4].split("/")[0];\n' +
        '    document.getElementsByTagName("iframe")[0].src = document.getElementsByTagName("iframe")[0].src + "&groupId=" + groupId;\n' +
        '}\n\n' +
        'else {\n\n\n\n\n\n\n\n\n\n' +
        '}';
    GM_setClipboard(header);
};

var popup = document.querySelectorAll("a[data-reactid='.2']")[0];
popup.onclick = function(){
    setTimeout(function(){
        var button = document.createElement("input");
        var oldText = document.querySelectorAll("h2[data-reactid='.8.0.0.0.1']")[0];
        oldText.innerHTML = "";
        oldText.style.color = "black";
        button.setAttribute('type','button');
        button.setAttribute('name','Scriptify');
        button.setAttribute('value','Copy HIT Data to Clipboard');
        oldText.appendChild(button);
        button.addEventListener("click", function(){
            requester = document.querySelectorAll("span[data-reactid='.8.0.0.1.0.0.1']")[0].innerHTML;
            title = document.querySelectorAll("span[data-reactid='.8.0.0.1.1.0.1']")[0].innerHTML;
            reward = document.querySelectorAll("span[data-reactid='.8.0.0.1.3.4.1']")[0].innerHTML.replace("$","");
            timer = document.querySelectorAll("span[data-reactid='.8.0.0.1.3.2.1']")[0].innerHTML;
            groupId = window.location.toString().split("/")[4].split("/")[0];
            frameurl = document.getElementsByTagName('iframe')[0].src.toString() + "&groupId=" + groupId;
            includeurl = frameurl.split("/")[0] + "//" + frameurl.split("/")[1] + frameurl.split("/")[2]  + "/*" + window.location.toString().split('/')[4].split('/')[0] + "*";
            parenturl = "https://worker.mturk.com/projects/" + window.location.toString().split("/")[4] + "*";
            createHeader();
            button.setAttribute('value','Data Copied!');
            setTimeout(function(){
                document.querySelectorAll("button[class='close']")[0].click();
            },0500);
        });
    },0500);
};







