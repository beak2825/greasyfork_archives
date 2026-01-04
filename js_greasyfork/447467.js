// ==UserScript==
// @name         Youtube button for youtuberandom.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button that redirects to youtube.com for youtuberandom.com
// @author       Johann von Rönn
// @match        https://www.youtuberandom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447467/Youtube%20button%20for%20youtuberandomcom.user.js
// @updateURL https://update.greasyfork.org/scripts/447467/Youtube%20button%20for%20youtuberandomcom.meta.js
// ==/UserScript==

const params = new Proxy(new URLSearchParams(window.location.search), {
get: (searchParams, prop) => searchParams.get(prop),
});
let value = params.watch;
console.log(value)
let url_prefix = "https://www.youtube.com/watch?v="
let new_url = url_prefix + value

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'View on Youtube</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {

    window.open(new_url)
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    #myContainer {
        position:               absolute;
        top:                    93.5vh;
        left:                   0;
        font-size:              20px;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 5px;
    }

    #myContainer p {
        color:                  red;
        background:             white;
    }

    #myButton {
	    box-shadow: 3px 4px 0px 0px #8a2a21;
	    background:linear-gradient(to bottom, #c62d1f 5%, #f24437 100%);
	    background-color:#c62d1f;
	    border-radius:18px;
	    border:1px solid #d02718;
	    display:inline-block;
	    cursor:pointer;
	    color:#ffffff;
	    font-family:Arial;
	    font-size:17px;
	    padding:7px 25px;
	    text-decoration:none;
	    text-shadow:0px 1px 0px #810e05;
    }

    #myButton:hover {
	    background:linear-gradient(to bottom, #f24437 5%, #c62d1f 100%);
	    background-color:#f24437;
    }

    #myButton:active {
	    position:relative;
	    top:1px;
    }

` );