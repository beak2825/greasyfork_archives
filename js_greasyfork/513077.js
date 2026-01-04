// ==UserScript==
// @name         百度贴吧图片解混淆助手
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  自动获取帖子原图，支持多种混淆算法，并一键保存图片。
// @author       你的名字
// @match        https://tieba.baidu.com/p/*
// @match        https://tieba.baidu.com/photo/p*
// @grant        GM_download
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/513077/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%A7%A3%E6%B7%B7%E6%B7%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/513077/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%A7%A3%E6%B7%B7%E6%B7%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/**
 * 此脚本的小番茄混淆代码来源于：https://xfqtphx.netlify.app/
 * 其他混淆算法实现来源于：https://www.axe.ink/blog/encrypt/
 */

let pic_list = {}
let isOriginalPicPage = false
let SIZE = 4294967296;
let first_config

function gilbert2d(width, height) {
    /**
     * Generalized Hilbert ('gilbert') space-filling curve for arbitrary-sized
     * 2D rectangular grids. Generates discrete 2D coordinates to fill a rectangle
     * of size (width x height).
     */
    const coordinates = [];

    if (width >= height) {
        generate2d(0, 0, width, 0, 0, height, coordinates);
    } else {
        generate2d(0, 0, 0, height, width, 0, coordinates);
    }

    return coordinates;
}

function generate2d(x, y, ax, ay, bx, by, coordinates) {
    const w = Math.abs(ax + ay);
    const h = Math.abs(bx + by);

    const dax = Math.sign(ax), day = Math.sign(ay); // unit major direction
    const dbx = Math.sign(bx), dby = Math.sign(by); // unit orthogonal direction

    if (h === 1) {
        // trivial row fill
        for (let i = 0; i < w; i++) {
            coordinates.push([x, y]);
            x += dax;
            y += day;
        }
        return;
    }

    if (w === 1) {
        // trivial column fill
        for (let i = 0; i < h; i++) {
            coordinates.push([x, y]);
            x += dbx;
            y += dby;
        }
        return;
    }

    let ax2 = Math.floor(ax / 2), ay2 = Math.floor(ay / 2);
    let bx2 = Math.floor(bx / 2), by2 = Math.floor(by / 2);

    const w2 = Math.abs(ax2 + ay2);
    const h2 = Math.abs(bx2 + by2);

    if (2 * w > 3 * h) {
        if ((w2 % 2) && (w > 2)) {
            // prefer even steps
            ax2 += dax;
            ay2 += day;
        }

        // long case: split in two parts only
        generate2d(x, y, ax2, ay2, bx, by, coordinates);
        generate2d(x + ax2, y + ay2, ax - ax2, ay - ay2, bx, by, coordinates);

    } else {
        if ((h2 % 2) && (h > 2)) {
            // prefer even steps
            bx2 += dbx;
            by2 += dby;
        }

        // standard case: one step up, one long horizontal, one step down
        generate2d(x, y, bx2, by2, ax2, ay2, coordinates);
        generate2d(x + bx2, y + by2, ax, ay, bx - bx2, by - by2, coordinates);
        generate2d(x + (ax - dax) + (bx2 - dbx), y + (ay - day) + (by2 - dby),
            -bx2, -by2, -(ax - ax2), -(ay - ay2), coordinates);
    }
}

function encryptTomato(img){
    const cvs = document.createElement("canvas")
    const width = cvs.width = img.naturalWidth
    const height = cvs.height = img.naturalHeight
    const ctx = cvs.getContext("2d")
    ctx.drawImage(img, 0, 0)
    const imgdata = ctx.getImageData(0, 0, width, height)
    const imgdata2 = new ImageData(width, height)
    const curve = gilbert2d(width, height)
    const offset = Math.round((Math.sqrt(5) - 1) / 2 * width * height)
    for(let i = 0; i < width * height; i++){
        const old_pos = curve[i]
        const new_pos = curve[(i + offset) % (width * height)]
        const old_p = 4 * (old_pos[0] + old_pos[1] * width)
        const new_p = 4 * (new_pos[0] + new_pos[1] * width)
        imgdata2.data.set(imgdata.data.slice(old_p, old_p + 4), new_p)
    }
    ctx.putImageData(imgdata2, 0, 0)
    cvs.toBlob(b => {
        URL.revokeObjectURL(img.src)
        img.src = URL.createObjectURL(b)
    }, "image/jpeg", 0.95)
    //})
}

