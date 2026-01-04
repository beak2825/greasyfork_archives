// ==UserScript==
// @name         GGS验证码自动识别
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  自动识别验证码
// @author       sujiexian
// @require      https://cdn.jsdelivr.net/combine/npm/ocrad.js@0.0.1/ocrad.min.js,npm/jquery@3.6.0
// @match        http://enet.10000.gd.cn:10001/qs/*
// @该代码参考Stackia maxinimize的”giveaway.su 验证码自动识别“
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441736/GGS%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/441736/GGS%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==

(function () {
    let data = {
        'username':'',//这里填写你的账号，写在' '内
        'password':'a1234567'//这里填写你的密码
    }

    function greyscale(imageData) {//灰度转换就行,二值化后的识别准确率低
        let grey;//灰度值
        let x,y,idx;
        let r,g,b;
        for (x = 0; x < imageData.width; x++) {
            for (y = 0; y < imageData.height; y++) {
                idx = (x + y * imageData.width) * 4
                r = imageData.data[idx]
                g = imageData.data[idx + 1]
                b = imageData.data[idx + 2]
                grey = 0.299 * r + 0.587 * g + 0.114 * b
                imageData.data[idx] = grey
                imageData.data[idx + 1] = grey
                imageData.data[idx + 2] = grey
                imageData.data[idx + 3] = 255
            }
        }
    }//灰度转换

    function execute() {
        let input = $('input#code')
        let canvas = document.createElement('canvas')
        //$('.checkbox').append(canvas)//插入画布
        canvas.style.backgroundColor = "cornsilk";
        let ctx = canvas.getContext('2d')
        let captchaImg = document.getElementById("image_code")
        canvas.width = captchaImg.width
        canvas.height = captchaImg.height
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(captchaImg, 0, 0, canvas.width, canvas.height)
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        greyscale(imageData)
        ctx.putImageData(imageData, 0, 0);

        let string = OCRAD(imageData);//OCRAD识别灰度验证码
        string =string.match(/\w/g);//验证码取值
        //console.log(string)
        input.val(string.join('').replace(/,/g,''))//去逗号
        console.log(input.val())


    }

    function Interval(){
        if($('input#code').val()==''){
            execute()
        }
        else if($('input#code').val()!=''){
            window.clearInterval(intervalHandler)
            intervalHandler=null;
            btn.click();//模拟点击
            $('input#code').val('')
            if($('#success').css('display')=='none'){//没有成功就再次启动定时器重复
                intervalHandler = window.setInterval(Interval, 500)
            }
        }
    }

    let uname = $('#username');
    let pword = $("#password");
    let intervalHandler = 0;//定时器
    let btn = $('button.am-btn-block')[4];
    console.log(data['username']);
    if(uname.val() == ''){
        uname.val(data['username'])
    }
    if(pword.val() == ''){
        pword.val(data['password'])
    }
    if(uname.val() != '0' && pword.val() != '0'){
        intervalHandler = window.setInterval(Interval, 500)
    }
})()