// ==UserScript==
// @name          ProtectCover
// @namespace    https://greasyfork.org/
// @version       1.0.4
// @description  Protect your secret on the screen so that won't be seen by leader or other idler.
// @author        JMRY
// @match         http*://*/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/424741/ProtectCover.user.js
// @updateURL https://update.greasyfork.org/scripts/424741/ProtectCover.meta.js
// ==/UserScript==

var debugUpdate=[
    {
		mainVersion:`1.0.4`,
		dateVersion:`20210705`,
		versionDesc:[
			`优化资源占用。`,
			`调整FPS刷新频率。`,
			`调整透明度按钮为下拉选项。`,
			`调整按钮选定时的边线更加明显。`,
			`隐藏Debug按钮，以避免遮挡画面。`,
		]
	},
    {
		mainVersion:`1.0.3`,
		dateVersion:`20210409`,
		versionDesc:[
			`适配更多网站。`,
            `加入随机生成LOG功能。`,
			`加入自定义透明度按钮。`,
		]
	},
	{
		mainVersion:`1.0.2`,
		dateVersion:`20200605`,
		versionDesc:[
			`加入LOG输出开关。`,
            `加入开关记忆功能。`,
			`优化按钮和快捷键排列。`,
		]
	},
	{
		mainVersion:`1.0.1`,
		dateVersion:`20200518`,
		versionDesc:[
			`适配石墨文档。`,
			`优化输出内容。`,
		]
	},
	{
		mainVersion:`1.0`,
		dateVersion:`20200511`,
		versionDesc:[
			`完成DebugMode基本功能。`,
		]
	},
]
var debugVersion=`${debugUpdate[0].mainVersion} Build ${debugUpdate[0].dateVersion}`;

function attachDebugButton(data){
	data={
		...{
			type:`button`,
			id:``,
			name:``,
			class:``,
			style:``,
			feature:function(){},
			event:{},
		},
		...data,
	}
	console.debug(`Attach Debug Button: ${JSON.stringify(data)}`);
	//{name:`CLEAR`,style:``,feature:function(){}},
	var debugButtonEl=document.createElement(data.type);
	debugButtonEl.setAttribute(`id`,`debugButton_${data.id}`);
	debugButtonEl.setAttribute(`class`,`debugButton debugButton_${data.name} ${data.class}`);
	debugButtonEl.setAttribute(`style`,data.style);
	debugButtonEl.innerHTML=data.name;

	//按钮绑定事件
	debugButtonEl.addEventListener(`click`,function(){
		data.feature();
	});

	for(let key in data.event){
		let curEv=data.event[key];
		debugButtonEl.addEventListener(key,function(){
			curEv();
		});
	}

	// debugButtonDIV.appendChild(debugButtonEl);
	document.getElementById(`debugButtonDIV`).appendChild(debugButtonEl);
}

