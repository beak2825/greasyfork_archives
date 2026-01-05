// ==UserScript==
// @name         dmhy tree view
// @namespace    https://greasyfork.org/zh-CN/scripts/26430-dmhy-tree-view
// @license      GPL version 3
// @encoding     utf-8
// @version      0.35
// @date         2017/01/11
// @modified     2020/12/20
// @description  convert plain file list into a tree view for 动漫花园 (share.dmhy.org)
// @author       TautCony
// @require      http://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @require      http://cdn.bootcss.com/jstree/3.3.11/jstree.min.js
// @resource     customCSS http://cdn.bootcss.com/jstree/3.3.11/themes/default/style.min.css
// @match        *://share.dmhy.org/topics/view/*
// @match        *://dmhy.anoneko.com/topics/view/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/26430/dmhy%20tree%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/26430/dmhy%20tree%20view.meta.js
// ==/UserScript==
var iconOrigin = location.origin;
var icons = {
    audio: iconOrigin + "/images/icon/mp3.gif",
    bmp: iconOrigin + "/images/icon/bmp.gif",
    image: iconOrigin + "/images/icon/jpg.gif",
    png: iconOrigin + "/images/icon/png.gif",
    rar: iconOrigin + "/images/icon/rar.gif",
    text: iconOrigin + "/images/icon/txt.gif",
    unknown: iconOrigin + "/images/icon/unknown.gif",
    video: iconOrigin + "/images/icon/mp4.gif",
};
var type2Icon = {
    audio: ["flac", "aac", "wav", "mp3"],
    bmp: ["bmp"],
    image: ["jpg", "jpeg", "webp"],
    png: ["png"],
    rar: ["rar", "zip", "7z"],
    text: ["txt", "log", "cue", "ass"],
    video: ["mkv", "mka", "mp4"],
};
var Dictionary = /** @class */ (function () {
    function Dictionary() {
        this.data = {};
    }
    Dictionary.prototype.add = function (key, value) {
        if (!(key in this.data)) {
            this.data[key] = value;
        }
    };
    Dictionary.prototype.clear = function () {
        this.data = {};
    };
    Dictionary.prototype.containsKey = function (key) {
        return key in this.data;
    };
    Dictionary.prototype.get = function (key) {
        return this.data[key];
    };
    Dictionary.prototype.size = function () {
        return Object.keys(this.data).length;
    };
    Dictionary.prototype.values = function () {
        return this.data;
    };
    return Dictionary;
}());
var FileSize = /** @class */ (function () {
    function FileSize() {
    }
    FileSize.toLength = function (size) {
        if (size === undefined) {
            return -1;
        }
        var head = "";
        var tail = "";
        var isNumber = function (c) { return (c >= "0" && c <= "9") || c === "." || c === "-"; };
        for (var _i = 0, _a = size.toLowerCase(); _i < _a.length; _i++) {
            var c = _a[_i];
            if (isNumber(c)) {
                head += c;
            }
            else {
                tail += c;
            }
        }
        var value = parseFloat(head);
        switch (tail) {
            case "byte": return value * Math.pow(2, 0);
            case "bytes": return value * Math.pow(2, 0);
            case "kb": return value * Math.pow(2, 10);
            case "mb": return value * Math.pow(2, 20);
            case "gb": return value * Math.pow(2, 30);
            case "tb": return value * Math.pow(2, 40);
        }
        return -1;
    };
    FileSize.toSize = function (length) {
        if (length >= Math.pow(2, 40)) {
            return this.format(length, 40, "TiB");
        }
        else if (length >= Math.pow(2, 30)) {
            return this.format(length, 30, "GiB");
        }
        else if (length >= Math.pow(2, 20)) {
            return this.format(length, 20, "MiB");
        }
        else if (length >= Math.pow(2, 10)) {
            return this.format(length, 10, "KiB");
        }
        else {
            return this.format(length, 0, "Bytes", 0);
        }
    };
    FileSize.format = function (length, factor, tail, digits) {
        if (digits === undefined) {
            digits = 3;
        }
        return (length / Math.pow(2, factor)).toFixed(digits).toString() + tail;
    };
    return FileSize;
}());
var TreeNode = /** @class */ (function () {
    function TreeNode(node) {
        this._ext = undefined;
        this._icon = undefined;
        this.name = node;
        this.length = 0;
        this.childNode = new Dictionary();
    }
    TreeNode.prototype.insert = function (path, size) {
        var currentNode = this;
        for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
            var node = path_1[_i];
            var next = currentNode.childNode.get(node);
            if (!currentNode.childNode.containsKey(node)) {
                next = currentNode.add(node, new TreeNode(node));
                next.pareneNode = currentNode;
            }
            currentNode = next;
        }
        currentNode.length = FileSize.toLength(size);
        return currentNode;
    };
    TreeNode.prototype.toString = function () {
        return "<span class=\"filename\">" + this.name + "</span><span class=\"filesize\">" + FileSize.toSize(this.length) + "</span>";
    };
    TreeNode.prototype.toObject = function () {
        var ret = {
            children: [],
            length: 0,
            state: {
                opened: true,
            },
            text: this.toString(),
        };
        var childNodeValues = this.childNode.values();
        for (var key in childNodeValues) {
            if (!childNodeValues.hasOwnProperty(key)) {
                continue;
            }
            var files = [];
            var value = this.childNode.get(key);
            if (value.childNode.size() === 0) {
                files.push(value);
            }
            else {
                var inner = value.toObject();
                value.length = inner.length = inner.children.reduce(function (aac, val) { return aac + val.length; }, 0);
                inner.text = value.toString(); //update text with size info
                inner.state.opened = false;
                ret.children.push(inner);
            }
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                ret.length += file.length;
                ret.children.push({
                    icon: file.icon,
                    length: file.length,
                    text: file.toString(),
                });
            }
        }
        return ret;
    };
    TreeNode.prototype.add = function (key, value) {
        this.childNode.add(key, value);
        return this.childNode.get(key);
    };
    Object.defineProperty(TreeNode.prototype, "ext", {
        get: function () {
            if (this._ext !== undefined) {
                return this._ext;
            }
            this._ext = "";
            var dotIndex = this.name.lastIndexOf(".");
            if (dotIndex > 0) {
                this._ext = this.name.substr(dotIndex + 1).toLowerCase();
            }
            return this._ext;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "icon", {
        get: function () {
            if (this._icon !== undefined) {
                return this._icon;
            }
            this._icon = icons.unknown;
            for (var type in type2Icon) {
                if (type2Icon[type].indexOf(this.ext) >= 0) {
                    this._icon = icons[type];
                    break;
                }
            }
            return this._icon;
        },
        enumerable: false,
        configurable: true
    });
    return TreeNode;
}());
var GM_getResourceText = GM_getResourceText;
var GM_addStyle = GM_addStyle;
var copyToClipboard = function (text) {
    if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy"); // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
};
var setupCSS = function () {
    if (typeof GM_getResourceText !== "undefined") {
        GM_addStyle(GM_getResourceText("customCSS"));
        $("head").append("<style>.jstree-node,.jstree-default .jstree-icon{background-image:url(http://cdn.bootcss.com/jstree/3.3.3/themes/default/32px.png);}.filesize{padding-left:1em;color:grey;}</style>");
        $(".file_list").css("width", "100%");
        $(".file_list").css("max-height", "600px");
    }
    else {
        console.info("%cTo load style sheet and let script works correctly, http://tampermonkey.net/ is required.", "color:#e55d67;font-size:1.3em");
    }
};
var setupOpe = function () {
    $("#tabs-1").append('<input type="text" style="width:240px;margin:0;padding:6px 12px;border-radius:4px;border:1px solid silver;font-size:1.1em;" id="search_input" placeholder="Search" />');
    $("#tabs-1").append('<button id="switch" style="border:0;border-radius:2px;padding:8px;margin-left:10px;">Expand All</button>');
    $("#tabs-1").append('<input id="hidden_text" style="display:none;"/>');
};
(function () {
    setupCSS();
    setupOpe();
    var data = new TreeNode($(".topic-title > h3").text());
    var pattern = /^(.+?) (\d+(?:\.\d+)?[TGMK]?B(?:ytes)?)$/;
    $(".file_list:first > ul li").each(function (index, value) {
        var text = $(value).text().trim();
        var line = text.replace(/\t+/i, "\t").split("\t");
        switch (line.length) {
            case 2:
                var nodes = line[0].split("/");
                var size = line[1];
                data.insert(nodes, size);
                break;
            case 1:
                var ret = pattern.exec(text);
                if (ret === null) {
                    //the text should be "More Than 1000 Files"
                    data.insert(line[0].split("/"), "");
                }
                else {
                    data.insert(ret[1].split("/"), ret[2]);
                }
                break;
            default:
                console.log("Unexpected length in \"" + line + "\"");
        }
    });
    var getSelectedRow = function (reference) { return $.jstree.reference(reference).get_node(reference, true); };
    var options = {
        contextmenu: {
            items: {
                getText: {
                    action: function (selected) { return copyToClipboard(selected.reference.find(".filename").text()); },
                    label: "Copy",
                },
                remove: {
                    action: function (selected) { return getSelectedRow(selected.reference).remove(); },
                    label: "Delete",
                },
            },
            show_at_node: false,
        },
        core: {
            data: data.toObject(),
        },
        plugins: ["search", "wholerow", "contextmenu"],
    };
    $($(".file_list:first").jstree(options)).bind("loaded.jstree", function (loadedEventData) {
        var isExpended = false;
        $("#switch").click(function (clickEventData) {
            if (isExpended) {
                clickEventData.target.innerHTML = "Expand All";
                $(loadedEventData.target).jstree("close_all");
            }
            else {
                clickEventData.target.innerHTML = "Toggle All";
                $(loadedEventData.target).jstree("open_all");
            }
            isExpended = !isExpended;
        });
        var lastVal = "";
        $("#search_input").keyup(function (keyupEventData) {
            var val = keyupEventData.target.value;
            if (val !== lastVal) {
                $(loadedEventData.target).jstree(true).search(val);
                lastVal = val;
            }
        });
    });
})();
