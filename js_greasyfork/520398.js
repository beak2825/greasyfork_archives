// ==UserScript==
// @name         斗鱼星推红包自动领取
// @namespace    https://github.com/qianjiachun
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzMzODg5ODg4MzM2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijg2NDUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTM4NC4wMDAwMDQgMTI3Ljk5OTk5NmMtMTcuNzI3OTk5IDAtNDAuNDc5OTk5IDE2Ljg2Mzk5OS0zMS45OTk5OTkgMzMuMTgzOTk5bDMxLjk5OTk5OSA2MS42MzE5OThjOC40OCAxNi4zMTk5OTkgMTQuMjcyIDMzLjE4Mzk5OSAzMS45OTk5OTkgMzMuMTgzOTk5aDE5MS45OTk5OTRjMTcuNzI3OTk5IDAgMjMuNTE5OTk5LTE2Ljg2Mzk5OSAzMS45OTk5OTktMzMuMTgzOTk5bDMxLjk5OTk5OS02MS42MzE5OThDNjgwLjQ3OTk5NSAxNDQuODYzOTk1IDY1Ny43Mjc5OTUgMTI3Ljk5OTk5NiA2MzkuOTk5OTk2IDEyNy45OTk5OTZoLTQ3Ljk5OTk5OGEzMS45OTk5OTkgMzEuOTk5OTk5IDAgMCAwLTMxLjk5OTk5OSAzMS45OTk5OTkgMzEuOTk5OTk5IDMxLjk5OTk5OSAwIDAgMC0zMS45OTk5OTktMzEuOTk5OTk5SDM4NC4wMDAwMDR6IiBmaWxsPSIjRTYwMDFGIiBwLWlkPSI4NjQ2Ij48L3BhdGg+PHBhdGggZD0iTTQzMC45NzYwMDMgMTc1Ljc3NTk5NWExNiAxNiAwIDAgMC0xNC41MjggMjAuMTU5OTk5bDE1Ljk5OTk5OSA2My45OTk5OThhMTYgMTYgMCAxIDAgMzEuMDcyLTcuODRsLTE2LTYzLjk5OTk5OGExNiAxNiAwIDAgMC0xNi41NDM5OTktMTIuMzE5OTk5ek01MTEuNzc2IDE3NS43NzU5OTVBMTYgMTYgMCAwIDAgNDk2IDE5MS45OTk5OTR2NjMuOTk5OTk4YTE2IDE2IDAgMSAwIDMyIDB2LTYzLjk5OTk5OGExNiAxNiAwIDAgMC0xNi4yNTYtMTYuMTkxOTk5ek01OTIuNTExOTk3IDE3NS43NzU5OTVhMTYgMTYgMCAwIDAtMTYuMDYzOTk5IDEyLjMxOTk5OWwtMTYgNjMuOTk5OTk4YTE2IDE2IDAgMSAwIDMxLjA3MiA3LjgwOGwxNS45OTk5OTktNjMuOTk5OTk4YTE2IDE2IDAgMCAwLTE1LjAwOC0yMC4xMjc5OTl6IiBmaWxsPSIjOTkwMDEyIiBwLWlkPSI4NjQ3Ij48L3BhdGg+PHBhdGggZD0iTTgzMS45OTk5OSA2NzAuNDk1OTc5QzgzMS45OTk5OSA3NzcuNjk1OTc2IDcyMy41MTk5OTMgODYzLjk5OTk3MyA1ODguNzk5OTk4IDg2My45OTk5NzNoLTE1My41OTk5OTZDMzAwLjQ4MDAwNyA4NjMuOTk5OTczIDE5Mi4wMDAwMSA3NzcuNjk1OTc2IDE5Mi4wMDAwMSA2NzAuNDk1OTc5VjYzOS45OTk5OGMwLTIxMi4wNjM5OTMgMTQzLjI2Mzk5Ni0zODMuOTk5OTg4IDMxOS45OTk5OS0zODMuOTk5OTg4czMxOS45OTk5OSAxNzEuOTM1OTk1IDMxOS45OTk5OSAzODMuOTk5OTg4eiIgZmlsbD0iI0U2MDAxRiIgcC1pZD0iODY0OCI+PC9wYXRoPjxwYXRoIGQ9Ik0zODQuMDAwMDA0IDIyMy45OTk5OTNoMjU1Ljk5OTk5MmMxNy43Mjc5OTkgMCAzMS45OTk5OTkgMTQuMjcyIDMxLjk5OTk5OSAzMS45OTk5OTlzLTE0LjI3MiAzMS45OTk5OTktMzEuOTk5OTk5IDMxLjk5OTk5OWgtMjU1Ljk5OTk5MmMtMTcuNzI3OTk5IDAtMzEuOTk5OTk5LTE0LjI3Mi0zMS45OTk5OTktMzEuOTk5OTk5czE0LjI3Mi0zMS45OTk5OTkgMzEuOTk5OTk5LTMxLjk5OTk5OXoiIGZpbGw9IiNDN0M2Q0UiIHAtaWQ9Ijg2NDkiPjwvcGF0aD48cGF0aCBkPSJNNTk1Ljk2Nzk5NyA3MDMuOTk5OTc4bC04NC4wOTU5OTctNDQuMzE5OTk5LTg0LjE1OTk5NyA0NC4xNTk5OTkgMTYuMTU5OTk5LTkzLjY2Mzk5Ny02Ny45Njc5OTgtNjYuMzk5OTk4IDk0LjA3OTk5Ny0xMy41NjggNDIuMTExOTk5LTg1LjE4Mzk5NyA0MS45ODM5OTkgODUuMjc5OTk3IDk0LjAxNTk5NyAxMy43Ni02OC4wOTU5OTggNjYuMjM5OTk4eiIgZmlsbD0iI0ZGOUEwMCIgcC1pZD0iODY1MCI+PC9wYXRoPjwvc3ZnPg==
// @version      2025.09.16.01
// @description  全自动领取斗鱼星推红包
// @author       小淳
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @match			*://*.douyu.com/topic/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @connect      douyucdn.cn
// @connect      douyu.com
// @downloadURL https://update.greasyfork.org/scripts/520398/%E6%96%97%E9%B1%BC%E6%98%9F%E6%8E%A8%E7%BA%A2%E5%8C%85%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/520398/%E6%96%97%E9%B1%BC%E6%98%9F%E6%8E%A8%E7%BA%A2%E5%8C%85%E8%87%AA%E5%8A%A8%E9%A2%86%E5%8F%96.meta.js
// ==/UserScript==
"use strict";
function initPkg() {
	initPkg_AnchorStarRedpacket();
}

