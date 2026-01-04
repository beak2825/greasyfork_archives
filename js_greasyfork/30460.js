// ==UserScript==
// @name         Отключить все стили
// @namespace    DisAllStyle
// @version      0.1
// @description  Remove all styles!
// @include        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30460/%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%B2%D1%81%D0%B5%20%D1%81%D1%82%D0%B8%D0%BB%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/30460/%D0%9E%D1%82%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D1%8C%20%D0%B2%D1%81%D0%B5%20%D1%81%D1%82%D0%B8%D0%BB%D0%B8.meta.js
// ==/UserScript==

window.addEventListener('load',function(){
    but=document.createElement('button');
    but.onclick=function(){
        var st=document.createElement('style');
        st.innerText='*{all:unset !important;}';
        document.body.appendChild(st);
        this.remove();
    };
    but.innerText='Disable All Styles';
    but.style.position='fixed';
    but.style.bottom='0';
    but.style.right='0';
    but.style.zIndex='99999999999';
    document.body.appendChild(but);
});