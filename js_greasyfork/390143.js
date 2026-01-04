// ==UserScript==
// @name         HTML5 Video Player Enhance
// @version      2.9.6.1
// @description  To enhance the functionality of HTML5 Video Player (h5player) supporting all websites using shortcut keys similar to PotPlayer.
// @author       CY Fung
// @icon https://image.flaticon.com/icons/png/128/3291/3291444.png
// @match        https://*/*
// @match        http://*/*
// @exclude      https://www.youtube.com/live_chat*
// @run-at       document-start
// @require https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js
// @namespace https://greasyfork.org/users/371179
// @grant   GM_getValue
// @grant   GM_setValue
// @grant   unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/390143/HTML5%20Video%20Player%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/390143/HTML5%20Video%20Player%20Enhance.meta.js
// ==/UserScript==
/**
 * Remarks
 * This script support modern browser only with ES6+.
 * fullscreen and pointerLock   buggy in shadowRoot
 * Space Pause not success
 * shift F key issue
 **/
!(function($winUnsafe, $winSafe) {
    'use strict';


    !(() => 0)({
        requestAnimationFrame,
        cancelAnimationFrame,
        MutationObserver,
        setInterval,
        clearInterval,
        EventTarget,
        Promise,
        ResizeObserver
    });
    //throw Error if your browser is too outdated. (eg ES6 script, no such window object)

    const window = $winUnsafe || $winSafe
    const document = window.document
    const $$uWin = $winUnsafe || $winSafe;

    const $rAf = $$uWin.requestAnimationFrame;
    const $cAf = $$uWin.cancelAnimationFrame;

    const $$setTimeout = $$uWin.setTimeout
    const $$clearTimeout = $$uWin.clearTimeout
    const $$requestAnimationFrame = $$uWin.requestAnimationFrame;
    const $$cancelAnimationFrame = $$uWin.cancelAnimationFrame;

    const $$addEventListener = Node.prototype.addEventListener;
    const $$removeEventListener = Node.prototype.removeEventListener;

    const $bz = {
            boosted: false
        }

    const utPositioner='KVZX';

    1&&!(function $$() {
        'use strict';

        if (!document) return;
        if (!document.documentElement) return window.requestAnimationFrame($$);

        const prettyElm = function(elm) {
            if (!elm || !elm.nodeName) return null;
            const eId = elm.id || null;
            const eClsName = elm.className || null;
            return [elm.nodeName.toLowerCase(), typeof eId == 'string' ? "#" + eId : '', typeof eClsName == 'string' ? '.' + eClsName.replace(/\s+/g, '.') : ''].join('').trim();
        }

        const delayCall = function(p, f, d) {
            if (delayCall[p] > 0) delayCall[p] = window.clearTimeout(delayCall[p])
            if (f) delayCall[p] = window.setTimeout(f, d)
        }

        function isVideoPlaying(video){
            return video.currentTime > 0 && !video.paused && !video.ended && video.readyState > video.HAVE_CURRENT_DATA;
        }


        const wmListeners = new WeakMap();

        class Listeners {
            constructor() {}
            get count() {
                return (this._count || 0)
            }
            makeId() {
                return ++this._lastId
            }
            add(lh) {
                this[++this._lastId] = lh;
                this._count++;
            }
            remove(lh_removal) {
                for (let k in this) {
                    let lh = this[k]
                    if (lh && lh.constructor == ListenerHandle && lh_removal.isEqual(lh)) {
                        delete this[k];
                        this._count--;
                    }
                }
            }
        }


        class ListenerHandle {
            constructor(func, options) {
                this.func = func
                this.options = options
            }
            isEqual(anotherLH) {
                if (this.func != anotherLH.func) return false;
                if (this.options === anotherLH.options) return true;
                if (this.options && anotherLH.options && typeof this.options == 'object' && typeof anotherLH.options == 'object') {
                    return this.uOpt() == anotherLH.uOpt()
                } else {
                    return false;
                }
            }
            uOpt() {
                let opt1 = "";
                for (var k in this.options) {
                    opt1 += ", " + k + " : " + (typeof this[k] == 'boolean' ? this[k] : "N/A");
                }
                return opt1;
            }
        }


        Object.defineProperties(Listeners.prototype, {
            _lastId: {
                value: 0,
                writable: true,
                enumerable: false,
                configurable: true
            },
            _count: {
                value: 0,
                writable: true,
                enumerable: false,
                configurable: true
            }
        });




        let _debug_h5p_logging_ = false;

        try {
            _debug_h5p_logging_ = +window.localStorage.getItem('_h5_player_sLogging_') > 0
        } catch (e) {}



        const SHIFT = 1;
        const CTRL = 2;
        const ALT = 4;
        const TERMINATE = 0x842;
        const _sVersion_ = 1817;
        const str_postMsgData = '__postMsgData__'
        const DOM_ACTIVE_FOUND = 1;
        const DOM_ACTIVE_SRC_LOADED = 2;
        const DOM_ACTIVE_ONCE_PLAYED = 4;
        const DOM_ACTIVE_MOUSE_CLICK = 8;
        const DOM_ACTIVE_KEY_DOWN = 64;
        const DOM_ACTIVE_FULLSCREEN = 128;
        const DOM_ACTIVE_MOUSE_IN = 16;
        const DOM_ACTIVE_DELAYED_PAUSED = 32;
        const DOM_ACTIVE_INVALID_PARENT = 2048;

        var console = {};

        console.log = function() {
            window.console.log(...['[h5p]', ...arguments])
        }
        console.error = function() {
            window.console.error(...['[h5p]', ...arguments])
        }

        function makeNoRoot(shadowRoot) {
            const doc = shadowRoot.ownerDocument || document;
            const htmlInShadowRoot = doc.createElement('noroot'); // pseudo element
            const childNodes = [...shadowRoot.childNodes]
            shadowRoot.insertBefore(htmlInShadowRoot, shadowRoot.firstChild)
            for (const childNode of childNodes) htmlInShadowRoot.appendChild(childNode);
            return shadowRoot.querySelector('noroot');
        }

        let _endlessloop = null;
        const isIframe = (window.top !== window.self && window.top && window.self);
        const rootDocs = [];

        const _getRoot = Element.prototype.getRootNode || HTMLElement.prototype.getRootNode || function() {
            let elm = this;
            while (elm) {
                if ('host' in elm) return elm;
                elm = elm.parentNode;
            }
            return elm;
        }

        const getRoot = (elm) => _getRoot.call(elm);



        class VQuery{

            constructor(){
            this.videos={};
                this.wmMutations={};
            }
            setVideo(key, value){this.videos[key]=value}
            player(key){
                const video=this.videos[key];
                return video&&video.parentNode?video:null;
            }
            rootNode(key){
                const video=this.videos[key];
                return video?getRoot(video):null;
            }

        }

        const $vQuery=new VQuery();

        const isShadowRoot = (elm) => (elm && ('host' in elm)) ? elm.nodeType == 11 && !!elm.host && elm.host.nodeType == 1 : null; //instanceof ShadowRoot


        const domAppender = (d) => d.querySelector('head') || d.querySelector('html') || d.querySelector('noroot') || null;

        const playerConfs = {}

        const hanlderResizeVideo = (entries) => {
            const detected_changes = {};
            for (let entry of entries) {
                const player = entry.target.nodeName == "VIDEO" ? entry.target : entry.target.querySelector("VIDEO[_h5ppid]");
                if (!player || !player.parentNode) continue;
                const vpid = player.getAttribute('_h5ppid');
                if (!vpid) continue;
                if (vpid in detected_changes) continue;
                detected_changes[vpid] = true;
                const {wPlayerInner,wPlayer} = $hs.getPlayerBlockElement(player)
                if (!wPlayerInner) continue;
                const layoutBoxInner = wPlayerInner.parentNode
                if (!layoutBoxInner) continue;
                let tipsDom = layoutBoxInner.querySelector('[data-h5p-pot-tips]');

                if (tipsDom) {
                    if (tipsDom._tips_display_none) tipsDom.setAttribute('data-h5p-pot-tips', '')
                    $hs.fixNonBoxingVideoTipsPosition(tipsDom, player);
                } else {
                    tipsDom = $vQuery.rootNode(vpid).querySelector(`#${player.getAttribute('_h5player_tips')}`)
                    if (tipsDom) {
                        if (tipsDom._tips_display_none) tipsDom.setAttribute('data-h5p-pot-tips', '')
                        $hs.change_layoutBox(tipsDom, player);
                        $hs.tipsDomObserve(tipsDom, player);
                    }
                }

            }
        };

        const $mb = {



            nightly_isSupportQueueMicrotask: function() {

                if ('_isSupportQueueMicrotask' in $mb) return $mb._isSupportQueueMicrotask;

                $mb._isSupportQueueMicrotask = false;
                $mb.queueMicrotask = window.queueMicrotask;
                if (typeof $mb.queueMicrotask == 'function') {
                    $mb._isSupportQueueMicrotask = true;
                }

                return $mb._isSupportQueueMicrotask;

            },

            stable_isSupportAdvancedEventListener: function() {

                if ('_isSupportAdvancedEventListener' in $mb) return $mb._isSupportAdvancedEventListener
                let prop = 0;
                $$addEventListener.call(document.createAttribute('z'), 'z', () => 0, {
                    get passive() {
                        prop++;
                    },
                    get once() {
                        prop++;
                    }
                });
                return ($mb._isSupportAdvancedEventListener = (prop == 2));
            },

            stable_isSupportPassiveEventListener: function() {

                if ('_isSupportPassiveEventListener' in $mb) return $mb._isSupportPassiveEventListener
                let prop = 0;
                $$addEventListener.call(document.createAttribute('z'), 'z', () => 0, {
                    get passive() {
                        prop++;
                    }
                });
                return ($mb._isSupportPassiveEventListener = (prop == 1));
            },

            eh_capture_passive: () => ($mb._eh_capture_passive = $mb._eh_capture_passive || ($mb.stable_isSupportPassiveEventListener() ? {
                capture: true,
                passive: true
            } : true)),

            eh_bubble_passive: () => ($mb._eh_capture_passive = $mb._eh_capture_passive || ($mb.stable_isSupportPassiveEventListener() ? {
                capture: false,
                passive: true
            } : false))

        }



        Element.prototype.__matches__ = (Element.prototype.matches || Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector ||
            Element.prototype.matches()); // throw Error if not supported

        //  built-in hash - https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
        async function digestMessage(message) {
            return $winSafe.sha256(message)
        }

        const dround = (x) => ~~(x + .5);

        const jsonStringify_replacer = function(key, val) {
            if (val && (val instanceof Element || val instanceof Document)) return val.toString();
            return val; // return as is
        };

        const jsonParse = function() {
            try {
                return JSON.parse.apply(this, arguments)
            } catch (e) {}
            return null;
        }
        const jsonStringify = function(obj) {
            try {
                return JSON.stringify.call(this, obj, jsonStringify_replacer)
            } catch (e) {}
            return null;
        }

        function _postMsg() {
            //async is needed. or error handling for postMessage
            const [win, tag, ...data] = arguments;
            if (typeof tag == 'string') {
                let postMsgObj = {
                    tag,
                    passing: true,
                    winOrder: _postMsg.a
                }
                try {
                    let k = 'msg-' + (+new Date)
                    win.document[str_postMsgData] = win.document[str_postMsgData] || {}
                    win.document[str_postMsgData][k] = data; //direct
                    postMsgObj.str = k;
                    postMsgObj.stype = 1;
                } catch (e) {}
                if (!postMsgObj.stype) {
                    postMsgObj.str = jsonStringify({
                        d: data
                    })
                    if (postMsgObj.str && postMsgObj.str.length) postMsgObj.stype = 2;
                }
                if (!postMsgObj.stype) {
                    postMsgObj.str = "" + data;
                    postMsgObj.stype = 0;
                }
                win.postMessage(postMsgObj, '*');
            }

        }

        function postMsg() {
            let win = window;
            let a = 0;
            while ((win = win.parent) && ('postMessage' in win)) {
                _postMsg.a = ++a;
                _postMsg(win, ...arguments)
                if (win == top) break;
            }
        }


        function crossBrowserTransition(type) {
            if (crossBrowserTransition['_result_' + type]) return crossBrowserTransition['_result_' + type]
            let el = document.createElement("fakeelement");

            const capital = (x) => x[0].toUpperCase() + x.substr(1);
            const capitalType = capital(type);

            const transitions = {
                [type]: `${type}end`,
                [`O${capitalType}`]: `o${capitalType}End`,
                [`Moz${capitalType}`]: `${type}end`,
                [`Webkit${capitalType}`]: `webkit${capitalType}End`,
                [`MS${capitalType}`]: `MS${capitalType}End`
            }

            for (let styleProp in transitions) {
                if (el.style[styleProp] !== undefined) {
                    return (crossBrowserTransition['_result_' + type] = transitions[styleProp]);
                }
            }
        }

        const fn_toString = (f, n = 50) => {
            let s = (f + "");
            if (s.length > 2 * n + 5) {
                s = s.substr(0, n) + ' ... ' + s.substr(-n);
            }
            return s
        };

        function consoleLog() {
            if (!_debug_h5p_logging_) return;
            if (isIframe) postMsg('consoleLog', ...arguments);
            else console.log.apply(console, arguments);
        }

        function consoleLogF() {
            if (isIframe) postMsg('consoleLog', ...arguments);
            else console.log.apply(console, arguments);
        }

        class AFLooperArray extends Array {
            constructor() {
                super();
                this.activeLoopsCount = 0;
                this.cid = 0;
                this.loopingFrame = this.loopingFrame.bind(this);
            }

            loopingFrame() {
                if (!this.cid) return; //cancelled
                for (const opt of this) {
                    if (opt.isFunctionLooping) opt.fn();
                }
            }

            get isArrayLooping() {
                return this.cid > 0;
            }

            loopStart() {
                this.cid = window.setInterval(this.loopingFrame, 300);
            }
            loopStop() {
                if (this.cid) window.clearInterval(this.cid);
                this.cid = 0;
            }
            appendLoop(fn) {
                if (typeof fn != 'function' || !this) return;
                const opt = new AFLooperFunc(fn, this);
                super.push(opt);
                return opt;
            }
        }

        class AFLooperFunc {
            constructor(fn, bind) {
                this._looping = false;
                this.bind = bind;
                this.fn = fn;
            }
            get isFunctionLooping() {
                return this._looping;
            }
            loopingStart() {
                if (this._looping === false) {
                    this._looping = true;
                    if (++this.bind.activeLoopsCount == 1) this.bind.loopStart();
                }
            }
            loopingStop() {
                if (this._looping === true) {
                    this._looping = false;
                    if (--this.bind.activeLoopsCount == 0) this.bind.loopStop();
                }
            }
        }

        function decimalEqual(a, b) {
            return Math.round(a * 100000000) == Math.round(b * 100000000)
        }

        function nonZeroNum(a) {
            return a > 0 || a < 0;
        }

        class PlayerConf {

            get scaleFactor() {
                return this.mFactor * this.vFactor;
            }

            cssTransform() {

                const playerConf = this;
                const player = playerConf.domElement;
                if (!player || !player.parentNode) return;
                const videoScale = playerConf.scaleFactor;

                let {
                    x,
                    y
                } = playerConf.translate;

                let [_x, _y] = ((playerConf.rotate % 180) == 90) ? [y, x] : [x, y];


                if ((playerConf.rotate % 360) == 270) _x = -_x;
                if ((playerConf.rotate % 360) == 90) _y = -_y;

                var s = [
                    playerConf.rotate > 0 ? 'rotate(' + playerConf.rotate + 'deg)' : '',
                    !decimalEqual(videoScale, 1.0) ? 'scale(' + videoScale + ')' : '',
                    (nonZeroNum(_x) || nonZeroNum(_y)) ? `translate(${_x}px, ${_y}px)` : '',
                ];

                player.style.transform = s.join(' ').trim()

            }

            constructor() {

                this.translate = {
                    x: 0,
                    y: 0
                };
                this.rotate = 0;
                this.mFactor = 1.0;
                this.vFactor = 1.0;
                this.fps = 30;
                this.filter_key = {};
                this.filter_view_units = {
                    'hue-rotate': 'deg',
                    'blur': 'px'
                };
                this.filterReset();

            }

            setFilter(prop, f) {

                let oldValue = this.filter_key[prop];
                if (typeof oldValue != 'number') return;
                let newValue = f(oldValue)
                if (oldValue != newValue) {

                    newValue = +newValue.toFixed(6); //javascript bug

                }

                this.filter_key[prop] = newValue
                this.filterSetup();

                return newValue;



            }

            filterSetup(options) {

                let ums = GM_getValue("unsharpen_mask")
                if (!ums) ums = ""

                let view = []
                let playerElm = $hs.player();
                if (!playerElm || !playerElm.parentNode) return;
                for (let view_key in this.filter_key) {
                    let filter_value = +((+this.filter_key[view_key] || 0).toFixed(3))
                    let addTo = true;
                    switch (view_key) {
                        case 'brightness':
                            /* fall through */
                        case 'contrast':
                            /* fall through */
                        case 'saturate':
                            if (decimalEqual(filter_value, 1.0)) addTo = false;
                            break;
                        case 'hue-rotate':
                            /* fall through */
                        case 'blur':
                            if (decimalEqual(filter_value, 0.0)) addTo = false;
                            break;
                    }
                    let view_unit = this.filter_view_units[view_key] || ''
                    if (addTo) view.push(`${view_key}(${filter_value}${view_unit})`)
                    this.filter_key[view_key] = Number(+this.filter_key[view_key] || 0)
                }
                if (ums) view.push(`url("#_h5p_${ums}")`);
                if (options && options.grey) view.push('url("#grey1")');
                playerElm.style.filter = view.join(' ').trim(); //performance in firefox is bad
            }

            filterReset() {
                this.filter_key['brightness'] = 1.0
                this.filter_key['contrast'] = 1.0
                this.filter_key['saturate'] = 1.0
                this.filter_key['hue-rotate'] = 0.0
                this.filter_key['blur'] = 0.0
                this.filterSetup()
            }

        }

        const Store = {
            prefix: '_h5_player',
            save: function(k, v) {
                if (!Store.available()) return false;
                if (typeof v != 'string') return false;
                Store.LS.setItem(Store.prefix + k, v)
                let sk = fn_toString(k + "", 30);
                let sv = fn_toString(v + "", 30);
                consoleLog(`localStorage Saved "${sk}" = "${sv}"`)
                return true;

            },
            read: function(k) {
                if (!Store.available()) return false;
                let v = Store.LS.getItem(Store.prefix + k)
                let sk = fn_toString(k + "", 30);
                let sv = fn_toString(v + "", 30);
                consoleLog(`localStorage Read "${sk}" = "${sv}"`);
                return v;

            },
            remove: function(k) {

                if (!Store.available()) return false;
                Store.LS.removeItem(Store.prefix + k)
                let sk = fn_toString(k + "", 30);
                consoleLog(`localStorage Removed "${sk}"`)
                return true;
            },
            clearInvalid: function(sVersion) {
                if (!Store.available()) return false;

                //let sVersion=1814;
                if (+Store.read('_sVersion_') < sVersion) {
                    Store._keys()
                        .filter(s => s.indexOf(Store.prefix) === 0)
                        .forEach(key => window.localStorage.removeItem(key))
                    Store.save('_sVersion_', sVersion + '')
                    return 2;
                }
                return 1;

            },
            available: function() {
                if (Store.LS) return true;
                if (!window) return false;
                const localStorage = window.localStorage;
                if (!localStorage) return false;
                if (typeof localStorage != 'object') return false;
                if (!('getItem' in localStorage)) return false;
                if (!('setItem' in localStorage)) return false;
                Store.LS = localStorage;
                return true;

            },
            _keys: function() {
                return Object.keys(localStorage);
            },
            _setItem: function(key, value) {
                return localStorage.setItem(key, value)
            },
            _getItem: function(key) {
                return localStorage.getItem(key)
            },
            _removeItem: function(key) {
                return localStorage.removeItem(key)
            }

        }

        const domTool = {
            cssWH: function(m, r) {
                if (!r) r = getComputedStyle(m, null);
                let c = (x) => +x.replace('px', '');
                return {
                    w: m.offsetWidth || c(r.width),
                    h: m.offsetHeight || c(r.height)
                }
            },
            _isActionBox_1: function(vEl, pEl) {

                const vElCSS = domTool.cssWH(vEl);
                let vElCSSw = vElCSS.w;
                let vElCSSh = vElCSS.h;

                let vElx = vEl;
                const res = [];
                //let mLevel = 0;
                if (vEl && pEl && vEl != pEl && pEl.contains(vEl)) {
                    while (vElx && vElx != pEl) {
                        vElx = vElx.parentNode;
                        let vElx_css = null;
                        if (isShadowRoot(vElx)) {} else {
                            vElx_css = getComputedStyle(vElx, null);
                            let vElx_wp = parseFloat(vElx_css.paddingLeft) + parseFloat(vElx_css.paddingRight)
                            vElCSSw += vElx_wp
                            let vElx_hp = parseFloat(vElx_css.paddingTop) + parseFloat(vElx_css.paddingBottom)
                            vElCSSh += vElx_hp
                        }
                        res.push({
                            //level: ++mLevel,
                            padW: vElCSSw,
                            padH: vElCSSh,
                            elm: vElx,
                            css: vElx_css
                        })

                    }
                }

                // in the array, each item is the parent of video player
                //res.vEl_cssWH = vElCSS

                return res;

            },
            _isActionBox: function(vEl, walkRes, pEl_idx) {

                function absDiff(w1, w2, h1, h2) {
                    const w = (w1 - w2),
                        h = h1 - h2;
                    return [(w > 0 ? w : -w), (h > 0 ? h : -h)]
                }

                function midPoint(rect) {
                    return {
                        x: (rect.left + rect.right) / 2,
                        y: (rect.top + rect.bottom) / 2
                    }
                }

                const parentCount = walkRes.length;
                if (pEl_idx >= 0 && pEl_idx < parentCount) {} else {
                    return;
                }
                const pElr = walkRes[pEl_idx]
                if (!pElr.css) {
                    //shadowRoot
                    return true;
                }

                const pEl = pElr.elm;

                //prevent activeElement==body
                const pElCSS = domTool.cssWH(pEl, pElr.css);

                //check prediction of parent dimension
                const d1v = absDiff(pElCSS.w, pElr.padW, pElCSS.h, pElr.padH)

                const d1x = d1v[0] < 10
                const d1y = d1v[1] < 10;

                if (d1x && d1y) return true; //both edge along the container   -  fit size
                if (!d1x && !d1y) return false; //no edge along the container     -  body contain the video element, fixed width&height

                //case: youtube video fullscreen

                //check centre point

                const pEl_rect = pEl.getBoundingClientRect()
                const vEl_rect = vEl.getBoundingClientRect()

                const pEl_center = midPoint(pEl_rect)
                const vEl_center = midPoint(vEl_rect)

                const d2v = absDiff(pEl_center.x, vEl_center.x, pEl_center.y, vEl_center.y);

                const d2x = d2v[0] < 10;
                const d2y = d2v[1] < 10;

                return (d2x && d2y);

            },
            addStyle: //GM_addStyle,
                function(css, head) {
                    if (!head) {
                        let _doc = document.documentElement;
                        head = domAppender(_doc);
                    }
                    let doc = head.ownerDocument;
                    let style = doc.createElement('style');
                    style.type = 'text/css';
                    style.textContent = css;
                    head.appendChild(style);
                    //console.log(document.head,style,'add style')
                    return style;
                }
        };

        const handle = {


            afPlaybackRecording: async function() {
                const opts = this;

                let qTime = +new Date;
                if (qTime >= opts.pTime) {
                    opts.pTime = qTime + opts.timeDelta; //prediction of next Interval
                    opts.savePlaybackProgress()
                }

            },
            savePlaybackProgress: function() {

                //this refer to endless's opts
                let player = this.player;

                let _uid = this.player_uid; //_h5p_uid_encrypted
                if (!_uid) return;

                let shallSave = true;
                let currentTimeToSave = ~~player.currentTime;

                if (this._lastSave == currentTimeToSave) shallSave = false;

                if (shallSave) {

                    this._lastSave = currentTimeToSave

                    Promise.resolve().then(() => {

                        //console.log('aasas',this.player_uid, shallSave, '_play_progress_'+_uid, currentTimeToSave)

                        Store.save('_play_progress_' + _uid, jsonStringify({
                            't': currentTimeToSave
                        }))
                    })

                }
                //console.log('playback logged')

            },
            playingWithRecording: function() {
                let player = this.player;
                if (!player.paused && !this.isFunctionLooping) {
                    let player = this.player;
                    let _uid = player.getAttribute('_h5p_uid_encrypted') || ''
                    if (_uid) {
                        this.player_uid = _uid;
                        this.pTime = 0;
                        this.loopingStart();
                    }
                }
            }

        };

        const $hs = {

            /* 提示文本的字號 */
            fontSize: 16,
            enable: true,
            playerInstance: null,
            /* 快進快退步長 */
            skipStep: 5,

            mouseMoveCount: 0,

            //video mouse enter and leave
            mouseActioner: {
                calls: [],
                time: 0,
                cid: 0,
                lastFound: null,
                lastHoverElm: null
            },

            mouseEnteredElement: null,

            actionBoxRelations: {},
            tipsClassName: 'html_player_enhance_tips',

            //cursor control
            mointoringVideo:false, //false -> xxx -> null -> xxx

            //global focused video
            focusHookVId: '',

            /* 獲取當前播放器的實例 */
            player: function() {
                let res = $hs.playerInstance || null;
                if (res && res.parentNode == null) {
                    $hs.playerInstance = null;
                    res = null;
                }

                if (res == null) {
                    for (let k in playerConfs) {
                        let playerConf = playerConfs[k];
                        if (playerConf && playerConf.domElement && playerConf.domElement.parentNode) return playerConf.domElement;
                    }
                }
                if(res && res.parentNode)return res;
                return null;
            },

            pictureInPicture: function(videoElm) {
                if (document.pictureInPictureElement) {
                    document.exitPictureInPicture();
                } else if ('requestPictureInPicture' in videoElm) {
                    videoElm.requestPictureInPicture()
                } else {
                    $hs.tips('PIP is not supported.');
                }
            },

            getPlayerConf: function(video) {

                if (!video) return null;
                let vpid = video.getAttribute('_h5ppid') || null;
                if (!vpid) return null;
                return playerConfs[vpid] || null;

            },
            debug01: function(evt, videoActive) {

                if (!$hs.eventHooks) {
                    document.__h5p_eventhooks = ($hs.eventHooks = {
                        _debug_: []
                    });
                }
                $hs.eventHooks._debug_.push([videoActive, evt.type]);
                // console.log('h5p eventhooks = document.__h5p_eventhooks')
            },

            swtichPlayerInstance: function() {

                let newPlayerInstance = null;
                const ONLY_PLAYING_NONE = 0x4A00;
                const ONLY_PLAYING_MORE_THAN_ONE = 0x5A00;
                let onlyPlayingInstance = ONLY_PLAYING_NONE;
                for (let k in playerConfs) {
                    let playerConf = playerConfs[k] || {};
                    let {
                        domElement,
                        domActive
                    } = playerConf;
                    if (domElement) {
                        if (domActive & DOM_ACTIVE_INVALID_PARENT) continue;
                        if (!domElement.parentNode) {
                            playerConf.domActive |= DOM_ACTIVE_INVALID_PARENT;
                            continue;
                        }
                        if ((domActive & DOM_ACTIVE_MOUSE_CLICK) || (domActive & DOM_ACTIVE_KEY_DOWN) || (domActive & DOM_ACTIVE_FULLSCREEN)) {
                            newPlayerInstance = domElement
                            break;
                        }
                        if (domActive & DOM_ACTIVE_ONCE_PLAYED && (domActive & DOM_ACTIVE_DELAYED_PAUSED) == 0) {
                            if (onlyPlayingInstance == ONLY_PLAYING_NONE) onlyPlayingInstance = domElement;
                            else onlyPlayingInstance = ONLY_PLAYING_MORE_THAN_ONE;
                        }
                    }
                }
                if (newPlayerInstance == null && onlyPlayingInstance.nodeType == 1) {
                    newPlayerInstance = onlyPlayingInstance;
                }

                $hs.playerInstance = newPlayerInstance


            },


            handlerVideoPlaying: function(evt) {
                const videoElm = evt.target || this || null;

                if (!videoElm || videoElm.nodeName != "VIDEO") return;

                const vpid = videoElm.getAttribute('_h5ppid')

                if (!vpid) return;

                        $bv.boostVideoPerformanceActivate();

                //console.log('video play',videoElm.duration,videoElm.currentTime)

                Promise.resolve().then(() => {

                    if ($hs.cid_playHook > 0) window.clearTimeout($hs.cid_playHook);
                    $hs.cid_playHook = window.setTimeout(function() {
                        let onlyPlayed = null;
                        for (var k in playerConfs) {
                            if (k == vpid) {
                                if (playerConfs[k].domElement.paused === false) onlyPlayed = true;
                            } else if (playerConfs[k].domElement.paused === false) {
                                onlyPlayed = false;
                                break;
                            }
                        }
                        if (onlyPlayed === true) {
                            $hs.focusHookVId = vpid
                        }

                        $hs.hcDelayMouseHideAndStartMointoring(videoElm);

                    }, 100)

                }).then(() => {

                    const playerConf = $hs.getPlayerConf(videoElm)

                    if (playerConf) {
                        if (playerConf.timeout_pause > 0) playerConf.timeout_pause = window.clearTimeout(playerConf.timeout_pause);
                        playerConf.lastPauseAt = 0
                        playerConf.domActive |= DOM_ACTIVE_ONCE_PLAYED;
                        playerConf.domActive &= ~DOM_ACTIVE_DELAYED_PAUSED;
                    }

                }).then(() => {

                    $hs._actionBoxObtain(videoElm);

                }).then(() => {

                    $hs.swtichPlayerInstance();



                }).then(() => {

                    if (!$hs.enable) return $hs.tips(false);

                    if (videoElm._isThisPausedBefore_) consoleLog('resumed')
                    let _pausedbefore_ = videoElm._isThisPausedBefore_

                    if (videoElm.playpause_cid) {
                        window.clearTimeout(videoElm.playpause_cid);
                        videoElm.playpause_cid = 0;
                    }
                    let _last_paused = videoElm._last_paused
                    videoElm._last_paused = videoElm.paused
                    if (_last_paused === !videoElm.paused) {
                        videoElm.playpause_cid = window.setTimeout(() => {
                            if (videoElm.paused === !_last_paused && !videoElm.paused && _pausedbefore_) {
                                $hs.tips('Playback resumed', undefined, 2500)
                            }
                        }, 90)
                    }

                    /* 播放的時候進行相關同步操作 */

                    if (!videoElm._record_continuous) {

                        /* 同步之前設定的播放速度 */
                        $hs.setPlaybackRate()

                        if (!_endlessloop) _endlessloop = new AFLooperArray();

                        videoElm._record_continuous = _endlessloop.appendLoop(handle.afPlaybackRecording);
                        videoElm._record_continuous._lastSave = -999;

                        videoElm._record_continuous.timeDelta = 2000;
                        videoElm._record_continuous.player = videoElm
                        videoElm._record_continuous.savePlaybackProgress = handle.savePlaybackProgress;
                        videoElm._record_continuous.playingWithRecording = handle.playingWithRecording;
                    }

                    videoElm._record_continuous.playingWithRecording(videoElm); //try to start recording

                    videoElm._isThisPausedBefore_ = false;

                })

            },


            handlerVideoPause: function(evt) {

                const videoElm = evt.target || this || null;

                if (!videoElm || videoElm.nodeName != "VIDEO") return;

                const vpid = videoElm.getAttribute('_h5ppid')

                if (!vpid) return;
                        $bv.boostVideoPerformanceDeactivate();

                const isVideoEnded = (decimalEqual(videoElm.duration,videoElm.currentTime));



                Promise.resolve().then(() => {

                    if ($hs.cid_playHook > 0) window.clearTimeout($hs.cid_playHook);
                    $hs.cid_playHook = window.setTimeout(function() {
                        let allPaused = true;
                        for (var k in playerConfs) {
                            if (playerConfs[k].domElement.paused === false) {
                                allPaused = false;
                                break;
                            }
                        }
                        if (allPaused) {
                            $hs.focusHookVId = vpid
                        }
                    }, 100)

                }).then(() => {

                    const playerConf = $hs.getPlayerConf(videoElm)
                    if (playerConf) {
                        playerConf.lastPauseAt = +new Date;
                        playerConf.timeout_pause = window.setTimeout(() => {
                            if (playerConf.lastPauseAt > 0) playerConf.domActive |= DOM_ACTIVE_DELAYED_PAUSED;
                        }, 600)
                    }

                }).then(() => {

                    if(!isVideoEnded){

                        if (!$hs.enable) return $hs.tips(false);
                        consoleLog('pause')
                        videoElm._isThisPausedBefore_ = true;

                        let _last_paused = videoElm._last_paused
                        videoElm._last_paused = videoElm.paused
                        if (videoElm.playpause_cid) {
                            window.clearTimeout(videoElm.playpause_cid);
                            videoElm.playpause_cid = 0;
                        }
                        if (_last_paused === !videoElm.paused) {
                            videoElm.playpause_cid = window.setTimeout(() => {
                                if (videoElm.paused === !_last_paused && videoElm.paused) {
                                    $hs._tips(videoElm, 'Playback paused', undefined, 2500)
                                }
                            }, 90)
                        }

                    }else{

                        videoElm._isThisPausedBefore_ = true;
                    }


                    if (videoElm._record_continuous && videoElm._record_continuous.isFunctionLooping) {
                        window.setTimeout(function() {
                            if (videoElm.paused === true && !videoElm._record_continuous.isFunctionLooping) videoElm._record_continuous.savePlaybackProgress(); //savePlaybackProgress once before stopping  //handle.savePlaybackProgress;
                        }, 380)
                        videoElm._record_continuous.loopingStop();
                    }


                })


            },
            handlerVideoVolumeChange: function(evt) {

                let videoElm = evt.target || this || null;

                if (videoElm.nodeName != "VIDEO") return;
                if (videoElm.volume >= 0) {} else {
                    return;
                }

                if ($hs._volume_change_counter > 0) return;
                $hs._volume_change_counter = ($hs._volume_change_counter || 0) + 1

                window.requestAnimationFrame(function() {

                    let makeTips = false;
                    Promise.resolve(videoElm).then((videoElm) => {


                        let cVol = videoElm.volume;
                        let cMuted = videoElm.muted;

                        if (cVol === videoElm._volume_p && cMuted === videoElm._muted_p) {
                            // nothing changed
                        } else if (cVol === videoElm._volume_p && cMuted !== videoElm._muted_p) {
                            // muted changed
                        } else { // cVol != pVol

                            // only volume changed

                            let shallShowTips = videoElm._volume >= 0; //prevent initialization

                            if (!cVol) {
                                videoElm.muted = true;
                            } else if (cMuted) {
                                videoElm.muted = false;
                                videoElm._volume = cVol;
                            } else if (!cMuted) {
                                videoElm._volume = cVol;
                            }
                            consoleLog('volume changed');

                            if (shallShowTips) makeTips = true;

                        }

                        videoElm._volume_p = cVol;
                        videoElm._muted_p = cMuted;

                        return videoElm;

                    }).then((videoElm) => {

                        if (makeTips) $hs._tips(videoElm, 'Volume: ' + dround(videoElm.volume * 100) + '%', undefined, 3000);

                        $hs._volume_change_counter = 0;

                    })
                    videoElm = null

                })



            },
            handlerVideoLoadedMetaData: function(evt) {
                const videoElm = evt.target || this || null;

                if (!videoElm || videoElm.nodeName != "VIDEO") return;

                Promise.resolve(videoElm).then((videoElm) => {

                    consoleLog('video size', videoElm.videoWidth + ' x ' + videoElm.videoHeight);

                    let vpid = videoElm.getAttribute('_h5ppid') || null;
                    if (!vpid || !videoElm.currentSrc) return;

                    let videoElm_withSrcChanged = null

                    if ($hs.varSrcList[vpid] != videoElm.currentSrc) {
                        $hs.varSrcList[vpid] = videoElm.currentSrc;
                        $hs.videoSrcFound(videoElm);
                        videoElm_withSrcChanged = videoElm;
                    }
                    if (!videoElm._onceVideoLoaded) {
                        videoElm._onceVideoLoaded = true;
                        playerConfs[vpid].domActive |= DOM_ACTIVE_SRC_LOADED;
                    }

                    return videoElm_withSrcChanged
                }).then((videoElm_withSrcChanged) => {

                    if (videoElm_withSrcChanged) $hs._actionBoxObtain(videoElm_withSrcChanged);



                })

            },
            handlerSizing:(entries)=>{

                for(const {target} of entries){

                    let cw=target.clientWidth
                    let ch=target.clientHeight
                    target.__clientWidth = cw
                    target.__clientHeight = ch
                    target.mouseMoveMax = Math.sqrt(cw * cw + ch * ch) * 0.06;


                }

            },

            mouseAct: function() {

                $hs.mouseActioner.cid = 0;

                if (+new Date - $hs.mouseActioner.time < 30) {
                    $hs.mouseActioner.cid = window.setTimeout($hs.mouseAct, 82)
                    return;
                }

                if ($hs.mouseDownAt && $hs.mouseActioner.lastFound && $hs.mouseDownAt.insideVideo === $hs.mouseActioner.lastFound) {

                    return;

                }

                const getVideo = (target) => {


                    const actionBoxRelation = $hs.getActionBoxRelationFromDOM(target);
                    if (!actionBoxRelation) return;
                    const actionBox = actionBoxRelation.actionBox
                    if (!actionBox) return;
                    const vpid = actionBox.getAttribute('_h5p_actionbox_');
                    const videoElm = actionBoxRelation.player;
                    if (!videoElm) return;

                    return videoElm
                }

                Promise.resolve().then(() => {
                    for (const {
                            type,
                            target
                        } of $hs.mouseActioner.calls) {
                        if (type == 'mouseenter') {
                            const videoElm = getVideo(target);
                            if (videoElm) {
                                return videoElm
                            }
                        }
                    }
                    return null;
                }).then(videoFound => {

                    Promise.resolve().then(() => {

                        var plastHoverElm = $hs.mouseActioner.lastHoverElm;
                        $hs.mouseActioner.lastHoverElm = $hs.mouseEnteredElement;

                        //console.log(!!$hs.mointoringVideo , !!videoFound)
                        //console.log(554,'mointoringVideo:'+!!$hs.mointoringVideo,'videoFound:'+ !!videoFound)

                        if ($hs.mointoringVideo && !videoFound) {
                            $hs.hcShowMouseAndRemoveMointoring($vQuery.player($hs.mointoringVideo))
                        } else if ($hs.mointoringVideo && videoFound) {
                            if (plastHoverElm != $hs.mouseActioner.lastHoverElm) $hs.hcMouseShowWithMonitoring(videoFound);
                        } else if (!$hs.mointoringVideo && videoFound) {
                            $hs.hcDelayMouseHideAndStartMointoring(videoFound)
                        }

                        $hs.mouseMoveCount = 0;
                        $hs.mouseActioner.calls.length = 0;
                        $hs.mouseActioner.lastFound = videoFound;

                    })



                    if (videoFound !== $hs.mouseActioner.lastFound) {
                        if ($hs.mouseActioner.lastFound) {
                            $hs.handlerElementMouseLeaveVideo($hs.mouseActioner.lastFound)
                        }
                        if (videoFound) {
                            $hs.handlerElementMouseEnterVideo(videoFound)
                        }
                    }


                })

            },
            handlerElementMouseEnterVideo: function(video) {

                //console.log('mouseenter video')

                const playerConf = $hs.getPlayerConf(video)
                if (playerConf) {
                    playerConf.domActive |= DOM_ACTIVE_MOUSE_IN;
                }

                $hs._actionBoxObtain(video);

                $hs.enteredActionBoxRelation = $hs.actionBoxRelations[video.getAttribute('_h5ppid') || 'null'] || null

            },
            handlerElementMouseLeaveVideo: function(video) {

                //console.log('mouseleave video')

                const playerConf = $hs.getPlayerConf(video)
                if (playerConf) {
                    playerConf.domActive &= ~DOM_ACTIVE_MOUSE_IN;
                }


                $hs.enteredActionBoxRelation = null


            },
            handlerElementMouseEnter: function(evt) {
                if ($hs.intVideoInitCount > 0) {} else {
                    return;
                }
                if (!evt || !evt.target || !(evt.target.nodeType > 0)) return;

                $hs.mouseEnteredElement = evt.target

                if ($hs.mouseDownAt && $hs.mouseDownAt.insideVideo) return;

                if ($hs.enteredActionBoxRelation && $hs.enteredActionBoxRelation.pContainer && $hs.enteredActionBoxRelation.pContainer.contains(evt.target)) return;

                //console.log('mouseenter call')

                $hs.mouseActioner.calls.length = 1;
                $hs.mouseActioner.calls[0] = {
                    type: evt.type,
                    target: evt.target
                }


                //$hs.mouseActioner.calls.push({type:evt.type,target:evt.target});
                $hs.mouseActioner.time = +new Date;

                if (!$hs.mouseActioner.cid) {
                    $hs.mouseActioner.cid = window.setTimeout($hs.mouseAct, 82)
                }

                //console.log(evt.target)

            },
            handlerElementMouseLeave: function(evt) {
                if ($hs.intVideoInitCount > 0) {} else {
                    return;
                }
                if (!evt || !evt.target || !(evt.target.nodeType > 0)) return;

                if ($hs.mouseDownAt && $hs.mouseDownAt.insideVideo) return;

                if ($hs.enteredActionBoxRelation && $hs.enteredActionBoxRelation.pContainer && !$hs.enteredActionBoxRelation.pContainer.contains(evt.target)) {

                    //console.log('mouseleave call')

                    //$hs.mouseActioner.calls.push({type:evt.type,target:evt.target});
                    $hs.mouseActioner.time = +new Date;

                    if (!$hs.mouseActioner.cid) {
                        $hs.mouseActioner.cid = window.setTimeout($hs.mouseAct, 82)
                    }
                }

            },
            handlerElementMouseDown: function(evt) {
                if ($hs.mouseDownAt) return;
                $hs.mouseDownAt = {
                    elm: evt.target,
                    insideVideo: false,
                    pContainer: null
                };


                if ($hs.intVideoInitCount > 0) {} else {
                    return;
                }

                //  $hs._mouseIsDown=true;

                if (!evt || !evt.target || !(evt.target.nodeType > 0)) return;

                if ($hs.mouseActioner.lastFound && $hs.mointoringVideo) $hs.hcMouseShowWithMonitoring($hs.mouseActioner.lastFound)

                Promise.resolve(evt.target).then((evtTarget) => {


                    if (document.readyState != "complete") return;


                    function notAtVideo() {
                        if ($hs.focusHookVId) $hs.focusHookVId = ''
                    }


                    const actionBoxRelation = $hs.getActionBoxRelationFromDOM(evtTarget);
                    if (!actionBoxRelation) return notAtVideo();
                    const actionBox = actionBoxRelation.actionBox
                    if (!actionBox) return notAtVideo();
                    const vpid = actionBox.getAttribute('_h5p_actionbox_');
                    if (!vpid) return notAtVideo();
                    const videoElm = actionBoxRelation.player;
                    if (!videoElm) return notAtVideo();

                    if (!$hs.mouseDownAt) return;
                    $hs.mouseDownAt.insideVideo = videoElm;

                    $hs.mouseDownAt.pContainer = actionBoxRelation.pContainer;

                    $hs.focusHookVId = vpid



                    const playerConf = $hs.getPlayerConf(videoElm)
                    if (playerConf) {
                        delayCall("$$actionBoxClicking", function() {
                            playerConf.domActive &= ~DOM_ACTIVE_MOUSE_CLICK;
                        }, 137)
                        playerConf.domActive |= DOM_ACTIVE_MOUSE_CLICK;
                    }


                    return videoElm

                }).then((videoElm) => {

                    if (!videoElm) return;

                    $hs._actionBoxObtain(videoElm);

                    return videoElm

                }).then((videoElm) => {

                    if (!videoElm) return;

                    $hs.swtichPlayerInstance();

                })

            },
            handlerElementMouseUp: function(evt) {

                if ($hs.pendingTips) {

                    let pendingTips = $hs.pendingTips;
                    $hs.pendingTips = null;

                    for (let vpid in pendingTips) {
                        const tipsDom = pendingTips[vpid]
                        Promise.resolve(tipsDom).then((tipsDom) => {
                            if(tipsDom.getAttribute('_h5p_animate')=='P') tipsDom.setAttribute('_h5p_animate','');
                        })
                    }
                    pendingTips = null;

                }
                if ($hs.mouseDownAt) {

                    $hs.mouseDownAt = null;
                }
            },
            handlerElementWheelTuneVolume: function(evt) { //shift + wheel

                if ($hs.intVideoInitCount > 0) {} else {
                    return;
                }

                if (!evt.shiftKey || !evt.target || !(evt.target.nodeType > 0)) return;

                const fDeltaY = (evt.deltaY > 0) ? 1 : (evt.deltaY < 0) ? -1 : 0;
                if (fDeltaY) {



                    const randomID = +new Date
                    $hs.handlerElementWheelTuneVolume._randomID = randomID;


                    Promise.resolve(evt.target).then((evtTarget) => {


                        const actionBoxRelation = $hs.getActionBoxRelationFromDOM(evtTarget);
                        if (!actionBoxRelation) return;
                        const actionBox = actionBoxRelation.actionBox
                        if (!actionBox) return;
                        const vpid = actionBox.getAttribute('_h5p_actionbox_');
                        const videoElm = actionBoxRelation.player;
                        if (!videoElm) return;

                        let player = $hs.player();
                        if (!player || !player.parentNode || player != videoElm) return;

                        return videoElm

                    }).then((videoElm) => {
                        if (!videoElm) return;

                        if ($hs.handlerElementWheelTuneVolume._randomID != randomID) return;
                        // $hs._actionBoxObtain(videoElm);
                        return videoElm;
                    }).then((player) => {
                        if (!player || !player.parentNode) return;
                        if ($hs.handlerElementWheelTuneVolume._randomID != randomID) return;
                        if (fDeltaY > 0) {
                            if ((player.muted && player.volume === 0) && player._volume > 0) {
                                player.muted = false;
                                player.volume = player._volume;
                            } else if (player.muted && (player.volume > 0 || !player._volume)) {
                                player.muted = false;
                            }
                            $hs.tuneVolume(-0.05)
                        } else if (fDeltaY < 0) {
                            if ((player.muted && player.volume === 0) && player._volume > 0) {
                                player.muted = false;
                                player.volume = player._volume;
                            } else if (player.muted && (player.volume > 0 || !player._volume)) {
                                player.muted = false;
                            }
                            $hs.tuneVolume(+0.05)
                        }
                    })
                    evt.stopPropagation()
                    evt.preventDefault()
                    return false
                }
            },

            handlerWinMessage: async function(e) {
                let tag, ed;
                if (typeof e.data == 'object' && typeof e.data.tag == 'string') {
                    tag = e.data.tag;
                    ed = e.data
                } else {
                    return;
                }
                let msg = null,
                    success = 0;
                let msg_str, msg_stype, p
                switch (tag) {
                    case 'consoleLog':
                        msg_str = ed.str;
                        msg_stype = ed.stype;
                        if (msg_stype === 1) {
                            msg = (document[str_postMsgData] || {})[msg_str] || [];
                            success = 1;
                        } else if (msg_stype === 2) {
                            msg = jsonParse(msg_str);
                            if (msg && msg.d) {
                                success = 2;
                                msg = msg.d;
                            }
                        } else {
                            msg = msg_str
                        }
                        p = (ed.passing && ed.winOrder) ? [' | from win-' + ed.winOrder] : [];
                        if (success) {
                            console.log(...msg, ...p)
                            //document[ed.data]=null;   // also delete the information
                        } else {
                            console.log('msg--', msg, ...p, ed);
                        }
                        break;

                }
            },

            toolCheckFullScreen: function(doc) {
                if (typeof doc.fullScreen == 'boolean') return doc.fullScreen;
                if (typeof doc.webkitIsFullScreen == 'boolean') return doc.webkitIsFullScreen;
                if (typeof doc.mozFullScreen == 'boolean') return doc.mozFullScreen;
                return null;
            },

            toolFormatCT: function(u) {

                let w = Math.round(u, 0)
                let a = w % 60
                w = (w - a) / 60
                let b = w % 60
                w = (w - b) / 60
                let str = ("0" + b).substr(-2) + ":" + ("0" + a).substr(-2);
                if (w) str = w + ":" + str

                return str

            },

            loopOutwards: function(startPoint, maxStep) {


                let c = 0,
                    p = startPoint,
                    q = null;
                while (p && (++c <= maxStep)) {
                    if (p.querySelectorAll('video').length !== 1) {
                        return q;
                        break;
                    }
                    q = p;
                    p = p.parentNode;
                }

                return p || q || null;

            },

            getActionBlockElement: function(player, layoutBox) {

                //player,  $hs.getPlayerBlockElement(player).parentNode;
                //player, player.parentNode .... player.parentNode.parentNode.parentNode

                //layoutBox: a container element containing video and with innerHeight>=player.innerHeight [skipped wrapping]
                //layoutBox parentSize > layoutBox Size

                //actionBox: a container with video and controls
                //can be outside layoutbox (bilibili)
                //assume maximum 3 layers


                let outerLayout = $hs.loopOutwards(layoutBox, 3); //i.e.   layoutBox.parent.parent.parent


                const allFullScreenBtns = $hs.queryFullscreenBtnsIndependant(outerLayout)
                //console.log('xx', outerLayout.querySelectorAll('[class*="-fullscreen"]').length, allFullScreenBtns.length)
                let actionBox = null;

                // console.log('fa0a', allFullScreenBtns.length, layoutBox)
                if (allFullScreenBtns.length > 0) {
                    //  console.log('faa', allFullScreenBtns.length)

                    for (const possibleFullScreenBtn of allFullScreenBtns) possibleFullScreenBtn.setAttribute('__h5p_fsb__', '');
                    let pElm = player.parentNode;
                    let fullscreenBtns = null;
                    while (pElm && pElm.parentNode) {
                        fullscreenBtns = pElm.querySelectorAll('[__h5p_fsb__]');
                        if (fullscreenBtns.length > 0) {
                            break;
                        }
                        pElm = pElm.parentNode;
                    }
                    for (const possibleFullScreenBtn of allFullScreenBtns) possibleFullScreenBtn.removeAttribute('__h5p_fsb__');
                    if (fullscreenBtns && fullscreenBtns.length > 0) {
                        actionBox = pElm;
                        fullscreenBtns = $hs.exclusiveElements(fullscreenBtns);
                        return {
                            actionBox,
                            fullscreenBtns
                        };
                    }
                }

                let walkRes = domTool._isActionBox_1(player, layoutBox);
                //walkRes.elm = player... player.parentNode.parentNode (i.e. wPlayer)
                let parentCount = walkRes.length;

                if (parentCount - 1 >= 0 && domTool._isActionBox(player, walkRes, parentCount - 1)) {
                    actionBox = walkRes[parentCount - 1].elm;
                } else if (parentCount - 2 >= 0 && domTool._isActionBox(player, walkRes, parentCount - 2)) {
                    actionBox = walkRes[parentCount - 2].elm;
                } else {
                    actionBox = player;
                }

                return {
                    actionBox,
                    fullscreenBtns: []
                };




            },


            actionBoxMutationCallback: function(mutations, observer) {
                for (const mutation of mutations) {


                    const vpid = mutation.target.getAttribute('_h5p_mf_');
                    if (!vpid) continue;

                    const actionBoxRelation = $hs.actionBoxRelations[vpid];
                    if (!actionBoxRelation) continue;


                    const removedNodes = mutation.removedNodes;
                    if (removedNodes && removedNodes.length > 0) {
                        for (const node of removedNodes) {
                            if (node.nodeType == 1) {
                                actionBoxRelation.mutationRemovalsCount++
                                node.removeAttribute('_h5p_mf_');
                            }
                        }

                    }

                    const addedNodes = mutation.addedNodes;
                    if (addedNodes && addedNodes.length > 0) {
                        for (const node of addedNodes) {
                            if (node.nodeType == 1) {
                                actionBoxRelation.mutationAdditionsCount++
                            }
                        }

                    }




                }
            },


            getActionBoxRelationFromDOM: function(elm) {

                //assume action boxes are mutually exclusive

                for (let vpid in $hs.actionBoxRelations) {
                    const actionBoxRelation = $hs.actionBoxRelations[vpid];
                    const actionBox = actionBoxRelation.actionBox
                    //console.log('ab', actionBox)
                    if (actionBox && actionBox.parentNode) {
                        if (elm == actionBox || actionBox.contains(elm)) {
                            return actionBoxRelation;
                        }
                    }
                }


                return null;

            },



            _actionBoxObtain: function(player) {

                if (!player || !player.parentNode) return null;
                let vpid = player.getAttribute('_h5ppid');
                if (!vpid) return null;

                let actionBoxRelation = $hs.actionBoxRelations[vpid],
                    layoutBox = null,
                    actionBox = null,
                    boxSearchResult = null,
                    fullscreenBtns = null,
                    wPlayer = null;

                function a() {
                    let wPlayerr= $hs.getPlayerBlockElement(player);
                    wPlayer = wPlayerr.wPlayer;
                    layoutBox = wPlayer.parentNode;
                    boxSearchResult = $hs.getActionBlockElement(player, layoutBox);
                    actionBox = boxSearchResult.actionBox
                    fullscreenBtns = boxSearchResult.fullscreenBtns
                }

                function setDOM_mflag(startElm, endElm, vpid) {
                    if (!startElm || !endElm) return;
                    if (startElm == endElm) startElm.setAttribute('_h5p_mf_', vpid)
                    else if (endElm.contains(startElm)) {

                        let p = startElm
                        while (p) {
                            p.setAttribute('_h5p_mf_', vpid)
                            if (p == endElm) break;
                            p = p.parentNode
                        }

                    }
                }

                function b(domNodes) {

                    actionBox.setAttribute('_h5p_actionbox_', vpid);
                    if (!$hs.actionBoxMutationObserver) $hs.actionBoxMutationObserver = new MutationObserver($hs.actionBoxMutationCallback);

                    // console.log('Major Mutation on Player Container')
                    const actionRelation = {
                        player: player,
                        wPlayer: wPlayer,
                        layoutBox: layoutBox,
                        actionBox: actionBox,
                        mutationRemovalsCount: 0,
                        mutationAdditionsCount: 0,
                        fullscreenBtns: fullscreenBtns,
                        pContainer: domNodes[domNodes.length - 1], // the block Element as the entire player (including control btns) having size>=video
                        ppContainer: domNodes[domNodes.length - 1].parentNode, // reference to the webpage
                    }
                    domNodes=null;


                    const pContainer = actionRelation.pContainer;
                    setDOM_mflag(player, pContainer, vpid)
                    for (const btn of fullscreenBtns) setDOM_mflag(btn, pContainer, vpid)
                    setDOM_mflag = null;

                    $hs.actionBoxRelations[vpid] = actionRelation


                    //console.log('mutt0',pContainer)
                    $hs.actionBoxMutationObserver.observe(pContainer, {
                        childList: true,
                        subtree: true
                    });
                }

                if (actionBoxRelation) {
                    //console.log('ddx', actionBoxRelation.mutationCount)
                    if (actionBoxRelation.pContainer && actionBoxRelation.pContainer.parentNode && actionBoxRelation.pContainer.parentNode === actionBoxRelation.ppContainer) {

                        if (actionBoxRelation.fullscreenBtns && actionBoxRelation.fullscreenBtns.length > 0) {

                            if (actionBoxRelation.mutationRemovalsCount === 0 && actionBoxRelation.mutationAdditionsCount === 0) return actionBoxRelation.actionBox

                            //  if (actionBoxRelation.mutationCount === 0 && actionBoxRelation.fullscreenBtns.every(btn=>actionBoxRelation.actionBox.contains(btn))) return actionBoxRelation.actionBox
                            //console.log('Minor Mutation on Player Container', actionBoxRelation ? actionBoxRelation.mutationRemovalsCount : null, actionBoxRelation ? actionBoxRelation.mutationAdditionsCount : null)
                            a();
                            //console.log(3535,fullscreenBtns.length)
                            if (actionBox == actionBoxRelation.actionBox && layoutBox == actionBoxRelation.layoutBox && wPlayer == actionBoxRelation.wPlayer) {
                                //pContainer remains the same as actionBox and layoutBox remain unchanged
                                actionBoxRelation.ppContainer = actionBoxRelation.pContainer.parentNode; //just update the reference
                                if (actionBoxRelation.ppContainer) { //in case removed from DOM
                                    actionBoxRelation.mutationRemovalsCount = 0;
                                    actionBoxRelation.mutationAdditionsCount = 0;
                                    actionBoxRelation.fullscreenBtns = fullscreenBtns;
                                    return actionBox;
                                }
                            }

                        }

                    }

                    for(const rootDoc of rootDocs) {
                        const elms = rootDoc.querySelectorAll(`[_h5p_mf_="${vpid}"]`)
                        for (const elm of elms) elm.removeAttribute('_h5p_mf_')
                        actionBoxRelation.pContainer.removeAttribute('_h5p_mf_')
                    }

                    for (var k in actionBoxRelation) delete actionBoxRelation[k]
                    actionBoxRelation = null;
                    delete $hs.actionBoxRelations[vpid]
                }

                if (boxSearchResult == null) a();
                a = null;
                if (actionBox) {
                    let domNodes = [];
                    let pElm = player;
                    let containing = 0;
                    while (pElm) {
                        domNodes.push(pElm);
                        if (pElm === actionBox) containing |= 1;
                        if (pElm === layoutBox) containing |= 2;
                        if (containing === 3) {
                            b(domNodes);
                            domNodes=null;
                            pElm=null;
                            b = null;
                            return actionBox
                        }
                        pElm = pElm.parentNode;
                    }
                }

                return null;


                // if (!actionBox.hasAttribute('tabindex')) actionBox.setAttribute('tabindex', '-1');




            },

            videoSrcFound: function(player) {

                // src loaded

                if (!player || !player.parentNode) return;
                let vpid = player.getAttribute('_h5ppid') || null;
                if (!vpid || !player.currentSrc) return;

                player._isThisPausedBefore_ = false;

                player.removeAttribute('_h5p_uid_encrypted');

                if (player._record_continuous) player._record_continuous._lastSave = -999; //first time must save

                let uid_A = location.pathname.replace(/[^\d+]/g, '') + '.' + location.search.replace(/[^\d+]/g, '');
                let _uid = location.hostname.replace('www.', '').toLowerCase() + '!' + location.pathname.toLowerCase() + 'A' + uid_A + 'W' + player.videoWidth + 'H' + player.videoHeight + 'L' + (player.duration << 0);

                digestMessage(_uid).then(function(_uid_encrypted) {

                    let d = +new Date;

                    let recordedTime = null;

                    ;
                    (function() {
                        //read the last record only;

                        let k3 = `_h5_player_play_progress_${_uid_encrypted}`;
                        let k3n = `_play_progress_${_uid_encrypted}`;
                        let m2 = Store._keys().filter(key => key.substr(0, k3.length) == k3); //all progress records for this video
                        let m2v = m2.map(keyName => +(keyName.split('+')[1] || '0'))
                        let m2vMax = Math.max(0, ...m2v)
                        if (!m2vMax) recordedTime = null;
                        else {
                            let _json_recordedTime = null;
                            _json_recordedTime = Store.read(k3n + '+' + m2vMax);
                            if (!_json_recordedTime) _json_recordedTime = {};
                            else _json_recordedTime = jsonParse(_json_recordedTime);
                            if (typeof _json_recordedTime == 'object') recordedTime = _json_recordedTime;
                            else recordedTime = null;
                            recordedTime = typeof recordedTime == 'object' ? recordedTime.t : recordedTime;
                            if (typeof recordedTime == 'number' && (+recordedTime >= 0 || +recordedTime <= 0)) {

                            } else if (typeof recordedTime == 'string' && recordedTime.length > 0 && (+recordedTime >= 0 || +recordedTime <= 0)) {
                                recordedTime = +recordedTime
                            } else {
                                recordedTime = null
                            }
                        }
                        if (recordedTime !== null) {
                            player._h5player_lastrecord_ = recordedTime;
                        } else {
                            player._h5player_lastrecord_ = null;
                        }
                        if (player._h5player_lastrecord_ > 5) {
                            consoleLog('last record playing', player._h5player_lastrecord_);
                            window.setTimeout(function() {
                                $hs._tips(player, `Press Shift-R to restore Last Playback: ${$hs.toolFormatCT(player._h5player_lastrecord_)}`, 5000, 4000)
                            }, 1000)
                        }

                    })();
                    // delay the recording by 5.4s => prevent ads or mis operation
                    window.setTimeout(function() {



                        let k1 = '_h5_player_play_progress_';
                        let k3 = `_h5_player_play_progress_${_uid_encrypted}`;
                        let k3n = `_play_progress_${_uid_encrypted}`;

                        //re-read all the localStorage keys
                        let m1 = Store._keys().filter(key => key.substr(0, k1.length) == k1); //all progress records in this site
                        let p = m1.length + 1;

                        for (const key of m1) { //all progress records for this video
                            if (key.substr(0, k3.length) == k3) {
                                Store._removeItem(key); //remove previous record for the current video
                                p--;
                            }
                        }

                        let asyncPromise = Promise.resolve();

                        if (recordedTime !== null) {
                            asyncPromise = asyncPromise.then(() => {
                                Store.save(k3n + '+' + d, jsonStringify({
                                    't': recordedTime
                                })) //prevent loss of last record
                            })
                        }

                        const _record_max_ = 48;
                        const _record_keep_ = 26;

                        if (p > _record_max_) {
                            //exisiting 48 records for one site;
                            //keep only 26 records

                            asyncPromise = asyncPromise.then(() => {
                                const comparator = (a, b) => (a.t < b.t ? -1 : a.t > b.t ? 1 : 0);

                                m1
                                    .map(keyName => ({
                                        keyName,
                                        t: +(keyName.split('+')[1] || '0')
                                    }))
                                    .sort(comparator)
                                    .slice(0, -_record_keep_)
                                    .forEach((item) => localStorage.removeItem(item.keyName));

                                consoleLog(`stored progress: reduced to ${_record_keep_}`)
                            })
                        }

                        asyncPromise = asyncPromise.then(() => {
                            player.setAttribute('_h5p_uid_encrypted', _uid_encrypted + '+' + d);

                            //try to start recording
                            if (player._record_continuous) player._record_continuous.playingWithRecording();
                        })

                    }, 5400);

                })

            },
            bindDocEvents: function(rootNode) {
                if (!rootNode._onceBindedDocEvents) {

                    rootNode._onceBindedDocEvents = true;
                    rootNode.addEventListener('keydown', $hs.handlerRootKeyDownEvent, true)
                    //document._debug_rootNode_ = rootNode;

                    rootNode.addEventListener('mouseenter', $hs.handlerElementMouseEnter, true)
                    rootNode.addEventListener('mouseleave', $hs.handlerElementMouseLeave, true)
                    rootNode.addEventListener('mousedown', $hs.handlerElementMouseDown, true)
                    rootNode.addEventListener('mouseup', $hs.handlerElementMouseUp, true)
                    rootNode.addEventListener('wheel', $hs.handlerElementWheelTuneVolume, {
                        passive: false
                    });

                    // wheel - bubble events to keep it simple (i.e. it must be passive:false & capture:false)


                    rootNode.addEventListener('focus', $hs.handlerElementFocus, $mb.eh_capture_passive())
                    rootNode.addEventListener('fullscreenchange', $hs.handlerFullscreenChanged, true)

                    //rootNode.addEventListener('mousemove', $hs.handlerOverrideMouseMove, {capture:true, passive:false})

                }
            },

            createGlobalCSS: function(){

                let res = [];

                res.push(`
                .ytp-chrome-bottom+span#volumeUI:last-child:empty{
                    display:none;
                }
                html{
                    cursor:var(--h5p-hide-cursor) !important; /* only override if custom property is set*/
                }
                iframe[src][id]{
                    contain: strict;
                }
                `);

                if(document.domain=='bilibili.com'){
                    res.push(`
                    #bilibili-player .bpx-player-row-dm-wrap{
                        contain: strict;
                    }
                    #bilibili-player .b-danmaku{
                        contain: content;
                    }
                    #bilibili-player{
                        contain: strict;
                    }
                    #bilibili-player .bpx-player-video-area{
                        contain: strict;
                    }
                    .bb-comment, .recom-list{
                        contain: content;
                    }
                    `);
                }else if(document.domain=='youtube.com'){
                    res.push(`
                    #masthead-container, ytd-masthead#masthead{
                        contain: content;
                    }
                    ytd-watch-flexy #player, ytd-player#ytd-player{
                        contain: content;
                    }
                    .ytp-caption-window-container .caption-window, .ytp-caption-window-container .captions-text, .ytp-caption-window-container .caption-visual-line, .ytp-caption-window-container .ytp-caption-segment{
                        contain: content;
                    }
                    `);
                }

                domTool.addStyle(res.join('\n').trim());

            },

            fireGlobalInit: function() {
                if ($hs.intVideoInitCount != 1) return;
                if (!$hs.varSrcList) $hs.varSrcList = {};

                Store.clearInvalid(_sVersion_)

                Promise.resolve().then(() => {
                    $hs.createGlobalCSS();
                });

            },
            getPlaybackRate: function() {
                let playbackRate = Store.read('_playback_rate_');
                if(+playbackRate>0) return +((+playbackRate).toFixed(1));
                return 1.0;
            },

            _getPlayerBlockElement:function(player){


                let layoutBox = null,
                    wPlayer = null, wPlayerInner=null;

                if (!player || !player.parentNode) {
                    return null;
                }

                //without checkActiveBox, just a DOM for you to append tipsDom

                function oWH(elm) {
                    return [elm.offsetWidth, elm.offsetHeight].join(',');
                }

                function search_nodes() {

                    wPlayer = player; // NOT NULL
                    layoutBox = wPlayer.parentNode; // NOT NULL

                    while (layoutBox.parentNode && layoutBox.nodeType == 1 && layoutBox.offsetHeight == 0) {
                        wPlayer = layoutBox; // NOT NULL
                        layoutBox = layoutBox.parentNode; // NOT NULL
                    }
                    //container must be with offsetHeight

                    while (layoutBox.parentNode && layoutBox.nodeType == 1 && layoutBox.offsetHeight < player.offsetHeight) {
                        wPlayer = layoutBox; // NOT NULL
                        layoutBox = layoutBox.parentNode; // NOT NULL
                    }
                    //container must have height >= player height

                    wPlayerInner=wPlayer

                    const layoutOWH = oWH(layoutBox)
                    //const playerOWH=oWH(player)

                    //skip all inner wraps
                    while (layoutBox.parentNode && layoutBox.nodeType == 1 && oWH(layoutBox.parentNode) == layoutOWH) {
                        wPlayer = layoutBox; // NOT NULL
                        layoutBox = layoutBox.parentNode; // NOT NULL
                    }

                    // oWH of layoutBox.parentNode != oWH of layoutBox and layoutBox.offsetHeight >= player.offsetHeight

                }

                search_nodes();

                if (layoutBox.nodeType == 11) {
                    makeNoRoot(layoutBox);
                    search_nodes();
                }



                //condition:
                //!layoutBox.parentNode || layoutBox.nodeType != 1 || layoutBox.offsetHeight > player.offsetHeight

                // layoutBox is a node contains <video> and offsetHeight>=video.offsetHeight
                // wPlayer is a HTML Element (nodeType==1)
                // you can insert the DOM element into the layoutBox

                if (layoutBox && wPlayer && layoutBox.nodeType === 1 && wPlayer.parentNode == layoutBox && layoutBox.parentNode){
                    let p={wPlayerInner,wPlayer};
                    return p;
                }
                throw 'unknown error';
            },

            parentingN:function(elm, parent, n){

                if(!elm || !parent) return false;
                let pElm=elm;
                for(let i =0;i<n && pElm;i++) pElm=pElm.parentNode;
                return (pElm===parent);

            },

            parentingInclusive:function(elm, parent){

                let pElm=elm, arr=[];
                while(pElm){
                    arr.push(pElm);
                    if(pElm===parent)break;
                    pElm=pElm.parentNode;
                }
                if(pElm===parent) return arr;
                return null;

            },
            __layout_resize_observer_callback__: (entries, observer)=>{
                const player = observer.player;
                player._cache_wPlayerr=null;
                for(const {target} of entries){
                    if('__to_player_n__' in target && target.__to_player_n__>=0){
                        if(!$hs.parentingN(player, target, target.__to_player_n__)) observer.unobserve(target)
                    }else{
                        observer.unobserve(target)
                    }
                }
            },
            getPlayerBlockElement: function(player) {

                if (!player || !player.parentNode) {
                    return null;
                }

                if(!player.__layout_resize_observer__){

                    let wPlayerr = $hs._getPlayerBlockElement(player)
                    let {wPlayerInner,wPlayer}=wPlayerr
                    let layoutBox = wPlayer.parentNode

                    player.__layout_resize_observer__=new ResizeObserver($hs.__layout_resize_observer_callback__)
                    player.__layout_resize_observer__.player=player;

                    let kh= $hs.parentingInclusive(player, layoutBox);
                    if(kh){

                        for(const elm of kh) player.__layout_resize_observer__.observe(elm)
                        player.__layout_resize_n__=kh.length

                    }else{
                        player.__layout_resize_n__=0
                    }

                    player._cache_wPlayerr=wPlayerr;
                    return player._cache_wPlayerr;
                }


                if(player._cache_wPlayerr && player.__layout_resize_n__>0) {
                    let kt=$hs.parentingN(player, player._cache_wPlayerr.wPlayer.parentNode, player.__layout_resize_n__-1);
                    if(kt) return player._cache_wPlayerr;
                }

                let wPlayerr=$hs._getPlayerBlockElement(player);

                let {wPlayerInner,wPlayer} = wPlayerr
                let layoutBox = wPlayer.parentNode

                let kh= $hs.parentingInclusive(player, layoutBox);

                if(kh){

                    let wi=0;
                    for(const elm of kh) {
                        elm.__to_player_n__=wi;
                        player.__layout_resize_observer__.observe(elm)
                        wi++;
                    }
                    player.__layout_resize_n__=kh.length
                }else{
                    player.__layout_resize_n__=0
                }
                player._cache_wPlayerr=wPlayerr
                return player._cache_wPlayerr;

            },
            change_layoutBox: function(tipsDom, player) {
                if (!player || !player.parentNode) return;
                let {wPlayerInner,wPlayer} = $hs.getPlayerBlockElement(player);
                let layoutBoxInner = wPlayerInner.parentNode;
                let beforeParent = tipsDom.parentNode;

                if ((layoutBoxInner && layoutBoxInner.nodeType == 1) && (!beforeParent || beforeParent !== layoutBoxInner)) {

                    consoleLog('changed_layoutBox')
                    if (beforeParent && beforeParent !== layoutBoxInner){
                        if($hs.observer_resizeVideos) $hs.observer_resizeVideos.unobserve(beforeParent)
                        if(tipsDom.nextSibling && tipsDom.nextSibling.nodeName==utPositioner) beforeParent.removeChild(tipsDom.nextSibling);
                    }
                    layoutBoxInner.insertBefore(tipsDom, wPlayerInner);

                }

                tipsDom._playerVPID = player.getAttribute('_h5ppid');
            },

            _hasEventListener: function(elm, p) {
                if (typeof elm['on' + p] == 'function') return true;
                let listeners = $hs._getEventListeners(elm)
                if (listeners) {
                    const cache = listeners[p]
                    return cache && cache.count > 0
                }
                return false;
            },

            _getEventListeners: function(elmNode) {
                let listeners = wmListeners.get(elmNode);
                if (listeners && typeof listeners == 'object') return listeners;
                return null;
            },

            queryFullscreenBtnsIndependant: function(parentNode) {

                let btns = [];

                function elmCallback(elm) {

                    let hasClickListeners = null,
                        childElementCount = null,
                        isVisible = null,
                        btnElm = elm;
                    var pElm = elm;
                    while (pElm && pElm.nodeType === 1 && pElm != parentNode && pElm.querySelector('video') === null) {

                        let funcTest = $hs._hasEventListener(pElm, 'click');
                        funcTest = funcTest || $hs._hasEventListener(pElm, 'mousedown');
                        funcTest = funcTest || $hs._hasEventListener(pElm, 'mouseup');

                        if (funcTest) {
                            hasClickListeners = true
                            btnElm = pElm;
                            break;
                        }

                        pElm = pElm.parentNode;
                    }
                    if (btns.indexOf(btnElm) >= 0) return; //btn>a.fullscreen-1>b.fullscreen-2>c.fullscreen-3


                    if ('childElementCount' in elm) {

                        childElementCount = elm.childElementCount;

                    }
                    if ('offsetParent' in elm) {
                        isVisible = !!elm.offsetParent; //works with parent/self display none; not work with visiblity hidden / opacity0

                    }

                    if (hasClickListeners) {
                        let btn = {
                            elm,
                            btnElm,
                            isVisible,
                            hasClickListeners,
                            childElementCount,
                            isContained: null
                        };

                        //console.log('btnElm', btnElm)

                        btns.push(btnElm)

                    }
                }


                for (const elm of parentNode.querySelectorAll('[class*="full"][class*="screen"]')) {
                    let className = (elm.getAttribute('class') || "");
                    if (/\b(fullscreen|full-screen)\b/i.test(className.replace(/([A-Z][a-z]+)/g, '-$1-').replace(/[\_\-]+/g, '-'))) {
                        elmCallback(elm)
                    }
                }


                for (const elm of parentNode.querySelectorAll('[id*="full"][id*="screen"]')) {
                    let idName = (elm.getAttribute('id') || "");
                    if (/\b(fullscreen|full-screen)\b/i.test(idName.replace(/([A-Z][a-z]+)/g, '-$1-').replace(/[\_\-]+/g, '-'))) {
                        elmCallback(elm)
                    }
                }

                for (const elm of parentNode.querySelectorAll('[name*="full"][name*="screen"]')) {
                    let nName = (elm.getAttribute('name') || "");
                    if (/\b(fullscreen|full-screen)\b/i.test(nName.replace(/([A-Z][a-z]+)/g, '-$1-').replace(/[\_\-]+/g, '-'))) {
                        elmCallback(elm)
                    }
                }

                parentNode = null;

                return btns;

            },
            exclusiveElements: function(elms) {

                //not containing others
                let res = [];

                for (const roleElm of elms) {

                    let isContained = false;
                    for (const testElm of elms) {
                        if (testElm != roleElm && roleElm.contains(testElm)) {
                            isContained = true;
                            break;
                        }
                    }
                    if (!isContained) res.push(roleElm)
                }
                return res;

            },

            getWithFullscreenBtn: function(actionBoxRelation) {



                //console.log('callFullScreenBtn', 300)

                if (actionBoxRelation && actionBoxRelation.actionBox) {
                    let actionBox = actionBoxRelation.actionBox;
                    let btnElements = actionBoxRelation.fullscreenBtns;

                    //  console.log('callFullScreenBtn', 400)
                    if (btnElements && btnElements.length > 0) {

                        // console.log('callFullScreenBtn', 500, btnElements, actionBox.contains(btnElements[0]))

                        let btnElement_idx = btnElements._only_idx;

                        if (btnElement_idx >= 0) {

                        } else if (btnElements.length === 1) {
                            btnElement_idx = 0;
                        } else if (btnElements.length > 1) {
                            //web-fullscreen-on/off ;  fullscreen-on/off ....

                            const strList = btnElements.map(elm => [elm.className || 'null', elm.id || 'null', elm.name || 'null'].join('-').replace(/([A-Z][a-z]+)/g, '-$1-').replace(/[\_\-]+/g, '-'))

                            const filterOutScores = new Array(strList.length).fill(0);
                            const filterInScores = new Array(strList.length).fill(0);
                            const filterScores = new Array(strList.length).fill(0);
                            for (const [j, str] of strList.entries()) {
                                if (/\b(fullscreen|full-screen)\b/i.test(str)) filterInScores[j] += 1
                                if (/\b(web-fullscreen|web-full-screen)\b/i.test(str)) filterOutScores[j] += 1
                                if (/\b(fullscreen-on|full-screen-on)\b/i.test(str)) filterInScores[j] += 1
                                if (/\b(fullscreen-off|full-screen-off)\b/i.test(str)) filterOutScores[j] += 1
                                if (/\b(on-fullscreen|on-full-screen)\b/i.test(str)) filterInScores[j] += 1
                                if (/\b(off-fullscreen|off-full-screen)\b/i.test(str)) filterOutScores[j] += 1
                            }

                            let maxScore = -1e7;
                            for (const [j, str] of strList.entries()) {
                                filterScores[j] = filterInScores[j] * 3 - filterOutScores[j] * 2
                                if (filterScores[j] > maxScore) maxScore = filterScores[j];
                            }
                            btnElement_idx = filterScores.indexOf(maxScore)
                            if (btnElement_idx < 0) btnElement_idx = 0; //unknown
                        }

                        btnElements._only_idx = btnElement_idx


                        //consoleLog('original fullscreen')
                        return btnElements[btnElement_idx];

                    }


                }
                return null
            },

            callFullScreenBtn: function() {
                console.log('callFullScreenBtn')



                let player = $hs.player()
                if (!player || !player.parentNode || !player.ownerDocument || !('exitFullscreen' in player.ownerDocument)) return;

                let vpid = player.getAttribute('_h5ppid') || null;

                if (!vpid) return;


                const chFull = $hs.toolCheckFullScreen(player.ownerDocument);



                if (chFull === true) {
                    player.ownerDocument.exitFullscreen();
                    return;
                }

                let actionBoxRelation = $hs.actionBoxRelations[vpid];


                let asyncRes = Promise.resolve(actionBoxRelation)
                if (chFull === false) asyncRes = asyncRes.then($hs.getWithFullscreenBtn);
                else asyncRes = asyncRes.then(() => null)

                asyncRes.then((btnElement) => {

                    if (btnElement) {

                        window.requestAnimationFrame(() => btnElement.click());
                        player = null;
                        actionBoxRelation = null;
                        return;
                    }

                    let fsElm = $vQuery.rootNode(vpid).querySelector(`[_h5p_fsElm_="${vpid}"]`); //it is set in fullscreenchange

                    let gPlayer = fsElm

                    if (gPlayer) {

                    } else if (actionBoxRelation && actionBoxRelation.actionBox) {
                        gPlayer = actionBoxRelation.actionBox;
                    } else if (actionBoxRelation && actionBoxRelation.layoutBox) {
                        gPlayer = actionBoxRelation.layoutBox;
                    } else {
                        gPlayer = player;
                    }


                    player = null;
                    actionBoxRelation = null;

                    if (gPlayer != fsElm && !fsElm) {
                        delayCall('$$videoReset_fsElm', function() {
                            gPlayer.removeAttribute('_h5p_fsElm_')
                        }, 137)
                    }

                    console.log('DOM fullscreen', gPlayer)
                    try {
                        const res = gPlayer.requestFullscreen()
                        if (res && res.constructor.name == "Promise") res.catch((e) => 0)
                    } catch (e) {
                        console.log('DOM fullscreen Error', e)
                    }




                })




            },
            /* 設置播放速度 */
            setPlaybackRate: function(num, flagTips) {
                let player = $hs.player()
                let curPlaybackRate
                if (num) {
                    num = +num
                    if (num > 0) { // also checking the type of variable
                        curPlaybackRate = num < 0.1 ? 0.1 : +(num.toFixed(1))
                    } else {
                        console.error('h5player: 播放速度轉換出錯')
                        return false
                    }
                } else {
                    curPlaybackRate = $hs.getPlaybackRate()
                }
                /* 記錄播放速度的信息 */

                let changed = curPlaybackRate !== player.playbackRate;

                if (curPlaybackRate !== player.playbackRate) {

                    Store.save('_playback_rate_', curPlaybackRate + '')
                    player.playbackRate = curPlaybackRate
                    /* 本身處於1被播放速度的時候不再提示 */
                    //if (!num && curPlaybackRate === 1) return;

                }

                flagTips = (flagTips < 0) ? false : (flagTips > 0) ? true : changed;
                if (flagTips) $hs.tips('Playback speed: ' + player.playbackRate + 'x')
            },
            tuneCurrentTimeTips: function(_amount, changed) {

                $hs.tips(false);
                if (changed) {
                    if (_amount > 0) $hs.tips(_amount + ' Sec. Forward', undefined, 3000);
                    else $hs.tips(-_amount + ' Sec. Backward', undefined, 3000)
                }
            },
            tuneCurrentTime: function(amount) {
                let _amount = +(+amount).toFixed(1);
                if (!$hs.isNum(_amount)) return;
                let player = $hs.player();

                let newCurrentTime = player.currentTime + _amount;
                if (newCurrentTime < 0) newCurrentTime = 0;
                if (newCurrentTime > player.duration) newCurrentTime = player.duration;

                let changed = newCurrentTime != player.currentTime && newCurrentTime >= 0 && newCurrentTime <= player.duration;

                if (changed) {
                    //player.currentTime = newCurrentTime;
                    //player.pause();


                    const video = player;
                    var isPlaying = isVideoPlaying(video);

                    if (isPlaying) {
                        player.pause();
                        $hs.ccad = $hs.ccad || function() {
                            if (player.paused) player.play();
                        };
                        player.addEventListener('seeked', $hs.ccad, {
                            passive: true,
                            capture: true,
                            once: true
                        });

                    }




                    player.currentTime = +newCurrentTime.toFixed(0)

                    $hs.tuneCurrentTimeTips(_amount, changed)


                }

            },
            tuneVolume: function(amount) {

                let player = $hs.player()

                let intAmount = Math.round(amount * 100)

                let intOldVol = Math.round(player.volume * 100)
                let intNewVol = intOldVol + intAmount


                //0.53 -> 0.55

                //0.53 / 0.05 =10.6 => 11  => 11*0.05 = 0.55

                intNewVol = Math.round(intNewVol / intAmount) * intAmount
                if (intAmount > 0 && intNewVol - intOldVol > intAmount) intNewVol -= intAmount;
                else if (intAmount < 0 && intNewVol - intOldVol < intAmount) intNewVol -= intAmount;


                let _amount = intAmount / 100;
                let oldVol = intOldVol / 100;
                let newVol = intNewVol / 100;


                if (newVol < 0) newVol = 0;
                if (newVol > 1) newVol = 1;
                let chVol = oldVol !== newVol && newVol >= 0 && newVol <= 1;

                if (chVol) {

                    if (_amount > 0 && oldVol < 1) {
                        player.volume = newVol // positive
                    } else if (_amount < 0 && oldVol > 0) {
                        player.volume = newVol // negative
                    }
                    $hs.tips(false);
                    $hs.tips('Volume: ' + dround(player.volume * 100) + '%', undefined)
                }
            },
            switchPlayStatus: function() {
                let player = $hs.player()
                if (player.paused) {
                    player.play()
                    if (player._isThisPausedBefore_) {
                        $hs.tips(false);
                        $hs.tips('Playback resumed', undefined, 2500)
                    }
                } else {
                    player.pause()
                    $hs.tips(false);
                    $hs.tips('Playback paused', undefined, 2500)
                }
            },
            tipsDomObserve: (tipsDom, player) => {

                //observe not fire twice for the same element.
                if (!$hs.observer_resizeVideos) $hs.observer_resizeVideos = new ResizeObserver(hanlderResizeVideo)
                $hs.observer_resizeVideos.observe(tipsDom.parentNode)
                $hs.observer_resizeVideos.observe(player)

                $hs.fixNonBoxingVideoTipsPosition(tipsDom, player);


            },
            _tips: function(player, str, duration, order) {


                if (!player || !player.parentNode) return;
                const vpid = player.getAttribute('_h5ppid');
                if (!vpid) return;
                //$vQuery.rootNode(vpid)
                let fSetDOM = false;

                Promise.resolve().then(() => {


                    if (!player.getAttribute('_h5player_tips')){

                        // first time to trigger this player
                        if (!player.hasAttribute('playsinline')) player.setAttribute('playsinline', 'playsinline');
                        if (!player.hasAttribute('x-webkit-airplay')) player.setAttribute('x-webkit-airplay', 'deny');
                        if (!player.hasAttribute('preload')) player.setAttribute('preload', 'auto');
                        //player.style['image-rendering'] = 'crisp-edges';

                        $hs.initTips(player);
                    }

                }).then(() => {
                    let tipsSelector = '#' + player.getAttribute('_h5player_tips') //if this attribute still doesnt exist, set it to the base cls name
                    let tipsDom = $vQuery.rootNode(vpid).querySelector(tipsSelector)
                    if (!tipsDom) {
                        consoleLog('init h5player tips dom error...')
                        return false
                    }
                    return tipsDom
                }).then((tipsDom) => {
                    if (tipsDom === false) return false;

                    if (str === false) {
                        if ((tipsDom.getAttribute('data-h5p-pot-tips') || '').length) {
                            tipsDom.setAttribute('data-h5p-pot-tips', '');
                            tipsDom._tips_display_none = true;
                        }
                        return tipsDom;
                    }

                    order = order || 1000
                    tipsDom.tipsOrder = tipsDom.tipsOrder || 0;

                    if (order < tipsDom.tipsOrder && tipsDom._tips_display_none == false){
                        return tipsDom;
                    }

                    if (tipsDom._tips_display_none || tipsDom._playerVPID != vpid) {
                        $hs.change_layoutBox(tipsDom, player);
                        fSetDOM = true;
                    }

                    if (duration === undefined) duration = 2000

                    $hs.pendingTips = $hs.pendingTips || {};

                    if($hs.pendingTips[tipsDom._playerVPID] && tipsDom.tipsOrder == order && duration > 0){
                        tipsDom.setAttribute('data-h5p-pot-tips', str);
                        tipsDom.style['animation-duration']=duration+'ms';
                    }else{
                        $hs.pendingTips[tipsDom._playerVPID] = tipsDom
                        tipsDom.removeAttribute('_h5p_animate'); //force animation reset
                        tipsDom.setAttribute('data-h5p-pot-tips', str);
                        tipsDom._tips_display_none = false;
                        if(duration>0) tipsDom.style['animation-duration']=duration+'ms';
                        const withFadeOut = duration > 0 && !($hs.mouseDownAt && $hs.mouseDownAt.insideVideo === player);
                        1&&!(function(tipsDom, withFadeOut) {
                            window.requestAnimationFrame(function() {
                                tipsDom.setAttribute('_h5p_animate', withFadeOut?'':'P');
                                if(withFadeOut) delete $hs.pendingTips[tipsDom._playerVPID];
                                tipsDom=null;
                            })
                        })(tipsDom, withFadeOut);
                        if (!(duration > 0)) {
                            order = -1;
                        }
                        tipsDom.tipsOrder = order
                    }
                    return tipsDom;
                }).then((tipsDom) => {
                    if (tipsDom === false) return false;

                    if (fSetDOM) {
                        $hs.tipsDomObserve(tipsDom, player);

                    }

                })

            },
            tips: function(str, duration, order) {
                let player = $hs.player()
                if (!player || !player.parentNode) {
                    consoleLog('h5Player Tips:', str)
                } else {
                    $hs._tips(player, str, duration, order)

                }

            },
            handler_tipsDom_animation:function(e) {
                    this._tips_display_none = true;
                },
            initTips: function(player) {
                /* 設置提示DOM的樣式 */

                if(!player || !player.parentNode)return;

                let shadowRoot = getRoot(player);
                let doc = player.ownerDocument;
                //console.log((document.documentElement.qq=player),shadowRoot,'xax')
                let parentNode = player.parentNode
                let tcn = player.getAttribute('_h5player_tips') || ($hs.tipsClassName + '_' + (+new Date));
                player.setAttribute('_h5player_tips', tcn)
                if (shadowRoot.querySelector('#' + tcn)) return false;

                if (!shadowRoot._onceAddedCSS) {
                    shadowRoot._onceAddedCSS = true;

                    let cssStyle = `
                    ${utPositioner}{
                        position:absolute !important;
                        top:auto !important;
                        left:auto !important;
                        right:auto !important;
                        bottom:auto !important;
                        width:0 !important;
                        height:0 !important;
                        margin:0 !important;
                        padding:0 !important;
                        border:0 !important;
                        outline:0 !important;
                        transform:none !important;
                        contain: strict;
                    }
                    [data-h5p-pot-tips][_h5p_animate]{
                        animation: 2s linear 0s normal forwards 1 delayHide;
                    }

                    [data-h5p-pot-tips][_h5p_animate="P"]{
                        animation-play-state:paused;
                    }
                    [data-h5p-pot-tips]{
                        opacity:.95; transform: translate(0px, 0px);
                    }

                    @keyframes delayHide{
                        0%, 99% { opacity:0.95; transform: translate(0px, 0px); }
                        100% { opacity:0; transform:translate(-9999px, -9999px); }
                    }
                    [data-h5p-pot-tips]{
                        font-weight: bold !important;
                        position:absolute !important;
                        top:auto !important;
                        left:auto !important;
                        right:auto !important;
                        bottom:auto !important;

                        display:inline-block;
                        z-index: 999 !important;
                        font-size: ${$hs.fontSize || 16}px !important;
                        padding: 0px !important;
                        border:none !important;
                        background: rgba(0,0,0,0) !important;
                        color:#738CE6 !important;
                        text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
                        max-width:500px;max-height:50px;
                        border-radius:3px;
                        font-family: 'microsoft yahei', Verdana, Geneva, sans-serif;
                        pointer-events: none;
                        contain: content;
                    }
                    [data-h5p-pot-tips]::before{
                        content:attr(data-h5p-pot-tips);
                        display:inline-block;
                        position:relative;

                    }
                    body div[data-h5p-pot-tips]{
                        -webkit-user-select: none !important;
                        -moz-user-select: none !important;
                        -ms-user-select: none !important;
                        user-select: none !important;
                        -webkit-touch-callout: none !important;
                        -webkit-user-select: none !important;
                        -khtml-user-drag: none !important;
                        -khtml-user-select: none !important;
                        -moz-user-select: none !important;
                        -moz-user-select: -moz-none !important;
                        -ms-user-select: none !important;
                        user-select: none !important;
                    }
                    .ytp-chrome-bottom+span#volumeUI:last-child:empty{
                        display:none;
                    }
                    `.replace(/\r\n/g, '');


                    let cssContainer = domAppender(shadowRoot);


                    if (!cssContainer) {
                        cssContainer = makeNoRoot(shadowRoot)
                    }

                    domTool.addStyle(cssStyle, cssContainer);

                }

                let tipsDom = doc.createElement('div')

                tipsDom.addEventListener(crossBrowserTransition('animation'), $hs.handler_tipsDom_animation, $mb.eh_bubble_passive())

                tipsDom.id = tcn;
                tipsDom.setAttribute('data-h5p-pot-tips', '');
                tipsDom._tips_display_none = true;
                $hs.change_layoutBox(tipsDom, player);

                return true;
            },


            isNum:(d)=>(d>0||d<0||d===0),
            fixNonBoxingVideoTipsPosition: function(tipsDom, player) {

                if (!tipsDom || !player) return false;

                let ct = tipsDom.parentNode

                if (!ct) return false;

//return;
                // absolute

                let targetOffset = {
                    left: 10,
                    top: 15
                };
                if(!tipsDom.nextSibling||tipsDom.nextSibling.nodeName!=utPositioner){
                    tipsDom.parentNode.insertBefore(document.createElement(utPositioner),tipsDom.nextSibling);
                }
                let p = tipsDom.nextSibling.getBoundingClientRect();
                let q = player.getBoundingClientRect();
                let basePos = [+(p.left).toFixed(2), +(p.top).toFixed(2)];
                let targetPos = [+(q.left + targetOffset.left).toFixed(2), +(q.top + targetOffset.top).toFixed(2)];

                let tt=basePos.join(',')+','+targetPos.join(',')

                if(tipsDom.__cache_dim__!=tt){
                    tipsDom.__cache_dim__=tt;


                    let y1 = targetPos[0]- basePos[0]

                    let y2 = targetPos[1]- basePos[1]

                    if($hs.isNum(y1) && $hs.isNum(y2)){
                        tipsDom.style.marginLeft = (y1) + 'px';
                        tipsDom.style.marginTop = (y2) + 'px';
                        return true;
                    }

                }

                tipsDom=null;
                player=null;

            },

            playerTrigger: function(player, event) {



                if (!player || !player.parentNode || !event) return
                const pCode = event.code;
                let keyAsm = (event.shiftKey ? SHIFT : 0) | ((event.ctrlKey || event.metaKey) ? CTRL : 0) | (event.altKey ? ALT : 0);


                if (keyAsm == SHIFT && pCode == 'Backquote') {
                    $hs.enable = !$hs.enable;
                    $hs._tips(player, false);
                    if ($hs.enable) {
                        $hs._tips(player, '啟用h5Player插件')
                    } else {
                        $hs._tips(player, '禁用h5Player插件')
                    }
                    // 阻止事件冒泡
                    return TERMINATE
                }
                if (!$hs.enable) {
                    consoleLog('h5Player 已禁用~')
                    return false
                }


                if (!keyAsm && pCode == 'Enter') { //not NumberpadEnter

                    Promise.resolve(player).then((player) => {
                        $hs._actionBoxObtain(player);
                    }).then(() => {
                        $hs.callFullScreenBtn()
                    })

                    return TERMINATE
                }



                let vpid = player.getAttribute('_h5ppid') || null;
                if (!vpid) return;
                let playerConf = playerConfs[vpid]
                if (!playerConf) return;

                //shift + key
                if (keyAsm == SHIFT) {
                    // 網頁FULLSCREEN
                    if (pCode === 'Enter') {
                        //$hs.callFullScreenBtn()
                        //return TERMINATE
                    } else if (pCode == 'KeyF') {
                        //change unsharpen filter

                        let resList = ["unsharpen3_05", "unsharpen3_10", "unsharpen5_05", "unsharpen5_10", "unsharpen9_05", "unsharpen9_10"]
                        let res = (prompt("Enter the unsharpen mask\n(" + resList.map(x => '"' + x + '"').join(', ') + ")", "unsharpen9_05") || "").toLowerCase();
                        if (resList.indexOf(res) < 0) res = ""
                        GM_setValue("unsharpen_mask", res)
                        for (const el of document.querySelectorAll('video[_h5p_uid_encrypted]')) {
                            if (el.style.filter == "" || el.style.filter) {
                                let filterStr1 = el.style.filter.replace(/\s*url\(\"#_h5p_unsharpen[\d\_]+\"\)/, '');
                                let filterStr2 = (res.length > 0 ? ' url("#_h5p_' + res + '")' : '')
                                el.style.filter = filterStr1 + filterStr2;
                            }
                        }
                        return TERMINATE

                    }
                    // 進入或退出畫中畫模式
                    else if (pCode == 'KeyP') {
                        $hs.pictureInPicture(player)

                        return TERMINATE
                    } else if (pCode == 'KeyR') {
                        if (player._h5player_lastrecord_ !== null && (player._h5player_lastrecord_ >= 0 || player._h5player_lastrecord_ <= 0)) {
                            $hs.setPlayProgress(player, player._h5player_lastrecord_)

                            return TERMINATE
                        }

                    } else if (pCode == 'KeyO') {
                        let _debug_h5p_logging_ch = false;
                        try {
                            Store._setItem('_h5_player_sLogging_', 1 - Store._getItem('_h5_player_sLogging_'))
                            _debug_h5p_logging_ = +Store._getItem('_h5_player_sLogging_') > 0;
                            _debug_h5p_logging_ch = true;
                        } catch (e) {

                        }
                        consoleLogF('_debug_h5p_logging_', !!_debug_h5p_logging_, 'changed', _debug_h5p_logging_ch)

                        if (_debug_h5p_logging_ch) {

                            return TERMINATE
                        }
                    } else if (pCode == 'KeyT') {
                        if (/^blob/i.test(player.currentSrc)) {
                            alert(`The current video is ${player.currentSrc}\nSorry, it cannot be opened in PotPlayer.`);
                        } else {
                            let confirm_res = confirm(`The current video is ${player.currentSrc}\nDo you want to open it in PotPlayer?`);
                            if (confirm_res) window.open('potplayer://' + player.currentSrc, '_blank');
                        }
                        return TERMINATE
                    }



                    let videoScale = playerConf.vFactor;

                    function tipsForVideoScaling() {

                        playerConf.vFactor = +videoScale.toFixed(1);

                        playerConf.cssTransform();
                        let tipsMsg = `視頻縮放率：${ +(videoScale * 100).toFixed(2) }%`
                        if (playerConf.translate.x) {
                            tipsMsg += `，水平位移：${playerConf.translate.x}px`
                        }
                        if (playerConf.translate.y) {
                            tipsMsg += `，垂直位移：${playerConf.translate.y}px`
                        }
                        $hs.tips(false);
                        $hs.tips(tipsMsg)


                    }

                    // 視頻畫面縮放相關事件

                    switch (pCode) {
                        // shift+X：視頻縮小 -0.1
                        case 'KeyX':
                            videoScale -= 0.1
                            if (videoScale < 0.1) videoScale = 0.1;
                            tipsForVideoScaling();
                            return TERMINATE
                            break
                            // shift+C：視頻放大 +0.1
                        case 'KeyC':
                            videoScale += 0.1
                            if (videoScale > 16) videoScale = 16;
                            tipsForVideoScaling();
                            return TERMINATE
                            break
                            // shift+Z：視頻恢復正常大小
                        case 'KeyZ':
                            videoScale = 1.0
                            playerConf.translate.x = 0;
                            playerConf.translate.y = 0;
                            tipsForVideoScaling();
                            return TERMINATE
                            break
                        case 'ArrowRight':
                            playerConf.translate.x += 10
                            tipsForVideoScaling();
                            return TERMINATE
                            break
                        case 'ArrowLeft':
                            playerConf.translate.x -= 10
                            tipsForVideoScaling();
                            return TERMINATE
                            break
                        case 'ArrowUp':
                            playerConf.translate.y -= 10
                            tipsForVideoScaling();
                            return TERMINATE
                            break
                        case 'ArrowDown':
                            playerConf.translate.y += 10
                            tipsForVideoScaling();
                            return TERMINATE
                            break

                    }

                }
                // 防止其它無關組合鍵衝突
                if (!keyAsm) {
                    let kControl = null
                    let newPBR, oldPBR, nv, numKey;
                    switch (pCode) {
                        // 方向鍵右→：快進3秒
                        case 'ArrowRight':
                            if (1) {
                                let aCurrentTime = player.currentTime;
                                window.requestAnimationFrame(() => {
                                    let diff = player.currentTime - aCurrentTime
                                    diff = Math.round(diff * 5) / 5;
                                    if (Math.abs(diff) < 0.8) {
                                        $hs.tuneCurrentTime(+$hs.skipStep);
                                    } else {
                                        $hs.tuneCurrentTimeTips(diff, true)
                                    }
                                })
                                //if(document.domain.indexOf('youtube.com')>=0){}else{
                                //$hs.tuneCurrentTime($hs.skipStep);
                                //return TERMINATE;
                                //}
                            }
                            break;
                            // 方向鍵左←：後退3秒
                        case 'ArrowLeft':

                            if (1) {
                                let aCurrentTime = player.currentTime;
                                window.requestAnimationFrame(() => {
                                    let diff = player.currentTime - aCurrentTime
                                    diff = Math.round(diff * 5) / 5;
                                    if (Math.abs(diff) < 0.8) {
                                        $hs.tuneCurrentTime(-$hs.skipStep);
                                    } else {
                                        $hs.tuneCurrentTimeTips(diff, true)
                                    }
                                })
                                //if(document.domain.indexOf('youtube.com')>=0){}else{
                                //
                                //return TERMINATE;
                                //}
                            }
                            break;
                            // 方向鍵上↑：音量升高 1%
                        case 'ArrowUp':
                            if ((player.muted && player.volume === 0) && player._volume > 0) {

                                player.muted = false;
                                player.volume = player._volume;
                            } else if (player.muted && (player.volume > 0 || !player._volume)) {
                                player.muted = false;
                            }
                            $hs.tuneVolume(0.01);
                            return TERMINATE;
                            break;
                            // 方向鍵下↓：音量降低 1%
                        case 'ArrowDown':

                            if ((player.muted && player.volume === 0) && player._volume > 0) {

                                player.muted = false;
                                player.volume = player._volume;
                            } else if (player.muted && (player.volume > 0 || !player._volume)) {
                                player.muted = false;
                            }
                            $hs.tuneVolume(-0.01);
                            return TERMINATE;
                            break;
                            // 空格鍵：暫停/播放
                        case 'Space':
                            $hs.switchPlayStatus();
                            return TERMINATE;
                            break;
                            // 按鍵X：減速播放 -0.1
                        case 'KeyX':
                            if (player.playbackRate > 0) {
                                $hs.tips(false);
                                let t=player.playbackRate - 0.1;
                                if(t<0.1)t=0.1;
                                $hs.setPlaybackRate(t, true);
                                return TERMINATE
                            }
                            break;
                            // 按鍵C：加速播放 +0.1
                        case 'KeyC':
                            if (player.playbackRate < 16) {
                                $hs.tips(false);
                                $hs.setPlaybackRate(player.playbackRate + 0.1, true);
                                return TERMINATE
                            }

                            break;
                            // 按鍵Z：正常速度播放
                        case 'KeyZ':
                            $hs.tips(false);
                            oldPBR = player.playbackRate;
                            if (oldPBR != 1.0) {
                                player._playbackRate_z = oldPBR;
                                newPBR = 1.0;
                            } else if (player._playbackRate_z != 1.0) {
                                newPBR = player._playbackRate_z || 1.0;
                                player._playbackRate_z = 1.0;
                            } else {
                                newPBR = 1.0
                                player._playbackRate_z = 1.0;
                            }
                            $hs.setPlaybackRate(newPBR, 1)
                            return TERMINATE
                            break;
                            // 按鍵F：下一幀
                        case 'KeyF':
                            if (window.location.hostname === 'www.netflix.com') return /* netflix 的F鍵是FULLSCREEN的意思 */
                            $hs.tips(false);
                            if (!player.paused) player.pause()
                            player.currentTime += +(1 / playerConf.fps)
                            $hs.tips('Jump to: Next frame')
                            return TERMINATE
                            break;
                            // 按鍵D：上一幀
                        case 'KeyD':
                            $hs.tips(false);
                            if (!player.paused) player.pause()
                            player.currentTime -= +(1 / playerConf.fps)
                            $hs.tips('Jump to: Previous frame')
                            return TERMINATE
                            break;
                            // 按鍵E：亮度增加%
                        case 'KeyE':
                            $hs.tips(false);
                            nv = playerConf.setFilter('brightness', (v) => v + 0.1);
                            $hs.tips('Brightness: ' + dround(nv * 100) + '%')
                            return TERMINATE
                            break;
                            // 按鍵W：亮度減少%
                        case 'KeyW':
                            $hs.tips(false);
                            nv = playerConf.setFilter('brightness', (v) => v > 0.1 ? v - 0.1 : 0);
                            $hs.tips('Brightness: ' + dround(nv * 100) + '%')
                            return TERMINATE
                            break;
                            // 按鍵T：對比度增加%
                        case 'KeyT':
                            $hs.tips(false);
                            nv = playerConf.setFilter('contrast', (v) => v + 0.1);
                            $hs.tips('Contrast: ' + dround(nv * 100) + '%')
                            return TERMINATE
                            break;
                            // 按鍵R：對比度減少%
                        case 'KeyR':
                            $hs.tips(false);
                            nv = playerConf.setFilter('contrast', (v) => v > 0.1 ? v - 0.1 : 0);
                            $hs.tips('Contrast: ' + dround(nv * 100) + '%')
                            return TERMINATE
                            break;
                            // 按鍵U：飽和度增加%
                        case 'KeyU':
                            $hs.tips(false);
                            nv = playerConf.setFilter('saturate', (v) => v + 0.1);
                            $hs.tips('Saturate: ' + dround(nv * 100) + '%')
                            return TERMINATE
                            break;
                            // 按鍵Y：飽和度減少%
                        case 'KeyY':
                            $hs.tips(false);
                            nv = playerConf.setFilter('saturate', (v) => v > 0.1 ? v - 0.1 : 0);
                            $hs.tips('Saturate: ' + dround(nv * 100) + '%')
                            return TERMINATE
                            break;
                            // 按鍵O：色相增加 1 度
                        case 'KeyO':
                            $hs.tips(false);
                            nv = playerConf.setFilter('hue-rotate', (v) => v + 1);
                            $hs.tips('Hue: ' + nv + ' deg')
                            return TERMINATE
                            break;
                            // 按鍵I：色相減少 1 度
                        case 'KeyI':
                            $hs.tips(false);
                            nv = playerConf.setFilter('hue-rotate', (v) => v - 1);
                            $hs.tips('Hue: ' + nv + ' deg')
                            return TERMINATE
                            break;
                            // 按鍵K：模糊增加 0.1 px
                        case 'KeyK':
                            $hs.tips(false);
                            nv = playerConf.setFilter('blur', (v) => v + 0.1);
                            $hs.tips('Blur: ' + nv + ' px')
                            return TERMINATE
                            break;
                            // 按鍵J：模糊減少 0.1 px
                        case 'KeyJ':
                            $hs.tips(false);
                            nv = playerConf.setFilter('blur', (v) => v > 0.1 ? v - 0.1 : 0);
                            $hs.tips('Blur: ' + nv + ' px')
                            return TERMINATE
                            break;
                            // 按鍵Q：圖像復位
                        case 'KeyQ':
                            $hs.tips(false);
                            playerConf.filterReset();
                            $hs.tips('Video Filter Reset')
                            return TERMINATE
                            break;
                            // 按鍵S：畫面旋轉 90 度
                        case 'KeyS':
                            $hs.tips(false);
                            playerConf.rotate += 90
                            if (playerConf.rotate % 360 === 0) playerConf.rotate = 0;
                            if (!playerConf.videoHeight || !playerConf.videoWidth) {
                                playerConf.videoWidth = playerConf.domElement.videoWidth;
                                playerConf.videoHeight = playerConf.domElement.videoHeight;
                            }
                            if (playerConf.videoWidth > 0 && playerConf.videoHeight > 0) {


                                if ((playerConf.rotate % 180) == 90) {
                                    playerConf.mFactor = playerConf.videoHeight / playerConf.videoWidth;
                                } else {
                                    playerConf.mFactor = 1.0;
                                }


                                playerConf.cssTransform();

                                $hs.tips('Rotation：' + playerConf.rotate + ' deg')

                            }

                            return TERMINATE
                            break;
                            // 按鍵迴車，進入FULLSCREEN
                        case 'Enter':
                            //t.callFullScreenBtn();
                            break;
                        case 'KeyN':
                            $hs.pictureInPicture(player);
                            return TERMINATE
                            break;
                        case 'KeyM':
                            //console.log('m!', player.volume,player._volume)

                            if (player.volume >= 0) {

                                if (!player.volume || player.muted) {

                                    let newVol = player.volume || player._volume || 0.5;
                                    if (player.volume !== newVol) {
                                        player.volume = newVol;
                                    }
                                    player.muted = false;
                                    $hs.tips(false);
                                    $hs.tips('Mute: Off', undefined);

                                } else {

                                    player._volume = player.volume;
                                    player._volume_p = player.volume;
                                    //player.volume = 0;
                                    player.muted = true;
                                    $hs.tips(false);
                                    $hs.tips('Mute: On', undefined);

                                }

                            }

                            return TERMINATE
                            break;
                        default:
                            // 按1-4設置播放速度 49-52;97-100
                            numKey = +(event.key)

                            if (numKey >= 1 && numKey <= 4) {
                                $hs.tips(false);
                                $hs.setPlaybackRate(numKey, 1)
                                return TERMINATE
                            }
                    }

                }
            },

            handlerPlayerLockedMouseMove: function(e) {
                //console.log(4545)

                if(!$hs.mointoringVideo) return;

                const player = $vQuery.player($hs.mointoringVideo);

                if (!player) return;


                $hs.mouseMoveCount += Math.sqrt(e.movementX * e.movementX + e.movementY * e.movementY);

                delayCall('$$VideoClearMove', function() {
                    $hs.mouseMoveCount = $hs.mouseMoveCount * 0.4;
                }, 100)

                delayCall('$$VideoClearMove2', function() {
                    $hs.mouseMoveCount = $hs.mouseMoveCount * 0.1;
                }, 400)

                if ($hs.mouseMoveCount > player.mouseMoveMax) {
                    $hs.hcMouseShowWithMonitoring(player)
                }

            },

            _hcMouseHidePre: function(player) {
                if (player.paused === true) {
                    $hs.hcShowMouseAndRemoveMointoring(player);
                    return;
                }
                if ($hs.mouseEnteredElement) {
                    const elm = $hs.mouseEnteredElement;
                    switch (getComputedStyle(elm).getPropertyValue('cursor')) {
                        case 'grab':
                        case 'pointer':
                            return;
                    }
                    if (elm.hasAttribute('alt')) return;
                    if (elm.getAttribute('aria-hidden') == 'true') return;
                }
                Promise.resolve().then(() => {
                    if (!$hs.mouseDownAt && !$hs.hide_cursor_css) {
                        let htmlRoot = player.ownerDocument.querySelector('html');
                        htmlRoot.style.setProperty('--h5p-hide-cursor','none');
                        $hs.hide_cursor_css=true;
                        //if(!htmlRoot.hasAttribute('_h5p_hide_cursor')) htmlRoot.setAttribute('_h5p_hide_cursor', '');
                    }
                    player = null;
                })
                return true;
            },

            hcStartMointoring:(player)=>{


                $hs.mouseMoveCount = 0;

                Promise.resolve($hs._hcMouseHidePre(player)).then(r => {
                    if (r) {

                        if($hs.mointoringVideo===false) player.ownerDocument.addEventListener('mousemove', $hs.handlerPlayerLockedMouseMove, $mb.eh_capture_passive())
                        $hs.mointoringVideo = player.getAttribute('_h5ppid');

                    }

                    player = null;

                })

            },

            hcMouseHideAndStartMointoring: function(player) {

                //console.log(554, 'hcMouseHideAndStartMointoring')
                delayCall('$$hcMouseMove')

                $hs.hcStartMointoring(player)


            },

            hcDelayMouseHideAndStartMointoring: function(player) {
                //console.log(554, 'hcDelayMouseHideAndStartMointoring')
                delayCall('$$hcMouseMove', ()=> $hs.hcStartMointoring(player), 1240)
            },

            hcMouseShowWithMonitoring: function(player) {
                //console.log(554, 'hcMouseShowWithMonitoring')
                delayCall('$$hcMouseMove', function() {
                    $hs.mouseMoveCount = 0;
                    $hs._hcMouseHidePre(player)
                }, 1240)
                $hs.mouseMoveCount = 0;
                if( $hs.hide_cursor_css ){
                    let htmlRoot = player.ownerDocument.querySelector('html');
                    $hs.hide_cursor_css=false;
                    htmlRoot.style.setProperty('--h5p-hide-cursor','');
                }
                //if(htmlRoot.hasAttribute('_h5p_hide_cursor')) htmlRoot.removeAttribute('_h5p_hide_cursor')
            },

            hcShowMouseAndRemoveMointoring: function(player) {
                //console.log(554, 'hcShowMouseAndRemoveMointoring')
                delayCall('$$hcMouseMove')
                if($hs.mointoringVideo) $hs.mointoringVideo = null;
                $hs.mouseMoveCount = 0;
                if( $hs.hide_cursor_css ){
                    let htmlRoot = player.ownerDocument.querySelector('html');
                    $hs.hide_cursor_css=false;
                    htmlRoot.style.setProperty('--h5p-hide-cursor','');
                }
                //if(htmlRoot.hasAttribute('_h5p_hide_cursor')) htmlRoot.removeAttribute('_h5p_hide_cursor')

            },



            handlerElementFocus: function(event) {

                function notAtVideo() {
                    if ($hs.focusHookVId) $hs.focusHookVId = ''
                }

                const hookVideo = $hs.focusHookVId ? $vQuery.player($hs.focusHookVId) : null

                if (hookVideo && (event.target == hookVideo || event.target.contains(hookVideo))) {} else {
                    notAtVideo();
                }

            },

            handlerFullscreenChanged: function(event) {


                let videoElm = null,
                    videosQuery = null;
                if (event && event.target) {
                    if (event.target.nodeName == "VIDEO") videoElm = event.target;
                    else if (videosQuery = event.target.querySelectorAll("VIDEO")) {
                        if (videosQuery.length === 1) videoElm = videosQuery[0]
                    }
                }

                if (videoElm) {
                    const player = videoElm;
                    const vpid = player.getAttribute('_h5ppid')
                    event.target.setAttribute('_h5p_fsElm_', vpid)

                    function hookTheActionedVideo() {
                        $hs.focusHookVId = vpid
                    }
                    hookTheActionedVideo();
                    window.setTimeout(hookTheActionedVideo, 300)
                    window.setTimeout(() => {
                        const chFull = $hs.toolCheckFullScreen(player.ownerDocument);
                        if (chFull) {
                            $hs.hcMouseHideAndStartMointoring(player);
                        } else {
                            $hs.hcShowMouseAndRemoveMointoring(player);
                        }
                    });

                    const playerConf = $hs.getPlayerConf(videoElm)
                    if (playerConf) {
                        delayCall("$$actionBoxFullscreen", function() {
                            playerConf.domActive &= ~DOM_ACTIVE_FULLSCREEN;
                        }, 137)
                        playerConf.domActive |= DOM_ACTIVE_FULLSCREEN;
                    }

                    $hs.swtichPlayerInstance()

                } else {
                    $hs.focusHookVId = ''
                }
            },


            isEditableElement:function(elm){

                if(elm&& elm.nodeType==1 ){

                    return elm.nodeName=="TEXTAREA" || elm.nodeName=="INPUT" || elm.hasAttribute('contenteditable');
                }
                return false
            },

            /* 按鍵響應方法 */
            handlerRootKeyDownEvent: function(event) {

                if ($hs.intVideoInitCount > 0) {} else {
                    // return notAtVideo();
                }

                // $hs.lastKeyDown = event.timeStamp

                // DOM Standard - either .key or .code
                // Here we adopt .code (physical layout)

                let pCode = event.code;
                if (typeof pCode != 'string') return;
                let keyAsm = (event.shiftKey ? SHIFT : 0) | ((event.ctrlKey || event.metaKey) ? CTRL : 0) | (event.altKey ? ALT : 0);
                let hookVideo = null;

                if($hs.isEditableElement(document.activeElement)){
                    $hs.focusHookVId=null
                } else if (document.fullscreenElement) {
                    let playingVideo = document.fullscreenElement.querySelector('VIDEO[_h5ppid]');
                    if(!playingVideo) return;
                    if (!keyAsm && pCode == 'Escape') {
                        window.setTimeout(() => {
                            if (document.fullscreenElement) {
                                document.exitFullscreen();
                            }
                        }, 270);
                        return;
                    }
                    $hs.focusHookVId = playingVideo.getAttribute('_h5ppid');
                }else{
                    const actionBoxRelation = $hs.getActionBoxRelationFromDOM(event.target)
                    if (actionBoxRelation) {
                        $hs.focusHookVId = actionBoxRelation.player.getAttribute('_h5ppid');
                    } else if ($hs.enteredActionBoxRelation && $hs.enteredActionBoxRelation.pContainer ){
                        $hs.focusHookVId=$hs.enteredActionBoxRelation.player.getAttribute('_h5ppid');
                    }
                }

                hookVideo = $hs.focusHookVId ? $vQuery.player($hs.focusHookVId) : null

                if (!hookVideo || !hookVideo.parentNode) return; // no video tag

                let videoElm = hookVideo

                const playerConf = $hs.getPlayerConf(videoElm)
                if (playerConf) {
                    delayCall("$$actionBoxKeyDown", function() {
                        playerConf.domActive &= ~DOM_ACTIVE_KEY_DOWN;
                    }, 137)
                    playerConf.domActive |= DOM_ACTIVE_KEY_DOWN;
                }

                $hs.swtichPlayerInstance()

                let player = hookVideo;

                let res = $hs.playerTrigger(player, event)
                if (res == TERMINATE) {
                    event.stopPropagation()
                    event.preventDefault()
                    return false
                }

            },
            /* 設置播放進度 */
            setPlayProgress: function(player, curTime) {
                if (!player || !player.parentNode) return
                if (!curTime || Number.isNaN(curTime)) return
                player.currentTime = curTime
                if (curTime > 3) {
                    $hs.tips(false);
                    $hs.tips(`Playback Jumps to ${$hs.toolFormatCT(curTime)}`)
                    if (player.paused) player.play();
                }
            }
        }

        function makeFilter(arr, k) {
            let res = ""
            for (const e of arr) {
                for (const d of e) {
                    res += " " + (1.0 * d * k).toFixed(9)
                }
            }
            return res.trim()
        }

        function _add_filter(rootElm) {
            let rootView = null;
            if (rootElm && rootElm.nodeType > 0) {
                while (rootElm.parentNode && rootElm.parentNode.nodeType === 1) rootElm = rootElm.parentNode;
                rootView = rootElm.querySelector('body') || rootElm;
            } else {
                return;
            }

            if (rootView && rootView.querySelector && !rootView.querySelector('#_h5player_section_')) {

                let svgFilterElm = document.createElement('section')
                svgFilterElm.style.position = 'fixed';
                svgFilterElm.style.left = '-999px';
                svgFilterElm.style.width = '1px';
                svgFilterElm.style.top = '-999px';
                svgFilterElm.style.height = '1px';
                svgFilterElm.id = '_h5player_section_'
                let svgXML = `
            <svg id='_h5p_image' version="1.1" xmlns="http://www.w3.org/2000/svg">
            <defs>
            <filter id="_h5p_sharpen1">
            <feConvolveMatrix filterRes="100 100" style="color-interpolation-filters:sRGB" order="3" kernelMatrix="` + `
            -0.3 -0.3 -0.3
            -0.3 3.4 -0.3
            -0.3 -0.3 -0.3`.replace(/[\n\r]+/g, '  ').trim() + `"  preserveAlpha="true"/>
            </filter>
            <filter id="_h5p_unsharpen1">
            <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="5" kernelMatrix="` +
                    makeFilter([
                        [1, 4, 6, 4, 1],
                        [4, 16, 24, 16, 4],
                        [6, 24, -476, 24, 6],
                        [4, 16, 24, 16, 4],
                        [1, 4, 6, 4, 1]
                    ], -1 / 256) + `"  preserveAlpha="false"/>
            </filter>
            <filter id="_h5p_unsharpen3_05">
            <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="3" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.025, 0.05, 0.025],
                            [0.05, -1.1, 0.05],
                            [0.025, 0.05, 0.025]
                        ], -1 / .8) + `"  preserveAlpha="false"/>
            </filter>
            <filter id="_h5p_unsharpen3_10">
            <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="3" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.05, 0.1, 0.05],
                            [0.1, -1.4, 0.1],
                            [0.05, 0.1, 0.05]
                        ], -1 / .8) + `"  preserveAlpha="false"/>
            </filter>
            <filter id="_h5p_unsharpen5_05">
            <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="5" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.025, 0.1, 0.15, 0.1, 0.025],
                            [0.1, 0.4, 0.6, 0.4, 0.1],
                            [0.15, 0.6, -18.3, 0.6, 0.15],
                            [0.1, 0.4, 0.6, 0.4, 0.1],
                            [0.025, 0.1, 0.15, 0.1, 0.025]
                        ], -1 / 12.8) + `"  preserveAlpha="false"/>
            </filter>
            <filter id="_h5p_unsharpen5_10">
            <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="5" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.05, 0.2, 0.3, 0.2, 0.05],
                            [0.2, 0.8, 1.2, 0.8, 0.2],
                            [0.3, 1.2, -23.8, 1.2, 0.3],
                            [0.2, 0.8, 1.2, 0.8, 0.2],
                            [0.05, 0.2, 0.3, 0.2, 0.05]
                        ], -1 / 12.8) + `"  preserveAlpha="false"/>
            </filter>
            <filter id="_h5p_unsharpen9_05">
            <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="9" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.025, 0.2, 0.7, 1.4, 1.75, 1.4, 0.7, 0.2, 0.025],
                            [0.2, 1.6, 5.6, 11.2, 14, 11.2, 5.6, 1.6, 0.2],
                            [0.7, 5.6, 19.6, 39.2, 49, 39.2, 19.6, 5.6, 0.7],
                            [1.4, 11.2, 39.2, 78.4, 98, 78.4, 39.2, 11.2, 1.4],
                            [1.75, 14, 49, 98, -4792.7, 98, 49, 14, 1.75],
                            [1.4, 11.2, 39.2, 78.4, 98, 78.4, 39.2, 11.2, 1.4],
                            [0.7, 5.6, 19.6, 39.2, 49, 39.2, 19.6, 5.6, 0.7],
                            [0.2, 1.6, 5.6, 11.2, 14, 11.2, 5.6, 1.6, 0.2],
                            [0.025, 0.2, 0.7, 1.4, 1.75, 1.4, 0.7, 0.2, 0.025]
                        ], -1 / 3276.8) + `"  preserveAlpha="false"/>
            </filter>
            <filter id="_h5p_unsharpen9_10">
            <feConvolveMatrix style="color-interpolation-filters:sRGB;color-interpolation: sRGB;" order="9" kernelMatrix="` +
                    makeFilter(
                        [
                            [0.05, 0.4, 1.4, 2.8, 3.5, 2.8, 1.4, 0.4, 0.05],
                            [0.4, 3.2, 11.2, 22.4, 28, 22.4, 11.2, 3.2, 0.4],
                            [1.4, 11.2, 39.2, 78.4, 98, 78.4, 39.2, 11.2, 1.4],
                            [2.8, 22.4, 78.4, 156.8, 196, 156.8, 78.4, 22.4, 2.8],
                            [3.5, 28, 98, 196, -6308.6, 196, 98, 28, 3.5],
                            [2.8, 22.4, 78.4, 156.8, 196, 156.8, 78.4, 22.4, 2.8],
                            [1.4, 11.2, 39.2, 78.4, 98, 78.4, 39.2, 11.2, 1.4],
                            [0.4, 3.2, 11.2, 22.4, 28, 22.4, 11.2, 3.2, 0.4],
                            [0.05, 0.4, 1.4, 2.8, 3.5, 2.8, 1.4, 0.4, 0.05]
                        ], -1 / 3276.8) + `"  preserveAlpha="false"/>
                </filter>
                <filter id="_h5p_grey1">
                <feColorMatrix values="0.3333 0.3333 0.3333 0 0
                0.3333 0.3333 0.3333 0 0
                0.3333 0.3333 0.3333 0 0
                0      0      0      1 0"/>
                <feColorMatrix type="saturate" values="0" />
                </filter>
                </defs>
                </svg>
                `;

                svgFilterElm.innerHTML = svgXML.replace(/[\r\n\s]+/g, ' ').trim();

                rootView.appendChild(svgFilterElm);
            }

        }

        /**
         * 某些網頁用了attachShadow closed mode，需要open才能獲取video標籤，例如百度雲盤
         * 解決參考：
         * https://developers.google.com/web/fundamentals/web-components/shadowdom?hl=zh-cn#closed
         * https://stackoverflow.com/questions/54954383/override-element-prototype-attachshadow-using-chrome-extension
         */

        const initForShadowRoot = async (shadowRoot) => {
            try {
                if (shadowRoot && shadowRoot.nodeType > 0 && shadowRoot.mode == 'open' && 'querySelectorAll' in shadowRoot) {
                    if (!shadowRoot.host.hasAttribute('_h5p_shadowroot_')) {
                        shadowRoot.host.setAttribute('_h5p_shadowroot_', '')

                        $hs.bindDocEvents(shadowRoot);
                        captureVideoEvents(shadowRoot);

                    }
                }
            } catch (e) {
                console.log('h5Player: initForShadowRoot failed')
            }
        }

        function hackAttachShadow() { // attachShadow - DOM Standard

            let _prototype_ = window && window.HTMLElement ? window.HTMLElement.prototype : null;
            if (_prototype_ && typeof _prototype_.attachShadow == 'function') {

                let _attachShadow = _prototype_.attachShadow

                hackAttachShadow = null
                _prototype_.attachShadow = function() {
                    let arg = [...arguments];
                    if (arg[0] && arg[0].mode) arg[0].mode = 'open';
                    let shadowRoot = _attachShadow.apply(this, arg);
                    initForShadowRoot(shadowRoot);
                    return shadowRoot
                };

                _prototype_.attachShadow.toString = () => _attachShadow.toString();

            }

        }

        function hackCreateShadowRoot() { // createShadowRoot - Deprecated

            let _prototype_ = window && window.HTMLElement ? window.HTMLElement.prototype : null;
            if (_prototype_ && typeof _prototype_.createShadowRoot == 'function') {

                let _createShadowRoot = _prototype_.createShadowRoot;

                hackCreateShadowRoot = null
                _prototype_.createShadowRoot = function() {
                    const shadowRoot = _createShadowRoot.apply(this, arguments);
                    initForShadowRoot(shadowRoot);
                    return shadowRoot;
                };
                _prototype_.createShadowRoot.toString = () => _createShadowRoot.toString();

            }
        }




        /* 事件偵聽hack */
        function hackEventListener() {
            if (!window.HTMLElement || !window.HTMLElement.prototype) return;
            const _prototype = window.HTMLElement.prototype;
            let _addEventListener = _prototype.addEventListener;
            let _removeEventListener = _prototype.removeEventListener;
            if (typeof _addEventListener == 'function' && typeof _removeEventListener == 'function') {} else return;
            hackEventListener = null;

            const options_passive_capture = {
                passive: true,
                capture: true
            }
            const options_passive_bubble = {
                passive: true,
                capture: false
            }

            let phListeners = Promise.resolve();

            function getEventChoice(type){
                let eventChoice = 0;
                switch (type) {
                    case 'load':
                    case 'beforeunload':
                    case 'DOMContentLoaded':
                        eventChoice=9;
                        break;
                    case 'touchstart':
                    case 'touchmove':
                    case 'wheel':
                    case 'mousewheel':
                    case 'timeupdate':
                        eventChoice=6;
                        break;
                    case 'mouseout':
                    case 'mouseover':
                    case 'focusin':
                    case 'focusout':
                    case 'mouseenter':
                    case 'mouseleave':
                    case 'mousemove':
                        eventChoice=8;
                        break;
                    case 'click':
                    case 'mousedown':
                    case 'mouseup':
                        eventChoice=2;
                        break;
                    default:
                        eventChoice=9;
                }
                return eventChoice;

            }


            _prototype.addEventListener = function addEventListener() {
                const args = arguments
                const type = args[0]
                const listener = args[1]

                if (!this || typeof type != 'string' || typeof listener != 'function') {
                    return _addEventListener.apply(this, args);
                }

                let eventChoice = getEventChoice(type);

                if(eventChoice==2) {

                    phListeners = phListeners.then(() => {
                        let listeners = wmListeners.get(this);
                        if (!listeners) wmListeners.set(this, listeners = {});
                        if (!listeners[type]) listeners[type] = new Listeners();
                        let lh = new ListenerHandle(args[1], args[2]);
                        listeners[type].add(lh);
                    })

                }

                return _addEventListener.apply(this, args);


            }
            // hack removeEventListener
            _prototype.removeEventListener = function removeEventListener() {

                let args = arguments;
                let type = args[0];
                let listener = args[1];

                if (!this || typeof type != 'string' || typeof listener != 'function') {
                    return _removeEventListener.apply(this, args);
                    //unknown bug?
                }

                let eventChoice = getEventChoice(type);

                if (eventChoice ==2) {

                    phListeners = phListeners.then(() => {
                        const listeners = wmListeners.get(this);
                        if (listeners) {
                            let lh = new ListenerHandle(args[1], args[2]);
                            listeners[type].remove(lh);
                        }
                    })

                }

                return _removeEventListener.apply(this, args);

            }
            _prototype.addEventListener.toString = () => _addEventListener.toString();
            _prototype.removeEventListener.toString = () => _removeEventListener.toString();


        }


        function initShadowRoots(rootDoc) {
            function onReady() {
                var treeWalker = rootDoc.createTreeWalker(
                    rootDoc.documentElement,
                    NodeFilter.SHOW_ELEMENT, {
                        acceptNode: (node) => (node.shadowRoot ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP)
                    }
                );
                var nodeList = [];
                while (treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);
                for (const node of nodeList) {
                    initForShadowRoot(node.shadowRoot)
                }
            }
            if (rootDoc.readyState !== 'loading') {
                onReady();
            } else {
                rootDoc.addEventListener('DOMContentLoaded', onReady, false);
            }
        }

        function captureVideoEvents(rootDoc) {

        rootDocs.push(rootDoc)

            var g = function(evt) {


                var domElement = evt.target || this || null
                if (domElement && domElement.nodeType == 1 && domElement.nodeName == "VIDEO") {
                    var video = domElement
                    if (!domElement.getAttribute('_h5ppid')) handlerVideoFound(video);
                    if (domElement.getAttribute('_h5ppid')) {
                        switch (evt.type) {
                            case 'loadedmetadata':
                                return $hs.handlerVideoLoadedMetaData.call(video, evt);
                                //  case 'playing':
                                //      return $hs.handlerVideoPlaying.call(video, evt);
                                //  case 'pause':
                                //      return $hs.handlerVideoPause.call(video, evt);
                                //  case 'volumechange':
                                //      return $hs.handlerVideoVolumeChange.call(video, evt);
                        }
                    }
                }


            }

            // using capture phase
            rootDoc.addEventListener('loadedmetadata', g, $mb.eh_capture_passive());

        }

        function handlerVideoFound(video) {

            if (!video) return;
            if (video.getAttribute('_h5ppid')) return;

            const toSkip = (() => {
                //skip GIF video
                let alabel = video.getAttribute('aria-label')
                if (alabel && typeof alabel == "string" && alabel.toUpperCase() == "GIF") return true;

                //skip video with opacity
                const videoOpacity = video.style.opacity + ''
                if (videoOpacity.length > 0 && +videoOpacity < 0.99 && +videoOpacity >= 0) return true;

                //Google Result Video Preview
                let pElm = video;
                while (pElm && pElm.nodeType == 1) {
                    if (pElm.nodeName == "A" && pElm.getAttribute('href')) return true;
                    pElm = pElm.parentNode
                }
                pElm = null;
            })();

            if (toSkip) return;

            consoleLog('handlerVideoFound', video)

            $hs.intVideoInitCount = ($hs.intVideoInitCount || 0) + 1;
            consoleLog(' - HTML5 Video is detected -', `Number of Videos: ${$hs.intVideoInitCount}`)
            if ($hs.intVideoInitCount === 1) $hs.fireGlobalInit();

            let vpid = 'h5p-', vRootDoc=null;
            for(let wi=rootDocs.length;wi--;){
                if(rootDocs[wi].contains(video)){
                    vpid+=`${wi.toString(36)}-`;
                    vRootDoc=rootDocs[wi]
                    break;
                }
            }
            vpid += `${$hs.intVideoInitCount.toString(36)}`;

            video.setAttribute('_h5ppid', vpid)



            playerConfs[vpid] = new PlayerConf();
            playerConfs[vpid].domElement = video;
            playerConfs[vpid].domActive = DOM_ACTIVE_FOUND;

            let rootNode = getRoot(video);

            $vQuery.setVideo(vpid,video);

            if (rootNode.host) $hs.getPlayerBlockElement(video); // shadowing
            let rootElm = domAppender(rootNode) || document.documentElement //48763
            _add_filter(rootElm) // either main document or shadow node



            video.addEventListener('playing', $hs.handlerVideoPlaying, $mb.eh_capture_passive());
            video.addEventListener('pause', $hs.handlerVideoPause, $mb.eh_capture_passive());
            video.addEventListener('volumechange', $hs.handlerVideoVolumeChange, $mb.eh_capture_passive());



            //observe not fire twice for the same element.
            if (!$hs.observer_cacheSizing) $hs.observer_cacheSizing = new ResizeObserver($hs.handlerSizing);
            $hs.observer_cacheSizing.observe(video)



        }


        hackAttachShadow()
        hackCreateShadowRoot()
        hackEventListener()


        window.addEventListener('message', $hs.handlerWinMessage, false);
        $hs.bindDocEvents(document);
        captureVideoEvents(document);
        initShadowRoots(document);


        let windowsLD = (function() {
            let ls_res = [];
            try {
                ls_res = [!!window.localStorage, !!window.top.localStorage];
            } catch (e) {}
            try {
                let winp = window;
                let winc = 0;
                while (winp !== window.top && winp && ++winc) winp = winp.parentNode;
                ls_res.push(winc);
            } catch (e) {}
            return ls_res;
        })();

        consoleLogF('- h5Player Plugin Loaded -', ...windowsLD)

        function isInCrossOriginFrame() {
            let result = true;
            try {
                if (window.top.localStorage || window.top.location.href) result = false;
            } catch (e) {}
            return result
        }

        if (isInCrossOriginFrame()) consoleLog('cross origin frame detected');


        const $bv = {

            boostVideoPerformanceActivate: function() {
                if ($bz.boosted) return;
                $bz.boosted = true;
            },


            boostVideoPerformanceDeactivate: function() {
                if (!$bz.boosted) return;
                $bz.boosted = false;
            }

        }



    })();

})(window.unsafeWindow, window);