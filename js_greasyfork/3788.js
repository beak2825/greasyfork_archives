// ==UserScript==
// @name        GOTA Extender
// @namespace   gota_extender
// @author      Panayot Ivanov
// @description Game of Thrones Ascent Extender
// @include     http://gota.disruptorbeam.com/*
// @include     http://gota-www.disruptorbeam.com/*
// @include     https://gota.disruptorbeam.com/*
// @include     https://gota-www.disruptorbeam.com/*
// @include     https://games.disruptorbeam.com/gamethrones/
// @exclude     http://gota.disruptorbeam.com/users/login*
// @exclude     http://gota-www.disruptorbeam.com/users/login*
// @license     WTFPL (more at http://www.wtfpl.net/)
// @require     http://code.jquery.com/jquery-2.1.3.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.9.0/moment.min.js
// @require     https://greasyfork.org/scripts/5279-greasemonkey-SuperValues/code/GreaseMonkey_SuperValues.js?_dc=548
// @require     https://greasyfork.org/scripts/7573-storage-prototype-extension/code/StoragePrototype_extension.js?_dc=117
// @require     https://greasyfork.org/scripts/5427-gota-extender-constants/code/GOTA_Extender_Constants.js?_dc=111
// @resource 	custom https://greasyfork.org/scripts/5426-gota-extender-custom/code/GOTA_Extender_Custom.js?_dc=222
// @resource    auxiliary https://greasyfork.org/scripts/5618-gota-extender-auxiliary/code/GOTA_Extender_Auxiliary.js?_dc=911
// @resource    original https://greasyfork.org/scripts/6702-gota-extender-original/code/GOTA_Extender_Original.js?_dc=318
// @resource    production https://greasyfork.org/scripts/7611-gota-extender-production/code/GOTA_Extender_Production.js?_dc=557
// @version     7.2.3
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/3788/GOTA%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/3788/GOTA%20Extender.meta.js
// ==/UserScript==

// Resolves conflicts of different jQuery versions
$ = this.$ = this.jQuery = jQuery.noConflict(true);
var cloneInto = cloneInto || warn("No function for cloning objects found. This is vital if the script runs on Firefox!", "Components");
var exportFunction = exportFunction || warn("No function for exporting functions found. This is vital if the script runs on Firefox!", "Components");
var unsafeWindow = unsafeWindow || error("This script requires access to the unsafeWindow.", "Greasemonkey");
var GM_getValue = GM_getValue || error("This script requires access to the GM_getValue.", "Greasemonkey");
var GM_setValue = GM_setValue || error("This script requires access to the GM_setValue.", "Greasemonkey");
var GM_openInTab = GM_openInTab || error("This script requires access to the GM_openInTab function.", "Greasemonkey");
var GM_xmlhttpRequest = GM_xmlhttpRequest || error("This script requires access to the GM_xmlhttpRequest.", "Greasemonkey");
var GM_getResourceText = GM_getResourceText || error("This script requires access to the GM_getResourceText function.", "Greasemonkey");
var GM_getResourceURL = GM_getResourceURL || error("This script requires access to the GM_getResourceURL function.", "Greasemonkey");
var GM_registerMenuCommand = GM_registerMenuCommand || error("This script requires access to the GM_registerMenuCommand function.", "Greasemonkey");
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || error("This script requires access to the GM_registerMenuCommand function.", "Observer");

// --> Register menu commands
(function(){
    GM_registerMenuCommand("HOME", openHome);
    function openHome() {
        GM_openInTab("https://greasyfork.org/en/scripts/3788-gota-extender");
    }

    GM_registerMenuCommand("DEBUG", enterDebugMode);
    function enterDebugMode() {
        options.debugMode = true;
        options.set("debugMode");

        alert("Debug mode has been enabled. Extender will now reload.");
        window.location.reload(true);
    }

    GM_registerMenuCommand("CHECK", checkScript);
    function checkScript() {
        options.checkScript = true;
        options.set("checkScript");

        alert("Extender will check for game function updates.\nPress OK to reload.");
        window.location.reload(true);
    }

    GM_registerMenuCommand("CLEAN", clean);
    function clean() {
        if(window.confirm("This will delete your locally stored data, but not your preferences.\nAre you sure?")){
            localStorage.clear();
            sessionStorage.clear();

            alert("Extender revived your storage.");
        }
    }
}());
// <-- End of menu commands

// --> Initialization
$(window).bind("load", function () {

    // Kill logging first prior to init
    inject.code("window.doLog = function() {};");
    inject.code('(' + overrideFinishLoader.toString() + ')()');

});

function overrideFinishLoader(){
    window.finishExtenderLoad = window.finishLoader;
    window.finishLoader = function() {
        var event = new Event('initEX');
        window.dispatchEvent(event);
    }
}

