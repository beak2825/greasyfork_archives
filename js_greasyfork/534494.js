// ==UserScript==
// @name         Nodeseek 帖子标题多样式高亮（可配置，关键词单独样式）
// @namespace    https://nodeseek.com/
// @version      1.0
// @description  关键词高亮，支持每个关键词选不同高亮色，有预设样式，管理面板里图形化在线编辑，所有配置持久存储
// @author       GeQianZZ
// @match        *://www.nodeseek.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534494/Nodeseek%20%E5%B8%96%E5%AD%90%E6%A0%87%E9%A2%98%E5%A4%9A%E6%A0%B7%E5%BC%8F%E9%AB%98%E4%BA%AE%EF%BC%88%E5%8F%AF%E9%85%8D%E7%BD%AE%EF%BC%8C%E5%85%B3%E9%94%AE%E8%AF%8D%E5%8D%95%E7%8B%AC%E6%A0%B7%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534494/Nodeseek%20%E5%B8%96%E5%AD%90%E6%A0%87%E9%A2%98%E5%A4%9A%E6%A0%B7%E5%BC%8F%E9%AB%98%E4%BA%AE%EF%BC%88%E5%8F%AF%E9%85%8D%E7%BD%AE%EF%BC%8C%E5%85%B3%E9%94%AE%E8%AF%8D%E5%8D%95%E7%8B%AC%E6%A0%B7%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====== 1. 内置高亮样式，推荐可拓展 ======
    const HIGHLIGHT_STYLES = {
        yellow: { label: '黄色', style: 'background: #fff2a8; color: #222; border-radius: 2px; padding: 1px 2px;' },
        blue:   { label: '蓝色', style: 'background: #e6f2ff; color: #222; border-radius: 2px; padding: 1px 2px;' },
        green:  { label: '绿色', style: 'background: #d3f9d8; color: #222; border-radius: 2px; padding: 1px 2px;' },
        pink:   { label: '粉色', style: 'background: #fce5ed; color: #bc4a78; border-radius: 2px; padding: 1px 2px;' },
        orange: { label: '橙色', style: 'background: #ffe4c4; color: #d2691e; border-radius: 2px; padding: 1px 2px;' },
        purple: { label: '紫色', style: 'background: #ede8fd; color: #5d3fd3; border-radius: 2px; padding: 1px 2px;' },
        red: {
            label: '红色(喜庆)',
            style: 'background: #ffecec; color: #d7263d; border-radius: 2px; padding: 1px 2px; font-weight: bold;'
        }
    };
    // 供下拉选择
    const STYLE_KEYS = Object.keys(HIGHLIGHT_STYLES);

    // ====== 2. 默认关键词数组：[{word, styleKey}] ======
    const DEFAULT_KEYWORDS = [
        {word: '抽', style: 'red'},
    ];

    // ====== 3. 配置管理 ======
    async function loadKeywords() {
        const str = await GM_getValue('HIGHLIGHT_KEYWORDS2', '');
        if (str) {
            try {
                const arr=JSON.parse(str);
                // 兼容旧格式
                if(Array.isArray(arr) && typeof arr[0]==='object') return arr;
                // 旧格式情况：字符串数组
                return arr.map(w=>({word:w,style:'yellow'}))
            } catch (e) {
                return DEFAULT_KEYWORDS;
            }
        } else {
            return DEFAULT_KEYWORDS;
        }
    }
    function saveKeywords(arr) {
        return GM_setValue('HIGHLIGHT_KEYWORDS2', JSON.stringify(arr));
    }

    // ====== 4. 高亮逻辑实现 ======
    /**
     * 为每组关键词生成正则和style，返回数组 [{regex, style}]，忽略大小写
     */
    function preparePatterns(keywords) {
        // 优化性能：按长度降序，长的在前
        let patList = keywords
            .filter(x=>x.word && x.style && STYLE_KEYS.includes(x.style))
            .sort((a,b)=>b.word.length - a.word.length)
            .map(x=> ({
                regex: new RegExp(x.word.replace(/([.*+?^${}()|[\]\\])/g, "\\$1"), "gi"),
                style: HIGHLIGHT_STYLES[x.style].style
            }));
        return patList;
    }

    /**
     * 用于递归每个 post-title 元素，只处理一次
     */
    function highlightInElement(element, patterns) {
        if (!element) return;
        // 用 patterns.length 作标记防止多余递归
        if (element.dataset.highlightVer === String(patterns.length)) return;
        element.dataset.highlightVer = String(patterns.length);
        for (let node of Array.from(element.childNodes)) {
            if (node.nodeType === Node.TEXT_NODE) {
                let orig = node.data;
                let replaced = orig;
                let matched = false;
                // 依次对每种关键字正则替换，高亮样式独立
                for (let {regex, style} of patterns) {
                    regex.lastIndex=0;
                    // 采用replace+callback，避免重叠关键词重复包裹
                    replaced = replaced.replace(regex, match => {
                        matched=true;
                        // 不允许递归嵌套
                        return `<span style="${style}">${match}</span>`;
                    });
                }
                if(matched && orig!==replaced){
                    const span = document.createElement('span');
                    span.innerHTML = replaced;
                    node.replaceWith(span);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                highlightInElement(node, patterns);
            }
        }
    }

    function highlightAll(patterns) {
        document.querySelectorAll('.post-title').forEach(el => highlightInElement(el, patterns));
    }

    // ====== 5. 配置可视化管理面板 ======
    const ICON_STYLE = `
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9999;
      width: 32px;
      height: 32px;
      background: #222c;
      color: #fff;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 1px 1px 6px #8883;
      font-size: 24px;
      user-select: none;
    `;
    const DIALOG_STYLE = `
      position: fixed;
      bottom: 80px;
      right: 32px;
      background: #fff;
      color: #222;
      border-radius: 8px;
      box-shadow: 0 4px 16px #0002;
      padding: 18px 16px 12px 16px;
      min-width: 320px;
      z-index: 99999;
    `;

    function createSettingPanel(current, onSave){
        if(document.getElementById('highlight-setting-dialog2')) return;
        let div=document.createElement('div');
        div.id='highlight-setting-dialog2';
        div.setAttribute('style',DIALOG_STYLE);

        // 生成行
        let makeRow = (row, idx)=>{
            let idWord = 'kwd_word_'+idx;
            let idStyle = 'kwd_style_'+idx;
            let opts = STYLE_KEYS.map(key=>
                `<option value="${key}" ${row.style===key?'selected':''}>
                    ${HIGHLIGHT_STYLES[key].label}
                </option>`
            ).join('');
            let previewStyle = HIGHLIGHT_STYLES[row.style]?.style || '';
            return `
              <div style="margin-bottom: 6px;display:flex;align-items:center;gap:6px">
                <input id="${idWord}" type="text" value="${row.word||''}" placeholder="关键词" style="width:110px;">
                <select id="${idStyle}">${opts}</select>
                <span style="${previewStyle};margin-left:2px;min-width:34px;">${row.word||'示例'}</span>
                <button data-rm="${idx}" style="margin-left:3px" title="删除">🗑️</button>
              </div>
            `;
        };

        let html = `
            <div style="font-weight:bold;margin-bottom:6px">关键词高亮管理</div>
            <div id="kwd-list">
                ${current.map(makeRow).join('')}
            </div>
            <button id="kwd-add-btn" style="margin-top:8px">➕ 新增行</button>
            <div style="text-align:right;margin-top:10px;">
                <button id="kwd-save-btn">保存</button>
                <button id="kwd-cancel-btn">取消</button>
            </div>
        `;
        div.innerHTML = html;
        document.body.appendChild(div);

        // 动态事件绑定
        div.querySelector('#kwd-add-btn').onclick = ()=>{
            current.push({word:'', style:'yellow'});
            refresh();
        };
        div.querySelector('#kwd-save-btn').onclick = ()=>{
            // 收集数据
            let listEl = div.querySelectorAll('[id^=kwd_word_]');
            let newList=[];
            for(let i=0;i<listEl.length;i++){
                let w = div.querySelector(`#kwd_word_${i}`).value.trim();
                let s = div.querySelector(`#kwd_style_${i}`).value;
                if(w) newList.push({word:w, style:s});
            }
            onSave(newList);
            div.remove();
        };
        div.querySelector('#kwd-cancel-btn').onclick = ()=>div.remove();
        // 删除行
        div.querySelectorAll('button[data-rm]').forEach(btn=>{
            btn.onclick=(e)=>{
                let idx=parseInt(btn.getAttribute('data-rm'));
                current.splice(idx,1);
                refresh();
            }
        });
        // 刷新自己
        function refresh(){
            div.remove();
            createSettingPanel(current, onSave);
        }
    }

    // 浮动小按钮
    function createFloatingIcon(){
        if(document.getElementById('highlight-setting-icon2')) return;
        let icon=document.createElement('div');
        icon.id='highlight-setting-icon2';
        icon.setAttribute('style',ICON_STYLE);
        icon.title="配置高亮关键词和风格";
        icon.innerHTML='🎨';
        icon.onclick=async ()=>{
            let current=await loadKeywords();
            createSettingPanel(JSON.parse(JSON.stringify(current)), async function(newList){
                await saveKeywords(newList);
                location.reload();
            });
        };
        document.body.appendChild(icon);
    }

    // ====== 6. 启动脚本主逻辑 ======
    let observer = null;
    async function main() {
        let KEYWORDS = await loadKeywords();
        const patterns = preparePatterns(KEYWORDS);
        highlightAll(patterns);

        if(observer) observer.disconnect();
        observer = new MutationObserver(mutations=>{
            for(let m of mutations){
                for(let n of m.addedNodes){
                    if(n.nodeType === Node.ELEMENT_NODE){
                        if(n.classList && n.classList.contains('post-title')){
                            highlightInElement(n, patterns);
                        }else if(n.querySelectorAll){
                            n.querySelectorAll('.post-title').forEach(el=>highlightInElement(el, patterns));
                        }
                    }
                }
            }
        });
        observer.observe(document.body, {childList:true, subtree:true});
    }

    createFloatingIcon();
    main();

})();