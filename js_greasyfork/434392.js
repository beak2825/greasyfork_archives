// ==UserScript==
// @name            Fuck百度云
// @description     就他妈不装百度云管家
// @namespace       http://www.jycggyh.cn/
// @author          艮古永恒
// @version         1.1.0
// @include         pan.baidu.com/*
// @match           *://pan.baidu.com/*
// @grant           none
// @run-at          document-end
// @require         https://greasyfork.org/scripts/21104-%E6%88%91%E7%9A%84js%E5%87%BD%E6%95%B0%E5%BA%93/code/%E6%88%91%E7%9A%84JS%E5%87%BD%E6%95%B0%E5%BA%93.user.js
// @downloadURL https://update.greasyfork.org/scripts/434392/Fuck%E7%99%BE%E5%BA%A6%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/434392/Fuck%E7%99%BE%E5%BA%A6%E4%BA%91.meta.js
// ==/UserScript==
 
function addToolbarBtn2(name, iconClass) {
  // toolbar Div
  var oToolbar = queryByCName("bar").getElementsByTagName("div")[1];
  // new btn
  var oButton = document.createElement("a");
  oButton.className = "g-button";
  oButton.href="javascript:void(0)";
  oToolbar.appendChild(oButton);
  // btn -> span
  var oBtnRoot = document.createElement("span");
  oBtnRoot.className = "g-button-right";
  oButton.appendChild(oBtnRoot);
  // btn -> span -> em
  oBtnIcon = document.createElement("em");
  oBtnIcon.className = iconClass;
  oBtnIcon.title = name;
  oBtnRoot.appendChild(oBtnIcon);
  // btn -> span -> text
  oBtnText = document.createElement("span");
  oBtnText.className = "text";
  oBtnText.innerHTML = name;
  oBtnRoot.appendChild(oBtnText);
  // set up end
  return oButton;
}
 
function getCurrentPath2() {
  var oUl = queryByCName("historylistmanager-history");
  var oLi = queryByTName("li", oUl)[1];
  var oSpans = oLi.getElementsByTagName("span");
  if(oSpans.length == 0) {
    return "";
  }
  var oSpan = oSpans[oSpans.length-1];
  return oSpan.title.substring(4);
}
 
// 初始化设置
var DownloadAPI = "https://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=266719&path=";
var oBtnDown = addToolbarBtn2("默认操作", "icon icon-download-gray");
var DOWNLOAD = false;
var oBtnIcon;
var oBtnText;
oBtnDown.onclick = function () {
  DOWNLOAD = !DOWNLOAD;
  updateBtn();
  
  if(!DOWNLOAD) {
    window.location.reload(true);
  }
  updateFiles();
}
 
function updateFiles() {
  if(!DOWNLOAD) {
  	return; 
  }
  var oFiles = queryByCName("list-view").getElementsByTagName("dd");
  var CurrentPath = getCurrentPath2();
  var oFile;
  for(var i = 0; i < oFiles.length; i++) {
      oFile = oFiles[i].getElementsByClassName("file-name")[0].getElementsByClassName("text")[0].getElementsByClassName("filename")[0];
      oFile.onclick = function() {
        window.location.href = DownloadAPI + CurrentPath + "/" + this.title;
      }
  }
}
 
function updateBtn() {
  if(!DOWNLOAD) {
  	oBtnIcon.title = "默认操作";
    oBtnText.innerHTML = "默认操作";
  } else {
    oBtnIcon.title = "下载操作";
    oBtnText.innerHTML = "下载操作";
  }
}