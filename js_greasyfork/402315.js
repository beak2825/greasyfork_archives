// ==UserScript==
// @name         吾爱破解之识别百度网盘链接并自动填写密码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       LL
// @match        https://pan.baidu.com/share/*
// @match        https://www.52pojie.cn/thread-*
// @downloadURL https://update.greasyfork.org/scripts/402315/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E4%B9%8B%E8%AF%86%E5%88%AB%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/402315/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E4%B9%8B%E8%AF%86%E5%88%AB%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.domain == 'www.52pojie.cn'){

        var allhtml = document.getElementById("postlist").innerHTML

        var ym = document.documentElement.innerText;
        ym = ym.replace(/\n/g," ");
        console.log(ym)
        var res = []
        var patt = /(https:\/\/pan.baidu.com\/s\/1(.*?)[^a-zA-Z0-9-_]).{1,10}([a-z0-9]{4})[^a-zA-Z0-9-_]/g
        var button = ''
        var reg = new RegExp('');
        console.log('aaa')
        while(res = patt.exec(ym)){
            console.log(res)
            if(res[2] && res[3]){
                button = '<a style="color:red;border-color: red;border-style:solid;" href="'+ 'https://pan.baidu.com/share/init?surl='+res[2] + '&pw=' + res[3] +'" target="_blank">打开链接</a>'
                //button = 'aa'
                reg = new RegExp(res[1].trim(),"g");
                allhtml = allhtml.replace(reg,button+res[1].trim());
                console.log('链接',res[2],'密码',res[3])
                console.log('https://pan.baidu.com/share/init?surl='+res[2] + '&pw=' + res[3])
            }
        }
        if(button != ''){
            document.getElementById("postlist").innerHTML = allhtml
        }
    }else if(document.domain == 'pan.baidu.com'){
        var url = window.location.href
        console.log(url)
        var patt_pw = /pw=([a-z0-9]{4})/
        var res_pw = patt_pw.exec(url)
        //var patt = /([a-zA-Z0-9_]{10,})/
        //var res = patt.exec(url)
        console.log(res_pw)
        if(res_pw && res_pw[1]){
            document.getElementsByTagName('input')[0].value = res_pw[1]
        }
    }

})();