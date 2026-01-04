// ==UserScript==
// @name Twitch Clips shortcuts (new UI) & Autoclaim
// @description Add shortcuts to clips page & claims channel points.
// @author Arxk
// @namespace https://gist.github.com/Arxk/e891a1d1c90d9004ac5bef34de2971b9
// @homepageURL https://github.com/Arxk/scripts
// @license MIT
// @version 1.2
// @match https://www.twitch.tv/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/406294/Twitch%20Clips%20shortcuts%20%28new%20UI%29%20%20Autoclaim.user.js
// @updateURL https://update.greasyfork.org/scripts/406294/Twitch%20Clips%20shortcuts%20%28new%20UI%29%20%20Autoclaim.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author Arxk
// ==/OpenUserJS==


/**
 * Declare insertionQ function to detect created DOM elements
 * https://github.com/naugtur/insertionQuery
 * 
 * insertion-query v1.0.3 (2016-01-20) 
 * license:MIT 
 * Zbyszek Tenerowicz <naugtur@gmail.com> (http://naugtur.pl/) 
 */

var insertionQ = (function () {
    "use strict";
    var sequence = 100,
        isAnimationSupported = false,
        animationstring = 'animationName',
        keyframeprefix = '',
        domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
        pfx = '',
        elm = document.createElement('div'),
        options = {
            strictlyNew: true,
            timeout: 20
        };
    if (elm.style.animationName) {
        isAnimationSupported = true;
    }
    if (isAnimationSupported === false) {
        for (var i = 0; i < domPrefixes.length; i++) {
            if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
                pfx = domPrefixes[i];
                animationstring = pfx + 'AnimationName';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                isAnimationSupported = true;
                break;
            }
        }
    }
    function listen(selector, callback) {
        var styleAnimation, animationName = 'insQ_' + (sequence++);
        var eventHandler = function (event) {
            if (event.animationName === animationName || event[animationstring] === animationName) {
                if (!isTagged(event.target)) {
                    callback(event.target);
                }
            }
        };
        styleAnimation = document.createElement('style');
        styleAnimation.innerHTML = '@' + keyframeprefix + 'keyframes ' + animationName + ' {  from {  outline: 1px solid transparent  } to {  outline: 0px solid transparent }  }' +
            "\n" + selector + ' { animation-duration: 0.001s; animation-name: ' + animationName + '; ' +
            keyframeprefix + 'animation-duration: 0.001s; ' + keyframeprefix + 'animation-name: ' + animationName + '; ' +
            ' } ';
        document.head.appendChild(styleAnimation);
        var bindAnimationLater = setTimeout(function () {
            document.addEventListener('animationstart', eventHandler, false);
            document.addEventListener('MSAnimationStart', eventHandler, false);
            document.addEventListener('webkitAnimationStart', eventHandler, false);
            //event support is not consistent with DOM prefixes
        }, options.timeout); //starts listening later to skip elements found on startup. this might need tweaking
        return {
            destroy: function () {
                clearTimeout(bindAnimationLater);
                if (styleAnimation) {
                    document.head.removeChild(styleAnimation);
                    styleAnimation = null;
                }
                document.removeEventListener('animationstart', eventHandler);
                document.removeEventListener('MSAnimationStart', eventHandler);
                document.removeEventListener('webkitAnimationStart', eventHandler);
            }
        };
    }
    function tag(el) {
        el.QinsQ = true; //bug in V8 causes memory leaks when weird characters are used as field names. I don't want to risk leaking DOM trees so the key is not '-+-' anymore
    }
    function isTagged(el) {
        return (options.strictlyNew && (el.QinsQ === true));
    }
    function topmostUntaggedParent(el) {
        if (isTagged(el.parentNode) || el.nodeName === 'BODY') {
            return el;
        } else {
            return topmostUntaggedParent(el.parentNode);
        }
    }
    function tagAll(e) {
        if (!e) { return; }
        tag(e);
        e = e.firstChild;
        for (; e; e = e.nextSibling) {
            if (e !== undefined && e.nodeType === 1) {
                tagAll(e);
            }
        }
    }
    //aggregates multiple insertion events into a common parent
    function catchInsertions(selector, callback) {
        var insertions = [];
        //throttle summary
        var sumUp = (function () {
            var to;
            return function () {
                clearTimeout(to);
                to = setTimeout(function () {
                    insertions.forEach(tagAll);
                    callback(insertions);
                    insertions = [];
                }, 10);
            };
        })();
        return listen(selector, function (el) {
            if (isTagged(el)) {
                return;
            }
            tag(el);
            var myparent = topmostUntaggedParent(el);
            if (insertions.indexOf(myparent) < 0) {
                insertions.push(myparent);
            }
            sumUp();
        });
    }
    //insQ function
    var exports = function (selector) {
        if (isAnimationSupported && selector.match(/[^{}]/)) {
            if (options.strictlyNew) {
                tagAll(document.body); //prevents from catching things on show
            }
            return {
                every: function (callback) {
                    return listen(selector, callback);
                },
                summary: function (callback) {
                    return catchInsertions(selector, callback);
                }
            };
        } else {
            return false;
        }
    };
    //allows overriding defaults
    exports.config = function (opt) {
        for (var o in opt) {
            if (opt.hasOwnProperty(o)) {
                options[o] = opt[o];
            }
        }
    };
    return exports;
})();
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = insertionQ;
}


