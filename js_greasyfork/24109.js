var MYLINGUAL = {
    
    VERSION: "0.7.1",
    UID: "kazuho-japanize2@labs.cybozu.co.jp",
    
    getPromptService: function () {
        return Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
            .getService(Components.interfaces.nsIPromptService);
    },
    
    notifyUser: function (message) {
        this.getPromptService().alert(
            window, this._s('prompt.title'), message);
    },
    
    getLang: function () {
        return this.getPreference('lang', this._s('defaults.lang'));
    },
    
    setLang: function (l) {
        this.setPreference('lang', l);
    },
    
    getStoreBaseDir: function () {
        try {
            var profileDir =
                Components.classes["@mozilla.org/file/directory_service;1"]
                .getService(Components.interfaces.nsIProperties)
                .get("ProfD", Components.interfaces.nsILocalFile);
            // return the extension directory
            var dir = profileDir.clone();
            dir.append("extensions");
            if (dir.exists() && dir.isDirectory()) {
               dir.append(this.UID);
               if (dir.exists() && dir.isDirectory()) {
                   dir.append("data");
                   return dir;
               }
            }
            // if failed, create our own directory below profile dir
            dir = profileDir.clone();
            dir.append("mylingual"); // only used by developers
            if (! dir.exists()) {
                dir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0755);
            }
            return dir;
        } catch (e) {
            alert("Japanize: " + e.toString());
        }
    },
    
    getStoreDir: function () {
        try {
            var dir = this.getStoreBaseDir();
            dir.append(this.getLang());
            if (! dir.exists()) {
                dir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0755);
            }
            return dir;
        } catch (e) {
            alert("Mylingual: " + e.toString());
        }
    },
    
    saveToStore: function (file, text) {
        text = "\ufeff" + text.toString();
        
        var conv =
            Components.classes["@mozilla.org/intl/scriptableunicodeconverter"]
            .getService(Components.interfaces.nsIScriptableUnicodeConverter);
        conv.charset = "UTF-8";
        
        var temppath = this.getStoreDir();
        temppath.append("t" + Math.floor(Math.random() * 10000000) + ".tmp");
        
        var os = Components.classes["@mozilla.org/network/file-output-stream;1"]
            .createInstance(Components.interfaces.nsIFileOutputStream);
        os.init(temppath, 0x2a, 0644, -1);
        for (var offset = 0; offset < text.length; offset += 1024) {
            var data =
                String.fromCharCode.apply(
                    null,
                    conv.convertToByteArray(
                        text.substring(offset, offset + 1024),
                        new Number(0)));
            os.write(data, data.length);
        }
        os.close();
        
        try {
            temppath.moveTo(this.getStoreDir(), file);
        } catch (e) {
            try {
                temppath.remove(false);
            } catch (e2) {
            }
            throw e;
        }
    },
    
    getStoreURI: function (file) {
        var path = this.getStoreDir();
        path.append(file);
        return Components.classes["@mozilla.org/network/io-service;1"]
            .getService(Components.interfaces.nsIIOService)
            .newFileURI(path);
    },
    
    getPreferenceService: function () {
        return Components.classes["@mozilla.org/preferences-service;1"]
            .getService(Components.interfaces.nsIPrefService)
                .getBranch("");
    },

    getPreference: function (name, defaultValue) {
        var value = null;
        try {
            value =
                this.getPreferenceService().getCharPref(
                    "extensions.japanize." + name);
        } catch (e) {
        }         
        if (value == null) {
            value = defaultValue;
        }
        return value;
    },
    
    setPreference: function (name, value) {
        this.getPreferenceService().setCharPref(
            "extensions.japanize." + name, value.toString());
    },
    
    debugAlert: function () {
        if (! this.getPreference('debug', '')) {
            return;
        }
        alert.apply(null, arguments);
    },
    
    PREF_UPDATEMODE: "updatemode",
    UPDATEMODE_PERIODICALLY: "periodically",
    UPDATEMODE_EVERYTIME: "everytime",
    
    getUpdateMode: function () {
        return this.getPreference(
            this.PREF_UPDATEMODE, this.UPDATEMODE_PERIODICALLY);
    },
    
    setUpdateMode: function (newMode) {
        this.setPreference(this.PREF_UPDATEMODE, newMode);
    },
    
    getBaseURL: function () {
        return this.getPreference("baseURL", "http://japanize.mylingual.net/");
    },
    
    normalizeHost: function (host) {
        return host.toString().toLowerCase().replace(/^www\./, "");
    },
    
    buildTranslationURL: function (host) {
        var url =
            this.getBaseURL() + "data/" + this.normalizeHost(host)
            + "/current.txt";
        return url;
    },
    
    loadLocalizationData: function (doc) {
        doc.__MYLINGUAL_DONE = true;
        var browser = this.findBrowser(doc);
        if (! this.getMode()) {
            this.updateStatus(browser, "");
            return;
        }
        if (doc.location.protocol != "http:") {
            this.updateStatus(browser, "");
            return;
        }
        if (this.getUpdateMode() == this.UPDATEMODE_PERIODICALLY
            && typeof this.localTranslationTable != "undefined") {
            if (this.localTranslationTable["$builddate"]
                == this.getPreference("$builddate", -1)) {
                setTimeout(
                    function () {
                        MYLINGUAL.localizeWithLocalData(doc, browser);
                    },
                    1);
                return;
            }
            this.localTranslationTable = undefined;
        }
        if (this.getUpdateMode() == this.UPDATEMODE_EVERYTIME) {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open(
                    "get",
                    this.buildTranslationURL(doc.location.host),
                    true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        MYLINGUAL.localizeWithData(
                            MYLINGUAL.parseJSON(xhr.responseText),
                            doc,
                            browser);
                    }
                };
                xhr.send(null);
            } catch (e) {
                alert("Japanize: " + e.toString());
            }
        } else {
            try {
                var xhr = new XMLHttpRequest();
                xhr.open(
                    "get",
                    this.getStoreURI("all.txt").spec,
                    true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var json = MYLINGUAL.parseJSON(xhr.responseText);
                        MYLINGUAL.localTranslationTable = json;
                        MYLINGUAL.localizeWithLocalData(doc, browser);
                    }
                };
                xhr.send(null);
            } catch (e) {
                alert("Japanize: " + e.toString());
            }
        }
    },
    
    localizeWithLocalData: function (doc, browser) {
        var table;
        if (typeof this.localTranslationTable == 'object') {
            table = this.localTranslationTable[
                MYLINGUAL.normalizeHost(doc.location.host)];
            if (typeof table == 'undefined'
                && doc.location.host.match(/^[^\.]*\./)) {
                table = this.localTranslationTable['*.' + RegExp.rightContext];
            }
        }
        this.localizeWithData(table, doc, browser);
    },
    
    canTranslateHost: function (host) {
        var list = this.getPreference("hosts", "").split(",");
        if (list.length == 0) {
            return true;
        }
        for (var i = 0; i < list.length; i++) {
            var flag = list[i].charAt(0);
            var pat = MYLINGUAL._gsub(
                list[i].substring(1),
                /[^A-Za-z0-9\-]/g,
                function (m) {
                    return m == '*' ? '.*' : '\\' + m;
                });
            pat = new RegExp(pat);
            if (typeof pat != 'undefined' && host.match(new RegExp(pat))) {
                if (flag == '-') {
                    return false;
                } else if (flag == '+') {
                    return true;
                }
            }
        }
        return true;
    },
    
    localizeWithData: function (json, doc, browser) {
        this.updateStatus(browser, "");
        // do nothing unless translation is available
        if (typeof json != "object") {
            return;
        }
        // check preferences
        if (! this.canTranslateHost(doc.location.host)) {
            this.updateStatus(browser, this._s('status.original'));
            return;
        }
        // convert json to internal representation
        var mappings = {
            text: {},
            re: []
        };
        this.initCommandMappings(mappings);
        for (var n in json) {
            if (n.charAt(0) == '$') {
                this.compileCommand(mappings, n, json[n]);
            } else if (n.match(/^\/(\^.*\$)\/$/)) {
                var v = json[n];
                try {
                    n = new RegExp(RegExp.$1);
                } catch (e) {
                    this.debugAlert(
                        this._f('mylingual.error.recompile', [ n ]));
                    continue;
                }
                mappings.re.push([ n, v ]);
            } else {
                mappings.text[n] = json[n];
            }
        }
        this.postProcessCommandMappings(mappings);
        // check url patterns
        if (this.ifSkipURL(mappings, doc.location)) {
            this.updateStatus(browser, this._s('status.bannedpage'));
            return;
        }
        // setup logger
        var log = ! ! this.getPreference("log", "");
        if (log && typeof FireBug == 'undefined' && ! this.noFireBugAlert) {
            alert("Japanize: Install FireBug to view translation logs.");
            this.noFireBugAlert = true;
            log = false;
        }
        if (log) {
            log = function (s) {
                FireBug.console.log(s);
            };
            log.log = true;
        } else {
            log = function () {
            };
            log.log = false;
        }
        // convert
        log("Japanize: translating: " + doc.location);
        this.localizeElement(doc.body, mappings, true);
        this.updateStatus(browser, this._s('status.translated'));
        
        // build handler for handilng DHTML modifs.
        var handler = function (evt) {
            if (handler.underOperation) {
                return;
            }
            if (log.log) {
                var msg = (function (t) {
                    if (t.id) {
                        return "id='" + t.id + "'";
                    } else if (t.className) {
                        return "class='" + t.className + "'";
                    } else if (t.parentNode) {
                        return arguments.callee(t.parentNode);
                    } else if (t.nodeType == 9) {
                        return "no identifier at root";
                    } else {
                        return "not within document";
                    }
                }).call(null, evt.target);
                msg += (function (t) {
                    while (typeof t == 'object' && t.nodeType != 9) {
                        t = t.parentNode;
                    }
                    if (! t) {
                        return '';
                    }
                    return ", " + t.location;
                }).call(null, evt.target);
                log("Japanize: " + msg);
            }
            setTimeout(
                function () {
                    handler.underOperation = true;
                    MYLINGUAL.localizeElement(
                        evt.target,
                        mappings,
                        MYLINGUAL.getElementTranslationMode(
                            mappings, doc.body, evt.target.parentNode));
                    handler.underOperation = false;
                },
                1);
        };
        if (doc.addEventListener
            && ! (navigator.userAgent.toString().match(/\sAppleWebKit\/([0-9]+)/i) && RegExp.$1 < 522)) {
            doc.addEventListener("DOMNodeInserted", handler, false);
            doc.addEventListener("DOMCharacterDataModified", handler, false);
            doc.addEventListener(
                "DOMAttrModified",
                function (evt) {
                    if (evt.attrName == 'style') {
                        var iframes = evt.target.getElementsByTagName('iframe');
                        for (var i = 0; i < iframes.length; i++) {
                            var doc = iframes[i].contentDocument;
                            if (! doc.__MYLINGUAL_DONE) {
                                MYLINGUAL.loadLocalizationData(doc);
                            }
                        }
                    } else if (evt.target.tagName == 'INPUT'
                        || evt.target.tagName == 'OPTION') {
                        handler(evt);
                    }
                },
                false);
        }
    },
    
    translateText: function (orig, mappings) {
        // direct match
        if (typeof mappings.text[orig] != 'undefined') {
            return mappings.text[orig];
        }
        // match (while taking care of surrounding spaces)
        if (orig.match(/^([ \r\n\t\xa0]*)(.+?)([ \r\n\t\xa0]*)$/)
            && (RegExp.$1 != '' || RegExp.$3 != '')) {
            if (typeof mappings.text[RegExp.$2] != 'undefined') {
                return RegExp.$1 + mappings.text[RegExp.$2] + RegExp.$3;
            }
        }
        // regexp
        for (var i = 0; i < mappings.re.length; i++) {
            var m = null;
            if (m = orig.match(mappings.re[i][0])) {
                return this._gsub(
                    mappings.re[i][1],
                    /\$(R?)([1-9])/g,
                    function (_dummy, rerun, digit) {
                        var t = m[digit - 0];
                        if (rerun) {
                            var t2 =
                                MYLINGUAL.translateText(t, mappings);
                            if (t2 != null) {
                                t = t2;
                            }
                        }
                        return t;
                    });
            }
        }
        return null;
    },
    
    // patch required for safari
    _gsub: function (str, re, func) {
        return str.replace(re, func);
    },
    
    initCommandMappings: function (mappings) {
        var f0 = function () {
            return {
                 re: [],
                 reCaseless: [],
                 text: {}
            }
        };
        var f1 = function () {
            return {
                'class': f0(),
                id:      f0(),
                path:    f0(),
                tag:     f0(),
                url:     f0()
            };
        };
        mappings.skip = f1();
        mappings.translate = f1();
    },
    
    postProcessCommandMappings: function (mappings) {
        var f0 = function (t, n, f) {
            t[n] = t[n].length != 0 ? new RegExp(t[n].join('|'), f) : undefined;
        };
        var f1 = function (t) {
            f0(t, 're', '');
            f0(t, 'reCaseless', 'i');
        };
        var f2 = function (t) {
            f1(t['class']);
            f1(t.id);
            f1(t.path);
            f1(t.tag);
            f1(t.url);
        };
        f2(mappings.skip);
        f2(mappings.translate);
    },
    
    compileCommand: function (mappings, name, value) {
        if (! name.match(/^\$(.*?)\(\s*(~{0,2})\s*(.*)\s*\)$/)) {
            return;
        }
        var type = RegExp.$1;
        var re = RegExp.$2 ? RegExp.$2.length : 0;
        var match = RegExp.$3;
        var store = mappings
            [value[0] == 'skip' || value[0] == '' ? 'skip' : 'translate']
            [type];
        if (typeof store != 'object') {
            return;
        }
        if (re) {
            if (! new RegExp(match, re == 2 ? 'i' : '')) {
                this.debugAlert('Syntax error: ' + name);
                return;
            }
            store[re == 2 ? 'reCaseless' : 're'].push(match);
        } else {
            if (type == 'tag') {
                match = match.toUpperCase();
            }
            store.text[match] = 1;
        }
    },
    
    ifSkipURL: function (mappings, loc) {
        return this.translateOrSkip(mappings.skip.path, loc.pathname)
            || this.translateOrSkip(mappings.skip.url, loc.toString());
    },
    
    translateOrSkipElement: function (mappings, e, current) {
        var table = mappings[current ? 'skip' : 'translate'];
        if (this.translateOrSkip(table.tag, e.tagName)
            || e.className && this.translateOrSkip(table['class'], e.className)
            || e.id && this.translateOrSkip(table.id, e.id)) {
            return ! current;
        }
        return current;
    },
    
    translateOrSkip: function (table, value) {
        value = value.toString();
        return typeof table.text[value] != 'undefined'
            || (table.re && value.match(table.re))
            || (table.reCaseless && value.match(table.reCaseless));
    },
    
    getElementTranslationMode: function (mappings, body, element) {
        var path = [];
        for (var p = (element.nodeType == 1 ? element : element.parentNode);
             p != body;
             p = p.parentNode) {
           path.push(p);
        }
        var translate = true;
        while (path.length != 0) {
            translate =
                this.translateOrSkipElement(mappings, path.pop(), translate);
        }
        return translate;
    },
    
    localizeElement: function (node, mappings, translate) {
        if (node.nodeType == 1) {
            translate = this.translateOrSkipElement(mappings, node, translate);
            if (node.nodeName == "SCRIPT" || node.nodeName == "STYLE") {
                // nothing to do
                return;
            } else if (node.nodeName == "INPUT") {
                if (! translate) {
                    return;
                }
                if (node.type == "button" || node.type == "reset") {
                    var translated = this.translateText(node.value, mappings);
                    if (translated != null) {
                        node.value = translated;
                    }
                }
                return;
            } else if (node.nodeName == "OPTION") {
                if (! translate) {
                    return;
                }
                var translated = this.translateText(node.text, mappings);
                if (translated != null) {
                    node.value = node.value.toString();
                    node.text = translated;
                }
                return;
            }
            var children = node.childNodes;
            for (var i = 0; i < children.length; i++) {
                this.localizeElement(children.item(i), mappings, translate);
            }
        } else if (translate && node.nodeType == 3) {
            var translated =
                this.translateText(node.nodeValue, mappings);
            if (translated != null) {
                node.nodeValue = translated;
            }
        }
    },
    
    parseJSON: function (text) {
        var json = undefined;
        try {
            var s = Components.utils.Sandbox(
                "http://sandbox.japanize.31tools.com/");
            Components.utils.evalInSandbox("json = " + text, s);
            json = s.json;
        } catch (e) {
            this.debugAlert(e);
        }
        return json;
    },
    
    findBrowser: function (doc) {
        var tb = getBrowser();
        for (var i = 0; i < tb.browsers.length; ++i) {
            var b = tb.getBrowserAtIndex(i);
            if (b.contentDocument == doc) {
                return b;
            }
        }
        return null;
    },
    
    updateStatus: function (browser, text) {
        if (browser == null) return;
        browser.contentDocument.JAPANIZED_status = text;
        this.redrawStatus();
    },
    
    redrawStatus: function () {
        var status =
            getBrowser().selectedBrowser.contentDocument.JAPANIZED_status;
        if (typeof status == "undefined") {
             status = "";
        }
        var label = document.getElementById("japanize-status-label");
        if (status == "") {
            label.style.display = "none";
        } else {
            label.value = status;
            label.style.display = "inline";
        }
    },
    
    getMode: function () {
        var img = document.getElementById("japanize-status-icon");
        return ! ! img.src.toString().match(/icon_on(_message)?\.gif$/);
    },
    
    setMode: function (on) {
        // setup icon
        var s = on ? "on" : "off";
        var img = document.getElementById("japanize-status-icon");
        img.src = img.src.toString().replace(/icon_o(n|ff)/, "icon_" + s);
        document.getElementById("japanize-status-main").value =
            this._s('tooltip.is' + s);
    },
    
    getMenuItem: function (suffix) {
        return document.getElementById("japanize-popup-" + suffix);
    },
    
    getBundle: function () {
        return document.getElementById("japanize-bundle");
    },
    
    _s: function (n) {
        try {
            return this.getBundle().getString('mylingual.' + n);
        } catch (e) {
            this.debugAlert(
                "Could not find string resource: " + n + "\n\n" + e.toString());
        }
    },
    
    _f: function (n, a) {
        return this.getBundle().getFormattedString('mylingual.' + n, a);
    },
    
    showPopup: function (evt) {
        this.getMenuItem("enabled").setAttribute(
            "checked", this.getMode().toString());
        if (this.getUpdateMode() == this.UPDATEMODE_EVERYTIME) {
            this.getMenuItem("updateeverytime").setAttribute(
                "checked", "true");
            this.getMenuItem("updateperiodically").setAttribute(
                "checked", "false");
            this.getMenuItem("updatenow").setAttribute(
                "disabled", "true");
        } else {
            this.getMenuItem("updateeverytime").setAttribute(
                "checked", "false");
            this.getMenuItem("updateperiodically").setAttribute(
                "checked", "true");
            this.getMenuItem("updatenow").setAttribute(
                "disabled", "false");
        }
    },
    
    handlePopup: function (evt) {
        if (! evt.target.id.toString().match(/^japanize-popup-/)) {
            return;
        }
        var cmd = RegExp.rightContext;
        if (cmd == "enabled") {
            this.setMode(! this.getMode());
        } else if (cmd == "updateeverytime") {
            this.setUpdateMode(this.UPDATEMODE_EVERYTIME);
        } else if (cmd == "updateperiodically") {
            this.setUpdateMode(this.UPDATEMODE_PERIODICALLY);
            if (this.needsUpdate()) {
                if (this.getPromptService().confirm(
                        window,
                        this._s('prompt.title'),
                        this._s('prompt.recommendupdate'))) {
                    this.downloadAllTable(true);
                }
            }
        } else if (cmd == "updatenow") {
            this.downloadAllTable(true);
        }
    },
    
    saveAllTable: function (content, buildDate, retryCount, notifyUser) {
        try {
            this.saveToStore("all.txt", content);
            this.setPreference("$builddate", buildDate);
            if (notifyUser) {
                this.notifyUser(this._s('prompt.defupdated'));
            }
        } catch (e) {
            if (retryCount == 0) {
                this.notifyUser(
                    this._s('prompt.defsavefailed')
                    + "\n\n" + e.toString());
            } else {
                setTimeout(
                    function () {
                        MYLINGUAL.saveAllTable(
                            content, buildDate, retryCount - 1, notifyUser);
                    },
                    100);
            }
        }
    },
    
    onAllTableDownload: function (xhr, notifyUser) {
        var json = this.parseJSON(xhr.responseText);
        if (typeof json != "object") {
            if (notifyUser) {
                this.notifyUser(this._s('prompt.defdownloadfailed'));
            }
            return;
        }
        if (json["$builddate"] == this.getPreference("$builddate", -1)) {
            if (notifyUser) {
                this.notifyUser(this._s('prompt.defnochanges'));
            }
            return;
        }
        this.saveAllTable(xhr.responseText, json["$builddate"], 10, notifyUser);
    },
    
    downloadAllTable: function (notifyUser) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open(
                "get",
                this.getBaseURL() + "alldata/all.txt",
                true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    MYLINGUAL.onAllTableDownload(xhr, notifyUser);
                }
            };
            xhr.send(null);
        } catch (e) {
            alert("Japanize : " + e.toString());
        }
    },
    
    needsUpdate: function () {
        // every 3 hours by default
        var interval = this.getPreference("updateinterval", 3 * 3600) * 1000;
        var lastUpdateAt = this.getPreference("lastupdateat", 0) * 1;
        if (new Date().getTime() < lastUpdateAt + interval) {
            return false;
        }
        return true;
    },
    
    periodicalTasks: function () {
        if (! this.needsUpdate()) {
            return;
        }
        this.setPreference("lastupdateat", new Date().getTime());
        
        // update alltable if in periodical mode
        if (this.getUpdateMode() == this.UPDATEMODE_PERIODICALLY) {
            this.downloadAllTable(false);
        }
    }
};

