// ==UserScript==
// @name         BaiDu new Article
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  发布新文章
// @author       You
// @match        https://jingyan.baidu.com/edit/content*
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/459959/BaiDu%20new%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/459959/BaiDu%20new%20Article.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);
var bdItems = [];
var selected_item = null;
var LocalDevice = '';
var LocalUserBrief = '';
var LocalTopStepPref = '';
var LocalUserNotice = '';
var LocalUserJJT = 'http://local.ltest.com/jj.php?1=1';
var myid = 0;
var asTop = 1;
var fastClick = false; //是否点击了快捷键
var timer = 200;

(function() {
    'use strict';
    addStyle();
    addModal();
    ajaxData();
    //ajaxBDTask(); //暂时不需要
})();

function addModal(){
    var html = "<div class='ppt'><div><div id='btnGet' class='btn btn-primary'>取数据</div><div class='btn btn-primary' id='btnImage'>主图</div><div class='btn btn-primary' id='btnDesc'>简介</div>";
    html += "<div class='btn btn-primary btn-device' data-type='phone'>手机</div><div class='btn btn-primary btn-device' data-type='mac'>mac</div><div class='btn btn-primary btn-device' data-type='pc'>pc</div><div class='btn btn-primary btn-device' data-type='double'>双</div><div class='btn btn-primary btn-device' data-type='three'>三</div></div>";
    html += "<div><div class='btn btn-primary btn-topDesc' data-type='s'>Top单</div><div class='btn btn-primary btn-topDesc' data-type='ds'>Top双</div><div class='btn btn-primary btn-topDesc' data-type='dm'>Top多</div><div class='btn btn-primary btn-writeX'>W赏</div><div class='btn btn-primary btn-AsTop selected' style='float:right;'>Top步骤</div></div>";
    //html += "<div id='youCount'><span>0</span><label>0</label></div>";
    html += "<div id='setTopContent' class='btn btn-primary'>SetTop</div>";
    html += "<div id='setOriginalTool' class='btn btn-primary' style='font-size:12px;'>原Tool</div>";
    html += "<div id='bdList'></div>";
    html += "<div id='btnJYDraft' class='btn btn-primary' style='position:fixed;top:50%;right:0;padding: 20px;background-color: #295add;color: #fff;width: 318px;'>保存草稿</div>";
    html += "<div id='btnJYPublish' class='btn btn-primary' style='position:fixed;top:50%;left:100px;padding: 20px;background-color: #295add;color: #fff;width: 318px;'>发布</div>";
    html += "<div id='setUID' class='hide'><input id='txtUID' type='text' /><div id='btnSetUID' class='btn btn-primary'>设置UID</div></div>";
    html += "</div>";
    jq("body").append(html);
    jq("#btnDesc").click(function(){    //以模板内容填充简介
        jq("#editor-brief").focus().html(jq(".main-title").val() + "？" + LocalUserBrief);
        if(!jq("#is-origin").prop("checked")){
            jq("#is-origin").trigger("click");
        }
    });
    jq("#setTopContent").click(function(){ //以top模式填充步骤内容
        setTopContent();
    });
    jq("#btnJYPublish").click(function(){ //发布
        focusToolsHack();
        setTimeout(function () {
            jq(".release-btn").click();
        }, 130);
        /*if([1,2,4,5,6].indexOf(myid)!=-1){
            if(jq("#bdList div").length>1){
                window.open("https://jingyan.baidu.com/edit/content");
            }
        }*/
    });
    jq("#btnJYDraft").click(function(){ //save draft
        focusToolsHack();
        setTimeout(function () {
            jq(".save-draft").click();
        }, 130);
    });
    jq("#setOriginalTool").click(function(){ //以top模式填充步骤内容
        fillTools(jq(this).html());
    });
    jq("body").keyup(function(event){
        if(event.keyCode==93 && !fastClick){ //option key
            fastClick = true;
            jq("#bdList div:first-child").click();
        }
	});
    jq("#btnSetUID").click(function(){ //设置uid
        myid = parseInt(jq("#txtUID").val());
        jq.cookie('jy_uid', myid, { expires: 360, path: '/' });
        jq("#setUID").addClass("hide");
        ajaxData();
    });
    if(typeof(jq.cookie('jy_uid'))=="undefined"){
        jq("#setUID").removeClass("hide");
    }
    else{
        myid = parseInt(jq.cookie('jy_uid'));
    }

    jq(".btn-topDesc").click(function(){
        var dtype = jq(this).data("type");
        var brief = '';
        switch(dtype){
            case 's':
                brief = jq(".main-title").val() + "，可以通过几个步骤来处理，本文使用小米11来演示操作，以下是具体的步骤内容：";
                break;
            case 'ds':
                brief = "本答案介绍微软电脑和Mac电脑的" + jq(".main-title").val() + "的方法，使用微软电脑win10系统来演示操作，以下是微软电脑的具体操作步骤："
                break;
            case 'dm':
                brief = "本答案介绍处理" + jq(".main-title").val() + "的方法，可以前往设置页经过几个步骤来处理，以下为详细的处理步骤："
                break;
        }
        jq("#editor-brief").focus().html(brief);
    });

    jq(".btn-writeX").click(function(){
        window.open("http://local.jy.com/write.php?isMoney=1&uid=" + myid + "&title=" + jq(".main-title").val());
    });
    
    var asTopCookie = jq.cookie('jy_asTop');
    if(typeof(asTopCookie)=="undefined" || asTopCookie=='0'){
        asTop = 0;
        jq(".btn-AsTop").removeClass("selected");
    }
    else{
        asTop = 1;
        jq(".btn-AsTop").addClass("selected");
    }
    jq(".btn-AsTop").click(function(){ //设置top步骤
        if(jq(this).hasClass("selected")){
            asTop = 0;
            jq(this).removeClass("selected");
            jq.cookie('jy_asTop', 0, { expires: 360, path: '/' });
        }
        else{
            asTop = 1;
            jq(this).addClass("selected");
            jq.cookie('jy_asTop', 1, { expires: 360, path: '/' });
        }
    });
    jq(".ppt").on('click', 'div .btn-device', function(e) {
    //jq(".btn-device").click(function(){
        $(".category-level-1").val(10).trigger("change");
        var dtype = $(this).data("type");
        var dType2 = $(this).data("type2");
        setTimeout(function () {
            var c2 = 11;
            if(dtype=='phone' || dtype=="three"){
                c2 = 17;
            }
            $(".category-level-2").val(c2);
            var inputs = jq("#js-software-list input");
            //var labels = jq("#js-software-list li label");
            //var i = 0;
            var device = getDeviceNew(dtype, dType2);
            jq(inputs[0]).addClass("input-on-edit");
            jq(inputs[0]).focus();
            jq(inputs[0]).val(device.pOS);
            jq(inputs[1]).addClass("input-on-edit");
            jq(inputs[1]).focus();
            jq(inputs[1]).val(device.pVer);
            jq(inputs[2]).addClass("input-on-edit");
            jq(inputs[2]).focus();
            jq(inputs[2]).val(device.pDev);
            jq(inputs[3]).addClass("input-on-edit");
            jq(inputs[3]).focus();
            jq(inputs[3]).val(device.pDVer);
            //setSectionTitle(dtype); //暂时不需要
        }, timer);
    });

    jq("#btnImage").click(function(){
        window.open(LocalUserJJT + "&u=" + myid + "&title=" + jq(".main-title").val());
    });
    jq("#btnGet").click(function(){
        ajaxData();
    });
    $("#bdList").on('click', 'div', function(e) {
        if(1==1 || !jq(this).hasClass("disabled")){
            jq("#bdList .div").removeClass("selected");
            jq(this).addClass("selected");
            var id = $(this).data("id");
            var len = bdItems.length;
            for(var i=0; i<len; i++){
                if(bdItems[i].id == id){
                    selected_item = bdItems[i];
                    $("#setOriginalTool").html(selected_item['topic_tools_original']).data('tools', selected_item['topic_tools_original']);
                    addSteps(selected_item["steps"].length);
                    preFillContent();
                    fastClick = false;
                    break;
                }
            }
        }
    });
}
function getDeviceNew(dtype, dtype2){
    var device = {
        'pOS':'MIUI',
        'pVer': '14.0.2',
        'pDev': '小米',
        'pDVer': '13'
    }
    if(dtype2!=undefined){
        //device = JSON.parse(dtype2);
        device = dtype2;
    }
    else{
        switch(dtype){
            case 'phone':
                device = LocalDevice.phone;
                break;
            case 'pc':
                device = LocalDevice.pc;
                break;
            case 'mac':
                device = LocalDevice.mac;
                break;
            case 'double':
                device.pOS = LocalDevice.pc.pOS + LocalDevice.pc.pVer + ' && ';
                device.pVer = LocalDevice.mac.pOS + LocalDevice.mac.pVer;
                device.pDev = LocalDevice.pc.pDev + LocalDevice.pc.pDVer + ' && ';
                device.pDVer = LocalDevice.mac.pDev + LocalDevice.mac.pDVer;
                break;
            case 'three':
                device.pOS = 'MIUI 14.0.2 && HarmonyOS 3.0.0 && ';
                device.pVer = 'iOS 16.1';
                device.pDev = '小米 13 && 华为 P50 && ';
                device.pDVer = 'iPhone 13';
                break;
        }
    }
    return device;
}
function preFillContent(){
    setTimeout(function () {
        fillContent();
    }, timer+300);
}
function listItems(){
    var data = bdItems;
    var arr = [];
    var len = data.length;
    for(var i=0; i<len; i++){
        arr.push("<div data-id='" + data[i].id + "'>" + data[i].title + "</div>");
    }
    jq("#bdList").html(arr.join(''));
}
function fillContent(){
    //jq("body").click();
    if(selected_item!=null){
        var item = selected_item;
        jq("#bdList div[data-id='" + item.id + "']").addClass("disabled");
        if(jq(".main-title").val()==""){
            jq(".main-title").val(item['title']);
        }
        //jq("#editor-brief").focus().html(formatStepContent(item["brief"]));
        jq("#editor-brief").focus().html("<p>" + item["brief"] + "</p>");
        $(".category-level-1").val(10).trigger("change");
        setTimeout(function () {
            set2Category(item.cid);
        }, timer);
        setContent(item);
        //jq("#is-origin").prop("checked",true);
        if(!jq("#is-origin").prop("checked")){
            jq("#is-origin").trigger("click");
        }
        //if(myid==2 || myid==4 || myid==5){
        if(item['is_top']==1){
            jq("#is-top1").trigger("click");
        }
        selected_item = null;
        ajaxSetCompleted(item.id);
        setTimeout(function () {
            set2Category(item.cid);
            setOtherContent(item);

        }, timer);
    }
    else{
        //setTags("baidu abc d");
        /*$(".category-level-1").val(10).trigger("change");
        setTimeout(function () {
            set2Category(11);
        }, timer);*/
    }
}
function set2Category(id){
    jq(".category-level-2").val(id);
}
function setTopContent(){
    var div = jq("#steps-content .complex-list .edui-body-container");
    var len  = div.length;
    for(var j=0; j<len; j++){
        jq(div[j]).focus().html(formatStepContent((jq(div[j]).html().replace('<p>','')).replace('</p>',''), true));
    }
}
function setContent(item){
    var len = item["steps"].length;
    var div = jq("#steps-content .complex-list .edui-body-container");
    for(var j=0; j<len; j++){
        jq(div[j]).focus().html(formatStepContent(item["steps"][j], item["is_top"]));
        jq(div[j]).focus().click();
    }
}
function formatStepContent(c, isTop1){
    var result = c;
    if(c.indexOf("---")!=-1){
        var arr = c.split("---");
        var len = arr.length;
        for(var i=0; i<len; i++){
            arr[i] = "<p>" + arr[i] + "</p>";
        }
        result = arr.join("");
    }
    else{
        if(isTop1==1 || asTop==1){
            var str = setTopString(c);
            result = "<p><strong>" + str[0] + "</strong></p>";
            result += "<p>" + str[1] + "</p>";
        }
        else{
            result = "<p>" + c + "</p>";
        }
    }
    return result;
}
function setTopString(text){
    var cArr = text.split("，");
    var topStr = '', normalStr = '';
    if(cArr.length>1){
        normalStr = text;
        topStr = cArr[cArr.length-1].replace("。", "").replace("即可", "");
        /*if(text.indexOf("找到")!=-1){
            topStr +=  cArr[0].replace("找到",'').replace("选项",'');
        }*/
    }
    else{
        topStr = text.replace("。", "").replace("即可", "");
        normalStr = LocalTopStepPref + text;
    }
    return [topStr, normalStr];
}

