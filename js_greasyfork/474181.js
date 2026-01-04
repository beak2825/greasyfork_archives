// ==UserScript==
// @name         自动补全
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自动补全select语句
// @author       twt
// @match        *://archery-hw.digiwincloud.com.cn/sqlquery/*
// @match        *://archery.digiwincloud.com/sqlquery/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://www.layuicdn.com/layui-v2.9.3/layui.js
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MT
// @downloadURL https://update.greasyfork.org/scripts/474181/%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/474181/%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 初始化
    const init = () => {
        let script = document.createElement("link");
        script.setAttribute("rel", "stylesheet");
        script.setAttribute("type", "text/css");
        script.href = "https://www.layuicdn.com/layui-v2.9.3/css/layui.css";
        document.documentElement.appendChild(script);
        let config = getConfig();
        common(config);
        autocompletion(config);
    };

    const event = () => {};

    function initDefaultConfig() {
        let value = [
            {
                name: "favorites",
                value: [
                    {
                        value: "",
                        text: "",
                    },
                ],
            },
            {
                name: "tenantsid",
                value: [
                    {
                        value: "",
                        text: "",
                    },
                ],
            },
            {
                name: "commonWords",
                value: [""],
            },
        ];
        value.forEach((v) => {
            GM_getValue(v.name) === undefined &&
                GM_setValue(v.name, JSON.stringify(v.value));
        });
    }

    // 获取配置
    const getConfig = () => {
        initDefaultConfig();
        let url = window.location.href;
        let region;
        let favoritesData = JSON.parse(GM_getValue("favorites"));
        let tenantsidData = JSON.parse(GM_getValue("tenantsid"));
        let commonWordData = JSON.parse(GM_getValue("commonWords"));
        let values = $.map(tenantsidData, function(item) {
            return item.value;
        });
        commonWordData.push(...values)
        if (url.indexOf("-hw") > -1) {
            favoritesData = favoritesData.filter(function (item) {
                return item.value.indexOf("华为") === 0;
            });
            region = true;
        } else {
            favoritesData = favoritesData.filter(function (item) {
                return item.value.indexOf("微软") === 0;
            });
            region = false;
        }
        return {
            region: region,
            favoritesData: favoritesData,
            tenantsidData: tenantsidData,
            commonWordData: commonWordData,
        };
    };

    // 初始化
    const common = (config) => {
        $("#limit_num").val(0);
        $(".panel-heading.form-inline").each(function () {
            // 创建要添加的元素
            let newElement = $(
                '<select id="tenantsid" name="tenantsid" multiple="true" data-actions-box="true" \n' +
                '            class="form-control selectpicker"\n' +
                '            data-live-search="true"\n' +
                '            data-live-search-placeholder="搜索" title="常用租户"\n' +
                '            required="" tabindex="-98">\n' +
                "    </select>" +
                ' <div class="form-group"><input id="request" type="text" class="form-control" placeholder="ESP入参"> </div>\n' +
                ' <input id="btn-delete" type="button" class="btn btn-primary" style="margin-left: 5px" value="清空条件">\n' +
                ' <input id="turn-to-pinpoint" type="button" class="btn btn-danger" style="margin-left: 5px" value="跳转pinpoint记录">\n' +
                ' <input id="setting" type="button" class="btn btn-info" style="margin-left: 5px" value="设置">\n'
            );
            // 将新元素添加到当前 <div> 元素中
            $(this).append(newElement);
        });
        let favorites = $("#favorites");
        let favoritesData = config.favoritesData;
        $.each(favoritesData, function (index, optionData) {
            let option = $("<option></option>")
            .val(optionData.value)
            .text(optionData.text);
            favorites.append(option);
        });
        let tenantsid = $("#tenantsid");
        let tenantsidData = config.tenantsidData;
        let tenantsidContent =
            window.sessionStorage.getItem("tenantsidContent");
        // 将字符串转换为数组
        let sessionTenantsidData = [];
        if (tenantsidContent) {
            sessionTenantsidData = JSON.parse(tenantsidContent);
        }
        tenantsidData.push(...sessionTenantsidData);
        // 去重
        let optionsMap = new Map();
        tenantsidData.forEach(function (option) {
            optionsMap.set(option.value, option);
        });
        tenantsidData = Array.from(optionsMap.values());
        $.each(tenantsidData, function (index, optionData) {
            let option = $("<option></option>")
            .val(optionData.value)
            .text(optionData.text);
            tenantsid.append(option);
        });
        window.sessionStorage.setItem(
            "tenantsidContent",
            JSON.stringify(tenantsidData)
        );
    };

    // 自动补全
    const autocompletion = (config) => {
        let commonWords = config.commonWordData;
        let tenantsidContent =
            window.sessionStorage.getItem("tenantsidContent");
        let array = [];
        if (tenantsidContent) {
            array = JSON.parse(tenantsidContent);
        }
        $.each(array, function (index, tenantsid) {
            commonWords.push(tenantsid.value);
        });
        let tables = [];
        $.each(commonWords, function (index, commonWord) {
            tables.push({
                name: commonWord,
                value: commonWord,
                caption: commonWord,
                meta: "common",
                score: 100,
            });
        });
        setCompleteData(tables);
        //console.log(aesDecrypt());
    };
    init();
    // 表名切换触发补全sql语句
    $("#table_name").change(function () {
        let tableName = $(this).val();
        let sqlContent = editor.getValue();
        readClipboard(true).then(function (tenantsid) {
            if ($("#tenantsid").val() !== "") {
                tenantsid = $("#tenantsid").val();
            }
            if (!/\b\d{15}\b/.test(tenantsid)) {
                tenantsid = "";
            }
            if (sqlContent == undefined || $.trim(sqlContent).length === 0) {
                sqlContent += "";
            } else {
                sqlContent += "\n";
            }
            sqlContent +=
                "select * from " +
                tableName +
                " where tenantsid in (" +
                tenantsid +
                ")";
            window.sessionStorage.setItem("sqlContent", sqlContent);
            editor.setValue(sqlContent);
        });
    });
    // 获取剪切板数据
    function readClipboard() {
        return new Promise(function (resolve, reject) {
            if (navigator.clipboard && navigator.clipboard.readText) {
                navigator.clipboard
                    .readText()
                    .then(function (text) {
                    resolve(text);
                })
                    .catch(function (error) {
                    console.error("读取剪贴板失败: " + error);
                    resolve("");
                });
            } else {
                console.error("浏览器不支持读取剪贴板的API");
                resolve("");
            }
        });
    }
    // 常用查询
    $("#favorites")
        .off("change")
        .on("change", function () {
        sessionStorage.setItem("re_query", "true");
        let region_name = $(this).val().split("-")[0];
        let instance_name = $(this).val().split("-")[1];
        let db_name = $(this).val().split("-")[2];
        let isBm = db_name.indexOf("bm") > -1;
        $("#instance_name").selectpicker(
            "val",
            region_name == "华为"
            ? "华为云-" + instance_name + "-Tiger" + (isBm ? "-BM" : "")
            : "微软云-" +
            instance_name +
            "-[digiwincloud-prod-tiger]-Tiger" +
            (isBm ? "_BM" : "")
        );
        if ($("#instance_name").val()) {
            $("#instance_name").selectpicker().trigger("change");
        }

        $("#db_name").selectpicker("val", db_name);
        if ($("#db_name").val()) {
            $("#db_name").selectpicker().trigger("change");
        }
        sessionStorage.removeItem("re_query");
    });
    // 清空栏位选项
    $("#btn-delete").click(function () {
        //document.getElementById("tenantsid").options.selectedIndex = 0;
        //$("#tenantsid").prop('checked', false);
        $("#tenantsid").val([]);
        $("#tenantsid").selectpicker("refresh");
        document.getElementById("favorites").options.selectedIndex = 0;
        $("#favorites").selectpicker("refresh");
        $("#request").val("");
    });

    // 跳转pinpoint
    $("#turn-to-pinpoint").click(function () {
        var request = $("#request").val().trim();
        let pinpointIdIndex = request.indexOf("pinpointId:");
        let pinpointId = request
        .substring(pinpointIdIndex)
        .split(":")[1]
        .trim()
        .split(" ")[0]
        .trim();
        if (pinpointId) {
            let prefix = pinpointId.split("^")[0];
            window.open(
                "https://tracing-hw.digiwincloud.com.cn/transactionDetail/" +
                pinpointId +
                "/0/" +
                prefix +
                "/-1",
                "_blank"
            );
        }
    });

    $("#request").blur(function () {
        var request = $("#request").val().trim();
        $("#turn-to-pinpoint").prop("disabled", !request);
        try {
            let securityTokenIndex = request.indexOf("security-token:");
            let securityToken = request
            .substring(securityTokenIndex)
            .split(":")[1]
            .trim()
            .split(" ")[0]
            .trim();
            let content = aesDecrypt(
                "1234567823456789",
                "VDiGiWindIgIwInV",
                securityToken
            );
            console.log(content);
            let sid = JSON.parse(content).context.profile.tenantSid;
            let name = JSON.parse(content).context.profile.tenantName;
            appendValue(sid, name);
        } catch {
            console.log("ESP入参不正确！");
        }
    });

    // 查询快捷键
    editor.commands.addCommand({
        name: "selectSql",
        bindKey: { win: "Ctrl-B", mac: "Command-B" },
        exec: function (editor) {
            //let currentPosition = editor.selection.getCursor();
            editor.selection.selectLine();
            $("#btn-sqlquery").click();
        },
    });

    // 复制快捷键
    editor.commands.addCommand({
        name: "copySql",
        bindKey: { win: "Ctrl-D", mac: "Command-D" },
        exec: function (editor) {
            let selectedText = editor.session.getTextRange(
                editor.getSelectionRange()
            );
            if (selectedText.length === 0) {
                // 如果没有选择文本，则复制整行
                selectedText = editor.session.getLine(
                    editor.selection.getCursor().row
                );
            }
            let line = editor.selection.getCursor().row + 1;
            editor.session.getDocument().insertFullLines(line, [selectedText]);
            editor.gotoLine(line + 1);
        },
    });

    // 删除快捷键
    editor.commands.addCommand({
        name: "deleteSql",
        bindKey: { win: "Ctrl-Y", mac: "Command-Y" },
        exec: function (editor) {
            // 获取当前光标所在的行号
            var currentRow = editor.getCursorPosition().row;

            // 获取当前行的文本
            var currentLine = editor.session.getLine(currentRow);

            // 创建当前行的范围对象
            var currentLineRange = new ace.Range(
                currentRow,
                0,
                currentRow,
                currentLine.length
            );

            // 删除当前行
            editor.session.remove(currentLineRange);
            editor.gotoLine(editor.selection.getCursor().row);
        },
    });

    function aesDecrypt(iv, key, content) {
        content = (content + "").replace(/\n*$/g, "").replace(/\n/g, "");
        key = CryptoJS.enc.Utf8.parse(key);
        iv = CryptoJS.enc.Utf8.parse(iv);
        let decrypted = CryptoJS.AES.decrypt(content, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    function appendValue(value, name) {
        // 从 sessionStorage 中获取存储的字符串
        let tenantsidContent =
            window.sessionStorage.getItem("tenantsidContent");

        // 将字符串转换为数组
        let array = [];
        if (tenantsidContent) {
            array = JSON.parse(tenantsidContent);
        }

        // 检查新值是否已存在
        let existingItem = array.find((item) => item.value === value);
        if (!existingItem) {
            layer.confirm('当前租户id未设置，是否需要添加？', {icon: 3}, function(){
                let tenantsidData = JSON.parse(GM_getValue("tenantsid"));
                tenantsidData.push({
                    value: value, text: name + "-" + value
                })
                GM_setValue("tenantsid", JSON.stringify(tenantsidData));
                layer.msg('添加成功！', {icon: 1});
            });
            // 向数组中添加新元素
            array.push({ value: value, text: name + "-" + value });
            // 将更新后的数组转换为字符串并存储回 sessionStorage 中
            window.sessionStorage.setItem(
                "tenantsidContent",
                JSON.stringify(array)
            );
            $("#tenantsid").append(
                $("<option></option>")
                .val(value)
                .text(name + " - " + value)
            );
            setCompleteData({
                name: value,
                value: value,
                caption: value,
                meta: "common",
                score: 100,
            });
        }
        $("#tenantsid").selectpicker("val", value);
        $("#tenantsid").selectpicker("refresh");
    }

    function onAdd(params) {
        const body = document.body.querySelector(".self-popover-content-body");
        const div = document.createElement("div");
        div.innerHTML =
            '<div><input type="text" name="field"><button name="delete">删除</span></button>';
        body.append(div);
    }

    $("#setting").click(function () {
        let favorites = JSON.parse(GM_getValue("favorites"));
        let commonWords = JSON.parse(GM_getValue("commonWords"));
        let tenantsid = JSON.parse(GM_getValue("tenantsid"));
        let doc =
            '<div class="layui-tab" lay-filter="test-hash" style="padding-left: 5px; padding-right: 5px; overflow-x: hidden;"> <ul class="layui-tab-title"> <li class="layui-this" lay-id="11">常用查询</li> <li lay-id="22">常用租户</li> <li lay-id="33">常用提示词</li> </ul> <div class="layui-tab-content"><div class="layui-tab-item layui-show" name="dialog-favorites">';
        doc +=
            '<div class="layui-btn-container"><button type="button" class="layui-btn" name="dialog-add1">新增</button></div>';
        favorites.forEach(function (item) {
            let value = item.value;
            let text = item.text;
            doc +=
                '<div class="layui-row layui-col-space16" name="name-value1">';
            doc +=
                '<div class="layui-col-md5"><input type="text" name="value" value="' +
                value +
                '" placeholder="获取栏位值，例：华为-测试区-bm_sdsc" class="layui-input"></div>';
            doc +=
                '<div class="layui-col-md5"><input type="text" name="text" value="' +
                text +
                '" placeholder="显示下拉值，例：sdsc测试区" class="layui-input"></div>';
            doc +=
                '<div class="layui-col-md1"><button class="layui-btn layui-btn-danger" name="dialog-delete">删除</button></div>';
            doc += "</div>";
        });
        doc += '</div><div class="layui-tab-item" name="dialog-tenantsid">';
        doc +=
            '<div class="layui-btn-container"><button type="button" class="layui-btn" name="dialog-add2">新增</button></div>';
        tenantsid.forEach(function (item) {
            let value = item.value;
            let text = item.text;
            let name = text.split("-");
            doc +=
                '<div class="layui-row layui-col-space16" name="name-value2">';
            doc +=
                '<div class="layui-col-md5"><input type="text" name="value" value="' +
                value +
                '" placeholder="租户ID，例：381816595907136" class="layui-input"></div>';
            doc +=
                '<div class="layui-col-md5"><input type="text" name="text" value="' +
                name[0] +
                '" placeholder="租户名称，例：72005332租户" class="layui-input"></div>';
            doc +=
                '<div class="layui-col-md1"><button class="layui-btn layui-btn-danger" name="dialog-delete">删除</button></div>';
            doc += "</div>";
        });
        doc += '</div> <div class="layui-tab-item" name="dialog-commonWords">';
        doc +=
            '<div class="layui-btn-container"><button type="button" class="layui-btn" name="dialog-add3">新增</button></div>';
        commonWords.forEach(function (item) {
            let value = item;
            doc +=
                '<div class="layui-row layui-col-space16" name="name-value3">';
            doc +=
                '<div class="layui-col-md5"><input type="text" name="value" value="' + value + '" placeholder="常用词提示，租户ID会自动提示" class="layui-input"></div>';
            doc +=
                '<div class="layui-col-md1"><button class="layui-btn layui-btn-danger" name="dialog-delete">删除</button></div>';
            doc += "</div>";
        });
        doc += "</div></div></div>";
        //footer.innerHTML =
        // '<button name="save" class="layui-btn layui-bg-blue layui-btn-sm">保存</button><button name="close" class="layui-btn layui-btn-primary layui-border layui-btn-sm">关闭</button>';

        layer.open({
            type: 1, // page 层类型
            area: ["700px", "500px"],
            title: "常用设置",
            shade: 0.6, // 遮罩透明度
            shadeClose: true, // 点击遮罩区域，关闭弹层
            maxmin: true, // 允许全屏最小化
            anim: 0, // 0-6 的动画形式，-1 不开启
            content: doc,
            btn: ["确认", "关闭"],
            btn1: function (index, layero, that) {
                let name_value = $(layero).find('div[name="name-value1"]');
                let favoritesArray = [];
                name_value.each(function () {
                    let valueInput = $(this).find('input[name="value"]');
                    let textInput = $(this).find('input[name="text"]');
                    let value = valueInput.val();
                    let text = textInput.val();

                    let favorites = {
                        value: value,
                        text: text,
                    };

                    favoritesArray.push(favorites);
                });
                GM_setValue("favorites", JSON.stringify(favoritesArray));
                let name_value2 = $(layero).find('div[name="name-value2"]');
                let tenantsidArray = [];
                name_value2.each(function () {
                    let valueInput = $(this).find('input[name="value"]');
                    let textInput = $(this).find('input[name="text"]');
                    let value = valueInput.val();
                    let text = textInput.val();

                    let tenantsid = {
                        value: value,
                        text: text + "-" + value,
                    };

                    tenantsidArray.push(tenantsid);
                });
                GM_setValue("tenantsid", JSON.stringify(tenantsidArray));
                let name_value3 = $(layero).find('div[name="name-value3"]');
                let commonWordsArray = [];
                name_value3.each(function () {
                    let valueInput = $(this).find('input[name="value"]');
                    let value = valueInput.val();
                    commonWordsArray.push(value);
                });
                GM_setValue("commonWords", JSON.stringify(commonWordsArray));
                layer.msg("保存成功！", {icon: 1}, function () {
                    location.reload();
                });
            },
            btn2: function (index, layero, that) {
                layer.close(index);
            },
            success: function (layero, index, that) {
                $(layero).on(
                    "click",
                    "button[name='dialog-delete']",
                    function () {
                        $(this).parent().parent().remove();
                    }
                );

                $(layero).on(
                    "click",
                    "button[name='dialog-add1']",
                    function () {
                        var favorites = $('*[name="dialog-favorites"]');
                        const div = document.createElement("div");
                        let doc = "";
                        doc +=
                            '<div class="layui-row layui-col-space16" name="name-value1">';
                        doc +=
                            '<div class="layui-col-md5"><input type="text" name="value" placeholder="获取栏位值，例：华为-测试区-bm_sdsc" class="layui-input"></div>';
                        doc +=
                            '<div class="layui-col-md5"><input type="text" name="text" placeholder="显示下拉值，例：sdsc测试区" class="layui-input"></div>';
                        doc +=
                            '<div class="layui-col-md2"><button class="layui-btn layui-btn-danger" name="dialog-delete">删除</button></div>';
                        doc += "</div>";
                        div.innerHTML = doc;
                        favorites.append(div);
                    }
                );

                $(layero).on(
                    "click",
                    "button[name='dialog-add2']",
                    function () {
                        var favorites = $('*[name="dialog-tenantsid"]');
                        const div = document.createElement("div");
                        let doc = "";
                        doc +=
                            '<div class="layui-row layui-col-space16" name="name-value2">';
                        doc +=
                            '<div class="layui-col-md5"><input type="text" name="value" value="" placeholder="租户ID，例：381816595907136" class="layui-input"></div>';
                        doc +=
                            '<div class="layui-col-md5"><input type="text" name="text" value="" placeholder="租户名称，例：72005332租户" class="layui-input"></div>';
                        doc +=
                            '<div class="layui-col-md1"><button class="layui-btn layui-btn-danger" name="dialog-delete">删除</button></div>';
                        doc += "</div>";
                        div.innerHTML = doc;
                        favorites.append(div);
                    }
                );

                $(layero).on(
                    "click",
                    "button[name='dialog-add3']",
                    function () {
                        var commonWords = $('*[name="dialog-commonWords"]');
                        const div = document.createElement("div");
                        let doc = "";
                        doc +=
                            '<div class="layui-row layui-col-space16" name="name-value3">';
                        doc +=
                            '<div class="layui-col-md5"><input type="text" name="value" placeholder="常用词提示，租户ID会自动提示" class="layui-input"></div>';
                        doc +=
                            '<div class="layui-col-md1"><button class="layui-btn layui-btn-danger" name="dialog-delete">删除</button></div>';
                        doc += "</div>";
                        div.innerHTML = doc;
                        commonWords.append(div);
                    }
                );
            },
        });
    });

    function getSecondSpaceIndex(str) {
        var pattern = /\s{2}/g;
        var match;
        var count = 0;
        var index = -1;

        str = $("<div>").text(str).html();

        while ((match = pattern.exec(str))) {
            count++;
            if (count === 2) {
                index = match.index + 1;
                break;
            }
        }
        return str.substring(index - 1, str.length);
    }
})();
