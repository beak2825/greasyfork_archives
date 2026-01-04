// ==UserScript==
// @name               顶点PMS优化
// @version            1.0.11
// @description        Axure网页汉化
// @author             alone
// @license MIT
// @match             *://cowork.apexsoft.com.cn/*
// @match             *://192.168.0.63:8888/*
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAGdYAABnWARjRyu0AAADvSURBVDhPpZMBDYMwEEUrAQmTgIRJQQJOkICVOZgEJCBh+6/8u5QtJIxd8pf2/et6vZbSxqOUQVqlm1GGWG9vMNqHjEl6SYv0lDpbeJ0ZHjmTrS0EZhtUcJPYKZMYm+GRQ+4c5miQpTE2YwE68kcmlIV25zajMrQY1yDX/sKE5nC+XYMYm31yKoaxpg9Ik9omsvjuOWIMw2NObjY5Q5DSKJkdYnEIhvd1xRmYTvrtDwSvH0GDtoljhQqNj5oYfGuifup1SFeucWXy30MyYJeaJLGAEs895QiBtomc7/zHFCEjGrS9sCbEorI8SimlvAFZz+rpemKNSQAAAABJRU5ErkJggg==
// @grant            GM_registerMenuCommand
// @grant            GM_unregisterMenuCommand
// @grant            GM_notification
// @grant            GM_info
// @grant            GM_setValue
// @grant            GM_getValue
// @grant            GM_deleteValue
// @grant            GM_openInTab
// @grant            GM_addStyle
// @run-at           document-end
// @require          https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.3/pako.min.js
// @require          https://update.greasyfork.org/scripts/475259/1250106/ElementGetter_Alone.js
// @require          https://update.greasyfork.org/scripts/498507/1398070/sweetalert2.js
// @namespace        https://greasyfork.org/users/991143

// @homepageURL   https://greasyfork.org/zh-CN/scripts/485052-%E9%A1%B6%E7%82%B9pms%E4%BC%98%E5%8C%96
// @downloadURL https://update.greasyfork.org/scripts/485052/%E9%A1%B6%E7%82%B9PMS%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/485052/%E9%A1%B6%E7%82%B9PMS%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

const configIdList = ['addAjustWidth','perfAmsDocTree','pmsLogLargeFont','pmsChildTaskPerf','pmsDocumentPagePerf','pmsWholeFontPerf'];

const scriptInfo = GM_info.script,
      locHost = location.host,
      locHref = location.href,
      locHash = location.hash,
      locPath = location.pathname;

let t = {
  showNotice(msg) {
    GM_notification({
      text: msg,
      title: scriptInfo.name,
      image: scriptInfo.icon,
      highlight: false,
      silent: false,
      timeout: 1500,
    });
  },

  clog() {
    for (let m of arguments) {
      if (void 0 !== m) console.log(m);
    }
    console.groupEnd();
  },

  get(name, def) {
    return GM_getValue(name, def);
  },

  set(name, value) {
    GM_setValue(name, value);
  },

  delete(name) {
    GM_deleteValue(name);
  },

  registerMenu(title, func) {
    return GM_registerMenuCommand(title, func);
  },

  unregisterMenu(menuID) {
    GM_unregisterMenuCommand(menuID);
  },

  open(url, options = { active: true, insert: true, setParent :true }) {
    GM_openInTab(url, options);
  },

  http(link, s = false) {
    return link.startsWith("http")
      ? link
    : (s ? "https://" : "http://") + link;
  },

  title(a, mark="") {
    if (a.title)
      a.title += "\n" + mark + decodeURIComponent(a.href);
    else a.title = mark + decodeURIComponent(a.href);
  },

  hashcode(l=location) {
    return l.hash.slice(1);
  },

  search(l=location, p = "password") {
    let args = l.search.slice(1).split("&");
    for (let a of args) {
      if (a.includes(p + "="))
        return a.replace(p + "=", "");
    }
    return "";
  },

  clean(src, str) {
    for (let s of str) {
      src = src.replace(s, "");
    }
    return src;
  },

  loop(func, times) {
    let tid = setInterval(() => {
      if (times <= 0) clearInterval(tid);
      func();
      this.clog(times);
      times--;
    }, 100);
  },

  confirm(title, yes, no = () => {}, deny = false) {
    let option = {
      toast: true,
      showCancelButton: true,
      position: "center",
      title,
      confirmButtonText: "是",
      cancelButtonText: "否",
      showDenyButton: deny,
      denyButtonText: "取消",
      customClass: {
        popup: "lh-popup",
        content: "lh-content",
        closeButton: "lh-close"
      },
    };
    return Swal.fire(option).then((res) => {
      if (res.isConfirmed) yes();
      else if (res.isDismissed) no();
      else if (res.isDenied) deny();
    });
  },

  rand(min, max) {
    if (arguments.length == 1) max = min, min = 0;
    let random = Math.random(),
        randInt = Math.floor(random * (max + 1 - min)) + min;
    return randInt;
  },
};

// 解压字符串函数
function deGzip(compressedData) {
		var binaryString = atob(compressedData);
		var uint8Array = new Uint8Array(binaryString.length);
		for (var i = 0; i < binaryString.length; i++) {
				uint8Array[i] = binaryString.charCodeAt(i);
		}
		return pako.ungzip(uint8Array, { to: 'string' });
}

