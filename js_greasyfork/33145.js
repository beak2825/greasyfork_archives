// ==UserScript==
// @name         贴吧助手(屏蔽，排序) beta
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  1, 屏蔽指定用户的所有发帖 2 ,排序(按回复))，具体看下面仔细描述
// @author       You
// @match        https://tieba.baidu.com/**
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/33145/%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B%28%E5%B1%8F%E8%94%BD%EF%BC%8C%E6%8E%92%E5%BA%8F%29%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/33145/%E8%B4%B4%E5%90%A7%E5%8A%A9%E6%89%8B%28%E5%B1%8F%E8%94%BD%EF%BC%8C%E6%8E%92%E5%BA%8F%29%20beta.meta.js
// ==/UserScript==
//修复翻页后屏蔽无效的bug //修复翻页后x按钮消失  //其他小bug
(function() {



	//需先其他js执行后 执行才可获取到dom
	setTimeout(function(){
		//屏蔽模块
		(function(){
			//隐藏 指定数组（如 [{"user_id":1370621204},{},{} ]格式 ）里的所有用户 的主题

			//初始化屏蔽.........................
			var userIds=GM_getValue("pbUserIds");//获取屏蔽用户数据
			console.log("屏蔽用户",userIds);
			if(!userIds){
				userIds=[];
			}
			hideIt(userIds);//开始屏蔽
			initXbutton();//x按钮
			initDelpinbi();//取消屏蔽按钮
			bindPageMenu();//底部翻页按钮按钮绑定事件触发继续屏蔽
			//........................初始化屏蔽

			function hideIt(array){
				var count=0;
				$("span.tb_icon_author").each(function(){

					var spanTb=this;
					try{
						var value2=$(this).data("field").user_id;
					}
					catch(e){
						return;
					}
					array.forEach(function(item,index,array){
						var value=item.user_id;
						if(value==value2){
							$(spanTb).closest("li.j_thread_list.clearfix").hide();
							count++;
						}
					});

				});
				console.log("屏蔽条数:",count);
			}

			//初始化自定义屏蔽按钮
			function initXbutton(){
				$(".frs-author-name-wrap a").after($("<button class='xButton'>x</button>"));
				$(".xButton").click(function(){
					var targetUserid=$(this).closest("span.tb_icon_author").data("field");
					userIds.push(targetUserid);
					GM_setValue("pbUserIds",userIds);
					hideIt([targetUserid]);
				});
			}


			// 初始化 定义清除 屏蔽用户按钮
			function initDelpinbi(){
				$li=$("<li class='j_tbnav_tab'><a href='#'>取消屏蔽</a></li> ");
				$("ul.nav_list.j_nav_list").append($li);
				$li.click(function(){
					var qxid=prompt("输入取消屏蔽的用户id","all代表全部清楚");
					if(!qxid){
						return;	
					}
					if(qxid=="all"){
						GM_setValue("pbUserIds",[]);
						alert("刷新后生效");
						return;
					}
					var qxcout=0;
					userIds.forEach(function(item,index,array){
						if(item.user_id==qxid){
							array.splice(index,1);
							qxcout++;
						}
					});
					GM_setValue("pbUserIds",userIds);
					alert("取消屏蔽用户数量:"+qxcout+",刷新后生效");
				});
			}


			// 翻页后 屏蔽 pagination-item 
			function bindPageMenu(){
				$("#frs_list_pager a").each(function(){
					$(this).click(function(){
						setTimeout(function(){
							hideIt(GM_getValue("pbUserIds"));
							initXbutton();
							bindPageMenu();
						},3000);
					});

				});
			}





			//排序模块
			(function(){
				$li=$("<li class='j_tbnav_tab'><a href='#'>按回复量排序</a></li> ");
				$("ul.nav_list.j_nav_list").append($li);
				$li.click(function(){
					var $lis=$("li.j_thread_list.clearfix");//获取所有排序的li
					var liArray=[]; //用于排序的容器
					$lis.each(function(index,item){
						var replyCount=$(item).find("span.threadlist_rep_num.center_text").text();
						liArray.push({'count':replyCount,'li':item});
					});

					liArray.sort(function(a,b){
						return b.count-a.count;
					});

					console.log("排序后:",liArray);
					$("#thread_list").empty();
					$(liArray).each(function(index,item){
						$("#thread_list").append(item.li);
					});
					
					//排序后 重新绑定懒加载图片
					$(".thumbnail.vpic_wrap>img").lazyload();						



				});
			})();


		})();


	},3000);
	// Your code here...
})();