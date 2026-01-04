// ==UserScript==
// @name         Enhance Yun API Platform
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Customized HTML title, etc.
// @author       You
// @match        http://hpapi.atlas.oa.com/*
// @require      https://greasyfork.org/scripts/370236-waitforkeyelements/code/waitForKeyElements.user.js
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @require      https://cdn.bootcss.com/bootstrap/2.3.1/js/bootstrap.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369313/Enhance%20Yun%20API%20Platform.user.js
// @updateURL https://update.greasyfork.org/scripts/369313/Enhance%20Yun%20API%20Platform.meta.js
// ==/UserScript==

var $ = window.jQuery;
var hookAjax = window.hookAjax;

var config = {
    autoFillBackendServer: false,
    autoCloseWhenAutoFillSucceed: false,
};

(function () {
    'use strict';

    var utils = {
        getQueryVariable: function (variable) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            console.log('Query variable %s not found', variable); 3
        },
        getLocation: function (href) {
            var l = document.createElement("a");
            l.href = href;
            return l;
        },
        isInterfacePage: function (env) {
            var pathSet = new Set([
                '/access/new/add-v3',     // 新增接口页
                '/access/new/add-test',   // 测试环境 (env=api_test_master)、预发布环境 (api_pre_release)
                '/access/new/edit',       // 开发联调环境 (env=api_test)、线上环境 (env=api_formal)
            ]);
            if (!env) {
                return pathSet.has(path);
            } else {
                switch (env) {
                    case "api_test":
                    case "api_formal":
                        return path === '/access/new/edit';
                        break;
                    case "api_test_master":
                    case "api_pre_release":
                        return path === '/access/new/add-test';
                        break;
                }
            }
        },
        isInterfaceListPage: function () {
            var pathSet = new Set([
                '/',                            // 开发联调环境
                '/access/list/test',            // 开发联调环境
                '/access/list/test-test',       // 测试环境
                '/access/list/pre-release',     // 预发布环境
                '/access/list/online',          // 线上环境
            ])
            return pathSet.has(path);
        },
        isComplexObjectPage: function () {
            return path === "/access/ComplexObject/add";
        },
        isTestToolPage: function () {
            return path.startsWith("/access/console/index");
        },
        difference: function (setA, setB) {
            var _difference = new Set(setA);
            for (var elem of setB) {
                _difference.delete(elem);
            }
            return _difference;
        },
    };

    var path = location.pathname;
    var env = utils.getQueryVariable('env');

    function beautifyTabTitle() {
        // 改 title
        var pathToTitle = {
            "/access/new/add-v3": "新增接口",

            "/": "接口列表 | 开发联调环境",
            "/access/list/test": "接口列表 | 开发联调环境",
            "/access/error/index-test": "错误日志 | 开发联调环境",
            "/access/console/index-test": "测试工具 | 开发联调环境",

            "/access/list/test-test": "接口列表 | 测试环境",

            "/access/list/pre-release": "接口列表 | 预发布环境",

            "/access/list/online": "接口列表 | 线上环境",
            "/access/error/index": "错误日志 | 线上环境",
            "/access/console/index": "测试工具 | 线上环境",

            "/access/permission/online": "配置产品权限",
            "/access/onlineAddress/online": "配置线上后端地址",
            "/access/ComplexObject/complex-object-list": "复杂类型列表",
        };
        for (var p in pathToTitle) {
            if (path === p) {
                document.title = pathToTitle[p] + " | 云 API";
                return;
            }
        }

        if (path === "/access/ComplexObject/add") {
            document.title = "复杂类型 " + utils.getQueryVariable("n") + " | 云 API";
        } else if (path === "/access/new/edit") {
            if (env === "api_test") {
                document.title = "接口 " + utils.getQueryVariable("a") + " | 开发联调环境 | 云 API";
            } else if (env === "api_formal") {
                document.title = "接口 " + utils.getQueryVariable("a") + " | 线上环境 | 云 API";
            }
        } else if (path === "/access/new/add-test") {
            if (env === "api_test_master") {
                document.title = "接口 " + utils.getQueryVariable("a") + " | 测试环境 | 云 API";
            } else if (env === "api_pre_release") {
                document.title = "接口 " + utils.getQueryVariable("a") + " | 预发布环境 | 云 API";
            }
        }
    }

    function beautifyPageElements() {
        // 占页面太多空间的元素，缩减空间
        $('#defined_module_errors').css('height', '100px').css('overflow', 'auto');
        $("[name='input_example[]']").attr('rows', 6);
        $("[name='output_example[]']").attr('rows', 6);
    }

    function addButtonsForSettingComplexObject() {
        var buttons = `
    <div class="control-group">
    <button class="btn green" id="btn-required">入参全部不必填</button>
    <button class="btn green" id="btn-nullable").val('1')">出参全部允许为空</button>
    <button class="btn green" id="btn-type">类型全部设成 String</button>
    <button class="btn green" id="btn-compare-modal">与 JSON 数据比较</button>
    </div>`;
        $(buttons).insertAfter($('#api_form').children()[0]);
        $('#btn-required').click(function (e) {
            e.preventDefault();
            $("[name='required[]']").val('0');
        });
        $('#btn-nullable').click(function (e) {
            e.preventDefault();
            $("[name='value_allowed_null[]']").val('1');
        });
        $('#btn-type').click(function (e) {
            e.preventDefault();
            $("[name='type[]']").val('string');
        });
        $('#btn-compare-modal').click(function (e) {
            e.preventDefault();
            $('#compareModal').modal('show')
        })

        var compareModal = `
<div id="compareModal" class="modal hide fade" tabindex="-1">
  <div class="modal-header">
    <h3>与真实数据比较</h3>
  </div>
  <div class="modal-body">
    <p>输入你想比较的 JSON 数据：</p>
    <textarea id="textarea-json-data" rows="4" cols="50" style="font-family: 'Noto Sans Mono', 'Consolas', monospace; width: auto"></textarea>
    <p>比较结果：</p>
    <textarea id="textarea-compare-result" rows="6" cols="50" style="font-family: 'Noto Sans Mono', 'Consolas', monospace; width: auto" readonly></textarea>
  </div>
  <div class="modal-footer">
    <button class="btn" data-dismiss="modal">关闭</button>
    <button class="btn green" id="btn-compare">比较</button>
  </div>
</div>`;
        $("body").append($(compareModal));

        $('#btn-compare').click(function (e) {
            e.preventDefault();

            var definedFields = new Set($("[name='member_name[]'").map(function () {
                return $(this).val() ? $(this).val() : null;
            }).get());
            var data = JSON.parse($('#textarea-json-data').val());
            var dataFields = new Set(Object.keys(data))

            var result = {
                missing: utils.difference(definedFields, dataFields),
                redundant: utils.difference(dataFields, definedFields),
            };

            var output = ['缺少的字段：'];
            result.missing.forEach(function (field) {
                output.push(`- ${field}`);
            })
            output.push('');
            output.push('多余的字段：');
            result.redundant.forEach(function (field) {
                output.push(`- ${field}`);
            })

            $('#textarea-compare-result').val(output.join('\n'));
        });
    }

    function hookInterfaceListResponse() {
        var recordStatus = {
            0: '待自测', 1: '待审核', 2: '审核不通过', 9: '待发布', 3: '已发布'
        }

        function tamperResponse(xhr) {
            var response = JSON.parse(xhr.responseText);
            var l = response.data.data;
            for (var i = 0; i != l.length; ++i) {
                if (l[i].record_status != 9) {
                    l[i].action_label += " (" + recordStatus[l[i].record_status] + ")";
                    l[i].record_status = 9;
                }
            }
            xhr.responseText = JSON.stringify(response);
        }

        hookAjax({
            onreadystatechange: function (xhr) {
                if (xhr.responseText.length == 0) {
                    return;
                }
                var location = utils.getLocation(xhr.responseURL);
                if (location.pathname.endsWith("/access/list/test")) {
                    tamperResponse(xhr);
                }
            },
            onload: function (xhr) {
                if (xhr.responseText.length == 0) {
                    return;
                }
                var location = utils.getLocation(xhr.responseURL);
                if (location.pathname.endsWith("/access/list/test")) {
                    tamperResponse(xhr);
                }
            }
        });

        // 如果在开发联调环境接口列表页，点一次刷新按钮以走 hook
        if (location.pathname === "/access/list/test") {
            setTimeout(function () {
                $(".fresh").click();
            }, 1000);
        }
    }

    function addJsonUtilForApiTestTool() {
        function isObject(obj) {
            return obj === Object(obj);
        }

        function transformKey(key) {
            return key.charAt(0).toUpperCase() + key.substr(1);
        }

        function parseObject(obj, prefix, transformFunc) {
            var segments = [];
            for (var key in obj) {
                var value = obj[key];

                var keyTransformed = transformFunc(key);
                var currentPrefix = prefix ? `${prefix}.${keyTransformed}` : keyTransformed;

                if (isObject(value)) {
                    Array.prototype.push.apply(segments, parseObject(value, currentPrefix, transformFunc));
                } else {
                    // Primitive type
                    segments.push(`${currentPrefix}=${value}`);
                }
            }
            return segments;
        }

        var utilNode = `<br><a id="parse-json" href='#'>从 JSON 转换（自动首字母大写）</a>`;
        $(utilNode).insertAfter($('#data'));
        $('#parse-json').click(function (e) {
            e.preventDefault();
            var o = JSON.parse($('#data').val());
            $('#data').val(parseObject(o, '', transformKey).join('&'));
        });
    }

    function showLinkkForInterface(isTestEnv) {
        $('#action').on('change', function () {
            // http://hpapi.atlas.oa.com/access/new/edit?a=DescribeScalableRuleAttribute&m=tsf&version=2018-03-26&env=api_test
            // http://hpapi.atlas.oa.com/access/new/edit?a=DescribeScalableRuleAttribute&m=tsf&version=2018-03-26&env=api_formal
            var action = $(this).val();
            var module_ = $("#module").val();
            var version = $("#version").val();
            var env = isTestEnv ? "api_test" : "api_formal";

            var url = `/access/new/edit?a=${action}&m=${module_}&version=${version}&env=${env}`;
            var linkElements = $($($(this).parent()).find('a'));
            var linkElement = linkElements.length ? $(linkElements[0]) : null;

            if (linkElement) {
                linkElement.attr('href', url);
            } else {
                $(`<a href="${url}" target="_blank">接口链接</a>`).insertAfter($(this));
            }
        });
        $('#action').change();
    }

    function showLinkForComplexObject() {
        // 兼容「单个复杂类型」和「复杂类型数组」
        var pattern = /([A-Za-z]+)\(([A-Za-z]+)\/(\d{4}-\d{2}-\d{2})\)/;
        var genUrl = function (ary) {
            return `/access/ComplexObject/add?n=${ary[1]}&m=${ary[2]}&version=${ary[3]}&env=api_formal`;
        }

        $("[name='type[]'], [name='out_type[]']").each(function (i, element) {
            var ary = pattern.exec($(element).val());
            if (ary) {
                $(element).css('cssText', 'width: 110px !important');
                $(`<a href="${genUrl(ary)}" target="_blank">↗</a>`).insertAfter($(element));
            }
        }).on('change', function () {
            var ary = pattern.exec($(this).val());
            var linkElement = $(this).next().length ? $($(this).next()[0]) : null;
            if (ary) {
                $(this).css('cssText', 'width: 110px !important');
                if (linkElement) {
                    linkElement.attr('href', genUrl(ary));
                } else {
                    $(`<a href="${genUrl(ary)}" target="_blank">↗</a>`).insertAfter($(this));
                }
            } else {
                $(this).css('cssText', '');
                if (linkElement) {
                    $(linkElement).remove();
                }
            }
        });
    }

    function autofillInInterfacePage() {
        // 目前功能是帮忙填线上后端地址，后续可以考虑把啰嗦的字段全部填了
        $('#url_type').val(0).change();
        var existedUrlElements = $('.para_body_multi_url');
        for (var i = 0; i != existedUrlElements.length; ++i) {
            if ($(existedUrlElements[i]).is(":visible")) {
                $(existedUrlElements[i]).find("#delPara_multi_url").click();
            }
        }

        $('#addPara_multi_url').click();
        $('#addPara_multi_url').click();
        $('#addPara_multi_url').click();

        var regions = $("[name='region[]']");
        $(regions[0]).val('ap-guangzhou');
        $(regions[1]).val('ap-chongqing');
        $(regions[2]).val('ap-shanghai');

        var urls = $("[name='url[]']");
        $(urls[0]).val('http://10.225.30.168:15000/tsf');
        $(urls[1]).val('http://100.98.100.21:15000/tsf');
        $(urls[2]).val('http://sh.oss.tsf.tencentyun.com:15000/tsf');

        if (config.autoCloseWhenAutoFillSucceed) {
            var testIfSucceed = function(xhr) {
                debugger;
                if (xhr.responseText.length == 0) {
                    return;
                }
                var location = utils.getLocation(xhr.responseURL);
                if (location.pathname === "/access/new/save-v3") {
                    var response = JSON.parse(xhr.responseText);
                    if (response.code === 0) {
                        window.close();
                    }
                }
            }
            hookAjax({
                onreadystatechange: testIfSucceed,
                onload: testIfSucceed,
            });
            debugger;
        }

        $("[type='submit']").click();
    }

    beautifyTabTitle();
    beautifyPageElements();

    if (utils.isInterfaceListPage()) {
        hookInterfaceListResponse();
    }

    if (utils.isComplexObjectPage()) {
        addButtonsForSettingComplexObject();
    }

    if (utils.isTestToolPage()) {
        var isTestEnv = path.endsWith('test');

        addJsonUtilForApiTestTool();
        showLinkkForInterface(isTestEnv);
    }

    if (utils.isInterfacePage() || utils.isComplexObjectPage()) {
        showLinkForComplexObject();
    }

    // 给预发布环境刷后端服务地址，平时不用
    if (config.autoFillBackendServer) {
        if (env === 'api_pre_release' && utils.isInterfacePage('api_pre_release')) {
            autofillInInterfacePage();
        }
    }
})();
