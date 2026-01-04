// ==UserScript==
// @name         NGA优化摸鱼体验插件-标记备份
// @namespace    https://github.com/DelCrona/Mark_LocalBackup
// @version      1.0.3
// @author       DelCrona
// @description  适用范围：不想使用webdav且标记数量巨大
// @license      MIT
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @require      https://cdn.staticfile.org/blueimp-md5/2.19.0/js/md5.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/489936/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E6%A0%87%E8%AE%B0%E5%A4%87%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/489936/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E6%A0%87%E8%AE%B0%E5%A4%87%E4%BB%BD.meta.js
// ==/UserScript==

(function (registerPlugin) {
    'use strict';
    registerPlugin({
        name: 'LocalBackup',  // 插件唯一KEY
        title: '本地备份',  // 插件名称
        desc: '将标记列表备份到本地/上传',  // 插件说明
        settings: [{
            key: 'textInput',
            title: '重要提示：使用前请先用本体功能备份标记',
            desc: ''
        }, {
            key: 'numberInput',
            title: '上传功能上传非标记文件会导致标记直接损坏！',
            desc: ''
        }, {
            key: 'checkBox',
            title: '请务必确认文件是否为标记文件.json!',
            desc: ''
        }, {
            key: 'checkBox',
            title: '覆盖上传同理，使用前优先备份！',
            desc: ''
        },{
            key: 'desc',
            title: '备份文件：自动下载标记文件',
            desc: ''
        }, {
            key: 'desc2',
            title: '覆盖上传标记：上传后直接覆盖原标记',
            desc: ''
        }, {
            key: 'desc3',
            title: '合并上传标记：将现存标记和上传标记合并',
            desc: ''
        }],
        buttons: [ {
            title: '备份标记',
            action: 'backup'
        },{
            title: '覆盖上传标记',
            action: 'loadFile'
        },{
            title: '合并上传标记',
            action: 'mergeFile'
        }],
        beforeSaveSettingFunc(setting) {
            // console.log(setting)
            // return 值则不会保存，并抛出错误
            // return '拦截'
        },
        preProcFunc() {

        },
        initFunc() {
            /*
            console.log('已运行: initFunc()')
            console.log('插件ID: ', this.pluginID)
            console.log('插件配置: ', this.pluginSettings)
            console.log('主脚本: ', this.mainScript)
            console.log('主脚本引用库: ', this.mainScript.libs)
            */
        },
        postProcFunc() {
            
        },
        renderThreadsFunc($el) {

        },
        renderFormsFunc($el) {
            
        },
        renderAlwaysFunc() {
            // console.log('循环运行: renderAlwaysFunc()')
        },
        async backup(){
            function formatDate(date) {
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var year = date.getFullYear();
                month = month.toString().padStart(2, '0');
                day = day.toString().padStart(2, '0');
                hours = hours.toString().padStart(2, '0');
                minutes = minutes.toString().padStart(2, '0');
                year = year.toString();
                return year + month + day + hours + minutes;
            }
            var fDate = formatDate(new Date());
            const markList = this.mainScript.getModule('MarkAndBan').markList;
            const markListStr = JSON.stringify(markList);
            var filename = "NGA_marklist_"+ fDate;
            const mimeType = "application/json";
            // 模拟下载功能导出列表
            const blob = new Blob([markListStr], {type: mimeType});
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        },
        async loadFile(){
            // 创建一个隐藏的上传按钮
            const _this = this;
            var uploadButton = document.createElement('input');
            uploadButton.type = 'file';
            uploadButton.style.display = 'none';
            uploadButton.id = 'hiddenFileInput'; // 为上传按钮设置一个ID，方便后续操作
            // 将隐藏的上传按钮添加到DOM中
            document.body.appendChild(uploadButton);
            // 为上传按钮添加change事件监听器
            uploadButton.addEventListener('change', function() {
                // 获取用户选择的文件
                var file = this.files[0];
                if (file) {
                    // 读取文件内容
                    const markList = _this.mainScript.getModule('MarkAndBan').markList;
                    const markListStr = JSON.stringify(markList);
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        // 文件读取完成后，输出文件内容
                        // console.log('文件内容:', event.target.result);
                        const markUpload = event.target.result;
                        // 在这里可以对文件内容进行进一步处理，例如显示在网页上或发送到服务器
                        if (md5(markUpload) !== md5(markListStr)){
                            const markListStr = markUpload;
                            const markList = JSON.parse(markListStr);
                            _this.mainScript.getModule('MarkAndBan').markList = markList;
                            _this.mainScript.setValue("hld__NGA_mark_list", markListStr);
                            _this.mainScript.popNotification('标记名单列表已还原');
                        }
                        // 清理资源
                        reader = null;
                    };
                    // 以文本格式读取文件内容
                    reader.readAsText(file);
                }
                // 移除上传按钮
                document.body.removeChild(uploadButton);
            });
            // 模拟点击上传按钮
            uploadButton.click(); 
        },
        async mergeFile(){
            const _this = this;
            var uploadButton = document.createElement('input');
            uploadButton.type = "file";
            uploadButton.style.display = "none";
            uploadButton.id = 'hiddenFileInput'; // 为上传按钮设置一个ID，方便后续操作
            document.body.appendChild(uploadButton);
            uploadButton.addEventListener('change', function() {
                // 获取用户选择的文件
                var file = this.files[0];
                if (file) {
                    // 读取文件内容
                    const fileA = _this.mainScript.getModule('MarkAndBan').markList;
                    const markListStr = JSON.stringify(fileA);
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        // 文件读取完成后，输出文件内容
                        // console.log('文件内容:', event.target.result);
                        const markUpload = event.target.result;
                        // 在这里可以对文件内容进行进一步处理，例如显示在网页上或发送到服务器
                        if (md5(markUpload) !== md5(markListStr)){
                            const fileB = JSON.parse(markUpload);
                            var mergedJSON = fileA;
                            fileB.forEach(function(objB){
                                var matchObj = mergedJSON.findIndex(function(objA){
                                    return objA.uid === objB.uid;
                                });
                                if (matchObj !== -1){
                                    objB.marks.forEach(function(markB){
                                    var existMark = mergedJSON[matchObj].marks.find(function(markA){
                                        return (markA.mark === markB.mark && markA.bg_color === markB.bg_color);
                                    });
                                    if (!existMark){
                                        mergedJSON[matchObj].marks.push(markB);
                                    }
                                    })
                                } else {
                                    mergedJSON.push(objB);
                                }
                            })
                            const mergedJSONStr = JSON.stringify(mergedJSON);
                            _this.mainScript.getModule('MarkAndBan').markList = mergedJSON;
                            _this.mainScript.setValue("hld__NGA_mark_list", mergedJSONStr);
                            _this.mainScript.popNotification('标记名单列表已合并');    
                        }
                        // 清理资源
                        reader = null;
                    };
                    // 以文本格式读取文件内容
                    reader.readAsText(file);
                }
                // 移除上传按钮
                document.body.removeChild(uploadButton);
            });

            uploadButton.click(); 
        }
    })

})(function(plugin) {
    plugin.meta = GM_info.script
    unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || []
    unsafeWindow.ngaScriptPlugins.push(plugin)
});