function decryptTomato(img){
    const cvs = document.createElement("canvas")
    const width = cvs.width = img.naturalWidth
    const height = cvs.height = img.naturalHeight
    const ctx = cvs.getContext("2d")
    ctx.drawImage(img, 0, 0)
    const imgdata = ctx.getImageData(0, 0, width, height)
    const imgdata2 = new ImageData(width, height)
    const curve = gilbert2d(width, height)
    const offset = Math.round((Math.sqrt(5) - 1) / 2 * width * height)
    for(let i = 0; i < width * height; i++){
        const old_pos = curve[i]
        const new_pos = curve[(i + offset) % (width * height)]
        const old_p = 4 * (old_pos[0] + old_pos[1] * width)
        const new_p = 4 * (new_pos[0] + new_pos[1] * width)
        imgdata2.data.set(imgdata.data.slice(new_p, new_p + 4), old_p)
    }
    ctx.putImageData(imgdata2, 0, 0)
    cvs.toBlob(b => {
        URL.revokeObjectURL(img.src)
        img.src = URL.createObjectURL(b)
    }, "image/jpeg", 0.95)
    //})
}

var md5 = (function() {
    function MD5(string) {
        var x = Array();
        var k, AA, BB, CC, DD, a, b, c, d;
        var S11 = 7
          , S12 = 12
          , S13 = 17
          , S14 = 22;
        var S21 = 5
          , S22 = 9
          , S23 = 14
          , S24 = 20;
        var S31 = 4
          , S32 = 11
          , S33 = 16
          , S34 = 23;
        var S41 = 6
          , S42 = 10
          , S43 = 15
          , S44 = 21;
        string = Utf8Encode(string);
        x = ConvertToWordArray(string);
        a = 0x67452301;
        b = 0xEFCDAB89;
        c = 0x98BADCFE;
        d = 0x10325476;
        for (k = 0; k < x.length; k += 16) {
            AA = a;
            BB = b;
            CC = c;
            DD = d;
            a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
            d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
            c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
            b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
            a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
            d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
            c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
            b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
            a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
            d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
            c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
            b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
            a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
            d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
            c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
            b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
            a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
            d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
            c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
            b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
            a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
            d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
            c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
            b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
            a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
            d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
            c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
            b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
            a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
            d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
            c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
            b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
            a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
            d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
            c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
            b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
            a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
            d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
            c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
            b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
            a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
            d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
            c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
            b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
            a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
            d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
            c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
            b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
            a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
            d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
            c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
            b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
            a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
            d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
            c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
            b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
            a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
            d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
            c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
            b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
            a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
            d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
            c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
            b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
            a = AddUnsigned(a, AA);
            b = AddUnsigned(b, BB);
            c = AddUnsigned(c, CC);
            d = AddUnsigned(d, DD);
        }
        var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
        return temp.toUpperCase();
    }
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
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
    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    function H(x, y, z) {
        return (x ^ y ^ z);
    }
    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }
    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }
    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }
    function Utf8Encode(string) {
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
    return MD5
}())


//随机打乱
function amess(arrlength, ast) {
    var rand, temp;
    var arr = new Array(arrlength).fill(0).map( (a, b) => b);
    for (let i = arrlength - 1; i > 0; i -= 1) {
        rand = parseInt(md5(ast + i.toString()).substr(0, 7), 16) % (i + 1);
        temp = arr[rand];
        arr[rand] = arr[i]
        arr[i] = temp;
    }
    return arr;
}

