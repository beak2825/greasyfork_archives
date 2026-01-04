// ==UserScript==
// @name         演示环境超管平台增强版
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  演示环境，超级管理平台的增强插件，实用功能！
// @author       You
// @match        https://vopoc.ths123.com/callout-ths/public/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @icon         https://vopoc.ths123.com/callout-ths/public/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390509/%E6%BC%94%E7%A4%BA%E7%8E%AF%E5%A2%83%E8%B6%85%E7%AE%A1%E5%B9%B3%E5%8F%B0%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/390509/%E6%BC%94%E7%A4%BA%E7%8E%AF%E5%A2%83%E8%B6%85%E7%AE%A1%E5%B9%B3%E5%8F%B0%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==


(function() {
    //快捷链接配置页，大家可按需根据自定义添加
    var url1="https://vopoc.ths123.com/callout-ths/public/index.html#/task/template/config/2000324/2/4000000/2/dialogue"
    url1='"'+url1+'"'
    var title1='快捷窗口:两融到期'
    var url2="https://vopoc.ths123.com/callout-ths/public/index.html#/task/template/config/2000386/2/4000000/2/dialogue"
    url2='"'+url2+'"'
    var title2='快捷窗口:电信100M'


    setTimeout(function(){
        var header=$('.header___3HlWc')       //定义header变量


        var url = window.location.href
        var templateId

        header.append('<a href='+url1+'style="color:white;margin:10px">'+title1+'</a>')
        header.append('<a href='+url2+'style="color:white;margin:10px">'+title2+'</a>')
        header.append('<a href="https://vopoc.ths123.com/callout-ths/public/index.html#/account/manage/profile/81000002/2/task" style="color:white;margin:10px">同花顺测试账户</a>')
        header.append('<a href="http://aics.ths123.com:10080/callout-thirdparty/public/index.html#/" style="color:Darkorange ;margin:10px" target="_blank" class="ant-btn">客户管理平台</a>')

        if (/config\/(.*?)\//.test(url)){
            templateId = url.match(/config\/(.*?)\//)[1]
            $.get("https://vopoc.ths123.com/callout-ths/background/template/detail?templateId="+templateId,function(data){
            var source = data.data.source
            $('.breadcrumb___3RcO3').append('<span><a class="copy_source" size=40px>'+source+'</a></span>')
            $('.copy_source').bind("click",function(){
                var date = formatTime(data.data.createInfo.time,'Y年M月D日 h:m:s')
                alert(data.data.createInfo.userName+' 创建于：\n'+date)
            })
        })
        }

    },200)

    //让网页标题显示当前模板
    $(function(){setInterval(function(){
        var title2
        if($('.title___1-vbA').text().length>0){
            //console.log($('.title___1-vbA').text().length)
            title2=$('.title___1-vbA').text()
            $('title').text(title2)
        }
    },2000)})
})();




// 格式化日期，如月、日、时、分、秒保证为2位数
function formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n;
}
// 参数number为毫秒时间戳，format为需要转换成的日期格式
function formatTime (number, format) {
    let time = new Date(number)
    let newArr = []
    let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
    newArr.push(time.getFullYear())
    newArr.push(formatNumber(time.getMonth() + 1))
    newArr.push(formatNumber(time.getDate()))

    newArr.push(formatNumber(time.getHours()))
    newArr.push(formatNumber(time.getMinutes()))
    newArr.push(formatNumber(time.getSeconds()))

    for (let i in newArr) {
        format = format.replace(formatArr[i], newArr[i])
    }
    return format;
}
