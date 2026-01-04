// ==UserScript==
// @name         Lobster Keys
// @description  Keybindings for lobste.rs
// @namespace    https://rodaine.com
// @source       https://github.com/rodaine/lobster-keys.git
// @version      0.1.0
// @author       Chris Roche <github@rodaine.com>
// @match        https://lobste.rs/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/383557/Lobster%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/383557/Lobster%20Keys.meta.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/**
 * Story element on the document.
 */
class Story {
    constructor(el) {
        this._el = el;
    }
    /**
     * Extracts all stories in-order from `d`.
     *
     * @param d Document
     */
    static FromDoc(d = window.document) {
        let els = d.getElementsByClassName('story');
        let out = [];
        for (let el of els) {
            out.push(new Story(el));
        }
        return out;
    }
    /**
     * Selects this story, making the keybindings apply to this Story. If a
     * different story was previously seelcted, that story should be
     * unfocused first.
     */
    focus() {
        this._el.classList.add(Story.focusCls);
        let url = this.getAnchor(".u-url" /* URL */);
        if (url) {
            url.focus();
            url.blur();
        }
        this.scrollIntoView();
    }
    /**
     * Deselects this story.
     */
    unfocus() {
        this._el.classList.remove(Story.focusCls);
    }
    /**
     * Opens the Story's URL
     */
    open() { this.click(".u-url" /* URL */); }
    /**
     * Opens the domain search page for the Story's hostname
     */
    domain() { this.click(".domain" /* Domain */); }
    /**
     * Opens the Story's author's profile page.
     */
    author() { this.click(".u-author" /* Author */); }
    /**
     * Opens the flag dropdown menu, and moves focus to the first option.
     */
    flag() {
        this.click(".flagger" /* Flag */);
        let opts = window.document.querySelector('#downvote_why a');
        opts && opts.focus();
    }
    /**
     * Toggles whether or not the Story is hidden.
     */
    hide() { this.click(".hider" /* Hide */); }
    /**
     * Toggles whether or not the Story is saved.
     */
    save() { this.click(".saver" /* Save */); }
    /**
     * Opens the Story's comments page.
     */
    comments() { this.click(".comments_label a" /* Comments */); }
    /**
     * Toggles the Story's upvote arrow.
     */
    upvote() { this.click(".upvoter" /* Upvote */); }
    getAnchor(a) {
        return this._el.querySelector(a);
    }
    click(a) {
        let anchor = this.getAnchor(a);
        anchor && anchor.click();
    }
    scrollIntoView() {
        let bound = this._el.getBoundingClientRect();
        if (bound.top < 0
            || bound.left < 0
            || bound.bottom > (window.innerHeight || document.documentElement.clientHeight)
            || bound.right > (window.innerWidth || document.documentElement.clientWidth)) {
            return this._el.scrollIntoView(Story.scrollOpts);
        }
    }
}
/**
 * The class name applied to the selected [[Story]]
 */
Story.focusCls = 'lobster-keys-focus';
Story.scrollOpts = { block: "nearest" };
/**
 * Interaction controller for the keybindings
 */
class LobstersKeyController {
    /**
     * Attaches a controller to `d`, listening for events and injecting styles
     * if a [[Story]] list is detected.
     *
     * @param d Document
     */
    constructor(d = window.document) {
        this.stories = Story.FromDoc(d);
        if (this.stories.length > 0) {
            document.addEventListener('keyup', (e) => { this.handleKeyUp(e); });
            this.attachStyles(d);
        }
    }
    get index() { return this._idx; }
    set index(i) {
        if (i === undefined) {
            this._idx = undefined;
            return;
        }
        if (i < 0) {
            i = 0;
        }
        else if (i >= this.stories.length) {
            i = this.stories.length - 1;
        }
        this._idx = i;
    }
    get story() {
        let i = this.index;
        return i === undefined ? undefined : this.stories[i];
    }
    changeStory(d) {
        if (this.index === undefined) {
            switch (d) {
                case 1 /* Next */:
                    this.index = 0;
                    break;
                case 0 /* Previous */:
                    this.index = this.stories.length - 1;
                    break;
            }
        }
        else {
            this.story && this.story.unfocus();
            switch (d) {
                case 1 /* Next */:
                    this.index++;
                    break;
                case 0 /* Previous */:
                    this.index--;
                    break;
            }
        }
        this.story && this.story.focus();
    }
    changePage(d) {
        switch (d) {
            case 0 /* Previous */:
                let prev = window.document.querySelector('.morelink a:first-child');
                prev && prev.innerText.indexOf('<<') > -1 && prev.click();
                break;
            case 1 /* Next */:
                let next = window.document.querySelector('.morelink a:last-child');
                next && next.innerText.indexOf('>>') > -1 && next.click();
                break;
        }
    }
    handleKeyUp(e) {
        switch (e.code) {
            case "KeyJ" /* J */:
                return this.changeStory(1 /* Next */);
            case "KeyK" /* K */:
                return this.changeStory(0 /* Previous */);
            case "BracketLeft" /* OpenBracket */:
                return this.changePage(0 /* Previous */);
            case "BracketRight" /* CloseBracket */:
                return this.changePage(1 /* Next */);
        }
        let story = this.story;
        if (story) {
            switch (e.code) {
                case "Enter" /* Enter */:
                    return story.open();
                case "KeyA" /* A */:
                    return story.author();
                case "KeyC" /* C */:
                    return story.comments();
                case "KeyD" /* D */:
                    return story.domain();
                case "KeyF" /* F */:
                    return story.flag();
                case "KeyH" /* H */:
                    return story.hide();
                case "KeyS" /* S */:
                    return story.save();
                case "KeyU" /* U */:
                    return story.upvote();
            }
        }
    }
    attachStyles(d) {
        let styles = d.createElement('style');
        styles.innerHTML = `.${Story.focusCls} { background-color: #fffcd799; }`;
        d.body.appendChild(styles);
    }
}
new LobstersKeyController(window.document);


/***/ })
/******/ ]);