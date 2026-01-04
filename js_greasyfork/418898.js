// ==UserScript==
// @name         密码生成器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  每次访问一个网页，会生成一个对应密码，按F12在控制台查看
// @author       hlmio
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/md5-js@0.0.3/md5.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418898/%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/418898/%E5%AF%86%E7%A0%81%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 配置变量
    var 核心秘钥 = "hlmio"
    var 密码长度 = 16
    var 为了满足大小写和特殊字符_添加的后缀 = "@Aa1"
    var 第一次md5后_交换哪几位字符_可选值为1到32 = [2,4,8,16,32]
    var 第一次md5后_删掉哪几位字符_可选值为1到32 = [1,3,7,15,31]

    var 自动获取的辅助秘钥_域名 = window.location.host
    var 秘钥 = 核心秘钥 + 自动获取的辅助秘钥_域名

    var 第一次md5后的结果 = md5(秘钥)
    var md5数组 = 第一次md5后的结果.split('')
    // 换位
    var 位数数组 = 第一次md5后_交换哪几位字符_可选值为1到32
    位数数组.forEach(function (item) {
        交换数组的两位内容(md5数组,0,item-1)
    })
    // 删位
    位数数组 = 第一次md5后_删掉哪几位字符_可选值为1到32
    位数数组.forEach(function (item) {
        md5数组[item-1] = "-1"
    })
    for(let i=md5数组.length-1; i>=0; i--){
        if(md5数组[i]=="-1"){
            md5数组.splice(i,1)
        }
    }
    第一次md5后的结果 = md5数组.join('')
    var 第二次md5后的结果 = md5(第一次md5后的结果)

    var 后缀 = 为了满足大小写和特殊字符_添加的后缀
    var 保留位数 = 密码长度 - 后缀.length
    var 最终密码 = 第二次md5后的结果.substr(0,保留位数) + 后缀
    最终密码 = 末尾补0(最终密码,密码长度)
    console.log("" + 自动获取的辅助秘钥_域名 + " 最终密码:")
    console.log(最终密码)

})();

function 末尾补0(最终密码,密码长度){
    if(最终密码.length >= 密码长度){
        return 最终密码
    }
    let 补几个0 = 密码长度 - 最终密码.length
    for(let i=0; i<补几个0; i++){
        最终密码 += "0"
    }
    return 最终密码
}

function 交换数组的两位内容(数组,第一位,第二位){
    let a = 数组[第一位]
    let b = 数组[第二位]
    数组.splice(第一位,1,b)
    数组.splice(第二位,1,a)
}