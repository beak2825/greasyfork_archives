/*
 *      GM Common API is a library for userscripts. A "Synchronious API" compatible
 *      with both Greasemonkey 4 WebExtension and all the other commonly used
 *      userscript managers. Using GM Common API can be a fast and easy way to add
 *      Greasemonkey 4 WebExtension compatibility to (some) existing userscripts.
 *
 *      https://greasyfork.org/scripts/34527-gmcommonapi-js
 *      https://github.com/StigNygaard/GMCommonAPI.js
 */


var GMC = GMC || (function api() {

    // CHANGELOG - The most important updates/versions:
    let changelog = [
        {version: '2017.12.16', description: 'GM4 actually supports GM.openInTab.'},
        {version: '2017.12.07', description: 'Fixing an error seen in Chrome/Tampermonkey.'},
        {version: '2017.12.06', description: 'Prefetch @resource objects in GM4+ for potential performance improvements (Requires @grant GM.getResourceUrl).'},
        {version: '2017.12.03', description: 'Some refactoring. Fix: getResourceUrl would sometimes only return one resource in GM4.'},
        {version: '2017.11.18', description: 'Adding GMC.xmlHttpRequest().'},
        {version: '2017.11.11', description: 'Advanced options for menus (Via GMC.registerMenuCommand() using new options parameter).'},
        {version: '2017.10.29', description: 'Adding GMC.listValues(), GMC.listLocalStorageValues() and GMC.listSessionStorageValues().'},
        {version: '2017.10.28', description: '@grant not needed for use of GM.info/GM_info.'},
        {version: '2017.10.25', description: 'Initial release.'}
    ];


    /*
     *  GMC.info
     *
     *  Maps to GM_info or GM.info object.
     *  Grants: none needed.
     */
    let info = (GM_info ? GM_info : (typeof GM === 'object' && GM !== null && typeof GM.info === 'object' ? GM.info : null) );


    /*
     *  GMC.registerMenuCommand(caption, commandFunc, accessKey)
     *  GMC.registerMenuCommand(caption, commandFunc, options)
     *
     *  Currently the GM4 API is missing GM.registerMenuCommand, but luckily Firefox supports HTML5
     *  context menus, which are created by this method when supported (Currently only supported by
     *  the Firefox family). AccessKey is currently ignored for context menus.
     *  Instead of the accessKey string parameter, there's an option to pass an options object
     *  adding multiple configuration options for fine-tuning menus. Example:
     *    GMC.registerMenuCommand( 'Hide the top', toggleTop , {accessKey: 'T', type: 'checkbox', checked: isHiddenTop()} );
     *  Currently supported properties in the options object are:
     *    accessKey, topLevel, id, name, type, checked, disabled & icon.
     *  Todo: Document the properties in the options object.
     *
     *  Grants:
     *  GM_registerMenuCommand
     *  GM.registerMenuCommand (Optional for possible future support. Currently not available with any userscript manager)
     */
    function registerMenuCommand(caption, commandFunc, options) {
        if (typeof options === 'string') {
            options = {'accessKey': options};
        } else if (typeof options === 'undefined') {
            options = {};
        }
        // "Legacy" menu:
        if (!options['disabled']) {
            let prefix = '';
            if (options['type'] === 'radio') {
                prefix = options['checked'] ? '\u26AB ' : '\u26AA '; // ⚫/⚪
            } else if (options['type'] === 'checkbox') {
                prefix = options['checked'] ? '\u2B1B ' : '\u2B1C '; // ⬛/⬜
            }
            if (typeof GM_registerMenuCommand === 'function') {
                // Supported by most userscript managers, but NOT with Greasemonkey 4 WebExtension
                GM_registerMenuCommand(prefix + caption, commandFunc, options['accessKey']);
            } else if (typeof GM === 'object' && GM !== null && typeof GM.registerMenuCommand === 'function') {
                // NOT implemented in Greasemonkey 4.0 WebExtension, but if later?...
                GM.registerMenuCommand(prefix + caption, commandFunc, options['accessKey']);
            }
        }
        // HTML5 context menu (currently only supported by the Firefox family):
        if (contextMenuSupported()) {
            if (!document.body) {
                alert('GMC Error: Body element for context menu not found. If running userscript at "document-start" you might need to delay initialization of menus.');
                return;
            }
            let topMenu = null;
            if (document.body.getAttribute('contextmenu')) {
                // If existing context menu on body, don't replace but use/extend it...
                topMenu = document.querySelector('menu#' + document.body.getAttribute('contextmenu'));
            }
            if (!topMenu) {
                // if not already defined, create the "top menu container"
                topMenu = document.createElement('menu');
                topMenu.setAttribute('type', 'context');
                topMenu.setAttribute('id', 'gm-registered-menu');
                document.body.appendChild(topMenu);
                document.body.setAttribute('contextmenu', topMenu.getAttribute('id'));
            }
            // Create menu item
            let menuItem = document.createElement('menuitem');
            menuItem.setAttribute('type', options['type'] ? options['type'] : 'command'); // command, checkbox or radio
            menuItem.setAttribute('label', caption);
            if (options['id']) menuItem.setAttribute('id', options['id']);
            if (options['name']) menuItem.setAttribute('name', options['name']);
            if (options['checked']) menuItem.setAttribute('checked', 'checked');
            if (options['disabled']) menuItem.setAttribute('disabled', 'disabled');
            if (options['icon']) menuItem.setAttribute('icon', options['icon']); // does icon work on radio/checkbox or only command?
            // Append menuitem
            if (options['topLevel']) {
                topMenu.appendChild(menuItem);
            } else { // script menu
                let scriptMenu = topMenu.querySelector('menu[label="' + getScriptName() + '"]');
                if (!scriptMenu) {
                    // if not already defined, create a "sub-menu" for current userscript
                    scriptMenu = document.createElement('menu');
                    scriptMenu.setAttribute('label', getScriptName());
                    // icon = @icon from metadata??? NO, icon not working for menu elements :-(
                    topMenu.appendChild(scriptMenu);
                }
                scriptMenu.appendChild(menuItem);
            }
            menuItem.addEventListener('click', commandFunc, false);
        }
    }


    /*
     *  GMC.getResourceURL(resourceName)
     *  GMC.getResourceUrl(resourceName)
     *
     *  This will use GM_getResourceURL if available, and otherwise try to find an url directly via
     *  the GMC.info object properties.
     *  Grants:
     *  GM_getResourceURL
     *  GM.getResourceUrl (Optional, but add this for potential performance improvement in GM4+)
     */
    function getResourceUrl(resourceName) {
        if (typeof GM_getResourceURL === 'function') {
            return GM_getResourceURL(resourceName);
        } else if (info) {
            if (typeof info.script === 'object' && typeof info.script.resources === 'object' && typeof info.script.resources[resourceName] === 'object' && info.script.resources[resourceName].url) {
                return info.script.resources[resourceName].url;
            } else if (info.scriptMetaStr) {
                // Parse metadata block to find the original "remote url" instead:
                let ptrn = new RegExp('^\\s*\\/\\/\\s*@resource\\s+([^\\s]+)\\s+([^\\s]+)\\s*$','igm');
                let result;
                while((result = ptrn.exec(info.scriptMetaStr)) !== null) {
                    if (result[1] === resourceName) return result[2];
                    // and do a GM4 "prefetch"?
                }
            }
            alert('GMC Error: Cannot find url of resource=' + resourceName + ' in GMC.info object');
        } else {
            alert('GMC Error: Cannot lookup resourceURL (Missing @grant for GM_getResourceURL?)');
        }
    }


    /*
     *  GMC.setValue(name, value)
     *
     *  When supported, this points to GM_setValue which stores values in a userscript specific
     *  database. Otherwise the HTML5 Web Storage is used, which is a domain(+protocol) specific
     *  database in the browser.
     *  IMPORTANT: If your userscript is a "single-domain type", the difference in storage type is
     *  probably not a problem, but for "multiple-domain userscripts" GMC.setValue() might not be a
     *  satisfying solution.
     *  To prevent mistakenly overwriting or reading other clientscript's values when using Web
     *  Storage, a prefix based on userscript namespace and scriptname is added to name used in Web
     *  Storage.
     *  Grants:
     *  GM_setValue
     */
    function setValue(name, value) {
        if (typeof GM_setValue === 'function') {
            GM_setValue(name, value);
        } else {
            setLocalStorageValue(name, value);
        }
    }


    /*
     *  GMC.getValue(name, defvalue)
     *
     *  Get the values stored using GMC.setValue(). When supported via GM_getValue and otherwise from
     *  HTML5 Web Storage.
     *  Grants:
     *  GM_getValue
     */
    function getValue(name, defvalue) { // getLocalStorageValue: function(name, defvalue) {
        if (typeof GM_getValue === 'function') {
            return GM_getValue(name, defvalue);
        } else {
            return getLocalStorageValue(name, defvalue);
        }
    }


    /*
     *  GMC.deleteValue(name)
     *
     *  Deletes a value stored using GMC.setValue(). When supported via GM_deleteValue and otherwise
     *  from HTML5 Web Storage.
     *  Grants:
     *  GM_deleteValue
     */
    function deleteValue(name) {
        if (typeof GM_deleteValue === 'function') {
            GM_deleteValue(name);
        } else {
            deleteLocalStorageValue(name);
        }
    }


    /*
     *  GMC.listValues()
     *
     *  Returns the values (key-names) stored using GMC.setValue(). When supported via GM_listValues
     *  and otherwise from HTML5 Web Storage.
     *  Grants:
     *  GM_listValues
     */
    function listValues() {
        if (typeof GM_listValues === 'function') {
            return GM_listValues();
        } else {
            return listLocalStorageValues();
        }
    }


    /*
     *  GMC.setLocalStorageValue(name, value)
     *
     *  Save value in HTML5 Web Storage (window.localStorage), which is a domain(+protocol) specific
     *  database in the browser. To prevent mistakenly overwriting or reading other clientscript's
     *  values when using Web Storage, a prefix based on userscript namespace and scriptname is added
     *  to the name used in Web Storage.
     *  Grants: none needed.
     */
    function setLocalStorageValue(name, value) {
        localStorage.setItem(getScriptIdentifier() + '_' + name, value);
    }


    /*
     *  GMC.getLocalStorageValue(name, defvalue)
     *
     *  Get a value that was stored using GMC.setLocalStorageValue().
     *  Grants: none needed.
     */
    function getLocalStorageValue(name, defvalue) {
        if ((getScriptIdentifier()+'_'+name) in localStorage) {
            return localStorage.getItem(getScriptIdentifier()+'_'+name);
        } else {
            return defvalue;
        }
    }


    /*
     *  GMC.deleteLocalStorageValue(name)
     *
     *  Deletes a value that was stored using GMC.setLocalStorageValue().
     *  Grants: none needed.
     */
    function deleteLocalStorageValue(name) {
        localStorage.removeItem(getScriptIdentifier() + '_' + name);
    }


    /*
     *  GMC.listLocalStorageValues()
     *
     *  Returns the values (key-names) stored using GMC.setLocalStorageValue().
     *  Grants: none needed.
     */
    function listLocalStorageValues() {
        let values = [];
        let prefix = getScriptIdentifier();
        let prelen = getScriptIdentifier().length;
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i).substr(0, prelen) === prefix) {
                values.push(localStorage.key(i).substr(prelen+1));
            }
        }
        return values;
    }


    /*
     *  GMC.setSessionStorageValue(name, value)
     *
     *  Similar to setLocalStorageValue(), but setSessionStorageValue() only stores for the current
     *  session.
     *  Grants: none needed.
     */
    function setSessionStorageValue(name, value) {
        sessionStorage.setItem(getScriptIdentifier() + '_' + name, value);
    }


    /*
     *  GMC.getSessionStorageValue(name, defvalue)
     *
     *  Get a value that was stored using GMC.setSessionStorageValue().
     *  Grants: none needed.
     */
    function getSessionStorageValue(name, defvalue) {
        if ((getScriptIdentifier()+'_'+name) in localStorage) {
            return sessionStorage.getItem(getScriptIdentifier()+'_'+name);
        } else {
            return defvalue;
        }
    }


    /*
     *  GMC.deleteSessionStorageValue(name)
     *
     *  Deletes a value that was stored using GMC.setSessionStorageValue().
     *  Grants: none needed.
     */
    function deleteSessionStorageValue(name) {
        sessionStorage.removeItem(getScriptIdentifier() + '_' + name);
    }


    /*
     *  GMC.listSessionStorageValues()
     *
     *  Returns the values (key-names) stored using GMC.setSessionStorageValue().
     *  Grants: none needed.
     */
    function listSessionStorageValues() {
        let values = [];
        let prefix = getScriptIdentifier();
        let prelen = getScriptIdentifier().length;
        for (let i = 0; i < sessionStorage.length; i++) {
            if (sessionStorage.key(i).substr(0, prelen) === prefix) {
                values.push(sessionStorage.key(i).substr(prelen+1));
            }
        }
        return values;
    }


    /*
     *  GMC.log(message)
     *
     *  Writes a log-line to the console. It will use GM_log if supported/granted, otherwise
     *  it will do it using window.console.log().
     *  Grants:
     *  GM_log
     */
    function log(message) {
        if(typeof GM_log === 'function') {
            GM_log(message);
        } else if (window.console) {
            if (info) {
                window.console.log(getScriptName() + ' : ' + message);
            } else {
                window.console.log('GMC : ' + message);
            }
        }
    }


    /*
     *  GMC.setClipboard(text)
     *
     *  Sets content of the clipboard by using either GM.setClipboard or GM_setClipboard.
     *  Grants:
     *  GM.setClipboard
     *  GM_setClipboard
     */
    let setClipboard = (typeof GM_setClipboard === 'function' ? GM_setClipboard : (typeof GM === 'object' && GM !== null && typeof GM.setClipboard === 'function' ? GM.setClipboard : null) );


    /*
     *  GMC.addStyle(style)
     *
     *  Adds style in a an element in html header.
     *  Grants:
     *  GM_addStyle (Optional. Will be used when available, but this method should normally work fine without)
     *  GM.addStyle (Optional for possible future support. Currently not available with any userscript manager)
     */
    function addStyle(style) {
        if (typeof GM_addStyle === 'function') {
            return GM_addStyle(style);
        } else if (typeof GM === 'object' && GM !== null && typeof GM.addStyle === 'function') {
            return GM.addStyle(style); // For possible future support. Will Probably return undefined.
        } else {
            let head = document.getElementsByTagName('head')[0];
            if (head) {
                let styleElem = document.createElement('style');
                styleElem.setAttribute('type', 'text/css');
                styleElem.textContent = style;
                head.appendChild(styleElem);
                return styleElem;
            }
            alert('GMC Error: Unable to add style element to head element. If running userscript at "document-start" you might need to delay initialization of styles.');
        }
    }


    /*
     *  GMC.openInTab(url, open_in_background)
     *
     *  Opens url in a new tab.
     *  Grants:
     *  GM.openInTab
     *  GM_openInTab
     */
    function openInTab(url, open_in_background) {
        if (typeof GM_openInTab === 'function') {
            return GM_openInTab(url, open_in_background);
        } else if (typeof GM === 'object' && GM !== null && typeof GM.openInTab === 'function') {
            return GM.openInTab(url, open_in_background);
        }
        return window.open(url);
    }


    /*
     *  GMC.xmlHttpRequest(details)
     *  GMC.xmlhttpRequest(details)
     *
     *  Forwards to either GM_xmlhttpRequest or GM.xmlHttpRequest.
     *  When adding @grant declarations, make sure to take notice of the case differences between
     *  the APIs. GMC supports both case-variants (GMC.xmlHttpRequest and GMC.xmlhttpRequest).
     *  Also remember to add needed @connect declarations for Tampermonkey:
     *  https://tampermonkey.net/documentation.php#_connect
     *
     *  Grants:
     *  GM.xmlHttpRequest
     *  GM_xmlhttpRequest
     */
    function xmlHttpRequest(details) {
        if (typeof GM_xmlhttpRequest === 'function') {
            return GM_xmlhttpRequest(details);
        } else if (typeof GM === 'object' && GM !== null && typeof GM.xmlHttpRequest === 'function') {
            return GM.xmlHttpRequest(details); // probably undefined return value!
        }
        alert('GMC Error: xmlHttpRequest not found! Missing or misspelled @grant declaration? (Be aware of case differences in the APIs!)');
    }


    /*
     *  GMC.getScriptName()
     *
     *  Simply returns script name as defined in meta data. If no name was defined, returns "Userscript".
     *  Grants: none needed.
     */
    function getScriptName() {
        if (typeof info.script.name === 'string' && info.script.name.trim().length > 0) {
            return info.script.name.trim();
        } else {
            return 'Userscript';
        }
    }


    /*
     *  GMC.getScriptNamespace()
     *
     *  Simply returns the script's namespace as defined in meta data.
     *  Grants: none needed.
     */
    function getScriptNamespace() {
        if (typeof info.script.namespace === 'string') {
            return info.script.namespace.trim();
        } else {
            return '';
        }
    }



    // Internal, temporary and experimental stuff:

    function isGreasemonkey4up() {
        if (typeof info.scriptHandler === 'string' && typeof info.version === 'string') {
            return info.scriptHandler === 'Greasemonkey' && parseInt(info.version,10)>=4;
        }
        return false;
    }
    function contextMenuSupported() { // Argh, it's a bit ugly, not 100% accurate (and probably not really necessary)
        let oMenu = document.createElement('menu');
        return (oMenu.type !== 'undefined'); // type="list|context|toolbar" if supported ?
    }
    function getScriptIdentifier() { // A "safe" identifier without any special characters (but doesn't work well for non-latin :-/ )
        if (info && typeof info.script === 'object') {
            return 'gmc' + getScriptNamespace().replace(/[^\w]+/g,'x') + getScriptName().replace(/[^\w]+/g,'x');
        } else {
            alert('GMC Error: Script Namespace or Name not found.');
        }
    }
    function inspect(obj) { // for some debugging
        let output='';
        Object.keys(obj).forEach(function(key, idx) {
            output+=key+': ' + typeof obj[key] + ((typeof obj[key] === 'string' || typeof obj[key] === 'boolean' || typeof obj[key] === 'number') ? ' = ' + obj[key] : '') + '\n';
        });
        alert(output);
    }

    if (typeof GM === 'object' && GM !== null && typeof GM.getResourceUrl === 'function' && typeof info === 'object' && typeof info.script === 'object' && typeof info.script.resources === 'object' ) {
        // Prefetch @resource objects and update info.script.resources[resourcename].url with local address, using GM.getResourceUrl().
        prefetchResource = function(name) {
            if (typeof info === 'object' && typeof info.script === 'object' && typeof info.script.resources === 'object') {
                let obj = info.script.resources[name];
                if (typeof GM === 'object' && GM !== null && typeof GM.getResourceUrl === 'function' && obj) {
                    GM.getResourceUrl(obj.name).then(function (url) {
                        obj.url = url;
                    }, function (err) {
                        log('Error fetching resource ' + obj.name + ': ' + err);
                    });
                } else {
                    log('Error, info.script.resources[' + name + '] not found in resources object.');
                }
            }
        };
        Object.keys(info.script.resources).forEach(function(key, idx) {
            prefetchResource(key);
        });
    }

    return {
        info: info,
        registerMenuCommand: registerMenuCommand,
        getResourceUrl: getResourceUrl,
        getResourceURL: getResourceUrl,
        setValue: setValue,
        getValue: getValue,
        deleteValue: deleteValue,
        listValues: listValues,
        setLocalStorageValue: setLocalStorageValue,
        getLocalStorageValue: getLocalStorageValue,
        deleteLocalStorageValue: deleteLocalStorageValue,
        listLocalStorageValues: listLocalStorageValues,
        setSessionStorageValue: setSessionStorageValue,
        getSessionStorageValue: getSessionStorageValue,
        deleteSessionStorageValue: deleteSessionStorageValue,
        listSessionStorageValues: listSessionStorageValues,
        log: log,
        setClipboard: setClipboard,
        addStyle: addStyle,
        openInTab: openInTab,
        xmlHttpRequest: xmlHttpRequest,
        xmlhttpRequest: xmlHttpRequest,
        getScriptName: getScriptName,
        getScriptNamespace: getScriptNamespace,

        // Temporary and experimental stuff:
        isGreasemonkey4up: isGreasemonkey4up,
        contextMenuSupported: contextMenuSupported,
        inspect: inspect
    };

})();
