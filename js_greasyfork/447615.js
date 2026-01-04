// ==UserScript==
// @name         tweetranslator
// @description  translate tweets by google....
// @match        https://twitter.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @version 0.0.1.20220708210916
// @namespace https://greasyfork.org/users/395405
// @downloadURL https://update.greasyfork.org/scripts/447615/tweetranslator.user.js
// @updateURL https://update.greasyfork.org/scripts/447615/tweetranslator.meta.js
// ==/UserScript==

const transdict={'goog_transl':goog_transl,'show_original':e=>(e.className+="js_translate")};
const enable_ignore_mandarin=GM_getValue('enable_ignore_mandarin',true);

(function() {
    'use strict';
    setInterval(_=>{
        let temp=makeArray(document.querySelectorAll('.tweet-text,div[lang]')).filter(x=>x.className.indexOf('js_translate')==-1);
        for(let i=0;i<temp.length;i++)transdict['goog_transl'](temp[i])
    },1000);
    let select=document.createElement("select");
    select.id='js_translate';
    select.onchange=_=>{goog_transl=select.value;GM_setValue('translate_choice','goog_transl');history.go(0)};
    document.body.appendChild(select);
    document.querySelector('#js_translate option[value='+'goog_transl'+']').selected=true;
})();


function makeArray(arr){
    if(arr.item){
        var len = arr.length;
        var array = [];
        while(len--){
            array[len] = arr[len];
        }
        return array;
    }
    return Array.prototype.slice.call(arr);
}


function tk(a){
    var b='428913.2184257098';
    var d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var k = a.charCodeAt(g);
        128 > k ? e[f++] = k : (2048 > k ? e[f++] = k >> 6 | 192 : (55296 == (k & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (k = 65536 + ((k & 1023) << 10) + (a.charCodeAt(++g) & 1023),
        e[f++] = k >> 18 | 240,
        e[f++] = k >> 12 & 63 | 128) : e[f++] = k >> 12 | 224,
        e[f++] = k >> 6 & 63 | 128),
        e[f++] = k & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)a = Fo(a+e[f], "+-a^+6");
    a = Fo(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return a.toString() + "." + (a ^ b)
}


function Fo(a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2);
        d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d);
        d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
}


function goog_transl(e,error){
    e.className+="js_translate";
    GM_xmlhttpRequest({
        method:"GET",
        url:'https://translate.google.cn/translate_a/single?client=webapp&sl=auto&tl=zh-TW&hl=en-US&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=btn&ssel=0&tsel=0&kc=0&tk='+tk(e.innerText)+'&q='+encodeURIComponent(e.innerText),
        onload:(data)=>{
            let s=''
            try{
                data=JSON.parse(data.responseText);
                s=data[0].map(x=>x[0]||'').join('')
            }catch(err){
                return
            }
            e.innerHTML+='\n'+s
    }})
}