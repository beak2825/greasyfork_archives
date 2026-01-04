// ==UserScript==
// @name         超星学习通-讨论自动复读
// @version      0.32
// @description  进入到讨论区，填写大佬名字，点击页面上的“开始复读”按钮，自动将大佬的20道最新讨论题答案抄过来提交。如果大佬还没回答就抄第一个回答的人，如果还没人回答就下一题
// @match        *://*.chaoxing.com/bbscircle/grouptopic?*
// @match        *://*.chaoxing.com/bbscircle/gettopicdetail?*
// @author       duya12345
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/517463
// @downloadURL https://update.greasyfork.org/scripts/401103/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E8%AE%A8%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%A4%8D%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/401103/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A-%E8%AE%A8%E8%AE%BA%E8%87%AA%E5%8A%A8%E5%A4%8D%E8%AF%BB.meta.js
// ==/UserScript==

//本代码测试环境为谷歌浏览器，有同学反映qq浏览器上无法看到按钮，作者表示暂时找不到原因，建议更换浏览器

var $ = unsafeWindow.jQuery;
var done_times = GM_getValue("done_times");
var your_name = GM_getValue("your_name");//不用填了，自动获取
var list_length = GM_getValue("list_length");
var dalao_name = GM_getValue("dalao_name");//大佬的名字，此项可以留空，即所有答案都抄第一个回答的

function if_referred_other(url)//判断是不是刚进讨论页面
{
    var re = /bbscircle\/grouptopic/m;
    if(url.match(re) != null){
        return true;
    }
    return false;
}

function if_done(){//判断下有没有回答过
    var namelist = document.getElementsByClassName("name");
    console.log("有"+namelist.length+"人回答过此问题");
    for(var i = 0; i < namelist.length; i++){
        if(your_name == namelist[i].innerText){
            return true;
        }
    }
    return false;
}

function GetBigGodsAnswer() { //抓一个大佬的答案
    var req = GetRequest();
    var contentid = "topic_replys_"+req.topicid;
    var search_str = document.getElementById(contentid).innerHTML;
    var re1 = new RegExp(dalao_name + "([\\s\\S]+?)</h3>", 'm');//锁定大佬
    var re2 = /(?<=<h3([\s\S]+?)>)([\s\S]+?)(?=<\/h3>)/m;//未锁定大佬时：任意回答；锁定大佬时：大佬的回答

    var match1 = search_str.match(re2);
    var match2 = search_str.match(re1);
    if(match1 == null){//还没人回答
        return "uwfigawuyhaofi3r983yhr89f[3h892ryrjq89rff";
    }
    if(if_done(search_str) == true){//找到自己名字了
        return "fuhqwaifuhuwaqfbgcuaosjfcdopwtfgn23333333";//瞎打一串不可能出现的content，交给下级判断去
    }
    if(match2 == null){//大佬还没回答
        console.log("找到大佬没有回答的题了");
        return match1[0];//那就返回第一个回答的
    }
    var match3 = match2[0].match(re2)[0];
    var replace_out1 = match3.replace(/<br>/g, "\n");
    var replace_out2 = replace_out1.replace(/&nbsp;/g, " ");
    return replace_out2;
}

