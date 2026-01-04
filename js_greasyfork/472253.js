// ==UserScript==
// @name		kmelearningAutoVideoPass
// @author		Yiero
// @description		自动播放视频, 切换视频
// @version		1.1.3
// @namespace		https://github.com/AliubYiero/TamperMonkeyScripts
// @match		https://pc.kmelearning.com/*
// @icon		https://pc.kmelearning.com/favicon.ico
// @license		GPL
// @downloadURL https://update.greasyfork.org/scripts/472253/kmelearningAutoVideoPass.user.js
// @updateURL https://update.greasyfork.org/scripts/472253/kmelearningAutoVideoPass.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defNormalProp = ( obj, key, value ) => key in obj ? __defProp( obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
} ) : obj[key] = value;
var __publicField = ( obj, key, value ) => {
	__defNormalProp( obj, typeof key !== "symbol" ? key + "" : key, value );
	return value;
};

function freshListenerPopstate( callback, s = 1 ) {
	window.addEventListener( "popstate", () => {
		setTimeout( callback, s * 1e3 );
	} );
}

function freshListenerPushState( callback, s = 1 ) {
	let _pushState = window.history.pushState;
	window.history.pushState = function () {
		setTimeout( callback, s * 1e3 );
		return _pushState.apply( this, arguments );
	};
}

class Info {
	constructor( projectName ) {
		// @ts-ignore
		__publicField( this, "projectName" );
		__publicField( this, "header" );
		this.projectName = projectName;
		this.header = `[${ projectName }]`;
	}
	
	log( ...msg ) {
		/* @__PURE__ */
		( () => {
		} )( ...this.contentInfo( ...msg ) );
	}
	
	info( ...msg ) {
		console.info( ...this.contentInfo( ...msg ) );
	}
	
	warn( ...msg ) {
		console.warn( ...this.contentInfo( ...msg ) );
	}
	
	error( ...msg ) {
		console.error( ...this.contentInfo( ...msg ) );
	}
	
	contentInfo( ...msg ) {
		return [ this.header, `[${ (/* @__PURE__ */ new Date() ).toLocaleString( "zh-ch" ) }]`, ...msg ];
	}
}

function judgeVideoPage() {
	return !!document.URL.match( /^https:\/\/pc\.kmelearning\.com\/jxccb\/home\/courseplay\/.*/g );
}

function judgeStudyPage() {
	return !!document.URL.match( /^https:\/\/pc\.kmelearning\.com\/jxccb\/home\/training\/study\/.*/g );
}

function saveStudyPageId() {
	return +document.URL.match( new RegExp( "(?<=\\/)\\d+", "g" ) )[0];
}

function getElement( parent, selector, timeoutPerMs = 0 ) {
	return new Promise( ( resolve ) => {
		parent || ( parent = document.body );
		let result = parent.querySelector( selector );
		if ( result ) {
			return resolve( result );
		}
		let timer;
		const mutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
		if ( mutationObserver ) {
			const observer = new mutationObserver( ( mutations ) => {
				for ( let mutation of mutations ) {
					for ( let addedNode of mutation.addedNodes ) {
						if ( addedNode instanceof Element ) {
							result = addedNode.matches( selector ) ? addedNode : addedNode.querySelector( selector );
							if ( result ) {
								observer.disconnect();
								timer && clearTimeout( timer );
								return resolve( result );
							}
						}
					}
				}
			} );
			observer.observe( parent, {
				childList: true,
				subtree: true
			} );
			if ( timeoutPerMs > 0 ) {
				timer = setTimeout( () => {
					observer.disconnect();
					return resolve( null );
				}, timeoutPerMs );
			}
		}
	} );
}

class Sleep {
	/** 延时睡眠等待 */
	static time( delay = 1 ) {
		return new Promise( ( resolve ) => {
			setTimeout( resolve, delay * 1e3 );
		} );
	}
	
	/** 页面加载等待 */
	static windowLoad( delay = 0 ) {
		return new Promise( ( resolve ) => {
			window.addEventListener( "load", () => {
				setTimeout( resolve, delay * 1e3 );
			} );
		} );
	}
}

let domList = {};

