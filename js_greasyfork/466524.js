// ==UserScript==
// @name         LNK_klan_sklad_info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  количество и прочка артов на складе клана
// @author       You
// @match        https://www.heroeswm.ru/sklad_info.php?id=19&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466524/LNK_klan_sklad_info.user.js
// @updateURL https://update.greasyfork.org/scripts/466524/LNK_klan_sklad_info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var statOn = false;

    function showStat() {
        //alert('1');
        if (document.getElementById('showStatDivID')) { document.getElementById('showStatDivID').remove(); return 0;}
        var artN = [], artV = [], artP = [], curArt, curArtN, curArtV, curArtP, stat = '', countBrackets = 0, n1, curI;
        var tab = document.querySelectorAll("table[width='970']")[3];
        var showStatDiv = document.createElement('div');
        showStatDiv.id = 'showStatDivID';
        var arts = document.querySelectorAll("font[style='font-size:9px']");
        arts.forEach(function(item, i, arr) {
            curArt = item.innerHTML;
            if (curArt[0] == "'") {
                n1 = curArt.indexOf("'",2);
                if (n1 > 0) {
                    curArtN = curArt.slice(1,n1);
                    curArtP = curArt.slice(curArt.indexOf('[',n1)+1,curArt.indexOf('/',n1));
                    //if (i==7) alert(curArtP);
                    curI = artN.indexOf(curArtN);
                    if ((i > 2) && (artN.indexOf(curArtN)) < 0) {
                        artN.push(curArtN);
                        artV.push(1);
                        artP.push(Number(curArtP));
                    } else {
                        artV[curI]++;
                        artP[curI] += Number(curArtP);
                    }
                }
            }
        });
        //alert(arts[95].innerHTML);
        for (var i = 0; i < artN.length; i++) {
            stat += artN[i] + ' - '+artV[i] + ' шт. ('+artP[i] + ' прочки)<br>';
        }
        showStatDiv.innerHTML = stat;
        //showStatDiv.style = 'display: inline-block; background-color: PaleGreen; box-shadow: 0 0 3px rgba(0,0,0,1); text-align: center; width: 200px';
        tab.after(showStatDiv);
    }

    var td = document.querySelector("a[href*='sklad_log.php?id=19']");
    var showStatCheck = document.createElement('div');
    showStatCheck.innerHTML = '<input type="button" id="showStatCheck" value="Статистика" />';
    showStatCheck.style = 'display: inline-block; background-color: PaleGreen; box-shadow: 0 0 3px rgba(0,0,0,1); text-align: center; width: 200px';
    td.parentNode.after(showStatCheck);
    document.getElementById('showStatCheck').onclick = showStat;
    //alert(td.innerHTML);
})();