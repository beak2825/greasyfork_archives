	// ==UserScript==
	// @name         农业银行抢纪念币2020
	// @namespace    http://tampermonkey.net/
	// @version      1.0
	// @description  抢农行纪念币，自动输入基础信息!
	// @author       gwl
	// @match        https://*.abchina.com/*
	// @match        http://*.abchina.com/*
	// @grant        none
	// @require https://greasyfork.org/scripts/391004-%E8%84%9A%E6%9C%AC%E5%B8%B8%E7%94%A8%E6%96%B9%E6%B3%95%E5%BA%93/code/%E8%84%9A%E6%9C%AC%E5%B8%B8%E7%94%A8%E6%96%B9%E6%B3%95%E5%BA%93.js?version=878964
// @downloadURL https://update.greasyfork.org/scripts/418338/%E5%86%9C%E4%B8%9A%E9%93%B6%E8%A1%8C%E6%8A%A2%E7%BA%AA%E5%BF%B5%E5%B8%812020.user.js
// @updateURL https://update.greasyfork.org/scripts/418338/%E5%86%9C%E4%B8%9A%E9%93%B6%E8%A1%8C%E6%8A%A2%E7%BA%AA%E5%BF%B5%E5%B8%812020.meta.js
	// ==/UserScript==
	
	(function() {
	    'use strict';
	
	  const wg = {
			currentAction: 2, // 当前显示选项卡
			currentIdcard: '', // 当前输入身份证
			wgWrapEl: null,// 整个外加元素
			userInfoEl: null,// 数据输入框元素
			listEl: null, // 列表元素
			list: [],
			map: {} // 数据key身份证
		};
		wg.initHtml = function() {
			if(!document.body) {
				setTimeout(wg.initHtml, 500)
				return;
			}
			window.gUtils.addHtmlToBoty(
				`<div class="l-wg-wrap l-action-2"><div class="l-title">抢币助手2020</div><div class="l-tab"><div class="l-onclick l-item l-item1"data-func="switchShow"data-arg="1">数据</div><div class="l-onclick l-item l-item2"data-func="switchShow"data-arg="2">列表</div></div><div class="l-tab-data l-content l-hide"><textarea class="l-userInfo"placeholder="名字 身份证 手机号 状态"></textarea><div class="l-btns"><button class="l-onclick"data-func="readCache">读缓存</button><button class="l-onclick"data-func="updateDataList">保存</button></div></div><div class="l-tab-table l-content l-hide"><div class="l-row"><div class="l-col l-col-1">姓名</div><div class="l-col l-col-2">身份证</div><div class="l-col l-col-3">手机号</div><div class="l-col l-col-4">状态</div></div><div class="l-list"><!--<div class="l-row l-currentRow"><div class="l-col l-col-1"></div><div class="l-col l-col-2"></div><div class="l-col l-col-3"></div><div class="l-col l-col-4"></div></div>--></div><div class="l-btns"><button class="l-onclick"data-func="queryInputData">查询输入</button><button class="l-onclick"data-func="success">完成</button><button class="l-onclick"data-func="skip">跳过</button><button class="l-onclick"data-func="inputData">预约输入</button></div><div class="l-btns"><button class="l-onclick"data-func="openPage"data-arg="1">预约页面1</button><button class="l-onclick"data-func="openPage"data-arg="2">预约页面2</button></div></div></div>`
			);
			window.gUtils.addCss(
				`.l-wg-wrap{top:35px;left:20px;position:fixed;text-align:center;width:360px;background:#f5f5f5;z-index:999}.l-wg-wrap .l-tab{display:flex;background:#55b6ad;cursor:pointer}.l-wg-wrap .l-item{padding:5px 10px;font-size:16px;font-weight:bold;color:#fff;flex:1;cursor:pointer}.l-wg-wrap .l-content{padding:12px}.l-wg-wrap.l-action-1 .l-item.l-item1,.l-wg-wrap.l-action-2 .l-item.l-item2{background:#208786}.l-wg-wrap .l-hide{display:none}.l-wg-wrap.l-action-1 .l-tab-data,.l-wg-wrap.l-action-2 .l-tab-table{display:block}.l-wg-wrap .l-tab-data .l-userInfo{width:100%;height:300px}.l-wg-wrap .l-btns{margin-top:10px}.l-wg-wrap .l-btns button{padding:5px 10px;cursor:pointer;margin:3px 5px}.l-wg-wrap .l-list{height:300px;overflow:auto;background:#fff}.l-wg-wrap .l-row{display:flex}.l-wg-wrap .l-row.l-currentRow{color:#2da09b;font-weight:bold}.l-wg-wrap .l-row .l-col{overflow:hidden;padding:3px 6px}.l-wg-wrap .l-row .l-col-1{width:50px}.l-wg-wrap .l-row .l-col-2{width:125px}.l-wg-wrap .l-row .l-col-3{width:75px}.l-wg-wrap .l-row .l-col-4{flex:1}.l-wg-wrap .l-title{cursor:all-scroll;font-weight:bold;font-size:18px;color:#208786;margin:10px 0}`
			);
		};
		wg.lInit = function() {
			wg.wgWrapEl = document.getElementsByClassName('l-wg-wrap')[0];
			if (!wg.wgWrapEl) {
				setTimeout(wg.lInit, 300);
				return;
			}
			wg.userInfoEl = document.getElementsByClassName('l-userInfo')[0];
			wg.listEl = wg.wgWrapEl.getElementsByClassName('l-list')[0];
			wg.wgWrapEl.onclick = wg.wgWrapElClick;
			wg.readCache();
	
			wg.titleEl = document.getElementsByClassName('l-title')[0];
			wg.titleEl.addEventListener('mousedown', wg.addTitleMousemove); //当元素上按下鼠标按钮时触发。
			wg.titleEl.addEventListener('mouseup', wg.removeTitleMousemove); //当在元素上释放鼠标按钮时触发。
			setTimeout(wg.checkElExist, 500);
		};
		wg.checkElExist = function() {
			let wgWrapEl = document.getElementsByClassName('l-wg-wrap')[0];
			if (wgWrapEl) {
				setTimeout(wg.checkElExist, 500);
				return;
			}
			wg.initHtml();
			wg.lInit();
		};
		wg.wgWrapElClick = function(ev) {
			ev = ev || window.event;
			let target = ev.target || ev.srcElement; //获取触发事件的元素
			if (!target.classList.contains('l-onclick')) {
				target = target.parentElement
			}
			if (!target.classList.contains('l-onclick')) return;
			if (!target.dataset.func) {
				console.log(target);
				return;
			}
			wg[target.dataset.func](target.dataset.arg);
		};
	
		// 切换选项卡
		wg.switchShow = function(index) {
			wg.currentAction = index;
			wg.wgWrapEl.classList.remove('l-action-1');
			wg.wgWrapEl.classList.remove('l-action-2');
			if (index == '1') {
				wg.wgWrapEl.classList.add('l-action-1');
			} else {
				wg.wgWrapEl.classList.add('l-action-2');
			}
		};
	
		// 更新数据，字符串转列表
		wg.updateDataList = function() {
			let dataStr = wg.userInfoEl.value || '';
			if (!dataStr || !dataStr.trim()) {
				if (!confirm('确认清空数据吗？')) {
					return;
				}
			}
			let list = [],
				map = {};
			let rows = dataStr.split('\n');
			let lastItem;
			rows.forEach(function(item) {
				if (!item || !item.trim()) return;
				let cols = item.split(/\s+/);
				if (cols.length < 3 || !cols[0] || !cols[1] || !cols[2]) return;
				let col = {
					name: cols[0].trim(),
					idcard: cols[1].trim(),
					phone: cols[2].trim(),
					status: cols[3] || 0
				};
				if (map[col.idcard]) return;
				if (lastItem) lastItem.nextIdcard = col.idcard;
				lastItem = col;
				list.push(col);
				map[col.idcard] = col;
			});
			if (wg.currentIdcard && map[wg.currentIdcard] && map[wg.currentIdcard] == '1') {
				wg.currentIdcard = '';
			}
			if (!wg.currentIdcard) {
				list.some(function(item) {
					if (item.status != '1') {
						wg.currentIdcard = item.idcard;
						return true;
					}
				});
			}
			wg.list = list;
			wg.map = map;
			wg.updateView();
			wg.updateData();
		};
		// 更新显示
		wg.updateView = function() {
			let html = '';
			wg.list.forEach(function(item) {
				html += `
					<div id="i${item.idcard}" data-func="selectRow" data-arg="${item.idcard}"
					 class="l-row ${wg.currentIdcard == item.idcard ? 'l-currentRow' : ''} l-onclick">
						<div class="l-col l-col-1">${item.name}</div>
						<div class="l-col l-col-2">${item.idcard}</div>
						<div class="l-col l-col-3">${item.phone}</div>
						<div class="l-col l-col-4">${item.status == '1' ? '成功' : ''}</div>
					</div>
					`;
			});
			wg.listEl.innerHTML = html;
			localStorage.setItem('l-qiangBi-currentIdcard', wg.currentIdcard);
		};
	
		// 更新数据，列表转字符串
		wg.updateData = function() {
			let dataStr = '';
			wg.list.forEach(function(item) {
				dataStr += item.name + '  ' + item.idcard + '  ' + item.phone + '  ' + item.status + '\n';
			});
			wg.userInfoEl.value = dataStr;
			localStorage.setItem('l-qiangBi', dataStr);
		};
	
		// 当前账号预约成功
		wg.success = function() {
			if (!wg.currentIdcard || !wg.map[wg.currentIdcard]) return;
			let data = wg.map[wg.currentIdcard];
			data.status = 1;
			let el = document.getElementById('i' + data.idcard);
			el.getElementsByClassName('l-col-4')[0].innerHTML = '成功';
			wg.updateData();
			wg.skip();
		};
		// 跳过当前账号
		wg.skip = function() {
			if (!wg.list || wg.list.length == 0) {
				wg.updateCurrnetIdcard('');
				alert('没有可用账号(err-1)');
				return;
			}
			if (!wg.currentIdcard) {
				wg.currentIdcard = wg.list[0].idcard;
			}
			let data = wg.map[wg.currentIdcard];
			if (!data.nextIdcard) {
				data = wg.list[0];
			} else {
				data = wg.map[data.nextIdcard];
			}
			while (data && data.nextIdcard && data.status == '1') {
				data = wg.map[data.nextIdcard];
			}
			if (!data || data.status == '1') {
				wg.updateCurrnetIdcard('');
				alert('没有可用账号(err-2)');
				return;
			}
			let currentRow = wg.listEl.getElementsByClassName('l-currentRow');
			if (currentRow && currentRow.length > 0) {
				currentRow[0].classList.remove('l-currentRow');
			}
			currentRow = document.getElementById('i' + data.idcard);
			if (currentRow) {
				currentRow.classList.add('l-currentRow');
			}
			wg.currentIdcard = data.idcard;
			localStorage.setItem('l-qiangBi-currentIdcard', wg.currentIdcard);
		};
		// 行点击
		wg.selectRow = function(idcard){
			if(!idcard) return;
			wg.updateCurrnetIdcard(idcard);
		}
		// 更新当前行
		wg.updateCurrnetIdcard = function(idcard) {
			if (!idcard) {
				wg.list.some(function(item) {
					if (item.status == '1') return;
					idcard = item.idcard;
					return true;
				});
			}
			wg.remoeCurrnetRowClass(wg.currentIdcard);
			if (!wg.map[idcard] || !idcard) {
				wg.remoeCurrnetRowClass(idcard);
				wg.currentIdcard = '';
				localStorage.setItem('l-qiangBi-currentIdcard', wg.currentIdcard);
				return;
			}
			wg.addCurrnetRowClass(idcard);
			wg.currentIdcard = idcard;
			localStorage.setItem('l-qiangBi-currentIdcard', wg.currentIdcard);
		};
		wg.remoeCurrnetRowClass = function(idcard) {
			if (!idcard) return;
			let el = document.getElementById('i' + idcard);
			if (!el) return;
			el.classList.remove('l-currentRow');
		};
		wg.addCurrnetRowClass = function(idcard) {
			if (!idcard) return;
			let el = document.getElementById('i' + idcard);
			if (!el) return;
			el.classList.add('l-currentRow');
		};
		wg.readCache = function() {
			let dataStr = localStorage.getItem('l-qiangBi');
			if (dataStr) {
				wg.userInfoEl.value = dataStr;
				wg.currentIdcard = localStorage.getItem('l-qiangBi-currentIdcard');
				wg.updateDataList();
			}
		};
	
		// 标题鼠标移动
		wg.titleMousemoveEv = function(ev) {
			wg.wgWrapEl.style.top = ev.clientY - 20 + 'px';
			wg.wgWrapEl.style.left = ev.clientX - 150 + 'px';
		};
		// 标题鼠标移动
		wg.addTitleMousemove = function(ev) {
			wg.wgWrapEl.addEventListener('mousemove', wg.titleMousemoveEv);
		};
		// 标题鼠标移动
		wg.removeTitleMousemove = function(ev) {
			wg.wgWrapEl.removeEventListener('mousemove', wg.titleMousemoveEv);
		};
		
		wg.openPage = function(type){
			VerificationWithBatch('I073', type) 
			// VerificationWithBatch('I073','1') 
			// VerificationWithBatch('I073','2')
		}
		wg.setValueByClass = function(clas, val) {
			let el = document.getElementsByClassName(clas);
			if (el && el.length > 0) {
				el[0].value = val;
			}
		};
		wg.setValueById = function(id, val) {
			let el = document.getElementById(id);
			if (el) {
				el.value = val;
			}
		};
		// 输入账号
		wg.inputData = function() {
			if (!wg.currentIdcard || !wg.map[wg.currentIdcard]) return;
			let data = wg.map[wg.currentIdcard];
			console.log(wg.map[wg.currentIdcard]);
	
			wg.setValueById('name', data.name.trim());
			wg.setValueById('identNo', data.idcard.trim().toLocaleUpperCase());
			wg.setValueById('mobile', data.phone.trim());
			wg.setValueById('cardvalue0', 20);
			wg.setValueById('coindate', '2020-12-22');
			
			wg.setValueById('orglevel1', 139999);
			setTimeout(function(){
				wg.setValueById('orglevel2', 131000);
			}, 100);
		};
		// 查询输入账号
		wg.queryInputData = function() {
			if (!wg.currentIdcard || !wg.map[wg.currentIdcard]) return;
			let data = wg.map[wg.currentIdcard];
			console.log(wg.map[wg.currentIdcard]);
			
			refreshCaptcha();
			wg.setValueById('certNo', data.idcard.trim().toLocaleUpperCase());
			wg.setValueById('phoneNo', data.phone.trim());
			wg.setValueById('txtCaptchaCode', '');
		};
	
		wg.initHtml();
		wg.lInit();
	
	    // Your code here...
	})();