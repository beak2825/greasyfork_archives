// ==UserScript==
// @name         GM工具优化
// @namespace    http://tampermonkey.net/
// @version      1.0.25
// @description  优化GM工具功能，加入各种便利性功能。
// @author       JMRY
// @match        http://*/tank_gm/*
// @match        http://*/test_gm_index/*
// @match        http://*/gm_bigship/*
// @match        http://*/bigship/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @require      https://update.greasyfork.org/scripts/422934/1343270/JQuery%20DOM.js
// @downloadURL https://update.greasyfork.org/scripts/458158/GM%E5%B7%A5%E5%85%B7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/458158/GM%E5%B7%A5%E5%85%B7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/*
- 1.0.25 20250813
    - 优化活动服务器的填写逻辑。
- 1.0.24 20250714
    - 优化充值按钮字体显示效果。
- 1.0.23 20250711
    - 调整一键检测窗口为浮动窗口。
- 1.0.22 20250701
    - 更新道具表映射。
- 1.0.21 20250627
    - 优化自动检测服务器的逻辑，加入UID和服务器ID非对应时的自动记忆功能。
    - 优化活动服务器填写规则。
- 1.0.20 20250617
    - 加入军阵的一键检测和清空功能。
- 1.0.19 20250512
    - 优化一键检测道具，持有大于目标时的颜色效果。
- 1.0.18 20250417
    - 优化超级武器一键加满功能数量（99→10）。
- 1.0.17 20250415
    - 优化配件页面显示效果。
- 1.0.16 20250107
    - 充值支持自定义名称。
- 1.0.15 20241220
    - 修复一些bug。
- 1.0.14 20241216
    - 一键支付功能适配舰队GM。
- 1.0.13.3 20241203
    - 修复部分地址无法自动填写用户名密码的bug。
- 1.0.13.2 20241121
    - 修复自动填写用户名偶尔会失败的bug。
- 1.0.13.1 20241101
    - 加入自动填写用户名密码功能。
- 1.0.13 20241031
    - 开启当天活动支持207、正版993服。
    - 优化活动服务器自动勾选填写功能，支持正版993、994服自动勾选填写。
    - 优化小窗功能API。
- 1.0.12 20241029
    - 一键调号功能加入添加常用背包道具功能。
- 1.0.11 20241025
    - 加入一键检测和一键清空军旅宿舍道具功能。
    - 军旅宿舍道具名同步。
    - 优化坦克类型显示效果。
- 1.0.10.1 20241024
    - 军旅宿舍一键加满支持任意数量。
- 1.0.10 20241023
    - 重写小窗功能。
    - 重写LOG弹窗功能。
    - 加入点击弹窗内页面激活弹窗功能。
    - 优化小窗拖放体验，防止拖放超出可视区域。
    - 修复小窗拖动时，会失去焦点的bug。
- 1.0.9 20241014
    - 加入一键加满指定军装功能。
    - 加入军旅宿舍相关功能。
    - 加入全功能小窗功能。
- 1.0.8.1 20241009
    - 加入小窗打开页面功能。
- 1.0.8 20240924
    - 加入连续充值功能。
- 1.0.7.4 20240920
    - 优化自定义支付在小窗中的显示效果。
- 1.0.7.3 20240911
    - 加入一键升满VIP功能。
- 1.0.7.2 20240830
    - 加入一键添加常用道具功能。
    - 修复应用活动配置时，保存按钮无法聚焦的bug。
- 1.0.7.1 20240828
    - 优化配件强化改造意见加满在有晋升时的数值。
    - 调整配件强化改造和坦克研发中心一键保存消息显示效果。
- 1.0.7 20240827
    - 加入一键调号功能。
- 1.0.6.2 20240823
    - 适配坦克配件参数。
    - 修复配件一键保存URL错误的bug。
- 1.0.6.1 20240822
    - 优化配件一键功能，防止填写错误内容。
- 1.0.6 20240819
    - 优化自定义支付功能，加入排序、删除确认等功能。
    - 调整自定义支付为双击支付。
    - 自定义支付功能适配舰队GM。
- 1.0.5
    - 分拆样式表为各组件单独管理。
- 1.0.4
    - 加入配件强化改造一键保存功能。
    - 疯狂小队一键加满道具去除对镐头的修改。
- 1.0.3
    - 加入配件碎片一键添加功能。
    - 部队优化适配舰队战舰类型。
- 1.0.2
    - 配件加入七彩品质。
    - 优化自动保活功能算法。
    - 修复道具ID在切换分类后不显示的bug。
- 1.0.1
    - 加入活动列表弹窗。
    - 优化一键检测道具显示效果。
    - 补充道具映射表。
    - 修复一键检测背包功能，道具后带空格时无法识别的bug。
- 1.0
    - 加入支付队列和一键支付功能。
    - 加入显示工具窗口功能。
- 0.9.15
    - 加入资源检测和清空功能。
    - 加入补给舰经验和补给舰科技的检测和清空功能。
    - 去除加VIP和VIP点数功能（VIP点数存在bug，无法清空，因此不再添加，仅有需要时手动添加）。
- 0.9.14
    - 优化自动移除用户ID只读功能算法。
- 0.9.13
    - 加入坦克ID和坦克类型显示功能。
- 0.9.12
    - 加入道具ID显示功能。
- 0.9.11
    - 加入会话自动保活功能。
- 0.9.10
    - 加入军徽和超级武器一键加满和清空功能。
- 0.9.9.9
    - 修复输入UID时无法被记忆的bug。
- 0.9.9.8
    - 修复特定情况下，输入UID无法被记忆的bug。
- 0.9.9.7
    - 加入补给舰相关功能。
- 0.9.9.6
    - 加入分渠道记忆UID功能。
    - 加入线上开启当天活动功能。
- 0.9.9.5
    - 优化活动录入逻辑，自动聚焦提交按钮。
- 0.9.9.4
    - 加入欧洲杯页面优化。
- 0.9.9.3
    - 丰富检测结果的颜色显示。
    - 兼容多种配置单写法。
    - 回调提交内容分多次进行的优化，修复count error问题。
- 0.9.9.2
    - 适配舰队GM。
    - 优化一键清空背包功能，将提交内容分为多次进行，避免超长。
- 0.9.9.1
    - 加入背包检测记忆功能。
    - 优化一键清空背包功能算法，提升性能。
    - 优化背包检测算法，提升性能。
    - 修复战争飞艇缺少部分道具的bug。
    - 修复背包检测窗口关闭时报错的bug。
- 0.9.9
    - 加入一键检测背包功能。
- 0.9.8.5
    - 加入自动填写活动开启器时间功能。
    - 加入自动计算活动开启天数功能。
- 0.9.8.4
    - 优化一键清空所有系统文字显示。
- 0.9.8.3
    - 优化飞艇等阶和等级算法。
    - 疯狂坦克一键功能加入佣兵经验。
- 0.9.8.2
    - 加入坦克大冒险相关功能。
    - 自动检测服务器功能加入线上GM警告。
    - 优化自动检测服务器功能逻辑。
- 0.9.8.1
    - 加入输入框变更时边框标红功能。
    - 修复坦克研发中心一键加满/清空偏移错误的bug。
- 0.9.8
    - 加入一键添加配件功能。
- 0.9.7
    - 加入一键关闭所有活动功能。
- 0.9.6
    - 加入一键清空所有系统背包功能。
- 0.9.5.1
    - 修复坦克研发中心未开启系统时不兼容的bug。
- 0.9.5
    - 加入一键加满、清空资源功能。
    - 加入坦克研发中心的相关优化功能。
- 0.9.4.1
    - 修复服务器id为zoneid时，自动选取服务器失效的bug。
- 0.9.4
    - 自动检测服务器功能，在UID不对应区服时不写入val。
- 0.9.3
    - 自动录入活动点击按钮后，自动隐藏提示信息。
    - 将模态提示框、确认框改为原生alert、confirm。
- 0.9.2
    - 加入将领检索功能。
- 0.9.1
    - 优化活动自动填写录入项体验。
- 0.9
    - 加入活动开始、结束时间自动记忆功能。
    - 加入军装、组件功能一键加满、清空功能。
    - 活动录入时，自动填写后，添加按钮加焦点。
    - 优化代码结构。
- 0.8.7.2
    - 优化活动自动录入功能，在首尾有空格时将其去除。
- 0.8.7.1
    - 活动配置数自动应用的按钮加焦点。
- 0.8.7
    - 加入活动配置数自动应用功能。
- 0.8.6
    - 加入指挥官历程和战争传记允许调0功能。
- 0.8.5
    - 修复无法清空UID输入框的bug。
- 0.8.4
    - 恢复VIP相关加成。
- 0.8.3
    - 加入舰队相关内容。
    - 调整舰队的等级、统率等为150级。
- 0.8.2
    - 加入移除输入框禁用功能。
- 0.8.1
    - 加入在UID输入框空白时，自动填写上次使用的UID功能。
- 0.8
    - 加入用户信息、背包、部队一键加满和一键清空功能。
    - 调整疯狂坦克一键加满的铜币数量。
    - 修复部分页面自动检测服务器未生效的bug。
- 0.7.1
    - 一键清空过滤镐头，防止出现bug。
- 0.7
    - 加入飞艇等阶、等级、经验最大值提示。
    - 一键升满加入升满飞艇功能。
- 0.6
    - 修复旧版GM工具上运行会报错的bug。
- 0.5
    - 加入飞艇经验、等阶、等级计算功能。
- 0.4
    - 更新最大任务id。
- 0.3
    - 加入自动识别服务器zid功能。
- 0.2
    - 加入疯狂坦克用户信息一键升满功能。
- 0.1
    - 加入活动录入自动识别功能。
*/

String.prototype.replaceAll = function(org,tgt){
    return this.split(org).join(tgt);
}
String.prototype.insert = function(start, newStr) {
    return this.slice(0, start) + newStr + this.slice(start);
};
Date.prototype.format = function(fmt) {
  function getYearWeek(date) {
    var date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    var date2 = new Date(date.getFullYear(), 0, 1);

    //获取1月1号星期（以周一为第一天，0周一~6周日）
    var dateWeekNum = date2.getDay() - 1;
    if (dateWeekNum < 0) {
      dateWeekNum = 6;
    }
    if (dateWeekNum < 4) {
      //前移日期
      date2.setDate(date2.getDate() - dateWeekNum);
    } else {
      //后移日期
      date2.setDate(date2.getDate() + 7 - dateWeekNum);
    }
    var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
    if (d < 0) {
      var date3 = new Date(date1.getFullYear() - 1, 11, 31);
      return getYearWeek(date3);
    } else {
      //得到年数周数
      var year = date1.getFullYear();
      var week = Math.ceil((d + 1) / 7);
      return week;
    }
  }

  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
    "W+": getYearWeek(this), //周数
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  return fmt;
};
Number.prototype.az = function(n = 2) {
    let s = "";
    for (let i = 1; i < n; i++) {
        s += '0';
    }
    return (s + this).slice(-1 * n);
}

let currentServerTime;
function receiveWindowMessage(){
    window.addEventListener(`message`, function(event) {
        if (event.data && event.data.type === `FROM_WINDOW`) {
            switch(event.data.data.type){
                case `TIME`:
                    currentServerTime=event.data.data.data;
                    console.log(currentServerTime);
                break;
            }
        }
    });
}

