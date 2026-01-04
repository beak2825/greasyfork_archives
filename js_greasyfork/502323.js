// ==UserScript==
// @name				Mortal GUI Appeareance Improvement
// @name:zh				Mortal界面美化、功能增强
// @name:zh-CN			Mortal界面美化、功能增强
// @name:zh-TW			Mortal界麵美化、功能增強
// @description			Improve the appearance of mortal killerducky GUI
// @description:zh		美化界面，允许自定义背景、牌背等，添加恶手率、牌效计算等
// @description:zh-CN	美化界面，允许自定义背景、牌背等，添加恶手率、牌效计算等
// @description:zh-TW	美化界麵，允許自定義背景、牌背等，添加噁手率、牌效計算等
// @version				2.0.1
// @namespace			Mortal Appearance
// @author				CiterR
// @icon				https://mjai.ekyu.moe/favicon-32x32.png
// @match				*://mjai.ekyu.moe/killerducky/*
// @grant				GM_addStyle
// @grant				GM_setValue
// @grant				GM_getValue
// @grant				unsafeWindow
// @license 			MIT
// @downloadURL https://update.greasyfork.org/scripts/502323/Mortal%20GUI%20Appeareance%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/502323/Mortal%20GUI%20Appeareance%20Improvement.meta.js
// ==/UserScript==

/*
--------------------------- BUG ---------------------------
☑1.暗杠dora显示问题，和.float元素div的overflow有关
☑2.牌效计算时提前计入了未开宝指
☑3.牌效悬浮窗没响应鼠标移出事件时导致的驻留

-------------------------- TODO ---------------------------
  1.牌效不计算7对
  2.计算改良（性能允许情况）
  3.计算一向听的好型率
☑4.优化计算恶手率的启动方式
  5.添加吃碰牌时的牌效计算
*/

//--------------------------------------------  CSS Part should start here  --------------------------------------------//

function mortalAddStyle() {
    let css = `
	/*All the URL in this script shouldn't provide to users*/

    .grid-main {
      background-position: center;/*桌布居中*/
      /*background-position-x: 0px;/*水平调整*/
      /*background-position-y: 0px;/*垂直调整*/
      /*background-size: 145%; /*桌布缩放控制*/
      border-radius: 15px;
      border: 2px solid pink;
    }/*添加桌布*/

    .grid-info {
      border: 2px;
      border-color: white;
      border-style: solid;
      border-radius: 24px;
      background: #93adae;
      z-index: 3; /*和牌顶3D模拟配合使用*/
    }/*中央信息板 */

    .killer-call-img {
      position: relative;
      top: 50px;
      scale: 1.2;
    }/*Mortal外观调整*/

	html {
	  height: 98%;
	}/*避免滚动条*/

    body {
      /*background: white;*/
	  background: linear-gradient(90deg, #2351ff8a, #0bfff7, #fff, #e7eaa7c9, #ff3e4f);
      height: 98%;
    }/*网页颜色更改*/

	.outer {
	  margin-left: -100px;
	}/*主页面左偏置*/

	.opt-info {
	  margin-left: 90px;
	}/*指示栏偏置*/

	.opt-info table {
	  border-radius: 15px;
	  background: #74abb6;
	  box-shadow: 4px -4px 6px 1px #f6f6f6;
	}/*指示栏样式调整*/

    /* img[src="media/Regular_shortnames/back.svg"]{
      content: url('');
    }/*牌背设置*/

    .grid-hand {
      background: hsl(0deg 0% 100% / 0%);
    }/*对手手牌区透明化*/

    .grid-hand-p3 {
      height: 530px;
    }/*上家鸣牌位置调整*/

    .grid-hand-p0-container{
      background: hsl(0deg 0% 100% / 0%);
      scale: 1.15;
      width: 555px;   /*手牌宽度减少，避免穿模，可能会引发问题*/
	  position: relative;
	  left: -15px;
	  top: 50px;
    }/*手牌区透明化及放大调整*/

    .tileImg{
      border-radius: 4px;
      /*border-top: 3px groove #bbc9d9;/*牌顶3D模拟，效果不好*/
    }/*麻将牌修改：圆角*/

    .killer-call-bars > svg > rect, .discard-bars > svg > rect {
      rx: 2px;
    }/*绿条切割矩形：圆角*/

    main{
      /*scale: 1.2;*/
      top: 50px;
      position: relative;
    }/*主页面放大*/

    .info-doras {
      scale: 1.4;
    }/*Dora显示加大*/

    .info-round {
      background: hsl(192.97deg 17.21% 42.16%);
      border-color: transparent;
      border-radius: 15px;
    }/*场次切换器*/

    .info-this-round-modal{
      background: hsl(190deg 100% 20%);
      border-width: 3px;
      border-radius: 10px;
      border-style:solid;
      border-color:unset;
    }/*对局报告器*/

    .close {
      background: red;
      scale: 1.2;
      border: 0px;
      border-radius: 50%;
      right: 5px;
      width: 20px;
      height: 20px;
    }/*对局报告器关闭按钮*/

    .killer-call-bars{
      scale: 1.5;
      position: relative;
      left: 20px;
      top: 20px;
      border-radius: 20px;
      background:hsl(190deg 31.45% 58.49%);
	  box-shadow: 5px 5px 6px 1px #f6f6f6;
    }/*何切栏放大*/

    .killer-call-bars > svg > text:nth-child(2) {
      fill: #f72727;
    }/*第一选标红*/

    /*.killer-call-bars > svg > rect[x="4.5"], rect[x="14.5"], rect[x="24.5"] {
      stroke: red;
    }
    .killer-call-bars > svg {
      height: 116px;
    }/*第一选红框显示*/

    .sidebar{
      margin-left: 60px;
      justify-content: flex-start;
      align-content; center;
      flex-direction: column;
    }
    .sidebar > * {
      margin:5px;
    }/*右侧栏样式*/

    .controls {
      background: hsl(190deg 49.75% 89.34% / 36%);
      border-radius: 20px;
      height: 325px;
	  box-shadow: 5px 5px 6px 1px #f6f6f6;
    }/*右侧控制板*/

    .controls > * {
      margin: 5px;
      color: black;
      border-color: white;
      border-radius: 15px;
      background: #74abb6;
	  width: 115px;
    }/*控制板按钮样式*/

    .tileImg:hover {
        background: #cdcbcb;
    }/*悬浮选牌*/

    .modal, button {
      border-radius: 10px;
    }/*选项、关于窗口*/

	#about-modal {
    background: linear-gradient(45deg, hsl(190deg 100% 20%), hsl(190 100% 30% / 1), hsl(190 100% 40% / 1));
	}/*关于窗口背景*/

	.newSetting {
		height: 50px;
		width: 150px;
	}/*新添加按钮调整*/

    .opt-info table .tileImg {
		width: calc(var(--tile-img-width)*0.7);
		height: auto;
		position: relative;
		top: 5px;
    }/*调整Mortal候选牌大小*/

    .wider-table td {
		height: 36px;
		padding-top: 2px;
		padding-bottom: 2px;
    }/*配合上一条缩窄排版*/

    #about-body-0 > li:last-child > span {
        display: none;
    }
    #about-body-0 > li:last-child:after {
      content: '如有BUG，关闭此脚本 / Disable Script When BUG';
    }/*声明修改*/
 `
    GM_addStyle(css)
}
//--------------------------------------------  CSS Part should end here  --------------------------------------------//


