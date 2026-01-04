// ==UserScript==
// @name         steam库质量净化
// @namespace    http://tampermonkey.net/
// @icon      	https://store.steampowered.com/favicon.ico
// @version      0.81
// @description  此页面https://steamcommunity.com/my/games/?tab=all查看库游戏的质量 游戏全语言总评 及快捷移除功能!(警告!)
// @author       wsz987
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @supportURL   https://keylol.com/t563920-1-1
// @downloadURL https://update.greasyfork.org/scripts/396721/steam%E5%BA%93%E8%B4%A8%E9%87%8F%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396721/steam%E5%BA%93%E8%B4%A8%E9%87%8F%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==


(function() {//按钮生成
    'use strict';
    var i=0;
    for(i;i<$('.gameListRowItemName').length;i++){
        var id = $(".gameListRow")[i].getAttribute("id").replace(/game_/g, '');
        btn(id,i);
    }
    var Btn = "<div id='reBtn' style='cursor:pointer;z-index:998;position:fixed;text-align: center;left:10px;top:300px;'><img src='https://keylol.com/template/steamcn_metro/src/img/common/icon_with_text_256h.png' height='55' ><br /><span>点击过滤好评及以上的游戏</span></div>";
    var Btn1 = "<div id='reBtn1' style='cursor:pointer;z-index:998;position:fixed;text-align: center;left:10px;top:450px;'><span>过滤褒貶不一及以上的游戏</span></div>";
    $("body").append(Btn,Btn1);
    $('#reBtn').click(function() {
        filter();
    });
    $('#reBtn1').click(function() {
        filter();
        filter1();
    });
})();

function start(id){    //跨域请求 官方API_info https://partner.steamgames.com/doc/store/localization
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            method: "GET",
            responseType: "json",
            url:"https://store.steampowered.com/appreviews/"+id+"?json=1&language=all&review_type=all&purchase_type=all",
            onload: data=>{
                resolve(data);
            }
        });
    });
};

function json(data){    //JSON数据
    return new Promise((resolve, reject) => {
        var quality,count="";
        if(data.status == "200" &&data.responseText!=="null"){
            if(data.response.success==1){
                var json=data.response.query_summary;
                quality=json.review_score_desc;
                if(json.total_reviews!=0){
                    count="("+json.total_reviews+")";
                }
            }else{
                quality="下架/测试版";
            }
            resolve({quality,count});
        }
    });
}

async function btn(id,i){     //添加game_info
    var arr=await json(await start(id));
    var quality=await arr.quality;
    var count=await arr.count;
    var txt = document.createElement('div');
    txt.className = 'pullup_item Loaded ';
    txt.id=id;
    txt.innerText=quality+count;
    if(quality.indexOf("不一")>-1||quality=="Mixed"){
        txt.style.color="#B9A074";
        txt.className+='filter_Mixed';
    }else if(quality.indexOf("差评")>-1||quality.indexOf("負評")>-1||quality.indexOf("Negative")>-1){
        txt.style.color="#A34C25";
    }else if(quality.indexOf("好评")>-1||quality.indexOf("好評")>-1||quality.indexOf("Very Positive")>-1){
        txt.className+='filter_Positive';
    }
    txt.onclick =function(){    //跳转客服移除页面
        window.open("https://help.steampowered.com/zh-cn/wizard/HelpWithGameIssue/?appid="+$(this).attr('id')+"&issueid=123&transid=");
        console.log($(this).attr('id'));
    };
    $(".bottom_controls")[i].appendChild(txt);
}

function filter(){
    $('.filter_Positive').parent().parent().parent().remove();
}

function filter1(){
    $('.filter_Mixed').parent().parent().parent().remove();
}
