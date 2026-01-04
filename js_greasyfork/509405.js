// ==UserScript==
// @name            Google Translator Tooltip - MOBILE
// @description     Translates text into tooltip for mobile phone and tablet users. Fork from https://greasyfork.org/scripts/16204/
// @namespace       https://github.com/ghoulatsch
// @homepage        https://github.com/ghoulatsch
// @version         240919
// @icon            http://translate.google.com/favicon.ico
// @match           *://*/*
// @grant           GM_getValue
// @grant           GM_xmlhttpRequest
// @grant           GM_log
// @grant           GM_deleteValue
// @grant           GM_addStyle
// @grant           GM_openInTab
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/509405/Google%20Translator%20Tooltip%20-%20MOBILE.user.js
// @updateURL https://update.greasyfork.org/scripts/509405/Google%20Translator%20Tooltip%20-%20MOBILE.meta.js
// ==/UserScript==

/* USER INPUT */

// Icon position and size
var iconOffsetY = 30; // [30]
var iconOffsetX = -15; // [-15]
var iconSize = 20; // [20]
// Translation box offset from left monitor border
// set to 0 to place the translation box at icon position (e.g. for tablets)
var boxOffsetY = 20; // [20]

/* USER INPUT END */

var UA = navigator.userAgent;
var googleDomain = "translate.googleapis.com";
var dictURL= "https://" + googleDomain + "/translate_a/single?client=gtx";
var ttsURL= "http://" + googleDomain + "/translate_tts?client=gtx";

const HREF_NO = 'javascript:void(0)';
initCrossBrowserSupportForGmFunctions();
var languagesGoogle = '<option value="auto">Detect language</option><option value="af">Afrikaans</option><option value="sq">Albanian</option><option value="ar">Arabic</option><option value="hy">Armenian</option><option value="az">Aerbaijani</option><option value="eu">Basque</option><option value="be">Belarusian</option><option value="bn">Bengali</option><option value="bg">Bulgarian</option><option value="ca">Catalan</option><option value="zh-CN">Chinese (simplified)</option><option value="zh-TW">Chinese (traditional)</option><option value="hr">Croatian</option><option value="cs">Czech</option><option value="da">Danish</option><option value="nl">Dutch</option><option value="en">English</option><option value="et">Estonian</option><option value="tl">Filipino</option><option value="fi">Finnish</option><option value="fr">French</option><option value="gl">Galician</option><option value="ka">Georgian</option><option value="de">German</option><option value="el">Greek</option><option value="ht">Haitian Creole</option><option value="iw">Hebrew</option><option value="hi">Hindi</option><option value="hu">Hungarian</option><option value="is">Icelandic</option><option value="id">Indonesian</option><option value="ga">Irish</option><option value="it">Italian</option><option  value="ja">Japanese</option><option value="ko">Korean</option><option value="lv">Latvian</option><option value="lt">Lithuanian</option><option value="mk">Macedonian</option><option value="ms">Malay</option><option value="mt">Maltese</option><option value="no">Norwegian</option><option value="fa">Persian</option><option value="pl">Polish</option><option value="pt">Portuguese</option><option value="ro">Romanian</option><option value="ru">Russian</option><option value="sr">Serbian</option><option value="sk">Slovak</option><option  value="sl">Slovenian</option><option value="es">Spanish</option><option value="sw">Swahili</option><option value="sv">Swedish</option><option value="th">Thai</option><option value="tr">Turkish</option><option value="uk">Ukrainian</option><option value="ur">Urdu</option><option value="vi">Vietnamese</option><option value="cy">Welsh</option><option value="yi">Yiddish</option>';
var body = getTag('body')[0];
var imgLookup;
var txtSel = encodeURIComponent(txtSel); // text selected
var translation2Element = document.createElement('span');
var translation3Element = document.createElement('span');
var currentURL;
var context;
var initialized = false;

images();
css();

