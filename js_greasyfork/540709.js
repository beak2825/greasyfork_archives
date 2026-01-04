// ==UserScript==
// @name            推特优化
// @name:ja         Twitterを少し便利に。
// @name:en         Make Twitter a Little more Useful.
// @name:zh         让Twitter更好用
// @namespace       https://greasyfork.org/zh-CN/scripts/540709
// @version         2.3.0.4
// @description             推特长文自动展开等功能
// @description:ja          で？みたいな機能の集まりだけど、きっとTwitterを少し便利にしてくれるはず。
// @description:en          It's a collection of features like "So what?", but it will surely make Twitter a little more useful.
// @description:zh          这是一些小功能的集合，但肯定能让Twitter更好用一些。
// @author			ゆにてぃー
// @match			https://twitter.com/*
// @match			https://mobile.twitter.com/*
// @match			https://x.com/*
// @match			https://X.com/*
// @connect			twitter.com
// @connect			api.twitter.com
// @connect			api.x.com
// @connect			api.fanbox.cc
// @connect			pbs.twimg.com
// @connect			abs.twimg.com
// @connect			video.twimg.com
// @connect			discord.com
// @connect			booth.pm
// @connect			carrd.co
// @connect			creatorlink.net
// @connect			fantia.jp
// @connect			html.co.jp
// @connect			linktr.ee
// @connect			lit.link
// @connect			potofu.me
// @connect			profcard.info
// @connect			skeb.jp
// @connect			sketch.pixiv.net
// @connect			tumblr.com
// @connect			twpf.jp
// @connect			lab.syncer.jp
// @connect			geek-website.com
// @connect			ci-en.dlsite.com
// @connect			dl.dropboxusercontent.com
// @connect			raw.githubusercontent.com
// @connect			video-ft.twimg.com
// @require			https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.3/Sortable.min.js
// @icon			data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=
// @grant			GM_xmlhttpRequest
// @grant			GM_registerMenuCommand
// @grant			GM_info
// @grant			GM_addElement
// @license			MIT
// @run-at			document-idle
// @downloadURL https://update.greasyfork.org/scripts/540709/%E6%8E%A8%E7%89%B9%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/540709/%E6%8E%A8%E7%89%B9%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(async function(){
	'use strict';
	if(!getCookie('ct0')){
		console.log('TwitterのCookieが取得できませんでした。');
		console.log('プライベートモードなど、Twitterにログインしていない状態では動作しません。');
		return;
	}
	let currentUrl = document.location.href;
	let updating = false;
	const debugging = false;
	const debug = debugging ? console.log : ()=>{};
	const userAgent = navigator.userAgent || navigator.vendor || window.opera;
	function isMobileDevice(){
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
	}
	const isMobile = isMobileDevice();
	const isPC = !isMobile;

	let scriptSettings = {};
	await loadSettings();
	let scriptDataStore = {};
	await loadScriptDataStore();
	const sessionData = {};
	const commonSelectors = {
		'tweetField': 'article[data-testid="tweet"]',
		'retweeted': '[data-testid="socialContext"]',
		'likedColor': 'r-vkub15',
		'liked': 'M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z',
		'infoField': '.r-1d09ksm.r-1471scf.r-18u37iz.r-1wbh5a2',
		'clickMediaField': '.r-1p0dtai.r-1mlwlqe.r-1d2f490.r-dnmrzs.r-1udh08x.r-u8s1d.r-zchlnj.r-ipm5af.r-417010',
		'profileFieldHeaderItems': '[data-testid="UserProfileHeader_Items"]',
		'link': {
			"nomal": 'css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3 r-1loqt21',
			"hovered": 'css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3 r-1ny4l3l r-1ddef8g r-tjvw6i r-1loqt21'
		},
	};
	const desktopSelectors = {
		'timeLineMediaField': '.r-1p0dtai.r-1mlwlqe.r-1d2f490.r-11wrixw.r-61z16t.r-1udh08x.r-u8s1d.r-zchlnj.r-ipm5af.r-417010',
		'mediaField': '.r-9aw3ui.r-1s2bzr4',
		'profileField': '.r-1ifxtd0.r-ymttw5.r-ttdzmv',
		'followersLink': '.r-bcqeeo.r-qvutc0.r-1tl8opc.r-a023e6.r-rjixqe.r-16dba41.r-1loqt21',
	};
	const mobileSelectors = {
		'timeLineMediaField': '.r-1p0dtai.r-1mlwlqe.r-1d2f490.r-1udh08x.r-u8s1d.r-zchlnj.r-ipm5af.r-417010',
		'mediaField': '.r-9aw3ui.r-a1ub67 > .r-9aw3ui',
		'profileField': '.r-ku1wi2.r-1j3t67a.r-1b3ntt7',
		'followersLink': '.r-bcqeeo.r-qvutc0.r-1tl8opc.r-1b43r93.r-hjklzo.r-16dba41.r-1loqt21',
	};
	const envSelector = isMobile ? {...commonSelectors,...mobileSelectors} : {...commonSelectors,...desktopSelectors};
	const svgIconPaths = {
		"pin": 'M17 9.76V4.5C17 3.12 15.88 2 14.5 2h-5C8.12 2 7 3.12 7 4.5v5.26L3.88 16H11v5l1 2 1-2v-5h7.12L17 9.76zM7.12 14L9 10.24V4.5c0-.28.22-.5.5-.5h5c.28 0 .5.22.5.5v5.74L16.88 14H7.12z',
		"pined": 'M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26L20.12 16H13v5l-1 2-1-2v-5H3.88L7 9.76V4.5z',
		"reply": 'M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z',
		"retweet": 'M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z',
		"retweeted": 'M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z',
		"favorite": 'M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z',
		"favorited": 'M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z',
		"bookmark": 'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z',
		"bookmarked": 'M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5z',
		"analytics": 'M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z',
		// ↓PC版Twitterの矢印の共有マーク↓
		"share": 'M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z',
		// ↓よくあるハンドスピナーみたいな共有マーク↓
		"share2": 'M17 4c-1.1 0-2 .9-2 2 0 .33.08.65.22.92C15.56 7.56 16.23 8 17 8c1.1 0 2-.9 2-2s-.9-2-2-2zm-4 2c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4c-1.17 0-2.22-.5-2.95-1.3l-4.16 2.37c.07.3.11.61.11.93s-.04.63-.11.93l4.16 2.37c.73-.8 1.78-1.3 2.95-1.3 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-.32.04-.63.11-.93L8.95 14.7C8.22 15.5 7.17 16 6 16c-2.21 0-4-1.79-4-4s1.79-4 4-4c1.17 0 2.22.5 2.95 1.3l4.16-2.37c-.07-.3-.11-.61-.11-.93zm-7 4c-1.1 0-2 .9-2 2s.9 2 2 2c.77 0 1.44-.44 1.78-1.08.14-.27.22-.59.22-.92s-.08-.65-.22-.92C7.44 10.44 6.77 10 6 10zm11 6c-.77 0-1.44.44-1.78 1.08-.14.27-.22.59-.22.92 0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2z',
		"menu": 'M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z',
		"list": "M3 4.5C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5v15c0 1.38-1.12 2.5-2.5 2.5h-13C4.12 22 3 20.88 3 19.5v-15zM5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5h13c.28 0 .5-.22.5-.5v-15c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2z",
		"addList": 'M5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H12v2H5.5C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5V13h-2V4.5c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2zm10 7v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z',
		"blueBadge": "M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z",
		"protected": "M17.5 7H17v-.25c0-2.76-2.24-5-5-5s-5 2.24-5 5V7h-.5C5.12 7 4 8.12 4 9.5v9C4 19.88 5.12 21 6.5 21h11c1.39 0 2.5-1.12 2.5-2.5v-9C20 8.12 18.89 7 17.5 7zM13 14.73V17h-2v-2.27c-.59-.34-1-.99-1-1.73 0-1.1.9-2 2-2 1.11 0 2 .9 2 2 0 .74-.4 1.39-1 1.73zM15 7H9v-.25c0-1.66 1.35-3 3-3 1.66 0 3 1.34 3 3V7z",
		"profile": "M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z",
		"settings": "M10.54 1.75h2.92l1.57 2.36c.11.17.32.25.53.21l2.53-.59 2.17 2.17-.58 2.54c-.05.2.04.41.21.53l2.36 1.57v2.92l-2.36 1.57c-.17.12-.26.33-.21.53l.58 2.54-2.17 2.17-2.53-.59c-.21-.04-.42.04-.53.21l-1.57 2.36h-2.92l-1.58-2.36c-.11-.17-.32-.25-.52-.21l-2.54.59-2.17-2.17.58-2.54c.05-.2-.03-.41-.21-.53l-2.35-1.57v-2.92L4.1 8.97c.18-.12.26-.33.21-.53L3.73 5.9 5.9 3.73l2.54.59c.2.04.41-.04.52-.21l1.58-2.36zm1.07 2l-.98 1.47C10.05 6.08 9 6.5 7.99 6.27l-1.46-.34-.6.6.33 1.46c.24 1.01-.18 2.07-1.05 2.64l-1.46.98v.78l1.46.98c.87.57 1.29 1.63 1.05 2.64l-.33 1.46.6.6 1.46-.34c1.01-.23 2.06.19 2.64 1.05l.98 1.47h.78l.97-1.47c.58-.86 1.63-1.28 2.65-1.05l1.45.34.61-.6-.34-1.46c-.23-1.01.18-2.07 1.05-2.64l1.47-.98v-.78l-1.47-.98c-.87-.57-1.28-1.63-1.05-2.64l.34-1.46-.61-.6-1.45.34c-1.02.23-2.07-.19-2.65-1.05l-.97-1.47h-.78zM12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5s-.68-1.5-1.5-1.5zM8.5 12c0-1.93 1.56-3.5 3.5-3.5 1.93 0 3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5c-1.94 0-3.5-1.57-3.5-3.5z",

	};

	const denyNames = ["home", "explore", "notifications", "messages", "i", "settings", "tos", "privacy", "compose", "search"];
	const denyNamesRegex = new RegExp(`https?://(x|twitter)\\.com/(?!(${denyNames.join('|')})(?:\\?|/|$))[\\w]{3,}`, 'ig');
	const Text = {};
Text.zh = {
    "makeTwitterLittleUseful": {
        "scriptName": "让Twitter更好用",
        "displaySettingsButtonText": "「让Twitter更好用」设置",
        "invaildData": "无效数据",
        "copied": "已复制到剪贴板",
        "close": "关闭",
        "postApiAction": {
            "favorite": "已点赞",
            "unfavorite": "已取消点赞",
            "retweet": "已转发",
            "deleteRetweet": "已取消转发",
            "bookmark": "已收藏",
            "deleteBookmark": "已取消收藏",
        },
        "displayChangelog": {
            "headerTitle": "更新日志",
            "version": "版本",
            "updateDate": "更新日期",
            "newFeaturesListHeader": "新功能",
            "neverDisplay": "不再显示",
            "closeButtonText": "关闭",
            "openSettingsButtonText": "打开设置",
            "moreInfo": "更多功能详情请",
            "here": "点击这里",
            "selfProtection": "更新时仅在有新功能添加时显示。"
        },
        "settings": {
            "displayName": "通用设置",
            "functionsToggle": "功能开关",
            "language": "语言",
            "uiTextType": "界面文本类型",
            "displayChangelog": "添加新功能时显示更新日志",
        },
    },
    "webhookBringsTweetsToDiscord": {
        "submit": "发送",
        "webhookNotSet": "未设置Webhook",
        "postSuccessMssage": "发送成功",
        "postSuccess": "成功",
        "postFailedMssage": "发送失败",
        "postFailed": "失败",
        "withQuotedTweet": "包含引用推文？",
        "embedTextData": {
            "characterLimitExceeded": "...超出Discord字数限制",
            "variousLinks": "相关链接",
            "linkToTweet": "推文链接",
            "engagement": "互动数据",
            "retweets": "转发",
            "likes": "点赞",
            "units": "万",
            "roundingScale": 10000,
            "decimalPlaces": 2,
            "postedDate": "发布时间",
            "quotedTweet": "↓♻️引用推文♻️↓",
        },
        "settings": {
            "displayName": "将推文发送到Discord",
            "description": "允许通过Webhook将推文发送到Discord",
            "displayMethod": "显示方式",
            "defaultWebhook": "默认Webhook",
            "displayMethodOptions": {
                "everywhere": "随处显示",
                "tweetDetailsOnly": "仅在推文详情显示"
            },
            "sendLangage": "发送语言",
            "downloadVideo": "下载视频作为文件发送",
            "downloadVideoOptions": {
                "no": "不下载",
                "yes": "下载"
            },
        },
    },
    "noteTweetExpander": {
        "settings": {
            "displayName": "展开长推文",
            "description": "在时间线中展开Note推文显示全文",
        },
    },
    "showMeYourPixiv": {
        "settings": {
            "displayName": "显示Pixiv链接",
            "description": "在推文下方或资料栏显示推文作者的Pixiv链接",
        },
    },
    "quickShareTweetLink": {
        "settings": {
            "displayName": "快速分享推文链接",
            "description": "添加可快速复制推文链接的按钮",
            "copyDomain": "复制时使用的域名",
            "customDomain": "自定义域名",
        },
    },
    "engagementRestorer": {
        "roundingScale": 10000,
        "decimalPlaces": 2,
        "units": "万",
        "retweet": "转发",
        "quoted": "引用",
        "like": "点赞",
        "settings": {
            "displayName": "恢复互动数据",
            "description": "查看推文详情时显示转发数、引用数和点赞数",
        }
    },
    "hideAnalytics": {
        "settings": {
            "displayName": "隐藏分析数据",
            "description": "隐藏推文的分析数据",
        }
    },
    "helloTweetWhereAreYouFrom": {
        "settings": {
            "displayName": "显示推文来源",
            "description": "显示推文发布的客户端名称",
            "showVideoUrl": "显示视频URL",
        }
    },
    "showFollowers": {
        "settings": {
            "displayName": "直接显示粉丝",
            "description": "防止已验证粉丝优先显示",
        }
    },
    "sneakilyFavorite": {
        "favorite": "点赞",
        "settings": {
            "displayName": "悄悄点赞",
            "description": "添加点赞按钮但不通知转发者",
        }
    },
    "showAllMedias": {
        "units": "万",
        "roundingScale": 10000,
        "decimalPlaces": 2,
        "settings": {
            "displayName": "显示所有媒体",
            "description": "在媒体栏显示推文的所有图片",
            "displayMethod": "显示方式",
            "expand": "展开",
            "likeTweet": "像推文一样",
            "removeBlur": "移除R-18模糊(仅限媒体栏)",
            "onlyRemoveBlur": "仅移除模糊",
        }
    },
    "customizeMenuButton": {
        "shortCutButtonText": "快捷方式",
        "settings": {
            "displayName": "自定义菜单按钮",
            "description": "自定义UI菜单",
            "toDisplay": "要显示的按钮",
            "shortCutButton": "快捷按钮",
            "shortCutButtonDisplayName": "显示名称",
            "shortCutButtonUri": "URI",
            "sortOrder": "显示顺序(可拖动更改)",
            "sortOrderRestoreDefault": "恢复默认",
        }
    },
    "imageZoom": {
        "settings": {
            "displayName": "图片缩放",
            "description": "点击详情图片可放大查看",
        }
    },
    "imageSizeFixer":{
        "settings": {
            "displayName": "修复图片尺寸",
            "description": "修复时间线中图片的尺寸",
        }
    },
    "advance": {
        "settings": {
            "displayName": "高级设置",
            "exportSettings": "导出设置",
            "export": "导出",
            "importSettings": "导入设置",
            "import": "导入",
            "invaildSettings": "无效设置",
            "invaildJson": "无效JSON",
        },
    },
    "forDebug": {
        "settings": {
            "displayName": "调试用",
            "allDataDisplayOnConsole": "所有数据将显示在控制台",
            "showTweetData": "通过推文ID显示推文数据",
            "showUserDataByScreenName": "通过用户名显示用户数据",
            "showUserByUserID": "通过用户ID显示用户数据",
            "showScriptSettings": "显示脚本设置(scriptSettings)",
            "showDataStore": "显示数据存储(scriptDataStore)",
            "showSessionData": "显示会话数据(sessionData)",
            "showTweetsData": "显示获取的推文数据(tweetsData)列表",
            "showTweetsUserData": "显示获取的用户数据(tweetsUserData)列表",
            "showTweetsUserDataByUserName": "通过用户名显示获取的用户数据(tweetsUserDataByUserName)",
            "showTwitterApiClassDebug": "显示TwitterApiClass调试信息",
            "show": "显示",
            "import": "导入",
            "invaildTweetId": "无效的推文ID",
            "invalidScreenName": "无效的用户名",
            "invalidUserId": "无效的用户ID",
            "coutionOpenDataStore": "尝试在浏览器中查看'makeTwitterLittleUseful.pixivLinkCollection.dataBase'可能会导致浏览器冻结",
            "importPixivLinkCorrection": "导入pixiv和twitter id关联",
        },
    }
};
	Text.ja = {
		"makeTwitterLittleUseful": {
			"scriptName": "Twitterを少し便利に。",
			"displaySettingsButtonText": "「Twitterを少し便利に。」の設定",
			"invaildData": "無効なデータです",
			"copied": "クリップボードにコピーしました",
			"close": "閉じる",
			"postApiAction": {
				"favorite": "いいねしました",
				"unfavorite": "いいねを取り消しました",
				"retweet": "リツイートしました",
				"deleteRetweet": "リツイートを取り消しました",
				"bookmark": "ブックマークしました",
				"deleteBookmark": "ブックマークを取り消しました",
			},
			"displayChangelog": {
				"headerTitle": "更新履歴",
				"version": "バージョン",
				"updateDate": "更新日時",
				"newFeaturesListHeader": "新機能",
				"neverDisplay": "二度と表示しない",
				"closeButtonText": "閉じる",
				"openSettingsButtonText": "設定を開く",
				"moreInfo": "機能の詳細等は",
				"here": "こちら",
				"selfProtection": "更新時、新しい機能が追加されたときのみ表示しています。"
			},
			"settings": {
				"displayName": "一般設定",
				"functionsToggle": "機能のオン・オフ",
				"language": "Language",
				"uiTextType": "UIのテキストの種類",
				"displayChangelog": "新機能追加時に更新履歴を表示する",
			},
		},
		"webhookBringsTweetsToDiscord": {
			"submit": "送信",
			"webhookNotSet": "Webhookが設定されていません",
			"postSuccessMssage": "送信しました",
			"postSuccess": "完了",
			"postFailedMssage": "送信に失敗しました",
			"postFailed": "失敗",
			"withQuotedTweet": "引用も？",
			"embedTextData": {
				"characterLimitExceeded" : "……以下discordの字数オーバー",
				"variousLinks": "各種リンク",
				"linkToTweet": "ツイートへ",
				"engagement": "エンゲージメント",
				"retweets": "リツイート",
				"likes": "いいね",
				"units": "万",
				"roundingScale": 10000,
				"decimalPlaces": 2,
				"postedDate": "投稿日時",
				"quotedTweet": "↓♻️引用元♻️↓",
			},
			"settings": {
				"displayName": "WebhookがTweetを連れてくるわ今日も",
				"description": "ツイートをDiscordにWebhookで送信できるようにします",
				"displayMethod": "表示方法",
				"defaultWebhook": "デフォルトのWebhook",
				"displayMethodOptions": {
					"everywhere": "どこでも表示",
					"tweetDetailsOnly": "詳細表示したときだけ"
				},
				"sendLangage": "送信時言語",
				"downloadVideo": "動画をダウンロードしてファイルとして送信する",
				"downloadVideoOptions": {
					"no": "しない",
					"yes": "する"
				},
			},
		},
		"noteTweetExpander": {
			"settings": {
				"displayName": "長いツイートをTLで展開",
				"description": "NoteツイートをTLで展開して全文表示します",
			},
		},
		"showMeYourPixiv": {
			"settings": {
				"displayName": "PixivのリンクをTweetに添えて",
				"description": "ツイートの下やプロフィール欄にツイート主のPixivのリンクを表示します",
			},
		},
		"quickShareTweetLink": {
			"settings": {
				"displayName": "ツイートリンクを素早くコピー",
				"description": "ツイートのリンクを即時コピーできるボタンを追加します",
				"copyDomain": "コピーするときに使うドメイン",
				"customDomain": "カスタムドメイン",
			},
		},
		"engagementRestorer": {
			"roundingScale": 10000,
			"decimalPlaces": 2,
			"units": "万",
			"retweet": "リツイート",
			"quoted": "件の引用",
			"like": "いいね",
			"settings": {
				"displayName": "返ってこい！リツイート欄！",
				"description": "ツイートを詳細表示した際にリツイート数、引用数、いいね数を表示します",
			}
		},
		"hideAnalytics": {
			"settings": {
				"displayName": "アナリティクスを非表示にする",
				"description": "ツイートのアナリティクス数を非表示にします",
			}
		},
		"helloTweetWhereAreYouFrom": {
			"settings": {
				"displayName": "あなたのツイートはどこから？",
				"description": "ツイートを投稿したクライアント名を表示します",
				"showVideoUrl": "動画のURLを表示する",
			}
		},
		"showFollowers": {
			"settings": {
				"displayName": "フォロワーを直接表示",
				"description": "「認証済みフォロワー」が最初に表示されるのを防ぎます",
			}
		},
		"sneakilyFavorite": {
			"favorite": "いいね",
			"settings": {
				"displayName": "こっそりいいね",
				"description": "リツイートされたツイートをいいねしても相手に通知が行かないボタンを追加します",
			}
		},
		"showAllMedias": {
			"units": "万",
			"roundingScale": 10000,
			"decimalPlaces": 2,
			"settings": {
				"displayName": "メディア欄に全ての画像を表示",
				"description": "ツイートのメディア欄にそのツイートの全ての画像を表示します",
				"displayMethod": "表示方法",
				"expand": "展開",
				"likeTweet": "ツイートのように",
				"removeBlur": "R-18のモザイクを削除(メディア欄のみ)",
				"onlyRemoveBlur": "モザイクの削除のみ",
			}
		},
		"customizeMenuButton": {
			"shortCutButtonText": "ショートカット",
			"settings": {
				"displayName": "メニューボタンをカスタマイズ",
				"description": "UIのメニューをカスタマイズします",
				"toDisplay": "追加するボタン",
				"shortCutButton": "ショートカットボタン",
				"shortCutButtonDisplayName": "表示する名前",
				"shortCutButtonUri": "URI",
				"sortOrder": "表示順(ドラッグで変更できます)",
				"sortOrderRestoreDefault": "デフォルトに戻す",
			}
		},
		"imageZoom": {
			"settings": {
				"displayName": "画像をズーム",
				"description": "詳細表示した画像をクリックすると拡大表示します",
			}
		},
		"imageSizeFixer": {
			"settings": {
				"displayName": "画像サイズを修正",
				"description": "TLの画像のサイズを修正します",
			}
		},
		"advance": {
			"settings": {
				"displayName": "高度な設定",
				"exportSettings": "設定をエクスポート",
				"export": "エクスポート",
				"importSettings": "設定をインポート",
				"import": "インポート",
				"invaildSettings": "無効な設定です",
				"invaildJson": "無効なJSONです",
			},
		},
		"forDebug": {
			"settings": {
				"displayName": "デバッグ用",
				"allDataDisplayOnConsole": "全てコンソールに表示されます",
				"showTweetData": "ツイートIDからツイートのデータを表示",
				"showUserDataByScreenName": "スクリーンネームからユーザのデータを表示",
				"showUserByUserID": "ユーザIDからユーザのデータを表示",
				"showScriptSettings": "スクリプトの設定(scriptSettings)を表示",
				"showDataStore": "データストア(scriptDataStore)を表示",
				"showSessionData": "セッションデータ(sessionData)を表示",
				"showTweetsData": "セッションで取得したツイートデータ(tweetsData)一覧を表示",
				"showTweetsUserData": "セッションで取得したユーザデータ(tweetsUserData)のユーザデータ一覧を表示",
				"showTweetsUserDataByUserName": "セッションで取得したユーザデータ(tweetsUserDataByUserName)のユーザデータをスクリーンネームから表示",
				"showTwitterApiClassDebug": "TwitterApiClassのデバッグ情報を表示",
				"show": "表示",
				"import": "インポート",
				"invaildTweetId": "無効なツイートIDです",
				"invalidScreenName": "無効なスクリーンネームです",
				"invalidUserId": "無効なユーザIDです",
				"coutionOpenDataStore": "「makeTwitterLittleUseful.pixivLinkCollection.dataBase」の中身をブラウザで見ようとすると多分ブラウザがフリーズします",
				"importPixivLinkCorrection": "pixivとtwitter idの紐付けをインポート",
			},
		}
	};

	Text.en = {
		"makeTwitterLittleUseful": {
			"scriptName": "Make Twitter Little Useful",
			"displaySettingsButtonText": "Settings for 'Make Twitter Little Useful'",
			"invaildData": "Invalid data",
			"copied": "Copied to clipboard",
			"close": "close",
			"postApiAction": {
				"favorite": "Liked",
				"unfavorite": "Unliked",
				"retweet": "Retweeted",
				"deleteRetweet": "Unretweeted",
				"bookmark": "Bookmarked",
				"deleteBookmark": "Unbookmarked",
			},
			"displayChangelog": {
				"headerTitle": "Changelog",
				"version": "Version",
				"updateDate": "Update Date",
				"newFeaturesListHeader": "New Features",
				"neverDisplay": "Never display again",
				"closeButtonText": "Close",
				"openSettingsButtonText": "Open Settings",
				"moreInfo": "For more details about the features,",
				"here": "click here",
				"selfProtection": "Displayed only when new features are added during updates."
			},
			"settings": {
				"displayName": "General Settings",
				"functionsToggle": "Toggle Functions",
				"language": "Language",
				"uiTextType": "UI Text Type",
				"displayChangelog": "Display changelog when new features are added",
			},
		},
		"webhookBringsTweetsToDiscord": {
			"submit": "Submit",
			"webhookNotSet": "Webhook not set",
			"postSuccessMssage": "Posted successfully",
			"postSuccess": "Success",
			"postFailedMssage": "Failed to post",
			"postFailed": "Failed",
			"withQuotedTweet": "With quoted tweet?",
			"embedTextData": {
				"characterLimitExceeded" : "…exceeds Discord character limit",
				"variousLinks": "Various Links",
				"linkToTweet": "Link to Tweet",
				"engagement": "Engagement",
				"retweets": "Retweets",
				"likes": "Likes",
				"units": "K",
				"roundingScale": 1000,
				"decimalPlaces": 1,
				"postedDate": "Posted Date",
				"quotedTweet": "↓♻️Quoted Tweet♻️↓",
			},
			"settings": {
				"displayName": "Webhook Brings Tweets to Discord",
				"description": "Allows you to send tweets to Discord via webhook",
				"displayMethod": "Display Method",
				"defaultWebhook": "Default Webhook",
				"displayMethodOptions": {
					"everywhere": "Display Everywhere",
					"tweetDetailsOnly": "Only in Tweet Details"
				},
				"sendLangage": "Language for Sending",
				"downloadVideo": "Download video and send as file",
				"downloadVideoOptions": {
					"no": "No",
					"yes": "Yes"
				},
			},
		},
		"noteTweetExpander": {
			"settings": {
				"displayName": "Note Tweet Expander",
				"description": "Expands Note Tweets in the timeline to display the full text",
			},
		},
		"showMeYourPixiv": {
			"settings": {
				"displayName": "Show Me Your Pixiv",
				"description": "Displays the Pixiv link of the tweet author under the tweet or in the profile section",
			},
		},
		"quickShareTweetLink": {
			"settings": {
				"displayName": "Quick Copy Tweet Link",
				"description": "Adds a button to instantly copy the tweet link",
				"copyDomain": "Domain to Use for Copying",
				"customDomain": "Custom Domain",
			},
		},
		"engagementRestorer": {
			"roundingScale": 1000,
			"decimalPlaces": 1,
			"units": "K",
			"retweet": "Retweet",
			"quoted": "Quoted",
			"like": "Like",
			"settings": {
				"displayName": "Engagement Restorer",
				"description": "Displays the number of retweets, quotes, and likes when viewing tweet details",
			}
		},
		"hideAnalytics": {
			"settings": {
				"displayName": "Hide Analytics",
				"description": "Hides the tweet analytics count",
			}
		},
		"helloTweetWhereAreYouFrom": {
			"settings": {
				"displayName": "Hello Tweet Where Are You From?",
				"description": "Displays the client name from which the tweet was posted",
				"showVideoUrl": "Show video URL",
			}
		},
		"showFollowers": {
			"settings": {
				"displayName": "Show Followers Directly",
				"description": "Prevents 'Verified Followers' from being displayed first",
			}
		},
		"sneakilyFavorite": {
			"favorite": "Favorite",
			"settings": {
				"displayName": "Sneakily Favorite",
				"description": "Adds a button to like retweeted tweets without notifying the retweeter",
			}
		},
		"showAllMedias": {
			"units": "K",
			"roundingScale": 1000,
			"decimalPlaces": 1,
			"settings": {
				"displayName": "Show All Images in Media Section",
				"description": "Displays all images of the tweet in the media section",
				"displayMethod": "Display Method",
				"expand": "Expand",
				"likeTweet": "Like Tweet",
				"removeBlur": "Remove R-18 Blur (Media Section Only)",
				"onlyRemoveBlur": "Only Remove Blur",
			}
		},
		"customizeMenuButton": {
			"shortCutButtonText": "Shortcut",
			"settings": {
				"displayName": "Customize Menu Button",
				"description": "Customizes the UI menu",
				"toDisplay": "Buttons to display",
				"shortCutButton": "Shortcut Button ",
				"shortCutButtonDisplayName": "Display Name",
				"shortCutButtonUri": "URI",
				"sortOrder": "Display Order (can be changed by drag)",
				"sortOrderRestoreDefault": "Restore Default",
			}
		},
		"imageZoom": {
			"settings": {
				"displayName": "Zoom Images",
				"description": "Enlarges the image when clicked in detail view",
			}
		},
		"imageSizeFixer":{
			"settings": {
				"displayName": "Fix Image Size",
				"description": "Fixes the size of images in the timeline",
			}
		},
		"advance": {
			"settings": {
				"displayName": "Advanced Settings",
				"exportSettings": "Export Settings",
				"export": "Export",
				"importSettings": "Import Settings",
				"import": "Import",
				"invaildSettings": "Invalid Settings",
				"invaildJson": "Invalid JSON",
			},
		},
		"forDebug": {
			"settings": {
				"displayName": "For Debugging",
				"allDataDisplayOnConsole": "All data will be displayed on console",
				"showTweetData": "Show Tweet Data by Tweet ID",
				"showUserDataByScreenName": "Show User Data by Screen Name",
				"showUserByUserID": "Show User Data by User ID",
				"showScriptSettings": "Show Script Settings (scriptSettings)",
				"showDataStore": "Show Data Store (scriptDataStore)",
				"showSessionData": "Show Session Data (sessionData)",
				"showTweetsData": "Show List of Fetched Tweets (tweetsData)",
				"showTweetsUserData": "Show List of Fetched User Data (tweetsUserData)",
				"showTweetsUserDataByUserName": "Show User Data by Screen Name (tweetsUserDataByUserName)",
				"showTwitterApiClassDebug": "Show TwitterApiClass Debug Information",
				"show": "Show",
				"import": "Import",
				"invaildTweetId": "Invalid Tweet ID",
				"invalidScreenName": "Invalid Screen Name",
				"invalidUserId": "Invalid User ID",
				"coutionOpenDataStore": "Opening 'makeTwitterLittleUseful.pixivLinkCollection.dataBase' in the browser may freeze the browser",
				"importPixivLinkCorrection": "Import pixiv and twitter id ties",
			},
		}
	};

	let envText = {};
	_i18n();
	const functions = {
		"webhookBringsTweetsToDiscord": {
			"function": webhookBringsTweetsToDiscord,
			"isRunning": false,
		},
		"noteTweetExpander": {
			"function": noteTweetExpander,
			"isRunning": false,
		},
		"showMeYourPixiv": {
			"function": showMeYourPixiv,
			"isRunning": false,
			"ignoreIsRunning": true
		},
		"quickShareTweetLink": {
			"function": quickShareTweetLink,
			"isRunning": false,
		},
		"engagementRestorer": {
			"function": engagementRestorer,
			"isRunning": false,
		},
		"hideAnalytics": {
			"function": hideAnalytics,
			"isRunning": false,
		},
		"helloTweetWhereAreYouFrom": {
			"function": helloTweetWhereAreYouFrom,
			"isRunning": false,
		},
		"showFollowers": {
			"function": showFollowers,
			"isRunning": false,
		},
		"sneakilyFavorite": {
			"function": sneakilyFavorite,
			"isRunning": false
		},
		"showAllMedias": {
			"function": showAllMedias,
			"isRunning": false,
		},
		"customizeMenuButton": {
			"function": customizeMenuButton,
			"isRunning": false,
			"forPC": true,
		},
		"imageZoom": {
			"function": imageZoom,
			"isRunning": false,
			"forPC": true,
		},
		"imageSizeFixer":{
			"function": imageSizeFixer,
			"isRunning": false,
			"ignoreIsRunning": true,
			"forPC": true,
		}
	}

	async function main(refresh){
		const selector = refresh ? 'article[data-testid="tweet"]' : 'article[data-testid="tweet"]:not([mtlu_checked="true"])';
		const tweets = Array.from(document.querySelectorAll(selector)).map(tweet => {
			tweet.setAttribute('mtlu_checked', "true");
			const link = tweet.querySelector(`[data-testid="User-Name"] a[aria-label], ${envSelector.infoField} a[aria-label]`);
			if(link){
				const match = link.href.match(/[\w]{1,}\.com\/[^/]+\/status\/(\d+)/);
				if(match){
					const screenName = link.href.split("/")[3];
					return { id: match[1], link: link.href, node: tweet, screenName: screenName };
				}
			}
		}).filter(Boolean);
		//debug(tweets)
		const featurestoggle = scriptSettings.makeTwitterLittleUseful.featuresToggle;
		const isTweetDetail = !!currentUrl.match(/[\w]{1,}\.com\/[\w]*\/status\/[0-9]*/);
		Object.keys(functions).forEach(async (key) => {
			const func = functions[key];
			if(featurestoggle[key] && (!func.isRunning || func.ignoreIsRunning) && (func.forPC ? isPC : true && func.forMobile ? isMobile : true)){
				try{
					func.isRunning = true;
					await func.function(tweets);
				}catch(error){
					console.error(error);
				}finally{
					func.isRunning = false;
				}
			}
		});
	}

	async function webhookBringsTweetsToDiscord(tweetNodes){
		const textData = envText.webhookBringsTweetsToDiscord;
		const thisScriptSettings = scriptSettings['webhookBringsTweetsToDiscord'];
		const colors = new Colors();
		tweetNodes.forEach(function(tweetNode){
			const element = tweetNode.node;
			if(element.querySelector(".quickDimg"))return;
			const tweetLink = tweetNode.link;
			const fotter = element.querySelector('div[id][role="group"]');
			const flexContainer = document.createElement('div');
			flexContainer.className = 'quickDimg MTLU_container';
			Object.assign(flexContainer.style, {
				'display': 'flex',
			});

			// 1つ目のドロップダウン（サーバー選択）
			const dropdownSelectServer = document.createElement('select');
			dropdownSelectServer.className = "quickDimgPullDown quickDimgPullDown1";
			thisScriptSettings.data.forEach(d=>{
				const option = document.createElement('option');
				option.value = d.value;
				option.textContent = d.name;
				if(d.name === thisScriptSettings.defaultWebhook){
					option.selected = true;
				}
				dropdownSelectServer.appendChild(option);
			});
			flexContainer.appendChild(dropdownSelectServer);
			dropdownSelectServer.addEventListener('click', (event) => {
				event.stopPropagation();
			});

			const dropdownSendImage = document.createElement('select');
			dropdownSendImage.className = "quickDimgPullDown quickDimgPullDown2";
			for(let i=1; i<=5; i++){
				const option = document.createElement('option');
				option.value = i;
				option.textContent = i;
				if(i === 5){
					option.selected = true;
				}
				dropdownSendImage.appendChild(option);
			}
			flexContainer.appendChild(dropdownSendImage);

			dropdownSendImage.addEventListener('click', (event) => {
				event.stopPropagation();
			});
			const dropdownPostQuote = document.createElement('select');
			dropdownPostQuote.className = "quickDimgPullDown quickDimgPullDown3";
			const defaultOption = document.createElement('option');
			defaultOption.value = "false";
			defaultOption.textContent = textData.withQuotedTweet;
			defaultOption.selected = true;
			defaultOption.disabled = true;
			dropdownPostQuote.appendChild(defaultOption);

			['false','true'].forEach(value => {
				const option = document.createElement('option');
				option.value = value;
				option.textContent = value;
				dropdownPostQuote.appendChild(option);
			});
			flexContainer.appendChild(dropdownPostQuote);

			dropdownPostQuote.addEventListener('click', (event) => {
				event.stopPropagation();
			});

			// ボタンを作成
			const button = document.createElement('button');
			button.className = "quickDimgButton";
			button.textContent = textData.submit;
			flexContainer.appendChild(button);

			function reEnableButton(){
				button.disabled = false;
				button.textContent = textData.submit;
			}
			dropdownSelectServer.addEventListener('change', reEnableButton);
			dropdownSendImage.addEventListener('change', reEnableButton);
			dropdownPostQuote.addEventListener('change', reEnableButton);
			//dropdown_use_graphql.addEventListener('change', reEnableButton);

			// ボタンのクリックイベントを監視
			button.addEventListener('click',async function(){
				// ここでドロップダウンの選択値に基づいて処理を行う
				this.disabled = true;
				const selectedServer = dropdownSelectServer.value;
				const selectedNumber = dropdownSendImage.value;
				const sendQuoteTweet = dropdownPostQuote.value === 'true';
				//const useGraphql = dropdown_use_graphql.value === 'true';
				if(!selectedServer){
					customAlert(textData.webhookNotSet);
					return;
				}
				let sendPage;
				if(selectedNumber != 5){
					sendPage = [selectedNumber-1];
				}else{
					sendPage = [0,1,2,3];
				}
				const bodys = await makeSendData(tweetLink, sendPage, sendQuoteTweet);
				await sleep(300);
				const bodysLength = bodys.length;
				for(let i=0; i < bodysLength; i++){
					const formData = new FormData();
					const payload = {};
					const tmp = bodys[i];
					if(tmp.embeds){
						payload.embeds = tmp.embeds;
					}
					if(tmp.content){
						payload.content = tmp.content;
					}
					formData.append('payload_json', JSON.stringify(payload));
					//debug(formData)
					if(tmp.files){
						tmp.files.forEach((file, index) => {
							formData.append(`file${index}`, file.attachment, file.name);
						});
					}
					try{
						const res = await request({url: `https://discord.com/api/webhooks/${atob(selectedServer)}`, dontUseGenericHeaders: true, method: 'POST', body: formData, anonymous: true, onlyResponse: false});
						if(res.statusText == "Bad Request"){
							console.log({user: twitterApi.tweetsUserDataByUserName, tweets: twitterApi.tweetsData});
							customAlert(`${textData.postFailedMssage}`,payload.embeds[0].url);
						}
					}catch(error){
						customAlert(`${textData.postFailedMssage}`,payload.embeds[0].url);
						console.log({user: twitterApi.tweetsUserDataByUserName, tweets: twitterApi.tweetsData});
						console.log(error);
						throw(error);
					}
					//debug(res)
					if((i+1) !== bodysLength)await sleep(1000);
				}
				button.textContent = textData.postSuccess;
			});
			fotter.parentNode.appendChild(flexContainer);
		});
		return "done";
		async function makeSendData(tweetLink, sendPages, sendQuoteTweet){
			const timeZoneObject = Intl.DateTimeFormat().resolvedOptions();
			const tweetId = tweetLink.match(/https?:\/\/[\w]{1,}\.com\/\w+\/status\/(\d+)/)[1];
			const embedTextData = Text[thisScriptSettings.sendLangage || scriptSettings?.makeTwitterLittleUseful?.language || getCookie('lang')].webhookBringsTweetsToDiscord.embedTextData;
			let tweetApiData = await twitterApi.getTweet(tweetId);
			const sendData = await makeEmbeds();
			if(sendQuoteTweet){
				const quoted_data = tweetApiData.quoted_status_result?.result || tweetApiData.quoted_status;
				if(quoted_data){
					tweetApiData = quoted_data;
					sendData.push({content: embedTextData.quotedTweet});
					sendData.push(...(await makeEmbeds()));
				}
			}
			return sendData;
			async function makeEmbeds(){
				const bundle = [];
				const embeds = [];
				// 実際には6200くらいまでいけると思う
				const maxDescriptionLength = 5800;
				const mainEmbed = new DiscordEmbedMaker();
				const tweetUserData = tweetApiData.core?.user_results?.result || tweetApiData.user?.result || tweetApiData.user;
				const tweetUserId = tweetUserData.rest_id || tweetUserData.id_str;
				const screenName = tweetUserData.legacy?.screen_name || tweetUserData.screen_name;
				await addPixivLinksToScriptDataStore([screenName], true);
				const pixivUrl = getPixivUrlWithScreenName(screenName);
				const tweetData = tweetApiData.legacy || tweetApiData;
				const tweetUrl = `https://twitter.com/${screenName}/status/${tweetData.id_str}`;
				const noteTweet = tweetApiData.note_tweet?.note_tweet_results.result;
				const tweetDataEntities = noteTweet ? noteTweet.entity_set : tweetData.entities;
				let tweetBodyText = noteTweet ? noteTweet.text : tweetData.full_text;
				const tweetCardData = tweetApiData.card?.legacy || tweetApiData.card;
				let profileImage = (tweetUserData.legacy?.profile_image_url_https || tweetUserData.profile_image_url_https).replace(/(_normal|_x96)\./,'.');
				profileImage = {url: profileImage, name: `profile_image.${((new URL(profileImage)).searchParams.get('format') || 'jpg')}`};
				const mediaUrls = makeMediaList(tweetData.extended_entities, sendPages);
				const files = {};
				if(tweetCardData){
					for(let i=0; i<tweetCardData.binding_values.length; i++){
						const v = tweetCardData.binding_values[i];
						try{
							if(v.key === 'broadcast_pre_live_slate' || v.key === 'thumbnail_image_original'){
								mediaUrls.images.push({mediaType: "photo", url: v.value.image_value.url});
								break;
							}

							if(v.key === 'photo_image_full_size_original'){
								const urlObj = new URL(v.value.image_value.url);
								if(urlObj.searchParams.get('name')) urlObj.searchParams.set("name", "orig");
								mediaUrls.images.push({mediaType: "photo", url: urlObj.href});
								break;
							}

							if(v.key === 'unified_card'){
								const json = JSON.parse(v.value.string_value).media_entities;
								const tmp = makeMediaList({media: Object.values(json)}, [0,1,2,3]);
								if(tmp.images){
									mediaUrls.images.push(...tmp.images);
								}
								if(tmp.videos){
									mediaUrls.videos.push(...tmp.videos);
								}
								break;
							}
						}catch(error){
							console.error({error: error, value: v});
						}
					}
				}
				const currentTimeMillis = new Date().getTime();
				const linkTextStart = `linkTextStart${currentTimeMillis}`;
				const linkTextEnd = `linkTextEnd${currentTimeMillis}`;
				const linkUrlStart = `linkUrlStart${currentTimeMillis}`;
				const linkUrlEnd = `linkUrlEnd${currentTimeMillis}`;
				const hashtag = `hashtag${currentTimeMillis}`;
				const underbarEscape = `underbarEscape${currentTimeMillis}`;

				// 文字列をArray.fromで配列化
				let tweetBodyArray = Array.from(tweetBodyText);
				if(tweetBodyArray.length > maxDescriptionLength){
					tweetBodyArray = `${tweetBodyArray.slice(0, maxDescriptionLength)}${embedTextData.characterLimitExceeded}`;
				}
				tweetBodyText = tweetBodyArray.join('');
				let combined = [].concat(
					tweetData.entities.hashtags.map(tag => ({
						type: 'hashtag',
						indices: tag.indices,
						text: tag.text
					})),
					tweetData.entities.user_mentions.map(mention => ({
						type: 'mention',
						indices: mention.indices,
						text: mention.screen_name
					})),
					tweetData.entities.symbols.map(symbol => ({
						type: 'symbol',
						indices: symbol.indices,
						text: symbol.text
					}))
				);
				combined = combined.filter(item => item.indices[0] < maxDescriptionLength);
				// combinedを用いて置き換え処理を行う
				// combinedをindices順にソート（後ろから処理するために降順ソート）
				combined.sort((a, b) => b.indices[0] - a.indices[0]);
				combined.forEach(item => {
					let replacement;
					switch(item.type){
						case 'hashtag':
							replacement = `${linkTextStart}${hashtag}${item.text}${linkTextEnd}${linkUrlStart}https://twitter.com/hashtag/${item.text}${linkUrlEnd}`;
							break;
						case 'mention':
							replacement = `${linkTextStart}@${item.text}${linkTextEnd}${linkUrlStart}https://twitter.com/${item.text}${linkUrlEnd}`;
							break;
						case 'symbol':
							replacement = `${linkTextStart}$${item.text}${linkTextEnd}${linkUrlStart}https://twitter.com/search?q=%24${item.text}&src=cashtag_click${linkUrlEnd}`;
							break;
					}
					// indicesを使って文字列を置き換え
					const [start, end] = item.indices;
					if(start < maxDescriptionLength){ // トリム後の範囲内か確認
						tweetBodyArray.splice(start, end - start, ...Array.from(replacement));
					}
				});

				// 配列を再び文字列に結合
				tweetBodyText = tweetBodyArray.join('');
				//マークダウンにならないでほしいやつのエスケープ
				const escapeCharacters = ['\\', '|', '*', '_', '`', '~', '[', ']', '(', ')', '>', '#', '-'];
				escapeCharacters.forEach(char => {
					const regExp = new RegExp('\\' + char, 'g');
					tweetBodyText = tweetBodyText.replace(regExp, '\\' + char);
				});
				//マークダウンになって欲しいやつは戻す
				tweetBodyText = tweetBodyText.replace(new RegExp(linkTextStart, 'g'), '[')
					.replace(new RegExp(linkTextEnd, 'g'), ']')
					.replace(new RegExp(linkUrlStart, 'g'), '(')
					.replace(new RegExp(linkUrlEnd, 'g'), ')')
					.replace(new RegExp(hashtag, 'g'), '#')
					.replace(new RegExp(underbarEscape, 'g'), '_');
				const sendText = replaceTcoToOriginalUrl(tweetBodyText, tweetDataEntities.urls, mediaUrls);
				mainEmbed.setTitle('Tweet')
					.setURL(tweetUrl)
					.setColor(1940464)
					.setAuthor({
						name: `${tweetUserData.legacy?.name || tweetUserData.name} (@${screenName})`,
						url: `https://twitter.com/${screenName}`,
						icon_url: `attachment://${profileImage.name}`
					})
					.setThumbnail("https://pbs.twimg.com/profile_images/1488548719062654976/u6qfBBkF_400x400.jpg")
					.addFields({
						name: `${embedTextData.variousLinks}:link:`,
						value: `[${embedTextData.linkToTweet}](${tweetUrl})\n[TwitterID: ${tweetUserId}](https://twitter.com/intent/user?user_id=${tweetUserId})${pixivUrl ? `\n[Pixiv](${pixivUrl})` : ""}`
					})
					.addFields({
						name: embedTextData.engagement,
						value: `${embedTextData.retweets} ${roundHalfUp(tweetData.retweet_count,embedTextData.roundingScale,embedTextData.decimalPlaces,embedTextData.units)}:recycle:	${embedTextData.likes} ${roundHalfUp(tweetData.favorite_count,embedTextData.roundingScale,embedTextData.decimalPlaces,embedTextData.units)}:heart:`
					})
					.addFields({
						name: embedTextData.postedDate,
						value: new Date(tweetData.created_at).toLocaleString(getLocale(thisScriptSettings.sendLangage), { timeZone: timeZoneObject.timeZone })
					});
				if(sendText)mainEmbed.setDescription(sendText);
				if(mediaUrls.images[0]?.url){
					mainEmbed.setImage(`attachment://${attachmentFileName(mediaUrls.images[0].url)}`);
				}
				embeds.push(mainEmbed);
				if(mediaUrls.images[1]?.url){
					for(let i=1;i<mediaUrls.images.length;i++){
						const imageEmbed = new DiscordEmbedMaker()
							.setURL(tweetUrl)
							.setImage(`attachment://${attachmentFileName(mediaUrls.images[i].url)}`);
						embeds.push(imageEmbed);
					}
				}
				bundle.push({"embeds": embeds, "files": await fetchImages(mediaUrls.images.concat([{...profileImage, isProfileImage: true}]))});
				if(mediaUrls.videos?.length >= 1 && thisScriptSettings.downloadVideo === "yes"){
					const promises = mediaUrls.videos.map(video => downloadVideo(video.url));
					await Promise.all(promises)
						.then(results => {
							results.forEach(obj => {
								bundle.push(obj);
							});
						})
						.catch(error => {
							console.error("Error downloading videos:", error);
						});
				}else if(mediaUrls.videos?.length >= 1){
					mediaUrls.videos.forEach(video => {
						bundle.push({"content": video.url});
					});
				}
				return bundle;
			}
			async function fetchImages(mediaUrlArray){
				if(mediaUrlArray?.length == 0) return;
				const downloadPromises = mediaUrlArray.map(fetchImage);
				return removeNullFromArray(await Promise.all(downloadPromises));
				async function fetchImage(target) {
					let retryCount = 5; // リトライ回数を設定
					while(retryCount > 0){
						if(!target.url)return;
						let image,name;
						if(target.isProfileImage){
							image = await request({url: target.url, respType: "blob", maxRetries: 3});
							name = target.name;
						}else if(target.url.match(/https?:\/\/pbs\.twimg\.com\/(media|card_img)\//)){
							image = await request({url: imageUrlToOriginal(target.url), respType: "blob", maxRetries: 3});
							name = attachmentFileName(target.url);
						}else{
							console.error({error: "知らない画像pathだ……", url: target.url});
						}

						// ダウンロードした画像データのサイズを確認
						if(image.size > 1025){
							return {
								"attachment": image,
								"name": name,
							};
						}else{
							retryCount--;
						}
					}
					console.warn(`Failed to download image after multiple retries: ${target.url}`);
					return null;
				}
			}
			function attachmentFileName(urlStr){
				const url = new URL(urlStr);
				const pathname = url.pathname;
				const lastSegment = pathname.split('/').pop();
				const baseName = lastSegment.split('?')?.[0];
				const extMatch = baseName.match(/\.(jpg|jpeg|png|gif|webp|bmp)$/i);
				let ext = extMatch ? extMatch?.[0] : '';

				if(!ext){
					const format = url.searchParams.get('format');
					if(format){
						ext = '.' + format;
					}else{
						ext = '.jpg';
					}
				}
				const filename = baseName.replace(/\.(jpg|jpeg|png|gif|webp|bmp)$/i, '');
				return `${filename}${ext}`;
			}
			function imageUrlToOriginal(imageUrl){
				//apiから帰ってくるURLをそのまま開くと小さい画像になってしまうので最大サイズの画像をダウンロードできるようにする。
				if(typeof imageUrl !== "undefined"){
					const extension = imageUrl.match(/\.([a-zA-Z0-9]+)(\?.*)?$/)?.[1];
					if(extension == "jpg" || extension == "png" || extension == "webp"){
						return `${imageUrl.replace(`.${extension}`,"")}?format=${extension}&name=orig`;
					}else{
						return imageUrl;
					}
				}
			}
			function downloadVideo(url){
				return new Promise(async (resolve) => {
					//上限は「24117249」だったけどユーザーのアップロード上限が10MBになっちゃったので「10485760」にするかもしれない
					// 2025/02/13 上限が 「10485760」 になりました。
					//console.log((await request(new requestObject_binary_head(url))).responseHeaders);
					const fileSize = await getFileSize(url);
					if(fileSize < 10485760){
						return resolve({"files": [{attachment: await request({url: url, respType: "blob", maxRetries: 1}), name: url.split('/').pop()}]});
					}else{
						const file = await request({url: url, respType: "blob", maxRetries: 1, headers: {"Range": "bytes=0-24117250"}});
						if(file.size < 10485760)return resolve({"files": [{attachment: file, name: url.split('/').pop()}]});
						return resolve({"content": url});
					}
				});
			}
			function replaceTcoToOriginalUrl(fullText, urls, media_urls){
				//ツイート内のt.coで短縮されたリンクをもとにのリンクにもどす。
				try{
					if(typeof fullText !== "undefined"){
						fullText = decodeHtml(fullText);
						if(typeof urls !== "undefined"){
							for(let i=0;i<=urls.length-1;i++){
								if(urls[i].expanded_url.length > 200){
									fullText = fullText.replace(urls[i].url, `[${decodeURI(urls[i].expanded_url).slice(0,100)}](${decodeURI(urls[i].expanded_url)})...`);
								}else{
									fullText = fullText.replace(urls[i].url, decodeURI(urls[i].expanded_url));
								}
							}
						}
						//メディアがくっついてるツイートは末尾にメディアのURLが付随しているためそれを消す。
						if(typeof media_urls !== "undefined"){
							(media_urls.images || []).concat(media_urls.videos || []).forEach(u=>{
								if(u.tco_url){
									fullText = fullText.replace(u.tco_url, "");
								}
							});
						}
					}
				}catch{}
				return fullText;
			}
			function makeMediaList(extendedEntities){
				const result = {images: [], videos: []};
				if(extendedEntities){
					for(let target in sendPages){
						try{
							if(extendedEntities.media.length > sendPages[target]){
								const mediaItem = extendedEntities.media[sendPages[target]];
								const tmpObject = {mediaType: mediaItem.type, tco_url: mediaItem.url};
								if(tmpObject.mediaType == "animated_gif" || tmpObject.mediaType == "video"){
									tmpObject.url = mediaItem.video_info.variants.filter(function(obj){return obj.content_type == "video/mp4";}).reduce((a, b) => a.bitrate > b.bitrate ? a : b).url.split('?')[0];
									result.videos.push(tmpObject);
								}else if(tmpObject.mediaType == "photo"){
									tmpObject.url = mediaItem.media_url_https;
									result.images.push(tmpObject);
								}
							}
						}catch(error){
							console.error("メディアリストの作成に失敗しました。:\n" + error);
						}
					}
				}
				return result;
			}
		}
	}

	async function noteTweetExpander(tweetNodes){
		tweetNodes.forEach(function(target){
			const tweetNode = target.node;
			const tweetTextsElement = tweetNode.querySelectorAll('[data-testid="tweetText"]');
			tweetTextsElement.forEach(async (tweetTextElement, index) => {
				const showMoreLink = tweetTextElement.parentNode.querySelector('[data-testid="tweet-text-show-more-link"]');
				if(showMoreLink)showMoreLink.style.display = "none";
				if(!showMoreLink?.tagName.toLowerCase().match(/div|button/)){
					tweetTextElement.classList.add('tweetExpanderChecked');
					tweetTextElement.style.webkitLineClamp = null;
					return;
				}
				let tweetData = await twitterApi.getTweet(target.id);
				let isNoteTweet;
				if(index == 0){
					isNoteTweet = !!tweetData.note_tweet?.note_tweet_results?.result;
				}else{
					tweetData = await twitterApi.getTweet(tweetData.legacy.quoted_status_id_str);
					isNoteTweet = !!tweetData.note_tweet?.note_tweet_results?.result;
				}
				if(!isNoteTweet){
					tweetTextElement.classList.add('tweetExpanderChecked');
					tweetTextElement.style.webkitLineClamp = null;
					return;
				}

				const originalLinks = {};
				tweetTextElement.querySelectorAll('a').forEach(e=>{
					originalLinks[e.textContent.replace(/^(#|\$|\@)/, "")] = e;
				});
				const newTweetBody = createTweetTextElement(tweetData);
				newTweetBody.querySelectorAll('a').forEach((link) => {
					const originalLink = originalLinks[link.getAttribute('text') || ""];
					if(originalLink && link.getAttribute("usenavigate") != "true"){
						link.addEventListener('click', (event)=>{
							event.preventDefault();
							originalLink.click();
						});
					}
					link.addEventListener('mouseenter', function(){
						link.className = envSelector.link.hovered;
					});
					link.addEventListener('mouseleave', function(){
						link.className = envSelector.link.nomal;
					});
				});
				Array.from(tweetTextElement.children).forEach(e=>e.style.display = "none");
				tweetTextElement.appendChild(newTweetBody);
				tweetTextElement.style.webkitLineClamp = null;
			});
		});
		return "done";
	}

	async function engagementRestorer(){
		if(!currentUrl.match(/https?\:\/\/[\w]{1,}\.com\/\w*\/status\/[0-9]*($|\?.*)/) || document.getElementById('restoreEngagements'))return;
		try{
			const tweetLink = currentUrl.match(/https?\:\/\/[\w]{1,}\.com\/\w*\/status\/[0-9].*/)[0];
			const tweetId = tweetLink.match(/\/status\/(\d+)/)[1];
			const response = (await twitterApi.getTweet(tweetId)).legacy;
			const engagemants = {"favorite_count": response.favorite_count, "quote_count": response.quote_count, "retweet_count": response.retweet_count};
			const targetNode = Array.from((await waitElementAndGet({query: 'article[data-testid="tweet"]', searchFunction: "querySelectorAll"}))).find(node => {
				const timeParents = Array.from(node.querySelectorAll('time')).map(time => time.parentNode);
				return timeParents.some(parent => parent.href && parent.href.match(tweetId));
			});
			if(!targetNode)return;
			const engagemantsAria = targetNode.querySelector('[role="group"]');
			//const engagemantsAria = await waitElementAndGet({query: '[role="group"]', searchFunction: "querySelector", searchPlace: targetNode});
			if(!engagemantsAria)return;
			const textData = envText.engagementRestorer;
			const colors = new Colors();
			const flexContainer = document.createElement('div');
			flexContainer.style.display = 'flex';
			flexContainer.style.justifyContent = 'space-between';
			flexContainer.style.width = '70%';
			flexContainer.id = 'restoreEngagements';
			const pathTmp = tweetLink.match(/\/[\w]+\/status\/[\d]+/)[0];
			const links = [
				{
					"name": "retweets",
					"href": pathTmp + "/retweets",
					"count": roundHalfUp(engagemants.retweet_count, textData.roundingScale, textData.decimalPlaces, textData.units),
					"text": textData.retweet
				},
				{
					"name": "quotes",
					"href": pathTmp + "/quotes",
					"count": roundHalfUp(engagemants.quote_count, textData.roundingScale, textData.decimalPlaces, textData.units),
					"text": textData.quoted,
				},
				{
					"name": "likes",
					"href": pathTmp + "/likes",
					"count": roundHalfUp(engagemants.favorite_count, textData.roundingScale, textData.decimalPlaces, textData.units),
					"text": textData.like,
				},
			];
			links.forEach((a) => {
				const newLink = document.createElement('a');
				newLink.style.textDecoration = 'none';
				newLink.href = a.href;
				const countText = document.createElement('span');
				countText.textContent = a.count;
				countText.style.color = colors.get("fontColor");
				newLink.appendChild(countText);

				const textPart = document.createElement('span');
				textPart.textContent = " " + a.text;
				textPart.style.color = colors.get("fontColorDark");
				newLink.appendChild(textPart);

				newLink.addEventListener('click', (e) => {
					e.preventDefault();
					if(a.name !== "likes")navigateTo(a.href);
					//clickTab(a.name, targetNode);
				});
				flexContainer.appendChild(newLink);
			});
			if(currentUrl.match(/https?\:\/\/[\w]{1,}\.com\/\w*\/status\/[0-9]*($|\?.*)/))engagemantsAria.parentNode.prepend(flexContainer);
		}catch(error){
			console.error(error);
		}
		return "done";
		async function clickTab(name, targetNode){
			targetNode.querySelector('[data-testid="caret"]').click();
			(await waitElementAndGet({query: '[data-testid="tweetEngagements"]', searchFunction: "querySelector"})).click();
			const engagemantsAria = (await waitElementAndGet({query: 'nav[aria-live="polite"]', searchFunction: "querySelector"}));
			const regex = new RegExp(name + '$');
			engagemantsAria.querySelectorAll('[role="presentation"] a').forEach((e)=>{
				if(e.href.match(regex)) e.click();
			});
		}
	}

	async function showMeYourPixiv(tweetNodes){
		tweetNodes.forEach(async tweet => {
			const node = await waitElementAndGet({query: `${envSelector.mediaField},[tnb-id="mediaContainer"]:not(.display_pixiv_link):not(.display_pixiv_link_checked)`, retry: 5, interval: 200, searchPlace: tweet.node});
			const screenName = tweet.screenName;
			if(node){
				const pixivUrl = getPixivUrlWithScreenName(screenName);
				node.classList.add('display_pixiv_link_checked');
				if(pixivUrl && !(pixivUrl?.match(/(?:users\/|member.php\?id=)(11|9949830|15241365)(\/|$)/)) && node && !(node?.querySelector(".display_pixiv_link"))){
					node.appendChild(createLinkElement(pixivUrl, "Pixiv🔗", "display_pixiv_link"));
				}
			}
		});
		const currentPageScreenName = extractUserName(currentUrl);
		if(currentPageScreenName){
			if(currentUrl.match(new RegExp(`${currentPageScreenName}/(status|following|followers|verified_followers|bio)`)))return;
			const existingProfileLink = await waitElementAndGet({query: `div.pixiv_link_in_profile:not(.pixiv_link_in_profile_${currentPageScreenName})`, searchFunction: 'querySelector', interval: 100, retry: 5});
			if(existingProfileLink)existingProfileLink.remove();
			const profileField = await waitElementAndGet({query: envSelector.profileFieldHeaderItems});
			if(!sessionData.showMeYourPixiv?.fetchedUser?.has(currentPageScreenName)){
				if(!sessionData.showMeYourPixiv)sessionData.showMeYourPixiv = {};
				if(!sessionData.showMeYourPixiv.fetchedUser)sessionData.showMeYourPixiv.fetchedUser = new Set();
				sessionData.showMeYourPixiv.fetchedUser.add(currentPageScreenName);
				await addPixivLinksToScriptDataStore([currentPageScreenName], true);
			}
			const pixivUrl = getPixivUrlWithScreenName(currentPageScreenName);
			if(profileField && pixivUrl && !(pixivUrl?.match(/(?:users\/|member.php\?id=)(11|9949830|15241365)(\/|$)/))){
				const profile = document.querySelector('[data-testid="UserProfileHeader_Items"]');
				if(profile && !(profile.querySelector(".display_pixiv_link"))){
					const pixivLinkInProfileContainer = document.createElement('div');
					pixivLinkInProfileContainer.className = `pixiv_link_in_profile pixiv_link_in_profile_${currentPageScreenName}`;
					const pixivLinkInProfile = createLinkElement(pixivUrl, "Pixiv🔗", "display_pixiv_link");
					//pixivLinkInProfile.style.marginTop = "1em";
					pixivLinkInProfileContainer.appendChild(document.createElement('br'));
					pixivLinkInProfileContainer.appendChild(pixivLinkInProfile);
					profile.appendChild(pixivLinkInProfileContainer);
				}
			}
		}
		return "done";
	}

	function quickShareTweetLink(tweetNodes){
		const colors = new Colors();
		tweetNodes.forEach(async (tweet)=>{
			const footer = tweet.node.querySelector('div[id][role="group"]');
			if(!footer || footer.querySelector('[data-testid="quickShare"]'))return;
			const caret = tweet.node.querySelector('[data-testid="caret"]').parentNode.parentNode;
			let clonedNode;
			if(caret){
				clonedNode = caret.cloneNode(true);
				//clonedNode.style.paddingTop = "1px";
			}else{
				clonedNode = footer.lastElementChild.cloneNode(true);
			}
			const svgClassList = footer.firstChild.querySelector('svg').classList;
			clonedNode.querySelector('button').setAttribute('data-testid','quickShare');
			clonedNode.style.marginLeft = "0.5em";
			clonedNode.style.justifyContent = 'inherit';
			clonedNode.style.display = 'inline-grid';
			clonedNode.style.transform = 'rotate(0deg) scale(1) translate3d(0px, 0px, 0px)';
			const clonedSvg = clonedNode.querySelector('svg');
			while(clonedSvg.firstChild){
				clonedSvg.removeChild(clonedSvg.firstChild);
			}
			const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			newPath.setAttribute('d', 'M17 4c-1.1 0-2 .9-2 2 0 .33.08.65.22.92C15.56 7.56 16.23 8 17 8c1.1 0 2-.9 2-2s-.9-2-2-2zm-4 2c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4c-1.17 0-2.22-.5-2.95-1.3l-4.16 2.37c.07.3.11.61.11.93s-.04.63-.11.93l4.16 2.37c.73-.8 1.78-1.3 2.95-1.3 2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4c0-.32.04-.63.11-.93L8.95 14.7C8.22 15.5 7.17 16 6 16c-2.21 0-4-1.79-4-4s1.79-4 4-4c1.17 0 2.22.5 2.95 1.3l4.16-2.37c-.07-.3-.11-.61-.11-.93zm-7 4c-1.1 0-2 .9-2 2s.9 2 2 2c.77 0 1.44-.44 1.78-1.08.14-.27.22-.59.22-.92s-.08-.65-.22-.92C7.44 10.44 6.77 10 6 10zm11 6c-.77 0-1.44.44-1.78 1.08-.14.27-.22.59-.22.92 0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2z');
			clonedSvg.appendChild(newPath);
			clonedSvg.style.color = colors.get("fontColorDark");
			clonedSvg.classList = svgClassList;
			clonedNode.addEventListener('click', ()=>{
				let useDomain = scriptSettings.quickShareTweetLink?.domain || "twitter.com";
				if(useDomain === "other"){
					if(scriptSettings.quickShareTweetLink?.otherDomain){
						useDomain = scriptSettings.quickShareTweetLink.otherDomain;
					}else{
						useDomain = "twitter.com";
					}
				}
				copyToClipboard(tweet.link.replace(/https?:\/\/(x|twitter)\.com/,`https://${useDomain}`));
			});
			function resetStyles(){
				clonedSvg.parentNode.firstChild.style.backgroundColor = '';
				clonedSvg.style.color = colors.get("fontColorDark");
			}

			clonedNode.addEventListener('mouseover', function(){
				clonedSvg.parentNode.firstChild.style.backgroundColor = colors.getWithAlpha("twitterBlue", 0.1);
				clonedSvg.style.color = colors.get("twitterBlue");
			});

			clonedNode.addEventListener('mouseout', resetStyles);
			clonedNode.addEventListener('touchend', resetStyles);
			clonedNode.addEventListener('touchcancel', resetStyles);
			clonedNode.addEventListener('click', (event) => {
				event.stopPropagation();
			});
			footer.appendChild(clonedNode);
		});
		return "done";
	}

	function hideAnalytics(tweetNodes){
		try{
			tweetNodes.forEach(t=>{
				if(t.id === extractTweetId(currentUrl))return;
				const analytics = t.node.querySelector('div[id][role="group"] a[role="link"]').parentNode || t.node.querySelector('[d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"]').findParent('div.r-13awgt0.r-18u37iz.r-1h0z5md');
				if(analytics)analytics.style.display = "none";
			});
		}catch(error){console.error(error)}
		return "done";
	}

	async function helloTweetWhereAreYouFrom(){
		if(document.querySelector('.display_twitter_client') || !currentUrl.match(/[\w]{1,}\.com\/[\w]*\/status\/[0-9]*/))return;
		const targetNode = await waitElementAndGet({query: envSelector.infoField, interval: 300, retry: 4});
		const tweetData = await twitterApi.getTweet(extractTweetId(currentUrl));
		const thisScriptSettings = scriptSettings.helloTweetWhereAreYouFrom;
		if(!targetNode)return;
		const separatDot = 
		h("div", {
				class: "MTLU_container",
				style: {
					display: "inline",
					padding: "0 4px 0 4px",
				}
			},
			h("span", {
					class: "MTLU_fontColorDark",
					textContent: "·"
				}
			)
		);
		const sourceDisplayContainer = 
		h("div", {
				class: "MTLU_container display_twitter_client",
				style: {
					display: "inline",
				},
			},
			h("span", {
					class: "MTLU_fontColorDark",
					textContent: decodeHtml(tweetData.source)
				}
			)
		);
		targetNode.appendChild(separatDot);
		targetNode.appendChild(sourceDisplayContainer);

		if(thisScriptSettings.showVideoUrl == false)return;
		const mediaData = tweetData.legacy?.extended_entities?.media || tweetData.extended_entities?.media;
		const videoUrlElements = mediaData
			.filter(m => ['video', 'animated_gif'].includes(m.type))
			.map((m, index) => {
				const variant = m.video_info.variants
					.filter(v => v.content_type !== 'application/x-mpegURL')
					.reduce((a, b) => a.bitrate > b.bitrate ? a : b);
				const videoUrlElement = createLinkElement(variant.url.split('?')[0], `${index + 1}: ${m.type} URL`);
				if(index != 0)videoUrlElement.style.marginLeft = "0.7em";
				return videoUrlElement;
			});
		if(videoUrlElements.length > 0){
			const videoUrlContainer = h("div", {
					class: "MTLU_container",
					style: {
						display: "flex",
						flexDirection: "row",
					}
				}, 
				videoUrlElements
			);
			targetNode.appendChild(videoUrlContainer);
		}
		return "done";
	}

	async function showFollowers(){
		try{
			if(!/\/verified_followers$/.test(currentUrl))return;
			const screenName = extractUserName(currentUrl);
			const safeScreenName = screenName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const pattern = new RegExp(`${safeScreenName}/verified_followers$`);
			if(!pattern.test(currentUrl))return;
			const followersTab = await waitElementAndGet({query: `a[role="tab"][href="/${screenName}/followers"]`, searchFunction: 'querySelector', interval: 100, retry: 10});
			if(followersTab.getAttribute('showFollowersChecked') == "true")return;
			followersTab.click();
			followersTab.setAttribute('showFollowersChecked',"true");
		}catch(error){console.error(error)}
		return "done";
	}

	function sneakilyFavorite(tweetNodes){
		const colors = new Colors();
		tweetNodes.forEach(function(element){
			const node = element.node;
			if(node.querySelector(".sneakilyFavorite") || ! node.querySelector(envSelector.retweeted) || !node.querySelector('[data-testid="like"]'))return;
			const tweetLink = element.link;
			const container = document.createElement('div');
			container.className = 'sneakilyFavorite MTLU_container';
			const button = document.createElement('button');
			const fotter = node.querySelector('div[id][role="group"]');
			const likeElement = fotter.querySelector('[data-testid="like"]');
			button.textContent = envText.sneakilyFavorite.favorite;
			button.style.fontSize = '0.7em';
			button.style.whiteSpace = 'nowrap';
			button.className = 'sneakilyFavorite';
			button.addEventListener('click',async function(event){
				this.disabled = true;
				const status = await twitterApi.favoriteTweet(extractTweetId(tweetLink));
				if(status.data.favorite_tweet == "Done"){
					likeElement.querySelector('div[dir="ltr"]').classList.add(envSelector.likedColor);
					likeElement.querySelector('div[dir="ltr"]').style.color = colors.get("favorited");
					likeElement.querySelector("path").setAttribute('d',envSelector.liked);
					likeElement.setAttribute('data-testid', 'unlike');
				}
				this.remove();
			});
			container.appendChild(button);
			fotter.insertBefore(container, likeElement.parentElement.nextSibling);
		});
		return "done";
	}

	async function showAllMedias(triggeredUrl){
		if(scriptSettings.showAllMedias.displayMethod === "expand" || scriptSettings.showAllMedias.onlyRemoveBlur){
			expand();
		}else{
			likeTweet();
		}
		async function expand(){
			const mediaPlace = document.querySelector('[data-testid="primaryColumn"] section');
			const madiaRow = mediaPlace.querySelectorAll(`.r-18u37iz.r-9aw3ui.r-1537yvj.r-14gqq1x:not(.Show_all_Medias_checked)`);
			const blurSvgPath = 'path[d="M3.693 21.707l-1.414-1.414 2.429-2.429c-2.479-2.421-3.606-5.376-3.658-5.513l-.131-.352.131-.352c.133-.353 3.331-8.648 10.937-8.648 2.062 0 3.989.621 5.737 1.85l2.556-2.557 1.414 1.414L3.693 21.707zm-.622-9.706c.356.797 1.354 2.794 3.051 4.449l2.417-2.418c-.361-.609-.553-1.306-.553-2.032 0-2.206 1.794-4 4-4 .727 0 1.424.192 2.033.554l2.263-2.264C14.953 5.434 13.512 5 11.986 5c-5.416 0-8.258 5.535-8.915 7.001zM11.986 10c-1.103 0-2 .897-2 2 0 .178.023.352.067.519l2.451-2.451c-.167-.044-.341-.067-.519-.067zm10.951 1.647l.131.352-.131.352c-.133.353-3.331 8.648-10.937 8.648-.709 0-1.367-.092-2-.223v-2.047c.624.169 1.288.27 2 .27 5.415 0 8.257-5.533 8.915-7-.252-.562-.829-1.724-1.746-2.941l1.438-1.438c1.53 1.971 2.268 3.862 2.33 4.027z"]';
			if(madiaRow.length === 0)return;
			const screenName = currentUrl.split('/')[3];
			madiaRow.forEach(n=>{
				n.classList.add('Show_all_Medias_checked');
				n.style.flexWrap = 'wrap';
			});
			const mediaNodes = Array.from(mediaPlace.querySelectorAll(`li:not(.Show_all_Medias_checked)`)).filter(node => {
				node.classList.add('Show_all_Medias_checked');
				const blurSvgNode = node.querySelector(blurSvgPath);
				if(scriptSettings.showAllMedias.removeBlur && blurSvgNode){
					blurSvgNode.parentNode.parentNode.parentNode.querySelector('[role="button"]').click();
				}
				return node.querySelector('path[d="M2 8.5C2 7.12 3.12 6 4.5 6h11C16.88 6 18 7.12 18 8.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C3.12 22 2 20.88 2 19.5v-11zM19.5 4c.28 0 .5.22.5.5v13.45c1.14-.23 2-1.24 2-2.45v-11C22 3.12 20.88 2 19.5 2h-11c-1.21 0-2.22.86-2.45 2H19.5z"]');
			});
			if(mediaNodes.length === 0 || scriptSettings.showAllMedias.onlyRemoveBlur)return;
			mediaNodes.forEach(node => {
				const svgElement = node.querySelector('svg');
				const numberSpan = document.createElement('span');
				numberSpan.textContent = '1';
				numberSpan.style.position = 'absolute';
				numberSpan.style.color = 'black';
				numberSpan.style.right = '15px';
				numberSpan.style.bottom = '4px';
				numberSpan.className = 'indexNum';
				svgElement.parentNode.appendChild(numberSpan);
			});
			if(!twitterApi.tweetsData[mediaNodes[0].querySelector('a').href.match(/[\w]{1,}\.com\/[^/]+\/status\/(\d+)/)[1]])await twitterApi.getUserMedia(screenName);
			mediaNodes.forEach(async n=>{
				n.classList.add('Show_all_Medias_checked');
				const parent = n.parentNode;
				const mediaLinkNode = n.querySelector('a');
				const tweetID = mediaLinkNode.href.match(/[\w]{1,}\.com\/[^/]+\/status\/(\d+)/)[1];
				const tweetData = await twitterApi.getTweet(tweetID);
				const mediaData = tweetData.legacy.entities.media;
				if(mediaData.length == 1)return;
				let beforeNode = n;
				for(let i = 1;i<mediaData.length;i++){
					const currentMedia = mediaData[i];
					const currentImage = currentMedia.media_url_https;
					const currentImageExtention = currentImage.split('.').pop();
					const clonedNode = n.cloneNode(true);
					const clonedNodeLinkNode = clonedNode.querySelector('a');
					const clonedNodeImage = clonedNodeLinkNode.querySelector('img');
					const clonedNodeDisplayImage = clonedNodeImage.previousElementSibling;
					clonedNode.id = clonedNode.id + `_${i+1}`;
					if(!currentMedia.type === "photo")clonedNodeLinkNode.appendChild(makeVideoDurationElement(currentMedia.video_info?.duration_millis,(currentMedia.type === "animated_gif")));
					clonedNodeLinkNode.href = `https://twitter.com/${screenName}/status/${tweetID}/${currentMedia.type === "video" ? 'video' : 'photo'}/${i+1}`;
					clonedNodeImage.src = `${currentImage.replace('.' + currentImageExtention,'')}?format=${currentImageExtention}&name=orig`;
					clonedNodeDisplayImage.style.backgroundImage = `url(${currentImage.replace('.' + currentImageExtention,'')}?format=${currentImageExtention}&name=small)`;
					clonedNodeLinkNode.addEventListener('click',e=>{
						e.preventDefault();
						displayTarget(mediaLinkNode,i);
					});
					clonedNode.querySelector('.indexNum').textContent = (i+1);
					parent.insertBefore(clonedNode, beforeNode.nextSibling);
					beforeNode = clonedNode;
					const blurSvgNode = clonedNode.querySelector(blurSvgPath);
					if(blurSvgNode){
						const tmpNode = blurSvgNode.parentNode.parentNode.parentNode;
						tmpNode.querySelector('[role="button"]').addEventListener('click',e=>{
							const tmpNode2 = tmpNode.parentNode.querySelector('div');
							tmpNode.remove();
							tmpNode2.className = tmpNode2.classList[0];
						});
					}
				}
			});
		}
		async function likeTweet(){
			const mediaPlace = document.querySelector('[data-testid="primaryColumn"] section');
			const madiaRow = mediaPlace?.querySelectorAll(`.r-18u37iz.r-9aw3ui.r-1537yvj.r-14gqq1x`);
			if(!(madiaRow?.length > 0))return;
			let mediaNodes = [];
			madiaRow.forEach(node => {
				if(!node.querySelector('[Show_all_Medias_Check="true"]')){
					const checkNode = document.createElement('div');
					checkNode.setAttribute('Show_all_Medias_Check','true');
					node.appendChild(checkNode);
					node.style.flexWrap = 'wrap';
					node.style.padding = '0px';
					node.style.margin = '0px';
					node.style.gap = '0px';
					mediaNodes.push(...node.querySelectorAll('li'));
				}
			});
			if(mediaNodes.length === 0)return;
			if(!twitterApi.tweetsData[mediaNodes[0].querySelector('a').href.match(/[\w]{1,}\.com\/[^/]+\/status\/(\d+)/)[1]])await twitterApi.getUserMedia(extractUserName(currentUrl));
			const processNode = async (n)=>{
				const mediaLinkNode = n.querySelector('a');
				const tweetID = extractTweetId(mediaLinkNode.href);
				const screenName = extractUserName(mediaLinkNode.href);
				n.style.width = "100%";
				let tweetData = await twitterApi.getTweet(tweetID);
				if(n.querySelector('path[d="M2 8.5C2 7.12 3.12 6 4.5 6h11C16.88 6 18 7.12 18 8.5v11c0 1.38-1.12 2.5-2.5 2.5h-11C3.12 22 2 20.88 2 19.5v-11zM19.5 4c.28 0 .5.22.5.5v13.45c1.14-.23 2-1.24 2-2.45v-11C22 3.12 20.88 2 19.5 2h-11c-1.21 0-2.22.86-2.45 2H19.5z"]')){
					if(!(tweetData.extended_entities?.media?.length >= 2))tweetData = await twitterApi.getTweet(tweetID);
				}
				const article = createTweetNode(tweetData);
				try{
					const articleImages = article.querySelectorAll('[data-testid="tweetPhoto"]');
					for(let i=0; i<articleImages.length; i++){
						if(articleImages[i].querySelector('img')){
							articleImages[i].addEventListener('click', e=>{
								e.preventDefault();
								displayTarget(mediaLinkNode, i);
							});
						}
					}
					article.addEventListener('click',async e=>{
						const tnbIdValues = ['User-Name', 'mediaContainer', 'footerContainer'];
						if(e.target.tagName === 'A' || e.target.closest('a'))return;
						const hasTnbId = tnbIdValues.some(tnbIdValue =>
							e.target.getAttribute('tnb-id') === tnbIdValue || e.target.closest(`[tnb-id="${tnbIdValue}"]`)
						);
						if(hasTnbId)return;
						mediaLinkNode.click();
						if(isMobile){

						}else{
							(await waitElementAndGet({query: `div[data-viewportview="true"] a[href="/${screenName}/status/${tweetID}"]`, interval: 20, retry: 50})).click()
						}
					});
				}catch(error){
					console.error(error);
				}
				n.firstChild.style.display = "none";
				n.appendChild(article);
			};
			Promise.all(Array.from(mediaNodes).map(n => processNode(n)));
		}
		async function displayTarget(node,page){
			node.click();
			await waitElementAndGet({query: `[data-testid="swipe-to-dismiss"]`, interval: 100, retry: 25});
			for(let i=1;i<=page;i++){
				await sleep(10);
				simulateKey(39, 'keydown', document.body);
				//(await wait_load_Element('[data-testid="Carousel-NavRight"]', 100, 25, 'querySelector')).click();
			}
		}
		function makeVideoDurationElement(duration,isGif){
			let text;
			if(isGif){
				text = "GIF"
			}else{
				const durationSeconds = Math.floor(duration / 1000);
				const min = Math.floor(durationSeconds / 60);
				const sec = durationSeconds % 60;
				text = `${min}:${sec.toString().padStart(2, '0')}`;
			}
			const outerDiv = document.createElement('div');
			outerDiv.classList.add('r-1awozwy', 'r-k200y', 'r-z2wwpe', 'r-z80fyv', 'r-1777fci', 'r-s1qlax', 'r-13w96dm', 'r-1nlw0im', 'r-u8s1d', 'r-1r74h94', 'r-633pao');

			const innerDiv = document.createElement('div');
			innerDiv.setAttribute('dir', 'ltr');
			innerDiv.style.color = 'rgb(255, 255, 255)';
			innerDiv.style.textOverflow = 'unset';
			innerDiv.classList.add('r-bcqeeo', 'r-qvutc0', 'r-1tl8opc', 'r-q4m81j', 'r-n6v787', 'r-1cwl3u0', 'r-16dba41', 'r-lrvibr');

			const span = document.createElement('span');
			span.style.textOverflow = 'unset';
			span.classList.add('r-bcqeeo', 'r-qvutc0', 'r-1tl8opc');
			span.textContent = text;

			innerDiv.appendChild(span);
			outerDiv.appendChild(innerDiv);
			return outerDiv;
		}
	}
	async function customizeMenuButton(){
		if(!sessionData.customizeMenuButton)sessionData.customizeMenuButton = {};
		if(sessionData.customizeMenuButton?.observer)return;
		//const thisScriptSettings = scriptSettings.customizeMenuButton;
		//const thisFunctionText = envText.customizeMenuButton;
		const moreMenuButton = await waitElementAndGet({query: 'button[data-testid="AppTabBar_More_Menu"]', searchFunction: 'querySelector', interval: 100, retry: 10});
		if(!moreMenuButton)return;
		const appTabBar = moreMenuButton.parentNode;
		let breaking = false;
		if(!sessionData.customizeMenuButton.observer){
			const observer = new MutationObserver(mutations=>{
				if(breaking || sessionData.customizeMenuButton.isRunning)return;
				breaking = true;
				addAndSort().finally(()=>{
					sessionData.customizeMenuButton.isRunning = false;
				});
				setTimeout(()=>{
					breaking = false;
				}, 500);
			});
			observer.observe(appTabBar, {childList: true, subtree: false});
			if(!sessionData.customizeMenuButton)sessionData.customizeMenuButton = {};
			sessionData.customizeMenuButton.observer = observer;
		}
		const userData = sessionStorage.userData?.screenName !== undefined ? sessionStorage.userData : await fetchUserData();
		sessionData.customizeMenuButton.addAndSort = addAndSort;

		addAndSort();
		async function addAndSort(){
			sessionData.customizeMenuButton.isRunning = true;
			const thisScriptSettings = scriptSettings.customizeMenuButton;
			const options = {
				"homeButton": {
					"href": "/home",
				},
				"exploreButton": {
					"href": "/explore",
				},
				"notificationsButton": {
					"href": "/notifications",
				},
				"messagesButton": {
					"href": "/messages",
				},
				"grokButton": {
					"href": "/i/grok",
					"text": twitterTextI18n.getText("grok"),
				},
				"bookmarksButton": {
					"href": "/i/bookmarks",
					"icon": svgIconPaths.bookmark,
					"text": twitterTextI18n.getText("bookmarks")
				},
				"jobsButton": {
					"href": "/jobs",
					"text": twitterTextI18n.getText("jobs"),
				},
				"communitiesButton": {
					"href": `/${userData.screenName}/communities`,
					"text": twitterTextI18n.getText("communities")
				},
				"premiumButton": {
					"href": "/i/premium_sign_up",
					"text": twitterTextI18n.getText("premium")
				},
				"verifiedOrgButton": {
					"href": "/i/verified-orgs-signup",
					"text": twitterTextI18n.getText("verifiedOrg")
				},
				"profileButton": {
					"href": `/${userData.screenName}`,
				},
				"listsButton": {
					"href": `/${userData.screenName}/lists`,
					"icon": svgIconPaths.list,
					"text": twitterTextI18n.getText("lists")
				},
				"monetizationButton": {
					"href": "/i/monetization",
					"icon": "M23 3v14h-2V5H5V3h18zM10 17c1.1 0 2-1.34 2-3s-.9-3-2-3-2 1.34-2 3 .9 3 2 3zM1 7h18v14H1V7zm16 10c-1.1 0-2 .9-2 2h2v-2zm-2-8c0 1.1.9 2 2 2V9h-2zM3 11c1.1 0 2-.9 2-2H3v2zm0 4c2.21 0 4 1.79 4 4h6c0-2.21 1.79-4 4-4v-2c-2.21 0-4-1.79-4-4H7c0 2.21-1.79 4-4 4v2zm0 4h2c0-1.1-.9-2-2-2v2z",
					"text": twitterTextI18n.getText("monetization")
				},
				"adsButton": {
					"href": "https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb",
					"icon": "M1.996 5.5c0-1.38 1.119-2.5 2.5-2.5h15c1.38 0 2.5 1.12 2.5 2.5v13c0 1.38-1.12 2.5-2.5 2.5h-15c-1.381 0-2.5-1.12-2.5-2.5v-13zm2.5-.5c-.277 0-.5.22-.5.5v13c0 .28.223.5.5.5h15c.276 0 .5-.22.5-.5v-13c0-.28-.224-.5-.5-.5h-15zm8.085 5H8.996V8h7v7h-2v-3.59l-5.293 5.3-1.415-1.42L12.581 10z",
					"text": twitterTextI18n.getText("ads")
				},
				"createYourSpaceButton": {
					"href": "/i/spaces/start",
					"icon": "M12 22.25c-4.99 0-9.18-3.393-10.39-7.994l1.93-.512c.99 3.746 4.4 6.506 8.46 6.506s7.47-2.76 8.46-6.506l1.93.512c-1.21 4.601-5.4 7.994-10.39 7.994zM5 11.5c0 3.866 3.13 7 7 7s7-3.134 7-7V8.75c0-3.866-3.13-7-7-7s-7 3.134-7 7v2.75zm12-2.75v2.75c0 2.761-2.24 5-5 5s-5-2.239-5-5V8.75c0-2.761 2.24-5 5-5s5 2.239 5 5zM11.25 8v4.25c0 .414.34.75.75.75s.75-.336.75-.75V8c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm-3 1v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9c0-.414-.34-.75-.75-.75s-.75.336-.75.75zm7.5 0c0-.414-.34-.75-.75-.75s-.75.336-.75.75v2.25c0 .414.34.75.75.75s.75-.336.75-.75V9z",
					"text": twitterTextI18n.getText("createYourSpace")
				},
				"settingsAndPrivacy": {
					"href": "/settings",
					"icon": svgIconPaths.settings,
					"text": twitterTextI18n.getText("settingsAndPrivacy")
				},
				"shortCutButton1": {
					"href": thisScriptSettings.shortCutButton1Uri.replace('$MYNAME', userData.screenName),
					"icon": "M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z",
					"text": thisScriptSettings.shortCutButton1DisplayName,
				},
				"shortCutButton2": {
					"href": thisScriptSettings.shortCutButton2Uri.replace('$MYNAME', userData.screenName),
					"icon": "M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z",
					"text": thisScriptSettings.shortCutButton2DisplayName,
				},
				"shortCutButton3": {
					"href": thisScriptSettings.shortCutButton3Uri.replace('$MYNAME', userData.screenName),
					"icon": "M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z",
					"text": thisScriptSettings.shortCutButton3DisplayName,
				},
				"shortCutButton4": {
					"href": thisScriptSettings.shortCutButton4Uri.replace('$MYNAME', userData.screenName),
					"icon": "M8 6h10v10h-2V9.41L5.957 19.46l-1.414-1.42L14.586 8H8V6z",
					"text": thisScriptSettings.shortCutButton4DisplayName,
				},
			};

			const buttonElementTemplate = moreMenuButton.cloneNode(true);
			const elementToClone = document.createElement('a');
			elementToClone.style = buttonElementTemplate.style.cssText;
			elementToClone.className = buttonElementTemplate.className;
			while(buttonElementTemplate.firstChild){
				elementToClone.appendChild(buttonElementTemplate.firstChild);
			}

			for(let i=0; i < thisScriptSettings.buttonSorting?.length || 0; i++){
				const key = thisScriptSettings.buttonSorting[i];
				const option = options[key];
				if(thisScriptSettings.toAddOptions[key] === false){
					const button = appTabBar.querySelector(`a[href="${option.href}"]`);
					if(button){
						button.style.display = "none";
					}
					continue;
				}
				const existButton = appTabBar.querySelectorAll(`a[href="${option.href}"]`);
				if(existButton.length > 0){
					if(existButton.length > 1){
						existButton.forEach(b=>{
							if(b.getAttribute('customizeMenuButtonChecked') === "true"){
								b.remove();
							}else{
								appTabBar.insertBefore(b, moreMenuButton);
							}
						});
						continue;
					}
					appTabBar.insertBefore(existButton[0], moreMenuButton);
					continue;
				};
				const button = elementToClone.cloneNode(true);

				const buttonText = button.querySelector('span');
				if(buttonText?.innerText)buttonText.innerText = option.text;
				button.setAttribute('aria-label', key);
				button.setAttribute('customizeMenuButtonChecked', 'true');
				button.target = "_blank";
				button.rel = "noopener nofollow";
				button.style.display = "flex";
				button.href = option.href;
				if(option.icon){
					button.querySelector('svg g').innerHTML = `<path d="${option.icon}"></path>`;
				}
				addClickButtonEvent(button);
				appTabBar.insertBefore(button, moreMenuButton);
				sessionData.customizeMenuButton.isRunning = false;
			}
			return "done";
		}
		return "done";
		function addClickButtonEvent(button, target){
			button.addEventListener('mouseenter',()=>{
				button.firstChild.style.backgroundColor = colors.getWithAlpha("fontColor", 0.1);
				button.firstChild.style.borderRadius = "9999px";

			});
			button.addEventListener('mouseleave',resetStyles);
			button.addEventListener('touchend', resetStyles);
			button.addEventListener('touchcancel', resetStyles);
			function resetStyles(){
				button.firstChild.style.backgroundColor = '';
			}
			button.addEventListener('click',async (event)=>{
					event.preventDefault();
					if(button.href.match(/^(\/.+|https:\/\/x\.com\/)/)){
						event.stopPropagation();
						navigateTo(button.href);
					}
			});
		}
	}

	async function imageZoom(){
		if(!currentUrl.match(/status\/[\d]+\/(video|photo)/))return;
		if(document.querySelector('[imageZoomed="true"]'))return;
		let zoomLevel = scriptSettings.imageZoom?.zoomLevel || 2;
		let magnifierSize = scriptSettings.imageZoom?.magnifierSize || 250;
		if(!sessionData.imageZoom?.magnifier){
			if(!sessionData.imageZoom)sessionData.imageZoom = {};
			const magnifierImg = document.createElement('img');
			magnifierImg.style.maxWidth = 'none';
			const magnifier = document.createElement('div');
			magnifier.style.position = 'absolute';
			magnifier.style.border = '3px solid #000';
			magnifier.style.borderRadius = '50%';
			magnifier.style.cursor = 'none';
			magnifier.style.display = 'none';
			magnifier.style.width = `${magnifierSize}px`;
			magnifier.style.height = `${magnifierSize}px`;
			magnifier.style.overflow = 'hidden';
			magnifier.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
			magnifier.appendChild(magnifierImg);
			sessionData.imageZoom.magnifier = magnifier;
			sessionData.imageZoom.magnifierImg = magnifierImg;
			sessionData.imageZoom.zoomLevel = zoomLevel;
			sessionData.imageZoom.magnifierSize = magnifierSize;

			magnifier.addEventListener('dragstart', (e) => e.preventDefault());

			magnifier.addEventListener('wheel', (e)=>{
				if(e.ctrlKey){
					e.preventDefault();
					sessionData.imageZoom.zoomLevel += e.deltaY * -0.005;
					sessionData.imageZoom.zoomLevel = Math.min(Math.max(1, sessionData.imageZoom.zoomLevel), 8); // ズームレベルを1から8の範囲に制限
					const rect = sessionData.imageZoom.target.getBoundingClientRect();
					const x = e.clientX - rect.left;
					const y = e.clientY - rect.top;
					magnifierImg.style.width = `${sessionData.imageZoom.target.width * sessionData.imageZoom.zoomLevel}px`;
					magnifierImg.style.height = `${sessionData.imageZoom.target.height * sessionData.imageZoom.zoomLevel}px`;
					magnifierImg.style.left = `${-1 * (x * sessionData.imageZoom.zoomLevel - magnifier.offsetWidth / 2)}px`;
					magnifierImg.style.top = `${-1 * (y * sessionData.imageZoom.zoomLevel - magnifier.offsetHeight / 2)}px`;
					magnifier.style.left = `${e.pageX - magnifier.offsetWidth / 2}px`;
					magnifier.style.top = `${e.pageY - magnifier.offsetHeight / 2}px`;
				}else if(e.shiftKey){
					e.preventDefault();
					sessionData.imageZoom.magnifierSize += e.deltaY * -0.1;
					sessionData.imageZoom.magnifierSize = Math.min(Math.max(50, sessionData.imageZoom.magnifierSize), 400); // ルーペサイズを50から400の範囲に制限
					magnifier.style.width = `${sessionData.imageZoom.magnifierSize}px`;
					magnifier.style.height = `${sessionData.imageZoom.magnifierSize}px`;
					magnifier.style.left = `${e.pageX - magnifier.offsetWidth / 2}px`;
					magnifier.style.top = `${e.pageY - magnifier.offsetHeight / 2}px`;
				}
				clearTimeout(saveTimeout);
				saveTimeout = setTimeout(() => {
					scriptSettings.imageZoom = { zoomLevel: sessionData.imageZoom.zoomLevel, magnifierSize: sessionData.imageZoom.magnifierSize };
					saveSettings();
				}, 5000);
			}, { passive: false }); // passive: false を追加してデフォルト動作をキャンセル
		}
		const mediaDisplayTree = (await waitElementAndGet({query: '[data-testid="mask"]'})).parentElement;
		if(!mediaDisplayTree)return;
		mediaDisplayTree.setAttribute('imageZoomed', 'true');
		const images = mediaDisplayTree.querySelectorAll('[data-testid="swipe-to-dismiss"]');
		const magnifier = sessionData.imageZoom.magnifier;
		const magnifierImg = sessionData.imageZoom.magnifierImg;
		document.body.appendChild(magnifier);
		let saveTimeout;

		images.forEach(image =>{
			if(image.getAttribute('eventAdded') === 'true')return;
			image.setAttribute('eventAdded', 'true');
			image.addEventListener('mousedown', (e)=>{
				if(e.button === 2)return;
				sessionData.imageZoom.target = e.target;
				if(sessionData.imageZoom.target.tagName !== 'IMG')return;
				const rect = sessionData.imageZoom.target.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;

				magnifierImg.src = sessionData.imageZoom.target.src;
				magnifier.style.display = 'block';
				magnifier.style.left = `${e.pageX - magnifier.offsetWidth / 2}px`;
				magnifier.style.top = `${e.pageY - magnifier.offsetHeight / 2}px`;

				magnifierImg.style.position = 'absolute';
				magnifierImg.style.width = `${sessionData.imageZoom.target.width * sessionData.imageZoom.zoomLevel}px`;
				magnifierImg.style.height = `${sessionData.imageZoom.target.height * sessionData.imageZoom.zoomLevel}px`;
				magnifierImg.style.left = `${-1 * (x * sessionData.imageZoom.zoomLevel - magnifier.offsetWidth / 2)}px`;
				magnifierImg.style.top = `${-1 * (y * sessionData.imageZoom.zoomLevel - magnifier.offsetHeight / 2)}px`;

				const moveMagnifier = (moveEvent)=>{
					const moveX = moveEvent.clientX - rect.left;
					const moveY = moveEvent.clientY - rect.top;
					magnifier.style.left = `${moveEvent.pageX - magnifier.offsetWidth / 2}px`;
					magnifier.style.top = `${moveEvent.pageY - magnifier.offsetHeight / 2}px`;
					magnifierImg.style.left = `${-1 * (moveX * sessionData.imageZoom.zoomLevel - magnifier.offsetWidth / 2)}px`;
					magnifierImg.style.top = `${-1 * (moveY * sessionData.imageZoom.zoomLevel - magnifier.offsetHeight / 2)}px`;
					if(moveEvent.clientX < rect.left || moveEvent.clientX > rect.right || moveEvent.clientY < rect.top || moveEvent.clientY > rect.bottom){
						hideMagnifier();
					}
				};

				document.addEventListener('mousemove', moveMagnifier);

				const hideMagnifier = () => {
					magnifier.style.display = 'none';
					document.removeEventListener('mousemove', moveMagnifier);
				};
				document.addEventListener('mouseup', hideMagnifier, { once: true });
				sessionData.imageZoom.target.addEventListener('dragstart', (e) => e.preventDefault(), { once: true });
			});
		});
	}

	async function imageSizeFixer(tweetNodes){
		if(!sessionData.imageSizeFixer?.appendedCss){
			const css = `
			article .css-175oi2r.r-9aw3ui.r-1s2bzr4>div.r-9aw3ui>div {
				max-width: 100% !important;
			}
			`;
			const style = document.createElement('style');
			style.textContent = css;
			document.head.appendChild(style);
			sessionData.imageSizeFixer = {
				appendedCss: true
			};
			sessionData.imageSizeFixer.style = style;
		}
		tweetNodes.forEach(async e=>{
			const node = e.node;
			const photoNode = await waitElementAndGet({query: `[data-testid="tweetPhoto"]`, searchFunction: 'querySelector', searchPlace: node, interval: 50, retry: 5});
			const targetNode = photoNode?.parentElement.parentElement;
			if(!targetNode)return;
			if(targetNode.style.width && targetNode.style.height){
				const newSize = calculateTwitterMediaSize(parseInt(targetNode.style.width)*100, parseInt(targetNode.style.height)*100);
				targetNode.style.width = newSize[0] + 'px';
				targetNode.style.height = newSize[1] + 'px';
			}else{
				debug("no size",node,targetNode);
			}
		});
	}

	//############################################################################################################
	//##################################################汎用関数##################################################
	//############################################################################################################

	function update(force = false){
		if(updating && !force)return;
		updating = true;
		main();
		setTimeout(() => {updating = false;}, 600);
	}

	async function navigateTo(uri, state = {}){
		// 非常に怪しい処理だが
		// dispatchEventするためにはページ本来のwindowにアクセスする必要がある
		// unsafeWindowはなるべく使わない予定なのでこうなった
		if(new URL(currentUrl, location.origin)?.pathname === new URL(uri, location.origin)?.pathname)return;
		if(!sessionData.navigateToEventAdded){
			if(!sessionData.addCustomEventPromise){
				sessionData.addCustomEventPromise = addCustomEvent()
					.finally(() => sessionData.addCustomEventPromise = null);
			}
			await sessionData.addCustomEventPromise;
		}
		history.pushState(state, "", uri);
		document.dispatchEvent(new CustomEvent("MTLU_CustomNavigate"));

		async function addCustomEvent(){
			return new Promise(resolve=>{
				const scriptText = `
					(() => {
						document.addEventListener("MTLU_CustomNavigate", (e) => {
							dispatchEvent(new Event("popstate"));
						});
					})();
				`;
				const blob = new Blob([scriptText], { type: 'text/javascript' });
				const blobUrl = URL.createObjectURL(blob);
				const script = GM_addElement('script',{src:blobUrl, "mtlu-id": "add_custom_navigate_event"});
				script.onload = () => {
					sessionData.navigateToEventAdded = true;
					URL.revokeObjectURL(blobUrl);
					resolve(true);
				};
			});
		};
	}

	function extractTweetId(url){
		const match = url.match(/[\w]{1,}\.com\/[^/]+\/status\/(\d+)/);
		return match ? match[1] : null;
	}

	function extractUserName(url){
		const match = url.match(denyNamesRegex);
		return match ? match[0].split('/')[3] : null;
	}

	async function fetchUserData(){
		if(sessionData.userData?.screenName !== undefined)return sessionData.userData;
		let settings = await twitterApi.getAccountSettings({include_country_code: true});
		if(!settings){
			const script = Array.from(await waitElementAndGet({query: `script`, searchFunction: 'querySelectorAll', searchPlace: document.body})).find(s => {
				return s.innerText.match(/\"remote\"\:{\"settings\":.*\"settings_metadata\"\:\{\}\}/);
			});
			const settingsJson = `${script.innerText.match(/\{\"settings\":.*\"settings_metadata\"\:\{\}\}/)[0]}}`;
			settings = JSON.parse(settingsJson).settings;
		}
		sessionData.userData = {
			screenName: settings.screen_name,
			countryCode: settings.country_code,
			language: settings.language,
			protected: settings.protected,
		};
		return sessionData.userData;
	}
	function findParent(element, selector, maxDepth = 10){
		let current = element;
		let depth = 0;
		while(current !== null && depth < maxDepth){
			if(current.matches(selector)){
				return current;
			}
			current = current.parentNode;
			depth++;
		}
		return null;
	}

	function locationChange(targetPlace = document){
		const observer = new MutationObserver(mutations => {
			if(currentUrl !== document.location.href){
				currentUrl = document.location.href;
				try{
					update(true);
					addEventToScrollSnapSwipeableList();
					addSettingsButtonToTwitterSettingsMenu();
					if(currentUrl.match(/status\/[\d]+/))setTimeout(()=>{update(true)}, 700);
				}catch(error){console.error(error)}
			}
		});
		const config = {childList: true, subtree: true};
		observer.observe(targetPlace, config);
	}

	async function updateThemeMode(func = ()=>{}){
		sessionData.themeMode = {
			themeCode: null,
			themeNum: Number(getCookie('night_mode')) || 0
		}
		func();
		const color = ["#FFFFFF","#15202B","#000000"];
		const themeMeta = await waitElementAndGet({query: 'head > meta[name="theme-color"]'});
		if(!themeMeta)return "done";
		const themeColor = themeMeta.content;
		const darkModeNum = color.indexOf(themeColor);
		sessionData.themeMode.themeCode = themeColor;
		sessionData.themeMode.themeNum = darkModeNum !== -1 ? darkModeNum : null;
		func();
		const observer = new MutationObserver(mutations => {
			const themeColor = themeMeta.content;
			const darkModeNum = color.indexOf(themeColor);
			sessionData.themeMode.themeCode = themeColor;
			sessionData.themeMode.themeNum = darkModeNum !== -1 ? darkModeNum : null;
			func();
		});
		observer.observe(themeMeta, {childList: false, subtree: false, attributes: true});
	}

	function whenChangeThemeMode(){
		addStyleSheet();
	}

	async function loadSettings(){
		const storedSettings = await getFromIndexedDB('makeTwitterLittleUseful', 'settings');
		if(!storedSettings){
			const localStorageSettings = {
				'makeTwitterLittleUseful': JSON.parse(localStorage.getItem('Make_Twitter_little_useful') || '{}'),
				'webhookBringsTweetsToDiscord': JSON.parse(localStorage.getItem('webhook_brings_tweets_to_discord') || '{}'),
				'helloTweetWhereAreYouFrom': JSON.parse(localStorage.getItem('Hello_tweet_where_are_you_from') || '{}'),
				'showMeYourPixiv': JSON.parse(localStorage.getItem('Show_me_your_Pixiv') || '{}'),
				'noteTweetExpander': JSON.parse(localStorage.getItem('Note_Tweet_expander') || '{}'),
				'sneakilyFavorite': JSON.parse(localStorage.getItem('sneakilyFavorite') || '{}'),
				'engagementRestorer': JSON.parse(localStorage.getItem('Engagement_Restorer') || '{}'),
				'showAllMedias': JSON.parse(localStorage.getItem('Show_all_Medias') || '{}'),
				'quickShareTweetLink': JSON.parse(localStorage.getItem('quickShareTweetLink') || '{}'),
			};
			const featuresToggle = localStorageSettings.makeTwitterLittleUseful.featuresToggle;
			if(featuresToggle){
				localStorageSettings.makeTwitterLittleUseful.featuresToggle = {
					"webhookBringsTweetsToDiscord": featuresToggle["webhook_brings_tweets_to_discord"] ?? false,
					"helloTweetWhereAreYouFrom": featuresToggle["Hello_tweet_where_are_you_from"] ?? false,
					"showMeYourPixiv": featuresToggle["Show_me_your_Pixiv"] ?? false,
					"noteTweetExpander": featuresToggle["Note_Tweet_expander"] ?? true,
					"sneakilyFavorite": featuresToggle["sneakilyFavorite"] ?? false,
					"engagementRestorer": featuresToggle["Engagement_Restorer"] ?? false,
					"quickShareTweetLink": featuresToggle["quickShareTweetLink"] ?? false,
					"showFollowers": featuresToggle["showFollowers"] ?? false,
					"hideAnalytics": featuresToggle["hideAnalytics"] ?? false,
					"showAllMedias": featuresToggle["Show_all_Medias"] ?? false,
				}
			}else{
			};
			scriptSettings = localStorageSettings;
			return "OK";
		}
		scriptSettings = storedSettings;
		return "OK";
	}

	async function saveSettings(){
		await saveToIndexedDB('makeTwitterLittleUseful', 'settings', scriptSettings);
		return "OK";
	}

	async function loadScriptDataStore(){
		const storedData = await getFromIndexedDB('makeTwitterLittleUseful', 'scriptDataStore');
		if(storedData){
			scriptDataStore = storedData;
		}else{
			scriptDataStore = {};
		}
		return "OK";
	}

	async function saveScriptDataStore(){
		await saveToIndexedDB('makeTwitterLittleUseful', 'scriptDataStore', scriptDataStore);
		return "OK";
	}

function _i18n(){
    const lang = scriptSettings?.makeTwitterLittleUseful?.language || getCookie('lang');
    envText = Text[lang] || (lang === 'zh' ? Text.zh : Text.en);
}

	function addStyleSheet(){
		let style = document.querySelector('style[scriptName="makeTwitterLittleUseful"]');
		if(!style){
			style = document.createElement('style');
			style.setAttribute('scriptName', 'makeTwitterLittleUseful');
			document.head.appendChild(style);
		}

		style.innerHTML = `
			.MTLU_fontColor {
				color: ${colors.get("fontColor")};
			}
			.MTLU_fontColorDark {
				color: ${colors.get("fontColorDark")};
			}
			.MTLU_backgroundColor {
				background-color: ${colors.get("backgroundColor")};
			}
			.MTLU_borderColor {
				border-color: ${colors.get("borderColor")};
			}
			.MTLU_menuHoverEffect {
				background-color: ${colors.get("menuHoverEffect")};
			}
			.MTLU_menuHoverEffectLight {
				background-color: ${colors.get("menuHoverEffectLight")};
			}

			.MTLU_link {
				color: ${colors.get("twitterBlue")};
				text-decoration: none;
				width: fit-content;
			}
			.MTLU_link:hover {
				text-decoration: underline;
				text-decoration-thickness: 1px;
				outline-style: none;
			}

			.MTLU_container button {
				background-color: ${colors.get("buttonBackgroundColor")};
				color: ${colors.get("buttonFontColor")};
				border: 2px solid ${colors.get("buttonBorderColor")};
				border-radius: 2px;
				padding: 0px 5px;
				cursor: pointer;
				transition: background-color 0.2s;
			}
			.MTLU_container button:hover {
				background-color: ${colors.getWithAlpha("buttonBackgroundColor", 0.8)};
			}
			.MTLU_container button:disabled {
				opacity: 0.5;
				cursor: not-allowed;
			}

			.MTLU_container select {
				background-color: ${colors.get("dropdownBackgroundColor")};
				color: ${colors.get("dropdownFontColor")};
				border: 1px solid ${colors.get("dropdownBorderColor")};
				border-radius: 2px;
				padding: 0px 5px;
			}
			.MTLU_container select:hover {
				background-color: ${colors.getWithAlpha("dropdownBackgroundColor", 0.9)};
			}

			.MTLU_container input[type="text"],
			.MTLU_container input[type="textbox"] {
				background-color: ${colors.get("dropdownBackgroundColor")};
				color: ${colors.get("dropdownFontColor")};
				border: 1px solid ${colors.get("dropdownBorderColor")};
				border-radius: 2px;
				transition: background-color 0.2s, border-color 0.2s;
				box-sizing: border-box;
			}

			.MTLU_container input[type="text"]:hover,
			.MTLU_container input[type="textbox"]:hover {
				background-color: ${colors.getWithAlpha("dropdownBackgroundColor", 0.9)};
			}

			.MTLU_container input[type="text"]:focus,
			.MTLU_container input[type="textbox"]:focus {
				border-color: ${colors.get("twitterBlue")};
				outline: none;
				background-color: ${colors.getWithAlpha("dropdownBackgroundColor", 0.95)};
			}

			.MTLU_container input[type="text"]:disabled,
			.MTLU_container input[type="textbox"]:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				background-color: ${colors.getWithAlpha("dropdownBackgroundColor", 0.5)};
			}
		`.replace(/^	{3}/g,''); // tabを3つ消している(やんなくてもいいけど！)
	}

	function getCookie(name){
		let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg)){
			return decodeURIComponent(arr[2]);
		}else{
			return null;
		}
	}

	function sleep(time){
		return new Promise((resolve)=>{
			setTimeout(()=>{return resolve(time)}, time);
		});
	}

	function getLocale(languageCode){
		const localeMap = {
			'ja': 'ja-JP',
			'en': 'en-US',
		};
		return localeMap[languageCode] || languageCode;
	}

	function decodeHtml(html){
		const txt = document.createElement("div");
		txt.innerHTML = html;
		return txt.textContent;
	}

	function escapeHTML(str){
		return str.replace(/[&<>"']/g, function(match){
			switch(match){
				case '&':
					return '&amp;';
				case '<':
					return '&lt;';
				case '>':
					return '&gt;';
				case '"':
					return '&quot;';
				case "'":
					return '&#39;';
			}
		});
	}

	function copyToClipboard(text){
		navigator.clipboard.writeText(text).then(function(){
			displayToast(envText.makeTwitterLittleUseful.copied);
			//console.log('クリップボードにコピーしました！');
		}).catch(function(err){
			console.error('コピーに失敗しました:', err);
		});
	}

	function compareVersions(version1, version2){
		// 同じなら0, v1が大きいなら1, v2が大きいなら-1
		const v1Parts = version1.split('.').map(Number);
		const v2Parts = version2.split('.').map(Number);
		const length = Math.max(v1Parts.length, v2Parts.length);
		for(let i = 0; i < length; i++){
			const v1Part = v1Parts[i] || 0;
			const v2Part = v2Parts[i] || 0;
			if(v1Part > v2Part){
				return 1;
			}
			if(v1Part < v2Part){
				return -1;
			}
		}
		return 0;
	}

	function getImageSizeFromBlob(blob){
		return new Promise((resolve, reject) => {
			const img = new Image();
			const url = URL.createObjectURL(blob);
			img.onload = ()=>{
				const width = img.width;
				const height = img.height;
				URL.revokeObjectURL(url);
				return resolve({width, height});
			};
			img.onerror = (error)=>{
				console.error(error);
				URL.revokeObjectURL(url);
				return reject(error);
			};
			img.src = url;
		});
	}

	function resizeImageToFit(maxWidth, maxHeight, originalWidth, originalHeight){
		const aspectRatio = originalWidth / originalHeight;
		let width = maxWidth;
		let height = maxHeight;
		if(originalWidth > originalHeight){
			height = maxWidth / aspectRatio;
			if(height > maxHeight){
				height = maxHeight;
				width = maxHeight * aspectRatio;
			}
		}else{
			width = maxHeight * aspectRatio;
			if(width > maxWidth){
				width = maxWidth;
				height = maxWidth / aspectRatio;
			}
		}
		return {width, height};
	}

	async function getFileSize(url){
		const response = await request({url: url, method: 'HEAD'});
		const fileSizeTmp = response.responseHeaders.match(/content-length:\s*(\d+)/i);
		const fileSize = fileSizeTmp ? parseInt(fileSizeTmp[1], 10) : undefined;
		return fileSize;
	}

	function calculateTwitterMediaSize(width, height){
		const maxSquareSize = 516;
		const maxVerticalSize = 510;
		const maxHorizontalSize = 516;
		const maxHorizontalAspectRatio = 5/1;
		const maxVerticalAspectRatio = 3/4;
		let newWidth, newHeight;
		if(width === height){
			if(width > maxSquareSize){
				newWidth = maxSquareSize;
				newHeight = maxSquareSize;
			}
		}else if(width > height){
			// 横長の場合
			const aspectRatio = width / height;
			if(aspectRatio > maxHorizontalAspectRatio){
				newWidth = maxHorizontalSize;
				newHeight = maxHorizontalSize / maxHorizontalAspectRatio;
			}else{
				if(width > maxHorizontalSize){
					newWidth = maxHorizontalSize;
					newHeight = maxHorizontalSize / aspectRatio;
				}else{
					newWidth = width;
					newHeight = height;
				}
			}
		}else{
			// 縦長の場合
			const aspectRatio = width / height;
			if(aspectRatio < maxVerticalAspectRatio){
				newHeight = maxVerticalSize;
				newWidth = maxVerticalSize * maxVerticalAspectRatio;
			}else{
				if(height > maxVerticalSize){
					newHeight = maxVerticalSize;
					newWidth = maxVerticalSize * aspectRatio;
				}else{
					newWidth = width;
					newHeight = height;
				}
			}
		}
		return [newWidth, newHeight];
	}

	function simulateKey(keyCode, type, element) {
		const event = new KeyboardEvent(type, {
			key: keyCode,
			keyCode: keyCode,
			which: keyCode,
			bubbles: true
		});
		element.dispatchEvent(event);
	}

	function createLinkElement(href, text, additionalClass = ""){
		const colors = new Colors();
		const linkElement = document.createElement("a");
		linkElement.style.width = "fit-content";
		linkElement.href = href;
		linkElement.textContent = text;
		linkElement.className = `${additionalClass} css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-poiln3 r-1loqt21 MTLU_link`;
		linkElement.target = "_blank";
		linkElement.rel = "noopener nofollow";
		/*
		linkElement.addEventListener('mouseenter', function(){
			linkElement.classList.add('r-1ny4l3l', 'r-1ddef8g', 'r-tjvw6i');
		});
		linkElement.addEventListener('mouseleave', function(){
			linkElement.classList.remove('r-1ny4l3l', 'r-1ddef8g', 'r-tjvw6i');
		});
		*/
		return linkElement;
	}

	function createSvgElement(paths, viewBox = "0 0 24 24"){
		let isPathArray = false;
		if(typeof paths === 'string'){
			isPathArray = true;
			paths = [paths];
		}
		const [minX, minY, width, height] = viewBox.split(" ").map(Number);

		const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
		svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		svg.setAttributeNS(null, "viewBox", viewBox);
		//svg.style.width = `${width}px`;
		//svg.style.height = `${height}px`;

		const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		svg.appendChild(g);

		const svgPaths = paths.map(path => {
			const svgPath = document.createElementNS("http://www.w3.org/2000/svg", 'path');
			svgPath.setAttribute("d", path);
			svgPath.style.fill = "currentColor";
			g.appendChild(svgPath);
			return svgPath;
		});

		return {svg: svg, g: g, paths: isPathArray ? svgPaths : svgPaths[0]};
	}

	function getValueFromObjectByPath(object, path, defaultValue = undefined){
		const isArray = Array.isArray;
		if(object == null || typeof object != 'object') return defaultValue;
		return (isArray(object)) ? object.map(createProcessFunction(path)) : createProcessFunction(path)(object);
		function createProcessFunction(path){
			if(typeof path == 'string') path = path.split('.');
			if(!isArray(path)) path = [path];
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
			if(value == null) return '';
			if(typeof value == 'string') return value;
			if(isArray(value)) return value.map(toString) + '';
			const result = value + '';
			return '0' == result && 1 / value == -(1 / 0) ? '-0' : result;
		}
	}

	function removeNullFromArray(arr){
		return arr.filter(function(x){return !(x === null || x === undefined || x === "")});
	}

	function findMatchFromArray(arr, regex, returnMatchedSubstring = false){
		const matchedElement = arr.find(element => regex.test(element));
		if(matchedElement && returnMatchedSubstring){
			const matchResult = matchedElement.match(regex);
			return matchResult ? matchResult[0] : undefined;
		}
		return matchedElement;
	}

	function roundHalfUp(originalValue, whereRoundOff, decimalPlace = 0, unitStr = ""){
		//四捨五入関数。
		/*
		originalValue: 元の値
		whereRoundOff: どこで四捨五入するか(0.1, 1, 10, 100, 1000など)
		decimalPlace: 小数点以下を何桁にするか(1, 2, 3, 4, 5など)
		unitStr: 単位を末尾につける(千,万など)
		*/
		if(Number(originalValue)>=Number(whereRoundOff)){
			let tmpValue;
			tmpValue = Math.round(Number(originalValue) / Number(whereRoundOff) * Math.pow(10,Number(decimalPlace))) / Math.pow(10,Number(decimalPlace));
			if(unitStr == ""){
				return tmpValue;
			}else{
				return `${tmpValue}${unitStr}`
			}
		}else{
			return originalValue;
		}
	}

	function readFile(event, readAs = 'text'){
		const file = event.target.files[0];
		if(file){
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = async function(e){
					try{
						if(e.target.result === null){
							console.error({error: 'Failed to read file.', target: e.target});
							return reject('Failed to read file.');
						}
						return resolve(e.target.result);
					}catch(error){
						console.error({error: error, target: e.target});
						return reject(error);
					}
				};
				reader.onerror = function(e) {
					console.error({error: 'Error reading file.', target: e.target});
					return reject(e.target.error);
				};
				switch(readAs){
					case 'text':
						reader.readAsText(file);
						break;
					case 'arrayBuffer':
						reader.readAsArrayBuffer(file);
						break;
					case 'binaryString':
						reader.readAsBinaryString(file);
						break;
					case 'dataURL':
						reader.readAsDataURL(file);
						break;
					default:
						return reject('Invalid readAs type.');
				}
			});
		}else{
			return 'No file selected.';
		}
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
						resolve(structuredClone(event.target.result.data));
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

	async function addEventToScrollSnapSwipeableList(){
		try{
			if(!currentUrl.match(/home$/))return;
			const element = await waitElementAndGet({query: '[data-testid="ScrollSnap-SwipeableList"]:not(.MTLU_Do_Update)', searchFunction: 'querySelector'});
			element.classList.add("MTLU_Do_Update");
			element.addEventListener("click", async () => {
				await sleep(500);
				update();
			});
		}catch{}
	}

	async function addEventToHomeButton(){
		const element = await waitElementAndGet({query: '[data-testid="AppTabBar_Home_Link"]:not(.MTLU_Do_Update)', searchFunction: 'querySelector'});
		element.classList.add("MTLU_Do_Update");
		element.addEventListener("click", async ()=>{
			update();
		});
	}

	async function addSettingsButtonToTwitterSettingsMenu(start = false){
		if(currentUrl.match(/\.com\/settings\/display/)){
			const backgroundColorPicker = findParent(document.querySelector('[role="radiogroup"]:not(.MTLU_Settings_Button_Adder) [name="background-picker"]'), '[role="radiogroup"]');
			if(backgroundColorPicker){
				backgroundColorPicker.classList.add('MTLU_Settings_Button_Adder');
				backgroundColorPicker.addEventListener('click', async ()=>{
					await sleep(100);
					addSettingsButtonToTwitterSettingsMenu();
				});
			}
		}
		if(!currentUrl.match(/\.com\/settings/))return;
		if(document.querySelector('.MTLU_Settings_Button'))return;
		const colors = new Colors();
		const tabList = await waitElementAndGet({query: 'main div[role="tablist"]', searchFunction: 'querySelector', ...(start ? {interval: 200, retry: 20} : {interval: 100, retry: 10})});
		tabList.classList.add('MTLU_Settings_Button_Added');
		const tabs = Array.from(tabList.querySelectorAll('div[data-testid="activeRoute"]'));
		const classLists = tabs.map(tab => Array.from(tab.classList).sort().join(' '));
		let targetTab = null;
		const duplicateClassLists = classLists.filter((classList, index) => classLists.indexOf(classList) !== index);
		if(duplicateClassLists.length > 0){
			targetTab = tabs[classLists.indexOf(duplicateClassLists[0])];
		}
		if(targetTab){
			const newTab = targetTab.cloneNode(true);
			newTab.classList.add('MTLU_Settings_Button');
			const newTabLinkNode = newTab.querySelector('a');
			newTabLinkNode.href = '#';
			newTabLinkNode.querySelector('span').textContent = envText.makeTwitterLittleUseful.displaySettingsButtonText;
			newTabLinkNode.addEventListener('click', (event) => {
				event.preventDefault();
				createSettingsPage();
			});
			if(document.querySelector('.MTLU_Settings_Button'))return;
			tabList.appendChild(newTab);
			newTabLinkNode.addEventListener('mouseenter', function(){
				newTabLinkNode.style.backgroundColor = colors.get('menuHoverEffectLight');
			});
			newTabLinkNode.addEventListener('mouseleave', resetColor);
			newTabLinkNode.addEventListener('touchend', resetColor);
			newTabLinkNode.addEventListener('touchcancel', resetColor);
			function resetColor(){
				newTabLinkNode.style.backgroundColor = '';
			}
		}
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
				const targetElements = searchFn();
				if(targetElements && (!(targetElements instanceof NodeList) || targetElements.length >= 1)){
					clearInterval(setIntervalId);
					return resolve(targetElements);
				}
			}
		});
	}

	function objectToUri(obj){
		return encodeURIComponent(JSON.stringify(obj));
	}

	async function expandShorteningLink(urls){
		let isInputArray = true;
		const reqestHeaders = {
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"Referer": "https://geek-website.com/tool/shortlink_open/",
			"Host": 'geek-website.com',
		};
		if(typeof urls === 'string'){
			urls = [urls];
			isInputArray = false;
		}
		async function expandURL(url){
			if(!isUrl(url)){
				throw new Error(`Invalid URL: ${url}`);
			}
			const response = await request({url: 'https://geek-website.com/tool/shortlink_open/request.php', method: 'POST', headers: reqestHeaders, body: `shortlink=${encodeURIComponent(url)}`, respType: 'json'});
			return ({
				original: url,
				expanded: response
			});
		}
		const results = await Promise.all(urls.map(url => expandURL(url)));
		if(!isInputArray){
			return results[0];
		}
		return results;
	}

	function isUrl(url){
		if(typeof url !== 'string')return false;
		return url?.match(/https?:\/\/[\w!\?/\+\-_~=;\.,\*&@#\$%\(\)'\[\]]+/);
	}

	async function getPixivLinkCollection(){
		const pixivLinkCollectionDatabeseVersion = 20250505;
		const fileUrl = 'https://raw.githubusercontent.com/Happy-come-come/UserScripts/refs/heads/main/Twitter%E3%82%92%E5%B0%91%E3%81%97%E4%BE%BF%E5%88%A9%E3%81%AB%E3%80%82/data/screenName2PixivID.json';
		const thisStoredData = scriptDataStore?.makeTwitterLittleUseful?.pixivLinkCollection;
		if(!thisStoredData?.dataBaseVersion || (thisStoredData?.dataBaseVersion < pixivLinkCollectionDatabeseVersion)){
			const response = await request({url: fileUrl});
			if(response["データチェック"] === "乱反射する眼差し"){
				if(!scriptDataStore.makeTwitterLittleUseful)scriptDataStore.makeTwitterLittleUseful = {};
				if(!scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection)scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection = {};
				scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection.dataBase = response;
				scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection.dataBaseVersion = pixivLinkCollectionDatabeseVersion;
				await saveScriptDataStore();
				return "OK";
			}else{
				throw({error: envText.makeTwitterLittleUseful.invaildData, response: response});
			}
		}
	}

	function getPixivUrlWithScreenName(screenName){
		const customData = scriptDataStore.makeTwitterLittleUseful?.pixivLinkCollection?.customData;
		let pixivUrl = customData ? customData[screenName] : null;
		if(pixivUrl?.pixivUrl){
			return pixivUrl.pixivUrl;
		}else{
			const dataBase = scriptDataStore.makeTwitterLittleUseful?.pixivLinkCollection?.dataBase;
			pixivUrl = dataBase ? dataBase[screenName] : null;
			if(Array.isArray(pixivUrl)){
				return `https://www.pixiv.net/users/${pixivUrl[0]}`;
			}else if(pixivUrl){
				return `https://www.pixiv.net/users/${pixivUrl}`;
			}else{
				return null;
			}
		}
	}
	async function addPixivLinksToScriptDataStore(screenNames, force = false){
		const promises = screenNames.map(async screenName => {
			const customData = scriptDataStore.makeTwitterLittleUseful?.pixivLinkCollection?.customData;
			if((customData ? customData[screenName] : null) && !force)return "Already exists";
			//if((((scriptDataStore.Show_me_your_Pixiv[screen_name]?.Create_date || 0) + 604800000) <= new Date().getTime()) || force){
			if(force){
				const userData = await twitterApi.getUser(screenName);
				const bioUrls = [];
				if(userData.bio){
					Object.keys(userData.bio.entityMap).forEach(k=>{
						const entry = userData.bio.entityMap[k];
						if(entry.type === "LINK")bioUrls.push(entry.data.url);
					});
				}
				const userEntitiesData = userData.legacy?.entities || userData.entities;
				const endStat = await findPixivLinkFromUrls(extractUrls(userEntitiesData).concat(bioUrls));
				if(!scriptDataStore.makeTwitterLittleUseful)scriptDataStore.makeTwitterLittleUseful = {};
				if(!scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection)scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection = {};
				if(!scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection.customData)scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection.customData = {};
				if(endStat == "Too Many Requests"){
					console.log("API limit.");
				}else if(!endStat || endStat?.match(/(?:users\/|member.php\?id=)(11|9949830|15241365)(\/|$)/)){
					scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection.customData[screenName] = {"pixivUrl": null};
					return `${screenName}: Pixivリンクなし`;
				}else{
					scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection.customData[screenName] = {"pixivUrl": endStat.replace(/^https?/,'https')};
					return `${screenName}: ${endStat}`;
				}
			}else{
				return "nothing to do";
			}
		});
		const results = await Promise.allSettled(promises);
		results.forEach(result => {
			if(result.status === 'fulfilled'){
				//debug(result.value);
			}else{
				console.error(`Failure: ${result.reason}`);
			}
		});
		await saveScriptDataStore();
		return "finished!";
		function extractUrls(entities){
			const urls = [];
			if(entities.description && entities.description.urls){
				entities.description.urls.forEach(urlObj => {
					urls.push(urlObj.expanded_url || urlObj.url);
				});
			}
			if(entities.url && entities.url.urls){
				entities.url.urls.forEach(urlObj => {
					urls.push(urlObj.expanded_url || urlObj.url);
				});
			}
			return urls;
		}
	}
	async function findPixivLinkFromUrls(urls){
		const pixivUrlRegex = /^https?:\/\/(((www|touch)\.)?pixiv\.(net\/([a-z]{2}\/)?((member(_illust)?\.php\?id\=|(users|u)\/)[0-9]*)|me\/.*))/;
		const fanboxUrlRegex = /^https?:\/\/(www\.pixiv\.net\/fanbox\/creator\/[0-9]*|(.*\.)?fanbox\.cc\/?(@.*)?)/;
		return new Promise(async function(resolve){
			let pixivUrl;
			if(urls.length > 0){
				pixivUrl = await finder(urls);
				if(!pixivUrl){
					urls = (await expandShorteningLink(urls))?.expanded || [];
					pixivUrl = (urls?.length > 0) ? await finder(urls) : null;
					return resolve(pixivUrl);
				}else{
					return resolve(pixivUrl);
				}
			}
			return resolve(null);
		});
		async function finder(){
			let tmpPixivUrl = findMatchFromArray(urls, pixivUrlRegex, true);
			if(tmpPixivUrl)return tmpPixivUrl;
			const tmpFanboxUrl = findMatchFromArray(urls, fanboxUrlRegex, true);
			if(tmpFanboxUrl){
				tmpPixivUrl = await whenFanbox(findMatchFromArray(urls, fanboxUrlRegex, true));
				if(tmpPixivUrl)return tmpPixivUrl;
			}else{
				const promiseList = [];
				urls.forEach(url=>{
					switch(true){
						case /^https?:\/\/sketch\.pixiv\.net\//.test(url):
							promiseList.push(new Promise(
								async function(resolve, reject){
									try{
										return resolve(await whenPixivSketch(url));
									}catch(error){
										return reject(error);
									}
								}
							));
							break;
						case /^https?:\/\/((fantia\.jp\/(fanclubs\/[0-9])?.*)|(.*\.booth\.pm)|(.*linktr\.ee)|(.*profcard\.info)|(.*lit\.link)|(potofu\.me)|(.*\.carrd\.co)|(.*\.tumblr\.com$)|(twpf\.jp)|(ci\-en\.dlsite\.com\/creator\/[0-9]*))\/?/.test(url):
							promiseList.push(new Promise(
								async function(resolve, reject){
									try{
										return resolve(await whenGeneral(url));
									}catch(error){
										return reject(error);
									}
								}
							));
							break;
						case /^https?:\/\/.*\.creatorlink\.net(\/.*)?/.test(url):
							promiseList.push(new Promise(
								async function(resolve, reject){
									try{
										return resolve(await whenGeneral(`${url.match(/^https?:\/\/.*\.creatorlink\.net/)[0]}\/Contact`));
									}catch(error){
										return reject(error);
									}
								}
							));
							break;
						case /^https?:\/\/skeb\.jp\/\@.*/.test(url):
							promiseList.push(new Promise(
								async function(resolve, reject){
									try{
										return resolve(await whenSkeb(url.replace(/^https?:\/\/skeb\.jp\/\@/,'')));
									}catch(error){
										return reject(error);
									}
								}
							));
							break;
						default:
							break;
					}
				});
				if(promiseList.length > 0){
					await Promise.any(promiseList).then((value) => {tmpPixivUrl = value}).catch(() => {tmpPixivUrl = undefined});
					if(!pixivUrlRegex.test(tmpPixivUrl))return null;
					return tmpPixivUrl.replace(/^https?/,'https').replace(/(\/|\\)$/,'');
				}
			}
			return null;
			async function whenGeneral(targetUrl){
				const response = await request({url: targetUrl.replace(/^https?/,"https"), respType: 'text'});
				//debug({url: targetUrl, response:response});
				const tmpUrl = response.split(/\"|\<|\>/).filter(function(dataStr){return dataStr.match(/^https?:(\/\/(((www|touch)\.)?pixiv\.(net\/([a-z]{2}\/)?((member(_illust)?\.php\?id\=|(users|u|fanbox\/creator)\/)[0-9].*)|me\/.*))|.*\.fanbox\.cc\/?)$/)});
				const pixivUrl = tmpUrl.find(function(element){return element.match(pixivUrlRegex)});
				if(pixivUrl)return pixivUrl;
				const fanboxUrl = tmpUrl.find(function(element){return element.match(fanboxUrlRegex)});
				if(fanboxUrl)return await whenFanbox(fanboxUrl);
				return null;
			}
			async function whenFanbox(targetUrl){
				if(targetUrl.match(/^https?:\/\/www\.pixiv\.net\/fanbox\/creator\/[0-9]*/))return targetUrl.replace('fanbox/creator', 'users');
				let fanboxName = targetUrl.match(/https?:\/\/(?:www\.)?(?:fanbox\.cc\/@([^\/]+)|([^\.]+)\.fanbox\.cc)/);
				fanboxName = fanboxName[1] || fanboxName[2];
				const headers = {
					"Host": 'api.fanbox.cc',
					"Origin": `https://${fanboxName}.fanbox.cc`
				};
				const response = await request({url: `https://api.fanbox.cc/creator.get?creatorId=${fanboxName}`, headers: headers, onlyResponse: false});
				if(response.status == "404")return null;
				const pixivUrl = findMatchFromArray(response.response.body.profileLinks, pixivUrlRegex, true);
				return pixivUrl ? pixivUrl : `https://www.pixiv.net/users/${response.response.body.user.userId}`;
			}
			async function whenPixivSketch(targetUrl){
				const response = await request({url: targetUrl});
				const pixivId = response.split(',').filter(function(dataStr){return dataStr.match(/\\"pixiv_user_id\\":\\"[\d]+\\"/)});
				return pixivId ? `https://www.pixiv.net/users/${pixivId[0].match(/[\d]+/)[0]}` : null;
			}
			async function whenSkeb(target){
				const headers = {
					"Referer": `https://skeb.jp/@${target}`,
					"Alt-Used": 'skeb.jp',
					"Authorization": 'Bearer null'
				};
				const response = await request({url: `https://skeb.jp/api/users/${target}`, headers: headers});
				const pixivId = response.pixiv_id;
				return pixivId ? `https://www.pixiv.net/users/${pixivId}` : null;
			}
		}
	}

	async function encodeBase64(data){
		const blob = new Blob([data], {type: 'text/plain; charset=UTF-8'});
		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.onloadend = () => resolve(reader.result.split(',')[1]);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	}

	function decodeBase64(encodedData){
		const bytes = atob(encodedData).split('').map(char => char.charCodeAt(0));
		return new TextDecoder().decode(new Uint8Array(bytes));
	}

	function h(tag, props = {}, ...children){
		const el = document.createElement(tag);
		for(const key in props){
			const val = props[key];
			if(key === "style" && typeof val === "object"){
				Object.assign(el.style, val);
			}else if(key.startsWith("on") && typeof val === "function"){
				el.addEventListener(key.slice(2).toLowerCase(), val);
			}else if(key.startsWith("aria-") || key === "role"){
				el.setAttribute(key, val); // 強制的に属性にする
			}else if(key === "dataset" && typeof val === "object"){
				for(const dataKey in val){
					if(val[dataKey] != null){
						el.dataset[dataKey] = val[dataKey];
					}
				}
			}else if(key.startsWith("data-")){
				const prop = key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase()); // dataset
				el.dataset[prop] = val;
			}else if(key === "ref" && typeof val === "function"){
				val(el); // 作成直後のDOMノードを渡す
			}else if(key in el){
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

	function customAlert(message){
		const overlay = document.createElement('div');
		overlay.className = 'MTLU_alert MTLU_container';
		overlay.style.position = 'fixed';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		overlay.style.zIndex = '9999';

		const alertBox = document.createElement('div');
		alertBox.style.position = 'absolute';
		alertBox.style.top = '50%';
		alertBox.style.left = '50%';
		alertBox.style.transform = 'translate(-50%, -50%)';
		alertBox.style.padding = '20px';
		alertBox.style.backgroundColor = 'white';
		alertBox.style.border = '1px solid black';
		alertBox.style.zIndex = '10000';

		const alertMessage = document.createElement('p');
		alertMessage.style.color = 'black';
		alertMessage.innerHTML = message;

		const closeButton = document.createElement('button');
		closeButton.textContent = envText.makeTwitterLittleUseful.close;
		closeButton.addEventListener('click', () => {
			document.body.removeChild(overlay);
		});

		alertBox.appendChild(alertMessage);
		alertBox.appendChild(closeButton);
		overlay.appendChild(alertBox);
		document.body.appendChild(overlay);
	}
	async function displayToast(text, time = 2000){
		try{
			// メインのコンテナを作成
			const toastContainer = document.createElement('div');
			toastContainer.setAttribute("cta-id", "custom-alert");

			// メインのスタイルを設定
			Object.assign(toastContainer.style, {
				position: 'fixed',
				left: '50%',
				bottom: '0px',
				transform: 'translateX(-50%)',
				pointerEvents: 'none',
				backfaceVisibility: 'hidden',
				zIndex: 100000,
				display: 'flex',
				justifyContent: 'center',
				width: '100%',
				maxWidth: '600px',
			});

			// 実際のアラートを表示するdiv
			const alertBox = document.createElement('div');
			Object.assign(alertBox.style, {
				display: 'flex',
				alignItems: 'center',
				backgroundColor: 'rgb(29, 155, 240)',
				justifyContent: 'space-between',
				pointerEvents: 'auto',
				alignSelf: 'center',
				transitionProperty: 'opacity',
				transitionDuration: '170ms',
				transitionTimingFunction: 'cubic-bezier(0, 0, 1, 1)',
				opacity: '1',
				padding: '12px',
				borderRadius: '4px',
				marginBottom: '32px',
				color: 'rgb(255, 255, 255)',  // 白い文字
				overflowWrap: 'break-word',
				fontSize: '1em',
				lineHeight: '1.25em',
				flexShrink: '1',
			});

			// テキストを表示するdiv
			const textNode = document.createElement('span');
			textNode.textContent = text;

			alertBox.appendChild(textNode);
			toastContainer.appendChild(alertBox);
			document.querySelector('body').appendChild(toastContainer);
			await sleep(time);
			toastContainer.remove();
		}catch(error){
			console.error(error);
		}finally{
			const node = document.querySelector('[cta-id="custom-alert"]');
			if(node)node.remove();
		}
	}

	function createTweetTextElement(tweetData, appendNavigate = true){
		if(!tweetData)return null;
		const isNoteTweet = !!tweetData.note_tweet?.note_tweet_results?.result;
		let tweetBodyText, hashtags, urls, mentions, symbols;
		if(isNoteTweet){
			const data = tweetData.note_tweet.note_tweet_results.result;
			tweetBodyText = data.text;
			hashtags = data.entity_set.hashtags || [];
			urls = data.entity_set.urls || [];
			mentions = data.entity_set.user_mentions || [];
			symbols = data.entity_set.symbols || [];
		}else{
			const data = tweetData.legacy || tweetData;
			tweetBodyText = data.full_text;
			hashtags = data.entities.hashtags || [];
			urls = data.entities.urls || [];
			mentions = data.entities.user_mentions || [];
			symbols = data.entities.symbols || [];
		}
		const mediaUrls = (tweetData.legacy?.extended_entities?.media || tweetData.extended_entities?.media || []).map(media => media.url);
		mediaUrls.forEach(mediaUrl => {
			tweetBodyText = tweetBodyText?.replace(mediaUrl, '');
		});
		if(!tweetBodyText)return null;
		let tweetBodyArray = Array.from(tweetBodyText);
		const currentTimeMillis = new Date().getTime();
		const tagStart = `tagStart${currentTimeMillis}`;
		const tagEnd = `tagEnd${currentTimeMillis}`;
		const ampersand = `ampersand${currentTimeMillis}`;
		const doubleQuote = `doubleQuote${currentTimeMillis}`;
		const singleQuote = `singleQuote${currentTimeMillis}`;
		let combined = [].concat(
			hashtags.map(tag => ({
				type: 'hashtag',
				indices: tag.indices,
				text: tag.text
			})),
			mentions.map(mention => ({
				type: 'mention',
				indices: mention.indices,
				text: mention.screen_name
			})),
			symbols.map(symbol => ({
				type: 'symbol',
				indices: symbol.indices,
				text: symbol.text
			}))
		);
		combined.sort((a, b) => b.indices[0] - a.indices[0]);
		combined.forEach(item => {
			let replacement;
			switch(item.type){
				case 'hashtag':
					replacement = `<a class="${envSelector.link.nomal}" text="${item.text}" style="color:rgb(29, 155, 240)" dir="ltr" role="link" href="https://twitter.com/hashtag/${item.text}" target="_blank" rel="noopener nofollow" usenavigate="${appendNavigate}">#${item.text}</a>`;
					break;
				case 'mention':
					replacement = `<a class="${envSelector.link.nomal}" text="${item.text}" style="color:rgb(29, 155, 240)" dir="ltr" role="link" href="https://twitter.com/${item.text}" target="_blank" rel="noopener nofollow" usenavigate="${appendNavigate}">@${item.text}</a>`;
					break;
				case 'symbol':
					replacement = `<a class="${envSelector.link.nomal}" text="${item.text}" style="color:rgb(29, 155, 240)" dir="ltr" role="link" href="https://twitter.com/search?q=%24${item.text}&src=cashtag_click" target="_blank" rel="noopener nofollow" usenavigate="${appendNavigate}">$${item.text}</a>`;
					break;
			}
			replacement = replacement.replace(/</gu, `${tagStart}`)
				.replace(/>/gu, `${tagEnd}`)
				.replace(/&/gu, `${ampersand}`)
				.replace(/"/gu, `${doubleQuote}`)
				.replace(/'/gu, `${singleQuote}`);
			const [start, end] = item.indices;
			tweetBodyArray.splice(start, end - start, ...Array.from(replacement));
		});
		tweetBodyText = tweetBodyArray.join('');
		const seen = new Set();
		urls.filter(target => !seen.has(target.url) && seen.add(target.url)).forEach(target =>{
			const link = `<a class="${envSelector.link.nomal}" style="color:rgb(29, 155, 240)" dir="ltr" role="link" href="${target.url}" target="_blank" rel="noopener noreferrer nofollow">${target.display_url}</a>`.replace(/</gu, `${tagStart}`)
				.replace(/>/gu, `${tagEnd}`)
				.replace(/&/gu, `${ampersand}`)
				.replace(/"/gu, `${doubleQuote}`)
				.replace(/'/gu, `${singleQuote}`);
			tweetBodyText = tweetBodyText.replace(new RegExp(`${target.url}(?=(\\s|$|\\u3000|\\W)(?!\\.|,))`, 'gu'), link);
		});
		tweetBodyText = escapeHTML(tweetBodyText);
		tweetBodyText = tweetBodyText.replace(new RegExp(tagStart, 'g'), '<')
			.replace(new RegExp(tagEnd, 'g'), '>')
			.replace(new RegExp(ampersand, 'g'), '&')
			.replace(new RegExp(doubleQuote, 'g'), '"')
			.replace(new RegExp(singleQuote, 'g'), "'");
		const newTweetBody = document.createElement('div');
		newTweetBody.className = 'css-901oao css-16my406 r-1qd0xha r-bcqeeo r-qvutc0';
		newTweetBody.innerHTML = tweetBodyText;
		newTweetBody.querySelectorAll('a[usenavigate="true"]').forEach(a=>{
			a.addEventListener('click',(e)=>{
				e.preventDefault();
				navigateTo(new URL(a.href, location.origin).pathname);
			});
		});
		return newTweetBody;
	}

	function createTweetNode(tweetData){
		const tweetUserData = tweetData.core?.user_results?.result || tweetData.user?.result ||tweetData.user;
		const tweetMainData = tweetData.legacy || tweetData;
		const verifiedBadge = tweetUserData.legacy?.is_blue_verified ? (tweetUserData.legacy?.verified_type ? tweetUserData.legacy?.verified_type: "Blue") : null;
		const tweetNode = new TweetNodeBuilder({
			screenName: tweetUserData.legacy?.screen_name || tweetUserData.screen_name,
			tweetId: tweetMainData.id_str,
		})
		.setAvatar({
			iconURL: tweetUserData.legacy?.profile_image_url_https || tweetUserData.profile_image_url_https,
			shape: tweetUserData.profile_image_shape
		})
		.setAuthor({
			name: tweetUserData.legacy?.name || tweetUserData.name,
			isProtected: tweetUserData.legacy?.protected || tweetUserData.protected,
			verifiedBadge: verifiedBadge,
			affiliatesBadge: tweetUserData.affiliates_highlighted_label?.label ? tweetUserData.affiliates_highlighted_label.label.badge?.url : null,
			createdAt: tweetMainData.created_at,
		})
		.setFooter({
			replyCount: tweetMainData.reply_count,
			retweetCount: tweetMainData.retweet_count,
			quoteCount: tweetMainData.quote_count,
			favoriteCount: tweetMainData.favorite_count,
			retweeted: tweetMainData.retweeted,
			favorited: tweetMainData.favorited,
			bookmarked: tweetMainData.bookmarked,
			analyticsCount: tweetData.views ? tweetData.views.count : 0,
		});
		const tweetTextElement = createTweetTextElement(tweetData);
		if(tweetTextElement)tweetNode.setText(tweetTextElement);
		const tweetMedias = tweetMainData.extended_entities?.media?.map(media => {
			if(media.type === 'photo'){
				return {
					type: 'photo',
					media: media.media_url_https,
					size: media.original_info
				};
			}else{
				const videoSources = media.video_info.variants
					.filter(variant => variant.content_type === "video/mp4")
					.sort((a, b) => b.bitrate - a.bitrate)
					.map(variant => ({ src: variant.url }));
				return {
					type: media.type,
					size: media.original_info,
					videoData: {
						thumbnails: media.media_url_https,
						source: {
							src: videoSources[0].src,
						},
						otherSources: videoSources,
					}
				};
			}
		}) || [];
		if(tweetMedias.length > 0)tweetNode.setMedia(tweetMedias);
		return tweetNode.build();
	}

	async function request({url, method = 'GET', respType = 'json', headers = {}, dontUseGenericHeaders = false, body = null, anonymous = false, cookie = null, maxRetries = 0, timeout = 60000, onlyResponse = true} = {}){
		if(!url)throw('url is not defined');

		const requestObject = {
			method,
			respType,
			url,
			headers: dontUseGenericHeaders ? headers : Object.assign({
				'Content-Type': '*/*',
				'Accept-Encoding': 'zstd, br, gzip, deflate',
				'User-agent': userAgent,
				'Accept': '*/*',
				'Referer': url,
				//'Sec-Fetch-Dest': 'empty',
				'Sec-Fetch-Mode': 'cors',
				'Sec-Fetch-Site': 'same-origin',
				...(cookie ? {'Cookie': cookie} : {}),
			}, headers),
			body,
			anonymous,
		};
		let retryCount = 0;
		while(retryCount <= maxRetries){
			try{
				const response = await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: requestObject.method,
						url: requestObject.url,
						headers: requestObject.headers,
						responseType: requestObject.respType,
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
				retryCount++;
				console.warn({
					error: error,
					url: requestObject.url,
					Retry: retryCount,
					object: requestObject,
				});
				if(retryCount === maxRetries){
					throw({
						error: error,
						url: requestObject.url,
						Retry: retryCount,
						object: requestObject,
					});
				}
			}
		}
	}

	async function multiPartDownload(url, numChunks = 6){
		try{
			const fileSize = await getFileSize(url);
			if(fileSize === undefined){
				console.log('File size could not be determined, downloading entire file.');
				const response = await request({ url, respType: 'blob' });
				return response.response;
			}
			const minChunkSize = 500 * 1024; // 500KB
			if(fileSize / numChunks < minChunkSize){
				numChunks = Math.ceil(fileSize / minChunkSize);
			}

			// チャンクのサイズを計算
			const baseChunkSize = Math.floor(fileSize / numChunks);
			const remainder = fileSize % numChunks;
			const promises = [];

			let start = 0;
			for(let i=0; i<numChunks; i++){
				const extra = i < remainder ? 1 : 0;
				const end = start + baseChunkSize + extra - 1;
				if(start < fileSize){
					promises.push(downloadChunk(url, start, end));
				}
				start = end + 1;
			}
			const chunks = await Promise.all(promises);

			const blob = new Blob(chunks);
			return blob;
		}catch(error){
			console.error('Error during parallel download:', error);
		}

		async function downloadChunk(url, start, end){
			const response = await request({url: url, respType: 'blob', headers: {Range: `bytes=${start}-${end}`}, maxRetries: 2, timeout: 600000});
			return response;
		}
	}

	async function createSettingsPage(){
		if(document.querySelector('[mtlu-id="settingsPage"]'))return;
		document.body.style.overflow = 'hidden';
		const isPC = !(isMobileDevice());
		const isMobile = (isMobileDevice());
		const pages = {nodes:[], selecing:{name: "", node: null}};
		const settingTargetsArray = [
			{
				targetName: "makeTwitterLittleUseful",
				displayName: envText.makeTwitterLittleUseful.settings.displayName,
				pageGenerateFunction: createMakeTwitterLittleUsefulSettingsPage,
				settingsNode: null,
				isFunction: false
			},
			{
				targetName: "webhookBringsTweetsToDiscord",
				displayName: envText.webhookBringsTweetsToDiscord.settings.displayName,
				pageGenerateFunction: createWebhookBringsTweetsToDiscordSettingsPage,
				settingsNode: null,
				isFunction: true,
				specificSave: ()=>{}
			},
			{
				targetName: "quickShareTweetLink",
				displayName: envText.quickShareTweetLink.settings.displayName,
				pageGenerateFunction: createQuickShareTweetLinkSettingsPage,
				settingsNode: null,
				isFunction: true,
			},
			{
				targetName: "showAllMedias",
				displayName: envText.showAllMedias.settings.displayName,
				pageGenerateFunction: createShowAllMediasSettingsPage,
				settingsNode: null,
				isFunction: true,
			},
			{
				targetName: "helloTweetWhereAreYouFrom",
				displayName: envText.helloTweetWhereAreYouFrom.settings.displayName,
				pageGenerateFunction: createHelloTweetWhereAreYouFromSettingsPage,
				settingsNode: null,
				isFunction: true,
			},
			{
				targetName: "customizeMenuButton",
				displayName: envText.customizeMenuButton.settings.displayName,
				pageGenerateFunction: createcustomizeMenuButtonSettingsPage,
				settingsNode: null,
				isFunction: true,
				forPC: true,
				specificSave: ()=>{}
			},
			{
				targetName: "advance",
				displayName: envText.advance.settings.displayName,
				pageGenerateFunction: createAdvanceSettingsPage,
				settingsNode: null,
				isFunction: false,
				needSave: false
			},
			{
				targetName: "forDebug",
				displayName: envText.forDebug.settings.displayName,
				pageGenerateFunction: createForDebugSettingsPage,
				settingsNode: null,
				isFunction: false,
				needSave: false
			}
		];

		const settingTargets = settingTargetsArray.reduce((acc, target) => {
			if((target.forPC && !isPC) || (target.forMobile && !isMobile)){
				return acc;
			}
			acc[target.targetName] = target;
			return acc;
		}, {});

		const documentRoot = await waitElementAndGet({query: 'body', searchFunction: 'querySelector'});
		const fragment = document.createDocumentFragment();
		const settingsPage = document.createElement('div');
		settingsPage.className = 'MTLU_settingsPage MTLU_container';
		settingsPage.setAttribute('mtlu-id', "settingsPage");
		settingsPage.style.position = 'fixed';
		settingsPage.style.width = '100%';
		settingsPage.style.height = '100%';
		settingsPage.style.backgroundColor = colors.get('backgroundColor');
		settingsPage.style.zIndex = '9990';
		settingsPage.style.display = 'flex';
		settingsPage.style.top = '0';
		settingsPage.style.left = '0';
		//settingsPage.style.color = "white";
		settingsPage.style.flexDirection = 'column';
		settingsPage.style.lineHeight = "normal";
		settingsPage.style.fontSize = "87.5%";
		settingsPage.style.color = colors.get('fontColor');
		fragment.appendChild(settingsPage);

		const headerContainer = document.createElement('div');
		headerContainer.setAttribute('mtlu-id', "headerContainer");
		headerContainer.style.width = "100%";
		headerContainer.style.height = "15%";
		headerContainer.style.display = 'flex';
		headerContainer.style.borderBottom = `2px solid ${colors.get('borderColor')}`;
		headerContainer.style.justifyContent = 'center';  // 水平方向の中央揃え
		const headerContainerElement = settingsPage.appendChild(headerContainer);

		const headerTextContainer = document.createElement('div');
		headerTextContainer.setAttribute('mtlu-id', "headerTextContainer");
		headerTextContainer.style.width = "100%";
		headerTextContainer.style.height = "100%";
		headerTextContainer.style.display = "flex";
		headerTextContainer.style.justifyContent = "center";  // 水平方向の中央揃え

		const headerText = document.createElement('span');
		headerText.style.textAlign = "center";  // テキストを中央揃えにする
		headerText.style.height = "100%";
		headerText.style.fontSize = "2.5em";
		headerText.innerText = envText.makeTwitterLittleUseful.settings.displayName;

		headerTextContainer.appendChild(headerText);
		headerContainer.append(headerTextContainer);

		// メインコンテナの作成
		const mainContainer = document.createElement('div');
		mainContainer.setAttribute('mtlu-id', "mainContainer");
		mainContainer.style.width = "100%";
		mainContainer.style.height = "100%";
		mainContainer.style.display = "flex";
		mainContainer.style.maxHeight = "85vh";
		const mainContainerElement = settingsPage.appendChild(mainContainer);

		const closeButton = document.createElement('button');
		closeButton.textContent = '✖'; // バツマーク
		closeButton.style.position = 'absolute';
		closeButton.style.top = '5px';
		closeButton.style.right = '5px';
		closeButton.style.width = '2vw'; // 横幅の2%
		closeButton.style.height = '2vw'; // 高さも横幅の2%に設定
		closeButton.style.borderRadius = '50%'; // 丸いボタン
		closeButton.style.border = 'none';
		closeButton.style.backgroundColor = 'rgba(255, 0, 0, 1.0)'; // 赤い背景
		closeButton.style.color = 'white';
		closeButton.style.fontSize = '20px';
		closeButton.style.cursor = 'pointer';
		closeButton.style.minWidth = "30px";
		closeButton.style.minHeight = "30px";

		// バツマークボタンをクリックしたらオーバーレイを削除する
		closeButton.addEventListener('click', function(){
			document.body.style.overflow = '';
			settingsPage.remove();
		});

		settingsPage.appendChild(closeButton);

		const saveButton = document.createElement('button');
		saveButton.style.backgroundColor = 'rgba(0, 150, 250, 1.0)';
		saveButton.style.width = "4vw";
		saveButton.style.height = "4vw";
		saveButton.style.cursor = 'pointer';
		saveButton.style.minWidth = "60px";
		saveButton.style.minHeight = "60px";
		saveButton.style.borderRadius = '50%';
		saveButton.style.border = 'none';
		saveButton.style.position = 'fixed';
		saveButton.style.bottom = '8vh';
		saveButton.style.right = '4vw';
		saveButton.style.display = 'flex';
		saveButton.style.alignItems = 'center';
		saveButton.style.justifyContent = 'center';
		const saveIconPath = "M606.157,120.824L489.908,4.575c-2.46-2.46-6.612-4.152-10.764-4.152H434.32H175.988H40.672 C18.222,0.423,0,18.721,0,41.095v529.734c0,22.45,18.298,40.672,40.672,40.672h86.341h368.661h75.577 c22.45,0,40.672-18.299,40.672-40.672V131.665C611.077,128.359,609.463,124.207,606.157,120.824z M419.328,31.177v136.162 c0,0.846-0.846,0.846-0.846,0.846h-42.363V31.177H419.328z M344.596,31.177v137.008H192.595c-0.846,0-0.846-0.846-0.846-0.846 V31.177H344.596z M141.929,580.9V390.688c0-35.674,29.062-64.737,64.737-64.737h208.434c35.674,0,64.737,29.062,64.737,64.737 v190.135H141.929V580.9z M580.401,570.905c0,4.997-4.152,9.995-9.995,9.995h-59.816V390.688c0-52.281-43.209-95.49-95.49-95.49 H207.511c-52.281,0-95.49,43.209-95.49,95.49v190.135H40.595c-4.997,0-9.995-4.152-9.995-9.995V41.095 c0-4.997,4.152-9.995,9.995-9.995h120.401v136.162c0,17.453,14.147,31.523,31.523,31.523h225.886 c17.453,0,31.523-14.147,31.523-31.523V31.177h23.219l107.1,107.1L580.401,570.905L580.401,570.905z M422.634,490.33 c0,8.304-6.612,14.916-14.916,14.916H217.506c-8.304,0-14.916-6.612-14.916-14.916c0-8.303,6.612-14.916,14.916-14.916h189.289 C415.945,475.415,422.634,482.027,422.634,490.33z M422.634,410.678c0,8.303-6.612,14.916-14.916,14.916H217.506 c-8.304,0-14.916-6.612-14.916-14.916s6.612-14.916,14.916-14.916h189.289C415.945,394.84,422.634,401.529,422.634,410.678z";
		const saveSvg = createSvgElement(saveIconPath, "0 0 611.923 611.923");
		saveSvg.svg.style.width = "70%";
		saveSvg.svg.style.height = "70%";
		saveButton.appendChild(saveSvg.svg);
		saveButton.addEventListener('click',()=>{retrieveSettings()});
		settingsPage.appendChild(saveButton);

		// navigationContainerの作成
		const navigationContainer = document.createElement('div');
		navigationContainer.setAttribute('mtlu-id', "navigationContainer");
		navigationContainer.style.width = (isPC ? "calc(30% - 2px)" : "70vw");
		navigationContainer.style.height = "100%";
		navigationContainer.style.display = "flex";
		navigationContainer.style.flexDirection = "column";
		navigationContainer.style.overflowY = "auto";  // 縦にスクロール可能
		navigationContainer.style.overflowX = "hidden"; // 横スクロールを防ぐ
		navigationContainer.style.overflowWrap = "break-word"; // テキストの折り返しを設定
		navigationContainer.style.borderRight = isPC ? `2px solid ${colors.get('borderColor')}` : "";
		if(isMobile){
			navigationContainer.style.left = "-70vw"; // モバイル版では画面外
			navigationContainer.style.position = "fixed"; // 固定
			navigationContainer.style.bottom = "0";
			navigationContainer.style.transition = "transform 0.1s ease"; // アニメーション用
			navigationContainer.style.zIndex = '10000';
			navigationContainer.style.backgroundColor = colors.get('backgroundColor');
		}
		const navigationContainerElement = mainContainerElement.appendChild(navigationContainer);

		const settingContainerWrapper = document.createElement("div");
		settingContainerWrapper.setAttribute('mtlu-id', "settingContainerWrapper");
		settingContainerWrapper.style.width = (isPC ? "40%" : "100%");
		settingContainerWrapper.style.height = "calc(100% - 4px)";
		settingContainerWrapper.style.borderRight = isPC ? `2px solid ${colors.get('borderColor')}` : "";
		mainContainerElement.appendChild(settingContainerWrapper);
		documentRoot.appendChild(fragment);

		let hidemobileNavigationOverlay;
		if(isMobile){
			// ナビゲーションメニューの表示・非表示を切り替えるボタン(モバイル用)
			const toggleNavButton = document.createElement('button');
			toggleNavButton.style.margin = "10px";
			toggleNavButton.style.height = (headerContainer.offsetHeight * (2/5)) + "px";
			toggleNavButton.style.width = (headerContainer.offsetHeight * (2/5)) + "px";
			toggleNavButton.style.display = "flex"; // フレックスボックスで配置
			toggleNavButton.style.alignItems = "center"; // 垂直方向の中央揃え
			toggleNavButton.style.justifyContent = "center"; // 水平方向の中央揃え
			toggleNavButton.style.position = "fixed";
			toggleNavButton.style.top = "3em";
			toggleNavButton.style.left = "10px";
			const toggleNavButtonElement = headerContainer.appendChild(toggleNavButton);
			// SVGアイコンを作成してボタンに追加
			const toggleSvg = createSvgElement("M4 7a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM4 12a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zM5 16a1 1 0 100 2h14a1 1 0 100-2H5z", "0 0 24 24");

			// SVGをボタンに追加
			toggleNavButtonElement.appendChild(toggleSvg.svg);


			// モバイル用オーバーレイを作成（非表示にする）
			const mobileNavigationOverlay = document.createElement('div');
			mobileNavigationOverlay.setAttribute('mtlu-id', 'mobileNavigationOverlay');
			mobileNavigationOverlay.style.position = 'fixed';
			mobileNavigationOverlay.style.bottom = '0';
			mobileNavigationOverlay.style.left = '0';
			mobileNavigationOverlay.style.width = '100%';
			mobileNavigationOverlay.style.height = '100%';
			mobileNavigationOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
			mobileNavigationOverlay.style.zIndex = '9998'; // ナビゲーションの後ろに配置
			mobileNavigationOverlay.style.display = 'none'; // 初期は非表示
			settingsPage.appendChild(mobileNavigationOverlay);

			// navigationContainerをスライドさせるボタンのクリックイベント
			toggleNavButton.addEventListener('click', function(){
				// モバイル版でオーバーレイを表示してナビゲーションをスライド
				mobileNavigationOverlay.style.display = 'block';
				navigationContainer.style.transform = "translateX(70vw)"; // 70vw右にスライド
			});
			hidemobileNavigationOverlay = function (){
				navigationContainer.style.transform = "translateX(0)"; // ナビゲーションを元に戻す
				mobileNavigationOverlay.style.display = 'none'; // オーバーレイを非表示
			}
			// オーバーレイをクリックしてナビゲーションを戻す
			mobileNavigationOverlay.addEventListener('click', hidemobileNavigationOverlay);
		}
		function createNavigationMenu(){
			const menuContainerStatus = {nodes: {}, selecting: {name: null, node: null}};
			for(let key of Object.keys(settingTargets)){
				const currentTarget = settingTargets[key];
				const menuContainer = document.createElement("div");
				menuContainer.setAttribute('mtlu-id', 'menuContainer');
				menuContainer.setAttribute('menuContainerStatus', 'unselect');//unselect or selecting
				menuContainer.setAttribute('target', key);
				menuContainer.style.width = "calc(100% - 2px)";
				menuContainer.style.height = "4em";
				menuContainer.style.minHeight = "4em";
				menuContainer.style.borderBottom = `2px solid ${colors.get('borderColor')}`;
				menuContainer.style.borderRight = `2px solid ${colors.getWithAlpha('twitterBlue', 0.0)}`;
				menuContainer.style.transitionDuration = "0.2s";
				menuContainer.style.display = "flex";
				if(isPC){
					menuContainer.addEventListener('mouseover',function(){
						menuContainer.style.backgroundColor = colors.get('menuHoverEffect');
					});
					menuContainer.addEventListener('mouseout',function(){
						if(menuContainerStatus.selecting.name === key)return;
						menuContainer.style.backgroundColor = '';
					});
				}
				const navigationMenutextContainer = document.createElement("div");
				navigationMenutextContainer.setAttribute('mtlu-id', 'navigationMenutextContainer');
				navigationMenutextContainer.style.width = "85%";
				navigationMenutextContainer.style.height = "100%"; // 高さは100%に設定
				navigationMenutextContainer.style.display = "flex"; // フレックスボックスにする
				navigationMenutextContainer.style.alignItems = "center"; // 垂直方向の中央揃え
				navigationMenutextContainer.style.justifyContent = "flex-start"; // 水平方向は左揃え
				const navigationMenutextContainerElement = menuContainer.appendChild(navigationMenutextContainer);

				const arrowIconContainer = document.createElement("div");
				arrowIconContainer.setAttribute('mtlu-id', 'arrowIconContainer');
				arrowIconContainer.style.color = colors.get('fontColorDark');
				arrowIconContainer.style.display = "flex"; // フレックスボックスにする
				arrowIconContainer.style.justifyContent = "center"; // 水平方向の中央揃え
				arrowIconContainer.style.alignItems = "center"; // 垂直方向の中央揃え
				arrowIconContainer.style.height = "100%"; // 親要素の高さいっぱいにする
				arrowIconContainer.style.width = `calc(100% - ${navigationMenutextContainer.style.width})`;
				const arrowIcon = createSvgElement('M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z').svg;
				arrowIcon.style.width = "2em";
				arrowIcon.style.height = "2em";
				arrowIconContainer.appendChild(arrowIcon);
				const arrowIconContainerElement = menuContainer.appendChild(arrowIconContainer);

				const navigationMenutext = document.createElement('span');
				navigationMenutext.setAttribute('mtlu-id', 'navigationMenutext');
				navigationMenutext.style.width = "100%";
				navigationMenutext.style.height = "auto";
				navigationMenutext.style.margin = "0 0 0 5%";
				navigationMenutext.style.fontSize = "1.5em";
				navigationMenutext.style.lineHeight = "1.2";
				navigationMenutext.style.userSelect = 'none';
				navigationMenutext.innerText = envText[currentTarget.targetName].settings.displayName;
				const navigationMenutextElement = navigationMenutextContainer.appendChild(navigationMenutext);

				menuContainer.addEventListener('click',function(){
					changeTarget(key);
				});

				const menuContainerElement = navigationContainer.appendChild(menuContainer);
				menuContainerStatus.nodes[key] = menuContainerElement;
			}
			menuContainerStatus.selecting.node = menuContainerStatus.nodes.makeTwitterLittleUseful;
			menuContainerStatus.selecting.name = settingTargets.makeTwitterLittleUseful.targetName;
			menuContainerStatus.nodes.makeTwitterLittleUseful.style.borderRight = `2px solid ${colors.getWithAlpha('twitterBlue', 1.0)}`;
			menuContainerStatus.nodes.makeTwitterLittleUseful.style.backgroundColor = colors.get('menuHoverEffect');
			function changeTarget(key){
				if(menuContainerStatus.selecting.name === key)return;
				const currentDisplaySettingPage = settingTargets[menuContainerStatus.selecting.name].settingsNode;
				currentDisplaySettingPage.style.zIndex = "-1";
				currentDisplaySettingPage.style.display = "none";
				const nextDisplaySettingsPage = settingTargets[key].settingsNode;
				nextDisplaySettingsPage.style.zIndex = "auto";
				nextDisplaySettingsPage.style.display = "flex";

				menuContainerStatus.selecting.node.setAttribute('menuContainerStatus', 'unselect');
				menuContainerStatus.selecting.node.style.backgroundColor = '';
				menuContainerStatus.selecting.node.style.borderRight = `2px solid ${colors.getWithAlpha('twitterBlue', 0.0)}`;

				menuContainerStatus.selecting.node = menuContainerStatus.nodes[key];
				menuContainerStatus.selecting.name = key;

				menuContainerStatus.selecting.node.setAttribute('menuContainerStatus', 'selecting');
				menuContainerStatus.selecting.node.style.backgroundColor = colors.get('menuHoverEffect');
				menuContainerStatus.selecting.node.style.borderRight = `2px solid ${colors.getWithAlpha('twitterBlue', 1.0)}`;
				headerText.innerText = envText[key].settings.displayName;
				if(isMobile)hidemobileNavigationOverlay();
			}
		}
		createNavigationMenu();
		/*
		function createHogehogeSettingsPage(){
			const settingsTarget = settingTargets.hogehoge;
			const scriptSetting = scriptSettings.hogehoge;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{id: 'fuga', name: "fuga", type: 'text', text: "hogehogehogehoge", size: "1em", weight: "400", position: "left", isHTML: false},
				{id: key, catagory: "ctName.sub", name: settingTargets[key].displayName, type: 'toggleSwitch'},

			];
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;
		}
		*/
		function createMakeTwitterLittleUsefulSettingsPage(){
			const settingsTarget = settingTargets.makeTwitterLittleUseful;
			scriptSettings.makeTwitterLittleUseful.displayChangelog = scriptSettings.makeTwitterLittleUseful.displayChangelog === undefined ? true : scriptSettings.makeTwitterLittleUseful.displayChangelog;
			const scriptSetting = scriptSettings.makeTwitterLittleUseful;
			const settingText = envText.makeTwitterLittleUseful.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{id: 'functionsToggle', type: 'text', text: settingText.functionsToggle, size: "2.5em", weight: "400", position: "left", isHTML: false},
				...Object.keys(functions)
					.map(key => {
						const func = functions[key];
						if((func.forPC ? isPC : true && func.forMobile ? isMobile : true)){
							return {id: key, name: envText[key].settings.displayName, type: 'toggleSwitch', category: "featuresToggle"}
						}
						return null;
				}).filter(item => item !== null),
				{id: 'functionsToggleFinBorder', type: 'border'},
				{type: 'text', text: settingText.language, size: "3em", weight: "400", position: "left", isHTML: false},
				{id: 'language', type: 'dropdown', option: Object.keys(Text).map(key => ({value: key, displayName: key}))},
				{type: 'text', text: settingText.uiTextType, size: "3em", weight: "400", position: "left", isHTML: false},
				{id: 'uiTextType', type: 'dropdown', option: ["old", "new"].map(key => ({value: key, displayName: key}))},
				{type: 'border', margin: "2em 0 0 0"},
				{id: 'displayChangelog', type: 'toggleSwitch', name: settingText.displayChangelog},
			];
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			page.querySelectorAll('div[category="featuresToggle"][type="toggleSwitch"]').forEach(e=>{
				const path1 = "M396.138,85.295c-13.172-25.037-33.795-45.898-59.342-61.03C311.26,9.2,280.435,0.001,246.98,0.001 c-41.238-0.102-75.5,10.642-101.359,25.521c-25.962,14.826-37.156,32.088-37.156,32.088c-4.363,3.786-6.824,9.294-6.721,15.056 c0.118,5.77,2.775,11.186,7.273,14.784l35.933,28.78c7.324,5.864,17.806,5.644,24.875-0.518c0,0,4.414-7.978,18.247-15.88 c13.91-7.85,31.945-14.173,58.908-14.258c23.517-0.051,44.022,8.725,58.016,20.717c6.952,5.941,12.145,12.594,15.328,18.68 c3.208,6.136,4.379,11.5,4.363,15.574c-0.068,13.766-2.742,22.77-6.603,30.442c-2.945,5.729-6.789,10.813-11.738,15.744 c-7.384,7.384-17.398,14.207-28.634,20.479c-11.245,6.348-23.365,11.932-35.612,18.68c-13.978,7.74-28.77,18.858-39.701,35.544 c-5.449,8.249-9.71,17.686-12.416,27.641c-2.742,9.964-3.98,20.412-3.98,31.071c0,11.372,0,20.708,0,20.708 c0,10.719,8.69,19.41,19.41,19.41h46.762c10.719,0,19.41-8.691,19.41-19.41c0,0,0-9.336,0-20.708c0-4.107,0.467-6.755,0.917-8.436 c0.773-2.512,1.206-3.14,2.47-4.668c1.29-1.452,3.895-3.674,8.698-6.331c7.019-3.946,18.298-9.276,31.07-16.176 c19.121-10.456,42.367-24.646,61.972-48.062c9.752-11.686,18.374-25.758,24.323-41.968c6.001-16.21,9.242-34.431,9.226-53.96 C410.243,120.761,404.879,101.971,396.138,85.295z";
				const path2 = "M228.809,406.44c-29.152,0-52.788,23.644-52.788,52.788c0,29.136,23.637,52.772,52.788,52.772 c29.136,0,52.763-23.636,52.763-52.772C281.572,430.084,257.945,406.44,228.809,406.44z";
				const descriptionContainer = document.createElement('div');
				Object.assign(descriptionContainer.style, {
					position: "relative",
					display: "flex",
					left: "-20px",
				});

				const svg = createSvgElement([path1, path2], "0 0 512 512").svg;
				Object.assign(svg.style, {
					width: "1.5em",
					height: "1.5em",
					marginLeft: "1em",
				});

				const description = document.createElement('div');
				description.textContent = envText[e.getAttribute('settingID')].settings.description;
				Object.assign(description.style, {
					position: 'fixed',
					transform: 'translateX(-50%)',
					backgroundColor: 'rgba(0, 0, 0, 0.75)',
					color: colors.get('fontColor'),
					padding: '5px',
					borderRadius: '5px',
					whiteSpace: 'nowrap',
					display: 'none',
					zIndex: '20000',
				});

				svg.addEventListener('mouseenter', () => {
					appearDescription();
				});

				svg.addEventListener('mouseleave', () => {
					disappearDescription();
				});

				svg.addEventListener('click', () => {
					if(description.style.display === 'block'){
						disappearDescription();
					}else{
						appearDescription();
					}
				});
				svg.addEventListener('touchstart', (e) => {
					e.preventDefault();
					if(description.style.display === 'block'){
						disappearDescription();
					}else{
						appearDescription();
					}
				});
				function appearDescription(){
					settingsPage.addEventListener('click', disappearDescription, {once: true});
					const rect = svg.getBoundingClientRect();
					description.style.top = `${rect.top - description.offsetHeight - 50}px`;
					description.style.left = `${rect.left + rect.width / 2 - description.offsetWidth / 2}px`;
					description.style.display = 'block';
				}
				const disappearDescription = ()=>{
					description.style.display = 'none';
					settingsPage.removeEventListener('click', disappearDescription);
				}
				descriptionContainer.appendChild(svg);
				descriptionContainer.appendChild(description);
				e.appendChild(descriptionContainer);
			});
			page.style.display = "flex";
			page.style.zIndex = "auto";
			return page;
		}
		function createWebhookBringsTweetsToDiscordSettingsPage(){
			const settingsTarget = settingTargets.webhookBringsTweetsToDiscord;
			const scriptSetting = scriptSettings.webhookBringsTweetsToDiscord || {};
			const settingText = envText.webhookBringsTweetsToDiscord.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			settingsTarget.specificSave = save;
			const settingEntries = [
				{type: 'text', text: settingText.displayMethod, size: "2em", weight: "400", position: "left", isHTML: false},
				{id: 'displayMethod', type: 'dropdown', option: Object.keys(settingText.displayMethodOptions).map(key => ({value: key, displayName: settingText.displayMethodOptions[key]}))},
				{type: 'text', text: settingText.sendLangage, size: "2em", weight: "400", position: "left", isHTML: false},
				{id: 'sendLangage', type: 'dropdown', option: Object.keys(Text).map(key => ({value: key, displayName: key}))},
				{type: 'text', text: settingText.downloadVideo, size: "2em", weight: "400", position: "left", isHTML: false},
				{id: 'downloadVideo', type: 'radioButton', option: Object.keys(settingText.downloadVideoOptions).map(key => ({value: key, displayName: settingText.downloadVideoOptions[key]}))},
			];

			page.appendChild(createSettingsElement({id: 'webhooks', type: 'text', text: "Webhookの設定", size: "2em", weight: "400", position: "left", isHTML: false}, scriptSetting).container);
			const webhookContainer = createSettingsElement({type: 'container'});
			webhookContainer.style.flexDirection = 'column';
			(scriptSetting?.data ? scriptSetting.data : []).forEach((s, i)=>{
				makeNewLow(i, s.name, `https://discord.com/api/webhooks/${atob(s.value)}`);
			});
			if(!scriptSetting?.data || (scriptSetting?.data.length === 0)){
				makeNewLow(false);
			}
			page.appendChild(webhookContainer);
			new Sortable(webhookContainer, {
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
			page.appendChild(createSettingsElement({type: "button", text: "+", position: "left" , event: ()=>{makeNewLow()}}, scriptSetting).container);
			page.appendChild(createSettingsElement({type: 'text', text: settingText.defaultWebhook, size: "2em", weight: "400", position: "left", isHTML: false}, scriptSetting).container);
			const defaultWebhookDropdown = createSettingsElement({id: 'defaultWebhook', type: 'dropdown', option: getValueFromObjectByPath(scriptSetting?.data, "name", []).map(key => ({value: key, displayName: key}))}, scriptSetting);
			page.appendChild(defaultWebhookDropdown.container);
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;
			function makeNewLow(needBorder = true, name = "", webhook = ""){
				const container = document.createElement('div');
				container.setAttribute("webhookLow","true");
				container.classList.add('handle');
				container.style.width = "100%";
				container.style.display = "flex";
				container.style.flexWrap = "wrap";
				const nameContainer = document.createElement('div');
				nameContainer.style.margin = "0 2% 0 0";
				const nameLabel = document.createElement('label');
				nameLabel.style.fontSize = "1.2em";
				nameLabel.textContent = "Name: ";
				const nameInput = document.createElement('input');
				nameInput.type = "text";
				nameInput.setAttribute("webhookinput", "name");
				nameInput.style.maxWidth = "10em";
				nameInput.value = name;
				if(isMobile)nameInput.style.width = "5em";
				nameContainer.appendChild(nameLabel);
				nameContainer.appendChild(nameInput);

				const urlContainer = document.createElement('div');
				const urlLabel = document.createElement('label');
				urlLabel.style.fontSize = "1.2em";
				urlLabel.textContent = "Webhook: "
				const urlInput = document.createElement('input');
				urlInput.type = "text";
				urlInput.setAttribute("webhookinput", "webhook");
				urlInput.style.maxWidth = "10em";
				urlInput.value = webhook;
				if(isMobile)urlInput.style.width = "5em";
				urlContainer.appendChild(urlLabel);
				urlContainer.appendChild(urlInput);

				const removeButton = document.createElement('button');
				removeButton.textContent = "✕";
				removeButton.addEventListener('click',()=>{
					container.remove();
				});
				if(webhookContainer.children.length > 0)container.appendChild(createSettingsElement({id: 'functionsToggleFinBorder', type: 'border', length: 90, margin: "7px 0 7px 0"}).container);
				container.appendChild(nameContainer);
				container.appendChild(urlContainer);
				container.appendChild(removeButton);

				nameInput.addEventListener('input', validateInputs);
				urlInput.addEventListener('input', validateInputs);

				function validateInputs(){
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
					const allNameInputs = document.querySelectorAll('input[webhookinput="name"]');
					const nameValues = Array.from(allNameInputs).map(input => input.value.trim());
					const isNameDuplicate = nameValues.filter(value => value === nameInput.value.trim()).length > 1;

					if(isNameDuplicate){
						nameInput.style.backgroundColor = 'red';
					}else if(isNameFilled){
						nameInput.style.backgroundColor = '';
					}
				}

				webhookContainer.appendChild(container);
				//return {container: container, name: nameContainer, webHook: urlContainer};
			}
			function save(){
				const save = [];
				webhookContainer.querySelectorAll('[webhookLow="true"]').forEach(s=>{
					const name = s.querySelector('[webhookinput="name"]').value;
					const webhook = s.querySelector('[webhookinput="webhook"]').value;
					if(name && webhook){
						if(webhook.match(/^https\:\/\/discord\.com\/api\/webhooks\/[\d]+\/[\w-]+$/)){
							save.push({name: name, value: btoa(webhook.replace(/^https\:\/\/discord\.com\/api\/webhooks\//,''))});
						}
					}
				});
				scriptSettings[settingsTarget.targetName].data = save;
				defaultWebhookDropdown.settingsElement.innerHTML = "";
				(scriptSetting.data?.length > 0 ? scriptSetting.data : []).forEach((opt, index) => {
					const option = document.createElement('option');
					option.value = index;
					option.text = opt.name;
					if(scriptSetting.defaultWebhook == index){
						option.selected = true;
					}
					defaultWebhookDropdown.settingsElement.appendChild(option);
				});
			}
		}

		function createQuickShareTweetLinkSettingsPage(){
			const settingsTarget = settingTargets.quickShareTweetLink;
			const scriptSetting = scriptSettings.quickShareTweetLink;
			const settingText = envText.quickShareTweetLink.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{type: 'text', text: settingText.copyDomain, size: "2.5em", weight: "400", position: "left", isHTML: false},
				{id: 'domain', type: 'dropdown', option: ['twitter.com', 'x.com', 'vxtwitter.com', 'ohter'].map(key => ({value: key, displayName: key}))},
				{type: 'text', text: settingText.customDomain, size: "2.0em", weight: "400", position: "left", isHTML: false},
				{id: 'otherDomain', type: 'textBox'}

			];
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;
		}

		function createShowAllMediasSettingsPage(){
			const settingsTarget = settingTargets.showAllMedias;
			const scriptSetting = scriptSettings.showAllMedias;
			const settingText = envText.showAllMedias.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{type: 'text', text: settingText.displayMethod, size: "2em", weight: "400", position: "left", isHTML: false},
				{id: 'displayMethod', type: 'radioButton', option: [{value: "expand", displayName: settingText.expand}, {value: "likeTweet", displayName: settingText.likeTweet}]},
				{id: 'removeBlur', name: settingText.removeBlur, type: 'toggleSwitch'},
				{id: 'onlyRemoveBlur', name: settingText.onlyRemoveBlur, type: 'toggleSwitch'},
			];
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;
		}

		function createHelloTweetWhereAreYouFromSettingsPage(){
			const settingsTarget = settingTargets.helloTweetWhereAreYouFrom;
			const scriptSetting = scriptSettings.helloTweetWhereAreYouFrom;
			const settingText = envText.helloTweetWhereAreYouFrom.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				//{type: 'text', text: settingText.displayMethod, size: "2em", weight: "400", position: "left", isHTML: false},
				{id: 'showVideoUrl', type: 'toggleSwitch', name: settingText.showVideoUrl},
			];
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;
		}

		function createcustomizeMenuButtonSettingsPage(){
			const settingsTarget = settingTargets.customizeMenuButton;
			const scriptSetting = scriptSettings.customizeMenuButton;
			const settingText = envText.customizeMenuButton.settings;
			settingsTarget.specificSave = save;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{type: 'text', text: settingText.toAdd, size: "2em", weight: "400", position: "left", isHTML: false},
				{id: "grokButton", name: twitterTextI18n.getText("grok"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: true},
				{id: "bookmarksButton", name: twitterTextI18n.getText("bookmarks"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: true},
				{id: "jobsButton", name: twitterTextI18n.getText("jobs"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: true},
				{id: "communitiesButton", name: twitterTextI18n.getText("communities"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: true},
				{id: "premiumButton", name: twitterTextI18n.getText("premium"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: false},
				{id: "verifiedOrgButton", name: twitterTextI18n.getText("verifiedOrg"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: false},
				{id: "listsButton", name: twitterTextI18n.getText("lists"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: false},
				{id: "monetizationButton", name: twitterTextI18n.getText("monetization"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: false},
				{id: "adsButton", name: twitterTextI18n.getText("ads"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: false},
				{id: "createYourSpaceButton", name: twitterTextI18n.getText("createYourSpace"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: false},
				{id: "settingsAndPrivacy", name: twitterTextI18n.getText("settingsAndPrivacy"), type: 'toggleSwitch', category: "toAddOptions", defaultValue: false},
			];
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			for(let i=1; i<=4; i++){
				const customButtonSettingsContainer = h('div', {
						style: {
							display: "flex",
							flexDirection: "column",
							width: "100%",
							height: "fit-content",
						},
					},
					createSettingsElement({type: 'border', length: 98, margin: "7px 0 7px 0"},).container,
					createSettingsElement({id: `shortCutButton${i}`, name: `${settingText.shortCutButton}${i}`, type: 'toggleSwitch', category: "toAddOptions", defaultValue: false}, scriptSetting).container,
					h('div', {
							style: {
								display: "flex",
								flexDirection: "row",
								fontSize: "1.2em",
								marginLeft: "1em",
							},
						},
						h('label', {
								style: {
									color: colors.get('fontColor'),
									marginRight: "1em",
								},
								textContent: settingText.shortCutButtonDisplayName,
							},
						),
						createSettingsElement({id: `shortCutButton${i}DisplayName`, type: 'textBox'}, scriptSetting).settingsElement,
					),
					h('div', {
							style: {
								display: "flex",
								flexDirection: "row",
								fontSize: "1.2em",
								marginLeft: "1em",
							},
						},
						h('label', {
								style: {
									color: colors.get('fontColor'),
									marginRight: "1em",
								},
								textContent: settingText.shortCutButtonUri,
							},
						),
						createSettingsElement({id: `shortCutButton${i}Uri`, type: 'textBox'}, scriptSetting).settingsElement,
					),
				);
				page.appendChild(customButtonSettingsContainer);
			}
			page.appendChild(createSettingsElement({type: 'border', length: 98, margin: "7px 0 15px 0"}).container);
			page.appendChild(createSettingsElement({type: 'text', text: settingText.sortOrder, size: "2.5em", weight: "400", position: "left", isHTML: false}).container);
			page.appendChild(createSettingsElement({type: 'button', text: settingText.sortOrderRestoreDefault, width: "fit-content", event: restoreDefaultSorting}).container);

			const buttonNames = ["homeButton", "exploreButton", "notificationsButton", "messagesButton",
				"grokButton", "listsButton", "bookmarksButton", "jobsButton", "communitiesButton", "premiumButton",
				"verifiedOrgButton", "profileButton" ,"monetizationButton", "adsButton", "createYourSpaceButton", "settingsAndPrivacy",
				"shortCutButton1", "shortCutButton2", "shortCutButton3", "shortCutButton4"];
			const buttonList = scriptSetting?.buttonSorting?.length === buttonNames.length ? scriptSetting.buttonSorting : buttonNames;

			const buttonSortingMenuContainer = h('div', {
					style: {
						display: "flex",
						flexDirection: "column",
						fontSize: "1.1em",
						borderTop: "5px solid",
						borderBottom: "5px solid",
						borderRight: "10px solid",
						borderLeft: "10px solid",
						borderColor: colors.get('borderColor'),
					},
				},
			);
			createButtonSortingMenuContainer();
			new Sortable(buttonSortingMenuContainer, {
				animation: 150,
				ghostClass: 'sortable-ghost',
				handle: '.handle',
			});
			page.appendChild(buttonSortingMenuContainer);
			page.addEventListener('click', (e)=>{
				switchDisplaying();
			});
			switchDisplaying();

			function createButtonSortingMenuContainer(reset = false){
				(reset ? buttonNames : buttonList).forEach(name => {
					const row = h('div', {
							className: "handle",
							style: {
								borderTop: "1px solid",
								borderBottom: "1px solid",
								borderColor: colors.get('borderColor'),
								display: "flex",
							},
							textContent: name.startsWith('shortCutButton') ? `${settingText.shortCutButton}${name.replace(/^shortCutButton/,'')}` : twitterTextI18n.getText(name.replace(/Button$/, '')),
							sortId: name,
							buttonSortingRow: true,
						}
					);
					buttonSortingMenuContainer.appendChild(row);
				});
				return buttonSortingMenuContainer;
			}

			function switchDisplaying(){
				buttonList.forEach(name => {
					const node = page.querySelector(`[settingID="${name}"]`);
					if(node){
						const isChecked = node.getAttribute('isselect') === "true";
						if(isChecked){
							buttonSortingMenuContainer.querySelector(`[sortId="${name}"]`).style.display = "flex";
						}else{
							buttonSortingMenuContainer.querySelector(`[sortId="${name}"]`).style.display = "none";
						}
					}else{
						buttonSortingMenuContainer.querySelector(`[sortId="${name}"]`).style.display = "flex";
					}
				});
			}
			function restoreDefaultSorting(){
				buttonSortingMenuContainer.innerHTML = "";
				createButtonSortingMenuContainer(true);
				switchDisplaying();
			}
			function save(){
				const save = [];
				buttonSortingMenuContainer.querySelectorAll('[buttonSortingRow="true"]').forEach(s=>{
					const name = s.getAttribute('sortId');
					save.push(name);
				});
				if(!scriptSettings[settingsTarget.targetName])scriptSettings[settingsTarget.targetName] = {};
				scriptSettings[settingsTarget.targetName].buttonSorting = save;
				if(sessionData.customizeMenuButton?.addAndSort)sessionData.customizeMenuButton.addAndSort();
			}
			return page;
		}

		function createAdvanceSettingsPage(){
			const settingsTarget = settingTargets.advance;
			const scriptSetting = scriptSettings.advance;
			const settingText = envText.advance.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{type: 'text', text: settingText.exportSettings, size: "2.5em", weight: "400", position: "left", isHTML: false},
				{type: 'button', text: settingText.export, width: "fit-content", event: exportSettings},
				{type: 'text', text: settingText.importSettings, size: "2.5em", weight: "400", position: "left", isHTML: false},
				{type: 'file', text: settingText.import, width: "fit-content", event: importSettings},
			];
			function exportSettings(){
				const data = {
					makeTwitterLittleUsefulSettings: scriptSettings,
				};
				const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
				const downloadAnchorNode = document.createElement('a');
				downloadAnchorNode.setAttribute("href", dataStr);
				downloadAnchorNode.setAttribute("download", "scriptSettings_makeTwitterLittleUseful.json");
				document.body.appendChild(downloadAnchorNode);
				downloadAnchorNode.click();
				downloadAnchorNode.remove();
			}
			function importSettings(event){
				const file = event.target.files[0];
				if(file){
					const reader = new FileReader();
					reader.onload = async function(e){
						try{
							const importedData = JSON.parse(e.target.result);
							if(!importedData || !importedData.makeTwitterLittleUsefulSettings){
								throw new Error(settingText.invaildSettings);
							}
							const importedSettings = importedData.makeTwitterLittleUsefulSettings;
							scriptSettings = importedSettings;
							await saveSettings();
							closeButton.click();
							_i18n();
							createSettingsPage();
						}catch(error){
							console.error(error);
							customAlert(settingText.invaildJson);
						}
					};
					reader.readAsText(file);
				}
			}
			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;
		}
		function createForDebugSettingsPage(){
			const settingsTarget = settingTargets.forDebug;
			const scriptSetting = scriptSettings[settingsTarget.targetName];
			const settingText = envText.forDebug.settings;
			const page = createSettingsPageTemplate(settingsTarget.targetName);
			const settingEntries = [
				{type: 'border', length: 100, margin: "7px 0 7px 0"},
				{type: 'text', text: settingText.showScriptSettings, size: "1em", weight: "400", position: "left", isHTML: false},
				{type: 'button', text: settingText.show, width: "fit-content", event: ()=>{console.log(scriptSettings)}},
				{type: 'text', text: settingText.showDataStore, size: "1em", weight: "400", position: "left", isHTML: false},
				{type: 'button', text: settingText.show, width: "fit-content", event: ()=>{console.log(settingText.coutionOpenDataStore);console.log(scriptDataStore)}},
				{type: 'text', text: settingText.showSessionData, size: "1em", weight: "400", position: "left", isHTML: false},
				{type: 'button', text: settingText.show, width: "fit-content", event: ()=>{console.log(sessionData)}},
				{type: 'text', text: settingText.showTweetsData, size: "1em", weight: "400", position: "left", isHTML: false},
				{type: 'button', text: settingText.show, width: "fit-content", event: ()=>{console.log(twitterApi.tweetsData)}},
				{type: 'text', text: settingText.showTweetsUserData, size: "1em", weight: "400", position: "left", isHTML: false},
				{type: 'button', text: settingText.show, width: "fit-content", event: ()=>{console.log(twitterApi.tweetsUserData)}},
				{type: 'text', text: settingText.showTweetsUserDataByUserName, size: "1em", weight: "400", position: "left", isHTML: false},
				{type: 'button', text: settingText.show, width: "fit-content", event: ()=>{console.log(twitterApi.tweetsUserDataByUserName)}},
				{type: 'text', text: settingText.showTwitterApiClassDebug, size: "1em", weight: "400", position: "left", isHTML: false},
				{type: 'button', text: settingText.show, width: "fit-content", event: ()=>{twitterApi.debug()}},
				{type: 'text', text: settingText.importPixivLinkCorrection, size: "1em", weight: "400", position: "left", isHTML: false},
				{type: 'file', text: settingText.import, width: "fit-content", event: impoertPixivLinkCorrection},
			];

			page.appendChild(createSettingsElement({type: 'text', text: settingText.allDataDisplayOnConsole, size: "2em", weight: "400", position: "left", isHTML: false},).container);
			createDebugInputMenu(settingText.showTweetData, settingText.show, async function(value){
				const tweetID = isUrl(value) ? extractTweetId(value) : value;
				if(!tweetID){
					console.error(settingText.invalidTweetId);
					return;
				}
				const tweetData = await twitterApi.getTweet(tweetID);
				console.log(tweetData);
			});

			createDebugInputMenu(settingText.showUserDataByScreenName, settingText.show, async function(value){
				const screenName = isUrl(value) ? extractUserName(value) : value;
				if(!screenName){
					console.error(settingText.invalidScreenName);
					return;
				}
				const userData = await twitterApi.getUser(screenName);
				console.log(userData);
			});

			createDebugInputMenu(settingText.showUserByUserID, settingText.show, async function(value){
				if(!value.match(/^[0-9]+$/)){
					console.error(settingText.invalidUserId);
					return;
				}
				const userData = await twitterApi.tweetsUserData[value];
				console.log(userData);
			});

			for(let i=0;i<settingEntries.length;i++){
				page.appendChild(createSettingsElement(settingEntries[i], scriptSetting).container);
			}
			return page;

			function createDebugInputMenu(title, buttonName, eventFunc = function(value){}){
				page.appendChild(createSettingsElement({type: 'text', text: title, size: "1.5em", weight: "400", position: "left", isHTML: false},).container);
				const showTweetDataContainer = createSettingsElement({type: 'container'});
				const showTweetDataTextBox = document.createElement('input');
				showTweetDataTextBox.type = "text";
				const showTweetDataButton = document.createElement('button');
				showTweetDataButton.addEventListener('click', ()=>{
					eventFunc(showTweetDataTextBox.value);
				});
				showTweetDataButton.textContent = buttonName;
				showTweetDataContainer.appendChild(showTweetDataTextBox);
				showTweetDataContainer.appendChild(showTweetDataButton);
				page.appendChild(showTweetDataContainer);
			}
			async function impoertPixivLinkCorrection(event){
				const file = await readFile(event, 'text');
				const data = JSON.parse(file);
				if(data){
					if(data["データチェック"] === "乱反射する眼差し"){
						const now = new Date();
						const YY = now.getFullYear().toString().slice(-4);
						const MM = String(now.getMonth() + 1).padStart(2, '0');
						const DD = String(now.getDate()).padStart(2, '0');
						if(!scriptDataStore.makeTwitterLittleUseful)scriptDataStore.makeTwitterLittleUseful = {};
						if(!scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection)scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection = {};
						scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection.dataBase = data;
						scriptDataStore.makeTwitterLittleUseful.pixivLinkCollection.dataBaseVersion = `${YY}${MM}${DD}`;
						await saveScriptDataStore();
						customAlert("imported");
					}else{
						customAlert("invalid data");
					}
				}
			}
		}
		function createSettingsPageTemplate(name){
			const settingsPageContainer = document.createElement('div');
			settingsPageContainer.setAttribute('mtlu-id', 'settingsPageContainer');
			settingsPageContainer.setAttribute('settingsPageTarget', name);
			settingsPageContainer.style.width = "100%";
			settingsPageContainer.style.height = "100%";
			settingsPageContainer.style.overflowY = "auto";
			settingsPageContainer.style.zIndex = "-1";
			settingsPageContainer.style.display = "none";
			settingsPageContainer.style.flexDirection = "column"
			settingsPageContainer.style.paddingBottom = "10em";
			return settingsPageContainer;
		}
		function createSettingsElement(setting, storedValue) {
			let returnElement;
			const settingsElementWrapper = document.createElement('div');
			settingsElementWrapper.setAttribute('mtlu-id', 'settingsElementWrapper');
			settingsElementWrapper.style.width = "98%";
			settingsElementWrapper.style.height = "fit-content";
			settingsElementWrapper.style.display = "flex";
			settingsElementWrapper.style.overflowX = "hidden";
			settingsElementWrapper.style.overflowWrap = "break-word";
			settingsElementWrapper.style.margin = "0 0 0 2%";
			settingsElementWrapper.style.flexShrink = "0";

			const categoryPath = setting.category ? setting.category.split('.') : [];
			let currentValue = storedValue ? storedValue[setting.id] ?? setting.defaultValue : setting.defaultValue ?? undefined;
			// 深いネストがある場合に対応
			if(categoryPath.length && storedValue){
				currentValue = getValueFromObjectByPath(storedValue,`${setting.category}.${setting.id}`);
			}

			// タイプに応じた要素の生成
			switch(setting.type){
				case 'radioButton':
					returnElement = radioButton();
					break;
				case 'textBox':
					returnElement = textBox();
					break;
				case 'toggleSwitch':
					returnElement = toggleSwitch();
					break;
				case 'dropdown':
					returnElement = dropdown();
					break;
				case 'border':
					returnElement = border();
					break;
				case 'text':
					returnElement = text();
					break;
				case 'container':
					return settingsElementWrapper;
					break;
				case 'button':
					returnElement = button();
					break;
				case 'file':
					returnElement = file();
					break;
				default:
					console.error('Unknown setting');
					console.error({settingOBJ: setting, storedValues: storedValue});
					return;
			}
			settingsElementWrapper.appendChild(returnElement);

			return { container: settingsElementWrapper, settingsElement: returnElement };

			function file(){
				const {position = 'center', width = "1.5em", height = "1.5em", text = "", event = ()=>{}} = setting;
				const input = document.createElement('input');
				input.style.display = "none";
				input.type = "file";

				const button = document.createElement('button');
				button.style.width = width;
				button.style.height = height;
				button.textContent = text;
				button.addEventListener('click', () => {
				  input.click();
				});
				input.addEventListener('change', event);

				const container = document.createElement('div');
				container.style.textAlign = position;
				container.appendChild(button);
				container.appendChild(input);

				return container;
			}

			function button(){
				const {position = 'center', width = "1.5em", height = "1.5em", text = "", event = ()=>{}} = setting;
				const button = document.createElement('button');
				button.style.width = width;
				button.style.height = height;
				//button.style.fontSize = height;
				button.textContent = text;
				button.addEventListener('click', event);
				settingsElementWrapper.style.overflowY = "hidden";
				return button;
			}
			function text(){
				// デフォルト値を設定
				const {size = "1em", position = 'center', weight = 400, isHTML = false} = setting;

				// 新しい要素を作成（span要素）
				const element = document.createElement('span');

				// カスタム属性を設定
				element.setAttribute('needSave', "false");
				element.setAttribute('category', setting.category || '');
				element.setAttribute('type', setting.type || '');

				// テキストまたはHTMLの内容を設定
				if(isHTML){
					// HTMLとして扱う場合
					element.innerHTML = setting.text;
				}else{
					// プレーンテキストとして扱う場合
					element.textContent = setting.text;
				}
				if(position === 'center'){
					settingsElementWrapper.style.margin = "0";
					element.style.width = "100%";
				}
				// スタイルを設定
				element.style.fontSize = size;
				element.style.textAlign = position;
				element.style.fontWeight = weight;

				return element;
			}

			function border(){
				const {length = 95, position = 'center', margin = "0", thickness = 1} = setting;
				settingsElementWrapper.style.margin = "0";
				settingsElementWrapper.style.width = "100%";
				// ボーダーのスタイルを持つ要素を作成
				const borderElement = document.createElement('div');
				borderElement.setAttribute('needSave', "false");
				borderElement.setAttribute('type', setting.type);

				// ボーダーのスタイルを設定
				borderElement.style.width = length + '%'; // ボーダーの長さを設定
				borderElement.style.borderBottom = `${thickness}px solid ${colors.get('borderColor')}`; // 下側のボーダーだけ表示
				borderElement.style.margin = margin;

				// 親要素に対してボーダーを中央揃え（flexboxを使用）
				settingsElementWrapper.style.display = 'flex';

				if(position === 'left'){
					settingsElementWrapper.style.justifyContent = 'flex-start'; // 左寄せ
				}else if(position === 'right'){
					settingsElementWrapper.style.justifyContent = 'flex-end'; // 右寄せ
				}else if(position === 'center'){
					settingsElementWrapper.style.justifyContent = 'center'; // 中央揃え
				}

				return borderElement;
			}
			function radioButton(){
				const element = document.createElement('div');
				element.setAttribute('needSave', "true");
				element.setAttribute('category', `${setting.category}`);
				element.setAttribute('type', setting.type);
				element.setAttribute('settingID', setting.id);

				setting.option.forEach((opt, index) => {
					const label = document.createElement('label');
					const radioButton = document.createElement('input');
					radioButton.style.margin = "0 0 0 1em";
					radioButton.type = 'radio';
					radioButton.name = setting.id; // 同じグループにするためにname属性を設定
					radioButton.value = opt.value;
					if(currentValue === opt.value){
						radioButton.checked = true;
					}
					label.appendChild(radioButton);
					label.appendChild(document.createTextNode(opt.displayName));
					element.appendChild(label);
				});
				return element;
			}

			function textBox(){
				const element = document.createElement('input');
				element.type = 'text';
				element.setAttribute('needSave', "true");
				element.setAttribute('category', `${setting.category}`);
				element.setAttribute('type', setting.type);
				element.setAttribute('settingID', setting.id);
				element.value = currentValue || '';
				return element;
			}

			function toggleSwitch(){
				// トグルスイッチ全体を包むdivを作成
				const displaySwitchPosition = setting.displaySwitchPosition || "left";
				const container = document.createElement('div');
				container.setAttribute('needSave', "true");
				container.setAttribute('category', `${setting.category}`);
				container.setAttribute('type', setting.type);
				container.setAttribute('settingID', setting.id);
				container.setAttribute('isSelect', currentValue ? currentValue : 'false');
				container.style.display = 'flex';
				container.style.justifyContent = displaySwitchPosition === 'right' ? 'space-between' : 'flex-start';
				container.style.width = '100%'; // コンテナの全体幅
				container.style.margin = '10px 0';
				container.style.alignItems = 'center';

				// ラベルを作成（名前を表示）
				const label = document.createElement('span');
				label.textContent = setting.name;
				label.style.flex = '1'; // ラベルは自動で幅を調整
				//label.style.textAlign = displaySwitchPosition === 'right' ? 'left' : 'right';
				label.style.fontSize = "1.5em";
				label.style.margin = "0 0 0 5%";
				label.style.userSelect = 'none';

				// トグルスイッチ部分の要素を作成
				const toggleSwitch = document.createElement('div');
				toggleSwitch.style.position = 'relative';
				toggleSwitch.style.width = '50px';
				toggleSwitch.style.height = '20px';
				toggleSwitch.style.backgroundColor = currentValue ? '#4CAF50' : '#ccc';
				toggleSwitch.style.borderRadius = '30px';
				toggleSwitch.style.cursor = 'pointer';
				toggleSwitch.style.transition = 'background-color 0.3s';

				// 丸いスライダー部分を作成
				const toggleSlider = document.createElement('div');
				toggleSlider.style.position = 'absolute';
				toggleSlider.style.top = '2px';
				toggleSlider.style.left = currentValue ? '32px' : '2px';
				toggleSlider.style.width = '16px';
				toggleSlider.style.height = '16px';
				toggleSlider.style.backgroundColor = 'white';
				toggleSlider.style.borderRadius = '50%';
				toggleSlider.style.transition = 'transform 0.3s';

				// スイッチの状態を保持する変数
				let isChecked = currentValue;

				// トグルスイッチのクリックイベントを追加
				toggleSwitch.addEventListener('click', function (){
					isChecked = !isChecked;  // 状態を切り替える
					if(isChecked){
						toggleSwitch.style.backgroundColor = '#4CAF50';  // ON時の色
						toggleSlider.style.left = '32px';  // スライダーを右に動かす
						container.setAttribute('isSelect', 'true');
					}else{
						toggleSwitch.style.backgroundColor = '#ccc';  // OFF時の色
						toggleSlider.style.left = '2px';  // スライダーを左に戻す
						container.setAttribute('isSelect', 'false');
					}
				});

				// トグルスイッチにスライダーを追加
				toggleSwitch.appendChild(toggleSlider);

				// 要素の配置
				if(displaySwitchPosition === 'right'){
					toggleSwitch.style.margin = "0 2% 0 0";
					container.appendChild(label); // ラベルが左
					container.appendChild(toggleSwitch); // スイッチが右
				}else{
					container.appendChild(toggleSwitch); // スイッチが左
					container.appendChild(label); // ラベルが右
				}

				// 生成したコンテナをページに追加
				return container;
			}

			function dropdown(){
				const element = document.createElement('select');
				element.setAttribute('needSave', "true");
				element.setAttribute('category', `${setting.category}`);
				element.setAttribute('type', setting.type);
				element.setAttribute('settingID', setting.id);
				setting.option.forEach((opt, index) => {
					const option = document.createElement('option');
					option.value = opt.value;
					option.text = opt.displayName;
					if(currentValue === opt.value){
						option.selected = true;
					}
					element.appendChild(option);
				});
				return element;
			}
		}
		async function retrieveSettings(){
			for(let key of Object.keys(settingTargets)){
				if(settingTargets[key].needSave === false)continue;
				const save = {};
				const node = settingTargets[key].settingsNode;
				node.querySelectorAll('[needsave="true"]').forEach(s=>{
					const id = s.getAttribute("settingid");
					const category = s.getAttribute("category");
					const type = s.getAttribute("type");
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
							value = (s.getAttribute('isselect') == 'true') ? true : false;
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
			displayToast("👌",1000);
		}

		function generatePages(){
			for(let key of Object.keys(settingTargets)){
				//if(!(settingTargets[key].forPC ? isPC : true && settingTargets[key].forMobile ? isMobile : true))return;
				const node = settingTargets[key].pageGenerateFunction();
				settingContainerWrapper.appendChild(node);
				settingTargets[key].settingsNode = node;
				const padding = h('div', {style: {height: "100px", flexShrink: "0"}});
				node.appendChild(padding);
				pages.nodes.push(node);
			}
			pages.selecing.name = "makeTwitterLittleUseful";
			pages.selecing.node = settingTargets.makeTwitterLittleUseful.settingsNode;
		}
		generatePages();
	}
	GM_registerMenuCommand('script settings', createSettingsPage);

	// ###クラス###
	// 今までクラスとかあんまり使ったことなかったから使い方間違ってたら教えてちょ
	class Colors {
		constructor(){
			this.colors = {
				// [white, darkBlue, black]
				"fontColor":				['rgb(15, 20, 25)', 'rgb(247, 249, 249)', 'rgb(231, 233, 234)'], // ツイートの文字色など
				"fontColorDark":			['rgb(83, 100, 113)', 'rgb(139, 152, 165)', 'rgb(113, 118, 123)'], // いいねの数など
				"backgroundColor":			['rgba(255, 255, 255, 1.00)', 'rgb(21, 32, 43)', 'rgba(0, 0, 0, 1.00)'],
				"borderColor":				['rgb(239, 243, 244)', 'rgb(56, 68, 77)', 'rgb(47, 51, 54)'], // ツイートのボーダー色など
				"twitterBlue":				['rgb(29, 155, 240)', 'rgb(29, 155, 240)', 'rgb(29, 155, 240)'],
				"menuHoverEffect":			['rgba(15, 20, 25, 0.1)', 'rgba(247, 249, 249, 0.1)', 'rgba(231, 233, 234, 0.1)'], // 一番左のメニュー等のホバーエフェクト
				"menuHoverEffectLight":		['rgb(247, 249, 249)', 'rgb(30, 39, 50)', 'rgb(22, 24, 28)'], // 設定画面のホバーエフェクト
				"retweeted":				['rgb(0, 186, 124)', 'rgb(0, 186, 124)', 'rgb(0, 186, 124)'],
				"favorited":				['rgb(249, 24, 128)', 'rgb(249, 24, 128)', 'rgb(249, 24, 128)'],
				"dropdownBackgroundColor": 	['rgb(255, 255, 255)', 'rgb(59, 59, 59)', 'rgb(59, 59, 59)'],
				"dropdownFontColor":		['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
				"dropdownBorderColor":		['rgb(118, 118, 118)', 'rgb(133, 133, 133)', 'rgb(133, 133, 133)'],
				"buttonBackgroundColor":	['rgb(239, 239, 239)', 'rgb(107, 107, 107)', 'rgb(107, 107, 107)'],
				"buttonFontColor":			['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 255, 255)'],
				"buttonBorderColor":		['rgb(239, 239, 239)', 'rgb(107, 107, 107)', 'rgb(107, 107, 107)'],
				"conversationLineColor":	['rgb(207, 217, 222)', 'rgb(66, 83, 100)', 'rgb(51, 54, 57)'],
			};
		}

		/**
		* 指定されたカラーパレットから現在のテーマの色を返します
		* @param {string} colorName - 色名 (例: "fontColor")
		* @param {number} [darkMode] - テーマ番号 (0=デフォルト, 1=ダークブルー, 2=ブラック) (省略時は現在のテーマ)
		* @returns {string} - 色のRGB文字列 (例: "rgb(255,255,255)")
		*/
		get(colorName, darkMode = sessionData.themeMode?.themeNum ?? getCookie('night_mode') ?? 0){
			return this.colors[colorName][darkMode];
		}

		/**
		* 指定した色にアルファ値（透過）を加えたRGBA形式を返します
		* @param {string} colorName - 色名 (例: "borderColor")
		* @param {number} alpha - 透過度 (0.0〜1.0)
		* @param {number} [darkMode] - テーマ番号（0=デフォルト, 1=ダークブルー, 2=ブラック) (省略時は現在のテーマ)
		* @returns {string} - RGBA文字列 (例: "rgba(255,255,255,1.0)")
		*/
		getWithAlpha(colorName, alpha, darkMode = sessionData.themeMode?.themeNum ?? getCookie('night_mode') ?? 0){
			return `rgba(${this.colors[colorName][darkMode].match(/\d+/g).join(", ")}, ${alpha})`;
		}
	}
	const colors = new Colors();

	class DiscordEmbedMaker {
		// 参考: https://github.com/discordjs/discord.js/tree/main/packages/builders/src/messages/embed
		// Embed.ts
		data;
		get fields(){
			return this.data.fields;
		}
		constructor(data = {}){
			this.data = {
				...structuredClone(data),
				author: data.author && new DiscordEmbedMaker.EmbedAuthorBuilder(data.author),
				fields: data.fields?.map((field) => new DiscordEmbedMaker.EmbedFieldBuilder(field)) ?? [],
				footer: data.footer && new DiscordEmbedMaker.EmbedFooterBuilder(data.footer)
			};
		}

		addFields(...fields){
			const normalizedFields = DiscordEmbedMaker.Functions.normalizeArray(fields);
			const resolved = normalizedFields.map((field) => DiscordEmbedMaker.Functions.resolveBuilder(field, DiscordEmbedMaker.EmbedFieldBuilder));
			this.data.fields.push(...resolved);
			return this;
		}
		spliceFields(index, deleteCount, ...fields){
			const resolved = fields.map((field) => DiscordEmbedMaker.Functions.resolveBuilder(field, DiscordEmbedMaker.EmbedFieldBuilder));
			this.data.fields.splice(index, deleteCount, ...resolved);
			return this;
		}
		setFields(...fields){
			this.spliceFields(0, this.data.fields.length, ...DiscordEmbedMaker.Functions.normalizeArray(fields));
			return this;
		}
		setAuthor(options){
			this.data.author = DiscordEmbedMaker.Functions.resolveBuilder(options, DiscordEmbedMaker.EmbedAuthorBuilder);
			return this;
		}
		updateAuthor(updater){
			updater(this.data.author ??= new DiscordEmbedMaker.EmbedAuthorBuilder());
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
			this.data.footer = DiscordEmbedMaker.Functions.resolveBuilder(options, DiscordEmbedMaker.EmbedFooterBuilder);
			return this;
		}
		updateFooter(updater){
			updater(this.data.footer ??= new DiscordEmbedMaker.EmbedFooterBuilder());
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
			DiscordEmbedMaker.Functions.validate(DiscordEmbedMaker.Functions.embedPredicate, data, validationOverride);
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
				DiscordEmbedMaker.Functions.validate(DiscordEmbedMaker.Functions.embedAuthorPredicate, clone, validationOverride);
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
				DiscordEmbedMaker.Functions.validate(DiscordEmbedMaker.Functions.embedFieldPredicate, clone, validationOverride);
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
				DiscordEmbedMaker.Functions.validate(DiscordEmbedMaker.Functions.embedFooterPredicate, clone, validationOverride);
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
				if(DiscordEmbedMaker.Functions.isBuilder(builder, Constructor)){
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
				return DiscordEmbedMaker.Functions.validateString(value, 1, 256);
			}

			// これをやめてimageURLPredicateを使う
			/*
			static iconURLPredicate(value){
				return DiscordEmbedMaker.Functions.validateURL(value, ["http:", "https:", "attachment:"]);
			}
			*/
			static imageURLPredicate(value){
				return DiscordEmbedMaker.Functions.validateURL(value, ["http:", "https:", "attachment:"]);
			}

			static URLPredicate(value){
				return DiscordEmbedMaker.Functions.validateURL(value, ["http:", "https:"]);
			}

			static embedFieldPredicate(obj){
				return DiscordEmbedMaker.Functions.validateObject(obj, {
					name: DiscordEmbedMaker.Functions.namePredicate,
					value: (value) => DiscordEmbedMaker.Functions.validateString(value, 1, 1024),
					inline: (value) => {
						if(value !== undefined && typeof value !== 'boolean'){
							return { success: false, error: `Inline must be a boolean` };
						}
						return { success: true, data: value };
					}
				});
			}

			static embedAuthorPredicate(obj){
				return DiscordEmbedMaker.Functions.validateObject(obj, {
					name: DiscordEmbedMaker.Functions.namePredicate,
					icon_url: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.imageURLPredicate(value);
						return { success: true, data: value };
					},
					url: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.URLPredicate(value);
						return { success: true, data: value };
					}
				});
			}

			static embedFooterPredicate(obj){
				return DiscordEmbedMaker.Functions.validateObject(obj, {
					text: (value) => DiscordEmbedMaker.Functions.validateString(value, 1, 2048),
					icon_url: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.imageURLPredicate(value);
						return { success: true, data: value };
					}
				});
			}

			static embedPredicate(obj){
				const result = DiscordEmbedMaker.Functions.validateObject(obj, {
					title: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.namePredicate(value);
						return { success: true, data: value };
					},
					// 元は4096だったが、実際にはもう少し長くても問題なさそうだったので数値を増やした
					description: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.validateString(value, 1, 6200);
						return { success: true, data: value };
					},
					url: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.URLPredicate(value);
						return { success: true, data: value };
					},
					timestamp: (value) => {
						if(value !== undefined && typeof value !== 'string'){
							return { success: false, error: `Timestamp must be a string` };
						}
						return { success: true, data: value };
					},
					color: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.validateNumber(value, 0, 16777215);
						return { success: true, data: value };
					},
					footer: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.embedFooterPredicate(value);
						return { success: true, data: value };
					},
					image: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.validateObject(value, { url: DiscordEmbedMaker.Functions.imageURLPredicate });
						return { success: true, data: value };
					},
					thumbnail: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.validateObject(value, { url: DiscordEmbedMaker.Functions.imageURLPredicate });
						return { success: true, data: value };
					},
					author: (value) => {
						if(value !== undefined)return DiscordEmbedMaker.Functions.embedAuthorPredicate(value);
						return { success: true, data: value };
					},
					fields: (value) => {
						if(value !== undefined){
							if(!Array.isArray(value) || value.length > 25){
								return { success: false, error: `Fields must be an array with a maximum length of 25` };
							}
							for(let field of value){
								const result = DiscordEmbedMaker.Functions.embedFieldPredicate(field);
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
				if(DiscordEmbedMaker.Functions.embedLength(obj) > 6400){
					return { success: false, error: `Embeds must not exceed 6000 characters in total.` };
				}

				return { success: true, data: obj };
			}
		}
	}

	// 便利なものを作ろうとしてクソを作ってしまった……助けてくれ…………
	// 負債すぎる……
	class TweetNodeBuilder {
		nodes;
		data;
		#colors = new Colors();
		#svgPaths = svgIconPaths;
		#textDatas = {};
		#textData;
		#isBuilt = false;
		get data(){
			return this.data;
		}
		constructor({screenName = null, tweetId = null, createdAt = null, avatar = null, author = null, tweetText = null, media = null, fotter = null}){
			if(!(screenName && tweetId)){
				console.error({error: "screenName または tweetId が指定されていません。これらは最初に必ず引数に含めてください。", screenName: screenName, tweetId: tweetId});
				return null;
			}
			this.data = {
				reply: {count: null, textElement: null},
				retweet: {count: null, textElement: null},
				favorite: {count: null, textElement: null},
				time: {createdAt: createdAt, element: null},
				tweetId : tweetId,
				screenName: screenName,
			}
			this.nodes = {
				rootContainer: null,
				article: null,
				header: null,
				main: null,
				avatar: null,
				contents: null,
				author: null,
				tweetText: null,
				media: null,
				footer: null,
				communitiyNote: null,
				/*
				quotedTweet: {
					container,
					article,
					avatar,
					author,
					tweetText,
					media,
				},
				*/
			}
			this.#createRootContainer();
			this.#createArticle();
			this.#createMainContainer();
			this.#createContentsContainer();

			this.#textDatas.ja = {
				"second": "秒",
				"minute": "分",
				"hour": "時間",
				"day": "日",
				"week": "週",
				"month": "月",
				"year": "年",
				"before": "前",
				"units": "万",
				"roundingScale": 10000,
				"decimalPlaces": 2,
			};
			this.#textDatas.en = {
				"second": "s",
				"minute": "m",
				"hour": "h",
				"day": "d",
				"week": "w",
				"month": "m",
				"year": "y",
				"before": "ago",
				"units": "k",
				"roundingScale": 1000,
				"decimalPlaces": 1,
			};
			this.#textData = this.#textDatas[scriptSettings?.makeTwitterLittleUseful?.language] || this.#textDatas.en;
			this.#appendCSS();
		}
		build(){
			if(!((this.nodes.tweetText || this.nodes.media) && this.nodes.author && this.nodes.footer)){
				console.error({error: "ツイートを構成する要素が足りていないようです。\n", nodes: this.nodes});
				return null;
			};
			if(this.#isBuilt){
				console.error("ビルドメソッドは1度だけしか使用できません。");
				return null;
			}
			this.#isBuilt = true;
			// rootContainer
			//   article
			//     header
			//     main
			//       avatar
			//       contents
			//         author
			//         tweetText
			//         media
			//	       footer

			const fragment = document.createDocumentFragment();
			this.nodes.contents.appendChild(this.nodes.author);
			if(this.nodes.tweetText)this.nodes.contents.appendChild(this.nodes.tweetText);
			if(this.nodes.media)this.nodes.contents.appendChild(this.nodes.media);
			this.nodes.contents.appendChild(this.nodes.footer);
			this.nodes.main.appendChild(this.nodes.avatar);
			this.nodes.main.appendChild(this.nodes.contents);
			if(!this.nodes.header)this.setHeader();
			this.nodes.articleBottom.appendChild(this.nodes.header);
			this.nodes.rootContainerBottomNode.appendChild(this.nodes.article);
			this.nodes.articleBottom.appendChild(this.nodes.main);
			fragment.appendChild(this.nodes.rootContainer);
			return fragment;
		}
		// functions
		#createRootContainer(){
			// rootContainer
			//   container2
			//     container3
			//   saparator
			const rootContainer = document.createElement('div');
			rootContainer.className = this.#classNameProcessor('css-175oi2r');
			rootContainer.style.width = '100%';
			rootContainer.setAttribute('data-testid', "cellInnerDiv");
			rootContainer.setAttribute('tnb-id', "cellInnerDiv");
			const container2 = document.createElement('div');
			container2.className = this.#classNameProcessor('css-175oi2r r-1adg3ll r-1ny4l3l');
			const saparator = document.createElement('div');
			saparator.className = this.#classNameProcessor('css-175oi2r r-109y4c4 r-13qz1uu');
			Object.assign(saparator.style, {
				backgroundColor: this.#colors.get('borderColor'),
			});
			container2.appendChild(saparator);
			const container3 = document.createElement('div');
			container3.className = this.#classNameProcessor('css-175oi2r');
			container2.appendChild(container3);
			rootContainer.appendChild(container2);
			this.nodes.rootContainerBottomNode = container3;
			this.nodes.rootContainer = rootContainer;
			return rootContainer;
		}
		#createArticle(){
			// article
			//   container2
			//     container3
			const article = document.createElement('article');
			article.setAttribute('data-testid', "tweet");
			article.setAttribute('tnb-id', "tweet");
			article.className = this.#classNameProcessor('css-175oi2r r-18u37iz r-1udh08x r-1c4vpko r-1c7gwzm r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21');
			const container2 = document.createElement('div');
			container2.className = this.#classNameProcessor('css-175oi2r r-eqz5dr r-16y2uox r-1wbh5a2');
			const container3 = document.createElement('div');
			container3.className = this.#classNameProcessor('css-175oi2r r-16y2uox r-1wbh5a2 r-1ny4l3l');
			container2.appendChild(container3);
			article.appendChild(container2);

			article.addEventListener('mouseover', (event)=>{
				article.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
			});
			function resetBackgroundColor(event){
				article.style.backgroundColor = '';
			}
			article.addEventListener('mouseout', resetBackgroundColor);
			article.addEventListener('touchend', resetBackgroundColor);
			article.addEventListener('touchcancel', resetBackgroundColor);
			this.nodes.articleBottom = container3;
			this.nodes.article = article;
			return article;
		}
		#createMainContainer(){
			const container = document.createElement('div');
			container.setAttribute('tnb-id', "mainContainer");
			container.className = this.#classNameProcessor('css-175oi2r r-18u37iz');
			this.nodes.main = container;
			return container;
		}
		#createContentsContainer(){
			const container = document.createElement('div');
			container.setAttribute('tnb-id', "contentsContainer");
			container.className = this.#classNameProcessor('css-175oi2r r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu');
			this.nodes.contents = container;
			return container;
		}
		setHeader({text = null, icon = null} = {}){
			// header
			//   container2
			//     container3
			//       additionalContainer1
			//         additionalContainer2
			//           svgContainer
			//             svgElement
			//           textContainer1
			//             textContainer2
			//               textContainer3
			//                 textElement


			if((text || icon)? !(text && icon) : false){
				console.error("[setHeader] ヘッダーをセットできませんでした。 何かヘッダーに表示する場合、textとiconはどちらも必要です。");
				return this;
			}
			if(icon ? (Object.keys(this.#svgPaths).indexOf(icon) == -1) : false){
				console.error(`[setHeader] ヘッダーをセットできませんでした。 iconは「${Object.keys(this.#svgPaths).join(", ")}」の中から選ぶ必要があります。`);
				return this;
			}
			const header = document.createElement('div');
			header.setAttribute('tnb-id', "header");
			header.className = this.#classNameProcessor('css-175oi2r');
			const container2 = document.createElement('div');
			container2.className = this.#classNameProcessor('css-175oi2r r-18u37iz');
			const container3 = document.createElement('div');
			container3.className = this.#classNameProcessor('css-175oi2r r-1iusvr4 r-16y2uox r-ttdzmv');

			if(text && icon){
				const additionalContainer1 = document.createElement('div');
				additionalContainer1.setAttribute('tnb-id', "additional-header");
				additionalContainer1.className = this.#classNameProcessor('css-175oi2r r-15zivkp r-q3we1');
				const additionalContainer2 = document.createElement('div');
				additionalContainer2.className = this.#classNameProcessor('css-175oi2r r-18u37iz');

				const svgContainer = document.createElement('div');
				svgContainer.className = this.#classNameProcessor('css-175oi2r r-18kxxzh r-1wron08 r-onrtq4 r-obd0qt r-1777fci');

				const svgElement = createSvgElement(icon).svg;
				svgElement.setAttribute('aria-hidden', "true");
				svgElement.className = this.#classNameProcessor('r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-10ptun7 r-1janqcz');

				svgContainer.appendChild(svgElement);
				additionalContainer2.append(svgContainer);

				const textContainer1 = document.createElement('div');
				textContainer1.className = this.#classNameProcessor('css-175oi2r r-1iusvr4 r-16y2uox');
				textContainer1.style.textOverflow = 'ellipsis';
				const textContainer2 = document.createElement('div');
				textContainer2.className = this.#classNameProcessor('css-175oi2r r-18u37iz');
				const textContainer3 = document.createElement('div');
				textContainer3.className = this.#classNameProcessor('css-175oi2r r-1habvwh r-1wbh5a2 r-1777fci');
				const textElement = document.createElement('div');
				textElement.setAttribute('data-testid', "socialContext");
				textElement.setAttribute('dir', "ltr");
				textElement.setAttribute('tnb-id', "socialContext");
				textElement.className = this.#classNameProcessor('css-146c3p1 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-1udbk01 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-n6v787 r-1cwl3u0 r-b88u0q');
				textElement.textContent = text;
				textContainer3.appendChild(textElement);
				textContainer2.appendChild(textContainer3);
				textContainer1.appendChild(textContainer2);
				additionalContainer2.append(textContainer1);
				container3.appendChild(additionalContainer2);
			}

			container2.appendChild(container3);
			header.appendChild(container2);
			this.nodes.header = header;
			return this;
		}
		setAvatar({iconURL = "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png", shape = 'circle', screenName = this.data.screenName} = {}){
			// avatorRootContainer
			//   container2
			//     container3
			//       container4
			//         container5
			//           container6
			//           container7
			//             container8
			//               avatarLink
			//                 container9
			//                   container10
			//                 container11
			//                   container12
			//                 imageContainer1
			//                   imageContainer2
			//                     imageContainer3
			//                   imageContainer4
			//                     imageContainer5
			//                     imageDisplayElement
			//                       imageElement
			//                 container13
			//                   container14


			if(!screenName){
				console.error({error: "[setAvatar] screenNameは必須です。", inputValue: screenName});
				return null;
			}else{
				this.data.screenName = screenName;
			}
			const shapeData = ['circle', 'square'];
			shape = shape.toLowerCase();
			if(shapeData.indexOf(shape) == -1){
				console.error({error: `[setAvatar]shapeは「${shapeData.join(", ")}」である必要があります`, inputValue: shape});
				return null;
			}
			const avatarRootContainer = document.createElement('div');
			avatarRootContainer.setAttribute('tnb-id', "avatarRootContainer");
			avatarRootContainer.className = this.#classNameProcessor("css-175oi2r r-18kxxzh r-1wron08 r-onrtq4 r-1awozwy");
			const container2 = document.createElement("div");
			container2.setAttribute('data-testid', "Tweet-User-Avatar");
			container2.setAttribute('tnb-id', "Tweet-User-Avatar");
			container2.className = this.#classNameProcessor("css-175oi2r");
			const container3 = document.createElement("div");
			container3.className = this.#classNameProcessor("css-175oi2r r-18kxxzh r-1wbh5a2 r-13qz1uu");
			const container4 = document.createElement("div");
			container4.className = this.#classNameProcessor("css-175oi2r r-1wbh5a2 r-dnmrzs");
			const container5 = document.createElement("div");
			container5.setAttribute('data-testid', `UserAvatar-Container-${screenName}`);
			container5.className = this.#classNameProcessor("css-175oi2r r-bztko3 r-1adg3ll");
			Object.assign(container5.style, {
				width: "40px",
				height: "40px",
			});
			const container6 = document.createElement("div");
			container6.className = this.#classNameProcessor("r-1adg3ll r-13qz1uu");
			container6.style.paddingBottom = "100%";
			container6.style.width = "100%";
			container6.style.display = "block";
			container5.appendChild(container6);
			const container7 = document.createElement("div");
			container7.className = this.#classNameProcessor("r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu");
			const container8 = document.createElement("div");
			container8.className = this.#classNameProcessor((shape == 'circle' ?
				"css-175oi2r r-sdzlij r-1udh08x r-5f1w11 r-u8s1d r-8jfcpp"
				:
				"css-175oi2r r-5f1w11 r-u8s1d r-8jfcpp"
			));
			Object.assign(container8.style, {
				width: "calc(100% + 4px)",
				height: "calc(100% + 4px)",
				...(shape == 'circle' ? {

				} : {
					clipPath: 'url("#shape-square")',
				}),
			});
			const avatarLink = document.createElement("a");
			avatarLink.setAttribute('aria-hidden', "true");
			avatarLink.setAttribute('role', "link");
			avatarLink.setAttribute('tabindex', "-1");
			avatarLink.href = `/${screenName}`;
			avatarLink.setAttribute('rel', "noopener nofollow");
			avatarLink.setAttribute('target', "_blank");
			avatarLink.className = this.#classNameProcessor("css-175oi2r r-1pi2tsx r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l r-1loqt21");
			Object.assign(avatarLink.style, {
				backgroundColor: "rgba(0, 0, 0, 0)",
			});

			const container9 = document.createElement("div");
			container9.className = this.#classNameProcessor((shape == 'circle' ?
				"css-175oi2r r-sdzlij r-1udh08x r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd"
				:
				"css-175oi2r r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd"
			));
			Object.assign(container9.style, {
				width: "calc(100% + 4px)",
				height: "calc(100% + 4px)",
				...(shape == 'circle' ? {

				} : {
					clipPath: 'url("#shape-square-rx-16")',
				})
			});
			const container10 = document.createElement("div");
			container10.className = this.#classNameProcessor("css-175oi2r r-1pi2tsx r-13qz1uu");
			Object.assign(container10.style, {
				backgroundColor: "rgba(0, 0, 0, 0)",
			});
			container9.appendChild(container10);
			avatarLink.appendChild(container9);
			//
			const container11 = document.createElement("div");
			container11.className = this.#classNameProcessor((shape == 'circle' ?
				"css-175oi2r r-sdzlij r-1udh08x r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd"
				:
				"css-175oi2r r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd"
			));
			Object.assign(container11.style, {
				width: "calc(100% + 4px)",
				height: "calc(100% + 4px)",
				...(shape == 'circle' ? {

				} : {
					clipPath: 'url("#shape-square-rx-16")',
				})
			});
			const container12 = document.createElement("div");
			container10.className = this.#classNameProcessor("css-175oi2r r-1pi2tsx r-13qz1uu r-yfoy6g");
			Object.assign(container10.style, {
				backgroundColor: "rgba(0, 0, 0, 0)",
			});
			container11.appendChild(container12);
			avatarLink.appendChild(container11);
			//
			const imageContainer1 = document.createElement("div");
			imageContainer1.className = this.#classNameProcessor((shape == 'circle' ?
				"css-175oi2r r-sdzlij r-1udh08x r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd"
				:
				"css-175oi2r r-633pao r-45ll9u r-u8s1d r-1v2oles r-176fswd"
			));
			Object.assign(imageContainer1.style, {
				width: "calc(100% + 4px)",
				height: "calc(100% + 4px)",
				...(shape == 'circle' ? {

				} : {
					clipPath: 'url("#shape-square-rx-16")',
				})
			});
			const imageContainer2 = document.createElement("div");
			imageContainer2.className = this.#classNameProcessor("css-175oi2r r-1adg3ll r-1udh08x");
			const imageContainer3 = document.createElement("div");
			imageContainer3.className = this.#classNameProcessor("r-1adg3ll r-13qz1uu");
			Object.assign(imageContainer3.style, {
				paddingBottom: "100%",
			});
			imageContainer2.appendChild(imageContainer3);
			const imageContainer4 = document.createElement("div");
			imageContainer4.className = this.#classNameProcessor("r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu");
			const imageContainer5 = document.createElement("div");
			imageContainer5.className = this.#classNameProcessor("css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af");
			//if(shape === 'square')imageContainer5.setAttribute("aria-label", "正方形のプロフィール画像");
			const imageDisplayElement = document.createElement("div");
			Object.assign(imageDisplayElement.style, {
				backgroundImage: `url(${iconURL})`,
			});
			imageDisplayElement.className = this.#classNameProcessor("css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv");
			imageContainer5.appendChild(imageDisplayElement);
			const imageElement = document.createElement("img");
			imageElement.setAttribute('draggable', "true");
			imageElement.className = this.#classNameProcessor("css-9pa8cd");
			imageElement.src = iconURL;
			imageElement.alt = shape === 'square' ? "正方形のプロフィール画像" : "";
			imageContainer5.appendChild(imageElement);
			imageContainer4.appendChild(imageContainer5);
			imageContainer2.appendChild(imageContainer4);
			imageContainer1.appendChild(imageContainer2);
			avatarLink.appendChild(imageContainer1);

			const container13 = document.createElement("div");
			container13.className = this.#classNameProcessor((shape == 'circle' ?
				"css-175oi2r r-sdzlij r-1udh08x r-45ll9u r-u8s1d r-1v2oles r-176fswd"
				:
				"css-175oi2r r-45ll9u r-u8s1d r-1v2oles r-176fswd"
			));
			Object.assign(container13.style, {
				width: "calc(100% + 4px)",
				height: "calc(100% + 4px)",
				...(shape == 'circle' ? {

				} : {
					clipPath: 'url("#shape-square-rx-16")',
				})
			});
			const container14 = document.createElement("div");
			container14.className = this.#classNameProcessor("css-175oi2r r-172uzmj r-1pi2tsx r-13qz1uu r-o7ynqc r-6416eg r-1ny4l3l");
			container13.appendChild(container14);
			avatarLink.appendChild(container13);

			container8.appendChild(avatarLink);
			container7.appendChild(container8);
			container5.appendChild(container7);
			container4.appendChild(container5);
			container3.appendChild(container4);
			container2.appendChild(container3);
			avatarRootContainer.appendChild(container2);
			this.nodes.avatar = avatarRootContainer;
			return this;
		}
		setAuthor({name = null, screenName = this.data.screenName, tweetId = this.data.tweetId, isProtected = false, verifiedBadge = false, affiliatesBadge = null, createdAt = this.data.time.createdAt} = {}){
			// authorContainer
			//   container2
			//     container3
			//       container4
			//         container5
			//           nameContainer
			//             nameContainer2
			//               nameLink
			//                 nameContainer3
			//                   nameDisplayContainer
			//                     nameDisplayContainer2
			//                       nameElement
			//                   badgeContainer
			//                     badgeContainer2
			//					     ?verifiedBadgeElement
			//					     ?affiliatesBadgeElement
			//                       ?protectedBadgeElement
			//                       ?affiliatesBadgeContainer
			//						   affiliatesBadgeContainer2
			//                           affiliatesBadgeContainer3
			//                           affiliatesBadgeContainer4
			//                             affiliatesBadgeContainer5
			//                               affiliatesBadgeDisplayElement
			//                               affiliatesBadgeImageElement
			//           screenNameContainer
			//             screenNameContainer2
			//               screenNameContainer3
			//                 screenNameLink
			//                   screenNameContainer4
			//                     screenNameElement
			//               dotContainer
			//                 dotElement
			//           timeContainer
			//             timeLink
			//               timeElement
			//     menuContainer
			//       menuContainer2
			//         menuContainer3
			//           menuContainer4
			//             menuButton
			//               menuContainer5
			//                 menuContainer6
			//                   menuContainer7
			//                   menuSvg

			if(!name){
				console.error({error: "[setAuthor] nameは必須です。", inputValue: name});
				return null;
			}
			if(!screenName){
				console.error({error: "[setAuthor] screenNameは必須です。", inputValue: screenName});
				return null;
			}
			screenName = screenName.replace(/^\@/, '');
			if(!tweetId){
				console.error({error: "[setAuthor] tweetIdは必須です。", inputValue: tweetId});
				return null;
			}
			verifiedBadge = verifiedBadge?.toLowerCase();
			if(verifiedBadge && !verifiedBadge?.match(/blue|business/)){
				console.error({error: `[setAuthor] verifiedBadgeは「blue」か「business」である必要があります`, inputValue: verifiedBadge});
				return null;
			}
			if(isUrl(affiliatesBadge)){
				console.error({error: `[setAuthor] affiliatesBadgeは画像のURLである必要があります`, inputValue: affiliatesBadge});
				return null;
			}
			if(createdAt){
				const time = new Date(createdAt);
				if(isNaN(time)){
					console.error({error: `[setAuthor] createdAtが必要です。また、正しい日付である必要があります`, inputValue: createdAt});
					return null;
				}
				this.data.time.createdAt = createdAt;
			}
			const authorContainer = document.createElement('div');
			authorContainer.setAttribute('tnb-id', "authorContainer");
			authorContainer.className = this.#classNameProcessor("css-175oi2r r-zl2h9q");
			const container2 = document.createElement('div');
			container2.className = this.#classNameProcessor("css-175oi2r r-k4xj1c r-18u37iz r-1wtj0ep");
			const container3 = document.createElement('div');
			container3.className = this.#classNameProcessor("css-175oi2r r-1d09ksm r-18u37iz r-1wbh5a2");
			const container4 = document.createElement('div');
			container4.className = this.#classNameProcessor("css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l");
			const container5 = document.createElement('div');
			container5.setAttribute('data-testid', `User-Name`);
			container5.setAttribute('tnb-id', `User-Name`);
			container5.className = this.#classNameProcessor("css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l r-1awozwy r-18u37iz");
			const nameContainer = document.createElement('div');
			nameContainer.className = this.#classNameProcessor("css-175oi2r r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs");
			const nameContainer2 = document.createElement('div');
			nameContainer2.className = this.#classNameProcessor("css-175oi2r r-1wbh5a2 r-dnmrzs");
			const nameLink = document.createElement('a');
			nameLink.setAttribute('role', "link");
			nameLink.className = this.#classNameProcessor("css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l r-1loqt21");
			nameLink.href = `/${screenName}`;
			const nameContainer3 = document.createElement('div');
			nameContainer3.className = this.#classNameProcessor("css-175oi2r r-1awozwy r-18u37iz r-1wbh5a2 r-dnmrzs");
			const nameDisplayContainer = document.createElement('div');
			nameDisplayContainer.setAttribute('dir', "ltr");
			nameDisplayContainer.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-a023e6 r-rjixqe r-b88u0q r-1awozwy r-6koalj r-1udh08x r-3s2u2q");
			Object.assign(nameDisplayContainer.style, {
				color: this.#colors.get('fontColor'),
			});
			const nameDisplayContainer2 = document.createElement('div');
			nameDisplayContainer2.className = this.#classNameProcessor("css-1jxf684 r-dnmrzs r-1udh08x r-1udbk01 r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc");
			const nameElement = document.createElement('span');
			nameElement.className = this.#classNameProcessor("css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc");
			nameElement.textContent = name;
			nameDisplayContainer2.appendChild(nameElement);
			nameDisplayContainer.appendChild(nameDisplayContainer2);

			const badgeContainer = document.createElement('div');
			badgeContainer.setAttribute('dir', "ltr");
			badgeContainer.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-a023e6 r-rjixqe r-16dba41 r-xoduu5 r-18u37iz r-1q142lx");
			Object.assign(badgeContainer.style, {
				color: this.#colors.get('fontColor'),
			});
			const badgeContainer2 = document.createElement('span');
			badgeContainer2.className = this.#classNameProcessor("css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-1awozwy r-xoduu5");

			if(verifiedBadge === 'blue'){
				const verifiedBadgeElement = createSvgElement(this.#svgPaths.blueBadge).svg;
				verifiedBadgeElement.setAttribute('aria-label', "認証済みアカウント");
				verifiedBadgeElement.setAttribute('role', "img");
				verifiedBadgeElement.setAttribute('data-testid', "icon-verified");
				verifiedBadgeElement.setAttribute('tnb-id', "icon-verified");
				verifiedBadgeElement.setAttribute("class", this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-1cvl2hr r-f9ja8p r-og9te1 r-3t4u6i"));
				badgeContainer2.appendChild(verifiedBadgeElement);
			}
			if(verifiedBadge === 'business'){
				const svgNS = "http://www.w3.org/2000/svg";
				const affiliatesBadgeElement = document.createElementNS(svgNS, "svg");
				affiliatesBadgeElement.setAttribute("viewBox", "0 0 22 22");
				affiliatesBadgeElement.setAttribute("aria-label", "認証済みアカウント");
				affiliatesBadgeElement.setAttribute("role", "img");
				affiliatesBadgeElement.setAttribute("data-testid", "icon-verified");
				affiliatesBadgeElement.setAttribute("class", this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-f9ja8p r-og9te1 r-3t4u6i"));

				const g = document.createElementNS(svgNS, "g");
				const linearGradient1 = document.createElementNS(svgNS, "linearGradient");
				linearGradient1.setAttribute("gradientUnits", "userSpaceOnUse");
				linearGradient1.setAttribute("id", "43-a");
				linearGradient1.setAttribute("x1", "4.411");
				linearGradient1.setAttribute("x2", "18.083");
				linearGradient1.setAttribute("y1", "2.495");
				linearGradient1.setAttribute("y2", "21.508");
				const stop1 = document.createElementNS(svgNS, "stop");
				stop1.setAttribute("offset", "0");
				stop1.setAttribute("stop-color", "#f4e72a");
				linearGradient1.appendChild(stop1);
				const stop2 = document.createElementNS(svgNS, "stop");
				stop2.setAttribute("offset", ".539");
				stop2.setAttribute("stop-color", "#cd8105");
				linearGradient1.appendChild(stop2);
				const stop3 = document.createElementNS(svgNS, "stop");
				stop3.setAttribute("offset", ".68");
				stop3.setAttribute("stop-color", "#cb7b00");
				linearGradient1.appendChild(stop3);
				const stop4 = document.createElementNS(svgNS, "stop");
				stop4.setAttribute("offset", "1");
				stop4.setAttribute("stop-color", "#f4ec26");
				linearGradient1.appendChild(stop4);
				const stop5 = document.createElementNS(svgNS, "stop");
				stop5.setAttribute("offset", "1");
				stop5.setAttribute("stop-color", "#f4e72a");
				linearGradient1.appendChild(stop5);

				const linearGradient2 = document.createElementNS(svgNS, "linearGradient");
				linearGradient2.setAttribute("gradientUnits", "userSpaceOnUse");
				linearGradient2.setAttribute("id", "43-b");
				linearGradient2.setAttribute("x1", "5.355");
				linearGradient2.setAttribute("x2", "16.361");
				linearGradient2.setAttribute("y1", "3.395");
				linearGradient2.setAttribute("y2", "19.133");
				const stop6 = document.createElementNS(svgNS, "stop");
				stop6.setAttribute("offset", "0");
				stop6.setAttribute("stop-color", "#f9e87f");
				linearGradient2.appendChild(stop6);
				const stop7 = document.createElementNS(svgNS, "stop");
				stop7.setAttribute("offset", ".406");
				stop7.setAttribute("stop-color", "#e2b719");
				linearGradient2.appendChild(stop7);
				const stop8 = document.createElementNS(svgNS, "stop");
				stop8.setAttribute("offset", ".989");
				stop8.setAttribute("stop-color", "#e2b719");
				linearGradient2.appendChild(stop8);

				const g2 = document.createElementNS(svgNS, "g");
				g2.setAttribute("clip-rule", "evenodd");
				g2.setAttribute("fill-rule", "evenodd");
				const path1 = document.createElementNS(svgNS, "path");
				path1.setAttribute("d", "M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z");
				path1.setAttribute("fill", "url(#43-a)");
				g2.appendChild(path1);
				const path2 = document.createElementNS(svgNS, "path");
				path2.setAttribute("d", "M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z");
				path2.setAttribute("fill", "url(#43-b)");
				g2.appendChild(path2);
				const path3 = document.createElementNS(svgNS, "path");
				path3.setAttribute("d", "M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z");
				path3.setAttribute("fill", "#d18800");
				g2.appendChild(path3);

				g.appendChild(linearGradient1);
				g.appendChild(linearGradient2);
				g.appendChild(g2);
				affiliatesBadgeElement.appendChild(g);
				badgeContainer2.appendChild(affiliatesBadgeElement);
			}
			if(isProtected){
				const protectedBadgeElement = createSvgElement(this.#svgPaths.protected).svg;
				protectedBadgeElement.setAttribute('aria-label', "非公開アカウント");
				protectedBadgeElement.setAttribute('role', "img");
				protectedBadgeElement.setAttribute('data-testid', "icon-lock");
				protectedBadgeElement.setAttribute('tnb-id', "icon-lock");
				protectedBadgeElement.setAttribute("class", this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-1xvli5t r-bnwqim r-lrvibr r-m6rgpd r-3t4u6i r-vlxjld r-f9ja8p r-og9te1"));
				badgeContainer2.appendChild(protectedBadgeElement);
			}
			if(affiliatesBadge){
				const affiliatesBadgeContainer = document.createElement('div');
				affiliatesBadgeContainer.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1777fci r-x1x4zq r-1ez5h0i r-1ny4l3l r-1loqt21");
				affiliatesBadgeContainer.setAttribute('tabindex', "0");
				affiliatesBadgeContainer.setAttribute('role', "link");
				const affiliatesBadgeContainer2 = document.createElement('div');
				affiliatesBadgeContainer2.className = this.#classNameProcessor("css-175oi2r r-1adg3ll r-1udh08x");
				const affiliatesBadgeContainer3 = document.createElement('div');
				affiliatesBadgeContainer3.className = this.#classNameProcessor("r-1adg3ll r-13qz1uu");
				Object.assign(affiliatesBadgeContainer3.style, {
					paddingBottom: "100%",
				});
				affiliatesBadgeContainer2.appendChild(affiliatesBadgeContainer3);
				const affiliatesBadgeContainer4 = document.createElement('div');
				affiliatesBadgeContainer4.className = this.#classNameProcessor("r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu");
				const affiliatesBadgeContainer5 = document.createElement('div');
				affiliatesBadgeContainer5.className = this.#classNameProcessor("css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-126aqm3 r-1jkafct r-rs99b7 r-6koalj r-1pi2tsx r-13qz1uu");
				const affiliatesBadgeDisplayElement = document.createElement('div');
				affiliatesBadgeDisplayElement.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv");
				Object.assign(affiliatesBadgeDisplayElement.style, {
					backgroundImage: `url(${affiliatesBadge})`,
				});
				affiliatesBadgeContainer5.appendChild(affiliatesBadgeDisplayElement);
				const affiliatesBadgeImageElement = document.createElement('img');
				affiliatesBadgeImageElement.setAttribute('draggable', "true");
				affiliatesBadgeImageElement.className = this.#classNameProcessor("css-9pa8cd");
				affiliatesBadgeImageElement.src = affiliatesBadge;
				affiliatesBadgeImageElement.alt = "";
				affiliatesBadgeContainer5.appendChild(affiliatesBadgeImageElement);
				affiliatesBadgeContainer4.appendChild(affiliatesBadgeContainer5);
				affiliatesBadgeContainer2.appendChild(affiliatesBadgeContainer4);
				affiliatesBadgeContainer.appendChild(affiliatesBadgeContainer2);
				badgeContainer2.appendChild(affiliatesBadgeContainer);
			}
			badgeContainer.appendChild(badgeContainer2);
			nameContainer3.appendChild(nameDisplayContainer);
			nameContainer3.appendChild(badgeContainer);
			nameLink.appendChild(nameContainer3);
			nameContainer2.appendChild(nameLink);
			nameContainer.appendChild(nameContainer2);

			const screenNameContainer = document.createElement('div');
			screenNameContainer.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1wbh5a2 r-1ez5h0i");
			const screenNameContainer2 = document.createElement('div');
			screenNameContainer2.className = this.#classNameProcessor("css-175oi2r r-1d09ksm r-18u37iz r-1wbh5a2");
			const screenNameContainer3 = document.createElement('div');
			screenNameContainer3.className = this.#classNameProcessor("css-175oi2r r-1wbh5a2 r-dnmrzs");
			const screenNameLink = document.createElement('a');
			screenNameLink.setAttribute('role', "link");
			screenNameLink.setAttribute('tabindex', "-1");
			screenNameLink.className = this.#classNameProcessor("css-175oi2r r-1wbh5a2 r-dnmrzs r-1ny4l3l r-1loqt21");
			screenNameLink.href = `/${screenName}`;
			const screenNameContainer4 = document.createElement('div');
			screenNameContainer4.className = this.#classNameProcessor("css-146c3p1 r-dnmrzs r-1udh08x r-1udbk01 r-3s2u2q r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-18u37iz r-1wvb978");
			Object.assign(screenNameContainer4.style, {
				color: this.#colors.get('fontColorDark'),
			});
			const screenNameElement = document.createElement('span');
			screenNameElement.className = this.#classNameProcessor("css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc");
			screenNameElement.textContent = `@${screenName}`;
			screenNameContainer4.appendChild(screenNameElement);
			screenNameLink.appendChild(screenNameContainer4);
			screenNameContainer3.appendChild(screenNameLink);

			const dotContainer = document.createElement('div');
			dotContainer.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-a023e6 r-rjixqe r-16dba41 r-1q142lx r-n7gxbd");
			dotContainer.setAttribute('aria-hidden', "true");
			dotContainer.setAttribute('dir', "ltr");
			Object.assign(dotContainer.style, {
				color: this.#colors.get('fontColorDark'),
			});
			const dotElement = document.createElement('span');
			dotElement.className = this.#classNameProcessor("css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc");
			dotElement.textContent = "·";
			dotContainer.appendChild(dotElement);
			screenNameContainer2.appendChild(screenNameContainer3);
			screenNameContainer.appendChild(screenNameContainer2);

			const timeText = this.#timeProcessor(createdAt);
			const timeContainer = document.createElement('div');
			timeContainer.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1q142lx");
			const timeLink = document.createElement('a');
			timeLink.setAttribute('role', "link");
			timeLink.setAttribute('dir', "ltr");
			timeLink.setAttribute('aria-label', `${timeText.timeText}${timeText.flag ? this.#textData.before : ""}`);
			timeLink.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc r-a023e6 r-rjixqe r-16dba41 r-xoduu5 r-1q142lx r-1w6e6rj r-9aw3ui r-3s2u2q r-1loqt21");
			timeLink.href = `/${screenName}/status/${tweetId}`;
			Object.assign(timeLink.style, {
				color: this.#colors.get('fontColorDark'),
			});
			const timeElement = document.createElement('time');
			timeElement.setAttribute('datetime', timeText.ISO);
			timeElement.textContent = timeText.timeText;

			timeLink.appendChild(timeElement);
			timeContainer.appendChild(timeLink);
			container5.appendChild(nameContainer);
			container5.appendChild(screenNameContainer);
			container5.appendChild(dotContainer);
			container5.appendChild(timeContainer);
			container4.appendChild(container5);
			container3.appendChild(container4);
			container2.appendChild(container3);
			authorContainer.appendChild(container2);

			const menuContainer = document.createElement('div');
			menuContainer.setAttribute('tnb-id', "menuContainer");
			menuContainer.className = this.#classNameProcessor("css-175oi2r r-1kkk96v");
			const menuContainer2 = document.createElement('div');
			menuContainer2.className = this.#classNameProcessor("css-175oi2r r-1awozwy r-6koalj r-18u37iz");
			const menuContainer3 = document.createElement('div');
			menuContainer3.className = this.#classNameProcessor("css-175oi2r");
			const menuContainer4 = document.createElement('div');
			menuContainer4.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1h0z5md");
			const menuButton = document.createElement('button');
			menuButton.setAttribute('data-testid', "caret");
			menuButton.setAttribute('tnb-id', "caret");
			menuButton.setAttribute('role', "button");
			menuButton.setAttribute('aria-haspopup', "menu");
			menuButton.setAttribute('aria-expanded', "false");
			menuButton.setAttribute('type', "button");
			menuButton.className = this.#classNameProcessor("css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l");
			const menuContainer5 = document.createElement('div');
			menuContainer5.setAttribute('dir', "ltr");
			menuContainer5.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q");
			Object.assign(menuContainer5.style, {
				color: this.#colors.get('fontColorDark'),
			});
			const menuContainer6 = document.createElement('div');
			menuContainer6.className = this.#classNameProcessor("css-175oi2r r-xoduu5");
			const menuContainer7 = document.createElement('div');
			menuContainer7.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l");
			menuContainer6.appendChild(menuContainer7);
			const menuSvg = createSvgElement(this.#svgPaths.menu).svg;
			menuSvg.setAttribute('aria-hidden', "true");
			menuSvg.setAttribute('class', this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"));
			menuContainer7.appendChild(menuSvg);
			menuContainer5.appendChild(menuContainer6);
			menuButton.appendChild(menuContainer5);
			menuContainer4.appendChild(menuButton);
			menuContainer3.appendChild(menuContainer4);
			menuContainer2.appendChild(menuContainer3);
			menuContainer.appendChild(menuContainer2);

			container2.appendChild(menuContainer);
			this.nodes.author = authorContainer;
			return this;
		}
		setText(text){
			// textContainer
			//   textContainer2
			//     textElement
			if(typeof text === 'string'){
				// 文字列の場合はHTMLとしてパース
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = text;
				text = tempDiv.firstChild;
			}else if(("" || null || undefined) || (text instanceof Element)){
				//
			}else{
				console.error({error: "[setText] textは文字列かElementか空である必要があります", inputValue: text});
				return null;
			}
			const textContainer = document.createElement('div');
			textContainer.setAttribute('tnb-id', "textContainer");
			textContainer.className = this.#classNameProcessor("css-175oi2r");
			if(text){
				const textContainer2 = document.createElement('div');
				textContainer2.setAttribute('data-testid', "tweetText");
				textContainer2.setAttribute('tnb-id', "tweetText");
				textContainer2.setAttribute('dir', "auto");
				textContainer2.setAttribute('lang', "ja");
				textContainer2.className = this.#classNameProcessor("css-146c3p1 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-1udbk01 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-bnwqim tweetExpanderChecked");
				Object.assign(textContainer2.style, {
					color: this.#colors.get('fontColor'),
				});
				const textElement = text;
				textElement.className = this.#classNameProcessor("css-1jxf684 r-bcqeeo r-1ttztb7 r-qvutc0 r-1tl8opc");
				textElement.querySelectorAll('a').forEach((link) => {
					link.addEventListener('mouseenter', function(){
						link.className = envSelector.link.hovered;
					});
					link.addEventListener('mouseleave', function(){
						link.className = envSelector.link.nomal;
					});
				});
				textContainer2.appendChild(textElement);
				textContainer.appendChild(textContainer2);
			}
			this.nodes.tweetText = textContainer;
			return this;
		}
		setMedia(medias = []){
			//[{media: "", type: "", size: {width: "", height: ""}, ?videoData: {thumbnail: "", source: {src: ""}, otherSource: [{src: ""}]}}]
			//type: photo, video, animated_gif
			const node = this.#createMediaNode(medias);
			if(node)this.nodes.media = node;
			return this;
		}
		setFooter({replyCount = 0, retweetCount = 0, quoteCount = 0, favoriteCount = 0, retweeted = false, favorited = false, bookmarked = false, analyticsCount = 0}={}){
			// footerContainer
			//   footerContainer2
			//     footerContainer3
			//       footerContainer4
			//         replyContainer
			//           replyButton
			//             replyContainer2
			//               replyContainer3
			//                 replyContainer4
			//                 replySvg
			//               replyCountContainer
			//                 replyCountElement
			//                   replyCountElement2
			//         retweetContainer

			this.data.reply.count = replyCount;
			this.data.retweet.count = retweetCount + quoteCount;
			this.data.favorite.count = favoriteCount;

			const footerContainer = document.createElement('div');
			footerContainer.setAttribute('tnb-id', "footerContainer");
			footerContainer.className = this.#classNameProcessor("css-175oi2r");
			const footerContainer2 = document.createElement('div');
			footerContainer2.className = this.#classNameProcessor("css-175oi2r");
			const footerContainer3 = document.createElement('div');
			footerContainer3.setAttribute('role', "group");
			footerContainer3.setAttribute('id', "dummy");
			footerContainer3.className = this.#classNameProcessor("css-175oi2r r-1kbdv8c r-18u37iz r-1wtj0ep r-1ye8kvj r-1s2bzr4");
			const footerContainer4 = document.createElement('div');
			footerContainer4.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1h0z5md r-13awgt0");
			const replyContainer = document.createElement('div');
			replyContainer.setAttribute('tnb-id', "replyContainer");
			replyContainer.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1h0z5md r-13awgt0");
			const replyButton = document.createElement('button');
			replyButton.setAttribute('data-testid', "reply");
			replyButton.setAttribute('tnb-id', "reply");
			replyButton.setAttribute('role', "button");
			replyButton.setAttribute('type', "button");
			replyButton.className = this.#classNameProcessor("css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l");
			const replyContainer2 = document.createElement('div');
			replyContainer2.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q");
			Object.assign(replyContainer2.style, {
				color: this.#colors.get('fontColorDark'),
			});
			const replyContainer3 = document.createElement('div');
			replyContainer3.className = this.#classNameProcessor("css-175oi2r r-xoduu5");
			const replyContainer4 = document.createElement('div');
			replyContainer4.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l");
			replyContainer3.appendChild(replyContainer4);
			const replySvg = createSvgElement(this.#svgPaths.reply).svg;
			replySvg.setAttribute('aria-hidden', "true");
			replySvg.setAttribute('class', this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"));
			replyContainer3.appendChild(replySvg);
			replyContainer2.appendChild(replyContainer3);
			const replyCountContainer = document.createElement('div');
			replyCountContainer.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1udh08x");
			const replyCountElement = document.createElement('span');
			replyCountElement.setAttribute('data-testid', "app-text-transition-container");
			replyCountElement.setAttribute('tnb-id', "app-text-transition-container");
			Object.assign(replyCountElement.style, {
				transitionProperty: "transform",
				transitionDuration: "0.3s",
				transform: "translate3d(0px, 0px, 0px)",
			});
			const replyCountElement2 = document.createElement('span');
			replyCountElement2.className = this.#classNameProcessor("css-1jxf684 r-1ttztb7 r-qvutc0 r-1tl8opc r-n6v787 r-1cwl3u0 r-1k6nrdp r-n7gxbd");
			replyCountElement2.textContent = this.data.reply.count > 0 ? this.data.reply.count : "";
			this.data.reply.element = replyCountElement2;
			replyCountElement.appendChild(replyCountElement2);
			replyCountContainer.appendChild(replyCountElement);
			replyContainer2.appendChild(replyCountContainer);
			replyButton.appendChild(replyContainer2);
			replyContainer.appendChild(replyButton);
			footerContainer4.appendChild(replyContainer);
			this.#addChangeColorEventListener(replyContainer2, replyContainer4, this.#colors.get('twitterBlue'), this.#colors.getWithAlpha('twitterBlue', 0.1), this.#colors.get('fontColorDark'), "");

			const retweetContainer = document.createElement('div');
			retweetContainer.setAttribute('tnb-id', "retweetContainer");
			retweetContainer.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1h0z5md r-13awgt0");
			const retweetButton = document.createElement('button');
			retweetButton.setAttribute('data-testid', "retweet");
			retweetButton.setAttribute('tnb-id', "retweet");
			retweetButton.setAttribute('role', "button");
			retweetButton.setAttribute('type', "button");
			retweetButton.className = this.#classNameProcessor("css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l");
			const retweetContainer2 = document.createElement('div');
			retweetContainer2.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q");
			Object.assign(retweetContainer2.style, {
				color: this.#colors.get(retweeted ? 'retweeted' : 'fontColorDark'),
			});
			const retweetContainer3 = document.createElement('div');
			retweetContainer3.className = this.#classNameProcessor("css-175oi2r r-xoduu5");
			const retweetContainer4 = document.createElement('div');
			retweetContainer4.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l");
			retweetContainer3.appendChild(retweetContainer4);
			const retweetSvg = createSvgElement(this.#svgPaths[retweeted ? "retweeted" : "retweet"]).svg;
			retweetSvg.setAttribute('aria-hidden', "true");
			retweetSvg.setAttribute('class', this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"));
			if(retweeted)retweetSvg.style.color = this.#colors.get('retweeted');
			retweetContainer3.appendChild(retweetSvg);
			retweetContainer2.appendChild(retweetContainer3);
			const retweetCountContainer = document.createElement('div');
			retweetCountContainer.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1udh08x");
			const retweetCountElement = document.createElement('span');
			retweetCountElement.setAttribute('data-testid', "app-text-transition-container");
			retweetCountElement.setAttribute('tnb-id', "app-text-transition-container");
			Object.assign(retweetCountElement.style, {
				transitionProperty: "transform",
				transitionDuration: "0.3s",
				transform: "translate3d(0px, 0px, 0px)",
			});
			const retweetCountElement2 = document.createElement('span');
			retweetCountElement2.className = this.#classNameProcessor("css-1jxf684 r-1ttztb7 r-qvutc0 r-1tl8opc r-n6v787 r-1cwl3u0 r-1k6nrdp r-n7gxbd");
			retweetCountElement2.textContent = this.data.retweet.count > 0 ? this.data.retweet.count : "";
			this.data.retweet.element = retweetCountElement2;
			retweetCountElement.appendChild(retweetCountElement2);
			retweetCountContainer.appendChild(retweetCountElement);
			retweetContainer2.appendChild(retweetCountContainer);
			retweetButton.appendChild(retweetContainer2);
			retweetContainer.appendChild(retweetButton);
			footerContainer4.appendChild(retweetContainer);
			this.#addChangeColorEventListener(retweetContainer2, retweetContainer4, this.#colors.get('retweeted'), this.#colors.getWithAlpha('retweeted', 0.1), this.#colors.get('fontColorDark'), "");
			addClickButtonEvent(retweetButton, retweetSvg, retweetSvg.querySelector('path'), "retweet");

			const favoriteContainer = document.createElement('div');
			favoriteContainer.setAttribute('tnb-id', "favoriteContainer");
			favoriteContainer.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1h0z5md r-13awgt0");
			const favoriteButton = document.createElement('button');
			favoriteButton.setAttribute('data-testid', "like");
			favoriteButton.setAttribute('tnb-id', "like");
			favoriteButton.setAttribute('role', "button");
			favoriteButton.setAttribute('type', "button");
			favoriteButton.className = this.#classNameProcessor("css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l");
			const favoriteContainer2 = document.createElement('div');
			favoriteContainer2.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q");
			Object.assign(favoriteContainer2.style, {
				color: this.#colors.get(favorited ? 'favorited' : 'fontColorDark'),
			});
			const favoriteContainer3 = document.createElement('div');
			favoriteContainer3.className = this.#classNameProcessor("css-175oi2r r-xoduu5");
			const favoriteContainer4 = document.createElement('div');
			favoriteContainer4.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l");
			favoriteContainer3.appendChild(favoriteContainer4);
			const favoriteSvg = createSvgElement(this.#svgPaths[favorited ? "favorited" : "favorite"]).svg;
			favoriteSvg.setAttribute('aria-hidden', "true");
			favoriteSvg.setAttribute('class', this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"));
			if(favorited)favoriteSvg.style.color = this.#colors.get('favorited');
			favoriteContainer3.appendChild(favoriteSvg);
			favoriteContainer2.appendChild(favoriteContainer3);
			const favoriteCountContainer = document.createElement('div');
			favoriteCountContainer.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1udh08x");
			const favoriteCountElement = document.createElement('span');
			favoriteCountElement.setAttribute('data-testid', "app-text-transition-container");
			favoriteCountElement.setAttribute('tnb-id', "app-text-transition-container");
			Object.assign(favoriteCountElement.style, {
				transitionProperty: "transform",
				transitionDuration: "0.3s",
				transform: "translate3d(0px, 0px, 0px)",
			});
			const favoriteCountElement2 = document.createElement('span');
			favoriteCountElement2.className = this.#classNameProcessor("css-1jxf684 r-1ttztb7 r-qvutc0 r-1tl8opc r-n6v787 r-1cwl3u0 r-1k6nrdp r-n7gxbd");
			favoriteCountElement2.textContent = this.data.favorite.count > 0 ? this.data.favorite.count : "";
			this.data.favorite.element = favoriteCountElement2;
			favoriteCountElement.appendChild(favoriteCountElement2);
			favoriteCountContainer.appendChild(favoriteCountElement);
			favoriteContainer2.appendChild(favoriteCountContainer);
			favoriteButton.appendChild(favoriteContainer2);
			favoriteContainer.appendChild(favoriteButton);
			footerContainer4.appendChild(favoriteContainer);
			this.#addChangeColorEventListener(favoriteContainer2, favoriteContainer4, this.#colors.get('favorited'), this.#colors.getWithAlpha('favorited', 0.1), this.#colors.get('fontColorDark'), "");
			addClickButtonEvent(favoriteButton, favoriteSvg, favoriteSvg.querySelector('path'), "favorite");

			const analyticsContainer = document.createElement('div');
			analyticsContainer.setAttribute('tnb-id', "analyticsContainer");
			analyticsContainer.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1h0z5md r-13awgt0");
			const analyticsLink = document.createElement('a');
			analyticsLink.setAttribute('role', "link");
			analyticsLink.className = this.#classNameProcessor("css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1ny4l3l r-1loqt21");
			analyticsLink.href = `/${this.data.screenName}/status/${this.data.tweetId}/analytics`;
			const analyticsContainer2 = document.createElement('div');
			analyticsContainer2.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q");
			Object.assign(analyticsContainer2.style, {
				color: this.#colors.get('fontColorDark'),
			});
			const analyticsContainer3 = document.createElement('div');
			analyticsContainer3.className = this.#classNameProcessor("css-175oi2r r-xoduu5");
			const analyticsContainer4 = document.createElement('div');
			analyticsContainer4.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l");
			analyticsContainer3.appendChild(analyticsContainer4);
			const analyticsSvg = createSvgElement(this.#svgPaths.analytics).svg;
			analyticsSvg.setAttribute('aria-hidden', "true");
			analyticsSvg.setAttribute('class', this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"));
			analyticsContainer3.appendChild(analyticsSvg);
			analyticsContainer2.appendChild(analyticsContainer3);
			const analyticsCountContainer = document.createElement('div');
			analyticsCountContainer.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1udh08x");
			const analyticsCountElement = document.createElement('span');
			analyticsCountElement.setAttribute('data-testid', "app-text-transition-container");
			analyticsCountElement.setAttribute('tnb-id', "app-text-transition-container");
			Object.assign(analyticsCountElement.style, {
				transitionProperty: "transform",
				transitionDuration: "0.3s",
				transform: "translate3d(0px, 0px, 0px)",
			});
			const analyticsCountElement2 = document.createElement('span');
			analyticsCountElement2.className = this.#classNameProcessor("css-1jxf684 r-1ttztb7 r-qvutc0 r-1tl8opc r-n6v787 r-1cwl3u0 r-1k6nrdp r-n7gxbd");
			analyticsCountElement2.textContent = roundHalfUp(analyticsCount,this.#textData.roundingScale,this.#textData.decimalPlaces,this.#textData.units);
			analyticsCountElement.appendChild(analyticsCountElement2);
			analyticsCountContainer.appendChild(analyticsCountElement);
			analyticsContainer2.appendChild(analyticsCountContainer);
			analyticsLink.appendChild(analyticsContainer2);
			analyticsContainer.appendChild(analyticsLink);
			footerContainer4.appendChild(analyticsContainer);
			this.#addChangeColorEventListener(analyticsContainer2, analyticsContainer4, this.#colors.get('twitterBlue'), this.#colors.getWithAlpha('twitterBlue', 0.1), this.#colors.get('fontColorDark'), "");

			const bookmarkContainer = document.createElement('div');
			bookmarkContainer.setAttribute('tnb-id', "bookmarkContainer");
			bookmarkContainer.className = this.#classNameProcessor("css-175oi2r r-18u37iz r-1h0z5md r-1wron08");
			const bookmarkButton = document.createElement('button');
			bookmarkButton.setAttribute('data-testid', "bookmark");
			bookmarkButton.setAttribute('tnb-id', "bookmark");
			bookmarkButton.setAttribute('role', "button");
			bookmarkButton.setAttribute('type', "button");
			bookmarkButton.className = this.#classNameProcessor("css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l");
			const bookmarkContainer2 = document.createElement('div');
			bookmarkContainer2.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q");
			Object.assign(bookmarkContainer2.style, {
				color: this.#colors.get(bookmarked ? 'bookmarked' : 'fontColorDark'),
			});
			const bookmarkContainer3 = document.createElement('div');
			bookmarkContainer3.className = this.#classNameProcessor("css-175oi2r r-xoduu5");
			const bookmarkContainer4 = document.createElement('div');
			bookmarkContainer4.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l");
			bookmarkContainer3.appendChild(bookmarkContainer4);
			const bookmarkSvg = createSvgElement(this.#svgPaths.bookmark).svg;
			bookmarkSvg.setAttribute('aria-hidden', "true");
			bookmarkSvg.setAttribute('class', this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"));
			if(bookmarked)bookmarkSvg.style.color = this.#colors.get('bookmarked');
			bookmarkContainer3.appendChild(bookmarkSvg);
			bookmarkContainer2.appendChild(bookmarkContainer3);
			bookmarkButton.appendChild(bookmarkContainer2);
			bookmarkContainer.appendChild(bookmarkButton);
			footerContainer4.appendChild(bookmarkContainer);
			this.#addChangeColorEventListener(bookmarkContainer2, bookmarkContainer4, this.#colors.get('twitterBlue'), this.#colors.getWithAlpha('twitterBlue', 0.1), this.#colors.get('fontColorDark'), "");
			addClickButtonEvent(bookmarkButton, bookmarkSvg, bookmarkSvg.querySelector('path'), "bookmark");

			const shareContainer = document.createElement('div');
			shareContainer.setAttribute('tnb-id', "shareContainer");
			shareContainer.className = this.#classNameProcessor("css-175oi2r");
			const shareButton = document.createElement('button');
			shareButton.setAttribute('data-testid', "quickShare");
			shareButton.setAttribute('tnb-id', "quickShare");
			shareButton.setAttribute('role', "button");
			shareButton.setAttribute('type', "button");
			shareButton.className = this.#classNameProcessor("css-175oi2r r-1777fci r-bt1l66 r-bztko3 r-lrvibr r-1loqt21 r-1ny4l3l");
			const shareContainer2 = document.createElement('div');
			shareContainer2.className = this.#classNameProcessor("css-146c3p1 r-bcqeeo r-1ttztb7 r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-1awozwy r-6koalj r-1h0z5md r-o7ynqc r-clp7b1 r-3s2u2q");
			Object.assign(shareContainer2.style, {
				color: this.#colors.get('fontColorDark'),
			});
			const shareContainer3 = document.createElement('div');
			shareContainer3.className = this.#classNameProcessor("css-175oi2r r-xoduu5");
			const shareContainer4 = document.createElement('div');
			shareContainer4.className = this.#classNameProcessor("css-175oi2r r-xoduu5 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-1niwhzg r-sdzlij r-xf4iuw r-o7ynqc r-6416eg r-1ny4l3l");
			shareContainer3.appendChild(shareContainer4);
			const shareSvg = createSvgElement(this.#svgPaths.share2).svg;
			shareSvg.setAttribute('aria-hidden', "true");
			shareSvg.setAttribute('class', this.#classNameProcessor("r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1xvli5t r-1hdv0qi"));
			shareContainer3.appendChild(shareSvg);
			shareContainer2.appendChild(shareContainer3);
			shareButton.appendChild(shareContainer2);
			shareContainer.appendChild(shareButton);
			footerContainer4.appendChild(shareContainer);
			this.#addChangeColorEventListener(shareContainer2, shareContainer4, this.#colors.get('twitterBlue'), this.#colors.getWithAlpha('fontColorDark', 0.1), this.#colors.get('fontColorDark'), "");
			shareContainer.addEventListener('click', ()=>{
				let useDomain = scriptSettings.quickShareTweetLink?.domain || "twitter.com";
				if(useDomain === "other"){
					if(scriptSettings.quickShareTweetLink?.otherDomain){
						useDomain = scriptSettings.quickShareTweetLink.otherDomain;
					}else{
						useDomain = "twitter.com";
					}
				}
				copyToClipboard(`https://${useDomain}/${this.data.screenName}/status/${this.data.tweetId}`);
			});
			footerContainer3.appendChild(footerContainer4);
			footerContainer2.appendChild(footerContainer3);
			footerContainer.appendChild(footerContainer2);
			this.nodes.footer = footerContainer;
			return this;

			function addClickButtonEvent(button, svg, path, action){
				button.addEventListener('click', clickEvent);
				async function clickEvent(){
					if(button.getAttribute("undo") === "true"){
						let result;
						switch(action){
							case "retweet":
									result = await twitterApi.deleteRetweet(this.data.tweetId);
									if(!result)return;
									svg.style.color = this.#colors.get('fontColorDark');
									path.setAttribute('d', this.#svgPaths.retweet);
								break;
							case "favorite":
									result = await twitterApi.unfavoriteTweet(this.data.tweetId);
									if(!result)return;
									svg.style.color = this.#colors.get('fontColorDark');
									path.setAttribute('d', this.#svgPaths.favorite);
								break;
							case "bookmark":
									result = await twitterApi.deleteBookmark(this.data.tweetId);
									if(!result)return;
									svg.style.color = this.#colors.get('fontColorDark');
									path.setAttribute('d', this.#svgPaths.bookmark);
								break;
						}
						button.setAttribute("undo", "false");
						if(action !== "bookmark"){
							this.data.retweet.count--;
							if(this.data.retweet.count === 0){
								this.data[action].textElement.textContent = "";
							}else{
								this.data[action].textElement.textContent = this.data[action].count;
							}
						}
					}else{
						let result;
						switch(action){
							case "retweet":
								result = await twitterApi.retweet(this.data.tweetId);
								if(!result)return;
								svg.style.color = this.#colors.get('retweeted');
								path.setAttribute('d', this.#svgPaths.retweeted);
								break;
							case "favorite":
								result = await twitterApi.favoriteTweet(this.data.tweetId);
								if(!result)return;
								svg.style.color = this.#colors.get('favorited');
								path.setAttribute('d', this.#svgPaths.favorited);
								break;
							case "bookmark":
								result = await twitterApi.bookmark(this.data.tweetId);
								if(!result)return;
								svg.style.color = this.#colors.get('twitterBlue');
								path.setAttribute('d', this.#svgPaths.bookmarked);
								break;
						}
						button.setAttribute("undo", "true");
						if(action !== "bookmark"){
							this.data.retweet.count++;
							this.data[action].textElement.textContent = this.data[action].count;
						}
					}
				}
			}
		}
		// utility
		#addChangeColorEventListener(node, alphaNode, color, alphaColor, originalColor = "", originalAlphaColor = ""){
			node.addEventListener('mouseenter', function(){
				node.style.color = color;
				alphaNode.style.backgroundColor = alphaColor;
			});
			node.addEventListener('mouseleave', resetColor);
			node.addEventListener('touchend', resetColor);
			node.addEventListener('touchcancel', resetColor);
			function resetColor(){
				node.style.color = originalColor;
				alphaNode.style.backgroundColor = originalAlphaColor;
			}
		}
		#createMediaNode(medias, isQuoted = false){
			// mediaContainer
			const screenName = this.data.screenName;
			const tweetId = this.data.tweetId;
			let errorMessageFuncName;
			if(isQuoted){
				errorMessageFuncName = "[setQuoteMedia]";
			}else{
				errorMessageFuncName = "[setMedia]";
			}
			if(!Array.isArray(medias) || medias.length === 0){
				console.error({error: `${errorMessageFuncName} mediasは1つ以上の要素を持つ配列である必要があります`, inputValue: medias});
				return null;
			}
			medias.forEach(o=>{
				if(!(isUrl(o.media) || (o.media instanceof Blob) || o.videoData?.source?.src)){
					console.error({error: `${errorMessageFuncName} mediaはurlかblobである必要があります`, inputValue: o.media});
					return null;
				}
				if(!o.type){
					console.error({error: `${errorMessageFuncName} typeは必須です`, inputValue: o.type});
					return null;
				}
			});
			const mediaContainer = document.createElement('div');
			mediaContainer.setAttribute('tnb-id', "mediaContainer");
			mediaContainer.className = classNameProcessor("css-175oi2r r-9aw3ui r-1s2bzr4");
			const mediaContainer2 = document.createElement('div');
			mediaContainer2.className = classNameProcessor("css-175oi2r r-9aw3ui");
			const mediaContainer3 = document.createElement('div');
			mediaContainer3.className = classNameProcessor("css-175oi2r");
			const mediaContainer4 = document.createElement('div');
			mediaContainer4.className = classNameProcessor("css-175oi2r");
			const mediaContainer5 = document.createElement('div');
			mediaContainer5.className = classNameProcessor("css-175oi2r r-18bvks7 r-1phboty r-rs99b7 r-1867qdf r-1udh08x r-o7ynqc r-6416eg r-1ny4l3l");
			mediaContainer5.setAttribute('tnb-id', "mediaRoot");
			const mediaContainer6 = document.createElement('div');
			if(medias.length === 1){
				mediaContainer6.className = classNameProcessor("css-175oi2r");
				mediaContainer6.setAttribute('tnb-id', "media0");
				mediaContainer6.appendChild(createMediaElement(medias[0], 0));
				mediaContainer4.classList.add("r-k200y", "tnb-r-k200y");
				if(medias[0].type === "video"){
					const [newWidth, newHeight] = calculateMediaSize(medias[0].size.width, medias[0].size.height);
					Object.assign(mediaContainer6.style, {
						width: `${newWidth}px`,
						height: `${newHeight}px`,
					});
				}
			}else{
				mediaContainer6.className = classNameProcessor("css-175oi2r r-1adg3ll r-1udh08x");
				const mediaContainer7 = document.createElement('div');
				mediaContainer7.className = classNameProcessor("r-1adg3ll r-13qz1uu");
				Object.assign(mediaContainer7.style, {
					paddingBottom: "56.25%",
				});
				mediaContainer6.appendChild(mediaContainer7);
				const mediaContainer8 = document.createElement('div');
				mediaContainer8.className = classNameProcessor("r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu");
				if(medias.length === 2){
					const mediaContainer9 = document.createElement('div');
					mediaContainer9.className = classNameProcessor("css-175oi2r r-1pi2tsx r-13qz1uu r-18u37iz");
					const mediaContainer10 = document.createElement('div');
					mediaContainer10.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim r-x1x4zq");
					mediaContainer10.setAttribute('tnb-id', "media0");
					mediaContainer10.appendChild(createMediaElement(medias[0], 0));
					mediaContainer9.appendChild(mediaContainer10);
					const mediaContainer11 = document.createElement('div');
					mediaContainer11.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim");
					mediaContainer11.setAttribute('tnb-id', "media1");
					mediaContainer11.appendChild(createMediaElement(medias[1], 1));
					mediaContainer9.appendChild(mediaContainer11);
					mediaContainer8.appendChild(mediaContainer9);
				}else if(medias.length === 3){
					const mediaContainer9 = document.createElement('div');
					mediaContainer9.className = classNameProcessor("css-175oi2r r-1pi2tsx r-13qz1uu r-18u37iz");
					const mediaContainer10 = document.createElement('div');
					mediaContainer10.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim r-x1x4zq");
					mediaContainer10.setAttribute('tnb-id', "media0");
					mediaContainer10.appendChild(createMediaElement(medias[0], 0));
					mediaContainer9.appendChild(mediaContainer10);
					const mediaContainer11 = document.createElement('div');
					mediaContainer11.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-eqz5dr");
					const mediaContainer12 = document.createElement('div');
					mediaContainer12.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim r-zl2h9q");
					mediaContainer12.setAttribute('tnb-id', "media1");
					mediaContainer12.appendChild(createMediaElement(medias[1], 1));
					mediaContainer11.appendChild(mediaContainer12);
					const mediaContainer13 = document.createElement('div');
					mediaContainer13.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim");
					mediaContainer13.setAttribute('tnb-id', "media2");
					mediaContainer13.appendChild(createMediaElement(medias[2], 2));
					mediaContainer11.appendChild(mediaContainer13);
					mediaContainer9.appendChild(mediaContainer11);
					mediaContainer8.appendChild(mediaContainer9);
				}else{
					const mediaContainer9 = document.createElement('div');
					mediaContainer9.className = classNameProcessor("css-175oi2r r-1pi2tsx r-13qz1uu r-eqz5dr");
					const mediaContainer10 = document.createElement('div');
					mediaContainer10.className = classNameProcessor("css-175oi2r r-zl2h9q r-1iusvr4 r-16y2uox r-18u37iz");
					const mediaContainer11 = document.createElement('div');
					mediaContainer11.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim r-x1x4zq");
					mediaContainer11.setAttribute('tnb-id', "media0");
					mediaContainer11.appendChild(createMediaElement(medias[0], 0));
					mediaContainer10.appendChild(mediaContainer11);
					const mediaContainer12 = document.createElement('div');
					mediaContainer12.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim");
					mediaContainer12.setAttribute('tnb-id', "media1");
					mediaContainer12.appendChild(createMediaElement(medias[1], 1));
					mediaContainer10.appendChild(mediaContainer12);
					mediaContainer9.appendChild(mediaContainer10);
					const mediaContainer13 = document.createElement('div');
					mediaContainer13.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-18u37iz");
					const mediaContainer14 = document.createElement('div');
					mediaContainer14.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim r-x1x4zq");
					mediaContainer14.setAttribute('tnb-id', "media2");
					mediaContainer14.appendChild(createMediaElement(medias[2], 2));
					mediaContainer13.appendChild(mediaContainer14);
					const mediaContainer15 = document.createElement('div');
					mediaContainer15.className = classNameProcessor("css-175oi2r r-1iusvr4 r-16y2uox r-bnwqim");
					mediaContainer15.setAttribute('tnb-id', "media3");
					mediaContainer15.appendChild(createMediaElement(medias[3], 3));
					mediaContainer13.appendChild(mediaContainer15);
					mediaContainer9.appendChild(mediaContainer13);
					mediaContainer8.appendChild(mediaContainer9);
				}
				mediaContainer6.appendChild(mediaContainer8);
			}
			mediaContainer5.appendChild(mediaContainer6);
			mediaContainer4.appendChild(mediaContainer5);
			mediaContainer3.appendChild(mediaContainer4);
			mediaContainer2.appendChild(mediaContainer3);
			mediaContainer.appendChild(mediaContainer2);
			return mediaContainer;

			function createMediaElement(mediaData, index){
				if(mediaData.type === 'photo'){
					return createPhotoElement(mediaData, index);
				}else if(mediaData.type === 'video'){
					return createVideoElement(mediaData, index);
				}else if(mediaData.type === 'animated_gif'){
					return createAnimatedGifElement(mediaData, index);
				}else{
					console.error({error: `${errorMessageFuncName} typeはphoto, video, animated_gifのいずれかである必要があります`, inputValue: mediaData.type});
					return null;
				}
			}

			function createPhotoElement(mediaData, index){
				const photoContainer = document.createElement('div');
				photoContainer.className = classNameProcessor("css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu");
				const photoLink = document.createElement('a');
				photoLink.setAttribute('role', "link");
				photoLink.href = `/${screenName}/status/${tweetId}/photo/${index + 1}`;
				photoLink.className = classNameProcessor("css-175oi2r r-1pi2tsx r-1ny4l3l r-1loqt21");
				if(medias.length === 1){
					const [newWidth, newHeight] = calculateMediaSize(mediaData.size.width, mediaData.size.height);
					const photoContainer2 = document.createElement('div');
					photoContainer2.className = classNameProcessor("css-175oi2r r-1adg3ll r-1udh08x");
					Object.assign(photoContainer2.style, {
						height: `${newHeight}px`,
						width: `${newWidth}px`,
					});
					const photoContainer3 = document.createElement('div');
					photoContainer3.className = classNameProcessor("r-1adg3ll r-1udh08x");
					Object.assign(photoContainer3.style, {
						paddingBottom: `${(newHeight / newWidth) * 100}%`,
					});
					photoContainer2.appendChild(photoContainer3);
					const photoContainer4 = document.createElement('div');
					photoContainer4.className = classNameProcessor("r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu");
					photoContainer4.appendChild(createImageElement(mediaData));
					photoContainer2.appendChild(photoContainer4);
					photoLink.appendChild(photoContainer2);
				}else{
					const photoContainer2 = document.createElement('div');
					photoContainer2.className = classNameProcessor("css-175oi2r r-1p0dtai r-1d2f490 r-1udh08x r-u8s1d r-zchlnj r-ipm5af");
					photoContainer2.appendChild(createImageElement(mediaData));
					photoLink.appendChild(photoContainer2);
				}
				photoContainer.appendChild(photoLink);
				return photoContainer;
				//
				function createImageElement(mediaData){
					const imageContainer1 = document.createElement('div');
					imageContainer1.className = classNameProcessor("css-175oi2r r-1mlwlqe r-1udh08x r-417010 r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af");
					imageContainer1.setAttribute('data-testid', "tweetPhoto");
					imageContainer1.setAttribute('tnb-id', "tweetPhoto");
					imageContainer1.setAttribute('aria-label', "画像");
					Object.assign(imageContainer1.style, {
						margin: "0px",
					});
					const imageDisplayContainer = document.createElement('div');
					imageDisplayContainer.className = classNameProcessor("css-175oi2r r-1niwhzg r-vvn4in r-u6sd8q r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-zchlnj r-ipm5af r-13qz1uu r-1wyyakw r-4gszlv");
					const imageElement = document.createElement('img');
					imageElement.setAttribute('draggable', "true");
					imageElement.className = classNameProcessor("css-9pa8cd");
					if(mediaData.media instanceof Blob){
						const url = URL.createObjectURL(mediaData.media);
						Object.assign(imageDisplayContainer.style, {
							backgroundImage: `url(${url})`,
						});
						imageElement.src = url;
						imageElement.onload = function(){
							URL.revokeObjectURL(url);
						};
					}else{
						Object.assign(imageDisplayContainer.style, {
							backgroundImage: `url(${mediaData.media})`,
						});
						imageElement.src = mediaData.media;
					}
					imageElement.alt = "";
					imageContainer1.appendChild(imageDisplayContainer);
					imageContainer1.appendChild(imageElement);
					return imageContainer1;
				}
			}
			function createVideoElement(mediaData){
				const [newWidth, newHeight] = calculateMediaSize(mediaData.size.width, mediaData.size.height);
				const videoContainer = document.createElement('div');
				videoContainer.className = classNameProcessor("css-175oi2r r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af");
				videoContainer.setAttribute('data-testid', "videoPlayer");
				videoContainer.setAttribute('tnb-id', "videoPlayer");
				const videoContainer2 = document.createElement('div');
				videoContainer2.className = classNameProcessor("css-175oi2r r-1adg3ll r-1udh08x r-bnwqim r-1pi2tsx r-13qz1uu");
				const videoContainer3 = document.createElement('div');
				videoContainer3.className = classNameProcessor("r-1adg3ll r-13qz1uu");
				if(medias.length === 1){
					Object.assign(videoContainer2.style, {
						height: `${newHeight}px`,
						width: `${newWidth}px`,
					});
					Object.assign(videoContainer3.style, {
						paddingBottom: `${(newHeight / newWidth) * 100}%`,
					});
				}
				videoContainer2.appendChild(videoContainer3);
				const videoContainer4 = document.createElement('div');
				videoContainer4.className = classNameProcessor("r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu");
				const videoContainer5 = document.createElement('div');
				videoContainer5.setAttribute('data-testid', "videoComponent");
				videoContainer5.setAttribute('tnb-id', "videoComponent");
				Object.assign(videoContainer5.style, {
					height: "100%",
					width: "100%",
					position: "relative",
					transform: "translateZ(0px)",
				});
				const videoContainer6 = document.createElement('div');
				Object.assign(videoContainer6.style, {
					position: "relative",
					width: "100%",
					height: "100%",
					backgroundColor: "transparent",
					overflow: "hidden",
				});
				const videoElement = document.createElement('video');
				videoElement.setAttribute('preload', "none");
				videoElement.setAttribute('controls', "");
				Object.assign(videoElement.style, {
					width: "100%",
					height: "100%",
					backgroundColor: "black",
					position: "absolute",
					top: "0%",
					left: "0%",
				});
				if(mediaData.videoData){
					videoElement.poster = mediaData.videoData.thumbnail;
					const sourceElement = document.createElement('source');
					sourceElement.src = mediaData.videoData.source.src;
					sourceElement.type = getMimeType(mediaData.videoData.source.src);
					videoElement.appendChild(sourceElement);
					mediaData.videoData.otherSource?.forEach((source)=>{
						const sourceElement = document.createElement('source');
						sourceElement.src = source.src;
						sourceElement.type = getMimeType(source.src);
						videoElement.appendChild(sourceElement);
					});
				}else{
					const sourceElement = document.createElement('source');
					sourceElement.src = mediaData.media;
					sourceElement.type = getMimeType(mediaData.media);
					videoElement.appendChild(sourceElement);
				}
				videoContainer6.appendChild(videoElement);
				videoContainer5.appendChild(videoContainer6);
				videoContainer4.appendChild(videoContainer5);
				videoContainer2.appendChild(videoContainer4);
				videoContainer.appendChild(videoContainer2);
				return videoContainer;
				//
			}
			function createAnimatedGifElement(mediaData){
				const [newWidth, newHeight] = calculateMediaSize(mediaData.size.width, mediaData.size.height);
				const gifContainer = document.createElement('div');
				gifContainer.className = classNameProcessor("css-175oi2r r-1p0dtai r-1d2f490 r-u8s1d r-zchlnj r-ipm5af");
				gifContainer.setAttribute('data-testid', "videoPlayer");
				gifContainer.setAttribute('tnb-id', "videoPlayer");
				const gifContainer2 = document.createElement('div');
				gifContainer2.className = classNameProcessor("css-175oi2r r-1adg3ll r-1udh08x r-bnwqim r-1pi2tsx r-13qz1uu");
				const gifContainer3 = document.createElement('div');
				gifContainer3.className = classNameProcessor("r-1adg3ll r-13qz1uu");
				if(medias.length === 1){
					Object.assign(gifContainer2.style, {
						height: `${newHeight}px`,
						width: `${newWidth}px`,
					});
					Object.assign(gifContainer3.style, {
						paddingBottom: `${(newHeight / newWidth) * 100}%`,
					});
				}
				gifContainer2.appendChild(gifContainer3);
				const gifContainer4 = document.createElement('div');
				gifContainer4.className = classNameProcessor("r-1p0dtai r-1pi2tsx r-1d2f490 r-u8s1d r-ipm5af r-13qz1uu");
				const gifContainer5 = document.createElement('div');
				gifContainer5.setAttribute('tnb-id', "videoComponent");
				Object.assign(gifContainer5.style, {
					height: "100%",
					width: "100%",
					position: "relative",
					transform: "translateZ(0px)",
				});
				const gifContainer6 = document.createElement('div');
				gifContainer6.setAttribute('data-testid', "videoComponent");
				gifContainer6.setAttribute('tnb-id', "videoComponent");
				Object.assign(gifContainer6.style, {
					position: "relative",
					width: "100%",
					height: "100%",
					backgroundColor: "transparent",
					overflow: "hidden",
				});
				const gifElement = document.createElement('video');
				gifElement.setAttribute('preload', "auto");
				gifElement.poster = mediaData.videoData.thumbnail;
				gifElement.setAttribute('loop', "");
				gifElement.setAttribute('autoplay', "");
				gifElement.setAttribute('muted', "");
				Object.assign(gifElement.style, {
					width: "100%",
					height: "100%",
					backgroundColor: "black",
					position: "absolute",
					top: "0%",
					left: "0%",
				});
				gifElement.addEventListener('click', function(){
					if(gifElement.paused){
						gifElement.play();
					}else{
						gifElement.pause();
					}
				});
				if(mediaData.videoData){
					const sourceElement = document.createElement('source');
					sourceElement.src = mediaData.videoData.source.src;
					sourceElement.type = getMimeType(mediaData.videoData.source.src);
					gifElement.appendChild(sourceElement);
					mediaData.videoData.otherSource?.forEach((source)=>{
						const sourceElement = document.createElement('source');
						sourceElement.src = source.src;
						sourceElement.type = getMimeType(source.src);
						gifElement.appendChild(sourceElement);
					});
				}else{
					const sourceElement = document.createElement('source');
					sourceElement.src = mediaData.media;
					sourceElement.type = getMimeType(mediaData.media);
					gifElement.appendChild(sourceElement);
				}
				gifContainer6.appendChild(gifElement);
				gifContainer5.appendChild(gifContainer6);
				gifContainer4.appendChild(gifContainer5);
				gifContainer2.appendChild(gifContainer4);
				gifContainer.appendChild(gifContainer2);
				return gifContainer;
			}
			function calculateMediaSize(width, height){
				const maxSquareSize = 516;
				const maxVerticalSize = 510;
				const maxHorizontalSize = 516;
				const maxHorizontalAspectRatio = 5/1;
				const maxVerticalAspectRatio = 3/4;
				let newWidth, newHeight;
				if(width === height){
					if(width > maxSquareSize){
						newWidth = maxSquareSize;
						newHeight = maxSquareSize;
					}
				}else if(width > height){
					// 横長の場合
					const aspectRatio = width / height;
					if(aspectRatio > maxHorizontalAspectRatio){
						newWidth = maxHorizontalSize;
						newHeight = maxHorizontalSize / maxHorizontalAspectRatio;
					}else{
						if(width > maxHorizontalSize){
							newWidth = maxHorizontalSize;
							newHeight = maxHorizontalSize / aspectRatio;
						}else{
							newWidth = width;
							newHeight = height;
						}
					}
				}else{
					// 縦長の場合
					const aspectRatio = width / height;
					if(aspectRatio < maxVerticalAspectRatio){
						newHeight = maxVerticalSize;
						newWidth = maxVerticalSize * maxVerticalAspectRatio;
					}else{
						if(height > maxVerticalSize){
							newHeight = maxVerticalSize;
							newWidth = maxVerticalSize * aspectRatio;
						}else{
							newWidth = width;
							newHeight = height;
						}
					}
				}
				return [newWidth, newHeight];
			}
			function getMimeType(url){
				const cleanUrl = url.split('?')[0];
				const extension = cleanUrl.split('.').pop().toLowerCase();
				switch(extension){
					case 'mp4':
						return 'video/mp4';
					case 'webm':
						return 'video/webm';
					case 'ogv':
						return 'video/ogg';
					case 'mkv':
						return 'video/x-matroska';
					case 'm3u8':
						return 'application/x-mpegURL';
					default:
						return '';
				}
			}
			function classNameProcessor(className){
				const tnbClassName = className.split(" ").map((n) => `tnb-${n}`).join(" ");
				return `${className} ${tnbClassName}`;
			}
		}
		#timeProcessor(time){
			const timeZoneObject = Intl.DateTimeFormat().resolvedOptions();
			const locale = getLocale(scriptSettings.makeTwitterLittleUseful.lang);
			const date = new Date(time);
			const now = new Date();
			const diff = now - date;
			/*
			const options = {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				timeZone: timeZoneObject.timeZone
			};
			const formatter = new Intl.DateTimeFormat(locale, options);
			const formattedDate = formatter.format(date);
			const [month, day, year] = formattedDate.split('/');
			const [hour, minute, second] = date.toLocaleTimeString(locale, { hour12: false }).split(':');
			*/
			const diffInSeconds = Math.floor(diff / 1000);
			const diffInMinutes = Math.floor(diffInSeconds / 60);
			const diffInHours = Math.floor(diffInMinutes / 60);
			const diffInDays = Math.floor(diffInHours / 24);
			const diffInYears = Math.floor(diffInDays / 365);

			let timeDifferenceMessage;
			let addBeforeFlag = true;
			if(diffInYears >= 1){
				addBeforeFlag = false;
				timeDifferenceMessage = `${date.toLocaleString(locale, {timeZone: timeZoneObject.timeZone})}`;
			}else if(diffInDays >= 1){
				const monthDayFormatter = new Intl.DateTimeFormat(locale, {month: 'long', day: 'numeric', timeZone: timeZoneObject.timeZone});
				timeDifferenceMessage = monthDayFormatter.format(date);
			}else if(diffInHours >= 1){
				timeDifferenceMessage = `${diffInHours}${this.#textData.hour}`;
			}else if(diffInMinutes >= 1){
				timeDifferenceMessage = `${diffInMinutes}${this.#textData.minute}`;
			}else{
				timeDifferenceMessage = `${diffInSeconds}${this.#textData.second}`;
			}
			return {timeText: timeDifferenceMessage, ISO: date.toISOString(), flag: addBeforeFlag};
		}
		#classNameProcessor(className){
			const tnbClassName = className.split(" ").map((n) => `tnb-${n}`).join(" ");
			return `${className} ${tnbClassName}`;
		}
		#appendCSS(){
			if(document.getElementById("tnbCSS"))return;
			const style = document.createElement('style');
			style.id = "tnbCSS";
			style.textContent = `
/* view-source:https://twitter.com/home */
[stylesheet-group="1"]{}
/*
.tnb-css-146c3p1{background-color:rgba(0,0,0,0.00);border:0 solid black;box-sizing:border-box;color:rgba(0,0,0,1.00);display:inline;font:14px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;list-style:none;margin:0px;padding:0px;position:relative;text-align:start;text-decoration:none;white-space:pre-wrap;word-wrap:break-word;}
.tnb-css-175oi2r{align-items:stretch;background-color:rgba(0,0,0,0.00);border:0 solid black;box-sizing:border-box;display:flex;flex-basis:auto;flex-direction:column;flex-shrink:0;list-style:none;margin:0px;min-height:0px;min-width:0px;padding:0px;position:relative;text-decoration:none;z-index:0;}
.tnb-css-1jxf684{background-color:rgba(0,0,0,0.00);border:0 solid black;box-sizing:border-box;color:inherit;display:inline;font:inherit;list-style:none;margin:0px;padding:0px;position:relative;text-align:inherit;text-decoration:none;white-space:inherit;word-wrap:break-word;}
.tnb-css-9pa8cd{bottom:0px;height:100%;left:0px;opacity:0;position:absolute;right:0px;top:0px;width:100%;z-index:-1;}
*/
[stylesheet-group="2"]{}
.tnb-r-13awgt0{flex:1;}
.tnb-r-1adg3ll{display:block;}
.tnb-r-1jkafct{border-bottom-left-radius:2px;border-bottom-right-radius:2px;border-top-left-radius:2px;border-top-right-radius:2px;}
.tnb-r-1phboty{border-bottom-style:solid;border-left-style:solid;border-right-style:solid;border-top-style:solid;}
.tnb-r-1udh08x{overflow-x:hidden;overflow-y:hidden;}
.tnb-r-4iw3lz{border-bottom-width:0;border-left-width:0;border-right-width:0;border-top-width:0;}
.tnb-r-4qtqp9{display:inline-block;}
.tnb-r-6koalj{display:flex;}
.tnb-r-bztko3{overflow-x:visible;overflow-y:visible;}
.tnb-r-crgep1{margin:0px;}
.tnb-r-hvic4v{display:none;}
.tnb-r-krxsd3{display:-webkit-box;}
.tnb-r-rs99b7{border-bottom-width:1px;border-left-width:1px;border-right-width:1px;border-top-width:1px;}
.tnb-r-sdzlij{border-bottom-left-radius:9999px;border-bottom-right-radius:9999px;border-top-left-radius:9999px;border-top-right-radius:9999px;}
.tnb-r-t60dpp{padding:0px;}
.tnb-r-wwvuq4{padding:0;}
.tnb-r-xoduu5{display:inline-flex;}
.tnb-r-ywje51{margin:auto;}
.tnb-r-z2wwpe{border-bottom-left-radius:4px;border-bottom-right-radius:4px;border-top-left-radius:4px;border-top-right-radius:4px;}
[stylesheet-group="2.1"]{}
.tnb-r-1559e4e{padding-bottom:2px;padding-top:2px;}
.tnb-r-1fkl15p{padding-left:32px;padding-right:32px;}
.tnb-r-3o4zer{padding-left:12px;padding-right:12px;}
.tnb-r-3pj75a{padding-left:16px;padding-right:16px;}
.tnb-r-cxgwc0{padding-left:24px;padding-right:24px;}
.tnb-r-dd0y9b{padding-bottom:20px;padding-top:20px;}
.tnb-r-dp7rxi{padding-bottom:40px;padding-top:40px;}
.tnb-r-f8sm7e{margin-left:auto;margin-right:auto;}
.tnb-r-n7gxbd{padding-left:4px;padding-right:4px;}
.tnb-r-s49dbf{margin-bottom:1px;margin-top:1px;}
.tnb-r-sjygvo{padding-left:1em;padding-right:1em;}
[stylesheet-group="2.2"]{}
.tnb-r-1ca1ndr{margin-left:0.5em;}
.tnb-r-1ez5h0i{margin-left:4px;}
.tnb-r-1gs4q39{margin-right:4px;}
.tnb-r-1kkk96v{margin-left:8px;}
.tnb-r-1kpi4qh{margin-left:0.075em;}
.tnb-r-1l2kgy{margin-right:0.5em;}
.tnb-r-1q6cnnd{right:-2px;}
.tnb-r-1wron08{margin-right:8px;}
.tnb-r-3t4u6i{margin-left:2px;}
.tnb-r-45ll9u{left:50%;}
.tnb-r-5f1w11{left:-2px;}
.tnb-r-k4bwe5{margin-right:0.075em;}
.tnb-r-o59np7{padding-right:8px;}
.tnb-r-ocobd0{right:50%;}
.tnb-r-qjj4hq{padding-left:8px;}
.tnb-r-x1x4zq{margin-right:2px;}
[stylesheet-group="3"]{}
.tnb-r-105ug2t{pointer-events:auto!important;}
.tnb-r-109y4c4{height:1px;}
.tnb-r-10ptun7{height:16px;}
.tnb-r-10v3vxq{transform:scaleX(-1);}
.tnb-r-117bsoe{margin-bottom:20px;}
.tnb-r-11c0sde{margin-top:24px;}
.tnb-r-11j9u27{visibility:hidden;}
.tnb-r-12181gd{box-shadow:0 0 2px rgba(0,0,0,0.03) inset;}
.tnb-r-12sks89{min-height:22px;}
.tnb-r-12vffkv>*{pointer-events:auto;}
.tnb-r-12vffkv{pointer-events:none!important;}
.tnb-r-12ym1je{width:18px;}
.tnb-r-135wba7{line-height:24px;}
.tnb-r-13qz1uu{width:100%;}
.tnb-r-13wfysu{-webkit-text-decoration-line:none;text-decoration-line:none;}
.tnb-r-146iojx{max-width:300px;}
.tnb-r-1472mwg{height:24px;}
.tnb-r-14j79pv{color:rgba(83,100,113,1.00);}
.tnb-r-14lw9ot{background-color:rgba(255,255,255,1.00);}
.tnb-r-15ysp7h{min-height:32px;}
.tnb-r-16dba41{font-weight:400;}
.tnb-r-16y2uox{flex-grow:1;}
.tnb-r-176fswd{transform:translateX(-50%) translateY(-50%);}
.tnb-r-1777fci{justify-content:center;}
.tnb-r-17bb2tj{animation-duration:0.75s;}
.tnb-r-17leim2{background-repeat:repeat;}
.tnb-r-17s6mgv{justify-content:flex-end;}
.tnb-r-18jsvk2{color:rgba(15,20,25,1.00);}
.tnb-r-18tzken{width:56px;}
.tnb-r-18u37iz{flex-direction:row;}
.tnb-r-18yzcnr{height:22px;}
.tnb-r-19wmn03{width:20px;}
.tnb-r-19yznuf{min-height:52px;}
.tnb-r-1abnn5w{animation-play-state:paused;}
.tnb-r-1acpoxo{width:36px;}
.tnb-r-1ad0z5i{word-break:break-all;}
.tnb-r-1awozwy{align-items:center;}
.tnb-r-1b43r93{font-size:14px;}
.tnb-r-1b91i6u{max-width:752px;}
.tnb-r-1blnp2b{width:72px;}
.tnb-r-1blvdjr{font-size:23px;}
.tnb-r-1ceczpf{min-height:24px;}
.tnb-r-1cwl3u0{line-height:16px;}
.tnb-r-1d2f490{left:0px;}
.tnb-r-1ddef8g{-webkit-text-decoration-line:underline;text-decoration-line:underline;}
.tnb-r-1ebb2ja{list-style:none;}
.tnb-r-1ff274t{text-align:right;}
.tnb-r-1gkfh8e{font-size:11px;}
.tnb-r-1h0z5md{justify-content:flex-start;}
.tnb-r-1h8ys4a{padding-top:4px;}
.tnb-r-1hjwoze{height:18px;}
.tnb-r-1iln25a{word-wrap:normal;}
.tnb-r-1inkyih{font-size:17px;}
.tnb-r-1ipicw7{width:300px;}
.tnb-r-1iusvr4{flex-basis:0px;}
.tnb-r-1janqcz{width:16px;}
.tnb-r-1jaylin{width:-webkit-max-content;width:-moz-max-content;width:max-content;}
.tnb-r-1k78y06{font-family:Tahoma, Arial, sans-serif;}
.tnb-r-1kihuf0{align-self:center;}
.tnb-r-1ldzwu0{animation-timing-function:linear;}
.tnb-r-1loqt21{cursor:pointer;}
.tnb-r-1mlwlqe{flex-basis:auto;}
.tnb-r-1mrlafo{background-position:0;}
.tnb-r-1muvv40{animation-iteration-count:infinite;}
.tnb-r-1mwlp6a{height:56px;}
.tnb-r-1nao33i{color:rgba(231,233,234,1.00);}
.tnb-r-1niwhzg{background-color:rgba(0,0,0,0.00);}
.tnb-r-1ny4l3l{outline-style:none;}
.tnb-r-1oifz5y{background-color:rgba(170,17,0,1.00);}
.tnb-r-1oszu61{align-items:stretch;}
.tnb-r-1otgn73{touch-action:manipulation;}
.tnb-r-1p0dtai{bottom:0px;}
.tnb-r-1pi2tsx{height:100%;}
.tnb-r-1ps3wis{min-width:44px;}
.tnb-r-1qd0xha{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
.tnb-r-1qi8awa{min-width:36px;}
.tnb-r-1r5jyh0{min-height:130px;}
.tnb-r-1r8g8re{height:36px;}
.tnb-r-1s2hp8q{min-height:26px;}
.tnb-r-1sxrcry{background-size:auto;}
.tnb-r-1tl8opc{font-family:"Segoe UI",Meiryo,system-ui,-apple-system,BlinkMacSystemFont,sans-serif;}
.tnb-r-1to6hqq{background-color:rgba(255,212,0,1.00);}
.tnb-r-1ttztb7{text-align:inherit;}
.tnb-r-1udbk01{text-overflow:ellipsis;}
.tnb-r-1v2oles{top:50%;}
.tnb-r-1vmecro{direction:rtl;}
.tnb-r-1vr29t4{font-weight:800;}
.tnb-r-1wb8bfx{text-decoration-thickness:2px;}
.tnb-r-1wbh5a2{flex-shrink:1;}
.tnb-r-1wyyakw{z-index:-1;}
.tnb-r-1xcajam{position:fixed;}
.tnb-r-1xk2f4g{clip:rect(1px, 1px, 1px, 1px);}
.tnb-r-1xnzce8{-moz-user-select:text;-webkit-user-select:text;user-select:text;}
.tnb-r-1xvli5t{height:1.25em;}
.tnb-r-1y7e96w{min-width:22px;}
.tnb-r-1ye8kvj{max-width:600px;}
.tnb-r-1yef0xd{animation-name:r-11cv4x;}
.tnb-r-1yjpyg1{font-size:31px;}
.tnb-r-1ykxob0{top:60%;}
.tnb-r-2o02ov{margin-top:40px;}
.tnb-r-2tavb8{background-color:rgba(0,0,0,0.60);}
.tnb-r-2yi16{min-height:36px;}
.tnb-r-36ujnk{font-style:italic;}
.tnb-r-37tt59{line-height:32px;}
.tnb-r-3s2u2q{white-space:nowrap;}
.tnb-r-417010{z-index:0;}
.tnb-r-4gszlv{background-size:cover;}
.tnb-r-4wgw6l{min-width:32px;}
.tnb-r-54znze{color:rgba(239,243,244,1.00);}
.tnb-r-56xrmm{line-height:12px;}
.tnb-r-633pao{pointer-events:none!important;}
.tnb-r-6416eg{-moz-transition-property:background-color, box-shadow;-webkit-transition-property:background-color, box-shadow;transition-property:background-color, box-shadow;}
.tnb-r-64el8z{min-width:52px;}
.tnb-r-7q8q6z{cursor:default;}
.tnb-r-8akbws{-webkit-box-orient:vertical;}
.tnb-r-8jfcpp{top:-2px;}
.tnb-r-92ng3h{width:1px;}
.tnb-r-a023e6{font-size:15px;}
.tnb-r-adyw6z{font-size:20px;}
.tnb-r-ah5dr5>*{pointer-events:none;}
.tnb-r-ah5dr5{pointer-events:auto!important;}
.tnb-r-aqfbo4{backface-visibility:hidden;}
.tnb-r-b88u0q{font-weight:700;}
.tnb-r-bcqeeo{min-width:0px;}
.tnb-r-bnwqim{position:relative;}
.tnb-r-bt1l66{min-height:20px;}
.tnb-r-bvlit7{margin-bottom:-12px;}
.tnb-r-deolkf{box-sizing:border-box;}
.tnb-r-dflpy8{height:1.2em;}
.tnb-r-dnmrzs{max-width:100%;}
.tnb-r-ehq7j7{background-size:contain;}
.tnb-r-emqnss{transform:translateZ(0px);}
.tnb-r-eqz5dr{flex-direction:column;}
.tnb-r-ero68b{min-height:40px;}
.tnb-r-fdjqy7{text-align:left;}
.tnb-r-fm7h5w{font-family:"TwitterChirpExtendedHeavy","Verdana",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
.tnb-r-h9hxbl{width:1.2em;}
.tnb-r-icoktb{opacity:0.5;}
.tnb-r-ifefl9{min-height:0px;}
.tnb-r-impgnl{transform:translateX(50%) translateY(-50%);}
.tnb-r-iphfwy{padding-bottom:4px;}
.tnb-r-ipm5af{top:0px;}
.tnb-r-jmul1s{transform:scale(1.1);}
.tnb-r-jwli3a{color:rgba(255,255,255,1.00);}
.tnb-r-kemksi{background-color:rgba(0,0,0,1.00);}
.tnb-r-lp5zef{min-width:24px;}
.tnb-r-lrsllp{width:24px;}
.tnb-r-lrvibr{-moz-user-select:none;-webkit-user-select:none;user-select:none;}
.tnb-r-m6rgpd{vertical-align:text-bottom;}
.tnb-r-majxgm{font-weight:500;}
.tnb-r-n6v787{font-size:13px;}
.tnb-r-nwxazl{line-height:40px;}
.tnb-r-o7ynqc{transition-duration:0.2s;}
.tnb-r-peo1c{min-height:44px;}
.tnb-r-poiln3{font-family:inherit;}
.tnb-r-pp5qcn{vertical-align:-20%;}
.tnb-r-q4m81j{text-align:center;}
.tnb-r-qlhcfr{font-size:0.001px;}
.tnb-r-qvk6io{line-height:0px;}
.tnb-r-qvutc0{word-wrap:break-word;}
.tnb-r-rjixqe{line-height:20px;}
.tnb-r-rki7wi{bottom:12px;}
.tnb-r-sb58tz{max-width:1000px;}
.tnb-r-tjvw6i{text-decoration-thickness:1px;}
.tnb-r-u6sd8q{background-repeat:no-repeat;}
.tnb-r-u8s1d{position:absolute;}
.tnb-r-ueyrd6{line-height:36px;}
.tnb-r-uho16t{font-size:34px;}
.tnb-r-vkv6oe{min-width:40px;}
.tnb-r-vlxjld{color:rgba(247,249,249,1.00);}
.tnb-r-vqxq0j{border:0 solid black;}
.tnb-r-vrz42v{line-height:28px;}
.tnb-r-vvn4in{background-position:center;}
.tnb-r-wy61xf{height:72px;}
.tnb-r-x3cy2q{background-size:100% 100%;}
.tnb-r-x572qd{background-color:rgba(247,249,249,1.00);}
.tnb-r-xigjrr{-webkit-filter:blur(4px);filter:blur(4px);}
.tnb-r-yc9v9c{width:22px;}
.tnb-r-yfoy6g{background-color:rgba(21,32,43,1.00);}
.tnb-r-yy2aun{font-size:26px;}
.tnb-r-yyyyoo{fill:currentcolor;}
.tnb-r-z7pwl0{max-width:700px;}
.tnb-r-z80fyv{height:20px;}
.tnb-r-zchlnj{right:0px;}
@-webkit-keyframes tnb-r-11cv4x{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
@keyframes tnb-r-11cv4x{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}
.tnb-r-24i0{position:absolute;visibility:hidden;top:0;width:50px;pointer-events:none}
.tnb-r-24i0.loaded{visibility:visible;top:50vh;width:50px}
/*なかったので追加*/
.tnb-r-1s2bzr4{margin-top:12px;}
.tnb-r-9aw3ui{gap:4px;}
			`.replace(/^[\ |	]+/, '');
			document.head.appendChild(style);
		}
	}

	class TwitterApi{
		/*
		不具合は https://greasyfork.org/ja/scripts/478248/feedback または https://github.com/Happy-come-come/UserScripts/issues まで
		とはいえ、他人が使うことは想定していないのでなんかおかしくても知りません(は？)


		GM_addElementが有効だとiflame内のscriptがcspに引っかからないのでできればGM_addElementを使うことを推奨
		あ、もうこれいらないです(GM_addElement)。

			Twitter Web API(GraphQL)
			オブジェクト
				- tweetsData: ツイートのデータ
					{id_str: { ... }}
				- tweetsUserData: ツイートのユーザーデータ(id_strがkeyになっている)
					{userId: { ... }}
				- tweetsUserDataByUserName: ツイートのユーザーデータ(screenNameがkeyになっている)
					{screenName: { ... }}
				- lists: ユーザーのリスト(screenNameがkeyになっている)
				- timelines: タイムラインのデータ
			メソッド
			asyncなので、await必須
				- getTweet(tweetId, refresh = false)
					refresh: true の場合はキャッシュを無視して再取得
				- getUser(screenName, refresh = false)
					refresh: true の場合はキャッシュを無視して再取得
				- getHomeTimeline(place = 'bottom')
					place: bottom,top,refresh
					フォロー欄
				- getForYouTimeline(place = 'bottom')
					place: bottom,top,refresh
					おすすめ欄
				- getUserTweets(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのツイートを取得する
				- getUserTweetsAndReplies(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのツイートとリプライを取得する
				- getUserHighlights(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのハイライトを取得する
				- getUserMedia(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのメディア欄を取得する
				- getUserLikes(screenName, place = 'bottom')
					place: bottom,top,refresh
					ユーザーのいいねを取得する
					今は自分のいいね欄しか取得できないが、将来的に他のユーザーのいいね欄も取得できるようになったときのためユーザの指定ができるようにしている
				- getOwnLists(place = 'bottom')
					place: bottom,top,refresh
					自分のリストを取得する
					getUserListでは非公開のリストが取得できないため、自身のリストを取得する場合はこのメソッドを使用する
				- getUserLists(screenName)
					ユーザーのリストを取得する
				- getListTimeline(listId, place = 'bottom')
					place: bottom,top,refresh
					リストのタイムラインを取得する
				- favoriteTweet(tweetId)
					引数の tweetId のツイートをいいねする
				- unfavoriteTweet(tweetId)
					引数の tweetId のツイートのいいねを解除する
				- retweet(tweetId)
					引数の tweetId のツイートをリツイートする
				- deleteRetweet(tweetId)
					引数の tweetId のツイートのリツイートを解除する
				- bookmark(tweetId)
					引数の tweetId のツイートをブックマークする
				- deleteBookmark(tweetId)
					引数の tweetId のツイートのブックマークを解除する
		*/
		#challengeData;
		#graphqlApiUri;
		#oldApiUri;
		#graphqlApiEndpoints;
		#oldApiEndpoints;
		#endpointsAliases;
		#requestHeadersTemplate;
		#graphqlFeatures;
		#challengeDataPromise = null;
		#initPromise;
		#RateLimitExceeded = "Rate limit exceeded";
		#transactionIdSolver;
		#resetTransactionIdSolverTimes = 0;
		#pendingTweetRequests = {};
		#pendingUserRequests = {};
		#pendingTLRequests = {};
		#pendingOldApiRequests = {};
		#apiRateLimit = {};
		#classSettings = {};
		tweetsData = {};
		tweetsUserData = {};
		tweetsUserDataByUserName = {};
		lists = {};
		timelines = {
			following: {
				...this.#defaultTimelineData()
			},
			forYou: {
				...this.#defaultTimelineData()
			},
			bookmarks: {
				...this.#defaultTimelineData()
			},
			userMedia: {},
			userTweets: {},
			userTweetsAndReplies: {},
			userHighlights: {},
			userLikes: {},
			ownLists: {
				...this.#defaultTimelineData(), pinningLists: {},
			},
			userLists: {},
			lists: {},
		};

		constructor(){
			this.#graphqlApiUri = `https://${window.location.hostname}/i/api/graphql`;
			this.#graphqlApiEndpoints = {
				TweetDetail: {
					method: ['GET'],
					uri: '/b9Yw90FMr_zUb8DvA8r2ug/TweetDetail',
				},
				UserTweets: {
					method: ['GET'],
					uri: '/M3Hpkrb8pjWkEuGdLeXMOA/UserTweets',
				},
				UserByScreenName: {
					method: ['GET'],
					uri: '/32pL5BWe9WKeSK1MoPvFQQ/UserByScreenName',
				},
				useFetchProfileBlocks_profileExistsQuery: {
					method: ['GET'],
					uri: '/Z2BA99jFw6TxaJM5v7Irmg/useFetchProfileBlocks_profileExistsQuery',
				},
				useFetchProfileSections_profileQuery: {
					method: ['GET'],
					uri: '/2ocjpx85ORO5fM06u75eCA/useFetchProfileSections_profileQuery',
				},
				UserMedia: {
					method: ['GET'],
					uri: '/8B9DqlaGvYyOvTCzzZWtNA/UserMedia',
				},
				Likes: {
					method: ['GET'],
					uri: '/uxjTlmrTI61zreSIV1urbw/Likes',
				},
				HomeLatestTimeline: {
					method: ['GET', 'POST'],
					uri: '/nMyTQqsJiUGBKLGNSQamAA/HomeLatestTimeline',
				},
				HomeTimeline: {
					method: ['GET', 'POST'],
					uri: '/ci_OQZ2k0rG0Ax_lXRiWVA/HomeTimeline',
				},
				UserTweetsAndReplies: {
					method: ['GET'],
					uri: '/pz0IHaV_t7T4HJavqqqcIA/UserTweetsAndReplies',
				},
				UserHighlightsTweets: {
					method: ['GET'],
					uri: '/y0aDPjeWFCpvY3GOmGXKhQ/UserHighlightsTweets',
				},
				BookmarksTimeline: {
					method: ['GET'],
					uri: '/ztCdjqsvvdL0dE8R5ME0hQ/Bookmarks',
				},
				ListLatestTweetsTimeline: {
					method: ['GET'],
					uri: '/LSefrrxhpeX8HITbKfWz9g/ListLatestTweetsTimeline',
				},
				ListsManagementPageTimeline: {
					method: ['GET'],
					uri: '/v06PoBzewJgqo_MliVawtg/ListsManagementPageTimeline',
				},
				CombinedLists: {
					method: ['GET'],
					uri: '/rh2fe0BAORm919U9jhyoQw/CombinedLists',
				},
				// actions
				FavoriteTweet: {
					method: ['POST'],
					uri: '/lI07N6Otwv1PhnEgXILM7A/FavoriteTweet',
				},
				UnfavoriteTweet: {
					method: ['POST'],
					uri: '/ZYKSe-w7KEslx3JhSIk5LA/UnfavoriteTweet',
				},
				CreateRetweet: {
					method: ['POST'],
					uri: '/ojPdsZsimiJrUGLR1sjUtA/CreateRetweet',
				},
				DeleteRetweet: {
					method: ['POST'],
					uri: '/iQtK4dl5hBmXewYZuEOKVw/DeleteRetweet',
				},
				CreateBookmark: {
					method: ['POST'],
					uri: '/aoDbu3RHznuiSkQ9aNM67Q/CreateBookmark',
				},
				DeleteBookmark: {
					method: ['POST'],
					uri: '/Wlmlj2-xzyS1GN3a6cj-mQ/DeleteBookmark',
				},
			};
			this.#endpointsAliases = {
				favorite: 'FavoriteTweet',
				unfavorite: 'UnfavoriteTweet',
				retweet: 'CreateRetweet',
				deleteRetweet: 'DeleteRetweet',
				bookmark: 'CreateBookmark',
				deleteBookmark: 'DeleteBookmark',
			};
			this.#oldApiUri = `https://${window.location.hostname}/i/api/1.1`;
			this.#oldApiEndpoints = {
				account: {
					"settings.json": {
						method: ['GET'],
						uri: '/account/settings.json',
					}
				}
			};
			this.#challengeData = {verificationCode: null, challengeCode: null, challengeJsCode: null, challengeAnimationSvgCodes: [], expires: null};
			this.#apiRateLimit = Object.keys(this.#graphqlApiEndpoints).reduce((acc, key) => {
				acc[key] = {remaining: null, limit: null, reset: null};
				return acc;
			}, {});
			this.#requestHeadersTemplate = {
				'Content-Type': 'application/json',
				'User-agent': userAgent || navigator.userAgent || navigator.vendor || window.opera,
				'accept': '*/*',
				'Accept-Encoding': 'zstd, br, gzip, deflate',
				'Origin': `https://${window.location.hostname}`,
				'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
				'x-csrf-token': getCookie("ct0"),
				'x-twitter-auth-type': 'OAuth2Session',
				'x-twitter-client-language': sessionData?.userData?.language || 'ja',
				'x-twitter-active-user': 'yes',
				'Sec-Fetch-Site': 'same-origin',
				'Sec-Fetch-Mode': 'navigate',
			};
			this.#graphqlFeatures = {
				"rweb_video_screen_enabled": false,
				"profile_label_improvements_pcf_label_in_post_enabled": true,
				"rweb_tipjar_consumption_enabled": true,
				"responsive_web_graphql_exclude_directive_enabled": true,
				"verified_phone_label_enabled": false,
				"creator_subscriptions_tweet_preview_api_enabled": true,
				"responsive_web_graphql_timeline_navigation_enabled": true,
				"responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
				"premium_content_api_read_enabled": false,
				"communities_web_enable_tweet_community_results_fetch": true,
				"c9s_tweet_anatomy_moderator_badge_enabled": true,
				"responsive_web_grok_analyze_button_fetch_trends_enabled": false,
				"responsive_web_grok_analyze_post_followups_enabled": true,
				"responsive_web_jetfuel_frame": false,
				"responsive_web_grok_share_attachment_enabled": true,
				"articles_preview_enabled": true,
				"responsive_web_edit_tweet_api_enabled": true,
				"graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
				"view_counts_everywhere_api_enabled": true,
				"longform_notetweets_consumption_enabled": true,
				"responsive_web_twitter_article_tweet_consumption_enabled": true,
				"tweet_awards_web_tipping_enabled": false,
				"responsive_web_grok_show_grok_translated_post": false,
				"responsive_web_grok_analysis_button_from_backend": false,
				"creator_subscriptions_quote_tweet_preview_enabled": false,
				"freedom_of_speech_not_reach_fetch_enabled": true,
				"standardized_nudges_misinfo": true,
				"tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
				"longform_notetweets_rich_text_read_enabled": true,
				"longform_notetweets_inline_media_enabled": true,
				"responsive_web_grok_image_annotation_enabled": true,
				"responsive_web_enhance_cards_enabled": false
			};
			this.#initPromise = this.#twitterApiInit();
		}

		async favoriteTweet(tweetId){
			if(this.#apiRateLimit.FavoriteTweet.remaining === 0 && this.#apiRateLimit.FavoriteTweet.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] FavoriteTweet API rate limit exceeded", resetDate: this.#apiRateLimit.FavoriteTweet.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('favorite', tweetId);
		}
		async unfavoriteTweet(tweetId){
			if(this.#apiRateLimit.UnfavoriteTweet.remaining === 0 && this.#apiRateLimit.UnfavoriteTweet.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UnfavoriteTweet API rate limit exceeded", resetDate: this.#apiRateLimit.UnfavoriteTweet.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('unfavorite', tweetId);
		}
		async retweet(tweetId){
			if(this.#apiRateLimit.CreateRetweet.remaining === 0 && this.#apiRateLimit.CreateRetweet.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] CreateRetweet API rate limit exceeded", resetDate: this.#apiRateLimit.CreateRetweet.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('retweet', tweetId);
		}
		async deleteRetweet(tweetId){
			if(this.#apiRateLimit.DeleteRetweet.remaining === 0 && this.#apiRateLimit.DeleteRetweet.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] DeleteRetweet API rate limit exceeded", resetDate: this.#apiRateLimit.DeleteRetweet.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('deleteRetweet', tweetId);
		}
		async bookmark(tweetId){
			if(this.#apiRateLimit.CreateBookmark.remaining === 0 && this.#apiRateLimit.CreateBookmark.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] CreateBookmark API rate limit exceeded", resetDate: this.#apiRateLimit.CreateBookmark.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('bookmark', tweetId);
		}
		async deleteBookmark(tweetId){
			if(this.#apiRateLimit.DeleteBookmark.remaining === 0 && this.#apiRateLimit.DeleteBookmark.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] DeleteBookmark API rate limit exceeded", resetDate: this.#apiRateLimit.DeleteBookmark.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			return await this.tweetAction('deleteBookmark', tweetId);
		}
		// 同時に同じツイートを取得しないようにする
		async getTweet(tweetId, refresh = false){
			if(this.tweetsData[tweetId] && !refresh)return {...this.tweetsData[tweetId], apiRateLimit: this.#apiRateLimit.TweetDetail};

			if(this.#pendingTweetRequests[tweetId]){
				return await this.#pendingTweetRequests[tweetId];
			}
			if(this.#apiRateLimit.TweetDetail.remaining === 0 && this.#apiRateLimit.TweetDetail.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] TweetDetail API rate limit exceeded", resetDate: this.#apiRateLimit.TweetDetail.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}

			this.#pendingTweetRequests[tweetId] = this.#_getTweet(tweetId, refresh);
			try{
				const result = await this.#pendingTweetRequests[tweetId];
				return result;
			}finally{
				delete this.#pendingTweetRequests[tweetId];
			}
		}

		async #_getTweet(tweetId, refresh = false){
			if(this.tweetsData[tweetId] && !refresh){
				return this.tweetsData[tweetId];
			}
			const variables = {
				"focalTweetId": tweetId,
				"referrer": "tweet",
				"with_rux_injections": false,
				"rankingMode": "Relevance",
				"includePromotedContent": true,
				"withCommunity": true,
				"withQuickPromoteEligibilityTweetFields": true,
				"withBirdwatchNotes": true,
				"withVoice": true
			};
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticleRichContentState": true,
				"withArticlePlainText": false,
				"withGrokAnalyze": false,
				"withDisallowedReplyControls": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.TweetDetail.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.TweetDetail.uri, 'GET');
			const instructions = response.response.data.threaded_conversation_with_injections_v2.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			this.#processgraphQL(TimelineAddEntries.entries);
			return {...this.tweetsData[tweetId], apiRateLimit: this.#apiRateLimit.TweetDetail};
		}
		async getUser(screenName, refresh = false){
			if(this.tweetsUserDataByUserName[screenName] && !refresh){
				return {...this.tweetsUserDataByUserName[screenName], apiRateLimit: this.#apiRateLimit.UserByScreenName};
			}
			if(this.#pendingUserRequests[screenName]){
				return await this.#pendingUserRequests[screenName];
			}
			if(this.#apiRateLimit.UserByScreenName.remaining === 0 && this.#apiRateLimit.UserByScreenName.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserByScreenName API rate limit exceeded", resetDate: this.#apiRateLimit.UserByScreenName.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			this.#pendingUserRequests[screenName] = this.#_getUser(screenName);
			try{
				const result = await this.#pendingUserRequests[screenName];
				return result;
			}finally{
				delete this.#pendingUserRequests[screenName];
			}
		}
		async #_getUser(screenName, refresh = false){
			if(this.tweetsUserDataByUserName[screenName] && !refresh){
				return this.tweetsUserDataByUserName[screenName];
			}
			const variables = {"screen_name": screenName};
			const features = {
				"hidden_profile_subscriptions_enabled": true,
				"profile_label_improvements_pcf_label_in_post_enabled": true,
				"rweb_tipjar_consumption_enabled": true,
				"responsive_web_graphql_exclude_directive_enabled": true,
				"verified_phone_label_enabled": false,
				"subscriptions_verification_info_is_identity_verified_enabled": true,
				"subscriptions_verification_info_verified_since_enabled": true,
				"highlights_tweets_tab_ui_enabled": true,
				"responsive_web_twitter_article_notes_tab_enabled": true,
				"subscriptions_feature_can_gift_premium": true,
				"creator_subscriptions_tweet_preview_api_enabled": true,
				"responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
				"responsive_web_graphql_timeline_navigation_enabled": true
			};
			const fieldToggles = {"withAuxiliaryUserLabels": false};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserByScreenName.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserByScreenName.uri, 'GET');
			const userData = response.response.data.user.result;
			if(!userData)return null;
			this.tweetsUserData[userData.rest_id] = { ...userData, API_type: "graphQL" };
			this.tweetsUserDataByUserName[userData.legacy.screen_name] = this.tweetsUserData[userData.rest_id];
			try{
				await this.getBio(screenName);
			}catch(error){}
			return {...this.tweetsUserData[userData.rest_id], apiRateLimit: this.#apiRateLimit.UserByScreenName};
		}

		async getHomeTimeline(place = 'bottom'){
			if(this.#pendingTLRequests.following){
				return await this.#pendingTLRequests.following;
			}
			if(this.#apiRateLimit.HomeLatestTimeline.remaining === 0 && this.#apiRateLimit.HomeLatestTimeline.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] HomeLatestTimeline API rate limit exceeded", resetDate: this.#apiRateLimit.HomeLatestTimeline.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			this.#pendingTLRequests.following = this.#_getHomeTimeline(place);
			try{
				const result = await this.#pendingTLRequests.following;
				return result;
			}finally{
				delete this.#pendingTLRequests.following;
			}
		}

		async #_getHomeTimeline(place){
			const variables = {
				"count": 40,
				"includePromotedContent": false,
				"latestControlAvailable": true,
			};
			const cursor = this.#_getCursor('following', place);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.HomeLatestTimeline.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.HomeLatestTimeline.uri, 'GET')
			const instructions = response.response.data.home.home_timeline_urt.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'following', place: place})), apiRateLimit: this.#apiRateLimit.HomeLatestTimeline};
		}

		async getForYouTimeline(place = 'bottom'){
			if(this.#pendingTLRequests.forYou){
				return await this.#pendingTLRequests.forYou;
			}
			if(this.#apiRateLimit.HomeTimeline.remaining === 0 && this.#apiRateLimit.HomeTimeline.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] HomeTimeline API rate limit exceeded", resetDate: this.#apiRateLimit.HomeTimeline.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			this.#pendingTLRequests.forYou = this.#_getForYouTimeline(place);
			try{
				const result = await this.#pendingTLRequests.forYou;
				return result;
			}finally{
				delete this.#pendingTLRequests.forYou;
			}
		}

		async #_getForYouTimeline(place){
			const variables = {
				"count": 40,
				"includePromotedContent": false,
				"latestControlAvailable": true,
			};
			const cursor = this.#_getCursor('forYou', place);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.HomeTimeline.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.HomeTimeline.uri, 'GET');
			const instructions = response.response.data.home.home_timeline_urt.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'forYou', place: place})), apiRateLimit: this.#apiRateLimit.HomeTimeline};
		}

		async getUserTweets(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userTweets?.[screenName]){
				return await this.#pendingTLRequests.userTweets?.[screenName];
			}
			if(this.#apiRateLimit.UserTweets.remaining === 0 && this.#apiRateLimit.UserTweets.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserTweets API rate limit exceeded", resetDate: this.#apiRateLimit.UserTweets.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userTweets)this.#pendingTLRequests.userTweets = {};
			if(!this.timelines.userTweets[screenName])this.timelines.userTweets[screenName] = {};
			this.#pendingTLRequests.userTweets[screenName] = this.#_getUserTweets(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userTweets?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userTweets?.[screenName];
			}
		}

		async #_getUserTweets(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withQuickPromoteEligibilityTweetFields": true,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userTweets', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserTweets.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserTweets.uri, 'GET');
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const TimelinePinEntry = instructions.find(element => element.type === 'TimelinePinEntry')?.entrie;
			if(TimelinePinEntry)this.#processgraphQL(TimelinePinEntry);
			const timelineData = (instructions[0]?.moduleItems || [])
				.concat(TimelineAddEntries.entries[0]?.content?.items || [])
				.concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userTweets', place: place, screenName: screenName})), apiRateLimit: this.#apiRateLimit.UserTweets};
		}

		async getUserTweetsAndReplies(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userTweetsAndReplies?.[screenName]){
				return await this.#pendingTLRequests.userTweetsAndReplies?.[screenName];
			}
			if(this.#apiRateLimit.UserTweetsAndReplies.remaining === 0 && this.#apiRateLimit.UserTweetsAndReplies.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserTweetsAndReplies API rate limit exceeded", resetDate: this.#apiRateLimit.UserTweetsAndReplies.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userTweetsAndReplies)this.#pendingTLRequests.userTweetsAndReplies = {};
			if(!this.timelines.userTweetsAndReplies[screenName])this.timelines.userTweetsAndReplies[screenName] = {};
			this.#pendingTLRequests.userTweetsAndReplies[screenName] = this.#_getUserTweetsAndReplies(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userTweetsAndReplies?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userTweetsAndReplies?.[screenName];
			}
		}

		async #_getUserTweetsAndReplies(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withQuickPromoteEligibilityTweetFields": true,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userTweetsAndReplies', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserTweetsAndReplies.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserTweetsAndReplies.uri, 'GET');
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const TimelinePinEntry = instructions.find(element => element.type === 'TimelinePinEntry')?.entrie;
			if(TimelinePinEntry)this.#processgraphQL(TimelinePinEntry);
			const timelineData = (instructions[0]?.moduleItems || [])
				.concat(TimelineAddEntries.entries[0]?.content?.items || [])
				.concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userTweetsAndReplies', place: place, screenName: screenName})), apiRateLimit: this.#apiRateLimit.UserTweetsAndReplies};
		}

		async getUserHighlights(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userHighlights?.[screenName]){
				return await this.#pendingTLRequests.userHighlights?.[screenName];
			}
			if(this.#apiRateLimit.UserHighlightsTweets.remaining === 0 && this.#apiRateLimit.UserHighlightsTweets.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserHighlightsTweets API rate limit exceeded", resetDate: this.#apiRateLimit.UserHighlightsTweets.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userHighlights)this.#pendingTLRequests.userHighlights = {};
			if(!this.timelines.userHighlights[screenName])this.timelines.userHighlights[screenName] = {};
			this.#pendingTLRequests.userHighlights[screenName] = this.#_getUserHighlights(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userHighlights?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userHighlights?.[screenName];
			}
		}

		async #_getUserHighlights(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withQuickPromoteEligibilityTweetFields": true,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userHighlights', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserHighlights.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserHighlightsTweets.uri);
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userHighlights', place: place, screenName: screenName})), apiRateLimit: this.#apiRateLimit.UserHighlightsTweets};
		}

		async getUserMedia(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userMedia?.[screenName]){
				return await this.#pendingTLRequests.userMedia?.[screenName];
			}
			if(this.#apiRateLimit.UserMedia.remaining === 0 && this.#apiRateLimit.UserMedia.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserMedia API rate limit exceeded", resetDate: this.#apiRateLimit.UserMedia.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userMedia)this.#pendingTLRequests.userMedia = {};
			if(!this.timelines.userMedia[screenName])this.timelines.userMedia[screenName] = {};
			this.#pendingTLRequests.userMedia[screenName] = this.#_getUserMedia(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userMedia?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userMedia?.[screenName];
			}
		}
		// place: bottom,top,refresh
		async #_getUserMedia(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withClientEventToken": false,
				"withBirdwatchNotes": false,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userMedia', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.UserMedia.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.UserMedia.uri);
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userMedia', screenName: screenName})), apiRateLimit: this.#apiRateLimit.UserMedia};
		}

		async getUserLikes(screenName, place = 'bottom'){
			if(this.#pendingTLRequests.userLikes?.[screenName]){
				return await this.#pendingTLRequests.userLikes?.[screenName];
			}
			if(this.#apiRateLimit.Likes.remaining === 0 && this.#apiRateLimit.Likes.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] Likes API rate limit exceeded", resetDate: this.#apiRateLimit.Likes.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.userLikes)this.#pendingTLRequests.userLikes = {};
			if(!this.timelines.userLikes[screenName])this.timelines.userLikes[screenName] = {};
			this.#pendingTLRequests.userLikes[screenName] = this.#_getUserLikes(screenName, place);
			try{
				const result = await this.#pendingTLRequests.userLikes?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.userLikes?.[screenName];
			}
		}

		async #_getUserLikes(screenName, place = 'bottom'){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 20,
				"includePromotedContent": false,
				"withClientEventToken": false,
				"withBirdwatchNotes": false,
				"withVoice": true
			};
			const cursor = this.#_getCursor('userLikes', place, screenName);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const fieldToggles = {
				"withArticlePlainText": false
			};
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.Likes.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.Likes.uri);
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'userLikes', place: place, screenName: screenName})), apiRateLimit: this.#apiRateLimit.Likes};
		}

		async getOwnLists(place = 'bottom'){
			if(this.#pendingTLRequests.ownLists){
				return await this.#pendingTLRequests.ownLists;
			}
			if(this.#apiRateLimit.ListsManagementPageTimeline.remaining === 0 && this.#apiRateLimit.ListsManagementPageTimeline.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] ListsManagementPageTimeline API rate limit exceeded", resetDate: this.#apiRateLimit.ListsManagementPageTimeline.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.ownLists)this.#pendingTLRequests.ownLists = {};
			this.#pendingTLRequests.ownLists = this.#_getOwnLists(place);
			try{
				const result = await this.#pendingTLRequests.ownLists;
				return result;
			}finally{
				delete this.#pendingTLRequests.ownLists;
			}
		}

		async #_getOwnLists(place){
			const variables = {"count":100};
			const cursor = this.#_getCursor('ownLists', place);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.ListsManagementPageTimeline.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}`,
				method: 'GET',
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.ListsManagementPageTimeline.uri);
			const instructions = response.response.data.user.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			await this.#processTimeline({entries: timelineData, type: 'ownLists', place: place});
			const lists = {};
			Object.keys(this.timelines.ownLists).forEach(key => {
				const list = this.timelines.ownLists[key];
				lists[list.id_str] = {
					id: list.id,
					id_str: list.id_str,
					name: list.name,
					description: list.description,
					mode: list.mode,
				};
			});
			this.lists.ownLists = {...this.lists.ownLists, ...lists};
			return {...this.lists.ownLists, apiRateLimit: this.#apiRateLimit.ListsManagementPageTimeline};
		}

		async getUserLists(screenName){
			if(this.#pendingTLRequests.lists?.[screenName]){
				return await this.#pendingTLRequests.lists?.[screenName];
			}
			if(this.#apiRateLimit.UserLists.remaining === 0 && this.#apiRateLimit.UserLists.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] UserLists API rate limit exceeded", resetDate: this.#apiRateLimit.UserLists.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.lists)this.#pendingTLRequests.lists = {};
			if(!this.timelines.userLists[screenName])this.timelines.userLists[screenName] = {};
			this.#pendingTLRequests.lists[screenName] = this.#_getUserLists(screenName);
			try{
				const result = await this.#pendingTLRequests.lists?.[screenName];
				return result;
			}finally{
				delete this.#pendingTLRequests.lists?.[screenName];
			}
		}
		async #_getUserLists(screenName){
			const userData = await this.getUser(screenName);
			if(!userData)return null;
			const variables = {
				"userId": userData.rest_id || userData.id_str,
				"count": 100
			};
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.CombinedLists.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}&fieldToggles=${this.#objectToUri(fieldToggles)}`,
				method: 'GET',
				headers,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.CombinedLists.uri);

			const entries = response.response.data.user.result.timeline.timeline.instructions?.find(element => element.type === 'TimelineAddEntries')?.entries;
			await this.#processTimeline({entries: entries, type: 'lists', screenName: screenName});
			const lists = {};
			Object.keys(this.timelines.userLists[screenName]).forEach(key => {
				const list = this.timelines.userLists[screenName][key];
				lists[list.id_str] = {
					id: list.id,
					id_str: list.id_str,
					name: list.name,
					description: list.description,
					mode: list.mode,
				};
			});
			this.lists[screenName] = {...this.lists[screenName], ...lists[screenName]};
			return {...this.lists[screenName], apiRateLimit: this.#apiRateLimit.UserLists};
		}

		async getListTimeline(listId, place = 'bottom'){
			if(this.#pendingTLRequests.lists?.[listId]){
				return await this.#pendingTLRequests.lists?.[listId];
			}
			if(this.#apiRateLimit.ListTimeline.remaining === 0 && this.#apiRateLimit.ListTimeline.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] ListTimeline API rate limit exceeded", resetDate: this.#apiRateLimit.ListTimeline.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			if(!this.#pendingTLRequests.lists)this.#pendingTLRequests.lists = {};
			if(!this.timelines.lists[listId])this.timelines.lists[listId] = {};
			this.#pendingTLRequests.lists[listId] = this.#_getListTimeline(listId, place);
			try{
				const result = await this.#pendingTLRequests.lists?.[listId];
				return result;
			}finally{
				delete this.#pendingTLRequests.lists?.[listId];
			}
		}

		async #_getListTimeline(listId, place = 'bottom'){
			const variables = {
				"listId": listId,
				"count": 20,
			};
			const cursor = this.#_getCursor('lists', place, listId);
			if(cursor)variables.cursor = cursor;
			const features = this.#graphqlFeatures;
			const requestObj = {
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.ListTimeline.uri}?variables=${this.#objectToUri(variables)}&features=${this.#objectToUri(features)}`,
				method: 'GET',
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#graphqlApiEndpoints.ListTimeline.uri);
			this.#updateApiRateLimit(response, 'ListTimeline');
			const instructions = response.response.data.list.result.timeline.timeline.instructions;
			const TimelineAddEntries = instructions.find(element => element.type === 'TimelineAddEntries');
			const timelineData = (instructions[0]?.moduleItems || []).concat(TimelineAddEntries.entries[0]?.content?.items || []).concat(TimelineAddEntries.entries);
			return {...(await this.#processTimeline({entries: timelineData, type: 'lists', place: place})), apiRateLimit: this.#apiRateLimit.ListTimeline};
		}

		async getAccountSettings(parameter = {}){
			if(this.#pendingOldApiRequests.account?.settings){
				return await this.#pendingOldApiRequests.account.settings;
			}
			/*
			if(this.#apiRateLimit.account?.setting?.remaining === 0 && this.#apiRateLimit.account?.setting?.resetDate?.getTime() > Date.now()){
				console.error({error: "[TwitterApi] AccountSetting API rate limit exceeded", resetDate: this.#apiRateLimit.account.setting.resetDate});
				throw new Error(this.#RateLimitExceeded);
			}
			*/
			if(!this.#pendingOldApiRequests.account)this.#pendingOldApiRequests.account = {};
			this.#pendingOldApiRequests.account.settings = this.#_getAccountSettings(parameter);
			try{
				const result = await this.#pendingOldApiRequests.account.settings;
				return result;
			}finally{
				delete this.#pendingOldApiRequests.account.settings;
			}
		}
		async #_getAccountSettings(parameter){
			const params = new URLSearchParams(parameter).toString();
			const requestObj = {
				url: `${this.#oldApiUri}${this.#oldApiEndpoints.account["settings.json"].uri}${params ? `?${params}` : ""}`,
				method: 'GET',
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			};
			const response = await this.#_request(requestObj, this.#oldApiEndpoints.account["settings.json"].uri, "1.1", true);
			if(!response.response)return null;
			return response.response;
		}

		// FavoriteTweet(favorite), UnfavoriteTweet(unfavorite), CreateRetweet(retweet), DeleteRetweet(deleteRetweet), CreateBookmark(bookmark), DeleteBookmark(deleteBookmark)
		async tweetAction(endpoint, tweetId){
			if(!this.#graphqlApiEndpoints[endpoint]){
				if(this.#endpointsAliases[endpoint]){
					endpoint = this.#endpointsAliases[endpoint];
				}else if(this.#graphqlApiEndpoints[endpoint.split('/').pop()]){
					endpoint = endpoint.split('/').pop();
				}else{
					throw new Error(`Invalid endpoint: ${endpoint}`);
				}
			}
			const endpointData = this.#graphqlApiEndpoints[endpoint];
			if(!endpointData || tweetId === undefined)throw new Error("Invalid endpoint or tweetId");
			const headers = await this.#generateHeaders(endpointData.uri, 'POST');
			const body = `{"variables": {"tweet_id": "${tweetId}"}, "queryId": "${endpointData.uri.split('/')[1]}"}`;
			const requestObj = {url: `${this.#graphqlApiUri}${endpointData.uri}`, method: 'POST', body: body, headers: headers, onlyResponse: false, dontUseGenericHeaders: true, maxRetries: 1};
			const response = await this.#_request(requestObj, endpoint);
			return (response.status === 200);
		}

		async getBio(screenName){
			const variables = {"screenName": screenName};
			let response;
			response = await request({
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.useFetchProfileBlocks_profileExistsQuery.uri}?variables=${this.#objectToUri(variables)}`,
				headers: await this.#generateHeaders(this.#graphqlApiEndpoints.useFetchProfileBlocks_profileExistsQuery.uri, 'GET'),
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			});
			if(!response.status === "200")throw new Error(`Failed to fetch`);
			if(!response.response.data.user_result_by_screen_name.result.has_profile_blocks)return;
			response = await request({
				url: `${this.#graphqlApiUri}${this.#graphqlApiEndpoints.useFetchProfileSections_profileQuery.uri}?variables=${this.#objectToUri(variables)}`,
				headers: await this.#generateHeaders(this.#graphqlApiEndpoints.useFetchProfileSections_profileQuery.uri, 'GET'),
				onlyResponse: false,
				dontUseGenericHeaders: true,
				maxRetries: 1
			});
			if(!response.status === "200")throw new Error(`Failed to fetch`);
			const content = response.response.data.user_result_by_screen_name.result.expanded_profile_results.result.profile_sections.items_results[0].result.profile_blocks.items_results[0].result.content.value;
			const bioData = JSON.parse(content);
			if(!bioData)return;
			if(this.tweetsUserDataByUserName[screenName])this.tweetsUserDataByUserName[screenName].bio = bioData;
			return bioData;
		}

		//graphQL API のレスポンスを処理
		async #processgraphQL(entries){
			if(!entries)return null;
			const storeTweet = (tweetObj) => {
				const user = tweetObj.core.user_results.result;
				this.tweetsUserData[user.rest_id] = { ...user, API_type: "graphQL" };
				this.tweetsUserDataByUserName[user.legacy.screen_name] = this.tweetsUserData[user.rest_id];
				tweetObj.core.user_results.result = this.tweetsUserData[user.rest_id];
				this.tweetsData[tweetObj.rest_id] = { ...tweetObj, API_type: "graphQL" };
			};
			for(const entry of entries){
				const item = entry.content?.itemContent?.tweet_results || entry.item?.itemContent?.tweet_results;
				if(!item){
					const items = entry?.content?.items;
					if(items)this.#processgraphQL(items);
					continue;
				}
				const tweet = item?.result?.tweet || item?.result;
				if(!tweet || tweet.tombstone)continue;
				try{
					// 引用ツイートの処理
					const quoted = tweet.quoted_status_result?.result?.tweet
						|| tweet.quoted_status_result?.tweet
						|| tweet.quoted_status_result?.result;
					if(quoted){
						storeTweet(quoted);
						tweet.quoted_status_result.result = this.tweetsData[quoted.rest_id];
					}
					// リツイートの処理
					const retweeted = tweet.retweeted_status_result?.result?.tweet
						|| tweet.retweeted_status_result?.tweet
						|| tweet.retweeted_status_result?.result;
					if(retweeted){
						storeTweet(retweeted);
						tweet.retweeted_status_result.result = this.tweetsData[retweeted.rest_id];
					}
					// 本体ツイートの処理
					storeTweet(tweet);
				}catch(error){
					console.error("processgraphQL error", error, {tweet});
				}
			}
			return "OK";
		}

		async #processTimeline({entries = [], type = null, screenName = null,}={}){
			if(entries.length === 2){
				if(entries[0].entryId.startsWith('cursor') && entries[1].entryId.startsWith('cursor'))return;
			}else if(entries.length === 1){
				if(entries[0].entryId.startsWith('cursor'))return;
			}
			await this.#processgraphQL(entries);
			const newContents = {};
			const newRawData = {};

			let timelineTarget = null;
			if(['following', 'forYou', 'bookmarks', 'ownLists'].includes(type)){
				timelineTarget = this.timelines[type];
			}else if(['userMedia', 'userTweets', 'userTweetsAndReplies', 'userHighlights', 'userLikes' ,'lists'].includes(type)){
				if(!this.timelines[type][screenName]){
					this.timelines[type][screenName] = {
						contents: {},
						rawData: {},
						cursor: {
							top: {entryId: null, sortIndex: null, value: null},
							bottom: {entryId: null, sortIndex: null, value: null},
							value: null,
						}
					};
				}
				timelineTarget = this.timelines[type][screenName];
			}

			entries.forEach(entry => {
				if(entry.entryId.match('promoted'))return;
				switch(true){
					case /tweet-/.test(entry.entryId): {
						const tweetId = entry.entryId.split('-').pop();
						if(!entry.sortIndex){
							entry.sortIndex = tweetId;
						}
						newRawData[entry.entryId] = entry;
						if(newRawData[entry.entryId].content?.itemContent){
							newRawData[entry.entryId].content.itemContent.tweet_results = this.tweetsData[tweetId];
						}
						if(newRawData[entry.entryId].item?.itemContent){
							newRawData[entry.entryId].item.itemContent.tweet_results = this.tweetsData[tweetId];
						}
						const controllerData = (entry.item ?? entry.content)?.clientEventInfo?.details?.timelinesDetails?.controllerData;

						newContents[entry.entryId] = {
							sortIndex: newRawData[entry.entryId].sortIndex,
							entryId: newRawData[entry.entryId].entryId,
							tweetDisplayType: newRawData[entry.entryId].item?.itemContent.tweetDisplayType || newRawData[entry.entryId].content?.itemContent.tweetDisplayType,
							controllerData: controllerData,
							tweetData: this.tweetsData[tweetId],
						}
						break;
					}
					case entry.entryId.startsWith('profile-conversation'): {
						const tweets = [];
						newRawData[entry.entryId] = entry;
						newRawData[entry.entryId].content.items.forEach((item,index) => {
							if(item.item?.itemContent?.tweet_results){
								const tweetId = item.item.itemContent.tweet_results.result.rest_id;
								newRawData[entry.entryId].content.items[index].item.itemContent.tweet_results = this.tweetsData[tweetId];
								tweets.push(tweetId);
							}
						});
						newContents[entry.entryId] = {
							sortIndex: entry.sortIndex,
							entryId: entry.entryId,
							tweetDisplayType: entry.content?.displayType || entry.item?.itemContent.tweetDisplayType || entry.content?.itemContent?.tweetDisplayType,
							controllerData: entry.content?.clientEventInfo?.details?.timelinesDetails?.controllerData,
							tweetData: tweets.map(tweetId => this.tweetsData[tweetId]),
							allTweetIds: entry.content?.metadata?.conversationMetadata?.allTweetIds || entry.item?.metadata?.conversationMetadata?.allTweetIds,
						}
						break;
					}
					case entry.entryId.startsWith('cursor-top'): {
						newRawData[entry.entryId] = entry;
						if(!timelineTarget.cursor)timelineTarget.cursor = {top:{},bottom:{}};
						if(!timelineTarget.cursor.top.sortIndex || entry.sortIndex > timelineTarget.cursor.top.sortIndex){
							timelineTarget.cursor.top = {
								sortIndex: entry.sortIndex,
								entryId: entry.entryId,
								value: entry.content.value,
							}
						}
						break;
					}
					case entry.entryId.startsWith('cursor-bottom'): {
						newRawData[entry.entryId] = entry;
						if(!timelineTarget.cursor)timelineTarget.cursor = {top:{},bottom:{}};
						if(timelineTarget.cursor && (!timelineTarget.cursor.bottom.sortIndex || entry.sortIndex < timelineTarget.cursor.bottom.sortIndex)){
							timelineTarget.cursor.bottom = {
								sortIndex: entry.sortIndex,
								entryId: entry.entryId,
								value: entry.content.value,
							};
						}
						break;
					}
					case entry.entryId.match(/subscribed-list-module/): {
						newRawData[entry.entryId] = entry;
						entry.content.items.forEach(item => {
							newContents[item.entryId] = {
								sortIndex: item.sortIndex,
								entryId: item.entryId,
								listData: item.itemContent?.list,
								isPinning: item.itemContent?.list.pinning,
							};
							if(item.itemContent?.list.pinning){
								this.timelines.ownLists.pinningLists[item.entryId] = newContents[item.entryId];
							}
						});
						break;
					}
					case entry.entryId.match(/^list-/): {
						newRawData[entry.entryId] = entry;
						newContents[entry.entryId] = {
							sortIndex: entry.sortIndex,
							entryId: entry.entryId,
							listData: entry.content?.itemContent?.list,
						};
						break;
					}
					default:
						return;
				}
			});

			if(!timelineTarget.contents)timelineTarget.contents = {};
			if(!timelineTarget.rawData)timelineTarget.rawData = {};
			if(!timelineTarget.contentsList)timelineTarget.contentsList = [];
			if(!timelineTarget.contentsBySortIndex)timelineTarget.contentsBySortIndex = {};
			const combinedContents = {...timelineTarget.contents};
			const combinedRawData = {...timelineTarget.rawData};

			const newContentsData = { contents: {}, rawData: {}, contentsList: [], contentsBySortIndex: {} };
			const contentsList = timelineTarget.contentsList || [];
			const contentsBySortIndex = timelineTarget.contentsBySortIndex || {};

			for(const [key, content] of Object.entries(newContents)){
				const raw = newRawData[key];
				combinedContents[key] = content;
				combinedRawData[key] = raw;

				contentsList.push(content);
				contentsBySortIndex[content.sortIndex] = content;

				if(!timelineTarget.contents[key]){
					newContentsData.contents[key] = content;
					newContentsData.rawData[key] = raw;
					newContentsData.contentsList.push(content);
					newContentsData.contentsBySortIndex[content.sortIndex] = content;
				}
			}

			for(const [key, content] of Object.entries(timelineTarget.contents)){
				if(!combinedContents[key]){
					contentsList.push(content);
					contentsBySortIndex[content.sortIndex] = content;
				}
			}

			contentsList.sort((a, b) => (b.sortIndex || "").localeCompare(a.sortIndex || ""));
			newContentsData.contentsList.sort((a, b) => (b.sortIndex || "").localeCompare(a.sortIndex || ""));

			timelineTarget.contents = combinedContents;
			timelineTarget.rawData = combinedRawData;
			timelineTarget.contentsList = contentsList;
			timelineTarget.contentsBySortIndex = contentsBySortIndex;
			timelineTarget.newContents = newContentsData;


			return timelineTarget;
		}

		async #generateHeaders(endpoint, method, apiType = 'graphql'){
			const id = await this.getXctid(apiType === 'graphql' ? "/i/api/graphql" : `/i/api/${apiType}` + endpoint, method);
			const headers = id ? Object.assign({
				'x-client-transaction-id': id,
			}, this.#requestHeadersTemplate) : this.#requestHeadersTemplate;
			return headers;
		}

		#_getCursor(type, place, screenName = null){
			let timelineTarget;

			if(['following', 'forYou', 'bookmarks', 'ownLists'].includes(type)){
				timelineTarget = this.timelines[type];
			}else if(['userMedia', 'userTweets', 'userTweetsAndReplies', 'userHighlights', 'userLikes', 'lists'].includes(type)){
				if(!this.timelines[type][screenName]){
					this.timelines[type][screenName] = {
						cursor: {
							top: { entryId: null, sortIndex: null, value: null },
							bottom: { entryId: null, sortIndex: null, value: null }
						}
					};
				}
				timelineTarget = this.timelines[type][screenName];
			}else{
				throw new Error(`Invalid timeline type: ${type}`);
			}

			if(place === 'refresh'){
				timelineTarget.cursor = {
					top: { entryId: null, sortIndex: null, value: null },
					bottom: { entryId: null, sortIndex: null, value: null }
				};
				return null;
			}

			const cursorObj = timelineTarget.cursor?.[place];
			return cursorObj?.value ?? null;
		}

		async #_request(optionObj, endpoint, type = 'graphql', noApiRateLimit = false){
			if(this.#resetTransactionIdSolverTimes >= 5){
				console.error("[TwitterApi] Too many transactionIdSolver reset attempts. Please check your network connection or try again later.");
				throw new Error("TransactionIdSolver is not working");
			}
			let retryCount = 0;
			while(retryCount <= 5 && this.#resetTransactionIdSolverTimes < 5){
				try{
					const headers = await this.#generateHeaders(endpoint, optionObj.method, type);
					const response = await request({...optionObj, headers});
					if(!noApiRateLimit)this.#updateApiRateLimit(response, endpoint);
					return response;
				}catch(e){
					console.error(e);
					if(e.error?.response?.status === 404){
						retryCount++;
						this.#challengeData = null;
						this.#transactionIdSolver = null;
					}else{
						if(e.error?.response && !noApiRateLimit)this.#updateApiRateLimit(e.error.response, endpoint);
						return null;
					}
				}
			}
		}

		#updateApiRateLimit(response, endpoint){
			if(!this.#graphqlApiEndpoints[endpoint]){
				const tmpName = this.#graphqlApiEndpoints[endpoint?.split('/')?.pop()];
				if(tmpName){
					endpoint = endpoint?.split('/')?.pop();
				}
			}
			const responseHeaders = response.responseHeaders;
			if(!this.#apiRateLimit[endpoint]){
				this.#apiRateLimit[endpoint] = {
					remaining: responseHeaders.match(/x-rate-limit-remaining: ?([\d]+)/)?.[1],
					limit: responseHeaders.match(/x-rate-limit-limit: ?([\d]+)/)?.[1],
					reset: responseHeaders.match(/x-rate-limit-reset: ?([\d]+)/)?.[1],
					resetDate : new Date((responseHeaders.match(/x-rate-limit-reset: ?([\d]+)/)?.[1] || 0) * 1000),
				};
			}else{
				this.#apiRateLimit[endpoint].remaining = responseHeaders.match(/x-rate-limit-remaining: ?([\d]+)/)?.[1];
				this.#apiRateLimit[endpoint].limit = responseHeaders.match(/x-rate-limit-limit: ?([\d]+)/)?.[1];
				this.#apiRateLimit[endpoint].reset = responseHeaders.match(/x-rate-limit-reset: ?([\d]+)/)?.[1];
				this.#apiRateLimit[endpoint].resetDate = new Date((responseHeaders.match(/x-rate-limit-reset: ?([\d]+)/)?.[1] || 0) * 1000);
			}
			if(response.status === 200){
				return true;
			}else{
				console.error(`${endpoint} API error`, response);
				throw new Error(`Failed to fetch`);
			}
		}

		#objectToUri(obj){
			return encodeURIComponent(JSON.stringify(obj));
		}

		getApiRateLimit(){
			return this.#apiRateLimit;
		}

		#defaultTimelineData(){
			return {
				contents: {},
				contentsList: [],
				contentsBySortIndex: {},
				rawData: {},
				newContents: {contents: {}, contentsList: [], contentsBySortIndex: {}, rawData: {}},
				cursor: {top: {entryId: null, sortIndex: null, value: null}, bottom: {entryId: null, sortIndex: null, value: null}},
			};
		}

		// challenge 情報を取得
		async #getChallengeData(force = false){
			if((this.#challengeData?.expires && this.#challengeData?.expires > Date.now()) && !force){
				return;
			}
			if(this.#challengeDataPromise){
				return this.#challengeDataPromise;
			}
			if(force)this.#resetTransactionIdSolverTimes++;
			this.#challengeDataPromise = (async () => {
				const response = await request({ url: 'https://x.com/home', respType: 'text' });
				const html = response;
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");

				const metaTag = doc.querySelector('meta[name="twitter-site-verification"]');
				const verificationCode = metaTag?.content;
				if(!verificationCode)throw new Error("Verification code not found");

				const challengeCodeMatch = html.match(/"ondemand\.s":"(\w+)"/);
				if(!challengeCodeMatch)throw new Error("Challenge code not found");

				const challengeCode = challengeCodeMatch[1];
				const svgs = Array.from(doc.querySelectorAll('svg[id^="loading-x"]'));
				const challengeAnimationSvgCodes = svgs.map(svg => svg.outerHTML);

				const jsUrl = `https://abs.twimg.com/responsive-web/client-web/ondemand.s.${challengeCode}a.js`;
				const challengeJsCode = await request({ url: jsUrl, respType: 'text' });
				this.#challengeData = {
					verificationCode,
					challengeCode,
					challengeJsCode,
					challengeAnimationSvgCodes,
					expires: Date.now() + 60 * 60 * 1000, // 60 min
				};
				await saveToIndexedDB('MTLU_twitterApi', 'challengeData', this.#challengeData);
			})();

			try{
				return this.#challengeDataPromise;
			}finally{
				this.#challengeDataPromise = null;
			}
		}

		async getXctid(endpoint, method = "GET"){
			await this.#initPromise;
			if(!this.#challengeData){
				await this.#getChallengeData();
			}
			if(!this.#transactionIdSolver){
				this.#transactionIdSolver = new TwitterApi.TransactionIdSolver(this.#challengeData);
			}
			return await this.#transactionIdSolver.solve(endpoint, method);
		}

		// ここは https://github.com/dimdenGD/OldTweetDeck/blob/main/src/challenge.js から完全にパクった
		#uuidV4(){
			const uuid = new Array(36);
			for(let i = 0; i < 36; i++){
			uuid[i] = Math.floor(Math.random() * 16);
			}
			uuid[14] = 4; // set bits 12-15 of time-high-and-version to 0100
			uuid[19] = uuid[19] &= ~(1 << 2); // set bit 6 of clock-seq-and-reserved to zero
			uuid[19] = uuid[19] |= (1 << 3); // set bit 7 of clock-seq-and-reserved to one
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			return uuid.map((x) => x.toString(16)).join('');
		}

		async #twitterApiInit(){
			this.#challengeData = await getFromIndexedDB('MTLU_twitterApi', 'challengeData');
			await this.#getChallengeData();
			this.#classSettings = await getFromIndexedDB('MTLU_twitterApi', 'settings') || {};
			if(!this.#classSettings?.uuid){
				this.#classSettings.uuid = this.#uuidV4();
				await saveToIndexedDB('MTLU_twitterApi', 'settings', this.#classSettings);
			}
			this.#requestHeadersTemplate['x-twitter-client-uuid'] = this.#classSettings.uuid;
		}

		// 参考: https://github.com/iSarabjitDhiman/XClientTransaction
		static TransactionIdSolver = class {
			constructor(challengeData){
				this.challengeData = challengeData;
				this.animationKey = null;
			}

			async solve(path, method){
				if(!this.challengeData.verificationCode){
					throw new Error("Challenge data missing");
				}
				if(!this.animationKey){
					this.animationKey = await this.getAnimationKey();
				}

				const keyBytes = Array.from(atob(this.challengeData.verificationCode), c => c.charCodeAt(0));
				return await this.generateTransactionId(method, path, {
					key: this.challengeData.verificationCode,
					keyBytes,
					animationKey: this.animationKey,
					defaultKeyword: "obfiowerehiring",
					additionalRandomNumber: 3
				});
			}

			async getAnimationKey(){
				if(!(this.rowIndexKey && this.frameTimeKeys))this.getIndices();
				const parser = new DOMParser();
				const svgs = this.challengeData.challengeAnimationSvgCodes.map(html => parser.parseFromString(html, 'image/svg+xml').documentElement);

				const keyBytes = Array.from(atob(this.challengeData.verificationCode), c => c.charCodeAt(0));
				const totalTime = 4096;
				const rowIndex = keyBytes[this.rowIndexKey] % 16;
				const frameTime = this.frameTimeKeys.map(i => keyBytes[i] % 16).reduce((a, b) => a * b, 1);

				const selectedSvg = svgs[keyBytes[5] % svgs.length];
				const arr = this.parsePathToArray(selectedSvg);
				const frameRow = arr[rowIndex].filter((x)=>{return x === x});

				const targetTime = frameTime / totalTime;
				return this.animate(frameRow, targetTime);
			}

			async getIndices(){
				const matches = [...this.challengeData.challengeJsCode.matchAll(/\(\w\[(\d+)\],\s*16\)/g)];
				const indices = matches.map(match => parseInt(match[1]));

				if(indices.length < 4){
					throw new Error("Couldn't extract keyByte indices from on_demand.js");
				}

				this.rowIndexKey = indices[0];
				this.frameTimeKeys = indices.slice(1, 4);
			}

			parsePathToArray(svgElement){
				const paths = svgElement.querySelectorAll('path');
				const path = paths[1];
				if(!path)return [];
				const d = path.getAttribute('d');
				if(!d)return [];
				const commands = d.split('C').slice(1);
				return commands.map(command => command.trim().split(/[\s,]+/).map(str => parseInt(str, 10)).filter((x)=>{return x === x}));
			}

			animate(frames, targetTime){
				const fromColor = [...frames.slice(0, 3).map(v => parseFloat(v)), 1];
				const toColor = [...frames.slice(3, 6).map(v => parseFloat(v)), 1];
				const fromRotation = [0.0];
				const toRotation = [this.solveVal(parseFloat(frames[6]), 60.0, 360.0, true)];
				const curves = frames.slice(7).map((item, i) => this.solveVal(parseFloat(item), this.isOdd(i) ? -1 : 0, 1.0, false)).filter((x)=>{return x === x});

				const val = this.getCubic(targetTime, curves);

				let color = this.interpolate(fromColor, toColor, val).map(v => Math.max(0, v));
				const rotation = this.interpolate(fromRotation, toRotation, val);
				const matrix = this.convertRotationToMatrix(rotation[0]);

				const strArr = [];
				for(let i=0;i<color.length-1;i++){
					strArr.push(Math.round(color[i]).toString(16));
				}
				for(const value of matrix){
					let rounded = Math.round(value * 100) / 100;
					if(rounded < 0)rounded = -rounded;
					const hexValue = this.floatToHex(rounded);
					strArr.push(hexValue.startsWith('.') ? `0${hexValue}` : hexValue || '0');
				}
				strArr.push("0", "0");

				return strArr.join('').replace(/[.-]/g, '');
			}

			convertRotationToMatrix(rotation){
				const rad = rotation * Math.PI / 180;
				const cosVal = Math.cos(rad);
				const sinVal = Math.sin(rad);
				return [cosVal, -sinVal, sinVal, cosVal];
			}

			solveVal(value, minVal, maxVal, rounding){
				const result = value * (maxVal - minVal) / 255 + minVal;
				return rounding ? Math.floor(result) : Math.round(result * 100) / 100;
			}

			isOdd(num){
				return (num % 2) ? -1.0 : 0.0;
			}

			interpolate(fromList, toList, f){
				if(fromList.length !== toList.length){
					throw new Error(`Mismatched interpolation arguments: ${fromList} vs ${toList}`);
				}
				return fromList.map((fromVal, i) => this.interpolateNum(fromVal, toList[i], f));
			}

			interpolateNum(fromVal, toVal, f){
				if(typeof fromVal === 'number' && typeof toVal === 'number'){
					return fromVal * (1 - f) + toVal * f;
				}
				if(typeof fromVal === 'boolean' && typeof toVal === 'boolean'){
					return f < 0.5 ? fromVal : toVal;
				}
				throw new Error('Unsupported types in interpolateNum');
			}

			floatToHex(x, maxDigits = 16){
				const result = [];
				let quotient = Math.floor(x);
				let fraction = x - quotient;

				// 整数部
				while(quotient > 0){
					let newQuotient = Math.floor(x / 16);
					let remainder = Math.floor(x - (newQuotient * 16));

					if(remainder > 9){
						result.unshift(String.fromCharCode(remainder + 55));
					}else{
						result.unshift(remainder.toString());
					}

					x = newQuotient;
					quotient = Math.floor(x);
				}

				if(result.length === 0){
					result.push('0');
				}

				// 小数部
				if(fraction !== 0){
					result.push('.');
					let safeCounter = 0;
					while(fraction > 0 && safeCounter < maxDigits){
						fraction *= 16;
						let integer = Math.floor(fraction);
						fraction -= integer;

						if(integer > 9){
							result.push(String.fromCharCode(integer + 55));
						}else{
							result.push(integer.toString());
						}

						safeCounter++;
						// fractionが十分小さくなったら無視
						if(fraction < 1e-12)break;
					}
				}

				return result.join('');
			}

			async generateTransactionId(method, path, options){
				const {
					key,
					keyBytes,
					animationKey,
					defaultKeyword,
					additionalRandomNumber
				} = options;

				const now = Date.now();
				const timeNow = Math.floor((now - 1682924400000) / 1000);
				const timeNowBytes = [
					(timeNow >> 0) & 0xFF,
					(timeNow >> 8) & 0xFF,
					(timeNow >> 16) & 0xFF,
					(timeNow >> 24) & 0xFF
				];

				const data = `${method}!${path}!${timeNow}${defaultKeyword}${animationKey.toLowerCase()}`;
				const hashBuffer = await crypto.subtle.digest('SHA-256', this.manualEncode(data));
				const hashArray = Array.from(structuredClone(new Uint8Array(hashBuffer))); // Firefoxでのエラー回避

				const randomNum = Math.floor(Math.random() * 256);

				const bytesArr = [
					...keyBytes,
					...timeNowBytes,
					...hashArray.slice(0, 16),
					additionalRandomNumber
				];

				const obfuscated = [randomNum, ...bytesArr.map(b => b ^ randomNum)];
				const base64 = this.base64Encode(obfuscated).replace(/=/g, '');

				return base64;
			}

			manualEncode(str){
				const bytes = new Uint8Array(str.length);
				for(let i=0;i<str.length;i++){
					bytes[i] = str.charCodeAt(i) & 0xFF;
				}
				return bytes;
			}

			getCubic(time, curves){
				if(time <= 0.0){
					let startGradient = 0.0;
					if(curves[0] > 0.0){
						startGradient = curves[1] / curves[0];
					}else if(curves[1] === 0.0 && curves[2] > 0.0){
						startGradient = curves[3] / curves[2];
					}
					return startGradient * time;
				}

				if(time >= 1.0){
					let endGradient = 0.0;
					if(curves[2] < 1.0){
						endGradient = (curves[3] - 1.0) / (curves[2] - 1.0);
					}else if(curves[2] === 1.0 && curves[0] < 1.0){
						endGradient = (curves[1] - 1.0) / (curves[0] - 1.0);
					}
					return 1.0 + endGradient * (time - 1.0);
				}

				let start = 0.0;
				let end = 1.0;
				let mid = 0.0;
				while(start < end){
					mid = (start + end) / 2;
					const x_est = this.calculateCubic(curves[0], curves[2], mid);
					if(Math.abs(time - x_est) < 0.00001){
						return this.calculateCubic(curves[1], curves[3], mid);
					}
					if(x_est < time){
						start = mid;
					}else{
						end = mid;
					}
				}
				return this.calculateCubic(curves[1], curves[3], mid);
			}

			calculateCubic(a, b, m){
				return 3.0 * a * (1.0 - m) * (1.0 - m) * m + 3.0 * b * (1.0 - m) * m * m + m * m * m;
			}

			base64Encode(bytes){
				const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
				return btoa(binary);
			}
		};

		debug(){
			console.log("TwitterApi");
			console.log({
				tweetsData: this.tweetsData,
				tweetsUserData: this.tweetsUserData,
				tweetsUserDataByUserName: this.tweetsUserDataByUserName,
				lists: this.lists,
				timelines: this.timelines,
				challengeData: this.#challengeData,
				graphqlApiUri: this.#graphqlApiUri,
				graphqlApiEndpoints: this.#graphqlApiEndpoints,
				endpointsAliases: this.#endpointsAliases,
				requestHeadersTemplate: this.#requestHeadersTemplate,
				graphqlFeatures: this.#graphqlFeatures,
				pendingTweetRequests: this.#pendingTweetRequests,
				pendingUserRequests: this.#pendingUserRequests,
				pendingTLRequests: this.#pendingTLRequests,
				apiRateLimit: this.#apiRateLimit,
				classSettings: this.#classSettings,
			});
		}
	}
	const twitterApi = new TwitterApi();

	class TwitterTextI18n {
		#version = 202505170000;
		#langList = ["ja", "en", "ar", "ar-x-fm", "bg", "bn", "ca", "cs", "da", "de", "el", "en-gb", "es", "eu", "fa", "fi", "fil",
			"fr", "ga", "gl", "gu", "ha", "he", "hi", "hr", "hu", "id", "ig", "it", "kn", "ko", "mr", "msa", "nb",
			"nl", "pl", "pt", "ro", "ru", "sk", "sr", "sv", "ta", "th", "tr", "uk", "ur", "vi", "yo", "zh-cn", "zh-tw"];
		#textData = {};
		#testData = null;
		#isReady = false;
		#loadingPromise = null;
		constructor(){

		}

		async loadTextData(lang = 'en', type = 'new', force = false){
			if(this.#isReady && !force){
				return;
			}
			if(!this.#langList.includes(lang)){
				console.error(`Unsupported language: ${lang}`);
				lang = 'en';
			}
			if(this.#loadingPromise){
				return this.#loadingPromise;
			}

			const storedData = await getFromIndexedDB('MTLU_TwitterTextI18n', 'textData') || {};
			let jsonTextData = null;
			if(this.#testData){
				this.#textData = this.#testData;
				this.#isReady = true;
				return;
			}else if(storedData[lang]?.[type]?.jsonText && storedData?.[lang]?.[type]?.dataVersion === this.#version){
				jsonTextData = storedData[lang][type].jsonText;
			}else{
				const jsonTextDataBaseUrl = `https://raw.githubusercontent.com/Happy-come-come/UserScripts/main/Twitter%E3%82%92%E5%B0%91%E3%81%97%E4%BE%BF%E5%88%A9%E3%81%AB%E3%80%82/data/TwitterTextI18nData/textData/json/`
				jsonTextData = await request({url: `${jsonTextDataBaseUrl}${lang}_${type}.json`, method: 'GET', respType: 'text'});
				if(!jsonTextData){
					throw new Error('Failed to load text data');
				}
				if(!storedData[lang])storedData[lang] = {};
				if(!storedData[lang][type])storedData[lang][type] = {};
				storedData[lang][type].jsonText = jsonTextData;
				storedData[lang][type].dataVersion = this.#version;
				await saveToIndexedDB('MTLU_TwitterTextI18n', 'textData', storedData);
			}
			const textData = JSON.parse(jsonTextData);
			if(!textData){
				throw new Error('Failed to load text data');
			}
			this.#textData = textData;
			this.#isReady = true;
			return "Ready";
		}

		getText(key, args = [], props = {}){
			if(key === undefined || key === null){
				return '';
			}
			const selectedText = this.#textData[key];
			if(!selectedText){
				console.error(`Missing text for key: ${key}`);
				return '';
			}
			if(selectedText.type === 'string'){
				return selectedText.value;
			}
			if(selectedText.type === 'webI18nFunction'){
				let argsObj = {};
				if(typeof args === 'object' && !Array.isArray(args)){
					argsObj = args;
				}else if(Array.isArray(args)){
					for(let i = 0; i < selectedText.arguments.length; i++){
						argsObj[selectedText.arguments[i]] = args[i] ?? '';
					}
				}
				return this.#applyPlaceholders(selectedText.value, argsObj);
			}
			if(selectedText.type === 'webI18nTemplateFunction'){
				return this.#applyTemplate(selectedText.value, args, props);
			}
			if(selectedText.type === 'apkI18nTemplateFunction'){
				return this.#formatString(selectedText.value, args);
			}
		}

		#applyTemplate(templateParts, args, props){
			// templateParts は配列であることを前提
			let result = '';
			for(let i = 0; i < templateParts.length; i++){
				// まずテンプレートのプレースホルダーを props で展開
				result += this.#applyPlaceholders(templateParts[i], props);
				// そのあと、無名 args があるなら interleave
				if(i < args.length){
					result += args[i];
				}
			}
			return result;
		}

		#formatString(template, args){
			let argIndex = 0;
			return template.replace(/%(\d+\$)?s/g, (_, indexPart) => {
				let i;
				if(indexPart){
					i = parseInt(indexPart, 10) - 1;
				}else{
					i = argIndex++;
				}
				return args[i] !== undefined ? args[i] : `%${indexPart || ''}s`;
			});
		}

		#applyPlaceholders(templateStr, context = {}){
			return templateStr.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
				return context[key] !== undefined ? context[key] : '';
			});
		}
	}
	const twitterTextI18n = new TwitterTextI18n();

	async function displayChangelog(currentScriptVersion, lastScriptVersion){
		if(document.getElementById('changelogOverlay') || scriptSettings.makeTwitterLittleUseful.displayChangelog === false)return;
		const changelogs = {
			"2.1.1.0": {
				"newFeatures": ["imageZoom"],
				"updateDate": "2025-01-27 01:00:00",
			},
			"2.2.3.0": {
				"newFeatures": ["customizeMenuButton"],
				"updateDate": "2025-05-16 07:00:00",
			}
		};
		if(Object.keys(changelogs).every(version => compareVersions(version, lastScriptVersion) === -1))return;
		const textData = envText.makeTwitterLittleUseful.displayChangelog;
		const colors = new Colors();
		const changelogOverlay = document.createElement('div');
		changelogOverlay.className = 'changelogOverlay MTLU_container';
		changelogOverlay.setAttribute('MTLU-Id', 'changelogOverlay');
		changelogOverlay.id = 'changelogOverlay';
		Object.assign(changelogOverlay.style, {
			position: "fixed",
			top: "0",
			left: "0",
			width: "100%",
			height: "100%",
			backgroundColor: "rgba(0, 0, 0, 0.5)",
			zIndex: "1000",
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		});
		changelogOverlay.addEventListener('click', async (e)=>{
			if(neverDisplayCheckbox.checked){
				scriptSettings.makeTwitterLittleUseful.displayChangelog = false;
				await saveSettings();
			}
			changelogOverlay.remove();
		});

		const changelogContainer = document.createElement('div');
		changelogContainer.setAttribute('MTLU-Id', 'changelogContainer');
		Object.assign(changelogContainer.style, {
			backgroundColor: colors.get("backgroundColor"),
			color: colors.get("fontColor"),
			fontColor: colors.get("fontColor"),
			padding: "0px",
			borderRadius: "10px",
			maxHeight: "90%",
			maxWidth: "90%",
			overflowX: "hidden",
			overflowY: "hidden",
			flexShrink: "0",
			flexGrow: "0",
			border: `2px solid ${colors.get("borderColor")}`,
		});
		changelogContainer.addEventListener('click', (e)=>{
			e.stopPropagation();
			e.preventDefault();
		});
		changelogOverlay.appendChild(changelogContainer);

		const changelogHeaderContainer = document.createElement('div');
		changelogHeaderContainer.setAttribute('MTLU-Id', 'changelogHeaderContainer');
		Object.assign(changelogHeaderContainer.style, {
			display: "flex",
			padding: "10px",
			borderBottom: `1px solid ${colors.get("borderColor")}`,
			borderTopLeftRadius: "10px",
			borderTopRightRadius: "10px",
			justifyContent: "space-between",
			alignItems: "center",
			flexDirection: "column",
		});
		changelogContainer.appendChild(changelogHeaderContainer);

		const scriptName = document.createElement('h1');
		scriptName.setAttribute('MTLU-Id', 'scriptName');
		scriptName.textContent = envText.makeTwitterLittleUseful.scriptName;
		Object.assign(scriptName.style, {
			fontSize: "1.5em",
			margin: "0px",
		});
		changelogHeaderContainer.appendChild(scriptName);

		const changelogHeader = document.createElement('h1');
		changelogHeader.setAttribute('MTLU-Id', 'changelogHeader');
		changelogHeader.textContent = textData.headerTitle;
		Object.assign(changelogHeader.style, {
			fontSize: "1.5em",
			margin: "0px",
		});
		changelogHeaderContainer.appendChild(changelogHeader);

		const changelogMainContainer = document.createElement('div');
		changelogMainContainer.setAttribute('MTLU-Id', 'changelogMainContainer');
		Object.assign(changelogMainContainer.style, {
			display: "flex",
			padding: "10px",
			overflowY: "auto",
			overflowX: "wrap",
			flexDirection: "column",
			flexGrow: "0",
			flexShrink: "0",
		});
		changelogContainer.appendChild(changelogMainContainer);

		const selfProtectionText = document.createElement('p');
		selfProtectionText.setAttribute('MTLU-Id', 'selfProtectionText');
		selfProtectionText.textContent = textData.selfProtection;
		Object.assign(selfProtectionText.style, {
			margin: "0px",
			padding: "0px",
		});
		changelogMainContainer.appendChild(selfProtectionText);

		const scriptUrlContainer = document.createElement('div');
		scriptUrlContainer.setAttribute('MTLU-Id', 'scriptUrlContainer');
		Object.assign(scriptUrlContainer.style, {
			display: "flex",
			padding: "0 0 10px 0",
			alignItems: "center",
		});
		scriptUrlContainer.addEventListener('click', (e) => {
			e.stopPropagation();
		});
		changelogMainContainer.appendChild(scriptUrlContainer);

		const scriptUrlLabel = document.createElement('p');
		scriptUrlLabel.setAttribute('MTLU-Id', 'scriptUrlLabel');
		scriptUrlLabel.textContent = textData.moreInfo;
		Object.assign(scriptUrlLabel.style, {
			margin: "0px",
		});
		scriptUrlContainer.appendChild(scriptUrlLabel);

		const scriptUrl = document.createElement('a');
		scriptUrl.setAttribute('MTLU-Id', 'scriptUrl');
		scriptUrl.href = "https://greasyfork.org/scripts/478248";
		scriptUrl.textContent = textData.here;
		scriptUrl.target = "_blank";
		scriptUrl.rel = "noopener nofollow";
		Object.assign(scriptUrl.style, {
			margin: "0px",
			color: colors.get("twitterBlue"),
		});
		scriptUrlContainer.appendChild(scriptUrl);

		Object.keys(changelogs).forEach((version)=>{
			if(compareVersions(version, lastScriptVersion) === 1){
				const changelogVersionContainer = document.createElement('div');
				changelogVersionContainer.setAttribute('MTLU-Id', 'changelogVersionContainer');
				Object.assign(changelogVersionContainer.style, {
					marginBottom: "10px",
				});
				changelogMainContainer.appendChild(changelogVersionContainer);

				const changelogVersionHeader = document.createElement('h2');
				changelogVersionHeader.setAttribute('MTLU-Id', 'changelogVersionHeader');
				changelogVersionHeader.textContent = `${textData.version} ${version}`;
				Object.assign(changelogVersionHeader.style, {
					fontSize: "1.2em",
					margin: "0px",
				});
				changelogVersionContainer.appendChild(changelogVersionHeader);

				const changelogVersionDate = document.createElement('p');
				changelogVersionDate.setAttribute('MTLU-Id', 'changelogVersionDate');
				const date = new Date(changelogs[version].updateDate);
				changelogVersionDate.textContent = `${textData.updateDate} ${date.toLocaleString()}`;
				Object.assign(changelogVersionDate.style, {
					margin: "0px",
				});
				changelogVersionContainer.appendChild(changelogVersionDate);

				const changelogVersionList = document.createElement('ul');
				changelogVersionList.setAttribute('MTLU-Id', 'changelogVersionList');
				Object.assign(changelogVersionList.style, {
					listStyleType: "disc",
					paddingLeft: "20px",
				});
				changelogVersionContainer.appendChild(changelogVersionList);

				const newFeaturesListHeader = document.createElement('h3');
				newFeaturesListHeader.setAttribute('MTLU-Id', 'newFeaturesListHeader');
				newFeaturesListHeader.textContent = textData.newFeaturesListHeader;
				Object.assign(newFeaturesListHeader.style, {
					fontSize: "1.1em",
					margin: "0px",
				});
				changelogVersionList.appendChild(newFeaturesListHeader);

				const newFeaturesList = document.createElement('ul');
				newFeaturesList.setAttribute('MTLU-Id', 'newFeaturesList');
				Object.assign(newFeaturesList.style, {
					listStyleType: "circle",
					paddingLeft: "20px",
				});
				changelogVersionList.appendChild(newFeaturesList);

				changelogs[version].newFeatures.forEach((feature)=>{
					const changelogVersionListItem = document.createElement('li');
					changelogVersionListItem.setAttribute('MTLU-Id', 'changelogVersionListItem');
					changelogVersionListItem.textContent = envText[feature].settings.displayName;

					const featureDescriptionList = document.createElement('ul');
					featureDescriptionList.setAttribute('MTLU-Id', 'featureDescriptionList');

					const featureDescriptionListItem = document.createElement('li');
					featureDescriptionListItem.setAttribute('MTLU-Id', 'featureDescriptionListItem');
					featureDescriptionListItem.textContent = envText[feature].settings.description;
					featureDescriptionList.appendChild(featureDescriptionListItem);
					changelogVersionListItem.appendChild(featureDescriptionList);

					newFeaturesList.appendChild(changelogVersionListItem);
				});
				changelogMainContainer.appendChild(changelogVersionContainer);
			}
		});

		const footerContainer = document.createElement('div');
		footerContainer.setAttribute('MTLU-Id', 'footerContainer');
		Object.assign(footerContainer.style, {
			display: "flex",
			padding: "10px",
			borderTop: `1px solid ${colors.get("borderColor")}`,
			borderBottomLeftRadius: "10px",
			borderBottomRightRadius: "10px",
			justifyContent: "flex-end",
			alignItems: "center",
		});
		changelogContainer.appendChild(footerContainer);

		const neverDisplayContainer = document.createElement('div');
		neverDisplayContainer.setAttribute('MTLU-Id', 'neverDisplayContainer');
		Object.assign(neverDisplayContainer.style, {
			display: "flex",
			alignItems: "center",
			userSelect: "none",
		});
		neverDisplayContainer.addEventListener('click', (e) => {
			e.stopPropagation();
		});
		footerContainer.appendChild(neverDisplayContainer);

		const neverDisplayLabel = document.createElement('label');
		neverDisplayLabel.setAttribute('MTLU-Id', 'neverDisplayLabel');
		neverDisplayLabel.textContent = textData.neverDisplay;
		neverDisplayLabel.setAttribute('for', 'neverDisplayCheckbox');
		Object.assign(neverDisplayLabel.style, {
			margin: "0px",
		});
		neverDisplayContainer.appendChild(neverDisplayLabel);

		const neverDisplayCheckbox = document.createElement('input');
		neverDisplayCheckbox.setAttribute('MTLU-Id', 'neverDisplayCheckbox');
		neverDisplayCheckbox.type = "checkbox";
		neverDisplayCheckbox.id = "neverDisplayCheckbox";
		neverDisplayContainer.appendChild(neverDisplayCheckbox);

		footerContainer.appendChild(neverDisplayContainer);

		const closeButton = document.createElement('button');
		closeButton.setAttribute('MTLU-Id', 'closeButton');
		closeButton.textContent = textData.closeButtonText;
		Object.assign(closeButton.style, {
			marginLeft: "10px",
		});
		closeButton.addEventListener('click', async ()=>{
			if(neverDisplayCheckbox.checked){
				scriptSettings.makeTwitterLittleUseful.displayChangelog = false;
				await saveSettings();
			}
			changelogOverlay.remove();
		});
		footerContainer.appendChild(closeButton);

		const openSettingsButton = document.createElement('button');
		openSettingsButton.setAttribute('MTLU-Id', 'openSettingsButton');
		openSettingsButton.textContent = textData.openSettingsButtonText;
		Object.assign(openSettingsButton.style, {
			marginLeft: "10px",
		});
		openSettingsButton.addEventListener('click', ()=>{
			createSettingsPage();
			changelogOverlay.remove();
		});
		footerContainer.appendChild(openSettingsButton);

		document.body.appendChild(changelogOverlay);
	}

	async function firstTime(){
		if(!((await getFromIndexedDB('makeTwitterLittleUseful', 'settings')) || localStorage.getItem('Make_Twitter_little_useful'))){
			createSettingsPage();
		}
	}
	async function whenChangeScriptVersion(){
		const currentScriptVersion = GM_info.script.version;
		const lastScriptVersion = scriptDataStore.makeTwitterLittleUseful?.version || "99.0.0.0";
		if(compareVersions(currentScriptVersion, lastScriptVersion) === 1){
			displayChangelog(currentScriptVersion, lastScriptVersion);
			scriptDataStore.makeTwitterLittleUseful.version = currentScriptVersion;
			await saveScriptDataStore();
		}
	}
	async function init(){
		firstTime();
		whenChangeScriptVersion();
		updateThemeMode(whenChangeThemeMode);
		await fetchUserData();
		await twitterTextI18n.loadTextData(sessionData.userData.language, scriptSettings.makeTwitterLittleUseful.uiTextType || 'old');
		window.addEventListener("scroll", update);
		locationChange(document.getElementById('react-root'));
		main();
		getPixivLinkCollection();
		addEventToHomeButton();
		addEventToScrollSnapSwipeableList();
		addSettingsButtonToTwitterSettingsMenu(true);
	}
	await init();
})();
