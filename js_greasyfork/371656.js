// ==UserScript==
// @name    搜索增强
// @namespace    https://m.weibo.cn/profile/2447190122
// @version      0.3.1
// @description    使视障人士更方便的使用百度搜索和网页内搜索，更容易的获取所搜索到的网页的内容，并能快速判断网页的有用程度。
// @author    流水
// @include    http*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/371656/%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/371656/%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

window.setTimeout(function()
{
	var hotKey = true, nodeIndexForward = 0, dataForSearch = [], resultForKeyword = [], h3FromBaidu = '', intervalForFocus = null, keywordIndex = -1, beSetTabindexArray = [], keywordFromThis = [], accessToken = '', audioList = [], ttsFirst = false;
	var lsMessageObject = {origin:'', dataFromBaidu:'', load:false, name:'lsMessage'};
	window.addEventListener('keydown', function(event)
{
	if (!window.event.shiftKey && !window.event.ctrlKey && window.event.altKey && hotKey && window.event.keyCode == 49)
	{
		if (window.location.href.search(/^https:\/\/www\.baidu\.com.+/i) != -1)
		{
			var links = document.getElementsByTagName('a');
			var length = links.length, index = 0;
			if (links[length - 4].innerHTML.indexOf('下一页') != -1)
			{
				var lastH3 = h3FromBaidu;
				links[length - 4].click();
			}
			else {
				ShowMessage('未找到下一页链接！');
				return false;
			}
			intervalForFocus = window.setInterval(function()
			{
				++index;
				if (index > 20)
				clearInterval(intervalForFocus);
				var tempH3 = document.querySelector('h3');
				if (!tempH3)
					return false;
				else {
					tempH3 = tempH3.innerHTML;
					if (tempH3 === lastH3)
						return false;
					else {
						document.querySelector('h3 a').focus();
						clearInterval(intervalForFocus);
					}
				}
			}, 500);
		}
		else {
			SearchKeywordFromHTML();
			if (keywordFromThis.length < 1)
				return false;
			(keywordIndex < keywordFromThis.length - 1) ? (++keywordIndex) : (keywordIndex = -1);
			ClearFocus();
			(keywordIndex != -1) ? ShowMessage(keywordFromThis[keywordIndex]) : ShowMessage(keywordFromThis);
		}
	}

	if (window.event.shiftKey && !window.event.ctrlKey && window.event.altKey && hotKey && window.event.keyCode == 49)
	{
		if ((window.location.href.search(/^https:\/\/www\.baidu\.com.+/i) != -1) || (window.location.href.search(/^https:\/\/www\.google\.com.+/i) != -1))
			return false;
		SearchKeywordFromHTML();
		if (keywordFromThis.length < 1)
			return false;
		(keywordIndex === -1) ? (keywordIndex = keywordFromThis.length - 1) : (--keywordIndex);
		ClearFocus();
		(keywordIndex != -1) ? ShowMessage(keywordFromThis[keywordIndex]) : ShowMessage(keywordFromThis);
	}

	if (!window.event.ctrlKey && !window.event.shiftKey && window.event.altKey && hotKey && window.event.keyCode == 53)
	{
		if (!ttsFirst)
		{
		InitForTTS();
		ttsFirst = true;
		window.setTimeout(function()
		{
			ShowMessage('开始使用百度语音');
		}, 300);
		}
		else {
			ShowMessage('百度语音使用完毕');
			ttsFirst = false;
			window.setTimeout(function()
			{
				var audio = document.querySelector('audio.ls-audio-notice');
				if (audio)
					audio.parentNode.removeChild(audio);
				}, 1000);
		}
	}

	if (!window.event.ctrlKey && !window.event.shiftKey && !window.event.altKey && hotKey && window.event.keyCode == 27)
	{
		var audio = document.querySelector('audio.ls-audio-notice');
		if (!audio || !audio.getAttribute('src') || audio.ended)
			return false;
		audio.pause();
	}

	if (!window.event.ctrlKey && !window.event.shiftKey && window.event.altKey && hotKey && window.event.keyCode == 50)
	{
		GetResultForKeyword();
		if (keywordFromThis.length < 1)
			return false;
		var noticeString = '', noticeKeyword = '', htmlText = document.getElementsByTagName('body')[0].innerHTML;
		if (keywordIndex === -1)
		{
			for (var i = 0; i < keywordFromThis.length; ++i)
			{
				noticeKeyword += keywordFromThis[i] + '，';
			}
		}
		for (var i = 0; i < resultForKeyword.length; ++i)
		{
			var start = resultForKeyword[i].index + resultForKeyword[i][0].length;
			var tempResult = resultForKeyword[i][0];
			if (tempResult.indexOf('>') != -1)
			{
				tempResult = tempResult.slice(tempResult.indexOf('>') + 1);
				tempResult += htmlText.slice(start, htmlText.indexOf('<', start));
			}
			else {
				var singleQuote = /(\=\s*\')([^']*)$/;
				var doubleQuote = /(\=\s*\")([^"]*$)/;
				singleQuote = singleQuote.exec(tempResult);
				doubleQuote = doubleQuote.exec(tempResult);
				if (singleQuote && !doubleQuote)
				{
					tempResult = singleQuote[2];
					tempResult += htmlText.slice(start, htmlText.indexOf("\'", start));
				}
				if (!singleQuote && doubleQuote)
				{
					tempResult = doubleQuote[2];
					tempResult += htmlText.slice(start, htmlText.indexOf('\"', start));
				}
				if (!singleQuote && !doubleQuote)
				{
					tempResult = '';
				}
				if (singleQuote && doubleQuote)
				{
					if (singleQuote.index < doubleQuote.index)
					{
						tempResult = doubleQuote[2];
						tempResult += htmlText.slice(start, htmlText.indexOf('\"', start));
					}
					else {
						tempResult = singleQuote[2];
						tempResult += htmlText.slice(start, htmlText.indexOf("\'", start));
					}
				}
			}
			tempResult = tempResult.replace(/&nbsp;/gi, ' ');
			tempResult += '\r\n';
			if (noticeString.indexOf(tempResult) === -1)
				noticeString += tempResult;
		}
		if (keywordIndex === -1)
		{
			(noticeString.length === 0) ? ShowMessage('网页出现了关键词' + noticeKeyword + '没有搜索到与之相关的内容') : ShowMessage('网页出现了关键词' + noticeKeyword + '下面是与之相关的内容：' + noticeString);
		}
		else {
			(noticeString.length === 0) ? ShowMessage('没有与' + keywordFromThis[keywordIndex] + '相关的内容') : ShowMessage('与' + keywordFromThis[keywordIndex] + '相关的内容为：' + noticeString);
		}
	}

	if (!window.event.shiftKey && !window.event.ctrlKey && window.event.altKey && window.event.keyCode == 48)
	{
		if (hotKey)
		{
			hotKey = false;
			ShowMessage('快捷键已禁用！');
		}
		else {
		hotKey = true;
		ShowMessage('快捷键已启用！');
		}
	}

	if (!window.event.shiftKey && !window.event.ctrlKey && window.event.altKey && hotKey && window.event.keyCode == 51)
	{
		if ((window.location.href.search(/^https:\/\/www\.baidu\.com.+/i) != -1) || (window.location.href.search(/^https:\/\/www\.google\.com.+/i) != -1))
		{
			ReviseBaiduTo();
		}
		else {
			if ((nodeIndexForward === 0) && !document.querySelector('.lsUselessButton0'))
			{
				GetResultForKeyword();
				if (keywordFromThis.length < 1)
					return false;
				var htmlText = document.getElementsByTagName('body')[0].innerHTML;
				var myClass = /lsUselessButton-?\d*/;
				var needlessTabindexNode = ['a', 'area', 'label', 'select', 'button', 'textarea'];
				var useParentNode = ['br', 'b', 'i', 'span'];
				var length = resultForKeyword.length, nodeIndex = 0;
				for (var i = 0; i < length; ++i)
				{
					var hasSlash = true, beSetTabindex = true, needlessTabindex = false;
					var keyword = resultForKeyword[length - 1 - i][2];
					(keyword.indexOf('/') === -1) ? (hasSlash = false) : (keyword = keyword.replace('/', ''));
					var reg = new RegExp('(<)' + keyword + '(\\s|>|\/\\s*>)', 'gim');
					reg.compile(reg);
					var index = 0, i2 = 0, i3 = 0;
					while ((i2 != -1) && (i3 - 1 < resultForKeyword[length - 1 - i].index))
					{
						if (i3 === 0)
						{
							i2 = htmlText.search(reg);
						}
						if (i3 > 0)
						{
							i2 = htmlText.slice(i3).search(reg);
						}
						if (i2 != -1)
						{
							++index;
						}
						i3 += (i2 + 2);
					}
					if (document.getElementsByTagName(keyword)[index - 1])
					{
					var node = (hasSlash) ? (document.getElementsByTagName(keyword)[index - 1].parentNode) : (document.getElementsByTagName(keyword)[index - 1]);
					}
					for (var i5 = 0; i5 < useParentNode.length; ++i5)
					{
						if ( node && (useParentNode[i5] === node.tagName.toLowerCase()))
						{
							if (node.parentNode.tagName.toLowerCase() != 'body')
							{
								node = node.parentNode;
							}
							break;
						}
					}
					if (!node || document.querySelector('.lsUselessButton' + (0 - nodeIndex)) || (node.innerHTML.search(myClass) != -1))
						continue;
					if (node.getAttribute('class'))
					{
						if (node.getAttribute('class').search(myClass) != -1)
							continue;
					}
					for (var i4 = 0; i4 < needlessTabindexNode.length; ++i4)
					{
						if (needlessTabindexNode[i4] === node.tagName.toLowerCase())
						{
							needlessTabindex = true;
							break;
						}
					}
					if (!needlessTabindex)
					{
						(node.getAttribute('tabindex') == null) ? node.setAttribute('tabindex', '-1') : beSetTabindex = false;
					}
					node.classList.add('lsUselessButton' + (0 - nodeIndex));
					beSetTabindexArray[nodeIndex] = beSetTabindex;
					++nodeIndex;
				}
			}
			var nodeObject = document.querySelector('.lsUselessButton' + (nodeIndexForward - (beSetTabindexArray.length - 1)));
			if (nodeObject)
			{
				nodeObject.focus();
				++nodeIndexForward;
			}
			else{
				ShowMessage('已到最后一项。');
			} 
		}
	}

	if (window.event.shiftKey && !window.event.ctrlKey && window.event.altKey && hotKey && window.event.keyCode == 51)
	{
		if (dataForSearch.length < 1)
		{
			ShowMessage('没有获取到关键词，无法进行下一步操作。');
			return false;
		}
		(nodeIndexForward <= 0) ? ShowMessage('已到第一项。') : --nodeIndexForward;
		var nodeObject = document.querySelector('.lsUselessButton' + (nodeIndexForward - (beSetTabindexArray.length - 1)))
		if (nodeObject)
		{
			nodeObject.focus();
		}
	}

	if (!window.event.ctrlKey && !window.event.shiftKey && window.event.altKey && hotKey && window.event.keyCode == 52)
	{
		ClearFocus();
		keywordIndex = -1;
		var data = prompt('请输入要搜索的关键词，中间用空格或竖杠分开');
		(data != null && data != '') ? SetDataForSearch(data) : ShowMessage('没有获取到正确的输入');
	}
})

