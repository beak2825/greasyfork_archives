// ==UserScript==
// @name         Baidu首页动态增加壁纸
// @namespace    baidu
// @version      1.0.0
// @description  首页动态更换壁纸-可复制模式
// @author       anonymous
// @match   	 *://www.baidu.com/
// @match   	 *://www.baidu.com/home*
// @match   	 *://www.baidu.com/?tn=*
// @match   	 *://www.baidu.com/index.php*
// @grant        GM_xmlhttpRequest
// @run-at 	     document-end
// @downloadURL https://update.greasyfork.org/scripts/396972/Baidu%E9%A6%96%E9%A1%B5%E5%8A%A8%E6%80%81%E5%A2%9E%E5%8A%A0%E5%A3%81%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/396972/Baidu%E9%A6%96%E9%A1%B5%E5%8A%A8%E6%80%81%E5%A2%9E%E5%8A%A0%E5%A3%81%E7%BA%B8.meta.js
// ==/UserScript==
'use strict';

//主函数，程序入口
window.onload =mainBaiDuIndexFun;
 function mainBaiDuIndexFun() {
    if (document.querySelector('#lg img').attributes['src'].value == 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/bd_logo1_31bdc765.png'
        || document.querySelector('#lg img').attributes['src'].value == 'http://ss.bdimg.com/static/superman/img/logo/bd_logo1_31bdc765.png'
        || document.querySelector('#lg img').attributes['src'].value == '//www.baidu.com/img/pcindex_small.png?where=super'
        || document.querySelector('#lg img').attributes['src'].value == '//www.baidu.com/img/bd_logo1.png?where=super'
        || document.querySelector('#lg img').attributes['src'].value == '//www.baidu.com/img/bd_logo1.png')//如果是普通logo就换成白色透明版，节日特殊logo不换了吧
    {
        //设置白色logo，https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superplus/img/logo_white_ee663702.png
        document.querySelector('#lg img').attributes['src'].value = 'data:image/png;base64,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';
    }
    if (localStorage.date == new Date().getDate())//判断是否有缓存图片地址
    {
        _setbackground(localStorage.imgUrl, localStorage.theme);
    }
    else {
       _fetchImg()
    }
     _weekShow();
     _weatherShow()
};
function _setbackground(url, theme) {
    //具体设置背景图片的方法
    function setBackgroundIMG(selection, url) {
        //如果自定义了背景，就有background，所以用background
        document.querySelector(selection).style.cssText = 'background:url(' + url + ') no-repeat !important; background-size:cover !important';
    }

    //判断是否登陆了，登录背景设在.s-skin-container
    if (document.querySelector('.user-name') !== null) {
        //需要关闭默认的换肤
        setBackgroundIMG('.s-skin-container', url);
        //首页web2.0半透明
        head.className = 's-skin-hasbg white-logo s-opacity-' + 80;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superplus/css/skin_opacity' + 80 + '.css';//导航框，透明度30
        document.querySelector('head').appendChild(link);
        //显示图片说明
        //document.querySelector('.s-ctner-menus').style.display = 'none';
        //document.querySelector('.mine-icon').style.display = 'none';
       // document.querySelector('.mine-text').innerHTML = '&nbsp;&nbsp;&nbsp;今日壁纸主题：';
       // document.querySelector('.s-bg-space.s-opacity-white-background').innerHTML = '<b>&nbsp;&nbsp;' + theme + '</b>';
        //隐藏无用信息
        document.querySelector('#s_lm_wrap').style.display = 'none';
        document.querySelector('#bottom_container').style.display = 'none';
        document.querySelector('.s-more-bar').style.display = 'none';
    }
    else {
        //未登录，背景设在#body
        setBackgroundIMG('body', url);
        //隐藏无用信息
        //document.querySelector('#u1').style.display='none';//上面的横条不隐藏，不然没有登录的地方了。。
        document.querySelector('#ftCon').style.display = 'none';
    }
}
function _fetchImg(){
     var mathRandom=Math.floor(Math.random()*8);
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx='+mathRandom+'&n=1&mkt=zh-cn',
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                var imgUrl = 'https://www.bing.com' + data.images[0].url;//图片完整路径
                var theme = data.images[0].copyright;
                _setbackground(imgUrl, theme);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imgUrl,
                    responseType: "blob",
                    onload: function (response) {
                        var myBlob = response.response;
                        var myFReader = new FileReader();
                        myFReader.readAsDataURL(myBlob);
                        myFReader.onload = function (myFREvent) {
                            var Base64DataURLString = myFREvent.target.result;
                            //console.log(Base64DataURLString);
                            localStorage.imgUrl = Base64DataURLString;//缓存图片Base64 DataURL地址，直接缓存图片！
                            localStorage.date = new Date().getDate();
                            localStorage.theme = theme;
                        };
                    }
                });
            }
        });
}
function _weekShow(){
        /*增加日历显示
    代码来自https://greasyfork.org/zh-CN/scripts/25202-%E7%99%BEbing%E5%9B%BE，感谢hoothin
    homepage: http://www.hoothin.com
    email: rixixi@gmail.com
    License of my scripts which signed "N/A" are all MIT,copy after include information above before use please
     */
    var icons = document.querySelector("#s_icons");
    var riliLink = document.createElement("a"),changeSkinLink = document.createElement("a"), date = new Date();
    var iframe = document.createElement("iframe");
    iframe.src = "/s?wd=%E6%97%A5%E5%8E%86";
    iframe.setAttribute("scrolling", "no");
    iframe.style.display = "none";
    iframe.style.top = "30px";
    iframe.style.left = "0px";
    iframe.style.position = "absolute";
    iframe.style.zIndex = "999";
    var sUpfuncMenus = document.querySelector("#s_upfunc_menus");
    if (!sUpfuncMenus) {
        sUpfuncMenus = document.querySelector(".head_wrapper");
        iframe.style.top = "50px";
        iframe.style.left = "";
        iframe.style.right = "0px";
    }
    if (sUpfuncMenus) {
        sUpfuncMenus.appendChild(iframe);
    }
    var dateDay = date.getDate(), dateMonth = date.getMonth() + 1;
    if (dateDay < 10) dateDay = "0" + dateDay;
    if (dateMonth < 10) dateMonth = "0" + dateMonth;
    var week = ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"];
    riliLink.innerHTML = "<span class='title' style='text-decoration:overline;cursor:pointer'>" + date.getFullYear() + "-" + dateMonth + "-" + dateDay + " " + "\u661f\u671f" + week[date.getDay()] + "</span>";
    changeSkinLink.innerHTML = "<span class='title' style='color:red;text-decoration:underline;font-weight:700;cursor:pointer'>点击切换皮肤</span>";
    if (icons){ icons.appendChild(riliLink);icons.appendChild(changeSkinLink);}
    iframe.onload = function () {
        var contentHead = this.contentWindow.document.querySelector("#head");
        if (contentHead && contentHead.parentNode) contentHead.parentNode.removeChild(contentHead);
        var $ = unsafeWindow.$;
        var iframeDoc = $(iframe.contentDocument);
        var rili = $("div.op-calendar-pc", iframe.contentDocument);
        rili.after("<br/><br/>");
        $("#head,.head_nums_cont_outer", iframe.contentDocument).hide();
        iframe.setAttribute("scrolling", "no");
        var today = $(".op-calendar-pc-table-border,.op-calendar-pc-table-today", iframe.contentDocument);
        var t;
        //riliLink.innerHTML = "<span class='title' style='text-decoration:overline;cursor:pointer'>" + $(".op-calendar-pc-right-date", iframe.contentDocument).html() + "</span>";
        riliLink.onmouseover = function () {
            t = setTimeout(function () {
                $(iframe).show(200);
                var top = rili.offset().top;
                var left = rili.offset().left;
                if (top === 0) top = 138;
                iframeDoc.scrollTop(top);
                if (left === 0) left = 121;
                iframeDoc.scrollLeft(left);
                var width = rili.width();
                var height = rili.height();
                iframe.width = width === 0 ? 538 : width;
                iframe.height = height === 0 ? 366 : height;
            }, 100);
        };
        riliLink.onmouseout = function () {
            clearTimeout(t);
        };
        changeSkinLink.onclick = function () {
            _fetchImg()
        };
        iframe.onmouseout = function () {
            $(iframe).hide(100);
        };
        if (today[0].classList.contains("op-calendar-pc-table-festival")) {
            var title = today[0].title || $(".op-calendar-pc-table-almanac", today).text();
            riliLink.innerHTML += title ? " <font color='#FFFF66' style='background-color:#e02d2d;font-weight:bold'>(" + title + ")</font>" : "";
            riliLink.title = title;
        }
    };
}
function _weatherShow(){
    var icons = document.querySelector("#s_icons");
    var weatherLink = document.createElement("a")
    var iframe = document.createElement("iframe");
    var city=document.querySelector('.show-city-name').getAttribute('data-key');
    iframe.src = "/s?wd="+city+'天气预报';
    iframe.setAttribute("scrolling", "no");
    iframe.style.display = "none";
    iframe.style.top = "30px";
    iframe.style.left = "0px";
    iframe.style.position = "absolute";
    iframe.style.zIndex = "999";
    var sUpfuncMenus = document.querySelector("#s_upfunc_menus");
    if (!sUpfuncMenus) {
        sUpfuncMenus = document.querySelector(".head_wrapper");
        iframe.style.top = "50px";
        iframe.style.left = "";
        iframe.style.right = "0px";
    }
    if (sUpfuncMenus) {
        sUpfuncMenus.appendChild(iframe);
    }
    weatherLink.innerHTML = "<span class='title' style='color:red;text-decoration:underline;font-weight:700;cursor:pointer'>查看" +city + "天气</span>";
    if (icons){ icons.appendChild(weatherLink);}
    iframe.onload = function () {
        var contentHead = this.contentWindow.document.querySelector("#head");
        if (contentHead && contentHead.parentNode) contentHead.parentNode.removeChild(contentHead);
        var $ = unsafeWindow.$;
        var iframeDoc = $(iframe.contentDocument);
        var rili = $(".op_weather4_twoicon_container_div", iframe.contentDocument);
        rili.after("<br/><br/>");
        $("#head,.head_nums_cont_outer", iframe.contentDocument).hide();
        iframe.setAttribute("scrolling", "no");
        var t;
        console.log($(rili).offset());
        //weatherLink.innerHTML = "<span class='title' style='text-decoration:overline;cursor:pointer'>" + $(".op-calendar-pc-right-date", iframe.contentDocument).html() + "</span>";
        weatherLink.onmouseover = function () {
            t = setTimeout(function () {
                $(iframe).show(200);
                var top = rili.offset().top;
                var left = rili.offset().left;
                if (top === 0) top = 138;
                iframeDoc.scrollTop(top);
                if (left === 0) left = 121;
                iframeDoc.scrollLeft(left);
                var width = rili.width();
                var height = rili.height();
                iframe.width = width === 0 ? 538 : width;
                iframe.height = height === 0 ? 366 : height;
            }, 100);
        };
        weatherLink.onmouseout = function () {
            clearTimeout(t);
        };
        iframe.onmouseout = function () {
            $(iframe).hide(100);
        };

    };
}

