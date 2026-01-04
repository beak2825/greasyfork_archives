// ==UserScript==
// @name        Steam社区自动点赞脚本[测试版]
// @namespace   com.wt629.steam.voteup.auto.batch
// @description Steam社区自动点赞脚本,在steam动态页面上添加自动点赞.
// @include     http*://steamcommunity.com/id/*/home
// @include     http*://steamcommunity.com/profiles/*/home
// @version     2.9
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/31164/Steam%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC%5B%E6%B5%8B%E8%AF%95%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/31164/Steam%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC%5B%E6%B5%8B%E8%AF%95%E7%89%88%5D.meta.js
// ==/UserScript==
(function() {
	'use strict';

	var wt629_com_js = {

		// 多语言选项
		i18n: {
			chinese: {
				divWidth: 300,
				// 日志信息
				loadDefaultConfigCompleteLog: '使用默认配置重置脚本设置完成',
				initConfigInfo: '初始化配置信息 ... ',
				initConfigInfoComplete: '初始化配置信息 完成',
				loadDefaultConfigError: '读取配置出错',
				restDefaultConfig: '使用默认配置重置',
				syncConfigToForm: '同步设置到表单 ... ',
				syncConfigToFormComplete: '同步设置到表单 完成 ',
				refreshTimeoutValueErrorTip: '保存的超时时间无法解析或不是数值,修改为默认60秒 ...',
				saveConfig: '保存配置 ... ',
				saveConfigComplete: '保存配置 完成 请手动刷新页面加载新配置 ..  ',

				thumbUpConfigEnable: '点赞选项已启用 ...',
				typeGamePurchase: '用户购买游戏',
				typeRecommendation: '用户评测点赞（不推荐欢乐）',
				typeRecommendationAllUp: '用户评测全点赞',
				typeScreenshot: '用户截图',
				typeUserStatus: '用户发布的状态',
				typeWorkshopItemPublished: '用户收藏和发布的艺术作品',
				batchThumbUpComplete: '批量点赞完成 ',
				thumbUpConfigDisable: '点赞选项未启用 ...',

				thumbUpComplete: '点赞完成',
				thumbUpCount: ' 点赞次数：',
				alreadyThumbUpCount: ' 已点赞内容：',
				currentThumbUpCount: ' 本次点赞：',
				currentHappyCount: ' 本次欢乐：',

				// 控制界面
				refreshing: '刷新中...',
				secondsLaterRefresh: '秒后刷新',
				showOrHide: '显示/隐藏',
				steamAutoVoteupScriptConsole: 'Steam社区自动点赞脚本控制台',
				steamAutoVoteupScriptConsoleVersion: '[v2.8版->极度缓慢开发中...]->',
				configDetailGui: '使用详细说明（Steam指南）',
				option: '选项',
				enableAutoVoteup: '启用自动点赞',
				language: '语言：',
				defaultShowConsoleView: '默认显示控制界面',
				autoRefreshPage: '自动刷新页面',
				autoRefreshPageTime: '自动刷新页面时间[10~3600秒]',
				manualThumbsUp: '手动点赞',
				contentUserPublishStatus: '内容->用户发布的状态->',
				contentUserFavorites: '内容->用户收藏和发布的艺术作品->',
				contentUserBuyGame: '内容->用户购买游戏->',
				contentUserImages: '内容->用户截图->',
				contentUserEvaluate: '内容->用户评测->',
				contentUserNotThumbsUpHappy: '评测结果为不推荐的点欢乐',
				logMessage: '日志信息：',

				scriptError: '脚本出现异常，请与制作人联系！'
			},
			english: {
				divWidth: 450,
				// 日志信息
				loadDefaultConfigCompleteLog: 'load Default Config Complete',
				initConfigInfo: 'init Config Info ... ',
				initConfigInfoComplete: 'init Config Info Complete',
				loadDefaultConfigError: 'load Default Config Error',
				restDefaultConfig: 'rest Default Config',
				syncConfigToForm: 'sync Config To Form ... ',
				syncConfigToFormComplete: 'sync Config To Form Complete',
				refreshTimeoutValueErrorTip: 'save default timeout error, set default 60s...',
				saveConfig: 'save Config ... ',
				saveConfigComplete: 'save Config Complete please Manual refresh reload config...  ',

				thumbUpConfigEnable: 'thumbUp Config Enable ...',
				typeGamePurchase: 'User Buy Game',
				typeRecommendation: 'Evaluation results are not recommended points Joy',
				typeRecommendationAllUp: 'User Reviews',
				typeScreenshot: 'User Screenshot',
				typeUserStatus: 'User Release Status',
				typeWorkshopItemPublished: 'User Collection and Published Artwork',
				batchThumbUpComplete: 'batch ThumbUp Complete ',
				thumbUpConfigDisable: 'thumbUp Config Disable ...',

				thumbUpComplete: 'thumbUp Complete',
				thumbUpCount: ' thumbUp Count：',
				alreadyThumbUpCount: ' already ThumbUp Count：',
				currentThumbUpCount: ' current ThumbUp Count：',
				currentHappyCount: ' current points joy Count：',

				// 控制界面
				refreshing: 'refreshing...',
				secondsLaterRefresh: ' seconds later Refresh',
				showOrHide: 'show/hide',
				steamAutoVoteupScriptConsole: 'Steam Community Automatic Likes Scripts Console',
				steamAutoVoteupScriptConsoleVersion: '[v2.8 -> Extremely slow Development ...]->',
				configDetailGui: 'Use detailed instructions (Steam Guide)',
				option: 'Option',
				enableAutoVoteup: 'Enable auto click',
				language: 'language：',
				defaultShowConsoleView: 'Default display control interface',
				autoRefreshPage: 'Automatic refresh page',
				autoRefreshPageTime: 'Refresh Page Time [10 ~ 3600 seconds]',
				manualThumbsUp: 'Manual Click Like',
				contentUserPublishStatus: 'Content -> User Release Status ->',
				contentUserFavorites: 'Content -> User Collection and Published Artwork ->',
				contentUserBuyGame: 'Content -> User Buy Game ->',
				contentUserImages: 'Content -> User Screenshot ->',
				contentUserEvaluate: 'Content -> User Reviews ->',
				contentUserNotThumbsUpHappy: 'Evaluation results are not recommended points Joy',
				logMessage: 'Log information:',

				scriptError: 'script error，Please contact the producer！'
			}
		},

		config: {
			isEnable: true,
			isShow: true,
			isTimedRefresh: false,
			refreshTimeout : 60,

			// 用户状态
			thumbUpUserStatus: true,
			// 收藏和发布艺术作品
			thumbUpWorkshopItemPublished: true,
			// 购买游戏
			thumbUpGamePurchase: true,
			// 截图
			thumbUpScreenshot  : true,
			// 评测
			thumbUpRecommendation: true,
			// 评测为不推荐的点欢乐
			thumbHappyByRecommendation: true,

			// 语言选项
			language: '',
		},

		// 添加到页面的HTML
		controlPanelHtml: "",

		log: function(content,isAppend){
			if (isAppend){
				$('#wt629_com_controlPanel_msg').html($('#wt629_com_controlPanel_msg').html() + '<br/>' + content);
			}else{
				$('#wt629_com_controlPanel_msg').html(content);
			}
		},

		getI18nText(type){
			try{
				if (wt629_com_js.config.language == '' || wt629_com_js.config.language == null || wt629_com_js.config.language == undefined){
					var currentBrowserLanguage =(navigator.language || navigator.browserLanguage).toLowerCase();
					if(currentBrowserLanguage.indexOf('zh')>=0) {
						wt629_com_js.config.language = 'chinese';
					} else {
						wt629_com_js.config.language = 'english';
					}
				}
				return wt629_com_js.i18n[wt629_com_js.config.language][type];
			}catch (e) {
				console.error(e);
				wt629_com_js.log(wt629_com_js.getI18nText('scriptError'), e);
				return 'errorText :' + type;
			}
		},

		setDefaultConfigData: function(){
			var config = {
				isEnable: false,
				isShow: true,
				isTimedRefresh: false,
				refreshTimeout : 60,

				// 用户状态
				thumbUpUserStatus: true,
				// 收藏和发布艺术作品
				thumbUpWorkshopItemPublished: true,
				// 购买游戏
				thumbUpGamePurchase: true,
				// 截图
				thumbUpScreenshot  : true,
				// 评测
				thumbUpRecommendation: true,
				// 评测为不推荐的点欢乐
				thumbHappyByRecommendation: true,

				// 语言选项
				language: '',
			};
			localStorage.setItem('wt629_com_auto_voteup_config_v2_8',JSON.stringify(config));
			wt629_com_js.log(wt629_com_js.getI18nText('loadDefaultConfigCompleteLog') , true);
		},

		saveConfig: function(){
			localStorage.setItem('wt629_com_auto_voteup_config_v2_8',JSON.stringify(wt629_com_js.config));
		},

		//检查配置数据是否存在，或是否配置。如果没有配置，设置缺省数据
		checkIsConfig: function(){
			if (null == wt629_com_js.config || undefined == wt629_com_js.config ){
				wt629_com_js.log(wt629_com_js.getI18nText('initConfigInfo'), false);
				wt629_com_js.setDefaultConfigData();
				wt629_com_js.log(wt629_com_js.getI18nText('initConfigInfoComplete'), true);
				wt629_com_js.readConfigData();
			}
		},


		// 读取配置数据
		readConfigData: function(){
			var config = localStorage.getItem('wt629_com_auto_voteup_config_v2_8');
			try{
				if (config != null && config != undefined && config != ''){
					wt629_com_js.config = JSON.parse(config);
					wt629_com_js.checkIsConfig();
				}
			}catch (e) {
				wt629_com_js.log(wt629_com_js.getI18nText('loadDefaultConfigError') + e, true);
				wt629_com_js.log(wt629_com_js.getI18nText('restDefaultConfig') , true);
				wt629_com_js.config = null;
				wt629_com_js.checkIsConfig();
			}
		},


		// 同步设置到表单
		syncConfigDataToForm: function(){
			wt629_com_js.log(wt629_com_js.getI18nText('syncConfigToForm'), true);
			if (wt629_com_js.config.isEnable){
				$('#wt629_com_is_enable').attr('checked','checked');
			}
			if (wt629_com_js.config.isShow){
				$('#wt629_com_is_show').attr('checked','checked');
			}
			if (wt629_com_js.config.isTimedRefresh){
				$('#wt629_com_is_timed_refresh').attr('checked','checked');
			}
			if (wt629_com_js.config.refreshTimeout == null || wt629_com_js.config.refreshTimeout == '' || isNaN(wt629_com_js.config.refreshTimeout)){
				wt629_com_js.log(wt629_com_js.getI18nText('refreshTimeoutValueErrorTip'), true);
				wt629_com_js.config.refreshTimeout = 60;
				// 保存设置
				wt629_com_js.saveConfig();
			}
			$('#wt629_com_refresh_timeout').val(wt629_com_js.config.refreshTimeout);

			// 空值检查
			if (wt629_com_js.config.thumbHappyByRecommendation == null || wt629_com_js.config.thumbHappyByRecommendation == undefined) {
				wt629_com_js.config.thumbHappyByRecommendation = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpGamePurchase == null || wt629_com_js.config.thumbUpGamePurchase == undefined) {
				wt629_com_js.config.thumbUpGamePurchase = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpRecommendation == null || wt629_com_js.config.thumbUpRecommendation == undefined) {
				wt629_com_js.config.thumbUpRecommendation = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpScreenshot == null || wt629_com_js.config.thumbUpScreenshot == undefined) {
				wt629_com_js.config.thumbUpScreenshot = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpUserStatus == null || wt629_com_js.config.thumbUpUserStatus == undefined) {
				wt629_com_js.config.thumbUpUserStatus = true;
				wt629_com_js.saveConfig();
			}
			if (wt629_com_js.config.thumbUpWorkshopItemPublished == null || wt629_com_js.config.thumbUpWorkshopItemPublished == undefined) {
				wt629_com_js.config.thumbUpWorkshopItemPublished = true;
				wt629_com_js.saveConfig();
			}

			if (wt629_com_js.config.thumbHappyByRecommendation){
				$('#wt629_com_config_thumb_happy_by_recommendation').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpGamePurchase){
				$('#wt629_com_config_thumb_up_game_purchase').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpRecommendation){
				$('#wt629_com_config_thumb_up_recommendation').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpScreenshot){
				$('#wt629_com_config_thumb_up_screenshot').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpUserStatus){
				$('#wt629_com_config_thumb_up_user_status').attr('checked','checked');
			}
			if (wt629_com_js.config.thumbUpWorkshopItemPublished){
				$('#wt629_com_config_thumb_up_workshop_item_published').attr('checked','checked');
			}

			wt629_com_js.log(wt629_com_js.getI18nText('syncConfigToFormComplete'), true);
		},


		// 显示控制面板
		showControlPanel: function(){
			$('#wt629_com_controlPanel').css('width',wt629_com_js.getI18nText('divWidth') + 'px');
			$('.wt629_com_controlPanel_main').show();
		},

		// 隐藏控制面板
		hideControlPanel: function(){
			$('#wt629_com_controlPanel').css('width','100px');
			$('.wt629_com_controlPanel_main').hide();
		},

		// 检查面板是否显示
		checkIsShow: function(){
			if (wt629_com_js.config.isShow){
				wt629_com_js.showControlPanel();
			}else{
				wt629_com_js.hideControlPanel();
			}
		},

		//设置默认超时时间
		setDefaultTimeOut: function(){
			wt629_com_js.log(wt629_com_js.getI18nText('refreshTimeoutValueErrorTip'), true);
			wt629_com_js.config.refreshTimeout = 60;
			// 保存
			wt629_com_js.saveConfig();
		},


		// 设置事件
		setEvent: function(){
			// 显示隐藏事件
			$('#wt629_com_controlPanel_show_or_hide').click(function(){
				if ($('.wt629_com_controlPanel_main').is(':hidden')){
					$('#wt629_com_controlPanel').css('width',wt629_com_js.getI18nText('divWidth') + 'px');
					$('.wt629_com_controlPanel_main').show();
				}else{
					$('#wt629_com_controlPanel').css('width','100px');
					$('.wt629_com_controlPanel_main').hide();
				}
			});


			// 表单 点击事件
			$('.wt629_com_cpfrom').click(function(){
				wt629_com_js.config.isEnable= $('#wt629_com_is_enable').is(':checked');
				wt629_com_js.config.isShow = $('#wt629_com_is_show').is(':checked');
				wt629_com_js.config.isTimedRefresh = $('#wt629_com_is_timed_refresh').is(':checked');
				wt629_com_js.config.refreshTimeout = $('#wt629_com_refresh_timeout').val();

				wt629_com_js.config.thumbHappyByRecommendation = $('#wt629_com_config_thumb_happy_by_recommendation').is(':checked');
				wt629_com_js.config.thumbUpGamePurchase = $('#wt629_com_config_thumb_up_game_purchase').is(':checked');
				wt629_com_js.config.thumbUpRecommendation = $('#wt629_com_config_thumb_up_recommendation').is(':checked');
				wt629_com_js.config.thumbUpScreenshot = $('#wt629_com_config_thumb_up_screenshot').is(':checked');
				wt629_com_js.config.thumbUpUserStatus = $('#wt629_com_config_thumb_up_user_status').is(':checked');
				wt629_com_js.config.thumbUpWorkshopItemPublished = $('#wt629_com_config_thumb_up_workshop_item_published').is(':checked');

				wt629_com_js.log(wt629_com_js.getI18nText('saveConfig'), true);
				// 保存
				wt629_com_js.saveConfig();
				wt629_com_js.log(wt629_com_js.getI18nText('saveConfigComplete'), true);
			});

			// 手动点赞事件
			$('#wt629_com_config_thumb_happy_by_recommendation_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', true, wt629_com_js.getI18nText('typeRecommendation'));
			});
			$('#wt629_com_config_thumb_up_game_purchase_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block  .blotter_gamepurchase', false, wt629_com_js.getI18nText('typeGamePurchase'));
			});
			$('#wt629_com_config_thumb_up_recommendation_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', false, wt629_com_js.getI18nText('typeRecommendationAllUp'));
			});
			$('#wt629_com_config_thumb_up_screenshot_a').click(function() {
				// wt629_com_js.thumbUpByClass('.blotter_block  .blotter_screenshot', false, '用户截图');
                wt629_com_js.thumbUpByScreenshot(wt629_com_js.getI18nText('typeScreenshot'));
			});
			$('#wt629_com_config_thumb_up_user_status_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block .blotter_userstatus', false, wt629_com_js.getI18nText('typeUserStatus'));
			});
			$('#wt629_com_config_thumb_up_workshop_item_published_a').click(function() {
				wt629_com_js.thumbUpByClass('.blotter_block  .blotter_workshopitempublished', false, wt629_com_js.getI18nText('typeWorkshopItemPublished'));
			});

			// 语言选项
			$('#wt629_com_config_language_chinese').click(function() {
				wt629_com_js.config.language = 'chinese';
				wt629_com_js.log(wt629_com_js.getI18nText('saveConfig'), true);
				wt629_com_js.saveConfig();
				wt629_com_js.log(wt629_com_js.getI18nText('saveConfigComplete'), true);
				location.reload(true);
			});
			$('#wt629_com_config_language_english').click(function() {
				wt629_com_js.config.language = 'english';
				wt629_com_js.log(wt629_com_js.getI18nText('saveConfig'), true);
				wt629_com_js.saveConfig();
				wt629_com_js.log(wt629_com_js.getI18nText('saveConfigComplete'), true);
				location.reload(true);
			});

		},



		// 页面超时剩余时间
		pageTimeOut : -99,
		// 超时计时器
		interval: null,

		// 页面刷新超时
		pageReloadTimeOut: function(){
			var isTimedRefresh = wt629_com_js.config.isTimedRefresh;
			var refreshTimeout = wt629_com_js.config.refreshTimeout;
			if (isNaN(refreshTimeout)){
				wt629_com_js.setDefaultTimeOut();
			}
			if (wt629_com_js.pageTimeOut == -99){
				wt629_com_js.pageTimeOut = refreshTimeout;
			}
			if(!isTimedRefresh){
				$('#wt629_com_controlPanel_page_reload_tip').html('');
			}
			if (wt629_com_js.pageTimeOut <= 0){
				clearInterval(wt629_com_js.interval);
				$('#wt629_com_controlPanel_page_reload_tip').html(wt629_com_js.getI18nText('refreshing'));
				location.reload(true);
			}else{
				$('#wt629_com_controlPanel_page_reload_tip').html(wt629_com_js.pageTimeOut + wt629_com_js.getI18nText('secondsLaterRefresh'));
				wt629_com_js.pageTimeOut --;
			}
		},


		// 点赞事件
		thumbUpEvnet: function(){
			if (wt629_com_js.config.isEnable){
				wt629_com_js.log(wt629_com_js.getI18nText('thumbUpConfigEnable'), true);
				// 批量点赞

				if (wt629_com_js.config.thumbUpGamePurchase){
					wt629_com_js.thumbUpByClass('.blotter_block  .blotter_gamepurchase', false, wt629_com_js.getI18nText('typeGamePurchase'));
				}
				if (wt629_com_js.config.thumbUpRecommendation){
					if (wt629_com_js.config.thumbHappyByRecommendation){
						wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', true, wt629_com_js.getI18nText('typeRecommendation'));
					}else{
						wt629_com_js.thumbUpByClass('.blotter_block .blotter_recommendation', false,wt629_com_js.getI18nText('typeRecommendationAllUp'));
					}
				}
				if (wt629_com_js.config.thumbUpScreenshot){
					wt629_com_js.thumbUpByScreenshot(wt629_com_js.getI18nText('typeScreenshot'));
				}
				if (wt629_com_js.config.thumbUpUserStatus){
					wt629_com_js.thumbUpByClass('.blotter_block .blotter_userstatus', false, wt629_com_js.getI18nText('typeUserStatus'));
				}
				if (wt629_com_js.config.thumbUpWorkshopItemPublished){
					wt629_com_js.thumbUpByClass('.blotter_block  .blotter_workshopitempublished', false, wt629_com_js.getI18nText('typeWorkshopItemPublished'));
				}

				wt629_com_js.log(wt629_com_js.getI18nText('batchThumbUpComplete'), true);

				var isTimedRefresh = wt629_com_js.config.isTimedRefresh;
				var refreshTimeout = wt629_com_js.config.refreshTimeout;
				if (isNaN(refreshTimeout)){
					wt629_com_js.setDefaultTimeOut();
				}
				if (wt629_com_js.config.isTimedRefresh){
					wt629_com_js.interval = setInterval(wt629_com_js.pageReloadTimeOut, 1000);
				}

			}else{
				wt629_com_js.log(wt629_com_js.getI18nText('thumbUpConfigDisable'), true);
			}
		},


		thumbUpByClass: function(className, isThumbHappyByRecommendation, logType) {

            // 所有点赞按钮
            var thumbUpObject = $(className);
            // 所有可以点赞的数量
            var thumbUpNum = thumbUpObject.length;
            // 点赞的数量
            var thumbUpActiveNum = 0;
            // 点赞欢乐的数量
            var thumbUpHappyNum = 0;
            // 未点赞的数量
            var thumbUpNotActiveNum = 0;
            // 已经点赞的数量
            var thumbUpAlreadyActiveNum = 0;
            thumbUpObject.each(function(){
                var activeObject = $(this).find('.active');
                var activeBtnObject = $(this).find('.btn_active');
                /*console.log('activeObject');
                console.log(activeObject);
                console.log(activeBtnObject);*/
                if ((activeObject == null || activeObject.length == 0)&&(activeBtnObject == null || activeBtnObject.length == 0)){
                    thumbUpNotActiveNum ++;
                    var isThumbsUp = false;
                    var isFunny = false;
                    if (isThumbHappyByRecommendation){
                        var thumb = $(this).find('.thumb');
                        if (thumb != null && $(thumb).html() != null){
                            var html = $(thumb).html();
                            if (html.indexOf('thumbsUp.png') > -1){
                                isThumbsUp = true;
                            }else if (html.indexOf('thumbsDown.png') > -1){
                                isFunny = true;
                            }
                        }
                    }else{
                        isThumbsUp = true;
                    }
                    if (isThumbsUp){
                        thumbUpActiveNum ++;
                        var thumbUp = $(this).find('.thumb_up');
                        if (thumbUp != null){
                            $(thumbUp).css('border-bottom','1px solid #F00');
                            $(thumbUp).parent().parent().click();
                        }
                    }
                    if (isFunny){
                        thumbUpHappyNum ++;
                        var funny = $(this).find('.funny');
                        if (funny != null){
                            $(funny).css('border-bottom','1px solid #F00');
                            $(funny).parent().parent().click();
                        }
                    }
                }else{
                    thumbUpAlreadyActiveNum ++;
                }
            });
            wt629_com_js.log(logType + wt629_com_js.getI18nText('thumbUpComplete'), true);
            // wt629_com_js.log('共' + thumbUpNum + '次->已点赞' + thumbUpAlreadyActiveNum + '次，本次(点赞' + thumbUpActiveNum + '次，欢乐' + thumbUpHappyNum + '次)', true);
			wt629_com_js.log(wt629_com_js.getI18nText('thumbUpCount')+ thumbUpNum + wt629_com_js.getI18nText('alreadyThumbUpCount')+ thumbUpAlreadyActiveNum + wt629_com_js.getI18nText('currentThumbUpCount') + thumbUpActiveNum + wt629_com_js.getI18nText('currentHappyCount')+ thumbUpHappyNum , true);
		},

        thumbUpByScreenshot: function(logType) {
            // 所有点赞按钮
            var thumbUpObject = $('.blotter_block  .blotter_screenshot .thumb_up');
            // 所有可以点赞的数量
            var thumbUpNum = thumbUpObject.length;
            // 点赞的数量
            var thumbUpActiveNum = 0;
            // 未点赞的数量
            var thumbUpNotActiveNum = 0;
            // 已经点赞的数量
            var thumbUpAlreadyActiveNum = 0;
            thumbUpObject.each(function(){
                var activeObject = $(this).parent().parent().parent().find('.active');
                var activeBtnObject = $(this).parent().parent().parent().find('.btn_active');
                /*console.log('activeObject');
                console.log(activeObject);
                console.log(activeBtnObject);*/
                if ((activeObject == null || activeObject.length == 0)&&(activeBtnObject == null || activeBtnObject.length == 0)){
                    thumbUpNotActiveNum ++;
                    thumbUpActiveNum ++;
                    var thumbUp = $(this).parent().parent().parent().find('.thumb_up');
                    if (thumbUp != null){
                        $(thumbUp).css('border-bottom','1px solid #F00');
                        $(thumbUp).parent().parent().click();
                    }
                }else{
                    thumbUpAlreadyActiveNum ++;
                }
            });
            wt629_com_js.log(logType + wt629_com_js.getI18nText('thumbUpComplete'), true);
            // wt629_com_js.log('共' + thumbUpNum + '次->已点赞' + thumbUpAlreadyActiveNum + '次，本次(点赞' + thumbUpActiveNum + '次)', true);
			wt629_com_js.log(wt629_com_js.getI18nText('thumbUpCount')+ thumbUpNum + wt629_com_js.getI18nText('alreadyThumbUpCount')+ thumbUpAlreadyActiveNum + wt629_com_js.getI18nText('currentThumbUpCount') + thumbUpActiveNum , true);
        },

		setControlPanelHtml: function() {
			wt629_com_js.controlPanelHtml += "<div id='wt629_com_controlPanel' class='wt629_com_controlPanelClass' style='font-size: 10px; position:fixed; top: 10px; left: 10px; background-color: rgb(66, 56, 56); z-index: 450; color: white; width : {{divWidth}}px; opacity: 0.9;'>";
			wt629_com_js.controlPanelHtml += "\t<div style='float: right;'>";
			wt629_com_js.controlPanelHtml += "\t\t<span id='wt629_com_controlPanel_page_reload_tip' ></span>";
			wt629_com_js.controlPanelHtml += "\t\t<span id='wt629_com_controlPanel_show_or_hide' ><a href='javascript:void(0);' style='color: red;'>{{showOrHide}}</a></span>";
			wt629_com_js.controlPanelHtml += "\t</div>";
			wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main'>{{steamAutoVoteupScriptConsole}}<br/>{{steamAutoVoteupScriptConsoleVersion}}<a href='https://steamcommunity.com/sharedfiles/filedetails/?id=1709983331'>{{configDetailGui}}</a></div>";
			wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main' style='margin-left:20px;'>";
			wt629_com_js.controlPanelHtml += "\t\t<div>{{option}}</div>";
			wt629_com_js.controlPanelHtml += "\t\t<div style='margin-left:20px;'>";
			wt629_com_js.controlPanelHtml += "\t\t\t<div> ";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<span>{{language}}&nbsp;<a href='javascript:void(0)' id='wt629_com_config_language_chinese'>中文</a>&nbsp;<a href='javascript:void(0)' id='wt629_com_config_language_english'>English</a></span>";
			wt629_com_js.controlPanelHtml += "\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t<div> ";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_enable\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<span>{{enableAutoVoteup}}</span>";
			wt629_com_js.controlPanelHtml += "\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t<div style='margin-left:20px;'>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div> ";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_show\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>{{defaultShowConsoleView}}</span>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_is_timed_refresh\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>{{autoRefreshPage}}</span>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"number\" id=\"wt629_com_refresh_timeout\" class=\"wt629_com_cpfrom\" min=\"10\" max=\"3600\" style='width:50px;' />";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>{{autoRefreshPageTime}}</span>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div><br/>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_user_status\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>{{contentUserPublishStatus}}</span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_user_status_a\" style='color: red;'>{{manualThumbsUp}}</a>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_workshop_item_published\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>{{contentUserFavorites}}</span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_workshop_item_published_a\" style='color: red;'>{{manualThumbsUp}}</a>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_game_purchase\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>{{contentUserBuyGame}}</span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_game_purchase_a\" style='color: red;'>{{manualThumbsUp}}</a>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_screenshot\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>{{contentUserImages}}</span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_screenshot_a\" style='color: red;'>{{manualThumbsUp}}</a>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_up_recommendation\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<span>{{contentUserEvaluate}}</span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_up_recommendation_a\" style='color: red;'>{{manualThumbsUp}}</a>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t<div style='margin-left:20px;'>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t<div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t\t<input type=\"checkbox\" id=\"wt629_com_config_thumb_happy_by_recommendation\" class=\"wt629_com_cpfrom\">";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t\t<span>{{contentUserNotThumbsUpHappy}}</span><a href='javascript:void(0);' id=\"wt629_com_config_thumb_happy_by_recommendation_a\" style='color: red;'>{{manualThumbsUp}}</a>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t\t</div>";
			wt629_com_js.controlPanelHtml += "\t</div>";
			wt629_com_js.controlPanelHtml += "\t<div class='wt629_com_controlPanel_main' style='margin-left:0px; border-top: 1px solid white;'>";
			wt629_com_js.controlPanelHtml += "\t\t<div>{{logMessage}}</div>";
			wt629_com_js.controlPanelHtml += "\t\t<div style='margin-left:10px;' id='wt629_com_controlPanel_msg'></div>";
			wt629_com_js.controlPanelHtml += "\t</div>";
			wt629_com_js.controlPanelHtml += "</div>";
			wt629_com_js.controlPanelHtml += "";


			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{divWidth\}\}/g, wt629_com_js.getI18nText('divWidth'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{language\}\}/g, wt629_com_js.getI18nText('language'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{showOrHide\}\}/g, wt629_com_js.getI18nText('showOrHide'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{steamAutoVoteupScriptConsole\}\}/g, wt629_com_js.getI18nText('steamAutoVoteupScriptConsole'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{steamAutoVoteupScriptConsoleVersion\}\}/g, wt629_com_js.getI18nText('steamAutoVoteupScriptConsoleVersion'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{configDetailGui\}\}/g, wt629_com_js.getI18nText('configDetailGui'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{option\}\}/g, wt629_com_js.getI18nText('option'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{enableAutoVoteup\}\}/g, wt629_com_js.getI18nText('enableAutoVoteup'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{defaultShowConsoleView\}\}/g, wt629_com_js.getI18nText('defaultShowConsoleView'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{autoRefreshPage\}\}/g, wt629_com_js.getI18nText('autoRefreshPage'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{autoRefreshPageTime\}\}/g, wt629_com_js.getI18nText('autoRefreshPageTime'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{manualThumbsUp\}\}/g, wt629_com_js.getI18nText('manualThumbsUp'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{contentUserPublishStatus\}\}/g, wt629_com_js.getI18nText('contentUserPublishStatus'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{contentUserFavorites\}\}/g, wt629_com_js.getI18nText('contentUserFavorites'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{contentUserBuyGame\}\}/g, wt629_com_js.getI18nText('contentUserBuyGame'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{contentUserImages\}\}/g, wt629_com_js.getI18nText('contentUserImages'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{contentUserEvaluate\}\}/g, wt629_com_js.getI18nText('contentUserEvaluate'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{contentUserNotThumbsUpHappy\}\}/g, wt629_com_js.getI18nText('contentUserNotThumbsUpHappy'));
			wt629_com_js.controlPanelHtml = wt629_com_js.controlPanelHtml.replace(/\{\{logMessage\}\}/g, wt629_com_js.getI18nText('logMessage'));
		},

	};





	$(document).ready(function() {
		try{
			// 全局
			// window.wt629_com_js = wt629_com_js;

			// 读取配置数据
			wt629_com_js.readConfigData();

			// 设置HTML
			wt629_com_js.setControlPanelHtml();

			$('body').append(wt629_com_js.controlPanelHtml);

			// 检查是否可视
			wt629_com_js.checkIsShow();

			// 显示配置到表单
			wt629_com_js.syncConfigDataToForm();

			// 设置事件
			wt629_com_js.setEvent();

			// 点赞事件
			wt629_com_js.thumbUpEvnet();
		}catch (e) {
			wt629_com_js.log(wt629_com_js.getI18nText('scriptError') + e);
		}

	});

})();
