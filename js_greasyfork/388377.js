// ==UserScript==
// @name         【My系列】论坛回复助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  论坛便捷回复助手
// @author       九方耀
// @match        https://bbs.zutuan8.com/*
// @match        https://www.element3ds.com/forum.php?mod*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388377/%E3%80%90My%E7%B3%BB%E5%88%97%E3%80%91%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/388377/%E3%80%90My%E7%B3%BB%E5%88%97%E3%80%91%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //回复文本
    var tempstr = "这次来看看东西好不好"

    //设置适合的域名
    var myurl=new Array()
    myurl[0]="bbs.zutuan8.com"
    myurl[1]="www.element3ds.com"

    //设置域名对应的按钮名称
    var mybtn = new Array()
    mybtn[0] = " 发 布 "
    mybtn[1] = "发表回复"

    //设置设置回复文本所在类名
    var myurlkey = new Array()
    myurlkey[0] = "textarea"
    myurlkey[1] = "textarea"

    //获取当前所在域名
    var url = window.location.host
    var web = window.location.href
    var title = document.getElementsByTagName("title")[0].textContent
    //console.log(url)

    if(window.name == ""){
        console.log("首次被加载");
        window.name = "isReload";

        //设置文本框内容
        for (var i = 0; i < myurl.length; i++) {
            if(url == myurl[i]){
                document.getElementsByTagName(myurlkey[i])[0].value = tempstr
                for(var j = 0; j < 9; j++){
                    if(document.getElementsByTagName("button")[j].textContent == mybtn[i]){
                        var btn = document.getElementsByTagName("button")[j]
                        btn.click()
                        window.location.href = web
                    }
                }
                break;
            }
        }
    }else if(window.name == "isReload"){
        console.log("页面被刷新");
    }

    document.getElementsByTagName("title")[0].textContent = "[已回复]" + title

})();