// Event listener for double press
document.addEventListener('mouseup', showLookupIcon, false);
// Event listener for long press
let holdTimer;
const HOLD_TIME = 0;
document.addEventListener('contextmenu', function(e) {
    // Start the hold timer
    holdTimer = setTimeout(() => {
        showLookupIcon(e);
    }, HOLD_TIME);
});
document.addEventListener('mousedown', function(e) {
    // Clear the hold timer if touch ends before HOLD_TIME
    clearTimeout(holdTimer);
});
function showLookupIcon(evt) {
    if (evt.ctrlKey && evt.altKey && (!GM_getValue('ctrl') || !GM_getValue('alt')))
        return;
    // XOR http://www.howtocreate.co.uk/xor.html
    if (evt.ctrlKey ? !GM_getValue('ctrl') : GM_getValue('ctrl'))
        return;
    if (evt.altKey ? !GM_getValue('alt') : GM_getValue('alt'))
        return;
    if (!initialized) {
        images();
        css();
        initialized = true;
    }
    var divDic = getId('divDic');
    var divLookup = getId('divLookup');
    txtSel = getSelection();
    // Exit if no text is selected
    if (!txtSel || txtSel == "") {
        if (divDic) {
            if (!clickedInsideID(evt.target, 'divDic'))
                divDic.parentNode.removeChild(divDic);
        }
        if (divLookup)
            divLookup.parentNode.removeChild(divLookup);
        return;
    }
    // Possible cleanup
    if (divDic) {
        if (!clickedInsideID(evt.target, 'divDic'))
            divDic.parentNode.removeChild(divDic);
        return;
    }
    // Remove div if exists
    if (divLookup) {
        divLookup.parentNode.removeChild(divLookup);
    }
    if(context!=null){
        context.close();
        context = null;
    }
    if(GM_getValue('tts', false) == true)context = new AudioContext();
    // Div container
    var top = (evt.clientY + window.pageYOffset + iconOffsetY);
    var left = (evt.clientX + window.pageXOffset + iconOffsetX);
    divLookup = createElement('div', {
            id : 'divLookup',
            style : 'background-color:transparent; color:#000000; position:absolute; top:' + top + 'px; left:' + left + 'px; padding:0px; z-index:10000; border-radius:2px;'
        });
    divLookup.appendChild(imgLookup.cloneNode(false));
    divLookup.addEventListener('mouseover', function(evt){setTimeout(lookup,parseInt(GM_getValue('delay')))}, false);
    body.appendChild(divLookup);
}
// Create the tooltip and launch the Google Translate request to get the translation
function lookup(evt) {
    var divResult = null;
    var divDic = getId('divDic');
    var divLookup = getId('divLookup');
    var top = divLookup.style.top;
    var left = divLookup.style.left;
    if (boxOffsetY != 0){
        left = boxOffsetY+"px";
    }
    // No text selected
    if (!txtSel || txtSel == "") {
        if (divDic = getId('divDic'))
            divDic.parentNode.removeChild(divDic);
        return;
    }
    // Cleanup divs
    if (divDic = getId('divDic')) {
        divDic.parentNode.removeChild(divDic);
    }
    divLookup.parentNode.removeChild(divLookup);
    // Div container
    var backgroundCol = '#EDF4FC';
    divDic = createElement('div', {
            id : 'divDic',
            style : 'opacity: 1; font-family: "Open Sans", Arial, Helvetica, sans-serif !important; font-size: ' + GM_getValue('fontsize', 'small') + '; background-color: ' + GM_getValue('backgroundColor', '#EDF4FC') + '; color: ' + GM_getValue('textcolor', 'Gray') + '; position:absolute; top:' + top + '; left:' + left + '; min-width:250px; min-height:50px; max-width:50%; padding:5px; text-align:left; z-index:10000; border-radius:4px; box-shadow: 0px 0px 4px 2px #898D91'
        });
    divDic.addEventListener('touchstart', dragHandler, false);
    body.appendChild(divDic);
    // Div result
    // This awfull wall of text is the "+" image
    divResult = createElement('div', {
            id : 'divResult',
            style : 'overflow:auto; padding:3px;'
        }, null, '<img src="data:image/gif;base64,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' +
            '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' +
            'SX8jiuicMMBFd2OmKwQFs2tjXpDfnPE1j30V3c7iRHlrzBD2HONzODyZtsQJMI4r0AUNaE3XNHQw95c9GC001MpIxDacFQ+ulTNTZlU3O1eWVHa6vb/pnQUUrgHHSBKIuwG+bCPyEqbAg25gMVV1iOB/IGh5YOKLKIQ6xBAcUHmzjIcIqgajZ+Ro42DcvXl7j0U4WOUd+2IGu7DWjI1pt4DYq8BPm0entuGSQY/4tBi9Ss0HqfwngBQtHbCH88MQXb/zxyFfRRRHMN+/889BHL/301Fdv/fXYZ39CCAAh+QQJCgAAACwAAAAA3AATAAAF/yAgjmRpnmiqrmzrvnAsz3Rt33iu73zv/8CgcEgECAaEpHLJbDqf0Kh0Sq1ar9isdjoQtAQFh2fAKXsKm7R6Q+Y43vABep0mGwwOPH7w2CT+gHZ3d3lyagl+CQNvg4yGh36LcHoGfHR/ZYOElQ9/a4ocmoRygIiRk5p8pYmZjXePaYBujHoOqp5qZHBlHAUFXitddg8PBg8KGsgayxvGkAkFDwgICtPTzX2mftHW3QnOpojG3dbYkNjk1waxsdDS1N7ga9zw1t/aifTk35fu6Qj3numL14fOuHTNECHqU4DDgQEsCCwidiHBAwYQMmpcUOCAhI8gJVzUuLGThAQnP/9abEAyI4MCIVOKZNnyJUqUJxNcGNlywYOQgHZirGkSJ8gHNEky+AkS58qWEJYC/bMzacmbQHkqNdlUJ1KoSz2i9COhmQYCEXtVrCBgwYS3cCf8qTcNQ9u4cFFOq2bPLV65Cf7dxZthbjW+CgbjnWtNgWPFcAsHdoxgWWK/iyV045sAc2S96SDn1exYw17REwpLQEYt2eW/qtPZRQAB7QoC61RW+GsBwYZ/CXb/XRCYLsAKFizEtUAc+G7lcZsjroscOvTmsoUvx15PwccJ0N8yL17N9PG/E7jv9S4hOV7pdIPDdZ+ePDzv2qMXn2b5+wTbKuAWnF3oZbABZY' +
            '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' +
            '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"/><br/>Loading...');
    divDic.appendChild(divResult);
    // Options link
    var optionLink = createElement('a', {
            id : 'optionsLink',
            href : HREF_NO,
            style : 'opacity:0.2; position:absolute; bottom:3px; right:13px; font-size:18px; text-decoration:none!important;background:#528DDF;padding:1px;color:#fff;border-radius:6px 6px 6px 6px;border:2px solid #EEEEEE;font-weight:bold;width:20px;text-align:center;display:block;'
        }, 'click openCloseOptions false', '+');
    divDic.appendChild(optionLink);
    optionLink.addEventListener('mouseover', function (e) {
        e.target.style.opacity = 1.0
    });
    optionLink.addEventListener('mouseout', function (e) {
        e.target.style.opacity = 0.2
    });
    // Send the Google Translate request
    if ((txtSel + " ").search(/^\s*https?:\/\//) > -1) {
        divResult.innerHTML = '<a href="' + txtSel + '" target="_blank" >' + txtSel + '</a>';
    } else if ((txtSel + " ").search(/^\s*\S+(\.\S+)+/) > -1) // site.dom
    {
        divResult.innerHTML = '<a style="color:#888;" href="http://' + txtSel + '" target="_blank" >' + txtSel + '</a>';
    } else {
        var sl, tl;
        sl = GM_getValue('from') ? GM_getValue('from') : "auto";
        tl = GM_getValue('to') ? GM_getValue('to') : "auto";
        Request(txtSel, sl, tl, extractResult);

        if (GM_getValue('to2', 'Disabled') != 'Disabled') {
            sl = GM_getValue('from') ? GM_getValue('from') : "auto";
            tl = GM_getValue('to2') ? GM_getValue('to2') : "auto";
            Request(txtSel, sl, tl, extractResult2);
        } else {
            translation2Element.innerHTML = '';
        }

        if (GM_getValue('to3', 'Disabled') != 'Disabled') {
            sl = GM_getValue('from') ? GM_getValue('from') : "auto";
            tl = GM_getValue('to3') ? GM_getValue('to3') : "auto";
            Request(txtSel, sl, tl, extractResult3);
        } else {
            translation3Element.innerHTML = '';
        }
    }

    // Reposition of translation box height to screen
    // Function to get the height of divDic
    function getDivHeight() {
        const divDic = document.getElementById('divDic');
        const renderedHeight = divDic.offsetHeight; // or use getBoundingClientRect().height
        //console.log('Rendered Height:', renderedHeight);

        // Get viewport height
        const viewportHeight = window.innerHeight;
        var currentScrollPosition = window.pageYOffset;
        var top = parseInt(divDic.style.top);
        // Check if the div would be cut off at the bottom
        if (top + renderedHeight > currentScrollPosition + viewportHeight) {
            top = currentScrollPosition + viewportHeight - renderedHeight - 20;
            if (top < 1){
                top = 20;
            }
            divDic.style.top = top + 'px';
        }
    }
    // Create a MutationObserver to watch for changes in the divDic
    const observer = new MutationObserver(() => {
        getDivHeight(); // Call the function to get height on changes
    });
    // Start observing the divDic for changes in child elements
    observer.observe(divDic, { childList: true, subtree: true });
}

// Lanched when we select an other language in the setup menu
function quickLookup() {
    getId('divDic').style.fontSize = getId('optFontSize').value;
    getId('divDic').style.color = getId('optTextColor').value;
    getId('divResult').innerHTML = 'Loading...';
    if((context == null) && (GM_getValue('tts', false) == true) ) context = new AudioContext();
    var sl,tl;
    sl = getId('optSelLangFrom').value;
    tl = getId('optSelLangTo').value;
    Request(txtSel, sl, tl, extractResult);

    if (getId('optSelLangTo2').value != 'Disabled') {
        var sl,tl;
        sl = getId('optSelLangFrom').value;
        tl = getId('optSelLangTo2').value;
        Request(txtSel, sl, tl, extractResult2);
    } else {
        translation2Element.innerHTML = '';
    }

    if (getId('optSelLangTo3').value != 'Disabled') {
        var sl,tl;
        sl = getId('optSelLangFrom').value;
        tl = getId('optSelLangTo3').value;
        Request(txtSel, sl, tl, extractResult3);
    } else {
        translation3Element.innerHTML = '';
    }
}

function init_google_value_tk() {
    var url = "https://" + googleDomain + "/translate_a/element.js";
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onreadystatechange: function(resp) {
            if (resp.readyState == 4) {
                clearTimeout(setTimeout( function(){ this.abort(); }, 2000));
                if (resp.status == 200) {
                    init_google_value_tk_parse(resp.responseText);
                }
            }
        }
    });
}

