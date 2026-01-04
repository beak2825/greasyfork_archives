// ==UserScript==
// @name         Custom Forum Userscript
// @namespace    http://tampermonkey.net/
// @version      2.302
// @description  Generalized cosmetic customization! Just copy the current userscript and replace it with your own settings!
// @author       snoozingnewt
// @match        https://artofproblemsolving.com/community/your/site/here
// @icon         https://media.discordapp.net/attachments/763965102008696883/839178114449670144/unknown.png?width=2064&height=1019
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425945/Custom%20Forum%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/425945/Custom%20Forum%20Userscript.meta.js
// ==/UserScript==
/* global $*/

/** This script is an unofficial add-on for artofproblemsolving.com and is not affiliated in any way with AoPS Incorporated.
This is a script for a hypothetical RPG forum coming to theaters near you.

To-Do List: (Removed is done if you really care about them just go to previous versions)

3. Figure out the rest of the fonts that don't work (some weird font spaces don't work fsr) (idk changing the font of the class doesn't help)
4. Cosmetic Icons (Figure out how to make in JS)
7. Add automated RPG things, bank, item drops, etc. (IMPORTANT) (Kind of the biggest thing and will have to beg someone else to do)
9. Learn how to actually code lol (not important) (will never happen)
12. Background slightly off
14. Make the RPG rules lol (unrelated to userscript)
15. Because aops doesn't reload when switching between forums sometimes we need to make an autoreloader whenever someone leaves and enters the forum (maybe use waitforkeyelements? do more research)
16. elaborate on 7
17. Make an actual logo// done, now just make the logo big enough to actually be visible
18. Fix the color OP problem
19. Fix the color disappearing when you edit a post problem/most likely attachments too
20. Fix the color reloading problem
21. Compact the color code more
22. Bump button thing?
24. https://stackoverflow.com/questions/48587922/using-the-same-userscript-to-run-different-code-at-different-urls (Like make the bookmarks still work after reloading somewhere else)
25. find out how to edit username
26. work on personal rpg stats after 25 is done
**/




