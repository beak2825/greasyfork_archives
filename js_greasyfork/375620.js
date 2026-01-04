// ==UserScript==
// @name         1024综合助手
// @namespace    http://tampermonkey.net/
// @version      1.5.15
// @description  去除1024的60秒屏蔽、菜区助手（直播、算分、统计）、163右下角回家之路
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/398240-gm-config-zh-cn/code/GM_lazyloadconfig_zh-CN.js
// @author       *.163.com
// @match      http*://*/htm_data/*.html
// @match      http*://*/htm_mob/*.html
// @match      http*://*/read.php*
// @match      http*://*/personal.php*
// @match      http*://*/post.php*
// @match      http*://*/thread0806.php*
// @match      *://*cl*
// @match        *://*.163.com
// @match        https://2023.redircdn.com/*
// @connect      get.xunfs.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license     LGPL-2.0-or-later
// @run-at            document-idle


// @downloadURL https://update.greasyfork.org/scripts/375620/1024%E7%BB%BC%E5%90%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/375620/1024%E7%BB%BC%E5%90%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

 // 去跳转
(function() {
    'use strict';
    let url = new URL(window.location.href);
    let src = url.searchParams.get("src");
    if (src) {
        window.location.href = decodeURIComponent(src);
    }
})();
//去广告
$('.tips:has(table)').remove();
    $('.sptable_do_not_remove.f_one').parent().prev('.tpc_icon.fl').remove();
    $('.sptable_do_not_remove.f_one').parent().next('.line.tpc_line').remove();
    $('.sptable_do_not_remove.f_one').remove();
    $('.sptable_do_not_remove').parent().remove();
    $('.ftad-ct').remove();
    $('center.gray').css({'margin-top':'50px'});


(function() {
    'use strict';
    // 回家不迷路
    var enableGoHome = GM_getValue('enableGoHome',true);

    if (enableGoHome && window.location.href.includes('163.com')) {
        // 创建一个悬浮按钮
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.innerText = '☞神秘入口☜';
        document.body.appendChild(button);

        // 给按钮添加点击事件监听器
        button.addEventListener('click', function() {
            // 创建POST请求的payload
            const payload = 'a=get18&system=android&v=2.2.9';

            // 发起POST请求
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://get.xunfs.com/app/listapp.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: payload,
                responseType: 'text',
                onload: function(response) {
                    // 解析响应中的JSON数据
                    const responseData = JSON.parse(response.responseText);

                    // 提取所需的URL
                    const url1 = responseData.url1;
                    const url2 = responseData.url2;
                    const url3 = responseData.url3;

                    // 创建一个悬浮div来显示URL
                    const urlDiv = document.createElement('div');
                    urlDiv.style.position = 'fixed';
                    urlDiv.style.bottom = '60px';
                    urlDiv.style.right = '20px';
                    urlDiv.style.zIndex = '9999';
                    urlDiv.style.backgroundColor = '#fff';
                    urlDiv.style.padding = '10px';
                    urlDiv.style.border = '1px solid #ccc';

                    // 生成URL的内容
                    const urlsContent = `
                    最新地址为：
                    <br>地址1: <a href="#" data-url="${url1}" style="text-decoration: underline; color: blue;">${url1}</a>
                    <br>地址2: <a href="#" data-url="${url2}" style="text-decoration: underline; color: blue;">${url2}</a>
                    <br>地址3: <a href="#" data-url="${url3}" style="text-decoration: underline; color: blue;">${url3}</a>
                `;

                    // 设置URL的内容到div中
                    urlDiv.innerHTML = urlsContent;

                    // 将div添加到文档中
                    document.body.appendChild(urlDiv);

                    // 为URL添加点击事件监听器
                    const urlLinks = urlDiv.querySelectorAll('a');
                    urlLinks.forEach(function(link) {
                        link.addEventListener('click', function(event) {
                            event.preventDefault();
                            const url = this.getAttribute('data-url');
                            copyToClipboard(url);
                        });
                    });

                    // 复制文本到剪贴板的函数
                    function copyToClipboard(text) {
                        const tempInput = document.createElement('input');
                        tempInput.value = text;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand('copy');
                        document.body.removeChild(tempInput);
                        showAlert(text + ' 复制成功');
                    }

                    // 显示提示信息并在一段时间后隐藏
                    function showAlert(message) {
                        const alertDiv = document.createElement('div');
                        alertDiv.style.position = 'fixed';
                        alertDiv.style.bottom = '80px';
                        alertDiv.style.right = '20px';
                        alertDiv.style.zIndex = '9999';
                        alertDiv.style.backgroundColor = '#fff';
                        alertDiv.style.padding = '10px';
                        alertDiv.style.border = '1px solid #ccc';
                        alertDiv.innerText = message;
                        document.body.appendChild(alertDiv);
                        setTimeout(function() {
                            document.body.removeChild(alertDiv);
                        }, 2000);
                    }
                },
                onerror: function(error) {
                    console.error('POST请求失败:', error);
                }
            });
        });
    }
        // 获取页面上的所有链接
    var links = document.getElementsByTagName("a");

    // 遍历链接
    for (var i = 0; i < links.length; i++) {
        // 获取链接的href属性
        var href = links[i].getAttribute("href");

        // 检查href是否包含"redircdn.com"
        if (href && href.includes("redircdn.com")) {
            // 从href中提取原始链接
            var original = href.split("?")[1].split("&")[0];

            // 把原始链接中的下划线替换成点
            original = original.replace(/______/g, ".");

            // 把href属性设置为原始链接
            links[i].setAttribute("href", original);

            // 把target属性设置为"_blank"，以在新窗口打开
            links[i].setAttribute("target", "_blank");
        }
    }
})();

/*-------------------------------------------------------------------------------------------------------------------------------------------*/
//种子转磁力
(function() {
    'use strict';

    var helper = {
        hash: function(url) {
            var hash = url.split('hash=');
            return hash[1].substring(3);
        },
        inurl: function(str) {
            var url = document.location.href;
            return url.indexOf(str) >= 0;
        }
    };

    if (helper.inurl('/htm_data/')) {
        // 种子链接转磁力链
        var torLink = $("a[href*=\'?hash\=\']");
        if( torLink.length > 0 ){
            var tmpNode = '<summary>本页共有 ' + torLink.length + ' 个磁力链！</summary>';
            torLink.each(function() {
                var torrent = $(this).attr('href');
                var hash = helper.hash(torrent);
                var magnet = 'magnet:?xt=urn:btih:' + hash;
                tmpNode += '<p><a target="_blank" href="' + magnet + '">【 磁力链:　' + magnet + ' 】</a>　　<a target="_blank" href="' + torrent + '">【 下载种子 】</a></p>';
            });
            $('body').append('<div style="position:fixed;top:0px;background:#def7d4;width:100%;padding:4px;text-align:center;"><details>' + tmpNode + '</details></div>');
        }
    }
})();


