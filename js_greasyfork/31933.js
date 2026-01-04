// ==UserScript==
// @name         bilibili弹幕定位
// @namespace    http://tampermonkey.net/
// @version      2.18
// @description  在进度条上定位弹幕
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=618337
// @author       mscststs
// @match        http*://www.bilibili.com/video/*
// @grant        non
// @downloadURL https://update.greasyfork.org/scripts/31933/bilibili%E5%BC%B9%E5%B9%95%E5%AE%9A%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/31933/bilibili%E5%BC%B9%E5%B9%95%E5%AE%9A%E4%BD%8D.meta.js
// ==/UserScript==


(async function () {
    'use strict';
	
	await mscststs.wait(".bilibili-player-video-message-ul");
    var danmu = [];
    var ava = 0;
    var result = [];
    var good_count = 0;
    var err_code = "弹幕扫描完毕 就是这样~喵";
    var mark_233=0;
    var mark_666=0;
    $("body").prepend(`<style>
	.bilibili-player-video-progress .bpui-slider-tracker-wrp .bpui-slider-tracker {
	height: 25px!important;
	top: 15%!important
}

.bilibili-player-video-progress .bpui-slider-tracker-wrp .bilibili-player-video-progress-buffer {
	height: 25px!important
}

.bilibili-player-video-progress .bpui-slider-tracker-wrp .bpui-slider-handle {
	height: 32px!important
}
	</style>`);
    function search(tkey){
        let res = [];
        $.each(danmu,function(i,a){
            if(a.text.indexOf(tkey)>=0){
                res.push(a);
            }
        });

        if(res.length>0){
            ava = 1;
        }else{
            ava = 0;
        }
        info("搜索完毕，共找到"+res.length+"条弹幕");
        return res;
    }


    function pushArray(obj){
        danmu.push(obj);
    }

    function ArraySort(){
        danmu.sort(function(a,b){
            return a.time-b.time;
        });

        init();


        //数据初始化完毕，do something here
    }

    function saveXml(xml){
        $(xml).find("d").each(function(i)
                              {
            var vas = $(this).attr("p").split(',');
            var time = vas[0];
            var dmid = vas[7];
            var text = $(this).text();
            var odanmu = new Object();
            odanmu.time = time;
            odanmu.dmid = dmid;
            odanmu.text = text;
            pushArray(odanmu);
        });

        ArraySort();

    }

    function StandardTaxRate()
    {
        $.ajax({
            url: "https://comment.bilibili.com/"+cid+".xml",
            dataType: 'xml',
            type: 'GET',
            timeout: 4000,
            error: function(xml)
            {
                err_code = "弹幕异常，这里是奇怪の领域";
                //alert("弹幕定位助手初始化失败，弹幕链接"+"https://comment.bilibili.com/"+cid+".xml"+"  错误信息："+xml.find("d").text());
                saveXml(xml);

            },
            success: function(xml)
            {
                saveXml(xml);
            }
        });
    }
    StandardTaxRate();

    function info(text){
        $("#helper_info").text(text);
    }

    function creatPanal(){
        $(".player-box").prepend('<div id="helper_tools"></div>');
        $("#helper_tools").css({
            "position":"absolute",
            "background-color":"rgba(255,255,255,0.7)",
            "left":"50px",
            "top":"150px",
            "width":"120px",
            "height":"300px",
            "z-index":"10000",
            "box-shadow":"0px 0px 6px rgba(0,0,0,0.6)"
        });
    }
    function creatTool(){
        $("#helper_tools").append('<div id="helper_message"></div>');
        $("#helper_message").css({
            "position":"absolute",
            "line-height":"20px",
            "left":"0px",
            "top":"0px",
            "color":"white",
            "font-family":"console",
            "font-size":"15px",
            "padding":"5px",
            "width":"110px",
            "height":"40px",
            "background-color":"#ffafc9"
        });
        //console.log(err_code);
        $("#helper_message").text(err_code);
        $("#helper_tools").append('<input type="text" id="helper_input" placeholder="这里填关键字！">');
        $("#helper_tools").append('<div id="helper_info"></div>');
        $("#helper_tools").append('<button type="button" class="b-btn" id="helper_233">233</button>');
        $("#helper_tools").append('<button type="button" class="b-btn" id="helper_666">666</button>');

        $("#helper_tools").append('<button type="button" class="b-btn" id="helper_love">定位</button>');
        $("#helper_tools").append('<button type="button" class="b-btn" id="helper_eval">举报</button>');


        $("#helper_233").css({
            "position":"absolute",
            "left":"6px",
            "top":"195px",
            "font-family":"console",
            "font-size":"18px",
            "width":"50px",
            "height":"30px",
            "border":"1px solid #FFAA00",
            "background-color":"white",
            "color":"#FFAA00",
            "border-radius": "4px"
        });
        $("#helper_666").css({
            "position":"absolute",
            "left":"65px",
            "top":"195px",
            "font-family":"console",
            "font-size":"18px",
            "width":"50px",
            "height":"30px",
            "border":"1px solid #726dde",
            "background-color":"white",
            "color":"#726dde",
            "border-radius": "4px"
        });

        $("#helper_input").css({
            "position":"absolute",
            "left":"0px",
            "top":"50px",
            "font-family":"console",
            "font-size":"16px",
            "width":"118px",
            "height":"25px"
        });

        $("#helper_info").css({
            "position":"absolute",
            "left":"0px",
            "line-height":"20px",
            "top":"80px",
            "color":"white",
            "font-family":"console",
            "font-size":"15px",
            "padding":"5px",
            "width":"110px",
            "height":"140px",
            "background-color":"#ffafc9"
        });

        $("#helper_love").css({
            "position":"absolute",
            "left":"2px",
            "top":"235px",
            "font-family":"console",
            "font-size":"18px",
            "width":"116px",
            "height":"30px",
            "background-color":"white",
            "color":"#f25d8e",
            "border":"1px solid #f25d8e"
        });
        $("#helper_love").hover(function(){
            $("#helper_love").css({"background-color":"#f25d8e","color":"white"});
        },function(){
            $("#helper_love").css({"background-color":"white","color":"#f25d8e"});
        });
        $("#helper_eval").css({
            "position":"absolute",
            "left":"2px",
            "top":"267px",
            "font-family":"console",
            "font-size":"18px",
            "width":"116px",
            "height":"30px"
        });
        info("先输入关键词，再进行操作。一次举报大量弹幕可能会导致封号！");

    }


    function mark(res,color="#f25d8e",flag="helper"){
        $("."+flag).remove();
        var pro = $(".bilibili-player-video-progress-buffer");
        var atime = $("span.bilibili-player-video-time-total").text().split(":");
        var altime = atime[0]*60-(-atime[1]);
        var pwidth = pro.css("width")-30;
        var pheight = pro.css("height");
        $.each(res,function(i,a){

            var le = (a.time)/altime*100;
            le = le*0.97+2;
            // console.log(le);
            var $div = $('<div class='+flag+'></div>');
            $div.css({
                "position":"absolute",
                "width":"1px",
                "height":pheight,
                "left":le+"%",
                "background-color":color,
                "padding":"0",
                "margin":"0",
                "z-index":"100"

            });
            pro.append($div);

        });
    }

    function eval_send(dmid) {
        $.ajax({
            //提交数据的类型 POST GET
            type: "POST",
            //提交的网址
            url: "https://api.bilibili.com/x/dm/report/add",
            //提交的数据
            data: {cid:cid,
                   dmid:dmid,
                   reason:1,
                   content:""},
            //返回数据的格式
            datatype: "JSONP",//"xml", "html", "script", "json", "jsonp", "text".
            //在请求之前调用的函数
            //beforeSend:function(){$("#msg").html("logining");},
            //成功返回之后调用的函数
            success: function (data) {

            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            complete: function () {

                //HideLoading();
            },
            //调用出错执行的函数
            error: function () {
                //请求出错处理
            }
        });
    }
    function init(){
        creatPanal();
        creatTool();
        $("#helper_love").click(function(){
            if(ava==1){
            }else{
                result = search("空降");
            }

            mark(result);
        });
        $(document).on("click","button#helper_eval",function(){
            //alert("hello");
            if(ava==1){
                good_count = 0;
                if(confirm("大量恶意举报可能导致封号！！是否继续")){
                    $.each(result,function(i,a){
                        //console.log(a.dmid);
                        eval_send(a.dmid);
                        good_count++;
                        info("已处理:"+good_count+" / "+result.length);
                        delay(100);

                    });
                    info("处理完毕:"+good_count+" / "+result.length);
                }


            }
        });

        $("#helper_input").bind("input propertychange",function(){
            var tkey = $(this).val();
            //console.log(tkey);
            if(tkey.length>0){
                ava = 1;
                result = search(tkey);
            }else{
                ava = 0;
                info("先输入关键词，再进行操作。一次举报大量弹幕可能会导致封号！");
            }
        });
        $("#helper_233").click(function(){
            if(mark_233===0){
                mark_233=1;
                mark(search("233"),"#FFAA00","helper_233");
                mark(search("hhh"),"#FFAA00","helper_233");
                mark(search("哈哈哈"),"#FFAA00","helper_233");
            }else{
                mark_233=0;
                $(".helper_233").remove();
            }
        });
        $("#helper_666").click(function(){
            if(mark_666===0){
                mark_666=1;
                mark(search("666"),"#726dde","helper_666");
            }else{
                mark_666=0;
                $(".helper_666").remove();
            }
        });
    }
})();
