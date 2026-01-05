// ==UserScript==
// @name        百度网盘批量重命名
// @author      Jason Shaw
// @description 批量重命名百度网盘中的文件，支持正则和选中重命名
// @namespace   yunbatch@jasonshaw
// @license     GPL version 3
// @encoding    utf-8
// @date        20/07/2014
// @modified    24/07/2014
// @include     http://pan.baidu.com/*
// @run-at      document-end
// @version     1.0.0
// @downloadURL https://update.greasyfork.org/scripts/26750/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/26750/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E9%87%8D%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==

function show_add_div()
{
	var aList = document.querySelector('div.list-view-container');
	if(aList.style.display=="none") {alert("\u8bf7\u5148\u5207\u6362\u5230\u5217\u8868\u6a21\u5f0f\u518d\u8bd5\uff01");return;}
	if(list.querySelectorAll('dd.g-clearfix.list-view-item.item-active').length == 0) {alert("\u8bf7\u5148\u52fe\u9009\u8981\u6279\u91cf\u6539\u540d\u7684\u6761\u76ee");return;}
	var div = document.createElement('div');
	div.id = 'Main_frame';
	div.innerHTML = '<div id="Main_float">'		
		+'<div id="Setting">'
		+'<div class="br_group"><p><input name="radiobox" type="radio" value="_ptth"  checked></input>\u666E\u901A\u66FF\u6362</p><p>\u6b63\u5219\uff1a<input id="tihuanA" type="text" ></input> \u66ff\u6362\u4e3a\uff1a<input id="tihuanB" type="text"></input></p>(\u524d\u7f00\u540e\u7f00\uff1a<input type="checkbox" id="houxu" value="g"></input>)<p>\u524d\u7f00\uff1a<input id="tihuanC" type="text" ></input>\u540e\u7f00\uff1a<input type="text" id="tihuanD" value=".删除这里"></input></p></div>'
		+'<div class="br_group"><p><input name="radiobox" type="radio" value="_plus"></input> \u524d\u7f00\u540e\u7f00\uff1a</p><p>\u524d\u7f00\uff1a<input id="insertBefore" type="text" ></input> \u540e\u7f00\uff1a<input id="insertAfter" type="text"></input></p></div>'
		+'<div class="br_group"><p><input name="radiobox" type="radio" value="_repl"></input> \u6b63\u5219\u66ff\u6362\uff1a(\u591a\u6b21\u5339\u914d <input type="checkbox" id="_mult" value="g"></input>)</p><p>\u6b63\u5219\uff1a<input id="replaceReg" type="text"></input> \u66ff\u6362\u4e3a\uff1a<input id="replacement" type="text"></input></p></div>'
		+'<div class="br_group"><p><input name="radiobox" type="radio" value="_seri"></input> \u5e8f\u5217\u5316\uff1a</p><p>\u4f4d\u7f6e\uff1a<input id="_position" type="text" value="start"></input> \u8d77\u59cb\u503c\uff1a<input id="startFrom" type="text" value="1"></input></p><p>\u5bbd\u5ea6\uff1a<input id="_width" type="text" value="auto"></input> (\u4ee5\u96f6\u8865\u4f4d)</p></div>'
		+'</div><div id="Button">\u542b\u6269\u5c55\u540d <input type="checkbox" id="withExt"></input> <span id="YesBtn" class="fff">\u5F00\u59CB</span><span id="NoBtn" class="fff">\u53D6\u6D88</span></div></div>';
	document.querySelector('body').appendChild(div);
	var div_css = '\
	#Main_frame\
	{\
		font-size:12px;\
  		position: fixed;\
  		top: 25%;\
  		left: 35%;\
  		width: 400px;\
  		height: 380px;\
  		z-index: 10086;\
  		background: #F0F0F0 !important;\
  		border:solid #D2D2D2 2px;\
  		opacity:.9;\
 	}\
 	#Main_float\
	{\
		margin:auto;\
		width:100%;\
		height:100%;\
		background:#F0F0F0\
	}\
	#Setting\
	{\
		margin:auto;\
		height:155px;\
		display:block;\
	}\
	#Setting div.br_group\
	{\
		padding:3px;\
		border-bottom:dashed #D2D2D2 1px;\
	}\
	#Setting p\
	{\
		position:relative;\
		top:5px;\
		left:5px;\
		width:392px;\
		height:30px;\
	}\
	#Setting input\
	{\
		color:green;\
	}\
	input[type="radio"],input[type="checkbox"]\
	{\
		vertical-align:middle\
	}\
	#Button\
	{\
		margin:auto;\
		text-align:center;\
		height:25px;\
		display:block;\
		position:relative;\
		top:200px;\
		left:0px;\
	}\
	#Button span\
	{\
		cursor:pointer;\
		margin-top:5px;\
		margin-right:10px;\
		border:1px solid grey;\
		width:100%;\
		height:25px;\
	}\
	#Button span#YesBtn\
	{\
		margin-left:20px;\
	}';
	GM_addStyle(div_css);
	document.querySelector('span#NoBtn.fff').onmousedown = function () {document.body.removeChild(document.querySelector('div#Main_frame'));};
	document.querySelector('span#YesBtn.fff').onmousedown = function () {main();};
}
function eraser(){
	document.body.removeChild(document.querySelector('div#Main_frame'));
}
function main(){
	//document.querySelector('div[node-type="module-list-view"]').style.height='2000px';
    //document.querySelector('div[node-type="module-list"]').style.height='2100px';
	//list= document.querySelector("div.list-view")
	//document.querySelector('div[class="scrollbar-tracker"]').style.height='1800px';
	var radios=document.getElementsByName('radiobox'),radioChecked = null,i;
	//var radios = document.querySelectorAll('radiobox'),radioChecked = null,i;
    //alert(aa.length);
	for(i = 0;i < radios.length;i++) { if(radios[i].checked) { radioChecked = radios[i].value;break;}}
	if(radioChecked == null) {eraser();alert("\u8bf7\u5148\u9009\u4e2d\u8981\u6279\u91cf\u6539\u540d\u7684\u65b9\u5f0f\uff01");return;}
	//chks = list.querySelectorAll('dd[class="g-clearfix list-view-item item-active"]'),chkNum = chks.length;
	chks = list.querySelectorAll('dd > span[node-type="checkbox"]'),chkNum = chks.length;
	//alert(chkNum);
	//'span[class="chk chked"]'
	for(var i=0;i<chkNum;i++) queueIds[i]=i;
	document.getElementById("Main_frame").style.display = "none";
	renameChain();
}