(function() {
    'use strict';
    //var newVersion = 'v1.6';
    var localHref = window.location.href, disable_contextmenu = false, mouse_right_panel = null, img_src = null, asyncGMAPI = false, getValue, last_update = 0;
    var localTitle = document.title;

    var blackList = ''.split(',');
    var spamList = ''.split(',');
    var whiteList = ''.split(',');
    var blackPostList = ''.split(',');
    var userName = '';
    var isMob = false;

    var tid = 0;
    var page = 0;
    var floor = 0;

    var game_data = [];
    var win_item = [];
    var cache_key = 'pf_game_data_';

    var zhibo_board_data = [];
    var zhibo_board_htm = '';
    var zhibo_board_reply;

    var loading_gif = 'https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/loading00.gif';
    var clearImgBtn = '<a style="cursor:pointer;border:1px solid #A6CBE7;color:#2f5fa1;padding:2px 8px 2px 8px;float:right;" id="clearImg" title="">整理图片</a>';
    var boardBtn = '<a style="cursor:pointer;border:1px solid #A6CBE7;color:#2f5fa1;padding:2px 8px 2px 8px;float:right;margin-right:3px;" id="openBoard" title="">打开计分板</a>';
    let css = '.s3 a {color:#FA891B;} .hide {display:none;}';
    css += '#zhibo_board { position: fixed; right: 10px; bottom: 150px;background: #FFF;border: 1px solid #A6CBE7;padding: 3px;} #zhibo_board .item {padding: 5px 0;} #zhibo_board .item .tm {width: 250px;display: inline-block;} #zhibo_board .item .code_short {width: 40px; margin-left: 3px;} #zhibo_board .item .code_medium {width: 60px; margin-left: 3px;}';
    css += '#zhibo_board .tools {padding:10px 0 0 0;} #zhibo_board .tools .right {float:right;padding-right:15px;}';
    css += '#zhibo_tools_message {position: fixed;width: 300px; display:none; font-size:16px;background: #FFFFFF; padding: 15px;left: 45%; top: 30%;z-index: 999;border: 2px solid #ff9900;text-align: center;}';
    css += '#htmlarea,#textarea{height:500px!important;}';
    css += '.s3 a {color:#FA891B;} .hide {display:none!important;}';
    css += '#pf_board {z-index:999;font-size:14px; position: fixed; right: 0px; bottom: 50px;background: #FFF;border: 1px solid #A6CBE7;padding: 3px;} #pf_board .item {padding: 3px 0;line-height:150%;} #pf_board .item .tm {display: inline-block;} #pf_board .item .code_short {width: 40px; margin-left: 3px;} #pf_board .item .code_medium {width: 60px; margin-left: 3px;}';
    css += '#pf_board .tools {padding:10px 0 0 0;text-align:center;} #pf_board .tools .right {float:right;padding-right:15px;}';
    css += '#pf_board .s3 {width:50px;height:20px;overflow:hidden;text-align:left;} #pf_board .check_half {/*width:80px;*/display:inline-block;}';
    css += `#pf_board .tm_a,#pf_board .tm_b,#pf_board .tm_pk {width:150px;display:inline-block;}
    #pf_board .tm_pk {text-align:center;} .tm_b {text-align:right;}
    `;
    css += '#pf_board .item_list {padding:0 10px;max-height:400px;overflow-y:scroll;}';
    css += '#pf_tools_message {position: fixed;width: 300px; display:none; font-size:16px;background: #FFFFFF; padding: 15px;left: 45%; top: 30%;z-index: 999;border: 2px solid #ff9900;text-align: center;}';
    css += `.tools_btn {line-height:150%;}
    #btn_pinfen {
    position: absolute;
    right: 50px;
    background: #008000;
    border-radius: 3px;
    padding: 10px 20px;
    color: #FFFFFF;
    margin: 0 auto;
    font-size: 20px;
    text-align: center;
    width: max-content;
    cursor: pointer;}
    .points_tips {
    position: absolute;
    left: 250px;
    /*z-index:99;*/
    background: #F4FBFF;
    border: #D4EFF7 1px solid;
    padding: 5px 1rem;
    margin: 0;
    bottom: -13px;
    font-size:16px;
    text-align: center;
    }
    .pages a.last {border-width: 1px;margin-right:2px;}
    input.mininput {border:#D4EFF7 1px solid;padding:3px;background:#fff;width:100px;}`;
    if (typeof GM_config == 'undefined') {
        alert('小草助手：GM_config库文件加载失败，脚本无法正常使用，请刷新网页重新加载！');
        return;
    } else {
        console.log('小草助手：相关库文件加载成功');
    };

    GM_addStyle(css);

    Date.prototype.format = function (format) {
        var args = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var i in args) {
            var n = args[i];
            if (new RegExp("(" + i + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
        }
        return format;
    }


    var sizeof = function (str, charset) {
        var total = 0,
            charCode,
            i,
            len;
        charset = charset ? charset.toLowerCase() : '';
        if (charset === 'utf-16' || charset === 'utf16') {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0xffff) {
                    total += 2;
                } else {
                    total += 4;
                }
            }
        } else {
            for (i = 0, len = str.length; i < len; i++) {
                charCode = str.charCodeAt(i);
                if (charCode <= 0x007f) {
                    total += 1;
                } else if (charCode <= 0x07ff) {
                    total += 2;
                } else if (charCode <= 0xffff) {
                    total += 3;
                } else {
                    total += 4;
                }
            }
        }
        return total;
    }

    String.prototype.byteLength = function () {
        /*
        var count = 0;
        for (var i = 0, l = this.length; i < l; i++) {
            count += this.charCodeAt(i) <= 128 ? 1 : 2;
        }
        return count;
        */
        return sizeof(this);
    }

    String.prototype.format = function(args) {
        if (arguments.length > 0) {
            var result = this;
            if (arguments.length == 1 && typeof(args) == "object") {
                for (var key in args) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] == undefined) {
                        return "";
                    } else {
                        var regex = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(regex, arguments[i]);
                    }
                }
            }
            return result;
        } else {
            return this;
        }
    }


    function config() {
        var windowCss = '#Cfg .nav-tabs {margin: 15px 2px; text-align: center;} #Cfg .config_var textarea{width: 100%; height: 100px;resize: none;} #Cfg .inline {padding-bottom:0px;} #Cfg .config_header a:hover {color:#1e90ff;} #Cfg .config_var {margin:0;} #Cfg input[type="checkbox"] {margin: 3px 3px 3px 0px;} #Cfg input[type="text"] {width:100%; margin-top:5px;} #Cfg {background-color: #B1D3E0;} #Cfg .reset_holder {float: left; position: relative; bottom: -1em;} #Cfg .saveclose_buttons {margin: .7em;} #Cfg .section_desc {font-size: 10pt;} #Cfg_field_whiteTxt,#Cfg_field_blackPostTxt {height:60px!important;}';
        GM_registerMenuCommand('设置', opencfg);

        function opencfg() {
            GM_config.open();
        };
        GM_config.init(
            {
                id: 'Cfg',
                title: GM_config.create('a', {
                    //href: 'javascript:void(0);',
                    //target: '_blank',
                    textContent: '小草助手',
                    title: '小草综合助手'//'版本：' + newVersion + ' 点击访问主页'
                }),
                isTabs: true,
                skin: 'tab',
                css: windowCss,
                frameStyle:
                {
                    height: '620px',
                    width: '530px',
                    zIndex: '2147483648',
                },
                fields:
                {
                    readEnable:
                    {
                        section: ['内容页'],
                        labelPos: 'right',
                        label: '启用内容页优化',
                        type: 'checkbox',
                        'default': 1
                    },
                    likeFixEnable:
                    {
                        labelPos: 'right',
                        label: '启用主题点赞按钮浮动',
                        type: 'checkbox',
                        'default': 1
                    },
                    whiteFloor:
                    {
                        'label': '保留楼层（半角逗号 , 分割）',
                        'type': 'input',
                        'default': ''
                    },
                    spamTxt:
                    {
                        'label': '屏蔽内容（完整匹配回复内容）',
                        'type': 'textarea',
                        'default': '1024,1025,1026,1021,10024,1024感谢分享,多谢分享,感谢分享,感谢你的分享,感谢大佬分享,感谢分享~,谢谢分享,感謝分享,发码好人,1024.,感谢分享！,感谢分享。,经典,路过,支持分享,路过看一下,继续继续,勿忘提肛'
                    },
                    blackPostTxt:
                    {
                        'label': '黑名单ID（回复楼层不显示）',
                        'type': 'textarea',
                        'default': ''
                    },
                    whiteTxt:
                    {
                        'label': '白名单ID',
                        'type': 'textarea',
                        'default': ''
                    },
                    listEnable:
                    {
                        section: ['列表页'],
                        labelPos: 'right',
                        label: '启用列表页优化',
                        type: 'checkbox',
                        'default': 1
                    },
                    blackTxt:
                    {
                        'label': '黑名单ID（列表页不显示）',
                        'type': 'textarea',
                        'class': 'line',
                        'default': ''
                    },
                    pingfenEnable:
                    {
                        section: ['算分助手'],
                        labelPos: 'right',
                        label: '启用算分',
                        type: 'checkbox',
                        'default': 1
                    },
                    suanfenKey:
                    {
                        'label': '算分助手匹配标题关键字',
                        'type': 'input',
                        'default': '開盤|對賭|下注有效楼层|竞猜|冲刺赛'
                    },
                    suanfenScoreKey:
                    {
                        'label': '积分赛制(赢+3,走+0,输-1)',
                        'type': 'input',
                        'default': '积分赛'
                    },
                    suanfenScorePoints:
                    {
                        'label': '积分赛制分值',
                        'type': 'input',
                        'default': '+3,0,-1'
                    },
                    suanfenCCScoreKey:
                    {
                        'label': '冲刺赛制(赢加分,输走不扣)',
                        'type': 'input',
                        'default': '冲刺赛|世界杯活动场次'
                    },
                    suanfenCCScorePoints:
                    {
                        'label': '冲刺赛默认点数(如果有下注点数则留空或填写0)',
                        'type': 'input',
                        'default': '0'
                    },
                    betsCopyEnable:
                    {
                        labelPos: 'right',
                        label: '启用复制下注信息',
                        type: 'checkbox',
                        'default': 1
                    },
                    betsCopyOnlyBets:
                    {
                        labelPos: 'right',
                        label: '只复制下注信息（适配涛姐统计模板）',
                        type: 'checkbox',
                        'default': 0
                    },
                    betsCopyHead:
                    {
                        labelPos: 'right',
                        label: '自动生成表头（首页）',
                        type: 'checkbox',
                        'default': 1
                    },
                    zhiboEnable:
                    {
                        section: ['直播助手'],
                        labelPos: 'right',
                        label: '启用直播助手',
                        type: 'checkbox',
                        'default': 1
                    },
                    zhiboLinkEnable:
                    {
                        labelPos: 'right',
                        label: '插入标题引用代码',
                        type: 'checkbox',
                        'default': 1
                    },
                    zhiboCodeKey:
                    {
                        'label': '提取直播代码匹配标题关键字',
                        'type': 'input',
                        'default': '開盤|對賭|下注有效楼层'
                    },
                    bodanCodeKey:
                    {
                        'label': 'F1/赛马图片类主题',
                        'type': 'input',
                        'default': '賽馬|\\[F1|波胆|分差'
                    },
                    boardTemplate:
                    {
                        'label': '计分板简易代码',
                        'type': 'textarea',
                        'default': '{ta}　{pk}　{tb}\r\n比分：{bf_a} - {bf_b}　　{state}\r\n\r\n'
                    },
                    boardRichTemplate:
                    {
                        'label': '计分板花里胡哨代码',
                        'type': 'textarea',
                        'default': '[color=green]{ta}[/color]　[color=#FF6600]{pk}[/color]　[color=green]{tb}[/color]  [color=orange]{state}[/color]\r\n[size=4][backcolor=blue][color=white]　{bf_a}　[/color][/backcolor]　-　[backcolor=blue][color=white]　{bf_b}　[/color][/backcolor][/size]\r\n'
                    },
                    zhiboLink22222Enable:
                    {
                        section: ['直播配置'],
                        labelPos: 'right',
                        label: '占位用（没实际效果）',
                        type: 'checkbox',
                        'default': 1
                    },
                    zhiboCodeLM:
                    {
                        'label': '赛事关键字',
                        'type': 'input',
                        'default': '賽事|赛事'
                    },
                    zhiboCodeEvent:
                    {
                        'label': '比赛内容关键字',
                        'type': 'input',
                        'default': '比赛内容'
                    },
                    zhiboCodeTime:
                    {
                        'label': '时间关键字',
                        'type': 'input',
                        'default': '比賽時間|時間|比赛时间|时间'
                    },
                    zhiboCodeTa:
                    {
                        'label': '主队关键字',
                        'type': 'input',
                        'default': '主隊|主队|主'
                    },
                    zhiboCodePK:
                    {
                        'label': '让球关键字',
                        'type': 'input',
                        'default': '讓球|让球|让|讓|盘口|平局'
                    },
                    zhiboCodeTb:
                    {
                        'label': '客队关键字',
                        'type': 'input',
                        'default': '客隊|客队|客'
                    },
                },
                events:
                {
                    save: function() {
                        GM_config.close();
                        //location.reload();
                    }
                },
            });
    };

    config();
    var G = GM_config;
    spamList = G.get('spamTxt').split(',');
    whiteList = G.get('whiteTxt').split(',');
    blackList = G.get('blackTxt').split(',');
    blackPostList = G.get('blackPostTxt').split(',');

    pageInit();

    function pageInit() {
        userName = $.trim($('.guide span').text());
        whiteList.push(userName);

        localHref = localHref.replace(/#\S+/g,'');
        if (localHref.match(/htm_mob\S*\.html/) != null ){
            isMob = true;
        }

        tid = parseInt(getQueryVariable('tid'));
        tid = isNaN(tid) ? 1 : tid;


        page =getQueryVariable('page');
        if(page == 'e')
        {
            page = $('.pages:first a u').text();
        }
        page = parseInt(page);
        page = isNaN(page) ? 1 : page;

        floor = parseInt(getQueryVariable('floor'));
        floor = isNaN(floor) ? 0 : floor;



        if(G.get('listEnable'))
        {
            listFix();
        }


        if((/read.php|htm_data|htm_mob/).test(localHref)){
            if(tid==1)
            {
                tid = localHref.substring(localHref.lastIndexOf('/')+1, localHref.lastIndexOf('.'));
//                 var m = localHref.match(/\/(\d{4})\/(\d{2})\/(\d{6,})\.html/);

//                 month = m[1];
//                 fid = m[2];
//                 tid = m[3];
            }

            $.each($('.tipad .s3'), function(i, item){
                let floor = $(item).text().replace(/[^\d]/g,'');
                let $tiptop = $('.tiptop', $(item).parent().parent().parent().parent());

                $tiptop.append(`<a name="${floor}" />`);
            })

            let html = '<input id="floorinput" class="mininput" type="number" min="1" placeholder="楼层" maxlength="5" /> <a class="last" id="gofloor">跳转楼层</a>';

            $('#last:first').parent().append(` ${html}`)
            //$('#main .t3 td[align=left]:first').append(` ${html}`)

             let go = $('#gofloor');
            $(go).click(function() {
                let floor = parseInt($('#floorinput').val());
                if(!isNaN(floor))
                {
                    if(floor>10000000)
                    {
                        window.location.href = `/read.php?tid=${tid}&pid=${floor}`;
                    }
                    else
                    {
                        let page_go = parseInt((floor+1)/25) + ((floor+1)%25 > 0 ? 1 :0);
                        if(page_go == page)
                        {
                            window.location.href = `${localHref}#${floor}`;
                        }
                        else
                        {
                            window.location.href = `/read.php?tid=${tid}&toread=1&page=${page_go}&floor=${floor}#${floor}`;
                        }
                    }
                }
            });

            $('#floorinput').bind("keydown",function(event){
                var e = window.event || event;
                if (e.keyCode == 13) {
                    $(go).click();
                }
            });

            if(floor>0){
                $('#floorinput').val(floor);
                $(go).click();
            }

            //Funny();
        }


        if (localHref.match(/thread0806\.php\?fid=/) != null ){
                //if(getQueryVariable('search') == today)
                get_today_thread();
                //<a href="javascript:void(0);" class="last" id="get_thread"> 選取主題</a>
        }


        if(G.get('readEnable'))
        {
            postFix();
        }

        if(G.get('zhiboEnable'))
        {
            zhiboTools();

            if(localStorage.getItem('zhibo_board_open') == '1')
            {
                /*
                var data = localStorage.getItem('zhibo_data_board');

                if(data != '' && data != null)
                {
                    setTimeout(zhiboBoard, 500);
                }
                */
            }

           var tpc_content = $('#conttpc');
           $(tpc_content).css({position:'relative'});


           var key = eval('/'+ G.get('suanfenKey') +'/');
           if(G.get('pingfenEnable') && localTitle.match('\\[直播\\]') == null && localTitle.match(key) != null && localHref.match('read\.php') != null)
           {
               if($('#btn_pinfen').length == 0)
               {
                   $(tpc_content).prepend('<div class="tools_btn" id="btn_pinfen">提取算分信息</div>');

                   var copyBtn = '<div class="t_like tools_btn" id="copy_bets_btn" style="position: fixed; top: 60px; right: 20px;">下注信息</div>';
                   $('body').append(copyBtn);
                   $('#copy_bets_btn').click(copy_bets);
               }

               get_game_data();


               $('#btn_pinfen').click(function() {
                   get_game_info();
                   pf_board_toggle(1);

                   $('#pf_board .tm [class^="tm_"]').click(function (){

                       let i = $(this).attr('i');

                       if(!$(this).hasClass('sred'))
                       {
                           $('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i)).removeClass('sred');
                           $(this).addClass('sred');
                           $('#id_{0}_{1} .tm [name=win_team]'.format(tid, i)).val($(this).text());
                       }
                       else
                       {
                           $('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i)).removeClass('sred');
                           $('#id_{0}_{1} .tm [name=win_team]'.format(tid, i)).val('走盘');
                       }

                       save_game();
                   });
                   //location.href = location.href;
               });


               $('#close_code').click(function(){
                   pf_board_toggle(0);
                   //$('#pf_board').hide();
               });


               $('#save_game').click(function(){
                   save_game();
               });


               $('#pf_board .tm [class^="tm_"]').click(function (){

                   let i = $(this).attr('i');

                   if(!$(this).hasClass('sred'))
                   {
                       console.log('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i));
                       $('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i)).removeClass('sred');
                       $(this).addClass('sred');

                       $('#id_{0}_{1} .tm [name=win_team]'.format(tid, i)).val($(this).text());
                   }
                   else
                   {
                       $('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i)).removeClass('sred');
                       $('#id_{0}_{1} .tm [name=win_team]'.format(tid, i)).val('走盘');
                   }

                   save_game();
               });


               if(GM_getValue('auto_settle_up') == 1)
               {
                   setTimeout(function() {save_game();},300);
               }
           }
        }

        if (localHref.match(/post\.php/) != null ){
            $('a[onclick^=checklength]').parent().append(clearImgBtn).append(boardBtn);
            $('#clearImg').click(clearImg);

            $('#openBoard').click(zhiboBoard);


            $('.tr3.f_one .t_one').css({position: "relative"});

            var title_input = $('#atc_title');

            if(title_input != null)
            {
                $(title_input).parent().html('<textarea name="atc_title" class="input" style="font: 14px Tahoma; padding-left:2px;height:60px;width:100%" id="atc_title">'+$(title_input).val()+'</textarea>');
                $('#atc_title').keyup(function(){
                    title_tips();
                    //console.log($(this).val().byteLength());
                });
            }

            setTimeout(function() {title_tips();},300);
        }


        personalFix();
    };

    function title_tips() {

        if($('#title_tips').length == 0)
        {
            $('.tr3.f_one .t_one').append(`<div id="title_tips" style="position: absolute;right:5px;top: 30px;">当前字节数 <em>0</em></div>`);
        }
        var title_tips = $('#title_tips');

        let len = $('#atc_title').val().byteLength();
        $('em',$(title_tips)).text(len);
        if(len>=300)
        {
            $(title_tips).addClass('sred');
        }
        else
        {
            $(title_tips).removeClass('sred');
        }
    }

    function pf_board_toggle(show)
    {
        //console.log(show);
        show = parseInt(show);
        if(isNaN(show))
        {
            show = GM_getValue('pf_board_show') > 0 ? 0 : 1;
        }
        GM_setValue('pf_board_show', show);
        let board = $('#pf_board .item_list');
        //let board_show = GM_getValue('pf_board_show')==1;

        //console.log(show);

        if(show>0)
        {
            GM_setValue('pf_board_show',1);
            $(board).removeClass('hide');
            $('#hide_tools').val('隐藏面板');
        }
        else
        {
            GM_setValue('pf_board_show',0);
            $(board).addClass('hide');
            $('#hide_tools').val('显示面板');
        }


        //console.log($(board).hasClass('hide'));
        /*
        if($(board).hasClass('hide'))
        {
            GM_setValue('pf_board_show',1);
            $(board).removeClass('hide');
            $('#hide_tools').text('隐藏面板');
        }
        else
        {
            GM_setValue('pf_board_show',0);
            $(board).addClass('hide');
            $('#hide_tools').text('显示面板');
        }
        */
    }

    function zhiboTools()
    {
        var key =eval('/'+ G.get('zhiboCodeKey') +'/');
        var zhiboBtn = '<div class="t_like tools_btn" id="zhibo_btn" style="position: fixed; top: 220px; right: 20px;">直播代码</div>';
        zhiboBtn += '<textarea id="zhibo_code" style="width:160px;height:200px;position: fixed;right:20px;top:284px;display: none;"></textarea>'
        if (localTitle.match(key) != null && localTitle.match(/直播/) == null ){ // localTitle.match(/對賭/) != null || localTitle.match(/下注有效楼层/) != null
            $('#conttpc').append(zhiboBtn);
            $('#zhibo_btn').click(getZhiboCode);
        }
    }


    function get_zhibo_data(){
        for(var key in localStorage){

        }
    }


    //生成计分板
    function zhiboBoard(){
        localStorage.setItem('zhibo_board_open', '1');
        if($('#zhibo_board').length == 0)
        {
             $('body').append('<div id="zhibo_board"></div>');
           // $('form[action^="post.php"] .t').css({position: 'relative'}).append('<div id="zhibo_board"></div>')
        }
        var data = getBoardData();
        data = JSON.parse(data);

        if(data == '' || data == null || data.length == 0)
        {
            message('木有提取到比赛信息，先去开盘贴提取代码再来生成计分板', 5);
            return;
        }

        //console.log(data);
        var htm_tmp = '<div id="id_{pi}_{index}" pi="{pi}" i="{index}" class="item"><input class="check" {checked} type="checkbox"><span class="tm"><span class="tm_a">{ta}</span> <span class="s3">{pk}</span> <span class="tm_b">{tb}</span></span> <span class="bf">比分：<input type="text" class="code_short" placeholder="比分" value="{bf_a}" name="bf_a"> - <input type="text" class="code_short" placeholder="比分" name="bf_b" value={bf_b}><input type="text" class="code_medium" placeholder="进度" name="state" value="{state}"></span>';
        htm_tmp += ' <span class="delete">删</span>';
        htm_tmp += '<input type="hidden" value="{ta}" name="ta"><input type="hidden" value="{tb}" name="tb"><input type="hidden" value="{pk}" name="pk"><input type="hidden" value="{tid}" name="tid">';
        htm_tmp += '</div>'


        var htm_pk_tmp = '<div class="item pk">{0}</div>';

        var htm = '';
        $.each(data, function(pi, pd){
            if(countItem(pd.items)>0)
            {
                htm += htm_pk_tmp.format(cutTitle(pd.title));
            }
             $.each(pd.items, function(index, item){
                 item.index = index;
                 item.pi = pi;
                 if(item.deleted==0)
                 {
                     htm += htm_tmp.format(item);
                 }
            });
        });

        htm += '<div class="tools"><input type="button" id="simple_code" value="简易代码"> <input type="button" id="rich_code" value="花里胡哨"> <span class="right"><input type="button" id="clear_data" value="清空数据"> <input type="button" id="close_code" value="关闭"></div>';

        zhibo_board_htm = htm;
        $('#zhibo_board').html(htm).show();

        $('#close_code').click(function(){
            updateBoardData();
            $('#zhibo_board').hide();
        });

        $('#clear_data').click(function() {
            if (confirm("确认清空记分板数据?")==true) {
                localStorage.removeItem('zhibo_data_board', '');
                for(var key in localStorage){
                   if(key.indexOf('zhibo_data_') > -1)
                   {
                       localStorage.removeItem(key);
                   }
                }
                $('#zhibo_board').hide();
                localStorage.removeItem('zhibo_board_open');
            }
        });

        $('#zhibo_board .tm_a,#zhibo_board .tm_b').click(function (){



        });


        $('#zhibo_board .item .delete').click(function(){

            //if (confirm("确认删除此项?")==true) {
            /*
            clearTimeout(st);
            var st =  setTimeout(updateBoardData, 2000);
            */

            var data = getBoardData();
            data = JSON.parse(data);
            var pi = $(this).parent().attr('pi');
            var i = $(this).parent().attr('i');

            data[pi].items[i].deleted = 1;
            /*
            if(data[pi].items.length == 0)
            {
                data.splice(pi,1);
            }
            */

            setBoardData(data);

            $(this).parent().remove();
            //}
        });

        var board_code = '';

        zhibo_board_reply = $('textarea[name=atc_content]');

        $('#rich_code').click(function() {
            board_code = '\r\n';
            var board_code_tmp = G.get('boardRichTemplate');

            if(board_code_tmp == null)
            {
                board_code_tmp = '[color=green]{ta}[/color]　[color=#FF6600]{pk}[/color]　[color=green]{tb}[/color]  [color=orange]{state}[/color]\r\n';
                board_code_tmp += '[size=4][backcolor=blue][color=white]　{bf_a}　[/color][/backcolor]　-　[backcolor=blue][color=white]　{bf_b}　[/color][/backcolor][/size]\r\n';
            }

            /*
            $.each(zhibo_board_data, function(index, item){
                if(item.checked == 'checked')
                {
                    board_code += board_code_tmp.format(item);
                }
            });
            */


            setPost(board_code_tmp, zhibo_board_reply);
        });

        $('#simple_code').click(function(){
            board_code = '\r\n';
            var board_code_tmp = G.get('boardTemplate');
            if(board_code_tmp == null)
            {
                board_code_tmp = '{ta}　{pk}　{tb}\r\n比分：{bf_a} - {bf_b}　　{state}\r\n\r\n';
            }

            setPost(board_code_tmp, zhibo_board_reply);

        });
    }

    function setPost(board_code_tmp, zhibo_board_reply)
    {
        var board_code = '';
        updateBoardData();
        $.each(zhibo_board_data, function(pi, pd){
            if(countChecked(pd.items)==0) return;
            var title = cutTitle(pd.title);
            title = title.substring(0,title.lastIndexOf(']')+1);
            board_code += '\r\n{0}\r\n'.format(title);

            $.each(pd.items, function(index, item){
                if(item.checked == 'checked' && item.deleted == 0)
                {
                    board_code += board_code_tmp.format(item);
                }
            });
        });

        $(zhibo_board_reply).val(board_code);
    }

    function countChecked(items){
        var count = 0;
         $.each(items, function(index, item){
            if(item.deleted == 1) return;
            if(item.checked == 'checked')
            {
                count ++;
            }
        });

        return count;
    }

    function countItem(items){
        var count = 0;
         $.each(items, function(index, item){
            if(item.deleted == 1) return;
            count ++;
        });

        return count;
    }

    function cutTitle(title)
    {
        if(typeof(title) != 'string') return '';
        title = title.replace(/\s*/g,'').replace(/(\[開盤\])/,'');;
        title = title.substring(0,title.indexOf('下注'));
        return title;
    }

    //更新计分板数据
    function updateBoardData()
    {
        //不重置，保证加入多盘信息
        //zhibo_board_data = [];
        //console.log(JSON.stringify(zhibo_board_data));
        zhibo_board_data = JSON.parse(getBoardData());
        var data = {};
        var new_index = [];
        $.each($('#zhibo_board .item:not(".pk")'), function(index, item){
            data = {};
            data.pi = $(item).attr('pi');
            data.index = $(item).attr('i');
            data.ta = $('input[name=ta]', item).val();
            data.tb = $('input[name=tb]', item).val();
            data.pk = $('input[name=pk]', item).val();
            data.state = $('input[name=state]', item).val();
            data.bf_a = $('input[name=bf_a]', item).val();
            data.bf_b = $('input[name=bf_b]', item).val();
            data.tid = $('input[name=tid]', item).val();
            data.checked = $('input:checkbox', item).get(0).checked ? 'checked' : '';

            new_index.push('{0}_{1}'.format(data.pi, data.index));

            //zhibo_board_data.push(data);

            //console.log(typeof(data.bf_a) + '_____' + (zhibo_board_data[data.pi].items[data.index] == null));

            if(typeof(data.bf_a) == 'string')
            {
                zhibo_board_data[data.pi].items[data.index].bf_a = data.bf_a;
                zhibo_board_data[data.pi].items[data.index].bf_b = data.bf_b;
                zhibo_board_data[data.pi].items[data.index].state = data.state;
                zhibo_board_data[data.pi].items[data.index].checked = data.checked;
            }
        });

        //var new_board = [];
        //new_board = clone(zhibo_board_data);
        $.each(zhibo_board_data, function(i, d){
            $.each(d.items, function(index, item){
                if(!new_index.includes('{0}_{1}'.format(i,index)))
                {
                    item.deleted = 1;
                }
            });
        });

        setBoardData(zhibo_board_data);
    }

    function clone(obj)
    {
        return JSON.parse(JSON.stringify(obj));
    }


    function setPingFenData(data)
    {
        if(typeof(data) != 'string')
        {
            data = JSON.stringify(data);
        }
        var cache_key = 'pf_game_data_' + tid;
        return localStorage.setItem(cache_key, data);
    }

    function getPingFenData()
    {
        var cache_key = 'pf_game_data_' + tid;
        return localStorage.getItem(cache_key);
    }


    //获取计分板缓存数据
    function setBoardData(data)
    {
        if(typeof(data) != 'string')
        {
            data = JSON.stringify(data);
        }
        var cache_key = 'pf_game_data_' + tid;
        cache_key = 'zhibo_data_board';
        return localStorage.setItem(cache_key, data);
    }



    //获取计分板缓存数据
    function getBoardData()
    {
        var cache_key = 'pf_game_data_' + tid;
        cache_key = 'zhibo_data_board';
        return localStorage.getItem(cache_key);
    }

    //提取直播代码（计分板数据） 直播主题表格代码
    function getZhiboCode()
    {
        var postid = 0;
        var fid = 23;
        var month = '';
        var game_name = $('.t.t2 tr.do_not_catch th:first b:first').text().trim();
        if((/[a-zA-z]+:\/\/[^\s]*\.html/).test(localHref)){
            postid = localHref.substring(localHref.lastIndexOf('/')+1, localHref.lastIndexOf('.'));
            var m = localHref.match(/\/(\d{4})\/(\d{2})\/(\d{6,})\.html/);

            month = m[1];
            fid = m[2];
        }

        if((/read.php\?tid=(\d*)*/).test(localHref)){
            postid = getQueryVariable('tid');
        }

        var title = $('#conttpc').prevAll('h4.f16').text();
        var data = [];
        var idx = {};

        $('#zhibo_code').css({width:$('#t_like').width()});


        var trs = $('#conttpc table tr').not($('#conttpc table tr:has("td[colspan]")'));
        $.each($(trs).eq(0).find('td'), function(i,item) {
            //console.log($(item).text());
            var tmp_head = $(item).text().trim();
            /*
            console.log(tmp_head.match(/让球/));
            switch(tmp_head)
            {
                case '比賽時間':
                case '比赛时间':
                    idx.time = i;
                    break;
                case '賽事':
                case '赛事':
                    idx.lm = i;
                    break;
                case '主隊':
                case '主队':
                    idx.ta = i;
                    break;
                case '客隊':
                case '客队':
                    idx.tb = i;
                    break;
                case '讓球':
                case '让球':
                    idx.pk = i;
                    break;
            }*/
            var key = eval('/'+ G.get('zhiboCodeLM') +'/');
            //idx.lm = -1;
            if(tmp_head.match(key) != null)
            {
                idx.lm = i;
            }

            key = eval('/'+ G.get('zhiboCodeEvent') +'/');
            //idx.event = -1;
            if(tmp_head.match(key) != null)
            {
                idx.event = i;
            }

            key = eval('/'+ G.get('zhiboCodeTime') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.time = i;
            }
            key = eval('/'+ G.get('zhiboCodeTa') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.ta = i;
            }
            key =eval('/'+ G.get('zhiboCodePK') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.pk = i;
            }

            key =eval('/'+ G.get('zhiboCodeTb') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.tb = i;
            }
        });


        //console.log(idx.lm);

        //不重置，支持多盘数据，需要手动删除或清空
        //zhibo_board_data = JSON.parse(localStorage.getItem('zhibo_data_board'));
        var board = {};
        board.tid = postid;
        board.fid = fid;
        board.month = month;
        board.title = title;
        board.duidu = localTitle.match(/對賭|对赌"/) != null;
        board.zhuang = '';
        board.cai = '';
        board.items = [];

        if(board.duidu)
        {
           //console.log($('#conttpc').html());
           //var mc = $('#conttpc').text().match(/(楼主|庄家)走\s{0,}(\S*?)\s{0,}[，|,]/);
           var mc = $('#conttpc').html().match(/下注(球|选)(\S)(：|:)(?<team>\S*?)<br/);
           
           if(mc != null)
           {
               board.cai = mc.groups['team'].trim();
               //console.log(board.cai);
           }

        }
        //console.log(board.zhuang);

        $.each(trs, function(i,item) {

            var game = {};
            var $td = $('td',item);
            if($td.length<3) return;
            game.time = i == 0 ? '开赛时间' : (new Date()).format('yyyy/MM/dd 待定'+i);
            game.bf = i == 0 ? '比分' : '比分'+i;
            game.win = i == 0 ? '赢盘球队' : '赢盘'+i;

            if(idx.time > -1)
            {
                game.time = $td.eq(idx.time).text().trim();
            }

            if(idx.lm > -1)
            {
                game.lm = $td.eq(idx.lm).text().trim();
            }
            else
            {
                game.lm = '';
            }
            if(idx.event > -1)
            {
                game.event = $td.eq(idx.event).text().trim();
            }
            game.ta = $td.eq(idx.ta).text().trim();
            game.pk = $td.eq(idx.pk).text().trim();
            game.tb = $td.eq(idx.tb).text().trim();

            //console.log(JSON.stringify(board));
            //console.log(JSON.stringify(game));
            if(board.cai.length > 0 && game.ta!='主隊')
            {
                board.zhuang = board.cai==game.ta ? game.tb : game.ta;

                game.ta = (game.ta==board.zhuang ? "[庄]" : "") + game.ta;
                game.tb = (game.tb==board.zhuang ? "[庄]" : "") + game.tb;
            }

            game.tid = '{0}_{1}'.format(postid,i);
            game.bf_a = '';
            game.bf_b = '';
            game.state = '';
            game.checked = 'checked';
            game.deleted = 0;

            if(game.lm+game.ta == '') return;
            data.push(game);

            if(i > 0)
            {
                board.items.push(game);

                //var new_data = zhibo_board_data;
                /*
                if(zhibo_board_data.length == 0)
                {
                    zhibo_board_data.push(board);
                }
                else
                {
                    console.log(zhibo_board_data.length);
                    $.each(zhibo_board_data, function(bi, bd){
                        if(bd.tid == board.tid)
                        {
                            //console.log(bd.tid == board.tid);
                            //zhibo_board_data.splice(bi,1);
                        }
                    });


                    zhibo_board_data.push(board);
                }
                */
                //zhibo_board_data = new_data;
                //console.log(JSON.stringify(zhibo_board_data));
            }
        });

        //console.log(JSON.stringify(board));
        zhibo_board_data = JSON.parse(getBoardData());

        var new_data = [];
        $.each(zhibo_board_data, function(bi, bd){
            //console.log(bd.tid + '___' + bi);
            //console.log(bd.tid == board.tid);
            if(bd.tid != board.tid)
            {
                new_data.unshift(bd);
                //delete zhibo_board_data[bi];
                //zhibo_board_data.splice(bi, 1);
                //console.log(JSON.stringify(zhibo_board_data[bi]));
            }
        });

        new_data.push(board);


        /*
        data.sort((a,b)=>{
            return a.tid-b.tid;
        });
        */
        new_data.sort((a,b)=>{
            return a.tid-b.tid;
        });

        var cache_key = 'zhibo_data_' + postid;
        localStorage.setItem(cache_key, JSON.stringify(data));
        cache_key = 'zhibo_data_board';
        localStorage.setItem(cache_key, JSON.stringify(new_data));
        //console.log(cache_key+'_2');

        var html = '';//'[align=center][b][color=red][size=4]{0}[/size][/color][/b][/align]\r\n'.format(title);

        let title_code = '[align=center][b][color=red][size=4]{0}[/size][/color][/b]';
        if(G.get('zhiboLinkEnable'))
        {
            title_code += '\r\n[tid={1}-{2}-{3}]{4}[/tid]';
        }

        title_code += '[/align]';

        title_code = title_code.format(title.replace('【看清规则后下注、乱入者按恶意灌水处理】',''), board.tid, board.fid,board.month, game_name);
        title_code = title_code.replace('[其他] ','').replace('[開盤]','').replace('【无关队伍误入请及时申请删除】','').replace('【看清规则后下注、乱入者按恶意灌水处理】','');

        let key = eval('/'+ G.get('bodanCodeKey') +'/');
        if (key.test(localTitle))
        {
            html += '[table=100%][tr]';
            //html += '[td=4,1][align=center][b][color=red][size=4]{0}[/size][/color][/b]\r\n[tid={1}-{2}-{3}]{4}[/tid][/align][/td][/tr]'.format(title.replace('【看清规则后下注、乱入者按恶意灌水处理】',''), board.tid, board.fid,board.month, game_name); //
            html += '[td=4,1]{0}[/td][/tr]'.format(title_code);
            html += '[/tr][tr]';
            //post.content += '[td][align=center][b][color=purple][size=4]賽事[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]比賽時間[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]比賽内容[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]结果[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]赔率[/size][/color][/b][/align][/td]';
            html += '[/tr]';

            let template1 = '[tr]';//\r\n
            //template1 += '[td][img]{img}[/img][/td]';
            template1 += '[td][align=center][b][color=blue][size=3]{time}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=green][size=3]{lm}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=red][size=3]{bf}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=blue][size=3]{win}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[/tr]'; //

            var bet_html = $('#conttpc').html().replaceAll('>','>\r\n');
            var re_bet=/下注(球|选)(\S)(：|:)\s*(?<team>.*?)<br/g;

            //console.log(mp);

            var ms = bet_html.match(re_bet);

            let imgs = $('#conttpc img[ess-data]');

            let fix_num = (imgs.length - ms.length);

            $.each(ms, function(k, m){

                let item = {};
                //item.img = $(imgs).eq(k+fix_num).attr('ess-data');
                item.time = '时间'+(k+1);
                item.lm = '赛事'+(k+1);
                item.bf = '结果'+(k+1);
                item.win = '赔率'+(k+1);

                html += template1.format(item);
            });

            let img_code = '';
            $.each(imgs, function(k,img_item){
                let img = $(img_item).attr('ess-data').trim();
                if(img != '')
                {
                    img_code += '[img]{0}[/img]'.format(img);
                }
            });

            html += '[tr]';
            html += '[td=4,1]{0}[/td][/tr]'.format(img_code); //
            html += '[/tr]';

            /*
            $('#conttpc img[ess-data]').each(function(i, img)
            {
                let item = {};
                item.img = $(img).attr('ess-data');
                item.bf = '比分'+(i+1);
                item.win = '赔率'+(i+1);

                html += template1.format(item);
            });
            */

            html += '[/table]'
        }
        else if(/串一/.test(localTitle))
        {
            html += '[table=100%][tr]';
            //html += '[td=7,1][align=center][b][color=red][size=4]{0}[/size][/color][/b]\r\n[tid={1}-{2}-{3}]{4}[/tid][/align] [/td][/tr]'.format(title.replace('【看清规则后下注、乱入者按恶意灌水处理】',''), board.tid, board.fid,board.month, game_name); //
            html += '[td=7,1]{0}[/td][/tr]'.format(title_code);
            html += '[/tr][tr]';
            html += '[td][align=center][b][color=purple][size=4]比賽時間[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]賽事[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]主隊[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]平局[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]客隊[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]比分[/size][/color][/b][/align][/td]';
            html += '[td][align=center][b][color=purple][size=4]贏盤隊[/size][/color][/b][/align][/td]';
            html += '[/tr]';

            let template1 = '[tr]';//\r\n
            template1 += '[td][align=center][b][color=blue][size=3]{time}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=orange][size=3]{lm}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=green][size=3]{ta}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=green][size=3]{pk}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=green][size=3]{tb}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=red][size=3]{bf}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=blue][size=3]{win}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[/tr]'; //
            $.each(data, function(i, item){
                if (i==0) return;
                html += template1.format(item);
            });

            html += '[/table]'
        }
        else
        {

            let count_td = 8;
            idx.lm = isNaN(idx.lm) ? -1 : idx.lm;
            idx.event = isNaN(idx.event) ? -1 : idx.event;
            count_td = count_td + idx.event + idx.lm;

            //console.log('----');
            //console.log(count_td);

            html += '[table]'; //\r\n
            //html += '[tr][td='+ count_td +',1] [align=center][b][color=red][size=4]{0}[/size][/color][/b]\r\n[tid={1}-{2}-{3}]{4}[/tid][/align] [/td][/tr]'.format(title.replace('[其他] ','').replace('[開盤]','').replace('【无关队伍误入请及时申请删除】','').replace('【看清规则后下注、乱入者按恶意灌水处理】',''), board.tid, board.fid,board.month, game_name); //
            html += '[tr][td='+ count_td +',1]{0}[/td][/tr]'.format(title_code);

            let template1 = '[tr]';//\r\n
            template1 += '[td][align=center][b][color=green][size=3]{time}\r\n[/size][/color][/b][/align][/td]';
            if(idx.lm > -1){
                template1 += '[td][align=center][b][color=orange][size=3]{lm}\r\n[/size][/color][/b][/align][/td]';
            }
            if(idx.event > -1){
                template1 += '[td][align=center][b][color=blue][size=3]{event}\r\n[/size][/color][/b][/align][/td]';
            }
            template1 += '[td][align=center][b][color=green][size=3]{ta}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=red][size=3]{pk}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=green][size=3]{tb}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=red][size=3]{bf}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[td][align=center][b][color=blue][size=3]{win}\r\n[/size][/color][/b][/align][/td]';
            template1 += '[/tr]'; //
            $.each(data, function(i, item){
                if (i==0)
                {
                    html += template1.replace(/\[color\=.*?\]/g, '[color=purple]').format(item);
                }
                else
                {
                    html += template1.format(item);
                }
            });

            html += '[/table]'
        }


        $('#zhibo_code').val(html).show();
        GM_setClipboard(html,'text');

        message('神秘代码已提取，试试Ctrl+V。<br />计分板数据已更新，直播可用。', 3);
        //console.log(html); //JSON.stringify(data)
    }

    function postFix(){
        if (localHref.match(/htm_(data|mob)\S*\.html|read\.php\?/) != null ){

            isMob = $('.banner h3').length>0;

            var $t_like = $('.t_like');
            if($t_like.length>0)
            {
                var $t_like_top = $t_like.offset().top;
                //console.log($t_like.offset());
                //点赞浮动
                if(G.get('likeFixEnable'))
                {
                    $t_like.css({position: "fixed", top: 580, right: 20});
                }
                $(window).scroll(function(event){

                });

                $(window).resize(function() {
                    //$t_like.css({left: $('#conttpc').offset().left-135});
                });
            }



            var save_code_btn = '<input type="button" class="s1" id="save_code" value="保存">';
            var set_code_btn = ' <input type="button" class="s1" id="set_code" value="载入">';
            var open_board_btn = ' <input type="button" class="s2" style="margin-left:20px;" id="open_board" value="计分板">';
            var content = $('textarea[name=atc_content]');


            //$('#atc_title').parent().html('<textarea name="atc_title" class="input" style="font: 14px Tahoma; padding-left:2px;height:60px;width:100%" id="atc_title">'+$('#atc_title').val()+'</textarea>');

            if(content != null)
            {
                $('textarea[name=atc_content]').prev('div').append(save_code_btn).append(set_code_btn).append(open_board_btn);
                //$('input[name=Submit]').parent().append(open_board_btn);

                $('#open_board').click(function() {
                    zhiboBoard();
                });

                $('#save_code').click(function(){
                    var code = $(content).val();
                    if(code != null)
                    {
                        var code_cache = localStorage.getItem('reply_code');
                        if(code_cache != null && code_cache != '' && code_cache != code)
                        {
                             if (confirm("更新已保存代码?")==true) {
                                 localStorage.setItem('reply_code', code);
                             }
                        }
                        else
                        {
                            localStorage.setItem('reply_code', code);
                        }
                    }
                });

                $('#set_code').click(function(){
                    var code = localStorage.getItem('reply_code');

                    //var content = $('textarea[name=atc_content]');

                    //console.log($(content).val());

                    if(code != null)
                    {
                        var txt = $.trim($(content).val());
                        $(content).val((txt != null ? txt + '\r\n' : '') + code);
                    }
                });
            }

            $('.post_comm_face').each(function(){
                var $li = $(this).parent();
                //var tpc_author = $li.next().find('span a:first').text();
                //console.log($li.html());
                var tpc_author = isMob ? $li.next().find('.gray:first').text() : $li.next().find('span[style] a:first').text();
                $li.html('<a href="/@' + tpc_author + '" target="_blank">' + $li.html() + '</a>');
            })

            $('body .t').each(function(i, item){
                var tpc_content = $.trim($('.tpc_content', this).text());
                var tpc_auther_html = $('.tr1 th:first b:first', this);
                var tpc_author = $.trim($('.tr1 th:first b:first', this).text()).replace(/\s\S*/,'');
                var tpc_floor = $.trim($('.tipad .s3', this).text()).replace(/[^0-9]/ig,'');

                //$(tpc_auther_html).html()
                if(tpc_author){
                    var link = '<a href="/@' + tpc_author + '" target="_blank">' + tpc_author + '</a>';
                    var tmp = $('.tr1 th:first b:first', this).html();
                    tmp = tmp.replace(tpc_author, link);
                    $('.tr1 th:first b:first', this).html(tmp);
                }

                if($.inArray(tpc_floor, G.get('whiteFloor').split(','))>-1)
                {
                    return true;
                }

                if($.inArray(tpc_author, whiteList)>-1)
                {
                    return true;
                }
                //console.log(i);

                if($.inArray(tpc_author, blackPostList)>-1 && tpc_author.length>0 && i>1)
                {
                    $(this).remove();
                }

                if($('.post_comm', this).length>0)
                {
                    return true;
                }

                if($.inArray(tpc_content, spamList)>-1 && localTitle.match('博彩區') == null)
                {
                    $(this).remove();
                }
            });


            $('.tpc_cont').parent().each(function(){
                var tpc_content = $.trim($('.tpc_cont', this).text());
                var tpc_author = $('.tpc_detail:first li', this).html().replace(/(\S*)<.*/,'$1');
                //tpc_author = tpc_author.substring(0, tpc_author.indexOf('#'));
                //console.log(tpc_author);

                if(tpc_author){
                    var link = '<a href="/@' + tpc_author + '" target="_blank">' + tpc_author + '</a>';
                    var tmp = $('.tpc_detail:first li', this).html();
                    tmp = tmp.replace(tpc_author, link);
                    $('.tpc_detail:first li', this).html(tmp);
                }


                if($.inArray(tpc_author, whiteList)>-1)
                {
                    return true;
                }

                if($('.post_comm', this).length>0)
                {
                    return true;
                }

                if($.inArray(tpc_content, spamList)>-1)
                {
                    $(this).next('.tpc_line').remove();
                    $(this).prev('.tpc_face').remove();
                    $(this).prev('a[name]').remove();
                    $(this).remove();
                }
            });
        }
    }

    function listFix() {
        if (localHref.match(/thread0806\.php\?fid=/) != null ){
            $('#tbody tr').each(function(){
                var poster = $.trim($('a.bl', this).text());

                if($.inArray(poster, blackList)>-1)
                {
                    //console.log(poster);
                    $(this).remove();
                }

                if(/博彩區/.test(localTitle))
                {
                    let html = $('td:eq(2) [data-timestamp]', this).attr('data-timestamp');//.attr('title');//.text().trim();
                    if(html)
                    {
                        html = html.replace('s','');

                        let ts = parseInt(html)*1000;
                        let dt = new Date(ts);
                        html = judgeTime(dt);

                        if(/(今天|昨天)/.test(html))
                        {
                            //let txt = /(今天)/.test(html)?'今天':'昨天';
                            let txt_css = /(今天)/.test(html)?'s5':'s3';
                            $('td:first', this).html('<span class="'+ txt_css +'">'+ html +'</span>');
                        }
                    }
                }
            });


            /*
            $('td:eq(2):contains("今")',$('#tbody tr')).each(function(){
                $('td:first',$(this).parent().parent()).text('今天');
            });
            */

            $('.list.t_one').each(function(){
                var poster = $.trim($('.f10.fl', this).text());
                poster = poster [0];
                if($.inArray(poster, blackList)>-1)
                {
                    $(this).remove();
                }
            });
        }
    }


    function get_today_thread() {
        //$('#last[href^="post.php"').length
        $('#last[href^="post.php"').parent().prepend('<a href="javascript:void(0);" class="last" id="get_thread"> 選取主題</a>');
        $('#get_thread').click(function() {
            let txt = '';
           if(page == 1)
           {
               txt = `序号\t贊\tTid\t标题\t作者\t时间\t回復\r\n`;
           }

            $('#tbody tr.tr3').each(function(i,item){
                let $this = $(item);
                let thread = {};
                thread.count_like = 0;
                thread.count_reply = 0;
                thread.title = '';
                thread.tid = 0;
                thread.post_time = '';
                thread.author = '';

                let $td = $this.find('td').eq(1).find('h3');
                thread.title = $td.text();
                thread.tid = $td.find('a').attr('id').replace('t','');

                $td = $this.find('td').eq(0)
                thread.count_like = $td.text().trim().replace('.::','0');
                $td = $this.find('td').eq(3)
                thread.count_reply = $td.text().trim().replace('.::','0');

                $td = $this.find('td').eq(2);
                thread.author = $td.find('a').text();
                thread.post_time = $td.find('span[data-timestamp]').attr('title');
                if(thread.post_time)
                {
                    thread.post_time = thread.post_time.replace('今天','').replace('昨天','').replace('  ',' ');
                }


                txt += `${i+1}	${thread.count_like}	${thread.tid}	${thread.title}	${thread.author}	${thread.post_time}	${thread.count_reply}\r\n`;

                //console.log(txt);
            });


            GM_setClipboard(txt,'text');

            message('主体信息取到剪贴板，当前第 {0} 页'.format(page), 5);
        });
    }

    function copy_bets(){

        $('.post_comm').remove();

        let bets_copy = '';

        let reg_date_time = /(?<post_time>\d{1,4}-\d{1,2}-\d{1,2}\s{1,}\d{1,2}:\d{1,2})/

        let limit_time = '';
        if(reg_date_time.test(localTitle))
        {
            limit_time = reg_date_time.exec(localTitle)[1].trim();
        }
        //console.log(limit_time);

        let copy_head = '楼层	ID	下注点数	下注场数	得分	队伍编号	提示	威望	級別	注册	评分	Tips	By';
        let copy_tample = '{floor}	{author}	{bet_points}	{bet_count}	{points}	{team}	{tips}	{v}	{group}	{reg}	{score}	{remark}	{by}';//'{0}	{1}	{2}\r\n';
        $.each($("div[id^='cont']:not(#conttpc)"), function(i, bet) {
            var ratio = 0;
            var points = 0;
            var bet_points = 0;

            let points_item = {};
            points_item.author = $('.r_two b:first', $(bet).parent().parent()).text().replace('[樓主]','');
            points_item.floor = $('.tipad .s3', $(bet).parent().parent().parent()).text();




            points_item.post_time = '';
            points_item.bet_points = 0;
            points_item.bet_count = 0;
            points_item.tips = '';
            points_item.points = 0;
            points_item.team = '';
            points_item.v = '';
            points_item.reg = '';
            points_item.score = 0;
            points_item.remark = '';
            points_item.by = '';

            //console.log($(bet).parent().html());


            let tips = $('.tips', $(bet).parent()).text().trim();
            let mp;
            //console.log(tips);
            if(tips)
            {
                if(/本帖最近評分記錄/.test(tips))
                {
                    //console.log(tips);
                }
                else
                {
                    tips = tips.replaceAll(/\s+|\r+|\n+| +/g, ' ');
                    //mp = tips.match(/(?<remark>\S+)(.)By：(?<by>\S+)/);
                    if(tips)
                    {
                        tips = tips.replaceAll(/\s+|\r+|\n+| +/g, ' ');
                        if(/本帖最近評分記錄/.test(tips))
                        {
                            //console.log(tips);
                        }

                        if(/By：/.test(tips))
                        {
                            let reg_tmp = /(?<remark>\S+)(.)By：(?<by>\S+)/;
                            mp = tips.match(reg_tmp);
                            if(mp != null)
                            {
                                points_item.remark = mp.groups['remark'].trim();
                                points_item.by = mp.groups['by'].trim();
                                //console.log(tips);
                            }
                        }
                    //console.log(tips);
                    }
                }
            }

            tips = $('.tips:last', $(bet).parent().parent().parent()).text().trim();
            //console.log(tips);
            if(tips)
            {
                if(/本帖最近評分記錄/.test(tips))
                {
                    tips = tips.replace('威望',' 威望');
                    //console.log(tips);

                    let reg_tips = /威望:(?<points>(\+|\-)\d{1,})\((?<by>\S+)\)/g;
                    mp = tips.match(reg_tips);
                    $.each(mp, function(k, m){
                        let mc = m.match(/威望:(?<points>(\+|\-)\d{1,})\((?<by>\S+)\)/)
                        if(mc != null)
                        {
                           points_item.score += parseInt(mc.groups['points'].trim());

                            points_item.by += points_item.by != '' ? '，' : '';
                            points_item.by += mc.groups['by'].trim();
                        }
                        //$.each(mc, function(kc, mcc){
                            //console.log(mcc);
                            //points_item.points += parseInt(mcc.groups['points'].trim());
                            //points_item.by += mcc.groups['by'].trim();
                        //});
                    });

                    let tips_tmp = tips.replace('本帖最近評分記錄：','');
                    tips_tmp = tips_tmp.replace(reg_tips,'').trim();
                    if(tips_tmp != '')
                    {
                        points_item.remark += points_item.remark != '' ? '，' : '';
                        points_item.remark += tips_tmp;
                    }
                }
            }

            let tipad = $('.tipad', $(bet).parent().parent().parent()).text();
            mp = tipad.match(reg_date_time);
            if(mp != null)
            {
                points_item.post_time = mp.groups['post_time'].trim();
            }

            if(limit_time != '' && points_item.post_time != '')
            {
                //console.log(points_item.post_time + limit_time);
                //console.log('{0} / {1}/ {2}'.format(points_item.post_time, limit_time, points_item.post_time>limit_time));

                if(points_item.post_time > limit_time)
                {
                    let date1 = new Date(points_item.post_time);
                    let date2 = new Date(limit_time);
                    let seconds = date1.getTime() - date2.getTime();
                    if(seconds > 5*60*1000)
                    {
                        points_item.tips += '超时下注';
                    }
                }
            }


            let points_tips = $('.points_tips', $(bet));
            if($(points_tips).length > 0)
            {
                points_item.points = $(points_tips).text();
            }

            mp = points_item.floor.match(/(?<floor>\d+)/);
            if(mp != null)
            {
                points_item.floor = parseInt(mp.groups['floor'].trim());
            }

            var bet_html = $(bet).html().replaceAll('>','>\r\n');
            
            var points_bet=/(下注点数|下註點數|點數|点数)(：|:)\s*(?<points>\d+)/;

            mp = bet_html.match(points_bet);
            if(mp != null)
            {
                bet_points = parseInt(mp.groups['points'].trim());
                points_item.bet_points = bet_points;
            }


            //无下注点数情况下冲刺赛模式
            let key = eval('/'+ G.get('suanfenCCScoreKey') +'/');

            if(key.test(localTitle) && bet_points==0)
            {
                let cc_points = parseInt(G.get('suanfenCCScorePoints'));

                if(!isNaN(cc_points))
                {
                    bet_points = cc_points;
                    points_item.bet_points = bet_points;
                }
            }

            if(/重新編輯/.test(bet_html))
            {
                points_item.tips += points_item.tips == '' ? '' : '、';
                points_item.tips += '重新編輯';
            }

            bet_html = $(bet).html().replaceAll('\t','').replaceAll('\r','').replaceAll('\n','');
            //bet_html = bet_html.replaceAll('<br>','\r\n').replaceAll('<br/>','\r\n').replaceAll('<br />','\r\n');
            bet_html = bet_html.replace(/<font color="gray">(.*)重新編輯 ]<\/font>/g,'');
            bet_html = bet_html.replaceAll('&nbsp;','');
            bet_html = bet_html.replaceAll(":","：").replaceAll(' ：','：');

            if(/编号/.test(bet_html))
            {
                if(!(/编号：/.test(bet_html)))
                {
                    //处理编号格式不对问题
                    bet_html = bet_html.replace('编号','编号：');
                }
                points_item.team = /编号：([^<]*)/.exec(bet_html)[1].trim();

                //console.log(/队伍编号：(.*)/.exec(bet_html));
            }
            else if (/队伍名字/.test(bet_html))
            {
                points_item.team = /队伍名字：([^<]*)/.exec(bet_html)[1].trim();
            }

            if(/竞猜/.test(bet_html))
            {
                bet_html = bet_html.replace('尾号','').replace('数字','');
                points_item.team = /竞猜：([^<]*)/.exec(bet_html)[1].trim();
            }


            let author_html = $('.r_two',$(bet).parent().parent().parent()).text().trim().replace(/\n/,'');
            author_html = author_html.replace(/^[\r\n\s\f\t\v\o]+/gm, "");

            //console.log(author_html);

            let author_info = {};
            ///級別：(.*)/;
            author_info.name = points_item.author;


            if(/級別：(.*)/.test(author_html))
            {
                author_info.group = /級別：(.*)/.exec(author_html)[1];
                author_info.p = /發帖：(.*)/.exec(author_html)[1];
                author_info.v = /威望：(.*)/.exec(author_html)[1];
                author_info.u = /金錢：(.*)/.exec(author_html)[1];
                author_info.g = /貢獻：(.*)/.exec(author_html)[1];
                author_info.r = /註冊：(.*)/.exec(author_html)[1];
                author_info.c = /認證：(.*)/.test(author_html) ? /認證：(.*)/gs.exec(author_html)[1].trim() : "";
                author_info.c =author_info.c.replaceAll(" ","").replaceAll('\t','').replaceAll('\r','').replaceAll('\n','');
            }

            points_item.v = author_info.v.replace(' 點','');
            points_item.group = author_info.group;
            points_item.reg = author_info.r;


            //超级别验证
            if(bet_points>0)
            {
                if(!check_level(points_item.group, bet_points))
                {
                    points_item.tips += points_item.tips == '' ? '' : '、';
                    points_item.tips += '超級別下注';
                    console.log('{author} {floor} 超級別下注'.format(points_item));
                }
            }


            if(G.get('betsCopyOnlyBets'))
            {

                let copy_tample = '{author}\r\n';

                /*
級別：精靈王 ( 12 )
發帖：256
威望：822 點
金錢：200483 USD
貢獻：20083 點
赞(0) | 資料 短信 推薦 編輯
                */

                //bets_copy += copy_tample.format(points_item);
               

                bet_html = $(bet).html().replaceAll('\t','').replaceAll('\r','').replaceAll('\n','');
                bet_html = bet_html.replaceAll('<br>','\r\n').replaceAll('<br/>','\r\n').replaceAll('<br />','\r\n');
                bet_html = bet_html.replace(/<div class="points_tips">\S*<\/div>/g,"");
                bet_html = bet_html.replace(/<font color="gray">(.*)重新編輯 ]<\/font>/g,'');
                bet_html = bet_html.replaceAll('&nbsp;','');
                bet_html = bet_html.replaceAll(":","：").replaceAll(' ：','：');


                //提取竞猜信息
                if(/世界杯活动正式报名帖/.test(localTitle)) {
                    let sign_info ={};
                    sign_info.author = points_item.author;
                    sign_info.floor = points_item.floor;

                    sign_info.v = author_info.v;
                    sign_info.group = author_info.group;
                    sign_info.reg = author_info.r;
                    sign_info.c = author_info.c;
                    sign_info.id = '';
                    sign_info.team = '';
                    sign_info.id2 = '';
                    sign_info.p1 = '';
                    sign_info.p2 = '';
                    sign_info.p3 = '';
                    sign_info.p4 = '';
                    sign_info.p5 = '';
                    //console.log(bet_html);

                    //bet_html = bet_html.replaceAll(":","：").replaceAll(' ：','：');
                    if(/参赛ID：(.*)/.test(bet_html))
                    {
                        sign_info.id = /参赛ID：(.*)/.exec(bet_html)[1].trim();
                        sign_info.team = /参赛队伍名：(.*)/.exec(bet_html)[1].trim();
                    }
                    else
                    {
                        console.log(bet_html);
                    }
                    if(/备用ID：(.*)/.test(bet_html))
                    {
                        sign_info.id2 = /备用ID：(.*)/.exec(bet_html)[1].trim();
                    }

                    if(/队员1：(.*)/.test(bet_html))
                    {
                        if(/队员1：(.*)/.exec(bet_html)[1])
                        {
                            sign_info.p1 = /队员1：(.*)/.exec(bet_html)[1].trim();
                            sign_info.p2 = /队员2：(.*)/.exec(bet_html)[1].trim();
                            sign_info.p3 = /队员3：(.*)/.exec(bet_html)[1].trim();
                            sign_info.p4 = /队员4：(.*)/.exec(bet_html)[1].trim();
                        }
                    }
                    if(/队员5：(.*)/.test(bet_html))
                    {
                        sign_info.p5 = /队员5：(.*)/.exec(bet_html)[1].trim();
                    }

                    if(sign_info.floor<=32)
                    {
                        bets_copy += '{floor}	{team}	{author}	{id2}	{p1}	{p2}	{p3}	{p4}	{p5}'.format(sign_info);
                    }
                    else
                    {
                        bets_copy += '{floor}	{author}	{v}	{id}	{id2}	{team}	{group}'.format(sign_info);
                    }
                }
                else if (/正式报名帖/.test(localTitle) && /冲刺赛/.test(localTitle)){
                    let sign_info ={};
                    sign_info.author = points_item.author;
                    sign_info.floor = points_item.floor;

                    sign_info.v = author_info.v.replace(' 點','');
                    sign_info.group = author_info.group;
                    sign_info.c = author_info.c;
                    sign_info.reg = author_info.r;
                    sign_info.id = '';
                    sign_info.team = '';
                    sign_info.id2 = '';
                    sign_info.p1 = '';
                    sign_info.p2 = '';
                    sign_info.p3 = '';
                    sign_info.p4 = '';
                    sign_info.p5 = '';
                    //console.log(bet_html);

                    bet_html = bet_html.replaceAll(":","：").replaceAll(' ：','：');
                    if(/参赛ID：(.*)/.test(bet_html))
                    {
                        sign_info.id = /参赛ID：(.*)/.exec(bet_html)[1].trim();
                    }
                    else
                    {
                        console.log(bet_html);
                    }
                    if(/备用ID：(.*)/.test(bet_html))
                    {
                        sign_info.id2 = /备用ID：(.*)/.exec(bet_html)[1].trim();
                    }

                    bets_copy += '{floor}	{author}	{id2}	{v}	{c}'.format(sign_info);
                }
                else
                {
                    //console.log(author_info.name + ' ' + points_item.author);
                    bets_copy += '{name}\r\n級別：{group}\r\n發帖：{p}\r\n威望：{v}\r\n金錢：{u}\r\n貢獻：{g}\r\n認證：{c}\r\n'.format(author_info);
                    bets_copy += bet_html;
                    bets_copy += '\r\n';
                    bets_copy = bets_copy.replace(/^[\r\n\s\f\t\v]+/gm, "");

                    let tipad = $('.tipad', $(bet).parent().parent().parent()).text().replaceAll('\r','').replaceAll('\n','').replaceAll('\t','');
                    bets_copy += tipad;
                }
            }
            else
            {
                let bets_copy_item = '';
                let re_bet= /((下注|站邊)(球|选)\S：|:)(\s*)(?<team>[^<]*)/g;// /(\d+)\.(\S*?)(：|:)(\s*)(?<team>.*)/g;

                if(/竞猜|投票/.test(localTitle))
                {
                    re_bet= /(\d+)\.(\S*?)(：|:)(\s*)(?<team>[^<]*)/g;// /(\d+)\.(\S*?)(：|:)(\s*)(?<team>.*)/g;
                }
                var ms = bet_html.match(re_bet);

                $.each(ms, function(k, m){
                    //console.log(m + ' ' + m.match(/(：|:)\s*(?<team>.*)/));
                    let mc = m.match(/((\S*?)\S：|:)(\s*)(?<team>[^<]*)/);//m.match(/(下注(球|选)\S：|:)(\s*)(?<team>[^<]*)/);//m.match(/\d+\.(\S)(：|:)\s*(?<team>.*)<br/g);

                    //console.log(mc);
                    if(mc != null)
                    {
                        var bet_item = mc.groups['team'].trim().replace('<br>','').trim();
                        bet_item = bet_item.replace(/^[ |&nbsp;]+$/,'');

                        if(bet_item != '') // && !/^[ ]+$/.test(bet_item)
                        {
                            points_item.bet_count += 1;
                        }
                        //if(/^\d+$/.test(bet_item))
                        //{
                        //    bet_item = '\''+bet_item
                        //}
                        bets_copy_item += '	'+ bet_item;
                    }
                    else
                    {
                        bets_copy_item += '	';
                    }

                    if(i==0)
                    {
                        copy_head += '	' + (k+1);
                    }
                });

                bets_copy += copy_tample.format(points_item) + bets_copy_item;
            }

            bets_copy += '\r\n';
        })

        if(page == 1 && G.get('betsCopyHead') && !G.get('betsCopyOnlyBets'))
        {
            bets_copy = '{0}\r\n{1}'.format(copy_head,bets_copy);
        }

        //let page = parseInt(getQueryVariable('page'));
        //page = isNaN(page) ? 1 : parseInt(page);

        GM_setClipboard(bets_copy,'text');

        message('下注信息提取到剪贴板，当前第 {0} 页'.format(page), 5);
    }




    //提取算分信息
    function get_game_info()
    {
        var postid = 0;
        var fid = 23;
        var month = '';
        var game_name = $('.t.t2 tr.do_not_catch th:first b:first').text().trim();

        if((/[a-zA-z]+:\/\/[^\s]*\.html/).test(localHref)){
            postid = localHref.substring(localHref.lastIndexOf('/')+1, localHref.lastIndexOf('.'));
            var m = localHref.match(/\/(\d{4})\/(\d{2})\/(\d{6,})\.html/);

            month = m[1];
            fid = m[2];
        }

        if((/read.php\?tid=(\d*)*/).test(localHref)){
            postid = getQueryVariable('tid');
            tid = postid;

            if((/page=(\d*)*/).test(localHref)){
                page = getQueryVariable('page');
            };
        }

        var title = $('#conttpc').prevAll('h4.f16').text();
        var data = [];
        var idx = {};

        var trs = $('#conttpc table tr').not($('#conttpc table tr:has("td[colspan]")'));
        $.each($(trs).eq(0).find('td'), function(i,item) {

            //$(trs).eq(0);

            var tmp_head = $(item).text().trim();

            var key =eval('/'+ G.get('zhiboCodeLM') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.lm = i;
            }
          
            key =eval('/'+ G.get('zhiboCodeTime') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.time = i;
            }
            key =eval('/'+ G.get('zhiboCodeTa') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.ta = i;
            }
            key =eval('/'+ G.get('zhiboCodePK') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.pk = i;
            }

            key =eval('/'+ G.get('zhiboCodeTb') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.tb = i;
            }
        });


        $.each(trs, function(i,item) {

            var game = {};
            var $td = $('td',item);
            if($td.length<3) return;
            game.time = '';
            game.bf = i == 0 ? '比分' : '比分'+i;
            game.win = '走盘';
            game.half = 0;

            if(idx.time > -1)
            {
                game.time = $td.eq(idx.time).text().trim();
            }
            //game.lm = $td.eq(idx.lm).text().trim();
            game.ta = $td.eq(idx.ta).text().trim();
            game.pk = $td.eq(idx.pk).text().trim();
            game.tb = $td.eq(idx.tb).text().trim();
            game.pi = tid;

            game.tid = '{0}_{1}'.format(postid,i);
            game.bf_a = '';
            game.bf_b = '';
            game.state = '';
            game.checked = '';
            game.half_show = '';
            game.css_a = '';
            game.css_b = '';

            if(game.lm+game.ta == '') return;

            data.push(game);
        });

        var new_data = [];


        var cache_key = 'pf_game_data_' + postid;
        localStorage.setItem(cache_key, JSON.stringify(data));
        get_game_data();
    }

    function get_game_data(){
        if($('#pf_board').length == 0)
        {
            let pf_board_show = GM_getValue('pf_board_show') == 1 ? '' : 'hide';
            let pf_board_show_text = GM_getValue('pf_board_show') == 1 ? '隐藏面板' : '显示面板';

            //console.log(pf_board_show);

            $('body').append(`<div id="pf_board">
    <div class="item_list ${pf_board_show}"></div>
    <div class="tools"><input type="button" id="save_game" value="保存（算分)"> <input type="button" id="hide_tools"
            value="${pf_board_show_text}"> <input type="button" id="clear_pf_data" value="清空数据">
    </div>
</div>`);
        }
        var game_data = getPingFenData();

        if(game_data == '' || game_data == null || game_data.length == 0)
        {
           GM_setValue('auto_settle_up',0);
           get_game_info();
        }

        game_data = JSON.parse(game_data);

        //console.log(data);
        var htm_tmp = '<div id="id_{pi}_{index}" pi="{pi}" i="{index}" class="item">{index}、<span class="tm"><span class="tm_a {css_a}"  i="{index}">{ta}</span> <span class="tm_pk s3 {css_c}"  i="{index}">{pk}</span> <span class="tm_b {css_b}" i="{index}">{tb}</span><span class="check_half {half_show}"><input class="check" {checked} type="checkbox">赢半</span>';
        htm_tmp += '<input type="hidden" value="{ta}" name="ta"><input type="hidden" value="{tb}" name="tb"><input type="hidden" value="{pk}" name="pk"><input type="hidden" value="{tid}" name="tid"><input type="hidden" value="{half}" name="half"><input type="hidden" value="{win}" name="win_team">';
        htm_tmp += '</div>'


        var htm_pk_tmp = '<div class="item pk">{0}</div>';

        var htm = '';
        var key =eval('/'+ G.get('zhiboCodeTa') +'/');
        let tmp_i = 0;
        $.each(game_data, function(index, item){


            tmp_i ++;
            if(item.ta.match(key) != null && item.ta.match('胜') == null)
            {
                tmp_i --;
                return
            }

            item.half_show = item.pk.indexOf('/')>-1 ? '' : 'hide';
            item.css_a = (item.win == item.ta ? 'sred' : '');
            item.css_b = (item.win == item.tb ? 'sred' : '');
            item.css_c = (item.win == item.pk ? 'sred' : '');

            item.index = tmp_i;
            htm += htm_tmp.format(item);
        });

        //htm = '<div class="item_list">{0}</div>'.format(htm);
        //htm += '<div class="tools"><input type="button" id="save_game" value="保存（算分)"> <input type="button" id="hide_tools" value="隐藏面板"> <input type="button" id="clear_pf_data" value="清空数据"><!--input type="button" id="rich_code" value="花里胡哨"> <span class="right"><input type="button" id="clear_data" value="清空数据"> <input type="button" id="close_code" value="关闭"--></div>';

        //console.log(htm);
        $('#pf_board .item_list').html(htm).show();

        $('#hide_tools').click(function() {
            pf_board_toggle();
            //$('#pf_board .item_list').addClass('hide');
        });

        $('#clear_pf_data').click(function() {
            setPingFenData([]);
            GM_setValue('auto_settle_up',0);
            get_game_data();
        });

        /*
        $('#pf_board .tm [class^="tm_"]').click(function (){

           let i = $(this).attr('i');

           if(!$(this).hasClass('sred'))
           {
               $('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i)).removeClass('sred');
               $(this).addClass('sred');
               $('#id_{0}_{1} .tm [name=win_team]'.format(tid, i)).val($(this).text());
           }
           else
           {
               $('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i)).removeClass('sred');
               $('#id_{0}_{1} .tm [name=win_team]'.format(tid, i)).val('走盘');
           }


           save_game();
       });
       */
    }

    function save_game()
    {
        win_item = [];
        new_data = [];
        game_data = JSON.parse(getPingFenData());
        var data = {};
        var new_data = [];
        $.each($('#pf_board .item'), function(index, item){
            data = {};
            data.pi = $(item).attr('pi');
            data.index = $(item).attr('i');
            data.ta = $('input[name=ta]', item).val();
            data.tb = $('input[name=tb]', item).val();
            data.pk = $('input[name=pk]', item).val();
            data.state = $('input[name=state]', item).val();
            data.bf_a = $('input[name=bf_a]', item).val();
            data.bf_b = $('input[name=bf_b]', item).val();
            data.win = $('input[name=win_team]', item).val();
            data.tid = $('input[name=tid]', item).val();
            data.checked = $('input:checkbox', item).get(0).checked ? 'checked' : '';

            data.half = data.checked == '' ? 0 : 1;

            var win = {};
            win.idx = index;
            win.team = data.win;
            win.half = data.half;
            win.ratio = 1;

            var m = win.team.match(/\[\S+\]/);
            //console.log(m);
            if(m != null)
            {
                win.ratio = parseFloat(m[0].replace('[','').replace(']','').trim(),0).toFixed(2);
            }

            data.css_a = (data.win == data.ta ? 'sred' : '');
            data.css_b = (data.win == data.tb ? 'sred' : '');

            win_item.push(win);
            //console.log($('input[name=win_team]', item).val());
            new_data.push(data);
        });

        game_data = new_data;


        game_data = new_data;
        //console.log(JSON.stringify(game_data));
        //console.log(JSON.stringify(game_data));
        setPingFenData(game_data);

        settle_up();
    }


    var points_tips = '<div class="points_tips">{0}</div>';
    //保存
    function settle_up(){

        ///删除点评
        $('.post_comm').remove();
        GM_setValue('auto_settle_up',1);
        //console.log(JSON.stringify(win_item));
        let points_list_copy = '';
        let copy_tample = '{floor}	{author}	{bet_points}	{bet_count}	{points}	{team}	{tips}\r\n';//'{0}	{1}	{2}\r\n';
        $.each($("div[id^='cont']:not(#conttpc)"), function(i, bet) {
            var ratio = 0;
            var points = 0;
            var bet_points = 0;

            var bet_html = $(bet).html().replaceAll('>','>\r\n').replaceAll('球隊','球队');


            var re_bet= /(下注(球|选)\S(：|:))(\s*)(?<team>[^<]*)/g; ///下注(球|选)(\S)(：|:)\s*(?<team>.*?)<br/g;
            var points_bet=/(下注点数|下註點數|點數|点数)(：|:|\s{1})\s*(?<points>\d+)/;
            var mp = bet_html.match(points_bet);
            if(mp!= null)
            {
                bet_points = parseInt(mp.groups['points'].trim());
            }

            //无下注点数情况下冲刺赛模式
            let key = eval('/'+ G.get('suanfenCCScoreKey') +'/');
            if(key.test(localTitle) && bet_points==0)
            {
                let cc_points = parseInt(G.get('suanfenCCScorePoints'));

                if(!isNaN(cc_points))
                {
                    bet_points = cc_points;
                }
            }

            //console.log(mp);

            let points_item = {};
            points_item.author = $('.r_two b:first', $(bet).parent().parent()).text().replace('[樓主]','');
            points_item.floor = $('.tipad .s3', $(bet).parent().parent().parent()).text();
            points_item.bet_count = 0;
            points_item.bet_points = bet_points;
            points_item.tips = '';
            points_item.team = '';

            let author_html = $('.r_two',$(bet).parent().parent().parent()).text().trim().replace(/\n/,'');
            author_html = author_html.replace(/^[\r\n\s\f\t\v\o]+/gm, "");

            //console.log(author_html);

            let author_info = {};
            ///級別：(.*)/;
            author_info.name = points_item.author;

            if(/級別：(.*)/.test(author_html))
            {
                author_info.group = /級別：(.*)/.exec(author_html)[1];
                author_info.p = /發帖：(.*)/.exec(author_html)[1];
                author_info.v = /威望：(.*)/.exec(author_html)[1];
                author_info.u = /金錢：(.*)/.exec(author_html)[1];
                author_info.g = /貢獻：(.*)/.exec(author_html)[1];
                author_info.c = /認證：(.*)/.test(author_html) ? /認證：(.*)/gs.exec(author_html)[1].trim() : "";
                author_info.c =author_info.c.replaceAll(" ","").replaceAll('\t','').replaceAll('\r','').replaceAll('\n','');
            }

            points_item.group = author_info.group;

            if(/論壇版主/.test(author_info.group) && !/下注点数/.test(bet_html))
            {
                return;
            }


            //超级别验证
            if(bet_points>0)
            {
                if(!check_level(author_info.group, bet_points))
                {
                    points_item.tips += points_item.tips == '' ? '' : '、';
                    points_item.tips += '超級別下注';
                    console.log('{author} {floor} 超級別下注'.format(points_item));
                }
            }

            if(/重新編輯/.test(bet_html))
            {
                points_item.tips += points_item.tips == '' ? '' : '、';
                points_item.tips += '重新編輯';
                bet_html = bet_html.replace(/<font color="gray">(.*)重新編輯 ]<\/font>/g,'');
            }

            var ms = bet_html.match(re_bet);

            //console.log(ms);
            if(points_item.author=='舞者飞扬')
            {
                console.log(bet_html);
            }
            $.each(ms, function(k, m){
                if(win_item[k] == null)
                {
                    //console.log(k);
                    return;
                }
                var win = win_item[k];

                //console.log(m);
                var half = win.half > 0 ? 0.5 : 1;

                if(points_item.author=='舞者飞扬')
                {
                    console.log(m);
                }

                /*
                var re_bet= /(下注球隊：|:)(\s*)(?<team>[^<]*)/g;// /(\d+)\.(\S*?)(：|:)(\s*)(?<team>.*)/g;
                var ms = bet_html.match(re_bet);

                $.each(ms, function(k, m){
                    //console.log(m + ' ' + m.match(/(：|:)\s*(?<team>.*)/));
                    let mc = m.match(/(下注球隊：|:)(\s*)(?<team>[^<]*)/);//m.match(/\d+\.(\S)(：|:)\s*(?<team>.*)<br/g);

                    //console.log(mc);
                    if(mc != null)
                    {
                        points_item.bet_count += 1;
                        var bet_item = mc.groups['team'].trim().replace('<br>','');
                        //if(/^\d+$/.test(bet_item))
                        //{
                        //    bet_item = '\''+bet_item
                        //}
                        bets_copy_item += '	'+ bet_item;
                    }
                    else
                    {
                        bets_copy_item += '	';
                    }
                */

                let mc = m.match(/(下注(球|选)(\S)(：|:))(\s*)(?<team>[^<]*)/);

                if(mc != null)
                {
                    var bet_item = mc.groups['team'].trim().replace('<br>','');//mc.groups['team'].trim().replaceAll('&nbsp;','').replaceAll(' ','');

                    bet_item = bet_item.replace(/^[ |&nbsp;]+$/,'').trim();

                    if(bet_item == '') return;
                    points_item.bet_count += 1;

                    //积分赛制匹配关键字
                    var key = eval('/'+ G.get('suanfenScoreKey') +'/');
                    if(localTitle.match(key) != null)
                    {
                        var score_points = {};
                        score_points.win = 3;
                        score_points.draw = 0;
                        score_points.lose = -1;

                        $.each(G.get('suanfenScorePoints').split(','), function(i, item){
                            if(i==0) score_points.win = parseInt(item);
                            if(i==1) score_points.draw = parseInt(item);
                            if(i==2) score_points.lose = parseInt(item);
                        });
                        //console.log(score_points);
                        bet_points = (bet_points == 0 ? 1 : bet_points);
                        points_item.bet_points = bet_points;
                        if(win.team=='走盘')
                        {
                            if(score_points.draw==0)
                            {
                                return;
                            }

                            ratio += score_points.draw * half;
                        }
                        else if(bet_item==win.team)
                        {
                            ratio += score_points.win * half;
                        }
                        else
                        {
                            ratio += score_points.lose * half;
                        }
                    }
                    else
                    {

                        if(win.team=='走盘') return;
                        if(bet_item==win.team)
                        {
                            if(/F1|赛马|波胆|菜农斗地主/.test(localTitle))
                            {
                                ratio += (win.ratio-1) * half;
                            }
                            else
                            {
                                ratio += win.ratio * half;
                            }
                        }
                        else
                        {

                            key = eval('/'+ G.get('suanfenCCScoreKey') +'/');
                            if(!key.test(localTitle))
                            {
                                ratio -= 1 * half;
                            }
                        }
                    }
                }
            });

            points = Math.round(bet_points*ratio);
            //淘汰赛保持赢半小数点
            if(/团体PK/.test(localTitle))
            {
                points = bet_points*ratio;
            }


            if(bet_points == 0 && points == 0)
            {
                points = '下注点数为0';
            }

            var tips = $('.points_tips', bet);
            $(bet).css({position:'relative'});
            if($(tips).length == 0)
            {
                $(bet).append(points_tips.format(points));
            }
            else
            {
                $(tips).text(points);
            }


            //bet_html = bet_html.replaceAll('<br>','\r\n').replaceAll('<br/>','\r\n').replaceAll('<br />','\r\n');
           
            bet_html = bet_html.replaceAll('&nbsp;','');
            bet_html = bet_html.replaceAll(":","：").replaceAll(' ：','：');

            if(/编号/.test(bet_html))
            {
                if(!(/编号：/.test(bet_html)))
                {
                    //处理编号格式不对问题
                    bet_html = bet_html.replace('编号','编号：');
                }
                points_item.team = /编号：([^<]*)/.exec(bet_html)[1].trim();

                //console.log(/队伍编号：(.*)/.exec(bet_html));
            }

            mp = points_item.floor.match(/(?<floor>\d+)/);
            if(mp != null)
            {
                points_item.floor = parseInt(mp.groups['floor'].trim());
            }

            points_item.points = points;
            points_list_copy += copy_tample.format(points_item);//(points,points,points);
        })
        //111	2	2
        //测试	111	222
        GM_setClipboard(points_list_copy,'text');
    }

    function clearImg()
    {
        var txt = $('#textarea').val();
        txt = txt.replace(/\[url(.*?)\](.*?)\[\/url\](\s{0,2})/gi,'$2\n');
        //txt = txt.replace(/(\r\n){2,}/g,'\r\n');
        $('#textarea').val(txt);
    }

    function personalFix(){
        if (localHref.match(/personal.php/) == null ){
            return;
        }

        $('#main div.t3:eq(1) table td div.t:eq(1) tr.tr3').each(function() {
            var $tr = $(this);

            var $tal = $tr.find('th.tal');
            var $td_reply = $tr.find('td:eq(2)');
            var $td_like = $tr.find('td:eq(3)');
            var $td_time = $tr.find('td:eq(4)');

            var tid = 0;
            var title = '';

            var pattern = /read.php\?tid=(?<tid>\d*).*?>(?<title>.*?)</

            var res = pattern.exec($tal.html());
            if(res.length>2)
            {
                tid = res[1];
                title = res[2];
            }


            if(tid>0)
            {

                var $link = '<a href="/read.php?tid=' + tid + '&toread=5" target="_blank">' + $td_time.html() + '</a>'; //按时间排序
                $td_time.html($link);

                $link = '<a href="/read.php?tid=' + tid + '&toread=1&page=e" target="_blank">' + $td_reply.html() + '</a>'; //最后一页
                $td_reply.html($link);
            }
            var count_like = parseInt($td_like.text());
            if(count_like>0)
            {
                $td_like.html('<a href="/message.php?action=likes&type=id&id=' + tid + '" target="_blank">' + $td_like.html() + '</a>');
            }

        });

    }

    function Funny() {
        let name_list = '好大的风';

        $('body .t').each(function(i, item){
            var tpc_content = $.trim($('.tpc_content', this).text());
            //var tpc_auther_html = $('.tr1 th:first b:first', this);
            var tpc_author = $.trim($('.tr1 th:first b:first', this).text()).replace(/\s\S*/,'');
            var tpc_floor = $.trim($('.tipad .s3', this).text()).replace(/[^0-9]/ig,'');
            var tpc_author_html = $('.tr1 th:first', this);

            //$(tpc_auther_html).html()
            if(eval(`/${name_list}/`).test(tpc_author)){
                //console.log(tpc_author);
                //let author_html = $('.r_two',$(bet).parent().parent().parent()).html();
                //console.log(tpc_author_html);
                ///級別：(.*)/ 論壇版主 ( 5 )
                //
            }
        });
    }

    function judgeTime(date){
        var today = new Date()
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
        var otime = today.getTime()
            //给出时间 - 今天0点
        var offset= date-otime
        var isToday = offset/1000/60/60
        isToday = parseInt(isToday);

        if(isToday >= 0 && isToday < 24){
            return "今天"
        }else if(isToday < 0 && isToday >= -24){
            return "昨天"
        }else {
            return ""
        }
    }


    ///提示消息，定时关闭，默认秒
    function message(msg, time)
    {
        var msgbox = $('#zhibo_tools_message');
        if($(msgbox).length == 0)
        {
            $('body').append('<div id="zhibo_tools_message"></div>');
            $('#zhibo_tools_message').click(function() { $(this).hide();});
        }
        msgbox = $('#zhibo_tools_message');

        let win_width = $(window).width();

        let left = (win_width - $(msgbox).width())/2;

        $(msgbox).css({left:left}).html(msg).show();

        if(typeof(time) == 'number')
        {
            clearTimeout(st);
            var st = setTimeout(function() {
                $('#zhibo_tools_message').hide();
            }, time*1000);
        }
    }

    function check_limit_time(post_time){
        let tips = '';

        return tips;
    }

    function check_level(group, bet_points){

        //不验证超级别下注类型
        //if(/赛马|賽馬|赛狗|賽狗|串一|串串|F1|波胆|欧赔|對賭|对赌|合體|合体|互怼|大乱斗/.test(localTitle)){
        //    return true;
        //}

        if(!(/场次|特别盘/.test(localTitle))){
           return true;
        }

        let item = {};
        item.group = group//.substr(0, 2);
        item.bet_points = bet_points;
        item.limit_points = 0;

        if(/禁止發言/.test(item.group))
        {
            return true;
        }

        switch(true)
        {
            case /天使/.test(item.group):
                item.limit_points = 50;
                break;
            case /光明|風雲/.test(item.group):
                item.limit_points = 40;
                break;
            case /精靈|聖騎|騎士/.test(item.group):
                item.limit_points = 30;
                break;
            default:
                item.limit_points = 0;
                break;
        }

        //console.log(item);

        return (item.bet_points <= item.limit_points);
    }

    function getUrlParam(name, url)
    {
        //window.location.search.substr(1)
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = url.match(reg);  //匹配目标参数
        if (r!=null)
            return unescape(r[2]);

        return null; //返回参数值
    }

    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    function addStyle(css) {
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        return document.insertBefore(pi, document.documentElement);
    }
})();