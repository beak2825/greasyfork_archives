// ==UserScript==
// @name         Strategry Import/Export on Stake|Stake策略导入导出
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Import and export dice strategy on Stake.Contact @fcfcface via telegram for more tools.通过Telegram联系@fcfcface获取更多工具。
// @author       FCFC
// @match        https://stake.com/zh/casino/games/dice
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stake.com
// @match        https://stake.com/*
// @match        https://stake.ac/*
// @match        https://stake.games/*
// @match        https://stake.bet/*
// @match        https://stake.pet/*
// @match        https://stake.mba/*
// @match        https://stake.jp/*
// @match        https://stake.bz/*
// @match        https://stake.ceo/*
// @match        https://stake.krd/*
// @match        https://staketr.com/*
// @match        https://stake1001.com/*
// @match        https://stake1002.com/*
// @match        https://stake1003.com/*
// @match        https://stake1021.com/*
// @match        https://stake.us/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/javascript/javascript.min.js
// @resource     codemirrorCSS https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/codemirror.min.css
// @resource     codemirrorthemeCSS https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/theme/dracula.min.css
// @downloadURL https://update.greasyfork.org/scripts/518198/Strategry%20ImportExport%20on%20Stake%7CStake%E7%AD%96%E7%95%A5%E5%AF%BC%E5%85%A5%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/518198/Strategry%20ImportExport%20on%20Stake%7CStake%E7%AD%96%E7%95%A5%E5%AF%BC%E5%85%A5%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取CSS内容
    const css = GM_getResourceText("codemirrorCSS");
    const css1 = GM_getResourceText("codemirrorthemeCSS");

    // 添加到页面样式中
    GM_addStyle(css);
    GM_addStyle(css1);

    var $ = $ || window.$;
    $(function(){
        var botName = GM_info.script.name;
        var version = GM_info.script.version;
        var storeKey = 'strategies_saved';
        var list = [];
        var selectedList = [];
        var editor = null;
        var storage = {
            get: async(key) => {
                try {
                    const res = localStorage.getItem(key);
                    return JSON.parse(res);
                } catch(error) {
                    throw error;
                }
            },
            set: async(key, data) => {
                try {
                    let datastr = JSON.stringify(data);
                    localStorage.setItem(key, datastr);
                } catch(error) {
                    throw error;
                }
            }
        }
        var language = {
            zh: {
                showBotLabel: '策略管理',
                botName: '策略导入导出',
                export: '导出',
                import: '导入',
                selectStra: '选择要导出的策略',
                selectFile: '从JSON文件导入',
                fileError: '文件解析错误。',
                ImportNotFound: '请选选择json文件或者粘贴json内容。',
                importSuccess: '已导入，请刷新页面。',
                exportNotFound: '请先选择要导出的策略。',
                exportSuccess: '已导出，请查看浏览器下载列表。',
            },
            en: {
                showBotLabel: 'Strategy',
                botName: 'Strategy Import/Export',
                export: 'Export',
                import: 'Import',
                selectStra: 'Select the strategy to export',
                selectFile: 'Import from json file',
                fileError: 'File parsing error.',
                ImportNotFound: 'Please select the json file or paste the json content.',
                importSuccess: 'mported, please refresh the page.',
                exportNotFound: 'Please select the strategy you want to export first.',
                exportSuccess: 'Exported, please check the browser download list.',
            }
        }
        var locale = window.location.href.indexOf('/zh') > -1 ? 'zh' : 'en';
        var i18n = locale == 'zh' ? language.zh : language.en;
        init();
        async function init() {
            await UI();
            // 初始化 CodeMirror 编辑器
            let target = $('#strategyWrap .editor textarea')[0];
            editor = CodeMirror.fromTextArea(target, {
                mode: { name: "javascript", json: true },
                lineNumbers: true,
                //theme: "default",
                theme: "dracula", // 设置黑暗主题
                tabSize: 2,
            });
            editor.setSize("100%", "300px");
            await getList();
            exportStrategy();
            chooseFile();
            importStrategy();
        }
        async function getList() {
            try {
                list = await storage.get(storeKey);
                const straList = [];
                let renderList = '';
                list.forEach((item, index) => {
                    straList.push({name: item.label, index});
                    renderList+= `<div class="strategy-item">${item.label}</div>`
                })
                $('#strategyWrap .strategy').html(renderList);
                // 获取所选项的值
                $('#strategyWrap .strategy-item').click(function(e) {
                    let index = $(this).index();
                    let name = $(this).text();
                    //console.log('Index:' + index);
                    let active = $(this).hasClass('stra-item-active');
                    let select = !active;
                    if (select) {
                        $(this).addClass('stra-item-active');
                        selectedList.push(list[index]);
                    } else {
                        //console.log('取消选择：' + name);
                        $(this).removeClass('stra-item-active');
                        const newSelectList = [];
                        selectedList.forEach(item => {
                            if (item.label != name) {
                                newSelectList.push(item);
                            }
                        });
                        selectedList = newSelectList;
                    }
                    //console.log(selectedList)
                    //editor.setValue(JSON.stringify(selectedList, null, 2));
                })
            } catch(error) {
                message(error.message, 'error');
            }
        }
        function chooseFile() {
            document.getElementById('json-input').addEventListener('change', function(event) {
                const file = event.target.files[0];

                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        try {
                            // 将文件内容解析为 JSON 对象
                            const jsonData = JSON.parse(e.target.result);
                            editor.setValue(JSON.stringify(jsonData, null, 2));
                        } catch (error) {
                            console.error("文件解析错误:", error);
                            message(i18n.fileError, 'error');
                        }
                    };
                    reader.readAsText(file); // 读取文件内容
                }
            });
        }
        function importStrategy() {
            $('#strategyWrap .import-btn').click(async function(){
                try {
                    const content = editor.getValue();
                    if (!content || !content.toString || content.toString() == '[]' || content.toString() == '{}') {
                        message(i18n.ImportNotFound);
                        return;
                    }
                    const newList = JSON.parse(content); // 解析 JSON 验证格式
                    const oldList = await storage.get(storeKey);
                    const oldlabels = [];
                    oldList.forEach(item => {
                        oldlabels.push(item.label);
                    })
                    newList.forEach((item,index) => {
                        if (oldlabels.includes(item.label)) {
                            newList[index].label = `${item.label}-1`;
                        }
                    })
                    oldList.push(...newList);
                    // 保存策略
                    await storage.set(storeKey, oldList);
                    message(i18n.importSuccess, 'success');
                    editor.setValue("");
                } catch(error) {
                    message(error.message, 'error');
                }
            })
        }
        function exportStrategy() {
            $('#strategyWrap .export-btn').click(function() {
                if (selectedList.length == 0) {
                    message(i18n.exportNotFound);
                    return;
                }
                selectedList.map(item => {
                    item.label = `${item.label}`;
                    return item;
                })
                const filename = 'export_strategy.json';
                // 将 JSON 对象转为字符串
                const jsonStr = JSON.stringify(selectedList, null, 2);

                // 创建 Blob 对象
                const blob = new Blob([jsonStr], { type: "application/json" });

                // 创建下载链接
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;

                // 触发下载
                link.click();

                // 释放 URL 对象
                URL.revokeObjectURL(link.href);
                message(i18n.exportSuccess, 'success');
            })
        }
        function message(text, type) {
            let msgHtml = '';
            let successColor = '#00e701';
            let errorColor = 'red';
            if (type == 'success') {
                msgHtml = `<div style="color: ${successColor}">${text}</div>`;
            } else if (type == 'error') {
                msgHtml = `<div style="color: ${errorColor}">${text}</div>`;
            } else {
                msgHtml = `<div style="color:#e3a725">${text}</div>`;
            }
            $('#strategyWrap .error-message-wrap').html(msgHtml);
        }
        async function UI() {
            // 获取窗口宽度
            var windowWidth = $(window).width();
            //console.log("初始窗口宽度: " + windowWidth);
            let wrapWidth = windowWidth > 640 ? '480px' : '86%';
            let wrapLeft = windowWidth > 640 ? '60px' : '7%';
            let showCenter = windowWidth > 640 ? 'left:50%;margin-left:-240px;' : '';
            //const style = document.createElement('style');
            //style.type = 'text/css';
            // style.innerHTML
            const CSS = `#strategyWrap {font-size:13px;color:#d5dceb;}
        #strategy-status {position:fixed;right: 0;top:136px;width:62px;height:30px;text-align:center;line-height:30px;background:#1475E1;color:#fff;font-size:12px;cursor:pointer;z-index:1000001;border-top-left-radius: 16px;
    border-bottom-left-radius: 16px;}
        #strategyWrap .get-balance-btn {padding: 0 5px;height: 30px;border-radius: 4px;background: #1475E1;color:#fff;font-size:0.7rem;cursor:no-drop;opacity:0.6;}
        #strategyWrap .import-btn {display:flex;align-items:center;justify-content: center;padding: 0 8px;height:26px;background:#996d0e;border-radius:4px;cursor:pointer;}
        #strategyWrap .export-btn {display:flex;align-items:center;justify-content: center;padding: 0 8px;height:26px;background:#158922;border-radius:4px;cursor:pointer;}
        #strategyWrap .strategy {background:#1a2c38;padding:5px;border:1px solid #2f4553;border-radius:5px;max-height:100px;overflow:auto;}
        #strategyWrap .strategy .strategy-item {display:inline-block;line-height:26px;padding:0 8px;height:26px;border:1px solid #2f4553;margin:5px;border-radius:5px;cursor:pointer;}
        .stra-item-active {background: #1f5b9f}
        #strategyWrap .error-message-wrap {background:#1a2c38;padding:10px;border:1px solid #2f4553;border-radius:5px;min-height:35px;max-height:60px;overflow:auto;margin-top:5px;}
    `;
            GM_addStyle(CSS);
            // 将样式元素添加到页面头部
            //document.head.appendChild(style);
            var html = `<div id="strategy-status">${i18n.showBotLabel}</div>
                <div id="strategyWrap" style="position:fixed;top:72px;left:${wrapLeft};z-index:1000000;background:rgba(0,0,0,.5);border-radius:5px;width:${wrapWidth};${showCenter}">
                    <div style="padding:10px 8px;background:#213743;margin:0 auto;border-radius:5px;border:2px solid #2f4553;">
                         <div style="display:flex;align-items:center;justify-content: space-between;">
                             <div style="font-size:16px;font-weight:bold;color:#fff">${i18n.botName} <span class="version">v${version}</span></div>
                         </div>
                         <div class="export" style="margin:10px 0;">
                             <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
                                 <div style="margin-bottom:5px;font-size:14px;font-weight:bold;color:#fff;">${i18n.selectStra}</div>
                                 <div class="export-btn">${i18n.export}</div>
                             </div>
                             <div class="strategy"></div>
                         </div>
                         <div class="import" style="margin-top:10px;">
                             <div style="display:flex;align-items:center;justify-content:space-between;">
                                 <div style="margin-bottom:5px;font-size:14px;font-weight:bold;color:#fff;">${i18n.selectFile}</div>
                                 <div class="import-btn">${i18n.import}</div>
                             </div>
                             <input type="file" id="json-input" accept=".json" />
                         </div>
                         <div class="editor" style="margin-top:8px;overflow:hidden;border-radius:5px;border:1px solid #2f4553;">
                             <textarea></textarea>
                         </div>

                         <div class="error-message-wrap"></div>
                     </div>
               </div>`
            $('body').append(html);

            $('#strategy-status').click(function(){
                $('#strategyWrap').toggle();
            })
        }
    })
})();