function setOtherContent(item){
    setTopicTools2(item);
    /*if(item['notice']!=''){
        jq("#notice-section input:first").focus();
        jq("#notice-section input:first").val(item['notice']);
    }*/
    setNotice();
    setTags(item['tags']);
}
function setNotice(){
    if(LocalUserNotice!=''){
        jq("#notice-section input:first").focus();
        jq("#notice-section input:first").val(LocalUserNotice);
    }
}
function setTopicTools(item){
    if(item['topic_tools']!=''){
        var tools = item['topic_tools'].split(";");
        var inputs = $("#js-software-list li input");
        var labels = $("#js-software-list li label");
        for(var i=0;i<tools.length;i++){
            jq(labels[i])[0].click();
            jq(inputs[i]).val(tools[i]);
            if(i>2){
                break;
            }
        }
    }
}
function setTopicTools2(item){
    fillTools(item['topic_tools2']);
    setTimeout(function () {
        $("#localPicker input").click();
    }, 200);
    
}
function focusToolsHack(){
    try{
        setTimeout(function () {
            jq(inputs[0]).focus();
        }, 20);
        setTimeout(function () {
            jq(inputs[1]).focus();
        }, 20);
        setTimeout(function () {
            jq(inputs[2]).focus();
        }, 20);
        setTimeout(function () {
            jq(inputs[3]).focus();
        }, 20);
        setTimeout(function () {
            jq(inputs[4]).focus();
        }, 20);
        setTimeout(function () {
            jq(inputs[5]).focus();
        }, 20);
    }
    catch(e){
        console.log(e);
    }
}
function fillTools(strTools){
    if(strTools!=''){
        var tools_versions = strTools.split("|");
        var tools = tools_versions[0].split(";");
        var versions = tools_versions[1].split(";");
        var inputs = $("#js-software-list li input");
        var labels = $("#js-software-list li label");
        var i = 0;
        for(var j=0;j<tools.length;j++){
            //jq(inputs[i])[0].click();
            jq(inputs[i]).addClass("input-on-edit");
            //jq(inputs[i]).val(tools[j]);
            jq(inputs[i]).focus();
            jq(inputs[i]).val(tools[j]);
            jq(inputs[i]).focus().click();
            //jq(inputs[i+1])[0].click();
            jq(inputs[i+1]).addClass("input-on-edit");
            //jq(inputs[i+1]).val(versions[j]);
            jq(inputs[i+1]).focus();
            jq(inputs[i+1]).val(versions[j]);
            jq(inputs[i+1]).focus().click();
            i = i + 2;
        }
    }
}


