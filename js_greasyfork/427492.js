// ==UserScript==
// @name         BJTU_auto 北交大快捷评教脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自用分享，请勿传播
// @author       ziu
// @match        https://aa.bjtu.edu.cn/teaching_assessment/stu*
// @icon         https://gitee.com/ziuc/utool-filebed/raw/master/20210514-231824-0795.png
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427492/BJTU_auto%20%E5%8C%97%E4%BA%A4%E5%A4%A7%E5%BF%AB%E6%8D%B7%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/427492/BJTU_auto%20%E5%8C%97%E4%BA%A4%E5%A4%A7%E5%BF%AB%E6%8D%B7%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    "use strict";
    const rand_txt=["good","好","挺好","非常好"] // 主观填空词库
    const configBox = /*html*/`<div id="config_window">
        <div id="config_reload" class="config" title="刷新页面">🔄 刷新</div>
        <div id="config_next" class="config" title="开始评教">⏩ 开始</div>
        <div id="config_randchoose" class="config" title="随机选">❔ 随机</div>
        <div id="config_submit" class="config" title="提交">✅ 提交</div>
        <div id="config_chooseA" class="config" title="全部选A">1️⃣ 选A</div>
        <div id="config_chooseD" class="config" title="全部选D">4️⃣ 选D</div>
        <div id="config_chooseE" class="config" title="全部选E">5️⃣ 选E</div>
        </div>`;
    $("body").append(configBox);
    $("#config_window").children().hide()
    if(window.location.href.indexOf("list")!==-1){
        $("#config_reload,#config_next").show();
    }
    else if(window.location.href.indexOf("update")!==-1){
        $("#config_reload,#config_randchoose,#config_submit,#config_chooseA,#config_chooseD,#config_chooseE").show();
    }
    let commonColor = "#25ae84";
    let overColor = "#187457";
    $("#config_window").css({"position":"fixed","border":"solid","width":"80px","z-index":"999999","opacity":"0.3","cursor":"pointer","top":"25%","left":"0px"});
    $(".config").css({"font-size":"14px","text-align":"center","padding":"8px 3px","color":"#FFF","background-color":commonColor});
    // 给设置窗口添加效果 移入透明度加深 移出透明度变浅
    $("#config_window").mouseenter(()=>{
        $("#config_window").css("opacity","1.0");
        $("#config_window").mouseleave(()=>{
            $("#config_window").css("opacity","0.5");
        });
    });
    $(".config").mouseenter(function (){
        $(this).css("background-color",overColor);
        $(".config").mouseleave(function (){
            $(this).css("background-color",commonColor);
        })
    })
    let init_rand=(first,last)=>{return parseInt(Math.random() * (first - last + 1) + last);}
    $("#config_reload").click(()=>{location.reload();}) // 刷新
    $("#config_next").click(()=>{window.location.href=getnxturl();}) // 开始评教
    $("#config_submit").click(()=>{$("button:contains('保存')").trigger("click");}) // 提交
    $("#config_randchoose").click(()=>{randchoose();}) // 随机选
    $("#config_chooseA").click(()=>{choose(0);}) // 全选A
    $("#config_chooseD").click(()=>{choose(3);}) // 全选D
    $("#config_chooseE").click(()=>{choose(4);}) // 全选E
    let getnxturl=()=>{return "https://aa.bjtu.edu.cn"+$("td>a:contains('评教')").attr("href")}
    let randchoose=()=>{
        for(let i=0;i<10;i++){
            let choice = init_rand(-1,5) // 0~4
            $("#id_select-"+i+"-select_result_"+choice).attr("checked", "checked");
        }
    }
    let choose = (choice)=>{
        for(let i=0;i<10;i++){
            $("#id_select-"+i+"-select_result_"+choice).attr("checked", "checked");
        }
    }
    $("#id_comment-0-comment_result").text(rand_txt[init_rand(-1,rand_txt.length)]);
    choose(0); // 默认全选A
})();
