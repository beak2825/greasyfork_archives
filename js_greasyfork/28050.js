// ==UserScript==
// @name        115批量文件迅雷下载（暂不支持文件夹类型下载）
// @namespace   sscozak
// @include     *://115.com/?ct=file*
// @version     1.3.8.3
// @run-at      document-end
// @grant       none
// @description 迅雷党的福音来啦~\(≧▽≦)/~，免VIP，免115浏览器，对了还能在线播放（使用前务必阅读“使用步骤”）
// @compatible        firefox
// @compatible        chrome
// @downloadURL https://update.greasyfork.org/scripts/28050/115%E6%89%B9%E9%87%8F%E6%96%87%E4%BB%B6%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81%E6%96%87%E4%BB%B6%E5%A4%B9%E7%B1%BB%E5%9E%8B%E4%B8%8B%E8%BD%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/28050/115%E6%89%B9%E9%87%8F%E6%96%87%E4%BB%B6%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD%EF%BC%88%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81%E6%96%87%E4%BB%B6%E5%A4%B9%E7%B1%BB%E5%9E%8B%E4%B8%8B%E8%BD%BD%EF%BC%89.meta.js
// ==/UserScript==


// ======================================= Monkey插件兼容处置 =============================================
const RWD = window.parent;
const RWDs = "window.parent";
const RDM = RWD.document;
const RDMs = RWDs+".document";

