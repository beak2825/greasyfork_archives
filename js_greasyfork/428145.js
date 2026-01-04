// ==UserScript==
// @name        Amazon Autologin
// @namespace   Amazon Autologin
// @description A userscript that automatically fills in the password for your Amazon login attempts and also enters the correct 2FA code. Additionally it skips the reminder that asks you to add a phone number for SMS verification
// @include     *amazon.de/*signin*
// @include     *amazon.de/*mfa*
// @include     *amazon.de/*accountfixup*
// @include     *amazon.com/*signin*
// @include     *amazon.com/*mfa*
// @include     *amazon.com/*accountfixup*
// @version     3
// @author      Bellianik
// @grant       GM_setValue
// @grant       GM_getValue
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/428145/Amazon%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/428145/Amazon%20Autologin.meta.js
// ==/UserScript==

//I would be very happy for any feedback you can leave on greasyfork or openuserjs. It is the reason I wanted to share this neat script in the first place :). Enjoy
var credentials = [
    "myaccount@gmail.com", "my_password", "my_2fa_secret",
    "mysecondaccount@hotmail.com", "my_password", "my_2fa_secret",
    "mythirdaccount@yahoo.com", "my_password", "none. if you do not use 2FA you can just remove this entry, leave it empty or add whatever you want",
];