function initStyles() {
	let style = document.createElement("style");
	style.appendChild(document.createTextNode(`.noticejs-top{top:0;width:100% !important}.noticejs-top .item{border-radius:0 !important;margin:0 !important}.noticejs-topRight{top:10px;right:10px}.noticejs-topLeft{top:10px;left:10px}.noticejs-topCenter{top:10px;left:50%;transform:translate(-50%)}.noticejs-middleLeft,.noticejs-middleRight{right:10px;top:50%;transform:translateY(-50%)}.noticejs-middleLeft{left:10px}.noticejs-middleCenter{top:50%;left:50%;transform:translate(-50%,-50%)}.noticejs-bottom{bottom:0;width:100% !important}.noticejs-bottom .item{border-radius:0 !important;margin:0 !important}.noticejs-bottomRight{bottom:10px;right:10px}.noticejs-bottomLeft{bottom:10px;left:10px}.noticejs-bottomCenter{bottom:10px;left:50%;transform:translate(-50%)}.noticejs{font-family:Helvetica Neue,Helvetica,Arial,sans-serif}.noticejs .item{margin:0 0 10px;border-radius:3px;overflow:hidden}.noticejs .item .close{float:right;font-size:18px;font-weight:700;line-height:1;color:#fff;text-shadow:0 1px 0 #fff;opacity:1;margin-right:7px}.noticejs .item .close:hover{opacity:.5;color:#000}.noticejs .item a{color:#fff;border-bottom:1px dashed #fff}.noticejs .item a,.noticejs .item a:hover{text-decoration:none}.noticejs .success{background-color:#64ce83}.noticejs .success .noticejs-heading{background-color:#3da95c;color:#fff;padding:10px}.noticejs .success .noticejs-body{color:#fff;padding:10px}.noticejs .success .noticejs-body:hover{visibility:visible !important}.noticejs .success .noticejs-content{visibility:visible}.noticejs .info{background-color:#3ea2ff}.noticejs .info .noticejs-heading{background-color:#067cea;color:#fff;padding:10px}.noticejs .info .noticejs-body{color:#fff;padding:10px}.noticejs .info .noticejs-body:hover{visibility:visible !important}.noticejs .info .noticejs-content{visibility:visible}.noticejs .warning{background-color:#ff7f48}.noticejs .warning .noticejs-heading{background-color:#f44e06;color:#fff;padding:10px}.noticejs .warning .noticejs-body{color:#fff;padding:10px}.noticejs .warning .noticejs-body:hover{visibility:visible !important}.noticejs .warning .noticejs-content{visibility:visible}.noticejs .error{background-color:#e74c3c}.noticejs .error .noticejs-heading{background-color:#ba2c1d;color:#fff;padding:10px}.noticejs .error .noticejs-body{color:#fff;padding:10px}.noticejs .error .noticejs-body:hover{visibility:visible !important}.noticejs .error .noticejs-content{visibility:visible}.noticejs .progressbar{width:100%}.noticejs .progressbar .bar{width:1%;height:30px;background-color:#4caf50}.noticejs .success .noticejs-progressbar{width:100%;background-color:#64ce83;margin-top:-1px}.noticejs .success .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#3da95c}.noticejs .info .noticejs-progressbar{width:100%;background-color:#3ea2ff;margin-top:-1px}.noticejs .info .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#067cea}.noticejs .warning .noticejs-progressbar{width:100%;background-color:#ff7f48;margin-top:-1px}.noticejs .warning .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#f44e06}.noticejs .error .noticejs-progressbar{width:100%;background-color:#e74c3c;margin-top:-1px}.noticejs .error .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:#ba2c1d}@keyframes noticejs-fadeOut{0%{opacity:1}to{opacity:0}}.noticejs-fadeOut{animation-name:noticejs-fadeOut}@keyframes noticejs-modal-in{to{opacity:.3}}@keyframes noticejs-modal-out{to{opacity:0}}.noticejs-rtl .noticejs-heading{direction:rtl}.noticejs-rtl .close{float:left !important;margin-left:7px;margin-right:0 !important}.noticejs-rtl .noticejs-content{direction:rtl}.noticejs{position:fixed;z-index:10050;width:320px}.noticejs::-webkit-scrollbar{width:8px}.noticejs::-webkit-scrollbar-button{width:8px;height:5px}.noticejs::-webkit-scrollbar-track{border-radius:10px}.noticejs::-webkit-scrollbar-thumb{background:hsla(0,0%,100%,.5);border-radius:10px}.noticejs::-webkit-scrollbar-thumb:hover{background:#fff}.noticejs-modal{position:fixed;width:100%;height:100%;background-color:#000;z-index:10000;opacity:.3;left:0;top:0}.noticejs-modal-open{opacity:0;animation:noticejs-modal-in .3s ease-out}.noticejs-modal-close{animation:noticejs-modal-out .3s ease-out;animation-fill-mode:forwards}.noticejs .special{background-color:rgb(160,37,160)}.noticejs .special .noticejs-heading{background-color:rgb(110,26,110);color:#fff;padding:10px}.noticejs .special .noticejs-body{color:#fff;padding:10px}.noticejs .special .noticejs-body:hover{visibility:visible !important}.noticejs .special .noticejs-content{visibility:visible}.noticejs .special .noticejs-progressbar{width:100%;background-color:rgb(160,37,160);margin-top:-1px}.noticejs .special .noticejs-progressbar .noticejs-bar{width:100%;height:5px;background:rgb(110,26,110)}`));
	document.head.appendChild(style);
}

