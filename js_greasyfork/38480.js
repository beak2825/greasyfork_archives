// ==UserScript==
// @name         NUtools
// @namespace    JDoe_NUtoolsV2
// @version      9
// @description  Tools to interact with novelupdates.com site.
// @author       John Doe
// @match        http*://*.novelupdates.com/
// @match        http*://*.novelupdates.com/?pg=*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.serializeJSON/2.9.0/jquery.serializejson.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-popup-overlay/2.1.0/jquery.popupoverlay.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/alasql/0.4.5/alasql.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/38480/NUtools.user.js
// @updateURL https://update.greasyfork.org/scripts/38480/NUtools.meta.js
// ==/UserScript==
/*global $:false, jQuery:false, debug:false, alasql:false, toastr:false, jscolor:false */
((() => {
    const VERSION = 9;
    const DBVERSION = 5;
    const DEBUG = false;
    const DEFAULTCONFIGS = {
        cfg_move_to_list_id: 1,
        cfg_move_req_confirm: 0,
        cfg_cover_show_icon: 1,
        cfg_move_reload: 1,
        cfg_auto_label: 0,
    };
    const LANGS_OPTIONS = [
        {
            isoAlpha3: "CHN",
            isoAlpha2: "CN",
            m49: 156,
            aliases: [156, "cn", "chn", "china", "chinese", "mandarim", "cantonese"]
        },
        {
            isoAlpha3: "JPN",
            isoAlpha2: "JP",
            m49: 392,
            aliases: ["jp", "jpn", "japan", "japanese"]
        },
        {
            isoAlpha3: "PHL",
            isoAlpha2: "PH",
            m49: 608,
            aliases: ["ph", "phl", "philippines", "filipino"]
        },
        {
            isoAlpha3: "IDN",
            isoAlpha2: "ID",
            m49: 360,
            aliases: ["id", "idn","indonesia", "indonesian"]
        },
        {
            isoAlpha3: "KHM",
            isoAlpha2: "KH",
            m49: 116,
            aliases: ["kh", "khm", "cambodia", "cambodian", "khmer"]
        },
        {
            isoAlpha3: "KOR",
            isoAlpha2: "KR",
            m49: 408,
            aliases: ["kr", "kor", "korea", "korean", 410, "prk","kp"]
        },
        {
            isoAlpha3: "MYS",
            isoAlpha2: "MY",
            m49: 458,
            aliases: ["my", "mys", "malaysia", "malaysian"]
        },
        {
            isoAlpha3: "THA",
            isoAlpha2: "TH",
            m49: 764,
            aliases: ["th", "tha", "thailand", "thai"]
        },
        {
            isoAlpha3: "VNM",
            isoAlpha2: "VN",
            m49: 704,
            aliases: ["vn", "vnm", "viet nam", "vietnamese"]
        }
    ];
    function appendHTML() {

        let cssFiles = [
                "https://fonts.googleapis.com/icon?family=Material+Icons",
                "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css"
        ];

        let htmlStyles = `
        <style type="text/css">
        /* Rules for sizing the icon. */
        .material-icons.md-12 { font-size: 12px; }
        .material-icons.md-18 { font-size: 18px; }
        .material-icons.md-20 { font-size: 20px; }
        .material-icons.md-24 { font-size: 24px; }
        .material-icons.md-36 { font-size: 36px; }
        .material-icons.md-48 { font-size: 48px; }
        /* Rules for using icons as black on a light background. */
        .material-icons.md-dark { color: rgba(0, 0, 0, 0.54); }
        .material-icons.md-dark.md-inactive { color: rgba(0, 0, 0, 0.26); }
        /* Rules for using icons as white on a dark background. */
        .material-icons.md-light { color: rgba(255, 255, 255, 1); }
        .material-icons.md-light.md-inactive { color: rgba(255, 255, 255, 0.3); }
        .material-icons {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            vertical-align: middle;
        }

        /* ################################  */
        .js-nutools-hidden { display:none; }
        .js-nutools-show-cover,.js-nutools-move-to-list { cursor: pointer; }
        #js-nutools-settings-overlay {
            -webkit-transform: scale(0.8);
            -moz-transform: scale(0.8);
            -ms-transform: scale(0.8);
            transform: scale(0.8);
        }
        .popup_visible #js-nutools-settings-overlay {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
        }
        #js-nutools-settings-overlay fieldset {
            border: 3px solid #1F497D;
            background: #ddd;
            border-radius: 2px;
            padding: 5px;
            margin-top: 30px;
        }
        #js-nutools-settings-overlay fieldset legend {
            background: #1F497D;
            color: #fff;
            padding: 5px 20px ;
            font-size: 20px;
            border-radius: 5px;
            box-shadow: 0 0 0 1px #ddd;
            margin-left: 20px;
        }
        .js-nutools-well{
            min-height:20px;
            padding:19px;
            margin-bottom:20px;
            background-color:#f5f5f5;
            border:1px solid #e3e3e3;
            border-radius:4px;
            -webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.05);
            box-shadow:inset 0 1px 1px rgba(0,0,0,.05)
        }
        .js-nutools-well blockquote{
            border-color:#ddd;
            border-color:rgba(0,0,0,.15)
        }
        .js-nutools-well-lg{
            padding:24px;
            border-radius:6px
        }
        .js-nutools-well-sm{
            padding:9px;
            border-radius:3px
        }
        </style>
        `;

        let htmlCPbutton = `
        <div class="">
            <p><button id="js-nutools-open-userscript-cp"><i class="material-icons md-18">settings</i>NUtools Settings</button></p>
            `;
            if (cfgs.cfg_auto_label==0) {
                htmlCPbutton += `<p><button id="js-nutools-get-language-button">Add language label</button></p>`;
            }
            htmlCPbutton += `
        </div>
        `;

        let htmlPageAppend = `
        <div class="js-nutools-hidden">
        <!-- NUtools overlay -->

        <div id="js-nutools-move-confirm-overlay" class="js-nutools-well">
        <div class="message">
        Move '<b class="novel-title"></b>' to reading list [ <b class="reading-list-id"></b> ]?
        </div>
        <br><br>
        <center>
        <button type="button" class="js-nutools-move-confirm-overlay_close">Cancel</button>
        <button type="button" id="js-nutools-move-confirm-overlay-move-button" data-reading-list-id="" data-novel-id="">Move</button>
        </center>
        </div>

        <div id="js-nutools-get-language-confirm-overlay" class="js-nutools-well">
        <div class="message">
        <h3>Warning</h3>
        <p>This action will create multiple requests to website and it is very intensive and take a long time to complete. Use it with extreme moderation.</p>
        </div>
        <br><br>
        <center>
        <button type="button" class="js-nutools-get-language-confirm-overlay_close">Cancel</button>
        <button type="button" id="js-nutools-get-language-confirm-button">Get language</button>
        </center>
        </div>

        <div id="js-nutools-cover-overlay" class="js-nutools-well">
        </div>

        <div id="js-nutools-settings-overlay" class="js-nutools-well">
        <form id="settings_form">
        <h3>Settings:</h3>
        <fieldset>
        <legend><i class="material-icons">format_indent_increase</i> Reading List</legend>
            <p> Move to <a href="https://www.novelupdates.com/reading-list/">Reading List</a> :
            <select name="cfg_move_to_list_id" id="cfg_move_to_list_id">
            </select>
        </p>
            <p>Require confirmation before moving to list? :<br>
        <input type="radio" name="cfg_move_req_confirm" value="1"> Yes
        <input type="radio" name="cfg_move_req_confirm" value="0" checked="checked"> No
        </p>
            <p>Reload page after moving:<br>
        <input type="radio" name="cfg_move_reload" value="1"> Yes
        <input type="radio" name="cfg_move_reload" value="0" checked="checked"> No
        </p>

        </fieldset>
        <fieldset>
        <legend><i class="material-icons">photo</i> Cover </legend>
            </p>Show icon ? :<br>
        <input type="radio" name="cfg_cover_show_icon" value="1"> Yes
        <input type="radio" name="cfg_cover_show_icon" value="0" checked="checked"> No</li>
            </p>
        </fieldset>

        <fieldset>
        <legend><i class="material-icons">translate</i> Auto Label </legend>
            </p>Do you want to auto add language labels? :<br>
        <input type="radio" name="cfg_auto_label" value="1"> Yes
        <input type="radio" name="cfg_auto_label" value="0" checked="checked"> No</li>
            </p>
        </fieldset>
        <center>
        <button type="button" class="js-nutools-settings-overlay_close">Close</button>
        <button type="submit" class="js-nutools-settings-overlay_save">Save</button>
        </center>
        </form>
        <style> input:invalid { border-color: #DD2C00; }</style>

        </div>
        <!-- /NUtools overlay -->
        </div>
        `;
        appendFilesToHead(cssFiles, "css");
        $("head").append(htmlStyles);
        $("body").append(htmlPageAppend);
        $(".l-content").prepend(htmlCPbutton);
    }

    // functions
    let storage = {
        options: {
            prefix: ""
        },
        // “Set” means “add if absent, replace if present.”
        set: function(key, value) {
            let storageVals = this.read(key);

            if (typeof storageVals === "undefined" || !storageVals) {
                // add if absent
                return this.add(key, value);
            } else {
                // replace if present
                this.write(key, value);
                return true;
            }
        },
        // “Add” means “add if absent, do nothing if present” (if a uniquing collection).
        add: function(key, value) {
            let storageVals = this.read(key, false);

            if (typeof storageVals === "undefined" || !storageVals) {
                this.write(key, value);
                return true;
            } else {
                if (this._isArray(storageVals)) { // is array
                    let index = storageVals.indexOf(value);

                    if (index !== -1) {
                        // do nothing if present
                        return false;
                    } else {
                        // add if absent
                        storageVals.push(value);
                        this.write(key, storageVals);
                        return true;
                    }
                } else if (this._isObject(storageVals)) { // is object
                    // merge obj value on obj
                    let result;
                    let objToMerge = value;

                    result = Object.assign(storageVals, objToMerge);
                    this.write(key, result);
                    return false;
                }
                return false;
            }
        },
        // “Replace” means “replace if present, do nothing if absent.”
        replace: function(key, itemFind, itemReplacement) {
            let storageVals = this.read(key, false);

            if (typeof storageVals === "undefined" || !storageVals) {
                // do nothing if absent
                return false;
            } else {
                if (this._isArray(storageVals)) { // is Array
                    let index = storageVals.indexOf(itemFind);

                    if (index !== -1) {
                        // replace if present
                        storageVals[index] = itemReplacement;
                        this.write(key, storageVals);
                        return true;
                    } else {
                        // do nothing if absent
                        return false;
                    }
                } else if (this._isObject(storageVals)) {
                    // is Object
                    // replace property's value
                    storageVals[itemFind] = itemReplacement;
                    this.write(key, storageVals);
                    return true;
                }
                return false;
            }
        },
        // “Remove” means “remove if present, do nothing if absent.”
        remove: function(key, value) {
            if (typeof value === "undefined") { // remove key
                this.delete(key);
                return true;
            } else { // value present
                let storageVals = this.read(key);

                if (typeof storageVals === "undefined" || !storageVals) {
                    return true;
                } else {
                    if (this._isArray(storageVals)) { // is Array
                        let index = storageVals.indexOf(value);

                        if (index !== -1) {
                            // remove if present
                            storageVals.splice(index, 1);
                            this.write(key, storageVals);
                            return true;
                        } else {
                            // do nothing if absent
                            return false;
                        }
                    } else if (this._isObject(storageVals)) { // is Object
                        let property = value;

                        delete storageVals[property];
                        this.write(key, storageVals);
                        return true;
                    }
                    return false;
                }
            }
        },
        get: function(key, defaultValue) {
            return this.read(key, defaultValue);
        },
        // GM storage API
        read: function(key, defaultValue) {
            return this.unserialize(GM_getValue(this._prefix(key), defaultValue));
        },
        write: function(key, value) {
            return GM_setValue(this._prefix(key), this.serialize(value));
        },
        delete: function(key) {
            return GM_deleteValue(this._prefix(key));
        },
        readKeys: function() {
            return GM_listValues();
        },
        // /GM Storage API
        getAll: function() {
            const keys = this._listKeys();
            let obj = {};

            for (let i = 0, len = keys.length; i < len; i++) {
                obj[keys[i]] = this.read(keys[i]);
            }
            return obj;
        },
        getKeys: function() {
            return this._listKeys();
        },
        getPrefix: function() {
            return this.options.prefix;
        },
        empty: function() {
            const keys = this._listKeys();

            for (let i = 0, len = keys.lenght; i < len; i++) {
                this.delete(keys[i]);
            }
        },
        has: function(key) {
            return this.get(key) !== null;
        },
        forEach: function(callbackFunc) {
            const allContent = this.getAll();

            for (let prop in allContent) {
                callbackFunc(prop, allContent[prop]);
            }
        },
        unserialize: function(value) {
            if (this._isJson(value)) {
                return JSON.parse(value);
            }
            return value;
        },
        serialize: function(value) {
            if (this._isJson(value)) {
                return JSON.stringify(value);
            }
            return value;
        },
        _listKeys: function(usePrefix = false) {
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
        _prefix: function(key) {
            return this.options.prefix + key;
        },
        _unprefix: function(key) {
            return key.substring(this.options.prefix.length);
        },
        _isJson: function(item) {
            try {
                JSON.parse(item);
            } catch (e) {
                return false;
            }
            return true;
        },
        _isObject: function(a) {
            return (!!a) && (a.constructor === Object);
        },
        _isArray: function(a) {
            return (!!a) && (a.constructor === Array);
        }
    };

    function isObject(val) {
        if (val === null) {
            return false;
        }
        return ((typeof val === "function") || (typeof val === "object"));
    }

    function setDebug(isDebug = false) {
        if (isDebug) {
            window.debug = window.console.log.bind(window.console, "%s: %s");
        } else {
            window.debug = function() {};
            window.console.log = function() {};
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

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function decodeHtml(html) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
    function get_lang_code(langStr) {
        let niddle = langStr.toString().trim().toLowerCase();
        for(let i=0,l=LANGS_OPTIONS.length; i<l; i++) {
            let aliases = LANGS_OPTIONS[i].aliases;
            if (aliases.indexOf(niddle) > -1) {
                return LANGS_OPTIONS[i].isoAlpha3;
            }
        }
        return "";
    }

    function readConfig() {
        let configs = storage.get("configs", DEFAULTCONFIGS);

        configs = Object.assign({}, DEFAULTCONFIGS, configs);
        debug("loading", JSON.stringify(configs));
        return configs;
    }

    function saveConfig(args) {
        args.cfg_move_to_list_id = (args.cfg_move_to_list_id=="---") ? "" : args.cfg_move_to_list_id;
        let configs = {
            cfg_cover_show_icon: args.cfg_cover_show_icon,
            cfg_move_to_list_id: args.cfg_move_to_list_id,
            cfg_move_req_confirm: args.cfg_move_req_confirm,
            cfg_move_reload: args.cfg_move_reload,
            cfg_auto_label: args.cfg_auto_label,
        };
        storage.set("configs", configs);
        debug("saving", JSON.stringify(configs));
        return configs;
    }

    function sys_check_dbversion() {
        let version = storage.get("sys_dbversion", 0);
        if (version < 5) {
            _upgrade_v5();
            storage.set("sys_dbversion", 5)
        }
        return;
    }

    function _upgrade_v5() {
        let res = mybase.exec("SELECT * FROM novels WHERE lang='N/A' ");
        res.forEach(function(arr) {
            let id = arr.id;
            mybase.exec("DELETE FROM novels WHERE id='"+ id +"' ");
        });
        mybase.exec("UPDATE novels SET lang='' WHERE lang NOT IN ('(JP)','(CN)','(KR)')");
        mybase.exec("UPDATE novels SET lang='JPN' WHERE lang='(JP)'");
        mybase.exec("UPDATE novels SET lang='CHN' WHERE lang='(CN)'");
        mybase.exec("UPDATE novels SET lang='KOR' WHERE lang='(KR)'");
        debug("saving db to localstorage", alasql.databases.mybase.tables.novels.data);
        storage.set("noveldb", alasql.databases.mybase.tables.novels.data);
    };

    function db_init() {
        storage_novel_db = storage.get("noveldb", []);
        mybase = new alasql.Database("mybase");
        mybase.exec("CREATE TABLE novels (id INT, title STRING, lang STRING)");
        debug("localstorage novel db data .lenght", storage_novel_db.length);
        if (storage_novel_db.length >= 1) {
            //debug("direct assign data to:", "alasql.databases.mybase.tables.novels.data");
            alasql.databases.mybase.tables.novels.data = storage_novel_db;
        }
    }

    // https://stackoverflow.com/questions/7298364/using-jquery-and-json-to-populate-forms
    function populateForm($form, data) {
        $.each(data, (key, value) => {// all json fields ordered by name
            let $ctrls = $form.find("[name='" + key + "']"); //all form elements for a name. Multiple checkboxes can have the same name, but different values
            if ($ctrls.is("select")) { //special form types
                $("option", $ctrls).each(function() {
                    if (this.value == value) {
                        this.selected = true;
                    }
                });
            } else if ($ctrls.is("textarea")) {
                $ctrls.val(value);
            } else {
                switch ($ctrls.attr("type")) { //input type
                    case "text":
                    case "hidden":
                        $ctrls.val(value);
                        break;
                    case "radio":
                        if ($ctrls.length >= 1) {
                            $.each($ctrls, function(index) { // every individual element
                                let elemValue = $(this).attr("value");
                                let singleVal = value;
                                let elemValueInData = singleVal;
                                if (elemValue == value) { // === string vs integer
                                    $(this).prop("checked", true);
                                } else {
                                    $(this).prop("checked", false);
                                }
                            });
                        }
                        break;
                    case "checkbox":
                        if ($ctrls.length > 1) {
                            $.each($ctrls, function(index) { // every individual element
                                let elemValue = $(this).attr("value");
                                let elemValueInData;
                                let singleVal;
                                for (let i = 0; i < value.length; i++) {
                                    singleVal = value[i];
                                    debug("singleVal", singleVal + " value[i][1]" + value[i][1]);
                                    if (singleVal == elemValue) { // === string vs integer
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
                } //switch input type
            } // if/else
        }); // all json fields
    } // populate form
    // end functions

    setDebug(DEBUG);
    storage.options.prefix = "nutools_";
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-top-full-width",
        preventDuplicates: false,
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "5000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
    let storage_novel_db = null;
    let mybase = null;
    let cfgs = readConfig();

    db_init();
    sys_check_dbversion();

    appendHTML();

    setTimeout(function() {
        let ln_rows = 0;
        let ln_without_lang = {};

        $("td[class^='sid']").each(function() {
            let $this = $(this);
            let str = $this.attr("class");
            let id = parseInt(str.replace("sid", ""));
            let title = $this.find("a").attr("title");
            let surl = $this.find("a").attr("href");
            let tr = $this.parent().closest("tr");
            let html = "";
            let lang = "";
            let html_cover = (cfgs.cfg_cover_show_icon == 1) ? `<span class="js-nutools-show-cover" data-novel-url="${surl}" title="Show Cover"><i class="material-icons md-18">photo</i></span> ` : "";
            let html_moveToList = `<span class="js-nutools-move-to-list" data-novel-id="${id}" data-novel-title="${title}" title="Move to list"><i class="material-icons md-18">format_indent_increase</i></span>`;
            // let html_moveToList2 = `
            // [<span class="move-prompt" data-novel-id="${id}">
            //     <span class="js-nutools-move-prompt" data-novel-id="${id}" title="Move to list" style="cursor:pointer;">Move</span>
            // </span>
            // <span class="move-confirm" data-novel-id="${id}" style="display: none;">
            //     [<span class="js-nutools-move-prompt-confirm" data-novel-id="${id}" title="Confirm" style="cursor:pointer;">Confirm</span>]
            // </span>
            // <span class="move-cancel" data-novel-id="${id}" style="display: none;">
            //     [<span class="js-nutools-move-prompt-cancel" data-novel-id="${id}" title="Cancel" style="cursor:pointer;">Cancel</span>]
            // </span>]
            // `;
            let html_lang = ` <span class="js-nutools-lang" data-novel-id="${id}" data-novel-lang=""></span>`;

            // alasql database
            let result = mybase.exec("SELECT * FROM novels WHERE id=" + id + " LIMIT 1");
            if (result.length > 0) {
                debug("FOUND novel", result);
                if (result[0].lang == "") {
                    ln_without_lang[id] = surl;
                }
                lang = result[0].lang;
                html_lang = ` <span class="js-nutools-lang" data-novel-id="${id}" data-novel-lang="${result[0].lang}">`;
                if (lang !="" ){
                    html_lang += `(<b>${lang}</b>)`;
                } else {
                    html_lang += `<b></b>`;
                }
                html_lang += `</span>`;
            } else {
                debug("NOT FOUND novel, INSERT", [id, title, ""]);
                mybase.exec("INSERT INTO novels (?,?,?)", [id, title, ""]);
                ln_without_lang[id] = surl;
            }

            tr.attr("data-novel-id", id);
            $(this).prepend(`<span class="js-nutools-wrap" data-novel-id="${id}" data-novel-title="${title}">${html}${html_cover}${html_moveToList}${html_lang}</span> `);
            ln_rows++;
        });

        // $("body").on('click', ".js-nutools-move-prompt", function(event){
        //     let id = parseInt($(this).attr("data-novel-id"));

        //     $(".move-prompt[data-novel-id='" + id + "']").hide();
        //     $(".move-confirm[data-novel-id='" + id + "']").show();
        //     $(".move-cancel[data-novel-id='" + id + "']").show();
        // });
        // $("body").on('click', ".js-nutools-move-prompt-cancel", function(event){
        //     let id = parseInt($(this).attr("data-novel-id"));

        //     $(".move-prompt[data-novel-id='" + id + "']").show();
        //     $(".move-confirm[data-novel-id='" + id + "']").hide();
        //     $(".move-cancel[data-novel-id='" + id + "']").hide();
        // });

        // $("body").on('click', ".js-nutools-move-prompt-confirm", function(event){
        //     alert(id);
        //     let id = parseInt($(this).attr("data-novel-id"));
        //     let title = $(this).attr("data-novel-title");
        //     let url = "https://www.novelupdates.com/updatelist.php?lid=" + cfgs.cfg_move_to_list_id + "&act=move&sid=" + id;
        //     $.get(url, function(data) {
        //         debug("ajax get", url);
        //         toastr.success("Novel moved to list");
        //     });
        //     if (cfgs.cfg_move_reload == 1) {
        //         location.reload();
        //     }
        // });

        debug("ln without lang", ln_without_lang);
        debug("page nl rows", ln_rows);
        debug("saving db to localstorage", alasql.databases.mybase.tables.novels.data);
        storage.set("noveldb", alasql.databases.mybase.tables.novels.data);

        // Event handlers
        $(".js-nutools-show-cover").click(function() {
            let url = $(this).attr("data-novel-url");

            $.ajax({
                url: url,
                success: function(newHTML, textStatus, jqXHR) {
                    let img_html = $(newHTML).find(".seriesimg img, .serieseditimg img").first();
                    $("#js-nutools-cover-overlay").html(img_html).popup("show");
                    let max_height = Math.round($(window).height() * 0.8);
                    $("#js-nutools-cover-overlay img").attr("style", 'max-height:'+ max_height + 'px;');
                },
                error: function(jqXHR, textStatus, errorThrown) {}
            });
        });
        $(".js-nutools-move-to-list").click(function() {
            let id = parseInt($(this).attr("data-novel-id"));
            let title = $(this).attr("data-novel-title");
            let url = "https://www.novelupdates.com/updatelist.php?lid=" + cfgs.cfg_move_to_list_id + "&act=move&sid=" + id;
            // let url = `https://www.novelupdates.com/updatelist.php?lid=${cfgs.cfg_move_to_list_id}&act=move&sid=${id}`;

            if (cfgs.cfg_move_req_confirm == 1) {
                let message = "Move <i>" + title + "</i> to the reading list [ " + cfgs.cfg_move_to_list_id + " ]?";
                $("#js-nutools-move-confirm-overlay .novel-title").html(title);
                $("#js-nutools-move-confirm-overlay .reading-list-id").html(cfgs.cfg_move_to_list_id);
                $("#js-nutools-move-confirm-overlay-move-button").attr("data-novel-id", id);
                $("#js-nutools-move-confirm-overlay").popup({
                    color: "white",
                    opacity: 1,
                    transition: "0.3s",
                    scrolllock: true,
                    blur: false
                });
                $("#js-nutools-move-confirm-overlay").popup("show");
            } else {
                $.get(url, function(data) {
                    debug("ajax get", url);
                    toastr.success("Novel moved to list");
                });
                if (cfgs.cfg_move_reload == 1) {
                    location.reload();
                }
            }
        });
        $("body").on("click", "#js-nutools-move-confirm-overlay-move-button", function() {
            let id = parseInt($(this).attr("data-novel-id"));
            let title = $(this).attr("data-novel-title");
            let url = "https://www.novelupdates.com/updatelist.php?lid=" + cfgs.cfg_move_to_list_id + "&act=move&sid=" + id;
            // let url = `https://www.novelupdates.com/updatelist.php?lid=${cfgs.cfg_move_to_list_id}&act=move&sid=${id}`;
            $.get(url, function(data) {
                debug("ajax get", url);
                $("#js-nutools-move-confirm-overlay").popup("hide");
                if (cfgs.cfg_move_reload == 1) {
                    location.reload();
                }
            });
        });
        $("#js-nutools-get-language-button").click(function() {
            $("#js-nutools-get-language-confirm-overlay").popup({
                color: "white",
                opacity: 0.5,
                transition: "0.3s",
                scrolllock: true,
                blur: false
            });
            $("#js-nutools-get-language-confirm-overlay").popup("show");
        });
        $("#js-nutools-get-language-confirm-button").click(function() {
            let deferreds = [];
            let novels_lang = [];

            $("#js-nutools-get-language-confirm-overlay").popup("hide");

            for (let key in ln_without_lang) {
                let id = key;
                let url = ln_without_lang[key];
                let deferred = $.ajax(url, {
                    success: function(html) {
                        let lang = "";

                        lang = $(html).find("#showlang a").first().text();
                        console.log( lang );
                        if (lang != "") {
                            lang.replace(/()/gi, "");
                        } else {
                            lang = "N/A";
                        }
                        novels_lang[id] = lang;
                    }
                });
                deferreds.push(deferred);
            }
            $.when.apply($, deferreds).then(function() {
                for (let key in novels_lang) {
                    let isoAlpha3Code = get_lang_code(novels_lang[key]);

                    $(".js-nutools-lang[data-novel-id='" + key + "']").html("(<b>" + isoAlpha3Code + "</b>)");
                    debug("UPDATE novel entry", [key, isoAlpha3Code]);
                    mybase.exec("UPDATE novels SET lang='" + isoAlpha3Code + "' WHERE id=" + key + "");
                }
                debug("saving db to localstorage", alasql.databases.mybase.tables.novels.data);
                storage.set("noveldb", alasql.databases.mybase.tables.novels.data);
            });
        });
        $("#js-nutools-open-userscript-cp").click(function() {
            let url = "/reading-list/";
            $.ajax({
                url: url,
                success: function(newHTML, textStatus, jqXHR) {
                    let selected = $(newHTML).find("SELECT[name='taskOption']").html();

                    debug('html', selected);
                    $("#cfg_move_to_list_id").html(selected);
                    $("#js-nutools-settings-overlay").popup("show");

                    let form = $("#settings_form");
                    populateForm(form, cfgs);
                },
                error: function(jqXHR, textStatus, errorThrown) {}
            });
        });
        $(".js-nutools-settings-overlay_save").click(function() {
            event.preventDefault();
            let args = $("#settings_form").serializeJSON();
            cfgs = saveConfig(args);
            $("#js-nutools-settings-overlay").popup("hide");
            location.reload();
        });
        // $("#settings_form").on("focusin", "input", function() {
        //  //$(this).data("val", $(this).val());
        // }).on("change", "input", function() {''
        //  let args = $("#settings_form").serializeJSON();
        //  cfgs = saveConfig(args);
        // });
        $("#js-nutools-settings-overlay").popup({
            color: "white",
            opacity: 1,
            transition: "0.3s",
            scrolllock: true,
            blur: false
        });
        if (cfgs.cfg_auto_label==1) {
            $("#js-nutools-get-language-confirm-button").trigger( "click" );
        }
    }, 79); // milisec
}))();