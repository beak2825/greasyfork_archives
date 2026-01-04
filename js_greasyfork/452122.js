// ==UserScript==
// @name         Pixiv Novel Translator （Pixiv 小说翻译器）
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Pixiv翻译器，支持PC端列表页、小说页面和Fanbox.cc投稿页面的翻译，使用彩云小译API。
// @author       Archeb
// @match        https://www.pixiv.net/*
// @match        https://*.fanbox.cc/posts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/452122/Pixiv%20Novel%20Translator%20%EF%BC%88Pixiv%20%E5%B0%8F%E8%AF%B4%E7%BF%BB%E8%AF%91%E5%99%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/452122/Pixiv%20Novel%20Translator%20%EF%BC%88Pixiv%20%E5%B0%8F%E8%AF%B4%E7%BF%BB%E8%AF%91%E5%99%A8%EF%BC%89.meta.js
// ==/UserScript==

var _wr = function (type) {
	var orig = history[type];
	return function () {
		var rv = orig.apply(this, arguments);
		var e = new Event(type);
		e.arguments = arguments;
		window.dispatchEvent(e);
		return rv;
	};
};
(history.pushState = _wr("pushState")), (history.replaceState = _wr("replaceState"));

function getElementByXpath(path) {
	return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

async function getTranslation(translateList) {
	let url = "https://api.interpreter.caiyunai.com/v1/translator";
	let token = localStorage.getItem("pixivtranslate-archeb-caiyunkey");

	// 检测语言，因为一次翻译的文本量是比较长的所以可以用这个办法
	let trans_type;
	let translateText = translateList.join("");
	if (translateText.match(/[\u3040-\u30ff]/)) {
		// 有假名，是日语
		trans_type = "ja2zh";
	} else if (translateText.match(/[\u4E90-\u9FFF]/)) {
		// 没有假名但是有汉字，是中文
		// 直接返回原文
		return { target: translateList };
	} else {
		// 就当他是英文
		trans_type = "en2zh";
	}

	let payload = {
		source: translateList,
		trans_type: trans_type,
		request_id: "403bfbf13b56220e46f9ff66725ead46",
	};

	let headers = {
		"content-type": "application/json",
		"x-authorization": "token " + token,
	};
	const response = await fetch(url, {
		method: "POST",
		headers: headers,
		mode: "cors",
		cache: "no-cache",
		body: JSON.stringify(payload),
	});
	return response.json();
}

function doContentTranslate() {
	let contentMainElement = getElementByXpath('//*[@id="root"]/div[2]/div/div[3]/div/div/div/main/section/div[2]/div[3]/div/div[1]/main/div');
	for (let paragraph of contentMainElement.querySelectorAll("p")) {

		doParagraphTranslate(paragraph);
	}
}

function doFanboxContentTranslate() {
	let contentMainElement = document.querySelector('.public-DraftEditor-content');
    contentMainElement=contentMainElement?contentMainElement:document.querySelector('.tHqFl>article');
	for (let paragraph of contentMainElement.querySelectorAll("div")) {
		doParagraphTranslate(paragraph);
	}
}

async function doNovelInfoTranslate() {
	let titleElement = getElementByXpath('//*[@id="root"]/div[2]/div/div[2]/div/div/main/section/div[1]/div/div[2]/h1');
	let seriesTitleElement = getElementByXpath('//*[@id="root"]/div[2]/div/div[2]/div/div/main/section/div[1]/div/div[2]/div[2]/a') || { innerText: "" };
	let descriptionElement = document.querySelector("main>section p[id^=expandable-paragraph");
	let result = await getTranslation([titleElement.innerText, seriesTitleElement.innerText]);
	titleElement.innerText = result.target[0];
	seriesTitleElement.innerText = result.target[1];
	doParagraphTranslate(descriptionElement);
}

async function doParagraphTranslate(paragraph) {
	let translationMap = {};
	let translationList = [];
	for (let node of paragraph.childNodes) {
		if ((node.nodeName == "#text" || node.nodeName == "SPAN") && node.textContent.length > 0 && !node.translated) {
			translationMap[translationList.length] = node;
			translationList.push(node.textContent);
			node.translated = true;
		}
	}
	if (translationList.length > 0) {
		let result = await getTranslation(translationList);
		for (let translationIndex in result.target) {
			translationMap[translationIndex].textContent = result.target[translationIndex];
		}
	}
}

async function doListTranslate(list) {
	let translationMap = {};
	let translationList = [];
	for (let item of list.querySelectorAll("ul>li")) {
        if(!item.translated){
		let titleElement = item.querySelector("div[title]>a[href]");
		let seriesTitleElement = item.querySelector("div>div:nth-child(2)>div>div:nth-child(1)>a") || { innerText: "" };
		let descriptionElement = item.querySelector("div>div:nth-child(2)>div div.sc-1c4k3wn-20 div.sc-1utla24-0") || { innerText: "" };
		translationMap[translationList.length] = titleElement;
		translationList.push(titleElement.innerText);
		translationMap[translationList.length] = seriesTitleElement;
		translationList.push(seriesTitleElement.innerText);
		translationMap[translationList.length] = descriptionElement;
		translationList.push(descriptionElement.innerText);
        item.translated=true;
        }
	}
	if (translationList.length > 0) {
		let result = await getTranslation(translationList);
		for (let translationIndex in result.target) {
			translationMap[translationIndex].innerText = result.target[translationIndex];
		}
	}
}

function doPageTranslate() {
    let listItemElements = document.querySelectorAll('div>div>ul>li[size="1"]')
	if (listItemElements.length>0) {
        for(let listItemEl of listItemElements){
            doListTranslate(listItemEl.parentElement);
        }
	}

	if (window.location.href.match(/pixiv\.net\/novel\/show.php/)) {
		console.log("Novel Page Detected");
		doContentTranslate();
		doNovelInfoTranslate();
	}
    if (window.location.href.match(/fanbox\.cc\/posts\//)) {
		console.log("Fanbox Page Detected");
		doFanboxContentTranslate();
	}
}

function promptSetKey() {
	let caiyunkey = prompt("请输入彩云小译Key，如果没有请到彩云开发者平台申请","");
	if(caiyunkey){
        localStorage.setItem("pixivtranslate-archeb-caiyunkey", caiyunkey);
        alert("保存完毕，如需修改请打开Pixiv边栏拉到最下面找【设置翻译key】");
    }
}

// 检查有没有存key
if (!localStorage.getItem("pixivtranslate-archeb-caiyunkey")) {
	promptSetKey();
}

function addSettingBtn() {
	var settingBtn = document.createElement("a");
	settingBtn.onclick = promptSetKey;
	settingBtn.innerHTML = "设置翻译key";
	settingBtn.href = "#";
	let findingElement = document.querySelector('a[href="https://policies.pixiv.net/#privacy"]')
    if(findingElement){
        findingElement.parentElement.append(settingBtn);
        clearInterval(addSettingBtnIntervalId);
    }
}

const addSettingBtnIntervalId = setInterval(addSettingBtn,1000);

window.addEventListener("pushState", () => {
	console.log("Location Changed");
	setTimeout(doPageTranslate, 500);
});
setInterval(doPageTranslate, 1000);