// 计算指定时间是星期几
function getWeekday(date){
   // date例如:'2022-03-05'
    var weekArray = new Array("星期日","星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
    var week  = weekArray[new Date(date).getDay()]
    return week
}

function urlMatch(str){
    let url=window.location.href;
    return url.includes(str);
}

function urlSearch(key){
    let s=window.location.search;
    s=s.replace(`?`,``);
    let sp=s.split(`&`);
    let so={};
    for(let sr of sp){
        let d=sr.split(`=`);
        so[d[0]]=d[1];
    }
    if(!key){
        return so;
    }else{
        return so[key];
    }
}

function getGM(){
    let gml=[
        urlSearch(`gm`),
        $(`#gm`).val(),
        $(`input[name=gm]`).val(),
        document.referrer.split(`gm=`)[1],
    ];
    for(let g of gml){
        if(g){
            customGMData.lastGM=g;
            saveStorage();
            return g;
        }
    }
    return customGMData.lastGM;
}

let customGMData={};
function loadStorage(){
    let cd=localStorage.getItem(`customGMData`);
    if(cd==null){
        customGMData={};
    }else{
        customGMData=JSON.parse(cd);
    }
}

function saveStorage(){
    localStorage.setItem(`customGMData`,JSON.stringify(customGMData));
}

let innerZIndex=100000;
class OpenWindow{
    constructor(name, url, args){
        this.name=name;
        this.url=url;
        this.args={
            ...{
                width:640,
                height:480,
                x:192,
                y:86,
            },
            ...args,
        };
		this.setStyle();
        this.iframe=this.createWindow();
    }
	setStyle(){
		if(findCustomStyle(`.innerWindow`)<0){
			setCustomStyle([
				{name:`.innerWindow`,style:`
					position:fixed;
					background:#FFF;
					border:5px solid #438eb9;
					border-top:none;
					overflow:hidden;
					box-shadow:0px 0px 5px #000;
					transition: width 0.25s ease, height 0.25s ease;
				`},
				{name:`.innerWindow.min`,style:`
					width:192px !important;
					height:32px !important;
				`},
				{name:`.innerWindow.min .innerTitle`,style:`
					padding-right:calc(32px * 3);
				`},
				{name:`.innerTitle`,style:`
					position: absolute;
					top: 0px;
					left: 0px;
					right: 0px;
					height: 32px;
					line-height: 32px;
					text-align: center;
					vertical-align: middle;
					font-size: 16px;
					background: #438eb9;
					color: #FFF;
					user-select:none;
					transition:all 0.25s ease;
					cursor:move;
				`},
				{name:`.innerMinBu`,style:`
					position:absolute;
					top:0px;
					right:64px;
					width:32px;
					height:32px;
					font-size: 20px;
					background:transparent;
					border:none;
					color:#FF0;
				`},
				{name:`.innerMaxBu`,style:`
					position:absolute;
					top:0px;
					right:32px;
					width:32px;
					height:32px;
					font-size: 20px;
					background:transparent;
					border:none;
					color:#0FF;
				`},
				{name:`.innerCloseBu`,style:`
					position:absolute;
					top:0px;
					right:0px;
					width:32px;
					height:32px;
					font-size: 20px;
					background:transparent;
					border:none;
					color:#F00;
				`},
				{name:`.innerFrame`,style:`
					position:absolute;
					top:32px;
					width:100%;
					height:calc(100% - 32px);
					border:none;
				`},
			]);
		}
	}
    createWindow(){
        let self=this;
        let name=this.name;
        let url=this.url;
        let args=this.args;
        $(`#innerWindow_${name}`).remove();
		if(url!==undefined){
			$(`body`).appendDOM({tag:`div`,id:`innerWindow_${name}`,class:`innerWindow ${args.min==true?`min`:``}`,style:{
				width:`${args.width+10}px`,height:`${args.height+10}px`,left:`${args.x}px`,top:`${args.y}px`,zIndex:innerZIndex,
                opacity:args.opacity || 1,
                visibility:args.visible==false?`hidden`:`visible`,
			},children:[
				{tag:`div`,id:`innerTitle_${name}`,class:`innerTitle`,html:name},
				{tag:`button`,class:`innerMinBu`,html:`-`,bind:{click(){self.min()}}},
				{tag:`button`,class:`innerMaxBu`,html:`▣`,bind:{click(){self.open()}}},
				{tag:`button`,class:`innerCloseBu`,html:`×`,bind:{click(){self.close()}}},
				{tag:`${url!=null?`iframe`:`div`}`,id:`innerFrame_${name}`,class:`innerFrame`,src:url},
			]});
			innerZIndex++;

			this.draggable = document.getElementById(`innerTitle_${name}`);
			this.dragWindow= document.getElementById(`innerWindow_${name}`);
			this.dragFrame = document.getElementById(`innerFrame_${name}`);

            this.dragFrame.onload=()=>{ // iframe内页面绑定事件，提升zIndex让窗口置顶。对跨域页面无效。
                this.dragFrame.contentWindow.addEventListener(`mousedown`, (e)=>{
				this.dragWindow.style.zIndex=innerZIndex++;
			});
            }

			this.active = false;
			this.currentX=0;
			this.currentY=0;
			this.initialX=0;
			this.initialY=0;
			this.initialWindowX=0;
			this.initialWindowY=0;

			this.dragWindow.addEventListener(`mousedown`, (e)=>{
				this.dragWindow.style.zIndex=innerZIndex++;
                if($(`.innerFrame`).is(`iframe`)){
                    $(`.innerFrame`).css(`pointer-events`,`none`); // 禁用ifram鼠标事件，防止拖放时鼠标进入iframe而失效
                }
			});
            this.dragWindow.addEventListener(`mouseup`, (e)=>{
                if($(`.innerFrame`).is(`iframe`)){
                    $(`.innerFrame`).css(`pointer-events`,`auto`);
                }
			});
			this.dragFrame.addEventListener(`mousedown`, (e)=>{
				this.dragWindow.style.zIndex=innerZIndex++;
			});
			this.draggable.addEventListener(`mousedown`, (e)=>{
				this.initialX = e.clientX - this.dragWindow.offsetLeft;
				this.initialY = e.clientY - this.dragWindow.offsetTop;
				this.initialWindowX = window.screenX;
				this.initialWindowY = window.screenY;
				this.active = true;
				this.dragWindow.style.zIndex=innerZIndex++;
			});
			window.addEventListener(`mousemove`, (e)=>{
				if (this.active) {
					this.currentX = e.clientX - this.initialX;
					this.currentY = e.clientY - this.initialY;
                    if(this.currentY<0){
                        this.currentY=0;
                    }else if(this.currentY>window.innerHeight-this.draggable.clientHeight){
                        this.currentY=window.innerHeight-this.draggable.clientHeight;
                    }
					this.dragWindow.style.left = `${this.currentX}px`;
					this.dragWindow.style.top  = `${this.currentY}px`;
				}
			});
			window.addEventListener(`mouseup`, (e)=>{
				this.active = false;
			});
			// 阻止选中文本
			this.draggable.addEventListener(`dragstart`, (e)=>{
				e.preventDefault();
			});
            return document.getElementById(`innerFrame_${name}`);
		}
    }
    setTitle(title){
        $(`#innerTitle_${this.name}`).html(title);
    }
    min(){
        $(`#innerWindow_${this.name}`).toggleClass(`min`);
        $(this.iframe).toggle();
    }
    open(){
        if(this.url){
            window.open(this.url);
        }
    }
    close(){
        $(`#innerWindow_${this.name}`).remove();
    }
}

class MsgWindow{
	constructor(title){
		this.title=title;
		this.setStyle();
		this.insertWindow();
	}
	setStyle(){
		setCustomStyle([
			{name:`.clearMsg`,style:`
				position:fixed;
				top:0px;
				left:0px;
				right:0px;
				bottom:0px;
				background:rgba(0,0,0,0.5);
				z-index:1000;
			`},
			{name:`.clearMsgWindow`,style:`
				position:absolute;
				top:0px;
				left:0px;
				right:0px;
				bottom:0px;
				width:60%;
				height:70%;
				margin:auto;
				background:#FFF;
				border-radius:5px;
				overflow:hidden;
			`},
			{name:`.clearMsgTitle`,style:`
				position:absolute;
				top:0px;
				left:0px;
				right:0px;
				height:48px;
				line-height:48px;
				text-align:center;
				vertical-align:middle;
				font-size:18px;
				background:#438eb9;
				color:#FFF;
			`},
			{name:`.clearMsgContent`,style:`
				position:absolute;
				top:calc(48px + 16px);
				left:48px;
				right:48px;
				bottom:64px;
				border:1px solid #CCC;
				border-radius:5px;
				padding:16px;
				overflow-y:auto;
			`},
			{name:`.clearMsgControl`,style:`
				position:absolute;
				left:0px;
				right:0px;
				bottom:0px;
				height:64px;
				line-height:64px;
				text-align:center;
				vertical-align:middle;
			`},
		]);
	}
	insertWindow(isShow=true){
		this.remove();
        const self=this;
		$(`body`).appendDOM(`div`,{
			id:`clearMsg`,class:`clearMsg hide`,children:[
				{tag:`div`,class:`clearMsgWindow`,children:[
					{tag:`div`,id:`msgTitle`,class:`clearMsgTitle`,html:this.title || ``},
					{tag:`div`,id:`msgContent`,class:`clearMsgContent`,html:``},
					{tag:`div`,id:`clearMsgControl`,class:`clearMsgControl`,children:[
						{tag:`button`,id:`hideBu`,class:`btn btn-primary`,html:`关闭`,disabled:true,bind:{click(e){
							self.remove();
						}}},
					]},
				]}
			]
		});
        this.show(isShow);
	}
	setTitle(title){
		this.title=title;
		$(`#msgTitle`).html(this.title);
	}
	show(bool){
		if(bool==undefined || bool==true){
			$(`#clearMsg`).removeClass(`hide`);
			$(`#clearMsg`).css(`display`,``);
			$(`#hideBu`).attr(`disabled`,true);
		}else{
			$(`#clearMsg`).addClass(`hide`);
			$(`#clearMsg`).css(`display`,`none`);
		}
	}
	enable(bool=true){
		if(bool){
			$(`#hideBu`).removeAttr(`disabled`);
		}else{
			$(`#hideBu`).attr(`disabled`,true);
		}
	}
	output(content){
		$(`#msgContent`).appendDOM(`p`,content);
		$(`#msgContent`)[0].scrollTop+=999999;
	}
	clear(){
		$(`#msgContent`).html(``);
	}
	remove(){
		$(`#clearMsg`).remove();
	}
}

function ajaxPromise(url, type=`GET`, post){
    return new Promise((resolve, reject)=>{
        $.ajax({
            url: url,
            type: type,
            data: post,
            success: function(rs){
                resolve(rs);
            },
            error: function(rs){
                reject(rs);
            }
        });
    });
    return new Promise((resolve, reject)=>{
        $.ajax({
            url: url,
            type: type,
            data: post,
            success: function(rs){
                resolve(rs);
            },
            error: function(rs){
                reject(rs);
            }
        });
    });
}

//插入自定义样式
function insertCustomStyle(){
    setCustomStyle([
        {name:`.changed`,style:`
            border-color:#F00 !important;
        `},
        {name:`body`,style:`
            overflow:auto !important;
        `},
        {name:`.subPageFrame`,style:`
            position:fixed;
            top:-999;
            left:-999;
            width:1px;
            height:1px;
            overflow:hidden;
        `},
    ]);
    //$(`head`).appendDOM(`style`,{id:`customStyle`,html:customStyle});
    //applyCustomStyle();
}

let customStyleObj=[];
function setCustomStyle(styleName, styleList, isApply=true){
    /*
    setCustomStyle(`.class1 .class2.class3`,[`background:transparent`]);
    setCustomStyle(`.class1 .class2.class3`,`background:transparent; border:1px solid #000`);
    setCustomStyle([
        {name:`.class1 .class2`,style:[`background:transparent`]},
        {name:`.class1 .class2`,style:`background:transparent; border:1px solid #000`},
    ]);
    */
    if(typeof styleName==`object` && styleName.length>0){
        for(let style of styleName){
            setCustomStyle(style.name, style.style, false);
        }
        applyCustomStyle();
        return true;
    }

    if(typeof styleList==`string`){
        let styleSplit=styleList.trim().split(`;`);
        styleList=[];
        for(let style of styleSplit){
            if(style.trim().slice(0,2)!=`//`) styleList.push(style.trim());
        }
    }

    let styleObj={name:styleName,style:styleList};
    let existIndex=findCustomStyle(styleName);
    if(existIndex>=0){
        customStyleObj[existIndex]=styleObj;
    }else{
        customStyleObj.push(styleObj);
    }
    if(isApply) applyCustomStyle();
    return true;
}

function removeCustomStyle(styleName){
    let existIndex=findCustomStyle(styleName);
    if(existIndex>=0){
        customStyleObj.splice(existIndex,1);
    }
    applyCustomStyle();
}

function findCustomStyle(styleName){
    for(let [i,style] of customStyleObj.entries()){
        if(style.name == styleName){
            return i;
        }
    }
    return -1;
}

function applyCustomStyle(){
    let styleList=[];
    for(let style of customStyleObj){
        styleList.push(`${style.name}{${style.style.join(`;`)}}`);
    }
    let styleStr=styleList.join(`\n`);
    $(`#customStyle`).remove();
    $(`head`).appendDOM(`style`,{id:`customStyle`,html:styleStr});
}

function removeUserDisabled(){
    $(`#uid`).removeAttr(`disabled`);
    $(`#name`).removeAttr(`disabled`);
    $(`#zid`).removeAttr(`disabled`);
    $(`#uid`).removeAttr(`readonly`);
    $(`#name`).removeAttr(`readonly`);
    $(`#zid`).removeAttr(`readonly`);
    console.log(`remove disabled and readonly.`);
}

function addObjectsMax(element, number){
    //element: jquery elements list, like: $(`table`).find(`input`)
    if(typeof element==`object` && element.length && element.length>0){
        for(let i=0; i<element.length; i++){
            element.eq(i).val(number).addClass(`changed`);
        }
    }
}

let loginInterval;
function importLogin(){
    let user=`lmh`;
    let pass=`lmh`;
    if(!urlMatch(`test_gm_index`) && !urlMatch(`devtank.raysns.com`)){
        return;
    }
    if(urlMatch(`/login`) || urlMatch(`/logout`) || $(`input[name=username]`).length>0){
        switch(true){
            case urlMatch(`gm_bigship`):{
                user=`zhoubing`;
                pass=`zhoubing`;
            }
            break;
        }
        loginInterval=setInterval(()=>{
            if(!$(`input[name=username]`).val() || !$(`input[name=password]`).val()){
                $(`input[name=username]`).val(user);
                $(`input[name=password]`).val(pass);
                $(`input[value=remember-me]`).prop(`checked`,true)
            }else{
                console.log(`Username and password inputed`);
                clearInterval(loginInterval);
            }
        },0);
    }
}

//用户信息优化
function addUserInfo(){
    //用户信息
    if(urlMatch(`user/userinfo`) && !urlMatch(`userinfo_`)){
        $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
            {tag:`button`,id:`onekeyMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键升满`,bind:{click(e){
                onekeyMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`onekeyMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键升满VIP`,bind:{click(e){
                onekeyMax(`vip`);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`onekeyZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                onekeyMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
        ]);
    }
    function onekeyMax(bool=true){
        //填写等级、金币等各种参数。
        if(bool==true || bool==`vip`){
            let userLevel, userTroops;
            switch(true){
                case urlMatch(`tank_gm`): case urlMatch(`test_gm_index`): //坦克
                    userLevel=120;
                    userTroops=120;
                break;
                case urlMatch(`gm_bigship`): //舰队
                    userLevel=150;
                    userTroops=150;
                break;
            }
            if(!urlMatch(`gm.rayjoy.com`)){ //线上账号不加金币，防止限制
                $(`#get_gems`).val(`999999999`).addClass(`changed`); //金币
            }
            $(`#get_level`).val(userLevel - parseInt($(`#level`).val())).addClass(`changed`); //等级
            $(`#get_rank`).val(20 - parseInt($(`#rank`).val())).addClass(`changed`); //军衔
            $(`#get_rp`).val(999999999999 - parseInt($(`#rp`).val())).addClass(`changed`); //军功
            if(bool==`vip`){
                $(`#get_vip`).val(15 - parseInt($(`#vip`).val())).addClass(`changed`); //VIP
                $(`#get_vippoint`).val(999999999999 - parseInt($(`#vippoint`).val())).addClass(`changed`); //VIP点数
            }
            $(`#get_honors`).val(999999999999 - parseInt($(`#honors`).val())).addClass(`changed`); //声望
            $(`#get_troops`).val(userTroops - parseInt($(`#troops`).val())).addClass(`changed`); //统率
            $(`#get_energy`).val(999999 - parseInt($(`#energy`).val())).addClass(`changed`); //能量
        }else{
            $(`#get_gems`).val(0 - parseInt($(`#gems`).val())).addClass(`changed`); //金币
            $(`#get_level`).val(1 - parseInt($(`#level`).val())).addClass(`changed`); //等级
            $(`#get_rank`).val(1 - parseInt($(`#rank`).val())).addClass(`changed`); //军衔
            $(`#get_rp`).val(0 - parseInt($(`#rp`).val())).addClass(`changed`); //军功
            $(`#get_vip`).val(0 - parseInt($(`#vip`).val())).addClass(`changed`); //VIP
            $(`#get_vippoint`).val(0 - parseInt($(`#vippoint`).val())).addClass(`changed`); //VIP点数
            $(`#get_honors`).val(0 - parseInt($(`#honors`).val())).addClass(`changed`); //声望
            $(`#get_troops`).val(1 - parseInt($(`#troops`).val())).addClass(`changed`); //统率
            $(`#get_energy`).val(0 - parseInt($(`#energy`).val())).addClass(`changed`); //能量
        }
        //滚动到提交位置
        $(`.btn.btn-primary.btn-sm`).eq(1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        $(`.btn.btn-primary.btn-sm`).eq(1).focus();
    }
}

function addUserResource(){
    if(urlMatch(`user/userinfo_resource`)){
        $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
            {tag:`button`,id:`onekeyMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                onekeyMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`onekeyZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                onekeyMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
        ]);
    }
    function onekeyMax(bool=true){
        //填写等级、金币等各种参数。
        let number;
        if(bool==true){
            number=99999999999999;
        }else{
            number=0;
        }
        addObjectsMax($(`input[name=gold], input[name=r1], input[name=r2], input[name=r3], input[name=r4]`), number);
        //$(`input[name=gold], input[name=r1], input[name=r2], input[name=r3], input[name=r4]`).val(number).addClass(`changed`);
        //滚动到提交位置
        $(`.btn.btn-primary.btn-sm`).eq(1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        $(`.btn.btn-primary.btn-sm`).eq(1).focus();
    }
}

//用户背包优化
let itemOftenList=[
    `扫荡令`,`统率书`,`大箱金币`,
    `火控核芯`,`聚变核芯`,`导航核芯`,`爆燃核芯`,`间谍雷达`,`精工石`,
    `荣誉勋章`,`精锐勋章`,`紫金勋章`,`铁十字勋章`,`战功勋章`,
    `德国科技能量`,`俄国科技能量`,`美国科技能量`,`中国科技能量`,`未鉴定的科技能量`,
    `传记印章`,`战略精要`,`熔炼核心`,
    `涂装图纸`,`改造图纸`,`强化图纸`,`战场喷漆`,
    `革新精要`,`进阶革新精要`,`液态合金`,
    `技能专精`,`高级技能专精`,
    `远征积分*100`,`竞技勋章*100`,`装备Exp*100`,`竞技Exp*100`,`战术Exp*100`,`纳米元件*100`,
];
function addUserBag(){
    function displayItemId(){
        // 道具id显示
        let inputReadonly=$(`input[readonly]`);
        for(let i=0; i<inputReadonly.length; i++){
            let curInput=inputReadonly.eq(i);
            let curId=curInput.attr(`id`);
            if(curId && curId.slice(0,3)==`get`){
                curInput.next().afterDOM({tag:`span`,html:` ${curId.split(`_`)[1]}`});
            }
        }
    }
    //用户道具
    if(urlMatch(`user/bag`)){
        $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
            {tag:`button`,id:`addItemMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                addItemMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`addItemZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`添加常用道具`,bind:{click(e){
                addItemMax(`often`);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`addItemZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`添加礼包道具`,bind:{click(e){
                addItemMax(`prize`);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`addItemZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                addItemMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
        ]);
        displayItemId();
        //覆盖原版函数，在选择分类后重新应用道具ID
        window.ajax_bag1=function(type) {
            var id = type;
            var zoneid = $("#zid").val();
            var uid = $("#uid").val();
            $.ajax({
                type: "post",
                data: "id=" + id + "&zid=" + zoneid + "&uid=" + uid,
                url: window.location.href.replaceAll(`/bag`,`/ajax_bag`), // 使用url替换法兼容坦克和舰队GM
                success: function(rs){
                    // ajax返回后，先应用内容，再应用ID
                    callback(rs); // callback为原版函数，用于生成页面道具列表
                    displayItemId();
                }
            });
        }
    }
    function addItemMax(bool=true){
        let itemList=$(`#bag_arr`).children(`tbody`).children(`tr`);
        let itemLength=itemList.length-1; //去除底部的空行和提交按钮
        for(let i=7; i<itemLength; i++){
            let itemInput=itemList.eq(i).children(`td`).eq(1).children(`input`).eq(1);
            let originValue=itemList.eq(i).children(`td`).eq(1).children(`input`).eq(0);
            let itemName=itemList.eq(i).children(`td`).eq(0).text().trim();
            switch(bool){
                case true:
                    itemInput.val(`999999`).addClass(`changed`);
                break;
                case false: default:
                    itemInput.val(`-${originValue.val()}`).addClass(`changed`);
                break;
                case `often`:
                    if(itemName && itemOftenList.includes(itemName)){
                        itemInput.val(`999999`).addClass(`changed`);
                    }
                break;
                case `prize`:
                    if(itemName && itemName.includes(`礼包`)){
                        itemInput.val(`999999`).addClass(`changed`);
                    }
                break;
            }
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(btnEl.length-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(btnEl.length-1).focus();
    }
}

//用户部队优化
function addUserTroops(){
    //用户部队
    if(urlMatch(`user/troops`)){
         $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
             {tag:`button`,id:`addTroopsMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                addTroopsMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`addTroopsZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                addTroopsMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}}
         ]);
        $(`.container`).css(`width`,`750px`);
        $(`#troop_table`).css(`width`,`auto`);

        // 坦克id和类型显示
        let tankType={
            a10001:[`坦克`,`战列舰`,1],
            a10002:[`坦克`,`战列舰`,2],
            a10003:[`坦克`,`战列舰`,3],
            a10004:[`坦克`,`战列舰`,4],
            a10005:[`坦克`,`战列舰`,5],
            a10006:[`坦克`,`战列舰`,6],
            a10007:[`坦克`,`战列舰`,7],
            a10008:[`坦克`,`战列舰`,8],
            a10009:[`坦克`,`战列舰`,9],
            a10011:[`歼击车`,`潜艇`,1],
            a10012:[`歼击车`,`潜艇`,2],
            a10013:[`歼击车`,`潜艇`,3],
            a10014:[`歼击车`,`潜艇`,4],
            a10015:[`歼击车`,`潜艇`,5],
            a10016:[`歼击车`,`潜艇`,6],
            a10017:[`歼击车`,`潜艇`,7],
            a10018:[`歼击车`,`潜艇`,8],
            a10019:[`歼击车`,`潜艇`,9],
            a10021:[`自行火炮`,`护卫舰`,1],
            a10022:[`自行火炮`,`护卫舰`,2],
            a10023:[`自行火炮`,`护卫舰`,3],
            a10024:[`自行火炮`,`护卫舰`,4],
            a10025:[`自行火炮`,`护卫舰`,5],
            a10026:[`自行火炮`,`护卫舰`,6],
            a10027:[`自行火炮`,`护卫舰`,7],
            a10028:[`自行火炮`,`护卫舰`,8],
            a10029:[`自行火炮`,`护卫舰`,9],
            a10031:[`火箭车`,`航空母舰`,1],
            a10032:[`火箭车`,`航空母舰`,2],
            a10033:[`火箭车`,`航空母舰`,3],
            a10034:[`火箭车`,`航空母舰`,4],
            a10035:[`火箭车`,`航空母舰`,5],
            a10036:[`火箭车`,`航空母舰`,6],
            a10037:[`火箭车`,`航空母舰`,7],
            a10038:[`火箭车`,`航空母舰`,8],
            a10039:[`火箭车`,`航空母舰`,9],
            a10103:[`歼击车`,`潜艇`,3],
            a10043:[`自行火炮`,`护卫舰`,5.5],
            a10053:[`歼击车`,`潜艇`,5.5],
            a10063:[`自行火炮`,`护卫舰`,5.5],
            a10073:[`坦克`,`战列舰`,5.5],
            a10082:[`火箭车`,`航空母舰`,5.5],
            a10093:[`坦克`,`战列舰`,5.5],
            a10113:[`歼击车`,`潜艇`,5.5],
            a10123:[`坦克`,`战列舰`,5.5],
            a10133:[`歼击车`,`潜艇`,5.5],
            a10143:[`歼击车`,`潜艇`,5.5],
            a10163:[`火箭车`,`航空母舰`,5.5],
            a10173:[`自行火炮`,`护卫舰`,5.5],
            a10104:[`歼击车`,`潜艇`,5.5],
            a10044:[`自行火炮`,`护卫舰`,6.5],
            a10054:[`歼击车`,`潜艇`,6.5],
            a10064:[`自行火炮`,`护卫舰`,6.5],
            a10074:[`坦克`,`战列舰`,6.5],
            a10083:[`火箭车`,`航空母舰`,6.5],
            a10094:[`坦克`,`战列舰`,6.5],
            a10114:[`歼击车`,`潜艇`,6.5],
            a10124:[`坦克`,`战列舰`,6.5],
            a10134:[`歼击车`,`潜艇`,6.5],
            a10144:[`歼击车`,`潜艇`,6.5],
            a10164:[`火箭车`,`航空母舰`,6.5],
            a10174:[`自行火炮`,`护卫舰`,6.5],
            a10045:[`自行火炮`,`护卫舰`,7.5],
            a10075:[`坦克`,`战列舰`,7.5],
            a10084:[`火箭车`,`航空母舰`,7.5],
            a10095:[`坦克`,`战列舰`,7.5],
            a10135:[`歼击车`,`潜艇`,7.5],
            a10145:[`歼击车`,`潜艇`,7.5],
            a10165:[`火箭车`,`航空母舰`,7.5],
            a10175:[`自行火炮`,`护卫舰`,7.5],
            a20153:[`火箭车`,`航空母舰`,5.5],
            a20054:[`歼击车`,`潜艇`,6.5],
            a20114:[`歼击车`,`潜艇`,7.5],
            a20154:[`火箭车`,`航空母舰`,6.5],
            a20055:[`歼击车`,`潜艇`,7.5],
            a20065:[`自行火炮`,`护卫舰`,7.5],
            a20115:[`歼击车`,`潜艇`,7.5],
            a20125:[`坦克`,`战列舰`,7.5],
            a20155:[`火箭车`,`航空母舰`,7.5],
            a99998:[`坦克`,`战列舰`,100],
            a99999:[`坦克`,`战列舰`,100],
            a20044:[`自行火炮`,`护卫舰`,6.5],
            a20064:[`自行火炮`,`护卫舰`,6.5],
            a20074:[`坦克`,`战列舰`,6.5],
            a20083:[`火箭车`,`航空母舰`,6.5],
            a20094:[`坦克`,`战列舰`,6.5],

            a50001:[`坦克`,`护卫舰`,1],
            a50002:[`坦克`,`护卫舰`,2],
            a50003:[`坦克`,`护卫舰`,3],
            a50004:[`坦克`,`护卫舰`,4],
            a50005:[`坦克`,`护卫舰`,5],
            a50006:[`坦克`,`护卫舰`,6],
            a50007:[`坦克`,`护卫舰`,7],
            a50008:[`坦克`,`护卫舰`,8],
            a50009:[`坦克`,`护卫舰`,9],
            a50011:[`歼击车`,`潜艇`,1],
            a50012:[`歼击车`,`潜艇`,2],
            a50013:[`歼击车`,`潜艇`,3],
            a50014:[`歼击车`,`潜艇`,4],
            a50015:[`歼击车`,`潜艇`,5],
            a50016:[`歼击车`,`潜艇`,6],
            a50017:[`歼击车`,`潜艇`,7],
            a50018:[`歼击车`,`潜艇`,8],
            a50019:[`歼击车`,`潜艇`,9],
            a50021:[`自行火炮`,`护卫舰`,1],
            a50022:[`自行火炮`,`护卫舰`,2],
            a50023:[`自行火炮`,`护卫舰`,3],
            a50024:[`自行火炮`,`护卫舰`,4],
            a50025:[`自行火炮`,`护卫舰`,5],
            a50026:[`自行火炮`,`护卫舰`,6],
            a50027:[`自行火炮`,`护卫舰`,7],
            a50028:[`自行火炮`,`护卫舰`,8],
            a50029:[`自行火炮`,`护卫舰`,9],
            a50031:[`火箭车`,`航空母舰`,1],
            a50032:[`火箭车`,`航空母舰`,2],
            a50033:[`火箭车`,`航空母舰`,3],
            a50034:[`火箭车`,`航空母舰`,4],
            a50035:[`火箭车`,`航空母舰`,5],
            a50036:[`火箭车`,`航空母舰`,6],
            a50037:[`火箭车`,`航空母舰`,7],
            a50038:[`火箭车`,`航空母舰`,8],
            a50039:[`火箭车`,`航空母舰`,9],
            a50103:[`歼击车`,`潜艇`,3],
            a50043:[`自行火炮`,`护卫舰`,5.5],
            a50053:[`歼击车`,`潜艇`,5.5],
            a50063:[`自行火炮`,`护卫舰`,5.5],
            a50073:[`坦克`,`护卫舰`,5.5],
            a50082:[`火箭车`,`航空母舰`,5.5],
            a50093:[`坦克`,`护卫舰`,5.5],
            a50113:[`歼击车`,`潜艇`,5.5],
            a50123:[`坦克`,`护卫舰`,5.5],
            a50133:[`歼击车`,`潜艇`,5.5],
            a50143:[`歼击车`,`潜艇`,5.5],
            a50163:[`火箭车`,`航空母舰`,5.5],
            a50173:[`自行火炮`,`护卫舰`,5.5],
            a50104:[`歼击车`,`潜艇`,5.5],
            a50044:[`自行火炮`,`护卫舰`,6.5],
            a50054:[`歼击车`,`潜艇`,6.5],
            a50064:[`自行火炮`,`护卫舰`,6.5],
            a50074:[`坦克`,`护卫舰`,6.5],
            a50083:[`火箭车`,`航空母舰`,6.5],
            a50094:[`坦克`,`护卫舰`,6.5],
            a50114:[`歼击车`,`潜艇`,6.5],
            a50124:[`坦克`,`护卫舰`,6.5],
            a50134:[`歼击车`,`潜艇`,6.5],
            a50144:[`歼击车`,`潜艇`,6.5],
            a50164:[`火箭车`,`航空母舰`,6.5],
            a50174:[`自行火炮`,`护卫舰`,6.5],
            a50045:[`自行火炮`,`护卫舰`,7.5],
            a50075:[`坦克`,`护卫舰`,7.5],
            a50084:[`火箭车`,`航空母舰`,7.5],
            a50095:[`坦克`,`护卫舰`,7.5],
            a50135:[`歼击车`,`潜艇`,7.5],
            a50145:[`歼击车`,`潜艇`,7.5],
            a50165:[`火箭车`,`航空母舰`,7.5],
            a50175:[`自行火炮`,`护卫舰`,7.5],
            a60153:[`火箭车`,`航空母舰`,5.5],
            a60054:[`歼击车`,`潜艇`,6.5],
            a60114:[`歼击车`,`潜艇`,7.5],
            a60154:[`火箭车`,`航空母舰`,6.5],
            a60055:[`歼击车`,`潜艇`,7.5],
            a60065:[`自行火炮`,`护卫舰`,7.5],
            a60115:[`歼击车`,`潜艇`,7.5],
            a60125:[`坦克`,`护卫舰`,7.5],
            a60155:[`火箭车`,`航空母舰`,7.5],
        }
        let inputEl=$(`input[type=text]`);
        for(let i=0; i<inputEl.length; i++){
            let curInput=inputEl.eq(i);
            let curId=curInput.attr(`id`);
            if(curId && curId.slice(0,3)==`get`){
                let curTankId=curId.split(`_`)[1];
                let curTankType=tankType[curTankId];
                let curTankTypeName=curTankType[0];
                switch(true){
                    case urlMatch(`gm_index`):
                        curTankTypeName=curTankType[0];
                    break;
                    case urlMatch(`gm_bigship`):
                        curTankTypeName=curTankType[1];
                    break;
                }
                if(curTankType[2]%1!=0){ // n.5级，特战
                    curTankTypeName=`<span style="color:#008000">特战</span>${curTankTypeName}`;
                }
                let sp=parseInt(curTankId.slice(1,2));
                if(sp>=5){ // id首位>=5表示精英坦克
                    curTankTypeName=`<span style="color:#808000">精英</span>${curTankTypeName}`;
                }
                curInput.next().afterDOM({tag:`span`,html:` ${curTankId}&nbsp;&nbsp;&nbsp;&nbsp;${curTankType[2]}级${curTankTypeName}`});
            }
        }
    }
    function addTroopsMax(bool=true){
        let itemList=$(`#troop_table`).children(`tbody`).children(`tr`);
        let itemLength=itemList.length-2; //去除底部的空行和提交按钮
        for(let i=2; i<itemLength; i++){
            let itemInput=itemList.eq(i).children(`td`).eq(1).children(`input`).eq(1);
            let originValue=itemList.eq(i).children(`td`).eq(1).children(`input`).eq(0);
            if(bool==true){
                itemInput.val(`999999`).addClass(`changed`);
            }else{
                itemInput.val(`-${originValue.val()}`).addClass(`changed`);
            }
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(btnEl.length-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(btnEl.length-1).focus();
    }
}

//配件功能优化
function addUserAccessory(){
    //用户部队
    if(urlMatch(`user/userinfo_accessory`)){
        setCustomStyle([
            {name:`.container table`,style:`width:auto !important;`},
            {name:`.page-content`,style:`
                overflow-x:auto !important;
                overflow-y:auto !important;
            `},
            {name:`table, tr, td`,style:`width:0px; important; min-width:0px !important`},
        ]);
        let accessoryColor=[
            {tag:`option`,value:``,html:``},
            {tag:`option`,value:`普通`,html:`普通`},
            {tag:`option`,value:`精良`,html:`精良`},
            {tag:`option`,value:`先进`,html:`先进`},
            {tag:`option`,value:`尖端`,html:`尖端`},
            {tag:`option`,value:`红色`,html:`红色`},
            {tag:`option`,value:`七彩`,html:`七彩`},
            {tag:`option`,value:`超然`,html:`超然（万能碎片）`},
        ];
        $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
            {tag:`button`,id:`addItemsMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                addItemsMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`addItemsZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                addItemsMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`br`},
            {tag:`button`,id:`addLvMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`强化改造一键加满`,bind:{click(e){
                addLvMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`addLvZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`强化改造一键清零`,bind:{click(e){
                addLvMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`autoSave`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`强化改造一键保存`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                autoSave();
            }}},
            {tag:`br`},
            {tag:`select`,id:`onkeyAllSel`,children:accessoryColor},
            {tag:`button`,id:`onkeyAllAcc`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满配件`,bind:{click(e){
                if(confirm(`是否一键加满${$(`#onkeyAllSel`).val()}配件？【共${$(`select[name=addaccessory]`).children(`option`).length-1}个】`)){
                    onekeyAllAcc($(`#onkeyAllSel`).val());
                }
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`br`},
            {tag:`select`,id:`onkeyAllSelFrmt`,children:accessoryColor},
            {tag:`button`,id:`onkeyAllAccFrmt`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满配件碎片`,bind:{click(e){
                if(confirm(`是否一键加满${$(`#onkeyAllSelFrmt`).val()}配件碎片？【共${$(`select[name=addfrmt]`).children(`option`).length-1}个】`)){
                    onekeyAllAcc($(`#onkeyAllSelFrmt`).val(),`addfrmt`);
                }
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`br`},
            {tag:`select`,id:`onkeyClearSel`,children:accessoryColor},
            {tag:`button`,id:`onkeyClearAcc`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空配件`,bind:{click(e){
                if(confirm(`是否一键清空${$(`#onkeyClearSel`).val()}配件？【共${$(`input[value=del]`).parent(`a`).length}个】`)){
                    onekeyClearAcc($(`#onkeyClearSel`).val());
                }
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}}
         ]);

        let accSearchList=[
            `addaccessory`,`addfrmt`,
        ];
        for(let el of accSearchList){
            $(`select[name=${el}]`).afterDOM([
                {tag:`input`,id:`${el}_search`,type:`text`,style:`width:128px;`,placeholder:`Search ${el.replace(`add`,``)}`,bind:{
                    input(e){
                        filterAccInfo(el,$(this).val());
                    }
                }},
                {tag:`button`,html:`×`,bind:{
                    click(e){
                        e.preventDefault();
                        $(`#${el}_search`).val(``);
                        filterAccInfo(el,false);
                        return false;
                    }
                }},
            ]);
        }
    }

    function filterAccInfo(type, value){
        let options=$(`select[name=${type}]`).children(`option`);
        options.css(`display`,``);
        if(value){
            for(let i=0; i<options.length; i++){
                let op=options.eq(i);
                if(!op.html().includes(value)){
                    op.css(`display`,`none`);
                }
            }
        }
    }

    function addItemsMax(bool){
        let num=(bool==true?999999999:0);
        let itemEl=$(`input[id=jl]`);
        //材料
        for(let i=0; i<itemEl.length; i++){
            let curItemEl=itemEl.eq(i);
            if(curItemEl.attr(`name`) && curItemEl.attr(`name`).startsWith(`p`)){
                curItemEl.val(num).addClass(`changed`);
            }
        }
        //碎片
        let frmtEl=$(`input`);
        for(let i=0; i<frmtEl.length; i++){
            if(frmtEl.eq(i).attr(`name`) && frmtEl.eq(i).attr(`name`).startsWith(`f`)){
                frmtEl.eq(i).val(parseInt(num/1000000)).addClass(`changed`); //防止加多溢出，因此限制数量为999
            }
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(btnEl.length-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(btnEl.length-1).focus();
    }

    function addLvMax(bool){
        let qh=150;
        let gz=12;
        let inputEl=$(`input[type=text]`);
        for(let i=0; i<inputEl.length; i++){
            let curInput=inputEl.eq(i);
            if(curInput.attr(`id`) && typeof curInput.attr(`id`)==`string`){
                let accName=curInput.parent().parent().eq(0).text().trim();
                let accProm=parseInt(curInput.parent().parent().children().eq(3).text().trim());
                if(isNaN(accProm)) accProm=0;
                if(!bool){
                    qh=0;
                    gz=1;
                }else if(accName.includes(`七彩`)){
                    qh=120
                    gz=25
                }else{
                    qh=120
                    gz=12
                }
                if(bool && accProm>0){
                    qh+=accProm*2;
                    gz+=Math.round(accProm / 3 + 1);
                }

                if(curInput.attr(`id`).slice(0,3)==`qh_`){
                    curInput.val(qh).addClass(`changed`);
                }
                if(curInput.attr(`id`).slice(0,3)==`gz_`){
                    curInput.val(gz).addClass(`changed`);
                }
            }
        }
    }

    async function autoSave(){
        let saveBuSubmitList=[];
        let saveBuEl=$(`input[type=button][value=save]`);
        for(let i=0; i<=saveBuEl.length; i++){
            let saveBu=saveBuEl.eq(i);
            if(saveBu.length>0 && saveBu.attr(`onclick`) && saveBu.attr(`onclick`).slice(0,5)==`check`){
                saveBuSubmitList.push(saveBu.attr(`onclick`).replace(`check`,`checkPromise`));
            }
        }
        //$(`#msg`).children(`font`).beforeDOM(`div`,{id:`output`});
        let msg=new MsgWindow(`配件强化改造一键保存`);
        for(let [i,s] of saveBuSubmitList.entries()){
            let rs=await eval(s); // onclick中的调用为字符串形式，需要用eval执行
            msg.output(`[${i+1} / ${saveBuSubmitList.length}] ${rs}`);
            //$(`#output`).appendDOM(`p`,rs);
        }
        msg.output(`一键保存完成！`);
        msg.enable();
    }

    async function checkPromise(id, item) { // 改自自带函数check，封装Promise以支持循环中await

		var nickname = $("#name").val();
		var zoneid = $("#zid").val();
		var uid = $("#uid").val();

		var qh = $("#qh_" + item).val();
		var gz = $("#gz_" + item).val();

		var a;

		$("#arr_xl" + item + " input").each(function (e) {


			if (a) {
				a = $(this).val() + ":" + $(this).attr("name") + "," + a;
			} else {
				a = $(this).val() + ":" + $(this).attr("name");
			}
		})
		var b;
		$("#prop input").each(function (e) {


			if (b) {
				b = $(this).val() + ":" + $(this).attr("name") + "," + b;
			} else {
				b = $(this).val() + ":" + $(this).attr("name");
			}
		});

		//alert(item);
		//alert(id);
        var url = window.location.href.replaceAll(`user/userinfo_accessory`,`data/ajax_xilian`);
		//var url = 'http://devtank.raysns.com/gm_bigship/data/ajax_xilian';

		return new Promise((resolve, reject)=>{
			$.ajax({

				type: "POST",
				url: url,
				data: {
					"b": b,
					"go": a,
					"zid": zoneid,
					"uid": uid,
					"nickname": nickname,
					"at": id,
					"qh": qh,
					"gz": gz,
					"item": item
				},
				success: function (result) {

					/*$.each(arr, function(key,value){

						$('#'+value+'').val('');
				   }); */

					var r = eval('(' + result + ')');
					resolve(r.msg);
				}
			});
		});
	}

    async function onekeyAllAcc(filter=``,type=`addaccessory`){
        let msg=new MsgWindow(`一键添加所有${filter}配件`);

        let accEl=$(`select[name=${type}]`);
        let accListEl=accEl.children(`option`);
        let accCount=accListEl.length-1;
        for(let i=1; i<accListEl.length; i++){
            let cur=accListEl.eq(i);
            let name=cur.html();
            let val=cur.val();
            if(filter){
                if(!name.includes(filter)){
                    continue;
                }
            }
            $(`select[name=${type}]`).val(cur.val());
            if(type==`addfrmt`){
                $(`input[name=addfrmtcount]`).val(999);
            }

            let postUrl=$(`form`).eq(1).attr(`action`);
            let postData=$(`form`).eq(1).serialize();
            let rs;
            try{
                rs=await ajaxPromise(postUrl, `POST`, postData);
                rs=$(rs).find(`#msg`).text();
            }catch(e){
                rs=e;
            }

            msg.output(`[${i} / ${accCount}] ${val}: ${name} ${rs}`);
        }
        msg.output(`一键添加完成！`);
        msg.enable();
    }

    async function onekeyClearAcc(filter=``){
        let msg=new MsgWindow(`一键清空所有${filter}配件`);
        let accEl=$(`input[value=del]`).parent(`a`);
        let accCount=accEl.length;
        for(let i=0; i<accEl.length; i++){
            let cur=accEl.eq(i);
            let curName=cur.parent().parent().children(`td`).eq(0).text();
            if(filter){
                if(!curName.includes(filter)){
                    continue;
                }
            }

            let getUrl=cur.attr(`href`);
            let rs;
            try{
                rs=await ajaxPromise(getUrl, `GET`);
                rs=$(rs).find(`#msg`).text();
            }catch(e){
                rs=e;
            }

            msg.output(`[${i+1} / ${accCount}] ${curName} ${rs}`);
        }
        msg.output(`一键清空完成！`);
        msg.enable();
    }
}

//指挥官历程和战争传记优化
function addTestMemoir(){
    //指挥官历程和战争传记，允许调为0
    if(urlMatch(`test/memoir`) || urlMatch(`test/improve`)){
        let inputBlacklist=[`p1`,`p2`,`p3`,`scost`,`pcost`,`c0000`];
        $(`input`).bind(`change`,function(){
            if(inputBlacklist.includes($(this).attr(`id`))){
                let lv=parseInt($(this).val());
                if(lv==0){
                    $("#tishi").hide();
                    $("#submit").show();
                }
            }
        });
    }
}

//军装功能优化
function addArmyUniform(){
    //军装功能
    if(urlMatch(`army/armyuniform`)){
         $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
             {tag:`button`,id:`addArmyuniformMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                addArmyuniformMax(true);
            }}},
            {tag:`button`,id:`addArmyuniformZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                addArmyuniformMax(false);
            }}}
         ]);
        $(`#submit_arr`).afterDOM([
            {tag:`input`,id:`addAllArmyuniformFilter`,placeholder:`军装类型`},
            {tag:`button`,id:`addAllArmyuniform`,class:`btn btn-primary btn-sm`,html:`添加全部`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                addAllArmyuniform($(`#addAllArmyuniformFilter`).val());
            }}},

        ]);
    }
    function addArmyuniformMax(bool){
        let itemList=$(`.table`).children(`tbody`).children(`tr`);
        let itemLength=itemList.length;
        for(let i=0; i<itemLength; i++){
            let itemInput=itemList.eq(i).children(`td`).eq(0).children(`input`).eq(2);
            let originValue=itemList.eq(i).children(`td`).eq(0).children(`input`).eq(1);
            if(bool==true){
                itemInput.val(`999999`).addClass(`changed`);
            }else{
                itemInput.val(`-${originValue.val()}`).addClass(`changed`);
            }
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(1).focus();
    }
    async function addAllArmyuniform(type=``){
        let arOption=$(`#ar_array`).children();
        let arList=[];
        for(let i=0; i<arOption.length; i++){
            let curOp=arOption.eq(i);
            if(curOp.val==`请选择` || (type!=`` && !curOp.html().includes(type))) continue;
            arList.push({
                ar_name:curOp.html(),
                ar_array:curOp.val(),
                ai_count:$(`#ai_count`).val(),
                ai_level:$(`#ai_level`).val(),
                zid:$(`#zid`).val(),
                uid:$(`#uid`).val(),
            });
        }
        let getUrl=window.location.href;
        let postUrl=getUrl.replaceAll(`/armyuniform`,`/ajax_addar`);

        let msg=new MsgWindow(`一键添加所有${type}军装`);
        for(let i=0; i<arList.length; i++){
            let postData=arList[i];
            let rs;
            try{
                rs=await ajaxPromise(postUrl, `POST`, postData);
                rs=unescape(rs.replace(/\\/g, "%"));
            }catch(e){
                rs=e;
            }

            msg.output(`[${i+1} / ${arList.length}] ${postData.ar_name} (${postData.ar_array}) ${postData.ai_count} ${postData.ai_level} ${rs}`);
        }
        msg.output(`一键添加完成！`);
        msg.enable();
    }
}