function getCookieValue(name) {
  let arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function setCookie(cookiename, value){
	let exp = new Date();
	exp.setTime(exp.getTime() + 3*60*60*1000);
	document.cookie = cookiename + "="+ escape (value) + "; path=/; expires=" + exp.toGMTString();
}

function getCCN() {
	// let cookie = document.cookie;
	// let ret = getStrMiddle(cookie, "acf_ccn=", ";");
	let ret = getCookieValue("acf_ccn");
	if (ret == null) {
		setCookie("acf_ccn", "1");
		ret = "1";
	}
	return ret;
}

function showMessage(msg, type="success", options) {
	// type: success[green] error[red] warning[orange] info[blue]
	let option = {
		text: msg,
		type: type,
		position: 'bottomLeft',
		...options
	}
	new NoticeJs(option).show();
}
const coinNumLimit = 2000; // 不抢金币小于多少数量的红包
let anchorStarRedpacketList = [];
let anchorStarRedpacketTimerMonitor = null;
let anchorStarRedpacketTimerCheck = null;
let anchorStarWebsocketBasicOption = {};
let anchorStarIsGettingRoomList = []; // 正在领取/观看的直播间
const anchorStarLoginLimit = 8; // 最多同时8个直播间领取红包
const anchorStarExpireRedpacketIdList = []; // 过期的红包id
let isEnd = false;

function initPkg_AnchorStarRedpacket() {
  isEnd = checkIsEnd();
  if (isEnd) return showMessage(`【星推】今日红包已达上限`, "error");
  showMessage(`【星推】开始自动抢红包`, "success");
  anchorStarWebsocketBasicOption = {
    dy_did: getCookieValue("dy_did"),
    stk: getCookieValue("acf_stk"),
    ltkid: getCookieValue("acf_ltkid"),
    biz: getCookieValue("acf_biz"),
    username: getCookieValue("acf_username")
  };

  monitorAnchorStarRedpacket();
  anchorStarRedpacketTimerMonitor = setInterval(() => {
    monitorAnchorStarRedpacket();
  }, 2 * 60000);
  anchorStarRedpacketTimerCheck = setInterval(() => {
    checkAnchorStarRedpacket();
  }, 10000);
}

async function monitorAnchorStarRedpacket() {
  if (isEnd) {
    clearInterval(anchorStarRedpacketTimerMonitor);
    return;
  }
  const roomList = await getAnchorStarRedpacketList();
  for (const room of roomList) {
    const rid = room.rid;
    getAnchorStarRoomRedpacketList(rid).then((redpacketList) => {
      for (const redpacket of redpacketList) {
        const status = redpacket.status;
        const id = redpacket.id;
        const code = redpacket.code;
        const rbType = redpacket.rbType;
        const startTime = (redpacket.createTime + redpacket.waitSec) * 1000;
        if (rbType !== 8) continue; // 不抢普通红包
        const prizeList = redpacket.prizeList;
        const prizeNum = prizeList.find((item) => item.ptype == 9)?.num;
        if (prizeNum < coinNumLimit) continue;
        if (status !== 0) {
          // 红包已经领过了
          anchorStarRedpacketList = anchorStarRedpacketList.filter((item) => item.id !== id);
          continue;
        }
        if (anchorStarExpireRedpacketIdList.find((item) => item === id)) continue;
        if (anchorStarRedpacketList.find((item) => item.id === id)) continue;
        anchorStarRedpacketList.push({
          rid,
          id,
          code,
          startTime
        });
        console.log("当前红包列表", anchorStarRedpacketList);
      }
    });
  }
}

async function checkAnchorStarRedpacket() {
  if (isEnd) {
    clearInterval(anchorStarRedpacketTimerCheck);
    return;
  }
  // 检查队列中是否有可以抢的红包
  const now = new Date().getTime();
  const list = anchorStarRedpacketList.sort((a, b) => a.startTime - b.startTime);

  for (const redpacket of list) {
    if (anchorStarIsGettingRoomList.length >= anchorStarLoginLimit) break; // 超过限制
    if (redpacket.startTime > now) continue; // 未到领取时间
    const { rid } = redpacket;
    // 如果anchorStarIsGettingRoomList中存在rid相同的则跳过
    if (anchorStarIsGettingRoomList.find((item) => item == rid)) continue;
    anchorStarIsGettingRoomList.push(rid);
    loginAndGetAnchorStarRedpacket(rid);
  }
}

async function loginAndGetAnchorStarRedpacket(rid) {
  const option = getAnchorStarWebsocketOption(rid);
  let ws = new Ex_WebSocket_Login(option);
  ws.connect();
  await sleep(60000);
  while (true) {
    if (isEnd) break;
    const now = new Date().getTime();
    // 从anchorStarRedpacketList中获取当前rid下所有的红包，且now时间大于等于红包开始时间
    const redpacketList = anchorStarRedpacketList.filter((r) => r.rid === rid && now >= r.startTime);
    if (redpacketList.length === 0) {
      ws.close();
      ws = null;
      anchorStarIsGettingRoomList = anchorStarIsGettingRoomList.filter((r) => r !== rid);
      console.log("websocket断开完成", ws);
      break;
    }
    for (const redpacket of redpacketList) {
      const { rid, id, code } = redpacket;
      getAnchorStarRedpacket(rid, id, code).then((res) => {
        console.log(`领取结果: 房间${rid}, 红包${id}`, res);
        if (res.error == 12002) {
          isEnd = true;
          setEnd();
        }
        if (res.error === 0) {
          const prizeList = res.data.prizeList;
          if (prizeList) {
            const coinNum = prizeList.find((item) => item.prizeType == 9)?.num;
            const starNum = prizeList.find((item) => item.prizeType == 2)?.num;
            let msg = `【星推】红包奖励已领取：金币×${coinNum}`;
            if (starNum > 0) msg += `，星光棒×${starNum}`;
            showMessage(msg, "success");
          }
          // 从anchorStarIsGettingRoomList中移除该红包id
          anchorStarRedpacketList = anchorStarRedpacketList.filter((item) => item.id !== id);
        }
        if (res.error == 12001 || res.error == 12005) {
          // 从anchorStarIsGettingRoomList中移除该红包id
          anchorStarRedpacketList = anchorStarRedpacketList.filter((item) => item.id !== id);
          anchorStarExpireRedpacketIdList.push(id);
        }
      });
    }
    await sleep(10000);
  }
  console.log(`房间【${rid}】领取红包任务完成`, anchorStarRedpacketList, anchorStarIsGettingRoomList);
}

function getAnchorStarWebsocketOption(rid) {
  return { ...anchorStarWebsocketBasicOption, rid };
}

function getAnchorStarRedpacketList() {
  return new Promise((resolve, reject) => {
    fetch(`https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/square/list?rid=${rid}`, {
      method: "GET",
      mode: "no-cors",
      credentials: "include"
    })
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        if (ret.error !== 0) {
          resolve([]);
        } else {
          resolve(ret.data.redBagList);
        }
      })
      .catch((err) => {
        console.log("请求失败!", err);
        reject(err);
      });
  });
}

