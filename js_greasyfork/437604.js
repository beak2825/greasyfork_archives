// ==UserScript==
// @name         成信大教务处自动登录
// @namespace    https://jwc.cuit.edu.cn/
// @version      0.2
// @description  进入教务处自动登录
// @author       shiouhoo
// @match        https://jwc.cuit.edu.cn/
// @include     *://jxgl.cuit.edu.cn/*
// @include     *://webvpn.cuit.edu.cn/*/*
// @include     *://sso.cuit.edu.cn/*/*
// @include     *://sso-cuit-edu-cn-s.webvpn.cuit.edu.cn:*/*/*
// @require     https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant       GM_xmlhttpRequest
// @license     GPL License
// @connect     www.bhshare.cn
/* globals jQuery, $, waitForKeyElements,hh */
// @downloadURL https://update.greasyfork.org/scripts/437604/%E6%88%90%E4%BF%A1%E5%A4%A7%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/437604/%E6%88%90%E4%BF%A1%E5%A4%A7%E6%95%99%E5%8A%A1%E5%A4%84%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var optition = {
        account: '',//学号
        password:'',//密码
        yzm_token: 'c67ce2bed'//验证码识别密钥
    }
    optition.method = '1'
    optition.yzm_times = ''
    function keyboardInput(dom, st) {
        var evt = new InputEvent('input', {
            inputType: 'insertText',
            data: st,
            dataTransfer: null,
            isComposing: false
        });
        dom.value = st;
        dom.dispatchEvent(evt);
    }
    function getBase64(url) {
        var base64="";
        var img = new Image();
        img.src='captcha'
        img.onload=function(){
            var canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            var ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, img.width, img.height)
            base64 = canvas.toDataURL("image/png")
        }
        return new Promise((resolve, reject) => {
            function temp(){
                setTimeout(()=>{
                    if(base64.length != 0){
                        resolve(base64)
                    }else{
                        temp()
                    }
                },100)
            }
            temp()
        })
    }
    function dataURLtoFile(dataurl){
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], '123.png', { type: mime });
    }
    function hh(){
        if(window.location.href == 'https://jwc.cuit.edu.cn/'){
            optition.method = '1'
            clickLogin()
        }else if(/http:\/\/jxgl.cuit.edu.cn\/sw.asp\?dstUrl=.*/.test(window.location.href)){
            optition.method = '2'
            webVpn()
        }else if(/https:\/\/webvpn.cuit.edu.cn\/portal/.test(window.location.href)){
            optition.method = '3'
            webVpn()
        }else if(/https:\/\/sso.cuit.edu.cn\/authserver\/login/.test(window.location.href)){
            optition.method = '4'
            cuitLogin()
        }else if(/http:\/\/sso-cuit-edu-cn-s.webvpn.cuit.edu.cn/.test(window.location.href)){
            optition.method = '41'
            cuitLogin()
        }
    }
    function clickLogin(){
        let node_a = $(".container #logo a").filter(function(){
            return this.text.replace(' ','') == '登录'
        })
        location.href = node_a[0].href
    }
    function webVpn(){
        if(optition.method == '2'){
            $('a')[0].click()
        }else if(optition.method == '3'){
            function temp(node_input){
                if(node_input.length == 0){
                    setTimeout(()=>{
                        temp($('.form-line .input-box input'))
                    },500)
                }else{
                    keyboardInput(node_input[0],optition.account)
                    keyboardInput(node_input[1],optition.password)
                    node_input[1].focus()
                    setTimeout(()=>{$('form#Calc button')[0].click()},1000)
                }
            }
            temp($('.form-line .input-box input'))
        }
    }
    async function cuitLogin(){
        keyboardInput($('.passLogin #usernamepsw')[0],optition.account)
        keyboardInput($('.passLogin #password')[0],optition.password)
        let formData = new FormData();
        formData.append("file", dataURLtoFile(await getBase64('captcha')))
        formData.append("token",optition.yzm_token)
        formData.append("type","local")
        function temp(){
            GM_xmlhttpRequest({
                method: "post",
                url: 'http://www.bhshare.cn/imgcode/',
                data: formData,
                onload: function(data){
                    if (data.status == 200) {
                        let yzm = JSON.parse(data.responseText).data
                        optition.yzm_times = JSON.parse(data.responseText).times
                        if(JSON.parse(data.responseText).data === 'token不合法'){
                            alert(JSON.parse(data.responseText).data)
                            return
                        }
                        if(yzm.length != 4){
                            location.reload()
                        }
                        keyboardInput($('.passLogin .phoneLi input')[0],JSON.parse(data.responseText).data)
                        $('.passLogin button')[0].click()
                        setTimeout(()=>{
                            if($('.passLogin:contains(验证码)').length != 0){
                                location.reload()
                            }
                        },500)
                         } else {
                         alert('验证码识别失败')
                    }
                }
            })
        }
        temp()
    }
    hh()
})();