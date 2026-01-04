// ==UserScript==
// @name         Bangumi 敏感词检测+替换
// @namespace    https://greasyfork.org/zh-CN/users/1386262-zintop
// @version      1.3.2
// @description  检测bangumi发布/修改内容中含有的敏感词，并进行单个或批量替换，同时支持自定义预设，可自动/手动更新词库
// @author       zintop
// @license      MIT
// @include      /^https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/(.*(group\/topic\/.+\/edit|group\/.+\/settings|group\/.+\/new_topic|blog\/create|blog\/.+\/edit|subject\/.+\/topic\/new|subject\/topic\/.+\/edit|index\/create|index\/.+\/edit|anime\/list\/.+)|subject\/\d+\/?$|settings(\?.*)?$)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537577/Bangumi%20%E6%95%8F%E6%84%9F%E8%AF%8D%E6%A3%80%E6%B5%8B%2B%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/537577/Bangumi%20%E6%95%8F%E6%84%9F%E8%AF%8D%E6%A3%80%E6%B5%8B%2B%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'sensitive_panel_settings';
    const REMOTE_JSON = 'https://raw.githubusercontent.com/zintop/bangumi-sensitive-words/refs/heads/main/bangumi-sensitive-words.json';

    let SENSITIVE_WORDS = [];
    let lastUpdate = '';
    let detectedWords = new Set();
    let regexPresets = JSON.parse(localStorage.getItem('sensitive_regex_presets') || '[]');
    let panelFirstShowDone = false;

    function $(s) { return document.querySelector(s); }

    function savePanelSettings(panel) {
        const s = {
            left: panel.style.left,
            top: panel.style.top,
            width: panel.style.width,
            height: panel.style.height,
            opacity: panel.style.opacity
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    }

    function loadPanelSettings(panel) {
        const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (s.left) panel.style.left = s.left;
        if (s.top) panel.style.top = s.top;
        if (s.width) panel.style.width = s.width;
        if (s.height) panel.style.height = s.height;
        if (s.opacity) panel.style.opacity = s.opacity;
    }

    async function fetchRemoteWords() {
        try {
            const res = await fetch(REMOTE_JSON + '?_=' + Date.now());
            const json = await res.json();
            if (Array.isArray(json)) {
                SENSITIVE_WORDS = json;
                lastUpdate = new Date().toLocaleString();
                const el = $('#sensitive-last-update');
                if(el) el.textContent = `词库更新时间：${lastUpdate}`;
                runDetection();
            }
        } catch (e) {
            console.error('敏感词库更新失败', e);
        }
    }

    // ====== 浮窗适配关灯模式 ======
    function applyTheme() {
        const theme = document.documentElement.getAttribute("data-theme");
        const bg = theme === "dark" ? "#444" : "#fff";
        const panel = $('#sensitive-panel');
        if (panel) panel.style.background = bg;
        document.querySelectorAll('.sensitive-dialog').forEach(d => d.style.background = bg);
    }
    function observeThemeChange() {
        const observer = new MutationObserver(() => applyTheme());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'sensitive-panel';
        panel.style.cssText = `
            position: fixed; top:80px; left:320px; width:280px; max-height:80vh;
            overflow-y:auto; z-index:99999; border:1px solid #f99;
            font-size:13px; font-family:sans-serif; border-radius:8px;
            box-shadow:0 2px 6px rgba(0,0,0,0.15); resize:both; overflow:hidden auto;
            opacity:1; display:none;
        `;
        loadPanelSettings(panel);

        panel.innerHTML = `
            <div id="sensitive-header" style="background:#f99;color:#fff;padding:5px;cursor:move;">敏感词检测</div>
            <div id="sensitive-status" style="padding:5px;"><strong>✅ 没有检测到敏感词</strong></div>
            <div id="sensitive-last-update" style="padding:5px; font-size:11px; color:#666;">词库更新时间：${lastUpdate}</div>
            <div id="sensitive-word-list" style="padding:5px;"></div>
            <div style="padding:5px;">
                <button id="replace-all">全部替换</button>
                <button id="replace-stars">全部替换为**</button>
                <button id="add-preset" style="margin-left:4px;">添加预设</button>
            </div>
            <div style="padding:5px;">
                <button id="update-words">手动更新词库</button>
            </div>
            <div id="preset-list" style="padding:5px;"></div>
        `;
        document.body.appendChild(panel);

        applyTheme();
        observeThemeChange();

        const header = $('#sensitive-header');
        let offsetX=0, offsetY=0, isDown=false;
        header.addEventListener('mousedown', e => { isDown=true; offsetX=e.clientX-panel.offsetLeft; offsetY=e.clientY-panel.offsetTop; e.preventDefault(); });
        document.addEventListener('mouseup', ()=>{isDown=false;});
        document.addEventListener('mousemove', e=>{ if(!isDown) return; panel.style.left=`${e.clientX-offsetX}px`; panel.style.top=`${e.clientY-offsetY}px`; savePanelSettings(panel); });

        const uname = document.querySelector('.avatar')?.getAttribute('href')?.split('/').pop();
        if(!uname) return;
        const dock = document.querySelector('#dock ul>li.first');
        if(dock){
            const li = document.createElement('li');
            li.innerHTML = `<a href="javascript:void(0);" id="toggleSensitiveBtn">敏感词🔍</a><p></p>`;
            dock.after(li);
            $('#toggleSensitiveBtn').addEventListener('click', ()=>{
                panel.style.display = panel.style.display==='none'?'block':'none';
            });
        }

        $('#replace-all').onclick = () => {
            Array.from(detectedWords).forEach(w=>{
                const r=prompt(`将 "${w}" 替换为：`);
                if(r!=null) replaceWordInInputs(w,r);
            });
            runDetection();
        };
        $('#replace-stars').onclick = () => {
            detectedWords.forEach(w=>replaceWordInInputs(w,'*'.repeat(w.length)));
            runDetection();
        };

        $('#add-preset').onclick = showPresetDialog;
        $('#update-words').onclick = fetchRemoteWords;

        renderPresets();
    }

    function updateToggleButtonText(){
        const btn = $('#toggleSensitiveBtn');
        if(!btn) return;
        btn.textContent = detectedWords.size>0 ? '敏感词⚠️' : '敏感词🔍';
        const panel = $('#sensitive-panel');
        if(detectedWords.size>0 && !panelFirstShowDone){
            panel.style.display='block';
            panelFirstShowDone=true;
        }
    }

    function showPresetDialog(editIdx){
        const isEdit = typeof editIdx==='number';
        const existing = isEdit ? regexPresets[editIdx] : null;
        const dialog = document.createElement('div');
        dialog.className = 'sensitive-dialog';
        dialog.style.cssText = `position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
            padding: 20px; z-index: 100000; border: 1px solid #ccc;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3); max-height: 70vh; overflow-y: auto;`;
        dialog.innerHTML = `
            <h3>${isEdit?'编辑':'添加'}预设</h3>
            <div id="preset-items">
                ${existing?existing.rules.map(r=>`<div><input placeholder="指定内容" value="${r.pattern}"> → <input placeholder="替换为" value="${r.replace}"></div>`).join(''):'<div><input placeholder="指定内容"> → <input placeholder="替换为"></div>'}
            </div>
            <button id="add-rule">添加规则</button>
            <br><br>
            <input id="preset-name" placeholder="预设名称（可选）" value="${existing?existing.name:''}"><br><br>
            <button id="save-preset">保存</button>
            <button id="cancel-preset">取消</button>
        `;
        document.body.appendChild(dialog);

        applyTheme(); // 预设弹窗适配关灯模式

        $('#add-rule').onclick=()=>{$('#preset-items').appendChild(document.createElement('div')).innerHTML='<input placeholder="指定内容"> → <input placeholder="替换为">';};
        $('#cancel-preset').onclick=()=>dialog.remove();
        $('#save-preset').onclick=()=>{
            const name=$('#preset-name').value.trim()||`预设${regexPresets.length+1}`;
            const rules=Array.from(dialog.querySelectorAll('#preset-items > div')).map(div=>{
                const inputs=div.querySelectorAll('input');
                return {pattern:inputs[0].value.trim(),replace:inputs[1].value};
            }).filter(r=>r.pattern.length>0);
            if(rules.length===0){alert('请至少添加一个有效的预设规则');return;}
            if(isEdit) regexPresets[editIdx]={name,rules};
            else regexPresets.push({name,rules});
            localStorage.setItem('sensitive_regex_presets',JSON.stringify(regexPresets));
            dialog.remove(); renderPresets(); runDetection();
        };
    }

    function renderPresets(){
        const container=$('#preset-list');
        container.innerHTML='';
        regexPresets.forEach((preset,i)=>{
            const div=document.createElement('div');
            div.style.marginBottom='8px'; div.style.border='1px solid #ddd';
            div.style.padding='6px'; div.style.borderRadius='4px';
            div.innerHTML=`<b>${preset.name}</b>
                <button class="btn-load" data-i="${i}">加载</button>
                <button class="btn-edit" data-i="${i}">编辑</button>
                <button class="btn-delete" data-i="${i}">删除</button>`;
            container.appendChild(div);
        });

        container.querySelectorAll('.btn-load').forEach(btn=>{
            btn.onclick=()=>{
                const preset=regexPresets[btn.dataset.i];
                preset.rules.forEach(rule=>replaceWordInInputs(rule.pattern,rule.replace));
                runDetection();
            };
        });
        container.querySelectorAll('.btn-edit').forEach(btn=>{
            btn.onclick=()=>showPresetDialog(Number(btn.dataset.i));
        });
        container.querySelectorAll('.btn-delete').forEach(btn=>{
            btn.onclick=()=>{
                if(confirm('确定删除此预设？')){
                    regexPresets.splice(Number(btn.dataset.i),1);
                    localStorage.setItem('sensitive_regex_presets',JSON.stringify(regexPresets));
                    renderPresets(); runDetection();
                }
            };
        });
    }

    function replaceWordInInputs(word,replacement){
        const inputs=Array.from(document.querySelectorAll('textarea,input[type=text],input[type=search],input:not([type])')).filter(el=>el.offsetParent!==null);
        inputs.forEach(input=>{
            if(input.value.includes(word)){
                input.value=input.value.split(word).join(replacement);
                input.dispatchEvent(new Event('input',{bubbles:true}));
            }
        });
    }

    function hookInputEvents(){
        const inputs=Array.from(document.querySelectorAll('textarea,input[type=text],input[type=search],input:not([type])')).filter(el=>el.offsetParent!==null);
        inputs.forEach(input=>input.addEventListener('input',()=>runDetection()));
    }

    function runDetection(customRules){
        const list=$('#sensitive-word-list');
        const status=$('#sensitive-status');
        detectedWords.clear(); list.innerHTML='';
        const inputs=Array.from(document.querySelectorAll('textarea,input[type=text],input[type=search],input:not([type])')).filter(el=>el.offsetParent!==null);
        const text=inputs.map(i=>i.value).join('\n');

        SENSITIVE_WORDS.forEach(w=>{if(text.includes(w)) detectedWords.add(w);});
        const rules=customRules||regexPresets.flatMap(p=>p.rules);
        rules.forEach(({pattern})=>{
            let reg; try{reg=new RegExp(pattern,'gi');}catch{return;}
            let match; while((match=reg.exec(text))!==null) detectedWords.add(match[0]);
        });

        if(detectedWords.size===0) status.innerHTML='<strong>✅ 没有检测到敏感词</strong>';
        else status.innerHTML=`<strong style="color:red">⚠️ 检测到${detectedWords.size}个敏感词</strong>`;

        detectedWords.forEach(w=>{
            const div=document.createElement('div'); div.style.marginBottom='4px'; div.style.wordBreak='break-word';
            div.innerHTML=`<strong>${w}</strong> <button class="btn-replace">替换</button>`;
            const btn=div.querySelector('.btn-replace');
            btn.onclick=()=>{
                const r=prompt(`将“${w}”替换为：`);
                if(r!=null){replaceWordInInputs(w,r); runDetection();}
            };
            list.appendChild(div);
        });
        updateToggleButtonText();
    }

    function init(){ createUI(); fetchRemoteWords(); runDetection(); hookInputEvents(); }

    window.addEventListener('load',init);

})();