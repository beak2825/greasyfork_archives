// ==UserScript==
// @name         mc.netease Extender
// @namespace    https://space.bilibili.com/265651964
// @version      release-1.0.0
// @description  mc.netease 行为拓展/样式修复
// @author       坑触可
// @match        https://mc.netease.com/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/401712/mcnetease%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/401712/mcnetease%20Extender.meta.js
// ==/UserScript==

(() => {
    // jQuery检查
    if (typeof jQuery == "undefined") {
        console.error("This page does NOT contain JQuery,mc.netease Extender will not work.");
        return false;
    }
    //在手机页面主动禁用
    if(document.getElementsByTagName('meta')['viewport']){
        console.log("mc.netease Extender not fully compatible with Moblie page,exit manually");
        return false;
    }

    // 基本信息初始化
    let version = "v1.0.0";
    let vercode = 111340;
    let updatelist = [
        '1.新增此工具',
        '2.占位的'
    ];
    let configableList = [
        {
        "id": "fixCodeBlock",
        "default": true,
        "type": "check",
        "name": "美化代码块样式",
        "desc": "修正代码块的一些样式,如滚动条."
    }, {
        "id": "fixCodeCopy",
        "default": true,
        "type": "check",
        "name": "\"复制代码\"修复",
        "desc": "修复复制代码时换行全部消失的问题."
    }, {
        "id": "fixTableLayout",
        "default": true,
        "type": "check",
        "name": "修复表格样式",
        "desc": "使用快捷键Ctrl+Shift+F快速修复当前页面表格样式."
    }, {
        "id": "queryMessage",
        "default": true,
        "type": "check",
        "name": "后台轮询消息",
        "desc": "在后台自动查询是否有新的消息并推送,需保证至少打开一个页面.注意,过低的值可能会导致你被论坛屏蔽,超过200的值可能会导致消息反复推送."
    }, {
        "id": "queryMessageInterval",
        "default": 60,
        "type": "num",
        "name": "后台轮询消息间隔",
        "desc": "两次轮询消息之间的间隔,单位秒."
    }, {
        "id": "rememberPage",
        "default": true,
        "type": "check",
        "name": "板块内翻页记忆",
        "desc": "点击板块内下一页按钮时记忆当前页."
    }, {
        "id": "fixTopBarPopMenu",
        "default": true,
        "type": "check",
        "name": "弹出菜单美化",
        "desc": "美化弹出菜单的样式,如个人信息菜单."
    }, {
        "id": "hoverPreviewTheme",
        "default": true,
        "name": "主题悬浮预览",
        "type": "check",
        "desc": "将鼠标指针放在切换主题按钮上即可预览主题."
    }, {
        "id": "hoverableMedal",
        "default": true,
        "name": "玻璃质感勋章",
        "type": "check",
        "desc": "亮闪闪的勋章~"
    }, {
        "id": "viewWarns",
        "default": true,
        "name": "查看警告记录",
        "type": "check",
        "desc": "为每一层楼和每一个个人主页(除自己)添加查看警告记录按钮"
    },{
        "id": "useIgInQuickReply",
        "default": true,
        "name": "快速回复使用个人签名",
        "type": "check",
        "desc": "在页脚快速回复帖子时使用个人签名."
    }, {
        "id": "fixImgZoom",
        "default": true,
        "name": "优化图片缩放",
        "type": "check",
        "desc": "使用更现代的方法实现图片缩放."
    }, {
        "id": "quickAtList",
        "default": "",
        "name": "快速 @ 列表",
        "type": "text",
        "desc": "按下Ctrl+Shift+A/或者按钮以快速在当前输入框内插入预定义的@用户名代码.用户名之间用\",\"(半角逗号)分隔."
    }, {
        "id": "miscFix",
        "default": "",
        "name": "杂项修复",
        "type": "text",
        "desc": "此值用于规定杂项修复的行为,默认值为空,修改为00000以关闭全部.错误的值会使该项失效.详情请查阅源码."
    }, {
        "id": "myReportReason",
        "default": "",
        "name": "自定义举报理由",
        "type": "textarea",
        "desc": "在举报时提供自定义的举报理由,一行一个理由."
    }];
    //夹带私货
    console.log(" %c 坑触可的B站主页： %c https://space.bilibili.com/265651964 ", "color: #ffffff; background: #E91E63; padding:5px;", "background: #000; padding:5px; color:#ffffff");
    //初始化jQuery和基本封装方法
    let $ = jQuery;
    let dlg = (m) => {
        console.debug("[mc.netease Extender]" + m);
    };
    let getRequest =  (variable,url = "") => {
        let query = url ? /\?(.*)/.exec(url)[1] : window.location.search.substring(1);
        let vars = query.split("&");
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }
    //内建静态资源
    let staticRes = {
        "atBtnImage" : "data:image/png;base64,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",
        "medalReflectImage" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAA3CAYAAACGnvPUAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA1UlEQVRYw+3Qy6rBARRGcQcjl1zCG5AkkY48gUiEMHU/7/8GS/vUHoqif1/ZgzX/tVLAn0qpwAQmMIH5NsxECWM1gYMKxsoBUxWM1wKOKhgrD8xUMF47yUvPMFYBmKtgvA5wUsFYRWChgrF+gC5wVsB4JWCpgvFLvU9dehfjlYGVCsYv9YGLAsarAGsVjJUGBsBVAeNVgY0Kxi8NX7mUBMarAVsVjF/6fXQpaYxXB3YqGCsDjICbAsZrAHsVjJUFxiqY/wITmMAEJjCBCUxgAhOYb8PcAbo5rkGPsZmjAAAAAElFTkSuQmCC"
    };
    //配置数据迁移函数
    let transferConfig = ()=>{
        let tempconf = null;
        try{
            tempconf = JSON.parse(getcookie("MExt_config"));
            if(typeof tempconf.version == "undefined"){return false;}else{
                localStorage.setItem("MExt_config", JSON.stringify(tempconf));
                setcookie("MExt_config","",0);
            }
        }catch(e){
            return false;
        }
    }
    //配置初始化函数
    let initConfig = () => {
        $(configableList).each((i, v) => {
            conf[v.id] = typeof conf[v.id] == "undefined" ? v.default : conf[v.id];
        });
        localStorage.setItem("MExt_config", JSON.stringify(conf));
    }
    let conf = '';
    try {
        transferConfig();
        conf = JSON.parse(localStorage.getItem("MExt_config"));
    } catch (e) {
        dlg("Failed to load config\n" + e);
    }
    if (!conf) {
        conf = {};
        conf.version = vercode;
        initConfig();
        showDialog("<b>欢迎使用mc.netease Extender</b>.<br>本脚本的设置按钮已经放进入了您的个人信息菜单里,如需调整设置请在个人信息菜单里查看.", "right", "欢迎", () => {
            showMenu('user_info');
            $("#MExt_config").css("background-color", "#E91E63").css("color", "#fff");
            setTimeout(() => {
                hideMenu('user_info_menu');
                $("#MExt_config").css("background-color", "").css("color", "");
            }, 3000);
        });
        dlg("Config init.");
    }
    if (typeof conf.version == "undefined" || conf.version < vercode) {
        let updateContent = '';
        $(updatelist).each((i, v) => {
            updateContent += "<br>" + v;
        });
        showDialog("<b>mc.netease Extender 已经更新至 " + version + "</b>" + updateContent, "right");
        conf.version = vercode;
        initConfig();
    }
    $(() => {
        // 设置界面初始化
        $("#user-info").append("<li><a href='javascript: void(0);' id=\"MExt_config\">mc.netease Extender 设置</a></li>");
        dlg("Appended Config button");
        $("head").append('<style id="ConfWindowStyle">.conf_contain {max-height:45vh;overflow-y:auto;padding-right:5px;overflow-x:hidden; scrollbar-color: rgba(0,0,0,0.17) #f7f7f7;scrollbar-width: thin;} .alert_info ::-webkit-scrollbar {background: #f7f7f7;height: 7px;width:7px}.alert_info ::-webkit-scrollbar-thumb:hover{background:rgba(0, 0, 0, 0.35);}.alert_info ::-webkit-scrollbar-thumb{background:rgba(0, 0, 0, 0.17);}.conf_item{line-height: 1.2;margin-bottom:5px;} .conf_title{font-weight: 1000;} .conf_subtitle{font-size: 10px;color: rgba(0, 0, 0, 0.5);padding-right:40px;display:block;} .conf_check{float: right;margin-top: -25px;} .conf_input{float: right;width:30px;margin-top:-27px;}.conf_longinput{ width: 100%;margin-top: 5px;}.conf_textarea{width: calc(100% - 4px); margin-top: 5px; resize: vertical; min-height: 50px;}</style>');
        dlg("Appended Config window style");
        $("#MExt_config").on("click", () => {
            let confwinContent = '<style>body{overflow:hidden}.altw{width:700px;max-width:95vh;}.alert_info {background-image: unset;padding-left: 20px;padding-right: 17px;}</style><div class="conf_contain">';
            $(configableList).each((i, v) => {
                let inputType = '';
                switch (v.type) {
                    case "check":
                        inputType = '<input class="conf_check" type="checkbox" id="in_' + v.id + '"></input>';
                        break;
                    case "num":
                        inputType = '<input type="number" class="conf_input" id="in_' + v.id + '"></input>';
                        break;
                    case "text":
                        inputType = '<input type="text" class="conf_longinput" id="in_' + v.id + '"></input>';
                        break;
                    case "textarea":
                        inputType = '<textarea class="conf_textarea" id="in_' + v.id + '"></textarea>';
                        break;
                    default:
                        inputType = '<input class="conf_check" type="checkbox" id="in_' + v.id + '"></input>';
                        break;
                }
                confwinContent += '<p class="conf_item"><span class="conf_title">' + v.name + '</span><br><span class="conf_subtitle">' + v.desc + '</span>' + inputType + '</p>';
            });
            confwinContent += '</div>';
            showDialog(
                confwinContent,
                "confirm",
                "mc.netease Extender 设置",
                () => {
                    $(configableList).each((i, v) => {
                        let val = '';
                        if (v.type == "num" || v.type == "text" || v.type == "textarea") {
                            val = $("#in_" + v.id).val();
                        } else {
                            val = $("#in_" + v.id).prop("checked");
                        }
                        conf[v.id] = val;
                    });
                    initConfig();
                    setTimeout(() => {
                        showDialog("设置已保存,刷新生效", "right");
                    });
                },
                true,
                () => {},
                "mc.netease Extender " + version + " - by 坑触可"
            );
            $(configableList).each((i, v) => {
                if (v.type == "num" || v.type == "text" || v.type == "textarea") {
                    $("#in_" + v.id).val(conf[v.id]);
                } else {
                    $("#in_" + v.id).prop("checked", conf[v.id]);
                }
            });
            dlg("Config cookie loaded.");
        });
        dlg("Config button event attached.");
        // 钩住DiscuzAjax函数,使其触发全局事件
        let __ajaxpost = ajaxpost;
        ajaxpost = (formid, showid, waitid, showidclass, submitbtn, recall) => {
            let relfunc = () => {
                if (typeof recall == 'function') {
                    recall();
                } else {
                    eval(recall);
                }
                $(this).trigger('DiscuzAjaxPostFinished');
            }
            __ajaxpost(formid, showid, waitid, showidclass, submitbtn, relfunc);
        }
        let __ajaxget = ajaxget;
        ajaxget = (url, showid, waitid, loading, display, recall) => {
            let relfunc = () => {
                if (typeof recall == 'function') {
                    recall();
                } else {
                    eval(recall);
                }
                $(this).trigger('DiscuzAjaxGetFinished');
            }
            __ajaxget(url, showid, waitid, loading, display, relfunc);
        }
        dlg("Hooked into Discuz Ajax event");
    });
    if (conf.fixCodeBlock) {
        // 代码块美化样式
        $("head").append("<style id=\"fixCodeBlock\">.hljs > ::-webkit-scrollbar {background: #f7f7f7;height: 7px;width:7px}.hljs > ::-webkit-scrollbar-thumb:hover{background:rgba(0, 0, 0, 0.35);}.hljs > ::-webkit-scrollbar-thumb{background:rgba(0, 0, 0, 0.17);}.pl .blockcode{max-height:483px;overflow:auto;padding: 10px 0 5px 10px;background-attachment: local}.blockcode ol{overflow-x: unset!important;}.hljs{display:unset;scrollbar-color: rgba(0,0,0,0.17) #f7f7f7;scrollbar-width: thin;}.pl .blockcode ol{margin: 0 0 0px -10px!important;padding: 0 0 0px 20px !important;}.pl .blockcode ol li:hover {background-color:rgba(0, 0, 0, 0.05) ;color: #666;}.pl .blockcode ol li {margin-left: 23px;min-width: fit-content;padding-right: 10px;transition-duration:.2s;}.pl .blockcode em {display: block;margin-top: 5px;}</style>");
        dlg("Code block fix style appended.");
    }
    if (conf.fixTableLayout) {
        MExt_Func_fixTable = () => {
            // 添加修复样式
            $("head").append("<style id=\"fixTableLayout\">.t_table .hljs ol {width:0}.t_table .hljs li {background:rgba(0, 0, 0, 0)!important}.t_table img{max-width:100%;object-fit:contain}</style>");
            dlg("Table style fixed.");
        }
        // 监听快捷键事件
        $(document).on("keydown", (e) => {
            if (e.shiftKey && e.ctrlKey &&e.keyCode == 70 && $("#fixTableLayout").length == 0) {
                dlg("Table layout fix actived");
                showDialog("是否尝试修复此页表格?", "confirm", "MCBBS Extender", () => {
                    MExt_Func_fixTable();
                })
            }
        });
        dlg("Table layout fix event attached.");
    }
    if (conf.fixCodeCopy) {
        // 重写copycode函数,手动添加换行
        copycode = (obj) => {
            if (!obj) {
                dlg("Code copy with invalid object.");
                return false;
            }
            let code = '';
            $(obj).find("li").each((i, v) => {
                code += v.innerText + "\r\n";
            });
            // 复制代码
            setCopy(code, '代码已复制到剪贴板');
            dlg("Code copied.");
        };
        dlg("Code copy fix actived.");
    }
    // 消息轮询
    if (conf.queryMessage) {
        // 检查消息函数
        let checkNotifica = (noNotifica = false) => {
            $.get("/forum.php?mod=misc",(d)=>{
                dlg("Checking message...");
                // 设置最后通知时间为当前时间,以防止反复推送
                localStorage.setItem('notifica-time', new Date().getTime());
                let dom = $(d);
                // 获得顶栏图标类
                let noticlass = dom.find("#myprompt").attr("class");
                // 获得通知菜单元素
                let notimenu = dom.filter("#myprompt_menu");
                // 将顶栏图标类写入当前页
                $("#myprompt").attr("class",noticlass);
                // 将通知菜单写入当前页
                $("#myprompt_menu").html(notimenu.html());
                // 获得消息内容,用作缓存
                let noticontent = notimenu.text();
                // 判断是否应该发送消息
                if(!noNotifica && localStorage.getItem("MExt_ActiveQueryId") == queryId && localStorage.getItem("MExt_LastNoticeContent") != noticontent){
                    // 获得通知脚本(暴力)
                    let scp = dom.filter("script[src*=html5notification]").nextUntil("div").last().text();
                    // 将最后通知时间设置为1,强行启用通知
                    localStorage.setItem('notifica-time', 1);
                    // 执行通知脚本
                    eval(scp);
                    dlg("Notifica sent");
                    // 写入消息缓存
                    localStorage.setItem("MExt_LastNoticeContent",noticontent);
                }
            });
        }
        // 刷新消息缓存
        let flushContent = ()=>{
            $.get("/forum.php?mod=misc",(d)=>{
                let dom = $(d);
                let noticontent = dom.filter("#myprompt_menu").text();
                // 写入消息缓存
                localStorage.setItem("MExt_LastNoticeContent",noticontent);
            });
        }
        // 生成queryID,用于页面间的互斥
        let queryId = hash(new Date().getTime().toLocaleString(), 16);
        // 判断是否在消息页面||最后通知时间是否超过200秒
        if ((location.pathname == "/home.php" && (getRequest('do') == "pm" || getRequest('do') == "notice")) || new Date().getTime() - localStorage.getItem("notifica-time") > 200000) {
            flushContent();
        } else {
            checkNotifica();
        }
        dlg("Query id is " + queryId + ".")
        // 运行定时器,用于检查其他页面是否在运行
        setInterval(() => {
            if (localStorage.getItem("MExt_LastQuery") == "") {
                localStorage.setItem("MExt_LastQuery", 0);
            }
            let nowtime = Math.floor(new Date().getTime() / 1000);
            if ((localStorage.getItem("MExt_ActiveQueryId") == "" || nowtime - localStorage.getItem("MExt_LastQuery") > 5) && localStorage.getItem("MExt_ActiveQueryId") != queryId) {
                localStorage.setItem("MExt_ActiveQueryId", queryId);
                checkNotifica();
                dlg("Kick off inactive querier,start query.");
            }
            if (localStorage.getItem("MExt_ActiveQueryId") == queryId) {
                localStorage.setItem("MExt_LastQuery", nowtime);
            }
        }, 1000);
        dlg("Running checker actived.");
        // 判断是否有HTML5Notification
        if (!window.Html5notification) {
            $.getScript("data/cache/html5notification.js?xm6");
            dlg("Html5notification added.");
        }
        // 定时运行检查函数
        let msgChecker = setInterval(checkNotifica,conf.queryMessageInterval * 1000);
        dlg("Message querier actived.");
    }
    if (conf.rememberPage) {
        // 记住当前页
        $(() => {
            let npbtn = $("#autopbn");
            if(npbtn.length){
                let orgfunc = npbtn[0].onclick;
                npbtn[0].onclick = null;
                npbtn.on("click",()=>{
                    if(npbtn.html() == "正在加载, 请稍后..."){return false;}
                    let nextpageurl = npbtn.attr('rel');
                    let curpage = parseInt(npbtn.attr('curpage'));
                    npbtn.attr('curpage', curpage + 1);
                    nextpageurl = nextpageurl.replace(/&page=\d+/, '&page=' + (curpage + 1));
                    $("#threadlisttableid").append("<a class=\"mext_rempage\" rel=\""+nextpageurl+"\"></a>")
                    history.replaceState(null, null, nextpageurl);
                    orgfunc();
                });
                $("#threadlisttableid").before("<a class=\"mext_rempage\" rel=\""+window.location+"\"></a>")
                $(window).on("scroll",()=>{
                    let scroll = $(document).scrollTop() + window.innerHeight/4;
                    let url = null;
                    $(".mext_rempage").each((i,v)=>{
                        let vtop = v.offsetTop;
                        if(vtop < scroll){
                            url = v.rel;
                        } else {
                            return false;
                        }
                    });
                    if(url){
                        history.replaceState(null, null, url);
                    }
                    let dheight = document.documentElement.offsetHeight;
                    if($(document).scrollTop() +100 > dheight){alert(1);}
                });
            }
            dlg("Page remember actived.");
        });
    }
    if (conf.animateGoToTopButton) {
        // 添加侧边按钮样式
        $("head").append("<style id=\"GoToTopButton\">#scrolltop{bottom: 270px!important;visibility:visible;overflow-x:hidden;width:75px;}.scrolltopa{transition-duration:.15s;margin-left:-40px;opacity:0;}.scrolltopashow{margin-left:0px;opacity:1;}</style>");
        dlg("Animate go to top buttom style appended.");
        // 重写showTopLink函数,使其使用侧边栏样式
        showTopLink = () => {
            let ft = $('#ft')[0];
            if (ft) {
                let scrolltop = $('#scrolltop')[0];
                if (!scrolltop) {
                    return false;
                }
                let scrolltopbtn = $(".scrolltopa");
                let scrollHeight = parseInt(document.body.getBoundingClientRect().top);
                let basew = parseInt(ft.clientWidth);
                let sw = scrolltop.clientWidth;
                if (basew < 1000) {
                    let left = parseInt(fetchOffset(ft)['left']);
                    left = left < sw ? left * 2 - sw : left;
                    scrolltop.style.left = (basew + left + 44) + 'px';
                } else {
                    scrolltop.style.left = 'auto';
                    scrolltop.style.right = 0;
                }
                if (scrollHeight < -100) {
                    scrolltopbtn.addClass("scrolltopashow");
                } else {
                    scrolltopbtn.removeClass("scrolltopashow");
                }
            }
        }
        showTopLink();
        dlg("Animate go to top buttom actived.");
    }
    if (conf.pinnedTopBar) {
        // 添加固定顶栏样式
        $("head").append("<style id=\"pinnedTopBar\">#toptb{position: fixed;width: 100%;z-index:790;top:0;box-shadow: rgba(0, 0, 0, 0.3) 3px 3px 5px 1px;min-width:510px;}.new_wp{max-width:1130px;width:100%;}.mc_map_wp{padding-top: 45px;}#scbar_type_menu{top:38px!important}#user_info_menu,#myprompt_menu,#usertools_menu,#sslct_menu {position:fixed!important;top:47px!important}#e_controls{z-index: 790!important}@media screen and (max-width: 860px) {#toptb .z.light {display: none;}#toptb > .new_wp > .y {float:none;margin-left:12px;}}</style>");
        $(() => {
            // 重写editorcontrolpos函数,与固定顶栏兼容
            editorcontrolpos = () => {
                if (editorisfull) {
                    return;
                }
                let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                if (scrollTop + 47 > editorcontroltop && editorcurrentheight > editorminheight) {
                    $("#" + editorid + '_controls').prop("style", "z-index:0!important").css("position", 'fixed').css("top", '47px').css("width", editorcontrolwidth + 'px');
                    $("#" + editorid + '_controls_mask').css("display", '');
                } else {
                    $("#" + editorid + '_controls').css("position", '').css('top', '').css('width', '');
                    $("#" + editorid + '_controls_mask').css('display', 'none');
                }
            };
            //增加一个5px的遮罩,防止鼠标经过空隙时碰到底层内容
            $("#toptb").after('<div style="position: fixed;top: 47px;height: 5px;width: 100%;z-index:700;"></div>');
        });
        dlg("Pinned top bar style appended.");

    }
    if (conf.fixTopBarPopMenu) {
        // 添加弹出菜单美化样式
        $("head").append("<style id=\"fixTopBarPopMenu\">div#user_info_menu {margin-top: 5px;}.user_info_menu_info > li {margin-top: 2px;}a.rank {padding: 2px 7px!important; border-radius: 14px;}a.rank:hover {text-decoration: none;}ul.user_info_menu_btn {padding-top: 6px;}ul.user_info_menu_btn>li>a:hover {background: #36b030;color: white;}ul.user_info_menu_btn>li>a {padding: 5px 8px;border-radius: 5px;}ul.user_info_menu_btn>li>a[onclick]:hover {background: red!important;}#myprompt_menu {margin-left: -10px;}#myprompt_menu,#usertools_menu,#sslct_menu { z-index:791!important;margin-top: 5px!important;transform: translateX(-50%);margin-left:20px;}.p_pop:not(.h_pop){important;border: 1px solid #d1d1d1;min-width: unset;border-radius: 5px;}#myprompt_menu>li>a, #usertools_menu>li>a {border: none; border-radius: 5px;text-align: center;padding: 3px 15px;}#myprompt_menu>li>a:hover, #usertools_menu>li>a:hover {background: #36b030;color: white;}div#sslct_menu {margin-left: 54px;padding-left: 14px;}.sslct_btn {border: none!important;width: 15px;height: 15px;padding: 2px;}.sslct_btn i {border-radius: 50%;width: 13px;height: 13px;}</style>");
        dlg("Pop menu fix style appended.");
        // 重写extstyle函数,使更换主题时同步更新样式
        let __extstyle = extstyle;
        let checkStyle = () => {
            let theme = getcookie('extstyle');
            if (theme == "./template/mcbbs/style/winter" || theme == "") {
                if (!$("#fixTopBarPopMenuWinter").length) {
                    $("head").append("<style id=\"fixTopBarPopMenuWinter\">.user_info_menu_info li a.rank {background-color: #5c8dff!important;}ul.user_info_menu_btn>li>a:hover,#myprompt_menu>li>a:hover, #usertools_menu>li>a:hover {background: #5c8dff!important;}</style>");
                }
            } else {
                $("#fixTopBarPopMenuWinter").remove();
            }
        }
        extstyle = (style) => {
            __extstyle(style);
            checkStyle();
        }
        checkStyle();
        dlg("Overwrite extstyle function");
    }
    if (conf.hoverPreviewTheme) {
        //悬浮预览主题
        $(() => {
            $(".sslct_btn").on("mouseenter", ()=>{
                let that = this;
                let timer = setTimeout(()=>{
                    clearTimeout(timer);
                    let previewstyle = getcookie('extstyle');
                    $(that).trigger('click');
                    setcookie('extstyle', previewstyle);
                }, 300);
            });
            $(".sslct_btn").on("mouseleave", () => {
                extstyle(getcookie('extstyle'));
            });
            dlg("Hover preview theme event attached.");
        });
    }
    if (conf.hoverableMedal) {
        // 重写勋章结构函数
        let rewriteMedal = () => {
            // 遍历所有未重写楼层
            $('.md_ctrl:not([glassmedal])').attr("glassmedal", "true").each((t, v) => {
                // 遍历楼层所有勋章
                $(v).children(0).children('img').each((b, n) => {
                    // 获得勋章ID
                    let id = 'md' + /\_\d*$/.exec($(n).attr('id'))[0];
                    // 重写勋章结构
                    $(v).append(
                        $('<span class="hoverable-medal" id="' + $(n).attr('id') + '" style="background-image:url(' + $(n).attr('src') + ')"><div></div></span>').on('mouseover', () => {
                            showMenu({
                                'ctrlid': $(n).attr('id'),
                                'menuid': id + '_menu',
                                'pos': '12!'
                            });
                        })
                    );
                    // 重写提示样式
                    $("#" + id + "_menu .tip_horn").css("background-image", "url(" + $(n).attr('src') + ")");
                    // 移除旧的勋章
                    $(n).remove();
                });
            });
            dlg("Hoverable medal rewrote.");
        };
        //调用重写勋章函数
        $(rewriteMedal);
        // 在Ajax时重新调用Ajax函数,保存勋章样式
        $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", rewriteMedal);
        // 添加勋章样式
        $("head").append("<style id=\"hoverableMedal\">.hoverable-medal:hover div {margin-top: 0px!important;opacity: 1!important;}.hoverable-medal div {margin-top: -15px;opacity: 0.6;transition-duration: .4s;background-image:url("+staticRes.medalReflectImage+");width:100%;height:100%;filter: blur(2px);}div.tip.tip_4[id*=md_] {width: 105px;height: 165px;border: none;box-shadow: black 0px 2px 10px -3px;margin-left: 38px;margin-top: 115px;background: black;overflow: hidden;pointer-events:none!important;border-radius: 5px;padding: 0px;}div.tip.tip_4[id*=md_] .tip_horn {background-size: cover;background-position: center;height: 200%;width: 200%;z-index: -1;filter: blur(7px) brightness(0.8);top: -50%;left: -50%;}div.tip.tip_4[id*=md_] .tip_c {color: rgba(255, 255, 255, 0.98);}div.tip.tip_4[id*=md_] h4 {text-align: center;padding: 10px 5px;background-color: rgba(255, 255, 255, 0.3);}div.tip.tip_4[id*=md_] p {padding: 0px 10px;position:absolute;top:calc(50% + 38px);transform:translateY(calc(-50% - 26px));}.md_ctrl{margin-left:17px!important;padding-bottom:15px;}.hoverable-medal {width: 31px;height: 53px;transition-duration: 0.4s;border-radius: 3px;display: inline-block;margin: 5px;background-position: center;box-shadow: 0px 2px 5px 0px black;overflow:hidden;}.hoverable-medal:hover {transform: matrix3d(1, 0, 0, 0, 0, 1, 0, -0.003, 0, 0, 1, 0, 0, -1.5, 0, 0.9);box-shadow: 0px 2px 10px -3px black;}.pg_medal .mgcl img{margin-top:12px!important}.mg_img{box-shadow: inset 0 0 10px 4px rgba(0, 0, 0, 0.3);border-radius: 5px;}</style>");
        dlg("Hoverable medal style appended.");
    }
    if (conf.ljyysSearch) {
        // ljyys serach
        $("#scbar_txt").attr("name", "search").css("background-color", "rgba(0, 0, 0, 0)");
        $(".scbar_type_td").html("<a style=\"text-decoration:none;color:unset;\"onclick=\"$('scbar_form').submit();\">ljyys搜索</a>").css("background", "url(https://www.mcbbs.net/template/mcbbs/image/scbar_txt.png) -94px center no-repeat").css("width", "62px").css("cursor", "pointer");
        $("#scbar_form").attr("method", "get").attr("action", "//search.ljyys.xyz/search.php");
        $("#scbar_form [type*=hidden]").remove();
        $("#scbar_form").append('<input type="hidden" name="p" value="1">');
        dlg("ljyys search actived");
    }
    if (conf.quickAtList) {
        $("head").append("<style id=\"quickAtBtn\">#fastpostatList.in_editorbtn,#postatList{background-size: 54px;background-position: -23px 3px;}#fastpostatList,#postatList {background-image: url("+staticRes.atBtnImage+");background-size: 50px;background-position: -6px 2px;}</style>");
        // 获得At代码函数
        let getAtCode = () => {
            // 分隔list
            let quickAtList = conf.quickAtList.split(",");
            let atstr = "";
            //拼接@代码
            $(quickAtList).each((i, v) => {
                atstr += "@" + v + " ";
            });
            return atstr;
        }
        // 将函数暴露到全局
        MExt_Func_getAtCode = getAtCode;
        // 监听按键事件
        $(document).on("keydown", (e) => {
            if (e.shiftKey && e.ctrlKey && e.keyCode == 65) {
                // 判断是否在输入框内
                if (($(document.activeElement).prop("nodeName") == "INPUT" && $(document.activeElement).prop("type") == "text")) {
                    // 拼接方法插入
                    $(document.activeElement).val($(document.activeElement).val() + getAtCode());
                    dlg("@ string added");
                } else if ($(document.activeElement).prop("nodeName") == "TEXTAREA") {
                    // discuz内建函数插入
                    seditor_insertunit('fastpost',getAtCode(), '');
                    dlg("@ string added");
                }
            }
        });
        // 高级编辑模式插入@代码
        $(() => {
            if ($("#e_iframe").length) {
                // 由于高级模式的输入框是iFrame,无法直接监听,故再次监听高级输入框的按键事件
                $($("#e_iframe")[0].contentWindow).on("keydown", (e) => {
                    if (e.shiftKey && e.ctrlKey && e.keyCode == 65) {
                        // 判断是否在输入框内
                        if ($(document.activeElement).prop("nodeName") == "IFRAME") {
                            //discuz内建函数插入
                            insertText(getAtCode());
                            dlg("@ string added");
                        }
                    }
                });
            }
        });
        let hookReplyBtn = ()=> {
            // 添加按钮
            $("div.pob.cl a.fastre:not([qa-hooked])").on("click",()=>{
                // 等待窗口出现(暴力)
                let waitWindow = setInterval(()=>{
                    if(!$("#fwin_reply .tedt .bar:not([qa-added])").attr("qa-added",true).length){
                        return false;
                    }
                    clearInterval(waitWindow);
                    // 添加按钮
                    $("#postat.fat").after('<a id="postatList" href="javascript:;" title="快速@" onclick="seditor_insertunit(\'post\',MExt_Func_getAtCode(), \'\');">快速@</a> ');
                },500);
                }).attr("qa-hooked",true); // 为已经钩住的按钮添加标记
            dlg("Reply bottons hooked(QuickAt).");
        }
        $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", hookReplyBtn);
        $(() => {
            $("#fastpostat").after('<a id="fastpostatList" href="javascript:;" title="快速@" class="" onclick="seditor_insertunit(\'fastpost\',MExt_Func_getAtCode(), \'\');">快速@</a> ');
            $("#e_adv_s1").append('<a id="fastpostatList" href="javascript:;" title="快速@" class="in_editorbtn" onclick="insertText(MExt_Func_getAtCode());">快速@</a>');
            hookReplyBtn();
        });

    }
    if (conf.viewWarns) {
        // 添加查看警告样式
        $("head").append("<style id=\"quickViewWarns\">.view_warns_inposts{background:url(https://www.mcbbs.net/template/mcbbs/image/warning.gif) no-repeat 0px 2px;background-size:16px;width:90px!important;}.view_warns_home a {background: url(https://www.mcbbs.net/template/mcbbs/image/warning.gif) no-repeat 1px 2px!important;background-size: 16px!important;}</style>");
        // 添加查看警告按钮函数
        let addVWLink = () => {
            $(".plhin").each((i, v) => {
                let href = $(v).find(".authi .xw1").attr("href");
                if (!href) {
                    return false;
                }
                let uid = /uid=(\d*)/.exec(href)[1];
                $(v).find("ul.xl.xl2.o.cl:not([vw_added*=true])").attr("vw_added", "true").append($('<li class="view_warns_inposts"><a href="forum.php?mod=misc&action=viewwarning&tid=154424&uid=' + uid + '" title="查看警告记录" class="xi2" onclick="showWindow(\'viewwarning\', this.href)">查看警告记录</a></li>'));
            });
            dlg("In-posts view warns link added");
        }
        // 在DiscuzAjax时重新调用添加函数,防止失效
        $(this).on("DiscuzAjaxGetFinished", addVWLink).on("DiscuzAjaxPostFinished", addVWLink);
        dlg("adddVWLink Ajax Event attached.");
        $(() => {
            // 添加查看警告按钮
            addVWLink();
            // 用户信息界面添加查看警告按钮
            let href = $("#uhd .cl a").attr("href");
            if (!href) {
                return false;
            }
            let uid = /uid=(\d*)/.exec(href)[1];
            if (!uid) {
                return false;
            }
            $("#uhd .mn ul").append('<li class="view_warns_home"><a href="forum.php?mod=misc&action=viewwarning&tid=154424&uid=' + uid + '" title="查看警告记录" class="xi2" onclick="showWindow(\'viewwarning\', this.href)">查看警告记录</a></li>');
            dlg("Home page view warns link added.")
        });
    }
    // 自定义举报内容
    if(conf.myReportReason){
        // 获得举报内容列表函数
        let getReasons = () => {
            // 分隔list
            let reportReason = conf.myReportReason.split("\n");
            let rrstr = "";
            //拼接HTML
            $(reportReason).each((i, v) => {
                rrstr += '<label><input type="radio" name="report_select" class="pr" onclick="$(\'report_other\').style.display=\'none\';$(\'report_msg\').style.display=\'none\';$(\'report_message\').value=\''+v+'\'" value="'+v+'"> '+v+'</label><br>';
            });
            return rrstr;
        }
        // 举报按钮钩子函数
        let hookReportBtn = ()=> {
            let reportContent = getReasons();
            $("div.pob.cl a[onclick*=\"miscreport\"]:not([report-added])").on("click",()=>{
                // 等待窗口出现(暴力)
                let waitWindow = setInterval(()=>{
                    if(!$("[action*=report]").length){
                        return false;
                    }
                    clearInterval(waitWindow);
                    // 添加自定义内容
                    $("#report_reasons").prepend(reportContent)},500)
                }).attr("report-added",true); // 为已经钩住的按钮添加标记
            dlg("Report bottons hooked.");
        }
        $(hookReportBtn);
        $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", hookReportBtn);
    }
    // 移除外链警告延时,直接跳转目标页
    if(conf.removeLinkWarn){
        if(location.pathname == "/plugin.php" && getRequest('id') == "link_redirect"){
            let url = getRequest('target');
            if(url){
                // 跳就完事了
                location.href = decodeURIComponent(url);
            }
        }
    }
    if(conf.useIgInQuickReply){
        // 快速回复框使用个人签名
        let hookReplyBtn = ()=> {
            // 添加选项
            $("div.pob.cl a.fastre:not([ig-hooked])").on("click",()=>{
                // 等待窗口出现(暴力)
                let waitWindow = setInterval(()=>{
                    if(!$("#fwin_reply #moreconf:not([ig-added])").attr("ig-added",true).length){
                        return false;
                    }
                    clearInterval(waitWindow);
                    // 添加选项
                    $("#fwin_reply #postsubmit").after('<label for="usesig" style="margin-left: 10px;float: left;margin-top: 3px;"><input type="checkbox" name="usesig" id="usesig" class="pc" value="1" checked="checked">使用个人签名</label>');
                },500);
                }).attr("ig-hooked",true); // 为已经钩住的按钮添加标记
            dlg("Report bottons hooked.");
        }
        $(()=>{
            // 底部快速回复增加选项
            $("#fastpostsubmit").after('<label for="usesig" style="margin-left: 10px;"><input type="checkbox" name="usesig" id="usesig" class="pc" value="1" checked="checked">使用个人签名</label>');
            hookReplyBtn();
        });
        $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", hookReplyBtn);
    }
    // 故意把这个功能搞玄乎,纯粹是好玩,其实还是非常简单的.
    // 这里包含一些对体验影响不大又非常杂的修复选项,不适合单独开一个选项,显得很臃肿.
    // 配置里的这一串数字代表每一个功能的开关情况,比如第一位数字为1时代表第一个功能开启,第二位为0时,代表第二个功能关闭.
    if(/^[01]*$/.exec(conf.miscFix)){
        let fixconf = conf.miscFix.split("");
        let fixlist = [
            // 暗牧悬浮预览
            {"style":".t_f font[style*=\"background-color:black\"] {transition-duration: .3s;transition-delay: .5s;cursor: default;}.t_f font[style*=\"background-color:black\"]:hover {transition-delay: 0s;background-color: transparent!important;}"},
            //增加空方法,用于修复论坛的一个报错.
            {"script":"announcement = () => {};"},
            //修复页脚问题
            {"style":".mc_map_wp{min-height:calc(100vh - 202px)!important;}"},
            //修复用户组页面不对齐的问题
            {"style":".tdats .tb{margin-top:0px}"},
            // 修复编辑器@超级加倍的问题
            {"script":"$(()=>{if(typeof setEditorEvents != \"undefined\"){let __setEditorEvents = setEditorEvents;setEditorEvents= ()=>{ __setEditorEvents();setEditorEvents=()=>{};}}})"},
            // 允许改变个人签名编辑框大小
            {"style":"#sightmlmessage{resize:vertical;}"}
        ];
        let styleContent = "";
        $(fixlist).each((i,v)=>{
            if(typeof fixconf[i] == "undefined"){fixconf[i] = "1"}
            if(fixconf[i] === "1"){
                // 拼接样式字符串
                styleContent += fixlist[i].style ? fixlist[i].style : "";
                // 执行脚本
                eval(fixlist[i].script ? fixlist[i].script : "");
            }
        });
        // 添加修复样式
        $("head").append("<style id=\"miscFix\">"+styleContent+"</style>")
    }
    if(conf.fixImgZoom){
        $("head").append(`<style id="fixImgZoom">#img_scale{opacity:0; position: absolute;right: 20px;bottom: 20px;background: #0006;transition-duration:.2s;color: white;padding: 10px;pointer-events: none;border-radius: 10px;}#imgzoom_zoom{height:auto;transition-duration:.2s}#imgzoom_zoomlayer{height:auto!important}#imgzoom{width:auto!important;height:auto!important}</style>`);
        dlg("FixImgZoom style appended.");
        let __zoom = zoom;
        let t = 0;
        // 初始化基本缩放信息对象
        let img = {width:0,height:0,top:0,left:0,radio:1,scale:1,orgwidth:0};
        // 缩放函数
        let resize = (width)=>{
            clearTimeout(t);
            // 显示缩放比例
            $("#img_scale").html(parseInt(img.scale*100)+"%").css("opacity",1);
            t = setTimeout(()=>{$("#img_scale").css("opacity",0)},2000);
            // 计算目标大小和位置
            let ow = img.width;
            img.width = width;
            ow = (ow - img.width)/-2;
            img.left -= ow;
            img.top -= ow*img.radio;
            // 修改
            $("#imgzoom_zoom").css("width",img.width+"px");
            $("#imgzoom").css("left",img.left+"px");
            $("#imgzoom").css("top",img.top+"px");
        }
        // 保存基本信息
        let initP = () => {
            img.width = parseInt($("#imgzoom_zoom").attr("width"));
            img.height = parseInt($("#imgzoom_zoom").attr("height"));
            img.radio = img.height/img.width;
            img.top = parseInt($("#imgzoom").css("top"));
            img.left = parseInt($("#imgzoom").css("left"));
            img.scale = 1;
            img.orgwidth = img.width;
        }
        zoom = (obj,zimg,nocover,pn,showexif)=>{
            // 伪装成IE,使原函数的DOMMouseScroll事件监听器以可以被卸除的形式添加
            BROWSER.ie = 6;
            __zoom(obj,zimg,nocover,pn,showexif);
            // 防止翻车,改回去
            setTimeout(()=>{BROWSER.ie = 0;},1000);
            // 等待窗口出现
            let wait = setInterval(()=>{
                if($("#imgzoom_zoom").length){
                    clearInterval(wait);
                    // 信息归零,准备下一次保存
                    img = {width:0,height:0,top:0,left:0,radio:1,scale:1,orgwidth:0};
                    // 判断是否已经监听事件,防止超级加倍
                    if($("#imgzoom").attr("fixed")=="true"){return true;}
                    // 原始尺寸按钮事件
                    $("#imgzoom_adjust").on("click",()=>{
                        $("#imgzoom").css("transition-property","opacity,top,left,transform");
                        img.width == 0 ? initP(): 0;
                        img.scale = 1;
                        resize($("#imgzoom_zoom").attr("width"));
                    });
                    // 卸除原函数监听器
                    $("#imgzoom")[0].onmousewheel=null;
                    // 增加显示缩放大小元素并监听事件
                    $("#imgzoom").append(`<span id="img_scale"></span>`).on("mousewheel DOMMouseScroll",(e)=>{
                        // 判断是否按下功能键
                        if(e.ctrlKey||e.altKey||e.shiftKey){return true;}
                        // 阻止滚动
                        e.preventDefault();
                        // 兼容火狐,正确判断滚轮方向
                        let scroll = e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -e.originalEvent.detail;
                        // 忽略无效滚动
                        if(scroll == 0 ){return true}
                        // 判断是否需要初始化
                        img.width == 0 ? initP(): 0;
                        // 规定需要显示过渡动画的属性
                        $("#imgzoom").css("transition-property","opacity,top,left,transform");
                        // 判断是否过小
                        if(scroll <0 && ((img.width<350&&img.radio<1)||(img.height<350&&img.radio>=1))){
                            // 回弹动画
                            $("#imgzoom").css("transform","scale(0.8)");
                            setTimeout(()=>{$("#imgzoom").css("transform","scale(1)");},200);
                            return true;
                        }
                        // 修改缩放比例
                        img.scale += scroll > 0 ? 0.05 : -0.05;
                        // 判断比例是否过小
                        img.scale= img.scale<0.1 ? 0.1 : img.scale;
                        // 缩放
                        resize(img.orgwidth*img.scale);
                    });
                    // 按下鼠标事件
                    $("#imgzoom").on("mousedown",(e)=>{
                        // 按下鼠标时移除修改位置的过渡动画,使窗口跟手
                        $("#imgzoom").css("transition-property","opacity");
                    });
                    // 释放鼠标事件
                    $("#imgzoom").on("mouseup",(e)=>{
                        // 改回去
                        $("#imgzoom").css("transition-property","opacity,top,left,transform");
                        // 保存移动后的窗口位置
                        img.top = parseInt($("#imgzoom").css("top"));
                        img.left = parseInt($("#imgzoom").css("left"));
                    });
                }
            },50);
        }
        dlg("Zoom function rewrote.");
    }
})();