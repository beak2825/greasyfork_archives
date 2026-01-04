// ==UserScript==
// @name         隱藏巴哈姆特原鐵絕看板內鬼資訊
// @namespace    http://wysalan.com/
// @version      0.9.50
// @description  以眼不見為淨的方式隱藏巴哈姆特《原神》、《崩壞：星穹鐵道》和《絕區零》看板內的內鬼相關文章
// @author       Wysalan
// @match        https://forum.gamer.com.tw/B.php?bsn=36730*
// @match        https://forum.gamer.com.tw/B.php?bsn=72822*
// @match        https://forum.gamer.com.tw/B.php?bsn=74860*
// @match        https://forum.gamer.com.tw/C.php?bsn=36730
// @match        https://forum.gamer.com.tw/C.php?bsn=72822*
// @match        https://forum.gamer.com.tw/C.php?bsn=74860*
// @match        https://forum.gamer.com.tw/B.php?page=*
// @match        https://forum.gamer.com.tw/C.php?page=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488716/%E9%9A%B1%E8%97%8F%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8E%9F%E9%90%B5%E7%B5%95%E7%9C%8B%E6%9D%BF%E5%85%A7%E9%AC%BC%E8%B3%87%E8%A8%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/488716/%E9%9A%B1%E8%97%8F%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8E%9F%E9%90%B5%E7%B5%95%E7%9C%8B%E6%9D%BF%E5%85%A7%E9%AC%BC%E8%B3%87%E8%A8%8A.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var status = false;
    let url = document.URL;

    // --------強制模式-----------
    let forceMode = GM_getValue("forceMode", false);

    console.log("GM_getValue: " + GM_getValue("forceMode"));

    // ------內鬼分類編號---------
    // 編號說明：從零開始，由上至下、從左到右
    let subForumIndex_Genshin = 1;
    let subForumIndex_StarRail = 12;
    let subForumIndex_ZZZ = 1;

    let forumID_Genshin = "36730";
    let forumID_StarRail = "72822";
    let forumID_ZZZ = "74860";

    waitForElementObserved('BH-menuE', createIndicator);
    waitForElementObserved('b-list', removePost);
    hidePostContent();

    // 等待 elementClassName 元素出現後立刻執行 functionName 函數
    function waitForElementObserved(elementClassName, functionName)
    {
        let callback = function(mutationsList) {
            if (document.getElementsByClassName(elementClassName).length > 0) {
                functionName();
                this.disconnect();
            }
        };
        let observer = new MutationObserver(callback);
        let targetNode = document.documentElement;
        let config = { attributes: true, childList: true, subtree: true };
        observer.observe(targetNode, config);
    }

    // 建立指示器
    function createIndicator()
    {
        // Get Bahamut menu bar
        const menuBar = document.querySelector('.BH-menuE');

        // Create indicator element
        const indicator = document.createElement('li');
        const indicatorContent = document.createElement('a');
        indicatorContent.className = "indicator";
        indicatorContent.style.fontWeight = "bold";

        // Create advance setting element
        const advanceSetting = document.createElement('li');
        const advanceSettingContent = document.createElement('a');
        advanceSettingContent.className = "advanceSetting";
        advanceSettingContent.style.fontWeight = "bold";

        if(status)
        {
            indicatorContent.innerHTML = "防內鬼已啟用";
            indicatorContent.onclick = () => hidePostSwitchToggle();
            advanceSettingContent.innerHTML = "進階設定";
            advanceSettingContent.onclick = () => advanceSettingUI();
        } else {
            indicatorContent.innerHTML = "防內鬼已啟用（範圍外）";
            advanceSettingContent.innerHTML = "進階設定";
            advanceSettingContent.onclick = () => advanceSettingUI();
        }

        if(GM_getValue("forceMode"))
        {
            hideCategoryTab();
            advanceSettingContent.innerHTML = ".";
            advanceSetting.appendChild(advanceSettingContent);
            menuBar.appendChild(advanceSetting);
        }
        else
        {
            indicator.appendChild(indicatorContent);
            advanceSetting.appendChild(advanceSettingContent);
            menuBar.appendChild(indicator);
            menuBar.appendChild(advanceSetting);
        }
    }

    // 隱藏指示器
    function hidePostSwitchToggle()
    {
        const postListArea = document.querySelector('.b-list');
        const indicator = document.querySelector('.indicator');
        if(status)
        {
            postListArea.style.display = postListArea.style.display === "none" ? "block" : "none";
            indicator.innerHTML = indicator.innerHTML === "防內鬼已啟用" ? "防內鬼暫時停用" : "防內鬼已啟用";
        }
    }

    // 移除文章列表內所有文章
    function removePost()
    {
        if(urlChecker("PostList", url))
        {
            const postListArea = document.querySelector('.b-list');
            postListArea.style.display = "none";
            status = true;
        }
    }

    // 隱藏文章內容
    function hidePostContent()
    {
        if (urlChecker("PostContent", url))
        {
            status = true;
            warnWindowGenerate();
        }
    }

    // 隱藏子板入口
    function hideCategoryTab()
    {
        // test();
        if(locationChecker("StarRail", url))
        {
            let tab = document.querySelectorAll('.b-tags__item')[subForumIndex_StarRail].remove();
        }
        else if(locationChecker("Genshin", url))
        {
            let tab = document.querySelectorAll('.b-tags__item')[subForumIndex_Genshin].remove();
        }
        else if(locationChecker("ZZZ", url))
        {
            let tab = document.querySelectorAll('.b-tags__item')[subForumIndex_ZZZ].remove();
        }
    }

    // 網址檢查（偵測是否位於文章列表或文章內）
    function urlChecker(checkType, url)
    {
        const inGenshinForum = url.includes("&subbsn=10");
        const inStarRailForum = url.includes("&subbsn=8");
        const inZZZForum = url.includes("&subbsn=3");
        const inPLFirstPage = url.includes("B.php?bsn=");
        const inPLAnotherPages = url.includes("B.php?page=");
        const inPostPage = url.includes("C");

        if(checkType == "PostList")
        {
            return (inPLFirstPage || inPLAnotherPages) && (inGenshinForum || inStarRailForum || inZZZForum);

        }
        else if(checkType == "PostContent")
        {
            return inPostPage && (inGenshinForum || inStarRailForum || inZZZForum);
        }
    }

    // 網址檢查（偵測是否位於原神或崩鐵看板）
    function locationChecker(GameName, url)
    {
        const inGenshinForum = url.includes(forumID_Genshin);
        const inStarRailForum = url.includes(forumID_StarRail);
        const inZZZForum = url.includes(forumID_ZZZ);

        if(GameName == "Genshin")
        {
            return inGenshinForum;
        }
        else if(GameName == "StarRail")
        {
            return inStarRailForum;
        }
        else if(GameName == "ZZZ")
        {
            return inZZZForum;
        }
    }

    // 建立警告頁面
    function warnWindowGenerate()
    {
        // 警告：底部背景
        const div = document.createElement('div');
        div.className = "leakContentAlert";
        div.style.position = "fixed";
        div.style.top = 0;
        div.style.right = 0;
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.zIndex = 9999;
        div.style.backgroundColor = "#ffffff";
        document.body.appendChild(div);

        // 警告：內容區域
        const contentDiv = document.createElement('div');
        contentDiv.style.position = "absolute";
        contentDiv.style.top = "50%";
        contentDiv.style.left = "50%";
        contentDiv.style.transform = "translate(-50%, -50%)";
        contentDiv.style.fontSize = "24px";
        div.appendChild(contentDiv);

        // 警告：文字區域
        const contentText = document.createElement("p");
        contentText.style.lineHeight = "1.5";
        if(forceMode)
        {
            contentText.innerHTML = "此文章含有<b>內鬼</b>資訊<br>選擇「返回上一頁」離開或自行關閉此分頁。";
        } else {
            contentText.innerHTML = "你即將要瀏覽<b>內鬼</b>分類裡的文章<br>如要繼續請選擇「仍要閱讀」<br>否則選擇「返回上一頁」離開或自行關閉此分頁。";
        }

        const returnButton = document.createElement("button");
        const allowButton = document.createElement("button");

        // Style for returnButton
        returnButton.style.width = "100px";
        returnButton.style.height = "40px";
        returnButton.style.margin = "10px";
        returnButton.style.backgroundColor = "#04AA6D";
        returnButton.textContent = "返回上一頁";

        // Evnet for returnButton
        returnButton.addEventListener("click", function() {
            window.history.back();
        });

        // Style for allowButton
        allowButton.style.width = "100px";
        allowButton.style.height = "40px";
        allowButton.style.margin = "10px";
        allowButton.style.backgroundColor = "#ff8787";
        allowButton.textContent = "仍要閱讀";

        // Evnet for allowButton
        allowButton.addEventListener("click", function() {
            let warnWindow = document.querySelector('.leakContentAlert');
            if(warnWindow)
            {
                if(window.confirm("確定要瀏覽嗎？這次允許之後還會出現提示。"))
                {
                    warnWindow.style.display = "none";
                }
            }
        });

        // 附加在 contentDiv 底下
        contentDiv.appendChild(contentText);
        contentDiv.appendChild(returnButton);

        // 警告：按鈕
        if(!forceMode)
        {
            contentDiv.appendChild(allowButton);
        }

        status = true;
    }

    // 建立進階設定介面
    function advanceSettingUI()
    {
        // 進階設定：背景
        const div = document.createElement('div');
        div.id = "advanceSettingUI";
        div.style.position = "fixed";
        div.style.top = "5%";
        div.style.right = "5%";
        div.style.width = "20%";
        div.style.height = "20%";
        div.style.zIndex = "9999";
        div.style.backgroundColor = "gray";
        div.style.border = "3px solid black";
        div.style.borderRadius = "10px";
        document.body.appendChild(div);

        // 進階設定：內容區域
        const contentDiv = document.createElement('div');
        contentDiv.style.position = "absolute";
        contentDiv.style.top = "10%";
        contentDiv.style.left = "10%";
        contentDiv.style.transform = "translate(-10%, -10%)";
        contentDiv.style.fontSize = "24px";
        div.appendChild(contentDiv);

        // 進階設定：文字區域
        const contentText = document.createElement("p");
        contentText.style.lineHeight = "1.5";
        if(forceMode)
        {
            contentText.innerHTML = "「強制模式」開關";
        } else {
            contentText.innerHTML = "「強制模式」開關";
        }

        // 進階設定：Checkbox
        const forceModeCheckbox = document.createElement("input");
        forceModeCheckbox.id = "forceModeStatus";
        forceModeCheckbox.type = "checkbox";
        // forceModeCheckbox.checked = true;
        forceModeCheckbox.checked = GM_getValue("forceMode");

        // Style for saveButton
        const saveButton = document.createElement("button");
        saveButton.style.width = "50px";
        saveButton.style.height = "30px";
        saveButton.style.margin = "10px";
        saveButton.style.backgroundColor = "#04AA6D";
        saveButton.textContent = "儲存";

        // Style for cancelButton
        const cancelButton = document.createElement("button");
        cancelButton.style.width = "50px";
        cancelButton.style.height = "30px";
        cancelButton.style.margin = "10px";
        cancelButton.style.backgroundColor = "#ff8787";
        cancelButton.textContent = "取消";

        saveButton.addEventListener("click", () => advanceSettingSaveFunction(document.getElementById("forceModeStatus").checked));
        cancelButton.addEventListener("click", () => removeElement("advanceSettingUI"));

        contentDiv.appendChild(contentText);
        contentDiv.appendChild(forceModeCheckbox);
        contentDiv.appendChild(saveButton);
        contentDiv.appendChild(cancelButton);
    }

    function advanceSettingSaveFunction(status)
    {
        GM_setValue("forceMode", status);
        removeElement("advanceSettingUI");
        window.location.reload();
    }

    function removeElement(elementID)
    {
        let element = document.getElementById(elementID);
        if(element)
        {
            let parentElement = element.parentNode;
            parentElement.removeChild(element);
        }
    }
})();