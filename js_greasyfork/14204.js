// ==UserScript==
// @name  [ js.firewall.js ]
// @description JS前端安全防火墙; CSP策略/内容保护/XSS扫描/安全告警
// @namespace js.firewall.js
// @version 0.0.1
// @author  vc1
// @downloadURL https://update.greasyfork.org/scripts/14204/%5B%20jsfirewalljs%20%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/14204/%5B%20jsfirewalljs%20%5D.meta.js
// ==/UserScript==



;
(function (name, ctx) {

    /*
     *
     *  [ js.firewall.js ]
     *
     *  JS前端安全防火墙
     *
     *  * CSP 策略
     *  * 内容保护
     *  * XSS 扫描
     *  * 安全告警
     *
     *  * 2015-11-25
     *  * vc1
     *
     */

    'use stric';

    var definition = (function () {
        (function (URL, DOMParser) {

            var unsafeWindow = unsafeWindow || window.parent || window;
            window.unsafeWindow = unsafeWindow;
            var config = unsafeWindow.JFW_config;
            var hook = window.js_hook_js;
            if (!config || !hook) return;

            timeStart('js_csp_fw');



            /////////////// 以下配置不需要做特别改动 //////////////

            // 生成随机字符，作为本次浏览网页的id
            var token = getRandom();


            // 只检查产生请求的协议，忽略chrome-extension等其他协议
            var check_protocol = /^(https?|ftp|wss?)/;


            // 选项组对应的元素
            var csp_group = {
                'script-src': ['script'],
                'style-src': ['link'],
                'anchor-src': ['a'],
                'img-src': ['img'],
                'frame-src': ['frame', 'iframe', 'XFrameOption'],
                'media-src': ['video', 'audio', 'source', 'track'],
                'object-src': ['object', 'embed', 'applet'],
                'connect-src': ['XMLHttpRequest', 'WebSocket', 'EventSource']
            };



            // 需要审计的元素上的属性
            var leak_element = {
                'a': ['href', 'ping'],
                'img': ['src', 'srcset'],
                'link': ['src'],
                'script': ['src'],
                'iframe': ['src', 'longdesc', 'srcdoc'],
                'embed': ['src'],
                'frame': ['src'],
                'source': ['src', 'srcset'],
                'audio': ['src'],
                'track': ['src'],
                'area': ['src'],
                'object': ['src'],
                'param': ['value'],
                'base': ['href']
            };

            var leakElementSelector = getSelector();

            config.warn_api = config.warn_api;
            config.enabled = config.enabled || '';

            var csp = config.csp;
            var white_host = config.white_host;
            white_host += ' localhost 127.0.0.1 ' + unsafeWindow.location.hostname + ' ' + new URL(config.warn_api, unsafeWindow.location.href).hostname;

            // 被拦截后替换成无害的URL
            var placeholderURL = getPlaceholderURL();

            csp = csp2reg();


            var csp_element = kv2vk(csp_group, true),
                leak_attr = kv2vk(leak_element),
                httpOnly_reg = str2reg(config.httpOnly);

            //////////////////////////////////////

            // 要检查的元素生成css选择器
            function getSelector() {
                var selectors = [];
                for (var tagName in leak_element) {
                    var attrs = leak_element[tagName];
                    for (var i in attrs) {
                        selectors.push(tagName + '[' + attrs[i] + ']');
                    }
                }
                return selectors.join(',');
            }

            // 获取屏蔽后的默认url
            function getPlaceholderURL() {
                var placeholderURL = {};
                var defaultRule = csp['default-src'];
                var default_url = typeof defaultRule.slice(-1)[0] === 'string' &&
                    defaultRule.pop() || 'about:blank';

                for (var group_name in csp) {
                    var rules = csp[group_name];
                    var url = typeof rules.slice(-1)[0] === 'string' &&
                        rules.pop() || default_url;
                    placeholderURL[group_name] = url;
                    for (var i in csp_group[group_name]) {
                        var tagName = csp_group[group_name][i];
                        placeholderURL[tagName] = url;
                    }
                }

                return placeholderURL;
            }

            // 处理csp规则
            function csp2reg() {
                for (var group_name in csp) {
                    var group = csp[group_name];
                    for (var i in group) {
                        var rule = group[i];
                        if (rule.length == 1) rule.push('accept ');
                        rule[0] = rule[0].replace('white_host', white_host);
                        rule[0] = str2reg(rule[0]);
                        rule[1] = rule[1].toLowerCase();
                    }
                }
                return csp;
            }


            ////////////// 基础工具类 /////////////

            // 获取对象详细的类型
            function objType(o) {
                return o && o.__proto__.constructor.name;
            }

            // 类数组转数组
            function toArray(obj) {
                return Array.prototype.slice.call(obj);
            }

            // 两个对象合并
            function objExtend(destination, source) {
                for (property in source) {
                    if (source.hasOwnProperty(property))
                        destination[property] = source[property];
                }
                return destination;
            }

            // 浅拷贝
            function objCopy(obj) {
                return objExtend({}, objCopy);
            }

            // 数组去重
            function unique(array) {
                var n = [];
                for (var i = 0; i < array.length; i++) {
                    if (!~n.indexOf(array[i])) n.push(array[i]);
                }
                return n;
            }


            //{'x':['a']} 转 {'a':[x]}
            function kv2vk(obj, unique) {
                var map = {};
                for (var e in obj) {
                    var array = obj[e];
                    for (var i in array) {
                        var a = array[i];
                        if (unique) {
                            map[a] = e;
                        } else {
                            map[a] = map[a] || [];
                            !~map[a].indexOf(e) || map[a].push(e);
                        }
                    }
                }
                return map;
            }

            // 字符串转正则
            function str2reg(str) {
                var regstr = '^(' + str.toLowerCase().split(/\s+/).map(function (domain) {
                    return domain.replace(/\./g, '\\.').replace(/\*/g, '[\\.\\w\\-]+');
                }).join('|') + ')$';
                return new RegExp(regstr);
            }

            // 随机字符串
            function getRandom(len) {
                len = len || 11;
                var str = '';
                while (str.length < len) {
                    str += (1e17 * Math.random()).toString(36);
                }
                return str.substr(0, len);
            }

            // 编码为html实体字符
            function htmlEncode(s, bit) {
                var result = '',
                    flag = '',
                    bit = (bit == 16 && (flag = 'x') && bit) || 10;
                for (var i in s) {
                    result += '&#' + flag + s.charCodeAt(i).toString(bit) + ';';
                }
                return result;
            }

            // 还原html实体字符
            function htmlDecode(s) {
                return (s || '').toString().replace(/&#(x?)([\da-f]+);/gi,
                    function (entity, hex, code) {
                        return String.fromCharCode(hex && parseInt(code, 16) || code);
                    });
            }

            // 页面加载完成事件
            DOMContentLoaded = function (doc, fn, useCapture) {
                if (doc.readyState === "complete") {
                    fn();
                } else {
                    doc.addEventListener("DOMContentLoaded", DOMContentLoaded, useCapture);
                }
            };

            function timeStart(name) {
                console && console.time && console.time(name);
            }

            function timeEnd(name) {
                console && console.time && console.timeEnd(name);
            }

            ////////////////////////////////////////////////


            // 默认结果
            function baseResult(value, target) {
                var r = {
                    target: target, // 所在对象名称
                    value: value, // 处理之后的值
                    raw_value: value, // 原始值
                    deny: false, // 是否拦截
                    warn: false, // 是否上报
                    cookie: false, // 外传cookie
                };
                r.toString = function () {
                    if (this.deny) {
                        return this.value;
                    } else {
                        return this.raw_value;
                    }
                };
                return r;
            }

            // 获取默认链接
            function getSafeURL(name) {
                return placeholderURL[name] || 'about:blank';
            }

            // 链接里是否有cookie信息
            function checkleakCookie(href) {
                return href.includes(token);
            }


            // 是否启用某功能
            function isEnable(name) {
                return config.enable.includes(name);
            }


            // 从标签名获取对应的CSP规则
            function target2rule(name) {
                var csp_rules = [],
                    group_name = csp_element[name];
                // 先走详细配置
                if (group_name in csp) {
                    csp_rules = csp_rules.concat(csp[group_name]);
                }
                // 全局默认的
                if ('default-src' in csp) {
                    csp_rules = csp_rules.concat(csp['default-src']);
                }
                return csp_rules;
            }

            ////// 基础功能 /


            // 保存对象的原始属性访问器
            var storage = {};

            // hook对象的属性访问器
            function accessor(obj, prop, action, cb) {
                if (!(prop in obj)) return;
                var f = {
                    'get': 'Getter',
                    'set': 'Setter'
                };
                var name = obj.constructor.name;
                storage[name] = storage[name] || {};
                storage[name][prop] = storage[name][prop] || {};
                storage[name][prop][action + '_cb'] = cb;
                storage[name][prop].get = storage[name][prop].get || obj.__lookupGetter__(prop);
                storage[name][prop].set = storage[name][prop].set || obj.__lookupSetter__(prop);
                var opt = {
                    configurable: true,
                    enumerable: obj.propertyIsEnumerable(prop)
                };
                opt.get = action === 'get' ?
                    function (value) {
                        // this是属性所在对象本身
                        value = storage[name][prop][action].call(this);
                        return storage[name][prop][action + '_cb'](value, this) || value;
                    } : obj.__lookupGetter__(prop) || storage[name][prop].get;
                opt.set = action === 'set' ?
                    function (value) {
                        value = storage[name][prop][action + '_cb'](value, this) || value;
                        return storage[name][prop][action].call(this, value);
                    } : obj.__lookupSetter__(prop) || storage[name][prop].set;
                Object.defineProperty(obj, prop, opt);
            }


            // 对单个元素以及子元素进行检查
            // 可以传入html字符串、单个元素、父元素、元素数组
            function vaildHTML(nodes, targetName) {
                if (typeof nodes === 'string') {
                    var parser = new DOMParser(),
                        doc = parser.parseFromString(nodes, "text/html");
                    nodes = doc.body;
                }
                var list = toArray(nodes);
                if (list.length === 0) {
                    list = toArray(nodes.querySelectorAll(leakElementSelector));
                }
                var result = baseResult(nodes.innerHTML, targetName || objType(nodes));

                list.forEach(function (e) {
                    var tagName = e.tagName.toLowerCase();
                    var attrs = leak_element[tagName];
                    attrs.forEach(function (attr) {
                        if (e.hasAttribute(attr)) {
                            var e_rst = CSP_vaildURL(e[attr], tagName);
                            result.deny = result.deny || e_rst.deny;
                            // result.warn = result.warn || e_rst.warn;
                            result.cookie = result.cookie || e_rst.cookie;
                            if (e_rst.deny) {
                                e[attr] = e_rst.value;
                            }
                        }
                    });

                });
                result.value = nodes.innerHTML;
                return result;
            };



            // 检查URL是否合法
            function vaildURL(value, target, nullable) {
                var result = baseResult(value, target);

                var url = htmlDecode(value).trim();
                if (!url) return result;

                url = new URL(url, unsafeWindow.location.href);

                // 只检测可以外传数据的协议
                if (!check_protocol.test(url.protocol))
                    return result;

                // 检查一下链接里有没有多出那个cookie
                result.cookie = checkleakCookie(url.href);

                var hostname = !value && nullable ? value : url.hostname;
                result = objExtend(result, vaildProcess(hostname, target));
                if (result.deny) {
                    result.value = getSafeURL(target);
                }
                return result;
            }

            // 对象类型和域名 获得 对应的CSP策略
            // hostname
            // target 标签名称或者对象名称
            function vaildProcess(hostname, name) {
                var result = {},
                    csp_rules = target2rule(name);

                // 域名, CSP规则, 获得策略
                var action = '';
                csp_rules.some(function (rule, index, arr) {
                    var host_reg = rule[0];
                    if (host_reg.test(hostname)) {
                        action = rule[1];
                        return true;
                    }
                });

                if (!action) {
                    // 如果没有任何规则匹配上，默认是拦截
                    return result;
                }
                result.csp_group = csp_element[name];
                result.deny = action.includes('deny');
                result.warn = action.includes('warn');
                return result;
            }


            // 上报
            var warn_list = [];

            function warn(data, e) {
                data = objExtend(data, {
                    referrer: unsafeWindow.document.referrer,
                    window_top: unsafeWindow.top == unsafeWindow.self,
                    hash: unsafeWindow.location.hash,
                    location: unsafeWindow.location.href,
                    window_name: unsafeWindow.window.name,
                    pv_tag: token,
                });

                var unique = warn_list.every(function (warn_item) {
                    return warn_item.target != data.target &&
                        warn_item.raw_value != data.raw_value;
                });

                // 不重复上报同一异常点
                if (unique) {
                    warn_list.push(data);

                    var data = JSON.stringify(data);
                    var ajax = new XMLHttpRequest();
                    ajax.open('POST', config.warn_api, true);
                    ajax.send('warn=' + window.encodeURIComponent(data));
                }
            }


            // 传入要审计的值和所在对象
            // 返回CSP检查结果
            function _CSP_Result(value, e) {
                // 标签、ajax对象、字符串
                var name = e instanceof unsafeWindow.HTMLElement && e.tagName.toLowerCase() ||
                    typeof e === 'string' && e ||
                    objType(e);
                arguments[1] = name;

                var vaildFn = [].pop.call(arguments);

                var result = vaildFn.apply(this, arguments);


                // 需要上报
                if (result.warn) {
                    // console.warn(result);
                    warn(result, e);
                }
                return result;
            }

            function CSP_vaildHTML(value, e) {
                var result = _CSP_Result(value, e, vaildHTML);
                return result;
            }

            function CSP_vaildURL(value, e) {
                var result = _CSP_Result(value, e, e == 'XFrameOption', vaildURL);
                return result;
            }



            ///////////////////// CSP防护模块 //////////////////


            /* top */

            // 检查是否被其他网站嵌套显示
            function XFrameOption() {
                if (unsafeWindow.parent.location != unsafeWindow.location) {
                    var parent_href = unsafeWindow.document.referrer;
                    var result = CSP_vaildURL(parent_href, 'XFrameOption');
                    if (result.deny) {
                        unsafeWindow.parent.location.href = unsafeWindow.location.href;
                    }
                }
            }



            /* cookie */

            // 在前端禁止读写敏感cookie
            function httpOnlyCookie() {
                var cookieCb = function (value) {
                    var desCookie = value.toString().replace(/;\s*/g, '; ').split('; ').filter(function (kv) {
                        var name = kv.split('=')[0];
                        // var value = kv.split('=').shift().join('=');
                        return !httpOnly_reg.test(name);
                    });
                    return desCookie.join('; ') + '; ';
                }
                var cookieGet = function (value) {
                    var cookie = cookieCb(value);
                    // 生豆子和熟豆子的故事...
                    cookie += '; ' + token + '=1;'
                    return cookie;
                }
                accessor(unsafeWindow.document, 'cookie', 'get', cookieGet);
                accessor(unsafeWindow.document, 'cookie', 'set', cookieCb);
            }



            /* static_element */

            // 页面文档加载完毕时检查现有的元素
            function checkPage() {
                DOMContentLoaded(unsafeWindow.document, function () {
                    CSP_vaildHTML(unsafeWindow.document.firstElementChild);
                });
            }



            /* dynamic_element */

            // 对属性赋值进行检查
            function hookAttrSetter() {
                for (var e in leak_element) {
                    var baseElement = unsafeWindow.document.createElement(e).__proto__.constructor.prototype;
                    leak_element[e].forEach(function (attr) {
                        accessor(baseElement, attr, 'set', CSP_vaildURL);
                    });
                }
            }

            // 使用setAttribute方式设置属性值
            function hookSetAttributeFn() {
                hook('unsafeWindow.HTMLElement.prototype.setAttribute').fakeArg(function (attr, value) {
                    if (leak_attr[attr] && ~leak_attr[attr].indexOf(this.tagName.toLowerCase())) {
                        value = CSP_vaildURL(value, this).value;
                    }
                    return [attr, value];
                });
            }

            // 通过innerHTML增加的元素审计
            function htmlEdit() {

                accessor(unsafeWindow.HTMLElement.prototype, 'innerHTML', 'set', CSP_vaildHTML);
                accessor(unsafeWindow.HTMLElement.prototype, 'outerHTML', 'set', CSP_vaildHTML);

                var write_arg = function (value) {
                    var result = CSP_vaildHTML(value, 'document.write');
                    if (result.deny) value = result.value;
                    return value;
                }
                hook('unsafeWindow.HTMLDocument.prototype.write').fakeArg(write_arg);
                hook('unsafeWindow.HTMLDocument.prototype.writeln').fakeArg(write_arg);
            }



            /* connect */

            // ajax发送数据
            function hookRequest() {
                if (unsafeWindow.XMLHttpRequest != undefined) {
                    hook('unsafeWindow.XMLHttpRequest.prototype.open').fakeArg(function (type, url) {
                        var result = CSP_vaildURL(url, this);
                        if (result.deny) {
                            this.send = function () {}
                                //return [type, result.value];
                        }
                        //return arguments;
                    });
                }

                if (unsafeWindow.WebSocket != undefined) {
                    var fakeSocket = (function () {
                        function WebSocket() {
                            var s = this;
                            s.close = s.send = s.addEventListener = s.removeEventListener = s.dispatchEvent = s.onopen = s.onerror = s.onclose = s.onmessage = function () {}
                            s.CONNECTING = s.OPEN = s.CLOSING = s.CLOSED = s.bufferedAmount = 0;
                            s.binaryType = 'blob';
                            s.extensions = s.protocol = '';
                            s.url = getSafeURL(this.name);
                            return s;
                        }
                        return WebSocket;
                    })();

                    var hookWebSocket = function (args, _webSocket) {
                        var url = args[0];
                        var result = CSP_vaildURL(url, 'WebSocket');
                        if (result.deny) {
                            return new fakeSocket();
                        }
                        return new _webSocket(url);
                    }

                    hook('unsafeWindow.WebSocket.prototype.constructor').fake(hookWebSocket);
                    hook('unsafeWindow.WebSocket').fake(hookWebSocket);

                }
                // 'XMLHttpRequest', 'WebSocket', 'EventSource'

            }




            ///////////// 启用功能  ////////////




            // enable: 'top sec cookie static_element dynamic_element script connect'
            // window.open

            isEnable('top') && function () {
                timeStart('top');
                XFrameOption();
                timeEnd('top');
            }();

            isEnable('sec') && function () {
                // timeStart('sec');
                // scanStoredXSS();
                // scanReflectedXSS();
                // scanDOMBaseXSS();
                // timeEnd('sec');

            }();

            isEnable('cookie') && function () {
                timeStart('cookie');
                httpOnlyCookie();
                timeEnd('cookie');
            }();

            isEnable('static_element') && function () {
                timeStart('static_element');
                checkPage();
                /*检查设置保护的cookie泄漏在页面上*/
                timeEnd('static_element');
            }();

            isEnable('dynamic_element') && function () {
                timeStart('dynamic_element');
                hookAttrSetter();
                hookSetAttributeFn();
                htmlEdit();
                timeEnd('dynamic_element');
            }();

            isEnable('script') && function () {
                // timeStart('script');
                // scriptForbid();
                // timeEnd('script');
            }();

            isEnable('connect') && function () {
                timeStart('connect');
                hookRequest();
                timeEnd('connect');
            }();



            /*

            // 允许script标签出现的位置, 填写css选择器
            var white_script = ['head', 'body'];
            var script_action = 'deny warn'

            function scriptForbid() {
                // 页面文档加载完毕时检查现有的元素
                document.addEventListener('DOMContentLoaded',
                    function() {
                        white_script.forEach(function(selector) {
                            var scripts = document.querySelector('selector').getElementsByTagName('script');

                        });
                    });
            }
            */


            /*
            //Stored  Reflected
            function scanStoredXSS(){
                
            }
                
            function scanReflectedXSS(){
                
            }
                
            function scanDOMBaseXSS(){
                
            }

            */


            delete unsafeWindow.JFW_config;
            delete unsafeWindow.js_hook_js;
            delete unsafeWindow.js_firewall_js;

            DOMContentLoaded(unsafeWindow.document, function () {
                var s = unsafeWindow.document.getElementsByClassName('js_firewall_js');
                for (var i = 0; i < s.length; i++) {
                    s.item(i).parentNode.removeChild(s.item(i))
                }
            });

            /*
            // CSP规则

            var csp = {
                // 默认规则
                'default-src': [
                    // url匹配规则
                    // 第一个是域名, 第二个是响应动作, 放行accept 拒绝deny 告警warn
                    // 可以有多条规则, 按顺序匹配
                    [white_host, 'accept'],
                    ['*', 'warn'],
                    // 默认链接, 替换被deny的url
                    // 以字符串形式放在规则最后
                    'about:blank'
                ],
                // 详细规则
                // 优先匹配详细规则, 最后匹配默认规则
                'script-src': [
                    [white_host, 'accept'],
                    ['*', 'deny warn'],
                ], // script
                'anchor-src': [
                    [white_host, 'accept'],
                    ['*', 'accept warn'],
                    'javascript: void 0'
                ], // a
                'style-src': [], // link
                'img-src': [
                    ['*', 'deny warn'],
                    '//www.10086.cn/images/404_02.jpg'
                ], // img
                'frame-src': [], // frame, iframe
                'media-src': [], // video, audio, source, or track
                'object-src': [], // object, embed, applet
                'connect-src': [
                    '/'
                ], // XMLHttpRequest  WebSocket  EventSource
            }
            */


            ///////////////// 测试 //////////////

            /*



            var img = document.createElement('img');
            img.src = "http://evil.com";
            console.log('hookAttrSetter:' + img.src);

            img.setAttribute('src', "http://evil.com");
            console.log('hookSetAttributeFn:' + img.src);

            var div = document.createElement('div');

            div.innerHTML = "<img id='test' src='http://evil.com'>";
            console.log('htmlEdit:' + div.getElementsByTagName('img')[0].src);

            console.log(img);
            console.log(div.innerHTML);

            var ws = new WebSocket('wss://www.web-tinker.com:8001/csptest')
            ws.onopen = function() {
                ws.send('test')
            }
            console.log('WebSocket.url:' + ws.url)


            var ajax = new XMLHttpRequest();
            ajax.open('POST', 'http://evil.com');
            console.log('ajax.send:' + ajax.send.toString());

            // document.write("<img id='te1st' src='http://evil.com'>");
            // console.log('write:' + document.getElementById('te1st').src);



            */



            timeEnd('js_csp_fw');
        })(this.URL, this.DOMParser);
    });
    ctx[name] = definition;
})('js_firewall_js', window);
