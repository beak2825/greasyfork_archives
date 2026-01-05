// ==UserScript==
// @name       Return All
// @version    1.2
// @description  Adds a Return All link to the Mturk Queue page.
// @author     Cristo
// @grant                GM_getValue
// @grant                GM_setValue
// @include https://www.mturk.com/mturk/myhits
// @include https://www.mturk.com/mturk/return*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/2966/Return%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/2966/Return%20All.meta.js
// ==/UserScript==

    if (document.getElementsByClassName("capsulelink").length > 0) {
        var hand = document.getElementById("collapseall");
        var cap = document.getElementsByClassName("capsulelink")[1].innerHTML;
        var linkPart = cap.split('"')[1];
        var link = linkPart.replace("amp;", "");

        var bar = document.createElement("font");
        bar.innerHTML = "&nbsp&nbsp"+"|";
        bar.style.color = "#9ab8ef";
        hand.parentNode.appendChild(bar);

        var but = document.createElement("a");
        but.innerHTML="&nbsp&nbsp"+"Return All";
        but.setAttribute("href", "#");
        but.setAttribute("class", "footer_links");
        but.setAttribute("id", "returnbut");
        bar.parentNode.appendChild(but);

        but.addEventListener( "click", cas, false);
    }
    function cas(){
        GM_setValue("toreturn", "true");
        window.location.href = "https://www.mturk.com" + link;
    }
    if ((GM_getValue("toreturn") == "true")&&(document.getElementsByClassName("capsulelink").length > 0)){
        window.location.href = "https://www.mturk.com" + link;
    } else {
        GM_setValue("toreturn", "false");
    }