// ======================================= XunLei下载 =============================================
RWD.Core.FileAPI.Thunder = {
    // 存放URL列表及相关维护操作
    thunder_urls : [],
    thunder_table : null,
    thunder_counter : null,
    thunder_total : 0,
    thunderClear : function() {
        var len = this.thunder_urls.length;
        this.thunder_urls.splice(0,len);
        this.thunder_table = null;
        this.thunder_counter = null;
        this.thunder_total = 0;
    },
    // 更新窗口URL列表
    thunderUpdateTable : function(r) {
        if (this.thunder_table) {
            var row = this.thunder_table.insertRow();
            row.style["white-space"]="nowrap"; // 内容水平展开，不自动换行
            var cell = row.insertCell(); cell.align = "left"; cell.innerHTML = r.file_name;
            var cell = row.insertCell(); cell.align = "left"; cell.innerHTML = r.file_url;
        }
        if (this.thunder_counter) {
            this.thunder_counter.innerHTML = '['+this.thunder_urls.length+'/'+this.thunder_total+']';
        }
    },
    thunderPushURL : function(url) {
        this.thunder_urls.push(url);
    },
    thunderHelperBeacon : "",
    thunderCheckHelper : function() {
        this.thunderHelperBeacon = "";
        var helper = RDM.querySelectorAll("thunderapihelper");
        if (0 === helper.length) {
            return false;
        }
        this.thunderHelperBeacon = helper[0].innerHTML;
        return true;
    },
    thunderBuildTaskWithCookie : function() {
        var len = this.thunder_urls.length;
        if (0 >= len) {
            alert("URL列表为空。。");
            return;
        }
        // 携带Cookie下载（请确保已安装addon：ThunderAPIHelper_WebExt）
        var urls = this.thunder_urls;
        var links = [];
        for (var i = 0; i < len; i++) {
            links.push(urls[i].file_url);
        }
        var link_container = RDM.getElementById("ID_link_container");
        link_container = link_container ? link_container
                        : RDM.createElement("ThunderLinksContainer");
        link_container.setAttribute("id", "ID_link_container");
        link_container.setAttribute("hrefs", JSON.stringify(links));
        RDM.documentElement.appendChild(link_container);

        var evt = RDM.createEvent("Events");
        evt.initEvent(this.thunderHelperBeacon, true, false);
        link_container.dispatchEvent(evt);
    },
    thunderBuildTaskWithoutCookie : function() {
        var len = this.thunder_urls.length;
        if (0 >= len) {
            alert("URL列表为空。。");
            return;
        }
        // 裸链接下载（无cookie）
        var urls = this.thunder_urls;
        var pid = 66666;                  // 迅雷合作ID（随意）
        BatchTasker.BeginBatch(4,pid);    //开始批量添加
        for (var i = 0; i < len; i++) {
            BatchTasker.AddTask(ThunderEncode(urls[i].file_url), urls[i].file_name);    //添加下载任务
        }
        BatchTasker.EndBatch(pid);
    },
    // 启动下载
    thunderLaunch : function() {
        // 判断迅雷NPAPI插件是否存在，若存在则调用原JS方法，否则调用ThunderAPIHelper扩展提供的JS接口
        if (navigator.mimeTypes['application/np_xunlei_plugin']
            || navigator.mimeTypes['application/np_xunlei_plugin.2']) {
            this.thunderBuildTaskWithoutCookie();
        } else if (this.thunderCheckHelper()) {
            this.thunderBuildTaskWithCookie();
        } else if (confirm("当前浏览器不支持迅雷NPAPI插件，"
                    +"请安装ThunderAPIHelper扩展，"
                    +"详情留意Greasyfork上的脚本说明")) {
            var greasyfork = "https://greasyfork.org/zh-CN/scripts/28050-115%E6%89%B9%E9%87%8F%E6%96%87%E4%BB%B6%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD-%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81%E6%96%87%E4%BB%B6%E5%A4%B9%E7%B1%BB%E5%9E%8B%E4%B8%8B%E8%BD%BD";
            //document.location = greasyfork;
            RWD.open(greasyfork,"_blank");
        }
    },
    // 批量复制链接
    thunderCopyToClipboard : function() {
        var len = this.thunder_urls.length;
        if (0 >= len) {
            alert("URL列表为空。。");
            return;
        }
        var urls = this.thunder_urls;
        var urls_content = '';
        for (var i = 0; i < urls.length; i++) {
            urls_content += urls[i].file_url+'\r\n';
        }
        var url_clipboard = RDM.getElementById('ID_url_clip');
        url_clipboard.innerHTML = urls_content;
        // 选取并复制URLs
        RWD.$(url_clipboard).focus();
        RWD.$(url_clipboard).select();
        if (RDM.execCommand('copy', false, "")) {
            alert("已复制 "+urls.length+" 条链接至剪切板");
        } else {
            alert("复制失败，请留言至GreasyFork反馈，谢谢");
        }
    },
    // 预加载子窗口框架页面
    thunderPreloadFramePage : function() {
        var stylePatcher = function(obj, attr_nm, attr_vl) {
            for (var i = 0; i < attr_nm.length; i++) {
                obj.style[attr_nm[i]] = attr_vl[i];
            }
        };
        // 子窗口
        var url_wdw = RDM.createElement('div'); url_wdw.id = "ID_url_wdw";
        url_wdw.className = 'dialog-box dialog-mini easy-download window-current';
        stylePatcher(url_wdw,
            ['z-index', 'width', 'position', 'top', 'left', 'display'],
            ['1000000002', '50%', 'fixed', '15%', '25%', 'none']);
        RDM.body.appendChild(url_wdw);
        // 构建列表页面
        var html = [];
        html.push('<div class="dialog-box dialog-mini easy-download window-current" style="z-index: 1000000002; '
                        +'width: 50%; height:60%; position: fixed; top: 15%; left: 25%;">');
        html.push('<div class="dialog-header" rel="title_box" ws_property="1">'
                        +'<div style="float:left"><h3 rel="base_title">115迅雷小工具</h3></div>'
                        +'<div id="ID_thunder_counter"></div>'
                        +'</div>');
        html.push('<div class="dialog-handle"><a href="javascript:;" class="close" id="ID_thunder_close">关闭</a></div>');
        html.push('<div id="ID_thunder_context" rel="base_content" style="height:85%"></div></div>');
        // 神隐的复制板
        html.push('<textarea id="ID_url_clip" style="width:1px;height:1px;border-style:none;"></textarea>');
        // 插入HTML文本
        url_wdw.innerHTML = (function(){
            var res = '';
            for (var i = 0; i < html.length; i++) {
                res += html[i];
            }
            return res;
        })();
        // 背景蒙版
        var bk_mask = RDM.createElement('div'); bk_mask.id = "ID_bk_mask";
        stylePatcher(bk_mask,
            ['z-index', 'background', 'height', 'left', 'position', 'top', 'width', 'opacity', 'display'],
            ['1000000001', 'rgb(0, 0, 0)', '100%', '0px', 'fixed', '0px', '100%', '0.4', 'none']);
        RDM.body.appendChild(bk_mask);
        var bk_mask_inner = RDM.createElement('div');
        stylePatcher(bk_mask_inner,
            ['height', 'width'],
            ['100%', '100%']);
        bk_mask.appendChild(bk_mask_inner);
        // 设置关闭窗口按钮事件
        var btn_close = RDM.getElementById('ID_thunder_close');
        btn_close.onclick = Function('(function(){'+RDMs+'.getElementById("ID_bk_mask").style["display"]="none";'
                                                +''+RDMs+'.getElementById("ID_url_wdw").style["display"]="none";'
                                                +''+RDMs+'.getElementById("ID_thunder_context").innerHTML="";'
                                                +'})()');
        return url_wdw;
    },
    // 装填子窗口内容
    thunderShowPageWithContext : function(context, callback) {
        var url_wdw = RDM.getElementById('ID_url_wdw');
        url_wdw = url_wdw?url_wdw:this.thunderPreloadFramePage();
        var bk_mask = RDM.getElementById('ID_bk_mask');

        url_wdw.style["display"] = "";
        bk_mask.style["display"] = "";

        var ctx = RDM.getElementById('ID_thunder_context');
        ctx.innerHTML = context, callback&&callback();
    },
    // 显示资源链接列表
    thunderShowLinks : function() {
        // 文件链接显示列表
        var html = [];
        html.push('<div id="ID_thunder_links" style="height:100%"><div class="dialog-frame" style="height:100%; overflow:scroll;">');
        html.push('<table id="ID_thunder_table" style="height:auto" border="1" cellspacing="20"></table></div>');
        // 按钮
        html.push('<div style="height:20%">'
                    // 开始下载
                    +'<a href="javascript:;" class="button btn-green" style="width:50%; padding:unset" onclick="Core.FileAPI.Thunder.thunderLaunch()">'
                        +'<i class="icon ico-normal"></i><em>开始下载</em></a>'
                    // 复制链接
                    +'<a href="javascript:;" class="button btn-blue" style="width:50%; padding:unset" onclick="Core.FileAPI.Thunder.thunderCopyToClipboard()">'
                        +'<i class="icon ico-normal"></i><em>复制链接</em></a>'
                +'</div></div>');
        var context;
        context = (function(){
            var res = '';
            for (var i = 0; i < html.length; i++) {
                res += html[i];
            }
            return res;
        })();
        this.thunderShowPageWithContext(context, ()=>{
            // 获取列表Table
            RWD.Core.FileAPI.Thunder.thunder_table = RDM.getElementById('ID_thunder_table');
            RWD.Core.FileAPI.Thunder.thunder_counter = RDM.getElementById('ID_thunder_counter');
        });
    },
    // 在线播放视频（网页播放器，目前兼容性不好，暂搁置）
    thunderPlayVideoOnWeb : function(url) {
        var html = [];
        //html.push('<video id="ID_thunder_player" style="height:100%;width:100%" controls="controls" preload="auto" src=""></video>');
        html.push('<embed id="ID_thunder_player" src="" type="audio/x-pn-realaudio-plugin" height="100%" width="100%"/>');
        var context;
        context = (function(){
            var res = '';
            for (var i = 0; i < html.length; i++) {
                res += html[i];
            }
            return res;
        })();
        this.thunderShowPageWithContext(context, ()=>{
            RDM.getElementById('ID_thunder_player').src = url;
        });
    },
};


