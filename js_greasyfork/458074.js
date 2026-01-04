// ==UserScript==
// @name              超级翻译助手
// @namespace         https://github.com/syhyz1990/translate
// @version           1.0.7
// @author            YouXiaoHou
// @description       用鼠标选中文字，按下快捷键（默认为F9），可自动翻译文字。已支持超过 14 种语言。
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-translate.html
// @supportURL        https://github.com/syhyz1990/translate
// @match             *://*/*
// @require           https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @require           https://unpkg.com/hotkeys-js@3.13.3/dist/hotkeys.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @connect           translate.youxiaohou.com
// @run-at            document-idle
// @noframes
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGQ9Ik02NTguMyA0MDIuM2gyOTIuNmM0MC40IDAgNzMuMSAzMi41IDczLjEgNzMuMXY0NzUuNGMwIDQwLjQtMzIuNSA3My4xLTczLjEgNzMuMUg0NzUuNGMtNDAuNCAwLTczLjEtMzIuNS03My4xLTczLjFWNjU4LjNoMTQ2LjNjNjAuOSAwIDEwOS43LTQ5LjEgMTA5LjctMTA5LjdWNDAyLjN6TTAgNzMuMUMwIDMyLjcgMzIuNSAwIDczLjEgMGg0NzUuNGM0MC40IDAgNzMuMSAzMi41IDczLjEgNzMuMXY0NzUuNGMwIDQwLjQtMzIuNSA3My4xLTczLjEgNzMuMUg3My4xYy00MC40LjEtNzMuMS0zMi40LTczLjEtNzNWNzMuMXptMTQ2LjMgMzE1LjhoNTMuNHYtMjguM2g3N3YxMzUuMmg1Ni42VjM2MC42aDc4LjZ2MjMuNkg0NzBWMjA1SDMzMy4zdi0zOS4zYzAtMTEuNSAxLjYtMjEuNSA0LjgtMjkuOC44LTEuNSAxLjQtMy4xIDEuNS00LjggMC0xLTMuNy0yLTExLTMuMWgtNTMuNXY3N0gxNDYuM3YxODMuOXpNMTk5LjcgMjQ5aDc3djY5LjFoLTc3VjI0OXptMjEyLjIgNjkuMWgtNzguNlYyNDloNzguNnY2OS4xem0yMzIuOSA1NTcuN2wyMi02MS4zaDExNC43bDIyIDYxLjNoNjIuOGwtMTAyLTI5MC43aC03My45TDU4NS4xIDg3NS45bDU5LjctLjF6bTM3LjgtMTEwTDcyNSA2NDEuN2gxLjZsMzkuMyAxMjQuMWgtODMuM3ptMjY4LjMtNDczLjJoLTczLjFjMC04MC44LTY1LjUtMTQ2LjMtMTQ2LjMtMTQ2LjNWNzMuMWMxMjEuMSAwIDIxOS40IDk4LjMgMjE5LjQgMjE5LjV6TTczLjEgNzMxLjRoNzMuMWMwIDgwLjggNjUuNSAxNDYuMyAxNDYuMyAxNDYuM3Y3My4xYy0xMjEuMS4xLTIxOS40LTk4LjItMjE5LjQtMjE5LjR6IiBmaWxsPSIjZDgxZDQ1Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/458074/%E8%B6%85%E7%BA%A7%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458074/%E8%B6%85%E7%BA%A7%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const customClass = {
        container: 'translate-container',
        popup: 'translate-popup',
        content: 'translate-content',
    };

    const toastClass = {
        container: 'translate-d-container',
        popup: 'translate-d-popup',
    };

    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timerProgressBar: false,
        customClass: toastClass,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    let languageMap = {
        'auto': '自动检测',
        'ar': '阿拉伯语',
        'de': '德语',
        'ru': '俄语',
        'fr': '法语',
        'ko': '韩语',
        'la': '拉丁语',
        'pt': '葡萄牙语',
        'ja': '日语',
        'th': '泰语',
        'es': '西班牙语',
        'it': '意大利语',
        'en': '英语',
        'zh-CN': '简体中文',
        'zh-TW': '繁体中文',
    };

    let util = {

        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            document.head.appendChild(style);
        },

        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },

        post(url, data, headers, type) {
            if (this.isType(data) === 'object') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        parseLanguage(language) {
            return languageMap[language] || language;
        },
    };

    let main = {
        untranslatedText: '',
        translatedText: '',
        translating: false,
        speechSynthesis: null,
        speakPlaySvg: '<svg height="20" width="20" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',

        //初始化配置数据
        initValue() {
            let value = [{
                name: 'setting_success_times',
                value: 0
            }, {
                name: 'hotkey',
                value: 'f9'
            }, {
                name: 'from',
                value: 'auto'
            }, {
                name: 'to',
                value: 'zh-CN'
            }];

            value.forEach((v) => {
                if (util.getValue(v.name) === undefined) {
                    util.setValue(v.name, v.value);
                }
            });
        },

        async startTranslate() {
            this.translatedText = '';
            let select = window.getSelection().toString();
            if (select) this.untranslatedText = select;
            if (this.untranslatedText) this.translatedText = await this.translate(this.untranslatedText);
            await this.showPopup(this.untranslatedText, this.translatedText);
        },

        async translate(text, showToast = true) {
            let btn = $('.translate-box .translate-btn');
            try {
                if (!text) return '';
                if (this.translating) return;
                this.translating = true;
                showToast && toast.fire({title: '正在翻译...', icon: 'info'});
                btn.length > 0 && btn.html('<span class="translate-loading-css"></span>翻译中');
                let res = await util.post('https://translate.youxiaohou.com', {
                    str: text,
                    from: util.getValue('from'),
                    to: util.getValue('to')
                }, {
                    'Content-Type': 'application/json'
                });
                this.translating = false;
                btn.length > 0 && btn.html('翻译');
                if (res.code === 200) {
                    util.setValue('setting_success_times', util.getValue('setting_success_times') + 1);
                    return res.data;
                }
                return res?.msg || '';
            } catch (e) {
                this.translating = false;
                btn.length > 0 && btn.html('翻译失败');
                return '';
            }
        },

        async showPopup(untranslatedText, translatedText) {
            let commonLangFrom = ['auto', 'zh-CN', 'en'];
            let commonLangTo = ['zh-CN', 'en', 'zh-TW'];
            let langFrom = util.getValue('from');
            let langTo = util.getValue('to');
            if (!commonLangFrom.includes(langFrom)) commonLangFrom.push(langFrom);
            if (!commonLangTo.includes(langTo)) commonLangTo.push(langTo);
            let langDomFrom = commonLangFrom.map(val => {
                if (val === langFrom) {
                    return `<div class="item on" data-lang="${val}" data-type="from">${languageMap[val]}</div>`;
                } else {
                    return `<div class="item" data-lang="${val}" data-type="from">${languageMap[val]}</div>`;
                }
            }).join('');
            let langDomTo = commonLangTo.map(val => {
                if (val === langTo) {
                    return `<div class="item on" data-lang="${val}" data-type="to">${languageMap[val]}</div>`;
                } else {
                    return `<div class="item" data-lang="${val}" data-type="to">${languageMap[val]}</div>`;
                }
            }).join('');
            let html = `
<div class="translate-wrapper">
  <div class="translate-box">
    <div class="from-side">
      <div class="translate-title">
        <div class="translate-lang">${langDomFrom}<svg id="dropdown-from" width="24" height="24" viewBox="0 0 24 24" class="translate-dropdown"><path d="M5.41 7.59L4 9l8 8 8-8-1.41-1.41L12 14.17"/></svg></div>
        <button class="translate-btn" title="点击翻译左侧文本">翻译</button>
      </div>
      <textarea class="untranslated-text" placeholder="请输入要翻译的内容">${untranslatedText}</textarea>
      <svg class="translate-clear" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M806.4 263.2l-45.6-45.6L512 467.2 263.2 217.6l-45.6 45.6L467.2 512 217.6 760.8l45.6 45.6L512 557.6l248.8 248.8 45.6-45.6L557.6 512z"/></svg>
      <div class="translate-toolbar">
        <div id="speak-from" class="translate-speak">${main.speakPlaySvg}</div>
        <div id="word-count">字数：${untranslatedText.length}</div>
      </div>
    </div>
    <div class="to-side">
      <div class="translate-title">
        <div class="translate-lang">${langDomTo}<svg id="dropdown-to" width="24" height="24" viewBox="0 0 24 24" class="translate-dropdown"><path d="M5.41 7.59L4 9l8 8 8-8-1.41-1.41L12 14.17"/></svg></div>
      </div>
      <div class="translated-text">${translatedText}</div>
      <div class="translate-toolbar">
        <div id="speak-to" class="translate-speak">${main.speakPlaySvg}</div>
        <div class="translate-copy-box" title="点击复制"><svg class="translate-copy" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
          <path d="M672 832H224c-52.928 0-96-43.072-96-96V160c0-52.928 43.072-96 96-96h448c52.928 0 96 43.072 96 96v576c0 52.928-43.072 96-96 96zM224 128c-17.632 0-32 14.368-32 32v576c0 17.664 14.368 32 32 32h448c17.664 0 32-14.336 32-32V160c0-17.632-14.336-32-32-32H224z"/>
          <path
            d="M800 960H320c-17.664 0-32-14.304-32-32s14.336-32 32-32h480c17.664 0 32-14.336 32-32V256c0-17.664 14.304-32 32-32s32 14.336 32 32v608c0 52.928-43.072 96-96 96zM544 320H288c-17.664 0-32-14.336-32-32s14.336-32 32-32h256c17.696 0 32 14.336 32 32s-14.304 32-32 32zm64 160H288.032c-17.664 0-32-14.336-32-32s14.336-32 32-32H608c17.696 0 32 14.336 32 32s-14.304 32-32 32z"/>
          <path d="M608 640H288c-17.664 0-32-14.304-32-32s14.336-32 32-32h320c17.696 0 32 14.304 32 32s-14.304 32-32 32z"/>
        </svg>
        <span class="translate-copy-tip"></span></div>
        </div>
    </div>
  </div>
  <div class="translate-footer"><a href="https://www.youxiaohou.com/tool/install-translate.html" target="_blank">油小猴翻译助手</a> 为您提供翻译服务</div>
</div>
            `;

            Swal.fire({
                width: '1200px',
                position: 'center',
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                html: html,
                customClass
            });

            //自动聚焦
            let textarea = document.querySelector('.translate-box .untranslated-text');
            if (textarea) {
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
            }
        },

        async startNewTranslate() {
            if (this.translating) return;
            $('.translate-box .translated-text').text(await this.translate($('.translate-box .untranslated-text').val(), false));
        },

        addPageListener() {
            let body = $('body');

            body.on('click', '.translate-box .translate-btn', async () => {
                await this.startNewTranslate();
            })

            body.on('input', '.translate-box .untranslated-text', async (e) => {
                this.untranslatedText = e.target.value;
                $('.translate-box #word-count').text(`字数：${this.untranslatedText.length}`);
            })

            body.on('change', '.translate-box .untranslated-text', () => {
                setTimeout(async () => {
                    await this.startNewTranslate();
                }, 300);
            })

            body.on('click', '.translate-box .translate-clear', async () => {
                this.untranslatedText = '';
                $('.translate-box .untranslated-text').val('');
                $('.translate-box .translated-text').text('');
                $('.translate-box #word-count').text('字数：0');
            })

            body.on('click', '.translate-box #dropdown-from', async () => {
                this.setFromLanguage(true);
            })

            body.on('click', '.translate-box #dropdown-to', async () => {
                this.setToLanguage(true);
            })

            body.on('click', '.translate-box #speak-from', async () => {
                this.speakWord($('.translate-box .untranslated-text').val());
            })

            body.on('click', '.translate-box #speak-to', async () => {
                this.speakWord($('.translate-box .translated-text').text());
            })

            body.on('click', '.translate-box .translate-lang .item', async (e) => {
                let $current = $(e.target);
                let lang = $current.data('lang');
                let type = $current.data('type');
                $current.siblings().removeClass('on');
                $current.addClass('on');
                util.setValue(type, lang);
                await this.startNewTranslate();
            })

            body.on('click', '.translate-box .translate-copy', async () => {
                GM_setClipboard($('.translate-box .translated-text').text());
                let copyTip = $('.translate-box .translate-copy-tip');
                copyTip.text('复制成功');
                setTimeout(() => copyTip.text(''), 3000);
            })
        },

        addHotKey() {
            hotkeys(util.getValue('hotkey'), async (event, handler) => {
                event.preventDefault();
                await this.startTranslate();
            });
        },

        speakWord(text) {
            if ('speechSynthesis' in window && text) {
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                } else {
                    let msg = new SpeechSynthesisUtterance();
                    msg.text = text;
                    speechSynthesis.speak(msg);
                }
            }
        },

        //重置翻译次数
        clearTranslateTimes() {
            Swal.fire({
                showCancelButton: true,
                title: '确定要重置翻译次数吗？',
                icon: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: toastClass,
            }).then(res => {
                if (res.isConfirmed) {
                    util.setValue('setting_success_times', 0);
                    history.go(0);
                }
            });
        },

        setHotkey() {
            Swal.fire({
                title: '请选择快捷键',
                text: '注意：避免与其他程序产生冲突',
                input: 'select',
                inputValue: util.getValue('hotkey').toUpperCase(),
                inputOptions: {
                    'F1': 'F1',
                    'F2': 'F2',
                    'F3': 'F3',
                    'F4': 'F4',
                    'F5': 'F5',
                    'F6': 'F6',
                    'F7': 'F7',
                    'F8': 'F8',
                    'F9': 'F9（默认）',
                    'F10': 'F10',
                    'F11': 'F11',
                    'F12': 'F12',
                },
                confirmButtonText: '确定',
                customClass: toastClass,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    util.setValue('hotkey', result.value.toLowerCase());
                    history.go(0);
                }
            });
        },

        setFromLanguage(popAgain = false) {
            Swal.fire({
                title: '请选择原始语言',
                text: '选择您要翻译的原始语言',
                input: 'select',
                inputValue: util.getValue('from'),
                inputOptions: languageMap,
                confirmButtonText: '确定',
                customClass: toastClass,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    util.setValue('from', result.value);
                    popAgain && this.startTranslate();
                }
            });
        },

        setToLanguage(popAgain = false) {
            let map = JSON.parse(JSON.stringify(languageMap));
            delete map.auto;
            Swal.fire({
                title: '请选择目标语言',
                text: '选择您要翻译的目标语言',
                input: 'select',
                inputValue: util.getValue('to'),
                inputOptions: map,
                confirmButtonText: '确定',
                customClass: toastClass,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    util.setValue('to', result.value);
                    popAgain && this.startTranslate();
                }
            });
        },

        registerMenuCommand() {
            GM_registerMenuCommand(`⚙️ 设置快捷键：${util.getValue('hotkey').toUpperCase()}`, () => {
                this.setHotkey();
            });
            GM_registerMenuCommand(`⚙️ 设置原始语言：${util.parseLanguage(util.getValue('from'))}`, () => {
                this.setFromLanguage();
            });
            GM_registerMenuCommand(`⚙️ 设置目标语言：${util.parseLanguage(util.getValue('to'))}`, () => {
                this.setToLanguage();
            });
            GM_registerMenuCommand('👀 已翻译：' + util.getValue('setting_success_times') + '次', () => {
                this.clearTranslateTimes();
            });
        },


        addPluginStyle() {
            let style = `
      .translate-container { z-index: 99999!important; }
      .translate-popup { font-size: 14px !important;padding:0 !important; border-radius: 10px;}
      .translate-d-container { z-index: 999999!important;}
      .translate-d-popup { font-size: 14px !important;}
      .translate-content { padding:0 !important; }
      .translate-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 20px; }
      .translate-setting-checkbox { width: 16px;height: 16px; }
      .translate-wrapper { margin: 28px 24px 10px; font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;}
      .translate-box { display: flex; min-height: calc(100vh - 130px);box-shadow: 1px 1px 9px #eaeaea; border-radius: 15px;}
      .translate-box .from-side { flex:1; width:50%; border: 1px solid #ddd; border-radius: 15px 0 0 15px; border-right:none;color: #666;position: relative;padding: 0 0 36px;}
      .translate-box .to-side { flex:1; width:50%; border:1px solid #ddd; border-radius: 0 15px 15px 0; border-left: none;background: #f5f5f5;color: #000;position: relative;padding: 0 0 36px;}
      .translate-box .untranslated-text { width: 100%; height: calc(100% - 50px); border-radius: 15px 0 0 15px; resize: none; line-height: 28px; font-size: 16px; color: #666; border: none; text-align: left; padding: 20px; box-sizing: border-box; outline:none; overflow-wrap: break-word; word-break: break-word; word-wrap: break-word;}
      .translate-box .untranslated-text::-webkit-scrollbar { width: 6px; height: 6px;}
      .translate-box .untranslated-text::-webkit-scrollbar-thumb { background-color: rgba(85,85,85,.4)}
      .translate-box .untranslated-text::-webkit-scrollbar-thumb, .translate-box .untranslated-text::-webkit-scrollbar-thumb:hover { border-radius: 5px; box-shadow: inset 0 0 6px rgb(0 0 0 / 20%);}
      .translate-box .translate-toolbar { position: absolute; bottom: 0; font-size: 13px; color: #999; height: 36px; text-align: right; left: 20px; right: 20px; display: flex; align-items: center; justify-content: space-between;}
      .translate-box .translated-text { width: 100%; line-height: 28px; font-size: 16px; border: none; text-align: left; white-space: pre-wrap;  padding: 20px; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; word-wrap: break-word; position: relative;}
      .translate-box .translate-title { border-bottom: 1px solid #ddd; padding: 0 20px 0 10px; position: sticky; top: -10px;display: flex;align-items:center;justify-content: space-between; z-index: 99999; background: #fff;user-select:none}
      .translate-box .translate-lang { display: flex; align-items:center;}
      .translate-box .translate-lang .item { position:relative; color:#666;padding: 0 15px; cursor:pointer;font-size:15px;font-weight: 500;height: 48px;display: flex;align-items:center;}
      .translate-box .translate-lang .item.on { color:#1a73e8;font-weight: 700}
      .translate-box .translate-lang .item.on:after { content: '';display:block;position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 2px; background: #1a73e8;}
      .translate-box .translate-lang .item:hover { background: #f6fafe; color:#333}
      .translate-box .translate-dropdown { cursor:pointer; fill: #999;margin: 0 10px 0 20px; padding:5px;border-radius:50%}
      .translate-box .translate-dropdown:hover { fill: #666; background:#f5f5f5 }
      .translate-box .translate-box .from-side .translate-title { border-radius: 15px 0 0 0;}
      .translate-box .translate-box .to-side .translate-title { border-radius: 0 15px 0 0;}
      .translate-box .translate-btn { border: 0; border-radius: 5px; color: #fff; font-size: 14px; padding: 8px 13px; background: #4396fc; cursor: pointer; line-height: 1; display: flex; align-items: center;}
      .translate-box .translate-btn:hover { background: #187efa;}
      .translate-box .translate-loading-css { width: 12px; height: 12px; border: 2px solid #FFF; margin-right:6px; border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: __rotation 1s linear infinite; }
      @keyframes __rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}
      .translate-box .translate-copy-box {display: flex;align-items:center;gap:5px;}
      .translate-box .translate-copy,.translate-speak svg {cursor: pointer;opacity: 0.2;transition: opacity .3s;display: flex;align-items:center;}
      .translate-box .translate-copy:hover,.translate-speak svg:hover {opacity: 0.5;transition: opacity .3s}
      .translate-box .translate-clear {cursor: pointer; fill: #666; padding:6px; border-radius:50%;position: absolute; top: 66px; right: 13px;background: rgb(255 255 255 / 50%)}
      .translate-box .translate-clear:hover {fill: #333; background:#f5f5f5; }
      .translate-footer {margin-top: 8px; font-size: 14px; color: #999}
      .translate-footer a {color: rgb(26 115 232 / 70%)}
      .translate-footer a:hover {color: rgb(26 115 232 / 90%)}
      .swal2-close { font-size: 30px!important}
      .swal2-close:focus {box-shadow:none!important}
            `;

            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('translate-style', 'style', style);
            }

            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('translate-style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        isTopWindow() {
            return window.self === window.top;
        },

        init() {
            this.initValue();
            this.addPluginStyle();
            this.addHotKey();
            this.addPageListener();
            this.isTopWindow() && this.registerMenuCommand();
        },
    };

    main.init();
})();