window.addEventListener('load', function()
{
	lsMessageObject.origin = self.location.protocol + '\/\/' + self.location.hostname;
	lsMessageObject.load = true;
	if (window.opener)
	{
		window.opener.postMessage(lsMessageObject, '*');
	}
	if (ttsFirst)
	{
		InitForTTS();
	}
	RemoveIframes();
})

window.addEventListener('message', function(event)
	{
		if (event.data.name === 'lsMessage')
		{
			if (event.data.dataFromBaidu && !lsMessageObject.dataFromBaidu)
			{
			lsMessageObject = event.data;
			SetDataForSearch();
			}
			if (!event.data.dataFromBaidu && lsMessageObject.dataFromBaidu)
			{
				event.source.postMessage(lsMessageObject, '*');
			}
		}
	})

	function ReviseBaiduTo()
	{
		if ((window.location.href.search(/^https:\/\/www\.baidu\.com.+/i) == -1) && (window.location.href.search(/^https:\/\/www\.google\.com.+/i) == -1))
			return false;
		var title = document.querySelector('head title').text;
		if (lsMessageObject.dataFromBaidu != title)
		{
			lsMessageObject.dataFromBaidu = title;
		}
		var linksForBaidu = document.querySelectorAll('h3 a');
		for (var i = 0; i < linksForBaidu.length; ++i)
		{
			linksForBaidu[i].onclick = function()
			{
				var windowFromBaidu = window.open(this.getAttribute('href'));
				setTimeout(function()
				{
					windowFromBaidu.postMessage(lsMessageObject, '*');
				}, 3000);
				return false;
			}
		}
		linksForBaidu = null;
	}

	function GetResultForKeyword()
	{
		resultForKeyword = [];
		SearchKeywordFromHTML();
		if (keywordFromThis.length < 1)
			return false;
		var needlessNode = ['input', 'script'];
		var escapeLetters = ['\\', '$', '?', '^', '+', '*', '(', ')', '.', '[', ']', '{', '}', '|'];
		var aboutTitle = /title\s*\=[^=]+$/i;
		var htmlText = document.getElementsByTagName('body')[0].innerHTML;
		var index = 0, keyword = [];
		(keywordIndex === -1) ? (keyword = keywordFromThis) : (keyword[0] = keywordFromThis[keywordIndex]);
		for (var i = 0; i < keyword.length; ++i)
		{
			var tempKeyword = keyword[i].slice(0);
			for (var i2 = 0; i2 < escapeLetters.length; ++i2)
			{
				var escapeLetter = new RegExp('\\' + escapeLetters[i2], 'g');
				tempKeyword = tempKeyword.replace(escapeLetter, '\\' + escapeLetters[i2]);
			}
			var reg = new RegExp('(<)(\/?\\w+)(\\s|>|\/\\s*>)([^<]*)(?=' + tempKeyword + ')', 'gim');
			reg.compile(reg);
			var tempResult = reg.exec(htmlText);
			while (tempResult != null)
			{
				var uselessResult = repeated = isNeedlessNode = false;
				for (var i2 = 0; i2 < needlessNode.length; ++i2)
				{
					if (tempResult[2].toLowerCase().indexOf(needlessNode[i2]) != -1)
					{
						isNeedlessNode = true;
						break;
					}
				}
				for (var i2 = 0; i2 < resultForKeyword.length; ++i2)
				{
					if (tempResult.index === resultForKeyword[i2].index)
					{
						repeated = true;
						break;
					}
				}
				if ((tempResult[0].indexOf('>') === -1) && (tempResult[0].search(aboutTitle) === -1))
				{
					uselessResult = true;
				}
				if (!repeated && !isNeedlessNode && !uselessResult)
				{
					resultForKeyword[index] = tempResult;
					++index;
				}
				tempResult = reg.exec(htmlText);
			}
			reg = null;
		}
		resultForKeyword.sort(function(a, b)
		{
			return a.index - b.index;
		});
	}