//--------------------------------------------  Extra Functions should start here  --------------------------------------------//

/*全局变量*/
const standardTileHeight = 20;	//牌张大小常数
const standardTileWidth = standardTileHeight / 4 * 3;
let timer = null;	//消抖定时器

function listenerAdder(strips) { //给出高度条相对百分比
	let maxStripHeight = 1;
	strips.forEach(e=>{
		if(e.getAttribute('width') !== '20') {
			maxStripHeight = Math.max(e.getAttribute('height'), maxStripHeight);
		}
	});

	strips.forEach(e=>{
		if (e.getAttribute('width') !== '10')	return;

		const showHoverWin = ()=>{	//对高度条设置鼠标悬浮响应事件
			let p0Element = document.querySelector(".opt-info > table:last-child tr:nth-of-type(2) > td:last-child");
			let p0 = parseFloat(p0Element.innerText) / 100;
			let normProb = e.getAttribute('height') / maxStripHeight; 	//归一化公式 n(x)=sqrt(x/p0)
			let realProb = p0 * (normProb ** 2); 						//逆操作还原
			let pos = e.getBoundingClientRect();

			let tooltip = document.createElement('div');
			tooltip.className = 'hoverInfo';
			tooltip.style.position = 'absolute';
			tooltip.style.backgroundColor = '#7dbcc980';
			tooltip.style.border = '1px solid white';
			tooltip.style.padding = '5px';
			tooltip.style.borderRadius = '5px';		// 设置悬浮窗的样式 Hover window styles
			tooltip.textContent = (realProb * 100).toFixed(2) + '%';
			tooltip.style.top = `${pos.y - 40}px`;
			tooltip.style.left = `${pos.x - 25}px`;
			e.style.opacity = '0.6';
			document.body.appendChild(tooltip); // 将悬浮窗添加到页面中

			const deleteTooltip = ()=>{			// 给悬浮窗绑定鼠标移出事件
				e.style.opacity = '1';
				tooltip.remove(); 				// 移除悬浮窗
				e.removeEventListener('mouseout', deleteTooltip);
			}
			e.addEventListener('mouseout', deleteTooltip);
		}

		e.addEventListener('mouseover', showHoverWin);
	});
};

function mortalOptionColorize(errTolerance = [ 1, 5, 10, -1 ]) { //最后一个参数-1，为绝对值恶手，>0为比值恶手
	let actionTable = document.querySelector(".opt-info > table:last-child");
	let actionTrList = actionTable.querySelectorAll("tr");

	let actionCardList = new Array();	// 第一个是无用项
	let possibilityList = new Array();

	let lastTr = actionTrList[actionTrList.length - 1];
	lastTr.querySelector("td:first-child").style.borderBottomLeftRadius = "15px";
	lastTr.querySelector("td:last-child").style.borderBottomRightRadius = "15px";
	// 设置表格底部圆角

	actionTrList.forEach(e=>{
		let cardAct = e.querySelector("td:first-child > span");
		let action, card;
		if (cardAct != null) {
			action = cardAct.textContent.substring(0, 1);		//获取牌操作
		}

		let cardImg = e.querySelector("td:first-child > span > img");
		if (cardImg != null) {
			let cardURL = cardImg.getAttribute('src');
			card = cardURL.substring(
				cardURL.lastIndexOf('/')+1, cardURL.lastIndexOf('.')); //获取出牌选择
		}

		actionCardList.push(action + card);

		let possibilityTr = e.querySelector("td:last-child");
		if (possibilityTr.textContent != 'P') {
			possibilityList.push(possibilityTr.textContent);// 获取概率数据
		}
	});

	//获取玩家选择和Mortal一选
	let actionCard = new Array();
	let mainActionSpan = document.querySelectorAll(".opt-info > table:first-child span");
	mainActionSpan.forEach(e=>{
		let action = e.textContent.substring(0, 1);//操作
		let card;
		let cardImg = e.querySelector('img');
		if (cardImg != null) {
			let cardURL = cardImg.getAttribute('src');
			card = cardURL.substring(cardURL.lastIndexOf('/')+1, cardURL.lastIndexOf('.'));//牌张
		}
		actionCard.push(action + card);
	});

	let possibilityPlayer = 0;
	let playerSelect = 0;
	//给玩家选择进行标记
	for (let i = 1; i < actionCardList.length; i++) {
		if (actionCardList[i] == actionCard[0]) {
			actionTrList[i].style.background = "rgb(171, 196, 49)";
			possibilityPlayer = parseFloat(possibilityList[i - 1]);
			playerSelect = i - 1;
			break;
		}
	}

	//判断恶手并标红
	let fatalErr = parseFloat(errTolerance[0]);
	let normalErr = parseFloat(errTolerance[1]);
	let arguableErr = parseFloat(errTolerance[2]);
	let fatalErrEdge = parseFloat(errTolerance[3]);
	let pRatio= parseFloat(possibilityPlayer) / parseFloat(possibilityList[0]);
	let colorChoice = -1;	//分别为红0、橙1、蓝2，及上方标记的黄绿-1

	if (actionCard[0] != actionCard[1]) {
		if (fatalErrEdge < 0) {		//绝对值恶手
			if 			(possibilityPlayer < fatalErr) 			colorChoice = 0;
			else if 	(possibilityPlayer < normalErr) 		colorChoice = 1;
			else if 	(possibilityPlayer < arguableErr)		colorChoice = 2;
		} else if (fatalErrEdge > 0) {	//比值恶手
			if 			(possibilityPlayer < fatalErrEdge) 		colorChoice = 0; //权重过小，直接判断恶手
			else if 	(pRatio < fatalErr) 					colorChoice = 0;
			else if 	(pRatio < normalErr) 					colorChoice = 1;
			else if 	(pRatio < arguableErr) 					colorChoice = 2;
		}
	}

	let playerSelectInMain = document.querySelectorAll('.discard-bars-svg > rect[width="20"]');
	 switch (colorChoice) {
		case 0 :
			actionTrList[playerSelect + 1].style.background = "red";
			playerSelectInMain.forEach(e=>{ e.style.fill = "red"; });
			break;
		case 1 :
			actionTrList[playerSelect + 1].style.background = "#ff5a00";
			playerSelectInMain.forEach(e=>{ e.style.fill = "#ff5a00"; });
			break;
		case 2 :
			actionTrList[playerSelect + 1].style.background = "blue";
			playerSelectInMain.forEach(e=>{ e.style.fill = "blue"; });
			break;
	 }
}

