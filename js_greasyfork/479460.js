// ==UserScript==
// @name              七猫全文在线免费读
// @namespace         https://github.com/ibxff
// @version           2.0.+n.3
// @description       七猫小说全文免费网页读 不用客户端 可下载小说
// @description:zh-cn 七猫小说全文免费网页读 不用客户端 可下载小说
// @description:en    Qimao Novel Reading, No Need for a Client, Novels Available for Download
// @author            ibxff
// @match             https://api-bc.wtzw.com/*
// @match             https://www.qimao.com/*
// @require           https://greasyfork.org/scripts/479459-cryptojs/code/CryptoJS-.js?version=1277994
// @require           https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @icon              data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBaRXhpZgAATU0AKgAAAAgABQMBAAUAAAABAAAASgMDAAEAAAABAAAAAFEQAAEAAAABAQAAAFERAAQAAAABAAAOw1ESAAQAAAABAAAOwwAAAAAAAYagAACxj//bAEMABwUFBgUEBwYFBggHBwgKEQsKCQkKFQ8QDBEYFRoZGBUYFxseJyEbHSUdFxgiLiIlKCkrLCsaIC8zLyoyJyorKv/bAEMBBwgICgkKFAsLFCocGBwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKv/AABEIAZACWAMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APpGiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKRmVRlmAHuarSalZw/fuEH0OayqVqdNXnJL1dilGUtkWqKzjr2mjrcj/vhv8ACj+39M/5+f8Axxv8K5f7SwX/AD+j/wCBL/M09hV/lf3GjRWd/b+mf8/P/jjf4Uf2/pn/AD8/+ON/hR/aWB/5/R/8CX+Yewq/yv7jRorO/t/TP+fn/wAcb/Cj+39M/wCfn/xxv8KP7SwP/P6P/gS/zD2FX+V/caNFZ39v6Z/z8/8Ajjf4Uf2/pn/Pz/443+FH9pYH/n9H/wACX+Yewq/yv7jRorO/t/TP+fn/AMcb/Cj+39M/5+f/ABxv8KP7SwP/AD+j/wCBL/MPYVf5X9xo0Vnf2/pn/Pz/AOON/hR/b+mf8/P/AI43+FH9pYH/AJ/R/wDAl/mHsKv8r+40aKzv7f0z/n5/8cb/AAo/t/TP+fn/AMcb/Cj+0sD/AM/o/wDgS/zD2FX+V/caNFZ39v6Z/wA/P/jjf4Uf2/pn/Pz/AOON/hR/aWB/5/R/8CX+Yewq/wAr+40aKzv7f0z/AJ+f/HG/wo/t/TP+fn/xxv8ACj+0sD/z+j/4Ev8AMPYVf5X9xo0Vnf2/pn/Pz/443+FH9v6Z/wA/P/jjf4Uf2lgf+f0f/Al/mHsKv8r+40aKzv7f0z/n5/8AHG/wo/t/TP8An5/8cb/Cj+0sD/z+j/4Ev8w9hV/lf3GjRWd/b+mf8/P/AI43+FH9v6Z/z8/+ON/hR/aWB/5/R/8AAl/mHsKv8r+40aKzv7f0z/n5/wDHG/wo/t/TP+fn/wAcb/Cj+0sD/wA/o/8AgS/zD2FX+V/caNFZ39v6Z/z8/wDjjf4Uf2/pn/Pz/wCON/hR/aWB/wCf0f8AwJf5h7Cr/K/uNGis7+39M/5+f/HG/wAKP7f0z/n5/wDHG/wo/tLA/wDP6P8A4Ev8w9hV/lf3GjRWd/b+mf8APz/443+FOXXNOf7tyP8Avk/4U1mOCbsq0f8AwJf5h7Cr/K/uL9FQx3dvL/q5kb8amrrjOM1eLuZNNbhRRRViCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKx9W11LPMVvh5u57LXJi8ZRwdJ1azsv62NKdOVWXLFGjdXsFnHunkC+g7mufvPE8j5WzTYP7zdaxJ7iW5kMkzlmPrUVfnOYcTYrENxw/uR/H7+nyPbo4CnDWerJ5r25uGJlmZs9s8VBRRXy86k6j5pu78z0FFRVkFFFFZjCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAFVipypIPqKu22sXlqRslLD0bmqNFb0cRWoS5qUmn5MiUIzVpK51dj4lhmIS6Xym9e1baOsihkYMD3Fec1f07Vp7BxtbdH3Q19llvFNSLVPGarut/meZXy9PWl9x3FFVrK+hv4RJC31XuKs1+gU6sKsFOm7pnjyi4uzCiiitCQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiqmpXq2Nm0p+90UeprKtVhRpupN2S1KjFykoooa7rH2RDb25/esOT/dFcmzFmJY5J6k06WVppWkkOWY5JplfjuaZlUzCu5y+FbLsv8z6bD0I0YWW4UUUV5J0BRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBZsr2WxuBJEfqPUV21leR31sssR69R6GuArS0XUTY3gDH905ww9PevqMgzeWDrKjUf7uX4Pv/mcGMwyqx5o7o7WigEEAjoaK/VT54KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArkvEd55975Kn5Ix+ZrqppPKgd/7qk15/NIZp3kP8TE18ZxZi3Tw8cPH7T19F/wT1Mup803N9COiiivzU9wKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooopgdnoF59q08Kxy8fymtSuS8M3Hl6gYu0i/yrra/X8hxbxWAhKW60fy/4B81jKfs6zS6hRRRXunIFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAFHWZPK0idh6AfrXDV2viH/kBz/8B/8AQhXFV+Z8XSbxsI/3f1Z72Wr9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RRQBm+If+QHP/wAB/wDQhXFV2viH/kBz/wDAf/QhXFV+Y8W/79H/AAr82e9l38F+v+QUUUV8gekFFFFABRRRQAUUUUAFFFFABRRRQAUUVm+Idat/D2hXOpXTAJChIB/iPYVcISqSUIq7Ym0ldnnXxp8cf2Tpn9hafJi6ul/esp5RfT6189E561oa9rFxr2t3Oo3blnmckZ7DsPyrPr9lynL44DDKkt936nzGIrOtUcugUUUV6pzhRRRQAUUUUAFFFFABRRRQAUUUUAFdF4H8LT+LfE0FjED5QIaZscKtc6AWYAck9K+nPhH4PHhvwul1cx4vb0b3yOVXsK8TO8xWAwrlH4nov8/kdWFoe2qWeyO40+wg0zT4bO0QJDCgVVHoKsUUV+Pyk5O73PpttAoooqQCiiigAooooAKKKKACiiigAooooAnsf+Qhb/8AXVf5ivQK8/sf+Qhb/wDXVf5ivQK/ReD/AODV9V+R4uZfFEKKKK+4PJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDN8Q/8gOf/gP/AKEK4qu18Q/8gOf/AID/AOhCuKr8x4t/36P+Ffmz3su/gv1/yCiiivkD0gooooAKKKKACiiigAooooAKKKKACvB/jt4sNxfReH7ST93F88+D1PYH6V7Rr2qw6JoV3qNwcJBGW/HtXx/q+pTavq9zf3LbpJ5C5NfY8K4D22IeJmtIbev/AADzMwrcsORdSnRRRX6YeEFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAdr8LPCx8S+MYBKmbW2Pmykjg46D8a+plVUUKgwqjAHoK88+DPhoaJ4OW8mTFxffvCcfw9q9Er8k4hx31vGuMX7sNF+p9HgqPs6V3uwooor507QooooAKKKKACiiigAooooAKKKKACiiigCex/5CFv/ANdV/mK9Arz+x/5CFv8A9dV/mK9Ar9F4P/g1fVfkeLmXxRCiiivuDyQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAzfEP/IDn/wCA/wDoQriq7XxD/wAgOf8A4D/6EK4qvzHi3/fo/wCFfmz3su/gv1/yCiiivkD0gooooAKKKKACiiigAooooAKKKKAPIfj14h+y6PbaNC+HuW8yTB/hHavAa7H4p65/bnjy9kRsxQt5SD0xwf1rjq/ZMkwn1XAwh1er9WfM4qp7Ss2FFFFeycoUUUUAFFFFABRRRQAUUUUAFFFFABWx4T0d9e8U2OnxjPmyjP0HJrHr134B6J9o1y71WVcpbpsQ+jf/AKq87M8V9UwdSt1S09ehtQp+0qqJ71a28dpaRW8K7Y4kCqPQCpaKK/FG23dn1QUUUUgCiiigAooooAKKKKACiiigAooooAKKKKAJ7H/kIW//AF1X+Yr0CvP7H/kIW/8A11X+Yr0Cv0Xg/wDg1fVfkeLmXxRCiiivuDyQooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAzfEP/IDn/4D/wChCuKrtfEP/IDn/wCA/wDoQriq/MeLf9+j/hX5s97Lv4L9f8gooor5A9IKKKKACiiigAooooAKKKKACszxJqC6X4av7xm2mOBip98cVp1558a9T+w+AJYFba9zIqj6A8124Gh9YxVOl3aMq0uSm5HzVcztdXUs8n35XLt9Sc1HRRX7ekkrI+UCiiimAUUUUAFFFFABRRRQAUUUUAFFFFABX038F9I/s3wBDMV2veOZW/lXzPBE01xHEgyzsABX2P4esl0/w5YWyDASBePcjNfGcW1+TDQpL7T/ACPUy2F6jl2NKiiivzU9wKKKKACiiigAooooAKKKKACiiigAooooAKKKKAJ7H/kIW/8A11X+Yr0CvP7H/kIW/wD11X+Yr0Cv0Xg/+DV9V+R4uZfFEKKKK+4PJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDN8Q/8gOf/AID/AOhCuKrtfEP/ACA5/wDgP/oQriq/MeLf9+j/AIV+bPey7+C/X/IKKKK+QPSCiiigAooooAKKKKACiiigArxT9oS+zDpdkDjDM7D14r2uvnf4+XPmeM7eAHKpbKfxya+j4ap8+ZQfZN/gcWOlagzyuiiiv1o+cCiiigAooooAKKKKACiiigAooooAKKKKANrwda/bfGWlwYyHuUz9M19gogjjVB0UACvlj4TWwuviLYqRnZl/yr6or824uqXxNOHZfmz3Mtj+7b8wooor4s9QKKKKACiiigAooooAKKKKACiiigAooooA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89p/zH+FH+rGZfyr70H1+h3OUorq/wDhFbT/AJ7T/mP8KP8AhFbT/ntP+Y/wo/1YzL+Vfeg+v0O5ylFdX/witp/z2n/Mf4Uf8Iraf89p/wAx/hR/qxmX8q+9B9fodzlKK6v/AIRW0/57T/mP8KP+EVtP+e0/5j/Cj/VjMv5V96D6/Q7nKUV1f/CK2n/Paf8AMf4Uf8Iraf8APaf8x/hR/qxmX8q+9B9fodzlKK6v/hFbT/ntP+Y/wo/4RW0/57T/AJj/AAo/1YzL+Vfeg+v0O5ylFdX/AMIraf8APaf8x/hR/wAIraf89p/zH+FH+rGZfyr70H1+h3OUorq/+EVtP+e0/wCY/wAKcvhezXrJK31I/wAKa4XzFvVL7xfX6ByVTQ2s9wwEMTP9BXZQ6JYQ8iAMfVqupGkYwiqo9hXp4fhGo3evUSXlqYTzKP2Ec3Y+GXYh71to/uLXQ29tFaxhIECqPSpaK+wwOV4XAr9zHXu9zzKuIqVn7zCiiivTMAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z
// @license           MIT
// @grant             GM_xmlhttpRequest
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/479460/%E4%B8%83%E7%8C%AB%E5%85%A8%E6%96%87%E5%9C%A8%E7%BA%BF%E5%85%8D%E8%B4%B9%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/479460/%E4%B8%83%E7%8C%AB%E5%85%A8%E6%96%87%E5%9C%A8%E7%BA%BF%E5%85%8D%E8%B4%B9%E8%AF%BB.meta.js
// ==/UserScript==



