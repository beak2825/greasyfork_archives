// ==UserScript==
// @name         UCAS SEP 系统自动教评
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  UCAS的SEP系统自动教评，此脚本能够帮助您自动评价，支持课程评价与教师评价
// @author       tylzh97
// @match        https://jwxk.ucas.ac.cn/evaluate/course*
// @match        https://jwxk.ucas.ac.cn/evaluate/teacher*
// @match        https://jwxk.ucas.ac.cn/evaluate/evaluateTeacher/*
// @match        https://jwxk.ucas.ac.cn/evaluate/evaluateCourse/*
// @license      MIT
// @require      https://libs.baidu.com/jquery/1.8.3/jquery.min.js
// @require      https://unpkg.com/tesseract.js@4.0.1/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/417867/UCAS%20SEP%20%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/417867/UCAS%20SEP%20%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==


/*
介绍：
纯JS打卡脚本，能够自动化完成教评全五星好评
OCR 部分使用 https://github.com/naptha/tesseract.js


V0.1 2020年12月04日
手动点击需要评价的课程或老师，即可自动评价并且跳转到未评价系统界面。

V0.2 2020年12月04日
在教评界面, 点击帅气小哥头像, 即可实现全自动打卡

V0.2.1 2020年12月04日
bug修复

V0.2.4 2023年01月01日
bug修复

*/

'use strict';

// Tesseract.js API
// https://github.com/naptha/tesseract.js/blob/master/docs/api.md#worker-recognize
// Tesseract.recognize(
//     'https://tesseract.projectnaptha.com/img/eng_bw.png',
//     'eng',
//     { logger: m => console.log(m) }
// ).then(({ data: { text } }) => {
//     console.log(text);
// })

const CAPTCHA_HOST = "https://sep.maikebuke.com/captcha";

// 使用画布重绘验证码, 并获取 base64 字符串
// 参考: https://stackoverflow.com/a/22172860/10714490
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

unsafeWindow.getBase64Image = getBase64Image;

function get_captcha_text(img) {
    // const img = document.getElementById("adminValidateImg");
    const image_data = getBase64Image(img);
    const payload = {
        image: image_data
    }
    var text = "";
    $.ajax({
        type: 'POST',
        url: CAPTCHA_HOST,
        data: JSON.stringify(payload),
        contentType: 'application/json',
        async: false,
    }).done(function (data) {
        if (data.code === 0 && data.data.length === 4) {
            text = data.data;
        }
    });
    return text;
}

function fill_captcha(id_input, id_img) {
    const input = document.getElementById(id_input);
    const image = document.getElementById(id_img);
    const ctext = get_captcha_text(image);
    input.value = ctext;
    return true;
}

(function () {


    // 以下为代码
    function handleClick() {
        window.localStorage.setItem('zm-key', JSON.stringify({ goon: 1 }));
        goonWithLocalStorage();
    }
    function goonWithLocalStorage() {
        const dict = JSON.parse(window.localStorage.getItem('zm-key'));
        if (!dict) {
            return;
        }
        const code = dict.goon;
        if (code) {
            // 处理页面点击逻辑
            const buttons = document.querySelectorAll('td a[class^="btn"]');
            // buttons[1].innerText = '1111';
            const n_btn = Array.from(buttons)
                .filter((x) => { return x.innerText.indexOf('修改评估') });
            if (n_btn && n_btn[0]) {
                n_btn[0].click();
            } else {
                window.localStorage.setItem('zm-key', JSON.stringify({ goon: 0 }));
            }
            setTimeout(() => {
                alert('整活完毕');
            }, 3000);
            return;
        }
    }
    unsafeWindow.handleClick = handleClick;
    // 前期教评, 均5分
    $(document).ready(() => {
        if (window.location.href.indexOf('evaluate/course') + 1 ||
            window.location.href.indexOf('evaluate/teacher') + 1) {
            let title = document.getElementsByClassName('span12');
            if (!title) {
                window.alert('出错了');
                return;
            }
            // 添加❤按钮
            title = title[0];
            title.style = 'height: 75px; line-height: 75px;';
            title.firstElementChild.style = "float:left; line-height: 75px;";
            const btn = document.createElement('div');
            btn.style = 'float: right; top -10px; padding-right: 30px;';
            btn.innerHTML = '<button style="border: 0;" onclick="handleClick()"><span>为什么不试试一键教评呢</span><img width=75px src="https://qiniu.maikebuke.com/006fLFOwgy1gygew6aw8cj30qc0qcn24.jpg" /></button>';
            title.appendChild(btn);
            // 加载完毕后开启循环
            goonWithLocalStorage();
        } else {
            console.log('开始教评.....');
            const lst1 = document.querySelectorAll('[name^="item_"][value="5"]');
            console.log(lst1);
            for (let i = 0; i < lst1.length; i++) {
                lst1[i].checked = true;
            }
            // 五个意见栏
            const ta = document.querySelectorAll('textarea[name^="item_"]');
            for (let i = 0; i < ta.length; i++) {
                const text = window.location.href.indexOf('evaluateTeacher') + 1 ?
                    "治学严谨、备课充分、讲课认真、因材施教" :
                    "课程与作业（包括作业、报告、测验测试、论文等）有助于我的能力的提高";
                ta[i].innerText = text;
            }
            if (window.location.href.indexOf('evaluateCourse') + 1) {
                // 教室情况和舒适度
                document.querySelectorAll('input[name^="radio_"]')[0].checked = true;
                // 修读原因
                document.querySelectorAll('input[name^="item_"][type="checkbox"]')[0].checked = true;
            }
            fill_captcha("adminValidateCode", "adminValidateImg");
            const submit = document.getElementById("sb1");
            submit.click()
            $("[value=ok]").click()
            // 点击提交按钮
            // document.getElementById('sb1').click();
        }
    })
})();