var initialization = {
    inform: function (msg, progress, info) {

        var exalert = $("h2#loadinginfo-l:visible");
        var expinfo = $("em#preloader_message:visible");
        var exprogress = $("div.loadingbar-inner:visible");
        var progresspercent = $("h2#loadinginfo-r:visible");

        if (exalert.length) { // shown
            msg &&
            exalert.html(msg + ":");

            info && expinfo &&
            expinfo.html(info);

            progress && exprogress &&
            progresspercent.html(progress + "%");
            exprogress.css("width", progress + "%");
        }

    },

    error: function (msg, type) {

        var exalert = $("h2#loadinginfo-l:visible");
        var expinfo = $("em#preloader_message:visible");

        if (!type)
            type = "extender";

        var prefix = type.toString().toUpperCase() + " - ERROR <" + new Date().toLocaleTimeString() + "> ";
        console.error(prefix + msg);

        if (expinfo.length) { // shown
            exalert.html("ERROR:");
            msg && expinfo.html(msg);
        }

        setTimeout(function(){
            unsafeWindow.finishExtenderLoad();
        }, 1E3);

    },

    begin: function () {

        window.removeEventListener("initEX", initialization.begin);
        $('#loadingbg').show();

        this.current = -1;
        initialization.next();
        initialization.inform("EXTENDER", 1, "Begin...");
    },

    next: function () {

        try {

            this.current++;

            var percent = ((this.current + 1) / this.functions.length) * 100;
            initialization.inform(false, percent, false);

            if (typeof this.functions[this.current] == "function") {

                // Invoke next init function
                this.functions[this.current]();

            } else {

                initialization.inform("DONE", 100, "happy hacking!");
                setTimeout(function(){
                    unsafeWindow.finishExtenderLoad();
                }, 1E3);

            }

        } catch (eMsg) {

            initialization.error("Fatal error, initialization failed: " + eMsg, "INITIALIZATION");
            initialization.inform("ERROR", false, "Fatal error, initialization failed: " + eMsg);

        }
    },

    current: -1,
    functions: [

        // CleanUp
        function () {
            // Clean up
            console.clear();
            initialization.next();
        },

        // Init logger
        function icnsl(retry) {

            if (retry == void 0) {
                initialization.inform("", false, "Initializing message system...");
                inject.console();
            }

            if (typeof unsafeWindow.log == "function") {
                log("Messaging system initialized successfully.", "INITIALIZATION");
                initialization.next();
            } else {
                setTimeout(function () {
                    retry
                        ? (retry < 7
                        ? icnsl(++retry)
                        : initialization.error("Messaging system failed to initialize.", "INITIALIZATION"))
                        : icnsl(1);
                }, 500);
            }

        },

        // Init options
        function () {

            // Get all GM values
            initialization.inform("", false, "Fetching preferences...");
            options.get();

            // Check script if scheduled
            if (options.checkScript) {

                initialization.inform("CHECK", 50, "Script scheduled for update check...");

                checkSource();

                initialization.inform("DONE", 100, "Reloading...");

                options.checkScript = false;
                options.set("checkScript");
                window.location.reload(true);

                return;
            }

            initialization.next();

        },

        // Init styles
        function istys(retry) {

            if (retry == void 0) {
                // Add global styles
                initialization.inform("", false, "Injecting styles...");
                styles.addAllStyles();
            }

            if ($("style#extenderStyles").length) {
                log("Styles initialized successfully.", "INITIALIZATION");
                initialization.next();
            } else {
                setTimeout(function () {
                    retry
                        ? (retry < 7
                        ? istys(++retry)
                        : initialization.error("Styles failed to initialize.", "INITIALIZATION"))
                        : istys(1);
                }, 500);
            }
        },

        // Init storage
        // prototype extensions
        function spex(retry) {

            if (retry == void 0) {
                // Inject Storage extension functions (for use in the page)
                initialization.inform("", false, "Injecting storage...");
                inject.outSource("https://greasyfork.org/scripts/7573-storage-prototype-extension/code/StoragePrototype_extension.js");
            }

            if (typeof unsafeWindow.localStorage.get == "function") {
                log("Storage initialized successfully.", "INITIALIZATION");

                console.log("Debugging Components: " +
                    "cloneInto ? ", (typeof cloneInto),
                    "exportFunction ? ", (typeof exportFunction));

                //if (options.useLocalDbOnly) {
                //
                //    if (typeof exportFunction == "function") {
                //    //if (false) {
                //        unsafeWindow.Storage.prototype.set =
                //            exportFunction(GM_SuperValue.set, unsafeWindow, {defineAs: "ExtenderSet"});
                //        unsafeWindow.Storage.prototype.get =
                //            exportFunction(GM_SuperValue.get, unsafeWindow, {defineAs: "ExtenderGet"});
                //    } else {
                //        unsafeWindow.Storage.prototype.set = GM_SuperValue.set;
                //        unsafeWindow.Storage.prototype.get = GM_SuperValue.get;
                //    }
                //
                //    log("Storage configured to use only SQLite.", "INITIALIZATION");
                //}

                initialization.next();
            } else {
                setTimeout(function () {
                    retry
                        ? (retry < 7
                        ? spex(++retry)
                        : initialization.error("Storage extension failed to initialize.", "INITIALIZATION"))
                        : spex(1);
                }, 500);
            }
        },

        // Init page override
        function aux(retry) {

            if (retry == void 0) {
                // Inject auxiliary code
                initialization.inform("", false, "Overriding page functions...");
                inject.code(GM_getResourceText("custom"));
                inject.code(GM_getResourceText("auxiliary"));
                inject.code(GM_getResourceText("production"));
            }

            if (unsafeWindow.extender != void 0) {
                log("Injection sequence successful.", "INITIALIZATION");
                initialization.next();
            } else {
                setTimeout(function () {
                    retry
                        ? (retry < 7
                        ? aux(++retry)
                        : initialization.error("Injection sequence failed.", "INITIALIZATION"))
                        : aux(1);
                }, 500);
            }
        },

        // Init observable & constants
        function oci(retry) {

            if (retry == void 0) {
                // Try an injection sequence
                initialization.inform("", false, "Injecting console & constants...");
                inject.observable();
                inject.constants();
            }

            if ($("textarea#observable").length) {
                log("Observable console & constants initialized successfully.", "INITIALIZATION");
                initialization.next();
            } else {
                setTimeout(function () {
                    retry
                        ? (retry < 7
                        ? oci(++retry)
                        : initialization.error("Observable console and/or constants failed to initialize.", "INITIALIZATION"))
                        : oci(1);
                }, 500);
            }
        },

        // Init modules
        function () {

            initialization.inform("", false, "Loading modules...");

            unsafeWindow.production.init(options.export(["queueDelay", "superiorMaterials", "doSpeedUp"]));
            unsafeWindow.bossChallenger.init(options.export(["autoBossChallenge"]));
            unsafeWindow.worldEvent.init(options.export(["weManagerEnabled", "worldEventDelay"]));

            // TODO: Uncomment when questMan ready
            //unsafeWindow.questMan.init(options.export(["questManagerDelay", "questManagerEnabled"]));

            initialization.next();
        },

        // Init game
        function ingex(retry) {

            if (retry == void 0) {
                initialization.inform("", false, "Loading extender...");
            } else {
                initialization.inform("", false, "Loading extender (" + retry + ") ...");
            }

            //console.log("Debugging extender load: ", unsafeWindow.userContext);
            if (unsafeWindow.userContext == void 0) {
                setTimeout(function () {
                    retry
                        ? (retry < 21
                        ? ingex(++retry)
                        : initialization.error("Failed to load extender after 21 retries.", "INITIALIZATION"))
                        : ingex(1);
                }, 500);

                return;
            }

            // Toggle
            toggleAll();

            // Claim
            quarterMasterDo();

            // Claim favours
            acceptAllFavors();

            // Send out gifts
            sendGifts();

            // Store all sworn swords
            getSwornSwords();

            // Sort player inventory
            unsafeWindow.sort();

            setTimeout(function () {
                initialization.next();
            }, 500);
        }
    ]
};

window.addEventListener("initEX", initialization.begin);
// <-- End of initialization

// --> Main toolbar mutations observer

// Observers construction
var mainToolbarObserver = new MutationObserver(main_toolbar_buttons_changed);

// define what element should be observed by the observer
// and what types of mutations trigger the callback
mainToolbarObserver.observe(document.getElementById("main_toolbar_buttons"), {
    //	childList: true,
    attributes: true,
    //	characterData: true,
    subtree: true,
    attributeOldValue: true
    // if attributes
    //	characterDataOldValue: true,    // if characterData
    //	attributeFilter: ["id", "dir"], // if attributes
});

function main_toolbar_buttons_changed() {
    //    log("Mutation on main toolbar buttons.");

    var menu = $("#extender-menu");
    var container = $("#navmenubox");
    if (container.length > 0 && menu.length == 0) {
        container.append(templates.menuBtn);
    }
}
// <-- End of mutations observer

// --> Page command handling
var signalObserver = new MutationObserver(signal_acknowledged);
function signal_acknowledged() {
    var observable = $("textarea#observable");

    if (!observable) {
        error("The observable DOM element was not found in the page.");
        return;
    }

    var msg = "Error: Unknown command.";
    var commandObj = JSON.parse(observable.attr("command"));
    var prefix = "COMMAND ACKNOWLEDGED" + " | " + new Date().toLocaleTimeString() + " | ";

    if (!commandObj || typeof commandObj != "object") {
        msg = "Error: Cannot parse the command object given.";
        observable.val(prefix + msg);
        error(msg);
        return;
    }

    if (typeof commandObj.name !== "string") {
        msg = "Error: Command does not have a name specified.";
        observable.val(prefix + msg);
        error(msg);
        return;
    }

    var args = commandObj.args;

    // Parse command
    switch (commandObj.name) {
        case "option":

            //console.debug(commandObj);

            // Rely on the second check only
            if (options.hasOwnProperty(args[0]) && typeof options[args[0]] === typeof args[1]) {
                options[args[0]] = args[1];
                options.set(args[0]);

                observable.val(prefix + "Option " + args[0] + " set to " + args[1] + " successfully.");
                log("Option " + args[0] + " set to " + args[1] + " successfully.", "COMMAND")
                return;
            }

            if (options.hasOwnProperty(args[0])) {

                if (typeof options[args[0]] == "object") {
                    log(args[0] + " is a composite object:", "COMMAND");
                    console.log(typeof cloneInto == "function" ? cloneInto(options[args[0]], unsafeWindow) : options[args[0]]);
                } else {
                    log(args[0] + ": " + options[args[0]], "COMMAND");
                }

                observable.val(prefix + "See console for requested option.");
                return;
            }

            msg = "Warning: Lack of or incorrect parameters passed to command.";
            observable.val(prefix + msg);
            warn(msg, "COMMAND");

            break;
        case "collect":
            log("Immediate collect attempt.", "COMMAND");
            collectTax();
            break;
        case "import":
            options.import(unsafeWindow.extender.options);
            log("Options imported successfully.", "COMMAND");
            break;
        default:
            observable.val(prefix + msg);
            error(msg, "COMMAND");

            break;
    }
}
// <-- Page command handling

// TODO: Implement..
//var PERSISTABLE =  {
//
//    get queue() {
//        return localStorage.get("productionQueue", []);
//    },
//
//    set queue(val) {
//        localStorage.set("productionQueue", val);
//    }
//};

