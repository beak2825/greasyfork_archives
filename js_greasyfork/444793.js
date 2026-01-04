// ==UserScript==
// @name         猛犸象内部使用搜题脚本
// @namespace    thecat0r
// @version      0.5
// @description  题目自动跳百度，部分搜题网站VIP绕过
// @author       猫大人
// @match        *://iscc.isclab.org.cn/paper
// @match        *://www.ppkao.com/*
// @match        *://soapi.ppkao.com/*
// @match        *://*.shangxueba.com/*.html
// @match        *://*.asklib.com/*
// @connect      81.70.18.168
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_log
// @grant        GM_openInTab
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/444793/%E7%8C%9B%E7%8A%B8%E8%B1%A1%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8%E6%90%9C%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444793/%E7%8C%9B%E7%8A%B8%E8%B1%A1%E5%86%85%E9%83%A8%E4%BD%BF%E7%94%A8%E6%90%9C%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $=unsafeWindow.$,
        script=GM_info.script,
        url=location.pathname;
      //引入layer弹窗css
    $("head").append('<script src="https://lib.baomitu.com/layui/2.6.8/layui.js"></script>');
    var tm,urls,subject;
    switch(location.host){
        case 'www.ppkao.com':
            tm=$(".single-siti").find(".kt").html()
            $(".answer").removeAttr("onclick")
            $('.answer').on('click', '',answer);
            break;
        case 'www.asklib.com':
            break;
        case location.host.indexOf("shangxueba.com")!=-1?location.host:undefined:
            tm=$(".ask_title").html()
            $(".sub_ans_btn").removeAttr("onclick")
            $('.sub_ans_btn').on('click', '',answer);
            break;
        case 'iscc.isclab.org.cn':
            subject = document.querySelector("body > div:nth-child(4)").textContent.slice(8)
            subject = subject.substring(0,subject.indexOf("\n"))
            //GM_log('https://www.baidu.com/s?wd='+subject)
            GM_openInTab('https://www.baidu.com/s?wd='+subject,{active:true})
            //GM_openInTab('https://www.ppkao.com/so/?q='+subject,{active:true})
            //GM_openInTab('https://www.asklib.com/s/'+subject)
            break;
    }
    //$('#get_da').on('click', '',answer);
     function answer(){
        var load = unsafeWindow.layer.load(2);
        GM_xmlhttpRequest({
            method: 'POST',
            url: "http://81.70.18.168/",
            data:"question="+tm,
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                'referer':location.href,
            },
            timeout: 5000,
            onload: function(xhr) {
                unsafeWindow.layer.close(load);
                if (xhr.status == 200) {
                    var obj = $.parseJSON(xhr.responseText) || {};
                    console.log(obj);
                    if(obj.status==200){
                        var contont="";
                        //$(".single-siti").find("p").html(obj.data[3])选项暂时不加
                        switch(location.host){
                            case 'www.ppkao.com':
                                $("#zhangjieList").remove();
                                $(".tm-bottom").css("height","300px")
                                $("strong.kt").html(obj.question);
                                contont="云端题目："+obj.question+"<br>云端选项:<br>"+obj.option.join('<br>')+"<br>云端参考答案:"+obj.answer+"<br><br>"+obj.msg
                                $(".tm-bottom").html(contont);
                                break;
                            case 'www.asklib.com':
                                break;
                            case location.host.indexOf("shangxueba.com")!=-1?location.host:undefined:
                                 $(".sub_ans_btn").remove();
                                 contont="云端题目："+obj.question+"<br>云端选项:<br>"+obj.option.join('<br>')+"<br>云端参考答案:"+obj.answer+"<br><br>"+obj.msg
                                 $("#div_answer").html(contont);

                                break;
                        }
                    }else{
                        unsafeWindow.layer?unsafeWindow.layer.msg(obj.msg,{icon: 5}):alert(obj.msg);
                    }
                } else if (xhr.status == 203) {
                    obj = $.parseJSON(xhr.responseText) || {};
                    unsafeWindow.layer?unsafeWindow.layer.msg(obj.msg,{icon: 5}):alert(obj.msg);
                } else if (xhr.status == 403) {
                    obj = $.parseJSON(xhr.responseText) || {};
                    unsafeWindow.layer?unsafeWindow.layer.msg(obj.msg,{icon: 5}):alert(obj.msg);
                }else {
                    console.log(xhr.responseText);
                    unsafeWindow.layer?unsafeWindow.layer.msg("题库服务器异常,请稍后再试吧~",{icon: 5}):alert("题库服务器异常,请稍后再试吧~");
                }
            },
            ontimeout: function() {
                unsafeWindow.layer.close(load);
                unsafeWindow.layer?unsafeWindow.layer.msg("题库服务器异常,请稍后再试吧~",{icon: 5}):alert("题库服务器异常,请稍后再试吧~");
            }
        });
    }
    // Your code here...
})();