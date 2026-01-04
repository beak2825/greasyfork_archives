// ==UserScript==
// @name         Support Arabic
// @namespace    https://www.waze.com
// @version      2.6
// @description  Waze Forum Support Arabic
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @license      DFS
// @author       sultan alrefaei
// @match        https://www.waze.com/forum/*
// @grant        none
// @copyright    2018 sultan alrefaei
// @grant        GM_xmlhttpRequest
// @connect      www.waze.com
// @downloadURL https://update.greasyfork.org/scripts/370091/Support%20Arabic.user.js
// @updateURL https://update.greasyfork.org/scripts/370091/Support%20Arabic.meta.js
// ==/UserScript==

window.onload = (e)=>{
    // forums supported
    var fourms = [
        "f=936",
        "f=187",
        "f=150",
        "f=911",
        "f=830",
        "f=1447",
        "f=1395",
        "f=1028",
        "f=721"
    ];
    // state
    var state = true;
    // check forums
    for (var i = 0; i < fourms.length; i++){
        if (window.location.href.includes(fourms[i])){
            // add new style
            const headpage  = document.getElementsByTagName("head")[0];
            var arabicSupport  = document.createElement("link");
            arabicSupport.setAttribute("id", "arabic");
            arabicSupport.rel  = "stylesheet";
            arabicSupport.type = "text/css";
            arabicSupport.href = "https://www.dropbox.com/s/totl5fnp2k7o0nr/arabic.css?dl=1";
            arabicSupport.media = "all";
            headpage.appendChild(arabicSupport);
            // add arabic font style
            var arabicFont  = document.createElement("link");
            arabicFont.setAttribute("id", "arabicFont");
            arabicFont.rel  = "stylesheet";
            arabicFont.type = "text/css";
            arabicFont.href = "https://fonts.googleapis.com/css?family=Katibeh";
            arabicFont.media = "all";
            headpage.appendChild(arabicFont);

            // make page right
            const icons = document.getElementsByClassName("postbody ul.profile-icons");

            var button = document.createElement("button");
            button.setAttribute("id", "btnLang");
            button.value = "Lan";
            button.setAttribute("class", "btnLang");
            button.innerText = "Lang";
            button.onclick = ()=>{
                var panel = document.getElementById("page-body");
                if (state){
                    panel.style.direction = "ltr";
                    for (var i = 0; i < icons.length; i++){
                        icons[i].setAttribute("style", "float: left");
                    }
                    state = false;
                }else{
                    panel.style.direction = "rtl";
                    for (var i = 0; i < icons.length; i++){
                        icons[i].setAttribute("style", "float: right");
                    }
                    state = true;
                }
            }

            document.body.appendChild(button);
        }
    }

    var header_menu = document.getElementsByClassName("waze-header-menu")[0];
    var menus = document.createElement("li");
    menus.setAttribute("id", "countries");
    menus.setAttribute("class", "countries");
    menus.innerHTML = "<a href='https://www.waze.com/forum/viewforum.php?f=642'>Countries</a>";
    header_menu.appendChild(menus);

    var editor = document.createElement("li");
    editor.setAttribute("id", "editor");
    editor.setAttribute("class", "editor");
    editor.innerHTML = "<a href='https://www.waze.com/editor'>Editor</a>";
    header_menu.appendChild(editor);
}