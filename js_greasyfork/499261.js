// ==UserScript==
// @name         Copy LaTeX Formula 1.1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  复制网页上的 LaTeX 公式(CSDN,zhihu,wiki)
// @author       shezhao
// @match        *://*/*
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://blog.csdn.net/*/article/*
// @match        https://*.wikipedia.org/*
// @match        https://www.wikiwand.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499261/Copy%20LaTeX%20Formula%2011.user.js
// @updateURL https://update.greasyfork.org/scripts/499261/Copy%20LaTeX%20Formula%2011.meta.js
// ==/UserScript==
// 鸣谢
// https://greasyfork.org/zh-CN/scripts/397740
// 参考了wiki部分 https://github.com/flaribbit/click-to-copy-equations
(function() {
    'use strict';
    const host = document.location.host;
    class zhihuLaTeXFormulaCopier {
        constructor(elementSelector = 'span.ztext-math') {
            this.elementSelector = elementSelector;
            this.contextMenu = this.createContextMenu();
            this.addEventListeners();
        }

        createContextMenu() {
            const contextMenu = document.createElement('div');
            contextMenu.style.display = 'none';
            contextMenu.style.position = 'absolute';
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.border = '1px solid black';
            contextMenu.style.padding = '5px';
            contextMenu.style.zIndex = '10000';

            const copyOption = document.createElement('div');
            copyOption.textContent = 'Copy LaTeX Formula';
            copyOption.style.cursor = 'pointer';
            copyOption.style.padding = '5px';
            copyOption.addEventListener('click', () => {
                const formula = this.getSelectedFormula();
                if (formula) {
                    console.log('Formula to be copied:', formula);
                    this.copyToClipboard(formula);
                } else {
                    console.log('No formula found');
                }
                this.hideContextMenu();
            });

            contextMenu.appendChild(copyOption);
            document.body.appendChild(contextMenu);

            return contextMenu;
        }

        showContextMenu(x, y) {
            if (this.contextMenu) {
                this.contextMenu.style.left = `${x}px`;
                this.contextMenu.style.top = `${y}px`;
                this.contextMenu.style.display = 'block';
                console.log('Context menu shown at:', x, y);
            }
        }

        hideContextMenu() {
            if (this.contextMenu) {
                this.contextMenu.style.display = 'none';
                console.log('Context menu hidden');
            }
        }

        getSelectedFormula() {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const startNode = range.startContainer;
                const endNode = range.endContainer;

                const latexElements = document.querySelectorAll(this.elementSelector);
                console.log('Found latex elements:', latexElements.length);
                for (const element of latexElements) {
                    if (element.contains(startNode) && element.contains(endNode)) {
                        const formula = element.getAttribute('data-tex');
                        console.log('Selected formula:', formula);
                        return '$' + formula + '$'; // 在这里添加 $ 符号
                    }
                }
            }
            console.log('No formula selected');
            return null;
        }

        copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    console.log('Copied to clipboard:', text);
                    if (!DEFAULT_COPY){
                        alert('已复制到剪贴板');
                    }
                })
                .catch((error) => {
                    console.error('Failed to copy to clipboard:', error);
                    if (!DEFAULT_COPY){
                        alert('复制失败');
                    }
                });
        }

        addEventListeners() {
            document.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                const clickedElement = event.target;
                this.highlightElement(clickedElement);
                const latexElement = this.findClosestLatexElement(clickedElement);
                if (latexElement) {

                    const formula = latexElement.getAttribute('data-tex');
                    if (formula) {
                        console.log('Formula found in clicked element:', formula);
                        if (!DEFAULT_COPY) {
                            let shouldCopy = window.confirm('是否要复制这个公式?');
                            if (shouldCopy) {
                                this.copyToClipboard('$' + formula + '$'); // 在这里添加 $ 符号
                            }
                        } else{
                            this.copyToClipboard('$' + formula + '$'); // 在这里添加 $ 符号
                        }

                    } else {
                        console.log('No formula found in clicked element');

                    }

                } else {
                    console.log('No ztext-math element found in clicked area');
                }
                this.showContextMenu(event.pageX, event.pageY);
            });


            document.addEventListener('click', () => {
                this.hideContextMenu();
                this.removeHighlight();
            });
        }

        findClosestLatexElement(element) {
            let currentElement = element;
            while (currentElement) {
                if (currentElement.classList && currentElement.classList.contains('ztext-math')) {
                    return currentElement;
                }
                currentElement = currentElement.parentElement;
            }
            return null;
        }
         highlightElement(element) {
            this.removeHighlight();
            element.style.border = '2px solid red';
            this.highlightedElement = element;
        }

        removeHighlight() {
            if (this.highlightedElement) {
                this.highlightedElement.style.border = '';
                this.highlightedElement = null;
            }
        }
    }
    class csdnKatexFormulaCopier {
        constructor(elementSelector = 'span.katex-mathml') {
            this.elementSelector = elementSelector;
            this.contextMenu = this.createContextMenu();
            this.addEventListeners();

        }

        createContextMenu() {
            const contextMenu = document.createElement('div');
            contextMenu.style.display = 'none';
            contextMenu.style.position = 'absolute';
            contextMenu.style.backgroundColor = 'white';
            contextMenu.style.border = '1px solid black';
            contextMenu.style.padding = '5px';
            contextMenu.style.zIndex = '10000';

            const copyOption = document.createElement('div');
            copyOption.textContent = 'Copy LaTeX Formula';
            copyOption.style.cursor = 'pointer';
            copyOption.style.padding = '5px';
            copyOption.addEventListener('click', () => {
                const formula = this.getSelectedFormula();
                if (formula) {
                    console.log('Formula to be copied:', formula);
                    this.copyToClipboard(formula);
                } else {
                    console.log('No formula found');
                }
                this.hideContextMenu();
            });

            contextMenu.appendChild(copyOption);
            document.body.appendChild(contextMenu);

            return contextMenu;
        }

        showContextMenu(x, y) {
            if (this.contextMenu) {
                this.contextMenu.style.left = `${x}px`;
                this.contextMenu.style.top = `${y}px`;
                this.contextMenu.style.display = 'block';
                console.log('Context menu shown at:', x, y);
            }
        }

        hideContextMenu() {
            if (this.contextMenu) {
                this.contextMenu.style.display = 'none';
                console.log('Context menu hidden');
            }
        }

        getSelectedFormula() {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const startNode = range.startContainer;
                const endNode = range.endContainer;

                const katexElements = document.querySelectorAll(this.elementSelector);
                console.log('Found katex elements:', katexElements.length);
                for (const element of katexElements) {
                    if (element.contains(startNode) && element.contains(endNode)) {
                        const formula = element.textContent;
                        // 处理公式 以换行符分隔，获取最后一个公式
                        const formulas = formula.split('\n');
                        formula = formulas[formulas.length - 1];
                        if (!formula) {
                            if (formulas.length < 2) {
                                console.log('No formula found');
                                return null;
                            }
                            formula = formulas[formulas.length - 2];
                        }
                        console.log('Selected formula:', formula);
                        return '$' + formula + '$';
                    }
                }
            }
            console.log('No formula selected');
            return null;
        }

        copyToClipboard(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    console.log('Copied to clipboard:', text);
                    if (!DEFAULT_COPY) {
                        alert('已复制到剪贴板');
                    }


                })
                .catch((error) => {
                    console.error('Failed to copy to clipboard:', error);
                    if (!DEFAULT_COPY) {
                        alert('复制失败');
                    }
                });
        }

        addEventListeners() {
            document.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                const clickedElement = event.target;
                const katexElement = this.findClosestKatexElement(clickedElement);

                if (katexElement) {

                    const formula = katexElement.textContent;

                    if (formula) {
                        console.log(typeof formula);
                        // 将公式按换行符分割
                        const formulas_origin = formula.split("\n");
                        let formula_text = "";
                        let maxLength = 0;

                        for (let i = 0; i < formulas_origin.length; i++) {
                            // 修剪每个公式的首尾空白
                            const trimmedFormula = formulas_origin[i].trim();
                            // 检查修剪后的公式是否不为空且长度大于当前最大长度
                            if (trimmedFormula.length > 0 && trimmedFormula.length > maxLength) {
                                formula_text = trimmedFormula;
                                maxLength = trimmedFormula.length;
                            }
                        }

                        console.log('在点击的元素中找到的公式:', formula_text);
                        if(!DEFAULT_COPY) {
                            let shouldCopy = window.confirm('是否要复制这个公式?');
                            if (shouldCopy) {
                                this.copyToClipboard('$' + formula_text + '$');
                            }
                        }
                        else {
                            this.copyToClipboard('$' + formula_text + '$');
                        }
                    } else {
                        console.log('No formula found in clicked element');
                    }
                } else {
                    console.log('No katex-mathml element found in clicked area');
                }
                this.showContextMenu(event.pageX, event.pageY);
            });

            document.addEventListener('click', () => {
                this.hideContextMenu();
            });
        }

        findClosestKatexElement(element) {
            let currentElement = element;
            while (currentElement) {
                if (currentElement.classList && currentElement.classList.contains('katex-mathml')) {
                    return currentElement;
                }
                // 检查父元素的同级元素
                let sibling = currentElement.previousElementSibling;
                while (sibling) {
                    if (sibling.classList && sibling.classList.contains('katex-mathml')) {
                        return sibling;
                    }
                    sibling = sibling.previousElementSibling;
                }
                sibling = currentElement.nextElementSibling;
                while (sibling) {
                    if (sibling.classList && sibling.classList.contains('katex-mathml')) {
                        return sibling;
                    }
                    sibling = sibling.nextElementSibling;
                }
                currentElement = currentElement.parentElement;
            }
            return null;
        }

    }
    // 用于复制维基百科和 Wiki 上的公式
    class WikiTeXFormulaCopier {
        constructor() {
            this.init();
        }

        init() {
            if (host.search('wikipedia') >= 0) {
                this.setupWikipedia();
            } else if (host.search('wikiwand') >= 0) {
                this.setupWikiwand();
            }
        }

        clearAnimation(event) {
            event.target.style.animation = '';
        }

        setupWikipedia() {
            const copyTex = function () {
                if(!DEFAULT_COPY) {
                    if (confirm('是否复制该公式？')) {
                        navigator.clipboard.writeText('$' + this.alt + '$');
                        this.style.animation = 'aniclick .2s';
                    }
                }
                else {
                    navigator.clipboard.writeText('$' + this.alt + '$');
                    this.style.animation = 'aniclick .2s';
                }

            }
            const eqs = document.querySelectorAll('.mwe-math-fallback-image-inline, .mwe-math-fallback-image-display');
            for (let i = 0; i < eqs.length; i++) {
                eqs[i].onclick = copyTex;
                eqs[i].addEventListener('animationend', this.clearAnimation);
                eqs[i].title = '点击即可复制公式';
            }
        }

        setupWikiwand() {
            const copyTex = function () {
                const tex = this.getElementsByTagName('math')[0].getAttribute("alttext");
                if(!DEFAULT_COPY) {
                    if (confirm('是否复制该公式？')) {
                        navigator.clipboard.writeText('$' + tex + '$');
                        this.style.animation = 'aniclick .2s';
                    }
                }
                else {
                    navigator.clipboard.writeText('$' + tex + '$');
                    this.style.animation = 'aniclick .2s';
                }

            }
            const check_equations = (mutationList, observer) => {
                const eqs = document.querySelectorAll('.mwe-math-element');
                for (let i = 0; i < eqs.length; i++) {
                    eqs[i].onclick = copyTex;
                    eqs[i].addEventListener('animationend', this.clearAnimation);
                    eqs[i].title = '点击即可复制公式';
                }
            }
            const targetNode = document.getElementsByTagName('article')[0];
            const config = { attributes: false, childList: true, subtree: true };
            const observer = new MutationObserver(check_equations);
            observer.observe(targetNode, config);
        }
    }
    const DEFAULT_COPY = true

    if (host.search('zhihu.com') >= 0||host.search('blog.csdn') >= 0||host.search('wikipedia') >= 0||host.search('wikiwand') >= 0)
    {
        // 默认复制到剪贴板
        const DEFAULT_COPY = window.confirm('是否默认复制到剪贴板？');
        // 网址包含 zhihu.com 的页面
        if (host.search('zhihu.com') >= 0) {
            new zhihuLaTeXFormulaCopier();
        }
        // 网址包含 csdn.net 的页面
        else if (host.search('blog.csdn') >= 0) {
            new csdnKatexFormulaCopier();
        }
        else if (host.search('wikipedia') >= 0 || host.search('wikiwand') >= 0) {
            new WikiTeXFormulaCopier();
        }
    }


})();