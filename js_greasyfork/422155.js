// ==UserScript==
// @name    监听网页操作
// @namespace     
// @version      0.3
// @description    监听网页内的键盘事件和鼠标事件，抓取捕获这些鼠标、键盘消息的网页节点的源代码和坐标。ctrl+shift+F9，启动或停用脚本；ctrl+shift+F10，显示选项菜单；ctrl+shift+F11，显示抓取到的源代码；ctrl+shift+F12获取当前焦点的源代码。
// @author    流水
// @include    *
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/422155/%E7%9B%91%E5%90%AC%E7%BD%91%E9%A1%B5%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/422155/%E7%9B%91%E5%90%AC%E7%BD%91%E9%A1%B5%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==


window.setTimeout(function()
{
	 let canUseHotkey = false;
	 let needGetCode = false;
	let manyTimesHandle = false;
	let allNodeCode = false;
	let needGetHotkeyMessage = false;
	let needGetMouseMessage = false;
	let onlyOneNodeCode = false;
	let manyTimesCode = "";
	let observer1 = null;

	if (MutationObserver != null)
	{
	observer1 = new MutationObserver(function(mutationList, observer)
	{
		let str = "";
			for (let mutation of mutationList)
			{
		if (mutation.target.nodeName)
		{
			if (str == mutation.target.outerHTML)
				continue;
			else {
				str = mutation.target.outerHTML;
		GetPartSourceCode(mutation.target, "新增加或内容发生变化的元素");
			}
		}
			}
})
	}


	document.addEventListener("click", function(event)
	{
		if ((needGetMouseMessage === true) || (needGetHotkeyMessage === true))
		GetMessageType(event);
	else
		GetPartSourceCode(event.srcElement, "被点击的元素");
	})


	document.addEventListener("dblclick", function(event)
	{
		if (needGetMouseMessage === true)
		GetMessageType(event);
	})


	document.addEventListener("mousedown", function(event)
	{
		if (needGetMouseMessage === true)
		GetMessageType(event);
	})


	document.addEventListener("mouseout", function(event)
	{
		if (needGetMouseMessage === true)
		GetMessageType(event);
	})


	document.addEventListener("mouseover", function(event)
	{
		if (needGetMouseMessage === true)
		GetMessageType(event);
	})


	document.addEventListener("mouseup", function(event)
	{
		if (needGetMouseMessage === true)
		GetMessageType(event);
	})


	document.addEventListener("mousemove", function(event)
	{
		if (needGetMouseMessage === true)
		GetMessageType(event);
	})


		document.addEventListener("keydown", function(event)
		{
			if (needGetHotkeyMessage === true)
			GetMessageType(event);
			if (window.event.keyCode === 120 && !window.event.altKey && window.event.shiftKey && window.event.ctrlKey)
			{
			if (!canUseHotkey)
				{
					canUseHotkey = true;
				ChooseMode();
				}
				else {
					canUseHotkey = false;
					needGetCode = false;
					manyTimesCode = "";
					if (observer1 != null)
					observer1.disconnect();
					alert("脚本抓取源码的快捷键已禁用");
				}
			}
			if (window.event.keyCode === 121 && !window.event.altKey && window.event.shiftKey && window.event.ctrlKey && canUseHotkey)
			{
				ChooseMode();
			}
if (window.event.keyCode === 123 && !window.event.altKey && window.event.shiftKey && window.event.ctrlKey && canUseHotkey)
	{
		GetPartSourceCode(event.srcElement);
	}
	if (window.event.keyCode === 122 && !window.event.altKey && window.event.shiftKey && window.event.ctrlKey && canUseHotkey)
	{
		CreateSourceCodeTextarea();
	}
		})


		function GetMessageType(event)
		{
			if ((needGetHotkeyMessage === false) && (needGetMouseMessage === false))
				return false;
			let node = event.srcElement;
			let str = "鼠标、键盘消息为：";
			str += event.type;
			str += ("\r\n" + GetPosition(event));
			if (needGetHotkeyMessage)
				str += GetKeyCode(event);
			str += "\r\n";
			manyTimesCode += str;
			GetPartSourceCode(node);
		}


		function GetPosition(event)
		{
			let str = "";
			if (event.screenX && event.screenY)
			str += ("屏幕坐标为:" + "x:" + event.screenX + "," + "y:" + event.screenY + "\r\n");
			if (event.clientX && event.clientY)
			str += ("客户区坐标位置为:" + "x:" + event.clientX + "," + "y:" + event.clientY + "\r\n");
			if (event.pageX && event.pageY)
			str += ("页面坐标位置为:" + "x:" + event.pageX + "," + "y:" + event.pageY + "\r\n");
			return str;
		}


		function GetKeyCode(event)
		{
			let str = "";
			if (!needGetHotkeyMessage || !window.event.keyCode)
				return str;
			str += "快捷键为:";
			if (window.event.altKey)
			str += "alt+";
		if (window.event.shiftKey)
			str += "shift+";
		if (window.event.ctrlKey)
			str += "ctrl+";
		str += (window.event.keyCode + "\r\n");
			return str;
		}


		function GetPartSourceCode(node, headStr = "")
		{
			if (needGetCode === false)
			return;
			if (!node)
			return;
		let str = "";
		let index = 0;
		while ((node.nodeName != null) && (node.nodeName != "HTML"))
		{
			if (index === 0)
				if (headStr === "")
		str += ("被操作的元素node" + index + "的名称为" + node.nodeName + "\r\n");
	else
		str += (headStr + "node" + index + "的名称为" + node.nodeName + "\r\n");
		else
		str += ("node" + (index - 1) + "的父元素node" + index + "的名称为" + node.nodeName + "\r\n");
		let attributes = node.attributes;
		if (attributes != null)
		{
			if (index === 0)
		str += "node" + index + "的属性为：\r\n";
		else
		str += "node" + index + "的属性为：\r\n";
		for(let element of attributes)
		{
		if (element != null)
			str += (element.name + " = " + element.value + "\r\n");
		}
	}
	else {
		if (index === 0)
		str += "node" + index + "的属性为空\r\n";
		else
		str += "node" + index + "的属性为空\r\n";
	}
	if (node.innerHTML != "")
	{
		if (index === 0)
		str += ("node" + index + "的内容为" + node.innerHTML + "\r\n\r\n");
		if ((index === 1) || (allNodeCode === true && index > 1))
		str += ("node" + index + "的内容为" + node.innerHTML + "\r\n\r\n");
	}
		else {
			if (index === 0)
		str += ("node" + index + "的内容为空" + "\r\n\r\n");
		else
		str += ("node" + index + "的内容为空" + "\r\n\r\n");
		}
	str += "\r\n";
	if (onlyOneNodeCode === true)
		break;
	++index;
	node = node.parentNode;
}
manyTimesCode += str;
if (!manyTimesHandle)
needGetCode = false;
PrintCode();
		}


		function CreateSourceCodeTextarea()
		{
			needGetCode = false;
			needGetHotkeyMessage = false;
			needGetMouseMessage = false;
			if (observer1 != null)
			observer1.disconnect();
			let sourceCodeTextarea = document.getElementById("sourceCodeTextarea");
			if (!sourceCodeTextarea)
			{
				sourceCodeTextarea = document.createElement('textarea');
			sourceCodeTextarea.setAttribute("id", "sourceCodeTextarea");
			sourceCodeTextarea.setAttribute("title", "网页源代码");
			sourceCodeTextarea.setAttribute("readonly", "readonly");
			document.getElementsByTagName('body')[0].appendChild(sourceCodeTextarea);
		sourceCodeTextarea.onblur = function()
			{
				document.getElementsByTagName('body')[0].removeChild(this);
			}
			}
			sourceCodeTextarea.innerHTML = manyTimesCode;
		sourceCodeTextarea.focus();
		}


		function ChooseMode()
		{
			manyTimesCode = "";
			if (observer1 != null)
			observer1.disconnect();
		let selectNode = document.getElementsByName("selectForCHooseMode");
			if (!selectNode[0])
			{
				selectNode = document.createElement("select");
			selectNode.setAttribute("name", "selectForCHooseMode");
			selectNode.innerHTML = ("<option value=\"-1\">请选择</option>"
			+ "<option value=\"0\">获取一次被点击元素的源码(只获取前两层元素的完整源代码)</option>"
			+ "<option value=\"1\">连续获取被点击元素的源码(只获取前两层元素的完整源代码)</option>"
			+ "<option value=\"2\">获取一次被点击元素的源码(获取直到根节点的完整源代码)</option>"
			+ "<option value=\"3\">连续获取被点击元素的源码(获取直到根节点的完整源代码)</option>"
			+ "<option value=\"4\">获取完整网页源代码</option>"
			+ "<option value=\"5\">侦听鼠标、键盘消息</option>"
			+ "<option value=\"6\">只侦听鼠标消息</option>"
			+ "<option value=\"7\">只侦听键盘消息</option>"
			+ "<option value=\"8\">只侦听鼠标消息并只获取第一层节点的内容</option>"
			+ "<option value=\"9\">只侦听键盘消息并只获取第一层节点的内容</option>"
			+ "<option value=\"10\">侦听鼠标、键盘消息并只获取第一层节点的内容</option>"
			+ "<option value=\"11\">获取新增节点内容</option>"
			+ "<option value=\"12\">获取新增节点内容，并只获取第一层节点</option>"
			+ "<option value=\"13\">获取新增节点及被改变文本的内容</option>"
			+ "<option value=\"14\">获取新增节点及被改变文本的内容，并只获取第一层节点</option>");
			document.getElementsByTagName('body')[0].appendChild(selectNode);
			selectNode.focus();
			selectNode.onblur = function()
			{
									manyTimesCode = "";
									needGetCode = true;
									needGetHotkeyMessage = false;
									needGetMouseMessage = false;
									onlyOneNodeCode = false;
				let value = this.value;
				document.getElementsByTagName('body')[0].removeChild(this);
				if (value == 0)
				{
					manyTimesHandle = false;
					allNodeCode = false;
				}
				if (value == 1)
				{
					manyTimesHandle = true;
					allNodeCode = false;
				}
				if (value == 2)
				{
					manyTimesHandle = false;
					allNodeCode = true;
				}
			if (value == 3)
				{
					manyTimesHandle = true;
					allNodeCode = true;
				}
				if (value == 4)
				{
		let htmlString = document.getElementsByTagName('html')[0].innerHTML.replace(/\n/g, '\r\n');
		htmlString += ("\r\n\r\n" + window.location.href);
		manyTimesCode += htmlString;
		PrintCode();
	}
	if (value == 5)
				{
					needGetHotkeyMessage = true;
					needGetMouseMessage = true;
					manyTimesHandle = true;
					allNodeCode = false;
				}
				if (value == 6)
				{
					needGetMouseMessage = true;
					manyTimesHandle = true;
					allNodeCode = false;
				}
				if (value == 7)
				{
					needGetHotkeyMessage = true;
					manyTimesHandle = true;
					allNodeCode = false;
				}
				if (value == 8)
				{
					needGetMouseMessage = true;
					manyTimesHandle = true;
					allNodeCode = false;
					onlyOneNodeCode = true;
				}
				if (value == 9)
				{
					needGetHotkeyMessage = true;
					manyTimesHandle = true;
					allNodeCode = false;
					onlyOneNodeCode = true;
				}
				if (value == 10)
				{
					needGetHotkeyMessage = true;
					needGetMouseMessage = true;
					manyTimesHandle = true;
					allNodeCode = false;
					onlyOneNodeCode = true;
				}
				if (value == 11)
				{
					if (observer1 != null)
observer1.observe(document.body, {childList:true, subtree:true});
					manyTimesHandle = true;
					allNodeCode = false;
					onlyOneNodeCode = false;
				}
				if (value == 12)
				{
					if (observer1 != null)
observer1.observe(document.body, {childList:true, subtree:true});
					manyTimesHandle = true;
					allNodeCode = false;
					onlyOneNodeCode = true;
				}
				if (value == 13)
				{
					if (observer1 != null)
observer1.observe(document.body, {attributes:true, childList:true, subtree:true, characterData:true});
					manyTimesHandle = true;
					allNodeCode = false;
					onlyOneNodeCode = false;
				}
				if (value == 14)
				{
					if (observer1 != null)
observer1.observe(document.body, {attributes:true, childList:true, subtree:true, characterData:true});
					manyTimesHandle = true;
					allNodeCode = false;
					onlyOneNodeCode = true;
				}
			}
			}
	}


	function PrintCode()
	{
		if (window.location.href.search(/^http:\/\/.+/i) == -1)
		{
			navigator.clipboard.writeText(manyTimesCode);
			if ((needGetHotkeyMessage === false) && (needGetMouseMessage === false))
		window.setTimeout(function()
		{
			alert("源代码已复制");
		}, 1000)
		}
		else {
			if (!manyTimesHandle)
				window.setTimeout(function()
				{
					CreateSourceCodeTextarea();
				},1000)
		}
	}

}, 0)
