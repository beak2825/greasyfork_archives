// ==UserScript==
// @name         Steamgifts: Add links to SGtools
// @namespace    www.twitter.com/silentguy
// @version      0.7.6.1
// @author       SilentGuy
// @description  Extend the Sidebar on Steamgifts-Userpages to include links to www.sgtools.info
// @match        http://www.steamgifts.com/user/*
// @match        https://www.steamgifts.com/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10120/Steamgifts%3A%20Add%20links%20to%20SGtools.user.js
// @updateURL https://update.greasyfork.org/scripts/10120/Steamgifts%3A%20Add%20links%20to%20SGtools.meta.js
// ==/UserScript==

    var elems = document.getElementsByTagName('*'), i;
    var sgt_host="http://www.sgtools.info";
    var steamgift=/.*www.steamgifts.com\/user\/([^/]*)(\/|$).*/.exec(window.location.href)[1];
    for (i in elems) {
        if((' ' + elems[i].className + ' ').indexOf(' ' + "sidebar__navigation" + ' ') > -1) {
            var current=elems[i];
            current.parentElement.appendChild(buildHeader("sgtools"));
            
            var list = buildList();
            current.parentElement.appendChild(list);
                                    
            list.appendChild(buildItem("Real CV sent",sgt_host+"/sent/"+steamgift+"/newestfirst"));
            list.appendChild(buildItem("Real CV won",sgt_host+"/won/"+steamgift+"/newestfirst"));
            list.appendChild(buildItem("Not activated",sgt_host+"/nonactivated/"+steamgift));
            list.appendChild(buildItem("Multiple Wins",sgt_host+"/multiple/"+steamgift));
                        
            break;
        }
    }
    
    function buildItem(displayText, linkTarget){
        var item = document.createElement("li");
        item.className += " sidebar__navigation__item";

        var link = document.createElement("a");
        link.className += " sidebar__navigation__item__link";
        link.href=linkTarget;
        link.target="_blank";
        item.appendChild(link);
        
        
        var div = document.createElement("div");
        div.className += " sidebar__navigation__item__name";
        t = document.createTextNode(displayText);
        div.appendChild(t);
        link.appendChild(div);
        
        div = document.createElement("div");
        div.className += " sidebar__navigation__item__underline";
        link.appendChild(div);

        return item;
        
    }

    function buildHeader(displayText){
            var heading = document.createElement("h3");
            heading.className += " sidebar__heading";
            var t = document.createTextNode(displayText);
            heading.appendChild(t);
            return heading;
    }

    function buildList(){
            var list=document.createElement("ul");
            list.className += " sidebar__navigation";
            return list;
    }