function setTags(tags){
    if(tags.trim()!=""){
        $(".add-tags")[0].click();
        setTimeout(function () {
            var arr = tags.split(' ');
            for(var i=0; i<arr.length; i++){
                $("#add-tag-ipt").val(arr[i]);
                $("#add-tag-btn").trigger("click")
            }
            //$(".add-tag-dialog-accept .pop-btn-accept")[0].click();
            jq(".ui-dialog-buttons .ui-dialog-buttonpane .btn-32-green")[0].click();
            jq(".ui-dialog-buttons .ui-dialog-buttonpane .btn-32-white")[0].click();
        }, timer);
    }
}
function ajaxData(){
    jq.ajax({
		type: "POST",
		dataType: "json",
		url: "https://local.jy.com/handle.php",
		data: "act=getBDLocal&u="+myid+"&rd="+Math.random(),
		success: function(resp){
            bdItems = resp["data"]["items"];
            LocalDevice = resp["data"]["devices"];
            LocalUserBrief = resp["data"]["userBrief"];
            LocalTopStepPref = resp["data"]["topStepPref"];
            LocalUserNotice = resp["data"]["userNotice"];
            LocalUserJJT = resp["data"]["userJJT"];
            generalPhoneDevices(resp["data"]["myPhoneDevices"]);
            listItems();
            //displayStep(resp["data"]["task"]); //暂是不需要
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log('error');
            window.open("https://local.jy.com/write.php?from=ssl");
	    }
	});
}
function generalPhoneDevices(items){
    if(items.length>0){
        //var list = items.split(",");
        var arr = ["<div>"];
        for(var i=0; i<items.length; i++){
            arr.push("<div class='btn btn-primary btn-device' data-type='phone' data-type2='" +  items[i]["device"] + "'>" + items[i]["name"] +"</div>");
        }
        arr.push("</div>");
        jq("#setTopContent").before(arr.join(""));
    }
}
function ajaxSetCompleted(id){//return;
    jq.ajax({
        type: "POST",
        dataType: "json",
        url: "https://local.jy.com/handle.php",
        data: "act=completeBDLocal&id="+id+"&rd="+Math.random(),
        success: function(resp){

        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            console.log('error2222');
        }
    });
}