//组件功能优化
function addDataComponent(){
    //军装功能
    if(urlMatch(`data/component`)){
         $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
             {tag:`button`,id:`addArmyuniformMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                addComponentMax(true);
            }}},
            {tag:`button`,id:`addArmyuniformZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                addComponentMax(false);
            }}}
         ]);
    }
    function addComponentMax(bool){
        let itemList=$(`.table`).children(`tbody`).children(`tr`);
        let itemLength=itemList.length;
        for(let i=0; i<itemLength; i++){
            if(itemList.eq(i).children(`td`).eq(0).children(`input`).length>0){
                let itemInput=itemList.eq(i).children(`td`).eq(0).children(`input`).eq(1);
                let originValue=itemList.eq(i).children(`td`).eq(0).children(`input`).eq(0);
                if(bool==true){
                    itemInput.val(`999999`).addClass(`changed`);
                }else{
                    itemInput.val(`-${originValue.val()}`).addClass(`changed`);
                }
            }
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(1).focus();
    }
}

//将领功能优化
function addHeroInfo(){
    if(urlMatch(`user/herouserinfo`)){
        let elList=[
            `hero`,`soul`,`adj`,
        ];
        for(let el of elList){
            $(`#${el}_array`).afterDOM([
                {tag:`input`,id:`${el}_search`,type:`text`,style:`width:128px;`,placeholder:`Search ${el}`,bind:{
                    input(e){
                        filterHeroInfo(el,$(this).val());
                    }
                }},
                {tag:`button`,html:`×`,bind:{
                    click(e){
                        e.preventDefault();
                        $(`#${el}_search`).val(``);
                        filterHeroInfo(el,false);
                        return false;
                    }
                }},
            ]);
        }
    }
    function filterHeroInfo(type, value){
        let options=$(`#${type}_array`).children(`option`);
        options.css(`display`,``);
        if(value){
            for(let i=0; i<options.length; i++){
                let op=options.eq(i);
                if(!op.html().includes(value)){
                    op.css(`display`,`none`);
                }
            }
        }
    }
}

function addSupply(){
    //补给舰功能
    if(urlMatch(`user/supplyhouse`)){
         $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
             {tag:`button`,id:`addSupplyMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                addSupplyMax(true);
            }}},
            {tag:`button`,id:`addSupplyZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                addSupplyMax(false);
            }}}
         ]);
    }
    function addSupplyMax(bool){
        let itemList=$(`table`).eq(-1).children(`tbody`).children(`tr`);
        let itemLength=itemList.length;
        for(let i=0; i<itemLength; i++){
            if(itemList.eq(i).find(`input`).length>0){
                let itemInput=itemList.eq(i).find(`input`).eq(1);
                let originValue=itemList.eq(i).find(`input`).eq(0);
                if(bool==true){
                    itemInput.val(`999999`).addClass(`changed`);
                }else{
                    if(parseInt(originValue.val())>0){
                        itemInput.val(`-${originValue.val()}`).addClass(`changed`);
                    }else{
                        itemInput.val(``);
                    }
                }
            }
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(-1).focus();
    }
}

function addArmy(){
    //军徽、超级武器
    if(urlMatch(`test/army`) || urlMatch(`data/weapon`)){
         $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
             {tag:`button`,id:`addArmyMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
				 addArmyMax(true);
            }}},
            {tag:`button`,id:`addArmyZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                addArmyMax(false);
            }}}
         ]);
    }
    function addArmyMax(bool){
        let itemList=$(`input[type=text]`);
        let itemLength=itemList.length;
        for(let i=2; i<itemLength; i++){
			let itemInput=itemList.eq(i);
			let itemNum=10;
            if(bool==false){
				itemNum=0;
			}
			itemInput.val(itemNum).addClass(`changed`);
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(-1).focus();
    }
}

function addPlane(){
    // 战机功能
    if(urlMatch(`test/plane`)){
         $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
             {tag:`button`,id:`addPlaneMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
				 addPlaneMax(true);
            }}},
            {tag:`button`,id:`addPlaneZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                addPlaneMax(false);
            }}}
         ]);
    }
    function addPlaneMax(bool){
        let itemList=$(`input[type=text]`);
        let itemLength=itemList.length;
        for(let i=1; i<itemLength; i++){
			let itemInput=itemList.eq(i);
            let itemId=itemInput.attr(`id`);
            if(itemId[0]==`s` && !isNaN(itemId.slice(1))){
                let itemNum=99;
                if(bool==false){
                    itemNum=0;
                }
                itemInput.val(itemNum).addClass(`changed`);
            }
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(-1).focus();
    }
}

function addDormitory(){
    // 军旅宿舍功能
    if(urlMatch(`user/dormitory`)){
         $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
            {tag:`br`},
            {tag:`button`,id:`addDormMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
				 addDormMax(true);
            }}},
            {tag:`button`,id:`addDormLv`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键升满家具`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                addDormMax(true,`lv`);
            }}},
            {tag:`button`,id:`addDormZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                addDormMax(false);
            }}},
            {tag:`br`},
            {tag:`input`,id:`addDormNum`,class:``,style:{marginLeft:`4px`},value:1,title:`一键加满家具数量`},
            {tag:`select`,id:`addDormType`,class:``,style:{marginLeft:`4px`},children:[
                {tag:`option`,value:``,html:`全部`},
                {tag:`option`,value:`普通`,html:`普通`},
                {tag:`option`,value:`简易`,html:`简易`},
                {tag:`option`,value:`精良`,html:`精良`},
                {tag:`option`,value:`稀有`,html:`稀有`},
                {tag:`option`,value:`史诗`,html:`史诗`},
                {tag:`option`,value:`传奇`,html:`传奇`},
            ]},
         ]);
    }
    function addDormMax(bool,type){
        let trList=$(`#bag_arr`).find(`tr`);
        for(let i=5; i<trList.length; i++){
            let curTr=trList.eq(i);
            let curInput=curTr.find(`input[type=text]`);
            let curName=curInput.eq(0).parent().prev().text();
            if(!curName.includes($(`#addDormType`).val())){
                continue;
            }
            switch(true){
                case bool==true:default:
                    if(curInput.length==1){ // 只有一个输入框时，代表碎片或材料；有两个输入框时，代表配件
                        curInput.eq(0).val($(`#addDormNum`).val() || 999999);
                    }else{
                        curInput.eq(0).val($(`#addDormNum`).val() || 1);
                    }
                    if(type==`lv`){
                        curInput.eq(1).val(60);
                    }
                break;
                case bool==false:
                    if(parseInt(curInput.eq(0).val())>0){
                        curInput.eq(0).val(`-${curInput.eq(0).val()}`);
                    }
                break;
            }
        }
    }
}


//模态框提示、选项改为原生以优化体验
function alertConfirmOpt(){
    if(typeof layer==`object`){
        if(typeof layer.alert==`function`){
            layer.alert=function(content, option, ok){
                if(typeof option==`function`){ //option为函数时，前移
                    ok=option;
                }
                alert(content);
                (typeof callback==`function`) && ok();
            }
        }
        if(typeof layer.confirm==`function`){
            layer.confirm=function(content, option, ok, cancel){
                if(typeof option==`function`){ //option为函数时，前移
                    cancel=ok;
                    ok=option;
                }
                if(confirm(content)){
                    (typeof ok==`function`) && ok();
                }else{
                    (typeof cancel==`function`) && cancel();
                }
            }
        }
    }
}

