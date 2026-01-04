// ==UserScript==
// @name         Boothの購入履歴から累計散財額を計算するツール
// @version      3.0.3
// @description  お手軽鬱ボタン。Boothの購入履歴の総額を計算できます。
// @namespace    https://x.com/zerukuVRC
// @author       zeruku
// @match        https://accounts.booth.pm/orders
// @match        https://accounts.booth.pm/orders?*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479322/Booth%E3%81%AE%E8%B3%BC%E5%85%A5%E5%B1%A5%E6%AD%B4%E3%81%8B%E3%82%89%E7%B4%AF%E8%A8%88%E6%95%A3%E8%B2%A1%E9%A1%8D%E3%82%92%E8%A8%88%E7%AE%97%E3%81%99%E3%82%8B%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/479322/Booth%E3%81%AE%E8%B3%BC%E5%85%A5%E5%B1%A5%E6%AD%B4%E3%81%8B%E3%82%89%E7%B4%AF%E8%A8%88%E6%95%A3%E8%B2%A1%E9%A1%8D%E3%82%92%E8%A8%88%E7%AE%97%E3%81%99%E3%82%8B%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function () {
    // Price Comparison List (moved for easier maintenance)
    const PRICE_COMPARISONS = [
        [114381200000000, "日本の国家予算をまかなえていました！"],
        [23760000000000, "イーロン・マスクよりお金持ちでした！"],
        [9000000000000, "映画「シン・ゴジラ」の被害額を一人で賠償できました！"],
        [1652283360000, "Google社の時価総額を超えていました！"],
        [1510160000000, "Discordを買収できていたかもしれません！"],
        [
            639000000000,
            "映画「名探偵コナン 紺青の拳」の被害額を一人で賠償できました！",
        ],
        [395000000000, "イージス艦を一隻買えました！"],
        [90804000000, "マインクラフトの金ブロック1個が買えました！"],
        [1250000000, "VRChatの推定時価総額を超えていました！"],
        [1208280000, "GTA5のバイク「オプレッサー MkⅡ」を1台買えました！"],
        [332277000, "GTA5の潜水艦「コサトカ」を1艇買えました！"],
        [143600000, "首都圏の新築マンション1戸が買えました！"],
        [53200000, "USJの夜間貸し切りが出来ました！"],
        [8920000, "新車のベルファイアが買えました！"],
        [7336000, "エンジニアの平均年収を超えていました！"],
        [6116279, "コンビニ1軒の全商品を購入できていました！"],
        [5000000, "クロマグロ1尾が買えました！"],
        [4610000, "サラリーマンの平均年収を超えていました！"],
        [3214800, "東京大学理Ⅲの1年の学費をまかなえていました！"],
        [2750000, "新型プリウスの新車が買えました！"],
        [2361000, "40人規模の結婚式を挙げられました！相手は付属しません"],
        [1548000, "中古車1台が買えました！"],
        [1500000, "ゲーセンのmaimai筐体が買えました！"],
        [1386000, "GeeScorpion(超高級ゲーミングチェア)が買えました！"],
        [1180872, "ペッパーくんが一人買えました！"],
        [1111400, "大学生の1年の生活費をまかなえていました！"],
        [1000000, "ゲーセンの太鼓の達人の新筐体が買えました！"],
        [940000, "ゲーセンにあるポップンミュージックの旧筐体が買えました！"],
        [917540, "鹿児島駅前から札幌駅前までタクシーで移動できました！"],
        [800000, "ゲーセンのダンエボの筐体が買えました！"],
        [770000, "Valorantの全スキンが買えました！"],
        [650000, "ゲーセンのProject Divaの筐体が買えました！"],
        [588450, "超ハイスペックゲーミングパソコンが1台買えました！"],
        [540000, "公園にある4人乗りブランコが買えました！"],
        [493450, "大阪駅前から青森駅までタクシーで移動できました！"],
        [460000, "公園にあるジャングルジムが買えました！"],
        [
            400000,
            "Valve Index VRフルキット + ハイスペックゲーミングパソコンが買えました！",
        ],
        [359777, "Nvidia Quadro RTX 5000が買えました！"],
        [319800, "Nvidia RTX 4090が買えました！"],
        [310000, "公園にある2人乗りブランコが買えました！"],
        [280000, "公園にあるうんていが買えました！"],
        [250000, "4泊6日ハワイ旅行ができました！"],
        [219800, "iPhone 15 Pro Max 512GBが買えました！"],
        [198000, "iMacを1台買えました！"],
        [165980, "Valve Index VRフルキットが買えました！"],
        [159800, "iPhone 15 Pro 128GBが買えました！"],
        [150000, "公園にある鉄棒が1欄買えました！"],
        [149000, "キングサイズのベッドが買えました！"],
        [147000, "このツールの作者の貯金額以上でした......"],
        [139800, "iPhone 15 Plusが買えました！"],
        [124800, "iPad Pro 11インチが買えました！"],
        [104000, "東京都の平均家賃1ヶ月分をまかなえました！"],
        [96800, "Meta Quest 3 512GBが買えました！"],
        [82800, "Valve Index HMDが買えました！"],
        [74800, "Meta Quest 3 128GBが買えました！"],
        [53900, "Meta Quest 2 256GBが買えました！"],
        [49000, "PICO 4が買えました！"],
        [47300, "Meta Quest 2 128GBが買えました！"],
        [38410, "一人暮らしの一ヶ月の食費がまかなえました！"],
        [32890, "Yogibo Maxが買えました！"],
        [17490, "ジェラピケのパジャマが買えました！"],
        [9100, "カイジの月給を超えていました！"],
        [7900, "ディズニーランドで1日遊べていました！"],
        [5368, "焼肉食べ放題に行けました！"],
        [4748, "モンエナ355mlが24本買えました！"],
        [3905, "ストゼロ500mlが24本買えました！"],
        [1999, "ダイの大冒険が買えました！"],
        [1500, "VRChat Plusに1ヶ月加入できました！"],
        [1280, "YouTube Premiumに1ヶ月加入できました！"],
        [700, "スタバのフラペチーノが飲めました！"],
        [300, "ファミマのアイスコーヒーLサイズが飲めました！"],
        [220, "ファミチキが1個買えました！"],
        [100, "ボールペンが1本買えました！"],
        [20, "もやしが1袋買えました！"],
        [3, "レジ袋Mサイズ1枚しか買えませんでした......"],
    ];

    // Helper for consistent Yen formatting
    function formatYen(amount) {
        return `${Number(amount).toLocaleString()}円`;
    }

    // Constants
    const STYLES = {
        FIXED_BUTTON: {
            color: "#ffffff",
            borderRadius: "20px",
            padding: "10px 15px",
            border: "none",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            position: "fixed",
            zIndex: "1000",
        },
        COLORS: {
            PRIMARY: "#fc4d50",
            PRIMARY_HOVER: "#ff6669",
            AUTO: "#1b7f8c",
            AUTO_HOVER: "#22a1b2",
            AUTO_STOP: "#f30f4c",
            AUTO_STOP_HOVER: "#c00b3c",
            RESET: "#0077B5",
            RESET_HOVER: "#005588",
            TWEET: "#1DA1F2",
            TWEET_HOVER: "#1A91DA",
        },
    };

    // URL Parameter Management
    class URLManager {
        constructor() {
            this.url = new URL(window.location.href);
            this.initializeParams();
        }

        initializeParams() {
            const params = [
                ["total", "0"],
                ["auto", this.url.searchParams.get("auto") === "1" ? "1" : "0"],
                ["page", this.url.searchParams.get("page") || "1"],
            ];

            let changed = false;
            params.forEach(([key, defaultValue]) => {
                if (this.url.searchParams.get(key) === null) {
                    this.url.searchParams.set(key, defaultValue);
                    changed = true;
                }
            });

            if (changed) {
                window.location.href = this.url.href;
            }
        }

        static processNextPage(url) {
            const parsedURL = new URL(url);
            const currentPage = parseInt(
                parsedURL.searchParams.get("page"),
                10
            );
            parsedURL.searchParams.set("page", (currentPage + 1).toString());
            window.location.href = parsedURL.href;
        }

        static resetToFirstPage() {
            const parsedURL = new URL(window.location.href);
            parsedURL.searchParams.set("page", "1");
            parsedURL.searchParams.set("auto", "0");
            window.location.href = parsedURL.href;
        }
    }

    // Item Exclusion Management
    class ExclusionManager {
        static updateExclusionList(itemId, isAdding) {
            const currentValue = GM_getValue("exclude_item_ids") || "";
            if (isAdding) {
                GM_setValue("exclude_item_ids", currentValue + ` ${itemId}`);
            } else {
                GM_setValue(
                    "exclude_item_ids",
                    currentValue.replace(` ${itemId}`, "")
                );
            }
        }

        static setupExclusionButtons() {
            const itemElements = Array.from(
                document.getElementsByClassName("l-orders-index")[0].children
            );

            itemElements.forEach((item, index) => {
                if (item.classList[0] == "pager") {
                    return;
                }
                const button = this.createExcludeButton(item, index);
                item.firstChild.appendChild(button);
            });

            this.setupKeyboardShortcuts();
        }

        static createExcludeButton(item, index) {
            const button = document.createElement("button");
            const itemId = item.href.match(/\d+$/g)[0];
            const isExcluded = String(GM_getValue("exclude_item_ids")).includes(
                itemId
            );

            button.id = `excludeButton${index}`;
            Object.assign(button.style, {
                marginLeft: "8px",
                color: "#ffffff",
                border: "none",
                fontSize: "10px",
                padding: "6px",
                background: isExcluded ? "#e1362e" : "#808080",
            });

            button.textContent = isExcluded ? "除外解除" : "除外する";
            button.className = isExcluded ? "ex_true" : "ex_false";

            button.addEventListener("click", (event) => {
                event.preventDefault(); // デフォルトの動作を防ぐ
                event.stopPropagation(); // イベントの伝播を停止
                this.handleExcludeClick(event, index, item);
            });

            return button;
        }

        static setupKeyboardShortcuts() {
            const keysPressed = {};

            document.addEventListener("keydown", (event) => {
                keysPressed[event.key] = true;

                if (
                    keysPressed["Shift"] &&
                    keysPressed["E"] &&
                    keysPressed["L"]
                ) {
                    if (confirm("除外設定を全てリセットしますか？")) {
                        GM_setValue("exclude_item_ids", "");
                        window.location.reload();
                    }
                    Object.keys(keysPressed).forEach(
                        (key) => (keysPressed[key] = false)
                    );
                }
            });

            document.addEventListener("keyup", (event) => {
                keysPressed[event.key] = false;
            });
        }

        static handleExcludeClick(event, index, item) {
            const button = document.querySelector(`#excludeButton${index}`);
            // itemId の取得方法を修正
            const itemId = item.href.match(/\d+$/g)[0]; // 直接 item から取得

            if (event.ctrlKey) {
                this.toggleAllExclusions();
            } else {
                this.toggleSingleExclusion(button, itemId);
            }
        }

        static unifiedState = true; // クラス変数として定義

        static toggleAllExclusions() {
            const allButtons = document.querySelectorAll(
                '[id^="excludeButton"]'
            );
            const newState = !this.unifiedState;
            this.unifiedState = newState;

            allButtons.forEach((button) => {
                const itemId =
                    button.parentElement.parentElement.href.match(/\d+$/g)[0];
                button.style.background = newState ? "#e1362e" : "#808080";
                button.textContent = newState ? "除外解除" : "除外する";
                button.className = newState ? "ex_true" : "ex_false";
                this.updateExclusionList(itemId, newState);
            });
        }
        // (重複・冗長な toggleSingleExclusion, updateExclusionList メソッドを削除)

        static toggleSingleExclusion(button, itemId) {
            const isExcluded = button.className === "ex_false";
            button.style.background = isExcluded ? "#e1362e" : "#808080";
            button.textContent = isExcluded ? "除外解除" : "除外する";
            button.className = isExcluded ? "ex_true" : "ex_false";
            this.updateExclusionList(itemId, isExcluded);
        }
    }

    // Item Management
    class ItemManager {
        static collectItemInfo(itemElement) {
            // itemElementが商品アイテムとして適切な構造を持っているか確認
            if (!itemElement.href || !itemElement.firstChild) {
                // Skipping invalid item element
                return null;
            }

            const url = itemElement.href;
            const itemId = url.match(/\d+$/g)[0];

            if (
                String(GM_getValue("exclude_item_ids")).indexOf(itemId) !== -1
            ) {
                // Excluded item
                return "exclude";
            }

            const itemVariation = (itemElement
                .getElementsByClassName("u-tpg-caption1")[0]
                .innerText.match(/\(([^)]+)\)[^\(]*$/) || [null, null])[1];
            const orderId = Number(itemElement.href.match(/\d+$/)[0]);

            return {
                item_id: itemId,
                item_variation: itemVariation
                    ? itemVariation.replace(/^\(/, "").replace(/\)$/, "")
                    : null,
                order_id: orderId,
            };
        }

        static async fetchItemPrice(orderId) {
            try {
                const response = await fetch(
                    `https://accounts.booth.pm/orders/${orderId}`,
                    {
                        credentials: "include",
                        headers: { Accept: "text/html" },
                    }
                );

                if (response.status === 404) {
                    return "Item deleted or private";
                }

                const text = await response.text();
                const matched = text.match(/お支払金額.*?¥\s*([\d,]+)/);
                const isGift = text.includes(
                    '<b class="u-tpg-title3">ギフト</b>'
                );
                return matched
                    ? {
                          item_price: Number(matched[1].replace(/,/g, "")),
                          is_gift: isGift,
                      }
                    : { item_price: undefined, is_gift: false };
            } catch (error) {
                throw new Error(`Request error: ${error.message}`);
            }
        }
    }

    // Price Comparison
    class PriceComparator {
        static typicalPrice(totalPrice) {
            const numericPrice = Number(totalPrice);
            for (const [threshold, message] of PRICE_COMPARISONS) {
                if (numericPrice >= threshold) return message;
            }
            return "何も買えませんでした。";
        }
    }

    // UI Components
    class UIComponents {
        static createButton(text, options) {
            const button = document.createElement("button");
            button.innerText = text;
            Object.assign(button.style, STYLES.FIXED_BUTTON, options.style);
            button.addEventListener(
                "mouseover",
                () => (button.style.background = options.hoverColor)
            );
            button.addEventListener(
                "mouseout",
                () => (button.style.background = options.baseColor)
            );
            button.onclick = options.onClick;
            document.body.appendChild(button);
            return button;
        }

        static calculateButton = null;

        static addCalculateButton() {
            this.calculateButton = this.createButton("ページ計算", {
                style: {
                    background: STYLES.COLORS.PRIMARY,
                    bottom: "10px",
                    left: "10px",
                },
                baseColor: STYLES.COLORS.PRIMARY,
                hoverColor: STYLES.COLORS.PRIMARY_HOVER,
                onClick: main,
            });
            this.calculateButton.classList.add("booth-total-price-button");
            return this.calculateButton;
        }

        static addAutoButton(autoCalculate) {
            return this.createButton(
                autoCalculate ? "自動計算停止" : "全ページ計算",
                {
                    style: {
                        background: autoCalculate
                            ? STYLES.COLORS.AUTO_STOP
                            : STYLES.COLORS.AUTO,
                        bottom: "10px",
                        left: "140px",
                    },
                    baseColor: autoCalculate
                        ? STYLES.COLORS.AUTO_STOP
                        : STYLES.COLORS.AUTO,
                    hoverColor: autoCalculate
                        ? STYLES.COLORS.AUTO_STOP_HOVER
                        : STYLES.COLORS.AUTO_HOVER,
                    onClick: autoCalculate ? this.stopAuto : this.startAuto,
                }
            );
        }

        static addResetButton() {
            return this.createButton("累計金額をリセット", {
                style: {
                    background: STYLES.COLORS.RESET,
                    bottom: "10px",
                    left: "280px",
                },
                baseColor: STYLES.COLORS.RESET,
                hoverColor: STYLES.COLORS.RESET_HOVER,
                onClick: this.resetTotal,
            });
        }

        static addTweetButton(totalPrice, giftTotal) {
            return this.createButton("Twitterに共有", {
                style: {
                    background: STYLES.COLORS.TWEET,
                    bottom: "60px",
                    left: "280px",
                },
                baseColor: STYLES.COLORS.TWEET,
                hoverColor: STYLES.COLORS.TWEET_HOVER,
                onClick: () => this.handleTweet(totalPrice, giftTotal),
            });
        }
        static addTotalPriceDisplay(totalPrice, giftTotal) {
            const display = document.createElement("div");
            Object.assign(display.style, {
                position: "fixed",
                bottom: "60px",
                left: "10px",
                backgroundColor: "#333",
                color: "#fff",
                padding: "6px 18px",
                borderRadius: "20px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                border: "none",
                zIndex: "1000",
                cursor: "pointer",
            });

            display.textContent = `合計金額: ${formatYen(totalPrice)}`;
            if (giftTotal && !isNaN(giftTotal)) {
                display.title = `内ギフト合計: ${formatYen(giftTotal)}`;
            }

            display.addEventListener(
                "mouseover",
                () => (display.style.background = "#444")
            );
            display.addEventListener(
                "mouseout",
                () => (display.style.background = "#333")
            );
            display.onclick = () => this.handleTotalPriceClick(giftTotal);

            document.body.appendChild(display);
        }

        static handleTweet(totalPrice, giftTotal) {
            const comparison = PriceComparator.typicalPrice(totalPrice);
            const includeComparison = confirm(
                `以下のメッセージを含めますか？\n\nもし${formatYen(
                    totalPrice
                )}あれば...\n『${comparison}』\n\nOKを押すと、この文章を入れてツイートします。`
            );

            let tweetText = `私がBoothで使用した合計金額は、『${formatYen(
                totalPrice
            )}』でした！`;
            if (giftTotal > 0) {
                tweetText += `（内ギフト合計: ${formatYen(giftTotal)}）`;
            }
            if (includeComparison) {
                tweetText += `\n\nもし${formatYen(
                    totalPrice
                )}あれば...\n『${comparison}』`;
            }

            tweetText += `\n\n#私がBoothに使った金額`;

            const tweetURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                tweetText
            )}`;
            window.open(tweetURL, "_blank");
        }

        static handleTotalPriceClick(giftTotal) {
            alert(`合計金額の内、ギフト合計は ${formatYen(giftTotal)} です`);
        }
        static startAuto() {
            const url = new URL(window.location.href);
            url.searchParams.set("auto", "1");
            url.searchParams.set("page", "1");
            window.location.href = url.href;
        }

        static stopAuto() {
            const url = new URL(window.location.href);
            url.searchParams.set("auto", "0");
            window.location.href = url.href;
        }

        static resetTotal() {
            const url = new URL(window.location.href);
            url.searchParams.set("total", "0");
            url.searchParams.set("gift_total", "0");
            url.searchParams.set("auto", "0");

            if (confirm("累計金額をリセットしますか？")) {
                window.location.href = url.href;
            }
        }
    }

    // Progress Display
    class ProgressDisplay {
        constructor() {
            this.element = document.createElement("div");
            Object.assign(this.element.style, {
                position: "fixed",
                bottom: "100px",
                left: "10px",
                color: "#fc4d50",
                zIndex: "1000",
            });
            document.body.appendChild(this.element);
        }

        update(completed, total) {
            this.element.textContent = `進行中: ${completed}/${total}`;
        }

        clear() {
            this.element.textContent = "";
        }
    }

    // Main calculation logic
    async function main() {
        const url = new URL(window.location.href);
        const button = UIComponents.calculateButton;
        if (button) {
            button.disabled = true;
            button.style.cursor = "wait";
        }

        const itemListElements = Array.from(
            document.getElementsByClassName("l-orders-index")[0].children
        );
        itemListElements.pop();
        let itemList = itemListElements.map(ItemManager.collectItemInfo);
        console.log("Collected item list:", itemList);

        if (itemList.every((v) => v === "exclude") && itemList.length !== 0) {
            URLManager.processNextPage(window.location.href);
            return;
        } else if (itemList.length === 0) {
            alert("計算が終了しました");
            URLManager.resetToFirstPage();
            return;
        }

        itemList = itemList.filter((element) => element !== "exclude");
        console.log("Filtered item list:", itemList);

        const priceList = [];
        let giftTotal = [];
        const progress = new ProgressDisplay();
        const totalItems = itemList.length;
        let completedItems = 0;

        progress.update(completedItems, totalItems);

        for (const itemInfo of itemList) {
            try {
                const itemPrice = await ItemManager.fetchItemPrice(
                    itemInfo.order_id
                );
                console.log("Fetched price:", itemPrice);
                if (itemPrice.item_price) {
                    priceList.push(itemPrice.item_price);
                    if (itemPrice.is_gift) {
                        giftTotal.push(itemPrice.item_price);
                    }
                }
            } catch (error) {
                console.error(error);
            }
            completedItems++;
            progress.update(completedItems, totalItems);
            await new Promise((resolve) => setTimeout(resolve, 150));
        }

        const totalPrice = priceList.reduce((a, b) => a + b, 0);
        const giftTotalPrice = giftTotal.reduce((a, b) => a + b, 0);
        console.log("Total price:", totalPrice, "Gift total:", giftTotalPrice);
        const existingTotal = parseFloat(url.searchParams.get("total")) || 0;
        const existingGiftTotal =
            parseFloat(url.searchParams.get("gift_total")) || 0;
        const newTotal = existingTotal + totalPrice;
        const newGiftTotal = existingGiftTotal + giftTotalPrice;

        url.searchParams.set("total", newTotal);
        url.searchParams.set("gift_total", newGiftTotal);

        console.log("Returning totals");
        if (!autoCalculate) {
            alert(
                `このページの合計金額: ${formatYen(
                    totalPrice
                )}\n今までの合計金額: ${formatYen(newTotal)}`
            );
            window.location.href = url.href;
            progress.clear();
            button.disabled = true;
            button.textContent = "計算済み";
        } else {
            URLManager.processNextPage(url);
        }
        return { totalPrice: newTotal, giftTotal };
    }

    // Initialize
    const urlManager = new URLManager();
    const autoCalculate = urlManager.url.searchParams.get("auto") === "1";
    const totalPrice = urlManager.url.searchParams.get("total");
    const totalGiftPrice = urlManager.url.searchParams.get("gift_total");

    ExclusionManager.setupExclusionButtons();
    UIComponents.addCalculateButton();
    UIComponents.addAutoButton(autoCalculate);
    UIComponents.addResetButton();
    UIComponents.addTweetButton(totalPrice, totalGiftPrice);
    UIComponents.addTotalPriceDisplay(totalPrice, totalGiftPrice);

    if (autoCalculate) {
        (async () => {
            const { totalPrice, totalGiftPrice } = await main();
            UIComponents.addTweetButton(totalPrice, totalGiftPrice);
            UIComponents.addTotalPriceDisplay(totalPrice, totalGiftPrice);
        })();
    }
})();
