// ==UserScript==
// @name         翻译机
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  该脚本用于翻译各类常用社交网站为中文，不会经过中间服务器。
// @author       HolynnChen
// @license      MIT
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.youtube.com/*
// @match        *://*.facebook.com/*
// @match        *://*.reddit.com/*
// @match        *://*.5ch.net/*
// @match        *://*.discord.com/*
// @match        *://*.telegram.org/*
// @match        *://*.quora.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.instagram.com/*
// @match        *://*.threads.net/*
// @match        *://*.github.com/*
// @match        *://*.bsky.app/*
// @connect      fanyi.baidu.com
// @connect      translate.google.com
// @connect      ifanyi.iciba.com
// @connect      www.bing.com
// @connect      fanyi.youdao.com
// @connect      dict.youdao.com
// @connect      m.youdao.com
// @connect      api.interpreter.caiyunai.com
// @connect      papago.naver.com
// @connect      fanyi.qq.com
// @connect      translate.alibaba.com
// @connect      www2.deepl.com
// @connect      transmart.qq.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.4/base64.min.js
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require      https://cdn.jsdelivr.net/gh/Tampermonkey/utils@3b32b826e84ccc99a0a3e3d8d6e5ce0fa9834f23/requires/gh_2215_make_GM_xhr_more_parallel_again.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544033/%E7%BF%BB%E8%AF%91%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/544033/%E7%BF%BB%E8%AF%91%E6%9C%BA.meta.js
// ==/UserScript==

// --- Polyfills and Helper Functions ---

// Mock for Base64 if not exposed globally by js-base64
if (typeof Base64 === 'undefined' && typeof window.Base64 !== 'undefined') {
    var Base64 = window.Base64;
}

// Basic implementation of CompressMergeSession (needs lz-string)
function CompressMergeSession(storage) {
    if (typeof LZString === 'undefined') {
        console.warn("[翻译机] LZString is not loaded. Compression will be skipped.");
        return storage;
    }
    return {
        getItem: function(key) {
            const compressed = storage.getItem(key);
            try {
                return compressed ? LZString.decompressFromUTF16(compressed) : null;
            } catch (e) {
                console.error("[翻译机] Failed to decompress item:", key, e);
                // If decompression fails, clear the item to avoid future errors
                storage.removeItem(key);
                return null;
            }
        },
        setItem: function(key, value) {
            try {
                storage.setItem(key, LZString.compressToUTF16(value));
            } catch (e) {
                console.error("[翻译机] Failed to compress and set item:", key, e);
            }
        },
        removeItem: function(key) {
            storage.removeItem(key);
        },
        clear: function() {
            storage.clear();
        }
    };
}

// GM_xmlhttpRequest wrapper for Promises
function Request(options) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            ...options,
            onload: (response) => {
                if (response.status >= 200 && response.status < 300) {
                    resolve(response);
                } else {
                    reject(new Error(`Request failed with status ${response.status}: ${response.statusText || 'Unknown error'}`));
                }
            },
            onerror: (error) => {
                reject(error);
            },
            ontimeout: () => {
                reject(new Error("Request timed out"));
            }
        });
    });
}

// Basic Promise Retry Wrap (simplified)
async function PromiseRetryWrap(promiseFunc, retries = 3, delay = 1000) {
    if (typeof promiseFunc !== 'function') {
        return Promise.resolve();
    }
    for (let i = 0; i < retries; i++) {
        try {
            return await promiseFunc();
        } catch (error) {
            console.warn(`[翻译机] Promise retry failed (attempt ${i + 1}/${retries}):`, error);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            } else {
                throw error;
            }
        }
    }
}

// --- GM_registerMenuCommand ---
GM_registerMenuCommand('重置控制面板位置(刷新应用)', () => {
    GM_setValue('position_top', '9px');
    GM_setValue('position_right', '9px');
    alert('控制面板位置已重置，请刷新 страницу, чтобы применить изменения.');
});

GM_registerMenuCommand('全局隐藏/展示悬浮球(刷新应用)', () => {
    const currentState = GM_getValue('show_translate_ball', true);
    GM_setValue('show_translate_ball', !currentState);
    alert(`Плавающая кнопка ${!currentState ? 'показана' : 'скрыта'}, пожалуйста, обновите страницу, чтобы применить изменения.`);
});

// --- Translation Provider Functions (placeholders) ---
// ВАЖНО: Эти функции являются заглушками. Вы ДОЛЖНЫ заполнить
// фактическую логику запросов к API (URL-адреса, заголовки, данные и разбор ответа) для каждого провайдера.

async function translate_gg(raw) {
    const options = {
        method: "GET",
        url: `https://translate.google.com/translate_a/single?client=gtx&sl=auto&tl=zh-CN&dt=t&q=` + encodeURIComponent(raw)
    };
    try {
        const res = await Request(options);
        const data = JSON.parse(res.responseText);
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0].map(segment => segment[0]).join('');
        }
        return 'Translation failed: Google Translate returned an abnormal response.';
    } catch (err) {
        console.error('[翻译机] Google Translate failed:', err);
        return 'Translation failed: Google Translate request error.';
    }
}

async function translate_ggm(raw) {
    console.warn('[翻译机] Google Translate mobile: Function not implemented.');
    return 'Function not implemented: Google Translate mobile';
}

async function translate_tencent(raw) {
    console.warn('[翻译机] Tencent Translate: Function not implemented.');
    return 'Function not implemented: Tencent Translate';
}

async function translate_tencentai(raw) {
    console.warn('[翻译机] Tencent AI Translate: Function not implemented.');
    return 'Function not implemented: Tencent AI Translate';
}

async function translate_youdao_mobile(raw) {
    console.warn('[翻译机] Youdao Translate mobile: Function not implemented.');
    return 'Function not implemented: Youdao Translate mobile';
}

async function translate_baidu(raw) {
    console.warn('[翻译机] Baidu Translate: Function not implemented.');
    return 'Function not implemented: Baidu Translate';
}

async function translate_caiyun(raw) {
    console.warn('[翻译机] Caiyun Translate: Function not implemented.');
    return 'Function not implemented: Caiyun Translate';
}

async function translate_biying(raw) {
    console.warn('[翻译机] Bing Translate: Function not implemented.');
    return 'Function not implemented: Bing Translate';
}

async function translate_papago(raw) {
    console.warn('[翻译机] Papago Translate: Function not implemented.');
    return 'Function not implemented: Papago Translate';
}

async function translate_alibaba(raw) {
    console.warn('[翻译机] Alibaba Translate: Function not implemented.');
    return 'Function not implemented: Alibaba Translate';
}

async function translate_icib(raw) {
    console.warn('[翻译机] IciBa Translate: Function not implemented.');
    return 'Function not implemented: IciBa Translate';
}

async function translate_deepl(raw) {
    console.warn('[翻译机] Deepl Translate: Function not implemented.');
    return 'Function not implemented: Deepl Translate';
}

// --- Startup Functions (placeholders) ---
async function translate_tencent_startup() {
    console.log('[翻译机] Tencent Translate startup: No additional startup steps required.');
    return Promise.resolve();
}
async function translate_caiyun_startup() {
    console.log('[翻译机] Caiyun Translate startup: No additional startup steps required.');
    return Promise.resolve();
}
async function translate_papago_startup() {
    console.log('[翻译机] Papago Translate startup: No additional startup steps required.');
    return Promise.resolve();
}
async function translate_gg_startup() {
    console.log('[翻译机] Google Translate startup: No additional startup steps required.');
    return Promise.resolve();
}

// --- Core Configuration and Data ---
const transdict = {
    '谷歌翻译': translate_gg,
    '谷歌翻译mobile': translate_ggm,
    '腾讯翻译': translate_tencent,
    '腾讯AI翻译': translate_tencentai,
    '有道翻译mobile': translate_youdao_mobile,
    '百度翻译': translate_baidu,
    '彩云小译': translate_caiyun,
    '必应翻译': translate_biying,
    'Papago翻译': translate_papago,
    '阿里翻译': translate_alibaba,
    '爱词霸翻译': translate_icib,
    'Deepl翻译': translate_deepl,
    '关闭翻译': () => { return Promise.resolve(''); }
};

const startup = {
    '谷歌翻译': translate_gg_startup,
    '谷歌翻译mobile': translate_gg_startup,
    '腾讯翻译': translate_tencent_startup,
    '彩云小译': translate_caiyun_startup,
    'Papago翻译': translate_papago_startup
};

const baseoptions = {
    'enable_pass_lang': {
        declare: 'Не переводить китайский (упрощённый)',
        default_value: true,
        change_func: self => {
            if (self.checked) sessionStorage.clear();
            console.log('[翻译机] Setting: Do not translate Chinese (Simplified) updated.');
        }
    },
    'enable_pass_lang_cht': {
        declare: 'Не переводить китайский (традиционный)',
        default_value: true,
        change_func: self => {
            if (self.checked) sessionStorage.clear();
            console.log('[翻译机] Setting: Do not translate Chinese (Traditional) updated.');
        }
    },
    'remove_url': {
        declare: 'Автоматически фильтровать URL-адреса',
        default_value: true,
    },
    'show_info': {
        declare: 'Показывать источник перевода',
        default_value: true,
        option_enable: true
    },
    'fullscrenn_hidden': {
        declare: 'Не показывать в полноэкранном режиме',
        default_value: true,
    },
    'replace_translate': {
        declare: 'Заменяющий перевод',
        default_value: false,
        option_enable: true
    },
    'compress_storage':{
        declare: 'Сжимать кэш',
        default_value: false,
        change_func: () => {
             alert('Настройка сжатия кэша изменена, пожалуйста, обновите страницу, чтобы применить изменения.');
        }
    }
};

const enable_pass_lang = GM_getValue('enable_pass_lang', baseoptions.enable_pass_lang.default_value);
const enable_pass_lang_cht = GM_getValue('enable_pass_lang_cht', baseoptions.enable_pass_lang_cht.default_value);
const remove_url = GM_getValue('remove_url', baseoptions.remove_url.default_value);
const show_info = GM_getValue('show_info', baseoptions.show_info.default_value);
const fullscrenn_hidden = GM_getValue('fullscrenn_hidden', baseoptions.fullscrenn_hidden.default_value);
const replace_translate = GM_getValue('replace_translate', baseoptions.replace_translate.default_value);
const compress_storage = GM_getValue('compress_storage', baseoptions.compress_storage.default_value);

const globalProcessingSave = [];

const sessionStorage = compress_storage ? CompressMergeSession(window.sessionStorage) : window.sessionStorage;

const p = window.trustedTypes !== undefined ? window.trustedTypes.createPolicy('translator', { createHTML: (string) => string }) : { createHTML: (string) => string };

// --- UI Panel Initialization ---
function initPanel() {
    let choice = GM_getValue('translate_choice', '谷歌翻译');
    let select = document.createElement("select");
    select.className = 'js_translate';
    select.style = 'height:35px;width:100px;background-color:#fff;border-radius:17.5px;text-align-last:center;color:#000000;margin:5px 0';
    select.onchange = () => {
        GM_setValue('translate_choice', select.value);
        title.innerText = "Панель управления (обновите для применения)";
        alert('Переводчик изменен, пожалуйста, обновите страницу, чтобы применить изменения.');
    };
    for (let i in transdict) {
        select.innerHTML = p.createHTML(select.innerHTML + '<option value="' + i + '">' + i + '</option>');
    }
    select.querySelector(`option[value="${choice}"]`).selected = true;

    let enable_details = document.createElement('details');
    enable_details.innerHTML = p.createHTML("<summary>Правила активации</summary>");
    for (let i of rules) {
        let temp_p = document.createElement('p');
        let temp_input = document.createElement('input');
        temp_input.type = 'checkbox';
        temp_input.name = i.name;
        if (GM_getValue("enable_rule:" + temp_input.name, true)) {
            temp_input.setAttribute('checked', 'true');
        }
        temp_p.appendChild(temp_input);
        temp_p.innerHTML = p.createHTML(temp_p.innerHTML + `<span>${i.name}</span>`);
        enable_details.appendChild(temp_p);
    }

    let current_details = document.createElement('details');
    current_details.className = 'current-rule-details';

    let mask = document.createElement('div');
    let dialog = document.createElement("div");
    let js_dialog = document.createElement("div");
    let title = document.createElement('p');

    let shadowContainer = document.createElement('div');
    shadowContainer.style = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; pointer-events: none;";
    document.body.appendChild(shadowContainer);
    let shadow = shadowContainer.attachShadow({ mode: "open" });
    
    shadow.appendChild(mask);
    mask.appendChild(dialog);
    dialog.appendChild(js_dialog);
    js_dialog.appendChild(title);
    
    let select_p = document.createElement('p');
    select_p.appendChild(select);
    js_dialog.appendChild(select_p);

    js_dialog.appendChild(enable_details);
    js_dialog.appendChild(current_details);

    mask.style = "display: none;position: absolute;height: 100%;width: 100%;z-index: 1;top: 0;left: 0;overflow: hidden;background-color: rgba(0,0,0,0.4);justify-content: center;align-items: center;pointer-events: auto;";
    mask.addEventListener('click', event => { if (event.target === mask) mask.style.display = 'none'; });
    dialog.style = 'padding:0;border-radius:10px;background-color: #fff;box-shadow: 0 0 5px 4px rgba(0,0,0,0.3);';
    js_dialog.style = "min-height:10vh;min-width:10vw;display:flex;flex-direction:column;align-items:center;padding:10px;border-radius:4px;color:#000";
    title.style = 'margin:5px 0;font-size:20px;';
    title.innerText = "Панель управления";

    for (let i in baseoptions) {
        let temp_p = document.createElement('p');
        let temp_input = document.createElement('input');
        temp_p.style = "display:flex;align-items: center;margin:5px 0";
        temp_input.type = 'checkbox';
        temp_input.name = i;
        temp_input.id = `base-option-${i}`;
        temp_p.appendChild(temp_input);
        temp_p.innerHTML = p.createHTML(temp_p.innerHTML + `<label for="base-option-${i}">${baseoptions[i].declare}</label>`);
        js_dialog.appendChild(temp_p);
    }

    for (let i of js_dialog.querySelectorAll('input[type="checkbox"]')) {
        if (i.name && baseoptions[i.name]) {
            i.onchange = () => {
                title.innerText = "Панель управления (обновите для применения)";
                GM_setValue(i.name, i.checked);
                if (baseoptions[i.name].change_func) {
                    baseoptions[i.name].change_func(i);
                }
            };
            i.checked = GM_getValue(i.name, baseoptions[i.name].default_value);
        }
    }

    for (let i of enable_details.querySelectorAll('input[type="checkbox"]')) {
        i.onchange = () => {
            title.innerText = "Панель управления (обновите для применения)";
            GM_setValue('enable_rule:' + i.name, i.checked);
        };
    }

    let open = document.createElement('div');
    open.style = `z-index:9999;height:35px;width:35px;background-color:#fff;position:fixed;border:1px solid rgba(0,0,0,0.2);border-radius:17.5px;right:${GM_getValue('position_right', '9px')};top:${GM_getValue('position_top', '9px')};text-align:center;color:#000000;display:flex;align-items:center;justify-content:center;cursor: grab;font-size:15px;user-select:none;visibility: visible;pointer-events: auto;`;
    open.innerHTML = p.createHTML("Я");

    const renderCurrentRule = () => {
        current_details.style.display = "none";
        current_details.innerHTML = p.createHTML('');
        const currentRule = GetActiveRule();
        if (currentRule) {
            current_details.style.display = "block";
            current_details.innerHTML = p.createHTML(`<summary>Текущая активная - ${currentRule.name}</summary>`);
            for (const option of currentRule.options) {
                const fieldset = document.createElement("fieldset");
                fieldset.innerHTML = p.createHTML(`<legend>${option.name}</legend>`);
                current_details.appendChild(fieldset);

                const enableDiv = document.createElement('div');
                enableDiv.style = "display:flex;align-items:center; margin-bottom: 5px;";
                const enableInput = document.createElement('input');
                enableInput.type = 'checkbox';
                const enableKey = `enable_option:${currentRule.name}-${option.name}`;
                enableInput.checked = GM_getValue(enableKey, true);
                enableInput.onchange = () => {
                    title.innerText = "Панель управления (обновите для применения)";
                    GM_setValue(enableKey, enableInput.checked);
                };
                enableDiv.appendChild(enableInput);
                enableDiv.innerHTML = p.createHTML(enableDiv.innerHTML + `<span>Включить перевод</span>`);
                fieldset.appendChild(enableDiv);

                for (const key in baseoptions) {
                    if (!baseoptions[key].option_enable) {
                        continue;
                    }
                    const optionDiv = document.createElement('div');
                    optionDiv.style = "margin-top: 10px;";
                    optionDiv.innerHTML = p.createHTML(`<span>${baseoptions[key].declare}</span>`);
                    const baseValueList = [["", "По умолчанию"], ["true", "Включить"], ["false", "Отключить"]];
                    const radioGroupDiv = document.createElement('div');
                    radioGroupDiv.style = "display:flex; gap: 10px;";
                    for (const value of baseValueList) {
                        const radioInput = document.createElement('input');
                        radioInput.type = "radio";
                        radioInput.value = value[0];
                        radioInput.name = `${key}:${currentRule.name}-${option.name}`;
                        radioInput.id = `${key}-${currentRule.name}-${option.name}-${value[0]}`;
                        
                        const currentSetting = GM_getValue(`option_setting:${radioInput.name}`, '');
                        if (currentSetting.toString() === radioInput.value) {
                            radioInput.checked = true;
                        }

                        radioInput.onchange = () => {
                            title.innerText = "Панель управления (обновите для применения)";
                            switch (radioInput.value) {
                                case 'true':
                                    GM_setValue(`option_setting:${radioInput.name}`, true);
                                    break;
                                case 'false':
                                    GM_setValue(`option_setting:${radioInput.name}`, false);
                                    break;
                                case '':
                                    GM_deleteValue(`option_setting:${radioInput.name}`);
                                    break;
                            }
                        };
                        const radioLabel = document.createElement('label');
                        radioLabel.htmlFor = radioInput.id;
                        radioLabel.textContent = value[1];
                        radioGroupDiv.appendChild(radioInput);
                        radioGroupDiv.appendChild(radioLabel);
                    }
                    optionDiv.appendChild(radioGroupDiv);
                    fieldset.appendChild(optionDiv);
                }
            }
        }
    };

    open.onclick = () => {
        renderCurrentRule();
        mask.style.display = 'flex';
    };

    let isDragging = false;
    let offsetX, offsetY;

    open.addEventListener("mousedown", (e) => {
        isDragging = true;
        open.style.cursor = 'grabbing';
        offsetX = e.clientX - open.getBoundingClientRect().left;
        offsetY = e.clientY - open.getBoundingClientRect().top;
        e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        newX = Math.max(0, Math.min(newX, window.innerWidth - open.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - open.offsetHeight));

        open.style.left = `${newX}px`;
        open.style.top = `${newY}px`;
        open.style.right = 'auto';
    });

    document.addEventListener("mouseup", () => {
        if (isDragging) {
            isDragging = false;
            open.style.cursor = 'grab';
            GM_setValue("position_right", `${window.innerWidth - open.getBoundingClientRect().right}px`);
            GM_setValue("position_top", `${open.getBoundingClientRect().top}px`);
        }
    });

    open.addEventListener("touchstart", ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        const touch = ev.touches[0];
        open._tempTouch = {};
        const rect = open.getBoundingClientRect();
        open._tempTouch.offsetX = touch.clientX - rect.left;
        open._tempTouch.offsetY = touch.clientY - rect.top;
        open._tempIsMove = false;
    }, { passive: false });

    open.addEventListener("touchmove", ev => {
        ev.stopImmediatePropagation();
        ev.preventDefault();
        const touch = ev.touches[0];
        let newX = touch.clientX - open._tempTouch.offsetX;
        let newY = touch.clientY - open._tempTouch.offsetY;

        newX = Math.max(0, Math.min(newX, window.innerWidth - open.offsetWidth));
        newY = Math.max(0, Math.min(newY, window.innerHeight - open.offsetHeight));

        open.style.left = `${newX}px`;
        open.style.top = `${newY}px`;
        open.style.right = 'auto';
        open._tempIsMove = true;
    }, { passive: false });

    open.addEventListener("touchend", ev => {
        ev.stopImmediatePropagation();
        GM_setValue("position_right", `${window.innerWidth - open.getBoundingClientRect().right}px`);
        GM_setValue("position_top", `${open.getBoundingClientRect().top}px`);
        if (!open._tempIsMove) {
            renderCurrentRule();
            mask.style.display = 'flex';
        }
        open._tempIsMove = false;
    });

    shadow.appendChild(open);

    if (fullscrenn_hidden) {
        window.document.addEventListener('fullscreenchange', () => {
            open.style.display = window.document.fullscreenElement ? "none" : "flex";
        });
    }
    const storedRight = GM_getValue('position_right', '9px');
    const storedTop = GM_getValue('position_top', '9px');
    open.style.right = storedRight;
    open.style.top = storedTop;
    open.style.left = 'auto';
}

// --- Rule Definitions ---
const rules = [
    {
        name: 'Twitter/X General',
        matcher: /https:\/\/([a-zA-Z.]*?\.|)(twitter|x)\.com/,
        options: [
            {
                name: "Tweets",
                selector: baseSelector('div[dir="auto"][lang]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style.setProperty('-webkit-line-clamp', 'unset', 'important');
                    options.element.style.setProperty('max-height', 'unset', 'important');
                    baseTextSetter(options).style.display = 'flex';
                }
            },
            {
                name: "Background Info",
                selector: baseSelector('div[data-testid=birdwatch-pivot]>div[dir=ltr]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style.setProperty('-webkit-line-clamp', 'unset', 'important');
                    options.element.style.setProperty('max-height', 'unset', 'important');
                    baseTextSetter(options).style.display = 'flex';
                }
            }
        ]
    },
    {
        name: 'YouTube PC General',
        matcher: /https:\/\/(www\.|)youtube\.com\/(watch|shorts|results\?)/,
        options: [
            {
                name: "Comments Section",
                selector: baseSelector("#content>#content-text"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    baseTextSetter(options);
                    let parentCollapsed = options.element.closest('[collapsed]');
                    if(parentCollapsed) parentCollapsed.removeAttribute('collapsed');
                }
            },
            {
                name: "Video Description",
                selector: baseSelector("#content>#description>.content,.ytd-text-inline-expander>.yt-core-attributed-string"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    baseTextSetter(options);
                    let parentCollapsed = options.element.closest('[collapsed]');
                    if(parentCollapsed) parentCollapsed.removeAttribute('collapsed');
                }
            },
            {
                name: "CC Subtitles",
                selector: baseSelector(".ytp-caption-segment"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter
            }
        ]
    },
    {
        name: 'YouTube Mobile General',
        matcher: /https:\/\/m\.youtube\.com\/watch/,
        options: [
            {
                name: "Comments Section",
                selector: baseSelector(".comment-text.user-text"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "Video Description",
                selector: baseSelector(".slim-video-metadata-description"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'YouTube Shorts',
        matcher: /https:\/\/(www|m)\.youtube\.com\/shorts/,
        options: [
            {
                name: "Comments Section",
                selector: baseSelector("#comment-content #content-text,.comment-content .comment-text"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'YouTube Community',
        matcher: /https:\/\/(www|m)\.youtube\.com\/(.*?\/community|post)/,
        options: [
            {
                name: "Comments Section",
                selector: baseSelector("#post #content #content-text,#comment #content #content-text,#replies #content #content-text"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    baseTextSetter(options);
                    let parentCollapsed = options.element.closest('[collapsed]');
                    if(parentCollapsed) parentCollapsed.removeAttribute('collapsed');
                }
            }
        ]
    },
    {
        name: 'Facebook General',
        matcher: /https:\/\/www.facebook.com\/.+/,
        options: [
            {
                name: "Post Content",
                selector: baseSelector("div[data-ad-comet-preview=message],div[role=article] div[id]"),
                textGetter: baseTextGetter,
                textSetter: options => setTimeout(baseTextSetter, 0, options),
            },
            {
                name: "Comments Section",
                selector: baseSelector("div[role=article] div>span[dir=auto][lang]"),
                textGetter: baseTextGetter,
                textSetter: options => setTimeout(baseTextSetter, 0, options),
            }
        ]
    },
    {
        name: 'Reddit General',
        matcher: /https:\/\/www.reddit.com\/.*/,
        options: [
            {
                name: 'Post Title',
                selector: baseSelector("*[slot=title][id|=post-title]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: 'Post Content',
                selector: baseSelector("div[slot=text-body]>div>div[id*=-post-rtjson-content]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: 'Comments Section',
                selector: baseSelector("div[slot=comment]>div[id$=-post-rtjson-content]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: '5ch Comments',
        matcher: /http(|s):\/\/(.*?\.|)5ch.net\/.*/,
        options: [
            {
                name: "Title",
                selector: baseSelector('.post>.post-content,#threadtitle,.thread_title'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "Content",
                selector: baseSelector('.threadview_response_body'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'Discord Chat',
        matcher: /https:\/\/discord.com\/.+/,
        options: [
            {
                name: "Chat Content",
                selector: baseSelector('div[class*=messageContent]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'Telegram Chat (New)',
        matcher: /https:\/\/.*?.telegram.org\/(a|z)\//,
        options: [
            {
                name: "Chat Content",
                selector: baseSelector('p.text-content[dir=auto],div.text-content'),
                textGetter: e => Array.from(e.childNodes).filter(item => !item.className).map(item => item.nodeName === "BR" ? "\n" : item.textContent).join(''),
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'Telegram Chat (Old)',
        matcher: /https:\/\/.*?.telegram.org\/.+/,
        options: [
            {
                name: "Chat Content",
                selector: baseSelector('div.message[dir=auto],div.im_message_text'),
                textGetter: e => Array.from(e.childNodes).filter(item => !item.className || item.className === 'translatable-message').map(item => item.nodeValue || item.innerText).join(" "),
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'Quora General',
        matcher: /https:\/\/www.quora.com/,
        options: [
            {
                name: "Title",
                selector: baseSelector(".puppeteer_test_question_title>span>span"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.parentNode.parentNode.style.setProperty('-webkit-line-clamp', 'unset', 'important');
                    options.element.parentNode.parentNode.style.setProperty('max-height', 'unset', 'important');
                    baseTextSetter(options).style.display = 'flex';
                },
            },
            {
                name: "Post Content",
                selector: baseSelector('div.q-text>span>span.q-box:has(p.q-text),div.q-box>div.q-box>div.q-text>span.q-box:has(p.q-text)'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'TikTok Comments',
        matcher: /https:\/\/www.tiktok.com/,
        options: [
            {
                name: "Comments Section",
                selector: baseSelector('p[data-e2e|=comment-level]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'Instagram Comments',
        matcher: /https:\/\/www.instagram.com/,
        options: [
            {
                name: "Comments Section",
                selector: baseSelector('li>div>div>div>div>span[dir=auto]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'Threads',
        matcher: /https:\/\/www.threads.net/,
        options: [
            {
                name: "Posts",
                selector: baseSelector('div[data-pressable-container=true][data-interactive-id]>div>div:last-child>div>div:has(span[dir=auto]):not(:has(div[role=button]))'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'GitHub',
        matcher: /https:\/\/github.com\/.+\/.+\/\w+\/\d+/,
        options: [
            {
                name: "Issues",
                selector: baseSelector(".edit-comment-hide > task-lists > table > tbody > tr > td > p",items=>items.filter(i=>{
                    const nodeNameList = [...new Set([...i.childNodes].map(i=>i.nodeName))];
                    return nodeNameList.length>1 || (nodeNameList.length == 1 && nodeNameList[0] == "#text")
                })),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "Discussions",
                selector: baseSelector(".edit-comment-hide > task-lists > table > tbody > tr > td > p",items=>items.filter(i=>{
                    const nodeNameList=[...new Set([...i.childNodes].map(i=>i.nodeName))];
                    return nodeNameList.length>1 || (nodeNameList.length == 1 && nodeNameList[0] == "#text")
                })),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
        ]
    },
    {
        name: 'BSky',
        matcher: /https:\/\/bsky.app/,
        options: [
            {
                name: "Homepage Posts",
                selector: baseSelector('div[dir=auto][data-testid=postText]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "Content Posts & Replies",
                selector: baseSelector('div[data-testid^="postThreadItem-by"] div[dir=auto][data-word-wrap]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
];

const GetActiveRule = () => rules.find(item => item.matcher.test(document.location.href) && GM_getValue('enable_rule:' + item.name, true));

// --- Main Execution Logic ---
(function () {
    'use strict';
    let currentUrl = document.location.href;
    let activeRule = GetActiveRule();
    let mainIntervalId = null;

    // Monitor URL changes for SPAs
    setInterval(() => {
        if (document.location.href !== currentUrl) {
            currentUrl = document.location.href;
            const newRule = GetActiveRule();
            if (newRule !== activeRule) {
                if (newRule) {
                    console.log(`【翻译机】Detected URL change, now using 【${newRule.name}】 rule`);
                } else {
                    console.log("【翻译机】Detected URL change, no matching rule currently");
                }
                activeRule = newRule;
                if (mainIntervalId) {
                    clearInterval(mainIntervalId);
                    mainIntervalId = null;
                }
                if (activeRule) {
                    PromiseRetryWrap(startup[GM_getValue('translate_choice', '谷歌翻译')] || translate_gg_startup).then(() => {
                        console.log(`【翻译机】Starting main translation loop for ${activeRule.name}`);
                        mainIntervalId = setInterval(main, 200);
                    }).catch(err => {
                        console.error('[翻译机] Failed to start translation engine:', err);
                    });
                }
            }
        }
    }, 500);

    console.log(activeRule ? `【翻译机】Using 【${activeRule.name}】 rule` : "【翻译机】No matching rule currently");
    console.log(`Current URL: ${document.location.href}`);

    let processingQueue = [];
    let isTranslating = false;

    async function main() {
        if (!activeRule || isTranslating) return;

        isTranslating = true;

        try {
            const choice = GM_getValue('translate_choice', '谷歌翻译');
            const translator = transdict[choice];
            if (!translator) {
                console.warn(`[翻译机] Unknown translation engine: ${choice}`);
                isTranslating = false;
                return;
            }

            for (const option of activeRule.options) {
                const enableOption = GM_getValue(`enable_option:${activeRule.name}-${option.name}`, true);
                if (!enableOption) {
                    continue;
                }

                const elementsToTranslate = option.selector();
                for (const element of elementsToTranslate) {
                    if (globalProcessingSave.includes(element) || processingQueue.includes(element)) {
                        continue;
                    }

                    const rawText = option.textGetter(element);
                    const textToTranslate = remove_url ? url_filter(rawText) : rawText;

                    if (textToTranslate.length === 0 || textToTranslate.trim().length === 0) { // Also check for empty after trim
                        element.dataset.translate = "skipped_empty";
                        continue;
                    }

                    const cachedText = sessionStorage.getItem(`${choice}-${textToTranslate}`);
                    if (cachedText) {
                        const setterParams = {
                            element: element,
                            translatorName: choice,
                            text: cachedText,
                            rawText: rawText,
                            rule: activeRule,
                            option: option
                        };
                        option.textSetter(setterParams);
                        element.dataset.translate = "cached";
                    } else {
                        processingQueue.push({ element, rawText, textToTranslate, option, choice });
                        globalProcessingSave.push(element);
                    }
                }
            }

            while (processingQueue.length > 0) {
                const item = processingQueue.shift();
                const { element, rawText, textToTranslate, option, choice } = item;

                try {
                    const langCheckResult = await pass_lang(textToTranslate);
                    if (langCheckResult instanceof Promise && typeof langCheckResult.then === 'function') {
                         element.dataset.translate = "skipped_lang";
                         removeItem(globalProcessingSave, element);
                         continue;
                    }

                    const translatedText = await translator(textToTranslate, langCheckResult);
                    sessionStorage.setItem(`${choice}-${textToTranslate}`, translatedText);

                    const setterParams = {
                        element: element,
                        translatorName: choice,
                        text: translatedText,
                        rawText: rawText,
                        rule: activeRule,
                        option: option
                    };
                    option.textSetter(setterParams);
                    element.dataset.translate = "translated";
                } catch (err) {
                    console.error(`[翻译机] Translation failed for element:`, element, `Error:`, err);
                    const setterParams = {
                        element: element,
                        translatorName: choice,
                        text: 'Translation failed',
                        rawText: rawText,
                        rule: activeRule,
                        option: option
                    };
                    option.textSetter(setterParams);
                    element.dataset.translate = "translation_error";
                } finally {
                    removeItem(globalProcessingSave, element);
                }
            }
        } catch (error) {
            console.error('[翻译机] Error in main loop:', error);
        } finally {
            isTranslating = false;
        }
    }

    if (activeRule) {
        PromiseRetryWrap(startup[GM_getValue('translate_choice', '谷歌翻译')] || translate_gg_startup).then(() => {
            console.log(`【翻译机】Starting main translation loop for ${activeRule.name}`);
            mainIntervalId = setInterval(main, 200);
        }).catch(err => {
            console.error('[翻译机] Failed to start translation engine:', err);
        });
    }

    if (GM_getValue('show_translate_ball', true)) {
        initPanel();
    }
})();

// --- Utility Functions ---

function removeItem(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) arr.splice(index, 1);
}

function baseSelector(selector, customFilter) {
    return () => {
        const items = document.querySelectorAll(selector);
        let filterResult = Array.from(items).filter(item => {
            if (item.dataset.translate) return false;
            const nodes = item.querySelectorAll('[data-translate]');
            if (nodes && Array.from(nodes).some(node => node.parentNode === item)) {
                return false;
            }
            return true;
        });

        if (customFilter) {
            filterResult = customFilter(filterResult);
        }
        return filterResult;
    };
}

function baseTextGetter(e) {
    return e.innerText ? e.innerText.trim() : '';
}

function baseTextSetter({ element, translatorName, text, rawText, rule, option }) {
    if ((text || "").length === 0) text = 'Translation failed';

    const currentReplaceTranslate = GM_getValue(`option_setting:replace_translate:${rule.name}-${option.name}`, replace_translate);
    const currentShowInfo = GM_getValue(`option_setting:show_info:${rule.name}-${option.name}`, show_info);

    const spanNode = document.createElement('span');
    spanNode.style.whiteSpace = "pre-wrap";
    spanNode.innerText = `${currentShowInfo ? "-----------" + translatorName + "-----------\n\n" : ""}` + text;
    spanNode.dataset.translate = "translated_content";
    spanNode.className = "translate-processed-node";
    spanNode.title = rawText;

    if (currentReplaceTranslate) {
        element.innerHTML = p.createHTML('');
        element.appendChild(spanNode);
    } else {
        let originalContentSpan = element.querySelector('.original-content-wrapper');
        if (!originalContentSpan) {
            originalContentSpan = document.createElement('span');
            originalContentSpan.className = 'original-content-wrapper';
            originalContentSpan.innerHTML = p.createHTML(element.innerHTML);
            element.innerHTML = p.createHTML('');
            element.appendChild(originalContentSpan);
        }
        element.appendChild(spanNode);
    }

    element.style.setProperty('-webkit-line-clamp', 'unset', 'important');
    element.style.setProperty('max-height', 'unset', 'important');
    element.style.setProperty('overflow', 'visible', 'important');

    return spanNode;
}

function url_filter(text) {
    return text.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g, '').trim();
}

async function pass_lang(raw) {
    if (!enable_pass_lang && !enable_pass_lang_cht) return;

    try {
        const result = await check_lang(raw);
        if (enable_pass_lang && result === 'zh') {
            console.log(`[翻译机] Detected simplified Chinese, skipping translation.`);
            return new Promise(() => {});
        }
        if (enable_pass_lang_cht && (result === 'cht' || result === 'zh-tw')) {
            console.log(`[翻译机] Detected traditional Chinese, skipping translation.`);
            return new Promise(() => {});
        }
        return result;
    } catch (err) {
        console.error("[翻译机] Language detection failed:", err);
        return;
    }
}

async function check_lang(raw) {
    const options = {
        method: "POST",
        url: 'https://fanyi.baidu.com/langdetect',
        data: 'query=' + encodeURIComponent(raw.replace(/[\uD800-\uDBFF]$/, "").slice(0, 50)),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    };
    try {
        const res = await Request(options);
        const data = JSON.parse(res.responseText);
        if (data && data.lan) {
            return data.lan;
        }
        throw new Error("Baidu language detection response malformed.");
    } catch (err) {
        console.error("[翻译机] Baidu language detection request failed:", err);
        throw err;
    }
}