// --> Options object
var options = {
    swornSwords: [],
    default_swornSwords: [],

    // Non-tweakable options
    lastIdChecked: 2,
    default_lastIdChecked: 1,

    doSpeedUp: true,
    default_doSpeedUp: true,

    logLevel: ["QMASTER", "FAVOR", "DAILY", "ADVENTURE"],
    default_logLevel: ["QMASTER", "FAVOR", "DAILY", "ADVENTURE"],
    outputLogAsText: false,
    default_outputLogAsText: false,
    logLevelTimestamp: "all_time",
    default_logLevelTimestamp: "all_time",
    appendLastSeen: true,
    default_appendLastSeen: true,
    debugMode: true,
    default_debugMode: true,
    checkScript: false,
    default_checkScript: false,
    baseDelay: 4,
    default_baseDelay: 4,
    queueDelay: 4,
    default_queueDelay: 4,
    autoCollectInterval: 60,
    default_autoCollectInterval: 60,
    superiorMaterials: true,
    default_superiorMaterials: true,
    queueTimerInterval: 30,
    default_queueTimerInterval: 30,
    bruteWounds: 1,
    default_bruteWounds: 1,
    bruteSwitchOff: true,
    default_bruteSwitchOff: true,
    doTooltips: false,
    default_doTooltips: false,
    neverSpendGold: true,
    default_neverSpendGold: true,
    autoReloadInterval: 6,
    default_autoReloadInterval: 6,
    boonsSortBy: "available_quantity",
    default_boonsSortBy: "available_quantity",
    boonsSortBy2: "rarity",
    default_boonsSortBy2: "rarity",
    shopSortBy: "price",
    default_shopSortBy: "price",
    shopSortBy2: "rarity",
    default_shopSortBy2: "rarity",
    sendAllAction: "all",
    default_sendAllAction: "all",
    autoBossChallenge: false,
    default_autoBossChallenge: false,

    featureTesting: false,
    default_featureTesting: false,
    hideLockedBuildings: true,
    default_hideLockedBuildings: true,

    selectedAction: null,
    default_selectedAction: null,

    autoQMaster: true,
    default_autoQMaster: true,
    avaSendSubcamps: false,
    default_avaSendSubcamps: false,

    weManagerEnabled: false,
    default_weManagerEnabled: false,
    worldEventDelay: 6,
    default_worldEventDelay: 6,

    defaultBattle: "fight",
    default_defaultBattle: "fight",
    defaultTrade: "barter",
    default_defaultTrade: "barter",
    defaultIntrigue: "spy",
    default_defaultIntrigue: "spy",

    useLocalDbOnly: false,
    default_useLocalDbOnly: false,

    get: function () {

        // --> NOTE !!! SEPARATE HOSTS ARE NO LONGER SUPPORTED !!!

        //var prefix = "";

        // Separate variable retrieval for both hosts
        //if (unsafeWindow.location.host === "gota-www.disruptorbeam.com") {
        //    prefix = "gota-";
        //}

        // <-- NOTE !!! SEPARATE HOSTS ARE NO LONGER SUPPORTED !!!

        for (var property in this) {
            if (this.hasOwnProperty(property) && property.indexOf("default_") == -1 && typeof this[property] != "function") {
                // console.debug("Retrieving " + prefix + property + " with default value of " + this["default_" + property]);
                this[property] = GM_SuperValue.get(property, this["default_" + property]);
                // console.debug("Property " + property + " has a value of " + this[property]);
            }
        }
    },

    set: function (opt) {

        // --> NOTE !!! SEPARATE HOSTS ARE NO LONGER SUPPORTED !!!

        //var prefix = "";
        //// Separate variable set for both hosts
        //if (unsafeWindow.location.host === "gota-www.disruptorbeam.com") {
        //    prefix = "gota-";
        //}

        // <-- NOTE !!! SEPARATE HOSTS ARE NO LONGER SUPPORTED !!!

        if (opt && this.hasOwnProperty(opt)) {
            GM_SuperValue.set(opt, this[opt]);
            return;
        }

        // Store all properties
        for (var prop in this) {
            if (this.hasOwnProperty(prop) && prop.indexOf("default_") > -1)
                continue;

            if (this.hasOwnProperty(prop) && typeof this[prop] != "function") {
                GM_SuperValue.set(prop, this[prop]);
            }
        }
    },

    reset: function () {
        for (var property in this) {
            if (this.hasOwnProperty(property) && property.indexOf("default_") == -1 && typeof this[property] != "function") {
                this[property] = this["default_" + property];
            }
        }

        this.set();
    },

    import: function(o){
        try {
            if (!o || typeof o !== "object") {
                error("Cannot import options. Incorrect parameter passed.");
                return;
            }

            for (var p in o) {
                if (!this.hasOwnProperty(p))
                    continue;

                //console.debug(this[p] instanceof Array, o[p] instanceof unsafeWindow.Array);
                if (this[p] instanceof Array && o[p] instanceof unsafeWindow.Array) {
                    if (this[p].length != o[p].length) {
                        //console.debug("Import ", p, " with value ", o[p]);
                        this[p] = o[p];
                        this.set(p);
                    }

                    continue;
                }

                if (this[p] !== o[p]) {
                    //console.debug("Import ", p, " with value ", o[p]);
                    this[p] = o[p];
                    this.set(p);
                }
            }
        } catch (err) {
            error("Importing failure: " + err, "OPTIONS");
        }
    },

    export: function(params){
        try {
            var exportObject = {};
            if (params == void 0) {

                for (var opt in this) {
                    if (this.hasOwnProperty(opt) && opt.indexOf("default_") == -1 && typeof this[opt] != "function") {
                        exportObject[opt] = this[opt];
                    }
                }

                return typeof cloneInto == "function"
                    ? cloneInto(exportObject, unsafeWindow) // return structured clone
                    : exportObject; // regular object (no need of cloning)
            }

            if (typeof params == "object" && params instanceof Array) {

                for (var i = 0; i < params.length; i++) {
                    var exportProperty = params[i];
                    if (this.hasOwnProperty(exportProperty) && this[exportProperty] != "function") {
                        exportObject[exportProperty] = this[exportProperty];
                    }
                }

                return typeof cloneInto == "function"
                    ? cloneInto(exportObject, unsafeWindow) // return structured clone
                    : exportObject; // regular object (no need of cloning)
            }

            // Further cases regard string only
            if (typeof params != "string") {
                warn("Cannot resolve export parameters.");
                return null;
            }

            if (this.hasOwnProperty(params) && this[params] != "function")
                return typeof cloneInto == "function"
                    ? cloneInto(this[params], unsafeWindow) // return structured clone
                    : this[params]; // regular object (no need of cloning)

            if (this.hasOwnProperty(params) && this[params] == "function")
                return typeof exportFunction == "function"
                    ? exportFunction(this[params], unsafeWindow) // return exported function
                    : this[params]; // regular function (no need of exporting)
        } catch(err) {
            error("Exporting failure: " + err, "OPTIONS");
        }
    }
};
// <-- End of options object

