// ==UserScript==
// @name         BiliBili-直播间勋章增强
// @namespace    mscststs
// @version      0.24
// @description  勋章增强，直播间页面切换勋章/自动/手动切换勋章
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35279/BiliBili-%E7%9B%B4%E6%92%AD%E9%97%B4%E5%8B%8B%E7%AB%A0%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/35279/BiliBili-%E7%9B%B4%E6%92%AD%E9%97%B4%E5%8B%8B%E7%AB%A0%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $().ready(function(){
        //页面加载完成
        function getMedalList(){
            $.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/i/api/medal",
                    data: {
                         page:"1",
                         pageSize:"30"
                    },
                    datatype: "json",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){

							show_Medal(data);
						}
                    }
                });
        }
		function getTitleList(){
			
		}
        function show_Medal(data){
            var rside = $("div.right-container");
            $("body").append(`

  <style>
    .helper_not_use .fans-medal-item,
    .helper_not_use .fans-medal-item span{border-color:rgb(87, 87, 87)}
    .helper_not_use .label{background-color:rgb(87, 87, 87)}
    .helper_not_use .level{color:rgb(87, 87, 87)}

    .helper_in_use .fans-medal-item,
    .helper_in_use .fans-medal-item span{border-color:rgb(255, 159, 61)}
    .helper_in_use .label{background-color:rgb(255, 159, 61)}
    .helper_in_use .level{color:rgb(255, 159, 61)}

    .bilibili-like-box{border:1px solid #e9eaec;border-radius:12px;font-size:12px;padding:16px 12px 24px 12px;margin:0;margin-bottom:24px;background-color:#fff}
    .bilibili-like-box p{margin-top:0 ;font-size:20px;color:#333}
    .helper-myMedal{cursor:pointer;margin:2px 4px;}
  </style>
`);
            rside.prepend("<div id='helper-medal' class='bilibili-like-box'></div>");
            var helper = $("#helper-medal");
            helper.append("<p>勋章更换面板</p>");
            //初始化列表
            var list = data.data.fansMedalList;
			//console.log(list);
			list.sort((a,b)=>-(a.score-b.score));
			//console.log(list);
            for(var i=0;i<list.length;i++){
                var id = list[i].medal_id;
                var level = list[i].level;
                var name = list[i].medalName;
                var today_feed = list[i].today_feed;
                var today_limit = list[i].day_limit;
                var status = list[i].status;
                var medal = $('<div helper-medal-id="'+id+'" class="fans-medal-item-ctnr dp-i-block p-relative v-middle helper-myMedal" title="今日亲密度'+today_feed+'/'+today_limit+'"><div class="fans-medal-item level-'+level+'"><span class="label">'+name+'</span><span class="level">'+level+'</span></div></div>');
                if(status!=1){
                    medal.addClass("helper_not_use");
                }else{
                    medal.addClass("helper_in_use");
                }
                helper.append(medal);
            }
             $("body").on("click",".helper-myMedal",function(){
                    var id = $(this).attr("helper-medal-id");
                    WearMedal(id);
              });
        }
        function hightLight(id){
            var helper = $("#helper-medal");
            helper.find(".helper-myMedal").each(function(){
                if($(this).attr("helper-medal-id")!=id){
                    $(this).addClass("helper_not_use").removeClass("helper_in_use");}else{
                    $(this).removeClass("helper_not_use").addClass("helper_in_use");
                    }
            });
            $("#chat-control-panel-vm > div > div.bottom-actions.p-relative > div.left-action > span.action-item.medal").click();
            $("#chat-control-panel-vm > div > div.bottom-actions.p-relative > div.left-action > span.action-item.medal").click();
        }
        function WearMedal(id){
            $.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/i/ajaxWearFansMedal",
                    data: {
                         medal_id:id
                    },
                    datatype: "json",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0)
                            hightLight(id);
                    }
                });
        }

        function init(){
            getMedalList();
        }

        init();


    });
})();