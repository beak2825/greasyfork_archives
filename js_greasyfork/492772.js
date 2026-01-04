// ==UserScript==
// @name         LNK_workCount
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  количество устройств на работу
// @author       Nemo
// @include      *.heroeswm.ru/objectworkers.php*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/492772/LNK_workCount.user.js
// @updateURL https://update.greasyfork.org/scripts/492772/LNK_workCount.meta.js
// ==/UserScript==

(function() {
    var markBack = document.querySelectorAll('a[href^="object-info"]')[0];
    var allPers = markBack.previousSibling.parentNode.querySelectorAll('.pi');

    function changePers() {
        GM_setValue('LNK_workCount_nick1', document.getElementById('persToFind1').value);
        GM_setValue('LNK_workCount_nick2', document.getElementById('persToFind2').value);
        GM_setValue('LNK_workCount_nick3', document.getElementById('persToFind3').value);
        var nick1 = document.getElementById('persToFind1').value.toLowerCase();
        var nick2 = document.getElementById('persToFind2').value.toLowerCase();
        var nick3 = document.getElementById('persToFind3').value.toLowerCase();
        var persFound1 = 0;
        var persFound2 = 0;
        var persFound3 = 0;
        allPers.forEach((pers) => {
            pers.innerHTML = pers.innerHTML.replace('<span style="background-color: green; color: white;">', '');
            pers.innerHTML = pers.innerHTML.replace('<span style="background-color: blue; color: white;">', '');
            pers.innerHTML = pers.innerHTML.replace('<span style="background-color: purple; color: white;">', '');
            pers.innerHTML = pers.innerHTML.replace('</span>', '');
            var s = pers.innerHTML.toLowerCase().slice(0, pers.innerHTML.indexOf('['));
            if (s == nick1) {
                pers.innerHTML = pers.innerHTML.replace(pers.innerHTML, '<span style="background-color: green; color: white;">' + pers.innerHTML + '</span>');
                persFound1++;
            }
            if (s == nick2) {
                pers.innerHTML = pers.innerHTML.replace(pers.innerHTML, '<span style="background-color: blue; color: white;">' + pers.innerHTML + '</span>');
                persFound2++;
            }
            if (s == nick3) {
                pers.innerHTML = pers.innerHTML.replace(pers.innerHTML, '<span style="background-color: purple; color: white;">' + pers.innerHTML + '</span>');
                persFound3++;
            }
        });
        document.getElementById('persCount1').innerHTML = 'Найдено: ' + persFound1;
        document.getElementById('persCount2').innerHTML = 'Найдено: ' + persFound2;
        document.getElementById('persCount3').innerHTML = 'Найдено: ' + persFound3;
    } //changePers

    for (var i = 0; i < 3; i++) {markBack.previousSibling.parentNode.removeChild(markBack.previousSibling).remove;}
    for (i = 0; i < 2; i++) {markBack.nextSibling.parentNode.removeChild(markBack.nextSibling).remove;}
    
    var nick3Div = document.createElement('div');
    nick3Div.innerHTML = 'Ник:&nbsp;<input type="text" id="persToFind3" size=40><span id="persCount3" style="padding-left: 10px;">Найдено: 0</span>';
    markBack.after(nick3Div);
    document.getElementById('persToFind3').oninput = changePers;
    document.getElementById('persToFind3').value = GM_getValue('LNK_workCount_nick3', '');
    
    var nick2Div = document.createElement('div');
    nick2Div.innerHTML = 'Ник:&nbsp;<input type="text" id="persToFind2" size=40><span id="persCount2" style="padding-left: 10px;">Найдено: 0</span>';
    markBack.after(nick2Div);
    document.getElementById('persToFind2').oninput = changePers;
    document.getElementById('persToFind2').value = GM_getValue('LNK_workCount_nick2', '');
    var nick1Div = document.createElement('div');
    
    nick1Div.innerHTML = 'Ник:&nbsp;<input type="text" id="persToFind1" size=40><span id="persCount1" style="padding-left: 10px;">Найдено: 0</span>';
    nick1Div.style = 'margin-top: 10px';
    markBack.after(nick1Div);
    document.getElementById('persToFind1').oninput = changePers;
    document.getElementById('persToFind1').value = GM_getValue('LNK_workCount_nick1', '');
    
    changePers();
})();