//块混淆
function encryptB2(img1, key, sx, sy) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var wid1 = wid;
    var hit1 = hit;
    var imgdata;
    var oimgdata;
    var xl = new Array();
    var yl = new Array();
    var k = 8;
    var m = 0;
    var n = 0;
    var ssx;
    var ssy;
    //缩放大小
    if (wid * hit > SIZE) {
        wid = parseInt(Math.pow(SIZE * img1.width / img1.height, 1 / 2));
        hit = parseInt(Math.pow(SIZE * img1.height / img1.width, 1 / 2));
    }

    wid1 = wid;
    hit1 = hit;

    while (wid % sx > 0) {
        wid++
    }
    while (hit % sy > 0) {
        hit++
    }

    ssx = wid / sx;
    ssy = hit / sy;

    cv.width = wid;
    cv.height = hit;

    cvd.drawImage(img1, 0, 0, wid1, hit1);
    cvd.drawImage(img1, 0, hit1, wid1, hit1);
    cvd.drawImage(img1, wid1, 0, wid1, hit1);
    cvd.drawImage(img1, wid1, hit1, wid1, hit1);

    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);

    xl = amess(sx, key);
    yl = amess(sy, key);

    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            m = i;
            n = j;
            m = (xl[((n / ssy) | 0) % sx] * ssx + m) % wid;
            m = xl[(m / ssx) | 0] * ssx + m % ssx;
            n = (yl[((m / ssx) | 0) % sy] * ssy + n) % hit;
            n = yl[(n / ssy) | 0] * ssy + n % ssy;

            oimgdata.data[4 * (i + j * wid)] = imgdata.data[4 * (m + n * wid)];
            oimgdata.data[4 * (i + j * wid) + 1] = imgdata.data[4 * (m + n * wid) + 1];
            oimgdata.data[4 * (i + j * wid) + 2] = imgdata.data[4 * (m + n * wid) + 2];
            oimgdata.data[4 * (i + j * wid) + 3] = imgdata.data[4 * (m + n * wid) + 3];
        }
    }
    cvd.putImageData(oimgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

function decryptB2(img1, key, sx, sy) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var wid1 = wid;
    var hit1 = hit;
    var imgdata;
    var oimgdata;
    var xl = new Array();
    var yl = new Array();
    var k = 8;
    var m = 0;
    var n = 0;
    var ssx;
    var ssy;

    wid1 = wid;
    hit1 = hit;

    while (wid % sx > 0) {
        wid++
    }
    while (hit % sy > 0) {
        hit++
    }

    ssx = wid / sx;
    ssy = hit / sy;

    cv.width = wid;
    cv.height = hit;

    cvd.drawImage(img1, 0, 0, wid1, hit1);
    cvd.drawImage(img1, 0, hit1, wid1, hit1);
    cvd.drawImage(img1, wid1, 0, wid1, hit1);
    cvd.drawImage(img1, wid1, hit1, wid1, hit1);

    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);

    xl = amess(sx, key);
    yl = amess(sy, key);

    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            m = i;
            n = j;
            m = (xl[((n / ssy) | 0) % sx] * ssx + m) % wid;
            m = xl[(m / ssx) | 0] * ssx + m % ssx;
            n = (yl[((m / ssx) | 0) % sy] * ssy + n) % hit;
            n = yl[(n / ssy) | 0] * ssy + n % ssy;

            oimgdata.data[4 * (m + n * wid)] = imgdata.data[4 * (i + j * wid)];
            oimgdata.data[4 * (m + n * wid) + 1] = imgdata.data[4 * (i + j * wid) + 1];
            oimgdata.data[4 * (m + n * wid) + 2] = imgdata.data[4 * (i + j * wid) + 2];
            oimgdata.data[4 * (m + n * wid) + 3] = imgdata.data[4 * (i + j * wid) + 3];
        }
    }
    cvd.putImageData(oimgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

//算法C,逐像素混淆
function encryptC(img1, key) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var imgdata;
    var oimgdata;
    var xl = new Array();
    var yl = new Array();
    var m = 0;
    var n = 0;

    //缩放大小
    if (wid * hit > SIZE) {
        wid = parseInt(Math.pow(SIZE * img1.width / img1.height, 1 / 2));
        hit = parseInt(Math.pow(SIZE * img1.height / img1.width, 1 / 2));
    }

    cv.width = wid;
    cv.height = hit;
    cvd.drawImage(img1, 0, 0, wid, hit);
    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);

    xl = amess(wid, key);
    yl = amess(hit, key);

    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            m = i;
            n = j;
            m = (xl[n % wid] + m) % wid;
            m = xl[m];
            n = (yl[m % hit] + n) % hit;
            n = yl[n];

            oimgdata.data[4 * (i + j * wid)] = imgdata.data[4 * (m + n * wid)];
            oimgdata.data[4 * (i + j * wid) + 1] = imgdata.data[4 * (m + n * wid) + 1];
            oimgdata.data[4 * (i + j * wid) + 2] = imgdata.data[4 * (m + n * wid) + 2];
            oimgdata.data[4 * (i + j * wid) + 3] = imgdata.data[4 * (m + n * wid) + 3];
        }
    }
    cvd.putImageData(oimgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

function decryptC(img1, key) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var imgdata;
    var oimgdata;
    var xl = new Array();
    var yl = new Array();
    var m = 0;
    var n = 0;

    cv.width = wid;
    cv.height = hit;
    cvd.drawImage(img1, 0, 0, wid, hit);
    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);

    xl = amess(wid, key);
    yl = amess(hit, key);

    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            m = i;
            n = j;
            m = (xl[n % wid] + m) % wid;
            m = xl[m];
            n = (yl[m % hit] + n) % hit;
            n = yl[n];

            oimgdata.data[4 * (m + n * wid)] = imgdata.data[4 * (i + j * wid)];
            oimgdata.data[4 * (m + n * wid) + 1] = imgdata.data[4 * (i + j * wid) + 1];
            oimgdata.data[4 * (m + n * wid) + 2] = imgdata.data[4 * (i + j * wid) + 2];
            oimgdata.data[4 * (m + n * wid) + 3] = imgdata.data[4 * (i + j * wid) + 3];
        }
    }
    cvd.putImageData(oimgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

//行像素混淆
function encryptC2(img1, key) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var imgdata;
    var oimgdata;
    var xl = new Array();
    var yl = new Array();
    var m = 0;
    var n = 0;

    //缩放大小
    if (wid * hit > SIZE) {
        wid = parseInt(Math.pow(SIZE * img1.width / img1.height, 1 / 2));
        hit = parseInt(Math.pow(SIZE * img1.height / img1.width, 1 / 2));
    }

    cv.width = wid;
    cv.height = hit;
    cvd.drawImage(img1, 0, 0, wid, hit);
    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);

    xl = amess(wid, key);
    yl = amess(hit, key);

    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            m = i;
            n = j;
            m = (xl[n % wid] + m) % wid;
            m = xl[m];

            oimgdata.data[4 * (i + j * wid)] = imgdata.data[4 * (m + n * wid)];
            oimgdata.data[4 * (i + j * wid) + 1] = imgdata.data[4 * (m + n * wid) + 1];
            oimgdata.data[4 * (i + j * wid) + 2] = imgdata.data[4 * (m + n * wid) + 2];
            oimgdata.data[4 * (i + j * wid) + 3] = imgdata.data[4 * (m + n * wid) + 3];
        }
    }
    cvd.putImageData(oimgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

function decryptC2(img1, key) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var imgdata;
    var oimgdata;
    var xl = new Array();
    var yl = new Array();
    var m = 0;
    var n = 0;

    cv.width = wid;
    cv.height = hit;
    cvd.drawImage(img1, 0, 0, wid, hit);
    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);

    xl = amess(wid, key);
    yl = amess(hit, key);

    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            m = i;
            n = j;
            m = (xl[n % wid] + m) % wid;
            m = xl[m];

            oimgdata.data[4 * (m + n * wid)] = imgdata.data[4 * (i + j * wid)];
            oimgdata.data[4 * (m + n * wid) + 1] = imgdata.data[4 * (i + j * wid) + 1];
            oimgdata.data[4 * (m + n * wid) + 2] = imgdata.data[4 * (i + j * wid) + 2];
            oimgdata.data[4 * (m + n * wid) + 3] = imgdata.data[4 * (i + j * wid) + 3];
        }
    }
    cvd.putImageData(oimgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

//picencrypt算法
function produceLogisticSort(a, b) {
    return a[0] - b[0]
}

function produceLogistic(x1, n) {
    let l = new Array(n);
    let x = x1;
    l[0] = [x, 0];
    for (let i = 1; i < n; i++) {
        x = 3.9999999 * x * (1 - x);
        l[i] = [x, i]
    }
    return l
}

//行混淆
function encryptPE1(img1, key) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var imgdata;
    var oimgdata;
    var arrayaddress = new Array();
    var m = 0;
    var n = 0;

    //缩放大小
    if (wid * hit > SIZE) {
        wid = parseInt(Math.pow(SIZE * img1.width / img1.height, 1 / 2));
        hit = parseInt(Math.pow(SIZE * img1.height / img1.width, 1 / 2));
    }

    cv.width = wid;
    cv.height = hit;
    cvd.drawImage(img1, 0, 0, wid, hit);
    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);

    arrayaddress = produceLogistic(key, wid).sort(produceLogisticSort).map(x => x[1]);

    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            m = arrayaddress[i];

            oimgdata.data[4 * (i + j * wid)] = imgdata.data[4 * (m + j * wid)];
            oimgdata.data[4 * (i + j * wid) + 1] = imgdata.data[4 * (m + j * wid) + 1];
            oimgdata.data[4 * (i + j * wid) + 2] = imgdata.data[4 * (m + j * wid) + 2];
            oimgdata.data[4 * (i + j * wid) + 3] = imgdata.data[4 * (m + j * wid) + 3];
        }
    }
    cvd.putImageData(oimgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

function decryptPE1(img1, key) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var imgdata;
    var oimgdata;
    var arrayaddress = new Array();
    var m = 0;
    var n = 0;

    cv.width = wid;
    cv.height = hit;
    cvd.drawImage(img1, 0, 0, wid, hit);
    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);

    arrayaddress = produceLogistic(key, wid).sort(produceLogisticSort).map(x => x[1]);

    for (let i = 0; i < wid; i++) {
        for (let j = 0; j < hit; j++) {
            m = arrayaddress[i];

            oimgdata.data[4 * (m + j * wid)] = imgdata.data[4 * (i + j * wid)];
            oimgdata.data[4 * (m + j * wid) + 1] = imgdata.data[4 * (i + j * wid) + 1];
            oimgdata.data[4 * (m + j * wid) + 2] = imgdata.data[4 * (i + j * wid) + 2];
            oimgdata.data[4 * (m + j * wid) + 3] = imgdata.data[4 * (i + j * wid) + 3];
        }
    }
    cvd.putImageData(oimgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

//行+列混淆
function encryptPE2(img1, key) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var imgdata;
    var oimgdata;
    var o2imgdata;
    var arrayaddress = new Array();
    var x = key;
    var m = 0;
    var n = 0;

    if (wid * hit > SIZE) {
        wid = parseInt(Math.pow(SIZE * img1.width / img1.height, 1 / 2));
        hit = parseInt(Math.pow(SIZE * img1.height / img1.width, 1 / 2));
    }

    cv.width = wid;
    cv.height = hit;
    cvd.drawImage(img1, 0, 0, wid, hit);
    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);
    o2imgdata = cvd.createImageData(wid, hit);

    for (let j = 0; j < hit; j++) {
        arrayaddress = produceLogistic(x, wid);
        x = arrayaddress[wid - 1][0];
        arrayaddress = arrayaddress.sort(produceLogisticSort).map(a => a[1])
        for (let i = 0; i < wid; i++) {
            m = arrayaddress[i];

            oimgdata.data[4 * (i + j * wid)] = imgdata.data[4 * (m + j * wid)];
            oimgdata.data[4 * (i + j * wid) + 1] = imgdata.data[4 * (m + j * wid) + 1];
            oimgdata.data[4 * (i + j * wid) + 2] = imgdata.data[4 * (m + j * wid) + 2];
            oimgdata.data[4 * (i + j * wid) + 3] = imgdata.data[4 * (m + j * wid) + 3];
        }
    }

    x = key;
    for (let i = 0; i < wid; i++) {
        arrayaddress = produceLogistic(x, hit);
        x = arrayaddress[hit - 1][0];
        arrayaddress = arrayaddress.sort(produceLogisticSort).map(a => a[1])
        for (let j = 0; j < hit; j++) {
            n = arrayaddress[j];

            o2imgdata.data[4 * (i + j * wid)] = oimgdata.data[4 * (i + n * wid)];
            o2imgdata.data[4 * (i + j * wid) + 1] = oimgdata.data[4 * (i + n * wid) + 1];
            o2imgdata.data[4 * (i + j * wid) + 2] = oimgdata.data[4 * (i + n * wid) + 2];
            o2imgdata.data[4 * (i + j * wid) + 3] = oimgdata.data[4 * (i + n * wid) + 3];
        }
    }

    cvd.putImageData(o2imgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

function decryptPE2(img1, key) {
    var cv = document.createElement("canvas");
    var cvd = cv.getContext("2d");
    var wid = img1.naturalWidth;
    var hit = img1.naturalHeight;
    var imgdata;
    var oimgdata;
    var o2imgdata;
    var arrayaddress = new Array();
    var x = key;
    var m = 0;
    var n = 0;

    cv.width = wid;
    cv.height = hit;
    cvd.drawImage(img1, 0, 0, wid, hit);
    imgdata = cvd.getImageData(0, 0, wid, hit);
    oimgdata = cvd.createImageData(wid, hit);
    o2imgdata = cvd.createImageData(wid, hit);

    for (let i = 0; i < wid; i++) {
        arrayaddress = produceLogistic(x, hit);
        x = arrayaddress[hit - 1][0];
        arrayaddress = arrayaddress.sort(produceLogisticSort).map(a => a[1])
        for (let j = 0; j < hit; j++) {
            n = arrayaddress[j];

            oimgdata.data[4 * (i + n * wid)] = imgdata.data[4 * (i + j * wid)];
            oimgdata.data[4 * (i + n * wid) + 1] = imgdata.data[4 * (i + j * wid) + 1];
            oimgdata.data[4 * (i + n * wid) + 2] = imgdata.data[4 * (i + j * wid) + 2];
            oimgdata.data[4 * (i + n * wid) + 3] = imgdata.data[4 * (i + j * wid) + 3];
        }
    }
    x = key;
    for (let j = 0; j < hit; j++) {
        arrayaddress = produceLogistic(x, wid);
        x = arrayaddress[wid - 1][0];
        arrayaddress = arrayaddress.sort(produceLogisticSort).map(a => a[1])
        for (let i = 0; i < wid; i++) {
            m = arrayaddress[i];

            o2imgdata.data[4 * (m + j * wid)] = oimgdata.data[4 * (i + j * wid)];
            o2imgdata.data[4 * (m + j * wid) + 1] = oimgdata.data[4 * (i + j * wid) + 1];
            o2imgdata.data[4 * (m + j * wid) + 2] = oimgdata.data[4 * (i + j * wid) + 2];
            o2imgdata.data[4 * (m + j * wid) + 3] = oimgdata.data[4 * (i + j * wid) + 3];
        }
    }

    cvd.putImageData(o2imgdata, 0, 0);
    return [cv.toDataURL(), wid, hit]
}

function selectMethod(event) {
    let select = event.target
    let keyInput = select.parentNode.querySelector('.key-input')
    keyInput.style.display = select.value == 'tomato' ? 'none' : ''
    if (!keyInput.value) {
        keyInput.value = '0.666'
    }
}

function resizeImage(img) {
    if (img.width < img.naturalWidth) {
        img.height = img.naturalHeight * img.width / img.naturalWidth
    } else if (img.height < img.naturalHeight) {
        img.width = img.naturalWidth * img.height / img.naturalHeight
    }
}

function pickImage(event) {
    if (event.target.files.length <= 0) {
        return
    }
    let container = event.target.parentNode
    let img = isOriginalPicPage ? document.querySelector('.image_original_original') : container.nextSibling
    if (!img) {
        return
    }
    let url = URL.createObjectURL(event.target.files[0])
    img.src = url

    if (!isOriginalPicPage) {
        img.onload = ()=>resizeImage(img)
        return
    }
}

function encrypt(event) {
    let container = event.target.parentNode
    let img = isOriginalPicPage ? document.querySelector('.image_original_original') : container.nextSibling
    if (!img) {
        return
    }
    container.setAttribute('activated', 'true')
    let select = container.querySelector('.method-select')
    let msg = container.querySelector('.msg')
    let key = container.querySelector('.key-input').value
    if (!first_config) {
        first_config = {method: select.value, key: key}
        document.querySelectorAll('.method-select').forEach(e=>{
            let container = e.parentNode
            if (container.getAttribute('activated') == 'true') {
                return
            }
            e.value = select.value
            if (select.value != 'tomato') {
                let keyInput = container.querySelector('.key-input')
                keyInput.value = key
                keyInput.style.display = ''
            }
        })
    }
    let delay = 0
    if (!img.crossOrigin) {
        img.crossOrigin = 'anonymous'
        delay = 100
    }
    setTimeout(()=>{
        img.style.display = 'none'
        msg.style.display = ''
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                switch (select.value) {
                    case 'tomato':
                        encryptTomato(img)
                        break
                    case 'b':
                        img.src = encryptB2(img, key, 32, 32)[0]
                        break
                    case 'c2':
                        img.src = encryptC2(img, key)[0]
                        break
                    case 'c':
                        img.src = encryptC(img, key)[0]
                        break
                    case 'pe1':
                        img.src = encryptPE1(img, key)[0]
                        break
                    case 'pe2':
                        img.src = encryptPE2(img, key)[0]
                        break
                }
                resizeImage(img)
                img.style.display = 'inline-block'
                msg.style.display = 'none'
            })
        })
    }, delay)
}

