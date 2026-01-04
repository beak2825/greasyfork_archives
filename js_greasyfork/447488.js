// ==UserScript==
// @name         HWM_Resources
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Библиотека всякой мелочевки, для совместной работы других скриптов
// @author       Tags
// @include      /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15|my\.lordswm\.com)\/(pl_info.php*)/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant         none
// @license CC0
// ==/UserScript==

    this.MercenaryElements = {
        "абразив":{
            id: "EL_42",
            art_type: "abrasive"
        }, "змеиный яд":{
            id: "EL_43",
            art_type: "snake_poison"
        }, "клык тигра":{
            id: "EL_46",
            art_type: "tiger_tusk"
        }, "ледяной кристалл":{
            id: "EL_44",
            art_type: "ice_crystal"
        }, "лунный камень":{
            id: "EL_45",
            art_type: "moon_stone"
        }, "огненный кристалл":{
            id: "EL_40",
            art_type: "fire_crystal"
        }, "осколок метеорита":{
            id: "EL_37",
            art_type: "meteorit"
        }, "цветок ведьм":{
            id: "EL_41",
            art_type: "witch_flower"
        }, "цветок ветров":{
            id: "EL_39",
            art_type: "wind_flower"
        }, "цветок папоротника":{
            id: "EL_78",
            art_type: "fern_flower"
        }, "ядовитый гриб":{
            id: "EL_38",
            art_type: "badgrib"
        },};

    (function() {
        'use strict';

        if(!window.location.href.includes('pl_info'))
            return;
        const tables = Array.from(document.getElementsByClassName('wb'));
        const resourceTable = tables[tables.indexOf(tables.filter(e=>e.innerText=="Ресурсы")[0])+3]
        if(resourceTable.hasAttribute("done")){
         
            return;}
        //Вытаскиваем все доступные элементы и превращаем в объекты.
        const source = resourceTable.innerText.split("\n").filter(e=>!(e.includes("Части") || e.includes("Частей"))&&e!==""&&window.MercenaryElements[e.split(':')[0].replaceAll(String.fromCharCode(160),'').toLowerCase()]!==undefined);

        const mappedItems = source.map(e => ({
            name: e.split(':')[0].replaceAll(String.fromCharCode(160),''),
            value: e.split(':')[1].replaceAll(String.fromCharCode(160),''),
            isMercenary: window.MercenaryElements[e.split(':')[0].replaceAll(String.fromCharCode(160),'').toLowerCase()]!==undefined,
        }));
     
        const mercenary = mappedItems.filter(e=>e.isMercenary);
    
        var itemsCount = mercenary.length

for(var i = 0; i<itemsCount; i++){
    resourceTable.innerHTML = resourceTable.innerHTML.substring(resourceTable.innerHTML.indexOf("\n") + 1)
}

        let tempInnerHtml = resourceTable.innerHTML;
        resourceTable.innerHTML ="";
      
        for (let item of mercenary) {
            const div = Object.assign(
                document.createElement('div'), {
                    innerHTML: `<div">&nbsp;&nbsp;&nbsp;&nbsp;<b>${item.name}</b>:&nbsp;${item.value}</div>`,

                });;
            div.setAttribute('ismercenary', item.isMercenary);
            div.setAttribute('name', item.name);
            resourceTable.appendChild(div);
        }

         resourceTable.innerHTML +=(tempInnerHtml);
        resourceTable.setAttribute("done","true")
    })();


