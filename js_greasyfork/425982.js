// ==UserScript==
// @name         rational-mod-converter-userjs
// @namespace    iilj
// @version      2022.6.0
// @description  RationalModConverter の userjs 版です．Mod をとる問題の問題文・サンプルに含まれる大きな値を，有理数に変換して横に表示します．
// @author       iilj
// @license      MIT
// @supportURL   https://github.com/iilj/RationalModConverterUserJS/issues
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://yukicoder.me/problems/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425982/rational-mod-converter-userjs.user.js
// @updateURL https://update.greasyfork.org/scripts/425982/rational-mod-converter-userjs.meta.js
// ==/UserScript==
/**
 * Rational reconstruction (mathematics) - Wikipedia
 * https://en.wikipedia.org/wiki/Rational_reconstruction_(mathematics)
 **/
const reconstruct = (n, mod) => {
    let v = [mod, 0];
    let w = [n, 1];
    while (w[0] * w[0] * 2 > mod) {
        const q = Math.floor(v[0] / w[0]);
        const z = [v[0] - q * w[0], v[1] - q * w[1]];
        v = w;
        w = z;
    }
    if (w[1] < 0) {
        w[0] *= -1;
        w[1] *= -1;
    }
    return w;
};

class RationalModConverter {
    constructor() {
        let root = null;
        if (location.hostname === 'atcoder.jp') {
            root = document.getElementById('task-statement');
        }
        else if (location.hostname === 'yukicoder.me') {
            root = document.getElementById('content');
        }
        if (root === null)
            return;
        this.mod = this.searchMod(root);
        if (this.mod === undefined)
            return;
        this.dfsNodes(root);
    }
    searchMod(root) {
        let mod = undefined;
        const scripts = root.querySelectorAll('var > script');
        for (let i = 0; i < scripts.length; i++) {
            if ((mod = this.serarchModSub(scripts[i])) !== undefined)
                return mod;
        }
        const mjxs = root.querySelectorAll('mjx-assistive-mml');
        for (let i = 0; i < mjxs.length; i++) {
            if ((mod = this.serarchModSub(mjxs[i])) !== undefined)
                return mod;
        }
        const katex = root.querySelectorAll('span.katex-html');
        for (let i = 0; i < katex.length; i++) {
            if ((mod = this.serarchModSub(katex[i])) !== undefined)
                return mod;
        }
        return undefined;
    }
    serarchModSub(element) {
        const txt = element.textContent;
        if (txt === null)
            return undefined;
        const ret = RationalModConverter.str2mod.find(([pat]) => txt.indexOf(pat) !== -1);
        if (ret === undefined)
            return undefined;
        return ret[1];
    }
    dfsNodes(root) {
        if (root.classList.contains(RationalModConverter.SPAN_CLASS_NAME))
            return;
        root.childNodes.forEach((childNode) => {
            switch (childNode.nodeName) {
                case 'SPAN':
                case 'DIV':
                case 'P':
                case 'PRE':
                case 'UL':
                case 'OL':
                case 'LI':
                case 'SECTION':
                    this.dfsNodes(childNode);
                    break;
                case '#text':
                    this.rewriteTextNode(childNode, root);
                    break;
            }
        });
    }
    rewriteTextNode(node, parent) {
        if (this.mod === undefined)
            return;
        if (node.nodeValue === null)
            return;
        const match = RationalModConverter.re.exec(node.nodeValue);
        if (match !== null) {
            const len = match.index + match[0].length;
            const nextNode = node.splitText(len);
            const parsed = parseInt(match[0]);
            if (parsed < this.mod && parsed * parsed * 2 > this.mod) {
                const w = reconstruct(parsed, this.mod);
                const newSpan = document.createElement('span');
                newSpan.innerText = w[1] === 1 ? ` ${w[0]}` : ` ${w[0]}/${w[1]}`;
                newSpan.style.color = 'red';
                newSpan.style.marginRight = '0.5rem';
                newSpan.classList.add(RationalModConverter.SPAN_CLASS_NAME);
                parent.insertBefore(newSpan, nextNode);
                // console.log(parsed, w);
            }
            this.rewriteTextNode(nextNode, parent);
        }
    }
}
RationalModConverter.re = /\d+/;
RationalModConverter.SPAN_CLASS_NAME = 'rmc-result-span';
RationalModConverter.str2mod = [
    ['998244353', 998244353],
    ['1000000007', 1000000007],
    ['10^{9}+7', 1000000007],
    ['10^9+7', 1000000007],
    ['109+7', 1000000007],
];

(() => {
    window.addEventListener('load', () => {
        new RationalModConverter();
    });
})();