function addStyle(){
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode(styles());
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}
function styles(){
    var css = [];
    //css.push('#hidTags{width: 60px;margin-right: 10px;}');
    css.push('.btn{padding:4px;margin-right:6px;}');
    css.push('.ppt{position: fixed;top: 0;width: 360px;left: 0;height: 200px;background-color: #99cec6;border-radius: 4px;}');
    css.push('#bdList div{padding: 4px 0px;text-indent: 6px;background-color: #2bb56f;color: #fff;margin-bottom: 4px;text-overflow: ellipsis;width: 100%;cursor:pointer;}');
    css.push('#bdList .disabled{background-color: #bdb4b4;cursor: text;}');
    //css.push('#bdList .selected{background-color: #5fa983;}');
    css.push('.btn.selected{background-color: #bb9766;color: #fff;}');
    return css.join("");
}

function addSteps(len){
    var div = jq("#steps-content .complex-list .edui-body-container");
    var diff = len - div.length;
    if(diff>0){
        for(var i=0; i<diff; i++){
            jq("#steps-content .add-item-btn").trigger("click");
        }
    }
}


/*function displayStep(task){
    var initCount = task['c'];
    var currentCount = task['cc'];

    jq("#youCount span").html("初始：" + initCount);
    jq("#youCount label").html(" 当前：" + currentCount);
}*/

