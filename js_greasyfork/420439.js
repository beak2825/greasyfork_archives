// ==UserScript==
// @name         百度网盘自定义倍速播放
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  第一次写的脚本，主要是考研看视频舒服一点，设置了一个可以自定义倍速的脚本，后面会逐渐完善和增加功能，欢迎反馈
// @author       枫影
// @match        *://pan.baidu.com/play/video
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420439/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/420439/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //生成倍速下拉菜单
    function createSelect(id){
    	var s=document.createElement("SELECT");
    	s.setAttribute("id",id);
		s.setAttribute("lay-verify","required");
    	var p0=document.createElement("OPTION");
    	var p1=document.createElement("OPTION");
    	var p2=document.createElement("OPTION");
    	var p3=document.createElement("OPTION");
    	var p4=document.createElement("OPTION");
    	var p5=document.createElement("OPTION");

		p0.setAttribute("id","p0");
		p1.setAttribute("id","p1");
		p2.setAttribute("id","p2");
		p3.setAttribute("id","p3");
		p4.setAttribute("id","p4");
		p5.setAttribute("id","p5");

		p0.setAttribute("value","1");
		p1.setAttribute("value","0.5");
		p2.setAttribute("value","1.0");
		p3.setAttribute("value","1.5");
		p4.setAttribute("value","2");
		p5.setAttribute("value","5");

    	p0.innerHTML="快捷倍速";
    	p1.innerHTML="0.5";
    	p2.innerHTML="1.0";
    	p3.innerHTML="1.5";
    	p4.innerHTML="2";
    	p5.innerHTML="5";

    	s.add(p0);
    	s.add(p1);
		s.add(p2);
		s.add(p3);
		s.add(p4);
		s.add(p5);
		return s;
    }

    function createInput(inid,onid,selectid){
		window.onload=function(){


			let fast=readCookie("fast");
			if(fast==null||fast==""||fast==NaN){
				fast=1.00;
				writeCookie("fast",fast,30);
			}
			else{
				fast=parseFloat(fast).toFixed(2);
			}

			layui.use('layer', function(){
			  var layer = layui.layer;
			  layer.msg('倍速脚本加载完成！欢迎使用，历史倍速：'+fast);
			});
		 }
		//生成元素
		let cr=document.createElement("BUTTON");
		cr.setAttribute("class","layui-btn layui-btn-normal layui-btn-lg");
		cr.setAttribute("id","create");

		let sm=document.createElement("i");
		sm.setAttribute("class","layui-icon layui-icon-face-smile-b");
		sm.setAttribute("style","font-size: 30px; color: #ffffff;");
		cr.setAttribute("title","隐藏倍速工具箱");
		cr.appendChild(sm);

		let f=document.createElement("fieldset");
		f.setAttribute("class","layui-elem-field");
		f.setAttribute("id","box");
		let le=document.createElement("legend");
		le.innerHTML="视频倍速工具箱";
		f.appendChild(le);

    	var d=document.createElement("FORM");
    	d.style.width="420px";
    	d.style.height="65px";
		d.setAttribute("id","inform");
		d.setAttribute("class","layui-form");

    	var init=document.createElement("INPUT");
    	init.setAttribute("type","text");
    	init.setAttribute("placeholder","请输入你想倍速的倍数");
    	init.setAttribute("id",inid);
		init.setAttribute("class","layui-input");

    	var on=document.createElement("BUTTON");
    	var res=document.createElement("BUTTON");
    	on.innerHTML="确认";
		on.setAttribute("id",onid);
		on.setAttribute("class","layui-btn layui-btn-sm");
    	res.setAttribute("type","reset");
		res.innerHTML="清空";
		res.setAttribute("class","layui-btn layui-btn-normal layui-btn-sm");
		var se=createSelect(selectid);

		var pa=document.createElement("button");
		let fast=readCookie("fast");
		if(fast!=null&&fast!=""&&fast!=NaN){
			fast=parseFloat(fast).toFixed(2);
		}
		else{
			fast=1.0;
		}
		if(readCookie("past")){
			delCookie("past");
		}
		writeCookie("past",fast,30);
		pa.innerHTML="恢复记忆"+fast;
		pa.setAttribute("id","past");
		pa.setAttribute("class","layui-btn layui-btn-normal");

		//引入layui框架
		let js=document.createElement("script");
		js.setAttribute("type","text/javascript");
		js.setAttribute("src","https://www.layuicdn.com/layui-v2.5.6/layui.js");
		let css=document.createElement("link");
		css.setAttribute("type","text/css");
		css.setAttribute("href","https://www.layuicdn.com/layui-v2.5.6/css/layui.css");
		css.setAttribute("rel","stylesheet");
		let head=document.getElementsByTagName("head")[0];
		head.appendChild(js);
		head.appendChild(css);


		//设置位置
		f.style.position="absolute";
		f.style.left="10%";
		f.style.top="-8px";
		f.style.zIndex='999';
    	init.style.position="absolute";
		init.style.width="160px";
    	on.style.position="absolute";
    	res.style.position="absolute";
    	init.style.zIndex='999';
    	on.style.zIndex='999';
    	res.style.zIndex='999';
		init.style.top="30%";
		init.style.left="0px";
    	on.style.left="25%";
        on.style.top="34%";
    	res.style.left="33%";
        res.style.top="34%";
		se.style.position="absolute";
		se.style.top="40%";
		se.style.left="45%";
		se.style.zIndex='999';
		cr.style.position="absolute";
		cr.style.left="0px";
		cr.style.top="20%";
		cr.style.zIndex='999';
		pa.style.position="absolute";
		pa.style.left="62%";
		pa.style.top="30%";

		//设置样式
		f.style.width="700px";
		f.style.height="90px";
		//document.getElementById("video-toolbar").style.width="";
		document.getElementById("video-toolbar").style.height="100px";
		//document.getElementById("video-toolbar").style.zIndex="-999";


		//生成到界面上

		//document.body.appendChild(cr);
		addChild("video-toolbar",true,cr);
		d.appendChild(init);
		d.appendChild(on);
		d.appendChild(res);
		f.appendChild(d);
		f.appendChild(se);
		f.appendChild(pa);
		controlBox(f,false);
		addChild("video-toolbar",true,f);
    	//document.body.appendChild(f);
    }

	//恢复记忆倍速
	function Past(){
		document.getElementById("past").onclick=function(){
			animations("past",3);
			let past=readCookie("past");
			if(past!=null&&past!=""&&past!=NaN){
				past=parseFloat(past).toFixed(2);
			}
			else{
				past=1.0;
			}
			setFast(null,past);
		}
	}

	//删除指定id或者class的节点，true为id，false位class
	function delNode(id,flag){
		if(flag==true){
			let node=document.getElementById(id);
			node.remove();
		}
		else if(flag==false){
			let nodes=document.getElementsByClassName(id);
			let len=nodes.length;
			for(let i=0;i<len;i++){
				nodes[i].remove();
			}
		}
	}

	//给指定id的元素赋予点击动画
	function animations(id,flag){
			let node=document.getElementById(id);
			if(node!=null){
				let cla=node.getAttribute("class");
					//为1执行上滑动画
					if(flag==1){
						node.setAttribute("class",cla+" layui-anim layui-anim-up");
					}
					//为2微上滑
					else if(flag==2){
						node.setAttribute("class",cla+" layui-anim layui-anim-upbit");
					}
					//为3平滑放大
					else if(flag==3){
						node.setAttribute("class",cla+" layui-anim layui-anim-scale");
					}
					//其他弹簧式放大
					else{
						node.setAttribute("class",cla+" layui-anim layui-anim-scaleSpring");
					}
					setTimeout(function(){node.className=cla;},300);
			}
			else{
				console.log("没有指定id="+id+"的节点");
			}
	}

	//显示当前倍速
	function outNow(fast){
		layui.use('layer', function(){
		  var layer = layui.layer;
		  layer.msg("当前倍速："+fast);
		});
	}

	//控制工具箱的显示
	var flag=0;
	function createBox(){
		let on=document.getElementById("create");
		let f=document.getElementById("box");
		on.onclick=function(){
			//添加动画
			animations("create",3);
			//0表示此时是隐藏状态
			if(flag==0){
				layui.use('layer', function(){
				  var layer = layui.layer;
				  layer.msg("显示倍速工具箱");
				});

				let sm1=document.createElement("i");
				sm1.setAttribute("class","layui-icon layui-icon-face-cry");
				sm1.setAttribute("style","font-size: 30px; color: #ffffff;");
				on.setAttribute("title","隐藏倍速工具箱");
				on.removeChild(on.firstChild);
				on.appendChild(sm1);
				controlBox(f,true);
				flag=1;
			}
			else{
				layui.use('layer', function(){
				  var layer = layui.layer;
				  layer.msg("隐藏倍速工具箱");
				});

				let sm2=document.createElement("i");
				sm2.setAttribute("class","layui-icon layui-icon-face-smile-b");
				sm2.setAttribute("style","font-size: 30px; color: #ffffff;");
				on.setAttribute("title","显示倍速工具箱");
				on.removeChild(on.firstChild);
				on.appendChild(sm2);
				controlBox(f,false);
				flag=0;
			}
		}
	}

	//动画显示隐藏指定id的fileld
	function controlBox(fieldset,flag){
		//true为渐显
		if(flag==true){
			fieldset.setAttribute("class","layui-elem-field layui-anim layui-anim-fadein");
		}
		//false为渐隐
		else{
			fieldset.setAttribute("class","layui-elem-field layui-anim layui-anim-fadeout");
		}
	}

	//视频工具箱操作实现
	function control(selectid){
		let select=document.getElementById(selectid);
		select.onchange=function(){
			setFast(selectid,0.0);
		}
	}

	//设置倍速
    function setFast(id,num){
    	var fast;
		if(num==0.0&&id!=null){
			fast=document.getElementById(id).value;
		}
		else{
			fast=num;
		}
		if(fast==0){
			fast=1;
			alert('你输入的倍数非法，已为你自动调整到原倍速！');
		}
		console.log("执行倍速："+fast);
		//将当前倍速写进cookie并且三十天不过期
		if(readCookie("fast")){
			delCookie("fast");
		}
		fast=parseFloat(fast);
		fast=fast.toFixed(2);
		writeCookie("fast",fast,30);
		console.log("read cookie="+readCookie("fast"));
    	videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(fast);
		outNow(fast);
    }

    function getInputFastAndSet(inid,btnid){
    	var on=document.getElementById(btnid);
		document.getElementById(inid).onfocus=function(){
			animations(inid,2);
		}
    	on.onclick=function(){
			animations(btnid,3)
    		setFast(inid,0.0);
    	}
    }

	//将倍速写进cookie
	function writeCookie(c_name, value, expiredays){
		var exdate = new Date();
		    exdate.setDate(exdate.getDate() + expiredays);
		    document.cookie = c_name + "=" + escape(value) + " ;expires=" + exdate.toGMTString() + "; path=/";
	}

	//将倍速从cookies里读出
	function readCookie(cookie_name){
		 var allcookies = document.cookie;
			//索引长度，开始索引的位置
		    var cookie_pos = allcookies.indexOf(cookie_name);

		    // 如果找到了索引，就代表cookie存在,否则不存在
		    if (cookie_pos != -1) {
		        // 把cookie_pos放在值的开始，只要给值加1即可
		        //计算取cookie值得开始索引，加的1为“=”
		        cookie_pos = cookie_pos + cookie_name.length + 1;
		         //计算取cookie值得结束索引
		        var cookie_end = allcookies.indexOf(";", cookie_pos);

		        if (cookie_end == -1) {
		            cookie_end = allcookies.length;

		        }
		        //得到想要的cookie的值
		        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
		    }
		return value;
	}

	//清除指定cookie
	function delCookie(name) {
		writeCookie(name, "", -1);
	}

	//监听键盘事件并更改倍速
	function keyControl(){
		document.onkeydown=function(event){
			//如果同时按下alt+反向上倍速则加0.1
			if(event.keyCode==87){
				let fast=readCookie("fast");
				console.log("倍速+");
				if(fast){
					console.log(fast);
					fast=parseFloat(fast);
					fast=fast+0.1;
					setFast(null,fast);
				}
			}
			else if(event.keyCode==83){
				console.log("倍速-");
				let fast=readCookie("fast");
				if(fast){
					console.log(fast);
					fast=parseFloat(fast);
					fast-=0.1;
					setFast(null,fast);
				}
			}
		}
	}

	//向指定id的节点增加子节点
	function addChild(id,flag,node){
		if(flag==true){
			let n=document.getElementById(id);
			n.appendChild(node);
		}
		else{
			let n=document.getElementsByClassName(id);
			if(n.length>0){
				n[0].appendChild(node);
			}
			else{
				console.log("增加节点失败，无class="+id+"的节点");
			}
		}
	}

	//清除元素
	//delNode("video-toolbar",true);
	delNode("video-toolbar-buttonbox",false);
	delNode("privilege-box",false);
    createInput("in","btn","select");

    getInputFastAndSet("in","btn");
	control("select");
	createBox();
	Past();
	keyControl();

})();
