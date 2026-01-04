// ==UserScript==
// @name         Telegram 繁體中文化 UI ( 網頁版 )
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  將 Telegram Web UI 介面翻譯成繁體中文（ 包含更多設定選單 ）
// @author       小安
// @match        https://web.telegram.org/*
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536753/Telegram%20%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%E5%8C%96%20UI%20%28%20%E7%B6%B2%E9%A0%81%E7%89%88%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536753/Telegram%20%E7%B9%81%E9%AB%94%E4%B8%AD%E6%96%87%E5%8C%96%20UI%20%28%20%E7%B6%B2%E9%A0%81%E7%89%88%20%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const translationMap = {
        // 設定
        "All": "全部",
        "Add Account": "新增帳戶",
        "Saved Messages": "我的收藏",
        "Contacts": "聯絡人",
        "My Stories": "我的故事",
        "Settings": "設定",
        "Night Mode": "夜間模式",
        "Animations": "動畫",
        "New Group": "新增群組",
        "Telegram Features": "電報功能",
        "Report a Bug": "報告錯誤",
        "Switch to K Version": "切換到K版本",
        "Install App": "安裝應用程式",
        "Iast seen minute ago": "上次上線時間",
        "online": "在線",
        "Phone": "電話",
        "Username": "用戶名稱",
        "Bio": "個人簡介",
        "Date of Birth": "出生日期",
        "Invite Friends": "邀請朋友",
        "Log Out": "登出",
        "Search": "搜尋",
        "Edit profile": "編輯個人資料",
        // 聊天
        "Message": "聊天",
        "Silent Broadcast": "無聲廣播",
        "Photo or Video": "照片或影片",
        "File": "文件",
        "select messages": "選擇訊息",
        "send a Gift": "送禮物",
        "Delete chat": "刪除聊天",
        "Shared Media": "共享媒體",
        "Channel Info": "頻道資訊",
        "Chats": "聊天",
        "Posts": "貼文",
        "Story Archive": "故事檔案",
        "Media": "媒體",
        "Files": "文件",
        "Links": "連結",
        "Music": "音樂",
        "Voice": "聲音",
        "Poll": "調查",
        "Pinned message": "置頂訊息",
        "Pinned message #": "置頂訊息 #",
        "": "",
        // 一般設定
        "General Settings": "一般設定",
        "General": "一般",
        "Message Font Size": "訊息字體大小",
        "Chat Wallpaper": "聊天壁紙",
        "Theme": "主題",
        "Light": "亮色",
        "Drak": "黑暗",
        "System": "預設",
        "Time format": "時間格式",
        "12-hour": "12小時",
        "24-hour": "24小時",
        "Keyboard": "鍵盤",
        "Send with Enter": "按 Enter 鍵發送",
        "Press Shift + Enter for new line": "按 Shift + Enter 換行",
        "Send with Ctrl+Enter": "使用 Ctrl+Enter 發送",
        "Press Enter for new line": "按 Enter 鍵換行",
        // 動畫與效能
        "Animations and Performance": "動畫與效能",
        "Animation Level": "動畫等級",
        "Choose the desired animations amount.": "選擇所需的動畫數量。",
        "Power Saving": "節能",
        "Nice and Fast": "又好又快",
        "Lots of Stuff": "很多東西",
        "Custom": "自訂",
        "Resource-Intensive Processes": "資源密集型流程",
        "Interface Animations": "介面動畫",
        "Page Transitions": "頁面轉換",
        "Message Sending Animation": "訊息發送動畫",
        "Media Viewer Animations": "媒體檢視器動畫",
        "Message Composer Animations": "訊息編輯器動畫",
        "Context Menu Animation": "內容選單動畫",
        "Context Menu Blur": "內容選單模糊",
        "Right Column Animation": "右欄動畫",
        "Dust-effect deletion": "除塵效果",
        "Stickers and Emoji": "貼圖與表情符號",
        "Allow Animated Emoji": "允許動畫表情符號",
        "Loop Animated Stickers": "循環動畫貼紙",
        "Reaction Effects": "反應效果",
        "Sticker Effects": "貼紙效果",
        "Media Autoplay": "媒體自動播放",
        "Autoplay GIFs": "自動播放 GIF",
        "Autoplay Videos": "自動播放視頻",
        // 通知
        "Notifications": "通知",
        "Web Notifications": "網路通知",
        "Disabled": "已停用",
        "Offline Notifications": "離線通知",
        "Not supported": "不支援",
        "Sound volume": "音量",
        "Private Chats": "私人聊天",
        "Notifications for private chats": "私人聊天通知",
        "Message Preview": "訊息預覽",
        "Groups": "群組",
        "Notifications for groups": "群組通知",
        "Channels": "頻道",
        "Notifications for channels": "頻道通知",
        "Other": "其他",
        "Contact joined Telegram": "聯絡加入 Telegram",
        // 數據與儲存空間
        "Data and Storage": "數據與儲存空間",
        "Auto-download photos": "自動下載照片",
        "Auto-download videos and GIFs": "自動下載影片和 GIF",
        "Auto-download files": "自動下載文件",
        "Contacts": "聯絡方式",
        "Other Private Chats": "其他私人聊天",
        "Group Chats": "群組聊天",
        "Channels": "頻道",
        "Maximum file size": "最大檔案大小",
        "up to 1 MB": "最多 1 MB",
        "up to 5 MB": "最多 5 MB",
        "up to 10 MB": "最多 10 MB",
        "up to 50 MB": "最多 50 MB",
        "up to 100 MB": "最多 100 MB",
        "up to 500 MB": "最多 500 MB",
        // 隱私與安全
        "Privacy and Security": "隱私與安全",
        "Blocked Users": "已封鎖用戶",
        "Passcode Lock": "密碼鎖",
        "Two-Step Verification": "兩步驟驗證",
        "On": "打開",
        "Off": "關閉",
        "Privacy": "隱私",
        "Who can see my phone number?": "誰可以看到我的電話號碼？",
        "": "",
        "Who can see my last seen time?": "誰可以看到我上次上線的時間？",
        "": "",
        "Who can see my profile photos?": "誰可以看到我的個人資料照片？",
        "": "",
        "Bio": "履歷",
        "": "",
        "Date of Birth": "出生日期",
        "": "",
        "Gifts": "禮物",
        "": "",
        "Who can add a link to my account when forwarding my messages?": "誰可以在轉發我的訊息時添加指向我帳戶的連結？",
        "": "",
        "Who can call me?": "誰可以打電話給我？",
        "": "",
        "Who can send me voice or video messages?": "誰可以給我發送語音或視訊訊息？",
        "": "",
        "Who can send me messages?": "誰可以傳訊息給我？",
        "": "",
        "Who can add me to group chats?": "誰可以加我到群組聊天？",
        "": "",
        "Sensitive content": "敏感內容",
        "Show 18+ Content": "顯示 18+ 內容",
        "Do not hide media that contains content suitable only for adults.": "不要隱藏包含僅適合成人觀看的內容的媒體。",
        "Window title bar": "視窗標題列",
        "Show chat name": "顯示聊天名稱",
        // 聊天分類
        "Chat Folders": "聊天分類",
        "Create folders for different groups of chats and quickly switch between them.": "為不同的聊天群組建立資料夾並在它們之間快速切換。",
        "Create New Folder": "建立新資料夾",
        "All Chats": "所有聊天",
        "All unarchived chats": "所有未存檔的聊天記錄",
        "Recommended Folders": "推薦資料夾",
        "Unread": "未讀",
        "New messages from all chats.": "所有聊天的新訊息。",
        "Personal": "個人",
        "Only messages from personal chats.": "僅限來自私人聊天的訊息。",
        "Add": "添加",
        // 活動中的裝置
        "Active Sessions": "活動中的裝置",
        "Devices": "裝置",
        "THIS DEVICE": "此裝置",
        "Active sessions": "活動中的工作階段",
        "Automatically terminate old sessions": "自動終止舊工作階段",
        "If inactive for": "如果處於非活動狀態",
        // 語言
        "Language": "語言",
        "Show Translate Button": "顯示翻譯按鈕",
        "Translate Entire Chats": "翻譯整個聊天內容",
        "Do Not Translate": "請勿翻譯",
        "The 'Translate' button will appear in the context menu of messages containing text.": "「翻譯」按鈕將出現在包含文字的訊息的上下文功能表中。",
        "Interface Language": "介面語言",
        // 貼圖與表情符號
        "Stickers and Emoji": "貼圖與表情符號",
        "Telegram Premium": "Telegram 進階版",
        "My Stars": "我的星星",
        "Send a Gift": "送禮物",
        "Ask a Question": "提問",
        "Telegram FAQ": "電報常見問題解答",
        "Privacy Policy": "隱私權政策"

    };

    function translateTextNodes() {
        const xpath = "//text()[normalize-space(.) != '']";
        const textNodes = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < textNodes.snapshotLength; i++) {
            const node = textNodes.snapshotItem(i);
            const originalText = node.nodeValue.trim();
            if (translationMap[originalText]) {
                node.nodeValue = translationMap[originalText];
            }
        }
    }

    function observerCallback() {
        translateTextNodes();
    }

    const observer = new MutationObserver(observerCallback);
    observer.observe(document.body, { childList: true, subtree: true });

    translateTextNodes();
})();