function getAnchorStarRoomRedpacketList(rid) {
  return new Promise((resolve, reject) => {
    fetch(`https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/room/list?rid=${rid}`, {
      method: "GET",
      mode: "no-cors",
      credentials: "include"
    })
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        if (ret.error !== 0) {
          resolve([]);
        } else {
          resolve(ret.data.redBagList);
        }
      })
      .catch((err) => {
        console.log("请求失败!", err);
        reject(err);
      });
  });
}

function getAnchorStarRedpacket(rid, id, code) {
  return new Promise((resolve, reject) => {
    fetch("https://www.douyu.com/japi/livebiznc/web/anchorstardiscover/redbag/snatch", {
      method: "POST",
      mode: "no-cors",
      credentials: "include",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `code=${code}&id=${id}&rid=${rid}&ctn=${getCCN()}`
    })
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        resolve(ret);
      })
      .catch((err) => {
        console.log("请求失败!", err);
        reject(err);
      });
  });
}

function setEnd() {
  showMessage(`【星推】今日红包已达上限`, "error");
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  let timestamp = tomorrow.getTime();
  localStorage.setItem("anchorStarNextDayTime", timestamp);
}

function checkIsEnd() {
  let timestamp = localStorage.getItem("anchorStarNextDayTime");
  if (timestamp == null) {
    return false;
  }
  let now = new Date().getTime();
  if (now <= Number(timestamp)) {
    return true;
  }
  return false;
}

