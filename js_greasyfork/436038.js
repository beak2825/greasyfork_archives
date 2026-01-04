// ==UserScript==
// @name         WorkTile交互优化
// @namespace    http://fulicat.com
// @version      1.5.1
// @description  优化愚蠢的交互方式和样式，让操作更便捷更人性！
// @author       Jack.Chan
// @homepage     https://greasyfork.org/zh-CN/scripts/436038
// @license MIT
// @url          https://greasyfork.org/zh-CN/scripts/436038-worktile%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96
// @match        https://*.worktile.com/*
// @exclude 　　 https://*.worktile.com/files/*
// @icon         https://cdn.pingcode.com/static/portal/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436038/WorkTile%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/436038/WorkTile%E4%BA%A4%E4%BA%92%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $style = document.createElement('style');
    $style.type = 'text/css';
    $style.innerHTML = `
/* 滚动条 */
/*
html ::-webkit-scrollbar-thumb{
    border-radius: 0;
}
html ::-webkit-scrollbar{
    width: 17px !important;
    height: 17px !important;
    background: #f7f7f7 !important;
}
*/

/* 左侧项目列表 */
.main-layout .main-body .main-body-side {
    padding-bottom: 40px;
}

/* 右侧主题内容框架 */
.mission-project-home .thy-layout-content{
    margin-bottom: 40px;
}
.thy-layout-content{
  margin-bottom: 50px;
}


/* 滚动条-消息 */
.message-wrap ::-webkit-scrollbar{
    width: 17px !important;
    height: 17px !important;
    background: #f7f7f7 !important;
}


.app-nav-new-area-x,
.thy-header-self-adaption-x,
.shortcut-tray-content{
    z-index: 3000 !important;
}

/* 对话框 */
.dialog-supper-lg.mission-overlay{
    height: 90vh;
    max-height: 1100px;
}
.dialog-lg.mission-overlay,
.dialog-max-lg.mission-overlay{
    width: 90% !important;
}

/*
.task-table-next{
    padding: 16px 16px 46px 16px !important;
}
*/


/* 底部任务栏 */
.app-content>.shortcut-tray-content{
    left: auto;
    right: 20px;
}


.toc-section.thy-menu{
    padding-bottom: 80px;
}
mission-work-addon-group.thy-layout{
    padding-bottom: 50px;
}
mission-work-addon-group .addon-task-table-body.addon-task-table-scroll{
    bottom: 50px;
}

/* 左侧 */
.app-nav-new-area .bottom-area-new-app{
    bottom: 50px !important;
}
.cdk-overlay-container .moreAppSubMenu,
.cdk-overlay-container .help-center{
    bottom: 100px !important;
}
.cdk-overlay-container .cdk-overlay-connected-position-bounding-box{
    bottom: 50px !important;
    z-index: 10000;
}


/* 右侧抽屉 */
.view-filter .view-filter-body{
    height: auto !important;
}
.view-filter .view-filter-footer{
    position: static !important;
}

/* 需求、任务描述 */
.textarea-show-wrapper .textarea-show-footer{
    text-align: center;
    background: #eee;
    padding: 10px;
}
.textarea-show-wrapper .textarea-show-footer a{
    padding: 10px 20px;
}
.textarea-show-wrapper .textarea-show-body-collapse:after{
    pointer-events: none;
    z-index: 2;
}
.textarea-show-body{
    position: relative;
}
.markdown-body:not(.markdown-body-new){
    -webkit-user-select: none;
    user-select: none;
}
.markdown-body-new{
    visibility: visible;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 3;
    background: rgba(255 ,255, 255, 1);
    cursor: text;
}
.markdown-body-new:hover{
  box-shadow: 0 0 5px 1px #ddd;
}

.property-field-item .button-position{
    text-align: center;
}
.property-field-item .button-position .btn + .btn{
    margin-left: 30px;
}

.add-task-relation-task .task-relation-task-add-container .task-relation-task-operation{
    text-align: center;
    justify-content: center;
}
.add-task-relation-task .task-relation-task-add-container .task-relation-task-operation .ml-auto{
    margin-left: 0 !important;
}
.add-task-relation-task .task-relation-task-add-container .task-relation-task-operation .cancel{
    margin-right: 30px;
}
.add-task-relation-task .task-relation-task-add-container .task-relation-task-operation .btn + .btn{
    margin-left: 30px;
}


/* 强制展示附件展示 */
.task-detail-attachment-container{
    display: block !important;
}

/* 新版需求对话框 - 右边参与人 调整至左下 */
.dialog-supper-lg.mission-overlay .styx-entity-detail-body,
.dialog-supper-lg.mission-overlay .styx-entity-detail-body>.modal-detail-body{
    position: relative;
}
.dialog-supper-lg.mission-overlay .styx-entity-detail-body>.modal-detail-body{
    padding-bottom: 100px;
}
.dialog-supper-lg.mission-overlay .styx-entity-detail-sidebar .sidebar-watchers-box{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 30.5%;
    z-index: 5;
    height: 61px;
    background: rgba(255,255,255, 0.85);
    border-top: 1px solid #eee;
}
.dialog-supper-lg.mission-overlay .styx-entity-detail-sidebar .sidebar-watchers-box .styx-member-list{
    height: 26px;
}
.dialog-supper-lg.mission-overlay .styx-entity-detail-sidebar .sidebar-watchers-box .entity-detail-participants{
    margin: 0;
    border: 0 !important;
    max-width: 75%;
}
.dialog-supper-lg.mission-overlay .entity-detail-participants .participants-pop.expand{
    padding-bottom: 50px;
    box-shadow: 0 -5px 10px 0px rgba(0,0,0, 0.22);
}


/** 左上角 **/

/* 老版 */
.app-nav-new-area{
    padding-top: 35px;
}

/* 新版 */
.app-nav-box .nav-wrap .nav-header{
    padding-top: 50px;
}


.x-link{
    width: auto !important;
}


.x-menus{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99911;
}
.x-manhour{
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(255 ,255, 255, 0.95);
    color: #333;
    padding: 13px 25px;
    text-align: center;
    word-break: keep-all;
    white-space: nowrap;
    box-shadow: 1px 0px 0px 0px #333;
    width: 0;
    opacity: 0;
    transition: all 0.25s;
    transform: translateY(-500%);
    text-align: left;
}
.x-menus:hover .x-manhour{
    left: 100%;
    width: auto;
    opacity: 1;
    transform: translateY(0);
    display: block;
    box-shadow: 1px 0px 5px 1px #ccc;
}
.x-manhour p{
    margin: 0;
}
.x-manhour p + p{
    margin-top: 10px;
}

.x-trigger-manhour{
    border: 0;
    cursor: pointer;
    position: relative;
    z-index: 99966;
    color: #fff;
    font-weight: bold;
    padding: 13px 0;
    display: block;
    width: 60px;
    text-align: center;
    background: #358fe4;
    box-shadow: -2px 2px 5px 1px #3e4963;
}
.x-trigger-manhour:hover{
    color: #fff;
    background: #ff9f73;
    background: #4caf50;
    background: #ff894e;
}


.x-button{
    outline: 0;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 5px 10px;
    display: inline-block;
}
.x-button:hover{
    background: rgba(0,0,0,0.05);
}
.x-button:active{
    background: rgba(0,0,0,0.15);
}
.x-button + .x-button{
    margin-left: 15px;
}



/* 工时统计页面 */
.thy-layout-content.thy-content-content--workload-statistics{
    max-width: 1200px;
}
.workload-statistics{
    height: auto !important;
    padding-top: 5px;
    padding-bottom: 5px;
}
.analytic-insight-summary .item .text-number,
.workload-statistics .item .text-number{
    font-size: 1.8em !important;;
}
.statistics-table-container .table.table-bordered tr{
    height: auto !important;
}
.statistics-table-container .table.table-bordered tr:nth-child(odd){
    background: #fffafa;
}
.statistics-table-container .table.table-bordered tr:hover{
    background: #ffe492;
}
.statistics-content-main .statistics-table-container .scroll thead th{
    min-width: 120px !important;
}
.statistics-table-container .table.table-bordered th,
.statistics-table-container .table.table-bordered td{
    padding:2px 5px !important;
    line-height: 24px !important;
}

.mission-task-table-container{
    padding-bottom: 50px;
}

/* responsive */
@media (max-width:1000px) {
    .mission-task-table-container .mission-addon-table-wrapper .mission-table-list-section::-webkit-scrollbar{
        width: 22px !important;
    }
    ::-webkit-scrollbar{
        width: 22px !important;
        height: 22px !important;
    }
    .addon-task-table-scroll{
        height: 22px !important;
    }

    /* 左侧 */
    .app-nav-new-area .bottom-area-new-app{
        bottom: 180px !important;
    }
}
`;

    function WorkingHours(options) {
        var defaultOptions = {
            interval: 0,
            selector: undefined,
            prefix: undefined,
        }
        options = Object.assign({}, defaultOptions, options);

        var start = new Date();
        start.setHours(9);
        start.setMinutes(30);
        start.setSeconds(0);
        start.setMilliseconds(0);

        var current = new Date();
        if (start.getHours() - current.getHours() > 2) {
            start.setDate(start.getDate()-1);
        }

        var calc = function() {
            var now = new Date();
            var diffText = [];
            if (start < now) {
                var diff = now.getTime() - start.getTime();
                var days = Math.floor(diff / (24 * 3600 * 1000));

                diff = diff % (24 * 3600 * 1000);
                var hours = Math.floor(diff / (3600 * 1000));

                diff = diff % (3600 * 1000);
                var minutes = Math.floor(diff / (60 * 1000));

                // 秒数
                diff = diff % (60*1000);
                var seconds = Math.round(diff / 1000);

                if (options.prefix) {
                    diffText.push(options.prefix);
                }
                diffText.push(hours +'小时');
                diffText.push(minutes +'分钟');
                diffText.push(seconds +'秒');
                diffText = diffText.join(', ');
            } else {
                diffText = '上班时间：'+ start.toLocaleTimeString();
            }
            if (options.selector) {
                var $el = document.querySelector(options.selector);
                if ($el) {
                    $el.innerText = diffText;
                }
            }
        }

        calc();
        if (options.interval) {
            setInterval(function() {
                calc();
            }, options.interval);
        }
    }

    function initStyle() {
        document.createElement('shortcut-tray-list');
        document.head.appendChild($style);
    }

    function xhr(options) {
        var defaultOptions = {
            method: 'GET',
            url: '',
            data: null,
            success: function(data) {},
            error: function(data) {},
        };
        options = Object.assign({}, defaultOptions, options);
        if (options.url) {
            var xhr = new XMLHttpRequest();
            xhr.open(options.method, options.url, false);
            xhr.onerror = function(errorThrow) {
                options.error.apply(xhr, [`出错了，${errorThrow}`]);
            }
            xhr.onload = function() {
                var response = xhr.responseText || xhr.response;
                if (response) {
                    try{
                        response = JSON.parse(response);
                        if (response.code === 200 && response.data) {
                            if (typeof(options.success) === 'function') {
                                options.success.apply(xhr, [response.data || response, response]);
                            }
                        } else {
                            options.error.apply(xhr, [`出错了，${response.message}, 错误码: ${response.code}`]);
                        }
                    } catch (ex) {
                        console.warn('--WARNING-', ex);
                    }
                } else {
                    options.error.apply(xhr, [`返回数据异常, ${response}`]);
                }
            }
            xhr.send(options.data);
        } else {
            options.error.apply(xhr, [`出错了，请求地址不能为空`]);
        }
    }

    // 查询当前用户信息
    var displayName = '';
    function getUserInfo(callback) {
        xhr({
            url: `/api/user/me?t=${Date.now()}`,
            success: function(data) {
                data = data.me ? data.me : null;
                if (data && data.display_name) {
                    displayName = data.display_name
                    if (typeof(callback) === 'function') {
                        callback(data);
                    }
                }
            }
        });
    }

    // 查询任务信息
    function getTaskInfo(identifier, callback) {
        if (identifier) {
            xhr({
                url: `/api/mission-vnext/tasks/no/${identifier}?t=${Date.now()}`,
                success: function(data) {
                    data = data.value;
                    if (data && data.project_id && data._id) {
                        if (typeof(callback) === 'function') {
                            callback(data);
                        }
                    }
                }
            });
        }
    }

    var workload_groups = [];
    function getWorkloadGroups(callback) {
        if (workload_groups && workload_groups.length) {
            if (typeof(callback) === 'function') {
                callback(workload_groups);
            }
        } else {
            xhr({
                url: `api/mission-vnext/work-addons/work-workload/groups?t=${Date.now()}`,
                success: function(data) {
                    data = data.value;
                    if (data && data.length) {
                        workload_groups = data;
                        if (typeof(callback) === 'function') {
                            callback(data);
                        }
                    }
                }
            });
        }
    }

    function getManHour(callback) {
        getWorkloadGroups(function(data) {
            data = data.slice(-1);
            data = data && data.length ? data[0] : null;
            if (data && typeof(data) === 'object' && data._id) {
                xhr({
                    url: `/api/mission-vnext/work/work-workload/${data._id}/workload-day-member-statistics/content?t=${Date.now()}`,
                    success: function(data) {
                        data = data.value ? data.value.items : null;
                        if (data && data.length) {
                            if (typeof(callback) === 'function') {
                                callback(data);
                            }
                        }
                    }
                });
            }
        });

    }

    function syncCurrentHref() {
        if ($linkOpenNewWindow) {
            $linkOpenNewWindow.href = window.location.href;
        }
    }

    var $workingHoursStat;
    var $linkOpenNewWindow;

    function run(delay, callback) {
        delay = delay || 0;


        setTimeout(function() {

            // 增加新开窗口
            syncCurrentHref();
            var $xmenus = document.querySelector('.x-menus');
            if (!$xmenus) {
                var html = [];
                html.push(`<button type="button" class="x-trigger-manhour" title="查看工时" href="${window.location.href}">查工时</button>`);
                html.push(`<div class="x-manhour">`);
                html.push(`<p>`);
                html.push(`<button type="button" class="x-button">刷新工时</button>`);
                html.push(`<a class="x-button x-link-open-new-window" target="_blank" rel="opener" title="打开新窗口" href="${window.location.href}">新窗口</a>`);
                html.push(`</p>`);
                html.push(`<p id="working-hours-stat">今日工时：...，昨日工时：...</p>`);
                html.push(`<p id="working-hours" title="9:30上班"></p>`);
                html.push(`<p style="color:red;">统计规则：9:30上班，请自行减去午餐或晚餐时间</p>`);
                html.push(`</div>`);
                $xmenus = document.createElement('div');
                $xmenus.className = 'x-menus';
                $xmenus.innerHTML = html.join('');
                $linkOpenNewWindow = $xmenus.querySelector('.x-link-open-new-window');
                $workingHoursStat = $xmenus.querySelector('#working-hours-stat');
                document.body.appendChild($xmenus);

                var queryManHour = function() {
                  // 查询工时
                  if (displayName) {
                      getManHour(function(data) {
                          data = data.filter(function(item) {
                              return item[0] == displayName;
                          });
                          if (data.length) {
                              data = data[0];
                              var manhour = {
                                  today: data.pop(),
                                  yestoday: data.pop()
                              };
                              if ($workingHoursStat) {
                                  $workingHoursStat.innerText = `今日工时：${manhour.today}小时，昨日工时：${manhour.yestoday}小时`;
                              }
                          }
                      });
                  }
                }
                $xmenus.addEventListener('click', function(e){
                  // e.preventDefault();
                  e.stopPropagation();
                  queryManHour();
                });
                queryManHour();

                window.addEventListener('hashchange', function(e){
                    syncCurrentHref();
                }, false);

                WorkingHours({
                    interval: 1000,
                    selector: '#working-hours',
                    prefix: '已上班'
                });
            }




            // 弹框
            var $dialogs = document.querySelectorAll('.thy-dialog-container');
            if ($dialogs && $dialogs.length) {
                $dialogs.forEach(function($dialog) {
                    var $identifier = $dialog.querySelector('.task-identifier');
                    var identifier = $identifier ? ($identifier.innerText || '').trim() : '';
                    var $dialogNavSecondary = $dialog.querySelector('.thy-icon-nav-secondary');
                    if ($dialogNavSecondary) {
                        // 弹框： 在新窗口打开、复制链接
                        var $linkOpen = $dialogNavSecondary.querySelector('.x-link-open-new');
                        var $linkCopy = $dialogNavSecondary.querySelector('.x-link-copy');
                        if (!$linkOpen) {
                            $linkOpen = document.createElement('a');
                            $linkOpen.className = 'thy-icon-nav-link x-link x-link-open-new';
                            $linkOpen.target = '_blank';
                            $linkOpen.innerText = '新窗口打开';
                            $linkOpen.title = '在新窗口中打开';
                            $linkOpen.href = window.location.href;
                            $dialogNavSecondary.appendChild($linkOpen);

                            $linkCopy = document.createElement('a');
                            $linkCopy.className = 'thy-icon-nav-link x-link x-link-copy';
                            $linkCopy.innerText = '复制链接';
                            $linkCopy.title = '复制链接';
                            $linkCopy.href = window.location.href;
                            $linkCopy.addEventListener('click', function(event) {
                                event.preventDefault();
                                event.stopPropagation();
                                var $textarea = document.createElement('textarea');
                                $textarea.style.cssText = 'position:fixed;top:0;left:-500px;z-index:9999;';
                                document.body.appendChild($textarea);
                                var $projectName = $dialog.querySelector('.project-name');
                                var projectName = $projectName ? $projectName.innerText : ''
                                var $taskTitle = $dialog.querySelector('.section-item-title.section-item-title-editor');
                                var taskTitle = $taskTitle ? $taskTitle.value : '';
                                var value = `【${projectName}】 ${identifier ? '#'+ identifier : ''} - ${taskTitle}\r\n${this.href}`;
                                $textarea.value = value;
                                $textarea.select();
                                document.execCommand('Copy');
                                $linkCopy.innerText = '复制成功';
                                setTimeout(function() {
                                    $linkCopy.innerText = '复制链接';
                                    document.body.removeChild($textarea);
                                }, 1500);
                                return false;
                            }, false);
                            $dialogNavSecondary.appendChild($linkCopy);

                            // 当前页面是非需求/任务页面时 查询任务信息
                            var pattern = /(.*)\/projects\/(\w+)\/tasks\/(\w+)([^\w].*)?/;
                            if (identifier && !pattern.test(window.location.href)) {
                                getTaskInfo(identifier, function(data) {
                                    var task_url = `${window.location.origin}/mission/projects/${data.project_id}/tasks/${data._id}`;
                                    $linkCopy.href = $linkOpen.href = task_url;
                                });
                            }

                        }


                        // 弹框：需求/任务 描述 编辑、复制
                        if (!$dialog.querySelector('.markdown-body-new')) {
                            //var $textareaShowWrappers = $dialog.querySelectorAll('.textarea-show-wrapper');
                            var $textareaShowWrappers = $dialog.querySelectorAll('field-item-textarea-show-edit');
                            if ($textareaShowWrappers && $textareaShowWrappers.length) {
                                $textareaShowWrappers.forEach(function($textareaShowWrapper) {
                                    (function($textareaShowBody, $markdownBody, $newMarkdownBody) {

                                        var cloneMarkdownNode = function($targetNode) {
                                            if ($targetNode) {
                                                $newMarkdownBody = $targetNode.cloneNode(true);
                                                $newMarkdownBody.classList.add('markdown-body-new');
                                                $newMarkdownBody.addEventListener('click', function(event) {
                                                    var tagName = event.target.tagName;
                                                    console.log('tagName:', tagName);
                                                    // console.log(event.target.getAttribute('preview'));
                                                    if (tagName != 'IMG' && tagName != 'A') {
                                                      event.preventDefault();
                                                      event.stopPropagation();
                                                      return false;
                                                    }
                                                }, false);
                                                $newMarkdownBody.addEventListener('mouseup', function(event) {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    return false;
                                                }, false);
                                                $newMarkdownBody.addEventListener('dblclick', function(event) {
                                                    $textareaShowBody.classList.toggle('textarea-show-body-collapse');
                                                    return false;
                                                }, false);
                                                //$textareaShowBody.appendChild($newMarkdownBody, $markdownBody);
                                                return $newMarkdownBody;
                                            }
                                        }
                                        if ($markdownBody) {
                                            $newMarkdownBody = cloneMarkdownNode($markdownBody);
                                            $textareaShowBody.appendChild($newMarkdownBody, $markdownBody);
                                        }

                                        var syncDescHandler = function(event) {
                                            setTimeout(function() {
                                                $textareaShowBody = $textareaShowWrapper.querySelector('.textarea-show-body');
                                                $markdownBody = $textareaShowWrapper.querySelector('.markdown-body');
                                                if ($textareaShowBody && $markdownBody) {
                                                    if ($textareaShowBody && !$textareaShowBody.querySelector('.markdown-body-new')) {
                                                        $newMarkdownBody = cloneMarkdownNode($markdownBody);
                                                        $textareaShowBody.appendChild($newMarkdownBody, $markdownBody);
                                                    }
                                                    $newMarkdownBody.innerHTML = $markdownBody.innerHTML;
                                                }
                                            }, 450);
                                        }
                                        var $textareaShowWrapperParent = $textareaShowWrapper;
                                        if ($textareaShowWrapperParent) {
                                            $textareaShowWrapperParent.addEventListener('mouseup', syncDescHandler, false);
                                        }
                                    })($textareaShowWrapper.querySelector('.textarea-show-body'), $textareaShowWrapper.querySelector('.markdown-body'));
                                });
                            }

                        }

                    }
                })
            }
            if (typeof(callback) === 'function') {
                callback();
            }
        }, delay);
    }

    function init() {
        getUserInfo(function(data) {

            initStyle();

            document.body.addEventListener('mousedown', function(e) {
                run(1500);
            }, false);

            //run(1350);
            run(1850);
        });
    }

    if (document.contentType.startsWith('text/html')) {
        init();
    }
})();