/* Font Changer */
/* You can use any font for this - Oxygen is set as the default */
window.addEventListener('load', function() {
    (function () {

        GM_addStyle(`
    body :not(i){font-family:"Oxygen",system-ui,emoji}
    `);
})();

/* Ranking Colors */
/* You can make certain people's usernames be a different color. */
    $('head').append(`
<style>
a[title*="snoozingnewt"] {
color: #fff000;
}
a[title*="SamuraiA"] {
color: cyan;
}
a[title*="User] {
color: red;
}
</style>



`);








    /* Background */
    var change_color = function(){
        /* Change the url to change the background */
        document.body.style.background = "url('https://www.computerhope.com/jargon/p/placeholder-text.gif?width=3000&height=1019')"; //insert image url
    }
    change_color();
    /* Notes About Image
Taken From:
<insert site>
This image is for personal use.
*/


    /* Tag Color Changes

Copy this:
if (tag[i].textContent=='(INSERT TAG NAME)') {
    tag[i].setAttribute("style", "background-color: *(INSERT COLOR OF HEXADECIMAL CODE);");
}

*/
    function tag_change() {
        var tag=document.getElementsByClassName("cmty-item-tag");
        for (var i = 0; i < tag.length; i++) {
            if (tag[i].textContent=='official') {
                tag[i].setAttribute("style", "background-color: red;");
            }
        }
    };
    setInterval(tag_change, 50);

    /*Logo Change? Works Now! Replace with your own image*/
    //computer aops online logo
    var elems = document.getElementsByClassName("logo-img");
    for (var i = 0; i < elems.length; i+= 1) {
        elems[i].src = "https://i.ibb.co/vBNKKkN/New-Drawing-3.png";
    }
    //mobile aops online logo
    var elems2 = document.getElementsByClassName("logo-img-mobile");
    for (var i2 = 0; i2 < elems2.length; i2+= 1) {
        elems2[i2].src = "https://i.ibb.co/vBNKKkN/New-Drawing-3.png";
    }
    //small aops online logo
    var elems3 = document.getElementsByClassName("logo-img-small");
    for (var i3 = 0; i3 < elems3.length; i3+= 1) {
        elems3[i3].src = "https://i.ibb.co/vBNKKkN/New-Drawing-3.png";
    }
    //aops online logo near the bottom of the screen
    var elems4 = document.getElementsByClassName("footer-mainLogo");
    for (var i4 = 0; i4 < elems4.length; i4+= 1) {
        elems4[i4].src = "https://i.ibb.co/vBNKKkN/New-Drawing-3.png";
    }

//Link Changes
  //aops online image links to our forum
    var elems5= document.getElementsByClassName("logo-img-link")
    for (var i5= 0; i5< elems5.length; i5= 1) {
        elems5[i5].href = "/community/c1992195";
    }
//Replace c1992195 of a link of your choice
    //This changes the post color of some users.
    //For normal posts
    (function() {
        //Code by happycupcake with some revisions by snoozingnewt. I have permission to use this.
        document.addEventListener("DOMNodeInserted", function(e) {
            if (e.target.className=="cmty-post" && e.target.querySelector('.cmty-post-username > a').innerText=='snoozingnewt') {
                e.target.lastChild.setAttribute('style','background-color: #ff0000 !important;')
            }
            else if (e.target.className=="cmty-post" && e.target.querySelector('.cmty-post-username > a').innerText=='SamuraiA') {
                e.target.lastChild.setAttribute('style','background-color: #c2e0ff !important;')
            }
        }, false);
    })();

    //For edited posts
    waitForKeyElements("div.cmty-post",edit_thing)
    function edit_thing(){
        document.addEventListener("DOMNodeInserted", function(e) {
            if (e.target.className=="cmty-post cmty-post-edited" && e.target.querySelector('.cmty-post-username > a').innerText=='snoozingnewt') {
                e.target.lastChild.setAttribute('style','background-color: #ff0000 !important;')
            }
            else if (e.target.className=="cmty-post cmty-post-edited" && e.target.querySelector('.cmty-post-username > a').innerText=='SamuraiA') {
                e.target.lastChild.setAttribute('style','background-color: #c2e0ff !important;')
            }
        }, false);
    };
    // for edited posts with attachment
    (function() {
        document.addEventListener("DOMNodeInserted", function(e) {
            if (e.target.className=="cmty-post post-has-attachment cmty-post-edited" && e.target.querySelector('.cmty-post-username > a').innerText=='snoozingnewt') {
                e.target.lastChild.setAttribute('style','background-color: #ff0000 !important;')
            }
            else if (e.target.className=="cmty-post post-has-attachment cmty-post-edited" && e.target.querySelector('.cmty-post-username > a').innerText=='SamuraiA') {
                e.target.lastChild.setAttribute('style','background-color: #c2e0ff !important;')
            }

        }, false);
    })();

//time to edit the dropdown bars - edit these too
(function() {
    'use strict';
    $('a[href="/store"]').text('RPG Thread Menu');
    $('.menubar-label.store .dropdown-content').empty()
    $('.menubar-label.store .dropdown-content').append('<a href="https://artofproblemsolving.com/community/c1992195h2550546_the_hypothetical_rpg_welcome_thread" id="welcomethread">Welcome Thread 👋</a>');
    $('.menubar-label.store .dropdown-content').append('<a href="https://artofproblemsolving.com/community/c1992195h2551858_the_hypothetical_rpg_nexus" id="nexus">Nexus 💬 </a>');
})();

(function() {
    'use strict';
    $('a[href="/resources"]').text('Forum Stats');
    $('.menubar-label.resources .dropdown-content').empty()
    $('.menubar-label.resources .dropdown-content').append('<a href="https://quantlaw.com/forum_score?forum=-The%20hypothetical%20RPG%20Forum%20Thing%20that%20may%20exist">Quantlaw: 2730</a>');
    $('.menubar-label.resources .dropdown-content').append('<a href="(find something to replace with)">Threads: -4</a>');
})();


  //rpg thread menu links to forum map

//in-rpg usernames/titles


//ok so it seems editing the username function is hard, i need help on finding a solve for this
//this also prevents me from displaying stats in a dropdown menu which are for users, which is important


}, false);

