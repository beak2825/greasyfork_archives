// ==UserScript==
// @name         江西财经大学评教一键好评
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  在江西财经大学评教平台默认全部勾选好评
// @author       Priate
// @match        *://jwxt.jxufe.edu.cn/*
// @match        *://172.29.5.184/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/403930/%E6%B1%9F%E8%A5%BF%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/403930/%E6%B1%9F%E8%A5%BF%E8%B4%A2%E7%BB%8F%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //设定脚本执行延迟时间，默认0.5秒，如脚本不生效请把值改大
    var delay_time = 500

    setTimeout(function(){
        var inp = document.getElementsByTagName('input')
        for(var item in inp){
            //评教系统1 jwxt.jxufe.edu.cn
            if(inp[item].type == 'radio'){
                if(inp[item].getAttribute('djdm') == '01'){
                    inp[item].setAttribute('checked', 'checked')
                }
            }
        }
    }, delay_time)


    if (window.location.href.match(/^.*?172\.29\.5\.184\/framework\/eva\/review\/evapage.\.html\?coursecode=.*?$/)){
        setTimeout(function(){
            var inp = document.getElementsByTagName('input')
            for(var item in inp){
                //评教系统2 172.29.5.184
                if(inp[item].type == 'radio'){
                    //教师好评
                    if(inp[item].getAttribute('value') == '95'){
                        $(inp[item]).click()
                    }
                    //教材好评
                    if(inp[item].getAttribute('name') == 'charge' && inp[item].getAttribute('value') == '1'){
                        $(inp[item]).click()
                    }
                }
            }
            //自动提交
            let commit = document.getElementsByTagName('button');
            if (commit[0].innerHTML && commit[0].innerHTML.match(/^<img.*?>$/) && GM_getValue('isAuto')) {
                commit[0].click();
            }
        }, delay_time)
    }


    // 脚本提示信息
    if (window.location.href.match(/^.*?172\.29\.5\.184\/framework\/eva\/review\/evapage.\.html$/)){
        if(!GM_getValue('hasShowTips')){
            parent.layer.alert("<a style='color:red;'>【这是一条来自脚本的提示】</a></br>提交完成所有表单后还需点击右上方蓝色按钮<a style='color:blue;'>【未完成评教】</a>才可正式计入！若显示<a style='color:green;'>【已完成评教】</a>则忽略本消息！")
            GM_setValue('hasShowTips', true)
        }

        if(GM_getValue('needShowAutoTips')){
            parent.layer.alert("<a style='color:red;'>【这是一条来自脚本的提示】</a></br>请点击右上方黄色按钮<a style='color:blue;'>【关闭一键评教】</a>，否则查看评价界面将一直刷新！")
            GM_setValue('needShowAutoTips', false)
        }

        $('button').before('<button class="layui-btn layui-btn-sm layui-btn-warm" id="doAuto">【一键评教】</button>')
        $('button').first().before('<button class="layui-btn layui-btn-sm layui-btn-warm" id="stopAuto">【关闭一键评教】</button>')
        $('#doAuto').click(()=>{
            parent.layer.confirm("是否直接全部好评?", ()=>{
                GM_setValue('needShowAutoTips', true)
                $('#doAuto').hide()
                $('#stopAuto').show()
                GM_setValue('isAuto', true)
                GM_setValue('hasShowTips', false)
                let autoE = document.getElementsByTagName('button')
                for (let a in autoE) {
                    let ae = autoE[a]
                    if (ae.innerHTML && ae.innerHTML.match(/^<img.*?>$/)) {
                        ae.click()
                    }
                }
                parent.layer.closeAll()
            })
        })
        $('#stopAuto').click(()=>{
            $('#stopAuto').hide()
            $('#doAuto').show()
            GM_setValue('isAuto', false)
            GM_setValue('hasShowTips', false)
            parent.layer.msg("关闭成功！")
        })
        GM_getValue('isAuto') ? $('#doAuto').hide() : $('#stopAuto').hide()
        $('button').first().before('<button class="layui-btn layui-btn-sm layui-btn-danger"><---记得点</button>')
    }
})();