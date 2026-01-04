// ==UserScript==
// @name         其他依赖
// @version      1.8
// @namespace    Me
// @description  其他依赖内容
// @author       loveLife
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_info
// ==/UserScript==

$("body").append('<style>'+GM_getResourceText('ElementUiCss')+'</style>')
    function convertObj(data) {
        var _result = [];
        for (var key in data) {
            var value = data[key];
            if (value.constructor == Array) {
                value.forEach(function(_value) {
                    _result.push(key + "=" + _value);
                });
            } else {
                _result.push(key + '=' + value);
            }
        }
        return _result.join('&');
    }

    function getJson(url) {
        var arr = url.split('?')[1].split('&')
        var theRequest = new Object();
        for (var i = 0; i < arr.length; i++) {
            var kye = arr[i].split("=")[0]
            var value = arr[i].split("=")[1]
            theRequest[kye] = value
        }
        return theRequest;
    }

    function getGroup(data, index = 0, group = []) {
        var need_apply = new Array();
        need_apply.push(data[index]);
        for (var i = 0; i < group.length; i++) {
            need_apply.push(group[i] + data[index]);
        }
        group.push.apply(group, need_apply);
        if (index + 1 >= data.length) return group;
        else return getGroup(data, index + 1, group);
    }


    unsafeWindow.encryptByDES=(message, key)=>{
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString();
    }
    unsafeWindow.decryptByDES=(ciphertext, key)=>{
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var result_value = decrypted.toString(CryptoJS.enc.Utf8);
        return result_value;
    }



