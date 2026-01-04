// ==UserScript==
// @name         编辑网页元素
// @namespace    https://greasyfork.org/users/1113496
// @version      1.53
// @license      GNU GPLv3
// @description  可视化选中网页元素，并根据需求编辑
// @author       xzhao
// @match        */*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/469568/%E7%BC%96%E8%BE%91%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/469568/%E7%BC%96%E8%BE%91%E7%BD%91%E9%A1%B5%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==


(function () {
	//默认展示的元素样式
	const cssAry = ['border', 'padding', 'margin', 'background', 'position', 'visibility', 'display', 'height', 'width']
	//获取的margin padding border不同方向样式
	const cssPos = ['Right', 'Bottom', 'Left', 'Top'];
	//默认展示的元素属性
	const statArry = ['innerHTML', 'textContent', 'className', 'id', 'tagName']

	const seledom = document.createElement("editor-div");
	const sd=seledom.attachShadow({ mode: 'closed' });
	document.documentElement.appendChild(seledom, document.body);
	function createElement(tag,parent=sd){
		const ele=document.createElement(tag);
		parent.appendChild(ele);
		return ele;
	}
	const mask = createElement("editor-div");
	const pobut = createElement("editor-div");
	const cssU = createElement('style');
	const setpage = createElement("editor-div");
	const setDetail = createElement('editor-div');
	const histroyPage = createElement('editor-div');
	pobut.innerText = "开";
	let flag = true;
	pobut.classList.add('pobut');
	setDetail.className = 'setpage setDetail'
	histroyPage.className = 'setpage histroyPage'
	seledom.id = 'selectDom';
	seledom.style.cssText = "position:fixed;z-index:9997;top:50%;left:0;";
	setpage.className = 'setpage';

	//元素对象类，用于存储修改的元素路径，元素目标，及样式属性
	class targetElement {
		target;
		road = '';
		road_index;
		detail;
		css;
		stats;
		is_remove;
		constructor(target, road, road_index, detail, css = {}, stats = {}, is_remove = false) {
			this.target = target
			this.road = road
			this.road_index = road_index
			this.detail = detail
			this.css = css
			this.stats = stats
			this.is_remove = is_remove
		}
	}
	//全局变量
	//短期操作历史记录
	const session_targetAll = []
	//长期操作历史记录
	let local_targetAll = []
	let copy_local=[]
	//设置页面宽度 高度
	const setpage_width = '250px', setpage_height = 370
	//设计样式CSS
	cssU.innerText = "editor-div{display:block;}" +
		".pobut{display:block;width:30px;height:30px;background-color:white;user-select:none;position:absolute;top:0;left:0;text-align:center;line-height:30px;opacity:0.3;cursor:move;z-index:9997;border-radius:50%;box-shadow:0 0 2px 1px black;font-size:15px;}" +
		".mask{position:fixed;background-color:rgba(86, 156, 214,0.8);pointer-events:auto;z-index:9996;}" +
		".setpage>#histroy{position:absolute;top:5px;left:5px;width:30px;height:30px;font-size:25px;background-size:cover;cursor:pointer;}" +
		".histroyPage .histroy{font-size:25px;position:absolute;top:0;left:5px;width:30px;height:25px;cursor:pointer;}" +
		".histroyPage>.title>span>span{cursor:pointer;user-select:none;}" +
		".histroyPage>.title .checked{font-weight:bold;font-size:17px;cursor:default;}" +
		".histroyPage>.close{display:none;}"+
		".histroyPage>.hst_content{height:87%;overflow:auto;margin-top:5px;}" +
		".histroyPage>.hst_content>editor-div{width:90%;height:45px;padding:5px 10px;border-radius:8px;overflow:hidden;background-color:#a4cbf9;margin:2px auto;cursor:pointer;}" +
		".histroyPage>.hst_content>editor-div>span{float:right;background-color:#4ac45b;padding:3px;border-radius:5px;}" +
		".histroyPage>.hst_content>editor-div>p{height:20px;overflow:hidden;}" +
		".setpage{font-size:15px;display:none;position:absolute;width:0;height:" + setpage_height + "px;background-color:white;overflow:auto;z-index:9998;left:40px;top:-"+(setpage_height/2-15)+"px;cursor:default;border-radius:20px;transition-duration:0.5s;color:black;}" +
		"h3{margin:0;font-size:15px;}" +
		".setpage>.but_text{text-align:right;font-size:13px;padding:0 25px;height:20px;}" +
		".setpage>.but_text>span{float:left;background-color:#efefef;font-size:18px;cursor:pointer;border-radius:5px;margin-right:2px;}" +
		".setpage>.but_text>span:hover{background-color:#bbd8fb;box-shadow:0 0 2px 1px #d0e4fc;}" +
		".setpage>.but_text>span:active{background-color:#8dbff7;}" +
		".setpage>.clhtml{box-shadow:0 0 2px 1px #49abef;width:80%;height:25px;border-radius:5px;margin:5px auto;transition-duration:0.3s;overflow:hidden;background-color:#86d6f8;cursor:pointer;}" +
		".setpage>.clhtml>.html_ab{width:250px;height:18px;position:absolute;left:0;text-indent:2em;overflow:hidden;transition-duration:0.3s;}" +
		".setpage>.clhtml .content{overflow:hidden;width:235px;height:150px;}" +
		".setpage>.clhtml:focus{overflow:auto;height:150px;width:100%;background-color:white;cursor:default;}" +
		".setpage>.clhtml:focus>.html_ab{height:150px;}" +
		".setpage>.clhtml:focus .content{overflow:auto;}" +
		".setpage .css_diy{margin:2px auto;height:100px;overflow:auto;}" +
		".setpage .css_diy>editor-div{height:23px;}" +
		".setpage .poptag{position:absolute;display:none;margin-left:70px;border-radius:8px;margin-top:15px;box-shadow:0 0 2px 1px red;background-color:red;z-index:9999;width:100px;text-align:center;}" +
		".setpage .css_diy>editor-div>input{width:80px;margin:0 5px;margin-left:0;outline:none;font-size:15px;border:1px solid;}" +
		".setpage .css_diy>editor-div>button{width:30px;background-color:#4ac45b;border-radius:5px;border:0;padding-top:2px;height:18px;cursor:pointer;transition:0.1s;}" +
		".setpage .css_diy>editor-div>button:hover{background-color:#73d280;}" +
		".setpage .css_diy>editor-div>button:active{background-color:#93dc9e;}" +
		".setDetail{overflow:visible;left:292px;width:250px;box-shadow:0 0 2px 1px #49abef;display:none;}" +
		".setpage .serch button{height:23px;width:40px;background-color:#86d6f8;border-radius:0 8px 8px 0;cursor:pointer;border:0;user-select:none;}" +
		".setpage .serch .serchin{color:gray;outline:none;height:20px;border:2px solid #86d6f8;border-radius:8px 0 0 8px}" +
		".setpage .serch .serchin:focus{color:black;box-shadow:0 0 2px 1px #86d6f8}" +
		".setpage .detail{position:absolute;right:10px;top:100px;font-size:10px;cursor:pointer;text-align:left;width:20px;border-radius:8px;padding-left:3px;}" +
		".setpage .detail:hover{box-shadow:0 0 2px 1px gray;}" +
		".setpage .detail>.tr{border:7px solid transparent;border-left-color:#49abef;position:absolute;left:18px;top:26px;height:0;width:0;transition-duration:0.5s;}" +
		"p{margin:0;}" +
		".setDetail>.clRoad{margin-top:10px;text-indent:2em;height:52.5px;padding-bottom:3px;}" +
		".setDetail>.clRoad .road_in{float:left;font-size:16px;line-height:17px;height:25px;border-radius:10px 0 0 10px;resize:none;outline:none;margin-left:15px;border:0px;box-shadow:0 0 2px 1px #49abef;}" +
		".setDetail>.clRoad .road_in:focus{width:600px;height:80px;}" +
		".setDetail>.clRoad .ckbut{background-color:#86d6f8;user-select:none;line-height:25px;border-radius:0 10px 10px 0;cursor:pointer;box-shadow:0 0 2px 1px #49abef;text-align:center;width:2.5em;float:left;text-indent:0;height:25px;}" +
		".setDetail .road_nth{border:0;outline:none;border-bottom:1px solid;width:30px;text-align:center;}" +
		".setDetail>.sl_tag{background-color:#ababab;padding:3px;opacity:0.3;display:block;border-radius:5px;box-shadow:0 0 2px 1px gray;}"


	//设置页面内容
	setpage.innerHTML = "<span title='历史记录' id='histroy'>🕔</span><h3 style='text-align:center;margin-bottom:0;font-size:20px;display:block;'>设置</h3><p style='font-size:15px;margin:0;text-align:center;'>请选择你要进行的操作</p><editor-div class='but_text'><span title='复制到剪切板' class='clipboard'>📋</span>仅显示文本<input id='txet_only' type='checkbox' /></editor-div><editor-div class='clhtml' tabindex='1' title='获取到的元素'><editor-div class='html_ab'><editor-div class='content'></editor-div></editor-div></editor-div>" +
		"<editor-div style='text-align:center;'><label for='local_mem' title='本次操作下次依旧有效，可用于标记广告等'>记忆本次操作<input id='local_mem' type='checkbox' /></label><label for='del' style='display:block;'>删除元素<input type='radio' name='domset' id='del'></label><label for='hid' style='display:block;'>隐藏/显示元素<input type='radio' name='domset' id='hid'></label><label for='close_clock' style='display:block;'>关闭页面所有定时器<input type='radio' name='domset' id='close_clock'></label>" +
		"<label for='cus'>自定义样式(CSS)<input type='radio' name='domset' id='cus'></label><editor-div class='serch' title='搜索CSS样式'><input class='serchin' placeholder='搜索CSS样式(驼峰命名法)'><button>搜索</button></editor-div>" +
		"<editor-div class='poptag' style='display:none;'>未找到该样式</editor-div><editor-div class='css_diy'></editor-div><editor-div class='detail'>详 细 信 息<editor-div class='tr'></editor-div></editor-div>" +
		"</editor-div><button class='but' style='user-select:none;float:bottom;padding:5px;margin-left:100px;width:40px;height:25px;background-color:#49abef;box-shadow:0 0 2px 1px gray;cursor:pointer;border:0;border-radius:5px;'>确定</button>";

	//设置详细信息页面
	setDetail.innerHTML = "<editor-div class='clRoad'><p>元素路径：</p><span style='float:left;' tabindex='1'><textarea class='road_in'></textarea><editor-div class='ckbut'>选择</editor-div></span></editor-div><editor-div style='font-size:14px;text-align:center;margin-bottom:5px;' class='road_nthTxt'>该元素为第<input class='road_nth' maxlength='3'/>个同类元素</editor-div>" +
		"<span class='sl_tag'>选择提示</span><editor-div class='serch' style='text-align:center;margin-top:10px;' title='搜索元素属性'><input class='serchin' placeholder='搜索元素属性(驼峰命名法)'><button>搜索</button></editor-div><editor-div class='poptag' style='display:none;'>未找到该属性</editor-div><editor-div class='css_diy'></editor-div>"

	//设置历史记录页面
	histroyPage.innerHTML = "<editor-div class='title' style='text-align:center;padding-top:5px;'><span title='返回' class='histroy'>×</span><span class='history_title'><span class='checked'>本次操作</span>|<span >记忆操作</span></span></editor-div><editor-div class='hst_content ses_content'></editor-div><editor-div class='hst_content local_content close'></editor-div>"


	//点击打开历史记录页面
	//判断是否刷新
	let histroy_is_refresh = true
	let local_is_refresh=true
	histroyPage.style.width = '250px'
	let histroy_oc = sd.querySelector('.setpage>#histroy')
	histroy_oc.onclick = function () {
		histroyPage.style.display = 'block'
		if (histroy_is_refresh) {
			ses_content.innerHTML = ''
			session_targetAll.forEach((ele, ind) => {
				data_in_session(ele, ind)
			})
			histroy_is_refresh = false
		}
		if(local_is_refresh){
			local_ele_refresh()
			local_is_refresh = false
		}
	}
	//刷新记忆列表展示的元素
	function local_ele_refresh(){
		local_content.innerHTML = ''
			local_targetAll.forEach((ele, ind) => {
				data_in_local(ele, ind)
			})
	}

	//点击关闭历史记录页面
	histroy_oc = sd.querySelector('.histroyPage .histroy')
	histroy_oc.onclick = function () {
		histroyPage.style.display = 'none'
		pobSet(cl)
	}
	//点击选择两个历史记录中的一个
	histroy_oc=sd.querySelector('.histroyPage .history_title')
	const ses_content = sd.querySelector(".histroyPage>.ses_content")
	const local_content=sd.querySelector('.histroyPage>.local_content')
	histroy_oc.onclick=function(e){
		if(e.target.className==''){
			sd.querySelector('.histroyPage .history_title>.checked').className=''
			ses_content.classList.toggle('close')
			local_content.classList.toggle('close')
			e.target.className='checked'
		}
	}

	//从记忆列表中读取数据至历史记录 函数
	function data_in_local(targE, ind) {
		const divcs = document.createElement('editor-div');
		divcs.setAttribute('data-index', ind)
		divcs.title=targE.road+' ['+(targE.road_index-1)+']'
		local_content.appendChild(divcs);
		let incs=document.createElement('span')
		incs.innerText='×'
		incs.className='remove'
		incs.style='background-color:red;margin-left:5px;'
		incs.title='从记忆列表中除去该元素'
		divcs.appendChild(incs)
		incs = document.createElement('span');
		if (targE.is_remove) {
			incs.innerText = '已删除'
			incs.style.backgroundColor = 'red'
		}
		else {
			incs.innerText = '修改属性';
		}
		divcs.appendChild(incs);
		incs = document.createElement('h3');
		incs.textContent = targE.target.tagName;
		divcs.appendChild(incs);
		incs = document.createElement('p');
		divcs.appendChild(incs);
		incs.innerText = targE.detail;
	}
	//鼠标移至相应历史记录时遮罩相应元素
	let s_local_ind;
	local_content.onmouseover = function (e) {
		if (e.target.getAttribute('data-index')) {
			s_local_ind = e.target.getAttribute('data-index')
			pobSet(local_targetAll[s_local_ind].target)
		}else if(e.target.parentNode.getAttribute('data-index')){
			s_local_ind = e.target.parentNode.getAttribute('data-index')
			pobSet(local_targetAll[s_local_ind].target)
		}

	}
	//当点击后选中历史记录中当前元素
	local_content.onclick = function (e) {
		if(e.target.className=='remove'){
			local_targetAll.splice(s_local_ind,1)
			copy_local.splice(s_local_ind,1)
			//存储本次操作
			localStorage.setItem('eEdit_local_targetAll', JSON.stringify(copy_local))
			local_ele_refresh()
		}
		else if (!e.target.className) {
			select(local_targetAll[s_local_ind].target)
			road_nth.value = local_targetAll[s_local_ind].road_index
			RoadTA.value = local_targetAll[s_local_ind].road
			histroyPage.style.display = 'none'
		}
	}


	//从列表中读取数据至历史记录 函数
	function data_in_session(targE, ind) {
		const divcs = document.createElement('editor-div');
		divcs.setAttribute('data-index', ind)
		divcs.title=targE.road+' ['+(targE.road_index-1)+']'
		ses_content.appendChild(divcs);
		let incs = document.createElement('span');
		if (targE.is_remove) {
			incs.innerText = '已删除'
			incs.style.backgroundColor = 'red'
			divcs.style.cursor = 'default'
		}
		else {
			incs.innerText = '修改属性';
		}
		divcs.appendChild(incs);
		incs = document.createElement('h3');
		divcs.appendChild(incs);
		incs.textContent = targE.target.tagName;
		incs = document.createElement('p');
		divcs.appendChild(incs);
		incs.innerText = targE.detail;
	}
	//鼠标移至相应历史记录时遮罩相应元素
	let s_hst_ind;
	ses_content.onmouseover = function (e) {
		if (e.target.getAttribute('data-index')) {
			s_hst_ind = e.target.getAttribute('data-index')
			pobSet(session_targetAll[s_hst_ind].target)
		}else if(e.target.parentNode.getAttribute('data-index')){
			s_hst_ind = e.target.parentNode.getAttribute('data-index')
			pobSet(session_targetAll[s_hst_ind].target)
		}
	}
	//当点击后选中历史记录中当前元素
	ses_content.onclick = function (e) {
		if (!e.target.className && !session_targetAll[s_hst_ind].is_remove) {
			select(session_targetAll[s_hst_ind].target)
			road_nth.value = session_targetAll[s_hst_ind].road_index
			RoadTA.value = session_targetAll[s_hst_ind].road
			histroyPage.style.display = 'none'
		}
	}

	//遮罩层样式
	mask.className = 'mask'

	let road_refresh = false;
	//点击打开详细信息页面
	const detaBg = sd.querySelector('.setpage .detail');
	let i = 0;
	const road_nth = sd.querySelector('.setDetail .road_nth');
	const road_nthTxt = sd.querySelector('.setDetail .road_nthTxt');
	//获取路径文本域
	const RoadTA = sd.querySelector('.setDetail>.clRoad .road_in');
	//加载详细页面
	detaBg.onclick = function () {
		if (road_refresh) {
			setDetail.style.display = 'block';
			road_refresh = false;
			stats_refresh(cl)

		}
		else if (setDetail.style.display == 'none') { setDetail.style.display = 'block'; }
		else { setDetail.style.display = 'none'; }
	}
	//获取路径 函数
	function road_get() {
		let clParent = cl.parentNode;
		let clRoad = '';
		if (cl.id != '') {
			clRoad = '>#' + cl.id;
		}else if(cl.className!=''){
            clRoad = '>.'+cl.classList[0];
        }
		else {
			clRoad = '>' + cl.tagName.toLowerCase();
		}
		while (clParent.tagName != 'BODY' && clParent) {
			if (clParent.id != '') {
				clRoad = '>#' + clParent.id + clRoad;
			}
			else if (clParent.className != '' && typeof clParent.className != 'object') {
				clRoad = '>.' + clParent.classList[0] + clRoad;
			}
			else {
				clRoad = '>' + clParent.tagName.toLowerCase() + clRoad;
			}
			clParent = clParent.parentNode;
		}
		clRoad = 'body' + clRoad;
		RoadTA.value = clRoad;
		if (cl.id != '') {
			road_nth.value = 1;
		} else {
			const clcp = document.querySelectorAll(clRoad)
			for (let j = 0; j < 100; j++) {
				if (clcp[j] == cl) {
					road_nth.value = j + 1;
					break;
				}
			}
		}
	}

	//路径点击选择后刷新cl和pob
	const road_slcBut = sd.querySelector('.setDetail>.clRoad .ckbut');
	const sl_tag = sd.querySelector('.setDetail>.sl_tag');
	let resl_tag;
	RoadTA.onkeydown = function (event) {
		if (event.key == 'Enter') {
			event.preventDefault();
			road_slcBut.click();
		}
	}
	road_slcBut.onclick = function () {
		if (RoadTA.value == '') {
			road_tag('路径为空', 'red');
			return;
		}
		const reg = /\w$/;
		if (!reg.test(RoadTA.value)) {
			road_tag('路径错误', 'red');
			return;
		}
		const cl_copy = document.querySelectorAll(RoadTA.value);
		const index=parseInt(road_nth.value)
		if (cl_copy == null) {
			road_tag('路径错误，该路径不存在元素', 'red');
		}else if (cl_copy.length < index) {
			road_tag(`相同路径下仅有${cl_copy.length}个元素，但当前要获取第${road_nth.value}个元素`, 'red',3000);
		}
		else {
			cl = cl_copy[index - 1];
			road_tag('选择成功', '#4ac45b');
			select(cl)
			console.log(cl)
		}
	}
	function road_tag(text, color,time=2000) {
		clearTimeout(resl_tag)
		sl_tag.innerText = text;
		sl_tag.style.transitionDuration = '0s';
		sl_tag.style.backgroundColor = color;
		sl_tag.style.opacity = '1';
		resl_tag = setTimeout(function () {
			sl_tag.innerText = '选择提示';
			sl_tag.style.transitionDuration = '1s';
			sl_tag.style.backgroundColor = '#ababab';
			sl_tag.style.opacity = '0.3';
		}, time)
	}
	//点击按钮开始选择元素
	let cl=null;
	pobut.addEventListener("click", function (event) {
		if(event.button==0){
			nowS = +new Date();
			if (nowS - nowTime < 200) {
				event.stopPropagation();
				//打开检测
				if (flag) {
					this.innerText = "关";
					this.style.backgroundColor = "red"
					closeSet();
					flag = false;
					mask.style.display = "block";
					document.addEventListener("mousemove", detect);
					mask.addEventListener("click", openSet, true);
				}
				//关闭检测
				else {
					poclose();
					mask.style.display = "none";
				}
			}
		}
	});
	pobut.addEventListener('contextmenu', function (event) {
		event.preventDefault();
		if (setpage.style.display != 'block') {
			openSet(event);
		}
		//关闭检测
		else {
			dtCloSet(event);
			poclose();
			mask.style.display = "none";
		}
	});
	//移动按钮菜单位置
	let moFlag = false, mouseOffsetY, nowTime, nowS;
	pobut.addEventListener("mousedown", function (event) {
		if(event.button==0){
			moFlag = true;
			nowTime = +new Date();
			mouseOffsetY = event.clientY - seledom.offsetTop;
		}
	});
	document.documentElement.addEventListener("mouseup", function () {
		moFlag = false;
	});
	document.documentElement.addEventListener('mousemove', function (e) {
		if (moFlag) {
			seledom.style.top = e.clientY - mouseOffsetY + 'px';
		}
	})
	//获取属性窗口
	const stats_show = sd.querySelector('.setDetail .css_diy');
	//获取相应属性并生成editor-div 函数
	function gStats(stats, clin = cl) {
		if(clin==null){
			return;
		}
		const divcs = document.createElement('editor-div');
		stats_show.insertBefore(divcs, stats_show.children[0]);
		let incs = document.createElement('input');
		divcs.appendChild(incs);
		incs.value = stats;
		incs = document.createElement('input');
		divcs.appendChild(incs);
		incs.value = clin[stats];
		incs = document.createElement('button');
		incs.innerText = '√';
		incs.title = '确定';
		incs.style.visibility = 'hidden';
		divcs.appendChild(incs);
	}
	//刷新属性 函数
	function stats_refresh(clin) {
		stats_show.innerHTML = ''
		statArry.forEach(function (ca) {
			gStats(ca, clin)
		});
	}
	//搜索属性
	const stat_serch_in = sd.querySelector('.setDetail .serch .serchin');
	const stat_serch_but = sd.querySelector('.setDetail .serch button');
	stat_serch_but.onclick = function () {
		StatsSerch();
	}
	stat_serch_in.onkeydown = function (event) {
		if (event.key == 'Enter') {
			StatsSerch();
		}
	}
	//开始搜索属性
	let stat_recs_tag;
	const stat_poptag = sd.querySelector('.setDetail .poptag');
	function StatsSerch() {
		if (stat_serch_in.value != '') {
			if (cl[stat_serch_in.value] == undefined) {
				Detailpage_tag('未找到该属性');
				return;
			}
			let uilen = stats_show.children.length;
			let uicd;
			for (let i = 0; i < uilen; i++) {
				uicd = stats_show.children[i];
				if (uicd.children[0].value == stat_serch_in.value) {
					stats_show.insertBefore(uicd, stats_show.children[0])
					stat_serch_in.value = '';
					return;
				}

			}
			gStats(stat_serch_in.value)
			stat_serch_in.value = '';
		}
	}
	//设置页面显示错误 函数
	function Detailpage_tag(text, time = 1000) {
		stat_poptag.innerText = text;
		clearTimeout(stat_recs_tag);
		stat_poptag.style.display = 'block';
		stat_recs_tag = setTimeout(function () { stat_poptag.style.display = 'none'; }, time)
	}
	//判断是否修改了该属性
	stats_show.onkeydown = function (e) {
		e.target.parentNode.children[2].style.visibility = 'visible';
		e.target.parentNode.classList.remove('st_edit');
	}
	//点击确定修改该属性
	stats_show.onclick = function (e) {
		if (e.target.tagName == 'BUTTON') {
			e.target.parentNode.classList.add('st_edit');
			e.target.style.visibility = 'hidden';
		}
	}

	//将获取的元素打印在设置页面上
	const clhtml = setpage.getElementsByClassName('clhtml')[0].getElementsByClassName('content')[0];

	//获取样式窗口
	const userin = sd.querySelector('.setpage .css_diy');
	//获取css样式
	let getCSS;
	//获取相应样式并生成editor-div 函数
	function gCCSS(stats) {
		const divcs = document.createElement('editor-div');
		userin.insertBefore(divcs, userin.children[0]);
		let incs = document.createElement('input');
		divcs.appendChild(incs);
		incs.value = stats;
		incs = document.createElement('input');
		divcs.appendChild(incs);
		incs.value = getCSS[stats];
		incs = document.createElement('button');
		incs.innerText = '√';
		incs.title = '确定';
		incs.style.visibility = 'hidden';
		divcs.appendChild(incs);
	}
	//刷新css样式 函数
	function css_refresh(clin) {
		userin.innerHTML = '';
		//获取css样式
		getCSS = getComputedStyle(clin);
		cssAry.forEach(function (ca) {
			if (getCSS[ca] != '') {
				gCCSS(ca);
			}
			if (ca == 'position' && getCSS[ca] != 'statci') {
				let Lcase = '';
				for (let i = 0; i < 4; i++) {
					Lcase = cssPos[i].toLowerCase();
					if (getCSS[Lcase] != 'auto') {
						gCCSS(Lcase)
					}
				}
			}
			else if (ca == 'border') {
				let Lcase = '';
				for (let i = 0; i < 4; i++) {
					if (getCSS[ca + cssPos[i]] != '0px none rgb(0, 0, 0)') {
						Lcase = cssPos[i].toLowerCase();
						gCCSS(ca + cssPos[i]);
					}
				}
			}
		});
	}
	const cl_text_onlt = sd.querySelector('.setpage>.but_text>#txet_only')
	//为是否只显示文本绑定事件
	cl_text_onlt.onclick = function () {
		clhtml_refresh(cl)
	}

	//刷新在clhtml中显示的元素内容
	function clhtml_refresh(clin = cl) {
		if (cl_text_onlt.checked) {
			clhtml.textContent = clin.textContent
		}
		else {
			clhtml.textContent = clin.outerHTML
		}
	}

	//为clhtml添加功能按键
	const clh_span = sd.querySelector('.setpage>.but_text')
	clh_span.onclick = function (e) {
		if (e.target.className == 'clipboard') {
			navigator.clipboard.writeText(clhtml.innerText)
		}
	}

	//用户选中后打开设置页面
	function openSet(event) {
		clearTimeout(close_time);
		console.log(cl);

		road_refresh = true;
		document.documentElement.addEventListener("click", dtCloSet);
		document.removeEventListener("mousemove", detect);
		event.preventDefault();
		event.stopPropagation();
		setpage.style.display = 'block';
		setpage.style.width = setpage_width;
		setpage.style.boxShadow = "0 0 2px 1px rgba(170, 224, 240)";
		pobut.style.opacity = 1;
		if(cl==null){
			return false;
		}
		//刷新css样式
		css_refresh(cl)
		road_get()
		//刷新展示元素样式
		setTimeout(function () { clhtml_refresh(cl) }, 0)
		poclose();
		return false;
	}
	//将按钮设置为关闭状态 函数
	function poclose() {
		pobut.innerText = "开";
		pobut.style.backgroundColor = "white";
		flag = true;
		mask.removeEventListener("click", openSet, true);
	}
    let isThrottled = false;
	//实时侦测遮罩层
	function detect(e) {
		if (!flag&&!isThrottled) {
      		isThrottled = true;
			requestAnimationFrame(() => {
				isThrottled = false;
				const elements = document.elementsFromPoint(e.clientX, e.clientY);
				const targetElement = elements.find(el => el !== seledom);
				if (targetElement) {
					if(targetElement==cl){
						return;
					}
				  	cl = targetElement;
					mask.style.display = 'block';
				  	pobSet(cl);
				} else {
				  mask.style.display = 'none';
				}
			  });
		}
	}
	//监听窗口滚动，更新遮罩层
    window.addEventListener('scroll', () => {
		if (!isThrottled&&mask.style.display=='block') {
			isThrottled = true;
			requestAnimationFrame(() => {
				isThrottled = false;
		  		pobSet(cl);
			});
		}
	  });
	//设定遮罩层宽高函数
	function pobSet(target) {
		const rect = target.getBoundingClientRect();
		mask.style.display = 'block';
      	mask.style.left = rect.left + 'px';
      	mask.style.top = rect.top + 'px';
      	mask.style.width = rect.width + 'px';
      	mask.style.height = rect.height + 'px';
	}
	//点击别处收起设置页面函数
	function dtCloSet(event) {
		if(event.target.id=="selectDom"){
			return;
		}
		if (setpage.style.width != '0') {
			closeSet();
			mask.style.display = "none";
		}
		document.documentElement.removeEventListener("click", dtCloSet);
	}
	let setbut = setpage.getElementsByClassName('but')[0];
	//绑定确定按钮事件
	setbut.onclick = function () {
		editDom();
	}
	//对选中的元素进行操作
	function editDom() {
		const user_check = sd.querySelectorAll('.setpage input');
		const uist = sd.querySelectorAll('.setDetail .css_diy>.st_edit');
		const target_css = {}, target_stats = {}
		let is_remove = false
		if (user_check[2].checked) {
			cl.remove();
			is_remove = true
		}
		else if (user_check[3].checked) {
			if(cl.style.visibility != 'hidden'){
				cl.style.visibility = 'hidden';
				target_css['visibility'] = 'hidden'
			}else{
				cl.style.visibility = 'visible';
				target_css['visibility'] = 'visible'
			}
		}
		//关闭所有计时器
		else if (user_check[4].checked) {
			let iclock = setInterval(function () { }, 0)
			for (let ind = 0; ind < iclock; ind++) {
				clearInterval(ind)
			}
			iclock = setTimeout(function () { }, 0)
			for (let ind = 0; ind < iclock; ind++) {
				clearTimeout(ind)
			}
			closeSet();
			mask.style.display = "none";
			return;
		}
		else if (user_check[5].checked) {
			//将输入的样式赋给元素！！！
			const uics = sd.querySelectorAll('.setpage .css_diy>.edit');
			let uil = uics.length;
			for (let uilen = 0; uilen < uil; uilen++) {
				if (cl.style[uics[uilen].children[0].value] == undefined) {
					setpage_tag('样式名有误');
					uics[uilen].children[2].style.visibility = 'visible';
					uics[uilen].classList.remove('edit');
					return;
				}
				const c_name = uics[uilen].children[0].value, c_value = uics[uilen].children[1].value
				cl.style[c_name] = c_value;
				target_css[c_name] = c_value
			}
		}
		else if (uist.length == 0) {
			setpage_tag('未选择操作');
			return;
		}
		//将输入的属性赋给元素！！！
		if (uist.length != 0) {
			let utl = uist.length;
			for (let ind = 0; ind < utl; ind++) {
				if (cl[uist[ind].children[0].value] == undefined) {
					Detailpage_tag('属性名有误');
					uist[ind].children[2].style.visibility = 'visible';
					uist[ind].classList.remove('st_edit');
					return;
				}
				const s_name = uist[ind].children[0].value, s_value = uist[ind].children[1].value
				try {
					cl[s_name] = s_value;
				}
				catch (err) {
					Detailpage_tag("属性值有误\n标签名不可修改", 2000);
					uist[ind].children[2].style.visibility = 'visible';
					uist[ind].classList.remove('st_edit');
					return
				}
				target_stats[s_name] = s_value
			}
		}
		//创建目标对象
		const targetE = new targetElement(cl, RoadTA.value, parseInt(road_nth.value), cl.outerHTML.substring(0, 30), target_css, target_stats, is_remove)
		//判断是否选择为记忆操作
		if (user_check[1].checked) {
			let s_exist = false
			const local_len = local_targetAll.length
			for (let ind = 0; ind < local_len; ind++) {
				if (local_targetAll[ind].target == targetE.target) {
					local_targetAll[ind] = targetE
					copy_local[ind]=new targetElement(null,targetE.road,targetE.road_index,targetE.detail,targetE.css,targetE.stats,targetE.is_remove)
					s_exist = true
					break
				}
			}
			if (!s_exist) {
				local_targetAll[local_targetAll.length] = targetE
				copy_local[copy_local.length]=new targetElement(null,targetE.road,targetE.road_index,targetE.detail,targetE.css,targetE.stats,targetE.is_remove)
			}

			//存储本次操作
			localStorage.setItem('eEdit_local_targetAll', JSON.stringify(copy_local))
			local_is_refresh=true
		}

		//判断短期元素列表中是否有该元素，若有，则进行覆盖
		const session_len = session_targetAll.length
		let s_exist = false
		for (let ind = 0; ind < session_len; ind++) {
			if (session_targetAll[ind].target == targetE.target) {
				session_targetAll[ind] = targetE
				s_exist = true
				break
			}
		}
		if (!s_exist) {
			session_targetAll[session_targetAll.length] = targetE
		}
		setpage_tag('操作成功','#4ac45b');
		histroy_is_refresh = true;
		pobSet(cl);
	}
	//搜索样式
	const serch_in = sd.querySelector('.setpage .serch .serchin');
	const serch_but = sd.querySelector('.setpage .serch button');
	serch_but.onclick = function () {
		CssSerch();
	}
	serch_in.onkeydown = function (event) {
		if (event.key == 'Enter') {
			CssSerch();
		}
	}
	//开始搜索样式
	let recs_tag;
	const poptag = sd.querySelector('.setpage .poptag');
	function CssSerch() {
		if (serch_in.value != '') {
			if (getCSS[serch_in.value] == undefined) {
				setpage_tag('未找到该样式');
				return;
			}
			let uilen = userin.children.length;
			let uicd;
			for (let i = 0; i < uilen; i++) {
				uicd = userin.children[i];
				if (uicd.children[0].value == serch_in.value) {
					userin.insertBefore(uicd, userin.children[0])
					serch_in.value = '';
					return;
				}

			}
			gCCSS(serch_in.value)
			serch_in.value = '';
		}
	}
	//设置页面显示错误 函数
	function setpage_tag(text,color='red') {
		poptag.innerText = text;
		clearTimeout(recs_tag);
		poptag.style.backgroundColor = color;
		poptag.style.boxShadow=`0 0 2px 1px ${color}`;
		poptag.style.display = 'block';
		recs_tag = setTimeout(function () { poptag.style.display = 'none'; }, 1000)
	}
	userin.onkeydown = function (e) {
		e.target.parentNode.children[2].style.visibility = 'visible';
		e.target.parentNode.classList.remove('edit');
	}
	userin.onclick = function (e) {
		if (e.target.tagName == 'BUTTON') {
			e.target.parentNode.classList.add('edit');
			e.target.style.visibility = 'hidden';
		}
	}

	let close_time;
	//收起设置页面 函数
	function closeSet() {
		clhtml.textContent = ''
		setpage.style.width = '0';
		setDetail.style.display = 'none';
		pobut.style.opacity = 0.3;
		setpage.style.boxShadow = "0 0 0 0 blue";
		histroyPage.style.display = 'none'
		close_time = setTimeout(function () { setpage.style.display = 'none'; }, 500);
		road_nth.value = 1;
		userin.innerHTML = '';
		stats_show.innerHTML = ''
		mask.style.width="0"
		mask.style.height="0"
		//重置单选按钮
		const user_check = sd.querySelectorAll('.setpage input[type="radio"]')
		for (let ind = 0; ind < user_check.length; ind++) {
			user_check[ind].checked=false
		}
	}

	//选中某元素
	function select(clin) {
		cl = clin
		css_refresh(clin)
		clhtml_refresh(clin)
		stats_refresh(clin)
		pobSet(clin);
	}

	//在页面加载后从记忆列表中读取信息并对元素进行操作
	window.addEventListener('load',function(){
		if (localStorage.getItem('eEdit_local_targetAll') != null) {
			local_targetAll = JSON.parse(localStorage.getItem('eEdit_local_targetAll'))
			local_targetAll.forEach((ele)=>{
				ele.target=document.querySelectorAll(ele.road)[ele.road_index-1]
			})
		}
		//拷贝新数组，用于本地存储
				local_targetAll.forEach((ele)=>{
					copy_local[copy_local.length]=new targetElement(null,ele.road,ele.road_index,ele.detail,ele.css,ele.stats,ele.is_remove)
				})
		console.log('本地数据读取：(url:'+location.href+')')
		console.log(local_targetAll)

		local_targetAll.forEach((ele)=>{
			if(ele.is_remove){
				ele.target.remove()
			}
			else{
				for(let key in ele.css){
					ele.target.style[key]=ele.css[key]
				}
				for(let key in ele.stats){
					ele.target[key]=ele.stats[key]
				}
			}
		})
	})

})();