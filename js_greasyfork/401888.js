// ==UserScript==
// @name         恢复被浏览器错误翻译的文本块
// @namespace    https://gist.github.com/imlinhanchao/9b826afbeda6f1d99fa85ca2d62d9648
// @homepage     https://github.com/imlinhanchao/script-restore-translate
// @version      0.0.5
// @description  经过浏览器翻译的内容，使用快捷键 Ctrl + Alt + R 即可调出选择器，选中的翻译文本块将会被恢复。
// @author       Hancel
// @include      *
// @grant        none
// @license      MIT
// @supportURL   https://github.com/imlinhanchao/script-restore-translate
// @downloadURL https://update.greasyfork.org/scripts/401888/%E6%81%A2%E5%A4%8D%E8%A2%AB%E6%B5%8F%E8%A7%88%E5%99%A8%E9%94%99%E8%AF%AF%E7%BF%BB%E8%AF%91%E7%9A%84%E6%96%87%E6%9C%AC%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/401888/%E6%81%A2%E5%A4%8D%E8%A2%AB%E6%B5%8F%E8%A7%88%E5%99%A8%E9%94%99%E8%AF%AF%E7%BF%BB%E8%AF%91%E7%9A%84%E6%96%87%E6%9C%AC%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        window.oldbody = document.createElement('div');
        setTimeout(() => { window.oldbody.innerHTML = document.body.innerHTML }, 2000);
        let lastTarget = null;
        let enable = false;

        function clickEvent() {
            enable ? removeSelector() : enableSelector();
            enable = !enable;
            eventBtn.style.backgroundColor = enable ? 'rgba(18, 115, 235, .8)' : 'rgba(100, 100, 100, .8)'
        }

        function createBtn() {
            let eventBtn = document.createElement('div');
            eventBtn.innerHTML = `
<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Generator: Adobe Illustrator 21.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" width="40" height="40">
<g>
<g>
<path style="fill:#DEECF1;" d="M507.5,422.601L420,335.099l42.599-42.299c3.6-3.6,5.101-9.001,3.9-14.101    c-1.199-5.099-4.799-9-9.901-10.8L202.2,182.999c-5.4-1.8-11.4-0.3-15.3,3.9c-4.199,3.9-5.7,9.901-3.9,15.3L267.9,456.599    c1.8,5.101,5.7,8.701,10.8,9.901c5.101,1.199,10.501-0.3,14.101-3.9L335.099,420l87.5,87.5c6,6,15.601,6,21.301,0l63.6-63.6    C513.5,438.2,513.5,428.601,507.5,422.601z"/>
</g>
<g>
<path style="fill:#FFDA2D;" d="M195,120c-8.291,0-15-6.709-15-15V15c0-8.291,6.709-15,15-15s15,6.709,15,15v90    C210,113.291,203.291,120,195,120z"/>
</g>
<g>
<path style="fill:#FFDA2D;" d="M141.899,141.899c-5.7,6-15.3,6-20.999,0l-63.9-63.6c-5.7-5.7-5.7-15.3,0-21.301    c5.999-5.7,15.599-5.7,21.299,0l63.6,63.9C147.9,126.599,147.9,136.199,141.899,141.899z"/>
</g>
<g>
<path style="fill:#FDBF00;" d="M57.114,332.886c-5.859-5.859-5.859-15.352,0-21.211l63.647-63.647    c5.859-5.859,15.352-5.859,21.211,0s5.859,15.352,0,21.211l-63.647,63.647C72.466,338.745,62.974,338.745,57.114,332.886z"/>
</g>
<g>
<path style="fill:#FFDA2D;" d="M248.027,141.973c-5.859-5.859-5.859-15.352,0-21.211l63.647-63.647    c5.859-5.859,15.352-5.859,21.211,0s5.859,15.352,0,21.211l-63.647,63.647C263.379,147.832,253.887,147.832,248.027,141.973z"/>
</g>
<g>
<path style="fill:#FDBF00;" d="M105,210H15c-8.291,0-15-6.709-15-15s6.709-15,15-15h90c8.291,0,15,6.709,15,15    S113.291,210,105,210z"/>
</g>
<path style="fill:#FDBF00;" d="M57.001,56.999l84.899,84.901c-5.7,6-15.3,6-20.999,0l-63.9-63.6   C51.301,72.599,51.301,62.999,57.001,56.999z"/>
<path style="fill:#C5D3DD;" d="M475.7,475.7l-31.8,31.8c-5.7,6-15.3,6-21.301,0l-87.5-87.5L292.8,462.599   c-3.6,3.6-9,5.099-14.101,3.9c-5.099-1.199-9-4.799-10.8-9.901L182.999,202.2c-1.8-5.4-0.298-11.4,3.9-15.3L475.7,475.7z"/>
</g>
`;
            eventBtn.id = '__event_btn';
            Object.assign(eventBtn.style, {
                display: 'none',
                padding: '10px',
                backgroundColor: enable ? 'rgba(18, 115, 235, .8)' : 'rgba(100, 100, 100, .8)',
                position: 'fixed',
                right: '2em',
                top: '2em',
                borderRadius: '50%',
                height: '60px',
                width: '60px',
                boxShadow: '0px 0px 5px rgb(200, 200, 200)',
                cursor: 'pointer',
                zIndex: 9999,
                boxSizing: 'border-box'
            });
            eventBtn.title = 'Ctrl + Alt + D';
            eventBtn.onclick = clickEvent;
            document.body.appendChild(eventBtn);
            return eventBtn;
        }

        let eventBtn = createBtn();

        document.addEventListener('keydown', (e) => {
            if (e.keyCode == 82 && e.ctrlKey && e.altKey) {
                eventBtn.style.display = eventBtn.style.display == 'none' ? 'inline-block' : 'none'
            }
            if (e.keyCode == 68 && e.ctrlKey && e.altKey) {
                clickEvent();
            }
            if (e.keyCode == 69 && e.ctrlKey && e.altKey) {
                window.oldbodyEx = document.createElement('div');
                window.oldbodyEx.innerHTML = document.body.innerHTML
            }
        })

        let overfn = (e) => {
            let target = getNoIgnore(e.target);
            if (!target) return;

            target.dataset.oldbackground = target.style.backgroundColor || '';
            target.dataset.oldcursor = target.style.cursor || 'default';
            target.style.backgroundColor = "rgba(0,0,255,.2)"
            target.style.cursor = 'pointer'

            lastTarget = target;
        }, outfn = (e) => {
            let target = getNoIgnore(e.target);
            if (!target) return;

            target.style.backgroundColor = target.dataset.oldbackground;
            target.style.cursor = target.dataset.oldcursor
        }, clickfn = (e) => {
            let target = getNoIgnore(e.target);
            if (!target) return;

            let selector = getSelector(target);
            let parentEle = target.parentElement;

            if (target.id) selector = '#' + target.id;
            else {
                while(parentEle.nodeName.toLowerCase() != 'body') {
                    selector = (parentEle.id ? '#' + parentEle.id : getSelector(parentEle)) + '>' + selector;
                    if (parentEle.id) break;
                    parentEle = parentEle.parentElement;
                }

                let oldbody = window.oldbody
                if (!oldbody.querySelector(selector) && window.oldbodyEx) oldbody = window.oldbodyEx;
                if(oldbody.querySelector(selector)) {
                    if (target.dataset.restore == 'yes') {
                        target.innerHTML = oldbody.querySelector(selector).innerHTML;
                        target.dataset.restore = undefined;
                        return;
                    }
                    target.innerHTML = `<code>${oldbody.querySelector(selector).innerHTML}</code>`;
                    Object.assign(document.querySelector(selector + '>code').style, {
                        font: 'inherit',
                        background: 'inherit',
                        border: '0',
                        margin: '0',
                        padding: '0',
                        wordWrap: 'inherit',
                        wordBreak: 'inherit',
                        wordSpacing: 'inherit',
                        direction: 'inherit',
                        color: 'inherit'
                    });
                    target.dataset.restore = 'yes';
                }
                else {
                    alert("无法找到该标签的未翻译内容，请尝试恢复原文后按 Ctrl + Alt + E。")
                    console.log(selector);
                }
            }
        };

        function getNoIgnore(target) {
            if (target.id == '__event_btn' || target.parentElement.id == '__event_btn') return null;
            else if(!isIgnore(target)) return target;
            let parentEle = target.parentElement;
            let i = 0;
            while(!isIgnore(parentEle) && i++ < 10) { parentEle = target.parentElement }
            return parentEle;
        }

        function isIgnore(target) {
            return target.id == '__event_btn' || target.parentElement.id == '__event_btn' ||
                target.nodeName.toLowerCase() == 'code' || target.nodeName.toLowerCase() == 'span' || target.nodeName.toLowerCase() == 'font' ||
                target.nodeName.toLowerCase() == 'sup' || target.nodeName.toLowerCase() == 'sub' ||
                target.nodeName.toLowerCase() == 'b' || target.nodeName.toLowerCase() == 'i' || target.nodeName.toLowerCase() == 'u' ||
                target.nodeName.toLowerCase() == 'strong' || target.nodeName.toLowerCase() == 'big' || target.nodeName.toLowerCase() == 'small' ||
                target.nodeName.indexOf('#') == 0;
        }

        function enableSelector() {
            document.body.addEventListener("mouseover", overfn)
            document.body.addEventListener("mouseout", outfn)
            document.body.addEventListener("click", clickfn)
        }

        function removeSelector() {
            document.body.removeEventListener("mouseover", overfn)
            document.body.removeEventListener("mouseout", outfn)
            document.body.removeEventListener("click", clickfn)
            lastTarget.style.backgroundColor = lastTarget.dataset.oldbackground;
            lastTarget.style.cursor = lastTarget.dataset.oldcursor
        }

        function getSelector(ele) {
            let childs = Array.from(ele.parentElement.childNodes).filter(n => n.nodeName.indexOf('#') < 0);
            for (let i = 0; i < ele.parentElement.childElementCount; i++) {
                if(childs[i] == ele) {
                    return `*:nth-child(${i + 1})`;
                }
            }
            return ele.nodeName.toLowerCase();
        }
    }
})();