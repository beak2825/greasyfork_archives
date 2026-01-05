// ==UserScript==
// @name        bdwmTextBox
// @namespace   bdwmTextBox
// @description A new Text Box for PKU BBS
// @include     *bdwm.net/bbs/bbspst.php*
// @include     *bdwm.net/bbs/bbspsm.php*
// @version     0.1beta
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4603/bdwmTextBox.user.js
// @updateURL https://update.greasyfork.org/scripts/4603/bdwmTextBox.meta.js
// ==/UserScript==

/**
 * cursorPosition Object
 *
 * Created by Blank Zheng on 2010/11/12.
 * Copyright (c) 2010 PlanABC.net. All rights reserved.
 * 
 * The copyrights embodied in the content of this file are licensed under the BSD (revised) open source license.
 */
 
var cursorPosition = {
	get: function (textarea) {
		var rangeData = {text: "", start: 0, end: 0 };
	
		if (textarea.setSelectionRange) { // W3C	
			textarea.focus();
			rangeData.start= textarea.selectionStart;
			rangeData.end = textarea.selectionEnd;
			rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end): "";
		}
		
		return rangeData;
	},
	
	set: function (textarea, rangeData) {
		if(!rangeData) {
			alert("You must get cursor position first.")
		}
		textarea.focus();
		if (textarea.setSelectionRange) { // W3C
			textarea.setSelectionRange(rangeData.start, rangeData.end);
		} 
	},

	add: function (textarea, rangeData, text) {
		var oValue, nValue, nStart, nEnd, st;
		this.set(textarea, rangeData);
		
		if (textarea.setSelectionRange) { // W3C
			oValue = textarea.value;
			nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
			nStart = nEnd = rangeData.start + text.length;
			st = textarea.scrollTop;
			textarea.value = nValue;
			// Fixbug:
			// After textarea.values = nValue, scrollTop value to 0
			if(textarea.scrollTop != st) {
				textarea.scrollTop = st;
			}
			textarea.setSelectionRange(nStart, nEnd);
		} 
	}
}

function setTextAttr(textarea, attr) {
  range = cursorPosition.get(textarea);
  nText = '[' + attr + 'm' + range.text + '[m';
  cursorPosition.add(textarea, range, nText);
}

// 添加颜色下拉条
function addSelect(parent, id, num, name) {
  var colors = [
    '黑色',
    '红色',
    '绿色',
    '黄色',
    '蓝色',
    '品红',
    '蓝绿',
    '白色'
  ];
  
  // 添加标题
  var title = document.createElement('span');
  title.innerHTML = name;
  parent.appendChild(title);
  
  // 生成下拉条
  var mySelect = document.createElement('select');
  mySelect.id = id;
  for (var i = 0; i < colors.length; i++) {
    var opt = document.createElement('option');
    opt.value = num + i;
    opt.innerHTML = colors[i];
    mySelect.appendChild(opt);
  }
  
  // 默认项: 未选择颜色
  var opt = document.createElement('option');
  opt.value = - 1;
  opt.innerHTML = '不设置';
  opt.selected = 'selected';
  // 设为默认选择
  mySelect.appendChild(opt);
  
  // 加入父节点
  parent.appendChild(mySelect);
  return mySelect;
}

// 添加复选框
function addCheck(parent, val, name) {
  // 标题
  var title = document.createElement('span');
  title.innerHTML = name;
  parent.appendChild(title);
  // 选框
  var box = document.createElement('input');
  box.type = 'checkbox';
  box.value = val;
  
  // 加入父节点
  parent.appendChild(box);
  return box;
}
// 建立表格

function createForm(textarea) {
  var myform = document.createElement('form');
  //选择颜色
  var pColor = document.createElement('p');
  var sfg = addSelect(pColor, 'fgcolor', 30, '前景色');
  var sbg = addSelect(pColor, 'bgcolor', 40, '背景色');
  myform.appendChild(pColor);
  // 复选框
  var pBoxes = document.createElement('p');
  var boxes = [
    addCheck(pBoxes, 1, '高亮'),
    addCheck(pBoxes, 5, '闪烁'),
    addCheck(pBoxes, 4, '下划线')
  ];
  myform.appendChild(pBoxes);
  // 确定按钮
  var btn = document.createElement('input');
  btn.type = 'button';
  btn.value = '确定';
  btn.onclick = function () {
    var attr = '';
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) {
        attr += ';' + boxes[i].value;
      }
    }
    if (sbg.value != '-1') {
      attr += ';' + sbg.value;
    }
    if (sfg.value != '-1') {
      attr += ';' + sfg.value;
    }
    setTextAttr(textarea, attr.substring(1));
  };
  myform.appendChild(btn);
  // 关闭按钮
  var closeBtn = document.createElement('input');
  closeBtn.type = 'button';
  closeBtn.value = '关闭';
  closeBtn.onclick = function () {
    this.parentNode.parentNode.style.display = 'none';
  };
  myform.appendChild(closeBtn);
  return myform;
}

console.log('script begins');
/** 寻找目标表单
var frmpost;
if ((frmpost = document.getElementById('postfrm')) != null) {
	console.log('Post form \'postfrm\' found');
} else if ((frmpost = document.getElementById('frmpost')) != null) {
	console.log('Post form \'frmpost\' found');
} else {
	console.log('Post form not found!!!');
}
*/

// 获取文字窗口
console.log('Getting textarea');
var textBoxes = document.getElementsByName('text');
if (textBoxes.length == 0) {
  alert('No such text box!');
}
var textArea = textBoxes[0];
// 设置文本框为10行...
textArea.rows = '10';
console.log('textarea set to 10 lines');

// 建立浮动窗体
console.log('building the textAttr dialog');
var mydiv = document.createElement('div');
mydiv.style.position = 'fixed';
mydiv.style.left = '30%';
mydiv.style.top = '40%';
mydiv.style.backgroundColor = '#89e842';
mydiv.style.display = 'none';
mydiv.appendChild(createForm(textArea));
document.body.appendChild(mydiv);

// 添加按钮
console.log('adding button');
var Buttons = document.getElementsByTagName('input');
var postButton;
for (var i = 0; i < Buttons.length; i++) {
  //alert(Buttons[i].value);
  if (Buttons[i].value == '发表' || Buttons[i].value == '发送') {
    postButton = Buttons[i];
    break;
  }
}
var attrBtn = document.createElement('input')
attrBtn.type = 'button';
attrBtn.onclick = function () {
  console.log('Button clicked');
  mydiv.style.display = 'block';
};
attrBtn.value = '设置文字属性';
postButton.parentNode.insertBefore(attrBtn, postButton.nextSibling);
console.log('script ends');
