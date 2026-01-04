// ==UserScript==
// @name         造梦西游online脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  此脚本可以实现各种功能
// @author       乱舞神菜
// @match        https://zmxyol.3304399.net/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397254/%E9%80%A0%E6%A2%A6%E8%A5%BF%E6%B8%B8online%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/397254/%E9%80%A0%E6%A2%A6%E8%A5%BF%E6%B8%B8online%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
// 设置修改后，需要刷新或重新打开游戏页面才会生效
var setting = {
    time: 3000 // 单位:毫秒.默认加载修改框速度为5秒，不建议小于3秒
    ,isactivation: 1 // 是否需要免激活码,1为免激活,0为需要激活
}

function load_ops() {
    $("#Cocos2dGameContainer").before(
         '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;">'+
        '<button style="top:0;right:0;transform: translate(148%, 0%);display:none;" onclick="showr()" id="hide">展开修改框</button>'+
        '<div style="position: relative;" id="byshow ">'+
              '<span style="position: relative;left:40px;margin:0 auto;font-size: medium;color: #B0E0E6;">自定义发包区</span>'+
        '<button style="top:0;right:0;transform: translate(90%, 0%)" onclick="hider()">收起修改框</button>'+
        '<div style="max-height: 200px; overflow-y: auto;border-bottom:2px dashed rgb(255,105,180);">'+
        '<select id="postse">'+
        '<option value="scene.copyHandler.killMonster">scene.copyHandler.killMonster</option>'+
        '<option value="scene.copyHandler.createSinglePlayerCopy">scene.copyHandler.createSinglePlayerCopy</option>'+
        '<option value="scene.copyHandler.leaveCopy">scene.copyHandler.leaveCopy</option>'+
        '<option value="scene.copyHandler.pickupItem">scene.copyHandler.pickupItem</option>'+
        '<option value="scene.copyHandler.completeSinglePlayerCopy">scene.copyHandler.completeSinglePlayerCopy</option>'+
        '</select>'+
        '<input style="margin-right: 3px overflow-x: auto;width:120px;" id="post" placeholder="如用上面这里不用填写">'+
        '<input style="margin-right: 5px overflow-x: auto;" id="posttwo" placeholder="参数填写">'+
                '<button style="margin-right: 10px;" onclick="cheat()">发送协议</button>'+
                '<button style="margin-right: 10px;" onclick="cleart()">一键清除文本</button>'+
        '</div style="border-top:2px dashed rgb(255,105,180);">'+
        '<span style="font-size: medium;color:#B0E0E6">一键操作区</span>'+
        '<div style="max-height: 200px; overflow-y: auto;">'+
        '<button style="margin-right: 5px;" onclick="getexp()">一键刷100W经验(先完成主线)</button>'+
        '<button style="margin-right: 5px;" onclick="gettask()">一键完成主线任务</button>'+
        '<button style="margin-right: 5px;" onclick="geteq()">一键刷神装</button>'+
        '</div>'+
           '</div>'+
        '</div>'
    )
    unsafeWindow.ModelManager.set_isActive(setting.isactivation);
}

setTimeout(load_ops,setting.time);

cheat = function (){
    var get_fun = $('#post').val();
    var get_arg = $('#posttwo').val();
    if(get_fun == '' || get_fun == undefined || get_fun == null ){
        console.log('发送协议>==='+$('#postse').val(),JSON.parse(get_arg));
        unsafeWindow.MUtil.SendServer($('#postse').val(),JSON.parse(get_arg),function(e){console.log('收到协议>==='+JSON.stringify(e))});
       }
    else{
        unsafeWindow.MUtil.SendServer(get_fun,JSON.parse(get_arg),function(e){console.log('收到协议>==='+JSON.stringify(e))});
    }
}

cleart = function (){
    console.log('清除成功');
    $('#post').val('');
    $('#posttwo').val('');
    console.log(unsafeWindow.getPlayerModel());
}

gettask = function (){
    for(i=1;i<16;i++){
        if(i<6){
            unsafeWindow.MUtil.SendServer('scene.copyHandler.createSinglePlayerCopy',{"stageId":10000+i*100+1});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.killMonster',{"monsterIds":[11000+i*100+1]});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.completeSinglePlayerCopy',{"evaluate":3});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.leaveCopy');
            unsafeWindow.MUtil.SendServer('scene.taskHandler.handoverTask',{"id":101001000+i})
        }
        else if(i<11){
            unsafeWindow.MUtil.SendServer('scene.copyHandler.createSinglePlayerCopy',{"stageId":20000+(i-5)*100+1});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.killMonster',{"monsterIds":[21000+(i-10)*100+1]});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.completeSinglePlayerCopy',{"evaluate":3});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.leaveCopy');
            unsafeWindow.MUtil.SendServer('scene.taskHandler.handoverTask',{"id":101001000+i})
        }
        else{
            unsafeWindow.MUtil.SendServer('scene.copyHandler.createSinglePlayerCopy',{"stageId":30000+(i-10)*100+1});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.killMonster',{"monsterIds":[31000+(i-10)*100+1]});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.completeSinglePlayerCopy',{"evaluate":3});
            unsafeWindow.MUtil.SendServer('scene.copyHandler.leaveCopy');
            unsafeWindow.MUtil.SendServer('scene.taskHandler.handoverTask',{"id":101001000+i})
        }
    }
}

getexp = function(){
    function get_exp() {
        unsafeWindow.MUtil.SendServer('scene.copyHandler.createSinglePlayerCopy',{"stageId":30501});
        unsafeWindow.MUtil.SendServer('scene.copyHandler.killMonster',{"monsterIds":[31604]});
        unsafeWindow.MUtil.SendServer('scene.copyHandler.leaveCopy');
        }
    var exp_time = 0;
    while (exp_time<1001){
        exp_time +=1;
        setTimeout(get_exp(),2000);
}
}

geteq = function(){
    var num = 1;
    function test () {
        var patt = /8010341|8010342|8010343|8010344|8010345|8000341/;
        setTimeout(function(){
            unsafeWindow.MUtil.SendServer('scene.copyHandler.createSinglePlayerCopy', {"stageId":30000+(num*100)+1},function(e){
            var resq = JSON.stringify(e.drops);
            var isexist = patt.test(resq);
            if(isexist == true){
                unsafeWindow.MUtil.SendServer('scene.copyHandler.pickupItem',{"itemId":patt.exec(resq),"num":1});
                num+=1
            }
            else{
                num+=0
            }
            unsafeWindow.MUtil.SendServer('scene.copyHandler.leaveCopy');
        });
            if( num === 7){
                alert("现在才刷完了,宇少");
                return true;
            }else{
                test();//递归
            }
        },3000)
    }
    test();
}



hider = function(){
    $('#byshow').hide();
    $('#hide').show()
}

showr = function(){
    $('#byshow').show();
    $('#hide').hide()
}




