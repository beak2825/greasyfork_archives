// ==UserScript==
// @name         淘宝采集
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  自动进行淘宝采集功能-定制化
// @author       You
// @match        https://t.chachazhan.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/454778/%E6%B7%98%E5%AE%9D%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/454778/%E6%B7%98%E5%AE%9D%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);
let scriptjs = document.createElement('script');
    scriptjs.setAttribute('type', 'text/javascript');
    scriptjs.src = "https://www.layuicdn.com/layer-v3.5.1/layer.js";
    document.documentElement.appendChild(scriptjs);
var urlduankou = "tbjx.yu1998.com/prod-api"
var url ="https://"+urlduankou+"/cj/";
(function() {
    'use strict';

    // Your code here...

    //先判断是否存在配置数据

    //当前任务是否暂停
    localStorage.setItem('zanting', 'false');
    // console.log(pachong)
    //延时执行能正常的加载
    setTimeout(function () {

        var thisUrl = "https://t.chachazhan.com/app/#/titleOptimize/searchKeyword"
        var isUrl = window.location.href
        if(thisUrl != isUrl){
            //进入到官网以后跳转到对应的搜索词库页面
            window.location.href = "https://t.chachazhan.com/app/#/titleOptimize/searchKeyword"
        }
        var token = localStorage.mc_auth_token
        addys()
        var ws = new WebSocket("wss://"+urlduankou+"/websocket/message");
        ws.onopen = function(evt) {
            console.log("Connection open ...");
            ws.send("Hello WebSockets!");
        };
        ws.onmessage = function(evt) {
            console.log("Received Message: " + evt.data);
            var type = evt.data;
            var lanjie =  localStorage.getItem("lanjie");
            if (type == "1" && lanjie !="true") {
                console.log("刷新token" );
                localStorage.setItem("lanjie","true");
                location.reload(true)
            }
            if(type == "1" && lanjie =="true"){
                console.log("更换token" );
                $.get(url+"upDateToken",{token},function(res){
                    localStorage.setItem("lanjie","false");
                })
            }
            if(type == "0" && lanjie !="true"){
                //先切换用户 并写入lanjie为true
                //
                console.log("切换用户" );
                document.getElementsByClassName("ant-btn mr-2")[0].click()
                var btns = document.getElementsByClassName("flex-items-center flex-justify-between");
				if(btns.length<=1){
                    localStorage.setItem("lanjie","true");
                    btns[0].getElementsByClassName("ant-btn")[0].click();
                }else {
                    var i = 0;
                    var ii = Number(localStorage.getItem("userNum"))
                    if(ii<btns.length && ii !== undefined){
                        i=ii
                    }else{
                        localStorage.setItem("userNum",0)
                        $.get(url+"endCj",{},function(res){
                            window.open(url + "export",'_blank');
                        })
                    }
                    for (; i < btns.length; i++){
                        localStorage.setItem("userNum",Number(i)+1)
                        localStorage.setItem("lanjie","true");
                        btns[i].getElementsByClassName("ant-btn")[0].click();
                    }
                }
            }
            if(type == "0" && lanjie =="true"){
                $.get(url+"upDateToken",{token},function(res){
                    localStorage.setItem("lanjie","false");
                })
            }
            if (type == "2" ) {
                $.get(url+"endCj",{},function(res){
                    var ceshi = '<div style="text-align:right"><form  id="form2">'+
                '    <label for="fname">开始时间</label>'+
                '    <input type="date" id="startDate" name="startDate" value="" pattern="yyyy-MM-dd"><br><br>'+
                '    <label for="fname">结束时间</label>'+
                '    <input type="date" id="endDate" name="endDate" value="" pattern="yyyy-MM-dd"><br><br>'+
                '</form></div>'
                layer.open({
                    title: '配置管理'
                    ,content: ceshi
                    ,yes: function(index, layero){
                        //do something
                        let startDate=$('#startDate').val()
                        let endDate=$('#endDate').val()

                        layer.close(index);
                        window.location.here = url+"export?startDate="+startDate+"&endDate="+endDate

                    }
                });
                })


            }

        };

     }, 1000*2);

})();

