// ==UserScript==
// @name         Forum Companion
// @namespace    ForumCompanionScript
// @version      16
// @description  Script to help users keep an eye and take notes about other users, favorite posts.
// @author       StrayDog
// @match        https://www.resetera.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-popup-overlay/2.1.1/jquery.popupoverlay.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/jquery.mark.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.serializeJSON/3.2.1/jquery.serializejson.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/alasql/3.1.0/alasql.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js
// @icon         https://www.google.com/s2/favicons?domain=resetera.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @license      CC0 (Creative Commons Zero)
// @downloadURL https://update.greasyfork.org/scripts/372121/Forum%20Companion.user.js
// @updateURL https://update.greasyfork.org/scripts/372121/Forum%20Companion.meta.js
// ==/UserScript==

// ####################################################################################################################################
// ABOUT:
// SOURCE CODE: https://greasyfork.org/en/scripts/372121-
// REF:
// - js style guide     https://github.com/airbnb/javascript
// - reserved words     http://www.javascripter.net/faq/reserved.htm
// - template strings   https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals
// - icons              https://fontawesome.com/v4.7.0/cheatsheet/
// - new icons          https://fonts.google.com/icons?selected=Material+Icons
/*global $:false, jQuery:false, debug:false, alasql:false, Noty:false, jscolor:false */
((() => { // avoid conflicts

    const DEBUG_MODE = 0;
    const SCRIPT_VERSION = 16;
    const DEFAULT_ICON_OFF_COLOR = "#ae8fd6";
    const DEFAULT_ICON_ON_COLOR = "#8050bf";
    const ICON_NOTE_OFF = `<span class="material-icons md-24">description</span>`;
    const ICON_NOTE_ON = `<span class="css-uscr-icon-color-on"><span class="material-icons md-24">description</span></span>`;
    const ICON_HIGHLIGHT_OFF = `<span class="material-icons md-24">highlight</span>`;
    const ICON_HIGHLIGHT_ON = `<span class="css-uscr-icon-color-on"><span class="material-icons md-24">highlight</span></span>`;
    const ICON_FAV_OFF = `<span class="material-icons md-24">favorite</span>`;
    const ICON_FAV_ON = `<span class="css-uscr-icon-color-on"><span class="material-icons md-24">favorite</span></span>`;
    const DEFAULT_CONFIG = {
        forum_width: 80,
        forum_font: "",
        forum_theme: "light",
        hightlight_customtext: "",
        hightlight_color: "FFFFFF",
        hightlight_bgcolor: "FF0000",
        members_juniors_newcolor_used: true,
        members_juniors_newcolor_color: "DC4B2C",
        banned_users_use_bgcolor: 1,
        banned_users_bgcolor: "FF0000",
    };
    const MARKJS_OPTIONS = {
        separateWordSearch: false,
        wildcards: "disabled",
        accuracy: "exactly",
        element: "mark",
        className: "uscr-text-highlight",
        caseSensitive: true,
    };
    const cssFiles = [
        "https://fonts.googleapis.com/icon?family=Material+Icons",
        "https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css"
    ];

    // ####################################################################################################################################
    let mybase, configs;
    let storage = {
        version: 1,
        // compress: false,
        options: {
            prefix: 'uscr_'
        },

        // Greasemonkey storage API
        read: function (key, defaultValue) {
            const raw = GM_getValue(this._prefix(key), defaultValue);
            // let str = (this.compress) ? LZString.decompressFromUTF16(raw) : raw;
            return this._parse(raw);
        },
        write: function (key, value) {
            const raw = this._stringify(value);
            // let str = (this.compress) ? LZString.compressToUTF16(raw) : raw;
            return GM_setValue(this._prefix(key), raw);
        },
        delete: function (key) {
            return GM_deleteValue(this._prefix(key));
        },
        readKeys: function () {
            return GM_listValues();
        },

        // browser localstorage
        // read: function (key, defaultValue) {
        //     const raw = localStorage.getItem(this._prefix(key), defaultValue);
        //     const val = raw || defaultValue;
        //     // const str = (this.compress) ? LZString.decompressFromUTF16(val) : val;
        //     // return this._parse(str);
        //     return this._parse(val);
        // },
        // write: function (key, value) {
        //     const raw = this._stringify(value);
        //     // let str = (this.compress) ? LZString.compressToUTF16(raw) : raw;
        //     localStorage.setItem(this._prefix(key), raw);
        //     return;
        // },
        // delete: function (key) {
        //     return localStorage.removeItem(this._prefix(key));
        // },
        // readKeys: function () {
        //     let keys = [];
        //     for(let i=0, l=localStorage.length; i < l; i++){
        //        keys.push( localStorage.getItem(localStorage.key(i)) );
        //     }
        //     return keys;
        // },

        // "Set" means "add if absent, replace if present."
        set: function (key, value) {
            let savedVal = this.read(key);

            if (typeof savedVal === 'undefined' || !savedVal) {
                // add if absent
                return this.add(key, value);
            } else {
                // replace if present
                this.write(key, value);
                return true;
            }
        },
        // "Add" means "add if absent, do nothing if present" (if a uniquing collection).
        add: function (key, value) {
            let savedVal = this.read(key, false);

            if (typeof savedVal === 'undefined' || !savedVal) {
                this.write(key, value);
                return true;
            } else {
                if (this._isArray(savedVal)) { // is array
                    let index = savedVal.indexOf(value);

                    if (index !== -1) {
                        // do nothing if present
                        return false;
                    } else {
                        // add if absent
                        savedVal.push(value);
                        this.write(key, savedVal);
                        return true;
                    }
                } else if (this._isObject(savedVal)) { // is object
                    // merge obj value on obj
                    let result, objToMerge = value;

                    result = Object.assign(savedVal, objToMerge);
                    this.write(key, result);
                    return false;
                }
                return false;
            }
        },
        // "Replace" means "replace if present, do nothing if absent."
        replace: function (key, itemFind, itemReplacement) {
            let savedVal = this.read(key, false);

            if (typeof savedVal === 'undefined' || !savedVal) {
                // do nothing if absent
                return false;
            } else {
                if (this._isArray(savedVal)) { // is Array
                    let index = savedVal.indexOf(itemFind);

                    if (index !== -1) {
                        // replace if present
                        savedVal[index] = itemReplacement;
                        this.write(key, savedVal);
                        return true;
                    } else {
                        // do nothing if absent
                        return false;
                    }
                } else if (this._isObject(savedVal)) {
                    // is Object
                    // replace property's value
                    savedVal[itemFind] = itemReplacement;
                    this.write(key, savedVal);
                    return true;
                }
                return false;
            }
        },
        // "Remove" means "remove if present, do nothing if absent."
        remove: function (key, value) {
            if (typeof value === 'undefined') { // remove key
                this.delete(key);
                return true;
            } else { // value present
                let savedVal = this.read(key);

                if (typeof savedVal === 'undefined' || !savedVal) {
                    return true;
                } else {
                    if (this._isArray(savedVal)) { // is Array
                        let index = savedVal.indexOf(value);

                        if (index !== -1) {
                            // remove if present
                            savedVal.splice(index, 1);
                            this.write(key, savedVal);
                            return true;
                        } else {
                            // do nothing if absent
                            return false;
                        }
                    } else if (this._isObject(savedVal)) { // is Object
                        let property = value;

                        delete savedVal[property];
                        this.write(key, savedVal);
                        return true;
                    }
                    return false;
                }
            }
        },
        get: function (key, defaultValue) {
            return this.read(key, defaultValue);
        },
        getAll: function () {
            const keys = this._listKeys();
            let obj = {};

            for (let i = 0, len = keys.length; i < len; i++) {
                obj[keys[i]] = this.read(keys[i]);
            }
            return obj;
        },
        getKeys: function () {
            return this._listKeys();
        },
        getPrefix: function () {
            return this.options.prefix;
        },
        empty: function () {
            const keys = this._listKeys();

            for (let i = 0, len = keys.lenght; i < len; i++) {
                this.delete(keys[i]);
            }
        },
        has: function (key) {
            return this.get(key) !== null;
        },
        forEach: function (callbackFunc) {
            const allContent = this.getAll();

            for (let prop in allContent) {
                callbackFunc(prop, allContent[prop]);
            }
        },
        _parse: function (value) {
            if (this._isJson(value)) {
                return JSON.parse(value);
            }
            return value;
        },
        _stringify: function (value) {
            if (this._isJson(value)) {
                return value;
            }
            return JSON.stringify(value);
        },
        _listKeys: function (usePrefix = false) {
            const prefixed = this.readKeys();
            let unprefixed = [];

            if (usePrefix) {
                return prefixed;
            } else {
                for (let i = 0, len = prefixed.length; i < len; i++) {
                    unprefixed[i] = this._unprefix(prefixed[i]);
                }
                return unprefixed;
            }
        },
        _prefix: function (key) {
            return this.options.prefix + key;
        },
        _unprefix: function (key) {
            return key.substring(this.options.prefix.length);
        },
        _isJson: function (item) {
            try {
                JSON.parse(item);
            } catch (e) {
                return false;
            }
            return true;
        },
        _isObject: function (a) {
            return (!!a) && (a.constructor === Object);
        },
        _isArray: function (a) {
            return (!!a) && (a.constructor === Array);
        }
    };

    if (!String.prototype.includes) {
        String.prototype.includes = function (search, start) {
            'use strict';

            if (search instanceof RegExp) {
                throw TypeError('first argument must not be a RegExp');
            }
            if (start === undefined) { start = 0; }
            return this.indexOf(search, start) !== -1;
        };
    }

    // function getRGB(str) {
    //     let match = str.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);

    //     return match ? [match[1], match[2], match[3]] : [0, 0, 0];
    // }

    // function bgIsDark() {
    //     let body = document.getElementsByTagName("body");
    //     let style = window.getComputedStyle(body[0]);
    //     let rgb = style.getPropertyValue("background-color");
    //     let [red, green, blue] = getRGB(rgb);
    //     let luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue; // per ITU-R BT.709
    //     debug("luma", luma);
    //     return (luma < 40);
    // }

    // https://stackoverflow.com/questions/7298364/using-jquery-and-json-to-populate-forms
    function populateForm($form, data) {
        $.each(data, (key, value) => { // all json fields ordered by name
            let $ctrls, $ctrl;

            if (value instanceof Array) {
                $ctrls = $form.find(`[name="${key}[]"]`); //all form elements for a name. Multiple checkboxes can have the same name, but different values
            } else {
                $ctrls = $form.find(`[name="${key}"]`);
            }
            if ($ctrls.is("select")) { //special form types
                $("option", $ctrls).each(function () {
                    if (this.value == value) {
                        this.selected = true;
                    }
                });
            } else if ($ctrls.is("textarea")) {
                $ctrls.val(value);
            } else {
                switch ($ctrls.attr("type")) { //input type
                    case "text":
                    case "range":
                    case "hidden":
                        $ctrls.val(value);
                        break;
                    case "radio":
                        if ($ctrls.length >= 1) {
                            $.each($ctrls, function (index) { // every individual element
                                let elemValue = $(this).attr("value");
                                let singleVal = value;
                                let elemValueInData = singleVal;

                                if (elemValue == value) {
                                    $(this).prop("checked", true);
                                } else {
                                    $(this).prop("checked", false);
                                }
                            });
                        }
                        break;
                    case "checkbox":
                        if ($ctrls.length > 1) {
                            $.each($ctrls, function (index) { // every individual element
                                let elemValue = $(this).attr("value");
                                let elemValueInData;
                                let singleVal;

                                for (let i = 0; i < value.length; i++) {
                                    singleVal = value[i];
                                    if (singleVal == elemValue) {
                                        elemValueInData = singleVal;
                                    }
                                }
                                if (elemValueInData) {
                                    $(this).prop("checked", true);
                                } else {
                                    $(this).prop("checked", false);
                                }
                            });
                        } else if ($ctrls.length == 1) {
                            $ctrl = $ctrls;
                            if (value) {
                                $ctrl.prop("checked", true);
                            } else {
                                $ctrl.prop("checked", false);
                            }
                        }
                        break;
                }
            }
        });
    }

    function db_check_version() {
        const stored_ver = parseInt(storage.get("version", 0), 10);
        let upgrade = false;

        if (stored_ver === 0) { // first run
            setup_storage();
        } else if (stored_ver === 111) {
            upgrade_v2();
            debug("set new version", SCRIPT_VERSION);
        }
    }

    function setup_storage() {
        storage.set("favorites", []);
        storage.set("configs", DEFAULT_CONFIG);
        storage.set("version", SCRIPT_VERSION);
    }

    function db_init() {
        let users_db = storage.get("users", []);
        let favorites_db = storage.get("favorites", []);

        mybase = new alasql.Database("mybase");
        mybase.exec("CREATE TABLE users (id INT, name STRING, highlight INT, icon STRING, icon_color STRING, note STRING)");
        mybase.exec("CREATE TABLE favorites (postid INT, username STRING, note STRING)");
        if (users_db.length >= 1) {
            alasql.databases.mybase.tables.users.data = users_db;
        }
        if (favorites_db.length >= 1) {
            alasql.databases.mybase.tables.favorites.data = favorites_db;
        }
        // setup_storage();
        // db_clean();
    }

    function db_clean() {
        mybase.exec("DELETE FROM users");
        mybase.exec("DELETE FROM favorites");
        db_save();
    }

    function db_save() {
        debug(alasql.databases.mybase.tables.users.data);
        storage.set("users", alasql.databases.mybase.tables.users.data);
        debug(alasql.databases.mybase.tables.favorites.data);
        storage.set("favorites", alasql.databases.mybase.tables.favorites.data);
    }

    function upgrade_v2() {
        storage.set("version", 2);
        // do stuff
    }

    // USER
    function create_User(user) {
        return {
            id: parseInt(user.id),
            name: (typeof user.name !== "undefined") ? user.name : "",
            highlight: (typeof user.highlight !== "undefined") ? parseInt(user.highlight) : 0,
            icon: (typeof user.icon !== "undefined") ? user.icon : "",
            icon_color: (typeof user.icon_color !== "undefined") ? user.icon_color : "000000",
            note: (typeof user.note !== "undefined") ? user.note : ""
        };
    }

    function get_user(user_id) {
        debug(mybase.exec("SELECT * FROM users"));
        user_id = parseInt(user_id);
        let result = mybase.exec("SELECT * FROM users WHERE id = ? LIMIT 1", [user_id]);
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    function set_user(user = []) {
        user.id = parseInt(user.id);
        user.highlight = parseInt(user.highlight);
        mybase.exec("DELETE FROM users WHERE id = ? ", [user.id]);
        mybase.exec("INSERT INTO users (?,?,?,?,?,?)", [user.id, user.name, user.highlight, user.icon, user.icon_color, user.note]);
        db_save();
    }

    function delete_user(user_id) {
        user_id = parseInt(user_id);
        mybase.exec("DELETE FROM users WHERE id = ? ", [user_id]);
        mybase.exec("DELETE FROM users WHERE note=? AND icon=? ", ["", ""]);
        db_save();
    }

    // FAV
    function create_Favorite(fav) {
        return {
            postid: parseInt(fav.postid),
            username: (typeof fav.username !== "undefined") ? fav.username : "",
            note: (typeof fav.note !== "undefined") ? fav.note : ""
        };
    }

    function get_fav(postid) {
        postid = parseInt(postid);
        let result = mybase.exec("SELECT * FROM favorites WHERE postid = ? LIMIT 1", [postid]);
        if (result.length > 0) {
            return result[0];
        } else {
            return null;
        }
    }

    function set_fav(fav = []) {
        fav.postid = parseInt(fav.postid);
        mybase.exec("DELETE FROM favorites WHERE postid = ? ", [fav.postid]);
        mybase.exec("INSERT INTO favorites (?,?,?)", [fav.postid, fav.username, fav.note]);
        db_save();
    }

    function delete_fav(postid) {
        postid = parseInt(postid);
        mybase.exec("DELETE FROM favorites WHERE postid = ? ", [postid]);
        db_save();
    }

    // CONFIG
    function get_config() {
        let cfg = storage.get("configs", DEFAULT_CONFIG);
        debug("cfg", cfg);
        return Object.assign({}, DEFAULT_CONFIG, cfg);
    }

    function set_config(configs) {
        debug("props", Object.getOwnPropertyNames(configs).sort());
        storage.set("configs", configs);
        return configs;
    }

    // DEBUG
    function set_debug(isDebug = false) {
        if (isDebug) {
            window.debug = window.console.log.bind(window.console);
        } else {
            window.debug = function () { };
        }
    }

    function appendFilesToHead(arr = [], forceExt = false) {

        for (let i = 0; i < arr.length; i++) {
            let urlStr = arr[i];
            let ext = (forceExt) ? forceExt : urlStr.slice((Math.max(0, urlStr.lastIndexOf(".")) || Infinity) + 1);
            let ele = null;

            switch (ext) {
                case "js":
                    ele = document.createElement("script");
                    ele.type = "text/javascript";
                    ele.src = urlStr;
                    break;
                case "css":
                    ele = document.createElement("link");
                    ele.rel = "stylesheet";
                    ele.type = "text/css";
                    ele.href = urlStr;
                    break;
                default:
                    ele = document.createElement("script");
                    ele.type = "text/javascript";
                    ele.src = urlStr;
            }
            document.getElementsByTagName("head")[0].appendChild(ele);
        }
    }

    function append_styles() {
        let styles = ``;
        let arrCss = cssFiles;

        // forum max z-index 9997 (top menu)
        if (configs.forum_font != "") {
            arrCss.push(`https://fonts.googleapis.com/css?family=${configs.forum_font}`);
        }
        appendFilesToHead(arrCss, 'css');

        // http://luxiyalu.com/scrolling-on-overlay/
        styles += `
<style id="uscr-fixed-style" type="text/css">
.material-icons.md-14 { font-size: 14px; }
.material-icons.md-14 { font-size: 16px; }
.material-icons.md-18 { font-size: 18px; }
.material-icons.md-24 { font-size: 24px; }
.material-icons.md-36 { font-size: 36px; }
.material-icons.md-48 { font-size: 48px; }

/* .mil {font-family: 'Lato', sans-serif;} */

.mil { color: #000000; line-height: 1.5; }

/* TYPOGRAPHY */
.mil h1 {font-size: 2.5rem;}
.mil h2 {font-size: 2rem;}
.mil h3 {font-size: 1.375rem;}
.mil h4 {font-size: 1.125rem;}
.mil h5 {font-size: 1rem;}
.mil h6 {font-size: 0.875rem;}
/* .mil p { font-size: 1.125rem; font-weight: 200; line-height: 1.8;} */
.mil .left {text-align: left;}
.mil .right {text-align: right;}
.mil .center {text-align: center; margin-left: auto; margin-right: auto;}
.mil .justify {text-align: justify;}
/* GRID */
.mil .container { width: 90%; margin-left: auto; margin-right: auto;}
.mil .row { position: relative; width: 100%; }
.mil .row [class^="col"] { float: left; margin: 0.5rem 2%; min-height: 0.125rem; }
.mil .col-1,.mil .col-2,.mil .col-3,.mil .col-4,.mil .col-5,.mil .col-6,.mil .col-7,.mil .col-8,.mil .col-9,.mil .col-10,.mil .col-11,.mil .col-12 { width: 96%; }
.mil .col-1-sm { width: 4.33%; }
.mil .col-2-sm { width: 12.66%; }
.mil .col-3-sm { width: 21%; }
.mil .col-4-sm { width: 29.33%; }
.mil .col-5-sm { width: 37.66%; }
.mil .col-6-sm { width: 46%; }
.mil .col-7-sm { width: 54.33%; }
.mil .col-8-sm { width: 62.66%; }
.mil .col-9-sm { width: 71%; }
.mil .col-10-sm { width: 79.33%; }
.mil .col-11-sm { width: 87.66%; }
.mil .col-12-sm { width: 96%; }
.mil .row::after { content: ""; display: table; clear: both;}
.mil .hidden-sm { display: none;}
@media only screen and (min-width: 33.75em) {/* 540px */
.mil .container {  width: 80%; }
}
@media only screen and (min-width: 45em) {/* 720px */
.mil .col-1 { width: 4.33%; }
.mil .col-2 { width: 12.66%; }
.mil .col-3 { width: 21%; }
.mil .col-4 { width: 29.33%; }
.mil .col-5 { width: 37.66%; }
.mil .col-6 { width: 46%; }
.mil .col-7 { width: 54.33%; }
.mil .col-8 { width: 62.66%; }
.mil .col-9 { width: 71%; }
.mil .col-10-sm { width: 79.33%; }
.mil .col-11-sm { width: 87.66%; }
.mil .col-12-sm { width: 96%; }
.mil .hidden-sm { display: block; }
}
@media only screen and (min-width: 60em) {/* 960px */
.mil .container {width: 75%;max-width: 60rem;}
}

/* userscript css  */
.css-uscr {color:#000000;}
.css-uscr a:link { color: #0000EE; }
.css-uscr a:visited { color: #551A8B; }
.css-uscr-cursor-pointer { cursor: pointer;}
.css-uscr-cursor-move { cursor: move;}
.css-uscr-hidden { display:none; }

.css-uscr-modal-resizable { overflow: auto; resize: both; }
.css-uscr-modal-draggable { position: absolute;}

.popup_visible .css-uscr-card {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    transform: scale(1);
}
.css-uscr-full-overlay {
    position: fixed;
    background: #fff;
    bottom: 0;
    right: 0;
    width: 0%;
    height: 0%;
    opacity: 0.9;
    visibility: hidden;
    overflow: auto;
    z-index: 99998;
}
.css-uscr-card {
    -webkit-transform: scale(0.8);
    -moz-transform: scale(0.8);
    -ms-transform: scale(0.8);
    transform: scale(0.8);
    z-index: 10000;

    min-height:20px;
    padding:19px;
    margin-bottom:20px;
    background-color:#FFFFFF;
    border:1px solid #e3e3e3;
    border-radius:4px;
    -webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.05);
    box-shadow:inset 0 1px 1px rgba(0,0,0,.05)
}
.css-uscr-card FIELDSET {
    border: 1px solid #000000;
    padding: 5px;
    margin-top: 10px;
}
.css-uscr-card FIELDSET LEGEND {
    color: #000000;
    padding: 2px 5px ;
    margin-left: 10px;
}
.css-uscr-card BUTTON {
    padding: 5px 10px;
    text-align: center;
    font-weight: bold;
    display: inline-block;
    border-radius: .5rem;
    border: 3px solid transparent;
}
.css-uscr-button-row { text-align:center; margin-top: 20px;}
.css-uscr-card TABLE BUTTON { padding: 0px 10px;}
.css-uscr-card TEXTAREA { min-height: 250px; }
.css-uscr-card TEXTAREA,
.css-uscr-card INPUT[type="text"] { width: 95%; }
.css-uscr-slider {-webkit-appearance: none; appearance: none; width: 100%; background: #e3e3e3; outline: none; opacity: 0.7; -webkit-transition: .2s; transition: opacity .2s; }
.css-uscr-slider:hover { opacity: 1; }
.css-uscr-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 25px; height: 25px; background: #4CAF50; cursor: pointer;}
.css-uscr-slider::-moz-range-thumb { width: 25px; height: 25px; background: #4CAF50; cursor: pointer;}

.css-btn-primary {background-color: blue; cursor:pointer; color:white;}
.css-btn-danger {background-color: red; cursor:pointer; color:white;}
.css-btn-neutral {background-color: grey; cursor:pointer; color:white;}

.css-uscr-help-icon { text-align: right;cursor: pointer;}
.css-uscr-icon-color-off {color:${DEFAULT_ICON_OFF_COLOR};}
.css-uscr-icon-color-on {color:${DEFAULT_ICON_ON_COLOR};}
.mil dl {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
}
.mil dt {
    display: block;
}
.mil dd {
    display: block;
    margin-inline-start: 40px;
}
.tables-row-hover tr:hover td{
    background-color:#CFFFFD;
}
/* fixes  */
.discussionListItem .itemPageNav { opacity: 100;}
</style>
<style id="uscr-dynamic-style" type="text/css"></style>
`;
        $("head").append(styles);
    }

    function append_modals() {
        let modals = `
<!-- USERSCRIPT -->
<!-- HELP -->
<div id="js-uscr-card-help" class="css-uscr css-uscr-card" style="width:100vh; min-height:40vh; display:none;">
    <div class="mil">
        <h2 class="js-uscr-modal-draggable-handler css-uscr-cursor-move">
            Help
        </h2>
        <div class="row">
            <div class="col-12">
                <h2>Icons</h2>
                <dl>
                    <dt>Top of Page</dt>
                    <dd><span class="material-icons md-16">settings</span> - Open userscript options</dd>
                    <dd><span class="material-icons md-16">favorite</span> - Your Favorites</dd>
                    <dt>Under User Posts</dt>
                    <dd><span class="material-icons md-16">description</span> - Write note about this user</dd>
                    <dd><span class="material-icons md-16">highlight</span> - Highlight the username everywhere</dd>
                    <dd><span class="material-icons md-16">favorite</span> - Favorite this post</dd>
                </dl>
                <p> </p>
                <p>version: ${SCRIPT_VERSION} (<a href="https://greasyfork.org/en/scripts/372121">greasyfork.org</a>) </p>
            </div>
        </div>
        <p class="css-uscr-button-row">
            <button type="button" class="js-uscr-card-modal-button-close css-btn-neutral" data-target="js-uscr-card-help">Close</button>
        </p>
    </div>
</div>
<!-- /HELP -->

<!-- FAVORITES LIST -->
<div id="js-uscr-card-favoriteslist" class="css-uscr css-uscr-card" style="min-width:70vw;max-width:90vw; min-height:40vh;display:none;">
    <div class="mil"">
        <h2>Favorites</h2>
        <div class="row">
            <div class="col-12">
                <table style="width:100%">
                    <thead>
                        <tr>
                            <th>Post Id</th>
                            <th>Author</th>
                            <th>Note</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="js-uscr-favorites-links" class="tables-row-hover">
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <p class="css-uscr-button-row">
        <button type="button" class="js-uscr-card-modal-button-close css-btn-neutral" data-target="js-uscr-card-favoriteslist">Close</button>
    </p>
    <div align="right">
        <span class="js-uscr-card-help-button-open css-uscr-help-icon" data-card="js-uscr-card-favoriteslist"><span class="material-icons md-16">help</span></span>
    </div>
</div>
<!-- /FAVORITES LIST -->

<!-- FAVORITES FORM -->
<div id="js-uscr-card-favorite" class="js-uscr-modal-draggable css-uscr-modal-resizable css-uscr-modal-draggable css-uscr css-uscr-card" style="min-width:40vh;display:none;">
    <div class="mil"">
        <form id="js-uscr-form-favorite">
            <h2 class="js-uscr-modal-draggable-handler css-uscr-cursor-move">Favorite</h2>
            <fieldset>
                <legend>
                    Annotation
                </legend>
                <p>
                    <label>
                        <span>Your note</span>
                        <br>
                        <textarea name="note" class="" placeholder="Write a brief note about the post"></textarea>
                    </label>
                </p>
            </fieldset>
            <input type="hidden" name="postid" value="">
            <input type="hidden" name="username" value="">
        </form>
        <p class="css-uscr-button-row">
            <button type="button" class="js-uscr-favorite-button-delete css-btn-danger" data-post-id="">Delete</button>
            <button type="button" class="js-uscr-card-modal-button-close css-btn-neutral" data-target="js-uscr-card-favorite">Close</button>
            <button type="button" class="js-uscr-form-favorite-button-save css-btn-primary">Save</button>
        </p>
    </div>
    <div align="right">
        <span class="js-uscr-card-help-button-open css-uscr-help-icon" data-card="js-uscr-card-favorite"><span class="material-icons md-16">help</span></span>
    </div>
</div>
<!-- /FAVORITES FORM -->

<!-- CPANEL -->
<div id="js-uscr-card-cpanel" class="js-uscr-modal-draggable css-uscr-modal-resizable css-uscr css-uscr-card" style="display:none;">
    <div class="mil">
        <form id="js-uscr-form-cpanel">
            <h2 class="js-uscr-modal-draggable-handler css-uscr-cursor-move">Settings</h2>
            <fieldset>
                <legend>
                    Forum display
                </legend>
                <P>
                    <label>
                        <span>Forum Width</span>
                        <br>
                        <input type="range" name="forum_width" id="uscr-range" class="css-uscr-slider" min="40" max="97" value="50"> <span class="js-uscr-slider-value"></span>
                    </label>
                </p>
                <p>
                    <label>
                        <span>Global Font</span>
                        <br>
                        <select name="forum_font">
                            <option value="">- Use theme default -</option>
                            <option value="Leto">Leto</option>
                            <option value="Raleway">Raleway</option>
                            <option value="Roboto">Roboto</option>
                            <option value="Open+Sans">Opens Sans</option>
                            <option value="Merriweather">Merriweather</option>
                        </select>
                    </label>
                </p>
            </fieldset>
            <fieldset>
                <legend>Hightlight</legend>
                <p>
                    <label>
                        <span> Custom text(s) to hightlight. (separted by comma):</span>
                        <br>
                        <input type="text" name="hightlight_customtext" value="" data-lpignore="true" placeholder="Text, Another Text" class="">
                    </label>
                </p>
                <p>
                    <label>
                        <span>text color for custom text and usernames</span>
                        <br>
                        <input type="text" class="js-uscr-color" data-jscolor="{zIndex:100002, width:101, padding:20, borderWidth:3}" data-bind="updateSampleText" name="hightlight_color" value="" size="6">
                    </label>
                </p>
                <p>
                    <label>
                        <span>text background color for custom text and usernames</span>
                        <br>
                        <input type="text" class="js-uscr-color" data-jscolor="{zIndex:100002, width:101, padding:20, borderWidth:3}" data-bind="updateSampleText" name="hightlight_bgcolor" value="" size="6">
                    </label>
                </p>
                <p>
                    <span id="js-uscr-highlight-text-sample">Sample Text</span>
                </p>
            </fieldset>
            <fieldset>
                <legend>Banned Users</legend>
                <p>
                    <label>
                        <span>Use custom background color to banned users?</span>
                        <br>
                        <input type="radio" name="banned_users_use_bgcolor" value="1"> Yes
                        <input type="radio" name="banned_users_use_bgcolor" value="0"> No
                    </label>
                </p>
                <p>
                    <label>
                        <span> Username's background color:</span>
                        <br>
                        <input type="text" class="js-uscr-color" data-jscolor="{zIndex:100002, width:101, padding:20, borderWidth:3}" name="banned_users_bgcolor" value="" size="6">
                    </label>
                </p>
            </fieldset>
            <p class="css-uscr-button-row">
                <button type="button" class="js-uscr-card-modal-button-close css-btn-neutral" data-target="js-uscr-card-cpanel">Close</button>
                <button type="button" class="js-uscr-form-cpanel-button-save css-btn-primary">Save</button>
            </p>
        </form>
    </div>
    <div align="right">
        <span class="js-uscr-card-help-button-open css-uscr-help-icon" data-card="js-uscr-card-cpanel"><span class="material-icons md-16">help</span></span>
    </div>
</div>
<!-- /CPANEL -->

<!-- USER -->
<div id="js-uscr-card-usernote" class="js-uscr-modal-draggable uscr-modal__form css-uscr-modal-resizable css-uscr-modal-draggable css-uscr css-uscr-card" style="min-width:50vw;display:none;">
    <div class="mil">
        <form id="js-uscr-form-usernote">
            <h2 class="js-uscr-modal-draggable-handler css-uscr-cursor-move">User: <span></span></h2>
            <fieldset>
                <legend>
                    Icon
                </legend>
                <div class="js-uscr-icon-color-sample">
                <div class="container">
                    <div class="row">
                        <div class="col-4">
                            <input type="radio" name="icon" value=""> None
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="favorite"> <span class="material-icons md-14">favorite</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="balance"> <span class="material-icons md-14">balance</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <input type="radio" name="icon" value="warning"> <span class="material-icons md-14">warning</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="star"> <span class="material-icons md-14">star</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="flag"> <span class="material-icons md-14">flag</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <input type="radio" name="icon" value="thumb_up_alt"> <span class="material-icons md-14">thumb_up_alt</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="thumb_down"> <span class="material-icons md-14">thumb_down</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="emoji_emotions"> <span class="material-icons md-14">emoji_emotions</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <input type="radio" name="icon" value="sentiment_very_dissatisfied"> <span class="material-icons md-14">sentiment_very_dissatisfied</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="sentiment_neutral"> <span class="material-icons md-14">sentiment_neutral</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="device_thermostat"> <span class="material-icons md-14">device_thermostat</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <input type="radio" name="icon" value="bug_report"> <span class="material-icons md-14">bug_report</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="person_search"> <span class="material-icons md-14">person_search</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="rocket_launch"> <span class="material-icons md-14">rocket_launch</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <input type="radio" name="icon" value="emoji_events"> <span class="material-icons md-14">emoji_events</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="child_care"> <span class="material-icons md-14">child_care</span>
                        </div>
                        <div class="col-4">
                            <input type="radio" name="icon" value="campaign"> <span class="material-icons md-14">campaign</span>
                        </div>
                    </div>
                </container>
                <label>
                    <span>Color</span>
                    <br>
                    <input type="text" class="js-uscr-color" data-jscolor="{zIndex:100002, width:101, padding:20, borderWidth:3}" data-bind="updateSampleIcon" name="icon_color" value="" size="6">
                </label>
            </fieldset>
            <fieldset>
                <legend>
                    Note
                </legend>
                <p>
                    <label>
                        <span>Your Note</span>
                        <br>
                        <textarea class="" name="note" placeholder="Write your content here. Text, links anything."></textarea>
                    </label>
                </p>
            </fieldset>
            <input type="hidden" name="id" value="">
            <input type="hidden" name="name" value="">
            <input type="hidden" name="highlight" value="">
        </form>
        <p class="css-uscr-button-row">
            <button type="button" class="js-uscr-card-usernote-button-delete css-btn-danger" data-user-id="">Delete</button>
            <button type="button" class="js-uscr-card-modal-button-close css-btn-neutral" data-target="js-uscr-card-usernote">Close</button>
            <button type="button" class="js-uscr-card-usernote-button-save css-btn-primary">Save</button>
        </p>
    </div>
    <div align="right">
        <span class="js-uscr-card-help-button-open css-uscr-help-icon" data-card="js-uscr-card-usernote"><span class="material-icons md-16">help</span></span>
    </div>
</div>
<!-- /USER -->

<!-- /USERSCRIPT -->
`;
        let cpButton = `
<!-- USERSCRIPT -->
<div id="js-usrc-toolbar" style="display: inline-flex;align-items:center">
    <span class="js-uscr-card-cpanel-button-open css-uscr-cursor-pointer" style="margin-right: 5px;"><span class="material-icons md-16">settings</span></span>
    <span class="js-uscr-card-favoriteslist-button-open css-uscr-cursor-pointer" style="margin-right: 5px;"><span class="material-icons md-16">favorite</span></span>
</div>
<!-- /USERSCRIPT -->
`;
        $("body").append(modals);
        $("DIV.p-header-logo").after(cpButton);
    }

    function do_config_css() {
        let css;

        css = `.uscr-text-highlight {color:#${configs.hightlight_color}; background-color:#${configs.hightlight_bgcolor};}`;
        if (configs.members_juniors_newcolor_used) {
            css += `.uscr-title-junior-member {color:#${configs.members_juniors_newcolor_color};}`;
        }
        if (configs.banned_users_use_bgcolor == 1) {
            css += `.username--style7 {background-color:#${configs.banned_users_bgcolor};}`;
        }
        if (configs.forum_font != "") {
            css += `body, .bbCodeQuote { font-family: "${configs.forum_font}"; }`;
        }
        $("#uscr-dynamic-style").html(css);
        $("#navigation.pageWidth").css({ "width": configs.forum_width + "vw" });
        $("#content .pageWidth").css({ "width": configs.forum_width + "vw" });
    }

    // HIGHLIGHT
    function do_highlight(arr = []) {
        let usernames = [];
        let result = mybase.exec("SELECT name FROM users WHERE highlight = 1");

        debug("do_highlight", result);
        if (result.length > 0) {
            usernames = result.map(item => item.name);
            debug("usernames", usernames);
        }
        $("article").mark(usernames, MARKJS_OPTIONS);

        let my_account = $("#AccountMenu A.concealed").first().text();

        $("article").mark(my_account, MARKJS_OPTIONS);
        let custom_strings = configs.hightlight_customtext;
        let oldArray = custom_strings.split(",");
        let trimedArr = oldArray.map(str => str.trim());

        $(".message-content").mark(trimedArr, MARKJS_OPTIONS);

    }

    function undo_highlight() {

        $("body").unmark(MARKJS_OPTIONS);
    }

    function main() {
        let allNotes = storage.get("users_notes");
        let users_color_tags = {};

        debug("main()", "");
        // ############### FORUM Thread
        if ($(`LI[id^="thread-"]`).length > 0) {
            debug("li[id]", $(`LI[id^="thread-"]`).length);

            $(`LI[id^="thread-"]`).each(function () {
                let $this = $(this);
                let main_anchor = $this.find("H3.title A").first();
                let unread_url = main_anchor[0].href;

                //debug(main_anchor);
                //debug(unread_url.slice(0, -6)); // .../unread
                main_anchor[0].href = unread_url.slice(0, -6);

                let unreadLink = $this.find("A.unreadLink").first();

                debug(unreadLink);
                unreadLink[0].href = unread_url;
                unreadLink[0].innerHTML = `<span class="material-icons">arrow_forward</span>`;
                unreadLink[0].title = `Jump to first unread message`;
            });
        }
        // ############### FORUM Post
        if ($("ARTICLE.message").length > 0) {
            // INSERT <html_user_block>
            $("ARTICLE.message").each(function () {
                let $this = $(this);
                let username = $this.attr("data-author");
                let attr_post_id = $this.attr("id");
                let title = $this.find("DIV.userBanner").first().text();
                let user_id = parseInt($this.find(`H4.message-name A.username[href^="/members/"]`).attr("data-user-id"), 10);
                //let attr_href = $this.find(`H4.message-name A.username[href^="/members/"]`).attr("href");
                //let afterDot = attr_href.substr(attr_href.indexOf("."));
                //let user_id = parseInt(afterDot.match(/[0-9]+/g), 10);
                let post_id = parseInt(attr_post_id.match(/[0-9]+$/g), 10);
                let user = get_user(user_id);
                let fav = get_fav(post_id);

                //$this.find(`DIV.userBanner[itemprop="jobTitle"]`).hide();
                if (!user) {
                    user = create_User({
                        id: user_id,
                        name: username
                    });
                }
                if (!fav) {
                    fav = create_Favorite({
                        postid: post_id,
                        username: username
                    });
                }

                let html_icon_color = (user.icon_color != "" && user.icon_color !== "undefined") ? `style="color:#${user.icon_color};"` : "";
                let html_icon = '';
                if (user.icon != "") {
                    let ic = user.icon;
                    ic = ic.toLowerCase();
                    html_icon = (ic.includes('fas')) ? `<i class="${user.icon}" ${html_icon_color}></i><br>` : `<span class="material-icons md-16" ${html_icon_color}>${user.icon}</span>`;
                }

                let formattedTitle = title.toLowerCase();
                let custom_title = "";

                if (formattedTitle == "banned") {
                    custom_title = ` <span class="uscr-title-banner-member"><span class="material-icons">block</span> Banned</span>`;
                } else if (formattedTitle == "member") {
                    custom_title = ` <span class="uscr-title-member">Member</span>`;
                } else {
                    custom_title = ` <span class="uscr-title-custom">${title}</span>`;
                }

                let html = `
                <!-- USERSCRIPT -->
                <div class="uscr-username-box-container" data-user-id="${user.id}" data-author="${user.name}" data-post-id="${post_id}" data-user-id="${user.id}" data-user-name="${user.name}" data-title="${title}">
                    <div class="mil">
                        <div class="row">
                            <div class="col-3-sm">
                                ${html_icon}
                            </div>
                            <div class="col-3-sm">
                                <span class="js-uscr-usernote-icon-container" data-user-id="${user.id}">`;
                if (user.note != "") {
                    html += `<span class="js-uscr-card-usernote-button-open css-uscr-cursor-pointer css-uscr-icon-color-off" data-user-id="${user.id}" data-user-name="${user.name}" title="Read the Note">${ICON_NOTE_ON}</span>`;
                } else {
                    html += `<span class="js-uscr-card-usernote-button-open css-uscr-cursor-pointer css-uscr-icon-color-off" data-user-id="${user.id}" data-user-name="${user.name}" title="Write a Note">${ICON_NOTE_OFF}</span>`;
                }
                html += `
                                </span>
                            </div>
                            <div class="col-3-sm">
                            `;
                if (user.highlight == 1) {
                    html += `<span class="js-uscr-highlight-username-button-switch css-uscr-cursor-pointer css-uscr-is-hightlighted css-uscr-icon-color-off" data-user-id="${user.id}"data-user-name="${user.name}" title="Hightlight">${ICON_HIGHLIGHT_ON}</span>`;
                } else {
                    html += `<span class="js-uscr-highlight-username-button-switch css-uscr-cursor-pointer css-uscr-is-hightlighted css-uscr-icon-color-off" data-user-id="${user.id}" data-user-name="${user.name}" title="Hightlight">${ICON_HIGHLIGHT_OFF}</span>`;
                }
                html += `
                            </div>
                            <div class="col-3-sm">
                            `;
                if (fav.note != "") {
                    html += `<span class="js-uscr-card-favorite-button-open css-uscr-cursor-pointer css-uscr-icon-color-off" data-post-id="${post_id}" data-favorite="1" data-user-id="${user.id}" data-user-name="${user.name}" title="favorite">${ICON_FAV_ON}</span>`;
                } else {
                    html += `<span class="js-uscr-card-favorite-button-open css-uscr-cursor-pointer css-uscr-icon-color-off" data-post-id="${post_id}" data-favorite="0" data-user-id="${user.id}" data-user-name="${user.name}" title="favorite">${ICON_FAV_OFF}</span>`;
                }

                html += `
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <span class="js-uscr-colortag-icons-container" data-user-id="${user.id}">
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /USERSCRIPT -->`;
                $(this).find("DIV.message-userDetails").append(html);
            });
        }


        // HIGHLIGHT HIGHLIGHT HIGHLIGHT HIGHLIGHT HIGHLIGHT HIGHLIGHT HIGHLIGHT HIGHLIGHT HIGHLIGHT HIGHLIGHT HIGHLIGHT
        // HIGHTLIGHT ---- USERNAME
        $(".js-uscr-highlight-username-button-switch").click(function (event) {
            event.preventDefault();
            let id = $(this).attr("data-user-id");
            let user = get_user(id);

            if (!user) {
                user = create_User({
                    id: id,
                    name: $(this).attr("data-user-name"),
                    highlight: ($(this).hasClass("css-uscr-is-hightlightd") ? 1 : 0)
                });
            }
            if (user.highlight == 1) { // isON
                // $(`.js-uscr-highlight-username-button-switch[data-user-id="${user.id}"]`).attr("data-user-hightlight", 0);
                $(`.js-uscr-highlight-username-button-switch[data-user-id="${user.id}"]`).removeClass("css-uscr-is-hightlighted");
                $(`.js-uscr-highlight-username-button-switch[data-user-id="${user.id}"]`).html(ICON_HIGHLIGHT_OFF);
                user.highlight = 0;
            } else { // isOFF
                // $(`.js-uscr-highlight-username-button-switch[data-user-id="${user.id}"]`).attr("data-user-hightlight", 1);
                $(`.js-uscr-highlight-username-button-switch[data-user-id="${user.id}"]`).addClass("css-uscr-is-hightlighted");
                $(`.js-uscr-highlight-username-button-switch[data-user-id="${user.id}"]`).html(ICON_HIGHLIGHT_ON);
                user.highlight = 1;
            }
            set_user(user);
            undo_highlight();
            do_highlight();
        });


        // FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV FAV
        // FAV ---- FORM OPEN
        $(".js-uscr-card-favorite-button-open").click(function (event) {
            event.preventDefault();
            let postid = $(this).attr("data-post-id");
            let fav = get_fav(postid);

            if (!fav) {
                fav = create_Favorite({
                    postid: postid,
                    username: $(this).attr("data-user-name")
                });
            }
            populateForm($("#js-uscr-form-favorite"), fav);
            $("#js-uscr-card-favorite").popup({ blur: false, autoopen: true });
            $("#js-uscr-card-favorite .js-uscr-favorite-button-delete").attr("data-post-id", postid);
            return false;
        });
        // FAV ---- FORM SAVE
        $(".js-uscr-form-favorite-button-save").click(function (event) {
            event.preventDefault();
            let formData = $("#js-uscr-form-favorite").serializeJSON();
            let fav = {
                postid: formData.postid,
                username: formData.username,
                note: formData.note
            };

            fav.note = fav.note.trim();
            set_fav(fav);
            $(`SPAN.js-uscr-card-favorite-button-open[data-post-id="${fav.postid}"]`).html(ICON_FAV_ON);
            $("#js-uscr-card-favorite").popup("hide");
            new Noty({
                type: 'success',
                text: 'Saved',
            }).show();
        });
        // FAV ---- LISTING OPEN
        $(document).on("click", ".js-uscr-card-favoriteslist-button-open", function (event) {
            event.preventDefault();
            let favorites = mybase.exec("SELECT * FROM favorites");
            let html_rows = "";

            $("#js-uscr-card-favoriteslist").popup({
                // color: "white",
                // opacity: 1,
                // transition: "0.3s",
                scrolllock: true,
                blur: false,
                autoopen: true
            });

            for (let i = 0; i < favorites.length; i++) {
                let favorite = favorites[i];

                html_rows += `
                    <tr data-post-id="${favorite.postid}">
                        <td><a href="/goto/post?id=${favorite.postid}#post-${favorite.postid}"># ${favorite.postid} - <span class="material-icons md-16">search</span></a></td>
                        <td>${favorite.username}</td>
                        <td>${favorite.note}</td>
                        <td><button type="button" class="js-uscr-card-favoriteslist-table-links-button-delete css-btn-danger" data-post-id="${favorite.postid}">Delete</button></td>
                    </tr>`;
            }
            $("#js-uscr-favorites-links").html(html_rows);
            return false;
        });
        // FAV ---- LISTING - REMOVE
        $(document).on("click", ".js-uscr-card-favoriteslist-table-links-button-delete", function (event) {
            event.preventDefault();
            let postid = $(this).attr("data-post-id");

            delete_fav(postid);
            $(`#js-uscr-favorites-links TR[data-post-id="${postid}"]`).remove();
            return false;
        });
        $(document).on("click", ".js-uscr-favorite-button-delete", function (event) {
            event.preventDefault();
            let postid = $(this).attr("data-post-id");

            delete_fav(postid);
            $("#js-uscr-card-favorite").popup("hide");
            $(`SPAN.js-uscr-card-favorite-button-open[data-post-id="${postid}"]`).html(ICON_FAV_OFF);
            new Noty({
                type: 'success',
                text: 'Removed',
            }).show();
        });


        // CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL CPANEL
        // CPANEL ---- FORM OPEN
        $(document).on("click", ".js-uscr-card-cpanel-button-open", function (event) {
            event.preventDefault();

            $("#js-uscr-card-cpanel").popup({ blur: false, autoopen: true });
            populateForm($("#js-uscr-form-cpanel"), configs);
            jscolor.installByClassName("js-uscr-color");
            return false;
        });
        // CPANEL ---- FORM SAVE
        $(".js-uscr-form-cpanel-button-save").click(function (event) {
            event.preventDefault();
            let formData = $("#js-uscr-form-cpanel").serializeJSON();

            set_config(formData);
            do_config_css();
            $("#js-uscr-card-cpanel").popup("hide");
            new Noty({
                type: 'success',
                text: 'Saved',
            }).show();
        });

        // USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER USER
        // USER ---- FORM OPEN
        $(".js-uscr-card-usernote-button-open").click(function (event) {
            debug("click", "js-uscr-card-usernote-button-open");
            event.preventDefault();
            let id = $(this).attr("data-user-id");
            let user = get_user(id);

            if (!user) {
                user = create_User({
                    id: id,
                    name: $(this).attr("data-user-name")
                });
            }
            $(".js-uscr-modal-draggable-handler SPAN").html(user.name);
            populateForm($("#js-uscr-form-usernote"), user);
            $(`js-uscr-form-usernote INPUT[name="icon_color"]`).attr("style", `background-color:#${user.icon_color}`);
            $(`#js-uscr-card-usernote .js-uscr-card-usernote-button-delete`).attr("data-user-id", user.id);
            $(`#js-uscr-card-usernote`).popup({ blur: false, autoopen: true });
            // $(`INPUT[data-bind="updateSampleIcon"]`).trigger('change'); // commented to prevend to icon disappear when it is white.
            jscolor.installByClassName("js-uscr-color");
            return false;
        });
        // USER ---- FORM SAVE
        $(".js-uscr-card-usernote-button-save").click(function (event) {
            event.preventDefault();
            let formData = $("#js-uscr-form-usernote").serializeJSON();

            set_user(formData);
            if (formData.note != "") {
                $(`.js-uscr-card-usernote-button-open[data-user-id="${formData.id}"]`).html(ICON_NOTE_ON);
            } else {
                $(`.js-uscr-card-usernote-button-open[data-user-id="${formData.id}"]`).html(ICON_NOTE_OFF);
            }

            new Noty({
                type: 'success',
                text: 'Saved',
            }).show();
            $("#js-uscr-card-usernote").popup("hide");
        });
        // USER ---- DELETE
        $(".js-uscr-card-usernote-button-delete").click(function (event) {
            event.preventDefault();
            let user_id = $(this).attr("data-user-id");

            delete_user(user_id);
            $("#js-uscr-card-usernote").popup("hide");
            $(`.js-uscr-card-usernote-button-open[data-user-id="${user_id}"]`).html(ICON_NOTE_OFF);
            new Noty({
                type: 'success',
                text: 'Removed',
            }).show();
        });

        // MODAL EVENTS MODAL EVENTS MODAL EVENTS MODAL EVENTS MODAL EVENTS MODAL EVENTS MODAL EVENTS MODAL EVENTS
        $(document).on("mousedown", ".js-uscr-modal-draggable-handler", function (event) {
            let move = $(this).closest(".js-uscr-modal-draggable");
            let lastOffset = move.data("lastTransform");
            let lastOffsetX = lastOffset ? lastOffset.dx : 0;
            let lastOffsetY = lastOffset ? lastOffset.dy : 0;
            let startX = event.pageX - lastOffsetX;
            let startY = event.pageY - lastOffsetY;

            $(document).on("mousemove", function (event) {
                let newDx = event.pageX - startX;
                let newDy = event.pageY - startY;

                move.css("transform", "translate(" + newDx + "px, " + newDy + "px)");
                move.data("lastTransform", {
                    dx: newDx,
                    dy: newDy
                });
                window.getSelection().removeAllRanges();
            });
        });
        $(document).on("mouseup", function (event) {
            $(this).off("mousemove");
        });
        $(".js-uscr-card-modal-button-close").click(function (event) {
            event.preventDefault();
            let id = $(this).attr("data-target");

            $(`#${id}`).popup("hide");
        });
        // HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP  HELP
        $(".js-uscr-card-help-button-open").click(function (event) {
            event.preventDefault();
            let id = $(this).attr("data-card");

            $(`#${id}`).popup("hide");
            $("#js-uscr-card-help").popup({ blur: false, autoopen: true });
            return false;
        });

        // MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC MISC
        var slider = document.getElementById("uscr-range");
        slider.oninput = function () {
            $(".js-uscr-slider-value").html(`( ${this.value} %)`);
        }

        $(`INPUT[data-bind="updateSampleText"]`).on("change", function (event) {
            event.preventDefault();
            let hightlight_color = $(`INPUT[name="hightlight_color"]`).val();
            let hightlight_bgcolor = $(`INPUT[name="hightlight_bgcolor"]`).val();
            let banned_users_highlight = $(`INPUT[name="banned_users_highlight"]`).val();
            let banned_users_highlight_color = $(`INPUT[name="banned_users_highlight_color"]`).val();

            $("#js-uscr-highlight-text-sample").html(`<span style="color:#${hightlight_color}; background-color:#${hightlight_bgcolor}">Sample Text</span>`);
            $("#js-uscr-banned-text-sample").html(`<span style="color:#${banned_users_highlight_color}">Sample Text</span>`);
        });
        $(`INPUT[data-bind="updateSampleIcon"]`).on("change", function (event) {
            event.preventDefault();
            let icon_color = $(`INPUT[name="icon_color"]`).val();

            $(this).css("background-color", '#' + icon_color);
            // $(".js-uscr-icon-color-sample").css({ color: "#" + icon_color });
        });
    } //main

    // ========================================================================
    set_debug(DEBUG_MODE);
    storage.options.prefix = "uscr_";
    db_check_version();

    configs = get_config();

    Noty.overrideDefaults({
        layout: 'topRight',
        theme: 'sunset',
        closeWith: ['click', 'button'],
        progressBar: false,
        timeout: 2000,
        closeWith: ['click'],
    });

    $(document).ready(function () {
        db_init();
        append_styles();
        append_modals();
        main();
        do_highlight();
        do_config_css();
    });

}))();