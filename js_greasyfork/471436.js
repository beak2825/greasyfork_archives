// ==UserScript==
// @name         地狱泥潭-师门挂机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  挂机师门的
// @author       You
// @match        http://game.xymud.cn:4080
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471436/%E5%9C%B0%E7%8B%B1%E6%B3%A5%E6%BD%AD-%E5%B8%88%E9%97%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/471436/%E5%9C%B0%E7%8B%B1%E6%B3%A5%E6%BD%AD-%E5%B8%88%E9%97%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    function close_hd(){
		$('#mycmds').hide();
		$('#hudong').remove();
		$('#map').remove();
		$(".emotion").hide();
		$("#facebox").remove();
	}
	function 输入指令(data){
		writecmd();
		$("#chatmsg").text(data);
		cmdsb();
	}

	function 师门任务(){
		return new Promise((resolve,reject)=>{
			var global_data = {yzm:"",npcId:"",npcName:""};
			setTimeout(()=>{
				输入指令("answer Y\nyun powerup\nyun richu\nspecial hatred\nspecial power\nrideto heimuya\ngive zhang corpse\nanswer Y\nquest cancel\nquest zhang");
			}, 1500);
			setTimeout(()=>{
				var msgbox = $("#out").children();
				var flag = 0;
				for(let i=msgbox.length-1; i>=0; i--){
					if( i<msgbox.length-1-16 ){break;}
					if( msgbox[i].innerText.match(/让别人做吧|你不用再辛苦了/) ){
						日志("接任务失败，结束");
						return resolve();
					}
					else if( msgbox[i].innerText.match("有人向你下任务了吗") ){
						日志("接任务失败，结束");
						return resolve();
					}
					else if( msgbox[i].innerText.match("你去宰了他") ){
						flag = 1;
						break;
					}
				}
				if(!flag){
					日志("接任务失败，结束");
					return resolve();
				}

				global_data.yzm = $("#hudong>span:eq(1)").text().match(/汉字(.)的一栏/)[1];
				// 日志("验证码是："+global_data.yzm);
				close_hd();
				if( !global_data.yzm ){
					日志("识别验证码失败，结束");
					return resolve();
				}
				// setTimeout(()=>{
					// 输入指令("mccp "+global_data.yzm);
				// }, 300);
				// $("#hudong>button").each((i,e)=>{
					// 日志(e.innerText);
					// if( e.innerText.match(global_data.yzm) ){
						// e.click();
						// 日志("成功点击正确的验证码："+e.innerText);
						msgbox = $("#out").children();
						for(let i=msgbox.length-1; i>=0; i--){
							let res = $(msgbox[i]).text().match(/对你道：(.*?)\((.*?)\)这个/);
							if( res ){
								// 日志("获取到怪物信息："+res[1]+" "+res[2]);
								global_data.npcName = res[1];
								global_data.npcId = res[2];
								setTimeout(()=>{
									输入指令("mccp "+global_data.yzm+"\nfly "+global_data.npcId);
								}, 1000);
								var lastTime = new Date().getTime();
								var ID = setInterval(()=>{
									var currentTime = new Date().getTime();
									if( currentTime - lastTime >= 30*1000 ){
										日志("飞怪超时，结束");
										clearInterval(ID);
										return resolve();
									}

									let res = 0;
									let node = $("#out")[0];
									for(let i=0; i<10; i++){
										let n = node.childNodes[node.childNodes.length-1-i];
										if( n.innerText ){
											if( n.innerText.match("以一个美妙之极的姿势轻落于地") ){res = 1;break;}
										}
									}
									if( !res ){return;}
									clearInterval(ID);
									输入指令("look "+global_data.npcId);
									setTimeout(()=>{
										// 日志($("#hudong>span:eq(0)").text());
										if( $("#hudong>span:eq(0)").text().match(/.*?桃花岛.*?/) ){
											日志("是桃花岛怪，自动放弃");
											return resolve();
										}
										close_hd();
										setTimeout(()=>{输入指令("kill "+global_data.npcId);}, 200);
										var lastTime = new Date().getTime();
										var ID2 = setInterval(()=>{
											var currentTime = new Date().getTime();
											if( currentTime - lastTime >= 60*1000 ){
												日志("杀怪超时，结束");
												clearInterval(ID2);
												return resolve();
											}

											let res = 0;
											let node = $("#out")[0];
											for(let i=0; i<10; i++){
												let n = node.childNodes[node.childNodes.length-1-i];
												if( n.innerText ){
													if( n.innerText.match("你成功杀死了"+global_data.npcName) ){res = 1;break;}
												}
											}
											if( !res ){return;}
											clearInterval(ID2);
											输入指令("get corpse");
											日志("完成任务，正常结束");
											return resolve();
										}, 200);
									}, 600);
								}, 200);
								break;
							}
						}

						return false;
					// }
				// });

			}, 2500);
		})
	}

	function 放弃经验(){
		return new Promise((resolve,reject)=>{
			writecmd();
			setTimeout(()=>{
				$("#chatmsg").text("fangqi exp to 200000");
				setTimeout(()=>{
					cmdsb();
					setTimeout(()=>{
						$("#chatmsg").text("qwer1234");
						setTimeout(()=>{
							cmdsb();
							setTimeout(()=>{
								return resolve();
							},10*1000);
						}, 300);
					}, 300);
				}, 300);
			}, 300);
		});
	}

	function 饮食(){
		return new Promise((resolve,reject)=>{
			输入指令("eat yangsheng dan");
			return resolve();
		});
	}
	
	var global_data = {开关:"关", };
	async function 主进程(){
		if( global_data.开关 == "开" ){
			var knockTime = new Date().getTime();
			var fangqiTime = new Date().getTime();
			var foodTime = new Date().getTime();
			var knock = 24*60*60*1000;
			var fangqi = 10*60*1000;
			var food = 30*60*1000;
			while(1){
				if( global_data.开关 == "关" ){break;}
				var currentTime = new Date().getTime();
				if( currentTime - knockTime >= knock ){
					日志("脚本已经运行一整天了");
					break;
				}
				if( currentTime - fangqiTime >= fangqi ){
					await 放弃经验();
					fangqiTime = currentTime;
					continue;
				}
				else if( currentTime - foodTime >= food ){
					await 饮食();
					foodTime = currentTime;
					continue;
				}
				await 师门任务();
			}
		}
	}
	
	var div = `<div style="display: flex; flex-direction: column; z-index:99999; position:absolute; height:20vw; width:20vw; max-height:80px; max-width:80px; right: 1px; top: 1px;">
		<div style="display: flex; width:100%; height:50%;">
			<button style="width:50%; height:100%;" id="shimen_script_start">开</button>
			<button style="width:50%; height:100%;" id="shimen_script_end">关</button>
		</div>
		<div style="display: flex; width:100%; height:50%;">
			<button style="width:100%; height:100%;" id="log_element">日志开关</button>
		</div>
	</div>
	<div id="log_element_window" style="overflow: auto; background-color: #eeeeee; display: flex; flex-direction: column; z-index:99999; position:absolute; height:60vw; width:60vw; max-height:600px; max-width:500px; left: 24vw; top: 30vh;">
		
	</div>
	`
	$(div).appendTo(document.body);
	
	$("#log_element").bind("click", ()=> {
		var log = $("#log_element_window");
		if(log.css("visibility")=="hidden"){
			log.css("visibility","visible");
		}
		else if(log.css("visibility")=="visible"){
			log.css("visibility","hidden");
		}
	});
	function 日志(data){
		var date1 = new Date();
		var datestr = "["+date1.toLocaleString()+"] ";
		$(`<p style="color:black; font-size:12px;">${datestr}${data}</p>`).appendTo($("#log_element_window"));
		$("#log_element_window").scrollTop(9999999999999);
		// console.log(data);
	}
	$("#shimen_script_end").bind("click", ()=> {
		global_data.开关 = "关";
		日志("点击停止脚本");
	});
	$("#shimen_script_start").bind("click", ()=> {
		global_data.开关 = "开";
		日志("点击开始脚本");
		主进程();
	});
})();