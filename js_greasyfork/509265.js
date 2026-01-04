// ==UserScript==
// @name			Make Pixiv a little more useful.
// @name:ja			Pixivを少し便利に。
// @namespace		https://greasyfork.org/ja/users/1023652
// @version			0.2.0.5-Beta
// @description		I wish I could make Pixiv a little more useful.
// @description:ja			Pixivを少し便利にできたらいいな。
// @require			https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.3/Sortable.min.js
// @require			https://unpkg.com/jspdf@3.0.4/dist/jspdf.umd.min.js
// @resource		BIZUDGothic-Regular https://raw.githubusercontent.com/Happy-come-come/UserScripts/refs/heads/main/Pixiv%E3%82%92%E5%B0%91%E3%81%97%E4%BE%BF%E5%88%A9%E3%81%AB%E3%80%82/font/BIZUDGothic-Regular.ttf
// @author			ゆにてぃー
// @match			https://www.pixiv.net/*
// @connect			discord.com
// @connect			raw.githubusercontent.com
// @connect			i.pximg.net
// @connect			s.pximg.net
// @icon			https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://www.pixiv.net
// @icon64			https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=64&url=https://www.pixiv.net
// @grant			GM_registerMenuCommand
// @grant			GM_xmlhttpRequest
// @grant			GM_getResourceURL
// @grant			unsafeWindow
// @grant			window.onurlchange
// @run-at			document-idle
// @license			MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/509265/Make%20Pixiv%20a%20little%20more%20useful.user.js
// @updateURL https://update.greasyfork.org/scripts/509265/Make%20Pixiv%20a%20little%20more%20useful.meta.js
// ==/UserScript==

if(window.top !== window.self)return;
(async function(){
	'use strict';
	const debugging = false;
	let debuggingCount = 0;
	const debug = debugging
	? (...args) => {
		const count = debuggingCount++;
		const stack = new Error().stack.split('\n')[2]?.trim() || '';
		const location = stack.match(/\((.*)\)/)?.[1] || stack;
		if(args.length === 0){
			console.log(`%c[debug: ${count}] %c${location}`, 
				'color: #0096fa; font-weight: bold',
				'color: #666; font-size: 0.9em');
		}else{
			console.log(`%c[debug: ${count}]%c ${location}`, 
				'color: #0096fa; font-weight: bold',
				'color: #666; font-size: 0.9em',
				...args);
		}
	}
	: () => {};
	const _cloneInto = typeof cloneInto === "function" ? (obj, _window = window, options = {}) => cloneInto(obj, _window, options) : (obj)=>obj;
	const timeZoneObject = Intl.DateTimeFormat().resolvedOptions();
	let i18nData = {};
	i18nData.ja = {
		makePixivLittleUseful: {
			settings: {
				displayName: "Pixivを少し便利に。",
				featuresToggle: "機能の切り替え",
			},
			notify: {
				toolTip: {
					expand: "展開",
					unexpand: "折りたたむ",
				},
			}
		},
		makeMenuButton: {
			featureName: "メニューボタンを作成",
			home: "ホーム",
			illusts: "イラスト",
			manga: "マンガ",
			novels: "小説",
			following: "フォロー中",
			followingR18: "R-18フォロー中",
			discovery: "ディスカバリー",
			ranking: "ランキング",
			bookmark: "ブックマーク",
			pixivSettings: "Pixivの設定",
			scriptSettings: "スクリプトの設定",
			settings: {
				displayName: "メニューボタンを作成",
				description: "画面の隅にメニューボタンを作成します。",
			}
		},
		webhookBringsArtworkToDiscord: {
			featureName: "DiscordのWebhookで作品を送信",
			toggle: "切り替え",
			labelUserTag: "ユーザータグを追加",
			labelCaption: "キャプション:",
			labelWebhook: "Webhook:",
			labelNovelFileType: "ファイル形式:",
			submit: "送信",
			selectAll: "すべて選択",
			removeAll: "すべて削除",
			userTag: "ユーザータグ",
			uploadDate: "アップロード日",
			noTags: "なし",
			settings: {
				displayName: "DiscordのWebhookで作品を送信",
				description: "作品ページにDiscordのWebhookで作品を送信するボタンを追加します。",
				sendAndClose: "送信ボタンを押したときに送信画面を閉じる",
				defaultCaptionOnOff: "デフォルトでキャプションを送信する設定にする",
				webhooks: "Webhookの設定",
			},
			notify: {
				sendToDiscord: "Discordに送信",
				downloadImages: "画像をダウンロード",
				uploadingToDiscord: "Discordにアップロード中",
				processImages: "画像を圧縮中……",
			}
		},
		alternativeSearch: {
			featureName: "検索を便利に。",
			bookmarkApiFailed: "ブックマークの操作に失敗しました。",
			settings: {

			}
		},
		advancedSettings: {
			settings: {
				displayName: "高度な設定",
				exportSettings: "設定をエクスポート",
				importSettings: "設定をインポート",
				exportButtonText: "エクスポート",
				importButtonText: "インポート",
				importSuccessAlert: "設定データを正常に読み込みました。",
				importErrorAlert: "設定データの読み込みに失敗しました。正しいデータか確認してください。",
			}
		}
	};
	let scriptSettings = {};
	let envTextData = {};
	_i18n();
	let currentUrl = document.location.href;
	let updating = false;
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	const {isMobile, isPC, isOddMobile} = deviceCheck();

	const sessionData = {
		myUserData: {},
		themeMode: {
			themeNum: null, // 0=デフォルト, 1=ダーク
		},
		appendedCssElements: {},
		makePixivLittleUseful:{
		},
		whenLocationChangeFunctions: [],
	}

	const functions = {
		"makeMenuButton": {
			"function": makeMenuButton,
			"timing": ["onLoad"], // afterUrlChange, onLoad, always
			"forPC": true,
			"forMobile": true,
			"ignoreFeatureToggle": true,
			"ignoreIsRunning": true,
			"isRunning": false,
		},
		"webhookBringsArtworkToDiscord": {
			"function": webhookBringsArtworkToDiscord,
			"timing": ["afterUrlChange", "onLoad"], // afterUrlChange, onLoad, always
			"forPC": true,
			"forMobile": true,
			"ignoreIsRunning": true,
			"isRunning": false,
		},
		"alternativeSearch": {
			"function": alternativeSearch,
			"timing": ["onLoad"], // afterUrlChange, onLoad, always
			"forPC": true,
			"forMobile": false,
			"isRunning": false,
			"ignoreFeatureToggle": true,
		}
	}

	async function main({refresh = false, urlChange = false, firstRun = false} = {}){
		const featurestoggle = scriptSettings?.makePixivLittleUseful?.enableFunction ?? {};
		//const featurestoggle = {webhookBringsArtworkToDiscord: true};
		const userId = currentUrl.match(/users\/(\d+)/)?.[1];
		const illustId = currentUrl.match(/artworks\/(\d+)/)?.[1];
		const novelId = currentUrl.match(/novel\/show.php\?id=(\d+)/)?.[1];
		const promises = [];
		for(const key in functions){
			const func = functions[key];
			if(!featurestoggle[key] && !func.ignoreFeatureToggle)continue;
			if(((isPC && func.forPC) || (isMobile && func.forMobile)) === false)continue;
			if(func.isRunning && !func.ignoreIsRunning)continue;
			if(refresh || func.timing.includes("always") || (func.timing.includes("onLoad") && firstRun) || (func.timing.includes("afterUrlChange") && (urlChange || firstRun))){
				const p = (async () => {
					try{
						func.isRunning = true;
						debug({functionName: key, result: await func.function({userId, illustId, novelId, refresh})});
					}catch(error){
						console.error({functionName: key, error});
					}finally{
						func.isRunning = false;
					}
				})();
				promises.push(p);
			}
		}
		await Promise.allSettled(promises);
	}

	async function makeMenuButton(){
		const textData = envTextData.makeMenuButton;
		const featureCss = ()=>{return `
			.MPLU-menuItem-container:hover {
				background-color: var(--MPLU-menu-container-hover-background-color);
			}
`.replace(/^	{3}/mg,'');
		};
		appendStyle("makeMenuButton", featureCss(), true);
		const menuButton = h('div', {
				className: 'MPLU-menuButton MPLU-container',
				style: {
					position: 'fixed',
					width: '48px',
					height: '48px',
					backgroundColor: '#0096FA',
					borderRadius: '50%',
					cursor: 'pointer',
					userSelect: 'none',
					border: '2px solid #00bfff',
					zIndex: '6451'
				}
			},
			h('button', {
					className: 'MPLU-svg-button',
					style: {
						width: '100%',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						border: 'none',
						backgroundColor: 'transparent',
						padding: '0',
						margin: '0',
					},
				},
				h('svg', {
						position: 'absolute',
						viewBox: '0 0 512 512',
						style: {
							width: '24px',
							height: '24px',
							fill: 'white'
						}
					},
					h('g', {},
						h('path', {d: 'M50.047,0C22.404,0,0,22.4,0,50.047c0,27.646,22.404,50.046,50.047,50.046c27.642,0,50.046-22.4,50.046-50.046 C100.093,22.4,77.689,0,50.047,0z'}),
						h('path', {d: 'M256,0c-27.642,0-50.047,22.4-50.047,50.047c0,27.646,22.404,50.046,50.047,50.046 c27.642,0,50.047-22.4,50.047-50.046C306.047,22.4,283.642,0,256,0z'}),
						h('path', {d: 'M461.953,100.093c27.638,0,50.047-22.4,50.047-50.046C512,22.4,489.591,0,461.953,0 s-50.046,22.4-50.046,50.047C411.907,77.693,434.315,100.093,461.953,100.093z'}),
						h('path', {d: 'M50.047,205.953C22.404,205.953,0,228.353,0,256s22.404,50.047,50.047,50.047 c27.642,0,50.046-22.4,50.046-50.047S77.689,205.953,50.047,205.953z'}),
						h('path', {d: 'M256,205.953c-27.642,0-50.047,22.4-50.047,50.047s22.404,50.047,50.047,50.047 c27.642,0,50.047-22.4,50.047-50.047S283.642,205.953,256,205.953z'}),
						h('path', {d: 'M461.953,205.953c-27.638,0-50.046,22.4-50.046,50.047s22.408,50.047,50.046,50.047S512,283.647,512,256 S489.591,205.953,461.953,205.953z'}),
						h('path', {d: 'M50.047,411.907C22.404,411.907,0,434.307,0,461.953C0,489.6,22.404,512,50.047,512 c27.642,0,50.046-22.4,50.046-50.047C100.093,434.307,77.689,411.907,50.047,411.907z'}),
						h('path', {d: 'M256,411.907c-27.642,0-50.047,22.4-50.047,50.046C205.953,489.6,228.358,512,256,512 c27.642,0,50.047-22.4,50.047-50.047C306.047,434.307,283.642,411.907,256,411.907z'}),
						h('path', {d: 'M461.953,411.907c-27.638,0-50.046,22.4-50.046,50.046c0,27.647,22.408,50.047,50.046,50.047 S512,489.6,512,461.953C512,434.307,489.591,411.907,461.953,411.907z'})
					)
				)
			)
		);
		if(!sessionData.menuButton?.button?.element){
			sessionData.menuButton = {};
			sessionData.menuButton.button = {};
			if(isPC){
				const upButton = await waitElementAndGet({query: 'body button:has(svg>polyline[points="60,105 60,8"])'});
				const upButtonRect = upButton?.getBoundingClientRect();
				menuButton.style.left = `${upButton ? (upButtonRect.left + window.scrollX): 48}px`;
				menuButton.style.top = `${upButton ? (upButtonRect.top + window.scrollY - 60) : 10}px`;
				document.body.appendChild(menuButton);
				sessionData.menuButton.button.element = menuButton;
			}else{
				menuButton.style.bottom = "48px";
				menuButton.style.right = "10px";
				document.body.appendChild(menuButton);
				sessionData.menuButton.button.element = menuButton;
			}
		}

		function openMenu(){
			if(sessionData.menuButton?.menuContainer?.element){
				sessionData.menuButton.menuContainer.element.style.display = 'flex';
				sessionData.menuButton.menuContainer.isDisplayed = true;
				return;
			}else{
				sessionData.menuButton.menuContainer = {};
				sessionData.menuButton.menuContainer.isDisplayed = false;
				sessionData.menuButton.menuContainer.element = null;
			}
			const presetMenuItems = {
				home: {
					displayName: textData.home,
					pcOnly: true,
					url: 'https://www.pixiv.net/',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 24 24', fill: 'none'},
							h('path', {
								'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: 'currentColor',
								d: 'M9 19a1 1 0 01-1 1H4a1 1 0 01-1-1v-7.586a1 1 0 01.293-.707l8-8a1 1 0 011.414 0l8 8a1 1 0 01.293.707V19a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3.5a3 3 0 10-6 0V19z',
							})
						),
					},
				},
				illust: {
					displayName: textData.illusts,
					pcOnly: true,
					url: 'https://www.pixiv.net/illustration',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 24 24', fill: 'none'},
							h('path', {
								'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: 'currentColor',
								d: 'M6 4a3 3 0 00-3 3v10a3 3 0 003 3h12a3 3 0 003-3V7a3 3 0 00-3-3H6zm13 8.5l-4 2-6-3-4 2V17a1 1 0 001 1h12a1 1 0 001-1v-4.5zM18 9a2 2 0 11-4 0 2 2 0 014 0z',
							})
						),
					},
				},
				manga: {
					displayName: textData.manga,
					pcOnly: true,
					url: 'https://www.pixiv.net/manga',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 24 24', fill: 'none'},
							h('path', {
								'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: 'currentColor',
								d: 'M20 6a3 3 0 00-3-3H7a3 3 0 00-3 3v12a3 3 0 003 3h10a3 3 0 003-3V6zm-3-1a1 1 0 011 1v5h-4V5h3zm-4 0H7a1 1 0 00-1 1v5h7V5zm-7 7v6a1 1 0 001 1h2v-7H6zm11 7h-7v-7h8v6a1 1 0 01-1 1z',
							})
						),
					},
				},
				novels: {
					displayName: textData.novels,
					pcOnly: true,
					url: 'https://www.pixiv.net/novel',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 24 24', fill: 'none'},
							h('path', {
								fill: 'currentColor',
								d: 'M7 13.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM7.5 15a.5.5 0 000 1h9a.5.5 0 000-1h-9zM7 11.5a.5.5 0 01.5-.5h4a.5.5 0 010 1h-4a.5.5 0 01-.5-.5zM7.5 17a.5.5 0 000 1h9a.5.5 0 000-1h-9z',
							}),
							h('path', {
								'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: 'currentColor',
								d: 'M17 3a3 3 0 013 3v12a3 3 0 01-3 3H7a3 3 0 01-3-3V6a3 3 0 013-3h10zm1 3a1 1 0 00-1-1H7a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6z',
							}),

						),
					},
				},
				following: {
					displayName: textData.following,
					pcOnly: true,
					url: 'https://www.pixiv.net/bookmark_new_illust.php',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 24 24', fill: 'none'},
							h('path', {
								'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: 'currentColor',
								d: 'M7.507 10.5a3.75 3.75 0 10-.014 0C4.459 10.504 2 12.883 2 15.818 2 16.471 2.53 17 3.182 17h7.451a5.608 5.608 0 012.21-2.445c-.585-2.325-2.752-4.052-5.336-4.055zm8.993 4a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm0 0c-3.038 0-5.5 2.381-5.5 5.318V20a1 1 0 001 1h9a1 1 0 001-1v-.182c0-2.937-2.462-5.318-5.5-5.318z',
							})
						),
					},
				},
				followingR18: {
					displayName: textData.followingR18,
					pcOnly: true,
					url: isMobile ? 'https://www.pixiv.net/bookmark_new_illust.php?mode=r18' : 'https://www.pixiv.net/bookmark_new_illust_r18.php',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 24 24', fill: 'none'},
							h('path', {
								'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: 'currentColor',
								d: 'M7.507 10.5a3.75 3.75 0 10-.014 0C4.459 10.504 2 12.883 2 15.818 2 16.471 2.53 17 3.182 17h7.451a5.608 5.608 0 012.21-2.445c-.585-2.325-2.752-4.052-5.336-4.055zm8.993 4a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zm0 0c-3.038 0-5.5 2.381-5.5 5.318V20a1 1 0 001 1h9a1 1 0 001-1v-.182c0-2.937-2.462-5.318-5.5-5.318z',
							})
						),
					},
				},
				discovery: {
					displayName: textData.discovery,
					pcOnly: true,
					url: 'https://www.pixiv.net/discovery',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 24 24', fill: 'none'},
							h('path', {
								'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: 'currentColor',
								d: 'M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zM6 18l4-8 8-4-4 8-8 4zm6-5a1 1 0 100-2 1 1 0 000 2z',
							})
						),
					},
				},
				ranking: {
					displayName: textData.ranking,
					pcOnly: true,
					url: 'https://www.pixiv.net/ranking.php',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 24 24', fill: 'none'},
							h('path', {
								'fill-rule': 'evenodd', 'clip-rule': 'evenodd', fill: 'currentColor',
								d: 'M14 6a2 2 0 01-1.023 1.745c.678 1.008 1.657 2.106 2.773 2.255.851.114 1.836-.317 2.644-.808a2 2 0 111.277.78l-.892 5.357A2 2 0 0116.806 17H7.194a2 2 0 01-1.973-1.671L4.33 9.973a2 2 0 111.277-.78c.808.49 1.793.92 2.644.807 1.116-.15 2.095-1.247 2.773-2.255A2 2 0 1114 6zM7 18a1 1 0 100 2h10a1 1 0 100-2H7z',
							})
						),
					},
				},
				bookmark: {
					displayName: textData.bookmark,
					pcOnly: true,
					url: sessionData.myUserData.myUserId !== 1 ? `https://www.pixiv.net/users/${sessionData.myUserData.myUserId}/bookmarks/artworks` : 'https://www.pixiv.net/bookmark.php',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 32 32', fill: 'rgb(255, 64, 96)'},
							h('path', {
								d: 'M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z',
							}),
							h('path', {
								d: 'M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z',
							})
						),
					},
					event: ()=>{
						navigateTo(`https://www.pixiv.net/users/${sessionData.myUserData.myUserId}/bookmarks/artworks`);
					},
				},
				pixivSettings: {
					displayName: textData.pixivSettings,
					pcOnly: true,
					url: 'https://www.pixiv.net/settings',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 512 512', fill: colors.get('pixivBlue')},
							h('path', {
								d: 'M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252 c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366 c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586 c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363 c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005 c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675 c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366 c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.602,5.598-13.36,8.477-21.226,7.552 l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805 c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303 c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799 c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364 c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005 c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007 c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366 c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799 c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303z M281.292,329.698 c-39.68,16.436-85.172-2.407-101.607-42.087c-16.436-39.68,2.407-85.171,42.087-101.608c39.68-16.436,85.172,2.407,101.608,42.088 C339.815,267.771,320.972,313.262,281.292,329.698z',
							})
						),
					},
				},
				scriptSettings: {
					displayName: textData.scriptSettings,
					url: '#',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 512 512', fill: 'currentColor'},
							h('path', {
								d: 'M502.325,307.303l-39.006-30.805c-6.215-4.908-9.665-12.429-9.668-20.348c0-0.084,0-0.168,0-0.252 c-0.014-7.936,3.44-15.478,9.667-20.396l39.007-30.806c8.933-7.055,12.093-19.185,7.737-29.701l-17.134-41.366 c-4.356-10.516-15.167-16.86-26.472-15.532l-49.366,5.8c-7.881,0.926-15.656-1.966-21.258-7.586 c-0.059-0.06-0.118-0.119-0.177-0.178c-5.597-5.602-8.476-13.36-7.552-21.225l5.799-49.363 c1.328-11.305-5.015-22.116-15.531-26.472L337.004,1.939c-10.516-4.356-22.646-1.196-29.701,7.736l-30.805,39.005 c-4.908,6.215-12.43,9.665-20.349,9.668c-0.084,0-0.168,0-0.252,0c-7.935,0.014-15.477-3.44-20.395-9.667L204.697,9.675 c-7.055-8.933-19.185-12.092-29.702-7.736L133.63,19.072c-10.516,4.356-16.86,15.167-15.532,26.473l5.799,49.366 c0.926,7.881-1.964,15.656-7.585,21.257c-0.059,0.059-0.118,0.118-0.178,0.178c-5.602,5.598-13.36,8.477-21.226,7.552 l-49.363-5.799c-11.305-1.328-22.116,5.015-26.472,15.531L1.939,174.996c-4.356,10.516-1.196,22.646,7.736,29.701l39.006,30.805 c6.215,4.908,9.665,12.429,9.668,20.348c0,0.084,0,0.167,0,0.251c0.014,7.935-3.44,15.477-9.667,20.395L9.675,307.303 c-8.933,7.055-12.092,19.185-7.736,29.701l17.134,41.365c4.356,10.516,15.168,16.86,26.472,15.532l49.366-5.799 c7.882-0.926,15.656,1.965,21.258,7.586c0.059,0.059,0.118,0.119,0.178,0.178c5.597,5.603,8.476,13.36,7.552,21.226l-5.799,49.364 c-1.328,11.305,5.015,22.116,15.532,26.472l41.366,17.134c10.516,4.356,22.646,1.196,29.701-7.736l30.804-39.005 c4.908-6.215,12.43-9.665,20.348-9.669c0.084,0,0.168,0,0.251,0c7.936-0.014,15.478,3.44,20.396,9.667l30.806,39.007 c7.055,8.933,19.185,12.093,29.701,7.736l41.366-17.134c10.516-4.356,16.86-15.168,15.532-26.472l-5.8-49.366 c-0.926-7.881,1.965-15.656,7.586-21.257c0.059-0.059,0.119-0.119,0.178-0.178c5.602-5.597,13.36-8.476,21.225-7.552l49.364,5.799 c11.305,1.328,22.117-5.015,26.472-15.531l17.134-41.365C514.418,326.488,511.258,314.358,502.325,307.303z M281.292,329.698 c-39.68,16.436-85.172-2.407-101.607-42.087c-16.436-39.68,2.407-85.171,42.087-101.608c39.68-16.436,85.172,2.407,101.608,42.088 C339.815,267.771,320.972,313.262,281.292,329.698z',
							})
						),
					},
					event: createSettingsPage,
				},
				alternativeSearch: {
					displayName: envTextData.alternativeSearch.featureName,
					pcOnly: true,
					url: '#',
					iconType: 'svg',
					iconData: {
						svgElementProps: h('svg', {viewBox: '0 0 16 16', fill: 'currentColor'},
							h('path', {
									d: 'M8.25739 9.1716C7.46696 9.69512 6.51908 10 5.5 10C2.73858 10 0.5 7.76142 0.5 5C0.5 2.23858 2.73858 0 5.5 0C8.26142 0 10.5 2.23858 10.5 5C10.5 6.01908 10.1951 6.96696 9.67161 7.75739L11.7071 9.79288C12.0976 10.1834 12.0976 10.8166 11.7071 11.2071C11.3166 11.5976 10.6834 11.5976 10.2929 11.2071L8.25739 9.1716ZM8.5 5C8.5 6.65685 7.15685 8 5.5 8C3.84315 8 2.5 6.65685 2.5 5C2.5 3.34315 3.84315 2 5.5 2C7.15685 2 8.5 3.34315 8.5 5Z',
									'fill-rule': 'evenodd', 'clip-rule': 'evenodd', transform: 'translate(3 3)'
								}
							)
						),
					},
					event: ()=>{
						sessionData.alternativeSearch.display();
					}
				}
			};
			let gridNum = isMobile ? 4 : 8;
			const menuMainContainer = h('div', {
					className: 'MPLU-menuMainContainer',
					style: {
						display: 'grid',
						height: '100%',
						width: '100%',
						boxSizing: 'border-box',
						gridTemplateColumns: `repeat(${gridNum}, 1fr)`,
						gridAutoRows: 'min-content',
						gap: '4px',
						overflowY: 'auto',
						overflowX: 'hidden',
						padding: '2px',
						alignContent: 'start',
					}
				}
			);
			const menuContainer = h('div', {
					className: 'MPLU-menuContainer MPLU-container',
					style: {
						display: 'flex',
						position: 'fixed',
						width: isMobile ? '90%' : '85%',
						height: isMobile ? '90%' : '85%',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						backgroundColor: 'var(--MPLU-menu-container-background-color)',
						color: 'var(--MPLU-menu-container-font-color)',
						borderRadius: '12px',
						border: '1px solid var(--MPLU-menu-container-border-color)',
						zIndex: '14536',
						overflowY: 'auto',
						overflowX: 'hidden',
						flexDirection: 'column',
						padding: '8px',
						boxSizing: 'border-box',
					}
				},
				h('div', {
						className: 'MPLU-menuContainer-header-container',
						style: {
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
							height: '32px',
							width: '100%',
							boxSizing: 'border-box',
						},
					},
					h('button', {
							className: 'MPLU-menuContainer-edit-button',
							style: {
								display: 'flex',
								width: '32px',
								height: '32px',
								border: 'none',
								backgroundColor: 'transparent',
								cursor: 'pointer',
								padding: '0',
								marginRight: '20px',
								justifyContent: 'center',
								alignItems: 'center',
							},
						},
						h('svg', {
								viewBox: '0 0 512 512',
								color: 'rgb(0, 186, 124)',
								fill: 'currentColor',
								style: {
									width: '24px',
									height: '24px',
								}
							},
							h('path', {
								d: 'M504.918,99.144c-1.75-8.797-4.188-13.266-4.188-13.266c-0.75-2.375-2.781-4.125-5.234-4.516 c-2.469-0.391-4.938,0.641-6.391,2.672l-6.531,9.141l-36.891,51.813c-7.125,9.969-21.672,11.781-32.5,4.047l-62.125-44.453 c-10.813-7.734-13.813-22.094-6.672-32.063l37.781-53.063l6.203-8.656c1.438-2.016,1.625-4.688,0.484-6.875 c-1.156-2.203-3.438-3.563-5.922-3.531c0,0-5.859-1-15.234,0.188c-23.578,3.016-46.547,12.828-65.766,29.672 c-27.109,23.75-41.359,56.734-42.156,90.141c-0.25,10.078,8.859,53.828-14.938,77.625S19.996,422.847,19.996,422.847 c-20.391,20.406-20.391,53.469,0,73.859c20.406,20.391,53.469,20.391,73.859,0c0,0,205.969-205.968,224.844-224.843 s71.203-24.469,81.578-25.875c23.25-3.141,45.844-12.922,64.813-29.547C499.574,186.222,513.262,141.097,504.918,99.144z M40.012,476.706c-9.781-9.781-9.781-25.609,0-35.391c9.766-9.766,25.609-9.781,35.375,0c9.781,9.766,9.781,25.609,0,35.391 C65.621,486.472,49.777,486.472,40.012,476.706z'
							})
						)
					),
					h('button', {
							className: 'MPLU-menuContainer-close-button',
							style: {
								display: 'flex',
								width: '32px',
								height: '32px',
								border: 'none',
								backgroundColor: 'transparent',
								cursor: 'pointer',
								padding: '0',
								margin: '0',
								justifyContent: 'center',
								alignItems: 'center',
							},
							onclick: ()=>{
								menuWrapper.style.display = 'none';
								sessionData.menuButton.menuContainer.isDisplayed = false;
							}
						},
						h('svg', {
								viewBox: '0 0 512 512',
								style: {
									width: '24px',
									height: '24px',
									fill: 'rgb(223, 86, 86)',
								}
							},
							h('g', {},
								h('polygon',{
									points: '512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465 52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005'
								})
							)
						)
					),
				),
				h('div', {
						className: 'MPLU-menuContainer-content-container',
						style: {
							display: 'flex',
							height: 'calc(100% - 32px)',
							width: '100%',
							boxSizing: 'border-box',
							marginTop: '8px',
						}
					},
					menuMainContainer
				),
				h('div', {
						className: 'MPLU-menuContainer-footer-container',
						style: {
							display: 'none',
							justifyContent: 'center',
							alignItems: 'center',
							height: '32px',
							width: '100%',
							boxSizing: 'border-box',
						},
					},
					h('div', {
							className: 'MPLU-menuContainer-save-settings-button',
						}
					)
				),
			);
			const menuWrapper = h('div', {
					className: 'MPLU-menuWrapper MPLU-container',
					style: {
						position: 'fixed',
						top: '0',
						left: '0',
						width: '100%',
						height: '100%',
						zIndex: '14536',
					},
					onclick: (e)=>{
						if(e.target === menuWrapper){
							menuWrapper.style.display = 'none';
							sessionData.menuButton.menuContainer.isDisplayed = false;
						}
					},
				},
				menuContainer
			);
			sessionData.menuButton.menuContainer.element = menuWrapper;
			sessionData.menuButton.menuContainer.isDisplayed = true;
			document.body.appendChild(menuWrapper);
			sessionData.whenLocationChangeFunctions.menuButtonMenuHide = (()=> {
				if(sessionData.menuButton.menuContainer.isDisplayed){
					menuWrapper.style.display = 'none';
				}
			});

			for(const key in presetMenuItems){
				const itemData = presetMenuItems[key];
				if(itemData.pcOnly && isMobile)continue;
				createMenuItem(itemData);
			}

			function createMenuItem(itemData){
				const itemContainer = h('div', {
						className: 'MPLU-menuItem-container',
						style: {
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							width: '100%',
							boxSizing: 'border-box',
							cursor: 'pointer',
							borderRadius: '8px',
							aspectRatio: '1 / 1',
							userSelect: 'none',
						}
					},
					h('a', {
							className: 'MPLU-menuItem-link',
							style: {
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								width: '100%',
								height: '100%',
								boxSizing: 'border-box',
								textDecoration: 'none',
								color: 'inherit',
							},
							href: itemData.url ?? '#',
							target: '_blank',
							rel: 'noopener noreferrer nofollow',
							onclick: (e)=>{
								e.preventDefault();
								e.stopPropagation();
								menuWrapper.style.display = 'none';
								if(itemData.event && typeof itemData.event === 'function'){
									itemData.event();
								}else{
									navigateTo(itemData.url);
								}
							}
						},
						h('div', {
								className: 'MPLU-menuItem-icon-container',
								style: {
									display: 'flex',
									width: '53%',
									height: '53%',
									marginBottom: '8px',
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: 'var(--MPLU-menu-container-hover-background-color)',
									boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
								}
							},
							(()=>{
								let iconElementStyle = {
									width: '62.5%',
									height: '62.5%',
									objectFit: 'contain',
								}
								if(itemData.iconType === 'svg' && itemData.iconData){
									return h('div', {
											className: 'MPLU-menuItem-icon-svg',
											style: {
												color: '#858585',
												...iconElementStyle,
											},
										},
										itemData.iconData.svgElementProps,
									);
								}else if(itemData.iconType === 'img' && itemData.iconData){
									return h('div', {
											className: 'MPLU-menuItem-icon-img',
											style: {
												...iconElementStyle,
												backgroundImage: `url(${itemData.iconData.url})`,
												backgroundSize: 'contain',
												backgroundRepeat: 'no-repeat',
												backgroundPosition: 'center',
											}
										}
									);
								}else{
									return h('div', {
											className: 'MPLU-menuItem-icon-placeholder',
											style: {
												...iconElementStyle,
												backgroundColor: 'rgba(0,0,0,0.1)',
											}
										}
									);
								}
							})()
						),
						h('div', {
								className: 'MPLU-menuItem-label',
								style: {
									fontSize: '14px',
									textAlign: 'center',
									wordBreak: 'break-word',
								},
								textContent: itemData.displayName ?? '',
							},
						)
					),
				);
				menuMainContainer.appendChild(itemContainer);
				return itemContainer;
			}
		}

		let offsetX, offsetY, isDragging = false, startX, startY;
		menuButton.addEventListener("mousedown", startDrag);
		menuButton.addEventListener("touchstart", startDrag);

		function startDrag(e){
			isDragging = true;
			e.preventDefault();
			const touch = e.type === "touchstart" ? e.touches[0] : e;
			startX = touch.clientX;
			startY = touch.clientY;
			offsetX = touch.clientX - menuButton.getBoundingClientRect().left;
			offsetY = touch.clientY - menuButton.getBoundingClientRect().top;

			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", stopDrag);
			document.addEventListener("touchmove", onTouchMove);
			document.addEventListener("touchend", stopDrag);
		}

		function onMouseMove(e){
			if(isDragging){
				e.preventDefault();
				moveButton(e.clientX, e.clientY);
			}
		}

		function onTouchMove(e){
			if(isDragging && e.touches.length > 0){
				e.preventDefault();
				const touch = e.touches[0];
				moveButton(touch.clientX, touch.clientY);
			}
		}

		function moveButton(clientX, clientY){
			let x = clientX - offsetX;
			let y = clientY - offsetY;

			x = Math.max(0, Math.min(x, window.innerWidth - menuButton.offsetWidth));
			y = Math.max(0, Math.min(y, window.innerHeight - menuButton.offsetHeight));

			menuButton.style.left = `${x}px`;
			menuButton.style.top = `${y}px`;
		}

		function stopDrag(e){
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", stopDrag);
			document.removeEventListener("touchmove", onTouchMove);
			document.removeEventListener("touchend", stopDrag);
			const endX = e.type === "touchend" ? e.changedTouches[0].clientX : e.clientX;
			const endY = e.type === "touchend" ? e.changedTouches[0].clientY : e.clientY;
			const distance = Math.sqrt((endX - startX) ** 2 + (endY - startY) ** 2);
			if(distance < 5){
				openMenu();
			}
			setTimeout(() => {
				isDragging = false;
			}, 50);
		}
	}

	async function webhookBringsArtworkToDiscord({refresh, illustId, novelId} = {}){
		if(!illustId && !novelId)return ("Not on an artwork page.");
		const textData = envTextData.webhookBringsArtworkToDiscord;
		const featureSettings = scriptSettings?.webhookBringsArtworkToDiscord ?? scriptSettings?.PtoD ?? {};
		const MAX_SEND_DATA_SIZE_SUM = 10 * 1024 * 1024; // 10MB
		await sleep(200);
		const existingButton = document.querySelectorAll(`div.discordWebhookTriggerButton`);
		if(existingButton.length && !refresh)return ("Button already exists.");
		if(refresh)existingButton.forEach(e=>{{e.remove()}});
		const featureCss = ()=>{return `
			.MPLU-imageItem.MPLU-loading .MPLU-loadingSpinner {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				width: 24px;
				height: 24px;
				border: 4px solid rgba(255, 255, 255, 0.3);
				border-top: 4px solid #fff;
				border-radius: 50%;
				animation: MPLU-spin 1s linear infinite;
			}
			@keyframes MPLU-spin {
				0% { transform: translate(-50%, -50%) rotate(0deg); }
				100% { transform: translate(-50%, -50%) rotate(360deg); }
			}

			.webhookBringsArtworkToDiscord .MPLU-footerContainer {
				background-color: ${sessionData.themeMode.themeNum === 1 ? 'rgb(49, 51, 56)' : 'rgb(239, 243, 244)'};
			}
			.webhookBringsArtworkToDiscord .MPLU-image-label-background {
				background-color: ${sessionData.themeMode.themeNum === 1 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'};
			}
`.replace(/^	{3}/mg,'');
		};
		const discordLogoSvgPath = "M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z";
		const interactionsPanel = isMobile ? await waitElementAndGet({query: 'div .illust-details-view .segment-bottom .work-interactions', searchFunction: "querySelector"}) : await waitElementAndGet({query: "//section[div/button]", searchFunction: "XPath"});
		let fetchedImagesData = {};
		let fetchedNovelsData = {};
		let isProcessing = false;
		createTriggerButton("#5865f2");
		return 'done.';

		function createTriggerButton(color){
			if(!interactionsPanel)return;
			//if(existingButton)existingButton.forEach(button => button.remove());
			const triggerButton = h('div', {
					className: 'MPLU-container webhookBringsArtworkToDiscord discordWebhookTriggerButton',
					dataset: {
						worksType: illustId ? 'illust' : 'novel',
					},
				},
				h('button', {
						className: 'MPLU-discordWebhookTriggerButton',
						style: {
							display: 'block',
							height: '32px',
							width: 'fit-content',
							color: color,
							cursor: 'pointer',
							background: 'none',
							boxSizing: 'content-box',
							lineHeight: '1',
							margin: '0 0 0 10px',
							border: 'none',
							outline: 'none',
							padding: '0',
						},
						onclick: async (e) => {
							const category = currentUrl.match(/artworks\/(\d+)/)?.[1] ? 'illust' : 'novel';
							if(isProcessing)return;
							appendStyle("webhookBringsArtworkToDiscord", featureCss(), true);
							const button = e.currentTarget;
							isProcessing = true;
							if(category === 'illust'){
								triggerButtonClicked();
							}else{
								triggerButtonClickedNovel();
							}
						}
					},
					h('svg', {
							viewBox: "0 0 127.14 96.36",
							style: {
								height: '32px',
								width: 'fit-content',
							}
						},
						h('path', {
								d: discordLogoSvgPath,
								style: {
									fill: color,
								}
							}
						)
					),
				)
			);
			if(isMobile){
				interactionsPanel.appendChild(triggerButton);
			}else{
				interactionsPanel.insertBefore(triggerButton, interactionsPanel.firstChild);
			}
		}
		async function triggerButtonClickedNovel(){
			const novelId = currentUrl.match(/novel\/show.php\?id=(\d+)/)?.[1];
			debug({function: 'webhookBringsArtworkToDiscord', action: 'triggerButtonClickedNovel', novelId, refresh});
			const novelDataPromise = pixivApi.getNovelDetail({novelId});
			const authorDataPromise = (async ()=>{
				const novelData = await novelDataPromise;
				return pixivApi.getUser({userId: novelData.userId});
			})();
			measurePromise(novelDataPromise, "getNovelDetail");
			measurePromise(authorDataPromise, "getUser");
			displayOptions();
			debug({novelData: await novelDataPromise, authorData: await authorDataPromise});
			function displayOptions(){
				const webhookSelect = h('select', {
						id: 'MPLU-selectNovelWebhookSelect',
						style: {
							width: '100%',
							boxSizing: 'border-box',
						},
						onchange: (e)=>{
							sendButton.disabled = false;
						}
					},
					(() => {
						const webhooks = featureSettings?.data?.length ? featureSettings.data : [];
						return webhooks.map((webhook, index) => {
							const option = h('option', {
								value: index,
								textContent: webhook.name,
							});
							if(featureSettings.defaultWebhook == webhook.id){
								option.selected = true;
							}
							return option;
						});
					})()
				);
				const fileTypeSelect = h('select', {
						id: 'MPLU-selectNovelFileTypeSelect',
						style: {
							width: '100%',
							boxSizing: 'border-box',
						},
						onchange: (e)=>{
							sendButton.disabled = false;
						}
					},
					(() => {
						const options = ['text', 'pdf'];
						return options.map((optionValue, index) => {
							const option = h('option', {
								value: optionValue,
								textContent: optionValue,
							});
							if(featureSettings.defaultNovelFileType == optionValue){
								option.selected = true;
							}
							return option;
						});
					})()
				);
				const captionOnOffDropdown = h('select', {
						className: 'MPLU-captionOnOffDropdown',
						style: {},
						onChange: (e) => {
							submitButton.disabled = false;
						}
					},
					(() => {
						const options = [
							{ value: 0, text: 'Yes' },
							{ value: 1, text: 'No' }
						];
						return options.map(optionData => {
							const option = h('option', {
								value: optionData.value,
								textContent: optionData.text,
							});
							if(featureSettings?.captionOnOff == optionData.text)option.selected = true;
							return option;
						});
					})()
				);
				const sendButton = h('button', {
						className: 'MPLU-selectNovelSendButton',
						style: {
							border: '1px solid var(--MPLU-menu-container-border-color)',
							padding: '8px',
						},
						disabled: false,
						textContent: textData.submit,
						onclick: ()=>{
							sendButton.disabled = true;
							sendNovel();
						}
					},
				);
				const overlay = h('div', {
						className: 'MPLU-container webhookBringsArtworkToDiscord MPLU-selectNovelOverlay',
						style: {
							display: 'flex',
							position: 'fixed',
							top: '0',
							left: '0',
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(0, 0, 0, 0)',
							zIndex: '14536',
							justifyContent: 'center',
							alignItems: 'center',
						},
						onclick: (e)=>{
							if(e.target === overlay){
								overlay.remove();
								isProcessing = false;
							}
						}
					},
					h('div', {
							className: 'MPLU-selectNovelMainContainer',
							style: {
								display: 'flex',
								flexDirection: 'column',
								width: isMobile ? '90%' : '400px',
								height: 'auto',
								maxHeight: '70%',
								backgroundColor: 'var(--MPLU-menu-container-background-color)',
								border: '1px solid var(--MPLU-menu-container-border-color)',
								borderRadius: '12px',
								overflowY: 'auto',
								boxSizing: 'border-box',
							},
							onclick: (e)=>{
								e.stopPropagation();
							}
						},
						h('div', {
								className: 'MPLU-selectNovelHeaderContainer',

							}
						),
						h('div', {
								className: 'MPLU-selectNovelSelectWebhookContainer',
								style: {
									display: 'flex',
									flexDirection: 'column',
									padding: '16px',
									boxSizing: 'border-box',
								}
							},
							h('label', {
									for: 'MPLU-selectNovelWebhookSelect',
									style: {
										marginBottom: '8px',
									},
									textContent: textData.labelWebhook,
								}
							),
							webhookSelect
						),
						h('div', {
								className: 'MPLU-selectNovelCaptionContainer',
								style: {
									display: 'flex',
									flexDirection: 'column',
									padding: '16px',
									boxSizing: 'border-box',
								}
							},
							h('label', {
									for: 'MPLU-selectNovelCaptionSelect',
									style: {
										marginBottom: '8px',
									},
									textContent: textData.labelCaption,
								}
							),
							captionOnOffDropdown
						),
						h('div', {
								className: 'MPLU-selectNovelFileTypeContainer',
								style: {
									display: 'flex',
									flexDirection: 'column',
									padding: '16px',
									boxSizing: 'border-box',
								}
							},
							h('label', {
									for: 'MPLU-selectNovelFileTypeSelect',
									style: {
										marginBottom: '8px',
									},
									textContent: textData.labelNovelFileType,
								}
							),
							fileTypeSelect
						),
						h('div', {
								className: 'MPLU-selectNovelFooterContainer',
								style: {
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									padding: '8px',
									marginTop: 'auto',
									boxSizing: 'border-box',
								}
							},
							sendButton
						)
					)
				);
				document.body.appendChild(overlay);
				async function sendNovel(){
					const novelData = await novelDataPromise;
					const authorData = await authorDataPromise;
					const selectedFileType = document.getElementById('MPLU-selectNovelFileTypeSelect').value;
					const webhookUrl = `https://discord.com/api/webhooks/${atob(featureSettings.data[webhookSelect.value].value)}`;
					const caption = document.querySelector('.MPLU-captionOnOffDropdown').value == '0' ? true : false;
					const textEmbeddedImages = novelData.textEmbeddedImages;
					let tags = getValueFromObjectByPath(novelData.tags.tags, 'tag', null);
					tags = tags ? `#${tags.join(' #')}` : textData.noTags;
					debug({function: 'webhookBringsArtworkToDiscord', action: 'sendNovel', webhookUrl, selectedFileType});
					const imageFiles = await fetchImages();
					const mainEmbed = new DiscordEmbedBuilder()
						.setTitle('Pixiv')
						.setColor('#0096FA')
						.setURL(`https://www.pixiv.net/novel/show.php?id=${novelData.id}`)
						.setAuthor({
							name: authorData.name,
							icon_url: `attachment://${imageFiles.authorIcon.name}`,
							url: `https://www.pixiv.net/users/${authorData.userId}`
						})
						.setDescription(novelData.title)
						.setThumbnail('https://s.pximg.net/common/images/apple-touch-icon.png')
						.setFields([
							(novelData.description !== '' && caption === true ?
								{name: "Caption", value: decodeHtml(novelData.extraData?.meta?.twitter?.description || novelData.description)} : null
							),
							{name: "tags", value: `${novelData.aiType === 2 ? "AI生成 " : ""}${tags}`},
							{name: textData.uploadDate, value: new Date(novelData.createDate).toLocaleString(timeZoneObject.locale, { timeZone: timeZoneObject.timeZone })},
							(authorData.social?.twitter?.url ? {name: "twitter:link:", value: authorData.social.twitter.url} : null)
						].filter(Boolean))
						.setImage(`attachment://${imageFiles.coverImage.name}`)
						.toJSON();
					const formData = new FormData();
					formData.append('payload_json', JSON.stringify({
						embeds: [mainEmbed,],
					}));
					formData.append(imageFiles.coverImage.name, imageFiles.coverImage.data, imageFiles.coverImage.name);
					formData.append(imageFiles.authorIcon.name, imageFiles.authorIcon.data, imageFiles.authorIcon.name);
					let appendFileData = null;
					if(selectedFileType === 'pdf'){
						let pdfData = null;
						if(fetchedNovelsData?.[novelId]?.pdf){
							pdfData = fetchedNovelsData[novelId].pdf;
						}else{
							const pdfBlob = await createPdfFromNovel(novelData, imageFiles.coverImage.data, textEmbeddedImages);
							const pdfName = `${(novelData.title || 'novel').replace(/[\\\/:*?"<>|]/g,'')}.pdf`;
							fetchedNovelsData[novelId] = fetchedNovelsData[novelId] || {};
							fetchedNovelsData[novelId].pdf = {name: pdfName, data: pdfBlob};
						}
						appendFileData = new FormData();
						appendFileData.append('file', pdfData.data, pdfData.name);
					}else if(selectedFileType === 'text'){
						let textData = null;
						if(fetchedNovelsData?.[novelId]?.text){
							textData = fetchedNovelsData[novelId].text;
						}else{
							const textContent = decodeHtml(novelData.content || '');
							const textBlob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
							fetchedNovelsData[novelId] = fetchedNovelsData[novelId] || {};
							fetchedNovelsData[novelId].text = {name: `${(novelData.title || 'novel').replace(/[\\\/:*?"<>|]/g,'')}.txt`, data: textBlob};
							textData = fetchedNovelsData[novelId].text;
						}
						const textName = `${(novelData.title || 'novel').replace(/[\\\/:*?"<>|]/g,'')}.txt`;
						appendFileData = new FormData();
						appendFileData.append('file', textData.data, textData.name);
					}
					const response = await request({
						url: webhookUrl,
						method: 'POST',
						body: formData,
						anonymous: true,
						dontUseGenericHeaders: true,
					});
					await request({
						url: webhookUrl,
						method: 'POST',
						body: appendFileData,
						anonymous: true,
						dontUseGenericHeaders: true,
					});
					debug({function: 'webhookBringsArtworkToDiscord', action: 'sendNovel', response});
					if(featureSettings.closeWindowAfterSend){
						document.querySelector('.MPLU-selectNovelOverlay')?.remove();
						isProcessing = false;
					}
					isProcessing = false;
					return {success: true};

					async function fetchImages(){
						const result = {};
						const promsie = [];
						const coverImageUrl = novelData.coverUrl;
						const authorIconUrl = authorData.imageBig;
						promsie.push((async ()=>{
							let name = coverImageUrl.split('/').pop().split('?')[0];
							let coverImageBlob = await request({url: coverImageUrl, responseType: 'blob'});
							if(coverImageBlob.size > 8 * 1024 * 1024){
								coverImageBlob = await convertImageFormat({src: coverImageBlob, format: 'image/jpeg', quality: 0.9});
								name = name.replace(/\.\w+$/, '.jpg');
							}
							result.coverImage = {
								name,
								data: coverImageBlob,
							};
						})());
						promsie.push((async ()=>{
							const name = authorIconUrl.split('/').pop().split('?')[0];
							const authorIconBlob = await request({url: authorIconUrl, responseType: 'blob'});
							result.authorIcon = {
								name,
								data: authorIconBlob,
							};
						})());
						await Promise.all(promsie);
						return result;
					}
					async function createPdfFromNovel(novelData, coverBlob, insertImages = {}){
						const jsPDFLib = window.jspdf?.jsPDF || window.jsPDF || window.jspdf;
						if(!jsPDFLib)throw new Error('jsPDF が見つかりません');

						// フォント読み込み
						const fontURL = await GM_getResourceURL('BIZUDGothic-Regular');
						const arrayBuffer = await (await fetch(fontURL)).arrayBuffer();
						const u8 = new Uint8Array(arrayBuffer);

						const pageWidth = 1080;
						const fontSize = 28;
						const margin = 20; 
						const lineHeight = fontSize * 1.15;
						const maxWidth = pageWidth - margin * 2;

						// --- 1. カバー画像ページ (1ページ目) ---
						let doc = null;
						let coverHeight = 800; // デフォルト
						const coverDataUrl = await blobToDataURL(coverBlob);
						const coverImg = await loadImage(coverDataUrl);

						// 横幅1080pxに合わせてアスペクト比を保持
						const ratio = pageWidth / coverImg.width;
						coverHeight = coverImg.height * ratio;

						// 表紙ページを作成
						doc = new jsPDFLib({
							unit: 'px',
							format: [pageWidth, coverHeight]
						});

						// フォント追加
						let binary = "";
						for (let i = 0; i < u8.length; i++) {
							binary += String.fromCharCode(u8[i]);
						}
						const base64Font = btoa(binary);
						doc.addFileToVFS("BIZUDGothic-Regular.ttf", base64Font);
						doc.addFont("BIZUDGothic-Regular.ttf", "BIZUDGothic", "normal");
						doc.setFont("BIZUDGothic");
						doc.setFontSize(fontSize);

						// カバー画像を描画
						doc.addImage(coverDataUrl, 'JPEG', 0, 0, pageWidth, coverHeight);

						// --- 2. 本文処理 (2ページ目以降) ---
						const rawText = decodeHtml(novelData.content || '');
						const rawLines = rawText.split('\n');

						// ページ構造を事前構築
						const pages = []; // [{lines: [...], images: [{imageKey, imageData}]}]
						let currentPage = {lines: [], images: []};

						for(const line of rawLines){
							if(line === '[newpage]'){
								// 現在のページを保存して新規作成
								if(currentPage.lines.length > 0 || currentPage.images.length > 0){
									pages.push(currentPage);
								}
								currentPage = {lines: [], images: []};
							}else{
								const uploadedImageMatch = line.match(/^\[uploadedimage:(\d+)\]$/);
								if(uploadedImageMatch){
									const imageKey = uploadedImageMatch[1];
									const imageData = insertImages[imageKey];
									if(imageData?.urls?.original){
										currentPage.images.push({imageKey, imageData});
									}
								}else{
									currentPage.lines.push(line);
								}
							}
						}

						// 最後のページを追加
						if(currentPage.lines.length > 0 || currentPage.images.length > 0){
							pages.push(currentPage);
						}

						// --- 3. 各ページを描画 ---
						for(let pageIdx = 0; pageIdx < pages.length; pageIdx++){
							const page = pages[pageIdx];

							// テキストの行数を計算
							const textLines = page.lines.flatMap(line => doc.splitTextToSize(line, maxWidth));
							const textHeight = textLines.length * lineHeight;

							// 画像の高さを計算 - 横幅に合わせて調整
							let imagesHeight = 0;
							const maxImageHeight = 1242;
							const maxImageWidth = 1080;

							for(const imgInfo of page.images){
								try{
									const imageData = await request({url: imgInfo.imageData.urls.original, responseType: 'blob'});

									// convertImageFormatで最適化
									const optimizedImage = await convertImageFormat({
										src: imageData,
										format: 'image/jpeg',
										quality: 0.9,
										maxWidth: maxImageWidth,
										maxHeight: maxImageHeight,
										returnDataType: 'canvas',
									});
									const ratio = Math.min(maxImageWidth / optimizedImage.width, maxImageHeight / optimizedImage.height);
									const h = optimizedImage.height * ratio;
									imagesHeight += h + 8;

									// 最適化された画像データを保存
									imgInfo.optimizedImage = optimizedImage;
									imgInfo.displayHeight = h;
									imgInfo.displayWidth = optimizedImage.width * ratio;
								}catch(err){
									console.warn(`Failed to load image ${imgInfo.imageKey}`, err);
								}
							}

							const pageHeight = margin + textHeight + imagesHeight + margin;

							// 新しいページを追加
							doc.addPage([pageWidth, pageHeight]);

							let cursorY = margin;

							// テキストを描画
							for(const line of textLines){
								doc.text(line, margin, cursorY);
								cursorY += lineHeight;
							}

							// 画像を描画
							for(const imgInfo of page.images){
								if(imgInfo.optimizedImage){
									const x = (pageWidth - imgInfo.displayWidth) / 2;
									doc.addImage(imgInfo.optimizedImage, 'JPEG', x, cursorY, imgInfo.displayWidth, imgInfo.displayHeight);
									cursorY += imgInfo.displayHeight + 8;
								}
							}
						}

						// --- PDF出力 ---
						const blob = doc.output('blob');
						if(!blob)throw new Error('PDF 生成に失敗しました');

						return blob;

						function loadImage(src){
							return new Promise((resolve, reject)=>{
								const img = new Image();
								img.onload = ()=>resolve(img);
								img.onerror = reject;
								img.src = src;
							});
						}
					}
				}
			}
		}
		async function triggerButtonClicked(){
			const illustId = currentUrl.match(/artworks\/(\d+)/)?.[1];
			const tmpImageUrl = document.querySelector(isMobile ? `div.work-main-image img.work-thumb[src*="p0_"]` : `div[role="presentation"]>a>img[src*="p0_"]`)?.src;
			debug({function: 'webhookBringsArtworkToDiscord', action: 'triggerButtonClicked', illustId, novelId, refresh});
			const illustDataPromise = pixivApi.getIllustDetail({illustId});
			const authorDataPromise = (async ()=>{
				const illustData = await illustDataPromise;
				return pixivApi.getUser({userId: illustData.userId});
			})();
			const imagesDataPromise = generateImagesData();
			measurePromise(illustDataPromise, "getIllustDetail");
			measurePromise(authorDataPromise, "getUser");
			measurePromise(imagesDataPromise, "generateImagesData");
			const pageNum = parseInt(document.querySelector(isMobile ? '.work-main-image .page-count' : '.gtm-manga-viewer-preview-modal-open>div>span')?.textContent.split('/')?.[1] || 1);
			if(!fetchedImagesData[illustId]){
				fetchedImagesData = {};
				fetchedImagesData[illustId] = {};
				for(let i = 0; i < pageNum; i++){
					fetchedImagesData[illustId][i] = null;
				}
			}
			selectImages();
			debug({illustData: await illustDataPromise, authorData: await authorDataPromise, imagesData: await imagesDataPromise, pageNum});
			async function generateImagesData(){
				if(fetchedImagesData?.[illustId])return fetchedImagesData[illustId];
				const illustData = await illustDataPromise;
				const concurrencyLimit = 6;
				const tasks = [];

				for(let i = 0; i < illustData.pageCount; i++){
					const originalUrl = illustData.urls.original.replace('_p0.', `_p${i}.`);
					const regularUrl = illustData.urls.regular.replace('_p0_', `_p${i}_`);

					tasks.push(async () => {
						const size = parseInt(await getFileSize(originalUrl), 10) || 0;
						return { originalUrl: originalUrl, regularUrl: regularUrl, size: size, index: i };
					});
				}

				const results = await parallelTask(tasks, concurrencyLimit);

				results.forEach((item)=>{
					fetchedImagesData[illustId][item.index] = {
						originalUrl: item.originalUrl,
						regularUrl: item.regularUrl,
						size: item.size,
						originalImageData: null,
						processedImageData: null
					};
				});
				return fetchedImagesData[illustId];
			}

			async function sendToDiscord({webhookUrl, caption, userTag, selectedData}){
				debug({function: 'webhookBringsArtworkToDiscord', action: 'sendToDiscord', webhookUrl, caption, userTag, selectedData});
				const illustData = await illustDataPromise;
				const authorData = await authorDataPromise;
				const imagesData = await imagesDataPromise;
				const notifySendToDiscord = progressNotify.execute({
					action: 'createJob',
					name: textData.notify.sendToDiscord,
					progress: 0,
					total: 2,
				});
				const notifyFetchFiles = progressNotify.execute({
					action: 'addSubJob',
					name: textData.notify.downloadImages,
					jobId: notifySendToDiscord.jobId,
					progress: 0,
					total: selectedData.flat().length + 1,
				});
				const notifyUploadEmbeds = progressNotify.execute({
					action: 'addSubJob',
					name: textData.notify.uploadingToDiscord,
					jobId: notifySendToDiscord.jobId,
					progress: 0,
					total: selectedData.length,
				});
				progressNotify.execute({action: 'start', jobId: notifySendToDiscord.jobId});
				try{
					const files = await fetchFiles(selectedData);
					debug({function: 'webhookBringsArtworkToDiscord', action: 'sendToDiscord', step: 'fetchedFiles', files});
					const sendData = (await makeSendData(files)).sort((a, b) => a.index - b.index);
					debug({function: 'webhookBringsArtworkToDiscord', action: 'sendToDiscord', step: 'madeSendData', sendData});
					for(let i = 0; i < sendData.length; i++){
						const formData = sendData[i];
						let res = await request({
							url: webhookUrl,
							method: 'POST',
							body: formData,
							anonymous: true,
							dontUseGenericHeaders: true,
						});
						debug({function: 'webhookBringsArtworkToDiscord', action: 'sendToDiscord', step: 'sendWebhook', index: i, res});
						progressNotify.execute({
							action: 'updateProgress',
							jobId: notifySendToDiscord?.jobId,
							subJobId: notifyUploadEmbeds?.subJobId,
							increment: 1
						});
					}
					progressNotify.execute({action: 'setStatus', jobId: notifySendToDiscord.jobId, status: 'success'});
					debug({imagesData, files, fetchedImagesData});
				}catch(error){
					console.error({function: 'webhookBringsArtworkToDiscord', action: 'sendToDiscord', error});
					progressNotify.execute({action: 'setStatus', jobId: notifySendToDiscord.jobId, status: 'error', errorMessage: error.message || String(error)});
				}
				async function makeSendData(files){
					const result = selectedData.map(async (pages, index) => {
						let fileSizeSum = 0;
						pages.forEach(page => {
							const imageInfo = files[page];
							fileSizeSum += imageInfo.data.size;
						});
						if(index === 0)fileSizeSum += imagesData.authorIcon.originalImageData.size;
						if(fileSizeSum > MAX_SEND_DATA_SIZE_SUM){
							const notifyProcessImages = progressNotify.execute({
								action: 'addSubJob',
								name: `${textData.notify.processImages} (page: ${index + 1})`,
								progress: 0,
								total: pages.length,
								jobId: notifySendToDiscord.jobId,
								place: 'before',
								insertTargetId: notifyUploadEmbeds.subJobId,
							});
							for(let i = 0; i < pages.length; i++){
								const page = pages[i];
								const imageInfo = imagesData[page];
								if(!imageInfo.processedImageData){
									const processedImageData = await convertImageFormat({src: imageInfo.originalImageData, format: 'image/jpeg', quality: 0.9});
									imageInfo.processedImageData = processedImageData;
								}
								files[page].data = imageInfo.processedImageData;
								files[page].name = files[page].name.replace(/\.\w+$/, '.jpg');
								progressNotify.execute({
									action: 'updateProgress',
									jobId: notifySendToDiscord?.jobId,
									subJobId: notifyProcessImages?.subJobId,
									increment: 1
								});
							}
						}
						let tags = getValueFromObjectByPath(illustData.tags.tags, 'tag', null);
						tags = tags ? `#${tags.join(' #')}` : textData.noTags;
						const mainEmbed = 
							index === 0 ? (
								new DiscordEmbedBuilder()
								.setTitle('Pixiv')
								.setColor('#0096FA')
								.setURL(`https://www.pixiv.net/artworks/${illustData.id}`)
								.setAuthor({
									name: authorData.name,
									icon_url: `attachment://${files.authorIcon.name}`,
									url: `https://www.pixiv.net/users/${authorData.userId}`
								})
								.setDescription(illustData.title)
								.setThumbnail('https://s.pximg.net/common/images/apple-touch-icon.png')
								.setFields([
									(illustData.description !== '' && caption === true ?
										{name: "Caption", value: decodeHtml(illustData.extraData?.meta?.twitter?.description || illustData.description)} : null
									),
									{name: "tags", value: `${illustData.aiType === 2 ? "AI生成 " : ""}${tags}`},
									(userTag ? {name: textData.userTag, value: userTag} : null),
									{name: textData.uploadDate, value: new Date(illustData.createDate).toLocaleString(timeZoneObject.locale, { timeZone: timeZoneObject.timeZone })},
									(authorData.social?.twitter?.url ? {name: "twitter:link:", value: authorData.social.twitter.url} : null)
								].filter(Boolean))
								.setImage(`attachment://${files[pages[0]].name}`)
								.toJSON()
							)
							:(
								new DiscordEmbedBuilder()
								.setURL(`https://www.pixiv.net/artworks/${illustData.id}`)
								.setImage(`attachment://${files[pages[0]].name}`)
								.setColor('#0096FA')
								.toJSON()
							);
						const imageEmbeds = pages.slice(1).map(page => {
							return new DiscordEmbedBuilder()
								.setURL(`https://www.pixiv.net/artworks/${illustData.id}`)
								.setImage(`attachment://${files[page].name}`)
								.toJSON();
						});
						const formData = new FormData();
						formData.append('payload_json', JSON.stringify({
							embeds: [mainEmbed, ...imageEmbeds],
						}));
						if(index === 0){
							formData.append('file0', files.authorIcon.data, files.authorIcon.name);
						}
						pages.forEach((page, fileIndex) => {
							formData.append(`file${index === 0 ? fileIndex + 1 : fileIndex}`, files[page].data, files[page].name);
						});
						return formData;
					});
					return Promise.all(result);
				}

				async function fetchFiles(selectedData){
					const results = {};
					const downloadTask = [];
					selectedData.flat().forEach(page => {
						downloadTask.push(async () => {
							const imageInfo = imagesData[page];
							if(!imageInfo.originalImageData){
								const imageBlob = await request({url: imageInfo.originalUrl, responseType: 'blob'});
								imageInfo.originalImageData = imageBlob;
							}
							progressNotify.execute({
								action: 'updateProgress',
								jobId: notifySendToDiscord?.jobId,
								subJobId: notifyFetchFiles?.subJobId,
								increment: 1
							});
							const fileName = `${new URL(imageInfo.originalUrl).pathname.split('/').pop().split('?')[0]}`;
							const result = {
								name: fileName,
								data: imageInfo.originalImageData
							};
							results[page] = result;
							return result;
						});
					});
					downloadTask.push(async () => {
						if(!imagesData.authorIcon?.originalImageData){
							const authorIconUrl = authorData.imageBig;
							const imageBlob = await request({url: authorIconUrl, responseType: 'blob'});
							imagesData.authorIcon = {
								originalImageData: imageBlob
							};
						}
						progressNotify.execute({
							action: 'updateProgress',
							jobId: notifySendToDiscord?.jobId,
							subJobId: notifyFetchFiles?.subJobId,
							increment: 1
						});
						const result = {
							name: `authorIcon_${authorData.userId}.${new URL(authorData.imageBig).pathname.split('.').pop()}`,
							data: imagesData.authorIcon.originalImageData
						};
						results.authorIcon = result;
						return result;
					});
					await parallelTask(downloadTask);
					return results;
				}
			}

			async function selectImages(){
				const documentRoot = await waitElementAndGet({query: "body", searchFunction: "querySelector"});
				const selectImagesOverlayFragment = document.createDocumentFragment();

				class ImageSelectionManager {
					constructor(pageNum){
						this.selections = new Map();
						this.boxes = [];
						this.pageNum = pageNum;
					}

					select(page, imageItem, addToBoxCallback){
						if(this.selections.has(page))return;

						const clonedItem = imageItem.cloneNode(true);
						const {box, slot} = addToBoxCallback(clonedItem);

						this.selections.set(page, {
							isSelected: true,
							imageItem,
							clonedItem,
							box,
							slot
						});

						imageItem.dataset.isSelected = 'true';
						imageItem.style.border = '2px solid rgba(255, 88, 88, 1)';
						imageItem.style.padding = '0px';
						footerContainer.submitButton.disabled = false;
						return {box, slot};
					}

					unselect(page){
						const data = this.selections.get(page);
						if(!data)return;

						data.slot.dataset.isEmpty = 'true';
						data.clonedItem.remove();

						const imageSize = parseInt(data.imageItem.dataset.imageSize);
						data.box.dataset.imagesNum = parseInt(data.box.dataset.imagesNum) - 1;
						data.box.dataset.imagesSizeSum = parseInt(data.box.dataset.imagesSizeSum) - imageSize;
						const sizeSumElement = data.box.querySelector('.MPLU-selectedImagesBoxSizeSum');
						sizeSumElement.textContent = `${(parseInt(data.box.dataset.imagesSizeSum) / (1024 * 1024)).toFixed(2)} MB / 10 MB`;

						data.imageItem.dataset.isSelected = 'false';
						data.imageItem.style.border = '1px solid rgba(30, 30, 30, 1)';
						data.imageItem.style.padding = '1px';

						this.selections.delete(page);
						footerContainer.submitButton.disabled = false;
					}

					selectAll(imageItems, addToBoxCallback){
						imageItems.forEach((item, index) => {
							if(!this.selections.has(index)){
								this.select(index, item, addToBoxCallback);
							}
						});
						footerContainer.submitButton.disabled = false;
					}

					unselectAll(){
						const pages = Array.from(this.selections.keys());
						pages.forEach(page => this.unselect(page));
						this.boxes = [];
					}

					isSelected(page){
						return this.selections.has(page);
					}

					getSelectedPages(){
						return Array.from(this.selections.keys());
					}

					getSelectionData(page){
						return this.selections.get(page);
					}

					getSendImagesData(){
						const result = [];
						this.boxes.forEach(box => {
							const items = box.querySelectorAll('.MPLU-selectedImageItem');
							const res = [];
							items.forEach((item) =>{
								const imageItem = item.querySelector('.MPLU-imageItem');
								if(!imageItem)return;
								const page = parseInt(imageItem.dataset.page);
								res.push(page);
							});
							result.push(res);
						});
						return result;
					}

					registerBox(box){
						this.boxes.push(box);
					}

					unregisterBox(box){
						const index = this.boxes.indexOf(box);
						if(index > -1){
							this.selections.forEach((data, page) => {
								if(data.box === box){
									this.unselect(page);
								}
							});
							this.boxes.splice(index, 1);
						}
					}
				}

				const selectionManager = new ImageSelectionManager(pageNum);

				const closeButton = h('button', {
						className: 'MPLU-closeButton webhookBringsArtworkToDiscord',
						style: {
							position: 'absolute',
							top: '5px',
							right: '5px',
							width: '2vw',
							height: '2vw',
							minWidth: '24px',
							minHeight: '24px',
							borderRadius: '50%',
							border: 'none',
							backgroundColor: 'rgba(184, 19, 19, 1)',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '0'
						},
						onclick: (e) => {
							imagesListContainer.stopObserving();
							selectImagesOverlay.remove();
							isProcessing = false;
						}
					},
					h('svg', {
							viewBox: "0 0 512 512",
							style: {
								width: '70%',
								height: '70%',
								opacity: '1.0',
								fill: 'rgba(247, 249, 249, 1)',
							},
						},
						h('g',{},
							h('polygon', {
								points: "512,52.535 459.467,0.002 256.002,203.462 52.538,0.002 0,52.535 203.47,256.005 0,459.465 52.533,511.998 256.002,308.527 459.467,511.998 512,459.475 308.536,256.005"
							})
						)
					)
				);

				const footerContainer = (()=>{
					const userTagInput = h('input', {
						type: 'text',
						className: 'MPLU-userTagInput',
						style: {
								width: isMobile ? '6em' : 'auto',
							},
							onchange: (e) => {
								submitButton.disabled = false;
							},
						}
					);
					const appendUserTagContainer = h('div', {
							className: 'MPLU-appendUserTagContainer',
							style: {
								width: 'fit-content',
								height: 'fit-content',
								marginRight: isMobile ? '0 0 0 10px' : '0 0 0 30px',
							}
						},
						h('label', {
								textContent: textData.labelUserTag,
								style: {
									margin: '0 10px 0 0',
									userSelect: 'none',
								}
							}
						),
						userTagInput
					);
					const captionOnOffDropdown = h('select', {
							className: 'MPLU-captionOnOffDropdown',
							style: {},
							onChange: (e) => {
								submitButton.disabled = false;
							}
						},
						(() => {
							const options = [
								{ value: 0, text: 'Yes' },
								{ value: 1, text: 'No' }
							];
							return options.map(optionData => {
								const option = h('option', {
									value: optionData.value,
									textContent: optionData.text,
								});
								if(featureSettings?.captionOnOff == optionData.text)option.selected = true;
								return option;
							});
						})()
					);
					const captionOnOffDropdownContainer = h('div', {
							className: 'MPLU-captionOnOffDropdownContainer',
							style: {
								width: 'fit-content',
								height: 'fit-content',
								marginLeft: isMobile ? '10px' : '30px',
							},
						},
						h('label', {
								textContent: textData.labelCaption,
								style: {
									margin: '0 10px 0 0',
									userSelect: 'none',
								}
							}
						),
						captionOnOffDropdown,
					);
					const selectWebhookDropDown = h('select', {
							className: 'MPLU-selectWebhookDropDown',
							onChange: (e) => {
								submitButton.disabled = false;
							},
						},
						(() => {
							const webhooks = featureSettings?.data?.length ? featureSettings.data : [];
							return webhooks.map((webhook, index) => {
								const option = h('option', {
									value: index,
									textContent: webhook.name,
								});
								if(featureSettings.defaultWebhook == webhook.id){
									option.selected = true;
								}
								return option;
							});
						})(),
					);
					const selectWebhookContainer = h('div', {
							className: 'MPLU-selectWebhookContainer',
							style: {
								width: 'fit-content',
								height: 'fit-content',
								marginLeft: isMobile ? '10px' : '30px',
							},
						},
						h('label', {
								textContent: textData.labelWebhook,
								style: {
									margin: '0 10px 0 0',
									userSelect: 'none',
								},
							}
						),
						selectWebhookDropDown,
					);
					const submitButton = h('button', {
							className: 'MPLU-discordSubmitButton MPLU-button',
							textContent: textData.submit,
							style: {
								margin: isMobile ? '0 5px 0 10px' : '0 40px 0 30px',
								height: isMobile ? '99%' : 'auto',
								width: isMobile ? '5em' : 'auto',
								borderRadius: '4px',
								userSelect: 'none',
							},
							onclick: async (e) => {
								e.currentTarget.disabled = true;
								const selectedPages = selectionManager.getSendImagesData();
								if(selectedPages.length !== 0){
									sendToDiscord({
										webhookUrl: `https://discord.com/api/webhooks/${atob(featureSettings.data[selectWebhookDropDown.value].value)}`,
										caption: captionOnOffDropdown.value == '0' ? true : false,
										userTag: userTagInput.value,
										selectedData: selectedPages,
									});
									if(featureSettings.closeWindowAfterSend){
										selectImagesOverlay.remove();
										isProcessing = false;
									}
								}else{
									e.currentTarget.disabled = false;
								}
							}
						}
					);
					const node = h('div', {
						className: 'MPLU-footerContainer',
							style: {
								display: 'flex',
								width: '95%',
								height: '5%',
								alignItems: 'center',
								justifyContent: 'flex-end',
								...(isMobile ? {fontSize: '0.75em'} : {})
							}
						},
						appendUserTagContainer,
						captionOnOffDropdownContainer,
						selectWebhookContainer,
						submitButton,
					);
					return {
						node,
						submitButton,
					}
				})();

				const selectedImagesContainer = (()=>{
					const selectedImagesControllContainer = h('div', {
							className: 'MPLU-selectedImagesControllContainer',
							style: {
								display: 'flex',
								width: '100%',
								height: '1.5em',
								marginLeft: 'auto',
								justifyContent: 'flex-end',
								flexShrink: '0',
							},
						},
						h('button', {
								textContent: textData.removeAll,
								className: 'MPLU-removeAllSelectedImagesButton',
								style: {
									height: '100%',
									width: 'fit-content',
									border: '1px solid rgba(30, 30, 30, 1)',
									backgroundColor: 'rgba(151, 40, 144, 1)',
								},
								onclick: (e) => {
									selectionManager.unselectAll();
									const boxes = sendImagesArea.querySelectorAll('.MPLU-selectedImageBox');
									boxes.forEach(box => box.remove());
									createNewBox();
								}
							},
						),
					);
					const sendImagesArea = h('div', {
							className: 'MPLU-sendImagesArea',
							style: {
								display: 'flex',
								backgroundColor: 'rgba(88, 101, 242, 1)',
								flexDirection: 'column',
								width: '100%',
								height: '100%',
								flexGrow: '1',
								overflowY: 'auto',
								overflowX: 'hidden',
								padding: '2px',
								paddingBottom: '5%',
								boxSizing: 'border-box',
								gap: '4px',
							}
						}
					);
					createNewBox();
					const node = h('div', {
							className: 'MPLU-selectedImagesContainer',
							style: {
								display: isMobile ? 'none' : 'flex',
								width: isMobile ? '100%' : '27%',
								height: '98%',
								marginLeft: isMobile ? '0' : '3%',
								flexDirection: 'column',
								zIndex: isMobile? '2': '0',
							}
						},
						selectedImagesControllContainer,
						sendImagesArea,
					);
					if(isMobile){
						if(pageNum === 1){
							node.style.display = 'flex';
							node.style.zIndex = '2';
						}
					}
					return {
						node,
						updateImagesData,
						addImageToBox,
					};

					function addImageToBox(imageElement){
						const targetBoxes = sendImagesArea.querySelectorAll('.MPLU-selectedImageBox');
						let targetBox = targetBoxes[targetBoxes.length - 1];
						if(parseInt(targetBox.dataset.imagesNum) >= 4){
							targetBox = createNewBox();
						}
						const targetItem = targetBox.querySelector('.MPLU-selectedImageItem[data-is-empty="true"]');
						targetItem.dataset.isEmpty = 'false';
						const removeButton = h('button', {
								className: 'MPLU-selectedImagesItemRemoveButton',
								textContent: '🗑️',
								style: {
									position: 'absolute',
									top: '5px',
									right: '5px',
									backgroundColor: 'rgba(74, 48, 48, 1)',
									border: '1px solid rgba(30, 30, 30, 1)',
								},
								onclick: (e) => {
									const page = parseInt(imageElement.dataset.page);
									selectionManager.unselect(page);
								},
							}
						);
						imageElement.appendChild(removeButton);
						targetItem.appendChild(imageElement);
						targetBox.dataset.imagesNum = parseInt(targetBox.dataset.imagesNum) + 1;
						const currentSizeSum = parseInt(targetBox.dataset.imagesSizeSum);
						const imageSize = parseInt(imageElement.dataset.imageSize);
						targetBox.dataset.imagesSizeSum = currentSizeSum + imageSize;
						const sizeSumElement = targetBox.querySelector('.MPLU-selectedImagesBoxSizeSum');
						sizeSumElement.textContent = `${((currentSizeSum + imageSize) / (1024 * 1024)).toFixed(2)} MB / 10 MB`;

						return {box: targetBox, slot: targetItem};
					}
					async function updateImagesData(){
						const imageData = await imagesDataPromise;
						const boxes = sendImagesArea.querySelectorAll('.MPLU-selectedImageBox');
						boxes.forEach(box => {
							const items = box.querySelectorAll('.MPLU-selectedImageItem');
							let sizeSum = 0;
							items.forEach((item) =>{
								const imageItem = item.querySelector('.MPLU-imageItem');
								if(!imageItem)return;
								const imageIndex = parseInt(imageItem.dataset.page);
								const imageInfo = imageData[imageIndex];
								imageItem.dataset.imageSize = imageInfo.size;
								imageItem.dataset.isTemporary = 'false';
								imageItem.querySelector('.MPLU-imageSizeLabel').textContent = `${imageInfo.size ? (imageInfo.size / 1024 / 1024).toFixed(2) : 0} MB`;
								imageItem.querySelector('.MPLU-loadingSpinner')?.remove();
								sizeSum += imageInfo.size;
								box.dataset.imagesSizeSum = sizeSum;
							});
							const sizeSumElement = box.querySelector('.MPLU-selectedImagesBoxSizeSum');
							sizeSumElement.textContent = `${(sizeSum / (1024 * 1024)).toFixed(2)} MB / 10 MB`;
						});
					}
					function createNewBox(){
						const box = h('div', {
								className: 'MPLU-selectedImageBox',
								dataset: {
									imagesSizeSum: 0,
									imagesNum: 0,
								},
								style: {
									display: 'flex',
									width: '100%',
									height: 'auto',
									minHeight: '47%',
									padding: '2px',
									alignContent: 'start',
									boxSizing: 'border-box',
									flexDirection: 'column',
									flexShrink: '0',
								},
							},
							h('div', {
									className: 'MPLU-selectedImagesBoxDisplayArea',
									style: {
										display: 'grid',
										gridTemplateColumns: 'repeat(2, 1fr)',
										gridAutoRows: 'min-content',
										gap: '8px',
										width: '100%',
										height: 'fit-content',
										alignContent: 'start',
										boxSizing: 'border-box',
									},
								},
								(()=>{
									const imageBox = [];
									for(let i = 0; i < 4; i++){
										const imageItem = h('div', {
												className: 'MPLU-selectedImageItem handle',
												dataset: {
													isEmpty: 'true',
												},
												style: {
													backgroundColor: 'rgba(49, 51, 56, 1.0)',
													border: '1px solid rgba(30, 30, 30, 1)',
													width: '100%',
													aspectRatio: '1 / 1',
													boxSizing: 'border-box',
												},
											}
										);
										imageBox.push(imageItem);
									}
									return imageBox;
								})(),
							),
							h('div', {
									className: 'MPLU-selectedImagesBoxFooterArea',
									style: {
										display: 'flex',
										width: '100%',
										height: '2.5em',
										position: 'relative',
										justifyContent: 'flex-end',
									}
								},
								h('span', {
										className: 'MPLU-selectedImagesBoxSizeSum',
										style: {
											userSelect: 'none',
										},
										textContent: '0 MB / 10 MB',
									}
								),
								h('button', {
										className: 'MPLU-selectedImageBoxRemoveButton',
										textContent: '🗑️',
										style: {
											backgroundColor: 'rgba(74, 48, 48, 1)',
											border: '1px solid rgba(30, 30, 30, 1)',
										},
										onclick: (e) => {
											selectionManager.unregisterBox(box);
											box.remove();
											if(!sendImagesArea.querySelector('.MPLU-selectedImageBox')){
												createNewBox();
											}
										},
									}
								),
								h('button', {
										className: 'MPLU-selectedImagesBoxAddButton',
										style: {
											height: '2em',
											width: '2em',
											position: 'absolute',
											border: '1px solid rgba(30, 30, 30, 1)',
											top: '50%',
											left: '50%',
											transform: 'translate(-50%, -50%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											padding: '0',
										},
										onclick: (e) => {
											const targetBoxes = sendImagesArea.querySelectorAll('.MPLU-selectedImageBox');
											let targetBox = targetBoxes[targetBoxes.length - 1];
											if(targetBox.dataset.imagesNum > 0){
												createNewBox();
											}
										}
									},
									h('span', {
											textContent: '+',
											style: {
												userSelect: 'none',
											}
										}
									),
								),
							),
						);
						new Sortable(box.querySelector('.MPLU-selectedImagesBoxDisplayArea'), {
							animation: 150,//アニメーションのスピード
							ghostClass: 'sortable-ghost',//ドラッグ中の要素に付与されるクラス
							handle: '.handle'//並び替えが可能な部分（クラス名）を指定
						});
						selectionManager.registerBox(box);
						sendImagesArea.appendChild(box);
						return box;
					}
				})();

				const imagesListContainer = (()=>{
					const imageItems = [];
					const imagesListControllContainer = h('div', {
							className: 'MPLU-imagesListControllContainer',
							style: {
								display: 'flex',
								width: '100%',
								height: '1.5em',
								marginLeft: 'auto',
								justifyContent: 'flex-end',
								flexShrink: '0',
							}
						},
						h('button', {
								textContent: textData.selectAll,
								className: 'MPLU-selectAllButton',
								style: {
									height: '100%',
									width: 'fit-content',
									border: '1px solid rgba(30, 30, 30, 1)',
									backgroundColor: 'rgba(151, 40, 144, 1)',
								},
								onClick: (e) => {
									selectionManager.selectAll(imageItems, selectedImagesContainer.addImageToBox);
								},
							}
						),
						h('button', {
								textContent: '+',
								className: 'MPLU-increaseGridNumButton',
								style: {
									height: 'calc(100% - 2px)',
									margin: '1px 0px 1px 0px',
									width: '2em',
									backgroundColor: 'rgba(45, 102, 148, 1)',
								},
								onClick: (e) => {
									if(gridNum < 8)gridNum++;
									displayArea.style.gridTemplateColumns = `repeat(${gridNum}, 1fr)`;
								}
							}
						),
						h('button', {
								textContent: '−',
								className: 'MPLU-decreaseGridNumButton',
								style: {
									height: 'calc(100% - 2px)',
									margin: '1px 0px 1px 0px',
									width: '2em',
									backgroundColor: 'rgba(45, 102, 148, 1)',
								},
								onClick: (e) => {
									if(gridNum > 1)gridNum--;
									displayArea.style.gridTemplateColumns = `repeat(${gridNum}, 1fr)`;
								}
							}
						),
					);
					let gridNum = isMobile ? 2 : 4;
					const displayArea = h('div', {
							className: 'MPLU-imagesListDisplayArea',
							style: {
								display: 'grid',
								backgroundColor: 'rgba(0, 150, 250, 1)',
								gridTemplateColumns: `repeat(${gridNum}, 1fr)`,
								gridAutoRows: 'min-content',
								gap: '4px',
								width: '100%',
								height: '100%',
								flexGrow: '1',
								overflowY: 'auto',
								overflowX: 'hidden',
								padding: '2px',
								alignContent: 'start',
								boxSizing: 'border-box',
							}
						},
					);

					const thisFetchedImagesData = fetchedImagesData[illustId];
					for(let i = 0; i < pageNum; i++){
						const imageItem = h('div', {
								className: 'MPLU-imageItem MPLU-loading',
								dataset: {
									page: i,
									isSelected: false,
									imageSize: thisFetchedImagesData?.[i]?.size || 0,
									isTemporary: thisFetchedImagesData?.[i] ? 'false' : 'true',
									displayImageUrl: tmpImageUrl.replace('_p0_', `_p${i}_`),
									loaded: 'false',
								},
								style: {
									display: 'block',
									position: 'relative',
									width: '100%',
									aspectRatio: '1 / 1',
									backgroundColor: 'rgba(100, 100, 100, 0.5)',
									border: '1px solid rgba(30, 30, 30, 1)',
									padding: '1px',
									overflow: 'hidden',
									backgroundSize: 'cover',
									backgroundPosition: 'center',
									boxSizing: 'border-box',
									...((pageNum === 1) ? {backgroundImage: `url(${tmpImageUrl.replace('_p0_', `_p${i}_`)})`} : {}),
								},
								onClick: (e) => {
									imageItemClicked(e);
								}
							},
							h('div', {
									className: 'MPLU-loadingSpinner',
									style: {
										zIndex: pageNum === 1 ? '-10' : '1',
									}
								}
							),
							h('div', {
									className: 'MPLU-imageIndexLabel MPLU-image-label-background',
									textContent: `#${(i + 1).toString()}`,
									style: {
										position: 'absolute',
										top: '5%',
										left: '5%',
										padding: '2px 4px',
										fontSize: '0.8em',
										borderRadius: '3px',
										userSelect: 'none',
									}
								}
							),
							h('div', {
									className: 'MPLU-imageSizeLabel MPLU-image-label-background',
									textContent: `${thisFetchedImagesData?.[i]?.size ? (thisFetchedImagesData?.[i]?.size / 1024 / 1024).toFixed(2) : 0} MB`,
									style: {
										position: 'absolute',
										bottom: '5%',
										right: '5%',
										padding: '2px 4px',
										fontSize: '0.8em',
										borderRadius: '3px',
										userSelect: 'none',
									}
								}
							)
						);
						imageItems.push(imageItem);
						displayArea.appendChild(imageItem);
					}
					const node = h('div', {
							className: 'MPLU-imagesListContainer',
							style: {
								display: 'flex',
								width: isMobile ? '100%' : '67%',
								height: '98%',
								marginLeft: isMobile ? '0' : '3%',
								marginRight: isMobile ? '0' : '3%',
								flexDirection: 'column',
								zIndex: isMobile? '2': '0',
							}
						},
						imagesListControllContainer,
						displayArea,
					);
					if(isMobile){
						if(pageNum === 1){
							node.style.display = 'none';
							node.style.zIndex = '-1';
						}
					}
					let lazyLoadObserver = new IntersectionObserver((entries, observer) => {
						entries.forEach(entry => {
							if(entry.isIntersecting){
								const imageItem = entry.target;
								const imageUrl = imageItem.dataset.displayImageUrl;
								if(imageUrl && imageItem.dataset.loaded === 'false'){
									imageItem.style.backgroundImage = `url(${imageUrl})`;
									const img = h('img', {
										src: imageUrl,
										style: { display: 'none' },
										onload: (e) => {
											imageItem.classList.remove('MPLU-loading');
											const spinner = imageItem.querySelector('.MPLU-loadingSpinner');
											if(spinner)spinner.remove();
											e.target.remove();
										},
										onerror: (e) => {
											console.error('Failed to load image:', imageUrl);
											imageItem.classList.remove('MPLU-loading');
											const spinner = imageItem.querySelector('.MPLU-loadingSpinner');
											if(spinner)spinner.remove();
											imageItem.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
											e.target.remove();
										}
									});
									imageItem.appendChild(img);
									imageItem.dataset.loaded = 'true';
								}
								observer.unobserve(imageItem);
							}
						});
					}, {
						root: displayArea, // displayAreaをルートに指定
						rootMargin: '200px',
						threshold: 0.01
					});
					return {
						node,
						updateImagesData,
						startObserving,
						stopObserving,
						getImageItems: () => imageItems,
					};
					function startObserving(){
						imageItems.forEach(item => {
							lazyLoadObserver.observe(item);
						});
					}
					function stopObserving(){
						lazyLoadObserver.disconnect();
						lazyLoadObserver = null;
					}
					function imageItemClicked(e){
						const item = e.currentTarget;
						const page = parseInt(item.dataset.page);

						if(selectionManager.isSelected(page)){
							selectionManager.unselect(page);
						}else{
							selectionManager.select(page, item, selectedImagesContainer.addImageToBox);
						}
					}
					async function updateImagesData(){
						const imageData = await imagesDataPromise;
						imageItems.forEach((item, index) => {
							if(!item || item.dataset.isTemporary === 'false')return;
							item.dataset.imageSize = imageData?.[index]?.size || 0;
							item.dataset.isTemporary = 'false';
							const sizeLabel = item.querySelector('.MPLU-imageSizeLabel');
							if(sizeLabel){
								sizeLabel.textContent = `${imageData?.[index]?.size ? (imageData?.[index]?.size / 1024 / 1024).toFixed(2) : 0} MB`;
							}
						});
					}
				})();

				if(pageNum === 1){
					const firstImage = imagesListContainer.getImageItems()[0];
					if(firstImage){
						selectionManager.select(0, firstImage, selectedImagesContainer.addImageToBox);
					}
				}

				const mainContainer = h('div', {
						className: 'MPLU-selectImagesMainContainer',
						style: {
							display: 'flex',
							width: '95%',
							height: '91%',
							justifyContent: 'space-between',
							alignItems: 'stretch',
							...(isMobile ? {marginTop: '25px'} : {})
						}
					},
					selectedImagesContainer.node,
					imagesListContainer.node,
				);

				// モバイルの場合は切り替えボタンを追加
				if(isMobile){
					let showingImagesList = pageNum === 1 ? false : true;
					const toggleButton = h('button', {
							className: 'MPLU-toggleButton',
							textContent: textData.toggle,
							style: {
								position: 'fixed',
								bottom: '8%',
								right: '5%',
								width: '50px',
								height: '50px',
								borderRadius: '50%',
								border: 'none',
								backgroundColor: 'rgba(135, 206, 235, 1)',
								color: 'white',
								fontSize: '16px',
								cursor: 'pointer',
								zIndex: "1736"
							},
							onclick: (e) => {
								if(showingImagesList){
									selectedImagesContainer.node.style.display = 'flex';
									selectedImagesContainer.node.style.zIndex = '2';
									imagesListContainer.node.style.display = 'none';
									imagesListContainer.node.style.zIndex = '0';
								}else{
									selectedImagesContainer.node.style.display = 'none';
									selectedImagesContainer.node.style.zIndex = '0';
									imagesListContainer.node.style.display = 'flex';
									imagesListContainer.node.style.zIndex = '2';
								}
								showingImagesList = !showingImagesList;
							}
						}
					);
					mainContainer.appendChild(toggleButton);
				}

				const selectImagesOverlay = h('div', {
						className: 'MPLU-container webhookBringsArtworkToDiscord MPLU-selectImagesOverlay MPLU-fontColor',
						dataset: {function: 'selectImagesOverlay', feature: 'webhookBringsArtworkToDiscord'},
						style: {
							position: 'fixed',
							top: '0',
							left: '0',
							width: '100%',
							height: '100%',
							backgroundColor: 'rgba(0, 0, 0, 0.8)',
							zIndex: '9998',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexDirection: 'column',
						}
					},
					mainContainer,
					footerContainer.node,
					closeButton,
				);
				selectImagesOverlayFragment.appendChild(selectImagesOverlay);
				documentRoot.appendChild(selectImagesOverlayFragment);
				imagesListContainer.startObserving();

				imagesListContainer.updateImagesData();
				selectedImagesContainer.updateImagesData();
			}
		}
	}

	async function alternativeSearch(){
		if(sessionData.alternativeSearch)sessionData.alternativeSearch = null;
		const textData = envTextData.alternativeSearch;
		const documentRoot = document.querySelector('body > div#root, body > div#__next') || document.body;
		if(!sessionData.alternativeSearch){
			sessionData.alternativeSearch = {};
		}
		const optionValues = {};
		const pageParts = {layeredElement: {}, displayWorksElement: null};
		const elementActions = {};
		let displayWorksInstance = null;

		const alternativeSearchContainer = h('div', {
				className: 'MPLU-container MPLU-alternativeSearchContainer',
				style: {
					display: 'flex',
					position: 'relative',
					width: '100%',
					height: '100vh',
					color: 'var(--MPLU-font-color)',
					backgroundColor: 'var(--MPLU-background-color-light)',
					overflowY: 'hidden',
					overflowX: 'hidden',
				}
			},
		);

		const searchWordBox = (() => {
			const searchWordBoxParts = {rootElement: null};
			pageParts.searchWordBoxParts = searchWordBoxParts;

			const searchWordBox = h('input', {
					type: 'text',
					className: 'MPLU-searchWordBox-input',
					placeholder: pixivText.get('searchWorks'), // 作品を検索
					style: {
						color: 'var(--MPLU-font-color-dark)',
						background: 'none',
						outline: 'none',
						border: 'none',
						width: '100%',
					},
					oninput: (e) => {
						searchWordBoxParts.clearButton.style.display = e.currentTarget.value ? 'flex' : 'none';
						showSuggest(e.currentTarget);
					},
					onchange: (e) => {
						// optionValues.searchWord = e.currentTarget.value;
					},
					onfocusin: (e) => {
						searchBarContainer.style.boxShadow = '0 0 0 4px rgba(0,150,250,.32)';
						showSuggest(e.currentTarget);
					},
					onfocusout: (e) => {
						searchBarContainer.style.boxShadow = 'none';
					},
					onkeydown: (e) => {
						if(e.key === 'Enter'){
							e.preventDefault();
							elementActions.hideSuggestions?.();
							if(!displayWorksInstance){
								displayWorksInstance = new DisplayWorks();
							}
							const searchfunc = displayWorksInstance.createGetWorksFunction({searchOptions: {word: e.currentTarget.value, ai_type: 1, mode: 'safe'}});
							displayWorksInstance.inputWorks({getWorksDataFunction: searchfunc});
							if(!pageParts.displayWorksElement){
								pageParts.displayWorksElement = displayWorksInstance.getContainer();
								displayWorksContainer.appendChild(pageParts.displayWorksElement);
							}

						}
					},
					ref: (e) => {
						searchWordBoxParts.searchWordBox = e;
					}
				}
			);
			const searchWordClearButtonContainer = h('div', {
					className: 'MPLU-searchWordClearButtonContainer',
					style: {
						display: 'flex',
						width: '27px',
						height: '100%',
						alignItems: 'center',
						marginLeft: '4px',
					}
				},
				h('div', {
						className: 'MPLU-searchWordClearWrapper',
						style: {
							display: 'none',
							cursor: 'pointer',
							alignItems: 'center',
						},
						onclick: (e) => {
							searchWordBox.value = '';
							searchWordBox.focus();
							e.currentTarget.style.display = 'none';
						},
						ref: (e) => {
							searchWordBoxParts.clearButton = e;
						}
					},
					h('div', {
							className: 'MPLU-searchWordClearButtonBackground',
							style: {
								width: '16px',
								height: '16px',
								borderRadius: '99999px',
								backgroundColor: 'var(--MPLU-surface4)',
								color: 'var(--MPLU-text5)',
								alignItems: 'center',
								justifyContent: 'center',
								display: 'flex',
							}
						},
						h('svg', {
								className: 'MPLU-searchWordClearButtonIcon',
								viewBox: '0 0 16 16',
								width: '16px',
								height: '16px',
								fill: 'currentColor',
								stroke: 'none'
							},
							h('path', {
								d: 'M9.41421 8L11.7071 10.2929C12.0976 10.6834 12.0976 11.3166 11.7071 11.7071C11.3166 12.0976 10.6834 12.0976 10.2929 11.7071L8 9.41421L5.70711 11.7071C5.31658 12.0976 4.68342 12.0976 4.29289 11.7071C3.90237 11.3166 3.90237 10.6834 4.29289 10.2929L6.58579 8L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L8 6.58579L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L9.41421 8Z',
							})
						)
					)
				)
			);
			const searchBarContainer = h('div', {
					className: 'MPLU-searchBarContainer',
					style: {
						display: 'flex',
						height: '40px',
						margin: '4px',
						borderRadius: '4px',
						boxSizing: 'border-box',
						justifyContent: 'center',
						alignItems: 'center',
					},
					ref: (e) => {
						searchWordBoxParts.rootElement = e;
					},
					onclick: (e) => {
						searchWordBox.focus();
					}
				},
				h('div', {
						className: 'MPLU-searchWordBoxWrapper MPLU-searchWordBox',
						style: {
							display: 'flex',
							width: '100%',
							height: '100%',
							border: 'none',
							borderRadius: '4px',
							alignItems: 'center',
						}
					},
					h('svg', {
							className: 'MPLU-searchIcon',
							viewBox: '0 0 24 24',
							style: {
								width: '16px',
								height: '16px',
								color: 'var(--MPLU-text4)',
							}
						},
						h('path', {
							d: 'M8.25739 9.1716C7.46696 9.69512 6.51908 10 5.5 10C2.73858 10 0.5 7.76142 0.5 5C0.5 2.23858 2.73858 0 5.5 0C8.26142 0 10.5 2.23858 10.5 5C10.5 6.01908 10.1951 6.96696 9.67161 7.75739L11.7071 9.79288C12.0976 10.1834 12.0976 10.8166 11.7071 11.2071C11.3166 11.5976 10.6834 11.5976 10.2929 11.2071L8.25739 9.1716ZM8.5 5C8.5 6.65685 7.15685 8 5.5 8C3.84315 8 2.5 6.65685 2.5 5C2.5 3.34315 3.84315 2 5.5 2C7.15685 2 8.5 3.34315 8.5 5Z',
							'fill-rule': 'evenodd', 'clip-rule': 'evenodd', transform: 'translate(3 3)', fill: 'currentColor',
						})
					),
					searchWordBox,
					searchWordClearButtonContainer
				)
			);
			const suggestContainer = h('div', {
				className: 'MPLU-suggestContainer',
				style: {
					display: 'none',
					position: 'fixed',
					backgroundColor: 'var(--MPLU-surface1)',
					border: '1px solid rgba(255, 255, 255, 0.12)',
					borderRadius: '4px',
					maxHeight: '556px',
					overflowY: 'auto',
					zIndex: '10000',
					boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
					padding: '16px 0px 24px',
				}
			});
			alternativeSearchContainer.appendChild(suggestContainer);
			let suggestDebounceTimer = null;
			let whenWindowResize = null;
			let whenOutsidePointerDown = null;
			async function showSuggest(target){
				if(suggestDebounceTimer)clearTimeout(suggestDebounceTimer);
				suggestDebounceTimer = setTimeout(async () => {
					const cursorPos = target.selectionStart;
					const keyword = getCurrentWord(target.value, cursorPos);
					if(keyword){
						try{
							const response = await pixivApi.getSuggestTags(keyword);
							debug(response)
							const currentSuggestions = response?.candidates || [];

							if(currentSuggestions.length > 0){
								showSuggestions(currentSuggestions);
							}else{
								hideSuggestions();
							}
						}catch(error){
							console.error('Failed to fetch suggestions:', error);
							hideSuggestions();
						}
					}else{
						const history = await getFromIndexedDB('MPLU_SearchHistory', 'searchHistory'); // Set/Arrayなどが返りうる
						const historyArray = normalizeIterableToArray(history);

						if(historyArray.length > 0){
							showSuggestions(historyArray.slice().reverse(), true);
						}else{
							hideSuggestions();
						}
					}
				}, 300);
				if(whenWindowResize){
					window.removeEventListener('resize', whenWindowResize);
				}
				whenWindowResize = () => {
					if(suggestContainer.style.display !== 'none'){
						updateSuggestPosition();
					}
				};
				window.addEventListener('resize', whenWindowResize);

				function showSuggestions(suggestions, isHistory = false){
					suggestContainer.innerHTML = '';
					if(isHistory){
						const historyLabel = h('div', {
								className: 'MPLU-suggestHistoryLabelWrapper',
								style: {
									padding: '0px 16px 8px',
									display: 'flex',
									justifyContent: 'space-between',
								}
							},
							h('div', {
									textContent: pixivText.get('history'), // 履歴
									style: {
										fontWeight: 'bold',
										userSelect: 'none',
										fontSize: '14px',
										lineHeight: '22px',
										margin: '-4px 0px',
										color: 'var(--MPLU-font-color-dark)',
									}
								}
							),
							h('button', {
									textContent: pixivText.get('clearHistory'), // 履歴をクリア
									className: 'MPLU-clearSearchHistoryButton',
									style: {
										display: 'block',
										appearance: 'none',
										outline: 'none',
										border: 'none',
										background: 'none',
										color: 'var(--MPLU-text3)',
										textAlign: 'left',
										cursor: 'pointer',
										userSelect: 'none',
										fontSize: '14px',
										lineHeight: '22px',
										margin: '-4px 0px',
										padding: '0',
									},
									onclick: async (e) => {

									}
							})
						);
						suggestContainer.appendChild(historyLabel);
					}
					const suggestionsWrapper = h('div', {
						style: {
							display: 'flex',
							flexDirection: 'column',
							gap: '8px',
							overflowY: 'hidden',
						}
					});
					const suggestionsLength = suggestions.length > 10 ? 10 : suggestions.length;
					for(let i = 0; i < suggestionsLength; i++){
						const suggestionItem = h('a', {
								className: 'MPLU-suggestItem',
								textContent: suggestions[i].tag_name || suggestions[i],
								href: `/tags/${encodeURIComponent(suggestions[i].tag_name || suggestions[i])}/artworks?s_mode=s_tag`,
								style: {
									color: 'var(--MPLU-font-color)',
									pointerEvents: 'auto',
								},
								onclick: (e) => {
									e.preventDefault();
									selectSuggestion(suggestions[i].tag_name || suggestions[i]);
									hideSuggestions();
								}
							}
						);
						suggestionsWrapper.appendChild(suggestionItem);
					}
					suggestContainer.appendChild(suggestionsWrapper);
					updateSuggestPosition();
					suggestContainer.style.display = 'block';
					if(!whenOutsidePointerDown){
						whenOutsidePointerDown = (e) => {
							const t = e.target;
							if(!t)return;
							if(suggestContainer.contains(t))return;
							if(searchBarContainer && searchBarContainer.contains(t))return;
							hideSuggestions();
						};
						document.addEventListener('pointerdown', whenOutsidePointerDown, true);
					}
				}
				function getCurrentWord(text, cursorPos){
					const beforeCursor = text.substring(0, cursorPos);
					const afterCursor = text.substring(cursorPos);

					const lastSpaceBefore = beforeCursor.lastIndexOf(' ');
					const wordStart = lastSpaceBefore === -1 ? 0 : lastSpaceBefore + 1;

					const firstSpaceAfter = afterCursor.indexOf(' ');
					const wordEnd = firstSpaceAfter === -1 
						? text.length 
						: cursorPos + firstSpaceAfter;

					const currentWord = text.substring(wordStart, wordEnd).trim();

					searchWordBox._wordStart = wordStart;
					searchWordBox._wordEnd = wordEnd;

					return currentWord;
				}

				function selectSuggestion(tagName){
					const text = searchWordBox.value;
					const wordStart = searchWordBox._wordStart || 0;
					const wordEnd = searchWordBox._wordEnd || text.length;

					const newText = text.substring(0, wordStart) + tagName + text.substring(wordEnd);
					searchWordBox.value = newText;

					const newCursorPos = wordStart + tagName.length;
					searchWordBox.setSelectionRange(newCursorPos, newCursorPos);
					searchWordBox.focus();
					hideSuggestions();
					searchWordClearButton.style.display = 'flex';
				}

				function hideSuggestions(){
					suggestContainer.style.display = 'none';
					suggestContainer.innerHTML = '';
					if(whenWindowResize){
						window.removeEventListener('resize', whenWindowResize);
						whenWindowResize = null;
					}
					if(whenOutsidePointerDown){
						document.removeEventListener('pointerdown', whenOutsidePointerDown, true);
						whenOutsidePointerDown = null;
					}
				}
				elementActions.hideSuggestions = hideSuggestions;
				function updateSuggestPosition(){
					const rect = searchWordBox.getBoundingClientRect();
					suggestContainer.style.top = `${rect.bottom + window.scrollY + 14}px`;
					suggestContainer.style.left = `${rect.left + window.scrollX}px`;
					suggestContainer.style.width = `${rect.width}px`;
				}
				function normalizeIterableToArray(value){
					if(!value)return [];
					if(Array.isArray(value))return value;
					try{
						if(typeof value[Symbol.iterator] === 'function'){
							return Array.from(value);
						}
					}catch(e){
						// ignore
					}
					return [];
				}
			};
			return searchWordBoxParts;
		})();

		const searchOptionsContainerHeader = h('div', {
				className: 'MPLU-searchOptionsContainerHeader',
				style: {
					display: 'flex',
					width: '100%',
					height: '3em',
					boxSizing: 'border-box',
					alignItems: 'center',
					justifyContent: 'flex-end',
				}
			},
			h('button', {
				className: 'MPLU-hideSearchOptionsContainerButton MPLU-hoverEffect',
					style: {
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: '32px',
						height: '32px',
						border: 'none',
						transition: 'background-color 0.2s ease-in-out',
						cursor: 'pointer',
						padding: '0',
						marginRight: '16px',
						borderRadius: '4px',
					},
					onclick: (e) => {
						elementActions.toggleSearchOptionsCollapse();
					}
				},
				h('svg', { viewBox: '0 0 24 24', width: '20', height: '20', fill: 'currentColor' },
					h('path', { d: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z' } )
				),
			)
		);

		const searchOptionsContainer = h('div', {
				className: 'MPLU-searchOptionsContainer',
				style: {
					display: 'flex',
					width: '30%',
					height: '100%',
					boxSizing: 'border-box',
					overflowY: 'hidden',
					overflowX: 'hidden',
					borderRight: '1px solid var(--MPLU-border-color)',
					flexDirection: 'column',
					minWidth: '520px',
					flexShrink: '0',
					transition: 'width 160ms ease, min-width 160ms ease, border-right-width 160ms ease, opacity 160ms ease',
					willChange: 'width, min-width, opacity',
					opacity: '1',
				}
			},
			searchOptionsContainerHeader,
			searchWordBox.rootElement,
		);
		const displayWorksContainer = h('div', {
				className: 'MPLU-displayWorksContainerWrapper',
				style: {
					display: 'flex',
					flexGrow: '1',
					width: '70%',
					height: '100%',
					boxSizing: 'border-box',
					overflowY: 'auto',
					overflowX: 'hidden',
					transition: 'width 160ms ease',
				}
			}
		);

		alternativeSearchContainer.appendChild(searchOptionsContainer);
		alternativeSearchContainer.appendChild(displayWorksContainer);
		(()=>{
			const handleButton = h('button', {
					className: 'MPLU-alternativeSearch-handleButton MPLU-svg-button',
					style: {
						display: 'none',
						position: 'absolute',
						top: '180px',
						left: '0',
						transform: 'translateY(-50%)',
						width: '24px',
						height: '64px',
						border: `1px solid var(--MPLU-border-color)`,
						borderLeft: 'none',
						borderTopRightRadius: '8px',
						borderBottomRightRadius: '8px',
						backgroundColor: 'var(--MPLU-menu-container-background-color)',
						color: 'var(--MPLU-font-color)',
						cursor: 'pointer',
						zIndex: '4536',
						padding: '0',
					},
					onclick: (e) => {
						setCollapsed(false);
					},
					ref: (e) => {
						pageParts.layeredElement.handleButton = e;
					}
				},
				h('svg', {viewBox: '0 0 24 24', width: '18', height: '18', fill: 'currentColor'},
					h('path', {d: 'M8.59 16.59 10 18l6-6-6-6-1.41 1.41L12.17 12z'})
				),
			);

			alternativeSearchContainer.appendChild(handleButton);

			let collapsed = false;

			function setCollapsed(next){
				collapsed = !!next;
				if(collapsed){
					searchOptionsContainer.style.width = '0px';
					searchOptionsContainer.style.minWidth = '0px';
					searchOptionsContainer.style.borderRightWidth = '0px';

					searchOptionsContainer.style.opacity = '0';
					searchOptionsContainer.style.pointerEvents = 'none';

					displayWorksContainer.style.width = '100%';
					handleButton.style.display = 'flex';
				}else{
					searchOptionsContainer.style.width = '30%';
					searchOptionsContainer.style.minWidth = '520px';
					searchOptionsContainer.style.borderRightWidth = '1px';

					searchOptionsContainer.style.opacity = '1';
					searchOptionsContainer.style.pointerEvents = '';

					displayWorksContainer.style.width = '70%';
					handleButton.style.display = 'none';
				}
				if(sessionData.alternativeSearch){
					sessionData.alternativeSearch.isSearchOptionsCollapsed = collapsed;
				}
			}

			function toggle(){
				setCollapsed(!collapsed);
			}

			elementActions.toggleSearchOptionsCollapse = toggle;
		})();		
		const displayAlternativeSearch = () => {
			if(sessionData.alternativeSearch.isDisplayed)return;
			documentRoot.style.display = 'none';
			sessionData.alternativeSearch.isDisplayed = true;
			if(!sessionData.alternativeSearch.searchContainer){
				document.body.appendChild(alternativeSearchContainer);
				sessionData.alternativeSearch.searchContainer = alternativeSearchContainer;
			}
			alternativeSearchContainer.style.display = 'flex';
		};
		const hideAlternativeSearch = () => {
			if(!sessionData.alternativeSearch.isDisplayed)return;
			documentRoot.style.display = '';
			sessionData.alternativeSearch.isDisplayed = false;
			if(sessionData.alternativeSearch.searchContainer){
				sessionData.alternativeSearch.searchContainer.style.display = 'none';
			}
			const layeredElementKeys = Object.keys(pageParts.layeredElement);
			for(let i = 0; i < layeredElementKeys.length; i++){
				const elem = pageParts.layeredElement[layeredElementKeys[i]];
				if(elem && elem.style){
					elem.style.display = 'none';
				}
			}
		};
		sessionData.alternativeSearch.display = displayAlternativeSearch;
		sessionData.alternativeSearch.hide = hideAlternativeSearch;
		sessionData.whenLocationChangeFunctions.hideAlternativeSearch = hideAlternativeSearch;
	}

	/////////////////////////////////
	/////////// 共通関数群 ///////////
	/////////////////////////////////

	function update({refresh = false, urlChange = false, firstRun = false} = {}){
		if(updating && refresh === false)return;
		updating = true;
		try{
			main({refresh, urlChange, firstRun});
		}catch(error){
			console.error(error);
		}
		setTimeout(() => {updating = false;}, 600);
	}

	function locationChange(targetPlace = document){
		if(window.onurlchange === null){
			window.addEventListener('urlchange', (info) => {
				currentUrl = document.location.href;
				try{
					update({urlChange: true});
					whenLocationChange();
				}catch(error){console.error(error)}
			});
		}
	}

	async function whenLocationChange(){
		const keys = Object.keys(sessionData.whenLocationChangeFunctions);
		for(let i = 0; i < keys.length; i++){
			const func = sessionData.whenLocationChangeFunctions[keys[i]];
			try{
				await func();
			}catch(error){
				console.error(error);
			}
		}
		if(sessionData.settingsPage)sessionData.settingsPage.remove();
	}

	function navigateTo(url, state = {}){
		if(new URL(currentUrl, location.origin)?.pathname === new URL(url, location.origin)?.pathname)return;
		if(isMobile){
			history.pushState(state, "", url);
			unsafeWindow.dispatchEvent(new Event("popstate"));
		}else{
			unsafeWindow.next.router.push(url);
		}
	}

	function isMobileDevice(){
		const userAgent = navigator.userAgent || navigator.vendor || window.opera;
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
	}
	function deviceCheck(){
		const root = document.querySelector('body > div#root, body > div#__next');
		const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
		return {isMobile: (!root), isPC: (!!root), isOddMobile: isMobileUserAgent && (!root)};
	}
	function _i18n(){
		let scriptSettings = {};
		const langCode = (scriptSettings?.makePixivLittleUseful?.language) || getCookie('user_language') || document.querySelector('html').lang || 'en';
		envTextData = i18nData[langCode] || i18nData.en;
	}

	async function getMyUserData(){
		const userData = {myUserId: 1, x_csrf_token: null, lang: 'ja'};
		const target = await waitElementAndGet({query: '#__NEXT_DATA__, #init-config', searchFunction: 'querySelector', interval: 500, retry: 4});
		if(!target){
			sessionData.myUserData = userData;
			return userData;
		};
		let myUserId, x_csrf_token, lang;
		try{
			if(target.id === '__NEXT_DATA__'){
				const nextData = JSON.parse(target.innerText);
				const serverSerializedPreloadedState = JSON.parse(nextData.props.pageProps.serverSerializedPreloadedState);
				myUserId = serverSerializedPreloadedState?.userData?.self?.id ?? 1;
				x_csrf_token = serverSerializedPreloadedState?.api?.token ?? null;
				lang = serverSerializedPreloadedState?.api?.lang ?? "ja";
			}else if(target.id === 'init-config'){
				const initConfig = JSON.parse(target.content);
				myUserId = initConfig['pixiv.user.id'] ?? 1;
				x_csrf_token = initConfig['pixiv.context.postKey'] ?? null;
				lang = initConfig['pixiv.user.language'] ?? "ja";	
			}
			userData.myUserId = myUserId;
			userData.x_csrf_token = x_csrf_token;
			userData.lang = lang;
			sessionData.myUserData = userData;
			return userData;
		}catch(err){
			console.error('getMyUserData error:', err);
			const el = await waitElementAndGet({query: 'div > a[href^="/users/"]:has(> span > figure), .work-details-comments-container .comment-submit-form a.profile-img', searchFunction: 'querySelector', interval: 500, retry: 1});
			userData.myUserId = el?.href?.match(/users\/([\d]+)$/)?.[1] ?? 1;
			sessionData.myUserData = userData;
			return userData;
		}
	}

	/**
	 * 2つのオブジェクトをディープマージ
	 * @param {Object} target - デフォルト値（ベース）
	 * @param {Object} source - 保存済み設定（優先）
	 * @returns {Object} - マージされたオブジェクト
	 */
	function deepMerge(target, source){
		const result = {...target};

		for(const key in source){
			if(source.hasOwnProperty(key)){
				if(isObject(source[key]) && isObject(target[key])){
					// 両方がオブジェクトの場合、再帰的にマージ
					result[key] = deepMerge(target[key], source[key]);
				}else{
					// プリミティブ値または配列の場合、sourceの値を優先
					result[key] = source[key];
				}
			}
		}

		return result;
	}

	function isObject(obj){
		return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
	}

	async function loadSettings(){
		const settingsAliases = {
			webhookBringsArtworkToDiscord: ['PtoD'],
		};
		const storedSettings = await getFromIndexedDB('pivivLMU', 'settings') || {};
		const resolvedSettings = resolveAliases(storedSettings);
		const defaultSettings = {
			makePixivLittleUseful: {
				enableFunction: {
					webhookBringsArtworkToDiscord: false
				},
				language: 'ja',
			},
			webhookBringsArtworkToDiscord: {
				defaultWebhook: '',
				closeWindowAfterSend: 'Yes',
				captionOnOff: 'No',
				data: [],
			},
		};
		scriptSettings = deepMerge(defaultSettings, resolvedSettings);
		/**
		 * エイリアスを解決して設定を正規化
		 * @param {Object} settings - 保存された設定
		 * @returns {Object} - エイリアスが解決された設定
		 */
		function resolveAliases(settings){
			const resolved = {...settings};

			for(const [newKey, aliases] of Object.entries(settingsAliases)){
				// 既に新しいキーが存在する場合はスキップ
				if(resolved[newKey])continue;

				// エイリアス（旧キー）を探す
				for(const alias of aliases){
					if(resolved[alias]){
						// 旧キーのデータを新キーに移行
						resolved[newKey] = resolved[alias];
						// 旧キーは削除
						delete resolved[alias];
						console.log(`[Settings] Migrated alias: ${alias} -> ${newKey}`);
						break; // 最初に見つかったエイリアスを使用
					}
				}
			}

			return resolved;
		}
	}

	async function saveSettings(){
		await saveToIndexedDB('pivivLMU', 'settings', scriptSettings);
		return "OK";
	}

	function getCookie(name){
		let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return decodeURIComponent(arr[2]);
		}else{
			return null;
		}
	}

	function updateThemeMode(){
		const observeElement = isMobile ? document.body : document.querySelector('html');
		const root = document.documentElement;
		let currentThemeNum = null;
		const observeFunction = ()=>{
			const color = ['default', 'dark'];
			const themeName = isMobile ? (observeElement.classList.contains('dark') ? 'dark' : 'default') : (observeElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default');
			const darkModeNum = color.indexOf(themeName);
			if(currentThemeNum === darkModeNum)return;
			currentThemeNum = darkModeNum;
			sessionData.themeMode.themeNum = darkModeNum !== -1 ? darkModeNum : null;

			// :root (html要素) にCSS変数を設定
			root.style.setProperty('--MPLU-theme-mode', color[currentThemeNum] || 'default');

			// 各色のCSS変数を設定
			root.style.setProperty('--MPLU-font-color', colors.get('fontColor'));
			root.style.setProperty('--MPLU-font-color-dark', colors.get('fontColorDark'));
			root.style.setProperty('--MPLU-background-color', colors.get('backgroundColor'));
			root.style.setProperty('--MPLU-background-color-light', colors.get('backgroundColorLight'));
			root.style.setProperty('--MPLU-search-options-background-color', colors.get('searchOptionsBackgroundColor'));
			root.style.setProperty('--MPLU-search-options-background-color-hover', colors.get('searchOptionsBackgroundColorHover'));
			root.style.setProperty('--MPLU-jump-button-font-color', colors.get('jumpButtonFontColor'));
			root.style.setProperty('--MPLU-jump-button-hover-font-color', colors.get('jumpButtonHoverFontColor'));
			root.style.setProperty('--MPLU-jump-button-hover-background-color', colors.get('jumpButtonHoverBackgroundColor'));
			root.style.setProperty('--MPLU-jump-button-active-font-color', colors.get('jumpButtonActiveFontColor'));
			root.style.setProperty('--MPLU-jump-button-active-background-color', colors.get('jumpButtonActiveBackgroundColor'));
			root.style.setProperty('--MPLU-border-color', colors.get('borderColor'));
			root.style.setProperty('--MPLU-twitter-blue', colors.get('twitterBlue'));
			root.style.setProperty('--MPLU-menu-hover-effect', colors.get('menuHoverEffect'));
			root.style.setProperty('--MPLU-menu-hover-effect-light', colors.get('menuHoverEffectLight'));
			root.style.setProperty('--MPLU-dropdown-background-color', colors.get('dropdownBackgroundColor'));
			root.style.setProperty('--MPLU-dropdown-font-color', colors.get('dropdownFontColor'));
			root.style.setProperty('--MPLU-dropdown-border-color', colors.get('dropdownBorderColor'));
			root.style.setProperty('--MPLU-button-background-color', colors.get('buttonBackgroundColor'));
			root.style.setProperty('--MPLU-button-font-color', colors.get('buttonFontColor'));
			root.style.setProperty('--MPLU-button-border-color', colors.get('buttonBorderColor'));
			root.style.setProperty('--MPLU-conversation-line-color', colors.get('conversationLineColor'));
			root.style.setProperty('--MPLU-menu-container-background-color', colors.get('menuContainerBackgroundColor'));
			root.style.setProperty('--MPLU-menu-container-font-color', colors.get('menuContainerFontColor'));
			root.style.setProperty('--MPLU-menu-container-border-color', colors.get('menuContainerBorderColor'));
			root.style.setProperty('--MPLU-menu-container-hover-background-color', colors.get('menuContainerHoverBackgroundColor'));

			const colorKeys = colors.getColorNames();
			for(let i = 0; i < colorKeys.length; i++){
				const key = colorKeys[i];

				if(!key.startsWith('charcoal'))continue;

				const value = colors.get(key);

				// charcoalAssertiveHover -> --MPLU-assertive-hover
				const cssVarName =
					'--MPLU' +
					key
						.replace(/^charcoal/, '')
						.replace(/([A-Z])/g, '-$1')
						.toLowerCase();

				root.style.setProperty(cssVarName, value);
			}
			whenChangeThemeMode();
		};
		observeFunction();
		const observer = new MutationObserver(mutations => {
			observeFunction();
		});
		observer.observe(observeElement, {childList: false, subtree: false, attributes: true});
	}

	function whenChangeThemeMode(){
		// テーマ変更時に実行される処理
	}

	function appendStyle(featureName, styleString, refresh = false){
		const styleId = `MPLU-style-${featureName}`;
		if(sessionData.appendedCssElements[styleId] && !refresh)return;
		if(refresh){
			const existingElement = sessionData.appendedCssElements[featureName];
			if(existingElement)existingElement.remove();
		}
		const styleElement = document.createElement('style');
		styleElement.id = styleId;
		styleElement.innerHTML = styleString;
		document.head.appendChild(styleElement);
		sessionData.appendedCssElements[featureName] = styleElement;
	}

	function appendScriptGlobalStyle(refresh = false){
		const style = `
			/* CSS変数を定義（フォールバック値として初期値を設定） */
			:root {
				--MPLU-theme-mode: default;
				--MPLU-font-color: rgb(15, 20, 25);
				--MPLU-font-color-dark: rgb(83, 100, 113);
				--MPLU-background-color: rgb(245, 245, 245);
				--MPLU-background-color-light: rgb(250, 250, 250);
				--MPLU-search-options-background-color: rgba(0,0,0,0.04);
				--MPLU-search-options-background-color-hover: rgba(0,0,0,0.0784);
				--MPLU-jump-button-font-color: rgb(133, 133, 133);
				--MPLU-jump-button-hover-font-color: rgb(128, 128, 128);
				--MPLU-jump-button-hover-background-color: rgba(0, 0, 0, 0.04);
				--MPLU-jump-button-active-font-color: rgb(255, 255, 255);
				--MPLU-jump-button-active-background-color: rgba(0, 0, 0, 0.88);
				--MPLU-border-color: rgb(239, 243, 244);
				--MPLU-twitter-blue: rgb(29, 155, 240);
				--MPLU-menu-hover-effect: rgba(15, 20, 25, 0.1);
				--MPLU-menu-hover-effect-light: rgb(247, 249, 249);
				--MPLU-dropdown-background-color: rgb(255, 255, 255);
				--MPLU-dropdown-font-color: rgb(0, 0, 0);
				--MPLU-dropdown-border-color: rgb(118, 118, 118);
				--MPLU-button-background-color: rgb(239, 239, 239);
				--MPLU-button-font-color: rgb(0, 0, 0);
				--MPLU-button-border-color: rgb(239, 239, 239);
				--MPLU-conversation-line-color: rgb(207, 217, 222);
				--MPLU-menuContainer-background-color: rgb(255, 255, 255);
				--MPLU-menuContainer-font-color: rgb(71, 71, 71);
				--MPLU-menuContainer-hover-background-color: rgba(0,0,0,0.04);
			}

			.MPLU-container * {
				font-size: 1em;
				line-height: 1em;
			}
			.MPLU-fontColor {
				color: var(--MPLU-font-color);
			}
			.MPLU-fontColorDark {
				color: var(--MPLU-font-color-dark);
			}
			.MPLU-menuHoverEffect {
				background-color: var(--MPLU-menu-hover-effect);
			}
			.MPLU-menuHoverEffectLight {
				background-color: var(--MPLU-menu-hover-effect-light);
			}
			.MPLU-link {
				color: var(--MPLU-twitter-blue);
				text-decoration: none;
				width: fit-content;
			}
			.MPLU-link:hover {
				text-decoration: underline;
				text-decoration-thickness: 1px;
				outline-style: none;
			}

			.MPLU-searchWordBox {
				background-color: var(--MPLU-surface3);
				transition: background-color .2s,box-shadow .2s;
			}

			.MPLU-searchWordBox:hover {
				background-color: var(--MPLU-search-options-background-color-hover);
			}

			.MPLU-hoverEffect:hover {
				transition: background-color 0.2s;
				background-color: var(--MPLU-search-options-background-color-hover);
			}

			.MPLU-button {
				background-color: var(--MPLU-button-background-color);
				color: var(--MPLU-button-font-color);
				border: 2px solid var(--MPLU-button-border-color);
				border-radius: 2px;
				padding: 0px 5px;
				cursor: pointer;
				transition: background-color 0.2s;
			}
			.MPLU-button:hover {
				background-color: color-mix(in srgb, var(--MPLU-button-background-color) 80%, transparent);
			}
			.MPLU-container .MPLU-button:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}

			.MPLU-svg-button {
				cursor: pointer;
				transition: background-color 0.2s;
			}

			.MPLU-svg-button:hover {
				background-color: color-mix(in srgb, var(--MPLU-border-color) 10%, transparent);
			}

			.MPLU-container .MPLU-select {
				background-color: var(--MPLU-dropdown-background-color);
				color: var(--MPLU-dropdown-font-color);
				border: 1px solid var(--MPLU-dropdown-border-color);
				border-radius: 2px;
				padding: 0px 5px;
			}
			.MPLU-container .MPLU-select:hover {
				background-color: color-mix(in srgb, var(--MPLU-dropdown-background-color) 90%, transparent);
			}

			.MPLU-container .textinput[type="text"],
			.MPLU-container .textboxinput[type="textbox"] {
				background-color: var(--MPLU-dropdown-background-color);
				color: var(--MPLU-dropdown-font-color);
				border: 1px solid var(--MPLU-dropdown-border-color);
				border-radius: 2px;
				transition: background-color 0.2s, border-color 0.2s;
				box-sizing: border-box;
			}

			.MPLU-container input[type="text"]:hover,
			.MPLU-container input[type="textbox"]:hover {
				background-color: color-mix(in srgb, var(--MPLU-dropdown-background-color) 90%, transparent);
			}

			.MPLU-container .textinput[type="text"]:focus,
			.MPLU-container .textboxinput[type="textbox"]:focus {
				border-color: var(--MPLU-twitter-blue);
				outline: none;
				background-color: color-mix(in srgb, var(--MPLU-dropdown-background-color) 95%, transparent);
			}

			.MPLU-container .textinput[type="text"]:disabled,
			.MPLU-container .textboxinput[type="textbox"]:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				background-color: color-mix(in srgb, var(--MPLU-dropdown-background-color) 50%, transparent);
			}

			/* https://engineer-tips.com/2025/09/14/css-tooltip/ のをパクった */
			.MPLU-tooltip {
				position: relative;
				cursor: pointer;
			}

			.MPLU-tooltip::before {
				content: attr(data-tooltip-text);
				position: absolute;
				bottom: 100%;
				left: 50%;
				transform: translateX(-50%);

				background-color: var(--MPLU-background-color);
				color: var(--MPLU-font-color);
				padding: 8px 12px;
				border-radius: 5px;
				font-size: 14px;
				white-space: nowrap;
				z-index: 1000;

				opacity: 0;
				visibility: hidden;
				transition: opacity 0.2s, visibility 0.2s;
				pointer-events: none;
			}

			.MPLU-tooltip:hover::before {
				opacity: 1;
				visibility: visible;
			}

			/* 右側に表示 */
			.MPLU-tooltip-right::before {
				left: var(--tooltip-x, 100%);
				top: var(--tooltip-y, 50%);
				bottom: auto;
				transform: translateY(-50%);
			}

			/* 左側に表示 */
			.MPLU-tooltip-left::before {
				right: var(--tooltip-x, 100%);
				top: var(--tooltip-y, 50%);
				left: auto;
				bottom: auto;
				transform: translateY(-50%);
			}

			/* 上側に表示 */
			.MPLU-tooltip-top::before {
				bottom: var(--tooltip-y, 100%);
				left: var(--tooltip-x, 50%);
				top: auto;
				transform: translateX(-50%);
			}

			/* 下側に表示 */
			.MPLU-tooltip-bottom::before {
				top: var(--tooltip-y, 100%);
				left: var(--tooltip-x, 50%);
				bottom: auto;
				transform: translateX(-50%);
			}

			/* DisplayWorks */
			.MPLU-pageMoveButton {
				display: flex;
				font-size: 1rem;
				line-height: calc(1em + 8px);
				text-decoration: none;
				border: medium;
				outline: none;
				touch-action: manipulation;
				user-select: none;
				transition:box-shadow 0.2s, color 0.2s, background 0.2s, opacity 0.2s;
				justify-content: center;
				align-items: center;
				box-sizing: border-box;
				width: 40px;
				height: 40px;
				min-width: 24px;
				min-height: 24px;
				padding: 8px;
				cursor: pointer;
				font-weight: bold;
				border-radius: 48px;
				transform: translateZ(0px);
				color: var(--MPLU-jump-button-font-color);
			}
			.MPLU-pageMoveButton:not(.active, .disabled):hover {
				color: var(--MPLU-jump-button-hover-font-color);
				background-color: var(--MPLU-jump-button-hover-background-color);
			}
			.MPLU-pageMoveButton.active {
				color: var(--MPLU-jump-button-active-font-color);
				background-color: var(--MPLU-jump-button-active-background-color);
			}
			.MPLU-pageMoveButton.disabled {
				visibility: hidden;
				pointer-events: none;
			}
			.MPLU-displayWorksGridWorkImageInnerContainer::before {
				content: ;
				position: absolute;
				display: block;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0,0);
				border-radius: 4px;
			}
			.MPLU-displayWorksGridWorkImage {
				object-fit: cover;
				object-position: center center;
				border-radius: 4px;
				background-color: var(--MPLU-surface1);
				transition: opacity 0.2s;
				border-style: none;
			}
			.MPLU-displayWorksGridWorkImage:hover {
				opacity: 0.8;
			}
			.MPLU-worksLinkColor {
				color: var(--MPLU-text1);
			}
			.MPLU-worksLinkColor:hover {
				color: var(--MPLU-text1Hover);
			}
			.MPLU-worksLinkColor:visited {
				color: var(--MPLU-text1Visited);
			}
			.MPLU-authorIconImageContainer {
				display: flex;
				border-radius: 50%;
				flex: 0 0 auto;
				overflow: hidden;
				width: 24px;
				height: 24px;
				position: relative;
			}
			.MPLU-authorIconImageContainer::before {
				position: absolute;
				display: block;
				content: ;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				backgroundColor: rgba(0, 0, 0, 0,0);
			}
			.MPLU-displayWorksMainHeaderImageLink {
				display: block;
				position: relative;
				border-radius: 8px;
				border: 2px solid var(--MPLU-surface1);
				overflow: hidden;
				cursor: pointer;
				box-sizing: border-box;
			}
			.MPLU-displayWorksMainHeaderImageLink::before {
				content: ;
				position: absolute;
				display: block;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
				background-color: rgba(0, 0, 0, 0,0);
			}
`.replace(/^(\t){3}/mg,'');
		appendStyle('makePixivLittleUseful', style, refresh);
	}

	function sleep(time){
		return new Promise((resolve)=>{
			setTimeout(()=>{return resolve(time)}, time);
		});
	}

	function decodeHtml(html){
		const txt = document.createElement("div");
		txt.innerHTML = html;
		return txt.textContent;
	}

	function copyToClipboard(text){
		navigator.clipboard.writeText(text).then(function(){
			debug('クリップボードにコピーしました！');
		}).catch(function(err){
			console.error('コピーに失敗しました:', err);
		});
	}

	/**
	 * 画像を指定した形式に変換
	 * @param {Object} options - オプション
	 * @param {Blob | string} options.src - 元の画像Blob または URL
	 * @param {string} [options.format='image/jpeg'] - 出力形式 ('image/jpeg', 'image/png', 'image/webp')
	 * @param {number} [options.quality=0.9] - 品質 (0.0 ~ 1.0, JPEGとWebPのみ有効)
	 * @param {number} [options.width=null] - 出力幅 (指定時は高さも必須、またはkeepAspectRatio=true)
	 * @param {number} [options.height=null] - 出力高さ (指定時は幅も必須、またはkeepAspectRatio=true)
	 * @param {number} [options.maxWidth=null] - 最大幅 (アスペクト比を保持してリサイズ)
	 * @param {number} [options.maxHeight=null] - 最大高さ (アスペクト比を保持してリサイズ)
	 * @param {boolean} [options.keepAspectRatio=true] - アスペクト比を維持するか
	 * @param {string} [options.returnDataType='blob'] - 返却データの型 ('blob', 'dataURL', 'arrayBuffer', 'uint8Array', 'canvas')
	 * @returns {Promise<Blob>} - 変換後のBlob
	 */
	async function convertImageFormat({src, format = 'image/jpeg', quality = 0.9, width = null, height = null, maxWidth = null, maxHeight = null, keepAspectRatio = true, returnDataType = 'blob'}){
		return new Promise((resolve, reject) => {
			const img = new Image();
			const url = src instanceof Blob ? URL.createObjectURL(src) : src;
			img.onload = () => {
				try{
					// リサイズ計算
					let targetWidth = img.width;
					let targetHeight = img.height;

					// 明示的なサイズ指定がある場合
					if(width !== null || height !== null){
						if(keepAspectRatio){
							// アスペクト比を保持してリサイズ
							const aspectRatio = img.width / img.height;
							if(width !== null && height === null){
								targetWidth = width;
								targetHeight = Math.round(width / aspectRatio);
							}else if(height !== null && width === null){
								targetHeight = height;
								targetWidth = Math.round(height * aspectRatio);
							}else{
								// 両方指定されている場合は、指定された幅・高さに収まるようにリサイズ
								const widthRatio = width / img.width;
								const heightRatio = height / img.height;
								const ratio = Math.min(widthRatio, heightRatio);
								targetWidth = Math.round(img.width * ratio);
								targetHeight = Math.round(img.height * ratio);
							}
						}else{
							// アスペクト比を無視して強制リサイズ
							targetWidth = width !== null ? width : img.width;
							targetHeight = height !== null ? height : img.height;
						}
					}else if(maxWidth !== null || maxHeight !== null){
						const aspectRatio = img.width / img.height;
						let scale = 1;

						if(maxWidth !== null && targetWidth > maxWidth){
							scale = Math.min(scale, maxWidth / targetWidth);
						}
						if(maxHeight !== null && targetHeight > maxHeight){
							scale = Math.min(scale, maxHeight / targetHeight);
						}

						if(scale < 1){
							targetWidth = Math.round(targetWidth * scale);
							targetHeight = Math.round(targetHeight * scale);
						}
					}
					const canvas = document.createElement('canvas');
					canvas.width = targetWidth;
					canvas.height = targetHeight;

					const ctx = canvas.getContext('2d');
					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = 'high';
					ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

					const finalize = (blob) => {
						URL.revokeObjectURL(url);
						switch(returnDataType){
							case 'blob':
								resolve(blob);
								break;
							case 'dataURL':
								resolve(canvas.toDataURL(format, quality));
								break;
							case 'arrayBuffer':
								blob.arrayBuffer().then(resolve).catch(reject);
								break;
							case 'uint8Array':
								blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf))).catch(reject);
								break;
							case 'canvas':
								resolve(canvas);
								break;
							default:
								reject(new Error(`Unsupported returnDataType: ${returnDataType}`));
						}
					};
					canvas.toBlob((convertedBlob) => {
						if(!convertedBlob){
							reject(new Error('Failed to convert image'));
							return;
						}
						finalize(convertedBlob);
					}, format, quality);
				}catch(error){
					URL.revokeObjectURL(url);
					reject(error);
				}
			};
			img.onerror = () => {
				URL.revokeObjectURL(url);
				reject(new Error('Failed to load image'));
			};
			img.src = url;
		});
	}

	async function getFileSize(url){
		const response = await request({url: url, method: 'HEAD'});
		const fileSizeTmp = response.responseHeaders.match(/content-length:\s*(\d+)/i);
		const fileSize = fileSizeTmp ? parseInt(fileSizeTmp[1], 10) : null;
		return fileSize;
	}

	function blobToDataURL(blob){
		return new Promise((resolve, reject)=>{
			const reader = new FileReader();
			reader.onload = ()=>resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	}

	/**
	 * BlobをArrayBufferとして読み込む（FileReader使用、サンドボックス対応）
	 * @param {Blob} blob
	 * @returns {Promise<ArrayBuffer>}
	 */
	function readBlobAsArrayBuffer(blob){
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				// Firefoxサンドボックス対応: cloneIntoでクローン
				const cloned = _cloneInto(new Uint8Array(reader.result), window);
				resolve(cloned.buffer);
			};
			reader.onerror = () => reject(reader.error);
			reader.readAsArrayBuffer(blob);
		});
	}

	function openIndexedDB(dbName, storeName){
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName);

			request.onerror = (event) => {
				reject("Database error: " + event.target.errorCode);
			};

			request.onsuccess = (event) => {
				let db = event.target.result;
				if(db.objectStoreNames.contains(storeName)){
					resolve(db);
				}else{
					db.close();
					const newVersion = db.version + 1;
					const versionRequest = indexedDB.open(dbName, newVersion);
					versionRequest.onupgradeneeded = (event) => {
						db = event.target.result;
						db.createObjectStore(storeName, { keyPath: 'id' });
					};
					versionRequest.onsuccess = (event) => {
						resolve(event.target.result);
					};
					versionRequest.onerror = (event) => {
						reject("Database error: " + event.target.errorCode);
					};
				}
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;
				db.createObjectStore(storeName, { keyPath: 'id' });
			};
		});
	}

	function saveToIndexedDB(dbName, storeName, data, id = 522){
		return new Promise(async (resolve, reject) => {
			try{
				const db = await openIndexedDB(dbName, storeName);
				const transaction = db.transaction(storeName, 'readwrite');
				const store = transaction.objectStore(storeName);
				const putRequest = store.put({ id: id, data: data });

				putRequest.onsuccess = () => {
					resolve("Data saved successfully.");
				};

				putRequest.onerror = (event) => {
					reject("Data save error: " + event.target.errorCode);
				};
			}catch(error){
				reject(error);
			}
		});
	}

	function getFromIndexedDB(dbName, storeName, id = 522){
		return new Promise(async (resolve, reject) => {
			try{
				const db = await openIndexedDB(dbName, storeName);
				const transaction = db.transaction(storeName, 'readonly');
				const store = transaction.objectStore(storeName);
				const getRequest = store.get(id);

				getRequest.onsuccess = (event) => {
					if(event.target.result){
						// こうしないとfirefox系ブラウザで
						// Error: Not allowed to define cross-origin object as property on [Object] or [Array] XrayWrapper
						// というエラーが出ることがあるので、構造化クローンを使ってコピーする
						// でかいオブジェクトだと効率が悪いのでなにかいい方法があれば教えてください
						resolve(_cloneInto(event.target.result.data));
					}else{
						resolve(null);
					}
				};

				getRequest.onerror = (event) => {
					reject("Data fetch error: " + event.target.errorCode);
				};
			}catch(error){
				reject(error);
			}
		});
	}

	function getValueFromObjectByPath(object, path, defaultValue = undefined){
		const isArray = Array.isArray;
		if(object == null || typeof object != 'object')return defaultValue;
		const result = (isArray(object)) ? object.map(createProcessFunction(path)) : createProcessFunction(path)(object);
		return result ?? defaultValue;
		function createProcessFunction(path){
			if(typeof path == 'string')path = path.split('.');
			if(!isArray(path))path = [path];
			return function(object){
				let index = 0,
				length = path.length;
				while(index < length){
					const key = toString_(path[index++]);
					if(object === undefined){
						return defaultValue;
					}
					// 配列に対する処理
					if(isArray(object)){
						object = object.map(item => item[key]);
					}else{
						object = object[key];
					}
				}
				return (index && index == length) ? object : void 0;
			};
		}
		function toString_(value){
			if(value == null)return '';
			if(typeof value == 'string')return value;
			if(isArray(value))return value.map(toString) + '';
			let result = value + '';
			return '0' == result && 1 / value == -(1 / 0) ? '-0' : result;
		}
	}

	function customAlert(message){
		const overlay = h('div', {
				className: 'MPLU-custom-alert-overlay MPLU-container',
				style: {
					position: 'fixed',
					top: '0',
					left: '0',
					width: '100%',
					height: '100%',
					backgroundColor: 'rgba(0, 0, 0, 0.5)',
					zIndex: 'calc(infinity)',
				},
				onclick: (e) => {
					if(e.target === overlay){
						overlay.remove();
					}
				}
			},
			h('div', {
					style: {
						display: 'flex',
						flexDirection: 'column',
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						padding: '20px',
						backgroundColor: 'var(--MPLU-menu-container-background-color)',
						border: '1px solid black',
						borderRadius: '8px',
					}
				},
				h('p', {}, message),
				h('button', {
						className: 'MPLU-button',
						textContent: "Close",
						style: {
							marginTop: '12px',
							alignSelf: 'flex-end',
							padding: '6px 12px',
						},
						onclick: () => {
							overlay.remove();
						}
					}
				)
			)
		);
		document.body.appendChild(overlay);
	}

	function displayToast(message){
		const toastJob = progressNotify.execute({
			action: 'createJob',
			useToast: true,
			total: 1,
			progress: 1,
			name: message,
		});
		progressNotify.execute({action: 'start', jobId: toastJob.jobId});
		progressNotify.execute({action: 'setStatus', jobId: toastJob.jobId, status: 'success'});
	}

	function displayTooltip(element, text, position = 'top'){
		if(!sessionData.toolTipElement){
			const tooltip = h('div', {
				className: 'MPLU-tooltip-container',
				style: {
					display: 'none',
					position: 'fixed',
					backgroundColor: colors.get("backgroundColor"),
					color: colors.get("fontColor"),
					padding: '8px 12px',
					borderRadius: '5px',
					fontSize: '14px',
					whiteSpace: 'nowrap',
					zIndex: '-4536251',
					pointerEvents: 'none',
					opacity: '0',
					transition: 'opacity 0.2s',
				}
			});
			sessionData.toolTipElement = tooltip;
			document.body.appendChild(tooltip);
		}
		const tooltip = sessionData.toolTipElement;
		tooltip.textContent = text;
		tooltip.style.opacity = '1';
		tooltip.style.display = 'block';
		tooltip.style.zIndex = '1736514362';
		const elementRect = element.getBoundingClientRect();
		switch(position){
			case 'top':
				tooltip.style.left = `${elementRect.left + (element.offsetWidth / 2) - (tooltip.offsetWidth / 2)}px`;
				tooltip.style.top = `${elementRect.top - tooltip.offsetHeight - 8}px`;
				break;
			case 'bottom':
				tooltip.style.left = `${elementRect.left + (element.offsetWidth / 2) - (tooltip.offsetWidth / 2)}px`;
				tooltip.style.top = `${elementRect.bottom + 8}px`;
				break;
			case 'left':
				tooltip.style.left = `${elementRect.left - tooltip.offsetWidth - 8}px`;
				tooltip.style.top = `${elementRect.top + (element.offsetHeight / 2) - (tooltip.offsetHeight / 2)}px`;
				break;
			case 'right':
				tooltip.style.left = `${elementRect.right + 8}px`;
				tooltip.style.top = `${elementRect.top + (element.offsetHeight / 2) - (tooltip.offsetHeight / 2)}px`;
				break;
		}
		tooltip.style.pointerEvents = 'auto';
	}

	function hideTooltip(){
		if(sessionData.toolTipElement){
			sessionData.toolTipElement.style.opacity = '0';
			sessionData.toolTipElement.style.pointerEvents = 'none';
			setTimeout(() => {
				if(sessionData.toolTipElement){
					sessionData.toolTipElement.style.display = 'none';
					sessionData.toolTipElement.style.zIndex = '-4536251';
				}
			}, 200);
		}
	}

	/**
	 * 指定された並列数でタスクを実行
	 * @param {Array<Function>} tasks - 実行するタスク配列（async関数）
	 * @param {number} concurrency - 並列実行数
	 * @returns {Promise<Array>} - 結果の配列（元の順序を保持）
	 */
	async function parallelTask(tasks, concurrency = 6){
		const results = new Array(tasks.length);
		let cursor = 0;
		async function worker(){
			while(cursor < tasks.length){
				const index = cursor++;
				try{
					results[index] = await tasks[index]();
				}catch(error){
					results[index] = { error, index };
				}
			}
		}
		const workers = Array.from({ length: concurrency }, () => worker());
		await Promise.all(workers);
		return results;
	}

	function waitElementAndGet({query, searchFunction = 'querySelector', interval = 100, retry = 25, searchPlace = document, faildToThrow = false} = {}){
		if(!query)throw(`query is needed`);
		return new Promise((resolve, reject) => {
			const MAX_RETRY_COUNT = retry;
			let retryCounter = 0;
			let searchFn;

			switch(searchFunction){
				case 'querySelector':
					searchFn = () => searchPlace.querySelector(query);
					break;
				case 'getElementById':
					searchFn = () => searchPlace.getElementById(query);
					break;
				case 'XPath':
					searchFn = () => {
						let section = document.evaluate(query, searchPlace, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
						return section;
					};
					break;
				case 'XPathAll':
					searchFn = () => {
						let sections = document.evaluate(query, searchPlace, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
						let result = [];
						for(let i = 0; i < sections.snapshotLength; i++){
							result.push(sections.snapshotItem(i));
						}
						if(result.length >= 1)return result;
					};
					break;
				default:
					searchFn = () => searchPlace.querySelectorAll(query);
			}
			const setIntervalId = setInterval(findTargetElement, interval);

			function findTargetElement(){
				retryCounter++;
				if(retryCounter > MAX_RETRY_COUNT){
					clearInterval(setIntervalId);
					if(faildToThrow){
						return reject(`Max retry count (${MAX_RETRY_COUNT}) reached for query: ${query}`);
					}else{
						console.warn(`Max retry count (${MAX_RETRY_COUNT}) reached for query: ${query}`);
						return resolve(null);
					}
				}
				let targetElements = searchFn();
				if(targetElements && (!(targetElements instanceof NodeList) || targetElements.length >= 1)){
					clearInterval(setIntervalId);
					return resolve(targetElements);
				}
			}
		});
	}

	async function request({url, method = 'GET', responseType = 'json', headers = {}, dontUseGenericHeaders = false, body = null, anonymous = false, cookie = null, maxRetries = 0, timeout = 60000, onlyResponse = true} = {}){
		if(!url)throw('url is not defined');

		const requestObject = {
			method,
			responseType,
			url,
			headers: dontUseGenericHeaders ? headers : Object.assign({
				'Content-Type': '*/*',
				'Accept-Encoding': 'zstd, br, gzip, deflate',
				'User-agent': userAgent,
				'Accept': '*/*',
				'Referer': url,
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				...(cookie ? {'Cookie': cookie} : {}),
			}, headers),
			body,
			anonymous,
		};

		for(let retryCount = 0; retryCount <= maxRetries; retryCount++){
			try{
				const response = await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: requestObject.method,
						url: requestObject.url,
						headers: requestObject.headers,
						responseType: requestObject.responseType,
						data: requestObject.body,
						anonymous: requestObject.anonymous,
						timeout: timeout,
						onload: function(responseDetails){
							if(responseDetails.status >= 200 && responseDetails.status < 300){
								if(onlyResponse == false || method == 'HEAD'){
									return resolve(responseDetails);
								}else{
									return resolve(responseDetails.response);
								}
							}else if(responseDetails.status >= 500 || responseDetails.status === 429){
								console.warn(`Retrying due to response status: ${responseDetails.status}`);
								return reject({
									function_name: 'request',
									reason: `Server error or too many requests (status: ${responseDetails.status})`,
									response: responseDetails,
									requestObject: requestObject
								});
							}else{
								console.error({
									function_name: 'request',
									reason: `status: ${responseDetails.status}`,
									requestObject,
									response: responseDetails
								});
								return reject({
									function_name: 'request',
									reason: `status: ${responseDetails.status}`,
									requestObject,
									response: responseDetails
								});
							}
						},
						ontimeout: function(responseDetails){
							console.warn(responseDetails);
							return reject({
								function_name: 'request',
								reason: 'time out',
								response: responseDetails,
								requestObject: requestObject
							});
						},
						onerror: function(responseDetails){
							console.warn(responseDetails);
							return reject({
								function_name: 'request',
								reason: 'error',
								response: responseDetails,
								requestObject: requestObject
							});
						}
					});
				});
				return response;
			}catch(error){
				console.warn({
					error: error,
					url: requestObject.url,
					Retry: retryCount + 1,
					object: requestObject,
				});
				if(retryCount === maxRetries){
					throw({
						error: error,
						url: requestObject.url,
						Retry: retryCount + 1,
						object: requestObject,
					});
				}
			}
		}
	}

	/** @type {Set<string>} */
	const svgTags = new Set([
		// 基本構造
		"svg","g","defs","use","symbol","title","desc",
		// 図形
		"path","rect","circle","ellipse","line","polyline","polygon",
		// テキスト
		"text","tspan","textPath",
		// クリッピング・マスキング
		"clipPath","mask","pattern","marker",
		// グラデーション
		"linearGradient","radialGradient","stop",
		// フィルター
		"filter","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix",
		"feDiffuseLighting","feDisplacementMap","feDropShadow","feFlood","feGaussianBlur",
		"feImage","feMerge","feMergeNode","feMorphology","feOffset","feSpecularLighting",
		"feTile","feTurbulence",
		// アニメーション
		"animate","animateTransform","animateMotion","mpath","set",
		// その他
		"image","foreignObject","style","metadata"
	]);
	/**
	 * @template {keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | "fragment"} K
	 * @param {K} tag
	 * @param {(K extends keyof SVGElementTagNameMap
	 *   ? Partial<SVGElementTagNameMap[K]>
	 *   : Partial<HTMLElementTagNameMap[K]>) & Record<string, any>} [props]
	 * @param {...(Node|string|number|boolean|null|undefined|(Node|string|number|boolean|null|undefined)[])} children
	 * @returns {K extends keyof SVGElementTagNameMap ? SVGElementTagNameMap[K] : HTMLElementTagNameMap[K]}   
	*/
	function h(tag, props = {}, ...children){
		const isSvg = svgTags.has(tag);
		const ns = isSvg ? "http://www.w3.org/2000/svg" : undefined;
		const el = tag === "fragment"
		? document.createDocumentFragment()
		: ns
			? document.createElementNS(ns, tag)
			: document.createElement(tag);
		for(const key in props){
			const val = props[key];
			if(key === "style" && typeof val === "object"){
				Object.assign(el.style, val);
			}else if(key === "className"){
				if(ns){
					el.setAttribute("class", val);
				}else{
					el.className = val;
				}
			}else if(key === "textContent" || key === "innerText"){
				el[key] = val;
			}else if(key.startsWith("on") && typeof val === "function"){
				el.addEventListener(key.slice(2).toLowerCase(), val);
			}else if(key === "dataset" && typeof val === "object"){
				for(const dataKey in val){
					if(val[dataKey] != null){
						el.dataset[dataKey] = val[dataKey];
					}
				}
			}else if(key === "ref" && typeof val === "function"){
				val(el); // 作成直後のDOMノードを渡す
			}else if(key.startsWith("data-")){
				const prop = key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()); // dataset
				el.dataset[prop] = val;
			}else if(key.startsWith("aria-") || key === "role"){
				el.setAttribute(key, val); // 強制的に属性にする
			}else if(key in el && !isSvg){
				el[key] = val; // DOMプロパティ
			}else{
				el.setAttribute(key, val); // その他属性
			}
		}
		for(let i = 0; i < children.length; i++){
			const child = children[i];
			if(Array.isArray(child)){
				for(const nested of child){
					if(nested == null || nested === false)continue; // nullやfalseは無視
					el.appendChild(typeof nested === "string" || typeof nested === "number"
						? document.createTextNode(nested)
						: nested);
				}
			}else if(child != null && child !== false){
				el.appendChild(typeof child === "string" || typeof child === "number"
					? document.createTextNode(child)
					: child);
			}
		}
		return el;
	}

	async function getVips(){
		// @require			https://raw.githubusercontent.com/Happy-come-come/wasm-tools/refs/heads/master/libvips/vips.js
		// @resource		vipsWasm https://raw.githubusercontent.com/Happy-come-come/wasm-tools/refs/heads/master/libvips/vips.wasm
		if(!sessionData.vips)sessionData.vips = {};
		if(sessionData.vips.instance)return sessionData.vips.instance;
		if(sessionData.vips.initPromise)return sessionData.vips.initPromise;
		sessionData.vips.initPromise = (async () => {
			const wasmURL = GM_getResourceURL("vipsWasm");
			const wasmArrayBuffer = await (await fetch(wasmURL)).arrayBuffer();
			const vips = await Vips({
				wasmBinary: wasmArrayBuffer,
				locateFile(path){
					if(path.endsWith(".wasm"))return wasmURL;
					return path;
				}
			});
			console.log("Vips initialized");
			debug({"Vips version:": vips.version(), instance: vips});
			sessionData.vips.instance = vips;
			return vips;
		})();
		return sessionData.vips.initPromise;
	}

	function destroyVips(){
		if(sessionData.vips && sessionData.vips.instance){
			sessionData.vips.instance = null;
			sessionData.vips.initPromise = null;
			sessionData.vips = null;
			console.log("Vips instance resources released");
		}
	}

	async function getImageMagick(){
		if(!sessionData.imageMagick)sessionData.imageMagick = {};
		if(sessionData.imageMagick.instance)return sessionData.imageMagick.instance;
		if(sessionData.imageMagick.initPromise)return sessionData.imageMagick.initPromise;
		sessionData.imageMagick.initPromise = (async () => {
			const wasmURL = GM_getResourceURL("magickWasm");
			const wasm = await (await fetch(wasmURL)).arrayBuffer();
			const wasmBlobURL = URL.createObjectURL(new Blob([wasm], { type: 'application/wasm' }))
			const magickJsURL = GM_getResourceURL("magickJs");
			const magickJs = await (await fetch(magickJsURL)).text();
			const imageMagick = await ImageMagick();
			await imageMagick.init(magickJs, wasmBlobURL);
			URL.revokeObjectURL(wasmBlobURL);
			console.log("ImageMagick initialized");
			debug({instance: imageMagick});
			sessionData.imageMagick.instance = imageMagick;
			return imageMagick;
		})();
		return sessionData.imageMagick.initPromise;
	}

	async function measurePromise(promise, label = "Promise"){
		if(!promise)return;
		const start = performance.now();
		const result = await promise;
		const end = performance.now();
		debug(`${label}: ${(end - start).toFixed(2)} ms`);
		return result;
	}

	async function createSettingsPage(){
		const pages = {nodes: {}, display: null}
		const settingTargetsArray = [
			{
				targetName: "makePixivLittleUseful",
				displayName: envTextData.makePixivLittleUseful.settings.displayName,
				pageGenerateFunction: createMakePixivLittleUsefulSettingsPage,
				settingsNode: null,
				isFunction: false
			},
			{
				targetName: "webhookBringsArtworkToDiscord",
				displayName: envTextData.webhookBringsArtworkToDiscord.settings.displayName,
				pageGenerateFunction: createWebhookBringsArtworkToDiscordSettingsPage,
				settingsNode: null,
				isFunction: true,
				specificSave: ()=>{}
			},
			{
				targetName: "advancedSettings",
				displayName: envTextData.advancedSettings.settings.displayName,
				pageGenerateFunction: createAdvancedSettingsPage,
				settingsNode: null,
				isFunction: false
			}
		];
		const settingTargets = settingTargetsArray.reduce((acc, target) => {
			if((target.forPC && !isPC) || (target.forMobile && !isMobile)){
				return acc;
			}
			acc[target.targetName] = target;
			return acc;
		}, {});

		const appendTarget = document.body;
		const closeButton = h('div', {
				className: 'MPLU-svg-button',
				style: {
					position: 'absolute',
					top: '10px',
					right: '10px',
					width: '24px',
					height: '24px',
					padding: '4px',
					borderRadius: '4px',
				},
				onclick: () => {
					settingsPage.remove();
				},
				innerHTML: `
					<svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				`
			}
		);

		const saveButton = h('button', {
				className: 'MPLU-settings-save-button',
				style: {
					display: 'flex',
					position: 'fixed',
					bottom: '8vh',
					right: '4vw',
					width: '4vw',
					height: '4vw',
					minWidth: '60px',
					minHeight: '60px',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer',
					borderRadius: '50%',
					backgroundColor: 'var(--MPLU-twitter-blue)',
					zIndex: '4536251',
				},
				onclick: () => {
					retrieveSettings();
				},
			},
			h('svg', {
					viewBox: '0 0 611.923 611.923',
					style: {
						width: '70%',
						height: '70%',
					}
				},
				h('path', {
						d: 'M606.157,120.824L489.908,4.575c-2.46-2.46-6.612-4.152-10.764-4.152H434.32H175.988H40.672 C18.222,0.423,0,18.721,0,41.095v529.734c0,22.45,18.298,40.672,40.672,40.672h86.341h368.661h75.577 c22.45,0,40.672-18.299,40.672-40.672V131.665C611.077,128.359,609.463,124.207,606.157,120.824z M419.328,31.177v136.162 c0,0.846-0.846,0.846-0.846,0.846h-42.363V31.177H419.328z M344.596,31.177v137.008H192.595c-0.846,0-0.846-0.846-0.846-0.846 V31.177H344.596z M141.929,580.9V390.688c0-35.674,29.062-64.737,64.737-64.737h208.434c35.674,0,64.737,29.062,64.737,64.737 v190.135H141.929V580.9z M580.401,570.905c0,4.997-4.152,9.995-9.995,9.995h-59.816V390.688c0-52.281-43.209-95.49-95.49-95.49 H207.511c-52.281,0-95.49,43.209-95.49,95.49v190.135H40.595c-4.997,0-9.995-4.152-9.995-9.995V41.095 c0-4.997,4.152-9.995,9.995-9.995h120.401v136.162c0,17.453,14.147,31.523,31.523,31.523h225.886 c17.453,0,31.523-14.147,31.523-31.523V31.177h23.219l107.1,107.1L580.401,570.905L580.401,570.905z M422.634,490.33 c0,8.304-6.612,14.916-14.916,14.916H217.506c-8.304,0-14.916-6.612-14.916-14.916c0-8.303,6.612-14.916,14.916-14.916h189.289 C415.945,475.415,422.634,482.027,422.634,490.33z M422.634,410.678c0,8.303-6.612,14.916-14.916,14.916H217.506 c-8.304,0-14.916-6.612-14.916-14.916s6.612-14.916,14.916-14.916h189.289C415.945,394.84,422.634,401.529,422.634,410.678z',
					}
				)
			),
		);

		const headerText = h('div', {
				className: 'MPLU-settings-header-text MPLU-fontColor',
				style: {
					height: '100%',
					width: '100%',
					fontSize: '2.5em',
					fontWeight: 'bold',
					textAlign: 'center',
					flexShrink: '0',
					userSelect: 'none',
				},
				textContent: envTextData.makePixivLittleUseful.settings.displayName,
			}
		);
		const headerContainer = h('div', {
				className: 'MPLU-settings-header',
				style: {
					display: 'flex',
					width: '100%',
					height: '15%',
					borderBottom: '2px solid var(--MPLU-border-color)',
					flexShrink: '0',
					alignItems: 'center',
				},
			},
			headerText,
		);

		const navigationContainer = h('div', {
				className: 'MPLU-settings-navigation-container',
				style: {
					display: 'flex',
					flexDirection: 'column',
					width: isPC ? 'calc(30% - 2px)' : '70vw',
					height: '100%',
					borderRight: isPC ? '2px solid var(--MPLU-border-color)' : '',
					overflowY: 'auto',
					overflowX: 'hidden',
					overflowWrap: 'break-word',
					boxSizing: 'border-box',
					...(isMobile && {
						position: 'fixed',
						left: '-70vw',
						bottom: '0',
						transition: 'transform 0.1s ease',
						backgroundColor: 'var(--MPLU-background-color-light)',
						zIndex: '17365143',
					}),
				}
			}
		);

		const settingsContainer = h('div', {
				className: 'MPLU-settings-content-container',
				style: {
					display: 'flex',
					flexDirection: 'column',
					width: (isPC ? "40%" : "100%"),
					height: 'calc(100% - 4px)',
					overflowY: 'auto',
					overflowX: 'hidden',
					overflowWrap: 'break-word',
					borderRight: isPC ? `2px solid ${colors.get('borderColor')}` : "",
					boxSizing: 'border-box',
				},
			}
		);

		const mainContainer = h('div', {
				className: 'MPLU-settings-main-container',
				style: {
					display: 'flex',
					flexDirection: 'row',
					width: '100%',
					height: '85%',
				}
			},
			saveButton,
			navigationContainer,
			settingsContainer
		);
		const settingsPage = h('div', {
				className: 'MPLU-container MPLU-settings-page',
				style: {
					display: 'flex',
					position: 'fixed',
					width: '100%',
					height: '100%',
					top: '0',
					left: '0',
					backgroundColor: 'var(--MPLU-background-color-light)',
					color: 'var(--MPLU-font-color)',
					zIndex: '4536251',
					flexDirection: 'column',
				},
			},
			closeButton,
			headerContainer,
			mainContainer
		);
		let hidemobileNavigationOverlay = ()=>{};
		if(isMobile){
			const mobileNavigationToggleButton = h('button', {
					className: 'MPLU-mobile-navigation-toggle-button',
					style: {
						display: 'flex',
						position: 'fixed',
						top: '3em',
						left: '10px',
						alignItems: 'center',
						justifyContent: 'center',
						width: '2em',
						height: '2em',
						borderRadius: '50%',
					},
					onclick: (e) => {
						e.stopPropagation();
						mobileNavigationOverlay.style.display = 'block';
						navigationContainer.style.transform = 'translateX(70vw)';
					}
				},
				h('svg', {
						viewBox: '0 0 24 24',
					},
					h('path', {
							d: 'M4 7a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM4 12a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM5 16a1 1 0 100 2h14a1 1 0 100-2H5z',
					})
				)
			);
			headerContainer.appendChild(mobileNavigationToggleButton);

			hidemobileNavigationOverlay = () => {
				mobileNavigationOverlay.style.display = 'none';
				navigationContainer.style.transform = 'translateX(0)';
			};
			const mobileNavigationOverlay = h('div', {
					className: 'MPLU-mobile-navigation-overlay',
					style: {
						display: 'none',
						position: 'fixed',
						left: '0',
						top: '0',
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(255, 255, 255, 0.5)',
						zIndex: '1736514',
					},
					onclick: () => {
						hidemobileNavigationOverlay();
					}
				},
			);
			settingsPage.appendChild(mobileNavigationOverlay);
		}

		appendTarget.appendChild(settingsPage);
		sessionData.settingsPage = settingsPage;


		function createNavigationButton(key){
			const currentTarget = settingTargets[key];
			const navButton = h('div', {
					className: 'MPLU-settings-navigation-button',
					dataset: {
						isSelected: 'false',
						targetName: currentTarget.targetName,
					},
					style: {
						display: 'flex',
						width: 'calc(100% - 2px)',
						height: '4em',
						minHeight: '4em',
						borderBottom: '2px solid var(--MPLU-border-color)',
						borderRight: `2px solid ${colors.getWithAlpha("twitterBlue", 0)}`,
						transitionDuration: '0.1s',
					},
					onclick: () => {
						changeTarget(currentTarget.targetName);
					},
					...(()=>{
						if(isMobile)return;
						return {
							onmouseover: onHover,
							onmouseout: restStyle,
							onpointerleave: restStyle,
						}
						function onHover(){
							navButton.style.backgroundColor = 'var(--MPLU-menu-hover-effect)';
						}
						function restStyle(){
							if(navButton.dataset.isSelected === 'true')return;
							navButton.style.backgroundColor = '';
						}
					})(),
				},
				h('div', {
						className: 'MPLU-settings-navigation-button-textWrapper',
						style: {
							display: 'flex',
							width: '85%',
							height: '100%',
							alignItems: 'center',
							justifyContent: 'flex-start',
							boxSizing: 'border-box',
						}
					},
					h('span', {
							className: 'MPLU-settings-navigation-button-text',
							style: {
								userSelect: 'none',
								width: '100%',
								height: '100%',
								margin: '0 0 0 5%',
								lineHeight: '1.2',
								fontSize: '1.5em',
							},
							textContent: currentTarget.displayName,
						}
					)
				),
				h('div', {
						className: 'MPLU-settings-navigation-button-iconWrapper',
						style: {
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							width: '15%',
							color: 'var(--MPLU-font-color-light)',
							boxSizing: 'border-box',
						}
					},
					h('svg', {
							viewBox: '0 0 24 24',
							style: {
								width: '2em',
								height: '2em',
							}
						},
						h('path', {
								d: 'M9 18l6-6-6-6',
								stroke: 'currentColor',
								'stroke-width': '2',
								'stroke-linecap': 'round',
								'stroke-linejoin': 'round',
								fill: 'none',
							}
						)
					)
				)
			);
			return navButton;
		}
		function changeTarget(name = settingTargets.makePixivLittleUseful.targetName){
			if(pages.display)deactivatePage();
			activatePage();
			function activatePage(){
				const targetIndex = pages.nodes[name];
				const targetNavigationButton = targetIndex.navigationButton;
				targetNavigationButton.style.borderRight = `2px solid ${colors.getWithAlpha("twitterBlue", 1)}`;
				targetNavigationButton.style.backgroundColor = 'var(--MPLU-menu-hover-effect)';
				targetNavigationButton.dataset.isSelected = 'true';
				const targetPage = targetIndex.page;
				targetPage.style.display = 'flex';
				targetPage.style.zIndex = '1';
				pages.display = targetIndex;
				if(isMobile)hidemobileNavigationOverlay();
			}
			function deactivatePage(){
				const previousPage = pages.display;
				previousPage.page.style.display = 'none';
				previousPage.navigationButton.style.borderRight = `2px solid ${colors.getWithAlpha("twitterBlue", 0)}`;
				previousPage.page.style.zIndex = '-1';
				previousPage.navigationButton.style.backgroundColor = '';
				previousPage.navigationButton.dataset.isSelected = 'false';
			}
		}

		function createMakePixivLittleUsefulSettingsPage(){
			const settingsTarget = settingTargets.makePixivLittleUseful;
			const scriptSetting = scriptSettings.makePixivLittleUseful;
			const settingText = envTextData.makePixivLittleUseful.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{id: 'functionsToggle', type: 'text', text: settingText.featuresToggle, settingElementStyles: {fontSize: "2em", fontWeight: "400", textAlign: "left"}, isHTML: false},
				...Object.keys(settingTargets)
					.filter(key => settingTargets[key].isFunction)
					.map(key => ({id: key, name: settingTargets[key].displayName, type: 'toggleSwitch', category: "enableFunction"})),
				{id: 'functionsToggleFinBorder', type: 'border'},
				{type: 'text', text: "Language", settingElementStyles: {fontSize: "2em", fontWeight: "400"}, isHTML: false},
				{id: 'language', type: 'dropdown', options: ['ja', 'en'].map(key => ({value: key, displayName: key}))},
			];
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;
		}

		function createWebhookBringsArtworkToDiscordSettingsPage(){
			const settingsTarget = settingTargets.webhookBringsArtworkToDiscord;
			const scriptSetting = scriptSettings.webhookBringsArtworkToDiscord ?? scriptSettings.PtoD;
			const settingText = envTextData.webhookBringsArtworkToDiscord.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			settingsTarget.specificSave = save;
			const settingEntries = [
				{type: 'text', text: settingText.sendAndClose, settingElementStyles: {fontSize: "2em", fontWeight: "400", textAlign: "left"}, isHTML: false},
				{id: 'closeWindowAfterSend', type: 'dropdown', options: ['Yes', 'No'].map(key => ({value: key, displayName: key}))},
				{type: 'text', text: settingText.defaultCaptionOnOff, settingElementStyles: {fontSize: "2em", fontWeight: "400", textAlign: "left"}, isHTML: false},
				{id: 'captionOnOff', type: 'dropdown', options: ['Yes', 'No'].map(key => ({value: key, displayName: key}))},
			];
			page.appendChild(createSettingsElement({id: 'webhooks', type: 'text', text: settingText.webhooks, settingElementStyles: {fontSize: "2em", fontWeight: "400", textAlign: "left"}, isHTML: false}, scriptSetting).container);
			const webhooksContainer = createSettingsElement({type: 'container', containerStyles: {flexDirection: 'column', borderTop: '1px solid var(--MPLU-border-color)', borderBottom: '1px solid var(--MPLU-border-color)'}});
			(scriptSetting?.data ? scriptSetting.data : []).forEach((s, i)=>{
				createWebhookSettingElement(s.name, `https://discord.com/api/webhooks/${atob(s.value)}`, i === 0 ? 'top' : '');
			});
			if(!scriptSetting?.data || (scriptSetting?.data.length === 0)){
				createWebhookSettingElement();
			}
			page.appendChild(webhooksContainer);
			new Sortable(webhooksContainer, {
				animation: 150,//アニメーションのスピード
				ghostClass: 'sortable-ghost',//ドラッグ中の要素に付与されるクラス
				handle: '.handle',//並び替えが可能な部分（クラス名）を指定
				filter: 'input', // テキストボックス部分を除外
				preventOnFilter: false, // テキストボックスのクリック動作を許可
				onStart: (evt) => {
					// テキストボックスがフォーカスされている場合はドラッグをキャンセル
					if(evt.item.querySelector('input:focus')){
						evt.preventDefault();
					}
				}
			});

			page.appendChild(createSettingsElement({type: "button", text: "+", settingElementStyles: {position: "left"} , events: {onclick: ()=>{createWebhookSettingElement()}}}, scriptSetting).container);
			page.appendChild(createSettingsElement({type: 'text', text: settingText.defaultWebhook, settingElementStyles: {fontSize: "2em", fontWeight: "400", textAlign: "left"}, isHTML: false}, scriptSetting).container);
			const defaultWebhookDropdown = createSettingsElement({id: 'defaultWebhook', type: 'dropdown', options: getValueFromObjectByPath(scriptSetting?.data, "name", []).map(key => ({value: key, displayName: key}))}, scriptSetting);
			page.appendChild(defaultWebhookDropdown.container);
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;

			function save(){
				const save = [];
				webhooksContainer.querySelectorAll('[data-webhook-Row="true"]').forEach(s=>{
					const name = s.querySelector('.MPLU-webhook-name-input').value;
					const webhook = s.querySelector('.MPLU-webhook-url-input').value;
					if(name && webhook){
						if(webhook.match(/^https\:\/\/discord\.com\/api\/webhooks\/[\d]+\/[\w-]+$/)){
							save.push({name: name, value: btoa(webhook.replace(/^https\:\/\/discord\.com\/api\/webhooks\//,''))});
						}
					}
				});
				if(!scriptSettings[settingsTarget.targetName])scriptSettings[settingsTarget.targetName] = {};
				scriptSettings[settingsTarget.targetName].data = save;
				defaultWebhookDropdown.element.innerHTML = "";
				(scriptSetting.data?.length > 0 ? scriptSetting.data : []).forEach((opt, index) => {
					const option = document.createElement('option');
					option.value = index;
					option.text = opt.name;
					if(scriptSetting.defaultWebhook == index){
						option.selected = true;
					}
					defaultWebhookDropdown.element.appendChild(option);
				});
			}

			function createWebhookSettingElement(name = '', url = '', position = ''){
				const nameInput = h('input', {
						type: 'text',
						className: 'MPLU-webhook-name-input',
						dataset: {
							webhookInput: 'name',
						},
						value: name,
						style: {
							maxWidth: '10em',
							...(isMobile ? {width: '5em'} : {}),
						},
						oninput: () => {
							validateInputs(nameInput, urlInput);
						}
					}
				);

				const urlInput = h('input', {
						type: 'text',
						className: 'MPLU-webhook-url-input',
						dataset: {
							webhookInput: 'url',
						},
						value: url,
						style: {
							maxWidth: '10em',
							...(isMobile ? {width: '5em'} : {}),
						},
						oninput: () => {
							validateInputs(nameInput, urlInput);
						}
					}
				);

				const container = h('div', {
						className: 'MPLU-webhook-setting-wrapper',
						style: {
							display: 'flex',
							width: '100%',
							height: '2em',
							alignItems: 'center',
							justifyContent: 'space-between',
							flexShrink: '0',
							minHeight: '0px',
							...(position !== 'top' ? {borderTop: '1px solid var(--MPLU-border-color)'} : {})
						}
					},
					h('div', {
							className: 'MPLU-webhook-setting-element handle',
							dataset: {
								webhookRow: 'true',
							},
							style: {
								display: 'flex',
								flexWrap: 'wrap',
								width: '100%',
								alignItems: 'center',
								justifyContent: 'flex-start',
							},
						},
						h('div', {
								className: 'MPLU-webhook-name-container',
								style: {
									display: 'flex',
									margin: '0 2% 0 0'
								}
							},
							h('label', {
									textContent: "Name:",
									style: {
										fontSize: '1.2em',
									}
								}
							),
							nameInput
						),
						h('div', {
								className: 'MPLU-webhook-url-container',
								style: {
									display: 'flex',
								}
							},
							h('label', {
									textContent: "URL:",
									style: {
										fontSize: '1.2em',
									}
								}
							),
							urlInput
						)
					),
					h('button', {
							className: 'MPLU-webhook-delete-button MPLU-svg-button',
							textContent: '✕',
							onclick: () => {
								container.remove();
							},
						}
					),
				);

				webhooksContainer.appendChild(container);
			}
			function validateInputs(nameInput, urlInput){
				const webhookPattern = /^https:\/\/discord\.com\/api\/webhooks\/[\d]+\/[\w-]+$/;
				const isNameFilled = nameInput.value.trim() !== "";
				const isWebhookValid = webhookPattern.test(urlInput.value);

				// Nameフィールドが空の場合の警告
				if(isNameFilled && !urlInput.value){
					nameInput.style.backgroundColor = 'red';
					urlInput.style.backgroundColor = '';
				}else{
					nameInput.style.backgroundColor = '';
				}
				// NameとWebhookの片方が空のときに警告
				if(isNameFilled && !urlInput.value || (!isNameFilled && urlInput.value.trim() !== "")){
					nameInput.style.backgroundColor = 'red';
					urlInput.style.backgroundColor = 'red';
				}else{
					nameInput.style.backgroundColor = '';
					urlInput.style.backgroundColor = '';
				}
				// Webhookフィールドの正規表現チェックと警告
				if(!isWebhookValid && urlInput.value.trim() !== ""){
					urlInput.style.backgroundColor = 'red';
				}else{
					urlInput.style.backgroundColor = '';
				}
				const allNameInputs = document.querySelectorAll('input[data-webhook-input="name"]');
				const nameValues = Array.from(allNameInputs).map(input => input.value.trim());
				const isNameDuplicate = nameValues.filter(value => value === nameInput.value.trim()).length > 1;

				if(isNameDuplicate){
					nameInput.style.backgroundColor = 'red';
				}else if(isNameFilled){
					nameInput.style.backgroundColor = '';
				}
			}
		}
		function createAdvancedSettingsPage(){
			const settingsTarget = settingTargets.advancedSettings;
			const settingText = envTextData.advancedSettings.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{type: 'text', text: settingText.exportSettings, settingElementStyles: {fontSize: "2em", fontWeight: "400", textAlign: "left"}, isHTML: false},
				{id: 'exportSettings', type: 'button', text: settingText.exportButtonText, settingElementStyles: {width: '10em', height: '2em'} , events: {onclick: exportSettings}},
				{type: 'text', text: settingText.importSettings, settingElementStyles: {fontSize: "2em", fontWeight: "400", textAlign: "left"}, isHTML: false},
				{id: 'importSettings', type: 'button', text: settingText.importButtonText, settingElementStyles: {width: '10em', height: '2em'} , events: {onclick: importSettings}},
			];
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], null).container);
			}
			return page;
			function exportSettings(){
				const exportData = {...scriptSettings, "データチェック": "まどろみの淵で私は優しい夢を見る"};
				const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
				const downloadAnchorNode = document.createElement('a');
				downloadAnchorNode.setAttribute("href", dataStr);
				downloadAnchorNode.setAttribute("download", "MPLU_settings_" + new Date().toISOString().slice(0,10) + ".json");
				document.body.appendChild(downloadAnchorNode);
				downloadAnchorNode.click();
				downloadAnchorNode.remove();
			}
			function importSettings(){
				const fileInput = document.createElement('input');
				fileInput.type = 'file';
				fileInput.accept = '.json,application/json';
				fileInput.onchange = (event) => {
					const file = event.target.files[0];
					const reader = new FileReader();
					reader.onload = async (e) => {
						try{
							const importedSettings = JSON.parse(e.target.result);
							if(importedSettings["データチェック"] !== "まどろみの淵で私は優しい夢を見る"){
								customAlert(envTextData.advancedSettings.settings.importErrorAlert);
								return;
							}
							delete importedSettings["データチェック"];
							scriptSettings = importedSettings;
								await saveSettings();
								customAlert(envTextData.advancedSettings.settings.importSuccessAlert);
							settingsPage.remove();
							createSettingsPage();
						}catch(error){
							customAlert(envTextData.advancedSettings.settings.importErrorAlert);
							return;
						}
					}
					reader.readAsText(file);
				}
				document.body.appendChild(fileInput);
				fileInput.click();
				fileInput.remove();
			}
		}

		function createSettingsPageTemplate(name){
			const settingsPageContainer = h('div', {
					className: 'MPLU-settings-page-container',
					dataset: {
						settingsPageTarget: name,
					},
					style: {
						width: '100%',
						height: '100%',
						overflowY: 'auto',
						zIndex: '-1',
						display: 'none',
						flexDirection: 'column',
						paddingBottom: '10em',
						flexShrink: '0',
						minHeight: '0px',
					}
				}
			);
			return settingsPageContainer;
		}
		function createSettingsElement(setting, storedValue){
			let currentValue;
			if(!storedValue){
				currentValue = setting.defaultValue;
			}else if(setting.category){
				// 深いネストがある場合に対応
				currentValue = getValueFromObjectByPath(storedValue,`${setting.category}.${setting.id}`, setting.defaultValue);
			}else{
				currentValue = storedValue ? storedValue[setting.id] ?? setting.defaultValue : setting.defaultValue ?? undefined;
			}
			const settingWrapper = h('div', {
				className: 'MPLU-settings-element',
				style: {
					display: 'flex',
					height: 'fit-content',
					width: '96%',
					overflowX: 'hidden',
					overflowWrap: 'break-word',
					marginLeft: '2%',
					marginTop: '0.5em',
					marginRight: '2%',
					flexShrink: '0',
					minHeight: '0px',
					...setting.containerStyles,
				},
			});
			let settingElement;
			switch(setting.type){
				case 'radioButton':
					settingElement = radioButton();
					break;
				case 'textBox':
					settingElement = textBox();
					break;
				case 'toggleSwitch':
					settingElement = toggleSwitch();
					break;
				case 'dropdown':
					settingElement = dropdown();
					break;
				case 'border':
					settingElement = border();
					break;
				case 'text':
					settingElement = text();
					break;
				case 'container':
					return settingWrapper;
					break;
				case 'button':
					settingElement = button();
					break;
				default:
					console.error('Unknown setting');
					console.error({settingOBJ: setting, storedValues: storedValue});
					return null;
			}
			settingWrapper.appendChild(settingElement);
			return {container:settingWrapper, element: settingElement};

			function radioButton(){
				const radioButtonWrapper = h('div', {
						className: 'MPLU-settings-radioButton-wrapper',
						dataset: {
							settingId: setting.id,
							type: 'radioButton',
							category: setting.category ?? '',
							needSave: 'true',
						},
						style: {
							display: 'flex',
						}
					},
					(()=>{
						return setting.options.map((option) => {
							return h('label', {
									className: 'MPLU-settings-radioButton-label',
									textContent: option.displayName,
								},
								h('input', {
										style: {
											marginLeft: '1em',
										},
										type: 'radio',
										name: setting.id,
										value: option.value,
										checked: currentValue === option.value,
									}
								)
							);
						});
					})(),
				);
				return radioButtonWrapper;
			}
			function textBox(){
				const textBoxElement = h('input', {
						className: 'MPLU-settings-textBox',
						dataset: {
							settingId: setting.id,
							type: 'textBox',
							category: setting.category ?? '',
							needSave: 'true',
						},
						style: {
							width: '100%',
							boxSizing: 'border-box',
							...setting.settingElementStyles,
						},
						value: currentValue,
					}
				);
				return textBoxElement;
			}
			function toggleSwitch(){
				const toggleSwitchWrapper = h('div', {
						className: 'MPLU-settings-toggleSwitch-wrapper',
						dataset: {
							settingId: setting.id,
							type: 'toggleSwitch',
							category: setting.category ?? '',
							needSave: 'true',
							isSelected: currentValue ? 'true' : 'false',
						},
						style: {
							display: 'flex',
							alignItems: 'center',
							width: '100%',
							margin: '10px 0',
							justifyContent: 'left',
							fontSize: '1.5em',
							...setting.settingElementStyles,
						}
					},
					h('div',{
							className: 'MPLU-settings-toggleSwitch-inputWrapper',
							style: {
								position: 'relative',
								width: '50px',
								height: '20px',
								backgroundColor: currentValue ? '#4CAF50' : '#ccc',
								borderRadius: '30px',
								cursor: 'pointer',
								transition: 'background-color 0.2s',
							},
							onclick: (e) => {
								const isSelected = toggleSwitchWrapper.dataset.isSelected === 'true';
								toggleSwitchWrapper.dataset.isSelected = (!isSelected).toString();
								const slider = e.currentTarget.querySelector('.MPLU-settings-toggleSwitch-slider');
								if(isSelected){
									e.currentTarget.style.backgroundColor = '#ccc';
									slider.style.left = '2px';
								}else{
									e.currentTarget.style.backgroundColor = '#4CAF50';
									slider.style.left = '32px';
								}
							}
						},
						h('div', {
								className: 'MPLU-settings-toggleSwitch-slider',
								style: {
									position: 'absolute',
									top: '2px',
									left: currentValue ? '32px' : '2px',
									width: '16px',
									height: '16px',
									backgroundColor: 'white',
									borderRadius: '50%',
									transition: 'left 0.2s',
								}
							}
						)
					),
					h('label', {
							className: 'MPLU-settings-toggleSwitch-label',
							textContent: setting.name,
							style: {
								flex: '1',
								fontSize: '1.5em',
								margin: '0 0 0 5%',
								userSelect: 'none',
							}
						}
					),
				);
				return toggleSwitchWrapper;
			}
			function dropdown(){
				const dropdownElement = h('select', {
						className: 'MPLU-settings-dropdown',
						dataset: {
							settingId: setting.id,
							type: 'dropdown',
							category: setting.category ?? '',
							needSave: 'true',
						},
						style: {
							width: 'fit-content',
							boxSizing: 'border-box',
							...setting.settingElementStyles,
						},
						value: currentValue,
					},
					(()=>{
						return setting.options.map((option) => {
							return h('option', {
									value: option.value,
									textContent: option.displayName,
									selected: currentValue === option.value,
								}
							);
						})
					})(),
				);
				return dropdownElement;
			}
			function border(){
				const borderElement = h('hr', {
						className: 'MPLU-settings-borderWrapper',
						style: {
							width: '100%',
							margin: '0',
							...setting.settingElementStyles,
						}
					}
				);
				return borderElement;
			}
			function text(){
				const textElement = h('div', {
						className: 'MPLU-settings-text',
						dataset: {
							settingId: setting.id,
							type: 'text',
							needSave: 'false',
						},
						style: {
							width: '100%',
							overflowY: 'hidden',
							...setting.settingElementStyles,
						},
						...(()=>{
							if(setting.isHTML){
								return {
									innerHTML: setting.text,
								}
							}else{
								return {
									textContent: setting.text,
								}
							}
						})(),
					}
				);
				return textElement;
			}
			function button(){
				const buttonElement = h('button', {
						className: 'MPLU-settings-button MPLU-button',
						style: {
							width: '1.5em',
							height: '1.5em',
							...setting.settingElementStyles
						},
						textContent: setting.text,
						...setting.events,
					}
				);
				settingWrapper.style.overflow = 'hidden';
				return buttonElement;
			}
		}
		async function retrieveSettings(){
			for(let key of Object.keys(settingTargets)){
				if(settingTargets[key].needSave === false)continue;
				const save = {};
				const node = settingTargets[key].settingsNode;
				node.querySelectorAll('[data-need-save="true"]').forEach(s=>{
					const id = s.dataset.settingId;
					const category = s.dataset.category;
					const type = s.dataset.type;
					let value, selectedRadio;
					switch(type){
						case 'radioButton':
							selectedRadio = s.querySelector(`input:checked`);
							value = selectedRadio ? selectedRadio.value : null;
							break;
						case 'textBox':
							value = s.value;
							break;
						case 'toggleSwitch':
							value = (s.dataset.isSelected == 'true') ? true : false;
							break;
						case 'dropdown':
							value = s.value;
							break;
					}
					if(category && category !== "undefined"){
						// "hoge.fuga" のようなカテゴリを "." で分割
						const keys = category.split('.');

						// ネストされたオブジェクトを作成する
						keys.reduce((acc, key, index) => {
							if(index === keys.length - 1){
								// 最後のキーなら、value を設定
								if(!acc[key])acc[key] = {};
								acc[key][id] = value;
							}else{
								// まだ最終階層に達していない場合、次の階層を作成
								if(!acc[key])acc[key] = {};
							}
							return acc[key];
						}, save);
					}else{
						// category がない場合、普通に {id: value} を保存
						save[id] = value;
					}
					scriptSettings[key] = save;
				});
				if(settingTargets[key].specificSave)settingTargets[key].specificSave();
			}
			await saveSettings();
			_i18n();
			displayToast("セーブ完了",1000);
		}
		function generatePages(){
			for(let key of Object.keys(settingTargets)){
				const node = settingTargets[key].pageGenerateFunction();
				settingsContainer.appendChild(node);
				settingTargets[key].settingsNode = node;
				const padding = h('div', {style: {height: "100px", flexShrink: "0"}});
				node.appendChild(padding);
				const navigationButton = createNavigationButton(key);
				navigationContainer.appendChild(navigationButton);
				pages.nodes[key] = {
					page: node,
					navigationButton: navigationButton,
				};
			}
		}
		generatePages();
		changeTarget();
	}
	GM_registerMenuCommand('script settings', createSettingsPage);

	class DiscordEmbedBuilder {
		// 参考: https://github.com/discordjs/discord.js/tree/main/packages/builders/src/messages/embed
		// Embed.ts
		data;
		get fields(){
			return this.data.fields;
		}
		constructor(data = {}){
			this.data = {
				...structuredClone(data),
				author: data.author && new DiscordEmbedBuilder.EmbedAuthorBuilder(data.author),
				fields: data.fields?.map((field) => new DiscordEmbedBuilder.EmbedFieldBuilder(field)) ?? [],
				footer: data.footer && new DiscordEmbedBuilder.EmbedFooterBuilder(data.footer)
			};
		}

		addFields(...fields){
			const normalizedFields = DiscordEmbedBuilder.Functions.normalizeArray(fields);
			const resolved = normalizedFields.map((field) => DiscordEmbedBuilder.Functions.resolveBuilder(field, DiscordEmbedBuilder.EmbedFieldBuilder));
			this.data.fields.push(...resolved);
			return this;
		}
		spliceFields(index, deleteCount, ...fields){
			const resolved = fields.map((field) => DiscordEmbedBuilder.Functions.resolveBuilder(field, DiscordEmbedBuilder.EmbedFieldBuilder));
			this.data.fields.splice(index, deleteCount, ...resolved);
			return this;
		}
		setFields(...fields){
			this.spliceFields(0, this.data.fields.length, ...DiscordEmbedBuilder.Functions.normalizeArray(fields));
			return this;
		}
		setAuthor(options){
			this.data.author = DiscordEmbedBuilder.Functions.resolveBuilder(options, DiscordEmbedBuilder.EmbedAuthorBuilder);
			return this;
		}
		updateAuthor(updater){
			updater(this.data.author ??= new DiscordEmbedBuilder.EmbedAuthorBuilder());
			return this;
		}
		clearAuthor(){
			this.data.author = undefined;
			return this;
		}
		setColor(color){
			if(typeof color === 'string'){
				if(color.startsWith('#')){
					// #RRGGBB or #AARRGGBB
					if(color.length === 7){
						// #RRGGBB
						color = parseInt(color.slice(1), 16);
					}else if (color.length === 9){
						// #AARRGGBB
						color = parseInt(color.slice(3), 16);
					}else{
						throw new Error('Invalid hex color format');
					}
				}else if(color.startsWith('rgb')){
					// rgb(r, g, b) or rgba(r, g, b, a)
					const rgb = color.match(/\d+/g);
					if(rgb && rgb.length >= 3){
						color = (parseInt(rgb[0]) << 16) + (parseInt(rgb[1]) << 8) + parseInt(rgb[2]);
					}else{
						throw new Error('Invalid RGB color format');
					}
				}else{
					throw new Error('Invalid color format');
				}
			}else if(typeof color !== 'number' || color < 0 || color > 0xFFFFFF){
				throw new Error('Color must be a valid number between 0 and 16777215');
			}
			this.data.color = color;
			return this;
		}
		clearColor(){
			this.data.color = undefined;
			return this;
		}
		setDescription(description){
			if(!description || typeof description !== 'string'){
				console.log('[setDescription] invalid description');
				return this;
			}
			this.data.description = description;
			return this;
		}
		clearDescription(){
			this.data.description = undefined;
			return this;
		}
		setFooter(options){
			this.data.footer = DiscordEmbedBuilder.Functions.resolveBuilder(options, DiscordEmbedBuilder.EmbedFooterBuilder);
			return this;
		}
		updateFooter(updater){
			updater(this.data.footer ??= new DiscordEmbedBuilder.EmbedFooterBuilder());
			return this;
		}
		clearFooter(){
			this.data.footer = undefined;
			return this;
		}
		setImage(url){
			this.data.image = { url };
			return this;
		}
		clearImage(){
			this.data.image = undefined;
			return this;
		}
		setThumbnail(url){
			this.data.thumbnail = { url };
			return this;
		}
		clearThumbnail(){
			this.data.thumbnail = undefined;
			return this;
		}
		setTimestamp(timestamp = Date.now()){
			this.data.timestamp = new Date(timestamp).toISOString();
			return this;
		}
		clearTimestamp(){
			this.data.timestamp = undefined;
			return this;
		}
		setTitle(title){
			this.data.title = title;
			return this;
		}
		clearTitle(){
			this.data.title = undefined;
			return this;
		}
		setURL(url){
			this.data.url = url;
			return this;
		}
		clearURL(){
			this.data.url = undefined;
			return this;
		}
		toJSON(validationOverride){
			const { author, fields, footer, ...rest } = this.data;
			const data = {
				...structuredClone(rest),
				author: this.data.author?.toJSON(false),
				fields: this.data.fields?.map((field) => field.toJSON(false)),
				footer: this.data.footer?.toJSON(false)
			};
			DiscordEmbedBuilder.Functions.validate(DiscordEmbedBuilder.Functions.embedPredicate, data, validationOverride);
			return data;
		}

		// EmbedAuthor.ts
		static EmbedAuthorBuilder = class {
			data;
			constructor(data){
				this.data = structuredClone(data) ?? {};
			}
			setName(name){
				this.data.name = name;
				return this;
			}
			setURL(url){
				this.data.url = url;
				return this;
			}
			clearURL(){
				this.data.url = undefined;
				return this;
			}
			setIconURL(iconURL){
				this.data.icon_url = iconURL;
				return this;
			}
			clearIconURL(){
				this.data.icon_url = undefined;
				return this;
			}
			toJSON(validationOverride){
				const clone = structuredClone(this.data);
				DiscordEmbedBuilder.Functions.validate(DiscordEmbedBuilder.Functions.embedAuthorPredicate, clone, validationOverride);
				return clone;
			}
		}

		// EmbedField.ts
		static EmbedFieldBuilder = class {
			data;
			constructor(data){
				this.data = structuredClone(data) ?? {};
			}
			setName(name){
				this.data.name = name;
				return this;
			}
			setValue(value){
				this.data.value = value;
				return this;
			}
			setInline(inline = true){
				this.data.inline = inline;
				return this;
			}
			toJSON(validationOverride){
				const clone = structuredClone(this.data);
				DiscordEmbedBuilder.Functions.validate(DiscordEmbedBuilder.Functions.embedFieldPredicate, clone, validationOverride);
				return clone;
			}
		}

		// EmbedFooter.ts
		static EmbedFooterBuilder = class {
			data;
			constructor(data){
				this.data = structuredClone(data) ?? {};
			}
			setText(text){
				this.data.text = text;
				return this;
			}
			setIconURL(url){
				this.data.icon_url = url;
				return this;
			}
			clearIconURL(){
				this.data.icon_url = undefined;
				return this;
			}
			toJSON(validationOverride){
				const clone = structuredClone(this.data);
				DiscordEmbedBuilder.Functions.validate(DiscordEmbedBuilder.Functions.embedFooterPredicate, clone, validationOverride);
				return clone;
			}
		}

		static Functions = class {
			// ../../util/componentUtil.ts
			static embedLength(data){
				const countCharacters = (str) => Array.from(str).length;
				return (data.title ? countCharacters(data.title) : 0) +
					(data.description ? countCharacters(data.description) : 0) +
					(data.fields ? data.fields.reduce((prev, curr) => prev + countCharacters(curr.name) + countCharacters(curr.value), 0) : 0) +
					(data.footer ? countCharacters(data.footer.text) : 0) +
					(data.author ? countCharacters(data.author.name) : 0);
			}

			// ../../util/resolveBuilder.ts
			static isBuilder(builder, Constructor){
				return builder instanceof Constructor;
			}

			static resolveBuilder(builder, Constructor){
				if(DiscordEmbedBuilder.Functions.isBuilder(builder, Constructor)){
					return builder;
				}
				if(typeof builder === "function"){
					return builder(new Constructor());
				}
				return new Constructor(builder);
			}

			// ../../util/normalizeArray.ts
			static normalizeArray(arr){
				if(Array.isArray(arr[0])){
					return [...arr[0]];
				}
				return arr;
			}

			// Assertions.ts
			static validate(validator, value, validationOverride){
				if(validationOverride === false){
					return value;
				}
				const result = validator(value);
				if(!result.success){
					console.error({error: result.error, value: value, result: result});
					throw new Error(result.error);
				}
				return result.data;
			}

			static validateString(value, minLength, maxLength){
				if(typeof value !== 'string'){
					return { success: false, error: `Value must be a string` };
				}
				const length = Array.from(value).length;
				if(length < minLength || length > maxLength){
					return { success: false, error: `String length must be between ${minLength} and ${maxLength}` };
				}
				return { success: true, data: value };
			}

			static validateURL(value, allowedProtocols){
				try{
					const url = new URL(value);
					if(!allowedProtocols.includes(url.protocol)){
						URL.revokeObjectURL(url);
						return { success: false, error: `Invalid protocol for URL. Must be one of: ${allowedProtocols.join(', ')}` };
					}
					URL.revokeObjectURL(url);
				}catch(e){
					return { success: false, error: `Invalid URL` };
				}
				return { success: true, data: value };
			}

			static validateNumber(value, min, max){
				if(typeof value !== 'number' || !Number.isInteger(value)){
					return { success: false, error: `Value must be an integer` };
				}
				if(value < min || value > max){
					return { success: false, error: `Number must be between ${min} and ${max}` };
				}
				return { success: true, data: value };
			}

			static validateObject(obj, schema){
				for(let key in schema){
					if(schema.hasOwnProperty(key)){
						const result = schema[key](obj[key]);
						if(!result.success){
							return result;
						}
					}
				}
				return { success: true, data: obj };
			}

			static namePredicate(value){
				return DiscordEmbedBuilder.Functions.validateString(value, 1, 256);
			}

			// これをやめてimageURLPredicateを使う
			/*
			static iconURLPredicate(value){
				return DiscordEmbedBuilder.Functions.validateURL(value, ["http:", "https:", "attachment:"]);
			}
			*/
			static imageURLPredicate(value){
				return DiscordEmbedBuilder.Functions.validateURL(value, ["http:", "https:", "attachment:"]);
			}

			static URLPredicate(value){
				return DiscordEmbedBuilder.Functions.validateURL(value, ["http:", "https:"]);
			}

			static embedFieldPredicate(obj){
				return DiscordEmbedBuilder.Functions.validateObject(obj, {
					name: DiscordEmbedBuilder.Functions.namePredicate,
					value: (value) => DiscordEmbedBuilder.Functions.validateString(value, 1, 1024),
					inline: (value) => {
						if(value !== undefined && typeof value !== 'boolean'){
							return { success: false, error: `Inline must be a boolean` };
						}
						return { success: true, data: value };
					}
				});
			}

			static embedAuthorPredicate(obj){
				return DiscordEmbedBuilder.Functions.validateObject(obj, {
					name: DiscordEmbedBuilder.Functions.namePredicate,
					icon_url: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.imageURLPredicate(value);
						return { success: true, data: value };
					},
					url: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.URLPredicate(value);
						return { success: true, data: value };
					}
				});
			}

			static embedFooterPredicate(obj){
				return DiscordEmbedBuilder.Functions.validateObject(obj, {
					text: (value) => DiscordEmbedBuilder.Functions.validateString(value, 1, 2048),
					icon_url: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.imageURLPredicate(value);
						return { success: true, data: value };
					}
				});
			}

			static embedPredicate(obj){
				const result = DiscordEmbedBuilder.Functions.validateObject(obj, {
					title: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.namePredicate(value);
						return { success: true, data: value };
					},
					// 元は4096だったが、実際にはもう少し長くても問題なさそうだったので数値を増やした
					description: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.validateString(value, 1, 6200);
						return { success: true, data: value };
					},
					url: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.URLPredicate(value);
						return { success: true, data: value };
					},
					timestamp: (value) => {
						if(value !== undefined && typeof value !== 'string'){
							return { success: false, error: `Timestamp must be a string` };
						}
						return { success: true, data: value };
					},
					color: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.validateNumber(value, 0, 16777215);
						return { success: true, data: value };
					},
					footer: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.embedFooterPredicate(value);
						return { success: true, data: value };
					},
					image: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.validateObject(value, { url: DiscordEmbedBuilder.Functions.imageURLPredicate });
						return { success: true, data: value };
					},
					thumbnail: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.validateObject(value, { url: DiscordEmbedBuilder.Functions.imageURLPredicate });
						return { success: true, data: value };
					},
					author: (value) => {
						if(value !== undefined)return DiscordEmbedBuilder.Functions.embedAuthorPredicate(value);
						return { success: true, data: value };
					},
					fields: (value) => {
						if(value !== undefined){
							if(!Array.isArray(value) || value.length > 25){
								return { success: false, error: `Fields must be an array with a maximum length of 25` };
							}
							for(let field of value){
								const result = DiscordEmbedBuilder.Functions.embedFieldPredicate(field);
								if(!result.success){
									return result;
								}
							}
						}
						return { success: true, data: value };
					}
				});

				if(!result.success){
					return result;
				}

				if(!obj.title && !obj.description && (!obj.fields || obj.fields.length === 0) && !obj.footer && !obj.author && !obj.image && !obj.thumbnail){
					return { success: false, error: `Embed must have at least a title, description, a field, a footer, an author, an image, OR a thumbnail.` };
				}
				// 元は6000だったが、実際にはもう少し長くても問題なさそうだったので数値を増やした
				if(DiscordEmbedBuilder.Functions.embedLength(obj) > 6400){
					return { success: false, error: `Embeds must not exceed 6400 characters in total.` };
				}

				return { success: true, data: obj };
			}
		}
	}

	class Colors {
		constructor(){
			this.colors = {
				// [white, dark]
				"fontColor":				['rgb(15, 20, 25)', 'rgb(247, 249, 249)'],
				"fontColorDark":			['rgb(83, 100, 113)', 'rgb(214, 214, 214)'],
				//"fontColorGray":			['rgb(133, 133, 133)', 'rgb(133, 133, 133)'],
				"backgroundColor":			['rgba(245, 245, 245, 1)', 'rgba(0, 0, 0, 1)'],
				"backgroundColorLight":		['rgb(250, 250, 250)', 'rgba(31,31,31,1)'],
				"searchOptionsBackgroundColor": ['rgba(0,0,0,0.04)', 'rgb(39, 49, 60)'],
				"searchOptionsBackgroundColorHover":		['rgba(0,0,0,0.0784)', 'rgba(255,255,255,0.2256)'],
				"jumpButtonFontColor": 			['rgb(133, 133, 133)', 'rgb(133, 133, 133)'],
				"jumpButtonHoverFontColor": 		['rgb(128, 128, 128)', 'rgb(148, 148, 148)'],
				"jumpButtonHoverBackgroundColor": 		['rgba(0, 0, 0, 0.04)', 'rgba(255, 255, 255, 0.12)'],
				"jumpButtonActiveFontColor": 		['rgb(255, 255, 255)', 'rgb(245, 245, 245)'],
				"jumpButtonActiveBackgroundColor": 		['rgba(0, 0, 0, 0.88)', 'rgba(255, 255, 255, 0.12)'],
				"borderColor":				['rgb(239, 243, 244)', 'rgb(56, 68, 77)'],
				"twitterBlue":				['rgb(29, 155, 240)', 'rgb(29, 155, 240)'],
				"pixivBlue":				['#0096fa', '#0096fa'],
				"menuHoverEffect":			['rgba(15, 20, 25, 0.1)', 'rgba(247, 249, 249, 0.1)'], // 一番左のメニュー等のホバーエフェクト
				"menuHoverEffectLight":		['rgb(247, 249, 249)', 'rgb(30, 39, 50)'], // 設定画面のホバーエフェクト
				"dropdownBackgroundColor": 	['rgb(255, 255, 255)', 'rgb(59, 59, 59)'],
				"dropdownFontColor":		['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
				"dropdownBorderColor":		['rgb(118, 118, 118)', 'rgb(133, 133, 133)'],
				"buttonBackgroundColor":	['rgb(239, 239, 239)', 'rgb(107, 107, 107)'],
				"buttonFontColor":			['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
				"buttonBorderColor":		['rgb(239, 239, 239)', 'rgb(107, 107, 107)'],
				"conversationLineColor":	['rgb(207, 217, 222)', 'rgb(66, 83, 100)'],
				"menuContainerBackgroundColor":	['rgb(255, 255, 255)', 'rgb(31, 31, 31)'],
				"menuContainerFontColor":		['#474747', '#d6d6d6'],
				"menuContainerBorderColor":	['rgba(0, 0, 0, 0.08)', 'rgba(255, 255, 255, 0.12)'],
				"menuContainerHoverBackgroundColor": ['rgba(0,0,0,0.04)', 'rgba(255,255,255,0.12)'],
				"menuContainerFontColorDark":		['#858585', '#858585'],
				"charcoalAssertive": 		['rgb(255, 43, 0)', 'rgb(255, 43, 0)'],
				// assertive
				charcoalAssertive:					['rgb(255, 43, 0)', 'rgb(255, 43, 0)'],
				charcoalAssertiveHover:				['rgb(245, 41, 0)', 'rgb(255, 68, 31)'],
				charcoalAssertivePress:				['rgb(214, 36, 0)', 'rgb(255, 85, 51)'],

				// background
				charcoalBackground1:				['rgb(255, 255, 255)', 'rgb(31, 31, 31)'],
				charcoalBackground1Hover:			['rgb(245, 245, 245)', 'rgb(58, 58, 58)'],
				charcoalBackground1Press:			['rgb(214, 214, 214)', 'rgb(76, 76, 76)'],

				charcoalBackground2:				['rgb(245, 245, 245)', 'rgb(0, 0, 0)'],
				charcoalBackground2Hover:			['rgb(235, 235, 235)', 'rgb(31, 31, 31)'],
				charcoalBackground2Press:			['rgb(206, 206, 206)', 'rgb(51, 51, 51)'],

				// border
				charcoalBorder:						['rgba(0,0,0,0.08)', 'rgba(255,255,255,0.12)'],
				charcoalBorderHover:				['rgba(0,0,0,0.1168)', 'rgba(255,255,255,0.2256)'],
				charcoalBorderPress:				['rgba(0,0,0,0.2272)', 'rgba(255,255,255,0.29600000000000004)'],

				charcoalBorderDefault:				['rgba(0,0,0,0.08)', 'rgba(255,255,255,0.12)'],
				charcoalBorderDefaultHover:			['rgba(0,0,0,0.1168)', 'rgba(255,255,255,0.2256)'],
				charcoalBorderDefaultPress:			['rgba(0,0,0,0.2272)', 'rgba(255,255,255,0.29600000000000004)'],

				// brand
				charcoalBrand:						['rgb(0, 150, 250)', 'rgb(0, 150, 250)'],
				charcoalBrandHover:				['rgb(0, 144, 240)', 'rgb(31, 163, 251)'],
				charcoalBrandPress:				['rgb(0, 126, 210)', 'rgb(51, 171, 251)'],

				// icon
				charcoalIcon6:						['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.28)'],
				charcoalIcon6Hover:				['rgba(222,222,222,0.3088)', 'rgba(255,255,255,0.3664)'],
				charcoalIcon6Press:				['rgba(152,152,152,0.3952)', 'rgba(255,255,255,0.42400000000000004)'],

				// link
				charcoalLink1:						['rgb(61, 118, 153)', 'rgb(102, 159, 194)'],
				charcoalLink1Hover:				['rgb(59, 113, 147)', 'rgb(120, 171, 201)'],
				charcoalLink1Press:				['rgb(51, 99, 129)', 'rgb(133, 178, 206)'],

				charcoalLink2:						['rgba(255,255,255,0.36)', 'rgba(255,255,255,0.36)'],
				charcoalLink2Hover:				['rgba(229,229,229,0.3856)', 'rgba(255,255,255,0.43679999999999997)'],
				charcoalLink2Press:				['rgba(167,167,167,0.4624)', 'rgba(255,255,255,0.488)'],

				// success
				charcoalSuccess:					['rgb(177, 204, 41)', 'rgb(177, 204, 41)'],
				charcoalSuccessHover:				['rgb(170, 196, 39)', 'rgb(186, 210, 67)'],
				charcoalSuccessPress:				['rgb(149, 171, 34)', 'rgb(193, 214, 84)'],

				// surface
				charcoalSurface1:					['rgb(255, 255, 255)', 'rgb(31, 31, 31)'],
				charcoalSurface1Hover:			['rgb(245, 245, 245)', 'rgb(58, 58, 58)'],
				charcoalSurface1Press:			['rgb(214, 214, 214)', 'rgb(76, 76, 76)'],

				charcoalSurface2:					['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.16)'],
				charcoalSurface2Hover:			['rgba(0,0,0,0.0592)', 'rgba(117,117,117,0.2608)'],
				charcoalSurface2Press:			['rgba(0,0,0,0.17679999999999998)', 'rgba(155,155,155,0.328)'],

				charcoalSurface3:					['rgba(0,0,0,0.04)', 'rgba(255,255,255,0.12)'],
				charcoalSurface3Hover:			['rgba(0,0,0,0.0784)', 'rgba(255,255,255,0.2256)'],
				charcoalSurface3Press:			['rgba(0,0,0,0.1936)', 'rgba(255,255,255,0.29600000000000004)'],

				charcoalSurface4:					['rgba(0,0,0,0.32)', 'rgba(0,0,0,0.32)'],
				charcoalSurface4Hover:			['rgba(0,0,0,0.3472)', 'rgba(76,76,76,0.4016)'],
				charcoalSurface4Press:			['rgba(0,0,0,0.4288)', 'rgba(112,112,112,0.45599999999999996)'],

				charcoalSurface6:					['rgba(0,0,0,0.88)', 'rgba(255,255,255,0.12)'],
				charcoalSurface6Hover:			['rgba(0,0,0,0.8848)', 'rgba(255,255,255,0.2256)'],
				charcoalSurface6Press:			['rgba(0,0,0,0.8992)', 'rgba(255,255,255,0.29600000000000004)'],

				charcoalSurface7:					['rgba(0,0,0,0.02)', 'rgba(0,0,0,0)'],
				charcoalSurface7Hover:			['rgba(0,0,0,0.0592)', 'rgba(255,255,255,0.12)'],
				charcoalSurface7Press:			['rgba(0,0,0,0.17679999999999998)', 'rgba(255,255,255,0.2)'],

				charcoalSurface8:					['rgba(0,0,0,0.88)', 'rgba(0,0,0,0.88)'],
				charcoalSurface8Hover:			['rgba(0,0,0,0.8848)', 'rgba(34,34,34,0.8944)'],
				charcoalSurface8Press:			['rgba(0,0,0,0.8992)', 'rgba(56,56,56,0.904)'],

				charcoalSurface9:					['rgb(255, 255, 255)', 'rgb(51, 51, 51)'],
				charcoalSurface9Hover:			['rgb(245, 245, 245)', 'rgb(75, 75, 75)'],
				charcoalSurface9Press:			['rgb(214, 214, 214)', 'rgb(92, 92, 92)'],

				charcoalSurface10:				['rgba(0,0,0,0.16)', 'rgba(255,255,255,0.2)'],
				charcoalSurface10Hover:			['rgba(0,0,0,0.1936)', 'rgba(255,255,255,0.29600000000000004)'],
				charcoalSurface10Press:			['rgba(0,0,0,0.2944)', 'rgba(255,255,255,0.36000000000000004)'],

				// text
				charcoalText1:						['rgb(31, 31, 31)', 'rgb(245, 245, 245)'],
				charcoalText1Hover:				['rgb(30, 30, 30)', 'rgb(246, 246, 246)'],
				charcoalText1Press:				['rgb(26, 26, 26)', 'rgb(247, 247, 247)'],

				charcoalText2:						['rgb(71, 71, 71)', 'rgb(214, 214, 214)'],
				charcoalText2Hover:				['rgb(68, 68, 68)', 'rgb(219, 219, 219)'],
				charcoalText2Press:				['rgb(60, 60, 60)', 'rgb(222, 222, 222)'],

				charcoalText3:						['rgb(133, 133, 133)', 'rgb(133, 133, 133)'],
				charcoalText3Hover:				['rgb(128, 128, 128)', 'rgb(148, 148, 148)'],
				charcoalText3Press:				['rgb(112, 112, 112)', 'rgb(157, 157, 157)'],

				charcoalText4:						['rgb(173, 173, 173)', 'rgb(92, 92, 92)'],
				charcoalText4Hover:				['rgb(166, 166, 166)', 'rgb(112, 112, 112)'],
				charcoalText4Press:				['rgb(145, 145, 145)', 'rgb(125, 125, 125)'],

				charcoalText5:						['rgb(255, 255, 255)', 'rgb(245, 245, 245)'],
				charcoalText5Hover:				['rgb(245, 245, 245)', 'rgb(246, 246, 246)'],
				charcoalText5Press:				['rgb(214, 214, 214)', 'rgb(247, 247, 247)'],

				charcoalText1Visited:				['rgb(173, 173, 173)', 'rgb(173, 173, 173)'],
				charcoalText1VisitedHover:		['rgb(166, 166, 166)', 'rgb(183, 183, 183)'],
				charcoalText1VisitedPress:		['rgb(145, 145, 145)', 'rgb(189, 189, 189)'],

				// transparent
				charcoalTransparent:				['rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
				charcoalTransparentHover:		['rgba(0,0,0,0.04)', 'rgba(255,255,255,0.12)'],
				charcoalTransparentPress:		['rgba(0,0,0,0.16)', 'rgba(255,255,255,0.2)'],

				// updated
				charcoalUpdatedItem:				['rgba(0,150,250,0.04)', 'rgba(0,150,250,0.12)'],
				charcoalUpdatedItemHover:		['rgba(0,73,122,0.0784)', 'rgba(136,206,253,0.2256)'],
				charcoalUpdatedItemPress:		['rgba(0,26,43,0.1936)', 'rgba(172,221,253,0.29600000000000004)'],

				// warning / premium / booth / request
				charcoalWarning:					['rgb(255, 175, 15)', 'rgb(255, 175, 15)'],
				charcoalWarningHover:			['rgb(245, 168, 14)', 'rgb(255, 185, 44)'],
				charcoalWarningPress:			['rgb(214, 147, 13)', 'rgb(255, 191, 63)'],

				charcoalPremium:					['rgb(253, 158, 22)', 'rgb(253, 158, 22)'],
				charcoalPremiumHover:			['rgb(243, 152, 21)', 'rgb(253, 170, 50)'],
				charcoalPremiumPress:			['rgb(213, 133, 18)', 'rgb(253, 177, 69)'],

				charcoalBooth:						['rgb(252, 77, 80)', 'rgb(252, 77, 80)'],
				charcoalBoothHover:				['rgb(242, 74, 77)', 'rgb(252, 98, 101)'],
				charcoalBoothPress:				['rgb(212, 65, 67)', 'rgb(253, 113, 115)'],

				charcoalRequest:					['rgb(48, 210, 136)', 'rgb(48, 210, 136)'],
				charcoalRequestHover:			['rgb(46, 202, 131)', 'rgb(73, 215, 150)'],
				charcoalRequestPress:			['rgb(40, 176, 114)', 'rgb(89, 219, 160)'],

				// r18 / like / marker
				charcoalR18:						['rgb(255, 64, 96)', 'rgb(255, 64, 96)'],
				charcoalR18Hover:				['rgb(245, 61, 92)', 'rgb(255, 87, 115)'],
				charcoalR18Press:				['rgb(214, 54, 81)', 'rgb(255, 102, 128)'],

				charcoalLike:						['rgb(255, 64, 96)', 'rgb(255, 64, 96)'],
				charcoalLikeHover:				['rgb(245, 61, 92)', 'rgb(255, 87, 115)'],
				charcoalLikePress:				['rgb(214, 54, 81)', 'rgb(255, 102, 128)'],

				charcoalMarker:					['rgb(204, 41, 84)', 'rgb(204, 41, 84)'],
				charcoalMarkerHover:			['rgb(196, 39, 81)', 'rgb(210, 67, 105)'],
				charcoalMarkerPress:			['rgb(171, 34, 71)', 'rgb(214, 84, 118)'],

				// metals
				charcoalGold:						['rgb(214, 186, 73)', 'rgb(214, 186, 73)'],
				charcoalGoldHover:				['rgb(205, 179, 70)', 'rgb(219, 194, 95)'],
				charcoalGoldPress:				['rgb(180, 156, 61)', 'rgb(222, 200, 109)'],

				charcoalSilver:					['rgb(214, 214, 214)', 'rgb(214, 214, 214)'],
				charcoalSilverHover:			['rgb(205, 205, 205)', 'rgb(219, 219, 219)'],
				charcoalSilverPress:			['rgb(180, 180, 180)', 'rgb(222, 222, 222)'],

				charcoalBronze:					['rgb(200, 161, 126)', 'rgb(200, 161, 126)'],
				charcoalBronzeHover:			['rgb(192, 155, 121)', 'rgb(207, 172, 141)'],
				charcoalBronzePress:			['rgb(168, 135, 106)', 'rgb(211, 180, 152)'],

				// service x
				charcoalServiceX:					['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
				charcoalServiceXHover:			['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
				charcoalServiceXPress:			['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],

				charcoalServiceXColor:			['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
				charcoalServiceXColorHover:		['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
				charcoalServiceXColorPress:		['rgb(0, 0, 0)', 'rgb(255, 255, 255)'],
			};
		}

		/**
		* 指定されたカラーパレットから現在のテーマの色を返します
		* @param {string} colorName - 色名 (例: "fontColor")
		* @param {number} [darkMode] - テーマ番号 (0=デフォルト, 1=ダークブルー, 2=ブラック) (省略時は現在のテーマ)
		* @returns {string} - 色のRGB文字列 (例: "rgb(255,255,255)")
		*/
		get(colorName, darkMode = sessionData.themeMode?.themeNum ?? localStorage.getItem('theme') ?? 0){
			return this.colors[colorName][darkMode];
		}

		/**
		* 指定した色にアルファ値（透過）を加えたRGBA形式を返します
		* @param {string} colorName - 色名 (例: "borderColor")
		* @param {number} alpha - 透過度 (0.0〜1.0)
		* @param {number} [darkMode] - テーマ番号（0=デフォルト, 1=ダークブルー, 2=ブラック) (省略時は現在のテーマ)
		* @returns {string} - RGBA文字列 (例: "rgba(255,255,255,1.0)")
		*/
		getWithAlpha(colorName, alpha, darkMode = sessionData.themeMode?.themeNum ?? localStorage.getItem('theme') ?? 0){
			return `rgba(${this.colors[colorName][darkMode].match(/\d+/g).join(", ")}, ${alpha})`;
		}

		getColorNames(){
			return Object.keys(this.colors);
		}
	}
	const colors = new Colors();

	/**
	 * ZIP展開クラス
	 * @example
	 * const unzip = new Unzip();
	 * await unzip.load(zipBlob);
	 * const files = unzip.getFileList();
	 * const data = await unzip.extract('image.jpg');
	 */
	class Unzip {
		constructor(){
			this._dataView = null;
			this._uint8Array = null;
			this._entries = [];
			this._entryMap = new Map();
			this._loaded = false;
		}

		/**
		 * ZIPファイルを読み込む
		 * @param {Blob|ArrayBuffer} source - ZIPファイル
		 * @returns {Promise<Unzip>} - チェーン用にthisを返す
		 */
		async load(source){
			let arrayBuffer;

			if(source instanceof Blob){
				arrayBuffer = await readBlobAsArrayBuffer(source);
			}else if(source instanceof ArrayBuffer){
				// FireFoxサンドボックス対応
				const cloned = _cloneInto(new Uint8Array(source), window);
				arrayBuffer = cloned.buffer;
			}else{
				throw new Error('sourceはBlobまたはArrayBufferである必要があります');
			}

			this._dataView = new DataView(arrayBuffer);
			this._uint8Array = new Uint8Array(arrayBuffer);

			// セントラルディレクトリの終端を探す
			const eocdOffset = this.#_findEndOfCentralDirectory();
			if(eocdOffset === -1){
				throw new Error('有効なZIPファイルではありません');
			}

			// セントラルディレクトリを読み取る
			const centralDirOffset = this._dataView.getUint32(eocdOffset + 16, true);
			const fileCount = this._dataView.getUint16(eocdOffset + 10, true);

			// ファイルエントリを解析
			this._entries = this.#_parseCentralDirectory(centralDirOffset, fileCount);

			// ファイル名でマップを作成
			this._entryMap.clear();
			for(const entry of this._entries){
				this._entryMap.set(entry.name, entry);
			}

			this._loaded = true;
			return this;
		}

		/**
		 * 読み込み済みか確認
		 */
		#_ensureLoaded(){
			if(!this._loaded){
				throw new Error('ZIPファイルが読み込まれていません。先にload()を呼び出してください');
			}
		}

		/**
		 * ファイル名の一覧を取得
		 * @param {boolean} includeDirectories - ディレクトリも含めるか
		 * @returns {string[]}
		 */
		getFileList(includeDirectories = false){
			this.#_ensureLoaded();
			if(includeDirectories){
				return this._entries.map(e => e.name);
			}
			return this._entries.filter(e => !e.isDirectory).map(e => e.name);
		}

		/**
		 * エントリの詳細情報一覧を取得
		 * @returns {Array<{name: string, size: number, compressedSize: number, isDirectory: boolean}>}
		 */
		getEntries(){
			this.#_ensureLoaded();
			return this._entries.map(e => ({
				name: e.name,
				size: e.uncompressedSize,
				compressedSize: e.compressedSize,
				isDirectory: e.isDirectory
			}));
		}

		/**
		 * 特定のエントリを取得
		 * @param {string} path - ファイルパス
		 * @param {boolean} throwOnError - エラー時にthrowするか
		 * @returns {{name: string, size: number, compressedSize: number, isDirectory: boolean}|null}
		 */
		getEntry(path, throwOnError = false){
			this.#_ensureLoaded();
			const entry = this._entryMap.get(path);
			if (!entry) {
				if(throwOnError){
					throw new Error(`ファイルが見つかりません: ${path}`);
				}
				return null;
			}
			return {
				name: entry.name,
				size: entry.uncompressedSize,
				compressedSize: entry.compressedSize,
				isDirectory: entry.isDirectory
			};
		}

		/**
		 * ディレクトリ一覧を取得
		 * @returns {string[]}
		 */
		getDirectories(){
			this.#_ensureLoaded();
			const dirs = new Set();
			for(const entry of this._entries){
				if(entry.isDirectory){
					dirs.add(entry.name);
				}else{
					// ファイルパスからディレクトリを抽出
					const lastSlash = entry.name.lastIndexOf('/');
					if(lastSlash > 0){
						dirs.add(entry.name.substring(0, lastSlash + 1));
					}
				}
			}
			return [...dirs].sort();
		}

		/**
		 * 指定ディレクトリ内のファイル一覧を取得
		 * @param {string} dirPath - ディレクトリパス（末尾の/はあってもなくても可）
		 * @param {boolean} recursive - サブディレクトリも含めるか
		 * @returns {string[]}
		 */
		listDirectory(dirPath, recursive = false){
			this.#_ensureLoaded();
			// 末尾の/を正規化
			const normalizedDir = dirPath.endsWith('/') ? dirPath : dirPath + '/';

			return this._entries
				.filter(e => !e.isDirectory)
				.filter(e => {
					if(!e.name.startsWith(normalizedDir))return false;
					if(recursive)return true;
					// 非再帰の場合、直下のファイルのみ
					const remaining = e.name.substring(normalizedDir.length);
					return !remaining.includes('/');
				})
				.map(e => e.name);
		}

		/**
		 * 単一ファイルを展開
		 * @param {string} path - ファイルパス
		 * @param {boolean} throwOnError - エラー時にthrowするか
		 * @returns {Promise<Uint8Array|null>}
		 */
		async extract(path, throwOnError = false){
			this.#_ensureLoaded();
			const entry = this._entryMap.get(path);

			if(!entry){
				if(throwOnError){
					throw new Error(`ファイルが見つかりません: ${path}`);
				}
				return null;
			}

			if(entry.isDirectory){
				if(throwOnError){
					throw new Error(`ディレクトリは展開できません: ${path}`);
				}
				return null;
			}

			return await this.#_extractFileData(entry);
		}

		/**
		 * 複数ファイルを展開
		 * @param {string[]} paths - ファイルパスの配列
		 * @param {boolean} throwOnError - エラー時にthrowするか
		 * @returns {Promise<Map<string, Uint8Array|null>>}
		 */
		async extractMultiple(paths, throwOnError = false){
			this.#_ensureLoaded();
			const result = new Map();

			for(const path of paths){
				const data = await this.extract(path, throwOnError);
				result.set(path, data);
			}

			return result;
		}

		/**
		 * 全ファイルを展開
		 * @param {Function} onProgress - 進捗コールバック (current, total) => void
		 * @returns {Promise<Map<string, Uint8Array>>}
		 */
		async extractAll(onProgress = () => {}){
			this.#_ensureLoaded();
			const result = new Map();
			const files = this._entries.filter(e => !e.isDirectory);
			const total = files.length;

			for(let i = 0; i < files.length; i++){
				const entry = files[i];
				const data = await this.#_extractFileData(entry);
				result.set(entry.name, data);
				onProgress(i + 1, total);
			}

			return result;
		}

		/**
		 * End of Central Directory レコードを探す
		 * @private
		 */
		#_findEndOfCentralDirectory(){
			const EOCD_SIGNATURE = 0x06054b50;
			const minEocdSize = 22;
			const maxCommentLength = 65535;

			const searchStart = Math.max(0, this._dataView.byteLength - minEocdSize - maxCommentLength);

			for(let i = this._dataView.byteLength - minEocdSize; i >= searchStart; i--) {
				if(this._dataView.getUint32(i, true) === EOCD_SIGNATURE){
					return i;
				}
			}

			return -1;
		}

		/**
		 * セントラルディレクトリを解析
		 * @private
		 */
		#_parseCentralDirectory(offset, fileCount){
			const CENTRAL_DIR_SIGNATURE = 0x02014b50;
			const entries = [];
			let currentOffset = offset;

			for(let i = 0; i < fileCount; i++){
				if(this._dataView.getUint32(currentOffset, true) !== CENTRAL_DIR_SIGNATURE){
					throw new Error('セントラルディレクトリの解析に失敗しました');
				}

				const compressionMethod = this._dataView.getUint16(currentOffset + 10, true);
				const compressedSize = this._dataView.getUint32(currentOffset + 20, true);
				const uncompressedSize = this._dataView.getUint32(currentOffset + 24, true);
				const fileNameLength = this._dataView.getUint16(currentOffset + 28, true);
				const extraFieldLength = this._dataView.getUint16(currentOffset + 30, true);
				const commentLength = this._dataView.getUint16(currentOffset + 32, true);
				const localHeaderOffset = this._dataView.getUint32(currentOffset + 42, true);

				const fileNameBytes = this._uint8Array.slice(currentOffset + 46, currentOffset + 46 + fileNameLength);
				const name = new TextDecoder('utf-8').decode(fileNameBytes);

				entries.push({
					name,
					compressionMethod,
					compressedSize,
					uncompressedSize,
					localHeaderOffset,
					isDirectory: name.endsWith('/')
				});

				currentOffset += 46 + fileNameLength + extraFieldLength + commentLength;
			}

			return entries;
		}

		/**
		 * ファイルデータを展開
		 * @private
		 */
		async #_extractFileData(entry){
			const LOCAL_HEADER_SIGNATURE = 0x04034b50;

			// ローカルファイルヘッダーを確認
			if(this._dataView.getUint32(entry.localHeaderOffset, true) !== LOCAL_HEADER_SIGNATURE){
				throw new Error('ローカルファイルヘッダーが不正です');
			}

			const fileNameLength = this._dataView.getUint16(entry.localHeaderOffset + 26, true);
			const extraFieldLength = this._dataView.getUint16(entry.localHeaderOffset + 28, true);

			// データの開始位置
			const dataOffset = entry.localHeaderOffset + 30 + fileNameLength + extraFieldLength;
			const compressedData = this._uint8Array.slice(dataOffset, dataOffset + entry.compressedSize);

			// 圧縮方式に応じて展開
			if(entry.compressionMethod === 0){
				// 無圧縮（stored）
				return compressedData;
			}else if(entry.compressionMethod === 8){
				// DEFLATE圧縮
				return await this.#_inflateData(compressedData);
			}else{
				throw new Error(`サポートされていない圧縮方式: ${entry.compressionMethod}`);
			}
		}

		/**
		 * DEFLATEデータを展開
		 * @private
		 */
		async #_inflateData(compressedData){
			try{
				const ds = new DecompressionStream('deflate-raw');
				const writer = ds.writable.getWriter();
				const reader = ds.readable.getReader();

				writer.write(compressedData);
				writer.close();

				const chunks = [];
				let totalLength = 0;

				while(true){
					const { done, value } = await reader.read();
					if(done)break;
					chunks.push(value);
					totalLength += value.length;
				}

				const result = new Uint8Array(totalLength);
				let offset = 0;
				for(const chunk of chunks){
					result.set(chunk, offset);
					offset += chunk.length;
				}

				return result;
			}catch(error){
				console.error('DEFLATE展開エラー:', error);
				throw new Error('データの展開に失敗しました');
			}
		}
	}


	class ProgressNotify {
		#totalJobs = 0;
		#jobIndex = 0;
		#executingJobs = {};
		#notifyArea = null;
		#notifyAreaTitle = null;
		#notifyAreaProgressContainer = null;
		#jobsDisplayContainer = null;
		#textData = envTextData.makePixivLittleUseful.notify;
		#statusColors = {
			'pending': 'rgb(255, 212, 0)',
			'success': 'rgb(0, 186, 124)',
			'error': 'rgb(249, 24, 128)',
		};
		#autoRemoveTimers = {}; // 自動削除用のタイマーを管理
		#hideTimer = null; // 画面外に戻すタイマー
		#isVisible = false; // 表示状態を管理
		#toastQueue = []; // トーストのキュー
		#isShowingToast = false; // トースト表示中かどうか
		#toastContainer = null; // トーストコンテナ
		#isPanelInitialized = false; // パネル初期化フラグ
		#isToastInitialized = false; // トースト初期化フラグ

		constructor(){
			this.#init();
		}
		#init(){
			// デバイスに応じてデフォルトのUIを初期化
			this.#initToastContainer();
			if(isPC){
				this.#initNotifyPanel();
			}

			// CSSアニメーションを追加
			this.#appenStyles();
		}

		#appenStyles(){
			const styles = `
				@keyframes MPLU-slideInFromRight {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}

				@keyframes MPLU-slideOutToRight {
					from {
						transform: translateX(0);
						opacity: 1;
					}
					to {
						transform: translateX(100%);
						opacity: 0;
					}
				}

				@keyframes MPLU-slideUpFromBottom {
					from {
						transform: translateY(calc(100% + 16px));
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}

				@keyframes MPLU-slideDownToBottom {
					from {
						transform: translateY(0);
						opacity: 1;
					}
					to {
						transform: translateY(calc(100% + 16px));
						opacity: 0;
					}
				}

				.MPLU-jobContainer {
					animation: MPLU-slideInFromRight 200ms ease-out;
				}

				.MPLU-jobContainer.MPLU-removing {
					animation: MPLU-slideOutToRight 150ms ease-in forwards;
				}

				.MPLU-subJobItem {
					animation: MPLU-slideInFromRight 200ms ease-out;
				}

				.MPLU-notifyArea-slideUp {
					animation: MPLU-slideUpFromBottom 300ms ease-out forwards;
				}

				.MPLU-notifyArea-slideDown {
					animation: MPLU-slideDownToBottom 300ms ease-in forwards;
				}

				/* モバイル用トーストアニメーション */
				@keyframes MPLU-toast-slideUp {
					from {
						transform: translateY(150%);
						opacity: 0;
					}
					to {
						transform: translateY(0);
						opacity: 1;
					}
				}

				@keyframes MPLU-toast-slideDown {
					from {
						transform: translateY(0);
						opacity: 1;
					}
					to {
						transform: translateY(150%);
						opacity: 0;
					}
				}

				/* モバイル用トーストスタイル */
				.MPLU-toast-container {
					position: fixed;
					left: 0;
					right: 0;
					bottom: 32px;
					pointer-events: none;
					z-index: 100000;
					display: flex;
					justify-content: center;
					padding: 0 12px;
				}

				.MPLU-toast {
					display: flex;
					align-items: center;
					background-color: var(--MPLU-twitter-blue);
					justify-content: space-between;
					pointer-events: auto;
					padding: 12px 16px;
					border-radius: 8px;
					box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
					max-width: 600px;
					width: 100%;
					animation: MPLU-toast-slideUp 300ms ease-out forwards;
				}

				.MPLU-toast.MPLU-toast-hiding {
					animation: MPLU-toast-slideDown 300ms ease-in forwards;
				}

				.MPLU-toast-success {
					background-color: rgb(0, 186, 124);
				}

				.MPLU-toast-error {
					background-color: rgb(249, 24, 128);
				}

				.MPLU-toast-text {
					color: rgb(255, 255, 255);
					font-size: 1em;
					line-height: 1.25em;
					flex-grow: 1;
					overflow-wrap: break-word;
				}

				.MPLU-toast-icon {
					flex-shrink: 0;
					margin-right: 12px;
					width: 24px;
					height: 24px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			`;

			appendStyle('progressNotify', styles);
		}

		// トーストコンテナの初期化
		#initToastContainer(){
			if(this.#isToastInitialized) return;

			this.#toastContainer = h('div', {
				className: 'MPLU-toast-container',
				style: {
					zIndex: 'calc(infinity)',
				}
			});
			document.body.appendChild(this.#toastContainer);
			this.#isToastInitialized = true;
		}

		// 通知パネルの初期化
		async #initNotifyPanel(){
			if(this.#isPanelInitialized) return;

			this.#notifyAreaTitle = h('div', {
					className: 'MPLU-notifyTitle',
					style: {
						display: 'flex',
						height: '53px',
						minHeight: '0px',
						margin: '0px',
						fontWeight: '700',
						fontSize: '20px',
						marginRight: '16px',
						boxSizing: 'border-box',
					},
					textContent: 'notifications',
				}
			);

			this.#notifyAreaProgressContainer = h('div', {
					className: 'MPLU-notifyProgressContainer',
					style: {
						display: 'flex',
						height: '53px',
						margin: '0px',
						maxWidth: '5em',
						fontWeight: '700',
						fontSize: '20px',
						justifyContent: 'flex-end',
					},
					textContent: '0/0',
				}
			);

			this.#jobsDisplayContainer = h('div', {
					className: 'MPLU-jobsDisplayContainer',
					style: {
						display: 'none',
						flexDirection: 'column',
						width: '100%',
						height: '477px',
						overflowY: 'auto',
						overflowX: 'hidden',
						boxSizing: 'border-box',
						borderTop: `1px solid ${colors.get('borderColor')}`,
					},
				}
			);

			this.#notifyArea = h('div', {
					className: 'MPLU-container MPLU-notifyArea MPLU-fontColor',
					style: {
						display: 'flex',
						flexDirection: 'column',
						width: '400px',
						height: '53px',
						overflow: 'hidden',
						minHeight: '0px',
						maxHeight: '53px',
						borderTopLeftRadius: '16px',
						borderTopRightRadius: '16px',
						marginRight: '16px',
						boxShadow: 'rgba(136, 153, 166, 0.2) 0px 0px 15px, rgba(136, 153, 166, 0.15) 0px 0px 3px 1px',
						backgroundColor: 'var(--MPLU-background-color)',
						transition: 'max-height 0.2s ease, min-height 0.2s ease',
						border: `1px solid ${colors.get('borderColor')}`,
						pointerEvents: 'auto',
						userSelect: 'none',
						boxSizing: 'border-box',
						overflowX: 'hidden',
						// 初期状態は画面外に配置
						transform: 'translateY(calc(100% + 16px))',
						opacity: '0',
					},
				},
				h('div', {
						className: 'MPLU-notifyHeader',
						style: {
							display: 'flex',
							height: '53px',
							width: '100%',
							margin: '0px',
							padding: '0px 16px',
							alignItems: 'center',
							boxSizing: 'border-box',
						},
						onClick: (e) => {
							const button = this.#notifyArea.querySelector('.MPLU-expand-unExpandButton');
							button.click();
						}
					},
					h('div', {
							className: 'MPLU-notifyHeaderTextWrapper',
							style: {
								display: 'flex',
								height: '28px',
								flexGrow: '1',
								width: '100%',
								justifyContent: 'space-between',
								boxSizing: 'border-box',
							},
						},
						this.#notifyAreaTitle,
						this.#notifyAreaProgressContainer,
					),
					h('div', {
							className: 'MPLU-notifyHeaderButtonsWrapper',
							style: {
								height: '36px',
								width: 'fit-content',
							},
						},
						h('button', {
								className: 'MPLU-expand-unExpandButton MPLU-svg-button',
								dataset: {
									currentState: 'unexpanded',
									tooltipText: this.#textData.toolTip.expand,
								},
								style: {
									height: '36px',
									width: '36px',
									background: 'none',
									border: 'none',
									cursor: 'pointer',
									transform: 'rotate(0deg)',
									transition: 'transform 0.2s ease',
								},
								onClick: (e) => {
									e.stopPropagation();
									if(e.currentTarget.dataset.currentState === 'unexpanded'){
										e.currentTarget.dataset.currentState = 'expanded';
										e.currentTarget.dataset.tooltipText = this.#textData.toolTip.unexpand;
										e.currentTarget.querySelector('svg').style.transform = 'rotate(180deg)';
										this.#notifyArea.style.maxHeight = '530px';
										this.#notifyArea.style.height = '530px';
										this.#jobsDisplayContainer.style.display = 'flex';
									}else{
										e.currentTarget.dataset.currentState = 'unexpanded';
										e.currentTarget.dataset.tooltipText = this.#textData.toolTip.expand;
										e.currentTarget.querySelector('svg').style.transform = 'rotate(0deg)';
										this.#notifyArea.style.maxHeight = '53px';
										this.#notifyArea.style.height = '53px';
										this.#jobsDisplayContainer.style.display = 'none';
									}
								},
								onmouseenter: (e) => {
									displayTooltip(e.currentTarget, e.currentTarget.dataset.tooltipText);
								},
								onmouseleave: (e) => {
									hideTooltip();
								},
								onpointerleave: (e) => {
									hideTooltip();
								},
							},
							h('div', {
									className: 'MPLU-expand-unExpandButtonIcon',
								},
								h('svg', {
										width: "20",
										height: "20",
										viewBox: "0 0 24 24",
										fill: "currentcolor",
										stroke: "currentColor",
									},
									h('g', {},
										h('path', {
												d: "M12 2.59l9.46 9.45-1.42 1.42L12 5.41l-8.04 8.05-1.42-1.42L12 2.59zm0 7l9.46 9.45-1.42 1.42L12 12.41l-8.04 8.05-1.42-1.42L12 9.59z",
											}
										)
									)
								),
							),
						),
					),
				),
				this.#jobsDisplayContainer,
			);
			const appendPlace = await waitElementAndGet({query: 'body > #__next > div > div > div.fixed.bottom-0.right-0'});
			if(appendPlace){
				appendPlace.appendChild(this.#notifyArea);
				this.#isPanelInitialized = true;
			}
		}

		// 通知エリアを表示
		#showNotifyArea(){
			if(this.#isVisible)return;

			this.#isVisible = true;
			this.#notifyArea.classList.remove('MPLU-notifyArea-slideDown');
			this.#notifyArea.classList.add('MPLU-notifyArea-slideUp');
			const expandButton = this.#notifyArea.querySelector('.MPLU-expand-unExpandButton');
			if(expandButton && expandButton.dataset.currentState === 'unexpanded')expandButton.click();
			// hideTimerをクリア
			if(this.#hideTimer){
				clearTimeout(this.#hideTimer);
				this.#hideTimer = null;
			}
		}

		// 通知エリアを非表示
		#hideNotifyArea(){
			if(!this.#isVisible)return;

			// 展開されている場合は折りたたむ
			const expandButton = this.#notifyArea.querySelector('.MPLU-expand-unExpandButton');
			if(expandButton && expandButton.dataset.currentState === 'expanded'){
				expandButton.click();
			}

			this.#isVisible = false;
			this.#notifyArea.classList.remove('MPLU-notifyArea-slideUp');
			this.#notifyArea.classList.add('MPLU-notifyArea-slideDown');
		}

		// モバイル用: トーストを表示
		async #showToast({text, status = 'success', duration = 3000}){
			// トーストをキューに追加
			this.#toastQueue.push({text, status, duration});

			// 既に表示中でなければ、キューの処理を開始
			if(!this.#isShowingToast){
				await this.#processToastQueue();
			}
		}

		// トーストキューを処理
		async #processToastQueue(){
			if(this.#toastQueue.length === 0){
				this.#isShowingToast = false;
				return;
			}

			this.#isShowingToast = true;
			const {text, status, duration} = this.#toastQueue.shift();

			// アイコンを作成
			const icon = status === 'success' 
				? h('svg', {
						viewBox: '0 0 24 24',
						fill: 'currentColor',
						style: {width: '100%', height: '100%'},
					},
						h('path', {
							d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'
						})
					)
				: h('svg', {
						viewBox: '0 0 24 24',
						fill: 'currentColor',
						style: {width: '100%', height: '100%'},
					},
						h('path', {
							d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
						})
					);

			// トースト要素を作成
			const toast = h('div', {
						className: `MPLU-toast ${status === 'success' ? 'MPLU-toast-success' : 'MPLU-toast-error'}`,
					},
					h('div', {
							className: 'MPLU-toast-icon',
						},
						icon
					),
					h('div', {
							className: 'MPLU-toast-text',
							textContent: text,
						}
					)
			);

			// トーストを表示
			this.#toastContainer.appendChild(toast);

			// 指定時間後に非表示アニメーション開始
			await sleep(duration);
			toast.classList.add('MPLU-toast-hiding');

			// アニメーション完了後に削除
			await sleep(300);
			toast.remove();

			// 次のトーストを処理
			await this.#processToastQueue();
		}

		// ジョブ完了時の共通処理
		#handleJobCompletion(jobId, job){
			if(job.useToast){
				// トースト通知
				this.#showToast({
					text: job.jobName,
					status: job.status,
					duration: 3000
				});
				delete this.#executingJobs[jobId];
				this.#totalJobs--;
			}else{
				// パネル通知（自動削除タイマー）
				this.#scheduleAutoRemove(jobId);
			}
			this.#checkAllJobsCompleted();
		}

		// 全てのジョブが完了しているかチェック
		#checkAllJobsCompleted(){
			const allCompleted = Object.values(this.#executingJobs).every(
				job => job.status === 'success' || job.status === 'error'
			);

			if(allCompleted && Object.keys(this.#executingJobs).length > 0){
				// トースト使用のジョブのみの場合はジョブをクリア
				const hasNonToastJobs = Object.values(this.#executingJobs).some(job => !job.useToast);

				if(!hasNonToastJobs){
					// トーストのみの場合
					this.#executingJobs = {};
					this.#totalJobs = 0;
				}else if(this.#isPanelInitialized){
					// パネル使用のジョブがある場合
					if(this.#hideTimer){
						clearTimeout(this.#hideTimer);
					}

					// 5秒後に非表示
					this.#hideTimer = setTimeout(() => {
						this.#hideNotifyArea();
						this.#hideTimer = null;
					}, 5000);
				}
			}
		}

		// Job の進捗を更新(SubJob の状態から計算)
		#updateJobProgress(jobId){
			const job = this.#executingJobs[jobId];
			if(!job)return;

			// 全 SubJob の進捗率の平均を計算
			if(job.subJobs.length > 0){
				const totalProgressRatio = job.subJobs.reduce((sum, sj) => {
					const ratio = sj.total > 0 ? sj.progress / sj.total : 0;
					return sum + ratio;
				}, 0);
				job.progress = totalProgressRatio;
				job.total = job.subJobs.length;
			}

			// 全 SubJob が success なら Job も success
			const allSuccess = job.subJobs.length > 0 && job.subJobs.every(sj => sj.status === 'success');
			const anyError = job.subJobs.some(sj => sj.status === 'error');

			const previousStatus = job.status;

			if(anyError){
				job.status = 'error';
			}else if(allSuccess){
				job.status = 'success';
			}

			// ステータスが完了状態に変わった場合（共通処理を使用）
			if(previousStatus === 'pending' && (job.status === 'success' || job.status === 'error')){
				this.#handleJobCompletion(jobId, job);
			}

			// パネル表示の更新（トースト使用時は不要）
			if(!job.useToast){
				this.#updateJobDisplay(jobId);
				this.#updateTotalProgress();
			}
		}

		// Job 全体の表示を更新
		#updateJobDisplay(jobId){
			const job = this.#executingJobs[jobId];
			if(!job || !job.displayElement)return;

			// タイトル更新
			const titleElement = job.displayElement.querySelector('.MPLU-jobMainInfoTitle');
			if(titleElement){
				titleElement.textContent = job.jobName;
			}

			// 進捗テキスト更新
			const progressText = job.displayElement.querySelector('.MPLU-jobMainInfoProgress');
			if(progressText){
				const progressValue = Math.floor(job.progress);
				progressText.textContent = `${progressValue}/${job.total}`;
			}

			// 進捗バー更新
			const progressBar = job.displayElement.querySelector('.MPLU-jobMainInfoProgressBarContainer');
			if(progressBar){
				const percent = job.total === 0 ? 0 : (job.progress / job.total) * 100;
				progressBar.dataset.percent = `${percent}`;

				// circle の stroke-dashoffset を更新
				const circle = progressBar.querySelector('.MPLU-jobMainInfoProgressBarCircle');
				if(circle){
					const radius = parseFloat(circle.getAttribute('r')) || 16;
					const circumference = 2 * Math.PI * radius;
					const offset = circumference * (1 - percent / 100);
					circle.style.strokeDasharray = `${circumference}`;
					circle.style.strokeDashoffset = `${offset}`;
				}
			}

			// ステータス色更新
			const mainInfo = job.displayElement.querySelector('.MPLU-jobMainInfoContainer');
			if(mainInfo){
				mainInfo.dataset.status = job.status;
				mainInfo.style.setProperty('--MPLU-job-status-color', this.#statusColors[job.status]);
			}
		}

		// SubJob の表示を更新
		#updateSubJobDisplay(jobId, subJobId){
			const job = this.#executingJobs[jobId];
			if(!job)return;

			const subJob = job.subJobs.find(sj => sj.id === subJobId);
			if(!subJob || !subJob.displayElement)return;

			// タイトル更新
			const titleElement = subJob.displayElement.querySelector('.MPLU-subJobTitle');
			if(titleElement){
				titleElement.textContent = subJob.subJobName;
			}

			// 進捗テキスト更新
			const progressText = subJob.displayElement.querySelector('.MPLU-subJobProgress');
			if(progressText){
				progressText.textContent = `${subJob.progress}/${subJob.total}`;
			}

			// 円形プログレスバー更新
			const progressCircle = subJob.displayElement.querySelector('.MPLU-subJobProgressCircle');
			if(progressCircle){
				const percent = subJob.total === 0 ? 0 : (subJob.progress / subJob.total) * 100;
				const radius = parseFloat(progressCircle.getAttribute('r')) || 10;
				const circumference = 2 * Math.PI * radius;
				progressCircle.style.strokeDasharray = `${circumference}`;
				progressCircle.style.strokeDashoffset = `${circumference * (1 - percent / 100)}`;
			}

			// ステータス色更新
			const statusIndicator = subJob.displayElement.querySelector('.MPLU-subJobStatusIndicator');
			if(statusIndicator){
				statusIndicator.style.backgroundColor = this.#statusColors[subJob.status];
			}

			// CSS変数も更新
			subJob.displayElement.style.setProperty('--MPLU-subjob-status-color', this.#statusColors[subJob.status]);
		}

		// 全体の進捗を更新
		#updateTotalProgress(){
			if(!this.#notifyAreaProgressContainer)return;

			const completedJobs = Object.values(this.#executingJobs).filter(job => job.status === 'success').length;
			const totalJobs = Object.keys(this.#executingJobs).length;

			this.#notifyAreaProgressContainer.textContent = `${completedJobs}/${totalJobs}`;
		}

		// 自動削除タイマーを設定
		#scheduleAutoRemove(jobId){
			// 既存のタイマーがあればクリア
			if(this.#autoRemoveTimers[jobId]){
				clearTimeout(this.#autoRemoveTimers[jobId]);
			}

			// 3秒後に自動削除
			this.#autoRemoveTimers[jobId] = setTimeout(() => {
				this.#removeJobWithAnimation(jobId);
				delete this.#autoRemoveTimers[jobId];
			}, 3000);
		}

		// アニメーション付きでJobを削除
		#removeJobWithAnimation(jobId){
			const job = this.#executingJobs[jobId];
			if(!job || !job.displayElement)return;

			// 削除アニメーションのクラスを追加
			job.displayElement.classList.add('MPLU-removing');

			// アニメーション終了後に要素を削除
			setTimeout(() => {
				if(job.displayElement){
					job.displayElement.remove();
				}
				delete this.#executingJobs[jobId];
				this.#totalJobs--;
				this.#updateTotalProgress();

				// 全てのジョブが完了したかチェック
				this.#checkAllJobsCompleted();
			}, 150); // アニメーション時間と同じ
		}

		// Job を画面に描画
		#renderJob(jobId){
			const job = this.#executingJobs[jobId];
			if(!job)return;

			// トースト使用時はパネル描画をスキップ
			if(job.useToast)return;

			this.#renderJobToPanel(job, jobId);

			// 既存の SubJob を描画
			job.subJobs.forEach(subJob => {
				this.#renderSubJob(jobId, subJob.id);
			});
		}

		// SubJob を画面に描画
		#renderSubJob(jobId, subJobId, place = null, insertTargetId = null){
			const job = this.#executingJobs[jobId];
			if(!job || !job.displayElement)return;

			const subJob = job.subJobs.find(sj => sj.id === subJobId);
			if(!subJob)return;

			const subJobContainer = job.displayElement.querySelector('.MPLU-jobSubJobsContainer');
			if(!subJobContainer)return;

			// 円形プログレスバーのパーセント計算
			const percent = subJob.total === 0 ? 0 : (subJob.progress / subJob.total) * 100;
			const radius = 10;
			const circumference = 2 * Math.PI * radius;
			const offset = circumference * (1 - percent / 100);

			// SubJob の表示要素を作成
			const subJobElement = h('div', {
					className: 'MPLU-subJobItem',
					dataset: {
						subJobId: subJobId,
						status: subJob.status || 'pending',
					},
					style: {
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						width: '100%',
						height: '40px',
						padding: '0 16px',
						boxSizing: 'border-box',
						'--MPLU-subjob-status-color': this.#statusColors[subJob.status ?? 'pending'],
						borderBottom: `1px solid ${colors.get('borderColor')}`,
						borderLeft: `1px solid ${colors.get('borderColor')}`,
					},
				},
				// ステータスインジケーター(小さい点)
				h('div', {
						className: 'MPLU-subJobStatusIndicator',
						style: {
							width: '8px',
							height: '8px',
							borderRadius: '50%',
							marginRight: '8px',
							backgroundColor: `var(--MPLU-subjob-status-color)`,
						},
					}
				),
				// タイトル
				h('div', {
						className: 'MPLU-subJobTitle',
						style: {
							flexGrow: '1',
							fontSize: '14px',
						},
						textContent: subJob.subJobName,
					}
				),
				// 進捗テキスト
				h('div', {
						className: 'MPLU-subJobProgress',
						style: {
							fontSize: '12px',
							marginRight: '8px',
							minWidth: '50px',
							textAlign: 'right',
							color: 'var(--MPLU-text1)',
						},
						textContent: `${subJob.progress}/${subJob.total}`,
					}
				),
				// 円形プログレスバー
				h('div', {
						className: 'MPLU-subJobProgressBarContainer',
						style: {
							width: '24px',
							height: '24px',
							flexShrink: '0',
						},
					},
					h('svg', {
							class: 'MPLU-subJobProgressSVG',
							style: {
								width: '100%',
								height: '100%',
								transform: 'rotate(-90deg)',
								color: 'var(--MPLU-subjob-status-color)',
							},
							viewBox: '0 0 24 24',
						},
						// 背景円
						h('circle', {
								class: 'MPLU-subJobProgressCircleBackground',
								cx: '12',
								cy: '12',
								r: '10',
								fill: 'none',
								stroke: colors.get('borderColor'),
								'stroke-width': '2',
							}
						),
						// 進捗円
						h('circle', {
								class: 'MPLU-subJobProgressCircle',
								cx: '12',
								cy: '12',
								r: '10',
								fill: 'none',
								style: {
									transition: 'stroke-dashoffset 0.3s ease',
									stroke: 'currentColor',
									strokeDashoffset: `${offset}`,
									strokeDasharray: `${circumference}`,
									strokeWidth: '2',
									strokeLinecap: 'round',
								},
							}
						)
					)
				),
			);

			subJob.displayElement = subJobElement;

			// 挿入位置を決定
			if(place === 'after' && insertTargetId){
				const targetSubJob = job.subJobs.find(sj => sj.id === insertTargetId);
				if(targetSubJob && targetSubJob.displayElement){
					targetSubJob.displayElement.after(subJobElement);
					return;
				}
			}else if(place === 'before' && insertTargetId){
				const targetSubJob = job.subJobs.find(sj => sj.id === insertTargetId);
				if(targetSubJob && targetSubJob.displayElement){
					targetSubJob.displayElement.before(subJobElement);
					return;
				}
			}

			// デフォルトは末尾に追加
			subJobContainer.appendChild(subJobElement);
		}

		/**
		 * @param {Object} options
		 * @param {string} options.action - 'createJob' | 'addSubJob' | 'updateProgress' | 'setProgress' | 'setTotal' | 'setStatus' | 'setName' | 'start' | 'remove'
		 * @param {string} [options.jobId] - Job ID (addSubJob, updateProgress等で必要)
		 * @param {string} [options.subJobId] - SubJob ID (updateProgress等で必要)
		 * @param {string} [options.name] - Job/SubJob名
		 * @param {number} [options.progress] - 進捗値
		 * @param {number} [options.total] - 合計値
		 * @param {string} [options.status] - ステータス ('pending' | 'success' | 'error')
		 * @param {string} [options.place] - 挿入位置 ('top' | 'bottom' | 'before' | 'after')
		 * @param {string} [options.insertTargetId] - 挿入基準となるSubJob ID
		 * @param {number} [options.increment] - 進捗加算値
		 * @param {boolean} [options.useToast] - トースト通知を使用するか（デフォルト: モバイルはtrue、PCはfalse）
		 * @returns {Object|null} - Job/SubJobオブジェクト、または結果
		 */
		execute({action, jobId, subJobId, name, progress = 0, total = 0, status, place, insertTargetId, increment = 1, subJobs = [], useToast} = {}){
			switch(action){
				case 'createJob':
					return this.#createJob({name, progress, total, subJobs, useToast});

				case 'addSubJob':
					return this.#addSubJob({jobId, name, place, insertTargetId, progress, total});

				case 'updateProgress':
					return this.#updateProgressInternal({jobId, subJobId, increment});

				case 'setProgress':
					return this.#setProgressInternal({jobId, subJobId, progress});

				case 'setTotal':
					return this.#setTotalInternal({jobId, subJobId, total});

				case 'setStatus':
					return this.#setStatusInternal({jobId, subJobId, status});

				case 'setName':
					return this.#setNameInternal({jobId, subJobId, name});

				case 'start':
					return this.#startJob({jobId});

				case 'remove':
					return this.#removeJob({jobId});

				default:
					console.warn(`Unknown action: ${action}`);
					return null;
			}
		}

		// 既存のメソッドを内部メソッドに変更
		#createJob({name = '', progress = 0, total = 0, subJobs = [], useToast} = {}){
			// useToastのデフォルト値を決定（未指定の場合はデバイスに応じて）
			const shouldUseToast = useToast !== undefined ? useToast : isMobile;

			// 必要に応じてUIを初期化
			if(shouldUseToast && !this.#isToastInitialized){
				this.#initToastContainer();
			}
			if(!shouldUseToast && !this.#isPanelInitialized){
				this.#initNotifyPanel();
			}

			const jobId = `job-${this.#jobIndex}`;
			this.#jobIndex++;
			this.#executingJobs[jobId] = {
				jobName: name,
				progress,
				total,
				status: 'pending',
				displayElement: null,
				subJobs: [],
				isRendered: false,
				useToast: shouldUseToast, // ジョブごとにトースト使用フラグを保持
			};
			return {jobId, subJobId: null, execute: this.execute.bind(this)};
		}

		#setNameInternal({jobId, subJobId, name} = {}){
			if(subJobId){
				const job = this.#executingJobs[jobId];
				if(!job)return;

				const subJob = job.subJobs.find(sj => sj.id === subJobId);
				if(!subJob)return;

				subJob.subJobName = name;
				this.#updateSubJobDisplay(jobId, subJobId);
			}else{
				const job = this.#executingJobs[jobId];
				if(!job)return;

				job.jobName = name;
				this.#updateJobDisplay(jobId);
			}
		}

		#setStatusInternal({jobId, subJobId, status} = {}){
			if(!['pending', 'success', 'error'].includes(status)){
				console.warn(`Invalid status: ${status}`);
				return;
			}

			if(subJobId){
				const job = this.#executingJobs[jobId];
				if(!job)return;

				const subJob = job.subJobs.find(sj => sj.id === subJobId);
				if(!subJob)return;

				subJob.status = status;
				this.#updateSubJobDisplay(jobId, subJobId);
				this.#updateJobProgress(jobId);
			}else{
				const job = this.#executingJobs[jobId];
				if(!job)return;

				const previousStatus = job.status;
				job.status = status;

				// 完了時の処理（共通化）
				if(previousStatus === 'pending' && (status === 'success' || status === 'error')){
					this.#handleJobCompletion(jobId, job);
				}else if(!job.useToast){
					this.#updateJobDisplay(jobId);
				}
			}
		}

		#addSubJob({jobId, name = '', place = 'bottom', insertTargetId, progress = 0, total = 0} = {}){
			const job = this.#executingJobs[jobId];
			if(!job){
				console.warn(`Job not found: ${jobId}`);
				return {jobId, subJobId: null, execute: this.execute.bind(this)};
			}

			const subJobId = `subjob-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			const subJob = {
				id: subJobId,
				subJobName: name,
				progress,
				total,
				status: 'pending',
				displayElement: null,
			};

			// SubJobを配列に挿入
			switch(place){
				case 'top':
					job.subJobs.unshift(subJob);
					break;
				case 'bottom':
					job.subJobs.push(subJob);
					break;
				case 'after':
					{
						const targetIndex = job.subJobs.findIndex((sj) => sj.id === insertTargetId);
						if(targetIndex !== -1){
							job.subJobs.splice(targetIndex + 1, 0, subJob);
						}else{
							job.subJobs.push(subJob);
						}
					}
					break;
				case 'before':
					{
						const targetIndex = job.subJobs.findIndex((sj) => sj.id === insertTargetId);
						if(targetIndex !== -1){
							job.subJobs.splice(targetIndex, 0, subJob);
						}else{
							job.subJobs.push(subJob);
						}
					}
					break;
				default:
					job.subJobs.push(subJob);
			}

			if(job.isRendered){
				this.#renderSubJob(jobId, subJobId, place, insertTargetId);
			}

			return {jobId, subJobId, execute: this.execute.bind(this)};
		}

		#updateProgressInternal({jobId, subJobId, increment = 1} = {}){
			const job = this.#executingJobs[jobId];
			if(!job)return;

			const subJob = job.subJobs.find(sj => sj.id === subJobId);
			if(!subJob)return;

			subJob.progress = Math.min(subJob.progress + increment, subJob.total);

			if(subJob.progress >= subJob.total && subJob.status === 'pending'){
				subJob.status = 'success';
			}

			this.#updateSubJobDisplay(jobId, subJobId);
			this.#updateJobProgress(jobId);
		}

		#setProgressInternal({jobId, subJobId, progress} = {}){
			const job = this.#executingJobs[jobId];
			if(!job)return;

			const subJob = job.subJobs.find(sj => sj.id === subJobId);
			if(!subJob)return;

			subJob.progress = Math.min(Math.max(0, progress), subJob.total);

			if(subJob.progress >= subJob.total && subJob.status === 'pending'){
				subJob.status = 'success';
			}

			this.#updateSubJobDisplay(jobId, subJobId);
			this.#updateJobProgress(jobId);
		}

		#setTotalInternal({jobId, subJobId, total} = {}){
			const job = this.#executingJobs[jobId];
			if(!job)return;

			const subJob = job.subJobs.find(sj => sj.id === subJobId);
			if(!subJob)return;

			subJob.total = Math.max(0, total);
			this.#updateSubJobDisplay(jobId, subJobId);
			this.#updateJobProgress(jobId);
		}

		#startJob({jobId} = {}){
			const job = this.#executingJobs[jobId];
			if(!job)return;

			// トースト使用時は描画しない
			if(job.useToast)return;

			if(!job.isRendered){
				this.#renderJob(jobId);
				job.isRendered = true;

				// 通知エリアを表示
				this.#showNotifyArea();
			}
		}

		#removeJob({jobId} = {}){
			const job = this.#executingJobs[jobId];
			if(!job)return;

			// タイマーがあればキャンセル
			if(this.#autoRemoveTimers[jobId]){
				clearTimeout(this.#autoRemoveTimers[jobId]);
				delete this.#autoRemoveTimers[jobId];
			}

			// アニメーション付きで削除
			this.#removeJobWithAnimation(jobId);
		}

		// パネルにジョブを描画
		#renderJobToPanel(job, jobId){
			const jobMainInfo = h('div', {
					className: 'MPLU-jobMainInfoTitle',
					style: {
						flexGrow: '1',
						fontSize: '16px',
					},
					textContent: job.jobName,
				}
			);
			const jobMainProgress = h('div', {
					className: 'MPLU-jobMainInfoProgress',
					style: {
						fontSize: '14px',
						marginRight: '8px',
						minWidth: '60px',
						textAlign: 'right',
					},
					textContent: `${job.progress}/${job.total}`,
				}
			);
			const jobMainProgressBarContainer = h('div', {
					className: 'MPLU-jobMainInfoProgressBarContainer',
					dataset: {
						duration: '200',
						percent: `${(job.total === 0) ? 0 : (job.progress / job.total) * 100}`,
					},
					style: {
						width: '36px',
						height: '36px',
					},
				},
				h('div', {
						className: 'MPLU-jobMainInfoProgressBar',
						style: {
							width: '100%',
							height: '100%',
						},
					},
					h('svg', {
							className: 'MPLU-jobMainInfoProgressBarCircleSVG',
							style: {
								width: '100%',
								height: '100%',
								color: 'var(--MPLU-job-status-color)',
								transform: 'rotate(-90deg)',
							},
							viewBox: '0 0 36 36',
						},
						h('circle', {
								class: 'MPLU-jobMainInfoProgressBarCircleBackground',
								cx: '18',
								cy: '18',
								r: '16',
								fill: 'none',
								stroke: colors.get('borderColor'),
								strokeWidth: '4',
							}
						),
						h('circle', {
								class: 'MPLU-jobMainInfoProgressBarCircle',
								cx: '18',
								cy: '18',
								r: '16',
								fill: 'none',
								style: {
									transition: 'stroke-dashoffset 0.3s ease',
									stroke: 'currentColor',
									strokeDasharray: `${2 * Math.PI * 16}`,
									strokeDashoffset: `${2 * Math.PI * 16}`,
									strokeWidth: '4',
									strokeLinecap: 'round',
								},
							}
						)
					)
				)
			);
			const subJobsContainer = h('div', {
					className: 'MPLU-jobSubJobsContainer',
					dataset: {
						isExpanded: 'true',
					},
					style: {
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						boxSizing: 'border-box',
						paddingLeft: '1em',
					},
				}
			);
			const jobContainer = h('div', {
					className: 'MPLU-jobContainer',
					dataset: {
						jobId: jobId,
					},
					style: {
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						boxSizing: 'border-box',
						height: 'fit-content',
						minHeight: '0px',
						transition: 'border-left-color 0.2s ease',
					}
				},
				h('div', {
						className: 'MPLU-jobMainInfoContainer',
						dataset: {
							status: job.status,
						},
						style: {
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							width: '100%',
							height: '53px',
							boxSizing: 'border-box',
							padding: '0px 16px',
							borderBottom: `1px solid ${colors.get('borderColor')}`,
							cursor: 'pointer',
							'--MPLU-job-status-color': this.#statusColors[job.status],
							borderLeft: `4px solid var(--MPLU-job-status-color)`,
						},
						onClick: (e) => {
							const isSubJobsContainerExpanded = (subJobsContainer.dataset.isExpanded === 'true');
							if(isSubJobsContainerExpanded){
								subJobsContainer.dataset.isExpanded = 'false';
								subJobsContainer.style.display = 'none';
							}else{
								subJobsContainer.dataset.isExpanded = 'true';
								subJobsContainer.style.display = 'flex';
							}
						},
					},
					jobMainInfo,
					jobMainProgress,
					jobMainProgressBarContainer
				),
				subJobsContainer
			);
			this.#jobsDisplayContainer.appendChild(jobContainer);
			job.displayElement = jobContainer;
			this.#totalJobs++;
			this.#updateTotalProgress();
			return job;
		}
	}

	class DisplayWorks {
		#container = null;
		#header = null;
		#mainContainer = null;
		#footer = null;
		#movePageButton = {};
		#currentPage = {pageNum: 1, pageElement: null};
		#lastPageNum = 1;
		#apiLastPageNum = 1;
		#worksCount = 0;
		#isFirestLoad = true;
		#displayIsAiGenWorks = false;
		#getWorksDataFunction = null;
		#elementActionFunctions = {};
		#tagsInfo = null;
		#searchOptions = null;
		#popUpElements = {userPopupContainer: null, parts: {}};
		#cachedPages = {previous: {pageNum: null, pageElement: null}, next: {pageNum: null, pageElement: null}};
		#gridConfig = {colWidth: 184, gap: 24, padding: 24, minCols: 3, maxCols: 10};
		#novelGridConfig = {};
		#resizeObserver = null;
		#gridLayoutRafId = 0;
		#gridLayoutPendingWidth = 0;
		#gridLayoutLastWidth = 0;
		#gridLayoutLastApplied = {cols: 0, colWidth: 0, gap: 0};
		#aiTags = new Set([
			'AI生成', 'AI Generated', 'AI生成作品', 'AIイラスト', 'AI', 'NovelAI', 'AIGC'
		].map(s => s.toLowerCase()));
		constructor(){
			const header = h('div', {
					className: 'MPLU-displayWorksHeader',
					style: {
						display: 'flex',
						flexShrink: '0',
						height: 'var(--MPLU-displayWorksHeaderHeight)',
						width: '100%',
						borderBottom: `2px solid ${colors.get('borderColor')}`,
						boxSizing: 'border-box',
						position: 'relative',
						transition: 'height 160ms ease-in-out',
						willChange: 'height',
					},
					ref: (e) => {this.#header = {element: e, height: 128, status: 'open'};},
				}
			);
			const mainContainer = h('div', {
					className: 'MPLU-displayWorksMainContainer',
					style: {
						display: 'flex',
						position: 'relative',
						flexShrink: '0',
						height: 'var(--MPLU-displayWorksMainContainerHeight)',
						//height: 'stretch',
						//height: '-moz-available',
						//height: '-webkit-fill-available',
						width: '100%',
						overflowY: 'hidden',
						overflowX: 'hidden',
						boxSizing: 'border-box',
						transition: 'height 160ms ease-in-out',
						willChange: 'height',
					},
					ref: (e) => {
						this.#mainContainer = {element: e};
						this.#resizeObserver = new ResizeObserver((entries) => {
							const entry = entries && entries.length ? entries[0] : null;
							const w = entry?.contentRect?.width ?? e.clientWidth ?? 0;
							this.#scheduleGridLayout(w);
						});
						this.#resizeObserver.observe(e);
						this.#scheduleGridLayout(e.clientWidth);
					},
				}
			);
			const footer = h('div', {
					className: 'MPLU-displayWorksFooter',
					style: {
						display: 'flex',
						flexShrink: '0',
						height: 'var(--MPLU-displayWorksFooterHeight)',
						width: '100%',
						alignItems: 'center',
						justifyContent: 'space-evenly',
						borderTop: `1px solid ${colors.get('borderColor')}`,
						boxSizing: 'border-box',
					},
					ref: (e) => {this.#footer = {element: e, height: 44};},
				},
				h('div', {
						className: 'MPLU-displayWorksFooterDummy',
						style: {
							width: '92px',
						},
					}
				)
			);
			this.#manageMovePageButton();
			const container = h('div', {
					className: 'MPLU-container MPLU-displayWorksContainer',
					style: {
						display: 'flex',
						position: 'relative',
						height: '100%',
						width: '100%',
						minWidth: '624px',
						flexDirection: 'column',
					},
					ref: (e) => {this.#container = e;},
				},
				header,
				mainContainer,
				footer
			);
			container.style.setProperty('--MPLU-displayWorksHeaderHeight', `128px`);
			container.style.setProperty('--MPLU-displayWorksFooterHeight', `44px`);
			container.style.setProperty('--MPLU-displayWorksMainContainerHeight', `calc(100% - var(--MPLU-displayWorksHeaderHeight) - var(--MPLU-displayWorksFooterHeight))`);
		}
		#init(){
			this.#currentPage = {pageNum: 1, pageElement: null};
			this.#lastPageNum = 1;
			this.#apiLastPageNum = 1;
			this.#worksCount = 0;
			this.#isFirestLoad = true;
			this.#getWorksDataFunction = null;
			this.#displayIsAiGenWorks = false;
			this.#cachedPages = {previous: {pageNum: null, pageElement: null}, next: {pageNum: null, pageElement: null}};
			this.#tagsInfo = null;
			this.#searchOptions = null;
		}
		async inputWorks({getWorksDataFunction = (pageNum)=>{}} = {}){
			if(typeof getWorksDataFunction !== 'function')throw new Error('getWorksDataFunction must be a function');
			this.#init();
			this.#getWorksDataFunction = getWorksDataFunction;
			await this.#moveToPage({pageNum: 1});
			this.#manageMovePageButton({isFirstTime: true});
			this.#manageHeader({isFirstTime: true});
			this.#isFirestLoad = false;
		}
		getContainer(){
			return this.#container;
		}
		createGetWorksFunction({searchOptions = {}, pagePerPage = 1} = {}){
			const self = this;
			return async (pageNum = 1) =>{
				if(self.#searchOptions === null)self.#searchOptions = searchOptions;

				const result = {works: [], total: self.#worksCount, lastPage: self.#lastPageNum, popular: []};
				const apiPageStart = (pageNum - 1) * pagePerPage + 1;

				let fetchedFirst = false;
				if(self.#isFirestLoad){
					const response = await pixivApi.getSearch({...searchOptions, page: apiPageStart});
					const worksData = response?.illustManga || response?.illust || response?.novel;

					const apiLastPage = worksData?.lastPage || 0;
					self.#apiLastPageNum = apiLastPage;

					self.#lastPageNum = apiLastPage ? Math.ceil(apiLastPage / pagePerPage) : 0;
					result.lastPage = self.#lastPageNum;
					result.total = worksData?.total || 0;
					self.#worksCount = result.total;
					if(Array.isArray(worksData?.data)){
						const data = worksData.data;
						for(let j = 0, len = data.length; j < len; j++){
							result.works.push(data[j]);
						}
					}
					fetchedFirst = true;
					const tagsInfo = await pixivApi.getTagInfo({word: searchOptions.word ?? ''});
					result.tagsInfo = tagsInfo;
					self.#tagsInfo = tagsInfo;
				}else{
					result.lastPage = self.#lastPageNum;
				}
				if(!self.#apiLastPageNum || self.#apiLastPageNum < 1){
					return result;
				}
				const apiPageEnd = Math.min(self.#apiLastPageNum, apiPageStart + pagePerPage - 1);

				const tasks = [];

				let p = apiPageStart;
				if(fetchedFirst)p++;
				for(; p <= apiPageEnd; p++){
					const realPageNum = p;
					tasks.push(async () => {
						const response = await pixivApi.getSearch({...searchOptions, page: realPageNum});
						return response;
					});
				}

				const tasksResults = await parallelTask(tasks, 6);

				for(let i = 0; i < tasksResults.length; i++){
					const response = tasksResults[i];
					if(!response || response.error)continue;
					const worksData = response.illustManga || response.illust || response.novel;
					if(!worksData || !Array.isArray(worksData.data))continue;
					const data = worksData.data;
					for(let j = 0, len = data.length; j < len; j++){
						result.works.push(data[j]);
					}
				}
				return result;
			}
		}
		#manageHeader(){
			const self = this;
			if(!this.#header.main){
				this.#header.main = {};
				const mainHader = h('div', {
						className: 'MPLU-displayWorksMainHeader',
						style: {
							display: 'flex',
							position: 'absolute',
							inset: '0',
							width: '100%',
							height: '100%', // 126px
							boxSizing: 'border-box',
							flexDirection: 'row',
							alignItems: 'center',
							overflow: 'hidden',
							opacity: '1',
							transition: 'opacity 120ms ease-in-out',
							willChange: 'opacity',
						},
					},
					h('div', {
							className: 'MPLU-displayWorksMainHeaderImageContainer',
							style: {
								display: 'none', // block
								height: '122px',
								width: '122px',
							},
							ref: (e) => {this.#header.main.imageContainer = e;},
						},
						h('a', {
								className: 'MPLU-displayWorksMainHeaderImageLink',
								href: 'https://www.pixiv.net/',
								target: '_blank',
								rel: 'noopener noreferrer',
								ref: (e) => {this.#header.main.imageLink = e;},
								onclick: (e) => {
									e.stopPropagation();
									e.preventDefault();
									navigateTo(e.currentTarget.href);
								}
							},
							h('img', {
									className: 'MPLU-displayWorksMainHeaderImage',
									style: {
										objectFit: 'cover',
										objectPosition: 'center center',
										display: 'block',
										height: '120px',
										width: '120px',
										borderStyle: 'none',
									},
									ref: (e) => {this.#header.main.image = e;},
								}
							)
						)
					),
					h('div', {
							className: 'MPLU-displayWorksMainHeaderInfoContainer',
							style: {
								display: 'flex',
								flexDirection: 'column',
								width: 'calc(100% - 122px - 90px)',
								minWidth: '400px',
								marginLeft: '12px',
							}
						},
						h('div', {
								className: 'MPLU-displayWorksMainHeaderTitle',
								style: {
									fontSize: '20px',
									fontWeight: 'bold',
									lineHeight: '28px',
									whiteSpace: 'nowrap',
									color: 'var(--MPLU-text1)',
									marginBottom: '8px',
									textOverflow: 'ellipsis',
									overflow: 'hidden',
								}
							},
							h('span', {
								ref: (e) => {this.#header.main.title = e;}
							})
						),
						h('div', {
								className: 'MPLU-displayWorksMainHeaderWorksCount',
								style: {
									fontSize: '16px',
									fontWeight: 'bold',
									lineHeight: '24px',
									whiteSpace: 'nowrap',
									color: 'var(--MPLU-text1)',
									textOverflow: 'ellipsis',
									overflow: 'hidden',
								}
							},
							h('span', {
									textContent: '0',
									style: {
										color: 'var(--MPLU-text2)',
										marginRight: '4px',
									},
									ref: (e) => {this.#header.main.worksCount = e;}
								}
							),
							h('span', {
									textContent: pixivText.get('works'),
									style: {
										color: 'var(--MPLU-text3)',
									}
							})
						),
						h('div', {
								className: 'MPLU-displayWorksMainHeaderDescription',
								style: {
									marginTop: '16px',
									display: 'flex',
								}
							},
							h('p', {
									style: {
										display: 'block',
										fontSize: '14px',
										lineHeight: '22px',
										color: 'var(--MPLU-text2)',
										overflow: 'hidden',
										position: 'relative',
										textOverflow: 'ellipsis',
										margin: '0px',
									},
									ref: (e) => {this.#header.main.description = e;},
								}
							),
							h('a', {
									className: 'MPLU-displayWorksMainHeaderDescriptionMoreLink',
									textContent: pixivText.get('viewOnpixivEncyclopedia'),
									target: '_blank',
									rel: 'noopener noreferrer',
									style: {
										display: 'none',
										marginLeft: '8px',
										fontSize: '14px',
										lineHeight: '22px',
										color: 'var(--MPLU-text3)',
										whiteSpace: 'nowrap',
										textDecoration: 'none',
										backgroundColor: 'initial',
									},
									ref: (e) => {this.#header.main.descriptionMoreLink = e;}
								}
							)
						)
					)
				);
				this.#header.main.element = mainHader;
				this.#header.element.appendChild(mainHader);
			}
			if(!this.#header.mini){
				this.#header.mini = {};
				const miniHeader = h('div', {
						className: 'MPLU-displayWorksMiniHeader',
						style: {
							display: 'flex',
							position: 'absolute',
							inset: '0',
							width: '100%',
							height: '100%', // 50px
							boxSizing: 'border-box',
							alignItems: 'center',
							overflow: 'hidden',
							opacity: '0',
							transition: 'opacity 120ms ease-in-out',
							willChange: 'opacity',
						},
						ref: (e) => {this.#header.mini.element = e;},
					},
					h('div', {
							className: 'MPLU-displayWorksMiniHeaderTitle',
							style: {
								fontSize: '20px',
								fontWeight: 'bold',
								lineHeight: '28px',
								whiteSpace: 'nowrap',
								color: 'var(--MPLU-text1)',
								marginLeft: '8px',
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								maxWidth: '20em',
							}
						},
						h('span', {
							ref: (e) => {this.#header.mini.title = e;}
						})
					),
					h('div', {
							className: 'MPLU-displayWorksMiniHeaderWorksCount',
							style: {
								fontSize: '16px',
								fontWeight: 'bold',
								lineHeight: '24px',
								whiteSpace: 'nowrap',
								color: 'var(--MPLU-text1)',
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								marginLeft: '1em',
								minWidth: '5em',
							}
						},
						h('span', {
								textContent: '0',
								style: {
									color: 'var(--MPLU-text2)',
									marginRight: '4px',
								},
								ref: (e) => {this.#header.mini.worksCount = e;}
							}
						),
						h('span', {
								textContent: pixivText.get('works'),
								style: {
									color: 'var(--MPLU-text3)',
								}
						})
					)
				);
				this.#header.element.appendChild(miniHeader);
			}
			if(!this.#header.toggleButton){
				this.#header.toggleButton = h('button', {
						className: 'MPLU-displayWorksHeaderToggleButton MPLU-hoverEffect',
						style: {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							position: 'absolute',
							width: '32px',
							height: '32px',
							bottom: '8px',
							right: '18px',
							borderRadius: '4px',
							transition: 'background-color 0.2s ease-in-out, transform 160ms ease-in-out',
							cursor: 'pointer',
							willChange: 'transform',
						},
						onClick: (e) => {
							self.#elementActionFunctions.headerToggle();
						}
					},
					h('svg', {
							class: 'MPLU-displayWorksHeaderToggleButtonIcon',
							style: {
								width: '32px',
								height: '32px',
								boxSizing: 'border-box',
								border: 'none',
								fill: 'currentColor',
							},
							ref: (e) => {this.#header.toggleIcon = e;},
							viewBox: '0 0 24 24',
						},
						h('path', {
							d: 'M3.543 8.96l1.414-1.42L12 14.59l7.043-7.05 1.414 1.42L12 17.41 3.543 8.96z'
						})
					)
				);
				this.#header.element.appendChild(this.#header.toggleButton);
			}
			applyTagsInfo();
			syncToggleIcon();
			syncHeaderMode();
			self.#elementActionFunctions.headerToggle?.('open');
			function syncToggleIcon(){
				if(!self.#header?.toggleIcon)return;
				const isOpen = (self.#header.status === 'open');
				self.#header.toggleIcon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
			}
			function syncHeaderMode(){
				const isOpen = (self.#header.status === 'open');
				const mainEl = self.#header?.main?.element;
				if(mainEl){
					mainEl.style.opacity = isOpen ? '1' : '0';
					mainEl.style.pointerEvents = isOpen ? '' : 'none';
					mainEl.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
				}
				const miniEl = self.#header?.mini?.element;
				if(miniEl){
					miniEl.style.opacity = isOpen ? '0' : '1';
					miniEl.style.pointerEvents = isOpen ? 'none' : '';
					miniEl.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
				}
			}
			self.#elementActionFunctions.headerToggle = (force = undefined) => {
				if(force === 'closed')force = 'close';
				if(force === 'open' || (force === undefined && self.#header.status === 'close')){
					self.#header.status = 'open';
					self.#container.style.setProperty('--MPLU-displayWorksHeaderHeight', `128px`);
				}else if(force === 'close' || (force === undefined && self.#header.status === 'open')){
					self.#header.status = 'close';
					self.#container.style.setProperty('--MPLU-displayWorksHeaderHeight', `50px`);
				}
				syncToggleIcon();
				syncHeaderMode();
			};
			function applyTagsInfo(){
				const headerMain = self.#header?.main;
				const headerMini = self.#header?.mini;
				const tagsInfo = self.#tagsInfo || {};
				if(!tagsInfo)return;
				headerMain.title.textContent = tagsInfo.word ?? '';
				headerMini.title.textContent = tagsInfo.word ?? '';
				headerMain.worksCount.textContent = `${self.#worksCount}`;
				headerMini.worksCount.textContent = `${self.#worksCount}`;
				if(tagsInfo.pixpedia.abstract){
					headerMain.description.textContent = tagsInfo.pixpedia.abstract;
					headerMain.descriptionMoreLink.style.display = 'block';
					headerMain.descriptionMoreLink.href = `https://dic.pixiv.net/a/${encodeURIComponent(tagsInfo.tag)}`;
					if(tagsInfo.pixpedia.image){
						headerMain.image.src = tagsInfo.pixpedia.image;
						headerMain.imageLink.href = `https://www.pixiv.net/artworks/${tagsInfo.pixpedia.id}`;
						headerMain.imageContainer.style.display = 'block';
					}else{
						headerMain.image.src = '';
						headerMain.imageLink.href = '#';
						headerMain.imageContainer.style.display = 'none';
					}
				}else{
					headerMain.description.textContent = '';
					headerMain.descriptionMoreLink.style.display = 'none';
					headerMain.image.src = '';
					headerMain.imageLink.href = '#';
					headerMain.imageContainer.style.display = 'none';
				}
			}
		}
		#manageMovePageButton({isFirstTime = false} = {}){
			const self = this;
			if(!this.#movePageButton.container){
				const movePageButtopnContainer = h('div', {
						className: 'MPLU-movePageButtonContainer',
						style: {
							display: 'flex',
							height: '100%',
							width: '440px',
							alignItems: 'center',
							justifyContent: 'center',
						},
						ref: (e) => {this.#movePageButton.container = e;},
					},
					h('a', {
							className: 'MPLU-movePageButtonPrevious MPLU-pageMoveButton disabled',
							onClick: async (e) => {
								e.preventDefault();
								if(this.#currentPage.pageNum > 1){
									await this.#moveToPage({pageNum: this.#currentPage.pageNum - 1, pageMoveType: 'previous'});
								}
							},
							ref: (e) => {this.#movePageButton.previous = e;}
						},
						h('svg', {
								class: 'MPLU-movePageButtonPreviousIcon',
								viewBox: '0 0 10 8',
								width: '16',
								height: '16',
							},
							h('polyline', {
									points: '1,2 5,6 9,2',
									fill: 'none',
									stroke: 'currentColor',
									'stroke-linejoin': 'round',
									'stroke-linecap': 'round',
									'stroke-width': '2',
									transform: 'rotate(90 5 4)',
							})
						)
					),
					h('div', {
							className: 'MPLU-movePageButtonDirectJumpContainer',
							style: {
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							},
							ref: (e) => {this.#movePageButton.directJumpContainer = e;},
						},
						h('a', {
								className: 'MPLU-movePageButtonDirectJump MPLU-pageMoveButton active',
								textContent: '1',
								onClick: async (e) => {
									e.preventDefault();
									await jumpPageButton(1);
								}
							}
						)
					),
					h('a', {
							className: 'MPLU-movePageButtonNext MPLU-pageMoveButton disabled',
							onClick: async (e) => {
								e.preventDefault();
								if(this.#currentPage.pageNum < this.#lastPageNum){
									await this.#moveToPage({pageNum: this.#currentPage.pageNum + 1, pageMoveType: 'next'});
								}
							},
							ref: (e) => {this.#movePageButton.next = e;}
						},
						h('svg', {
								class: 'MPLU-movePageButtonNextIcon',
								viewBox: '0 0 10 8',
								width: '16',
								height: '16',
							},
							h('polyline', {
									points: '1,2 5,6 9,2',
									fill: 'none',
									stroke: 'currentColor',
									'stroke-linejoin': 'round',
									'stroke-linecap': 'round',
									'stroke-width': '2',
									transform: 'rotate(-90 5 4)',
							})
						)
					),
				);
				this.#footer.element.appendChild(movePageButtopnContainer);
				const reserveJumpContainer = h('div', {
						className: 'MPLU-movePageButtonReserveJumpContainer',
						style: {
							display: 'flex',
							width: '92px',
							alignItems: 'center',
							borderBottom: `2px solid ${colors.get('borderColor')}`,
						},
						ref: (e) => {this.#movePageButton.reserveJumpContainer = e;},
					},
					h('div', {
							className: 'MPLU-movePageButtonReserveJumpInputContainer',
							style: {
								display: 'flex',
								borderRadius: '4px',
								boxSizing: 'border-box',
							},
							ref: (e) => {this.#movePageButton.reserveJumpInputContainer = e;},
						},
						h('input', {
								className: 'MPLU-movePageButtonReserveJumpInput',
								type: 'number',
								min: '1',
								max: `${this.#lastPageNum}`,
								placeholder: 'Page',
								style: {
									color: 'var(--MPLU-font-color-dark)',
									background: 'none',
									outline: 'none',
									border: 'none',
									width: '4em',
								},
								onkeydown: async (e) => {
									if(e.key !== 'Enter')return;
									e.preventDefault();
									const raw = e.currentTarget.value;
									const n = raw ? parseInt(raw, 10) : NaN;
									if(!Number.isFinite(n))return;
									const pageNum = Math.max(1, Math.min(this.#lastPageNum, n));
									await jumpPageButton(pageNum);
								},
								onfocusin: (e) => {
									this.#movePageButton.reserveJumpInputContainer.style.boxShadow = '0 0 0 4px rgba(0,150,250,.32)';
								},
								onfocusout: (e) => {
									this.#movePageButton.reserveJumpInputContainer.style.boxShadow = 'none';
								},
								ref: (e) => {this.#movePageButton.reserveJumpInput = e;}
						})
					),
					h('span', {
							className: 'MPLU-movePageButtonReserveJumpMaxPageNum',
							textContent: `/${this.#lastPageNum}`,
							style: {
								marginLeft: '1em',
							},
							ref: (e) => {this.#movePageButton.reserveJumpMaxPageNum = e;},
					})
				);
				this.#footer.element.appendChild(reserveJumpContainer);
			}
			if(this.#currentPage.pageNum > 1){
				this.#movePageButton.previous.classList.remove('disabled');
			}else{
				this.#movePageButton.previous.classList.add('disabled');
			}
			if(this.#currentPage.pageNum < this.#lastPageNum){
				this.#movePageButton.next.classList.remove('disabled');
			}else{
				this.#movePageButton.next.classList.add('disabled');
			}
			if(isFirstTime){
				this.#movePageButton.reserveJumpInput.max = `${this.#lastPageNum}`;
				this.#movePageButton.reserveJumpMaxPageNum.textContent = `/${this.#lastPageNum}`;
			}
			adjustDirectJumpButtons();
			function adjustDirectJumpButtons(){
				if(!self.#movePageButton.directJumpContainer)return;

				const container = self.#movePageButton.directJumpContainer;
				container.innerHTML = '';
				const fragment = document.createDocumentFragment();
				const tokens = buildDirectJumpTokens(self.#currentPage.pageNum, self.#lastPageNum);

				for(let i = 0; i < tokens.length; i++){
					const t = tokens[i];
					if(t.type === 'sep'){
						fragment.appendChild(createSeparatorButton());
					}else{
						const isActive = (t.pageNum === self.#currentPage.pageNum);
						fragment.appendChild(createJumpButton(t.pageNum, isActive));
					}
				}
				container.appendChild(fragment);
			}

			function buildDirectJumpTokens(current, last){
				// last は 1以上の想定
				if(last <= 9){
					const out = [];
					for(let p = 1; p <= last; p++){
						out.push({type: 'page', pageNum: p});
					}
					return out;
				}

				// 先頭付近: 1..7 + Sep + last
				if(current <= 4){
					const out = [];
					for(let p = 1; p <= 7; p++){
						out.push({type: 'page', pageNum: p});
					}
					out.push({type: 'sep'});
					out.push({type: 'page', pageNum: last});
					return out;
				}

				// 末尾付近: 1 + Sep + (last-6..last)
				if(current >= last - 3){
					const out = [{type: 'page', pageNum: 1}, {type: 'sep'}];
					const start = last - 6; // last>9 のとき 2以上になる
					for(let p = start; p <= last; p++){
						out.push({type: 'page', pageNum: p});
					}
					return out;
				}

				// 真ん中: 1 + Sep + (current-1..current+3) + Sep + last
				{
					const out = [{type: 'page', pageNum: 1}, {type: 'sep'}];
					for(let p = current - 1; p <= current + 3; p++){
						out.push({type: 'page', pageNum: p});
					}
					out.push({type: 'sep'});
					out.push({type: 'page', pageNum: last});
					return out;
				}
			}
			function createJumpButton(pageNum, isActive){
				const button = h('a', {
						className: `MPLU-movePageButtonDirectJump MPLU-pageMoveButton ${isActive ? 'active' : ''}`,
						textContent: `${pageNum}`,
						onClick: async (e) => {
							e.preventDefault();
							await jumpPageButton(pageNum);
						}
					}
				);
				return button;
			}
			function createSeparatorButton(){
				const button = h('button', {
						className: 'MPLU-movePageButtonDirectJumpSeparator MPLU-pageMoveButton',
						style: {
							background: 'none',
						}
					},
					h('svg', {
							viewBox: '0 0 24 24',
							size: '24',
						},
						h('path', {
							d: 'M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z',
							fill: 'currentColor',
						})
					)
				);
				return button;
			}
			async function jumpPageButton(pageNum){
				if(pageNum !== self.#currentPage.pageNum){
					await self.#moveToPage({pageNum, pageMoveType: 'jump'});
				}
			}
		}
		#scheduleGridLayout(width){
			if(!this.#mainContainer || !this.#mainContainer.element)return;
			if(!Number.isFinite(width) || width <= 0)return;
			if(width === this.#gridLayoutLastWidth && !this.#gridLayoutRafId)return;
			this.#gridLayoutPendingWidth = width;
			if(this.#gridLayoutRafId)return;
			this.#gridLayoutRafId = requestAnimationFrame(() => {
				this.#gridLayoutRafId = 0;
				this.#gridLayoutLastWidth = this.#gridLayoutPendingWidth;
				this.#adjustGridLayout(this.#gridLayoutLastWidth);
			});
		}
		#adjustGridLayout(containerWidth = 0){
			if(!this.#mainContainer || !this.#mainContainer.element)return;
			const targetElement = this.#mainContainer.element;
			const w = (containerWidth && containerWidth > 0) ? containerWidth : targetElement.clientWidth;
			if(!w || w <= 0)return;
			const {colWidth, gap, padding, minCols, maxCols} = this.#gridConfig;
			let cols = Math.floor((w - (padding * 2) + gap) / (colWidth + gap));
			cols = Math.max(minCols, Math.min(maxCols, cols));
			const last = this.#gridLayoutLastApplied;
			const gapPx = `${gap}px`;
			const colWidthPx = `${colWidth}px`;
			if(last.gap !== gap){
				targetElement.style.setProperty('--MPLU-grid-gap', gapPx);
				last.gap = gap;
			}
			if(last.colWidth !== colWidth){
				targetElement.style.setProperty('--MPLU-col-width', colWidthPx);
				last.colWidth = colWidth;
			}
			if(last.cols !== cols){
				targetElement.style.setProperty('--MPLU-grid-cols', `${cols}`);
				last.cols = cols;
			}
		}
		/*
		async #preLoadPage(){
			if(!this.#usePreLoad)return;
			if(this.#currentPage.pageNum > 1 && (!this.#preLoadPages.previous.pageElement || this.#preLoadPages.previous.pageNum !== this.#currentPage.pageNum - 1)){
				const previousPageNum = this.#currentPage.pageNum - 1;
				const worksData = this.#getWorksDataFunction(previousPageNum);
				const pageElement = await this.#createPageElement(worksData);
				this.#preLoadPages.previous = {pageNum: previousPageNum, pageElement};
			}
			if(this.#currentPage.pageNum < this.#lastPageNum && (!this.#preLoadPages.next.pageElement || this.#preLoadPages.next.pageNum !== this.#currentPage.pageNum + 1)){
				const nextPageNum = this.#currentPage.pageNum + 1;
				const worksData = this.#getWorksDataFunction(nextPageNum);
				const pageElement = await this.#createPageElement(worksData);
				this.#preLoadPages.next = {pageNum: nextPageNum, pageElement};
			}
			return;
		}
		*/
		/*
		#getDisplayablePageNumbers(){
			const result = new Set([
				this.#currentPage.pageNum,
				this.#cachedPages.previous.pageNum,
				this.#cachedPages.next.pageNum,
				this.#preLoadPages.previous.pageNum,
				this.#preLoadPages.next.pageNum
			]);
			result.delete(null);
			return result;
		}
		*/
		async #moveToPage({pageNum, pageMoveType} = {}){
			let targetPageNum = pageNum;

			if(pageMoveType === 'previous'){
				targetPageNum = this.#currentPage.pageNum - 1;
			}else if(pageMoveType === 'next'){
				targetPageNum = this.#currentPage.pageNum + 1;
			}else if(pageMoveType === 'jump'){
				targetPageNum = pageNum;
			}
			if(typeof targetPageNum !== 'number' || !Number.isFinite(targetPageNum)){
				throw new Error('Invalid page number');
			}
			if(this.#lastPageNum && this.#lastPageNum >= 1){
				targetPageNum = Math.max(1, Math.min(this.#lastPageNum, targetPageNum));
			}else{
				targetPageNum = Math.max(1, targetPageNum);
			}
			if(this.#currentPage.pageNum === targetPageNum && this.#currentPage.pageElement){
				this.#displayPage();
				return;
			}
			let nextPage = null;
			if(this.#cachedPages.previous && this.#cachedPages.previous.pageNum === targetPageNum && this.#cachedPages.previous.pageElement){
				nextPage = this.#cachedPages.previous;
			}else if(this.#cachedPages.next && this.#cachedPages.next.pageNum === targetPageNum && this.#cachedPages.next.pageElement){
				nextPage = this.#cachedPages.next;
			}
			const prevCurrent = this.#currentPage;
			if(nextPage){
				this.#currentPage = {pageNum: nextPage.pageNum, pageElement: nextPage.pageElement};
			}else{
				const worksData = this.#getWorksDataFunction(targetPageNum);
				const pageElement = await this.#createPageElement({_worksData: worksData, pageNum: targetPageNum});
				this.#currentPage = {pageNum: targetPageNum, pageElement};
			}
			this.#cachedPages.previous = prevCurrent && prevCurrent.pageElement
				? {pageNum: prevCurrent.pageNum, pageElement: prevCurrent.pageElement}
				: {pageNum: null, pageElement: null};

			this.#cachedPages.next = {pageNum: null, pageElement: null};

			this.#manageMovePageButton();
			this.#displayPage();
			if(pageNum !== 1)this.#elementActionFunctions.headerToggle?.('close');
			return;
		}
		async #createPageElement({_worksData, pageNum} = {}){
			const self = this;
			const worksData = await _worksData ?? [];
			const works = worksData.works;
			if(!works || works.length === 0)throw new Error('No works data provided');
			const pageElement = h('div', {
					className: 'MPLU-displayWorksPageContainer',
					dataset: {
						pageNum: `${pageNum}`,
					},
					style: {
						display: 'flex',
						padding: '24px',
						margin: '0',
						boxSizing: 'border-box',
						width: '100%',
						height: '100%',
						minHeight: '250px',
						overflowY: 'auto',
						overflowX: 'hidden',
						justifyContent: 'center',
					},
				}
			);
			if(pageNum === 1){
				const onScroll = (e) => {
					const el = e.currentTarget;
					if(!el)return;
					if(el.scrollTop >= 200){
						self.#elementActionFunctions.headerToggle?.('close');
						el.removeEventListener('scroll', onScroll);
					}
				};
				pageElement.addEventListener('scroll', onScroll, {passive: true});
			}
			const displayGrid = h('ul', {
					className: 'MPLU-displayWorksGrid',
					style: {
						display: 'grid',
						gridTemplateColumns: 'repeat(var(--MPLU-grid-cols), var(--MPLU-col-width))',
						gap: 'var(--MPLU-grid-gap)',
						listStyle: 'none',
						margin: '0px',
						padding: '0px',
					},
				}
			);
			for(let i = 0; i < works.length; i++){
				const workData = works[i];
				if(workData?.isAdContainer)continue;
				const workElement = createWorkElement(workData);
				displayGrid.appendChild(workElement);
			}
			pageElement.appendChild(displayGrid);
			return pageElement;
			function createWorkElement(workData){
				const infomationContainer = h('div', {
						className: 'MPLU-displayWorksGridWorkInfomationContainer',
						style: {
							position: 'absolute',
							top: '0',
							left: '0',
							right: '0',
							boxSizing: 'border-box',
							display: 'flex',
							alignItems: 'flex-start',
							padding: '4px 4px 0px',
							pointerEvents: 'none',
						}
					},
					workData.tags.includes('R-18') ?
					h('div', {
							className: 'MPLU-displayWorksGridWorkR18Badge',
							style: {
								display: 'flex',
								alignItems: 'flex-start',
								flexFlow: 'wrap',
							}
						},
						h('div', {
								className: 'MPLU-displayWorksGridWorkR18BadgeInner',
								style: {
									marginRight: '2px',
								}
							},
							h('div', {
									className: 'MPLU-displayWorksGridWorkR18BadgeText',
									style: {
										padding: '0px 4px',
										borderRadius: '4px',
										color: 'var(--MPLU-text1)',
										backgroundColor: 'var(--MPLU-r18)',
										fontWeight: 'bold',
										fontSize: '10px',
										lineHeight: '16px',
										userSelect: 'none',
									},
									textContent: 'R-18',
								}
							)
						)
					) : null,
					(self.#isAi(workData) && self.#displayIsAiGenWorks) ?
					h('div', {
							className: 'MPLU-displayWorksGridWorkAiGenBadge',
							style: {
								display: 'flex',
								alignItems: 'flex-start',
								flexFlow: 'wrap',
							}
						},
						h('div', {
								className: 'MPLU-displayWorksGridWorkAiGenBadgeInner',
								style: {
									marginRight: '2px',
								}
							},
							h('div', {
									className: 'MPLU-displayWorksGridWorkAiGenBadgeText',
									style: {
										padding: '0px 4px',
										borderRadius: '4px',
										color: 'var(--MPLU-text1)',
										backgroundColor: 'var(--MPLU-warning)',
										fontWeight: 'bold',
										fontSize: '10px',
										lineHeight: '16px',
										userSelect: 'none',
									},
									textContent: 'AI',
								}
							)
						)
					) : null,
					workData.pageCount > 1 ?
					h('div', {
							className: 'MPLU-displayWorksGridWorkMultiPageBadge',
							style: {
								marginLeft: 'auto',
							}
						},
						h('div', {
								className: 'MPLU-displayWorksGridWorkMultiPageBadgeInner',
								style: {
									display: 'flex',
									'-moz-box-pack': 'center',
									justifyContent: 'center',
									'-moz-box-align': 'center',
									alignItems: 'center',
									flex: '0 0 auto',
									boxSizing: 'border-box',
									height: '20px',
									minWidth: '20px',
									color: 'var(--MPLU-text1)',
									fontWeight: 'bold',
									padding: '0px 6px',
									backgroundColor: 'var(--MPLU-surface4)',
									borderRadius: '10px',
									fontSize: '10px',
									lineHeight: '10px',
								}
							},
							h('span', {
									style: {
										marginRight: '2px',
									}
								},
								h('span', {
										style: {
											display: 'inline-flex',
											verticalAlign: 'top',
											'-moz-box-align': 'center',
											alignItems: 'center',
											height: '10px',
										}
									},
									h('svg', {
											style: {
												stroke: 'none',
												fill: 'currentColor',
												width: '9px',
												lineHeight: '0',
												fontSize: '0px',
											},
											viewBox: '0 0 9 10',
											size: '9'
										},
										h('path', {
											transform: "",
											d: 'M8,3 C8.55228475,3 9,3.44771525 9,4 L9,9 C9,9.55228475 8.55228475,10 8,10 L3,10 C2.44771525,10 2,9.55228475 2,9 L6,9 C7.1045695,9 8,8.1045695 8,7 L8,3 Z M1,1 L6,1 C6.55228475,1 7,1.44771525 7,2 L7,7 C7,7.55228475 6.55228475,8 6,8 L1,8 C0.44771525,8 0,7.55228475 0,7 L0,2 C0,1.44771525 0.44771525,1 1,1 Z'
										})
									)
								)
							),
							h('span', {
									className: 'MPLU-displayWorksGridWorkMultiPageBadgeText',
									textContent: `${workData.pageCount}`,
							})
						)
					) : null,
				);

				const favoriteElements = {};
				const favoriteContainer = h('div', {
						className: 'MPLU-displayWorksGridWorkFavoritButtonContainer',
						style: {
							position: 'absolute',
							bottom: '0px',
							right: '0px',
							height: '32px',
							display: 'flex',
							'-moz-box-pack': 'end',
							justifyContent: 'flex-end',
						}
					},
					h('div', {
						},
						h('button', {
								className: 'MPLU-displayWorksGridWorkFavoritButton',
								dataset: {
									bookmarkId: workData?.bookmarkData?.id ?? 'null',
								},
								style: {
									display: 'block',
									boxSizing: 'border-box',
									padding: '0px',
									color: workData?.bookmarkData?.id ? 'var(--MPLU-like)' : 'var(--MPLU-text5)',
									background: 'none',
									border: 'medium',
									lineHeight: '1',
									height: '32px',
									cursor: 'pointer',
								},
								onclick: async (e) => {
									e.target.disabled = true;
									try{
										const response = await bookmarkButtonClicked({e, workId: workData.id});
										if(response.bookmarkId){
											e.currentTarget.dataset.bookmarkId = response.bookmarkId;
											e.currentTarget.style.color = 'var(--MPLU-like)';
										}else{
											e.currentTarget.dataset.bookmarkId = 'null';
											e.currentTarget.style.color = 'var(--MPLU-text5)';
											if(favoriteElements.privateIconBg){
												favoriteElements.privateIconBg.remove();
											}
											if(favoriteElements.privateIcon){
												favoriteElements.privateIcon.remove();
											}
										}
									}catch(err){
										console.error('Error in bookmarkButtonClicked:', err);
										customAlert(envTextData.alternativeSearch.bookmarkApiFailed);
									}finally{
										e.target.disabled = false;
									}
								}
							},
							h('svg', {
									className: 'MPLU-displayWorksGridWorkFavoritButtonIcon',
									viewBox: '0 0 32 32',
									width: '32',
									height: '32',
									style: {
										boxSizing: 'border-box',
										lineHeight: '0',
										fontSize: '0',
										verticalAlign: 'top',
										transition: 'color 0.2s, fill 0.2s',
										color: 'inherit',
										fill: 'currentColor',
									}
								},
								h('path', {
									style: {
										color: 'var(--MPLU-surface1)',
										fill: 'currentColor',
									},
									d: 'M21,5.5 C24.8659932,5.5 28,8.63400675 28,12.5 C28,18.2694439 24.2975093,23.1517313 17.2206059,27.1100183 C16.4622493,27.5342993 15.5379984,27.5343235 14.779626,27.110148 C7.70250208,23.1517462 4,18.2694529 4,12.5 C4,8.63400691 7.13400681,5.5 11,5.5 C12.829814,5.5 14.6210123,6.4144028 16,7.8282366 C17.3789877,6.4144028 19.170186,5.5 21,5.5 Z'
								}),
								h('path', {
									style: {
										fill: 'currentColor',
									},
									d: 'M16,11.3317089 C15.0857201,9.28334665 13.0491506,7.5 11,7.5 C8.23857625,7.5 6,9.73857647 6,12.5 C6,17.4386065 9.2519779,21.7268174 15.7559337,25.3646328 C15.9076021,25.4494645 16.092439,25.4494644 16.2441073,25.3646326 C22.7480325,21.7268037 26,17.4385986 26,12.5 C26,9.73857625 23.7614237,7.5 21,7.5 C18.9508494,7.5 16.9142799,9.28334665 16,11.3317089 Z'
								}),
								workData?.bookmarkData?.private ?
								h('path', {
									style: {
										color: 'var(--MPLU-text5)',
										fill: 'currentColor',
										fillRule: 'evenodd',
										clipRule: 'evenodd',
									},
									d: 'M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28 C32 30.2091 30.2091 32 28 32H21C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234 C19.2619 17.709 21.623 15.5 24.5 15.5C27.377 15.5 29.7381 17.709 29.9796 20.5234Z',
									ref: (e) => {favoriteElements.privateIconBg = e;},
								}) : null,
								workData?.bookmarkData?.private ?
								h('path', {
									style: {
										color: 'var(--MPLU-surface8)',
										fill: 'currentColor',
										fillRule: 'evenodd',
										clipRule: 'evenodd',
									},
									d: 'M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21 C19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 22.567 17.5 24.5 17.5 C26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 26 20.1716 26 21V22H23 V21Z',
									ref: (e) => {favoriteElements.privateIcon = e;},
								})
								: null,
							)
						)
					)
				);

				const workElement = h('li', {
						className: 'MPLU-displayWorksGridItem',
						dataset: {
							workId: workData.id,
						},
						style: {
							height: '238px',
							width: '184px'
						},
					},
					h('div', {
							className: 'MPLU-displayWorksGridItemInner',
							style: {
								position: 'relative',
								width: '184px',
								height: '184px',
								overflow: 'hidden',
								borderRadius: '8px',
								maskImage: '-webkit-radial-gradient(white, black)',
							}
						},
						h('a', {
								className: 'MPLU-displayWorksGridWorkLink',
								href: `https://www.pixiv.net/artworks/${workData.id}`,
								target: '_blank',
								rel: 'noopener noreferrer',
								style: {
									textDecoration: 'none',
									display: 'block',
									width: '100%',
									height: '100%',
								},
								onclick: (e) => {
									e.preventDefault();
									navigateTo(e.currentTarget.href);
								}
							},
							h('div', {
									className: 'MPLU-displayWorksGridWorkImageContainer',
									style: {
										position: 'relative',
										width: '100%',
										height: '100%',
									}
								},
								h('div', {
										className: 'MPLU-displayWorksGridWorkImageInnerContainer',
										style: {
											position: 'relative',
											display: 'flex',
											'-moz-box-align': 'center',
											alignItems: 'center',
											'-moz-box-pack': 'center',
											justifyContent: 'center',
											width: '100%',
											height: '100%',
										},
										radius: '4'
									},
									h('img', {
											className: 'MPLU-displayWorksGridWorkImage',
											src: workData.url,
											loading: 'lazy',
											style: {
												height: '184px',
												width: '184px',
											}
										}
									)
								),
							),
							infomationContainer,
						),
						favoriteContainer
					),
					h('div', {
							className: 'MPLU-displayWorksGridWorkTitleContainer',
							style: {
								display: 'flex',
								'-moz-box-pack': 'justify',
								justifyContent: 'space-between',
								marginTop: '4px',
								'-moz-box-align': 'center',
								alignItems: 'center',
								columnGap: '8px',
							}
						},
						h('a',  {
								className: 'MPLU-displayWorksGridWorkTitleLink MPLU-worksLinkColor',
								href: `https://www.pixiv.net/artworks/${workData.id}`,
								target: '_blank',
								rel: 'noopener noreferrer',
								style: {
									display: 'inline',
									maxWidth: '100%',
									overflow: 'hidden',
									textDecoration: 'none',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									lineHeight: '22px',
									fontSize: '14px',
									fontWeight: 'bold',
									transition: 'none',
								},
								textContent: workData.title,
								onclick: (e) => {
									e.preventDefault();
									navigateTo(e.currentTarget.href);
								}
						})
					),
					h('div', {
							className: 'MPLU-displayWorksGridWorkAuthorContainer',
							style: {
								display: 'flex',
								'-moz-box-pack': 'justify',
								justifyContent: 'space-between',
								marginTop: '4px',
								'-moz-box-align': 'center',
								alignItems: 'center',
								columnGap: '8px',
							},
							onmouseenter: (e) => {
								self.#showUserPopup({userId: workData.userId, anchorElement: e.currentTarget});
							}
						},
						h('div', {
								className: 'MPLU-displayWorksGridWorkAuthorAvatarContainer',
								style: {
									display: 'flex',
									'-moz-box-align': 'center',
									alignItems: 'center',
									minWidth: '0px',
								},
								'aria-haspopup': 'true',
							},
							h('div', {
									className: 'MPLU-displayWorksGridWorkAuthorAvatarInnerContainer',
									style: {
										marginRight: '4px',
									}
								},
								h('a', {
										className: 'MPLU-displayWorksGridWorkAuthorAvatarLink',
										href: `https://www.pixiv.net/users/${workData.userId}`,
										target: '_blank',
										rel: 'noopener noreferrer',
										style: {
											textDecoration: 'none',
										}
									},
									h('div', {
											className: 'MPLU-displayWorksGridWorkAuthorAvatarImageContainer MPLU-authorIconImageContainer',
											size: '24',
											title: workData.userName,
											role: 'img',
										},
										h('img', {
												className: 'MPLU-displayWorksGridWorkAuthorAvatarImage',
												src: workData.profileImageUrl,
												loading: 'lazy',
												width: '24',
												height: '24',
												alt: workData.userName,
												style: {
													objectFit: 'cover',
													objectPosition: 'center top',
													borderStyle: 'none',
												}	
										})
									)
								)
							),
							h('a',  {
									className: 'MPLU-displayWorksGridWorkAuthorLink',
									href: `https://www.pixiv.net/users/${workData.userId}`,
									target: '_blank',
									rel: 'noopener noreferrer',
									style: {
										display: 'inline',
										maxWidth: '100%',
										overflow: 'hidden',
										textDecoration: 'none',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
										lineHeight: '22px',
										fontSize: '14px',
										fontWeight: 'bold',
										transition: 'none',
										color: 'var(--MPLU-text2)',
									},
									textContent: workData.userName,
									onclick: (e) => {
										e.preventDefault();
										navigateTo(e.currentTarget.href);
									}
								}
							)
						)
					)
				);
				return workElement;
			}
			async function bookmarkButtonClicked({e, workId}){
				e.preventDefault();
				const button = e.currentTarget;
				const bookmarkId = button.dataset.bookmarkId;
				if(bookmarkId && bookmarkId !== 'null'){
					await pixivApi.deleteBookMark({bookmarkId: parseInt(bookmarkId, 10)});
					return {bookmarkId: null};
				}else{
					const response = await pixivApi.addBookMark({illustId: workId, isPrivate: false});
					return {bookmarkId: response.last_bookmark_id};
				}
			}
		}
		async #showUserPopup({userId, anchorElement}){
			const self = this;
			if(!this.#popUpElements.userPopupContainer){
				this.#popUpElements.userPopupContainer = createPopupTemplate();
				document.body.appendChild(this.#popUpElements.userPopupContainer);
			}
			await updatePopUpContent(userId);

			function createPopupTemplate(){
				const header = h('div', {
						className: 'MPLU-userPopupHeader',
					}
				);
				const popup = h('div', {
						className: 'MPLU-userPopupContainer',
						style: {
							border: '1px solid var(--MPLU-border)',
							borderRadius: '8px',
							backgroundColor: 'var(--MPLU-surface1)',
							pointerEvents: 'none', // 書き換え
							visibility: 'hidden', // 書き換え
							position: 'absolute',
							left: '-338px',
							top: '-528px',
							zIndex: 'calc(infinity)',
							overflow: 'hidden',
							display: 'flex',
							flexFlow: 'column',
							width: '338px',
							maxHeight: '0px',
						},
						ref: (e) => {
							self.#popUpElements.parts.root = e;
						}
					},
					h('div', {
							className: 'MPLU-userPopupContentContainer',
							style: {
								overflowY: 'auto',
								display: 'flex',
								flexFlow: 'column',
							}
						},
						h('div', {
							},
							h('div', {
									style: {
										display: 'flex',
										flexFlow: 'column',
										'-moz-box-align': 'center',
										alignItems: 'center',
										width: '336px',
										backGrodundColor: 'var(--MPLU-surface1)',
										borderRadius: '8px',
										paddingTop: '24px',
										overflow: 'hidden',
										maskImage: '-webkit-radial-gradient(white, black)',
									},
									ref: (e) => {
										self.#popUpElements.parts.contentsWrapper = e;
									}
								}
							)
						)
					),
				);
				return popup;
			}
			async function updatePopUpContent(userId){
				const userData = await pixivApi.getUser({userId, fullResponse: false});
				const userLatestWorksTmp = await pixivApi.getUsersLatest(userId);
				const userLatestWorks = userLatestWorksTmp
			}
		}
		#displayPage(){
			if(!this.#mainContainer)return;
			if(!this.#currentPage.pageElement)throw new Error({'message': 'Current page element is null', 'pageNum': this.#currentPage.pageNum});
			this.#mainContainer.element.innerHTML = '';
			this.#mainContainer.element.appendChild(this.#currentPage.pageElement);
		}
		#isAi(workData){
			if(!workData)return false;
			const tagsArr = workData.tags;
			if(Array.isArray(tagsArr) && tagsArr.length){
				for(let i = 0; i < tagsArr.length; i++){
					const t = tagsArr[i];
					if(!t)continue;
					const lc = (typeof t === 'string' ? t : String(t)).toLowerCase();
					if(this.#aiTags.has(lc))return true;
				}
			}
			if(workData.aiType === 2)return true;
			//if(workData.aiType != null && workData.aiType !== 0 && workData.aiType !== 1)return true;
			return false;
		}
		#fetchWorksData({pageNum}){
			const response = this.#getWorksDataFunction(pageNum);
		}
	}

	class PixivTextI18n {
		#version = '0.2.0.2'
		#avalavleLangs = ['ja', 'en', 'zh-cn', 'zh-tw', 'ko', 'ms', 'th'];
		#testData = null;
		#textData = {};
		#isReady = false;
		#loadPromise = null;
		#i18nFileUrl = 'https://raw.githubusercontent.com/Happy-come-come/UserScripts/refs/heads/main/Pixiv%E3%82%92%E5%B0%91%E3%81%97%E4%BE%BF%E5%88%A9%E3%81%AB%E3%80%82/locale/i18n/'
		#lang = getCookie('user_language') || document.querySelector('html').lang || 'ja';
		constructor(){
		}
		async init(){
			if(this.#isReady)return;
			if(this.#loadPromise)return this.#loadPromise;
			if(!this.#avalavleLangs.includes(this.#lang))this.#lang = 'ja';
			this.#loadPromise = this.#loadTextData();
			return this.#loadPromise;
		}
		/**
		 * 
		 * @param {*} path 
		 * @param {*} options 
		 * @returns 
		 */
		get(path, options = null){
			if(!options){
				return getValueFromObjectByPath(this.#textData, path);
			}else{
				const template = getValueFromObjectByPath(this.#textData, path);
				return this.#formatString(template, options);
			}
		}
		#formatString(template, options){
			//"SS（{{ max }} {{ unit }}以下）"
			//options = {max: 4999, unit: '文字'}
			//return "SS（4999 文字以下）"
			return template.replace(/{{\s*(\w+)\s*}}/g, (match, p1) => {
				return options[p1] !== undefined ? options[p1] : match;
			});
		}
		async #loadTextData(){
			if(this.#testData){
				this.#textData = this.#testData;
				this.#isReady = true;
				return;
			}
			const cachedData = await getFromIndexedDB('PixivTextI18n', this.#lang);
			if(cachedData && cachedData['__version'] === this.#version){
				this.#textData = cachedData;
				this.#isReady = true;
			}else{
				const url = `${this.#i18nFileUrl}${this.#lang}.json?v=${this.#version}`;
				const response = await request({url});
				if(response['データチェック'] === 'ごめん。わたし、もう、絶対に、幸せになんてなれないんだ'){
					this.#textData = response;
					response['__version'] = this.#version;
					await saveToIndexedDB('PixivTextI18n', this.#lang, response);
					this.#isReady = true;
				}else{
					console.error('PixivTextI18n: Invalid i18n data');
					this.#textData = {};
				}
			}
		}
	}
	const pixivText = new PixivTextI18n();

	class PixivApi{
		#fetchedData = {};
		#pixivApiUrl = "https://www.pixiv.net/";
		#lang = getCookie('user_language') || document.querySelector('html').lang || 'ja';
		constructor(){
			this.init();
		}
		async init(){

		}
		async getIllustDetail({illustId, refresh = false, fullResponse = false} = {}){
			if(!this.#fetchedData.illustDetail)this.#fetchedData.illustDetail = {};
			if(this.#fetchedData.illustDetail[illustId] && refresh === false)return this.#fetchedData.illustDetail[illustId];
			const endpoint = `ajax/illust/${illustId}`;
			const params = {lang: this.#lang};
			const response = await this.#fetchApi(endpoint, params, 'illustDetail');
			this.#fetchedData.illustDetail[illustId] = response.body;
			return fullResponse ? response : this.#fetchedData.illustDetail[illustId];
		}

		async getNovelDetail({novelId, refresh = false, fullResponse = false} = {}){
			if(!this.#fetchedData.novelDetail)this.#fetchedData.novelDetail = {};
			if(this.#fetchedData.novelDetail[novelId] && refresh === false)return this.#fetchedData.novelDetail[novelId];
			const endpoint = `ajax/novel/${novelId}`;
			const params = {lang: this.#lang};
			const response = await this.#fetchApi(endpoint, params, 'novelDetail');
			this.#fetchedData.novelDetail[novelId] = response.body;
			return fullResponse ? response : this.#fetchedData.novelDetail[novelId];
		}

		async getUser({userId, refresh = false, fullResponse = false} = {}){
			if(!this.#fetchedData.userDetail)this.#fetchedData.userDetail = {};
			if(this.#fetchedData.userDetail[userId] && refresh === false)return this.#fetchedData.userDetail[userId];
			const endpoint = `ajax/user/${userId}`;
			const params = {lang: this.#lang};
			const response = await this.#fetchApi(endpoint, params, 'userDetail');
			this.#fetchedData.userDetail[userId] = response.body;
			return fullResponse ? response : this.#fetchedData.userDetail[userId];
		}

		async getIllusts({illustIds, fullResponse = false} = {}){
			const endpoint = `ajax/user/${sessionData.myUserData.myUserId}/illusts`;
			const params = {'ids[]': illustIds, lang: this.#lang};
			const response = await this.#fetchApi(endpoint, params, 'illusts');
			return fullResponse ? response : response.body;
		}

		async getNovels({novelIds, fullResponse = false} = {}){
			const endpoint = `ajax/user/${sessionData.myUserData.myUserId}/novels`;
			const params = {'ids[]': novelIds, lang: this.#lang};
			const response = await this.#fetchApi(endpoint, params, 'novels');
			return fullResponse ? response : response.body;
		}

		async getUgoiraMeta({ugoiraId, fullResponse = false} = {}){
			const endpoint = `https://www.pixiv.net/ajax/illust/${ugoiraId}/ugoira_meta`;
			const params = {lang: this.#lang};
			const response = await this.#fetchApi(endpoint, params, 'ugoiraMeta');
			return fullResponse ? response : response.body;
		}

		/**
		 * @param {Object} options - 検索パラメータ
		 * @param {string} options.restrict - 'show' or 'hide'
		 */
		async getBookmarks({userId = sessionData.myUserData.myUserId, restrict = 'show', offset = 1, perPage = 100, tag = '', refresh = false, fullResponse = false} = {}){
			const endpoint = `ajax/user/${userId}/illust/bookmarks`;
			const params = {
				rest: restrict,
				offset,
				limit: perPage,
				tag,
				lang: this.#lang
			};
			const response = await this.#fetchApi(endpoint, params, 'bookmarks');
			return fullResponse ? response : response.body;
		}

		async getBookmarksNovel({userId = sessionData.myUserData.myUserId, restrict = 'show', offset = 1, perPage = 100, tag = '', refresh = false, fullResponse = false} = {}){
			const endpoint = `ajax/user/${userId}/novel/bookmarks`;
			const params = {
				rest: restrict,
				offset,
				limit: perPage,
				tag,
				lang: this.#lang
			};
			const response = await this.#fetchApi(endpoint, params, 'bookmarksNovel');
			return fullResponse ? response : response.body;
		}

		async getTagInfo({word, fullResponse = false} = {}){
			const endpoint = `ajax/search/tags/${encodeURIComponent(word)}`;
			const params = {
				lang: this.#lang,
			};
			const response = await this.#fetchApi(endpoint, params, 'tags');
			return fullResponse ? response : response.body;
		}

		/**
		 * 検索API
		 * @param {Object} options - 検索パラメータ
		 * @param {string} [options.category='artworks'] - endpointカテゴリ (artworks, illustrations, manga, novels, top)
		 * @param {string} options.word - 検索ワード
		 * @param {string} [options.page] - ページ番号 (1始まり)
		 * @param {string} [options.order='date_d'] - 並び順 ('date_d', 'date', 'popular_d')
		 * @param {string} [options.scd] - 検索期間の始まり (YYYY-MM-DD)
		 * @param {string} [options.ecd] - 検索期間の終わり (YYYY-MM-DD)
		 * @param {string} [options.type='all'] - 種別 (illust_and_ugoira, ugoira, manga, all)
		 * @param {string} [options.s_mode='s_tag'] - サーチモード
		 * @param {string} [options.mode='all'] - R18フィルタ (all, safe, r18)
		 * @param {number} [options.ai_type=0] - AI作品の扱い (0: 全て, 1: 非AIのみ)
		 * @param {string} [options.csw=0] - 同じ作者の作品をまとめるかどうか (まとめる: 1, まとめない: 0)
		 * @param {number} [options.wlt] - 横幅下限 文字数下限
		 * @param {number} [options.wgt] - 横幅上限 文字数上限
		 * @param {number} [options.hgt] - 高さ上限 文字数上限
		 * @param {number} [options.hlt] - 高さ下限 文字数下限
		 * @param {number} [options.ratio] - アスペクト比 (横長: 0.5, 縦長: -0.5, 正方形: 0)
		 * @param {string} [options.tool] - 使用ツール
		 * @param {string} [options.work_lang] - 作品の言語
		 * @param {boolean} [options.original_only] - オリジナル作品のみ検索するかどうか (true: 1, false: null)
		 * @param {boolean} [options.replaceable_only] - 単語変換対応作品のみ検索するかどうか (true: 1, false: null)
		 * @param {number} [options.gs] - シリーズ単位で表示するかどうか (シリーズ単位: 1, 作品単位: 0)
		 * @param {boolean} [options.fullResponse=false] - フルレスポンスを返すかどうか
		*/
		async getSearch({word, category = 'artworks', page = 1, p,order = 'date_d', scd, ecd, csw = 0, ai_type = 0, type = 'all', s_mode = 's_tag', mode = 'all', work_lang, original_only, wlt, wgt, hlt, hgt, fullResponse = false,
			ratio, tool,
			replaceable_only, gs,
		} = {}){
			if(!word)throw new Error('Search word is required');
			if(!page || page < 1)throw new Error('Page number must be 1 or greater');
			const endpoint = `ajax/search/${category}/${encodeURIComponent(word)}`;
			const params = {
				word,
				p: p ?? page,
				order,
				scd,
				ecd,
				type,
				s_mode,
				mode,
				csw,
				ai_type,
				wlt,
				wgt,
				hlt,
				hgt,
				ratio,
				tool,
				work_lang,
				original_only,
				replaceable_only,
				gs,
				lang: this.#lang,
			};
			const response = await this.#fetchApi(endpoint, params, 'search');
			return fullResponse ? response : response.body;
		}

		async getUsersLatest(userId){
			const endpoint = `ajax/user/${userId}/works/latest`;
			const params = {
				lang: this.#lang,
			};
			const response = await this.#fetchApi(endpoint, params, 'usersLatest');
			return response;
		}

		async getSuggestTags(keyword){
			if(!this.#fetchedData.suggestTags)this.#fetchedData.suggestTags = {};
			if(this.#fetchedData.suggestTags[keyword])return this.#fetchedData.suggestTags[keyword];
			const endpoint = `rpc/cps.php`;
			const params = {
				lang: this.#lang,
				keyword: keyword,
			};
			const response = await this.#fetchApi(endpoint, params, 'suggestTags');
			this.#fetchedData.suggestTags[keyword] = response;
			return response;
		}

		async addBookMark({illustId, comment = "", restrict = 0, tags = []} = {}){
			const endpoint = `ajax/illusts/bookmarks/add`;
			const body = {
				illust_id: illustId,
				comment: comment,
				restrict: restrict,
				tags: tags,
			}
			const response = await this.#posetApi(endpoint, body, 'addbookMark');
			return response.body;
		}

		async deleteBookMark({bookmarkId} = {}){
			const endpoint = `ajax/illusts/bookmarks/delete`;
			const body = {
				bookmark_id: bookmarkId,
			}
			const response = await this.#posetApi(endpoint, body, 'deleteBookMark');
			return response.body;
		}

		async #fetchApi(endpoint, params = {}, category){
			const url = new URL(this.#pixivApiUrl + endpoint);
			Object.keys(params).forEach(key => {
				const value = params[key];
				if(value == null || Number.isNaN(value) || value === undefined)return;
				if(Array.isArray(value)){
					value.forEach(v => url.searchParams.append(key, v));
				}else{
					url.searchParams.append(key, value);
				}
			});
			const headers = {
				'Sec-Fetch-Dest': 'empty',
			};
			const response = await request({url: url.toString(), headers});
			if(!response || response.error){
				const errorInfo = response?.error?.message ? response.error.message : "";
				console.error({function: 'fetchApi', category, endpoint, params, message: errorInfo, url: url.toString(), response});
				throw new Error(`Failed to fetch API: ${endpoint} ${errorInfo}`);
			}
			return response;
		}

		async #posetApi(endpoint, body = {}, category){
			const url = new URL(this.#pixivApiUrl + endpoint);
			if(!sessionData.myUserData.x_csrf_token){
				console.error({function: 'postApi', category, endpoint, body, url: url.toString()});
				throw new Error('CSRF token is missing');
			}
			const headers = {
				'Content-Type': 'application/json charset=utf-8',
				'Sec-Fetch-Dest': 'empty',
				'x-csrf-token': sessionData.myUserData.x_csrf_token,
			};
			const response = await request({url: url.toString(), method: 'POST', headers, body: JSON.stringify(body)});
			if(!response || response.error){
				const errorInfo = response?.error?.message ? response.error.message : "";
				console.error({function: 'postApi', category, endpoint, body, message: errorInfo, url: url.toString(), response});
				throw new Error(`Failed to post API: ${endpoint} ${errorInfo}`);
			}
			return response;
		}
	}
	const pixivApi = new PixivApi();

	async function init(){
		const todo = [
			getMyUserData(),
			locationChange(),
			updateThemeMode(),
			loadSettings(),
			appendScriptGlobalStyle(),
			pixivText.init(),
		];
		await Promise.all(todo);
	}
	await init();
	const progressNotify = new ProgressNotify();

	debug(sessionData);
	debug(scriptSettings);
	debug({isMobile, isPC, isOddMobile});
	update({urlChange: true, firstRun: true});
	window.addEventListener('scroll', () => update());
})();