function decrypt(event) {
    let container = event.target.parentNode
    let img = isOriginalPicPage ? document.querySelector('.image_original_original') : container.nextSibling
    if (!img) {
        return
    }
    container.setAttribute('activated', 'true')
    let select = container.querySelector('.method-select')
    let msg = container.querySelector('.msg')
    let key = container.querySelector('.key-input').value
    if (!first_config) {
        first_config = {method: select.value, key: key}
        document.querySelectorAll('.method-select').forEach(e=>{
            let container = e.parentNode
            if (container.getAttribute('activated') == 'true') {
                return
            }
            e.value = select.value
            if (select.value != 'tomato') {
                let keyInput = container.querySelector('.key-input')
                keyInput.value = key
                keyInput.style.display = ''
            }
        })
    }
    let delay = 0
    if (!img.crossOrigin) {
        img.crossOrigin = 'anonymous'
        delay = 100
    }
    setTimeout(()=>{
        img.style.display = 'none'
        msg.style.display = ''
        requestAnimationFrame(()=>{
            requestAnimationFrame(()=>{
                switch (select.value) {
                    case 'tomato':
                        decryptTomato(img)
                        break
                    case 'b':
                        img.src = decryptB2(img, key, 32, 32)[0]
                        break
                    case 'c2':
                        img.src = decryptC2(img, key)[0]
                        break
                    case 'c':
                        img.src = decryptC(img, key)[0]
                        break
                    case 'pe1':
                        img.src = decryptPE1(img, key)[0]
                        break
                    case 'pe2':
                        img.src = decryptPE2(img, key)[0]
                        break
                }
                resizeImage(img)
                img.style.display = 'inline-block'
                msg.style.display = 'none'
            })
        })
    }, delay)
}

