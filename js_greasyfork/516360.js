// ==UserScript==
// @name         显示随机卡号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示随机信用卡信息
// @match        https://*.vercel.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516360/%E6%98%BE%E7%A4%BA%E9%9A%8F%E6%9C%BA%E5%8D%A1%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/516360/%E6%98%BE%E7%A4%BA%E9%9A%8F%E6%9C%BA%E5%8D%A1%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cardList = `5211883104484376|07|2029|570
5211883104480556|07|2029|976
5211883104484376|07|2029|570
5211883104480556|07|2029|976
5211883104486512|07|2029|893
5211883104488427|07|2029|427
5211883104483253|07|2029|775
5211883104481760|07|2029|720
5211883104480341|07|2029|571
5211883104483204|07|2029|267
5211883104482651|07|2029|310
5211883104487700|07|2029|421
5211883104483246|07|2029|484
5211883104485076|07|2029|437
5211883104485118|07|2029|970
5211883104484715|07|2029|668
5211883104487452|07|2029|149
5211883104484376|07|2029|996
5211883104483311|07|2029|193
5211883104482586|07|2029|378
5211883104484053|07|2029|403
5211883104481000|07|2029|545
5211883104485530|07|2029|875
5211883104483774|07|2029|403
5211883104483543|07|2029|695
5211883104485100|07|2029|484
5211883104480234|07|2029|470
5211883104486207|07|2029|550
5211883104484236|07|2029|429
5211883104482461|07|2029|573
5211883104482545|07|2029|147
5211883104488724|07|2029|976
5211883104480523|07|2029|338
5211883104488534|07|2029|899
5211883104485621|07|2029|540
5211883104481414|07|2029|581
5211883104483410|07|2029|148
5211883104488484|07|2029|547
5211883104484426|07|2029|459
5211883104482867|07|2029|751
5211883104482206|07|2029|585
5211883104488112|07|2029|411
5211883104481836|07|2029|935
5211883104483485|07|2029|366
5211883104480648|07|2029|872
5211883104483360|07|2029|531
5211883104482834|07|2029|570
5211883104484145|07|2029|754
5211883104488633|07|2029|809
5211883104486777|07|2029|704
5211883104482768|07|2029|306
5211883104484681|07|2029|457
5211883104481844|07|2029|707
5211883104484145|07|2029|511
5211883104486801|07|2029|022
5211883104486330|07|2029|021
5211883104485282|07|2029|093
5211883104483717|07|2029|101
5211883104481356|07|2029|248
5211883104481281|07|2029|144
5211883104481570|07|2029|678
5211883104486074|07|2029|276
5211883104485654|07|2029|319
5211883104488310|07|2029|277
5211883104482404|07|2029|247
5211883104484574|07|2029|724
5211883104485670|07|2029|843
5211883104482230|07|2029|291
5211883104480556|07|2029|500
5211883104483360|07|2029|341
5211883104488302|07|2029|627
5211883104486454|07|2029|946
5211883104485571|07|2029|713
5211883104488252|07|2029|577
5211883104482115|07|2029|253
5211883104481620|07|2029|232
5211883104482438|07|2029|388
5211883104480440|07|2029|491
5211883104484566|07|2029|986
5211883104480457|07|2029|235
5211883104486371|07|2029|306
5211883104487585|07|2029|001
5211883104481828|07|2029|524
5211883104485712|07|2029|559
5211883104488344|07|2029|353
5211883104485365|07|2029|772
5211883104484244|07|2029|833
5211883104483147|07|2029|665
5211883104487684|07|2029|007
5211883104480143|07|2029|691
5211883104483154|07|2029|229
5211883104488435|07|2029|104
5211883104480424|07|2029|262
5211883104481315|07|2029|685
5211883104488534|07|2029|420
5211883104480010|07|2029|671
5211883104480705|07|2029|233
5211883104483584|07|2029|800
5211883104480333|07|2029|694
5211883104480846|07|2029|091
5211883104484053|07|2029|476
5211883104480366|07|2029|265`.split('\n');

    // 创建一个固定的开关按钮
    function createToggleButton() {
        const button = document.createElement('button');
        button.textContent = '显示卡号';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #0070f3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(button);
        return button;
    }

    function createCardDisplay() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background-color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: monospace;
            min-width: 300px;
            border: 1px solid #eaeaea;
            display: none;
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        title.textContent = '随机卡号信息';

        const refreshButton = document.createElement('button');
        refreshButton.textContent = '刷新';
        refreshButton.style.cssText = `
            background-color: #0070f3;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
        `;
        title.appendChild(refreshButton);

        const cardInfo = document.createElement('div');
        cardInfo.style.cssText = `
            background-color: #f6f6f6;
            padding: 10px;
            border-radius: 5px;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 10px;
        `;

        const copyButton = document.createElement('button');
        copyButton.textContent = '复制';
        copyButton.style.cssText = `
            background-color: #0070f3;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            width: 100%;
        `;

        container.appendChild(title);
        container.appendChild(cardInfo);
        container.appendChild(copyButton);

        function updateCardInfo() {
            const randomCard = cardList[Math.floor(Math.random() * cardList.length)];
            const [cardNumber, month, year, cvv] = randomCard.split('|');
            cardInfo.innerHTML = `
                <div>卡号: ${cardNumber}</div>
                <div>有效期: ${month}/${year}</div>
                <div>CVV: ${cvv}</div>
            `;
            return randomCard;
        }

        let currentCard = updateCardInfo();

        refreshButton.onclick = () => {
            currentCard = updateCardInfo();
        };

        copyButton.onclick = () => {
            navigator.clipboard.writeText(currentCard).then(() => {
                copyButton.textContent = '已复制!';
                setTimeout(() => {
                    copyButton.textContent = '复制';
                }, 1000);
            });
        };

        // 添加拖动功能
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        title.style.cursor = 'move';
        title.addEventListener('mousedown', dragStart);

        function dragStart(e) {
            initialX = e.clientX - container.offsetLeft;
            initialY = e.clientY - container.offsetTop;
            isDragging = true;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                container.style.right = 'auto';
                container.style.left = `${currentX}px`;
                container.style.top = `${currentY}px`;
            }
        }

        function dragEnd() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }

        return container;
    }

    // 创建并添加元素
    const toggleButton = createToggleButton();
    const cardDisplay = createCardDisplay();
    document.body.appendChild(cardDisplay);

    // 控制显示/隐藏
    let isVisible = false;
    toggleButton.onclick = () => {
        isVisible = !isVisible;
        cardDisplay.style.display = isVisible ? 'block' : 'none';
        toggleButton.textContent = isVisible ? '隐藏卡号' : '显示卡号';
    };

    // 添加快捷键
    document.addEventListener('keydown', function(e) {
        // Alt + C 显示/隐藏卡号
        if (e.altKey && e.key === 'c') {
            toggleButton.click();
        }
    });
})();