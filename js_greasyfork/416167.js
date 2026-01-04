// ==UserScript==
// @name         SwaggerUI Extends
// @version      1.0.1
// @namespace    swagger-ui
// @description  扩展SwaggerUI搜索功能|导出Api Config配置|导出Table Config配置|导出Form Config配置
// @author       hucy
//
// @match        http*://*/*/swagger-ui.html
// @match        http*://*/swagger-ui.html
//
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
//
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/416167/SwaggerUI%20Extends.user.js
// @updateURL https://update.greasyfork.org/scripts/416167/SwaggerUI%20Extends.meta.js
// ==/UserScript==

!function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            i: moduleId,
            l: !1,
            exports: {}
        };
        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
        module.l = !0, module.exports;
    }
    __webpack_require__.m = modules, __webpack_require__.c = installedModules, __webpack_require__.d = function(exports, name, getter) {
        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
            enumerable: !0,
            get: getter
        });
    }, __webpack_require__.r = function(exports) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(exports, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(exports, "__esModule", {
            value: !0
        });
    }, __webpack_require__.t = function(value, mode) {
        if (1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
        if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
        var ns = Object.create(null);
        if (__webpack_require__.r(ns), Object.defineProperty(ns, "default", {
            enumerable: !0,
            value: value
        }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
            return value[key];
        }.bind(null, key));
        return ns;
    }, __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ? function() {
            return module.default;
        } : function() {
            return module;
        };
        return __webpack_require__.d(getter, "a", getter), getter;
    }, __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 0);
}([ function(module, exports, __webpack_require__) {
    const init = __webpack_require__(1);
    $((function() {
        __webpack_require__(19).info("script loaded"), GM_addStyle(__webpack_require__(22).default.toString()), 
        setTimeout(init, 2e3);
    }));
}, function(module, exports, __webpack_require__) {
    const initSearch = __webpack_require__(2), initData = __webpack_require__(6), initPathBtns = __webpack_require__(7);
    module.exports = function() {
        initData(), initSearch(), initPathBtns();
    };
}, function(module, exports, __webpack_require__) {
    const each = __webpack_require__(3), uniq = __webpack_require__(4), ui = __webpack_require__(5), $searchInput = $(ui.input), $searchResult = $(ui.results);
    function onEnter(e) {
        13 === e.keyCode && function() {
            $searchResult.html("");
            const keyword = $searchInput.val();
            var rs = [];
            each((function(item, path, method) {
                var desc = item.description || "", tags = item.tags && item.tags.join();
                tags = tags || "", (path.includes(keyword) || desc.includes(keyword) || tags.includes(keyword)) && rs.push({
                    tags: tags,
                    path: path
                });
            })), (rs = uniq(rs, "path")).forEach((function({tags: tags, path: path}, i) {
                var $link = $(`<h4 class="search-result-item" href="#/${tags}">${tags}</h4>`);
                $link.data("path", path), $link.css("display", "none"), $searchResult.append($link), 
                $link.delay(40 * i).show("fast");
            }));
        }();
    }
    function onClickSearchItem() {
        var href = $(this).attr("href"), path = $(this).data("path"), target = $(`a[href='${href}']`).last(), scrollTop = target.offset().top - 100;
        function onOpened() {
            target.parents(".opblock-tag-section").find(".opblock-summary-path").each((function() {
                let $path = $(this);
                $path.text().trim() === path && flash($path, (function() {
                    $path.css("color", ""), $path.parents(".opblock").hasClass("is-open") || $path.get(0).click();
                }));
            }));
        }
        $("html, body").animate({
            scrollTop: scrollTop
        }, 300), flash(target, (function() {
            target.css("color", ""), target.parents(".opblock-tag-section").hasClass("is-open") || target.get(0).click(), 
            setTimeout(onOpened, 0);
        }));
    }
    function flash(target, onEnd) {
        target.css({
            color: "#ff0000"
        }).animate({
            opacity: 0
        }, 60).animate({
            opacity: 1
        }, 60).animate({
            opacity: 0
        }, 60).animate({
            opacity: 1
        }, 60).animate({
            opacity: 0
        }, 60).animate({
            opacity: 1
        }, 60, onEnd);
    }
    module.exports = function() {
        $(".topbar-wrapper").html(""), $(".topbar-wrapper").append($searchInput), $(".topbar").after($searchResult), 
        $searchInput.on("keyup", onEnter), $searchResult.on("click", ".search-result-item", onClickSearchItem);
    };
}, function(module, exports) {
    module.exports = function(fn) {
        const swaggerData = GM_getValue("data");
        for (var path in swaggerData.paths) for (var method in swaggerData.paths[path]) {
            var item = swaggerData.paths[path][method];
            item.method = method, fn && fn(item, path, method);
        }
    };
}, function(module, exports) {
    module.exports = function(arr, key) {
        var o = {};
        return arr.forEach((function(item) {
            let k = item;
            key && (k = item[key]), o[k] = item;
        })), Object.values(o);
    };
}, function(module, exports) {
    $("");
    $();
    module.exports = {
        input: '<input type="text" class="form-control" id="search-input" placeholder="搜索 path/tags/desc">',
        results: '<pre class="search-result">没有搜到</pre>'
    };
}, function(module, exports) {
    module.exports = function() {
        if (!GM_getValue("data")) {
            var sr = location.pathname.replace("swagger-ui.html", "swagger-resources");
            $.get(sr).done((function(res) {
                console.log(res[0].url);
                var url = res[0].url, p = location.pathname.replace("/swagger-ui.html", url);
                $.get(p).done((function(res) {
                    GM_setValue("data", res);
                }));
            }));
        }
    };
}, function(module, exports, __webpack_require__) {
    const createBtn = __webpack_require__(8), message = (__webpack_require__(9), __webpack_require__(10)), downloadString = __webpack_require__(11), cache = __webpack_require__(12), onCopyPath = __webpack_require__(13), onCopyTableConfig = __webpack_require__(14), {onCopyApiConfig: onCopyApiConfig, getApiConfig: getApiConfig, onApiNameChange: onApiNameChange, getName: getName} = __webpack_require__(15), onCopyForm = __webpack_require__(16), onCopyFormConfig = __webpack_require__(17), onCopyFormVantConfig = __webpack_require__(18);
    function onInserted(e) {
        $(e.target).find(".opblock .opblock-summary-path").each((function() {
            let $this = $(this), path = $this.text().trim(), $box = $('<div class="opblock-extend-btns">');
            $this.parents(".opblock-summary").append($box), $('<input style="margin-right:10px" />').appendTo($box).click((e => e.stopPropagation())).change(onApiNameChange(path)).val(cache.get(path) || getName(path)), 
            createBtn("Path", $box).click(onCopyPath(path)), createBtn("Api Config", $box).click(onCopyApiConfig(path)), 
            createBtn("复制 Table Config", $box).click(onCopyTableConfig(path)), createBtn("复制 Form", $box).click(onCopyForm(path)), 
            createBtn("复制 Form Config", $box).click(onCopyFormConfig(path)), createBtn("复制 FormVant Config", $box).click(onCopyFormVantConfig(path));
        }));
    }
    function onRemoved(e) {
        $(e.target).find(".svg-button").off();
    }
    module.exports = function() {
        $(window).on("DOMNodeInserted", onInserted), $(window).on("DOMNodeRemoved", onRemoved), 
        function() {
            let $navBtns = $("<div>").appendTo($(".topbar-wrapper"));
            createBtn("导出展开项 Api Config 配置", $navBtns).click((function() {
                let exportContent = "export default [\r\n";
                exportContent += $(".opblock .opblock-summary-path").map((function() {
                    let path = $(this).text().trim();
                    return getApiConfig(path);
                })).toArray().join("\r\n"), exportContent += "\r\n]", downloadString(exportContent, "text/javascript", "apiConfig.js");
            })), createBtn("清除文档缓存数据", $navBtns).click((function() {
                GM_setValue("data", ""), message("已清除 缓存数据");
            }));
        }();
    };
}, function(module, exports) {
    module.exports = function(text, container) {
        let btn = $(`\n    <div class="svg-button">\n      <svg xmlns="http://www.w3.org/2000/svg">\n        <path class="border" stroke-linejoin="round" d="" />\n      </svg>\n      <div class="svg-text">${text}</div>\n    </div>\n  `);
        btn.appendTo(container);
        let path = btn.find(".border"), w = btn.width(), h = btn.height();
        path.attr("d", `M${w / 2} 1 L${w - 1} 1 L${w - 1} ${h - 1} L1 ${h - 1} L1 1 Z`);
        let length = path.get(0).getTotalLength();
        return path.css("stroke-dasharray", length), path.css("stroke-dashoffset", length), 
        btn.mouseleave((function() {
            path.css("stroke-dashoffset", length);
        })), btn.mouseenter((function() {
            path.css("stroke-dashoffset", 0);
        })), btn;
    };
}, function(module, exports, __webpack_require__) {
    const each = __webpack_require__(3);
    module.exports = {
        byPath(p) {
            let item;
            return each((function(o, path, method) {
                path === p && (item = o);
            })), console.log(item), item;
        },
        responseByPath(p) {}
    };
}, function(module, exports) {
    var msgs = [];
    module.exports = function(msg) {
        let $msg = $('<div class="tm-message">').html(msg || "消息").css("display", "none").appendTo("body"), last = msgs[msgs.length - 1];
        $msg.css({
            top: last ? last.position().top + last.height() + 30 : 100
        }), $msg.show(400, (function() {
            setTimeout((function() {
                let height = $msg.height();
                $msg.hide("fast", (function() {
                    let i = msgs.indexOf($msg);
                    msgs.splice(i, 1), $msg.remove(), msgs.forEach((item => {
                        let top = item.css("top");
                        top = parseInt(top), top -= height + 30, item.animate({
                            top: top
                        }, "fast");
                    }));
                }));
            }), 4e3);
        })), msgs.push($msg);
    };
}, function(module, exports) {
    module.exports = function(text, fileType, fileName) {
        var blob = new Blob([ text ], {
            type: fileType
        }), a = document.createElement("a");
        a.download = fileName, a.href = URL.createObjectURL(blob), a.dataset.downloadurl = [ fileType, a.download, a.href ].join(":"), 
        a.style.display = "none", document.body.appendChild(a), a.click(), document.body.removeChild(a), 
        setTimeout((function() {
            URL.revokeObjectURL(a.href);
        }), 500);
    };
}, function(module, exports) {
    let cacheName = "apiname://" + location.host;
    module.exports = {
        get(path) {
            let cache = GM_getValue(cacheName, {});
            return path ? cache[path] : cache;
        },
        set(cache) {
            GM_setValue(cacheName, cache);
        }
    };
}, function(module, exports) {
    module.exports = function(path) {
        return function(e) {
            e.stopPropagation(), GM_setClipboard(path), message("已复制<br>" + path);
        };
    };
}, function(module, exports, __webpack_require__) {
    const find = __webpack_require__(9), message = __webpack_require__(10);
    module.exports = function(path) {
        return function(e) {
            e.stopPropagation();
            let item = find.byPath(path), $ref = item.responses && item.responses[200] && item.responses[200].schema && item.responses[200].schema.$ref;
            if ($ref) {
                let content, key = $ref.split("/").pop(), def = GM_getValue("data").definitions[key];
                def && def.properties && (content = Object.keys(def.properties).map((prop => {
                    let item = def.properties[prop];
                    if (item) {
                        let desc = item.description, label = desc || prop;
                        try {
                            label = label.match(/^[^（:(：、《【，,\s]+/)[0];
                        } catch (e) {
                            label = prop;
                        }
                        let descComment = "";
                        label != desc && desc && (descComment = `// @desc ${desc}\r\n`);
                        let rs = {
                            prop: prop,
                            label: label
                        };
                        return "number" === item.type && (rs.align = "right"), `${descComment}${JSON.stringify(rs)},`;
                    }
                })), content = content.join("\r\n"), content = `[\n          ${content}\n        ]`, 
                console.log(content), GM_setClipboard(content), message("已复制<br>" + content.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")));
            } else message("没有响应文档<br>" + path);
        };
    };
}, function(module, exports, __webpack_require__) {
    const find = __webpack_require__(9), message = __webpack_require__(10);
    module.exports = {
        onCopyApiConfig: function(path) {
            return function(e) {
                e.stopPropagation();
                let item = find.byPath(path);
                console.log("path", path), console.log(item);
                let content = getApiConfig(path);
                GM_setClipboard(content), message("已复制<br>" + content.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"));
            };
        },
        getApiConfig: function(path) {
            let item = find.byPath(path), method = item.method, name = cache.get(path) || getName(path);
            return `\n// @desc ${item.summary}\n// @desc ${item.tags.join("")}\n${JSON.stringify({
                name: name,
                method: method.toLowerCase(),
                url: path
            }, null, "  ")},`;
        },
        onApiNameChange: path => function(e) {
            let name = $(this).val(), c = cache.get();
            c[path] = name, cache.set(c), message("改名成功<br>" + name);
        },
        getName(path) {
            let [one, two] = path.split("/").slice(-2);
            return one + two[0].toUpperCase() + two.substr(1);
        }
    };
}, function(module, exports, __webpack_require__) {
    const find = __webpack_require__(9), message = __webpack_require__(10);
    module.exports = function(path) {
        return function(e) {
            e.stopPropagation();
            let item = find.byPath(path), content = "{\r\n", params = item.parameters;
            if (!params) return message("文档里没写params");
            content += params.map((param => {
                let rs_prop = param.name, rs_label = param.description;
                return "data" === param.name && "body" === param.in && item.description.includes("<table") ? $("<div>" + item.description + "</div>").find("tbody tr").map((function() {
                    $tr = $(this);
                    let label = $tr.find("td:eq(0)").text().trim(), prop = $tr.find("td:eq(1)").text().trim();
                    $tr.find("td:eq(2)").text().trim();
                    return `// @desc ${label}\r\n${prop}: '',`;
                })).toArray().join("\r\n") : `// @desc ${rs_label}\r\n${rs_prop}: '',`;
            })).join("\r\n"), content += "\r\n},", message("已复制<br>" + content.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")), 
            console.log(content), GM_setClipboard(content);
        };
    };
}, function(module, exports, __webpack_require__) {
    const find = __webpack_require__(9), message = __webpack_require__(10);
    module.exports = function(path) {
        return function(e) {
            e.stopPropagation();
            let item = find.byPath(path), content = "[\r\n", params = item.parameters;
            if (!params) return message("文档里没写params");
            content += params.map((param => {
                let rs = {
                    prop: param.name,
                    label: param.description
                };
                return "data" === param.name && "body" === param.in && item.description.includes("<table") ? $("<div>" + item.description + "</div>").find("tbody tr").map((function() {
                    $tr = $(this);
                    let label = $tr.find("td:eq(0)").text().trim(), prop = $tr.find("td:eq(1)").text().trim(), rule = "是" === $tr.find("td:eq(2)").text().trim() ? [ {
                        required: !0,
                        message: label + "是必填的"
                    } ] : [];
                    return JSON.stringify({
                        prop: prop,
                        label: label,
                        rule: rule
                    }) + ",";
                })).toArray().join("\r\n") : (param.required && (rs.rule = [ {
                    required: !0,
                    message: rs.label + "是必填的"
                } ]), JSON.stringify(rs) + ",");
            })).join("\r\n"), content += "\r\n],", message("已复制<br>" + content.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")), 
            console.log(content), GM_setClipboard(content);
        };
    };
}, function(module, exports, __webpack_require__) {
    const find = __webpack_require__(9), message = __webpack_require__(10);
    module.exports = function(path) {
        return function(e) {
            e.stopPropagation();
            let item = find.byPath(path), content = "[\r\n", params = item.parameters;
            if (!params) return message("文档里没写params");
            content += params.map((param => {
                let rs = {
                    prop: param.name,
                    label: param.description
                };
                return "data" === param.name && "body" === param.in && item.description.includes("<table") ? $("<div>" + item.description + "</div>").find("tbody tr").map((function() {
                    $tr = $(this);
                    let name = $tr.find("td:eq(0)").text().trim(), label = "" + name, placeholder = "" + name, prop = $tr.find("td:eq(1)").text().trim(), rule = "是" === $tr.find("td:eq(2)").text().trim() ? [ {
                        required: !0,
                        message: label + "是必填的"
                    } ] : [];
                    return JSON.stringify({
                        name: name,
                        label: label,
                        placeholder: placeholder,
                        prop: prop,
                        rule: rule
                    }) + ",";
                })).toArray().join("\r\n") : (param.required && (rs.rule = [ {
                    required: !0,
                    message: rs.label + "是必填的"
                } ]), JSON.stringify(rs) + ",");
            })).join("\r\n"), content += "\r\n],", message("已复制<br>" + content.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")), 
            console.log(content), GM_setClipboard(content);
        };
    };
}, function(module, exports, __webpack_require__) {
    const monkey = __webpack_require__(20), message = __webpack_require__(10);
    module.exports = {
        info: (...args) => {
            message.apply(this, args), console.info(`%c[${monkey.header.name}]`, "background:#5bc0de;color: #fff;border: 1px solid #46b8da;padding: 0 5px;border-radius: 4px", ...args);
        },
        debug: (...args) => {
            console.debug(`[${monkey.header.name}]`, ...args);
        },
        warn: (...args) => {
            console.warn(`[${monkey.header.name}]`, ...args);
        }
    };
}, function(module, exports, __webpack_require__) {
    const header = __webpack_require__(21);
    module.exports.config = {
        entry: "./src/index.js"
    }, module.exports.header = header, module.exports.buildedHeader = () => {
        const headerString = [];
        headerString.push("// ==UserScript==");
        for (const headerKey in header) if (Array.isArray(header[headerKey])) {
            header[headerKey].length > 0 && headerString.push("//");
            for (let p in header[headerKey]) headerString.push("// @" + headerKey.padEnd(13) + header[headerKey][p]);
        } else headerString.push("// @" + headerKey.padEnd(13) + header[headerKey]);
        return headerString.push("// ==/UserScript=="), headerString.push(""), headerString.join("\n");
    };
}, function(module, exports) {
    module.exports = new class {
        constructor() {
            this.name = "SwaggerUI Extends", this.version = "1.0.1", this.namespace = "swagger-ui", 
            this.description = "扩展SwaggerUI搜索功能|导出Api Config配置|导出Table Config配置|导出Form Config配置", 
            this.author = "hucy", this.match = [ "http*://*/*/swagger-ui.html", "http*://*/swagger-ui.html" ], 
            this.require = [ "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js", "https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js" ], 
            this.grant = [ "GM_addStyle", "GM_setValue", "GM_getValue", "GM_setClipboard" ];
        }
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__)()(!1);
    ___CSS_LOADER_EXPORT___.push([ module.i, ".topbar{position:fixed;top:0;left:0;right:0;z-index:9999}.swagger-ui{padding-top:60px}.swagger-ui .topbar .topbar-wrapper{justify-content:space-between}.swagger-ui .opblock .opblock-summary-description{margin-left:10px}.op-btn{position:fixed;top:160px;right:20px;width:160px;height:40px;line-height:40px;text-align:center;background:#add8e6;cursor:pointer;border-radius:8px}.op-btn:hover{opacity:.8}.message{position:fixed;top:50px;background:#add8e6;padding:10px;left:50%;-ms-transform:translateX(-50%);transform:translateX(-50%)}#search-input{height:40px;width:400px}.search-result{position:fixed;top:50px;left:0;width:240px;padding:0 15px;box-shadow:0 0 10px #444;background:#fff;opacity:.5;transition:all .3s}.search-result:hover{opacity:1}.search-result-item{cursor:pointer;padding:10px 0;margin:0}.search-result-item:hover{background:#eee}.svg-button{background-color:#909399;color:#f4f4f5;display:inline-flex;height:32px;width:auto;position:relative;cursor:pointer}.svg-button:hover{background-color:#f4f4f5;color:#909399}.svg-button+.svg-button{margin-left:10px}.svg-button svg{width:100%;height:32px;position:absolute;top:0;left:0;right:0;bottom:0}.svg-button .svg-text{padding:0 20px;line-height:32px;transition:all .4s;font-size:14px;font-family:Comic Sans MS,Courier New,Microsoft YaHei,monospace}.svg-button:hover .svg-text{color:#8679f7}.svg-button .border{width:100%;height:100%;fill:none;stroke-width:2px;stroke:#909399;transition:all .6s cubic-bezier(.23,1,.32,1)}.svg-button:hover .border{stroke:#8679f7;stroke-width:2px}.tm-message{position:fixed;right:20px;background:#333;color:#ee0;border-radius:4px;padding:10px;font-size:16px;line-height:1.2em;min-height:2.4em;min-width:16em;box-shadow:0 0 10px #b9b9b9;z-index:8000}.opblock-extend-btns{padding-left:10px}.opblock-extend-btns input{height:32px}", "" ]), 
    __webpack_exports__.default = ___CSS_LOADER_EXPORT___;
}, function(module, exports, __webpack_require__) {
    "use strict";
    module.exports = function(useSourceMap) {
        var list = [];
        return list.toString = function() {
            return this.map((function(item) {
                var content = function(item, useSourceMap) {
                    var content = item[1] || "", cssMapping = item[3];
                    if (!cssMapping) return content;
                    if (useSourceMap && "function" == typeof btoa) {
                        var sourceMapping = (sourceMap = cssMapping, base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), 
                        data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64), 
                        "/*# ".concat(data, " */")), sourceURLs = cssMapping.sources.map((function(source) {
                            return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
                        }));
                        return [ content ].concat(sourceURLs).concat([ sourceMapping ]).join("\n");
                    }
                    var sourceMap, base64, data;
                    return [ content ].join("\n");
                }(item, useSourceMap);
                return item[2] ? "@media ".concat(item[2], " {").concat(content, "}") : content;
            })).join("");
        }, list.i = function(modules, mediaQuery, dedupe) {
            "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
            var alreadyImportedModules = {};
            if (dedupe) for (var i = 0; i < this.length; i++) {
                var id = this[i][0];
                null != id && (alreadyImportedModules[id] = !0);
            }
            for (var _i = 0; _i < modules.length; _i++) {
                var item = [].concat(modules[_i]);
                dedupe && alreadyImportedModules[item[0]] || (mediaQuery && (item[2] ? item[2] = "".concat(mediaQuery, " and ").concat(item[2]) : item[2] = mediaQuery), 
                list.push(item));
            }
        }, list;
    };
} ]);