// ==UserScript==
// @namespace         https://greasyfork.org/zh-CN/users/189097-l0rraine

// @name              魔方格
// @name:en           mofangge
// @name:zh           魔方格
// @name:zh-CN        魔方格


// @author            l0rraine
// @contributor       l0rraine

// @description       魔方格网站修改，收藏错题本等
// @description:en    Modify the mofangge website
// @description:zh    魔方格网站修改，收藏错题本等
// @description:zh-CN 魔方格网站修改，收藏错题本等


// @version           1.2.75
// @license           LGPLv3

// @compatible        chrome Chrome_46.0.2490.86 + TamperMonkey + 脚本_1.3 测试通过
// @compatible        firefox Firefox_42.0 + GreaseMonkey + 脚本_1.2.1 测试通过
// @compatible        opera Opera_33.0.1990.115 + TamperMonkey + 脚本_1.1.3 测试通过
// @compatible        safari 未测试

// @match           http://www.mofangge.com/*


// @connect     gh.nomecn.com
// @connect     127.0.0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @require     https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/368965/%E9%AD%94%E6%96%B9%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/368965/%E9%AD%94%E6%96%B9%E6%A0%BC.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var RES = {
        configCSS: '#top-buttons{background:none repeat scroll 0% 0% rgb(255,255,255);display:block;position:absolute;top:-35px;border-right:12px solid rgb(224,224,224);border-top:12px solid rgb(224,224,224);border-left:12px solid rgb(224,224,224);text-align:center}input{font-size:12px;margin-right:3px;vertical-align:middle}.form-row{overflow:hidden;padding:8px 12px;margin-top:3px;font-size:11px}.form-row label{padding-right:10px}.form-row input{vertical-align:middle;margin-top:0px}textarea,.form-row input{padding:2px 4px;border:1px solid #e5e5e5;background:#fff;border-radius:4px;color:#666;-webkit-transition:all linear .2s;transition:all linear .2s}textarea{width:100%;overflow:auto;vertical-align:top}textarea:focus,input:focus{border-color:#99baca;outline:0;background:#f5fbfe;color:#666}.prefs_title{font-size:12px;font-weight:bold}.prefs_textarea{font-size:12px;margin-top:5px;height:100px}.right{float:right}.body{color:#333;margin:0auto;background:white;padding:10px;overflow-y:auto;}',
        configHTML: '<form id="config" name="config"><div id="setting_table1"><span id="top-buttons"><input title="部分选项需要刷新页面才能生效"id="save_button"value="√ 确认"type="button"><input title="取消本次设定，所有选项还原"id="close_button"value="X 取消"type="button"></span><div class="form-row"><label title="默认显示答案"><input id="setting-show-answer"name="setting-show-answer"type="checkbox">默认显示答案</label><label>用户名<input id="username"></label></div></div></form>',
        configBtn: '<img style="width:16px" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABwklEQVRIibVVzWrCQBAeQk/bdk+bm0aWDQEPHtwVahdavLU9aw6KAQ+SQ86Sa19Aqu0T9NafSw8ttOgr1CewUB9CBL3Yy26x1qRp0A8GhsnO9yUzmxmAhKjX68cAMAeAufK3C875FQAsAWCp/O3CsqyhFlB+Oti2/cAYewrD8FDHarXahWEYUy1gGMbUdd1z/TwMw0PG2JNt2/ex5IyxR02CEJpIKbuEkJGOrRshZCSl7CKEJjrGGHuIFMjlcs9RZElNcWxGEAQHGONxWnKM8TgIgoPYMkkpL9MKqNx4xNX8LyOEvMeSq5uxMZlz3vN9v+D7foFz3os6V61Wz36QNhqNUyHENaV0CACLTUnFYvF6/WVUbJPIglI6FELctFqtMiT59Ha7TdcFVCxJ6XYs0Gw2T1SJBlsq0ZxSOhBC3Hied/QjSTUoqsn9lSb3o879avI61FXbzTUFACiXy7v70Tqdzj7G+COtwJ+jIpPJvKYl12ZZ1kucwJs+iBD6lFJ2TdOMHB2mab7/a1xXKpW9fD5/6zjO3erCcV33PMnCcRwnfuHEYXVlZrPZQWqiKJRKpe8Bt5Ol73leCQBmADBTfiJ8AebTYCRbI3BUAAAAAElFTkSuQmCC"/>',
        saveFavoriteHtml: '<form id="save-favorite"name="save-favorite"><div><span id="top-buttons"><input id="save_button"value="√ 确认"type="button"><input id="close_button"value="X 取消"type="button"></span></div><div class="form-row"><span>链接</span><input id="url"></div><div class="form-row"><span>标题</span><input id="title"></div><div class="form-row"><span>学科</span><input id="subject"></div><div class="form-row"><span>题目类型</span><input id="category"></div><div class="form-row"><div class="prefs_title">描述</div><textarea id="description" class="prefs_textarea" placeholder=""></textarea></div></form>',
        saveFavoriteCss: '#top-buttons{background:none repeat scroll 0% 0% rgb(255,255,255);display:block;position:absolute;top:-35px;border-right:12px solid rgb(224,224,224);border-top:12px solid rgb(224,224,224);border-left:12px solid rgb(224,224,224);text-align:center}input{font-size:12px;margin-right:3px;vertical-align:middle;}.form-row{overflow:hidden;padding:8px 12px;margin-top:3px;font-size:11px}.form-row span{display:inline-block;width:60px;font-weight: bold;}.form-row input{vertical-align:middle;margin-top:0px;width:400px;}.body{color:#333;margin:0auto;background:white;padding:10px;height:420px;overflow-y:auto;}.prefs_title{font-size:12px;font-weight:bold}.prefs_textarea{font-size:12px;margin-top:5px;height:200px;width:100%;overflow:auto;vertical-align: top;}',
    }

    var UI = {
        init: function () {
            UI.format();
            UI.createHtml();

            UI.doBinding();

            UI.toggleAnswer(Setting.showAnswer);

        },
        _loadBlocker: function () {
            UI.$blocker = $('<div id="uil_blocker">')
                .css('cssText', 'position:fixed;top:0px;left:0px;right:0px;bottom:0px;background-color:#000;opacity:0.5;z-index:100000;')
                .appendTo('body');
        },
        toggleAnswer: function (show) {
            if (show) {
                GM_addStyle('#q_indexkuai3 {display:block !important;}#q_indexkuai4 {display:block !important;}');
            } else {
                GM_addStyle('#q_indexkuai3 {display:none !important;}#q_indexkuai4 {display:none !important;}');
            }

        },
        format: function () {
            GM_addStyle('div, span, a, td {font-size: 28px !important;}');
            GM_addStyle('.nagetivebanner,.seccopyright,.q_right,.copyright,#q_indexkuai511,#ad_center,#q_indexkuai22111,#q_indexkuai721,#main_user_info,#q_indexkuai3211,#q_indexkuai3212 {display:none !important;}');
            GM_addStyle('.content div:nth-child(3) {width: 974px !important;}');
            GM_addStyle('.q_mokuai {width:100% !important;}');
            GM_addStyle('.notes {width:100% !important;line-height:30px !important;padding-left:0 !important;}');
            GM_addStyle('.current {width:120px !important;}');
            GM_addStyle('.q_bot {padding-left:0 !important;}');
            GM_addStyle('table {width: 90% !important;}');
            var sp = [];
            $('.seotops a').each(function(key,item){
                sp.push(item);
            });
            $('.seotops').html('');
            sp.forEach(element => {
                $('.seotops').append(element).append('＞');
            });
        },
        doBinding: function () {
            UI.$configBtn.click(function () {
                UI._loadBlocker();
                UI.$prefs = $('<div id="config-container">')
                    .css('cssText', 'position:fixed; top:12%;left:50%;margin-left:-255px;width:500px; z-index:300000;')
                    .append($('<style>').text(RES.configCSS))
                    .append($('<div class="body">').html(RES.configHTML))
                    .appendTo('body');
                UI.$configForm = $('#config');
                UI.bindConfigForm();
                UI.loadSettings();
            });

            UI.bindActions();
        },
        bindConfigForm: function () {
            if (UI.$configForm) {
                UI.$configForm.find('#save_button').click(function () {
                    UI.saveSettings();
                })

                UI.$configForm.find('#close_button').click(function () {
                    UI.$blocker.remove();
                    UI.hide();
                })
            }
        },
        bindSaveFavoriteForm: function () {
            if (UI.$saveFavoriteForm) {
                UI.$saveFavoriteForm.find('#url').val(window.location);
                UI.$saveFavoriteForm.find('#subject').val(UI.getCategory().subject);
                UI.$saveFavoriteForm.find('#category').val(UI.getCategory().category);

                UI.$saveFavoriteForm.find('#save_button').click(function () {
                    UI.saveFavorite();
                })

                UI.$saveFavoriteForm.find('#close_button').click(function () {
                    UI.$blocker.remove();
                    UI.hide();
                })
            }
        },
        saveFavorite: function () {
            if (!UI.$saveFavoriteForm) return;

            var data = {
                username: Setting.username,
                url: UI.$saveFavoriteForm.find('#url').val(),
                title: UI.$saveFavoriteForm.find('#title').val(),
                subject: UI.$saveFavoriteForm.find('#subject').val(),
                category: UI.$saveFavoriteForm.find('#category').val(),
                desc: UI.$saveFavoriteForm.find('#description').val().split("\n").join("<br>")
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: "https://gh.nomecn.com/mobile/index.php?act=api&op=ct",
                // url: "http://127.0.0.1:9999/mobile/index.php?act=api&op=ct",
                data: $.param(data),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                onload: function (response) {
                    var result = JSON.parse(response.responseText);
                    if (result.success) {
                        UI.hide();
                    } else {
                        alert(result.datas.error.join('\n'));
                    }
                }
            });
        },
        bindActions: function () {
            if (UI.$actionPanel) {
                // UI.$actionPanel.find('#show-answer').change(function () {
                //     UI.toggleAnswer($(this).prop('checked') && true);
                // })
                UI.$actionPanel.find('#show-answer').click(function () {
                    UI.toggleAnswer(!Setting.showAnswer);
                })
                UI.$actionPanel.find('#save-favorite-btn').click(function () {
                    UI._loadBlocker();
                    UI.$saveFavorite = $('<div id="save-favorite-container">')
                        .css('cssText', 'position:fixed; top:12%;left:50%;margin-left:-255px;width:500px; z-index:300000;')
                        .append($('<style>').text(RES.saveFavoriteCss))
                        .append($('<div class="body">').html(RES.saveFavoriteHtml))
                        .appendTo('body');
                    UI.$saveFavoriteForm = $('#save-favorite');
                    UI.bindSaveFavoriteForm();
                })
                UI.$actionPanel.find('#show-favorites').click(function () {
                    window.open("https://gh.nomecn.com/wechat/ct.html?username=" + Setting.username);
                })
            }
        },
        loadSettings: function () {
            UI.$configForm.find("#setting-show-answer").get(0).checked = Setting.showAnswer;
            UI.$configForm.find("#username").val(Setting.username);
        },
        saveSettings: function () {
            Setting.showAnswer = UI.$configForm.find("#setting-show-answer").get(0).checked;
            Setting.username = UI.$configForm.find("#username").val();
            UI.hide();
        },
        createHtml: function () {
            UI.$configBtn = $('<div id="config-btn">')
                .css('cssText', 'position:fixed;top:10px;right:10px;z-index:1597;')
                .html(RES.configBtn).appendTo('body');

            // UI.$actionPanel = $('<div id="actions">')
            //     .css('cssText', 'position:fixed;top:50px;right:10px;z-index:1597;')
            //     .append($('<style>').text('#actions span{display:block;}'))
            //     .append($('<div>').html('<span>显示答案<input type="checkbox" id="show-answer" name="show-answer"' + (Setting.showAnswer ? ' checked' : '') + ' /></span><span><a id="save-favorite-btn">收藏到错题本</a></span><span><a id="show-favorites">查看错题本</a></span>'))
            //     .appendTo('body');
            UI.$actionPanel = $('#menu_daohang').append('<a id="show-answer">显示答案</a><a id="save-favorite-btn">收藏到错题本</a><a id="show-favorites">查看错题本</a>')
        },
        hide: function () {
            if (UI.$prefs) UI.$prefs.remove();
            if (UI.$saveFavorite) UI.$saveFavorite.remove();
            if (UI.$blocker) UI.$blocker.remove();
            UI.$prefs = null;
            UI.$saveFavorite = null;
            UI.$blocker = null;
            UI.$configForm = null;
            UI.$saveFavoriteForm = null;
        },
        getCategory: function () {
            var subject = $('.seotops a')[1].innerText;
            var cat = $('.seotops a')[2].innerText;
            return {
                'subject': subject,
                'category': cat
            }
        }
    }



    var getBooleanConfig = function (configName, defaultValue) {
        var config$$1 = GM_getValue(configName);
        if (config$$1 === undefined) {
            GM_setValue(configName, defaultValue);
            config$$1 = defaultValue;
        }
        return config$$1;
    };

    var Setting = {
        get showAnswer() {
            return getBooleanConfig("showAnswer", false);
        },
        set showAnswer(bool) {
            GM_setValue("showAnswer", bool);
        },
        get username() {
            return GM_getValue("username");
        },
        set username(username) {
            GM_setValue("username", username);
        },
    }




    UI.init();
})();