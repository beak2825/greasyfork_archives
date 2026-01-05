// ==UserScript==
// @name           Pixiv Filter
// @namespace      Pixiv Filter
// @description    Filters out images with few than the designated bookmarks (users)
// @include        *www.pixiv.net/whitecube/search/*
// @include        *www.pixiv.net/search.php?*
// @version        3.6.1
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/24329/Pixiv%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/24329/Pixiv%20Filter.meta.js
// ==/UserScript==

// 如果沒設定數值 則預設為50
var threshold = parseInt(GM_getValue("minThreshold", 50));

if(document.URL.match(/pixiv\.net\/search\.php./) != null) {
    createFilterBox();
	document.addEventListener("scroll", filterImages, false);
    filterImages();
} else {
    console.log("網址不匹配，可能需要更新腳本");
}

function filterImages() {
    let countElements = document.getElementsByClassName("bookmark-count");
    for (let i = 0; i < countElements.length; i++) {
        let countString = countElements[i].getAttribute("data-tooltip").toString().match(/\d+/);
        let count = parseInt(countString);
        if (count < threshold) {
            removeTarget(countElements[i]);
        }
    }
    // 遞迴找到父節點並刪除
    function removeTarget(node) {
        if (node.nodeName == "FIGURE") {
            node.parentNode.remove();
            return 0;
        } else {
            removeTarget(node.parentNode);
        }
    }

    // 移除零個關注的圖片
    let imageElements = document.getElementsByTagName("figcaption");
    for (let i = 0; i < imageElements.length; i++) {
        imageElementChilds = imageElements[i].firstChild.childNodes;
        if (imageElementChilds.length == 2) {
            removeTarget(imageElements[i]);
        }
    }
}

function createFilterBox() {
    let parentDOM = document.createElement('div');
    parentDOM.innerHTML = '<div id="parentDOM"/>';

    let inputText = document.createElement('p');
    inputText.innerHTML = '<p id="inputText"> 請輸入最低用戶數：</p>';

    let inputField = document.createElement('div');
    inputField.innerHTML = '<input type="text" id="minThreshold" value="' + threshold + '"/>';

    inputField.addEventListener("keydown", function (e) {
        if (e.keyCode == 13) {
            let newThreshold = parseInt(document.getElementById("minThreshold").value);
            GM_setValue("minThreshold", newThreshold);
            filterImages();
        }
    }, false);

    parentDOM.appendChild(inputText);
    parentDOM.appendChild(inputField);

    // 嵌入網站
    let searchOption = document.getElementById("js-react-search-mid");
    searchOption.parentNode.insertBefore(parentDOM, searchOption);
}
