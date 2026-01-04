// ==UserScript==
// @name         Bazar.bg бутон за обновяване
// @version      2.22
// @description  Бутон, за лесно обновяване на изтичащи обяви.
// @author       Deathwing
// @include      https://bazar.bg/ads/my*
// @grant        GM_xmlhttpRequest
// @connect      https://bazar.bg/
// @namespace    https://greasyfork.org/users/18375
// @downloadURL https://update.greasyfork.org/scripts/398039/Bazarbg%20%D0%B1%D1%83%D1%82%D0%BE%D0%BD%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D1%8F%D0%B2%D0%B0%D0%BD%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/398039/Bazarbg%20%D0%B1%D1%83%D1%82%D0%BE%D0%BD%20%D0%B7%D0%B0%20%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D1%8F%D0%B2%D0%B0%D0%BD%D0%B5.meta.js
// ==/UserScript==

var expiringAds = false;

if (document.querySelector('.second_li')) {
    expiringAds = true;
}

if (document.querySelector('.first_li').className.includes('selected')) {
    var lastPagingElement = document.querySelector("div.paging").lastElementChild;
    var refreshButt = createHTMLElement('button', null, 'refreshButton', [{
        n: 'style', v: `
        margin-left:20px;
        height:35px;
        font-size:13px;
        transition: all 300ms linear`
    }]);

    if (lastPagingElement.className.includes('disabled')) {
        if (expiringAds) {
            refreshButt.textContent = 'ОБНОВИ ИЗТИЧАЩИ';
            refreshButt.className = 'refresh';
        }
        else {
            refreshButt.textContent = 'ОТИДИ ДОЛУ';
            refreshButt.className = 'goToBottom';
        }
    }
    else {
        refreshButt.textContent = 'ПОСЛЕДНА СТРАНИЦА';
        refreshButt.className = 'goToLast';
    }

    document.querySelector("div.blueBox").children[1].appendChild(refreshButt);

    refreshButt.addEventListener('click', refreshHandler);
}

function refreshHandler(e) {
    var button = e.target;

    if (button.className === 'refresh') {
        button.textContent = 'МОЛЯ ИЗЧАКАЙТЕ';
        var refreshButtons = document.querySelectorAll('td .btnOferirai');
        var numToRefresh = Math.min(Number(document.querySelector('.second_li span').textContent), refreshButtons.length);
        var counter = 0;

        createMessageBox();

        for (var i = refreshButtons.length - 1; i >= refreshButtons.length - numToRefresh; i--) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: refreshButtons[i].href,
                onload: () => {
                    counter++;
                    button.style.backgroundImage = `linear-gradient(90deg, green ${(counter / numToRefresh) * 100}%, transparent 0%)`;

                    if (counter === numToRefresh) {
                        showMessage(numToRefresh);
                        button.textContent = 'ОБНОВИ СТРАНИЦАТА';
                        button.style.backgroundImage = '';
                        button.style.background = '#fa7609';
                        button.className = 'reload';
                        setTimeout(() => button.style.background = '#3b6fb6', 300);
                    }
                }
            });
        }
    }
    else if (button.className === 'goToLast') {
        var numOfAds = document.querySelector('.first_li span').textContent;
        var lastPageNum = Math.ceil(numOfAds / 20);
        window.location.href = `https://bazar.bg/ads/my?page=${lastPageNum}`;
    }
    else if (button.className === 'goToBottom') {
        window.scrollTo(0, 99999);
    }
    else if (button.className === 'reload') {
        window.location.reload();
    }
}

function createMessageBox() {
    var msgDiv = createHTMLElement('div', null, 'msgBox', [{
        n: 'style', v: `
        height: 70px;
        width: 300px;
        padding: 20px;
        position: absolute;
        background-color: #fff;
        text-align: center;
        display: none;
        margin-left: 10px;
        box-shadow: #00000057 0px 0px 15px;
        font-weight: bold;
        border-radius: 5px;
        transition: all 300ms linear;
        opacity: 0;`
    }]);
    var element = document.querySelector("div.blueBox").children[1];
    element.appendChild(msgDiv);
}

function showMessage(numRefreshed) {
    var msgBox = document.querySelector('.msgBox');
    msgBox.innerHTML = `${numRefreshed} обяви успешно обновени! Моля обновете страницата.`;
    msgBox.style.display = 'inline';
    setTimeout(() => msgBox.style.opacity = '1', 50);
}

function createHTMLElement(tag, textContent, className, attributes) {
    var element = document.createElement(tag);

    if (className) {
        element.className = className;
    }
    if (textContent) {
        element.textContent = textContent;
    }
    if (attributes) {
        attributes.forEach((a) => {
            element.setAttribute(a.n, a.v);
        });
    }

    return element;
}

// function appendChildren(element, children) {
//     children.forEach((c) => {
//         element.appendChild(c);
//     });
// }
