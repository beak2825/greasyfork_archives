// ==UserScript==
// @name         trollegle colored chat
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  it colors the text based on the user id, not compatible with custom styles
// @author       nerd
// @match        https://www.omegle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372477/trollegle%20colored%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/372477/trollegle%20colored%20chat.meta.js
// ==/UserScript==

// create button
var btn = document.createElement( 'input' );
btn.setAttribute( 'onclick', '('+ coloredMain +')();' );
btn.setAttribute( 'value', 'start colored' );
btn.setAttribute( 'type', 'button' );

// add button to page
document.getElementById( 'sharebuttons' ).appendChild( btn );

// new message listener and color assignement
function coloredMain() {
    'use strict';
    window.alert("make sure you have /showids active!");
    var msges = document.getElementsByClassName('logbox')[0].firstChild;
    var idRegex = /.*?\((\d+)\)/gm;

    function change(obj){
        var idstr = idRegex.exec(obj.innerHTML);
        if (idstr != null){
            var col = parseInt(idstr[1]) * 20;
            obj.style.color = `hsl(${col},100%,40%)`;
        }else{
            console.log("no match");
        }
    }

    var observrOptions = {
        childList: true
    }

    var observr = new MutationObserver(mutationList => {
        // Loop over the mutations
        mutationList.forEach(mutation => {
            // For added nodes apply the color function
            mutation.addedNodes.forEach(node => {
                change(node)
                console.log(node)
            })
        })
    })

    observr.observe(msges, observrOptions);
}