function createButtonBox(){
	let settingOption = document.querySelector('.options-div');
	let buttonBox = document.createElement('div');
	buttonBox.style.display = 'flex';
	buttonBox.className = 'buttonBox-div';
	buttonBox.style.flexWrap = 'wrap';
	buttonBox.style.width = '500px';
    buttonBox.style.justifyContent = 'space-evenly';
	settingOption.appendChild(buttonBox);
}

function backgroundSetting(){
	let buttonBox = document.querySelector('.buttonBox-div');
	let setBackgroundButton = document.createElement('button');
	let backgroundURL = GM_getValue('backgroundPicUrl', 'https://backgroundURL.example');
	let backgroundImg = document.createElement('img');
	setBackgroundButton.className = 'newSetting';
	buttonBox.appendChild(setBackgroundButton);		//插入按钮
	setBackgroundButton.textContent = '修改背景图';
	setBackgroundButton.addEventListener('click', ()=>{
		let inputURL = prompt('输入背景图URL', backgroundURL);
		if (inputURL !== null) {
			backgroundURL = inputURL.trim();
			backgroundImg.src = backgroundURL;
			GM_setValue('backgroundPicUrl', backgroundURL); //存储背景图链接
		}
		document.querySelector('.grid-main').style.backgroundImage = `url(${backgroundURL})`;
	});
	document.querySelector('.grid-main').style.backgroundImage = `url(${backgroundURL})`;
	backgroundImg.src = backgroundURL;						//设置被存储好的背景
	backgroundImg.style.maxWidth = '200px';
	backgroundImg.style.maxHeight = '200px';
    backgroundImg.style.marginTop = '30px';
	backgroundImg.style.justifySelf = 'center';
	backgroundImg.onload = ()=>{ document.querySelector('.options-div').appendChild(backgroundImg); }
	backgroundImg.onerror = ()=> {
		console.log('Can not to load background pic');
		document.querySelector('.grid-main').style.background = 'green';
	}
}

function tileBackSetting(){
	let buttonBox = document.querySelector('.buttonBox-div');
	let setTileBackButton = document.createElement('button');
	let tileBackURL = GM_getValue('tileBackPicURL', 'https://tilebackURL.example');
	let tileBackImg = document.querySelectorAll('img[src="media/Regular_shortnames/back.svg"]');
	setTileBackButton.className = 'newSetting';
	buttonBox.appendChild(setTileBackButton);			//插入按钮
	setTileBackButton.textContent = '设置牌背';
	setTileBackButton.addEventListener('click', ()=>{
		let inputURL = prompt('输入牌背URL', tileBackURL);
		if (inputURL !== null) {
			tileBackURL = inputURL.trim();
			GM_setValue('tileBackPicURL', tileBackURL);		//存储牌背链接
		}
		let tilebackStyle = `img[src="media/Regular_shortnames/back.svg"]{
      						content: url('${tileBackURL}');	}`
		GM_addStyle(tilebackStyle);
	});
	if (tileBackURL == 'https://tilebackURL.example') return;
    let tilebackStyle = `img[src="media/Regular_shortnames/back.svg"]{
      					content: url('${tileBackURL}');		}`
    GM_addStyle(tilebackStyle);						//使用CSS添加
}

function logoSetting(){
	let buttonBox = document.querySelector('.buttonBox-div');
    let setLogoButton = document.createElement('button');
	let logoURL = GM_getValue('logoURL', 'https://logoURL.example');
	setLogoButton.className = 'newSetting';
	buttonBox.appendChild(setLogoButton);		//插入按钮
	setLogoButton.textContent = '修改形象图';
	setLogoButton.addEventListener('click', ()=>{
		let inputURL = prompt('输入形象图URL', logoURL);
		if (inputURL !== null) {
			logoURL = inputURL.trim();
			GM_setValue('logoURL', logoURL); //存储形象图链接
		}
		document.querySelector('.killer-call-img').src = `url(${logoURL})`;
	});
    if (logoURL !== 'https://logoURL.example') {
        let logoStyle = `
		.killer-call-img {
	  	content: url('${logoURL}');
      	position: relative;
      	top: 50px;
      	scale: 1.2;
    	}`;
		GM_addStyle(logoStyle);
    }
}

