// ==UserScript==
// @name         Reddit Flair Ban
// @namespace    RedditUsercript
// @version      1
// @description  Remove topics by flair. Only works with Classic Reddit
// @author       John Doe
// @match        https://www.reddit.com/r/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.serializeJSON/2.9.0/jquery.serializejson.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/alasql/0.5.1/alasql.min.js
// @require      https://greasyfork.org/scripts/390426-bulma-css-framework-0-7-5/code/bulma-css-framework-075.js?version=735315
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/396890/Reddit%20Flair%20Ban.user.js
// @updateURL https://update.greasyfork.org/scripts/396890/Reddit%20Flair%20Ban.meta.js
// ==/UserScript==
/* global $:false, jQuery:false, debug:false, alasql:false, Noty:false */
((() => {

    const VERSION = 1;
    const DEBUG = 0;

    const cssFiles = [
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/fontawesome.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.9.0/css/solid.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css"
    ];
    const htmlStyles = `
<style type="text/css">
.is-clipped {
    overflow: hidden !important;
}
#flair_list {
	font-size: 12px;
	font-weight: bold;
}

/* ################################  */
.layout-css-ban-flair-icon {
    font-size: 10px;
    color: black;
    cursor:pointer;
    padding-bottom: 2px;
}
.layout-unban-flair-icon {
    color:green;
    cursor:pointer;
}
.js-banned-flair-list-opener .fa-stack { font-size: 0.7em; }
.js-banned-flair-list-opener i { vertical-align: middle; }

</style>
`;
    // <i class="fas fa-cogs"></i>
    const htmlCPbutton = `
<span>
<button class="js-banned-flair-list-opener">

<span class="fa-stack fa-2x">
  <i class="fas fa-hammer fa-stack-1x"></i>
  <i class="fas fa-ban fa-stack-2x" style="color:Tomato"></i>
</span>
</button>
	<span class="separator">|</span>
</span>
`;
    const htmlPageAppend = `

<div class="bulma">

<!-- Banned Flair List -->
<div id="id-card-banned-flairs" class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">
                <span class="js-uscr-modal-draggable-handler cursor--move">Banned Flairs</span>
            </p>
            <button class="delete js-uscr-card-button-close" aria-label="close"></button>
        </header>
        <form id="id-form-banned-flairs">
            <section class="modal-card-body">
            <!-- Content ... -->

                <div class="columns">
                    <div class="column">
                        The following flairs are banned. To unban click <i class="fas fa-plus-circle"></i></span> icon.
                    </div>
                </div>
                <div class="columns">
                    <div class="column">
                       <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" id="flair_list">
                       </table>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-primary js-uscr-card-button-close">Close</button>
            </footer>
        </form>
    </div>
</div>
<!-- /CP -->

</div>
`;

    // functions
    let storage = {
        version: 1,
        // compress: false,
        options: {
            prefix: ''
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
            window.debug = function () {};
            window.console.log = function () {};
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

    function db_init() {
        CURRENT_LOCALSTORAGE_DB = storage.get("flairs", []);
        mybase = new alasql.Database("mybase");
        mybase.exec("CREATE TABLE flairs (subname STRING, flair STRING)");
        debug("localstorage db.lenght", CURRENT_LOCALSTORAGE_DB.length);
        if (CURRENT_LOCALSTORAGE_DB.length >= 1) {
            alasql.databases.mybase.tables.flairs.data = CURRENT_LOCALSTORAGE_DB;
        }
    }

    function save_db() {
        console.log(alasql.databases.mybase.tables.flairs.data);
        storage.set("flairs", alasql.databases.mybase.tables.flairs.data);
    }

    // https://stackoverflow.com/questions/7298364/using-jquery-and-json-to-populate-forms
    function populateForm($form, data) {
        $.each(data, (key, value) => { // all json fields ordered by name
            let $ctrls, $ctrl;

            if (value instanceof Array) {
                $ctrls = $form.find("[name='" + key + "[]']"); //all form elements for a name. Multiple checkboxes can have the same name, but different values
            } else {
                $ctrls = $form.find("[name='" + key + "']");
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
                                    debug("singleVal", singleVal, "/value[i][1]", value[i][1]);
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
                } //switch input type
            } // if/else
        }); // all json fields
    } // populate form

    function getSubName() {
        let url = window.location.href;

        let regex = /^https?:\/\/(?:www\.)?reddit\.com\/r\/([^\/?\s]+)\/?/i;
        let match = url.match(regex);
        return match[1];
    }
    function getSubBannedFlairs() {
        return mybase.exec("SELECT * FROM flairs WHERE subname=?", [CURRENT_SUB_NAME]);
    }
    // end functions

    setDebug(DEBUG);

    let mybase = null;
    let CURRENT_SUB_NAME = null;
    let CURRENT_SUB_FLAIRS = [];
    let CURRENT_LOCALSTORAGE_DB = null;
    let CURRENT_USERNAME = $("#header .user A").text();

    db_init();

    CURRENT_SUB_NAME = getSubName();
    CURRENT_SUB_FLAIRS = getSubBannedFlairs();

    console.log('CURRENT_SUB_NAME', CURRENT_SUB_NAME);
    console.log('CURRENT_SUB_FLAIRS', CURRENT_SUB_FLAIRS);

    appendFilesToHead(cssFiles, "css");
    $("head").append(htmlStyles);
    $("body").append(htmlPageAppend);
    $("#header-bottom-right").prepend(htmlCPbutton);

    setTimeout(function(){

        let c = 0;
        CURRENT_SUB_FLAIRS.forEach(function(item){
            $(`.linkflairlabel[title="${item.flair}"]`).each(function(){
                console.log('remove thread', item.flair);
                $(this).closest("DIV[data-fullname^='t3_']").remove();
                c++;
            });
        });
        console.log('counter : removed threads', c );

        $("p.title > .linkflairlabel ").each(function (index, value) {
            let html = "";
            let name = $(this).text();

            html = `<span class="js-flair-ban" data-name="${name}" title="Filter : Remove '${name}' from listing"><span class="layout-css-ban-flair-icon"><i class="fas fa-minus-circle"></i></span></span>`;
            let append = `<span class="layout-after-flair" data-name="${name}">${html} </span>`;
            $(this).after(append);
        });

        // CARD > BUTTON CLOSE
        $(".js-uscr-card-button-close").click(function () {
            event.preventDefault();
            let card_id = $(this).closest(".modal").attr("id");

            $(`#${card_id}`).removeClass('is-active');
            $('html').removeClass('is-clipped');
            return false;
        });

        // OPEN
        $(".js-banned-flair-list-opener").click(function () {
            let html_flairs = '';
            let result = mybase.exec("SELECT * FROM flairs WHERE subname = ?", [CURRENT_SUB_NAME]);
            let counter = 0;

            console.log(result);
            result.forEach(function(item){
                counter++;
                html_flairs += `
                    <tr id="row_${counter}">
                        <td>${item.flair} </td>
                        <td><span class="js-flair-unban layout-unban-flair-icon" data-name="${item.flair}" data-row="${counter}"><i class="fas fa-plus-circle"></i></span></td>
                    </tr>
                `;
            });

            $("#flair_list").html(html_flairs);
            $('html').addClass('is-clipped');
            $("#id-card-banned-flairs").addClass("is-active");
        });

        $(".js-flair-ban").click(function () {
            let name = $(this).attr("data-name");
            console.log('name', name);
            mybase.exec("DELETE FROM flairs WHERE subname=? and flair = ?", [CURRENT_SUB_NAME, name]);
            mybase.exec("INSERT INTO flairs (?,?)", [CURRENT_SUB_NAME, name]);

            new Noty({
                type: 'success',
                text: 'Flair banned: ' + name + '',
            }).show();
            save_db();
        });

        $(document).on('click', '.js-flair-unban', function(e) {
            let name = $(this).attr("data-name");
            let row = $(this).attr("data-row");

            console.log('name', name);
            mybase.exec("DELETE FROM flairs WHERE subname=? and flair = ?", [CURRENT_SUB_NAME, name]);
            $("#row_"+row).remove();
            new Noty({
                type: 'success',
                text: 'Flair unbanned: ' + name + '',
            }).show();
            save_db();
        });

    }, 200);

    Noty.overrideDefaults({
        layout   : 'topRight',
        closeWith: ['click', 'button'],
        progressBar: false,
        timeout: 2000,
        closeWith: ['click'],
    });

}))();