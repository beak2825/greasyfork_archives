// ==UserScript==
// @name         Chat Translator
// @namespace    https://hordes.io
// @version      0.50.13
// @description  Hordes.io chat translator
// @license      FU!
// @author       ChatGPT-6
// @match        https://hordes.io/play
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hordes.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483537/Chat%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/483537/Chat%20Translator.meta.js
// ==/UserScript==

/* Version: 0.50.12 - January 9, 2024 17:21:16 */
'use strict';

!(() => {
    const VERSION = '0.50.13';
    const CHAT_SELECTOR = '#chat';

    const loader = {
        start() {
            let interval = setInterval(() => {
                if (document.querySelector(CHAT_SELECTOR)) {
                    clearInterval(interval);
                    this.guard();
                    this.init();
                }
            }, 100);
        },
        guard() {
            new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes[0]?.className == 'l-ui' && this.init();
                });
            }).observe(document.body, { childList: true });
        },
        init() {
            config.init();
            style.init();
            chat.init();
            control.init();
            chatinput.init();
        }
    };

    const translate = (text, lang, handler, text_el) => {
        fetch(atob('aHR0cHM6Ly90cmFuc2xhdGUuZ29vZ2xlYXBpcy5jb20vdHJhbnNsYXRlX2Evc2luZ2xlP2NsaWVudD1ndHgmc2w9YXV0byZ0bD0=') + lang + "&dt=t&q=" + encodeURI(text))
            .then(response => response.json())
            .then(result => {
                config.tr_cnt += 1;
                config.save();
                handler(result, text_el);
            });
    };

    const languages = JSON.parse(atob('eyJhZiI6IkFmcmlrYWFucyIsInNxIjoiQWxiYW5pYW4iLCJhciI6IkFyYWJpYyIsImF6IjoiQXplcmJhaWphbmkiLCJldSI6IkJhc3F1ZSIsImJuIjoiQmVuZ2FsaSIsImJlIjoiQmVsYXJ1c2lhbiIsImJnIjoiQnVsZ2FyaWFuIiwiY2EiOiJDYXRhbGFuIiwiemgtQ04iOiAiQ2hpbmVzZSBTaW1wbGlmaWVkIiwiemgtVFciOiAiQ2hpbmVzZSBUcmFkaXRpb25hbCIsImhyIjoiQ3JvYXRpYW4iLCJjcyI6IkN6ZWNoIiwiZGEiOiJEYW5pc2giLCJubCI6IkR1dGNoIiwiZW4iOiJFbmdsaXNoIiwiZW8iOiJFc3BlcmFudG8iLCJldCI6IkVzdG9uaWFuIiwidGwiOiJGaWxpcGlubyIsImZpIjoiRmlubmlzaCIsImZyIjoiRnJlbmNoIiwiZ2wiOiJHYWxpY2lhbiIsImthIjoiR2VvcmdpYW4iLCJkZSI6Ikdlcm1hbiIsImVsIjoiR3JlZWsiLCJndSI6Ikd1amFyYXRpIiwiaHQiOiJIYWl0aWFuIENyZW9sZSIsIml3IjoiSGVicmV3IiwiaGkiOiJIaW5kaSIsImh1IjoiSHVuZ2FyaWFuIiwiaXMiOiJJY2VsYW5kaWMiLCJpZCI6IkluZG9uZXNpYW4iLCJnYSI6IklyaXNoIiwiaXQiOiJJdGFsaWFuIiwiamEiOiJKYXBhbmVzZSIsImtuIjoiS2FubmFkYSIsImtvIjoiS29yZWFuIiwibGEiOiJMYXRpbiIsImx2IjoiTGF0dmlhbiIsImx0IjoiTGl0aHVhbmlhbiIsIm1rIjoiTWFjZWRvbmlhbiIsIm1zIjoiTWFsYXkiLCJtdCI6Ik1hbHRlc2UiLCJubyI6Ik5vcndlZ2lhbiIsImZhIjoiUGVyc2lhbiIsInBsIjoiUG9saXNoIiwicHQiOiJQb3J0dWd1ZXNlIiwicm8iOiJSb21hbmlhbiIsInJ1IjoiUnVzc2lhbiIsInNyIjoiU2VyYmlhbiIsInNrIjoiU2xvdmFrICIsInNsIjoiU2xvdmVuaWFuIiwiZXMiOiJTcGFuaXNoIiwic3ciOiJTd2FoaWxpIiwic3YiOiJTd2VkaXNoIiwidGEiOiJUYW1pbCIsInRlIjoiVGVsdWd1ICIsInRoIjoiVGhhaSIsInRyIjoiVHVya2lzaCIsInVrIjoiVWtyYWluaWFuIiwidXIiOiJVcmR1IiwidmkiOiJWaWV0bmFtZXNlIiwiY3kiOiJXZWxzaCIsInlpIjoiWWlkZGlzaCJ9'));

    const chatinput = {
        msg_replace(result, text_el) {
            text_el.value = result[0][0][0];
            text_el.dataset.translated = 1;
            if (config.direct_send) {
                text_el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: 13 }));
                text_el.dataset.translated = 0;
            }
        },
        enable_input_translation(lang_code) {
            config.translate_message = true;
            config.translate_message_to = lang_code;
            this.btn.innerText = `⇄ ${lang_code}`;
            this.btn.classList.remove('textgrey');
            this.btn.classList.add('textgreen');
            config.save();
        },
        lang_select_frame: 0,
        lang_select() {
            let chat_node = document.getElementById('chat');
            this.lang_select_frame = chat_node.parentElement.appendChild(el('div', { className: "panel-black", style: "position:absolute;bottom:50px;right:0px;display:block;z-index:999;" }));
            this.lang_select_frame.appendChild(el('div', { className: "panel textprimary title", innerText: 'Translate message' }));
            let menu = this.lang_select_frame.appendChild(el('div', { className: "menu panel-black grid four" }));

            Object.keys(languages).forEach(e =>
                menu.appendChild(el("small", { className: `btn border black ${e == config.translate_message_to && "textgreen" || "textgrey"}`, innerText: languages[e] }, { id: e })));

            this.lang_select_frame.addEventListener('mouseleave', e => {
                this.lang_select_frame = this.lang_select_frame.remove();
            });

            this.lang_select_frame.addEventListener('mousedown', e => {
                let lang_code = e.target.dataset.id;
                if (lang_code) {
                    this.lang_select_frame = this.lang_select_frame.remove();
                    this.enable_input_translation(lang_code);
                }
            });
        },
        init() {
            let chatinput = document.getElementById('chatinput');
            chatinput.style = "grid-template-columns: auto 1fr auto";
            this.input = chatinput.querySelector('input');

            this.btn = chatinput.appendChild(el('div', { className: `btn border black ${config.translate_message && 'textgreen' || 'textgrey'}`, innerText: `⇄ ${config.translate_message_to}` }));
            this.btn.addEventListener('mouseup', e => {
                if (e.button == 0) {
                    ['textgrey', 'textgreen'].forEach(c => e.target.classList.toggle(c));
                    config.translate_message ^= 1;
                    config.save();
                }
                else if (e.button == 2 && !this.lang_select_frame) {
                    this.lang_select();
                }
                else if (this.lang_select_frame) {
                    this.lang_select_frame = this.lang_select_frame.remove();
                }
            });

            this.input.addEventListener('keydown', e => {
                if (e.keyCode == 13 && this.input.dataset.translated == 1) {
                    this.input.dataset.translated = 0;
                }
                else if (e.keyCode == 13 && config.translate_message && this.input.dataset.translated != 1 && this.input.value.length > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    let text = this.input.value.trim();
                    if (text.length > 0) {
                        translate(text, config.translate_message_to, this.msg_replace, this.input);
                    }
                }
                else if (e.keyCode == 186) {
                    if (this.input.value.length == 1 && this.input.value == ':') {
                        e.preventDefault();
                        this.input.value = '';
                        ['textgrey', 'textgreen'].forEach(c => this.btn.classList.toggle(c));
                        config.translate_message ^= 1;
                    }
                    if (this.input.value.length == 2) {
                        e.preventDefault();
                        let lc = this.input.value.slice(0, 2);
                        if (languages.hasOwnProperty(lc)) {
                            this.input.value = '';
                            config.translate_message_to = lc;
                            this.btn.innerText = `⇄ ${lc}`;
                            config.translate_message = true;
                            this.btn.classList.remove('textgrey');
                            this.btn.classList.add('textgreen');
                        }
                    }
                }

            });

        }
    };

    const control = {
        init() {
            let channelselect = document.querySelector('.channelselect');
            this.btn = channelselect.appendChild(el('small', { className: `btn border black ${config.translate_chat && 'textgreen' || 'textgrey'} svelte-16y0b84`, innerText: `Translate` }));
            this.btn.addEventListener('mouseup', e => {
                if (e.button == 0) {
                    ['textgrey', 'textgreen'].forEach(c => e.target.classList.toggle(c));
                    config.translate_chat ^= 1;
                    config.save();
                }
            });
        }
    };

    const chat = {
        channels: new Set(['Global', 'Faction', 'Party', 'Clan', 'From', 'To']),
        size() {
            let chat_container_node = document.querySelector(".l-corner-ll.container.uiscaled.svelte-16y0b84");
            chat_container_node.style.height = config.chat_height + "px";
            chat_container_node.style.width = config.chat_width + "px";
        },
        init() {
            this.size();
            this.node = document.getElementById('chat');
            let mutation_observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length > 0) {
                        let line_node = mutation.addedNodes[0].childNodes[0];

                        let channel_node = line_node.childNodes[1].childNodes[0];

                        if (this.channels.has(channel_node.innerText)) {

                            let sender_node = line_node.childNodes[1].childNodes[2];
                            let text_node = line_node.childNodes[2];
                            let sender_info_node = sender_node.childNodes[0];
                            let sender_s_icon_node = sender_info_node.childNodes.length == 4 && sender_info_node.childNodes[0];
                            sender_info_node.childNodes[sender_s_icon_node && 1 || 0];

                            if (config.shrink_channel_name) {
                                channel_node.innerText = channel_node.innerText.slice(0, 1);
                            }

                            if (config.remove_supporter_icon && sender_s_icon_node) {
                                sender_s_icon_node.remove();
                            }

                            if (config.translate_chat) {
                                translate(text_node.innerText, config.translate_chat_to, this.chat_replace, text_node);
                            }
                            else {
                                text_node.classList.add("htr");
                                text_node.dataset.htr = config.tr_cnt;
                            }
                        }
                    }
                });
            });
            if (this.node) {
                mutation_observer.observe(this.node, { childList: true });


                let tt = undefined;
                ['mouseover', 'mouseout'].forEach(event_type =>
                    this.node.addEventListener(event_type, e => {
                        if (e.target.dataset.htt) {
                            if(event_type == 'mouseover') {
                                let c = e.target.getBoundingClientRect();
                                tt = document.querySelector('div.l-ui.layout.svelte-k3qmu8').appendChild(el('div', {
                                    className: 'window panel-black',
                                    innerText: e.target.dataset.htt,
                                    style: `max-width:300px;z-index: 12;position: absolute;left: ${c.right}px;top: ${c.top-25}px;`
                                }));
                            }
                            else if(event_type == 'mouseout') {
                                tt = tt.remove();
                            }
                        }
                    }, false)
                );


                this.node.addEventListener('mousedown', e => {
                    if (e.button == 0)
                        if (e.target.dataset.htr) {
                            translate(e.target.innerText, config.translate_chat_to, this.chat_replace, e.target);
                        }
                        else if (e.target.dataset.htt) {
                            e.preventDefault();
                            config.translate_message_to = e.target.dataset.htl;
                            chatinput.btn.innerText = ` ⇄ ${e.target.dataset.htl} `;
                            document.body.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, keyCode: 13 }));
                            config.save();
                        }
                }, false);
            }

        },

        chat_replace(result, text_el) {
            if (result[2] != config.translate_chat_to && languages.hasOwnProperty(result[2]) && result[6] > 0.3) {
                text_el.before(el('i', { className: "htr", innerText: `${result[2]}:` }, { htt: text_el.innerText, htl: result[2] }));
                text_el.removeAttribute('data-htr');
                text_el.classList.remove('htr');
                text_el.innerText = `${result[0][0][0]}`;
            }
        },

    };

    const el = (tag, options = {}, dataset = {}) => {
        let a = document.createElement(tag);
        for (let [t, e] of Object.entries(options)) {
            a[t] = e;
        }
        for (let [t, e] of Object.entries(dataset)) {
            a.dataset[t] = e;
        }
        return a
    };

    const config = {
        version: VERSION,
        translate_chat: true,
        translate_message: false,
        translate_chat_to: 'en',
        translate_message_to: 'en',
        shrink_channel_name: true,
        remove_supporter_icon: true,
        direct_send: true,
        tr_cnt: 0,
        chat_height: 240,
        chat_width: 450,
        _node: undefined,
        save() {
            window.localStorage.setItem('mod_translator', JSON.stringify(this));
        },
        load() {
            let s = JSON.parse(window.localStorage.getItem('mod_translator'));
            if (s && s.version == this.version) {
                for (const [k, v] of Object.entries(s) || {})
                    this[k] = v;
            }
        },

        add_group(header_text) {
            this._node.appendChild(el("div", { className: "textprimary", innerText: header_text }));
            this._node.appendChild(el("div"));
        },
        add_line(iname, ivalue) {
            this._node.appendChild(el("div", { innerText: iname && iname || '' }));
            this._node.appendChild(el("div", { innerText: ivalue && ivalue || '' }));
        },

        inject(settings_container) {
            let settings_divide = settings_container.childNodes[0].childNodes[1].childNodes[0];

            let panel = settings_divide.appendChild(el("div", { className: `menu panel-black scrollbar svelte-ntyx09` }, { mod: "Chat Translator" }));
            panel.style.display = 'none';

            panel.appendChild(el("h3", { className: 'textprimary', innerText: 'Translator' }));

            let settings = panel.appendChild(el("div", { className: 'settings svelte-ntyx09' }));

            this._node = settings;
            this.save();

            settings.appendChild(el("div", { innerText: 'Language' }))
                .appendChild(el("br")).parentElement
                .appendChild(el("small", { className: " textgrey", innerText: 'Translates chat into this language' }));
            let lo = settings.appendChild(el("select"));

            Object.keys(languages).forEach(e =>
                lo.appendChild(el("option", { value: e, innerText: languages[e], selected: config.translate_chat_to == e && true || false })));

            lo.addEventListener('change', e => {
                config.translate_chat_to = e.target.value;
                config.save();
            });

            this.add_line();

            this.add_group('Chat style');

            settings.appendChild(el("div", { innerText: 'Width' }));
            let cwv = settings.appendChild(el("input", { type: 'number', placeholder: "450", min: "450", value: this.chat_width }));
            settings.appendChild(el("div", { innerText: 'Height' }));
            let chv = settings.appendChild(el("input", { type: 'number', placeholder: "240", min: "240", value: this.chat_height }));

            cwv.addEventListener('input', e => {
                this.chat_width = e.target.value;
                chat.size();
                this.save();
            });

            chv.addEventListener('input', e => {
                this.chat_height = e.target.value;
                chat.size();
                this.save();
            });

            settings.appendChild(el("div", { innerText: 'Channels name shortening' }));
            let shrink_channel_name = settings.appendChild(el("div", { className: `btn checkbox ${this.shrink_channel_name && "active"}` }));
            shrink_channel_name.addEventListener('mouseup', e => {
                if (e.button == 0) {
                    e.target.classList.toggle('active');
                    this.shrink_channel_name ^= 1;
                    this.save();
                }
            });

            settings.appendChild(el("div", { innerText: 'Remove supporter icons' }));
            let remove_supporter_icon = settings.appendChild(el("div", { className: `btn checkbox ${this.remove_supporter_icon && "active"}` }));
            remove_supporter_icon.addEventListener('mouseup', e => {
                if (e.button == 0) {
                    e.target.classList.toggle('active');
                    this.remove_supporter_icon ^= 1;
                    this.save();
                }
            });

            this.add_line();

            this.add_group('Usage');
            this.add_line('On/off shortcut', '::');
            this.add_line('Language shortcuts', 'ko: es: en: ...');
            this.add_line('Emoji Windows', '⊞ + .');
            this.add_line('Emoji Linux', 'ctrl + .');
            this.add_line('Emoji Mac', 'Fn + E, 🌐 + E');

            this.add_line();
            this.add_group('Info');

            this.add_line('Translator version', this.version);
            this.add_line('Total translation requests', this.tr_cnt);

            let menu = settings_divide.childNodes[0];
            menu.appendChild(el("div", { className: `choice`, innerText: 'Chat Translator' }, { mod: "translator" }));
            menu.addEventListener('mouseup', e => {
                menu.childNodes.forEach(e => e.classList.remove('active'));
                e.target.classList.add('active');

                if (e.target.dataset.mod == "translator") {
                    e.target.parentElement.parentElement.childNodes.forEach((e, k) => { e.style.display = k > 0 && 'none'; });
                    panel.removeAttribute("style");
                }
                else {
                    e.target.parentElement.parentElement.childNodes.forEach((e, k) => { e.style.display = k > 0 && ""; });
                    panel.style.display = "none";
                }
            }, false);
        },
        init() {
            this.load();
            let settings_container = document.body.querySelector(".container.svelte-ntyx09");
            settings_container && this.inject(settings_container);

            let mutation_observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => mutation.addedNodes[0]?.className == 'container svelte-ntyx09' && this.inject(mutation.addedNodes[0]));
            });

            let layout_container = document.body.querySelector(".container.svelte-k3qmu8");
            layout_container && mutation_observer.observe(layout_container, { childList: true });
        },
    };

    const style = {
        rules: `
            .htr{pointer-events:all;cursor:pointer;margin-right:.35em;font-style:normal;}
            .htb{font-style: normal;filter: grayscale(1) sepia(29%) saturate(406%) hue-rotate(143deg) brightness(50%) contrast(87%);}
        `,
        init() {
            let styleSheet = new CSSStyleSheet();
            document.adoptedStyleSheets = [...document.adoptedStyleSheets, styleSheet];
            this.rules.split('}').forEach((rule)=> {
                if (rule.trim() !== '') {
                    styleSheet.insertRule(rule + '}', styleSheet.cssRules.length);
                }
            });
        },
    };

    loader.start();

})();