function optInfoSwitch(){
	let buttonBox = document.querySelector('.buttonBox-div');
	let mortalOptionSwitch = document.createElement('button');
	let mortalOpt = document.querySelector('.opt-info');
	let outer = document.querySelector('.outer');
	let state = GM_getValue('mortalOptionState', true);
	mortalOptionSwitch.className = 'newSetting';
	buttonBox.appendChild(mortalOptionSwitch);	//插入按钮
	if (!state) {	//初始化按钮对应的状态
		mortalOptionSwitch.textContent = '开启Mortal选项面板';
		mortalOpt.style.display = 'none';
		outer.style.marginLeft = '0px';
	} else {
		mortalOptionSwitch.textContent = '关闭Mortal选项面板';
		mortalOpt.style.display = 'initial';
		outer.style.marginLeft = '-100px';
	}
	mortalOptionSwitch.addEventListener('click', ()=>{
			state = !state;
			if (!state) {
				mortalOptionSwitch.textContent = '开启Mortal选项面板';
				mortalOpt.style.display = 'none';
				outer.style.marginLeft = '0px';
			} else {
				mortalOptionSwitch.textContent = '关闭Mortal选项面板';
				mortalOpt.style.display = 'initial';
			outer.style.marginLeft = '-100px';
		}
		GM_setValue('mortalOptionState', state);	//存储状态
	});
}

function fullScreenEnlarge(){
    let scaleArray = GM_getValue('scaleStr', '1.2, 1.35');
	let scale = scaleArray.split(',');
	let defaultScale = parseFloat(scale[0]);
	let fullScreenScale = parseFloat(scale[1]);

	addEventListener('keydown', (e)=>{				//进入全屏放大
		if (e.key === 'F11') {
			event.preventDefault();
			document.documentElement.requestFullscreen();
		}
	});
	addEventListener('fullscreenchange',()=>{
		let mainInFull = document.querySelector('main');
		if (!document.fullscreen) {					//退出全屏重置
			mainInFull.style.scale = `${defaultScale}`;
			mainInFull.style.top = '50px';
		} else {
			mainInFull.style.scale = `${fullScreenScale}`;
			mainInFull.style.top = '110px';
		}
	});
	document.querySelector('.killer-call-img').addEventListener('click', ()=>{	//快捷全屏
		if (!document.fullscreen){
			document.documentElement.requestFullscreen();
		} else {
			document.exitFullscreen();
		}
	});
}

function createStripsHoverWindow() {
	let bars = document.querySelector('#discard-bars');	//设置监听svg监听
	let observer = new MutationObserver((mutationList, observer)=>{
		let strips = bars.querySelectorAll('.discard-bars-svg>rect');
		listenerAdder(strips);
	})
	if (bars === null) {
		console.log('SelectorError!');
	} else {
    	observer.observe(bars, {childList: true, subtree: true});		//当svg被重置时更新选择器strips
	}

	let callBars = document.querySelector('.killer-call-bars');
	let observerAdviser = new MutationObserver((mutationList, observerAdviser)=>{
        mutationList.forEach(e=>{
			if (e.type === 'childList') {
				let stripsAdviser = document.querySelectorAll('.killer-call-bars>svg>rect');
				listenerAdder(stripsAdviser);
				let remainWindow = document.querySelectorAll(".hoverInfo");
				remainWindow.forEach(w=>{ w.remove() }); //svg更新时清空浮窗
			}
        });
    });
	observerAdviser.observe(callBars, {childList: true});
}

function startMortalOptionObserver(errTolerance) {
	let optState = GM_getValue('mortalOptionState', true);
//	if (!optState) return;		//关闭状态不设置监听
	let optInfo = document.querySelector('.opt-info');
	let observerInfo = new MutationObserver(
		(mutationList, observerInfo)=>{
			mortalOptionColorize(errTolerance);
		}
	);	//设置mortal选项更新监听
	observerInfo.observe(optInfo, {childList: true});
}

function setCustomErrTolerance() {
	let buttonBox = document.querySelector('.buttonBox-div');
	let setErrToleranceButton = document.createElement('button');
	let errToleranceStr = GM_getValue('errToleranceStr', '1, 5, 10, -1');
	let errTolerance = errToleranceStr.split(',');

	setErrToleranceButton.className = 'newSetting';
	buttonBox.appendChild(setErrToleranceButton);		//插入按钮
	setErrToleranceButton.textContent = '自定义恶手率';
	setErrToleranceButton.addEventListener('click', ()=>{
		let explainText ='输入恶手率组合，四个参数 (刷新后生效)\n' +
									'x4=-1为绝对模式，低于权重直接判定\n' +
									'x4> 0为比值模式，与一选相除再判定'
		let inputStr = prompt(explainText, errToleranceStr);
		if (inputStr !== null) {
            let input = inputStr.replace('，',','); //替换中文逗号
            let numArray = input.split(',');
            let newErrTolerance = numArray.map(Number);
			if (newErrTolerance.length !== 4) {
                alert('参数数量不一致！');
                return;
            }
			GM_setValue('errToleranceStr', inputStr); 	//存储恶手率字符串
            errToleranceStr = inputStr;
		}
	});
	return errTolerance;
}

function addTableRow(table, str, value) {
    const tr = table.insertRow();
    let cell = tr.insertCell();
    cell.textContent = `${str}`;
    cell = tr.insertCell();
    cell.textContent = `${value}`;
}

function setMainAreaEnlarge() {
	let buttonBox = document.querySelector('.buttonBox-div');
	let scaleButton = document.createElement('button');
	let scaleStr = GM_getValue('scaleStr', '1.2, 1.35');
	let scaleArray = scaleStr.split(',');

    document.querySelector('main').style.scale = `${scaleArray[0]}`;//应用放大

	scaleButton.className = 'newSetting';
	buttonBox.appendChild(scaleButton);		//插入按钮
	scaleButton.textContent = '界面放大倍数';
	scaleButton.addEventListener('click', ()=>{
		let explainText ='输入放大倍数组合，四个参数 (刷新后生效)\n' +
									'第一个参数，非全屏状态的放大倍数\n' +
									'第二个参数，全屏状态下的放大倍数'
		let inputStr = prompt(explainText, scaleStr);
		if (inputStr !== null) {
            let input = inputStr.replace('，',','); //替换中文逗号
            let numArray = input.split(',');
            let newScaleArray = numArray.map(Number);
			if (newScaleArray.length !== 2) {
                alert('参数数量不一致！');
                return;
            }
			GM_setValue('scaleStr', inputStr); 	//存储倍数字符串
            scaleStr = inputStr;
		}
	});
	return scaleArray;
}