/*function setSectionTitle(dtype){
    if(dtype=="double"){
        jq("#section-button .add-section-btn").trigger("click");
        setTimeout(function () {
            jq(jq("#steps-content .edit-section-title-btn")[0]).trigger("click");
            setTimeout(function () {
                jq(jq("#steps-content .section-title-input")[0]).val("pc电脑");
                jq(jq("#steps-content .edit-section-title-btn")[1]).trigger("click");
                setTimeout(function () {
                    jq(jq("#steps-content .section-title-input")[1]).val("mac电脑");
                }, 300);
            }, 100);
            jq(".category-level-2").val(11);
        }, 300);
    }
    else if(dtype=="three"){
        jq("#section-button .add-section-btn").trigger("click");
        jq("#section-button .add-section-btn").trigger("click");
        setTimeout(function () {
            jq(jq("#steps-content .edit-section-title-btn")[0]).trigger("click");
            setTimeout(function () {
                jq(jq("#steps-content .section-title-input")[0]).val("小米手机");
                jq(jq("#steps-content .edit-section-title-btn")[1]).trigger("click");
                setTimeout(function () {
                    jq(jq("#steps-content .section-title-input")[1]).val("华为手机");

                    jq(jq("#steps-content .edit-section-title-btn")[2]).trigger("click");
                    jq(jq("#steps-content .section-title-input")[1]).val("苹果手机");
                }, 300);
            }, 100);
            jq(".category-level-2").val(17);
        }, 300);
    }
}

function getDevice(dtype){
    var device = {
        'pOS':'MIUI',
        'pVer': '14.0.2',
        'pDev': '小米',
        'pDVer': '11'
    }
    switch(dtype){
        case 'phone':
            if(myid==8){
                device.pOS = 'OriginOS';
                device.pVer = '1.0';
                device.pDev = 'vivo';
                device.pDVer = 'X70';
            }
            else if(myid==9){
                device.pOS = 'HarmonyOS';
                device.pVer = '2.0.0';
                device.pDev = '华为';
                device.pDVer = 'P50';
            }
            break;
        case 'pc':
            device.pOS = 'Windows';
            device.pVer = '10';
            device.pDev = '华硕天选';
            device.pDVer = 'FA506IV';
            if(myid==8){
                device.pDev = '小米笔记本';
                device.pDVer = 'Pro 15';
            }
            else if(myid==9){
                device.pDev = '华为';
                device.pDVer = 'MateBook X Pro';
            }
            else if(myid==3 || myid==6 || myid==7){
                device.pDev = '联想小新';
                device.pDVer = 'Air14';
            }
            else if(myid==2 || myid==4 || myid==5){
                device.pDev = '华为';
                device.pDVer = 'MateBook X';
            }
            break;
        case 'mac':
            device.pOS = 'macOS';
            device.pVer = 'Catalina';
            device.pDev = 'MacBook';
            device.pDVer = 'Pro';
            if(myid==8){
                device.pVer = 'Monterey';
                device.pDVer = 'Air';
            }
            break;
        case 'double':
            device.pOS = 'Windows 10 && ';
            device.pVer = 'macOS Monterey';
            device.pDev = '华硕天选 FA506IV && ';
            device.pDVer = 'MacBook Pro';
            break;
        case 'three':
            device.pOS = 'MIUI 14.0.2 && HarmonyOS 2.0.0 && ';
            device.pVer = 'iOS 15.4';
            device.pDev = '小米 11 && 华为 P40 && ';
            device.pDVer = 'iPhone 13';
            break;
    }
    return device;
}*/

/*function ajaxBDTask(){
    jq.ajax({
		type: "POST",
		dataType: "json",
		url: "https://jingyan.baidu.com/utask/ajax/task",
		//data: "u="+myid,
		success: function(resp){
            var tasks = resp.data.data.growupTask;//console.log(tasks);
            var len = tasks.length;
            var finishNum = 0;
            for(var i=0; i<len; i++){
               if(tasks[i].tid==19){
                   finishNum = tasks[i].finishNum;
                   break;
               }
            }
            //console.log(finishNum);
            //ajaxSetTaskStep(finishNum);
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log('ajaxBDTask error');
	    }
	});
}
function ajaxSetTaskStep(count){
    jq.ajax({
		type: "POST",
		dataType: "json",
		url: "https://local.jy.com/handle.php",
		data: "act=setTaskStep&id="+myid+"&count="+count,
		success: function(resp){
            console.log(resp);
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log('error');
	    }
	});
}*/