function onekeyLevelMax(){
    if(urlMatch(`user/userinfo`) && !urlMatch(`userinfo_`)){
        $(`.notice_tables`).prependDOM(`tr`,{
            children:[
                {tag:`td`,html:`一键调号`},
                {tag:`td`,children:[
                    {tag:`button`,class:`btn btn-primary`,html:`一键调号（16242）`,bind:{click(e){
                        onekeyLvMax(false);
                        e.preventDefault();
                    }}},
                    {tag:`span`,html:` `},
                    {tag:`button`,class:`btn btn-primary`,html:`一键调号（满配）`,bind:{click(e){
                        onekeyLvMax(true);
                        e.preventDefault();
                    }}},
                ]},
            ],
        });
    }
    async function onekeyLvMax(bool){
        let olmType=bool==true?`满配`:`16242`;
        if(confirm(`是否确定一键调号（${olmType}）？`)){
            let msg=new MsgWindow(`一键调号`);

            let gm=$(`#gm`).val();
            let uid=$(`#uid`).val();
            let zid=$(`#zid`).val();
            let name=$(`#name`).val();
            msg.output(`GM: ${gm} UID: ${uid} ZID: ${zid}${name!=``?` NAME: ${name}`:``}`);
            try{
                msg.output(await userinfoLvMax(gm, zid, uid, name, bool));
                msg.output(await resourcesMax(gm, zid, uid, name, bool));
                msg.output(await bagsMax(gm, zid, uid, name, bool));
                msg.output(await buildingsLvMax(gm, zid, uid, name, bool));
                msg.output(await troopsMax(gm, zid, uid, name, bool));
                msg.output(await challengeMax(gm, zid, uid, name, bool));
            }catch(e){
                msg.output(`发生错误：${e}`);
                console.error(e);
            }
            document.documentElement.scrollTop=0; // 框架特殊，不能使用body的scrollTop（始终为0）
            msg.output(`一键调号完成！<font color="#F00">必须重新登录！</font>`);
            msg.enable();
        }
    }
    async function userinfoLvMax(gm, zid, uid, name){
        $(`#onekeyMax`).click();
        let postUrl=$(`#updateuserinfo`).attr(`action`);
        /*数据修正开始*/
        var level = $("#level").val();
		var get_level = $("#get_level").val();
		if(get_level == ''){
			get_level = parseInt(0);
		}
		var sum_level = parseInt(level) + parseInt(get_level);

		var rank = $("#rank").val();
		var get_rank = $("#get_rank").val();
		if(get_rank == ''){
			get_rank = parseInt(0);
		}
		var sum_rank = parseInt(rank) + parseInt(get_rank);


		// 添加军工

		var rp = $("#rp").val();

		var get_rp = $("#get_rp").val();
		if(get_rp == ''){
			get_rp = parseInt(0);
		}
		var sum_rp = parseInt(rp) + parseInt(get_rp);

			//添加军功币
		/*	var rpb = $("#rpb").val();

		var get_rpb = $("#get_rpb").val();

		if(get_rpb == ''){
			get_rpb = parseInt(0);
		}
		var sum_rpb = parseInt(rpb) + parseInt(get_rpb);
		*/


		var vip = $("#vip").val();
		var get_vip = $("#get_vip").val();
		if(get_vip == ''){
			get_vip = parseInt(0);
		}
		var sum_vip = parseInt(vip) + parseInt(get_vip);
		// vip点数

		var vippoint = $("#vippoint").val();
		var get_vippoint = $("#get_vippoint").val();
		if(get_vippoint == ''){
			get_vippoint = parseInt(0);
		}

		var sum_vippoint = parseInt(vippoint) + parseInt(get_vippoint);

		var troops = $("#troops").val();

		var get_troops = $("#get_troops").val();
		if(get_troops == ''){
			get_troops = parseInt(0);
		}
		var sum_troops = parseInt(troops) + parseInt(get_troops);
		$('#troops').prop('value',sum_troops);
		var honors = $("#honors").val();
		var get_honors = $("#get_honors").val();
		if(get_honors == ''){
			get_honors = parseInt(0);
		}
		var sum_honors = parseInt(honors) + parseInt(get_honors);


		// if(level>110 || sum_level>110)
		// {
		// 	$("#tishi").html("<font color='red'>等级不能大于110</font>");
		// 	$("#tishi").show();
		// 	$('#tishi').delay(3000).hide(0);
	 //        return  false;
		// }
		if(rank>22 || sum_rank>22)
		{
			$("#tishi").html("<font color='red'>军衔不能大于22</font>");
			$("#tishi").show();
			$("#tishi").delay(3000).hide(0);
	        return  false;
		}
		if(vip>15 || sum_vip>15)
		{
			$("#tishi").html("<font color='red'>vip不能大于15</font>");
			$("#tishi").show();
			$("#tishi").delay(3000).hide(0);
	        return  false;
		}
		// if(troops>101 || sum_troops>110)
		// {
		// 	$("#ts").html("<font color='red'>统帅不能大于110</font>");
		// 	$("#ts").show();
		// 	$("#ts").delay(3000).hide(0);
	 //        return  false;
		// }
		/*
		if(sum_honors>337000)
		{
			$("#tishi").html("<font color='red'>声望不能大于337000</font>");
			$("#tishi").show();
			$("#tishi").delay(5000).hide(0);
	        return false;
		}
		*/
		//添加vip

		$('#vip').prop('value',sum_vip);
		$('#vippoint').prop('value',sum_vippoint);
		//已经购买金币
		var buygems = $('#buygems').val();
		var get_buygems = $('#get_buygems').val();
		if(get_buygems == ''){
			get_buygems = parseInt(0);
		}
		var sum_buygems = parseInt(buygems) + parseInt(get_buygems);
		$('#buygems').prop('value',sum_buygems);

		//添加金币
		var gems = $('#gems').val();
		var get_gems = $('#get_gems').val();
		if(get_gems == ''){
			get_gems = parseInt(0);
		}
		var sum_gems = parseInt(gems) + parseInt(get_gems);
		$('#gems').prop('value',sum_gems);
		//添加等级
		$('#level').prop('value',sum_level);
		//添加经验
		var exp = $('#exp').val();
		var get_exp = $('#get_exp').val();
		if(get_exp == ''){
			get_exp = parseInt(0);
		}
		var sum_exp = parseInt(exp) + parseInt(get_exp);
		$('#exp').prop('value',sum_exp);
		//军衔
		$('#rank').prop('value',sum_rank);

		//军工

		$('#rp').prop('value',sum_rp);
			//军功币
		//$('#rpb').prop('value',sum_rpb);

		//声望
		$('#honors').prop('value',sum_honors);
		//能量
		var energy = $('#energy').val();
		var get_energy = $('#get_energy').val();
		if(get_energy == ''){
			get_energy = parseInt(0);
		}
		var sum_energy = parseInt(energy) + parseInt(get_energy);
		$('#energy').prop('value',sum_energy);

		var value = $("#addValue").val();
		var nickname = $("#nickname").val();
		var zoneid = $("#zoneid").val();
		uid = $("#uid").val();
		var attribute_name = $("#addAttribute option:selected").val();
        /*数据修正结束*/
        let postData=`gm=${gm}&uid=${uid}&name=${name}&zid=${zid}&`+$(`#updateuserinfo`).serialize();
        let rs;
        try{
            rs=await ajaxPromise(postUrl, `POST`, postData);
        }catch(e){
            rs=e;
        }
        return `一键升满等级 【${rs}】`;
    }
    async function resourcesMax(gm, zid, uid, name){
        let url=window.location.pathname.replace(`userinfo`,`userinfo_resource`);
        let postUrl=url.replace(`user/userinfo_resource`,`api/updateuserinfo`);
        let postData={
            uid:uid,zid:zid,gm:gm,
            userinfo:1,
            gold:99999999999999,
        };
        for(let i=1; i<=4; i++){
            postData[`r${i}`]=99999999999999;
        }
        let rs;
        try{
            rs=await ajaxPromise(postUrl, `POST`, postData);
        }catch(e){
            rs=e;
        }
        return `一键加满资源 【${rs}】`;
    }
    async function bagsMax(gm, zid, uid, name){
        let url=window.location.pathname.replace(`userinfo`,`bag`);
        let postUrl=url.replace(`user/bag`,`api/updateuserinfo`);
        let bagHtml=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
        let bagEl=$(bagHtml);
        let tableEl=bagEl.find(`#bag_arr`);
        let inputEl=tableEl.find(`input[readonly]`);
        let postData={
            gm:gm, zid:zid, uid:uid, name:name,
            email:bagEl.find(`input[name=email]`).val(),
            onepid:bagEl.find(`#sel_recommender`).val(),
            addnum:``,
            userbag:`1`,
        };
        for(let i=0; i<inputEl.length; i++){
            let curInputGet=inputEl.eq(i);
            if(curInputGet.length>0 && curInputGet.attr(`id`) && curInputGet.attr(`id`).slice(0,4)==`get_`){
                let id=curInputGet.attr(`id`).slice(4);
                let curInputName=curInputGet.parent().prev().text();
                if(itemOftenList.includes(curInputName)){
                    postData[`${id}`]=`999999`;
                }else{
                    postData[`${id}`]=``;
                }
            }
        }
        let rs;
        try{
            rs=await ajaxPromise(postUrl, `POST`, postData);
        }catch(e){
            rs=e;
        }
        return `一键添加背包常用道具 【${rs}】`;
    }
    async function buildingsLvMax(gm, zid, uid, name){
        let url=window.location.pathname.replace(`userinfo`,`buildings`);
        let postUrl=url.replace(`user/buildings`,`api/updateuserinfo`);
        let resHtml=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
        let resEl=$(resHtml);
        let inputEl=resEl.find(`input[type=text]`);
        let postData={
            gm:gm, zid:zid, uid:uid, name:name,
            userbuildings:`1`,auto:``,
        };
        for(let i=0; i<inputEl.length; i++){
            let curInputGet=inputEl.eq(i);
            if(curInputGet.length>0 && curInputGet.attr(`name`) && curInputGet.attr(`name`).slice(0,1)==`b` && !isNaN(curInputGet.attr(`name`).slice(1))){
                let id=curInputGet.attr(`name`);
                postData[`${id}`]=80;
            }
        }
        let rs;
        try{
            rs=await ajaxPromise(postUrl, `POST`, postData);
        }catch(e){
            rs=e;
        }
        return `一键升满建筑 【${rs}】`;
    }
    async function troopsMax(gm, zid, uid, name, bool){
        let url=window.location.pathname.replace(`userinfo`,`troops`);
        let postUrl=url.replace(`user/troops`,`api/updateuserinfo`);
        let trHtml=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
        let trEl=$(trHtml);
        let inputEl=trEl.find(`input[type=text]`);
        let postData={
            gm:gm, zid:zid, uid:uid, name:name,
            usertroops:`1`,removess:`普通坦克`,
        };
        for(let i=0; i<inputEl.length; i++){
            let curInputGet=inputEl.eq(i);
            if(curInputGet.length>0 && curInputGet.attr(`name`) && curInputGet.attr(`name`).slice(0,1)==`a` && !isNaN(curInputGet.attr(`name`).slice(1))){
                let id=curInputGet.attr(`name`);
                postData[`${id}`]=999999;
                if(bool==false) break; // bool为false时（16242），只加第一个轻型坦克
            }
        }
        let rs;
        try{
            rs=await ajaxPromise(postUrl, `POST`, postData);
        }catch(e){
            rs=e;
        }
        return `一键加满部队 【${rs}】`;
    }
    async function challengeMax(gm, zid, uid, name){
        let url=window.location.pathname.replace(`userinfo`,`challenge`);
        let postUrl=url.replace(`user/challenge`,`api/updateuserinfo`);
        let postData={
            gm:gm, zid:zid, uid:uid, name:name,
            userchallenge:`1`,one:``,two:``,star:0,fid:``,fids:``,
        };
        let types=[`aa`,`bb`];
        let rss=[];
        try{
            for(let type of types){
                postData[`type`]=type;
                rss.push(await ajaxPromise(postUrl, `POST`, postData));
            }
        }catch(e){
            rss.push(e);
        }
        return `一键解锁关卡【${rss.join(`; `)}】`;
    }
}

function onekeyClearAllBags(){
    if(urlMatch(`user/userinfo`) && !urlMatch(`userinfo_`)){
        $(`.notice_tables`).prependDOM(`tr`,{
            children:[
                {tag:`td`,html:`一键清空`},
                {tag:`td`,children:{tag:`button`,class:`btn btn-primary`,html:`一键清空所有系统背包`,bind:{click(e){
                    onekeyClear(true);
                    e.preventDefault();
                }}}},
            ],
        });
    }
    async function onekeyClear(bool){
        if(confirm(`是否确定一键清空所有系统背包？`)){
            let msg=new MsgWindow(`一键清空所有系统背包`);
            let gm=$(`#gm`).val();
            let uid=$(`#uid`).val();
            let zid=$(`#zid`).val();
            let name=$(`#name`).val();

            msg.output(`GM: ${gm} UID: ${uid} ZID: ${zid}${name!=``?` NAME: ${name}`:``}`);
            try{
                msg.output(await clearBag(gm, zid, uid, name));
                //msg.output(await clearResource(gm, zid, uid, name));
                msg.output(await clearAccessory(gm, zid, uid, name));
                msg.output(await clearArmyuniform(gm, zid, uid, name));
                msg.output(await clearAirship(gm, zid, uid, name));
                msg.output(await clearRcenter(gm, zid, uid, name));
                msg.output(await clearImprove(gm, zid, uid, name));
                msg.output(await clearMemoir(gm, zid, uid, name));
                msg.output(await clearComponentinfo(gm, zid, uid, name));
                msg.output(await clearComponentadd(gm, zid, uid, name));
                msg.output(await clearSupplyExp(gm, zid, uid, name));
                msg.output(await clearSupplyHouse(gm, zid, uid, name));
                msg.output(await clearSupplyTech(gm, zid, uid, name));
                msg.output(await clearYxkj(gm, zid, uid, name));
                msg.output(await clearDormitory(gm, zid, uid, name));
                msg.output(await clearJunzhen(gm, zid, uid, name));
            }catch(e){
                msg.output(`发生错误：${e}`);
                console.error(e);
            }

            msg.output(`一键清空完成！`);
            msg.enable();
        }
    }
}

async function clearBag(gm, zid, uid, name){
    let url=window.location.pathname.replace(`userinfo`,`bag`);
    let postUrl=url.replace(`user/bag`,`api/updateuserinfo`);
    let bagHtml=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
    let bagEl=$(bagHtml);
    let tableEl=bagEl.find(`#bag_arr`);
    let inputEl=tableEl.find(`input[readonly]`);
    let postData={
        gm:gm, zid:zid, uid:uid, name:name,
        email:bagEl.find(`input[name=email]`).val(),
        onepid:bagEl.find(`#sel_recommender`).val(),
        addnum:``,
        userbag:`1`,
    };
    for(let i=0; i<inputEl.length; i++){
        let curInputGet=inputEl.eq(i);
        if(curInputGet.length>0 && curInputGet.attr(`id`) && curInputGet.attr(`id`).slice(0,4)==`get_`){
            let id=curInputGet.attr(`id`).slice(4);
            if(parseInt(curInputGet.val())>0){
                postData[`${id}`]=`-${curInputGet.val()}`;
            }else{
                postData[`${id}`]=`0`;
            }
        }
    }
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    // 拆分道具列表并分次提交，确保每次提交的数量不超过2000
    /*
        let size=2000;
        let inputElSplit = [];
        for (let i = 0; i < inputEl.length; i += size) {
            inputElSplit.push(inputEl.slice(i, i + size));
        }
        let rs;
        for(let spEl of inputElSplit){
            for(let i=0; i<spEl.length; i++){
                let curInputGet=spEl.eq(i);
                if(curInputGet.length>0 && curInputGet.attr(`id`) && curInputGet.attr(`id`).slice(0,4)==`get_`){
                    let id=curInputGet.attr(`id`).slice(4);
                    if(parseInt(curInputGet.val())>0){
                        postData[`${id}`]=`-${curInputGet.val()}`;
                    }else{
                        postData[`${id}`]=`0`;
                    }
                }
            }
            try{
                rs=await ajaxPromise(postUrl, `POST`, postData);
            }catch(e){
                rs=e;
            }
        }
        */
    return `一键清空背包 【${rs}】`;
}

async function clearResource(gm, zid, uid, name){
    let url=window.location.pathname;
    let postUrl=url.replace(`user/userinfo`,`api/updateuserinfo`);
    let postData={
        uid:uid,zid:zid,gm:gm,
        userinfo:1,
        gold:0,
    };
    for(let i=1; i<=4; i++){
        postData[`r${i}`]=0;
    }
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    return `一键清空资源 【${rs}】`;
}

async function clearAccessory(gm, zid, uid, name){
    let url=window.location.pathname;
    let postUrl=url.replace(`user/userinfo`,`api/updateuserinfo`);
    let postData={
        uid:uid,zid:zid,
        accessory:1,
        addaccessory:0,addfrmt:0,addfrmtcount:0,
    };
    for(let i=1; i<=13; i++){
        postData[`p${i}`]=0;
    }
    let rs;
    try{
        await ajaxPromise(postUrl, `POST`, postData);
        rs=`save Success !!`;
    }catch(e){
        rs=e;
    }
    return `一键清空配件 【${rs}】`;
}

async function clearArmyuniform(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,urlMatch(`bigship`)?`user/armyuniform`:`army/armyuniform`);
    let postUrl=url.replace(`/armyuniform`,`/ajax_araddprop`);
    let postData={
        zid:zid, uid:uid,
    };

    let armyHtml=await ajaxPromise(url,`POST`,{zid:zid, uid:uid});
    let armyEl=$(armyHtml);
    let tableEl=armyEl.find(`.table`);
    let pInput=tableEl.find(`input[id=mtl]`);
    let dataList=[];
    for(let i=0; i<pInput.length; i++){
        let cur=pInput.eq(i);
        let name=cur.attr(`name`);
        let val=cur.val();
        dataList.push(`${name}=${val}&${name}=-${val}`);
    }
    postData[`data`]=dataList.join(`&`);

    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    return `一键清空军装 【${rs}】`;
}

async function clearAirship(gm, zid, uid, name){
    if(urlMatch(`bigship`)){ // 舰队飞艇和坦克不同，因此忽略
        return null;
    }
    let url=window.location.pathname.replace(`user/userinfo`,`test/airship`);
    let postUrl=url.replace(`test/airship`,`test/ajax_airship`);
    let postData={
        zid:zid, uid:uid,act:1,num:0,
    };

    for(let i=1; i<=242; i++){
        postData[`z${i}`]=0;
        if(i<=5){
            postData[`i${i}`]=0;
        }
    }

    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
        rs=JSON.parse(rs).msg;
    }catch(e){
        rs=e;
    }
    return `一键清空飞艇 【${rs}】`;
}

async function clearRcenter(gm, zid, uid, name){
    if(urlMatch(`bigship`)){ // 舰队没有坦克研发中心
        return null;
    }
    let url=window.location.pathname;
    let postUrl=url.replace(`user/userinfo`,`test/ajax_rcenter`);
    let postData={
        uid:uid,zid:zid,nickname:name,
        at:``,act:`act`,addfrmt:0,addfrmtcount:0,
    };
    let dataList=[];
    for(let i=1; i<=8; i++){
        dataList.push(`0:p${i}`);
    }
    for(let i=20; i<=29; i++){
        dataList.push(`0:p${i}`);
    }
    postData.b=dataList.join(`,`);
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
        rs=JSON.parse(rs).msg;
    }catch(e){
        rs=e;
    }
    return `一键清空坦克研发中心 【${rs}】`;
}

async function clearImprove(gm, zid, uid, name){
    if(urlMatch(`bigship`)){ // 舰队没有指挥官历程
        return null;
    }
    let url=window.location.pathname;
    let postUrl=url.replace(`user/userinfo`,`test/updateimprove`);
    let postData={
        gm:gm, zid:zid, uid:uid, name:name,
        usertechs:`1`,
    };
    for(let i=1; i<=3; i++){
        postData[`p${i}`]=0;
    }
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    return `一键清空指挥官历程 【${rs}】`;
}

async function clearMemoir(gm, zid, uid, name){
    let url=window.location.pathname;
    let postUrl=url.replace(`user/userinfo`,urlMatch(`bigship`)?`user/updatememoir`:`test/updatememoir`);
    let postData={
        gm:gm, zid:zid, uid:uid, name:name,
        usertechs:`1`,
        point:`0`,p1:`0`,scost:`0`,pcost:`0`,c0000:`0`,
    };
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    return `一键清空战争传记 【${rs}】`;
}

async function clearComponentinfo(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,`data/componentinfo`);
    let postUrl=url.replace(`data/componentinfo`,`data/ajax_cptexp`);
    let postData={
        zid:zid, uid:uid, name:name, addexp:1,
    };

    let comHtml=await ajaxPromise(url,`POST`,{zid:zid, uid:uid, name:name});
    let comEl=$(comHtml);
    let tableEl=comEl.find(`.table`);
    let pInput=tableEl.find(`#exp`);
    console.log(pInput);
    postData[`addexp`]=`-${pInput.val()}`;
    postData[`exp`]=`${pInput.val()}`;

    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    return `一键清空组件经验 【${rs}】`;
}

async function clearComponentadd(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,`data/componentadd`);
    let postUrl=url.replace(`data/componentadd`,`data/ajax_cptadd`);
    let postData={
        zid:zid, uid:uid,
    };

    let comHtml=await ajaxPromise(url,`POST`,{zid:zid, uid:uid, name:name});
    let comEl=$(comHtml);
    let tableEl=comEl.find(`.table`);
    let td=tableEl.find(`tr`);

    let dataList=[];
    for(let i=1; i<td.length; i++){
        let curTd=td.eq(i);
        let tdInput=curTd.find(`input`);
        let orgInput=tdInput.eq(0);
        let tgtInput=tdInput.eq(1);

        let curOrgVal=orgInput.val();
        let curId=tgtInput.attr(`name`);
        dataList.push(`${curId}=-${curOrgVal}`);
    }
    postData.data=dataList.join(`&`);

    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    return `一键清空组件资源 【${rs}】`;
}
async function clearSupplyExp(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,`user/supplyship`);
    let postUrl=url.replace(`user/supplyship`,`user/ajax_updateshiplv`);
    let postData={
        zoneid:zid, uid:uid,name:``,params:`exp-0,`,
    };
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    rs=unescape(rs.replace(/\\/g, "%"))
    return `一键清空补给舰经验 【${rs}】`;
}

async function clearSupplyHouse(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,`user/supplyhouse`);
    let postUrl=url.replace(`user/supplyhouse`,`user/ajax_updatematerial`);
    let postData={
        zoneid:zid, uid:uid,name:``,action:2,params:``,
    };

    let comHtml=await ajaxPromise(url,`POST`,{zid:zid, uid:uid, name:name, action:`load`});
    let comEl=$(comHtml);
    let tableEl=comEl.find(`table`).eq(-1);
    let tr=tableEl.find(`tr`);

    let dataList=[];
    for(let i=0; i<tr.length; i++){
        let curTr=tr.eq(i);
        let tdInput=curTr.find(`input`);
        let orgInput=tdInput.eq(0);
        let tgtInput=tdInput.eq(1);

        let curOrgVal=orgInput.val();
        let curId=tgtInput.attr(`id`);
        if(parseInt(curOrgVal)>0){
            dataList.push(`${curId}_${curOrgVal}`);
        }
    }
    dataList.push(``); // 末尾必须加一个空值，否则报错
    postData.params=dataList.join(`,`);

    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    rs=unescape(rs.replace(/\\/g, "%"))
    return `一键清空补给舰背包 【${rs}】`;
}

async function clearSupplyTech(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,`user/tendertech`);
    let postUrl=url.replace(`user/tendertech`,`api/updateuserinfo`);
    let postData={
        gm:gm, zid:zid, uid:uid, name:name, tendertech:1,
    };
    for(let i=1; i<=5; i++){
        postData[`p${i}`]=0;
    }
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    rs=unescape(rs)
    return `一键清空补给舰科技 【${rs}】`;
}

async function clearYxkj(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,`data/yxkj`);
    let postUrl=url.replace(`data/yxkj`,`data/ajax_prop`);
    let postData={
        gm:gm, zid:zid, uid:uid, nickname:name,
        go:`0:r6,0:r5,0:r4,0:r3,0:r2,0:r1`,
    };
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    return `一键清空异星科技资源 【${JSON.stringify(JSON.parse(rs))}】`;
}

async function clearDormitory(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,`user/dormitory`);
    let postUrl=url.replace(`user/dormitory`,`user/ajax_dormitoryadd`);

    let ajaxPromiseList=[];
    for(let i=1; i<=3; i++){
        ajaxPromiseList.push(ajaxPromise(url,`POST`,{id:i, zid:zid, uid:uid}));
    }
    let rjList=await Promise.all(ajaxPromiseList);
    let rsList=[];
    for(let i=0; i<rjList.length; i++){
        let rj=JSON.parse(rjList[i]);
        let postList=[
            `zid=${zid}`,
            `uid=${uid}`,
        ];
        let j=0;
        for(let key in rj.data){
            // key:["name", num]
            let num=rj.data[key][1];
            postList.push(`prop[${j}][]=${key}`); // prop[0][]=d1
            postList.push(`prop[${j}][]=${num>0?-num:0}`); // prop[0][]=-1
            postList.push(`prop[${j}][]=`); // prop[0][]=
            j++;
        }
        let rs;
        try{
            rs=JSON.parse(await ajaxPromise(postUrl, `POST`, postList.join(`&`)));
        }catch(e){
            rs=e;
        }
        rsList.push(rs);
    }
    return `一键清空军旅宿舍 【${JSON.stringify(rsList)}】`;
}

async function clearJunzhen(gm, zid, uid, name){
    let url=window.location.pathname.replace(`user/userinfo`,`user/junzhen`);
    let postUrl=url.replace(`user/junzhen`,`api/updateuserinfo`);
    let postData={
        gm:gm, zid:zid, uid:uid, name:name, junzhen:1,
    };
    for(let i=1; i<=3; i++){
        postData[`formation_p${i}`]=1; // 军阵最小值只能是1，清空只能传1
    }
    let rs;
    try{
        rs=await ajaxPromise(postUrl, `POST`, postData);
    }catch(e){
        rs=e;
    }
    rs=unescape(rs)
    return `一键清空军阵 【${rs}】`;
}