// --> Injection object
var inject = {

    // Constants required by the page
    constants: function () {

        // Safe string
        unsafeWindow.phraseText.shop_filter_extender = "Extender";

        // EXTENDER :: Modification - add custom filter
        if (unsafeWindow.shopFilters.indexOf("extender") == -1) {
            log("Injecting extender filter...");
            unsafeWindow.shopFilters.push("extender");
        }

        unsafeWindow.extender.options = options.export();

        //Inject structured clone (for Mozilla)
        if (typeof (cloneInto) == "function") {
        //    unsafeWindow.extender_queueDelay = cloneInto(options.queueDelay, unsafeWindow);
        //    unsafeWindow.extender_confirmSuperiorMaterials = cloneInto(options.superiorMaterials, unsafeWindow);
        //    unsafeWindow.extender_bruteWounds = cloneInto(options.bruteWounds, unsafeWindow);
        //    unsafeWindow.extender_bruteSwitchOff = cloneInto(options.bruteSwitchOff, unsafeWindow);
        //    unsafeWindow.extender_debugMode = cloneInto(options.debugMode, unsafeWindow);
        //    unsafeWindow.extender_baseDelay = cloneInto(options.baseDelay, unsafeWindow);
        //    unsafeWindow.extender_neverSpendGold = cloneInto(options.neverSpendGold, unsafeWindow);
        //
        //    unsafeWindow.extender_boonsSortBy = cloneInto(options.boonsSortBy, unsafeWindow);
        //    unsafeWindow.extender_boonsSortBy2 = cloneInto(options.boonsSortBy2, unsafeWindow);
        //    unsafeWindow.extender_shopSortBy = cloneInto(options.shopSortBy, unsafeWindow);
        //    unsafeWindow.extender_shopSortBy2 = cloneInto(options.shopSortBy2, unsafeWindow);
        //
        //    unsafeWindow.extender_sendAllAction = cloneInto(options.sendAllAction, unsafeWindow);
        //    //unsafeWindow.extender_autoBossChallenge = cloneInto(options.autoBossChallenge, unsafeWindow);
        //
            unsafeWindow.userContext.tooltipsEnabled = cloneInto(options.doTooltips, unsafeWindow);
        //
        } else {
        //    //unsafeWindow.extender_queueDelay = options.queueDelay;
        //    //unsafeWindow.extender_confirmSuperiorMaterials = options.superiorMaterials;
        //    unsafeWindow.extender_bruteWounds = options.bruteWounds;
        //    unsafeWindow.extender_bruteSwitchOff = options.bruteSwitchOff;
        //    unsafeWindow.extender_debugMode = options.debugMode;
        //    unsafeWindow.extender_baseDelay = options.baseDelay;
        //    unsafeWindow.extender_neverSpendGold = options.neverSpendGold;
        //
        //    unsafeWindow.extender_boonsSortBy = options.boonsSortBy;
        //    unsafeWindow.extender_boonsSortBy2 = options.boonsSortBy2;
        //    unsafeWindow.extender_shopSortBy = options.shopSortBy;
        //    unsafeWindow.extender_shopSortBy2 = options.shopSortBy2;
        //
        //    unsafeWindow.extender_sendAllAction = options.sendAllAction;
        //    //unsafeWindow.extender_autoBossChallenge = options.autoBossChallenge;
        //
            unsafeWindow.userContext.tooltipsEnabled = options.doTooltips;
        }

        log("Constants injected successfully.", "INJECTOR");
    },

    // Inject code
    code: function (code) {

        var script = document.createElement('script');
        script.type = "text/javascript";
        script.innerHTML = code;
        document.head.appendChild(script);

        log("Code injected successfully.", "INJECTOR");
    },

    outSource: function (src, delay) {

        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = src;

        delay ? setTimeout(function () {
            document.head.appendChild(script);
        }, (options.baseDelay / 4) * 1000) : document.head.appendChild(script);

        log("Script from outer source injected.", "INJECTOR");
    },

    // Injects a DOM object and starts observing it
    observable: function () {

        $("div#outerwrap div.footer").prepend(templates.observable);
        signalObserver.observe(document.getElementById("observable"), {
            //	childList: true,
            attributes: true,
            //	characterData: true,
            //  subtree: true,
            attributeOldValue: true
            // if attributes
            //	characterDataOldValue: true,    // if characterData
            //	attributeFilter: ["id", "dir"], // if attributes
        });

        log("Observable injected successfully.", "INJECTOR");
    },

    // Inject console and alert handling separately once
    console: function () {
        if (typeof exportFunction == "function") {
            exportFunction(log, unsafeWindow, {defineAs: "log"});
            exportFunction(warn, unsafeWindow, {defineAs: "warn"});
            exportFunction(error, unsafeWindow, {defineAs: "error"});

            exportFunction(clientLog, unsafeWindow, {defineAs: "clientLog"});

            exportFunction(inform, unsafeWindow, {defineAs: "inform"});
            //exportFunction(progress, unsafeWindow, {defineAs: "progress"});

        } else {
            unsafeWindow.log = log;
            unsafeWindow.warn = warn;
            unsafeWindow.error = error;

            unsafeWindow.clientLog = clientLog;

            unsafeWindow.inform = inform;
            //unsafeWindow.progress = progress;
        }

        log("Messaging system injected successfully.", "INJECTOR");
    }
};
// <-- End of injection object

// --> Message handling & log
function log(message, type) {

    if (typeof message == "object") {
        clientLog(message, type);
        return;
    }

    if (options && options.debugMode && console && console.log
        && typeof (console.log) == "function") {
        if (!type)
            type = "extender";

        var prefix = type.toString().toUpperCase() + " <" + new Date().toLocaleTimeString() + "> ";
        console.log(prefix + message);
    }
}

function error(message, type) {
    if (console && console.error && typeof (console.error) == "function") {
        if (!type)
            type = "extender";

        var prefix = type.toString().toUpperCase() + " - ERROR <" + new Date().toLocaleTimeString() + "> ";
        console.error(prefix + message);
    }
}

function warn(message, type) {
    if (console && console.warn && typeof (console.warn) == "function") {
        if (!type)
            type = "extender";

        var prefix = type.toString().toUpperCase() + " - WARNING <" + new Date().toLocaleTimeString() + "> ";
        console.warn(prefix + message);
    }
}

function inform(msg, progress, info) {

    if (unsafeWindow && typeof unsafeWindow.doAlert == "function") {

        var exalert = $("div#exalert.exrow:visible");
        var expinfo = $("div#expinfo.exrow:visible");
        var exprogress = $("div#exprogress.progstretch-inner:visible");

        if(exalert.length) { // alert shown
            msg &&
                exalert.html(msg);

            info && expinfo &&
                expinfo.html(info);

            progress && exprogress &&
                exprogress.css("width", progress + "%");

            return;
        }

        // Construct alert
        unsafeWindow.doAlert("EXTENDER", templates.formatAlert(msg, progress, info))

    } else if (alert && typeof alert == "function")
        alert("Progress: " + progress + " : " + info + "\n\n" + msg);
}

function clientLog(data, type) {
    //console.debug("Debugging arguments: ", arguments);

    if (options.logLevel.indexOf(type) > -1) {

        //console.debug("Debugging data: ", data);

        var clientEntries = sessionStorage.get("clientEntries", []);
        if(data.message != void 0){
            var msg = {
                message: data.message,
                type: type,
                timestamp: moment().format()
            };

            clientEntries.push(msg);

        } else {
            var stored = clientEntries.filter(function (item) {
                return item.symbol === data.symbol;
            })[0];  // check if it the logged item is in the array

            if (stored != void 0) {   // already in storage
                stored.quantity += data.quantity;
                stored.type = "";
                stored.timestamp = "";
            } else {                // new entry
                var entry = {
                    symbol: data.symbol,
                    type: type,
                    quantity: data.quantity,
                    timestamp: moment().format()
                };

                clientEntries.push(entry);
            }
        }

        sessionStorage.set("clientEntries", clientEntries);
    }
}
// <-- Message handling

// --> Loops handling
function toggleAll() {
    toggleAutoCollect();
    toggleQueueTimer();
    toggleReloadWindow();
}

var autoCollectLoop;
function toggleAutoCollect() {
    if (options.autoCollectInterval > 0) {
        autoCollectLoop = setInterval(collectTax, options.autoCollectInterval * 60 * 1000);
        log("Auto collect loop set to: " + options.autoCollectInterval + "min.");

        log("Immediate collect attempt.", "EXTENDER");
        collectTax();

    } else {
        autoCollectLoop = clearInterval(autoCollectLoop);
        log("Auto collect loop disabled.");
    }
}

var queueTimer;
function toggleQueueTimer() {
    if (options.queueTimerInterval > 0) {
        queueTimer = setInterval(unsafeWindow.production.attempt, options.queueTimerInterval * 60 * 1000);
        log("Queue timer interval set to: " + options.queueTimerInterval + "min.");

        log("Immediate production attempt.", "EXTENDER");
        unsafeWindow.production.attempt();
        
    } else {
        queueTimer = clearInterval(queueTimer);
        log("Queue timer disabled.");
    }
}

var reloadWindowTimeout;
function toggleReloadWindow() {
    if (options.autoReloadInterval > 0) {
        setTimeout(function () {
            //saveProductionQueue();
            window.location.reload(true);
        }, options.autoReloadInterval * 60 * 60 * 1000);
        log("Auto reload interval set to: " + options.autoReloadInterval + "h.");
    } else {
        reloadWindowTimeout = clearTimeout(reloadWindowTimeout);
        log("Auto reloading cancelled.");
    }

}

