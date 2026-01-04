// ==UserScript==
// @name         [GC][Backup] - Tax Trophy Calculator
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @match        https://www.grundos.cafe/games/highscores/?game_id=23
// @match        https://www.grundos.cafe/games/highscores/?game_id=24
// @match        https://www.grundos.cafe/games/highscores/?game_id=25
// @match        https://www.grundos.cafe/games/highscores/?game_id=37
// @match        https://www.grundos.cafe/games/highscores/?game_id=38
// @version      1.0
// @license      MIT
// @description  Display minimum NP you should have on hand to be eligible for a trophy.
// @author       Cupkait
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/547295/%5BGC%5D%5BBackup%5D%20-%20Tax%20Trophy%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/547295/%5BGC%5D%5BBackup%5D%20-%20Tax%20Trophy%20Calculator.meta.js
// ==/UserScript==

const taxDetails = {
    "23": { name: "Tax Beast", rate: "10" },
    "24": { name: "Angry Tax Beast", rate: "25" },
    "25": { name: "Sloth's Invasion Tax", rate: "20" },
    "37": { name: "Marrow Tax", rate: "05" },
    "38": { name: "Snow Beast Appropriation", rate: "10" }
};

const goldCurr = parseInt(document.querySelector('tr:nth-child(4) > td:nth-child(3)').textContent.replace(/,/g, ''), 10);
const silverCurr = parseInt(document.querySelector('tr:nth-child(9) > td:nth-child(3)').textContent.replace(/,/g, ''), 10);
const bronzeCurr = parseInt(document.querySelector('tr:nth-child(18) > td:nth-child(3)').textContent.replace(/,/g, ''), 10);

const gameID = parseInt(window.location.href.match(/=(\d+)$/)[1], 10);
const taxRate = parseInt(taxDetails[gameID].rate);

var goldMin = Math.ceil(goldCurr * (100 / taxRate) + taxRate).toLocaleString();
var silverMin = Math.ceil(silverCurr * (100 / taxRate) + taxRate).toLocaleString();
var bronzeMin = Math.ceil(bronzeCurr * (100 / taxRate) + taxRate).toLocaleString();



const trophyImages = document.querySelector('.text-center > p:nth-child(3)')
trophyImages.remove();
const minDisplay = document.createElement('div');
minDisplay.style.marginLeft = '100px';
minDisplay.style.marginRight = '100px';
minDisplay.style.paddingBottom = '5px';
minDisplay.style.marginTop = '10px'
minDisplay.style.marginBottom = '10px'
minDisplay.style.backgroundColor = 'beige';
minDisplay.style.border = '2px solid black';
minDisplay.innerHTML = `<h3>Tax Trophy Calculator</h3><p style="margin:15px">This calculator tells you the minimum NP to keep on hand to be eligible for each trophy.</p>${trophyImages.innerHTML}<p><strong>Gold:</strong> ${goldMin}<br><strong>Silver:</strong> ${silverMin}<br><strong>Bronze:</strong> ${bronzeMin}<p style="font-size:10px"><strong>DISCLAIMER</strong>: Check back frequently to make sure someone else hasn't gotten a high score and raised the bar.`
const nomarginElement = document.querySelector('.xlfont');
nomarginElement.insertAdjacentElement('beforebegin', minDisplay);

minDisplay.querySelectorAll('img').forEach(img => {
    img.style.mixBlendMode = 'multiply';
    img.style.transform = 'translate3d(0, 0, 0)';

});
