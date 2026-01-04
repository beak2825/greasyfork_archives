// ==UserScript==
// @name         Wiki Footnotes Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes footnotes from articles
// @author       You
// @match        https://ru.wikipedia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396018/Wiki%20Footnotes%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/396018/Wiki%20Footnotes%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let footnotes_deleted = false
    window.onload = function() {
    let footnotes = document.querySelectorAll('.reference');
    //let hyperlinks = document.querySelectorAll('a');
    let button = document.createElement('button');
       let footnotes_counter = document.createElement('div')
       let footnotes_text= document.createElement('span')
       let other_footnotes = document.querySelectorAll('.new')
       let other_footnotes2 = document.querySelectorAll('.ref-info')
       footnotes_counter.setAttribute('class','plainlinks flaggedrevs_preview')
       footnotes_counter.appendChild(footnotes_text)
       footnotes_counter.style.cssText =`font-size:16px;
border:1px solid #D1D1D1;
border-radius:5px;
font-family:Arial,'sans-serif';`;
        footnotes_text.innerText = "Количество ссылок на источники: "+ footnotes.length
    button.innerText="Удалить ссылки";
    button.setAttribute('id','button');
    button.addEventListener('click',remove_ftnotes)
    document.getElementById("firstHeading").appendChild(footnotes_counter)
    document.getElementById("firstHeading").appendChild(button);
    document.getElementById('button').style.cssText= `
background-color:#F6F6F6;
  border:1px solid #D1D1D1;
border-radius:5px;
margin-left:10px;
margin-bottom:5px;
`;
function remove_ftnotes(){
    if (!footnotes_deleted){
    for (let item of footnotes){
    item.parentNode.removeChild(item);
    }
        for (let item2 of other_footnotes){item2.parentNode.removeChild(item2)};
        for (let item3 of other_footnotes2){item3.parentNode.removeChild(item3)};
    alert('Ссылки на источники удалены из текста!')
    footnotes_deleted = true}else{alert('Ссылки уже удалены!');}
}};
})();