function restore(event) {
    let container = event.target.parentNode
    let img = isOriginalPicPage ? document.querySelector('.image_original_original') : container.nextSibling
    if (!img) {
        return
    }
    if (isOriginalPicPage) {
        img.src = img.getAttribute('origin_url')
        img.width = img.naturalWidth
        img.height = img.naturalHeight
    } else {
        let id = img.getAttribute('pic_id')
        img.src = pic_list[id].url
        img.width = pic_list[id].width
        img.height = pic_list[id].height
    }
    resizeImage(img)
}

function download(event) {
    let container = event.target.parentNode
    let img = isOriginalPicPage ? document.querySelector('.image_original_original') : container.nextSibling
    if (!img) {
        return
    }
    let image = new Image();
    image.src = img.src;
    image.setAttribute("crossOrigin", "anonymous");

    image.onload = function() {
        let a = document.createElement("a");
        a.download = Date.now() + ".png"
        if (img.src.startsWith('blob:') || img.src.startsWith('data:')) {
            a.href = image.src
        } else {
            let canvas = document.createElement("canvas");
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            canvas.getContext("2d").drawImage(image, 0, 0, image.width, image.height);
            a.href = canvas.toDataURL("image/png");
        }
        a.click();
    }
}

// 添加用户界面
function addButton(img) {
    img.crossOrigin = 'anonymous'
    let container = document.createElement('div')
    container.style.marginTop = '0.5rem'
    container.style.textAlign = 'center'
    container.innerHTML = `
        <select class="method-select">
            <option value="tomato">🍅小番茄图片混淆</option>
            <option value="b">方块混淆</option>
            <option value="c2">行像素混淆</option>
            <option value="c">逐像素混淆</option>
            <option value="pe1">兼容PicEncrypt: 行模式</option>
            <option value="pe2">兼容PicEncrypt: 行+列模式</option>
        </select>
        <input class="key-input" type="text" placeholder="输入密钥" style="display: ${first_config && first_config.method != 'tomato' ? 'inline' : 'none'};">
        <br>
        <input class="pick-image" type="file" accept="image/*" style="display:none;">
        <input class="normal-btn pick-image-btn" type="button" value="选择图片" style="background-color: #28538F;color:#fff;">
        <input class="normal-btn encrypt" type="button" value="混淆" style="background-color: #4f1787;color:#fff;">
        <input class="normal-btn decrypt" type="button" value="解混淆" style="background-color: #eb3678;color:#fff;">
        <input class="normal-btn restore" type="button" value="还原" style="background-color: #fb773c;color:#fff;">
        <input class="normal-btn download" type="button" value="保存" style="background-color: #3385ff;color:#fff;">
        <p class="msg" style="display: none;">正在处理图片...</p>
    `

    let styleHTML = `
    <style>
        .normal-btn, .method-select, .key-input, .pick-image {
            float: center;
            min-width: 5.2rem;
            height: 3rem;
            line-height: 3rem;
            font-size: 1.6rem;
            padding: 0 0.5rem;
            margin: 0.5rem 0.6rem;
            border-radius: 6px;
            display: inline-block;
            position: relative;
            vertical-align: middle;
            text-align: center;
        }

        .normal-btn {
            border: 0;
        }

        .pick-image-btn {
            width: 7rem;
        }

        .normal-btn:hover {
            font-size: 1.7rem;
        }

        .method-select, .key-input {
            border: 1px solid #888;
            color: #000;
            width: 200px;
        }

        .normal-btn:hover, .method-select:hover {
            cursor: pointer;
        }

        .key-input:hover {
            cursor: text;
        }

        .msg {
            margin: 1.5rem;
            color: ${isOriginalPicPage ? '#fff' : '#000'};
            font-size: 2.5rem;
        }
    </style>
    `
    document.querySelector('head').innerHTML += styleHTML

    if (isOriginalPicPage) {
        let div = document.querySelector('.af_reply_container #af_reply_editor')
        if (!div) {
            return
        }
        div.parentNode.insertBefore(container, div)
    } else {
        let pic_id = img.getAttribute('pic_id')
        img.src = pic_list[pic_id].url
        img.parentNode.insertBefore(container, img)
    }
    if (first_config) {
        container.querySelector('select').value = first_config.method
        if (first_config.method != 'tomato') {
            let keyInput = container.querySelector('.key-input')
            keyInput.value = first_config.key
            keyInput.style.display = ''
        }
    }
    let pickImageInput = container.querySelector('.pick-image')
    container.querySelector('.pick-image-btn').onclick = ()=>pickImageInput.click()
    container.querySelector('.pick-image').onchange = pickImage
    container.querySelector('select').onchange = selectMethod
    container.querySelector('.encrypt').onclick = encrypt
    container.querySelector('.decrypt').onclick = decrypt
    container.querySelector('.restore').onclick = restore
    container.querySelector('.download').onclick = download
}

