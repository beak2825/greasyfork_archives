class global_module {
    static UrlCache = {};

    /**
     *
     * @param {*} selector 目标元素选择器
     * @param {*} iframe  可选-iframe选择器 可以是字符串选择器或者元素
     * @param {*} callback 可选-回调函数
     * @param {*} time  可选-每次查询间隔时间
     * @param {*} timeout  可选-超时时间
     * @param {*} baseElement  可选-基础元素 可以是字符串选择器或者元素
     * @returns
     */
    static async waitForElement(selectors, iframe = null, callback = null, time = 100, timeout = 1000 * 30, baseElement = null, index = null, isWrapped = true, startTime = null) {
        if (time == null) {
            time = 100;
        }
        if (timeout == null) {
            timeout = 1000 * 30;
        }
        if (isWrapped == null) {
            isWrapped = true;
        }
        return new Promise(async (resolve) => {
            if (!startTime) {
                startTime = Date.now();
            }
            let iframeElement,
                base,
                elements = [];
            if (typeof selectors === 'string') {
                selectors = [selectors];
            }
            if (iframe) {
                try {
                    iframeElement = iframe.getAttribute('id');
                    iframeElement = iframe;
                } catch (e) {
                    if (typeof iframe === 'string') {
                        iframeElement = await global_module.waitForElement(iframe);
                    } else {
                        iframeElement = iframe;
                    }
                }
                if (!iframeElement) {
                    resolve(null);
                    return;
                }
                for (let selector of selectors) {
                    let foundElements = isWrapped ? $(iframeElement).contents().find(selector) : iframeElement.contentDocument.querySelectorAll(selector);
                    if (foundElements.length > 0) {
                        elements = foundElements;
                        break;
                    }
                }
            } else if (baseElement) {
                try {
                    base = baseElement.getAttribute('id');
                    base = baseElement;
                } catch (e) {
                    if (typeof baseElement === 'string') {
                        base = await global_module.waitForElement(baseElement);
                    } else {
                        base = baseElement;
                    }
                }
                if (!base) {
                    resolve(null);
                    return;
                }
                for (let selector of selectors) {
                    let foundElements = isWrapped ? base.find(selector) : base[0].querySelectorAll(selector);
                    if (foundElements.length > 0) {
                        elements = foundElements;
                        break;
                    }
                }
            } else {
                for (let selector of selectors) {
                    let foundElements = null;
                    try {
                        foundElements = document.querySelectorAll(selector);
                    } catch (e) {
                        foundElements = $(selector);
                        if (foundElements.length != 0) {
                            foundElements = [foundElements.eq(0)[0]];
                        }
                    }
                    if (foundElements.length > 0) {
                        elements = foundElements;
                        break;
                    }
                }
            }

            if (index != null) {
                elements = elements[index];
                if (!elements) {
                    resolve(null);
                    return;
                }
            }

            if (elements.length > 0) {
                if (isWrapped) {
                    elements = $(elements);
                }
                if (callback) {
                    callback(elements);
                }
                resolve(elements);
            } else {
                if (timeout !== -1 && Date.now() - startTime >= timeout) {
                    resolve(null);
                    return;
                }
                setTimeout(async () => {
                    resolve(await global_module.waitForElement(selectors, iframe, callback, time, timeout, baseElement, index, isWrapped, startTime));
                }, time);
            }
        });
    }

    static copyText(text) {
        let textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
    }

    static stripHtmlTags(html) {
        return html.replace(/<[^>]+>/g, '');
    }

    static async Http(o) {
        return new Promise((resolve) => {
            if (typeof o === 'undefined' || typeof o !== 'object' || typeof o.url === 'undefined') {
                resolve(null);
            }
            if (typeof o.method === 'undefined') {
                o.method = 'GET';
            }
            if (typeof o.headers === 'undefined') {
                o.headers = {};
            }
            if (typeof o.data === 'undefined') {
                o.data = '';
            }
            if (typeof o.timeout === 'undefined') {
                o.timeout = 10000;
            }
            let res = { code: 0, ret: null };
            if (!GM_xmlhttpRequest) {
                let xhr = new XMLHttpRequest();
                xhr.open(o.method, o.url, true);
                for (let i in o.headers) {
                    xhr.setRequestHeader(i, o.headers[i]);
                }
                xhr.timeout = o.timeout;
                xhr.onload = function () {
                    res.code = xhr.status;
                    res.ret = xhr.response;
                    resolve(res);
                };
                xhr.onerror = function (err) {
                    res.code = -1;
                    res.ret = err;
                    resolve(res);
                };
                xhr.send(o.data);
            } else {
                GM_xmlhttpRequest({
                    method: o.method,
                    url: o.url,
                    headers: o.headers,
                    data: o.data,
                    timeout: o.timeout,
                    onload: function (response) {
                        res.code = response.status;
                        res.ret = response;
                        resolve(res);
                    },
                    onerror: function (err) {
                        res.code = -1;
                        res.ret = err;
                        resolve(res);
                    }
                });
            }
        });
    }

    static async Ajax_Xhr(url, Way, data) {
        return new Promise(function (resolve) {
            let h = ['html', 'txt', 'json', 'xml', 'js', 'css'];
            if (global_module.UrlCache[url] == null) {
                if (h.indexOf(Way) == -1) {
                    Way = 'GET';
                }
                let xhr = new XMLHttpRequest();
                xhr.open(Way, url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        let ret = xhr.responseText;
                        let p = url;
                        if (p.indexOf('?') != -1) p = p.substring(0, p.indexOf('?'));
                        p = p.substring(p.lastIndexOf('.') + 1);
                        if (h.indexOf(p) != -1) {
                            global_module.UrlCache[url] = ret;
                        }
                        resolve(ret);
                        return ret;
                    }
                };
                xhr.send(data);
            } else {
                resolve(global_module.UrlCache[url]);
                return global_module.UrlCache[url];
            }
        })
            .then(function (result) {
                return result;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    static decodeHtmlEntities(htmlString = '') {
        var tempElement = document.createElement('div');
        tempElement.innerHTML = htmlString;
        return tempElement.textContent;
    }

    static GetUrlParm(href = null, name) {
        if (href == null) {
            href = location.href;
        }
        let parms = href.substring(href.indexOf('?') + 1);
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let r = parms.match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }

    static downloadSvgAsPng(svg, filename) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var svgRect = svg.getBoundingClientRect();
        var width = svgRect.width;
        var height = svgRect.height;
        canvas.width = width;
        canvas.height = height;
        var image = new Image();
        var svgData = new XMLSerializer().serializeToString(svg);
        var svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        image.onload = function () {
            context.drawImage(image, 0, 0, width, height);
            var link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = filename;
            link.click();
            canvas = null;
        };
        image.src = svgUrl;
    }

    static SetUrlParm(href, name, value) {
        if (href == null || href == '') {
            href = location.href;
        }
        let index = href.indexOf('?');
        if (index == -1) {
            href += '?' + name + '=' + value;
        } else {
            let parms = href.substring(href.indexOf('?') + 1);
            let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            let r = parms.match(reg);
            if (r != null) {
                href = href.replace(r[0], r[0].replace(r[2], value));
            } else {
                href += '&' + name + '=' + value;
            }
        }
        return href;
    }

    // 根据扩展名引入js或css
    static async LoadJsOrCss(url, scriptStr = '') {
        return new Promise(function (resolve) {
            if (Array.isArray(url)) {
                let count = 0;
                for (let i = 0; i < url.length; i++) {
                    global_module.LoadJsOrCss(url[i]).then(() => {
                        count++;
                        if (count == url.length) {
                            resolve();
                        }
                    });
                }
                return;
            }
            let p = url;
            let s = 0;
            if (p.indexOf('?') != -1) p = p.substring(0, p.indexOf('?'));
            p = p.substring(p.lastIndexOf('.') + 1);
            let t;
            if (p == 'js') {
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.id = url;
                if (scriptStr == '') {
                    script.src = url;
                } else {
                    script.innerHTML = scriptStr;
                    s = 1;
                }
                t = script;
            } else if (p == 'css') {
                if (scriptStr == '') {
                    let link = document.createElement('link');
                    link.href = url;
                    link.type = 'text/css';
                    link.rel = 'stylesheet';
                    link.id = url;
                    t = link;
                } else {
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.id = url;
                    style.innerHTML = scriptStr;
                    t = style;
                    s = 1;
                }
            }
            if (t != null) {
                t.onload = function () {
                    resolve(t);
                };
            } else {
                resolve(null);
            }
            try {
                document.getElementsByTagName('head')[0].appendChild(t);
            } catch (e) {
                document.appendChild(t);
            }
            if (s != 0) {
                resolve(null);
            }
        })
            .then(function (r) {
                return r;
            })
            .catch(function (e) {
                console.log(e);
            });
    }

    static RemoveJsOrCss(url) {
        $("[id='" + url + "']").remove();
    }

    static IframeInjectScript(element, type = 'js', Str) {
        let Dom = $(element).contents().find('body');
        if (type == 'js') {
            $(element)[0].contentWindow.window.eval(Str);
        } else if (type == 'css') {
            Dom.append('<style>' + Str + '</style>');
        }
    }

    static async waitPageLoad() {
        return new Promise(function (resolve) {
            if (document.readyState == 'complete') {
                resolve();
            } else {
                let S = setInterval(function () {
                    if (document.readyState == 'complete') {
                        clearInterval(S);
                        resolve();
                    }
                }, 200);
            }
        });
    }

    static HOOKFunction(fun, before, after) {
        if (typeof fun == 'string') {
            return 'HOOK的对象必须是函数';
        }
        let old = fun;
        fun = function () {
            if (typeof before == 'function') {
                before();
            }
            let result = old.apply(this, arguments);
            if (typeof after == 'function') {
                after();
            }
            return result;
        };
        return fun;
    }

    static getParentFolderPath(filePath) {
        var pathSeparator;
        if (filePath.indexOf('/') !== -1) {
            pathSeparator = '/';
        } else if (filePath.indexOf('\\') !== -1) {
            pathSeparator = '\\';
        } else if (filePath.indexOf('\\\\') !== -1) {
            pathSeparator = '\\\\';
        }
        var parts = filePath.split(pathSeparator);
        parts.pop();
        return parts.join(pathSeparator);
    }

    static RandomIP() {
        let ip = '';
        for (let i = 0; i < 4; i++) {
            ip += Math.floor(Math.random() * 255) + '.';
        }
        ip = ip.substring(0, ip.length - 1);
        return ip;
    }

    static RandomIPHeader() {
        let ip = this.RandomIP();
        let header = {
            'X-Forwarded-For': ip,
            'X-Originating-IP': ip,
            'X-Remote-Addr': ip,
            'X-Remote-IP': ip
        };
        return header;
    }

    static MoveElement(obj, GoToX, speed = 10, scope = null) {
        return new Promise(async (resolve) => {
            if (obj == null) {
                resolve(false);
                return;
            }
            if (obj.length > 0) obj = obj[0];
            let event = document.createEvent('MouseEvents');
            if (scope == null) {
                scope = window;
            }
            event.initMouseEvent('mousedown', true, true, scope, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            obj.dispatchEvent(event);
            let x = 0;
            let timer = setInterval(function () {
                x += 5;
                let event = document.createEvent('MouseEvents');
                event.initMouseEvent('mousemove', true, true, scope, 0, 0, 0, x, 0, false, false, false, false, 0, null);
                obj.dispatchEvent(event);
                if (x >= GoToX) {
                    clearInterval(timer);
                    let event = document.createEvent('MouseEvents');
                    event.initMouseEvent('mouseup', true, true, scope, 0, 0, 0, 260, 0, false, false, false, false, 0, null);
                    obj.dispatchEvent(event);
                    resolve(true);
                }
            }, speed);
        });
    }

    static clickElement(element) {
        if (element == null) return false;
        let Event = document.createEvent('MouseEvents');
        Event.initEvent('click', true, true);
        element.dispatchEvent(Event);
        return true;
    }

    static simulateMouseEvent(mouseEvent, win, element, eventType) {
        if (!mouseEvent) {
            mouseEvent = MouseEvent;
        }
        if (!win) {
            win = window;
        }
        let eventName = '';
        switch (eventType) {
            case 0:
                eventName = ['mouseover', 'mouseenter'];
                break;
            case 1:
                eventName = ['mouseout', 'mouseleave'];
                break;
            default:
                throw new Error('不支持的触发类型');
        }
        for (let i = 0; i < eventName.length; i++) {
            element.dispatchEvent(
                new MouseEvent(eventName[i], {
                    bubbles: true,
                    cancelable: true,
                    view: win
                })
            );
        }
    }

    static getLayerelement(layeri) {
        return $("div[id^='layui-layer" + layeri + "'][type][times='" + layeri + "']").eq(0);
    }

    static getLayerelementIframe(layeri) {
        return global_module.getLayerelement(layeri).find('iframe').eq(0);
    }

    static getLayerelementIframeBody(layeri) {
        return global_module.getLayerelementIframe(layeri).contents().find('body');
    }

    static getLayerBtn(layeri, index) {
        return global_module.getLayerelement(layeri).find("a[class^='layui-layer-btn']").eq(index);
    }

    static setLayerImgPath(layeri, Path) {
        if (Path.substr(-1) != '/' && Path.substr(-1) != '\\') {
            if (Path.indexOf('/') != -1) {
                Path += '/';
            } else {
                Path += '\\';
            }
        }
        let element = global_module.getLayerelement(layeri);
        let i = $(element).find('i');
        for (let m = 0; m < i.length; m++) {
            let className = $(i[m]).attr('class');
            if (className.indexOf('ico') == -1) {
                continue;
            }
            let bg = $(i[m]).css('background-image');
            let bgPath = bg.substring(bg.indexOf('(') + 1, bg.indexOf(')'));
            let fileName = bgPath.substring(bgPath.lastIndexOf('/') + 1);
            fileName = fileName.replace(/\"/g, '').replace(/\'/g, '');
            $(i[m]).css('background-image', 'url(' + Path + fileName + ')');
        }
    }

    static async simulateKeydown(ele, key, interval = 200) {
        return new Promise(function (resolve) {
            if (key.length == 0) {
                resolve();
                return;
            }
            if (ele == null) {
                resolve();
                return;
            }
            key = key.toLowerCase();
            let keys = key.split('+');
            let event;
            if (typeof Event === 'function') {
                event = new Event('keydown');
            } else {
                event = document.createEvent('Event');
                event.initEvent('keydown', true, true);
            }
            event.key = keys[keys.length - 1];
            for (let i = 0; i < keys.length - 1; i++) {
                event[keys[i] + 'Key'] = true;
            }
            ele.dispatchEvent(event);
            setTimeout(() => {
                let event;
                if (typeof Event === 'function') {
                    event = new Event('keyup');
                } else {
                    event = document.createEvent('Event');
                    event.initEvent('keyup', true, true);
                }
                event.key = keys[keys.length - 1];
                for (let i = 0; i < keys.length - 1; i++) {
                    event[keys[i] + 'Key'] = false;
                }
                ele.dispatchEvent(event);
                resolve();
            }, interval);
        });
    }

    static debounce(fn, delay) {
        let timeoutId;
        let promiseResolve;
        let promise = new Promise((resolve) => (promiseResolve = resolve));
        return function () {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(async () => {
                timeoutId = null;
                if (fn.constructor.name === 'AsyncFunction') {
                    let result = await fn.apply(this, arguments);
                    promiseResolve(result);
                } else {
                    let result = fn.apply(this, arguments);
                    promiseResolve(result);
                }
            }, delay);

            return promise;
        };
    }

    static observeDomChanges(ele = null, callback, MutationObserverFunction = null) {
        if (MutationObserverFunction == null || typeof MutationObserverFunction != 'function') {
            MutationObserverFunction = MutationObserver;
        }
        const observer = new MutationObserverFunction(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'childList' && mutation.target.getAttribute('data-inserted-append') == null) {
                    callback(mutation.target);
                }
            });
        });
        const options = {
            childList: true,
            subtree: true,
            characterData: true,
            attributeFilter: ['data-inserted-append']
        };
        if (ele == null) {
            ele = document;
        }
        observer.observe(ele, options);
    }

    static getRandomString(len) {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    static getRandomNumber(len) {
        let $chars = '0123456789';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    static hideAndCreateDom(Element) {
        let dom = $(Element).eq(0);
        $(dom).hide();
        let clone = $(dom).clone();
        $(dom).after(clone);
        clone.show();
        return clone;
    }

    static cloneAndHide(target, InsertMethod = 0, BaseElement = null) {
        if (InsertMethod == null) {
            InsertMethod = 0;
        }
        let clone = document.createElement(target.tagName);
        let attributes = target.attributes;
        for (let i = 0; i < attributes.length; i++) {
            clone.setAttribute(attributes[i].name, attributes[i].value);
        }
        let childNodes = target.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            clone.appendChild(childNodes[i].cloneNode(true));
        }
        target.style.display = 'none';
        let parent;
        if (BaseElement !== null) {
            parent = BaseElement;
        } else {
            parent = target.parentNode;
        }
        switch (InsertMethod) {
            case 0:
                parent.appendChild(clone);
                break;
            case 1:
                parent.insertBefore(clone, target.nextSibling);
                break;
            case 2:
                parent.insertBefore(clone, target);
                break;
            default:
                parent.appendChild(clone);
        }
        return clone;
    }

    static async AnimateText(ele, text, Delay = 100) {
        return new Promise(function (resolve) {
            let currentText = '';
            let i = 0;
            let height = ele.parent().css('height');
            if (height == null) {
                resolve();
                return;
            }
            height = height.substring(0, height.length - 2) - 22 + 'px';
            let cursor;
            cursor = document.createElement('span');
            cursor.classList.add('cursor');
            cursor.style.backgroundColor = '#fff';
            cursor.style.width = '3px';
            cursor.style.height = height;
            cursor.style.display = 'inline-block';
            cursor.style.animation = 'blink 1s step-end infinite';
            let interval = setInterval(() => {
                currentText += text[i];
                ele.text(currentText);
                ele.append(cursor);
                i++;
                if (i === text.length) {
                    clearInterval(interval);
                    resolve();
                    setTimeout(() => {
                        cursor.remove();
                    }, 200);
                }
            }, Delay);
        });
    }

    static getMiddleString(str, start, end) {
        return str.substring(str.indexOf(start) + 1, str.indexOf(end));
    }

    static Cookie = {
        clearAllCookies: function (domain) {
            var cookies = document.cookie.split('; ');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf('=');
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                var cookieDomain = location.hostname.replace(/^www\./i, '');
                if (cookieDomain === domain || cookieDomain.endsWith('.' + domain)) {
                    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=' + cookieDomain + ';path=/';
                }
            }
        },
        get: function (name) {
            let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match && decodeURIComponent(match[2]);
        },
        set: function (name, value, days) {
            if (days == null) {
                days = 1;
            }
            let d = new Date();
            d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
            document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString();
        },
        delete: function (name) {
            this.set(name, '', -1);
        },
        clear: function () {
            for (let key in this.get()) {
                this.delete(key);
            }
            let domain = location.hostname.replace(/^www\./i, '');
            this.clearAllCookies(domain);
        }
    };

    static objectDepthEnumerate(_object, callback) {
        if (Array.isArray(_object)) {
            _object.forEach((item) => {
                if (callback && callback(null, item)) {
                    return true;
                }
                if (this.objectDepthEnumerate(item, callback)) {
                    return true;
                }
            });
        } else if (typeof _object === 'object' && _object !== null) {
            Object.keys(_object).forEach((key) => {
                if (callback && callback(key, _object[key])) {
                    return true;
                }
                if (this.objectDepthEnumerate(_object[key], callback)) {
                    return true;
                }
            });
        }
    }

    static LocalStorage = {
        exportLocalStorage: function () {
            let localStorageData = {};
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                let value = localStorage.getItem(key);
                localStorageData[key] = value;
            }
            let jsonString = JSON.stringify(localStorageData, null, 2);
            return jsonString;
        },
        importLocalStorage: function (localStorageString) {
            let localStorageData = JSON.parse(localStorageString);
            for (let key in localStorageData) {
                localStorage.setItem(key, localStorageData[key]);
            }
        }
    };

    static Mail = {
        getHost: function () {
            return 'https://www.mohmal.com/';
        },
        getInboxUrl: function () {
            return this.getHost() + 'zh/inbox';
        },
        getChangeUrl: function () {
            return this.getHost() + 'zh/change';
        },
        getMesssageUrl: function () {
            return this.getHost() + 'zh/message/';
        },
        Change: async function () {
            return new Promise(async (resolve) => {
                await global_module.Http({ method: 'GET', url: this.getChangeUrl() });
                let r = await global_module.Http({ method: 'GET', url: this.getInboxUrl() });
                resolve(this.getEMail(r.ret.responseText));
            });
        },
        getEMail: function (html) {
            let emailDom = $('<div></div>').html(html).eq(0).find('[data-email]').eq(0);
            if (!emailDom) {
                return null;
            }
            if (!emailDom.text()) {
                return null;
            }
            let email = emailDom.attr('data-email');
            return email;
        },
        analyzeMails: function (html) {
            let _that = this;
            return new Promise(async (resolve) => {
                let Tasks = [];
                let MailMsg = [];
                let msgIds = $(html).find('tr[data-msg-id]');
                for (let i = 0; i < msgIds.length; i++) {
                    let that = $(msgIds[i]);
                    let msgId = that.attr('data-msg-id');
                    let sender = that.find('td[class="sender"]').eq(0).find('a').text();
                    let time = that.find('td[class="time"]').eq(0).find('a').text();
                    let url = _that.getMesssageUrl() + msgId;
                    let task = function () {
                        return new Promise(async (resolve) => {
                            let res = await global_module.Http({ method: 'GET', url: url });
                            let msgDom = $('<div></div>').html(res.ret.responseText).eq(0);
                            let msgDomHtml = msgDom.html();
                            let msgDomText = msgDom.text();
                            let obj = { msgId, time, url, res, sender, html: msgDomHtml, text: msgDomText };
                            MailMsg.push(obj);
                            resolve();
                        });
                    };
                    Tasks.push(task());
                }
                await Promise.all(Tasks);
                resolve(MailMsg);
            });
        },
        getMails: async function () {
            return new Promise(async (resolve) => {
                let res = await global_module.Http({ method: 'GET', url: this.getInboxUrl() });
                if (res.code === -1) {
                    let r = await this.getMail();
                    resolve(r);
                    return;
                }
                if (res.code != 200) {
                    new Error('Failed to get the verification code, please try again later!');
                    resolve(null);
                    return;
                }
                let html = $('<div></div>').html(res.ret.responseText);
                let NoMessages = html.find('tr.no-messages').eq(0);
                if (NoMessages.length !== 0) {
                    resolve([]);
                    return;
                }
                let r = await this.analyzeMails(html);
                resolve(r);
            });
        }
    };

    static AnalogInput = {
        clickElement: function (el) {
            if (!el || (el && 'function' !== typeof el.click)) {
                return false;
            }
            el.click();
            return true;
        },
        doFocusElement: function (el, setValue) {
            if (setValue) {
                let existingValue = el.value;
                el.focus();
                el.value !== existingValue && (el.value = existingValue);
            } else {
                el.focus();
            }
        },
        normalizeEvent: function (el, eventName) {
            let ev;
            if ('KeyboardEvent' in window) {
                ev = new window.KeyboardEvent(eventName, {
                    bubbles: true,
                    cancelable: false
                });
            } else {
                ev = el.ownerDocument.createEvent('Events');
                ev.initEvent(eventName, true, false);
                ev.charCode = 0;
                ev.keyCode = 0;
                ev.which = 0;
                ev.srcElement = el;
                ev.target = el;
            }
            return ev;
        },
        setValueForElement: function (el) {
            let valueToSet = el.value;
            this.clickElement(el);
            this.doFocusElement(el, false);
            el.dispatchEvent(this.normalizeEvent(el, 'keydown'));
            el.dispatchEvent(this.normalizeEvent(el, 'keypress'));
            el.dispatchEvent(this.normalizeEvent(el, 'keyup'));
            el.value !== valueToSet && (el.value = valueToSet);
        },
        setValueForElementByEvent: function (el) {
            let valueToSet = el.value,
                ev1 = el.ownerDocument.createEvent('HTMLEvents'),
                ev2 = el.ownerDocument.createEvent('HTMLEvents');
            el.dispatchEvent(this.normalizeEvent(el, 'keydown'));
            el.dispatchEvent(this.normalizeEvent(el, 'keypress'));
            el.dispatchEvent(this.normalizeEvent(el, 'keyup'));
            ev2.initEvent('input', true, true);
            el.dispatchEvent(ev2);
            ev1.initEvent('change', true, true);
            el.dispatchEvent(ev1);
            el.blur();
            el.value !== valueToSet && (el.value = valueToSet);
        },
        doAllFillOperations: function (el, afterValSetFunc) {
            this.setValueForElement(el);
            if (typeof afterValSetFunc == 'function') {
                afterValSetFunc(el);
            }
            this.setValueForElementByEvent(el);
        },
        AnalogInput: function (el, op) {
            el.value == op ||
                this.doAllFillOperations(el, function (theEl) {
                    if (!theEl.type && theEl.tagName.toLowerCase() === 'span') {
                        theEl.innerText = op;
                        return;
                    }
                    theEl.value = op;
                });
        },
        AnalogInput2: function (inputElement, inputString) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            const inputEvent = new Event('input', { bubbles: true });
            inputElement.focus();
            inputElement.value = '';
            for (let i = 0; i < inputString.length; i++) {
                const char = inputString[i];
                nativeInputValueSetter.call(inputElement, inputElement.value + char);
                inputElement.dispatchEvent(inputEvent);
            }
        }
    };
}

try {
    window['global_module'] = global_module;
} catch (e) {}
try {
    module.exports = global_module;
} catch (e) {}
