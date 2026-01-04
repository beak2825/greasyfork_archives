// ==UserScript==
// @license      MIT
// @name         SCBOY乌龟雪插件
// @namespace    https://gitee.com/rustyhare
// @version      1.4.5
// @description  为论坛添加很棒的乌龟雪。
// @author       RustyHare
// @match        *://www.scboy.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436720/SCBOY%E4%B9%8C%E9%BE%9F%E9%9B%AA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/436720/SCBOY%E4%B9%8C%E9%BE%9F%E9%9B%AA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==




window.normalTurtle=function(quantity){
	//正常持续的乌龟
	var normalTurtle=new Object();
	normalTurtle.turtleList=[];
	normalTurtle.quantity=quantity;
	var width=window.innerWidth;
	var height=window.innerHeight;
	for(var i=0;i<quantity;i++){
		normalTurtle.turtleList.push(["🐢",Math.random()*width,Math.random()*height,0,9.8,Math.random()*0.75+0.75]);
	}
	normalTurtle.update=function(){
			for(var i=0;i<normalTurtle.quantity;i++){
					//"20px Arial"
				if(normalTurtle.turtleList[i][1] < -window.rcanvas.width*0.11 || normalTurtle.turtleList[i][1] > window.rcanvas.width*1.11 || normalTurtle.turtleList[i][2] > window.rcanvas.height+20){//如果在屏幕之外则重置该乌龟
					var destination=Math.random();
					if(destination<0.5){
						normalTurtle.turtleList[i]=(["🐢",Math.random()*window.rcanvas.width,Math.random()*window.rcanvas.height/10-window.rcanvas.height/10,window.w.velX,9.8,Math.random()*0.75+0.75]);
					}else if(destination>=0.5 && destination<0.75){
						normalTurtle.turtleList[i]=(["🐢",-window.rcanvas.width/10,Math.random()*window.rcanvas.height,window.w.velX,9.8,Math.random()*0.75+0.75]);
					}else{
						normalTurtle.turtleList[i]=(["🐢",window.rcanvas.width*1.1,Math.random()*window.rcanvas.height,window.w.velX,9.8,Math.random()*0.75+0.75]);
					}
				}
				
				normalTurtle.turtleList[i][1]+=normalTurtle.turtleList[i][3]*(0.6+normalTurtle.turtleList[i][5]*0.5)/10;
				normalTurtle.turtleList[i][2]+=normalTurtle.turtleList[i][4]*normalTurtle.turtleList[i][5]/10;
				normalTurtle.turtleList[i][3]+=(window.w.velX-normalTurtle.turtleList[i][3])/100;
				normalTurtle.turtleList[i][4]+=(window.w.velY-normalTurtle.turtleList[i][4])/100;
		}
	}
	return normalTurtle;
}

window.singleUseTurtle=function(quantity,x,y){//🎉🦌🐢❄
	//一次性使用的乌龟，
	var singleUseTurtle=new Object();
	var charList=["🎉","🦌","🐢","❄","🎄","🐇","🕊","👠"];
	singleUseTurtle.turtleList=[];
	for(var i=0;i<quantity;i++){
		singleUseTurtle.turtleList.push([charList[Math.floor(Math.random()*charList.length)],x+Math.random()*2-4,y+Math.random()*2+6,Math.random()*14-7,Math.random()*14-21,Math.random()*0.75+0.2]);
		//这段声明让这些乌龟变得集中在(x,y)附近，并且很小
	}
	return singleUseTurtle;
}

window.wind=function(){
	var wind=new Object(); 
	wind.velX=0;
	wind.velY=9.8;
	wind.windVelX=0;
	wind.windVelY=0;
	wind.accuCF=0;
	wind.windChange=function(){
		if(wind.accuCF>Math.random()*200000){
		    wind.windVelX=(Math.random()*40)-20;
		    wind.windVelY=5+(Math.random()*6);
		    wind.accuCF=0;
		        //console.log("RustyHare::Wind change triggered");
		    }else{
		        wind.accuCF+=1;
		    }
		    wind.velX+=(wind.windVelX-wind.velX)/750;
		    wind.velY+=(wind.windVelY-wind.velY)/750;
	}
	return wind;
}




