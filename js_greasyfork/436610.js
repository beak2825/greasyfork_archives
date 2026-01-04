// ==UserScript==
// @name        爱音乐管理平台自用增强
// @namespace   Violentmonkey Scripts
// @match       http://14.31.15.193:8000/admin_imusic_gd/*
// @match       http://121.14.110.97:8000/admin_imusic_gd/*
// @match       http://120.70.237.36:52304/admin_imusic_xj/*
// @grant       none
// @version     1.2
// @author      shiJiuRi
// @description 2021/12/6 上午11:59:46
// @downloadURL https://update.greasyfork.org/scripts/436610/%E7%88%B1%E9%9F%B3%E4%B9%90%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%87%AA%E7%94%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/436610/%E7%88%B1%E9%9F%B3%E4%B9%90%E7%AE%A1%E7%90%86%E5%B9%B3%E5%8F%B0%E8%87%AA%E7%94%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


const heartRate = 15 * 60; // 心率(心跳间隔时长. 单位:秒) // 15分钟/次

/** 救救眼睛吧 */
function helpEyes(){
  let colorVal = "#E5E5E5"; // 默认颜色
  try{
    colorVal = JSON.parse(window.localStorage.ayy_app_config).theme.sidebar.bgColor; // 当前选择菜单栏背景颜色
  }catch(e){}

  document.styleSheets.forEach((styleSheet, i) => {
    styleSheet.cssRules.forEach((rule, j) => {
      if(rule.selectorText && rule.selectorText.indexOf("#app-sidebar") > -1){
        rule.style.forEach((v, k) => {
          if(v === "background-image"){
            // console.log(i, j, k);
            rule.style["background-image"] = "";
            rule.style["background-color"] = colorVal;
          }
        })
      } 
    });
  });
}

/** sesion心跳 */
function heartbeat(){
  let url = window.location.origin + "/admin_api_imusic_gd/admin/setting/getPage.do";
  
  try {
		var xhreq; //创建对象
		if (window.XMLHttpRequest) {
			xhreq = new XMLHttpRequest();
		} else if (window.ActiveXObject) {
			xhreq = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xhreq.open("GET", url, true);
		xhreq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhreq.send(null);
		xhreq.onload = function (){
      console.log("❤扑通~");
    };
	} catch(e) {
    console.error("请求方法有误");
  }
}

function init(){
  helpEyes(); // 保护眼睛
  setInterval(heartbeat, heartRate * 1000); // 开始心跳
}


window.onload = function(){
  init();
}