// 全局提示函数
let currentAlert = null; // 用于跟踪当前的提示框
function createAlert(message, type) {
  if (currentAlert) {
    currentAlert.remove(); // 销毁前一个提示框
  }

  const alert = document.createElement('div');
  alert.textContent = message;
  alert.style.position = 'fixed';
  alert.style.top = '-100px'; // 初始位置设置为隐藏在顶部
  alert.style.left = '50%';
  alert.style.transform = 'translateX(-50%)';
  alert.style.color = '#333';
  alert.style.padding = '10px 20px';
  alert.style.borderRadius = '5px';
  alert.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
  alert.style.zIndex = '99999';
  alert.style.fontFamily = 'monospace';

  switch (type) {
    case 'success':
      alert.style.backgroundColor = '#F6FFED';
      alert.style.border = '1px solid #B7EB8F';
      break;
    case 'info':
      alert.style.backgroundColor = '#E6F4FF';
      alert.style.border = '1px solid #91CAFF';
      break;
    case 'warning':
      alert.style.backgroundColor = '#FFFBE6';
      alert.style.border = '1px solid #FFE58F';
      break;
    case 'error':
      alert.style.backgroundColor = '#FFF2F0';
      alert.style.border = '1px solid #FFCCC7';
      break;
    default:
      alert.style.backgroundColor = '#E6F4FF';
      alert.style.border = '1px solid #91CAFF';
  }

  // 设置初始状态为隐藏
  alert.style.opacity = '0';
  alert.style.pointerEvents = 'none'; // 禁止点击事件

  document.body.appendChild(alert);

  // 使用CSS动画来实现下移渐显效果
  setTimeout(() => {
    alert.style.transition = 'top 0.3s, opacity 0.3s';
    alert.style.top = '20px'; // 下移
    alert.style.opacity = '1'; // 渐显
    alert.style.pointerEvents = 'auto'; // 恢复点击事件
  }, 0);

  // 3秒后隐藏提示信息
  setTimeout(() => {
    // 使用CSS动画来实现下移渐隐效果
    alert.style.transition = 'top 0.3s, opacity 0.3s';
    alert.style.top = '-20px'; // 下移
    alert.style.opacity = '0'; // 渐隐
    alert.style.pointerEvents = 'none'; // 禁止点击事件

    // 在动画结束后删除提示信息
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 3000);

  currentAlert = alert; // 更新当前的提示框
}

function menuStyle(){
  GM_addStyle(`.lh-popup{font-size:1em;font:16px/1.5"Microsoft Yahei",arial,helvetica,sans-serif}.lh-content{padding:0}.lh-close{box-shadow:none}.lh-close:focus{box-shadow:none}.lh-menu{margin:0;padding:0;list-style:none;font-size:18px}.lh-item{padding-top:20px;margin-bottom:0;list-style:inherit}.lh-footer{font-size:16px}.lh-footer a{font-size:18px;font-weight:700}.lh-item label{font-weight:400;display:inline-block;font-size:18px!important;margin-bottom:0}.lh-item input{-webkit-appearance:auto!important;background:#fff;width:auto;height:auto;float:none;margin-bottom:0;border:1px solid #e2e2e2;font-size:18px;padding:0}.lh-item input[type=range]{display:inline-block}.lh-item select{width:auto;border:1px solid #e2e2e2;font-size:16px;display:inline-block;background-color:#f8f8f8;color:#aaa;padding:0 30px 0 2px;border-radius:3px;height:30px;line-height:28px;outline:0;appearance:none;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAANCAYAAAC+ct6XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjBBRUQ1QTQ1QzkxMTFFMDlDNDdEQzgyNUE1RjI4MTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjBBRUQ1QTU1QzkxMTFFMDlDNDdEQzgyNUE1RjI4MTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMEFFRDVBMjVDOTExMUUwOUM0N0RDODI1QTVGMjgxMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMEFFRDVBMzVDOTExMUUwOUM0N0RDODI1QTVGMjgxMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk5mU4QAAACUSURBVHjaYmRgYJD6////MwY6AyaGAQIspCieM2cOjKkIxCFA3A0TSElJoZ3FUCANxAeAWA6IOYG4iR5BjWwpCDQCcSnNgxoIVJCDFwnwA/FHWlp8EIpHSKoGgiggLkITewrEcbQO6mVAbAbE+VD+a3IsJTc7FQAxDxD7AbEzEF+jR1DDywtoCr9DbhwzDlRZDRBgACYqHJO9bkklAAAAAElFTkSuQmCC);background-position:center right;background-repeat:no-repeat}.lh-item button{border:1px solid #e2e2e2;font-size:16px;padding:2px 5px;border-radius:10px;color:#000;background-color:#f0f0f0}.lh-item button:hover{background-color:#3e97eb;color:#fff}@keyframes hover-color{0%{border-color:#e2e2e2}to{border-color:#3e97eb}}.lh-item input[type=checkbox]{display:none;position:absolute}.lh-item input[type=checkbox]+span{position:relative;padding-left:30px;cursor:pointer}.lh-item input[type=checkbox]+span:hover:before{animation-duration:.4s;animation-fill-mode:both;animation-name:hover-color}.lh-item input[type=checkbox]+span:before{position:absolute;top:2px;left:5px;display:inline-block;width:20px;height:20px;content:"";border:1px solid #e2e2e2;border-radius:3px}.lh-item input[type=checkbox]+span:after{position:absolute;display:none;content:"";top:4px;left:12px;box-sizing:border-box;width:6px;height:12px;transform:rotate(45deg);border-width:2px;border-style:solid;border-color:#fff;border-top:0;border-left:0}.lh-item input[type=checkbox]:checked+span:before{animation-name:none;border:#3e97eb;background:#3e97eb}.lh-item input[type=checkbox]:checked+span:after{display:block}.swal2-container{z-index:99999;}`);
}


function showSettings() {
  let html = `<ul class="lh-menu">
  <li class="lh-item">
      <label title="">
          <span style="color: #3e97eb;font-weight:bold;">产品接口文档</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="接口定义：添加一键调整合适宽度；修改日志美化">
          <input type="checkbox" id="${configIdList[0]}"/>
          <span class="checkBoxText">添加一键调整合适宽度</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="产品接口文档树添加工具栏，图标修正，样式优化">
          <input type="checkbox" id="${configIdList[1]}"/>
          <span class="checkBoxText">产品接口文档左侧树结构优化</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="">
          <span style="color: #3e97eb;font-weight:bold;">任务界面</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="日志大字体">
          <input type="checkbox" id="${configIdList[2]}"/>
          <span class="checkBoxText">任务日志字体调大</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="子任务列表优化">
          <input type="checkbox" id="${configIdList[3]}"/>
          <span class="checkBoxText">子任务列表优化</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="">
          <span style="color: #3e97eb;font-weight:bold;">在线文档界面</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="去除无用图标">
          <input type="checkbox" id="${configIdList[4]}"/>
          <span class="checkBoxText">文档界面优化</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="">
          <span style="color: #3e97eb;font-weight:bold;">全局</span>
      </label>
  </li>
  <li class="lh-item">
      <label title="字体样式优化">
          <input type="checkbox" id="${configIdList[5]}"/>
          <span class="checkBoxText">字体样式优化</span>
      </label>
  </li>
  <li class="lh-item">
      <button type="button" id="restoreDefault" title="默认全部关闭">恢复默认并刷新</button>
      <button type="button" id="saveConfig" title="保存并刷新">保存并刷新</button>
  </li>
</ul>`;

  Swal.fire({
    title: '配置',
    html,
    footer: '<div class="lh-footer"></div>',
    showCloseButton: true,
    showConfirmButton: false,
    customClass: {
      popup: "lh-popup",
      content: "lh-content",
      closeButton: "lh-close"
    },
  });

  // 初始化配置
  function initConfig(){
    configIdList.forEach(v=>{
      $(`#${v}`).prop("checked", t.get(v) == true, false);
    });

  }
  initConfig();
  // 处理绑定事件
  /*$(`#addAjustWidth`).on("change", o => {
    let checked = o.target.checked;
      t.set('addAjustWidth', checked);
    });
  $(`#perfAmsDocTree`).on("change", o => {
    let checked = o.target.checked;
      t.set('perfAmsDocTree', checked);
    });
  $(`#pmsLogLargeFont`).on("change", o => {
    let checked = o.target.checked;
      t.set('pmsLogLargeFont', checked);
    });*/
  // 重置
  $(`#restoreDefault`).on("click", o => {
    let checked = o.target.checked;

    configIdList.forEach(v=>{
      t.delete(v);
    });
    initConfig();
    window.location.reload();
  });
  // 保存配置并刷新
  $(`#saveConfig`).on("click", o => {

    configIdList.forEach(v=>{
      t.set(v, $(`#${v}`).prop('checked') ||false);
    });
    window.location.reload();
  });
};

menuStyle();
t.registerMenu('配置', showSettings);

var appId , appBranch, apiDatas;
var zTree, sheetIframe;

function copyRichText(richText){
	const tempContainer = document.createElement('div');
	tempContainer.innerHTML = richText;
	document.body.appendChild(tempContainer);

	const range = document.createRange();
	range.selectNode(tempContainer);

	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);

	document.execCommand('copy');
	document.body.removeChild(tempContainer);
}

