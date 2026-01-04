// ==UserScript==
// @name         scratch
// @namespace    http://tampermonkey.net/
// @version      1.3.3.7
// @description  игруля для скретча
// @author       awefawef211241
// @match        https://scratch.mit.edu
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCABAADMDASIAAhEBAxEB/8QAGwAAAQUBAQAAAAAAAAAAAAAABAACAwUGAQf/xAAyEAACAQMDAQUGBQUAAAAAAAABAgMABBESITEFBkFRYXETIjKBoeEUM1KRsUJygsHx/8QAGAEAAwEBAAAAAAAAAAAAAAAAAgMEAQD/xAAdEQADAQEAAgMAAAAAAAAAAAAAARECIQMSIjFB/9oADAMBAAIRAxEAPwCPtJDD1iwe3kJUE6kYf0sOD9q8svLCayuTDcLpYcHuPmK9HM5A8fOqzqkUd9EUmXP6SOQanxuD9GT6N0p+qdRS1V1RcapG50qOcedajtF2atk6YJbBBG9tGSQD+Yo3OfPk5oLoPQb+Hq8E+UjSNsgFt3HoO41o+1LLc9GuYrB2eZtJUK2nKZ3z8u6u8mn7KE+m6eaBGbvHzPFEKBFpJ+hqD3lcqwwRsQaWe7xpwaLiPq0pQGRFdu9iDk0qqQTj4qVD6oM9AdwRvToDHGNbqCd8HwFQyyLpPujPjUV2+iAAd6j61KZ5W/pFl0y4DSmU8sQAP8hn6UDJcrBZ3Mso2VANueftUlufw6Ljdgu23lQd+heykQAEEZPnQpdI2+woO0lsqzpdxZCzD3v7sc/MfxVP4eVaTrq+16Pbum5VlJ89jWcxxmq8Ooow6jpIzsaVNIGfvSpnAzbyzHGQOKbHqu54klHur3DwFOMKA+9IT6d1EWcarFJIpyfhU/zUdN24qMuZ40y0jac8U1XWaLUp1KRyDQN67SSHABUbDNTdJYhponxoxqGPHiuS5SZ+L4+36VM7zfh2tHXUiuSGPNVk1tkErz61b9TQx3sgGdJ3GPSgGPrgU/L5wflcK0o2dwaVGlsHilTKbDVSvg6Sv7VJLIbaz0HAPxEeGagd3I2wD5Vn72a9gukM0zOvdnjFTLNO2mw6W42JwTUvSrjXerHggurD9hn/AFQ7IZVDK4IIrkUZjbKyhG/UAdqOI5qqEvVwy3JYD4l+1AMSceNduL+eWdUuihC7ZC4z4E01s552NElEZhNKMb7In/tKuZ9aVEbT/9k=
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528283/scratch.user.js
// @updateURL https://update.greasyfork.org/scripts/528283/scratch.meta.js
// ==/UserScript==

(function() {
let a = 0;
let score = 0;
let game = `
<div id="score">
 <input class="input" id="inputlol" value="score" style="direction: rtl">
</div>
<div id="button">
 <button class="button" id="button1" onclick="if(score > 499) { score = score-500; score = document.getElementById('inputlol').value = 'я тя обманул)))0)0'; } ">умножить твои очки на 3(500 очков)</button>
</div>
<div id="box">
 <p class="1">на что я жмал</p>
 <p class="2">дойди до 1000 очков</p>
 <button class="button" onclick="if(score == '[object HTMLDivElement]') score = 0; if(score == 'я тя обманул)))0)0') score = 0; if(score == 999) score = '!красава ты yt прошёл'; if(score < 999) score = score+1; score = document.getElementById('inputlol').value = score;">жмай кнопку</button>
</div>
<style>
.1 { position:absolute; z-index: 2; }
.2 { position:absolute; bottom:20px; }
.button { position:absolute; width: 110px; height: 80px; z-index: 1; }
#button1 { position:absolute; width: 150px; height: 120px; }
#box { position:absolute; z-index: 10; left: 335px; bottom: 470px; }
#score { position:absolute; z-index: 10; left: 190px; bottom: 560px; }
#button { position:absolute; z-index: 10; left: 170px; bottom: 500px; }
</style>
`
let gameHTML = document.createElement('div');
gameHTML.innerHTML = game;
document.body.appendChild(gameHTML);

let remove = document.getElementByClassName('button button see-inside-button');
remove.remove();
})();