function GetRequest() {//获取url参数
	var url = location.search;
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function getAllNoticeAttachment(){//拿上传文件的，用不到，但改了怕出问题先放着
	var attachment = "";
	var attachmentsByName = document.getElementsByName("attachment");
	if (attachmentsByName != null && attachmentsByName.length > 0) {
		for (var i = 0; i < attachmentsByName.length; i++) {
			var attachmentA = attachmentsByName[i];
			if (attachmentA == null) {
				continue;
			}
			attachment += attachmentA.getAttribute('value') + ",";
		}
	}
	return attachment;
}

function form_rep_submit(content){//提交函数，直接抄官方的改一改
    var req = GetRequest();
    var img=$("#images_img_"+req.topicid).find("img");
    var str="";
    for(var i=0;i<img.size();i++){
        var imgsrc=img[i];
        if(i==img.size()){
            str=str+imgsrc.src.replace("100_100","origin");
        }else{
            str=str+imgsrc.src.replace("100_100","origin")+",";
        }
    }
    if(content=="fuhqwaifuhuwaqfbgcuaosjfcdopwtfgn23333333"){
        console.log("系统检测到此问题已回答");
        return false;
    }
    else if(content=="uwfigawuyhaofi3r983yhr89f[3h892ryrjq89rff"){
        console.log("还没人回答，再等等吧");
        return false;
    }
    var allAttachment = getAllNoticeAttachment();
    $.ajax({
        type: "post",
        url : "/bbscircle/addreply",
        dataType:'html',
        data: {
            clazzid : req.clazzid,
            topicId : req.topicid,
            content : content,
            files : str,
            cpi : req.cpi,
            ut : req.ut,
            attachmentFile:allAttachment,
			openc : req.openc
		},
        success: function(data){
            if (data.indexOf('error') == 0) {
                alert(data.replace('error;',''));
                return false;
            }
            var div=$("#more_reply_"+req.topicId);
            data = data.replace(/(^\s*)|(\s*$)/g,"");
			if(document.getElementById("lastInfo")){
				$("#lastInfo").before(data);
			}else{
				var doc = document.getElementById("topic_replys_"+req.topicId);
				doc.innerHTML += data;
			}
            $("#"+req.topicId).val("");
            console.log('成功复读');
            return true;
        },
        error: function(data){
            console.log('???');
            return false;
        }
    });
}

function content_list(i){
    var see_all = document.getElementsByClassName("lookall")[parseInt(i/2)];
    if(see_all != null){
        see_all.click();
    }
    else{
        console.log("找不到按钮1");
    }
}

function content_detail(){
    var more_button = document.getElementById("more_reply");
    if(more_button != null){
        console.log("pressed");
        more_button.click();//点一下加载更多
    }
    else{
        console.log("找不到按钮2");
    }
    window.onload = function(){
        var flag = form_rep_submit(GetBigGodsAnswer());
        setTimeout(function(){
            window.history.back();
            if(flag == true){
                window.history.back();
            }
        }, 1000);
    }
}

function main(i){
    var url = window.location.pathname;
    if(url == "/bbscircle/grouptopic"){
        content_list(i);
    }
    else{
        content_detail();
    }
}

function create_input(){
    var my_div = document.createElement("div");
    my_div.setAttribute("id", "my_div");
    my_div.innerText = "填入大佬名字（如果有的话）：";
    var inner_pos = document.getElementsByClassName("title1118")[0];
    inner_pos.after(my_div);

    var name_text = document.createElement("input");
    name_text.setAttribute("type", "input")
    name_text.setAttribute("id", "name_text");
    my_div.append(name_text);
}

function create_button(){
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "开始复读");
    button.setAttribute("id", "start_button");
    button.style.width = "80px";
    button.style.height = "30px";
    button.style.align = "center";
    button.style.marginLeft = "0px";
    button.style.marginBottom = "0px";
    button.style.background = "#b46300";
    button.style.border = "1px solid #b46300";
    button.style.color = "white";
    var inner_pos = document.getElementById("name_text");
    inner_pos.after(button);
    $("#start_button").click(function() {
        button_click();
    });

    var button2 = document.createElement("input");
    button2.setAttribute("type", "button");
    button2.setAttribute("value", "结束复读");
    button2.setAttribute("id", "start_button2");
    button2.style.width = "80px";
    button2.style.height = "30px";
    button2.style.align = "center";
    button2.style.marginLeft = "0px";
    button2.style.marginBottom = "0px";
    button2.style.background = "#b00000";
    button2.style.border = "1px solid #b00000";
    button2.style.color = "white";
    var inner_pos2 = document.getElementById("start_button");
    inner_pos2.after(button2);
    $("#start_button2").click(function() {
        button_click2();
    });
}

function button_click() {
    GM_setValue("done_times", 0);
    your_name = document.getElementsByClassName("zt_u_name")[0].innerText;
    GM_setValue("your_name", your_name);
    list_length = document.getElementsByClassName("lookall").length;
    GM_setValue("list_length", list_length);
    dalao_name = document.getElementById("name_text").value;
    GM_setValue("dalao_name", dalao_name);
    location.reload();
}

function button_click2() {
    GM_setValue("done_times", list_length*2);
    location.reload();
}

(function() {
    'use strict';
    if(window.location.pathname == "/bbscircle/grouptopic"){//done_times == list_length*2
        create_input();
        create_button();
    }
    if(if_referred_other(document.referrer) == false && done_times > 0){//防止上次没跑完，导致下次进来的时候直接继续跑
        done_times = 2*list_length;
    }
    if(done_times < 2*list_length){
        setTimeout(function() {
            main(done_times);
        }, 800);
        GM_setValue("done_times", ++done_times);
    }
})();