function renameChain(){
	if(queueIds.length==0) {eraser();alert("\u641e\u5b9a\uff01\u6279\u91cf\u6539\u540d\uff0c\u5c0f\u83dc\u4e00\u789f\uff01");return;}
	
	var rnid = queueIds.shift(),thisObj = chks[rnid];
	var col1 = thisObj.parentNode;
	//var cate = col1.parentNode.getAttribute("new-dir-box");
	//alert(col1.querySelector('div.checkbox'));
	var cate = col1.querySelector('div.text > a').getAttribute("title");//获取原名称
	var rnBtn = col1.querySelector('a[data-button-id="b29"]');//获取按钮
	rnBtn.click();
	var input = document.querySelector('div.new-dir-item > input.box')
	var fname=cate;
	var insertBefore = document.getElementById("insertBefore").value;
	var insertAfter = document.getElementById("insertAfter").value;
	//根据修改方式自动识别具体的改名过程
	var radios = document.getElementsByName("radiobox"),radioChecked = null,i;
	for(i = 0;i < radios.length;i++) { if(radios[i].checked) { radioChecked = radios[i].value;break;}}
	var withExt = document.getElementById("withExt").checked == true? true : false;
	
	
	var hasExt = !(cate == "dir" || (cate != "dir" && !(/\.\w{3,4}$/.test(fname))));

	if(hasExt){//false就不执行
		var fn=fname.split(/[.][^.]*$/)[0];
		var ext=/\.[^\.]+/.exec(fname);
	}
	if(col1.querySelector('div.dir-small')==null){
	switch(radioChecked){
		case "_plus":
			if(withExt || !hasExt) input.value = insertBefore + fname + insertAfter;
			else input.value = insertBefore + fn + ext + insertAfter;
			break;
		case "_repl":
			var arg2 = (document.getElementById("_mult").checked ? document.getElementById("_mult").value : "") +"i";
			var re = new RegExp(document.getElementById("replaceReg").value,arg2);
			if(withExt || !hasExt) input.value = fname.replace(re,document.getElementById("replacement").value);
			else input.value = fn.replace(re,document.getElementById("replacement").value) + ext;
			break;
		case "_ptth":
			var a=document.getElementById("tihuanA").value;
			var b=document.getElementById("tihuanB").value;
			var c=document.getElementById("tihuanC").value;
			var d=document.getElementById("tihuanD").value;
			var oo
			var hx = document.getElementById("houxu").checked == true? true : false;
			if(hx==false){input.value = fname.replace(a,b);}
			else{if(withExt || !hasExt){input.value = c + fname.replace(a,b) + d;}else{input.value = c + fn.replace(a,b) + ext + d;}}
			break;
		case "_seri":
			var pos = (document.getElementById("_mult").checked ? document.getElementById("_mult").value : "") +"i";
			var beginN = document.getElementById("startFrom").value;
			var sn = rnid + (parseInt(beginN) == beginN ? parseInt(beginN) : 1);
			var bwidth = document.getElementById("_width").value;
			bwidth = parseInt(bwidth) == bwidth ? parseInt(bwidth) : 0;
			var add = (bwidth <= sn.toString().length? "" : addZeros(bwidth - sn.toString().length));
			if(document.getElementById("_position").value == "start") input.value = add + sn.toString() + fname;
			else if(!withExt && hasExt) input.value = fn + add + sn + ext;
			else input.value = fname + add + sn;
			break;
	}
	}
	var sure = document.querySelector('div.new-dir-item > span.sure');
	sure.click();
	//var sure1 = document.querySelector('div#scrollbarArrowDown');
	//sure1.click();
	
	checkFinished();
	
}

