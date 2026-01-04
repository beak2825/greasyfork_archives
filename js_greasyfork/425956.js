// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  скрипт для ЕЦП
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425956/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/425956/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

function get(el){
    return document.querySelector(el)
}

function getAll(el){
    return document.querySelectorAll(el)
}

Node.prototype.get=function(el){
    return Node.querySelector(el)
}

Node.prototype.getAll=function(el){
    return Node.querySelectorAll(el)
}

function fillFields(){
	//вид обращения
//setTimeout(()=>{get("#commonSprCombo-2766-trigger-picker").click()},150)
setTimeout(()=>{get("[data-recordid='1862']").click()},150)



//цель посещения

//get("#swVizitTypeCombo-2770-trigger-picker").click()
get("[data-recordid='1870']").click()


}

let b="<input type=button value='Заполнить поля' onclick='fillFields()'>"

let mo=new MutationObserver(muts=>{
	muts.forEach(mut=>{
        if(mut.getAttribute("id")=="ext-gen2371"){
            get("#ext-gen2371").click() //закрыть окно COVID
        }
//создаем кнопку заполнить поля



    })
})
.observe(document, {childList: true, subtree: true})








//завершение случая

//результат

get("#swResultClassCombo-3122-trigger-picker").click()
get("[data-recordid='2755']").click()

//исход
get("#x6-list-plain") //список исходов лечения
getAll("#x6-list-plain li")[0] // [0] выздоровление
                              // [2] улучшение
 
get("#commonSprCombo-3124-trigger-picker").click()

//причина

//get("#swDiagCombo-3133-trigger-picker").click()

get("#swDiagCombo-3133-inputEl").value="w19"

getAll("#swDiagCombo-3133-picker ul li")[0].click()
})();