// ==UserScript==
// @name         BaiDu JY Get Reward
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  领取奖励!
// @author       Me
// @license      MIT
// @match        https://jingyan.baidu.com/*
// @grant        none
// @require    https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/460230/BaiDu%20JY%20Get%20Reward.user.js
// @updateURL https://update.greasyfork.org/scripts/460230/BaiDu%20JY%20Get%20Reward.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);
var url = '';

(function() {
    'use strict';

    ajaxData();
    setTimeout(function(){
        jq("#js-btn-sign-in").click();
        jq("#task-panel-wrap .panel-title").html("<div id='btnGetJYReward' style='width:100%;height:100%;cursor:pointer;'>领 取</div>");
        jq("#btnGetJYReward").click(function(){
            jq(".task-status .task-action[data-name='签到'").click();
            clickItems();
            window.open(url);
        });
    }, 600);

})();
function clickItems(){
    var items = jq("#task-panel-wrap .task-status .gain-reward");
    if(items.length>0){
        jq(items[0]).click();
    }
    if(items.length>1){
        setTimeout(clickItems, 2000);
    }
}

function ajaxData(){
    if(typeof(jq.cookie('jy_uid'))=="undefined"){
        alert("No UID");
    }
    else{
        var myid = parseInt(jq.cookie('jy_uid'));
        jq.ajax({
		type: "POST",
		dataType: "json",
		url: "https://local.jy.com/handle.php",
		data: "act=getLikeUserUrl&u="+myid+"&rd="+Math.random(),
		success: function(resp){
            url = resp["data"];
            console.log(url);
	    },
	    error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log('error');
	    }
	});
    }
}