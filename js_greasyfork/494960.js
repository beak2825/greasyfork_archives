// ==UserScript==
// @name         按鍵與滑鼠滾輪翻頁器
// @name:zh-TW   按鍵與滑鼠滾輪翻頁器
// @name:ja      キーとマウスホイールでのページめくり機
// @name:en      Keyboard and Mouse Wheel Page Turner
// @name:ko      키보드 및 마우스 휠 페이지 전환기
// @name:es      Navegador de Páginas con Teclado y Rueda del Ratón
// @description  使用滑鼠滾輪或按鍵快速切換上下頁。
// @description:zh-TW 使用滑鼠滾輪或按鍵快速切換上下頁。
// @description:ja マウスホイールをスクロールするか、キーを押すことで、簡単にページを上下に切り替えることができます。
// @description:en Quickly navigate between pages by scrolling the mouse wheel or pressing keys.
// @description:ko 마우스 휠을 스크롤하거나 키를 눌러 페이지를 쉽게 전환할 수 있습니다.
// @description:es Navega rápidamente entre páginas desplazando la rueda del ratón o presionando teclas

// @author       Max
// @namespace    https://github.com/Max46656

// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.info
// @version      1.2.9
// @license MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/494851/%E6%8C%89%E9%8D%B5%E8%88%87%E6%BB%91%E9%BC%A0%E6%BB%BE%E8%BC%AA%E7%BF%BB%E9%A0%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/494851/%E6%8C%89%E9%8D%B5%E8%88%87%E6%BB%91%E9%BC%A0%E6%BB%BE%E8%BC%AA%E7%BF%BB%E9%A0%81%E5%99%A8.meta.js
// ==/UserScript==


class PageButtonManager {
    constructor() {
        this.pageButtonsMap = {};
        this.loadPageButtons();
    }

    getConsoleLabels() {
        const userLang = navigator.language || navigator.userLanguage;
        const labels = {
            'zh-TW': {
                xPathSelectorDetected: '基於XPath的選擇器已獲取：',
                cssSelectorDetected: '基於CSS的選擇器已獲取：',
                nextPageButton: '下一頁的按鈕。',
                prevPageButton: '上一頁的按鈕。',
                manualSelectorRequired: '該網站不使用常見元素，請手動設定CSS或XPath選取器以設定上下頁元素。',
                currentConfiguration: '目前的設定為：',
                pageNavigationButtons: '上下頁元素為：'
            },
            'en': {
                xPathSelectorDetected: 'XPath-based selector detected:',
                cssSelectorDetected: 'CSS-based selector detected:',
                nextPageButton: 'Next page button.',
                prevPageButton: 'Previous page button.',
                manualSelectorRequired: 'This website does not use common elements. Please manually set CSS or XPath selectors for next/previous page elements.',
                currentConfiguration: 'Current configuration:',
                pageNavigationButtons: 'Page navigation elements:'
            },
            'ja': {
                xPathSelectorDetected: 'XPathベースのセレクターが検出されました：',
                cssSelectorDetected: 'CSSベースのセレクターが検出されました：',
                nextPageButton: '次のページボタン。',
                prevPageButton: '前のページボタン。',
                manualSelectorRequired: 'このウェブサイトは一般的な要素を使用していません。次/前のページ要素のためにCSSまたはXPathセレクターを手動で設定してください。',
                currentConfiguration: '現在の設定：',
                pageNavigationButtons: 'ページナビゲーション要素：'
            },
            'ko': {
                xPathSelectorDetected: 'XPath 기반 선택기가 감지되었습니다:',
                cssSelectorDetected: 'CSS 기반 선택기가 감지되었습니다:',
                nextPageButton: '다음 페이지 버튼.',
                prevPageButton: '이전 페이지 버튼.',
                manualSelectorRequired: '이 웹사이트는 일반적인 요소를 사용하지 않습니다. 다음/이전 페이지 요소를 위해 CSS 또는 XPath 선택기를 수동으로 설정해주세요.',
                currentConfiguration: '현재 설정:',
                pageNavigationButtons: '페이지 탐색 요소:'
            },
            'es': {
                xPathSelectorDetected: 'Selector basado en XPath detectado:',
                cssSelectorDetected: 'Selector basado en CSS detectado:',
                nextPageButton: 'Botón de página siguiente.',
                prevPageButton: 'Botón de página anterior.',
                manualSelectorRequired: 'Este sitio web no utiliza elementos comunes. Por favor, configure manualmente selectores CSS o XPath para los elementos de página siguiente/anterior.',
                currentConfiguration: 'Configuración actual:',
                pageNavigationButtons: 'Elementos de navegación de página:'
            }
        };
        return labels[userLang] || labels.en;
    }

