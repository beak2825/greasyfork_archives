// ==UserScript==
// @name         Better-Native-Video
// @namespace    https://tribbe.dev
// @version      1.0.1
// @description  Add keyboard support to native HTML5 video player.
// @author       Tribbe
// @include http://*/*
// @include https://*/*
// @downloadURL https://update.greasyfork.org/scripts/438100/Better-Native-Video.user.js
// @updateURL https://update.greasyfork.org/scripts/438100/Better-Native-Video.meta.js
// ==/UserScript==

"use strict";

const videoAttribute = "betterHtml5VideoType",
      timeoutAttribute = "betterHtml5VideoClickTimeout";

let toggleChecked, toggleEnabled, observer, dirVideo, settings = {
	firstClick:      "focus",
	dblFullScreen:   true,
	clickDelay:      0.3,
	skipNormal:      5,
	skipShift:       10,
	skipCtrl:        1,
	allowWOControls: false,
};

const shortcutFuncs = {
	toggleCaptions: function(v){
		const validTracks = [];
		for(let i = 0; i < v.textTracks.length; ++i){
			const tt = v.textTracks[i];
			if(tt.mode === "showing"){
				tt.mode = "disabled";
				if(v.textTracks.addEventListener){
					// If text track event listeners are supported
					// (they are on the most recent Chrome), add
					// a marker to remember the old track. Use a
					// listener to delete it if a different track
					// is selected.
					v.cbhtml5vsLastCaptionTrack = tt.label;
					function cleanup(e){
						for(let i = 0; i < v.textTracks.length; ++i){
							const ott = v.textTracks[i];
							if(ott.mode === "showing"){
								delete v.cbhtml5vsLastCaptionTrack;
								v.textTracks.removeEventListener("change", cleanup);
								return;
							}
						}
					}
					v.textTracks.addEventListener("change", cleanup);
				}
				return;
			}else if(tt.mode !== "hidden"){
				validTracks.push(tt);
			}
		}
		// If we got here, none of the tracks were selected.
		if(validTracks.length === 0){
			return true; // Do not prevent default if no UI activated
		}
		// Find the best one and select it.
		validTracks.sort(function(a, b){

			if(v.cbhtml5vsLastCaptionTrack){
				const lastLabel = v.cbhtml5vsLastCaptionTrack;

				if(a.label === lastLabel && b.label !== lastLabel){
					return -1;
				}else if(b.label === lastLabel && a.label !== lastLabel){
					return 1;
				}
			}

			const aLang = a.language.toLowerCase(),
			      bLang = b.language.toLowerCase(),
			      navLang = navigator.language.toLowerCase();

			if(aLang === navLang && bLang !== navLang){
				return -1;
			}else if(bLang === navLang && aLang !== navLang){
				return 1;
			}

			const aPre = aLang.split("-")[0],
			      bPre = bLang.split("-")[0],
			      navPre = navLang.split("-")[0];

			if(aPre === navPre && bPre !== navPre){
				return -1;
			}else if(bPre === navPre && aPre !== navPre){
				return 1;
			}

			return 0;
		})[0].mode = "showing";
	},

	togglePlay: function(v){
		if (v.paused) {
			v.play();
        } else {
			v.pause();
        }
	},

	toStart: function(v){
		v.currentTime = 0;
	},

	toEnd: function(v){
		v.currentTime = v.duration;
	},

	skipLeft: function(v,key,shift,ctrl){
		if (shift) {
			v.currentTime -= settings.skipShift;
		} else if(ctrl) {
			v.currentTime -= settings.skipCtrl;
		} else {
			v.currentTime -= settings.skipNormal;
        }
	},

	skipRight: function(v,key,shift,ctrl){
		if (shift) {
			v.currentTime += settings.skipShift;
		} else if (ctrl) {
			v.currentTime += settings.skipCtrl;
		} else {
			v.currentTime += settings.skipNormal;
        }
	},

	increaseVol: function(v){
		if (v.volume <= 0.9) v.volume += 0.1;
		else v.volume = 1;
	},

	decreaseVol: function(v){
		if (v.volume >= 0.1) v.volume -= 0.1;
		else v.volume = 0;
	},

	toggleMute: function(v){
		v.muted = !v.muted;
	},

	toggleFS: function(v){
		if (document.webkitFullscreenElement) {
			document.webkitExitFullscreen();
        } else {
			v.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
	},

	reloadVideo: function(v){
		const currTime = v.currentTime;
		v.load();
		v.currentTime = currTime;
	},

	slowOrPrevFrame: function(v,key,shift){
		if (shift) { // Less-Than
			v.playbackRate -= 0.25;
        } else { // Comma
			v.currentTime -= 1/60;
        }
	},

	fastOrNextFrame: function(v,key,shift){
		if (shift) { // Greater-Than
			v.playbackRate += 0.25;
        } else { // Period
			v.currentTime += 1/60;
        }
	},

	normalSpeed: function(v,key,shift){
		if(shift) { // ?
			v.playbackRate = v.defaultPlaybackRate;
        }
	},

	toPercentage: function(v,key){
		v.currentTime = v.duration * (key - 48) / 10.0;
	},
};

const keyFuncs = {
    32 : shortcutFuncs.togglePlay,//       Space
	75 : shortcutFuncs.togglePlay, //      K
	35 : shortcutFuncs.toEnd,//            End
	48 : shortcutFuncs.toStart,//          0
	36 : shortcutFuncs.toStart,//          Home
	37 : shortcutFuncs.skipLeft,//         Left arrow
	74 : shortcutFuncs.skipLeft,//         J
	39 : shortcutFuncs.skipRight,//        Right arrow
	76 : shortcutFuncs.skipRight,//        L
	38 : shortcutFuncs.increaseVol,//      Up arrow
	40 : shortcutFuncs.decreaseVol,//      Down arrow
	77 : shortcutFuncs.toggleMute,//       M
	70 : shortcutFuncs.toggleFS,//         F
	67 : shortcutFuncs.toggleCaptions,//   C
	82 : shortcutFuncs.reloadVideo,//      R
	188: shortcutFuncs.slowOrPrevFrame,//  Comma or Less-Than
	190: shortcutFuncs.fastOrNextFrame,//  Period or Greater-Than
	191: shortcutFuncs.normalSpeed,//      Forward slash or ?
	49 : shortcutFuncs.toPercentage,//     1
	50 : shortcutFuncs.toPercentage,//     2
	51 : shortcutFuncs.toPercentage,//     3
	52 : shortcutFuncs.toPercentage,//     4
	53 : shortcutFuncs.toPercentage,//     5
	54 : shortcutFuncs.toPercentage,//     6
	55 : shortcutFuncs.toPercentage,//     7
	56 : shortcutFuncs.toPercentage,//     8
	57 : shortcutFuncs.toPercentage,//     9
};

function registerDirectVideo(v, force){
	ignoreAllIndirectVideos();
	if(dirVideo){
		ignoreDirectVideo();
	}
	if(force !== undefined ? force : v.hasAttribute("controls")){
		dirVideo = v;
		v.dataset[videoAttribute] = "direct";
	}else{
		v.dataset[videoAttribute] = "";
	}
}

function ignoreDirectVideo(reregister){
	if(reregister && document.body.contains(dirVideo)){
		registerVideo(dirVideo);
		dirVideo.focus();
	}else{
		dirVideo.dataset[videoAttribute] = "";
	}
	dirVideo = undefined;
}

function registerVideo(v, force){
	v.dataset[videoAttribute] =
		(force !== undefined ? force : v.hasAttribute("controls")) ?
		"normal" : "";
}

function ignoreVideo(v){
	v.dataset[videoAttribute] = "";
}

function registerAllNewVideos(vs){
	for(let i = vs.length - 1; i >= 0; --i){
		if(vs[i].dataset[videoAttribute] === undefined){
			registerVideo(vs[i]);
		}
	}
}

function ignoreAllIndirectVideos(){
	const rv = document.getElementsByTagName("video");
	for(let i = rv.length - 1; i >= 0; --i){
		if(rv[i] !== dirVideo) ignoreVideo(rv[i]);
	}
}

function isValidTarget(el){
	return (
		(dirVideo && (el === dirVideo
		           || el === document.body
		           || el === document.documentElement))
		|| (el.dataset && el.dataset[videoAttribute])
	);
}

function handleClick(e){
	if(!isValidTarget(e.target)){
		return true; // Do not prevent default
	}
	const v = dirVideo || e.target;
	if(settings.firstClick === "play" || dirVideo || document.activeElement === v){
		if(v.dataset[timeoutAttribute]){
			clearTimeout(v.dataset[timeoutAttribute]|0);
			delete v.dataset[timeoutAttribute];
		}
		if(settings.dblFullScreen && settings.clickDelay > 0){
			v.dataset[timeoutAttribute] = setTimeout(function(){
				shortcutFuncs.togglePlay(v);
				delete v.dataset[timeoutAttribute];
			}, settings.clickDelay * 1000);
		}else{
			shortcutFuncs.togglePlay(v);
		}
	}
	v.focus();
	e.preventDefault();
	e.stopPropagation();
	return false
}

function handleDblClick(e){
	if(!(settings.dblFullScreen && isValidTarget(e.target))){
		return true; // Do not prevent default
	}
	const v = dirVideo || e.target;
	if(v.dataset[timeoutAttribute]){
		clearTimeout(v.dataset[timeoutAttribute]|0);
		delete v.dataset[timeoutAttribute];
	}
	shortcutFuncs.toggleFS(v);
	e.preventDefault();
	e.stopPropagation();
	return false
}

function handleKeyDown(e){
	if(!isValidTarget(e.target) || e.altKey || e.metaKey){
		return true; // Do not activate
	}
	const func = keyFuncs[e.keyCode];
	if(func){
		if((func.length < 3 && e.shiftKey) ||
		   (func.length < 4 && e.ctrlKey)){
			return true; // Do not activate
		}
		func(dirVideo || e.target, e.keyCode, e.shiftKey, e.ctrlKey);
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	return true; // Do not prevent default if no UI activated
}

function handleKeyOther(e){
	if(!isValidTarget(e.target) || e.altKey || e.metaKey){
		return true; // Do not prevent default
	}
	const func = keyFuncs[e.keyCode];
	if(func){
		if((func.length < 3 && e.shiftKey) ||
		   (func.length < 4 && e.ctrlKey)){
			return true; // Do not prevent default
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
	return true; // Do not prevent default if no UI activated
}

function handleFullscreen(){
	if(document.webkitFullscreenElement
	&& document.webkitFullscreenElement.dataset[videoAttribute]){
		document.webkitFullscreenElement.focus();
	}
}

function handleMutationRecords(mrs){
	for(let i = mrs.length - 1; i >= 0; --i){
		if(mrs[i].attributeName === "controls"){
			const t = mrs[i].target;
			if(!t.hasAttribute("controls")){
				switch(t.dataset[videoAttribute]){
				case "direct":
					ignoreDirectVideo(false);
					break;
				case "normal":
					ignoreVideo(t);
					break;
				}
			}else if(t.tagName.toLowerCase() === "video"){
				if(document.body.children.length === 1
				&& document.body.firstElementChild === t){
					registerDirectVideo(t);
				}else{
					registerVideo(t);
					t.focus();
				}
			}
		}else if(mrs[i].type === "childList"){
			if(dirVideo && (document.body.children.length !== 1
			|| document.body.firstElementChild !== dirVideo)){
				ignoreDirectVideo(true);
			}
			if(mrs[i].removedNodes){
				for(let j = mrs[i].removedNodes.length - 1; j >= 0; --j){
					if(mrs[i].removedNodes[j] === dirVideo){
						ignoreDirectVideo();
					}
					// No need to ignore other videos currently,
					// as it's just setting an attribute.
				}
			}
			if(document.body.children.length === 1
			&& document.body.firstElementChild !== dirVideo
			&& document.body.firstElementChild.tagName.toLowerCase() === "video"
			&& document.body.firstElementChild.dataset[videoAttribute] !== ""){
				registerDirectVideo(document.body.firstElementChild);
			}else if(mrs[i].addedNodes){
				for(let j = mrs[i].addedNodes.length - 1; j >= 0; --j){
					const an = mrs[i].addedNodes[j];
					if(an.tagName && an.tagName.toLowerCase() === "video"){
						if(an.dataset[videoAttribute] === undefined){
							registerVideo(an);
						}
					}else if(an.getElementsByTagName){
						registerAllNewVideos(an.getElementsByTagName("video"));
					}
				}
			}
		}
	}
}

function enableExtension(){
	// useCapture: Handler fired while event is bubbling down instead of up
	document.addEventListener("webkitfullscreenchange", handleFullscreen, true);

	document.addEventListener("click", handleClick, true);
	document.addEventListener("dblclick", handleDblClick, true);
	document.addEventListener("keydown", handleKeyDown, true);
	document.addEventListener("keypress", handleKeyOther, true);
	document.addEventListener("keyup", handleKeyOther, true);

	observer = observer || new MutationObserver(handleMutationRecords);
	observer.observe(document.body, {
		childList: true,
		attributes: true,
		attributeFilter: ["controls"],
		subtree: true
	});

	if(document.body.children.length === 1
	&& document.body.firstElementChild.tagName.toLowerCase() === "video"
	&& document.body.firstElementChild.dataset[videoAttribute] !== ""){
		registerDirectVideo(document.body.firstElementChild);
	}else{
		registerAllNewVideos(document.getElementsByTagName("video"));
	}
}

enableExtension();