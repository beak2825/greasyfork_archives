// ==UserScript==
// @name         高等教育自学考试课程学习
// @namespace    https://gjtplatform.51100.net/
// @version      2024-12-18
// @description  高等教育自学考试课程学习(https://gjtplatform.51100.net/)
// @author       TFTF-Breeze
// @license      ABOL=1.0
// @match        https://gjtplatform.51100.net/examGjtStaticLssy/*
// @icon         https://gjtplatform.51100.net/examGjtStaticLssy/dist/img/sign-title.c54e8ace.png
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526679/%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/526679/%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E8%AF%BE%E7%A8%8B%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==


function canvas_jpg(captchaImg){
    // 使用Canvas 将图像转化文本
    // 创建 Canvas 元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    //设置 Canvas 的宽高与图像一致
    canvas.width = captchaImg.width;
    canvas.heigth = captchaImg.heigth;
    console.log('宽：'+canvas.width+'高：'+canvas.heigth);

    // 将图片绘制到 Canvas 上
    ctx.drawImage(captchaImg,0,0);


    // 图像预处理
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // 遍历像素进行二值化处理
    for(let i =0;i < data.length;i+=4){
        // 计算灰度值
        const avg = (data[i] + data[i+1] + data[i+2]) / 3;

        // 设定阈值，较大的设为白色，小于阈值的设为黑色
        const threshold = 128;
        data[i] = data[i+1] = data[i+2] = avg < threshold ?0:255;
    }

    // 更新 Canvas
    ctx.putImageData(imageData,0,0);

    return canvas;
}

// 识别图片中的文字
function verification_code(jpg_url){
    // 引入 Tesseract 模块
    //const Tesseract = require('tesseract.js');

    // 识别图片中的文字
    Tesseract.recognize(
        jpg_url , // 指定图片路径
        'eng', // 指定识别语言，这里是英文，如果不指定则自动识别
    {
        logger: m => console.log(m) // 定义一个日志函数来输出识别进度信息
    }
    ).then(({ data: { text } }) => {
        console.log('识别的字体：'+text); // 输出识别的文字
    }).catch(error => {
        console.error(error); // 输出任何识别过程中出现的错误
    });
}

// 登录用户
function login(){
    let jpg_code = document.querySelector("div.code-img > img");
    if(jpg_code != null){
        // 图像处理
        const canvas = canvas_jpg(jpg_code);
        verification_code(canvas.toDataURL());

        // 识别图片中的文字
        const jpg_url = jpg_code.src;
        verification_code(jpg_url);
    }
}



// 定义一个函数，输出当前时间
function printCurrentTime() {
    // 登录超时检测
    let button = document.querySelector(".el-message-box__btns > button");
    if(button != null){
        button.click();
    }

    let duration = document.getElementsByTagName('video')[0].duration;//视频总时长
    let current = document.getElementsByTagName('video')[0].currentTime;//视频当前播放时长
    if(duration-3 <= current){
        let course = document.querySelectorAll(".resource-item > div:nth-child(2) > div");//课程目录
        for(let i=0;i<=course.length-1;i++){
            if(course[i].classList[1] == 'index-module_running_oSftp'){
                if(i < course.length-1){
                    course[i+1].click();
                }else{
                    alert('视频已经全部播放完毕！！！');
                }
            }
        }
    }else{
        //不够播放时间继续播放
        let play = document.querySelector(".prism-big-play-btn")//点击播放;
        if(play.style.display == "block"){
            play.click();
            console.log("已点击播放！！！");
        }
    }


    let Learning_detection = document.querySelector("div.alibabaVideo > div.el-dialog__wrapper");//学习检测
    if(Learning_detection.style.display == ""){
        document.querySelector("div.alibabaVideo > div.el-dialog__wrapper > div > div.el-dialog__footer > span > button").click(); //确认学习检测
        console.log("已确认学习检测！！！");
    }
}

// 定义考试函数
function exam() {
    // 示例使用
    for(let a=0;a <= 6;a++){
        for(let b=1;b <= 30;b++){
            let Category = document.querySelector("#\\3"+a+"jump_index"+b);
            //console.log(Category);

            //单选题
            let radio_a = document.querySelector("#\\3"+a+"jump_index"+b+"> div > dd > label");

            if(radio_a != null){
                if(radio_a.classList[1] != 'is-checked'){
                    //console.log(radio_a.classList[1]);
                    radio_a.click();
                }
            }

            //多选题
            let MCQ_a = document.querySelector("#\\3"+a+"jump_index"+b+"> div > dd:nth-child(2) > div > label");
            if(MCQ_a != null){
                if(MCQ_a.classList[1] != 'is-checked'){
                    //console.log(MCQ_a.classList[1]);
                    MCQ_a.click();
                }
            }

        }
        setTimeout(a,100);
    }
}

(function() {
    'use strict';

    // 每秒运行一次printCurrentTime函数
    let url = window.location.href;
    if(url == 'https://gjtplatform.51100.net/examGjtStaticLssy/#/'){
        setInterval(login, 5000);
    }
    setInterval(printCurrentTime, 3000);


    //setInterval(exam, 3000);

})();