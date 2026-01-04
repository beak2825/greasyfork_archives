// ==UserScript==
// @name      [Bilibili] 小窗尺寸缩放
// @name:en         [Bilibili] MiniScreenResizer
// @name:zh      [Bilibili] 小窗尺寸缩放
// @namespace    ckylin-script-bili-miniscreenresizer
// @version      0.1
// @description  使用滚轮修改视频小窗口尺寸
// @description:en  Change Bilibili video miniscreen with your mouse wheel
// @description:zh  使用滚轮修改视频小窗口尺寸
// @author       CKylinMC
// @match        https://www.bilibili.com/video/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPLv3 License
// @downloadURL https://update.greasyfork.org/scripts/455657/%5BBilibili%5D%20%E5%B0%8F%E7%AA%97%E5%B0%BA%E5%AF%B8%E7%BC%A9%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455657/%5BBilibili%5D%20%E5%B0%8F%E7%AA%97%E5%B0%BA%E5%AF%B8%E7%BC%A9%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    const $ = q=>document.querySelector(q);
    const $$ = q=>[...document.querySelectorAll(q)];
    const BVC = {
        mini: '.bpx-player-container[data-revision="1"][data-screen=mini], .bpx-player-container[data-revision="2"][data-screen=mini]',
        container: '.bpx-player-container',
    };
    const CACHE = {};
    const setWH = (e,w,h)=>(e.style.width=w+'px',e.style.height=h+'px',[w,h]);
    const parsePX = px=>parseFloat(px.replace('px',''));
    const getWH = e=>{const es = getComputedStyle(e);return [parsePX(es.width),parsePX(es.height)]};
    const setTrans = (e,cancel)=>e.style.transition=cancel?'none':"width .3s ease, height .3s ease";
    const wait = t => new Promise(r => setTimeout(r, t));
    const setWHcss = (selector,w,h)=>css("RESIZERCSS",`${selector}{ width:${w}px!important;height:${h}px!important; }`);

    function css(id,content){
        let el = $('style#'+id);
        if(!el){
            el = document.createElement('style');
            el.id = id;
            document.body.appendChild(el);
        }
        el.innerHTML = content;
        return el;
    }

    function parseFl (fl){
        try{
            const f = parseFloat(fl);
            if(!isNaN(f) && f>=0) return f;
        }catch(e){}
        return -1
    }

    let menuIds = [];
    let menus = {};
    const registerMenu = (text, callback) => menuIds.push(GM_registerMenuCommand(text, callback));
    const clearMenu = () => { menuIds.forEach(id => GM_unregisterMenuCommand(id)); menuIds = []; };

    async function playerReady(){
        let i=50;
        while(--i>=0){
            await wait(200);
            if(!('player' in unsafeWindow)) continue;
            if(!('isInitialized' in unsafeWindow.player)) continue;
            if(!unsafeWindow.player.isInitialized()) continue;
            return true;
        }
        return false;
    }

    async function waitForDom(q) {
        let i = 50;
        let dom;
        while (--i >= 0) {
            if (dom = $(q)) break;
            await wait(100);
        }
        return dom;
    }

    function applyMenus() {
        clearMenu();
        for (let item in menus) {
            if(!menus.hasOwnProperty(item)) continue;
            let menu = menus[item];
            registerMenu(menu.text, menu.callback);
        }
    }

    function setMenu(id,text,callback,noapply = false) {
        menus[id] = { text, callback };
        if (!noapply) applyMenus();
    }

    function resize(w,h){
            const e = $(BVC.mini);
            setTrans(e);
            if(w&&h){
                setWHcss(/*e*/BVC.mini,w,h);
            }
            return getWH(e);
        }

    (unsafeWindow||window).resizer = {
        $,$$,BVC,setWH,parsePX,getWH,setWHcss,
        resize
    }

    function prevent(e){
        if(!CACHE.container) return;
        const el = CACHE.container;
        if(el.getAttribute('data-screen')!='mini'){
            return;
        }
        e.preventDefault();
        e.stopPropagation();
    }

    function onMouseWheel(e){
        if(!CACHE.container) return;
        const el = CACHE.container;
        if(el.getAttribute('data-screen')!='mini'){
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        console.log(e,e.wheelDeltaY);
        let [w,h] = getWH(CACHE.container);
        let delta = e.wheelDeltaY || e.deltaY;
        delta = 0.1*delta;
        w+=delta;
        h = w/16*9;
        setTrans(CACHE.container,true);
        setWHcss(/*CACHE.container*/BVC.mini,w,h);
        return false;
    }

    async function inject(){
        await playerReady();
        console.log('player ready');
        await waitForDom(BVC.container);
        console.log('dom ready');
        const el = $(BVC.container);
        if(!el) {
            throw new Error();
        }
        console.log('element ready');
        CACHE.container = el;
        el.addEventListener('onwheel',e=>prevent(e),false);
        el.addEventListener('mousewheel',e=>onMouseWheel(e),false);
        el.addEventListener('DOMMouseScroll',e=>onMouseWheel(e),false);
    }

    function init(){
        [
            {
                id:'240',
                text: "240x135",
                callback: ()=>resize(240,135)
            },
            {
                id:'320',
                text: "320x180(默认)",
                callback: ()=>resize(320,180)
            },
            {
                id:'480',
                text: "480x270",
                callback: ()=>resize(480,320)
            },
            {
                id:'640',
                text: "640x360",
                callback: ()=>resize(640,360)
            },
            {
                id:'custom',
                text: "自定义",
                callback: ()=>{
                    const curr = getWH($(BVC.mini));
                    const w = parseFl(prompt("宽度:(当前"+curr[0]+")"));
                    if(w<0) return alert("输入不是有效大于0数字，已取消输入");
                    const h = parseFl(prompt("高度:(当前"+curr[1]+"，根据输入的宽度("+w+")推荐高度:"+(Math.round(w/16*9))+")"));
                    if(h<0) return alert("输入不是有效大于0数字，已取消输入");
                    setTimeout(()=>resize(w,h),200);
                }
            },
        ].forEach(it=>setMenu(it.id,it.text,it.callback,true));
        applyMenus();
        inject().then(()=>console.log('[RESIZER] injected')).catch(e=>console.error('[RESIZER] cannot inject'));
    }
    init();
})();