// ==UserScript==
// @name         人生重启auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  重启人生模拟器,自动运行,早日修仙
// @author       You
// @require      http://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @match        http://liferestart.syaro.io/view/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/433612/%E4%BA%BA%E7%94%9F%E9%87%8D%E5%90%AFauto.user.js
// @updateURL https://update.greasyfork.org/scripts/433612/%E4%BA%BA%E7%94%9F%E9%87%8D%E5%90%AFauto.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var num  = 0;
    var total = 0 ;
    var running = false;
    var window_url = window.location.href;
    var website_host = window.location.host;
    var topBox = "<div style='position:fixed;z-index:999999;cursor:pointer;top:200px;left:0px;'>"+
        "<div id='my_start' style='text-align:center;font-size:13px;padding:10px 6px;color:#FFF;background-color:#FE8A24;border-bottom-right-radius:6px;'>开始</div>";
    $("body").append(topBox);
    $(".banners-container").remove();//移除banner提升池
    $("body").on("click","#my_start",function(){
        $("#summary.mainbtn").click()//人生总结
        $("#again.mainbtn").click()//再次重开
        startFunction();
        // print()
    });
    function print(num){

        var list = $("#talentSelectedView.selectlist li");
        console.info("============第"+num+"次已选天赋============");
        console.log(list[1].innerText);
        console.log(list[2].innerText);
        console.log(list[3].innerText);

        var p = $("#propertyAllocation input");
        console.log("颜值: "+p[0].value+" 智力: "+p[1].value+" 体质: "+p[2].value+" 家境: "+p[3].value);

    }
    function selectTalents(){
        $(".selected").click();
        $(".grade3b").click();//橙色
        $(".grade2b").click();//紫色
        $(".grade1b").click();//蓝色
        $(".grade0b").click();//普通灰色
    }
    function startFunction(){
        num++;
        //  if( $("#restart").length>0){
        $("#restart").click();//立即重开
        $("#random").click();//10连抽
        $(".grade3b").click();//橙色
        $(".grade2b").click();//紫色
        $(".grade1b").click();//蓝色
        $(".grade0b").click();//普通灰色
        $("#next.mainbtn").click();//开始新人生
        $("#random.mainbtn").click()//随机分配天赋
        print(num);
        $("#start.mainbtn").click()//开始新人生
        while($("#auto").is(":visible")){
            $("#lifeTrajectory").click()
        };
        var age_text = $("#lifeTrajectory").children().last().children().first().text();
        var age = parseInt(age_text.slice(0,-2));
        if(age>=100){
            total++;
            console.error("第 "+num+" 次,修仙成功,活到了 "+age+" 岁======>成功次数:"+total);
            //  if(total>10000){
            //     alert("第 "+num+" 次,修仙成功,活到了 "+age+" 岁");
            //  }else{
            //      $("#summary.mainbtn").click()//人生总结
            //      $("#again.mainbtn").click()//再次重开
            //      startFunction();
            //  }
            alert("第 "+num+" 次,修仙成功,活到了 "+age+" 岁");
        }else{
            console.warn("第 "+num+" 次,修仙失败,活到了 "+age+" 岁");
            $("#summary.mainbtn").click()//人生总结
            $(".selected").click();
            $(".grade3b").click();
            $("#again.mainbtn").click()//再次重开
            startFunction();
        }
        // }
    }
})();
