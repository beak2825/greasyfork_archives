// ==UserScript==
// @name         脆的千喜問題
// @name:ja      ThreadsS1K問題
// @name:en     ThreadsS1KProblem
// @description  將語言設為CJK時的.0萬更改為整數，其為x0k轉換至x萬時的錯誤。
// @namespace    https://github.com/Max46656
// @version      1.2.1
// @author       Max
// @description:ja 言語をCJKに設定した際の.0萬を整數に変更。これはx0kからx萬への変換時のエラーです。
// @description:en Change .0萬 to an integer when the language is set to CJK. This is an error during the conversion from x0k to x萬.
// @match        https://www.threads.com/*
// @match        https://www.threads.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=threads.net
// @grant        GM.info
// @license MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/496055/%E8%84%86%E7%9A%84%E5%8D%83%E5%96%9C%E5%95%8F%E9%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/496055/%E8%84%86%E7%9A%84%E5%8D%83%E5%96%9C%E5%95%8F%E9%A1%8C.meta.js
// ==/UserScript==


class InteractStatChanger {
    constructor() {
        this.interactStatObserver = new MutationObserver(this.handleAllPosts.bind(this));
        // 空格以搜尋符合條件的父元素下符合條件的子元素，將class中的空格以"."取代
        this.interactStatClassName='span.x17qophe.x10l6tqk.x13vifvy';
    }

    startObserving() {
        this.interactStatObserver.observe(document.body, { subtree: true, childList: false, characterData: true });
    }

    stopObserving() {
        this.interactStatObserver.disconnect();
    }

    handleAllPosts() {
        this.stopObserving();

        const interactStatElements = document.querySelectorAll(this.interactStatClassName);
        //console.log('interactStat有', interactStatElements.length, '個 at ', new Date().toLocaleString());
        interactStatElements.forEach(element => {
            Array.from(element.childNodes).forEach(node => {
                node.nodeValue = this.toInteger(node);
            });
        });

        this.startObserving();
    }

    toInteger(node) {
        if (node.nodeType !== Node.TEXT_NODE || !node.nodeValue.match(/\.0/g)) {
            return node.nodeValue;
        } else {
            console.log(`${GM_info.script.name} L1KProblemFound`, node.nodeValue);
            return node.nodeValue.replace(/\.0/, '');
        }
    }
}

const johnTheMathTeacher = new InteractStatChanger();
johnTheMathTeacher.startObserving();
window.onload = (event) => {
  johnTheMathTeacher.handleAllPosts();
};
