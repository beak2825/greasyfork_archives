// ==UserScript==
// @name        百度网盘一键批量修改后缀-替换文件及文件夹名
// @namespace    dupanBatchRename
// @version      0.1.4
// @description  感谢wealding，修改自【百度网盘一键批量修改后缀&批量替换文件名】；增加了批量修改文件夹名的功能；百度网盘一键批量修改后缀，默认修改为MP4；批量替换文件名【说明：批量改后缀强制改所有后缀，批量替换文件名可以替换一些垃圾版权信息】 https://www.52pojie.cn/forum.php?mod=redirect&goto=findpost&ptid=1635569&pid=42658146   https://greasyfork.org/zh-CN/scripts/446799 
// @AuThor       ding(AT)gong.si - Modified By Moka
// @license MIT
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463298/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E5%90%8E%E7%BC%80-%E6%9B%BF%E6%8D%A2%E6%96%87%E4%BB%B6%E5%8F%8A%E6%96%87%E4%BB%B6%E5%A4%B9%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/463298/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%80%E9%94%AE%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E5%90%8E%E7%BC%80-%E6%9B%BF%E6%8D%A2%E6%96%87%E4%BB%B6%E5%8F%8A%E6%96%87%E4%BB%B6%E5%A4%B9%E5%90%8D.meta.js
// ==/UserScript==

//日志函数
var debug = false;
var log_count = 1;
function slog(c1,c2,c3){
    c1 = c1?c1:'';
    c2 = c2?c2:'';
    c3 = c3?c3:'';
    if(debug) console.log('#'+ log_count++ +'-ScriptLog:',c1,c2,c3);
}

var max_traverse_dir = 10; // 当遍历文件夹数量超过这个数值时提示用户一次
var traverseCount = 0;
var traversePause = 0;

var instance;
var fileList={};
var Traverse={path:[]};
var panAPIUrl = location.protocol + "//" + location.host + "/api/";
var restAPIUrl = location.protocol + "//pcs.baidu.com/rest/2.0/pcs/";
var clientAPIUrl = location.protocol + "//d.pcs.baidu.com/rest/2.0/pcs/";

function getPath() {
    return instance.listInstance.currentKey;
}

// 对 fileList 作了修改，不同目录返回不同的文件列表，遍历时会传入 path 参数
function getFileList(path){
    let isTraverse;
    if (path) {
        isTraverse = true;
    } else {
        path = getPath();
        // 获取用户选中项
        let currentList = instance.listInstance.getCheckedItems();
        // 没有选中项，则获取此目录文件列表
        if (!currentList.length) {
            currentList = instance.listInstance.getCurrentDataList();
        }
        if (currentList.length < 100) {
            slog('getFileList from listInstance:',path);
            return currentList;
        }
    }
    if (fileList[path] && fileList[path].length) {
        slog('getFileList from cache:',path);
        return fileList[path];
    } else if (isTraverse) {
        if (traverseCount === max_traverse_dir) {
            traversePause = !confirm("此目录包含的文件夹过多，请确认是否继续");
        }
        traverseCount++;
        slog('traverseCount:', traverseCount);
    }
    if (traversePause) {
        slog('traverse pause because of too much dir');
        return false;
    }
    // 文件列表超过100个，通过 api 获取所有文件
    slog('getFileList by path:',path);
    let listUrl = panAPIUrl + "list";
    let params = {
        dir:path,
        //bdstoken:bdstoken, //百度网盘会自动补全参数，原因不明 2020年11月24日 09:18:24
        //logid:logid,
        order:'name',
        desc:0,
        showempty:0,
    };
    $.ajax({
        url:listUrl,
        async:false,
        method:'GET',
        data:params,
        success:function(response){
            fileList[path] = 0===response.errno ? response.list : [];
        }
    });
    return fileList[path];
}

// 遍历文件夹内容
function traverseFileList(listUpper) {
    let listArray = [];
    $(listUpper).each(function(){
        if (!this.mountPath) {
            if (this.isdir === 1) {
                let sublist = getFileList(this.path);
                if (!sublist) {
                    return false;
                }
                listArray = listArray.concat(traverseFileList(sublist));
                Traverse.path.push(this.path);
                //slog('Traverse path cache:', Traverse.path);
            } else {
                listArray = listArray.concat(this);
            }
        }
    });
    return listArray;
}

// 刷新文件列表
function refreshList() {
    let path = getPath();
    delete fileList[path];
    Traverse.path.forEach(function(e){
        delete fileList[e];
    });
    delete Traverse[path];
    instance.message.trigger("system-refresh");
}

