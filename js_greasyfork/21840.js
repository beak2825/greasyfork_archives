// ==UserScript==
// @name         MyBaiduBing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  baidu首页变成bing
// @author       zhangbohun
// @match   	 *://www.baidu.com/
// @match   	 *://www.baidu.com/home*
// @match   	 *://www.baidu.com/?tn=*
// @match   	 *://www.baidu.com/index.php*
// @grant        GM_xmlhttpRequest
// @run-at 	     document-end
// @downloadURL https://update.greasyfork.org/scripts/21840/MyBaiduBing.user.js
// @updateURL https://update.greasyfork.org/scripts/21840/MyBaiduBing.meta.js
// ==/UserScript==

function setbackground(url,theme){
    //具体设置背景图片的方法
    function setBackgroundIMG(selection,url) {
        //如果自定义了背景，就有background，所以用background
        document.querySelector(selection).style.cssText = 'background:url(' + url + ') no-repeat !important; background-size:cover !important';
    }
    //判断是否登陆了，登录背景设在.s-skin-container
    if (document.querySelector('.user-name') !== null) {
        //需要关闭默认的换肤
        setBackgroundIMG('.s-skin-container',url);
        //首页web2.0半透明
        head.className = 's-skin-hasbg white-logo s-opacity-' + 50;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superplus/css/skin_opacity' + 50 + '.css';//导航框，透明度30
        document.querySelector('head').appendChild(link);
        //显示图片说明
        document.querySelector('.mine-icon').style.display='none';
        document.querySelector('.mine-text').innerHTML='&nbsp;&nbsp;&nbsp;今日壁纸主题：';
        document.querySelector('.s-bg-space.s-opacity-white-background').innerHTML='<b>&nbsp;&nbsp;'+theme+'</b>';
        //隐藏无用信息
        document.querySelector('#s_lm_wrap').style.display='none';
        document.querySelector('#bottom_container').style.display='none';
    }
    else {
        //未登录，背景设在#body
        setBackgroundIMG('body',url);
        //隐藏无用信息
        //document.querySelector('#u1').style.display='none';//上面的横条不隐藏，不然没有登录的地方了。。
        document.querySelector('#ftCon').style.display='none';
    }
}

//主函数，程序入口
(function() {
    'use strict';
    if(document.querySelector('#lg img').attributes['src'].value=='https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
       ||document.querySelector('#lg img').attributes['src'].value=='http://ss.bdimg.com/static/superman/img/logo/bd_logo1_31bdc765.png'
       || document.querySelector('#lg img').attributes['src'].value=='//www.baidu.com/img/bd_logo1.png')//如果是普通logo就换成白色透明版，节日特殊logo不换了吧
    {
        //设置白色logo
        document.querySelector('#lg img').attributes['src'].value='https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superplus/img/logo_white_ee663702.png';
    }
    if(localStorage.date==new Date().getDate())//判断是否有缓存图片地址
    {
        setbackground(localStorage.imgUrl,localStorage.theme);
    }
    else
    {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-cn',
            onload: function(response) {
                var data = JSON.parse(response.responseText);
                var imgUrl = 'https://www.bing.com' + data.images[0].url;//图片完整路径
                var tmpImg = new Image();//提前下载
                tmpImg.src = imgUrl;
                var theme=data.images[0].copyright;
                tmpImg.onload = function () {
                    setbackground(imgUrl,theme);
                    localStorage.date=new Date().getDate();
                    localStorage.imgUrl=imgUrl;//缓存图片地址，如果可以直接缓存图片就好了，暂时还不会。
                    localStorage.theme=theme;
                };
            }
        });
    }
})();