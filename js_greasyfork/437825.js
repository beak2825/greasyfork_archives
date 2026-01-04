// ==UserScript==
// @name         csdn屏蔽
// @namespace    https://github/wisenchen
// @version      1.0.1
// @description  搜索引擎自动添加屏蔽csdn语法
// @author       wisen
// @match        https://www.google.com/*
// @match        https://www.baidu.com/*
// @match        https://www.bing.com/*
// @match        https://cn.bing.com/*
// @downloadURL https://update.greasyfork.org/scripts/437825/csdn%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/437825/csdn%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==


document.onload = (()=>{
    function autoAddSuffix() {
        const { input, searchBtn, filterText } = getSearchEngineEls()
        if(input){
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    if (!input.value.endsWith(filterText)) {
                        input.value += filterText;
                    }
                }
            })
        }

       searchBtn && searchBtn.addEventListener('click', e=>{
            if (!input.value.endsWith(filterText)) {
                input.value += filterText;
            }
        })
    }
    function getSearchEngineEls() {
        const searchEngine = new Map([
            ['https://www.google.com',() => ({
                input: document.querySelector('input.gLFyf.gsfi'),
                searchBtn: document.querySelector('button.Tg7LZd'),
                filterText: ' -csdn'
            })],
            ['https://www.baidu.com', ()=> ({
                 input: document.querySelector('#kw'),
                 searchBtn: document.querySelector('#su'),
                 filterText: ' -csdn'
                })
            ],
            ['https://cn.bing.com', () => ({
                input: document.querySelector('#sb_form_q'),
                searchBtn: document.querySelector('#search_icon'),
                 filterText: ' -csdn'
            })]]);
        return searchEngine.get(window.location.origin)()
    }
    autoAddSuffix()
}
)()