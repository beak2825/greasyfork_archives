// ==UserScript==
// @name         PLAYRUST.IO LINK IN JUST-WIPED.NET (Rust Game)
// @namespace    greasyfork.org/en/users/55590-frank-einstein
// @version      1.01
// @description  ADDS A LINK TO PLAYRUST.IO INSIDE JUST-WIPED.NET PAGES
// @author       Frank Einstein
// @include      /^https?:\/\/just\-wiped\.net\/rust_servers\/\d+\/map$/
// @run-at       document-end
// @grant        none
// @icon         http://playrust.io/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/413263/PLAYRUSTIO%20LINK%20IN%20JUST-WIPEDNET%20%28Rust%20Game%29.user.js
// @updateURL https://update.greasyfork.org/scripts/413263/PLAYRUSTIO%20LINK%20IN%20JUST-WIPEDNET%20%28Rust%20Game%29.meta.js
// ==/UserScript==


(function() {
    'use strict';
    
    // LOG //
    console.log('Loading: ' + GM_info.script.name + ' ' + GM_info.script.version);
    
    // VARIABLES:
    var PLAYRUST_LINK;
    var TARGET_NODE;
    var MAP_SIZE;
    var MAP_SEED;
    
    MAP_SIZE = document.querySelector("div.server-map > div.info-table > table > tbody > tr:nth-child(3) > td").innerText;
    MAP_SEED = document.querySelector("div.server-map > div.info-table > table > tbody > tr:nth-child(4) > td").innerText;
    
    // FIX MAP_SIZE
    MAP_SIZE = MAP_SIZE.replace(",", "");
    
    // TEST
    console.log('MAP_SIZE: ' + MAP_SIZE);
    console.log('MAP_SEED: ' + MAP_SEED);
    
    // TARGET
    TARGET_NODE = document.querySelector("body > div.main-frame > div.content > div > div.server-map > div.info-table");
    
    // NEW LINK //
    var TEST_PLAYRUST_LINK = document.getElementById('PLAYRUST_LINK');
    
    if ( !TEST_PLAYRUST_LINK && MAP_SIZE && MAP_SEED ) {
        PLAYRUST_LINK = CREATE_PLAYRUST_LINK("http://playrust.io/map/?Procedural%20Map_" + MAP_SIZE + "_" + MAP_SEED);
        PLAYRUST_LINK.id = "PLAYRUST_LINK";
        
        // INSERTBEFORE
        TARGET_NODE.insertBefore(PLAYRUST_LINK, TARGET_NODE.childNodes[2]);
        
    }
    
    
    //==============================================================================================
    // CREATE_PLAYRUST_LINK
    //==============================================================================================

    function CREATE_PLAYRUST_LINK(LINK_URL) {
        
        var LINK_DIV = document.createElement('div');
        var LINK_TMP = document.createElement('a');
        var LINK_TEXT = document.createTextNode("Open map on Playrust.io");
        
        LINK_TMP.appendChild(LINK_TEXT);
        LINK_TMP.title = "Playrust.io";
        LINK_TMP.href = LINK_URL;
		
        // APPEND
        LINK_DIV.appendChild(LINK_TMP);

        // NEW LINE
        LINK_DIV.appendChild(document.createElement( 'br' ));
        
        // STYLE
        LINK_TMP.style.display = "block";
        LINK_TMP.style.marginTop = "10px";
        LINK_TMP.style.marginBottom = "10px";
		LINK_TMP.style.fontSize = "22px";
        LINK_TMP.style.textAlign = "center";
        
        return LINK_DIV;
    }
    
    
})();

