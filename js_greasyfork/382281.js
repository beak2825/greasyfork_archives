// ==UserScript==
// @name         Poland Visa Applicator
// @namespace    http://e-konsulat.gov.pl/
// @version      0.1
// @description  Brute Force the visa application page
// @author       Serhii Kukunin <sergey.kukunin@gmail.com>
// @match        https://secure.e-konsulat.gov.pl/Uslugi/RejestracjaTerminu.aspx*
// @grant        none
// @
// @downloadURL https://update.greasyfork.org/scripts/382281/Poland%20Visa%20Applicator.user.js
// @updateURL https://update.greasyfork.org/scripts/382281/Poland%20Visa%20Applicator.meta.js
// ==/UserScript==

//CONFIGURATION VARIABLES
var captchaKey = "YOUR_2captcha.com_API_KEY";
//Configure your dates here
var dates = {
    "89": "2015-01-27", //Kyiv
    "90": "2015-01-26", //Odessa
    "92": "2015-01-23"  //Lviv
};
var notificationSound = "http://soundbible.com/mp3/Modem-KP-551027942.mp3";

var noDateMessage = 'Відсутність вільні дати до ';
var noScriptsMessage = 'Реєстрація візових анкет за допомогою скриптів забороняється';

//INTERNAL LOGIC
var attempts = 0;

function reload(time) {
    setTimeout(function() {
        window.location = window.location;
    }, (time || 100));
}

function error(msg) {
    document.body.style['background-color'] = '#f00'
    console.log(msg);
    reload(2000);
}

function onCaptchaLoaded(img) {
    convertImgToBase64(img, function(dataURL) {
        var base64 = dataURL.split(",")[1],
            xhr = new XMLHttpRequest();
        
        xhr.open("POST","https://2captcha.com/in.php",true);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send("method=base64&key=" + captchaKey + "&regsense=1&phrase=0&numeric=3&calc=0&language=2&min_len=4&max_len=4&header_acao=1&body=" + encodeURIComponent(base64));
        xhr.onreadystatechange=function() {
            if (xhr.readyState==4 && xhr.status==200) {
                if (xhr.responseText.indexOf('OK') === 0) {
                    setTimeout(function() {
                        pollCaptcha(xhr.responseText.split('|')[1]);
                    }, 8000);
                } else {
                    error(xhr.responseText);
                }
            }
        }         
    });
}

function pollCaptcha(id) {
    var xhr = new XMLHttpRequest();
        
    xhr.open("GET","https://2captcha.com/res.php?key=" + captchaKey + "&action=get&id=" + id, true);
    xhr.send();
    xhr.onreadystatechange=function() {
        if (xhr.readyState==4 && xhr.status==200) {
            console.log(xhr.responseText);
            if (xhr.responseText.indexOf('OK') === 0) {
                var input = document.querySelector('input[type=text]')
                input.value = xhr.responseText.split('|')[1];
                setTimeout(function() { 
                    document.getElementById('cp_btnDalej').click();
                }, 1000);
            } else if ( xhr.responseText.indexOf('CAPCHA_NOT_READY') === 0 ) {
                attempts++;
                if (attempts > 20) {
                    error("Captcha not ready too long");
                }
                setTimeout(function() { 
                    pollCaptcha(id);
                }, 4000);
            } else {
                error(xhr.responseText);
            }
        }
    }
}

function convertImgToBase64(img, callback, outputFormat){
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        dataURL;
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback.call(this, dataURL);
    canvas = null; 
}

window.playSound = function(){   
    document.body.innerHTML +='<audio autoplay="autoplay"><source src="' + notificationSound + '" type="audio/mpeg" /></audio>';
}

document.addEventListener("DOMContentLoaded", function(event) {
    var cityMatch = location.search.match(/IDPlacowki=(\d+)/);
    var date = dates[cityMatch[1]];
    
    if (!date) { 
        console.log('No recognized city');
        return;
    } 
    
    window.scrollTo(0, 9999);
    var captcha_img = document.getElementById("cp_KomponentObrazkowy_CaptchaImageID");
    var result = document.getElementById('cp_tabListy');
    var lbl = document.getElementById('cp_lblInfo');
    
    if (captcha_img) {
        if (location.hash.indexOf('nocaptcha') == -1) {
            if (captcha_img.complete) {
                onCaptchaLoaded(captcha_img);
            } else {
                captcha_img.onload = function() {
                    onCaptchaLoaded(captcha_img);
                }
            }
        }
        setTimeout(function() {
            //For manual enter
            var input = document.querySelector('input[type=text]')
            input.focus();
        }, 500);
    } else if (result && result.textContent.indexOf(noDateMessage + date)!=-1) {
        reload(2000);
    } else if (lbl && lbl.textContent.indexOf(noScriptsMessage)!=-1) {
        reload(60000);
    } else {      
        playSound();
    }
});