// ==UserScript==
// @name        BiliBili+
// @namespace   BiliBili+@Byzod.user.js
// @include     /https?:\/\/www\.bilibili\.com\/account\/dynamic/
// @version     2017-6-21b
// @grant       none
// jshint esversion:6
// @description 在B站个人动态的视频列表里直接加入稍后看按钮
// @downloadURL https://update.greasyfork.org/scripts/30813/BiliBili%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/30813/BiliBili%2B.meta.js
// ==/UserScript==

const WATCH_LATER_TEXT = "  【稍候再看】  ";
const REMOVE_WATCH_LATER_TEXT = "  【移除稍候再看】  ";
const WATCH_LATER_BG_COLOR = "#1672A4";

// 观察者，执行“添加稍后看按钮”
let observer = new MutationObserver(AddWatchLaterButton);
// 视频列表
let vidsList = document.querySelector(".stm-lst");
if(vidsList){
	observer.observe( vidsList, { childList: true } );
} else {
	alert("[Bili+]: Vids list not exist");
}

// 添加稍候看按钮
async function AddWatchLaterButton(recs){
	// console.log("[Bili+]: recs %o", recs); // DEBUG
	
	// 先获取稍后看列表
	let addedVids = await GettingAddedWatchList();
	
	// console.log("[Bili+]: addedVids %o", addedVids); // DEBUG
	for(let rec of recs){
		rec.addedNodes.forEach(vidRow => {
			// 如果是视频，加个按钮
			if(vidRow.className == "stm-lst-item"){
				
				let vid = vidRow.querySelector(".hint>a");
				let av = vid.href;
				av = av.match(/\d+/)[0];
				
				// console.log("[Bili+]: av " + av); // DEBUG
				if(!vid.parentNode.querySelector(".watch-later-btn")){
					let watchLaterBtn = document.createElement("button");
					watchLaterBtn.className = "watch-later-btn";
					watchLaterBtn.style.trasition = "0.5s";
					
					if(!addedVids.includes(parseInt(av))){
						// 不在稍后看里，只改提示
						watchLaterBtn.innerText = WATCH_LATER_TEXT;
					} else {
						// 已在稍后看里，改为移除按钮样式
						watchLaterBtn.innerText = REMOVE_WATCH_LATER_TEXT;
						watchLaterBtn.style.backgroundColor = WATCH_LATER_BG_COLOR;
					}
					
					// 挂添加/移除事件处理
					watchLaterBtn.onclick = ()=>{ ToggleWatchLater(av, watchLaterBtn); };
					
					// 加在链接后面
					vid.parentNode.appendChild(document.createElement("br"));
					vid.parentNode.appendChild(watchLaterBtn);
				}
			}
		});
	}
}

// 获取稍后看列表
async function GettingAddedWatchList(){
	return new Promise(async (resolve, reject)=>{
		let r = null;
		
		let url = new URL(location.protocol + "//api.bilibili.com/x/v2/history/toview/web");
		let params = {
			jsonp: "jsonp",
			sid: GetCookieValue('sid'), // 大概是用户id
			csrf: GetCookieValue('bili_jct') // 并不清楚这是啥
		}
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		
		try{
			r = await (await fetch(url, {method: "GET", credentials: "include"})).json();
		} catch (ex) {
			r = null;
		}
		// console.log("[Bili+]: fetch result %o", r); // DEBUG
		
		if(r && r.data && r.data.list){
			resolve(r.data.list.map(vid=>vid.aid));
		} else {
			reject([])
		}
	});
}

// 切换稍后看状态
async function ToggleWatchLater(av, btn){
	// console.log("[Bili+]: Toggle av %o", av); // DEBUG
	
	// 先获取稍后看列表
	let addedVids = await GettingAddedWatchList();
	
	let isWatchLater = addedVids.includes(parseInt(av));
	// console.log("[Bili+]: " + (isWatchLater ? "Removing from watch later" : "Adding to watch later")); // DEBUG
	
	let result = null;
	let url = new URL(location.protocol + "//api.bilibili.com/x/v2/history/toview/" + (isWatchLater ? "del" : "add"));

	let params = {
		aid: av,
		jsonp: "jsonp",
		csrf: GetCookieValue('bili_jct') // 并不清楚这是啥
	}
	Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
	
	try{
		result = await (await fetch(url, {method: "POST", credentials: "include"})).json();
	} catch (ex) {
		// 一般来说是网络错误
		result = ex;
		btn.innerText = "  【操作失败，请重试】 ";
	}
	
	if(result.code == "0"){
		// 添加/移除成功
		btn.innerText = (isWatchLater ? WATCH_LATER_TEXT : REMOVE_WATCH_LATER_TEXT);
		btn.style.backgroundColor = (isWatchLater ? "" : WATCH_LATER_BG_COLOR);
		if(MessageBox){(new MessageBox).show(btn, "已" + (isWatchLater ? "移除" : "添加"), 700, "info")};
	} else {
		// 服务器返回失败
		if(MessageBox){(new MessageBox).show(btn, "粗错啦：\n" + result.message, 3000, "error")};
		btn.innerText = result.message;
	}
}

// 获取cookie
function GetCookieValue(name) {
	var valueMatch = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
	return valueMatch ? valueMatch.pop() : '';
}