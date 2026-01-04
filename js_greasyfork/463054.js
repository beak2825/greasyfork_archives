// ==UserScript==
// @name         Cambridge_book_cover
// @namespace    niu541412
// @version      0.1
// @license      MIT License
// @description  Add direct link to big cover of books.
// @author       niu541412@gmail.com
// @match        *://*.cambridge.org/core/books/*
// @grant        none
// @icon         data:image/vnd.microsoft.icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAAAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDvLj/kY+L/5GPi//MxMD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL+1tv8uLqD/hIr/////9P////b/hIr//zc5mf/MwcD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGBbiP8AM8z/ADPM/4SK///59uP/tqms/4SK//8AM8z/ADPM/29iiP8AAAAAAAAAAAAAAAAAAAAAAAAAAFRWiv8AM8z/IYrG/xRqt/+Eiv//tqms//fz5f+Eiv//G06+/yWIzP8AM8z/WF9+/wAAAAAAAAAAAAAAAJqPmv8AM8z/IKvR/zWuw/8ag83/hIr////86/+2qaz/hIr//xl3zf8krcr/LrPH/wAzzP+aj5j/AAAAAAAAAABmbo//H6fl/y2juv8iksv/E1y4/4SK//+2qaz///bs/4SK//8SkM//Lp64/ySWy/8leNr/Zm6P/wAAAAAAAAAANDyW/wAzzP8Ufcb/G1e6/wcrxP+Eiv/////p////7P+Eiv//Biy8/xR8xv8fU8D/ADPM/zQ8lv8AAAAAAAAAAF1Zpf+Eiv//hIr//4SK//+Eiv//a3rS/7O0v/+rsbv/cn/Z/4SK//+Eiv//hIr//4SK//9dXaL/AAAAAAAAAACRj4v///7y/9HMwv/y7uP////f/5KT1v8TLtX/EinN/6el5P///+b/8e3i/8/MwP////P/kY+L/wAAAAAAAAAAkY+L///////q6OD/29bT///74v93frj/DTTS/w0uy/+Ji8L////s/9nV0P/r6OL//////5GPi/8AAAAAAAAAAFFWnv+Eiv//hIr//4SK//+Eiv//g4vi/8DIxf++xcP/hY3o/4SK//+Eiv//hIr//4SK//9UV5v/AAAAAAAAAAAyOpv/ADPM/wAzzP8UNb//D0G9/4SK//////D/6efV/4SK//8AM8z/FjTE/wAzzP8AM8z/M0iP/wAAAAAAAAAATkmS/yen8f80ncD/JK/R/xV+wv+Eiv//5d7O//n55v+Eiv//ADPM/yKqz/81osL/Jbzp/05Jkv8AAAAAAAAAAEZWg/8jcNv/L6S+/zSTuf8WYsb/hIr///r25f/o3tP/hIr//xRKxv8uoLz/M568/yVi3f9GVoP/AAAAAAAAAAAzQ5T/M5P3/yCX2P8xaNj/ADPM/4SK//////L////0/4SK//8lcOP/L4Xo/yJ80P8AM8z/M0OU/wAAAAAAAAAAS0Z0/zNDlP9IXo//R1uP/zlMh/9eX6D/q6ed/6mnnf9bWqD/PkSP/0hdkP9IW4//M0OU/0tGdP8AAAAA/D8AAPAPAADgB8MAwAMAAIABApOAAQAAgAEAAIAB/wCAAQAAgAEAAIAB//+AAf//gAH/AIABAACAAQAAgAH/AA==
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/463054/Cambridge_book_cover.user.js
// @updateURL https://update.greasyfork.org/scripts/463054/Cambridge_book_cover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top != window.self) {
        return;
    }
    var select_botton=document.getElementsByClassName("select-all")[0];
    var large_url=document.querySelector("meta[property='og:image']").content;
    let insertnode = document.getElementsByClassName("button-group")[1];
    let insertdom = document.createElement("li");
    insertdom.classList.add("button","small","radius","transparent");
    let p = document.createElement("a");
    p.append("Large cover");
    p.href = large_url;
    //p.target="_blank"
    insertdom.append(p);
    insertnode.insertBefore(insertdom, insertnode.children[3]);
    select_botton.click()
})();