async function errCalculate(errTolerance) {
	let fatalErrCnt = 0;
    let normalErrCnt = 0;
	let arguableErrCnt = 0;
/*  感谢脚本Mortal Killer Plus作者sabertaz的数据获取思路
	const urlParams = new URLSearchParams(window.location.search);
    const dataURL = urlParams.get("data");
    const response = await fetch(dataURL);
    const data = await response.json();
    const reviewData = data.review;					*/

	async function waitReview() {
	  return new Promise((resolve) => {
		const check = setInterval(() => {
		  if (unsafeWindow.MM.GS.fullData.review) {
			clearInterval(check); // 停止轮询
			resolve(unsafeWindow.MM.GS.fullData.review); // 返回数据
		  } }, 500);	//间隔500ms
	  });
	}
	const reviewData = await waitReview();	//由killerducky作者挂载的Debug信息

    for (const kyokus of reviewData.kyokus) {
      for (const curRound of kyokus.entries) {
        const mismatch = !curRound.is_equal;
        const pPlayer = curRound.details[curRound.actual_index].prob * 100;
		const pMortal = curRound.details[0].prob * 100;
		if (mismatch && parseFloat(errTolerance[3]) < 0) {	//绝对值恶手
			if (pPlayer <= parseFloat(errTolerance[0])) fatalErrCnt++;
			if (pPlayer <= parseFloat(errTolerance[1])) normalErrCnt++;
			if (pPlayer <= parseFloat(errTolerance[2])) arguableErrCnt++;
		} else if (mismatch && parseFloat(errTolerance[3]) > 0) {	//比值恶手
			const pRate = parseFloat(pPlayer) / parseFloat(pMortal);
			if (pPlayer <= parseFloat(errTolerance[3])) {
				fatalErrCnt++;
				normalErrCnt++;
				arguableErrCnt++;
				continue;
			}
			if (pRate <= parseFloat(errTolerance[0])) fatalErrCnt++;
			if (pRate <= parseFloat(errTolerance[1])) normalErrCnt++;
			if (pRate <= parseFloat(errTolerance[2])) arguableErrCnt++;
		}
      }
    }


    const totalReviewed = reviewData.total_reviewed;

    const fatalErrRate = ((fatalErrCnt / totalReviewed) * 100).toFixed(2);
    const fatalErrStr = `${fatalErrCnt}/${totalReviewed} = ${fatalErrRate}%`;
    const normalErrRate = ((normalErrCnt / totalReviewed) * 100).toFixed(2);
    const normalErrStr = `${normalErrCnt}/${totalReviewed} = ${normalErrRate}%`;
	const arguableErrRate = ((arguableErrCnt / totalReviewed) * 100).toFixed(2);
    const arguableErrStr = `${arguableErrCnt}/${totalReviewed} = ${arguableErrRate}%`;

	let metadataTable = document.querySelector(".about-metadata table:first-child");
	let errRateZH = " 恶手率";
	if (parseFloat(errTolerance[3]) < 0) errRateZH = "% 恶手率";
	addTableRow(metadataTable, `${errTolerance[0]}${errRateZH}`, fatalErrStr);
	addTableRow(metadataTable, `${errTolerance[1]}${errRateZH}`, normalErrStr);
	addTableRow(metadataTable, `${errTolerance[2]}${errRateZH}`, arguableErrStr);
}

function addDoraFlash(doraIndicators, state) { //同时负责上一次dora特效的关闭：state=0
	let doras = new Array();
	doraIndicators.forEach(e =>{
		let doraStr = '';
		switch(e[1]) {
			case 'z':
				if(parseInt(e[0]) < 5) {
					doraStr = `${ parseInt(e[0]) % 4 + 1 }z`; //东南西北
				} else {
					doraStr = `${ (parseInt(e[0]) - 4 ) % 3 + 5}z`; //白发中
				} break;
			default:
				if (parseInt(e[0]) === 0) {
					doraStr = `6${e[1]}`;//赤宝牌的特例
				} else {
					doraStr = `${ parseInt(e[0]) % 9 + 1 }${e[1]}`;
				} break;
		}
		doras.push(doraStr);
	});

	if(state) doras.push('0m', '0p', '0s');
	for (const dora of doras) {
		let doraStyle;
		if (state) {
			doraStyle = `
				.tileDiv:has(img[src="media/Regular_shortnames/${dora}.svg"]) {
					position: relative;
					overflow: hidden;
					border-radius: 5px;
				}

				.tileDiv:has(img[src="media/Regular_shortnames/${dora}.svg"])::after {
					content: '';
					position: absolute;
					inset: -40%;
					background: linear-gradient(45deg, rgba(255,255,255,0) 40%, rgba(255, 255, 255, 0.7), rgba(255,255,255,0) 60%);
					animation: doraFlash 2s infinite;
					transform: translateY(-100%);
					z-index: 1; /*解决失焦问题*/
				}

				@keyframes doraFlash {
				  to {
					transform: translateY(100%);
				  }
				}`;
		} else { //关闭伪元素显示和动画
			doraStyle = `
				.tileDiv:has(img[src="media/Regular_shortnames/${dora}.svg"]){
					overflow: visible;
				}
				.tileDiv:has(img[src="media/Regular_shortnames/${dora}.svg"])::after {
					content: none;
					background: transparent;
					animation: none;
				}`;
		}
		GM_addStyle(doraStyle);
	}

	if (typeof addDoraFlash.executed === "undefined" || !addDoraFlash.executed) {
        addDoraFlash.executed = false;
		let rotatedDoraFix = `
			.pov-p0 > div:has(.rotate) {
				height: var(--tile-width);
				align-self: flex-end;
			}
			.pov-p0 > div > .rotate {
				transform: rotate(90deg) translate(calc(-1 * var(--tile-height)), 0px);
			}
			/*自家鸣牌立直调整*/

			.pov-p1 > div:has(.rotate) {
				width: var(--tile-width);
				align-self: flex-end;
			}/*下家鸣牌立直调整*/

			.pov-p2 > div:has(.rotate) {
				height: var(--tile-width);
			}
			.grid-discard-p2 > div:has(.rotate) {
				align-self: flex-end;
			}/*对家鸣牌立直调整*/

			.pov-p3 > div:has(.rotate) {
				width: var(--tile-width);
			}
			.grid-discard-p3 > div:has(.rotate) {
				align-self: flex-end;
			}/*上家鸣牌立直调整*/
			.tileDiv:has(.tileImg.rotate.float) {
				overflow:visible;
			}/*修复自杠Dora4显示*/
			`;
		GM_addStyle(rotatedDoraFix);
    }
}

