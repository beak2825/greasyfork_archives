// ==UserScript==
// @name            wsmud_Hong
// @namespace       cqv
// @version         0.0.13
// @date            23/12/2018
// @modified        08/06/2019
// @homepage        https://greasyfork.org/zh-CN/scripts/383348
// @description     武神传说 MUD
// @author          wu
// @match           http://*.wsmud.com/*
// @run-at          document-end
// @require         https://cdn.staticfile.org/vue/2.2.2/vue.min.js
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_setClipboard

// @downloadURL https://update.greasyfork.org/scripts/383348/wsmud_Hong.user.js
// @updateURL https://update.greasyfork.org/scripts/383348/wsmud_Hong.meta.js
// ==/UserScript==

(function () {

    'use strict';

    var WG = null;
    var messageAppend = null;
    var messageClear = null;
    var T = null;
    var L = null;

var Hong = {
	   isboom: 0,
	   damage:0,
	   coolingSkills: [],
	
        init: function() {
			
				WG.add_hook("login", function(data) {
					
								 var html=`
						<span class='zdy-item boom_button'>血祭爆</span>
						</div>
						`;
						
						$(".WG_button").append(html);
						$(".boom_button").on("click", Hong.boom);
				});

	      //监控技能cd
	       WG.add_hook("dispfm", function(data) {
                var timestamp = Date.parse(new Date());
                var mark = data.id + "_" + timestamp + "_" + data.distime;
                Hong.coolingSkills.push(mark);
                window.setTimeout(function() {
                    var index = Hong.coolingSkills.indexOf(mark);
                    if (index != -1) Hong.coolingSkills.splice(index, 1);
                }, data.distime);
            });
			
			  WG.add_hook("die", function (data) {
				  
				if(Hong.isboom == 0) return;
				
				if(data.commands != null) {
					WG.SendCmd("relive");
					return ;
				}

				if(Hong.isboom >0){//自爆	 
					var time = Hong.getTimeSkills("force.power") ;
					// 
					var killb = "$to 华山派-客厅;$wait 100;kill $pname(\"独孤败天\");$wait 1000;kill $pname(\"独孤败天\")";
					//killb = "$to 武道塔;$wait 100;kill $pname(\"守门人\");$wait 1000;kill $pname(\"守门人\")"; // for test
					var w = 11000; //
					 if( time <= w ){
						 messageAppend("<hiy>血祭冷却即将结束，回血17%开技能<hiy>");
						 if(w<10100) w=10100;				 
						 WG.SendCmd("enable force xuehaimogong;$wait 5050;liaoshang;$wait " + (w-5050 )+ ";stopstate;" + killb);
					 }else{
						  messageAppend("<hiy>血祭冷却中，先搞几把软猬甲反伤<hiy>");
						 WG.SendCmd("enable force jiuyinshengong;$wait 2700;stopstate;" + killb);
					 }				 
					return;
				}			
									
			});

            //监控负面buf时，上反转乾坤
            WG.add_hook("status", data => {
                if (data.action == null || data.id == null || data.sid == null) return;
                 if(data.action == "add"){
					 if(data.action.downside != null ){ //&& data.action.downside==true
					      messageAppend("被打了负面buf，释放倒转乾坤");
						  WG.SendCmd("$waitpfm parry.dao");
					 }					 
				 }
            });
			
/*
	       WG.add_hook("combat", function(data) {
             if (data.start && Hong.isboom > 0) {
                       WG.SendCmd("perform force.power;perform parry.wan");  
                    }
            });
	*/		
			WG.add_hook("sc", function (data) {
 			
			 if (Hong.isboom == 0) return;
			 
			    if (data.damage != null) {
					let h = data.damage - Hong.damage;
					if( h >0 ){
						Hong.damage= data.damage;
						messageAppend("<hio>你对独孤败天造成伤害" + h + "<hio>");		
					}
					
					let per = (data.damage/90000000*100).toFixed(2);
					if(per>11)  {
						Hong.isboom =0;
						messageAppend("<hio>伤害够了，自动关闭自爆</hio>");
						$(".boom_button").css("background", "");
						WG.SendCmd("pty 我伤害"+per+"%，by自言自语");
					}
				}
									
			});
			
        },

         boom: function () {

            if ( Hong.isboom ==0 ) {
				WG.SendCmd("$stoppfm;enable parry qianzhuwandushou;enable force xuehaimogong;");
				$(".boom_button").css("background", "#3E0000");
				Hong.isboom = 1;
				WG.SendCmd("pty 我开启自爆，by自言自语");
				messageAppend("<hiy>请穿好cd装备和软猬甲，装备千蛛万毒手+血海魔功<br>自动出招务必加入血祭代码force.power，万蛊噬天代码parry.wan<br>再叫杀独孤败天<hiy>");
				return;
            }		
			messageAppend("<hio>关闭自爆</hio>");
			$(".boom_button").css("background", "");
			Hong.isboom = 0;
        },
		 
				        //获取技能cd时间
        getTimeSkills: function(param) {
            
            for (const mark of Hong.coolingSkills) {
				if(mark.indexOf(param)>=0){
					var cur = Date.parse(new Date());
					var timecd = mark.split("_")[1];
					var cd = mark.split("_")[2];
					return parseInt(cd-(cur-timecd));
				}
                  
            }
            return 0;

        },
    };
	
    $(document).ready(function () {
        WG = unsafeWindow.WG;
        messageAppend  = unsafeWindow.messageAppend;
        messageClear =  unsafeWindow.messageClear;
        T = unsafeWindow.T;
        L = unsafeWindow.L;

        Hong.init();
 
    });
})();
