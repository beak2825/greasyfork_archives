// ==UserScript==
// @name         Copy_event_battles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Даёт возможность скопировать бои ивента в протоколе боёв!
// @author       Super-Dragon
// @match        https://www.heroeswm.ru/pl_warlog.php*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/472806/Copy_event_battles.user.js
// @updateURL https://update.greasyfork.org/scripts/472806/Copy_event_battles.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var pos=document.evaluate('/html/body/center/div[2]/div/div[2]/center', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var place = document.createElement('div');
    var input = document.createElement('input');
    input.placeholder = "Название ивента...";
    var btn = document.createElement('button');
    btn.innerHTML="Скопировать бои";
    place.append(input);
    place.append(btn);
    let copied = document.createTextNode("Скопировано");
    let noText = document.createTextNode("Вставьте название ивента");
    let notFound = document.createTextNode("Ошибка в названии или не найдено боёв");
    try{
        pos.append(place);
    }
    catch{
        alert("Error");
    }
    btn.onclick=()=>{
        const event = input.value;
        if(event==""){
            pos.append(noText);
            return;
        } else{
            try{
                pos.removeChild(noText);
            } catch{
            }

        }
        let ok = false;
        let copy="Бои ивента \""+event+"\"\n";
        try{
            pos.removeChild(copied)
            const battles = document.evaluate('/html/body/center/div[2]/div/div[2]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            let rows = [... battles.innerHTML.matchAll(/(?<=&nbsp;&nbsp;)[\w\W]*?(?=<br>)/g)];
            for(let i=0;i<40;i++){
                if(String(rows[i]).includes(event)){
                    const regexString = `(?<=<i>${escapeRegExp(event)} \\()[\\w\\W]*?(?=\\*\\))`;
                    const regex = new RegExp(regexString, "g");
                    if(String(rows[i]).match(regex)!=null){
                        ok=true;
                        copy=copy+String(rows[i]).match(regex)+"\thttps://www.heroeswm.ru/war.php?lt=-1&"+String(rows[i]).match(/(?<=<a\ href="warlog\.php\?)[\w\W]*?(?=">)/)+"\n"
                    }
                }
            }
            if(ok){
                GM_setClipboard(copy);
                setTimeout(() => {
                    pos.append(copied);
                }, 10);
            } else {
                pos.append(notFound);
                return;
            }
        
        }catch{
            const battles = document.evaluate('/html/body/center/div[2]/div/div[2]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            let rows = [... battles.innerHTML.matchAll(/(?<=&nbsp;&nbsp;)[\w\W]*?(?=<br>)/g)];
            for(let i=0;i<40;i++){
                if(String(rows[i]).includes(event)){
                    const regexString = `(?<=<i>${escapeRegExp(event)} \\()[\\w\\W]*?(?=\\*\\))`;
                    const regex = new RegExp(regexString, "g");
                    if(String(rows[i]).match(regex)!=null){
                        ok=true;
                        copy=copy+String(rows[i]).match(regex)+"\thttps://www.heroeswm.ru/war.php?lt=-1&"+String(rows[i]).match(/(?<=<a\ href="warlog\.php\?)[\w\W]*?(?=">)/)+"\n"
                    }
                }
            }
            if(ok){
                GM_setClipboard(copy);
                setTimeout(() => {
                    pos.append(copied);
                }, 10);
            } else {
                pos.append(notFound);
                return;
            }
        }
    }
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

})();