// from https://github.com/Caligatio/jsSHA
// including sha1 makes this a single, downloadable, self-contained html document!
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a
 Copyright 2008-2018 Brian Turek, 1998-2009 Paul Johnston & Contributors
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information
*/
'use strict';(function(G){function r(d,b,c){var h=0,a=[],f=0,g,m,k,e,l,p,q,t,w=!1,n=[],u=[],v,r=!1;c=c||{};g=c.encoding||"UTF8";v=c.numRounds||1;if(v!==parseInt(v,10)||1>v)throw Error("numRounds must a integer >= 1");if("SHA-1"===d)l=512,p=z,q=H,e=160,t=function(a){return a.slice()};else throw Error("Chosen SHA variant is not supported");k=A(b,g);m=x(d);this.setHMACKey=function(a,f,b){var c;if(!0===w)throw Error("HMAC key already set");if(!0===r)throw Error("Cannot set HMAC key after calling update");
g=(b||{}).encoding||"UTF8";f=A(f,g)(a);a=f.binLen;f=f.value;c=l>>>3;b=c/4-1;if(c<a/8){for(f=q(f,a,0,x(d),e);f.length<=b;)f.push(0);f[b]&=4294967040}else if(c>a/8){for(;f.length<=b;)f.push(0);f[b]&=4294967040}for(a=0;a<=b;a+=1)n[a]=f[a]^909522486,u[a]=f[a]^1549556828;m=p(n,m);h=l;w=!0};this.update=function(b){var e,g,c,d=0,q=l>>>5;e=k(b,a,f);b=e.binLen;g=e.value;e=b>>>5;for(c=0;c<e;c+=q)d+l<=b&&(m=p(g.slice(c,c+q),m),d+=l);h+=d;a=g.slice(d>>>5);f=b%l;r=!0};this.getHash=function(b,g){var c,k,l,p;if(!0===
w)throw Error("Cannot call getHash after setting HMAC key");l=B(g);switch(b){case "HEX":c=function(a){return C(a,e,l)};break;case "B64":c=function(a){return D(a,e,l)};break;case "BYTES":c=function(a){return E(a,e)};break;case "ARRAYBUFFER":try{k=new ArrayBuffer(0)}catch(I){throw Error("ARRAYBUFFER not supported by this environment");}c=function(a){return F(a,e)};break;default:throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");}p=q(a.slice(),f,h,t(m),e);for(k=1;k<v;k+=1)p=q(p,e,0,x(d),e);
return c(p)};this.getHMAC=function(b,g){var c,k,n,r;if(!1===w)throw Error("Cannot call getHMAC without first setting HMAC key");n=B(g);switch(b){case "HEX":c=function(a){return C(a,e,n)};break;case "B64":c=function(a){return D(a,e,n)};break;case "BYTES":c=function(a){return E(a,e)};break;case "ARRAYBUFFER":try{c=new ArrayBuffer(0)}catch(I){throw Error("ARRAYBUFFER not supported by this environment");}c=function(a){return F(a,e)};break;default:throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
}k=q(a.slice(),f,h,t(m),e);r=p(u,x(d));r=q(k,e,l,r,e);return c(r)}}function C(d,b,c){var h="";b/=8;var a,f;for(a=0;a<b;a+=1)f=d[a>>>2]>>>8*(3+a%4*-1),h+="0123456789abcdef".charAt(f>>>4&15)+"0123456789abcdef".charAt(f&15);return c.outputUpper?h.toUpperCase():h}function D(d,b,c){var h="",a=b/8,f,g,m;for(f=0;f<a;f+=3)for(g=f+1<a?d[f+1>>>2]:0,m=f+2<a?d[f+2>>>2]:0,m=(d[f>>>2]>>>8*(3+f%4*-1)&255)<<16|(g>>>8*(3+(f+1)%4*-1)&255)<<8|m>>>8*(3+(f+2)%4*-1)&255,g=0;4>g;g+=1)8*f+6*g<=b?h+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(m>>>
6*(3-g)&63):h+=c.b64Pad;return h}function E(d,b){var c="",h=b/8,a,f;for(a=0;a<h;a+=1)f=d[a>>>2]>>>8*(3+a%4*-1)&255,c+=String.fromCharCode(f);return c}function F(d,b){var c=b/8,h,a=new ArrayBuffer(c),f;f=new Uint8Array(a);for(h=0;h<c;h+=1)f[h]=d[h>>>2]>>>8*(3+h%4*-1)&255;return a}function B(d){var b={outputUpper:!1,b64Pad:"=",shakeLen:-1};d=d||{};b.outputUpper=d.outputUpper||!1;!0===d.hasOwnProperty("b64Pad")&&(b.b64Pad=d.b64Pad);if("boolean"!==typeof b.outputUpper)throw Error("Invalid outputUpper formatting option");
if("string"!==typeof b.b64Pad)throw Error("Invalid b64Pad formatting option");return b}function A(d,b){var c;switch(b){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(d){case "HEX":c=function(b,a,f){var g=b.length,c,d,e,l,p;if(0!==g%2)throw Error("String of HEX type must be in byte increments");a=a||[0];f=f||0;p=f>>>3;for(c=0;c<g;c+=2){d=parseInt(b.substr(c,2),16);if(isNaN(d))throw Error("String of HEX type contains invalid characters");
l=(c>>>1)+p;for(e=l>>>2;a.length<=e;)a.push(0);a[e]|=d<<8*(3+l%4*-1)}return{value:a,binLen:4*g+f}};break;case "TEXT":c=function(c,a,f){var g,d,k=0,e,l,p,q,t,n;a=a||[0];f=f||0;p=f>>>3;if("UTF8"===b)for(n=3,e=0;e<c.length;e+=1)for(g=c.charCodeAt(e),d=[],128>g?d.push(g):2048>g?(d.push(192|g>>>6),d.push(128|g&63)):55296>g||57344<=g?d.push(224|g>>>12,128|g>>>6&63,128|g&63):(e+=1,g=65536+((g&1023)<<10|c.charCodeAt(e)&1023),d.push(240|g>>>18,128|g>>>12&63,128|g>>>6&63,128|g&63)),l=0;l<d.length;l+=1){t=k+
p;for(q=t>>>2;a.length<=q;)a.push(0);a[q]|=d[l]<<8*(n+t%4*-1);k+=1}else if("UTF16BE"===b||"UTF16LE"===b)for(n=2,d="UTF16LE"===b&&!0||"UTF16LE"!==b&&!1,e=0;e<c.length;e+=1){g=c.charCodeAt(e);!0===d&&(l=g&255,g=l<<8|g>>>8);t=k+p;for(q=t>>>2;a.length<=q;)a.push(0);a[q]|=g<<8*(n+t%4*-1);k+=2}return{value:a,binLen:8*k+f}};break;case "B64":c=function(b,a,f){var c=0,d,k,e,l,p,q,n;if(-1===b.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");k=b.indexOf("=");b=b.replace(/\=/g,
"");if(-1!==k&&k<b.length)throw Error("Invalid '=' found in base-64 string");a=a||[0];f=f||0;q=f>>>3;for(k=0;k<b.length;k+=4){p=b.substr(k,4);for(e=l=0;e<p.length;e+=1)d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(p[e]),l|=d<<18-6*e;for(e=0;e<p.length-1;e+=1){n=c+q;for(d=n>>>2;a.length<=d;)a.push(0);a[d]|=(l>>>16-8*e&255)<<8*(3+n%4*-1);c+=1}}return{value:a,binLen:8*c+f}};break;case "BYTES":c=function(b,a,c){var d,m,k,e,l;a=a||[0];c=c||0;k=c>>>3;for(m=0;m<b.length;m+=
1)d=b.charCodeAt(m),l=m+k,e=l>>>2,a.length<=e&&a.push(0),a[e]|=d<<8*(3+l%4*-1);return{value:a,binLen:8*b.length+c}};break;case "ARRAYBUFFER":try{c=new ArrayBuffer(0)}catch(h){throw Error("ARRAYBUFFER not supported by this environment");}c=function(b,a,c){var d,m,k,e,l;a=a||[0];c=c||0;m=c>>>3;l=new Uint8Array(b);for(d=0;d<b.byteLength;d+=1)e=d+m,k=e>>>2,a.length<=k&&a.push(0),a[k]|=l[d]<<8*(3+e%4*-1);return{value:a,binLen:8*b.byteLength+c}};break;default:throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
}return c}function n(d,b){return d<<b|d>>>32-b}function u(d,b){var c=(d&65535)+(b&65535);return((d>>>16)+(b>>>16)+(c>>>16)&65535)<<16|c&65535}function y(d,b,c,h,a){var f=(d&65535)+(b&65535)+(c&65535)+(h&65535)+(a&65535);return((d>>>16)+(b>>>16)+(c>>>16)+(h>>>16)+(a>>>16)+(f>>>16)&65535)<<16|f&65535}function x(d){var b=[];if("SHA-1"===d)b=[1732584193,4023233417,2562383102,271733878,3285377520];else throw Error("No SHA variants supported");return b}function z(d,b){var c=[],h,a,f,g,m,k,e;h=b[0];a=b[1];
f=b[2];g=b[3];m=b[4];for(e=0;80>e;e+=1)c[e]=16>e?d[e]:n(c[e-3]^c[e-8]^c[e-14]^c[e-16],1),k=20>e?y(n(h,5),a&f^~a&g,m,1518500249,c[e]):40>e?y(n(h,5),a^f^g,m,1859775393,c[e]):60>e?y(n(h,5),a&f^a&g^f&g,m,2400959708,c[e]):y(n(h,5),a^f^g,m,3395469782,c[e]),m=g,g=f,f=n(a,30),a=h,h=k;b[0]=u(h,b[0]);b[1]=u(a,b[1]);b[2]=u(f,b[2]);b[3]=u(g,b[3]);b[4]=u(m,b[4]);return b}function H(d,b,c,h){var a;for(a=(b+65>>>9<<4)+15;d.length<=a;)d.push(0);d[b>>>5]|=128<<24-b%32;b+=c;d[a]=b&4294967295;d[a-1]=b/4294967296|0;
b=d.length;for(a=0;a<b;a+=16)h=z(d.slice(a,a+16),h);return h}"function"===typeof define&&define.amd?define(function(){return r}):"undefined"!==typeof exports?("undefined"!==typeof module&&module.exports&&(module.exports=r),exports=r):G.jsSHA=r})(this);

//TOTP Code modified from https://github.com/tkooda/totp.info and fixed base32tohex function

function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
function hex2dec(s) { return parseInt(s, 16); }

function base32tohex(base32) {
    var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var bits = "";
    var hex = "";

    for (var i = 0; i < base32.length; i++) {
        var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += leftpad(val.toString(2), 5, '0');
    }

    for (var i = 0; i+4 <= bits.length; i+=4) {
        var chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16) ;
    }
    return hex.length % 2 ? hex + "0" : hex;
};


function leftpad(str, len, pad) {
    if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
    }
    return str;
};

