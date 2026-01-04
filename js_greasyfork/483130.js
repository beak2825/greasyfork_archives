// ==UserScript==
// @name         BanYouSb
// @namespace    http://tampermonkey.net/
// @version      1.41
// @description  通過網頁操作, 達成屏蔽與解除屏蔽使用者
// @author       RogerYeah
// @match        *://jandan.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jandan.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483130/BanYouSb.user.js
// @updateURL https://update.greasyfork.org/scripts/483130/BanYouSb.meta.js
// ==/UserScript==


(function () {
    // 檢查 localStorage 中是否存在 banCode 鍵值對 , 若不存在則新增一個空物件
    const BAN_CODE_KEY = 'banCode';

    function initializeBanCode() {
        try {
            const banCode = localStorage.getItem(BAN_CODE_KEY);
            if (!banCode) {
                localStorage.setItem(BAN_CODE_KEY, '{}');
            } else {
                console.log('Here is who you ban: ' + banCode);
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
        }
    }

    initializeBanCode();

    // 將 localStorage 中的 banCode 鍵值對解析為 JSON 物件
    var banCode = JSON.parse(localStorage.getItem(BAN_CODE_KEY))

    // 獲取網頁中的所有評論列表
    var comment = document.getElementsByClassName("commentlist")
    var lis = comment[0].getElementsByTagName("li")

    // 獲取網頁中的所有 .text 元素
    var row = document.querySelectorAll('.text')

    // 定義屏蔽按鈕
    var voteElements = document.querySelectorAll(".jandan-vote")

    // 定義吐槽按鈕
    var tucao = document.querySelectorAll(".tucao-btn")


    //定義 unban 函式
    function unban(e) {
        // 獲取 li 元素
        var li = e.parentNode.parentNode.parentNode;

        // 獲取作者姓名
        var author = li.getElementsByClassName("author")[0].getElementsByTagName("strong")[0].textContent;

        // 確認是否解除屏蔽
        if (confirm("讓我看看 " + author + " 這傢夥有什麼長進")) {
            // 從 banCode 物件中刪除 author 對應的鍵值對
            delete banCode[author];

            // 將更新後的 banCode 物件存入 localStorage
            localStorage.setItem(BAN_CODE_KEY, JSON.stringify(banCode));

            // 重新載入頁面
            location.reload();
        }
    }

    // 定義 ban 函式
    function ban(e) {
        // 獲取 li 元素
        var li = e.parentNode.parentNode.parentNode;

        // 獲取作者姓名
        var author = li.getElementsByClassName("author")[0].children[0];

        // 獲取作者防偽碼
        var privCode = author.getAttribute('title').split('防伪码：').pop();

        // 確認是否屏蔽
        if (confirm("您確定要屏蔽 " + author.textContent + " 嗎？")) {
            // 將作者姓名和防偽碼新增至 banCode 物件中
            banCode[author.textContent] = privCode;

            // 將更新後的 banCode 物件存入 localStorage
            localStorage.setItem(BAN_CODE_KEY, JSON.stringify(banCode));

            // 重新載入頁面
            location.reload();
        }
    }

    // 定義 unBanUser 函式
    function unBanUser(e) {
        // 確認是否解除屏蔽
        if (confirm("讓我看看 " + e + " 這傢夥有什麼長進")) {
            // 從 banCode 物件中刪除 author 對應的鍵值對
            delete banCode[e];

            // 將更新後的 banCode 物件存入 localStorage
            localStorage.setItem(BAN_CODE_KEY, JSON.stringify(banCode));

            // 重新載入頁面
            location.reload();
        }
    }

    // 定義吐槽屏蔽函式
    function tucaoHandle(e) {
        const bannedUsers = JSON.parse(localStorage.getItem("banCode"));
        const bannedUsernames = Object.keys(bannedUsers);
        const isFBan = localStorage.getItem('FBan') === 'true';
        const tucaoList = e.querySelectorAll('.tucao-list .tucao-row');
        const tucaoHotList = e.querySelectorAll('.tucao-hot .tucao-row');
        let rowsToDelete = [];

        if (!bannedUsers) return; // 如果 banCode 為空，則直接返回

        bannedUsernames.forEach(bannedUser => {
            rowsToDelete = [];
            // 找到所有需要刪除的元素，並存儲到 rowsToDelete 陣列中
            tucaoList.forEach(row => {
                const tucaoAuthor = row.querySelector('.tucao-author');
                if (tucaoAuthor && tucaoAuthor.textContent.includes(bannedUser)) {
                    rowsToDelete.push(row.id);
                }
            });

            // 熱榜屏蔽
            tucaoHotList.forEach(row => {
                const tucaoAuthor = row.querySelector('.tucao-author');
                if (tucaoAuthor && tucaoAuthor.textContent.includes(bannedUser)) {
                    rowsToDelete.push(row.id);
                }
            });
        });

        if (isFBan) {
            rowsToDelete.forEach(row => {
                document.getElementById(row).remove()
            });
        } else {
            rowsToDelete.forEach(row => {
                var rowItem = document.getElementById(row);
                var contentBox = rowItem.querySelector(".tucao-content");
                var content = contentBox.textContent;

                document.getElementById(row).querySelector(".tucao-content").innerHTML = `
                    <del class="delete">
                        <span class="math-inline">已屏蔽</span>
                    </del>
                    <i class="peep" title="${content}">偷看一下(懸停)</i>
                `;
            });
        }
    }

    // 屏蔽防偽碼標記用戶
    for (let i = lis.length - 1; i >= 0; i--) {
        // 獲取作者姓名
        const author = lis[i].querySelector(".author strong");
        const authorName = author ? author.innerText : '';

        // 遍歷 banCode 物件中的所有鍵值對
        for (const [bannedAuthor, _] of Object.entries(banCode)) {
            // 若作者姓名與 banCode 物件中的鍵值對匹配 且 FBan Mode 為真
            if (authorName === bannedAuthor && localStorage.getItem('FBan') === 'true') {
                console.log(lis[i].remove());
            } else if(authorName === bannedAuthor) {
                // 獲取評論內容
                const contentBox = lis[i].querySelector(".text");
                const img = lis[i].querySelector("img");
                const content = contentBox.querySelector('p:not(.bad_content)').textContent.replace(/<br>/g, ' ');

                // 將評論內容替換為 "[已屏蔽]" 標記
                contentBox.innerHTML = `
                    <del class="delete">
                        <span class="math-inline">${authorName} - 已屏蔽</span>
                    </del>
                    <i class="peep" title="${content}">偷看一下(懸停)
                        ${img != null ? `<img style="opacity: 0;" src="${img.src}" alt="pic" />`: ''}
                    </i>
                `;

                break;
            }
        }
    }

    // 遍歷所有 .jandan-vote 元素
    for (var x = 0; x < voteElements.length; x++) {
        // 創建一個新的 a 元素
        var button = document.createElement("a");

        // 若評論內容包含 "[已屏蔽]" 標記
        if (row[x].innerHTML.includes('del')) {
            // 設定按鈕文字為 "[解除屏蔽]"
            button.textContent = "[解除屏蔽]";

            // 為按鈕添加點擊解除屏蔽函式
            button.addEventListener("click", function () {
                unban(this);
            });
        } else {
            // 設定按鈕文字為 "[屏蔽]"
            button.textContent = "[屏蔽]";

            // 為按鈕添加點擊屏蔽函式
            button.addEventListener("click", function () {
                ban(this);
            });
        }

        // 設定按鈕顏色為 "#c8c7cc"
        button.style.color = "#c8c7cc";

        // 將按鈕插入到 .jandan-vote 元素的開頭
        voteElements[x].prepend(button);
    }

    // 生成list按鈕Dom
    var counter = Object.keys(banCode).length
    var listDom = `
        <div class="banList">
            <div class="toggleArea">
                <div class="banModeSwitch" title="打開此開關完全屏蔽模式, 開啟後偷看功能關閉並完全屏蔽列表中的使用者(看不見任何與屏蔽使用者相關之項目)">
                    <div class="switch ${localStorage.getItem('FBan') === 'true' ? 'active' : ''}" id="switch"></div>
                    <span>FBan Mode</span>
                </div>
                屏蔽列表
                <div class="toggleList">
                    <span class="toggleList-show">+</span>
                    <span class="toggleList-hide" style="display: none;">-</span>
                </div>
            </div>
            <ul class="mainList" style="display: none;">
    `

    // 循環遍歷 banCode 對象中的已屏蔽用戶
    for (var li = 0; li < counter; li++) {
        listDom += `
                <li class="mainList-item">${Object.keys(banCode)[li]} <a class="unban" href="javascript: void();">x</a></li>
        `
    }

    listDom += `
            </ul>
            <form id="banForm">
                <input class="ban-input" type="text" placeholder="手動屏蔽(鍵入ID後, 猛擊Enter)" />
            </form>
        </div>
    `

    // 獲取 DOM 元素
    const wrapper = document.getElementById('wrapper');
    const listDomElement = document.createElement('div');
    listDomElement.innerHTML = listDom;
    wrapper.appendChild(listDomElement);

    // 添加點擊事件監聽器，用於處理刪除按鈕的點擊
    wrapper.addEventListener('click', (event) => {
        if (event.target.classList.contains('unban') && !event.target.classList.contains('clicked')) {
            const username = event.target.parentNode.textContent.trim().replace(' x', '');
            unBanUser(username);
            event.target.classList.add('clicked')
        }
        if (event.target.classList.contains('tucao-btn') && !event.target.classList.contains('clicked')) {
            var tucaoId = event.target.dataset.id;
            var tucaoBox = document.getElementById(`jandan-tucao-${tucaoId}`)
            var intervalBox = setInterval(() => {
                if (tucaoBox.innerText !== "数据加载中....biubiubiu....") {
                    tucaoHandle(tucaoBox);
                    clearInterval(intervalBox);
                    event.target.classList.add('clicked')
                }
            }, 100);
        }
    });

    // 獲取 DOM 元素
    const switcher = document.getElementById('switch');

    switcher.addEventListener('click', (event) => {
        if(localStorage.getItem('FBan') !== null) {
            const isFBan = localStorage.getItem('FBan') === 'true';
            localStorage.setItem('FBan', !isFBan);
            switcher.classList.toggle('active', !isFBan);
            location.reload();
        } else {
            if(confirm('打開此開關完全屏蔽模式, 開啟後偷看功能關閉並完全屏蔽列表中的使用者(看不見任何與被屏蔽使用者相關之項目)')) {
                const isFBan = localStorage.getItem('FBan') === 'true';
                localStorage.setItem('FBan', !isFBan);
                switcher.classList.toggle('active', !isFBan);
                location.reload();
            }
        }
    })

    // 獲取並緩存屏蔽用戶列表 DOM 元素
    const toggleList = document.querySelector('.toggleList');
    if(toggleList != null) {
        // 添加點擊事件監聽器，用於展開/收起屏蔽用戶列表
        toggleList.addEventListener('click', function() {
            const secondSpan = this.querySelector('span:nth-of-type(2)');
            const ul = document.querySelector('.mainList');

            secondSpan.style.display = secondSpan.style.display === 'none' ? 'block' : 'none';
            ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
        });
    }

    // 手動屏蔽功能
    const myForm = document.getElementById('banForm');
    const myInput = document.querySelector('.ban-input');

    myForm.addEventListener('submit', function() {
        const inputValue = myInput.value;

        if (confirm("此屏蔽無法正確辨識身分, 換個暱稱就屏蔽不了了, 您確定要屏蔽 " + inputValue + " 嗎？")) {
            let banData = JSON.parse(localStorage.getItem("banCode")) || {}; // 初始化為空物件

            if (banData[inputValue] == undefined) { // 避免重複添加
                banData[inputValue] = null;
                localStorage.setItem("banCode", JSON.stringify(banData));
                setTimeout(() => {
                    location.reload();
                }, 100)
            } else {
                alert("該用戶已經被屏蔽");
            }
        }
    });

    setTimeout(() => {
        // 創建 style 元素
        var style = document.createElement('style');
         // 創建文本，包含 CSS 規則
        style.innerHTML = `
            .commentlist .row {
                overflow: visible;
            }

            .delete {
                display: inline-block;
                margin-bottom: 20px;
                margin-top: 7px;
                margin-right: 5px;
            }

            .tucao-content {
                .delete {
                    display: inline-block;
                    margin: 0;
                }
            }

            .peep {
                display: inline-block;
                position: relative;
                font-size: 10px;

                img {
                    position: absolute;
                    left: calc(100% + 10px);
                    opacity: 0;
                    max-width: 250px !important;
                    pointer-events: none;
                }

                &:hover img {
                    opacity: 1 !important;
                    transition: .5s ease;
                }
            }

            .banList {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                position: fixed;
                top: 84px;
                width: 1184px;
                pointer-events: none;
                width: calc((100vw - 984px - 60px) / 2);
                max-height: calc(100% - 300px);
                box-sizing: border-box;
                left: calc(100% - (100vw - 984px - 30px) / 2);
            }

            .toggleArea {
                padding: 5px;
                position: relative;
                text-align: center;
                width: 100%;
                border-radius: 5px;
                background: #bababa;
                color: #333;
                font-weight: bold;
                pointer-events: auto;

                .toggleList {
                    display: inline-block;
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    right: 5px;

                    &-show,
                    &-hide {
                        position: relative;
                        display: inline-block;
                        width: 20px;
                        height: 20px;
                        background: #bababa;

                        &:hover {
                            color: #666;
                        }
                    }

                    &-hide {
                        position: absolute;
                        top: 0;
                    }
                }
            }

            .mainList {
                margin-bottom: 3px;
                position: relative;
                width: 90px;
                top: calc(100% + 10px);
                display: none;
                width: 100%;
                color: gray;
                overflow: auto;
                height: calc(100vh - 196px);

                &-item {
                    margin-bottom: 4px;
                    padding-bottom: 4px;
                    width: 100%;
                    border-bottom: 1px solid gray;
                    font-size: 12px;
                    white-space:nowrap;
                    text-overflow:ellipsis;
                    -o-text-overflow:ellipsis;
                    overflow: hidden;
                    max-width: 100%;
                    padding-right: 20px;
                    box-sizing: border-box;

                    .unban {
                        pointer-events: auto;
                        cursor: pointer;
                        position: absolute;
                        right: 0;
                    }
                }
            }

            #banForm {
                position: absolute;
                bottom: calc(100% + 5px);
                left: 0;
                width: 100%;
                pointer-events: auto;

                .ban-input {
                    position: relative;
                    width: 100%;
                    border-color: #d8d8d8;
                    border-width: 0px 00px 1px 0px;

                    &:focus {
                        outline: none;
                    }

                    &::placeholder {
                        color: #d8d8d8;
                    }
                }
            }

            .banModeSwitch {
                position: absolute;
                top: 5px;
                height: 20px;

                .switch {
                    position: relative;
                    width: 20px;
                    height: 10px;;
                    border-radius: 10px;
                    background: rgb(255 255 255 / 40%);

                    &:after {
                        content: '';
                        display: block;
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        height: 6px;
                        width: 6px;
                        border-radius: 10px;
                        background: rgb(0 0 0 / 20%);
                    }

                    &.active {
                        background: rgb(187 255 204 / 40%);

                        &:after {
                            left: auto;
                            right: 2px;
                            background: rgb(22 165 0 / 40%);
                        }
                    }
                }

                span {
                    padding-top: 2px;
                    display: block;
                    color: #333 !important;
                    font-size: 7px;
                    font-weight: 100;
                }
            }

            #nav_top {
                z-index: 99999;
            }
        `;
        document.head.appendChild(style);
    }, 1);
})();