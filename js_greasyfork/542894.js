// ==UserScript==
// @name         通用商品属性提取器（京东 + 淘宝/天猫 + 1688） JSON 版
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  一键提取京东、淘宝/天猫和1688商品详情中的属性，输出 JSON 格式并提供复制按钮。
// @author       GPT
// @match        *://item.jd.com/*
// @match        *://*.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://item.1688.com/*
// @match        *://detail.1688.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542894/%E9%80%9A%E7%94%A8%E5%95%86%E5%93%81%E5%B1%9E%E6%80%A7%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E4%BA%AC%E4%B8%9C%20%2B%20%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%20%2B%201688%EF%BC%89%20JSON%20%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542894/%E9%80%9A%E7%94%A8%E5%95%86%E5%93%81%E5%B1%9E%E6%80%A7%E6%8F%90%E5%8F%96%E5%99%A8%EF%BC%88%E4%BA%AC%E4%B8%9C%20%2B%20%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%20%2B%201688%EF%BC%89%20JSON%20%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 插入“提取属性”按钮
    function addButton() {
        if (document.getElementById('extract-attrs-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'extract-attrs-btn';
        btn.textContent = '📋 提取属性';
        Object.assign(btn.style, {
            position:     'fixed',
            top:          '100px',
            right:        '20px',
            zIndex:       9999,
            padding:      '10px 14px',
            background:   '#d7000f',
            color:        '#fff',
            border:       'none',
            borderRadius: '5px',
            cursor:       'pointer',
            fontSize:     '14px',
            boxShadow:    '0 2px 8px rgba(0,0,0,0.3)'
        });
        btn.addEventListener('click', extractAttributes);
        document.body.appendChild(btn);
    }

    // 主提取流程
    function extractAttributes() {
        let obj = {};
        const host = location.hostname;

        if (host.includes('jd.com')) {
            obj = parseJD();
        } else if (host.includes('taobao.com') || host.includes('tmall.com')) {
            obj = parseTaobao();
        } else if (host.includes('1688.com')) {
            obj = parse1688();
        } else {
            alert('❌ 当前页面不支持属性提取。');
            return;
        }

        showJSON(obj);
    }

    // 京东解析（兼容新版和旧版）
    function parseJD() {
        const o = {};

        // 尝试使用新版方法解析
        document.querySelectorAll('.goods-base .item').forEach(item => {
            const k = item.querySelector('.name')?.innerText.trim();  // 获取属性名称
            const v = item.querySelector('.text')?.innerText.trim();  // 获取属性值

            if (k && v) {
                o[k] = v;
            }
        });

        // 如果新版方法没有找到数据，则使用旧版方法
        if (Object.keys(o).length === 0) {
            // 新版解析没有找到数据，尝试旧版方法
            // 解析 Ptable 表格中的数据
            document.querySelectorAll('#detail .Ptable, #detail .Ptable-item').forEach(tbl => {
                tbl.querySelectorAll('tr').forEach(tr => {
                    const tds = tr.querySelectorAll('td');
                    if (tds.length >= 2) {
                        const k = tds[0].innerText.trim();
                        const v = tds[1].innerText.trim();
                        if (k) o[k] = v;
                    }
                });
            });

            // 如果 Ptable 没有数据，则使用商品详情项（#goods-detail .item）解析
            if (Object.keys(o).length === 0) {
                const c = document.querySelector('#goods-detail');
                if (c) c.querySelectorAll('.item').forEach(it => {
                    const k = it.querySelector('.name')?.innerText.trim();
                    const v = it.querySelector('.adaptive .text')?.innerText.trim();
                    if (k) o[k] = v;
                });
            }
        }

        return o;
    }

    // 淘宝/天猫解析
    function parseTaobao(){
        const o={};
        document.querySelectorAll('div[class*="infoItem--"]').forEach(it=>{
            const k=it.querySelector('div[class*="infoItemTitle"]')?.innerText.trim();
            const v=it.querySelector('div[class*="infoItemContent"]')?.innerText.trim();
            if(k) o[k]=v;
        });
        if(Object.keys(o).length===0){
            document.querySelectorAll('.attributes-list li').forEach(li=>{
                const text=li.innerText.trim();
                if(text.includes('：')){
                    const [key,val]=text.split('：');
                    o[key.trim()]=val.trim();
                }
            });
        }
        return o;
    }

    // 1688 解析（增强版）
    function parse1688() {
        const o = {};

        // ✅ 结构1：新结构 collapse-body 表格
        document.querySelectorAll('.collapse-body table tr').forEach(tr => {
            const ths = tr.querySelectorAll('th');
            const tds = tr.querySelectorAll('td');
            const n = Math.min(ths.length, tds.length);
            for (let i = 0; i < n; i++) {
                const k = ths[i].innerText.trim();
                const v = tds[i].innerText.trim();
                if (k) o[k] = v;
            }
        });

        // ✅ 结构2：新版模块化样式 .od-pc-attribute .offer-attr-item
        if (Object.keys(o).length === 0) {
            document.querySelectorAll('.od-pc-attribute .offer-attr-item').forEach(item => {
                const k = item.querySelector('.offer-attr-item-name')?.innerText.trim();
                const v = item.querySelector('.offer-attr-item-value')?.innerText.trim();
                if (k && v) o[k] = v;
            });
        }

        return o;
    }

    // 显示 JSON 和复制按钮
    function showJSON(obj){
        // 删除旧面板
        const old=document.getElementById('attrs-json-box');
        if(old) old.remove();

        // 容器
        const container=document.createElement('div');
        container.id='attrs-json-box';
        Object.assign(container.style,{
            position:   'fixed',
            top:        '160px',
            right:      '20px',
            width:      '360px',
            maxHeight:  '60vh',
            background: '#fff',
            border:     '1px solid #ccc',
            padding:    '10px',
            zIndex:     9999,
            boxShadow:  '0 2px 8px rgba(0,0,0,0.2)',
            overflow:   'auto',
            fontSize:   '13px',
            lineHeight: '1.4'
        });

        // JSON 文本
        const pre=document.createElement('pre');
        pre.textContent=JSON.stringify(obj, null, 2);
        Object.assign(pre.style,{whiteSpace:'pre-wrap',wordBreak:'break-all'});
        container.appendChild(pre);

        // 复制按钮
        const copyBtn=document.createElement('button');
        copyBtn.textContent='复制 JSON';
        Object.assign(copyBtn.style,{
            marginTop: '8px',
            padding:   '6px 10px',
            background:'#007eff',
            color:     '#fff',
            border:    'none',
            borderRadius:'4px',
            cursor:    'pointer',
            fontSize:  '13px'
        });
        copyBtn.addEventListener('click', ()=>{
            navigator.clipboard.writeText(pre.textContent);
            copyBtn.textContent='已复制';
            setTimeout(()=>copyBtn.textContent='复制 JSON', 2000);
        });
        container.appendChild(copyBtn);

        document.body.appendChild(container);
    }

    // 入口：延迟加载按钮
    window.addEventListener('load', ()=>setTimeout(addButton,1500));
})();
