// ==UserScript==
// @name         show link border demo🔧
// @description  for surface
// @namespace    show_link_border
// @author       Covenant
// @version      1.0.3
// @license      MIT
// @homepage
// @match        *://*/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTEuNjI2IDUxMS42MjciPjxnIGZpbGw9IiMxMjc2Q0UiPjxwYXRoIGQ9Ik0zOTIuODU3IDI5Mi4zNTRoLTE4LjI3NGMtMi42NjkgMC00Ljg1OS44NTUtNi41NjMgMi41NzMtMS43MTggMS43MDgtMi41NzMgMy44OTctMi41NzMgNi41NjN2OTEuMzYxYzAgMTIuNTYzLTQuNDcgMjMuMzE1LTEzLjQxNSAzMi4yNjItOC45NDUgOC45NDUtMTkuNzAxIDEzLjQxNC0zMi4yNjQgMTMuNDE0SDgyLjIyNGMtMTIuNTYyIDAtMjMuMzE3LTQuNDY5LTMyLjI2NC0xMy40MTQtOC45NDUtOC45NDYtMTMuNDE3LTE5LjY5OC0xMy40MTctMzIuMjYyVjE1NS4zMWMwLTEyLjU2MiA0LjQ3MS0yMy4zMTMgMTMuNDE3LTMyLjI1OSA4Ljk0Ny04Ljk0NyAxOS43MDItMTMuNDE4IDMyLjI2NC0xMy40MThoMjAwLjk5NGMyLjY2OSAwIDQuODU5LS44NTkgNi41Ny0yLjU3IDEuNzExLTEuNzEzIDIuNTY2LTMuOSAyLjU2Ni02LjU2N1Y4Mi4yMjFjMC0yLjY2Mi0uODU1LTQuODUzLTIuNTY2LTYuNTYzLTEuNzExLTEuNzEzLTMuOTAxLTIuNTY4LTYuNTctMi41NjhIODIuMjI0Yy0yMi42NDggMC00Mi4wMTYgOC4wNDItNTguMTAyIDI0LjEyNUM4LjA0MiAxMTMuMjk3IDAgMTMyLjY2NSAwIDE1NS4zMTN2MjM3LjU0MmMwIDIyLjY0NyA4LjA0MiA0Mi4wMTggMjQuMTIzIDU4LjA5NSAxNi4wODYgMTYuMDg0IDM1LjQ1NCAyNC4xMyA1OC4xMDIgMjQuMTNoMjM3LjU0M2MyMi42NDcgMCA0Mi4wMTctOC4wNDYgNTguMTAxLTI0LjEzIDE2LjA4NS0xNi4wNzcgMjQuMTI3LTM1LjQ0NyAyNC4xMjctNTguMDk1di05MS4zNThjMC0yLjY2OS0uODU2LTQuODU5LTIuNTc0LTYuNTctMS43MTMtMS43MTgtMy45MDMtMi41NzMtNi41NjUtMi41NzN6Ii8+PHBhdGggZD0iTTUwNi4xOTkgNDEuOTcxYy0zLjYxNy0zLjYxNy03LjkwNS01LjQyNC0xMi44NS01LjQyNEgzNDcuMTcxYy00Ljk0OCAwLTkuMjMzIDEuODA3LTEyLjg0NyA1LjQyNC0zLjYxNyAzLjYxNS01LjQyOCA3Ljg5OC01LjQyOCAxMi44NDdzMS44MTEgOS4yMzMgNS40MjggMTIuODVsNTAuMjQ3IDUwLjI0OC0xODYuMTQ3IDE4Ni4xNTFjLTEuOTA2IDEuOTAzLTIuODU2IDQuMDkzLTIuODU2IDYuNTYzIDAgMi40NzkuOTUzIDQuNjY4IDIuODU2IDYuNTcxbDMyLjU0OCAzMi41NDRjMS45MDMgMS45MDMgNC4wOTMgMi44NTIgNi41NjcgMi44NTJzNC42NjUtLjk0OCA2LjU2Ny0yLjg1MmwxODYuMTQ4LTE4Ni4xNDggNTAuMjUxIDUwLjI0OGMzLjYxNCAzLjYxNyA3Ljg5OCA1LjQyNiAxMi44NDcgNS40MjZzOS4yMzMtMS44MDkgMTIuODUxLTUuNDI2YzMuNjE3LTMuNjE2IDUuNDI0LTcuODk4IDUuNDI0LTEyLjg0N1Y1NC44MThjLS4wMDEtNC45NTItMS44MTQtOS4yMzItNS40MjgtMTIuODQ3eiIvPjwvZz48L3N2Zz4=
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/464269/show%20link%20border%20demo%F0%9F%94%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/464269/show%20link%20border%20demo%F0%9F%94%A7.meta.js
// ==/UserScript==
var anchor_border_style=GM_getValue("anchor_border_style", 'dashed');
var remove_anchor_width=GM_getValue("remove_anchor_width", false);
function create_style(textContent,id,class_name){
    let style=create_node("style",class_name,true,document.body);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
if(document.body!=null){
    var style_user_css=create_style("a{outline-style: "+anchor_border_style+" !important;outline-color: #707070 !important; outline-width: 1px !important;outline-offset: 2px;border-radius: 4px;}\n","gm_user_css_show_link_border",["user_gm_css","css_show_link_border"]);
    if(remove_anchor_width)style_user_css.textContent+=`a{width: auto !important;min-width: 0.1rem;}\n`;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(is_appendChild){node.appendChild(element);}else{node.insertBefore(element, refNode);}
    return element;
}
(function() {
    'use strict';
    GM_registerMenuCommand('dashed', () => {
        GM_setValue("anchor_border_style", 'dashed');
    });
    GM_registerMenuCommand('dotted', () => {
        GM_setValue("anchor_border_style", 'dotted');
    });
    GM_registerMenuCommand('double', () => {
        GM_setValue("anchor_border_style", 'double');
    });
    GM_registerMenuCommand('remove link width'+(remove_anchor_width?"✔️":"❌"), () => {
        GM_setValue("remove_anchor_width", !remove_anchor_width);
    });
    if(document.body==null)return;
})();
