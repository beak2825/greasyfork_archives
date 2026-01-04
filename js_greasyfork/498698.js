// ==UserScript==
// @name         批量下载王者荣耀英雄语音
// @namespace    https://www.ltcsmoke.icu/
// @version      V1
// @description  批量下载王者荣耀官网语音鉴赏里单英雄页面语音，下载的文件名用台词命名，设置每秒下载5个，延迟1秒。
// @author       Zero
// @match        https://pvp.qq.com/ip/voice.html
// @icon         https://pvp.qq.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498698/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E8%8B%B1%E9%9B%84%E8%AF%AD%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/498698/%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E8%8B%B1%E9%9B%84%E8%AF%AD%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //设置按钮函数
    function anniu_hanshu() {

        const yuyintiao = document.querySelectorAll('.dinfo-voice-item');//获取语音条数
        var yuyinshu = yuyintiao.length;//获取语音数量

        //设置弹窗
        var tanchaung = confirm("共有"+yuyinshu+"条语音，你确定要下载吗？");
        if (tanchaung == true) {
            //alert("你点击了确定按钮！");

            //定义下载函数
            function xiazaiyinpin(mp3URL, wenjianming, index) {
                return new Promise(resolve => {
                    fetch(mp3URL)
                        .then(response => response.blob())
                        .then(blob => {
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `${index + 1}_${wenjianming}.mp3`;
                        link.click();
                    })
                        .catch(error => console.error('下载失败Error downloading audio:', wenjianming))
                        .finally(resolve);
                });
            }

            //定义异步下载函数
            async function zidongxiazaiyuyin() {

                const yuyintiaoshu = document.querySelectorAll('.dinfo-voice-item');

                for (let index = 0; index < yuyintiaoshu.length; index++) {
                    const voiceItem = yuyintiaoshu[index];
                    const mp3URL = voiceItem.getAttribute('data-mp3');
                    const wenjianming = voiceItem.querySelector('span').textContent.trim();
                    console.log(index+1 + wenjianming);

                    // 下载音频文件
                    await xiazaiyinpin(mp3URL, wenjianming, index);

                    // 添加下载延迟（每秒5个）
                    if (index % 5 === 4) {
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 延迟1秒
                    }
                }
            }
            zidongxiazaiyuyin();
        } else {
            //alert("你点击了取消按钮！");
        }
    }

    // 创建下载按钮
    const tianjia_anniu = document.createElement('button');
    tianjia_anniu.textContent = '批量下载王者荣耀英雄语音';
    tianjia_anniu.style.position = 'fixed';
    tianjia_anniu.style.top = '8%';
    tianjia_anniu.style.left = '4%';
    tianjia_anniu.style.zIndex = '999';
    tianjia_anniu.style.border = '3px solid #E4C289';
    tianjia_anniu.style.color = '#E4C289';
    tianjia_anniu.style.background = '#181818';
    tianjia_anniu.style.padding = '1em 2.8em';
    tianjia_anniu.addEventListener('click', anniu_hanshu);

    // 将按钮添加到页面
    document.body.appendChild(tianjia_anniu);

})();