// 接口定义：添加一键调整合适宽度；接口定义说明优化;修改日志美化
function addAjustWidth (){
  // 增强，在sheet中增加调整宽度的按钮
  elmGetter.each('#luckysheet-wa-editor', document, (waEditor) => {

		// 分割线
    var sepDiv = document.createElement("div");
    sepDiv.id = 'toolbar-separator-merge-cell';
    sepDiv.className='luckysheet-toolbar-separator luckysheet-inline-block';
    sepDiv.style="user-select: none;";

				// 分割线
    var sepDiv2 = document.createElement("div");
    sepDiv2.id = 'toolbar-separator-merge-cell';
    sepDiv2.className='luckysheet-toolbar-separator luckysheet-inline-block';
    sepDiv2.style="user-select: none;";

    var ajstWidthDivHtml = '<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="一键调整宽度" id="luckysheet-icon-paintformat" role="button" style="user-select: none;"><div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block" style="user-select: none;"> <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block" style="user-select: none;">  <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">  <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont luckysheet-iconfont-yichu" style="user-select: none;"> </div> </div> </div> </div> </div>';

    var range = document.createRange();
    var fragment = range.createContextualFragment(ajstWidthDivHtml);
    var ajstWidthDiv = fragment.firstChild;

		// 一键调整宽度事件
    ajstWidthDiv.addEventListener("click", function() {
      var colWidths = {0: 104, 1: 144, 2: 143, 3: 124, 4: 122, 5: 123, 6: 126, 7: 205};
      var sheetIframe = window.frameElement;
      var ls = sheetIframe.contentWindow.luckysheet;
      ls.setColumnWidth(colWidths);

      var a0Value = ls.getCellValue(0,0);
      ls.setCellValue(0,0,a0Value);

      // setTimeout(()=>{
      //   saveApiDefine();
      // },300);
    });

		var copyAppTmplDivHtml = '<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="复制应用接口模版" id="luckysheet-icon-paintformat" role="button" style="user-select: none;"><div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block" style="user-select: none;"> <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block" style="user-select: none;">  <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">  <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont luckysheet-iconfont-" style="user-select: none;font-size: 14px;">应</div> </div> </div> </div> </div>';
    var fragment2 = range.createContextualFragment(copyAppTmplDivHtml);
    var copyAppTmplDiv = fragment2.firstChild;

    copyAppTmplDiv.addEventListener("click", function() {
			var sheetIframe = window.frameElement;
      var ls = sheetIframe.contentWindow.luckysheet;

		  let appCode = `app${Date.now()}`;

		  let appSheetDateGzip = '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';

			// 将功能码调整为时间戳后缀的
			ls.updataSheet({data:JSON.parse(deGzip(appSheetDateGzip).replaceAll('applicationTemplate',appCode))});
			setTimeout(() => {
      	var a0Value = ls.getCellValue(0,1);
			  ls.setCellValue(0,1,a0Value);
    	}, 300);

			createAlert("已粘贴应用接口模版，请修改内容","success");
    });


		var copyDomainTmplDivHtml = '<div class="luckysheet-toolbar-button luckysheet-inline-block" data-tips="复制领域接口模版" id="luckysheet-icon-paintformat" role="button" style="user-select: none;"><div class="luckysheet-toolbar-button-outer-box luckysheet-inline-block" style="user-select: none;"> <div class="luckysheet-toolbar-button-inner-box luckysheet-inline-block" style="user-select: none;">  <div class="luckysheet-icon luckysheet-inline-block " style="user-select: none;">  <div aria-hidden="true" class="luckysheet-icon-img-container luckysheet-icon-img iconfont luckysheet-iconfont-" style="user-select: none;font-size: 14px;">领</div> </div> </div> </div> </div>';
    var fragment3 = range.createContextualFragment(copyDomainTmplDivHtml);
    var copyDomainTmplDiv = fragment3.firstChild;

    copyDomainTmplDiv.addEventListener("click", function() {
			var sheetIframe = window.frameElement;
      var ls = sheetIframe.contentWindow.luckysheet;
			let domainCode = `domain${Date.now()}`;
     const domainSheetDateGzip = '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';
				// 将功能码调整为时间戳后缀的
			ls.updataSheet({data:JSON.parse(deGzip(domainSheetDateGzip).replaceAll('domainTemplate',domainCode))});

			setTimeout(() => {
      	var a0Value = ls.getCellValue(0,1);
			  ls.setCellValue(0,1,a0Value);
    	}, 300);
			createAlert("已粘贴领域接口模版，请修改内容","success");
    });
		waEditor.firstChild.nextElementSibling.nextElementSibling.setAttribute('data-tips','保存');
    waEditor.insertBefore(sepDiv2,waEditor.firstChild.nextElementSibling.nextElementSibling.nextElementSibling);
    waEditor.insertBefore(ajstWidthDiv,sepDiv2);
    waEditor.insertBefore(copyAppTmplDiv,ajstWidthDiv);
    waEditor.insertBefore(copyDomainTmplDiv,ajstWidthDiv);
    waEditor.insertBefore(sepDiv,copyAppTmplDiv);
  });

  GM_addStyle(`
 /* 优化接口说明样式 */
 .w-e-text-container [data-slate-editor] {
  padding: 0px 10px 20px 10px !important;
}
#changeTime{
  font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif !important;
}
  `);
}
// 产品接口文档树添加工具栏，图标修正，样式优化
var count = 1;
function posiToCurrSelectedNode(){
  var container = document.getElementById('apiTree');

  elmGetter.each('li:has(>.curSelectedNode)', document, (targetItem) => {
    // 计算目标元素的中心位置
    var scrollToPosition = targetItem.offsetTop - container.clientHeight/2;
    scrollToPosition > 0 ? scrollToPosition : 0;
    container.scrollTop =scrollToPosition;
  });

}
function perfAmsDocTree(){

  // 接口树增强，增加扩展按钮
  elmGetter.each('#apiList', document, (apiList) => {
    sheetIframe = window.frameElement;
    var toolBarDiv = document.createElement("div");
    toolBarDiv.id = 'apiListToolbar';
    toolBarDiv.className='';
    toolBarDiv.style="margin-bottom:-5px";

    apiList.insertBefore(toolBarDiv,apiList.firstChild);

    var btnCollApseAllText = '<button type="button" id="btn_collapseAll" style="font-size: 12px">折叠</button>';

    var range = document.createRange();
    var fragment = range.createContextualFragment(btnCollApseAllText);
    var btnCollApseAll = fragment.firstChild;

    btnCollApseAll.addEventListener("click", function() {
      sheetIframe.contentWindow.postMessage({type: "collapseAll"}, "/");
    });

    toolBarDiv.appendChild(btnCollApseAll);

    // 展开一级
    var btnExpandFirstText = '<button type="button" id="btn_expandAll" style="font-size: 12px">展开一级</button>';

    var range2 = document.createRange();
    var fragment2 = range2.createContextualFragment(btnExpandFirstText);
    var btnExpandFirst = fragment2.firstChild;

    btnExpandFirst.addEventListener("click", function() {
      // 关闭二级
      document.querySelectorAll('#apiTree>li>ul>li>span.center_open, #apiTree>li>ul>li>span.bottom_open').forEach(v=>v.click());
      // 展开一级
      document.querySelectorAll('#apiTree>li>span.center_close, #apiTree>li>span.bottom_close').forEach(v=>v.click());
    });

    toolBarDiv.appendChild(btnExpandFirst);

    // 展开全部
    var btnExpandAllText = '<button type="button" id="btn_expandAll" style="font-size: 12px">展开全部</button>';

    var range3 = document.createRange();
    var fragment3 = range3.createContextualFragment(btnExpandAllText);
    var btnExpandAll = fragment3.firstChild;

    btnExpandAll.addEventListener("click", function() {
      zTree.expandAll(true);
    });

    toolBarDiv.appendChild(btnExpandAll);

    // 刷新
    var btnRefreshText = '<button type="button" id="btn_refresh" style="font-size: 12px">刷新</button>';

    var range4 = document.createRange();
    var fragment4 = range4.createContextualFragment(btnRefreshText);
    var btnRefresh = fragment4.firstChild;

    btnRefresh.addEventListener("click", function() {
      zTree.expandAll(true);
      count = 1;
      refreshApiList(sheetIframe.contentWindow.appId,sheetIframe.contentWindow.appBranch);
    });

    toolBarDiv.appendChild(btnRefresh);

    // 定位
    var btnPosiText = '<button type="button" disabled id="btn_posi" style="font-size: 12px">定位</button>';

    var range5 = document.createRange();
    var fragment5 = range5.createContextualFragment(btnPosiText);
    var btnPosi = fragment5.firstChild;

    btnPosi.addEventListener("click", function() {
      posiToCurrSelectedNode();
    });

    toolBarDiv.appendChild(btnPosi);

    // 树节点增加统计下级数量。当右侧表格渲染完成时可以获取到左侧树结构变量
    // todo 需要优化，树刷新时重新统计
    /*elmGetter.each('#luckysheet-wa-editor', document, (sheet) => {
      fillAllNodeNameWithChildCount();
    });*/

  });

  // 重写刷新接口列表函数，刷新后重新加载文件夹子接口数量
  elmGetter.each('#apiTree', document, (apiTree) => {

    // 定义属性变化的回调函数
    var observerCallback = function(mutationsList) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          var btnPosi = document.querySelector('#btn_posi');
          if(document.querySelector('li:has(>.curSelectedNode)')){
            btnPosi.disabled = false;
          }else{
            btnPosi.disabled = true;
          }
        }
      }
    };

    // 创建一个观察者实例并配置观察选项
    var observer = new MutationObserver(observerCallback);
    var observerConfig = {
      attributes: true,
      attributeFilter: ['class'], // 仅监控class属性
      subtree: true
    };

    // 开始观察ul元素及其子元素的class属性变动
    observer.observe(apiTree, observerConfig);


    sheetIframe.contentWindow.onload = function() {
      var _ = refreshApiList;
      refreshApiList = function(arg1, arg2) {
        _(arg1, arg2);
        zTree = sheetIframe.contentWindow.zTree;
        zTree.expandAll(true);
        fillAllNodeNameWithChildCount();
        if(count==1){
          zTree.expandAll(false);
          count++;
        }
      };
    };
  });

  GM_addStyle(`
		/* 产品接口文档 接口图标修正 */
		.ztree li span.button.ico_docu {
				background-position: -110px -31px !important;
		}
		.ztree li span.button {
				height: 14px !important;
		}
		.ztree li span.button.ico_open {
				background-position: -110px -15px !important;
		}
		.ztree li span.button.add {
				background-position: -144px 1px !important;
		}
		.ztree li span.button.edit {
				background-position: -110px -47px !important;
		}
		/* 产品接口文档树 优化样式 */
		.ztree li a.curSelectedNode {
				background-color: bisque !important;
				height: 16px !important;
				border-radius: 3px;
		}
		.ztree li a {
				padding: 2px 0px 2px 0px !important;
				height: 17px !important;
				font-size: 13px !important;
		}
		.ztree li a:hover {
				background-color: bisque !important;
				padding: 2px 0px 2px 0px !important;
				font-size: 13px !important;
				border-radius: 3px;
		}
		#apiList{
			height: calc(100vh - 22px) !important;
			padding-top: 10px;
		}
		.ztree li a.tmpTargetNode_inner {
			background-color: #70B5FC !important;
			color:white; height:16px !important;
			border:1px #4191E2 solid !important;
			border-raduis: 3px;
		}
		.ztree li a.curSelectedNode_Edit input.rename{
			width: fit-content ;
			font-size: 13px;
		}
		ul#apiTree {
			height: 93% !important;
		}
`);
}
// 补充接口文件夹的接口数量统计，忽略新加未维护内容的节点
function fillAllNodeNameWithChildCount(){

  var apiTree = sheetIframe.contentWindow.zTree;
  var apiNodes = apiTree.getNodes();
  if(apiTree){
    var treeDatas = apiTree.transformTozTreeNodes(apiNodes);
    function countChild(children) {
      var apiCount = 0;
      var apiNode = children.filter(v=>v.isParent==false && v.apiCode != 'apiDemo');
      apiCount += apiNode.length;
      var parentNodes = children.filter(v=>v.isParent==true && Array.isArray(v.children) && v.children.length > 0);
      parentNodes.forEach(p=>{
        if (Array.isArray(p.children) && p.children.length > 0) {
          apiCount+=countChild(p.children);
        }
      });
      return apiCount;
    };
    function fillNameWithChildCount(parentNode){
      var apiCount = 0;
      // 拼接新的字符串
      const newTid = parentNode.tId;
      var nameNode = document.querySelector(`#${newTid}>a>span.node_name`);
      if(!nameNode) return;
      //const pNode = zTree.getNodeByParam("id", parentNode.id, null);
      //var nameNode = zTree.getNodeByParam("id", newTid, null);
      const {id,children=[]} = parentNode;
      if (parentNode.isParent==true && Array.isArray(children) && children.length > 0) {
        apiCount = countChild(children);
        nameNode.innerText = parentNode.name + `(${apiCount})`;
        parentNode.children.forEach(p=>{
          fillNameWithChildCount(p);
        });
      } else if(parentNode.isParent==true && children.length == 0){
        nameNode.innerText = parentNode.name + `(0)`;
      } else {
        // 普通节点
      }
    }
    treeDatas.forEach(p=>{
      fillNameWithChildCount(p);
    });
  }
  posiToCurrSelectedNode();
};