// 获取某个帖子中某一页的所有原图链接
function loadPicList(tid) {
    let kw = (document.querySelector('.card_head a') || location).href.match(/kw=[%A-F0-9]+&/g)
    if (kw == null)
        return
    kw = kw[0].substring(3, kw[0].length-1)

    document.querySelectorAll('.BDE_Image').forEach(img=>{
        if (img.parentNode.querySelector('.method-select')) {
            return
        }
        let pic_id = img.src.match(/\/[a-f0-9]*\.jpg/g)
        if (pic_id == null) {
            return
        }
        pic_id = pic_id[0].substring(1, pic_id[0].length-4)
        img.setAttribute('pic_id', pic_id)

        let guideUrl = `https://tieba.baidu.com/photo/bw/picture/guide?kw=${kw}&tid=${tid}&alt=jview&see_lz=0&pic_id=${pic_id}`
        let xhr = new XMLHttpRequest()
        xhr.open('GET', guideUrl, true)
        xhr.onreadystatechange = ()=>{
            if (xhr.readyState != 4 || xhr.status != 200) {
                return
            }
            let response = JSON.parse(xhr.response)
            Object.values(response.data.pic_list).forEach(imgSrc=>{
                let original = imgSrc.img.original
                pic_list[original.id] = {'url': original.url || original.waterurl, 'width': original.width, 'height': original.height}
            })

            guideUrl = `https://tieba.baidu.com/photo/bw/picture/guide?kw=${kw}&tid=${tid}&alt=jview&see_lz=1&pic_id=${pic_id}`
            xhr.open('GET', guideUrl, true)
            xhr.onreadystatechange = ()=>{
                if (xhr.readyState != 4 || xhr.status != 200) {
                    return
                }
                let response = JSON.parse(xhr.response)
                Object.values(response.data.pic_list).forEach(imgSrc=>{
                    let original = imgSrc.img.original
                    pic_list[original.id] = {'url': original.url || original.waterurl, 'width': original.width, 'height': original.height}
                })
                addButton(img)
            }
            xhr.send()
        }
        xhr.send()
    })
}

