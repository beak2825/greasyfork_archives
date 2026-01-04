// ==UserScript==
// @name         划词翻译
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @include            http://*
// @include            https://*
// @downloadURL https://update.greasyfork.org/scripts/391011/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/391011/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
var MD5 = function (string) {

    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
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
    };

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }

    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

    return temp.toLowerCase();
}
        class Translate {
        constructor(modalVis) {
            this.modalVis = modalVis;
        }

        init() {
            this.onMouseUp();
        }

        static getMousePos(event) {
            let e = event || window.event;
            return {'x': e.clientX, 'y': e.clientY};
        }

        modalVisible() {
            let {
                x,
                y
            } = Translate.getMousePos();

            let modal = `
            <div id='ZTYmodalZTY' style="position: fixed;top:${y}px; left: ${x}px;" class="modal">
                <svg t="1570686723718" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    p-id="3117" width="30" height="30">
            <path
                d="M606.009 648.032c-23.685 0-45.648-0.067-66.233-0.173-19.383 1.789-34.75-2.818-45.265-15.361-8.386-12.03-14.161-28.91-18.219-49.01 16.741-17.7 30.146-40.15 37.945-65.479 9.522-4.777 16.604-13.164 21.344-24.608 5.156-12.444 7.6-28.734 7.291-48.119l-0.173-6.119-5.058-3.407c-0.959-0.684-1.956-1.303-2.921-1.887 11.277-81.904 1.826-119.817-33.852-148.997-55.374-45.439-160.646-45.78-216.742-4.642-38.08 27.942-51.764 77.542-41.621 151.955-1.961 1.029-3.954 2.234-5.879 3.57l-5.051 3.443-0.104 6.082c-0.308 19.005 1.925 35.023 6.944 47.36 4.604 11.379 11.444 19.833 20.585 24.817 7.222 23.646 19.321 44.856 34.508 62.007-4.845 26.018-12.34 47.017-24.47 59.63-10.62 5.326-24.676 6.771-41.312 5.499-19.179-0.065-39.528-0.134-61.356-0.134-56.505 53.479-92.766 179.481-83.86 261.698 92.865 64.617 539.994 68.467 610.212 0C691.106 833.978 677.874 710.724 606.009 648.032L606.009 648.032 606.009 648.032zM883.654 517.939c49.971 43.582 59.185 129.307 60.25 179.486-25.914 25.261-125.729 36.36-223.271 34.541-16.189-48.326-41.038-92.661-78.505-125.353l-15.534-13.542-20.585 0c-22.001 0-44.033-0.028-65.961-0.173l-1.169 0c8.559-12.679 15.677-26.291 21.413-40.448 11.14-10.106 19.625-22.759 25.71-36.948 12.136 0 23.616 0.068 34.614 0.097 11.549 0.899 21.308-0.134 28.733-3.848 8.387-8.763 13.642-23.369 17.014-41.483-10.589-11.926-18.975-26.675-23.994-43.136-6.393-3.472-11.134-9.315-14.363-17.22-3.441-8.56-5.02-19.729-4.814-32.924l0.035-4.264 3.541-2.407c1.373-0.892 2.716-1.75 4.055-2.474-6.977-51.759 2.542-86.237 28.976-105.653 39.007-28.598 112.253-28.393 150.815 3.194 24.749 20.313 31.384 46.64 23.475 103.628 0.725 0.446 1.374 0.859 2.062 1.305l3.509 2.407 0.104 4.264c0.205 13.473-1.411 24.813-5.056 33.439-3.33 7.978-8.25 13.819-14.884 17.151-5.429 17.6-14.706 33.202-26.396 45.506 2.821 13.992 6.875 25.745 12.754 34.063 7.285 8.765 18.01 11.964 31.483 10.687C851.962 517.905 867.187 517.939 883.654 517.939L883.654 517.939zM574.8 178.151c-35.679-43.068-122.634-38.562-149.48 32.926l-30.586-1.548c29.417-158.788 201.751-181.062 269.98-76.16l52.448-26.092-27.393 67.372-27.358 67.366-70.256-18.802-70.251-18.802L574.8 178.151 574.8 178.151zM574.8 178.151"
                p-id="3118"/>
                </svg>
            </div>`;
            $("body").append(modal);
            this.modalVis = true;
            setTimeout(() => {
                this.removeModal();
            }, 1000);
        }

        removeModal() {
            $('#ZTYmodalZTY').remove();
            this.modalVis = false;
        }

        onMouseUp() {
            window.addEventListener('mouseup', (e) => {
                let text = window.getSelection().toString();
                if (!(text === '' || text === undefined || text === null)) {
                    if (!this.modalVis) {
                        this.modalVisible();
                        $('#ZTYmodalZTY').on('click', () => {
                            this.sendHttp(text, e);
                        });
                    }

                }
            });
        }

        sendHttp(text, e) {
            this.removeModal();
            let to = '';
            if (/.*[\u4e00-\u9fa5]+.*/.test(text)) {
                to = 'en';
            } else {
                to = 'zh';
            }
            let appid = '20191010000340320';
            let key = 'bR8rafbVyFEFHUsJJoot';
            let salt = (new Date).getTime();
            let query = text;
            let from = 'auto';
            let str1 = appid + query + salt + key;
            let sign = MD5(str1);
            $.ajax({
                url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
                type: 'get',
                dataType: 'jsonp',
                data: {
                    q: query,
                    appid: appid,
                    salt: salt,
                    from: from,
                    to: to,
                    sign: sign
                },
                success: (data) => {
                    this.whenSuccess(data, e);
                }
            });
        }

        whenSuccess(data, e) {
            let {x, y} = Translate.getMousePos(e);
            let content = `
                        <div id='ZTYcontentZTY' style='border:1px solid ;border-radius: 10px ;padding:5px 15px;background: #FFF;height:30px;position: fixed;top:${y}px ;left:${x}px'>
                        ${data.trans_result[0].dst}
                         </div>`;
            $('body').append(content);
            this.removeContent();
        }

        removeContent() {
            $('#ZTYcontentZTY').on('click', () => {
                $('#ZTYcontentZTY').remove();
            });
        }
    }

    let trans = new Translate(false);
    trans.init();
})();