function attachDebugFrame(){
	//Head classes
	var debugStyles=document.createElement(`style`);
	debugStyles.innerHTML=`
		.debugP{
			margin-top:4px;
			margin-bottom:4px;
		}
		.debugHr{
			border:none;
			height:1px;
			background:#000;
		}
        .debugTable{
            width:100%;
        }
		.debugDIV{
			position:fixed;
			top:0px;
			left:0px;
			right:0px;
			bottom:0px;
			z-index:1000;
			pointer-events:none;
		}

		.debugButtonDIV{
			height:16px;
			z-index:1001;
			text-align:right;
			opacity:0;
			overflow:hidden;
		}
		.debugButtonDIV:hover{
			opacity:1;
		}

		.debugProtectDIV{
			font-family: 'IBFU Font';
            font-size:20px;
			padding:32px;
            padding-left:256px;
            padding-right:256px;
			word-wrap:break-word;
            letter-spacing:0px;
			background-color:rgba(240,240,240,0.9);
		}

		.debugButton{
			height:100%;
			width:96px;
			font-size:8px;
			outline:none;
			pointer-events:auto;
			font-family: GameFont;
			padding:0px;
			padding-top:0px;
		}

		.debugSelect{
			height:100%;
			width:96px;
			font-size:8px;
			outline:none;
			pointer-events:auto;
			font-family: GameFont;
			padding-top:0px;
		}

		.debug_error{
			color:#FF0000;
		}
		.debug_info{
			color:#0099FF;
		}
		.debug_debug{
			color:#666666;
		}
		.debug_warn{
			color:#FF9900;
		}
	`;
	document.head.appendChild(debugStyles);

	//Debug div
	var debugDIV=document.createElement(`div`);
	debugDIV.setAttribute(`id`,`debugDIV`);
	debugDIV.setAttribute(`class`,`debugDIV`);
	document.body.appendChild(debugDIV);

	//Debug control button zone
	var debugButtonDIV=document.createElement(`div`);
	debugButtonDIV.setAttribute(`id`,`debugButtonDIV`);
	debugButtonDIV.setAttribute(`class`,`debugDIV debugButtonDIV`);
	debugDIV.appendChild(debugButtonDIV);

	//Debug protect frame
	var debugProtectDIV=document.createElement(`div`);
	debugProtectDIV.setAttribute(`id`,`debugProtectDIV`);
	debugProtectDIV.setAttribute(`class`,`debugDIV debugProtectDIV`);
	debugDIV.appendChild(debugProtectDIV);
	clearDebugLogs();

	console.debug(`Attach Debug frame`);
	console.debug(`Attach Debug DIV`);
	console.debug(`Attach Debug control button zone`);
	console.debug(`Attach Debug protect frame`);

	var debugButtonList=[
		{type:`select`,id:`opacityBu`,class:`debugSelect`,name:(
			()=>{
				let optionText=``;
				let opacityList=[
					{name:`0.0`,val:0},
					{name:`0.1`,val:9},
					{name:`0.2`,val:8},
					{name:`0.3`,val:7},
					{name:`0.4`,val:6},
					{name:`0.5`,val:5},
					{name:`0.6`,val:4},
					{name:`0.7`,val:3},
					{name:`0.8`,val:2},
					{name:`0.9`,val:1},
					{name:`1.0`,val:`\``},
				];
				for(let i=0; i<opacityList.length; i++){
					optionText+=`<option value="${opacityList[i].val}">OPACITY ${opacityList[i].name}</option>`;
				}
				return optionText;
			})(),
			style:`width:96px`,
			event:{
				change(){
					let selected=document.getElementById(`debugButton_opacityBu`);
					setDebugProtectionOpacity(selected.options[selected.selectedIndex].value);
				}
			}
		},
        // {name:`OP0.0`,id:`opacityBu0.0`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(0);
		// }},
        // {name:`OP0.1`,id:`opacityBu0.1`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(9);
		// }},
        // {name:`OP0.2`,id:`opacityBu0.2`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(8);
		// }},
        // {name:`OP0.3`,id:`opacityBu0.3`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(7);
		// }},
        // {name:`OP0.4`,id:`opacityBu0.4`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(6);
		// }},
        // {name:`OP0.5`,id:`opacityBu0.5`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(5);
		// }},
        // {name:`OP0.6`,id:`opacityBu0.6`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(4);
		// }},
        // {name:`OP0.7`,id:`opacityBu0.7`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(3);
		// }},
        // {name:`OP0.8`,id:`opacityBu0.8`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(2);
		// }},
        // {name:`OP0.9`,id:`opacityBu0.9`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(1);
		// }},
        // {name:`OP1.0`,id:`opacityBu1`,style:`width:36px;`,feature:function(){
		// 	setDebugProtectionOpacity(`\``);
		// }},
        {name:`FLOWLOGS[F9]`,id:`flowLogsBu`,style:``,feature:function(){
			toggleFlowLogs();
		}},
        {name:`RELOAD[F5]`,id:`resetBu`,style:``,feature:function(){
			resetGame();
		}},
        {name:`RECLOG[F6]`,id:`recordLogBu`,style:``,feature:function(){
			toggleRecordDebugLogs();
		}},
		{name:`CLEAR[F7]`,id:`clearLogBu`,style:``,feature:function(){
			clearDebugLogs();
		}},
		{name:`TOGGLE[F8]`,id:`toggleDebugBu`,style:``,feature:function(){
			toggleDebugProtect();
		}},
	];

	for(var i=0; i<debugButtonList.length; i++){
		attachDebugButton(debugButtonList[i]);
	}

	document.onkeydown=function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		console.debug(`KEY PRESS: KEYID: ${e.keyIdentifier} CODE: ${e.keyCode} EVENT: ${e}`);
		console.debug(e,false);
		if(e && e.keyCode==117){ // 按F6
			toggleRecordDebugLogs();
		}
        if(e && e.keyCode==118){ // 按F7
			clearDebugLogs();
		}
        if(e && e.keyCode==119){ // 按F8
			toggleDebugProtect();
		}
        if(e && e.keyCode==120){ // 按F9
			toggleFlowLogs();
		}
        if(e && e.altKey){
            setDebugProtectionOpacity(e.key);
        }
	};

    document.onmousedown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        console.debug(`MOUSE PRESS: MOUSEID: ${e.which} POSITION: ${e.screenX} ${e.screenY} EVENT: ${e}`);
        console.debug(e,false);
    }

    document.onmousewheel=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        console.debug(`MOUSE SCROLL: POSITION: ${e.screenX} ${e.screenY} DIRECTION: ${e.wheelDelta>0?`UP`:`DOWN`} EVENT: ${e}`);
        console.debug(e,false);
    }
}

