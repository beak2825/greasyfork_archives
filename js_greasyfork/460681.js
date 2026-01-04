// ==UserScript==
// @name         AWBW Power Bars
// @namespace    https://awbw.amarriner.com/
// @version      1.1
// @description  Fixed borked CO power bar images
// @author       twiggy_
// @match        https://awbw.amarriner.com/co.php
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460681/AWBW%20Power%20Bars.user.js
// @updateURL https://update.greasyfork.org/scripts/460681/AWBW%20Power%20Bars.meta.js
// ==/UserScript==

// Andy - https://i.imgur.com/Yuxi2Tl.gif;

function swapSrc(img)
{
    switch(img.src.split('cid=')[1])
    {
        case "1": // Andy
            img.src = 'https://i.imgur.com/ZQLhtIc.gif';
            break;
        case "2": // Grit
            img.src = 'https://i.imgur.com/hOOlWWu.gif';
            break;
        case "3": // Kanbei
            img.src = 'https://i.imgur.com/pz4tNJA.gif';
            break;
        case "5": // Drake
            img.src = 'https://i.imgur.com/TqlJM0L.gif';
            break;
        case "7": // Max
            img.src = 'https://i.imgur.com/f8S9As0.gif';
            break;
        case "8": // Sami
            img.src = 'https://i.imgur.com/XOnlth4.gif';
            break;
        case "8": // Olaf
            img.src = 'https://i.imgur.com/4b4QdYf.gif';
            break;
        case "10": // Eagle
            img.src = 'https://i.imgur.com/1wWu76G.gif';
            break
        case "11": // Adder
            img.src = 'https://i.imgur.com/JLMww9R.gif';
            break;
        case "12": // Hawke
            img.src = 'https://i.imgur.com/rY7hnDq.gif';
            break;
        case "13": // Sensei
            img.src = 'https://i.imgur.com/QVEdMPq.gif';
            break;
        case "14": // Jess
            img.src = 'https://i.imgur.com/BBtBL2m.gif';
            break;
        case "15": // Colin
            img.src = 'https://i.imgur.com/FITlkCA.gif';
            break;
        case "16": // Lash
            img.src = 'https://i.imgur.com/qMTiMNJ.gif';
            break;
        case "17": // Hachi
            img.src = 'https://i.imgur.com/cPhAeSq.gif';
            break;
        case "18": // Sonja
            img.src = 'https://i.imgur.com/l1pm3IV.gif';
            break;
        case "19": // Sasha
            img.src = 'https://i.imgur.com/bCuZvNg.gif';
            break;
        case "20": // Grimm
            img.src = 'https://i.imgur.com/IM73mWH.gif';
            break;
        case "21": // Koal
            img.src = 'https://i.imgur.com/vvJaKvM.gif';
            break;
        case "22": // Jake
            img.src = 'https://i.imgur.com/2RIUaRA.gif';
            break;
        case "23": // Kindle
            img.src = 'https://i.imgur.com/iy2udNY.gif';
            break;
        case "24": // Nell
            img.src = 'https://i.imgur.com/cvUk85j.gif';
            break;
        case "25": // Flak
            img.src = 'https://i.imgur.com/8q5pqDJ.gif';
            break;
        case "26": // Jugger
            img.src = 'https://i.imgur.com/SDNfKvz.gif';
            break;
        case "27": // Javier
            img.src = 'https://i.imgur.com/3sUfgP1.gif';
            break;
        case "28": // Rachel
            img.src = 'https://i.imgur.com/bidtJn5.gif';
            break;
        case "29": // Sturm
            img.src = 'https://i.imgur.com/kgI3lzc.gif';
            break;
        case "30": // Von Bolt
            img.src = 'https://i.imgur.com/Jjmb9IX.gif';
            break;
    }
}

let coDesc = document.getElementsByClassName('small_text');
Array.prototype.forEach.call(coDesc, function(desc) {
    swapSrc(desc.lastElementChild);
});