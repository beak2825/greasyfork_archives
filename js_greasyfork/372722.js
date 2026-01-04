// ==UserScript==
// @name         picoCTFの順位表を見やすくするやつ
// @namespace    https://2018game.picoctf.com
// @version      0.2
// @description  picoCTF
// @author       keymoon
// @match        https://2018game.picoctf.com/scoreboard
// @downloadURL https://update.greasyfork.org/scripts/372722/picoCTF%E3%81%AE%E9%A0%86%E4%BD%8D%E8%A1%A8%E3%82%92%E8%A6%8B%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/372722/picoCTF%E3%81%AE%E9%A0%86%E4%BD%8D%E8%A1%A8%E3%82%92%E8%A6%8B%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

const deleteUnNecessaryTeam = false;

var interval = setInterval(() => {
	if(!global) return;
	console.log('clear')
	clearInterval(interval)
    //{チーム名:[背景色,文字色]}
	var color = {'HaruharaMai':['gray','white'],'seikatsuKowareru':['olive','white']}
    $('.table tr').each((x,y) => {
        var tds = y.getElementsByTagName('td');
        if(tds.length >= 2 && color[tds[1].innerText]){
            y.style.backgroundColor = color[tds[1].innerText][0];
            y.style.color = color[tds[1].innerText][1];
        }
        else if(deleteUnNecessaryTeam) {
            $(y).remove();
        }
    })
},10);