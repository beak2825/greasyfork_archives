// ==UserScript==
// @name        anti-addiction 
// @namespace   passer.com
// @version     9.0.0
// @author      amateur
// @description 防沉迷
// @match       *://*/*
// @exclude     *://*.baidu.com/*
// @exclude     *://*.bing.com/*
// @exclude     *://*.google.com/*
// @exclude     *://*.google.com.hk/*
// @exclude     *://*.csdn.*/*
// @exclude     *://*.github.*/*
// @exclude     *://*.gitee.*/*
// @exclude     *://greasyfork.org/*
// @exclude     *://github.*/*
// @exclude     *://gitee.*/*
// @exclude     *://im.qq.*/*
// @exclude     *://weixin.qq.*/*
// @exclude     *://wx.qq.*/*
// @exclude     *://mail.163.*/*
// @exclude     *://*.cnglobs.*/*
// @exclude     *://mail.qq.*/*
// @exclude     *://qzone.qq.*/*
// @exclude     https://tj.122.gov.cn/#/index
// @exclude     http://xkctk.jtys.tj.gov.cn/*
// @exclude     *://*.microsoft.*/*
// @exclude     https://xydh.fun/*
// @exclude     *://*.youdao.*/*
// @exclude     *://*.lanzous.*/*
// @exclude     *://ke.qq.*/*
// @exclude     *://study.163.*/*
// @exclude     *://*.dingtalk.*/*
// @exclude     *://*.zhihu.*/*
// @exclude     *://*.icourse163.*/*
// @exclude     *://*.xuetangx.*/*
// @exclude     *://*.yuketang.*/*
// @exclude     *://*.tencent.*/*
// @exclude     *://www.qq.com/*
// @exclude     https://www.ipaddress.com/*
// @exclude     *://*.intel.*/*
// @exclude     *://*.aliyun.*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/402989/anti-addiction.user.js
// @updateURL https://update.greasyfork.org/scripts/402989/anti-addiction.meta.js
// ==/UserScript==




var myDate = new Date();
var countTime = function(){
        var hour = myDate.getHours(); //获取当前时间
        if(11 > hour || hour > 13 && hour < 18)  
            // window.location.href = 'http://qiubaiying.vip/404.html';
            /*chrome、火狐浏览器中close()只能关闭open()打开的网页*/
            window.open(location.href,'_self');
            window.close();
    }
            
var timer1 = window.setInterval(countTime,1000);