// ======================================= 在线点播 =============================================
RWD.Core.FileAPI.Player = {
    VideoList : [],
    VideoTypes : ['mp4','avi','rmvb','rm','3gp','wmv','mov','mp3','flv','mpeg','mkv','f4v','mpg','dat'],
    GetFileType : function(file_name) {
        return file_name.split('.').pop();
    },
    CheckVideoType : function(type_name) {
        var video_types = this.VideoTypes;
        for (var idx = 0; idx < video_types.length; ++idx) {
            if (type_name === video_types[idx]) {
                return true;
            }
        }
        return false;
    },
    AddVideoButtonForItem : function() {
        const DM = RWD.frames["wangpan"].document;
        var items = DM.querySelectorAll("li[rel='item'][file_type='1']");
        for (var idx = 0; idx < items.length; ++idx) {
            if (this.CheckVideoType(this.GetFileType(items[idx].attributes.title.value))) {
                var opdv = items[idx].querySelector("div.file-opr")||items[idx].querySelector("span.file-name");
                var aplay = '<a href="javascript:;" menu="play_one" onclick="window.parent.Core.FileAPI.Player.PlayOne(this)">'
                            +'<i class=""></i>'
                                +'<span>播放</span>'
                            +'</a>';
                opdv.innerHTML += aplay;
            }
        }
    },
    AddVideoButtonForBar : function() {
        const DM = RWD.frames["wangpan"].document;
        // 获取当前被选中的文件
        var items = DM.querySelectorAll('li[rel=\'list\'], li[rel=\'item\'][file_type=\'1\'].' + "selected");
        // 筛选其中可以播放的文件
        this.VideoList.splice(0, this.VideoList.length); // 清空上次的信息
        for (var idx = 0; idx < items.length; ++idx) {
            if (this.CheckVideoType(this.GetFileType(items[idx].attributes.title.value))) {
                this.VideoList.push(items[idx]);
            }
        }
        if (0 === this.VideoList.length) {
            return;
        }

        var bar = DM.querySelector("ul");
        var aplay = '<li menu="play_all" onclick="window.parent.Core.FileAPI.Player.PlayAll()">'
                    +'<span>播放全部</span>'
                    +'</li>';
        bar.innerHTML += aplay;
    },
    // 播放单个文件
    PlayOne : function(item_btn_elem) {
        var item_info_elem = item_btn_elem.parentElement.parentElement;
        var pick_code = item_info_elem.attributes.pick_code.value;
        RWD.Core.FileAPI.RequestFileURL(pick_code, ((r)=>{
            RWD.Core.FileAPI.Player.PlayVideo([{title:r.file_name,url:r.file_url}]);
        }));
    },
    // 批量播放
    PlayAll : function() {
        if (0 === this.VideoList.length) {
            return;
        }

        const video_count = this.VideoList.length;
        var remain = video_count;
        var play_list = new Array(video_count);
        var unplayed = true;
        var timer_key = 0;
        var delay_time = 5000;
        // 设置超时行为
        var time_to_play = function() {
            if (!unplayed) {
                return;
            }
            unplayed = false;
            var ready_list = [];
            for (var idx = 0; idx < video_count; ++idx) {
                if (play_list[idx]) {
                    ready_list.push(play_list[idx]);
                }
            }
            RWD.Core.FileAPI.Player.PlayVideo(ready_list);
        };
        // 异步请求播放文件URL
        for (var idx = 0; idx < video_count; ++idx) {
            const idc = idx; // 保存当前文件任务的ID，必须使用Const类型
            RWD.Core.FileAPI.RequestFileURL(this.VideoList[idx].attributes.pick_code.value,(
                (r)=>{
                    play_list[idc] = {title:r.file_name,url:r.file_url};
                    // 检查是否已获取全部url
                    RWD.clearTimeout(timer_key); // 取消当前延时
                    if (!unplayed) {
                        return;
                    } else if (--remain === 0) {
                        unplayed = false;
                        RWD.Core.FileAPI.Player.PlayVideo(play_list);
                    } else {
                        // 重设延时器
                        timer_key = RWD.setTimeout(time_to_play,delay_time);
                    }
                }));
        }
        // 设置超时
        timer_key = RWD.setTimeout(time_to_play,delay_time);
    },
    // 生成ASX文件调用本地PotPlayer
    PlayVideo : function(video_infos) {
        if (0 === video_infos.length) {
            return;
        }
        console.log("Ready to play: "+video_infos.length);
        console.log(video_infos);
        var hrefs = '<ASX Version="3.0">';
            for (var i = 0; i < video_infos.length; ++i) {
                hrefs += '<Entry>';
                if (video_infos[i].title) {
                    hrefs += '<Title>' + video_infos[i].title + '</Title>';
                }
                hrefs += '<Ref href ="' + video_infos[i].url + '" />';
                hrefs += '</Entry>';
            }
            hrefs += '</ASX>';
        var asx_content = [hrefs];
        var asx_blob = new Blob(asx_content,{'type':'video/x-ms-asf-plugin'}); // 由关联ASX文件的程序调用
        var url = URL.createObjectURL(asx_blob); // 提供blob对象的url地址
        location.href = url; // 等效于将url直接输入于地址栏，播放视频
    },
};