function rename(filelist){
    let url = panAPIUrl + 'filemanager?opera=rename&async=2'; //百度网盘会自动补全参数，原因不明 2020年11月24日 09:18:24
    let params = {
        filelist:JSON.stringify(filelist),
    };
    $.ajax({
        url:url,
        method:'POST',
        async:false,
        data:params,
        success:function(response){
            slog('response :',response);
            if(response.errno === 0){
                tip('修改成功，共修改 ' + filelist.length + ' 个文件</a>');
                // 服务端有可能没及时更新，延迟刷新列表
                setTimeout(function(){
                    refreshList();
                    panel.hide();
                }, 2400);
            }else if(response.errno === 12){
                tip('当前还有任务未完成，请稍后再试。');
            }else{
                tip('修改失败，请尝试重新登录。如果持续失败，可能是百度接口发生改变。', 4e3);
            }
        }
    });
}

// 提示信息
var tip_timeout;
function tip(msg, timeout) {
    clearTimeout(tip_timeout);
    timeout = timeout || 1500;
    let $tip = $('#tip');
    $tip.html(msg).css({
        'margin-left': -$tip.outerWidth()/2,
        'margin-top': -$tip.outerHeight()/2
    }).fadeIn(120);
    tip_timeout = setTimeout(function() {
        $tip.fadeOut();
    }, timeout);
}

// 筛选文件，默认删除不匹配项，设置 keep 保留原始项比如预览的时候
function filter(keep) {
    let chosen = $('.rename-chosen')[0];
    var isReplace = chosen.classList.contains('rename-replace');
    var isAdd = chosen.classList.contains('rename-add');
    if (isReplace) {
        var str_to_find = $('#rename-from').val();
        if (!keep && !str_to_find){
            tip('请输入关键词');
            return;
        }
        var pattern;
        var str_to_replace = $('#rename-to').val();
        let renameType = $('#rename-type').val();
        let g = '';
        if (renameType !== "regexp") {
            str_to_find = str_to_find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            if (renameType === "global") {
                g = 'g';
            }
        }
        try {
            pattern = new RegExp(str_to_find, g);
        } catch(e) {
            tip('正则表达式有误，请检查');
            return;
        }
    } else if (isAdd) {
        var thestart = $('#rename-start').val().replace(/(^\s*)/g,"");
        var theend = $('#rename-end').val().replace(/(\s*$)/g,"");
        if (!keep && !thestart && !theend){
            tip('请输入前缀或后缀');
            return;
        }
    } else {
        var theext = $('#rename-ext').val().trim();
        if (!keep && !theext){
            tip('请输入扩展名');
            return;
        }
        var oldext = $('#rename-oldext').val().trim();
    }
    let list = Traverse[getPath()] || getFileList();
    slog('list_Length:' + list.length, 'list:',list);
    if(list.length > 0){
        let toRename = [];
        // 替换关键词
        if (isReplace) {
            $(list).each(function (i){
                slog('list '+ i +':',this.path);
                if (this.mountPath) return true; // 跳过系统目录
                let fileName = this.server_filename;
                if (keep && str_to_find === '') {
                    toRename.push({"path":this.path,"newname":fileName});
                } else {
                    let newName = fileName.replace(pattern, str_to_replace);
                    if (keep || newName !== fileName) {
                        slog('newName:',newName);
                        toRename.push({"path":this.path,"newname":newName});
                    }
                }
            });
        }
        // 改前后缀
        else {
            $(list).each(function (i){
                slog('list '+ i +':',this.path);
                if (this.mountPath || !isAdd && this.isdir === 1) return true; // 改拓展名跳过目录
                let fileNameArray = this.server_filename.split(".");
                let fileext = fileNameArray.length>1 ? fileNameArray.pop() : '';
                if (isAdd) {
                    let last = fileNameArray.length-1;
                    fileNameArray[0] = thestart + fileNameArray[0];
                    fileNameArray[last] = fileNameArray[last] + theend;
                    if (fileext) fileNameArray.push(fileext);
                    slog('Add start:' + thestart,'end:' + theend);
                } else {
                    // 当设置原扩展名时不替换其他扩展名
                    if (oldext && oldext !== fileext) {
                        if (!keep) {
                            return true;
                        }
                        if (fileext) fileNameArray.push(fileext);
                    } else {
                        // 排除相同扩展名
                        if (fileext === theext && !keep) {
                            return true;
                        }
                        fileNameArray.push(theext);
                        slog('FileExt :',fileext);
                    }
                }
                let newName = fileNameArray.join('.');
                slog('newName:',newName);
                toRename.push({"path":this.path,"newname":newName});
            });
        }
        return toRename;
    }
    tip('这个目录是空的哦');
    return;
}