function init_google_value_tk_parse(responseText) {
    var res = /c\._ctkk='(.+?)'/i.exec(responseText);
    if (res != null) {
        GM_setValue('google_value_tk', res[1]);
    };
}

// return token for the new API
function googleTK(text) {
    // view-source:https://translate.google.com/translate/releases/twsfe_w_20160620_RC00/r/js/desktop_module_main.js && TKK from HTML
    var uM = GM_getValue('google_value_tk');
    if (uM == 'undefined' || uM == null) {
        init_google_value_tk();
        uM = "427110.1469889687";
    } else if (Number(uM.split('.')[0]) !== Math.floor(Date.now() / 3600000)) {
        init_google_value_tk();
    };
    var cb="&";
    var k="";
    var Gf="=";
    var Vb="+-a^+6";
    var t="a";
    var Yb="+";
    var Zb="+-3^+b+-f";
    var jd=".";
    var sM=function(a){return function(){return a}}
    var tM=function(a,b){for(var c=0;c<b.length-2;c+=3){var d=b.charAt(c+2),d=d>=t?d.charCodeAt(0)-87:Number(d),d=b.charAt(c+1)==Yb?a>>>d:a<<d;a=b.charAt(c)==Yb?a+d&4294967295:a^d}return a};
    var vM=function(a){
        var b;
        if(null!==uM) {
            b=uM;
        }else{
            b=sM(String.fromCharCode(84));var c=sM(String.fromCharCode(75));b=[b(),b()];
            b[1]=c();
            b=(uM=window[b.join(c())]||k)||k
        }
        var d=sM(String.fromCharCode(116)),c=sM(String.fromCharCode(107)),d=[d(),d()];
        d[1]=c();
        c=cb+d.join(k)+Gf;
        d=b.split(jd);
        b=Number(d[0])||0;

        for(var e=[],f=0,g=0;g<a.length;g++){
            var m=a.charCodeAt(g);
            128>m?e[f++]=m:(2048>m?e[f++]=m>>6|192:(55296==(m&64512)&&g+1<a.length&&56320==(a.charCodeAt(g+1)&64512)?(m=65536+((m&1023)<<10)+(a.charCodeAt(++g)&1023),e[f++]=m>>18|240,e[f++]=m>>12&63|128):e[f++]=m>>12|224,e[f++]=m>>6&63|128),e[f++]=m&63|128)
        }
        a=b||0;
        for(f=0;f<e.length;f++) { a+=e[f],a=tM(a,Vb)};
        a=tM(a,Zb);
        a^=Number(d[1])||0;
        0>a&&(a=(a&2147483647)+2147483648);
        a%=1E6;
        return a.toString()+jd+(a^b);
    };
    return vM(text);
}

