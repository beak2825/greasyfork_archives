// ==UserScript==
// @name         Hi-Finance VIP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hi-Finance VIP 视频随便看
// @author       Jesse
// @match        http://web.hi-finance.com.cn/episode?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389325/Hi-Finance%20VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/389325/Hi-Finance%20VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function urlArgs() {
        var query = window.location.search.substring(1);
        //console.log(query);
        var args = {};
        var flag = 0
        var key = ""
        var value = ""
        if (query.indexOf("&") >= 0) {
            //console.log(">>>>>1");
            var spArray = query.split("&");
            for (var i = 0; i < spArray.length; i++) {
                flag = spArray[i].indexOf("=");
                key = spArray[i].substring(0, flag);
                value = spArray[i].substring(flag + 1);
                value = decodeURIComponent(value);
                args[key] = value;
            }
        } else {
            //console.log(">>>>>2");
            flag = query.indexOf("=");
            key = query.substring(0, flag);
            value = query.substring(flag + 1);
            value = decodeURIComponent(value);
            args[key] = value;
        }
        return args;
    }

    var result = urlArgs();
    var g_course_id  = result['courseid']
    var g_episode_id = ''
	var g_last_episode_id = ''
	var ppt          = ''
	var _myVideo	 = ''
	var intstoreView = ''
	var inttimeReminder =''
	var clarity = getCookie('clarity');
	var selectQ_index  = (clarity !== null) ? clarity : 3;
	    seek = 0;

    var newdata = {}
    var sectionList = $('.div_sectionList')
    newdata.section = []
    newdata.courseid = g_course_id
    newdata.owner_status = 1
    newdata.episodeInfo = []

    for (var i = 0; i < sectionList.length; i++) {
        if ($('.div_sectionList').find(".span_sectionIndex")[i]) {
            var sectionIndex = $('.div_sectionList').find(".span_sectionIndex")[i].innerText
            var sectionTitle = $('.div_sectionList').find(".span_sectionTitle")[i].innerText
        }
        //newdata.section.push({'sectionIndex':sectionIndex, 'sectionTitle':sectionTitle, 'episodeInfo': []})
        var n = $(".div_sectionList:eq("+ i +")").find("ul li")
        for (var m = 0; m < n.length; m++) {
            var episodeIndex = n.find(".span_episodeIndex")[m].innerText
            var episodeTitle = n.find(".span_episodeTitle")[m].innerText
            //console.log(n[m].id)
            var episodeId = n[m].id.split("_")[n[m].id.split("_").length - 1]

            newdata.episodeInfo.push({'sectionIndex':sectionIndex, 'sectionTitle':sectionTitle, 'episodeIndex':episodeIndex, 'episodeTitle':episodeTitle, 'episodeId':episodeId})
        }

    }
    //console.log(newdata)

    window.get_espisode_info = function(episode_id, type) {
        var tmpdata = {}
        if (type > 0) {
            for (var i = 0; i < newdata.episodeInfo.length; i++) {
                //console.log(i, newdata.episodeInfo[i].episodeId, episode_id)
                if (newdata.episodeInfo[i].episodeId == episode_id) {
                    //console.log("OK", i)
                    if (type == 1) {
                        //console.log("1:", tmpdata)
                        tmpdata = {"owner_status":"1","episode":{"id":newdata.episodeInfo[i].episodeId},"subTitle":"","time_long":"16","ppt":[], "episodeTitle":newdata.episodeInfo[i].episodeTitle}
                    }
                    if (type == 2) {
                        tmpdata = {"owner_status":"1","episode":{"id":newdata.episodeInfo[i+1].episodeId},"subTitle":"","time_long":"16","ppt":[], "episodeTitle":newdata.episodeInfo[i+1].episodeTitle}
                        //console.log("2:", tmpdata)
                    }
                }
                
            }
            return tmpdata;
        } else {
            tmpdata = {"owner_status":"1","episode":{"id":newdata.episodeInfo[0].episodeId},"subTitle":"","time_long":"16","ppt":[], "episodeTitle":newdata.episodeInfo[0].episodeTitle}
            //console.log("0:", tmpdata)
            return tmpdata;
        }

    }


    window.ajax_default_espisode = function(courseid) {
        var data = window.get_espisode_info(0,0)
        //console.log(data)
        g_episode_id = data.episode.id;
        console.log("开始默认课时：课程ID:" + courseid + "，课时ID:" + data.episode.id + "，标题:" + data.episodeTitle);
        return render_espisode(data);
    }


    window.ajax_the_espisode = function(courseid, episode_id) {
        g_last_episode_id = g_episode_id;

        var data = window.get_espisode_info(episode_id, 1)
        console.log(data)
        g_episode_id = data.episode.id;
        console.log("开始指定课时：课程ID:" + courseid + "，课时ID:" + data.episode.id + "，标题:" + data.episodeTitle);
        return render_espisode_again(data);
		backTop(500, 0);
    }

    window.ajax_next_espisode = function(courseid, episode_id)
	{
        g_last_episode_id = g_episode_id;

        var data = window.get_espisode_info(g_episode_id, 2)

        g_episode_id = data.episode.id;
        console.log("自动开始下一节：课程ID:" + courseid + "，课时ID:" + g_episode_id + "，标题:" + data.episodeTitle);
        return render_espisode_again(data);
		
	}
    window.ajax_time_reminder = function(courseid, episode_id)
	{
        return
	}
    window.check = function(){
        return
	}

    window.ajax_default_espisode(g_course_id);

    // Your code here...
})();