function RemoveIframes()
{
	var urlArray = [/https:\/\/pos\.baidu\.com/i, /https:\/\/g\.fastapi\.net/i];
	var needLessFrames = [], index = 0;
	for (var i = 0; i < urlArray.length; ++i)
	{
		var framesObject = document.getElementsByTagName('iframe');
		for (var i2 = 0; i2 < framesObject.length; ++i2)
		{
			if (!framesObject[i2])
				continue;
			var src = framesObject[i2].getAttribute('src');
			if (src && (src.search(urlArray[i]) != -1))
			{
				needLessFrames[index] = framesObject[i2];
				++index;
			}
		}
	}
	for (var i = 0; i < needLessFrames.length; ++i)
	{
		needLessFrames[i].parentNode.removeChild(needLessFrames[i]);
	}
}

function ClearFocus()
{
	for (var i = 0; i < beSetTabindexArray.length; ++i)
	{
		var node = document.querySelector('.lsUselessButton' + (i - (beSetTabindexArray.length - 1)));
		if (node && node.getAttribute('tabindex') && beSetTabindexArray[beSetTabindexArray.length - 1 - i])
		{
			node.removeAttribute('tabindex');
		}
		if (node && node.getAttribute('class'))
		{
			node.classList.remove('lsUselessButton' + (i - (beSetTabindexArray.length - 1)));
		}
	}
	nodeIndexForward = 0;
	beSetTabindexArray = [];
}