function startDoraObserver(doraCheck_ms = 1500) {	//事实上网页上挂载了window.MM.GS.gs.dora，但貌似无法监听
    let preDoraIndicator = new Array();
    const checkInterval = doraCheck_ms; 	//每隔x毫秒查询dora指示牌
    const interval = setInterval(() => {
		let doraInfo = document.querySelectorAll('.info-doras > div > img');
		let doraIndicator = new Array();
		doraInfo.forEach(e=>{
			let cardURL = e.getAttribute('src');//获取doraIdr
			let doraStr = cardURL.substring(cardURL.lastIndexOf('/')+1, cardURL.lastIndexOf('.'));
			if (doraStr !== 'back')		doraIndicator.push(doraStr);
		});

		if (!(function(doraIndicator, preDoraIndicator) { //数组相等的匿名函数
				if (doraIndicator.length !== preDoraIndicator.length) return false;
				for (let i = 0; i < doraIndicator.length; i++) {
					if (doraIndicator[i] !== preDoraIndicator[i]) { return false; }};
				return true;
			})(doraIndicator, preDoraIndicator)) {
			addDoraFlash(preDoraIndicator, false);//清除上一次的dora特效;
			addDoraFlash(doraIndicator, true);
			//console.log(preDoraIndicator, '----Updated To--->', doraIndicator);
			preDoraIndicator = [];	//保存当前dora
			doraIndicator.forEach(d=>{ preDoraIndicator.push(d); });
		}
    }, checkInterval);
}

function startEfficencyCalc(calcDelay_ms = 800) {
	let effEnable = GM_getValue('effEnable', true);
	if (!effEnable) return;

	const calcDelay = (mutationsList) => {
		let effHover = document.querySelectorAll('.eff-hover');
		effHover.forEach((e)=>{ e.remove(); });	//清除未正确移除的浮窗
  		if (mutationsList.length <= 1) return;	//非摸牌更新
		if (timer) clearTimeout(timer); 		//等待时间过短
		timer = setTimeout(()=>{
			timer = null;
			calcEfficency();			//延迟后计算牌效，跳过快速浏览
		}, calcDelay_ms);
	};

	const svgBarsDetector = new MutationObserver((mutations, observer) => {
        const target = document.querySelector('.discard-bars-svg');
        if (target) {
			const startCalc = new MutationObserver(calcDelay);
			startCalc.observe(target, { childList: true, subtree: false });
            svgBarsDetector.disconnect();
        }
    });
    svgBarsDetector.observe(document.body, { childList: true, subtree: true }); //等待bars-svg加载
}

function calcEfficency() { //负责函数调用
	let cardInfo = getCardInfo();
	if(!cardInfo) return;			//不摸牌不计算
	let shantenCnt = shanten(cardInfo.handset);
	if(shantenCnt === -1) return;	//和牌返回

	let ukeireSet = kiruEfficency(cardInfo.handset, cardInfo.seenTiles);
	addEffCardset(ukeireSet, shantenCnt);
}

function getCardInfo() {
	let handcard = unsafeWindow.MM.GS.gs.hands[unsafeWindow.MM.GS.heroPidx];
	let tsumocard = unsafeWindow.MM.GS.gs.drawnTile[unsafeWindow.MM.GS.heroPidx];
	if (!tsumocard) return;	//没有自摸牌
	handcard.push(tsumocard);
	let handset = new Array(5).fill().map(() => new Array(10).fill(0));	//矩阵化手牌
	handcard.forEach(e=>{
		let idx = Math.floor(e / 10), idy = e % 10;	//添菜idy
		if (idx === 5) {
			idx = idy;
			idy = 5;
		}	//处理红五
		handset[idx][idy]++;
	});

	let seenTiles = new Array(5).fill().map(() => new Array(10).fill(0));	//已现牌组，不包括手牌
	let calls = unsafeWindow.MM.GS.gs.calls;
	let discardPond = unsafeWindow.MM.GS.gs.discardPond;
	let doraIdr = unsafeWindow.MM.GS.gs.doraIndicator;

	let doraInfo = document.querySelectorAll('.info-doras > div > img');
	let doraCnt = 0;
	doraInfo.forEach(e=>{
		let cardURL = e.getAttribute('src');
		let doraStr = cardURL.substring(cardURL.lastIndexOf('/')+1, cardURL.lastIndexOf('.'));
		if (doraStr !== 'back') doraCnt++;
	});	//获取dora数量，修正计入未开指示牌问题

	for (let card of calls) {
		if (typeof card !== 'number') continue;
		let idx = Math.floor(card / 10), idy = card % 10;
		if (idx === 5) {
			idx = idy;
			idy = 5;
		}
		seenTiles[idx][idy]++;
	}
	for (let ply of discardPond) {
		ply.forEach(e=>{
			let idx = Math.floor(e.tile / 10), idy = e.tile % 10;
			if (idx === 5) {
				idx = idy;
				idy = 5;
			}
			seenTiles[idx][idy]++;
		})
	}
	for (let i = 0; i < doraCnt; i++) {
		let idr = doraIdr[i];
		let idx = Math.floor(idr / 10), idy = idr % 10;
		if (idx === 5) {
			idx = idy;
			idy = 5;
		}
		seenTiles[idx][idy]++;
	}

	for (let i = 1; i <= 4; i++) handset[i][0] = seenTiles[i][0] = i;
	return { handset: handset, seenTiles: seenTiles };
}

