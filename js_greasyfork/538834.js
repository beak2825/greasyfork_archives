// ==UserScript==
// @name         Steam Profile Tools & Info Box With Friend Code+
// @namespace    https://steamcommunity.com/
// @version      1.0
// @description  Steam profiline analiz butonları, profil bilgileri ve friend code gösterir (csstats.gg, scope.gg, faceitfinder, vs)
// @author       BoomBookTR
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @grant        GM_xmlhttpRequest
// @connect      api.steampowered.com
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/538834/Steam%20Profile%20Tools%20%20Info%20Box%20With%20Friend%20Code%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/538834/Steam%20Profile%20Tools%20%20Info%20Box%20With%20Friend%20Code%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

//https://github.com/tori2105/STEAMID64-to-CSGO-CS2-Friend-Code-in-JS

//// @require      https://cdn.jsdelivr.net/npm/js-md5@0.7.3/src/md5.min.js
// md5.min.js code.
/**
 * Minified by jsDelivr using Terser v5.19.2.
 * Original file: /npm/js-md5@0.7.3/src/md5.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/**
 * [js-md5]{@link https://github.com/emn178/js-md5}
 *
 * @namespace md5
 * @version 0.7.3
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
(function(){"use strict";var ERROR="input is invalid type",WINDOW="object"==typeof window,root=WINDOW?window:{};root.JS_MD5_NO_WINDOW&&(WINDOW=!1);var WEB_WORKER=!WINDOW&&"object"==typeof self,NODE_JS=!root.JS_MD5_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;NODE_JS?root=global:WEB_WORKER&&(root=self);var COMMON_JS=!root.JS_MD5_NO_COMMON_JS&&"object"==typeof module&&module.exports,AMD="function"==typeof define&&define.amd,ARRAY_BUFFER=!root.JS_MD5_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,HEX_CHARS="0123456789abcdef".split(""),EXTRA=[128,32768,8388608,-2147483648],SHIFT=[0,8,16,24],OUTPUT_TYPES=["hex","array","digest","buffer","arrayBuffer","base64"],BASE64_ENCODE_CHAR="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),blocks=[],buffer8;if(ARRAY_BUFFER){var buffer=new ArrayBuffer(68);buffer8=new Uint8Array(buffer),blocks=new Uint32Array(buffer)}!root.JS_MD5_NO_NODE_JS&&Array.isArray||(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)}),!ARRAY_BUFFER||!root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW&&ArrayBuffer.isView||(ArrayBuffer.isView=function(t){return"object"==typeof t&&t.buffer&&t.buffer.constructor===ArrayBuffer});var createOutputMethod=function(t){return function(r){return new Md5(!0).update(r)[t]()}},createMethod=function(){var t=createOutputMethod("hex");NODE_JS&&(t=nodeWrap(t)),t.create=function(){return new Md5},t.update=function(r){return t.create().update(r)};for(var r=0;r<OUTPUT_TYPES.length;++r){var e=OUTPUT_TYPES[r];t[e]=createOutputMethod(e)}return t},nodeWrap=function(method){var crypto=eval("require('crypto')"),Buffer=eval("require('buffer').Buffer"),nodeMethod=function(t){if("string"==typeof t)return crypto.createHash("md5").update(t,"utf8").digest("hex");if(null==t)throw ERROR;return t.constructor===ArrayBuffer&&(t=new Uint8Array(t)),Array.isArray(t)||ArrayBuffer.isView(t)||t.constructor===Buffer?crypto.createHash("md5").update(new Buffer(t)).digest("hex"):method(t)};return nodeMethod};function Md5(t){if(t)blocks[0]=blocks[16]=blocks[1]=blocks[2]=blocks[3]=blocks[4]=blocks[5]=blocks[6]=blocks[7]=blocks[8]=blocks[9]=blocks[10]=blocks[11]=blocks[12]=blocks[13]=blocks[14]=blocks[15]=0,this.blocks=blocks,this.buffer8=buffer8;else if(ARRAY_BUFFER){var r=new ArrayBuffer(68);this.buffer8=new Uint8Array(r),this.blocks=new Uint32Array(r)}else this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.h0=this.h1=this.h2=this.h3=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}Md5.prototype.update=function(t){if(!this.finalized){var r,e=typeof t;if("string"!==e){if("object"!==e)throw ERROR;if(null===t)throw ERROR;if(ARRAY_BUFFER&&t.constructor===ArrayBuffer)t=new Uint8Array(t);else if(!(Array.isArray(t)||ARRAY_BUFFER&&ArrayBuffer.isView(t)))throw ERROR;r=!0}for(var s,i,o=0,h=t.length,f=this.blocks,a=this.buffer8;o<h;){if(this.hashed&&(this.hashed=!1,f[0]=f[16],f[16]=f[1]=f[2]=f[3]=f[4]=f[5]=f[6]=f[7]=f[8]=f[9]=f[10]=f[11]=f[12]=f[13]=f[14]=f[15]=0),r)if(ARRAY_BUFFER)for(i=this.start;o<h&&i<64;++o)a[i++]=t[o];else for(i=this.start;o<h&&i<64;++o)f[i>>2]|=t[o]<<SHIFT[3&i++];else if(ARRAY_BUFFER)for(i=this.start;o<h&&i<64;++o)(s=t.charCodeAt(o))<128?a[i++]=s:s<2048?(a[i++]=192|s>>6,a[i++]=128|63&s):s<55296||s>=57344?(a[i++]=224|s>>12,a[i++]=128|s>>6&63,a[i++]=128|63&s):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++o)),a[i++]=240|s>>18,a[i++]=128|s>>12&63,a[i++]=128|s>>6&63,a[i++]=128|63&s);else for(i=this.start;o<h&&i<64;++o)(s=t.charCodeAt(o))<128?f[i>>2]|=s<<SHIFT[3&i++]:s<2048?(f[i>>2]|=(192|s>>6)<<SHIFT[3&i++],f[i>>2]|=(128|63&s)<<SHIFT[3&i++]):s<55296||s>=57344?(f[i>>2]|=(224|s>>12)<<SHIFT[3&i++],f[i>>2]|=(128|s>>6&63)<<SHIFT[3&i++],f[i>>2]|=(128|63&s)<<SHIFT[3&i++]):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++o)),f[i>>2]|=(240|s>>18)<<SHIFT[3&i++],f[i>>2]|=(128|s>>12&63)<<SHIFT[3&i++],f[i>>2]|=(128|s>>6&63)<<SHIFT[3&i++],f[i>>2]|=(128|63&s)<<SHIFT[3&i++]);this.lastByteIndex=i,this.bytes+=i-this.start,i>=64?(this.start=i-64,this.hash(),this.hashed=!0):this.start=i}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},Md5.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,r=this.lastByteIndex;t[r>>2]|=EXTRA[3&r],r>=56&&(this.hashed||this.hash(),t[0]=t[16],t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.bytes<<3,t[15]=this.hBytes<<3|this.bytes>>>29,this.hash()}},Md5.prototype.hash=function(){var t,r,e,s,i,o,h=this.blocks;this.first?r=((r=((t=((t=h[0]-680876937)<<7|t>>>25)-271733879<<0)^(e=((e=(-271733879^(s=((s=(-1732584194^2004318071&t)+h[1]-117830708)<<12|s>>>20)+t<<0)&(-271733879^t))+h[2]-1126478375)<<17|e>>>15)+s<<0)&(s^t))+h[3]-1316259209)<<22|r>>>10)+e<<0:(t=this.h0,r=this.h1,e=this.h2,r=((r+=((t=((t+=((s=this.h3)^r&(e^s))+h[0]-680876936)<<7|t>>>25)+r<<0)^(e=((e+=(r^(s=((s+=(e^t&(r^e))+h[1]-389564586)<<12|s>>>20)+t<<0)&(t^r))+h[2]+606105819)<<17|e>>>15)+s<<0)&(s^t))+h[3]-1044525330)<<22|r>>>10)+e<<0),r=((r+=((t=((t+=(s^r&(e^s))+h[4]-176418897)<<7|t>>>25)+r<<0)^(e=((e+=(r^(s=((s+=(e^t&(r^e))+h[5]+1200080426)<<12|s>>>20)+t<<0)&(t^r))+h[6]-1473231341)<<17|e>>>15)+s<<0)&(s^t))+h[7]-45705983)<<22|r>>>10)+e<<0,r=((r+=((t=((t+=(s^r&(e^s))+h[8]+1770035416)<<7|t>>>25)+r<<0)^(e=((e+=(r^(s=((s+=(e^t&(r^e))+h[9]-1958414417)<<12|s>>>20)+t<<0)&(t^r))+h[10]-42063)<<17|e>>>15)+s<<0)&(s^t))+h[11]-1990404162)<<22|r>>>10)+e<<0,r=((r+=((t=((t+=(s^r&(e^s))+h[12]+1804603682)<<7|t>>>25)+r<<0)^(e=((e+=(r^(s=((s+=(e^t&(r^e))+h[13]-40341101)<<12|s>>>20)+t<<0)&(t^r))+h[14]-1502002290)<<17|e>>>15)+s<<0)&(s^t))+h[15]+1236535329)<<22|r>>>10)+e<<0,r=((r+=((s=((s+=(r^e&((t=((t+=(e^s&(r^e))+h[1]-165796510)<<5|t>>>27)+r<<0)^r))+h[6]-1069501632)<<9|s>>>23)+t<<0)^t&((e=((e+=(t^r&(s^t))+h[11]+643717713)<<14|e>>>18)+s<<0)^s))+h[0]-373897302)<<20|r>>>12)+e<<0,r=((r+=((s=((s+=(r^e&((t=((t+=(e^s&(r^e))+h[5]-701558691)<<5|t>>>27)+r<<0)^r))+h[10]+38016083)<<9|s>>>23)+t<<0)^t&((e=((e+=(t^r&(s^t))+h[15]-660478335)<<14|e>>>18)+s<<0)^s))+h[4]-405537848)<<20|r>>>12)+e<<0,r=((r+=((s=((s+=(r^e&((t=((t+=(e^s&(r^e))+h[9]+568446438)<<5|t>>>27)+r<<0)^r))+h[14]-1019803690)<<9|s>>>23)+t<<0)^t&((e=((e+=(t^r&(s^t))+h[3]-187363961)<<14|e>>>18)+s<<0)^s))+h[8]+1163531501)<<20|r>>>12)+e<<0,r=((r+=((s=((s+=(r^e&((t=((t+=(e^s&(r^e))+h[13]-1444681467)<<5|t>>>27)+r<<0)^r))+h[2]-51403784)<<9|s>>>23)+t<<0)^t&((e=((e+=(t^r&(s^t))+h[7]+1735328473)<<14|e>>>18)+s<<0)^s))+h[12]-1926607734)<<20|r>>>12)+e<<0,r=((r+=((o=(s=((s+=((i=r^e)^(t=((t+=(i^s)+h[5]-378558)<<4|t>>>28)+r<<0))+h[8]-2022574463)<<11|s>>>21)+t<<0)^t)^(e=((e+=(o^r)+h[11]+1839030562)<<16|e>>>16)+s<<0))+h[14]-35309556)<<23|r>>>9)+e<<0,r=((r+=((o=(s=((s+=((i=r^e)^(t=((t+=(i^s)+h[1]-1530992060)<<4|t>>>28)+r<<0))+h[4]+1272893353)<<11|s>>>21)+t<<0)^t)^(e=((e+=(o^r)+h[7]-155497632)<<16|e>>>16)+s<<0))+h[10]-1094730640)<<23|r>>>9)+e<<0,r=((r+=((o=(s=((s+=((i=r^e)^(t=((t+=(i^s)+h[13]+681279174)<<4|t>>>28)+r<<0))+h[0]-358537222)<<11|s>>>21)+t<<0)^t)^(e=((e+=(o^r)+h[3]-722521979)<<16|e>>>16)+s<<0))+h[6]+76029189)<<23|r>>>9)+e<<0,r=((r+=((o=(s=((s+=((i=r^e)^(t=((t+=(i^s)+h[9]-640364487)<<4|t>>>28)+r<<0))+h[12]-421815835)<<11|s>>>21)+t<<0)^t)^(e=((e+=(o^r)+h[15]+530742520)<<16|e>>>16)+s<<0))+h[2]-995338651)<<23|r>>>9)+e<<0,r=((r+=((s=((s+=(r^((t=((t+=(e^(r|~s))+h[0]-198630844)<<6|t>>>26)+r<<0)|~e))+h[7]+1126891415)<<10|s>>>22)+t<<0)^((e=((e+=(t^(s|~r))+h[14]-1416354905)<<15|e>>>17)+s<<0)|~t))+h[5]-57434055)<<21|r>>>11)+e<<0,r=((r+=((s=((s+=(r^((t=((t+=(e^(r|~s))+h[12]+1700485571)<<6|t>>>26)+r<<0)|~e))+h[3]-1894986606)<<10|s>>>22)+t<<0)^((e=((e+=(t^(s|~r))+h[10]-1051523)<<15|e>>>17)+s<<0)|~t))+h[1]-2054922799)<<21|r>>>11)+e<<0,r=((r+=((s=((s+=(r^((t=((t+=(e^(r|~s))+h[8]+1873313359)<<6|t>>>26)+r<<0)|~e))+h[15]-30611744)<<10|s>>>22)+t<<0)^((e=((e+=(t^(s|~r))+h[6]-1560198380)<<15|e>>>17)+s<<0)|~t))+h[13]+1309151649)<<21|r>>>11)+e<<0,r=((r+=((s=((s+=(r^((t=((t+=(e^(r|~s))+h[4]-145523070)<<6|t>>>26)+r<<0)|~e))+h[11]-1120210379)<<10|s>>>22)+t<<0)^((e=((e+=(t^(s|~r))+h[2]+718787259)<<15|e>>>17)+s<<0)|~t))+h[9]-343485551)<<21|r>>>11)+e<<0,this.first?(this.h0=t+1732584193<<0,this.h1=r-271733879<<0,this.h2=e-1732584194<<0,this.h3=s+271733878<<0,this.first=!1):(this.h0=this.h0+t<<0,this.h1=this.h1+r<<0,this.h2=this.h2+e<<0,this.h3=this.h3+s<<0)},Md5.prototype.hex=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,s=this.h3;return HEX_CHARS[t>>4&15]+HEX_CHARS[15&t]+HEX_CHARS[t>>12&15]+HEX_CHARS[t>>8&15]+HEX_CHARS[t>>20&15]+HEX_CHARS[t>>16&15]+HEX_CHARS[t>>28&15]+HEX_CHARS[t>>24&15]+HEX_CHARS[r>>4&15]+HEX_CHARS[15&r]+HEX_CHARS[r>>12&15]+HEX_CHARS[r>>8&15]+HEX_CHARS[r>>20&15]+HEX_CHARS[r>>16&15]+HEX_CHARS[r>>28&15]+HEX_CHARS[r>>24&15]+HEX_CHARS[e>>4&15]+HEX_CHARS[15&e]+HEX_CHARS[e>>12&15]+HEX_CHARS[e>>8&15]+HEX_CHARS[e>>20&15]+HEX_CHARS[e>>16&15]+HEX_CHARS[e>>28&15]+HEX_CHARS[e>>24&15]+HEX_CHARS[s>>4&15]+HEX_CHARS[15&s]+HEX_CHARS[s>>12&15]+HEX_CHARS[s>>8&15]+HEX_CHARS[s>>20&15]+HEX_CHARS[s>>16&15]+HEX_CHARS[s>>28&15]+HEX_CHARS[s>>24&15]},Md5.prototype.toString=Md5.prototype.hex,Md5.prototype.digest=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,s=this.h3;return[255&t,t>>8&255,t>>16&255,t>>24&255,255&r,r>>8&255,r>>16&255,r>>24&255,255&e,e>>8&255,e>>16&255,e>>24&255,255&s,s>>8&255,s>>16&255,s>>24&255]},Md5.prototype.array=Md5.prototype.digest,Md5.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(16),r=new Uint32Array(t);return r[0]=this.h0,r[1]=this.h1,r[2]=this.h2,r[3]=this.h3,t},Md5.prototype.buffer=Md5.prototype.arrayBuffer,Md5.prototype.base64=function(){for(var t,r,e,s="",i=this.array(),o=0;o<15;)t=i[o++],r=i[o++],e=i[o++],s+=BASE64_ENCODE_CHAR[t>>>2]+BASE64_ENCODE_CHAR[63&(t<<4|r>>>4)]+BASE64_ENCODE_CHAR[63&(r<<2|e>>>6)]+BASE64_ENCODE_CHAR[63&e];return t=i[o],s+=BASE64_ENCODE_CHAR[t>>>2]+BASE64_ENCODE_CHAR[t<<4&63]+"=="};var exports=createMethod();COMMON_JS?module.exports=exports:(root.md5=exports,AMD&&define((function(){return exports})))})();
//# sourceMappingURL=/sm/a1ccc4481b2b888e9aec0c7d5ee69a853d312145b46f4996acf3d463f70c031f.map

    // --- API key ---
    const apiKey = 'your_api_key'; // Kendi API anahtarını buraya ekle>>>>>>>>> https://steamcommunity.com/dev/apikey

    // Steam Web API ile vanity URL'den SteamID64 alma fonksiyonu
    function getSteamID64FromCustomURL(customUrl) {
        return new Promise((resolve, reject) => {
            const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${customUrl}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.response.success === 1) {
                            resolve(data.response.steamid);
                        } else {
                            reject('Steam ID çözülemedi');
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(e) {
                    reject(e);
                }
            });
        });
    }

    // Buton oluşturucu fonksiyon
    function createButton(text, url, color) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.style.padding = '8px 12px';
        btn.style.margin = '10px 10px 0 0';
        btn.style.fontSize = '14px';
        btn.style.backgroundColor = color;
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => window.open(url, '_blank');
        return btn;
    }

    // Bilgi kutusu oluşturucu (SteamID64, AccountID, Steam2, Steam3, Vanity URL, Friend Code)
    function createInfoBox(steamID64, accountID, steam2, steam3, vanityURL, friendCode) {
        const box = document.createElement('div');
        box.style.border = '1px solid #444';
        box.style.borderRadius = '8px';
        box.style.padding = '10px 15px';
        box.style.marginTop = '15px';
        box.style.backgroundColor = '#1b2838';
        box.style.color = '#fff';
        box.style.maxWidth = '400px';
        box.style.fontSize = '13px';
        box.innerHTML = `
        <h3 style="margin-top: 0;">Steam Bilgileri</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><td><strong>SteamID64</strong></td><td>${steamID64}</td></tr>
            <tr><td><strong>AccountID</strong></td><td>${accountID}</td></tr>
            <tr><td><strong>Steam2 ID</strong></td><td>${steam2}</td></tr>
            <tr><td><strong>Steam3 ID</strong></td><td>${steam3}</td></tr>
            ${vanityURL ? `<tr><td><strong>Vanity URL</strong></td><td>${vanityURL}</td></tr>` : ''}
            ${friendCode ? `<tr><td><strong>Friend Code</strong></td><td>${friendCode}</td></tr>` : ''}
        </table>
    `;
        return box;
    }



    // --- Friend Code hesaplama için ByteSwap sınıfı ve ilgili fonksiyonlar ---

    const zero_bs = 0n;
    const one_bs = 1n;
    const n256_bs = 256n;

    class ByteSwap {
        static from_little_endian(bytes) {
            let result = zero_bs;
            let base = one_bs;
            bytes.forEach(function (byte) {
                result = result + (base * (BigInt(byte)));
                base = base * n256_bs;
            });
            return result;
        }
        static from_big_endian(bytes) {
            const reversedBytes = new Uint8Array(bytes).reverse();
            return this.from_little_endian(reversedBytes);
        }
        static to_little_endian(bigNumber) {
            let result = new Uint8Array(8);
            let i = 0;
            let tempBigNumber = bigNumber;
            while (tempBigNumber > zero_bs && i < 8) {
                result[i] = Number(tempBigNumber % n256_bs);
                tempBigNumber = tempBigNumber / n256_bs;
                i += 1;
            }
            return result;
        }
        static to_big_endian(bigNumber) {
            const littleEndianBytes = this.to_little_endian(bigNumber);
            return new Uint8Array(littleEndianBytes).reverse();
        }
    }

    const alnum_fc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let byteSwap64_fc = (bigIntInput) => {
        const le_bytes = ByteSwap.to_little_endian(bigIntInput);
        const be_bytes_for_from_le = new Uint8Array(le_bytes).reverse();
        return ByteSwap.from_little_endian(be_bytes_for_from_le);
    };

    let b32_fc = (input) => {
        let res = "";
        let current_input = byteSwap64_fc(input);

        for (let i = 0; i < 13; i++) {
            if (i === 4 || i === 9) {
                res += "-";
            }
            res += alnum_fc[Number(current_input & 0x1Fn)];
            current_input >>= 5n;
        }
        return res;
    };

    // MD5 fonksiyonunu eklemek için basit bir md5 kütüphanesi ekleyelim (minimal implementation)
    // Tampermonkey için md5 kütüphanesi yoksa, aşağıdaki minimal md5 fonksiyonunu kullanabiliriz.
    // Burada basit bir md5 scripti eklemek yerine dış kaynaktan çekmek için aşağıdaki fonksiyonu kullanabiliriz:
    // Ancak dış kütüphane yoksa, kullanıcı md5 fonksiyonunu ayrıca sağlamalıdır.
    // Burada örnek amaçlı, md5 fonksiyonunu dışarıdan import etmeyi bırakıyorum.
    // Eğer md5 yoksa hata verecek.

    // hash_steam_id_fc fonksiyonu
    function hash_steam_id_fc(id) {
        let account_id = id & 0xFFFFFFFFn;
        let strange_steam_id = account_id | 0x4353474F00000000n;

        let bytes_to_hash = ByteSwap.to_little_endian(strange_steam_id);

        if (typeof md5 !== 'function') {
            console.error("MD5 function 'md5' is not defined. Lütfen md5 kütüphanesini ekleyin.");
            throw new Error("Missing MD5 implementation.");
        }
        let hash_hex_string = md5(bytes_to_hash);

        let md5_first_4_bytes = new Uint8Array(4);
        for (let i = 0; i < 4; i++) {
            md5_first_4_bytes[i] = parseInt(hash_hex_string.substring(i * 2, i * 2 + 2), 16);
        }

        return ByteSwap.from_little_endian(md5_first_4_bytes);
    }

    let make_u64_fc = (hi, lo) => {
        return (BigInt(hi) << 32n) | BigInt(lo);
    };

    class FriendCode {
        static encode(steamid_input) {
            let steamid = BigInt(steamid_input);
            let h = hash_steam_id_fc(steamid);
            let r = 0n;

            for (let i = 0; i < 8; i++) {
                let id_nibble = steamid & 0xFn;
                steamid >>= 4n;

                let hash_nibble = (h >> BigInt(i)) & 1n;

                let a = (r << 4n) | id_nibble;

                r = make_u64_fc(r >> 28n, a);
                r = make_u64_fc(r >> 31n, (a << 1n) | hash_nibble);
            }
            let res = b32_fc(r);

            if (res.slice(0, 5) === "AAAA-") {
                res = res.slice(5);
            }

            return res;
        }
    }

    // Friend Code gösterme fonksiyonu
    function showFriendCode(steamid64) {
        let friendCode;
        try {
            friendCode = FriendCode.encode(BigInt(steamid64));
        } catch (e) {
            console.error("Friend code hesaplama hatası:", e);
            return;
        }

        let container = document.querySelector('.profile_header');
        if (!container) {
            console.warn("Profil başlığı bulunamadı, friend code gösterilemiyor.");
            return;
        }

        let fcDiv = document.createElement('div');
        fcDiv.style.marginTop = '10px';
        fcDiv.style.padding = '8px 12px';
        fcDiv.style.backgroundColor = '#2a475e';
        fcDiv.style.color = '#c7d5e0';
        fcDiv.style.borderRadius = '5px';
        fcDiv.style.fontWeight = 'bold';
        fcDiv.textContent = 'CS2 Friend: ' + friendCode;

        container.appendChild(fcDiv);
    }

    // Ana işlem

    // Profil sayfasından steamid64 veya custom URL çıkarma
    function extractSteamID() {
        let url = window.location.href;

        if (url.match(/\/profiles\/(\d{17,})/)) {
            return url.match(/\/profiles\/(\d{17,})/)[1];
        }

        if (url.match(/\/id\/([^\/?]+)/)) {
            return url.match(/\/id\/([^\/?]+)/)[1];
        }

        return null;
    }

    async function main() {
        let id_or_custom = extractSteamID();

        if (!id_or_custom) {
            console.warn("Steam ID veya Vanity URL bulunamadı.");
            return;
        }

        let steamID64;

        if (/^\d{17,}$/.test(id_or_custom)) {
            steamID64 = id_or_custom;
        } else {
            // Vanity URL ise API ile SteamID64 al
            try {
                steamID64 = await getSteamID64FromCustomURL(id_or_custom);
            } catch (e) {
                console.error("SteamID64 çözümlenemedi:", e);
                return;
            }
        }

        // SteamID64 ile diğer formatlar
        const steamid64BigInt = BigInt(steamID64);
        const accountID = Number(steamid64BigInt & 0xFFFFFFFFn);

        const steam2 = `STEAM_0:${accountID % 2}:${(accountID - (accountID % 2)) / 2}`;
        const steam3 = `[U:1:${accountID}]`;

        // Friend Code hesapla
        let friendCode;
        try {
            friendCode = FriendCode.encode(steamid64BigInt);
        } catch (e) {
            console.error("Friend code hesaplama hatası:", e);
            friendCode = null;
        }

        // Butonlar için linkler
        const btnData = [
            { text: 'csstats.gg', url: `https://csstats.gg/player/${steamID64}`, color: '#5c7e10' },
            { text: 'scope.gg', url: `https://app.scope.gg/progress/${accountID}`, color: '#1e5f97' },
            { text: 'faceittracker.net', url: `https://faceittracker.net/steam-profile/${steamID64}`, color: '#9933cc' },
            { text: 'Steam Calculator', url: `https://steamdb.info/calculator/${steamID64}/`, color: '#4b4b4b' }
        ];

        // Butonları profil header altına ekle
        let container = document.querySelector('.profile_header');

        if (!container) {
            console.warn("Profil başlığı bulunamadı, butonlar gösterilemiyor.");
            return;
        }

        // Butonları ekle
        btnData.forEach(d => {
            let btn = createButton(d.text, d.url, d.color);
            container.appendChild(btn);
        });

        // Bilgi kutusu ekle (friendCode parametresi eklendi)
        const vanityURL = (/\/id\/([^\/?]+)/.test(window.location.href)) ? window.location.href.match(/\/id\/([^\/?]+)/)[1] : null;
        let infoBox = createInfoBox(steamID64, accountID, steam2, steam3, vanityURL, friendCode);
        container.appendChild(infoBox);

     }


    main();

})();