// hacks for opera
MYLINGUAL.updateStatus = function (_dummy1, text) {
    if (text) {
        var t = document.createElement('div');
        t.id = '__mylingual_status';
        (function (o) {
            for (var i in o) {
                t.style[i] = o[i];
            }
        })({
            border: '1px solid #666',
            background: '#f88',
            padding: '0.3em',
            color: 'black',
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            position: window.innerWidth ? 'fixed' : 'absolute',
            left: '10px',
            bottom: '10px',
            zIndex: 100
        });
        document.body.appendChild(t);
        t.innerHTML = 'Japanize: ' + text;
        window.setTimeout(
            function () {
                t.parentNode.removeChild(t);
            },
            3000);
    }
};

MYLINGUAL._s = function (n) {
    return {
        'status.translated': '翻訳完了',
        'status.bannedpage': '翻訳しないページ'
    }[n];
};
MYLINGUAL._f = function () {};
MYLINGUAL.localizeOpera = function (json) {
    if (typeof json != 'object') return;
    this.localizeWithData(json, document, {});
};

// flickr uses customized String.prototype.replace
if ("0a1".replace(/[a-z]/g, function (m) { return "A"; }) != "0A1") {
    MYLINGUAL._gsub = function (str, re, func) {
        var out = "";
        var match;
        var start = re.lastIndex = 0;
        while (match = re.exec(str)) {
            out += str.slice(start, match.index);
            out += func.apply(null, match).toString();
            start = re.lastIndex;
        }
        out += str.substring(start);
        return out;
    };
}

(function () {
    var elem = document.createElement('script');
    elem.src =
        'http://japanize.31tools.com/data_jsonp/'
        + location.host
        + '?jsonp=MYLINGUAL.localizeOpera';
    document.body.appendChild(elem);
})();