function SetDataForSearch(data)
{
	dataForSearch = [];
	if (!lsMessageObject.dataFromBaidu && !arguments[0])
		return false;
	var cut_off = '', cut_offArray = ['|', ' '];
	if (arguments[0])
	{
		data = arguments[0];
	}
	else {
		if (lsMessageObject.origin.indexOf('https://www.baidu.com') != -1)
		{
			var end = lsMessageObject.dataFromBaidu.indexOf('_百度搜索');
			data = lsMessageObject.dataFromBaidu.slice(0, end);
		}
		if (lsMessageObject.origin.indexOf('https://www.google.com') != -1)
		{
			var end = lsMessageObject.dataFromBaidu.indexOf(' - Google');
			data = lsMessageObject.dataFromBaidu.slice(0, end);
		}
	}
	for (var i = 0; i < cut_offArray.length; ++i)
	{
		if (data.indexOf(cut_offArray[i]) != -1)
		{
			cut_off = cut_offArray[i];
			break;
		}
	}
	if (!cut_off)
	{
		dataForSearch[0] = data;
	}
	else {
		var reg = new RegExp('([^' + cut_off + ']+)', 'gim');
		var needSpace = /[a-zA-Z\d]/;
		var keyword = [], index = 0, keywordCount = 0, tempResult = '';
		tempResult = reg.exec(data);
		while (tempResult)
		{
			keyword[index] = tempResult[1];
			++index;
			tempResult = reg.exec(data);
		}
		keywordCount = index;
		for (var i = 0; i < keywordCount; ++i)
		{
			dataForSearch[i] = keyword[i];
		}
		if (keywordCount > 1)
		{
			for (var i =0; i < keywordCount - 1; ++i)
			{
				for (var i2 = i + 1; i2 < keywordCount; ++i2)
				{
					dataForSearch[index] = (needSpace.test(keyword[i].slice(keyword[i].length - 1, keyword[i].length)) && needSpace.test(keyword[i2].slice(0, 1))) ? (keyword[i] + ' ' + keyword[i2]) : (keyword[i] + keyword[i2]);
					++index;
					dataForSearch[index] = (needSpace.test(keyword[i2].slice(keyword[i2].length - 1, keyword[i2].length)) && needSpace.test(keyword[i].slice(0, 1))) ? (keyword[i2] + ' ' + keyword[i]) : (keyword[i2] + keyword[i]);
					++index;
				}
			}
		}
		if (keywordCount > 2)
		{
			for (var i = 0; i < keywordCount; ++i)
			{
				if (i ===0)
				{
					dataForSearch[index] = '';
				}
				var length = dataForSearch[index].length;
				((length > 0) && needSpace.test(dataForSearch[index].slice(length - 1, length)) && needSpace.test(keyword[i].slice(0, 1))) ? (dataForSearch[index] += ' ' + keyword[i]) : (dataForSearch[index] += keyword[i]);
			}
		}
	}
	PlaySound();
}