/**增加元素 */
function addys() {
    //获取本地的缓存值
    // var pachong1 = JSON.parse(localStorage.getItem("pachong"))
    $('.flex-items-center.icons').prepend('<button type="button" id = "tanchu" class="ant-btn mr-1" ><span>配置管理</span></button>')
    $('.flex-items-center.icons').on('click','#tanchu',function(e){
        var config = {};

        $.ajaxSettings.async = false;
        $.get(url+"getConfig",'',function(res){
            console.log(res);
            config = res.data
        })
        var bioadan = '<div style="text-align:right"><form  id="form1">'+
        '    <label for="fname">大于1千小于2千：</label>'+
        '    <input type="number" id="da1xiao2" name="da1xiao2" value="'+config.da1xiao2+'"><br><br>'+
        '    <label for="fname">大于2千小于5千：</label>'+
        '    <input type="number" id="da2xiao5" name="da2xiao5" value="'+config.da2xiao5+'"><br><br>'+
        '    <label for="fname">大  于  5  千：</label>'+
        '    <input type="number" id="da5" name="da5" value="'+config.da5+'"><br><br>'+
        '    <label for="fname">忽 略 词：</label>'+
        '    <input type="text" id="hulve" name="hulve" placeholder="英文格式逗号分隔" value="'+config.hulve+'"><br><br>'+
        '    <label for="fname">是否从数据库查询类型：</label>'+
        '    <input type="number" id="iftype" name="iftype" placeholder="0为数据库1为网站" value="'+config.iftype+'"><br><br>'+
        '    <label for="fname">账号数量</label>'+
        '    <input type="number" id="accountNum" name="accountNum" placeholder="0为数据库1为网站" value="'+config.accountNum+'"><br><br>'+
        '</form></div>'
        layer.open({
            title: '配置管理'
            ,content: bioadan
            ,yes: function(index, layero){
                //do something
                config.da1xiao2=$('#da1xiao2').val()
                config.da2xiao5=$('#da2xiao5').val()
                config.da5=$('#da5').val()
                config.hulve=$('#hulve').val()
                config.iftype=$('#iftype').val()
                config.accountNum=$('#accountNum').val()
                $.ajaxSettings.async = false;
                $.get(url+"setConfig",config,function(res){
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    layer.msg('配置完成，请点击开始！');
                })

            }
        });

    })
    $('.flex-items-center.icons').prepend('<button type="button" id = "xiazai" class="ant-btn mr-1" ><span>下载数据</span></button>')
    $('.flex-items-center.icons').on('click','#xiazai',function(e){
        // layer.msg('只能下载最近12小时以前的数据！');
        //进行配置时暂停
        // window.open(url + "export",'_blank');
        // $.get(url+"getExport",'',function(res){
        //     if(res.data != "0"){
        //         window.open(url + "export",'_blank');
        //     }else {
        //         layer.msg('正在采集或者采集超过24小时');
        //     }
        // })
        var ceshi = '<div style="text-align:right"><form  id="form2">'+
        '    <label for="fname">开始时间</label>'+
        '    <input type="date" id="startDate" name="startDate" value="" pattern="yyyy-MM-dd"><br><br>'+
        '    <label for="fname">结束时间</label>'+
        '    <input type="date" id="endDate" name="endDate" value="" pattern="yyyy-MM-dd"><br><br>'+

        '</form></div>'
        layer.open({
            title: '配置管理'
            ,content: ceshi
            ,yes: function(index, layero){
                //do something
                let startDate=$('#startDate').val()
                let endDate=$('#endDate').val()
                window.open(url+"export?startDate="+startDate+"&endDate="+endDate,'_blank')
                layer.close(index);

            }
        });

    })
    $('.flex-items-center.icons').prepend('<button type="button" id = "stopCj" class="ant-btn mr-1" ><span>停止采集</span></button>')
    $('.flex-items-center.icons').on('click','#stopCj',function(e){
        // layer.msg('只能下载最近12小时以前的数据！');
        //进行配置时暂停
        // window.open(url + "export",'_blank');
         $.get(url+"endCj",{},function(res){
            // window.open(url + "export",'_blank');
        })

    })
    $('.flex-items-center.icons').prepend('<button type="button" id = "kaishi" class="ant-btn mr-1" ><span>开始采集</span></button>')
    $('.flex-items-center.icons').on('click','#kaishi',function(e){
        //进行配置时暂停
        layer.msg('开始采集');
        var token = localStorage.mc_auth_token
        $.get(url+"startCj",{token},function(res){

        })
    })

}