function acceptAllFavors() {
    ajax({
        url: "/play/accept_favor",
        success: function (r) {
            //console.debug(r, r.accepted);

            r.silver_reward && log({
                symbol: "silver_coins",
                quantity: r.silver_reward
            }, "FAVOR");

            if(!$.isEmptyObject(r.accepted)){
                for(var item in r.accepted){
                    if(!r.accepted.hasOwnProperty(item))
                        continue;

                    var value = r.accepted[item];
                    r.silver_reward && log({
                        symbol: item,
                        quantity: value
                    }, "FAVOR");

                    //log("Accepted: " + value + " x " + item, "FAVOR", true);
                }
            } else {
                log("All favors have been claimed.");
            }
        }
    });
}

function quarterMasterDo(status) {

    if (!status) {
        ajax({
            url: "/play/quartermaster_status",
            success: function (response) {
                quarterMasterDo(response);
            }
        });

        return;
    }

    if (options.autoQMaster && status.total_keys) {
        openBox();
        return;
    }

    if (status.available_daily_key) {
        claimDailyQuarterMaster();
        return;
    }

    if (status.available_bonus_key) {
        claimBonusQuarterMaster();
        return;
    }

    log("All quartermaster rewards have been taken.");

    unsafeWindow.claimDaily();
    log("Daily reward claimed.")
}

function claimDailyQuarterMaster() {

    ajax({
        url: "/play/quartermaster_claim_daily",
        success: function (r) {
            quarterMasterDo(r.status);
        }
    });
}

function claimBonusQuarterMaster() {

    ajax({
        url: "/play/quartermaster_claim_bonus",
        success: function (r) {
            quarterMasterDo(r.status);
        }
    });
}

function openBox() {
    if(!options.autoQMaster){
        log("Feature has been disabled.", "QUARTERMASTER");
        return;
    }

    ajax({
        url: "/play/quartermaster_open_chest/?bribes=0&nonce=" + unsafeWindow.userContext.purchase_nonce,
        success: function (r) {
            if(!r.purchase_nonce) {
                error("Could not retrieve a purchase nonce. Process terminated...");
                return;
            }

            unsafeWindow.userContext.purchase_nonce = r.purchase_nonce;

            if(!r.rewards) {
                error("No rewards retrieved. Process terminated...");
                console.debug("Server responded: ", r);
                return;
            }

            //console.debug(r.rewards);

            for(var i = 0; i < r.rewards.length; i++){
                var reward = r.rewards[i];
                //var clientEntry = "Reward claimed: " + reward.item_symbol + ', ' +
                //    'quantity: ' + reward.quantity;

                log({
                    symbol: reward.item_symbol,
                    quantity: reward.quantity
                }, "QMASTER");

                //log(clientEntry, "QUARTERMASTER", true);
            }

            quarterMasterDo();
        }
    });
}

function sendGifts(){
    ajax({
        url: "/play/gifts",
        success: function (r) {
            var bestGift = r.favors.sort(function(a, b){
                return a.description < b.description;
            })[0].symbol;
        }
    });
}

function collectTax() {
    try {

        var itemId = unsafeWindow.buildingBySymbol('counting_house').item_id;
        unsafeWindow.doCollect(itemId);
        log("Silver collected.");

    } catch (err) {
        error(err);
    }
}

// <-- Loops handling

// --> Settings handling
$("#main_toolbar_buttons").on('click', "#extender-menu", showSettings);
function showSettings(e) {
    e.preventDefault();

    try {

        // Clear loading screen if any
        $("#loadingbg:visible").hide();

        // Construct header and place a container for the content
        $("#credits_page").empty().append(templates.optionsHeader).append(templates.tabContent);

        // Construct tabs
        $("#extenderTabMenu").find(".charactertabs")
            .append(templates.optionsTab("logTab", "LOG"))
            .append(templates.optionsTab("mainTab", "MAIN"))
            .append(templates.optionsTab("queueTab", "QUEUE"))
            .append(templates.optionsTab("bruteTab", "BRUTING"))
            .append(options.featureTesting && templates.optionsTab("weTab", "WE"));

        $("#mainTab").trigger('click');

        optionsBottom(); // Construct the bottom of the options window

        $("#credits_roll").show();

    } catch (err) {
        error(err, "show_settings");
    }
}

function optionsBottom() {
    var saveBtn = $("#saveOptions");
    var container = $("#creditsclose");
    if (saveBtn.length == 0 && container.length > 0) {
        container.before(templates.saveOptionsBtn);
    }

    container.attr('onclick', '(function(){ $("#credits_page").empty(); $("#credits_roll").hide(); })()');

    var resetBtn = $("#resetOptions");
    if (resetBtn.length == 0 && container.length > 0) {
        container.after(templates.resetOptionsBtn);
    }
}

$("#credits_roll").on("click", ".inventorytabwrap", tab_onchange);
function tab_onchange(e) {
    e.preventDefault();

    $(".inventorytab.active").removeClass("active");
    $(this).find(".inventorytab").addClass("active");

    var tabContent = $("#extenderTabContent");
    if(!tabContent.length)
    {
        error("Cannot locate tab content!", "tab_onchange")
        return;
    }

    switch (this.id) {
        case "logTab":
            tabContent.html(templates.logTab(options));
            break;
        case "mainTab":
            tabContent.html(templates.mainTab(options));
            break;
        case "queueTab":
            tabContent.html(templates.queueTab(options));
            unsafeWindow.production.render();
            break;
        case "bruteTab":
            getSwornSwords();
            tabContent.html(templates.bruteTab(options));
            break;
        case "weTab":
            tabContent.html(templates.weTab(options));
            break;
        default:
            warn("Not a known tab or in development.");
            break;
    }
}

$("#credits_roll").on('click', "#saveOptions", saveOptions_click);
function saveOptions_click(e) {
    e.preventDefault();

    try {

        if ($("#credits_roll").is(":hidden")) {
            return;
        }

        var tab = $(".inventorytab.active:visible").parents(".inventorytabwrap").attr("id");

        switch (tab) {
            case "mainTab":
                saveMainTab();
                break;
            case "queueTab":
                saveQueueTab();
                break;
            case "bruteTab":
                saveBruteTab();
                break;
            case "weTab":
                saveWeTab();
                break;
            case "logTab":
                saveLogTab();
                break;
            default:
                warn("Not a known tab or in development.");
                return;
        }

        //options.set();
        //inject.constants();
        //unsafeWindow.sort();
        //toggleAll();

        $("#credits_page").empty();
        $("#credits_roll").hide();
        inform("Settings saved.");

    } catch (e) {
        inform(e);
    }
}

function saveLogTab(){
    var $logLevelTimestamp = $("#logLevelTimestamp");
    if($logLevelTimestamp.length){
        options.logLevelTimestamp = $logLevelTimestamp.val();
        options.outputLogAsText = $("#outputLogAsText").hasClass("checked");

        var index = -1;
        if($("#logAdventures").hasClass("checked")){
            if(options.logLevel.indexOf("ADVENTURE") == -1)
                options.logLevel.push("ADVENTURE");
        } else {
            index = options.logLevel.indexOf("ADVENTURE");
            index && options.logLevel.splice(index, 1);
        }

        if($("#logQMaster").hasClass("checked")){
            if(options.logLevel.indexOf("QMASTER") == -1)
                options.logLevel.logLevel.push("QMASTER");
        } else {
            index = options.logLevel.indexOf("QMASTER");
            index && options.logLevel.splice(index, 1);
        }

        if($("#logDaily").hasClass("checked")){
            if(options.logLevel.indexOf("DAILY") == -1)
                options.logLevel.push("DAILY");
        } else {
            index = options.logLevel.indexOf("DAILY");
            index && options.logLevel.splice(index, 1);
        }

        if($("#logFavors").hasClass("checked")){
            if(options.logLevel.indexOf("FAVOR") == -1)
                options.logLevel.push("FAVOR");
        } else {
            index = options.logLevel.indexOf("FAVOR");
            index && options.logLevel.splice(index, 1);
        }

        options.set();
    }
}

