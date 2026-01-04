// ==UserScript==
// @name Old Reddit Markdown Editor
// @description Adds a togglable markdown editor to (old) reddit.
// @author Arxk
// @namespace https://gist.github.com/Arxk/7ebc8c0118773c7e94ac842544d081fa
// @homepageURL https://github.com/Arxk/scripts
// @license MIT
// @version 1.0
// @match http*://*.reddit.com/*
// @require https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js
// @resource simplemdeCSS https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.css
// @grant GM_addStyle
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/408867/Old%20Reddit%20Markdown%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/408867/Old%20Reddit%20Markdown%20Editor.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author Arxk
// ==/OpenUserJS==

const newCSS = GM_getResourceText("simplemdeCSS");
GM_addStyle(newCSS);


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
 *  HTML String to DOM Element
 * 
 */

var htmlToElement = function (html) {
	var template = document.createElement('template');
	template.innerHTML = html.trim();
	return template.content.firstChild;
};


/**
 * Create Markdown Editor Toggle
 */

const toggleEditor = function(editor, enable = true) {
	if (editor.querySelector('.editor-toggle') === null) {
		editor.querySelector('.bottom-area').insertBefore(htmlToElement('<a class="editor-toggle reddiquette" style="cursor: pointer;">toggle editor</a>'), editor.querySelector('.bottom-area .help-toggle'));
	}
	const toggle = editor.querySelector('.editor-toggle');
	toggle.onclick = function (e) {
		const editor = e.target.parentNode.parentNode;
		const textarea = editor.querySelector('.md textarea');
		if (textarea.simplemde === undefined) {
			const simplemde = new SimpleMDE({
				element: textarea,
				showIcons: ['code', 'table'],
				hideIcons: ['image', 'side-by-side', 'fullscreen', 'guide']
			});
			textarea.simplemde = simplemde;
		} else {
			textarea.simplemde.toTextArea();
			textarea.simplemde = undefined;
		}
	}
	if (enable) {
		toggle.click();
	}
}


/**
 * Appends Toggle button to comments
 */

insertionQ('.comment .usertext-edit').every((editor) => {
	const post = document.querySelector('.commentarea > .usertext > .usertext-edit');
	if (post !== null) {
		const comment = post.querySelector('.md textarea');
		if (comment.simplemde !== undefined) {
			const removeElements = (elms) => elms.forEach(el => el.remove());
			const textarea = editor.querySelector(".md textarea");
			textarea.value = '';
			textarea.style.display = 'block';
			removeElements(editor.querySelectorAll(".md div"));
		}
	}
	toggleEditor(editor);
	const cancel = editor.querySelector('.bottom-area > .usertext-buttons .cancel');
	const listener = cancel.addEventListener('click', (e) => {
		const editor = e.target.parentNode.parentNode.parentNode;
		const textarea = editor.querySelector('.md textarea');
		if (textarea.simplemde !== undefined) {
			textarea.value = '';
			textarea.simplemde.toTextArea();
			textarea.simplemde = undefined;
		}
	}, { once: true });
});


/**
 * Appends Toggle button to View post & New post
 */

addEventListener('load', () => {
	const post = document.querySelector('.commentarea > .usertext > .usertext-edit');
	if (post !== null) {
		toggleEditor(post, false);
	}
	const create = document.querySelector('.roundfield-content > .usertext > .usertext-edit');
	if (create !== null) {
		toggleEditor(create, false);
	}
});
