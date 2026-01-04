// ==UserScript==
// @name         知乎/CSDN/QQ/微信/QQ邮箱/微博/百度贴吧/简书/开源中国/掘金/少数派 自动加载重定向
// @namespace    http://luyurui.cn/
// @version      10.5
// @description  努力让中文互联网世界变得更美好！希望对你有帮助！
// @description:en Try to make Chinese Internet World better! Hope to help you!
// @author       Yurui
// @match        *://link.csdn.net/?target=*
// @match        *://link.zhihu.com/?target=*
// @match        *://c.pc.qq.com/*
// @match        *://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?main_type=5&bancode=*
// @match        *://mail.qq.com/cgi-bin/readtemplate?t=safety&check=false&gourl=*
// @match        *://t.cn/*
// @match        *://weibo.cn/sinaurl?toasturl=*
// @match        *://weibo.cn/sinaurl?u=*
// @match        *://www-quic.zhihu.com/*
// @match        *://www.jianshu.com/go-wild?ac=2&url=*
// @match        *://jump.bdimg.com/safecheck/index?url=rN3wPs8te/*
// @match        *://www.oschina.net/action/GoToLink?url=*
// @match        *://link.juejin.cn/?target=*
// @icon         https://images.cnblogs.com/cnblogs_com/luyurui/2022175/o_210829112302%E5%8A%A0%E8%BD%BD.png
// @license      MIT 许可协议
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425631/%E7%9F%A5%E4%B9%8ECSDNQQ%E5%BE%AE%E4%BF%A1QQ%E9%82%AE%E7%AE%B1%E5%BE%AE%E5%8D%9A%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%AE%80%E4%B9%A6%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E6%8E%98%E9%87%91%E5%B0%91%E6%95%B0%E6%B4%BE%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/425631/%E7%9F%A5%E4%B9%8ECSDNQQ%E5%BE%AE%E4%BF%A1QQ%E9%82%AE%E7%AE%B1%E5%BE%AE%E5%8D%9A%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%AE%80%E4%B9%A6%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E6%8E%98%E9%87%91%E5%B0%91%E6%95%B0%E6%B4%BE%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
(function ()
 {
    'use strict';
    let x; // 匹配网站变量，如：是知乎的还是微博的等。
    let url = window.location.href; // 获取当前网页的网址
    let interlinkage_lable; // 用这个变量中转一下
    let interlinkage; // 目的链接

    function all_replace(a, b, c)
    {
        let reg = new RegExp(b, "g");
        a = a.replace(reg, c);
        return a;
    }
    function changeUrl()
    {
        url = all_replace(url, "%3A", ":");
        url = all_replace(url, "%2F", "/");
        url = all_replace(url, "%3F", "?");
        url = all_replace(url, "%3D", "=");
        url = all_replace(url, "%26", "&");
        url = all_replace(url, "%24", "$");
        url = all_replace(url, "%23", "#");
        url = all_replace(url, "%25", "%");
        url = all_replace(url, "&amp;", "&");
        window.location.replace(url);
    }
    if (url.indexOf('://link.zhihu.com/?target=') != -1)
    {
        x = 'zhihu';
    } else if (url.indexOf('://link.csdn.net/?target=') != -1)
    {
        x = 'csdn';
    } else if (url.indexOf('://c.pc.qq.com/middlem.html?pfurl=') != -1)
    {
        x = 'qq';
    } else if (url.indexOf('://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?main_type=5&bancode=') != -1)
    {
        x = 'weixin';
    } else if (url.indexOf('://mail.qq.com/cgi-bin/readtemplate?t=safety&check=false&gourl=') != -1)
    {
        x = 'qqmail';
    } else if(url.indexOf('://weibo.cn/sinaurl?toasturl=') != -1)
    {
        x='weibo';
    }else if(url.indexOf('://weibo.cn/sinaurl?u=') != -1) // 跳转 github 有不安全提示：“网页存在安全风险，为维护绿色上网环境，已停止访问”
    {
        x='weibo';
    }else if(url.indexOf('://t.cn/') != -1)
    {
        x='weibo';
    }else if(url.indexOf('://www-quic.zhihu.com/') != -1)
    {
        x='zhihu_2';
    }else if(url.indexOf('://jump.bdimg.com/safecheck/index?url=rN3wPs8te/') != -1)
    {
        x='baidutieba';
    }else if(url.indexOf('://www.jianshu.com/go-wild?ac=2&url=') != -1)
    {
        x='jianshu';
    }else if(url.indexOf('://www.oschina.net/action/GoToLink?url=') != -1)
    {
        x='oschina';
    }else if(url.indexOf('://link.juejin.cn/?target=') != -1){
        x='juejin';
    }

    switch (x)
    {
        case 'zhihu':
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            if (url.indexOf('https://link.zhihu.com/?target=') != -1)
            {
                url = url.replace("https://link.zhihu.com/?target=", "");
            } else
            {
                url = url.replace("http://link.zhihu.com/?target=", "");
            }
            changeUrl();
            break;

        case 'csdn':
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            if (url.indexOf('https://link.csdn.net/?target=') != -1)
            {
                url = url.replace("https://link.csdn.net/?target=", "");
            }
            else
            {
                url = url.replace("http://link.csdn.net/?target=", "");
            }
            changeUrl();
            break;

        case 'qq':
            interlinkage_lable = document.getElementsByClassName('url')[0].childNodes[1];
            interlinkage = interlinkage_lable.textContent;
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            url = interlinkage;
            alert(url);
            changeUrl();
            break;

        case 'weixin':
            interlinkage_lable = document.getElementsByClassName('weui-msg__desc');
            interlinkage = interlinkage_lable[0].innerHTML;
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            url = interlinkage;
            changeUrl();
            break;

        case 'qqmail':
            interlinkage_lable = document.getElementsByClassName('safety-url');
            interlinkage = interlinkage_lable[0].innerHTML;
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            url = interlinkage;
            changeUrl();
            break;

        case 'weibo':
            interlinkage_lable = document.getElementsByClassName('desc');
            interlinkage = interlinkage_lable[0].innerHTML;
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            interlinkage = interlinkage.replace("http://","https://"); // 将http替换为https，有些http开头的网页打不开
            url = interlinkage;
            changeUrl();
            break;

        case 'zhihu_2':
            interlinkage = all_replace(url, 'www-quic.zhihu.com', 'www.zhihu.com');
            document.execCommand("Stop");
            url = interlinkage;
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            changeUrl();
            break;

        case 'baidutieba':
            interlinkage_lable = document.getElementsByClassName('link');
            interlinkage = interlinkage_lable[0].innerHTML;
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            url = interlinkage;
            changeUrl();
            break;

        case 'jianshu':
            interlinkage_lable = document.getElementsByClassName('_2VEbEOHfDtVWiQAJxSIrVi_0');
            console.log(111);
            interlinkage = interlinkage_lable[0].innerHTML;
            console.log(222);
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            url = interlinkage;
            changeUrl();
            break;

        case 'oschina':
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            if(url.indexOf('https://www.oschina.net/action/GoToLink?url=') != -1) {
                url = url.replace("https://www.oschina.net/action/GoToLink?url=", "");
            } else {
                url = url.replace("http://www.oschina.net/action/GoToLink?url=", "");
            }
            changeUrl();
            break;

        case 'juejin':
            document.getElementsByTagName('html')[0].innerHTML = '正在加载中…';
            if(url.indexOf('https://link.juejin.cn/?target=') != -1) {
                url = url.replace("https://link.juejin.cn/?target=", "");
            } else {
                url = url.replace("http://link.juejin.cn/?target=", "");
            }
            changeUrl();
            break;
    }

    // 定义默认与夜间两种样式
    const day = 'html {height: 80%; display: flex; justify-content: center;} body {font-family: serif;align-self: center; font-size: 1.5em;}';
    const dark = 'html {height: 80%;background-color: rgb(32, 35, 36); display: flex; justify-content: center; }body {color: white; font-family: serif;align-self: center; font-size: 1.5em;}';

    const oStyle = document.createElement('style');
    document.body.appendChild(oStyle);
    oStyle.innerHTML = day;

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) { // 判断电脑是否开启夜间模式（深色模式），如果打开了，返回true。和浏览器是什么主题（明亮或深邃），以及是否打开Dark Reader扩展无关。
        oStyle.innerHTML = dark;
    }

    // 以上个有不足，比如：如果在使用时改变了模式怎么办？可以使用事件监听器来解决。

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            oStyle.innerHTML = dark;
        } else {
            oStyle.innerHTML = day;
        }});
})();