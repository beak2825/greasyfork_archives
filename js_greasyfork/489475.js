    // ==UserScript==
    // @name         Twitter (X) フォロワー整理お助けツール
    // @namespace    mamidori
    // @version      1.11
    // @description  Twitter (X) のフォロワー欄で、フォロワーをハイライト表示したりできます。
    // @author       mamidori
    // @match        https://twitter.com/*
    // @grant        none
    // @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/489475/Twitter%20%28X%29%20%E3%83%95%E3%82%A9%E3%83%AD%E3%83%AF%E3%83%BC%E6%95%B4%E7%90%86%E3%81%8A%E5%8A%A9%E3%81%91%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/489475/Twitter%20%28X%29%20%E3%83%95%E3%82%A9%E3%83%AD%E3%83%AF%E3%83%BC%E6%95%B4%E7%90%86%E3%81%8A%E5%8A%A9%E3%81%91%E3%83%84%E3%83%BC%E3%83%AB.meta.js
    // ==/UserScript==

    (function () {
        "use strict";

        let isHiding = false;
        let isFFHiding = false;
        let isSpamHighlighting = false;
        let isCreaterHighlighting = false;

        // ボタンのスタイル
        function createStyledButton(text, clickHandler) {
        const button = document.createElement("button");
        button.textContent = text;

        // 共通スタイル
        Object.assign(button.style, {
        border: "none",
        borderRadius: "5px",
        padding: "10px 20px",
        marginTop: "10px",
        cursor: "pointer",
        transition: "filter 0.3s, transform 0.3s",
        });

        button.addEventListener("mouseover", () => {
        Object.assign(button.style, {
            filter: "brightness(1.25)",
            transform: "scale(1.05)",
        });
        });

        button.addEventListener("mouseout", () => {
        Object.assign(button.style, {
            filter: "brightness(1)",
            transform: "scale(1)",
        });
        });

        button.addEventListener("click", clickHandler);
        return button;
        }

        function handleHideButtonClick() {
        isHiding = !isHiding;
        hideButton.textContent = isHiding ? "片思い: ON" : "片思い: OFF";
        hideButton.style.backgroundColor = isHiding ? "skyblue" : "gray";
        updateDOM();
        }

        function handleFFHideButtonClick() {
            isFFHiding = !isFFHiding;
            FFhideButton.textContent = isFFHiding ? "片思われ: OFF" : "片思われ: ON";
            FFhideButton.style.backgroundColor = isFFHiding ? "skyblue" : "gray";
            updateDOM();
        }


        function handlespamHighlightButtonClick() {
            isSpamHighlighting = !isSpamHighlighting;
            spamHighlightButton.textContent = isSpamHighlighting
            ? "スパムの疑い: ON"
            : "スパムの疑い: OFF";
            spamHighlightButton.style.backgroundColor = isSpamHighlighting ? "red" : "gray";
            updateDOM();
        }

        function handleCreaterHighlightButtonClick() {
            isCreaterHighlighting = ! isCreaterHighlighting;
            createrHighlightButton.textContent = isCreaterHighlighting
            ? "クリエイターっぽい: ON"
            : "クリエイターっぽい: OFF";
            createrHighlightButton.style.backgroundColor = isCreaterHighlighting ? "green" : "gray";
            updateDOM();
        }

        const hideButton = createStyledButton(
        "片思い: OFF",
        handleHideButtonClick
        );
        hideButton.style.backgroundColor = "gray";

        const FFhideButton = createStyledButton(
        "片思われ: ON",
        handleFFHideButtonClick
        );
        FFhideButton.style.backgroundColor = "gray";

        const spamHighlightButton = createStyledButton(
        "スパムの疑い: OFF",
        handlespamHighlightButtonClick
        );
        spamHighlightButton.style.backgroundColor = "gray";

        const createrHighlightButton = createStyledButton(
        "クリエイターっぽい: OFF",
        handleCreaterHighlightButtonClick
        );
        createrHighlightButton.style.backgroundColor = "gray";

        // ボタン配置初期化
        function initializeButtons() {
        const targetNavElement = document.querySelector(
        '[data-testid="SideNav_NewTweet_Button"]'
        );
        if (targetNavElement) {
        const parentNavElement = targetNavElement.parentNode;
        if (parentNavElement && !hideButton.parentNode) {
            parentNavElement.appendChild(hideButton);
            parentNavElement.appendChild(FFhideButton);
            parentNavElement.appendChild(spamHighlightButton);
            parentNavElement.appendChild(createrHighlightButton);
        }
        }
        }

        function updateUserCellVisibility(node) {
        if (
        node.textContent.includes("フォローされています")
        ) {
        node.style.display = isHiding ? "none" : "";
        }
        }

        function updateFFUserCellVisibility(node) {
            if (
            node.textContent.includes("フォロー中")
            ) {
            node.style.display = isFFHiding ? "none" : "";
            }
        }

        // userFollowIndicatorの表示の更新
        function updateSpamIndicator(node) {
            var pattern = /.*?@\w*?[0-9]{5}\b/
            if (
                node.textContent.match(pattern)!=null
            ) {
            if (isSpamHighlighting) {
                node.style.backgroundColor = "red";
            } else {
                node.style.backgroundColor = "";
            }
            }
        }

        function updateCreaterUserCellVisibility(node) {
            var text = node.textContent.toLowerCase();
            if (
            text.includes("pixiv") || text.includes("fanbox") || text.includes("fantia") || text.includes("dlsite")|| text.includes("skeb")|| text.includes("nico")|| text.includes("ci-en")
            || text.includes("odaibako")|| text.includes("artist")|| text.includes("illust")|| text.includes("youtube")
            ) {
                if (isCreaterHighlighting) {
                    node.style.backgroundColor = "green";
                } else {
                    node.style.backgroundColor = "";
                }
            }
        }

        // DOMのアップデート
        function updateDOM(mutationsList = []) {
            var url = window.location.href;
        const userCells = document.querySelectorAll('div[data-testid="UserCell"]');
        if(url.match("followers") != null)
        {
            userCells.forEach(updateFFUserCellVisibility);
        }
        if(url.match("following") != null)
        {
            userCells.forEach(updateUserCellVisibility);
        }

        userCells.forEach(updateSpamIndicator);
        userCells.forEach(updateCreaterUserCellVisibility);

        for (let mutation of mutationsList) {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
            // SideNavへのボタン追加
            if (
                node.matches &&
                node.matches('[data-testid="SideNav_NewTweet_Button"]')
            ) {
                initializeButtons();
            }

            if (node.matches && node.matches('div[data-testid="UserCell"]')) {
                updateSpamIndicator(node);
                updateCreaterUserCellVisibility(node);
                if(url.match("followers") != null)
                {
                updateFFUserCellVisibility(node);
                }
                if(url.match("following") != null)
                {
                updateUserCellVisibility(node);
                }
            }

            });
        }
        }

        initializeButtons();
        }

        const observer = new MutationObserver(updateDOM);
        observer.observe(document.body, {
        childList: true,
        subtree: true,
        });

        initializeButtons();
        })();