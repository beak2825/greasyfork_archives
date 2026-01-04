// ==UserScript==
// @name         module.101.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://module.101.com/main.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395073/module101com.user.js
// @updateURL https://update.greasyfork.org/scripts/395073/module101com.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var $ = window.$ || window.jQuery;

    var PlayerDownloadUrl = 'http://cs.101.com/v0.1/static/esp_developer/packages/players/{playerCode}/{playerVersion}/player.zip?attachment=true&name={playerCode}_{playerVersion}.zip';
    var StudentPlayerDownloadUrl = 'http://cs.101.com/v0.1/static/esp_developer/packages/players/{playerCode}/{playerVersion}/player_student.zip?attachment=true&name={playerCode}_student_{playerVersion}.zip';

    var RenderPublishList = {
        include: [
        ],
        exclude: [
            'MultiLevelDropDownRender',
            // 'OralRender',
            'DemoRender',
            'AnotherRender'
        ]
    };

    var log = function () {
        console.log.apply(console, ['[tamper-monkey] '].concat([].slice.call(arguments)));
    };

    var Storage = {
        get: function (key) {
            var value = window.localStorage.getItem('tamper-module101-' + key);
            if (value != null) {
                try{
                    value = JSON.parse(value);
                }catch(e){}
            }
            return value;
        },
        set: function (key, value) {
            value = JSON.stringify(value);
            window.localStorage.setItem('tamper-module101-' + key, value);
        }
    };

    var inspect = function (callback, time) {
        var result = callback();
        if (result !== true) {
            setTimeout(function () {
                inspect(callback, time);
            }, 1000);
        }
    };

    var Utils = {
        template(string, data){
            return string.replace(/\{(\w+)\}/g, function(m, $1){
                return data[$1] != null ? data[$1]: '';
            });
        }
    };

    var DomManager = {
        create: function (html) {
            return $(html);
        },
        /**
         * 获取侧边菜单
         */
        getAsideMenu: function (text) {
            var list = $('.com-aside-container li.ng-scope');
            if (text) {
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].innerText === text) {
                        return list[i];
                    }
                }
                return null;
            }
            return list;
        },
        /**
         * 获取选中的侧边菜单
         */
        getActiveAsideMenu: function () {
            return $('.com-aside-container li.ng-scope.on');
        },
        /**
         * 侧边菜单项是否是选中态
         */
        isAsideMenuActive: function (el) {
            return el.classList.contains('on');
        },
        /**
         * 获取tab菜单
         */
        getTabMenu: function (text) {
            var list = $('.board-body .nav li.ng-isolate-scope');
            if (text) {
                for (var i = 0, len = list.length; i < len; i++) {
                    if (list[i].innerText === text) {
                        return list[i];
                    }
                }
                return null;
            }
            return list;
        },
        /**
         * 获取选中的tab项
         */
        getActiveTabMenu: function () {
            return $('.board-body .nav .ng-isolate-scope.active');
        },
        /**
         * 获取选中的tab容器
         */
        getActiveTabPanel: function () {
            return $('.tab-pane.active');
        },
        /**
         * 获取tab菜单容器
         */
        getTabMenuContainer: function () {
            return $('.layout-border .board-body');
        },
        /**
         * tab菜单项是否是选中状态
         */
        isTabMenuActive: function (el) {
            return el.classList.contains('active');
        },
        /**
         * 获取成员列表
         */
        getMemberList: function () {
            return $('.tab-pane.active .main_app_list li.ng-scope');
        },
        /**
         * 获取版本列表页的最新版本按钮
         */
        getLatestVersionButton: function () {
            return $('.table-bordered tbody tr').first().find('a').first();
        },
        /**
         * 获取自测按钮
         */
        getSelfTestButton: function () {
            var buttons = $('button');
            for (var i = 0, len = buttons.length; i < len; i++) {
                if (buttons[i].innerText.trim() === '自测') {
                    return buttons[i];
                }
            }
        },
        /**
         * 获取模态窗标题
         */
        getModalTitle: function () {
            return $('.modal-header').text();
        },
        /**
         * 获取模态窗关闭按钮
         */
        getModalConfirmButton: function () {
            return DomManager.getModalButtonByText('确定');
        },
        /**
         * 获取模态窗保存按钮
         */
        getModalSaveButton: function () {
            return DomManager.getModalButtonByText('保存');
        },
        /**
         * 获取按钮
         */
        getModalButtonByText: function (text) {
            var buttons = $('.modal button');
            for (var i = 0, len = buttons.length; i < len; i++) {
                if (buttons[i].innerText.trim() === text) {
                    return buttons[i];
                }
            }
        },
        getPageSizeSelect: function () {
            return $('select.ng-pristine');
        },
        /**
         * 获取下一页按钮
         */
        getNextPageButton: function () {
            return $('.pagination-next');
        },
        /**
         * 分页按钮是否被禁用
         */
        isPageButtonDisabled: function (button) {
            return button.hasClass('disabled');
        },
        /**
         * 是否是版本列表页
         */
        isVersionListPage: function () {
            // return $('[ng-bind="module.code"]').length === 1;
            return !!$('[ng-bind="module.svn"]').length;
        },
        isRenderListPage: function () {
            var firstMemberName = $('.tab-pane.active [ng-bind="module.name"]')[0].innerText;
            var firstMemberCode = $('.tab-pane.active [ng-bind="module.code"]')[0].innerText;
            return /渲染库$/.test(firstMemberName) !== -1 && /render$/i.test(firstMemberCode);
        },
        isFeaturePlayerHistoryPage: function () {
            var breadcrumbs = $('.breadcrumb').children();
            return breadcrumbs.length === 2 && breadcrumbs[0].innerHTML.indexOf('特性播放器') !== -1 && breadcrumbs[1].innerHTML.indexOf('历史版本') !== -1;
        },
        getPlayerCodeInHistoryPage: function () {
            var elem = $('.breadcrumb').children().get(1);
            if(elem){
                var matched = elem.innerHTML.match(/\((\w+)\)/);
                if(matched){
                    return matched[1];
                }
            }
            return '';
        }
    };

    var backupNavbarIndex = function () {
        var list = DomManager.getAsideMenu();
        var index = 0;
        for (var i = 0, len = list.length; i < len; i++) {
            if (DomManager.isAsideMenuActive(list.get(i))) {
                index = i;
                break;
            }
        }
        Storage.set('navbar-index', index);
    };

    var backupTabIndex = function () {
        var list = DomManager.getTabMenu();
        var index = 0, len = list.length;
        if (len) {
            for (var i = 0; i < len; i++) {
                if (DomManager.isTabMenuActive(list.get(i))) {
                    index = i;
                    break;
                }
            }
        } else {
            index = -1;
        }
        Storage.set('tab-index', index);
    };

    var restoreNavbarIndex = function () {
        var index = Storage.get('navbar-index');
        if (index) index = +index;
        if (index > 0) {
            DomManager.getAsideMenu().get(+index).click();
        }
    };

    var restoreTabIndex = function () {
        var index = Storage.get('tab-index');
        if (index) index = +index;
        if (index > 0) {
            inspect(function () {
                var list = DomManager.getTabMenu();
                if (list.length) {
                    list.get(index).children[0].click();
                    return true;
                }
            });
        }
    };

    var backupBehavior = function () {
        backupNavbarIndex();
        backupTabIndex();
    };

    var restoreBehavior = function () {
        restoreNavbarIndex();
        setTimeout(function () {
            restoreTabIndex();
        });
    };

    var attachRenderPublishButton = function () {
        var content = DomManager.getTabMenuContainer();
        if (content.length) {
            var anchor = DomManager.create('<button type="button" class="btn btn-default" style="margin-bottom: 5px;float: right;    margin-right:10px;">批量发布</button>');
            anchor.on('click', function () {
                publishRender();
            });
            content.prepend(anchor);
        } else {
            log('missing tabMenuContainer');
        }
    };

    var selectRender = function (callback) {
        var list = DomManager.getMemberList();
        var include = RenderPublishList.include;
        var exclude = RenderPublishList.exclude;
        for (var i = 0, len = list.length; i < len; i++) {
            var item = list.get(i);
            var renderCode = item.querySelector('p.ng-scope span').innerText.trim();
            if (include.length) {
                if (include.indexOf(renderCode) !== -1) {
                    item.click();
                    callback(renderCode);
                    return;
                }
            } else if (exclude.length) {
                if (exclude.indexOf(renderCode) === -1) {
                    item.click();
                    callback(renderCode);
                    return;
                }
            } else {
                item.click();
                callback(renderCode);
                return;
            }
        }
    };

    var selectRenderVersion = function (callback) {
        inspect(function () {
            if (DomManager.isVersionListPage()) {
                var button = DomManager.getLatestVersionButton();
                button.click();
                callback();
                return true;
            }
        });
    };

    var testRender = function (name, callback) {
        inspect(function () {
            var testButton = DomManager.getSelfTestButton();
            if (testButton) {
                testButton.click();
                inspect(function () {
                    var saveButton = DomManager.getModalSaveButton();
                    if (saveButton) {
                        saveButton.click();
                        inspect(function () {
                            var title = DomManager.getModalTitle();
                            if (title && title.indexOf('成功') !== -1) {
                                var confirmButton = DomManager.getModalConfirmButton();
                                confirmButton.click();
                                callback && callback();
                                return true;
                            }
                        });
                        return true;
                    }
                });
                return true;
            }
        });
    };

    var switchAsideMenu = function (name, callback) {
        var item = DomManager.getAsideMenu(name);
        if (item) {
            item.click();
            inspect(function () {
                var activeItem = DomManager.getActiveAsideMenu();
                if (activeItem.get(0).innerText === name) {
                    callback && callback();
                    return true;
                }
            });
        }
    };

    var switchTabMenu = function (name, callback) {
        inspect(function () {
            var item = DomManager.getTabMenu(name);
            if (item) {
                item.children[0].click();
                inspect(function () {
                    var activeItem = DomManager.getActiveTabMenu();
                    var activePanel = DomManager.getActiveTabPanel();
                    if (activeItem.get(0).innerText === name && activeItem.index() === activePanel.index()) {
                        callback && callback();
                        return true;
                    }
                });
                return true;
            }
        });
    };

    var switchComponentMenu = function (callback) {
        switchAsideMenu('组件管理', callback);
    };

    var switchRenderTab = function (callback) {
        switchTabMenu('教学颗粒渲染库', function () {
            inspect(function () {
                if (DomManager.isRenderListPage()) {
                    callback();
                    return true;
                }
            });
        });
    };

    var publishRender = function () {
        log('start publish render');
        // Storage.set('publish-renders', []);

        var run = function () {
            // 选择渲染器
            selectRender(function (name) {
                // 选择版本
                selectRenderVersion(function () {
                    // 自测
                    testRender(name, function () {
                        log(name + ' published');
                        RenderPublishList.exclude.push(name);
                        // 返回组件页面
                        switchComponentMenu(function () {
                            // 进入渲染库页面
                            switchRenderTab(function () {
                                run();
                            });
                        });
                    });
                });
            });
        };

        var pageSize = DomManager.getPageSizeSelect();
        pageSize.val(50);
        pageSize.trigger('change');
        inspect(function () {
            var memberList = DomManager.getMemberList();
            if (memberList.length > 20) {
                run();
                return true;
            }
        });
    };

    var appendPlayerDownloadButton = function () {
        var playerCode = DomManager.getPlayerCodeInHistoryPage();
        if(playerCode){
            $('tbody tr').each(function (index, item) {
                if(!item.classList.contains('is-append')){
                    var children = item.children;
                    var version = children[1].innerHTML;
                    var buttons = children[children.length - 1];

                    var playerUrl = Utils.template(PlayerDownloadUrl, { playerCode: playerCode, playerVersion: version });
                    var studentPlayerUrl = Utils.template(StudentPlayerDownloadUrl, { playerCode: playerCode, playerVersion: version });

                    buttons.appendChild($(Utils.template('<a style="margin-left: 10px;" target="_blank" href="{url}">default</a>', { url: playerUrl })).get(0));
                    buttons.appendChild($(Utils.template('<a style="margin-left: 10px;" target="_blank" href="{url}">student</a>', { url: studentPlayerUrl })).get(0));

                    item.classList.add('is-append');
                }
            });
        }
    };

    window.addEventListener('beforeunload', function () {
        log('before unload');
        backupBehavior();
    });

    window.addEventListener('load', function () {
        log('loaded');
        restoreBehavior();
    });

    if(Storage.get('role') === 'developer'){
        inspect(function () {
            var isRenderPage = DomManager.getActiveTabMenu().text().trim() === '教学颗粒渲染库';
            if (isRenderPage) {
                log('is render page');
                attachRenderPublishButton();
            }
            return isRenderPage;

        });
    }

    inspect(function(){
        if(DomManager.isFeaturePlayerHistoryPage()){
            appendPlayerDownloadButton();
        }
    });


})();