// 任务日志字体调大
function pmsLogLargeFont(){
  // 日志展示全部内容tip
  elmGetter.each('#changeTime > a', document, (logA) => {
    logA.title = logA.innerText;
  });

  GM_addStyle(`/* 日志大字体 */
		div.taskcontent ol,ul{
			padding-left: 1rem;
		}
		div.taskcontent ol > li{
			list-style: auto;
		}
		div.taskcontent ul > li {
			list-style: disc;
		}
		div[id*="rwxqID_taskDetail_"] > div:nth-child(2) > div.p-rwxq-left > div > div.dataContainer {
				background:#fff !important;
		}

		div[id*="rwxqID_taskDetail_"] > div:nth-child(2) > div.p-rwxq-left > div > div.dataContainer > div {
				border: none;
		}
		.logDataContainer * {
				font-size: 14px !important;
		}
		div[id*="logList"] .logTable{
				border-bottom: 0px !important;
		}
		ul.tab > li * {
				font-size: 14px !important;
		}
		div.p-rwxq-right > div.p-rwxq-info-list > p > span,span>a{
				font-size: 14px !important;
		}
		strong{
				font-weight: bold;
		}
		button[data-menu-key="Save"] {
				color: red;
		}
		button.disabled[data-menu-key="Save"]{
		background: transparent;
		}

		.luckysheet-toolbar-combo-button{
		vertical-align: middle !important;
		}

		.luckysheet-toolbar-combo-button-inner-box, .luckysheet-toolbar-combo-button-outer-box {
		vertical-align: middle !important;
		}
		#changeLog{
		float: none !important;
		width: fit-content;
		}
		#changeTime{
			max-width: 400px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		#changeTime > a:hover{
		background-color: bisque;
		}
		#changeTime > a{
		color: black;
		}
		.logtime {
			color: inherit !important;
			border-bottom: 2px #FFB951 solid;
			margin-bottom: 5px;
			list-style: decimal;
	}`);
}