// Google Translate Request
function Request(txt, sl, tl, parse) {
    var tk=googleTK(txt);
    var Url = dictURL +
        "&hl=auto" +
        "&sl=" + sl + "&tl=" + tl +
        "&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&otf=2&trs=1&inputm=1&ssel=0&tsel=0&source=btn&kc=3"+
        "&tk=" + tk +
        "&q="+ encodeURI(txt);
    var method='POST';
    var Data='';
    var Hdr= {
        "User-Agent": UA,
        "Accept":  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Encoding":  "gzip, deflate"
    }
    var Q=Url.split('&q=');
    Url=Q[0];
    Data='&q='+Q[1];
    Hdr["Content-Length"]=Data.length+'';
    Hdr["Content-Type"]="application/x-www-form-urlencoded; charset=UTF-8";
    GM_xmlhttpRequest({
        method: method,
        url: Url,
        data: Data,
        headers: Hdr,
        onload: function(resp) {
            try{
                parse(resp.responseText)
            }catch(e){
                GM_log(e);
          }
        }
    });
}

function extractResult(gTradStringArray) {
    var arr = eval(gTradStringArray); // eval is used to transform the string to an array. I alse made a custom parsing function, but it doesn't handle antislashed characters, so I prefer using eval()
    /*
    Content of the gTrad array :
    0 / 0:Translation 1:Source text
    1 / i:Grammar / 0:Types (word, verb, ...) 1: Other translations
    5 / Array of other translations
     */
    var translation = '';
    // 0 - Full translation
    translation += '<small><a style="color:#1a0dab;" target="_blank" href="https://' + googleDomain + '/#' + GM_getValue('from', 'auto') + '/' + GM_getValue('to', 'auto') + '/' + txtSel + '">[' + arr[2] + '] ';
    for (var i = 0; i < arr[0].length; i++) { if (typeof arr[0][i][1] != 'undefined' && arr[0][i][1] != null) translation += arr[0][i][1]; }
    translation += '</a> <span id="texttospeechbuttonfrom"></span></small><br/>';
    translation += '[' + GM_getValue('to', 'auto') + '] ';
    for (var i = 0; i < arr[0].length; i++) { if (typeof arr[0][i][0] != 'undefined' && arr[0][i][0] != null) translation += arr[0][i][0]; }
    translation += ' <span id="texttospeechbuttonto"></span><br/>';
    translation += '<span id="translation2Element"></span>';
    translation += '<span id="translation3Element"></span>';
    translation += '<a id="toggleShowDetails" style="color:#000;' + (!GM_getValue('details', 'false') ? 'display:none;"' : '"') + '>Show details</a>';
    translation += '<span id="divDetails" ' + (GM_getValue('details', 'false') ? 'style="display:none;"' : '') + '><a style="color:#000;" id="toggleHideDetails">Hide details</a><br/>';

    // 1 - Grammar
    if (typeof arr[1] != 'undefined' && arr[1] != null ||
        typeof arr[5] != 'undefined' && arr[5] != null ||
        typeof arr[14] != 'undefined' && arr[14] != null) {
        //translation += '<strong>Translations</strong><br/>';
    }

    if (typeof arr[1] != 'undefined' && arr[1] != null) {
        for (var i = 0; i < arr[1].length; i++) {
            translation += arr[1][i][0] + ': ';
            translation += arr[1][i][1].join(', ');
            translation += '<br/>';
        }
    }

    // 5 - Alternatives
    if (GM_getValue('alternatives', 'true')) {
        if (typeof arr[5] != 'undefined' && arr[5] != null) {
            for (var i = 0; i < arr[5].length; i++) {
                if (typeof arr[5][i][2] != 'undefined' && arr[5][i][2] != null) { // 5/i/2 array of alternatives, 5/i/0 the part of the text we are studying
                    translation += '<i>alternatives: </i>';
                    for (var j = 0; j < arr[5][i][2].length; j++) {
                        translation += '<i>' + ((j == 0) ? '' : ', ') + arr[5][i][2][j][0] + '</i>';
                    }
                    translation += '<br/>';
                }
            }
        }
    }

    // 14 - See also
    if (typeof arr[14] != 'undefined' && arr[14] != null) {
        // for (var i = 0; i < arr[14].length; i++) {
            translation += '<i>See also: </i>';
            translation += '<i>' + arr[14][0].join(', ') + '</i>';
            translation += '<br/>';
        // }
    }

    // if ((typeof arr[1] != 'undefined' && arr[1] != null ||
    //      typeof arr[5] != 'undefined' && arr[5] != null ||
    //      typeof arr[14] != 'undefined' && arr[14] != null) &&
    //     (typeof arr[12] != 'undefined' && arr[12] != null)) {
    //     translation += '<br/>';
    // }

    // 12 and 11 - Definitions and Synonyms
    if (typeof arr[12] != 'undefined' && arr[12] != null && GM_getValue('definitions', 'false')) {
        translation += '<strong>Definitions</strong><br/>';
        for (var i = 0; i < arr[12].length; i++) {
            if (typeof arr[12][i][1] != 'undefined' && arr[12][i][1] != null) { // 11/i/1 array of alternatives, 11/i/0 the part of the text we are studying
                for (var j = 0; j < arr[12][i][1].length; j++) {
                    translation += '' + arr[12][i][0] + ': ';
                    translation += arr[12][i][1][j][0];
                    translation += '<br/>';
                    if (GM_getValue('synonyms', 'true')) {
                        if (typeof arr[11] != 'undefined' && arr[11] != null) {
                            if (typeof arr[11][i] != 'undefined' && [11][i] != null) {
                                for (var k = 0; k < arr[11][i][1].length; k++) {
                                    if (arr[12][i][1][j][1] == arr[11][i][1][k][1]) {
                                        translation += '<i>synonyms:</i> ';
                                        translation += '<i>' + arr[11][i][1][k][0].join(', ') + '</i>';
                                        translation += '<br/>';
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    translation += '</span>'; // Detail end

    getId('divResult').innerHTML = '<p style="margin:0px;padding:0px;line-height:150%;text-align:left;">' + translation + '</p>';
    getId('translation2Element').appendChild(translation2Element); // Optional second translation
    getId('translation3Element').appendChild(translation3Element); // Optional third translation
    getId('toggleShowDetails').addEventListener('click', function () {
        getId('toggleShowDetails').style.display = 'none';
        getId('divDetails').style.display = 'block';
    }, false);
    getId('toggleHideDetails').addEventListener('click', function () {
        getId('toggleShowDetails').style.display = 'inline';
        getId('divDetails').style.display = 'none';
    }, false);
    // Create the Text to speech
    var fromText = '';
    var toText = '';
    for (var i = 0; i < arr[0].length; i++) { if (typeof arr[0][i][1] != 'undefined' && arr[0][i][1] != null) fromText += arr[0][i][1]; }
    for (var i = 0; i < arr[0].length; i++) { if (typeof arr[0][i][0] != 'undefined' && arr[0][i][0] != null) toText += arr[0][i][0]; }
    addTextTospeechLink(getId('texttospeechbuttonfrom'), arr[2], fromText); // arr[2] contains the detected input language
    addTextTospeechLink(getId('texttospeechbuttonto'), GM_getValue('to', 'auto') == 'auto' ? 'en' : GM_getValue('to', 'auto'), toText); // I cannot find a way to get the detected destination language, so if the requested destination is 'auto', I use the english Text to speech language
}
function extractResult2(gTradStringArray) {
    var arr = eval(gTradStringArray);
    var translation = '';
    translation += '#[' + GM_getValue('to2', 'auto') + ']  ';
    for (var i = 0; i < arr[0].length; i++) { if (typeof arr[0][i][0] != 'undefined' && arr[0][i][0] != null) translation += arr[0][i][0]; }
    translation += '  <span id="texttospeechbuttonto2"></span><br/>';
    translation2Element.innerHTML = translation;
    var toText2 = '';
    for (var i = 0; i < arr[0].length; i++) { if (typeof arr[0][i][0] != 'undefined' && arr[0][i][0] != null) toText2 += arr[0][i][0]; }
    addTextTospeechLink(getId('texttospeechbuttonto2'), GM_getValue('to2', 'auto') == 'auto' ? 'en' : GM_getValue('to2', 'auto'), toText2);
}
function extractResult3(gTradStringArray) {
    var arr = eval(gTradStringArray);
    var translation = '';
    translation += '#[' + GM_getValue('to3', 'auto') + ']  ';
    for (var i = 0; i < arr[0].length; i++) { if (typeof arr[0][i][0] != 'undefined' && arr[0][i][0] != null) translation += arr[0][i][0]; }
    translation += '  <span id="texttospeechbuttonto3"></span><br/>';
    translation3Element.innerHTML = translation;
    var toText3 = '';
    for (var i = 0; i < arr[0].length; i++) { if (typeof arr[0][i][0] != 'undefined' && arr[0][i][0] != null) toText3 += arr[0][i][0]; }
    addTextTospeechLink(getId('texttospeechbuttonto3'), GM_getValue('to3', 'auto') == 'auto' ? 'en' : GM_getValue('to3', 'auto'), toText3);
}
function addTextTospeechLink(element, lang, text) {
    if (GM_getValue('tts', false) == false) return;

    var img = document.createElement('img');
    img.setAttribute('src', "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QEQDhUFQkzk7wAAAIpJREFUOMtj/P//PwNFgAQD3jMwMDRg6MVjwHw0/n4GBob/DAwM5xkYGAQIGTAfqhgdFEDF1+MzAKYZl9P6oXIO2AxA1owsAXc2lH7PwMCwHtmA/zgwPLygYYBi0f///xmYSIgwByT2QxiDiYFCQIoBB5DY8rgSEtmBSLVopEpCokpSJjozMVKanQFy4nkNOfntnwAAAABJRU5ErkJggg==");
    img.setAttribute('width', '16');
    img.setAttribute('height', '16');
    img.setAttribute('align', "top");
    element.appendChild(img);

    // var context = new AudioContext();
    element.addEventListener('click', function() { playTTS(lang, text, context) }, false);
}

function playTTS(lang, text, context) {
    text = text.replace(/[«»'"]/g, ' ');
    tk = googleTK(text);
    Url = ttsURL + "&ie=UTF-8&total=1&idx=0" +
        "&tl=" + lang +
        "&q=" + text +
        "&textlen=" + text.length +
        "&tk=" + tk;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    //var context = new AudioContext();
    var source = context.createBufferSource();

    var soundRequest = GM_xmlhttpRequest({
        method: "GET",
        url: Url,
        responseType: 'arraybuffer',
        onload: function(response) {
            try {
                    context.decodeAudioData(response.response, function(buffer) {
                        source.buffer = buffer;
                        source.connect(context.destination);
                        source.start(0);
                    });
            } catch(e) {
                GM_log(e);
            }
        }
    });
}

function getSelection() {
    var text = null;
    //get selected text
    if (window.getSelection && !window.opera) // window.getSelection() bugs with Opera 12.16 and ViolentMonkey
    {
        if (document.activeElement &&
                (document.activeElement.tagName.toLowerCase() == "textarea" ||
                document.activeElement.tagName.toLowerCase() == "input")) {
            text = document.activeElement.value;
            text = text.substring (document.activeElement.selectionStart, document.activeElement.selectionEnd);
        } else {
            text = window.getSelection().toString();
        }
    } else if (document.getSelection) {
        text = document.getSelection().toString();
    } else if (document.selection) {
        text = document.selection.createRange().text;
    }
    // text = text.replace(/[«»'"]/g, ' ');
    text = text.replace(/&/g,'\u00E6').replace(/</g,'\u227A').replace(/\+/g,'\u2795');
    return text;
}
function openCloseOptions(evt) {
    var divOptions = getId('divOpt');
    if (!divOptions) //Show options
    {
        divOptions = createElement('div', {
                id : 'divOpt',
                style : 'border-top:2px solid #5A91D8;position:relative; padding:5px;'
            });
        getId('divDic').appendChild(divOptions);
        getId('optionsLink').style.visibility = 'hidden';

        //fields container
        divOptionsFields = createElement('p', {style: "margin:0px;padding:0px;line-height:160%;"});
        divOptions.appendChild(divOptionsFields);
        //from
        divOptionsFields.appendChild(createElement('span', null, null, 'From: '));
        divOptionsFields.appendChild(createElement('select', {
                id : 'optSelLangFrom'
            }, null, languagesGoogle));
        getId('optSelLangFrom').value = GM_getValue('from') ? GM_getValue('from') : 'auto';
        getId('optSelLangFrom').addEventListener('change', quickLookup, false);
        //to
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('span', null, null, 'To: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'));
        divOptionsFields.appendChild(createElement('select', {
                id : 'optSelLangTo'
            }, null, languagesGoogle));
        getId('optSelLangTo').value = GM_getValue('to') ? GM_getValue('to') : 'auto';
        getId('optSelLangTo').addEventListener('change', quickLookup, false);
        //to2
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('span', null, null, 'To 2: &nbsp;&nbsp;'));
        divOptionsFields.appendChild(createElement('select', {
                id : 'optSelLangTo2'
            }, null, '<option value="Disabled">Disabled</option>' + languagesGoogle));
        getId('optSelLangTo2').value = GM_getValue('to2') ? GM_getValue('to2') : 'Disabled';
        getId('optSelLangTo2').addEventListener('change', quickLookup, false);
        //to3
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('span', null, null, 'To 3: &nbsp;&nbsp;'));
        divOptionsFields.appendChild(createElement('select', {
                id : 'optSelLangTo3'
            }, null, '<option value="Disabled">Disabled</option>' + languagesGoogle));
        getId('optSelLangTo3').value = GM_getValue('to3') ? GM_getValue('to3') : 'Disabled';
        getId('optSelLangTo3').addEventListener('change', quickLookup, false);
        //use text to speech
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('input', {
            id : 'checkTTS',
            type : 'checkbox',
            style: "margin-left:0px;"
        }));
        divOptionsFields.appendChild(createElement('span', null, null, '<span title="The feature has many issues. You often have to refresh the page to launch the .mp3 file. If you use the langage auto-detection, you have to change the langage in the url of the new tab."> Display Text To Speech</span>'));
        getId('checkTTS').checked = GM_getValue('tts');
        //hide details
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('input', {
            id : 'checkDetails',
            type : 'checkbox',
            style: "margin-left:0px;"
        }));
        divOptionsFields.appendChild(createElement('span', null, null, ' Hide details by default'));
        getId('checkDetails').checked = GM_getValue('details');
        //show definitions in details
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('input', {
            id : 'checkDefinitions',
            type : 'checkbox',
            style: "margin-left:0px;"
        }));
        divOptionsFields.appendChild(createElement('span', null, null, ' Show definitions in details'));
        getId('checkDefinitions').checked = GM_getValue('definitions');
        //show alternatives in details
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('input', {
            id: 'checkAlternatives',
            type: 'checkbox',
            style: "margin-left:0px;"
        }));
        divOptionsFields.appendChild(createElement('span', null, null, ' Show alternatives in details'));
        getId('checkAlternatives').checked = GM_getValue('alternatives');

        //show synonyms in definitions
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('input', {
            id: 'checkSynonyms',
            type: 'checkbox',
            style: "margin-left:0px;"
        }));
        divOptionsFields.appendChild(createElement('span', null, null, ' Show synonyms in definitions'));
        getId('checkSynonyms').checked = GM_getValue('synonyms');

        //font size
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('span', null, null, 'Font size: &nbsp;&nbsp;'));
        divOptionsFields.appendChild(createElement('select', {
                id : 'optFontSize',
                style: 'width:141px'
            }, null, '<option value="x-small">Extra small</option><option value="small">Small (default)</option><option value="medium">Medium</option><option value="large">Large</option>'));
        getId('optFontSize').value = GM_getValue('fontsize') ? GM_getValue('fontsize') : 'small';
        getId('optFontSize').addEventListener('change', quickLookup, false);
        //text color
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('span', null, null, 'Text color: '));
        divOptionsFields.appendChild(createElement('select', {
                id : 'optTextColor',
                style: 'width:141px'
            }, null, '<option value="Gray">Gray (default)</option><option value="Black">Black</option><option value="White">White</option><option value="CadetBlue">CadetBlue</option><option value="ForestGreen">ForestGreen</option><option value="FireBrick">FireBrick</option>'));
        getId('optTextColor').value = GM_getValue('textcolor') ? GM_getValue('textcolor') : 'Gray';
        getId('optTextColor').addEventListener('change', quickLookup, false);
        //use ctrl
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('input', {
            id : 'checkCtrl',
            type : 'checkbox',
            style: "margin-left:0px;"
        }));
        divOptionsFields.appendChild(createElement('span', null, null, ' Use Ctrl key'));
        getId('checkCtrl').checked = GM_getValue('ctrl');
        //use alt
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('input', {
            id : 'checkAlt',
            type : 'checkbox',
            style: "margin-left:0px;"
        }));
        divOptionsFields.appendChild(createElement('span', null, null, ' Use Alt key'));
        getId('checkAlt').checked = GM_getValue('alt');
        //delay display
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('span', null, null, 'Delay '));
        divOptionsFields.appendChild(createElement('input', {
            id: 'delayDisplay',
            type: 'text',
            style: "height:20px;width:50px;padding:0px;text-align:center;",
        }));
        divOptionsFields.appendChild(createElement('span', null, null, ' ms'));
        getId('delayDisplay').value = GM_getValue('delay') ? GM_getValue('delay') : '0';
        //save
        divOptionsFields.appendChild(createElement('br'));
        divOptionsFields.appendChild(createElement('a', {
                href : HREF_NO,
                class : "gootranslink"
            }, 'click saveOptions false', 'Save'));
        //reset
        divOptionsFields.appendChild(createElement('span', null, null, ' - '));
        divOptionsFields.appendChild(createElement('a', {
                href : HREF_NO,
                class : "gootranslink"
            }, 'click resetOptions false', 'Reset'));
        //cancel
        divOptionsFields.appendChild(createElement('span', null, null, ' - '));
        divOptionsFields.appendChild(createElement('a', {
                href : HREF_NO,
                class : "gootranslink"
            }, 'click openCloseOptions false', 'Cancel'));
    } else // Hide options
    {
        divOptions.parentNode.removeChild(divOptions);
        getId('optionsLink').style.visibility = 'visible';
    }
}