/*
  md5.js
*/
var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(s){return binl2hex(core_md5(str2binl(s),s.length*chrsz))}function b64_md5(s){return binl2b64(core_md5(str2binl(s),s.length*chrsz))}function str_md5(s){return binl2str(core_md5(str2binl(s),s.length*chrsz))}function hex_hmac_md5(key,data){return binl2hex(core_hmac_md5(key,data))}function b64_hmac_md5(key,data){return binl2b64(core_hmac_md5(key,data))}function str_hmac_md5(key,data){return binl2str(core_hmac_md5(key,data))}function md5_vm_test(){return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72"}function core_md5(x,len){x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd)}return Array(a,b,c,d)}function md5_cmn(q,a,b,x,s,t){return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b)}function md5_ff(a,b,c,d,x,s,t){return md5_cmn((b&c)|((~b)&d),a,b,x,s,t)}function md5_gg(a,b,c,d,x,s,t){return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t)}function md5_hh(a,b,c,d,x,s,t){return md5_cmn(b^c^d,a,b,x,s,t)}function md5_ii(a,b,c,d,x,s,t){return md5_cmn(c^(b|(~d)),a,b,x,s,t)}function core_hmac_md5(key,data){var bkey=str2binl(key);if(bkey.length>16)bkey=core_md5(bkey,key.length*chrsz);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C}var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);return core_md5(opad.concat(hash),512+128)}function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF)}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt))}function str2binl(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz)bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32);return bin}function binl2str(bin){var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz)str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask);return str}function binl2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&0xF)+hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&0xF)}return str}function binl2b64(binarray){var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3){var triplet=(((binarray[i>>2]>>8*(i%4))&0xFF)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>binarray.length*32)str+=b64pad;else str+=tab.charAt((triplet>>6*(3-j))&0x3F)}}return str}
/*
    Notice.js
*/
(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==='object'&&typeof module==='object')module.exports=factory();else if(typeof define==='function'&&define.amd)define("NoticeJs",[],factory);else if(typeof exports==='object')exports["NoticeJs"]=factory();else root["NoticeJs"]=factory()})(typeof self!=='undefined'?self:this,function(){return(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports}var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports}__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{configurable:false,enumerable:true,get:getter})}};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module['default']}:function getModuleExports(){return module};__webpack_require__.d(getter,'a',getter);return getter};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)};__webpack_require__.p="dist/";return __webpack_require__(__webpack_require__.s=2)})([(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var noticeJsModalClassName=exports.noticeJsModalClassName='noticejs-modal';var closeAnimation=exports.closeAnimation='noticejs-fadeOut';var Defaults=exports.Defaults={title:'',text:'',type:'success',position:'topRight',timeout:30,progressBar:true,closeWith:['button'],animation:null,modal:false,scroll:{maxHeight:300,showOnHover:true},rtl:false,callbacks:{beforeShow:[],onShow:[],afterShow:[],onClose:[],afterClose:[],onClick:[],onHover:[],onTemplate:[]}}}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.appendNoticeJs=exports.addListener=exports.CloseItem=exports.AddModal=undefined;exports.getCallback=getCallback;var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}var options=API.Defaults;function getCallback(ref,eventName){if(ref.callbacks.hasOwnProperty(eventName)){ref.callbacks[eventName].forEach(function(cb){if(typeof cb==='function'){cb.apply(ref)}})}}var AddModal=exports.AddModal=function AddModal(){if(document.getElementsByClassName(API.noticeJsModalClassName).length<=0){var element=document.createElement('div');element.classList.add(API.noticeJsModalClassName);element.classList.add('noticejs-modal-open');document.body.appendChild(element);setTimeout(function(){element.className=API.noticeJsModalClassName},200)}};var CloseItem=exports.CloseItem=function CloseItem(item){getCallback(options,'onClose');if(options.animation!==null&&options.animation.close!==null){item.className+=' '+options.animation.close}setTimeout(function(){item.remove()},200);if(options.modal===true&&document.querySelectorAll("[noticejs-modal='true']").length>=1){document.querySelector('.noticejs-modal').className+=' noticejs-modal-close';setTimeout(function(){document.querySelector('.noticejs-modal').remove()},500)}var position='.'+item.closest('.noticejs').className.replace('noticejs','').trim();setTimeout(function(){if(document.querySelectorAll(position+' .item').length<=0){let p=document.querySelector(position);if(p!=null){p.remove()}}},500)};var addListener=exports.addListener=function addListener(item){if(options.closeWith.includes('button')){item.querySelector('.close').addEventListener('click',function(){CloseItem(item)})}if(options.closeWith.includes('click')){item.style.cursor='pointer';item.addEventListener('click',function(e){if(e.target.className!=='close'){getCallback(options,'onClick');CloseItem(item)}})}else{item.addEventListener('click',function(e){if(e.target.className!=='close'){getCallback(options,'onClick')}})}item.addEventListener('mouseover',function(){getCallback(options,'onHover')})};var appendNoticeJs=exports.appendNoticeJs=function appendNoticeJs(noticeJsHeader,noticeJsBody,noticeJsProgressBar){var target_class='.noticejs-'+options.position;var noticeJsItem=document.createElement('div');noticeJsItem.classList.add('item');noticeJsItem.classList.add(options.type);if(options.rtl===true){noticeJsItem.classList.add('noticejs-rtl')}if(noticeJsHeader&&noticeJsHeader!==''){noticeJsItem.appendChild(noticeJsHeader)}noticeJsItem.appendChild(noticeJsBody);if(noticeJsProgressBar&&noticeJsProgressBar!==''){noticeJsItem.appendChild(noticeJsProgressBar)}if(['top','bottom'].includes(options.position)){document.querySelector(target_class).innerHTML=''}if(options.animation!==null&&options.animation.open!==null){noticeJsItem.className+=' '+options.animation.open}if(options.modal===true){noticeJsItem.setAttribute('noticejs-modal','true');AddModal()}addListener(noticeJsItem,options.closeWith);getCallback(options,'beforeShow');getCallback(options,'onShow');document.querySelector(target_class).appendChild(noticeJsItem);getCallback(options,'afterShow');return noticeJsItem}}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _noticejs=__webpack_require__(3);var _noticejs2=_interopRequireDefault(_noticejs);var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);var _components=__webpack_require__(4);var _helpers=__webpack_require__(1);var helper=_interopRequireWildcard(_helpers);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var NoticeJs=function(){function NoticeJs(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,NoticeJs);this.options=Object.assign(API.Defaults,options);this.component=new _components.Components();this.on('beforeShow',this.options.callbacks.beforeShow);this.on('onShow',this.options.callbacks.onShow);this.on('afterShow',this.options.callbacks.afterShow);this.on('onClose',this.options.callbacks.onClose);this.on('afterClose',this.options.callbacks.afterClose);this.on('onClick',this.options.callbacks.onClick);this.on('onHover',this.options.callbacks.onHover);return this}_createClass(NoticeJs,[{key:'show',value:function show(){var container=this.component.createContainer();if(document.querySelector('.noticejs-'+this.options.position)===null){document.body.appendChild(container)}var noticeJsHeader=void 0;var noticeJsBody=void 0;var noticeJsProgressBar=void 0;noticeJsHeader=this.component.createHeader(this.options.title,this.options.closeWith);noticeJsBody=this.component.createBody(this.options.text);if(this.options.progressBar===true){noticeJsProgressBar=this.component.createProgressBar()}var noticeJs=helper.appendNoticeJs(noticeJsHeader,noticeJsBody,noticeJsProgressBar);return noticeJs}},{key:'on',value:function on(eventName){var cb=arguments.length>1&&arguments[1]!==undefined?arguments[1]:function(){};if(typeof cb==='function'&&this.options.callbacks.hasOwnProperty(eventName)){this.options.callbacks[eventName].push(cb)}return this}}]);return NoticeJs}();exports.default=NoticeJs;module.exports=exports['default']}),(function(module,exports){}),(function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.Components=undefined;var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _api=__webpack_require__(0);var API=_interopRequireWildcard(_api);var _helpers=__webpack_require__(1);var helper=_interopRequireWildcard(_helpers);function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key]}}newObj.default=obj;return newObj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var options=API.Defaults;var Components=exports.Components=function(){function Components(){_classCallCheck(this,Components)}_createClass(Components,[{key:'createContainer',value:function createContainer(){var element_class='noticejs-'+options.position;var element=document.createElement('div');element.classList.add('noticejs');element.classList.add(element_class);return element}},{key:'createHeader',value:function createHeader(){var element=void 0;if(options.title&&options.title!==''){element=document.createElement('div');element.setAttribute('class','noticejs-heading');element.textContent=options.title}if(options.closeWith.includes('button')){var close=document.createElement('div');close.setAttribute('class','close');close.innerHTML='&times;';if(element){element.appendChild(close)}else{element=close}}return element}},{key:'createBody',value:function createBody(){var element=document.createElement('div');element.setAttribute('class','noticejs-body');var content=document.createElement('div');content.setAttribute('class','noticejs-content');content.innerHTML=options.text;element.appendChild(content);if(options.scroll!==null&&options.scroll.maxHeight!==''){element.style.overflowY='auto';element.style.maxHeight=options.scroll.maxHeight+'px';if(options.scroll.showOnHover===true){element.style.visibility='hidden'}}return element}},{key:'createProgressBar',value:function createProgressBar(){var element=document.createElement('div');element.setAttribute('class','noticejs-progressbar');var bar=document.createElement('div');bar.setAttribute('class','noticejs-bar');element.appendChild(bar);if(options.progressBar===true&&typeof options.timeout!=='boolean'&&options.timeout!==false){var frame=function frame(){if(width<=0){clearInterval(id);var item=element.closest('div.item');if(options.animation!==null&&options.animation.close!==null){item.className=item.className.replace(new RegExp('(?:^|\\s)'+options.animation.open+'(?:\\s|$)'),' ');item.className+=' '+options.animation.close;var close_time=parseInt(options.timeout)+500;setTimeout(function(){helper.CloseItem(item)},close_time)}else{helper.CloseItem(item)}}else{width--;bar.style.width=width+'%'}};var width=100;var id=setInterval(frame,options.timeout)}return element}}]);return Components}()})])});
/*
   DouyuEx WebSocket
    By: 小淳
    此处为一些公共函数
*/

