// ==UserScript==
// @name         Taiwan GazouBBS Menu Unite
// @namespace    http://hollen9.yabi.me/userstyle/tawian-gazoubbs-menu-unite
// @version      0.12
// @description  以台灣 BBS 為主，連結全世界的 GazouBBS 框架站點。
// @author       Hollen9
// @include      *://*komica.org/bbsmenu.html
// @include      *://*komica2.net/bbsmenu.htm
// @include      *://*komica2.net/bbsmenu*
// @include      *://*npnt.me/menu.htm
// @include      *://*k3-bbs.com/menu.htm
// @include      *://*camiko.org/bbsmenu.htm
// @include      *://menu.5ch.net/bbsmenu.html
// @include      *://*2chan.net/bbsmenu.html
// @include      *://alfh.sakura.ne.jp/menu/menu.html
// @include      *://www.4chan.org/frames_navigation*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372252/Taiwan%20GazouBBS%20Menu%20Unite.user.js
// @updateURL https://update.greasyfork.org/scripts/372252/Taiwan%20GazouBBS%20Menu%20Unite.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const KOMICA1_ENTRY_URI = 'https://komica.org/';
    const KOMICA1_HOST = 'komica.org';
    //const KOMICA1_MENU_FILENAME = 'bbsmenu.html';
    const KOMICA1_ICON_URI = 'http://komica.org/favicon.ico';
    const KOMICA2_ENTRY_URI = 'http://komica2.net/index2.htm';
    const KOMICA2_HOST = "komica2.net";
    //const KOMICA2_MENU_FILENAME = "bbsmenu.htm";
    const KOMICA2_ICON_URI = 'http://komica.org/favicon.ico';

    const NPNT_HOST = "npnt.me";
    const NPNT_ENTRY_URI = "http://www.npnt.me/index2.htm";
    const NPNT_ICON_URI = "http://www.npnt.me/favicon.ico";

    const K3_ENTRY_URI = "http://k3-bbs.com/";
    const K3_HOST = "k3-bbs.com";
    const K3_ICON_URI = "http://k3-bbs.com/k3favico.ico";

    const CAMIKO1_ENTRY_URI = "http://camiko.org/";
    const CAMIKO1_ICON_URI = "http://camiko.org/favicon.ico";
    const CAMIKO1_HOST = "camiko.org";

    const CAMIKO2_ENTRY_URI = "http://ca2.camiko.org/";
    const CAMIKO2_ICON_URI = "http://ca2.camiko.org/favicon.ico";
    const CAMIKO2_HOST = "ca2.camiko.org";

    const JP_5CH_ENTRY_URI = "https://www2.5ch.net/5ch.html";
    const JP_5CH_ICON_URI = "https://www2.5ch.net/favicon.ico";
    const JP_5CH_HOST = "menu.5ch.net";

    const JP_2CHAN_ENTRY_URI = "http://www.2chan.net/";
    const JP_2CHAN_ICON_URI = "http://www.2chan.net/favicon.ico";
    const JP_2CHAN_HOST = "2chan.net";

    const JP_2JIGENNGURO_ENTRY_URI = "http://alfh.sakura.ne.jp/menu/frame.html";
    const JP_2JIGENNGURO_ICON_URI = "";
    const JP_2JIGENNGURO_HOST = "alfh.sakura.ne.jp";

    const ENG_4CHAN_ENTRY_URI = "http://www.4chan.org/frames";
    const ENG_4CHAN_ICON_URI = "http://www.4chan.org/favicon.ico";
    const ENG_4CHAN_HOST = "4chan.org";
    
    const HEIGHT_NORMAL = "10px";
    const HEIGHT_HOVER = "100%";
    
    let host = location.hostname;

    

    document.head.appendChild((function(){
        let oSt = document.createElement("style");
        oSt.innerHTML = `
            #SwitchPanel {
                text-align: left !important;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                margin: 0;
                z-index: 10001;
                transition: .5s;
            } #SwitchPanel.collapsed {
                background: rgba(202, 77, 125, .5);
            } #SwitchPanel.expanded {
                background: rgba(202, 77, 125, .99);
            }

            

            #SwitchPanel ul {
                user-select: none;
                transition: .7s ease-out;
                position: relative;
            } #SwitchPanel.collapsed ul{
                position: relative;
                left: -50px;
                opacity: 0;
            } #SwitchPanel.expanded ul {
                left: 0px;
                opacity: 1;
            }

            #SwitchPanel ul li {
                white-space: nowrap;
                min-height: 20px;
                line-height: 2rem;
                padding: 0 5%;
                border-radius: 5px;
                margin-bottom: .2em;
                transition: .2s ease-out;
                cursor: pointer;
            } #SwitchPanel ul li:hover {
                box-shadow: 0 0 5px #262020;
                
            } #SwitchPanel ul li:active {
                box-shadow: inset 0 1px 2px #111;
                color: #111;
                background: #B1436D;
            } #SwitchPanel ul li.active {
                box-shadow: inset 0 1px 2px #111;
                color: #fff;
                background: #B1436D;
                cursor: default !important;
            }

            #SwitchPanel ul li span {
                color: #eee;
                font-family: "Noto Sans TC", "Noto Sans CJK", "Noto Sans CJK TC", "微軟正黑體";
                font-size: 14px;
            } #SwitchPanel ul li:not(.active):active span,
              #SwitchPanel ul li.active span{
                position: relative;
                left: 1px;
                top: 2px;
            }

            #SwitchPanel ul li img {
                margin-right: .2em;
                width: 16px;
                height: 16px;
            }
        `;
        return oSt;
    })());
    
    let oSwitchPanel = document.createElement("div");
    oSwitchPanel.id = "SwitchPanel";
    oSwitchPanel.className = "collapsed";
    oSwitchPanel.style.height = HEIGHT_NORMAL;
    
    function toggleSwitchPanel(state){
        if (state) {
            oSwitchPanel.className = "expanded";
            oSwitchPanel.style.height = HEIGHT_HOVER;
            document.body.style.overflowY = "hidden";
        } else {
            oSwitchPanel.className = "collapsed";
            oSwitchPanel.style.height = HEIGHT_NORMAL;
            document.body.style.overflowY = "auto";
        }
    }

    oSwitchPanel.onmouseout = func => toggleSwitchPanel(false);
    oSwitchPanel.onmouseover = func => toggleSwitchPanel(true);

    window.onkeyup = function(e){
        if (e.key === "q" || e.key === "Q") {
            toggleSwitchPanel(true);
        } else if (e.key === "Escape"){
            toggleSwitchPanel(false);
        }
    };
    
    let oUl = document.createElement("ul"); //Ul Start
    oUl.style = `
        margin: 0;
        padding: 2px;
        list-style-type: none;
    `;
    oSwitchPanel.style.overflow = "hidden";

    function createSwitchPanelItem(link, text, icon, is_active){
        let oLi = document.createElement("li");
        
        oLi.innerHTML = `
            <span><img src="${icon}" style="vertical-align: middle;"/>${text}</span>`;
        oLi.className = "switchPanelLink";
        if (is_active) {
            oLi.className = "active";
        } else {
            oLi.onclick = function(){
                top.location.href = link;
            };
        }
        return oLi;
    }

    function checkHost(host){
        if (location.host !== host) {
            let www = "www." + host;
            return location.host === www;
        }
        else {
            return true;
        }
    }

    oUl.appendChild(createSwitchPanelItem(KOMICA1_ENTRY_URI, "Komica1", KOMICA1_ICON_URI, checkHost(KOMICA1_HOST)));
    oUl.appendChild(createSwitchPanelItem(KOMICA2_ENTRY_URI, "Komica2", KOMICA2_ICON_URI, checkHost(KOMICA2_HOST)));
    oUl.appendChild(createSwitchPanelItem(NPNT_ENTRY_URI, "N.P.N.T.", NPNT_ICON_URI, checkHost(NPNT_HOST)));
    oUl.appendChild(createSwitchPanelItem(K3_ENTRY_URI, "K3", K3_ICON_URI, checkHost(K3_HOST)));
    oUl.appendChild(createSwitchPanelItem(CAMIKO1_ENTRY_URI, "Camiko1", CAMIKO1_ICON_URI, checkHost(CAMIKO1_HOST)));
    oUl.appendChild(createSwitchPanelItem(CAMIKO2_ENTRY_URI, "Camiko2", CAMIKO2_ICON_URI, checkHost(CAMIKO2_HOST)));
    oUl.appendChild(createSwitchPanelItem(JP_5CH_ENTRY_URI, "5ch", JP_5CH_ICON_URI, checkHost(JP_5CH_HOST)));
    oUl.appendChild(createSwitchPanelItem(ENG_4CHAN_ENTRY_URI, "4chan", ENG_4CHAN_ICON_URI, checkHost(ENG_4CHAN_HOST)));
    oUl.appendChild(createSwitchPanelItem(JP_2CHAN_ENTRY_URI, "2chan", JP_2CHAN_ICON_URI, checkHost(JP_2CHAN_HOST)));
    oUl.appendChild(createSwitchPanelItem(JP_2JIGENNGURO_ENTRY_URI, "二次元グロ", JP_2JIGENNGURO_ICON_URI, checkHost(JP_2JIGENNGURO_HOST)));

    oSwitchPanel.appendChild(oUl); //Ul End


    
    document.body.appendChild(oSwitchPanel);
})();