var panel = {
    traverse: function(){
        instance.ui.tip({
            msg: '遍历文件夹中...',
            mode: 'loading',
            autoClose: false
        });
        setTimeout(function() {
            let list = Traverse[getPath()];
            if (list === undefined) {
                list = getFileList();
                list = traverseFileList(list);
                Traverse[getPath()] = list;
                panel.preview();
                traverseCount = 0;
                traversePause = 0;
            }
            instance.ui.hideTip();
        }, 30);
    },
    preview: function(){
        let toRename = filter(true);
        if (toRename) {
            if (toRename.length) {
                let i = 0;
                let html = '';
                $(toRename).each(function (){
                    let fileName = this.path.split("/").pop();
                    let newName = this.newname;
                    let changed = fileName !== newName;
                    html += '<li class="item ' + (changed ? 'item-changed' : 'item-hide') + '">';
                    html += '<span class="item-name" title="' + fileName + '">' + fileName + '</span>';
                    html += '<span class="item-name" title="' + newName + '">' + newName + '</span>';
                    if (changed) i++;
                    html += '</li>';
                });
                html = '<p style="padding:0 6px 6px;color:red">查询到 ' + toRename.length + ' 个文件，将替换 ' + i + ' 个文件'
                    + (i === 0 ? '<style>#dialog-rename .item-hide{display:block}</style>' : i < toRename.length ? '，<a class="toggle-item" href="javascript:;">查看所有文件</a>' : '')
                    + '</p><div style="padding:6px 15px 0;background:#f7f7f7"><span class="item-name"><b>原文件名</b></span><span class="item-name"><b>新文件名</b></span></div>'
                    + '<ul>' + html + '</ul>';
                $('#rename-preview').html(html);
                if (window.innerHeight<$('#dialog-rename').offset().top + $('#dialog-rename').height()) panel.show();
            } else {
                tip("未找到替换项");
            }
        }
    },
    rename: function(){
        let toRename = filter();
        if (toRename) {
            slog('toRename :',toRename);
            if (toRename.length){
                rename(toRename);
            } else {
                $('.rename-chosen').hasClass('rename-replace') ? tip('好像没有替换') : tip('无需更改扩展名');
            }
        }
    },
    show: function(){
        $('#rename-canvas').show();
        let $rename = $('#dialog-rename');
        $rename.css({
            'left': (window.innerWidth - $rename.width())/2,
            'top': (window.innerHeight - $rename.height())/2
        }).show();
    },
    hide: function(){
        $('#rename-canvas').hide();
        $('#dialog-rename').hide();
        $('#rename-preview').text('');
        delete Traverse[getPath()];
    },
};


