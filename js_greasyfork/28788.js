// ==UserScript==
// @name         Solve Media - FreeBTC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  You know
// @author       You
// @match        https://api-secure.solvemedia.com/papi/media?c=*
// @match        https://freebitco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28788/Solve%20Media%20-%20FreeBTC.user.js
// @updateURL https://update.greasyfork.org/scripts/28788/Solve%20Media%20-%20FreeBTC.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jshint -W030 */
key = '6f2b2e83ee317a5d265b4711f3ca1caf';
console.log('Running in: '+location.href);

switch(location.origin){
    case "https://api-secure.solvemedia.com":
        let script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-1.11.3.min.js';
        script.onload = RS;
        document.head.appendChild(script);
        break;
    case "https://freebitco.in":
        window.onmessage = function(e){
            if(e.origin === "https://api-secure.solvemedia.com"){
                var obj = e.data;
                console.log(location.href + ": "+obj);
                switch(true){
                    case /resCode/.test(obj):
                        adcopy_response.value = obj.split(':')[1];
                        typeof login_button !== 'undefined'?(login_button.click()):'';
                        typeof free_play_form_button !== 'undefined'?(free_play_form_button.click()):'';
                        break;
                }
            }
        };
        break;
}

function RS(){
    base = css($('#overlay'))['background-image'].replace(/url\(\"/g,'').replace(/\"\)/,'');
    var dataURL = base;
    var blob = dataURItoBlob(dataURL);
    var fd = new FormData(document.forms[0]);
    fd.append("file", blob,'img.jpg');
    fd.append('apikey','webocr3');
    $.ajax({
        url: 'https://api.ocr.space/parse/image',
        data: fd,
        type: 'POST',
        contentType: false,
        processData: false,
        success: function(res){
            resCode = res.ParsedResults[0].ParsedText.replace('\n','').replace('\r','').replace('Please Enter. ','').trim();
            console.log(resCode);
            window.parent.postMessage('resCode:'+resCode,document.referrer);
        }
    });
}

function SC(base,input,boton){
    $.post("https://2captcha.com/in.php",{"method":"base64","key":key,"body":base,"header_acao":1},function(data){
        if(data.indexOf("OK") != -1){cid = data.split("OK|")[1];WFC(cid,input,boton);}
    });
}
function WFC(caid,input,boton){
    $.get("https://2captcha.com/res.php?key="+key+"&action=get&id="+caid+"&header_acao=1",null,function(data){
        if(data.indexOf("OK") != -1){ckeyr = data.split("OK|")[1];input.value = ckeyr;boton.click();console.log("Toma: "+ckeyr);} else
            if(data == "CAPCHA_NOT_READY"){setTimeout(function(){WFC(caid,input,boton);},1000);} else
                if(data == "ERROR_CAPTCHA_UNSOLVABLE"){console.log("No se pudo Resolver");}
    });
}

function css(a) {
    var sheets = document.styleSheets, o = {};
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (a.is(rules[r].selectorText)) {
                o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
            }
        }
    }
    return o;
}

function css2json(css) {
    var s = {};
    if (!css) return s;
    if (css instanceof CSSStyleDeclaration) {
        for (let i in css) {
            if ((css[i]).toLowerCase) {
                s[(css[i]).toLowerCase()] = (css[css[i]]);
            }
        }
    } else if (typeof css == "string") {
        css = css.split("; ");
        for (let i in css) {
            var l = css[i].split(": ");
            s[l[0].toLowerCase()] = (l[1]);
        }
    }
    return s;
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}