function onekeyCheckAllBags(){
    const rename={
        // 配置名：正式名
        //背包
        //'进阶革新精要':`进级革新精要`,
        '英雄传记技能书':`传记功勋章`,
        '战略核心[B型]':`普通核心`,
        '战略核心[O型]':`高级核心`,
        //'新型究极坦克宝箱':`7级坦克宝箱`,
        '橙色通用配件碎片':`橙色通用配件`,
        '橙色通用碎末片':`新型橙色碎末片`,
        '红色通用碎末片':`新型红色碎末片`,
        '通用将领魂魄':`魂魄徽章`,
        '训练加速':`生产加速`,
        '研究加速':`科技加速`,
        '军徽部件（装备原件）':`坦克图纸I`,
        //'军徽部件（装备原件）':`军徽部件`,
        '7,5级坦克宝箱':`新型究极特战坦克宝箱`,
        '橙色通用配件':`橙色配件图纸`,
        '高级心得选择箱':`新型高级心得包`,
        '学说选择箱':`新型将领学说包`,
        '7.5级随机坦克宝箱':`究极特战坦克宝箱`,
        '飞机蓝色技能箱':`蓝色技能箱`,
        '飞机紫色技能箱':`紫色技能箱`,
        '中级心得选择箱':`新型中级心得包`,
        //'橙色补给箱':`特级补给品`,
        //'战塔强化指定包':`补给舰强化指定包`,
        //'补给品原料指定包':`补给舰原料指定包`,
        //'威望级补给包':`紫色补给品`,
        '1、2号位可选尖端碎片箱(碎片）':`新型1号尖端碎末箱`,
        '3、4号位可选尖端碎片箱(碎片）':`新型2号尖端碎末箱`,
        '5、6号位可选尖端碎片箱(碎片）':`新型3号尖端碎末箱`,
        '7、8号位可选尖端碎片箱(碎片）':`新型4号尖端碎末箱`,
        '1号新型究极碎片箱(碎片)':`新型1号究极碎末箱`,
        '2号新型究极碎片箱(碎片)':`新型2号究极碎末箱`,
        '3号新型究极碎片箱(碎片)':`新型3号究极碎末箱`,
        '4号新型究极碎片箱(碎片)':`新型4号究极碎末箱`,
        //'高级补给包':`蓝色补给品`,
        //'蓝色补给箱':`中级补给品`,
        '配件导线_道具':`配件导线`,
        '1号随机究极碎片箱(碎片)':`1号究极碎末箱`,
        '2号随机究极碎片箱(碎片)':`2号究极碎末箱`,
        '3号随机究极碎片箱(碎片)':`3号究极碎末箱`,
        '4号随机究极碎片箱(碎片)':`4号究极碎末箱`,
        '1号新型究极碎片箱(碎片)':`新型1号究极碎末箱`,
        '2号新型究极碎片箱(碎片)':`新型2号究极碎末箱`,
        '3号新型究极碎片箱(碎片)':`新型3号究极碎末箱`,
        '4号新型究极碎片箱(碎片)':`新型4号究极碎末箱`,
        '1、2号位随机尖端碎片箱(碎片）':`1号尖端碎末箱`,
        '3、4号位随机尖端碎片箱(碎片）':`2号尖端碎末箱`,
        '5、6号位随机尖端碎片箱(碎片）':`3号尖端碎末箱`,
        '7、8号位随机尖端碎片箱(碎片）':`4号尖端碎末箱`,
        '1、2号位可选尖端碎片箱(碎片）':`新型1号尖端碎末箱`,
        '3、4号位可选尖端碎片箱(碎片）':`新型2号尖端碎末箱`,
        '5、6号位可选尖端碎片箱(碎片）':`新型3号尖端碎末箱`,
        '7、8号位可选尖端碎片箱(碎片）':`新型4号尖端碎末箱`,
        '特级将领副官随机箱':`特级将领副官包`,
        '精致布料':`强化芯片`,
        '训练道具':`训练方案`,
        '':``,
        '':``,
        '':``,
        '':``,
        '':``,
        '':``,
        '':``,
        '':``,
        '':``,
        //传记
        '传记_万能牌':`万能卡牌`,
        '战争传记抽卡券':`传记印章`,
        '战争传记技能点':`传记功勋章`,
        //军装
        '军装抽奖券':`军装制作证`,
        '蓝色突破纤维':`蓝色突破染剂`,
        '紫色突破纤维':`紫色突破染剂`,
        '橙色突破纤维':`橙色突破染剂`,
        '强化纤维':`改造工具`,
        '制造能源':`军装制作技术_制造能源`,
        '技术点':`军装制作技术_制造能源`,
        '精粹军装制作技术_制造能源':`军装制作技术_尖端技术点道具`,
        '尖端军装制作技术_制造能源':`军装制作技术_尖端技术点道具`,

    };
	if(urlMatch(`user/userinfo`) && !urlMatch(`userinfo_`)){
        setCustomStyle([
            {name:`.clearMsg`,style:`
				position:fixed;
				top:0px;
				left:0px;
				right:0px;
				bottom:0px;
				background:rgba(0,0,0,0.5);
				z-index:1000;
			`},
			{name:`.clearMsgWindow`,style:`
				position:absolute;
				top:0px;
				left:0px;
				right:0px;
				bottom:0px;
				width:60%;
				height:70%;
				margin:auto;
				background:#FFF;
				border-radius:5px;
				overflow:hidden;
			`},
			{name:`.clearMsgTitle`,style:`
				position:absolute;
				top:0px;
				left:0px;
				right:0px;
				height:48px;
				line-height:48px;
				text-align:center;
				vertical-align:middle;
				font-size:18px;
				background:#438eb9;
				color:#FFF;
			`},
			{name:`.clearMsgContent`,style:`
				position:absolute;
				top:calc(48px + 16px);
				left:48px;
				right:48px;
				bottom:64px;
				border:1px solid #CCC;
				border-radius:5px;
				padding:16px;
				overflow-y:auto;
			`},
			{name:`.clearMsgControl`,style:`
				position:absolute;
				left:0px;
				right:0px;
				bottom:0px;
				height:64px;
				line-height:64px;
				text-align:center;
				vertical-align:middle;
			`},
            {name:`.checkInput`,style:`
                margin: -16px;
                width: calc(40% + 16px);
                height: calc(100% + 16px * 2);
                border-left: none;
                border-top: none;
                border-bottom: none;
                outline: none;
                resize: none;
                line-height:22px;
                padding:0px;
                font-size:12px;
            `},
            {name:`.checkResult`,style:`
                position: absolute;
                top: 0px;
                left: calc(40% + 8px);
                right: 0px;
                bottom: 0px;
                overflow-y: auto;
                font-size:12px;
            `},
            {name:`.checkResultP`,style:`
                margin:0px;
            `},
            {name:`.success`,style:`
                color:#008000;
            `},
            {name:`.success.more`,style:`
                color:#00AAAA;
            `},
            {name:`.failed`,style:`
                color:#FF0000;
            `},
            {name:`.warning`,style:`
                color:#808000;
            `},
            {name:`.checkTable`,style:`
                width:100%;
            `},
            {name:`.checkTr`,style:`
                height:22px;
            `},
            {name:`.check`,style:`
                outline:none !important;
                padding-right: 6px !important;
                border-top-right-radius: 0px !important;
                border-bottom-right-radius: 0px !important;
            `},
            {name:`.check:active`,style:`
                top: 0px !important;
                left: 0px !important;
            `},
            {name:`.check.force`,style:`
                border-top-left-radius: 0px !important;
                border-bottom-left-radius: 0px !important;
                border-top-right-radius: 4px !important;
                border-bottom-right-radius: 4px !important;
                color:transparent !important;
                min-width:6px !important;
                width:6px !important;
                padding-left:0px !important;
                padding-right:0px !important;
                overflow:hidden !important;
                margin-right:8px;
            `},
        ]);
        $(`.notice_tables`).prependDOM(`tr`,{
            children:[
                {tag:`td`,html:`一键检测`},
                {tag:`td`,children:{tag:`button`,class:`btn btn-primary`,html:`一键检测背包`,bind:{
                    click(e){
                        showCheckWindow(true);
                        e.preventDefault();
                    },
                }}},
            ],
        });
    }
    function showCheckWindow(bool){
        //$(`.checkMsg`).remove();
        $(`#innerWindow_一键检测背包`).remove();
        if(bool==undefined || bool==true || bool==`force`){
            let checkWindow=new OpenWindow(`一键检测背包`,null,{width:940,height:540});
            checkWindow.setTitle(`一键检测背包<span id="checkCount"></span>`);
            $(checkWindow.iframe).appendDOM([
                {tag:`div`,id:`checkContent`,class:`checkContent clearMsgContent`,children:[
                    {tag:`textarea`,id:`checkInput`,class:`checkInput`},
                    {tag:`div`,id:`checkResult`,class:`checkResult`,html:``}
                ]},
                {tag:`div`,id:`checkControl`,class:`checkControl clearMsgControl`,children:[
                    {tag:`button`,id:`checkCheckBu`,class:`btn btn-primary check`,html:`检查`,bind:{click(e){
                        onekeyCheck();
                    }}},
                    {tag:`button`,id:`checkForceBu`,class:`btn btn-primary check force`,html:`.`,bind:{click(e){
                        onekeyCheck(`force`);
                    }}},
                    //{tag:`span`,html:` `},
                    {tag:`button`,id:`checkCloseBu`,class:`btn btn-primary`,html:`关闭`,bind:{click(e){
                        showCheckWindow(false);
                    }}},
                ]},
            ]);
            /*
            $(`body`).appendDOM(`div`,{
                id:`checkMsg`,class:`checkMsg clearMsg`,children:[
                    {tag:`div`,class:`checkWindow clearMsgWindow`,children:[
                        {tag:`div`,id:`checkTitle`,class:`checkTitle clearMsgTitle`,html:`一键检测背包<span id="checkCount"></span>`},
                        {tag:`div`,id:`checkContent`,class:`checkContent clearMsgContent`,children:[
                            {tag:`textarea`,id:`checkInput`,class:`checkInput`},
                            {tag:`div`,id:`checkResult`,class:`checkResult`,html:``}
                        ]},
                        {tag:`div`,id:`checkControl`,class:`checkControl clearMsgControl`,children:[
                            {tag:`button`,id:`checkCheckBu`,class:`btn btn-primary check`,html:`检查`,bind:{click(e){
                                onekeyCheck();
                            }}},
                            {tag:`button`,id:`checkForceBu`,class:`btn btn-primary check force`,html:`.`,bind:{click(e){
                                onekeyCheck(`force`);
                            }}},
                            //{tag:`span`,html:` `},
                            {tag:`button`,id:`checkCloseBu`,class:`btn btn-primary`,html:`关闭`,bind:{click(e){
                                showCheckWindow(false);
                            }}},
                        ]},
                    ]}
                ]
            });
            */
            let leftEl=document.querySelector(`#checkInput`);
            let rightEl=document.querySelector(`#checkResult`);
            /*leftEl.addEventListener(`scroll`, ()=>{
				rightEl.scrollTop = leftEl.scrollTop;
			});*/
            rightEl.addEventListener(`scroll`, ()=>{
                leftEl.scrollTop = rightEl.scrollTop;
            });
            if(!customGMData.checkText){
                customGMData.checkText=``;
            }
            $(`#checkInput`).val(customGMData.checkText);
            $(`#checkInput`).bind(`change`,function(e){
                customGMData.checkText=$(this).val();
                saveStorage();
            });
        }
    }
	async function onekeyCheck(bool){
		let gm=$(`#gm`).val();
		let uid=$(`#uid`).val();
		let zid=$(`#zid`).val();
		let name=$(`#name`).val();
        let checkList=[];
        let checkFunction=[
            {name:`基础信息`,function:getUserinfo},
            {name:`资源`,function:getResource},
            {name:`背包`,function:getBag},
            {name:`配件`,function:getAccessory},
            {name:`军装`,function:getArmy},
            {name:`战争飞艇`,function:getAirship},
            {name:`坦克研发中心`,function:getRcenter},
            {name:`指挥官历程`,function:getImprove},
            {name:`战争传记`,function:getMemoir},
            {name:`组件经验`,function:getComponentinfo},
            {name:`组件背包`,function:getComponentAdd},
            {name:`异星科技`,function:getYxkj},
            {name:`补给舰经验`,function:getSupplyExp},
            {name:`补给舰背包`,function:getSupplyHouse},
            {name:`补给舰科技`,function:getSupplyTech},
            {name:`军旅宿舍`,function:getDormitory},
            {name:`军阵`,function:getJunzhen},
        ];
        $(`#checkResult`).html(``);
        $(`#checkCount`).html(``);
        for(let [i,check] of checkFunction.entries()){
            $(`#checkResult`).appendDOM(`p`,`[${i+1} / ${checkFunction.length}] 正在检测${check.name}……`);
            $(`#checkResult`)[0].scrollTop=9999;
            checkList=[...checkList, ...await check.function(gm, zid, uid, name)];
        }
        /*
        $(`#checkResult`).appendDOM(`p`,`正在检测基础信息……`);
        checkList=[...checkList, ...await getUserinfo(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测资源……`);
        checkList=[...checkList, ...await getResource(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测背包……`);
        checkList=[...checkList, ...await getBag(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测配件……`);
        checkList=[...checkList, ...await getAccessory(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测军装……`);
        checkList=[...checkList, ...await getArmy(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测战争飞艇……`);
        checkList=[...checkList, ...await getAirship(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测坦克研发中心……`);
        checkList=[...checkList, ...await getRcenter(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测指挥官历程……`);
        checkList=[...checkList, ...await getImprove(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测战争传记……`);
        checkList=[...checkList, ...await getMemoir(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测组件经验……`);
        checkList=[...checkList, ...await getComponentinfo(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测组件背包……`);
        checkList=[...checkList, ...await getComponentAdd(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测异星科技……`);
        checkList=[...checkList, ...await getYxkj(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测补给舰经验……`);
        checkList=[...checkList, ...await getSupplyExp(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测补给舰背包……`);
        checkList=[...checkList, ...await getSupplyHouse(gm, zid, uid, name)];
        $(`#checkResult`).appendDOM(`p`,`正在检测补给舰科技……`);
        checkList=[...checkList, ...await getSupplyTech(gm, zid, uid, name)];
        */
        console.log(checkList);
        $(`#checkResult`).appendDOM(`p`,`正在检测道具数量……`);
        $(`#checkResult`)[0].scrollTop=9999;
        let checkInput=$(`#checkInput`).val();
        for(let k in rename){
            checkInput=checkInput.replaceAll(k, rename[k]);
        }
        let checkTextList=checkInput.trim().split(`\n`);
        let checkResultList=[];
        let checkCount=0;
        for(let [index,text] of checkTextList.entries()){
            let sp=text.split(`\t`);
            let name=sp[0].trim();
            let num=parseInt(sp.at(-1));
            let checkedItem=false;
            for(let check of checkList){
                if(!text) continue;
                if(check.name.toLowerCase() == name.toLowerCase()){
                    checkedItem=true;
                    let checkStatus;
                    let checkStatusIcon=``;
                    if(bool==`force`){
                        check.number=num;
                    }
                    switch(true){
                        case check.number>num:
                            checkStatus=`success more`;
                            checkStatusIcon=`＞`;
                            checkCount++;
                        break;
                        case check.number==num:
                            checkStatus=`success`;
                            checkStatusIcon=`√`;
                            checkCount++;
                        break;
                        default:
                            checkStatus=`failed`;
                            checkStatusIcon=`×`;
                        break;
                    }
                    // 检测需要别名机制来映射不同名但相同的道具
                    checkResultList.push(`<tr class="checkTr ${checkStatus}"><td>${checkStatusIcon}</td><td>${index+1}</td><td>${check.type}</td><td>${check.name}</td><td>目标${num}</td><td>持有${check.number}</td></tr>`);
                }
            }
            if(!checkedItem){
                checkResultList.push(`<tr class="checkTr warning"><td>？</td><td>${index+1}</td><td>未知</td><td>${name}</td><td>目标${num}</td><td>未找到</td></tr>`);
            }
        }
        $(`#checkResult`).html(`<table class="checkTable">${checkResultList.join(``)}</table>`);
        $(`#checkCount`).html(`（${checkCount} / ${checkResultList.length}）`);
        $(`#checkResult`)[0].scrollTop=0;
	}
}

async function getUserinfo(gm, zid, uid, name){
    let list=[];
    let url=window.location.pathname;
    let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
	let el=$(html);
    let tableEl=el.find(`.notice_tables`);
	let inputEl=tableEl.find(`input[readonly]`);
    for(let i=0; i<inputEl.length; i++){
		let curInputGet=inputEl.eq(i);
		if(curInputGet.length>0){
			list.push({
                type   : `信息`,
                id     : i,
				name   : curInputGet.parent().prev().text().trim(),
				number : isNaN(curInputGet.val())?curInputGet.val():parseInt(curInputGet.val()),
			});
		}

	}
	return list;
}

async function getResource(gm, zid, uid, name){
    let list=[];
	let url=window.location.pathname.replace(`userinfo`,`userinfo_resource`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
    let el=$(html);
    let inputEl=el.find(`input[type=text]`);
    for(let i=2; i<inputEl.length; i++){
        let curInputGet=inputEl.eq(i);
        list.push({
            type   : `资源`,
            id     : curInputGet.attr(`name`),
            name   : curInputGet.parent().prev().text().trim(),
            number : parseInt(curInputGet.val()),
        });
    }
    return list;
}

async function getBag(gm, zid, uid, name){
	let list=[];
	let url=window.location.pathname.replace(`userinfo`,`bag`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
	let el=$(html);
	let tableEl=el.find(`#bag_arr`);
	let inputEl=tableEl.find(`input[readonly]`);
	for(let i=0; i<inputEl.length; i++){
		let curInputGet=inputEl.eq(i);
		if(curInputGet.length>0 && curInputGet.attr(`id`) && curInputGet.attr(`id`).slice(0,4)==`get_`){
			list.push({
                type   : `背包`,
                id     : curInputGet.attr(`id`).slice(4),
				name   : curInputGet.parent().prev().text().trim(),
				number : parseInt(curInputGet.val()),
			});
		}

	}
	return list;
}

async function getAccessory(gm, zid, uid, name){
	let list=[];
	let url=window.location.pathname.replace(`userinfo`,`userinfo_accessory`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name, accessory:1});
	let el=$(html);
	let tableEl=el.find(`table`);
	let inputEl=tableEl.find(`input[id=jl]`);
	for(let i=0; i<inputEl.length; i++){
		let curInputGet=inputEl.eq(i);
		if(curInputGet.length>0){
			list.push({
                type   : `配件`,
                id     : curInputGet.attr(`name`),
				name   : curInputGet.parent().prev().text().trim(),
				number : parseInt(curInputGet.val()),
			});
		}
	}
	return list;
}

async function getArmy(gm, zid, uid, name){
	let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,urlMatch(`bigship`)?`user/armyuniform`:`army/armyuniform`);
	let html=await ajaxPromise(url,`POST`,{zid:zid, uid:uid});
	let el=$(html);
	let tableEl=el.find(`.table`);
	let inputEl=tableEl.find(`input[name=addlv]`);
	for(let i=0; i<inputEl.length; i++){
		let curInputGet=inputEl.eq(i);
		if(curInputGet.length>0){
			list.push({
                type   : `军装`,
                id     : curInputGet.prev().attr(`name`),
				name   : curInputGet.prev().prev().text().replaceAll(`：`,``).trim(),
				number : parseInt(curInputGet.val()),
			});
		}
	}
	return list;
}

async function getAirship(gm, zid, uid, name){
	let list=[];
    if(urlMatch(`bigship`)){ // 舰队飞艇和坦克不同，因此忽略
        return list;
    }
	let url=window.location.pathname.replace(`user/userinfo`,`test/airship`);
	let html=await ajaxPromise(url+`?gm=${gm}`,`POST`,{zid:zid, uid:uid});
	let el=$(html);
	let tableEl=el.find(`#tab2`).find(`table`);
	let inputEl=tableEl.find(`input`)
	for(let i=0; i<=inputEl.length; i++){
		let curInputGet=inputEl.eq(i);
		if(curInputGet.length>0 && curInputGet.attr(`id`) && (curInputGet.attr(`id`)[0]==`z` || curInputGet.attr(`id`)[0]==`i`)){
			list.push({
                type   : `战争飞艇`,
                id     : curInputGet.attr(`id`),
				name   : curInputGet.parent().prev().text().trim(),
				number : parseInt(curInputGet.val()),
			});
		}
	}
	return list;
}

async function getRcenter(gm, zid, uid, name){
	let list=[];
    if(urlMatch(`bigship`)){ // 舰队没有坦克研发中心
        return list;
    }
	let url=window.location.pathname.replace(`user/userinfo`,`test/rcenter`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name, rcenter:1});
	let el=$(html);
	let tableEl=el.find(`table`);
	let inputEl=tableEl.find(`input[id=jl]`);
	for(let i=0; i<inputEl.length; i++){
		let curInputGet=inputEl.eq(i);
		if(curInputGet.length>0){
			list.push({
                type   : `坦克研发中心`,
                id     : curInputGet.attr(`name`),
				name   : curInputGet.parent().prev().text().trim(),
				number : parseInt(curInputGet.val()),
			});
		}
	}
	return list;
}

async function getImprove(gm, zid, uid, name){
	let list=[];
    if(urlMatch(`bigship`)){ // 舰队没有坦克研发中心
        return list;
    }
	let url=window.location.pathname.replace(`user/userinfo`,`test/improve`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
	let el=$(html);
	let tableEl=el.find(`table`);
	let tableLength=tableEl.find(`tr`).length;
	for(let i=1; i<=tableLength; i++){
		let curInputGet=tableEl.find(`input[id=p${i}]`);
		if(curInputGet.length>0){
			list.push({
                type   : `指挥官历程`,
                id     : curInputGet.attr(`name`),
				name   : curInputGet.parent().prev().text().trim(),
				number : parseInt(curInputGet.val()),
			});
		}
	}
	return list;
}

async function getMemoir(gm, zid, uid, name){
	let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,urlMatch(`bigship`)?`user/memoir`:`test/memoir`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
	let el=$(html);
	let tableEl=el.find(`table`);
	let idList=[`p1`,`scost`,`pcost`,`c0000`];
	for(let i=0; i<=idList.length; i++){
		let curInputGet=tableEl.find(`#${idList[i]}`);
		if(curInputGet.length>0){
			list.push({
                type   : `战争传记`,
                id     : curInputGet.attr(`name`),
				name   : curInputGet.parent().prev().text().trim(),
				number : parseInt(curInputGet.val()),
			});
		}
	}
	return list;
}

async function getComponentinfo(gm, zid, uid, name){
	let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,`data/componentinfo`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
	let el=$(html);
	let tableEl=el.find(`table`);
	list.push({
        type   : `组件经验`,
        id     : `exp`,
		name   : `组件经验`,
		number : parseInt(tableEl.find(`#exp`).val()),
	})
	return list;
}

async function getComponentAdd(gm, zid, uid, name){
	let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,`data/componentadd`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
	let el=$(html);
	let tableEl=el.find(`.table`);
	let inputEl=tableEl.find(`input[readonly=readonly]`);
	for(let i=0; i<=inputEl.length; i++){
		let curInputGet=inputEl.eq(i);
		if(curInputGet.length>0){
			list.push({
                type   : `组件背包`,
                id     : curInputGet.next().attr(`name`),
				name   : curInputGet.parent().text().replaceAll(`资源--`,``).replaceAll(`+`,``).trim(),
				number : parseInt(curInputGet.val()),
			});
		}
	}
	return list;
}

async function getYxkj(gm, zid, uid, name){
    let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,`data/yxkj`);
    let html=await ajaxPromise(url,`POST`,{gm_session:gm, zid:zid, uid:uid, name:name});
    let el=$(html);
    let itemList=[];
    let pro_array=el.find(`#pro_array`).children();
    for(let i=1; i<pro_array.length; i++){
        let pro=pro_array.eq(i);
        itemList.push({
            name:pro.html(),
            id:pro.val(),
        });
    }
    //let itemList=[`异星晶尘`,`异星晶岩`,`异星晶核`,`催化剂`,`稳定剂`,`润滑剂`];
    for(let i=0; i<itemList.length; i++){
        let curItem=itemList[i];
        let curEl=el.find(`#${curItem.id}`);
        let curNum=0;
        if(curEl.length>0){
            curNum=parseInt(curEl.val());
        }
        list.push({
            type   : `异星科技`,
            id     : curItem.id,
            name   : curItem.name,
            number : curNum,
        });
    }
    return list;
}

async function getSupplyExp(gm, zid, uid, name){
    let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,`user/supplyship`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
    let el=$(html);
    let expEl=el.find(`#exp`);
    list.push({
        type   : `补给舰经验`,
        id     : `exp`,
        name   : `补给舰经验`,
        number : parseInt(expEl.val()),
    });
    return list;
}

