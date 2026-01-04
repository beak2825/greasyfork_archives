// ==UserScript==
// @name        HTML5 video settings
// @name:ru     Настройки HTML5 видео
// @namespace   html5-video-settings
// @author      smut
// @version     2020.09.30.1
// @icon https://img.icons8.com/color/344/video.png
// @description Change on load default HTML5 video behavior
// @description:ru Изменение дефолтных параметров воспроизведения HTML5 видео
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM.cookie
// @grant        GM_util
// @grant        GM_util.timeout
// @grant        unsafeWindow
// @grant        window.close
// @exclude      /^https?:\/\/([^.]+\.)*?(youtube\.com|coub\.com|youtu\.be|pikabu\.ru)([:/]|$)/
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/411222/HTML5%20video%20settings.user.js
// @updateURL https://update.greasyfork.org/scripts/411222/HTML5%20video%20settings.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const win = (unsafeWindow || window);

    const
        _Document = Object.getPrototypeOf(HTMLDocument.prototype),
        _Element = Object.getPrototypeOf(HTMLElement.prototype);
    const
        _Node = Object.getPrototypeOf(_Element);

    const
        isSafari =
            Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
            (function (p) {
                return p.toString() === "[object SafariRemoteNotification]";
            })(!window.safari || window.safari.pushNotification),
        isFirefox = 'InstallTrigger' in win,
        inIFrame = (win.self !== win.top);
    const
        _bindCall = fun => Function.prototype.call.bind(fun),
        _getAttribute = _bindCall(_Element.getAttribute),
        _setAttribute = _bindCall(_Element.setAttribute),
        _removeAttribute = _bindCall(_Element.removeAttribute),
        _hasOwnProperty = _bindCall(Object.prototype.hasOwnProperty),
        _toString = _bindCall(Function.prototype.toString),
        _document = win.document,
        _de = _document.documentElement,
        _appendChild = _Document.appendChild.bind(_de),
        _removeChild = _Document.removeChild.bind(_de),
        _createElement = _Document.createElement.bind(_document),
        _querySelector = _Document.querySelector.bind(_document),
        _querySelectorAll = _Document.querySelectorAll.bind(_document),
        _attachShadow = ('attachShadow' in _Element) ? _bindCall(_Element.attachShadow) : null,
        _apply = Reflect.apply,
        _construct = Reflect.construct;

    let skipLander = true;
    try {
        skipLander = !(isFirefox && 'StopIteration' in win);
    } catch (ignore) {}

    const jsf = (function () {
        const opts = {};
        let getValue = (a, b) => b,
            setValue = () => null,
            listValues = () => [];
        try {
            [getValue, setValue, listValues] = [GM_getValue, GM_setValue, GM_listValues];
        } catch (ignore) {}
        // defaults
        opts.Lang = 'eng';
        opts.controls = true;
        opts.loop = false;
        opts.autoplay = false;
        opts.muted = false;
        // load actual values
        for (let name of listValues())
            opts[name] = getValue(name, opts[name]);
        const checkName = name => {
            if (!_hasOwnProperty(opts, name))
                throw new Error('Attempt to access missing option value.');
            return true;
        };
        return new Proxy(opts, {
            get(opts, name) {
                if (name === 'toString')
                    return () => JSON.stringify(opts);
                if (checkName(name))
                    return opts[name];
            },
            set(opts, name, value) {
                if (checkName(name)) {
                    opts[name] = value;
                    setValue(name, value);
                }
                return true;
            }
        });
    })();

    if (isFirefox && _document.constructor.prototype.toString() === '[object ImageDocumentPrototype]')
        return;

    if (!NodeList.prototype[Symbol.iterator])
        NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
    if (!HTMLCollection.prototype[Symbol.iterator])
        HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];

    if (GM.cookie === undefined)
        GM.cookie = {
            list: () => ({
                then: () => null
            })
        };

    const
        batchLand = [],
        batchPrepend = new Set(),
        _APIString = `const win = window, isFirefox = ${isFirefox}, inIFrame = ${inIFrame}, _document = win.document, _de = _document.documentElement,
        _Document = Object.getPrototypeOf(HTMLDocument.prototype), _Element = Object.getPrototypeOf(HTMLElement.prototype), _Node = Object.getPrototypeOf(_Element),
        _appendChild = _Document.appendChild.bind(_de), _removeChild = _Document.removeChild.bind(_de), skipLander = ${skipLander},
        _createElement = _Document.createElement.bind(_document), _querySelector = _Document.querySelector.bind(_document),
        _querySelectorAll = _Document.querySelectorAll.bind(_document), _bindCall = fun => Function.prototype.call.bind(fun),
        _getAttribute = _bindCall(_Element.getAttribute), _setAttribute = _bindCall(_Element.setAttribute),
        _removeAttribute = _bindCall(_Element.removeAttribute), _hasOwnProperty = _bindCall(Object.prototype.hasOwnProperty),
        _toString = _bindCall(Function.prototype.toString), _apply = Reflect.apply, _construct = Reflect.construct;
        const GM = { info: { version: '0.0', scriptHandler: null }, cookie: { list: () => ({ then: () => null }) } };
        const jsf = ${jsf.toString()}`,
        landScript = (f, pre) => {
            const script = _createElement('script');
            script.textContent = `(()=>{${_APIString}${[...pre].join(';')};(${f.join(')();(')})();})();`;
            _appendChild(script);
            _removeChild(script);
        },
        startdelay = 2000,
        clickdelay = 1000,
        playdelay = 200;
    var first_load_mute = false;
    var play_click_iframe = false;
    var play_click_timeout;

    let scriptLander = f => f();
    if (!skipLander) {
        scriptLander = (func, ...prepend) => {
            prepend.forEach(x => batchPrepend.add(x));
            batchLand.push(func);
        };
        _document.addEventListener(
            'DOMContentLoaded', () => void(scriptLander = (f, ...prep) => landScript([f], prep)), false
        );
    }

    function play_click_switch(play_switch) {
        play_click_iframe = play_switch;
    }
    function html5_video_set(play_click) {
        for (var e of document.getElementsByTagName('video')){
            if (jsf.controls){
                e.setAttribute('controls', '');
                e.controls = "controls";
                if (play_click){
                    if (window.location.hostname === 'www.instagram.com'){
                        var instaoverlay = document.querySelector('.PyenC');
                        var isntacontrol = document.querySelector('.fXIG0');
                        //console.log (instaoverlay);
                        if(document.querySelector('.PyenC')){
                            instaoverlay.parentNode.removeChild(instaoverlay);
                        }
                        if(document.querySelector('.fXIG0')){
                            isntacontrol.parentNode.removeChild(isntacontrol);
                        }
                    }
                }
            }else{
                e.removeAttribute('controls');
                e.controls = "";
            }
            if (jsf.loop){
                e.setAttribute('loop', '');
                e.loop = "loop";
            }else{
                e.removeAttribute('loop');
                e.loop = "";
            }
            if (jsf.muted && !play_click){
                e.setAttribute('muted', '');
                e.muted = "muted";
                first_load_mute = true;
            }else{
                e.removeAttribute('muted');
            }
            if (jsf.autoplay && !play_click){
                //console.log("autoplay");
                e.setAttribute('autoplay', '');
                e.autoplay = "autoplay";
                e.play();
            }else if (!play_click){
                e.removeAttribute('autoplay');
                e.autoplay = "";
                e.pause();
                //console.log("pause");
            }
        };
    }

    const createStyle = (function createStyleModule() {
        function createStyleElement(rules, opts) {
            const style = _createElement('style');
            Object.assign(style, opts.props);
            opts.root.appendChild(style);

            if (style.sheet) // style.sheet is only available when style attached to DOM
                rules.forEach(style.sheet.insertRule.bind(style.sheet));
            else
                style.textContent = rules.join('\n');

            if (opts.protect) {
                Object.defineProperty(style, 'sheet', {
                    value: null,
                    enumerable: true
                });
                Object.defineProperty(style, 'disabled', { //pretend to be disabled
                    enumerable: true,
                    set() {},
                    get() {
                        return true;
                    }
                });
                (new MutationObserver(
                    () => opts.root.removeChild(style)
                )).observe(style, {
                    childList: true
                });
            }

            return style;
        }

        // functions to parse object-based rulesets
        function parseRule(rec) {
            /* jshint validthis: true */
            return this.concat(rec[0], ' {\n', Object.entries(rec[1]).map(parseProperty, this + '\t').join('\n'), '\n', this, '}');
        }

        function parseProperty(rec) {
            /* jshint validthis: true */
            return rec[1] instanceof Object ? parseRule.call(this, rec) : `${this}${rec[0].replace(/_/g, '-')}: ${rec[1]};`;
        }

        // main
        const createStyle = (rules, opts) => {
            // parse options
            opts = Object.assign({
                protect: true,
                root: _de,
                type: 'text/css'
            }, opts);
            // move style properties into separate property
            // { a, b, ...rest } construction is not available in Fx 52
            opts.props = Object.assign({}, opts);
            delete opts.props.protect;
            delete opts.props.root;
            // store binded methods instead of element
            opts.root = {
                appendChild: opts.root.appendChild.bind(opts.root),
                removeChild: opts.root.removeChild.bind(opts.root)
            };

            // convert rules set into an array if it isn't one already
            rules = Array.isArray(rules) ? rules : rules instanceof Object ? Object.entries(rules).map(parseRule, '') : [rules];

            // could be reassigned when protection triggered
            let style = createStyleElement(rules, opts);

            if (!opts.protect)
                return style;

            const replaceStyle = () => new Promise(
                resolve => setTimeout(re => re(createStyleElement(rules, opts)), 0, resolve)
            ).then(st => (style = st)); // replace poiner to style object with a new style object

            (new MutationObserver(ms => {
                for (let m of ms)
                    for (let node of m.removedNodes)
                        if (node === style) replaceStyle();
            })).observe(_de, {
                childList: true
            });


            return style;
        };
        createStyle.toString = () => `const createStyle = (${createStyleModule.toString()})();`;
        return createStyle;
    })();

    const lines = {
        linked: [],
        MenuOptions: {
            eng: 'Options',
            rus: 'Настройки'
        },
        langs: {
            eng: 'English',
            rus: 'Русский'
        },
        HeaderName: {
            eng: 'HTML5 video settings',
            rus: 'Настройки HTML5 видео'
        },
        HeaderTools: {
            eng: 'Tools',
            rus: 'Инструменты'
        },
        HeaderOptions: {
            eng: 'Options',
            rus: 'Настройки'
        },
        controlsLabel: {
            eng: 'Show controls',
            rus: 'Отображать элементы управления'
        },
        loopLabel: {
            eng: 'Loop video',
            rus: 'Повтор видео'
        },
        autoplayLabel: {
            eng: 'Autoplay video',
            rus: 'Автоматическое воспроизведение видео'
        },
        autoplayTip: {
            eng: 'Autoplay may not working if "Mute sound" not enabled',
            rus: 'Автовоспроизведение может не работать, если не установлен режим \"отключить звук\"'
        },
        mutedLabel: {
            eng: 'Mute sound',
            rus: 'Отключить звук'
        },
        reg(el, name) {
            this[name].link = el;
            this.linked.push(name);
        },
        setLang(lang = 'eng') {
            for (let name of this.linked) {
                const el = this[name].link;
                const label = this[name][lang];
                el.textContent = label;
            }
            this.langs.link.value = lang;
            jsf.Lang = lang;
        }
    };

    const _createTextNode = _Document.createTextNode.bind(_document);
    const createOptionsWindow = () => {
        const root = _createElement('div'),
            shadow = _attachShadow ? _attachShadow(root, {
                mode: 'closed'
            }) : root,
            overlay = _createElement('div'),
            inner = _createElement('div');

        overlay.id = 'overlay';
        overlay.appendChild(inner);
        shadow.appendChild(overlay);

        inner.id = 'inner';
        inner.br = function appendBreakLine() {
            return this.appendChild(_createElement('br'));
        };

        createStyle({
            'h2': {
                margin_top: 0,
                white_space: 'nowrap'
            },
            'h2, h3': {
                margin_block_end: '0.5em'
            },
            'h4': {
                margin_block_start: '0em',
                margin_block_end: '0.5em',
                margin_left: '0.4em',
                font_family: 'Helvetica, Arial, sans-serif',
                font_size: '8pt',
                font_style: 'italic',
                font_weight: 'normal'
            },
            'div, button, select, input': {
                font_family: 'Helvetica, Arial, sans-serif',
                font_size: '12pt'
            },
            'select': {
                border: '1px solid darkgrey',
                border_radius: '0px 0px 5px 5px',
                border_top: '0px'
            },
            '#overlay': {
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                background: 'rgba(0,0,0,0.65)',
                z_index: 2147483647 // Highest z-index: Math.pow(2, 31) - 1
            },
            '#inner': {
                background: 'whitesmoke',
                color: 'black',
                padding: '1.5em 1em 1.5em 1em',
                max_width: '150ch',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1px solid darkgrey',
                border_radius: '5px'
            },
            '#closeOptionsButton': {
                float: 'right',
                transform: 'translate(1em, -1.5em)',
                border: 0,
                border_radius: 0,
                background: 'none',
                box_shadow: 'none'
            },
            '#selectLang': {
                float: 'right',
                transform: 'translate(0, -1.5em)'
            },
            '.optionsLabel': {
                padding_left: '1.5em',
                text_indent: '-1em',
                display: 'block'
            },
            '.optionsCheckbox': {
                left: '-0.25em',
                width: '1em',
                height: '1em',
                padding: 0,
                margin: 0,
                position: 'relative',
                vertical_align: 'middle'
            },
            '@media (prefers-color-scheme: dark)': {
                '#inner': {
                    background_color: '#292a2d',
                    color: 'white',
                    border: '1px solid #1a1b1e'
                },
                'input': {
                    filter: 'invert(100%)'
                },
                'select': {
                    background_color: '#303030',
                    color: '#f0f0f0',
                    border: '1px solid #1a1b1e',
                    border_radius: '0px 0px 5px 5px',
                    border_top: '0px'
                },
                '#overlay': {
                    background: 'rgba(0,0,0,.85)',
                }
            }
        }, {
            root: shadow,
            protect: false
        });

        // components
        function createCheckbox(name) {
            const checkbox = _createElement('input'),
                label = _createElement('label');
            checkbox.type = 'checkbox';
            checkbox.classList.add('optionsCheckbox');
            checkbox.checked = jsf[name];
            checkbox.id = name+'_checkbox';
            checkbox.onclick = e => {
                jsf[name] = e.target.checked;
                return true;
            };
            label.classList.add('optionsLabel');
            label.appendChild(checkbox);
            const text = _createTextNode('');
            label.appendChild(text);
            Object.defineProperty(label, 'textContent', {
                set(title) {
                    text.textContent = title;
                }
            });
            return label;
        }

        // language & close
        const closeBtn = _createElement('button');
        closeBtn.onclick = () => _removeChild(root);
        closeBtn.textContent = '\u2715';
        closeBtn.id = 'closeOptionsButton';
        inner.appendChild(closeBtn);

        overlay.addEventListener('click', e => {
            if (e.target === overlay) {
                _removeChild(root);
                e.preventDefault();
            }
            e.stopPropagation();
        }, false);

        const selectLang = _createElement('select');
        for (let name in lines.langs) {
            const langOption = _createElement('option');
            langOption.value = name;
            langOption.innerText = lines.langs[name];
            selectLang.appendChild(langOption);
        }
        selectLang.id = 'selectLang';
        lines.langs.link = selectLang;
        inner.appendChild(selectLang);

        selectLang.onchange = e => {
            const lang = e.target.value;
            lines.setLang(lang);
        };

        // fill options form

        lines.reg(inner.appendChild(_createElement('h2')), 'HeaderName');

        lines.reg(inner.appendChild(_createElement('h3')), 'HeaderOptions');

        lines.reg(inner.appendChild(createCheckbox('controls')), 'controlsLabel');
        lines.reg(inner.appendChild(createCheckbox('loop')), 'loopLabel');
        lines.reg(inner.appendChild(createCheckbox('autoplay')), 'autoplayLabel');

        lines.reg(inner.appendChild(_createElement('h4')), 'autoplayTip');

        lines.reg(inner.appendChild(createCheckbox('muted')), 'mutedLabel');

        lines.setLang(jsf.Lang);

        return root;
    };

    let optionsWindow;
    GM_registerMenuCommand(lines.MenuOptions[jsf.Lang], () => _appendChild(optionsWindow = optionsWindow || createOptionsWindow()));

    if( document.readyState !== 'loading' ) {
        setTimeout (function () {html5_video_set;}, startdelay);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout (function () {html5_video_set;}, startdelay);
        });
    }
    function video_click(){
        play_click_iframe = true;
        //console.log("play_click_iframe = " + play_click_iframe);
        if(play_click_iframe) {
            clearTimeout(play_click_timeout);
            play_click_timeout = setTimeout(function () {play_click_switch(false);}, clickdelay);
            //setTimeout(function () {console.log("play_click_iframe = " + play_click_iframe);}, clickdelay+100);
        }
        //console.log("clicked");

    };
    document.addEventListener('play', function(e){

        document.addEventListener('click', video_click, true);
        setTimeout (function () {html5_video_set(play_click_iframe);}, playdelay);
        //console.log("play");
    }, true);

})();