/**
 *
 *  Start of script
 * 
 */

var elementReady = function (selector) {
	return new Promise(function (resolve) {
		var el = document.querySelector(selector);
		if (el) {
			resolve(el);
		}
		new MutationObserver(function (mutationRecords,observer) {
			Array.from(document.querySelectorAll(selector)).forEach(function (element) {
				resolve(element);
				observer.disconnect();
			});
		}).observe(document.documentElement, {
			childList:true,
			subtree:true
		});
	});
};

var htmlToElement = function (html) {
	var template = document.createElement('template');
	template.innerHTML = html.trim();
	return template.content.firstChild;
};


/**
 * Auto reclaim channel points
 */
 
insertionQ('div[data-test-selector="community-points-summary"] button.tw-button--success').every(function (claim) {
	claim.click();
});


/**
 * Profile button opens to Clips page
 */

insertionQ('a[data-a-target="watch-mode-to-home"]').every(function (home) {
	home.onclick = function () {
		elementReady('a[data-a-target="channel-home-tab-Clips"]').then(function (clips) {
			clips.click();
		});
	};
});


/**
 * Add a link to Clips on the channel header
 */

insertionQ('.home-header-sticky ul').every(function (menu) {
	var clips = htmlToElement('<li class="tw-align-items-center tw-c-text-base tw-flex-grow-0 tw-full-height tw-justify-content-center tw-tabs__tab" role="presentation" data-index="5"><a class="tw-block tw-c-text-inherit tw-full-height tw-full-width tw-interactive tw-pd-x-1 tw-tab-item" role="tab" data-a-target="channel-home-tab-Clips" href="' + menu.firstChild.firstChild.href + '/clips?filter=clips&range=24hr"data-ss1593159595="1"><div class="tw-align-left tw-flex tw-flex-column tw-full-height"><div class="tw-flex-grow-0"><div class="tw-font-size-4 tw-semibold">Clips</div></div><div class="tw-flex-grow-1"></div><div class="tw-flex-grow-0"></div></div></a></li>');
	clips.firstChild.onclick = function (e) {
		document.querySelector('a[data-a-target="channel-home-tab-Videos"]').click();
		elementReady('button[data-a-target="video-type-filter-dropdown"]').then(function (dropdown) {
			dropdown.click();
			document.querySelector('a[data-a-target="video-type-filter-clips"]').click();
			document.querySelector('button[data-a-target="time-filter-selection"]').click();
			document.querySelector('a[data-a-target="time-filter-option-24hr"]').click();
		});
		e.preventDefault();
	};
	menu.insertBefore(clips, menu.lastChild);

	// Style Clips link without FFZ
	if (typeof ffz === "undefined"){
		var active = document.querySelector('a[data-a-target="channel-home-tab-Clips"]').firstChild.lastChild;
		var clipsStatus = function () {
			active.clearChildren();
			active.parentNode.parentNode.classList.remove('tw-c-text-link');
			active.parentNode.parentNode.classList.add('tw-c-text-base');
			setTimeout(function () {
				if (location.pathname.indexOf('/clips') > -1) {
					active.clearChildren();
					active.parentNode.parentNode.classList.remove('tw-c-text-base');
					active.parentNode.parentNode.classList.add('tw-c-text-link');
					active.appendChild(htmlToElement('<div class="tw-tabs__active-indicator" data-test-selector="ACTIVE_TAB_INDICATOR"></div>'));
				}
			}, 250);
		};
		document.querySelector('a[data-a-target="channel-home-tab-Home"]').parentNode.onclick = clipsStatus;
		document.querySelector('a[data-a-target="channel-home-tab-About"]').parentNode.onclick = clipsStatus;
		document.querySelector('a[data-a-target="channel-home-tab-Schedule"]').parentNode.onclick = clipsStatus;
		document.querySelector('a[data-a-target="channel-home-tab-Videos"]').parentNode.onclick = clipsStatus;
		document.querySelector('a[data-a-target="channel-home-tab-Clips"]').parentNode.onclick = clipsStatus;
	}
});

addEventListener('load', function () {
	// Style Clips link with FFZ
	if (typeof ffz !== 'undefined') {
		ffz.site.router.on(':route', function (route) {
			var clips = document.querySelector('a[data-a-target="channel-home-tab-Clips"]');
			if(clips !== null) {
				var active = clips.firstChild.lastChild;
				active.clearChildren();
				active.parentNode.parentNode.classList.remove('tw-c-text-link');
				active.parentNode.parentNode.classList.add('tw-c-text-base');
				if (route && route.name === 'user-clips') {
					active.clearChildren();
					active.parentNode.parentNode.classList.remove('tw-c-text-base');
					active.parentNode.parentNode.classList.add('tw-c-text-link');
					active.appendChild(htmlToElement('<div class="tw-tabs__active-indicator" data-test-selector="ACTIVE_TAB_INDICATOR"></div>'));
				}
			}
		});
	}
});

if (typeof Element.prototype.clearChildren === 'undefined') {
	Object.defineProperty(Element.prototype, 'clearChildren', {
		configurable: true,
		enumerable: false,
		value: function () {
			while (this.firstChild) this.removeChild(this.lastChild);
		}
	});
}