var debugInterval;
function clearDebugLogs(){
	document.getElementById(`debugProtectDIV`).innerHTML=`<p id="debugTitle" class="debugP"></p><hr class="debugHr"><p id="debugContent" class="debugP"></p>`;
	clearInterval(debugInterval);
	debugInterval=setInterval(function(){
		if(debutProtectShow){
			refreshDebugHeader();
		}
	},500);
}

function refreshDebugHeader(){
	var debugTitle=document.getElementById(`debugTitle`);
	debugTitle.innerHTML=`
<table class="debugTable">
  <tr>
    <td><b>DEBUG for Websites by JMRY</b></td>
    <td><b>Version ${debugVersion}</b></td>
    <td><b>FPS: ${GameFPS}</b></td>
  </tr>
  <tr>
    <td><b>[F6]</b> Toggle record debug logs</td>
    <td><b>[F7]</b> Clear the debug logs</td>
    <td><b>[F8]</b> Toggle the protect cover</td>
  </tr>
  <tr>
    <td><b>[ALT+1~0]</b> Switch protect gear</td>
    <td><b>[F9]</b> Toggle Flow Logs</td>
    <td><b>[F12]</b> Show Develoer tools</td>
  </tr>
</table>
`;
    try{
        let recordLogBu=document.getElementById(`debugButton_recordLogBu`);
        if(isRecordingDebugLog==true){
            recordLogBu.setAttribute(`style`,`border:1px solid #F00;`);
        }else{
            recordLogBu.setAttribute(`style`,``);
        }
        let flowLogBu=document.getElementById(`debugButton_flowLogsBu`);
        if(isFlowDebugLog==true){
            flowLogBu.setAttribute(`style`,`border:1px solid #F00;`);
        }else{
            flowLogBu.setAttribute(`style`,``);
        }
    }catch(e){}
}

function setDebugProtectionOpacity(level){
    var opacityLevel={
        '`':1,
        '1':0.9,
        '2':0.8,
        '3':0.7,
        '4':0.6,
        '5':0.5,
        '6':0.4,
        '7':0.3,
        '8':0.2,
        '9':0.1,
        '0':0,
    }

    var opacityVal=opacityLevel[level];
    if(opacityVal!=undefined){
        var debugProtectDIV=document.getElementById(`debugProtectDIV`);
        debugProtectDIV.setAttribute(`style`,`opacity:${opacityVal}`);
        console.debug(`DEBUG PROTECT SCREEN SET OPACITY: ${opacityVal}`);
        localStorage.setItem(`debugProtectionOpacity`,level);
    }
}

function resetGame(){
	window.top.location.reload(true);
}

