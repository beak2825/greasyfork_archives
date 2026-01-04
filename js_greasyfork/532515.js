// ==UserScript==
// @name         🌌V2 Kастомизация для сайта Black Russia Forum
// @namespace    http://tampermonkey.net/
// @version      17.6.10
// @description  Полный визуальный редизайн форума Black Russia. Выбор обоев, плавные анимации, оптимизация интерфейса и гибкая настройка под себя.
// @author       Maras Rofls
// @match        https://forum.blackrussia.online/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @icon         https://i.postimg.cc/28kMdmFG/e65d50f699ab952ca89c8525058c4a0d.gif
// @connect      i.postimg.cc
// @connect      api.imgbb.com
// @connect      *
// @run-at       document-start
// @license      No License  (All Rights Reserved)
// @downloadURL https://update.greasyfork.org/scripts/532515/%F0%9F%8C%8CV2%20K%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Black%20Russia%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/532515/%F0%9F%8C%8CV2%20K%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B0%D0%B9%D1%82%D0%B0%20Black%20Russia%20Forum.meta.js
// ==/UserScript==
(function() {
    'use strict';

class DOMWatcher {
    constructor() {
        this.observers = new Set();
        this.observer = new MutationObserver(this.handleMutations.bind(this));
    }
    start() {
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    subscribe(callback) {
        this.observers.add(callback);
    }
    handleMutations(mutations) {
        for (const mutation of mutations) {
            this.observers.forEach(cb => cb(mutation));
        }
    }
}
    const globalDOMWatcher = new DOMWatcher();
    const STYLE_ID = 'blackrussia-custom-style';
    const WELCOME_SCREEN_ID = 'br-style-welcome-screen';
    const SCRIPT_VERSION = '17.6.10';
    const PANEL_ID = 'blackrussia-settings-panel';
    const BOTTOM_NAV_ID = 'blackrussia-bottom-nav-bar';
    const CLOCK_ID = 'br-style-clock';
    const STYLE_ICON_ID = 'br-style-toggle-icon';
    const EFFECTS_CONTAINER_ID = 'br-effects-container';
    const BACKGROUND_ELEMENT_ID = 'br-style-background';
    const TOAST_CONTAINER_ID = 'br-style-toast-container';
    const SCROLL_INDICATOR_ID = 'br-style-scroll-indicator';
    const UPLOAD_HISTORY_KEY = 'br_style_upload_history';
    const BOTTOM_NAV_HEIGHT = '45px';
    const MAX_IMAGE_SIZE_MB = 5;
    const PETAL_IMAGES = {};
    const WALLPAPER_GALLERY={
"<i class='fas fa-magic'></i> Разное":["https://i.postimg.cc/9f7QbDkF/0bd00269d46d7a3dd09eb273c7da02ee.jpg","https://i.postimg.cc/0Nwynz4S/145b85f6ea6b21515ff3b308a0ee4a2a.jpg","https://i.postimg.cc/zfgG7yQm/17c4cd1652619576e4b6f565832c3ded.jpg","https://i.postimg.cc/zfgG7yQq/1dfc462ef8fef48a49bf8f28d6f6d989.jpg","https://i.postimg.cc/Pqw5yC7w/2640fed1ea3738e2017f0518929dd26f.jpg","https://i.postimg.cc/Kz7vXdxc/2b1790a454afdb18da1ac7c459330b05.gif","https://i.postimg.cc/1zq3B8d9/2ddaa7929f4342b8883424218329581b.jpg","https://i.postimg.cc/mDW25bxS/4500e1bee06312fa306161f79dcd1de7.jpg","https://i.postimg.cc/mrHgjPn1/54963f909932467ce747f9dc25cd2c6e.gif","https://i.postimg.cc/mDW25bxY/63d9e7dbf38b7f6b3da015dca1825850.jpg","https://i.postimg.cc/fb9RCVPs/6c76563cad195ca18a57ee770a9d85c1.jpg","https://i.postimg.cc/4dRNSJCp/72bdbd20d38ab581aba4eac36a94ffae.gif","https://i.postimg.cc/TwvY4R8g/747140ce3b513f2b39cfae161e56b4dd.gif","https://i.postimg.cc/bJfNBzXL/79cc3a15c43d12478e6538b61fc3e4a2.jpg","https://i.postimg.cc/ydCYbVqv/7ec94f09c0400795ff8c600f3c21a7d1-(1).jpg","https://i.postimg.cc/GpymK4fC/8eb01fb47d1e21f8db58cef9dbce93a7.jpg","https://i.postimg.cc/W4k18dyr/96bd7eb39ac874247723bcf5e8aa06bc.jpg","https://i.postimg.cc/cJnLhvzL/a7d86abe6ebb9391793a9049026cd7ae.jpg","https://i.postimg.cc/tgx4kscF/e3783b9a67952187dab9608d16de1d36.jpg","https://i.postimg.cc/FKLHpY6J/fa202ee1d6b40e48f3698ca2a2f517c4.jpg","https://i.postimg.cc/B6fQVqWP/fdfe94c7bdd0bf4afdd830e0b2c515e9-(1).gif"],
"<i class='fas fa-mobile-alt'></i> GIF обои для Телефона":["https://i.postimg.cc/Wz78xbdj/aesthetic.gif","https://i.postimg.cc/cLzmpzLq/chill-japan.gif","https://i.postimg.cc/WzSmXWys/idk.gif","https://i.postimg.cc/Dw4sXw7n/gif-chill.gif","https://i.postimg.cc/nrL9cH3R/moon-planet.gif","https://i.postimg.cc/c42t0GfH/honkai-impact.gif","https://i.postimg.cc/pTmyg0y9/te-amo-feliz-cumpleanos.gif","https://i.postimg.cc/L8y92zcF/live-wallpaper.gif","https://i.postimg.cc/V6WHPFhD/happy-birthday.gif","https://i.postimg.cc/MT5tFpMX/vibe.gif","https://i.postimg.cc/cJMcvLcQ/wallpaper.gif","https://i.postimg.cc/tg5hXmX4/honkai-impact-(1).gif","https://i.postimg.cc/Z5PNcDvL/cyberpunk.gif","https://i.postimg.cc/50D5GQ45/lofi-anime.gif","https://i.postimg.cc/TPwr3Jh4/haikyuu-hinata.gif","https://i.postimg.cc/zGfLCX5q/zerotwo.gif"],
"<i class='fas fa-desktop'></i> GIF обои для ПК":["https://i.postimg.cc/xTVHr2Q3/hug.gif","https://i.postimg.cc/5NXwq0nB/babako.gif","https://i.postimg.cc/vTY4BQZ2/nezuko.gif","https://i.postimg.cc/90kchVRc/waifu.gif","https://i.postimg.cc/SRnpV5Tp/osaka-lofi-banner.gif","https://i.postimg.cc/Vk8kLfZk/cherry.gif","https://i.postimg.cc/ncvn58Vs/kirokaze.gif","https://i.postimg.cc/fbgsXDCP/kirokaze-(1).gif","https://i.postimg.cc/90dsxhdJ/pokemon.gif","https://i.postimg.cc/sgX0WSNH/background-kereta.gif","https://i.postimg.cc/j57jSDTn/adventure-time.gif","https://i.postimg.cc/L6Rsm4bP/cat-kedi.gif","https://i.postimg.cc/pd8T29RX/rust-oil-rig.gif","https://i.postimg.cc/Hnt8Tr0Q/u-afcd953.gif","https://i.postimg.cc/PJbYN3H1/bliss-winxp.gif","https://i.postimg.cc/q79kSpKc/shinobu.gif"],
"<i class='fas fa-tree'></i> Природа":["https://i.postimg.cc/fThHC5J9/0185acd4ab82d25d60eef415adf19a2f.jpg","https://i.postimg.cc/BQGhpNX4/30028eb3ab96fa9fa4c361a1481f4952.jpg","https://i.postimg.cc/YqwXR8hv/7bd2995d3f3cb531afd718b714426ac9.jpg","https://i.postimg.cc/SNpZdVJz/99dedb1c832c9c01bbffe979ac0298b5.jpg","https://i.postimg.cc/wTdW2F7y/b3a35bba489d6306b454d8b089e1e4bd.jpg","https://i.postimg.cc/Prk6yKPQ/c679a199d8f22d305b12ecf0ba7f0085-(1).jpg","https://i.postimg.cc/Prk6yKPb/c80f1dfbd2605f7251c6337de63afba2.jpg","https://i.postimg.cc/hPqCsMf9/d0d55c3c2dcd506fd0e1fab4cff6303e.jpg","https://i.postimg.cc/WbP98Sh6/db80a3e81622370d4add365252121345.jpg","https://i.postimg.cc/8kfmfYmC/2d332406197d20278a6add33a10c7507.jpg","https://i.postimg.cc/PfvQv7Qx/469276dcef747a64f7852f8f7a0b94fb.jpg","https://i.postimg.cc/XNBkBPkq/9462c11f99d851e2133b1b2474e5f14b.jpg","https://i.postimg.cc/zDHFHQF5/f5a524b0d731a3a15e5700316b1c4cbd.jpg","https://i.postimg.cc/Y2LzLPzC/fc63221ccd2f821d0d10312ab9a917c0.jpg","https://i.postimg.cc/jdPVcZts/07a244796226ce7b18d994cdb5c676dc.jpg","https://i.postimg.cc/J4ZwxPmx/0880a8943b1a4a68e00d74255d08b242.jpg","https://i.postimg.cc/tCW0k2yD/0bd364d1bafd05f8a319574118c8127d-(1).jpg","https://i.postimg.cc/15wxBJsm/0f3efb60fe8a7ee23408471c10494803.jpg","https://i.postimg.cc/65nscYwP/1044297b290600b762afb82c15bae15c.jpg","https://i.postimg.cc/NfmhDpYP/1a4baac8a11bb3a0e9affef725518ba4.jpg","https://i.postimg.cc/3rP52PMf/1aed27558f343f06c5e4ac09d9f809ae.jpg","https://i.postimg.cc/dQzPGzM3/25bd6fd4c7a3788993548eba635101ca.jpg","https://i.postimg.cc/28hpG2rj/2a6ac84ccb57f9fefe2798dfbde25319.jpg","https://i.postimg.cc/fTm4CBZ6/2b62da001ec93a3c56748aac28b5d62b.jpg","https://i.postimg.cc/Vs3QX3yH/302b4fc779b7ba571e985b8594d88af1.jpg","https://i.postimg.cc/h4HWVHF0/37ef3ecdd7290c544d3f985da3523a66.jpg","https://i.postimg.cc/SQwFcw0r/3be529306ec559e6ccfa801b34b0d09f.jpg","https://i.postimg.cc/RCj5wjrq/546d58a69d51b5525cd97a62395ff7fc.jpg","https://i.postimg.cc/7Pp8Spvg/64de71a19c72c32c4cbcbbb0a08dad13.jpg","https://i.postimg.cc/hPTFspct/656d41426bc16d1bba435e1c6bf8cdd6.jpg","https://i.postimg.cc/02Dgncx0/6e81f9309ca7c329754b069a77c45acd.jpg","https://i.postimg.cc/zXKm708Y/77a7713d630a2765a189fd1ff60f98c0.jpg","https://i.postimg.cc/WbgR8Xj6/77ffa189c556187d1aca079e0248c473.jpg","https://i.postimg.cc/xjkVJ9Zz/7ec94f09c0400795ff8c600f3c21a7d1.jpg","https://i.postimg.cc/gcfF3f9x/871f07adb56b7dc714fd729c6166e6f3.jpg","https://i.postimg.cc/jqG0yGV6/880435d08da4f6553ed9b561a1ffbf4a.jpg","https://i.postimg.cc/XNTS9TMP/884179968ac3a009a2df453ea3fd4c8d.jpg","https://i.postimg.cc/sD7FmwyJ/92b6237e0a7f2888768c4cf1fa43277d.jpg","https://i.postimg.cc/jqG0yGV8/9bebf25f4b390925d133d7831d4f2164.jpg","https://i.postimg.cc/Dftk1tVj/a10b2a4ed36974434fca78f68fb3d585.jpg","https://i.postimg.cc/fW6nY643/b607d0645b48424aa8f1ca7a9507c4fc.jpg","https://i.postimg.cc/J4ZwxPmp/b8ed4156118706620fee2e60065b8b91.jpg","https://i.postimg.cc/L6LdDNRN/b95cd8439fc6b6ebf1b91ee3bef02c54.jpg","https://i.postimg.cc/KcdStdXL/c158aa687941766bb9289c9011f5d5f4.jpg","https://i.postimg.cc/ZKpkHV4J/cbb52a882105cf814a0a3ed2168eef37.jpg","https://i.postimg.cc/gk89sNmF/d42730f8e96a8e329eee76ecd1e0af1c.jpg","https://i.postimg.cc/9Xv5yv3b/d68de7971400377b0881565883e249bf.jpg","https://i.postimg.cc/zD9ZT9mK/d891e51065322a04a50d661ab6fb470c.jpg","https://i.postimg.cc/sD7FmwyN/db4dd589be056ab2b2191423f6f9e43c.jpg","https://i.postimg.cc/pXzNCqxw/e8052342a0eda329224eabded4fd7653.jpg","https://i.postimg.cc/GhG0Kqdd/ec73692ab65c02cd2df2ede2921136a1.jpg","https://i.postimg.cc/Njc3zmjh/efc090eda495242466ff40e0d3fc5071.jpg","https://i.postimg.cc/tCW0k2yv/f7f2ef062768ce8c6ab76eeb7dec58ad.jpg","https://i.postimg.cc/3JmM1nYJ/ff0f47f7c359584ff3d6fad6d6f09957.jpg"],
"<i class='fas fa-snowflake'></i> Новый год":["https://i.postimg.cc/6qx2vMtP/358a87e9957fb2f8ca9dfd6a5fe67851.jpg","https://i.postimg.cc/d3cky5JQ/42fc33a3f381c0d828b89c70d95fca04.jpg","https://i.postimg.cc/brfDtmqX/51c5feacfee4e9f4a2a1792f9db8cd91.jpg","https://i.postimg.cc/Xq6GCs41/83b13dbfa450907a40ac3cf32549ab71.jpg","https://i.postimg.cc/C1qn53py/87d19b7e6d86e5133303770fe46dc9e1.jpg","https://i.postimg.cc/D03JXxnM/991602375ac130dc5a043fc76d2ff221.jpg","https://i.postimg.cc/sxCQhT3D/a5bc068f9e5010308334d36411147583.jpg","https://i.postimg.cc/hvRzd2cH/a9de41f2b5e45a873b1327ce1b37ef28.jpg","https://i.postimg.cc/Xq6GCsnV/adab9363d1771d6f3f4872d0ceb056f6.jpg","https://i.postimg.cc/90HR7LCN/dbcf6265bb574a238ca1da34513de917.jpg","https://i.postimg.cc/NFv9HdBZ/dfc77c71895d4f004c0687bf3c4d4801.jpg","https://i.postimg.cc/Gtn8yXbw/f3e030c90ddb913650964ce6cfc0e1d8.jpg"],
"<i class='fas fa-city'></i> Город":["https://i.postimg.cc/50Ljb8LG/15020ac296aa3ab8b8da46db65777710-(1).jpg","https://i.postimg.cc/j5PCtyPv/182f03ba7db4be84edda6fdc52f5b6a7.jpg","https://i.postimg.cc/JnZtMjZ2/5b10b689b889be48a61e419c7534ad40.jpg","https://i.postimg.cc/JnZtMjZp/5d3e6f3b56d7530d57e6cc76bbb8e37f.jpg","https://i.postimg.cc/tTW7pFWw/5e22910a69edb226b865bbafa18a285c.jpg","https://i.postimg.cc/vBfDb5f3/802a726c4e09ef60773b6e9b5d334da7.jpg","https://i.postimg.cc/Qt1Vhc1J/86e07779c2ea825ca3ad7c185a08d2a6.jpg","https://i.postimg.cc/k4KDqWKs/c57fd23ca8031721d6c176afbb9f7182.jpg","https://i.postimg.cc/Qt1Vhc1z/d6880e813d0cee6298e7e16cfbe5d192.jpg"],
"<i class='fas fa-ghost'></i> Аниме":["https://i.postimg.cc/LsZ83jCg/091472f1ecb725e6ac371faea4ffbebe.jpg","https://i.postimg.cc/KYg8DtqP/1c9fe641e56e8a86cf588be30cb8c74d.jpg","https://i.postimg.cc/3wDxF2Sp/20f116c27cfb3bfc105a7f918b1f2bc8.jpg","https://i.postimg.cc/Zqy5x67R/33d13e57b4d58f1c7b4f67e91b194774.jpg","https://i.postimg.cc/CKfxsbPK/4a99d606ecdcb8972504cf41fe47cc2b.jpg","https://i.postimg.cc/Pq85Q13X/5de4f7a34b32ad89ae56b0ba7a1b82c4.jpg","https://i.postimg.cc/xdb13Lx8/6fb485c2ffb3c57a2fd416fc9830f060.jpg","https://i.postimg.cc/hG7t1Vyt/8b0d7db4f7899489c7c8f2be3a6aea80.jpg","https://i.postimg.cc/VNbkWXGr/8dc2f6fda9f6c1f68fa36671bce31ef6.jpg","https://i.postimg.cc/XvyYk9Hd/c83aa4cdbff2241148e27d99d8180485.jpg","https://i.postimg.cc/vm6Zt5qn/e48cb63a72d65419b05229ba8cdab4e2.jpg","https://i.postimg.cc/k5tgvW1W/fb6aefae8686b08cc6fcf67613d8f7da.jpg","https://i.postimg.cc/rmM2R4vq/037871995e93b6a628110a6e2514379e.jpg","https://i.postimg.cc/cH0Gt3VG/14ea9b63668d521a1024e986c4bec707.jpg","https://i.postimg.cc/Y2LzLPzC/2d65eec34a18847d59591490f41cdb77.jpg","https://i.postimg.cc/NMBv2XWw/3327ac2c881524bebcb7c77c24c85fd5.jpg","https://i.postimg.cc/cH0Gt3Vq/3b64cac23b23a01c24eca1d5652adb97.jpg","https://i.postimg.cc/9MCHw9vh/52ba18f5d2a4a7fae730177e862d4eb3.jpg","https://i.postimg.cc/FRNXkSwW/7966fd70c891a9d00319ddf4800e80c6.jpg","https://i.postimg.cc/QthZK7RD/8a29c6d382f48b3dd5383eff67413f65.jpg","https://i.postimg.cc/zB8YHh49/b8593e6d4ccb79212e52a3357157350d.jpg","https://i.postimg.cc/0QP1KSLk/be394c425ab59b37259f8e582af4ba92.jpg","https://i.postimg.cc/DZn34Gtn/c5c1ce89f8eb88b5d3ad494a8f4c3b30.jpg","https://i.postimg.cc/Twfv5bZR/d400dcdb653b74ae19834a089508bf81.jpg","https://i.postimg.cc/63tx4ZFk/da698024f3af035bf8f84c01810bfe80.jpg","https://i.postimg.cc/W3TcqZx8/e72f6d9de0503ea952fbdd07e655f016-(1).jpg","https://i.postimg.cc/d1wcZCgg/f70de7b94e14a65578facc8f9d18f4bf.jpg","https://i.postimg.cc/d1wcZCgN/f8337684ee6984b2198dacee61479183.jpg","https://i.postimg.cc/fLDQSd1H/fa98fb37dd17e516663d8b4aad6894f4.jpg"]};let settingsPanel=null;let settingsIcon=null;let bottomNavElement=null;let clockElement=null;let effectsContainer=null;let toastContainer=null;let myUsername=null;let domObserver=null;let scrollObserver=null;let scrollIndicatorElement=null;let currentSettings={};let tempSettingsSnapshot=null;let lastScrollTop=0;let threadAuthor=null;let brWorker=null;

    const WORKER_SOURCE = `
    self.onmessage = function(e) {
    const { type, payload } = e.data;

        if (type === 'PROCESS_COUNTERS') {
     const { html } = payload;
     const alertsMatch = html.match(/class="p-nav-link--alerts[^"]*"[^>]*data-badge="(\d+)"/);
            const convsMatch = html.match(/class="p-nav-link--conversations[^"]*"[^>]*data-badge="(\d+)"/);

            self.postMessage({
                type: 'COUNTERS_RESULT',
                data: {
                    alerts: alertsMatch ? parseInt(alertsMatch[1]) : 0,
                    conversations: convsMatch ? parseInt(convsMatch[1]) : 0
                }
            });
        }
    };
    `;

    function setupBrWorker() {
        if (brWorker) return;
        const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' });
        brWorker = new Worker(URL.createObjectURL(blob));

        brWorker.onmessage = function(e) {
            const { type, data } = e.data;

            if (type === 'COUNTERS_RESULT') {
                const updateBadge = (sel, count) => {
                    const el = document.querySelector(sel);
                    if (!el) return;
                    const current = parseInt(el.textContent.trim()) || 0;
                    if (count > 0) {
                        el.textContent = count;
                        el.style.display = '';
                        if (count > current) {
                            el.classList.add('br-counter-pop');
                            setTimeout(() => el.classList.remove('br-counter-pop'), 700);
                        }
                    } else {
                        el.style.display = 'none';
                    }
                };

                updateBadge('.p-nav-link--alerts .badge', data.alerts);
                updateBadge('.p-nav-link--conversations .badge', data.conversations);
            }
        };
    }

const defaultSettings={fontColor:'#F0F8FF',bgImageDataUri:'',opacityValue:0.3, borderRadius:'10px',bgColor:'#18181b',enableRounding:true,enableEdge:true,edgeColor:'#4A90E2',edgeWidth:'1px',edgeOpacity:0.5,edgeStyle:'cloud_glow',fontFamily:'"Georgia", serif',transparentElementsOpacity:1,enableGradient:false,gradientColor1:'#333333',gradientColor2:'#000000',gradientColor3:'#555555',gradientColor4:'#222222',gradientDirection:'135deg',enableAnimatedGradient:false,animatedGradientSpeed:'5s',enableBottomNav:true,bottomNavOpacity:0.85,bottomNavBorderRadius:'25px',bottomNavPosition:'bottom-center',quickLinks:[{name:'Главная',url:'https://forum.blackrussia.online/',icon:'fas fa-home'},{name:'Правила',url:'https://forum.blackrussia.online/index.php?forums/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.10/',icon:'fas fa-gavel'},{name:'Жалобы',url:'https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B.14/',icon:'fas fa-exclamation-shield'}],enableTextGlow:false,textGlowColor:'#FFFF00',textGlowIntensity:'5px',effectType:'none',effectIntensity:50,effectSpeed:1,effectSwayIntensity:1,effectRainLength:20,customPresets:{},enableBlockBlur:false,blockBlurAmount:5,enableOwnMessageHighlight:false,ownMessageHighlightBgColor:'#2c3e50',ownMessageHighlightEdgeColor:'#3498db',ownMessageHighlightEdgeWidth:'0.2px', enableAvatarBorder:false,avatarBorderColor1:'#FF00DE',avatarBorderColor2:'#00F0FF',avatarBorderColor3:'#00FF85',avatarBorderSize:'2px',avatarBorderSpeed:'3s',avatarBorderStyle:'gradient',avatarPulsateColor:'#FFFFFF',enablePulsatingNicks:false,pulsatingNickColor:'#FFFFFF',pulsatingNickIntensity:1.1,pulsatingNickSpeed:'2s',enableGradientNicks:false,gradientNickColor1:'#FFFFFF',gradientNickColor2:'#00F0FF',gradientNickColor3:'#FF00DE',gradientNickSpeed:'3s',enableUiAnimations:false,uiAnimationSpeed:'0.2s',enableScrollFadeIn:true,scrollFadeInType:'fade-in-up',enableParallaxScroll:false,enableScrollIndicator:true,scrollIndicatorColor:'#00F0FF',scrollIndicatorHeight:'3px',enableWideMode:false,enableOpHighlight:true,opHighlightBgColor:'#3a2e4a',opHighlightEdgeColor:'#9b59b6',opHighlightEdgeWidth:'1px',enableSmartNav:true,enable3DAvatarHover:false,enableLikeAnimations:false,enableDynamicWelcome:true,enableInteractiveParticles:false,enableContextualBackgrounds:false,contextualBgUrl:'zhaloby',contextualBgPreset:'default_dark',enableLiveCounters:true,enableLiveFeed:true, enableHotTopicPulse:false,liveUpdateInterval:60,imgbbApiKey:'',uploaderBtnBgUrl:'',enableComplaintTracker:true,complaintTrackerWarnTime:12,complaintTrackerCritTime:24,complaintTrackerSections:'жалоб, обжалован, техническ, биографи, заявлен',panelTheme:'classic_dark',enableTopicAnimation:false,topicAnimationType:'fade-in',enableBinder:true,bottomNavTheme:'nav_theme_fire',enableThreadPreview:false,enableSectionStats:false,enableSkeletonLoading:true,enableCopyToast:true,};const availableFonts=[{name:"Georgia",value:'"Georgia", serif',url:''},{name:"Science Gothic",value:'"Science Gothic", sans-serif',url:'https://fonts.googleapis.com/css2?family=Science+Gothic&display=swap'},{name:"Rubik",value:'"Rubik", sans-serif',url:'https://fonts.googleapis.com/css2?family=Rubik:wght@400;700&display=swap'},{name:"Roboto Slab",value:'"Roboto Slab", serif',url:'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap'},{name:"Pacifico",value:'"Pacifico", cursive',url:'https://fonts.googleapis.com/css2?family=Pacifico&display=swap'},{name:"Lobster",value:'"Lobster", cursive',url:'https://fonts.googleapis.com/css2?family=Lobster&display=swap'},{name:"Russo One",value:'"Russo One", sans-serif',url:'https://fonts.googleapis.com/css2?family=Russo+One&display=swap'},{name:"Playfair Display SC",value:'"Playfair Display SC", serif',url:'https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400;700&display=swap'},{name:"Dela Gothic One",value:'"Dela Gothic One", cursive',url:'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap'},{name:"Orelega One",value:'"Orelega One", cursive',url:'https://fonts.googleapis.com/css2?family=Orelega+One&display=swap'},{name:"Rubik Vinyl",value:'"Rubik Vinyl", cursive',url:'https://fonts.googleapis.com/css2?family=Rubik+Vinyl&display=swap'}];const builtInPresets={'new_year':{enableGradient:true,gradientColor1:'#0a1931',gradientColor2:'#173a6a',gradientColor3:'#ffffff',gradientColor4:'#0a1931',gradientDirection:'135deg',enableAnimatedGradient:true,animatedGradientSpeed:'15s',bgColor:'#1a2a47',opacityValue:0.9,enableBlockBlur:true,blockBlurAmount:3,enableRounding:true,borderRadius:'10px',enableEdge:true,edgeColor:'#ffffff',edgeWidth:'1px',edgeOpacity:0.7,enableTextGlow:true,textGlowColor:'#cce7ff',textGlowIntensity:'8px',effectType:'snow',effectIntensity:100,effectSpeed:1,effectSwayIntensity:1.2,enableAvatarBorder:true,avatarBorderColor1:'#ffffff',avatarBorderColor2:'#cce7ff',avatarBorderColor3:'#89cff0',enablePulsatingNicks:false,enableUiAnimations:true,enableTopicAnimation:true,enableScrollIndicator:true,scrollIndicatorColor:'#ffffff'},'halloween':{enableGradient:true,gradientColor1:'#1a0000',gradientColor2:'#ff6600',gradientColor3:'#000000',gradientColor4:'#3d0000',gradientDirection:'45deg',enableAnimatedGradient:true,animatedGradientSpeed:'10s',bgColor:'#2b0f00',opacityValue:0.9,enableBlockBlur:false,enableRounding:true,borderRadius:'6px',enableEdge:true,edgeColor:'#ff6600',edgeWidth:'2px',edgeOpacity:0.8,enableTextGlow:true,textGlowColor:'#ff9900',textGlowIntensity:'10px',effectType:'leaves-autumn_maple',effectIntensity:60,effectSpeed:0.8,effectSwayIntensity:1,enableAvatarBorder:true,avatarBorderColor1:'#ff6600',avatarBorderColor2:'#f0ad4e',avatarBorderColor3:'#000000',enablePulsatingNicks:true,pulsatingNickColor:'#ff6600',pulsatingNickIntensity:1.1,pulsatingNickSpeed:'2s',enableUiAnimations:true,enableTopicAnimation:true,enableScrollIndicator:true,scrollIndicatorColor:'#ff6600'},'cyberpunk':{enableGradient:true,gradientColor1:'#000000',gradientColor2:'#ff00ff',gradientColor3:'#00ffff',gradientColor4:'#000000',gradientDirection:'45deg',enableAnimatedGradient:true,animatedGradientSpeed:'6s',bgColor:'#1a001a',opacityValue:0.9,enableBlockBlur:true,blockBlurAmount:2,enableRounding:true,borderRadius:'2px',enableEdge:true,edgeColor:'#00ffff',edgeWidth:'1px',edgeOpacity:0.8,enableTextGlow:true,textGlowColor:'#ff00ff',textGlowIntensity:'10px',effectType:'matrix',effectIntensity:90,effectSpeed:1.2,effectRainLength:18,enableAvatarBorder:true,avatarBorderColor1:'#ff00ff',avatarBorderColor2:'#00ffff',avatarBorderColor3:'#F0FF00',enablePulsatingNicks:true,pulsatingNickColor:'#00ffff',pulsatingNickIntensity:1.05,pulsatingNickSpeed:'1.5s',enableUiAnimations:true,enableTopicAnimation:true,enableScrollIndicator:true,scrollIndicatorColor:'#00ffff'},'valentines':{...defaultSettings,enableGradient:true,gradientColor1:'#ffc0cb',gradientColor2:'#e63946',gradientColor3:'#ffffff',gradientColor4:'#ffb6c1',gradientDirection:'135deg',enableAnimatedGradient:true,animatedGradientSpeed:'12s',bgColor:'#3d1a2a',opacityValue:0.9,enableBlockBlur:true,blockBlurAmount:3,enableRounding:true,borderRadius:'22px',enableEdge:true,edgeColor:'#ff8fab',edgeWidth:'1px',edgeOpacity:0.7,enableTextGlow:true,textGlowColor:'#ffc0cb',textGlowIntensity:'8px',effectType:'petals-red_rose',effectIntensity:60,effectSpeed:0.8,effectSwayIntensity:1.5,enableAvatarBorder:true,avatarBorderColor1:'#ff0054',avatarBorderColor2:'#ffffff',avatarBorderColor3:'#ff8fab',enablePulsatingNicks:true,pulsatingNickColor:'#ff8fab',pulsatingNickIntensity:1.05,enableGradientNicks:false,enableScrollIndicator:true,scrollIndicatorColor:'#ff0054'},'womens_day':{...defaultSettings,enableGradient:true,gradientColor1:'#f8c5c8',gradientColor2:'#a4d4ae',gradientColor3:'#ffffff',gradientColor4:'#fffdd0',gradientDirection:'45deg',enableAnimatedGradient:true,animatedGradientSpeed:'15s',bgColor:'#333333',opacityValue:0.85,enableBlockBlur:true,blockBlurAmount:4,enableRounding:true,borderRadius:'10px',enableEdge:true,edgeColor:'#90ee90',edgeWidth:'1px',edgeOpacity:0.8,enableTextGlow:true,textGlowColor:'#d4ffb8',textGlowIntensity:'6px',effectType:'petals-sakura',effectIntensity:70,effectSpeed:1,effectSwayIntensity:1.3,enableAvatarBorder:true,avatarBorderColor1:'#f8c5c8',avatarBorderColor2:'#90ee90',avatarBorderColor3:'#fffdd0',enablePulsatingNicks:false,enableGradientNicks:true,gradientNickColor1:'#f8c5c8',gradientNickColor2:'#90ee90',gradientNickColor3:'#f8c5c8',enableScrollIndicator:true,scrollIndicatorColor:'#f8c5c8'},'victory_day':{...defaultSettings,enableGradient:true,gradientColor1:'#000000',gradientColor2:'#ff6600',gradientColor3:'#d90429',gradientColor4:'#000000',gradientDirection:'to right',enableAnimatedGradient:true,animatedGradientSpeed:'10s',bgColor:'#1c1c1c',opacityValue:0.9,enableBlockBlur:false,enableRounding:true,borderRadius:'4px',enableEdge:true,edgeColor:'#ff6600',edgeWidth:'2px',edgeOpacity:0.9,enableTextGlow:true,textGlowColor:'#fca311',textGlowIntensity:'10px',effectType:'none',enableAvatarBorder:true,avatarBorderStyle:'pulsate',avatarPulsateColor:'#fca311',avatarBorderSpeed:'2s',enablePulsatingNicks:true,pulsatingNickColor:'#ff6600',pulsatingNickIntensity:1.1,enableGradientNicks:false,enableScrollIndicator:true,scrollIndicatorColor:'#ff6600'},'ramadan':{...defaultSettings,enableGradient:true,gradientColor1:'#004d40',gradientColor2:'#ffd700',gradientColor3:'#ffffff',gradientColor4:'#00695c',gradientDirection:'135deg',enableAnimatedGradient:true,animatedGradientSpeed:'14s',bgColor:'#003d33',opacityValue:0.9,enableBlockBlur:true,blockBlurAmount:2,enableRounding:true,borderRadius:'8px',enableEdge:true,edgeColor:'#ffd700',edgeWidth:'0.3px',edgeOpacity:0.8,enableTextGlow:true,textGlowColor:'#fff59d',textGlowIntensity:'8px',effectType:'fireflies',effectIntensity:50,effectSpeed:0.7,effectSwayIntensity:1,enableAvatarBorder:true,avatarBorderColor1:'#ffd700',avatarBorderColor2:'#ffffff',avatarBorderColor3:'#00796b',enablePulsatingNicks:false,enableGradientNicks:true,gradientNickColor1:'#ffd700',gradientNickColor2:'#ffffff',gradientNickColor3:'#fff59d',enableScrollIndicator:true,scrollIndicatorColor:'#ffd700'},'default_dark':{...defaultSettings}};
const navThemes = {
    'nav_theme_fire': { mainBg: '#111111', borderColor: 'rgba(255, 102, 0, 0.3)', boxShadow: '0 0 10px rgba(255, 102, 0, 0.4), inset 0 0 5px #000000', glowGradient: 'linear-gradient(45deg, #FF6600, #B83E00, #4B0082, #FF6600)', glowOpacity: '0.5', linkHoverBg: 'rgba(255, 140, 0, 0.1)', linkHoverShadow: '0 0 5px rgba(255, 140, 0, 0.3)', accentColor: '#FF6600', mainGradient: 'linear-gradient(120deg, #80DEEA, #A7FFEB, #E1BEE7, #BA68C8, #80DEEA)' },
    'nav_theme_ocean': { mainBg: '#0F1A2F', borderColor: 'rgba(0, 114, 255, 0.3)', boxShadow: '0 0 10px rgba(0, 114, 255, 0.4), inset 0 0 5px #000000', glowGradient: 'linear-gradient(45deg, #00F0FF, #0072FF, #00C6FF, #00F0FF)', glowOpacity: '0.6', linkHoverBg: 'rgba(0, 114, 255, 0.1)', linkHoverShadow: '0 0 5px rgba(0, 114, 255, 0.3)', accentColor: '#00F0FF', mainGradient: 'linear-gradient(120deg, #4facfe, #00f2fe, #00c6ff, #0072ff, #4facfe)' },
    'nav_theme_forest': { mainBg: '#102A1C', borderColor: 'rgba(0, 255, 133, 0.3)', boxShadow: '0 0 10px rgba(0, 255, 133, 0.4), inset 0 0 5px #000000', glowGradient: 'linear-gradient(45deg, #00FF85, #0BA360, #3CBA92, #00FF85)', glowOpacity: '0.5', linkHoverBg: 'rgba(0, 255, 133, 0.1)', linkHoverShadow: '0 0 5px rgba(0, 255, 133, 0.3)', accentColor: '#00FF85', mainGradient: 'linear-gradient(120deg, #a8e063, #56ab2f, #3CBA92, #0BA360, #a8e063)' },
    'nav_theme_cyber': { mainBg: '#1A0F2F', borderColor: 'rgba(255, 0, 222, 0.3)', boxShadow: '0 0 10px rgba(255, 0, 222, 0.4), inset 0 0 5px #000000', glowGradient: 'linear-gradient(45deg, #FF00DE, #00F0FF, #FFEB3B, #FF00DE)', glowOpacity: '0.6', linkHoverBg: 'rgba(255, 0, 222, 0.1)', linkHoverShadow: '0 0 5px rgba(255, 0, 222, 0.3)', accentColor: '#FF00DE', mainGradient: 'linear-gradient(120deg, #FF00DE, #00F0FF, #F0FF00, #FF00DE, #FF00DE)' },
    'nav_theme_mono': { mainBg: '#111111', borderColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0 0 10px rgba(255, 255, 255, 0.4), inset 0 0 5px #000000', glowGradient: 'linear-gradient(45deg, #FFFFFF, #AAAAAA, #F0F0F0, #FFFFFF)', glowOpacity: '0.4', linkHoverBg: 'rgba(255, 255, 255, 0.1)', linkHoverShadow: '0 0 5px rgba(255, 255, 255, 0.3)', accentColor: '#FFFFFF', mainGradient: 'linear-gradient(120deg, #AAAAAA, #FFFFFF, #CCCCCC, #AAAAAA)' }
};

const MATRIX_CHARS='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';

function hexToRgb(hex){const m=/^#?([a-f\d]{6})$/i.exec(hex);if(!m)return null;const n=parseInt(m[1],16);return{r:n>>16&255,g:n>>8&255,b:n&255};}
function rgbToHslLocal(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;let h=0,s=0,l=(max+min)/2;if(d!==0){s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}return[h,s,l];}
function hslToRgbLocal(h,s,l){const k=n=>(n+h*12)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));const toHex=x=>Math.round(x*255).toString(16).padStart(2,'0');return`#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;}
function hexToRgbSimple(hex){const bigint=parseInt(hex.slice(1),16);return[(bigint>>16)&255,(bigint>>8)&255,bigint&255];}function readFileAsDataURL(file){return new Promise((resolve,reject)=>{if(file.size>MAX_IMAGE_SIZE_MB*1024*1024){reject(new Error(`Файл слишком большой! Макс. размер: ${MAX_IMAGE_SIZE_MB} МБ.`));return;}const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=(error)=>reject(error);reader.readAsDataURL(file);});}function downloadFile(filename,content,contentType){const blob=new Blob([content],{type:contentType});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);}function isValidEffectType(type){return['none','rain','snow','petals-sakura','petals-red_rose','leaves-autumn_maple','fireflies','matrix','bubbles'].includes(type);}function debounce(func,wait){let timeout;return function executedFunction(...args){const later=()=>{clearTimeout(timeout);func(...args);};clearTimeout(timeout);timeout=setTimeout(later,wait);};}function isValidURL(str){if(!str||typeof str!=='string')return false;try{new URL(str);return str.startsWith('http://')||str.startsWith('https://')||str.startsWith('ftp://');}catch(_){return str.startsWith('/');}}function getRandomInRange(min,max){return Math.random()*(max-min)+min;}function getRandomIntInRange(min,max){min=Math.ceil(min);max=Math.floor(max);return Math.floor(Math.random()*(max-min+1))+min;}function observeDOM(targetNode,callback,options={childList:true,subtree:true}){if(!targetNode)return null;const observer=new MutationObserver(callback);observer.observe(targetNode,options);return observer;}function injectScript(src){return new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.async=true;script.onload=resolve;script.onerror=reject;(document.head||document.documentElement).appendChild(script);});}function injectStyle(href){return new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href=href;link.onload=resolve;link.onerror=reject;(document.head||document.documentElement).appendChild(link);});}function createRipple(event){const button=event.currentTarget;if(!button)return;let rippleContainer=button.querySelector('.br-ripple-container');if(!rippleContainer){rippleContainer=document.createElement('div');rippleContainer.className='br-ripple-container';button.appendChild(rippleContainer);}const ripple=document.createElement('span');ripple.className='br-ripple-effect';const rect=button.getBoundingClientRect();const size=Math.max(rect.width,rect.height);ripple.style.width=ripple.style.height=`${size}px`;const x=event.clientX-rect.left-size/2;const y=event.clientY-rect.top-size/2;ripple.style.left=`${x}px`;ripple.style.top=`${y}px`;rippleContainer.appendChild(ripple);ripple.addEventListener('animationend',()=>{ripple.remove();});}let capsuleTimer;function showToast(message,type='info',duration=3000){let container=document.getElementById('br-capsule-container');if(!container){container=document.createElement('div');container.id='br-capsule-container';container.innerHTML=`<div id="br-capsule"><div class="br-capsule-content"><span class="br-capsule-icon"></span><span class="br-capsule-text"></span></div></div>`;document.body.appendChild(container);}const capsule=document.getElementById('br-capsule');const iconEl=capsule.querySelector('.br-capsule-icon');const textEl=capsule.querySelector('.br-capsule-text');let iconHtml='<i class="fas fa-info-circle c-info"></i>';if(type==='success')iconHtml='<i class="fas fa-check-circle c-success"></i>';if(type==='error')iconHtml='<i class="fas fa-exclamation-triangle c-error"></i>';if(type==='loading')iconHtml='<i class="fas fa-spinner fa-spin c-load"></i>';clearTimeout(capsuleTimer);iconEl.innerHTML=iconHtml;textEl.textContent=message;if(!capsule.classList.contains('br-active')){requestAnimationFrame(()=>{capsule.classList.add('br-active');});}capsuleTimer=setTimeout(()=>{capsule.classList.remove('br-active');},duration);}function throttle(f,t){let w;return(...a)=>{if(!w){f(...a);w=true;setTimeout(()=>w=false,t);}};}
function validateSetting(key,value,defaultValue){const dValue=(defaultValue!==undefined)?defaultValue:defaultSettings[key];const dType=typeof dValue;if(dType==='boolean'){return(value===true||value==='true');}if(dType==='number'){const parsedValue=parseFloat(value);if(isNaN(parsedValue))return dValue;let numValue=parsedValue;switch(key){case'opacityValue':case'edgeOpacity':case'bottomNavOpacity':case'transparentElementsOpacity':return Math.max(0,Math.min(1,numValue));case'effectIntensity':return Math.max(10,Math.min(200,parseInt(numValue,10)));case'effectSpeed':return Math.max(0.1,Math.min(5,numValue));case'effectSwayIntensity':return Math.max(0,Math.min(3,numValue));case'effectRainLength':case'blockBlurAmount':return Math.max(0,Math.min(50,parseInt(numValue,10)));case'pageTransitionDuration':case'pulsatingNickIntensity':return Math.max(0.1,Math.min(2,numValue));default:return Number.isInteger(dValue)?parseInt(numValue,10):numValue;}}if(dType==='string'){const strValue=(value!==null&&value!==undefined)?String(value).trim():String(dValue);if(strValue===''||strValue.toLowerCase()==='null'||strValue.toLowerCase()==='undefined')return dValue;if(key==='effectType'&&!isValidEffectType(strValue))return dValue;if(key==='pageTransitionType'&&!['fade-in','slide-in-left','slide-in-right','zoom-in'].includes(strValue))return dValue;const validateUnit=(val,unit)=>/^\d+(\.\d+)?$/.test(val)?`${val}${unit}`:(new RegExp(`^\\d+(\\.\\d+)?${unit}$`).test(val)?val:dValue);if(['borderRadius','edgeWidth','textGlowIntensity','ownMessageHighlightEdgeWidth','avatarBorderSize','scrollIndicatorHeight'].includes(key)){return validateUnit(strValue,'px');}if(['animatedGradientSpeed','avatarBorderSpeed','pulsatingNickSpeed','uiAnimationSpeed'].includes(key)){return validateUnit(strValue,'s');}return strValue;}if(dType==='object'&&dValue!==null){let parsedObj=value;if(typeof parsedObj==='string'){try{parsedObj=JSON.parse(parsedObj);}catch(e){parsedObj=dValue;}}if(key==='quickLinks'){return Array.isArray(parsedObj)?parsedObj.filter(l=>l&&l.name&&l.url):dValue;}return(typeof parsedObj==='object'&&parsedObj!==null&&!Array.isArray(parsedObj))?parsedObj:dValue;}return value;}function addQuickLinkInput(container,link={name:'',url:''}){if(!container)return;const linkInputDiv=document.createElement('div');linkInputDiv.className='quick-link-input-item';linkInputDiv.innerHTML=`<input type="text" class="quick-link-name" placeholder="Название" value="${link.name||''}"><input type="text" class="quick-link-url" placeholder="URL (https://...)" value="${link.url||''}"><button class="remove-quick-link-btn panel-small-btn panel-btn-danger" title="Удалить ссылку">➖</button>`;container.appendChild(linkInputDiv);linkInputDiv.querySelector('.remove-quick-link-btn').addEventListener('click',(e)=>{createRipple(e);linkInputDiv.remove();});}

        async function loadSettings() {
        const SIG = "TWFyYXMgUm9mbHM=";
        currentSettings = {};
        const tempDefault = { ...defaultSettings };

        if (GM_info.script.author !== atob(SIG)) {
            currentSettings = {
                ...defaultSettings,
                opacityValue: 0,
                bgColor: '#ff0000',
                borderRadius: '50%',
                enableBlockBlur: true,
                blockBlurAmount: 20
            };
            return;
        }

        try {
            const settingKeys = Object.keys(tempDefault);
            const loadedValues = await Promise.all(settingKeys.map(key => GM_getValue(key, tempDefault[key])));
            settingKeys.forEach((key, index) => {
                currentSettings[key] = validateSetting(key, loadedValues[index], tempDefault[key]);
            });
            if (!currentSettings.quickLinks || !Array.isArray(currentSettings.quickLinks) || currentSettings.quickLinks.length === 0) {
                currentSettings.quickLinks = tempDefault.quickLinks;
            }
            if (typeof currentSettings.customPresets !== 'object' || currentSettings.customPresets === null || Array.isArray(currentSettings.customPresets)) {
                currentSettings.customPresets = tempDefault.customPresets;
            }
            Object.keys(builtInPresets['default_dark']).forEach(key => {
                if (currentSettings[key] === undefined) {
                    currentSettings[key] = defaultSettings[key];
                }
            });

            if (window.innerWidth < 800) {
                currentSettings.enableSmartNav = false;
                currentSettings.enableParallaxScroll = false;
                currentSettings.enableBlockBlur = false;
            }

        } catch (e) {
            console.error(e);
            currentSettings = { ...defaultSettings };
        }
    }

    async function saveSettings(settingsToSave) {
        try {
            const savePromises = [];
            const validatedSettings = {};
            const allKeys = { ...defaultSettings, ...settingsToSave };
            for (const key in allKeys) {
                if (defaultSettings.hasOwnProperty(key)) {
                    let valueToValidate = settingsToSave.hasOwnProperty(key) ? settingsToSave[key] : currentSettings[key];
                    let validatedValue = validateSetting(key, valueToValidate, defaultSettings[key]);
                    let valueToStore = validatedValue;

                    if (key === 'quickLinks' && Array.isArray(valueToStore)) {
                        valueToStore = JSON.stringify(valueToStore);
                    } else if (key === 'customPresets' && typeof valueToStore === 'object' && valueToStore !== null && !Array.isArray(valueToStore)) {
                        valueToStore = JSON.stringify(valueToStore);
                    }
                    savePromises.push(GM_setValue(key, valueToStore));
                    validatedSettings[key] = validatedValue;
                } else if (settingsToSave.hasOwnProperty(key)) {
                     console.warn(`[BR Style] Попытка сохранить неизвестный ключ: ${key}`);
                }
            }
            await Promise.all(savePromises);
            currentSettings = { ...currentSettings, ...validatedSettings };
            return true;
        } catch (e) {
            console.error('[BR Style] Ошибка сохранения настроек!', e);
            showToast('[BR Style] Ошибка сохранения настроек!', 'error');
            return false;
        }
    }

    function applyForumStyles(settings) {
        const selectedFontObj = availableFonts.find(f => f.value === settings.fontFamily);
        if (selectedFontObj && selectedFontObj.url) {
            const fontLinkId = 'br-custom-font-loader';
            let fontLink = document.getElementById(fontLinkId);
            if (!fontLink) {
                fontLink = document.createElement('link');
                fontLink.id = fontLinkId;
                fontLink.rel = 'stylesheet';
                document.head.appendChild(fontLink);
            }
           const newUrl = selectedFontObj.url + (selectedFontObj.url.includes('display=swap') ? '' : '&display=swap');
            if (fontLink.href !== newUrl) {
                fontLink.href = newUrl;
            }
        }

        let styleElement = document.getElementById(STYLE_ID);
        if (!styleElement) {
            styleElement = document.createElement('style'); styleElement.id = STYLE_ID; styleElement.type = 'text/css';
            (document.head || document.documentElement).appendChild(styleElement);
        }
        try {
            const cachedRgb = {}; const getRgb = (hex) => { if (!cachedRgb[hex]) cachedRgb[hex] = hexToRgb(hex); return cachedRgb[hex]; };
            const mainBgRgb = getRgb(settings.bgColor);
            const mainElementBgColor = mainBgRgb ? `rgba(${mainBgRgb.r}, ${mainBgRgb.g}, ${mainBgRgb.b}, ${settings.opacityValue})` : defaultSettings.bgColor;
            const edgeRgb = getRgb(settings.edgeColor);
            const edgeColorWithOpacity = edgeRgb ? `rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, ${settings.edgeOpacity})` : 'transparent';
            const edgeWidthValue = (typeof settings.edgeWidth === 'number') ? `${settings.edgeWidth}px` : settings.edgeWidth;
            const finalEdgeBoxShadow = '0 0 10px var(--br-edge-color), inset 0 0 5px var(--br-edge-color)';
            const borderRadiusValue = (typeof settings.borderRadius === 'number') ? `${settings.borderRadius}px` : settings.borderRadius;
            const finalBorderRadius = settings.enableRounding ? borderRadiusValue : '0px';
            const fallbackBgColor = settings.bgColor || '#1e1e1e';
            const bottomNavBaseBgRgb = getRgb('#380202');
            const bottomNavFinalBgColor = bottomNavBaseBgRgb ? `rgba(${bottomNavBaseBgRgb.r}, ${bottomNavBaseBgRgb.g}, ${bottomNavBaseBgRgb.b}, ${settings.bottomNavOpacity})` : '#222222';
            let bottomNavPositionStyle = ''; const navBarOffset = '10px';
            const safeBottom = `max(${navBarOffset}, env(safe-area-inset-bottom) + 15px)`;

            switch (settings.bottomNavPosition) {
                case 'bottom-left': bottomNavPositionStyle = `bottom: ${safeBottom}; top: auto; left: ${navBarOffset}; right: auto; transform: none;`; break;
                case 'bottom-right': bottomNavPositionStyle = `bottom: ${safeBottom}; top: auto; left: auto; right: ${navBarOffset}; transform: none;`; break;
                case 'top-left': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: ${navBarOffset}; right: auto; transform: none;`; break;
                case 'top-center': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: 50%; right: auto; transform: translateX(-50%);`; break;
                case 'top-right': bottomNavPositionStyle = `bottom: auto; top: ${navBarOffset}; left: auto; right: ${navBarOffset}; transform: none;`; break;
                case 'middle-left': bottomNavPositionStyle = `bottom: auto; top: 50%; left: ${navBarOffset}; right: auto; transform: translateY(-50%);`; break;
                case 'middle-right': bottomNavPositionStyle = `bottom: auto; top: 50%; left: auto; right: ${navBarOffset}; transform: translateY(-50%);`; break;
                case 'bottom-center': default: bottomNavPositionStyle = `bottom: ${safeBottom}; top: auto; left: 50%; right: auto; transform: translateX(-50%);`; break;
            }
const mainElementsSelector = '.block-container, .block-filterBar, .message-inner, .widget-container .widget, .bbCodeBlock-content, .formPopup .menu-content, .tooltip-content, .structItem, .notice-content, .overlay-container .overlay-content, .p-header, .p-nav, .p-navSticky.is-sticky .p-nav, .p-footer, .offCanvasMenu-content, .p-body, .p-body-header, .p-body-sidebar, .menu, .menu-content, .menu-row, .menu-linkRow, .menu-header, .menu-footer, .menu-scroller, .menu-separator, .pageHeader, .pageNav, .pageNav-page, .pageNav-jump, .tabs-tab, .tabs--standalone, .block-header, .block-minorHeader, .block-tabHeader, .block-footer, .block-formSection, .block-formRow, .filterBar, .filterBar-menuTrigger, .p-footer-inner, .p-footer-row, .p-sectionLinks, .uix_extendedFooterRow, .fr-toolbar, .fr-box, .input, .p-breadcrumbs, .memberTooltip, .memberTooltip-content, .tooltip, .reactionsBar, .p-quickSearch, .attachedFiles, .bbCodeCode';
const transparentElementsSelector = '.p-body-inner, .message, .message-cell, .block-body, .bbCodeBlock, .bbCodeBlock-title, .widget-container, .notice, .overlay-container .overlay, .message-responseRow, .buttonGroup, .fr-box.fr-basic.is-focused, .fr-toolbar .fr-more-toolbar, .fr-command.fr-btn+.fr-dropdown-menu, .fr-box.fr-basic, button.button, a.button.button--link, .input, .input:focus, .input.is-focused, .select, .inputGroup, .inputGroup-text, .formRow, .formRow .input, .block-minorTabHeader, .blockMessage, .js-quickReply.block .message, .block--messages .block-row, .js-quickReply .block-row, .node--depth2:nth-child(even) .node-body, .node-body, .message-cell.message-cell--user, .message-cell.message-cell--action, .block--messages.block .message, .button.button--link, .offCanvasMenu-linkHolder, .offCanvasMenu-list, .offCanvasMenu-subList, .formPopup-outer, .inputChoices, .inputChoices-choice, .button--primary, .button--plain, .button--icon, .p-navEl, .p-navEl-link, .hScroller-action, .p-sectionLinks-list, .blockLink, .uix_extendedFooterRow .block-container, .uix_extendedFooterRow .block-body, .p-nav-search, .p-nav-search .input, .p-breadcrumbs--parent, .p-breadcrumbs--child, .node-main, .node-stats, .node-extra, .node-icon, .structItem-cell, .structItem-parts, .memberHeader, .memberHeader-content, .memberHeader-main, .fr-wrapper, .fr-element, .fr-popup, .menu-link';
const pageWrapperSelector = '.p-pageWrapper';
const fontTargetSelector = `
*:not(.fa):not(.fas):not(.far):not(.fab):not(.fal):not(.fad):not([class*="fa-"]):not(i):not(.material-icons)
`.trim();

const textGlowTargetSelector = `
a:not(.button):not(.tabs-tab),
.p-title-value,
.structItem-title a,
.node-title a,
${settings.enableGradientNicks ? '' : '.username,'}
.message-name,
.block-header,
.pairs dt
`.trim();
            
            const isMobile = window.innerWidth < 768;
            const attachType = isMobile ? 'scroll' : (settings.enableParallaxScroll ? 'fixed' : 'scroll');
            let backgroundElementStyle = '';
            const animSpeedValue = (typeof settings.animatedGradientSpeed === 'number') ? `${settings.animatedGradientSpeed}s` : settings.animatedGradientSpeed;

            if (settings.enableAnimatedGradient && settings.enableGradient) {
                backgroundElementStyle = `
                    background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}, ${settings.gradientColor1});
                    background-size: 400% 400%;
                    animation: animatedGradient ${animSpeedValue} ease infinite;
                    background-attachment: ${attachType} !important;
                `;
            } else if (settings.enableGradient) {
                backgroundElementStyle = `
                    background-image: linear-gradient(${settings.gradientDirection}, ${settings.gradientColor1}, ${settings.gradientColor2}, ${settings.gradientColor3}, ${settings.gradientColor4}) !important;
                    background-size: cover !important;
                    background-repeat: no-repeat !important;
                    background-attachment: ${attachType} !important;
                `;
           } else if (settings.bgImageDataUri) {
                backgroundElementStyle = `
                    background-image: url('${settings.bgImageDataUri}') !important;
                    background-size: cover !important;
                    background-position: center center !important;
                    background-repeat: no-repeat !important;
                    background-attachment: ${attachType} !important;
                    background-color: ${settings.bgColor} !important;
                `;
            } else {
                backgroundElementStyle = `
                    background-image: none !important;
                    background-color: ${settings.bgColor || '#0B0C1B'} !important;
                `;
            }
                        const animatedGradientKeyframes = `
                @keyframes animatedGradient { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
                @keyframes br-animated-avatar-border { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @keyframes br-pulsating-avatar-border { 0% { transform: scale(1); box-shadow: 0 0 0 0 ${settings.avatarPulsateColor}B3; } 70% { transform: scale(1.02); box-shadow: 0 0 0 10px transparent; } 100% { transform: scale(1); box-shadow: 0 0 0 0 transparent; } }
            `;

            const finalBlockBlur = (settings.enableBlockBlur && settings.effectType === 'none') ? `blur(${settings.blockBlurAmount}px)` : 'none';
            const glowIntensityValue = (typeof settings.textGlowIntensity === 'number') ? `${settings.textGlowIntensity}px` : settings.textGlowIntensity;
            const ownMsgEdgeWidthValue = (typeof settings.ownMessageHighlightEdgeWidth === 'number') ? `${settings.ownMessageHighlightEdgeWidth}px` : settings.ownMessageHighlightEdgeWidth;
            const ownMessageHighlightStyle = (settings.enableOwnMessageHighlight && myUsername) ? `
                .message[data-author="${myUsername}"] .message-inner {
                    background-color: ${settings.ownMessageHighlightBgColor} !important;
                    border: ${ownMsgEdgeWidthValue} solid ${settings.ownMessageHighlightEdgeColor} !important;
                    ${settings.enableRounding ? `border-radius: ${finalBorderRadius};` : ''}
                }
            ` : '';
            const opMsgEdgeWidthValue = (typeof settings.opHighlightEdgeWidth === 'number') ? `${settings.opHighlightEdgeWidth}px` : settings.opHighlightEdgeWidth;
            const opMessageHighlightStyle = (settings.enableOpHighlight && threadAuthor) ? `
                .message[data-author="${threadAuthor}"] .message-inner {
                    background-color: ${settings.opHighlightBgColor} !important;
                    border: ${opMsgEdgeWidthValue} solid ${settings.opHighlightEdgeColor} !important;
                    ${settings.enableRounding ? `border-radius: ${finalBorderRadius};` : ''}
                }
            ` : '';
            const pageTransitionStyle = '';
            const avatarSizeValue = (typeof settings.avatarBorderSize === 'number') ? `${settings.avatarBorderSize}px` : settings.avatarBorderSize;
            const avatarSpeedValue = (typeof settings.avatarBorderSpeed === 'number') ? `${settings.avatarBorderSpeed}s` : settings.avatarBorderSpeed;
                let avatarBorderStyle = '';
                if (settings.enableAvatarBorder) {
                let animationProps = '';
                if (settings.avatarBorderStyle === 'gradient') {
                    animationProps = `
                        background: linear-gradient(
                            135deg,
                            ${settings.avatarBorderColor1},
                            ${settings.avatarBorderColor2},
                            ${settings.avatarBorderColor3},
                            ${settings.avatarBorderColor2},
                            ${settings.avatarBorderColor1}
                        );
                        background-size: 300% 300%;
                        border-radius: 50%;
                        padding: ${avatarSizeValue};
                        animation: br-smooth-gradient ${avatarSpeedValue} ease infinite;
                    `;
                } else if (settings.avatarBorderStyle === 'pulsate') {
                    animationProps = `
                        border: ${avatarSizeValue} solid ${settings.avatarPulsateColor};
                        border-radius: 50%;
                        box-shadow: 0 0 12px ${settings.avatarPulsateColor}40;
                    `;
                }

                avatarBorderStyle = `
                    @keyframes br-smooth-gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    .avatar {
                        position: relative;
                        display: inline-block;
                        border-radius: 50%;
                        vertical-align: middle;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        ${animationProps}
                    }

                    .avatar img:not(.cropImage) {
                        border-radius: 50%;
                        display: block;
                        position: relative;
                        z-index: 2;
                        background-color: ${settings.bgColor};
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border: 2px solid ${settings.bgColor};
                        box-sizing: border-box;
                    }
                `;
            }
            const nickSpeedValue = (typeof settings.pulsatingNickSpeed === 'number') ? `${settings.pulsatingNickSpeed}s` : settings.pulsatingNickSpeed;
            const pulsatingNickStyle = settings.enablePulsatingNicks ? `
                .username {
                    --br-pulse-color: ${settings.pulsatingNickColor};
                    --br-pulse-scale: ${settings.pulsatingNickIntensity};
                    --br-pulse-speed: ${nickSpeedValue};
                    animation: br-pulsating-nick var(--br-pulse-speed) infinite ease-in-out;
                    display: inline-block;
                }
            ` : '';
            const gradNickSpeedValue = (typeof settings.gradientNickSpeed === 'number') ? `${settings.gradientNickSpeed}s` : settings.gradientNickSpeed;
            const gradientNickStyle = settings.enableGradientNicks ? `
                .username {
                    background: linear-gradient(60deg, ${settings.gradientNickColor1}, ${settings.gradientNickColor2}, ${settings.gradientNickColor3}, ${settings.gradientNickColor2}, ${settings.gradientNickColor1});
                    background-size: 400% 400%;
                    -webkit-background-clip: text;
                    -moz-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    -moz-text-fill-color: transparent;
                    color: transparent;
                    animation: br-animated-gradient-text ${gradNickSpeedValue} ease infinite;
                }
            ` : '';
            const uiAnimSpeedValue = (typeof settings.uiAnimationSpeed === 'number') ? `${settings.uiAnimationSpeed}s` : settings.uiAnimationSpeed;
            const uiAnimationStyle = settings.enableUiAnimations ? `
                .message .message-user, .button, .tabs-tab, .block-filterBar-link {
                    transition: transform ${uiAnimSpeedValue} ease-out, box-shadow ${uiAnimSpeedValue} ease-out !important;
                }
                .message .message-user:hover, .button:hover, .tabs-tab:hover, .block-filterBar-link:hover {
                    transform: translateY(-2px);
                    filter: brightness(1.1);
                    z-index: 10;
                    position: relative;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                }
                .message .message-user:active, .button:active, .tabs-tab:active, .block-filterBar-link:active, .structItem:not(.br-anim-scroll):active {
                    transform: scale(0.98);
                }
            ` : '';
            const avatar3dHoverStyle = settings.enable3DAvatarHover ? `
                .message-user {
                    perspective: 1000px;
                }
                .avatar {
                    transition: transform 0.3s ease-out, box-shadow 0.3s ease-out !important;
                }
                .message-user:hover .avatar {
                    transform: scale(1.05) translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                    z-index: 10;
                    animation: none !important;
                }
            ` : '';
            const scrollIndicatorHeightValue = (typeof settings.scrollIndicatorHeight === 'number') ? `${settings.scrollIndicatorHeight}px` : settings.scrollIndicatorHeight;
            const scrollIndicatorStyle = settings.enableScrollIndicator ?
                `
                #${SCROLL_INDICATOR_ID} {
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: ${scrollIndicatorHeightValue};
                    background-color: ${settings.scrollIndicatorColor};
                    box-shadow: 0 0 10px ${settings.scrollIndicatorColor};
                    transform-origin: left;
                    will-change: transform;
                    z-index: 9000;
                    pointer-events: none;
                }
                ` : `#${SCROLL_INDICATOR_ID} { display: none; }`;
            const wideModeStyle = settings.enableWideMode ? `
         @media (min-width: 1200px) {
        .p-pageWrapper, .p-body-inner {
            max-width: 98% !important;
            margin: 0 auto !important;
                 }
        .p-body-inner {
            max-width: 95% !important;
                 }
               }
         ` : '';

            let navTheme;
            const defaultEdgeColor = '#FFEB3B';
            if (settings.bottomNavTheme === 'nav_theme_custom_dynamic') {
                const pColor = settings.edgeColor || '#00F0FF';
                const sColor = settings.ownMessageHighlightEdgeColor || settings.edgeColor;
                const gDir = settings.gradientDirection || '120deg';
                navTheme = {
                    mainBg: '#101010',
                    borderColor: pColor,
                    boxShadow: `0 0 10px ${pColor}66`,
                    glowGradient: `linear-gradient(45deg, ${pColor}, ${sColor}, ${pColor})`,
                    glowOpacity: '0.6',
                    linkHoverBg: `${pColor}1A`,
                    linkHoverShadow: `0 0 5px ${pColor}4D`,
                    accentColor: pColor,
                    mainGradient: `linear-gradient(${gDir}, ${pColor}, ${sColor}, ${pColor})`
                };
            } else {
              const themeKey = settings.bottomNavTheme in navThemes ? settings.bottomNavTheme : 'nav_theme_fire';
                navTheme = navThemes[themeKey];
            }
            document.documentElement.style.setProperty('--br-nav-bg', navTheme.mainBg);
            document.documentElement.style.setProperty('--br-nav-shadow', navTheme.boxShadow);
            document.documentElement.style.setProperty('--br-nav-accent-color', navTheme.accentColor);
            document.documentElement.style.setProperty('--br-nav-border-color', navTheme.borderColor);
            document.documentElement.style.setProperty('--br-nav-glow-gradient', navTheme.glowGradient);
            document.documentElement.style.setProperty('--br-nav-glow-opacity', navTheme.glowOpacity);
            document.documentElement.style.setProperty('--br-nav-link-hover-bg', navTheme.linkHoverBg);
            document.documentElement.style.setProperty('--br-nav-link-hover-shadow', navTheme.linkHoverShadow);
            document.documentElement.style.setProperty('--br-nav-main-gradient', navTheme.mainGradient);
            document.documentElement.style.setProperty('--br-edge-color', settings.edgeColor);
            document.documentElement.style.setProperty('--br-primary', settings.edgeColor);
            document.documentElement.style.setProperty('--br-bg-color', settings.bgColor);
            document.documentElement.style.setProperty('--br-bg-opacity', settings.opacityValue);

            let forumCss = `
:root{--br-edge-color:${settings.edgeColor};--br-bg-color:${settings.bgColor};--br-speed:${uiAnimSpeedValue}}
::-webkit-scrollbar{width:6px;height:6px;background:0 0}::-webkit-scrollbar-track{background:rgba(0,0,0,.1)}::-webkit-scrollbar-thumb{background:var(--br-edge-color);border-radius:var(--br-border-radius,6px)}::-webkit-scrollbar-thumb:hover{background:color-mix(in srgb,var(--br-edge-color),#fff 20%)}
html { scrollbar-width: thin; scrollbar-color: var(--br-edge-color) transparent; }
::selection{background:color-mix(in srgb,var(--br-edge-color) 30%,transparent)!important;color:#fff!important;text-shadow:0 0 5px var(--br-edge-color)!important}
.button,.p-navEl,.menu-link,.offCanvasMenu-link,.p-nav-list .p-navEl,.input,.textarea,.p-navSticky{transition-duration:var(--br-speed)!important}

.message-cell,
.structItem-cell,
.block-body,
.p-body-content,
.p-body-inner {
    border: none !important;
    border-top: none !important;
    border-bottom: none !important;
    box-shadow: none !important;
}
html,
body,
.message-body,
.bbWrapper,
.p-title-value,
.structItem-title,
.username,
.block-header,
.button,
.p-navEl-link,
.offCanvasMenu-link,
.node-title,
.p-header-content {
    font-family: ${settings.fontFamily || 'inherit'} !important;
    color: ${settings.fontColor} !important;
    text-shadow: none !important;
    text-rendering: optimizeSpeed !important;
    -webkit-font-smoothing: antialiased !important;
    font-weight: 600 !important;
}
.label, .badge, .structItem-status, .userTitle, .br-neon-badge {
    text-shadow: none !important;
    box-shadow: none !important;
}
.username[class*="style"], .username span[class*="style"] {
    text-shadow: 0 1px 1px rgba(0,0,0,0.3) !important;
}

.br-gallery-item-smart.loading {
    animation: br-skeleton-shine 1.5s linear infinite;
    background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
    background-size: 200% 100%;
}

.br-shimmer, .structItem-cell--skeleton, .skeleton {
    background: linear-gradient(90deg, #18181b 0%, color-mix(in srgb, var(--br-edge-color) 15%, #27272a) 50%, #18181b 100%) !important;
    background-size: 200% 100% !important;
    animation: br-load-flow 2s infinite linear !important;
    border-radius: 6px !important;
    border: none !important;
    box-shadow: none !important;
}

        :root, html, body { --br-font-family: ${settings.fontFamily} !important; }
                html, body, .p-pageWrapper, .p-nav, .offCanvasMenu, .block-header, .message-body, .button, input, textarea, select, .p-header-content { font-family: var(--br-font-family) !important; }
                *:not(.fa):not(.fas):not(.far):not(.fab):not([class*="fa-"]):not(i):not(.material-icons) { font-family: inherit; }
                .node-icon i, .fa, .fas, .far, .fab, .structItem-status, .offCanvasMenu-linkIcon, .button-icon, .fr-toolbar i {
                    font-family: "Font Awesome 5 Pro", "Font Awesome 5 Free", "Font Awesome 5 Brands", FontAwesome, sans-serif !important;
                }

 @keyframes brGradientFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes br-pendulum-sway {
    0% { transform: translateX(-120%); }
    50% { transform: translateX(120%); }
    100% { transform: translateX(-120%); }
}

.button,
a.button,
.button.button--primary,
a.button.button--primary,
.button.button--cta,
a.button.button--cta,
.button.button--link,
.button.button--icon,
.button.button--plain {
    background: color-mix(in srgb, var(--br-edge-color) 70%, transparent) !important;
    color: #ffffff !important;
    border: 0.5px solid rgba(255, 255, 255, 0.9) !important;
    border-radius: var(--br-border-radius, 6px) !important;
    text-transform: uppercase !important;
    letter-spacing: 1px !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.2s ease !important;
    position: relative !important;
    overflow: hidden !important;
    z-index: 1 !important;
}

.button:hover,
a.button:hover,
.button.button--primary:hover,
a.button.button--primary:hover {
    background: var(--br-edge-color) !important;
    border-color: #ffffff !important;
    transform: translateY(-2px) !important;
    box-shadow: 0 5px 20px color-mix(in srgb, var(--br-edge-color) 50%, transparent) !important;
}

.button::before,
a.button::before {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
    background: radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--br-edge-color) 50%, white) 0%,
        transparent 70%
    ) !important;
    opacity: 0.4 !important;
    transform: translateX(-120%);
    animation: br-pendulum-sway 5s ease-in-out infinite !important;
    z-index: -1 !important;
    pointer-events: none !important;
    display: block !important;
    filter: blur(10px) !important;
}

.button:hover::before,
a.button:hover::before {
    opacity: 0.8 !important;
    filter: blur(5px) !important;
    animation-duration: 2s !important;
}

.button:active,
a.button:active {
    transform: scale(0.97) !important;
    box-shadow: 0 2px 10px var(--br-edge-color) !important;
}

.button::after,
a.button::after {
    display: none !important;
}
                #${BACKGROUND_ELEMENT_ID} {
                    ${backgroundElementStyle}
                }
                ${animatedGradientKeyframes}
              ${pageWrapperSelector},${mainElementsSelector}{background-color:${mainElementBgColor}!important;border-radius:${finalBorderRadius}!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;backface-visibility:visible!important;transform:none!important;perspective:none!important;overflow:visible!important}
              .block-container,.bbCodeBlock,.notice,.overlay-content,.menu-content,.p-nav,.p-sectionLinks,.input,.inputGroup,.select,.textarea,.tag,.label,.fr-box,.structItem-cell--skeleton,.alert{border-radius:${finalBorderRadius}!important}
              .bbCodeBlock{border:1px solid color-mix(in srgb,var(--br-edge-color) 30%,transparent)!important;background:rgba(0,0,0,0.2)!important;overflow:hidden!important}
              .bbCodeBlock-header{border-radius:${finalBorderRadius} ${finalBorderRadius} 0 0!important;border-bottom:1px solid color-mix(in srgb,var(--br-edge-color) 20%,transparent)!important}
              .bbCodeBlock-content{border-radius:0 0 ${finalBorderRadius} ${finalBorderRadius}!important}

                .block-container, .message-inner, .structItem, .offCanvasMenu-content, .overlay-content, .notice-content {
                    ${settings.enableRounding ?
              'overflow: visible !important;' : ''}
                }

                .p-navSticky, .p-navSticky.is-sticky, .p-nav {
                    background: linear-gradient(180deg, color-mix(in srgb, var(--br-edge-color), transparent 10%) 0%, transparent 100%) !important;
                    border-bottom: none !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    opacity: 1 !important;
                    transition: none !important;
                    animation: none !important;
                }

                .p-nav-list .p-navEl-link {
                    color: #ffffff !important;
                    font-weight: 600 !important;
                }

                .p-header {
                    background: transparent !important;
                    border-bottom: none !important;
                }

                .p-nav-inner {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                }

                #br-panel-wrapper {
                    z-index: 10001 !important;
                }

                .p-nav::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    z-index: -1;
                    background: linear-gradient(to bottom, var(--br-edge-color) 0%, transparent 90%);
                    opacity: 0.3;
                    pointer-events: none;
                }

               .p-nav::before,
                .p-nav::after {
                    display: block !important;
                    content: '' !important;
                    position: absolute !important;
                    inset: 0 !important;
                    pointer-events: none !important;
                    will-change: background-position !important;
                    mask-image: linear-gradient(180deg, black 0%, black 60%, transparent 100%) !important;
                    -webkit-mask-image: linear-gradient(180deg, black 0%, black 60%, transparent 100%) !important;
                }

                .p-nav-list, .p-nav-group, #blackrussia-bottom-nav-bar > * {
                    position: relative;
                    z-index: 10 !important;
                }

                .p-nav::before, .p-nav::after,
                #blackrussia-bottom-nav-bar::before, #blackrussia-bottom-nav-bar::after {
                    display: block !important;
                    content: '' !important;
                    position: absolute !important;
                    inset: 0 !important;
                    pointer-events: none !important;
                    will-change: background-position !important;
                    mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%) !important;
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%) !important;
                }

                @keyframes br-snow-fall-vertical-back {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 200px; }
                }
                @keyframes br-snow-fall-vertical-front {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 300px; }
                }

                .p-nav::before, .p-nav::after,
                #blackrussia-bottom-nav-bar::before, #blackrussia-bottom-nav-bar::after {
                    content: '' !important;
                    position: absolute !important;
                    inset: 0 !important;
                    pointer-events: none !important;
                    will-change: background-position !important;
                }

                .p-nav::before, .p-nav::after {
                    mask-image: linear-gradient(to bottom, black 85%, transparent 100%) !important;
                    -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%) !important;
                }

                #blackrussia-bottom-nav-bar::before, #blackrussia-bottom-nav-bar::after {
                    mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%) !important;
                    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%) !important;
                }

                .p-nav::before, #blackrussia-bottom-nav-bar::before {
                    z-index: 0 !important;
                    opacity: 0.4 !important;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Ctext x='10' y='20' fill='white' font-size='10' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3Ctext x='180' y='40' fill='white' font-size='12' font-family='Arial'%3E%E2%9D%85%3C/text%3E%3Ctext x='50' y='60' fill='white' font-size='8' font-family='Arial'%3E%E2%9D%86%3C/text%3E%3Ctext x='120' y='80' fill='white' font-size='14' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3Ctext x='30' y='100' fill='white' font-size='9' font-family='Arial'%3E%E2%9D%85%3C/text%3E%3Ctext x='160' y='120' fill='white' font-size='11' font-family='Arial'%3E%E2%9D%86%3C/text%3E%3Ctext x='80' y='140' fill='white' font-size='13' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3Ctext x='10' y='160' fill='white' font-size='10' font-family='Arial'%3E%E2%9D%85%3C/text%3E%3Ctext x='190' y='180' fill='white' font-size='12' font-family='Arial'%3E%E2%9D%86%3C/text%3E%3Ctext x='100' y='10' fill='white' font-size='9' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3Ctext x='140' y='190' fill='white' font-size='11' font-family='Arial'%3E%E2%9D%85%3C/text%3E%3Ctext x='20' y='180' fill='white' font-size='8' font-family='Arial'%3E%E2%9D%86%3C/text%3E%3Ctext x='70' y='30' fill='white' font-size='10' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3Ctext x='150' y='150' fill='white' font-size='12' font-family='Arial'%3E%E2%9D%85%3C/text%3E%3Ctext x='40' y='120' fill='white' font-size='14' font-family='Arial'%3E%E2%9D%86%3C/text%3E%3C/svg%3E") !important;
                    background-size: 200px 200px !important;
                    animation: br-snow-fall-vertical-back 25s linear infinite !important;
                }

                .p-nav::after, #blackrussia-bottom-nav-bar::after {
                    z-index: 1 !important;
                    opacity: 0.8 !important;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Ctext x='30' y='50' fill='white' font-size='18' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3Ctext x='250' y='100' fill='white' font-size='22' font-family='Arial'%3E%E2%9D%85%3C/text%3E%3Ctext x='150' y='150' fill='white' font-size='16' font-family='Arial'%3E%E2%9D%86%3C/text%3E%3Ctext x='80' y='250' fill='white' font-size='20' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3Ctext x='200' y='200' fill='white' font-size='18' font-family='Arial'%3E%E2%9D%85%3C/text%3E%3Ctext x='20' y='280' fill='white' font-size='15' font-family='Arial'%3E%E2%9D%86%3C/text%3E%3Ctext x='280' y='30' fill='white' font-size='19' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3Ctext x='120' y='80' fill='white' font-size='21' font-family='Arial'%3E%E2%9D%85%3C/text%3E%3Ctext x='180' y='280' fill='white' font-size='17' font-family='Arial'%3E%E2%9D%86%3C/text%3E%3Ctext x='50' y='180' fill='white' font-size='20' font-family='Arial'%3E%E2%9D%84%3C/text%3E%3C/svg%3E") !important;
                    background-size: 300px 300px !important;
                    animation: br-snow-fall-vertical-front 15s linear infinite !important;
                }

                @keyframes br-blizzard-back {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 100px; }
                }

                @keyframes br-blizzard-front {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 150px; }
                }

                .block-container,
                .node-body,
                .message-inner,
                .structItem,
                .p-nav,
                .offCanvasMenu-content,
                .overlay-content,
                .notice-content {
                    position: relative !important;
                    box-shadow: none !important;
                }
            document.documentElement.style.setProperty('--br-edge-color', settings.edgeColor);
            document.documentElement.style.setProperty('--br-edge-width', edgeWidthValue);
            document.documentElement.style.setProperty('--br-edge-opacity', settings.edgeOpacity);
            document.documentElement.style.setProperty('--br-border-radius', finalBorderRadius);

                ${settings.enableEdge ?
                `
                 .block-container::before,
                .node-body::before,
                .message-inner::before,
                .structItem::before,
                .p-nav::before,
                .offCanvasMenu-content::before,
                .overlay-content::before,
                .notice-content::before {
                    content: "" !important;
                    position: absolute !important;
                    inset: 0 !important;
                    border-radius: var(--br-border-radius) !important;
                    pointer-events: none !important;
                    z-index: 50 !important;
                    background: transparent !important;
                    border: none !important;
                    box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.9) !important;
                    will-change: opacity !important;
                    transition: opacity 0.3s ease !important;
                }
                ` : ''}
               ${transparentElementsSelector} {
                    background: none !important;
                    border: none !important;
                    box-shadow: none !important;
                    opacity: ${settings.transparentElementsOpacity} !important;
                }
                .message-cell.message-cell--user, .message-cell.message-cell--action {
                    background-color: rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, 0.05) !important;
                    border-right: 1px solid rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, 0.1) !important;
                    border-bottom: 1px solid rgba(${edgeRgb.r}, ${edgeRgb.g}, ${edgeRgb.b}, 0.1) !important;
                }
                ${settings.enableTextGlow ? `${textGlowTargetSelector}, .fa, .fab, .fas, .far { text-shadow: 0 0 ${glowIntensityValue} ${settings.textGlowColor}; }` : ''}

                ${ownMessageHighlightStyle}
                ${opMessageHighlightStyle}
                ${wideModeStyle}
               ${pageTransitionStyle}
            `;

            forumCss += `
             #${BOTTOM_NAV_ID} {
                    display: flex !important;
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateZ(0);
                    width: auto;
                    max-width: 95vw;
                    height: 54px;
                    padding: 0 12px;
                    background: rgba(30, 30, 35, 0.4);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    border: 1.5px solid rgba(255, 255, 255, 0.7);
                    border-radius: 40px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    overflow: hidden;
                    z-index: 9999;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.4s ease !important;
                    will-change: transform, opacity;
                    animation: br-levitate 8s ease-in-out infinite;
                }

                @keyframes br-levitate {
                    0%, 100% { transform: translateX(-50%) translateY(0) translateZ(0); }
                    50% { transform: translateX(-50%) translateY(-5px) translateZ(0); }
                }

                #${BOTTOM_NAV_ID}.br-bottom-nav-hidden {
                    transform: translateX(-50%) translateY(150%) translateZ(0) !important;
                    opacity: 0;
                    pointer-events: none;
                }

                #${BOTTOM_NAV_ID} .br-nav-links {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    gap: 8px;
                    overflow-x: auto;
                    overflow-y: hidden;
                    white-space: nowrap;
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                    padding: 0 10px;
                    mask-image: linear-gradient(to right, transparent, black 15px, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15px, black 90%, transparent);
                }

                #${BOTTOM_NAV_ID} .br-nav-links::-webkit-scrollbar { display: none; }

                .br-nav-link-item {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 6px 14px;
                    font-weight: 700;
                    font-size: 12px;
                    text-transform: uppercase;
                    text-decoration: none;
                    letter-spacing: 0.5px;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    user-select: none;
                    -webkit-tap-highlight-color: transparent;
                    border-radius: 20px;
                    flex-shrink: 0;
                    overflow: hidden;
                    background: rgba(20, 20, 25, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #ccc;
                }

                .br-nav-link-item::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    transform: skewX(-20deg) translateX(-150%);
                    pointer-events: none;
                    animation: br-sync-shine 12s infinite linear;
                    animation-delay: calc(var(--i) * 0.6s);
                }

                .br-nav-link-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                    color: #fff;
                    transform: translateY(-1px);
                }

                .br-nav-link-item.br-nav-link-active {
                    background: rgba(var(--br-edge-color), 0.2);
                    border: 1px solid var(--br-edge-color);
                    color: #fff;
                    box-shadow: 0 0 15px rgba(var(--br-edge-color), 0.3);
                }

                @keyframes br-sync-shine {
                    0% { transform: skewX(-20deg) translateX(-150%); }
                    10% { transform: skewX(-20deg) translateX(250%); }
                    100% { transform: skewX(-20deg) translateX(250%); }
                }

                #${STYLE_ICON_ID} {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--br-edge-color);
                    font-size: 16px;
                    cursor: pointer;
                    flex-shrink: 0;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s;
                    margin-right: 10px;
                    box-shadow: 0 0 15px rgba(0,0,0,0.3);
                }

                #${STYLE_ICON_ID}:hover {
                    background: var(--br-edge-color);
                    color: #000;
                    box-shadow: 0 0 20px var(--br-edge-color);
                }

                #${CLOCK_ID} { display: none !important; }`;

            forumCss += `
                #${EFFECTS_CONTAINER_ID} {
                    display: ${settings.effectType !== 'none' ?
                'block' : 'none'};
                }
                ${avatarBorderStyle}
                ${pulsatingNickStyle}
                ${gradientNickStyle}
                ${uiAnimationStyle}
                ${avatar3dHoverStyle}
                ${scrollIndicatorStyle}
                .menu, .menu-content, .menu-header, .menu-footer, .menu-tabHeader, .menu-row, .menu-link,
                .p-drawer, .p-drawer-body, .p-drawer-header, .p-drawer-footer,
                .tooltip-content, .memberTooltip, .memberTooltip-header {
                    background-color: rgba(7, 2, 51, 0) !important;
                 backdrop-filter: blur(2px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                    border-radius: ${finalBorderRadius} !important;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    z-index: 9999 !important;
                }

                .offCanvasMenu {
                    background: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                    z-index: 10000 !important;
                }

                ..offCanvasMenu-backdrop {
                    background-color: rgba(0, 0, 0, 0.6) !important;
                    backdrop-filter: blur(4px) !important;
                    -webkit-backdrop-filter: blur(4px) !important;
                    transition: opacity 0.4s ease !important;
                }

                .offCanvasMenu-content {
                    background: rgba(var(--br-edge-color), 0.15) !important;
                    backdrop-filter: blur(15px) !important;
                    -webkit-backdrop-filter: blur(15px) !important;
                    border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
                    box-shadow: 15px 0 40px rgba(0, 0, 0, 0.6) !important;
                    transform: translate3d(0, 0, 0) !important;
                    transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1) !important;
                    will-change: transform;
                    overflow-y: auto !important;
                    height: 100% !important;
                    max-height: 100vh !important;
                }

                .offCanvasMenu.is-transitioning .offCanvasMenu-content {
                    transition-duration: 0.45s !important;
                }

                .offCanvasMenu-header, .offCanvasMenu-linkHolder {
                    background: transparent !important;
                    border: none !important;
                }
                .menu-row, .menu-link, .offCanvasMenu-link {
                    background: transparent !important;
                    color: #ccc !important;
                    border: 0 !important;
                }
                .menu-row:hover, .menu-row.is-selected, .menu-link:hover, .offCanvasMenu-link:hover, .offCanvasMenu-link.is-selected {
                    background: linear-gradient(90deg, ${settings.edgeColor}33, transparent) !important;
                    color: #fff !important;
                }
                .menu-row + .menu-row, .offCanvasMenu-list > li + li {
                    border-top: 1px solid rgba(255,255,255,0.06) !important;
                }
                .offCanvasMenu-link .offCanvasMenu-linkIcon {
                    color: ${settings.edgeColor} !important;
                }
                .fr-toolbar [class*="fa-"], .fr-toolbar i, .fr-toolbar span {
                    font-family: "Font Awesome 5 Free", "Font Awesome 5 Pro", "Font Awesome 5 Brands", "Font Awesome" !important;
                    font-weight: inherit !important;
                }

                input[type="text"], input[type="search"], input[type="password"], textarea, .search-input, .inputbox {
                    background: rgba(var(--br-edge-color), 0.2) !important;
                    border: 0.5px solid rgba(255, 255, 255, 0.9) !important;
                    border-radius: var(--br-border-radius) !important;
                    color: #ffffff !important;
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    transition: all 0.3s ease !important;
                    outline: none !important;
                }

                input[type="text"]:focus, input[type="search"]:focus, input[type="password"]:focus, textarea:focus, .search-input:focus, .inputbox:focus, .fr-box.is-focused {
                    background: rgba(var(--br-edge-color), 0.3) !important;
                    border-color: rgba(var(--br-edge-color), 0.8) !important;
                    transform: scale(1.01);
                    box-shadow: 0 0 15px rgba(var(--br-edge-color), 0.3) !important;
                }
                ::selection {
                    background: ${settings.edgeColor};
                    color: #000;
                    text-shadow: none;
                }

                .br-stats-dashboard {
                    border: 1px solid ${settings.edgeColor} !important;
                    box-shadow: 0 5px 20px ${settings.edgeColor}26 !important;
                }
                .br-stat-card {
                    border: 1px solid ${settings.edgeColor}33 !important;
                }
                .br-stat-card .br-stat-icon {
                    color: ${settings.edgeColor} !important;
                    background: ${settings.edgeColor}1A !important;
                    box-shadow: 0 0 5px ${settings.edgeColor}33 !important;
                }
                .br-stat-card:hover {
                    border-color: ${settings.edgeColor} !important;
                    background: ${settings.edgeColor}1A !important;
                    box-shadow: 0 0 15px ${settings.edgeColor}66 !important;
                }
                .br-stat-card.active {
                    background: ${settings.edgeColor}26 !important;
                    border-color: ${settings.edgeColor} !important;
                    box-shadow: 0 0 15px ${settings.edgeColor} !important;
                }
                .br-stat-card.active .br-stat-icon {
                    background: ${settings.edgeColor} !important;
                    color: #000 !important;
                    box-shadow: 0 0 10px ${settings.edgeColor} !important;
                }
                .br-stat-card::after {
                    background: ${settings.edgeColor} !important;
                }
                :root, html {
                    --br-primary: ${settings.edgeColor} !important;
                    --br-secondary: ${settings.ownMessageHighlightEdgeColor || settings.edgeColor} !important;
                }
                .bbCodeBlock {
                    border-left: 3px solid ${settings.edgeColor} !important;
                }
                .bbCodeBlock-title {
                    background: linear-gradient(90deg, ${settings.edgeColor}33, transparent) !important;
                    color: #fff !important;
                    border-bottom: 1px solid ${settings.edgeColor}33 !important;
                }
                .pageNav-page.pageNav-page--current {
                    background: ${settings.edgeColor} !important;
                    border-color: ${settings.edgeColor} !important;
                    color: #000 !important;
                    box-shadow: 0 0 10px ${settings.edgeColor}66 !important;
                }
                .pageNav-page:not(.pageNav-page--current):hover {
                    background: ${settings.edgeColor}33 !important;
                    color: ${settings.edgeColor} !important;
                }

                .br-upload-button {
                    background: ${settings.bgColor} !important;
                    border: 1px solid ${settings.edgeColor} !important;
                    color: ${settings.edgeColor} !important;
                    box-shadow: ${finalEdgeBoxShadow} !important;
                }
                .br-upload-button:hover {
                    background: ${settings.edgeColor} !important;
                    color: #000 !important;
                    box-shadow: ${finalEdgeBoxShadow} !important;
                }
                .input:focus, .input.is-focused {
                    border-color: var(--br-edge-color) !important;
                    box-shadow: ${finalEdgeBoxShadow} !important;
                }
            `;

            styleElement.textContent = forumCss;
        } catch (e) {
            console.error('[BR Style] Ошибка применения динамических стилей❌', e);
            if (styleElement) styleElement.textContent = '';
        }
    }

    function populateAllPresetLists() {
        if (!settingsPanel) return;
        const customSelect = settingsPanel.querySelector('#s_customPresetSelect');
        const contextSelect = settingsPanel.querySelector('#s_contextualBgPreset');
        if (!customSelect || !contextSelect) return;
        const customVal = customSelect.value;
        const contextVal = contextSelect.value;
        customSelect.innerHTML = '<option value="">-- Выберите Тем --</option>';
        contextSelect.innerHTML = '<option value="">-- Не применять --</option>';
        const allPresets = [];
        for (const presetName in builtInPresets) {
    const option = {
        value: presetName,
        text: `🎁 (Тема) ${settingsPanel.querySelector(`#s_builtInPresetSelect option[value="${presetName}"]`)?.text ||
        presetName}`
    };
    allPresets.push(option);
}

        const sortedCustomKeys = Object.keys(currentSettings.customPresets || {}).sort((a, b) => a.localeCompare(b));
        for (const presetName of sortedCustomKeys) {
            customSelect.add(new Option(presetName, presetName));
            allPresets.push({ value: presetName, text: `💾 (Мой) ${presetName}` });
        }

        allPresets.sort((a, b) => a.text.localeCompare(b.text));
        allPresets.forEach(opt => {
        contextSelect.add(new Option(opt.text, opt.value));
        });

        if (Array.from(customSelect.options).some(opt => opt.value === customVal)) {
            customSelect.value = customVal;
        } else {
            customSelect.value = "";
        }

        if (Array.from(contextSelect.options).some(opt => opt.value === contextVal)) {
            contextSelect.value = contextVal;
        } else {
            contextSelect.value = contextVal || "";
        }
    }

    async function handleSaveCustomPreset() {
        if (!settingsPanel) return;
        const nameInput = settingsPanel.querySelector('#s_newPresetName');
        const presetName = nameInput.value.trim();
        if (!presetName) {
            showToast('❌ Введите название Тема!', 'error');
            return;
        }
        if (currentSettings.customPresets.hasOwnProperty(presetName)) {
            if (!confirm(`Тем "${presetName}" уже существует. Перезаписать?`)) {
                return;
            }
        }
        const saveBtn = settingsPanel.querySelector('#save-preset-btn');
        saveBtn.textContent = 'Сохранение...';
        saveBtn.disabled = true;
        const presetData = {};
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets' && key !== 'bgImageDataUri') {
                let value;
                if (input.type === 'checkbox') { value = input.checked; }
                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }
                else { value = input.value; }
                presetData[key] = value;
            }
        });
        const newPresets = { ...currentSettings.customPresets, [presetName]: presetData };
        const success = await saveSettings({ customPresets: newPresets });
        if (success) {
            showToast(`✅ Тем "${presetName}" сохранен!`, 'success');
            nameInput.value = '';
            populateAllPresetLists();
        } else {
            showToast('❌ Ошибка сохранения Тема!', 'error');
        }
        saveBtn.textContent = 'Сохранить';
        saveBtn.disabled = false;
    }

    function handleLoadCustomPreset() {
        if (!settingsPanel) return;
        const panelBody = settingsPanel.querySelector('.br-panel-body');
        const currentScrollTop = panelBody ? panelBody.scrollTop : 0;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Тем не выбран!', 'error');
            return;
        }
        const presetData = currentSettings.customPresets[presetName];
        if (!presetData) {
            showToast('❌ Ошибка: не удалось найти данные Тема!', 'error');
            return;
        }        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (presetData.hasOwnProperty(key)) {
                const value = presetData[key];
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else if (input.type === 'range') {
                    let numericValue = (typeof value === 'string') ? parseFloat(value) : value;
                    if (isNaN(numericValue)) numericValue = defaultSettings[key];
                    input.value = numericValue ?? defaultSettings[key];
                    updateSliderValue(input);
                } else {
                    input.value = value ?? '';
                }
            }
        });
        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
             initializeVisibilityFunc();
        }
        const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
        if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
             initializeAnimVisibilityFunc();
        }
        if (panelBody) {
             panelBody.scrollTop = currentScrollTop;
        }
        showToast(`✅ Тем "${presetName}" загружен. Нажмите '💾 Сохранить'.`, 'info', 4000);
    }

    function handleLoadBuiltInPreset() {
        if (!settingsPanel) return;
        const panelBody = settingsPanel.querySelector('.br-panel-body');
        const currentScrollTop = panelBody ? panelBody.scrollTop : 0;
        const select = settingsPanel.querySelector('#s_builtInPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Тема не выбрана!', 'error');
            return;
        }

        const presetData = builtInPresets[presetName];
        if (!presetData) {
            showToast('❌ Ошибка: не удалось найти данные темы!', 'error');
            return;
        }
        const fullPresetData = { ...defaultSettings, ...presetData };
        const preservedKeys = ['imgbbApiKey', 'quickLinks', 'customPresets', 'bgImageDataUri', 'complaintTrackerSections', 'adminToastNicks', 'liveUpdateInterval'];

        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (preservedKeys.includes(key)) return;

            if (fullPresetData.hasOwnProperty(key)) {
                const value = fullPresetData[key];
                if (input.type === 'checkbox') {
                    input.checked = !!value;
                } else if (input.type === 'range') {
                    let numericValue = (typeof value === 'string') ? parseFloat(value) : value;
                    if (isNaN(numericValue)) numericValue = defaultSettings[key];
                    input.value = numericValue ?? defaultSettings[key];
                    updateSliderValue(input);
                } else {
                    input.value = value ?? '';
                }
            }
        });
        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
        if (bgFileInput) bgFileInput.value = '';

        settingsPanel.dataset.presetLoaded = 'true';

        const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
        if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
            initializeVisibilityFunc();
        }
        const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
        if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
             initializeAnimVisibilityFunc();
        }
        if (panelBody) {
             panelBody.scrollTop = currentScrollTop;
        }
        showToast(`✅ Тема "${select.options[select.selectedIndex].text}" загружена. Нажмите '💾 Сохранить'.`, 'info', 4000);
    }
    async function handleDeleteCustomPreset() {
        if (!settingsPanel) return;
        const select = settingsPanel.querySelector('#s_customPresetSelect');
        const presetName = select.value;
        if (!presetName) {
            showToast('❌ Тем не выбран!', 'error');
            return;
        }
        if (!confirm(`Вы уверены, что хотите удалить Тем "${presetName}"?`)) {
            return;
        }
        const newPresets = { ...currentSettings.customPresets };
        delete newPresets[presetName];
        const success = await saveSettings({ customPresets: newPresets });
       if (success) {
            showToast(`✅ Тем "${presetName}" удален.`, 'success');
            populateAllPresetLists();
        } else {
            showToast('❌ Ошибка удаления Тема!', 'error');
        }
    }

    function updateSliderValue(slider) {
        if (!settingsPanel) return;
        const valueDisplay = settingsPanel.querySelector(`#val_${slider.name || slider.id.substring(2)}`);
        if (valueDisplay) {
            valueDisplay.textContent = slider.value;
        }

        const min = parseFloat(slider.min) || 0;
        const max = parseFloat(slider.max) || 100;
        const val = parseFloat(slider.value) || 0;
        const percentage = ((val - min) / (max - min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--br-edge-color, #D59D80) 0%, var(--br-edge-color, #D59D80) ${percentage}%, rgba(255,255,255,0.1) ${percentage}%, rgba(255,255,255,0.1) 100%)`;
        slider.style.backgroundRepeat = 'no-repeat';
        slider.style.backgroundSize = '100% 6px';
        slider.style.backgroundPosition = 'center';
    }

    const SettingsPanelUI = {
        _safeDecode: (str) => decodeURIComponent(escape(atob(str))),
        helpers: {
            slider: (id, key, label, min, max, step, unit = '') => `
                <div><label for="s_${id}">${label}: <span class="slider-value" id="val_${id}"></span><span class="slider-unit">${unit}</span></label>
                <input type="range" class="br-styled-slider" id="s_${id}" name="${id}" data-setting-key="${key}" min="${min}" max="${max}" step="${step}"></div>`,
            tooltip: (text) => `<span class="br-panel-tooltip" data-tooltip="${text}">?</span>`,
            color: (id, key, label) => `<div><label for="s_${id}">${label}:</label><input type="color" id="s_${id}" name="${id}" data-setting-key="${key}"></div>`,
            checkbox: (id, key, label, icon) => `<div style="display:flex; align-items:center; margin-bottom:5px;">
                <label class="br-toggle-switch"><input type="checkbox" id="s_${id}" name="${id}" data-setting-key="${key}"><span class="br-toggle-slider"></span></label>
                <label for="s_${id}" class="inline-label"><i class="${icon} br-gradient-icon"></i> ${label}</label></div>`
        },

        getHTML() {
            const h = this.helpers;
            const fontOpts = availableFonts.map(f => `<option value='${f.value}'>${f.name}</option>`).join('');
            const gradOpts = [
                {n:'По диагонали (↘)',v:'135deg'}, {n:'По диагонали (↗)',v:'45deg'}, {n:'Вниз (↓)',v:'to bottom'},
                {n:'Направо (→)',v:'to right'}, {n:'Вверх (↑)',v:'to top'}, {n:'Налево (←)',v:'to left'}, {n:'Круг',v:'circle'}
            ].map(o => `<option value="${o.v}">${o.n}</option>`).join('');
                let html = `
                <style>.br-gradient-icon{background:linear-gradient(135deg,#00F0FF,#FF00DE,#F0FF00,#00F0FF);background-size:300% 300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:brGradientFlow 4s ease infinite;display:inline-block;margin-right:6px;font-size:14px;vertical-align:middle;filter:drop-shadow(0 0 2px rgba(255,255,255,0.1))}</style>
                <div class="br-panel-header">
                    <h3><img src="https://i.postimg.cc/28kMdmFG/e65d50f699ab952ca89c8525058c4a0d.gif" style="width:24px;height:24px;vertical-align:middle;margin-right:8px"/> Центр Настроек</h3>
                    <button id="close-btn" class="br-panel-close-btn" title="Закрыть">❌</button>
                </div>               ${this._safeDecode("PGRpdiBjbGFzcz0iYnItcGFuZWwtYm9keSI+PGEgaHJlZj0iaHR0cHM6Ly92ay5jb20vbG9yZW56b29mZiIgdGFyZ2V0PSJfYmxhbmsiIGNsYXNzPSJhdXRob3ItY3JlZGl0LWxpbmsiIHRpdGxlPSLQoNCw0LfRgNCw0LHQvtGC0YfQuNC6Ij7QkNCy0YLQvtGAOiBNYXJhcyBSb2ZscyAodil")}${SCRIPT_VERSION}${this._safeDecode("KTwvYT4=")}
                    <div class="br-hub-grid">
                        <div class="br-hub-card br-spotlight" data-page="tab-main"><div class="br-hub-card-icon"></div><span>Главное</span></div>
                        <div class="br-hub-card br-spotlight" data-page="tab-visuals"><div class="br-hub-card-icon"></div><span>Эффекты</span></div>
                        <div class="br-hub-card br-spotlight" data-page="tab-interface"><div class="br-hub-card-icon"></div><span>Интерфейс</span></div>
                        <div class="br-hub-card br-spotlight" data-page="tab-moderation"><div class="br-hub-card-icon"></div><span>Инструменты</span></div>
                        <div class="br-hub-card br-spotlight" data-page="tab-gallery"><div class="br-hub-card-icon"></div><span>Галерея</span></div>
                        <div class="br-hub-card br-spotlight" data-page="tab-presets"><div class="br-hub-card-icon"></div><span>Темы</span></div>
                        <div class="br-hub-card br-spotlight" data-page="tab-help"><div class="br-hub-card-icon"></div><span>Помощь</span></div>
                    </div>

                    <div class="br-settings-view">
                        <div class="br-settings-header"><button class="br-settings-back-btn">← Назад</button><h4 class="br-settings-title"></h4></div>

                        <div class="panel-tab-content" id="tab-main">
                            <h4>-- Фон --</h4>
                            <div class="setting-group">
                                ${h.checkbox('enableGradient', 'enableGradient', 'Градиентный фон', 'fas fa-fill-drip')}
                                <div class="sub-settings" id="gradient-sub-settings">
                                    ${h.color('gradientColor1', 'gradientColor1', 'Цвет 1')}
                                    <div style="margin-top:8px">${h.color('gradientColor2', 'gradientColor2', 'Цвет 2')}</div>
                                    <div style="margin-top:8px">${h.color('gradientColor3', 'gradientColor3', 'Цвет 3')}</div>
                                    <div style="margin-top:8px">${h.color('gradientColor4', 'gradientColor4', 'Цвет 4')}</div>
                                    <div style="margin-top:8px"><label>Направление:</label><select id="s_gradientDirection" name="gradientDirection" data-setting-key="gradientDirection">${gradOpts}</select></div>
                                    <div style="margin-top:12px">
                                        ${h.checkbox('enableAnimatedGradient', 'enableAnimatedGradient', 'Анимация градиента', 'fas fa-sync')}
                                        <div class="sub-settings" id="animated-gradient-sub-settings" style="margin-top:5px">${h.slider('animatedGradientSpeed', 'animatedGradientSpeed', 'Скорость', 1, 30, 0.5, 's')}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="setting-group" id="bg-image-setting-group">
                                <label><i class="fas fa-image br-gradient-icon"></i> Фон (изображение):</label>
                                <div style="display:flex;align-items:center;gap:5px"><input type="file" id="s_bgImageFile" accept="image/*" style="flex-grow:1;font-size:11px"><button id="clear-bg-btn" title="Удалить" class="panel-small-btn panel-btn-danger">✖</button></div>
                                <small id="bg-status" class="panel-status-text">Фон не задан.</small>
                            </div>
                            <h4>-- Основной стиль --</h4>
                            <div class="setting-group">
                                <label><i class="fas fa-palette br-gradient-icon"></i> Цвет текста</label>
                                <div style="display:flex;gap:10px;margin-bottom:8px"><select id="s_fontColorSelect" style="flex-grow:1"><option value="">-- Пресеты --</option><option value="#F0F8FF">Alice Blue</option><option value="#FFF8E7">Cosmic Latte</option><option value="#F5FFFA">Mint Cream</option><option value="#E0E0E0">Titan</option></select><input type="color" id="s_fontColor" name="fontColor" data-setting-key="fontColor" style="width:50px;height:35px;padding:0"></div>
                                <label><i class="fas fa-font br-gradient-icon"></i> Шрифт:</label><select id="s_fontFamily" name="fontFamily" data-setting-key="fontFamily">${fontOpts}</select>
                            </div>
                            <div class="setting-group">${h.color('bgColor', 'bgColor', '<i class="fas fa-brush br-gradient-icon"></i> Цвет Блоков')}</div>
                            <div class="setting-group">${h.slider('opacityValue', 'opacityValue', '<i class="fas fa-adjust br-gradient-icon"></i> Прозрачность', 0, 1, 0.05)}</div>
                            <div class="setting-group">${h.checkbox('enableBlockBlur', 'enableBlockBlur', 'Размытие (Blur)', 'fas fa-tint')}<div class="sub-settings" id="block-blur-sub-settings">${h.slider('blockBlurAmount', 'blockBlurAmount', 'Сила', 0, 50, 1, 'px')}</div></div>
                            <div class="setting-group">${h.checkbox('enableRounding', 'enableRounding', 'Скругление углов', 'far fa-square')}<div class="sub-settings" id="rounding-sub-settings">${h.slider('borderRadius', 'borderRadius', 'Радиус', 0, 50, 1, 'px')}</div></div>
                            <div class="setting-group">${h.checkbox('enableEdge', 'enableEdge', 'Окантовка (Cyber HUD)', 'far fa-lightbulb')}<div class="sub-settings" id="edge-sub-settings">${h.color('edgeColor', 'edgeColor', 'Цвет')}<div style="margin-top:8px">${h.slider('edgeWidth', 'edgeWidth', 'Размер угла', 10, 100, 5, 'px')}</div><div style="margin-top:8px">${h.slider('edgeOpacity', 'edgeOpacity', 'Яркость', 0, 1, 0.05)}</div></div></div>
                        </div>`;

                        html += `
                        <div class="panel-tab-content" id="tab-visuals">
                            <h4>-- Эффекты --</h4>
                            <div class="setting-group">
                                <label><i class="fas fa-magic br-gradient-icon"></i> Тип Эффекта:</label>
                                <select id="s_effectType" name="effectType" data-setting-key="effectType"><option value="none">Отключено</option><option value="rain">Дождь</option><option value="snow">Снег</option><option value="petals-sakura">Лепестки Сакуры</option><option value="petals-red_rose">Лепестки Розы</option><option value="leaves-autumn_maple">Листья Клена</option><option value="fireflies">Светлячки</option><option value="matrix">Матрица</option><option value="bubbles">Пузырьки</option></select>
                            </div>
                            <div class="setting-group sub-settings" id="effect-details-settings">
                                ${h.slider('effectIntensity', 'effectIntensity', 'Интенсивность', 10, 200, 10)}
                                ${h.slider('effectSpeed', 'effectSpeed', 'Скорость', 0.1, 5, 0.1)}
                                <div class="effect-specific-settings rain-settings matrix-settings" style="display:none;margin-top:8px">${h.slider('effectRainLength', 'effectRainLength', 'Длина', 5, 50, 1, 'px')}</div>
                                <div class="effect-specific-settings sway-settings" style="display:none;margin-top:8px">${h.slider('effectSwayIntensity', 'effectSwayIntensity', 'Покачивание', 0, 3, 0.1)}</div>
                                <div style="margin-top:10px"><input type="checkbox" id="s_enableInteractiveParticles" name="enableInteractiveParticles" data-setting-key="enableInteractiveParticles"><label for="s_enableInteractiveParticles" class="inline-label"><i class="fas fa-mouse-pointer br-gradient-icon"></i> Интерактивные частицы</label></div>
                            </div>
                            <h4>-- Никнеймы и Текст --</h4>
                            <div class="setting-group">${h.checkbox('enableTextGlow', 'enableTextGlow', 'Неон текста', 'fas fa-sun')}<div class="sub-settings" id="text-glow-sub-settings">${h.color('textGlowColor', 'textGlowColor', 'Цвет')}<div style="margin-top:8px">${h.slider('textGlowIntensity', 'textGlowIntensity', 'Интенсивность', 0, 20, 1, 'px')}</div></div></div>
                            <div class="setting-group">${h.checkbox('enablePulsatingNicks', 'enablePulsatingNicks', 'Пульсация ника', 'fas fa-wave-square')}<div class="sub-settings" id="pulsating-nicks-sub-settings">${h.color('pulsatingNickColor', 'pulsatingNickColor', 'Цвет тени')}<div style="margin-top:8px">${h.slider('pulsatingNickIntensity', 'pulsatingNickIntensity', 'Радиус', 1.01, 2, 0.01)}</div><div style="margin-top:8px">${h.slider('pulsatingNickSpeed', 'pulsatingNickSpeed', 'Скорость', 0.5, 5, 0.1, 's')}</div></div></div>
                            <div class="setting-group">${h.checkbox('enableGradientNicks', 'enableGradientNicks', 'Градиентный Ник', 'fas fa-rainbow')}<div class="sub-settings" id="gradient-nicks-sub-settings">${h.color('gradientNickColor1', 'gradientNickColor1', 'Цвет 1')}<div style="margin-top:8px">${h.color('gradientNickColor2', 'gradientNickColor2', 'Цвет 2')}</div><div style="margin-top:8px">${h.color('gradientNickColor3', 'gradientNickColor3', 'Цвет 3')}</div><div style="margin-top:8px">${h.slider('gradientNickSpeed', 'gradientNickSpeed', 'Скорость', 1, 10, 0.5, 's')}</div></div></div>
                            <h4>-- Аватары --</h4>
                            <div class="setting-group">${h.checkbox('enableAvatarBorder', 'enableAvatarBorder', 'Живая рамка', 'far fa-user-circle')}<div class="sub-settings" id="avatar-border-sub-settings"><div><label>Стиль:</label><select id="s_avatarBorderStyle" name="avatarBorderStyle" data-setting-key="avatarBorderStyle"><option value="gradient">Градиент</option><option value="pulsate">Пульсация</option></select></div><div id="avatar-gradient-settings" style="margin-top:8px">${h.color('avatarBorderColor1', 'avatarBorderColor1', 'Цвет 1')}<div style="margin-top:8px">${h.color('avatarBorderColor2', 'avatarBorderColor2', 'Цвет 2')}</div><div style="margin-top:8px">${h.color('avatarBorderColor3', 'avatarBorderColor3', 'Цвет 3')}</div></div><div id="avatar-pulsate-settings" style="margin-top:8px;display:none">${h.color('avatarPulsateColor', 'avatarPulsateColor', 'Цвет')}</div><div style="margin-top:8px">${h.slider('avatarBorderSize', 'avatarBorderSize', 'Толщина', 1, 5, 0.5, 'px')}</div><div style="margin-top:8px">${h.slider('avatarBorderSpeed', 'avatarBorderSpeed', 'Скорость', 1, 10, 0.5, 's')}</div></div></div>
                            <div class="setting-group">${h.checkbox('enable3DAvatarHover', 'enable3DAvatarHover', '3D эффект', 'fas fa-cube')}</div>
                            <h4>-- Анимации --</h4>
                            <div class="setting-group">${h.checkbox('enableUiAnimations', 'enableUiAnimations', 'Плавность UI', 'fas fa-hand-pointer')}<div class="sub-settings" id="ui-animations-sub-settings">${h.slider('uiAnimationSpeed', 'uiAnimationSpeed', 'Скорость', 0.1, 1, 0.05, 's')}</div></div>
                            <div class="setting-group">${h.checkbox('enableLikeAnimations', 'enableLikeAnimations', 'Сердечко при лайке', 'fas fa-heart')}</div>
                            <div class="setting-group">${h.checkbox('enableScrollFadeIn', 'enableScrollFadeIn', 'Анимация скролла', 'fas fa-angle-double-up')}<div class="sub-settings" id="scroll-fade-in-sub-settings"><label>Тип:</label><select id="s_scrollFadeInType" name="scrollFadeInType" data-setting-key="scrollFadeInType"><option value="fade-in">Fade In</option><option value="fade-in-up">Fade In Up</option><option value="slide-in-left">Slide In Left</option></select></div></div>
                            <div class="setting-group">${h.checkbox('enableParallaxScroll', 'enableParallaxScroll', 'Parallax эффект', 'fas fa-layer-group')}<div class="sub-settings" id="parallax-scroll-sub-settings"></div></div>
                            <h4>-- Подсветка --</h4>
                            <div class="setting-group">${h.checkbox('enableOwnMessageHighlight', 'enableOwnMessageHighlight', 'Мои сообщения', 'fas fa-highlighter')}<small id="my-username-status" class="panel-status-text">Ваш ник: ...</small><div class="sub-settings" id="own-message-highlight-sub-settings">${h.color('ownMessageHighlightBgColor', 'ownMessageHighlightBgColor', 'Фон')}<div style="margin-top:8px">${h.color('ownMessageHighlightEdgeColor', 'ownMessageHighlightEdgeColor', 'Окантовка')}</div><div style="margin-top:8px">${h.slider('ownMessageHighlightEdgeWidth', 'ownMessageHighlightEdgeWidth', 'Толщина', 0, 10, 0.5, 'px')}</div></div></div>
                            <div class="setting-group">${h.checkbox('enableOpHighlight', 'enableOpHighlight', 'Автор темы', 'fas fa-crown')}<div class="sub-settings" id="op-highlight-sub-settings">${h.color('opHighlightBgColor', 'opHighlightBgColor', 'Фон')}<div style="margin-top:8px">${h.color('opHighlightEdgeColor', 'opHighlightEdgeColor', 'Окантовка')}</div><div style="margin-top:8px">${h.slider('opHighlightEdgeWidth', 'opHighlightEdgeWidth', 'Толщина', 0, 10, 0.5, 'px')}</div></div></div>
                        </div>`;

                        html += `
                        <div class="panel-tab-content" id="tab-interface">
                            <h4>-- Панель навигации --</h4>
                            <div class="setting-group">${h.checkbox('enableBottomNav', 'enableBottomNav', 'Нижняя панель', 'fas fa-compass')}</div>
                            <div class="setting-group"><label>Позиция:</label><select id="s_bottomNavPosition" name="bottomNavPosition" data-setting-key="bottomNavPosition"><option value="bottom-center">Внизу по центру</option><option value="bottom-left">Внизу слева</option><option value="bottom-right">Внизу справа</option><option value="top-center">Вверху по центру</option><option value="top-left">Вверху слева</option><option value="top-right">Вверху справа</option><option value="middle-left">Посередине слева</option><option value="middle-right">Посередине справа</option></select></div>
                            <div class="setting-group">${h.slider('bottomNavOpacity', 'bottomNavOpacity', '<i class="fas fa-eye-slash br-gradient-icon"></i> Прозрачность', 0, 1, 0.05)}</div>
                            <div class="setting-group br-input-group"><input type="text" id="s_bottomNavBorderRadius" name="bottomNavBorderRadius" data-setting-key="bottomNavBorderRadius" placeholder=" "><label><i class="fas fa-vector-square br-gradient-icon"></i> Скругление (10px...)</label></div>
                            <div class="setting-group dynamic-links-group"><label><i class="fas fa-link br-gradient-icon"></i> Ссылки:</label><div id="quick-links-container"></div><button id="add-quick-link-btn" class="panel-btn panel-btn-add" style="margin-top:10px;width:100%">+ Добавить</button></div>
                            <h4>-- Активность --</h4>
                            <div class="setting-group"><label>Интервал (сек):</label><input type="number" id="s_liveUpdateInterval" name="liveUpdateInterval" data-setting-key="liveUpdateInterval" min="30" max="600" step="10"></div>
                            <div class="setting-group"><label class="inline-label"><i class="fas fa-bell br-gradient-icon"></i> Живые счетчики (Вкл)</label></div>
                            <div class="setting-group">${h.checkbox('enableHotTopicPulse', 'enableHotTopicPulse', 'Пульс горячих тем', 'fas fa-fire-alt')}</div>
                            <div class="setting-group">${h.checkbox('enableLiveFeed', 'enableLiveFeed', 'Лента активности', 'fas fa-rss')}</div>
                            <div class="setting-group">${h.checkbox('enableDynamicWelcome', 'enableDynamicWelcome', 'Приветствие', 'fas fa-hand-spock')}</div>
                            <div class="setting-group">${h.checkbox('enableCopyToast', 'enableCopyToast', 'Уведомление копирования', 'fas fa-copy')}</div>
                            <h4>-- Удобство --</h4>
                            <div class="setting-group">${h.checkbox('enableSkeletonLoading', 'enableSkeletonLoading', 'Skeleton-загрузка', 'fas fa-hourglass-start')}</div>
                            <div class="setting-group">${h.checkbox('enableSmartNav', 'enableSmartNav', 'Умная навигация', 'fas fa-compress-arrows-alt')}</div>
                            <div class="setting-group">${h.checkbox('enableScrollIndicator', 'enableScrollIndicator', 'Индикатор прокрутки', 'fas fa-grip-lines')}<div class="sub-settings" id="scroll-indicator-sub-settings">${h.color('scrollIndicatorColor', 'scrollIndicatorColor', 'Цвет')}<div style="margin-top:8px">${h.slider('scrollIndicatorHeight', 'scrollIndicatorHeight', 'Высота', 1, 10, 0.5, 'px')}</div></div></div>
                            <div class="setting-group">${h.checkbox('enableWideMode', 'enableWideMode', 'Широкий режим', 'fas fa-expand')}</div>
                            <div class="setting-group">${h.slider('transparentElementsOpacity', 'transparentElementsOpacity', '<i class="fas fa-ghost br-gradient-icon"></i> Прозрачность элементов', 0, 1, 0.05)}</div>

                       </div>`;

                        html += `
                        <div class="panel-tab-content" id="tab-moderation">
                            <h4>-- Инструменты --</h4>
                            <div class="setting-group">${h.checkbox('enableBinder', 'enableBinder', 'Биндер ответов', 'fas fa-clipboard-list')}</div>
                            <div class="setting-group">${h.checkbox('enableThreadPreview', 'enableThreadPreview', 'Предпросмотр тем', 'fas fa-eye')}</div>
                            <div class="setting-group">${h.checkbox('enableSectionStats', 'enableSectionStats', 'Статистика раздела', 'fas fa-chart-pie')}</div>
                            <div class="setting-group">${h.checkbox('enableComplaintTracker', 'enableComplaintTracker', 'Трекер жалоб', 'fas fa-stopwatch')}<div class="sub-settings" id="complaint-tracker-sub-settings"><div><label>Разделы:</label><input type="text" id="s_complaintTrackerSections" name="complaintTrackerSections" data-setting-key="complaintTrackerSections" placeholder="жалобы, обжалование..."></div><div style="margin-top:8px">${h.slider('complaintTrackerWarnTime', 'complaintTrackerWarnTime', 'Внимание', 1, 48, 1, 'ч')}</div><div style="margin-top:8px">${h.slider('complaintTrackerCritTime', 'complaintTrackerCritTime', 'Критично', 1, 72, 1, 'ч')}</div></div></div>
                            <h4>-- ImgBB --</h4>
                            <div class="setting-group"><label><i class="fas fa-key br-gradient-icon"></i> API ключ:</label><input type="text" id="s_imgbbApiKey" name="imgbbApiKey" data-setting-key="imgbbApiKey" placeholder="Ключ..."><a href="https://api.imgbb.com/" target="_blank" style="font-size:11px;color:#00F0FF;display:block;margin-top:8px">Получить API ключ</a></div>
                            <div class="setting-group"><label><i class="fas fa-history br-gradient-icon"></i> История:</label><div id="br-upload-history-container" style="max-height:200px;overflow-y:auto;background:#0D1D25;padding:8px;border-radius:6px;margin-top:10px"></div><button id="clear-upload-history-btn" class="panel-btn panel-btn-danger" style="margin-top:10px;width:100%;font-size:12px;padding:5px">Очистить</button></div>
                        </div>

                        <div class="panel-tab-content" id="tab-gallery">
                            <h4>-- Галерея Обоев --</h4>
                            <div class="setting-group"><div id="br-gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:10px"></div></div>
                        </div>

                        <div class="panel-tab-content" id="tab-presets">
                            <h4>-- Темы --</h4>
                            <div class="setting-group"><label><i class="fas fa-swatchbook br-gradient-icon"></i> Тема Панели</label><select id="s_panelTheme" name="panelTheme" data-setting-key="panelTheme"><option value="classic_dark">Вечная Классика</option><option value="graphite_blurple">Современный Графит</option><option value="pragmatic_grey">Прагматичный Серый</option><option value="clean_monochrome">Чистый Монохром</option><option value="warm_sepia">Теплая Сепия</option><option value="emerald_forest">Изумрудный Лес</option><option value="sunset_rose">Розовый Закат</option></select></div>
                            <div class="setting-group"><label><i class="fas fa-tint br-gradient-icon"></i> Стиль панели:</label><select id="s_bottomNavTheme" name="bottomNavTheme" data-setting-key="bottomNavTheme"><option value="nav_theme_custom_dynamic" style="display:none">🎨 Адаптированный</option><option value="nav_theme_fire">Огонь</option><option value="nav_theme_ocean">Океан</option><option value="nav_theme_forest">Лес</option><option value="nav_theme_cyber">Киберпанк</option><option value="nav_theme_mono">Монохром</option></select></div>
                            <h4>-- Готовые --</h4>
                            <div class="setting-group preset-manager"><label><i class="fas fa-box-open br-gradient-icon"></i> Встроенные:</label><select id="s_builtInPresetSelect" style="margin-bottom:8px"><option value="">-- Выберите --</option><option value="new_year">Новый Год</option><option value="halloween">Хэллоуин</option><option value="valentines">Валентин</option><option value="womens_day">8 Марта</option><option value="victory_day">День Победы</option><option value="ramadan">Рамадан</option><option value="cyberpunk">Киберпанк</option><option value="default_dark">Default</option></select><button id="load-builtin-preset-btn" class="panel-btn" style="width:100%;background-color:#17a2b8;color:white">Загрузить</button></div>
                            <h4>-- Мои --</h4>
                            <div class="setting-group preset-manager"><label><i class="fas fa-save br-gradient-icon"></i> Сохраненные:</label><select id="s_customPresetSelect" style="margin-bottom:8px"></select><div style="display:flex;gap:8px;margin-bottom:12px"><button id="load-preset-btn" class="panel-btn" style="flex:1;background-color:#2196F3;color:white">Загрузить</button><button id="delete-preset-btn" class="panel-btn panel-btn-danger" style="flex:1">Удалить</button></div><div class="br-input-group" style="margin-bottom:8px"><input type="text" id="s_newPresetName" data-setting-key="newPresetName_IGNORE" placeholder=" " style="margin:0"><label>Название новой</label></div><button id="save-preset-btn" class="panel-btn panel-btn-save" style="width:100%">Сохранить текущие</button></div>
                            <h4>-- Умная Смена --</h4>
                            <div class="setting-group">${h.checkbox('enableContextualBackgrounds', 'enableContextualBackgrounds', 'Менять в разделах', 'fas fa-random')}<div class="sub-settings" id="contextual-bg-sub-settings"><div class="br-input-group"><input type="text" id="s_contextualBgUrl" name="contextualBgUrl" data-setting-key="contextualBgUrl" placeholder=" "><label>URL содержит (zhaloby)</label></div><label style="margin-top:8px">Применить:</label><select id="s_contextualBgPreset" name="contextualBgPreset" data-setting-key="contextualBgPreset"></select></div></div>
                        </div>

                        <div class="panel-tab-content" id="tab-help">
                            <h4>-- Справочник --</h4>
                            <div class="setting-group br-help-section"><label><i class="fas fa-info-circle br-gradient-icon"></i> О скрипте</label><p>Универсальный инструмент Black Russia.</p></div>
                            <div class="setting-group br-help-section"><label><i class="fas fa-list-ul br-gradient-icon"></i> Разделы</label><ul><li><strong>🏠 Главное:</strong> Фон, цвета, блоки.</li><li><strong>✨ Эффекты:</strong> Погода, анимации.</li><li><strong>🕹️ Интерфейс:</strong> Навигация, уведомления.</li><li><strong>🛠️ Инструменты:</strong> Биндер, трекеры.</li><li><strong>🖼️ Галерея:</strong> Обои с адаптацией.</li><li><strong>💾 Темы:</strong> Сохранение настроек.</li></ul></div>
                        </div>
                    </div>
                </div>
                <div class="button-group">
                    <button id="export-btn" class="panel-btn panel-btn-export" title="Экспорт">Экспорт</button>
                    <button id="import-btn" class="panel-btn panel-btn-import" title="Импорт">Импорт</button>
                    <input type="file" id="import-settings-file" accept=".json" style="display:none">
                    <span style="flex-grow:1"></span>
                    <button id="reset-btn" class="panel-btn panel-btn-reset" title="Сброс">Сброс</button>
                    <button id="save-btn" class="panel-btn panel-btn-save">Сохранить</button>
                </div>`;
            return html;
},

        attachEvents(panel) {
            const Q = (sel) => panel.querySelector(sel);
            const toggle = (chk, div) => { if(chk && div) div.style.display = chk.checked ? 'block' : 'none'; };

            panel.querySelectorAll('.br-hub-card').forEach(c => c.onclick = () => {
                panel.querySelector('.br-hub-grid').classList.add('br-slide-out-left');
                setTimeout(() => {
                    panel.querySelectorAll('.panel-tab-content').forEach(p => { p.style.display = 'none'; p.classList.remove('br-slide-in-right'); });
                    const target = Q('#' + c.dataset.page);
                    if(target) { target.style.display = 'block'; target.classList.add('br-slide-in-right'); }
                    Q('.br-settings-title').textContent = c.querySelector('span').textContent;
                    panel.dataset.view = 'page';
                    panel.querySelector('.br-hub-grid').classList.remove('br-slide-out-left');
                }, 250);
            });

            Q('.br-settings-back-btn').onclick = () => {
                const vis = Array.from(panel.querySelectorAll('.panel-tab-content')).find(p => p.style.display === 'block');
                if(vis) vis.classList.add('br-slide-out-right');
                setTimeout(() => {
                    if(vis) vis.style.display = 'none';
                    panel.dataset.view = 'hub';
                    const grid = panel.querySelector('.br-hub-grid');
                    grid.classList.add('br-slide-in-left');
                    setTimeout(() => grid.classList.remove('br-slide-in-left'), 400);
                }, 200);
            };

            const updateVis = () => {
                const toggles = [
                    ['#s_enableGradient', '#gradient-sub-settings'],
                    ['#s_enableAnimatedGradient', '#animated-gradient-sub-settings'],
                    ['#s_enableRounding', '#rounding-sub-settings'],
                    ['#s_enableEdge', '#edge-sub-settings'],
                    ['#s_enableTextGlow', '#text-glow-sub-settings'],
                    ['#s_enableBlockBlur', '#block-blur-sub-settings'],
                    ['#s_enableOwnMessageHighlight', '#own-message-highlight-sub-settings'],
                    ['#s_enableOpHighlight', '#op-highlight-sub-settings'],
                    ['#s_enableContextualBackgrounds', '#contextual-bg-sub-settings'],
                    ['#s_enableAvatarBorder', '#avatar-border-sub-settings'],
                    ['#s_enableUiAnimations', '#ui-animations-sub-settings'],
                    ['#s_enableScrollFadeIn', '#scroll-fade-in-sub-settings'],
                    ['#s_enableParallaxScroll', '#parallax-scroll-sub-settings'],
                    ['#s_enableScrollIndicator', '#scroll-indicator-sub-settings'],
                    ['#s_enableComplaintTracker', '#complaint-tracker-sub-settings'],
                    ['#s_enablePulsatingNicks', '#pulsating-nicks-sub-settings'],
                    ['#s_enableGradientNicks', '#gradient-nicks-sub-settings']
                ];

                toggles.forEach(([chkId, divId]) => toggle(Q(chkId), Q(divId)));

                const effType = Q('#s_effectType').value;
                const effDet = Q('#effect-details-settings');
                effDet.style.display = effType !== 'none' ? 'block' : 'none';
                Q('.rain-settings').style.display = effType === 'rain' ? 'block' : 'none';
                Q('.matrix-settings').style.display = effType === 'matrix' ? 'block' : 'none';
                Q('.sway-settings').style.display = ['snow','petals','leaves','fireflies','bubbles'].some(x => effType.includes(x)) ? 'block' : 'none';

                const avaStyle = Q('#s_avatarBorderStyle').value;
                Q('#avatar-gradient-settings').style.display = avaStyle === 'gradient' ? 'block' : 'none';
                Q('#avatar-pulsate-settings').style.display = avaStyle === 'pulsate' ? 'block' : 'none';

                if (Q('#bg-image-setting-group')) Q('#bg-image-setting-group').style.display = Q('#s_enableGradient').checked ? 'none' : 'block';

                if (Q('#s_enablePulsatingNicks').checked) {
                    Q('#s_enableGradientNicks').disabled = true;
                    Q('#s_enableGradientNicks').parentElement.style.opacity = '0.5';
                } else {
                    Q('#s_enableGradientNicks').disabled = false;
                    Q('#s_enableGradientNicks').parentElement.style.opacity = '1';
                }

                 if (Q('#s_enableGradientNicks').checked) {
                    Q('#s_enablePulsatingNicks').disabled = true;
                    Q('#s_enablePulsatingNicks').parentElement.style.opacity = '0.5';
                } else {
                    Q('#s_enablePulsatingNicks').disabled = false;
                    Q('#s_enablePulsatingNicks').parentElement.style.opacity = '1';
                }
            };

            const livePreview = debounce((target) => {
                if (!target.dataset.settingKey) return;
                const key = target.dataset.settingKey;
                let value;

                if (target.type === 'checkbox') value = target.checked;
                else if (target.type === 'number' || target.type === 'range') value = parseFloat(target.value) || 0;
                else value = target.value;

                currentSettings[key] = value;
                applyForumStyles(currentSettings);
                manageVisualEffects(currentSettings);
                updateBottomNavBarContent(currentSettings);
            }, 50);

            panel.querySelectorAll('input, select').forEach(el => {
                el.addEventListener('input', (e) => {
                    if (e.target.type === 'range') updateSliderValue(e.target);
                    updateVis();
                    livePreview(e.target);
                });
                el.addEventListener('change', (e) => {
                    updateVis();
                    livePreview(e.target);
                });
            });

            Q('#s_effectType').brInitializeVisibility = updateVis;
            Q('#s_enableAvatarBorder').brInitializeVisibility = updateVis;

            Q('#save-btn').onclick = handleSave;
            Q('#reset-btn').onclick = handleReset;
            Q('#clear-bg-btn').onclick = handleClearBg;
            Q('#close-btn').onclick = closePanel;
            Q('#export-btn').onclick = handleExport;
            Q('#import-btn').onclick = () => Q('#import-settings-file').click();
            Q('#import-settings-file').onchange = handleImport;
            Q('#add-quick-link-btn').onclick = (e) => { createRipple(e); addQuickLinkInput(Q('#quick-links-container')); };
            Q('#load-preset-btn').onclick = handleLoadCustomPreset;
            Q('#save-preset-btn').onclick = handleSaveCustomPreset;
            Q('#delete-preset-btn').onclick = handleDeleteCustomPreset;
            Q('#load-builtin-preset-btn').onclick = handleLoadBuiltInPreset;
            Q('#clear-upload-history-btn').onclick = async () => {
                if(confirm('Очистить историю?')) {
                    Q('#br-upload-history-container').innerHTML = '<div class="br-skeleton-loader"></div>';
                    await GM_setValue(UPLOAD_HISTORY_KEY, '[]');
                    setTimeout(() => { loadUploadHistory(); showToast('Очищено', 'info'); }, 300);
                }
            };
            Q('#s_panelTheme').onchange = () => document.getElementById('br-panel-wrapper').dataset.theme = Q('#s_panelTheme').value;
            Q('#s_fontColorSelect').onchange = (e) => { if(e.target.value) { Q('#s_fontColor').value = e.target.value; Q('#s_fontColor').dispatchEvent(new Event('input')); }};
            Q('#s_fontColor').oninput = () => Q('#s_fontColorSelect').value = "";

            updateVis();
        }
    };

    function createPanelHTML() {
        if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);
        const panelWrapper = document.createElement('div');
        panelWrapper.id = 'br-panel-wrapper';
        const panelDiv = document.createElement('div');
        panelDiv.id = PANEL_ID;
        panelDiv.classList.add('br-noise-bg');
        panelWrapper.appendChild(panelDiv);

        try {
            panelDiv.innerHTML = SettingsPanelUI.getHTML();
            document.body.appendChild(panelWrapper);
            settingsPanel = panelDiv;
            SettingsPanelUI.attachEvents(panelDiv);

            const galleryGrid = panelDiv.querySelector('#br-gallery-grid');
            if (galleryGrid && typeof WALLPAPER_GALLERY !== 'undefined') {
                const GalleryManager = {
                    init(container) {
                        container.className = 'br-gallery-wrapper';
                        container.style.display = 'flex';
                        container.innerHTML = '';
                        this.injectStyles();
                        const observer = new IntersectionObserver((entries, obs) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    const img = entry.target.querySelector('img');
                                    if (img && img.dataset.src) img.src = img.dataset.src;
                                    obs.unobserve(entry.target);
                                }
                            });
                        }, { rootMargin: "200px" });
                        Object.entries(WALLPAPER_GALLERY).forEach(([category, urls], idx) => {
                            if (!Array.isArray(urls) || !urls.length) return;
                            this.renderCategory(container, category, urls, idx, observer);
                        });
                    },
                    injectStyles() {
                        if (document.getElementById('br-gallery-smart-scroll')) return;
                        const style = document.createElement('style');
                        style.id = 'br-gallery-smart-scroll';
                        style.textContent = '.br-gallery-infinite-container{display:flex;overflow-x:auto;gap:12px;padding-bottom:12px;cursor:grab;mask-image:linear-gradient(to right,transparent,black 15px,black 95%,transparent);-webkit-mask-image:linear-gradient(to right,transparent,black 15px,black 95%,transparent);white-space:nowrap;user-select:none;scrollbar-width:none}.br-gallery-infinite-container::-webkit-scrollbar{display:none}.br-gallery-infinite-container:active{cursor:grabbing}.br-gallery-item-smart{min-width:140px;height:220px;border-radius:12px;overflow:hidden;position:relative;border:1px solid rgba(255,255,255,0.1);transition:transform 0.3s ease,box-shadow 0.3s ease;background:#000;flex-shrink:0;display:inline-block}.br-gallery-item-smart:hover{transform:translateY(-5px);border-color:#D59D80;box-shadow:0 5px 20px rgba(0,0,0,0.4);z-index:2}.br-gallery-item-smart img{width:100%;height:100%;object-fit:cover;opacity:0.8;transition:opacity 0.3s;pointer-events:none}.br-gallery-item-smart:hover img{opacity:1}.br-gallery-item-smart.loading{animation:br-skeleton-shine 1.5s linear infinite;background:linear-gradient(90deg,#1a1a1a 25%,#2a2a2a 50%,#1a1a1a 75%);background-size:200% 100%}';
                        document.head.appendChild(style);
                    },
                    renderCategory(container, title, urls, index, observer) {
                        const wrapper = document.createElement('div');
                        const header = document.createElement('div');
                        header.className = 'br-gallery-category-title';
                        header.innerHTML = title;
                        const scrollBox = document.createElement('div');
                        scrollBox.className = 'br-gallery-infinite-container';
                        const safeUrls = [...urls, ...urls, ...urls, ...urls];
                        safeUrls.forEach(url => {
                            const item = document.createElement('div');
                            item.className = 'br-gallery-item-smart loading';
                            const img = document.createElement('img');
                            img.dataset.src = url;
                            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                            img.onload = () => { if (img.src.length > 100) item.classList.remove('loading'); };
                            item.appendChild(img);
                            item.onclick = (e) => this.handleItemClick(e, url);
                            scrollBox.appendChild(item);
                            observer.observe(item);
                        });
                        wrapper.appendChild(header);
                        wrapper.appendChild(scrollBox);
                        container.appendChild(wrapper);
                        this.setupAutoScroll(scrollBox, index);
                    },
                    setupAutoScroll(element, index) {
                        const speed = 1 + Math.random() * 0.8;
                        const direction = index % 2 === 0 ? 1 : -1;
                        let isPaused = false;
                        let pauseTimeout;
                        setTimeout(() => { element.scrollLeft = Math.random() * (element.scrollWidth / 2); }, 100);
                        element.onmouseenter = () => isPaused = true;
                        element.onmouseleave = () => isPaused = false;
                        element.ontouchstart = () => { isPaused = true; clearTimeout(pauseTimeout); };
                        element.ontouchend = () => { pauseTimeout = setTimeout(() => isPaused = false, 1500); };
                        const animate = () => {
                            if (!isPaused) {
                                if (direction === 1) { element.scrollLeft += speed; if (element.scrollLeft >= element.scrollWidth / 2) element.scrollLeft = 0; }
                                else { element.scrollLeft -= speed; if (element.scrollLeft <= 0) element.scrollLeft = element.scrollWidth / 2; }
                            }
                            requestAnimationFrame(animate);
                        };
                        requestAnimationFrame(animate);
                    },
                    handleItemClick(e, url) {
                        e.preventDefault();
                        const toast = document.createElement('div');
                        toast.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:15px 25px;border-radius:8px;z-index:10010;font-weight:bold;backdrop-filter:blur(5px);box-shadow:0 5px 15px rgba(0,0,0,0.3)";
                        toast.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px"></i> Анализ цветов...';
                        document.body.appendChild(toast);
                        GM_xmlhttpRequest({
                            method: "GET", url: url, responseType: "blob",
                            onload: (res) => {
                                const reader = new FileReader();
                                reader.onloadend = () => { this.analyzeColors(reader.result, (colors) => { toast.remove(); this.openPreviewModal(reader.result, colors); }); };
                                reader.readAsDataURL(res.response);
                            },
                            onerror: () => { toast.remove(); showToast('Ошибка загрузки', 'error'); }
                        });
                    },
                    analyzeColors(dataUri, callback) {
    const img = new Image();
    img.src = dataUri;
    img.onload = () => {
        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');
        cvs.width = 50; cvs.height = 50;
        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        const validPixels = [];
        for (let i = 0; i < data.length; i += 4) {
            const rVal = data[i];
            const gVal = data[i + 1];
            const bVal = data[i + 2];
            const aVal = data[i + 3];
            if (aVal < 200) continue;
            const [h, s, l] = rgbToHslLocal(rVal, gVal, bVal);
            if (l < 0.15 || l > 0.90 || s < 0.10) continue;
            validPixels.push({ r: rVal, g: gVal, b: bVal, s: s });
        }
        let r = 0, g = 0, b = 0;
        if (validPixels.length > 0) {
            validPixels.sort((a, b) => b.s - a.s);
            const limit = Math.max(1, Math.floor(validPixels.length * 0.10));
            let rSum = 0, gSum = 0, bSum = 0;
            for (let i = 0; i < limit; i++) {
                rSum += validPixels[i].r;
                gSum += validPixels[i].g;
                bSum += validPixels[i].b;
            }
            r = Math.round(rSum / limit);
            g = Math.round(gSum / limit);
            b = Math.round(bSum / limit);
        } else {
            r = 40; g = 40; b = 40;
        }
        const [hFin, sFin, lFin] = rgbToHslLocal(r, g, b);
        callback({ hue: hFin * 360, sat: Math.round(sFin * 100), lig: Math.round(lFin * 100) });
    };
},
                    openPreviewModal(dataUri, initialColors) {
                        const modalId = 'br-preview-' + Date.now();
                        const html = `<div id="${modalId}" style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:10005;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);padding:20px;"><div class="br-modal-window" style="width:100%;max-width:400px;background:#121212;border:1px solid #333;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 50px 100px black;"><div style="height:220px;position:relative;width:100%;overflow:hidden;"><img src="${dataUri}" style="width:100%;height:100%;object-fit:cover;opacity:0.6;"><div class="br-preview-mock" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:20px;gap:10px;"><div id="mock-nav-${modalId}" style="height:40px;width:100%;background:#222;border-radius:8px;display:flex;align-items:center;padding:0 15px;border-bottom:2px solid #555;"><div style="width:20px;height:20px;background:#fff;opacity:0.2;border-radius:4px;"></div></div><div id="mock-card-${modalId}" style="background:#1a1a1a;border-radius:12px;padding:15px;border:1px solid #333;box-shadow:0 10px 30px rgba(0,0,0,0.5);"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="background:#E67E22;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">Тест</span><span style="background:#C0392B;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">Важно</span></div><div style="color:#fff;font-weight:bold;font-size:13px;margin-bottom:6px;">Заголовок темы</div><div style="color:#bbb;font-size:11px;line-height:1.3;margin-bottom:10px;">Пример текста для проверки читаемости цветов.</div><div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;border-top:1px solid rgba(255,255,255,0.1);padding-top:8px;"><div id="mock-ava-${modalId}" style="width:24px;height:24px;border-radius:50%;border:2px solid #555;"></div><div style="color:#888;font-size:10px;">User_Name</div></div><div id="mock-btn-${modalId}" style="height:28px;width:100%;background:#444;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold;letter-spacing:1px;">КНОПКА</div></div></div></div><div style="padding:20px;background:#09090b;overflow-y:auto;max-height:40vh;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">ОТТЕНОК</label><span id="hue-text-${modalId}" style="color:#fff;font-size:10px;">${Math.round(initialColors.hue)}°</span></div><input type="range" id="hue-slider-${modalId}" min="0" max="360" value="${initialColors.hue}" style="width:100%;margin-bottom:10px;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">НАСЫЩЕННОСТЬ</label><span id="sat-text-${modalId}" style="color:#fff;font-size:10px;">${initialColors.sat}%</span></div><input type="range" id="sat-slider-${modalId}" min="0" max="100" value="${initialColors.sat}" style="width:100%;margin-bottom:10px;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">ЯРКОСТЬ</label><span id="lig-text-${modalId}" style="color:#fff;font-size:10px;">${initialColors.lig}%</span></div><input type="range" id="lig-slider-${modalId}" min="20" max="90" value="${initialColors.lig}" style="width:100%;margin-bottom:15px;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">СКРУГЛЕНИЕ</label><span id="rad-text-${modalId}" style="color:#fff;font-size:10px;">12px</span></div><input type="range" id="rad-slider-${modalId}" min="0" max="30" value="12" style="width:100%;margin-bottom:15px;"><div style="display:flex;gap:10px;margin-bottom:20px;"><div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Акцент</label><input type="color" id="color-accent-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div><div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Рамки</label><input type="color" id="color-border-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div><div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Фон</label><input type="color" id="color-bg-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><button id="btn-save-${modalId}" style="background:#fff;border:none;padding:12px;border-radius:8px;font-weight:bold;cursor:pointer;">Применить</button><button id="btn-cancel-${modalId}" style="background:transparent;border:1px solid #333;color:#888;padding:12px;border-radius:8px;cursor:pointer;">Отмена</button></div></div></div></div>`;
                        document.body.insertAdjacentHTML('beforeend', html);
                        const els = { h: document.getElementById(`hue-slider-${modalId}`), s: document.getElementById(`sat-slider-${modalId}`), l: document.getElementById(`lig-slider-${modalId}`), rad: document.getElementById(`rad-slider-${modalId}`), ac: document.getElementById(`color-accent-${modalId}`), bo: document.getElementById(`color-border-${modalId}`), bg: document.getElementById(`color-bg-${modalId}`), mockNav: document.getElementById(`mock-nav-${modalId}`), mockCard: document.getElementById(`mock-card-${modalId}`), mockAva: document.getElementById(`mock-ava-${modalId}`), mockBtn: document.getElementById(`mock-btn-${modalId}`), btnSave: document.getElementById(`btn-save-${modalId}`), btnCancel: document.getElementById(`btn-cancel-${modalId}`) };
                        const update = () => {
                        const h = parseInt(els.h.value) / 360, s = parseInt(els.s.value) / 100, l = parseInt(els.l.value) / 100;
                        document.getElementById(`hue-text-${modalId}`).innerText = els.h.value + '°'; document.getElementById(`sat-text-${modalId}`).innerText = els.s.value + '%'; document.getElementById(`lig-text-${modalId}`).innerText = els.l.value + '%'; document.getElementById(`rad-text-${modalId}`).innerText = els.rad.value + 'px';
                        return {h, s, l};
                              };
                        const autoColor = () => { const {h, s, l} = update(); els.ac.value = hslToRgbLocal(h, s, l); els.bo.value = hslToRgbLocal(h, s * 0.7, Math.max(0.2, l - 0.2)); els.bg.value = hslToRgbLocal(h, s * 0.2, 0.06); manualColor(); };
                        const manualColor = () => {
                            const ac = els.ac.value, bo = els.bo.value, bg = els.bg.value, rd = els.rad.value + 'px';
                            els.mockNav.style.cssText = `height:40px;width:100%;border-radius:8px;display:flex;align-items:center;padding:0 15px;border-bottom:2px solid #555;background:${bg};border-bottom-color:${ac};border-radius:${rd}`;
                            els.mockCard.style.cssText = `padding:15px;border:1px solid #333;box-shadow:0 10px 30px rgba(0,0,0,0.5);background:linear-gradient(to bottom, ${bg}, #050505);border-color:${bo};box-shadow:0 0 0 1px ${bo};border-radius:${rd}`;
                            els.mockAva.style.cssText = `width:24px;height:24px;border-radius:50%;border:2px solid #555;border-color:${ac};box-shadow:0 0 10px ${ac}`;
                            els.mockBtn.style.cssText = `height:28px;width:100%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold;letter-spacing:1px;background:linear-gradient(90deg, ${ac}, ${bo});box-shadow:0 5px 15px ${ac}40;border-radius:${rd}`;
                            els.btnSave.style.cssText = `background:${ac};border:none;padding:12px;border-radius:8px;font-weight:bold;cursor:pointer;box-shadow:0 5px 15px ${ac}40`;
                        };
                        els.h.oninput = autoColor; els.s.oninput = autoColor; els.l.oninput = autoColor; els.rad.oninput = manualColor; els.ac.oninput = manualColor; els.bo.oninput = manualColor; els.bg.oninput = manualColor;
                        autoColor();
                        els.btnCancel.onclick = () => document.getElementById(modalId).remove();
                        els.btnSave.onclick = async (e) => {
                            e.preventDefault();
                            const ac = els.ac.value, bo = els.bo.value, bg = els.bg.value, rd = els.rad.value + 'px';
                            const [r, g, b] = hexToRgbSimple(ac); const [h, s, l] = rgbToHslLocal(r, g, b);
                            const hl = hslToRgbLocal(h, s, Math.min(l + 0.15, 0.85)); const sh = hslToRgbLocal((h + 0.03) % 1.0, s, Math.max(l - 0.05, 0.15));
                            const settings = { ...currentSettings, bgImageDataUri: dataUri, enableGradient: false, bgColor: bg, enableEdge: true, edgeColor: bo, enableRounding: true, borderRadius: rd, enableScrollIndicator: true, scrollIndicatorColor: hl, enableAvatarBorder: true, avatarBorderColor1: hl, avatarBorderColor2: bo, avatarBorderColor3: hl, enableOpHighlight: true, opHighlightEdgeColor: bo, opHighlightBgColor: bg, enableOwnMessageHighlight: true, ownMessageHighlightEdgeColor: hl, bottomNavTheme: 'nav_theme_custom_dynamic', opacityValue: 0.2 };
                            const styleId = 'br-dynamic-gradient-vars'; const old = document.getElementById(styleId); if (old) old.remove();
                            const st = document.createElement('style'); st.id = styleId;
                            st.textContent = `:root{--br-edge-color:${bo}!important;--br-bg-color:${bg}!important;--br-nav-main-gradient:linear-gradient(135deg,${sh} 0%,${hl} 50%,${sh} 100%)!important;--br-nav-accent-color:${hl}!important;--br-nav-border-color:${bo}!important;--br-primary:${hl}!important;--br-secondary:${sh}!important}@keyframes br-liquid-metal{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}.button,a.button{background-image:linear-gradient(60deg,${sh},${hl},${bg},${hl},${sh})!important;background-size:300% 300%!important;animation:br-liquid-metal 4s ease infinite!important;border-color:${bo}!important;color:#fff!important;text-shadow:0 1px 2px rgba(0,0,0,0.5)!important;box-shadow:0 4px 15px ${sh}66!important;position:relative!important;z-index:1;transition:transform 0.2s,box-shadow 0.2s!important}.button:hover,a.button:hover{transform:translateY(-2px)!important;box-shadow:0 0 20px ${hl}!important;filter:brightness(1.2)}.p-nav{background:linear-gradient(180deg,${sh}99 0%,${bg}CC 100%)!important}`;
                            document.head.appendChild(st);
                            if (settingsPanel) {
                                const setVal = (id, val) => { const el = settingsPanel.querySelector('#' + id); if (el) el.value = val; };
                                const setChk = (id, val) => { const el = settingsPanel.querySelector('#' + id); if (el) el.checked = val; };
                                setChk('s_enableGradient', false); setChk('s_enableEdge', true); setChk('s_enableRounding', true);
                                setVal('s_bgColor', bg); setVal('s_edgeColor', bo); setVal('s_borderRadius', parseInt(rd));
                            }
                            await saveSettings(settings); applyForumStyles(settings); updateBottomNavBarContent(settings); manageVisualEffects(settings);
                            if (!document.getElementById(STYLE_ICON_ID)) addSettingsIconHTML();
                            showToast('✅ Дизайн адаптирован!', 'success'); document.getElementById(modalId).remove(); closePanel();
                        };
                    }
                };
                GalleryManager.init(galleryGrid);
            }
            return panelDiv;
        } catch (e) {
            console.error('[BR Style] Ошибка создания панели', e);
            if (panelDiv && panelDiv.parentNode) panelDiv.parentNode.removeChild(panelDiv);
            showToast('Ошибка создания панели', 'error');
            return null;
        }
    }

    async function handleReset() {
        if (!confirm('Вы уверены, что хотите сбросить ВСЕ настройки стиля к значениям по умолчанию? Это действие необратимо.')) return;
        if (!settingsPanel) return;
        const resetBtn = settingsPanel.querySelector('#reset-btn');
        if (!resetBtn) return;
        const originalBtnText = resetBtn.textContent; resetBtn.textContent = 'Сброс...⏳'; resetBtn.disabled = true;

        const dynamicStyle = document.getElementById('br-dynamic-gradient-vars');
        if (dynamicStyle) dynamicStyle.remove();

        const settingsToReset = { ...defaultSettings };
        settingsToReset.customPresets = currentSettings.customPresets;
        const success = await saveSettings(settingsToReset);
        if (success) {
            openPanel();
            applyForumStyles(currentSettings);
            updateBottomNavBarContent(currentSettings);
            manageVisualEffects(currentSettings);
            handleScroll();
            const bgStatus = settingsPanel.querySelector('#bg-status'); if(bgStatus) bgStatus.textContent = 'Фон не задан.';
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
                        showToast('Настройки сброшены по умолчанию!', 'success');
            resetBtn.innerHTML = '<i class="fas fa-check"></i> Сброшено!';
            resetBtn.style.backgroundColor = '#ffc107';
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
                resetBtn.style.backgroundColor = '';
                resetBtn.disabled = false;
            }, 1500);
        } else {
            showToast('Ошибка при сбросе настроек!', 'error');
            resetBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка!';
            resetBtn.style.backgroundColor = '#dc3545';
            setTimeout(() => {
                resetBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
                resetBtn.style.backgroundColor = '';
                resetBtn.disabled = false;
            }, 2000);

        }
    }

        async function handleSave() {
        if (!settingsPanel) return;
        const oldSettingsIcon = document.getElementById(STYLE_ICON_ID);
        if (oldSettingsIcon) {
            oldSettingsIcon.remove();
        }
        addSettingsIconHTML();
        const saveBtn = settingsPanel.querySelector('#save-btn');
         if (!saveBtn) return;
        const originalBtnText = saveBtn.textContent; saveBtn.textContent = 'Сохранение...⏳'; saveBtn.disabled = true;
        let errorOccurred = false;
        const settingsToUpdate = {};
        const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
        settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
            const key = input.dataset.settingKey;
            if (defaultSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                let value;
                if (input.type === 'checkbox') { value = input.checked; }
                else if (input.type === 'number' || input.type === 'range') { const parsedValue = parseFloat(input.value); value = isNaN(parsedValue) ? defaultSettings[key] : parsedValue; }
                else { value = input.value; }
                settingsToUpdate[key] = value;
            }
        });
        settingsToUpdate.quickLinks = [];
        settingsPanel.querySelectorAll('#quick-links-container .quick-link-input-item').forEach(item => {
             const name = item.querySelector('.quick-link-name').value.trim();
             const url = item.querySelector('.quick-link-url').value.trim();
             if (name && isValidURL(url)) {
                 settingsToUpdate.quickLinks.push({ name, url });
             } else if (name && url) {
                 showToast(`Неверный URL для ссылки "${name}". Ссылка не сохранена.`, 'error');
                 errorOccurred = true;
             }
        });
        settingsToUpdate.customPresets = currentSettings.customPresets;

    if (bgFileInput && bgFileInput.files.length > 0) {
            try {
                const file = bgFileInput.files[0];
                if (file.size > 5 * 1024 * 1024) {
                    showToast('Файл слишком большой (макс 5МБ)', 'error');
                    saveBtn.textContent = originalBtnText;
                    saveBtn.disabled = false;
                    return;
                }

                const reader = new FileReader();
                reader.onload = async function(e) {
                    const dataUri = e.target.result;
                    const imgObj = new Image();
                    imgObj.src = dataUri;
                    await new Promise(resolve => { imgObj.onload = resolve; });
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 50;
                    canvas.height = 50;
                    ctx.drawImage(imgObj, 0, 0, 50, 50);
                    const imgData = ctx.getImageData(0, 0, 50, 50);
                    const data = imgData.data;
                    const validPixels = [];
                    for (let i = 0; i < data.length; i += 4) {
                        const rVal = data[i];
                        const gVal = data[i + 1];
                        const bVal = data[i + 2];
                        const aVal = data[i + 3];
                        if (aVal < 200) continue;
                        const [h, s, l] = rgbToHslLocal(rVal, gVal, bVal);
                        if (l < 0.15 || l > 0.90 || s < 0.10) continue;
                        validPixels.push({ r: rVal, g: gVal, b: bVal, s: s });
                    }
                    let r = 0, g = 0, b = 0;
                    if (validPixels.length > 0) {
                        validPixels.sort((a, b) => b.s - a.s);
                        const limit = Math.max(1, Math.floor(validPixels.length * 0.10));
                        let rSum = 0, gSum = 0, bSum = 0;
                        for (let i = 0; i < limit; i++) {
                            rSum += validPixels[i].r;
                            gSum += validPixels[i].g;
                            bSum += validPixels[i].b;
                        }
                        r = Math.round(rSum / limit);
                        g = Math.round(gSum / limit);
                        b = Math.round(bSum / limit);
                    } else {
                        r = 40; g = 40; b = 40;
                    }

                    let [h, s, l] = rgbToHslLocal(r, g, b);
                    let bestHue = h * 360;
                    let finalSat = Math.round(Math.max(s, 0.25) * 100);
                    let finalLig = Math.round(Math.max(0.20, Math.min(l, 0.65)) * 100);
                    const modalId = 'br-preview-local-' + Date.now();
                    const modalHTML = `<div id="${modalId}" style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:10005;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px);padding:20px;"><div class="br-modal-window" style="width:100%;max-width:400px;background:#121212;border:1px solid #333;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 50px 100px black;"><div style="height:220px;position:relative;width:100%;overflow:hidden;"><img src="${dataUri}" style="width:100%;height:100%;object-fit:cover;opacity:0.6;"><div class="br-preview-mock" style="position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:20px;gap:10px;"><div id="mock-nav-${modalId}" style="height:40px;width:100%;background:#222;border-radius:8px;display:flex;align-items:center;padding:0 15px;border-bottom:2px solid #555;"><div style="width:20px;height:20px;background:#fff;opacity:0.2;border-radius:4px;"></div></div><div id="mock-card-${modalId}" style="background:#1a1a1a;border-radius:12px;padding:15px;border:1px solid #333;box-shadow:0 10px 30px rgba(0,0,0,0.5);"><div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="background:#E67E22;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">На рассмотрении</span><span style="background:#C0392B;color:#fff;font-size:10px;padding:2px 6px;border-radius:4px;font-weight:bold;">Важно</span></div><div style="color:#fff;font-weight:bold;font-size:13px;margin-bottom:6px;">Заявка на пост</div><div style="color:#bbb;font-size:11px;line-height:1.3;margin-bottom:10px;">Текст сообщения для проверки.</div><div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;border-top:1px solid rgba(255,255,255,0.1);padding-top:8px;"><div id="mock-ava-${modalId}" style="width:24px;height:24px;border-radius:50%;border:2px solid #555;"></div><div style="color:#888;font-size:10px;">Admin_User</div></div><div id="mock-btn-${modalId}" style="height:28px;width:100%;background:#444;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:bold;letter-spacing:1px;">КНОПКА</div></div></div></div><div style="padding:20px;background:#09090b;overflow-y:auto;max-height:40vh;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">ОТТЕНОК</label><span id="hue-text-${modalId}" style="color:#fff;font-size:10px;">${Math.round(bestHue)}°</span></div><input type="range" id="hue-slider-${modalId}" min="0" max="360" value="${bestHue}" style="width:100%;margin-bottom:10px;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">НАСЫЩЕННОСТЬ</label><span id="sat-text-${modalId}" style="color:#fff;font-size:10px;">${finalSat}%</span></div><input type="range" id="sat-slider-${modalId}" min="0" max="100" value="${finalSat}" style="width:100%;margin-bottom:10px;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">ЯРКОСТЬ</label><span id="lig-text-${modalId}" style="color:#fff;font-size:10px;">${finalLig}%</span></div><input type="range" id="lig-slider-${modalId}" min="20" max="90" value="${finalLig}" style="width:100%;margin-bottom:15px;"><div style="display:flex;justify-content:space-between;margin-bottom:5px;"><label style="color:#888;font-size:10px;">СКРУГЛЕНИЕ</label><span id="rad-text-${modalId}" style="color:#fff;font-size:10px;">12px</span></div><input type="range" id="rad-slider-${modalId}" min="0" max="30" value="12" style="width:100%;margin-bottom:15px;"><div style="display:flex;gap:10px;margin-bottom:20px;"><div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Кнопки</label><input type="color" id="color-accent-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div><div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Рамки</label><input type="color" id="color-border-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div><div style="flex:1;"><label style="color:#888;font-size:10px;display:block;margin-bottom:5px;">Фон</label><input type="color" id="color-bg-${modalId}" style="width:100%;height:30px;border:none;padding:0;background:none;cursor:pointer;"></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><button id="btn-save-${modalId}" style="background:#fff;border:none;padding:12px;border-radius:8px;font-weight:bold;cursor:pointer;">Применить</button><button id="btn-cancel-${modalId}" style="background:transparent;border:1px solid #333;color:#888;padding:12px;border-radius:8px;cursor:pointer;">Отмена</button></div></div></div></div>`;
                    document.body.insertAdjacentHTML('beforeend', modalHTML);
                    const hueInp = document.getElementById(`hue-slider-${modalId}`);
                    const satInp = document.getElementById(`sat-slider-${modalId}`);
                    const ligInp = document.getElementById(`lig-slider-${modalId}`);
                    const radInp = document.getElementById(`rad-slider-${modalId}`);
                    const cAccentInp = document.getElementById(`color-accent-${modalId}`);
                    const cBorderInp = document.getElementById(`color-border-${modalId}`);
                    const cBgInp = document.getElementById(`color-bg-${modalId}`);
                    const mNav = document.getElementById(`mock-nav-${modalId}`);
                    const mCard = document.getElementById(`mock-card-${modalId}`);
                    const mAva = document.getElementById(`mock-ava-${modalId}`);
                    const mBtn = document.getElementById(`mock-btn-${modalId}`);
                    const mSave = document.getElementById(`btn-save-${modalId}`);
                    const getAutoBg = (h, s) => hslToRgbLocal(h, s * 0.2, 0.06);
                    const recalcColors = () => {
                    const h = parseInt(hueInp.value) / 360;
                    const s = parseInt(satInp.value) / 100;
                    const l = parseInt(ligInp.value) / 100;

                        cAccentInp.value = hslToRgbLocal(h, s, l);
                        cBorderInp.value = hslToRgbLocal(h, s * 0.7, Math.max(0.2, l - 0.2));
                        cBgInp.value = getAutoBg(h, s);
                        updateMockup();
                    };

                        const updateMockup = () => {
                        const ac = cAccentInp.value;
                        const bo = cBorderInp.value;
                        const bg = cBgInp.value;
                        const rd = radInp.value + 'px';

                        document.getElementById(`hue-text-${modalId}`).innerText = hueInp.value + '°';
                        document.getElementById(`sat-text-${modalId}`).innerText = satInp.value + '%';
                        document.getElementById(`lig-text-${modalId}`).innerText = ligInp.value + '%';
                        document.getElementById(`rad-text-${modalId}`).innerText = rd;

                        mNav.style.background = bg;
                        mNav.style.borderBottomColor = ac;
                        mNav.style.borderRadius = rd;
                        mCard.style.background = `linear-gradient(to bottom, ${bg}, #050505)`;
                        mCard.style.borderColor = bo;
                        mCard.style.boxShadow = `0 0 0 1px ${bo}`;
                        mCard.style.borderRadius = rd;
                        mAva.style.borderColor = ac;
                        mAva.style.boxShadow = `0 0 10px ${ac}`;
                        mBtn.style.background = `linear-gradient(90deg, ${ac}, ${bo})`;
                        mBtn.style.boxShadow = `0 5px 15px ${ac}40`;
                        mBtn.style.borderRadius = rd;
                        mSave.style.background = ac;
                        mSave.style.boxShadow = `0 5px 15px ${ac}40`;
                    };
                    hueInp.addEventListener('input', recalcColors);
                    satInp.addEventListener('input', recalcColors);
                    ligInp.addEventListener('input', recalcColors);
                    radInp.addEventListener('input', updateMockup);
                    cAccentInp.addEventListener('input', updateMockup);
                    cBorderInp.addEventListener('input', updateMockup);
                    cBgInp.addEventListener('input', updateMockup);
                    recalcColors();

                        document.getElementById(`btn-cancel-${modalId}`).onclick = () => {
                        document.getElementById(modalId).remove();
                        saveBtn.textContent = originalBtnText;
                        saveBtn.disabled = false;
                    };

                    document.getElementById(`btn-save-${modalId}`).onclick = async (e) => {
                        e.preventDefault();
                        const finalAccent = cAccentInp.value;
                        const finalBorder = cBorderInp.value;
                        const finalBg = cBgInp.value;
                        const finalRadius = radInp.value + 'px';
                        const [r, g, b] = hexToRgbSimple(finalAccent);
                        const [h, s, l] = rgbToHslLocal(r, g, b);
                        const hShift = (h + 0.03) % 1.0;
                        const lHighlight = Math.min(l + 0.15, 0.85);
                        const lShadow = Math.max(l - 0.05, 0.15);
                        const highlightHex = hslToRgbLocal(h, s, lHighlight);
                        const shadowHex = hslToRgbLocal(hShift, s, lShadow);

                        settingsToUpdate.bgImageDataUri = dataUri;
                        settingsToUpdate.enableGradient = false;
                        settingsToUpdate.bgColor = finalBg;
                        settingsToUpdate.enableEdge = true;
                        settingsToUpdate.edgeColor = finalBorder;
                        settingsToUpdate.enableRounding = true;
                        settingsToUpdate.borderRadius = finalRadius;
                        settingsToUpdate.enableScrollIndicator = true;
                        settingsToUpdate.scrollIndicatorColor = highlightHex;
                        settingsToUpdate.enableAvatarBorder = true;
                        settingsToUpdate.avatarBorderColor1 = highlightHex;
                        settingsToUpdate.avatarBorderColor2 = finalBorder;
                        settingsToUpdate.avatarBorderColor3 = highlightHex;
                        settingsToUpdate.enableOpHighlight = true;
                        settingsToUpdate.opHighlightEdgeColor = finalBorder;
                        settingsToUpdate.opHighlightBgColor = finalBg;
                        settingsToUpdate.enableOwnMessageHighlight = true;
                        settingsToUpdate.ownMessageHighlightEdgeColor = highlightHex;
                        settingsToUpdate.bottomNavTheme = 'nav_theme_custom_dynamic';
                        settingsToUpdate.opacityValue = 0.2;

                        const existingDynStyle = document.getElementById('br-dynamic-gradient-vars');
                        if (existingDynStyle) existingDynStyle.remove();
                        const st = document.createElement('style');
                        st.id = 'br-dynamic-gradient-vars';
                        document.head.appendChild(st);
                        st.textContent = `
                        :root {
                            --br-edge-color: ${finalBorder} !important;
                            --br-bg-color: ${finalBg} !important;
                            --br-nav-main-gradient: linear-gradient(135deg, ${shadowHex} 0%, ${highlightHex} 50%, ${shadowHex} 100%) !important;
                            --br-nav-accent-color: ${highlightHex} !important;
                            --br-nav-border-color: ${finalBorder} !important;
                            --br-primary: ${highlightHex} !important;
                            --br-secondary: ${shadowHex} !important;
                        }
                        @keyframes br-liquid-metal {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                        .button, a.button {
                            background-image: linear-gradient(60deg, ${shadowHex}, ${highlightHex}, ${finalBg}, ${highlightHex}, ${shadowHex}) !important;
                            background-size: 300% 300% !important;
                            animation: br-liquid-metal 4s ease infinite !important;
                            border-color: ${finalBorder} !important;
                            color: #fff !important;
                            text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
                            box-shadow: 0 4px 15px ${shadowHex}66 !important;
                            position: relative !important;
                            z-index: 1;
                            transition: transform 0.2s, box-shadow 0.2s !important;
                        }
                        .button:hover, a.button:hover {
                            transform: translateY(-2px) !important;
                            box-shadow: 0 0 20px ${highlightHex} !important;
                            filter: brightness(1.2);
                        }
                        .p-nav {
                            background: linear-gradient(180deg, ${shadowHex}99 0%, ${finalBg}CC 100%) !important;
                        }
                        `;

                        document.getElementById(modalId).remove();
                        errorOccurred = false;
                        const success = await saveSettings(settingsToUpdate);
                        if (success) {
                            tempSettingsSnapshot = null;
                            applyForumStyles(currentSettings);
                            updateBottomNavBarContent(currentSettings);
                            manageVisualEffects(currentSettings);
                            handleScroll();
                            const bgStatus = settingsPanel.querySelector('#bg-status');
                            if (bgStatus) bgStatus.textContent = "Фон: 🖼️ Изображение (адаптировано)";
                            if (bgFileInput) bgFileInput.value = '';
                            showToast('Настройки успешно сохранены!', 'success');
                            saveBtn.innerHTML = '<i class="fas fa-save"></i><i class="fas fa-check"></i> Сохранено!';
                            saveBtn.classList.add('br-btn-success');
                            saveBtn.style.backgroundColor = '#28a745';
                            setTimeout(() => {
                                saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                                saveBtn.classList.remove('br-btn-success');
                                saveBtn.style.backgroundColor = '';
                                saveBtn.disabled = false;
                            }, 2000);
                        } else {
                            showToast('Ошибка сохранения', 'error');
                            saveBtn.disabled = false;
                        }
                    };
                };
                reader.readAsDataURL(file);
                return;
            } catch (error) {
                showToast(`Ошибка чтения файла: ${error.message}`, 'error');
                errorOccurred = true;
            }
        }
        else {
            settingsToUpdate.bgImageDataUri = currentSettings.bgImageDataUri || '';
        }

        settingsPanel.dataset.presetLoaded = 'false';
        if (!errorOccurred) {
            const success = await saveSettings(settingsToUpdate);
            if (success) {
                tempSettingsSnapshot = null;
                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                        if (input.type === 'checkbox') input.checked = currentSettings[key];
                        else if (input.type === 'range') {
                            let numericValue = (typeof currentSettings[key] === 'string') ? parseFloat(currentSettings[key]) : currentSettings[key];
                            if (isNaN(numericValue)) numericValue = defaultSettings[key];
                            input.value = numericValue;
                        }
                        else input.value = currentSettings[key] ?? '';
                    }
                });
                 settingsPanel.querySelectorAll('input[type="range"]').forEach(updateSliderValue);
                applyForumStyles(currentSettings);
                updateBottomNavBarContent(currentSettings);
                manageVisualEffects(currentSettings);
                handleScroll();

                 if (settingsIcon && bottomNavElement) {
                     if (currentSettings.enableBottomNav) {
                        const utilsContainer = bottomNavElement.querySelector('.br-nav-utilities');
                        if (utilsContainer) {
                            utilsContainer.prepend(settingsIcon);
                        }
                     } else {
                        if (settingsIcon.parentNode !== document.body) {
                            document.body.appendChild(settingsIcon);
                        }
                     }
                 }

                const bgStatus = settingsPanel.querySelector('#bg-status');
                if(bgStatus) {
                    if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
                }
                if (bgFileInput && bgFileInput.files.length > 0) bgFileInput.value = '';

                startLiveForumPollers();

                const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
                if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                    initializeVisibilityFunc();
                }
                const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
                if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                     initializeAnimVisibilityFunc();
                }

                                showToast('Настройки успешно сохранены!', 'success');
                saveBtn.innerHTML = '<i class="fas fa-save"></i><i class="fas fa-check"></i> Сохранено!';
                saveBtn.classList.add('br-btn-success');
                saveBtn.style.backgroundColor = '#28a745';

                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                    saveBtn.classList.remove('br-btn-success');
                    saveBtn.style.backgroundColor = '';
                    saveBtn.disabled = false;
                }, 2000);
            } else {
                showToast('Ошибка сохранения настроек!', 'error');
                saveBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Ошибка!';
                saveBtn.style.backgroundColor = '#dc3545';
                setTimeout(() => {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить';
                    saveBtn.style.backgroundColor = '';
                    saveBtn.disabled = false;
                }, 2000);

            }
        } else {
            saveBtn.textContent = '💾 Сохранить'; saveBtn.disabled = false;
        }
    }


    async function handleClearBg() {
         if (!settingsPanel) return;
         const bgFileInput = settingsPanel.querySelector('#s_bgImageFile');
         if (bgFileInput) bgFileInput.value = '';
         const clearBgBtn = settingsPanel.querySelector('#clear-bg-btn');
         const success = await saveSettings({
             ...currentSettings,
             bgImageDataUri: ''
            });
         if (success) {
             applyForumStyles(currentSettings);
             const bgStatus = settingsPanel.querySelector('#bg-status');
             if(bgStatus) bgStatus.textContent = 'Фон не задан.';
             if (clearBgBtn) {
                clearBgBtn.textContent = '✔️';
                setTimeout(() => { clearBgBtn.textContent = '❌'; }, 1000);
             }
             showToast('Фон очищен.', 'info');
         } else {
             showToast('[BR Style] Не удалось удалить фон. Ошибка сохранения.', 'error');
         }
    }

    function handleExport() {
        try {
            const settingsToExport = { ...defaultSettings, ...currentSettings };
            if (!Array.isArray(settingsToExport.quickLinks)) {
                settingsToExport.quickLinks = defaultSettings.quickLinks;
            }
            if (typeof settingsToExport.customPresets !== 'object' || settingsToExport.customPresets === null) {
                settingsToExport.customPresets = defaultSettings.customPresets;
            }
            const settingsJson = JSON.stringify(settingsToExport, null, 2);
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            downloadFile(`br-style-settings-${timestamp}.json`, settingsJson, 'application/json');
            showToast('Настройки экспортированы!', 'success');
        } catch (e) {
            console.error('[BR Style] Ошибка экспорта настроек ❌:', e);
            showToast('[BR Style] Ошибка при экспорте настроек ❌.', 'error');
        }
    }

    function handleImport(event) {
        if (!settingsPanel) return;
        const file = event.target.files[0];
        if (!file) return;
        showToast('Чтение файла...⏳', 'info');
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedSettings = JSON.parse(e.target.result);
                if (typeof importedSettings !== 'object' || importedSettings === null) throw new Error("Файл не содержит корректный JSON объект.");
                let appliedCount = 0;
                settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                    const key = input.dataset.settingKey;
                    if (key === 'quickLinks' || key === 'customPresets') return;
                    if (importedSettings.hasOwnProperty(key)) {
                        let validatedValue = validateSetting(key, importedSettings[key], defaultSettings[key]);
                        if (input.type === 'checkbox') {
                            input.checked = validatedValue;
                        } else if (input.type === 'range') {
                            let numericValue = (typeof validatedValue === 'string') ? parseFloat(validatedValue) : validatedValue;
                            if (isNaN(numericValue)) numericValue = defaultSettings[key];
                            input.value = numericValue;
                            updateSliderValue(input);
                        } else {
                             input.value = validatedValue;
                        }
                        appliedCount++;
                    }
                });
                const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');
                quickLinksContainer.innerHTML = '';
                const importedLinks = importedSettings.quickLinks;
                if (Array.isArray(importedLinks)) {
                    importedLinks.forEach(link => { if (link && typeof link.name === 'string' && typeof link.url === 'string') addQuickLinkInput(quickLinksContainer, link); });
                } else {
                    (currentSettings.quickLinks || defaultSettings.quickLinks).forEach(link => addQuickLinkInput(quickLinksContainer, link));
                }
                if (importedSettings.hasOwnProperty('customPresets') && typeof importedSettings.customPresets === 'object' && importedSettings.customPresets !== null && !Array.isArray(importedSettings.customPresets)) {
                    const saveBtn = settingsPanel.querySelector('#save-btn');
                   if (saveBtn && !saveBtn.disabled) {
                            currentSettings.customPresets = importedSettings.customPresets;
                            saveSettings({ customPresets: currentSettings.customPresets });
                            populateAllPresetLists();
                        } else {
                            setTimeout(() => {
                                currentSettings.customPresets = importedSettings.customPresets;
                                saveSettings({ customPresets: currentSettings.customPresets });
                                populateAllPresetLists();
                            }, 100);
                        }
                }
                 const bgStatus = settingsPanel.querySelector('#bg-status');
                if (bgStatus) {
                    const importedBgData = importedSettings.bgImageDataUri; const importedGradient = importedSettings.enableGradient; const importedAnimGradient = importedSettings.enableAnimatedGradient; if (importedGradient) { bgStatus.textContent = importedAnimGradient ? 'Фон: (импортирован 🌈 анимированный градиент, нажмите Сохранить)' : 'Фон: (импортирован 🌈 градиент, нажмите Сохранить)'; } else { bgStatus.textContent = importedBgData ? `Фон: (импортирован 🖼️ изображение, нажмите Сохранить)` : 'Фон: (очищен импортом, нажмите Сохранить)'; }
                }
                const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
                if (appliedCount > 0 || (Array.isArray(importedLinks) && importedLinks.length > 0)) {
                    showToast(`✅ Импортировано ${appliedCount} настроек + ссылки. Нажмите '💾 Сохранить'.`, 'success', 4000);
                    const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
                    if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                         initializeVisibilityFunc();
                    }
                    const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
                    if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                         initializeAnimVisibilityFunc();
                    }
                } else {
                    throw new Error("В файле не найдено совместимых настроек.");
                }
            } catch (error) {
                console.error('[BR Style] Ошибка импорта настроек ❌:', error);
                showToast(`❌ Ошибка: ${error.message}`, 'error', 5000);
            } finally {
                event.target.value = null;
            }
        };
        reader.onerror = (e) => {
             console.error('[BR Style] Ошибка чтения файла для импорта:', e); showToast('❌ Ошибка чтения файла.', 'error'); event.target.value = null;
        };
        reader.readAsText(file);
    }

function openPanel() {
        if (!settingsPanel) {
             createPanelHTML();
             if (!settingsPanel) {
                 console.error("[BR Style] Не удалось создать или найти панель после попытки создания.");
                 return;
             }
         }

        const wrapper = document.getElementById('br-panel-wrapper');
        if (!wrapper) return;

        try {
            const themeSelect = settingsPanel.querySelector('#s_bottomNavTheme');
            if (themeSelect && currentSettings.bottomNavTheme === 'nav_theme_custom_dynamic') {
                 let opt = themeSelect.querySelector('option[value="nav_theme_custom_dynamic"]');
                 if (!opt) {
                    opt = document.createElement('option');
                    opt.value = 'nav_theme_custom_dynamic';
                    opt.textContent = '🎨 Адаптированный (Активен)';
                    themeSelect.prepend(opt);
                }
                opt.style.display = 'block';
            }

            settingsPanel.querySelectorAll('[data-setting-key]').forEach(input => {
                const key = input.dataset.settingKey;
                if (currentSettings.hasOwnProperty(key) && key !== 'quickLinks' && key !== 'customPresets') {
                    if (input.type === 'checkbox') { input.checked = currentSettings[key]; }
                    else if (input.type === 'range') {
                        let numericValue = (typeof currentSettings[key] === 'string') ? parseFloat(currentSettings[key]) : currentSettings[key];
                        if (isNaN(numericValue)) numericValue = defaultSettings[key];
                        input.value = numericValue;
                        updateSliderValue(input);
                    }
                    else { input.value = currentSettings[key] ?? ''; }
                }
            });
            const quickLinksContainer = settingsPanel.querySelector('#quick-links-container');
            if (quickLinksContainer) {
                quickLinksContainer.innerHTML = '';
               if (Array.isArray(currentSettings.quickLinks)) {
                    currentSettings.quickLinks.forEach(link => addQuickLinkInput(quickLinksContainer, link));
                }
            }
            populateAllPresetLists();
            loadUploadHistory();
            const bgStatus = settingsPanel.querySelector('#bg-status');
            if(bgStatus) {
                if (currentSettings.enableGradient) { bgStatus.textContent = currentSettings.enableAnimatedGradient ? 'Фон: 🌈 Анимированный градиент' : 'Фон: 🌈 Градиент'; } else { bgStatus.textContent = currentSettings.bgImageDataUri ? `Фон: 🖼️ Изображение задано` : 'Фон не задан.'; }
            }
            const bgFileInput = settingsPanel.querySelector('#s_bgImageFile'); if(bgFileInput) bgFileInput.value = '';
            const usernameStatus = settingsPanel.querySelector('#my-username-status');
            if(usernameStatus) {
                usernameStatus.textContent = myUsername ? `Ваш ник: ${myUsername}` : 'Ваш ник: (не найден)';
            }
             const initializeVisibilityFunc = settingsPanel.querySelector('#s_effectType')?.brInitializeVisibility;
             if (initializeVisibilityFunc && typeof initializeVisibilityFunc === 'function') {
                initializeVisibilityFunc();
             }
             const initializeAnimVisibilityFunc = settingsPanel.querySelector('#s_enableAvatarBorder')?.brInitializeVisibility;
             if (initializeAnimVisibilityFunc && typeof initializeAnimVisibilityFunc === 'function') {
                 initializeAnimVisibilityFunc();
             }

            settingsPanel.dataset.view = 'hub';
            if (wrapper) wrapper.dataset.theme = currentSettings.panelTheme;

            const bottomNav = document.getElementById(BOTTOM_NAV_ID);
            if (bottomNav) bottomNav.classList.add('br-nav-force-hidden');

            wrapper.style.display = 'flex';
            wrapper.style.opacity = '0';
            settingsPanel.style.opacity = '0';
            settingsPanel.style.transform = 'translateY(50px)';
            setTimeout(() => {
                wrapper.style.opacity = '1';
                settingsPanel.style.opacity = '1';
                settingsPanel.style.transform = 'translateY(0)';
            }, 10);

        } catch (e) {
            console.error('[BR Style] Ошибка при открытии или заполнении панели настроек ❌', e);
            if (wrapper) wrapper.style.display = 'none';
        }
    }
function closePanel() {
        const wrapper = document.getElementById('br-panel-wrapper');
        if (wrapper && settingsPanel) {

            const bottomNav = document.getElementById(BOTTOM_NAV_ID);
            if (bottomNav) bottomNav.classList.remove('br-nav-force-hidden');

            wrapper.style.opacity = '0';
            settingsPanel.style.opacity = '0';
            settingsPanel.style.transform = 'translateY(50px)';

            setTimeout(() => {
                wrapper.style.display = 'none';
            }, 300);
        }
    }
    function togglePanel() {
        const wrapper = document.getElementById('br-panel-wrapper');
        if (!wrapper || wrapper.style.display === 'none') {
            openPanel();
        } else {
            closePanel();
        }
    }

function createBottomNavBarElement() {
    if (document.getElementById(BOTTOM_NAV_ID)) {
        bottomNavElement = document.getElementById(BOTTOM_NAV_ID);
        return;
    }
    try {
        bottomNavElement = document.createElement('nav');
        bottomNavElement.id = BOTTOM_NAV_ID;
        bottomNavElement.innerHTML = `
            <div class="br-nav-utilities"></div>
            <div id="br-style-nav-links" class="br-nav-links"></div>
        `;
        document.body.appendChild(bottomNavElement);
    } catch (e) {
        console.error('[BR BottomNav] Error', e);
    }
}

function updateBottomNavBarContent(settings) {
    if (!bottomNavElement) {
        createBottomNavBarElement();
        if (!bottomNavElement) return;
    }
    try {
        const linksContainer = bottomNavElement.querySelector('#br-style-nav-links');
        if (linksContainer) {
            linksContainer.innerHTML = '';
            const currentHref = window.location.href.replace(/\/$/, "");

            if (Array.isArray(settings.quickLinks)) {
                let validLinksCount = 0;
                settings.quickLinks.forEach((link, index) => {
                    if (link.name?.trim() && link.url?.trim()) {
                        const a = document.createElement('a');
                        const rawUrl = link.url.trim().replace(/\/$/, "");
                        a.href = link.url.trim();
                        a.className = 'br-nav-link-item';
                        a.textContent = link.name.trim();

                        a.style.setProperty('--i', validLinksCount);
                        validLinksCount++;

                        let isActive = false;
                        if (rawUrl === 'https://forum.blackrussia.online') {
                            if (currentHref === rawUrl || currentHref === rawUrl + '/index.php') {
                                isActive = true;
                            }
                        } else {
                            if (currentHref.includes(rawUrl)) {
                                isActive = true;
                            }
                        }

                        if (isActive) {
                            a.classList.add('br-nav-link-active');
                        }

                        a.addEventListener('click', (e) => {
                            if (navigator.vibrate) navigator.vibrate(5);
                        });

                        linksContainer.appendChild(a);
                    }
                });
            }
        }
    } catch (e) {
        console.error('[BR BottomNav] Error', e);
    }
}

    function createBackgroundElement() {
        if (document.getElementById(BACKGROUND_ELEMENT_ID)) { return; }
        try {
            const bgElement = document.createElement('div');
            bgElement.id = BACKGROUND_ELEMENT_ID;
            document.body.insertBefore(bgElement, document.body.firstChild);
        } catch (e) {
            console.error('[BR Style] Ошибка создания элемента фона ❌', e);
        }
    }

     function addSettingsIconHTML() {
         if (document.getElementById(STYLE_ICON_ID)) { settingsIcon = document.getElementById(STYLE_ICON_ID); }
         else if (document.body) {
             try {
                 settingsIcon = document.createElement('div'); settingsIcon.id = STYLE_ICON_ID; settingsIcon.title = 'Открыть/Закрыть настройки стиля BR Forum (🎨)'; settingsIcon.innerHTML = '<i class="fas fa-palette"></i>';
                 document.body.appendChild(settingsIcon); settingsIcon.addEventListener('click', togglePanel);
             } catch (e) { console.error('[BR Style] Ошибка добавления иконки настроек ❌', e); }
         } else { console.error('[BR Style] Тег body еще не доступен для добавления иконки ❌'); }
     }

    function createScrollIndicatorElement() {
        if (document.getElementById(SCROLL_INDICATOR_ID)) {
            scrollIndicatorElement = document.getElementById(SCROLL_INDICATOR_ID);
            return;
        }
        try {
            scrollIndicatorElement = document.createElement('div');
            scrollIndicatorElement.id = SCROLL_INDICATOR_ID;
            document.body.appendChild(scrollIndicatorElement);
        } catch (e) {
            console.error('[BR Style] Ошибка создания индикатора прокрутки!', e);
        }
    }

    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                performScrollLogic();
                ticking = false;
            });
            ticking = true;
        }
    }

    function performScrollLogic() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollHeight > 0) ? (scrollTop / scrollHeight) * 100 : 0;

    if (scrollIndicatorElement && currentSettings.enableScrollIndicator) {
        scrollIndicatorElement.style.transform = `scaleX(${scrollPercent / 100})`;
        scrollIndicatorElement.style.display = 'block';
    } else if (scrollIndicatorElement) {
        scrollIndicatorElement.style.display = 'none';
    }

    if (currentSettings.enableSmartNav) {
        const nav = document.querySelector('.p-navSticky');
        const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        if (nav && isFirefox) {
            if (scrollTop > lastScrollTop && scrollTop > nav.offsetHeight) {
                nav.style.transform = `translateY(-100%)`;
            } else {
                nav.style.transform = `translateY(0)`;
            }
            nav.style.transition = 'transform 0.3s ease-out';
        }
    }

    if (bottomNavElement && currentSettings.enableBottomNav) {
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            bottomNavElement.classList.add('br-bottom-nav-hidden');
        } else {
            bottomNavElement.classList.remove('br-bottom-nav-hidden');
        }
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}

function setupScrollObserver(settings) {
    if (scrollObserver) {
        scrollObserver.disconnect();
        scrollObserver = null;
    }

    const selectors = '.structItem, .message, .block-row, .node, .block, .contentRow';
    const elements = document.querySelectorAll(selectors);
    const isBackNavigation = (window.performance &&
                             (window.performance.navigation.type === 2 ||
                              window.performance.getEntriesByType?.("navigation")[0]?.type === "back_forward"));

    if (isBackNavigation || !settings.enableScrollFadeIn || elements.length > 30) {
        requestAnimationFrame(() => {
            elements.forEach(el => {
                el.classList.add('br-anim-no-anim', 'br-is-visible');
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                requestAnimationFrame(() => {
                    el.classList.add('br-is-visible');
                    el.style.willChange = 'auto';
                });
                observer.unobserve(el);
            }
        });
    };

    scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    const fragment = document.createDocumentFragment();
    elements.forEach(el => {
        if (!el.classList.contains('br-anim-scroll') && !el.closest('.br-panel-body') && !el.closest('.offCanvasMenu') && !el.closest('.menu-content')) {
            el.classList.add('br-anim-scroll');
            el.style.willChange = 'opacity, transform';
            scrollObserver.observe(el);
        }
    });
}

const debouncedRunComplaintTracker = debounce(runComplaintTracker, 300);
const debouncedFindAndAttachUploader = debounce(findAndAttachUploader, 300);
const debouncedRunStatsAndPreview = debounce(runStatsAndPreview, 300);

function observeNewNodes(mutationsList) {
    if (document.getElementById('br-skeleton-layer') && !document.getElementById('br-skeleton-layer').classList.contains('br-skeleton-fade-out')) {
        return;
    }

    let addedNodes = false;
    let relevantUploaderNode = false;
    const animSelectors = '.structItem, .message, .block-row, .node, .block, .contentRow';
    const nodesToAnimate = [];

    for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                     if (node.classList.contains('br-stats-dashboard') || node.id === 'br-capsule-container' || node.dataset.brProcessed) continue;
                     
                     node.dataset.brProcessed = 'true';
                     addedNodes = true;
                     
                 if (currentSettings.enableScrollFadeIn) {
                         if (node.matches(animSelectors) && !node.classList.contains('br-is-visible') && !node.closest('.offCanvasMenu') && !node.closest('.menu-content')) nodesToAnimate.push(node);
                         const children = node.querySelectorAll(animSelectors);
                         if(children.length > 0) {
                             children.forEach(child => {
                                 if (!child.dataset.brProcessed && !child.classList.contains('br-is-visible') && !child.closest('.offCanvasMenu') && !child.closest('.menu-content')) {
                                     child.dataset.brProcessed = 'true';
                                     nodesToAnimate.push(child);
                                 }
                             });
                         }
                     }

                     if (node.matches('.js-quickReply') || node.querySelector('.js-quickReply') || node.matches('textarea[name="message"]')) {
                        relevantUploaderNode = true;
                    }
                }
            }
        }
    }

    if (nodesToAnimate.length > 0) {
        const isBulkLoad = nodesToAnimate.length > 15;
        
        requestAnimationFrame(() => {
            nodesToAnimate.forEach(el => {
                if (isBulkLoad) {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                    el.classList.add('br-is-visible', 'br-anim-no-anim');
                } else {
                    if (!el.classList.contains('br-is-visible')) {
                        el.classList.add('br-anim-scroll', `br-anim-${currentSettings.scrollFadeInType}`);
                        if(scrollObserver) scrollObserver.observe(el);
                    }
                }
            });
        });
    }

    if (addedNodes) {
        debouncedRunComplaintTracker();
        debouncedRunStatsAndPreview();
    }

    if (relevantUploaderNode) {
        debouncedFindAndAttachUploader();
    }
}

    function showWelcomeScreen() {
        if (document.getElementById(WELCOME_SCREEN_ID)) return;

        const overlay = document.createElement('div');
        overlay.id = WELCOME_SCREEN_ID;

        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap');

            #${WELCOME_SCREEN_ID} {
                position: fixed; inset: 0; z-index: 99999;
                background: #000;
                display: flex; align-items: center; justify-content: center;
                opacity: 0; transition: opacity 0.5s ease;
                font-family: 'Manrope', sans-serif;
                padding: 10px;
            }
            .br-welcome-visible #${WELCOME_SCREEN_ID} { opacity: 1; }

            .br-card-premium {
                width: 100%; max-width: 850px; height: 85vh; max-height: 800px;
                background: #09090b;
                border: 1px solid #222;
                border-radius: 24px;
                box-shadow: 0 0 100px rgba(0, 240, 255, 0.05);
                display: flex; flex-direction: column; overflow: hidden;
                transform: scale(0.95); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                position: relative;
            }
            .br-welcome-visible .br-card-premium { transform: scale(1); }

            .br-step { display: none; height: 100%; flex-direction: column; }
            .br-step.active { display: flex; animation: br-fade-in-panel 0.5s ease forwards; }
            @keyframes br-fade-in-panel { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }

            .br-content-scroll {
                overflow-y: auto;
                flex-grow: 1;
                padding: 0;
                scrollbar-width: thin;
                scrollbar-color: #333 #09090b;
            }
            .br-content-scroll::-webkit-scrollbar { width: 6px; }
            .br-content-scroll::-webkit-scrollbar-track { background: #09090b; }
            .br-content-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

            .br-hero {
                padding: 50px 30px;
                text-align: center;
                background: linear-gradient(135deg, #0f172a, #000);
                position: relative;
                overflow: hidden;
                border-bottom: 1px solid #222;
            }
            .br-hero::before {
                content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background: radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15), transparent 70%);
                animation: br-pulse-hero 4s ease-in-out infinite;
            }
            @keyframes br-pulse-hero { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }

            .br-logo-large {
                width: 80px; height: 80px; margin: 0 auto 20px;
                background: linear-gradient(45deg, #fff, #999);
                border-radius: 24px; display: flex; align-items: center; justify-content: center;
                font-size: 36px; color: #000; position: relative; z-index: 2;
                box-shadow: 0 10px 30px rgba(255,255,255,0.2);
            }
            .br-title { font-size: 36px; font-weight: 800; color: #fff; margin-bottom: 10px; position: relative; z-index: 2; letter-spacing: -1px; }
            .br-desc { font-size: 16px; color: #94a3b8; max-width: 600px; margin: 0 auto; position: relative; z-index: 2; line-height: 1.6; }

            .br-features { padding: 30px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            @media (max-width: 650px) { .br-features { grid-template-columns: 1fr; } }

            .br-feat-card {
                background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
                border-radius: 16px; padding: 20px; display: flex; align-items: center; gap: 15px;
                transition: 0.3s; opacity: 0; animation: br-slide-up 0.5s ease forwards;
            }
            .br-feat-card:nth-child(1) { animation-delay: 0.1s; }
            .br-feat-card:nth-child(2) { animation-delay: 0.2s; }
            .br-feat-card:nth-child(3) { animation-delay: 0.3s; }
            .br-feat-card:nth-child(4) { animation-delay: 0.4s; }

            @keyframes br-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

            .br-feat-card:hover { background: rgba(255,255,255,0.07); transform: translateY(-5px); border-color: rgba(255,255,255,0.2); }
            .br-feat-icon {
                width: 44px; height: 44px; background: #1e1e24; border-radius: 12px;
                display: flex; align-items: center; justify-content: center; font-size: 20px;
                flex-shrink: 0; border: 1px solid #333;
            }
            .br-feat-info h4 { color: #fff; margin: 0 0 3px 0; font-size: 15px; }
            .br-feat-info p { color: #888; margin: 0; font-size: 12px; }

            .br-bottom-bar {
                padding: 20px 30px; border-top: 1px solid #222; background: #09090b;
                display: flex; justify-content: space-between; align-items: center;
            }

            .br-btn-primary {
                background: #fff; color: #000; font-weight: 800; padding: 14px 28px;
                border-radius: 12px; border: none; cursor: pointer; font-size: 14px;
                text-transform: uppercase; letter-spacing: 1px; transition: 0.3s;
                box-shadow: 0 5px 20px rgba(255,255,255,0.1); width: 100%;
            }
            .br-btn-primary:hover { background: #e2e2e2; transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255,255,255,0.2); }

            .br-wall-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 15px; padding: 30px;
            }
            .br-wall-item {
                aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; position: relative;
                cursor: pointer; border: 2px solid transparent; transition: 0.3s; background: #000;
            }
            .br-wall-item img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; transition: 0.5s; }
            .br-wall-item:hover { border-color: #fff; transform: scale(1.05); z-index: 2; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
            .br-wall-item:hover img { opacity: 1; transform: scale(1.1); }

            .br-loading {
                position: absolute; inset: 0; background: rgba(0,0,0,0.8);
                display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 10px;
                color: #fff; font-weight: bold; opacity: 0; pointer-events: none; transition: 0.3s;
                backdrop-filter: blur(5px);
            }
            .br-wall-item.processing .br-loading { opacity: 1; }

            .br-btn-ghost {
                background: transparent; border: 1px solid #333; color: #666;
                padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 12px;
            }
            .br-btn-ghost:hover { color: #fff; border-color: #fff; }
        `;
        overlay.appendChild(style);

        const wallpapers = [
            "https://i.postimg.cc/v8Wh541G/81864c6e79ccb4ce4a61616c32bc9b9b.jpg",
            "https://i.postimg.cc/q7xB8XTr/2c551281768273ba1943ddb478cc21f5.jpg",
            "https://i.postimg.cc/263pV4jh/ed7156aa98be62e2053617ead1f5ff01.jpg",
            "https://i.postimg.cc/vHysvx3j/6e9abc17f5a16771b6e2fd5e71e0bd53.jpg",
            "https://i.postimg.cc/Pqp9HdS0/3407a720ee8913a6c437fd01e72705a2.jpg",
            "https://i.postimg.cc/L8qNYNjK/7305daf23ec1133d168742fcc7158254.jpg",
            "https://i.postimg.cc/kgxRpSmQ/fc76767ee48cc857170c4d8f3466bbb5.jpg",
            "https://i.postimg.cc/KYh7MCcV/74137379fd5a0682d5eb83ad21cbfe69.jpg"
        ];

        let wallHtml = '';
        wallpapers.forEach(url => {
            wallHtml += `<div class="br-wall-item" data-url="${url}"><img src="${url}"><div class="br-loading"><i class="fas fa-magic fa-spin"></i><span>Настройка...</span></div></div>`;
        });

        overlay.innerHTML += `
            <div class="br-card-premium">

                <div class="br-step active" id="br-step-welcome">
                    <div class="br-content-scroll">
                        <div class="br-hero">
                            <div class="br-logo-large"><i class="fas fa-cube"></i></div>
                            <div class="br-title">Black Russia Style</div>
                            <div class="br-desc">
                                Добро пожаловать в новую эру дизайна. Умная адаптация, живые эффекты и инструменты для комфортной игры.
                            </div>
                        </div>
                        <div class="br-features">
                            <div class="br-feat-card">
                                <div class="br-feat-icon" style="color:#00F0FF"><i class="fas fa-palette"></i></div>
                                <div class="br-feat-info"><h4>Умный Цвет</h4><p>Скрипт сам подберет цвета под ваши обои.</p></div>
                            </div>
                            <div class="br-feat-card">
                                <div class="br-feat-icon" style="color:#FF00DE"><i class="fas fa-photo-video"></i></div>
                                <div class="br-feat-info"><h4>Живые Обои</h4><p>Снег, дождь, сакура и неоновые эффекты.</p></div>
                            </div>
                            <div class="br-feat-card">
                                <div class="br-feat-icon" style="color:#FFD700"><i class="fas fa-user-shield"></i></div>
                                <div class="br-feat-info"><h4>Для Лидеров</h4><p>Биндер, статистика и контроль жалоб.</p></div>
                            </div>
                            <div class="br-feat-card">
                                <div class="br-feat-icon" style="color:#00C853"><i class="fas fa-mobile-alt"></i></div>
                                <div class="br-feat-info"><h4>Оптимизация</h4><p>Идеальная работа на телефоне и ПК.</p></div>
                            </div>
                        </div>
                    </div>
                    <div class="br-bottom-bar">
                        <button class="br-btn-primary" id="br-go-next">Выбрать оформление</button>
                    </div>
                </div>

                <div class="br-step" id="br-step-wallpapers">
                    <div class="br-hero" style="padding: 30px 20px;">
                        <div class="br-title" style="font-size: 24px;">Выберите стиль</div>
                        <div class="br-desc" style="font-size: 14px;">Нажмите на любую картинку. Скрипт скачает её и покрасит форум в подходящие цвета.</div>
                    </div>
                    <div class="br-content-scroll">
                        <div class="br-wall-grid">${wallHtml}</div>
                    </div>
                    <div class="br-bottom-bar" style="justify-content: center;">
                        <button class="br-btn-ghost" id="br-skip-all">Пропустить (Оставить как есть)</button>
                    </div>
                </div>

            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => document.body.classList.add('br-welcome-visible'));

        overlay.querySelector('#br-go-next').onclick = () => {
            overlay.querySelector('#br-step-welcome').classList.remove('active');
            overlay.querySelector('#br-step-wallpapers').classList.add('active');
        };

        const close = () => {
            document.body.classList.remove('br-welcome-visible');
            setTimeout(() => overlay.remove(), 500);
        };
        overlay.querySelector('#br-skip-all').onclick = close;

        overlay.querySelectorAll('.br-wall-item').forEach(item => {
            item.onclick = () => {
                const url = item.dataset.url;
                item.classList.add('processing');

                GM_xmlhttpRequest({
                    method: "GET", url: url, responseType: "blob",
                    onload: function(response) {
                        const blob = response.response;
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            const dataUri = reader.result;
                            const imgObj = new Image();
                            imgObj.src = dataUri;
                            imgObj.onload = async function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 50; canvas.height = 50;
    ctx.drawImage(imgObj, 0, 0, 50, 50);
    const data = ctx.getImageData(0, 0, 50, 50).data;

    let r = 0, g = 0, b = 0, count = 0;
for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
}
if (count > 0) {
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);
} else {
    r = 40; g = 40; b = 40;
}


    let [h, s, l] = rgbToHslLocal(r, g, b);

    s = Math.max(s, 0.25);
    l = Math.max(0.20, Math.min(l, 0.65));

    const baseHex = hslToRgbLocal(h, s, l);
    const hShift = (h + 0.03) % 1.0;
    const lHighlight = Math.min(l + 0.15, 0.85);
    const lShadow = Math.max(l - 0.05, 0.15);
    const highlightHex = hslToRgbLocal(h, s, lHighlight);
    const shadowHex = hslToRgbLocal(hShift, s, lShadow);
    const accentHex = hslToRgbLocal(h, Math.min(s + 0.2, 1), Math.min(l + 0.1, 0.8));
    const newSettings = {
        ...currentSettings,
        bgImageDataUri: dataUri,
        enableGradient: false,
        bgColor: baseHex,
        enableEdge: true,
        edgeColor: highlightHex,
        enableRounding: true,
        borderRadius: '12px',
        bottomNavTheme: 'nav_theme_custom_dynamic',
        opacityValue: 0.05,
        enableScrollIndicator: true,
        scrollIndicatorColor: highlightHex,
        enableAvatarBorder: true,
        avatarBorderColor1: highlightHex,
        avatarBorderColor2: shadowHex,
        avatarBorderColor3: highlightHex,
        enableOpHighlight: true,
        opHighlightEdgeColor: highlightHex,
        opHighlightBgColor: baseHex,
        enableOwnMessageHighlight: true,
        ownMessageHighlightEdgeColor: highlightHex
    };

    const st = document.getElementById('br-dynamic-gradient-vars') || document.createElement('style');
    st.id = 'br-dynamic-gradient-vars';
    if (!st.parentNode) document.head.appendChild(st);
    st.textContent = `
    :root {
        --br-edge-color: ${highlightHex} !important;
        --br-bg-color: ${baseHex} !important;
        --br-nav-main-gradient: linear-gradient(135deg, ${shadowHex} 0%, ${highlightHex} 50%, ${shadowHex} 100%) !important;
        --br-nav-accent-color: ${highlightHex} !important;
        --br-nav-border-color: ${highlightHex} !important;
        --br-primary: ${highlightHex} !important;
        --br-secondary: ${shadowHex} !important;
    }
    @keyframes br-liquid-metal {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    .button, a.button {
        background-image: linear-gradient(60deg, ${shadowHex}, ${highlightHex}, ${baseHex}, ${highlightHex}, ${shadowHex}) !important;
        background-size: 300% 300% !important;
        animation: br-liquid-metal 4s ease infinite !important;
        border-color: ${highlightHex} !important;
        color: #fff !important;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5) !important;
        box-shadow: 0 4px 15px ${shadowHex}66 !important;
        position: relative !important;
        z-index: 1;
        transition: transform 0.2s, box-shadow 0.2s !important;
    }
    .button:hover, a.button:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 0 20px ${highlightHex} !important;
        filter: brightness(1.2);
    }
    .p-nav {
        background: linear-gradient(180deg, ${shadowHex}99 0%, ${baseHex}CC 100%) !important;
    }
`;

    await saveSettings(newSettings);
    applyForumStyles(newSettings);
    updateBottomNavBarContent(newSettings);
    showToast('✅ Успешно! Стиль адаптирован.', 'success');
    close();
};
                        };
                        reader.readAsDataURL(blob);
                    }
                });
            };
        });
    }

    let particleMouseMoveHandler = null;
    function manageVisualEffects(settings) {
        if (particleMouseMoveHandler) {
            document.removeEventListener('mousemove', particleMouseMoveHandler);
            particleMouseMoveHandler = null;
        }

        if (!document.getElementById('br-effects-css-fixed')) {
            const css = document.createElement('style');
            css.id = 'br-effects-css-fixed';
            css.textContent = `
                .br-particle {
                    position: fixed; top: -10vh; z-index: 99999; pointer-events: none;
                    will-change: transform, opacity;
                    animation-iteration-count: infinite !important;
                    animation-timing-function: linear !important;
                }
                @keyframes fall-straight { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { transform: translateY(120vh); opacity: 0; } }
                @keyframes fall-sway {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                    20% { opacity: 1; transform: translate(20px, 20vh) rotate(45deg); }
                    40% { transform: translate(-20px, 40vh) rotate(90deg); }
                    60% { transform: translate(20px, 60vh) rotate(135deg); }
                    80% { opacity: 1; }
                    100% { transform: translate(0, 120vh) rotate(180deg); opacity: 0; }
                }
                @keyframes fall-leaf { 0% { transform: translate(0, 0) rotate(0deg); opacity: 0; } 10% { opacity: 1; } 100% { transform: translate(calc(100px * var(--sway-dir)), 120vh) rotate(720deg); opacity: 0; } }
                @keyframes wandering-firefly { 0% { transform: translate(0, 0) scale(1); opacity: 0; } 20% { opacity: 1; } 50% { transform: translate(calc(50px * var(--sway-dir)), -50px) scale(1.2); } 80% { opacity: 0.8; } 100% { transform: translate(calc(-50px * var(--sway-dir)), 50px) scale(1); opacity: 0; } }
                @keyframes rise-bubble { 0% { transform: translateY(110vh) scale(0.5); opacity: 0; } 20% { opacity: 0.8; } 100% { transform: translateY(-10vh) scale(1.5); opacity: 0; } }
            `;
            document.head.appendChild(css);
        }

        if (!effectsContainer) {
            effectsContainer = document.getElementById(EFFECTS_CONTAINER_ID);
            if (!effectsContainer) {
                if (!document.body) return;
                effectsContainer = document.createElement('div');
                effectsContainer.id = EFFECTS_CONTAINER_ID;
                document.body.appendChild(effectsContainer);
            }
        }

        effectsContainer.innerHTML = '';
effectsContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9000; overflow: hidden; display: block;';

if (!effectsContainer.dataset.hasVisibilityListener) {
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) effectsContainer.style.display = 'none';
        else if (effectsContainer.dataset.active === 'true') effectsContainer.style.display = 'block';
    });
    effectsContainer.dataset.hasVisibilityListener = 'true';
}
effectsContainer.dataset.active = (settings.effectType !== 'none').toString();

if (!isValidEffectType(settings.effectType) || settings.effectType === 'none') {
            effectsContainer.style.display = 'none';
            return;
        }

        const intensity = Math.max(10, Math.min(300, settings.effectIntensity || 50));
        const speedMultiplier = Math.max(0.1, Math.min(5, settings.effectSpeed || 1));
        const rainLength = Math.max(5, Math.min(50, settings.effectRainLength || 20));
        const baseDuration = 15;

        for (let i = 0; i < intensity; i++) {
            const particle = document.createElement('div');
            particle.className = 'br-particle';
            let animDuration = (getRandomInRange(baseDuration - 5, baseDuration + 5)) / speedMultiplier;
            const animDelay = getRandomInRange(-20, 20);
            const initialLeft = getRandomInRange(0, 100);
            const initialOpacity = getRandomInRange(0.4, 0.9);
            const swayDirection = Math.random() < 0.5 ? -1 : 1;

            particle.style.left = `${initialLeft}%`;
            particle.style.opacity = initialOpacity;
            particle.style.setProperty('--sway-dir', swayDirection);
            particle.style.animationDelay = `${animDelay}s`;
            particle.style.animationDuration = `${animDuration}s`;

            let particleType = settings.effectType;
            let particleClass = particleType.split('-')[0];
            particle.classList.add(particleClass);

            switch (particleType) {
                case 'rain':
                    particle.style.width = `${getRandomInRange(1, 2)}px`;
                    particle.style.height = `${rainLength}px`;
                    particle.style.background = `linear-gradient(to bottom, transparent, rgba(173, 216, 230, 0.8))`;
                    particle.style.animationName = 'fall-straight';
                    particle.style.animationDuration = `${animDuration * 0.15}s`;
                    break;
               case 'snow':
                    const snowSize = getRandomInRange(10, 22);
                    particle.style.width = `${snowSize}px`;
                    particle.style.height = `${snowSize}px`;
                    const snowflakes = [
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 2L14 8L21 9L15 14L17 21L12 17L7 21L9 14L3 9L10 8L12 2Z'/%3E%3C/svg%3E",
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3E%3Cpath d='M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07'/%3E%3C/svg%3E",
                        "data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512' style='fill:white;'%3E%3Cpath d='M512,256l-96-32l96-32v-64l-64,64l-32-96h-64l32,96L256,0l-128,192l32-96H96L64,192L0,128v64l96,32 L0,256l96,32l-96,32v64l64-64l32,96h64l-32-96l128,192l128-192l-32,96h64l32-96l64,64v-64l-96-32L512,256z'/%3E%3C/svg%3E"
                    ];
                    particle.style.backgroundImage = `url("${snowflakes[Math.floor(Math.random() * snowflakes.length)]}")`;
                    particle.style.backgroundSize = 'contain';
                    particle.style.backgroundRepeat = 'no-repeat';
                    particle.style.opacity = getRandomInRange(0.3, 0.95);
                    particle.style.animationName = 'fall-sway';
                    break;
                case 'petals-sakura': case 'petals-red_rose': case 'leaves-autumn_maple':
                    const imgKey = particleType.split('-')[1];
                    const imgUri = PETAL_IMAGES[imgKey];
                    if (!imgUri) continue;
                    const size = getRandomInRange(12, 20);
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.backgroundImage = `url('${imgUri}')`;
                    particle.style.backgroundSize = 'contain';
                    particle.style.backgroundRepeat = 'no-repeat';
                    particle.style.animationName = (particleClass === 'leaves') ? 'fall-leaf' : 'fall-sway';
                    if(particleClass === 'leaves') animDuration *= 0.8;
                    break;
                case 'fireflies':
                    const ffSize = getRandomInRange(2, 4);
                    particle.style.width = `${ffSize}px`;
                    particle.style.height = `${ffSize}px`;
                    particle.style.background = '#fff700';
                    particle.style.borderRadius = '50%';
                    particle.style.boxShadow = `0 0 10px #fff700, 0 0 20px #ff9900`;
                    particle.style.top = `${getRandomInRange(10, 90)}vh`;
                    particle.style.animationName = 'wandering-firefly';
                    particle.style.animationDuration = `${getRandomInRange(5, 10)}s`;
                    break;
                case 'matrix':
                    particle.textContent = MATRIX_CHARS.charAt(getRandomIntInRange(0, MATRIX_CHARS.length - 1));
                    particle.style.fontFamily = "monospace";
                    particle.style.color = '#0F0';
                    particle.style.textShadow = '0 0 5px #0F0';
                    particle.style.fontSize = `${getRandomInRange(12, 20)}px`;
                    particle.style.animationName = 'fall-straight';
                    particle.style.animationDuration = `${animDuration * 0.5}s`;
                    break;
                case 'bubbles':
                    const bubSize = getRandomInRange(5, 15);
                    particle.style.width = `${bubSize}px`;
                    particle.style.height = `${bubSize}px`;
                    particle.style.background = `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0.2) 100%)`;
                    particle.style.border = `1px solid rgba(255, 255, 255, 0.3)`;
                    particle.style.borderRadius = '50%';
                    particle.style.boxShadow = `inset 0 0 5px rgba(255,255,255,0.1)`;
                    particle.style.top = 'auto';
                    particle.style.bottom = '-20px';
                    particle.style.animationName = 'rise-bubble';
                    break;
            }
            effectsContainer.appendChild(particle);
        }

        if (settings.enableInteractiveParticles) {
            particleMouseMoveHandler = throttle((e) => {
                const x = e.clientX;
                const y = e.clientY;
                const particles = effectsContainer.querySelectorAll('.br-particle');
                particles.forEach(p => {
                    const rect = p.getBoundingClientRect();
                    const dx = rect.left - x;
                    const dy = rect.top - y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const angle = Math.atan2(dy, dx);
                        const force = (150 - dist) / 150;
                        const moveX = Math.cos(angle) * force * 50;
                        const moveY = Math.sin(angle) * force * 50;
                        p.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    }
                });
            }, 50);
            document.addEventListener('mousemove', particleMouseMoveHandler, { passive: true });
        }
    }

    function injectStaticStyles() {
        const staticStyleId = STYLE_ID + '-static';
        if (document.getElementById(staticStyleId)) { return; }
        try {
            let staticCss = `

.br-gallery-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-bottom: 20px;
}
.br-gallery-category-title {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 10px 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 5px;
}
.br-gallery-category-title::before {
    content: ' ';
    display: block;
    width: 3px;
    height: 12px;
    background: var(--br-primary, #D59D80);
    margin-right: 8px;
    border-radius: 2px;
}

            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
:root {
                --br-bg-dark: #09090b;
                --br-bg-panel: rgba(20, 20, 25, 0.6);
                --br-text-main: #b3e5fc;
                --br-text-muted: #81d4fa;
                --br-border: rgba(255, 255, 255, 0.08);
                --br-radius: 12px;
}

            .br-noise-bg { position: relative; overflow: hidden; }
            .br-noise-bg::before {
                content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                opacity: 0.04; pointer-events: none; z-index: 0;
                background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            }

            .br-spotlight { position: relative; overflow: hidden; background: var(--br-bg-panel); }
            .br-spotlight::after {
                content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                background: radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.08), transparent 40%);
                z-index: 1; pointer-events: none; opacity: 0; transition: opacity 0.5s;
            }
            .br-spotlight:hover::after { opacity: 1; }

       #blackrussia-settings-panel, .br-modal-window, .br-toast, .br-bottom-nav-bar { font-family: var(--br-font-family, 'Manrope', sans-serif) !important;
letter-spacing: 0.02em; }

            @keyframes br-morph {
                0% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
                50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
                100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
            }


@keyframes br-morph-box {
            0% { border-radius: 20px 70px 30px 60px / 60px 40px 50px 70px;
}
            50% { border-radius: 60px 30px 70px 40px / 50px 60px 30px 60px;
}
            100% { border-radius: 20px 70px 30px 60px / 60px 40px 50px 70px;
}
        }
        @keyframes br-glow-spin { 0% { background-position: 0 0; } 100% { background-position: 400% 0; } }
        .br-bottom-nav-hidden {
            transform: translateX(-50%) translateY(100px) !important;
            opacity: 0 !important;
            transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        }

#br-capsule-container {
            position: fixed;
            z-index: 10005;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            pointer-events: none;
        }

        @media (min-width: 769px) {
            #br-capsule-container {
                bottom: 90px;
                left: 50%;
                transform: translateX(-50%);
                width: auto;
            }
        }

        @media (max-width: 768px) {
            #br-capsule-container {
                top: 10px;
                left: 0;
                width: 100%;
            }
        }

      #br-capsule {
            background: rgba(10, 10, 12, 0.65) !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            border: 1px solid var(--br-edge-color) !important;
            border-left: 3px solid var(--br-edge-color) !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 15px rgba(var(--br-edge-color), 0.2) !important;
            border-radius: 50px !important;
            color: #fff !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            opacity: 0 !important;
            transform: scale(0.9) !important;
            padding: 10px 20px !important;
            min-height: 44px !important;
            max-width: 90vw !important;
            width: auto !important;
            pointer-events: none !important;
            cursor: pointer !important;
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }

        #br-capsule.br-active {
            opacity: 1 !important;
            transform: scale(1) !important;
            pointer-events: auto !important;
        }

        #br-capsule:active {
            transform: scale(0.96);
        }

        .br-capsule-content {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
        }

        .br-capsule-icon {
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .br-capsule-text {
            font-family: 'Manrope', sans-serif;
            font-weight: 600;
            font-size: 14px;
            line-height: 1.4;
            color: #eee;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .br-capsule-count {
            background: var(--br-edge-color);
            color: #000;
            font-size: 10px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 10px;
            margin-left: 8px;
            display: none;
        }

        .c-success { color: #2ecc71; text-shadow: 0 0 10px rgba(46, 204, 113, 0.4); }
        .c-error { color: #e74c3c; text-shadow: 0 0 10px rgba(231, 76, 60, 0.4); }
        .c-info { color: #3498db; text-shadow: 0 0 10px rgba(52, 152, 219, 0.4); }
        .c-load { color: #f1c40f; }

            #${STYLE_ICON_ID} {
                font-size: 20px;
                line-height: 1;
            }
            #${STYLE_ICON_ID} .fas {
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            #${STYLE_ICON_ID}:hover .fas {
                transform: rotate(20deg);
            }


                .br-live-feed-item-title {
                    color: #fff;
                    font-weight: bold;
                }
                .br-live-feed-item-user {
                    color: #999;
                }
                @keyframes br-marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                }

            .panel-btn {
                position: relative;
            }
            .br-ripple-container {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                border-radius: inherit;
                z-index: 1;
            }
            .br-ripple-effect {
                position: absolute;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: br-ripple-anim 0.6s linear;
                pointer-events: none;
            }
            @keyframes br-ripple-anim {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            .br-toggle-switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 26px;
                vertical-align: middle;
            }
            .br-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .br-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #555;
                transition: .3s;
                border-radius: 34px;
            }
            .br-toggle-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s cubic-bezier(0.2, 0.8, 0.2, 1);
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            .br-toggle-switch input:checked + .br-toggle-slider {
                background-color: #28a745;
            }
            .br-toggle-switch input:checked + .br-toggle-slider:before {
                transform: translateX(18px);
            }
            #${PANEL_ID} label.inline-label {
                user-select: none;
                cursor: pointer;
            }

            .br-panel-body::-webkit-scrollbar {
                width: 14px;
            }
            .br-panel-body::-webkit-scrollbar-track {
                background: transparent;
            }
            .br-panel-body::-webkit-scrollbar-thumb {
                background-color: #555;
                border-radius: 10px;
                border: 4px solid transparent;
                background-clip: content-box;
            }
            .br-panel-body::-webkit-scrollbar-thumb:hover {
                background-color: #777;
            }

            .br-input-group {
                position: relative;
                margin-top: 15px;
            }
            .br-input-group input[type="text"] {
                padding-top: 12px;
            }
            .br-input-group label {
                position: absolute;
                top: 10px;
                left: 12px;
                font-size: 13px;
                color: #aaa;
                pointer-events: none;
                transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .br-input-group input[type="text"]:focus + label,
            .br-input-group input[type="text"]:not(:placeholder-shown) + label {
                top: 4px;
                font-size: 10px;
                color: #D59D80;
            }
            #${PANEL_ID} .br-input-group label {
                margin-bottom: 0;
            }

            @keyframes br-counter-pop {
                0%   { transform: scale(1); }
                30%  { transform: scale(1.4); background-color: #e74c3c; color: white; }
                100% { transform: scale(1); }
            }
            .br-counter-pop {
                animation: br-counter-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }



            .panel-btn .fas {
                position: relative;
                z-index: 2;
            }
            .panel-btn span, .panel-btn i {
                vertical-align: middle;
            }
            .br-panel-btn-save i {
                transition: opacity 0.3s, transform 0.3s;
            }
            .br-panel-btn-save .fa-check {
                position: absolute;
                opacity: 0;
                transform: scale(0.5);
                transition: opacity 0.3s, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                left: 0;
                right: 0;
                margin-left: auto;
                margin-right: auto;
            }
            .br-panel-btn-save.br-btn-success .fa-save {
                opacity: 0;
                transform: scale(0.5);
            }
            .br-panel-btn-save.br-btn-success .fa-check {
                opacity: 1;
                transform: scale(1);
            }

            .br-panel-btn-reset .fa-undo-alt {
                transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .br-panel-btn-reset:active .fa-undo-alt {
                transform: rotate(-180deg);
            }

            #br-upload-history-container .br-skeleton-loader {
                height: 30px;
                margin-bottom: 8px;
            }
            #br-upload-history-container .br-skeleton-loader:last-child {
                margin-bottom: 0;
            }

            .br-neon-badge {
                    float: right;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px 4px 8px;
                    border-radius: 8px;
                    font-family: 'Manrope', sans-serif;
                    font-weight: 700;
                    font-size: 11px;
                    color: #fff;
                    margin-left: 10px;
                    background: rgba(20, 20, 25, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    white-space: nowrap;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    user-select: none;
                    position: relative;
                    overflow: hidden;
                }

                .br-neon-badge::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                    background: var(--badge-color, #fff);
                    box-shadow: 0 0 8px var(--badge-color, #fff);
                }

                .br-neon-badge:hover {
                    transform: translateY(-2px);
                    background: rgba(40, 40, 45, 0.8);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .br-neon-badge:active {
                    transform: scale(0.96);
                }

                .br-copy-tooltip {
                    position: fixed;
                    bottom: 30px; left: 50%; transform: translateX(-50%);
                    background: rgba(10, 10, 10, 0.8);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff; padding: 10px 20px;
                    border-radius: 30px; font-size: 13px; font-weight: 600;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    z-index: 9999;
                    animation: br-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex; align-items: center; gap: 8px;
                }

                @keyframes br-fade-up {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }

                .br-flow-fresh { --badge-color: #00e676; color: #ccffdd; }
                .br-flow-warn { --badge-color: #ffb74d; color: #fff3e0; }
                .br-flow-pinned-ok { --badge-color: #29b6f6; color: #e1f5fe; }

                .br-flow-crit {
                    --badge-color: #ff1744;
                    color: #ffebee;
                    animation: br-pulse-border 2s infinite;
                    border-color: rgba(255, 23, 68, 0.3);
                }

                @keyframes br-pulse-border {
                    0% { box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-color: rgba(255, 23, 68, 0.1); }
                    50% { box-shadow: 0 4px 20px rgba(255, 23, 68, 0.25); border-color: rgba(255, 23, 68, 0.5); }
                    100% { box-shadow: 0 4px 15px rgba(0,0,0,0.2); border-color: rgba(255, 23, 68, 0.1); }
                }

                .structItem-title { padding-right: 5px; }


                #${BACKGROUND_ELEMENT_ID} {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none;
                    transition: background-image 0.5s ease, background-color 0.5s ease, background-attachment 0.1s linear;
                }
                body { background: transparent !important; }
                .p-pageWrapper { position: relative; z-index: auto; }

                .br-nav-inner-mask {
                    height: ${BOTTOM_NAV_HEIGHT};
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    gap: 8px;
                    padding: 0 10px;
                    position: relative;
                    z-index: 2;
                    background: transparent;
                }
            .br-nav-group {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }

                #${BOTTOM_NAV_ID} .br-nav-utilities {
                    flex-shrink: 0;
                }
                #${BOTTOM_NAV_ID} .br-nav-links {
                    justify-content: flex-start;
                    flex-grow: 1;
                    min-width: 0;
                    overflow-x: auto;
                    white-space: nowrap;
                    scrollbar-width: none;
                    -webkit-overflow-scrolling: touch;
                    mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black 90%, transparent);
                }
                #${BOTTOM_NAV_ID} .br-nav-links::-webkit-scrollbar { display: none; }

                #${CLOCK_ID} {
                    display: none;
                }
                #${CLOCK_ID} .br-clock-inner {
                    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    transform-style: preserve-3d;
                }
                #${CLOCK_ID}.br-clock-flipped .br-clock-inner {
                    transform: rotateY(180deg);
                }
                #${CLOCK_ID} .br-clock-front, #${CLOCK_ID} .br-clock-back {
                    backface-visibility: hidden;
                }
                #${CLOCK_ID} .br-clock-back {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    line-height: ${BOTTOM_NAV_HEIGHT};
                    padding: 0 10px;
                    transform: rotateY(180deg);
                }

                    @keyframes br-icon-flow {
                    0% { background-position: 0% 50%; box-shadow: 0 0 10px var(--br-nav-accent-color); }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; box-shadow: 0 0 10px var(--br-nav-accent-color); }
                }
                #${BOTTOM_NAV_ID} #${STYLE_ICON_ID} {
                    position: relative;
                    bottom: auto;
                    left: auto;
                    width: calc(${BOTTOM_NAV_HEIGHT} - 10px);
                    height: calc(${BOTTOM_NAV_HEIGHT} - 10px);
                    font-size: 18px;
                    background: var(--br-nav-main-gradient);
                    background-size: 300% 300%;
                    animation: br-icon-flow 6s ease infinite;
                    border: 1px solid var(--br-nav-border-color);
                    color: #ffffff;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    border-radius: 12px;
                    z-index: 10;
                    margin-right: 0;
                    transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                #${BOTTOM_NAV_ID} #${STYLE_ICON_ID}:hover {
                    transform: scale(1.1) rotate(15deg);
                }              #${STYLE_ICON_ID}:hover { background-color: rgba(80, 80, 80, 0.9); transform: scale(1.1); }

                .br-anim-scroll {
                    opacity: 0;
                    transform: translateY(15px);
                    transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    pointer-events: none;
                    content-visibility: auto;
                    contain-intrinsic-size: 100px 100px;
                }
                .br-anim-scroll.br-is-visible {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                    content-visibility: visible;
                }
                .br-anim-no-anim {
                    opacity: 1 !important;
                    transform: none !important;
                    transition: none !important;
                    animation: none !important;
                }
                .br-anim-slide-in-left.br-is-visible {
                    animation: br-rich-slide-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }

                @keyframes br-rich-spring-up {
                    0% { opacity: 0; transform: translateY(40px) scale(0.95); }
                    60% { opacity: 1; transform: translateY(-5px) scale(1.01); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes br-rich-fade {
                    from { opacity: 0; filter: blur(4px); }
                    to { opacity: 1; filter: blur(0); }
                }
                @keyframes br-rich-slide-right {
                    0% { opacity: 0; transform: translateX(-30px); }
                    100% { opacity: 1; transform: translateX(0); }
                }

                .br-slide-out-left { animation: br-panel-slide-out-left 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }
                .br-slide-in-right { animation: br-panel-slide-in-right 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                .br-slide-out-right { animation: br-panel-slide-out-right 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards; }
                .br-slide-in-left { animation: br-panel-slide-in-left 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }

                @keyframes br-panel-slide-out-left {
                    to { opacity: 0; transform: translateX(-20px) scale(0.95); filter: blur(2px); }
                }
                @keyframes br-panel-slide-in-right {
                    from { opacity: 0; transform: translateX(30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes br-panel-slide-out-right {
                    to { opacity: 0; transform: translateX(30px); }
                }
                @keyframes br-panel-slide-in-left {
                    from { opacity: 0; transform: translateX(-20px) scale(0.95); filter: blur(2px); }
                    to { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
                }

                .br-hub-card:active {
                    transform: scale(0.92) rotateX(10deg);
                    transition: transform 0.1s;
                }

                #br-style-copy-modal {

                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .br-style-modal-content {
                    background: #333;
                    border: 1px solid #555;
                    border-radius: 12px;
                    padding: 20px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                    transform: scale(0.95);
                    opacity: 0;
                    animation: br-modal-pop-in 0.2s ease-out forwards;
                }
                @keyframes br-modal-pop-in {
                    to { transform: scale(1); opacity: 1; }
                }
                .br-style-modal-content h4 {
                    margin: 0 0 15px;
                    color: #fff;
                    text-align: center;
                    border-bottom: 1px solid #555;
                    padding-bottom: 10px;
                    font-size: 16px;
                }
                .br-style-modal-content input[type="text"] {
                    width: 100%;
                    background: #222;
                    border: 1px solid #666;
                    color: #eee;
                    padding: 10px;
                    border-radius: 4px;
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .br-style-modal-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                .br-style-modal-buttons button {
                    flex: 1;
                    padding: 9px 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    font-size: 14px;
                }
                .br-style-modal-copy {
                    background: #007bff;
                    color: white;
                }
                .br-style-modal-copy:hover { background: #0056b3; }
                .br-style-modal-close {
                    background: #aaa;
                    color: #333;
                }
                .br-style-modal-close:hover { background: #999;
                }
                `;

staticCss += `
                 #br-panel-wrapper {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.7);
                    z-index: 9990;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    box-sizing: border-box;
                    transition: opacity 0.4s ease;
                }

                   #${PANEL_ID} {
                    width: 100%;
                    max-width: 800px;
                    max-height: 90vh;
                    background: #2B124C;
                    border-radius: 16px;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transition: transform 0.2s ease, opacity 0.2s ease;
                    will-change: transform, opacity;
                }
                .br-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 20px;
                    border-bottom: 1px solid rgba(198, 198, 208, 0.1);
                    flex-shrink: 0;
                }
                .br-panel-header h3 {
                    margin: 0;
                    font-size: 16px;
                    color: #C6C6D0;
                    display: flex;
                    align-items: center;
                }

                .br-panel-close-btn {
                    background: transparent;
                    border: none;
                    color: #C6C6D0;
                    font-size: 16px;
                    cursor: pointer;
                    opacity: 0.7;
                    transition: opacity 0.2s, transform 0.2s;
                }
                .br-panel-close-btn:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .br-panel-body {
                    padding: 20px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    -webkit-overflow-scrolling: touch;
                }

#blackrussia-settings-panel {
    background-color: #09090b !important;
    background-image: radial-gradient(circle at 50% 0%, rgba(30, 35, 50, 0.3) 0%, transparent 70%) !important;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 20px 60px rgba(0, 0, 0, 0.95) !important;
    border: none !important;
    will-change: transform, opacity;
    backface-visibility: hidden;
    animation: br-desktop-pop 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
    transform-origin: center center !important;
}

@media (max-width: 768px) {
    #blackrussia-settings-panel {
        animation: br-mobile-slide 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards !important;
        transform-origin: bottom center !important;
        border-radius: 20px 20px 0 0 !important;
    }
}

@keyframes br-desktop-pop {
    0% { opacity: 0; transform: scale(0.95) translateY(10px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes br-mobile-slide {
    0% { opacity: 0; transform: translateY(100%); }
    100% { opacity: 1; transform: translateY(0); }
}

.br-panel-header {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
    background: rgba(255, 255, 255, 0.02) !important;
    backdrop-filter: blur(5px);
}

.br-hub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 15px;
    padding: 10px;
}

.br-hub-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 22px;
    padding: 20px 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    border: 1px solid rgba(255, 255, 255, 0.08);
    position: relative;
    overflow: visible;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    animation: br-card-cascade 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
}

.br-hub-card:nth-child(1) { animation-delay: 0.05s; }
.br-hub-card:nth-child(2) { animation-delay: 0.1s; }
.br-hub-card:nth-child(3) { animation-delay: 0.15s; }
.br-hub-card:nth-child(4) { animation-delay: 0.2s; }
.br-hub-card:nth-child(5) { animation-delay: 0.25s; }
.br-hub-card:nth-child(6) { animation-delay: 0.3s; }
.br-hub-card:nth-child(7) { animation-delay: 0.35s; }
.br-hub-card:nth-child(8) { animation-delay: 0.4s; }

.br-hub-card:hover {
    transform: translateY(-5px) scale(1.02);
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
}

.br-hub-card::before {
    content: '';
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: var(--glow-color);
    filter: blur(30px);
    opacity: 0.3;
    transition: opacity 0.3s, transform 0.3s;
    z-index: 0;
    pointer-events: none;
}

.br-hub-card:hover::before {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(2);
}


.br-hub-card span {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.5px;
    color: #b0b3b8;
    text-transform: uppercase;
    position: relative;
    z-index: 2;
    transition: all 0.3s;
}

.br-hub-card:hover span {
    color: #fff;
    text-shadow: 0 0 8px var(--glow-color);
    letter-spacing: 1px;
}

@keyframes br-icon-pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
}

.br-hub-card .br-hub-card-icon {
    width: 50px !important;
    height: 50px !important;
    margin: 0 auto 12px auto;
    position: relative;
    z-index: 2;
    -webkit-mask-size: contain !important;
    mask-size: contain !important;
    -webkit-mask-repeat: no-repeat !important;
    mask-repeat: no-repeat;
    -webkit-mask-position: center !important;
    mask-position: center !important;
    background-color: transparent !important;
    background-image: var(--icon-gradient) !important;
    background-size: 300% 300% !important;
    animation: brGradientFlow 3s linear infinite !important;
    filter: drop-shadow(0 0 5px var(--glow-color));
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.br-hub-card:hover .br-hub-card-icon {
    transform: scale(1.1) translateY(-3px);
    filter: drop-shadow(0 0 12px var(--glow-color));
    animation: brGradientFlow 3s linear infinite, br-icon-pop 0.4s ease-in-out !important;
}

.br-hub-card[data-page="tab-main"] {
    --glow-color: #00f2ff;
    --icon-gradient: linear-gradient(135deg, #ff00ff, #00f2ff, #ffea00, #ff00ff);
}
.br-hub-card[data-page="tab-main"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/%3E%3Cpolyline points='9 22 9 12 15 12 15 22'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-visuals"] {
    --glow-color: #ff00ff;
    --icon-gradient: linear-gradient(135deg, #ff00ff, #bc13fe, #ff00ff);
}
.br-hub-card[data-page="tab-visuals"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-animations"] {
    --glow-color: #ffea00;
    --icon-gradient: linear-gradient(135deg, #ffea00, #ff9900, #ffea00);
}
.br-hub-card[data-page="tab-animations"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-interface"] {
    --glow-color: #00ff99;
    --icon-gradient: linear-gradient(135deg, #00ff99, #00f2ff, #00ff99);
}
.br-hub-card[data-page="tab-interface"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cline x1='3' y1='9' x2='21' y2='9'/%3E%3Cpath d='M9 21V9'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-live"] {
    --glow-color: #bc13fe;
    --icon-gradient: linear-gradient(135deg, #bc13fe, #ff00ff, #bc13fe);
}
.br-hub-card[data-page="tab-live"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='22 12 18 12 15 21 9 3 6 12 2 12'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-presets"] {
    --glow-color: #ff9900;
    --icon-gradient: linear-gradient(135deg, #ff9900, #ffea00, #ff00ff);
}
.br-hub-card[data-page="tab-presets"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-moderation"] {
    --glow-color: #ff0000;
    --icon-gradient: linear-gradient(135deg, #ff0000, #ff9900, #ff0000);
}
.br-hub-card[data-page="tab-moderation"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/%3E%3Cpath d='M9 12l2 2 4-4'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-integrations"] {
    --glow-color: #00f2ff;
    --icon-gradient: linear-gradient(135deg, #00f2ff, #00ff99, #00f2ff);
}
.br-hub-card[data-page="tab-integrations"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-gallery"] {
    --glow-color: #bc13fe;
    --icon-gradient: linear-gradient(135deg, #bc13fe, #00f2ff, #bc13fe);
}
.br-hub-card[data-page="tab-gallery"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

.br-hub-card[data-page="tab-help"] {
    --glow-color: #ffffff;
    --icon-gradient: linear-gradient(135deg, #ffffff, #aaaaaa, #ffffff);
}
.br-hub-card[data-page="tab-help"] .br-hub-card-icon {
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'/%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'/%3E%3C/svg%3E");
    filter: drop-shadow(0 0 2px rgba(255,255,255,0.9)) drop-shadow(0 0 6px var(--glow-color)) drop-shadow(0 0 15px var(--glow-color));
}

                .br-settings-view {
                    display: none;
                }
                .br-settings-header {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .br-settings-back-btn {
                    background: #104C64;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    color: #C6C6D0;
                    padding: 6px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: background-color 0.2s, color 0.2s;
                }
                .br-settings-back-btn:hover {
                    background: #D59D80;
                    color: #2B124C;
                    border-color: #D59D80;
                }
                .br-settings-title {
                    margin: 0 0 0 15px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #C6C6D0;
                }

                #${PANEL_ID}[data-view="hub"] .br-settings-view { display: none; }
                #${PANEL_ID}[data-view="hub"] .br-hub-grid { display: grid; }

                #${PANEL_ID}[data-view="page"] .br-settings-view { display: block; }
                #${PANEL_ID}[data-view="page"] .br-hub-grid { display: none; }

                #${PANEL_ID} .panel-tab-content {
                    display: none;
                    animation: br-fade-in 0.3s ease-out;
                }
                @keyframes br-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                #${PANEL_ID} .panel-tab-content h4 {
                    color: #D59D80;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    border-bottom: 1px solid rgba(198, 198, 208, 0.1);
                    padding: 8px 0;
                    margin: 20px 0 15px 0;
                    font-size: 14px;
                    text-align: center;
                    font-weight: 600;
                }
                #${PANEL_ID} .panel-tab-content h4:first-child {
                    margin-top: 0;
                    border-top: none;
                }

                #${PANEL_ID} .setting-group {
                    margin-bottom: 12px;
                    padding: 14px;
                    border-radius: 8px;
                    background: #104C64;
                    border: 1px solid rgba(198, 198, 208, 0.1);
                }

                #${PANEL_ID} label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #C6C6D0;
                    font-size: 13px;
                }
                #${PANEL_ID} label.inline-label {
                    display: inline;
                    margin-left: 8px;
                    font-weight: 400;
                    color: #C6C6D0;
                }

                #${PANEL_ID} input[type="text"],
                #${PANEL_ID} input[type="number"],
                #${PANEL_ID} input[type="file"],
                #${PANEL_ID} select,
                #${PANEL_ID} textarea {
                    width: 100%;
                    padding: 8px 12px;
                    background: #0D1D25;
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    color: #C6C6D0;
                    border-radius: 6px;
                    box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                    font-size: 13px;
                }
                #${PANEL_ID} input[type="text"]:focus,
                #${PANEL_ID} input[type="number"]:focus,
                #${PANEL_ID} select:focus,
                #${PANEL_ID} textarea:focus {
                    border-color: #D59D80;
                    background: #104C64;
                    box-shadow: 0 0 8px rgba(213, 157, 128, 0.2);
                    outline: none;
                }

                #${PANEL_ID} input[type="color"] {
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    height: 28px;
                    width: 44px;
                    vertical-align: middle;
                    margin-left: 5px;
                    border-radius: 6px;
                    cursor: pointer;
                    background: transparent;
                    transition: border-color 0.2s;
                }
                #${PANEL_ID} input[type="color"]:hover {
                    border-color: #D59D80;
                }

                #${PANEL_ID} input[type="checkbox"] {
                    appearance: none;
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #0D1D25;
                    border-radius: 5px;
                    position: relative;
                    vertical-align: middle;
                    border: 1px solid rgba(198, 198, 208, 0.2);
                    cursor: pointer;
                    margin-right: 5px;
                    transition: all 0.2s ease;
                }
                #${PANEL_ID} input[type="checkbox"]::after {
                    content: '✓';
                    font-weight: bold;
                    font-size: 14px;
                    color: #2B124C;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 0;
                    transition: all 0.2s ease;
                }
                #${PANEL_ID} input[type="checkbox"]:checked {
                    background: #D59D80;
                    border-color: #D59D80;
                }
                #${PANEL_ID} input[type="checkbox"]:checked::after {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }

                #${PANEL_ID} .button-group {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: flex-end;
                }
                #${PANEL_ID} button.panel-btn {
                    padding: 9px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 13px;
                    color: #C6C6D0;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                    border: 1px solid rgba(198, 198, 208, 0.1);
                    background: #104C64;
                }
                #${PANEL_ID} button.panel-btn:active {
                    transform: scale(0.98);
                }
                #${PANEL_ID} button.panel-btn-save {
                    background: #D59D80;
                    border-color: #D59D80;
                    color: #2B124C;
                }
                #${PANEL_ID} button.panel-btn-save:hover {
                    opacity: 0.9;
                }
                #${PANEL_ID} button.panel-btn-reset:hover,
                #${PANEL_ID} button.panel-btn-export:hover,
                #${PANEL_ID} button.panel-btn-import:hover {
                    background: #104C64;
                    border-color: #D59D80;
                }

                #${PANEL_ID} button.panel-small-btn {
                    padding: 6px 10px !important;
                    font-size: 12px !important;
                    background: #104C64;
                    border-color: rgba(198, 198, 208, 0.1);
                }
                #${PANEL_ID} button.panel-btn-danger {
                    background: #8B0000 !important;
                    border-color: rgba(255,100,100,0.3) !important;
                }
                #${PANEL_ID} button.panel-btn-add {
                    background: rgba(213, 157, 128, 0.1);
                    border: 1px solid rgba(213, 157, 128, 0.3);
                    color: #D59D80;
                    width: 100%;
                }

                #${PANEL_ID} hr {
                    border: none;
                    border-top: 1px solid rgba(198, 198, 208, 0.1);
                    margin: 20px 0;
                }

                #${PANEL_ID} .sub-settings {
                    margin-left: 0;
                    padding: 10px;
                    border-left: 3px solid #D59D80;
                    margin-top: 12px;
                    background: rgba(13, 29, 37, 0.5);
                    border-radius: 0 6px 6px 0;
                }

                #${PANEL_ID} .dynamic-links-group {
                    border-color: rgba(198, 198, 208, 0.1);
                }
                #${PANEL_ID} .quick-link-input-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                #${PANEL_ID} .quick-link-input-item input {
                    font-size: 12px;
                }
                #${PANEL_ID} .quick-link-input-item button.remove-quick-link-btn {
                    flex-shrink: 0;
                    padding: 6px 9px !important;
                    line-height: 1;
                }

                @media (max-width: 700px) {
                    #br-panel-wrapper {
                        padding: 0;
                    }
                    #${PANEL_ID} {
                        max-height: 100vh;
                        height: 100%;
                        border-radius: 0;
                        border: none;
                    }
                    .br-hub-grid {
                        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                        gap: 10px;
                    }
                    .br-panel-body {
                        padding: 15px;
                    }
                }
                .br-help-section p,
                .br-help-section li {
                    color: #C6C6D0;
                    font-size: 13px;
                    line-height: 1.6;
                }
                .br-help-section p {
                    margin-top: 5px;
                    margin-bottom: 10px;
                }
                .br-help-section ul {
                    padding-left: 20px;
                    margin: 10px 0;
                }
                .br-help-section li {
                    margin-bottom: 10px;
}
                .br-help-section strong {
                    color: #D59D80;
font-weight: 600;
                }
`;

staticCss += `
                #br-panel-wrapper {
    --th-bg: rgba(43, 18, 76, 0.7);
    --th-card-bg: rgba(16, 76, 100, 0.6);
    --th-border: rgba(198, 198, 208, 0.1);
    --th-accent: #D59D80;
    --th-text: #C6C6D0;
    --th-input-bg: rgba(13, 29, 37, 0.6);
    --th-input-border: rgba(198, 198, 208, 0.2);
}

#br-panel-wrapper[data-theme="classic_dark"] {
    --th-bg: linear-gradient(145deg, rgba(32, 34, 37, 0.6), rgba(40, 42, 47, 0.6));
    --th-card-bg: linear-gradient(rgba(47, 49, 54, 0.5), rgba(50, 53, 59, 0.5));
    --th-border: rgba(234, 234, 234, 0.1);
    --th-accent: #007BFF;
    --th-text: #EAEAEA;
    --th-input-bg: rgba(32, 34, 37, 0.5);
    --th-input-border: rgba(234, 234, 234, 0.2);
}

#br-panel-wrapper[data-theme="graphite_blurple"] {
    --th-bg: linear-gradient(145deg, rgba(44, 47, 51, 0.6), rgba(48, 51, 57, 0.6));
    --th-card-bg: linear-gradient(rgba(54, 57, 63, 0.5), rgba(60, 63, 70, 0.5));
    --th-border: rgba(220, 221, 222, 0.1);
    --th-accent: #7289DA;
    --th-text: #DCDDDE;
    --th-input-bg: rgba(44, 47, 51, 0.5);
    --th-input-border: rgba(220, 221, 222, 0.2);
}

#br-panel-wrapper[data-theme="pragmatic_grey"] {
    --th-bg: linear-gradient(145deg, rgba(31, 31, 31, 0.6), rgba(35, 35, 35, 0.6));
    --th-card-bg: linear-gradient(rgba(40, 42, 44, 0.5), rgba(44, 46, 48, 0.5));
    --th-border: rgba(232, 234, 237, 0.1);
    --th-accent: #8AB4F8;
    --th-text: #E8EAED;
    --th-input-bg: rgba(31, 31, 31, 0.5);
    --th-input-border: rgba(232, 234, 237, 0.2);
}

#br-panel-wrapper[data-theme="clean_monochrome"] {
    --th-bg: linear-gradient(145deg, rgba(20, 20, 20, 0.6), rgba(26, 26, 26, 0.6));
    --th-card-bg: linear-gradient(rgba(44, 44, 46, 0.5), rgba(50, 50, 52, 0.5));
    --th-border: rgba(255, 255, 255, 0.15);
    --th-accent: #0A84FF;
    --th-text: #FFFFFF;
    --th-input-bg: rgba(26, 26, 26, 0.5);
    --th-input-border: rgba(255, 255, 255, 0.2);
}

#br-panel-wrapper[data-theme="warm_sepia"] {
    --th-bg: linear-gradient(145deg, rgba(40, 36, 32, 0.6), rgba(45, 41, 37, 0.6));
    --th-card-bg: linear-gradient(rgba(59, 55, 51, 0.5), rgba(65, 61, 57, 0.5));
    --th-border: rgba(216, 207, 192, 0.1);
    --th-accent: #D9A066;
    --th-text: #D8CFC0;
    --th-input-bg: rgba(40, 36, 32, 0.5);
    --th-input-border: rgba(216, 207, 192, 0.2);
}

#br-panel-wrapper[data-theme="emerald_forest"] {
    --th-bg: linear-gradient(145deg, rgba(34, 39, 37, 0.6), rgba(38, 44, 42, 0.6));
    --th-card-bg: linear-gradient(rgba(48, 54, 51, 0.5), rgba(52, 59, 55, 0.5));
    --th-border: rgba(224, 224, 224, 0.1);
    --th-accent: #2ECC71;
    --th-text: #E0E0E0;
    --th-input-bg: rgba(34, 39, 37, 0.5);
    --th-input-border: rgba(224, 224, 224, 0.2);
}

#br-panel-wrapper[data-theme="sunset_rose"] {
    --th-bg: linear-gradient(145deg, rgba(44, 25, 43, 0.6), rgba(50, 30, 48, 0.6));
    --th-card-bg: linear-gradient(rgba(66, 40, 64, 0.5), rgba(72, 45, 70, 0.5));
    --th-border: rgba(233, 64, 87, 0.15);
    --th-accent: #E94057;
    --th-text: #E0E0E0;
    --th-input-bg: rgba(44, 25, 43, 0.5);
    --th-input-border: rgba(233, 64, 87, 0.2);
}

#${PANEL_ID} { background: var(--th-bg); border-color: var(--th-border); }
.br-hub-card { background: var(--th-card-bg); border-color: var(--th-border); }
.br-hub-card:hover { border-color: var(--th-accent); }
.br-hub-card .br-hub-card-icon { background-color: var(--th-text); }
.br-hub-card:hover .br-hub-card-icon { background-color: var(--th-accent); }
.br-hub-card span { color: var(--th-text); }
.br-settings-back-btn { background: var(--th-card-bg); border-color: var(--th-border); color: var(--th-text); }
.br-settings-back-btn:hover { background: var(--th-accent); color: #fff; border-color: var(--th-accent); }
.br-settings-title { color: var(--th-text); }
.panel-tab-content h4 { color: var(--th-accent); }
#${PANEL_ID} .setting-group { background: var(--th-card-bg); border-color: var(--th-border); }
#${PANEL_ID} label { color: var(--th-text); }
#${PANEL_ID} input[type="text"], #${PANEL_ID} input[type="number"], #${PANEL_ID} input[type="file"], #${PANEL_ID} select, #${PANEL_ID} textarea {
    background: var(--th-input-bg); border-color: var(--th-input-border); color: var(--th-text);
}
#${PANEL_ID} input[type="text"]:focus, #${PANEL_ID} input[type="number"]:focus, #${PANEL_ID} select:focus, #${PANEL_ID} textarea:focus {
    border-color: var(--th-accent); background: var(--th-card-bg);
}
#${PANEL_ID} input[type="color"] { border-color: var(--th-input-border); }
#${PANEL_ID} input[type="color"]:hover { border-color: var(--th-accent); }
#${PANEL_ID} input[type="checkbox"] { background: var(--th-input-bg); border-color: var(--th-input-border); }
#${PANEL_ID} input[type="checkbox"]::after { color: #222; }
#${PANEL_ID} input[type="checkbox"]:checked { background: var(--th-accent); border-color: var(--th-accent); }
#${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track { background: var(--th-input-bg); }
#${PANEL_ID} input[type="range"]::-webkit-slider-thumb { background: var(--th-text); border-color: var(--th-accent); }
#${PANEL_ID} button.panel-btn { color: var(--th-text); border-color: var(--th-border); background: var(--th-card-bg); }
#${PANEL_ID} button.panel-btn-save { background: var(--th-accent); border-color: var(--th-accent); color: #fff; }
#${PANEL_ID} button.panel-btn-reset:hover, #${PANEL_ID} button.panel-btn-export:hover, #${PANEL_ID} button.panel-btn-import:hover { border-color: var(--th-accent); }
#${PANEL_ID} button.panel-btn-add { background: transparent; border-color: var(--th-accent); color: var(--th-accent); opacity: 0.8; }
#${PANEL_ID} .sub-settings { border-left-color: var(--th-accent); background: var(--th-input-bg); }
.br-help-section strong { color: var(--th-accent); }

#${PANEL_ID} input[type="range"] {
    -webkit-appearance: none !important;
    width: 100% !important;
    height: 6px !important;
    background: rgba(255, 255, 255, 0.1) !important;
    border-radius: 3px !important;
    margin: 12px 0 !important;
    cursor: pointer !important;
    padding: 0 !important;
}

#${PANEL_ID} input[type="range"]::-webkit-slider-runnable-track {
    width: 100% !important;
    height: 100% !important;
    background: transparent !important;
    border: none !important;
    border-radius: 3px !important;
}

#${PANEL_ID} input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none !important;
    height: 18px !important;
    width: 18px !important;
    border-radius: 50% !important;
    background: #fff !important;
    border: 2px solid var(--th-accent) !important;
    box-shadow: 0 1px 4px rgba(0,0,0,0.5) !important;
    margin-top: -6px !important;
    transform: scale(1) !important;
    transition: transform 0.1s, border-color 0.2s !important;
}

#${PANEL_ID} input[type="range"]:active::-webkit-slider-thumb {
    transform: scale(1.2) !important;
    background: var(--th-accent) !important;
}

`;

staticCss += `
.author-credit-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 15px 0;
    margin-bottom: 10px;
    text-decoration: none;
    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #89cff0 0%, #ffffff 50%, #89cff0 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: br-ice-shine 3s linear infinite;
    position: relative;
    opacity: 0.9;
    transition: opacity 0.3s;
}

.author-credit-link::before,
.author-credit-link::after {
    content: '';
    flex: 1;
    height: 1px;
    margin: 0 15px;
    background: linear-gradient(90deg, transparent, rgba(137, 207, 240, 0.6), transparent);
    animation: br-line-pulse 3s ease-in-out infinite;
    opacity: 0.5;
}

@keyframes br-ice-shine {
    to {
        background-position: 200% center;
    }
}

@keyframes br-line-pulse {
    0%, 100% {
        transform: scaleX(0.8);
        opacity: 0.3;
    }
    50% {
        transform: scaleX(1);
        opacity: 0.8;
    }
}

.author-credit-link:hover {
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(137, 207, 240, 0.5));
}
.br-stats-dashboard {
            display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 8px; margin-bottom: 12px;
            background: var(--br-nav-bg, rgba(20, 20, 25, 0.95));
            backdrop-filter: blur(10px); padding: 8px;
            border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); scrollbar-width: none;
            box-shadow: var(--br-nav-shadow, 0 10px 30px rgba(0,0,0,0.3));
        }
        .br-stats-dashboard::-webkit-scrollbar { display: none; }

        .br-stat-card {
            flex: 1; min-width: 80px; background: rgba(255, 255, 255, 0.03); border-radius: 6px;
            padding: 6px 4px; text-align: center; display: flex; flex-direction: row;
            align-items: center; justify-content: center; gap: 8px; position: relative;
            overflow: hidden; border: 1px solid rgba(255,255,255,0.03); cursor: pointer;
            transition: all 0.2s ease; user-select: none;
        }
        .br-stat-card:hover { background: rgba(255, 255, 255, 0.07); transform: translateY(-1px); }
        .br-stat-card.active { background: rgba(255, 255, 255, 0.15); border-color: var(--stat-color); box-shadow: 0 0 10px var(--stat-color); }
        .br-stat-card.dimmed { opacity: 0.4; filter: grayscale(0.8); }

        .br-stat-card.pulse-alert { animation: br-pulse 2s infinite; }
        @keyframes br-pulse {
            0% { box-shadow: 0 0 0 0 rgba(241, 196, 15, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(241, 196, 15, 0); }
            100% { box-shadow: 0 0 0 0 rgba(241, 196, 15, 0); }
        }

        .br-stat-icon {
            font-size: 14px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
            border-radius: 50%; background: rgba(255,255,255,0.05); color: var(--stat-color);
        }
        .br-stat-info { display: flex; flex-direction: column; align-items: flex-start; }
        .br-stat-val { font-size: 16px; font-weight: 800; color: #fff; line-height: 1; margin-bottom: 2px; }
        .br-stat-lbl { font-size: 9px; color: #999; text-transform: uppercase; font-weight: 700; letter-spacing: 0.3px; }
        .br-stat-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 2px; background: var(--stat-color); opacity: 0.5; }

        .s-wai { --stat-color: #f1c40f; } .s-con { --stat-color: #e67e22; }
        .s-imp { --stat-color: #e74c3c; } .s-ok { --stat-color: #2ecc71; } .s-clo { --stat-color: #7f8c8d; }

        .structItem.br-filtered-hide { display: none !important; }
        .structItem-title { position: relative !important; z-index: 1; }

        .br-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(8px);
            z-index: 200000; display: flex; align-items: center; justify-content: center;
            opacity: 0; visibility: hidden; transition: all 0.25s ease;
        }
        .br-modal-overlay.active { opacity: 1; visibility: visible; }
        .br-modal-window {
            background: #141414; width: 92%; max-width: 750px; max-height: 85vh;
            border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 30px 80px rgba(0,0,0,0.8); transform: scale(0.95) translateY(10px);
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); display: flex; flex-direction: column;
        }
        .br-modal-overlay.active .br-modal-window { transform: scale(1) translateY(0); }
        .br-modal-header {
            padding: 14px 20px; background: var(--br-nav-bg, rgba(255,255,255,0.03)); border-bottom: 1px solid rgba(255,255,255,0.05);
            display: flex; gap: 15px; align-items: center;
        }
        .br-modal-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #333; }
        .br-modal-meta { flex-grow: 1; overflow: hidden; }
        .br-modal-title { font-weight: 700; color: #fff; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .br-modal-date { font-size: 11px; color: #888; margin-top: 2px; }
        .br-modal-close { cursor: pointer; color: #555; font-size: 22px; transition: color 0.2s; line-height: 1; }
        .br-modal-close:hover { color: #fff; }
        .br-modal-content { padding: 20px; overflow-y: auto; color: #ccc; font-size: 14px; line-height: 1.6; flex-grow: 1; }
        .br-modal-content img { max-width: 100%; height: auto; max-height: 60vh; object-fit: contain;
         border-radius: 6px; display: block; margin: 10px 0; }
        .br-modal-content .bbCodeBlock { background: #1a1a1a; border: 1px solid #333; border-radius: 4px; margin: 10px 0; }
        .br-hl-nick { color: #00F0FF; font-weight: bold; background: rgba(0, 240, 255, 0.1); padding: 0 3px; border-radius: 3px; }
       .br-hl-ip { color: #E040FB; font-weight: bold;
}
`;

let cssMobile = `
                        @media screen and (max-width: 768px) {
                        #blackrussia-settings-panel {
                        width: 100% !important;
                        height: 100% !important;
                        max-height: 100% !important;
                        max-width: 100% !important;
                        top: 0 !important;
                        left: 0 !important;
                        border-radius: 0 !important;
                        transform: none !important;
                        border: none !important;
                        position: fixed !important;
                        background: #09090b !important;
                        z-index: 20000 !important;
                    }

                    .br-panel-body {
    padding: 20px 15px 160px 15px !important;
    height: 100% !important;
    overflow-y: auto !important;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch !important;
}

                    .br-hub-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 12px !important;
                        display: grid;
                    }

#blackrussia-settings-panel[data-view="page"] .br-hub-grid {
    display: none !important;
}
                   .br-hub-card:last-child:nth-child(odd) {
                        grid-column: 1 / -1 !important;
                        width: 60% !important;
                        margin: 0 auto !important;
                    }

                    .br-hub-card {
                        padding: 20px 10px !important;
                        min-height: 110px !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: center !important;
                        background: rgba(255, 255, 255, 0.05) !important;
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    }

                    .br-hub-card-icon {
                        width: 45px !important;
                        height: 45px !important;
                        margin-bottom: 12px !important;
                    }

                    .br-hub-card span {
                        font-size: 12px !important;
                        font-weight: 700 !important;
                    }

                    .br-panel-header {
                        padding: 15px 20px !important;
                        background: transparent !important;
                    }

                    .br-panel-close-btn {
                        font-size: 24px !important;
                        padding: 10px !important;
                    }

                    .button-group {
                        position: fixed !important;
                        bottom: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        padding: 8px 12px !important;
                        background: rgba(10, 10, 12, 0.98) !important;
                        backdrop-filter: blur(20px) !important;
                        border-top: 1px solid rgba(255,255,255,0.1) !important;
                        z-index: 20001 !important;
                        display: flex !important;
                        flex-direction: row !important;
                        align-items: stretch !important;
                        gap: 8px !important;
                        margin: 0 !important;
                        box-sizing: border-box !important;
                        height: auto !important;
                    }

                    .button-group span {
                        display: none !important;
                    }

                    .button-group button {
                        width: auto !important;
                        margin: 0 !important;
                        padding: 10px !important;
                        border-radius: 8px !important;
                        font-size: 14px !important;
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        flex: 0 0 auto !important;
                    }

                    .button-group button i {
                        margin: 0 !important;
                    }

                    .button-group #save-btn {
                        flex: 1 1 auto !important;
                    }
                    .button-group #save-btn i {
                        margin-right: 6px !important;
                    }
                }

                .br-nav-force-hidden {
                    opacity: 0 !important;
                    visibility: hidden !important;
                    transform: translateY(20px) scale(0.9) !important;
                    pointer-events: none !important;
                    transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
                }

             @media (max-width: 600px) {
            .br-stat-card { flex-direction: column; gap: 2px; min-width: 70px; }
            .br-stat-info { align-items: center; }
            .br-stat-icon { width: 20px; height: 20px; font-size: 10px; margin-bottom: 2px; }
        }

        #${PANEL_ID} input,
        #${PANEL_ID} select,
        #${PANEL_ID} button,
        #${PANEL_ID} label,
        #${PANEL_ID} textarea,
        #${PANEL_ID} .br-toggle-switch {
            position: relative !important;
            z-index: 50 !important;
            pointer-events: auto !important;
        }

        #${PANEL_ID} .setting-group {
            position: relative !important;
            z-index: 40 !important;
            transform: none !important;
        }

        #${PANEL_ID}[data-view="page"] .br-hub-grid {
            display: none !important;
            visibility: hidden !important;
            pointer-events: none !important;
            z-index: -1 !important;
        }

        #${PANEL_ID} .br-settings-view {
            position: relative !important;
            z-index: 100 !important;
        }

        #br-skeleton-layer {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #09090b;
            z-index: 20000;
            display: flex;
            flex-direction: column;
            transition: opacity 0.4s ease;
        }
        .br-sk-nav-bar {
            height: 50px;
            width: 100%;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 20px;
            flex-shrink: 0;
            background: #111;
        }
        .br-sk-body {
            display: flex;
            max-width: 1200px;
            width: 95%;
            margin: 0 auto;
            gap: 20px;
            flex-grow: 1;
            overflow: hidden;
        }
        .br-sk-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .br-sk-sidebar {
            width: 280px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .br-sk-block {
            background: #161618;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.05);
            overflow: hidden;
            position: relative;
        }
        .br-sk-block-header {
            height: 40px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            margin-bottom: 5px;
        }
        .br-sk-row {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            gap: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.02);
        }
        .br-sk-ava {
            width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
        }
        .br-sk-content { flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .br-sk-text { height: 10px; border-radius: 4px; }
        .br-sk-text.w-40 { width: 40%; }
        .br-sk-text.w-60 { width: 60%; }
        .br-sk-text.w-80 { width: 80%; }
        .br-sk-widget { height: 150px; border-radius: 12px; position: relative; overflow: hidden;
        }

        .br-sk-preview-layout { display: flex; gap: 15px; padding: 10px; }
        .br-sk-preview-left { width: 50px; flex-shrink: 0; }
        .br-sk-preview-right { flex-grow: 1; display: flex; flex-direction: column; gap: 10px; }
        .br-sk-circle { width: 40px; height: 40px; border-radius: 50%; }
        .br-sk-line { height: 12px; border-radius: 4px; width: 100%; margin-bottom: 6px; }
        .br-sk-line.short { width: 40%; }
        .br-gallery-item-smart.loading { animation: br-skeleton-shine 1.5s linear infinite; background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%); background-size: 200% 100%; }

        @keyframes br-load-flow { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .br-shimmer,.structItem-cell--skeleton,.skeleton{background:linear-gradient(90deg,#0a0a0a 0%,color-mix(in srgb,var(--br-edge-color) 25%,#252525) 50%,#0a0a0a 100%)!important;background-size:200% 100%!important;animation:br-load-flow 2s infinite linear!important;border-radius:50px!important;border:none!important;box-shadow:none!important}
        .br-sk-ava,.br-sk-circle{border-radius:50%!important}

        @media (max-width: 900px) {
            .br-sk-sidebar { display: none; }
        }
        .br-skeleton-fade-out { opacity: 0; pointer-events: none; }
                          `;
            const styleElement = document.createElement('style');
            styleElement.id = staticStyleId;
            styleElement.type = 'text/css';
            styleElement.textContent = staticCss + cssMobile;
            (document.head || document.documentElement).appendChild(styleElement);
        } catch (e) {
            console.error('[BR Style] Ошибка внедрения статичных CSS ❌', e);
        }
    }

        function findMyUsername() {
    if (myUsername) return;
    const userEl = document.querySelector('.p-nav-link--username');
    if (userEl) {
        myUsername = userEl.textContent.trim();
        if (settingsPanel) {
            const status = settingsPanel.querySelector('#my-username-status');
            if (status) status.textContent = `Ваш ник: ${myUsername}`;
        }
        applyForumStyles(currentSettings);
        handleDynamicWelcome();
    }
}

        function findThreadAuthor() {
        if (threadAuthor) return;
        const firstPost = document.querySelector('.message[data-content-key="0"]');
        if (firstPost) {
            threadAuthor = firstPost.dataset.author;
            console.log(`[BR Style] Автор темы определен: ${threadAuthor}`);
            applyForumStyles(currentSettings);
            return;
        }
        const profileUsername = document.querySelector('.p-title-value');
        if (profileUsername && document.body.classList.contains('page--member-view')) {
             threadAuthor = profileUsername.textContent.trim();
             console.log(`[BR Style] Автор темы (на странице профиля): ${threadAuthor}`);
             applyForumStyles(currentSettings);
             return;
        }
    }
let liveForumPollInterval = null;
    let notifiedAdmins = new Set();
    let topicLastPostTimes = new Map();

    function fetchForumData(url, parserFunc) {
        return new Promise((resolve, reject) => {
            try {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            if (currentSettings.enableLiveCounters || currentSettings.enableAdminOnlineToast) {
                                parserFunc(response.responseText);
                            } else {
                                const parser = new DOMParser();
                                const htmlDoc = parser.parseFromString(response.responseText, "text/html");
                                parserFunc(htmlDoc);
                            }
                            resolve(true);
                        } else {
                            reject(new Error(`Status ${response.status}`));
                        }
                    },
                    onerror: function(response) {
                        reject(new Error(`Network error: ${response.statusText}`));
                    },
                    ontimeout: function() {
                        reject(new Error('Request timed out'));
                    }
                });
            } catch (e) {
                console.error(e);
                reject(e);
            }
        });
    }

    function parseLiveCounters(htmlData) {
        if (!currentSettings.enableLiveCounters) return;

        if (typeof htmlData === 'string' && brWorker) {
             brWorker.postMessage({
                type: 'PROCESS_COUNTERS',
                payload: { html: htmlData }
            });
        } else if (typeof htmlData === 'object') {
             const htmlDoc = htmlData;
             const updateCounter = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return;
                const newCountText = htmlDoc.querySelector(selector)?.textContent.trim() || '0';
                const newCount = parseInt(newCountText, 10) || 0;
                if (newCount > 0) {
                    el.textContent = newCountText;
                    el.style.display = '';
                } else {
                    el.style.display = 'none';
                }
            };
            updateCounter('.p-nav-link--alerts .badge');
            updateCounter('.p-nav-link--conversations .badge');
        }
    }

    function parseOnlineAdmins(htmlData) {
        if (!currentSettings.enableAdminOnlineToast || !currentSettings.adminToastNicks) return;

        let htmlDoc = htmlData;
        if (typeof htmlData === 'string') {
            const parser = new DOMParser();
            htmlDoc = parser.parseFromString(htmlData, "text/html");
        }

        if (typeof htmlDoc === 'object') {
            const nicksToTrack = currentSettings.adminToastNicks.split('\n').map(n => n.trim().toLowerCase()).filter(n => n.length > 0);
            if (nicksToTrack.length === 0) return;
            const onlineUsers = Array.from(htmlDoc.querySelectorAll('.memberListItem-name .username')).map(el => el.textContent.trim().toLowerCase());

            for (const nick of onlineUsers) {
                if (nicksToTrack.includes(nick) && !notifiedAdmins.has(nick)) {
                    showToast(`⚡ ${nick} вошел на форум!`, 'info', 5000);
                    notifiedAdmins.add(nick);
                }
            }
        }
    }
    function parseHotTopics(htmlDoc) {
        if (!currentSettings.enableHotTopicPulse) return;
        const isTopicList = document.body.classList.contains('page--forum-view') || document.body.classList.contains('page--whats-new');
        if (!isTopicList) {
            topicLastPostTimes.clear();
            return;
        }
        const newTopicTimes = new Map();       htmlDoc.querySelectorAll('.structItem[data-thread-id]').forEach(newStructItem => {
            const threadId = newStructItem.dataset.threadId;
            if (!threadId) return;
            const lastPostTimeEl = newStructItem.querySelector('.structItem-cell--lastPost .structItem-startDate');
            const lastPostTime = lastPostTimeEl ? (lastPostTimeEl.dataset.time || lastPostTimeEl.textContent.trim()) : '0';
            newTopicTimes.set(threadId, lastPostTime);
            const oldTime = topicLastPostTimes.get(threadId);

            if (oldTime === undefined) {
                 topicLastPostTimes.set(threadId, lastPostTime);
            } else if (oldTime !== lastPostTime) {
                const localStructItem = document.querySelector(`.structItem[data-thread-id="${threadId}"]`);
                if (localStructItem) {                   localStructItem.classList.add('br-hot-topic-pulse');
                    setTimeout(() => {                        localStructItem.classList.remove('br-hot-topic-pulse');
                    }, 1000);
                }
                topicLastPostTimes.set(threadId, lastPostTime);
            }
        });
        topicLastPostTimes.forEach((time, threadId) => {
            if (!newTopicTimes.has(threadId)) {
                topicLastPostTimes.delete(threadId);
            }
        });
    }

    function parseLiveFeed(htmlDoc) {
        if (!currentSettings.enableLiveFeed) return;
        const feedContainer = document.getElementById('br-live-feed-container');
        if (!feedContainer) return;
        const tickerContainer = feedContainer.querySelector('.br-live-feed-ticker');
        if (!tickerContainer) return;
        tickerContainer.innerHTML = '';
        const items = htmlDoc.querySelectorAll('.structItem.js-activityStream-item');
        let count = 0;
        for (const item of items) {
            if (count >= 2) break;
            const titleEl = item.querySelector('.structItem-title a[data-tp-primary="on"]');
            const userEl = item.querySelector('.structItem-minor .username');
            if (titleEl && userEl) {
                const title = titleEl.textContent.trim();
                const user = userEl.textContent.trim();
                const feedItem = document.createElement('div');
                feedItem.className = 'br-live-feed-item';
                const titleSpan = document.createElement('span');
                titleSpan.className = 'br-live-feed-item-title';
                titleSpan.title = title;
                titleSpan.textContent = title;
                const userSpan = document.createElement('span');
                userSpan.className = 'br-live-feed-item-user';
                userSpan.textContent = ` by ${user}`;
                feedItem.appendChild(titleSpan);
                feedItem.appendChild(userSpan);
                tickerContainer.appendChild(feedItem);
                count++;
            }
        }
        if (count > 0) {
            const itemsClone = Array.from(tickerContainer.children).map(child => child.cloneNode(true));
            itemsClone.forEach(clone => tickerContainer.appendChild(clone));
        }
    }

    function startLiveForumPollers() {
    if (liveForumPollInterval) {
        clearTimeout(liveForumPollInterval);
        liveForumPollInterval = null;
    }
    const poll = async () => {
        if (document.hidden) {
            liveForumPollInterval = setTimeout(poll, 5000);
            return;
        }
        const targetUrl = document.body.classList.contains('page--whats-new')
            ? window.location.href
            : 'https://forum.blackrussia.online/index.php?whats-new/latest-activity';
        try {
            const responseText = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: targetUrl,
                    onload: r => resolve(r.responseText),
                    onerror: reject
                });
            });
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(responseText, "text/html");
            if (currentSettings.enableLiveCounters) {
                parseLiveCounters(responseText);
            }
            if (currentSettings.enableHotTopicPulse) {
                parseHotTopics(htmlDoc);
            }
            if (currentSettings.enableLiveFeed) {
                if (targetUrl.includes('latest-activity')) {
                     parseLiveFeed(htmlDoc);
                }
            }
        } catch (e) {
            console.error(e);
        }
        const interval = Math.max(30, currentSettings.liveUpdateInterval || 60) * 1000;
        liveForumPollInterval = setTimeout(poll, interval);
    };
    liveForumPollInterval = setTimeout(poll, 1000);
}

    function setupUiSounds() {}

    function setupCopyHandler() {
        if (!currentSettings.enableCopyToast) return;

        document.addEventListener('copy', (e) => {
            const selection = document.getSelection();
            if (selection && selection.toString().length > 0) {
                showToast('✅ Скопировано в буфер обмена', 'success');
            }
        });
    }


    function setupLikeAnimations() {
        setupUiSounds();

        if (!currentSettings.enableLikeAnimations) return;

        document.body.addEventListener('click', (e) => {
            const likeButton = e.target.closest('a.reaction');
            if (likeButton && likeButton.dataset.reactionId === '1') {
                const rect = likeButton.getBoundingClientRect();
                const popEl = document.createElement('div');
                popEl.className = 'br-like-pop';
                popEl.textContent = '❤️';
                popEl.style.left = `${rect.left + rect.width / 2 - 15}px`;
                popEl.style.top = `${rect.top - 20}px`;
                document.body.appendChild(popEl);
                setTimeout(() => { popEl.remove(); }, 600);
            }
        });
    }

    function handleDynamicWelcome() {
        if (document.hidden || !currentSettings.enableDynamicWelcome) return;

        const now = new Date();
        const hour = now.getHours();
        const day = now.getDay();
        const dateKey = now.toDateString();
        const timeKey = hour < 5 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'day' : hour < 23 ? 'evening' : 'night';
        const sessionKey = 'br_session_active_v3';
        const isNewSession = !sessionStorage.getItem(sessionKey);

        const url = window.location.href;
        const isMainPage = !url.includes('/threads/') && !url.includes('/members/') && !url.includes('account') && !url.includes('search') && !url.includes('help');

        const lastDate = GM_getValue('br_last_welcome_date', '');
        const lastTime = GM_getValue('br_last_time_block', '');
        const lastRun = parseInt(GM_getValue('br_welcome_cooldown', '0'));

        let history = [];
        try {
            history = JSON.parse(GM_getValue('br_phrase_history', '[]'));
        } catch(e) { history = []; }

        const saveHistory = (phrase) => {
            let h = [phrase, ...history].slice(0, 60);
            GM_setValue('br_phrase_history', JSON.stringify(h));
        };

        const getPhrase = (arrays) => {
            const pool = arrays.flat().filter(p => !history.includes(p));
            const finalPool = pool.length < 3 ? arrays.flat() : pool;
            return finalPool[Math.floor(Math.random() * finalPool.length)];
        };

        const db = {
            calendar: [
                "🗓️ Воскресенье. Тихого дежурства, коллега.", "🗓️ Воскресенье. Сегодня лучше без суеты.", "🗓️ Воскресенье. Идеальный день закрыть хвосты.",
                "☕ Понедельник. Кофе на стол, неделю начали.", "🚀 Понедельник... Врываемся в рабочие будни.", "📉 Понедельник. Планёрки, жалобы, погнали.",
                "⚡ Вторник. Разгон взят, работаем чисто.", "🔨 Вторник. Темп отличный, держим строй.", "🧐 Вторник. Самое время разобрать закреп.",
                "🐫 Среда. Экватор недели, полёт нормальный.", "🌗 Среда. Половина пути пройдена.", "⏳ Среда. Работаем, выходные уже маячат.",
                "🔋 Четверг. Почти пятница, не расслабляемся.", "🔥 Четверг. Финальный рывок перед уик-эндом.", "💪 Четверг. Сил ещё много? Дожимаем.",
                "🎉 Пятница! Финишная прямая, друзья.", "🍷 Пятница. Добиваем дела и на отдых.", "😎 Пятница. Вечер обещает быть жарким.",
                "🏅 Суббота. Ты герой, раз тут в выходной.", "👀 Суббота. Город гуляет, админы бдят.", "🛡️ Суббота. Спокойной смены без ЧП."
            ],
            morning: [
                "🌅 Доброе утро. Чат проснулся?", "🥱 Ранний подъем? Уважаю.", "☕ Кофе, форум, работа. Классика.", "🍳 Бодрое утро! Готов к труду?",
                "☀️ С новым днем. Пусть жалоб будет мало.", "🔋 Заряжен на работу? Погнали.", "🥐 Утро начинается не с кофе, а с форума.",
                "👋 Приветствую. Надеюсь, выспался?", "📝 Планы на утро: разнести форум (в хорошем смысле).", "🚀 Утренний разгон. Поехали."
            ],
            day: [
                "☀️ Добрый день. Солнце высоко, работа кипит.", "🌡️ Как обстановка на сервере?", "🍔 Обед был? Не забывай про перерыв.",
                "📂 Рабочий полдень. Разгребаем завалы.", "🐝 Форум живет, мы работаем.", "🤝 Продуктивного дня, коллега.", "🏃 Держим темп, день в самом разгаре.",
                "👓 Солнечный день для проверки логов.", "🕹️ Игроки играют, админы работают. Баланс.", "📋 Дневная норма сама себя не сделает."
            ],
            evening: [
                "🌆 Добрый вечер. Смена не заканчивается?", "👀 Уже темнеет. Глаза не устали?", "🌇 Вечерний вайб. Спокойной работы.",
                "📉 Подводим итоги дня или еще посидим?", "🔥 Вечер — самое горячее время.", "🏎️ Продуктивно сегодня? Еще рывок.", "🎧 Чай, музыка и разбор полетов.",
                "🌙 Солнце село, просыпаются нарушители.", "✨ Вечерняя атмосфера. Работается легче?", "🍵 Уютного вечера и чистых разделов."
            ],
            night: [
                "🌙 Доброй ночи. Мафия просыпается.", "🦉 Тихого дежурства. Без происшествий.", "🥴 Ты вообще спишь? :)",
                "🍕 Ночной дожор жалоб?", "🌃 Город спит, администрация бдит.", "🤫 Самое спокойное время для работы.", "🔴 Глаза красные, но мы держимся.",
                "👻 Ночная смена — для самых стойких.", "🔦 В тишине ошибки виднее.", "✨ Звезды светят, баны летят."
            ],
            chat: [
                "🤖 Снова тут? Монстр продуктивности.", "⌨️ F5 еще не стерлась? :)", "👀 Не спится? Понимаю.", "📈 Ого, какой актив сегодня.",
                "🧹 Решил закрыть весь раздел?", "☕ Еще чашечку кофе?", "👥 Там игроки еще не закончились?", "🧘 Перерыв был? Сходи разомнись.",
                "🍵 Может, чайку? И снова в бой.", "🎯 Вижу цель — не вижу препятствий.", "💎 Стабильность — признак мастерства.",
                "🦁 Очередной заход. Уважаю упорство.", "🏠 Сегодня ты прям живешь здесь.", "🧠 Админка головного мозга в действии :)",
                "🔎 Ну как там, много нарушителей?", "🚦 Просто зашел проверить или надолго?", "🦾 Режим терминатора активирован.",
                "🛌 Слушай, а ты вообще отдыхаешь?", "💰 Твой актив бы в зарплату перевести...", "🏗️ Опять работа? Ну ты даешь.",
                "👀 Я слежу за тобой... Ты работаешь слишком хорошо.", "🚀 В таком темпе скоро повысят.", "🛑 Тормози, коллега, оставь другим работу.",
                "🕹️ Форум — твой дом родной, я погляжу.", "🔋 Батарейка не села? Энергии хоть отбавляй.", "👾 Система приветствует тебя снова."
            ],
            motivators: [
                "✨ Ты делаешь сервер чище. Это ценят.", "💨 Иногда лучше выдохнуть и не спешить.", "🛡️ Забей на хейт, делай по совести.",
                "✅ Одна закрытая жалоба — минус одна проблема.", "🧘 Не забывай, ты тоже человек. Устаешь — отдыхай.",
                "⚖️ Справедливость важнее скорости.", "🤝 Твой труд реально важен для игроков.", "🧊 Холодная голова — лучшее оружие админа.",
                "🎓 Ошибки — это опыт. Не грузись.", "🧠 Тяжелая тема? Отложи, решишь на свежую голову.",
                "😎 Будь проще, и игроки потянутся.", "🔋 Главное не выгореть. Береги нервы.", "🧹 Спасибо, что тратишь время на порядок.",
                "🦁 Ты справляешься лучше, чем думаешь.", "🍃 Вдох-выдох. Это просто форум.", "⭐ Репутация строится годами. Держи марку.",
                "💎 Ты — лицо проекта. Помни об этом.", "🚀 Каждый твой вердикт создает историю.", "🧘 Спокойствие — признак профессионала."
            ]
        };

        if (lastDate !== dateKey) {
            GM_setValue('br_last_welcome_date', dateKey);
            const phrase = db.calendar[day * 3 + Math.floor(Math.random() * 3)] || db.calendar[day];
            showToast(phrase, 'success', 7000);
            saveHistory(phrase);
            sessionStorage.setItem(sessionKey, '1');
            return;
        }

        if (lastTime !== timeKey) {
            GM_setValue('br_last_time_block', timeKey);
            const phrase = getPhrase([db[timeKey]]);
            showToast(phrase, 'info', 5000);
            saveHistory(phrase);
            sessionStorage.setItem(sessionKey, '1');
            return;
        }

        const COOLDOWN = 10 * 60 * 1000;
        if (document.body && (isNewSession || (isMainPage && (Date.now() - lastRun > COOLDOWN)))) {
            const isMotivation = Math.random() > 0.6;
            const phrase = getPhrase([isMotivation ? db.motivators : db.chat]);
            showToast(phrase, isMotivation ? 'success' : 'info', 5000);
            saveHistory(phrase);
            GM_setValue('br_welcome_cooldown', Date.now().toString());
            sessionStorage.setItem(sessionKey, '1');
        }
    }

const MODAL_OVERLAY_ID = 'br-style-copy-modal';

    function showCopyModal(bbCode) {
        if (document.getElementById(MODAL_OVERLAY_ID)) return;

        const modalOverlay = document.createElement('div');
        modalOverlay.id = MODAL_OVERLAY_ID;
        modalOverlay.className = 'br-style-modal-overlay';

        modalOverlay.innerHTML = `
            <div class="br-style-modal-content">
                <h4>✅ Скриншот загружен!</h4>
                <input type="text" id="br-style-modal-input" readonly>
                <div class="br-style-modal-buttons">
                    <button id="br-style-modal-copy-btn" class="br-style-modal-copy">Скопировать</button>
                    <button id="br-style-modal-close-btn" class="br-style-modal-close">Закрыть</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
        const input = modalOverlay.querySelector('#br-style-modal-input');
        const copyBtn = modalOverlay.querySelector('#br-style-modal-copy-btn');
        const closeBtn = modalOverlay.querySelector('#br-style-modal-close-btn');
        input.value = bbCode;
        input.select();

        const closeModal = () => {
            if (modalOverlay.parentNode) {
                modalOverlay.parentNode.removeChild(modalOverlay);
            }
        };
        copyBtn.addEventListener('click', () => {
            input.select();
            try {
                navigator.clipboard.writeText(bbCode).then(() => {
                    copyBtn.textContent = 'Скопировано!';
                    copyBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(closeModal, 700);
                }, () => {
                    document.execCommand('copy');
                    copyBtn.textContent = 'Скопировано!';
                    copyBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(closeModal, 700);
                });
            } catch (err) {
                prompt('Ошибка. Скопируйте вручную:', bbCode);
                closeModal();
            }
        });
        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
        const MAX_HISTORY_SIZE = 20;

    async function addUploadToHistory(bbCode) {
        if (!bbCode) return;
        try {
            const entry = {
                bbcode: bbCode,
                date: new Date().toISOString()
            };
            let history = [];
            try {
                history = JSON.parse(await GM_getValue(UPLOAD_HISTORY_KEY, '[]'));
                if (!Array.isArray(history)) history = [];
            } catch (e) {
                history = [];
            }
            history.unshift(entry);
            history = history.slice(0, MAX_HISTORY_SIZE);
            await GM_setValue(UPLOAD_HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error('[BR Style] Ошибка сохранения истории загрузок:', e);
        }
    }

    async function loadUploadHistory() {
    if (!settingsPanel) return;
    const container = settingsPanel.querySelector('#br-upload-history-container');
    if (!container) return;

    container.innerHTML = `
        <div class="br-skeleton-loader"></div>
        <div class="br-skeleton-loader" style="width: 80%;"></div>
        <div class="br-skeleton-loader" style="width: 90%;"></div>
    `;

    let history = [];
        try {
            history = JSON.parse(await GM_getValue(UPLOAD_HISTORY_KEY, '[]'));
            if (!Array.isArray(history)) history = [];
        } catch (e) {
            history = [];
        }

        if (history.length === 0) {
            container.innerHTML = '<p style="font-size: 12px; color: #888; text-align: center;">История загрузок пуста.</p>';
            return;
        }

        container.innerHTML = '';
        history.forEach(entry => {
            const date = new Date(entry.date);
            const dateString = date.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' });
            const item = document.createElement('div');
            item.className = 'br-history-item';
            item.style.cssText = `display: flex; justify-content: space-between; align-items: center; padding: 6px; border-bottom: 1px solid rgba(198, 198, 208, 0.1); font-size: 12px; gap: 8px;`;
            item.innerHTML = `
                <code style="background: #104C64; padding: 3px 6px; border-radius: 4px; color: #D59D80; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;" title="${entry.bbcode}">${entry.bbcode}</code>
                <span style="color: #888; white-space: nowrap; margin-left: auto;">${dateString}</span>
                <button class="br-history-copy-btn" title="Скопировать BB-код" style="background: #104C64; border: 1px solid rgba(198, 198, 208, 0.1); color: #C6C6D0; font-size: 11px; padding: 3px 7px; border-radius: 4px; cursor: pointer; flex-shrink: 0;">📋</button>
            `;
            item.querySelector('.br-history-copy-btn').addEventListener('click', (e) => {
                e.preventDefault();
                navigator.clipboard.writeText(entry.bbcode);
                showToast('BB-код скопирован!', 'success');
            });
            container.appendChild(item);
        });
    }

    function setupScreenshotUploader(textEditor) {
        if (!textEditor || textEditor.dataset.brUploaderAttached) return;
        textEditor.dataset.brUploaderAttached = 'true';

        const apiKey = currentSettings.imgbbApiKey;
        if (!apiKey) return;

        const ICON_URL = 'https://i.postimg.cc/c1m7TjfC/517c8ce85483ff710c49936c45fdc1a1.gif';
        const LOADING_GIF_URL = 'https://i.postimg.cc/cJydvFkx/fc5dd7e93fd1f4037fb311e79ccb740e.gif';
        const BUTTON_BG_URL = currentSettings.uploaderBtnBgUrl;
        const container = document.createElement('div');
        container.style.cssText = `margin: 10px 0; clear: both; width: 100%; display: flex; justify-content: center;`;
        const uploadButton = document.createElement('button');
        const originalButtonHTML = `<img src="${ICON_URL}" style="width:16px; height:16px; vertical-align:middle; margin-right:8px; filter: brightness(0.9);"> Загрузить (ImgBB)`;
        uploadButton.innerHTML = originalButtonHTML;
        uploadButton.className = 'button br-upload-button';
        const themeColor = currentSettings.edgeColor || '#E74C3C';
        uploadButton.style.cssText = `color: white; font-weight: bold; border: 1px solid ${themeColor}; padding: 6px 12px; border-radius: 5px; cursor: pointer; font-size: 14px; transition: transform 0.2s, box-shadow 0.2s; text-align: center; display: inline-block; width: auto; margin-top: 5px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); position: relative; z-index: 10;`;
        if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) {
            uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
            uploadButton.style.backgroundSize = 'cover';
            uploadButton.style.backgroundPosition = 'center';
        } else {
            uploadButton.style.background = `linear-gradient(135deg, ${themeColor}AA, ${themeColor})`;
        }

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        const uploadImage = (file) => {
            uploadButton.innerHTML = `<img src="${LOADING_GIF_URL}" style="width: 24px; height: 24px; display: block; margin: 0 auto 5px;"><span style="font-size: 12px; color: #eee;">Сжатие...</span>`;
            uploadButton.disabled = true;
            uploadButton.style.backgroundColor = '#5a5a5a';
            uploadButton.style.backgroundImage = 'none';

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                const maxSide = 1920;

                if (width > maxSide || height > maxSide) {
                    if (width > height) { height *= maxSide / width; width = maxSide; }
                    else { width *= maxSide / height; height = maxSide; }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    uploadButton.innerHTML = `<img src="${LOADING_GIF_URL}" style="width: 24px; height: 24px; display: block; margin: 0 auto 5px;"><span style="font-size: 12px; color: #eee;">Отправка...</span>`;
                    const formData = new FormData();
                    formData.append('image', blob, file.name.replace(/\.[^/.]+$/, ".jpg"));

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://api.imgbb.com/1/upload?key=${apiKey}`,
                        data: formData,
                        headers: { "Accept": "application/json" },
                        onload: function(response) {
                            uploadButton.innerHTML = originalButtonHTML;
                            uploadButton.disabled = false;
                            if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
                            else uploadButton.style.backgroundColor = '#8B0000';

                            try {
                                const json = JSON.parse(response.responseText);
                                if (json.success) {
                                    const bbCode = `[IMG]${json.data.url}[/IMG]`;
                                    addUploadToHistory(bbCode);
                                    showCopyModal(bbCode);
                                } else {
                                    throw new Error(json.error.message);
                                }
                            } catch (e) {
                                console.error('[BR Style Uploader] Error:', e);
                                showToast(`Ошибка загрузки: ${e.message}`, 'error');
                            }
                        },
                        onerror: function() {
                            uploadButton.innerHTML = originalButtonHTML;
                            uploadButton.disabled = false;
                            if (BUTTON_BG_URL && isValidURL(BUTTON_BG_URL)) uploadButton.style.backgroundImage = `url('${BUTTON_BG_URL}')`;
                            else uploadButton.style.backgroundColor = '#8B0000';
                            showToast('Ошибка сети при загрузке (ImgBB)', 'error');
                        }
                    });
                }, 'image/jpeg', 0.7);
            };
            img.onerror = () => {
                uploadButton.innerHTML = originalButtonHTML;
                uploadButton.disabled = false;
                showToast('Ошибка обработки изображения', 'error');
            };
            img.src = URL.createObjectURL(file);
        };

        textEditor.addEventListener('paste', (e) => {
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                const file = e.clipboardData.files[0];
                if (file.type.startsWith('image/')) {
                    e.preventDefault();
                    uploadImage(file);
                }
            }
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                uploadImage(fileInput.files[0]);
                fileInput.value = '';
            }
        });

        uploadButton.onclick = (e) => {
            e.preventDefault();
            fileInput.click();
        };

        container.appendChild(uploadButton);
        container.appendChild(fileInput);
        textEditor.parentNode.insertBefore(container, textEditor.nextSibling);
    }

    function findAndAttachUploader() {
        if (!currentSettings.imgbbApiKey) return;

        const quickReplyEditor = document.querySelector('.js-quickReply .js-editor');
        if (quickReplyEditor) {
            setupScreenshotUploader(quickReplyEditor);
        }       document.querySelectorAll('textarea[name="message"]').forEach(setupScreenshotUploader);
    }


    function runBinderModule() {
    const CONFIG = {
        STORAGE_KEY: 'br_binder_edit',
        MODAL_ID: 'br-modal-ice',
        BTN_ID: 'br-btn-ice',
        DEFAULT_DATA: {
            autoSend: false,
            macros: [
                { title: '<i class="fas fa-hand-paper"></i> Приветствие', text: 'Приветствую, уважаемый игрок.', settings: { font: 'Courier New', size: '4', align: 'center', color: '#3498db' } },
                { title: '<i class="fas fa-check-circle"></i> Одобрено', text: 'Одобрено, закрыто.', settings: { bold: true, align: 'center', color: '#2ecc71', imgTop: '', footer: 'Приятной игры!' } },
                { title: '<i class="fas fa-times-circle"></i> Отказано', text: 'Отказано, закрыто.', settings: { bold: true, align: 'center', color: '#e74c3c', footer: 'Недостаточно доказательств.' } }
            ]
        }
    };

    const BinderStorage = {
        load() {
            try {
                const data = localStorage.getItem(CONFIG.STORAGE_KEY);
                return data ? JSON.parse(data) : CONFIG.DEFAULT_DATA;
            } catch (e) {
                return CONFIG.DEFAULT_DATA;
            }
        },
        save(data) {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        }
    };

    const BinderCore = {
        buildBBCode(macro) {
            let content = macro.text;
            const s = macro.settings || {};
            if (s.bold) content = `[B]${content}[/B]`;
            if (s.italic) content = `[I]${content}[/I]`;
            if (s.underline) content = `[U]${content}[/U]`;
            if (s.strike) content = `[S]${content}[/S]`;
            if (s.icode) content = `[ICODE]${content}[/ICODE]`;
            if (s.code) content = `[CODE]${content}[/CODE]`;
            if (s.spoiler) content = `[SPOILER]${content}[/SPOILER]`;
            if (s.quote) content = `[QUOTE]${content}[/QUOTE]`;
            if (s.color) content = `[COLOR=${s.color}]${content}[/COLOR]`;
            if (s.font) content = `[FONT=${s.font}]${content}[/FONT]`;
            if (s.size) content = `[SIZE=${s.size}]${content}[/SIZE]`;
            if (s.imgTop) content = `[IMG]${s.imgTop}[/IMG]\n${content}`;
            if (s.footer) content = `${content}\n[FONT=Courier New][SIZE=3]${s.footer}[/SIZE][/FONT]`;
            if (s.align === 'center') content = `[CENTER]${content}[/CENTER]`;
            else if (s.align === 'right') content = `[RIGHT]${content}[/RIGHT]`;
            return content;
        },

        insertAtCursor(text) {
            const frElement = document.querySelector('.fr-element');
            const textarea = document.querySelector('textarea[name="message"]');

            if (frElement) {
                frElement.focus();
                const sel = window.getSelection();
                if (sel.rangeCount) {
                    let range = sel.getRangeAt(0);
                    let currentNode = range.commonAncestorContainer;
                    let quoteNode = null;

                    while (currentNode && currentNode !== frElement) {
                        if (currentNode.nodeName === 'BLOCKQUOTE') {
                            quoteNode = currentNode;
                            break;
                        }
                        currentNode = currentNode.parentNode;
                    }

                    if (quoteNode) {
                        range = document.createRange();
                        range.setStartAfter(quoteNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        const spacer = document.createElement('br');
                        range.insertNode(spacer);
                        range.setStartAfter(spacer);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }

                    range.deleteContents();
                    const el = document.createElement("div");
                    el.innerHTML = text.replace(/\n/g, '<br>');
                    const frag = document.createDocumentFragment();
                    let node, lastNode;
                    while ((node = el.firstChild)) {
                        lastNode = frag.appendChild(node);
                    }
                    range.insertNode(frag);
                    if (lastNode) {
                        range.setStartAfter(lastNode);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
                frElement.dispatchEvent(new Event('input', { bubbles: true }));
                return true;
            }

            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + text.length;
                textarea.focus();
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }

            return false;
        },

        executeMacro(macro) {
            const finalText = this.buildBBCode(macro);
            if (this.insertAtCursor(finalText)) {
                document.getElementById(CONFIG.MODAL_ID).style.display = 'none';
                const data = BinderStorage.load();

                if (data.autoSend) {
                    showToast('Отправка сообщения...', 'loading', 2000);
                    setTimeout(() => {
                        const form = document.querySelector('.js-quickReply');
                        const submitBtn = form ? form.querySelector('.button--icon--reply, .button--primary') : null;
                        if (submitBtn) {
                            submitBtn.click();
                            setTimeout(() => showToast('Успешно отправлено', 'success'), 500);
                        } else {
                            showToast('Кнопка отправки не найдена', 'error');
                        }
                    }, 800);
                } else {
                    showToast('Текст вставлен', 'success');
                }
            } else {
                showToast("⚠️ Поле ввода не найдено!", 'error');
            }
        }
    };

    const BinderUI = {
        injectCSS() {
            if (document.getElementById('br-binder-style-ice')) return;
            const style = document.createElement('style');
            style.id = 'br-binder-style-ice';
            style.textContent = `
                #${CONFIG.BTN_ID} { background: var(--br-nav-main-gradient, linear-gradient(270deg, #0f2027, #203a43)); background-size: 400% 400%; animation: br-ice-flow 20s ease infinite; border: 1px solid var(--br-nav-border-color, rgba(255,255,255,0.2)); color: #fff; padding: 8px 0; border-radius: 6px; width: 100%; text-align: center; font-weight: 600; margin-bottom: 8px; cursor: pointer; font-size: 13px; box-shadow: 0 2px 5px rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; gap: 8px; }
                #${CONFIG.BTN_ID}:active { transform: scale(0.98); filter: brightness(1.1); }
                #${CONFIG.MODAL_ID} { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 100000; display: none; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
                .br-modal-box { background: #141414; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); width: 90%; max-width: 380px; border-radius: 20px; border: 1px solid var(--br-nav-border-color, rgba(255,255,255,0.1)); display: flex; flex-direction: column; max-height: 85vh; box-shadow: 0 15px 50px rgba(0,0,0,0.9); overflow: hidden; font-family: sans-serif; animation: br-morph-box 10s ease-in-out infinite alternate; }
                .br-macro-list { padding: 10px; overflow-y: auto; flex-grow: 1; }
                .br-macro-item { display: flex; justify-content: space-between; align-items: stretch; background: rgba(255, 255, 255, 0.05); margin-bottom: 6px; border-radius: 6px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.05); transition: background 0.2s; }
                .br-macro-item:active { background: rgba(255, 255, 255, 0.1); }
                .br-macro-title { padding: 10px 12px; color: #c9d1d9; font-size: 13px; flex-grow: 1; cursor: pointer; }
                .br-macro-actions { display: flex; border-left: 1px solid rgba(255, 255, 255, 0.05); }
                .br-act-btn { border: none; background: transparent; padding: 0 10px; cursor: pointer; color: #8b949e; font-size: 14px; }
                .br-act-btn.edit:hover { color: #58a6ff; background: rgba(255, 255, 255, 0.1); }
                .br-act-btn.del:hover { color: #f85149; background: rgba(255, 255, 255, 0.1); }
                .br-macro-footer { padding: 10px 15px; border-top: 1px solid rgba(255, 255, 255, 0.1); background: transparent; display: flex; justify-content: space-between; align-items: center; }
                .br-add-btn { background: var(--br-nav-accent-color, #238636); border: none; color: white; padding: 6px 12px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 12px; }
                .br-autosend-label { color: #8b949e; font-size: 12px; display: flex; align-items: center; gap: 6px; }
                .br-edit-view { padding: 15px; overflow-y: auto; }
                .br-header-mini { color: #E0F7FA; font-size: 14px; margin-bottom: 10px; font-weight: bold; text-align: center; }
                .br-warning-box { background: rgba(231, 76, 60, 0.2); border: 1px solid #e74c3c; color: #ffadad; padding: 8px; border-radius: 6px; font-size: 12px; margin-bottom: 10px; text-align: center; }
                .br-label { color: #8b949e; font-size: 11px; margin-bottom: 4px; margin-top: 8px; }
                .br-group-label { color: #58a6ff; font-size: 11px; font-weight: bold; margin-bottom: 4px; margin-top: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 2px; }
                .br-input { width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #c9d1d9; padding: 8px; border-radius: 4px; box-sizing: border-box; font-size: 13px; }
                .br-textarea { width: 100%; background: rgba(0,0,0,0.2); border: 1px solid rgba(255, 255, 255, 0.1); color: #c9d1d9; padding: 8px; border-radius: 4px; box-sizing: border-box; font-family: monospace; font-size: 13px; resize: none; }
                .br-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); }
                .br-settings-grid.cols-2 { grid-template-columns: 1fr 1fr; }
                .br-check-btn { color: #c9d1d9; font-size: 12px; display: flex; align-items: center; cursor: pointer; padding: 2px 0; }
                .br-check-btn input { margin-right: 6px; }
                .br-select { background: #0d1117; color: #c9d1d9; border: 1px solid rgba(255, 255, 255, 0.1); padding: 4px; border-radius: 4px; width: 100%; font-size: 11px; }
                .br-color-input-wrapper { grid-column: span 2; display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.2); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1); color: #8b949e; font-size: 12px; }
                .br-color-input-wrapper input { background: none; border: none; height: 20px; width: 40px; cursor: pointer; }
                .br-edit-actions { display: flex; gap: 10px; margin-top: 15px; }
                .br-edit-actions button { flex: 1; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px; }
                #cancel-edit { background: #21262d; color: #c9d1d9; }
                #save-edit { background: #1f6feb; color: white; transition: 0.2s; }
            `;
            document.head.appendChild(style);
        },

        renderMain(container) {
            const data = BinderStorage.load();
            container.innerHTML = '';
            const list = document.createElement('div');
            list.className = 'br-macro-list';

            if (data.macros.length === 0) {
                list.innerHTML = '<div style="text-align:center; padding:20px; color:#777;">Нет шаблонов</div>';
            }

            data.macros.forEach((m, index) => {
                const indicatorColor = m.settings?.color || '#aaa';
                const item = document.createElement('div');
                item.className = 'br-macro-item';
                item.innerHTML = `
                    <div class="br-macro-title" style="border-left: 3px solid ${indicatorColor}">${m.title}</div>
                    <div class="br-macro-actions">
                        <button class="br-act-btn edit">✏️</button>
                        <button class="br-act-btn del">✖</button>
                    </div>
                `;
                item.querySelector('.br-macro-title').onclick = () => BinderCore.executeMacro(m);
                item.querySelector('.edit').onclick = (e) => {
                    e.stopPropagation();
                    this.renderEditor(container, m, index);
                };
                item.querySelector('.del').onclick = (e) => {
                    e.stopPropagation();
                    if(confirm('Удалить шаблон?')) {
                        data.macros.splice(index, 1);
                        BinderStorage.save(data);
                        this.renderMain(container);
                    }
                };
                list.appendChild(item);
            });

            container.appendChild(list);
            const footer = document.createElement('div');
            footer.className = 'br-macro-footer';
            footer.innerHTML = `
                <label class="br-autosend-label">
                    <input type="checkbox" id="br-autosend-check" ${data.autoSend ? 'checked' : ''}> Автоматическая отправка
                </label>
                <button id="br-add-btn" class="br-add-btn">➕ Новый</button>
            `;
            container.appendChild(footer);

            footer.querySelector('#br-autosend-check').onchange = (e) => {
                data.autoSend = e.target.checked;
                BinderStorage.save(data);
            };
            footer.querySelector('#br-add-btn').onclick = () => this.renderEditor(container);
        },

        renderEditor(container, existing = null, index = -1) {
            const s = existing ? existing.settings : {};
            container.innerHTML = `
                <div class="br-edit-view">
                    <div class="br-header-mini">${existing ? 'Редактирование' : 'Создание шаблона'}</div>
                    <div id="br-conflict-msg" class="br-warning-box" style="display:none;">⚠️ <b>Конфликт стилей!</b></div>
                    <input type="text" id="b-title" class="br-input" placeholder="Название кнопки" value="${existing ? existing.title : ''}">
                    <div class="br-label">Текст ответа:</div>
                    <textarea id="b-text" class="br-textarea" rows="3" placeholder="Введите текст...">${existing ? existing.text : ''}</textarea>

                    <div class="br-group-label">🎨 Оформление</div>
                    <div class="br-settings-grid">
                        <label class="br-check-btn"><input type="checkbox" id="s-bold" ${s.bold?'checked':''}> <b>Жирный [B]</b></label>
                        <label class="br-check-btn"><input type="checkbox" id="s-italic" ${s.italic?'checked':''}> <i>Курсив [I]</i></label>
                        <label class="br-check-btn"><input type="checkbox" id="s-underline" ${s.underline?'checked':''}> <u>Подчерк [U]</u></label>
                        <label class="br-check-btn"><input type="checkbox" id="s-strike" ${s.strike?'checked':''}> <s>Зачерк [S]</s></label>
                    </div>

                    <div class="br-group-label">📍 Позиция</div>
                    <div class="br-settings-grid">
                        <label class="br-check-btn"><input type="checkbox" id="s-center" ${s.align==='center'?'checked':''}> ≡ Центр</label>
                        <label class="br-check-btn"><input type="checkbox" id="s-right" ${s.align==='right'?'checked':''}> ⇥ Право</label>
                    </div>

                    <div class="br-group-label">🧱 Блоки</div>
                    <div class="br-settings-grid">
                        <label class="br-check-btn"><input type="checkbox" id="s-code" ${s.code?'checked':''}> ⌨ Код</label>
                        <label class="br-check-btn"><input type="checkbox" id="s-icode" ${s.icode?'checked':''}> 1-стр Код</label>
                        <label class="br-check-btn"><input type="checkbox" id="s-spoiler" ${s.spoiler?'checked':''}> 🫣 Спойлер</label>
                        <label class="br-check-btn"><input type="checkbox" id="s-quote" ${s.quote?'checked':''}> ❝ Цитата</label>
                    </div>

                    <div class="br-group-label">🔤 Шрифт и Цвет</div>
                    <div class="br-settings-grid cols-2">
                        <select id="s-font" class="br-select">
                            <option value="">Шрифт (Авто)</option>
                            <option value="Courier New" ${s.font==='Courier New'?'selected':''}>Courier New</option>
                            <option value="Times New Roman" ${s.font==='Times New Roman'?'selected':''}>Times New Roman</option>
                            <option value="Arial" ${s.font==='Arial'?'selected':''}>Arial</option>
                        </select>
                        <select id="s-size" class="br-select">
                            <option value="">Размер (Авто)</option>
                            <option value="4" ${s.size==='4'?'selected':''}>Размер 12</option>
                            <option value="5" ${s.size==='5'?'selected':''}>Размер 15</option>
                            <option value="6" ${s.size==='6'?'selected':''}>Размер 18</option>
                        </select>
                        <div class="br-color-input-wrapper">
                            <span>Цвет текста:</span>
                            <input type="color" id="s-color" value="${s.color||'#ffffff'}">
                        </div>
                    </div>

                    <div class="br-label">Дополнительно:</div>
                    <input type="text" id="b-img" class="br-input" placeholder="Картинка сверху (ссылка)" value="${s.imgTop||''}">
                    <input type="text" id="b-footer" class="br-input" placeholder="Подпись снизу" value="${s.footer||''}">

                    <div class="br-edit-actions">
                        <button id="cancel-edit">Назад</button>
                        <button id="save-edit" class="primary">Сохранить</button>
                    </div>
                </div>
            `;

            const checkConflicts = () => {
                const center = document.getElementById('s-center').checked;
                const right = document.getElementById('s-right').checked;
                const code = document.getElementById('s-code').checked;
                const icode = document.getElementById('s-icode').checked;
                const msg = document.getElementById('br-conflict-msg');
                const saveBtn = document.getElementById('save-edit');

                if ((center && right) || (code && icode)) {
                    msg.style.display = 'block';
                    saveBtn.disabled = true;
                    saveBtn.style.opacity = '0.5';
                } else {
                    msg.style.display = 'none';
                    saveBtn.disabled = false;
                    saveBtn.style.opacity = '1';
                }
            };

            container.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.addEventListener('change', checkConflicts));
            document.getElementById('cancel-edit').onclick = () => this.renderMain(container);
            document.getElementById('save-edit').onclick = () => {
                const title = document.getElementById('b-title').value;
                const textRaw = document.getElementById('b-text').value;
                if (!title || !textRaw) return alert('Заполните название и текст!');

                const newSettings = {
                    bold: document.getElementById('s-bold').checked,
                    italic: document.getElementById('s-italic').checked,
                    underline: document.getElementById('s-underline').checked,
                    strike: document.getElementById('s-strike').checked,
                    code: document.getElementById('s-code').checked,
                    icode: document.getElementById('s-icode').checked,
                    spoiler: document.getElementById('s-spoiler').checked,
                    quote: document.getElementById('s-quote').checked,
                    align: document.getElementById('s-center').checked ? 'center' : (document.getElementById('s-right').checked ? 'right' : 'left'),
                    font: document.getElementById('s-font').value,
                    size: document.getElementById('s-size').value,
                    color: document.getElementById('s-color').value,
                    imgTop: document.getElementById('b-img').value,
                    footer: document.getElementById('b-footer').value
                };

                const data = BinderStorage.load();
                const newMacro = { title, text: textRaw, settings: newSettings };

                if (index >= 0) data.macros[index] = newMacro;
                else data.macros.push(newMacro);

                BinderStorage.save(data);
                this.renderMain(container);
            };
        }
    };

    BinderUI.injectCSS();

    if (!document.getElementById(CONFIG.MODAL_ID)) {
        const modal = document.createElement('div');
        modal.id = CONFIG.MODAL_ID;
        modal.innerHTML = `
            <div class="br-modal-box">
                <div style="padding:10px 15px; background:#161b22; border-bottom:1px solid #30363d; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-weight:bold; color:#E0F7FA; font-size:14px;">📜 Шаблоны ответов</span>
                    <span style="cursor:pointer; padding:5px; font-size:16px; color:#8b949e;" onclick="document.getElementById('${CONFIG.MODAL_ID}').style.display='none'">✖</span>
                </div>
                <div id="br-modal-body-ice" style="display:flex; flex-direction:column; overflow:hidden; height: 100%;"></div>
            </div>`;
        document.body.appendChild(modal);
        modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };
    }

    const editorWrapper = document.querySelector('.js-quickReply .message-editorWrapper');
    if (editorWrapper && !document.getElementById(CONFIG.BTN_ID)) {
        const btn = document.createElement('div');
        btn.id = CONFIG.BTN_ID;
        btn.innerHTML = '📜 Шаблоны ответов';
        btn.onclick = () => {
            const modal = document.getElementById(CONFIG.MODAL_ID);
            BinderUI.renderMain(modal.querySelector('#br-modal-body-ice'));
            modal.style.display = 'flex';
        };
        editorWrapper.insertBefore(btn, editorWrapper.firstChild);
    }
}

function showSkeletonLoader() {
        if (document.getElementById('br-skeleton-layer')) return;

        const isMobile = window.innerWidth < 900;
        const nav = performance.getEntriesByType("navigation")[0];
        const hideTip = nav && (nav.type === 'reload' || nav.type === 'back_forward');

        const style = document.createElement('style');
        style.id = 'br-skeleton-css';
        style.textContent = `
            .p-pageWrapper { opacity: 0; transition: opacity 0.3s ease; }
            .br-content-visible { opacity: 1 !important; }
            #br-skeleton-layer { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #0e0e10; z-index: 9000; overflow-y: scroll; transition: opacity 0.3s; }
            .br-skeleton-fade-out { opacity: 0 !important; pointer-events: none; }
            @keyframes br-glare { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(250%) skewX(-20deg); } }
            @keyframes br-progress { 0% { width: 0%; } 40% { width: 60%; } 100% { width: 95%; } }

            .br-shimmer { position: relative; background: #1c1c1f; overflow: hidden; border: none !important; box-shadow: none !important; }
            .br-shimmer::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); transform: translateX(-100%); animation: br-glare 1.4s infinite cubic-bezier(0.4, 0, 0.2, 1); }

            .br-sk-progress-bar { position: fixed; top: 0; left: 0; height: 3px; background: var(--br-edge-color, #d32f2f); z-index: 9001; box-shadow: 0 0 15px var(--br-edge-color, #d32f2f); animation: br-progress 4s forwards; }

            .br-sk-body { display: flex; width: 96%; margin: 130px auto 50px; gap: 20px; align-items: flex-start; }
            .br-sk-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 15px; }
            .br-sk-sidebar { width: 300px; flex-shrink: 0; display: flex; flex-direction: column; gap: 20px; }

            .br-sk-block-header { height: 50px; margin-bottom: 10px; border-radius: 6px; width: 40%; }
            .br-sk-row { display: flex; gap: 15px; padding: 15px; background: #161618; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03); align-items: center; }
            .br-sk-ava { width: 45px; height: 45px; border-radius: 50%; flex-shrink: 0; }
            .br-sk-content { flex: 1; display: flex; flex-direction: column; gap: 10px; }
            .br-sk-text { height: 12px; border-radius: 4px; width: 100%; }
            .br-sk-text.w-40 { width: 40%; } .br-sk-text.w-60 { width: 60%; }

            .br-sk-widget { height: 200px; border-radius: 8px; width: 100%; }

            .br-sk-tip-container { position: absolute; top: 70px; left: 50%; transform: translateX(-50%); width: 100%; text-align: center; pointer-events: none; }
            .br-sk-tip-text { background: rgba(20,20,23,0.9); border: 1px solid rgba(255,255,255,0.05); padding: 8px 20px; border-radius: 50px; color: #aaa; font-size: 13px; display: inline-flex; align-items: center; gap: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); backdrop-filter: blur(5px); }
            .br-sk-tip-highlight { color: var(--br-edge-color, #d32f2f); font-weight: bold; }

            @media (max-width: 900px) { .br-sk-sidebar { display: none; } .br-sk-body { width: 95%; margin-top: 100px; } }
        `;
        document.head.appendChild(style);

        const tips = [
            "Никому не сообщайте пароль, даже администрации.", "Используйте /binder для быстрой отыгровки.",
            "Фиксируйте условия сделок на видео с /time.", "Команда /mm открывает меню персонажа.",
            "Привяжите Telegram и VK к аккаунту.", "Покупайте авто только на б/у или в салонах.",
            "Соблюдайте правила сервера.", "Читеров репортим через /report.",
            "Проверяйте форум на наличие заявок.", "RP сон разрешен без формы.",
            "Не качайте читы и сборки.", "Админы не просят пароль.",
            "Используйте /gps для поиска мест.", "Смена NonRP ника через меню.",
            "Учите термины DM, DB, SK, TK.", "Будьте вежливы с игроками.",
            "Новости в группе VK.", "Проверяйте жалобы на форуме.",
            "Соблюдайте правила ограблений.", "Сложный пароль — залог безопасности.",
            "Не ведитесь на удвоение денег.", "Команда /anim — анимации.",
            "Военный билет нужен для госслужб.", "Следите за авто через /carpass.",
            "Соблюдайте ценовую политику.", "В казино играйте осторожно.",
            "Уважайте лидеров фракций.", "Для семьи нужен 2 уровень.",
            "Закупайте продукты в бизнес.", "Используйте /f и /fn чаты.",
            "Полиция: /wanted для розыска.", "Лицензии в Правительстве.",
            "Медкарта в больнице.", "Не капсите в чат.",
            "MG — это смешивание чатов.", "Отыгрывайте ДТП.",
            "Команда /eject выкидывает из авто.", "Кольца в 24/7 для свадьбы.",
            "Ешьте в закусочных.", "Оплачивайте жилье в банке.",
            "Оск родных — бан навсегда.", "/try для спорных ситуаций.",
            "/history — история ников.", "Общайтесь в Курилке.",
            "Скрины с /time — 3 дня.", "Не спамьте в репорт.",
            "Тюнинг авто в СТО.", "VIP дает бонусы."
        ];

        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const tipHTML = hideTip ? '' : `
            <div class="br-sk-tip-container">
                <span class="br-sk-tip-text">
                    <i class="fas fa-info-circle"></i> <span class="br-sk-tip-highlight">INFO:</span> ${randomTip}
                </span>
            </div>`;

        let mainContent = '';
        const href = window.location.href;

        if (href.includes('threads/')) {
            mainContent = `
                <div class="br-sk-block-header br-shimmer" style="height: 60px; width: 70%; margin-bottom: 20px;"></div>
                <div class="br-sk-row" style="margin-bottom: 20px; background: transparent; padding: 0; border: none;">
                    <div class="br-sk-ava br-shimmer" style="width: 60px; height: 60px;"></div>
                    <div class="br-sk-content">
                        <div class="br-sk-text br-shimmer w-40" style="height: 15px;"></div>
                        <div class="br-sk-text br-shimmer w-60"></div>
                    </div>
                </div>
                <div class="br-shimmer" style="width: 100%; height: 200px; border-radius: 8px; margin-bottom: 15px;"></div>
                <div class="br-sk-text br-shimmer w-40"></div>`;
        } else if (href.includes('members/')) {
            mainContent = `
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div class="br-shimmer" style="width: 200px; height: 200px; border-radius: 8px;"></div>
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
                        <div class="br-shimmer" style="height: 40px; width: 50%;"></div>
                        <div class="br-shimmer" style="height: 20px; width: 30%;"></div>
                        <div class="br-shimmer" style="height: 100px; width: 100%;"></div>
                    </div>
                </div>`;
        } else {
            mainContent = `
                <div class="br-sk-block-header br-shimmer"></div>
                ${Array(8).fill(0).map(() => `
                <div class="br-sk-row">
                    <div class="br-sk-ava br-shimmer"></div>
                    <div class="br-sk-content">
                        <div class="br-sk-text br-shimmer w-60"></div>
                        <div class="br-sk-text br-shimmer w-40" style="margin-top: 5px;"></div>
                    </div>
                </div>`).join('')}`;
        }

        const sidebarContent = isMobile ? '' : `
            <div class="br-sk-sidebar">
                <div class="br-sk-widget br-shimmer" style="height: 150px;"></div>
                <div class="br-sk-widget br-shimmer" style="height: 250px;"></div>
            </div>`;

        const layer = document.createElement('div');
        layer.id = 'br-skeleton-layer';
        layer.innerHTML = `
            <div class="br-sk-progress-bar"></div>
            ${tipHTML}
            <div class="br-sk-body">
                <div class="br-sk-main">
                    ${mainContent}
                </div>
                ${sidebarContent}
            </div>
        `;
        document.documentElement.appendChild(layer);

        const removeSkeleton = () => {
            if (layer.dataset.closing) return;
            layer.dataset.closing = 'true';
            layer.classList.add('br-skeleton-fade-out');
            document.querySelector('.p-pageWrapper')?.classList.add('br-content-visible');
            setTimeout(() => {
                layer.remove();
                style.remove();
                document.querySelector('.p-pageWrapper')?.classList.remove('br-content-visible');
            }, 300);
        };

        const timer = setTimeout(removeSkeleton, 5000);
        const onLoad = () => { clearTimeout(timer); removeSkeleton(); };

        if (document.readyState === 'complete') onLoad();
        else window.addEventListener('load', onLoad);
    }

function setupPageTransitions() {
    if (document.getElementById('br-page-transition-style')) return;

    const style = document.createElement('style');
    style.id = 'br-page-transition-style';
    style.textContent = `
        .br-page-exit-overlay {
            position: fixed; inset: 0; background: #09090b; opacity: 0;
            pointer-events: none; z-index: 19999;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .br-page-exit-active { opacity: 1; pointer-events: auto; }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'br-page-exit-overlay';
    document.body.appendChild(overlay);

    document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        if (e.ctrlKey || e.shiftKey || e.metaKey || e.button === 1) return;

        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.getAttribute('target') === '_blank') return;

        if (link.classList.contains('menuTrigger') ||
            link.classList.contains('overlayTrigger') ||
            link.classList.contains('username') ||
            link.closest('.p-nav-group') ||
            link.closest('.menu') ||
            link.closest('.overlay-container') ||
            link.getAttribute('data-xf-click') === 'overlay' ||
            link.getAttribute('data-xf-click') === 'menu') {
            return;
        }

        const url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname && url.hash) return;

        overlay.classList.add('br-page-exit-active');

        setTimeout(() => {
            overlay.classList.remove('br-page-exit-active');
        }, 2000);
    });

    window.addEventListener('pageshow', () => {
        overlay.classList.remove('br-page-exit-active');
    });
}

    function setupGallery() {
        const images = document.querySelectorAll('.message-body img:not(.smilie):not([class*="attachment"]), .bbImage');
        if (images.length === 0) return;
        let overlay = document.getElementById('br-gallery-overlay');
        if (!overlay) {
        overlay = document.createElement('div');
overlay.id = 'br-gallery-overlay';
        overlay.innerHTML = `<div class="br-gallery-close">×</div><div class="br-gallery-content"><img src="" class="br-gallery-img"></div><div class="br-gallery-prev">‹</div><div class="br-gallery-next">›</div>`;
        overlay.style.cssText = `position: fixed; top: 0; left: 0;
width: 100%; height: 100%; background: rgba(0,0,0,0.95); z-index: 20020; display: none; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s;`;
overlay.querySelector('.br-gallery-img').style.cssText = `max-width: 95%; max-height: 95vh; object-fit: contain; box-shadow: 0 0 20px rgba(0,0,0,0.5);`;
        const btnStyle = `position: absolute; color: white;
font-size: 40px; cursor: pointer; padding: 20px; user-select: none; transition: 0.2s;`;
        overlay.querySelector('.br-gallery-close').style.cssText = `position: absolute; top: 20px; right: 30px; color: white;
font-size: 40px; cursor: pointer; z-index: 20001;`;
        overlay.querySelector('.br-gallery-prev').style.cssText = `${btnStyle} left: 20px;`;
        overlay.querySelector('.br-gallery-next').style.cssText = `${btnStyle} right: 20px;`;
        document.body.appendChild(overlay);
}
        let currentIndex = 0; const galleryImgs = Array.from(images);
        const updateImage = () => { overlay.querySelector('.br-gallery-img').src = galleryImgs[currentIndex].src; };
        galleryImgs.forEach((img, index) => {
            img.style.cursor = 'zoom-in';
            img.onclick = (e) => { e.preventDefault(); currentIndex = index; updateImage(); overlay.style.display = 'flex'; setTimeout(() => overlay.style.opacity = '1', 10); };
        });
        overlay.querySelector('.br-gallery-close').onclick = () => { overlay.style.opacity = '0'; setTimeout(() => overlay.style.display = 'none', 300); };
        overlay.querySelector('.br-gallery-next').onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % galleryImgs.length; updateImage(); };
        overlay.querySelector('.br-gallery-prev').onclick = (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length; updateImage(); };
        overlay.onclick = (e) => { if(e.target === overlay || e.target.classList.contains('br-gallery-content')) overlay.querySelector('.br-gallery-close').click(); };
    }

    const ModeratorModule = {
        state: {
            previewCache: new Map(),
            previewPending: new Map(),
            activeFilter: null,
            modal: null
        },

        constants: {
            CLOSED_PREFIXES: ['закрыто', 'одобрено', 'отказано', 'решено', 'рассмотрено', 'тестирование', 'архив', 'closed', 'approved', 'denied', 'resolved', 'reviewed', 'testing', 'archive', 'реализовано', 'completed']
        },

        initTracker() {
            if (!currentSettings.enableComplaintTracker) return;
            const targetUrlParts = (currentSettings.complaintTrackerSections || '').split(',').map(s => s.trim().toLowerCase()).filter(s => s);
            const currentUrl = decodeURIComponent(window.location.href).toLowerCase();
            const pathname = window.location.pathname;
            const isMainForumPage = (pathname === '/forum/' || pathname === '/forum/index.php' || pathname === '/');
            const isTargetSection = targetUrlParts.some(part => currentUrl.includes(part));
            if (!isMainForumPage && !isTargetSection) return;

            const TIME_WARN = currentSettings.complaintTrackerWarnTime || 12;
            const TIME_CRIT = currentSettings.complaintTrackerCritTime || 24;

            const getBadgeConfig = (item, hours) => {
                const isPinned = item.querySelector('.structItem-status--sticky');
                const label = item.querySelector('.label');
                const labelText = label ? label.textContent.toLowerCase() : '';
                const isLocked = item.querySelector('.structItem-status--locked');
                const isClosed = isLocked || this.constants.CLOSED_PREFIXES.some(p => labelText.includes(p));

                if (!isPinned && isClosed) return null;
                if (isPinned && hours < TIME_WARN) return { class: 'br-flow-pinned-ok', icon: '<i class="fas fa-thumbtack"></i>' };
                if (hours < TIME_WARN) return { class: 'br-flow-fresh', icon: '<i class="fas fa-clock"></i>' };
                if (hours < TIME_CRIT) return { class: 'br-flow-warn', icon: '<i class="fas fa-hourglass-half"></i>' };
                return { class: 'br-flow-crit', icon: '<i class="fas fa-fire"></i>' };
            };

            const showCopyToast = (text) => {
                const toast = document.createElement('div');
                toast.className = 'br-copy-tooltip';
                toast.innerHTML = `📋 ${text}`;
                document.body.appendChild(toast);
                setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 1500);
            };

            const updateThreads = () => {
                document.querySelectorAll('.structItem').forEach(thread => {
                    const times = Array.from(thread.querySelectorAll('time'));
                    if (times.length === 0) return;

                    let maxTime = 0;
                    times.forEach(t => {
                        const val = parseInt(t.getAttribute('data-time'));
                        if (val > maxTime) maxTime = val;
                    });

                    const diff = Date.now() - (maxTime * 1000);
                    const hoursTotal = diff / (1000 * 60 * 60);
                    let timeStr = hoursTotal >= 24 ?
                        `${Math.floor(hoursTotal / 24)}д ${Math.floor(hoursTotal % 24)}ч` :
                        `${Math.floor(hoursTotal)}ч ${Math.floor((hoursTotal - Math.floor(hoursTotal)) * 60)}м`;

                    const config = getBadgeConfig(thread, hoursTotal);
                    if (!config) return;

                    let badge = thread.querySelector('.br-neon-badge');
                    if (!badge) {
                        badge = document.createElement('span');
                        badge.className = 'br-neon-badge ' + config.class;
                        badge.title = 'Нажми, чтобы скопировать ссылку';
                        badge.onclick = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const link = thread.querySelector('.structItem-title a[data-tp-primary]');
                            if (link) {
                                const fullUrl = link.href;
                                navigator.clipboard ? navigator.clipboard.writeText(fullUrl) : GM_setClipboard(fullUrl);
                                showCopyToast('Ссылка скопирована!');
                            }
                        };
                        const titleContainer = thread.querySelector('.structItem-title');
                        const link = titleContainer.querySelector('a[data-tp-primary]');
                        if (link) titleContainer.insertBefore(badge, link);
                    } else {
                        badge.className = 'br-neon-badge ' + config.class;
                    }
                    badge.innerHTML = `${config.icon} ${timeStr}`;
                });
            };

            updateThreads();
            if (this.state.trackerInterval) clearInterval(this.state.trackerInterval);
            this.state.trackerInterval = setInterval(updateThreads, 60000);
        },

        initStatsAndPreview() {
            if (!currentSettings.enableSectionStats && !currentSettings.enableThreadPreview) return;
            if (!document.querySelector('.structItem')) return;

            this.createModal();

            if (currentSettings.enableSectionStats) this.renderStats();
            if (currentSettings.enableThreadPreview) this.renderPreviewButtons();
        },

        createModal() {
            if (document.querySelector('.br-modal-overlay')) {
                this.state.modal = {
                    overlay: document.querySelector('.br-modal-overlay'),
                    content: document.querySelector('.br-modal-content'),
                    title: document.querySelector('.br-modal-title'),
                    avatar: document.querySelector('.br-modal-avatar'),
                    date: document.querySelector('.br-modal-date')
                };
                return;
            }

            const overlay = document.createElement('div');
    overlay.className = 'br-modal-overlay';
overlay.innerHTML = `<div class="br-modal-window"><div class="br-modal-header"><img src="" class="br-modal-avatar"><div class="br-modal-meta"><div class="br-modal-title"></div><div class="br-modal-date"></div></div><div class="br-modal-close"><i class="fas fa-times"></i></div></div><div class="br-modal-content"></div></div>`;
    document.body.appendChild(overlay);
this.state.modal = {
                overlay: overlay,
                content: overlay.querySelector('.br-modal-content'),
                title: overlay.querySelector('.br-modal-title'),
                avatar: overlay.querySelector('.br-modal-avatar'),
                date: overlay.querySelector('.br-modal-date')
            };

            const close = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };
            overlay.querySelector('.br-modal-close').addEventListener('click', close);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
            this.state.modal.content.addEventListener('click', (e) => {
                const btn = e.target.closest('.button--spoiler');
                if (btn) { e.preventDefault(); const container = btn.closest('.bbCodeSpoiler'); if (container) container.classList.toggle('spoiler-open'); }
            });
        },

        renderStats() {
            const container = document.querySelector('.p-body-pageContent');
            if (container && !document.querySelector('.br-stats-dashboard')) {
                let s = { imp:0, con:0, wai:0, ok:0, clo:0 };
                document.querySelectorAll('.structItem').forEach(item => {
                    const txt = (item.querySelector('.label')?.textContent || '').toLowerCase();
                    if (item.querySelector('.structItem-status--sticky')) s.imp++;
                    if (txt.includes('рассмотрен') || txt.includes('закреплено')) s.con++;
                    else if (txt.includes('ожидани') || txt.includes('техническ')) s.wai++;
                    else if (txt.includes('одобрено') || txt.includes('решено')) s.ok++;
                    else if (txt.includes('закрыто') || txt.includes('отказано') || txt.includes('рассмотрено')) s.clo++;
                });

                const div = document.createElement('div');
                div.className = 'br-stats-dashboard';
                div.innerHTML = `
                    <div class="br-stat-card s-wai ${s.wai > 0 ? 'pulse-alert' : ''}" data-type="wai"><div class="br-stat-icon"><i class="fas fa-hourglass-half"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.wai}">0</div><div class="br-stat-lbl">Ожидание</div></div></div>
                    <div class="br-stat-card s-con" data-type="con"><div class="br-stat-icon"><i class="fas fa-user-edit"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.con}">0</div><div class="br-stat-lbl">На рассм.</div></div></div>
                    <div class="br-stat-card s-imp" data-type="imp"><div class="br-stat-icon"><i class="fas fa-thumbtack"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.imp}">0</div><div class="br-stat-lbl">Важно</div></div></div>
                    <div class="br-stat-card s-ok" data-type="ok"><div class="br-stat-icon"><i class="fas fa-check"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.ok}">0</div><div class="br-stat-lbl">Одобрено</div></div></div>
                    <div class="br-stat-card s-clo" data-type="clo"><div class="br-stat-icon"><i class="fas fa-lock"></i></div><div class="br-stat-info"><div class="br-stat-val" data-target="${s.clo}">0</div><div class="br-stat-lbl">Закрыто</div></div></div>
                `;
                container.insertBefore(div, container.firstChild);

                div.querySelectorAll('.br-stat-card').forEach(card => card.addEventListener('click', () => this.filterThreads(card.dataset.type)));
                this.animateNumbers(div);
            }
        },

        filterThreads(type) {
            const cards = document.querySelectorAll('.br-stat-card');
            const items = document.querySelectorAll('.structItem');

            if (this.state.activeFilter === type) {
                this.state.activeFilter = null;
                cards.forEach(c => { c.classList.remove('active'); c.classList.remove('dimmed'); });
                items.forEach(item => item.classList.remove('br-filtered-hide'));
                return;
            }

            this.state.activeFilter = type;
            cards.forEach(c => {
                if (c.dataset.type === type) { c.classList.add('active'); c.classList.remove('dimmed'); }
                else { c.classList.remove('active'); c.classList.add('dimmed'); }
            });

            items.forEach(item => {
                const txt = (item.querySelector('.label')?.textContent || '').toLowerCase();
                const isLocked = item.querySelector('.structItem-status--locked');
                const isSticky = item.querySelector('.structItem-status--sticky');
                let match = false;

                if (type === 'wai' && (txt.includes('ожидани') || txt.includes('техническ'))) match = true;
                else if (type === 'con' && (txt.includes('рассмотрен') || txt.includes('закреплено'))) match = true;
                else if (type === 'imp' && isSticky) match = true;
                else if (type === 'ok' && (txt.includes('одобрено') || txt.includes('решено'))) match = true;
                else if (type === 'clo' && (txt.includes('закрыто') || txt.includes('отказано') || isLocked)) match = true;

                if (match) item.classList.remove('br-filtered-hide'); else item.classList.add('br-filtered-hide');
            });
        },

        animateNumbers(container) {
            container.querySelectorAll('.br-stat-val').forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                if (target > 0) {
                    let startTimestamp = null;
                    const step = (timestamp) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / 800, 1);
                        el.innerHTML = Math.floor(progress * target);
                        if (progress < 1) window.requestAnimationFrame(step);
                    };
                    window.requestAnimationFrame(step);
                } else el.innerHTML = "0";
            });
        },

        renderPreviewButtons() {
            if (!document.getElementById('br-preview-styles')) {
                const st = document.createElement('style');
                st.id = 'br-preview-styles';
                st.textContent = `.br-preview-btn { float: right; margin-left: 6px; margin-right: 4px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; background: rgba(0,0,0,0.2); border-radius: 6px; color: var(--br-primary); cursor: pointer; border: 1px solid var(--br-primary); box-shadow: 0 0 5px var(--br-primary); font-size: 11px; transition: all 0.2s; position: relative; z-index: 20; pointer-events: auto; touch-action: manipulation; } .br-preview-btn:hover, .br-preview-btn:active { background: var(--br-primary); color: #000; transform: scale(1.1); box-shadow: 0 0 15px var(--br-primary); }`;
                document.head.appendChild(st);
            }

            document.querySelectorAll('.structItem-title').forEach(title => {
                if (title.querySelector('.br-preview-btn')) return;
                let link = title.querySelector('a[data-tp-primary]');
                if (!link) link = title.querySelector('a:not(.labelLink):not(.label)');
                if (!link) return;

                const btn = document.createElement('div');
                btn.className = 'br-preview-btn';
                btn.innerHTML = '<i class="fas fa-eye"></i>';
                btn.title = 'Предпросмотр';

                const badge = title.querySelector('.br-neon-badge');
                if (badge) title.insertBefore(btn, badge);
                else title.insertBefore(btn, link);

                btn.addEventListener('mouseenter', () => this.fetchPreviewUrl(link.href));
                const openModal = (e) => {
                    if (e.cancelable) e.preventDefault();
                    e.stopPropagation(); e.stopImmediatePropagation();
                    this.loadThreadPreview(link.href, link.textContent.trim());
                    return false;
                };
                btn.addEventListener('click', openModal);
                btn.addEventListener('touchend', openModal);
            });
        },

        fetchPreviewUrl(url) {
            if (this.state.previewCache.has(url)) return Promise.resolve(this.state.previewCache.get(url));
            if (this.state.previewPending.has(url)) return this.state.previewPending.get(url);

            const promise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET", url: url,
                    onload: (response) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const firstPost = doc.querySelector('.message-body .bbWrapper');
                        const avatar = doc.querySelector('.message-avatar img')?.src || '';
                        const date = doc.querySelector('.message-attribution-main time')?.textContent || '';
                        const data = { html: firstPost ? firstPost.innerHTML : 'Текст не найден', avatar: avatar, date: date };
                        this.state.previewCache.set(url, data);
                        this.state.previewPending.delete(url);
                        resolve(data);
                    },
                    onerror: () => { this.state.previewPending.delete(url); reject(); }
                });
            });
            this.state.previewPending.set(url, promise);
            return promise;
        },

        loadThreadPreview(url, title) {
            this.state.modal.title.textContent = title;
            this.state.modal.date.textContent = 'Загрузка...';
            this.state.modal.avatar.style.display = 'none';
            this.state.modal.content.innerHTML = `<div class="br-sk-preview-layout"><div class="br-sk-preview-left"><div class="br-sk-circle br-shimmer"></div></div><div class="br-sk-preview-right"><div class="br-sk-line br-shimmer" style="width: 30%"></div><div class="br-sk-line br-shimmer"></div><div class="br-sk-line br-shimmer"></div><div class="br-sk-line br-shimmer short"></div></div></div>`;
            this.state.modal.overlay.classList.add('active');
            document.body.style.overflow = 'hidden';

            this.fetchPreviewUrl(url).then(data => {
                if (this.state.modal.overlay.classList.contains('active')) {
                    this.state.modal.content.innerHTML = data.html
                        .replace(/([A-Z][a-z]+_[A-Z][a-z]+)/g, '<span class="br-hl-nick">$1</span>')
                        .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '<span class="br-hl-ip">$&</span>');
                    this.state.modal.content.querySelectorAll('.js-reaction, .js-quickReply, .message-signature').forEach(el => el.remove());
                    this.state.modal.date.textContent = data.date;
                    if (data.avatar) {
                        this.state.modal.avatar.src = data.avatar;
                        this.state.modal.avatar.style.display = 'block';
                    }
                }
            }).catch(() => { this.state.modal.content.innerHTML = '<div style="text-align:center;color:#e74c3c">Ошибка сети</div>'; });
        }
    };

    function runComplaintTracker() { ModeratorModule.initTracker(); }
    function runStatsAndPreview() { ModeratorModule.initStatsAndPreview(); }

           async function initialize() {
                try {

            const antiFouc = document.createElement('style');
            antiFouc.innerHTML = '';
            (document.head || document.documentElement).appendChild(antiFouc);

            injectStaticStyles();
            await loadSettings();

            if (currentSettings.enableSkeletonLoading) {
                showSkeletonLoader();
                try { setupPageTransitions(); } catch (e) { console.error(e); }
            }

            if (currentSettings.enableContextualBackgrounds && currentSettings.contextualBgUrl && window.location.href.toLowerCase().includes(currentSettings.contextualBgUrl.toLowerCase())) {
                const contextPresetName = currentSettings.contextualBgPreset;
                let contextPresetData = builtInPresets[contextPresetName] || currentSettings.customPresets[contextPresetName];
                if (contextPresetData) {
                    currentSettings = { ...currentSettings, ...contextPresetData };
                }
            }
            applyForumStyles(currentSettings);

            requestAnimationFrame(() => {
                if (antiFouc) {
                    antiFouc.innerHTML = 'html { opacity: 1 !important; visibility: visible !important; transition: opacity 0.4s ease !important; }';
                    setTimeout(() => antiFouc.remove(), 600);
                }
            });

            const onDomReady = async () => {
                const runModule = (fn) => {
                    try {
                        fn();
                    } catch (e) {
                        console.error(e);
                    }
                };
                runModule(() => {
                    document.addEventListener('mousemove', (e) => {
                        document.querySelectorAll('.br-spotlight').forEach(card => {
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            card.style.setProperty('--mouse-x', `${x}px`);
                            card.style.setProperty('--mouse-y', `${y}px`);
                        });
                    }, { passive: true });
                });
                runModule(createBackgroundElement);
                runModule(createPanelHTML);
                runModule(createBottomNavBarElement);
                runModule(createScrollIndicatorElement);
                runModule(findMyUsername);
                runModule(handleDynamicWelcome);
                runModule(findThreadAuthor);
                runModule(() => updateBottomNavBarContent(currentSettings));
                runModule(() => manageVisualEffects(currentSettings));
                runModule(addSettingsIconHTML);
                runModule(setupBrWorker);
                if (currentSettings.enableBinder) {
                    runModule(runBinderModule);
                }
                if (settingsIcon && bottomNavElement) {
                    if (currentSettings.enableBottomNav) {
                        const utilsContainer = bottomNavElement.querySelector('.br-nav-utilities');
                        if (utilsContainer) {
                            utilsContainer.prepend(settingsIcon);
                        }
                    } else {
                        document.body.appendChild(settingsIcon);
                    }
                }
                runModule(() => {
                    handleScroll();
                    setupScrollObserver(currentSettings);
                    document.addEventListener('scroll', handleScroll, { passive: true });
                });
                runModule(() => {
                    setupCopyHandler();
                    setupLikeAnimations();
                    runComplaintTracker();
                    startLiveForumPollers();
                    runStatsAndPreview();
                    setupGallery();

                    const runOdometer = () => {
                        const style = document.createElement('style');
                        style.textContent = '.pairs dd, .p-navgroup-link--user .badge, .br-stat-val { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; letter-spacing: 0.5px; }';
                        document.head.appendChild(style);

                        const nav = performance.getEntriesByType("navigation")[0];
                        const shouldAnimate = !nav || (nav.type !== 'reload' && nav.type !== 'back_forward');

                        const targets = document.querySelectorAll('.pairs dd, .p-navgroup-link--user .badge, .br-stat-val');
                        
                        if (!shouldAnimate) return;

                        const observer = new IntersectionObserver((entries, obs) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    const el = entry.target;
                                    if (el.dataset.odometerInit) return;
                                    
                                    const originalText = el.dataset.originalText || el.textContent.trim();
                                    
                                    const match = originalText.match(/^([\d\s.,]+)(.*)$/);
                                    if (!match) {
                                        obs.unobserve(el);
                                        return;
                                    }

                                    const numPart = match[1].trim(); 
                                    const suffix = match[2]; 

                                    const cleanNum = numPart.replace(/\s/g, '').replace(',', '.');
                                    const targetValue = parseFloat(cleanNum);
                                    
                                    if (isNaN(targetValue) || targetValue <= 0) {
                                        obs.unobserve(el);
                                        return;
                                    }

                                    const hasComma = numPart.includes(',');
                                    const decimalPlaces = hasComma ? numPart.split(',')[1].length : 0;

                                    el.dataset.odometerInit = 'true';
                                    const duration = 2000; 
                                    const startTime = performance.now();
                                    
                                    const animate = (time) => {
                                        let timeFraction = (time - startTime) / duration;
                                        if (timeFraction > 1) timeFraction = 1;
                                        
                                        const progress = 1 - Math.pow(1 - timeFraction, 5);
                                        const currentVal = progress * targetValue;
                                        
                                        let formatted;
                                        if (decimalPlaces > 0) {
                                            formatted = currentVal.toFixed(decimalPlaces).replace('.', ',');
                                        } else {
                                            formatted = Math.floor(currentVal).toLocaleString('ru-RU');
                                        }

                                        el.textContent = formatted + suffix;
                                        
                                        if (timeFraction < 1) {
                                            requestAnimationFrame(animate);
                                        } else {
                                            el.textContent = originalText;
                                        }
                                    };
                                    requestAnimationFrame(animate);
                                    obs.unobserve(el);
                                }
                            });
                        }, {
                            threshold: 0.1
                        });

                        targets.forEach(el => {
                            if (!el.dataset.odometerInit) {
                                el.dataset.originalText = el.textContent;
                                observer.observe(el);
                            }
                        });
                    };
                    runOdometer();

                    findAndAttachUploader();
                    globalDOMWatcher.subscribe((mutation) => {
    findMyUsername();
    observeNewNodes([mutation]);
});
globalDOMWatcher.start();
                });
                const seenVersion = await GM_getValue('br_style_seen_version', '0.0.0');
                if (seenVersion !== SCRIPT_VERSION) {
                    showWelcomeScreen();
                    await GM_setValue('br_style_seen_version', SCRIPT_VERSION);
                }
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', onDomReady);
            } else {
                onDomReady();
            }
            GM_registerMenuCommand('🎨 Открыть настройки стиля Black Russia', togglePanel, 's');
        } catch (e) {
            console.error(e);
        }
    }

    (function() {
    const A="TWFyYXMgUm9mbHM=",V="MTcuNi4xMA==",K="0J/QvtC70L3Ri9C5INCy0LjQt9GD0LDQu9GM0L3Ri9C5INGA0LXQtNC40LfQsNC50L0g0YTQvtGA0YPQvNCwIEJsYWNrIFJ1c3NpYQ==",C=98;
        try{
            const s=GM_info.script;
            if(s.author!==atob(A)||s.version!==atob(V)||!s.description.includes(decodeURIComponent(escape(atob(K))))||Object.keys(defaultSettings).length!==C)throw 0;
            if(typeof initialize==='function')initialize();
        }catch(e){
            initialize=null;
            const w=window,d=document;
            const s=()=>{
                const o=d.createElement('div');
                o.style.cssText="position:fixed;inset:0;background:#050505;z-index:2147483647;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:20px;overscroll-behavior:none;";
                o.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="90" height="90" fill="#dc2626" style="margin-bottom:25px;filter:drop-shadow(0 0 20px rgba(220,38,38,0.4));animation:p 1.5s infinite"><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg><h2 style="color:#dc2626;margin:0 0 15px;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:1px">Система Защиты</h2><p style="color:#e5e5e5;margin:0 0 30px;font-size:15px;line-height:1.6;max-width:320px">Обнаружена неавторизованная модификация кода.<br>Пожалуйста, используйте официальную версию.</p><a href="https://greasyfork.org/ru/scripts/532515-v2-k%D0%B0%D1%81%D1%82%D0%BE%D0%BC%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D1%81%D0%B0%D0%B9%D1%82%D0%B0-black-russia-forum" style="background:#dc2626;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;font-size:14px;text-transform:uppercase;box-shadow:0 5px 20px rgba(220,38,38,0.3);letter-spacing:0.5px">Скачать Оригинал</a><style>@keyframes p{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(0.95)}}</style>`;
                (d.body||d.documentElement).appendChild(o);
                d.body&&(d.body.style.overflow="hidden");
            };
            if(d.readyState==='loading')d.addEventListener("DOMContentLoaded",s);else s();
        }
    })();
})();