async function getSupplyHouse(gm, zid, uid, name){
	let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,`user/supplyhouse`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name, action:`load`});
	let el=$(html);
	let tableEl=el.find(`table`).eq(-1);
	let inputEl=tableEl.find(`input[readonly]`);
	for(let i=0; i<=inputEl.length; i++){
		let curInputGet=inputEl.eq(i);
		if(curInputGet.length>0){
			list.push({
                type   : `补给舰背包`,
                id     : curInputGet.next().attr(`id`),
				name   : curInputGet.parent().parent().text().replaceAll(`+`,``).trim(),
				number : parseInt(curInputGet.val()),
			});
		}
	}
	return list;
}

async function getSupplyTech(gm, zid, uid, name){
    let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,`user/tendertech`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
    let el=$(html);
	let inputEl=el.find(`input[type=text]`);
    for(let i=0; i<=inputEl.length; i++){
        let curInputGet=inputEl.eq(i);
        if(curInputGet.attr(`id`) && curInputGet.attr(`id`)[0]==`p`){
            let num=parseInt(curInputGet.val());
            if(isNaN(num)){
                num=0;
            }
            list.push({
                type   : `补给舰科技`,
                id     : curInputGet.attr(`id`),
				name   : curInputGet.parent().prev().html().split(`:`)[1].trim(),
				number : num,
			});
        }
    }
    return list;
}

async function getDormitory(gm, zid, uid, name){
    let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,`user/dormitory`);
    let ajaxPromiseList=[];
    for(let i=1; i<=3; i++){
        ajaxPromiseList.push(ajaxPromise(url,`POST`,{id:i, zid:zid, uid:uid}));
    }
    let rsList=await Promise.all(ajaxPromiseList);
    for(let i=0; i<rsList.length; i++){
        let rs=JSON.parse(rsList[i]);
        for(let key in rs.data){
            list.push({
                type   : `军旅宿舍`,
                id     : key,
				name   : rs.data[key][0],
				number : rs.data[key][1],
			});
        }
    }
    return list;

    /*
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
    let el=$(html);
	let inputEl=el.find(`input[type=text]`);
    // 抓取输入框
    for(let i=0; i<=inputEl.length; i++){
        let curInputGet=inputEl.eq(i);
        if(curInputGet.attr(`id`) && curInputGet.attr(`id`).slice(0,3)==`get`){
            let num=parseInt(curInputGet.val());
            if(isNaN(num)){
                num=0;
            }
            list.push({
                type   : `补给舰科技`,
                id     : curInputGet.attr(`id`).split(`_`)[1],
				name   : curInputGet.parent().prev().text().split(`[`)[0].trim(),
				number : num,
			});
        }
    }
    return list;
    */
}

async function getJunzhen(gm, zid, uid, name){
    let list=[];
	let url=window.location.pathname.replace(`user/userinfo`,`user/junzhen`);
	let html=await ajaxPromise(url,`POST`,{gm:gm, zid:zid, uid:uid, name:name});
    let el=$(html);
	let inputEl=el.find(`input[type=text]`);
    for(let i=0; i<=inputEl.length; i++){
        let curInputGet=inputEl.eq(i);
        if(curInputGet.attr(`id`) && curInputGet.attr(`id`).startsWith(`formation_`)){
            let num=parseInt(curInputGet.val());
            if(isNaN(num)){
                num=0;
            }
            list.push({
                type   : `军阵`,
                id     : curInputGet.attr(`id`),
				name   : curInputGet.parent().prev().html().split(`:`)[1].trim(),
				number : num,
			});
        }
    }
    return list;
}

//用户信息插件引入
function importUserInfo(){
    //去除输入框禁用
    removeUserDisabled();
    $(`button, input[type=submit], input[type=button], input[type=text]`).bind(`click`,()=>{
        removeUserDisabled();
        //setTimeout(()=>{removeUserDisabled();},500);
    });
    addUserInfo();
    addUserResource();
    addUserBag();
    addUserTroops();
    addUserAccessory();
    addTestMemoir();
    addArmyUniform();
    addDataComponent();
    addHeroInfo();
    addSupply();
    addArmy();
    addPlane();
    addDormitory();
    onekeyClearAllBags();
    onekeyCheckAllBags();
    onekeyLevelMax();
}

//按照一定格式自动录入活动
function importActivity(){
    if(urlMatch(`user/activity`)){
        console.log(`URL Matched`);
        setCustomStyle([
            {name:`.importText`,style:`
                width:500px;
                height:138px;
                resize:none;
            `},
            {name:`.importText::placeholder`,style:`
                color:#CCC;
            `},
            {name:`.importBu`,style:`
                margin-top:8px;
                margin-bottom:8px;
            `},
        ]);
        let placeholder=`活动ID（可选）\n活动标题\n活动英文名\n显示类型\n是否有一天领奖\n活动描述\n最大配置ID`;
        /*
        $(`form`).appendDOM(`div`,{class:`importActivityDiv`,children:[
            //{tag:`hr`,attr:{}},
            {tag:`textarea`,attr:{id:`importText`,class:`importText`,title:`活动ID（可选）\n活动标题\n活动英文名\n显示类型\n是否有一天领奖\n活动描述\n最大配置ID`,placeholder:`活动ID（可选）\n活动标题\n活动英文名\n显示类型\n是否有一天领奖\n活动描述\n最大配置ID`}},
            {tag:`br`,attr:{}},
            {tag:`button`,attr:{id:`importBu`,class:`importBu btn btn-primary btn-sm`,html:`自动填写`,bind:{
                click(e){e.preventDefault();e.stopPropagation();formatData();return;},submit(e){e.preventDefault();e.stopPropagation();reuturn;}
            }}},
        ]});
        */
        $(`#content`).attr(`placeholder`,placeholder);
        $(`#content`).attr(`title`,`自动填写格式：\n${placeholder}`);
        $(`#content`).addClass(`importText`);
        $(`#content`).bind(`input`,function(){
            $(`#importBu`).focus();
        });
        $(`#content`).afterDOM([
            {tag:`br`},
            {tag:`button`,id:`importBu`,class:`importBu btn btn-primary btn-sm`,html:`自动填写`,bind:{
                click(e){
                    e.preventDefault();
                    e.stopPropagation();
                    formatData();
                    $(`.btn.btn-primary.btn-sm`).eq(-1).focus();
                    return;
                },
                submit(e){
                    e.preventDefault();
                    e.stopPropagation();
                    reuturn;
                }
            }},
        ]);
    }

    function formatData(){
        //let textList=$(`#importText`).val().trim();
        let textList=$(`#content`).val().trim();
        textList=textList.replaceAll(`\t`,``);
        textList=textList.split(`\n`);
        //如果数组第0个元素为数字，则认为是ID，排除
        if(!isNaN(textList[0])){
            textList.shift();
        }
        console.log(textList);
        let actName=textList[0];
        let actEName=textList[1];
        let actType=textList[2];
        let actReward=textList[3];
        let actMaxCfg=textList[textList.length-1];
        let actDesc=(function(){
            //删除数组0~3和最后一个，剩下的为描述
            textList.shift();
            textList.shift();
            textList.shift();
            textList.shift();
            textList.pop();
            if(textList.length==1) return textList[0];
            else return textList.join(`\n`);
        })();
        //写入输入框
        $(`#title`).val(actName).addClass(`changed`);
        $(`#acname`).val(actEName).addClass(`changed`);
        $(`#type`).val(actType).addClass(`changed`);
        $(`#rdtime`).val(actReward).addClass(`changed`);
        $(`#content`).val(actDesc).addClass(`changed`);
        $(`input[name=cfg]`).val(actMaxCfg).addClass(`changed`);
        $(`.btn.btn-primary.btn-sm`).eq(0).focus();
        $(`#msg`).css(`display`,`none`);
    }
}

//活动配置数自动应用
function importActivityConfigApply(){
    if(urlMatch(`user/editentry`)){
        setCustomStyle([
            {name:`.configApplyText`,style:`
                width:500px;
                height:138px;
                resize:none;
            `},
            {name:`.configApplyText::placeholder`,style:`
                color:#CCC;
            `},
            {name:`.yellowBG`,style:`
                background:#FF0 !important;
            `},
        ]);
        $(`.row`).beforeDOM(`div`,{class:`ActivityConfigDiv`,children:[
            //{tag:`hr`,attr:{}},
            {tag:`textarea`,attr:{id:`configApplyText`,class:`configApplyText`,title:`活动名称\t活动英文名\t开始时间\t结束时间\t配置\t渠道名称；一行一条`,placeholder:`活动名称\t活动英文名\t开始时间\t结束时间\t配置\t渠道名称`}},
            {tag:`br`,attr:{}},
            {tag:`button`,attr:{id:`configApplyBu`,class:`importBu btn btn-primary btn-sm`,html:`应用下一个`,bind:{
                click(e){e.preventDefault();e.stopPropagation();applyActivityConfig();return;},submit(e){e.preventDefault();e.stopPropagation();reuturn;}
            }}},
            {tag:`span`,attr:{html:` `}},
            {tag:`button`,attr:{id:`configApplyClearBu`,class:`importBu btn btn-primary btn-sm`,html:`清空`,bind:{
                click(e){e.preventDefault();e.stopPropagation();clearActivityConfig();return;},submit(e){e.preventDefault();e.stopPropagation();reuturn;}
            }}},
            {tag:`span`,attr:{html:` `}},
            {tag:`span`,attr:{id:`acmsg`}},
        ]});
        $(`#configApplyBu`).focus();
        if(customGMData.configApplyText){
            $(`#configApplyText`).val(customGMData.configApplyText);
        }
        $(`#configApplyText`).bind(`input`,function(){
            customGMData.configApplyText=$(`#configApplyText`).val();
            saveStorage();
        });
    }
    function applyActivityConfig(){
        let configList=$(`#configApplyText`).val().split(`\n`);
        let isAllDone=true;
        for(let i=0; i<configList.length; i++){
            let curConfig=configList[i];
            if(curConfig){
                let configSplit=curConfig.split(`\t`);
                let cTitle=configSplit[0];
                let cAcname=configSplit[1];
                let cBtime=configSplit[2];
                let cEtime=configSplit[3];
                let cConfig=configSplit[4];
                let acNameEl=getAcnameByVal(cAcname);
                if(acNameEl){
                    let curTrEl=acNameEl.parent().parent();
                    let cfgTdEl=curTrEl.children().eq(6);
                    let ctrlTdEl=curTrEl.children().eq(7);
                    let cfgInputEl=cfgTdEl.children().eq(0);
                    if(parseInt(cfgInputEl.val()) < parseInt(cConfig)){
                        curTrEl.addClass(`yellowBG`);
                        cfgTdEl.addClass(`yellowBG`);
                        console.log(`${cAcname}配置更新：${cfgInputEl.val()}→${cConfig}`);
                        cfgInputEl.val(cConfig).addClass(`changed`);
                        curTrEl[0].scrollIntoView({behavior: "instant", block: "center"});
                        if(typeof ctrlTdEl==`object`) ctrlTdEl.children().eq(0).focus();
                        isAllDone=false;
                        break;
                    }
                }else{
                    $(`#acmsg`).html(`<font color="#F00">${cTitle}（${cAcname}）活动未录入！</font>`);
                    isAllDone=false;
                    break;
                }
            }
        }
        if(isAllDone==true){
            $(`#acmsg`).html(`<font color="#070">所有配置已是最新！</font>`);
        }
    }
    function clearActivityConfig(){
        $(`#configApplyText`).val(``);
        customGMData.configApplyText=$(`#configApplyText`).val();
        saveStorage();
    }
    function getAcnameByVal(val){
        let acNameElList=$(`input[name=acname]`);
        for(let i=0; i<acNameElList.length; i++){
            let el=acNameElList.eq(i);
            if(el.val()==val){
                return el;
            }
        }
        return null;
    }
}
//自动记忆活动开始、结束时间
function autoInsertActivityTime(){
    if(
        urlMatch(`user/upactivity`) || urlMatch(`api/addactivity`) || urlMatch(`test/cusactivity`) ||
        urlMatch(`user/function_editopen`) || urlMatch(`api/editupfunctionopen`)
    ){
        //服务器区间
        //此功能属于高危功能，因此禁用。
        /*
        if(!customGMData.serverNum){
            customGMData.serverNum=[];
        }
        if(customGMData.serverNum[0]){
            $(`#st_fu1`).val(customGMData.serverNum[0]);
        }
        if(customGMData.serverNum[1]){
            $(`#st_fu2`).val(customGMData.serverNum[1]);
        }
        $(`#st_fu1`).bind(`input`,function(){
            customGMData.serverNum[0]=$(`#st_fu1`).val();
            saveStorage();
        });
        $(`input[name=st_fu2]`).bind(`input`,function(){ // st_f2的id写错了，写成了,id，所以无法识别，只能使用name
            customGMData.serverNum[1]=$(`input[name=st_fu2]`).val();
            saveStorage();
        });*/

        // 线上服务器自动勾选测试服
        if(urlMatch(`gm.rayjoy.com`) || urlMatch(`test_gm_index`)){
            let serverList=[];
            let gm=getGM();
            switch(true){
                case gm==`gm_213`:{ // 本地213不勾选
                }
                break;
                case gm==`gm_207`:{ // 本地207勾选9服
                    serverList=[9];
                }
                break;

                case gm==`gm_204`:{ // 本地204勾选997、998服
                    serverList=[997,998];
                }
                break;

                case gm==`gm_feiliu`:{ // 正版勾选填写993、994
                    serverList=[993,994];
                }
                break;

                default:{ // 其他渠道勾选填写1000
                    serverList=[1000];
                }
                break;
            }
            $(`input[id=zid]`).prop('checked', false); // 取消勾选其他服（如iOS正版的1000服）
            for(let s of serverList){
                $(`input[type=checkbox][name='zid[]'][value=${s}]`).prop('checked', true);
                //$(`input[id=zid][value=${s}]`).prop('checked', true);
            }
            if(urlMatch(`cusactivity`)){ // 只在活动组中填写，防止出现意外
                $(`#st_fu1`).val(serverList[0] || ``);
                $(`#st_fu2`).val(serverList[1]?serverList[1]:serverList[0] || ``);
            }
        }

        let serverTitle=$(`small`).eq(0).html().trim();
        let serverId=serverTitle.replace(/\D/g,``);
        let serverUrl;
        switch(serverId){
            case 213: case 207: //坦克
            case 202: case 205: //舰队
            default:
                serverUrl=`http://192.168.8.${serverId}/`;
            break;
        }
        serverUrl=`${serverUrl}tool/setservertime.php`;

        //活动开始、结束时间自动记忆
        if(!customGMData.activityTime){
            customGMData.activityTime=[];
        }
        if(customGMData.activityTime[0]){
            $(`#st`).val(customGMData.activityTime[0]);
        }
        if(customGMData.activityTime[1]){
            $(`#et`).val(customGMData.activityTime[1]);
        }
        $(`#st`).bind(`blur`,function(){
            customGMData.activityTime[0]=$(`#st`).val();
            saveStorage();
        });
        $(`#et`).bind(`blur`,function(){
            customGMData.activityTime[1]=$(`#et`).val();
            saveStorage();
        });
        $(`#st`).afterDOM([
            {tag:`button`,html:`×`,bind:{click(e){e.preventDefault();$(`#st`).val(``);customGMData.activityTime[0]=$(`#st`).val();saveStorage();return false;}}},
            {tag:`button`,id:`autoBu`,class:`autoFeature`,html:`开启当天活动`,bind:{click(e){
                e.preventDefault();
                switch(true){
                    case serverTitle.includes(`本地213`):{
                        // 本地213自动抓取服务器时间
                        getCurrentTime(serverUrl).then(serverTime=>{
                            if(serverTime){
                                let openTime=calcOpenTime(serverTime, parseInt($(`#autoDays`).val()));
                                $(`#st`).val(openTime.st);
                                customGMData.activityTime[0]=$(`#st`).val();
                                $(`#et`).val(openTime.et);
                                customGMData.activityTime[1]=$(`#et`).val();
                                saveStorage();
                            }
                        });
                        return false;
                    }
                    break;

                    case serverTitle.includes(`本地207`):{
                        // 本地207涉及跨域，无法抓取，采用Window传递消息
                        let timeWindow=new OpenWindow(`207调时间`,`http://192.168.8.207/tool/setservertime.php`,{min:true});
                        timeWindow.iframe.onload=function(){ // 创建调时间窗口并从中获取消息，然后再计算
                            setTimeout(()=>{
                                if(currentServerTime){
                                    let openTime=calcOpenTime(currentServerTime, parseInt($(`#autoDays`).val()));
                                    $(`#st`).val(openTime.st);
                                    customGMData.activityTime[0]=$(`#st`).val();
                                    $(`#et`).val(openTime.et);
                                    customGMData.activityTime[1]=$(`#et`).val();
                                    saveStorage();
                                    timeWindow.close();
                                }
                            },250);
                        }
                        return false;
                    }
                    break;

                    default:{
                        // 线上自动抓取本机当前时间
                        let openTime=calcOpenTime(new Date().format(`yyyy-MM-dd 00:00:00`), parseInt($(`#autoDays`).val()));
                        $(`#st`).val(openTime.st);
                        customGMData.activityTime[0]=$(`#st`).val();
                        $(`#et`).val(openTime.et);
                        customGMData.activityTime[1]=$(`#et`).val();
                        saveStorage();
                    }
                    break;
                }
                return false;
            }}},
        ]);
        $(`#et`).afterDOM([
            {tag:`button`,html:`×`,bind:{click(e){e.preventDefault();$(`#et`).val(``);customGMData.activityTime[1]=$(`#et`).val();saveStorage();return false;}}},
            {tag:`button`,id:`autoDayBu`,html:`开启指定天数`,bind:{click(e){
                e.preventDefault();
                let openTime=calcOpenTime($(`#st`).val(), parseInt($(`#autoDays`).val()));
                $(`#st`).val(openTime.st);
                customGMData.activityTime[0]=$(`#st`).val();
                $(`#et`).val(openTime.et);
                customGMData.activityTime[1]=$(`#et`).val();
                saveStorage();
                return false;
            }}},
            {tag:`input`,id:`autoDays`,type:`number`,value:`7`,title:`活动开启天数`,style:{width:`60px`}},
        ]);

        if(serverTitle.includes(`国内ios_飞流`)){
            $(`#autoBu`).afterDOM({tag:`button`,id:`autoBu993`,class:`autoFeature`,html:`开启993活动`,bind:{click(e){
                e.preventDefault();
                // 993涉及跨域，无法抓取，采用Window传递消息
                let timeWindow=new OpenWindow(`993调时间`,`http://134.175.148.230/tool/setservertime.php`,{min:true});
                timeWindow.iframe.onload=function(){ // 创建调时间窗口并从中获取消息，然后再计算
                    setTimeout(()=>{
                        if(currentServerTime){
                            let openTime=calcOpenTime(currentServerTime, parseInt($(`#autoDays`).val()));
                            $(`#st`).val(openTime.st);
                            customGMData.activityTime[0]=$(`#st`).val();
                            $(`#et`).val(openTime.et);
                            customGMData.activityTime[1]=$(`#et`).val();
                            saveStorage();
                            timeWindow.close();
                        }
                    },250);
                }
                return false;
            }}});
        }
        /*
        if(!serverTitle.includes(`本地`)){
            $(`.autoFeature`).remove(); //仅限本地开启，线上自动移除
        }
        */
    }

    function calcOpenTime(timeStr, days){
        let beginStr=`${timeStr.split(` `)[0]} 00:00:00`;
        let beginTs=parseInt(new Date(beginStr).getTime() / 1000);
        let endTs=beginTs + 86400*days - 1;
        console.log(beginTs, endTs);
        return {
            st:beginStr,
            et:new Date(endTs*1000).format(`yyyy-MM-dd hh:mm:ss`),
        };
    }

    async function getCurrentTime(url){
        let timeStr=await getServerTime(url);
        if(timeStr){
            return `${timeStr.split(` `)[0]} 00:00:00`;
        }
    }
}

async function getServerTime(url){
    //let timeHtml=await fetch(url,{mode:`no-cors`}).then((r)=>r.text()).catch((e)=>console.error(e));
    let timeHtml=await ajaxPromise(url);
    if(!timeHtml) return;
    let t=$(timeHtml);
    let timeEl=t.find(`input[name=date]`);
    let dateStr=timeEl.val().insert(6,`/`).insert(4,`/`);
    return new Date(dateStr).format(`yyyy-MM-dd hh:mm:ss`);
}

function autoOffAllActivity(){
    if(!urlMatch(`test_gm_index`) && false) return;
    if(urlMatch(`api/getactivity`) || urlMatch(`api/editactivity`)){
         $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
             {tag:`button`,id:`addArmyuniformMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键关闭所有活动`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                 if(confirm(`是否一键关闭所有活动？`)){
                     offAllActivity();
                 }
            }}}
         ]);
        //删除活动配置显示提示
        $(`input[name=cfg]`).attr(`onmouseover`,``);
        $(`input[name=cfg]`).attr(`onmouseout`,``);
    }
    async function offAllActivity(){
        //获取所有活动信息
        let actCount=$(`tr`).length;
        let actList=[];
        let actNameList=[];
        for(let i=0; i<actCount; i++){
            let tr=$(`tr`).eq(i);
            if(tr.attr(`style`)==`background-color:#ffff99` || tr.attr(`style`)==`background-color:#66ff99` || urlMatch(`test_gm_index`)){ //只改已开和未来要开的活动
                actList.push({
                    id:$(`input[name=id]`).eq(i).val(),
                    zid:$(`input[name=zid]`).eq(i).val(),
                    name:$(`input[name=name]`).eq(i).val(),
                    zids:$(`input[name=zids]`).eq(i).val(),
                    //st:$(`input[name=st]`).eq(i).val(),
                    //et:$(`input[name=et]`).eq(i).val(),
                    st:`2024-01-01 00:00:00`,
                    et:`2024-01-01 23:59:59`,
                    cfg:$(`input[name=cfg]`).eq(i).val(),
                });
                actNameList.push(tr.children(`td`).eq(1).html().replace(`活动名称 :`,``));
            }
        }

        let msg=new MsgWindow(`一键关闭所有活动`);

        for(let i=0; i<actList.length; i++){
            let postUrl=$(`form`).eq(i+1).attr(`action`);
            let postData=actList[i];
            let rs;
            try{
                rs=await ajaxPromise(postUrl, `POST`, postData);
                let rsHtml=$(rs);
                rs=rsHtml.find(`#msg`).text();
            }catch(e){
                rs=e;
            }
            msg.output(`${actNameList[i]} ${JSON.stringify(postData)} ${rs}`);
        }

        msg.output(`一键关闭完成！`);
        msg.enable();
    }
}

