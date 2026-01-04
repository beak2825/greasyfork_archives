// ==UserScript==
// @name         BaiDu User List viewer
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  open 5 article
// @author       You
// @license      MIT
// @match        https://jingyan.baidu.com/user/npublic?uid=*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/460228/BaiDu%20User%20List%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/460228/BaiDu%20User%20List%20viewer.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);
(function() {
    'use strict';
//debugger;

    var u = ['9f282','c94da','84a6e','fa72b','4e89e','8d67a','9fe48','fb2ff','c1b18','8036e'];
    var query = window.location.search;
    var uid = query.replace("?uid=", '');
    var startStr = uid.substr(0,5);
    if(u.indexOf(startStr)!=-1){
        setTimeout(function () {
            var items = jq("ul.feed-list p.tit a");
            for(var i=0; i<5; i++){
                var href = jq(items[i]).attr("href");
                window.open(href, "_blank");
            }
            history.back();
        }, 600);
    }else{
        addStyle();
        addModal();
    }

})();

function addModal(){
    var html = "<div class='ppt'>";
    html += "<div id='txtcb'><input type='text' id='txtOrder' value='30' /><input type='checkbox' id='cbMoney' /></div>";
    html += "<div class='btn btn-primary' id='btnJoin'>加入</div>";
    html += "</div>";
    jq("body").append(html);
    jq("#btnJoin").click(function(){
        var item = {
            order: jq("#txtOrder").val(),
            isMoney: jq("#cbMoney").prop("checked"),
            url: window.location.href,
            name: jq(".user-info-banner .info-title .uname").html()
        }
        ajaxData(item); 
    });

}

function ajaxData(item){
    item['act'] = 'joinUser';
    item['rd'] = Math.random();
    jq.ajax({
		type: "POST",
		dataType: "json",
		url: "https://local.jy.com/handle.php",
        data: item,
		success: function(resp){
            //displayStep(resp["data"]["task"]); //暂是不需要
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log('error');
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
    css.push('.btn{padding: 20px;margin-left: 6px;background-color: #2f3f82;color: #fff;font-size: 22px;border-radius: 8px;}');
    css.push('.ppt{position: fixed;top: 0;padding: 30px;left: 0;background-color: #99cec6;border-radius: 4px;}');
    css.push('#cbMoney{margin-left: 6px}');
    css.push('#txtOrder{width: 50px;line-height: 18px;}');
    css.push('#txtcb{display:inline-block;}');
    css.push('.btn.selected{background-color: #bb9766;color: #fff;}');
    return css.join("");
}