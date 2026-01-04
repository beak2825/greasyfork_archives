// ==UserScript==
// @name           Crunchyroll Auto Skip with Settings
// @name:fr        Crunchyroll Saut Automatique avec Paramètres
// @name:fr-CA        Crunchyroll Saut Automatique avec Paramètres
// @name:ar        تخطي تلقائي لـ Crunchyroll مع الإعدادات
// @name:ca        Crunchyroll Auto Skip amb Configuracions
// @name:zh-CN     Crunchyroll 自动跳过设置
// @name:de        Crunchyroll Automatisches Überspringen mit Einstellungen
// @name:hi        क्रंचीरोल ऑटो स्किप सेटिंग्स के साथ
// @name:id        Crunchyroll Lewati Otomatis dengan Pengaturan
// @name:it        Crunchyroll Salta Automaticamente con Impostazioni
// @name:ja        Crunchyroll 自動スキップ設定付き
// @name:ms        Crunchyroll Langkau Auto dengan Tetapan
// @name:pl        Crunchyroll Automatyczne Pomijanie z Ustawieniami
// @name:pt-PT     Crunchyroll Pular Automático com Configurações
// @name:ru        Crunchyroll Автоматическое Пропускание с Настройками
// @name:es        Crunchyroll Salto Automático con Configuraciones
// @name:ta        க்ரஞ்சிரோல் தானியங்கி தவிர்க்கும் அமைப்புகளுடன்
// @name:te        క్రంచిరోల్ ఆటో స్కిప్ సెట్టింగులతో
// @name:th        Crunchyroll ข้ามอัตโนมัติพร้อมการตั้งค่า
// @name:tr        Crunchyroll Ayarlarla Otomatik Geçiş
// @name:vi        Crunchyroll Tự động Bỏ qua với Cài đặt
//
// @description    Automatically skip the intro and ending if available.
// @description:fr Sauter automatiquement l'intro et la fin si elles sont disponibles.
// @description:fr-CA Sauter automatiquement l'intro et la fin si elles sont disponibles.
// @description:ar تخطي تلقائي للمقدمة والنهاية إذا كانت متوفرة.
// @description:ca Salta automàticament la introducció i el final si estan disponibles。
// @description:zh-CN 自动跳过片头和片尾（如果可用）。
// @description:de Überspringt automatisch das Intro und Ende, wenn verfügbar。
// @description:hi परिचय और अंत को स्वचालित रूप से छोड़ें, यदि उपलब्ध हो。
// @description:id Lewati intro dan akhir secara otomatis jika tersedia。
// @description:it Salta automaticamente l'intro e il finale se disponibili。
// @description:ja イントロとエンディングを自動的にスキップします（利用可能な場合）。
// @description:ms Langkau intro dan akhir secara automatik jika tersedia。
// @description:pl Automatycznie pomija intro i zakończenie, jeśli są dostępne。
// @description:pt-PT Pule automaticamente a introdução e o final, se disponível。
// @description:ru Автоматически пропускать вступление и концовку, если они доступны。
// @description:es Omite automáticamente la introducción y el final si están disponibles。
// @description:ta தொடக்கமும் முடிவும் கிடைத்தால் தானாகவே தவிர்க்கப்படும்。
// @description:te యింట్రో మరియు ఎండింగ్‌ను ఆటోమేటిక్‌గా స్కిప్ చేయండి, అందుబాటులో ఉంటే。
// @description:th ข้ามส่วนเปิดและส่วนท้ายโดยอัตโนมัติหากมีให้。
// @description:tr Giriş ve bitişi otomatik olarak atlar (eğer mevcutsa)。
// @description:vi Tự động bỏ qua phần giới thiệu và phần kết nếu có।
//
// @namespace    https://greasyfork.org/scripts/513644
// @version      5.0
// @author       MASTERD
// @match        *://*.crunchyroll.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513644/Crunchyroll%20Auto%20Skip%20with%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/513644/Crunchyroll%20Auto%20Skip%20with%20Settings.meta.js
// ==/UserScript==

