// ==UserScript==
// @name         网页亮度调整
// @name:en    Webpage brightness adjustment
// @namespace    mscststs
// @version      0.40
// @description  用这个脚本来调整你的网页亮度
// @description:en  Use this script to adjust the brightness of your page
// @require 	https://greasyfork.org/scripts/373588-mscststs-eventbus/code/mscststs-EventBus.js?version=639557
// @author       mscststs
// @include        /.*/
// @grant 		GM_setValue
// @grant 		GM_getValue
// @grant 		GM_addValueChangeListener
// @grant       GM_registerMenuCommand
// @grant		unsafeWindow
// @license        MIT License	
// @noframes
// @contributionURL   https://blve.mscststs.com/img/Pay.png
// @contributionAmount 5
// @compatible   firefox 旧版FF兼容性未考证，火狐量子版完全兼容
// @compatible   chrome
// @compatible   opera
// @compatible   safari
// @run-at 		document-body
// @downloadURL https://update.greasyfork.org/scripts/373599/%E7%BD%91%E9%A1%B5%E4%BA%AE%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/373599/%E7%BD%91%E9%A1%B5%E4%BA%AE%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
	const Default_config={
		globalBrightness: 0.9,
		SingleConfigMap:{
			/* {
					[window.location.host] : 0.9,
			}*/
		}
	}
	
	function isCN(){
		let lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
		if(lang.indexOf('zh')>=0){
			return true;
		}else{
			return false;
		}
	}
	
	const CN_wordsMap = {
		MenuCmd:"打开亮度调整菜单",
		settingsTitle:"亮度调整",
		setAsDefault:"设为默认亮度",
		closeSettingWindow:"关闭设置窗口",
		DeafultSetText:"网页默认亮度已被设置为",
	}
	const EN_wordsMap = {
		MenuCmd:"Brightness adjustment menu",
		settingsTitle:"Brightness adjustment",
		setAsDefault:"Set As Default Brightness",
		closeSettingWindow:"Close the settings window",
		DeafultSetText:"The default brightness has been set to "
	}
	
	const wordsMap = isCN()?CN_wordsMap:EN_wordsMap;
	
	const body = document.querySelector("body");
	
	

	
	let gm = new class{
		constructor(){
			this.key = "mscststs-brightness";
			this.init();
		}
		init(){
			GM_registerMenuCommand(wordsMap.MenuCmd,()=>{
				eve.emit("Cmd-OpenMenu");
			});
			GM_addValueChangeListener(this.key,(name, old_value, new_value, remote)=>{
				eve.emit("SettingUpdated",new_value);
			});
		}
		getNowBrightness(){
			let config = this.getConfig();
			return config.SingleConfigMap[window.location.host] || config.globalBrightness;
		}
		getConfig(){
			//读取配置文件
			return GM_getValue(this.key,Default_config);
		}
		setConfig(value){
			GM_setValue(this.key,value);
		}
		setGlobalBrightness(value){
			let config = this.getConfig();
			config.globalBrightness = value;
			this.setConfig(config);
		}
		setHostBrightness(value,host = window.location.host){
			let config = this.getConfig();
			config.SingleConfigMap[host] = value;
			this.setConfig(config);
		}
	}();
	
	function OpenMenuPage(){
		if(document.querySelector("#helper_brightness")){
			//当前Menu已存在
		}else{
			//Menu不存在，需要打开Menu
			let div = document.createElement("div");
			div.id = "helper_brightness";
			div.innerHTML = `

  <div class="brightness-title">
    `+wordsMap.settingsTitle+`
  </div>
  <div class="brightness-Menu">

    <div class="single">
      <div class="controller">
        <input id="helper_brightness_range" type="range" min="0" max="1" step="0.01" value="`+gm.getNowBrightness()+`"/>
      </div>
       <div class="desc">
         <div id="brightness-value">
           `+gm.getNowBrightness()+`
         </div>
         <div>
         <button id="helper_brightness_setAsDefault">
           `+wordsMap.setAsDefault+`
         </button>
         </div>
         <div>
         <button id="helper_brightness_closeSettingPage">
           `+wordsMap.closeSettingWindow+`
         </button>
         </div>
       </div>
    </div>
  </div>

<style>
#helper_brightness{
  position:fixed;
  color:black !important;
  display:block;
  left:calc( 50% - 210px);
  top:10%;
  border:1px solid #aaa;
  min-height:300px;
  width:400px;
  border-radius:8px;
  box-shadow:0 0 15px 0 #999;
  background-color:#eee;
  padding:10px;
  user-select:none;
  z-index:1000000; //100w
}
.brightness-title{
  color:black !important;
  text-align:center;
  border-bottom:1px solid #ccc;
  font-size:1.7em;
  line-height:2.5em;
}
#helper_brightness input[type=range] {
    background-color:rgb(221, 221, 221);
    -webkit-appearance: none;
    width: 300px;
    border-radius: 10px; /*这个属性设置使填充进度条时的图形为圆角*/
}
#helper_brightness input[type=range]::-webkit-slider-thumb {
    -webkit-appearance: none;
}

#helper_brightness input[type=range]::-webkit-slider-runnable-track {
    height: 15px;
    border-radius: 10px; /*将轨道设为圆角的*/
    box-shadow: 0 1px 1px #def3f8, inset 0 .125em .125em #0d1112; /*轨道内置阴影效果*/
}

#helper_brightness input[type=range]:focus {
    outline: none;
}

#helper_brightness input[type="range"]::-webkit-slider-thumb{
  width:25px;
  -webkit-appearance: none;
  height: 25px;
  margin-top: -5px; /*使滑块超出轨道部分的偏移量相等*/
  background: #ffffff;
  border-radius: 50%; /*外观设置为圆形*/
  border: solid 0.125em rgba(205, 224, 230, 0.5); /*设置边框*/
  box-shadow: 0 .125em .125em #3b4547; /*添加底部阴影*/

}

#helper_brightness .brightness-Menu{
  margin-top:25px;
}
#helper_brightness .controller{
  padding:5px 0;
  margin:0 auto;
  width:300px;
}
#helper_brightness .desc{
  text-align:center;
  line-height:35px;
}
#helper_brightness button{
  background-color:#eee;
  font-size:14px;
  line-height:30px;
  border: 1px #bebebe solid;
  height: 30px;
  padding-left: 5px;
  padding-right: 5px;
}
#helper_brightness button:hover{

  border: 1px #999 solid;
}

#brightness-value{
  font-size:2.6em;
  height:60px;
  line-height:60px;
  color:black !important;
}

</style>


			`
			body.appendChild(div);
			
			let rangeController = document.querySelector("#helper_brightness_range");
			let setAsDefaultBtn = document.querySelector("#helper_brightness_setAsDefault");
			let closeSettingPage = document.querySelector("#helper_brightness_closeSettingPage");
			let brightnessValue = document.querySelector("#brightness-value");

			rangeController.addEventListener("input",(e)=>{
			  let value = e.target.value;
			  brightnessValue.innerText = value;
			  gm.setHostBrightness(value);
			})
			setAsDefaultBtn.addEventListener("click",(e)=>{
			  //设为默认亮度
			  let value = rangeController.value;

			  gm.setGlobalBrightness(value);
			  alert(wordsMap.DeafultSetText+value+"!");
			})
			closeSettingPage.addEventListener("click",(e)=>{
			  CloseMenuPage();
			})

		}
	}
	function CloseMenuPage(){
		let menu = document.querySelector("#helper_brightness");
		if(menu){
			menu.remove();
		}
	}
	
	
	eve.on("Cmd-OpenMenu",()=>{
		OpenMenuPage();
	})
	eve.on("SettingUpdated",()=>{
		Init();
	})
	

	
	let CurrentBrightness = null;
	
	//插入style节点
	let styleNode = document.createElement("style")
	document.querySelector("head").append(styleNode)
	
	function Init(){
		if(CurrentBrightness && CurrentBrightness == gm.getNowBrightness()){
			//默认亮度未改变
		}else{
			CurrentBrightness = gm.getNowBrightness();
		}
		styleNode.innerHTML = `

body::after{
content:"";
display:block;
background-color:#000;
opacity:`+parseFloat(1-CurrentBrightness).toFixed(2)+`;

position:fixed;
left:0;
top:0;
z-index:999999;
width:100%;
height:100%;
pointer-events: none;
}

		`;
	}
	
	Init();
	
	
	//优化逻辑判断
	body.addEventListener("dblclick",(e)=>{
		if(e.ctrlKey){
			eve.emit("Cmd-OpenMenu")
		}
	})
})();