function saveWeTab(){
    var wed = parseInt($("#worldEventDelay").text());
    if (!isNaN(wed) && options.worldEventDelay != wed) {
        options.worldEventDelay = wed;
    }

    options.weManagerEnabled = $("#weManagerEnabled").hasClass("checked");
    unsafeWindow.worldEvent.config(options.export(["weManagerEnabled", "worldEventDelay"]));
    unsafeWindow.worldEvent.dispatch();

    options.set();
}

function saveMainTab() {

    var bd = parseInt($("#baseDelay").text());
    if (!isNaN(bd) && options.baseDelay != bd) {
        options.baseDelay = bd;
    }

    options.hideLockedBuildings = $("#toggleLockedBuildings").hasClass("checked");
    //options.useLocalDbOnly = $("#toggleLocalDbOnly").hasClass("checked");

    options.debugMode = $("#toggleDebugModes").hasClass("checked");
    options.doTooltips = $("#toggleTooltips").hasClass("checked");
    options.appendLastSeen = $("#toggleLastSeen").hasClass("checked");
    options.neverSpendGold = $("#neverSpendGold").hasClass("checked");
    options.autoBossChallenge = $("#autoBossChallenge").hasClass("checked");
    options.autoQMaster = $("#autoQMaster").hasClass("checked");
    unsafeWindow.bossChallenger.config(options.export(["autoBossChallenge"]));

    var ari = parseInt($("#autoReloadInterval").val());
    if (!isNaN(ari) && options.autoReloadInterval !== ari) {
        options.autoReloadInterval = ari;
        toggleReloadWindow();
    }

    var aci = parseInt($("#autoCollectInterval").val());
    if (!isNaN(aci) && options.autoCollectInterval !== aci) {
        options.autoCollectInterval = aci;
        toggleAutoCollect();
    }

    options.avaSendSubcamps = $("#avaSendSubcamps").hasClass("checked");

    options.boonsSortBy = $("#boonsSortBy").val();
    options.boonsSortBy2 = $("#boonsSortBy2").val();

    options.shopSortBy = $("#shopSortBy").val();
    options.shopSortBy2 = $("#shopSortBy2").val();

    options.sendAllAction = $("#sendAllAction").val();

    options.defaultBattle = $("#default_battle").val();
    options.defaultTrade = $("#default_trade").val();
    options.defaultIntrigue = $("#default_intrigue").val();

    options.set();
    inject.constants();
    unsafeWindow.sort();
}

function saveQueueTab() {
    if ($("#credits_roll").is(":hidden")) {
        return;
    }

    options.superiorMaterials = $("#toggleSuperiorMaterials").hasClass("checked");
    options.doSpeedUp = $("#toggleDoSpeedUp").hasClass("checked");

    var qd = parseInt($("#queueDelay").text());
    if (!isNaN(qd) && options.queueDelay !== qd) {
        options.queueDelay = qd;
    }

    var qti = parseInt($("#queueTimerInterval").val());
    if (!isNaN(qti) && options.queueTimerInterval !== qti) {
        options.queueTimerInterval = qti;
        toggleQueueTimer();
    }

    unsafeWindow.production.config(options.export(["queueDelay", "superiorMaterials", "doSpeedUp"]));

    options.set();
    inject.constants();
}

function saveBruteTab() {
    if ($("#credits_roll").is(":hidden")) {
        return;
    }

    var bWounds = parseInt($("#bruteWounds").text());
    if (!isNaN(bWounds)) {
        options.bruteWounds = bWounds;
    }

    var bSwitch = $("#bruteSwitchOff").find("a.btngold");
    options.bruteSwitchOff = bSwitch.text() == "switch off";

    var attack = $("#selectedAction").val();
    if(attack) options.selectedAction = attack == "none" ? null : attack;

    options.set();
    inject.constants();
    //unsafeWindow.sort();
}

$("#credits_roll").on('click', "#infoBtn", info_onclick);
function info_onclick() {
    getSwornSwords();
    $("#extenderTabContent").html(templates.ssInfo(options.swornSwords));
}

$("#credits_roll").on('click', "#configLogBtn", config_onclick);
function config_onclick() {
    log("Configure log level.");

    $("#logContent").html(templates.configLog(options));
}

$("#credits_roll").on('click', "#resetOptions", resetOptions_click);
function resetOptions_click(e) {
    e.preventDefault();

    options.reset();
    inject.constants();
    unsafeWindow.sort();
    toggleAll();

    $("#credits_page").empty();
    $("#credits_roll").hide();
    inform("Options reset.");
}
// <-- Settings handling

//--> Brute force adventure
$("#modal_dialogs_top").on("click", "#speedupbtn", viewAdventure_onclick);
function viewAdventure_onclick() {
    log("View adventure details.");

    var vBtn = $(this).find("a.btngold");
    if (!vBtn || vBtn.text() != "View Results!") {
        return;
    }

    setTimeout(function () {

        var btn = $("#bruteBtn");
        var container = $(".challengerewards .challengerewarditems:first");
        if (container.length > 0 && btn.length == 0) {
            container.after(templates.bruteBtn);
        }
    }, (options.baseDelay / 2) * 1000);
}

$("#quests_container").on("click", "span#bruteBtn.btnwrap.btnmed", brute_onclick);
$("#credits_roll").on("click", "span#bruteBtn.btnwrap.btnmed", brute_onclick);
$("#credits_roll").on("click", "span#bruteAllBtn.btnwrap.btnmed", brute_onclick);

function brute_onclick() {
    //    log("Brute!");

    // Save settings first
    saveBruteTab();

    // Find button text
    var b = $(this).find("a.btngold");

    if (!b || b.length == 0) {
        warn("Cannot find brute button!");
    }

    unsafeWindow.brutingImmediateTermination = false;
    b.text("Bruting...");

    if (this.id == "bruteAllBtn") {
        // Brute all sworn swords adventure...
        unsafeWindow.bruteSendAll();
    } else {
        // Else, brute adventure...
        unsafeWindow.bruteForce(true);
    }

}

function getSwornSwords() {

    try {
        var ss = [];
        var pi = unsafeWindow.playerInventory;
        for (var i = 0; i < pi.length; i++) {
            var s = pi[i];
            if (s.slot == "Sworn Sword") {
                ss.push(s);
            }
        }

        if (ss.length > 0) {
            options.swornSwords = ss;
            options.set("swornSwords");
        }
    } catch(err) {
        error('Sworn swords retrieval failed: ' + err);
    }
}
// <-- Brute force adventure

// Do adventures anytime <DEPRECATED>
//$("#modal_dialogs_top").on("click", ".adventurebox .adventuremenu .adventurescroll .adventureitem.locked", lockedAdventure_onclick);
//function lockedAdventure_onclick(e) {
//    log("Trying to unlock adventure.");
//
//    try {
//        e.preventDefault();
//        e.stopPropagation();
//
//        var id = this.id;
//        var aid = id.replace("adventure_", "");
//
//        // console.debug(id, aid);
//
//        unsafeWindow.chooseAdventure(aid);
//    } catch (e) {
//        error(e);
//    }
//
//}

$("#modal_dialogs_top").on('click', ".inventorytabwrap", building_tab_onclick);
function building_tab_onclick(){
    //$("#buildingQueueTab_inner").addClass("active");
    if(this.id == "buildingQueueTab"){
        $("#building_tab_main").hide();
        $("#upgradetab_inner").removeClass("active");
        $("#building_tab_prod").hide();
        $("#productiontab_inner").removeClass("active");
        $("#building_tab_queue").show();
        $("#buildingQueueTab_inner").addClass("active");

        unsafeWindow.production.render(unsafeWindow.userContext.activeBuildingPanel);

    } else if ($("#building_tab_queue").is(":visible")){
        $("#building_tab_queue").hide();
        $("#buildingQueueTab_inner").removeClass("active");
    }

}

$("#building_items").on('click', ".unlocked", upgradetab_changed);
$("#modal_dialogs_top").on('click', ".buildingupgradetree .upgradeicon", upgradetab_changed);
function upgradetab_changed() {
    //    log('Upgrade description changed.');

    if(this.id == "bc_619")
        return;

    var btn = $("#upgradeQueue");
    var container = $("#selected_upgrade");
    if (container.length > 0 && btn.length == 0) {
        container.append(templates.queueUpgradeBtn);

        //if(!$("#exUpgradeContainer").length) {
        //    var html = $(".upgradeinfobg").html();
        //    html = '<div id="exUpgradeContainer" style="height: 250px; overflow-y: scroll;">' + html + '</div>';
        //    $(".upgradeinfobg").html(html);
        //}
    }

    var tab = $("#buildingQueueTab");
    container = $("div#chartabmenu div.charactertabs");
    if (container.length > 0 && tab.length == 0) {
        container.append(templates.buildingQueueTabBtn);
        $("#building_tab_prod").after(templates.buildingTabQueue());
    }
}