function WebSocket_Packet(str) {
    const MSG_TYPE = 689;
    let bytesArr = stringToByte(str);   
    let buffer = new Uint8Array(bytesArr.length + 4 + 4 + 2 + 1 + 1 + 1);
    let p_content = new Uint8Array(bytesArr.length); // 消息内容
    for (let i = 0; i < p_content.length; i++) {
        p_content[i] = bytesArr[i];
    }
    let p_length = new Uint32Array([bytesArr.length + 4 + 2 + 1 + 1 + 1]); // 消息长度
    let p_type = new Uint32Array([MSG_TYPE]); // 消息类型

    buffer.set(new Uint8Array(p_length.buffer), 0);
    buffer.set(new Uint8Array(p_length.buffer), 4);
    buffer.set(new Uint8Array(p_type.buffer), 8);
    buffer.set(p_content, 12);

    return buffer;
}

function stringToByte(str) {  
    let bytes = new Array();  
    let len, c;  
    len = str.length;  
    for(let i = 0; i < len; i++) {  
        c = String(str).charCodeAt(i);  
        if(c >= 0x010000 && c <= 0x10FFFF) {  
            bytes.push(((c >> 18) & 0x07) | 0xF0);  
            bytes.push(((c >> 12) & 0x3F) | 0x80);  
            bytes.push(((c >> 6) & 0x3F) | 0x80);  
            bytes.push((c & 0x3F) | 0x80);  
        } else if(c >= 0x000800 && c <= 0x00FFFF) {  
            bytes.push(((c >> 12) & 0x0F) | 0xE0);  
            bytes.push(((c >> 6) & 0x3F) | 0x80);  
            bytes.push((c & 0x3F) | 0x80);  
        } else if(c >= 0x000080 && c <= 0x0007FF) {  
            bytes.push(((c >> 6) & 0x1F) | 0xC0);  
            bytes.push((c & 0x3F) | 0x80);  
        } else {  
            bytes.push(c & 0xFF);  
        }  
    }  
    return bytes;  
}

