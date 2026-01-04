// ==UserScript==
// @name         猎妈人
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  自动循环发微博，可自己配置发的内容。对线用
// @author       BuildmO_on
// @match        https://weibo.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437736/%E7%8C%8E%E5%A6%88%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437736/%E7%8C%8E%E5%A6%88%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //获取输入框
    var content = document.getElementsByClassName('Form_input_2gtXx');
    //获取发布按钮
    var sendButton = document.getElementsByClassName('Tool_btn_2Eane');
    //设置起始index
    var index = 0;

    //这里写小仙女的微博名字
    const username = '@XXXXX'
    //这里写脏话
    const wordList = [
        `你是什么品种的小仙女`,
        `急咯急咯`,
        `就这就这？`,
        `这就破防了？`,
        `你户口本上几页啊，那么撒。`,
        `你妈几分熟？`,
        `别把，我是开玩笑的啊集美，你不会当真了吧`,
        `快跑吧，要过年了，他们开始备年货了`,
        `快点写小作文，集美。我要当主角`,
        `你身上那个检疫合格的紫色纹身呢，亮出来给大家伙儿笑一下啊`,
        `九世轮回好裤裆？`,
    ]

    //主体方法
    function submit() {
        //当循环到最后一句，从头开始
        if(index == wordList.length){
            index = 0
        }
        //派发光标插入事件
        var domFocus = document.createEvent('HTMLEvents');
        domFocus.initEvent('focus', true, true);
        content[0].dispatchEvent(domFocus);
        //模拟键盘输入
        var keyBodyInput = new InputEvent('input', {
            inputType: 'insertText',
            data: '',
            dataTransfer: null,
            isComposing: false
        })
        content[0].value = `${username} ${wordList[index]}`;
        content[0].dispatchEvent(keyBodyInput);
        //延时100毫秒派发点击事件
        setTimeout(() => {
            var handleClick = document.createEvent('MouseEvents');
            handleClick.initEvent('click', true, true);
            sendButton[0].dispatchEvent(handleClick)
        }, 100);
        //每遍历一次，index自增
        index++
    }

    //轮询  控制几秒发一次 1000毫秒等于1秒
    setInterval(submit, 20000);


})();