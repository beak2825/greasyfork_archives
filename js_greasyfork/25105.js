// ==UserScript==
// @name         FTM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  retores your commitment to sparklemotion
// @author       Memer McMemerson
// @match        http://lol-meme.dreamwidth.org/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/25105/FTM.user.js
// @updateURL https://update.greasyfork.org/scripts/25105/FTM.meta.js
// ==/UserScript==

//--------------INSTRUCTIONS------------------------------
//
//  ethrosdemons are automarqueed no need for tags
//
//----------EXAMPLE MANUAL USAGE--------------------------
//
//   <center direction="right" behavior="alternate" height="100" scrolldelay=20 scrollamount=10>A MARQUEE IN THE SHAPE OF A NOT SO GIANT PEEN</center>
//
//   you don't have to add all the options but if you don't add direction the script will skip that comment thinking you're trying to reporter!mouse or something

(function() {
    'use strict';
   

    let mutate = function(){
        
        let ETHROSDEMON = /ETHROSDEMON/gi; 
        let OPEN = /<CENTER/gi; 
        let CLOSE = /<\/CENTER/gi; 

        let comment = $(this);
        
              
        let code = comment.html(); 
        code = code.replace(ETHROSDEMON, "<marquee>ETHROSDEMON</marquee>"); 
        code = code.replace(OPEN, "<MARQUEE"); 
        code = code.replace(CLOSE, "</MARQUEE"); 
        comment.html(code); 
        
        
        
    };
    
    

    let comments = $('.comment-content:contains("ETHROSDEMON"), .comment-content:has(center[direction])'); 
    comments.each(mutate);

})();