function byteToString(arr) {
    if(typeof arr === 'string') {
        return arr;
    }
    let str = '',
        _arr = arr;
    for(let i = 0; i < _arr.length; i++) {
        let one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
        if(v && one.length == 8) {
            let bytesLength = v[0].length;
            let store = _arr[i].toString(2).slice(7 - bytesLength);
            for(let st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
        } else {
            str += String.fromCharCode(_arr[i]);
        }
    }
return str;
}


function hex2bin(e) {
    if ("string" === typeof e && e.length % 8 === 0) {
        for (let r = [], t = e.length, o = 0; o < t;) r.push(e.substr(o, 2)), o += 2;
        for (let n = [], i = r.length, s = 0; s < i;) n.push(parseInt(r.slice(s, s + 4).reverse().join(""), 16)), s += 4;
        return n
    }
    return null
}

function hex(e) {
    if (Array.isArray(e)) {
        let r = "0123456789abcdef".split("");
        return e.map(function (e) {
            for (let t = "", o = 0; o < 4; o++) t += r[e >> 8 * o + 4 & 15] + r[e >> 8 * o & 15];
            return t
        }).join("")
    }
    return ""
}

class Ex_WebSocket_Login {
  constructor({ did, rid, stk, ltkid, username, biz }) {
    this.did = did;
    this.rid = rid;
    this.stk = stk;
    this.ltkid = ltkid;
    this.username = username; 
    this.biz = biz;
  
    this.ws = null; // WebSocket 实例
    this.heartbeatInterval = null; // 心跳定时器
    this.prevKd = "";
  }

  async connect() {
    if (!this.rid || this.rid <= 0 || this.rid === "") {
      this.rid = "4042402"; // 默认房间号
    }

    const rt = Math.floor(Date.now() / 1000).toString();
    const vk = hex_md5(rt + "r5*^5;}2#${XF[h+;'./.Q'1;,-]f'p[" + this.did);

    try {
      // 创建 WebSocket 连接
      this.ws = new WebSocket("wss://wsproxy.douyu.com:6671");

      // 绑定事件
      this.ws.onopen = () => {
        const loginMessage = `type@=loginreq/roomid@=${this.rid}/dfl@=sn@AA=107@ASss@AA=1@Ssn@AA=108@ASss@AA=1@Ssn@AA=105@ASss@AA=1/username@=${this.username}/password@=/ltkid@=${this.ltkid}/biz@=${this.biz}/stk@=${this.stk}/devid@=${this.did}/ct@=0/pt@=2/cvr@=0/tvr@=7/apd@=/rt@=${rt}/vk@=${vk}/ver@=20220825/aver@=218101901/`;
        this.write(loginMessage); // 发送登录消息
        // 开始发送心跳包
        this.startHeartbeat();
      };

      this.ws.onmessage = (e) => {
        let reader = new FileReader();
        reader.onload = () => {
            let arr = String(reader.result).split("\0"); // 分包
            reader = null;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].length > 12) {
                    // 过滤第一条和心跳包
                    this.onMessage(arr[i]);
                }
            }
        };
        reader.readAsText(e.data);
      };

      this.ws.onerror = (err) => {
        this.stopHeartbeat();
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
      };

    } catch (error) {
      console.log(error);
    }
  }

  write(message) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }
    const data = WebSocket_Packet(message);
    this.ws.send(data);
  }

  onMessage(data) {
    try {
      const msg = stt_deserialize(data);
      switch (msg.type) {
        case "loginres":
          this.write(`type@=h5ckreq/rid@=${this.rid}/ti@=220120241210/`);
          return;
        case "keeplive":
          this.prevKd = msg.kd;
          break;
        default:
          break;
      }
    } catch (err) {
    }
  }

  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      const tick = Math.floor(Date.now() / 1000); // 当前时间戳
      const message = `type@=keeplive/vbw@=0/cdn@=scdnctshh/tick@=${tick}/kd@=${this.getKd(this.prevKd)}/`;
      this.write(message); // 发送心跳包
    }, 30000); // 每30秒发送一次心跳包
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async close() {
    this.stopHeartbeat(); // 停止心跳包
    if (this.ws) {
      this.ws.close();
      await this.sleep(1000);
      this.ws = null;
    }
  }

  getKd = (prevKd) => {
    if (prevKd === "") return "";
    let v = this.hex2bin(prevKd);
    let rs = 32;

    let k = [0x174d4dc8, 0xfb8b26a6, 0x7b5a767d, 0x3b251e1f];
    for (let I = 0; I < v.length; I += 2) {
      let i,
        v0 = v[I],
        v1 = v[I + 1],
        delta = 0x9e3779b9,
        sum = delta * rs;
      v0 += 0x6bec8b74;
      v0 += 0xcce4ab9;
      v1 -= 0x60dd744b;
      v1 -= 0x4f105ed9;
      for (i = 0; i < rs; i++) {
        v1 -= (((v0 << 4) ^ (v0 >>> 5)) + v0) ^ (sum + k[(sum >>> 11) & 3]);
        sum -= delta;
        v0 -= (((v1 << 4) ^ (v1 >>> 5)) + v1) ^ (sum + k[sum & 3]);
      }
      v0 -= 0xa2b59350;
      v0 -= 0xbe7635a2;
      v1 += 0xa30dde55;
      v1 += 0xa2b59350;
      v[I] = v0;
      v[I + 1] = v1;
    }
    return this.hex(v);
  };

  hex2bin = (e) => {
    if ("string" === typeof e && e.length % 8 === 0) {
      let r = [];
      let n = [];
      for (let t = e.length, o = 0; o < t; ) r.push(e.substr(o, 2)), (o += 2);
      for (let i = r.length, s = 0; s < i; )
        n.push(
          parseInt(
            r
              .slice(s, s + 4)
              .reverse()
              .join(""),
            16
          )
        ),
          (s += 4);
      return n;
    }
    return [];
  };

  hex = (v) => {
    let r = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    let t = "";
    for (let e of v) {
      for (let i = 0; i < 4; i++) {
        t += r[(e >> (8 * i + 4)) & 15] + r[(e >> (8 * i)) & 15];
      }
    }
    return t;
  };
}
/*
   DouyuEx WebSocket UnLogin
    By: 小淳
*/
class Ex_WebSocket_UnLogin {
    constructor(rid, msgHandler) {
        if ("WebSocket" in window) {
            this.timer = 0;
            this.rid = rid;
            this.msgHandler = msgHandler;
            this.connect();
        }
    }

