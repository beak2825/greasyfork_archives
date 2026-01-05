// ==UserScript==
// @name        HWM_Color_Market_Sell_Options
// @namespace   Рианти
// @description Позволяет долгосрочно окрашивать артефакты из меню выбора на продажу при выставлении нового лота
// @include     http://www.heroeswm.ru/auction_new_lot.php
// @version     1
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/12719/HWM_Color_Market_Sell_Options.user.js
// @updateURL https://update.greasyfork.org/scripts/12719/HWM_Color_Market_Sell_Options.meta.js
// ==/UserScript==

var gmVar = 'HWM_Color_Market_1';

function setColor(el){
    el.style = 'background-color: #DBFFB4';
}
function setHuntColor(el){
    el.style = 'background-color: #FCD35F';
}
function dropColor(el){
    el.style = '';
}
function loadData(){
    return JSON.parse(GM_getValue(gmVar, '[]'));
}
function saveData(data){
    GM_setValue(gmVar, JSON.stringify(data));
}
function paint(){
    var select = document.querySelector('select[name="item"]');
    var options = select.childNodes;
    var colored = loadData();
    var i;
    for(i in options){
        if(options[i].value == undefined || options[i].value == ''){
            options[i].oncontextmenu = function(){return false}
            continue;
        } else if(options[i].innerHTML.indexOf('охотник') > -1 || options[i].innerHTML.indexOf('зверобо') > -1){
            setHuntColor(options[i]);
        } else if(colored.indexOf(options[i].value) > -1){
            setColor(options[i]);
        } else {
            dropColor(options[i]);
        }
        options[i].oncontextmenu = function(){
            changeDisplay(this);
            return false;
        }
    }
}
function changeDisplay(el){
    var colored = loadData(), i;
    if((i = colored.indexOf(el.value)) > -1){
        delete colored[i];
        saveData(colored);
        dropColor(el);
    } else {
        colored.push(el.value);
        saveData(colored);
        setColor(el);
    }
}
try{
    paint();
} catch (e){ console.log(e); }