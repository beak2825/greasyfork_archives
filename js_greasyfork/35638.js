// ==UserScript==
// @name         偷B菜
// @namespace    mscststs
// @version      0.2
// @description   偷B菜工具
// @author       mscststs
// @match        *://live.bilibili.com/pages/1703/plant-act2017.html*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.slim.js
// @downloadURL https://update.greasyfork.org/scripts/35638/%E5%81%B7B%E8%8F%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/35638/%E5%81%B7B%E8%8F%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $().ready(function(){
		var uid = 177836752;
        function get_tree(){
             $.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/activity/v1/BiliTree/getTree",
                    data: {
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){
                            var see_chance = data.treeChance.see_chance;

                        }
                    }
                });
        }//正常偷菜流程，获取随机一棵树，但是这里没用

		function getMiliSeconds(){//取得毫秒数时间戳
            return (new Date()).valueOf();
        }
		function get_info(){
			$.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/activity/v1/BiliTree/index",
                    data: {
                        _:getMiliSeconds()
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){
                            //正常获取数据
							window.steal_chance = data.data.treeChance.steal_chance;
							window.see_chance = data.data.treeChance.see_chance;
							var steal_chance = window.steal_chance;
							if(steal_chance>0){
								setUI("一键偷菜 X "+steal_chance);
								$("#helper_stole_B").click(function(){
									$(this).text("偷菜ing");
									while(steal_chance-->0){
										setTimeout(function(){get_Score(uid);},(window.steal_chance-steal_chance)*500);//半秒延时
									}
								});
							}else{
								setUI("无菜可偷");
							}
                        }else{
							setUI("出错了");
							//setTimeout(function(){location.reload();},10000);
						}
                    }
                });
		}
        function get_Score(uid){
            $.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/activity/v1/BiliTree/getScore",
                    data: {
                        steal_uid:uid
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){
                            score = data.data.score;
							if(score>90){
								steal(uid,score);
							}else{
								end("外挂尝试失败了QAQ");
							}
                        }
                    }
                });
        }
        function steal(uid,score){
            $.ajax({
                    type: "get",
                    url: "//api.live.bilibili.com/activity/v1/BiliTree/stealTree",
                    data: {
                        steal_uid:uid,
                        score:score
                    },
                    datatype: "jsonp",
                    crossDomain:true,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if(data.code==0){
							window.score += parseInt(score);
							window.steal_chance--;
							if(window.steal_chance==0){
								end("貌似收获了 "+window.score+" 点收获值");
							}
                        }
                        else{
							end("出错了");
						}
                    }
                });
        }
		function end(text){
			alert(text);
			window.location.reload();
		}
		function setUI(text){
			window.score = 0;
			$("#app  nav.link-navbar").append("<span id='helper_stole_B'>"+text+"</span>");
			$("body").append("<style>#helper_stole_B{color:rgb(35, 173, 229);cursor:pointer;background-color:rgba(1, 205, 103,0.4);position:absolute;width:125px;height:60px;left:0px;top:0px;font-size:18px;line-height:60px;text-align:center}</style>");
		}
		setTimeout(function(){get_info();},2000);//等jq库加载先，不然老出错
    });

    // Your code here...
})();