    connect() {
        this.ws = new WebSocket("wss://danmuproxy.douyu.com:850" + String(getRandom(2, 5)));
        this.ws.onopen = () => {
            this.ws.send(WebSocket_Packet("type@=loginreq/roomid@=" + this.rid));
            this.ws.send(WebSocket_Packet("type@=joingroup/rid@=" + this.rid + "/gid@=-9999/"));
            // this.ws.send(WebSocket_Packet("type@=sub/mt@=asr_caption/"));
            this.timer = setInterval(() => {
                this.ws.send(WebSocket_Packet("type@=mrkl/"));
            }, 40000);
        };

        this.ws.onerror = () => {
            this.close();
        };

        this.ws.onmessage = (e) => {
            let reader = new FileReader();
            reader.onload = () => {
                let arr = String(reader.result).split("\0"); // 分包
                reader = null;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].length > 12) {
                        // 过滤第一条和心跳包
                        this.msgHandler(arr[i]);
                    }
                }
            };
            reader.readAsText(e.data);
        };

        this.ws.onclose = () => {
            this.close();
            this.reconnect();
        };
    }

    reconnect() {
        setTimeout(() => {
            this.connect();
        }, 3000); // 3秒后尝试重新连接
    }

    close() {
        clearInterval(this.timer);
        this.ws.close();
    }
}

function initRouter(href) {
    initRouter_DouyuRoom_Main();
}
function initRouter_DouyuRoom_Main() {
    let intID = setInterval(() => {
        let dom1 = document.getElementsByClassName("BackpackButton")[0];
        let dom2 = document.getElementsByClassName("Barrage-main")[0];
        if (!dom1 || !dom2) {
            return;
        }
        setTimeout(() => {
            initStyles();
            initPkg();
        }, 1500)
        clearInterval(intID);
    }, 1000);
}


(async function() {
	initRouter(window.location.href);
})();