function updateOtp( secret ) {
    var epoch = Math.round(new Date().getTime() / 1000.0);
    var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
    var shaObj = new jsSHA("SHA-1", "HEX");
    shaObj.setHMACKey( base32tohex( secret ), "HEX");
    shaObj.update(time);
    var hmac = shaObj.getHMAC("HEX");

    if (hmac == 'KEY MUST BE IN BYTE INCREMENTS') {

    } else {
        var offset = hex2dec(hmac.substring(hmac.length - 1));
    }

    var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
    otp = (otp).substr(otp.length - 6, 6);

    return otp;
};


function isValidSecret( s ) {
  if ( !/^[a-zA-Z2-7]+$/.test( s ) ) { // only allow base32
    return false;
  }
  var epoch = Math.round(new Date().getTime() / 1000.0);
  var time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, '0');
  var shaObj = new jsSHA("SHA-1", "HEX");
  try {
    shaObj.setHMACKey( base32tohex(s), "HEX");
    shaObj.update(time);
    var hmac = shaObj.getHMAC("HEX");

    return (hmac != "KEY MUST BE IN BYTE INCREMENTS");
  } catch(err) {
    return false; // e.g. HEX string 's' not actually in byte increments, try again..
  }
};

function getValidSecret( secret ) {
    if ( isValidSecret( secret ) ) {
        return secret.toUpperCase();
    }

    return undefined;
};