function saveOptions(evt) {

    var backgroundColor = getId('divDic').style.backgroundColor;
    var from = getId('optSelLangFrom').value;
    var to = getId('optSelLangTo').value;
    var to2 = getId('optSelLangTo2').value;
    var to3 = getId('optSelLangTo3').value;
    var tts = getId('checkTTS').checked;
    var details = getId('checkDetails').checked;
    var definitions = getId('checkDefinitions').checked;
    var alternatives = getId('checkAlternatives').checked;
    var synonyms = getId('checkSynonyms').checked;
    var fontsize = getId('optFontSize').value;
    var textcolor = getId('optTextColor').value;
    var ctrl = getId('checkCtrl').checked;
    var alt = getId('checkAlt').checked;
    var delay = getId('delayDisplay').value;

    GM_setValue('backgroundColor', backgroundColor);
    GM_setValue('from', from);
    GM_setValue('to', to);
    GM_setValue('to2', to2);
    GM_setValue('to3', to3);
    GM_setValue('tts', tts);
    GM_setValue('details', details);
    GM_setValue('definitions', definitions);
    GM_setValue('alternatives', alternatives);
    GM_setValue('synonyms', synonyms);
    GM_setValue('fontsize', fontsize);
    GM_setValue('textcolor', textcolor);
    GM_setValue('ctrl', ctrl);
    GM_setValue('alt', alt);
    GM_setValue('delay', delay);

    quickLookup();
    getId('divDic').removeChild(getId('divOpt'));
    getId('optionsLink').style.visibility = 'visible';
}

