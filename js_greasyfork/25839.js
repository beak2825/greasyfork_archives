// ==UserScript==
// @name       Bilibili Auto Turnoff Barrage
// @namespace  https://greasyfork.org/zh-CN/users/6065-hatn
// @version    0.3.8
// @description  B站视频自动关闭弹幕：双击【t】键开/关切换
// @icon           http://www.gravatar.com/avatar/10670da5cbd7779dcb70c28594abbe56?r=PG&s=92&default=identicon
// @include		*.bilibili.com/video/av*
// @include		*.bilibili.com/anime/*
// @include		*.bilibili.com/bangumi/play/*
// @require0		http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js
// @copyright	2016, hatn
// @author		hatn
// @run-at     	document-end
// @grant0       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant0       GM_deleteValue
// grant0       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/25839/Bilibili%20Auto%20Turnoff%20Barrage.user.js
// @updateURL https://update.greasyfork.org/scripts/25839/Bilibili%20Auto%20Turnoff%20Barrage.meta.js
// ==/UserScript==

/***
*
* 功能：用于哔哩哔哩站(B站) 视频自动关闭弹幕
*
* 使用说明：
* 0、播放器右侧面板增加自定义设置项
* 1、双击【t】: 开/关弹幕
* 2、双击【f】: 全屏切换
* 3、双击【p】: 播放/暂停
* 4、单击【Esc】: 全屏&播放 // Firefox双击Esc退出全屏
* 5、双击【k/l】: 切换前/后一分P
* 6、默认勾选"防挡字幕"
* 7、自动宽屏
* 8、双击视频切换全屏
*/

/* #########  参数设置 S ######### */
var config = {
	auto_danmuku: 1, // 自动关闭弹幕 [1]开启(默认) [0]关闭
	auto_widescreen: 1, // 自动宽屏 [1]开启(默认) [0]关闭
    auto_playvedio: 0, // 自动播放 [1]开启 [0]关闭(默认)
    auto_preventshade: 1, // 防挡字幕 [1]开启(默认) [0]关闭
    auto_position: 1, // 自动定位播放器位置 [1]开启(默认) [0]关闭
    //auto_lightoff: 0, // 自动关灯[1]开启 [0]关闭(默认)
    //keyboard_flag: 1, // 监听单/双击键盘事件 [1]单双击(默认) [2]双击 [3]单击 [0]关闭
    click_flag: 1, // 监听单击键盘事件 [1]开启(默认)  [0]关闭
    dblclick_flag: 1, // 监听双击键盘事件 [1]开启(默认) [0]关闭
    css_flag: 1, // 额外的css样式 [1]开启(默认) [0]关闭 全屏时半透明弹幕栏和控制条
    control_view: { // 悬浮视图
        status: 0, // 显示视图 [1]开启 [0]关闭(默认)
        float: 2, // 停靠位置 [1]左 [2]右(默认)
        auto_hide: 0, // 操作后自动隐藏 [1]开启 [0]关闭(默认)
    }
};

/* #########  参数设置 E ######### */

