// ==UserScript==
// @name              jira代码库选择助手
// @namespace         ""
// @version           2.0.4
// @description       增强jira代码库选择功能-自定义配置
// @author            C盘先生
// @license           GPL
// @supportURL        ""
// @match             *://jira.flyudesk.com/browse/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require           https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @run-at            document-idle
// @grant             unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/382684/jira%E4%BB%A3%E7%A0%81%E5%BA%93%E9%80%89%E6%8B%A9%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/382684/jira%E4%BB%A3%E7%A0%81%E5%BA%93%E9%80%89%E6%8B%A9%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    'use esversion:6';

    const DEVELOP_BUTTON_TEXT = "开发";
    const CODE_LIB_TEXT = "代码库";
    const DEVELOP_BRANCH_TEXT = "开发分支";
    const DEVELOPER_TEXT = "开发人";
    const PROJECT_GROUP_TEXT = "项目组";
    const NONE = "无";
    const PANEL_STATUS = {
        unfold: 1,
        fold: 2
    }

    var timer = (new Date()).getTime();
    var currentUserId = null;
    var userKey = null;
    var developDialogTest = null;

    if (!hasPanel()) {
        getCurrentUserInfo().then(({ key }) => {
            userKey = key;
            createPanel();
        });
        requireCss("https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css");
    }

    function requireCss(href) {
        $(`<link type="text/css" rel="stylesheet" href="${href}">`).appendTo($("body"));
    }

    function getIssueId() {
        return jira.app.issue.getIssueId();
    }

    function getCustomFieldsPromise() {
        return new Promise(function(resolve, reject) {
            var url = "/rest/api/2/field";
            $.get(url).then(function(response) {
                resolve(response);
            });
        });
    }

    function getIssueKey() {
        let issueId = getIssueId();

        return new Promise(function(resolve, reject) {
            var url = `/rest/api/2/issue/${issueId}`;
            $.get(url).then(function(response) {
                resolve(response.key || null);
            });
        });
    }

    function getEditmeta() {
        var editmetaCache;
        var issueId = getIssueId();
        return new Promise(function(resolve, reject) {
            if (editmetaCache) {
                resolve(editmetaCache);
            } else {
                var url = '/rest/api/2/issue/' + issueId + '/editmeta';
                $.get(url).then(function(response) {
                    editmetaCache = response.fields;
                    resolve(response.fields || []);
                });
            }
        });
    }

    function arrayFind(objects, field, value) {
        var result = null;
        for (var i in objects) {
            if (Object.prototype.hasOwnProperty.call(objects, i)) {
                if (objects[i][field] === value) {
                    result = objects[i];
                }
            }
        }
        // var length = array.length;
        // for (var i = 0; i < length; i++) {
        //     if (array[i][field] === value) {
        //         result = array[i];
        //         return;
        //     }
        // }
        return result;
    }

    function getCodeLibOptions(fields) {
        var codeLibName = "代码库";
        var codeLibField = arrayFind(fields, "name", codeLibName);
        if (codeLibField) {
            return codeLibField.allowedValues;
        }
        return [];
    }

    function getGroupOptions(fields) {
        var codeLibName = "项目组";
        var codeLibField = arrayFind(fields, "name", codeLibName);
        if (codeLibField) {
            return codeLibField.allowedValues;
        }
        return [];
    }


    function hasPanel() {
        return $("#udesk-jira-control-panel").length;
    }

    function createOption(config) {
        getEditmeta().then(function(response) {
            if (response) {
                var codeLibOptions = getCodeLibOptions(response);
                createCodeLibSelect(codeLibOptions, config.defaultDeveloperLib);
                var groupOptions = getGroupOptions(response);
                createGroupOptionsSelect(groupOptions, config.defaultGroup);
            }
        });

        //开发人
        //autocomplete
        $("#udesk-default-developer").autocomplete({
            source: function({ term }, response) {
                $.get(`/rest/api/1.0/users/picker?fieldName=customfield_10300`, { query: term }).then(data => {
                    data = formatData(data);
                    response(data);
                });
            },
            minLength: 2,
            select: function(event, ui) {}
        });
    }

    function formatData(data) {
        if (!data) {
            return [];
        }
        let users = $(data).find("users");
        let result = [];
        users.each((index, ele) => {
            let $ele = $(ele);
            result.push({
                value: $ele.find("name").text(),
                label: $ele.find("displayName").text(),
            });
        });
        return result;
    }

    function createCodeLibSelect(options, values = []) {
        var htmls = [`<select multiple='multiple' size='10' id='udesk-jira-code-lib-select'>`];
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (values.find(value => {
                    return value === option.id;
                })) {
                htmls.push('<option selected="selected" value="' + option.id + '">' + option.value + '</option>');
            } else {
                htmls.push('<option value="' + option.id + '">' + option.value + '</option>');
            }
        }
        htmls.push("</select>");
        $("#udesk-jira-control-panel #udesk-default-develop-lib").append(htmls.join(""));
    }

    function createGroupOptionsSelect(options, value) {
        var htmls = [`<select id='udesk-jira-group-option-select'>`];
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.id === value) {
                htmls.push('<option selected="selected" value="' + option.id + '">' + option.value + '</option>');
            } else {
                htmls.push('<option value="' + option.id + '">' + option.value + '</option>');
            }
        }
        htmls.push("</select>");
        $("#udesk-jira-control-panel #udesk-default-group").append(htmls.join(""));
        $("#udesk-jira-group-option-select").selectmenu();
    }

    function createPanelStyle(top = 0, left) {
        let result = `top:${top};`;
        if (left == null) {
            result += "right:0;";
        } else {
            result += `left:${left};`;
        }
        return result;
    }

    function createPanel() {
        let storageKey = getStorageKey();
        let panelStorageKey = getStorageKey("panel-status");
        let panelConfig = getFromStorage(panelStorageKey) || {};
        let panelStatus = panelConfig.panelStatus === PANEL_STATUS.fold ? "udesk-jira-control-panel-fold" : "udesk-jira-control-panel-unfold";
        let panelText = panelConfig.panelStatus === PANEL_STATUS.unfold ? "-" : "+";
        let config = getFromStorage(storageKey) || {};
        let panelTop = panelConfig.panelTop ? panelConfig.panelTop : 0;
        let panelLeft = panelConfig.panelLeft;
        let panelPosionStyle = createPanelStyle(panelTop, panelLeft);
        var title = "udesk jira 智能助手";
        var panelStyle = '<style>.ui-autocomplete{z-index:999999;background:#FFF;}.ui-front{z-index:999999!important;}.udesk-jira-control-panel{padding:10px 20px 20px;z-index:99999;background:#FFF;border:1px solid #ddd;position:fixed;top:0;right:0;max-height:400px;max-width:250px;overflow:auto;}.udesk-jira-helper-input{border: 1px solid #cccccc;border-radius: 3.01px;box-shadow: inset 0 1px 3px #cccccc;box-sizing: border-box;font-size: inherit;margin: 0;max-width: 250px;vertical-align: baseline;width: 100%;height: 2.1428571428571em;line-height: 1.4285714285714;padding: 4px 5px;}.udesk-jira-helper-fieldset{padding:10px 0;}.udesk-jira-control-panel-header-title{font-size:16px;}.udesk-jira-control-panel-header{border-bottom:1px solid #efefef;padding-bottom:5px;margin-bottom:5px;}.udesk-jira-control-panel-icon{float:right;font-size:28px;line-height:28px;cursor:pointer;}.udesk-jira-control-panel-fold{height:20px;overflow:hidden;border-radius:4px;width:20px;}.udesk-jira-control-panel-fold .udesk-jira-control-panel-header{border:none;}.udesk-jira-control-panel-fold .udesk-jira-control-panel-header-title{display:none;}.udesk-jira-control-panel-fold .udesk-jira-control-panel-body{display:none;}</style>';
        var panelBody = `<div class="field-group udesk-jira-field-group">
                            <label>默认开发人:</label>
                            <div class="textfield text long-field">
                                <input class="udesk-jira-helper-input" id="udesk-default-developer" value="${config.defaultDeveloper || ''}" />
                            </div>
                        </div>
                        <div class="field-group udesk-jira-field-group">
                            <label>默认项目组:</label>
                            <div class="textfield text long-field" id="udesk-default-group"></div>
                        </div>
                        <div class="field-group udesk-jira-field-group">
                            <label>默认开发分支:</label>
                            <div class="textfield text long-field" id="udesk-default-develop-lib">
                            </div>
                        </div>
                          <fieldset class="udesk-jira-helper-fieldset">
                            <label for="udesk-jira-branch-name">
                                自动填写分支名称：
                            </label>
                            <input type="checkbox" ${config.branchNameEnable?"checked" :""} name="udesk-jira-branch-name" id="udesk-jira-branch-name">
                            <input class="udesk-jira-helper-input" id="udesk-jira-branch-name-reg" value="${config.branchNameReg || ''}" type="text" placeholder="请输入分支规则">
                            <p>{lower_name}表示小写分支名，{name}表示分支名，{num}分支号</p>
                          </fieldset>
                        <div class="udesk-jira-control-panel-btns">
                            <button class="udesk-jira-control-panel-btn ui-button ui-widget ui-corner-all" type="button" id="udesk-jira-control-panel-save-btn">保存</button>
                        </div>`;
        var panel = `<div id="udesk-jira-control-panel" style=${panelPosionStyle} class="udesk-jira-control-panel ${panelStatus}">
            <div class="udesk-jira-control-panel-header">
                <span class="udesk-jira-control-panel-header-title">${title}</span>
                <span class="udesk-jira-control-panel-icon">${panelText}</span>
            </div>
            <div class="udesk-jira-control-panel-body">${panelBody}</div>
        </div>`;
        $("body").append(panelStyle).append(panel);
        createOption(config);
        createUi();
        bindEvent();
    }

    function getStorageKey(nameSpace = "") {
        return `udesk-jira-helper-config-${userKey}${nameSpace}`;
    }

    function bindEvent() {
        $("#udesk-jira-control-panel-save-btn").on("click", function() {
            let defaultDeveloper = $("#udesk-default-developer").val();
            let defaultGroup = $("#udesk-jira-group-option-select").val();
            let defaultDeveloperLib = $("#udesk-jira-code-lib-select").val();
            let branchNameEnable = $("#udesk-jira-branch-name").val();
            let branchNameReg = $("#udesk-jira-branch-name-reg").val();

            let config = {
                defaultDeveloper,
                defaultGroup,
                defaultDeveloperLib,
                branchNameEnable,
                branchNameReg
            }
            let storageKey = getStorageKey();
            saveToStorage(storageKey, config);
            alert("保存成功！");
            // localStorage.setItem("udesk-jira-helper-config",config);
        });
        $("body").on("click", "#opsbar-opsbar-transitions .toolbar-item a", function() {
            let text = $.trim($(this).text());
            if (text === DEVELOP_BUTTON_TEXT) {
                startConfigSetting();
            }
        });
        $(".udesk-jira-control-panel-icon").on("click", function() {
            let $panel = $("#udesk-jira-control-panel");
            let storageKey = getStorageKey("panel-status");
            let panelConfig = getFromStorage(storageKey) || {};
            if ($panel.hasClass("udesk-jira-control-panel-unfold")) {
                saveToStorage(storageKey, Object.assign(panelConfig, { panelStatus: PANEL_STATUS.fold }));
                $panel.removeClass("udesk-jira-control-panel-unfold").addClass("udesk-jira-control-panel-fold");
                $(this).text("+")
            } else {
                saveToStorage(storageKey, Object.assign(panelConfig, { panelStatus: PANEL_STATUS.unfold }));
                $panel.removeClass("udesk-jira-control-panel-fold").addClass("udesk-jira-control-panel-unfold");
                $(this).text("-")
            }
        });

    }

    function setBranchName(reg, $ele) {
        getIssueKey().then(key => {
            if (key) {
                let keys = key.split("-");
                let [name, num] = keys;
                let branchName = reg.replace('{name}', name);
                branchName = branchName.replace('{lower_name}', name.toLowerCase());
                branchName = branchName.replace('{num}', num);
                $ele.find("input.textfield").val(branchName);
            } else {
                console.error("设置分支失败,请联系开发人员！")
            }
        });
    }

    function emptyValue(value) {
        if (typeof value === "string") {
            return !value || value === '-1';
        } else {
            return !value || value[0] === '-1';
        }
    }

    function setConfigToDevelopDialog($dialog) {
        let storageKey = getStorageKey();
        let config = getFromStorage(storageKey) || {};

        $dialog.find(".form-body .field-group").each(function(index, ele) {
            let labelText = $.trim($(ele).find("label").text());
            let $ele = $(ele);
            if (labelText === CODE_LIB_TEXT && config.defaultDeveloperLib && emptyValue($ele.find("select").val())) {
                $ele.find("select").val(config.defaultDeveloperLib);
            } else if (labelText === DEVELOP_BRANCH_TEXT && config.branchNameReg && config.branchNameEnable && (!$ele.find("input.textfield").val() || $ele.find("input.textfield").val() === NONE)) {
                let branchName = setBranchName(config.branchNameReg, $ele);
            } else if (labelText === DEVELOPER_TEXT && config.defaultDeveloper && !$ele.find("input.userpickerfield").val()) {
                $ele.find("input.userpickerfield").val(config.defaultDeveloper);
            } else if (labelText === PROJECT_GROUP_TEXT && config.defaultGroup && emptyValue($ele.find("select.cf-select").val())) {
                $ele.find("select.cf-select").val(config.defaultGroup);
            }
        });

    }

    function startConfigSetting() {
        clearTimeout(developDialogTest);
        developDialogTest = setTimeout(function() {
            let $dialog = $(".jira-dialog-open");
            let isDevelopDialog = $dialog.find(`.jira-dialog-heading h2:contains('${DEVELOP_BUTTON_TEXT}')`).length;
            if (!$dialog.length || !isDevelopDialog) {
                startConfigSetting();
            } else {
                setConfigToDevelopDialog($dialog);
            }
        }, 200);
    }

    function createUi() {
        $("#udesk-jira-branch-name").checkboxradio();
        $("#udesk-jira-control-panel").draggable({
            stop: function(event, ui) {
                let panelStorageKey = getStorageKey("panel-status");
                let panelConfig = getFromStorage(panelStorageKey) || {};
                panelConfig = Object.assign(panelConfig, {
                    panelTop: `${ui.offset.top/$(window).height()*100}%`,
                    panelLeft: `${ui.offset.left/$(window).width()*100}%`,
                });
                saveToStorage(panelStorageKey, panelConfig);
            }
        });
    }

    function saveToStorage(name, value, isJson = true) {
        if (isJson) {
            value = JSON.stringify(value);
        }
        localStorage.setItem(name, value);
    }

    function getFromStorage(name, isJson = true) {
        let value = localStorage.getItem(name);
        if (isJson) {
            value = JSON.parse(value);
        }
        return value;
    }

    function getCurrentUserInfo() {
        return new Promise((resolve, reject) => {
            let url = '/rest/api/2/myself';
            $.get(url).then(response => {
                resolve(response);
            }, reject => {
                resolve({
                    key: "not_found"
                });
            });
        });
    }

    function insertSearchInput() {
        var $select = $(".cf-select[multiple]");
        var id = "search-input-" + timer;
        var $searchInput = $("#" + id);

        function searchSelectOptions(value) {
            if (value) {
                var optionHeight = $select.find("option").eq(0).height();
                var index = 0;
                $select.find("option").each(function(index, ele) {
                    var $ele = $(ele);
                    var text = $ele.text();
                    if (text && text.trim().indexOf(value.trim()) !== -1) {
                        $ele.show();
                    } else {
                        $ele.hide();
                    }
                });
            } else {
                $select.find("option").each(function(index, ele) {
                    var $ele = $(ele);
                    $ele.show();
                });
            }
        }
        if (!$searchInput || !$searchInput.length && $select && $select.length) {
            var $beforeDiv = $('<div style="margin-bottom:10px;"><label style="margin-right:10px;">搜索</label></div>');
            $searchInput = $('<input style="height:30px;line-height:30px;padding:2px 6px;" id=' + id + '>').on("input", function(e) {
                searchSelectOptions(e.target.value);
            });
            $select.before($beforeDiv.append($searchInput));
        }
    }
    setInterval(function() {
        insertSearchInput();
    }, 1000);
})();