function SearchKeywordFromHTML()
{
	keywordFromThis = [];
	if (dataForSearch.length < 1)
	{
		ShowMessage('没有获取到关键词，无法进行下一步操作。');
		return false;
	}
	var index = 0, htmlText = document.getElementsByTagName('body')[0].innerHTML;
	for (var i = 0; i < dataForSearch.length; ++i)
	{
		if (htmlText.indexOf(dataForSearch[i]) != -1)
		{
			keywordFromThis[index] = dataForSearch[i];
			++index;
		}
	}
	if (index < 1)
		UseTTS('没有在网页中搜索到任何关键词');
}

function PlaySound()
{
	var audioContext = new AudioContext();
	var oscillator = audioContext.createOscillator();
	var gainNode = audioContext.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);
	oscillator.type = 'sine';
	oscillator.frequency.value = 400.00;
	gainNode.gain.setValueAtTime(0, audioContext.currentTime);
	gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
	oscillator.start(audioContext.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);
	oscillator.stop(audioContext.currentTime + 1);
}

window.setTimeout(function()
{
	if ((window.location.href.search(/^https:\/\/www\.baidu\.com.+/i) != -1) || (window.location.href.search(/^https:\/\/www\.google\.com.+/i) != -1))
	{
		window.setInterval(function()
		{
			var tempH3 = document.querySelector('h3');
			if (!tempH3)
			{
				h3FromBaidu = '';
				return false;
			}
			else {
				var text = tempH3.innerHTML;
				if (text == h3FromBaidu)
					return false;
				else {
					h3FromBaidu = text;
					ReviseBaiduTo();
				}
			}
		}, 1000);
	}
}, 3000)

