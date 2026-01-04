// ==UserScript==
// @name       wikiclean
// @namespace  wikicleannamespace
// @description wikicleanbook
// @version      0.6
// @author       aporiz
// @match        https://ja.m.wikipedia.org/*
// @match        https://ja.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @grant    GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/459100/wikiclean.user.js
// @updateURL https://update.greasyfork.org/scripts/459100/wikiclean.meta.js
// ==/UserScript==

var target = "";

//  target = document.location.href.replace("img.2chan.net/b/res/", "kako.futakuro.com/futa/img_b/").replace('.htm', '');;
// window.location.replace(target)
var mySubString =  document.location.href.substring(
    document.location.href.indexOf("search=") + 7,
    document.location.href.lastIndexOf("&title")
);

console.log(mySubString);

document.open();
document.write("");
document.close();

var body = document.querySelectorAll('body');




var textInput = document.createElement('p');
textInput.type = "text";
textInput.id = "text";
textInput.innerHTML = decodeURIComponent(mySubString);

body[0].appendChild(textInput);

textInput.style = "left: 50px; top: 400px; position: fixed;";

GM_addStyle ( `
body {
    display: flex;
    align-items: center;
}

p {
 color: blue;
}


` );