function resetOptions(evt) {

    GM_deleteValue('backgroundColor');
    GM_deleteValue('from');
    GM_deleteValue('to');
    GM_deleteValue('to2');
    GM_deleteValue('to3');
    GM_deleteValue('tts');
    GM_deleteValue('details');
    GM_deleteValue('definitions');
    GM_deleteValue('alternatives');
    GM_deleteValue('synonyms');
    GM_deleteValue('fontsize');
    GM_deleteValue('textcolor');
    GM_deleteValue('ctrl');
    GM_deleteValue('alt');
    GM_deleteValue('delay');

    getId('divDic').parentNode.removeChild(getId('divDic'));
}

function css() {
    var style = createElement('style', {
            type : "text/css"
        }, null, "" +
            'a.gootranslink:link {color: #0000FF !important; text-decoration: underline !important;}' +
            'a.gootranslink:visited {color: #0000FF !important; text-decoration: underline !important;}' +
            'a.gootranslink:hover {color: #0000FF !important; text-decoration: underline !important;}' +
            'a.gootranslink:active {color: #0000FF !important; text-decoration: underline !important;}' +
            '.picker-wrapper,.slide-wrapper{position:relative;float:left}.picker-indicator,.slide-indicator{position:absolute;left:0;top:0;pointer-events:none}.picker,.slide{cursor:crosshair;float:left}.cp-default{background-color:gray;padding:12px;box-shadow:0 0 40px #000;border-radius:15px;float:left}.cp-default .picker{width:200px;height:200px}.cp-default .slide{width:30px;height:200px}.cp-default .slide-wrapper{margin-left:10px}.cp-default .picker-indicator{width:5px;height:5px;border:2px solid darkblue;-moz-border-radius:4px;-o-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;opacity:.5;-ms-filter:"alpha(opacity=50)";filter:alpha(opacity=50);filter:alpha(opacity=50);background-color:white}.cp-default .slide-indicator{width:100%;height:10px;left:-4px;opacity:.6;-ms-filter:"alpha(opacity=60)";filter:alpha(opacity=60);filter:alpha(opacity=60);border:4px solid lightblue;-moz-border-radius:4px;-o-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;background-color:white}.cp-small{padding:5px;background-color:white;float:left;border-radius:5px}.cp-small .picker{width:100px;height:100px}.cp-small .slide{width:15px;height:100px}.cp-small .slide-wrapper{margin-left:5px}.cp-small .picker-indicator{width:1px;height:1px;border:1px solid black;background-color:white}.cp-small .slide-indicator{width:100%;height:2px;left:0;background-color:black}.cp-fancy{padding:10px;background:-webkit-linear-gradient(top,#aaa 0,#222 100%);float:left;border:1px solid #999;box-shadow:inset 0 0 10px white}.cp-fancy .picker{width:200px;height:200px}.cp-fancy .slide{width:30px;height:200px}.cp-fancy .slide-wrapper{margin-left:10px}.cp-fancy .picker-indicator{width:24px;height:24px;background-image:url(http://cdn1.iconfinder.com/data/icons/fugue/bonus/icons-24/target.png)}.cp-fancy .slide-indicator{width:30px;height:31px;left:30px;background-image:url(http://cdn1.iconfinder.com/data/icons/bluecoral/Left.png)}.cp-normal{padding:10px;background-color:white;float:left;border:4px solid #d6d6d6;box-shadow:inset 0 0 10px white}.cp-normal .picker{width:200px;height:200px}.cp-normal .slide{width:30px;height:200px}.cp-normal .slide-wrapper{margin-left:10px}.cp-normal .picker-indicator{width:5px;height:5px;border:1px solid gray;opacity:.5;-ms-filter:"alpha(opacity=50)";filter:alpha(opacity=50);filter:alpha(opacity=50);background-color:white;pointer-events:none}.cp-normal .slide-indicator{width:100%;height:10px;left:-4px;opacity:.6;-ms-filter:"alpha(opacity=60)";filter:alpha(opacity=60);filter:alpha(opacity=60);border:4px solid gray;background-color:white;pointer-events:none}');
    getTag('head')[0].appendChild(style);
}
/*
 * Short functions to replace the document.createElement document.getElementById and document.getElementsByTagName
 */
