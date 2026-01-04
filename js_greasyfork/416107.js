// ==UserScript==
// @name         SwaggerUI Extends
// @version      1.0.3
// @namespace    swagger-ui
// @description  扩展SwaggerUI搜索功能|导出Api Config配置|导出Table Config配置|导出Form Config配置
// @author       hucy
//
// @match        http*://*/*/swagger-ui.html
// @match        http*://*/swagger-ui.html
//
// @require      https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js
//
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/416107/SwaggerUI%20Extends.user.js
// @updateURL https://update.greasyfork.org/scripts/416107/SwaggerUI%20Extends.meta.js
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
        __webpack_require__(22).info("script loaded"), GM_addStyle(__webpack_require__(25).default.toString()), 
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
    const dataProtocol = "apidoc-data://" + location.host;
    module.exports = function(fn) {
        const swaggerData = GM_getValue(dataProtocol);
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
    const dataProtocol = "apidoc-data://" + location.host;
    module.exports = function() {
        if (!GM_getValue(dataProtocol)) {
            var sr = location.pathname.replace("swagger-ui.html", "swagger-resources");
            $.get(sr).done((function(res) {
                console.log(res[0].url);
                var url = res[0].url, p = location.pathname.replace("/swagger-ui.html", url);
                $.get(p).done((function(res) {
                    GM_setValue(dataProtocol, res);
                }));
            }));
        }
    };
}, function(module, exports, __webpack_require__) {
    const createBtn = __webpack_require__(8), message = (__webpack_require__(9), __webpack_require__(10)), downloadString = __webpack_require__(11), cache = __webpack_require__(12), onCopyPath = __webpack_require__(13), onCopyTableConfig = __webpack_require__(14), {onCopyApiConfig: onCopyApiConfig, getApiConfig: getApiConfig, onApiNameChange: onApiNameChange, getName: getName} = __webpack_require__(15), onCopyForm = __webpack_require__(16), onCopyFormConfig = __webpack_require__(17), onCopyFormVantConfig = __webpack_require__(18), onExportFormVue = __webpack_require__(19);
    function onInserted(e) {
        $(e.target).find(".opblock .opblock-summary-path").each((function() {
            let $this = $(this), path = $this.text().trim(), $box = $('<div class="opblock-extend-btns">');
            $this.parents(".opblock-summary").before($box), $('<input style="margin-right:10px" />').appendTo($box).click((e => e.stopPropagation())).change(onApiNameChange(path)).val(cache.get(path) || getName(path)), 
            createBtn("Path", $box).click(onCopyPath(path)), createBtn("Api Config", $box).click(onCopyApiConfig(path)), 
            createBtn("复制 Table Config", $box).click(onCopyTableConfig(path)), createBtn("复制 Form", $box).click(onCopyForm(path)), 
            createBtn("复制 Form Config", $box).click(onCopyFormConfig(path)), createBtn("复制 FormVant Config", $box).click(onCopyFormVantConfig(path)), 
            createBtn("导出 Form Vue", $box).click(onExportFormVue(path));
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
                const dataProtocol = "apidoc-data://" + location.host;
                GM_setValue(dataProtocol, ""), message("已清除 缓存数据");
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
    const find = __webpack_require__(9), message = __webpack_require__(10), dataProtocol = "apidoc-data://" + location.host;
    module.exports = function(path) {
        return function(e) {
            e.stopPropagation();
            let item = find.byPath(path), $ref = item.responses && item.responses[200] && item.responses[200].schema && item.responses[200].schema.$ref;
            if ($ref) {
                let content, key = $ref.split("/").pop(), def = GM_getValue(dataProtocol).definitions[key];
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
    const find = __webpack_require__(9), message = __webpack_require__(10), cache = __webpack_require__(12);
    var that = {
        onCopyApiConfig: function(path) {
            return function(e) {
                e.stopPropagation();
                let item = find.byPath(path);
                console.log("path", path), console.log(item);
                let content = that.getApiConfig(path);
                GM_setClipboard(content), message("已复制<br>" + content.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;"));
            };
        },
        getApiConfig: function(path) {
            let item = find.byPath(path), method = item.method, name = cache.get(path) || that.getName(path);
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
    module.exports = that;
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
            let item = find.byPath(path), content = "\r\n", params = item.parameters;
            if (console.log(params, "params11"), !params) return message("文档里没写params");
            content += params.map((param => {
                let rs = `\n\t\t\t\t\t\t<van-field\n\t\t\t\t\t\t    v-model="${param.name}"\n\t\t\t\t\t\t    name="${param.name}"\n\t\t\t\t\t\t    label="${param.description}"\n\t\t\t\t\t\t    placeholder="${param.description}"\n\t\t\t\t\t\t/>\n\t\t\t\t\t`;
                return "data" === param.name && "body" === param.in && item.description.includes("<table") ? "没有遇到的格式，叫开发从新写" : (param.required && (rs = `\n\t\t\t\t\t\t\t<van-field\n\t\t\t\t\t\t\t    v-model="${param.name}"\n\t\t\t\t\t\t\t    name="${param.name}"\n\t\t\t\t\t\t\t    label="${param.description}"\n\t\t\t\t\t\t\t    placeholder="${param.description}"\n\t\t\t\t\t\t\t    :rules="[{ required: true, message: '${param.description}是必填的' }]"\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t`), 
                "" + rs);
            })).join("\r\n"), content += "\r\n", message("已复制<br>" + content.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")), 
            console.log(content), GM_setClipboard(content);
        };
    };
}, function(module, exports, __webpack_require__) {
    const template = __webpack_require__(20), download = __webpack_require__(11), {getName: getName} = __webpack_require__(15), cache = __webpack_require__(12), find = __webpack_require__(9), dialog = __webpack_require__(21);
    Handlebars.registerHelper("isstring", (function(value) {
        return "string" == typeof value;
    })), module.exports = function(path) {
        return function(e) {
            let name = cache.get(path) || getName(path), rules = function(path) {
                let item = find.byPath(path), params = item.parameters, results = [];
                return params ? (params.map((param => {
                    let rs = {
                        field: param.name,
                        title: param.description,
                        type: "input"
                    };
                    "data" === param.name && "body" === param.in && item.description.includes("<table") ? $("<div>" + item.description + "</div>").find("tbody tr").map((function() {
                        $tr = $(this);
                        let title = $tr.find("td:eq(0)").text().trim(), field = $tr.find("td:eq(1)").text().trim(), validate = "是" === $tr.find("td:eq(2)").text().trim() ? [ {
                            required: !0,
                            message: title + "是必填的"
                        } ] : [];
                        results.push({
                            field: field,
                            title: title,
                            validate: validate,
                            type: "input"
                        });
                    })) : param.required && (rs.validate = [ {
                        required: !0,
                        message: rs.title + "是必填的"
                    } ], results.push(rs));
                })), results) : message("文档里没写 params<br>该接口没有参数");
            }(path), config = {
                name: name,
                name_snake_case: name.replace(/(A-Z)/g, (z => "-" + z.toLowerCase())),
                api_add: "addForm",
                api_edit: "editForm",
                api_detail: "detailForm",
                rules: rules
            };
            dialog.paramsConfigDialog(config).on("copy", (function(config) {
                GM_setClipboard(JSON.stringify(config, null, "  "));
            })).on("confirm", (function(config) {
                const fileContent = Handlebars.compile(template)(config);
                download(fileContent, "text/javascript", config.name + ".vue");
            }));
        };
    };
}, function(module, exports) {
    module.exports = "<template>\n  <div class=\"form-{{name_snake_case}}\">\n    <form-create :rule=\"rule\" v-model=\"fApi\" :option=\"options\" />\n    <div class=\"form-btn\" v-if=\"type == 'edit' || type == 'insert'\">\n      <el-button type=\"primary\" plain @click=\"submit\">保存</el-button>\n      <el-button plain @click=\"reset\">重置</el-button>\n    </div>\n  </div>\n</template>\n\n<script>\nimport { mapRequest } from 'rd-http';\nexport default {\n  name: 'Form{{nameCamelCase}}',\n  props: {\n    formData: Object,\n    type: {\n      type: String,\n      // edit, insert, view\n      default: 'view'\n    }\n  },\n  data() {\n    return {\n      fApi: {},\n      options: {\n        submitBtn: false\n      },\n      rule: [\n        {{#each rules ~}}\n        {\n          type: '{{type}}',\n          field: '{{field}}',\n          title: '{{title}}',\n          validate: [\n            {{#each validate ~}}\n            { {{#each this ~}}\n            {{@key}}: \n              {{~#if (isstring this) ~}}\n                '{{this}}'\n              {{~else~}}\n                {{this}}\n              {{~/if~}},\n            {{~/each}} },\n            {{/each}}\n          ],\n          props: {\n            disabled: this.type === 'view',\n            {{#each props ~}}\n            {{@key}}: {{this}},\n            {{/each}}\n          }\n        },\n        {{~/each}}\n      ]\n    };\n  },\n  mounted() {\n    if (this.type == 'edit') {\n      this.getDetail();\n    } else if (this.type == 'insert') {\n      // TODO: 有需要可以填, 没有可以把这个if删掉\n    } else if (this.type == 'view') {\n      this.getDetail();\n    }\n  },\n  methods: {\n    getDetail() {\n      this.{{api_detail}}(\n        this.$qs.stringify({\n          // TODO: 接口参数\n        })\n      ).then(res => {\n        // TODO: 初始化表单值\n        // this.setFormVlue(res.data);\n      });\n    },\n    submit() {\n      this.fApi.submit((formData, $f) => {\n        // console.log($f, formData, JSON.stringify(formData), 'fapi');\n        if (this.type == 'edit') {\n          this.{{api_edit}}(this.$qs.stringify(formData)).then(res => {\n            this.$message.success(res.msg);\n            this.$emit('confirm', '编辑成功');\n          });\n        } else if (this.type == 'insert') {\n          // console.log(formData);\n          this.{{api_add}}(this.$qs.stringify(formData)).then(res => {\n            this.$message.success(res.msg);\n            this.$emit('confirm', '新增成功');\n          });\n        }\n      });\n    },\n    reset() {\n      this.fApi.resetFields();\n    },\n    ...mapRequest(['{{api_detail}}', '{{api_edit}}', '{{api_add}}'])\n  }\n};\n<\/script>\n";
}, function(module, exports) {
    module.exports = {
        create(content) {
            let dialog = $('<div class="sw-ui-extend-dialog"></div>'), mask = $('<div class="sw-ui-extend-dialog-mask"></div>'), closeBtn = $('<div class="sw-ui-extend-close-btn">关闭</div>'), confirmBtn = $('<div class="sw-ui-extend-confirm-btn">保存配置并导出</div>'), copyBtn = $('<div class="sw-ui-extend-copy-btn">保存配置并复制到剪贴板</div>');
            closeBtn.click((function(e) {
                dialog.css({
                    transform: "translate3d(-50%, -50%, 0) scale(0)",
                    opacity: 0
                }), mask.animate({
                    opacity: 0
                }, 400, (function() {
                    mask.remove();
                })), setTimeout((() => {
                    dialog.remove();
                }), 400);
            })), dialog.append(closeBtn), dialog.append(content), dialog.append(confirmBtn), 
            dialog.append(copyBtn);
            let height = $(window).height(), width = $(window).width();
            return dialog.css({
                top: height / 2,
                left: width / 2,
                opacity: 0,
                transition: "all 0.4s",
                transform: "translate3d(-50%, -50%, 0) scale(0)"
            }), mask.appendTo("body"), mask.animate({
                opacity: .5
            }), dialog.appendTo("body"), dialog.animate({}, (function() {
                dialog.css({
                    width: width - 40,
                    opacity: 1,
                    transform: "translate3d(-50%, -50%, 0) scale(1)"
                });
            })), {
                confirmBtn: confirmBtn,
                copyBtn: copyBtn
            };
        },
        paramsConfigDialog(data) {
            let box = $('<div class="params-config-dialog"></div>'), apiConfigBox = $('<div class="global-params-config"></div>'), addApi = $('<input name="api_add" placeholder="add apiname 定义添加接口名称" />'), editApi = $('<input name="api_edit" placeholder="edit apiname 定义编辑接口名称" />'), detailApi = $('<input name="api_detail" placeholder="detail apiname 定义详情接口名称" />');
            apiConfigBox.append(addApi), apiConfigBox.append(editApi), apiConfigBox.append(detailApi), 
            apiConfigBox.appendTo(box);
            let table = '<table class="params-config-dialog-table">', head = "<thead><tr>";
            head += [ "field", "title", "required", "组件名称(type)", "默认值(value)", "长度限制(maxlength)", "options", "字典名(dictname)" ].map((th => `<th>${th}</th>`)).join(""), 
            head += "</tr></thead>", table += head;
            let body = "<tbody>";
            body += data.rules.map((item => `<tr>\n        <td>${item.field}<input type="hidden" name="field" value="${item.field}" /></td>\n        <td>${item.title}<input type="hidden" name="title" value="${item.title}" /></td>\n        <td>\n          ${item.required || "false"}\n          <input type="hidden" name="required" value="${item.required || "false"}" />\n        </td>\n        <td><input type="text" value="${item.type}" name="type" placeholder="组件名称(type)" /></td>\n        <td><input type="text" value="${item.value || ""}" name="value" placeholder="默认值" /></td>\n        <td><input type="text" value="${item.maxlength || ""}" name="maxlength" placeholder="长度限制" /></td>\n        <td><textarea value="${item.options && "string" != typeof item.options ? JSON.stringify(item.options) : item.options}" name="options" placeholder="options" /></td>\n        <td><input type="text" value="${item.dictname || ""}" name="dictname" placeholder="字典名(仅select组件可用)" /></td>\n      </tr>`)).join(""), 
            body += "</tbody>", table += body, $(table).appendTo(box);
            const {confirmBtn: confirmBtn, copyBtn: copyBtn} = this.create(box);
            confirmBtn.click((function() {
                events.confirm();
            })), copyBtn.click((function() {
                events.copy();
            }));
            let events = {};
            return {
                on(type, fn) {
                    return events[type] = fn, this;
                }
            };
        }
    };
}, function(module, exports, __webpack_require__) {
    const monkey = __webpack_require__(23), message = __webpack_require__(10);
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
    const header = __webpack_require__(24);
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
            this.name = "SwaggerUI Extends", this.version = "1.0.2", this.namespace = "swagger-ui", 
            this.description = "扩展SwaggerUI搜索功能|导出Api Config配置|导出Table Config配置|导出Form Config配置", 
            this.author = "hucy", this.match = [ "http*://*/*/swagger-ui.html", "http*://*/swagger-ui.html" ], 
            this.require = [ "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js", "https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js", "https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js" ], 
            this.grant = [ "GM_addStyle", "GM_setValue", "GM_getValue", "GM_setClipboard" ];
        }
    };
}, function(module, __webpack_exports__, __webpack_require__) {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__)()(!1);
    ___CSS_LOADER_EXPORT___.push([ module.i, ".topbar{position:fixed;top:0;left:0;right:0;z-index:9999}.swagger-ui{padding-top:60px}.swagger-ui .topbar .topbar-wrapper{justify-content:space-between}.swagger-ui .opblock .opblock-summary-description{margin-left:10px}.op-btn{position:fixed;top:160px;right:20px;width:160px;height:40px;line-height:40px;text-align:center;background:#add8e6;cursor:pointer;border-radius:8px}.op-btn:hover{opacity:.8}.message{position:fixed;top:50px;background:#add8e6;padding:10px;left:50%;-ms-transform:translateX(-50%);transform:translateX(-50%)}#search-input{height:40px;width:400px}.search-result{position:fixed;top:50px;left:0;width:240px;padding:0 15px;box-shadow:0 0 10px #444;background:#fff;opacity:.5;transition:all .3s}.search-result:hover{opacity:1}.search-result-item{cursor:pointer;padding:10px 0;margin:0}.search-result-item:hover{background:#eee}.svg-button{background-color:#909399;color:#f4f4f5;display:inline-flex;height:32px;width:auto;position:relative;cursor:pointer}.svg-button:hover{background-color:#f4f4f5;color:#909399}.svg-button+.svg-button{margin-left:10px}.svg-button svg{width:100%;height:32px;position:absolute;top:0;left:0;right:0;bottom:0}.svg-button .svg-text{padding:0 20px;line-height:32px;transition:all .4s;font-size:14px;font-family:Comic Sans MS,Courier New,Microsoft YaHei,monospace}.svg-button:hover .svg-text{color:#8679f7}.svg-button .border{width:100%;height:100%;fill:none;stroke-width:2px;stroke:#909399;transition:all .6s cubic-bezier(.23,1,.32,1)}.svg-button:hover .border{stroke:#8679f7;stroke-width:2px}.tm-message{position:fixed;right:20px;background:#333;color:#ee0;border-radius:4px;padding:10px;font-size:16px;line-height:1.2em;min-height:2.4em;min-width:16em;box-shadow:0 0 10px #b9b9b9;z-index:8000}.opblock-extend-btns{padding-left:10px;padding-top:8px;padding-bottom:10px}.opblock-extend-btns input{height:32px}.sw-ui-extend-dialog{position:fixed;background-color:#fff;padding:20px 20px 70px;max-height:700px;min-height:300px;max-width:100%;min-width:80%;overflow:auto;box-shadow:0 0 10px #333;border-radius:10px;transform:translate3d(-50%,-50%,0)}.sw-ui-extend-dialog-mask{position:fixed;top:0;left:0;right:0;bottom:0;background-color:#000;opacity:0}.sw-ui-extend-close-btn{position:absolute;right:10px;top:10px;cursor:pointer;color:#61affe}.sw-ui-extend-close-btn:hover{opacity:.8}.sw-ui-extend-confirm-btn,.sw-ui-extend-copy-btn{padding:5px 10px;background-color:#61affe;color:#fff;position:absolute;bottom:20px;cursor:pointer}.sw-ui-extend-confirm-btn:hover,.sw-ui-extend-copy-btn:hover{opacity:.8}.sw-ui-extend-confirm-btn{right:20px}.sw-ui-extend-copy-btn{right:180px}.params-config-dialog{width:100%;height:100%;overflow:auto}.params-config-dialog input{padding-left:10px;height:32px;line-height:32px;margin-right:10px;width:220px}.global-params-config{margin-bottom:10px}.params-config-dialog-table{border-top:1px solid #b9b9b9;border-collapse:collapse}.params-config-dialog-table tr:nth-child(2n){background-color:#e1ffff}.params-config-dialog-table tr:hover{background-color:rgba(97,175,254,.1)}.params-config-dialog-table td,.params-config-dialog-table th{font-size:14px;text-align:left;padding:5px 10px;border-bottom:1px solid #b9b9b9;vertical-align:top;line-height:32px}", "" ]), 
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