(function() {


    var rotateLeft = function(lValue, iShiftBits) {
    return(lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }

var addUnsigned = function(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if(lX4 & lY4) return(lResult ^ 0x80000000 ^ lX8 ^ lY8);
    if(lX4 | lY4) {
        if(lResult & 0x40000000) return(lResult ^ 0xC0000000 ^ lX8 ^ lY8);
        else return(lResult ^ 0x40000000 ^ lX8 ^ lY8);
    } else {
        return(lResult ^ lX8 ^ lY8);
    }
}

var F = function(x, y, z) {
    return(x & y) | ((~x) & z);
}

var G = function(x, y, z) {
    return(x & z) | (y & (~z));
}

var H = function(x, y, z) {
    return(x ^ y ^ z);
}

var I = function(x, y, z) {
    return(y ^ (x | (~z)));
}

var FF = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
};

var GG = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
};

var HH = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
};

var II = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
};

var convertToWordArray = function(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWordsTempOne = lMessageLength + 8;
    var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
    var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while(lByteCount < lMessageLength) {
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
};

var wordToHex = function(lValue) {
    var WordToHexValue = "",
        WordToHexValueTemp = "",
        lByte, lCount;
    for(lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValueTemp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
    }
    return WordToHexValue;
};

var uTF8Encode = function(string) {
    string = string.replace(/\x0d\x0a/g, "\x0a");
    var output = "";
    for(var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if(c < 128) {
            output += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            output += String.fromCharCode((c >> 6) | 192);
            output += String.fromCharCode((c & 63) | 128);
        } else {
            output += String.fromCharCode((c >> 12) | 224);
            output += String.fromCharCode(((c >> 6) & 63) | 128);
            output += String.fromCharCode((c & 63) | 128);
        }
    }
    return output;
};

function md5(string) {
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    string = uTF8Encode(string);
    x = convertToWordArray(string);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    for(k = 0; k < x.length; k += 16) {
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
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return tempValue.toLowerCase();
}






async function decode(response) {
    let $ = response
    let txt = CryptoJS.enc.Base64.parse($.data.content).toString()
    let iv = txt.slice(0,32)
    let _content = await decrypt(txt.slice(32),iv).trim()
        .replace(/\n/g,'<br>')
    return await _content;
}

const decrypt = function (data,iv) {
    let key = CryptoJS.enc.Hex.parse('32343263636238323330643730396531')
    iv = CryptoJS.enc.Hex.parse(iv)
    let HexStr = CryptoJS.enc.Hex.parse(data)
    let Base64Str = CryptoJS.enc.Base64.stringify(HexStr)
    let decrypted = CryptoJS.AES.decrypt(Base64Str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

async function novel(murl,func){

    // const matchb=murl.match(/\/(\d+)-(\d+)/)
    const matchb=murl.match(/https:\/\/www\.qimao\.com\/shuku\/([0-9_]+)-([0-9]+)\//)

    const toparams = obj => Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');

    const sign_key = 'd3dGiJc651gSQ8w1';

    const params = {
        id: matchb[1],
        chapterId: matchb[2]
    };
    const paramSign = md5(Object.keys(params).sort().reduce((pre, n) => pre + n + '=' + params[n], '') + sign_key);
    params['sign'] = paramSign;

    const headers={
        "app-version": "51110",
        "platform": "android",
        "reg": "0",
        "AUTHORIZATION": "",
        "application-id": "com.****.reader",
        "net-env": "1",
        "channel": "unknown",
        "qm-params": "",
    }

    const headersSign = md5(Object.keys(headers).sort().reduce((pre, n) => pre + n + '=' + headers[n], '') + sign_key);
    headers['sign'] = headersSign;


    const url = "https://api-ks.wtzw.com/api/v1/chapter/content?" + toparams(params)


    console.log(url,headers)
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: headers,
            onload: async function(response) {
                //console.log(response.responseText)
                const data = JSON.parse(response.responseText);
                const get = (await decode(data)).replace(/<br>/g, '\n');
                await func(get)
                resolve()
                return
            },
            ontimeout:async function(){
                return await func(murl,func=func)
            },
            onerror : async function(response){
                func('err')
                throw new Error(JSON.stringify(response))
                reject()
            }
        });
    })

}



const murl=window.location.href

const mode =
    ///^https:\/\/www\.qimao\.com\/shuku\/\d+-\d+\//.test(murl) ? 'reader' :
    /https:\/\/www\.qimao\.com\/shuku\/([0-9_]+)-([0-9]+)\//.test(murl) ? 'reader' :
    /https:\/\/www\.qimao\.com\/shuku\/([0-9_]+)\//.test(murl) ? 'page' : null;
    // /^https:\/\/www\.qimao\.com\/shuku\/\d+\//.test(murl) ? 'page' : null;


switch(mode){

    case 'reader':
        GM_addStyle(`
            .reader-fixed-left li.go-back[data-v-b5fc2672]{
                border-radius:5px!important;
                background-color:#f1e5af36!important;

            }
            .reader-layout-theme[data-theme=default] .reader-fixed-left li.reader-guide[data-v-b5fc2672]{
                margin-top:0px!important;
                background-color:#f1e5af36!important;
            }
            .reader-header-con{
                display: none!important;
            }
            #__layout div div.wrapper.reader.reader-layout-theme div.reader-header div.reader-header-con{
                display: none!important;
            }

            .qm-fixed-right-item click reader-phone{
                display: none!important;
            }
            .s-tit{
                display: none!important;
            }
            .chapter-tips > *{
                color: #66666647!important;
                text-align: left!important;
            }
            .chapter-title{
                text-align: left!important;
            }
            .chapter-detail-wrap-info{
                border-bottom: 1px solid #ddd!important;
            }
            .qm-fixed-right-link{
                width: fit-content!important;
            }
            .qm-fixed-right.type-3 .qm-fixed-right-link[data-v-754474f8]:before{
                width:8px!important;
            }
            .qm-fixed-right[data-v-754474f8]{
                left:51%!important;
            }
            .i-arrow {
                border-radius: 5px;
            }
            .reader-setting , .book-catalog{
                border-radius: 10px!important;
                outline: 2px solid #0000000a;
            }
            .reader-login-code{
                display: none!important;
            }
            .show-part[data-v-10da8d56]:after{
                display: none!important;
            }
            .chapter-detail-article p{
                font-size: 18px;
                text-indent: 2em;
                line-height: 1.8;
                padding: 13px 0;
                user-select: text;
            }
            .article{
                user-select: text;
            }
            body{
                user-select: text;
            }
        `)
        novel(murl,func=(get)=>{
            // console.log(get)
            if(get==='err')return
            document.getElementsByClassName('chapter-detail-article')[0].innerHTML=
                    '<p>'+get.replace(/\n/g, "</p><p>")+'</p>';

        })
    break;
    case 'page':
        //console.log('debug')
        async function startdownload(){
            GM_addStyle(`
                .tab-inner{
                    display: none!important
                }
            `)
            document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-body > div > div.qm-tab.type-2.normal > ul > li:nth-child(1) > div").click()
            await new Promise(resolve => setTimeout(resolve, 120));
            var content=
                '使用七猫全文在线免费读下载\n'+
                ['title','tags-wrap','sub-title','statistics-wrap','update-info','book-introduction-item']
                    .map(e => document.getElementsByClassName(e)[0].textContent+'\n')
                    .join()
                    .replace(/\n\s*(?!0\b)/g, '')
                    .replace(/,/g, '\n');
            for (const e of ['title','tags-wrap','sub-title','statistics-wrap','update-info','book-introduction-item']) {
                document.getElementsByClassName(e)[0].classList.add('succeed');
                await new Promise(resolve => setTimeout(resolve, 120));
            }
            document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-body > div > div.qm-tab.type-2.normal > ul > li:nth-child(2) > div").click()

            await new Promise(resolve => setTimeout(resolve, 120));

            const elements = document.getElementsByClassName('qm-book-catalog-list-content')[0].children;


            let a;
            let span;
            for (var i = 0; i < elements.length; i++) {
                a=elements[i].querySelector('a')
                span=a.querySelector('.txt')
                span.classList.add('processing')
                content+='\n\n'+span.innerText+'\n'
                await novel(a.href,func=(c)=>{
                    span.classList.remove('processing')
                    if(c==='err'){
                        span.classList.add('err')
                        content+='\n章节获取错误\n'
                    }
                    span.classList.add('succeed')
                    content+=c
                });
            }

            const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            saveAs(blob, document.getElementsByClassName('title')[0].querySelector('span').innerText+".txt");
        }

        GM_addStyle(`
            #__layout > div > div.wrapper > div > div > div > div.book-detail-header > div > div.book-information.clearfix.left > div.wrap-txt > div.btns-wrap.clearfix > div > div.qm-popper-title > span{
                display :none!important;
            }
            .err {
                background-color: pink;

            }

            .succeed {
                background-color: #D2F9D1;
                border-radius: 5px;
            }

            .processing {
                background-color: navajowhite;
                border-radius: 5px;
            }
            .qm-book-catalog-list-content li{
                line-height : normal!important;
                padding : 18px;
            }
            .qm-book-catalog-list-content li .txt{
                width: auto!important;
            }

            .qm-book-catalog-list-content li .vip-icon{
                float: right!important;
                margin-top: 0px!important;
            }

        `)
        const menu=document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-header > div > div.book-information.clearfix.left > div.wrap-txt > div.btns-wrap.clearfix")
        const copy=document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-header > div > div.book-information.clearfix.left > div.wrap-txt > div.btns-wrap.clearfix > a.qm-btn.item.inline-block.default.large.radius")
            // ?document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-header > div > div.book-information.clearfix.left > div.wrap-txt > div.btns-wrap.clearfix > a.qm-btn.item.inline-block.default.large.radius") :
            // document.querySelector("#__layout > div > div.wrapper > div > div > div > div.book-detail-header > div > div.book-information.clearfix.left > div.wrap-txt > div.btns-wrap.clearfix > a")
        const btn=copy.cloneNode(true);
        menu.insertBefore(btn, copy.nextSibling)
        btn.innerText='下载全本'
        btn.addEventListener('click',startdownload)



    break;

}


})()