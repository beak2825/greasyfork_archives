// ==UserScript==
// @name         Lichess Lounger
// @namespace    https://lichess.org/@/Hedgehogs4Me
// @version      0.3
// @description  Include chat in Lichess TV
// @author       Hedgehogs4Me
// @include      https://*lichess.org/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21838/Lichess%20Lounger.user.js
// @updateURL https://update.greasyfork.org/scripts/21838/Lichess%20Lounger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function LoungeBug(message, severity) {
        //Severity 2 is a real bug, severity 1 is a fatal user thing, severity 0 is a thing I put in just in case and would be non-fatal I guess.
        var userWarning = document.createElement("P");
        userWarning.appendChild(document.createTextNode("LOUNGER ERROR: " + message));
        userWarning.style.color=severity===2?"red":severity===1?"orange":severity===0?"teal":"purple";
        //document.body.appendChild(userWarning);
        document.body.insertBefore(userWarning, document.getElementsByClassName("content")[0]);
    }

    //Delayed severity 1 errors. I never said any of this made any organizational sense.
    function severity1() {
                if(boardArray[0].style.height!==""){
                    failed = true;
                    LoungeBug("Lounger isn't working because your board is not the minimum size.", 1);
                }

                if(failed===true){
                    LoungeBug("Just thought, you know, I'd let you know. Sorry 'bout that.", 1);
                    document.getElementsByClassName("lichess_ground")[0].removeChild(document.getElementById("chat_page")); //It's not a problem anyway but just in case remove the thing that doesn't work.
                    return;
                }
            }

    var failed = false;
    var boardArray = document.getElementsByClassName("cg-board-wrap");

    var h = 512; //I've left the former definitions in for archival/curiousity purposes, but the reason this really must be 512 is that there isn't any point in it being anything else.
    // You see, not only does resizing happen *after* the page has loaded, but also, if any board resizing has been done, the board suddenly takes precedence over the chat in small
    // windows! This could *maybe* be worked around by making it a large iframe and covering it up, but then I would have to make the entire thing bigger, and figure out how everything
    // fits together, and then... well, look, I'm not doing it. I made this because I'm so lazy I want to sit back and watch Lichess TV all day and not even have to switch pages to
    // comment, so clearly I'm not going to put in that work. If someone else wants to do it, though, feel free, and I'd love to see your results!

    if(window.self === window.top) {
        if(document.URL.search(/https:\/\/.+lichess\.org\/tv(\/(?!stream)|\/*$)/) != -1) {

            //Severity 2
            if(boardArray.length===0){
                failed = true;
                LoungeBug("Hedgehogs can't even get the board wrapper name right. It's like chemistry class all over again.", 2);
            }
            var sidebarArray = document.getElementsByClassName("lichess_ground");
            if(sidebarArray.length===0){
                failed = true;
                LoungeBug("Something something list wrapper name. Let's just call it ERROR 683A to sound good.", 2);
            }
            var analysisArray = document.getElementsByClassName("analysis");
            if(analysisArray.length===0){
                failed = true;
                LoungeBug("I don't know why the analysis button class name would be changed, but apparently it was.", 2);
            }
            if(document.getElementById("friend_box")===null){
                failed = true;
                LoungeBug("Can't find the friend box. Literally me IRL.", 2);
            }

            if(failed===true){
                LoungeBug("In other words, you should turn off this userscript.", 2);
                return;
            }

            //var h = (boardArray[0].style.height!=="")?parseInt(boardArray[0].style.height):512;
            sidebarArray[0].style.height=(h+98)+"px"; //98 px is how big the crosstable is and I want to use as much space as I can
            var chatFrame = document.createElement("IFRAME");
            chatFrame.style.overflow="hidden";
            chatFrame.style.border="none";
            // chatFrame.style.height="100%";
            // chatFrame.style.height=(h+98-370)+"px"; //god damn it all, none of this is working
            chatFrame.style.setProperty("height", (h+98-370)+"px", "important");
            chatFrame.scrolling="no";
            chatFrame.id="chat_page";
            chatFrame.src=analysisArray[0].href.slice(0,31)+"#chat";
            sidebarArray[0].appendChild(chatFrame);
            //setTimeout(function(){ sidebarArray[0].appendChild(chatFrame); }, 1000);
            //setTimeout(function(){ chatFrame.scrollLeft = 0; }, 2000); // Well, I tried. Didn't think it'd work.
            setTimeout(function(){ window.scrollTo(0,24);severity1(); }, 1000); //I am literally so lazy I scroll to make the full chat bit visible on my small screen
        }
    } else {
        if(window.top.location.href.search(/https:\/\/.+lichess\.org\/tv(\/(?!stream)|\/*$)/) != -1) {
            //var h = (boardArray[0].style.height!=="")?parseInt(boardArray[0].style.height):512;
            document.getElementById("friend_box").style.display="none";
            var chat = document.getElementById("chat");
            chat.style.setProperty("width", "242px", "important");
            chat.style.setProperty("height", (h+98-370)+"px", "important"); //board height, plus under-thingy height, minus height of the stuff above the chat. Trust me on this one.
            boardArray[0].style.visibility="hidden"; //This bit scares me.
            //setTimeout(function(){ chat.scrollIntoView(); }, 1000);
        }
    }
})();