function createElement(type, attrArray, evtListener, html) {
    var node = document.createElement(type);
    for (var attr in attrArray)
        if (attrArray.hasOwnProperty(attr)) {
            node.setAttribute(attr, attrArray[attr]);
        }
    if (evtListener) {
        var a = evtListener.split(' ');
        node.addEventListener(a[0], eval(a[1]), eval(a[2]));
    }
    if (html)
        node.innerHTML = html;
    return node;
}
function getId(id, parent) {
    if (!parent)
        return document.getElementById(id);
    return parent.getElementById(id);
}
function getTag(name, parent) {
    if (!parent)
        return document.getElementsByTagName(name);
    return parent.getElementsByTagName(name);
}
/*
 * Drag and drop support adapted from http://www.hunlock.com/blogs/Javascript_Drag_and_Drop
 */
var savedTarget = null; // The target layer (effectively vidPane)
var dragOK = false; // True if we're allowed to move the element under mouse
var dragXoffset = 0; // How much we've moved the element on the horozontal
var dragYoffset = 0; // How much we've moved the element on the verticle
var didDrag = false; // Set to true when we do a drag
function moveHandler(e) {
    if (e == null || e.touches == null)
        return;
    if (dragOK) {
        savedTarget.style.left = e.touches[0].clientX - dragXoffset + 'px';
        savedTarget.style.top = e.touches[0].clientY - dragYoffset + 'px';
        return false;
    }
}
function dragCleanup(e) {
    document.removeEventListener('touchmove', moveHandler, false);
    document.removeEventListener('touchend', dragCleanup, false);
    dragOK = false; // Its been dragged now
    didDrag = true;
}
function dragHandler(e) {
    if (e == null || e.touches == null)
        return;
    var target = e.touches[0].target;
    if (target.nodeName != 'DIV' && target.nodeName != 'P')
        return;
    if (target = clickedInsideID(target, 'divDic')) {
        savedTarget = target;
        dragOK = true;
        dragXoffset = e.touches[0].clientX - target.offsetLeft;
        dragYoffset = e.touches[0].clientY - target.offsetTop;
        target.style.left = e.touches[0].clientX - dragXoffset + 'px';
        target.style.right = null;
        document.addEventListener('touchmove', moveHandler, false);
        document.addEventListener('touchend', dragCleanup, false);
        return false;
    }
}
function clickedInsideID(target, id) {
    if (target.getAttribute('id') == id)
        return getId(id);
    if (target.parentNode) {
        while (target = target.parentNode) {
            try {
                if (target.getAttribute('id') == id)
                    return getId(id);
            } catch (e) {}
        }
    }
    return null;
}
// End drag code
/*
 * Images
 */
