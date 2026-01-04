// ==UserScript==
// @name         自动填写真实手机号
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  拍单时自动填写手机号
// @author       俊辉
// @license      俊辉
// @match        https://mobile.yangkeduo.com/*
// @match        https://item.taobao.com/item.htm*
// @match        https://detail.tmall.com/item.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yangkeduo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445175/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E7%9C%9F%E5%AE%9E%E6%89%8B%E6%9C%BA%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/445175/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E7%9C%9F%E5%AE%9E%E6%89%8B%E6%9C%BA%E5%8F%B7.meta.js
// ==/UserScript==
if (location.pathname.match(/goods\.html|goods[0-9]\.html|psnl_verification\.html/g)!=null) {开始();}
if (location.pathname == '/item.htm') { 开始(); };
var 真实手机号正则 = /真[[0-9]{12}]/g;
var 真实手机号正则2 = /1[3-9]\d{9}|[852]{3}-[0-9]{8}/g;
var 虚拟手机号正则 = /虚[[0-9]{12}-[0-9]{4}]/g;
var 虚拟手机号正则2 = /[0-9]{11}-[0-9]{4}/g;

function 自动填写真实手机号() {
    var textarea = document.getElementsByTagName("textarea");
    var 备注是否有手机号 = false;
    //遍历textarea元素
    for (var i = 0; i < textarea.length; i++) {
        //获取textarea元素的值
        var textareaValue = textarea[i].value;
        //正则匹配textareaValue的内容是否为手机号
        var 手机号正则 = /1[3-9]\d{9}/g;
        //如果匹配到手机号
        if (手机号正则.test(textareaValue)) {
            var 真实手机号 = textareaValue.match(真实手机号正则2)[0].match(真实手机号正则);
            var 虚拟手机号 = textareaValue.match(虚拟手机号正则)[0].match(虚拟手机号正则2);
            备注是否有手机号 = true;
        } else {
            //下一次循环
            continue;
        }
    }
    //循环结束后判断备注是否有手机号
    if (备注是否有手机号 == true) {
        //填写真实手机号;
        if(真实手机号){
        document.getElementsByClassName("J_realMobile")[0].value = 真实手机号[0];
        }
        document.getElementsByClassName("J_virtualNumberInput")[0].value = 虚拟手机号[0];//J_virtualNumberInput
        //返回成功;
        return true;
    } else {
        alert("备注没有手机号");
        //返回失败
        return false;
    }
}

//设置循环检测次数
var 循环次数 = 0;
//循环检测页面是否存在元素如：循环检测页面是否存在元素('layui-layer-rim')
async function 循环检测页面是否存在元素(element) {
    //循环检测
    while (true) {
    console.log("true");
        //检测页面classname元素是否存在
        if (document.getElementsByClassName(element).length > 0) {
            //初始化循环次数
            循环次数 = 0;
            //返回成功
            console.log("页面"+element+"元素存在");
            //执行自动填写真实手机号
            自动填写真实手机号();
            return true;
        } else {
            //检测次数+1
            循环次数++;
            //如果循环次数大于10
            console.log("循环次数：" + 循环次数);
            if (循环次数 > 10) {
                //返回失败
                console.log("页面"+element+"元素不存在");
                return false;
            } else {
                //等待1秒
                console.log("等待"+element+"元素");
                await sleep(1000);
                循环检测页面是否存在元素(element);
            }
        }
    }
}

//sleep函数
function sleep(numberMillis) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var now = new Date();
            var exitTime = now.getTime() + numberMillis;
            while (true) {
                now = new Date();
                if (now.getTime() > exitTime) {
                    resolve('sleep ok');
                    return;
                }
            }
        }, 0);
    });
}

function main() {
    //判断订单信息的手机号是否加密
    if(document.getElementsByClassName("J_mobile")[0].value.match(/\*/g)==null){
        console.log("不是加密手机号");
        return false;
    }else{
        console.log("是加密手机号");
        //执行循环检测页面是否存在元素
        循环检测页面是否存在元素('layui-layer-rim');
    }
}

function 开始() {
    //获取页面元素
    var 订单信息 = document.getElementsByClassName("J_fixPanelHeader");
    //如果订单信息存在
    if (订单信息.length > 0) {
        main();
    } else {
        //等待1秒
        console.log("等待订单信息窗口");
        setTimeout(function () {
            //执行等待元素出现后再执行main()
            开始();
        }, 1000);
    }
}