function ShowMessage(data)
{
	if (!data)
		return false;
	if (ttsFirst)
	{
		var audio = document.querySelector('audio.ls-audio-notice');
		if (!audio)
			return false;
		var dataArray = [];
		if (data.length <= 512)
		{
			dataArray[0] = data;
		}
		else {
			var start = end = index = 0, length = data.length;
			cut_off = [/.。/, /.，/, /.；/, /\D\.\D/, /\D,\D/, /.;/];
			while (start < length)
			{
				if (length > start + 400)
				{
					for (var i = 0; i < cut_off.length; ++i)
					{
						end = (length > start + 512) ? data.slice(start + 400, start + 512).search(cut_off[i]) : data.slice(start + 400, length).search(cut_off[i]);
						if (end != -1)
						{
							end += (start + 400 + 2);
							dataArray[index] = data.slice(start, end);
							break;
						}
					}
					if (end === -1)
					{
						end = (length > start + 512) ? (start + 512) : (length);
						dataArray[index] = data.slice(start, end);
					}
					start = end;
				}
				else {
					dataArray[index] = data.slice(start, length);
					start = length;
				}
				++index;
			}
			dataArray.reverse();
		}
		if (!audio.ended && audio.getAttribute('src'))
		{
			audio.removeEventListener('ended', PlayList);
			audio.pause();
		}
		UseTTS(dataArray.pop());
		if (dataArray.length > 0)
		{
			audioList = dataArray;
			audio.addEventListener('ended', PlayList);
		}
	}
	else {
		alert(data);
	}
}

function PlayList()
{
	(audioList.length > 0) ? UseTTS(audioList.pop()) : audio.removeEventListener('ended', PlayList);
}

function InitForTTS()
{
	if (!accessToken)
	{
		GM_xmlhttpRequest({
			method: "GET",
			headers: { "Accept": "Content-Type:application/json" },
			url: "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=DmRzeWmTGgwPuPrFyHPhxLFH&client_secret=iYUz9bmANfuDBhlpacObRCq4qutDHfSe",
			onload: function (response)
			{
				var data = response.responseText;
				var datas = JSON.parse(data);
				accessToken = datas.access_token;
			}
		});
	}
	var audio = document.querySelector('audio.ls-audio-notice');
	if (audio)
		return false;
	audio = document.createElement('audio');
	audio.className = 'ls-audio-notice';
	audio.src = "";
	audio.volume = 0.6;
	document.body.appendChild(audio);
}

function UseTTS(TTStext)
{
	var audio = document.querySelector('audio.ls-audio-notice');
	if (!audio || !accessToken)
		return false;
	var zhText = encodeURI(TTStext);
	var parameter = "&vol=9&per=0&spd=9&pit=4";
	var voicebbUrl = "https://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=xiaobo&tok=" + accessToken + "&tex=" + zhText + parameter;
	audio.src = voicebbUrl;
	audio.playbackRate = 1.7;
	audio.play();
}

}, 0)