$("#modal_dialogs_top").on('click', ".production .productionrow", productiontab_onchange);
function productiontab_onchange() {
    //    log('Production view changed.');

    var btns = $(".production .craftbox .statviewbtm:visible .btnwrap.btnmed.equipbtn.queue:visible");
    var container = $(".production .craftbox .statviewbtm:visible");
    if (container.length > 0 && btns.length == 0) {
        container.prepend(templates.queue5Btn);
        container.prepend(templates.queueBtn);
    }
}

//$("#modals_container").on("click", "#hudchatbtn", warmap_onclick);
$("#modals_container").on("click", ".messagetab", warmap_onclick);
//$("#modals_container").on("click", "div.avaregions a.avaregion", warmap_onclick);

function warmap_onclick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.id !== "messagetab-wars") {
        $("#ex_search_row").remove();
        return;
    }

    setTimeout(function () {

        var row = $("#ex_search_row");
        var container = $("div#alliance_main_content");
        if (container.length > 0 && row.length == 0) {
            container.after(templates.searchAllianceBtn);
        }
    }, (options.baseDelay / 2) * 1000);
}

$("#modal_dialogs_top").on('click', "[onclick*='pvpIncomingAttacks']", inspectIncoming);
function inspectIncoming(e) {
    e.preventDefault();

    ajax({
        method: "GET",
        url: "/play/incoming_attacks",
        success: function (a) {
            try {
                // console.debug(a);
                $('div.perkscroll div.achiev-content').each(function () {
                    var id = /[0-9]+/.exec($(this).find('div.increspond').attr('onclick'));

                    var attack = a.attacks.filter(function (e) {
                        return e.camp_attack_id === null ? e.pvp_id == id : e.camp_attack_id == id;
                    })[0];

                    if (!attack)
                        return;

                    $(this).find("span.charname").attr("onclick", "return characterMainModal(" + attack.attacker.user_id + ")");
                    $(this).find("span.charportrait").attr("onclick", "return characterMainModal(" + attack.attacker.user_id + ")");
                    //$(this).find("span.targetalliancename").attr("onclick", "return allianceInfo(" + attack.alliance_id + ")");

                    if(!options.appendLastSeen)
                        return;

                    var text = 'Last seen: ' + moment(attack.attacker.updated_at,"YYYY-MM-DD HH:mm:ss Z").local().format('MMMM Do YYYY, h:mm:ss a');
                    $(this).append('<div class="ex_attack_timestamp">' + text + '</div>');
                });

                unsafeWindow.$(".scroll-pane:visible").jScrollPane();

            } catch (e) {
                error(e);
            }
        }
    });
}

$("#modal_dialogs_top").on('click', "[onclick*='pvpOutgoingAttacks']", inspectOutgoing);
function inspectOutgoing(e) {
    e.preventDefault();

    ajax({
        method: "GET",
        url: "/play/outgoing_attacks",
        success: function (a) {
            try {
                // console.debug(a);
                $('div.perkscroll div.achiev-content:visible').each(function () {
                    var id = /[0-9]+/.exec($(this).find('div.increspond').attr('onclick'));

                    var attack = a.attacks.filter(function (e) {
                        return e.camp_attack_id === null ? e.pvp_id == id : e.camp_attack_id == id;
                    })[0];

                    if (!attack || !attack.defender)
                        return;

                    $(this).find("span.charname").attr("onclick", "return characterMainModal(" + attack.defender.user_id + ")");
                    $(this).find("span.charportrait").attr("onclick", "return characterMainModal(" + attack.defender.user_id + ")");
                    //$(this).find("span.targetalliancename").attr("onclick", "return allianceInfo(" + attack.alliance_id + ")");

                    if(!options.appendLastSeen)
                        return;

                    var text = 'Last seen: ' + moment(attack.defender.updated_at,"YYYY-MM-DD HH:mm:ss Z").local().format('MMMM Do YYYY, h:mm:ss a');
                    $(this).append('<div class="ex_attack_timestamp">' + text + '</div>');
                });

                unsafeWindow.$(".scroll-pane:visible").jScrollPane();

            } catch (e) {
                error(e);
            }
        }
    });
}
$("#modal_dialogs_top").on('click', "[onclick*='pvpStartWithTarget']", inspectTarget);
$("#modal_dialogs_top").on('click', "[onclick*='pvpTargetSelected']", inspectTarget);
function inspectTarget(e) {
    e.preventDefault();
    //console.debug(e, this, $(this));

    var func = $(this).attr("onclick");
    var id = func.indexOf("pvpTargetSelected") > -1
        ? func.substring(func.indexOf(",") + 1, func.indexOf(")"))
        : func.substring(func.indexOf("(") + 1, func.indexOf(")"));

    if(!id){
        warn("Could not retrieve player id. Exiting...");
        return;
    }

    ajax({
        method: "GET",
        url: "/play/character_pvp/" + id,
        success: function (a) {
            try {
                // console.debug(a);

                var lastUpdated =
                    a.defender.armor ? a.defender.armor.updated_at
                        : a.defender.weapon ? a.defender.weapon.updated_at
                        : a.defender.companion ? a.defender.companion.updated_at
                        : null;

                if (!lastUpdated) {
                    warn("Could not establish when was the user last seen.");
                    return;
                }

                var $h2 = $(".infobar:visible:first").find("h2");
                if($h2.length){
                    $h2.css("padding-left", "140px");
                    $h2.html('Last seen: ' + moment(lastUpdated, "YYYY-MM-DD HH:mm:ss Z").local().format('MMMM Do YYYY, h:mm:ss a'));
                }

            } catch (e) {
                error(e);
            }
        }
    });
}
$("#modals_container").on("click", "[onclick*='campActivity']", campactivity_onclick);
function campactivity_onclick(){
    log("Camp activity requested.");

    var oncl = $(this).attr("onclick");

    var startIdx = oncl.indexOf('campActivity(') + 13;
    var endIdx = oncl.lastIndexOf(');');

    var params = oncl.substring(startIdx, endIdx).split(',');
    var campId = params[0];
    var category = params[1];   // 1 - provisions, // 2 - action, // 3 - garrison
    if(!campId || !category){
        error("Failed resolving camp id and category.", "CAMP");
        return;
    }

    //console.debug("Parameters resolved, camp id: ", campId, " category: ", category);
    switch(category){
        case '2':
            analyzeActions(campId);
            break;
        case '1':
        case '3':
        default:
            log("No actions implemented for this category.");
            return;
    }
}

function analyzeActions(camp){
    ajax({
        url: "/play/camp_messages/" + camp + "?category=2",
        success: function(a) {
            var contents = $(".achiev-box.action-battle .achiev-content:visible");
            if(contents.length !== a.length){
                warn("Wrong response format.", "CAMP");
                return;
            }

            var i = 0;
            contents.each(function(){
                var initiator = $(this).find(".activityinitiator h3 span");
                var target = $(this).find(".activitytarget h3 span");

                if(initiator.length){
                    initiator.attr("onclick", "return allianceInfo(" + a[i].camp_attack.alliance_id + ")");
                    initiator.before('<span onclick="return characterMainModal(' + a[i].user_id + ')">' + a[i].name + '</span>');

                    // Assign dirrect assault link to their camp
                    $(this).find(".activityinitiatorcamp h3 span").attr("onclick", "campChoseTarget(" + a[i].camp_attack.region + ", " + a[i].camp_attack.subregion + ", " + a[i].camp_attack.alliance_id + ")" );

                } else if (target.length) {
                    target.attr("onclick", "return allianceInfo(" + a[i].camp_attack.target_alliance_id + ")");
                    //target.before('<span onclick="return characterMainModal(' + a[i].user_id + ')">' + a[i].name + '</span>');

                    // Assign dirrect assault link to their camp
                    $(this).find(".activitytargetcamp h3 span").attr("onclick", "campChoseTarget(" + a[i].camp_attack.region + ", " + a[i].camp_attack.subregion + ", " + a[i].camp_attack.target_alliance_id + ")" );
                }

                i++;
            });

        }
    })
}