//入口函数
try {
    instance = require("system-core:context/context.js").instanceForSystem;
} catch(e) {
    console.warn('页面未正常加载，或者百度已经更新！');
    return;
}
var i = 1;
var addBtn = setInterval(function(){
    let q_sel = document.querySelector('[data-button-index="3"]'); // 离线下载按钮，如果不是则需要修改
    if (q_sel) {
        clearInterval(addBtn);
        // 构建样式和弹窗
        $('head').append('<style>#dialog-rename .rename-field{text-align:center;display:none}#dialog-rename .rename-chosen{text-align:center;display:block}#dialog-rename input[type=text]{border:1px solid #e0e1e4;border-radius:4px;width:150px;line-height:30px;margin-right:18px;padding:0 6px;}#dialog-rename input[type=text]:last-child{margin-right:0;}#dialog-rename .item-name{width:50%;display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}#dialog-rename .item-changed{color:#478de4;}#dialog-rename .item-hide{display:none;}#dialog-rename ul{max-height:150px;padding:0 15px 6px;overflow-y:auto;background:#f7f7f7;}#dialog-rename .dialog-asyn-view .asyn-view-content li{padding-left:0}#dialog-rename .g-button-right .text{padding:0 18px;}#dialog-rename .tab-button .text{padding:0;}#tip{position:absolute;top:50%;left:50%;background:rgba(0,0,0,.75);color:#fff;padding:6px 12px;font-size:120%;border-radius:4px;white-space:nowrap;display:none}#rename-type{border:1px solid #e0e1e4;outline:0;border-radius:4px;height:30px;line-height:30px;padding-left: 4px;margin-right:18px;box-sizing:content-box;}</style>');
        $('body').append('<div id="rename-canvas" style="position:fixed;left:0px;top:0px;z-index:50;background:rgb(0,0,0);opacity:0.5;width:100%;height:100%;display:none"></div><div style="width:540px;z-index:53;display:none;" id="dialog-rename" class="dialog alert-dialog-asyn-view"><div class="dialog-header dialog-drag"><h3><span class="dialog-header-title" style="font-weight:200;font-style:normal">批量重命名</span></h3><div class="dialog-control"></div></div><div class="dialog-body"><div class="rename-choose" style="text-align:center;margin-top:15px;"><a class="g-button g-button-blue tab-button" style="margin-right:-6px;border-radius:4px 0 0 4px;"><span class="g-button-right"><span class="text">替换关键词</span></a><a class="g-button tab-button" style="margin-right:-6px;border-radius:0"></span><span class="g-button-right"><span class="text">添加前后缀</span></span></a><a class="g-button tab-button" style="border-radius:0 4px 4px 0;"></span><span class="g-button-right"><span class="text">修改扩展名</span></a></div><div class="dialog-asyn-view"><div class="rename-form"><div class="rename-field rename-replace rename-chosen"><input id="rename-from" type="text" placeholder="关键词"><select id="rename-type"><option value="normal">替换一次</option><option value="global">替换全局</option><option value="regexp">正则匹配</option></select><input id="rename-to" type="text" placeholder="替换为"></div><div class="rename-field rename-add"><input id="rename-start" type="text" placeholder="前缀"><input id="rename-end" type="text" placeholder="后缀"></div><div class="rename-field"><input id="rename-oldext" type="text" placeholder="原扩展名, 可不填"><input id="rename-ext" type="text" value="mp4" placeholder="扩展名"></div></div><div id="rename-preview" style="margin-top:12px;"></div></div></div><div class="dialog-footer"></div><div id="tip"></div></div>');
        // 添加按钮
        let button_to_add = [
            {name: '遍历文件夹', action: 'traverse', blue: 1},
            {name: '预览', action: 'preview', blue: 1},
            {name: '替换', action: 'rename', blue: 1},
            {name: '取消', action: 'hide'}
        ];
        $(button_to_add).each(function() {
            let a = document.createElement('a');
            a.className = "g-button" + (this.blue ? ' g-button-blue-large' : '');
            a.innerHTML = '<span class="g-button-right"><span class="text">' + this.name +  '</span></span>';
            a.onclick = panel[this.action];
            $('#dialog-rename .dialog-footer').append(a);
        });
        let btn_close = document.createElement('span');
        btn_close.className = "dialog-icon dialog-close icon icon-close";
        btn_close.onclick = panel.hide;
        $('#dialog-rename .dialog-control').append(btn_close);
        let btn_edit = document.createElement('a');
        btn_edit.className = "g-button";
        btn_edit.href = "javascript:;";
        btn_edit.innerHTML = '<span class="g-button-right"><i class="icon icon-edit" title="批量重命名"></i><span class="text">批量重命名</span></span>';
        btn_edit.onclick = panel.show;
        $(q_sel).before(btn_edit);
        // 防止按钮被遮挡
        let hasChecked = instance.listInstance.getCheckedItems();
        if (hasChecked.length) {
            instance.Broker.getButtonBroker("listTools").filesSelect(hasChecked, {
                paddingLeft:q_sel.parentNode.clientWidth
            })
        }
        // 弹窗标题栏添加拖拽效果
        let target, active, startX, startY;
        $('#dialog-rename .dialog-header').on("mousedown touchstart", function(e) {
            active = true;
            target = $(this).parent();
            startX = e.originalEvent.pageX - target.offset().left;
            startY = e.originalEvent.pageY - target.offset().top;
            if (window.mozInnerScreenX == null) return false;
        });
        $(document).on("mousemove touchmove", function(e) {
            if ("mousemove" === e.type && active) target.offset({
                left:e.originalEvent.pageX - startX,
                top:e.originalEvent.pageY - startY
            });
            if ("touchmove" === e.type && active) target.offset({
                left:e.originalEvent.pageX - startX,
                top:e.originalEvent.pageY - startY
            });
        }).on("mouseup touchend", function() {
            active = false;
        });
        // 功能切换按钮点击事件
        $(document).on('click', '.rename-choose a', function() {
            $(this).addClass("g-button-blue").siblings().removeClass("g-button-blue");
            $('.rename-field').eq($('.rename-choose a').index(this)).show().addClass('rename-chosen').siblings().hide().removeClass('rename-chosen');
        });
        // 显隐替换项
        $(document).on('click', '.toggle-item', function() {
            let $this = $(this);
            if ($this.hasClass('show')) {
                $('.item-hide').hide();
                $this.removeClass('show').text('查看所有文件');
            } else {
                $('.item-hide').show();
                $this.addClass('show').text('查看替换文件');
            }
            this.blur()
        });
    } else if (i>30) {
        console.warn('按钮添加失败，请检查百度页面是否更新！');
        clearInterval(addBtn);
    }
    i++;
}, 1000);
