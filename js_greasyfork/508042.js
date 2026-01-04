// ==UserScript==
// @name         HEMS会议辅助检查
// @namespace    http://tampermonkey.net/
// @description   🔥功能介绍🔥：🎉 1、核对会议时间；🎉 2、核对会议类型与负责人；🎉 3、核对费用是否超标；🎉 4、核对外部参会人员是否达标；🎉 5、核对内外部人员是否填反；🎉 6、核对讲者类型等等；
// @version      3.3.2
// @author       兴宝
// @license       GPL License
// @match        https://biz.meetingbest.com/eastchinapharm/event/*
// @exclude      https://biz.meetingbest.com/eastchinapharm/*/event-form
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508042/HEMS%E4%BC%9A%E8%AE%AE%E8%BE%85%E5%8A%A9%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/508042/HEMS%E4%BC%9A%E8%AE%AE%E8%BE%85%E5%8A%A9%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let wait_time=50//等候时间为毫秒，如果网上较慢，可以调整参数去适应等待的网速；
    let peoples=5//1个付费讲者对应着5个外部听众，如果对应6个，可以改为6；
    let money=300//人均餐标为300元，可以自行调整参数；
    let Persontype=2//1个讲者对应2个点评，如果对应1个点评，将2改为1即可
    let preside=1//允许主持人数
    let yes='#90EE90'
    let no='#FF4500'
    let 着色=[]
    let 审批意见=""
    let $ = window.jQuery;
    let pages
    let 讲者标签=true
    let 预算标签=true
    let q=1//权重比例
    let 初始页面=0
    let 计时器讲者键=null
    let all讲者名称=""

    function timeDiff(startTime, endTime) {
        startTime = startTime.replace(/-/g, '/');
        endTime = endTime.replace(/-/g, '/');
        let start = new Date(startTime);
        let end = new Date(endTime);
        let diff = end - start;
        let minutes = Math.floor(diff / (1000 * 60));
        return minutes;
    };

    function handleClick() {
  
        let 计时器1=setInterval(function(){
            let checkElement1 ={
                会议申请人:$(".form-info__select").eq(0).text(),
                会议负责人:$(".form-info__select").eq(1).text(),
                归属部门负责人:$(".form-info__text").eq(6).text(),
                会议类型:$(".form-info__cascader").eq(0).text(),
                会议开始时间:$(".form-info__date-time").eq(1).text(),
                会议结束时间:$(".form-info__date-time").eq(2).text(),
                其他补充信息:$("#tab-3").text(),
                内部参会人数:$(".form-info__number").eq(0).text(),
                外部参会人数:$(".form-info__number").eq(1).text(),
                exits:()=>{
                    for (let keys in checkElement1){
                        if(checkElement1[keys]!==''){
                            clearInterval(计时器1);
                          
                            arr2()
                        
                            break;
                        }
                    };

                }
            }
            checkElement1.exits()
        }, wait_time);

    }
    function arr2(){

        let elems={
            会议申请人:$(".form-info__select").eq(0),
            会议负责人:$(".form-info__select").eq(1),
            归属部门负责人:$(".form-info__text").eq(6),
            会议类型:$(".form-info__cascader").eq(0),
            会议开始时间:$(".form-info__date-time").eq(1),
            会议结束时间:$(".form-info__date-time").eq(2),
            其他补充信息:$("#tab-3"),
            内部参会人数:$(".form-info__number").eq(0),
            外部参会人数:$(".form-info__number").eq(1),
        }

        $.each(着色, function (key, element) {
            $(elems[element[0]]).css('background-color', element[1]);
        });
        }


    function arr(a,b){
        着色.push([a,b])
    }


    $(document).ready(function() {
        let 计时器2=setInterval(function(){
            let checkElement ={
                会议申请人:$(".form-info__select").eq(0).text(),
                会议负责人:$(".form-info__select").eq(1).text(),
                归属部门负责人:$(".form-info__text").eq(6).text(),
                会议类型:$(".form-info__cascader").eq(0).text(),
                会议开始时间:$(".form-info__date-time").eq(1).text(),
                会议结束时间:$(".form-info__date-time").eq(2).text(),
                讲者标签:$("#tab-1").text(),
                其他补充信息:$("#tab-3").text(),
                内部参会人数:$(".form-info__number").eq(0).text(),
                外部参会人数:$(".form-info__number").eq(1).text(),
                exits:()=>{
                    for (let keys in checkElement){
                        if(checkElement[keys]==''&& keys!=="归属部门负责人"){
                            break;

                        }else{
                            if(keys!=="外部参会人数"){
                                continue;

                            }else{
                                pages=checkElement
                                clearInterval(计时器2);
                          
                                
                                绿幕1()
                                

                       

                                
                                break;
                            }
                        };
                    };

                }
            }
            checkElement.exits()
        }, 1000);

        function 绿幕1(){
            
           
             let minutesDiff = timeDiff(pages.会议开始时间, pages.会议结束时间);
                if(minutesDiff>=20){
                    if(minutesDiff>=240){
                        alert(`申请会议时间长达${minutesDiff/60}小时，请核实`);
                        arr("会议开始时间",no);
                        arr("会议结束时间",no);
                        审批意见="申请会议时长有误;"
                    }else{
                        arr("会议开始时间",yes);
                        arr("会议结束时间",yes);
                    };

                }else{
                    arr("会议开始时间",no);
                    arr("会议结束时间",no);
                    审批意见+="申请会议时长不满20分钟;"
                };
           
            if(pages.会议类型!=="自办活动 / 院内会 " && pages.会议类型!=="自办活动 / 科室会 "){
                if(pages.会议负责人==pages.归属部门负责人||$(".form-info__text").eq(5).text().indexOf("经理")>0||$(".form-info__text").eq(5).text().indexOf("组长")>0){
                    arr("会议申请人",yes);
                    arr("会议负责人",yes);
                    arr("归属部门负责人",yes);
                    arr("会议类型",yes);
                    if($(".form-info__text").eq(5).text().indexOf("服务专员")>0){
                        arr("归属部门负责人",no);
                        alert(`默认部门负责人为经理级别及以上，此服务专员担任了部门负责人，请核实情况`);
                    }


                }else{
                    arr("会议申请人",no);
                    arr("会议负责人",no);
                    arr("归属部门负责人",no);
                    arr("会议类型",no);
                    审批意见+="跨院会及以上会议，会议负责人需经理级别及以上;"
                }
            }else{arr("会议申请人",yes);
                  arr("会议负责人",yes);
                  arr("归属部门负责人",yes);
                  arr("会议类型",yes);}
            if($("#tab-1").text()=="会议协办人信息"){$("#tab-2").click();}else{$("#tab-1").click();}
            
            绿幕2()

        }

       
        function 绿幕2(){
          
            if(pages.讲者标签=="讲者信息"||$("#tab-2").text()=="讲者信息"){

                计时器讲者键=setInterval(function(){
                    let checkElement2 ={
                        讲者人数:$("tbody").eq(0).find(".el-table__row").length,

                        exits:()=>{
                            for (let keys in checkElement2){
                                if(checkElement2[keys]==0){
                                    break;
                                }else{
                                    clearInterval(计时器讲者键);
                                    pages["讲者人数"]=checkElement2["讲者人数"]
                             
                                    绿幕201()



                                    break;
                                }
                            }

                        }
                    }
                    checkElement2.exits()
                }, wait_time);



                function 绿幕201(){
              
                    if(+(pages.外部参会人数)>=$('table.el-table__body[style="width: 1034px;"]').find("tr.el-table__row").length*peoples){
                        
                        arr("外部参会人数",yes);

                    }else{
                        arr("外部参会人数",no);
                        审批意见+="付费讲者:外部听众人数>1:"+peoples+";"
                    }
            
                    if(+(pages.外部参会人数)<=+(pages.内部参会人数)){
                        arr("外部参会人数",no);
                        arr("内部参会人数",no);
                        审批意见+="内部参会人员与外部参会人员人数填反;"
                    }else{
                        arr("内部参会人数",yes);
                    }

           
                    if(pages.会议类型=="自办活动 / 患教会"){q=0.6;}
           
                    let 演讲分享=0;
                    let 讨论点评=0;
                    let 主席主持=0;
                    $("tbody").eq(0).find(".el-table__row").each(function() {
                        let 产品=$(this).find("td:eq(1)").find("span:eq(0)").text().replace(/.*\//, '').replace(")","");
                        let 讲者等级=$(this).find("td:eq(1)").find("span:eq(1)").text();
                        let 服务类型=$(this).find("td:eq(2)").find("div div div div[data-v-4dac1232]").text();
                        let 劳务费=$(this).find("td:eq(3)").find("div div div div").text().replace("￥","").replace(",","");
                        let 讲者名称=$(this).find("td:eq(1)").find("span:eq(0)").text();
                        pages['产品']=产品
                        if(all讲者名称==""){all讲者名称=讲者名称}
                        else{all讲者名称=讲者名称+"——"+all讲者名称}
                      
                        if(产品=="默认产品组"){
                            switch(讲者等级){
                                case "一级":
                                    if(劳务费<=5000*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;
                                case "二级":
                                    if(劳务费<=3000*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;
                                case "三级":
                                    if(劳务费<=2000*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;
                                case "四级":
                                    if(劳务费<=1000*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;
                                case "五级":
                                    if(劳务费<=800*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;

                            }

                        }else{
                            switch(讲者等级){
                                case "一级":
                                    if(劳务费<=3000*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;
                                case "二级":
                                    if(劳务费<=2000*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;
                                case "三级":
                                    if(劳务费<=1000*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;
                                case "四级":
                                    if(劳务费<=500*q){$(this).find("td:eq(3)").find("div div div div").css('background-color',yes);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',yes);}else
                                    {$(this).find("td:eq(3)").find("div div div div").css('background-color',no);$(this).find("td:eq(1)").find("span.speaker-info__name").css('background-color',no);讲者标签=false;审批意见+="讲者费用超标;";};
                                    break;
                            }
                        }


                        switch(服务类型){
                            case "主席/主持":
                                主席主持+=1;
                                break;
                            case "讨论/点评":
                                讨论点评+=1;
                                break;
                            case "演讲/分享":
                                演讲分享+=1;
                                break;

                        }


                    });
                  
                    if(主席主持<=preside){
                        if(讨论点评/演讲分享<=Persontype){
                            meeting(yes);

                        }else{
                            审批意见+="讨论点评人数超标;";
                            meeting(no);
                            讲者标签=false;
                        }

                    }else{
                        审批意见+="主持人数大于2个;";
                        meeting(no);
                        讲者标签=false;
                        if(主席主持<=2 && pages["外部参会人数"]>30){
                            meeting(yes);
                            讲者标签=true;

                        }

                    }
                 
                    if(pages.会议类型=="自办活动 / 患教会" && 主席主持+讨论点评>=1){
                        审批意见+="患教会付费讲者只能是演讲分享;";
                        meeting(no);
                        讲者标签=false;
                    }
                    function meeting(m){
                        $(".el-table__row").each(function() {
                            $(this).find("td:eq(2)").find("div div div div[data-v-4dac1232]").css('background-color',m);
                        });
                    }
                    if(初始页面==0){
                        if($("#tab-2").text()=="会议预算信息"){$("#tab-2").click();}else if($("#tab-3").text()=="会议预算信息"){$("#tab-3").click();}else{$("#tab-1").click();}
                        绿幕3();}
                }
            }else{if(初始页面==0){
                if($("#tab-2").text()=="会议预算信息"){$("#tab-2").click();}else if($("#tab-3").text()=="会议预算信息"){$("#tab-3").click();}else{$("#tab-1").click();}
                绿幕3()}}

        }


        function 绿幕3(){
                计时器讲者键=setInterval(function(){
                    let checkElement3 ={
                        个人垫付总费用:$("p[data-v-7d8e05a2].el-tooltip").eq(1).text(),

                        exits:()=>{

                                if(checkElement3.个人垫付总费用){
                                    clearInterval(计时器讲者键);
                                    预算()
                                }
                        }
                    }
                    checkElement3.exits()
                }, wait_time);

        }
       
        function 预算(){
            if($(".el-table__empty-text").find("span[data-v-dfec662e]").text()!=='暂无数据'){
                $("tbody").eq(0).find(".el-table__row").each(function() {
                    if($(this).find("td:eq(0)").find("div div div div").text()=="餐费"){
                        let 人均=$(this).find("td:eq(3)").find("div div div span strong").text().replace("￥","").replace(",","")
                        let 人数=$(this).find("td:eq(2)").find("div div div").text();
                        if(+(人均)>money){
                            $(this).find("td:eq(3)").find("div div div span").css('background-color',no);
                            审批意见+="人均餐标费用超出300元;";
                            预算标签=false
                        }else{$(this).find("td:eq(3)").find("div div div span").css('background-color',yes)}
                        if(Number(人数)>Number(pages.内部参会人数)+Number(pages.外部参会人数)){
                            $(this).find("td:eq(2)").find("div div div").css('background-color',no);
                            审批意见+="用餐人数大于会议申请的总人数;";
                            arr("外部参会人数",no);
                            预算标签=false
                        }else{$(this).find("td:eq(2)").find("div div div").css('background-color',yes);}

                    }

                });
                if(初始页面==0){化妆()}
            }else{if(初始页面==0){化妆()}}
        }




      
  function 闭会(){
            if($(".name").eq(1).text()=='补充会议信息与材料'){

                if(pages["产品"]=="默认产品组"){$(".mbs-item__info_content").find("p").eq(0).append(`<span style="color: green;">${"\xa0".repeat(55)}产品类型：\xa0\xa0${pages["产品"]}</span>`)}
                else{if($("tbody").eq(0).find(".el-table__row").length>=5){$(".mbs-item__info_content").find("p").eq(0).append(`<span style="color: green;">${"\xa0".repeat(55)}产品类型：\xa0\xa0${pages["产品"]}</span>`)}else{
                    $(".mbs-item__info_content").find("p").eq(0).append(`<span style="color: red;">${"\xa0".repeat(55)}产品类型：\xa0\xa0${pages["产品"]}</span>`)}}

                if(pages["会议开始时间"]==$(".mbs-item__info_content").find("p").eq(1).text()+':00 '){$(".mbs-item__info_content").find("p").eq(1).append(`<span style="color: green;">${"\xa0".repeat(30)}申请会议开始时间：\xa0\xa0${pages["会议开始时间"]}</span>`)}
                else{$(".mbs-item__info_content").find("p").eq(1).append(`<span style="color: red;">${"\xa0".repeat(30)}申请会议开始时间：\xa0\xa0${pages["会议开始时间"]}</span>`)}

                if(pages["会议结束时间"]==$(".mbs-item__info_content").find("p").eq(2).text()+':00 '){$(".mbs-item__info_content").find("p").eq(2).append(`<span style="color: green;">${"\xa0".repeat(30)}申请会议结束时间：\xa0\xa0${pages["会议结束时间"]}</span>`)}else{
                     $(".mbs-item__info_content").find("p").eq(2).append(`<span style="color: red;">${"\xa0".repeat(30)}申请会议结束时间：\xa0\xa0${pages["会议结束时间"]}</span>`)} 
                if(pages["内部参会人数"]==$(".mbs-item__info_content").find("p").eq(3).text().replace("人"," ")){$(".mbs-item__info_content").find("p").eq(3).append(`<span style="color: green;">${"\xa0".repeat(53)}申请内部参会人数：\xa0\xa0${pages["内部参会人数"]}人</span>`)}else{
                    $(".mbs-item__info_content").find("p").eq(3).append(`<span style="color: red;">${"\xa0".repeat(53)}申请内部参会人数：\xa0\xa0${pages["内部参会人数"]}人</span>`)
                }
                
                if(pages["外部参会人数"]==$(".mbs-item__info_content").find("p").eq(4).text().replace("人"," ")){$(".mbs-item__info_content").find("p").eq(4).append(`<span style="color: green;">${"\xa0".repeat(53)}申请外部参会人数：\xa0\xa0${pages["外部参会人数"]}人</span>`)}else{
                    $(".mbs-item__info_content").find("p").eq(4).append(`<span style="color: red;">${"\xa0".repeat(53)}申请外部参会人数：\xa0\xa0${pages["外部参会人数"]}人</span>`)
                }
                if($(".mbs-item__info_content").find("p").eq(5).text()==pages["讲者人数"]){$(".mbs-item__info_content").find("p").eq(5).append(`<span style="color: green;">${"\xa0".repeat(57)}申请讲者人数：\xa0\xa0${pages["讲者人数"]}</span><span style="color: black;">\xa0\xa0\xa0\xa0${all讲者名称}</span>`)}else{
                    $(".mbs-item__info_content").find("p").eq(5).append(`<span style="color: red;">${"\xa0".repeat(57)}申请讲者人数：\xa0\xa0${pages["讲者人数"]}\xa0\xa0\xa0\xa0${all讲者名称}</span><span style="color: black;">\xa0\xa0${all讲者名称}</span>`)
                }
               



            }


        }







        function 化妆(){
            if(初始页面==0){$("#tab-0").click();}
            $(".el-tabs__nav-scroll").eq(0).find(".el-tabs__item").each(function() {
                初始页面=1
                if($(this).text()=="讲者信息"){

                    $(this).on('click',绿幕2);
                    if(讲者标签==true){
                        $(this).css('background-color',yes)
                    }else{
                        $(this).css('background-color',no)
                    }
                }

               if($(this).text()=="会议预算信息"){

                   $(this).on('click',绿幕3);
                   if(预算标签==true){
                       $(this).css('background-color',yes)
                   }else{
                       $(this).css('background-color',no)
                   }
                }




            })
           /*if(pages.讲者标签=="讲者信息"){
                初始页面=1
                $("#tab-1").on('click',绿幕2);
                $("#tab-2").on('click',绿幕3);
            }else if(pages.讲者标签=="会议协办人信息"){
                $("#tab-2").on('click',绿幕2);
                $("#tab-3").on('click',绿幕3);
                初始页面=1;}
            else{
                初始页面=1
                $("#tab-1").on('click',绿幕3);
                }*/
          
            $("#tab-0").on('click',handleClick);

            //讲者和预算标签上色
            /*if(pages.讲者标签=="讲者信息" ){
                if(讲者标签==true){
                    $("#tab-1").css('background-color',yes)
                }else{
                    $("#tab-1").css('background-color',no)
                }
                if(预算标签==true){
                    $("#tab-2").css('background-color',yes)
                }else{
                    $("#tab-2").css('background-color',no)
                }


            }else{
                if(pages.讲者标签=="会议协办人信息" ){
                if(讲者标签==true){
                    $("#tab-2").css('background-color',yes)
                }else{
                    $("#tab-2").css('background-color',no)
                }
                if(预算标签==true){
                    $("#tab-3").css('background-color',yes)
                }else{
                    $("#tab-3").css('background-color',no)
                }
                }else{


                if(预算标签==true){
                    $("#tab-1").css('background-color',yes)
                }else{
                    $("#tab-1").css('background-color',no)
                }}
            }*/





            $("div textarea").val(审批意见);
            闭会();
            handleClick();
            
        }

























});

})();