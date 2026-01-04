// ==UserScript==
// @name Gmx - webmails - restore blue buttons bar
// @namespace https://github.com/Procyon-b
// @version 0.2.1
// @description Restore the blue theme of the buttons bar
// @author Achernar
// @grant GM_addStyle
// @run-at document-start
// @match https://3c.gmx.net/mail/client/*
// @match https://3c-bap.gmx.net/mail/client/*
// @match https://3c-bs.gmx.com/mail/client/*
// @match https://3c-bs.gmx.fr/mail/client/*
// @match https://3c-bs.gmx.es/mail/client/*
// @match https://3c-bs.gmx.co.uk/mail/client/*
// @downloadURL https://update.greasyfork.org/scripts/411899/Gmx%20-%20webmails%20-%20restore%20blue%20buttons%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/411899/Gmx%20-%20webmails%20-%20restore%20blue%20buttons%20bar.meta.js
// ==/UserScript==

(function() {
let css = `
/* 20210113.1
restore old buttonbar style (colors). New color scheme uses "web.de"'s gray look everywhere. */

html.theme-intenseblue .menubar {
  background-color: #cbd9ed;
  border-color: #b8cae2;
  background-image: -webkit-linear-gradient(top,#cbd9ed,#bed0e9);
  background-image: linear-gradient(to bottom,#cbd9ed,#bed0e9);
}
html.theme-intenseblue ul.button li.inactive .area, html.theme-intenseblue ul.button li.inactive.transparent .area {
    color: #abaeb5!important;
    NOborder-color: #d2d8e2!important;
}
html.theme-intenseblue ul.button li.inactive:hover .area {
    color: #abaeb5!important;
    NOborder-color: #d2d8e2!important;
}
html.theme-intenseblue ul.button li .dropdown {
    background-position: -178px -290px;
}
html.theme-intenseblue ul.button li .area {
    color: #333;
    border-left-color: #eceff6;
}
html.theme-intenseblue ul.button li {
    border-color: #96a2b8;
    background-color: #fff;
    background: -webkit-linear-gradient(top,#fff,#d6dff0);
    background: linear-gradient(to bottom,#fff,#d6dff0);
}
html.theme-intenseblue ul.button li.inactive, html.theme-intenseblue ul.button li.inactive.transparent {
    background-color: #f5f8fd;
    background: -webkit-linear-gradient(top,#f5f8fd,#e0e6f2);
    background: linear-gradient(to bottom,#f5f8fd,#e0e6f2);
    border-color: #c3cbd8;
}
html.theme-intenseblue ul.button li:hover {
    background-color: #e4ebf5;
    background: -webkit-linear-gradient(top,#e4ebf5,#cdd8ec);
    background: linear-gradient(to bottom,#e4ebf5,#cdd8ec);
}
html.theme-intenseblue ul.button li.inactive:hover {
    background-color: #f5f8fd;
    background: -webkit-linear-gradient(top,#f5f8fd,#e0e6f2);
    background: linear-gradient(to bottom,#f5f8fd,#e0e6f2);
    border-color: #c3cbd8;
}
html.theme-intenseblue .panel-mail-display-table-mail-horizontal .icon.next, html.theme-intenseblue .panel-mail-display-table-mail-vertical .icon.next {
    background-position: -252px -237px;
}
html.theme-intenseblue .panel-mail-display-table-mail-horizontal .icon.prev, html.theme-intenseblue .panel-mail-display-table-mail-vertical .icon.prev {
    background-position: -50px -273px;
}
html.theme-intenseblue .panel-mail-display-table-mail-horizontal .button .change-view {
    background-position: -144px -237px;
}
html.theme-intenseblue .icon.change-view {
    background-position: -126px -237px;
}
html.theme-intenseblue .panel-mail-display-table-mail-vertical .button .change-view {
    background-position: -108px -237px;
}

/* 20210113 gmx modification */
svg.toolbar-button-icon {
  fill: #777;
}
li.inactive svg.toolbar-button-icon {
  fill: #CCC;
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