// ====================================== 工具函数 ==============================================
// 异步请求文件URL
RWD.Core.FileAPI.RequestFileURL = function(pick_code, callback) {
    var _ = function () {
        RWD.UA$.ajax({
            url: 'files/download?pickcode=' + pick_code,
            type: 'GET',
            dataType: 'json',
            cache: false,
            success: function (r) {
                callback&&callback(r);
            }
        })
    };
    _();
    return;
}

// ===================================== 注入 ===============================================

// 替换原函数，直接根据pickcode请求资源URL
RWD.Core.FileAPI.Download = function (pick_code, win) {
    this.RequestFileURL(pick_code, ((r)=>{
        //alert("URL: "+r.file_url);
        RWD.Core.FileAPI.Thunder.thunderPushURL(r);
        RWD.Core.FileAPI.Thunder.thunderUpdateTable(r);
    }));
};

// 替换原函数，对所有选中的文件（不含文件夹）进行URL获取
RWD.Core.FileAPI.DownloadSomeFile = function (list) {
    if (!list.length) {
        RWD.Core.MinMessage.Show({
            text: '请选择文件',
            type: 'war',
            timeout: 2000
        });
        return;
    }
    var TypeFilter = function(list) {
        var file_list = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].attr('file_type') == '1') {
                file_list.push(list[i]);
            }
        }
        return file_list;
    }
    list = TypeFilter(list);
    if (0 === list.length) {
        alert("当前无法下载文件夹类型...");
        return;
    }
    RWD.Core.FileAPI.Thunder.thunderClear();
    RWD.Core.FileAPI.Thunder.thunderShowLinks();
    RWD.Core.FileAPI.Thunder.thunder_total = list.length;
    for (var i = 0; i < list.length; i++) {
        RWD.Core.FileAPI.Download(list[i].attr('pick_code'));
    }
};

// ======================================= 初始化 =============================================
// 加载迅雷JS库
(function(){
    var getScriptSync = function(url) {
        RWD.$.ajax({
            url: url,
            async: false,
            dataType: "script"
        });
    };
    getScriptSync('http://pstatic.xunlei.com/js/webThunderDetect.js');
    getScriptSync('http://pstatic.xunlei.com/js/base64.js');
    getScriptSync('http://pstatic.xunlei.com/js/thunderBatch.js');
})();

// 监听iframe载入
(function(){
    var sub_wind = RDM.querySelector("iframe[rel='wangpan']");
    sub_wind.onload = (function(){
        // 设置观察器
        var DM = RWD.frames["wangpan"].document;
        DM.item_bar_observer = new MutationObserver((function(e){RWD.Core.FileAPI.Player.AddVideoButtonForBar();}));
        DM.item_bar_observer.observe(DM.querySelector('#js_operate_box'),{'childList':true});
        DM.item_list_observer = new MutationObserver((function(e){RWD.Core.FileAPI.Player.AddVideoButtonForItem();}));
        DM.item_list_observer.observe(DM.querySelector('#js_data_list'),{'childList':true});
    });
})();