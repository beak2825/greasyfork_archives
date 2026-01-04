// ==UserScript==
// @name         去除CSDN需要关注才能展开看到下面文章
// @namespace    JBren
// @version      0.1
// @description  自由观看CSDN
// @author       JBren
// @icon         https://img-home.csdnimg.cn/images/20210810112254.png
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @match        https://blog.csdn.net/*
// @downloadURL https://update.greasyfork.org/scripts/460076/%E5%8E%BB%E9%99%A4CSDN%E9%9C%80%E8%A6%81%E5%85%B3%E6%B3%A8%E6%89%8D%E8%83%BD%E5%B1%95%E5%BC%80%E7%9C%8B%E5%88%B0%E4%B8%8B%E9%9D%A2%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/460076/%E5%8E%BB%E9%99%A4CSDN%E9%9C%80%E8%A6%81%E5%85%B3%E6%B3%A8%E6%89%8D%E8%83%BD%E5%B1%95%E5%BC%80%E7%9C%8B%E5%88%B0%E4%B8%8B%E9%9D%A2%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

//等待某个元素加载
jQuery.fn.wait = function (func, times, interval) {
    var _times = times || 100, //100次
        _interval = interval || 20, //20毫秒每次
        _self = this,
        _selector = this.selector, //选择器
        _iIntervalID; //定时器id
    if( this.length ){ //如果已经获取到了，就直接执行函数
        func && func.call(this);
    } else {
        _iIntervalID = setInterval(function() {
            if(!_times) { //是0就退出
                clearInterval(_iIntervalID);
            }
            _times <= 0 || _times--; //如果是正数就 --
            _self = $(_selector); //再次选择
            if( _self.length ) { //判断是否取到
                func && func.call(_self);
                clearInterval(_iIntervalID);
            }
        }, _interval);
    }
    return this;
}

//当登录遮挡加载完毕调用上面函数执行后面函数
$(".hide-article-box").wait(function(){Clearing();})

function Clearing(){
    $(".hide-article-box").remove();
    $("#article_content").css("height","")
    alert("免登陆自动展开")
}