function images() {
    imgLookup = createElement('img', {
            border : 0
        });
    imgLookup.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABs0lEQVQ4jY2SP4viQBiHX0UQWz/AXb+VX8Iu/YqFhdhcd5BKEOTKC9jJFYrFgo3FIjYiCRauhTCQDMp4bJFklzCuLJLOWNj8rpDMJt7u7Q08xQzze953/hAR0el4QJLw8KR4fXkE/Wtch01zjP6gmxLsd9uPJafjAf1BF82WjmZLR61eRa1eVfNmS4cMxP8JksGk6FPB6XjAii1Qq1fBBYMMBL79+InvDIrbB0CzIpSmQHF0RnF0vkiTFxZX7A+6MOzwU0FxdEZKYJpj1fp1eO5KzF0JzYreF/iekzr77QMUhh2q1zDsUIULPQl6fXkEFww53cWKLWCaY3DBVMuaFWHuSsT7fM/5W5DTXYUMBGQgUJoCpelFst9tcc84DDuE7znQrAiFnrwIkuGY/W6rBIYdQgYC7RmHZkXwPQf3jL8JiCglISLKVCaqzfhZfc9RcMFwc/eMfGd9EWQbS+R0F9nGEtnGEpnKBJnKJFWxPNygPNygPePggqE942nBdTjG9xyUhxvVcqEnsWILrNjiTfCRJN9ZI99Zp8LxWsy73ztTmYCI6ObuGV/7Tym+/PqtICL6A7F/dNYyWabFAAAAAElFTkSuQmCC';
    imgLookup.style.width = iconSize+"px";
    imgLookup.style.height = iconSize+"px";
}
if (typeof GM_deleteValue == 'undefined') {
    GM_addStyle = function (css) {
        var style = document.createElement('style');
        style.textContent = css;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    GM_deleteValue = function (name) {
        localStorage.removeItem(name);
    }
    GM_getValue = function (name, defaultValue) {
        var value = localStorage.getItem(name);
        if (!value)
            return defaultValue;
        var type = value[0];
        value = value.substring(1);
        switch (type) {
        case 'b':
            return value == 'true';
        case 'n':
            return Number(value);
        default:
            return value;
        }
    }
    GM_log = function (message) {
        console.log(message);
    }
    GM_openInTab = function (url) {
        return window.open(url, "_blank");
    }
    GM_registerMenuCommand = function (name, funk) {
        //todo
    }
    GM_setValue = function (name, value) {
        value = (typeof value)[0] + value;
        localStorage.setItem(name, value);
    }
}
/*
 * Cross browser support for GM functions
 * http://userscripts.org/topics/41177
 */
function initCrossBrowserSupportForGmFunctions() {
    if (typeof GM_deleteValue == 'undefined') {
        GM_addStyle = function (css) {
            var style = document.createElement('style');
            style.textContent = css;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        GM_deleteValue = function (name) {
            localStorage.removeItem(name);
        }
        GM_getValue = function (name, defaultValue) {
            var value = localStorage.getItem(name);
            if (!value)
                return defaultValue;
            var type = value[0];
            value = value.substring(1);
            switch (type) {
            case 'b':
                return value == 'true';
            case 'n':
                return Number(value);
            default:
                return value;
            }
        }
        GM_log = function (message) {
            console.log(message);
        }
        GM_openInTab = function (url) {
            return window.open(url, "_blank");
        }
        GM_registerMenuCommand = function (name, funk) {
            //todo
        }
        GM_setValue = function (name, value) {
            value = (typeof value)[0] + value;
            localStorage.setItem(name, value);
        }
    }
}
