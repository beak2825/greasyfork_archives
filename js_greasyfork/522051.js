// ==UserScript==
// @name         Booth商品情報取得
// @namespace    booth.item.info
// @version      1.0.0
// @description  Boothページから商品タイトル、バリエーション名、商品IDを取得し、クリップボードにコピーして画像を処理します
// @author       八雲夜々（Nako）
// @match        https://booth.pm/*/items/*
// @match        *.booth.pm/items/*
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522051/Booth%E5%95%86%E5%93%81%E6%83%85%E5%A0%B1%E5%8F%96%E5%BE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/522051/Booth%E5%95%86%E5%93%81%E6%83%85%E5%A0%B1%E5%8F%96%E5%BE%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS改造
    const style = document.createElement('style');
    style.textContent = `
        body.popup-open {
            overflow: hidden;  /* popup作動時背景での操作を禁止 */
        }
        .overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            cursor: pointer;  /* クリック可能の指示 */
        }
        .overlay.show {
            display: block;
        }
        .popup {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 10000;
            min-width: 1200px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
        }
        .popup.show {
            display: block;
        }
        .popup h3 {
            margin-top: 0;
            margin-bottom: 15px;
            text-align: center;
            color: #333;
        }
        #price-buttons, #image-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
        }
        .popup button {
            width: 100%;
            margin: 0;
            padding: 12px 15px;
            border: none;
            border-radius: 5px;
            background: #6c5ce7;
            color: white;
            cursor: pointer;
            text-align: center;
            font-size: 14px;
            transition: background 0.3s ease;
        }
        .popup button:hover {
            background: #8075e5;
        }
        .image-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 15px;
            margin-top: 10px;
        }
        .image-option {
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 5px;
            transition: border-color 0.3s ease;
            aspect-ratio: 1;
        }
        .image-option:hover {
            border-color: #6c5ce7;
        }
        .image-option img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 3px;
        }
        .copy-toast {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2ecc71;
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            font-size: 16px;
            z-index: 10001;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .copy-toast.show {
            display: block;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // ボタンの容器
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "100px";
    container.style.right = "10px";
    container.style.zIndex = "1000";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);

    // オーバーレイを作成
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <h3>価格を選択してください</h3>
        <div id="price-buttons"></div>
    `;
    document.body.appendChild(popup);

    // ボタン作成の実現
    function createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.padding = "10px";
        button.style.backgroundColor = "#6c5ce7";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.style.transition = "background 0.3s ease";
        button.addEventListener("mouseover", () => {
            button.style.backgroundColor = "#8075e5";
        });
        button.addEventListener("mouseout", () => {
            button.style.backgroundColor = "#6c5ce7";
        });
        button.addEventListener("click", onClick);
        container.appendChild(button);
    }

    // 商品タイトルを取得
    function getTitle() {
        const titleElement = document.querySelector("h2.font-bold.leading-\\[32px\\].m-0.text-\\[24px\\]");
        if (!titleElement) {
            throw new Error("商品タイトルが見つかりません");
        }
        return titleElement.innerText.trim();
    }

    // 作者名を取得
    function getAuthor() {
        // 複数のセレクターを試す
        const selectors = [
            "a.text-primary.text-bold",
            "a.text-decoration-none.text-primary",
            ".shop-name a",
            ".u-text-primary.u-text-bold",
            ".shop_name a",
            "span.text-ellipsis.break-all.whitespace-pre.preserve-half-leading.typography-16",
            ".shop_name span.text-ellipsis"
        ];

        for (let selector of selectors) {
            const authorElement = document.querySelector(selector);
            if (authorElement && authorElement.textContent.trim()) {
                return authorElement.textContent.trim();
            }
        }

        // 見つからない場合は空文字列を返す（エラーを投げない）
        return "";
    }

    // 商品URLとタイトルからSheetsのハイパーリンク数式を作成
    function getHyperlinkFormula() {
        const url = window.location.href;
        const title = getTitle();
        return `=HYPERLINK("${url}","${title}")`;
    }

    // すべてのバリエーション名を取得
    function getVariations() {
        const elements = document.getElementsByClassName("variation-name");
        if (elements.length === 0) {
            return ""; // バリエーションがない場合は空文字列を返す
        }
        return Array.from(elements)
            .map(el => el.innerText.replace(/^For\s+/i, '').trim())
            .filter(name => !/fullset|Fullset/.test(name))
            .filter(name => !/full/i.test(name))
            .map(name => `#${name}`)
            .join(" ");
    }

    // 商品IDを取得
    function getItemId() {
        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            throw new Error("canonicalリンクが見つかりません");
        }
        const href = canonicalLink.getAttribute("href");
        const match = href.match(/\/items\/(\d+)/);
        if (!match) {
            throw new Error("商品IDが見つかりません");
        }
        return match[1];
    }

    // 画像リンクを取得してSheets画像数式に変換
    async function getFirstImageFormula() {
        const imageWrappers = document.getElementsByClassName("market-item-detail-item-image-wrapper");
        if (!imageWrappers.length) {
            throw new Error("画像コンテナが見つかりません");
        }
        
        for (let wrapper of imageWrappers) {
            if (!wrapper.closest('.slick-slide').classList.contains("slick-cloned")) {
                const imageElement = wrapper.querySelector("img.market-item-detail-item-image");
                if (!imageElement) {
                    continue;
                }
                const imageUrl = !imageElement.getAttribute("data-lazy") ? 
                    imageElement.getAttribute("src") : 
                    imageElement.getAttribute("data-lazy");
                
                if (imageUrl) {
                    return `=IMAGE("${imageUrl}", 1)`;
                }
            }
        }
        return ""; // 画像が見つからない場合は空文字列を返す
    }

    // 価格とバリエーション名を取得
    function getPricesAndVariations() {
        // 異なるセレクターの組み合わせを試す
        const selectors = {
            price: ['.variation-price.u-text-right', '.variation-price'],
            name: ['.variation-name.u-text-wrap', '.name']
        };

        let priceElements = [];
        let nameElements = [];

        // 価格要素の取得を試みる
        for (let priceSelector of selectors.price) {
            priceElements = document.querySelectorAll(priceSelector);
            if (priceElements.length > 0) break;
        }

        // 価格が見つからない場合は空配列を返す
        if (priceElements.length === 0) {
            return [];
        }

        // 名前要素の取得を試みる
        for (let nameSelector of selectors.name) {
            nameElements = document.querySelectorAll(nameSelector);
            if (nameElements.length > 0) break;
        }

        const results = [];
        
        // 価格が1つだけの場合、直接使用
        if (priceElements.length === 1) {
            const price = priceElements[0].textContent.trim().replace(/[¥\s,]/g, '');
            // 名前があれば使用、なければ空文字列
            const name = nameElements.length > 0 ? nameElements[0].textContent.trim() : '';
            results.push({ price, name });
            return results;
        }

        // 複数の価格がある場合、それぞれ対応付け
        for(let i = 0; i < priceElements.length; i++) {
            if(nameElements[i]) {
                const price = priceElements[i].textContent.trim().replace(/[¥\s,]/g, '');
                results.push({
                    price: price,
                    name: nameElements[i].textContent.trim()
                });
            }
        }
        return results;
    }

    // トースト通知要素を作成
    const toast = document.createElement('div');
    toast.className = 'copy-toast';
    toast.textContent = 'コピー完了';
    document.body.appendChild(toast);

    // トースト通知を表示
    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // すべての画像リンクを取得
    async function getAllImages() {
        const imageWrappers = document.getElementsByClassName("market-item-detail-item-image-wrapper");
        const images = [];
        
        for (let wrapper of imageWrappers) {
            if (!wrapper.closest('.slick-slide').classList.contains("slick-cloned")) {
                const imageElement = wrapper.querySelector("img.market-item-detail-item-image");
                if (!imageElement) {
                    continue;
                }
                const imageUrl = !imageElement.getAttribute("data-lazy") ? 
                    imageElement.getAttribute("src") : 
                    imageElement.getAttribute("data-lazy");
                
                if (imageUrl) {
                    images.push(imageUrl);
                }
            }
        }
        return images;
    }

    // 画像選択ポップアップを作成
    const imagePopup = document.createElement('div');
    imagePopup.className = 'popup';
    imagePopup.innerHTML = `
        <h3>使用する画像を選択してください</h3>
        <div class="image-grid" id="image-grid"></div>
    `;
    document.body.appendChild(imagePopup);

    // ポップアップを表示
    function showPopup(popupElement) {
        overlay.classList.add('show');
        popupElement.classList.add('show');
        document.body.classList.add('popup-open');
    }

    // ポップアップを閉じる
    function closePopup(popupElement) {
        overlay.classList.remove('show');
        popupElement.classList.remove('show');
        document.body.classList.remove('popup-open');
    }

    // オーバーレイクリックの処理
    function handleOverlayClick(event) {
        if (event.target === overlay) {
            const visiblePopup = document.querySelector('.popup.show');
            if (visiblePopup) {
                closePopup(visiblePopup);
            }
        }
    }

    // クリックイベントリスナーを追加
    overlay.addEventListener('click', handleOverlayClick);

    // 価格選択の処理
    async function handlePriceSelection(price) {
        try {
            window.selectedPrice = price;
            const images = await getAllImages();
            const imageGrid = document.getElementById('image-grid');
            imageGrid.innerHTML = '';
            
            images.forEach((imageUrl, index) => {
                const imageDiv = document.createElement('div');
                imageDiv.className = 'image-option';
                imageDiv.innerHTML = `<img src="${imageUrl}" alt="オプション ${index + 1}">`;
                imageDiv.onclick = () => handleImageSelection(imageUrl, price);
                imageGrid.appendChild(imageDiv);
            });

            closePopup(popup);
            showPopup(imagePopup);
        } catch (error) {
            console.error("画像の取得に失敗しました", error);
            alert("画像の取得に失敗しました。スクリプトまたはページ構造を確認してください");
            closePopup(imagePopup);
        }
    }

    // 画像選択の処理
    async function handleImageSelection(imageUrl, price) {
        try {
            const author = getAuthor();
            const imageFormula = `=IMAGE("${imageUrl}", 1)`;
            const hyperlinkFormula = getHyperlinkFormula();

            const combinedContent = `${price}\t${author}\t${imageFormula}\t${hyperlinkFormula}`;

            GM_setClipboard(combinedContent);
            showToast();
        } catch (error) {
            console.error("情報の取得に失敗しました", error);
            alert("情報の取得に失敗しました。スクリプトまたはページ構造を確認してください");
        } finally {
            closePopup(imagePopup);
        }
    }

    // ポップアップのクラス名を設定
    popup.className = 'popup';

    // メインボタンの作成と処理
    createButton("情報を一括取得", async () => {
        try {
            const pricesAndVariations = getPricesAndVariations();
            const images = await getAllImages();

            // 価格も画像もない場合
            if (pricesAndVariations.length === 0 && images.length === 0) {
                const author = getAuthor();
                const hyperlinkFormula = getHyperlinkFormula();
                const combinedContent = `\t${author}\t\t${hyperlinkFormula}`;
                GM_setClipboard(combinedContent);
                showToast();
                return;
            }

            // 価格が1つで画像がない場合
            if (pricesAndVariations.length === 1 && images.length === 0) {
                const author = getAuthor();
                const hyperlinkFormula = getHyperlinkFormula();
                const combinedContent = `${pricesAndVariations[0].price}\t${author}\t\t${hyperlinkFormula}`;
                GM_setClipboard(combinedContent);
                showToast();
                return;
            }

            // 画像が1つで価格がない場合
            if (pricesAndVariations.length === 0 && images.length === 1) {
                const author = getAuthor();
                const imageFormula = `=IMAGE("${images[0]}", 1)`;
                const hyperlinkFormula = getHyperlinkFormula();
                const combinedContent = `\t${author}\t${imageFormula}\t${hyperlinkFormula}`;
                GM_setClipboard(combinedContent);
                showToast();
                return;
            }

            // 価格が1つで画像も1つの場合
            if (pricesAndVariations.length === 1 && images.length === 1) {
                const author = getAuthor();
                const imageFormula = `=IMAGE("${images[0]}", 1)`;
                const hyperlinkFormula = getHyperlinkFormula();
                const combinedContent = `${pricesAndVariations[0].price}\t${author}\t${imageFormula}\t${hyperlinkFormula}`;
                GM_setClipboard(combinedContent);
                showToast();
                return;
            }

            // 価格が1つで画像が複数ある場合
            if (pricesAndVariations.length === 1) {
                window.selectedPrice = pricesAndVariations[0].price;
                const imageGrid = document.getElementById('image-grid');
                imageGrid.innerHTML = '';
                
                images.forEach((imageUrl, index) => {
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'image-option';
                    imageDiv.innerHTML = `<img src="${imageUrl}" alt="オプション ${index + 1}">`;
                    imageDiv.onclick = () => handleImageSelection(imageUrl, pricesAndVariations[0].price);
                    imageGrid.appendChild(imageDiv);
                });

                showPopup(imagePopup);
                return;
            }

            // 価格が複数で画像が1つの場合
            if (images.length === 1) {
                const priceButtonsContainer = document.getElementById('price-buttons');
                priceButtonsContainer.innerHTML = '';
                
                pricesAndVariations.forEach(item => {
                    const button = document.createElement('button');
                    button.textContent = `${item.name} - ${item.price}`;
                    button.onclick = () => {
                        const author = getAuthor();
                        const imageFormula = `=IMAGE("${images[0]}", 1)`;
                        const hyperlinkFormula = getHyperlinkFormula();
                        const combinedContent = `${item.price}\t${author}\t${imageFormula}\t${hyperlinkFormula}`;
                        GM_setClipboard(combinedContent);
                        showToast();
                        closePopup(popup);
                    };
                    priceButtonsContainer.appendChild(button);
                });

                showPopup(popup);
                return;
            }

            // 価格も画像も複数ある場合
            const priceButtonsContainer = document.getElementById('price-buttons');
            priceButtonsContainer.innerHTML = '';
            
            pricesAndVariations.forEach(item => {
                const button = document.createElement('button');
                button.textContent = `${item.name} - ${item.price}`;
                button.onclick = () => handlePriceSelection(item.price);
                priceButtonsContainer.appendChild(button);
            });

            showPopup(popup);
        } catch (error) {
            console.error("情報の取得に失敗しました", error);
            alert("情報の取得に失敗しました。スクリプトまたはページ構造を確認してください");
        }
    });
})();
