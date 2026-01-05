// ==UserScript==
// @id           NetEase_Music_Cloud_Translator
// @name         NetEase Music Cloud Translator
// @namespace    https://github.com/plablo/NetEase_music_translator
// @version      0.4.1
// @description  Translate from chinese to your language at music.163.com
// @author       Plablo
// @license      NetEase Music Cloud Translator is licensed under a Creative Commons Attribution-ShareAlike 3.0 Unported License.
// @include      http://music.163.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @compatible   chrome
// @compatible   firefox
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/10377/NetEase%20Music%20Cloud%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/10377/NetEase%20Music%20Cloud%20Translator.meta.js
// ==/UserScript==

//*** Create google translator gadget ***
//Make the container
var container_div = document.createElement('div');
container_div.style.position = 'absolute';
container_div.style.zIndex = "999999";
container_div.style.width = '100px';
container_div.style.top = 0;
container_div.style.left = 0;

//Make the gadget
var google_tt_div = document.createElement('div');
google_tt_div.id = 'google_translate_element';
google_tt_div.innerHTML = '';
container_div.appendChild(google_tt_div);

var google_tt_script = document.createElement('script'); //create a script tag
google_tt_script.type = 'text/javascript'; // add type attribute
google_tt_script.innerHTML = 'function googleTranslateElementInit() {new google.translate.TranslateElement({pageLanguage: \'zh-CN\', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false, multilanguagePage: true}, \'google_translate_element\');}';
container_div.appendChild(google_tt_script); // Insert it as the last child of container_div

var google_tt_script_link = document.createElement('script'); //create a script tag
google_tt_script_link.type = 'text/javascript'; // add type attribute
google_tt_script_link.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
container_div.appendChild(google_tt_script_link); // Insert it as the last child of container_div

//Append to the end of the main body
$('body').filter(function(){return this.id.match(/auto-id-./);}).get(0).appendChild(container_div);

//Hide the Google Translator Bar using CSS
var node = document.createElement("style");
var css = "iframe.goog-te-banner-frame {display: none !important;} #goog-gt-tt {display: none !important;} .goog-te-gadget {display: block !important;} body {top: 0px !important;}" 
node.type = "text/css";
node.appendChild(document.createTextNode(css));
var heads = document.getElementsByTagName("head");
if (heads.length > 0) {
    heads[0].appendChild(node); 
} else {
    // no head yet, stick it whereever
    document.documentElement.appendChild(node);
}
