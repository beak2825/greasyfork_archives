// ==UserScript==
// @name         理财自用插件
// @namespace    http://tampermonkey.net/
// @version      12.0
// @description  理杏仁辅助增强
// @author       李富全
// @match        *://cn.bing.com/*
// @match        *://www.lixinger.com/*
// @match        *://www.lixinger.com/*
// @match        *://www.jisilu.cn/*
// @icon         https://www.lixinger.com/static/img/logo50x50.png
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @require      https://cdn.jsdelivr.net/npm/jquery@2.1.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/435356/%E7%90%86%E8%B4%A2%E8%87%AA%E7%94%A8%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/435356/%E7%90%86%E8%B4%A2%E8%87%AA%E7%94%A8%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle('#send-btn{color: white;position: absolute;left: 240px;top: 200px;width: 100px;height: 36px;background: #3385ff;border-bottom: 1px solid #2d7');
    var btn = "<input type='button' id='send-btn' value='Send'/>";
    $("body").append(btn);
    // 定义按钮事件
    $("#send-btn").click(function(){
        GM_xmlhttpRequest({
          url: "http://www.example.com",
          method: "GET",
          onload: function(response) {
            alert(response.responseText);
          }
        });

    });
    //将结果输到页面
    $("body").ready(function(){
        //根据高度，设置样式
        let width=screen.width;
        let css;
        if(width>1000){
            //以下是电脑
            $("body").prepend("<div class='Allresult' id='_Allresult3'><table class='content' id='discount_rt'></table></div>");
            $("body").prepend("<div class='Allresult' id='_Allresult2'><table class='content' id='lowcnv'></table></div>");
            $("body").prepend("<div class='Allresult' id='_Allresult1'><table class='content' id='cnv'></table></div>");
            $("body").prepend("<div class='Allresult' id='_Allresult0'><table class='content' id='castSurely'></table></div>");
            $("#castSurely").prepend("<tr><th>基金名称</th><th>估值</th><th>定投金额</th><th>数据采用日期</th><th>定投数据来源</th><th>网格建议/1年</th><th>网格建议/近6个月</th><th>网格数据来源</th></tr><tr id='_H30533'></tr><tr id='_H11136'></tr><tr id='_930743'></tr><tr id='_399989'></tr><tr id='_HSIII'></tr><tr id='_HSTECH'></tr><tr id='_012348'></tr><tr id='_950090'></tr><tr id='_000919'></tr><tr id='_SH000170_L'></tr><tr id='_000919_L'></tr></tr>");
            $("#cnv").prepend("<tr><th>可转债名称</th><th>溢价率</th><th>主体评级</th><th>债券评级</th><th>是否打新</th><th>申购日期</th></tr>");
            $("#lowcnv").prepend("<tr><th>可转债名称</th><th>溢价率</th><th>现价</th><th>主体评级</th><th>债券评级</th><th>投资建议</th></tr>");

            //插入按钮
            $("body").prepend("<div id='btn'></div>");
            $("#btn").prepend("<div class='_btn' id='_btn3' title='数据来源：集思录'>溢价率查询</div>");
            $("#btn").prepend("<div class='_btn' id='_btn2' title='数据来源：集思录'>双低可转债</div>");
            $("#btn").prepend("<div class='_btn' id='_btn1' title='数据来源：集思录'>可转债打新</div>");
            $("#btn").prepend("<div class='_btn' id='_btn0' title='数据来源：理杏仁；银行螺丝钉'>定投</div>");
            $("#btn").prepend("<div class='_btn' id='_grade'></div>");
            $("#_btn0").click(function(){
                //点击定投按钮
                //可转债打新表隐藏，定投表出现
                $("#_Allresult1").css("top","-100%");
                $("#_Allresult2").css("top","-100%");
                $("#_Allresult3").css("top","-100%");
                //定投表隐藏和出现
                var top=$("#_Allresult0").css("top");
                if(top=="50px"){
                    $("#_Allresult0").css("top","-100%");
                }else{
                    $("#_Allresult0").css("top","50px");
                }
            });
            $("#_btn1").click(function(){
                //点击可转债按钮
                //定投表隐藏，可转债打新表出现
                $("#_Allresult0").css("top","-100%");
                $("#_Allresult2").css("top","-100%");
                $("#_Allresult3").css("top","-100%");
                //可转债打新表隐藏和出现
                var top=$("#_Allresult1").css("top");
                if(top=="50px"){
                    $("#_Allresult1").css("top","-100%");
                }else{
                    $("#_Allresult1").css("top","50px");
                }
            });
            $("#_btn2").click(function(){
                //点击双低可转债按钮
                //定投表、可转债打新表隐藏，双低可转债表出现
                $("#_Allresult0").css("top","-100%");
                $("#_Allresult1").css("top","-100%");
                $("#_Allresult3").css("top","-100%");
                //双低可转债表表隐藏和出现
                var top=$("#_Allresult2").css("top");
                if(top=="50px"){
                    $("#_Allresult2").css("top","-100%");
                }else{
                    $("#_Allresult2").css("top","50px");
                }
            });
            $("#_btn3").click(function(){
                //点击双低可转债按钮
                //定投表、可转债打新表隐藏，双低可转债表出现
                $("#_Allresult0").css("top","-100%");
                $("#_Allresult1").css("top","-100%");
                $("#_Allresult2").css("top","-100%");
                //双低可转债表表隐藏和出现
                var top=$("#_Allresult3").css("top");
                if(top=="50px"){
                    $("#_Allresult3").css("top","-100%");
                }else{
                    $("#_Allresult3").css("top","50px");
                }
            });
            //按钮选中动画
            $("._btn").mouseleave(function(){
                $("._btn").css({"width":"120px","margin-left":"25px"});
            });
            $("#_btn0").mousemove(function(){
                $("._btn").css({"width":"120px","margin-left":"25px"});
                $("#_btn0").css({"width":"145px","margin-left":"0px"});
            });
            $("#_btn1").mousemove(function(){
                $("._btn").css({"width":"120px","margin-left":"25px"});
                $("#_btn1").css({"width":"145px","margin-left":"0px"});
            });
            $("#_btn2").mousemove(function(){
                $("._btn").css({"width":"120px","margin-left":"25px"});
                $("#_btn2").css({"width":"145px","margin-left":"0px"});
            });
            $("#_grade").mousemove(function(){
                $("._btn").css({"width":"120px","margin-left":"25px"});
                $("#_grade").css({"width":"145px","margin-left":"0px"});
            });
            css='#btn{position:fixed;top:36%;right:0px;width:145px;z-index:100000;font-size:1.2vw;cursor: pointer;}._btn{width:120px;margin-bottom:5px;margin-left:25px;line-height:45px;height:45px;background:#007bff;color:#FFF;border-radius:25px 0px 0px 25px;text-align:center;}.Allresult{position:fixed;top:-100%;width:100%;max-height:600px;overflow-y:scroll;z-index:9999;font-size:1.2vw;cursor: pointer;border:1px solid #007bff;background:#FFF;color:#007bff;transition:all 1s;-moz-transition: all 1s; -webkit-transition: all 1s; -o-transition: all 1s;}.content{margin:0px auto;}.content th{padding:5px 10px;vertical-align: center;border-bottom: 2px solid #007bff;text-align:center}.content td{padding:5px 10px;vertical-align:center;text-align:center}a{color:#007bff}';
        }else{
            //以下是手机
            $("body").prepend("<div class='Allresult' id='_Allresult3'><table class='content' id='discount_rt'></table></div>");
            $("body").prepend("<div class='Allresult' id='_Allresult2'><table class='content' id='lowcnv'></table></div>");
            $("body").prepend("<div class='Allresult' id='_Allresult1'><table class='content' id='cnv'></table></div>");
            $("body").prepend("<div class='Allresult' id='_Allresult0'><table class='content' id='castSurely'></table></div>");
            $("#castSurely").prepend("<tr><th>基金名称</th><th><p>估值</p><p>金额</p></th><th><p>日期</p><p>来源</p></th><th>网格建议</th><th>网格来源</th></tr><tr id='_H30533'></tr><tr id='_H11136'></tr><tr id='_930743'></tr><tr id='_399989'></tr><tr id='_HSIII'></tr><tr id='_HSTECH'></tr><tr id='_012348'></tr><tr id='_950090'></tr><tr id='_000919'></tr><tr id='_SH000170_L'></tr><tr id='_000919_L'></tr></tr>");
            $("#cnv").prepend("<tr><th>可转债名称</th><th>溢价率</th><th>主体评级</th><th>债券评级</th><th>是否打新</th><th>申购日期</th></tr>");
            $("#lowcnv").prepend("<tr><th>可转债名称</th><th>溢价率</th><th>现价</th><th>主体评级</th><th>债券评级</th><th>投资建议</th></tr>");
            //插入按钮
            $("body").prepend("<div id='btn'><div id='btn-center'><div id='btn-content'></div></div></div>");
            var icon='<p><svg t="1636533106823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3400" width="20" height="20"><path d="M918.8 382.9c-6.8 0-13.1-4.2-15.5-10.9-15.1-42.2-36.9-81.6-64.8-116.9-5.6-7.1-4.4-17.5 2.7-23.1 7.1-5.6 17.5-4.4 23.1 2.7 30.1 38.2 53.6 80.6 69.9 126.2 3.1 8.6-1.4 18-9.9 21-1.8 0.7-3.7 1-5.5 1zM163.4 783.5c-5.1 0-10.1-2.3-13.3-6.7-27.7-37.8-49.2-79.5-63.9-123.9-2.9-8.6 1.8-17.9 10.4-20.8 8.6-2.9 17.9 1.8 20.8 10.4 13.6 41.1 33.5 79.7 59.2 114.8 5.4 7.3 3.8 17.6-3.5 23-2.9 2.1-6.4 3.2-9.7 3.2zM512 960.4c-110 0-215.8-40.2-297.9-113.2-6.8-6-7.4-16.4-1.4-23.2 6-6.8 16.4-7.4 23.2-1.4 76.1 67.7 174.1 104.9 276 104.9 215 0 392.4-164.2 413.4-373.8l-58.8 58.6c-6.4 6.4-16.9 6.4-23.3 0-6.4-6.4-6.4-16.8 0-23.3l117-116.7V512c0.2 247.2-201 448.4-448.2 448.4zM63.6 552v-40C63.6 264.8 264.8 63.6 512 63.6c103.2 0 203.9 35.9 283.7 101.1 7 5.8 8.1 16.1 2.3 23.1-5.7 7-16.1 8.1-23.1 2.3C701 129.8 607.6 96.5 512 96.5c-214.9 0-392.2 164-413.4 373.4l62.7-63.2c6.4-6.5 16.8-6.5 23.3-0.1 6.4 6.4 6.5 16.8 0.1 23.3L63.6 552z" fill="#FFFFFF" p-id="3401"></path><path d="M513.4 488.4L332.6 307.7c-6.4-6.4-6.4-16.8 0-23.3s16.8-6.4 23.3 0l157.5 157.5 156.1-156.1c6.4-6.4 16.8-6.4 23.3 0s6.4 16.8 0 23.3L513.4 488.4z" fill="#FFFFFF" p-id="3402"></path><path d="M681.1 481.6H344.2c-9.1 0-16.4-7.4-16.4-16.4s7.4-16.4 16.4-16.4h336.9c9.1 0 16.4 7.4 16.4 16.4s-7.3 16.4-16.4 16.4zM681.1 609.8H344.2c-9.1 0-16.4-7.4-16.4-16.4s7.4-16.4 16.4-16.4h336.9c9.1 0 16.4 7.4 16.4 16.4s-7.3 16.4-16.4 16.4z" fill="#FFFFFF" p-id="3403"></path><path d="M513.4 781.7c-9.1 0-16.4-7.4-16.4-16.4V465.2c0-9.1 7.4-16.4 16.4-16.4 9.1 0 16.4 7.4 16.4 16.4v300.1c0 9.1-7.4 16.4-16.4 16.4z" fill="#FFFFFF" p-id="3404"></path></svg></p>';
            $("#btn-content").prepend("<div class='_btn' id='_btn3' title='数据来源：集思录'>"+icon+"<p>溢价率查询</p></div>");
            $("#btn-content").prepend("<div class='_btn' id='_btn2' title='数据来源：集思录'>"+icon+"<p>双低可转债</p></div>");
            $("#btn-content").prepend("<div class='_btn' id='_btn1' title='数据来源：集思录'>"+icon+"<p>可转债打新</p></div>");
            $("#btn-content").prepend("<div class='_btn' id='_btn0' title='数据来源：理杏仁；银行螺丝钉'>"+icon+"<p>定投</p></div>");
            $("#btn-content").prepend("<div class='_btn' id='_grade'>"+icon+"</div>");
            $("#_btn0").click(function(){
                //点击定投按钮
                //可转债打新表隐藏，定投表出现
                $("#_Allresult1").css("top","-100%");
                $("#_Allresult2").css("top","-100%");
                $("#_Allresult3").css("top","-100%");
                //定投表隐藏和出现
                var top=$("#_Allresult0").css("top");
                if(top=="65px"){
                    $("#_Allresult0").css("top","-100%");
                }else{
                    $("#_Allresult0").css("top","65px");
                }
            });
            $("#_btn1").click(function(){
                //点击可转债按钮
                //定投表隐藏，可转债打新表出现
                $("#_Allresult0").css("top","-100%");
                $("#_Allresult2").css("top","-100%");
                $("#_Allresult3").css("top","-100%");
                //可转债打新表隐藏和出现
                var top=$("#_Allresult1").css("top");
                if(top=="65px"){
                    $("#_Allresult1").css("top","-100%");
                }else{
                    $("#_Allresult1").css("top","65px");
                }
            });
            $("#_btn2").click(function(){
                //点击双低可转债按钮
                //定投表、可转债打新表隐藏，双低可转债表出现
                $("#_Allresult0").css("top","-100%");
                $("#_Allresult1").css("top","-100%");
                $("#_Allresult3").css("top","-100%");
                //双低可转债表表隐藏和出现
                var top=$("#_Allresult2").css("top");
                if(top=="65px"){
                    $("#_Allresult2").css("top","-100%");
                }else{
                    $("#_Allresult2").css("top","65px");
                }
            });
            $("#_btn3").click(function(){
                //点击双低可转债按钮
                //定投表、可转债打新表隐藏，双低可转债表出现
                $("#_Allresult0").css("top","-100%");
                $("#_Allresult1").css("top","-100%");
                $("#_Allresult2").css("top","-100%");
                //双低可转债表表隐藏和出现
                var top=$("#_Allresult3").css("top");
                if(top=="65px"){
                    $("#_Allresult3").css("top","-100%");
                }else{
                    $("#_Allresult3").css("top","65px");
                }
            });

            css='#btn{position:fixed;top:0px;width:100%;height:50px;z-index:100000;font-size:1.2em;cursor: pointer;}#btn-center{width:100%;}#btn-content{width:100%;transition:all 0.3s;-moz-transition: all 0.3s; -webkit-transition: all 0.3s; -o-transition: all 0.3s;}._btn{width:20%;height:50px;padding:5px 0px;background:#007bff;color:#FFF;text-align:center;float:left;font-size:3vw}.Allresult{position:fixed;top:-100%;width:100%;max-height:600px;overflow-y:scroll;z-index:9999;font-size:2vw;cursor: pointer;border:1px solid #007bff;background:#FFF;color:#007bff;transition:all 1s;-moz-transition: all 1s; -webkit-transition: all 1s; -o-transition: all 1s;}.content{margin:0px auto;}.content th{padding:5px 10px;vertical-align: center;border-bottom: 2px solid #007bff;text-align:center}.content td{padding:5px 10px;vertical-align:center;text-align:center}a{color:#007bff}';
        }
        GM_addStyle(css);

        //投资星级
        grade();
        function grade(){
            //金色星星、灰色的星星
            var golden='<svg t="1635563991909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3794" width="15" height="15"><path d="M509.867 189.867L608 411.733l243.2 25.6-181.333 162.134 51.2 238.933-211.2-121.6-211.2 121.6 51.2-238.933L168.533 435.2l243.2-25.6 98.134-219.733z" p-id="3795" fill="#f4ea2a"></path></svg>';
            var gray='<svg t="1635563991909" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3794" width="15" height="15"><path d="M509.867 189.867L608 411.733l243.2 25.6-181.333 162.134 51.2 238.933-211.2-121.6-211.2 121.6 51.2-238.933L168.533 435.2l243.2-25.6 98.134-219.733z" p-id="3795" fill="#FFFFFF"></path></svg>';
            var half='<svg t="1635563863937" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3132" width="15" height="15"><path d="M883.075899 428.228061l-267.119757-22.906709-104.369046-246.226914-104.363929 246.226914-267.122827 22.906709 202.63714 175.596274-60.72606 261.081227 229.575676-138.430816 229.577722 138.374534-60.780295-261.134439L883.075899 428.228061zM511.587096 656.715963 511.587096 311.183322l63.559595 149.966547 162.695452 14.038738-123.465986 106.871029 37.002752 158.998247L511.587096 656.715963z" p-id="3133" fill="#f4ea2a"></path></svg>';
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://danjuanfunds.com/djapi/fundx/activity/user/vip_valuation/show/detail?source=lsd",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        var time=json.data.time;
                        var grade=json.data.grade;
                        //数字等级转化为图片，更易识别
                        switch(grade){
                            case "1":
                                grade=golden+gray+gray+gray+gray;
                                break;
                            case "1.5":
                                grade=golden+half+gray+gray+gray;
                                break;
                            case "2":
                                grade=golden+golden+gray+gray+gray;
                                break;
                            case "2.5":
                                grade=golden+golden+half+gray+gray;
                                break;
                            case "3":
                                grade=golden+golden+golden+gray+gray;
                                break;
                            case "3.5":
                                grade=golden+golden+golden+half+gray;
                                break;
                            case "4":
                                grade=golden+golden+golden+golden+gray;
                                break;
                            case "4.5":
                                grade=golden+golden+golden+golden+half;
                                break;
                            case "5":
                                grade=golden+golden+golden+golden+golden;
                                break;
                        }
                        $("#_grade").append("<a href='https://danjuanfunds.com/screw/valuation-table?channel=' target='_blank'><p title='数据来源：银行螺丝钉\r\n数据时间"+time+"'>"+grade+"</p></a>");
                    }
                },
                onerror: function(response){
                    console.log("请求失败");
                }
            });
        }
        //投资星级

        //计算定投金额-理杏仁-银行螺丝钉
        castSurely();
        function castSurely(){
            //输入基本信息
            //["基金名称","基金代码","定投所用估值指标","首次定投金额","首次定投指标","股市",指数代码","指数名称","指数策略","数据来源","首次定投日期"]
            var code=new Array();
            code[0]=["中概互联网ETF","513050","市销率","759.0000","3.7900","A股","H30533","中国互联网50","市值加权","理杏仁","2021-09-09"];
            code[1]=["中概互联网LOF","164906","市销率","687.5000","3.9996","A股","H11136","中国互联网","市值加权","理杏仁","2021-09-09"];
            code[2]=["生物科技LOF","501009","市盈率","500.0000","48.8100","A股","930743","中证生科","市值加权","理杏仁","2021-09-09"];
            code[3]=["医疗ETF","512170","市盈率","544.8000","38.0296","A股", "399989","中证医疗","市值加权","理杏仁","2021-09-02"];
            code[4]=["恒生互联网ETF","513330","市销率","0.0000","0.0000","H股","HSIII","恒生互联网科技业指数","市值加权","理杏仁","0000-00-00"];
            code[5]=["天弘恒生科技指数（QDII）A","012348","市销率","500.0000","3.2200","H股","HSTECH","恒生科技指数","市值加权","理杏仁","2021-09-09"];
            code[6]=["华夏上证50AH优选指数（LOF）A","501050","市盈率","500.0000","8.9568","A股","950090","上证50优选","市值加权","理杏仁","2021-09-28"];
            code[7]=["银河沪深300价值指数","519671","市盈率","500.0000","7.3863","A股","000919","300价值","市值加权","理杏仁","2021-09-28"];
            code[8]=["华夏上证50AH优选指数（LOF）A","501050","盈利收益率","500.0000","0.1056","A股","SH000170","上证50优选","市值加权","银行螺丝钉","2021-09-28"];//SH000170不是指数代码
            code[9]=["银河沪深300价值指数","519671","盈利收益率","500.0000","0.1010","A股","000919","300价值","市值加权","银行螺丝钉","2021-09-28"];
            //计算定投金额-理杏仁
            var n,All;
            if(getCookie("H30533All")){
                for(n=0;n<code.length;n++){
                    if(code[n][9]=="理杏仁"){
                        All=getCookie(code[n][6]+"All");
                        $("#_"+code[n][6]).append(All);
                    }
                }
                console.log("定投数据已存入Cookie，每半天更新一次，防止次数超限");
            }else{
                var Acode=new Array(),Hcode=new Array(),Ecode=new Array(),i,url,stockCodes,metricsList,data;
                for(i=0;i<code.length;i++){
                    if(code[i][5]=="A股"&&code[i][9]=="理杏仁"){Acode.push(code[i]);continue;}
                    if(code[i][5]=="H股"&&code[i][9]=="理杏仁"){Hcode.push(code[i]);continue;}
                    if(code[i][5]=="美股"&&code[i][9]=="理杏仁"){Ecode.push(code[i]);continue;}
                }
                if(Acode.length!=0){
                    //配置好的A股查询数据
                    url="https://open.lixinger.com/api/a/index/fundamental"
                    stockCodes=""
                    for(i=0;i<Acode.length;i++){
                        stockCodes+="&stockCodes["+i+"]="+Acode[i][6];
                    }
                    metricsList="&metricsList[0]=pe_ttm.y10.mcw&metricsList[1]=pb.y10.mcw&metricsList[2]=ps_ttm.y10.mcw&metricsList[3]=mc";
                    //"市值加权":metricsList="&metricsList[0]=pe_ttm.y10.mcw&metricsList[1]=pb.y10.mcw&metricsList[2]=ps_ttm.y10.mcw&metricsList[3]=mc"
                    //"等权": metricsList="&metricsList[0]=pe_ttm.y10.ew&metricsList[1]=pb.y10.ew&metricsList[2]=ps_ttm.y10.ew&metricsList[3]=mc"
                    // "正数等权":metricsList="&metricsList[0]=pe_ttm.y10.ewpvo&metricsList[1]=pb.y10.ewpvo&metricsList[2]=ps_ttm.y10.ewpvo&metricsList[3]=mc"
                    //"平均值":metricsList="&metricsList[0]=pe_ttm.y10.avg&metricsList[1]=pb.y10.avg&metricsList[2]=ps_ttm.y10.avg&metricsList[3]=mc"
                    //"中位数": metricsList="&metricsList[0]=pe_ttm.y10.median&metricsList[1]=pb.y10.median&metricsList[2]=ps_ttm.y10.median&metricsList[3]=mc"
                    data="token=ac988b32-7dff-413a-8435-bdbd76fd2ddc&date=latest"+stockCodes+metricsList;
                    GM_xmlhttpRequest({
                        method: "POST",
                        url:url,
                        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                        data:data,
                        onload: function(response){
                            var text=response.responseText;
                            var json=JSON.parse(text);
                            var result=json.data;
                            //money计算定投金额，hint根据分位点设置提示信息
                            var money;
                            var hint;
                            var Allresult;
                            for(var i=0;i< Acode.length;i++){
                                for(var j=0;j< result.length;j++){
                                    if(Acode[i][6]==result[j].stockCode){
                                        switch(Acode[i][2]){
                                            case "市盈率"://市盈率用此公式计算定投金额
                                                money=Acode[i][3]*(Acode[i][4]/result[j].pe_ttm.y10.mcw.cv)*(Acode[i][4]/result[j].pe_ttm.y10.mcw.cv);
                                                //根据分位点设置提示信息，低于20%分位低估，高于80%分位高估，其他正常
                                                if(result[j].pe_ttm.y10.mcw.cv<result[j].pe_ttm.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].pe_ttm.y10.mcw.cv>=result[j].pe_ttm.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                            case "市净率"://市净率用此公式计算定投金额
                                                money=Acode[i][3]*(Acode[i][4]/result[j].pb.y10.mcw.cv)*(Acode[i][4]/result[j].pb.y10.mcw.cv);
                                                //根据分位点设置提示信息，低于20%分位低估，高于80%分位高估，其他正常
                                                if(result[j].pb.y10.mcw.cv<result[j].pb.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].pb.y10.mcw.cv>=result[j].pb.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                            case "市销率"://市销率用此公式计算定投金额
                                                money=Acode[i][3]*(Acode[i][4]/result[j].ps_ttm.y10.mcw.cv)*(Acode[i][4]/result[j].ps_ttm.y10.mcw.cv);
                                                if(result[j].ps_ttm.y10.mcw.cv<result[j].ps_ttm.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].ps_ttm.y10.mcw.cv>=result[j].ps_ttm.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                        }
                                        money=money.toFixed(2);//保留两位小数
                                        //将数据导出页面
                                        //根据高度，设置样式
                                        let width=screen.width;
                                        let css;
                                        if(width>1000){
                                            Allresult="<td>"+Acode[i][0]+"</td><td>"+hint+"</td><td>"+money+"</td><td>"+result[j].date.slice(5,10)+"</td><td>理杏仁</td>";
                                            $("#_"+result[j].stockCode).prepend(Allresult);
                                            //标记此定投采用估值
                                            $("#_"+result[j].stockCode).attr({"title":Acode[i][2]});
                                        }else{
                                            Allresult="<td>"+Acode[i][0]+"</td><td><p>"+hint+"</p><p>"+money+"</p></td><td><p>"+result[j].date.slice(5,10)+"</p><p>理杏仁</p></td>";
                                            $("#_"+result[j].stockCode).prepend(Allresult);
                                            //标记此定投采用估值
                                            $("#_"+result[j].stockCode).attr({"title":Acode[i][2]});
                                        }
                                        //把结果保存cookie,有效期0.5天
                                        setCookie(result[j].stockCode+"All",Allresult,0.5);
                                    }
                                }
                            }
                        },
                        onerror: function(response){
                            console.log("请求失败");
                        }
                    });
                }
                if(Hcode.length!=0){
                    //配置好的H股查询数据
                    url="https://open.lixinger.com/api/h/index/fundamental"
                    stockCodes=""
                    for(i=0;i<Hcode.length;i++){
                        stockCodes+="&stockCodes["+i+"]="+Hcode[i][6];
                    }
                    metricsList="&metricsList[0]=pe_ttm.y10.mcw&metricsList[1]=pb.y10.mcw&metricsList[2]=ps_ttm.y10.mcw&metricsList[3]=mc";
                    //"市值加权":metricsList="&metricsList[0]=pe_ttm.y10.mcw&metricsList[1]=pb.y10.mcw&metricsList[2]=ps_ttm.y10.mcw&metricsList[3]=mc"
                    //"等权": metricsList="&metricsList[0]=pe_ttm.y10.ew&metricsList[1]=pb.y10.ew&metricsList[2]=ps_ttm.y10.ew&metricsList[3]=mc"
                    // "正数等权":metricsList="&metricsList[0]=pe_ttm.y10.ewpvo&metricsList[1]=pb.y10.ewpvo&metricsList[2]=ps_ttm.y10.ewpvo&metricsList[3]=mc"
                    //"平均值":metricsList="&metricsList[0]=pe_ttm.y10.avg&metricsList[1]=pb.y10.avg&metricsList[2]=ps_ttm.y10.avg&metricsList[3]=mc"
                    //"中位数": metricsList="&metricsList[0]=pe_ttm.y10.median&metricsList[1]=pb.y10.median&metricsList[2]=ps_ttm.y10.median&metricsList[3]=mc"
                    data="token=ac988b32-7dff-413a-8435-bdbd76fd2ddc&date=latest"+stockCodes+metricsList;
                    GM_xmlhttpRequest({
                        method: "POST",
                        url:url,
                        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                        data:data,
                        onload: function(response){
                            var text=response.responseText;
                            var json=JSON.parse(text);
                            var result=json.data;
                            //money计算定投金额，hint根据分位点设置提示信息
                            var money;
                            var hint;
                            var Allresult;
                            for(var i=0;i< Hcode.length;i++){
                                for(var j=0;j< result.length;j++){
                                    if(Hcode[i][6]==result[j].stockCode){
                                        switch(Hcode[i][2]){
                                            case "市盈率"://市盈率用此公式计算定投金额
                                                money=Hcode[i][3]*(Hcode[i][4]/result[j].pe_ttm.y10.mcw.cv)*(Hcode[i][4]/result[j].pe_ttm.y10.mcw.cv);
                                                //根据分位点设置提示信息，低于20%分位低估，高于80%分位高估，其他正常
                                                if(result[j].pe_ttm.y10.mcw.cv<result[j].pe_ttm.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].pe_ttm.y10.mcw.cv>=result[j].pe_ttm.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                            case "市净率"://市净率用此公式计算定投金额
                                                money=Hcode[i][3]*(Hcode[i][4]/result[j].pb.y10.mcw.cv)*(Hcode[i][4]/result[j].pb.y10.mcw.cv);
                                                //根据分位点设置提示信息，低于20%分位低估，高于80%分位高估，其他正常
                                                if(result[j].pb.y10.mcw.cv<result[j].pb.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].pb.y10.mcw.cv>=result[j].pb.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                            case "市销率"://市销率用此公式计算定投金额
                                                money=Hcode[i][3]*(Hcode[i][4]/result[j].ps_ttm.y10.mcw.cv)*(Hcode[i][4]/result[j].ps_ttm.y10.mcw.cv);
                                                if(result[j].ps_ttm.y10.mcw.cv<result[j].ps_ttm.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].ps_ttm.y10.mcw.cv>=result[j].ps_ttm.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                        }
                                        money=money.toFixed(2);//保留两位小数
                                        let width=screen.width;
                                        let css;
                                        if(width>1000){
                                            Allresult="<td>"+Hcode[i][0]+"</td><td>"+hint+"</td><td>"+money+"</td><td>"+result[j].date.slice(5,10)+"</td><td>理杏仁</td>";
                                            $("#_"+result[j].stockCode).prepend(Allresult);
                                            //标记此定投采用估值
                                            $("#_"+result[j].stockCode).attr({"title":Hcode[i][2]});
                                        }else{
                                            Allresult="<td>"+Hcode[i][0]+"</td><td><p>"+hint+"</p><p>"+money+"</p></td><td><p>"+result[j].date.slice(5,10)+"</p><p>理杏仁</p></td>";
                                            $("#_"+result[j].stockCode).prepend(Allresult);
                                            //标记此定投采用估值
                                            $("#_"+result[j].stockCode).attr({"title":Hcode[i][2]});
                                        }
                                        //把结果保存cookie,有效期0.5天
                                        setCookie(result[j].stockCode+"All",Allresult,0.5);
                                    }
                                }
                            }
                        },
                        onerror: function(response){
                            console.log("请求失败");
                        }
                    });
                }
                if(Ecode.length!=0){
                    //配置好的美股查询数据
                    url="https://open.lixinger.com/api/us/index/fundamental"
                    stockCodes=""
                    for(i=0;i<Ecode.length;i++){
                        stockCodes+="&stockCodes["+i+"]="+Ecode[i][6];
                    }
                    metricsList="&metricsList[0]=pe_ttm.y10.mcw&metricsList[1]=pb.y10.mcw&metricsList[2]=ps_ttm.y10.mcw&metricsList[3]=mc";
                    //"市值加权":metricsList="&metricsList[0]=pe_ttm.y10.mcw&metricsList[1]=pb.y10.mcw&metricsList[2]=ps_ttm.y10.mcw&metricsList[3]=mc"
                    //"等权": metricsList="&metricsList[0]=pe_ttm.y10.ew&metricsList[1]=pb.y10.ew&metricsList[2]=ps_ttm.y10.ew&metricsList[3]=mc"
                    // "正数等权":metricsList="&metricsList[0]=pe_ttm.y10.ewpvo&metricsList[1]=pb.y10.ewpvo&metricsList[2]=ps_ttm.y10.ewpvo&metricsList[3]=mc"
                    //"平均值":metricsList="&metricsList[0]=pe_ttm.y10.avg&metricsList[1]=pb.y10.avg&metricsList[2]=ps_ttm.y10.avg&metricsList[3]=mc"
                    //"中位数": metricsList="&metricsList[0]=pe_ttm.y10.median&metricsList[1]=pb.y10.median&metricsList[2]=ps_ttm.y10.median&metricsList[3]=mc"
                    data="token=ac988b32-7dff-413a-8435-bdbd76fd2ddc&date=latest"+stockCodes+metricsList;
                    GM_xmlhttpRequest({
                        method: "POST",
                        url:url,
                        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                        data:data,
                        onload: function(response){
                            var text=response.responseText;
                            var json=JSON.parse(text);
                            var result=json.data;
                            //money计算定投金额，hint根据分位点设置提示信息
                            var money;
                            var hint;
                            var Allresult;
                            for(var i=0;i< Ecode.length;i++){
                                for(var j=0;j< result.length;j++){
                                    if(Ecode[i][6]==result[j].stockCode){
                                        switch(Ecode[i][2]){
                                            case "市盈率"://市盈率用此公式计算定投金额
                                                money=Ecode[i][3]*(Ecode[i][4]/result[j].pe_ttm.y10.mcw.cv)*(Ecode[i][4]/result[j].pe_ttm.y10.mcw.cv);
                                                //根据分位点设置提示信息，低于20%分位低估，高于80%分位高估，其他正常
                                                if(result[j].pe_ttm.y10.mcw.cv<result[j].pe_ttm.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].pe_ttm.y10.mcw.cv>=result[j].pe_ttm.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                            case "市净率"://市净率用此公式计算定投金额
                                                money=Ecode[i][3]*(Ecode[i][4]/result[j].pb.y10.mcw.cv)*(Ecode[i][4]/result[j].pb.y10.mcw.cv);
                                                //根据分位点设置提示信息，低于20%分位低估，高于80%分位高估，其他正常
                                                if(result[j].pb.y10.mcw.cv<result[j].pb.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].pb.y10.mcw.cv>=result[j].pb.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                            case "市销率"://市销率用此公式计算定投金额
                                                money=Ecode[i][3]*(Ecode[i][4]/result[j].ps_ttm.y10.mcw.cv)*(Ecode[i][4]/result[j].ps_ttm.y10.mcw.cv);
                                                if(result[j].ps_ttm.y10.mcw.cv<result[j].ps_ttm.y10.mcw.q2v){
                                                    hint="低估";
                                                }else{
                                                    if(result[j].ps_ttm.y10.mcw.cv>=result[j].ps_ttm.y10.mcw.q8v){
                                                        hint="高估";
                                                    }else{
                                                        hint="正常";
                                                    }
                                                }
                                                break;
                                        }
                                        money=money.toFixed(2);//保留两位小数
                                        //将数据导出页面
                                        let width=screen.width;
                                        let css;
                                        if(width>1000){
                                            Allresult="<td>"+Ecode[i][0]+"</td><td>"+hint+"</td><td>"+money+"</td><td>"+result[j].date.slice(5,10)+"</td><td>理杏仁</td>";
                                            $("#_"+result[j].stockCode).prepend(Allresult);
                                            //标记此定投采用估值
                                            $("#_"+result[j].stockCode).attr({"title":Ecode[i][2]});
                                        }else{
                                            Allresult="<td>"+Ecode[i][0]+"</td><td><p>"+hint+"</p><p>"+money+"</p></td><td><p>"+result[j].date.slice(5,10)+"</p><p>理杏仁</p></td>";
                                            $("#_"+result[j].stockCode).prepend(Allresult);
                                            //标记此定投采用估值
                                            $("#_"+result[j].stockCode).attr({"title":Ecode[i][2]});
                                        }
                                        //把结果保存cookie,有效期0.5天
                                        setCookie(result[j].stockCode+"All",Allresult,0.5);
                                    }
                                }
                            }
                        },
                        onerror: function(response){
                            console.log("请求失败");
                        }
                    });
                }
            }
            //计算定投金额-理杏仁

            //计算定投金额-银行螺丝钉
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://danjuanfunds.com/djapi/fundx/activity/user/vip_valuation/show/detail?source=lsd",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        var time=json.data.time;
                        var valuations=json.data.valuations;
                        //获取全部数据
                        var i,j;
                        //money计算定投金额，hint根据分位点设置提示信息
                        var money;
                        var hint;
                        for(i=0;i<code.length;i++){
                            if(code[i][9]=="银行螺丝钉"){
                                for(j=0;j<valuations.length;j++){
                                    if(code[i][6]==valuations[j]["index_code"]){
                                        switch(code[i][2]){
                                            case "市盈率"://市盈率用此公式计算定投金额
                                                money=code[i][3]*(code[i][4]/valuations[j].pe)*(code[i][4]/valuations[j].pe);
                                                break;
                                            case "市净率"://市净率用此公式计算定投金额
                                                money=code[i][3]*(code[i][4]/valuations[j].pb)*(code[i][4]/valuations[j].pb);
                                                break;
                                            case "盈利收益率"://市销率用此公式计算定投金额
                                                money=code[i][3]*(valuations[j]["profit_yield"]/code[i][4])*(valuations[j]["profit_yield"]/code[i][4]);
                                                break;
                                        }
                                        switch(valuations[j].valuation_status){
                                            case "1":
                                                hint="低估";
                                                break;
                                            case "2":
                                                hint="正常";
                                                break;
                                            case "3":
                                                hint="高估";
                                                break;
                                        }
                                        money=money.toFixed(2);//保留两位小数
                                        //将数据导出页面
                                        let width=screen.width;
                                        let css;
                                        if(width>1000){
                                            var Allresult="<td>"+code[i][0]+"</td><td>"+hint+"</td><td>"+money+"</td><td>"+time+"</td><td>银行螺丝钉</td>";
                                            $("#_"+code[i][6]+"_L").prepend(Allresult);
                                            //标记此定投采用估值
                                            $("#_"+code[i][6]+"_L").attr({"title":code[i][2]});
                                        }else{
                                            Allresult="<td>"+code[i][0]+"</td><td><p>"+hint+"</p><p>"+money+"</p></td><td colspan='3'><p>"+time.slice(5,10)+"</p><p>银行螺丝钉</p></td>";
                                            $("#_"+code[i][6]+"_L").prepend(Allresult);
                                            //标记此定投采用估值
                                            $("#_"+code[i][6]+"_L").attr({"title":code[i][2]});
                                        }
                                        //结束for循环
                                        break;
                                    }
                                }
                            }
                        }
                    }
                },
                onerror: function(response){
                    console.log("请求失败");
                }
            });
            //计算定投金额-银行螺丝钉
        }
        //计算定投金额-理杏仁-银行螺丝钉

        //根据涨跌幅计算网格
        fluctuate();
        function fluctuate(){
            //输入基本信息
            var code=new Array();
            code[0]=["中概互联网ETF","513050","A股","H30533","中国互联网50","市值加权","_H30533"];
            code[1]=["中概互联网LOF","164906","A股","H11136","中国互联网","市值加权","_H11136"];
            code[2]=["生物科技LOF","501009","A股","930743","中证生科","市值加权","_930743"];
            code[3]=["医疗ETF","512170","A股", "399989","中证医疗","市值加权","_399989"];
            code[4]=["恒生互联网ETF","513330","H股","HSIII","恒生互联网科技业指数","市值加权","_HSIII"];
            code[5]=["天弘恒生科技指数（QDII）A","012348","H股","HSTECH","恒生科技指数","市值加权","_HSTECH"];
            code[6]=["华夏上证50AH优选指数（LOF）A","501050","A股","950090","上证50优选","市值加权","_SH000170"];//SH000170不是指数代码
            code[7]=["银河沪深300价值指数","519671","A股","000919","300价值","市值加权","_000919"];
            //网格每月计算一次并存在Cookie中
            var n,Y,M;
            if(getCookie("H30533Y")){
                for(n=0;n<code.length;n++){
                    Y=getCookie(code[n][3]+"Y");
                    M=getCookie(code[n][3]+"M");
                    //根据高度，设置样式
                    let width=screen.width;
                    let css;
                    if(width>1000){
                        $("#_"+code[n][3]).append("<td>"+Y+"</td><td>"+M+"</td><td>理杏仁</td>");
                    }else{
                        $("#_"+code[n][3]).append("<td><p>"+Y+" / 1年</p><p>"+M+" / 半年</p></td><td>理杏仁</td>");
                    }
                }
                console.log("涨跌幅网格已存入Cookie，每月更新一次，防止次数超限");
            }else{
                //查询涨跌幅，计算网格
                var url;
                for(n=0;n<code.length;n++){
                    //配置URL
                    switch(code[n][2]){
                        case "A股":
                            url="https://open.lixinger.com/api/a/index/fundamental";
                            break;
                        case "H股":
                            url="https://open.lixinger.com/api/h/index/fundamental";
                            break;
                        case "us":
                            url="https://open.lixinger.com/api/us/index/fundamental";
                            break;
                    }
                    //获取时间
                    var d = new Date();
                    var year=d.getFullYear();
                    var month=d.getMonth()+1;
                    var day=d.getDate();
                    if(day<10){
                        day="0"+day;
                    }
                    var startDate=(year-1)+"-"+month+"-"+day;
                    var endDate=year+"-"+month+"-"+day;
                    //配置查询参数
                    var data="token=ac988b32-7dff-413a-8435-bdbd76fd2ddc&startDate="+startDate+"&endDate="+endDate+"&stockCodes[0]="+code[n][3]+"&metricsList[0]=cpc";
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: url,
                        headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                        data:data,
                        onload: function(res) {
                            if (res.status==200) {
                                var text=res.responseText;
                                var json=JSON.parse(text);
                                var data=json.data;
                                var sumArr=new Array(0,0,0,0,0,0,0,0,0,0,0,0);
                                var sumYear=0,sumSixMonth=0;
                                var avgStartYear=0,avgEndYear=0,avgStartMonth=0,avgEndMonth=0;
                                var i,j=0;
                                for(i=0;i<data.length;i++){
                                    data[i].cpc=parseFloat(data[i].cpc);//字符串转数字
                                    if(isNaN(data[i].cpc)){
                                        data[i].cpc=0;
                                    }
                                    data[i].date=parseInt(data[i].date.slice(5,7))//截取月份后取整数
                                }
                                for(i=0;i<data.length;i++){
                                    //根据月份计算每月涨跌
                                    switch(data[i].date){
                                        case 1:
                                            sumArr[0]+=data[i].cpc;
                                            break;
                                        case 2:
                                            sumArr[1]+=data[i].cpc;
                                            break;
                                        case 3:
                                            sumArr[2]+=data[i].cpc;
                                            break;
                                        case 4:
                                            sumArr[3]+=data[i].cpc;
                                            break;
                                        case 5:
                                            sumArr[4]+=data[i].cpc;
                                            break;
                                        case 6:
                                            sumArr[5]+=data[i].cpc;
                                            break;
                                        case 7:
                                            sumArr[6]+=data[i].cpc;
                                            break;
                                        case 8:
                                            sumArr[7]+=data[i].cpc;
                                            break;
                                        case 9:
                                            sumArr[8]+=data[i].cpc;
                                            break;
                                        case 10:
                                            sumArr[9]+=data[i].cpc;
                                            break;
                                        case 11:
                                            sumArr[10]+=data[i].cpc;
                                            break;
                                        case 12:
                                            sumArr[11]+=data[i].cpc;
                                            break;
                                    }
                                }
                                //求和取年平均值
                                for(i=0;i<sumArr.length;i++){
                                    //如果是负数，转为正数
                                    if(sumArr[i]<0){
                                        sumArr[i]=-1*sumArr[i];
                                    }
                                    sumYear+=sumArr[i];
                                }
                                avgStartYear=sumYear/12*100-1;
                                avgStartYear=avgStartYear.toFixed(2);
                                avgEndYear=sumYear/12*100;
                                avgEndYear=avgEndYear.toFixed(2);
                                //求和取6个月平均值
                                var k=data[0].date-6;
                                for(i=data[0].date;i>k;i--){
                                    //如果是负数，转为正数
                                    if(sumArr[i]<0){
                                        sumArr[i]=-1*sumArr[i];
                                    }
                                    sumSixMonth+=sumArr[i];
                                }
                                avgStartMonth=sumSixMonth/12*100-1;
                                avgStartMonth=avgStartMonth.toFixed(2);
                                avgEndMonth=sumSixMonth/12*100;
                                avgEndMonth=avgEndMonth.toFixed(2);
                                //根据高度，设置样式
                                let width=screen.width;
                                let css;
                                if(width>1000){
                                    $("#_"+data[0].stockCode).append("<td>"+avgStartYear+"~"+avgEndYear+"</td><td>"+avgStartMonth+"~"+avgEndMonth+"</td><td>理杏仁</td>");
                                }else{
                                    $("#_"+data[0].stockCode).append("<td><p>"+avgStartYear+"~"+avgEndYear+" / 1年</p><p>"+avgStartMonth+"~"+avgEndMonth+" / 半年</p></td><td>理杏仁</td>");
                                }

                                //把结果保存cookie,有效期1个月
                                setCookie(data[0].stockCode+"Y",avgStartYear+"~"+avgEndYear,30);
                                setCookie(data[0].stockCode+"M",avgStartMonth+"~"+avgEndMonth,30);
                                //console.log(avg);
                                //console.log(data);
                            }
                        },
                        onerror: function(response){
                            console.log("请求失败");
                        }
                    });
                }
            }
        }
        //根据涨跌幅计算网格

        //未来七天可转债打新
        cnv();
        function cnv(){
            //获取未来七天可转债数据
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.jisilu.cn/data/calendar/get_calendar_data/?qtype=CNV",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        //获取未来七天可转债打新数据
                        var data=new Array(),title;
                        for(var i=0;i<json.length;i++){
                            title=json[i].title.slice(0,5);
                            if(title=="【申购日】"){
                                data.push(json[i]);
                            }
                        }
                        //根据未来七天可转债打新数据，获得其对应更详细数据
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://www.jisilu.cn/data/cbnew/cb_list/",
                            headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                            onload: function(res) {
                                var cnvData=data//获取未来七天可转债打新数据
                                //console.log(cnvData);
                                if (res.status==200) {
                                    var text=res.responseText;
                                    var json=JSON.parse(text);
                                    var warn=json.warn;
                                    if(warn){
                                        //尚未登陆集思网站，输出提示信息
                                        $("#cnv").append("<tr><td colspan='6'><a href='https://www.jisilu.cn/account/login/' target='_blank'>"+warn+"！点击前往登陆<a></td></tr>");
                                    }else{
                                        //根据未来七天可转债打新数据，获取更详细信息
                                        var rows=json.rows;
                                        var i,j,detailData=new Array();
                                        for(i=0;i<cnvData.length;i++){
                                            for(j=0;j<rows.length;j++){
                                                if(cnvData[i].code==rows[j]["id"]){
                                                    rows[j]["startTime"]=cnvData[i].start;
                                                    rows[j]["url"]="https://www.jisilu.cn"+cnvData[i].url;
                                                    detailData.push(rows[j]);
                                                    continue;
                                                }
                                            }
                                        }
                                        //根据债券评级来确定申购意见，并在页面显示最终结果
                                        var hint;
                                        for(i=0;i<detailData.length;i++){
                                            if(detailData[i].cell.rating_cd=="AAA"||detailData[i].cell.rating_cd=="AA+"||detailData[i].cell.rating_cd=="AA"){
                                                hint="建议申购"
                                            }else{
                                                hint="不建议申购"
                                            }
                                            $("#cnv").append("<tr><td><a href='"+detailData[i].url+"' target='_blank'>"+detailData[i].cell.bond_nm+"</a></td><td>"+detailData[i].cell.premium_rt+"</td><td>"+detailData[i].cell.issuer_rating_cd+"</td><td>"+detailData[i].cell.rating_cd+"</td><td>"+hint+"</td><td>"+detailData[i].startTime+"</td></tr>");
                                        }
                                        //console.log(detailData);
                                    }
                                }
                            },
                            onerror: function(response){
                                $("#cnv").append("<tr><td colspan='6'>根据未来七天可转债打新数据，获取更详细信失败息失败</td></tr>");
                                console.log("请求失败");
                            }
                        });
                    }
                },
                onerror: function(response){
                    $("#cnv").append("<tr><td colspan='6'>获取未来七天可转债数据失败</td></tr>");
                    console.log("请求失败");
                }
            });
        }
        //未来七天可转债打新

        //获取双低可转债
        lowCnv();
        function lowCnv(){
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.jisilu.cn/data/cbnew/cb_list/",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        var warn=json.warn;
                        if(warn){
                            //尚未登陆集思网站，输出提示信息
                            $("#lowcnv").append("<tr><td colspan='6'><a href='https://www.jisilu.cn/account/login/' target='_blank'>"+warn+"！点击前往登陆<a></td></tr>");
                        }else{
                            //获取双低可更详细信息
                            var rows=json.rows;
                            var j,i,detailData=new Array();
                            for(j=0;j<rows.length;j++){
                                if(parseFloat(rows[j].cell.price)<=110 && parseFloat(rows[j].cell.premium_rt)<30){//选出价格低于110元，溢价率低于30%
                                    if(rows[j].cell.price_tips!="待上市"){//剔除未上市可转债
                                        detailData.push(rows[j]);
                                    }
                                }
                            }
                            //按溢价率高低排序
                            j=0;
                            var change,first,second;
                            for(j;j<detailData.length-1;j++){
                                first=parseFloat(detailData[j].cell.premium_rt);
                                second=parseFloat(detailData[j+1].cell.premium_rt);
                                if(second<first){
                                    change=detailData[j];
                                    detailData[j]=detailData[j+1];
                                    detailData[j+1]=change;
                                    j=0;
                                }
                            }
                            //根据债券评级来确定申购意见，并在页面显示最终结果
                            var hint="建议投资金额10000元",url="https://www.jisilu.cn/data/convert_bond_detail/";
                            for(i=0;i<detailData.length;i++){
                                $("#lowcnv").append("<tr><td><a href='"+url+detailData[i].id+"' target='_blank'>"+detailData[i].cell.bond_nm+"</a></td><td>"+detailData[i].cell.premium_rt+"</td><td>"+detailData[i].cell.price+"</td><td>"+detailData[i].cell.issuer_rating_cd+"</td><td>"+detailData[i].cell.rating_cd+"</td><td>"+hint+"</td></tr>");
                            }
                            //console.log(detailData);
                        }
                    }
                },
                onerror: function(response){
                    $("#lowcnv").append("<tr><td colspan='6'>请求失败</td></tr>");
                    console.log("请求失败");
                }
            });
        }
        //获取双低可转债

        //溢价率查询，有缺陷，待完善
        discount_rt();
        function discount_rt(){
            //输入基本信息
            var code=new Array();
            code[0]=["中概互联网ETF","513050","欧美市场QDII","https://www.jisilu.cn/data/qdii/qdii_list/E"];
            code[1]=["中概互联网LOF","164906","欧美市场QDII","https://www.jisilu.cn/data/qdii/qdii_list/E"];
            code[2]=["生物科技LOF","501009","中国市场LOF","https://www.jisilu.cn/data/lof/index_lof_list/"];
            code[3]=["医疗ETF","512170","中国市场ETF","https://www.jisilu.cn/data/etf/etf_list/"];
            code[4]=["恒生互联网ETF","513330","亚洲市场QDII","_HSIII","https://www.jisilu.cn/data/qdii/qdii_list/A"];
            code[5]=["恒生科技","513130","亚洲市场QDII","_HSTECH","https://www.jisilu.cn/data/qdii/qdii_list/A"];
            code[6]=["华夏上证50AH优选指数（LOF）A","501050","中国市场LOF","https://www.jisilu.cn/data/lof/index_lof_list/"];
            var QDIIE=new Array();
            var QDIIA=new Array();
            var LOF=new Array();
            var ETF=new Array();
            var i;
            for(i=0;i<code.length;i++){
                switch(code[i][2]){
                    case "欧美市场QDII":
                        QDIIE.push(code[i]);
                        break;
                    case "亚洲市场QDII":
                        QDIIA.push(code[i]);
                        break;
                    case "中国市场LOF":
                        LOF.push(code[i]);
                        break;
                    case "中国市场ETF":
                        ETF.push(code[i]);
                        break;
                }
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.jisilu.cn/data/qdii/qdii_list/E",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        var rows=json.rows;
                        //"fund_id": 指数基金代码
                        //"fund_nm": 指数基金名称
                        //"price"：现价
                        //"urls": 指数详情,
                        //"fund_nav": T-2净值
                        //"nav_dt": 净值日期
                        //"estimate_value": T-1估值
                        //"est_val_dt": 估值日期
                        //"discount_rt": T-1溢价率
                        $("#discount_rt").prepend("<tr><th>指数基金名称</th><th>现价</th><th><p>T-2净值</p><p>净值日期</p></th><th><p>T-1估值</p><p>估值日期</p></th><th>T-1溢价率</th><th>实时估值</th><th>实时溢价率</th></tr>");
                        var i,j,html;
                        for(i=0;i<QDIIE.length;i++){
                            for(j=0;j<rows.length;j++){
                                if(QDIIE[i][1]==rows[j].id){
                                    html="";
                                    html+="<tr><a href='"+rows[j].cell.url+"' target='_blank'><td>"+rows[j].cell.fund_nm+"</td><a>";
                                    html+="<td>"+rows[j].cell.price+"</td>";
                                    html+="<td><p>"+rows[j].cell.fund_nav+"</p>";
                                    html+="<p>"+rows[j].cell.nav_dt+"</p></td>";
                                    html+="<td><p>"+rows[j].cell.estimate_value+"</p>";
                                    html+="<p>"+rows[j].cell.est_val_dt+"</p></td>";
                                    html+="<td>"+rows[j].cell.discount_rt+"</td>";
                                    html+="<td>-</td>";
                                    html+="<td>-</td></tr>";
                                    $("#discount_rt").append(html);
                                    //console.log(rows[j]);
                                    continue;
                                }
                            }
                        }
                        //console.log(json);
                    }
                },
                onerror: function(response){
                    $("#discount_rt").append("<tr><td colspan='9'>请求失败</td></tr>");
                    console.log("请求失败");
                }
            });
            //亚洲市场QDII
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.jisilu.cn/data/qdii/qdii_list/A",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        var rows=json.rows;
                        //"fund_id": 指数基金代码
                        //"fund_nm": 指数基金名称
                        //"price"：现价
                        //"urls": 指数详情,
                        //"fund_nav": T-2净值
                        //"nav_dt": 净值日期
                        //"estimate_value": T-1估值
                        //"est_val_dt": 估值日期
                        //"discount_rt": T-1溢价率
                        $("#discount_rt").append("<tr><th>指数基金名称</th><th>现价</th><th><p>基金净值</p><p>净值日期</p></th><th><p>估值</p><p>估值日期</p></th><th>溢价率</th><th>/</th><th>/</th></tr>");
                        var i,j,html;
                        for(i=0;i<QDIIA.length;i++){
                            for(j=0;j<rows.length;j++){
                                if(QDIIA[i][1]==rows[j].id){
                                    html="";
                                    html+="<a href='"+rows[j].cell.url+"' target='_blank'><td>"+rows[j].cell.fund_nm+"</td><a>";
                                    html+="<td>"+rows[j].cell.price+"</td>";
                                    html+="<td><p>"+rows[j].cell.fund_nav+"</p>";
                                    html+="<p>"+rows[j].cell.nav_dt+"</p></td>";
                                    html+="<td><p>"+rows[j].cell.estimate_value+"</p>";
                                    html+="<p>"+rows[j].cell.est_val_dt+"</p></td>";
                                    html+="<td>"+rows[j].cell.discount_rt+"</td>";
                                    html+="<td>-</td>";
                                    html+="<td>-</td>";
                                    $("#discount_rt").append("<tr>"+html+"</tr>");
                                    //console.log(rows[j]);
                                    continue;
                                }
                            }
                        }
                        //console.log(json);
                    }
                },
                onerror: function(response){
                    $("#discount_rt").append("<tr><td colspan='9'>请求失败</td></tr>");
                    console.log("请求失败");
                }
            });
            //中国市场LOF
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.jisilu.cn/data/lof/index_lof_list/",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        var rows=json.rows;
                        //"fund_id": 指数基金代码
                        //"fund_nm": 指数基金名称
                        //"price"：现价
                        //"urls": 指数详情,
                        //"fund_nav": 基金净值
                        //"nav_dt": 净值日期
                        //"estimate_value": 实时估值
                        //"est_val_dt": 估值日期
                        //"discount_rt":溢价率
                        $("#discount_rt").append("<tr><th>指数基金名称</th><th>现价</th><th><p>基金净值</p><p>净值日期</p></th><th><p>实时估值</p><p>估值日期</p></th><th>溢价率</th><th>/</th><th>/</th></tr>");
                        var i,j,html;
                        for(i=0;i<LOF.length;i++){
                            for(j=0;j<rows.length;j++){
                                if(LOF[i][1]==rows[j].id){
                                    html="";
                                    html+="<a href='"+rows[j].cell.url+"' target='_blank'><td>"+rows[j].cell.fund_nm+"</td><a>";
                                    html+="<td>"+rows[j].cell.price+"</td>";
                                    html+="<td><p>"+rows[j].cell.fund_nav+"</p>";
                                    html+="<p>"+rows[j].cell.nav_dt+"</p></td>";
                                    html+="<td><p>"+rows[j].cell.estimate_value+"</p>";
                                    html+="<p>"+rows[j].cell.est_val_dt+"</p></td>";
                                    html+="<td>"+rows[j].cell.discount_rt+"</td>";
                                    html+="<td>-</td>";
                                    html+="<td>-</td>";
                                    $("#discount_rt").append("<tr>"+html+"</tr>");
                                    //console.log(rows[j]);
                                    continue;
                                }
                            }
                        }
                        //console.log(json);
                    }
                },
                onerror: function(response){
                    $("#discount_rt").append("<tr><td colspan='9'>请求失败</td></tr>");
                    console.log("请求失败");
                }
            });
            //中国市场ETF
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.jisilu.cn/data/etf/etf_list/",
                headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"},
                onload: function(res) {
                    if (res.status==200) {
                        var text=res.responseText;
                        var json=JSON.parse(text);
                        var rows=json.rows;
                        //"fund_id": 指数基金代码
                        //"fund_nm": 指数基金名称
                        //"price"：现价
                        //"urls": 指数详情,
                        //"fund_nav": T-2净值
                        //"nav_dt": 净值日期
                        //"estimate_value": T-1估值
                        //"est_val_dt": 估值日期
                        //"discount_rt": T-1溢价率
                        $("#discount_rt").append("<tr><th>指数基金名称</th><th>现价</th><th>基金净值</th><th>估值</th><th>估值日期</th><th>溢价率</th><th>/</th></tr>");
                        var i,j,html;
                        for(i=0;i<ETF.length;i++){
                            for(j=0;j<rows.length;j++){
                                if(ETF[i][1]==rows[j].id){
                                    html="";
                                    html+="<a href='"+rows[j].cell.url+"' target='_blank'><td>"+rows[j].cell.fund_nm+"</td><a>";
                                    html+="<td>"+rows[j].cell.price+"</td>";
                                    html+="<td>"+rows[j].cell.fund_nav+"</td>";
                                    html+="<td>"+rows[j].cell.estimate_value+"</td>";
                                    html+="<td>"+rows[j].cell.nav_dt+"</td>";
                                    html+="<td>"+rows[j].cell.discount_rt+"</td>";
                                    html+="<td>-</td>";
                                    $("#discount_rt").append("<tr>"+html+"</tr>");
                                    //console.log(rows[j]);
                                    continue;
                                }
                            }
                        }
                        //console.log(json);
                    }
                },
                onerror: function(response){
                    $("#discount_rt").append("<tr><td colspan='9'>请求失败</td></tr>");
                    console.log("请求失败");
                }
            });
            //console.log(QDIIE);console.log(QDIIE);console.log(LOF);console.log(ETF);
        }
        //溢价率查询，有缺陷，待完善

        //设置Cookie
        function setCookie(name, value, day){
            //当设置的时间等于0时，不设置expires属性，cookie在浏览器关闭后删除
            if(day !== 0){
                var expires = day * 24 * 60 * 60 * 1000;
                var date = new Date(+new Date()+expires);
                document.cookie = name + "=" + escape(value) + ";expires=" + date.toUTCString();
            }else{
                document.cookie = name + "=" + escape(value);
            }
        }
        //设置Cookie
        //获取Cookie
        function getCookie(name) {
            var arr;
            var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)){
                return unescape(arr[2]);
            }else{
                return null;
            }
        }
        //获取Cookie
    });



   
})();