function breakdown(A, depth) {
	if (depth >= 4) return 0;		//四张孤张剪枝
	let ret = 0, i = 1;
	while (i <= 9 && !A[i]) i++;	//定位第一张
	if (i > 9) return 0;			//空白返回
	if (i + 2 <= 9 && A[i] && A[i + 1] && A[i + 2] && A[0] != 4) {
		A[i]--; A[i + 1]--; A[i + 2]--;
		ret = Math.max(ret, breakdown(A, depth) + 2100);
		A[i]++; A[i + 1]++; A[i + 2]++;
	}
	else {
		if (i + 2 <= 9 && A[i] && A[i + 2] && A[0] != 4) {
			A[i]--; A[i + 2]--;
			ret = Math.max(ret, breakdown(A, depth) + 1001);
			A[i]++; A[i + 2]++;
		}
		if (i + 1 <= 9 && A[i] && A[i + 1] && A[0] != 4) {
			A[i]--; A[i + 1]--;
			ret = Math.max(ret, breakdown(A, depth) + 1001);
			A[i]++; A[i + 1]++;
		}
	}

	if (A[i] >= 3) {
		A[i] -= 3;
		ret = Math.max(ret, breakdown(A, depth) + 2100);
		A[i] += 3;
	}
	if (A[i] >= 2) {
		A[i] -= 2;
		ret = Math.max(ret, breakdown(A, depth) + 1010);
		A[i] += 2;
	}
	A[i]--;
	ret = Math.max(ret, breakdown(A, depth + 1));
	A[i]++;
	return ret;
}

function shantenStandard(S) {
	let analysis = 0, cardnum = 0;
	for (let A of S) {
		let ret = 0;
		for (let i = 1; i <= 9; i++) {
			ret += A[i];
			cardnum += A[i];
		}
		if (!ret) continue;	//该类牌空
		analysis += breakdown(A, 0);
	}

	let block = Math.floor(analysis % 1000 / 100);
	let pair = Math.floor(analysis % 100 / 10);
	let dazi = analysis % 10;

	block += Math.floor((14 - cardnum) / 3);	//处理鸣牌
	if (pair > 1) {
		dazi += pair - 1;
		pair = 1;
	}	// 对搭转换
	while (block + dazi > 4 && dazi > 0) dazi--;	// 4N+2规则

	return 8 - (2 * block + dazi + pair);
}

function shantenChiitoi(S) {
	let pair = 0;
	for (let A of S) {
		for (let i = 1; i <= 9; i++) {
			if (A[i] >= 2) pair++;
		}
	}
	return 6 - pair;
}

function shanten(S) { return Math.min(shantenStandard(S), shantenChiitoi(S)); }

function ukeire(S, curShanten) {
	let vaildcard = new Array(5).fill().map(() => new Array(10).fill(0));	//进张
	for (let i = 0; i <= 4; i++) vaildcard[i][0] = i;						//初始化

//	let curShanten = shanten(S);	/*外部传入向听数节省调用时间 */
	for (let i = 1; i <= 3; i++) {	//数牌
		for (let j = 1; j <= 9; j++) {
			let k = j - 2, acc = 0;
			while (k < 1) k++;
			while (k <= j + 2) {
				if (k > 9) break;
				acc += S[i][k++];
			}
			if (!acc) continue;	//不摸孤张
			S[i][j]++;
			if (shanten(S) < curShanten) vaildcard[i][j]++;
			S[i][j]--;
		}
	}
	for (let j = 1; j <= 7; j++) {	//字牌
		if (!S[4][j]) continue;
		S[4][j]++;
		if (shanten(S) < curShanten) vaildcard[4][j]++;
		S[4][j]--;
	}
	return vaildcard;
}

function kiruEfficency(S, seen) {
	let ret = [];
	let curShanten = shanten(S);
	for (let i = 1; i <= 4; i++) {
		for (let j = 1; j <= 9; j++) {
			if (!S[i][j]) continue;
			let pai, num = j.toString();
			switch (i) {
				case 1: pai = num + "m"; break;
				case 2: pai = num + "p"; break;
				case 3: pai = num + "s"; break;
				case 4: pai = num + "z"; break;
			}

			S[i][j]--;
			if (shanten(S) == curShanten) {	//出牌向听不减
				let vaild = ukeire(S, curShanten);
				let left = tileleft(S, vaild, seen);
				let vaildstr = convertToStr(vaild);
				ret.push({ pai: pai, left: left, ukeStr: vaildstr, uke: vaild });
			}
			S[i][j]++;
		}
	}
	ret.sort((a,b)=> b.left.leftNor - a.left.leftNor);
	return ret;
}

function tileleft(S, uke, seen) {
	let leftNor = 0, leftPure = 0;
	for (let i = 1; i <= 4; i++) {
		for (let j = 1; j <= 9; j++) {
			if (!uke[i][j]) continue;
			leftNor += 4 - S[i][j] - seen[i][j];
			leftPure += 4 - S[i][j];
		}
	}
	return { leftNor, leftPure };
}

function convertToStr(S) {
	let str = '';
	for (let i = 1; i <= 4; i++) {
		let acc = 0;
		for (let j = 1; j <= 9; j++) {
			let tmp = S[i][j];
			acc += tmp;
			while (tmp--) str += j.toString();
		}
		if (!acc) continue;
		switch (i) {
			case 1: str += 'm'; break;
			case 2: str += 'p'; break;
			case 3: str += 's'; break;
			case 4: str += 'z'; break;
		}
	}
	return str;
}