function getOTP( s ) {
    var secret = getValidSecret(s);

    if ( secret ) {
        return updateOtp( secret );
    } else {
        return undefined
  }
};

(function() {
    'use strict';

    var errorElements = document.querySelectorAll('.a-alert-error'); //error on page, prevent endless retries to avoid ban

    for(var i = 0; i < errorElements.length; i++) {
        if (errorElements[i].id !== 'passkey-error-alert') {
            console.log("Error on page detected! Aborting");
            return;
        }
    }

    if(document.getElementById("auth-mfa-remember-device")) { //check if on OTP/2step code entry page
        document.getElementById("auth-mfa-remember-device").checked = 1

        var email = GM_getValue("lastEmail", "none");

        var index = credentials.indexOf(email);

        if(index == -1) {
            console.log("Unknown email address! Aborting");
            return;
        }

        var otp = getOTP(credentials[index+2]);

        document.getElementById("auth-mfa-otpcode").value = otp;

        if(document.getElementById("image-captcha-section") || document.getElementById("auth-captcha-image")) {
            console.log("Captcha detected! Aborting");
            return;
        }
        else {
            document.getElementById("auth-signin-button").click();
        }

        return;
    }

    if(document.querySelector('input[aria-labelledby$="ap-account-fixup-phone-pin-code-button-announce"]')) { //skip the add phone for sms verification reminder
        document.getElementById("ap-account-fixup-phone-skip-link").click();
        return;
    }

    if (document.getElementById("signInSubmit")){ //check if login page
        var email = document.getElementById("ap-credential-autofill-hint").value; //document.querySelector(".a-row.a-size-base.a-color-tertiary.auth-text-truncate").innerText;
        GM_setValue("lastEmail", email);

        var index = credentials.indexOf(email);

        if(index == -1) {
            console.log("Unknown email address! Aborting");
            return;
        }

        document.getElementById("ap_password").value = credentials[index+1];

        // document.querySelector('input[name$="rememberMe"]').checked = 1 // as of around December 2025 this field does not exist anymore I think and causes script to cease working

        if(document.getElementById("image-captcha-section") || document.getElementById("auth-captcha-image")) {
            console.log("Captcha detected! Aborting");
            return;
        }
        else {
            document.getElementById("signInSubmit").click();
        }
    }
})();