var debutProtectShow=true;
function toggleDebugProtect(bool){
	var debugProtectDIV=document.getElementById(`debugProtectDIV`);
    if(bool!=undefined){
        debutProtectShow=!bool;
    }
	if(debutProtectShow){
		// debugProtectDIV.setAttribute(`style`,`opacity:0`);
		debugProtectDIV.setAttribute(`style`,`display:none`);
		debutProtectShow=false;
	}else{
		debugProtectDIV.setAttribute(`style`,``);
        setDebugProtectionOpacity(`\``);
		debutProtectShow=true;
	}
    localStorage.setItem(`isShowDebugCover`,debutProtectShow);
}

var debugCount=1;
function pushDebugLog(text,level,bool){
    if(isRecordingDebugLog==true){
        if(bool==undefined || bool==true){
            if(typeof text==`object`){
                try{
                    text=JSON.stringify(text);
                }catch(e){}
            }

            var debugContent=document.getElementById(`debugContent`);
            var debugText=document.createElement(`p`);
            debugText.setAttribute(`id`,`debug_${debugContent}`);
		debugText.setAttribute(`class`,`debug_p debug_${level}`);
            debugText.innerHTML=`[${level.toUpperCase()} ${debugCount}] ${text}`;
            debugContent.insertBefore(debugText, debugContent.children[0]);

            //Debug输出条目限制
            let countLimit=30; //Count 30 in 1080P
            if(countLimit>0){
                let debugPList=document.getElementsByClassName(`debug_p`);
                if(debugPList.length>countLimit){
                    for(let i=countLimit; i<debugPList.length; i++){
                        let curP=debugPList[i];
                        let parent=document.getElementById(`debugContent`);
                        parent.removeChild(curP);
                    }
                }
            }

            debugCount++;
        }
    }
}

var isRecordingDebugLog=true;
function toggleRecordDebugLogs(){
    if(isRecordingDebugLog==true){
        isRecordingDebugLog=false;

    }else{
        isRecordingDebugLog=true;
    }
    localStorage.setItem(`isRecordingDebugLog`,isRecordingDebugLog);
}

async function wait(n){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        },n);
    });
}

function random(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}

var isFlowDebugLog=true;
function toggleFlowLogs(){
    if(isFlowDebugLog==true){
        isFlowDebugLog=false;
    }else{
        isFlowDebugLog=true;
    }
    localStorage.setItem(`isFlowDebugLog`,isFlowDebugLog);
}

async function flowLogs(){
    let typeList=[`log`,`trace`,`info`,`debug`,`warn`];
	let gameDataList=Object.keys(window);
	let curIndex=0;
	while(true){
		if(debutProtectShow && isRecordingDebugLog && isFlowDebugLog){
			let curKey=gameDataList[Math.floor(Math.random()*gameDataList.length)];
			let curType=typeList[Math.floor(Math.random()*typeList.length)];
			console.flow(window[curKey],true,curType);
			console.flow(curKey,true,`info`);
			await wait(random(0,1000));
		}else{
			await wait(1000);
		}
	}
}

function replaceConsoleDebugLog(){
	var org_console=console;
	console={
		log:function(text,bool){
			pushDebugLog(text,`log`,bool);
			org_console.log(text);
		},
		error:function(text,bool){
			pushDebugLog(text,`error`,bool);
			org_console.error(text);
		},
		warn:function(text,bool){
			pushDebugLog(text,`warn`,bool);
			org_console.warn(text);
		},
		info:function(text,bool){
			pushDebugLog(text,`info`,bool);
			org_console.info(text);
		},
		debug:function(text,bool){
			pushDebugLog(text,`debug`,bool);
			org_console.debug(text);
		},
        flow:function(text,bool,type){
			if(type==undefined){
				type=`log`;
			}
			pushDebugLog(text,type,bool);
		},
	}
}