function addEffCardset(ukeireSet, shantenCnt) {
	let effWindow = document.querySelector('.efficency-call-div');
	if (!effWindow) return;		//没有创建窗口则取消
	effWindow.innerHTML = '';	//清空内容

	let shantenText = `${shantenCnt} 向听`;
	if(!shantenCnt) shantenText = '听牌';
	let showShanten = document.createElement('text');
	showShanten.textContent = shantenText;
	showShanten.style.textAlign = 'center';
	showShanten.style.width = '100%';
	showShanten.marginTop = '1%';
	effWindow.appendChild(showShanten);

	for (let ukeInfo of ukeireSet) {
		let pai = ukeInfo.pai;
		let tile = document.createElement('img');
		let leftText = ukeInfo.left.leftNor.toString().padStart(2, '0') + ':'
						+ ukeInfo.left.leftPure.toString().padStart(2, '0');
		let showLeftText = document.createElement('text');
		let wrapDiv = document.createElement('div');

		tile.src = `media/Regular_shortnames/${pai}.svg`;
		tile.className = 'tileImg effTile';
		showLeftText.style.fontSize = 'xx-small';
		showLeftText.style.lineHeight = '2';
		showLeftText.style.marginLeft = '2px';
		showLeftText.textContent = leftText;
		wrapDiv.style.display = 'flex';
		wrapDiv.style.marginLeft = '3%';
		wrapDiv.style.marginTop = '1%';	/*样式设定*/

		tile.addEventListener('mouseover', ()=> {	//添加浮窗
			let effHover = document.createElement('div');

			let hoverPai, cnt = 0;
			for (let i = 1; i <= 4; i++) {
				for (let j = 1; j <= 9; j++) {
					if (!ukeInfo.uke[i][j]) continue;
					switch(i) {
						case 1: hoverPai = j.toString() + 'm'; break;
						case 2: hoverPai = j.toString() + 'p'; break;
						case 3: hoverPai = j.toString() + 's'; break;
						case 4: hoverPai = j.toString() + 'z'; break;
					}
					cnt++;
					let hoverTile = document.createElement('img');
					hoverTile.src = `media/Regular_shortnames/${hoverPai}.svg`;
					hoverTile.className = 'tileImg hoverTile';
					effHover.appendChild(hoverTile);			//向浮窗添加进张
				}
			}

			let posParent = effWindow.getBoundingClientRect();
			let maxWidthcCnt = Math.min(13, cnt);
			let posX = ( posParent.left + posParent.right - (standardTileWidth + 4) * maxWidthcCnt ) / 2;
			let posY = posParent.top - Math.ceil(cnt / 13) * (standardTileHeight + 4) - 10;
			effHover.style.width = `${maxWidthcCnt * (standardTileWidth + 4)}px`;	//.tileImg样式中还有2px的padding
			effHover.style.left = `${posX}px`
			effHover.style.top = `${posY}px`
			effHover.className = 'eff-hover';
			document.body.appendChild(effHover);

			const deleteEffHover = ()=>{	//清除监听器和窗口
				effHover.remove();
				tile.removeEventListener('mouseout', deleteEffHover);
			};
			tile.addEventListener('mouseout', deleteEffHover);
		});

		wrapDiv.appendChild(tile);
		wrapDiv.appendChild(showLeftText);
		effWindow.appendChild(wrapDiv);
	}
}

function addEffWindow() {	//添加牌效窗口
	let buttonBox = document.querySelector('.buttonBox-div');
	let efficencySwitch = document.createElement('button');
	let effEnable = GM_getValue('effEnable', true);

	efficencySwitch.className = 'newSetting';
	buttonBox.appendChild(efficencySwitch);	//插入按钮

	if (!effEnable) {	//初始化按钮对应的状态
		efficencySwitch.textContent = '开启牌效计算';
	} else {
		efficencySwitch.textContent = '关闭牌效计算';
	}

	efficencySwitch.addEventListener('click', ()=>{
		effEnable = !effEnable;
		if (!effEnable) {
			efficencySwitch.textContent = '开启牌效计算';
		} else {
			efficencySwitch.textContent = '关闭牌效计算';
		}
		GM_setValue('effEnable', effEnable);	//存储状态
	});
	if (!effEnable) return;	//不开启牌效计算，则仅添加按钮

	let effDiv = document.createElement('div');
	let killerCallDiv = document.querySelector('.killer-call-div');
	let effCss = `
		.efficency-call-div {
			scale: 1.4;
			width: calc(var(--zoom)*245px);
			height: calc(var(--zoom)*110px);
			background: hsl(190deg 31.45% 58.49%);
			box-shadow: 5px 5px 6px 1px #f6f6f6;
			border-radius: 20px;
			margin-top: 34%;
			margin-left: 14%;
			display: flex;
			flex-wrap: wrap;
			align-content: flex-start;
		}

		.eff-hover {
			position: absolute;
			display: flex;
			flex-wrap: wrap;
			scale: 1.5;
			background: #00c0ff80;
			box-shadow: 0px 0px 5px 5px #0090ff;
			border-radius: 5px;
		}

		.effTile {
			filter: none;
			width: ${standardTileWidth}px;
			height: ${standardTileHeight}px;
			box-shadow: inset 0 0 2px #880000;
			margin-left: 3%;
		}

		.hoverTile {
			filter: none;
			width: ${standardTileWidth}px;
			height: ${standardTileHeight}px;
			box-shadow: inset 0 0 2px #880000;
		}`;
	/* 分别是牌效窗口、进张悬浮窗、牌效张、浮窗张
	   在css字符串内加注释，会有bug，很神奇吧js   */
	GM_addStyle(effCss);

	document.querySelector('.killer-call-img').style.display = 'none';	//关闭logo
	effDiv.addEventListener('click', ()=>{	//代替logo的快捷全屏
		if (!document.fullscreen) document.documentElement.requestFullscreen();
		else document.exitFullscreen();
	});
	effDiv.className = 'efficency-call-div';
	killerCallDiv.appendChild(effDiv);
}

//--------------------------------------------  Extra Functions should end here  --------------------------------------------//


(function() {
	//-------------------------------------------- Main Code should start here  --------------------------------------------//
    'use strict';

	//↓↓↓一系列按钮及其功能
    createButtonBox();
    backgroundSetting();
    tileBackSetting();
    logoSetting();
    optInfoSwitch();
    setMainAreaEnlarge();
	addEffWindow();
	let errTolerance = setCustomErrTolerance();
	//↑↑↑一系列按钮及其功能

	mortalAddStyle();			//应用CSS样式
    fullScreenEnlarge();		//全屏时缩放调整
    createStripsHoverWindow();	//创建绿条悬浮窗
    startMortalOptionObserver(errTolerance);	//mortal选项染色
    errCalculate(errTolerance);	//计算恶手率
	startDoraObserver();		//添加宝牌特效
	startEfficencyCalc();		//启动牌效计算

    //-------------------------------------------- Main Code should end here  --------------------------------------------//
})();