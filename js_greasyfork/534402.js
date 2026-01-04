// trimmed from https://github.com/barrer/tampermonkey-script/blob/master/translate/translate-dictionary.js

;const {
    PushContextMenu,
    PushIconAction,
    PushInitialFn,
    initContextMenu,
    initIconActions,
    request,
    parseKey,
    tapKeyboard,
    readClipboard,
    requestEx,
    getSelectionElement,
    buildOption,
    htmlSpecial,
    decodeHtmlSpecial,
    base64ToUint8Array,
} = (() => {
    if (!Array.prototype.filterAndMapX) {
        Object.defineProperty(Array.prototype, 'filterAndMapX', {
            value: function (fn) {
                const arr = [];
                for (const item of this) {
                    const r = fn(item);
                    if (r === false) {
                        continue
                    }
                    arr.push(r)
                }
                return arr;
            },
            writable: true,
        });
    }

    const contextMenuActions = [];
    const iconActions = [];
    const helperServerHost = GM_getValue('host', 'http://127.0.0.1:9999');
    const initialFns = [];

    function PushInitialFn(...fn) {
        initialFns.push(...fn);
    }

    function PushContextMenu(...fn) {
        contextMenuActions.push(...fn);
    }

    function PushIconAction(...fn) {
        iconActions.push(...fn);
    }

    function initContextMenu() {
        contextMenuActions.forEach(menu => {
            let fn = menu.action;
            if (typeof menu.action === 'string') {
                fn = () => {
                    request('keys=' + parseKey(menu.action), menu.path, menu.hasOwnProperty('call') ? menu.call : null)
                }
            } else if (typeof menu.action === 'object') {
                fn = () => {
                    request(menu.action, menu.path, menu.hasOwnProperty('call') ? menu.call : null)
                }
            }
            GM_registerMenuCommand(menu.title, () => {
                if (self === top) {
                    fn();
                }
            }, menu.key);
        })
    }

    function initIconActions() {
        String.prototype.replaceWithMap = function (m) {
            let s = this;
            Object.keys(k => {
                s = s.replaceAll(k, m[k]);
            })
            return s
        }
        /**样式*/
        const style = document.createElement('style');
        const fontSize = 14; // 字体大小
        const iconWidth = 300; // 整个面板宽度
        const iconHeight = 400; // 整个面板高度
        // 可以自定义的变量 <<<<< （自定义变量修改后把 “@version” 版本号改为 “10000” 防止更新后消失）
        const trContentWidth = iconWidth - 16; // 整个面板宽度 - 边距间隔 = 翻译正文宽度
        const trContentHeight = iconHeight - 35; // 整个面板高度 - 边距间隔 = 翻译正文高度
        const zIndex = '2147483647'; // 渲染图层
        style.textContent = GM_getResourceText('style').replaceWithMap({
            '${fontSize}': fontSize,
            '${zIndex}': zIndex,
            '${trContentWidth}': trContentWidth,
            '${trContentHeight}': trContentHeight,
        });
        // iframe 工具库
        const iframe = document.createElement('iframe');
        let iframeWin = null;
        iframe.style.display = 'none';
        let icon = document.createElement('tr-icon'); //翻译图标
        let content = document.createElement('tr-content'), // 内容面板
            contentList = document.createElement('div'), //翻译内容结果集（HTML内容）列表
            selected, // 当前选中文本
            pageX, // 图标显示的 X 坐标
            pageY; // 图标显示的 Y 坐标
        // 初始化内容面板
        content.appendChild(contentList);

        // 绑定图标拖动事件
        const iconDrag = new Drag(icon);
        // 图标数组
        let hideCalls = []
        // 添加翻译引擎图标
        iconActions.forEach(obj => {
            const img = document.createElement('img');
            img.setAttribute('src', obj.image);
            img.setAttribute('alt', obj.name);
            img.setAttribute('title', obj.name);
            img.setAttribute('icon-id', obj.id);
            if (obj.hasOwnProperty('trigger') && obj.trigger) {
                img.addEventListener('click', (event) => {
                    obj.trigger(selected, hideIcon, event);
                });
            }
            icon.appendChild(img);
            if (obj.hide) {
                hideCalls.push(obj.hide)
            }
            if (obj.hasOwnProperty('call') && obj.call) {
                obj.call(img, content);
            }
        });
        // 添加内容面板（放图标后面）
        icon.appendChild(content);
        // 添加样式、翻译图标到 DOM
        const root = document.createElement('div');
        document.documentElement.appendChild(root);
        const shadow = root.attachShadow({
            mode: 'closed'
        });
        // iframe 工具库加入 Shadow
        shadow.appendChild(iframe);
        iframeWin = iframe.contentWindow;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = createObjectURLWithTry(new Blob(['\ufeff', style.textContent], {
            type: 'text/css;charset=UTF-8'
        }));
        // 多种方式最大化兼容：Content Security Policy
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
        shadow.appendChild(style); // 内部样式表
        shadow.appendChild(link); // 外部样式表
        // 翻译图标加入 Shadow
        shadow.appendChild(icon);
        initialFns.length > 0 && initialFns.forEach(fn => fn(shadow));
        // 鼠标事件：防止选中的文本消失
        document.addEventListener('mousedown', function (e) {
            log('mousedown event:', e);
            if (e.target === icon || (e.target.parentNode && e.target.parentNode === icon)) { // 点击了翻译图标
                e.preventDefault();
            }
        });
        // 鼠标事件：防止选中的文本消失；显示、隐藏翻译图标
        document.addEventListener('mouseup', showIcon);
        // 选中变化事件
        document.addEventListener('selectionchange', showIcon);
        document.addEventListener('touchend', showIcon);

        /**日志输出*/
        function log() {
            const debug = false;
            if (!debug) {
                return;
            }
            if (arguments) {
                for (let i = 0; i < arguments.length; i++) {
                    console.log(arguments[i]);
                }
            }
        }

        function isInShadow(ele) {
            if (ele === root) {
                return true
            }
            if (!ele || !ele.hasOwnProperty('parentElement') || !ele.parentElement.TagName) {
                return false
            }
            const tag = ele.parentElement.TagName;
            if (tag === "TR-CONTENT") {
                return true
            }
            if (!tag) {
                return false
            }
            isInShadow(ele.parentElement);

        }

        /**鼠标拖动*/
        function Drag(element) {
            this.dragging = false;
            this.mouseDownPositionX = 0;
            this.mouseDownPositionY = 0;
            this.elementOriginalLeft = parseInt(element.style.left);
            this.elementOriginalTop = parseInt(element.style.top);
            const ref = this;
            this.startDrag = function (e) {
                if (e.target !== element) {
                    return
                }
                e.preventDefault();
                ref.dragging = true;
                ref.startDragTime = new Date().getTime();
                ref.mouseDownPositionX = e.clientX;
                ref.mouseDownPositionY = e.clientY;
                ref.elementOriginalLeft = parseInt(element.style.left);
                ref.elementOriginalTop = parseInt(element.style.top);
                // set mousemove event
                window.addEventListener('mousemove', ref.dragElement);
                log('startDrag');
            };
            this.unsetMouseMove = function () {
                // unset mousemove event
                window.removeEventListener('mousemove', ref.dragElement);
            };
            this.stopDrag = function (e) {
                e.preventDefault();
                ref.dragging = false;
                ref.stopDragTime = new Date().getTime();
                ref.unsetMouseMove();
                log('stopDrag');
            };
            this.dragElement = function (e) {
                log('dragging');
                if (!ref.dragging) {
                    return;
                }
                e.preventDefault();
                // move element
                element.style.left = ref.elementOriginalLeft + (e.clientX - ref.mouseDownPositionX) + 'px';
                element.style.top = ref.elementOriginalTop + (e.clientY - ref.mouseDownPositionY) + 'px';
                log('dragElement');
            };
            element.onmousedown = this.startDrag;
            element.onmouseup = this.stopDrag;
        }

        /**强制结束拖动*/
        function forceStopDrag() {
            if (iconDrag) {
                // 强制设置鼠标拖动事件结束，防止由于网页本身的其它鼠标事件冲突而导致没有侦测到：mouseup
                iconDrag.dragging = false;
                iconDrag.unsetMouseMove();
            }
        }

        // html 字符串转 DOM
        /**带异常处理的 createObjectURL*/
        function createObjectURLWithTry(blob) {
            try {
                return iframeWin.URL.createObjectURL(blob);
            } catch (error) {
                log(error);
            }
            return '';
        }

        /**显示 icon*/
        function showIcon(e) {
            log('showIcon event:', e);
            let offsetX = 4; // 横坐标翻译图标偏移
            let offsetY = 8; // 纵坐标翻译图标偏移
            // 更新翻译图标 X、Y 坐标
            if (e.pageX && e.pageY) { // 鼠标
                log('mouse pageX/Y');
                pageX = e.pageX;
                pageY = e.pageY;
            }
            if (e.changedTouches) { // 触屏
                if (e.changedTouches.length > 0) { // 多点触控选取第 1 个
                    log('touch pageX/Y');
                    pageX = e.changedTouches[0].pageX;
                    pageY = e.changedTouches[0].pageY;
                    // 触屏修改翻译图标偏移（Android、iOS 选中后的动作菜单一般在当前文字顶部，翻译图标则放到底部）
                    offsetX = -26; // 单个翻译图标块宽度
                    offsetY = 16 * 3; // 一般字体高度的 3 倍，距离系统自带动作菜单、选择光标太近会导致无法点按
                }
            }
            log('selected:' + selected + ', pageX:' + pageX + ', pageY:' + pageY)
            if (e.target === icon || (e.target.parentNode && e.target.parentNode === icon)) { // 点击了翻译图标
                e.preventDefault();
                return;
            }
            selected = window.getSelection().toString().trim(); // 当前选中文本
            log('selected:' + selected + ', icon display:' + icon.style.display);
            if (selected && icon.style.display !== 'block' && pageX && pageY) { // 显示翻译图标
                log('show icon');
                icon.style.top = pageY + offsetY + 'px';
                icon.style.left = pageX + offsetX + 'px';
                icon.style.display = 'block';
                // 兼容部分 Content Security Policy
                icon.style.position = 'absolute';
                icon.style.zIndex = zIndex;
            } else if (!selected && e.target !== document && !isInShadow(e.target)) { // 隐藏翻译图标
                log('hide icon');
                hideIcon();
            }
        }

        /**隐藏 icon*/
        function hideIcon() {
            icon.style.display = 'none';
            content.style.display = 'none';
            pageX = 0;
            pageY = 0;
            forceStopDrag();
            if (hideCalls.length > 0) {
                hideCalls.forEach(fn => {
                    fn(icon)
                })
            }
        }
    }

    async function request(data, path = '', call = null) {
        data = data ? buildData(data, path) : '';
        if (path !== '' && path[0] !== '/') {
            path = '/' + path;
        }
        await GM_xmlhttpRequest({
            method: "POST",
            url: helperServerHost + path,
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function (res) {
                if (call) {
                    call(res);
                }
            },
            onerror: function (res) {
                console.log(res);
            },
            onabort: function (res) {
                console.log(res);
            }
        });
    }

    function parseKey(key) {
        key = key.trim()
        if (key.indexOf('[') > -1) {
            return key
        }
        const keys = key.split(',').map(v => {
            v = v.trim()
            const vv = v.split(' ')
            if (vv.length > 1) {
                const k = vv[vv.length - 1]
                let kk = vv.slice(0, vv.length - 1)
                kk.unshift(k)
                return kk
            }
            return vv
        })
        return JSON.stringify(keys)
    }

    function buildData(data) {
        if (typeof data === 'object') {
            data = Object.keys(data).map(k => {
                if (data[k] instanceof Array) {
                    return data[k].map(v => k + '=' + encodeURIComponent(v)).join('&')
                }
                return k + '=' + encodeURIComponent(data[k])
            }).join('&');
        }
        return data
    }

    async function tapKeyboard(keys) {
        await request('keys=' + parseKey(keys))
    }

    async function readClipboard(type = 0) {
        const {responseText: text} = await requestEx(helperServerHost + '/clipboard?type=' + (type === 1 ? 'img' : 'text'));
        return text
    }

    async function requestEx(url, data = '', options = {}) {
        data = buildData(data)
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url: url,
                data: data,
                method: 'GET',
                onload: function (res) {
                    return resolve(res)
                },
                onerror: function (res) {
                    reject(res)
                },
                ...options
            });
        })

    }

    function getSelectionElement() {
        const selectionObj = window.getSelection();
        const rangeObj = selectionObj.getRangeAt(0);
        const docFragment = rangeObj.cloneContents();
        const div = document.createElement("div");
        div.appendChild(docFragment);
        return div
    }

    /**
     *
     * @param arr ['', {} , [], ...]
     * @param select selected value or values
     * @param key option value field or index
     * @param val option innerText field or index
     * @param attr option other attributes
     * @returns {*} options string
     */
    function buildOption(arr, select = '', key = 'k', val = 'v', attr = null) {
        const sels = new Set();
        if (Array.isArray(select)) {
            select.forEach(sels.add);
        } else if (select) {
            sels.add(select);
        }
        return arr.map(v => {
            let att = '', sel = '';
            if (attr !== null && v[attr] && typeof v[attr] === 'object') {
                att = Object.keys(v[attr]).map(k => `${k}="${v[attr][k]}"`).join(' ');
            }
            if (typeof v === 'string' || typeof v === 'number') {
                sel = sels.has(v) ? 'selected' : '';
                return `<option ${att} ${sel} value="${v}">${v}</option>`
            } else if (typeof v === 'object' || v instanceof Array) {
                sel = sels.has(v[key]) ? 'selected' : '';
                return `<option ${att} ${sel} value="${v[key]}">${v[val]}</option>`
            }
            return ''
        }).join('\n');
    }

    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    const entityMap2 = Object.keys(entityMap).reduce((pre, cur) => {
        pre[entityMap[cur]] = cur
        return pre
    }, {});

    function htmlSpecial(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }

    function decodeHtmlSpecial(string) {
        return String(string).replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);/ig, function (s) {
            return entityMap2[s];
        });
    }

    function base64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    return {
        PushContextMenu,
        PushIconAction,
        PushInitialFn,
        initContextMenu,
        initIconActions,
        request,
        parseKey,
        tapKeyboard,
        readClipboard,
        requestEx,
        getSelectionElement,
        buildOption,
        htmlSpecial,
        decodeHtmlSpecial,
        base64ToUint8Array,
    }
})();

