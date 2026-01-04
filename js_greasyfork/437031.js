// ==UserScript==
// @name         自动评教-ZJXU
// @description  自动评教
// @namespace    https://gitee.com/lidec/auto-evaluate-zjxu/
// @version      0.2
// @author       
// @grant        none
// @include      http://jwzx.zjxu.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437031/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99-ZJXU.user.js
// @updateURL https://update.greasyfork.org/scripts/437031/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99-ZJXU.meta.js
// ==/UserScript==
(function () {
	'use strict';

	let btn = document.createElement('button')
	btn.innerText = '自动评教'
	btn.style.position = 'fixed'
	btn.style.top = 0
	btn.style.right = 0

	btn.addEventListener('click', () => {
		findUnevaluatedItemAndNextPage()
	})
	document.querySelector('body').append(btn)
	setTimeout(() => {
		let selectDom = document.querySelector('#last_pager ~ td select')
		selectDom.value = 5000
		selectDom.dispatchEvent(new Event('change'))
	}, 1500)
	console.log('自动评教按钮创建完成')

	/** 判断该页教师是否已评价
	 * @return 已评价返回true,未评返回false
	 */
	function isEvaluatedTeacher() {
		let d = document.querySelector('#pyDiv textArea')
		return d === null
	}

	/** 寻找左侧列表未评的，并且自动翻页 */
	function findUnevaluatedItemAndNextPage() {
		let list = document.getElementById('tempGrid') //找到可翻页列表
		let tdList = list.getElementsByTagName('td')
		console.log(`开始循环遍历评教Item，共${tdList.length}个`)
		setTimeout(loopClickItem(tdList, 0), 2000)
		// let next = document.getElementById('next_pager')
		// next.click()
	}

	function loopClickItem(itemList, i) {
		console.log(itemList[i].innerHTML)
		if (i >= itemList.length) return
		if (itemList[i].innerHTML == '未评' || itemList[i].innerHTML == '已评完') {
			execEvaluateTeacher()
			itemList[i].click() //进入未提交课程
			setTimeout(() => {
				loopClickItem(itemList, ++i)
			}, 1000)
		} else {
			loopClickItem(itemList, ++i)
		}
	}

	function execEvaluateTeacher() {
		//---------------------------------------核心代码----------------------------------------
		var controls = document.getElementsByTagName('input');
		if (controls) {
			for (var i = 0; i < controls.length; i++) {
				if (controls[i].type == 'number') {
					controls[i].value = 100;
				} else if (controls[i].type == 'radio') {

				}
			}
		}

		var noNeed = document.getElementsByClassName('input-xspj-2') //寻找所有不需要的父节点
		if (noNeed.length) {
			for (var j = 0; j < noNeed.length; j++) {
				var a = noNeed[j].getElementsByTagName('input')//寻找不需要的父节点下所有的input框
				a[0].checked = true
			}
			var commitBtn = document.getElementById('btn_xspj_tj')//寻找提交按钮
			commitBtn.click()
			var okBtn = document.getElementById('btn_ok')
			okBtn.click()
		}
		//---------------------------------------核心代码----------------------------------------
	}
})()