//坦克研发中心功能优化
function importTestTankYanfa(){
    let onekeyLimit=[26,43];
    let forLimit=[5,20];

    if(urlMatch(`test/rcenter`)){
        if($(`table`).children(`tbody`).children(`tr`).length<=35){
            forLimit=[5,8];
            onekeyLimit=[11,28];
        }
        $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
            {tag:`br`},
            {tag:`button`,id:`addYanfaMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`材料一键加满`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                onekeyMax(true);
            }}},
            {tag:`button`,id:`addYanfaMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`材料一键清空`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                onekeyMax(false);
            }}},
            {tag:`br`},
            {tag:`button`,id:`addLevel60`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`系统一键满级`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                addLevel(150,27);
            }}},
            /*
            {tag:`button`,id:`addLevel60`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`系统一键60级`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                addLevel(60);
            }}},
            */
            {tag:`button`,id:`addLevel20`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`系统一键20级`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                addLevel(20);
            }}},
            {tag:`button`,id:`addLevel20`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`系统一键1级`,bind:{click(e){
                 e.preventDefault();//阻止form中的按钮点击后自动提交
                addLevel(1);
            }}},
            {tag:`button`,id:`autoSave`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`系统一键保存`,bind:{click(e){
                e.preventDefault();//阻止form中的按钮点击后自动提交
                autoSave();
            }}}
         ]);
    }

    function onekeyMax(bool=true){
        //填写等级、金币等各种参数。
        let num=(bool==true?999999999:0);
        $(`input[id=jl]`).val(num).addClass(`changed`);
        //碎片
        let frmtEl=$(`input`);
        for(let i=0; i<frmtEl.length; i++){
            if(frmtEl.eq(i).attr(`name`) && frmtEl.eq(i).attr(`name`).startsWith(`c`)){
                frmtEl.eq(i).val(num).addClass(`changed`);
            }
        }
        let btnEl=$(`.btn.btn-primary.btn-sm`);
        btnEl.eq(btnEl.length-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        btnEl.eq(btnEl.length-1).focus();
        /*
        for(let i=onekeyLimit[0]; i<=onekeyLimit[1]; i++){
            let input=$(`table`).children(`tbody`).children(`tr`).eq(i).find(`input`);
            input.val(number).addClass(`changed`);
        }
        //滚动到提交位置
        $(`.btn.btn-primary.btn-sm`).eq(-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        $(`.btn.btn-primary.btn-sm`).eq(-1).focus();
        */
    }

    function addLevel(lv,ver){
        if(!ver) ver=lv;
        for(let i=forLimit[0]; i<=forLimit[1]; i++){
            let tr=$(`table`).children(`tbody`).children(`tr`).eq(i);
            let tankType=tr.children(`td`).eq(0).html().trim();
            let verInput=tr.children(`td`).eq(1).children(`input`);
            let lvlInput=tr.children(`td`).eq(2).children(`input`);
            let saveBu=tr.find(`input[value=save]`);
            verInput.val(ver).addClass(`changed`);
            lvlInput.val(lv).addClass(`changed`);
        }
    }

    async function autoSave(){
        let saveBuSubmitList=[];
        for(let i=forLimit[0]; i<=forLimit[1]; i++){
            let tr=$(`table`).children(`tbody`).children(`tr`).eq(i);
            let saveBu=tr.find(`input[value=save]`);
            if(saveBu.length>0){
                saveBuSubmitList.push(saveBu.attr(`onclick`).replace(`check`,`checkPromise`));
            }
        }
        //$(`font`).eq(1).beforeDOM(`div`,{id:`output`});

        let msg=new MsgWindow(`系统一键保存`);
        for(let [i,s] of saveBuSubmitList.entries()){
            let rs=await eval(s); // onclick中的调用为字符串形式，需要用eval执行
            msg.output(`[${i+1} / ${saveBuSubmitList.length}] ${rs}`);
            //$(`#output`).appendDOM(`p`,rs);
        }
        msg.output(`一键保存完成！`);
        msg.enable();
    }

    async function checkPromise(id,item,act){ // 改自自带函数check，封装Promise以支持循环中await

		var nickname = $("#name").val();
		var zoneid = $("#zid").val();
		var uid = $("#uid").val();

		if (id != '')
		{
			var ver = $("#ver_"+id).val();
			var cl = $("#cl_"+id).val();
			var lv = $("#lv_"+id).val();

			var a;
			$("#arr_xl"+id+" input").each(function(e){
				if(a){
					a = $(this).val()+":"+$(this).attr("name")+","+a;
				} else {
					a = $(this).val()+":"+$(this).attr("name");
				}
			});
		}

		var b;
		$("#prop input").each(function(e){
			if(b){
				b = $(this).val()+":"+$(this).attr("name")+","+b;
			} else {
				b = $(this).val()+":"+$(this).attr("name");
			}
		});


		var c;
		$("#chip input").each(function(e){
			if(c){
				c = $(this).val()+":"+$(this).attr("name")+","+c;
			} else {
				c = $(this).val()+":"+$(this).attr("name");
			}
		});

		var addfrmt = $("#addfrmt").val();
		var addfrmtcount = $("#addfrmtcount").val();

		//var url = 'http://192.168.8.213/test_gm_index/test/ajax_rcenter';
        var url = window.location.href.replaceAll(`rcenter`,`ajax_rcenter`);

        return new Promise((resolve, reject)=>{
            $.ajax({

                type: "POST",
                url: url,
                data:{"zid":zoneid,"uid":uid,"nickname":nickname,"at":id,"ver":ver,"lv":lv,"cl":cl,"act":act,"succ":a,"b":b,"c":c,"addfrmt":addfrmt,"addfrmtcount":addfrmtcount},
                success: function(result){

                    /*$.each(arr, function(key,value){

					$('#'+value+'').val('');
			   }); */

                    var r = eval('('+result+')');
                    if(r.result == 1) {
                        resolve(r.msg);
                    }else {
                        reject(r.msg);
                    }
                }
            });
        });
	}
}

function uid2zid(uid){
    uid=uid.split(``);
    for(let i=0; i<6; i++){ //去除uid后6位，剩余的就是服务器id。但uid和服务器id并不一一对应，因此仅输入时单向绑定。
        uid.pop();
    }
    uid=uid.join(``);
    return uid;
}

//自动检测UID对应服务器
function autoDetectServer(isInput){
    let gmServer=getGM();
    if(!isInput){
        if(customGMData && typeof customGMData.uid==`object` && customGMData.uid[gmServer]){
            $(`#uid`).val(customGMData.uid[gmServer]);
        }else if(customGMData && typeof customGMData.uid==`object` && typeof customGMData.uid.default==`string`/* && $(`#uid`).val()==``*/){
            $(`#uid`).val(customGMData.uid.default);
        }
    }
    if($(`#uid`).length>0 && ($(`#zid`).length>0 || $(`#zoneid`).length>0)){
        let zid=uid2zid($(`#uid`).val());
        //console.log(zid);
        let zidEl;
        switch(true){
            case $(`#zid`).length>0:
                //$(`#zid`).val(zid); //如果zid无法在select中找到，则显示为空
                zidEl=$(`#zid`);
            break;
            case $(`#zoneid`).length>0:
                //$(`#zoneid`).val(zid); //如果zid无法在select中找到，则显示为空
                zidEl=$(`#zoneid`);
            break;
        }
        if(zid || (customGMData.zid && customGMData.zid[gmServer])){
            let zidVal;
            //在服务器存在此项时，才允许写入val
            if(zidEl.children(`option[value=${zid}]`).length>0){
                zidVal=zid;
            }else if(customGMData.zid && customGMData.zid[gmServer]){
                zidVal=customGMData.zid[gmServer];
            }
            if(urlMatch(`http://gm.rayjoy.com/`) && parseInt(zid)<900){
                if(confirm(`警告！！！谨慎修改线上数据！！！`)){
                    zidEl.val(zidVal);
                }else{
                    $(`#uid`).val(``);
                }
            }else{
                zidEl.val(zidVal);
            }
        }
        /*if($(`option[value=${zid}]`).length>0){

        }*/
    }
    $(`#uid`).unbind(`change`);
    $(`#uid`).bind(`change`,function(){
        autoDetectServer(true);
        let gm=getGM();
        if(typeof customGMData.uid!=`object`){
            customGMData.uid={};
        }
        if(gm){
            customGMData.uid[gm]=$(`#uid`).val();
        }else{
            customGMData.uid.default=$(`#uid`).val();
        }
        saveStorage();
    });
    $(`#zid, #zoneid`).unbind(`change`);
    $(`#zid, #zoneid`).bind(`change`,function(){
        //autoDetectServer(true);
        let gm=getGM();
        if(typeof customGMData.zid!=`object`){
            customGMData.zid={};
        }
        if(gm){
            customGMData.zid[gm]=$(this).val();
        }else{
            customGMData.zid.default=$(this).val();
        }
        saveStorage();
    });
}