var GameFPS=0;
function showFPS(){
	var requestAnimationFrame =
		window.requestAnimationFrame || //Chromium
		window.webkitRequestAnimationFrame || //Webkit
		window.mozRequestAnimationFrame || //Mozilla Geko
		window.oRequestAnimationFrame || //Opera Presto
		window.msRequestAnimationFrame || //IE Trident?
		function(callback) { //Fallback function
			window.setTimeout(callback, 1000/60);
		};
	var e,pe,pid,fps,last,offset,step,appendFps;

	fps = 0;
	last = Date.now();
	step = function(){
		offset = Date.now() - last;
		fps += 1;
		if( offset >= 1000 ){
			last += offset;
			appendFps(fps);
			fps = 0;
		}
		requestAnimationFrame( step );
	};
	//显示fps; 如果未指定元素id，默认<body>标签
	appendFps = function(fps){
		GameFPS=fps;
		// if(!e) e=document.createElement('span');
		// pe=pid?document.getElementById(pid):document.getElementsByTagName('body')[0];
		// e.innerHTML = "fps: " + fps;
		// pe.appendChild(e);
	}
	return {
		setParentElementId :  function(id){pid=id;},
		go                 :  function(){step();}
	}
}

function initDebugLogs(){
    /*
	setTimeout(function(){
		//console.info(`DATA ACTORS: ${formatJSON($dataActors,false)}`);
		// console.info(`DATA ARMORS: ${formatJSON($dataArmors,false)}`);
		// console.info(`DATA CLASSES: ${formatJSON($dataClasses,false)}`);
		// console.info(`DATA ITEMS: ${formatJSON($dataItems,false)}`);
		// console.info(`DATA MAPS: ${formatJSON($dataMap,false)}`);
		// console.info(`DATA SYSTEM: ${formatJSON($dataSystem,false)}`);
	},1000);
    */
}

function formatJSON(json,bool){
	var JSON_str=JSON.stringify(json,null,4);
	if(bool!=undefined && bool==false){
		return JSON_str;
	}
	var replaceList=[
		{org:` `,tgt:`&nbsp;`},
		{org:`\n`,tgt:`<br>`},
	];
	for(var i=0; i<replaceList.length; i++){
		JSON_str=JSON_str.split(replaceList[i].org).join(replaceList[i].tgt);
	}
	return JSON_str;
}

function getStorage(name){
	if(name==undefined){
		return localStorage;
	}else{
		return localStorage.getItem(name);
	}
}

function setStorage(name, value){
	if(typeof value==='object'){
		value=JSON.stringify(value);
	}
	localStorage.setItem(name, value);
}

var debugEnabled=1;
(function() {
    'use strict';
    /*
    debugEnabled=parseInt(getStorage(debugEnabled));
    if(isNaN(debugEnabled)){
        debugEnabled=1;
    }
    isRecordingDebugLog=getStorage(isRecordingDebugLog);
    if(isRecordingDebugLog==`true`){
        isRecordingDebugLog=true;
    }else{
        isRecordingDebugLog=false;
    }

    console.log(debugEnabled);
    */

    if(debugEnabled==0){
        return false;
    }else if(debugEnabled==1){
        showFPS().go();
        replaceConsoleDebugLog();
        attachDebugFrame();
        initDebugLogs();

        var debugProtectionOpacity=parseInt(localStorage.getItem(`debugProtectionOpacity`));

        var isShowDebugCover=localStorage.getItem(`isShowDebugCover`);
        if(isShowDebugCover==`false`){
            isShowDebugCover=false;
             toggleDebugProtect(isShowDebugCover);
        }else{
            isShowDebugCover=true;
            toggleDebugProtect(isShowDebugCover);
             if(!isNaN(debugProtectionOpacity)){
                 setDebugProtectionOpacity(debugProtectionOpacity);
             }
        }

        isRecordingDebugLog=localStorage.getItem(`isRecordingDebugLog`);
        if(isRecordingDebugLog==`false`){
            isRecordingDebugLog=false;
        }else{
            isRecordingDebugLog=true;
        }

        isFlowDebugLog=localStorage.getItem(`isFlowDebugLog`);
        if(isFlowDebugLog==`false`){
            isFlowDebugLog=false;
        }else{
            isFlowDebugLog=true;
        }

        flowLogs();
    }
})();