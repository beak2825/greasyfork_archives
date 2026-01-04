// ==UserScript==
// @id             mybanzou@405647825@qq.com
// @name           rarbt.com下载页免点击后打开新页面显示BT下载按钮
// @version        0.1
// @author         405647825@qq.com
// @namespace      http://weibo.com/pendave
// @description    很反感rarbt.com里面需要点击链接后打开一个新页面才出现下载按钮，于是弄了这个让影片首页里直接显示BT下载按钮
// @icon           data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wDt5t8g282/QNvNv0Dbzb9A282/QOTazzD///8A////AP///wD///8AlGxBv5RsQb/k2s8w////AP///wD///8Au5+Bf3hAA/94QAP/eEAD/3hAA/94QAP/mW9Cv/bz7xD///8A////AHhAA/94QAP/3c+/QP///wD///8A////AMCigX+BRgT/gUYE/4FGBP+BRgT/gUYE/4FGBP/HrZBw////AP///wCBRgT/gUYE/9/QwED///8A////AP///wDFpoJ/i00G/6h5RL////8A////AKBuNM+LTQb/qHlEv////wD///8Ai00G/4tNBv/h0sBA////AP///wD///8AyqqDf5VVCP+vf0W/////AP///wCodTbPlVUI/7yVZJ////8A////AJVVCP+VVQj/5NTBQP///wD///8A////AM+thH+fXAn/pWYY77eERr+xejfPn1wJ/59cCf/m1sFA////AP///wCfXAn/n1wJ/+bWwUD///8A////AP///wDUsYV/qWQL/6lkC/+pZAv/qWQL/6lkC//exKNg////AP///wD///8AqWQL/6lkC//p2MFA////AP///wD///8A2bWGf7NrDf/BhjrP69nCQN29lHCzaw3/t3Qc7/r17xDix6Ng2bWGf7NrDf+zaw3/z6Jon9m1hn////8A////AN24hn+8cQ7/zJRKv////wD69u8QvHEO/7xxDv/u28JAzJRKv7xxDv+8cQ7/vHEO/7xxDv+8cQ7/////AP///wDhuod/w3YP/8Z+Hu/SmEu/yoct38N2D//Ddg//8+XRMN2yeI/SmEu/0phLv9KYS7/SmEu/0phLv////wD///8A47yHf8h6EP/IehD/yHoQ/8h6EP/IehD/1ZtLv////wD///8A////AP///wD///8A////AP///wD///8A////APHdw0DjvId/47yHf+O8h3/jvId/7dW0UP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @include        *rarbt.com/subject/*
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39942/rarbtcom%E4%B8%8B%E8%BD%BD%E9%A1%B5%E5%85%8D%E7%82%B9%E5%87%BB%E5%90%8E%E6%89%93%E5%BC%80%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BABT%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/39942/rarbtcom%E4%B8%8B%E8%BD%BD%E9%A1%B5%E5%85%8D%E7%82%B9%E5%87%BB%E5%90%8E%E6%89%93%E5%BC%80%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BABT%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

var items = document.querySelectorAll('a[href*="dow/index.html?id="]');
var id = window.location.href.match(/\d+/g)[0];
for (i = 0; i < items.length; i++) {
	var aLink = items[i].getAttribute('href');
	var zzNum = aLink.match(/zz=(\d)/)[1];
	//iframe加进去
	if(items[i].innerHTML.match('论坛')){
		items[i].parentNode.innerHTML += '<iframe id="myiframe_' + i + '" style="border: 4px solid #249D11;" src="' + aLink + '" width="680" height="200" overflow: hidden;></iframe>';
	}
	else {
		items[i].parentNode.innerHTML += '<iframe id="myiframe_' + i + '" style="border: 4px solid #249D11;" src="' + aLink + '" width="680" height="80" overflow: hidden;></iframe>';
	}var myIframe = document.querySelector('#myiframe_'+ i);
	myIframe.onload = callback_iframe.bind({},i);
	var ret = GM_xmlhttpRequest({
		method: "POST",
		url: aLink,
		data:{
			'id':id,
			'zz':'zz'+ zzNum,
			'imageField.x':41,
			'imageField':7},
		header:{
			'Host':'www.rarbt.com',
			'Origin':'http://www.rarbt.com',
			'User-Agent':'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.6) Gecko/20151201 Firefox/3.5.6'},
		redirectionLimit: 1,
		onreadystatechange: callback_function.bind({},i)
	});
}

function callback_function(num, responseDetails)
{
	if (responseDetails.readyState != 4) return;
	console.log(responseDetails.responseHeaders.match(/^Location.*/m));
	//GM_log(responseDetails.responseText);
	console.info(responseDetails.responseHeaders);
	var newLink = responseDetails.responseHeaders.Location;
	console.info(responseDetails.finalUrl);
	console.log('Callback with parameters ('+ num+').');
	//对号入座 div
	var aPlace = items[num];
	//添加"下载"按钮
	aPlace.outerHTML = '<a style="color:red;" href="' + newLink + '">直接下载</a>' + aPlace.outerHTML;
}

function callback_iframe(num)
{
	document.querySelector('#myiframe_'+ num).contentWindow.scrollTo(0,330);
}