$("#modals_container").on("click", "#ex_alliance_search", searchAlliance_onclick);
function searchAlliance_onclick(e) {
    e.preventDefault();
    unsafeWindow.showSpinner();

    window.setTimeout(function () {

        var keys = $("#ex_alliance_search_input").val();
        if (!keys || keys.length == 0) {
            return;
        }

        var keysArray = keys.split(" ");
        var c = keysArray[0];
        for (var i = 1; i < keysArray.length; i++) {
            c += "+" +
            keysArray[i];
        }

        //console.debug("Sending data: ", c);

        GM_xmlhttpRequest({
            method: "GET",
            url: "/play/alliance_search/?tags=0&name=" + c,
            onload: function (a) {
                unsafeWindow.hideSpinner();

                if (a.error) {
                    var e = "Something went awry with your search. Please try again.";
                    "query-error" == e.error && (e = "Alliance Search by name requires more than 3 characters.");
                    unsafeWindow.doAlert("Alliance Search Error!", e);
                } else {
                    //console.debug("Raw response: ", a);
                    var response = JSON.parse(a.responseText);
                    //console.debug("Response text parsed: ", response);
                    displayResults(response.alliances);
                }
            }
        });

    }, (options.baseDelay / 2) * 1000);
}

function displayResults(a) {
    console.debug("Alliances to be displayed: ", a);

    $("#ex_alliance_search_input").val("");

    if (!(a instanceof Array) || a.length == 0) {
        $("#ex_alliance_search_input").attr("placeholder", "No alliances found");
        return;
    }

    // Clean table
    $(".avaranking:visible:first tr:not(:first)").empty();

    // Fill table
    var l = a.length > 4 ? 4 : a.length;
    for (var i = 0; i < l; i++) {
        $(".avaranking:visible:first tr:first").after(templates.allianceRow(a[i], unsafeWindow.userContext.activeRegion));
    }

}

$("#modal_dialogs_top").on('click', "[onclick*='chooseAdventure']", adventureItem_onclick);
function adventureItem_onclick() {
    //log("Adventures display.");

    setTimeout(function () {

        var btn = $("#adventureSendAll");
        var container = $("div.infobar span#backbtn.btnwrap.btnsm:visible");
        if (container.length > 0 && btn.length == 0) {
            container.after(templates.sendAllBtn);
        }
    }, (options.baseDelay / 2) * 1000);
}

$("#modals_container").on('click', "[onclick*='pvpTargetSelected']", pvpStart_onclick);
$("#modals_container").on('click', "[onclick*='pvpStartWithTarget']", pvpStart_onclick);
function pvpStart_onclick() {
    //log('Displaying pvp dialog with a target specified.');

    setTimeout(function () {

        var btn = $("#pvpSendAll");
        var container = $("div.infobar span#backbtn.btnwrap.btnsm:visible");
        if (container.length > 0 && btn.length == 0) {
            container.after(templates.pvpSendAllBtn);
        }
    }, (options.baseDelay / 2) * 1000);
}

$(document).on('click', "[onclick*='campChoseTarget']", avaStart_onclick);
function avaStart_onclick() {
    log('Displaying ava dialog with a target specified.');

    setTimeout(function () {

        var btn = $("#avaSendAll");
        var container = $("div.infobar span#backbtn.btnwrap.btnsm:visible");
        if (container.length > 0 && btn.length == 0) {
            container.after(templates.avaSendAllBtn);
        }
    }, (options.baseDelay / 2) * 1000);
}

$('#modal_dialogs').on('click', '#shop_offer_btn', function(e){
    log('Displaying offer code dialog.');

    console.debug(options.lastIdChecked)
    setTimeout(function () {

        var btn = $("#find_gifts");
        var container = $("div#modals_container_alerts div.alertcontents div.alertbox div.alertboxinner div.alertinput");
        if (container.length > 0 && btn.length == 0) {
            container.after(templates.findGifts(options.lastIdChecked, 100));
        }
    }, (options.baseDelay / 2) * 1000);
});

function checkSource() {
    console.log("-------------------------------------\\");
    console.log("Script scheduled for update check.");
    console.log("-------------------------------------/");

    var lastUpdateCheck = GM_SuperValue.get("lastUpdateCheck", "never");
    console.log("Function definitions updated: " + lastUpdateCheck);
    console.log("Source control check for integrity initiated...");
    var updateRequired = false;

    eval(GM_getResourceText("original"));
    if (typeof original == "undefined") {
        error("Cannot find original function data.");
        return;
    }

    try {

        for (var fn in original) {
            console.log("Current function: " + fn);

            if (!original.hasOwnProperty(fn)) {
                console.error("Function does not have a stored value!");
                continue;
            }

            console.log("Retrieving page function...");

            if (!unsafeWindow[fn]) {
                console.error("No such function on page!");
                continue;
            }

            var pageFn = unsafeWindow[fn].toString();
            console.log("Function retrieved. Comparing...");

            if (pageFn !== original[fn]) {
                console.warn("Changes detected! Please revise: " + fn);

                updateRequired = true;
                continue;
            }

            console.log("No changes were detected. Continuing...");
        }
    } catch (e) {
        alert("Source control encountered an error: " + e);
        return;
    }

    console.log("-------------------------------------|");
    console.log("-------------------------------------| > End of script update check");

    if (!updateRequired) {
        GM_SuperValue.set("lastUpdateCheck", new Date());
    }

    alert("Source control resolved that " +
    (updateRequired ? "an update is required." : "no changes are necessary.") +
    "\nSee the console log for details.\nPress OK to reload again.");
}

// jQuery ajax
function ajax(params) {
    if (typeof params != "object") {
        error("The request requires object with parameters.");
        return;
    }

    // Required
    if (!params.url) {
        error("Request url was not passed.");
        return;
    }

    // Required
    if (!params.onload && !params.success) {
        error("Callback handler missing. Cannot execute.");
        return;
    }

    if (!params.type) {
        params.type = "GET";
    }

    if (!params.timeout) {
        params.timeout = 3E4;
    }

    if (!params.onerror) {
        params.onerror = function (gme) {
            error("Error occurred while running the request. Details:");
            console.debug("Original ajax request parameters: ", params);
            console.debug("GM_XmlHttpRequest error response: ", gme);
        }
    }

    if (!params.onload) {
        params.onload = function (gmr) {

            var response;
            if (!gmr.response) {
                params.error ? params.error(gmr) : params.onerror(gmr);
            } else {
                //var headerString = gmr.responseHeaders;
                //var headers = headerString.split('\n');

                //console.debug("Debugging response headers: ", headers);
                if (gmr.responseHeaders.indexOf("Content-Type: application/json;") > -1) {
                    response = JSON.parse(gmr.responseText);
                    params.success(response);
                } else {
                    params.success(gmr.responseText);
                }
            }

            if (params.complete)
                params.complete(response);
        };
    }

    if (!params.ontimeout) {
        params.ontimeout = function (gmt) {
            warn("The request timed out. Details:");
            console.debug("Original ajax request parameters: ", params);
            console.debug("Grease monkey error response: ", gmt);
        };
    }

    window.setTimeout(function () {
        GM_xmlhttpRequest({
            //binary: false,
            //context: {},
            //data: "",
            //headers: {},
            method: params.type,
            //onabort: params.onabort,
            onerror: params.onerror,
            onload: params.onload,
            //onprogress: params.onprogress,
            //onreadystatechange: params.onreadystatechange,
            ontimeout: params.ontimeout,
            //overrideMimeType: "",
            //password: "",
            //synchronous: false,
            timeout: params.timeout,
            //upload: {},
            url: params.url
            //user: ""
        });
    }, 1E3);
}

$("div#page-wrap").on('click', 'a#navlink-buildings', function(){
    log("Navigated to buildings sub-menu.");
    if(options.hideLockedBuildings){
        $(".locked").hide();
    } else {
        $(".locked:hidden").show();
    }
});