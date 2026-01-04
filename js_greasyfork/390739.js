// ==UserScript==
// @name         Komica: Police China Terms
// @version      1.0.5
// @icon         https://i.imgur.com/ltLDPGc.jpg
// @description  Replace China Terms with Taiwan's.
// @author       Hayao-Gai
// @namespace	 https://github.com/HayaoGai
// @include      http://*.komica.org/*/*
// @include      https://*.komica.org/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390739/Komica%3A%20Police%20China%20Terms.user.js
// @updateURL https://update.greasyfork.org/scripts/390739/Komica%3A%20Police%20China%20Terms.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 文字反白開關
    const isHighlight = true;

    // 轉換規則：第一個是支那用語，第二個是台灣用語，兩個為一組
    const rules = [
        "給力", "夠力", "質量", "品質", "水平", "水準", "通關", "過關", "立馬", "馬上", "高清", "高畫質", "優化", "最佳化", "視頻", "影片", "音頻", "音檔", "屏蔽", "隱藏", "項目", "專案",
        "屏幕", "螢幕", "內存", "記憶體", "軟件", "軟體", "激活", "啟用", "信息", "訊息", "網絡", "網路", "雙擊", "連點兩下", "回車", "輸入", "服務器", "伺服器", "學霸", "很會讀書的人",
        "顏值", "外貌", "緩存", "快取", "加載", "讀取", "網民", "網友", "舉報", "檢舉", "硬盤", "硬碟", "U盤", "隨身碟", "卸載", "解除安裝", "妹子", "女生", "妹紙", "女生", "界面", "介面",
        "網紅", "網路名人", "攝像頭", "攝影機", "神馬", "什麼", "有木有", "有沒有", "估計", "大概", "鼠標", "游標", "高端", "高階", "低端", "低階", "塑料", "塑膠", "硅", "矽", "挺好的", "很好",
        "大陸", "支那", "內地", "支那", "牛逼", "厲害", "牛B", "厲害", "牛屄", "厲害", "流批", "厲害", "特牛", "特別厲害", "繁體", "正體", "繁中", "正體中文", "插件", "外掛", "程序", "程式",
        "刷新", "重新整理", "計算機", "電腦", "幼兒園", "幼稚園", "網遊", "網路遊戲", "手遊", "手機遊戲", "營銷", "行銷", "真心", "真的", "樓主", "原PO", "存儲", "儲存", "網盤", "網路空間",
        "互聯網", "網際網路", "花屏", "破圖", "聯繫", "聯絡", "激光", "雷射", "靠譜", "可靠", "網民", "網友", "智能", "智慧", "特好", "很好", "閨密", "好姊妹", "吃貨", "老饕", "打印", "列印",
        "衛生間", "洗手間", "衛生巾", "衛生棉", "微電影", "短片", "性價比", "成本效益比", "服務員", "服務生", "方便麵", "泡麵", "公交車", "公車", "貌似", "好像"
    ];

    window.onload = function() {
        const theme = document.getElementById("theme-selector") || [];
		setObserver(theme);
 		getQuote(theme);
 		if (isHighlight) addThemeListener(theme);
	}

    function getColor(theme) {
        // 按照綜合的佈景主題變更反白顏色
        // 預設：""
        // 夜間："dark.css"
        return !theme.value ? "yellow" : "red";
	}

    function setObserver(theme) {
        // 監聽展開
		const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		const config = { attributes: true, childList: true, characterData: true };
		const observer = new MutationObserver(function() {
            getQuote(theme);
        });
		const threads = document.querySelectorAll(".thread") || [];
        threads.forEach(function(thread) {
            observer.observe(thread, config);
        });
	}

    function getQuote(theme) {
        // 取得內文
        const color = getColor(theme);
		const quotes = document.querySelectorAll(".quote:not(.police)") || [];
        quotes.forEach(function(quote) {
            quote.classList.add("police");
            comparison(quote, isHighlight, color);
        });
	}

    function comparison(quote, isHighlight, color) {
        // 比對用語
		for (let i = 0; i < rules.length; i += 2) {
            if (quote.innerHTML.includes(rules[i])) {
                console.log(quote, rules[i], rules[i + 1]);
                const regexp = new RegExp(rules[i], "g");
                const replace = isHighlight ?
                      `<span class='highlight' oriString='${rules[i]}' style='background-color:${color}'>${rules[i + 1]}</span>` : rules[i + 1];
                quote.innerHTML = quote.innerHTML.replace(regexp, replace);
            }
        }
	}

    function addThemeListener(theme) {
        // 監聽佈景切換
		theme.addEventListener("change", function() {
            const terms = document.querySelectorAll(".highlight") || [];
            const color = getColor(this);
            setTimeout(function() {
                terms.forEach(function(term) {
                    term.style.backgroundColor = color;
                });
            }, 500);
        });
	}
})();