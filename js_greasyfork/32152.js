// ==UserScript==
// @name         Thunder Harvester
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script will search for thunder and magnet links on every webpage,when found, it shows a button to download them all (by sending them to the clipboard).
// @author       DKing
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32152/Thunder%20Harvester.user.js
// @updateURL https://update.greasyfork.org/scripts/32152/Thunder%20Harvester.meta.js
// ==/UserScript==

var thunder_linktext = '';

(function() {
    var links = find_links();
    if(links) add_button(links);
})();

function find_links()
{
    var htmltext =  document.getElementsByTagName('html')[0].innerHTML;
    var regthunder = new RegExp(/thunder:\/\/[A-Za-z0-9=]+(?![A-Za-z0-9=])|magnet:\?[a-zA-Z]{2}(.[12])?=[A-Za-z0-9:\?]+(?![A-Za-z0-9:\?])/, "g");
    var links = htmltext.match(regthunder);
    return links;
}

function add_button(links)
{
    thunder_linktext = '';
    for(var i = 0;i<links.length;i++){
        thunder_linktext = thunder_linktext + links[i] + '\n';
    }
    var block = document.createElement('div');
    block.style.position='fixed';
    block.style.top='5%';
    block.style.left='90%';
    block.style.width='120px';
    block.style.height='50px';
    block.style.zIndex=9999;
    block.innerHTML='<div style="cursor:pointer; text-align: center; border:2px solid;border-radius:5px; border-color: rgba(70,100,255,0.8); background-color: rgba(200,200,200,0.8);"><span style="width:30px; text-align: center;"><b> &#9733; </b>' + links.length + ' Tasks</span><br><span style="width:90px; text-align: center; color: blue;"> <b>&#10010;</b> Thunder</span></div>';
    block.onclick = function(){Copy2Clipboard(thunder_linktext);};
    document.body.appendChild(block);
}


function Copy2Clipboard(text){
    var id = "mycustom-clipboard-textarea-hidden-id";
    var existsTextarea = document.getElementById(id);

    if(!existsTextarea){
        var textarea = document.createElement("textarea");
        textarea.id = id;
        // Place in top-left corner of screen regardless of scroll position.
        textarea.style.position = 'fixed';
        textarea.style.top = 0;
        textarea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textarea.style.width = '1px';
        textarea.style.height = '1px';

        // We don't need padding, reducing the size if it does flash render.
        textarea.style.padding = 0;

        // Clean up any borders.
        textarea.style.border = 'none';
        textarea.style.outline = 'none';
        textarea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textarea.style.background = 'transparent';
        document.querySelector("body").appendChild(textarea);
        existsTextarea = document.getElementById(id);
    }
    existsTextarea.value = text;
    existsTextarea.select();

    try {
        var status = document.execCommand('copy');
    } catch (err) {
        console.log('Unable to copy.');
    }
}