/**
 * 共有方法，全局共享
 */

function commonFunction(){
	this.GMgetValue = function (name, value) { //得到存在本地的数据
		if (typeof GM_getValue === "function") {
			return GM_getValue(name, value);
		} else {
			return GM.getValue(name, value);
		}
	};
	this.GMsetValue = function(name, value){
		if (typeof GM_setValue === "function") {
			return GM_setValue(name, value);
		} else {
			return GM.setValue(name, value);
		}
	};
	this.GMaddStyle = function(css){
		var myStyle = document.createElement('style');
		myStyle.textContent = css;
		var doc = document.head || document.documentElement;
		doc.appendChild(myStyle);
	};
	this.GMopenInTab = function(url, open_in_background){
		if (typeof GM_openInTab === "function") {
			GM_openInTab(url, open_in_background);
		} else {
			GM.openInTab(url, open_in_background);
		}
	};
	this.addScript = function(url){
		var s = document.createElement('script');
		s.setAttribute('src',url);
		document.body.appendChild(s);
	};
	this.randomNumber = function(){
		return Math.ceil(Math.random()*100000000);
	};
	this.request = function(mothed, url, param){   //网络请求
		return new Promise(function(resolve, reject){
			GM_xmlhttpRequest({
				url: url,
				method: mothed,
				data:param,
				onload: function(response) {
					var status = response.status;
					var playurl = "";
					if(status==200||status=='200'){
						var responseText = response.responseText;
						resolve({"result":"success", "data":responseText});
					}else{
						reject({"result":"error", "data":null});
					}
				}
			});
		})
	};
	this.getCurrentTime = function(){
		var date = new Date();
		var year = date.getFullYear();        //年 ,从 Date 对象以四位数字返回年份
		var month = date.getMonth() + 1;      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
		var day = date.getDate();             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)
		
		var hours = date.getHours();          //小时 ,返回 Date 对象的小时 (0 ~ 23)
		var minutes = date.getMinutes();      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
		var seconds = date.getSeconds();      //秒 ,返回 Date 对象的秒数 (0 ~ 59)   
		
		//修改月份格式
		if (month >= 1 && month <= 9) {
			month = "0" + month;
		}
		
		//修改日期格式
		if (day >= 0 && day <= 9) {
			day = "0" + day;
		}
		
		//修改小时格式
		if (hours >= 0 && hours <= 9) {
			hours = "0" + hours;
		}
		
		//修改分钟格式
		if (minutes >= 0 && minutes <= 9) {
			minutes = "0" + minutes;
		}
		
		//修改秒格式
		if (seconds >= 0 && seconds <= 9) {
			seconds = "0" + seconds;
		}
		
		//获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)
		var currentFormatDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
		return currentFormatDate;
	};
	this.addCommonHtmlCss = function(){
		var cssText = 
			`
			@keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-webkit-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-moz-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-o-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@-ms-keyframes fadeIn {
				0%    {opacity: 0}
				100%  {opacity: 1}
			}
			@keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-webkit-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-moz-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-o-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			@-ms-keyframes fadeOut {
				0%    {opacity: 1}
				100%  {opacity: 0}
			}
			.web-toast-kkli9{
				position: fixed;
				background: rgba(0, 0, 0, 0.7);
				color: #fff;
				font-size: 14px;
				line-height: 1;
				padding:10px;
				border-radius: 3px;
				left: 50%;
				transform: translateX(-50%);
				-webkit-transform: translateX(-50%);
				-moz-transform: translateX(-50%);
				-o-transform: translateX(-50%);
				-ms-transform: translateX(-50%);
				z-index: 9999;
				white-space: nowrap;
			}
			.fadeOut{
				animation: fadeOut .5s;
			}
			.fadeIn{
				animation:fadeIn .5s;
			}
			`;
		this.GMaddStyle(cssText);
	};
	this.webToast = function(params) {	//小提示框
		var time = params.time;
		var background = params.background;
		var color = params.color;
		var position = params.position;  //center-top, center-bottom
		var defaultMarginValue = 50;
		
		if(time == undefined || time == ''){
			time = 1500;
		}
		
		var el = document.createElement("div");
		el.setAttribute("class", "web-toast-kkli9");
		el.innerHTML = params.message;
		//背景颜色
		if(background==undefined || background==''){
			el.style.backgroundColor=background;
		}
		//字体颜色
		if(color==undefined || color==''){
			el.style.color=color;
		}
		
		//显示位置
		if(position==undefined || position==''){
			position = "center-bottom";
		}
		
		//设置显示位置，当前有种两种形式
		if(position==="center-bottom"){
			el.style.bottom = defaultMarginValue+"px"; 
		}else{
			el.style.top = defaultMarginValue+"px"; 
		}
		el.style.zIndex=999999;
		
		document.body.appendChild(el);
		el.classList.add("fadeIn");
		setTimeout(function () {
			el.classList.remove("fadeIn");
			el.classList.add("fadeOut");
			/*监听动画结束，移除提示信息元素*/
			el.addEventListener("animationend", function () {
				document.body.removeChild(el);
			});
			el.addEventListener("webkitAnimationEnd", function () {
				document.body.removeChild(el);
			});
		}, time);
	}
}