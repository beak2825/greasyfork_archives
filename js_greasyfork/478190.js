// ==UserScript==
// @name         GC - Neoboard Post Format Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add buttons to neoboard posts to wipe out all formatting in a post.
// @author       Twiggies
// @match        *://www.grundos.cafe/neoboards/topic/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478190/GC%20-%20Neoboard%20Post%20Format%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/478190/GC%20-%20Neoboard%20Post%20Format%20Remover.meta.js
// ==/UserScript==



(function() {
    'use strict';

    //Get all the post timestamps to shove the buttons into.
    const postTimestampList = document.querySelectorAll('.post_timestamp')

    //Add button to each timestamp.
    for (let i = 0; i < postTimestampList.length; i++) {
        //Get the ID of the post.
        // console.log(Array.from(postTimestampList[i].classList).filter(function (str) { return str.includes('post_id'); })[0]);
        const postID = Array.from(postTimestampList[i].classList).filter(function (str) { return str.includes('post_id'); })[0];
        if (postID != undefined) {
            const formatButton = document.createElement('a');
            const buttonImage = document.createElement('img');
            buttonImage.src = "https://i.imgur.com/UT6QFio.png";
            buttonImage.title = "Remove Formatting";
            formatButton.appendChild(buttonImage);
            // formatButton.appendChild(document.createTextNode('[Remove Formatting]'));
            formatButton.addEventListener("click", function() {
                //Get the post_content with the same ID.
                const postContent = document.getElementsByClassName('post_content ' + postID)[0];
                if (postContent != undefined) {
                    //Remove the formatting of the textin that post.
                    for(var i = 0, elems = postContent.getElementsByTagName('*'), len = elems.length; i < len; i++) {
                        elems[i].removeAttribute('style');
                    }
                    console.log(postContent);
                }
            })
            postTimestampList[i].lastElementChild.insertAdjacentElement('afterbegin', formatButton);
        }
    }
    // const postList = document.querySelectorAll('.post_content')
})();