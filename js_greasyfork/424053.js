// ==UserScript==
// @name         Raindrop Auto Base64 Resolver
// @name:ko      레인드롭 자동 Base64 해독기
// @version      0.1
// @description  Automatically decrypts the Base64 signature on the Raindrop.live.
// @description:ko   Raindrop.live의 Base64 시그니쳐를 자동으로 해독해줍니다.
// @author       Renge
// @match        https://raindrop.live/*
// @grant        none
// @namespace https://greasyfork.org/users/751945
// @downloadURL https://update.greasyfork.org/scripts/424053/Raindrop%20Auto%20Base64%20Resolver.user.js
// @updateURL https://update.greasyfork.org/scripts/424053/Raindrop%20Auto%20Base64%20Resolver.meta.js
// ==/UserScript==


var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }
}

var bnum = -1;
var knum = -1;
var cnt = 0;
$('.article-extra-value>table>tbody th').each( function() {
    if($( this ).text().includes('Signature'))
        bnum = cnt;
    if($( this ).text().includes('🌳'))
        bnum = cnt;
    if($( this ).text().includes('KEY'))
        knum = cnt;
    cnt+=1;
} );
var cnum = $('span[style="color:#ecf0f1;"]>span').length;
var dnum = $('span[style="color:#bdc3c7;"]').length;
if(bnum != -1 || cnum != 0 || dnum != 0){
    var b64 =[];
    if(bnum != -1){
        b64 = $('.article-extra-value>table tr:eq('+bnum+') span').text().split("\n");
    }else if(cnum != 0){
        b64 = $('span[style="color:#ecf0f1;"]>span').text().split("\n");
    }else if(dnum != 0){
        $('span[style="color:#bdc3c7;"]').each( function() {
            b64.push($( this ).text());
        } );
    }
    console.log(b64);
    var dec = [];
    var separators = [' ', '\n'];
    for(var i=0;i<b64.length;i++)
        dec.push(Base64.decode(b64[i]));

    if(!dec.join().includes('http')){
        for(i=0;i<dec.length;i++)
            dec[i] = Base64.decode(dec[i]);
    }

    for(i=0;i<dec.length;i++){
        if(dec[i].includes('http')){
            var splitLink = dec[i].split(new RegExp('[' + separators.join('') + ']', 'g'));
            for(var m=0;m<splitLink.length;m++){
                if(splitLink[m].includes('http')){
                    splitLink[m] = '<a href="'+splitLink[m]+'" style="color:green; text-decoration: underline;" target="_blank">'+splitLink[m]+'</a>'
                }else{
                    splitLink[m] = '<strong>'+splitLink[m]+'</strong>'
                }
            }
            dec[i] = splitLink.join(" ");
        }
    }
    $('.article-extra-value table').append('<tr><th scope="row">🔓 Base64 Dec</th><td><span>'+dec.join('<br>')+'</span></td></tr>' );
}

if(knum != -1){
    $('.article-extra-value table').append('<tr><th scope="row">🔓 Key Dec</th><td><span>'+Base64.decode($('.article-extra-value>table tr:eq('+knum+') span').text())+'</span></td></tr>' );
}