//疯狂坦克相关功能
function importCrazyTank(){
    //疯狂坦克用户信息
    if(urlMatch(`crazytank/crazyinfo`)){
        $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM(`button`,{
            id:`fktkOnekeyMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键升满`,bind:{click(e){
                fktkOnekeyMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}
        });
        $(`#fktkOnekeyMax`).eq(0).afterDOM(`button`,{
            id:`fktkOnekeyZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                fktkOnekeyMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}
        });
        //疯狂坦克飞艇经验自动计算
        let expRange=[
            {lv:[1,5],exp:30},
            {lv:[6,10],exp:50},
            {lv:[11,20],exp:60},
            {lv:[21,30],exp:70},
            {lv:[31,40],exp:80},
            {lv:[41,50],exp:90},
            {lv:[51,600],exp:100},
            {lv:[601,800],exp:200},
            {lv:[801,1010],exp:220},
            {lv:[1011,1230],exp:240},
            {lv:[1231,1460],exp:260},
            {lv:[1461,1700],exp:280},
            {lv:[1701,2000],exp:300},
        ];
        let stageRange=[0,5,15,30,50,90,150,240,360,480,600,800,1010,1230,1460,1700,2000];

        function stageToLevel(stage,level){
            return stageRange[stage]+level;
        }
        function levelToStage(level){
            for(let i=stageRange.length-1; i>=0; i--){
                if(stageRange[i] <= level){
                    return {stage:i,level:level-stageRange[i]};
                }
            }
        }
        function calcLevelExp(level){
            let totalExp=0;
            for(let i=0; i<expRange.length; i++){
                let curExpRange=expRange[i];
                for(let j=curExpRange.lv[0]; j<=curExpRange.lv[1]; j++){
                    if(j <= level){
                        totalExp+=curExpRange.exp;
                    }else{
                        return totalExp;
                    }
                }
            }
            return totalExp;
        }
        function calcExpLevel(exp){
            //for(let i=800; i>=0; i--){
            for(let i=stageRange.at(-1); i>=0; i--){
                let curExp=calcLevelExp(i);
                if(curExp <= exp){
                    return i;
                }
            }
        }
        function calcStageTotalLevel(stage){
            let lv=(stageRange[stage+1] || 0) - (stageRange[stage] || 0);
            return (lv>=0?lv:0);
        }
        function applyWingExp(type){
            switch(type){
                case `stage`: case `level`:{
                    let totalLevel=stageToLevel(parseInt($(`#wingStage`).val()), parseInt($(`#wingLevel`).val()));
                    $(`#wingTotalLevel`).val(totalLevel);
                    let stageLevel=levelToStage(totalLevel);
                    $(`#addwing`).val(stageLevel.stage - parseInt($(`#wing`).val())).addClass(`changed`);
                    let wingExp=calcLevelExp(totalLevel);
                    $(`#addwingexp`).val(wingExp - parseInt($(`#wingexp`).val())).addClass(`changed`);
                    $(`#wingLevel`).attr(`title`,`本阶总等级：${calcStageTotalLevel(parseInt($(`#wingStage`).val()))}`);
                }
                break;
                case `totalLevel`:{
                    let totalLevel=parseInt($(`#wingTotalLevel`).val());
                    let stageLevel=levelToStage(totalLevel);
                    $(`#wingStage`).val(stageLevel.stage);
                    $(`#wingLevel`).val(stageLevel.level);
                    $(`#addwing`).val(stageLevel.stage - parseInt($(`#wing`).val())).addClass(`changed`);
                    let wingExp=calcLevelExp(totalLevel);
                    $(`#addwingexp`).val(wingExp - parseInt($(`#wingexp`).val())).addClass(`changed`);
                }
                break;
                case `exp`:{
                    let wingExp=parseInt($(`#addwingexp`).val()) + parseInt($(`#wingexp`).val());
                    let totalLevel=calcExpLevel(wingExp);
                    let stageLevel=levelToStage(totalLevel);
                    $(`#wingStage`).val(stageLevel.stage);
                    $(`#wingLevel`).val(stageLevel.level);
                    $(`#wingTotalLevel`).val(totalLevel);
                    $(`#addwing`).val(stageLevel.stage - parseInt($(`#wing`).val())).addClass(`changed`);
                }
                break;
            }
        }
        //max: 98400
        if($(`#wingexp`).length>0){
            let curLevel=calcExpLevel(parseInt($(`#wingexp`).val()));
            let curStageLevel=levelToStage(curLevel);
            $(`#addwingexp`).afterDOM(`div`,{
                id:`wingExt`,class:`wingExt`,children:[
                    {tag:`span`,html:`飞艇等阶：　`},
                    {tag:`input`,attr:{id:`wingStage`,class:`wingStage`,type:`text`,title:`最高${stageRange.length-1}阶0级`,style:{width:`80px`},value:curStageLevel.stage,bind:{input(){applyWingExp(`stage`)}}}},
                    {tag:`span`,html:`<br>飞艇等级：　`},
                    {tag:`input`,attr:{id:`wingLevel`,class:`wingLevel`,type:`text`,title:`本阶总等级：${calcStageTotalLevel(curStageLevel.stage)}`,style:{width:`80px`},value:curStageLevel.level,bind:{input(){applyWingExp(`level`)}}}},
                    {tag:`span`,html:`<br>飞艇总等级：`},
                    {tag:`input`,attr:{id:`wingTotalLevel`,class:`wingTotalLevel`,type:`text`,title:`最高${expRange[expRange.length-1].lv[1]}级`,style:{width:`80px`},value:curLevel,bind:{input(){applyWingExp(`totalLevel`)}}}},
                ]
            });
            $(`#addwingexp`).attr(`title`,`最高98400经验`);
            $(`#addwingexp`).bind(`input`,function(){applyWingExp(`exp`)});
            $(`#addwing`).attr(`readonly`,true); // 禁止直接修改飞艇等阶，会出问题。必须同步计算经验、等级
        }
    }
    //疯狂坦克道具列表
    if(urlMatch(`crazytank/crazypropslist`)){
        $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM(`button`,{
            id:`fktkAddItemMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                fktkAddItemMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}
        });
        $(`#fktkAddItemMax`).eq(0).afterDOM(`button`,{
            id:`fktkAddItemZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                fktkAddItemMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}
        });
    }

    function fktkOnekeyMax(bool=true){
        //填写等级、宝箱等级。不需要考虑最大值，后端会自动处理
        if(bool==true){
            $(`#addcrazylv`).val(120 - parseInt($(`#crazylv`).val())).addClass(`changed`);
            $(`#addkxzlv`).val(30 - parseInt($(`#kxzlv`).val())).addClass(`changed`);
            //填写铜币、军费
            $(`#addbuygems`).val(`999999999`).addClass(`changed`);
            $(`#addb1`).val(`999999`).addClass(`changed`);
            //填写飞艇经验
            $(`#addwingexp`).val(98400 - parseInt($(`#wingexp`).val())).addClass(`changed`);
            //填写佣兵经验
            //$(`#addpetexp`).val(`999999999`).addClass(`changed`); //在开启该系统前不可一键写入，否则会报错
            //填写任务、宝箱数量
            if(parseInt($(`#task`).val())<133){ //仅在任务小于133时才填写
                $(`#tasksum`).val(`133`).addClass(`changed`);
            }
            $(`#addboxnum`).val(`999999`).addClass(`changed`);
        }else{
            //铜币、军费
            $(`#addbuygems`).val(`-${$(`#buygems`).val()}`).addClass(`changed`);
            $(`#addb1`).val(`-${$(`#b1`).val()}`).addClass(`changed`);
            //宝箱数量
            $(`#addboxnum`).val(`-${$(`#boxnum`).val()}`).addClass(`changed`);
        }
        //滚动到提交位置
        $(`.btn.btn-primary.btn-sm`).eq(1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        $(`.btn.btn-primary.btn-sm`).eq(1).focus();
    }
    function fktkAddItemMax(bool=true){
        let itemList=$(`.notice_tables`).children(`tbody`).children(`tr`);
        let itemLength=itemList.length-2; //去除底部的空行和提交按钮
        for(let i=0; i<itemLength; i++){
            let itemInput=itemList.eq(i).children(`td`).eq(1).children(`input`).eq(1);
            let originValue=itemList.eq(i).children(`td`).eq(1).children(`input`).eq(0);
            if(i!=21){ //禁止添加、清空镐头以防止出现bug
                if(bool==true){
                    itemInput.val(`999999`).addClass(`changed`);
                }else{
                    itemInput.val(`-${originValue.val()}`).addClass(`changed`);
                }
            }
        }
        $(`.btn.btn-primary.btn-sm`).eq(1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        $(`.btn.btn-primary.btn-sm`).eq(1).focus();
    }
}

//大冒险相关功能
function importOnhook(){
    if(urlMatch(`onhook/onhookuserinfo`)){
        $(`.btn.btn-primary.btn-sm`).eq(0).afterDOM([
            {tag:`button`,id:`onekeyMax`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键加满`,bind:{click(e){
                onekeyMax(true);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
            {tag:`button`,id:`onekeyZero`,class:`btn btn-primary`,style:{marginLeft:`4px`},html:`一键清空`,bind:{click(e){
                onekeyMax(false);
                e.preventDefault();//阻止form中的按钮点击后自动提交
            }}},
        ]);
    }

    function onekeyMax(bool){
        let maxNumDefault=[10000, 10000, 10000, 1000, 10000, 200, 1000, 1000, 999999];
        let maxNum=[null];
        for(let i=0; i<=12; i++){
            if(i<=7){
                maxNum.push(bool==true?maxNumDefault[i]:0);
            }else{
                maxNum.push(bool==true?maxNumDefault.at(-1):0);
            }
        }
        for(let i=1; i<maxNum.length; i++){
            let cur=maxNum[i];
            let tr=$(`.notice_tables`).find(`tr`).eq(i);
            let originNum=tr.find(`input`).eq(0).val();
            let changeNum=cur-parseInt(originNum);
            tr.find(`input`).eq(1).val(changeNum).addClass(`changed`);
        }
        $(`.btn.btn-primary.btn-sm`).eq(-1)[0].scrollIntoView({behavior: "smooth", block: "end"});
        $(`.btn.btn-primary.btn-sm`).eq(-1).focus();
    }
}

function importPayment(){
    if((urlMatch(`test_gm_index`) || urlMatch(`devtank.raysns.com`) || urlMatch(`tank_gm`)) && urlMatch(`/userinfo_gold`)){// 仅限本地GM生效
        setCustomStyle([
            {name:`#msg`,style:`display:none`},
            {name:`.batchPayMod`,style:`
                position:absolute;
                top:405px;
				left:220px;
            `},
			{name:`.payMod`,style:`
				position:absolute;
				//top:410px;
                //top:${$(`.main-container-inner`).height() + 45}px;
                top:430px;
				left:220px;
				//width:460px;
				width:680px;
				height:292px;
				overflow-x:scroll;
				overflow-y:hidden;
				border:1px solid #CCC;
			`},
			{name:`.payList`,style:`
				display: flex;
				flex-flow: column wrap;
				align-content: flex-start;
				height: 290px;
			`},
			{name:`.payList li`,style:`
				margin-right:4px;
			`},
			{name:`.paySelBu`,style:`
				width:192px;
                text-align:left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size:12px;
			`},
			{name:`.lastClicked`,style:`
				background-color: rgba(255,255,192,1);
                border:2px solid !important;
			`},
            {name:`.lastPayed`,style:`
				background-color: rgba(192,255,192,1);
                border:1px solid;
			`},
			{name:`ul, li`,style:`
				list-style: none;
				padding: 0px;
				margin: 0px;
				vertical-align: middle;
			`},
            {name:`.sortable-ghost`,style:`
				opacity: 0;
			`},
		]);
        if(isInIframe()){
            setCustomStyle([
                {name:`.batchPayMod`,style:`
                    position:absolute;
                    top:160px;
				    left:340px;
                `},
                {name:`.payMod`,style:`
                    position:absolute;
				    overflow-x:scroll;
				    overflow-y:hidden;
				    border:1px solid #CCC;
				    top:185px;
                    left:340px;
                    height:240px;
                    width:290px;
			    `},
                {name:`.payList`,style:`
                    display: flex;
				    flex-flow: column wrap;
				    align-content: flex-start;
                    height:240px;
			    `},
            ]);
        }
        // 读取支付档位
        if(!customGMData.payList){
            customGMData.payList=[];
            saveStorage();
        }
        let payMap=new Map();
        let paySelEl=$(`#sel_recommender`).children(`option`);
        for(let i=1; i<paySelEl.length; i++){
            let curSel=paySelEl.eq(i); // 517 - 历练对决
            let curSelId=curSel.val();
            let curSelName=curSel.text().trim();
            let curObj={
                id:curSelId,
                name:curSelName,
            }
            payMap.set(curSelId,curObj);
        }
        console.log(payMap);

        $(`.select2.select2-container.select2-container--default`).eq(-1).afterDOM([
            {tag:`input`,id:`payMarkup`,type:`text`,placeholder:`自定义名称`},
            {tag:`button`,id:`payAddBu`,class:`payAddBu`,
                html:`+`, bind:{click(){
                    let payData=payMap.get($(`#sel_recommender`).val());
                    if($(`#payMarkup`).val()){
                        let payNameSp=payData.name.split(` - `);
                        payNameSp[1]=$(`#payMarkup`).val();
                        payData.name=payNameSp.join(` - `);
                    }
                    addPayList(payData, parseInt($(`#get_gems`).val()), $(`#product`).val());
                    return false;
                }}
            }
        ]);

        if(!urlMatch(`tank_gm`) || true){ // 仅限本地允许连续充值
            $(`body`).appendDOM({tag:`div`,id:`batchPayMod`,class:`batchPayMod`,children:[
                {tag:`input`,id:`batchPayNum`,class:`batchPayNum`,placeholder:`连续充值次数`,value:10},
                {tag:`button`,id:`batchPay`,class:`batchPay`,html:`连续充值`,title:`单击选中，填写次数，连续充值。`,bind:{click(){batchLaunchPay()}}},
            ]});
        }
        $(`body`).appendDOM({tag:`div`,id:`payMod`,class:`payMod`,children:[
            {tag:`div`,id:`payListRoot`,class:`payListRoot`},
        ]});

        //横向滚轮
        let selZone=document.getElementById(`payMod`);
        selZone.addEventListener('mousewheel',handler,false)
        function handler(event){
            event.preventDefault();
            var detail = event.wheelDelta || event.detail;
            var moveForwardStep = -1;
            var moveBackStep = 1;
            var step = 0;
            if(detail > 0){
                step = moveForwardStep*100;
            }else{
                step = moveBackStep * 100;
            }
            selZone.scrollLeft += step;
            return false;
        }

        applyPayList();
        /*
        document.addEventListener("DOMNodeInserted",function(e){
            let node = e.target;
            if(node.className==`select2-container select2-container--default select2-container--open`){
                let selEl=$(`.select2-dropdown.select2-dropdown--below`).find(`.select2-results__option`);
                for(let i=0; i<selEl.length; i++){
                    let curSel=selEl.eq(i);
                    let curId=curSel.attr(`id`).split(`-`).at(-1);
                    let curName=curSel.find(`span`).text().trim();
                    curSel.appendDOM(`button`,{
                        id:`payAddBu_${i}`, class:`payAddBu`, html:`+`, bind:{
                            click:{
                                data:{id:curId, name:curName},
                                function(e){
                                    console.log(e.data);
                                    return false;
                                }
                            }
                        }
                    });
                }
            }
        });
        */
    }

    function applyPayList(){
        $(`.payList`).remove();
        $(`#payListRoot`).appendDOM(`ul`,{
            id:`payList`,class:`payList`,children:customGMData.payList.map((el,i)=>{
                return {tag:`li`,dragindex:i,children:[
                    {tag:`button`,attr:{id:`handle_${i}`,class:`handle`,html:`＝`}},
                    {tag:`button`, id:`paySelBu_${i}`, class:`paySelBu`, html:el.name, title:el.name, index:i, bind:{
                        click:{
                            data:{...el, i:i},
                            function(e){
                                $(`.paySelBu`).removeClass(`lastClicked`);
                                $(`#paySelBu_${e.data.i}`).addClass(`lastClicked`);
                                return false;
                            }
                        },
                        dblclick:{
                            data:{...el, i:i},
                            function(e){
                                launchPay(e.data.i, e.data);
                                return false;
                            }
                        }
                    }},
                    {tag:`button`, id:`payDelBu_${i}`, class:`payDelBu`, html:`×`, bind:{
                        click:{
                            data:{...el, i:i},
                            function(e){
                                if(confirm(`是否删除${customGMData.payList[i].name}？`)){
                                    delPayList(e.data.i);
                                }
                                return false;
                            }
                        }
                    }}
                ]}
            }),
        });
        Sortable.create(document.getElementById(`payList`), {
            animation: 300,
            handle: '.handle',
            onEnd: function(evt){ //拖拽完毕之后发生该事件
                let sortArray=new Array();
                let sortSelect;
                for(let i=0; i<evt.to.children.length; i++){
                    sortArray.push(customGMData.payList[parseInt(evt.to.children[i].getAttribute(`dragindex`))]);

                }
                customGMData.payList=sortArray;
                saveStorage();
                applyPayList();
            }
        });
    }

    function addPayList(payData, gold, product){
        if(!payData) return;
        let payName=`${payData.name} (${gold})`;
        if(product){
            payName+=` ${product}`;
        }
        customGMData.payList.push({...payData, name:payName, gold:gold, product:product});
        saveStorage();
        applyPayList();
    }
    function delPayList(i){
        customGMData.payList.splice(i, 1);
        saveStorage();
        applyPayList();
    }

    let timeout;
    async function launchPay(i,data,num=``){
        console.log(i,data);
        $(`.paySelBu`).removeClass(`lastPayed`);
        $(`#paySelBu_${i}`).addClass(`lastPayed`);
        $(`button`).attr(`disabled`,``);

        let gm=$(`#gm`).val();
        let uid=$(`#uid`).val();
        let zid=$(`#zid`).val();
        let name=$(`#name`).val();

        let url=window.location.pathname.replace(`userinfo`,`bag`);
        let getUrl=window.location.pathname.replace(`userinfo_gold`,`ajax_changeGold`);
        let postUrl=getUrl.replace(`user/ajax_changeGold`,`api/updateuserinfo`);
        let payInfo=JSON.parse(await ajaxPromise(getUrl,`POST`,{dw:data.id}));
        console.log(payInfo);

        let postData={
            gm:gm, zid:zid, uid:uid, name:name, userinfo_gold:1,
            gems: parseInt($(`#gems`).val())+payInfo.data.gold,
            get_gems: data.gold || payInfo.data.gold,
            itemid: data.id,
            //舰队参数
            product_name:data.id,
            product:data.product,
            today:$(`#today`).val(),
            order:``,
            gm_session:gm,
        };
        console.log(postData);
        let rs;
        try{
            rs=JSON.parse(await ajaxPromise(postUrl, `POST`, postData));
        }catch(e){
            rs=`Error: ${e}`;
            console.error(e);
        }
        $(`#tishi`).html(`<font color="${rs.msg==`save Success !!`?`green`:`red`}" size="5">${rs.msg} ${num}</font>`);
        $(`#tishi`).css(`display`,``);
        clearTimeout(timeout);
        timeout=setTimeout(()=>{
            $(`#tishi`).css(`display`,`none`);
        },3000);
        $(`button`).removeAttr(`disabled`);
    }
    async function batchLaunchPay(){
        let payCount=parseInt($(`#batchPayNum`).val()) || 0;
        let payIndex=parseInt($(`.lastClicked`).eq(0).attr(`index`)) || 0;
        if(payCount>=0 && payIndex>=0){
            let payData=customGMData.payList[payIndex];
            for(let i=1; i<=payCount; i++){
                await launchPay(payIndex,payData,i);
            }
        }
    }
}

//欧洲杯相关优化
function importFootball(){
    if(urlMatch(`/qsjc`)){
        /*
        $(`input[type=submit]`).bind(`click`,async function(e){
            e.preventDefault();
            $(`#msg`).css(`display`,``);
            $(`#msg`).html(`提交中……`);
            let formData = $(`form`).serialize();
            let rs=await ajaxPromise(``,`POST`,formData);
            let rsEl=$(rs);
            $(`#msg`).html(`提交结果：${rsEl.find(`#msg`).html()}`);
            return false;
        });
        */
        window.select_c=function()
        {
            var date_array = $("#date_array").val();
            var group = $("#group").val();
            var url = 'http://192.168.8.213/test_gm_index/data/qsjc_set';
            var zid = $("input:checkbox:checked").val()
            $.ajax({
                type: "POST",
                url: url,
                data: { "zid":zid,"date_array": date_array, "group": group,"get":1},
                success: function (result) {
                    var r = eval('(' + result + ')');
                    if(r.data && r.data.participantA){
                        var a = parseInt(r.data.participantA)
                        var all_options = document.getElementById("participantA").options;
                        for (i=0; i<all_options.length; i++){
                            if (all_options[i].value == r.data.participantA)  // 根据option标签的ID来进行判断  测试的代码这里是两个等号
                            {
                                all_options[i].selected = true;
                            }
                        }
                    }
                    if(r.data && r.data.participantB){
                        var all_options = document.getElementById("participantB").options;
                        for (i=0; i<all_options.length; i++){
                            if (all_options[i].value == r.data.participantB)  // 根据option标签的ID来进行判断  测试的代码这里是两个等号
                            {
                                all_options[i].selected = true;
                            }
                        }
                    }
                    if(r.data && r.data.scoreA){
                        $(`#scoreA`).val(r.data.scoreA);
                    }else{
                        $(`#scoreA`).val(``);
                    }
                    if(r.data && r.data.scoreB){
                        $(`#scoreB`).val(r.data.scoreB);
                    }else{
                        $(`#scoreB`).val(``);
                    }
                    if(r.data && r.data.result && r.data.result>0){
                        $(`#result`).val(r.data.result);
                    }else{
                        $(`#result`).val(``);
                    }
                }
            });
        }
    }
}

function importTools(){
    setCustomStyle([
        {name:`.toolTitleBu`,style:`
            height:22px;
            background:#62a8d1;
            border:1px solid #579ec8;
            color:#FFF;
            font-size:12px;
        `},
        {name:`.toolTitleBu:hover`,style:`
            background:#579ec8;
        `},
        {name:`.submenuBu`,style:`
            margin-top: -30px;
            margin-left: 160px;
            position: absolute;
            width: 24px;
            height: 24px;
            font-size:14px;
            padding:0px;
            font-family:'新宋体';
        `},
    ]);
    let serverPrefix=`/test_gm_index`;
    switch(true){
        case urlMatch(`test_gm_index`):
            serverPrefix=`/test_gm_index`;
        break;
        case urlMatch(`/tank_gm/gm_index`):
            serverPrefix=`/tank_gm/gm_index`;
        break;
        case urlMatch(`/gm_bigship`):
            serverPrefix=`/gm_bigship`;
        break;
    }
    if(window.frameElement==null){
        let toolPage=[
            {name:`信息`,url:`${serverPrefix}/user/userinfo?gm=${getGM()}`},
            {name:`资源`,url:`${serverPrefix}/user/userinfo_resource?gm=${getGM()}`},
            {name:`部队`,url:`${serverPrefix}/user/troops?gm=${getGM()}`},
            {name:`背包`,url:`${serverPrefix}/user/bag?gm=${getGM()}`},
            {name:`充值`,url:`${serverPrefix}/user/userinfo_gold?gm=${getGM()}`,style:{color:`#FF0`}},
            {name:`昵称`,url:`${serverPrefix}/user/updatename?gm=${getGM()}`},
            {name:`解锁`,url:`${serverPrefix}/user/userlock?gm=${getGM()}`},
            {name:`活动录入`,url:`${serverPrefix}/user/activity?gm=${getGM()}`},
            {name:`活动信息`,url:`${serverPrefix}/user/editentry?gm=${getGM()}`},
            {name:`发布活动`,url:`${serverPrefix}/user/upactivity?gm=${getGM()}`},
            {name:`活动列表`,url:`${serverPrefix}/user/editactivity?gm=${getGM()}`},
            {name:`发布开关`,url:`${serverPrefix}/user/function_editopen?gm=${getGM()}`},
            {name:`世界叛军`,url:`${serverPrefix}/test/rebellist?gm=${getGM()}`},
            {name:`世界金矿`,url:`${serverPrefix}/test/goldmine?gm=${getGM()}`},
            {name:`欧米伽小队`,url:`${serverPrefix}/test/shipboss?gm=${getGM()}`},

            {name:`213调时间`,url:`http://192.168.8.213/tool/setservertime.php`},
            {name:`207调时间`,url:`http://192.168.8.207/tool/setservertime.php`},
            {name:`204调时间`,url:`http://192.168.8.204/tool/setservertime.php`},
            {name:`993调时间`,url:`http://134.175.148.230/tool/setservertime.php`},
        ];
        for(let tool of toolPage){
            $(`#navbar-container`).appendDOM({
                tag:`button`,class:`toolTitleBu`,html:tool.name,style:tool.style,bind:{click:{
                    data:{...tool},
                    function(e){
                        new OpenWindow(e.data.name,e.data.url);
                    }
                }}
            });
        }
        // 全功能小窗
        let submenu=$(`.submenu`);
        let submenu_li=submenu.children(`li`);
        for(let i=0; i<submenu_li.length; i++){
            let cur=submenu_li.eq(i);
            let name=cur.text().trim();
            let href=cur.find(`a`).attr(`href`);
            cur.appendDOM({tag:`button`,class:`submenuBu`,html:`□`,bind:{click:{
                data:{name:name,url:href},
                function(e){
                    new OpenWindow(e.data.name,e.data.url);
                }
            }}});
        }
    }
}

function isInIframe() {
    try {
        return window !== window.top;
    } catch (e) {
        // 如果由于跨域安全策略导致错误，则返回true
        return true;
    }
}

let aliveInterval;
function keepAlive(){
    // 自动保活功能（实验性）
    if(isInIframe()){
        console.log(`Keep Alive Session: Disabled in iframe.`);
        return;
    }
    let gm=getGM();
    if(!gm) return;
    let url;
    switch(true){
        case urlMatch(`test_gm_index`):
            url=`${window.location.origin}/test_gm_index/user/userinfo?gm=${gm}`;
        break;
        case urlMatch(`devtank.raysns.com/gm_bigship/`):
            url=`${window.location.origin}/gm_bigship/user/userinfo?gm=${gm}`;
        break;
        default:
            console.log(`No Keep Alive Session`);
            return;
        break;
    }
    // 每分钟调用一次userinfo，以此来刷新session达到保活的目的。
    clearInterval(aliveInterval);
    console.log(`Keep Alive Session: ${url}`);
    aliveInterval=setInterval(async ()=>{
        loadStorage(); // 针对开多页面，customGMData会出现不一致的情况，因此读取一次本地存储，同步数据。
        let uid=customGMData.uid[gm] || 0;
        let zid=uid2zid(uid);
        let data={
            gm:gm,
            uid:uid,
            name:``,
            zid:zid,
            gm_session:gm,
        };
        let rs=await ajaxPromise(url, `POST`, data);
        console.log(`Keep Alive Session: ${url} ${JSON.stringify(data)}`);
    },1000*60);
}


function main(){
    loadStorage();
    importLogin();
    importUserInfo();
    importTestTankYanfa();
    importActivity();
    importActivityConfigApply();
    autoInsertActivityTime();
    autoOffAllActivity();
    importCrazyTank();
    importOnhook();
    importPayment();
    importTools();
    //importFootball();
    autoDetectServer();
    alertConfirmOpt();
    keepAlive();
    insertCustomStyle();
    receiveWindowMessage();
}

(function() {
    'use strict';
    main();
})();

/*
Original style backup

.changed{
    border-color:#F00 !important;
}
.importActivityDiv{
    margin-top:8px;
    margin-bottom:8px;
}
.importText{
    width:500px;
    height:138px;
    resize:none;
}
.importText::placeholder{
    color:#CCC;
}
.importBu{
    margin-top:8px;
    margin-bottom:8px;
}
.configApplyText{
    width:500px;
    height:138px;
    resize:none;
}
.configApplyText::placeholder{
    color:#CCC;
}
.yellowBG{
    background:#FF0 !important;
}

.clearMsg{
    position:fixed;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    background:rgba(0,0,0,0.5);
    z-index:1000;
}
.clearMsgWindow{
    position:absolute;
    top:0px;
    left:0px;
    right:0px;
    bottom:0px;
    width:60%;
    height:70%;
    margin:auto;
    background:#FFF;
    border-radius:5px;
    overflow:hidden;
}
.clearMsgTitle{
    position:absolute;
    top:0px;
    left:0px;
    right:0px;
    height:48px;
    line-height:48px;
    text-align:center;
    vertical-align:middle;
    font-size:18px;
    background:#438eb9;
    color:#FFF;
}
.clearMsgContent{
    position:absolute;
    top:calc(48px + 16px);
    left:48px;
    right:48px;
    bottom:64px;
    border:1px solid #CCC;
    border-radius:5px;
    padding:16px;
    overflow-y:auto;
}
.clearMsgControl{
    position:absolute;
    left:0px;
    right:0px;
    bottom:0px;
    height:64px;
    line-height:64px;
    text-align:center;
    vertical-align:middle;
}
.subPageFrame{
    position:fixed;
    top:-999;
    left:-999;
    width:1px;
    height:1px;
    overflow:hidden;
}
.checkInput{
    margin: -16px;
    width: calc(40% + 16px);
    height: calc(100% + 16px * 2);
    border-left: none;
    border-top: none;
    border-bottom: none;
    outline: none;
    resize: none;
    line-height:22px;
    padding:0px;
    font-size:12px;
}
.checkResult{
    position: absolute;
    top: 0px;
    left: calc(40% + 8px);
    right: 0px;
    bottom: 0px;
    overflow-y: auto;
    font-size:12px;
}
.checkResultP{
    margin:0px;
}
.success{
    color:#008000;
}
.success.more{
    color:#008080;
}
.failed{
    color:#FF0000;
}
.warning{
    color:#808000;
}
.checkTable{
    width:100%;
}
.checkTr{
    height:22px;
}

.payMod{
    position:absolute;
    top:410px;
    left:220px;
    \/*width:460px;*\/
    width:680px;
    height:300px;
    overflow-x:scroll;
    overflow-y:hidden;
    border:1px solid #CCC;
}

.payList{
    display: flex;
    flex-flow: column wrap;
    align-content: flex-start;
    height: 290px;
}
.payList li{
    margin-right:4px;
}

.paySelBu{
    width:192px;
}
.lastClicked {
    background-color: rgba(255,255,192,1);
}
ul, li {
    list-style: none;
    padding: 0px;
    margin: 0px;
    vertical-align: middle;
}

.toolTitleBu{
    height:22px;
    background:#62a8d1;
    border:1px solid #579ec8;
    color:#FFF;
    font-size:12px;
}
.toolTitleBu:hover{
    background:#579ec8;
}
.innerWindow{
    position:fixed;
    background:#FFF;
    border:5px solid #438eb9;
    border-top:none;
    overflow:hidden;
    box-shadow:0px 0px 5px #000;
    transition: width 0.25s ease, height 0.25s ease;
}
.innerWindow.min{
    width:192px !important;
    height:32px !important;
}
.innerWindow.min .innerTitle{
    padding-right:64px;
}
.innerTitle{
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    font-size: 16px;
    background: #438eb9;
    color: #FFF;
    user-select:none;
    transition:all 0.25s ease;
}
.innerMinBu{
    position:absolute;
    top:0px;
    right:32px;
    width:32px;
    height:32px;
    font-size: 20px;
    background:transparent;
    border:none;
    color:#FF0;
}
.innerCloseBu{
    position:absolute;
    top:0px;
    right:0px;
    width:32px;
    height:32px;
    font-size: 20px;
    background:transparent;
    border:none;
    color:#F00;
}
.innerFrame{
    position:absolute;
    top:32px;
    width:100%;
    height:calc(100% - 32px);
    border:none;
}

//let innerZIndex=100000;
function openWindow(name,url,args){
    args={
        ...{
            width:640,
            height:480,
            x:192,
            y:86,
        },
        ...args,
    }
    if(findCustomStyle(`.innerWindow`)<0){
        setCustomStyle([
            {name:`.innerWindow`,style:`
                position:fixed;
                background:#FFF;
                border:5px solid #438eb9;
                border-top:none;
                overflow:hidden;
                box-shadow:0px 0px 5px #000;
                transition: width 0.25s ease, height 0.25s ease;
            `},
            {name:`.innerWindow.min`,style:`
                width:192px !important;
                height:32px !important;
            `},
            {name:`.innerWindow.min .innerTitle`,style:`
                padding-right:64px;
            `},
            {name:`.innerTitle`,style:`
                position: absolute;
                top: 0px;
                left: 0px;
                right: 0px;
                height: 32px;
                line-height: 32px;
                text-align: center;
                vertical-align: middle;
                font-size: 16px;
                background: #438eb9;
                color: #FFF;
                user-select:none;
                transition:all 0.25s ease;
                cursor:move;
            `},
            {name:`.innerMinBu`,style:`
                position:absolute;
                top:0px;
                right:64px;
                width:32px;
                height:32px;
                font-size: 20px;
                background:transparent;
                border:none;
                color:#FF0;
            `},
            {name:`.innerMaxBu`,style:`
                position:absolute;
                top:0px;
                right:32px;
                width:32px;
                height:32px;
                font-size: 20px;
                background:transparent;
                border:none;
                color:#0FF;
            `},
            {name:`.innerCloseBu`,style:`
                position:absolute;
                top:0px;
                right:0px;
                width:32px;
                height:32px;
                font-size: 20px;
                background:transparent;
                border:none;
                color:#F00;
            `},
            {name:`.innerFrame`,style:`
                position:absolute;
                top:32px;
                width:100%;
                height:calc(100% - 32px);
                border:none;
            `},
        ]);
    }
    $(`#innerWindow_${name}`).remove();
    if(url){
        $(`body`).appendDOM({tag:`div`,id:`innerWindow_${name}`,class:`innerWindow`,style:{
            width:`${args.width+10}px`,height:`${args.height+10}px`,left:`${args.x}px`,top:`${args.y}px`,zIndex:innerZIndex,
        },children:[
            {tag:`div`,id:`innerTitle_${name}`,class:`innerTitle`,html:name},
            {tag:`button`,class:`innerMinBu`,html:`-`,bind:{click(){$(`#innerWindow_${name}`).toggleClass(`min`)}}},
            {tag:`button`,class:`innerMaxBu`,html:`▣`,bind:{click(){window.open(url)}}},
            {tag:`button`,class:`innerCloseBu`,html:`×`,bind:{click(){$(`#innerWindow_${name}`).remove()}}},
            {tag:`iframe`,id:`innerFrame_${name}`,class:`innerFrame`,src:url},
        ]});
        innerZIndex++;

        const draggable = document.getElementById(`innerTitle_${name}`);
        const dragWindow= document.getElementById(`innerWindow_${name}`);
        const dragFrame = document.getElementById(`innerFrame_${name}`);
        const innerFrames=$(`.innerFrame`);
        let active = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let initialWindowX;
        let initialWindowY;

        dragWindow.addEventListener(`mousedown`, function(e) {
            dragWindow.style.zIndex=innerZIndex++;
        });
        dragFrame.addEventListener(`mousedown`, function(e) {
            dragWindow.style.zIndex=innerZIndex++;
        });

        draggable.addEventListener(`mousedown`, function(e) {
            initialX = e.clientX - dragWindow.offsetLeft;
            initialY = e.clientY - dragWindow.offsetTop;
            initialWindowX = window.screenX;
            initialWindowY = window.screenY;
            active = true;
            dragWindow.style.zIndex=innerZIndex++;
        });
        window.addEventListener(`mousemove`, function(e) {
            if (active) {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                dragWindow.style.left = `${currentX}px`;
                dragWindow.style.top = `${currentY}px`;
                $(`.innerFrame`).css(`pointer-events`,`none`);
                $(`.innerFrame`).css(`opacity`,`0.5`);
            }else{
                $(`.innerFrame`).css(`pointer-events`,`auto`);
                $(`.innerFrame`).css(`opacity`,`1`);
            }
        });
        window.addEventListener(`mouseup`, function() {
            active = false;
        });
        // 阻止选中文本
        draggable.addEventListener(`dragstart`, function(event) {
            event.preventDefault();
        });
    }
}


function insertMsgWindow(){
    setCustomStyle([
        {name:`.clearMsg`,style:`
            position:fixed;
            top:0px;
            left:0px;
            right:0px;
            bottom:0px;
            background:rgba(0,0,0,0.5);
            z-index:1000;
        `},
        {name:`.clearMsgWindow`,style:`
            position:absolute;
            top:0px;
            left:0px;
            right:0px;
            bottom:0px;
            width:60%;
            height:70%;
            margin:auto;
            background:#FFF;
            border-radius:5px;
            overflow:hidden;
        `},
        {name:`.clearMsgTitle`,style:`
            position:absolute;
            top:0px;
            left:0px;
            right:0px;
            height:48px;
            line-height:48px;
            text-align:center;
            vertical-align:middle;
            font-size:18px;
            background:#438eb9;
            color:#FFF;
        `},
        {name:`.clearMsgContent`,style:`
            position:absolute;
            top:calc(48px + 16px);
            left:48px;
            right:48px;
            bottom:64px;
            border:1px solid #CCC;
            border-radius:5px;
            padding:16px;
            overflow-y:auto;
        `},
        {name:`.clearMsgControl`,style:`
            position:absolute;
            left:0px;
            right:0px;
            bottom:0px;
            height:64px;
            line-height:64px;
            text-align:center;
            vertical-align:middle;
        `},

    ]);
    $(`body`).appendDOM(`div`,{
        id:`clearMsg`,class:`clearMsg hide`,style:`display:none;`,children:[
            {tag:`div`,class:`clearMsgWindow`,children:[
                {tag:`div`,id:`msgTitle`,class:`clearMsgTitle`,html:``},
                {tag:`div`,id:`msgContent`,class:`clearMsgContent`,html:``},
                {tag:`div`,id:`clearMsgControl`,class:`clearMsgControl`,children:[
                    {tag:`button`,id:`hideBu`,class:`btn btn-primary`,html:`关闭`,disabled:true,bind:{click(e){
                        showMsg(false);
                    }}},
                ]},
            ]}
        ]
    });
}

function showMsg(bool){
    if(bool==undefined || bool==true){
        $(`#clearMsg`).removeClass(`hide`);
        $(`#clearMsg`).css(`display`,``);
        $(`#hideBu`).attr(`disabled`,true);
    }else{
        $(`#clearMsg`).addClass(`hide`);
        $(`#clearMsg`).css(`display`,`none`);
    }
}
function msgOpt(type,content){
    switch(type){
        case `clear`:
            $(`#msgTitle`).html(``);
            $(`#msgContent`).html(``);
		break;
		case `show`:
			$(`#msgTitle`).html(content);
		break;
        case `push`:
            $(`#msgContent`).appendDOM(`p`,content);
            $(`#msgContent`)[0].scrollTop+=999999;
		break;
    }
}

*/
