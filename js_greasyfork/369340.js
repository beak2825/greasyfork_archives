// ==UserScript==
// @name         A11y
// @namespace    assessibility.colivre.org
// @version      0.3
// @description  Test for assessibility problems
// @author       Aurélio A. Heckert
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369340/A11y.user.js
// @updateURL https://update.greasyfork.org/scripts/369340/A11y.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Test if element has acessibility problems
    // If there is a problem, call `notify(el, <ERROR|WARN>, '<description string>')`
    function testA11yEl(el) {
        var id = el.id

        if (el.tagName == 'IMG' && emptyVal(el.alt) && emptyVal(el.title))
            notify(el, ERROR, 'Image without alt text.', 'https://www.w3.org/WAI/tutorials/images/');

        if (el.tagName == 'A' && noText(el))
            notify(el, ERROR, 'Link without text.');

        if (el.tagName == 'BUTTON' && noText(el))
            notify(el, ERROR, 'Button without text.');

        if (el.tagName.match(/^H[0-9]$/) && noText(el))
            notify(el, ERROR, `Heading ${el.tagName} without text.`);

        if (el.tagName.match(/^H[0-9]$/) && el.nextSibling &&
            el.nextSibling.tagName &&    // The next tag are united to this.
            el.nextSibling.tagName.match(/^H[0-9]$/))
            notify(el, WARN, `Skipping heading ${el.tagName}.`, 'https://www.w3.org/WAI/tutorials/page-structure/headings#heading-ranks');

        if (el.tagName.match(/^H[0-9]$/) && el.nextSibling && el.nextElementSibling &&
            el.nextSibling.constructor == Text && el.nextSibling.textContent.match(/^\s*$/) && // has no text between, only space.
            el.nextElementSibling.tagName.match(/^H[0-9]$/))
            notify(el, WARN, `Skipping heading ${el.tagName}.`, 'https://www.w3.org/WAI/tutorials/page-structure/headings#heading-ranks');

        if (el.tagName.match(/INPUT|TEXTAREA|SELECT/)    &&
             !(el.type=='submit' && !emptyVal(el.value)) &&
             !(el.type=='hidden')                        &&
             !(
               findAncestor(el, (a)=>a.tagName == 'LABEL') /* it is children of a <label> */ ||
               (id && document.querySelector(`label[for=${id}]`)) /* a <label> points to it */
             )
           )
            notify(el, ERROR, `Formfield ${el.tagName} without label.`, 'http://webaim.org/standards/508/checklist#standardn');

    }

    function noText(el) {
        var imgs = []
        imgs.push.apply(imgs, el.querySelectorAll('img'));
        return emptyVal(el) && emptyVal(el.title) && emptyVal(imgs.map((img)=> img.alt).join(''))
    }

    function findAncestor(el, matchFunc) {
        while (el = el.parentNode) {
            if (matchFunc(el)) return el;
        }
        return null;
    }

    var elements = [];
    var a11yBox, a11yList, pointer;
    const ERROR = 'ERROR';
    const WARN  = 'WARN';
    const BOXID = 'a11y-userscript-box';

    const $ = function(query) { return document.querySelector(query) };
    const $$ = function(query) { return document.querySelectorAll(query) };

    function emptyVal(val) {
        if (typeof(val) == 'string') val = val.replace(/\s/g, '');
        return typeof(val) == 'undefined' || val == null || val.length == 0
    }

    function mk(tag, attrs) {
        tag = document.createElement(tag);
        for (var attName in attrs) {
            var attVal = attrs[attName];
            if (attName == 'children') attVal.forEach(([t,a])=> {
                mk(t, Object.assign(a, {parent: tag}));
            });
            else if (attName == 'parent') attVal.appendChild(tag);
            else if (attName == 'text') tag.innerText = attVal;
            else if (attName == 'html') tag.innerHTML = attVal;
            else if (attName.match(/^on/)) tag[attName] = attVal;
            else tag.setAttribute(attName, attVal);
        }
        return tag;
    }

    function buildA11yBox() {
        a11yBox = mk('div', {
            parent: document.body,
            id: BOXID,
            class: BOXID+'-toggle-min',
            children: [
                ['i',{ id: BOXID+'-toggle-min-bt', onclick: toggleMin }]
            ]
        });
        a11yList = mk('ul', {parent: a11yBox});
        mk('style', {
            parent: document.documentElement.firstElementChild,
            html: `
                #${BOXID} {position: fixed; bottom: 0; right: 0; background: rgba(255,255,255,0.7); z-index: 99999; opacity: 1;
                    box-shadow: 0 0 30px rgba(0,0,0,0.6); padding: 15px; border-radius: 15px 0 0 0; color: #000}
                #${BOXID}-toggle-min-bt::before {content: "\\00d7"; position: absolute; top: 2px; left: 2px;
                    display: block; text-align: center; border: 1px solid #CCC; border-radius: 30px;
                    font-size: 24px; line-height: 24px; width: 24px; background: #EEE; cursor: pointer}
                #${BOXID} ul {margin: 0; padding: 0; border: 1px solid rgba(0,0,0,0.2);
                    border-top:none; max-height: 90vh; overflow: auto}
                #${BOXID} li {margin: 0; padding: 6px 10px; border-top: 1px solid rgba(0,0,0,0.1); list-style: none; cursor: pointer}
                .${BOXID}-toggle-min {opacity: 40%}
                .${BOXID}-toggle-min ul {display: none}
                .${BOXID}-ERROR {background: rgba(255,200,200,0.8)}
                .${BOXID}-WARN  {background: rgba(255,250,200,0.8)}
                #${BOXID} li span { font-size: 70%; padding-right: 1em }
                #${BOXID} li p { display: inline; margin: 0 }
                #${BOXID} li a { display: inline-block; margin: 0 0 0 3px; padding: 1px 2px; text-decoration: none;
                    border: 1px solid rgba(0,0,0,0.2); border-radius: 3px; color: #000 }
                #${BOXID}-pointer { position: absolute; left: -1000px; z-index: 99990;
                    border: 2px dashed #FFF; box-shadow: 0 0 110px 25px rgba(0,0,0,0.6) }
                #${BOXID}-pointer i { position: absolute; color: red; text-shadow: 1px 1px 1px #000, 0 0 8px #000;
                    font-size: 90px; line-height: 90px; text-align: center }
                #${BOXID}-pointer-N { top: -90px; width: 100% }
                #${BOXID}-pointer-S { bottom: -90px; width: 100% }
                #${BOXID}-pointer-W { left: -90px }
                #${BOXID}-pointer-E { right: -90px }
            `
        });
        pointer = mk('div', {
            parent: document.body,
            id: BOXID+'-pointer',
            children: [
                ['i', {id: BOXID+'-pointer-N', text: '↓'}],
                ['i', {id: BOXID+'-pointer-S', text: '↑'}],
                ['i', {id: BOXID+'-pointer-W', text: '→'}],
                ['i', {id: BOXID+'-pointer-E', text: '←'}]
            ]
        });
    }

    function toggleMin() {
        a11yBox.className = (a11yBox.className.length > 0)? '' : BOXID+'-toggle-min';
    }

    function notificationClick(notification, el) {
        var rect = el.getBoundingClientRect();
        var x = parseInt(rect.left + window.pageXOffset - 2);
        var y = parseInt(rect.top + window.pageYOffset - 2);
        var w = parseInt(rect.width + 4);
        var h = parseInt(rect.height + 4);
        pointer.style.left = x + 'px';
        pointer.style.top = y + 'px';
        pointer.style.width = w + 'px';
        pointer.style.height = h + 'px';
        $('#'+BOXID+'-pointer-W').style.lineHeight = h + 'px';
        $('#'+BOXID+'-pointer-E').style.lineHeight = h + 'px';
        window.scrollTo(parseInt(x-screen.width/4), parseInt(y-screen.height/4));
        console.log(el);
    }

    function notify(el, type, message, helpURL) {
        if (!a11yBox) buildA11yBox();
        if (elements.filter((reg)=> reg.el==el && reg.message==message).length > 0) return;
        elements.push({ el, message });
        var li = mk('li', {
            parent: a11yList,
            class: BOXID+'-'+type,
            onclick: ()=> notificationClick(this, el),
            children: [
                ['span', {text: type}],
                ['p', {text: message}],
            ]
        });
        if (helpURL) mk('a', {
            href: helpURL,
            target: '_blank',
            text: 'help',
            parent: li
        });
    }

    function walk(el) {
        if (el.id == BOXID) return;
        testA11yEl(el);
        for (var e,i=0; e=el.children[i]; i++) ((e)=> setTimeout(()=> walk(e), 1))(e);
    }

    function testPage() {
        console.log('testing page...');
        walk(document.body);
    }

    testPage();
    setInterval(testPage, 15000);
})();