function checkFinished(){
	var toast = document.querySelector('div.tip-inner > span.tip-msg');
	if(toast.innerHTML.indexOf("重命名成功") < 0 ) setTimeout(checkFinished, 400);
	else renameChain();
}
function addZeros(n) { var r = ""; for(var i=0;i<n;i++) r+="0";return r;}
function prevSibling(node) {
    var tempFirst = node.parentNode.firstChild;
    if (node == tempFirst) return null;
    var tempObj = node.previousSibling;
    while (tempObj.nodeType != 1 && tempObj.previousSibling != null) {
        tempObj = tempObj.previousSibling;
    }
    return (tempObj.nodeType==1)? tempObj:null;
}  
(function (){
	var q_sel = document.querySelectorAll('div.bar > div')[1];
	var ele_to_add = document.createElement('a');
	ele_to_add.className = "g-button";
	ele_to_add.text = "\u6279\u91cf\u91cd\u547d\u540d";
	ele_to_add.onclick = show_add_div;//main;
	//ele_to_add.setAttribute("data-button-id","b53");
	//ele_to_add.setAttribute("data-button-index","101");
	//ele_to_add.href="javascript:void(0);";
	ele_to_add.setAttribute("onmousedown","javascript:show_add_div();");
	q_sel.appendChild(ele_to_add);
})();

var list= document.querySelector("div.list-view"),queueIds=chks=[];
