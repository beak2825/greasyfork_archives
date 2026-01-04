// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://music.163.com/*
// @grant        GM_xmlhttpRequest
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393667/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/393667/New%20Userscript.meta.js
// ==/UserScript==
/*
 * GreasyFork不允许的库，直接代码贴进来
 */
(function () {
    let c = [];
//#g_player > div.head.j-flag > a
    //&encSecKey=70af33c020a8543f0028c8e83bb03794dbaf27fc991b7544cee6f309d41d5713548e8d8fb4859831f2ffe92320d07a15fb6a041887c297b1ffc4e5b04b9d1cbc07ee6271d7dd2dcbf1c0b742081d36b72f3118b00a5d720a9b82811b0cfce0efc6c1e57a0cef437a00406afa19768a5d6341773497675cdb3fe424eab374429e
    $("#content-operation").append("<button class='u-btni u-btni-share ' style='color: blue' id='myurl'>下载歌曲</button>");
    $("#myurl").click(function () {
        const id = getQueryString("id");
        encrypted_request(id);
        getMusicLink(c)
    });
    //   encText=str({'ids': "[" + str(id) + "]", 'br': 128000, 'csrf_token': ""})#i8a
    //获取get传值的方法
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    }

    //产生16位随机数
    function r(e) {
        var t, n, r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", o = "";
        for (t = 0; e > t; t += 1)
            n = Math.random() * r.length,
                n = Math.floor(n),
                o += r.charAt(n);
        return o
    }

    function o(e, t) {
        //aes 加密
        var n = CryptoJS.enc.Utf8.parse(t)
            , r = CryptoJS.enc.Utf8.parse("0102030405060708")
            , o = CryptoJS.enc.Utf8.parse(e);
        return CryptoJS.AES.encrypt(o, n, {
            iv: r,
            mode: CryptoJS.mode.CBC
        }).toString()
    }

    function i(e, t, n) {
        var r;
        setMaxDigits(256);
        r = new RSAKeyPair(t, "", n);
        let text = encryptedString(r, e)
        return text
    }
    function getMusicLink(c){
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://music.163.com/weapi/song/enhance/player/url?csrf_token=',
            headers: {
                'Accept':'*/*',
                'Accept-Encoding':'gzip, deflate',
                'Accept-Language':'zh-CN,zh;q=0.8',
                'Connection':'keep-alive',
                'Content-Type':'application/x-www-form-urlencoded',
                'Host':'music.163.com',
                'Origin':'http://music.163.com',
                'Referer':'http://music.163.com/',
                'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36',
                'Cookie': document.cookie + ';os=pc'
            },
            data: "params="+c.encText+"&encSecKey="+c.encSecKey,
            onreadystatechange: function(res) {
                if (res.readyState == 4) {
                    if (res.status == 200) {
                        var o=JSON.parse(res.response);
                        window.open(o.data[0].url, '_blank');

                    }
                }
            }
        });
    }
    // //const modulus = "00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7"
    // const nonce = "0CoJUm6Qyw8W8jud"
    // const pubKey = "010001"
    // const keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/"
    // const iv = "0102030405060708"
    var modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7' +
        'b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280' +
        '104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932' +
        '575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b' +
        '3ece0462db0a22b8e7';
    var nonce = '0CoJUm6Qyw8W8jud';
    var pubKey = '010001';

    function createSecretKey(size) {
        return (Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2)).substring(0, 16);
    }

    function aesEncrypt(text, secKey) {
        secKey = CryptoJS.enc.Utf8.parse(secKey);
        text = CryptoJS.enc.Utf8.parse(text);
        var encrypted = CryptoJS.AES.encrypt(text, secKey, {
            iv: CryptoJS.enc.Utf8.parse('0102030405060708'),
            mode: CryptoJS.mode.CBC
        });
        encrypted = encrypted.toString();
        return encrypted;
    }

    function rsaEncrypt(text, pubKey, modulus) {
        setMaxDigits(256);
        var keys = new RSAKeyPair(pubKey, "", modulus);
        var encText = encryptedString(keys, text);
        return encText;
    }

    function encrypted_request(text) {
        text = '{"ids": [' + text + '], "br": 320000, "csrf_token": ""}';
        var secKey = r(16);
        var encText = aesEncrypt(aesEncrypt(text, nonce), secKey);
        var encSecKey = rsaEncrypt(secKey, pubKey, modulus);
        // var data = 'params=' + encodeURIComponent(encText) + '&encSecKey=' + encodeURIComponent(encSecKey);
        return c.encText = encodeURIComponent(encText), c.encSecKey = encodeURIComponent(encSecKey);
    }
})();