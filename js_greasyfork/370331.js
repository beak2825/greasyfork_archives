// ==UserScript==
// @name         Bitradio confirmer
// @namespace    http://bitrad.io/
// @version      0.07
// @author       lxgn
// @description  BitradIO Comfirmer after recapcha
// @match        https://bitrad.io/radio/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370331/Bitradio%20confirmer.user.js
// @updateURL https://update.greasyfork.org/scripts/370331/Bitradio%20confirmer.meta.js
// ==/UserScript==

//var bit_capcha_timeout=Math.random()*10+10;
//bit_capcha_timeout = Math.ceil(bit_capcha_timeout);
//alert('confirmer '+bit_capcha_timeout);
        //var x2 = document.getElementsByTagName('iframe');
        //var len2 = x2.length;
            //x2[2].postMessage('al_bit: keks','*');


var x = document.getElementById('recaptcha-modal');
//alert(x.innerHTML);
var len = x.lenght;
//alert(len);
var kolvo = 0;
var i = 0;

function getFrameDocument (frame)
{
    return frame && (frame.contentDocument || frame.contentWindow || null);
}

var al_flag = 0;
var al_flag2 = 0;

function check_captcha()
{
    //if(al_flag)return false;
    var captcha_style = document.getElementById("recaptcha-modal").getAttribute("style");
    //alert('style '+captcha_style);
    if (captcha_style)
    {
        al_flag = 1;
    kolvo++;
    var txt = '';
    txt += kolvo;

        //alert('search display block');
        if (captcha_style.includes("display: block"))
        {
        var x2 = document.getElementsByTagName('iframe');
            //alert(x2[1].src);
        var len2 = x2.length;
            //x2[2].postMessage('al_bit: keks','*');
        //alert('s');
            //var fr = x2[2].contentWindow.document;
            //var fr=x2[2].contentDocument;
            //if(0)
        for(var i2=0;i2<len2;i2++)
        {
            val = x2[i2].src;
            val = val.substr(0,44);

            if(val == 'https://www.google.com/recaptcha/api2/anchor')
            {
            //var frameDocument = getFrameDocument(x[i]);
            //var frameDocument = x2[i2].contentWindow.document;
            //alert(len2+' '+i2+' '+x2[i2].src+' '+frameDocument);
            //alert(len2+' '+i2+' '+x2[i2].src);
                //x2[i2].src='about:blank';
                //x2[i2].postMessage('al_bit: keks','https://www.google.com/');
                var ob = x2[i2].contentWindow;
                if(al_flag2==0)
                {
                    //var capcha_click_timeout=Math.random()*12+3;
                    var capcha_click_timeout=Math.random()*300+120;
                    capcha_click_timeout = Math.ceil(capcha_click_timeout);
                    //capcha_click_timeout *= 10;
                //ob.postMessage('al_bit: capcha_click_timeout = 10;','https://www.google.com');
                    ob.postMessage('al_bit: al_start_countdown('+capcha_click_timeout+');','https://www.google.com');
                    //al_flag2=1;
                }
                //alert('postmessage sent');
                //alert(ob.name);
            //alert(len2+' '+i2+' '+val);
            //y = frameDocument.getElementsByClassName('recaptcha-checkbox-checkmark');
            //alert(i+' '+y.className);
            //y.click();
            }
        }


        //    alert('display block found');
        x = document.getElementsByTagName('a');
            //alert(x);
        len = x.length;
            //alert(x.length);
txt+=' '+len;
        for(i=0;i<len;i++)
        {
    var val = x[i].title;
    if(val == 'AntiCaptcha: Captcha solving status')
    {
            var y = x[i].innerHTML;
            if(y=='Solved')
            {
                confirmRecaptchaRadio();
            }
//alert('kuku');
            txt = kolvo+' '+y;
        //document.title = y;
    }
        }
//            log("CAPTCHA!");
//            play_sound(CAPTCHA_SOUND);
        }
        //document.title = txt;
    }
    else
        kolvo = 0;

    al_flag = 0;

}
setInterval(check_captcha,1000);