    loadPageButtons() {
        this.pageButtonsMap = GM_getValue('pageButtonsMap', {});
    }

    async savePageButtons() {
        await GM_setValue('pageButtonsMap', this.pageButtonsMap);
    }

    getButtonsByCommonCases() {
        let buttonsByUserSetting = this.getButtonsByPage();
        if (buttonsByUserSetting !== null) {
            return buttonsByUserSetting;
        }
        let nextSelectorList = [
            "a.next",
            "a#next",
            ".next>a",
            ".next>button",
            "a[alt=next]",
            ".page-next>a",
            "a.next_page",
            "#next_page",
            ".curPage+a",
            ".nextPage",
            ".pagination-next>a",
            ".pagination>.active+a",
            "a[data-pagination=next]",
            ".pageButtonsCurrent+a",
            "a[class*=nextpage]",
            "li.page-current+li>a",
            "[class^=pag] a[rel=next]",
            "[class^=Pag] [aria-label=next]",
            "[class^=Pag] [aria-label=Next]",
            "[aria-label='Next Page']",
            "[aria-label='Next page']",
            "[aria-label$='next page']",
            ".pagination-nav__item--next>a",
            "a.pageright",
            "#pnnext",
            ".pager_on+a.pager",
            ".pager__next>a",
            ".page-numbers.current+a",
            "a.page-numbers.next",
            "body [class*=paginat] li.active+span+li>a",
            "body [class*=paginat] li.active+li>a",
            "body [class^=pag] .current+a",
            "body [class*=-pag] .current+a",
            ".page_current+a",
            "input[value='next']",
            "input[value='Next page']",
            "input[value='下一頁']",
            "input[value='下一頁']",
            "a#pb_next",
            "a#rightFix",
            "a#btnPreGn",
            "a.page-next",
            "a.pages-next",
            "a.page.right",
            "a[data-page='next']",
            ".paging>.active+.item",
            ".pg_area>em+a",
            "button.next:not([disabled])",
            ".btn_next:not([disabled])",
            ".btn-next:not([disabled])",
            "a#linkNext",
            "body a[class*=page__next]",
            "body [class*=pager]>a.next",
            "body [class*=pagination-next]>a",
            "body [class*=pagination-next]>button",
            "body [class*=page--current]+li>a",
            "body [class*=Pages]>.curr+a",
            "body [class*=page]>.cur+a",
            "body [class*=paginat] [class*=current]+li>a",
            "body [class*=paginat] [class*=next-next]",
            "body [class*=paginat] [class*=next]",
            "body [class*=paginat] [class*=right]",
            ".page>em+a",
            "[name*=nextPage]",
            "a:has(polyline[points='1,2 5,6 9,2'])", //箭頭polyline
            //以下未測試
            "a.nav-next:not([disabled])",
            "button.pagination-arrow-right",
            "[data-page-direction='next']",
            ".carousel-control-next",
            "a.pagination-link[rel='next']",
            ".nav-item.next-item",
            "button.btn-arrow-right:not([disabled])",
            // ARIA 無障礙設計
            "[aria-label='Go to next']",
            "[role='button'][aria-label='Next page']:not([aria-disabled='true'])",
            "[aria-label='下一頁面']",
            "[aria-label='次のページ']",
            "[aria-label='Página siguiente']",
            // Icon
            ".next-btn > svg[class*='arrow-right']",
            "button > i[class*='chevron-right']:not([disabled])",
            "a > span[class*='icon-forward']",
            // XPath：文字與結構檢查
            "//button[contains(@class, 'Page')][text()='Next']",
            "//button[contains(@class, 'page')][text()='next']",
            "//a[contains(@class, 'next') and not(@aria-disabled='true')]",
            "//button[contains(text(), '下一頁')]",
            "//a[contains(text(), '次へ')]",
            "//div[contains(@class, 'pagination')]//a[text()='>']",
            "//button[contains(@class, 'btn') and text()='Suivant']", // 法文
            "//a[contains(@class, 'nav') and text()='Siguiente']", // 西班牙文
            "//li[contains(@class, 'current')]/following-sibling::li[1]/a", //可能有問題
        ];
        let prevSelectorList = [
            "a.previous",
            "a.prev",
            "a#prev",
            ".prev>a",
            ".prev>button",
            "a[alt=prev]",
            ".page-prev>a",
            "a.prev_page",
            "#prev_page",
            "//*[contains(@class, 'pag')]//*[@class='curPage']/preceding-sibling::*[1]/a", // 原 .curPage~a
            ".prevPage",
            ".pagination-prev>a",
            "//*[contains(@class, 'pagination')]//*[@class='active']/preceding-sibling::*[1]/a", // 原 .pagination>.active~a
            "a[data-pagination=prev]",
            "//*[contains(@class, 'pag')]//*[@class='pageButtonsCurrent']/preceding-sibling::*[1]/a", // 原 .pageButtonsCurrent~a
            "a[class*=prevpage]",
            "//li[contains(@class, 'page-current')]/preceding-sibling::li[1]/a", // 原 li.page-current~li>a
            "[class^=pag] a[rel=prev]",
            "[class^=Pag] [aria-label=prev]",
            "[class^=Pag] [aria-label=Prev]",
            "[aria-label='Previous Page']",
            "[aria-label='Previous page']",
            "[aria-label$='previous page']",
            ".pagination-nav__item--next>a",
            "a.pageleft",
            "#pnprev",
            "//*[contains(@class, 'pager_on')]//*[@class='pager']/preceding-sibling::*[1]/a", // 原 .pager_on~a.pager
            ".pager__prev>a",
            "//*[contains(@class, 'page-numbers')]//*[@class='current']/preceding-sibling::*[1]/a", // 原 .page-numbers.current~a
            "a.page-numbers.prev",
            "//*[contains(@class, 'paginat')]//li[contains(@class, 'active')]/preceding-sibling::span[1]/preceding-sibling::li[1]/a", // 原 body [class*=paginat] li.active~span~li>a
            "//*[contains(@class, 'paginat')]//li[contains(@class, 'active')]/preceding-sibling::li[1]/a", // 原 body [class*=paginat] li.active~li>a
            "//body/*[contains(@class, 'pag')]//*[@class='current']/preceding-sibling::*[1]/a", // 原 body [class^=pag] .current~a
            "//body/*[contains(@class, '-pag')]//*[@class='current']/preceding-sibling::*[1]/a", // 原 body [class*=-pag] .current~a
            "//*[contains(@class, 'page_current')]/preceding-sibling::*[1]/a", // 原 .page_current~a
            "input[value='prev']",
            "input[value='Previous page']",
            "input[value='上一頁']",
            "a#pb_prev",
            "a#leftFix",
            "a#btnPreGp",
            "a.page-prev",
            "a.pages-prev",
            "a.page.left",
            "a[data-page='prev']",
            "//*[contains(@class, 'paging')]//*[@class='active']/preceding-sibling::*[1]/*[contains(@class, 'item')]", // 原 .paging>.active~.item
            "//*[contains(@class, 'pg_area')]//em/preceding-sibling::*[1]/a", // 原 .pg_area>em~a
            "button.prev:not([disabled])",
            ".btn_prev:not([disabled])",
            ".btn-prev:not([disabled])",
            "a#linkPrev",
            "body a[class*=page__prev]",
            "body [class*=pager]>a.prev",
            "body [class*=pagination-prev]>a",
            "body [class*=pagination-prev]>button",
            "//body/*[contains(@class, 'page--current')]/preceding-sibling::li[1]/a", // 原 body [class*=page--current]~li>a
            "//body/*[contains(@class, 'Pages')]//*[@class='curr']/preceding-sibling::*[1]/a", // 原 body [class*=Pages]>.curr~a
            "//body/*[contains(@class, 'page')]//*[@class='cur']/preceding-sibling::*[1]/a", // 原 body [class*=page]>.cur~a
            "//body/*[contains(@class, 'paginat')]//*[@class and contains(@class, 'current')]/preceding-sibling::li[1]/a", // 原 body [class*=paginat] [class*=current]~li>a
            "body [class*=paginat] [class*=prev-prev]",
            "body [class*=paginat] [class*=prev]",
            "body [class*=paginat] [class*=left]",
            "//*[contains(@class, 'page')]//em/preceding-sibling::*[1]/a", // 原 .page>em~a
            "[name*=prevPage]",
            "a:has(polyline[points='1,2 5,6 9,2'])", //箭頭polyline
            //以下未測試
            "a.nav-prev:not([disabled])",
            "button.pagination-arrow-left",
            "[data-page-direction='prev']",
            ".carousel-control-prev",
            "a.pagination-link[rel='prev']",
            ".nav-item.prev-item",
            "button.btn-arrow-left:not([disabled])",
            // ARIA 無障礙設計
            "[aria-label='Go to previous']",
            "[role='button'][aria-label='Previous page']:not([aria-disabled='true'])",
            "[aria-label='上一頁面']",
            "[aria-label='前のページ']",
            "[aria-label='Página anterior']", // 西班牙文
            // Icon
            ".prev-btn > svg[class*='arrow-left']",
            "button > i[class*='chevron-left']:not([disabled])",
            "a > span[class*='icon-back']",
            // XPath：文字與結構檢查
            "//button[contains(@class, 'Page')][text()='Previous']",
            "//button[contains(@class, 'page')][text()='previous']",
            "//a[contains(@class, 'prev') and not(@aria-disabled='true')]",
            "//button[contains(text(), '上一頁')]",
            "//a[contains(text(), '前へ')]",
            "//div[contains(@class, 'pagination')]//a[text()='<']",
            "//button[contains(@class, 'btn') and text()='Précédent']", // 法文
            "//a[contains(@class, 'nav') and text()='Anterior']", // 西班牙文
            "//li[contains(@class, 'current')]/preceding-sibling::li[1]/a",
        ];
        const labels = this.getConsoleLabels();
        let prevButton;
        let prevSelector;
        for (let selector of prevSelectorList) {
            if (selector.startsWith('//')) {
                let result = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                if (result.snapshotLength >= 1) {
                    prevButton = result.snapshotItem(0);
                    console.log(`${GM_info.script.name}: ${labels.XPathSelectorFound} ${labels.prevElement}`,selector);
                    prevSelector = selector;
                    break;
                }
            } else {
                let elements = document.querySelectorAll(selector);
                if (elements.length >= 1) {
                    prevButton = elements[0];
                    console.log(`${GM_info.script.name}: ${labels.CSSSelectorFound} ${labels.prevElement}`,selector);
                    prevSelector = selector;
                    break;
                }
            }
        }

        let nextButton;
        let nextSelcetor;
        for (let selector of nextSelectorList) {
            if (selector.startsWith('//')) {
                let result = document.evaluate(selector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                if (result.snapshotLength >= 1) {
                    nextButton = result.snapshotItem(result.snapshotLength - 1);
                    console.log(`${GM_info.script.name}: ${labels.XPathSelectorFound} ${labels.nextElement}`,selector);
                    nextSelcetor = selector;
                    break;
                }
            } else {
                let elements = document.querySelectorAll(selector);
                if (elements.length >= 1) {
                    nextButton = elements[elements.length - 1];
                    console.log(`${GM_info.script.name}: ${labels.CSSSelectorFound} ${labels.nextElement}:`,selector);
                    nextSelcetor = selector;
                    break;
                }
            }
        }
        console.log(`${GM_info.script.name}: ${labels.buttons}`,[prevButton,nextButton]);
        if(prevButton == null && nextButton == null){
            console.error(`${GM_info.script.name} : ${labels.needManualSetting}`)
        }
        return {"prevSelector":prevSelector,"nextSelcetor":nextSelcetor,"prev":prevButton,"next":nextButton};
    }

    getButtonsByPage() {
        let pageButtons = {"prev": null, "next": null};
        let currentUrl = window.location.href;
        let matchedPattern = null;
        let maxPatternLength = 0;

        for (const pattern in this.pageButtonsMap) {
            const regex = new RegExp(pattern);
            if (regex.test(currentUrl)) {
                // 將最長的正規表達式視為最嚴格的
                if (pattern.length > maxPatternLength) {
                    maxPatternLength = pattern.length;
                    matchedPattern = pattern;
                }
            }
        }

        if (!matchedPattern || this.pageButtonsMap[matchedPattern] === undefined) {
            return null;
        }

        const prevSelector = this.pageButtonsMap[matchedPattern].prevButton;
        const nextSelector = this.pageButtonsMap[matchedPattern].nextButton;

        if (prevSelector.startsWith('//')) {
            let xPathResult = document.evaluate(prevSelector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (xPathResult.snapshotLength > 0) {
                pageButtons.prev = xPathResult.snapshotItem(0);
            }
        } else {
            let elements = document.querySelectorAll(prevSelector);
            if (elements.length > 0) {
                pageButtons.prev = elements[0];
            }
        }

        // Handle next button selector (XPath or CSS)
        if (nextSelector.startsWith('//')) {
            let xPathResult = document.evaluate(nextSelector, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            if (xPathResult.snapshotLength > 0) {
                pageButtons.next = xPathResult.snapshotItem(xPathResult.snapshotLength - 1);
            }
        } else {
            let elements = document.querySelectorAll(nextSelector);
            if (elements.length > 0) {
                pageButtons.next = elements[elements.length - 1];
            }
        }

        return pageButtons;
    }

    getSelectorsByPattern() {
        let currentUrl = window.location.href;
        let matchingSelectors = [];

        for (const pattern in this.pageButtonsMap) {
            const regex = new RegExp(pattern);
            if (regex.test(currentUrl)) {
                matchingSelectors.push({
                    pattern: pattern,
                    selectors: this.pageButtonsMap[pattern]
                });
            }
        }
        return matchingSelectors;
    }

    setButtonsForDomain(buttons,pattern) {
        this.pageButtonsMap[pattern] = buttons;
        this.savePageButtons();
    }
}

class NavigationPaginationWithInput {
    constructor(buttonManager) {
        this.buttonManager = buttonManager;
        this.init();
    }

    async init() {
        //this.buttonManager.getButtonsByCommonCases();
        await this.loadSettings();
        this.setEventListeners();
    }

    async loadSettings() {
        this.togglePaginationMode = await GM_getValue('togglePaginationMode', 'key');
        this.modifierKey = await GM_getValue('modifierKey', 'CapsLock');
        this.nextPageKey = await GM_getValue('nextPageKey', 'W');
        this.prevPageKey = await GM_getValue('prevPageKey', 'Q');
        this.saveSettings();
    }

    async saveSettings() {
        await GM_setValue('togglePaginationMode', this.togglePaginationMode);
        await GM_setValue('modifierKey', this.modifierKey);
        await GM_setValue('nextPageKey', this.nextPageKey);
        await GM_setValue('prevPageKey', this.prevPageKey);
        console.group(`${GM_info.script.name}  `);
        console.log("togglePaginationMode",this.togglePaginationMode);
        console.log("modifierKey",this.modifierKey);
        console.log("nextPageKey",this.nextPageKey);
        console.log("prevPageKey",this.prevPageKey);
        console.groupEnd();
    }

    toNextPage() {
        this.pageButtons = this.buttonManager.getButtonsByCommonCases();
        this.pageButtons.next.click();
    }

    toPrevPage() {
        this.pageButtons = this.buttonManager.getButtonsByCommonCases();
        this.pageButtons.prev.click();
    }

    setEventListeners() {
        this.scrollHandler = () => this.handleScroll();
        this.keydownHandler = (event) => this.handleKeydown(event);

        if (this.togglePaginationMode !== "key") {
            self.addEventListener("scroll", this.scrollHandler);
        } else {
            self.addEventListener("keydown", this.keydownHandler);
        }
    }

    handleScroll(scrollThreshold=3) {
        const isBottom = document.documentElement.scrollHeight - self.innerHeight - self.pageYOffset <= scrollThreshold;
        if (isBottom) {
            this.toNextPage();
            //console.log("滾輪下一頁");
        }
        if (self.pageYOffset <= 0) {
            this.toPrevPage();
            //console.log("滾輪上一頁");
        }
    }

    handleKeydown(event) {
        if (event.getModifierState(this.modifierKey)) {
            if (event.code.replace(/^Key/, '').replace(/^Numpad/, '').toUpperCase() === this.nextPageKey.toUpperCase()) {
                event.preventDefault();
                this.toNextPage();
                //console.log("快捷鍵下一頁");
            } else if (event.code.replace(/^Key/, '').replace(/^Numpad/, '').toUpperCase() === this.prevPageKey.toUpperCase()) {
                event.preventDefault();
                this.toPrevPage();
                //console.log("快捷鍵上一頁");
            }
        }
    }
}

class MenuManager {
    constructor(buttonManager,navigation) {
        this.buttonManager = buttonManager;
        this.navigation = navigation;
        this.initMenu();
    }

    getMenuLabels() {
        const userLang = navigator.language || navigator.userLanguage;
        const labels = {
            'zh-TW': {
                viewAndModify: '修改上下頁的按鈕元素選取器',
                showAllPatternsOfDomain: '顯示本網域所有頁面的選擇器',
                togglePageMode: '切換翻頁模式',
                customizeModifierKey: '自訂啟動快捷鍵',
                customizeNextPageKey: '自訂下一頁快捷鍵',
                customizePrevPageKey: '自訂上一頁快捷鍵',
                enterUrlPattern: '輸入頁面對應的正規表達式(預設為網頁全域皆使用同一元素)',
                enterNextButton: '輸入下一頁按鈕選擇器：',
                enterPrevButton: '輸入上一頁按鈕選擇器：',
                noSelectors: '本網域尚未設定特例選擇器。',
                pattern: '正規表示式：',
                buttonUpdate: '以下頁面的按鈕選擇器已更新：',
                page: '頁面',
                nextButton: '下一頁選擇器：',
                prevButton: '上一頁選擇器：',
                thisDomain: '目前網域：',
                enterModifierKey: '輸入啟動快捷鍵 (Control, Alt, Shift, CapsLock)：',
                enterNextPageKey: '輸入下一頁快捷鍵：',
                enterPrevPageKey: '輸入上一頁快捷鍵：',
                switchToKeyTrigger: '切換為按鍵翻頁模式',
                switchToScrollTrigger: '切換為滾輪翻頁模式',
                invalidInput: '無效的輸入，請重試。'
            },
            'en': {
                viewAndModify: 'Modify Page Up/Down Button Selectors',
                showAllPatternsOfDomain: 'Show Selectors for All Pages in This Domain',
                togglePageMode: 'Toggle Page Mode',
                customizeModifierKey: 'Customize Modifier Key',
                customizeNextPageKey: 'Customize Next Page Key',
                customizePrevPageKey: 'Customize Previous Page Key',
                enterUrlPattern: 'Enter the regular expression for the page (defaults to using the same element across the entire website)',
                enterNextButton: 'Enter the next page button selector:',
                enterPrevButton: 'Enter the previous page button selector:',
                noSelectors: 'No custom selectors set for this domain.',
                pattern: 'Regular Expression:',
                buttonUpdate: 'Button selectors updated for the following page:',
                page: 'Page',
                nextButton: 'Next Page Selector:',
                prevButton: 'Previous Page Selector:',
                thisDomain: 'Current Domain:',
                enterModifierKey: 'Enter modifier key (Control, Alt, Shift, CapsLock):',
                enterNextPageKey: 'Enter next page key:',
                enterPrevPageKey: 'Enter previous page key:',
                switchToKeyTrigger: 'Switch to Key-Based Page Navigation',
                switchToScrollTrigger: 'Switch to Scroll-Based Page Navigation',
                invalidInput: 'Invalid input, please try again.'
            },
            'ja': {
                viewAndModify: 'ページの上下ボタン要素セレクターの変更',
                showAllPatternsOfDomain: 'このドメインのすべてのページのセレクターを表示',
                togglePageMode: 'ページモードを切り替える',
                customizeModifierKey: '修飾キーをカスタマイズ',
                customizeNextPageKey: '次のページキーをカスタマイズ',
                customizePrevPageKey: '前のページキーをカスタマイズ',
                enterUrlPattern: 'ページに対応する正規表現を入力してください（デフォルトではウェブサイト全體で同じ要素を使用します）',
                enterNextButton: '次のページボタンのセレクタを入力してください：',
                enterPrevButton: '前のページボタンのセレクタを入力してください：',
                noSelectors: 'このドメインにはカスタムセレクターが設定されていません。',
                pattern: '正規表現：',
                buttonUpdate: '以下のページのボタンセレクターが更新されました：',
                page: 'ページ',
                nextButton: '次のページセレクター：',
                prevButton: '前のページセレクター：',
                thisDomain: '現在のドメイン：',
                enterModifierKey: '修飾キーを入力してください（Control、Alt、Shift、CapsLock）：',
                enterNextPageKey: '次のページキーを入力してください：',
                enterPrevPageKey: '前のページキーを入力してください：',
                switchToKeyTrigger: 'キー操作によるページ移動に切り替え',
                switchToScrollTrigger: 'スクロールによるページ移動に切り替え',
                invalidInput: '無効な入力です。もう一度お試しください。'
            },
            'ko': {
                viewAndModify: '페이지 위/아래 버튼 선택기 수정',
                showAllPatternsOfDomain: '이 도메인의 모든 페이지 선택기 보기',
                togglePageMode: '페이지 모드 전환',
                customizeModifierKey: '수정 키 사용자화',
                customizeNextPageKey: '다음 페이지 키 사용자화',
                customizePrevPageKey: '이전 페이지 키 사용자화',
                enterUrlPattern: '페이지에 해당하는 정규 표현식을 입력하세요 (기본값은 웹사이트 전체에서 동일한 요소 사용)',
                enterNextButton: '다음 페이지 버튼 선택기 입력:',
                enterPrevButton: '이전 페이지 버튼 선택기 입력:',
                noSelectors: '이 도메인에 사용자 지정 선택기가 설정되지 않았습니다.',
                pattern: '정규 표현식:',
                buttonUpdate: '다음 페이지의 버튼 선택기가 업데이트되었습니다:',
                page: '페이지',
                nextButton: '다음 페이지 선택기:',
                prevButton: '이전 페이지 선택기:',
                thisDomain: '현재 도메인:',
                enterModifierKey: '수정 키를 입력하세요 (Control, Alt, Shift, CapsLock):',
                enterNextPageKey: '다음 페이지 키 입력:',
                enterPrevPageKey: '이전 페이지 키 입력:',
                switchToKeyTrigger: '키 기반 페이지 탐색으로 전환',
                switchToScrollTrigger: '스크롤 기반 페이지 탐색으로 전환',
                invalidInput: '잘못된 입력입니다. 다시 시도하세요.'
            },
            'es': {
                viewAndModify: 'Modificar Selectores de Botones de Página Arriba/Abajo',
                showAllPatternsOfDomain: 'Mostrar Selectores de Todas las Páginas de Este Dominio',
                togglePageMode: 'Alternar Modo de Página',
                customizeModifierKey: 'Personalizar Tecla Modificadora',
                customizeNextPageKey: 'Personalizar Tecla de Siguiente Página',
                customizePrevPageKey: 'Personalizar Tecla de Página Anterior',
                enterUrlPattern: 'Ingrese la expresión regular para la página (por defecto se usa el mismo elemento en todo el sitio web)',
                enterNextButton: 'Ingrese el selector del botón de siguiente página:',
                enterPrevButton: 'Ingrese el selector del botón de página anterior:',
                noSelectors: 'No se han establecido selectores personalizados para este dominio.',
                pattern: 'Expresión Regular:',
                buttonUpdate: 'Selectores de botones actualizados para la siguiente página:',
                page: 'Página',
                nextButton: 'Selector de Página Siguiente:',
                prevButton: 'Selector de Página Anterior:',
                thisDomain: 'Dominio Actual:',
                enterModifierKey: 'Ingrese tecla modificadora (Control, Alt, Shift, CapsLock):',
                enterNextPageKey: 'Ingrese tecla de siguiente página:',
                enterPrevPageKey: 'Ingrese tecla de página anterior:',
                switchToKeyTrigger: 'Cambiar a Navegación de Página por Teclas',
                switchToScrollTrigger: 'Cambiar a Navegación de Página por Desplazamiento',
                invalidInput: 'Entrada inválida, por favor intente de nuevo.'
            }
        };
        return labels[userLang] || labels.en;
    }

    initMenu() {
        const labels = this.getMenuLabels();
        GM_registerMenuCommand(labels.viewAndModify, this.viewAndModifyButtons.bind(this));
        GM_registerMenuCommand(labels.showAllPatternsOfDomain, this.showAllPatternsOfDomain.bind(this));
        GM_registerMenuCommand(labels.togglePageMode, this.inputModeSwitch.bind(this));
        GM_registerMenuCommand(labels.customizeModifierKey, this.customizeModifierKey.bind(this));
        GM_registerMenuCommand(labels.customizeNextPageKey, this.customizeNextPageKey.bind(this));
        GM_registerMenuCommand(labels.customizePrevPageKey, this.customizePrevPageKey.bind(this));
    }

    async viewAndModifyButtons() {
        const labels = this.getMenuLabels();
        const currentUrl = window.location.href;
        const selectorsArray = this.buttonManager.getSelectorsByPattern();

        let selectedPattern = null;
        let selectedSelectors = null;
        let maxPatternLength = 0;

        //根據getButtonsByPage()的邏輯，最長的模式視為最嚴謹的模式
        for (const item of selectorsArray) {
            if (item.pattern.length > maxPatternLength) {
                maxPatternLength = item.pattern.length;
                selectedPattern = item.pattern;
                selectedSelectors = item.selectors;
            }
        }

        let newPrevButton;
        let newNextButton;
        let pattern;

        if (selectedSelectors) {
            alert(`${labels.pattern}  ${selectedPattern}\n${labels.nextButton}  ${selectedSelectors.nextButton}\n${labels.prevButton}  ${selectedSelectors.prevButton}`);
            newNextButton = prompt(labels.enterNextButton, selectedSelectors.nextButton);
            newPrevButton = prompt(labels.enterPrevButton, selectedSelectors.prevButton);
            pattern = prompt(labels.enterUrlPattern, selectedPattern);
        } else {
            const autoSelector = this.buttonManager.getButtonsByCommonCases();
            alert(`${labels.invalidInput}\nNo selectors found for ${currentUrl}`);
            newNextButton = prompt(labels.enterNextButton, autoSelector.nextSelcetor);
            newPrevButton = prompt(labels.enterPrevButton, autoSelector.prevSelector);
            pattern = prompt(labels.enterUrlPattern, window.location.hostname);
        }

        if (newNextButton && newPrevButton && pattern) {
            this.buttonManager.setButtonsForDomain({ nextButton: newNextButton, prevButton: newPrevButton }, pattern);
            alert(`${labels.buttonUpdate} ${pattern}`);
        }
    }

    async showAllPatternsOfDomain() {
        const labels = this.getMenuLabels();
        const hostname = window.location.hostname;
        const selectorsArray = this.buttonManager.getSelectorsByPattern();

        const domainSelectors = selectorsArray.filter(item => new RegExp(hostname).test(item.pattern));

        if (domainSelectors.length > 0) {
            let message = `${labels.thisDomain} ${hostname}\n\n`;
            domainSelectors.forEach((item, index) => {
                message += `${labels.page} ${index + 1}: ${item.pattern}\n`;
                message += `  ${labels.nextButton}  ${item.selectors.nextButton}\n`;
                message += `  ${labels.prevButton}  ${item.selectors.prevButton}\n\n`;
            });
            alert(message);
        } else {
            alert(`${labels.invalidInput} ${hostname} ${labels.noSelectors}`);
        }
    }

    async inputModeSwitch() {
        const labels = this.getMenuLabels();
        if (this.navigation.togglePaginationMode === 'scroll') {
            this.navigation.togglePaginationMode = 'key';
            self.removeEventListener("scroll", this.navigation.scrollHandler);
            self.addEventListener("keydown", this.navigation.keydownHandler);
            console.log(`${GM_info.script.name}: ${labels.switchToKeyTrigger}`);
        } else {
            this.navigation.togglePaginationMode = 'scroll';
            self.addEventListener("scroll", this.navigation.scrollHandler);
            self.removeEventListener("keydown", this.navigation.keydownHandler);
            console.log(`${GM_info.script.name}: ${labels.switchToScrollTrigger}`);
        }
        await this.navigation.saveSettings();
    }

    async customizeModifierKey() {
        const labels = this.getMenuLabels();
        const newModifierKey = prompt(labels.enterModifierKey, this.navigation.modifierKey);
        if (['Control', 'Alt', 'Shift', 'CapsLock'].includes(newModifierKey)) {
            this.navigation.modifierKey = newModifierKey;
            await this.navigation.saveSettings();
        } else {
            alert(labels.invalidInput);
        }
    }

    async customizeNextPageKey() {
        const labels = this.getMenuLabels();
        const newNextPageKey = prompt(labels.enterNextPageKey, this.navigation.nextPageKey);
        if (newNextPageKey && newNextPageKey.length === 1) {
            this.navigation.nextPageKey = newNextPageKey;
            await this.navigation.saveSettings();
        } else {
            alert(labels.invalidInput);
        }
    }

    async customizePrevPageKey() {
        const labels = this.getMenuLabels();
        const newPrevPageKey = prompt(labels.enterPrevPageKey, this.navigation.prevPageKey);
        if (newPrevPageKey && newPrevPageKey.length === 1) {
            this.navigation.prevPageKey = newPrevPageKey;
            await this.navigation.saveSettings();
        } else {
            alert(labels.invalidInput);
        }
    }
}

const buttonManager = new PageButtonManager();
const Navigation = new NavigationPaginationWithInput(buttonManager);
new MenuManager(buttonManager,Navigation);
