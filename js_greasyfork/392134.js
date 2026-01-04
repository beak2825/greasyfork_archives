// ==UserScript==
// @name FobosKeyColumn
// @description Add column with key for Fobos dashboard
// @author Andrii
// @license MIT
// @version 1.0
// @match https://mars.teamlead.ru/projects/SD/queues/*
// @namespace https://greasyfork.org/users/396031
// @downloadURL https://update.greasyfork.org/scripts/392134/FobosKeyColumn.user.js
// @updateURL https://update.greasyfork.org/scripts/392134/FobosKeyColumn.meta.js
// ==/UserScript==
// [1] Оборачиваем скрипт в замыкание, для кроссбраузерности (opera, ie)

(function (window, undefined) {// [2] нормализуем window
   var w;
    if (typeof unsafeWindow != undefined) {
        w = unsafeWindow
    } else {
        w = window;
    }
if (w.self != w.top) {
        return;
    }
var table = document.getElementById("content");
// // Конфигурация observer (за какими изменениями наблюдать)
const config = {
    attributes: false,
    childList: true,
    subtree: true
};

const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
               var table = document.getElementById("issuetable");
                  if(table){
                      if(!(table.innerHTML.indexOf("<span>Ключ</span>")>0||table.innerHTML.indexOf("<span>Key</span>")>0)){
                      var newtable = table.innerHTML.replace("<th><span>Тема</span></th>","<th><span>Тема</span></th><th><span>Key</span></th>");
                      table.innerHTML = newtable.replace(/<a class=\"issue-link\" data-issue-key=\"(.*)\" href=\"(.*)\">(.*)<\/a>/g,"<a class=\"issue-link\" data-issue-key=\"$1\" href=\"$2\">$3</a></p></td><td><p>$1");
                  }
                 }
                console.log('A child node has been added or removed.');
        } else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};
//               function waitForElement(){
//                    table = document.getElementById("issuetable");
//                   if(table){
//                       var newtable = table.innerHTML.replace("<th><span>Тема</span></th>","<th><span>Тема</span></th><th><span>Key</span></th>");
//                       table.innerHTML = newtable.replace(/<a class=\"issue-link\" data-issue-key=\"(.*)\" href=\"(.*)\">(.*)<\/a>/g,"<a class=\"issue-link\" data-issue-key=\"($1)\" href=\"($2)\">($3)</a></p></td><td><p>($1)");
//                       alert("replaced");
// //                       observer.observe(table, config);
//                   }
//                   else{
//                       setTimeout(waitForElement, 2500);
//                       console.log("waiting for element");
//                   }
//               }
//     setTimeout(waitForElement, 2500);

 // Создаем экземпляр наблюдателя с указанной функцией обратного вызова
const observer = new MutationObserver(callback);
// // Начинаем наблюдение за настроенными изменениями целевого элемента
 observer.observe(table, config);

})(window);