function main() {
    let tid = location.href.match(/tieba\.baidu\.com\/p\/\d+/g)
    isOriginalPicPage = false
    if (tid == null) {
        if (location.href.match(/tieba\.baidu\.com\/photo\/p\?/g) == null) {
            return
        } else {
            tid = new URLSearchParams(location.href.split('?')[1]).get('tid')
            if (tid == null) {
                return
            }
        }
        isOriginalPicPage = true
    } else {
        tid = tid[0].substr(18)
    }

    // 查看原图的页面
    if (isOriginalPicPage) {
        let id = setInterval(()=>{
            let img = document.querySelector('.image_original_original')
            let div = document.querySelector('.af_reply_container #af_reply_editor')
            if (!img || !div) {
                return
            }
            clearInterval(id)
            addButton(img)

            function onImageChanged() {
                setTimeout(()=>{
                    let img = document.querySelector('.image_original_original')
                    if (!img.src.startsWith('blob:') && !img.src.startsWith('data:')) {
                        img.setAttribute('origin_url', img.src)
                    }
                }, 80)
            }

            window.onclick = onImageChanged
            window.onkeypress = (event)=>{
                if (event.keyCode == 37 || event.keyCode == 39) {
                    onImageChanged()
                }
            }
            img.parentNode.onmousewheel = onImageChanged

            setInterval(()=>{
                let img = document.querySelector('.image_original_original')
                if (!img || img.classList.contains('ui-draggable')) {
                    return
                }
                if (Math.abs(img.width / img.naturalWidth - img.height / img.naturalHeight) < 0.05 && Math.abs(img.width - img.naturalWidth) / img.naturalWidth < 0.05) {
                    return
                }
                let width = img.naturalWidth
                let height = img.naturalHeight
                let imgParent = img.parentNode
                if (width > imgParent.clientWidth) {
                    width = imgParent.clientWidth
                    height = height * width / img.naturalWidth
                }
                if (height > imgParent.clientHeight) {
                    width = width * imgParent.clientHeight / height
                    height = imgParent.clientHeight
                }
                img.style.width = width + 'px'
                img.style.height = height + 'px'
                img.style.left = (imgParent.clientWidth - width) / 2 + 'px'
                img.style.top = (imgParent.clientHeight - height) / 2 + 'px'
            }, 1000)
        }, 500)
    } else {  // 具体某个帖子的页面
        loadPicList(tid)
        setInterval(()=>{
            loadPicList(tid)
        }, 1000)
    }
}

main()