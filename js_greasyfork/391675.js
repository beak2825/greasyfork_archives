// ==UserScript==
// @name         Neopets: Main Shop Auto-Haggler
// @version      1.2.2
// @namespace    Original by npm @ clraik, updated by me
// @description  A Neopets Main Shop Auto-Haggler. 
// @match        http://www.neopets.com/haggle.phtml*
// @match        http://www.neopets.com/haggle.phtml
// @include      http://www.neopets.com/objects.phtml?obj_type=*&type=shop
// @include      http://www.neopets.com/objects.phtml?type=shop&obj_type=*
// @downloadURL https://update.greasyfork.org/scripts/391675/Neopets%3A%20Main%20Shop%20Auto-Haggler.user.js
// @updateURL https://update.greasyfork.org/scripts/391675/Neopets%3A%20Main%20Shop%20Auto-Haggler.meta.js
// ==/UserScript==

/* Raise these if you want it to 'hesitate' longer before clicking the captcha */
const MIN = 550, // in milliseconds
      MAX = 850, // in milliseconds
      DELAY = (Math.round(Math.random() * (MIN - MAX)) + MIN);
/*
If you dont want the script to complete the captcha for you just change
var OCR = true;
to
var OCR = false;
*/
var OCR = true;

function solveCaptcha(url, callback) {
    var captcha = new Image();
    captcha.src = url;
    captcha.onload = function() {
        let width = captcha.width,
            height = captcha.height,
            canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(captcha, 0, 0);
        let imgData = canvas.getContext("2d").getImageData(0, 0, width, height),
            lowY = 999,
            lowX = 999,
            low = 999;
        for (let x = 0; x < imgData.width; x++){
            for (let y = 0; y < imgData.height; y++){
                let i = x * 4 + y * 4 * imgData.width,
                    avg = Math.floor((imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) /3);
                if (avg < low){
                    low = avg;
                    lowX = x;
                    lowY = y;
                }
            }
        }
        callback(lowX, lowY);
    }
}
function smartHaggle(haggle){
    let val = [haggle.substr(0,1), haggle.substr(1,1)],
        endPrice = "";
    for (let i = 0; i < haggle.length; i++) endPrice += val[(i % 2)];
    return endPrice;
}
switch(true){
    case document.URL === 'http://www.neopets.com/haggle.phtml':
        (function(){
            document.querySelectorAll('form')[1].submit();
        })();
        break;
    case document.URL.includes('objects.phtml'):
        (function(){
            if(document.querySelector('table[align="center"][cellpadding="4"][border="0"]')){
                let rows = document.querySelector('table[align="center"][cellpadding="4"][border="0"]').children[0].rows;
                for (let i = 0; i < rows.length; i++) {
                    for (let j = 0; j < rows[i].cells.length; j++){
                        rows[i].cells[j].firstChild.onclick = null;
                    }
                }
            }
        })();
        break;
    case document.URL.includes('haggle.phtml'):
        (function(){
            if(document.querySelector('div[align=center]').querySelector('img[width="450"][height="150"]')){
                let src = document.querySelector('div[align=center]').querySelector('img[width="450"][height="150"]'),
                    offer = document.querySelector('#shopkeeper_makes_deal').childNodes[1].textContent,
                    haggle = (offer.match(/([0-9-,]+)/)[0]).replace(",", "");
                document.querySelector('input[name=current_offer]').value = smartHaggle(haggle);
                if(OCR){
                    solveCaptcha(document.querySelector('input[type="image"]').src, function(x, y) {
                        setTimeout(function(){
                            let haggleForm = document.querySelector('form[name="haggleform"]'),
                                newInputX = document.createElement("input"),
                                newInputY = document.createElement("input");
                            newInputX.type = "hidden";
                            newInputX.name = "x";
                            newInputX.value = x;
                            haggleForm.appendChild(newInputX);

                            newInputY.type = "hidden";
                            newInputY.name = "y";
                            newInputY.value = y;
                            haggleForm.appendChild(newInputY);

                            haggleForm.submit();
                        }, DELAY);
                    })
                }
            }
        })();
        break;
}
