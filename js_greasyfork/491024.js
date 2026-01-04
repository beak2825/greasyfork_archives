// ==UserScript==
// @name         LNK_clanLastActive
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  время последней активности игроков клана (запрос по каждому персу)
// @author       Nemo
// @include      http*://*.heroeswm.ru/clan_info.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491024/LNK_clanLastActive.user.js
// @updateURL https://update.greasyfork.org/scripts/491024/LNK_clanLastActive.meta.js
// ==/UserScript==

(function() {
const charsRows = document.querySelectorAll('table[style="border-top: none;"] tr');

const charsTable = document.querySelector('table[style="border-top: none;"]');
const getInfoButton = document.createElement('button');
let isActivated = false;
getInfoButton.onclick = ()=>{
    if(isActivated){
        return;
    }
    isActivated = true;
    getInfoButton.innerHTML = 'Ждите... Для повторного запроса данных обновить страницу)';
    displayUserActivity();
};
getInfoButton.innerText = 'Когда сокланы были в игре?';
getInfoButton.id = 'getInfoButtonID';
charsTable.before(getInfoButton);

let indexTimeout = 0;

function displayUserActivity(){ var n=0;
    for (const row of charsRows){
        const children = row.children;
        const tdClassName = children[0].className;
        const isOnline = tdClassName == 'wblight';
        //n++; if (n>2) {break;}
        if (!children[2].children[0]) {
            document.querySelector('#getInfoButtonID').innerHTML = 'Туман войны?';
            break;
        }
        if(!isOnline){
           setTimeout(()=>{
            whenOnline(children[2].children[0].href).then(days=>{
                const daysSpan = document.createElement('span');
                if(!days){
                    daysSpan.innerHTML = '';
                    return;
                }
                children[2].innerHTML += days;
                children[2].width = '33%';
            });
           }, indexTimeout*150); 
        }else{
            children[2].innerHTML += ' в игре';
        }
    }
}

async function whenOnline(userInfoUrl){
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', encodeURI(userInfoUrl));
        xhr.onload = function(){
            if (xhr.status === 200)
            {
                var lastTime = '- время не найдено';
                var pers = xhr.responseText;
                var n = pers.indexOf('<i>В последний раз');
                if (n > 0) {
                    lastTime = pers.slice(n+19,pers.indexOf('</i>'));
                    lastTime = '-' + lastTime.replace('была','').replace('был','');
                }
                n = pers.indexOf('<b>(заблокирован)');
                if (n > 0) {
                    lastTime = '<span> заблокирован</span><font color="blue">"Нубекс"</font>';
                    lastTime = '<font color="red"> заблокирован!</font>';
                }
                resolve(lastTime);
            }
            else {
                console.log('запрос провален. ошибка) ' + xhr.status);
                resolve('ошибка запроса');
            }
        };
        xhr.send();
    });
}
})();