var danmukuObj = {
	/* 参数 */
    cfg: {}, // 参数集
    localConfig: {}, // 本地参数集
	defaultCfg: {
		auto_danmuku: 1,
        auto_widescreen: 1,
        auto_playvedio: 0,
        auto_preventshade: 1,
        auto_position: 1,
        //auto_lightoff: 0,
        //keyboard_flag: 1,
        click_flag: 1,
        dblclick_flag: 1,
        css_flag: 1,
        control_view: {
            status: 0,
            float: 2,
            auto_hide: 0
        }
    },
    // 临时数据
    DATA: {
        script_name: 'Bilibili_Auto_Turnoff_Barrage',
        curr_pathname: '', // 当前页面链接
        videoListenner: null,
    },
    /* 按键参数 */
    keyData: {
        timenow: 0, // 上一按键时间
        preKey: '', // 记忆前一按键
        keepTime: 400, // 双击间隔
        keyBtn: { // 双/单击按键对应动作
            '0': { // global
                'nextbtn': '.bilibili-player-video-toast-item-jump',
                'pageBgm': '.bangumi-list-wrapper ul.episode-list>li.episode-item',
                'currPage': '#v_multipage a.item.on',
                'currPageBgm': '.bangumi-list-wrapper ul.episode-list>li.episode-item.on',
                //'currPageBgm': 'ul.slider-list>li.v1-bangumi-list-part-child.cur:eq(0)',
                //'currNotPageBgm': 'ul.slider-list>li.v1-bangumi-list-part-child:not(.cur)',
                'dealPageFunc': function(s, _act) {
                    var act = _act == 'prev' ? 'prev' : 'next';
                    if (/bangumi/.test(location.href)) { // 番剧模式
                        var $curr_li = $(s.keyData.keyBtn[0].currPageBgm)[act]('li') || false;
                        if ($curr_li == false) return false;
                        $curr_li.click();
                        /** onclick事件失效（已被取消）直接模拟点击 li
                        var onclick = $('a[onclick]:eq(0)', $curr_li).attr('onclick') || false;
                        if (onclick != false) eval('unsafeWindow.' + onclick);*/
                        // 重新插入css样式到iframe 通过band的点击事件（$curr_li.click）实现即可
                        //s.band('bangumi');
                        //s.keyData.keyBtn[0].addCssIframe(s); // 事件处理
                        return true;
                    }
                    var href = $(s.keyData.keyBtn[0].currPage)[act]('a[href]').attr('href') || false;
                    if (href != false) location.href = href;
                },
                'addCssIframe': function(s) {
                    if (s.DATA.videoListenner) clearInterval(s.DATA.videoListenner);
                    s.DATA.curr_pathname = location.pathname;
                    var ii = 0;
                    var crontrolDom = setInterval(function() {
                        if (ii > 99) {
                            clearInterval(crontrolDom);
                            console.log('log: bofangqi_dom not found !');
                        }
                        if ($('.bilibili-player-advopt-wrap', s.dom_type).size() > 0) {
                            clearInterval(crontrolDom);
                            /*s.settingView() + */setTimeout(() => s.autoAction(), 3000);
                            console.log('log: controlView done !');
                        }
                        ++ii;
                    }, 1000);
                    /*var selector = s.keyData.keyBtn['84'].selector;
                    var new_iframe_dom = setInterval(function() {
                        if (ii > 15) {
                            clearInterval(new_iframe_dom);
                            console.log('log: new_iframe_dom not found !');
                        }
                        if (s.checkIframe(selector, s.iframe_arr)) {
                            clearInterval(new_iframe_dom);
                            s.addCss(true);
                            setTimeout(function() {
                                //debugger;
                                s.band('bangumi_keyup');
                                s.autoAction();
                            }, 1000);
                            console.log('log: new_iframe_dom found !');
                        }
                        ++ii;
                    }, 1000);*/
                }
            },
            // 双击操作
            '70': {'type': 'fullscreen', 'selector': '.bilibili-player-iconfont-fullscreen.icon-24fullscreen:eq(0)'},
            //'71': {'type': 'lightoff', 'selector': '.bilibili-player-video-float-type[type="light"]:eq(0)'},
            '75': {
                'type': 'prepage',
                'function': function(keyData, s) {
                    s.keyData.keyBtn[0].dealPageFunc(s, 'prev');
                },
            },
            '76': {
                'type': 'nextpage',
                'function': function(keyData, s) {
                    s.keyData.keyBtn[0].dealPageFunc(s, 'next');
                }
            },
            '80': {
                'type': 'playvedio',
                'selector': 'div.bilibili-player-video-btn-start:eq(0)',
                'player_box': '.player-wrapper,.player',
                'pause_btn': 'div.bilibili-player-video-btn-start.video-state-pause',
                'function': function(keyData, s) {
                    if ($(keyData.pause_btn, s.dom_type).length > 0) return true;
                    $('html, body').animate({scrollTop: $(keyData.player_box).offset().top + 0}, 600); // top + 22
                }
            },
            '84': {
                'type': 'danmuku',
                'selector': 'div.bilibili-player-video-control div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku',
                'hide_danmu_set': '.bilibili-player-danmaku-setting-lite-panel',
                'flag_off': 'div.bilibili-player-video-control div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku.video-state-danmaku-off',
                'function': function(keyData, s) {
                    $(keyData.hide_danmu_set, s.dom_type).hide(); // 模拟点击 + 隐藏弹幕设置面板
                }
            },
            // 单击操作
            '_27': {
                'type': 'fullandplay',
                'full_status': '#bilibiliPlayer.mode-fullscreen',
                'function': function(keyData, s) {
                    if ($(keyData.full_status, s.dom_type).length > 0) return false; // 退出全屏时不触发该事件··
                    s.keyAction(70);
                    if ($(s.keyData.keyBtn[80].pause_btn, s.dom_type).size() > 0) setTimeout(() => s.keyAction(80), 450);
                }
            },
			// 鼠标操作
			'doubleClick_fullscreen': { // 双击全屏
				'type': 'doubleClick_fullscreen',
				'selector': '.bilibili-player-iconfont-fullscreen.icon-24fullscreen:eq(0)',
				'function': function(keyData, s) {
					if ($(s.keyData.keyBtn[80].pause_btn, s.dom_type).size() > 0) setTimeout(() => s.keyAction(80), 450);
				}
			},
            // 自动操作（无按键）
            'preventshade': {  // 防挡字幕
                'type': 'preventshade',
                //'selector': '[for="checkbox41"]'//checkbox22
                'function': function(keyData, s) {
                    setTimeout(() => {
                        $danmubox = $('.bilibili-player-video-btn-danmaku:eq(0)');
                        $danmubox.mouseover() + $('[for="checkbox41"]').click() + $danmubox.mouseout();
                    }, 3000);
                }
            },
            'widescreen': { // 自动宽屏
                'type': 'widescreen',
                'selector': '.bilibili-player-video-btn-widescreen'
            },
            'automatic_positioning': { // 自动定位播放器
                'type': 'automatic positioning',
                'function': function (keyData, s) {
                    $('html, body').animate({scrollTop: $(s.keyData.keyBtn[80].player_box).eq(0).offset().top + 0}, 600); //22
                }
            }
        }
    },
    hash: null, // location.hash
    dom_type: document, // 使用 document/iframe
    iframe_arr: { // body体集合
        bangumi: "iframe.player.bilibiliHtml5Player",
    },
    /* 前置操作 */
    preOperation: function() {
        var s = this;
        s.DATA.curr_pathname = location.pathname;
    },
	/* 初始化 */
	init: function() {
        var s = this;
        s.preOperation();
		s.band();
        s.addCss();
        s.autoAction();
        s.controlView('add');
		console.log('log: Bilibili Auto Turnoff Barrage, Run...');
	},
	/* 启动器 */
	launcher: function(config) {
		var s = this;
		s.setParam(config);
        var times = 100;
        var ii = 0;
		var preTimer = setInterval(function () {
            ++ii;
            var selector = s.keyData.keyBtn['84'].selector; //'div.bilibili-player-video-btn.bilibili-player-video-btn-danmaku';
			if ($(selector).length > 0 || s.checkIframe(selector, s.iframe_arr)) {
				window.clearInterval(preTimer);
                console.log('log: Try ' + ii + ' times!');
				setTimeout(function() {
                    s.init(); // 延迟3秒执行
                }, 3000);
				return true;
			}
			if (--times < 0) {
                window.clearInterval(preTimer) + console.log('err: time out!');
			}
		}, 600);
	},
    /* 检查各项iframe */
    checkIframe: function(selector, iframe_arr) {
        var s = this;
        var $type;
        for (var i in iframe_arr) {
            $type = $(iframe_arr[i]);
            if ($type.length > 0 && $(selector, $type.contents()).length > 0) {
                s.dom_type = $type.contents();
                return true;
            }
        }
        return false;
    },
	/* 参数读取 */
	setParam: function(config) {
		var s = this;
		config = typeof config == 'object' ? config : {};
        s.localConfig = {};
        var localConfigStr = localStorage.getItem('bili_hatn_config');
        if (localConfigStr != null) s.localConfig = eval('(' + localConfigStr + ')');
		s.dataMgr('get');
        console.log(s.cfg); // test
	},
    /* 全局css */
    addCss: function(_onlyIframe) {
        var s = this;
        if (s.cfg.css_flag != 1 && s.cfg.control_view.status != 1) return false;
        var onlyIframe = _onlyIframe || false; // 只插入到iframe
        var playerCss = controlViewCss = '';

        if (s.cfg.css_flag == 1) {
            var playerCss = `#bilibiliPlayer.mode-fullscreen .bilibili-player-video-sendbar[style^="opacity: 1;"]{ background: rgba(0,0,0,0.3); bottom: 60px !important;} #bilibiliPlayer.mode-fullscreen .bilibili-player-video-control[style^="opacity: 1;"]{ border-color: rgba(255,255,255,.3); text-shadow: #333 1px 1px 3px; background: rgba(0,0,0,0.3); -moz-transform:scale(1,2);-webkit-transform:scale(1,2);bottom: 16px !important;}.bilibili-player-video-btn.bilibili-player-video-btn-color~.bilibili-player-video-inputbar.focus, .bilibili-player-video-control .bpui-slider-tracker[name="slider"], #bilibiliPlayer.mode-fullscreen ul.bpui-selectmenu-list.bpui-selectmenu-list-left { background: 0; border-color: rgba(255,255,255,.3) !important; } .bilibili-player-video-progress-buffer { background: rgba(255,255,255, 0.3) !important; }  #bilibiliPlayer.mode-fullscreen #bilibiliPlayer.mode-fullscreen ul.bpui-selectmenu-list.bpui-selectmenu-list-left>li, #bilibiliPlayer.mode-fullscreen .bilibili-player-danmaku-setting-lite, #bilibiliPlayer.mode-fullscreen .bilibili-player-video-volumebar-wrp, .bpui-selectmenu-list-row[data-selected] { background: rgba(0,0,0,0.3) !important; } #bilibiliPlayer.mode-fullscreen ul.bpui-selectmenu-list.bpui-selectmenu-list-left>li:not([data-selected="selected"]), #bilibiliPlayer.mode-fullscreen .bilibili-player-video-danmaku-input, #bilibiliPlayer.mode-fullscreen .bilibili-player-video-volume-num, #bilibiliPlayer.mode-fullscreen [name="time_textarea"], #bilibiliPlayer.mode-fullscreen .bilibili-player-danmaku-setting-lite-title, #bilibiliPlayer.mode-fullscreen .bpui-checkbox-text, #bilibiliPlayer.mode-fullscreen .bilibili-player-block-filter-label, #bilibiliPlayer.mode-fullscreen .row-title, #bilibiliPlayer.mode-fullscreen .js-action:not(.active)>.fontsize_selector, #bilibiliPlayer.mode-fullscreen .js-action:not(.active) .selection-name { color: #ccc !important; text-shadow: #333 1px 1px 3px; } #bilibiliPlayer.mode-fullscreen .bilibili-player-video-btn-send.bpui-component.bpui-button.button, #bilibiliPlayer.mode-fullscreen .bpui-slider-progress { background: rgba(0,161,214,0.6); border: 0; } #bilibiliPlayer.mode-fullscreen .bilibili-player-video-progress-buffer-range { background: rgba(138,220,237,0.6); } #bilibiliPlayer.mode-fullscreen .bilibili-player-video-volumebar.bpui-component.bpui-slider.bpui-slider-vertical { opacity: 0.6; } #bilibiliPlayer.mode-fullscreen .bilibili-player-video-volumebar-wrp, #bilibiliPlayer.mode-fullscreen .bilibili-player-video-float-panel.show, #bilibiliPlayer.mode-fullscreen .bilibili-player-video-float-quality-lists, #bilibiliPlayer.mode-fullscreen .bilibili-player-video-float-split, #bilibiliPlayer.mode-fullscreen .bilibili-player-danmaku-setting-lite-panel { border-color: rgba(255,255,255,.3) !important; } #bilibiliPlayer.mode-fullscreen .bilibili-player-mode-selection-container.active, #bilibiliPlayer.mode-fullscreen .bilibili-player-color-picker-container.active { background: rgba(0,0,0,0.3) !important; border-color: rgba(255,255,255,.3) !important; } .bilibili-player.mode-fullscreen .bilibili-player-area .bilibili-player-video-control .bilibili-player-video-btn.bilibili-player-video-btn-widescreen { background-color: transparent !important; } .bilibili-player .bilibili-player-area .bilibili-player-video-control .bilibili-player-video-btn.bilibili-player-video-btn-quality .bpui-selectmenu .bpui-selectmenu-list-row { color: #aaa !important; }`;
            var playerCssStr = '<style id="player-style">' + playerCss + ' </style>';
            $(playerCssStr).appendTo($('body', s.dom_type));
        }
        if (onlyIframe == true) return false;

        if (s.cfg.control_view.status == 1) {
            var float = s.cfg.control_view.float == 1 ? 'left' : 'right';
            var width = '45px';
            controlViewCss = '#control-view-box { font-family: SimSun; z-index: 9999999999; cursor: pointer; position: fixed; opacity: 0.5; ' + float + ': 5px; top: 200px; width: ' + width + '; box-sizing:border-box; color: #fff; font-size: 13px; line-height: ' + width + '; } [data-cmd] { text-align: center; display: block; width: ' + width + '; height: ' + width + '; width: 100%; border-radius: 50%; } span[data-cmd] { background-color: rgb(248,142,139); } #control-view-box>ul { overflow-y: hidden; max-height: 0; width: 100%; clear: both; transition: 0.5s 0s max-height ease; } li[data-cmd] { margin-top: 5px; background-color: rgb(170,215,255); } #control-view-box.show>ul { max-height: 300px; } [data-cmd]:hover { background-color: rgb(68,216,128); } [data-cmd]:hover { background-color: rgb(69,218,132); }';
            var controlViewCssStr = '<style id="controlViewCss-style">' + controlViewCss + ' </style>';
            $(controlViewCssStr).appendTo($('body'));
        }
    },
    /* 控制视图 */
    controlView: function(_type) {
        var s = this;
        if (s.cfg.control_view.status != 1) return false;
        var type_arr = ['switch', 'add', 'show', 'hide'];
        var type = $.inArray(_type, type_arr) != -1 ? _type : type_arr[0];
        var id = 'control-view-box';
        var $s = $('#' + id);
        if (type == 'add') {
            if ($s.length >= 1) return false;
            var html = `
            <div id="${id}" class="show">
                <span data-cmd="switch" title="收缩/展开">Bili</span>
                <ul>
                    <li data-cmd="70" title="双击F/单击ESC">全屏</li>
                    <li data-cmd="80" title="双击P">播/暂</li>
                    <li data-cmd="84" title="双击T">弹幕</li>
                    <li data-cmd="75" title="双击K">上一P</li>
                    <li data-cmd="76" title="双击L">下一P</li>
                </ul>
            </div>`;
            $('body').append(html);
            var windowHeight = document.documentElement.clientHeight;
            var boxHeight = $s[0].clientHeight;
            var topHeight = parseInt((windowHeight - boxHeight) / 2) + 'px';
            $s.css('top', topHeight);
        } else if (type == 'switch') {
            var flag = $s.hasClass('show');
            flag ? $s.removeClass('show') : $s.addClass('show');
        } else if (type == 'show') {
            $s.addClass('show');
        } else if (type == 'hide') {
            $s.removeClass('show')
        }
    },
	/* 设置视图 */
	settingView: function() {
		var s  = this;
        if ($('#setting-tips', s.dom_type).size() > 0) return true; // 防止重复插入
		var config_obj = {
			auto_danmuku: {name: '关闭弹幕', tips: '自动关闭弹幕'},
			auto_widescreen: {name: '自动宽屏', tips: '自动开启网页宽屏'},
			auto_playvedio: {name: '自动播放', tips: '加载完毕自动播放视频'},
			auto_preventshade: {name: '防挡字幕', tips: '自动勾选防挡底部字幕'},
			auto_position: {name: '自动定位', tips: '加载完毕滚动条自动定位到播放器位置'},
			//auto_lightoff: {name: '自动关灯', tips: '自动打开关灯模式'},
			//keyboard_flag: {name: '按键监听', tips: '监控单双击按键事件'},
			click_flag: {name: '按键单击监听', tips: '监控单击按键事件'},
			dblclick_flag: {name: '按键双击事件', tips: '监控双击按键事件'},
			css_flag: {name: '透明底栏', tips: '全屏时半透明弹幕栏和控制条'},
			//control_view: {name: '浮动按钮', tips: '开启侧边浮动按钮'}
		};
		var html_str = makeItemHtml(s.cfg);
        setTimeout(() => $('.bilibili-player-advopt-wrap', s.dom_type).append(html_str), 1000);

        // 播放结束事件
        $('video').on('ended', function(e) {
            var i = 12;
            if (s.DATA.videoListenner) clearInterval(s.DATA.videoListenner);
            s.DATA.videoListenner = setInterval(function() {
                if (--i < 0) {
                    console.log('log: videoListenner timeout !');
                    clearInterval(s.DATA.videoListenner);
                    return false;
                } else if (s.DATA.curr_pathname != location.pathname) {
                    clearInterval(s.DATA.videoListenner);
                    s.keyData.keyBtn[0].addCssIframe(s);
                    console.log('log: videoListenner done !');
                }
            }, 2000);
        });

		function makeItemHtml(obj) {
            if (typeof obj != 'object') return;
            var item_html = '', item, act_status, html_str = '', className = 'bpui-state-active';;
			for (var i in config_obj) {
				item = config_obj[i];
                //if (typeof item == 'object') continue;
                act_status = obj[i] > 0 ? className : '';
                item_html = `
				<div flag="config" class="bilibili-player-fl" title="${item['tips']}">
					<input type="checkbox" class="bilibili-player-setting-videomirror bpui-component bpui-checkbox bpui-button">
					<label for="${i}" class="button bpui-button-text-only ${act_status}" role="button" id="${i}">
						<span class="bpui-button-text">
							<i class="bpui-icon-checkbox icon-12checkbox"></i>
							<i class="bpui-icon-checkbox icon-12selected2"></i>
							<i class="bpui-icon-checkbox icon-12select"></i>
							<span class="bpui-checkbox-text">${item['name']}</span>
						</span>
					</label>
				</div>`;
				html_str += item_html;
            }

            var front_html = `
            <div id="setting-tips" style="width: 100%; float: left; text-indent: 50px;" title="刷新生效">---- 自定义设置 ----</div>`;

			return front_html + html_str;
		}
	},
	/* 事件绑定 */
	band: function(type) {
		var s = this;
        var type = type || 'init';
        if (type == 'init') {
            $dom = s.dom_type == document ? $(document) : $(document).add(s.dom_type);
            if (s.dom_type != document) {
                s.hash = location.hash;
                $(s.keyData.keyBtn[0].currPageBgm).on('click', function() {
                    var hash = location.hash;
                    console.log('log: ' + hash + ', ' + s.hash);
                    if (hash == s.hash) return false;
                    s.hash = hash;
                    s.keyData.keyBtn[0].addCssIframe(s);
                });
            }
            keyupEvent($dom);
            viewEvent(s);
        /*} else if (type == 'bangumi') {
            s.keyData.keyBtn[0].addCssIframe(s);*/
        } /*else if (type == 'bangumi_keyup') {
            var $dom = $(document).add(s.dom_type);
            // 重新绑定
			$dom.off('keyup');
            $dom.off('dblclick');
            $dom.off('click');
            keyupEvent($dom);
        }*/

        function keyupEvent($dom) {
			$dom.on('click', '[flag="config"] label, .bilibili-player-setting-btn', function() { // 视图设置事件
                var $s = $(this);
                if ($s.hasClass('bilibili-player-setting-btn')) {
                    s.settingView(); // 插入设置项html
                } else {
                    var className = 'bpui-state-active';
                    var id = this.id;
                    $s.hasClass(className) ? $s.removeClass(className) : $s.addClass(className);
                    s.cfg[id] = s.cfg[id] > 0 ? 0 : 1;
                    s.dataMgr('set'); // 保存参数
                    console.log('log: turn config[' + id + '] ' + (s.cfg[id] > 0 ? 'on' : 'off'));
                }
            });

            s.cfg.auto_widescreen && $(s.dom_type).on('fullscreenchange mozfullscreenchange webkitfullscreenchange msfullscreenchange', function(e) { // 退出全屏时宽屏
                if (e.target.className.indexOf('mode-fullscreen') == -1) {
                    s.keyAction('widescreen');
                    console.log('log: exit fullscreen & widescreen');
                }
            })

            $dom.on('dblclick', '#bilibiliPlayer .bilibili-player-video', function() { // 鼠标双击事件
                s.keyAction('doubleClick_fullscreen');
            });

            // 视频分P 点击/自动跳转
            $(document).on('click', s.keyData.keyBtn[0].nextbtn + ', ' + s.keyData.keyBtn[0].pageBgm, function() {
                setTimeout(() => {
                    if (s.DATA.curr_pathname == location.pathname) return false; // 点击的是当前分P
                    if (s.DATA.videoListenner) clearInterval(s.DATA.videoListenner);
                    s.keyData.keyBtn[0].addCssIframe(s);
                }, 500);
            });

            (!s.cfg.click_flag && !s.cfg.dblclick_flag) || $dom.on('keyup', function(event) {
                if ($("input:focus, textarea:focus").length > 0) return false; // 焦点在输入框时 不响应按键事件
                var keyCode = event.keyCode;
                var double = doubleClick(keyCode);
                var one_click = s.cfg.click_flag ? true: false;
                var double_click = s.cfg.dblclick_flag ? true: false;
                if (double == false && one_click == true) { // 非双击
                    keyCode = '_' + keyCode;
                    if (typeof s.keyData.keyBtn[keyCode] == 'undefined') return false;
                    s.keyAction(keyCode);
                } else if (double == true && typeof s.keyData.keyBtn[keyCode] != 'undefined' && double_click == true) {
                    s.keyAction(keyCode);
                }
            });

            /* 双击判定 */
            function doubleClick(keyCode) {
                var timenow = (new Date()).getTime();
                if (s.keyData.timenow == 0) {
                    s.keyData.timenow = timenow;
                    s.keyData.preKey = keyCode;
                    return false;
                } else {
                    var intval = timenow - s.keyData.timenow;
                    if (intval < s.keyData.keepTime && s.keyData.preKey == keyCode) {
                        s.keyData.timenow = 0;
                        return true;
                    }
                    s.keyData.preKey = keyCode;
                    s.keyData.timenow = timenow;
                }
                return false;
            }
        }

        /* 悬浮按钮 */
        function viewEvent(s) {
            s.cfg.control_view.status == 1 && $(document).on('click', '#control-view-box [data-cmd]', function() {
                var cmd = $(this).data('cmd');
                if (cmd == 'switch') {
                    s.controlView(); // swith
                    return true;
                }
                s.keyAction(cmd);
                if (s.cfg.control_view.auto_hide == 1) s.controlView('hide');
            });
        }
	},
    /* 自动类操作 */
    autoAction: function() {
        var s = this;
        //if (s.cfg.auto_lightoff == 1) s.keyAction(71);
        if (s.cfg.auto_danmuku == 1) s.keyAction(84);
        if ((s.cfg.auto_playvedio == 1 && $(".video-state-pause").size() > 0) || (s.cfg.auto_playvedio != 1 && $(".video-state-pause").size() < 1)) s.keyAction(80);
        if ((s.cfg.auto_widescreen == 1 && $('.icon-24wideon').size() < 1) || (s.cfg.auto_widescreen != 1 && $('.icon-24wideon').size() > 0)) s.keyAction('widescreen'); // 电影模式不开启
        if (s.cfg.auto_preventshade == 1) s.keyAction('preventshade');
        if (s.cfg.auto_position == 1) s.keyAction('automatic_positioning');
    },
    /* 按键操作 */
    keyAction: function(_keyCode) {
        var s = this;
        var keyCode = _keyCode || false;
        if (keyCode == false || typeof s.keyData.keyBtn[keyCode] == 'undefined') return false;
        var keyData = s.keyData.keyBtn[keyCode];
        var selector = keyData.selector || false;
        var subsidiary_func = keyData.function || false;
        if (selector != false) $(selector, s.dom_type).click(); // 点击操作
        if (subsidiary_func != false) subsidiary_func(keyData, s); // 附属操作
        console.log('log: ' + s.keyData.keyBtn[keyCode].type + ' Action.');
    },
	/* 数据操作 */
	dataMgr: function(act) {
		var s = this;
        var action = act == 'set' ? 'set' : 'get';
        var config_name = s.DATA.script_name + '_config';
		if (action == 'get') {
			var cfgStr = GM_getValue(config_name);
			if (typeof cfgStr == 'undefined' || cfgStr == '') {
                $.extend(s.cfg, s.defaultCfg, config, s.localConfig);
				return false;
			}
            var cfg_obj = JSON.parse(cfgStr);
            if (typeof cfg_obj != 'object')  {
                $.extend(s.cfg, s.defaultCfg, config, s.localConfig);
				return false;
            }
            $.extend(s.cfg, s.defaultCfg, config, s.localConfig, cfg_obj); // 合并
		} else {
			var cfgStr = JSON.stringify(s.cfg);
			GM_setValue(config_name, cfgStr);
		}
	}
};

danmukuObj.launcher(config);