// ==UserScript==
// @name  Xenforo 2 Thread-Starter Highlighter
// @description This is a userscript which highlights subsequent posts by the thread-starter in the SpaceBattles, Sufficient Velocity and Questionable Questing forums. It also displays a short information at the top of each page if a post by the thread-starter can be found on the current page.
// @author  Fizzfldt
// @contributor ApatheticImagination
// @contributor ElDani
// @version  1.6.2
// @license  Creative Commons BY-NC-SA
// @include  http*://forums.sufficientvelocity.com/threads/*
// @include  http*://forums.spacebattles.com/threads/*
// @include  http*://forum.questionablequesting.com/threads/*
// @encoding  utf-8
// @grant  none
// @noframes
// @run-at document-end
// @nocompat Chrome
// @history  1.0.7 forked the older one to fix SV which upgraded xenforo versions.
// @history  1.0.6 added HTTPS support for SB and full support for Questionable Questing forum (ApatheticImagination)
// @history  1.0.5 added HTTPS support for SV (thanks NuitTombee)
// @history  1.0.4 fixed small bug, where wrong posts could be highlighted due to error in partial user name matching
// @history  1.0.3 added support for SV FlexileSpace style
// @history  1.0.2 fixed bug, where posts by staff on SB would not be highlighted
// @history  1.0.1 added option to choose highlight color by active forum style
// @history  1.0 initial public version
// @namespace https://greasyfork.org/users/45933
// @downloadURL https://update.greasyfork.org/scripts/387594/Xenforo%202%20Thread-Starter%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/387594/Xenforo%202%20Thread-Starter%20Highlighter.meta.js
// ==/UserScript==

function LocalMain () {
    /*
   if (window.top != window.self) {
     //don't run on iFrames
     return;
   }
   */

   var site = -1;
   if (document.URL.indexOf("spacebattles.com") > -1) site=0;
   if (document.URL.indexOf("sufficientvelocity.com") > -1) site=1;
   if (document.URL.indexOf("questionablequesting.com") > -1) site=2;
   if (site == -1) return;

   var style;
   var rgxp_style = /<link.*?href="css.php\?css=xenforo,form,public&amp;style=(\d+)&amp;/i
   var match_style = rgxp_style.exec(document.documentElement.outerHTML);
   if (match_style != null) {
     style = match_style[1];
   } else {
       // Fake style
     style = 2
   }

   var highlightColor = new Array();
   highlightColor[0] = new Array();
   highlightColor[0][2]  = "#152E18"; // SB: SpaceBattles.com
   highlightColor[0][4]  = "#152E18"; // SB: Flexile Dark Standalone
   highlightColor[0][6]  = "#F5F6CE"; // SB: XenForo Default Style
   highlightColor[1] = new Array();
   highlightColor[1][1]  = "#F5F6CE"; // SV: Default Style
   highlightColor[1][2]  = "#152E18"; // SV: Flexile Dark
   highlightColor[1][3]  = "#152E18"; // SV: Flexile Gold
   highlightColor[1][5]  = "#152E18"; // SV: Dark Wide
   highlightColor[1][6]  = "#152E18"; // SV: Gold Fixed
   highlightColor[1][7]  = "#424242"; // SV: Space
   highlightColor[1][11] = "#152E18"; // SV: FlexileSpace
   highlightColor[1][20] = "#152E18"; // SV: FlexileSpace
   highlightColor[2] = new Array();
   highlightColor[2][1]  = "#F5F6CE"; // QQ: XenForo Default Style
   highlightColor[2][2]  = "#152E18"; // QQ: Blackend
   highlightColor[2][3]  = "#152E18"; // QQ: Blackend-Blue
   highlightColor[2][4]  = "#152E18"; // QQ: Blackend-Green
   highlightColor[2][5]  = "#152E18"; // QQ: Blackend-Purple
   highlightColor[2][8]  = "#152E18"; // QQ: Flexile Dark
   highlightColor[2][9]  = "#152E18"; // QQ: Dark Responsive (Green)
   highlightColor[2][10] = "#152E18"; // QQ: Dark Responsive High Contrast
   highlightColor[2][14] = "#F5F6CE"; // QQ: Light Responsive
   highlightColor[2][18] = "#152E18"; // QQ: UI.X Dark
   highlightColor[2][20] = "#152E18"; // QQ: UI.X Dark (Mobile)
   highlightColor[2][21] = "#F5F6CE"; // QQ: UI.X Light


   var starter = document.getElementsByClassName("username  u-concealed")[0].innerHTML;
   var my_user = document.getElementsByClassName("p-navgroup-linkText")[0].innerHTML;

   var messages = document.getElementsByClassName("message message--post js-post js-inlineModContainer      ");
   var nr_messages = messages.length;
   var username;
   var starter_posts = 0;
   var my_posts = 0;
   for(var i=0; i<nr_messages; i++) {
     //username = messages[i].getElementsByClassName("username");
     username = messages[i].getAttribute("data-author");
     if (starter == username) {
         starter_posts++;
         var user_anchor = messages[i].getElementsByClassName("username ")[0];
         user_anchor.innerHTML = '<strong style="color:red">AUTHOR:</strong><br/> ' + user_anchor.innerHTML;
     } else if (my_user == username) {
         my_posts++;
     } else {
         messages[i].style.backgroundColor=highlightColor[site][style];
         /*
         // fixme: Anything here?
         messages[i].getElementsByClassName("primaryContent")[0].style.backgroundColor=highlightColor[site][style];
         if(messages[i].getElementsByClassName("secondaryContent").length>0) {
             messages[i].getElementsByClassName("secondaryContent")[0].style.backgroundColor=highlightColor[site][style];
         }
         */
     }
   }

   var posts1;
   if (starter_posts == 0) {
       posts1 = "No posts";
   } else if (starter_posts == 1) {
       posts1 = "1 post";
   } else {
       posts1 = starter_posts + " posts";
   }

   var posts2;
   if (my_posts == 0) {
       posts2 = "No posts";
   } else if (my_posts == 1) {
       posts2 = "1 post";
   } else {
       posts2 = my_posts + " posts";
   }

   var modify = document.getElementsByClassName("p-description")[0];
   modify.innerHTML = modify.innerHTML + '<strong style="color:yellow">' + posts1 + " by " + starter + "<br/>"
                                                                         + posts2 + " by " + my_user + "</strong>";

    /*
   var add_html = document.getElementsByClassName("username  u-concealed")[0].innerHTML;
   if(starter_posts>0) {
     add_html = "<b>["+starter_posts+" posts]</b> " + add_html + "<br/>";
     //add_html = "Started by " + add_html + ".   <b>"+starter_posts+"</b> post(s) by thread starter on this page! Style[" + style + "] <br/>";
   } else {
     add_html = add_html+" <br/> No posts by thread starter on this page. Style[" + style + "] <br/>";
   }
   document.getElementsByClassName("username  u-concealed")[0].innerHTML = add_html;
   */
}

window.addEventListener ("load", LocalMain, false);