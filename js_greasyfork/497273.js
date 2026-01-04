// ==UserScript==
// @name         广告标记
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  用户可以对页面的内容进行广告标记
// @author       x
// @match        *://*/*
// @type         system;test
// @grant        GM_addStyle
// @run-at       document-start
// @original-script     https://update.greasyfork.org/scripts/497273/%E5%B9%BF%E5%91%8A%E6%A0%87%E8%AE%B0.user.js
// @downloadURL https://update.greasyfork.org/scripts/497273/%E5%B9%BF%E5%91%8A%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/497273/%E5%B9%BF%E5%91%8A%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let isMarkingMode = false;
	let isPreviewMode = false;
    let currentTarget = null;
    let markedElements = new Set();
    let originalNotifyATagClickFunction = null;
    let originalInterruptElementCreateFunction = null;
    let originalInterruptElementRemoveFunction = null;
    const standardTags = "<a><abbr><acronym><address><applet><area><article><aside><audio><b><base><basefont><bdi>"
                         + "<bdo><big><blockquote><body><br><button><canvas><caption><center><cite><code><col><colgroup>"
                         + "<command><datalist><dd><del><details><dfn><dialog><dir><div><dl><dt><em><embed><fieldset>"
                         + "<figcaption><figure><font><footer><form><frame><frameset><head><header><hgroup><h1><h2>"
                         + "<h3><h4><h5><h6><hr><i><iframe><img><input><ins><kbd><keygen><label><legend><li><link>"
                         + "<main><map><mark><menu><meta><meter><nav><noframes><noscript><object><ol><optgroup>"
                         + "<option><output><p><param><pre><html><picture><progress><q><rp><rt><ruby><s><samp>"
                         + "<script><section><select><small><source><span><strike><strong><style><sub><summary>"
                         + "<sup><table><tbody><td><textarea><template><tfoot><th><thead><time><title><tr>"
                         + "<track><tt><u><ul><var><video><wbr><svg><path><rect><ellipse><line><circle>"
                         + "<polygon><polyline><text><element><filter><feGaussianBlur><feOffset><linearGradient>"
                         + "<radialGradient><stop><defs><x-video>";
 
    // 添加样式用于标记广告元素
    GM_addStyle(`
        .highlight-ad {
            border: 2px solid red !important;
            background-color: rgba(255, 0, 0, 0.1) !important;
        }
		.ad-mark-preview {
			display: none !important; 
			height: 0 !important; 
			overflow: hidden !important;
		}
		.ad-mark-hidden {
            display: none !important;
            height: 0 !important;
            overflow: hidden !important;
        }
    `);

    function handleClick(event) {
        if (!isMarkingMode) return;
 
        event.preventDefault();
        event.stopPropagation();

        markingElement(event.target);
    }

    function markingElement(target) {
        while (target.parentElement != null && target.parentElement.childElementCount == 1) {
            target = target.parentElement;
        }
        currentTarget = target;

        if (target.classList.contains('highlight-ad')) {
            target.classList.remove('highlight-ad');
            markedElements.delete(target);
            console.log('元素已取消广告标记:', target);
        } else {
            target.classList.add('highlight-ad');
            if (isPreviewMode) {
                target.classList.add('ad-mark-preview');
            }

            let isFloating = isFloatingElement(target);
            if (isFloating && target.style && target.getAttribute('style')) {
                let style = target.getAttribute('style');
                let siblings = getElementAllSibling(target);
                if (siblings.length > 0) {
                    for (let i = 0; i < siblings.length; ++i) {
                        let sibling = siblings[i];
                        if (isFloatingElement(sibling) && !sibling.classList.contains('highlight-ad')
                            && sibling.style && sibling.getAttribute('style')) {
                            let s = sibling.getAttribute('style');
                            if (similarity(style, s) >= 0.7) {
                                sibling.classList.add('highlight-ad');

                                if (isPreviewMode) {
                                    sibling.classList.add('ad-mark-preview');
                                }
                            }
                        }
                    }
                }
            }

            markedElements.add(target);
            console.log('元素已标记为广告:', target);
        }

        let allElements = document.querySelectorAll('.highlight-ad');
        GM_invokeCommand('adMark.onElementMarking', {count: allElements.length});
    }
 
    function generateAdblockRule(element) {
        if (!element) {
            return '';
        }

        // 使用tagName和id
        if (element.id) {
            let tagName = element.tagName.toLowerCase();
            if (standardTags.indexOf(tagName) >= 0) {
                return location.hostname + `##${tagName}#${element.id}`;
            }
            return location.hostname + `###${element.id}`;
        }

        // 使用tagName和style
        if (element.style && element.getAttribute('style')) {
            let style = formatElementStyle(element);
            let tagName = element.tagName.toLowerCase();
            if (standardTags.indexOf(tagName) >= 0) {
                return location.hostname + `##${tagName}[style*="${style}"]`;
            }
            return location.hostname + `##[style*="${style}"]`;
        }

        // 使用tagName和class
        var classList = getElementRawClassList(element);
        if (classList && classList.length > 0) {
            let classes = Array.from(classList).join('.');
            let tagName = element.tagName.toLowerCase();
            if (standardTags.indexOf(tagName) >= 0) {
                return location.hostname + `##${tagName}.${classes}`;
            }
            return location.hostname + `##.${classes}`;
        }

        // 使用父元素的id或class结合tagName
        let parent = element.parentElement;
        while (parent) {
            let pTagName = parent.tagName.toLowerCase();
            let eTagName = element.tagName.toLowerCase();

            if (parent.id) {
                if (standardTags.indexOf(pTagName) >= 0) {
                    return location.hostname + `##${pTagName}#${parent.id} > ${eTagName}`;
                }
                return location.hostname + `###${parent.id} > ${eTagName}`;
            }

            if (parent.style && parent.getAttribute('style')) {
                let style = formatElementStyle(parent);
                if (standardTags.indexOf(pTagName) >= 0) {
                    return location.hostname + `##${pTagName}[style*="${style}"] > ${eTagName}`;
                }
                return location.hostname + `##[style*="${style}"] > ${eTagName}`;
            }

            let classList = getElementRawClassList(parent);
            if (classList && classList.length > 0) {
                let parentClasses = Array.from(classList).join('.');
                if (standardTags.indexOf(pTagName) >= 0) {
                    return location.hostname + `##${pTagName}.${parentClasses} > ${eTagName}`;
                }
                return location.hostname + `##.${parentClasses} > ${eTagName}`;
            }

            parent = parent.parentElement;
        }

		return '';
    }
 
    function toggleMarkingMode(opt) {
        isMarkingMode = !isMarkingMode;
 
        if (isMarkingMode) {
            console.log('广告标记模式已开启。点击任意页面元素以标记为广告。');
            document.addEventListener('click', handleClick, true);
            //window.addEventListener("touchend", handleClick, false);
            findAndMarkFloatingElements();

            originalNotifyATagClickFunction = GM_registerCommand('notifyATagClick', function(el) {
                console.log('点击A元素：', el);

                if (isMarkingMode) {
                    markingElement(el);
                }

                if (originalNotifyATagClickFunction != null) {
                    originalNotifyATagClickFunction(el);
                }
            });

            originalInterruptElementCreateFunction = GM_registerCommand('interruptElementCreate', function(el) {
                if (isMarkingMode) {
                    return true;
                }

                if (originalInterruptElementCreateFunction != null) {
                    return originalInterruptElementCreateFunction(el);
                }

                return false;
            });

            originalInterruptElementRemoveFunction = GM_registerCommand('interruptElementRemove', function(el) {
                if (isMarkingMode) {
                    return true;
                }

                if (originalInterruptElementRemoveFunction != null) {
                    return originalInterruptElementRemoveFunction(el);
                }
            });
        } else {
            console.log('广告标记模式已关闭。(' + opt + ')');
            if (originalNotifyATagClickFunction != null) {
                GM_registerCommand('notifyATagClick', originalNotifyATagClickFunction);
                oldNotifyATagClickFunction = null;
            }

            if (originalInterruptElementRemoveFunction != null) {
                GM_registerCommand('interruptElementRemove', originalInterruptElementRemoveFunction);
                originalInterruptElementRemoveFunction = null;
            }

            if (originalInterruptElementCreateFunction != null) {
                GM_registerCommand('interruptElementCreate', originalInterruptElementCreateFunction);
                originalInterruptElementCreateFunction = null;
            }

			if (opt == 1) {
				var items = [];
                markedElements.forEach(el => {
                    var item = {};
                    item.rule = generateAdblockRule(el);
                    item.position = getElementPosition(el);
                    item.stack = parseElementStackTrace(getElementStackTrace(el));
                    items.push(item);
                });
				GM_invokeCommand('adMark.onElementMarkingResult', {host: location.hostname, data: items});
			}
            document.removeEventListener('click', handleClick, true);
            resetMarkedElements(opt == 1);
        }
    }
 
    function findAndMarkFloatingElements() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (isFloatingElement(el) && !markedElements.has(el)) {
                markingElement(el);
            }
        });
        GM_invokeCommand('adMark.onElementMarking', {count: markedElements.size});
    }
 
    function resetMarkedElements(apply) {
        let allElements = document.querySelectorAll('.highlight-ad');
        allElements.forEach(el => {
            if (apply === true) {
                el.classList.add('ad-mark-hidden');
            } else {
                el.classList.remove('highlight-ad', 'ad-mark-preview');
            }
        });
        GM_invokeCommand('adMark.onElementMarking', {count: apply === true ? markedElements.size : 0});
    }
	
	function previewMarkedElements(flags) {
	    if (flags === '1') {
            isPreviewMode = true;
        } else {
            isPreviewMode = false;
        }

        let allElements = document.querySelectorAll('.highlight-ad');
        allElements.forEach(el => {
            if (isPreviewMode) {
                el.classList.add('ad-mark-preview');
            } else {
                el.classList.remove('ad-mark-preview');
            }
        });
    }
 
    function isFloatingElement(element) {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.position === 'fixed' || computedStyle.position === 'sticky') {
            if (computedStyle.zIndex > 2147483000) {
                return true;
            }

            if (computedStyle.zIndex != 0 && computedStyle.opacity === '0.01') {
                return true;
            }
        }

        return false;
    }

    function getElementRawClassList(element) {
        var removeIf = function(ar, value) {
            const index = ar.indexOf(value);
            if (index > -1) {
                ar.splice(index, 1);
            }
        };

        if (element != null && element.classList != null && element.classList.length > 0) {
            let classListCopy = Array.from(element.classList);
            removeIf(classListCopy, 'ad-mark-preview');
            removeIf(classListCopy, 'highlight-ad');
            removeIf(classListCopy, 'ad-mark-hidden');
            return classListCopy;
        }

        return [];
    }
 
    function getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right
        };
    }

    function getElementStackTrace(element) {
        return GM_invokeCommand('getElementStackTrace', element);
    }

    function parseElementStackTrace(stack) {
        var items = [];

        if (stack != null && stack.length > 0) {
            const stackLines = stack.split("\n");

            // 正则表达式匹配方法名、文件名和行号
            const stackRegex = /at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/;

            stackLines.forEach(line => {
                const match = line.match(stackRegex);
                if (match) {
                    //const [fullMatch, methodName, file, lineNumber, columnNumber] = match;
                    //console.log(`Method: ${methodName}, File: ${file}, Line: ${lineNumber}, Column: ${columnNumber}`);
                    var item = {};
                    item.methodName = match[1];
                    item.file = match[2];
                    item.lineNumber = match[3];
                    item.columnNumber = match[4];
                    items.push(item);
                }
            });
        }
        return items;
    }

    function getElementAllSibling(currentElement) {
        // 获取所有前面的兄弟元素
        let previousSiblings = [];
        let prevElem = currentElement.previousElementSibling;
        while (prevElem) {
            previousSiblings.push(prevElem);
            prevElem = prevElem.previousElementSibling;
        }

        // 获取所有后面的兄弟元素
        let nextSiblings = [];
        let nextElem = currentElement.nextElementSibling;
        while (nextElem) {
            nextSiblings.push(nextElem);
            nextElem = nextElem.nextElementSibling;
        }

        // 合并所有兄弟元素
        return previousSiblings.reverse().concat(nextSiblings);
    }

    function formatElementStyle(element) {
        let style = element.getAttribute('style');
        if (isFloatingElement(element)) {
            var idx = style.indexOf('url(');
            if (idx >= 0) {
                return style.substring(0, idx + 4);
            }

            idx = style.indexOf('px;');
            if (idx >= 0) {
                let idx2 = style.lastIndexOf(':', idx);
                if (idx2 < idx) {
                    return style.substring(0, idx2);
                }
            }
        }

        return style;
    }

    function levenshtein(a, b) {
        const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + 1
                    );
                }
            }
        }

        return matrix[a.length][b.length];
    }

    function similarity(a, b) {
        const distance = levenshtein(a, b);
        const maxLen = Math.max(a.length, b.length);
        return (maxLen - distance) / maxLen;
    }

    function longestCommonSubstring(a, b) {
        const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
        let length = 0;
        let end = 0;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                if (a[i - 1] === b[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1] + 1;
                    if (matrix[i][j] > length) {
                        length = matrix[i][j];
                        end = i;
                    }
                }
            }
        }

        return a.slice(end - length, end);
    }

    // 注册菜单项
    GM_registerCommand('adMarkStart', toggleMarkingMode);
    GM_registerCommand('adMarkEnd', toggleMarkingMode);
    GM_registerCommand('adMarkReset', resetMarkedElements);
    GM_registerCommand('adMarkPreview', previewMarkedElements);
})();