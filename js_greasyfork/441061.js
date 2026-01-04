// ==UserScript==
// @name         rpaDomScript
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  a private script for dom selector
// @author       You
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.2.1/jsencrypt.min.js
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441061/rpaDomScript.user.js
// @updateURL https://update.greasyfork.org/scripts/441061/rpaDomScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 123
    main();
})();
// å¥å£æä»¶
function main() {
    window.onload = ()=> {
        let token = hasToken();
        if(!token) return;
        isHost(token);
        // getUsernameAndPassWord();
    }
}
// éªè¯host
function isHost(token) {
    let host = location.host.split(':')[0];
    let obj = {
        host
    };
    console.log(host);
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://192.168.63.59:8703/sys/rpa/tampermonkey/anyMatchUrl",
        headers: {
            "Content-Type": " application/json"
        },
        data:JSON.stringify(obj),
        onload: function(response){
            if(response.response == 'true') {
                getUsernameAndPassWord(token);
            }
        },
        onerror: function(response){
            console.log("è¯·æ±å¤±è´¥");
        }
    });
}
// è·åé¡µé¢tokenå¹¶éªè¯tokençæææ§
function hasToken() {
    let url = window.location.href;
    let query = url.split('?')[1];
    if(query == "" && !query) return null;
    let queryCild = query.split('&');
    let token = "";
    queryCild.forEach(item=> {
        let items = item.split('=');
        if(items[0] === "token") {
            token = items[1];
        }
    });
    return token;
}
// è·åç¨æ·åå¯ç 
function getUsernameAndPassWord(token) {
    let obj = {
        token:decodeURIComponent(token)
    };
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://192.168.63.59:8703/sys/rpa/tampermonkey/getAuthentication",
        headers: {
            "Content-Type": " application/json"
        },
        data:JSON.stringify(obj),
        onload: function(response){
            let res = JSON.parse(response.response);
            let username = res.username;
            let password = RSAdecrypt(res.password);
            // æ ¹æ®ä¸æ¹ç³»ç»çdomScriptå½æ°æådomå¡«å
            eval(res.domScript);
            fillDom(username,password);
        },
        onerror: function(response){
            console.log("è¯·æ±å¤±è´¥");
        }
    });
}
// è·åé¡µé¢åç´ 
function getElement() {
    console.log(location.href);
    let inputObject = {};
    let inputText = [];
    let inputPassword = [];
    let inputs = document.querySelectorAll('input');
    inputs.forEach(item=> {
        if(item.type.toUpperCase() === 'PASSWORD'){
            inputPassword.push(item);
        }
        if(item.type.toUpperCase() === 'TEXT') {
            inputText.push(item);
        }
    });
    inputObject.inputText = inputText;
    inputObject.inputPassword = inputPassword;
    inputObject.inputs = inputs;
    return inputObject;
}
// rsaè§£å¯
function RSAdecrypt(code) {
    const publicKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgn4hoDkFmBbhKKxJv5RJadX2ovHbXm9aYhj/1ah1hb6j0CTcYiY8kquV+6RLg9Y8ngjXAlhshnrxILze+AwOeIDNkawRLsxLwulOTdYOcgWnbNt2zQho1sOwtXydmmOKTOSg1VARkZeKixheABTHCuVKlxJHaMA4EhiOk1qwASqOMxjzrNHSTH58Bq7QQYbA3RNw9MKfR+iGuNxr7k0iN8CYO+o8HwfuYdTvfDmt3cggOcjA8QoCRi8Oqqae3LPV7Of8t/AMZzGOWGGgdJLMJHLpMhBICCogVc+GQDJRATH1s9RxHRhx0mUV5RSUHwdVeoWjWRPEL8AB/kjyLbJXCQIDAQAB
    -----END PUBLIC KEY-----`;
    const privatekey = `-----BEGIN RSA PRIVATE KEY-----
    MIIEowIBAAKCAQEAgn4hoDkFmBbhKKxJv5RJadX2ovHbXm9aYhj/1ah1hb6j0CTcYiY8kquV+6RLg9Y8ngjXAlhshnrxILze+AwOeIDNkawRLsxLwulOTdYOcgWnbNt2zQho1sOwtXydmmOKTOSg1VARkZeKixheABTHCuVKlxJHaMA4EhiOk1qwASqOMxjzrNHSTH58Bq7QQYbA3RNw9MKfR+iGuNxr7k0iN8CYO+o8HwfuYdTvfDmt3cggOcjA8QoCRi8Oqqae3LPV7Of8t/AMZzGOWGGgdJLMJHLpMhBICCogVc+GQDJRATH1s9RxHRhx0mUV5RSUHwdVeoWjWRPEL8AB/kjyLbJXCQIDAQABAoIBAA9TpDxu5h7OdSSzU7gqQRMqu9y4noTxfEKwYAAm2KLcWN4+LhpjFlM9zxBu5CW4eIcxT5upahnDf+XR+ThWJi72Je75sEz4Vt+uSnGu9iRjUJ5jCombdsDe3Db8y4ASN/C/G7riPCYHEBE1S/kjd5tqgf/LeFKv3QYXF0vsZ2bDf19xi2bgZk18tVKndzl/7xmpr6s9Rdf9BHee7r97qBIKPNdkUAy8EKKQN0kDtsggRNNootZ5sABx17xoTt2fWM7pwS26efit3RwUMpBeowQSsB8dkH6RSBM517WTJEYNQnSrkXg1N+iLAqx7WXsCjKQ8+gUq7tCM7AR2NrAvURkCgYEAtUZjam0O/AnxwxaMhbid+mHM0n52gV5xZg47Mj620BQNJ3+N6EX6dvtGrF+d5ES0GPBssvhPadnnsP1GQwzra0i6iP+/D/oe8OTY2y3Bl8IzgO46rlIN0tq10CLyBZf8utH4Bm11k5p6PtB0R4FsPlt758o7gaVqFnOsZrGyMF0CgYEAuEjJED58vZ6wewieWImRtCdGPfwC4YYyOCzNnKWDaYNSoa/EffvNjLsmuEU7kERrYYqpfJDdXe9m3xc3k2dp4mBhQ6VyEH3oEav2TLL7ECSIEY1tWdo8V3D1qY/x3JcisEzmTmQvaRwiI+fgmqA7b8J6c1WcLkU8NbFqVmzihp0CgYAMX05/wAvKxf77OrnCkrQtl6k8IKeD8uc4ePYvWrptf0DalkkgNk5++m17bFdBcjL8lMRGfs4kwlue59p4zxPuUZtxqErpE0AzXtsyMnBJJFcRkLDunukUoBrSpt/v48y7D4OnJKdmuJ9pVB7rlnjF1MajLllbYufXunNk2vH3fQKBgB0vUcBj1QeGuTZS8BjfeJbKXYJ1hdNHmG5zEgEL6VrtdEms93ZoSW5POVuXg05et47UEfFrU9OLlYQhPij3CLrUPrMi4YShG/6oeDI/ailtT6tP9ZB0UngaqJ048bnYqaK4GwUxMpz32qRLFbQHSkJxz0iytzBQwK9UMJ4NUna1AoGBAJMcJ/3yNuEkEadOblJYJeitk8r9GDReLfnAKc85582iJRoU1rW4HoU7e8oryCA9m5gPRIREqYHVLwNggJbF82WsAVSj9P2fjF6mEaHLxVS2IrBVKK8bR29cbYoTiYiI9Gf+gOuD4g8Y9jwlyDeVGSIZNt+9pEsPwLesIVpVWQei
    -----END RSA PRIVATE KEY-----`;
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    encryptor.setPrivateKey(privatekey);
    return encryptor.decrypt(code);
}
// å¡«åè¡¨ååç´ 
function fillForm(username,password) {
    let obj = getElement();
    let inputsIndex = 0;
    // obj.inputText.forEach(item=> {
    //     hasValue(item, username);
    // });
    for (let i = 0; i < obj.inputs.length; i++) {
        if(obj.inputs[i].type.toUpperCase() === 'PASSWORD' && obj.inputs[i-1].type.toUpperCase() == 'TEXT'){
            hasValue(obj.inputs[i-1], username);
        }
    }
    obj.inputPassword.forEach(item=> {
        hasValue(item, password);
    });
    // document.querySelector("#btnSubmit").click();
}
// inputåç´ èµå¼
function hasValue (dom, st) {
    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: st,
        dataTransfer: null,
        isComposing: false
    });
    dom.value = st;
    dom.dispatchEvent(evt);
}
