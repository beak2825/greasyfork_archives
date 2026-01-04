// ==UserScript==
// @name         牌谱分析增强
// @namespace    -
// @version      release-1.1
// @description  给每一手牌后面添加天凤牌型分析连接
// @author       dkq
// @match        *://mjai.ekyu.moe/*
// @icon         -
// @grant        none
// @run-at       document-end
// @license      MIT
//
// @downloadURL https://update.greasyfork.org/scripts/484360/%E7%89%8C%E8%B0%B1%E5%88%86%E6%9E%90%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/484360/%E7%89%8C%E8%B0%B1%E5%88%86%E6%9E%90%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const prefix = 'https://tenhou.net/2/?q=';
    const formatPai = (pais) => {
        let arr = pais.match(/([0-9][mps]|[eswnpfc])/g);
        let ziPais = ' eswnpfc', result = '', curZi = '', preZi = '';
        arr.forEach(pai => {
            if (pai.length == 1) {
                // zipai
                curZi = 'z';
                if(curZi != preZi) {
                    result += preZi;
                    preZi = curZi;
                }
                result += ziPais.indexOf(pai);
            } else {
                // mps
                curZi = pai[1];
                if(curZi != preZi) {
                    result += preZi;
                    preZi = curZi;
                }
                result += pai[0];
            }
        });
        result += curZi;
        return result;
    }
    const run = () => {
        let nodeList = document.querySelectorAll('.tehai-state');
        nodeList.forEach(node => {
            let pais = '';
            node.querySelectorAll(':scope > li').forEach(li => {
                if(!li.classList.contains('fuuro')) {
                    let use = li.querySelector('use');
                    pais += use.getAttribute('href').match(/#pai-([0-9][mps]|[eswnpfc])/)[1];
                }
            });
            let qtext = formatPai(pais);
            let button = document.createElement('button');
            button.textContent = '天凤分析';
            button.addEventListener('click', () => {
                window.open(prefix + qtext);
            });
            node.appendChild(button);
        });
    };
    run();
})();