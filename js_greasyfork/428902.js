// ==UserScript==
// @name     Hpoi fan translation
// @namespace https://takkkane.tumblr.com/scripts/hpoiTranslation
// @supportURL     https://twitter.com/TaxDelusion
// @description A script that translates common text on Hpoi - anime figures database
// @version  0.4.3
// @include  https://www.hpoi.net/*
// @include  https://www.hpoi.net.cn/*
// @require  https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/locale/zh-cn.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/expect/1.10.0/expect.min.js
// @license	 MIT
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/428902/Hpoi%20fan%20translation.user.js
// @updateURL https://update.greasyfork.org/scripts/428902/Hpoi%20fan%20translation.meta.js
// ==/UserScript==

(function () {
	/*
	Expect library by mjackson https://github.com/mjackson/expect
	 */

	/* worthy examples:
	 * working with hpoi: https://github.com/ntzyz/hpoi-info-tgbot/blob/master/src/entry.ts
	 * tricky html items: https://greasyfork.org/en/scripts/384708-bilibili-danmaku-translator/code
	 */

	/* ==== RESOURCES ===== */

	const TRANSLATIONS = {
		// 'dictionary' : {
		// 'word' : 'translation', }
		en: {
			'profile_stats': {
				'关注': 'followed',
				'粉丝': 'followers',
				'赞!': 'likes',
				'获赞 ': 'likes',/* additional space for GK makers in home page*/
				'获赞': 'likes'
			},
			'profile_desc': {
				'还没有信仰_(:з」∠)_': 'not much to say _(:з」∠)_',
			},
			/* HOME PAGE - FEEDS */
			'home_username_info_type': {
				'制作决定': 'New item announced',
				'官图更新': 'Official pictures update',
				'预订时间': 'Preorders opened',
				'预定时间': 'Preorders opened',
				'出荷延期': 'Release postponed',
				'出荷时间': 'Release time',
				'再版确定': 'Re-release confirmed',
				'情报更新': 'Info updated',
			},
			'home_image_type_name': {
				'手办': 'Figure',
				'动漫模型': 'A. model',
				'真实模型': 'R. model',
				'毛绒布偶': 'Plushie',
				'Doll娃娃': 'Doll',
				'相册': 'Album',
				'厂商': 'Manufacturer',
				'系列': 'Line',
				'作品': 'Series',
				'角色': 'Character',
			},
			/* ITEM PAGE */
			'more_button': {
				'更多': 'more',
				'换一换': 'refresh',
				'新建相册': 'new album',
				'写简评': 'new review',
				'添加': 'add'
			},
			'load_more_button': {
				'加载更多': 'Load more',
			},
			'search-searchbox': { /*在结果中查找*/
				'placeholder': 'Search within the results'
			},

			// types (filter)
			'x_generic_all': {
				'全部': 'all',
				'不限': 'all', // actualy - non required
				'周边': 'all',
			},
			'x_generic_all_capitalized': {
				'全部': 'All',
				'不限': 'All', // actualy - non required
				'周边': 'All',
			},

			'其它': 'other',

			/* SORTED DIC */
			'x_item_types': {
				'手办': 'Figure',
				'动漫模型': 'Anime model',
				'真实模型': 'Real model',
				'毛绒布偶': 'Plushie',
				'Doll娃娃': 'Doll',
				'动漫周边': 'Merch',
				'其它': 'Other',
			},
			'x_item_types_plural': {
				'手办': 'Figures',
				'动漫模型': 'Anime models',
				'真实模型': 'Real models',
				'毛绒布偶': 'Plushies',
				'Doll娃娃': 'Dolls',
				'doll娃娃': 'Dolls',
				'GK/DIY模型': 'Garage kits/models',
				'GK/其他': 'Garage kits/other'
			},
			'x_subtypes_figures': {
				'比例人形': 'Scale figure',
				'Q版人形': 'Chibi figure',
				'盒蛋/扭蛋': 'Blind box/gacha',
				'怪兽/机械': 'Monster/mecha',
				'仿真人物': 'Real person',
				'配件': 'Accessory',
				'场景': 'Diorama',
				'其它': 'Other',
			},
			'x_subtypes_anime_models': {
				'机甲-拼装': 'Mecha - to assembly',
				'机甲-完成品': 'Mecha - completed',
				'机甲-配件': 'Mecha - accessory',
				'特摄英雄': 'Tokusatsu hero',
				'特摄怪兽': 'Tokusatsu monster',
				'特摄配件': 'Tokusatsu accessory',
				'扭蛋/玩具': 'Gacha/toy',
				'驱动模型-四驱车': 'Vehicle (4 wheels)',
				'驱动模型-配件': 'Vehicle accessory',
				'其它': 'Other',
			},
			'x_subtypes_real_models': {
				'拼装': 'To assembly',
				'完成品': 'Completed',
				'人形': 'Person',
				'场景配件': 'Diorama accessory',
				'工具材料': 'Tool',
			},
			'x_subtypes_plushies': {
				'拟人形': 'Anthropomorphic',
				'人形': 'Human',
				'动植物': 'Flora and fauna',
			},
			'x_subtypes_dolls': {
				'Doll完成品': 'Complete doll',
			},
			'x_subtypes_merch': {
				'立牌/摆件': 'Character stand',
				'箱包鞋服': 'Bags and shoes',
				'穿戴配饰': 'Clothes',
				'徽章/挂件': 'Badges / keychains',
				'海报/装饰画': 'Artworks',
				'抱枕/家纺': 'Daily use / stationery',
				'日用/文具': 'Linens',
				'数码/配件': 'Digital / accesories',
				'拼图纸膜': 'Papercraft',
				'其它周边': 'Other merch',
			},
			'x_other': {
				'其它': 'Other',
				'其他': 'Other',
			},
			'x_series_types': {
				'动画': 'Anime',
				'小说': 'Novel',
				'游戏': 'Game',
				'其它': 'Other',
			},
		}
	};

	const PLACES = {
		/* OTHER */
		'logged_in_indicator': '.hpoi-navpersonal',
		'profile_stats': '.user-box-content > .row > div',
		'profile_desc': '.user-box-content-detail > small',
		/* HOME ITEM PAGE */
		'home_item_props': 'div.hpoi-database-content > div > div.hpoi-dataBase-item > div > div.hpoi-database-text > div > span:nth-of-type(1)',
		/* OTHER */
		'more_button': '.hpoi-btn-border > span',
		'search-searchbox': '#realPage-keyword',
	};

	/* ==== TRANSLATE ===== */

	/*
	 * itemInQuestion - name of the jsquery selector/dictionary
	 * subDictionaries - list of disctionaries, used in dic_first method only
	 * methodType
	- 'item_first' - replace the exact string appearing in itemInQuestion results
	- 'dic_first' - check all keys listed in subDictionaries and replace them with translations stored in values
	 * elementsInQuestion - optional if you'd like to use
	 */
	const doTranslation = function (itemInQuestion, subDictionaries = [], methodType = 'item_first', elementsInQuestion) {
		if (subDictionaries.length) {
			methodType = 'dic_first';
		}
		let items;
		if (!elementsInQuestion)
			items = $(PLACES[itemInQuestion]);
		else
			items = elementsInQuestion;

		let textItems = items.contents().filter(function () {
				return this.nodeType === Node.TEXT_NODE;
			});

		textItems.each(function (i, e) {
			if (methodType == 'item_first') {
				let bad = e.textContent.trim();
				let translation = TRANSLATIONS.en[itemInQuestion][bad];
				if (translation) {
					e.textContent = translation;
				}
			} else if (methodType == 'dic_first') {
				let translationDone = 0;
				e.textContent = e.textContent.trim();
				let toTranslate = e.textContent;
				for (const subDictionary of subDictionaries) {
					for (const subDictionaryEntry of Object.entries(TRANSLATIONS.en[subDictionary])) { /*[0] key [1] value*/
						e.textContent = toTranslate.replace(subDictionaryEntry[0], subDictionaryEntry[1]);
						if (e.textContent != toTranslate) {
							translationDone = 1;
							break;
						}
					}
					if (translationDone) {
						break;
					}
				}
			}
		});
	};

	const doDateFormat = function (dateCn) {
		let date,
		dateEn;
		if (dateCn.indexOf('日') != -1 && dateCn.indexOf('月') != -1 && dateCn.indexOf('年') != -1) {
			date = moment(dateCn, "YYYY年MM月DD日");
			dateEn = date.format("DD/MM/YYYY");
		} else if (dateCn.indexOf('日') == -1 && dateCn.indexOf('月') != -1 && dateCn.indexOf('年') != -1) {
			date = moment(dateCn, "YYYY年MM月");
			dateEn = date.format("MM/YYYY");
		} else if (dateCn.indexOf('日') == -1 && dateCn.indexOf('月') == -1 && dateCn.indexOf('年') != -1) {
			date = moment(dateCn, "YYYY年");
			dateEn = date.format("YYYY");
		} else if (dateCn.indexOf('日') != -1 && dateCn.indexOf('月') != -1 && dateCn.indexOf('年') == -1) {
			date = moment(dateCn, "MM月DD日");
			dateEn = date.format("DD/MM/20[XX]");
		}
		return dateEn;
	};

	const translateFixedDate = function (cnDateElements) {
		cnDateElements.each(function (i, e) {
			let bad = e.textContent.trim();
			if (bad == '未知') {
				e.textContent = 'Unknown';
			} else {
				e.textContent = (doDateFormat(bad));
			}
		});
	};

	const translateRelativeDate = function (datesTextesReleaseDate) {
		datesTextesReleaseDate.each(function (i, e) {
			let bad = e.textContent.trim();
			let good = bad;
			if (bad == "刚刚")
				good = "just now";
			else if (bad == "1分钟前")
				good = "a minute ago";
			else if (bad.includes('分钟前'))
				good = bad.replace("分钟前", " minutes ago");
			else if (bad == "1小时前")
				good = "an hour ago";
			else if (bad.includes('小时前'))
				good = bad.replace("小时前", " hours ago");
			else if (bad == "1天前")
				good = "a day ago";
			else if (bad.includes('天前'))
				good = bad.replace("天前", " days ago");
			else if (bad == "1个月前")
				good = "a month ago";
			else if (bad.includes('个月前'))
				good = bad.replace("个月前", " months ago");
			else if (bad == "1年前")
				good = "a year ago";
			else if (bad.includes('年前'))
				good = bad.replace("年前", " years ago");
			else
				console.log("unresolved relative date [" + bad + "]");
			e.textContent = good;
		});
	};

	/* ==== TESTS ===== */

	const testTranslationMap = function (submapToCheck) {
		expect(PLACES[submapToCheck]).toExist("jquery for [" + submapToCheck + "] should exists.");
		expect($(PLACES[submapToCheck])).toExist("items found via jquery for [" + submapToCheck + "] should exist.");
		$(PLACES[submapToCheck]).each(function (i, e) {
			expect(Object.values(TRANSLATIONS.en[submapToCheck]).find(translation => translation.includes(e.textContent.trim())))
			.toBeTruthy("No translation provided for [" + e.textContent + "] in [" + submapToCheck + "] map!");
		});
	};

	const testTranslationMapForDic = function (placeToCheck, dictionaries) {
		expect(PLACES[placeToCheck]).toExist("jquery for [" + placeToCheck + "] should exists.");
		expect($(PLACES[placeToCheck])).toExist("items found via jquery for [" + placeToCheck + "] should exist.");

		$(PLACES[placeToCheck]).each(function (i, e) {
			let translationIsDone = 0;
			let translatedText = e.textContent.trim();
			if (translatedText.length == 0) {
				return; /*continue*/
			}
			for (const subDictionary of dictionaries) {
				let subDictionaryEntries = [];
				if ($.type(subDictionary) === "string") {
					subDictionaryEntries = Object.entries(TRANSLATIONS.en[subDictionary]);
				} else {
					subDictionaryEntries = subDictionary;
				}

				for (const subDictionaryEntry of subDictionaryEntries) { /*[0] key [1] value*/
					translationIsDone = translatedText.includes(subDictionaryEntry[1]);
					if (translationIsDone) {
						break;
					}
				}
				if (translationIsDone) {
					break;
				}
			}
			expect(translationIsDone).toBeTruthy(
				"No translation provided for [" + translatedText + "] in [" + dictionaries.join() + "] maps!");
		});

	};

	/* SECTIONS */

	const section = {
		translations: {},
		places: {},

		doTranslation(itemInQuestion, subDictionaries = [], elementsInQuestion) {
			const me = this;
			let items;
			if (!elementsInQuestion)
				items = $(this.places[itemInQuestion]);
			else
				items = elementsInQuestion;

			let mainFunction = function (i, e) {
				if (!subDictionaries.length) {
					e.textContent = e.textContent.trim();
					const bad = e.textContent;
					let translation = me.translations.en[itemInQuestion][bad];
					if (translation) {
						e.textContent = translation;
					}
				} else {
					let translationDone = 0;
					e.textContent = e.textContent.trim();
					let toTranslate = e.textContent;
					for (const subDictionaryName of subDictionaries) {
						let subDictionary;
						if (typeof(subDictionaryName) === 'string') {
							subDictionary = me.translations.en[subDictionaryName];
						} else {
							subDictionary = subDictionaryName;
						}

						for (const subDictionaryEntry of Object.entries(subDictionary)) { /*[0] key [1] value*/
							e.textContent = toTranslate.replace(subDictionaryEntry[0], subDictionaryEntry[1]);
							if (e.textContent != toTranslate) {
								translationDone = 1;
								break;
							}
						}
						if (translationDone) {
							break;
						}
					}
				}
			};

			if (!!(items.contents) == true) {
				var textItems = items.contents().filter(function () {
						return this.nodeType === Node.TEXT_NODE;
					});
				textItems.each(mainFunction);
			} else if (Array.isArray(items)) {
				$.each(items, mainFunction);
			}
		},

		createAndUseObserverForList(callback, place) {
			callback();
			let Observer = new MutationObserver(callback);
			Observer.observe(place, {childList: true});
		},
		testTranslationMap(submapToCheck) {
			const me = this;
			expect(me.places[submapToCheck]).toExist("jquery for [" + submapToCheck + "] should exists.");
			expect($(me.places[submapToCheck])).toExist("items found via jquery for [" + submapToCheck + "] should exist.");
			$(me.places[submapToCheck]).each(function (i, e) {
				expect(Object.values(me.translations.en[submapToCheck]).find(translation => translation.includes(e.textContent.trim())))
				.toBeTruthy("No translation provided for [" + e.textContent + "] in [" + submapToCheck + "] map!");
			});
		},

		testTranslationMapForDic(placeToCheck, dictionaries) {
			const me = this;
			expect(me.places[placeToCheck]).toExist("jquery for [" + placeToCheck + "] should exists.");
			expect($(me.places[placeToCheck])).toExist("items found via jquery for [" + placeToCheck + "] should exist.");

			$(me.places[placeToCheck]).each(function (i, e) {
				let translationIsDone = 0;
				let translatedText = e.textContent.trim();
				if (translatedText.length == 0) {
					return; /*continue*/
				}
				for (const subDictionaryName of dictionaries) {
					let subDictionary;
					if (typeof(subDictionaryName) === 'string') {
						subDictionary = me.translations.en[subDictionaryName];
					} else {
						subDictionary = subDictionaryName;
					}
					for (const subDictionaryEntry of Object.entries(subDictionary)) { /*[0] key [1] value*/
						translationIsDone = translatedText.includes(subDictionaryEntry[1]);
						if (translationIsDone) {
							break;
						}
					}
					if (translationIsDone) {
						break;
					}
				}
				expect(translationIsDone).toBeTruthy(
					"No translation provided for [" + translatedText + "] in [" + dictionaries.join() + "] maps!");
			});
		},

	};

	let glyph_tile_old_section = Object.create(section);
	let glyph_tile_section = Object.create(section);
	let nav_top_section = Object.create(section);
	let home_user_section = Object.create(section);
	let home_item_section = Object.create(section);
	let login_form_section = Object.create(section);
	let settings_section = Object.create(section);
	let global_search_section = Object.create(section);
	let encyclopedia_section = Object.create(section);
	let item_section = Object.create(section);
	let search_section = Object.create(section);

	/* new type tile for items */
	glyph_tile_old_section.translations = {
		en: {
			'tile_properties': {
				'厂商': 'Man', // manufacturer
				'出荷': 'Rele.', // Release date
				'新增': 'Add.', // Addition date
				'价格': 'Price', // Price
				'愿望': 'Wish', // Wished by x people
				'浏览': 'Hits', // how many views
				'评分': 'Rate', // overal rate
				//collection only
				'途径': 'Way', // channel? shop? shipment?
				'补款': 'Due', // how many money yet to paid
				// line only
				'名称': 'Name',
				'作品': 'Count',
				'更新': 'Upd.',
			},
		},
	};
	glyph_tile_old_section.places = {
		'tile_properties': '.hpoi-database-text > div > span:nth-child(1)',
		'tile_values' : '.hpoi-database-text > div > span:nth-child(2)',
	};
	glyph_tile_old_section.translate = function () {
		const me = this;
		me.doTranslation('tile_properties');
		// translate release dates
		let tilePropertiesDic = me.translations.en['tile_properties'];
		let cnDateTextElementsToTranslate = [tilePropertiesDic['出荷'], tilePropertiesDic['新增'], tilePropertiesDic['更新']];
		let cnTileValues = $(me.places['tile_values']);
		let cnDateTextElements = cnTileValues.filter(function () {
				let previousSiblingText = this.previousElementSibling.innerHTML;
				if (cnDateTextElementsToTranslate.includes(previousSiblingText)) {
					return true;
				}
			});
		translateFixedDate(cnDateTextElements);

	};
	glyph_tile_old_section.testTranslation = function () {
		this.testTranslationMap('tile_properties');
	};

	/* new type tile for items */
	glyph_tile_section.translations = {
		en: {
			'tile_properties': {
				'厂商：': 'Man.: ', // manufacturer
				'出荷：': 'Released: ', // Release date
				'新增：': 'Added: ', // Addition date
				'价格：': 'Price: ', // Price
				'愿望：': 'Wish: ', // Wished by x people
				'浏览：': 'Hits: ', // how many views
				'评分：': 'Rate: ', // overal rate
				//collection only
				'途径：': 'Way: ', // channel? shop? shipment?
				'补款：': 'Due: ', // how many money yet to paid
				// line only
				'名称：': 'Name: ',
				'作品：': 'Count: ',
				'更新：': 'Updated: ',
			},
		},
	};
	glyph_tile_section.places = {
		'tile_properties': 'ul.hpoi-glyphicons-list > li > .hpoi-detail-grid-right > .hpoi-detail-grid-info > span > em',
	};
	glyph_tile_section.translate = function () {
		this.doTranslation('tile_properties');
		// translate release dates
		let cnDateTextElementsToTranslate = [this.translations.en['tile_properties']['出荷：'],
			this.translations.en['tile_properties']['新增：'], this.translations.en['tile_properties']['更新：']];
		let cnDateRows = $('.hpoi-detail-grid-info > span');
		let cnDateTextElements = cnDateRows.contents().filter(function () {
				if (this.nodeType === Node.TEXT_NODE) {
					let previousSiblingText = this.previousElementSibling.innerHTML;
					if (cnDateTextElementsToTranslate.includes(previousSiblingText)) {
						return true;
					}
				}
			});
		translateFixedDate(cnDateTextElements);

	};
	glyph_tile_section.testTranslation = function () {
		this.testTranslationMap('tile_properties');
	};

	nav_top_section.translations = {
		en: {
			'nav_top_left_menu': {
				'GK/DIY': 'GK/DIY',
			},
			'nav_top_left_submenu': {
				'分区首页': 'Home',
				'资料库': 'Database',
				'相册': 'Albums',
				'最新发售': 'Latest releases',
				'最新入库': 'Newly added',
				'好评': 'Best rated',
				'再版愿望': 'Most wished',
				'我的收藏': 'My collection',
				'上报缺失': 'Report missing info',
				/* DIY only */
				'原创作品': 'Made from scratch',
				'灰模上色': 'Painted',
				'改造': 'Customs',
				'翻新修复': 'Repairs',
				'发布': 'Publish'
			},
			'nav_top_right_menu': {
				'讨论板': 'Forum',
				'360°照片': '360° pics',
				'厂商': 'Makers',
				'小黑屋': 'Reports',
				'商城': 'Mall',
				'消息': 'Notifications',
				'登录': 'Login',
			},
			'nav_top_right_get_app': {
				'下载客户端': 'Apps',
			},
			'nav_top_get_app_submenu': {
				'点击下载APP': 'Download the app',
				'扫码关注公众号': 'Scan to follow WeChat account',
				'扫码加入Q群:884038717': 'Scan to join WeChat group',
			},
			'nav_top_right_submenu': {
				'厂商首页': 'Home',
				'我的收藏': 'My collection',
				'上报缺失': 'Report missing info',
				'商品上新': 'Recent sales',
				'二手专区': 'Preowned',
				'淘宝自营店': 'Taobao own shop',
				'淘宝天狗店': 'Taobao Tengu shop',
				'淘宝周边店': 'Taobao other shop',
				'淘宝一番赏': 'Taobao rewards'
			},
			'nav_top_personal': {
				'个人中心': 'Profile',
				'我的收藏': 'My collection',
				'返现申请': 'Cashback',
				'好友': 'Friends',
				'消息': 'Messages',
				'私信': 'Messages',
				'账号设置': 'Settings',
				'退出': 'Logout',
			},
			'nav_top_search_drop_list': {
				'全部周边': 'All',
				'角色': 'Character',
				'作品': 'Series',
				'系列': 'Line',
				'人物': 'Person',
				'厂商': 'Company',
				'用户': 'User',
			},
			'nav_top_search_drop_list_default': {
				'全部周边': 'All',
			},
			'nav_top_register_bubble_text': {
				'登录后你可以：': 'With an account, you\'re able to:',
				'免费看高清大图': 'view high quality photos', 
				'发表简评/评论': 'post comments and reviews',
				'多端同步收藏': 'manage your collection',
				'周边情报看不停': 'keep track of new merch',
			},
			'nav_top_register_bubble_button': {
				'登录': 'Sign in',
			},
			'nav_top_register_bubble_first_time': {
				'首次使用？': 'First time? ',
			},
			'nav_top_register_bubble_register': {
				'点击注册': 'Sign up',
			},
			'nav_top_notifications': {
				'系统消息': 'System info',
				'回复我的': 'New replies',
				'收到的赞': 'Likes received',
				'官方推送': 'Official',
				'关注消息': 'Followed info',
				'商品信息': 'Shopping related',
				'私信': 'Messages',
			},
			'nav_top_notification_settings': {
				'设置': 'Settings',
			},
			'nav_top_notification_read': {
				'全部标记已读': 'Mark as read',
			}
		},
	};
	nav_top_section.places = {
		'nav_top_left_menu': '.hpoi-nav-tabbox > .nav-conters-left > li > a',
		'nav_top_left_submenu': '.hpoi-nav-tabbox > .nav-conters-left > li > .hpoi-garagekit-box  > li > a',
		'nav_top_right_menu': '.hpoi-nav-tabbox > .nav-conters-right > li > a:not(.icon-Mobile-phone)',
		'nav_top_right_get_app': 'nav.nav-conters > div.hpoi-nav-tabbox > ul.nav-conters-right > li > .icon-Mobile-phone span',
		'nav_top_right_get_app_submenu': 'nav.nav-conters > div.hpoi-nav-tabbox > ul.nav-conters-right > li > ul.hpoi-Downloadclient > li > a > div',
		'nav_top_right_submenu': '.hpoi-nav-tabbox > .nav-conters-right > li > .hpoi-garagekit-box > li > a',
		'nav_top_personal': 'ul.hpoi-navpersonal > li > a',
		'nav_top_search_drop_list': '.nav-conters-right .dropdown-menu > li > a',
		'nav_top_search_drop_list_default': '#searchItemTypeText',
		'nav_top_register_bubble_text': '.hpoi-nav-user-login > p, .hpoi-nav-user-login > .content > div',
		'nav_top_register_bubble_button': '.nav-login-btn',
		'nav_top_register_bubble_first_time': '.nav-register-box',
		'nav_top_register_bubble_register': '.nav-register-box > a',
		'nav_top_narrow_screen_menu': '.nav-conters-s > .hpoi-nav-boxs > .nav-boxs-item > a:not(.hpoi-icon-phonebox)',
		'nav_top_narrow_screen_get_app': '.nav-conters-s > .hpoi-nav-boxs > .nav-boxs-item > a.hpoi-icon-phonebox > span',
		'nav_top_narrow_screen_get_app_submenu': '.nav-conters-s > .hpoi-nav-boxs > .nav-boxs-item > a.hpoi-icon-phonebox + ul > li > a > div',
		'nav_top_narrow_screen_submenu': '.nav-conters-s > .hpoi-nav-boxs > .nav-boxs-item > a:not(.hpoi-icon-phonebox) + ul > li > a',
		'nav_top_notifications': '.hpoi-news-box > li > a',
		'nav_top_notification_settings': '.hpoi-news-box > li > div > a',
		'nav_top_notification_read': '#msgHaveRead',
	};
	nav_top_section.translate = function () {
		this.doTranslation('nav_top_left_menu', [TRANSLATIONS.en['x_item_types_plural'], 'nav_top_left_menu']);
		this.doTranslation('nav_top_left_submenu');
		$('.hpoi-garagekit-box').css('width', '178px');
		this.doTranslation('nav_top_right_menu');
		this.doTranslation('nav_top_right_get_app');
		this.doTranslation('nav_top_right_get_app_submenu', ['nav_top_get_app_submenu']);
		this.doTranslation("nav_top_right_submenu");
		this.doTranslation("nav_top_personal");
		this.doTranslation('nav_top_search_drop_list', ['nav_top_search_drop_list', TRANSLATIONS.en['x_item_types']]);
		this.doTranslation('nav_top_search_drop_list_default');
		this.doTranslation('nav_top_register_bubble_text');
		this.doTranslation('nav_top_register_bubble_button');
		this.doTranslation('nav_top_register_bubble_first_time');
		this.doTranslation('nav_top_register_bubble_register');
		this.doTranslation('nav_top_narrow_screen_menu', [TRANSLATIONS.en['x_item_types_plural'], 'nav_top_left_menu', 'nav_top_right_menu']);
		this.doTranslation('nav_top_narrow_screen_get_app', ['nav_top_right_get_app']);
		this.doTranslation('nav_top_narrow_screen_get_app_submenu', ['nav_top_get_app_submenu']);
		this.doTranslation('nav_top_narrow_screen_submenu', ['nav_top_personal', 'nav_top_left_submenu', 'nav_top_right_submenu']);
		this.doTranslation('nav_top_notifications');
		this.doTranslation('nav_top_notification_settings');
		this.doTranslation('nav_top_notification_read');
		$(this.places['nav_top_notification_settings']).css('font-size', '13px');
		$(this.places['nav_top_notification_read']).css('font-size', '13px');
	};
	nav_top_section.testTranslation = function () {
		this.testTranslationMapForDic("nav_top_left_menu", [TRANSLATIONS.en['x_item_types_plural'], 'nav_top_left_menu']);
		this.testTranslationMap("nav_top_left_submenu");
		this.testTranslationMap("nav_top_right_menu");
		this.testTranslationMap("nav_top_right_get_app");
		this.testTranslationMapForDic('nav_top_right_get_app_submenu', ['nav_top_get_app_submenu']);
		this.testTranslationMap("nav_top_right_submenu");
		this.testTranslationMap("nav_top_personal");
		this.testTranslationMapForDic('nav_top_search_drop_list', ['nav_top_search_drop_list', TRANSLATIONS.en['x_item_types']]);
		this.testTranslationMap('nav_top_search_drop_list_default');
		this.testTranslationMap('nav_top_register_bubble_text');
		this.testTranslationMap('nav_top_register_bubble_button');
		this.testTranslationMapForDic('nav_top_register_bubble_first_time', ['nav_top_register_bubble_first_time']);
		this.testTranslationMap('nav_top_register_bubble_register');
		this.testTranslationMapForDic('nav_top_narrow_screen_menu', [TRANSLATIONS.en['x_item_types_plural'], 'nav_top_left_menu', 'nav_top_right_menu']);
		this.testTranslationMapForDic('nav_top_narrow_screen_get_app', ['nav_top_right_get_app']);
		this.testTranslationMapForDic('nav_top_narrow_screen_get_app_submenu', ['nav_top_get_app_submenu']);
		this.testTranslationMapForDic('nav_top_narrow_screen_submenu', ['nav_top_personal', 'nav_top_left_submenu', 'nav_top_right_submenu']);
		this.testTranslationMap('nav_top_notifications');
		this.testTranslationMap('nav_top_notification_settings');
		this.testTranslationMap('nav_top_notification_read');
	};

	home_user_section.translations = {
		en: {
			'home_activity_type_filter': {
				'全部': 'All',
				'情报': 'Info',
				'相册': 'Albums',
				'用户': 'Users',
				'条目': 'Entries'
			},
			'home_activity_type_filter_action_type': {
				'发布相册': 'Add album',
				'分类订阅': 'Filter feed',
				'报错/报缺/催更': 'Report',
				'设置屏蔽动态': 'Block settings',
			},
			'home_activity_type_filter_info': {
				'全部': 'All',
				'制作': 'New items',
				'更图': 'New pics',
				'开订': 'Preorders',
				'延期': 'Delays',
				'出荷': 'Released',
				'再版': 'Re-releases',
			},
			'home_activity_type_filter_user': {
				'全部': 'All',
				'关注': 'Followed',
			},
			'home_activity_type_filter_entry': {
				'全部条目': 'All',
				'关注条目': 'Followed',
			},
			'home_activity_type_filter_by_header': {
				'包含分类：': 'Filter by category: ',
				'屏蔽动态：': 'Block action: ',
				'包含内容：': 'Filter by type: '
			},
			'home_activity_type_filter_by_action': {
				'情报': 'Info',
				'评论': 'Comment',
				'图片上传': 'Uploaded pics',
				'出售': 'Sale',
				'收购': 'Hunt', /* actually it's buying*/
			},
			'home_activity_type_filter_by_content': {
				'条目': 'Entries',
				'相册': 'Albums',
				'文章': 'Articles',
				'图片': 'Pictures'
			},
			'home_activity_type_filter_by_item_type_save': {
				'保存': 'Save',
			},
			'home_activity_card_action_type': {
				'传图': 'Uploaded pics',
				'评论': 'Comment',
				'出售': 'Sale',
				'收购': 'Hunt', /* actually it's buying*/
				'情报': 'Info',
			},
			'home_side_header' : {
				'待补款': 'Waiting to pay',
				'商品推荐': 'Featured products',
			},
			'home_side_praise_header': {
				'获赞排行榜': 'Appreciation ranking'
			},
			'home_side_praise_periods': {
				'今日': 'Today',
				'一周': 'Week',
				'一月': 'Month',
			},
			'home_side_figures': {
				'周边期待榜': 'Most ordered',
				'近期发售': 'Released soon'
			},
			'home_side_reccomendations': {
				'热门推荐': 'Let\'s check',
			},

			'home-page-searchbox': { /* 请输入关键/条目ID/JAN码等 如: GSC 路人女主 */
				'placeholder': 'Please enter the keyword / entry ID / JAN code etc. like: POP UP PARADE',
			},
		},
	};
	home_user_section.places = {
		'home-page-searchbox': '.hpoi-search-text',
		'profile_stats': '.user-box-content > .text-center > .row > div',
		'profile_desc': '.user-box-content-detail > small',
		'home_activity_type_filter': 'div.user-home div.action-type ul.action-type-nav > li > a',
		'home_activity_type_filter_active': 'div.user-home div.action-type ul.action-type-nav > li > a.active',
		'home_activity_type_filter_sub': 'div.user-home div.action-type ul.action-sub-nav > li > a',
		'home_activity_type_filter_action_type': '.action-type-nav > li > div.hpoi-action-more > ul.hpoi-menu-box > li > a',
		'home_activity_type_filter_by_header' : '#hpoi-classification-conter > #updSettingHobby > .hpoi-classification-up > span',
		'home_activity_type_filter_by_category' : '#hpoi-classification-conter > #updSettingHobby > .hpoi-classification-up:nth-of-type(1) > div > label > span',
		'home_activity_type_filter_by_action' : '#hpoi-classification-conter > #updSettingHobby > .hpoi-classification-up:nth-of-type(2) > div > label > span',
		'home_activity_type_filter_by_content' : '#hpoi-classification-conter > #updSettingHobby > .hpoi-classification-up:nth-of-type(3) > div > label > span',
		'home_activity_type_filter_by_item_type_save' : '#hpoi-classification-conter > div > button',

		'home_activity_card_action_type': '.home-info .home-info-content span.type-action',
		'home_activity_card_info_type': 'div.home-info > .row > .home-info-content div:not(.has-user) > .user-name',
		'home_activity_card_type_name': '.home-info .type-name',

		'home_side_header': '.home-left > div > .hpoi-box-title > .hpoi-title-left > span',
		'home_side_praise_header': '.home-left > div.top-praise > .hpoi-home-praise-head > .hpoi-ranking-neon',
		'home_side_praise_periods': '.home-left > div.top-praise > .hpoi-home-praise-head > .item-head-more > a',
		'home_side_figures': '.home-right >  .hpoi-home-box-rt > .hpoi-hobby-tabs > a',
		'home_side_reccomendations': '.home-right > .hpoi-home-box-rt > .hpoi-box-title > .hpoi-title-left > span',
	};
	home_user_section.isToTranslate = function () {
		const me = this;
		const PATHNAME = window.location.pathname;
		const loggedInIndicator = $(PLACES['logged_in_indicator']).length;
		if (['/', '/index', '/index/home', '/user/home'].includes(PATHNAME) && loggedInIndicator > 0) {
			return true;
		}
		return false;
	};
	home_user_section.typeFilterToDicMap = {
		'Info': 'home_activity_type_filter_info',
		'Users': 'home_activity_type_filter_user',
		'Entries': 'home_activity_type_filter_entry',
	};
	home_user_section.translate = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		var searchboxes = $(me.places['home-page-searchbox']);
		for (const searchbox of searchboxes) {
			searchbox.attributes['placeholder'].textContent =
				me.translations.en['home-page-searchbox']['placeholder'];
		}

		me.doTranslation('profile_stats', [TRANSLATIONS.en['profile_stats']]);
		me.doTranslation('profile_desc', [TRANSLATIONS.en['profile_desc']]);

		me.doTranslation('home_activity_type_filter');
		me.doTranslation('home_activity_type_filter_action_type');

		let activitySectionType = $(me.places['home_activity_type_filter_active'])[0].text;
		let typeFilterDic = me.typeFilterToDicMap[activitySectionType];
		if (typeFilterDic != null) {
			me.doTranslation('home_activity_type_filter_sub', [typeFilterDic]);
		}

		me.doTranslation('home_activity_type_filter_by_header');
		$(me.places['home_activity_type_filter_by_header']).css('font-size', '12px');
		me.doTranslation('home_activity_type_filter_by_category', [TRANSLATIONS.en['x_item_types_plural']]);
		me.doTranslation('home_activity_type_filter_by_action');
		me.doTranslation('home_activity_type_filter_by_content');
		me.doTranslation('home_activity_type_filter_by_item_type_save');

		var translateActivityCards = function() {
			me.doTranslation('home_activity_card_action_type');
			$(PLACES['home_activity_card_action_type']).prev().css('width', '');
			me.doTranslation('home_activity_card_info_type',[TRANSLATIONS.en['home_username_info_type']]);
			me.doTranslation('home_activity_card_type_name',[TRANSLATIONS.en['home_image_type_name']]);
			$('.home-box-comment > div > .has-user > .user-name > span:nth-child(1)').css('width', '');
			$('.home-box-comment > div > .has-user > .user-sign > span:nth-child(1)').css('width', '70%');
			let relativeTimes = $('span.type-time');
			translateRelativeDate(relativeTimes);
		};
		me.createAndUseObserverForList(translateActivityCards, $('.main-content')[0]);

		me.doTranslation('home_side_header');
		var translatePraiseSection = function() {
			me.doTranslation('home_side_praise_header');
			me.doTranslation('home_side_praise_periods');
		}
		me.createAndUseObserverForList(translatePraiseSection, $('.top-praise')[0]);

		me.doTranslation('home_side_figures');
		me.doTranslation('home_side_reccomendations');
	};
	home_user_section.testTranslation = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		me.testTranslationMapForDic('profile_stats', [TRANSLATIONS.en['profile_stats']]);
		me.testTranslationMapForDic('profile_desc', [TRANSLATIONS.en['profile_desc']]);
		me.testTranslationMap('home_activity_type_filter');
		me.testTranslationMap('home_activity_type_filter_action_type');

		let activitySectionType = $(me.places['home_activity_type_filter_active'])[0].text;
		let typeFilterDic = me.typeFilterToDicMap[activitySectionType];
		if (typeFilterDic != null) {
			me.testTranslationMapForDic('home_activity_type_filter_sub', [typeFilterDic]);
		}

		me.testTranslationMap('home_activity_type_filter_by_header');
		me.testTranslationMapForDic('home_activity_type_filter_by_category', [TRANSLATIONS.en['x_item_types_plural']]);
		me.testTranslationMap('home_activity_type_filter_by_action');
		me.testTranslationMap('home_activity_type_filter_by_content');
		me.testTranslationMap('home_activity_type_filter_by_item_type_save');

		me.testTranslationMap('home_activity_card_action_type');
		me.testTranslationMapForDic('home_activity_card_info_type',[TRANSLATIONS.en['home_username_info_type']]);
		me.testTranslationMapForDic('home_activity_card_type_name',[TRANSLATIONS.en['home_image_type_name']]);

		me.testTranslationMap('home_side_header');
		me.testTranslationMap('home_side_praise_header');
		me.testTranslationMap('home_side_praise_periods');
		me.testTranslationMap('home_side_figures');
		me.testTranslationMap('home_side_reccomendations');
		// TODO test for search placeholders
	};

	home_item_section.translations = {
		'en': {
			'home-page-searchbox': { /* 请输入关键/条目ID/JAN码等 如: GSC 路人女主 */
				'placeholder': 'Please enter the keyword / entry ID / JAN code etc. like: POP UP PARADE',
			},
			'home_item_title_section': {
				'大家在看': 'Everyone\'s watching',
				'资料库': 'Database',
				'最新相册': 'Recent albums',
				'日亚捡漏': 'Amazon jp pick up',
			},
			'home_item_database_tabs': {
				'最新入库': 'Recently added',
				'热门预定': 'Most ordered',
				'热门出荷': 'Close release',
			},
			'home_item_popular_tabs': {
				'每日热门': 'Best today',
				'每周热门': 'Best this week',
				'好评top': 'Best',
			},
			'home_item_popular_hits': {
				'浏览': 'Hits',
			},
			'home_item_amazon_buy': {
				'捡!': 'Buy!',
			},
			'home_item_latest_information_title' : {
				'最新情报': 'Latest information',
			},
			'home_item_info_sub_filter': {
				'全部': 'All',
				'制作': 'New items',
				'更图': 'New pics',
				'开订': 'Preorders',
				'延期': 'Delays',
				'出荷': 'Released',
				'再版': 'Re-releases',
			},
			'home_item_info_action_type': {
				'情报': 'Info',
			},
			'home_item_info_type_long': {
				'制作决定': 'New item announced',
				'官图更新': 'Official pictures update',
				'预订时间': 'Preorders opened',
				'预定时间': 'Preorders opened',
				'出荷延期': 'Release postponed',
				'出荷时间': 'Release time',
				'再版确定': 'Re-release confirmed',
				'情报更新': 'Info updated',
			},
			'home_item_recommended_title': {
				'热门推荐': 'Let\'s check',
			}
		}
	};
	home_item_section.places = {
		'home-page-searchbox': '.hpoi-search-text',
		'home_item_main_title_section': '.hpoi-loucen > .hpoi-box-title > .hpoi-title-left > span',
		'home_item_main_gk_maker_stat': '.hpoi-fansFabulous > span',
		'home_item_title_section': 'div.hpoi-box-title > .hpoi-title-left span',
		'home_item_database_tabs': '#database-newAdd, #database-hotOrder, #database-release',
		'home_item_album_load_more': '.hpoi-latestalbum-more',
		'home_item_popular_tabs': 'div.hpoi-databas-popular > div > div > div.database-select > a',
		'home_item_popular_hits': 'div.hpoi-populartext-box',
		'home_item_amazon_buy': 'div.hpoi-nichiapick > div.hpoi-nichiapick-box > div > div.hpoi-nichiapick-item > div.hpoi-nichiapick-content > div.hpoi-nichiapick-text > a.hpoi-nichia-pick',
		'home_item_latest_information_title': '.hpoi-latestinformation-left > .hpoi-box-title > .hpoi-title-left > span',
		'home_item_info_sub_filter': 'div.hpoi-latestinformation-left > div.hpoi-box-title > div.hpoi-title-left > a',
		'home_item_info_action_type': 'div.hpoi-latestinformation-left > div.hpoi-conter-ltsifrato > div.hpoi-conter-left > div.right-leioan > div:nth-of-type(2) > span',
		'home_item_info_type_long': 'div.hpoi-latestinformation-left > div.hpoi-conter-ltsifrato > div.hpoi-conter-left > div.right-leioan > div:nth-of-type(1) > span:nth-of-type(1)',
		'home_item_info_time': 'div.hpoi-latestinformation-left > div.hpoi-conter-ltsifrato > div.hpoi-conter-left > div.right-leioan > div:nth-of-type(1) > span:nth-last-of-type(1)',
		'home_item_info_type_name': 'div.hpoi-latestinformation-left > div.hpoi-conter-ltsifrato > div.hpoi-conter-left > div.left-leioan > span',
		'home_item_recommended_title': '.hpoi-latestinformation-right > .hpoi-box-title > .hpoi-title-left > span',
	};
	home_item_section.getPageType = function() {
		const PATHNAME = window.location.pathname;
		const loggedInIndicator = $(PLACES['logged_in_indicator']).length;
		if (['/', '/index', '/index/home'].includes(PATHNAME) && loggedInIndicator == 0)
			return 'main';
		else if (PATHNAME.endsWith('/hobby/'))
			return 'figures';
		else if (PATHNAME.endsWith('/hobby/model'))
			return 'anime models';
		else if (PATHNAME.endsWith('/hobby/real'))
			return 'real models';
		else if (PATHNAME.endsWith('/hobby/moppet'))
			return 'plushies';
		else if (PATHNAME.endsWith('/hobby/doll'))
			return 'dolls';
		return;
	};
	home_item_section.isToTranslate = function() {
		return !!this.getPageType();
	};
	home_item_section.translate = function() {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}

		const pageType = me.getPageType();
		if (pageType == 'main') {
			var searchboxes = $(me.places['home-page-searchbox']);
			for (const searchbox of searchboxes) {
				searchbox.attributes['placeholder'].textContent =
					me.translations.en['home-page-searchbox']['placeholder'];
			}
			me.doTranslation('home_item_main_title_section', [TRANSLATIONS.en['x_item_types_plural']]);
			me.doTranslation('home_item_main_gk_maker_stat', [TRANSLATIONS.en['profile_stats']]);
		} else {
			me.doTranslation('home_item_title_section');
			me.doTranslation('home_item_database_tabs');

			var translateDatabaseGlyphs = function() {
				glyph_tile_old_section.translate();
			}
			me.createAndUseObserverForList(translateDatabaseGlyphs, $('#hpoi-dataBase-Box-List')[0]);

			//me.doTranslation('home_item_album_load_more', TRANSLATIONS.en['load_more_button']);
			me.doTranslation('home_item_popular_tabs');
			var translatePopularHits = function() {
				me.doTranslation('home_item_popular_hits', ['home_item_popular_hits']);
			}
			me.createAndUseObserverForList(translatePopularHits, $('#hpoi-dataBase-Box-List')[0]);

			me.doTranslation('home_item_amazon_buy');

		}
		me.doTranslation('home_item_latest_information_title');
		$(me.places['home_item_latest_information_title']).css('width', '100px');
		
		me.doTranslation('home_item_info_sub_filter');

		var translateLatestInformationContent = function (mutations) {
			me.doTranslation('home_item_info_action_type');
			me.doTranslation('home_item_info_type_long');
			let relativeTimes = $(me.places['home_item_info_time']);
			translateRelativeDate(relativeTimes);

			const pageTypeToDicMap = {
				'main': 'home_image_type_name',
				'figures': 'x_subtypes_figures',
				'anime models': 'x_subtypes_anime_models',
				'real models': 'x_subtypes_real_models',
				'plushies': 'x_subtypes_plushies',
				'dolls': 'x_subtypes_dolls',
			};
			me.doTranslation('home_item_info_type_name', [TRANSLATIONS.en[pageTypeToDicMap[pageType]]]);
		}
		me.createAndUseObserverForList(translateLatestInformationContent, $('.hpoi-conter-ltsifrato')[0]);

		me.doTranslation('home_item_recommended_title');
	};
	home_item_section.testTranslation = function() {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		const pageType = me.getPageType();
		if (pageType == 'main') {
			me.testTranslationMapForDic('home_item_main_title_section', TRANSLATIONS.en['x_item_types_plural']);
			me.testTranslationMapForDic('home_item_main_gk_maker_stat', [TRANSLATIONS.en['profile_stats']]);
		} else {
			me.testTranslationMap('home_item_title_section');
			me.testTranslationMap('home_item_database_tabs');
			glyph_tile_old_section.testTranslation();
			//me.testTranslationMapForDic('home_item_album_load_more', TRANSLATIONS.en['load_more_button']);
			me.testTranslationMap('home_item_popular_tabs');
			me.testTranslationMapForDic('home_item_popular_hits', ['home_item_popular_hits']);
			me.testTranslationMap('home_item_amazon_buy');
		}
		me.testTranslationMap('home_item_latest_information_title');
		
		me.testTranslationMap('home_item_info_sub_filter');
		me.testTranslationMap('home_item_info_action_type');
		me.testTranslationMap('home_item_info_type_long');

		const pageTypeToDicMap = {
			'main': 'home_image_type_name',
			'figures': 'x_subtypes_figures',
			'anime models': 'x_subtypes_anime_models',
			'real models': 'x_subtypes_real_models',
			'plushies': 'x_subtypes_plushies',
			'dolls': 'x_subtypes_dolls',
		};
		me.testTranslationMapForDic('home_item_info_type_name', [TRANSLATIONS.en[pageTypeToDicMap[pageType]]]);
		me.testTranslationMap('home_item_recommended_title');
	};

	login_form_section.translations = {
		en: {
			'login_form_title': {
				'登录到Hpoi': 'Log in to Hpoi',
			},
			'login_qr_code_title': {
				'扫码登录': 'Scan code to log in',
			},
			'login_qr_code_hint': {
				'请使用Hpoi APP 扫码登录或扫码下载APP': 'Scan the code to log in via Hpoi APP or download the app',
			},
			'login_tab': {
				'密码登录': 'with password',
				'短信登录': 'with SMS'
			},
			'login_form_placeholder': {
				'输入手机号/邮箱':'Phone number/email',
				'密码':'Password',
				'请输入图形验证码':'Put code from the image',
				'手机号码':'Phone number',
				'请输入短信验证码':'Put code from the text message',
			},
			'login_form_verify_code_button': {
				'获取验证码': 'Send SMS'
			},
			'login_form_register_button': {
				'注册': 'Register'
			},
			'login_form_login_button': {
				'登录': 'Log in'
			},
			'login_form_forgot_link': {
				'忘记密码': 'Forgot the password?'
			},
			'login_form_email_error' : {
				'请输入邮箱地址或手机号码' : 'Email/phone number cannot be empty',
				'请输入密码' : 'Password cannot be empty',
				'请输入验证码': 'Verification code cannot be empty',
				'账号或密码错误' : 'Invalid email/phone number and/or password'
			},
			'login_form_phone_error': {
				'请输入手机号': 'Phone number cannot be empty',
				'请输图形入验证码': 'Code from the image cannot be empty',
				'请输入短信验证码' : 'Code from SMS cannot be empty',
				'请输入验证码' : 'Verification code cannot be empty',
				'验证码错误' : 'Invalid verification code',
				'账号或验证码错误': 'Invalid phone number and/or verification code(s)',
			},
			'login_form_alert' : {
				'请关联手机号' : ''
			},
			'login_form_agreements': {
				'登录或完成注册即代表你同意': 'By registering or log in, you agree to following terms: ',
				'《用户协议》': '"Terms of service"',
				'、': ', ',
				'《隐私协议》': '"Privacy Policy"',
				'《发布协议》': '"Copyrights"',
				'若此电脑非个人使用，需要在使用后退出登录': '. If you are using a public computer, please remember to log out. '
			}
		}
	};
	login_form_section.places = {
		'login_form_title': 'div.hpoi-irrigation-banner > span',
		'login_qr_code_container': 'div.login-container-code',
		'login_qr_code_title': 'div.login-container-code > p.title',
		'login_qr_code_box': 'div.login-container-code > div.qrcode-box',
		'login_qr_code_hint': 'div.login-container-code > p.hint',
		'login_tab': 'div.hpoi-login-box > div.login-tabs > a',
		'login_form_placeholder': '.login-form-box > div input',
		'login_form_verify_code_button': 'div.input-item > button.btn-code',
		'login_form_register_button': 'div.hpoi-login-box > div.login-btn-box > a.login-reg-btn',
		'login_form_login_button': 'div.hpoi-login-box > div.login-btn-box > button.login-btn',
		'login_form_forgot_link': 'div.hpoi-login-box > div.login-bottom > a',
		'login_form_agreements': 'div.hpoi-login-footer *',
		'login_form_email_error': '#form-email-err-text',
		'login_form_phone_error': '#form-phone-err-text',
	};
	login_form_section.isToTranslate = function () {
		const me = this;
		const PATHNAME = window.location.pathname;
		if (['/user/login'].includes(PATHNAME)) {
			return true;
		}
		return false;
	};
	login_form_section.translate = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		me.doTranslation('login_form_title');

		$(me.places['login_qr_code_container']).css('width', '200px');
		$(me.places['login_qr_code_box']).css('margin', 'auto');
		$(me.places['login_qr_code_box']).css('width', '160px');
		me.doTranslation('login_qr_code_title');
		me.doTranslation('login_qr_code_hint');
		$('.hpoi-login-line').css('margin', '0 80px 0 40px');
		me.doTranslation('login_tab');
		//me.doTranslation('search_condition_toogle_hide', ['search_condition_toogle']);

		var formBoxes = $(me.places['login_form_placeholder']);
		for (const formBox of formBoxes) {
			formBox.attributes['placeholder'].textContent =
				me.translations.en['login_form_placeholder'][formBox.attributes['placeholder'].textContent];
		}
		me.doTranslation('login_form_verify_code_button');

		var translateEmailErrors = function() {
			me.doTranslation('login_form_email_error');
		};
		me.createAndUseObserverForList(translateEmailErrors, $(me.places['login_form_email_error'])[0]);
		var translatePhoneErrors = function() {
			me.doTranslation('login_form_phone_error');
		};
		me.createAndUseObserverForList(translatePhoneErrors, $(me.places['login_form_phone_error'])[0]);

		me.doTranslation('login_form_register_button');
		me.doTranslation('login_form_login_button');
		me.doTranslation('login_form_forgot_link');
		me.doTranslation('login_form_agreements');

	};
	login_form_section.testTranslation = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		//me.testTranslationMapForDic('search_filter_main_type', [TRANSLATIONS.en['x_item_types_plural'], TRANSLATIONS.en['x_generic_all_capitalized']]);
		me.testTranslationMap('login_form_title');
		me.testTranslationMap('login_qr_code_title');
		me.testTranslationMap('login_qr_code_hint');
		me.testTranslationMap('login_tab');
		me.testTranslationMap('login_form_register_button');
		me.testTranslationMap('login_form_login_button');
		me.testTranslationMap('login_form_forgot_link');
		//me.doTranslation('login_form_agreements');
	};

	search_section.translations = {
		en: {
			'search_condition_title': {
				'类型:': 'Type:',
				'属性:': 'Attribute:',
				'比例:': 'Scale:',
				'限制:': 'Rating:',
				'添加筛选:': 'Add filter:',
			},
			'search_condition_attribute_list': {
				'汉子': 'Male',
				'妹子': 'Female',
				'景品': 'Prizes',
				'军用': 'Military',
				'GK': 'Garage kits',
				'可变形': 'Deformed',
				'民用': 'Civil',
				'海上': 'Maritime',
				'可动': 'Movable',
				'陆地': 'On land',
				'航空': 'Aircraft',
				'可脱': 'Alternate parts',
				'展示品': 'Prototype',
				'需拼装': 'To assembly',
				'未上色': 'Uncolored',
			},
			'search_condition_rating_list': {
				'全年龄': 'General', //0
				'轻微露出': 'Ecchi', //12
				'一般露出': 'Revealing', //15
				'普通露出': 'Revealing', //15
				'露出-': 'Explicit-', //18
				'露出+': 'Explicit+', //20
				'低于轻微露出': 'Ecchi and below', //115
			},
			'search_condition_filter': {
				'添加': 'add',
			},
			'search_condition_filter_list': {
				'系列': 'Line',
				'作品': 'Series',
				'角色': 'Character',
				'制作厂商': 'Manufacturer',
				'发行厂商': 'Distributor',
				'发售时间': 'Release time',
				'入库时间': 'Added time',
			},
			'search_condition_toogle': {
				'收起': 'hide',
				'展开': 'show',
			},
			'search_sort_list': {
				'发售': 'Sort by release date',
				'入库': 'Added date',
				'总热度': 'Hits overall',
				'一周热度': 'Hits in a week',
				'一天热度': 'Hits today',
				'评价': 'Rating'
			},
			'search_view': {
				'视图：': 'View:'
			},
			'search_view_list': {
				'超小': 'Very small',
				'小': 'Small',
				'中': 'Medium',
				'超大': 'Very large',
				'大': 'Large',
			},
			'search_page_ibox': {
				'热门制作厂商': 'Top manufacturers',
				'发售时间': 'Release date',
			},
			'search_modal_window_header': {
				'选择时间': 'Select date period',
			},
			'search_modal_window_body': {
				'开始：': 'Start: ',
				'结束：': 'End: ',
			},
			'search_modal_window_footer': {
				'确定': 'OK',
			},
		}
	};
	search_section.places = {
		'search_filter_main_type': '.hpoi-database-tabs > .item',
		'search_condition_title': '.hpoi-database-condition > .item-box > span',
		'search_condition_type_list': '.hpoi-database-condition > .item-box:nth-child(1) > .item-list > button',
		'search_condition_attribute_list': '.hpoi-database-condition > .item-box:nth-last-child(4) > .item-list > button',
		'search_condition_scale_all_button': '.hpoi-database-condition > .item-box:nth-last-child(3) > .item-list > button:nth-child(1)',
		'search_condition_rating_list': '.hpoi-database-condition > .item-box:nth-last-child(2) > .item-list > button',
		'seach_condition_filter_selected': '.hpoi-database-condition > .item-box:nth-last-child(1) > .item-list-add > .hpoi-group-add > div',
		'search_condition_filter': '.hpoi-database-condition > .item-box:nth-last-child(1) > .item-list-add > .hpoi-icon-add > button',
		'search_condition_filter_list': '.hpoi-database-condition > .item-box:nth-last-child(1) > .item-list-add > .hpoi-icon-add > ul > li > a',

		'search_condition_toogle_show': '.item-box:nth-last-child(4) > .item-list > .hpoi-btn-operate',
		'search_condition_toogle_hide': '.item-box > .item-list-add > .hpoi-btn-operate',

		'search_sort_list': '.hpoi-database-ibox > .hpoi-database-ibox-head > .ibox-head-left > a',
		'search_view': '.hpoi-database-ibox > .hpoi-database-ibox-head > .ibox-head-right > a',
		'search_view_list': '.hpoi-database-ibox > .hpoi-database-ibox-head > .ibox-head-right > ul > li > a',

		'search_page_ibox': '.hpoi-database-ibox .hpoi-title-left > span',
		'search_modal_window_header': '#selectDateModal .modal-header > h4.modal-title',
		'search_modal_window_body': "#selectDateModal .modal-body label",
		'search_modal_window_footer': "#selectDateModal .modal-footer > button",
	};
	search_section.isToTranslate = function () {
		const PATHNAME = window.location.pathname;
		if (PATHNAME.includes('/hobby/all')) {
			return true;
		}
		return false;
	};
	search_section.translate = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		me.doTranslation('search_filter_main_type', [TRANSLATIONS.en['x_item_types_plural'], TRANSLATIONS.en['x_generic_all_capitalized']]);
		me.doTranslation('search_condition_title');

		const typeToTypeDic = function (categoryId) {
			if (categoryId <= 100)
				return 'x_subtypes_figures';
			if (categoryId <= 200)
				return 'x_subtypes_anime_models';
			if (categoryId <= 300)
				return 'x_subtypes_dolls';
			if (categoryId <= 400)
				return 'x_subtypes_plushies';
			if (categoryId <= 500)
				return 'x_subtypes_real_models';
			if (categoryId <= 900)
				return 'x_subtypes_merch';
		};
		let category = new URL(window.location).searchParams.get("category");
		if (category == null || category == 10000) {
			//do nothing
		} else {
			me.doTranslation('search_condition_type_list', [TRANSLATIONS.en[typeToTypeDic(category)], TRANSLATIONS.en['x_generic_all_capitalized']]);
		}
		me.doTranslation('search_condition_attribute_list', ['search_condition_attribute_list', TRANSLATIONS.en['x_generic_all_capitalized']]);
		me.doTranslation('search_condition_scale_all_button', [TRANSLATIONS.en['x_generic_all_capitalized']]);
		me.doTranslation('search_condition_rating_list');
		me.doTranslation('seach_condition_filter_selected', ['search_condition_filter_list']);
		me.doTranslation('search_condition_filter');
		me.doTranslation('search_condition_filter_list');

		me.doTranslation('search_condition_toogle_hide', ['search_condition_toogle']);
		me.doTranslation('search_condition_toogle_show', ['search_condition_toogle']);
		me.doTranslation('search_sort_list');
		me.doTranslation('search_view', ['search_view']);
		me.doTranslation('search_view', ['search_view_list']);
		me.doTranslation('search_view_list');

		if ($(me.places['search_view'])[0].textContent.includes(me.translations.en['search_view_list']['中'])) {
			glyph_tile_section.translate();
		}

		me.doTranslation('search_page_ibox');
		me.doTranslation('search_modal_window_header');
		me.doTranslation('search_modal_window_body');
		me.doTranslation('search_modal_window_footer');
	};
	search_section.testTranslation = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		me.testTranslationMapForDic('search_filter_main_type', [TRANSLATIONS.en['x_item_types_plural'], TRANSLATIONS.en['x_generic_all_capitalized']]);
		me.testTranslationMap('search_condition_title');

		me.testTranslationMapForDic('search_condition_attribute_list', ['search_condition_attribute_list', TRANSLATIONS.en['x_generic_all_capitalized']]);
		me.testTranslationMapForDic('search_condition_scale_all_button', [TRANSLATIONS.en['x_generic_all_capitalized']]);
		me.testTranslationMap('search_condition_rating_list');
		me.testTranslationMapForDic('seach_condition_filter_selected', ['search_condition_filter_list']);
		me.testTranslationMap('search_condition_filter');
		me.testTranslationMap('search_condition_filter_list');

		me.testTranslationMapForDic('search_condition_toogle_hide', ['search_condition_toogle']);
		me.testTranslationMapForDic('search_condition_toogle_show', ['search_condition_toogle']);
		me.testTranslationMap('search_sort_list');
		me.testTranslationMapForDic('search_view', ['search_view']);
		me.testTranslationMapForDic('search_view', ['search_view_list']);
		me.testTranslationMap('search_view_list');

		if ($(me.places['search_view'])[0].textContent.includes(me.translations.en['search_view_list']['中'])) {
			glyph_tile_section.testTranslation();
		}
		me.testTranslationMap('search_page_ibox');
		me.testTranslationMap('search_modal_window_header');
		me.testTranslationMap('search_modal_window_body');
		me.testTranslationMap('search_modal_window_footer');
	};

	global_search_section.translations = {
		en: {
			'search_global_advanced_search_button': {
				'高级检索': 'Advanced',
			},
			'search_global_main_nav': {
				'周边': 'Items',
				'图片': 'Pictures',
				'相册': 'Albums',
				'角色': 'Chars',
				'作品': 'Series',
				'系列': 'Lines',
				'人物': 'Persons',
				'厂商': 'Makers',
				'用户': 'Users',
			},
			'search_global_option_title': {
				'综合排序': 'Complex search',
				'全部周边': 'All types',
				'全部手办': 'All figures',
				'全部动漫模型': 'All anime models',
				'全部真实模型': 'All real models',
				'全部毛绒布偶': 'All plushies',
				'全部Doll娃娃': 'All dolls',
				'立牌/摆件': 'Character stand',
				'全部厂商': 'All companies',
				'不限年份': 'Any year',
			},
			'search_global_option_sort': {
				'相关度最高': 'Most revelant',
				'最热门': 'Popular first',
				'最新添加': 'Newly added',
				'最晚发售': 'Latest released',
				'评分最高': 'Best rated',
			},
			'search_global_option_album_search': {
				'默认搜索': 'Search by default',
				'条目名称': 'Item name only',
				'相册标题': 'Album title only',
			},
			'search_global_option_album_sort': {
				'推荐排序': 'Sort by default',
				'最新创建': 'Newly created',
				'最近更新': 'Newly updated',
				'图片数量': 'Number of pictures',
				'总热度': 'Hits overall',
				'一天热度': 'Hits today',
			},
			'search_global_result_tags': {
				'角色': 'Character',
				'周边系列': 'Line',
				'人物': 'Person',
				'厂商': 'Company',
			},
			'search_global_results_none': {
				'什么也没找到~': 'Couldn\'t find anything~',
			},
			'search_global_page_ibox': {
				'说明': 'How to use',
				'大家在找': 'Most popular',
			},
			'search_global_ibox_description': {
				'1、尽量用日语原文作关键字，因为很多还没翻译，或者翻译不标准': '1. If possible, use Japanese names to search over Chinese ones, as not all items are translated, or Chinese names are not common.',
				'2、分类、排序、样式都还要完善，先用着吧_(:з」∠)_': '2. Sorting and filtering by types and all clasifications are your friends, use them first _(:з」∠)_',
				'3、如果要按性质(如可脱)查找，也可以看看': '3. If you want more detailed filtering (like for figures with alternate parts), take a look at ',
				'高级检索': 'an advanced search.',

			},
		}
	};
	global_search_section.places = {
		'search_global_advanced_search_button': 'div.page-search-btn ~ a.btn-link',
		'search_global_main_nav': 'div.taobao-nav > div',
		'search_global_option_title': '.search-option-nav > div:nth-of-type(1)',
		'search_global_option_sort': '.search-option-nav:nth-of-type(3) > div:not(:nth-of-type(1))',
		'search_global_option_item_types': '.search-option-nav:nth-of-type(4) > div:not(:nth-of-type(1))',
		'search_global_option_item_type_active': '.search-option-nav:nth-of-type(4) > div.active',
		'search_global_option_item_subtypes': '.search-option-nav:nth-of-type(5) > div:not(:nth-of-type(1))',
		'search_global_option_sort': '.search-option-nav:nth-of-type(3) > div:not(:nth-of-type(1))',
		'search_global_option_album_search': '.search-option-nav:nth-of-type(3) > div',
		'search_global_option_album_sort': '.search-option-nav:nth-of-type(4) > div',
		'search_global_result_tags': '#result-content > .media-list .ibox-content > .media-body > div > span.label-tag',
		'search_global_users_stats': '#result-content .user-i-box .row > div',
		'search_global_results_none': 'div#result-content > div:not(.pull-right) > div.hpoi-no-content > p',
		'search_global_albums_none': '#waterfall > div',
		'search_global_page_ibox': '.container > .row .ibox > .ibox-title > h5',
		'search_global_ibox_description': '.container > .row .ibox:first > .ibox-content *',
	};
	global_search_section.isToTranslate = function () {
		const PATHNAME = window.location.pathname;
		if (PATHNAME.includes('/search')) {
			return true;
		}
		return false;
	};
	global_search_section.translate = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}

		me.doTranslation('search_global_advanced_search_button');
		me.doTranslation('search_global_main_nav');

		let searchCategoryCode = new URL(window.location.href).searchParams.get("category");

		// filters and sorts
		if (searchCategoryCode == null || parseInt(searchCategoryCode) <= 10000) { // items
			me.doTranslation('search_global_option_title');
			me.doTranslation('search_global_option_sort');
			me.doTranslation('search_global_option_item_types', [TRANSLATIONS.en['x_item_types_plural'], TRANSLATIONS.en['x_other']]);
			let activeSubtype = $(me.places['search_global_option_item_type_active']);
			let dicToTranlateSubtypes = '';
			if (activeSubtype.length) {
				var subtype = activeSubtype[0].innerText.trim();
				let subtypeToPlaceMap = {
					'All types': '',
					'Figures': 'x_subtypes_figures',
					'Anime models': 'x_subtypes_anime_models',
					'Real models': 'x_subtypes_real_models',
					'Plushies': 'x_subtypes_plushies',
					'Dolls': 'x_subtypes_dolls',
					'Other': 'x_subtypes_merch',
				};
				dicToTranlateSubtypes = subtypeToPlaceMap[subtype];
			} else {
				dicToTranlateSubtypes = 'x_subtypes_merch';
			}
			if (dicToTranlateSubtypes != '') {
				me.doTranslation('search_global_option_item_subtypes', [TRANSLATIONS.en[dicToTranlateSubtypes], TRANSLATIONS.en['x_other']]);
			}
		} else if (searchCategoryCode == '60001') { // albums
			me.doTranslation('search_global_option_album_search');
			me.doTranslation('search_global_option_album_sort');
		}

		//results
		if (['50000', '70100', '30000', '40000'].includes(searchCategoryCode)) // characters, lines, persons, makers
			me.doTranslation('search_global_result_tags');
		else if (searchCategoryCode == '20000') // series
			me.doTranslation('search_global_result_tags', [TRANSLATIONS.en['x_series_types']]);
		else if (searchCategoryCode == '1000002') // users
			me.doTranslation('search_global_users_stats', [TRANSLATIONS.en['profile_stats']]);
		else if (searchCategoryCode == '60001') // albums
			me.doTranslation('search_global_albums_none', ['search_global_results_none']);
		else
			me.doTranslation('search_global_results_none');

		//right column
		me.doTranslation('search_global_page_ibox');
		me.doTranslation('search_global_ibox_description');
	};
	global_search_section.testTranslation = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		me.testTranslationMap('search_global_advanced_search_button');
		me.testTranslationMap('search_global_main_nav');

		let searchCategoryCode = new URL(window.location.href).searchParams.get("category");
		if (searchCategoryCode == null || parseInt(searchCategoryCode) <= 10000) {
			me.testTranslationMap('search_global_option_title');
			me.testTranslationMap('search_global_option_sort');
			me.testTranslationMapForDic('search_global_option_item_types', [TRANSLATIONS.en['x_item_types_plural'], TRANSLATIONS.en['x_other']]);
			//TODO sublist
		} else if (searchCategoryCode == '60001') { // albums
			me.testTranslationMap('search_global_option_album_search');
			me.testTranslationMap('search_global_option_album_sort');
		} else if (['50000', '70100', '30000', '40000'].includes(searchCategoryCode)) // characters, lines, persons, makers
			me.testTranslationMap('search_global_result_tags');
		else if (searchCategoryCode == '20000') // series
			me.testTranslationMapForDic('search_global_result_tags', [TRANSLATIONS.en['x_series_types']]);
		else if (searchCategoryCode == '1000002') // users
			me.testTranslationMapForDic('search_global_users_stats', [TRANSLATIONS.en['profile_stats']]);

		if (searchCategoryCode == '60001') {
			me.testTranslationMapForDic('search_global_albums_none', ['search_global_results_none']);
		} else {
			me.testTranslationMap('search_global_results_none');
		}

		me.testTranslationMap('search_global_page_ibox');
		// me.testTranslationMap('search_global_ibox_description');
	};

	encyclopedia_section.translations = {
		en: {
			'encyclopedia_entry_type': {
				'角色': 'Character',
				'作品': 'Series',
				'系列': 'Line',
				'人物': 'Person',
				'原画': 'Designer',
				'厂商': 'Company',
			},
			'encyclopedia_name_header': {
				'中文名：': 'Chinese name: '
			},
			'encyclopedia_infobox_props': {
				'名称：': 'Name: ',
				'中文名：': 'Chinese name: ',
				'别名：': 'Aliases: ',
				'地区：': 'Country: ',
				'官网：': 'Website: ',
				'官方网站：': 'Official website: ',
				'官方微博：': 'Official Weibo: ',
				'推特：': 'Twitter: ',
				'微博：': 'Weibo: ',

				'成立时间：': 'Founded date: ',
				'成立日期：': 'Founded date: ',
				'所在地：': 'Location: ',

				'性别：': 'Sex: ',
				'生日：': 'Birthday date: ',
				'星座：': 'Zodiac: ',
				'家庭情况：': 'Family info: ',
				'前任监护人：': 'Former guardian: ',
				'监护人：': 'Guardian: ',
				'血型：': 'Blood type: ',
				'引用来源：': 'Info source: ',
				'Anidb ID：': 'Anidb ID: ',
				'母亲：': 'Mother: ',
				'学籍：': 'Student status: ',
				'种族：': 'Race: ',
				'身高：': 'Height: ',
				'年龄：': 'Age: ',
				'体重：': 'Weight: ',
				'三围：': 'Body meas.: ',
				'出生地：': 'Place of birth: ',
				'国籍：': 'Nationality: ',
				'声优：': 'Voice actor: ',
				'音源：': 'Voice provider: ',
				'稀有度：': 'Rarity: ',
				'编号：': 'Number: ',
				'阵营：': 'Faction: ',
				'来源：': 'Source: ',
				'人设：': 'Character design',

				'类型：': 'Type: ',
				'时间：': 'Time: ',
				'话数：': 'Episodes: ',
				'放送星期：': 'Week day of stream.: ',
				'发行日期：': 'Released: ',
				'开发：': 'Developed: ',
			},
			'encyclopedia_items_section': {
				'详情': 'Info',
				'自营周边': 'Sold by Hpoi',
				'相关商品': 'Related products',
				'最新作品': 'Latest items',
				'关联手办': 'Related figures',
				'相关手办': 'Related figures',
				'系列': 'Lines',
				'制作周边': 'Items manufactured',
				'发行周边': 'Items distributed',
				'关联周边': 'Related items',
				'相关周边': 'Related items',
				'参与周边': 'Items worked on',
				'她参与的手办': 'Figures worked on',
				'他参与的手办': 'Figures worked on',
				'评论': 'Comments'
			},
			'encyclopedia_items_section_sub_made': {
				'制作周边': 'Items manufactured',
				'发行周边': 'Items distributed',
			},
			'encyclopedia_items_section_sub_issued': {
				'发行周边': 'Items distributed',
			},
			'encyclopedia_items_more': {
				'全部': 'more',
			},
		},
	};
	encyclopedia_section.places = {
		/* ENCYCLOPEDIA */
		'encyclopedia_header_type': '.hpoi-company-info .info-head > span:nth-of-type(1)',
		'encyclopedia_name_header': '.hpoi-company-info .info-head > span:nth-of-type(2)',
		'encyclopedia_infobox_props': '.company-ibox > div.row > div.item-details',
		'encyclopedia_items_more': '.company-ibox > .item-head a.hpoi-btn-more > span',
		'encyclopedia_items_header_list': '.hpoi-company-nav > div > a.nav-item',
		'encyclopedia_items_header': '.company-ibox > .item-head > div > h3',
		'encyclopedia_items_header_sub_made': '.company-ibox > .item-head > div.hpoi-slider-active > a.hpoi-slider-make',
		'encyclopedia_items_header_sub_issued': '.company-ibox > .item-head > div.hpoi-slider-active > a.hpoi-slider-issued',
		'encyclopedia_items_header_count': '.company-ibox > .item-head > div > span',
	};
	encyclopedia_section.isToTranslate = function () {
		const PATHNAME = window.location.pathname;
		if (PATHNAME.includes('/company/') || PATHNAME.includes('/series/')
			 || PATHNAME.includes('/works') || PATHNAME.includes('/charactar/')
			 || PATHNAME.includes('/person/')) {
			return true;
		}
		return false;
	};
	/* do stuff to translate text like
	共8个相关商品	=> Total 8 related products
	共153条	=> Total 153 (lines, comments)
	共3723个	=> Total 153 (items)
	共91个相关周边	=> Total 91 related items
	共29个相关手办	=> Total 29 related figures
	共1个, 评分4.38	=> Total 153 (items), Rating 4.38

	1st part > up to counter like  个, 条
	2nd part > after counter, translate according to dictionary
	3rd part > after a coma, change coma to normal coma and translate with dictionary
	 */
	encyclopedia_section.translateEncyclopediaItemsHeader = function (element, dicDef) {
		let textToTranslate = element.textContent.trim();
		let translation = "";
		
		// split at parts
		let counterSymbol = ['个', '条'];
		let partsSplittedByCounters = textToTranslate.split(new RegExp('['+ counterSymbol.join('') + ']', 'i'));
		if (partsSplittedByCounters[1].indexOf(',') !== -1) {
			secondAndThirdPart = partsSplittedByCounters[1].split(',');
			partsSplittedByCounters[1] = secondAndThirdPart;
			partsSplittedByCounters = partsSplittedByCounters.flat();
		}

		let numberPart = partsSplittedByCounters[0];
		let number = numberPart.substring(1);
		translation += "Total ";
		translation += number;

		let secondPartTranslation = "";
		let secondPartExists = partsSplittedByCounters.length >= 2;
		if (secondPartExists && partsSplittedByCounters[1].length > 0) {
			secondPartTranslation = (dicDef[partsSplittedByCounters[1]]).toLowerCase();

			translation += " ";
			translation += secondPartTranslation;
		}

		let thirdPartTranslation = "";
		let thirdPartExists = partsSplittedByCounters.length == 3;
		if (thirdPartExists && partsSplittedByCounters[2].length > 0) {
			thirdPartTranslation = partsSplittedByCounters[2].replace('评分', 'rate: ');

			translation += ', ';
			translation += thirdPartTranslation;
		}
		element.textContent = translation;
	};
	encyclopedia_section.translate = function () {
		const me = this;
		if (me.isToTranslate()) {
			me.doTranslation('encyclopedia_header_type', ['encyclopedia_entry_type']);
			me.doTranslation('encyclopedia_name_header', ['encyclopedia_name_header']);
			me.doTranslation('encyclopedia_items_header_list', ['encyclopedia_items_section']);
			$(me.places['encyclopedia_items_header_list']).css('margin-left', '20px');
			me.doTranslation('encyclopedia_items_header', ['encyclopedia_items_section']);
			me.doTranslation('encyclopedia_items_header_sub_made', ['encyclopedia_items_section_sub_made']);
			me.doTranslation('encyclopedia_items_header_sub_issued', ['encyclopedia_items_section_sub_issued']);
			me.doTranslation('encyclopedia_infobox_props', ['encyclopedia_infobox_props']);
			me.doTranslation('encyclopedia_items_more');

			$(me.places['encyclopedia_items_header_count']).each(function (index, element) {
				me.translateEncyclopediaItemsHeader(element, me.translations['en']['encyclopedia_items_section']);
			});
			glyph_tile_section.translate();
		}

	};
	encyclopedia_section.testTranslation = function () {
		if (this.isToTranslate()) {
			this.testTranslationMapForDic('encyclopedia_header_type', ['encyclopedia_entry_type']);
			this.testTranslationMapForDic('encyclopedia_items_header_list', ['encyclopedia_items_section']);
			this.testTranslationMapForDic('encyclopedia_items_header', ['encyclopedia_items_section']);
			this.testTranslationMapForDic('encyclopedia_items_header_sub_made', ['encyclopedia_items_section_sub_made']);
			this.testTranslationMapForDic('encyclopedia_items_header_sub_issued', ['encyclopedia_items_section_sub_issued']);
			this.testTranslationMapForDic('encyclopedia_infobox_props', ['encyclopedia_infobox_props']);
			this.testTranslationMap('encyclopedia_items_more');
			glyph_tile_section.testTranslation();
		}
	};

	item_section.translations = {
		en: {
			'item_nav': {
				'概览': 'Overview',
				'精品摄影': 'Official photos',
				'用户相册': 'User albums',
				'传图': 'Upload pics',
				'报错/催更': 'Report/remind',
				'编辑': 'Edit',
				'举报': 'Review',
			},
			'item_nav_list': {
				'屏蔽本条目': 'Block this entry',
				'报错/催更': 'Report/remind',
				'举报': 'Review',
				/* -unused? - */
				'实物相册': 'User album',
				'基本资料': 'General info',
				'封面': 'Picture',
				'发售/价格/版本': 'Release',
				'关联资料': 'Related info',
				'关联手办': 'Related figures',
				'关联动漫模型': 'Related anime models',
				'关联真实模型': 'Related real models',
				'关联毛绒布偶': 'Related plushies',
				'关联Doll娃娃': 'Related dolls',
			},
			'item_nav_push': {
				'推上首页': 'Push to home page',
			},
			'item_chinese_name': {
				'中文名称': 'Chinese name',
			},
			'item_related_title': {
				'关联条目': 'Related items:',
			},
			'item_related_item' : {
				'异色版': 'Variant',
				'同企画': 'Theme',
			},
			'item_properties': {
				'名称': 'Name',
				'别名': 'Alias',
				'属性': 'Attributes',
				'定价': 'Price',
				'发售日': 'Release date',
				'发售': 'Release',
				'比例': 'Scale',
				'制作': 'Maker',
				'发行': 'Distributor',
				'系列': 'Line',
				'原型': 'Sculptor',
				'涂装': 'Coloring',
				'原画': 'Designer',
				'角色': 'Characters',
				'作品': 'Origin',
				'版权元': "M. copyrights",
				'素材': 'Materials',
				'材质': 'Materials',
				'数量': 'Quantity',
				'洗涤': 'Washing',
				'尺寸': 'Size',
				'版权': 'Copyrights',
				'版权标记': 'Copyrights',
				'原型协力': 'Producer',
				'官网': 'Website',
				'官方链接': 'Off. links',
				'外部链接': 'Ref. links',
			},
			'item_collection_top': {
				'收藏&评分': 'Favs & rates',
				'条目访问': 'Hits',
			},
			'item_collection_status': {
				'关注': 'Interested',
				'想买': 'Wished',
				'预订': 'Preorder',
				'已入': 'Bought',
			},
			'item_collection_rate': {
				'我的评分：': 'My rating: ',
			},
			'rating_label': {
				'神物': 'grail',
				'满足': 'good',
				'眼缘': 'fleeting',
				'微妙': 'tricky',
				'邪神': 'poop',
				'未评分': 'none',
			},
			'item_collection_rate_mean': {
				'评分：': 'Rating: ',
			},
			'item_collection_sale': {
				'日亚': 'Amazon',
				'我要卖': 'Want to sell?',
				'再版许愿': 'Ask for reprint',
			},
			'item_section_title': {
				'官图·情报': 'Official information',
				'关联商品': 'Related products',
				'实物照片': 'User photos',
				'实物相册': 'User albums',
				'简评': 'Brief reviews',
				'评论': 'Comments',
				'关联二手': 'Selling preowned',
				'贡献用户': 'Contributors',
			},
			'item_process_title': {
				'进程': 'Production timeline',
			},
			'item_process_up': {
				'制作决定': 'Announced',
				'官图更新': 'Pictures update',
				'预订时间': 'Preorders opened',
				'出荷延期': 'Release delay',
				'出荷时间': 'Release time',
				'再版确定': 'Re-release announced',
			},
			'item_process_down': {
				'制作决定': 'Announced',
				'原型展示': 'Prototype display',
				'彩色原型公开': 'Colored prototype display',
				'官图更新': 'Pictures update',
				'制作决定＆原型展示': 'Announced & prototype',
				// '2021年11月22日开订': 'Preorders open 2021/11/22'
				'明日开订': 'Preorders open next day',
				// '2022年6月出荷': 'Release in 2022/06'
				// '延期至2021年12月出荷': 'Delayed to 2021/12'
				// '2021年11月29日出荷': 'Release in 2021/11/29'
				'再版确定': 'Re-release announced',
			},
			'item_contribution_type': {
				'创建': 'Created',
				'更新资料': 'Updated info',
				'更新封面': 'Updated main pic',
				'更新发售/版本': 'Updated release/version',
			},
		}
	};
	item_section.places = {
		'item_nav': '.navbar-header > ul.navbar-nav > li > a',
		'item_nav_list': '.nav > .dropdown > ul > li > a',
		'item_nav_push': '#addfav',
		'item_chinese_name': '.hpoi-ibox-title > p',
		'item_related_title': '.hpoi-relation-text',
		'item_related_item': '.hpoi-entry-item > span',
		'item_properties': '.hpoi-ibox-content > .infoList-box > .hpoi-infoList-item > span',
		'item_properties_attributes': '.hpoi-infoList-item:nth-of-type(2) > p > a',
		'item_collection_top': '.hpoi-collection-score > span',
		'item_collection_status': '.hpoi-btn-collection',
		'item_collection_rate': '.hpoi-entry-score-box > div > span',
		'item_collection_rate_selected': '#kv-caption > span',
		'item_collection_rate_mean': '.hpoi-entry-score-num-box > div > div:nth-of-type(1)',
		'item_collection_sale': '.hpoi-item-box p',
		'rating_label': '.rating-bar-chart > .graphFieldrating_barchart > .graphLabelrating_barchart',
		'item_section_title': 'div.hpoi-box-title > .hpoi-title-left span',
		'item_process_title': '.process-title > span',
		'item_process_up': '.items-process > .item-time > span:nth-of-type(1):not(:empty)',
		'item_process_time': '.items-process > .item-time > span:nth-of-type(2):not(:empty)',
		'item_process_down': '.items-process > .item-detail:not(:empty)',
		'item_contribution_type': 'div.hpoi-user-content > div',
		'item_properties_table': '.table-condensed > tbody > tr > td.info-box-left', 
	};
	item_section.isToTranslate = function() {
		const PATHNAME = window.location.pathname;
		if (PATHNAME.includes("/hobby/") && !home_item_section.isToTranslate()
			&& !search_section.isToTranslate()) {
			return true;
		}
		return false;
	};
	item_section.translate = function() {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		me.doTranslation('item_nav');
		me.doTranslation('item_nav_list');
		me.doTranslation('item_nav_push');
		me.doTranslation('item_chinese_name', ['item_chinese_name']);
		me.doTranslation('item_related_title');
		me.doTranslation('item_related_item');
		me.doTranslation('item_properties', ['item_properties']);
		let itemPropertiesNameList = $(this.places['item_properties']);
		for (const itemPropertiesName of itemPropertiesNameList) {
				itemPropertiesName.innerHTML = itemPropertiesName.innerHTML.replace('：',':');
		};
		
		let itemAttributesTitle = $('.hpoi-infoList-item > span:contains("Attributes")');
		let itemAttributesList = itemAttributesTitle.parent().find('a');
		for (const attributeLink of itemAttributesList) {
			let attributeHrefSearchParams = new URL(window.location.origin + '/' + attributeLink.getAttribute('href')).searchParams;

			//item_properties_attributes
			//for every link check attributes
			if (attributeHrefSearchParams.get('sex') != null) {
				//contains sex parameter - settings_general_form_gender (search one has different words)
				attributeLink.innerHTML = (settings_section.translations.en['settings_general_form_gender'][attributeLink.innerHTML])
					.toLowerCase();
			} else if (attributeHrefSearchParams.get('r18') != null) {
				// contains r18 parameter - search_condition_rating_list
				attributeLink.innerHTML = (search_section.translations.en['search_condition_rating_list'][attributeLink.innerHTML])
					.toLowerCase();
			} else if (attributeHrefSearchParams.get('specs') != null) {
				// contains specs - search_condition_attribute_list
				attributeLink.innerHTML = (search_section.translations.en['search_condition_attribute_list'][attributeLink.innerHTML])
					.toLowerCase();
			} else {
				// the rest - x_subtypes map, like with search, based on category 
				let categoryId = attributeHrefSearchParams.get('category');

				const typeToTypeDic = function (categoryId) {
					if (categoryId <= 100)
						return 'x_subtypes_figures';
					if (categoryId <= 200)
						return 'x_subtypes_anime_models';
					if (categoryId <= 300)
						return 'x_subtypes_dolls';
					if (categoryId <= 400)
						return 'x_subtypes_plushies';
					if (categoryId <= 500)
						return 'x_subtypes_real_models';
					if (categoryId <= 900)
						return 'x_subtypes_merch';
				};
				attributeLink.innerHTML = (TRANSLATIONS.en[typeToTypeDic(categoryId)][attributeLink.innerHTML])
					.toLowerCase();
			}

		};
		//TODO price
			// 15,800日元 （908元）
			// 6,800日元 （含税，391元）
		// TODO version
			// 2021/7/28 , ￥15,800

		let itemPropertiesValueList = $('.hpoi-infoList-item > p');
		for (const itemPropertiesValue of itemPropertiesValueList) {
				itemPropertiesValue.innerHTML = itemPropertiesValue.innerHTML.replaceAll('、 ',', ');
				itemPropertiesValue.innerHTML = itemPropertiesValue.innerHTML.replaceAll('、',', ');
		};

		me.doTranslation('item_collection_top', ['item_collection_top']);
		me.doTranslation('item_collection_status');
		$(me.places['item_collection_status']).css('width', '23%');
		me.doTranslation('item_collection_rate');

		var translateMyRateResult = function() {
			me.doTranslation('item_collection_rate_selected', ['rating_label']);
			$(me.places['item_collection_rate_selected']).css('margin-left', '8px')
				.css('position', 'relative').css('top', '6px').css('font-size', '12px');
		};
		me.createAndUseObserverForList(translateMyRateResult, $('#kv-caption')[0]);
		
		me.doTranslation('item_collection_rate_mean');
		
		let ratingPeopleCountNode = $('.hpoi-entry-score-num-box > div > div:nth-of-type(2)')[0];
		let ratingPeopleCount = ratingPeopleCountNode.textContent.replace('共有', '').replace('个评分', '');
		let ratingPeopleTranslated = 'Rated by ' + ratingPeopleCount + ' users';
		ratingPeopleCountNode.textContent = ratingPeopleTranslated;
		
		var translateRateChart = function() {
			me.doTranslation('rating_label');
		};
		me.createAndUseObserverForList(translateRateChart, $('#rating_barchart')[0]);
		me.doTranslation('item_collection_sale');

		me.doTranslation('item_section_title');
		me.doTranslation('item_process_title');
		me.doTranslation('item_process_up');

		let relativeProcessTimes = $(me.places['item_process_time']);
		translateRelativeDate(relativeProcessTimes);

		me.doTranslation('item_process_down'); // TODO: translate ones with dates
		me.doTranslation('item_contribution_type', ['item_contribution_type']);
		me.doTranslation('item_properties_table', ['item_properties']);
	};
	item_section.testTranslation = function() {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}

		me.testTranslationMap('item_nav');
		me.testTranslationMap('item_nav_list');
		me.testTranslationMap('item_nav_push');
		me.testTranslationMapForDic('item_chinese_name', ['item_chinese_name']);
		me.testTranslationMapForDic('item_properties', ['item_properties']);
		me.testTranslationMapForDic('item_collection_top', ['item_collection_top']);
		/* TODO: think about delayed testing */
		// me.testTranslationMap('item_collection_status');
		me.testTranslationMap('item_collection_rate');
		me.testTranslationMap('item_section_title');
		me.testTranslationMap('item_process_title');
		me.testTranslationMapForDic('item_contribution_type', ['item_contribution_type']);
		me.testTranslationMapForDic('item_properties_table', ['item_properties']);
	};

	settings_section.translations = {
		en: {
			'settings_list': {
				'基本资料': 'General info',
				'屏蔽设置': 'Block settings',
				'隐私设置': 'Privacy settings',
				'推送设置': 'Notification settings',
				'修改密码': 'Change password',
				'更换邮箱': 'Change e-mail',
				'更换手机号': 'Change phone number',
				'账号关联': 'Account linking',
				'头像': 'Avatar',
				'用户设置': 'User settings',
				'账号注销': 'Delete account',
				'注销': 'Delete account',
			},
			'settings_panel_button': {
				'保存': 'Save',
				'更换': 'Change',
				'更换邮箱': 'Change',
				'获取': 'Obtain',
			},
			'settings_general_form': {
				'昵称:': 'Nickname:',
				'签名:': 'Signature:',
				'性别:': 'Gender:',
				'生日:': 'Birthday:',
				'自我介绍:': 'About:',
			},
			'settings_general_form_gender': {
				'男': 'Male',
				'女': 'Female',
				'保密': 'Secret',
				'无性别': 'Genderless'
			},
			'settings_block_form': {
				'NSFW内容:': 'NSFW content:',
				'屏蔽动态显示:': 'Dynamic list content:',
				'邮件通知:': 'Email notifications:',
				'短信通知:': 'SMS notifications:',
				'条目评论区:': 'Entry page comment section',
			},
			'settings_block_form_radio': {
				'提示我': 'Prompt me',
				'不显示': 'Don\'t show',
				'显示': 'Show',
				'直接显示': 'Show directly',
				'手动展开': 'Show when requested',
				'情报': 'Info',
				'评论': 'Comment',
				'图片上传': 'New pics',
				'出售': 'Sale',
				'求购': 'Hunt',
			},
			'settings_privacy_headers': {
				'周边条目': 'Collection',
				'收藏内容': 'Favorites',
				'收藏统计': 'Collection stats',
				'其他内容': 'Other',
				'关注、粉丝': 'Followed, followers',
				'讨论板个人主页': 'Forum profile'
			},
			'settings_privacy_form': {
				'手办、动漫模型、真实模型、毛绒布偶、Doll娃娃': 'figures, dolls, plushies etc',
				'相册、图片、文章': 'albums, pics, articles',
				'历史消费、入手数量、待补款等': 'activity, items quantity, ordered etc.',
				'系列、厂商、角色、人物、作品': 'lines, companies, characters, people, series',
			},
			'settings_privacy_form_radio': {
				'所有人可见': 'For all',
				'互相关注可见': 'For friends',
				'仅自己可见': 'For me',
			},
			'settings_notification_header': {
				'推荐内容:': 'Recommended content:',
				'关注消息:': 'Followed entries updates:',
				'互动通知:': 'Social interactions:',
				'商品信息': 'Product updates',
			},
			'settings_notification_radio': {
				'推荐内容推送': 'enable',
				'关注up主更新推送': 'main updates',
				'关注的周边情报推送': 'related items',
				'关注厂商信息推送': 'companies info',
				'关注系列信息推送': 'lines info',
				'关注作品信息推送': 'series info',
				'关注角色信息推送': 'characters info',
				'关注人物信息推送': 'people\'s info',
				'评论回复': 'new replies',
				'私信': 'new messages',
				'收到的赞': 'likes received',
			},
			'settings_notification_product_info_form': {
				'开订:': 'Order start:',
				'截单:': 'Order end:',
				'出荷:': 'Release date:',
			},
			'settings_notification_product_info_radio': {
				'站内推送': ' on site',
				'邮件通知': ' via e-mail',
				'短信通知': ' via SMS',
			},
			'settings_password_form': {
				'旧密码:': 'Old password:',
				'新密码:': 'New password:',
				'确认密码:': 'Confirm new password:',
			},
			'settings_password_forgot': {
				'忘记密码？': 'Forgot password?',
			},
			'settings_email_link_avatar_form': {
				'当前邮箱：': 'Old e-mail:',
				'更换邮箱：': 'New e-mail:',
				'旺旺ID:': 'WangWang ID:',
				'原图': 'Original image',
				'缩略图': 'Thumbnail',
				'使用新图': 'Use new image',
			},
			'settings_phone_form': {
				'原手机号:': 'Old phone number:',
				'密码:': 'Password:',
				'新手机号:': 'New phone number',
				'获取验证码:': 'Verification code:',
			},
			'settings_phone_form_placeholder': {
				'图片验证': 'A picture text',
				'填写短信验证码': 'Fill in a code from SMS',
			},
			'settings_avatar_form_placeholder': {
				'在线上传请在此输入地址': 'Paste image URL',
				'如需本地上传，请选择文件': 'Select image file',
			},
			'settings_avatar_form_button_upload': {
				'在线上传': 'Upload',
				'本地上传': 'Upload',
			},
			'settings_avatar_form_button_cancel': {
				'还是算了': 'Cancel',
			},
			'settings_delete_title': {
				'账号注销协议': 'Account Removal Agreement',
			},
			'settings_delete_agreement': {
				'我已了解并同意《账号注销协议》': 'I have understood and agreed to the "Account Removal Agreement"',
			},
			'settings_delete_button': {
				'下一步': 'Next',
			}
		},
	};
	settings_section.places = {
		'settings_list': '.list-group > .list-group-item',
		'settings_panel_title': '.panel > .panel-heading',
		'settings_panel_button': '.form-group > div > button',
		'settings_general_form': '#editData > .form-group > label',
		'settings_general_form_gender': '#editData > .form-group > div > label.radio-inline',
		'settings_block_form': '#updSetting > .form-group > label',
		'settings_block_form_radio': '#updSetting > .form-group > div > label.radio-inline',
		'settings_privacy_headers': '#updSetting > .form-group > div.row > h4',
		'settings_privacy_form': '#updSetting > .form-group > div.row > span',
		'settings_privacy_form_radio': '#updSetting > .form-group > div > div > label.radio-inline',

		'settings_notification_header': '#updSetting > div.form-group > label',
		'settings_notification_radio': '#updSetting div.push-text',
		'settings_notification_product_info_form': '#updSetting > div.form-group > div > div.row > .control-label',
		'settings_notification_product_info_radio': '#updSetting > div.form-group > div > div.row > div > label.radio-inline',

		'settings_password_form': 'form#updPwd > div.form-group > label',
		'settings_password_forgot': 'form#updPwd > div.form-group > div > a',
		'settings_email_link_avatar_form': 'form.form-horizontal > div.panel > div.panel-body > div.form-group > label',
		
		'settings_phone_form': 'form#updPhone > div.form-group > label',
		'settings_phone_form_placeholder': 'form#updPhone > div.form-group > div > input[placeholder]',
		'settings_avatar_form_placeholder': '.form-group > div > div.input-group > input[placeholder]',
		'settings_avatar_form_button_upload': '.form-group > div > div.input-group > span.input-group-btn > button',
		'settings_avatar_form_button_cancel': '.form-group > div.bs-example > a.btn',

		'settings_delete_title': 'div#step-one > div > h2',
		'settings_delete_agreement': '#withdrawCheckbox',
		'settings_delete_button': '#withdrawButton',
	};
	settings_section.isToTranslate = function () {
		const PATHNAME = window.location.pathname;
		if (PATHNAME.includes('/user/edit/')) {
			return true;
		}
		return false;
	};
	settings_section.translate = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		const PATHNAME = window.location.pathname;

		me.doTranslation('settings_list');
		me.doTranslation('settings_panel_title', ['settings_list']);
		me.doTranslation('settings_panel_button');
		me.doTranslation('settings_general_form');
		me.doTranslation('settings_general_form_gender');

		if (PATHNAME.includes('/user/edit/shieldingSetting')) {
			me.doTranslation('settings_block_form');
			me.doTranslation('settings_block_form_radio');
		}
		me.doTranslation('settings_privacy_headers');
		me.doTranslation('settings_privacy_form', ['settings_privacy_form']);
		me.doTranslation('settings_privacy_form_radio');
		if (PATHNAME.includes('/user/edit/pushSettings')) {
			me.doTranslation('settings_notification_header');
			me.doTranslation('settings_notification_radio');
			me.doTranslation('settings_notification_product_info_form');
			me.doTranslation('settings_notification_product_info_radio');
		}
		me.doTranslation('settings_password_form');
		me.doTranslation('settings_password_forgot'); //
		me.doTranslation('settings_email_link_avatar_form');
		me.doTranslation('settings_phone_form');
		me.doTranslation('settings_avatar_form_button_upload');
		me.doTranslation('settings_avatar_form_button_cancel');


		if (PATHNAME.includes('/user/edit/withdraw')) {
			me.doTranslation('settings_delete_title');
			let deleteAgreementTitleContainer = $(me.places['settings_delete_title'])[0].parentNode; 
			$(deleteAgreementTitleContainer).removeClass();
			$(deleteAgreementTitleContainer).addClass('col-sm-offset-4');

			let deleteAgreementText = $(me.places['settings_delete_agreement'])[0].nextSibling;
			me.doTranslation(null, ['settings_delete_agreement'], [deleteAgreementText]);
			let deleteAgreementTextContainer = deleteAgreementText.parentNode.parentNode; 
			$(deleteAgreementTextContainer).removeClass();
			$(deleteAgreementTextContainer).addClass('col-sm-offset-4');

			me.doTranslation('settings_delete_button');
		}

		var verifyboxes = $(me.places['settings_phone_form_placeholder']);
		for (const verifybox of verifyboxes) {
			verifybox.attributes['placeholder'].textContent =
				me.translations.en['settings_phone_form_placeholder'][verifybox.attributes['placeholder'].textContent];
		}
		var uploadBoxes = $(me.places['settings_avatar_form_placeholder']);
		for (const uploadBox of uploadBoxes) {
			uploadBox.attributes['placeholder'].textContent =
				me.translations.en['settings_avatar_form_placeholder'][uploadBox.attributes['placeholder'].textContent];
		}
	};
	settings_section.testTranslation = function () {
		const me = this;
		if (!me.isToTranslate()) {
			return;
		}
		const PATHNAME = window.location.pathname;

		me.testTranslationMap('settings_list');
		me.testTranslationMapForDic('settings_panel_title', ['settings_list']);
		me.testTranslationMap('settings_panel_button');
		me.testTranslationMap('settings_general_form');
		me.testTranslationMap('settings_general_form_gender');
		if (PATHNAME.includes('/user/edit/shieldingSetting')) {
			me.testTranslationMap('settings_block_form');
			me.testTranslationMap('settings_block_form_radio');
		}
		me.testTranslationMap('settings_privacy_headers');
		me.testTranslationMapForDic('settings_privacy_form', ['settings_privacy_form']);
		me.testTranslationMap('settings_privacy_form_radio');
		if (PATHNAME.includes('/user/edit/pushSettings')) {
			me.testTranslationMap('settings_notification_header');
			me.testTranslationMap('settings_notification_radio');
			me.testTranslationMap('settings_notification_product_info_form');
			me.testTranslationMap('settings_notification_product_info_radio');
		}
		me.testTranslationMap('settings_password_form');
		me.testTranslationMap('settings_password_forgot');
		me.testTranslationMap('settings_email_link_avatar_form');
		me.testTranslationMap('settings_phone_form');
		me.testTranslationMap('settings_avatar_form_button_upload');
		me.testTranslationMap('settings_avatar_form_button_cancel');

		me.testTranslationMap('settings_delete_title');
		me.testTranslationMap('settings_delete_button');
	};

	$(document).ready(function () {
		console.log('translating starting...');
		const PATHNAME = window.location.pathname;

		nav_top_section.translate();
		home_user_section.translate();
		home_item_section.translate();
		item_section.translate();

		doTranslation('more_button');

		login_form_section.translate();
		search_section.translate();
		global_search_section.translate();
		encyclopedia_section.translate();
		settings_section.translate();

		let datesCnReleaseDate = $('.hpoi-ibox-content > .infoList-box > .hpoi-infoList-item > span:contains("date")').siblings('p').children('a');
		let datesTextesReleaseDate = datesCnReleaseDate.contents().filter(function () {
				return this.nodeType === Node.TEXT_NODE;
			});
		translateFixedDate(datesTextesReleaseDate);

		//translate home search placeholder
		var searchboxes2 = $(PLACES['search-searchbox']);
		for (const searchbox of searchboxes2) {
			searchbox.attributes['placeholder'].textContent =
				TRANSLATIONS.en['search-searchbox']['placeholder'];
		}

		console.log('translating completed');
		console.log('tests starting...');

		try {
			expect(TRANSLATIONS).toExist("TRANSLATIONS is empty!");
			expect(TRANSLATIONS.en).toExist("English is somehow empty!");

			nav_top_section.testTranslation();
			home_user_section.testTranslation();
			login_form_section.testTranslation();
			search_section.testTranslation();
			global_search_section.testTranslation();
			encyclopedia_section.testTranslation();
			settings_section.testTranslation();
			item_section.testTranslation();

		} catch (e) {
			console.error(e);
		}
		console.log('tests completed');
	});

	console.log('script loading finished');

})();
