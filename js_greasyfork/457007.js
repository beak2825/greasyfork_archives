// ==UserScript==
// @name         【b站】【bilibili】直播间SC监控保存自动打call
// @namespace    http://alcedo.work
// @version      3.1.1
// @description  定时检测SC并保存，点击右上角下载sc存储为txt文件，点击列表显示sc，点击打call自动发送表情
// @author       alcedoM
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457007/%E3%80%90b%E7%AB%99%E3%80%91%E3%80%90bilibili%E3%80%91%E7%9B%B4%E6%92%AD%E9%97%B4SC%E7%9B%91%E6%8E%A7%E4%BF%9D%E5%AD%98%E8%87%AA%E5%8A%A8%E6%89%93call.user.js
// @updateURL https://update.greasyfork.org/scripts/457007/%E3%80%90b%E7%AB%99%E3%80%91%E3%80%90bilibili%E3%80%91%E7%9B%B4%E6%92%AD%E9%97%B4SC%E7%9B%91%E6%8E%A7%E4%BF%9D%E5%AD%98%E8%87%AA%E5%8A%A8%E6%89%93call.meta.js
// ==/UserScript==

(
	function() {
	    'use strict';

	    //修改页面
	    var navbar = document.getElementsByClassName("shortcuts-ctnr h-100 f-left")[0];

	    var body = document.getElementsByTagName("body")[0];

	    var toollist = document.createElement("div");
	    toollist.setAttribute("id","toollist");
	    toollist.setAttribute("data-v-00d38ec1","");
	    toollist.setAttribute("class","shortcut-item h-100 p-relative f-left pointer");
	    toollist.innerHTML = (`
	    <div data-v-00d38ec1="" class="vertical-middle dp-table h-100">
	    	<div class="dp-table-cell v-middle">
		    	<div data-v-00d38ec1="" class="list-item p-relative">
		    		<div data-v-00d38ec1="" class="text-label" style="color:#00aeec;" id="SC-script">SC脚本</div>
		    	</div>
	    		<div id="droptable" data-v-00d38ec1="" class="fanbox-panel-ctnr p-absolute over-hidden slot-component" style="display: none; top: 65px;" data-v-46cf49a2="">
	    			<div style="width: 140px; height: 170px;" class="">
	    				<div data-v-46cf49a2="" class="content-ctnr w-100 p-absolute p-zero" style="">
	    					<div data-v-46cf49a2="" class="list-item a-move-in-left">
	    						<span id="downloadsc" class="title">下载sc</span>
	    					</div>
	    					<div data-v-46cf49a2="" class=" list-item a-move-in-left">
	    						<span id="cleardata" class="title">清除数据</span>
	    					</div>
	    					<div data-v-46cf49a2="" class=" list-item a-move-in-left">
	    						<div class="switch-box" style="">
							    	<div style="float: left;">
							            <span id="switch1Con">监控</span>
							        </div>
							        <div class="switch-container " style="float: right;">
							             <input type="checkbox" id="switch1" class="switch">
							             <label for="switch1" id="switchlable" onclick="test1()"></label>
							        </div>
							    </div>
							</div>
                            <div data-v-46cf49a2="" class=" list-item a-move-in-left">
	    						<div class="switch-box" style="">
							    	<div style="float: left;">
							            <span id="switch1Con">打call</span>
							        </div>
							        <div class="switch-container " style="float: right;">
							             <input type="checkbox" id="switch2" class="switch">
							             <label for="switch2" id="dacall" onclick="test2()"></label>
							        </div>
							    </div>
							</div>
							<div data-v-46cf49a2="" class=" list-item a-move-in-left">
	    						<div class="switch-box" style="">
							    	<div style="float: left;">
							            <span id="switch1Con">sc列表</span>
							        </div>
							        <div class="switch-container " style="float: right;">
							             <input type="checkbox" id="switch3" class="switch">
							             <label for="switch3" id="showsclist" onclick="test3()"></label>
							        </div>
							    </div>
							</div>
                            <style type="text/css">
                                 .switch-container{
							         height: 24px;
							         width:48px;
							         margin-top:3px;

							     }
							     .switch{
							         display: none;
							     }
							     .switch-container label{
							         display: block;
							         background-color: #eee;
							         height: 100%;
							         width: 100%;
							         cursor: pointer;
							         border-radius: 25px;
							         position: relative;
							     }
							     .switch-container label:before {
							        content: '';
							        display: block;
							        border-radius: 25px;
							        height: 100%;
							        width: 24px;
							        background-color: white;
							        position: absolute;
							        left: 0px;
							        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.08);
							        -webkit-transition: all 0.5s ease;
							        transition: all 0.5s ease;
							     }
								 #switch1:checked~label:before {
								   left: 24px;
								 }
								 #switch1:checked~label {
								     background-color: #00aeec;
								 }
                                 #switch2:checked~label:before {
								   left: 24px;
								 }
								 #switch2:checked~label {
								     background-color: #00aeec;
								 }
								 #switch3:checked~label:before {
								   left: 24px;
								 }
								 #switch3:checked~label {
								     background-color: #00aeec;
								 }
							</style>
						</div>
					</div>
				</div>
			</div>
		</div>`);
       
	    navbar.insertBefore(toollist,navbar.children[3]);


	    var sclist = document.createElement("div");
        sclist.style.position = "absolute";
        sclist.style.height = "400px";
        sclist.style.width = "300px";
        sclist.style.border = "1px solid #f1f2f3";
        sclist.style.borderRadius = "10px";
        sclist.style.backgroundColor = "white";
        sclist.style.zIndex = "999";
        sclist.style.right = "250px";
        sclist.style.top = "65px";
        sclist.style.padding = "5px";
        sclist.style.display = "none";
        sclist.innerHTML =(`
        <div id="my-sc-title" style="height:30px; line-height:30px; text-align:center">SC列表</div>
		<div style="overflow: hidden;">
            <div id="my-sc-innerlist" style="height:370px;width: 316px;overflow-y: scroll;"></div>
        </div>`
                          );
        body.insertBefore(sclist,body.children[0]);
        var scInnerlist = document.getElementById("my-sc-innerlist");
        var scTitle = document.getElementById("my-sc-title");

	    var rightpart = document.getElementById("right-part");
		rightpart.style.cssText='max-width: 450px !important; min-width: 270px;';


		// 初始化
		var init_list = localStorage.init_list;
		var rawset = [];
		var is_monitor = false;
        var is_call = false;
        var sc_color_set = [["#edf5ff","#2a60b2"],["#dbfffd","#427d9e"],["#fff1c5","#e2b52b"],["#ffead2","#e09443"],["#ffe7e4","#e54d4d"],["#ffd8d8","#ab1a32"]];
        var sc_count = 0;

        var url = window.location.href;
        // console.log(url);
        var match = url.match(/roomid=(\d+)/);
        if(match==null){
            match = url.match(/live.bilibili.com\/(\d+)/);
        }
        var room_id = Number(match[1]);
        // console.log(room_id);

        var emoji_list = localStorage.getItem(room_id+"_emoji_list");
        if (emoji_list==null){
        	emoji_list=[1,0,12];
        }else{
        	emoji_list = JSON.parse(localStorage.getItem(room_id+"_emoji_list"));
        }
        var call_conut = 0;
        var call_limit_count = 0;


		if(init_list==null){
			init_list = [];
			localStorage.setItem('init_list',JSON.stringify(init_list));
		}else{
            init_list = JSON.parse(localStorage.init_list);
        }

		if(init_list.indexOf(room_id) !== -1){
			is_monitor = true;
			let chbx = document.getElementById('switch1');
			chbx.checked = true;

			var sc_dataset = JSON.parse(localStorage.getItem("room_"+room_id));
			if(sc_dataset==null){
				console.log("error, can not found localStorage");
				console.log("reload and try to reinit");
				let index = init_list.indexOf(room_id);
				init_list.splice(index, 1);
				localStorage.setItem('init_list',JSON.stringify(init_list));
				location.reload();
			}
			var superchat = sc_dataset[0];
			var ct = sc_dataset[1];
			var timest = sc_dataset[2];
			let time = new Date();
			let timenow = time.toLocaleDateString();

			if(timest!==timenow){
				let flag = confirm(`检测到日期变更，是否清除本地数据，直播间：${room_id}`);
				if(flag){
					clear_data();
				}
			}

			//读取存储在本地的SC,并展示
			for(let i = 0; i　< superchat.length; i++){
				add_sc_card(superchat[i][3],superchat[i][1],superchat[i][0],superchat[i][2]);
			}
            sc_count = superchat.length;
            scTitle.innerText=`SC列表(${sc_count})`;

			console.log('load success, 1');
		}
		else{

		}

		//定时中断
		var timer = setInterval(function(){
			//sc监视
			if(is_monitor){
				rawset = document.getElementsByClassName('superChat-card-detail');
				if(rawset.length !== 0){
					for (var i = 0; i < rawset.length; i++) {
						var index=ct.indexOf(rawset[i].dataset.ct);
						if(index == -1){
							let time = new Date();
                            let money = rawset[i].children[0].innerHTML;
							let sc = [rawset[i].dataset.danmaku,rawset[i].dataset.uname,time.toLocaleTimeString(),money];
							ct.push(rawset[i].dataset.ct);
							superchat.push(sc);
							console.log('sc:'+ i);

							//sc展示
							add_sc_card(money,rawset[i].dataset.uname,rawset[i].dataset.danmaku,time.toLocaleTimeString())
                            sc_count = superchat.length;
                            scTitle.innerText=`SC列表(${sc_count})`;

						}
					}
				}
				sc_dataset[0] = superchat;
				sc_dataset[1] = ct;
				localStorage.setItem("room_"+room_id,JSON.stringify(sc_dataset));
			}
			//发送表情
            if(is_call){
            	call_conut += 1;
            	call_limit_count += 1;
            	if(call_conut ==1 ){
                	let open_emotion = document.getElementsByClassName("emoticons-panel p-relative")[0];
                	open_emotion.click();
            	}else if(call_conut*3 >= emoji_list[2]){
            		call_conut = 0;
                	let emotion_tab = document.getElementsByClassName("img-pane ps ps--theme_default")[emoji_list[0]];
                	let target_emoji = emotion_tab.children[0].children[emoji_list[1]];
                	target_emoji.click();
                }
                //发送3分钟自动停止
                if(call_limit_count>= 60){
                	call_limit_count = 0;
                	document.getElementById('switch2').checked = false;
                	is_call = 0;
                }

            }
		},3000)



	    let downloadsc = document.getElementById('downloadsc');
	    let cleardata = document.getElementById('cleardata');
	    let dptb = document.getElementById('droptable');

        //下拉菜单
		toollist.onmouseover = function(){
			listin();
		}
		dptb.onmouseover = function(){
			listin();
		}
		toollist.onmouseout = function(){
			listout();
		}
		dptb.onmouseout = function(){
			listout();
		}
		function listin(){
			let dptb = document.getElementById('droptable');
			dptb.style.display="block";
		}
		function listout(){
			let dptb = document.getElementById('droptable');
			dptb.style.display="none";
        }


        //生成SC卡片
        function add_sc_card(money,uname,danmaku,time){
			let sc_color = [];
            console.log(money)
			let money_conut = parseInt(money.match(/\d+/)[0]);
			if(money_conut>=20000){
				sc_color = sc_color_set[5];
			}else if(money_conut>=10000){
				sc_color = sc_color_set[4];
			}else if(money_conut>=5000){
				sc_color = sc_color_set[3];
			}else if(money_conut>=1000){
				sc_color = sc_color_set[2];
			}else if(money_conut>=500){
				sc_color = sc_color_set[1];
			}else{
				sc_color = sc_color_set[0];
			}

			let scCard = document.createElement("div");
            scCard.innerHTML=(`
            <div class="my-sc-card" style="height: auto;width:auto;border: 1px solid ${sc_color[1]}; border-radius: 6px; margin-bottom: 10px;">
	            <div class="sc-card-up" style="background-color: ${sc_color[0]};border-radius: 6px 6px 0 0;padding:5px 10px;height:30px; font-size: 16px; line-height: 30px;">
		             <div class="sc-card-right" style="float: left;">${uname}</div>
		             <div class="sc-card-left" style="float: right;">${money}</div>
	            </div>
	            <div class="sc-card-down" style="min-height: 34px; background-color: ${sc_color[1]};color: white;padding:5px 10px;text-align: left;word-break: break-word;font-size: 14px;line-height:15px;border-radius: 0 0 6px 6px;">
		          ${time}:${danmaku}
	            </div>
           </div>`)
            scInnerlist.appendChild(scCard);
        }

        //保存txt函数
	    downloadsc.onclick = function(){
	    	let str = "";
            let time = new Date();
            let timedate = time.toLocaleDateString();
	    	for (var i = 0; i < superchat.length; i++) {
	    		str += i +" "+ superchat[i].toString()+"\r\n"
	    	}
			var urlObject = window.URL || window.webkitURL || window;
			var export_blob = new Blob([str]);
			var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
			save_link.href = urlObject.createObjectURL(export_blob);
			save_link.download = `sc_${room_id}_${timest}.txt`;
			save_link.click();
		}

		//点击清除数据
		cleardata.onclick = function(){
			let flag = confirm(`是否清除本地数据,直播间：${room_id}`);
				if(flag){
					clear_data();
				}
		}

		//清除本地数据
		function clear_data(){
			let time = new Date();
			let timenow = time.toLocaleDateString();
            ct =[];
            superchat=[];
			sc_dataset = [superchat,ct,timenow];
            timest = timenow;

			localStorage.setItem("room_"+room_id,JSON.stringify(sc_dataset));
			alert(`清除本地数据成功,直播间：${room_id}`);
			console.log(`clear success roomid:${room_id}`)
		}

		//开关的点击函数
		//发送表情
        var dacall = document.getElementById('dacall');
        dacall.onclick = function(){
        	if (!document.getElementById('switch2').checked ) {
        		let dacall_input = prompt(`请输入参数：第几个表情栏,第几个表情,发送间隔(尽可能为3的倍数且不宜太小)。示例：2,1,12表示每12s发送第2栏第1个表情“点赞”`,`${emoji_list[0]+1},${emoji_list[1]+1},${emoji_list[2]}`);
        		if(dacall_input == null){
        			let ckbx = document.getElementById('switch2').checked;
        			ckbx = false;
        		}else{
                    // defaut_emoji = dacall_input;
                    // console.log(defaut_emoji);
        			let sp_arr = dacall_input.split(/[，, ]/);
        			let fin_arr = [];
        			let is_err = 0;
        			if(sp_arr.length !== 3){
        				is_err = 1;
        				alert(`输入参数数量错误，请重新输入`);
        			}else{
        				for (let i = 0; i < sp_arr.length; i++) {
							if(isNaN(sp_arr[i])){
								is_err = 1;
								alert(`请输入数字用逗号隔开`);
								break;
							}else if(parseInt(sp_arr[i]) <= 0){
								is_err = 1;
								alert(`请输入正数`);
								break;
							}else{
								fin_arr.push(parseInt(sp_arr[i]));
							}
						}
						// if(fin_arr[2] < 3){
						// 	is_err = 1;
						// 	alert(`请输入大于3s的时间间隔`);
						// 	break;
						// }
						fin_arr[0] = fin_arr[0] - 1;
						fin_arr[1] = fin_arr[1] - 1;
        			}
        			if(is_err==0 && fin_arr!==[]){
        				emoji_list = fin_arr;
        				localStorage.setItem(room_id+'_emoji_list',JSON.stringify(emoji_list));
        				call_limit_count = 0;
        				is_call = 1;
        			}else{
        				document.getElementById('switch2').checked = false;
        			}

    			}

        	}else{
        		is_call = 0;
        	}

        }

        //展示sc
        var showsclist = document.getElementById('showsclist');
        showsclist.onclick = function(){
        	if (document.getElementById('switch3').checked ) {
        		sclist.style.display = "none";
        	}else{
        		sclist.style.display = "block";
        	}

        }

		//切换监控开关
        var slabel = document.getElementById('switchlable')
     	slabel.onclick = function(){
     		 if (!document.getElementById('switch1').checked ) {
     		 	//开启
				let flag = confirm(`是否监控本直播间SC:${room_id}`);
				if(flag){
					let sc_dataset = localStorage.getItem("room_"+room_id);

					if(sc_dataset == null){
						superchat = [];
						ct = [];
		                init_list.push(room_id);
						let time = new Date();
						let sc_dataset = [superchat,ct,time.toLocaleDateString()];
						localStorage.setItem('init_list',JSON.stringify(init_list));
						localStorage.setItem("room_"+room_id,JSON.stringify(sc_dataset));
					}else{
						init_list.push(room_id);
						localStorage.setItem('init_list',JSON.stringify(init_list));
					}
					console.log('monitor open');
					location.reload();
				}else{
					console.log('user deny, -1');
				}
             }else{
                let index = init_list.indexOf(room_id);
				init_list.splice(index, 1);
				is_monitor = false;
				localStorage.setItem('init_list',JSON.stringify(init_list));
				console.log("close success");
             }
     	}
	}
)();