//类（伪）注册部分结束
//以下是动画更新方法
window.moveAllSingleUseTurtle=function(){
	for(var j=0;j<window.singleUseList.length;j++){
		if(window.singleUseList[j].turtleList.length==0){
			window.singleUseList.splice(j,1);
		}
	}
	if(window.singleUseList.length>0){
		for(var j=0;j<window.singleUseList.length;j++){
			for(var i=0;i<window.singleUseList[j].turtleList.length;i++){
				if(window.singleUseList[j].turtleList[i][1] < -window.rcanvas.width*0.11 || window.singleUseList[j].turtleList[i][1] > window.rcanvas.width*1.11 || window.singleUseList[j].turtleList[i][2] > window.rcanvas.height+20){
					window.singleUseList[j].turtleList.splice(i,1);
				}else{
				window.singleUseList[j].turtleList[i][1]+=window.singleUseList[j].turtleList[i][3]*(0.6+window.singleUseList[j].turtleList[i][5]*0.5)/10;
				window.singleUseList[j].turtleList[i][2]+=window.singleUseList[j].turtleList[i][4]*window.singleUseList[j].turtleList[i][5]/10;
				window.singleUseList[j].turtleList[i][3]+=(window.w.velX-window.singleUseList[j].turtleList[i][3])/200;
				window.singleUseList[j].turtleList[i][4]+=(window.w.velY*3-window.singleUseList[j].turtleList[i][4])/50;
				}
			}
		}
	}
}
window.canvasRefreshTurtle=function(){
	window.rcanvas.width=window.rcanvas.width;
	window.ctx.globalAlpha=0.3;
	
	//以下是普通乌龟渲染
	for(var i=0;i<window.nt.turtleList.length;i++){
		//"20px Arial"
		window.ctx.font=((20*window.nt.turtleList[i][5]).toString()+"px Arial");
		window.ctx.fillText(window.nt.turtleList[i][0],window.nt.turtleList[i][1],window.nt.turtleList[i][2]);
		}
	//普通乌龟渲染完毕。我的代码结构好混乱啊。一个本来单纯用来渲染的函数居然还要承受删改乌龟的职能。
	//渲染一次性单位（不止于乌龟）开始
	for(var j=0;j<window.singleUseList.length;j++){
		for(var i=0;i<window.singleUseList[j].turtleList.length;i++){
			window.ctx.font=((20*window.singleUseList[j].turtleList[i][5]).toString()+"px Arial");
			window.ctx.fillText(window.singleUseList[j].turtleList[i][0],window.singleUseList[j].turtleList[i][1],window.singleUseList[j].turtleList[i][2]);
		}
	}
	//一次性渲染结束
	
}


window.searchForRemoval=function(x,y){
	for(var i=0;i<window.nt.quantity;i++){
		
	}
}
//动画更新方法部分结束
//下面是页面元素设置部分
window.canvasInit=function(){
	var mfr=document.getElementsByTagName("body");
	var rcanvas=document.createElement("canvas");
	rcanvas.id="RustyHareCanvas";
	rcanvas.style.pointerEvents="none";
	rcanvas.style.position="fixed";
	rcanvas.style.zIndex=2147483647;
	rcanvas.style.marginTop="-8px";
	rcanvas.style.marginLeft="-8px"
	mfr[0].appendChild(rcanvas);
	var rcanvas=document.getElementById("RustyHareCanvas");
	rcanvas.width=body.scrollWidth+8;
	rcanvas.height=window.innerHeight+8;
	var ctx=rcanvas.getContext("2d");
	ctx.globalAlpha=0.3;
	//现在它的大小正常了，图像不会被拉伸了
}

window.windowEventsRegister=function(){
	window.singleUseList=[];
	window.onclick=function(e){//在点击的时候设置一套新的乌龟
		window.searchForRemoval(e.x,e.y);
		window.singleUseList.push(window.singleUseTurtle(10,e.x,e.y));
	window.onresize=function(){
		window.rcanvas.width=body.scrollWidth+8;
		window.rcanvas.height=window.innerHeight+8;
		window.ctx.globalAlpha=0.3;
		//console.log("RustyHare::Resized");
	}
}
}

window.requestTurtle=function(){
	window.canvasRefreshTurtle();
	window.requestAnimationFrame(window.requestTurtle);
}//哈哈！根本不是性能问题！但是优化还是得做~

window.requestFirework=function(){
	window.canvasRefreshFirework();
	window.requestAnimationFrame(window.requestFirework);
}



function RustyHareMain(){//在真正的插件中，它只会被执行一次。
	console.log("SCBOY论坛增强效果启动\nby 罗斯贝尔野兔");
	window.isTenthAnniversary=false;//是否启动庆祝效果？false为乌龟状态，true为庆祝状态。
	window.canvasInit();//初始化canvas
	window.windowEventsRegister();//绑定事件
	window.rcanvas=document.getElementById("RustyHareCanvas");
	window.ctx=window.rcanvas.getContext("2d");
	if(window.isTenthAnniversary==false){
		window.nt=window.normalTurtle(33);//这个数字是乌龟数量。
		window.w=window.wind();//初始化风向模拟
		window.setInterval("window.w.windChange()",50)//定时风向模拟
		window.setInterval("window.nt.update()",10)//定时刷新乌龟状态
		window.setInterval("window.moveAllSingleUseTurtle()",10)//定时刷新一次性乌龟状态
		window.requestAnimationFrame(window.requestTurtle)//提供源源不断的图像。一帧一帧的动画就由此产生。
	}else{
		console.log("RustyHare::Firework effect init")
		window.fireworkMaintenance=window.fireworkMain();
		window.setInterval("window.fireworkMaintenance.update()",10);
		window.requestAnimationFrame(window.requestFirework);
	}
	
	
}


RustyHareMain()
//🍼