(() => {
    /************** Configuration **************/
    const SCRIPT_VERSION = '5.0';
    const supportedLanguages = ['en','fr','ar','ca','zh','de','es','hi','id','it','ja','ms','pl','pt','ru','ta','te','th','tr','vi'];
    const userLanguage = supportedLanguages.find(l => navigator.language.startsWith(l)) || 'en';
    const defaultSettings = {
        AutoSkipActive: true, AutoSkipDelay: 0, OverlayAutoSave: false, OverlayAlertShow: true,
        HistoryButton: true, WatchlistButton: true, ArrowLeftAutoSkip: false, ArrowRightAutoSkip: true,
        SkipButtonAllow: false, SkipButton: "ArrowRight"
    };
    const loadSettings = () => {
        let stored = {};
        try { stored = JSON.parse(localStorage.getItem("AutoSkipParameter")) || {}; } catch (e) { stored = {}; }
        const merged = { ...defaultSettings, ...stored };
        localStorage.setItem("AutoSkipParameter", JSON.stringify(merged));
        return merged;
    };
    let settings = loadSettings();
    // Mise à jour des anciennes clés
    const cleanUpdate = () => {
        const oldKeys = ['active','delay','exsave','show'];
        const newKeys = ['AutoSkipActive','AutoSkipDelay','OverlayAutoSave','OverlayAlertShow'];
        const parseValue = v => (v==='\"true\"'?true : v==='\"false\"'?false : !isNaN(v)? Number(v): v);
        oldKeys.forEach((key,i) => {
            const value = localStorage.getItem(key);
            if (value !== null) { settings[newKeys[i]] = parseValue(value); localStorage.removeItem(key); }
        });
        Object.keys(settings).forEach(k => { if (!(k in defaultSettings)) delete settings[k]; });
        localStorage.setItem("AutoSkipParameter", JSON.stringify(settings));
    };
    cleanUpdate();
    let OrigineLoad = JSON.parse(localStorage.getItem("AutoSkipParameter"));
    let firstLoad = true, mutationObserverActive = true;
    let ObsSettingsButton = true, observerSkipButt = true, HisButton = true, WatButton = true;

    /************** Utilitaires **************/
    const $el = (tag, styles = {}, text = '', tabIndex = null) => {
        const el = document.createElement(tag);
        Object.assign(el.style, styles);
        if (text) el.textContent = text;
        if (tabIndex !== null) el.tabIndex = tabIndex;
        return el;
    };
    const hoverFocus = (el1, on1 = {}, off1 = {}, el2 = null, on2 = {}, off2 = {}) => {
        const applyStyles = () => { Object.assign(el1.style, on1); if (el2) Object.assign(el2.style, on2); };
        const removeStyles = () => { Object.assign(el1.style, off1); if (el2) Object.assign(el2.style, off2); };
        el1.addEventListener('mouseover', applyStyles);
        el1.addEventListener('mouseout', removeStyles);
        el1.addEventListener('focus', applyStyles);
        el1.addEventListener('blur', removeStyles);
    };
    const navigate = (dir, cur, idx) => {
        const els = Array.from(document.querySelectorAll(`div[tabindex="${idx}"], button[tabindex="${idx}"], input[tabindex="${idx}"]`));
        const next = els[(els.indexOf(cur) + (dir==='up' ? -1 : 1) + els.length) % els.length];
        if (next) { next.focus(); if (next.tagName==='INPUT') next.select(); }
    };

    /************** Interface Settings **************/
    const addSettingsButton = () => {
        const SVG = `
        <svg class="header-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="Skip Settings" style="height:3rem;width:3rem">
            <path d="M12,15.2 C10.233,15.2 8.8,13.767 8.8,12 C8.8,10.233 10.233,8.8 12,8.8 C13.767,8.8 15.2,10.233 15.2,12 C15.2,13.767 13.767,15.2 12,15.2 Z M19.969,11.501 C19.969,11.354 19.911,11.224 19.797,11.11 C19.682,10.995 19.562,10.928 19.437,10.907 L18.344,10.75 C18.010,10.709 17.792,10.531 17.688,10.218 L17.281,9.219 C17.135,8.928 17.157,8.646 17.344,8.375 L18.031,7.501 C18.218,7.230 18.208,6.969 18.000,6.719 L17.250,6.000 C17.021,5.792 16.770,5.782 16.499,5.969 L15.625,6.625 C15.354,6.833 15.072,6.865 14.782,6.719 L13.781,6.312 C13.536,6.183 13.421,6.047 13.306,5.912 C13.250,5.782 13.094,4.562 13.094,4.562 L11.500,4.031 C11.354,4.031 11.224,4.089 11.110,4.203 C10.994,4.317 10.926,4.437 10.906,4.562 L10.749,5.656 C10.531,6.208 10.219,6.312 9.219,6.719 C8.646,6.374 8.375,6.406 7.500,5.969 C7.229,5.781 6.969,5.792 6.719,6.000 L6.000,6.719 C5.782,7.093 5.969,7.500 6.625,8.375 C6.783,8.646 6.719,9.219 6.312,10.219 C6.047,10.579 5.782,10.749 4.562,10.906 C4.437,10.995 4.031,11.354 4.031,11.500 C4.031,11.771 4.000,12.000 4.000,12.000 L4.031,12.500 C4.031,12.776 4.089,12.890 4.203,12.890 L5.656,13.250 C6.046,13.422 6.312,13.782 6.719,14.782 C6.864,15.073 6.625,15.626 5.969,16.501 C5.782,16.989 5.936,17.156 5.984,17.250 L6.094,17.391 C6.219,17.531 6.344,17.656 6.469,17.782 C6.817,18.020 7.016,18.063 7.501,18.031 L8.375,17.375 C8.926,17.281 9.219,17.281 10.219,17.688 C10.579,17.953 10.749,18.344 10.906,19.438 C10.994,19.682 11.212,19.968 11.500,19.968 L12.000,20.000 C12.228,20.000 12.499,19.968 12.890,19.796 C13.093,19.437 13.250,18.344 13.250,18.344 C13.656,17.953 13.781,17.688 14.782,17.281 C15.218,17.063 15.625,17.375 16.501,18.031 C16.906,18.311 17.281,18.000 18.000,17.281 L17.344,15.625 C17.157,15.052 17.281,14.782 17.688,13.782 C17.843,13.312 18.218,13.250 19.438,13.094 C19.797,12.890 19.969,12.345 19.969,12.000 C19.969,11.771 19.969,11.500 19.969,11.500 Z" fill="currentColor"/>
            <text x="12" y="14" text-anchor="middle" font-weight="900" font-size="7" fill="#ff640a" style="paint-order:stroke;text-shadow:-1px -1px #000,1px -1px #000,-1px 1px #000,1px 1px #000;pointer-events:none">SKIP</text>
        </svg>
        `;
        const userActions = document.querySelector('.erc-user-actions');
        const headerActions = document.querySelector('.header-actions');
        const shellActions = document.querySelector('.erc-user-actions-shell');
        const actions = userActions || headerActions;
        if (!actions || actions.querySelector('.settings-button') || shellActions) return;
        const settingsBtn = $el('div', {}, '', 0);
        settingsBtn.innerHTML = `<div class="erc-header-svg">`+SVG+`</div>`;
        settingsBtn.classList.add('erc-header-tile', 'state-icon-only', 'settings-button');
        settingsBtn.addEventListener('click', showSettingsWindow);
        settingsBtn.addEventListener('keydown', e => { if ([' ', 'Enter'].includes(e.key)) { e.preventDefault(); showSettingsWindow(); } });
        if(userActions){
            const li = $el('li'); li.classList.add('user-actions-item'); li.appendChild(settingsBtn); actions.appendChild(li);
        }else{
            const div = $el('div'); div.classList.add('nav-horizontal-layout__action-item--KZBne'); div.appendChild(settingsBtn); actions.appendChild(div);
        };
    };
    const showSettingsWindow = () => {
        const overlay = $el('div', { position:'fixed', top:'0', left:'0', width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.4)', zIndex:'9994' });
        overlay.id = 'settingsOverlay';
        const win = $el('div', {
            position:'fixed', top:'10%', left:'25%', width:'50%', maxHeight:'80vh', overflow:'auto', userSelect: 'none',
            backgroundColor:'white', zIndex:'9995', boxShadow:'0px 0px 10px rgba(0,0,0,0.5)', borderRadius:'10px', padding:'20px', minWidth:'400px'
        });
        win.id = 'settingsWindow'; win.tabIndex = 0;
        win.addEventListener('mouseover', ({target}) => {
            const active = document.activeElement;
            if (!(active.tagName==='INPUT' && active.type==='text') && !(target.tagName === 'INPUT' && target.type === 'checkbox') && win.contains(target) && target.tabIndex>=0) target.focus();
        });
        win.addEventListener('keydown', e => {
            if (e.key === 'Escape') { hideSettingsWindow(); }
            if (document.activeElement === win) {
                const navigationKeys = ['Tab', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
                if (navigationKeys.includes(e.key)) { e.preventDefault(); closeBtn.focus(); }
            }
        });

        const versionLabel = $el('span', { position: 'absolute', top: '5px', left: '50%', fontSize: '1vw', color: 'gray' }, `v${SCRIPT_VERSION}`);
        win.appendChild(versionLabel);

        const closeBtn = createButton('X', hideSettingsWindow, 1, { fontSize:'2.5vw', padding:'0.5vw', maxWidth:'4vw', maxHeight:'4vw', minWidth:'4vw', minHeight:'4vw' });
        const title = $el('p', { flexGrow:'1', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontSize:'2vw', color:'rgb(255,124,0)', fontWeight:'bold', padding:'10px',
                                webkitTextStroke:'1px black', textShadow:'rgb(255,124,0) 0px 0px 12px', display:'flex', alignItems: 'center'
                               }, translations[userLanguage].HeadLabelTitle, 1);
        const img = $el('img', { margin:'10px', width:'1.5em', height:'1.5em', borderRadius:'2000px', boxShadow:'inset 0 0 20px rgb(255,124,0), 0 0 15px 4px rgb(255,124,0)' });
        img.src = '/build/assets/img/favicons/apple-touch-icon-v2-114x114.png';
        title.insertBefore(img, title.firstChild);
        const header = createSection([title, closeBtn], { maxWidth:'100vw', maxHeight:'5vw', position:'sticky', top:'0', display:'flex', alignItems: 'center', justifyContent:'space-between' }, 1);
        const autoSkip = createSection([
            createToggle(translations[userLanguage].AutoSkipActiveToggle, settings.AutoSkipActive, v=>settings.AutoSkipActive=v, 1),
            createInput(translations[userLanguage].AutoSkipDelayInput, settings.AutoSkipDelay, v=>settings.AutoSkipDelay=parseInt(v,10), 1),
            createArrowSkipSection()
        ], {}, 1);
        const SkipButton = createSection([
            createToggle(translations[userLanguage].SkipButtonToggle, settings.SkipButtonAllow, v=>settings.SkipButtonAllow=v, 1),
            createInputButton(translations[userLanguage].SkipButtonLabel, settings.SkipButton, v=>settings.SkipButton=v, 1)
        ], {}, 1);
        const overlaySec = createSection([
            createToggle(translations[userLanguage].OverlayAlertShowToggle, settings.OverlayAlertShow, v=>settings.OverlayAlertShow=v, 1),
            createToggle(translations[userLanguage].OverlayAutoSaveToggle, settings.OverlayAutoSave, v=>settings.OverlayAutoSave=v, 1)
        ], {}, 1);
        const otherSec = createSection([
            createToggle(translations[userLanguage].HistoryButtonToggle, settings.HistoryButton, v=>settings.HistoryButton=v, 1),
            createToggle(translations[userLanguage].WatchlistButtonToggle, settings.WatchlistButton, v=>settings.WatchlistButton=v, 1)
        ], {}, 1);
        const defBtn = createButton(translations[userLanguage].defaultButton, resetDefaults, 1);
        defBtn.addEventListener('keydown', e=> { if(e.key==='Tab'){ e.preventDefault(); closeBtn.focus(); }});
        const btnSec = createSection([
            createButton(translations[userLanguage].saveButton, saveAndClose, 1),
            createButton(translations[userLanguage].cancelButton, hideSettingsWindow, 1),
            defBtn
        ], { display:'flex', justifyContent:'space-between' }, 1);
        const br = document.createElement('br');
        win.append(header, br, autoSkip, br.cloneNode(true), SkipButton, br.cloneNode(true), overlaySec, br.cloneNode(true), otherSec, br.cloneNode(true), btnSec);
        document.body.append(overlay, win);
        overlay.addEventListener('click', handleOverlayClick);
        closeBtn.focus();
    };

    const createSection = (children, styles = {}, idx) => {
        const sec = createElementWithStyles('div', { borderRadius: 'inherit', userSelect: 'none', border: 'outset', padding: '5px', ...styles });
        sec.tabIndex = 0;
        children.forEach(c => sec.appendChild(c));
        const firstFocusableChild = children.find(c => c.tabIndex === idx);
        sec.addEventListener('keydown', e => { if (document.activeElement === sec && ['Tab', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); if (firstFocusableChild) firstFocusableChild.focus(); }});
        return sec;
    };
    const createElementWithStyles = (tag, styles, text='') => {
        const el = document.createElement(tag);
        Object.assign(el.style, styles);
        if(text) el.textContent = text;
        return el;
    };
    const createArrowSkipSection = () => {
        const sec = $el('div', { display:'flex', alignItems:'center', padding:'5px', width:'fit-content', borderRadius:'inherit' });
        const lab = $el('p', { color:'black', padding:'5px 10px', borderRadius:'inherit', transition:'background-color 0.2s ease' }, translations[userLanguage].ArrowAutoSkipToggle);
        hoverFocus(lab, { backgroundColor: '#ff640a', boxShadow: '0 0 15px rgba(255,124,0,1)' }, { backgroundColor: '', boxShadow: '' });
        const leftT = createToggle('[⬅]', settings.ArrowLeftAutoSkip, v=>settings.ArrowLeftAutoSkip=v, 1);
        const rightT = createToggle('[➡]', settings.ArrowRightAutoSkip, v=>settings.ArrowRightAutoSkip=v, 1);
        const [lChk, rChk] = [leftT.querySelector('input[type="checkbox"]'), rightT.querySelector('input[type="checkbox"]')];
        const sync = () => {
            const newVal = !(lChk.checked && rChk.checked);
            [lChk, rChk].forEach(chk => chk.checked = newVal);
            Object.assign(settings, { ArrowLeftAutoSkip:newVal, ArrowRightAutoSkip:newVal });
        };
        lab.addEventListener('click', () => requestAnimationFrame(sync));
        sec.append(lab, leftT, rightT);
        return sec;
    };
    const createToggle = (labText, isChecked, onChange, idx) => {
        const cont = document.createElement('div');
        Object.assign(cont.style, { display:'flex', alignItems:'center', cursor:'pointer', padding:'5px', width:'fit-content', transition:'background-color 0.2s ease', borderRadius:'inherit' });
        cont.tabIndex = idx;
        hoverFocus(cont, { backgroundColor: '#ff640a', boxShadow: '0 0 15px rgba(255,124,0,1)' }, { backgroundColor: '', boxShadow: '' });
        cont.addEventListener('click', () => { chk.checked = !chk.checked; onChange(chk.checked); });

        let Up='up', Down='down';
        if(labText===translations[userLanguage].saveChoice){ Up='down'; Down='up'; }

        cont.addEventListener('keydown', e => {
            if([' ','Enter'].includes(e.key)){ e.preventDefault(); chk.checked = !chk.checked; onChange(chk.checked); }
            else if(['ArrowUp','ArrowLeft'].includes(e.key)) { e.preventDefault(); navigate(Up, cont, idx); }
            else if(['ArrowDown','ArrowRight'].includes(e.key)) { e.preventDefault(); navigate(Down, cont, idx); }
        });
        const chk = document.createElement('input');
        chk.type = 'checkbox'; chk.checked = isChecked; chk.style.cursor = 'pointer';
        hoverFocus(chk, { boxShadow: '0 0 15px rgba(255,124,0,1)' }, { boxShadow: '' }, cont, { backgroundColor: '#ff640a' }, { backgroundColor: '' });
        chk.addEventListener('click', e => { e.stopPropagation(); onChange(chk.checked); });
        const lab = document.createElement('label'); lab.textContent = labText;
        Object.assign(lab.style, { color:'black', padding:'0 10px', cursor:'pointer' });
        cont.append(lab, chk);
        return cont;
    };
    const createInput = (labText, val, onChange, idx) => {
        const cont = document.createElement('div');
        Object.assign(cont.style, { display:'flex', alignItems:'center', padding:'5px', width:'fit-content', transition:'background-color 0.2s ease', borderRadius:'inherit', cursor:'pointer' });
        cont.addEventListener('click', () => { if(document.activeElement!==inp){ inp.focus(); inp.select(); }});
        hoverFocus(cont, { backgroundColor: '#ff640a', boxShadow: '0 0 15px rgba(255,124,0,1)' }, { backgroundColor: '', boxShadow: '' });
        const inp = document.createElement('input'); inp.type='text'; inp.value = val; inp.tabIndex = idx; inp.style.width='100%';
        hoverFocus(inp, { boxShadow: '0 0 15px rgba(255,124,0,1)' }, { boxShadow: '' }, cont, { backgroundColor: '#ff640a' }, { backgroundColor: '' });
        inp.addEventListener('input', () => onChange(inp.value));
        inp.addEventListener('keydown', e => { if(e.key==='ArrowUp') { e.preventDefault(); navigate('up', inp, idx); } else if(e.key==='ArrowDown'){ e.preventDefault(); navigate('down', inp, idx); }});
        const lab = document.createElement('label'); lab.textContent = labText;
        Object.assign(lab.style, { color:'black', padding:'0 10px', cursor:'pointer' });
        cont.append(lab, inp);
        return cont;
    };
    const createInputButton = (labText, val, onChange, idx) => {
        const cont = document.createElement('div');
        Object.assign(cont.style, { display:'flex', alignItems:'center', padding:'5px', width:'fit-content', transition:'background-color 0.2s ease', borderRadius:'inherit', cursor:'pointer' });
        cont.addEventListener('click', () => { if(document.activeElement!==inp){ inp.focus(); openKeyCapture(inp, onChange); }});
        hoverFocus(cont, { backgroundColor: '#ff640a', boxShadow: '0 0 15px rgba(255,124,0,1)' }, { backgroundColor: '', boxShadow: '' });
        const inp = document.createElement('div'); inp.textContent = keyToSymbol(val); inp.tabIndex = idx;
        Object.assign(inp.style, { minWidth:'110px', padding:'8px 14px', cursor:'pointer', textAlign:'center', border:'1px solid #aaa', borderRadius:'10px', backgroundColor:'white', fontSize:'1.2rem', color: 'black' });
        inp.addEventListener('click', () => openKeyCapture(inp, onChange));
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openKeyCapture(inp, onChange); } });

        hoverFocus(inp, { boxShadow: '0 0 15px rgba(255,124,0,1)' }, { boxShadow: '' }, cont, { backgroundColor: '#ff640a' }, { backgroundColor: '' });
        const lab = document.createElement('label'); lab.textContent = labText;
        Object.assign(lab.style, { color:'black', padding:'0 10px', cursor:'pointer' });
        cont.append(lab, inp);
        return cont;
    };
    const createButton = (text, onClick, idx, extra = {}) => {
        const btn = document.createElement('button');
        Object.assign(btn.style, { cursor:'pointer', padding:'10px', margin:'3px', border:'revert', borderRadius:'inherit', backgroundColor:'lightgrey', transition:'background-color 0.2s ease' }, extra);
        btn.textContent = text; btn.tabIndex = idx;
        hoverFocus(btn, { backgroundColor: '#ff640a', boxShadow: '0 0 15px rgba(255,124,0,1)' }, { backgroundColor: 'lightgrey', boxShadow: '' });
        btn.addEventListener('click', onClick);

        let Up='up', Down='down';
        if(text==='X'){ Up='down'; Down='up'; }

        btn.addEventListener('keydown', e => {
            if([' ','Enter'].includes(e.key)) { e.preventDefault(); btn.click(); }
            else if(['ArrowUp','ArrowLeft'].includes(e.key)) { e.preventDefault(); navigate(Up, btn, idx); }
            else if(['ArrowDown','ArrowRight'].includes(e.key)) { e.preventDefault(); navigate(Down, btn, idx); }
        });
        return btn;
    };

    const saveAndClose = () => { localStorage.setItem("AutoSkipParameter", JSON.stringify(settings)); waitForIframe(); hideSettingsWindow(); };
    const resetDefaults = () => { settings = { ...defaultSettings }; saveAndClose(); };
    const hideSettingsWindow = () => {
        document.getElementById('settingsOverlay')?.remove();
        document.getElementById('settingsWindow')?.remove();
        settings = JSON.parse(localStorage.getItem("AutoSkipParameter"));
    };

    /************** Overlay de confirmation **************/
    const handleOverlayClick = () => {
        const unique = JSON.parse(localStorage.getItem("AutoSkipParameter"));
        if(unique.OverlayAlertShow) {
            const overlay = $el('div', { position:'fixed', top:'0', left:'0', width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.5)', zIndex:'9998' });
            overlay.id = 'customOverlay';
            const alertDiv = document.createElement('div');
            alertDiv.id = 'customAlert';
            alertDiv.tabIndex = 0;
            Object.assign(alertDiv.style, { position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', userSelect: 'none',
                                           padding:'20px', backgroundColor:'#fff', border:'1px solid #ccc', borderRadius:'10px', zIndex:'9999',
                                           boxShadow:'0px 0px 10px rgba(0,0,0,0.1)', color:'#000'
                                          });
            alertDiv.addEventListener('mouseover', ({target}) => {
                const active = document.activeElement;
                if (!(active.tagName==='INPUT' && active.type==='text') && alertDiv.contains(target) && target.tabIndex>=0) target.focus();
            });
            alertDiv.addEventListener('keydown', e => {
                if (document.activeElement === alertDiv) {
                    const navigationKeys = ['Tab', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];
                    if (navigationKeys.includes(e.key)) { e.preventDefault(); checkboxDiv.focus(); }
                }
            });
            alertDiv.appendChild($el('p', {}, translations[userLanguage].confirmExit));
            let toggleChoice = false;
            const checkboxDiv = createToggle(translations[userLanguage].saveChoice, false, v=>toggleChoice=v, 2);
            checkboxDiv.style.justifySelf = 'center';
            const btnContainer = $el('div', { marginTop:'10px', display:'flex', justifyContent:'space-between', borderRadius:'10px' });
            const yesBtn = createButton(translations[userLanguage].yes, () => {
                if(toggleChoice) settings.OverlayAlertShow = false;
                settings.OverlayAutoSave = true; saveAndClose(); overlay.remove(); alertDiv.remove();
            }, 2);
            const noBtn = createButton(translations[userLanguage].no, () => {
                let uniq = JSON.parse(localStorage.getItem("AutoSkipParameter"));
                if(toggleChoice) uniq.OverlayAlertShow = false;
                uniq.OverlayAutoSave = false;
                localStorage.setItem("AutoSkipParameter", JSON.stringify(uniq));
                hideSettingsWindow(); overlay.remove(); alertDiv.remove();
                settings = JSON.parse(localStorage.getItem("AutoSkipParameter"));
            }, 2);
            noBtn.addEventListener('keydown', e => { if(e.key==='Tab'){ e.preventDefault(); checkboxDiv.focus(); }});
            btnContainer.append(yesBtn, noBtn);
            alertDiv.append(checkboxDiv, btnContainer);
            document.body.append(overlay, alertDiv);
            checkboxDiv.focus();
        } else {
            if(JSON.parse(localStorage.getItem("AutoSkipParameter")).OverlayAutoSave) localStorage.setItem("AutoSkipParameter", JSON.stringify(settings));
            hideSettingsWindow();
        }
    };

    /************** Gestion du bouton "No Skip" et Skip auto **************/
    const observeSkipButton = () => {
        const st = JSON.parse(localStorage.getItem("AutoSkipParameter")) || {};
        const skipBtn = document.querySelector('div[data-testid="skipButton"]');
        if(skipBtn && st.AutoSkipActive) {
            let noSkip = document.getElementById('noSkipButton');
            if(!noSkip) {
                noSkip = createButton(translations[userLanguage].AutoSkOff + ' [⬇]', toggleNoSkip, 0);
                noSkip.id = 'noSkipButton'; noSkip.value = '0';
                const sizeElem = skipBtn.querySelector('.css-1dbjc4n.r-1awozwy');
                if(sizeElem) {
                    const { width } = sizeElem.getBoundingClientRect();
                    Object.assign(noSkip.style, { position:'absolute', right:`${20+width}px`, bottom:'97px', height:'40px', zIndex:'1', fontWeight:'bold' });
                }
                skipBtn.parentNode.insertBefore(noSkip, skipBtn);
                const obsSkip = new MutationObserver(muts => {
                    muts.forEach(() => { Skip(obsSkip); skipBtn.style.opacity==='0' ? noSkip.style.display='none' : noSkip.style.display='block'; });
                });
                obsSkip.observe(skipBtn, { attributes:true });
                const removalObs = new MutationObserver(muts => {
                    muts.forEach(mut => { mut.removedNodes.forEach(n => { if(n===skipBtn) { removalObs.disconnect(); noSkip.remove(); } }); });
                });
                removalObs.observe(document.body, { childList:true, subtree:true });
                noSkip.addEventListener('mouseover', () => {
                    mutationObserverActive = false;
                    const obsOpa = new MutationObserver(() => { if(getComputedStyle(skipBtn).opacity!=='1') skipBtn.style.opacity='1'; });
                    obsOpa.observe(skipBtn, { attributes:true, attributeFilter:['style'] });
                    noSkip.addEventListener('mouseout', () => { mutationObserverActive = true; obsOpa.disconnect(); skipBtn.style.opacity=''; }, { once:true });
                });
            }
        }
    };
    const Skip = obs => {
        if(!mutationObserverActive) return;
        const skipButt = document.querySelector('div[data-testid="skipButton"]');
        const inner = skipButt?.querySelector('div[tabindex="0"]');
        const noSkip = document.getElementById('noSkipButton');
        const UnL = JSON.parse(localStorage.getItem("AutoSkipParameter"));
        if(inner && UnL.AutoSkipActive && noSkip.value==="0") {
            const x = UnL.AutoSkipDelay || 0;
            setTimeout(() => { if(noSkip.value==="0" && mutationObserverActive) { obs.disconnect(); inner.click(); } }, x);
        }
    };
    const toggleNoSkip = () => {
        const noSkip = document.getElementById('noSkipButton');
        if(!noSkip) return;
        noSkip.value = noSkip.value==="0" ? "1" : "0";
        noSkip.textContent = noSkip.value==="1" ? translations[userLanguage].AutoSkON + ' [⬇]' : translations[userLanguage].AutoSkOff + ' [⬇]';
        window.parent.postMessage({ type:'noskip', value:noSkip.value }, '*');
    };

    /************** Communication avec l'iframe **************/
    const sendValuesToIframe = iframe => {
        const current = JSON.stringify(JSON.parse(localStorage.getItem("AutoSkipParameter")));
        if(current !== JSON.stringify(OrigineLoad) || firstLoad) {
            iframe.contentWindow.postMessage({ type:'AutoSkipParameter', value: JSON.parse(localStorage.getItem("AutoSkipParameter")) }, 'https://static.crunchyroll.com');
            OrigineLoad = JSON.parse(localStorage.getItem("AutoSkipParameter")); firstLoad = false;
        }
    };
    const waitForIframe = () => {
        if(window.location.hostname==='static.crunchyroll.com'){ ObsSettingsButton = false; HisButton = false; WatButton = false; return; };
        observerSkipButt = false;
        const obs = new MutationObserver((muts, obsr) => {
            const iframe = document.querySelector('.video-player');
            if(iframe && iframe.src.includes('https://static.crunchyroll.com')) {
                setTimeout(() => sendValuesToIframe(iframe), firstLoad?1000:0);
                obsr.disconnect();
            }
        });
        obs.observe(document.body, { childList:true, subtree:true });
    };

    /************** History / Watchlist **************/
    const HistoryWatchlistButt = headerDiv => {
        if(!headerDiv.querySelector('button')) {
            let isExpanded = false;
            const collection = headerDiv.nextElementSibling;
            const history = collection.classList.contains('erc-history-collection');
            const watchlist = collection.classList.contains('erc-watchlist-collection');
            const btn = createButton('▶', () => {
                if(collection && (history || watchlist)) {
                    const items = collection.querySelectorAll('.collection-item');
                    const style = getComputedStyle(collection);
                    const prefixes = ['col','cols'];
                    const suffixes = ['number','numbers','count','counts'];

                    const colCount = (
                        prefixes
                        .flatMap(p => suffixes.map(s => `--${p}-${s}`))
                        .map(name => parseInt(style.getPropertyValue(name), 10))
                        .find(n => !Number.isNaN(n))
                    ) || 5;
                    isExpanded = !isExpanded;
                    btn.textContent = isExpanded ? '▼' : '▶';
                    items.forEach((item, idx) => {
                        if(idx>=colCount) {
                            if(isExpanded) {
                                Object.assign(item.style, { display:'block', maxHeight:'0px', overflow:'hidden', transition:'max-height 1s' });
                                item.offsetHeight; item.style.maxHeight='1000px';
                            } else { item.style.maxHeight='0px'; }
                        }
                    });
                }
            }, 0);
            Object.assign(btn.style, { width:'40px', height:'40px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', marginLeft:'10px', boxShadow:'0 0 15px rgba(255,255,255,1)' });
            btn.tabIndex = 0; btn.id = history ? 'HistoryButton' : 'WatchlistButton';
            hoverFocus(btn, { backgroundColor:'#ff640a', boxShadow:'0 0 15px rgba(255,124,0,1)' }, { backgroundColor:'white', boxShadow:'0 0 15px rgba(255,255,255,1)' });
            headerDiv.appendChild(btn);
        }
    };
    const HisWatButton = (AB, settingKey, buttonId) => {
        if(AB && AB.previousElementSibling && AB.previousElementSibling.classList.contains('feed-header--ihqym')) {
            settings[settingKey] ? HistoryWatchlistButt(AB.previousElementSibling)
            : AB.previousElementSibling.querySelector(`#${buttonId}`)?.remove();
        }
    };

    /************** Événements **************/
    window.addEventListener('message', e => {
        if(e.origin !== 'https://www.crunchyroll.com') return;
        if(e.data.type==='AutoSkipParameter') localStorage.setItem("AutoSkipParameter", JSON.stringify(e.data.value));
    });
    window.addEventListener('load', waitForIframe);
    if(window.location.hostname==="static.crunchyroll.com"){
        document.addEventListener("keydown", e => {
            const noSkip = document.querySelector("#noSkipButton");
            const skip = document.querySelector('div[data-testid="skipButton"]');
            const inner = skip?.querySelector('div[tabindex="0"]');
            const st = JSON.parse(localStorage.getItem("AutoSkipParameter")) || {};
            if(noSkip && ((e.key==="ArrowLeft" && st.ArrowLeftAutoSkip) || (e.key==="ArrowRight" && st.ArrowRightAutoSkip))) if(st.AutoSkipActive && inner) inner.click();
            if (st.SkipButtonAllow && e.key === (st.SkipButton) ) inner.click();
            if(noSkip && e.key==="ArrowDown"){
                e.preventDefault(); e.stopPropagation();
                toggleNoSkip();
            }
        }, true);
    }
    let lastUrl = location.href;

    /************** Functions **************/
    function openKeyCapture(displayEl, onChange) {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, { position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.35)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' });
        const box = document.createElement('div');
        Object.assign(box.style, { background: '#fff', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', fontFamily: 'sans-serif', textAlign: 'center', minWidth: '260px', color: 'black' });
        box.innerHTML = translations[userLanguage].ChoseKey;
        const cur = document.createElement('div');
        Object.assign(cur.style, { marginTop: '10px', fontWeight: 'bold', fontSize: '1.1rem' });
        cur.textContent = translations[userLanguage].SelectedKey + (displayEl.textContent);
        box.appendChild(cur);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
        const handler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.key === 'Tab' || e.key === ' ' || e.key === 'Spacebar') return;
            if (e.key === 'Escape') { cleanup(); return; }
            const symbol = keyToSymbol(e.key);
            displayEl.textContent = symbol;
            onChange(e.key);
            cleanup();
        };
        function cleanup() {
            document.removeEventListener('keydown', handler, true);
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            displayEl.focus();
        }
        document.addEventListener('keydown', handler, true);
        displayEl.focus();
    }
    function keyToSymbol(key) {
        const KEY_SYMBOLS = {
            // Flèches
            ArrowLeft:  '←',
            ArrowRight: '→',
            ArrowUp:    '↑',
            ArrowDown:  '↓',

            // Contrôle classique
            Enter:      '⏎',
            Escape:     'Esc',
            Tab:        '⇥',
            Shift:      '⇧',
            Control:    'Ctrl',
            Alt:        'Alt',
            Meta:       navigator.platform.toUpperCase().includes("MAC") ? "⌘" : "❖",
            " ":        "────────",
            Space:      "────────",

            // Touches spéciales / édition
            Backspace:  '⌫',
            Delete:     '⌦',
            Insert:     'Ins',
            Home:       'Home',
            End:        'End',
            PageUp:     'Pg↑',
            PageDown:   'Pg↓',

            // Ceux qui te manquaient
            CapsLock:          '⇪',
            Dead:              '◌',
            LaunchApplication1:'App1',
            LaunchApplication2:'App2',
            AudioVolumeUp:     '🔊',
            AudioVolumeDown:   '🔉',
            AudioVolumeMute:   '🔇',

            // Petit bonus pour les claviers “multimédia”
            MediaPlayPause: '⏯',
            MediaTrackNext: '⏭',
            MediaTrackPrevious: '⏮'
        };
        if (KEY_SYMBOLS[key]) return KEY_SYMBOLS[key];
        if (key.length === 1 && key.match(/[a-z]/i)) {
            return key.toUpperCase();
        }
        return key;
    }

    /************** Observer global **************/
    const globalObserver = new MutationObserver(() => {
        if(lastUrl!==location.href){ lastUrl = location.href; firstLoad = true; }
        if(ObsSettingsButton) addSettingsButton();
        if(observerSkipButt) observeSkipButton();
        if(HisButton) HisWatButton(document.querySelector('.erc-history-collection[data-t="history"]'), 'HistoryButton', 'HistoryButton');
        if(WatButton) HisWatButton(document.querySelector('.erc-watchlist-collection[data-t="watchlist"]'), 'WatchlistButton', 'WatchlistButton');
    });
    globalObserver.observe(document, { childList:true, subtree:true });

    /************** Traduction **************/
    const translations = {
        en: {
            HeadLabelTitle: "Auto Skip Parameter",
            AutoSkipActiveToggle: "Enable automatic skip",
            AutoSkipDelayInput: "Delay before skipping (ms)",
            ArrowAutoSkipToggle: "Enable arrow automatic skip",
            SkipButtonToggle: "Enable a dedicated skip key",
            SkipButtonLabel: "Skip key:",
            ChoseKey: "Press the key to use for skipping<br>(Esc = cancel, Tab / Space = ignored).",
            SelectedKey: "Current key: ",
            OverlayAlertShowToggle: "Show overlay alert",
            OverlayAutoSaveToggle: "Save when exiting overlay",
            HistoryButtonToggle: "Activate the button on the main page for more history",
            WatchlistButtonToggle: "Activate the button on the main page for more watchlist",
            saveButton: "Save",
            cancelButton: "Cancel",
            defaultButton: "Default",
            confirmExit: "Do you want to quit and save the settings?",
            saveChoice: "Save your choice",
            yes: "Yes",
            no: "No",
            AutoSkOff: "Disable Auto Skip",
            AutoSkON: "Re-enable Auto Skip"
        },
        fr: {
            HeadLabelTitle: "Paramètre du saut automatique",
            AutoSkipActiveToggle: "Activer le saut automatique",
            AutoSkipDelayInput: "Délai avant de sauter (ms)",
            ArrowAutoSkipToggle: "Activer le saut automatique avec les flèches",
            SkipButtonToggle: "Activer une touche dédiée pour le saut",
            SkipButtonLabel: "Touche de saut :",
            ChoseKey: "Appuyez sur la touche à utiliser pour le saut.<br>(Échap = annuler, Tab / Espace = ignorés).",
            SelectedKey: "Touche actuelle : ",
            OverlayAlertShowToggle: "Afficher l'alerte en superposition",
            OverlayAutoSaveToggle: "Sauvegarder en quittant la superposition",
            HistoryButtonToggle: "Activer le bouton sur la page principale pour plus d'historique",
            WatchlistButtonToggle: "Activer le bouton sur la page principale pour plus de watchlist",
            saveButton: "Enregistrer",
            cancelButton: "Annuler",
            defaultButton: "Par défaut",
            confirmExit: "Voulez-vous quitter et enregistrer les paramètres ?",
            saveChoice: "Enregistrer votre choix",
            yes: "Oui",
            no: "Non",
            AutoSkOff: "Désactiver le saut automatique",
            AutoSkON: "Réactiver le saut automatique"
        },
        ar: {
            HeadLabelTitle: "معلمة التخطي التلقائي",
            AutoSkipActiveToggle: "تمكين التخطي التلقائي",
            AutoSkipDelayInput: "التأخير قبل التخطي (مللي ثانية)",
            ArrowAutoSkipToggle: "تمكين التخطي التلقائي بالسهم",
            SkipButtonToggle: "تفعيل مفتاح مخصص للتخطي",
            SkipButtonLabel: "مفتاح التخطي:",
            ChoseKey: "اضغط على المفتاح الذي تريد استخدامه للتخطي<br>(Esc = إلغاء، Tab / Space = يتم تجاهلهما).",
            SelectedKey: "المفتاح الحالي: ",
            OverlayAlertShowToggle: "عرض تنبيه التراكب",
            OverlayAutoSaveToggle: "حفظ عند الخروج من التراكب",
            HistoryButtonToggle: "تفعيل الزر في الصفحة الرئيسية للمزيد من السجل",
            WatchlistButtonToggle: "تفعيل الزر في الصفحة الرئيسية للمزيد من قائمة المشاهدة",
            saveButton: "حفظ",
            cancelButton: "إلغاء",
            defaultButton: "افتراضي",
            confirmExit: "هل تريد الخروج وحفظ الإعدادات؟",
            saveChoice: "حفظ اختيارك",
            yes: "نعم",
            no: "لا",
            AutoSkOff: "تعطيل التخطي التلقائي",
            AutoSkON: "إعادة تمكين التخطي التلقائي"
        },
        ca: {
            HeadLabelTitle: "Paràmetre de salt automàtic",
            AutoSkipActiveToggle: "Habilita el salt automàtic",
            AutoSkipDelayInput: "Retard abans de saltar (ms)",
            ArrowAutoSkipToggle: "Habilita el salt automàtic amb fletxes",
            SkipButtonToggle: "Activar una tecla dedicada per al salt",
            SkipButtonLabel: "Tecla de salt:",
            ChoseKey: "Premeu la tecla que voleu utilitzar per al salt<br>(Esc = cancel·lar, Tab / Espai = ignorats).",
            SelectedKey: "Tecla actual: ",
            OverlayAlertShowToggle: "Mostra l'alerta de superposició",
            OverlayAutoSaveToggle: "Desa en sortir de la superposició",
            HistoryButtonToggle: "Activa el botó a la pàgina principal per més historial",
            WatchlistButtonToggle: "Activa el botó a la pàgina principal per més llista de seguiment",
            saveButton: "Desa",
            cancelButton: "Cancel·la",
            defaultButton: "Per defecte",
            confirmExit: "Vols sortir i desar la configuració?",
            saveChoice: "Desa la teva elecció",
            yes: "Sí",
            no: "No",
            AutoSkOff: "Desactiva el salt automàtic",
            AutoSkON: "Torna a activar el salt automàtic"
        },
        zh: {
            HeadLabelTitle: "自动跳过参数",
            AutoSkipActiveToggle: "启用自动跳过",
            AutoSkipDelayInput: "跳过前的延迟（毫秒）",
            ArrowAutoSkipToggle: "启用箭头自动跳过",
            SkipButtonToggle: "启用专用跳过按键",
            SkipButtonLabel: "跳过按键：",
            ChoseKey: "按下要用于跳过的按键<br>（Esc = 取消，Tab / 空格 = 忽略）。",
            SelectedKey: "当前按键：",
            OverlayAlertShowToggle: "显示叠加警报",
            OverlayAutoSaveToggle: "退出叠加时保存",
            HistoryButtonToggle: "在主页上启用按钮以查看更多历史记录",
            WatchlistButtonToggle: "在主页上启用按钮以查看更多观看列表",
            saveButton: "保存",
            cancelButton: "取消",
            defaultButton: "默认",
            confirmExit: "您想退出并保存设置吗？",
            saveChoice: "保存您的选择",
            yes: "是",
            no: "否",
            AutoSkOff: "禁用自动跳过",
            AutoSkON: "重新启用自动跳过"
        },
        de: {
            HeadLabelTitle: "Automatischer Überspring-Parameter",
            AutoSkipActiveToggle: "Automatisches Überspringen aktivieren",
            AutoSkipDelayInput: "Verzögerung vor dem Überspringen (ms)",
            ArrowAutoSkipToggle: "Pfeil-Auto-Skip aktivieren",
            SkipButtonToggle: "Eigene Taste zum Überspringen aktivieren",
            SkipButtonLabel: "Sprungtaste:",
            ChoseKey: "Drücken Sie die Taste, die Sie zum Überspringen verwenden möchten<br>(Esc = Abbrechen, Tab / Leertaste = ignoriert).",
            SelectedKey: "Aktuelle Taste: ",
            OverlayAlertShowToggle: "Overlay-Warnung anzeigen",
            OverlayAutoSaveToggle: "Beim Verlassen des Overlays speichern",
            HistoryButtonToggle: "Schaltfläche auf der Hauptseite für mehr Verlauf aktivieren",
            WatchlistButtonToggle: "Schaltfläche auf der Hauptseite für mehr Watchlist aktivieren",
            saveButton: "Speichern",
            cancelButton: "Abbrechen",
            defaultButton: "Standard",
            confirmExit: "Möchten Sie beenden und die Einstellungen speichern?",
            saveChoice: "Ihre Auswahl speichern",
            yes: "Ja",
            no: "Nein",
            AutoSkOff: "Automatisches Überspringen deaktivieren",
            AutoSkON: "Automatisches Überspringen wieder aktivieren"
        },
        es: {
            HeadLabelTitle: "Parámetro de omisión automática",
            AutoSkipActiveToggle: "Habilitar salto automático",
            AutoSkipDelayInput: "Retraso antes de saltar (ms)",
            ArrowAutoSkipToggle: "Habilitar salto automático con flechas",
            SkipButtonToggle: "Activar una tecla dedicada para el salto",
            SkipButtonLabel: "Tecla de salto:",
            ChoseKey: "Pulsa la tecla que quieras usar para saltar<br>(Esc = cancelar, Tab / Espacio = ignorados).",
            SelectedKey: "Tecla actual: ",
            OverlayAlertShowToggle: "Mostrar alerta superpuesta",
            OverlayAutoSaveToggle: "Guardar al salir de la superposición",
            HistoryButtonToggle: "Activar el botón en la página principal para más historial",
            WatchlistButtonToggle: "Activar el botón en la página principal para más lista de seguimiento",
            saveButton: "Guardar",
            cancelButton: "Cancelar",
            defaultButton: "Predeterminado",
            confirmExit: "¿Quieres salir y guardar la configuración?",
            saveChoice: "Guardar tu elección",
            yes: "Sí",
            no: "No",
            AutoSkOff: "Deshabilitar salto automático",
            AutoSkON: "Rehabilitar salto automático"
        },
        hi: {
            HeadLabelTitle: "स्वचालित छोड़ने का पैरामीटर",
            AutoSkipActiveToggle: "स्वचालित स्किप सक्षम करें",
            AutoSkipDelayInput: "स्किप से पहले विलंब (मि.से.)",
            ArrowAutoSkipToggle: "तीर स्वचालित स्किप सक्षम करें",
            SkipButtonToggle: "स्किप के लिए समर्पित कुंजी सक्षम करें",
            SkipButtonLabel: "स्किप कुंजी:",
            ChoseKey: "स्किप करने के लिए उपयोग की जाने वाली कुंजी दबाएँ<br>(Esc = रद्द, Tab / Space = नज़रअंदाज़).",
            SelectedKey: "वर्तमान कुंजी: ",
            OverlayAlertShowToggle: "ओवरले अलर्ट दिखाएं",
            OverlayAutoSaveToggle: "ओवरले से बाहर निकलते समय सहेजें",
            HistoryButtonToggle: "अधिक इतिहास के लिए मुख्य पृष्ठ पर बटन सक्रिय करें",
            WatchlistButtonToggle: "अधिक वॉचलिस्ट के लिए मुख्य पृष्ठ पर बटन सक्रिय करें",
            saveButton: "सहेजें",
            cancelButton: "रद्द करें",
            defaultButton: "डिफ़ॉल्ट",
            confirmExit: "क्या आप बाहर निकलना और सेटिंग्स सहेजना चाहते हैं?",
            saveChoice: "अपनी पसंद सहेजें",
            yes: "हाँ",
            no: "नहीं",
            AutoSkOff: "स्वचालित स्किप अक्षम करें",
            AutoSkON: "स्वचालित स्किप पुनः सक्षम करें"
        },
        id: {
            HeadLabelTitle: "Parameter Lewati Otomatis",
            AutoSkipActiveToggle: "Aktifkan lompatan otomatis",
            AutoSkipDelayInput: "Tunda sebelum melompat (ms)",
            ArrowAutoSkipToggle: "Aktifkan lompatan otomatis dengan panah",
            SkipButtonToggle: "Aktifkan tombol khusus untuk skip",
            SkipButtonLabel: "Tombol skip:",
            ChoseKey: "Tekan tombol yang akan digunakan untuk skip<br>(Esc = batal, Tab / Spasi = diabaikan).",
            SelectedKey: "Tombol saat ini: ",
            OverlayAlertShowToggle: "Tampilkan peringatan overlay",
            OverlayAutoSaveToggle: "Simpan saat keluar dari overlay",
            HistoryButtonToggle: "Aktifkan tombol di halaman utama untuk riwayat lebih lanjut",
            WatchlistButtonToggle: "Aktifkan tombol di halaman utama untuk daftar tontonan lebih lanjut",
            saveButton: "Simpan",
            cancelButton: "Batal",
            defaultButton: "Default",
            confirmExit: "Apakah Anda ingin keluar dan menyimpan pengaturan?",
            saveChoice: "Simpan pilihan Anda",
            yes: "Ya",
            no: "Tidak",
            AutoSkOff: "Nonaktifkan Lompatan Otomatis",
            AutoSkON: "Aktifkan kembali Lompatan Otomatis"
        },
        it: {
            HeadLabelTitle: "Parametro di salto automatico",
            AutoSkipActiveToggle: "Abilita il salto automatico",
            AutoSkipDelayInput: "Ritardo prima di saltare (ms)",
            ArrowAutoSkipToggle: "Abilita il salto automatico con le frecce",
            SkipButtonToggle: "Attiva un tasto dedicato al salto",
            SkipButtonLabel: "Tasto di salto:",
            ChoseKey: "Premi il tasto da usare per il salto<br>(Esc = annulla, Tab / Spazio = ignorati).",
            SelectedKey: "Tasto corrente: ",
            OverlayAlertShowToggle: "Mostra avviso in sovrimpressione",
            OverlayAutoSaveToggle: "Salva quando si esce dalla sovrimpressione",
            HistoryButtonToggle: "Attiva il pulsante nella pagina principale per più cronologia",
            WatchlistButtonToggle: "Attiva il pulsante nella pagina principale per più lista di visione",
            saveButton: "Salva",
            cancelButton: "Annulla",
            defaultButton: "Predefinito",
            confirmExit: "Vuoi uscire e salvare le impostazioni?",
            saveChoice: "Salva la tua scelta",
            yes: "Sì",
            no: "No",
            AutoSkOff: "Disattiva il salto automatico",
            AutoSkON: "Riattiva il salto automatico"
        },
        ja: {
            HeadLabelTitle: "自動スキップパラメータ",
            AutoSkipActiveToggle: "自動スキップを有効にする",
            AutoSkipDelayInput: "スキップ前の遅延（ミリ秒）",
            ArrowAutoSkipToggle: "矢印キーの自動スキップを有効にする",
            SkipButtonToggle: "スキップ専用キーを有効にする",
            SkipButtonLabel: "スキップキー：",
            ChoseKey: "スキップに使用するキーを押してください<br>（Esc = キャンセル、Tab / Space = 無視）。",
            SelectedKey: "現在のキー：",
            OverlayAlertShowToggle: "オーバーレイアラートを表示",
            OverlayAutoSaveToggle: "オーバーレイを終了するときに保存",
            HistoryButtonToggle: "メインページでボタンを有効にして履歴を表示",
            WatchlistButtonToggle: "メインページでボタンを有効にしてウォッチリストを表示",
            saveButton: "保存",
            cancelButton: "キャンセル",
            defaultButton: "デフォルト",
            confirmExit: "終了して設定を保存しますか？",
            saveChoice: "選択を保存",
            yes: "はい",
            no: "いいえ",
            AutoSkOff: "自動スキップを無効にする",
            AutoSkON: "自動スキップを再有効化する"
        },
        ms: {
            HeadLabelTitle: "Parameter Langkau Automatik",
            AutoSkipActiveToggle: "Aktifkan langkau automatik",
            AutoSkipDelayInput: "Kelewatan sebelum melangkau (ms)",
            ArrowAutoSkipToggle: "Aktifkan langkau automatik dengan anak panah",
            SkipButtonToggle: "Aktifkan kekunci khas untuk langkau",
            SkipButtonLabel: "Kekunci langkau:",
            ChoseKey: "Tekan kekunci yang hendak digunakan untuk melangkau<br>(Esc = batal, Tab / Space = diabaikan).",
            SelectedKey: "Kekunci semasa: ",
            OverlayAlertShowToggle: "Tunjukkan amaran lapisan atas",
            OverlayAutoSaveToggle: "Simpan apabila keluar dari lapisan atas",
            HistoryButtonToggle: "Aktifkan butang di halaman utama untuk sejarah tambahan",
            WatchlistButtonToggle: "Aktifkan butang di halaman utama untuk senarai tontonan tambahan",
            saveButton: "Simpan",
            cancelButton: "Batal",
            defaultButton: "Default",
            confirmExit: "Adakah anda ingin keluar dan menyimpan tetapan?",
            saveChoice: "Simpan pilihan anda",
            yes: "Ya",
            no: "Tidak",
            AutoSkOff: "Nyahaktifkan Langkau Automatik",
            AutoSkON: "Aktifkan semula Langkau Automatik"
        },
        pl: {
            HeadLabelTitle: "Parametr automatycznego pomijania",
            AutoSkipActiveToggle: "Włącz automatyczne pomijanie",
            AutoSkipDelayInput: "Opóźnienie przed pominięciem (ms)",
            ArrowAutoSkipToggle: "Włącz automatyczne pomijanie strzałkami",
            SkipButtonToggle: "Włącz dedykowany klawisz przewijania",
            SkipButtonLabel: "Klawisz przewijania:",
            ChoseKey: "Naciśnij klawisz, którego chcesz używać do przewijania<br>(Esc = anuluj, Tab / Spacja = ignorowane).",
            SelectedKey: "Aktualny klawisz: ",
            OverlayAlertShowToggle: "Pokaż alert nakładki",
            OverlayAutoSaveToggle: "Zapisz po wyjściu z nakładki",
            HistoryButtonToggle: "Aktywuj przycisk na stronie głównej, aby zobaczyć więcej historii",
            WatchlistButtonToggle: "Aktywuj przycisk na stronie głównej, aby zobaczyć więcej listy obserwowanych",
            saveButton: "Zapisz",
            cancelButton: "Anuluj",
            defaultButton: "Domyślne",
            confirmExit: "Czy chcesz wyjść i zapisać ustawienia?",
            saveChoice: "Zapisz swój wybór",
            yes: "Tak",
            no: "Nie",
            AutoSkOff: "Wyłącz automatyczne pomijanie",
            AutoSkON: "Ponownie włącz automatyczne pomijanie"
        },
        pt: {
            HeadLabelTitle: "Parâmetro de Pular Automático",
            AutoSkipActiveToggle: "Ativar pulo automático",
            AutoSkipDelayInput: "Atraso antes de pular (ms)",
            ArrowAutoSkipToggle: "Ativar pulo automático com setas",
            SkipButtonToggle: "Ativar uma tecla dedicada para o salto",
            SkipButtonLabel: "Tecla de salto:",
            ChoseKey: "Prima a tecla que pretende usar para o salto<br>(Esc = cancelar, Tab / Espaço = ignorados).",
            SelectedKey: "Tecla atual: ",
            OverlayAlertShowToggle: "Mostrar alerta em sobreposição",
            OverlayAutoSaveToggle: "Salvar ao sair da sobreposição",
            HistoryButtonToggle: "Ativar botão na página principal para mais histórico",
            WatchlistButtonToggle: "Ativar botão na página principal para mais lista de observação",
            saveButton: "Salvar",
            cancelButton: "Cancelar",
            defaultButton: "Padrão",
            confirmExit: "Deseja sair e salvar as configurações?",
            saveChoice: "Salvar sua escolha",
            yes: "Sim",
            no: "Não",
            AutoSkOff: "Desativar Pulo Automático",
            AutoSkON: "Reativar Pulo Automático"
        },
        ru: {
            HeadLabelTitle: "Параметр автоматического пропуска",
            AutoSkipActiveToggle: "Включить автоматическое пропускание",
            AutoSkipDelayInput: "Задержка перед пропуском (мс)",
            ArrowAutoSkipToggle: "Включить автоматический пропуск с помощью стрелок",
            SkipButtonToggle: "Включить отдельную клавишу пропуска",
            SkipButtonLabel: "Клавиша пропуска:",
            ChoseKey: "Нажмите клавишу, которую хотите использовать для пропуска<br>(Esc = отмена, Tab / Space = игнорируются).",
            SelectedKey: "Текущая клавиша: ",
            OverlayAlertShowToggle: "Показать уведомление в оверлее",
            OverlayAutoSaveToggle: "Сохранить при выходе из оверлея",
            HistoryButtonToggle: "Активировать кнопку на главной странице для просмотра истории",
            WatchlistButtonToggle: "Активировать кнопку на главной странице для списка просмотра",
            saveButton: "Сохранить",
            cancelButton: "Отмена",
            defaultButton: "По умолчанию",
            confirmExit: "Вы хотите выйти и сохранить настройки?",
            saveChoice: "Сохранить ваш выбор",
            yes: "Да",
            no: "Нет",
            AutoSkOff: "Отключить автоматическое пропускание",
            AutoSkON: "Включить автоматическое пропускание"
        },
        ta: {
            HeadLabelTitle: "தானியங்கும் தாண்டும் அளவுரு",
            AutoSkipActiveToggle: "தானியங்கி தவிர்க்கலை இயக்கவும்",
            AutoSkipDelayInput: "தவிர்க்கும் முன் தாமதம் (மில்லி விநாடிகள்)",
            ArrowAutoSkipToggle: "அம்பு தானியங்கி தவிர்க்கலை இயக்கவும்",
            SkipButtonToggle: "தாவுதலுக்கான தனி விசையை செயல்படுத்து",
            SkipButtonLabel: "தாவு விசை:",
            ChoseKey: "தாவ பயன்படும் விசையை அழுத்தவும்<br>(Esc = ரத்து, Tab / Space = புறக்கணிக்கப்படும்).",
            SelectedKey: "தற்போதைய விசை: ",
            OverlayAlertShowToggle: "மேலே இடப்படும் எச்சரிக்கையை காட்டு",
            OverlayAutoSaveToggle: "மேலே இடப்பட்டதை விட்டு வெளியேறும்போது சேமிக்கவும்",
            HistoryButtonToggle: "மேலும் வரலாற்றை காண முதன்மை பக்கத்தில் பொத்தானை செயல்படுத்தவும்",
            WatchlistButtonToggle: "மேலும் பார்வை பட்டியலை காண முதன்மை பக்கத்தில் பொத்தானை செயல்படுத்தவும்",
            saveButton: "சேமிக்கவும்",
            cancelButton: "ரத்துசெய்",
            defaultButton: "இயல்புநிலை",
            confirmExit: "நீங்கள் வெளியேறி அமைப்புகளைச் சேமிக்க விரும்புகிறீர்களா?",
            saveChoice: "உங்கள் தேர்வைச் சேமிக்கவும்",
            yes: "ஆம்",
            no: "இல்லை",
            AutoSkOff: "தானியங்கி தவிர்க்கலை முடக்கு",
            AutoSkON: "தானியங்கி தவிர்க்கலை மீண்டும் இயக்கு"
        },
        te: {
            HeadLabelTitle: "ఆటో స్కిప్ పరామితి",
            AutoSkipActiveToggle: "ఆటో స్కిప్‌ను ప్రారంభించండి",
            AutoSkipDelayInput: "స్కిప్ చేసేముందు ఆలస్యం (మి.సె.)",
            ArrowAutoSkipToggle: "ఆరో స్కిప్‌ను ప్రారంభించండి",
            SkipButtonToggle: "స్కిప్ కోసం ప్రత్యేక కీని సక్రియం చేయండి",
            SkipButtonLabel: "స్కిప్ కీ:",
            ChoseKey: "స్కిప్ చేయడానికి ఉపయోగించాలనుకున్న కీని నొక్కండి<br>(Esc = రద్దు, Tab / Space = పట్టించుకోరు).",
            SelectedKey: "ప్రస్తుత కీ: ",
            OverlayAlertShowToggle: "ఓవర్లే అలర్ట్‌ను చూపించండి",
            OverlayAutoSaveToggle: "ఓవర్లే నుండి బయటకు వచ్చినప్పుడు సేవ్ చేయండి",
            HistoryButtonToggle: "మరింత చరిత్ర కోసం ప్రధాన పేజీలో బటన్‌ను ప్రారంభించండి",
            WatchlistButtonToggle: "మరింత వీక్షణ జాబితా కోసం ప్రధాన పేజీలో బటన్‌ను ప్రారంభించండి",
            saveButton: "సేవ్",
            cancelButton: "రద్దు చేయండి",
            defaultButton: "అప్రమేయం",
            confirmExit: "మీరు నిష్క్రమించి సెట్టింగ్‌లను సేవ్ చేయాలనుకుంటున్నారా?",
            saveChoice: "మీ ఎంపికను సేవ్ చేయండి",
            yes: "అవును",
            no: "కాదు",
            AutoSkOff: "ఆటో స్కిప్‌ను నిలిపివేయి",
            AutoSkON: "ఆటో స్కిప్‌ను మళ్లీ ప్రారంభించండి"
        },
        th: {
            HeadLabelTitle: "พารามิเตอร์ข้ามอัตโนมัติ",
            AutoSkipActiveToggle: "เปิดใช้งานการข้ามอัตโนมัติ",
            AutoSkipDelayInput: "หน่วงเวลาก่อนข้าม (มิลลิวินาที)",
            ArrowAutoSkipToggle: "เปิดใช้งานการข้ามอัตโนมัติด้วยลูกศร",
            SkipButtonToggle: "เปิดใช้งานปุ่มเฉพาะสำหรับการข้าม",
            SkipButtonLabel: "ปุ่มข้าม:",
            ChoseKey: "กดปุ่มที่ต้องการใช้สำหรับการข้าม<br>(Esc = ยกเลิก, Tab / Space = ไม่สนใจ).",
            SelectedKey: "ปุ่มปัจจุบัน: ",
            OverlayAlertShowToggle: "แสดงการแจ้งเตือนแบบซ้อนทับ",
            OverlayAutoSaveToggle: "บันทึกเมื่อออกจากการซ้อนทับ",
            HistoryButtonToggle: "เปิดใช้งานปุ่มบนหน้าแรกเพื่อดูประวัติเพิ่มเติม",
            WatchlistButtonToggle: "เปิดใช้งานปุ่มบนหน้าแรกเพื่อดูรายการที่ต้องการ",
            saveButton: "บันทึก",
            cancelButton: "ยกเลิก",
            defaultButton: "ค่าเริ่มต้น",
            confirmExit: "คุณต้องการออกและบันทึกการตั้งค่าหรือไม่?",
            saveChoice: "บันทึกตัวเลือกของคุณ",
            yes: "ใช่",
            no: "ไม่",
            AutoSkOff: "ปิดการข้ามอัตโนมัติ",
            AutoSkON: "เปิดใช้งานการข้ามอัตโนมัติอีกครั้ง"
        },
        tr: {
            HeadLabelTitle: "Otomatik Atlatma Parametresi",
            AutoSkipActiveToggle: "Otomatik geçişi etkinleştir",
            AutoSkipDelayInput: "Geçmeden önce gecikme (ms)",
            ArrowAutoSkipToggle: "Ok tuşlarıyla otomatik geçişi etkinleştir",
            SkipButtonToggle: "Atlama için özel bir tuşu etkinleştir",
            SkipButtonLabel: "Atlama tuşu:",
            ChoseKey: "Atlama için kullanmak istediğiniz tuşa basın<br>(Esc = iptal, Tab / Boşluk = yok sayılır).",
            SelectedKey: "Geçerli tuş: ",
            OverlayAlertShowToggle: "Bindirme uyarısını göster",
            OverlayAutoSaveToggle: "Bindirmeden çıkarken kaydet",
            HistoryButtonToggle: "Daha fazla geçmiş için ana sayfada düğmeyi etkinleştir",
            WatchlistButtonToggle: "Daha fazla izleme listesi için ana sayfada düğmeyi etkinleştir",
            saveButton: "Kaydet",
            cancelButton: "İptal",
            defaultButton: "Varsayılan",
            confirmExit: "Çıkmak ve ayarları kaydetmek istiyor musunuz?",
            saveChoice: "Seçiminizi kaydedin",
            yes: "Evet",
            no: "Hayır",
            AutoSkOff: "Otomatik geçişi devre dışı bırak",
            AutoSkON: "Otomatik geçişi yeniden etkinleştir"
        },
        vi: {
            HeadLabelTitle: "Tham số bỏ qua tự động",
            AutoSkipActiveToggle: "Bật bỏ qua tự động",
            AutoSkipDelayInput: "Độ trễ trước khi bỏ qua (ms)",
            ArrowAutoSkipToggle: "Bật bỏ qua tự động bằng phím mũi tên",
            SkipButtonToggle: "Bật phím chuyên dùng để bỏ qua",
            SkipButtonLabel: "Phím bỏ qua:",
            ChoseKey: "Nhấn phím bạn muốn dùng để bỏ qua<br>(Esc = hủy, Tab / Space = bỏ qua).",
            SelectedKey: "Phím hiện tại: ",
            OverlayAlertShowToggle: "Hiển thị cảnh báo lớp phủ",
            OverlayAutoSaveToggle: "Lưu khi thoát lớp phủ",
            HistoryButtonToggle: "Bật nút trên trang chính để xem lịch sử nhiều hơn",
            WatchlistButtonToggle: "Bật nút trên trang chính để xem danh sách theo dõi nhiều hơn",
            saveButton: "Lưu",
            cancelButton: "Hủy",
            defaultButton: "Mặc định",
            confirmExit: "Bạn có muốn thoát và lưu cài đặt không?",
            saveChoice: "Lưu lựa chọn của bạn",
            yes: "Có",
            no: "Không",
            AutoSkOff: "Tắt bỏ qua tự động",
            AutoSkON: "Bật lại bỏ qua tự động"
        }
    };

})();