async function getVideoList() {
	domList.videoList = await getElement( document.body, ".course-menu-container" );
	await Sleep.time( 0.5 );
}

function checkVideoList() {
	const videoList = domList.videoList;
	const notReadVideoList = videoList.querySelectorAll( ".course-menu-item:not(.isChapter) .course-menu-dot:not(:has(.anticon))" );
	const videoPage = notReadVideoList[0];
	print.log( "检查视频列表", videoPage );
	if ( notReadVideoList.length === 1 || !videoPage ) {
		getElement( document.body, "video" ).then(
			( video ) => {
				domList.video = video;
				videoEndEvent();
			}
		);
	}
	if ( videoPage ) {
		videoPage.click();
	}
	else {
		print.log( "全部视频已经完成观看" );
		if ( !sessionStorage.getItem( "closeFinishedEvent" ) ) {
			backHistoryInStudyList();
		}
	}
}

function backHistoryInStudyList() {
	if ( judgeStudyPage() ) {
		return;
	}
	else {
		const studyId = localStorage.getItem( "studyId" );
		if ( studyId ) {
			location.href = `https://pc.kmelearning.com/jxccb/home/training/study/${ studyId }`;
			return;
		}
		history.go( -1 );
	}
}

async function getVideoElement() {
	await Sleep.time( 2 );
	domList.video = await getElement( document.body, "video" );
}

function playVideo() {
	let videoElement = domList.video;
	videoElement.volume = 0;
	videoElement.autoplay = true;
	videoElement.play();
}

function videoEndEvent() {
	let videoElement = domList.video;
	videoElement.addEventListener( "ended", () => {
		print.log( "视频结束" );
		location.reload();
	} );
}

async function videoObserver( callback ) {
	if ( !judgeVideoPage() ) {
		return;
	}
	domList.videoContainer = await getElement( document.body, ".course-content-play-area" );
	const observer = new MutationObserver( ( e ) => {
		e.forEach( ( record ) => {
			const removeDom = record.removedNodes[0];
			if ( removeDom && removeDom.toString() === "[object HTMLDivElement]" && ( removeDom == null ? void 0 : removeDom.classList.contains( "course-player" ) ) ) {
				print.log( "视频跳转" );
				setTimeout( callback, 2e3 );
			}
		} );
	} );
	observer.observe( domList.videoContainer, {
		subtree: true,
		childList: true
	} );
}

async function getAllNotFinishedVideoList() {
	await getElement( document.body, ".panelHeader" );
	await Sleep.time( 0.5 );
	domList.videoList = document.querySelectorAll( ".panelHeader:not(:has(.completeLabel))" );
}

async function getNotFinishedVideoList() {
	const videoListContainer = domList.videoList[0];
	if ( videoListContainer ) {
		domList.videoListContainer = videoListContainer;
		domList.videoListContainer.click();
		await Sleep.time( 0.5 );
		return true;
	}
	else {
		return false;
	}
}

function getUnFinishedChildVideoList() {
	const childVideoListNodeList = document.querySelectorAll( ".panelContent" );
	for ( const childVideoList of childVideoListNodeList ) {
		const isFinishDom = childVideoList.querySelector( "use" );
		if ( isFinishDom.getAttribute( "xlink:href" ) === "#." ) {
			print.log( "进入未完成的视频" );
			childVideoList.click();
		}
	}
}

const print = new Info( "kmelearningAutoVideoPass" );

async function main() {
	if ( judgeVideoPage() ) {
		print.log( "进入视频页面" );
		await getVideoList();
		await checkVideoList();
		await getVideoElement();
		print.log( "播放视频", domList.video );
		playVideo();
		return;
	}
	else if ( judgeStudyPage() ) {
		print.log( "进入学习目录页面" );
		const studyId = saveStudyPageId();
		localStorage.setItem( "studyId", String( studyId ) );
		await getAllNotFinishedVideoList();
		if ( !await getNotFinishedVideoList() ) {
			return;
		}
		getUnFinishedChildVideoList();
	}
}

( () => {
	main();
	videoObserver( main );
	freshListenerPushState( () => {
		main();
		videoObserver( main );
	} );
	freshListenerPopstate( () => {
		main();
	} );
} )();