// 子任务列表优化
function pmsChildTaskPerf(){
  // 格式化子任务结束日期

  //格式化主任务各种日期
  const dateSelectors = [
    'div[id*="ID_taskzrw"] > table.tmTable > tbody.bglsCont > tr> td:nth-child(4)',
    'div[id*="rwxqID_taskDetail"] > div:nth-child(3) > div.p-rwxq-right > div.p-rwxq-info-list > p:nth-child(10) > span',
    'div[id*="rwxqID_taskDetail"] > div:nth-child(3) > div.p-rwxq-right > div.p-rwxq-info-list > p:nth-child(11)> span',
    'div[id*="rwxqID_taskDetail"] > div:nth-child(3) > div.p-rwxq-right > div.p-rwxq-info-list > p:nth-child(12)> span',
    'div[id*="rwxqID_taskDetail"] > div:nth-child(3) > div.p-rwxq-right > div.p-rwxq-info-list > p:nth-child(19)> span',
    'div[id*="rwxqID_taskDetail"] > div:nth-child(3) > div.p-rwxq-right > div.p-rwxq-info-list > p:nth-child(20)> span',
    'div[id*="rwxqID_taskDetail"] > div:nth-child(3) > div.p-rwxq-right > div.p-rwxq-info-list > p:nth-child(21)> span',
    'div[id*="rwxqID_taskDetail"] > div:nth-child(3) > div.p-rwxq-right > div.p-rwxq-info-list > p:nth-child(22)> span',
    'div[id*="logList"] > div:nth-child(1) > div > div.logDataContainer > div > div:nth-child(1) > table > tbody > tr:nth-child(2) > td',
    'div[id*="logList"] > div:nth-child(1) > div > div.logDataContainer > div > div:nth-child(2) > div.tableContainer > table.logTable > tbody > tr:nth-child(2) > td:nth-child(1)'
  ];
  dateSelectors.forEach(v=>{
    elmGetter.each(v, document, (dateDom) => {
      if(/(\d{4})-*(\d{2})-*(\d{2})/.test(dateDom.innerText)){
        dateDom.innerText = dateDom.innerText.replace(/(\d{4})-*(\d{2})-*(\d{2})/, "\$1/\$2/\$3");
      }
    });
  });
	// 表头增加操作列
	elmGetter.each('div[id*="ID_taskzrw"] > table.tmTable > tbody:nth-child(1)', document, (titleTbody) => {
		  var parent = titleTbody.querySelector('tr');
			var operBtn = parent.querySelector('th:last-child').cloneNode(true);
			operBtn.setAttribute('width', '8%');
			operBtn.setAttribute('title', '');
			operBtn.innerHTML = `操作`;

			parent.appendChild(operBtn);
  });
	// 子任务增加操作列
  elmGetter.each('div[id*="ID_taskzrw"] > table.tmTable > tbody.bglsCont > tr', document, (parent) => {
		var pmsNumberDom = parent.querySelector('td:nth-child(1)')
		var statNameDom = parent.querySelector('td:nth-child(3)')
		var pmsEndDateDom = parent.querySelector('td:nth-child(4)')
		var exerDom = parent.querySelector('td:nth-child(5)')
		var taskId = null;
		if(/(\d+)(?:\-.+)/.test(pmsNumberDom.innerText)){
		  taskId = pmsNumberDom.innerText.match(/(\d+)(?:\-.+)/)[1];
		}

		statNameDom.style.textAlign = 'center';
		pmsEndDateDom.style.textAlign = 'center';
		exerDom.style.textAlign = 'center';

		// 添加操作按钮
		var operBtn = exerDom.cloneNode(true);
		operBtn.style.textAlign = 'center';
		operBtn.innerHTML = '';

	  //给任务状态增加颜色
		if(taskId){
			var backgroudColorObj = {
				'完成': '#bdf3bd',
				'取消': '#d7d7d7',
				'关闭': '#d7d7d7',
				'待审核': '#ffd99b',
				'测试中': '#ffd99b',
				'开发中': '#ff9999',
				'打开': '#ff4b4b'
			};
			if(Object.keys(backgroudColorObj).includes(statNameDom.innerText)){
				statNameDom.style.backgroundColor = backgroudColorObj[statNameDom.innerText];
			}
			if(['打开','开发中','待审核'].includes(statNameDom.innerText)){
				operBtn.innerHTML = `<a href="http://cowork.apexsoft.com.cn/plug-in/cowork/addTask.jsp?ID=${taskId}&GZDD=null&extWindow=false&PopupWin=false">编辑</a>`;
			}
		}
		parent.appendChild(operBtn);
  });

  // 隐藏难看的分割线
  elmGetter.each('div[id*="rwxqID_taskDetail_"]', document, (parent) => {
    var hr = parent.querySelector('hr');
    parent.removeChild(hr);
  });

	// 给分配人的任务列表增加任务跳转链接
	elmGetter.each('div[id*="ID_userTask_"] > div > div.myTaskGrid.ac-grid > table > tbody > tr.p-table-data ', document, (parent) => {

		var pmsNumberDom = parent.querySelector('td:nth-child(1)');
		var pmsTitleDom = parent.querySelector('td:nth-child(2)');
		var statNameDom = parent.querySelector('td:nth-child(3)');
		pmsNumberDom.innerHTML = `<a href='http://cowork.apexsoft.com.cn/plug-in/cowork/taskDetail_new.jsp?ID=${pmsNumberDom.innerText}' target='_blank'>${pmsNumberDom.innerText}</a>`;
		pmsTitleDom.innerHTML = `<a href='http://cowork.apexsoft.com.cn/plug-in/cowork/taskDetail_new.jsp?ID=${pmsNumberDom.innerText}' target='_blank'>${pmsTitleDom.innerText}</a>`;

		//给任务状态增加颜色
		var backgroudColorObj = {
			'完成': '#bdf3bd',
			'取消': '#d7d7d7',
			'关闭': '#d7d7d7',
			'待审核': '#ffd99b',
			'测试中': '#ffd99b',
			'开发中': '#ff9999',
			'打开': '#ff4b4b'
		};
		if(Object.keys(backgroudColorObj).includes(statNameDom.innerText)){
			statNameDom.style.backgroundColor = backgroudColorObj[statNameDom.innerText];
		}
  });

	// 给分配人的任务列表表头调整宽度
	elmGetter.each('div[id*="ID_userTask_"] > div > div.myTaskGrid.ac-grid > table > thead > tr', document, (parent) => {
		parent.querySelector('th:nth-child(1)').setAttribute('width','5%');
    parent.querySelector('th:nth-child(2)').setAttribute('width','40%');
    parent.querySelector('th:nth-child(3)').setAttribute('width','5%');
    parent.querySelector('th:nth-child(4)').setAttribute('width','5%');
    parent.querySelector('th:nth-child(5)').setAttribute('width','5%');
    parent.querySelector('th:nth-child(6)').setAttribute('width','5%');
    parent.querySelector('th:nth-child(7)').setAttribute('width','5%');
  });

	// 移除任务信息下的分割线
  elmGetter.each('div[id*="rwxqID_taskDetail_"] > div:nth-child(2) > div.p-rwxq-right', document, (parent) => {
    var hr = parent.querySelector('div:nth-child(2)');
    parent.removeChild(hr);
  });

	// 隐藏 分配人的任务列表 多余的分页控件
  elmGetter.each('div[id*="ID_userTask_"] > div.box', document, (parent) => {
    var pagerCountDom = parent.querySelector('div.pager-cont');
		if(pagerCountDom){
    	parent.removeChild(pagerCountDom);
		}
  });

  // 给子任务列表增加排序功能
  elmGetter.each('div[id*="ID_taskzrw"] > table.tmTable', document, (table) => {

    // 获取表格头部的所有单元格
    const headers = table.querySelectorAll("th");

    // 为每个表头添加点击事件监听器，以对其内容进行排序
    headers.forEach((header) => {
      let reverse = false;
      header.style.cursor='pointer';
      header.title='点击排序当页任务';
      header.addEventListener("click", () => {
        // 获取表头单元格的数据索引
        const index = header.cellIndex;

        // 获取表格主体的所有行
        const rows = table.querySelectorAll("tbody.bglsCont tr");

        // 将行按指定列的内容进行排序
        // 将行按指定列的内容进行排序
        Array.from(rows).sort((a, b) => {
          const aValue = a.children[index].textContent;
          const bValue = b.children[index].textContent;
          if (aValue.replace(/\s/g, "").length === 0 && bValue.replace(/\s/g, "").length !== 0) {
            return 1;
          } else if (aValue.replace(/\s/g, "").length !== 0 && bValue.replace(/\s/g, "").length === 0) {
            return -1;
          }
          else if (reverse) {
            return aValue.localeCompare(bValue);
            if(bValue == undefined || bValue =='') return -1;
          }else{
            return bValue.localeCompare(aValue);
            if(bValue == undefined || bValue =='') return 1;
          }
        }).forEach((row) => {
          table.querySelector("tbody.bglsCont").appendChild(row);
        });

        // 切换 reverse 标志
        reverse = !reverse;
      });
    });
  });

  GM_addStyle(`/* 子任务列表选中状态 */
    div[id*="ID_userTask_"] > div.box > div.pager-cont{
			display: none;
    }
		div[id*="ID_taskzrw"] > table.tmTable > tbody.bglsCont > tr:hover {
			background-color: #99bbe842;
		}
		/* 分配人的任务列表任务主题居左 */
		div[id*="ID_userTask_"] > div > div.myTaskGrid.ac-grid > table > tbody > tr > td:nth-child(2) {
			text-align: left;
		}
		/*分配人的任务列表样式修正*/
		.p-table-data tr.hover td {
			background-color: inherit ;
		}
		.p-table-bmbd tr.hover td {
			background-color: inherit ;
		}
		.box table tr:hover {
			background: #99bbe842;
		}
	`);
}

// 文档打开界面优化
function pmsDocumentPagePerf(){
  elmGetter.each('div.extra:has(section.logo)', document, (logo) => {
    logo.style.display = 'none';
  });
}

function Work() {
  configIdList.forEach(v=>{
    if(t.get(v) == true){
      var func = eval(v);
      func();
    }
  });
}

function pmsWholeFontPerf(){
  GM_addStyle(`
	 /* 优化接口说明样式 */
	 .w-e-text-container [data-slate-editor] {
		padding: 0px 10px 20px 10px !important;
	}

	/* 菜单按钮字体 */
	 .x-btn-text, .x-menu-item-text, .x-combo-list-item, .x-form-field, .x-window-tl .x-window-header ,a.btn, .user-menu-ml, #user .user-link ,#user .user-name , #notificationMore a
	 , div[id*="ID_apiDesign_"] > table td, .logtime{
		 font-family: Verdana, Arial, Helvetica, AppleGothic, sans-serif !important;
	 }
	 .logtime::marker {
		font-size: 14px;
	}
	.log{
		font-size: 14px;
	}
			`);
}

(function () {
  "use strict";
  Work();
})();
