// ==UserScript==
// @name Force Full Editor
// @description Forces WYSIWYG editors to always use the full editor if possible
// @author qsniyg
// @version 0.2
// @namespace Violentmonkey Scripts
// @include *
// @grant none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/379395/Force%20Full%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/379395/Force%20Full%20Editor.meta.js
// ==/UserScript==

(function() {
    var ck;
    Object.defineProperty(window, "CKEDITOR", {
        get: function() {
            if (ck && ck.replace && !ck.replace.injected) {
                var oldreplace = ck.replace;
                oldreplace.injected = true;
                ck.replace = function() {
                    if (arguments.length >= 2) {
                        if (typeof arguments[1] === "object") {
                            delete arguments[1]["toolbarGroups"];
                            delete arguments[1]["toolbar"];
                            delete arguments[1]["removeButtons"];
                        }
                    }
                    return oldreplace.apply(this, arguments);
                };
            }
            return ck;
        },
        set: function(x) {
            ck = x;
        }
    });
    var jq = null;
    Object.defineProperty(window, "jQuery", {
        get: function() {
            return jq;
        },
        set: function(x) {
            jq = x;
            if (jq && jq.fn) {
                var kendo;
                Object.defineProperty(jq.fn, "kendoEditor", {
                    get: function() {
                        if (kendo) {
                            var oldkendo = kendo;
                            kendo = function() {
                                if (arguments.length >= 1 && typeof arguments[0] === "object") {
                                    if (!arguments[0].tools) {
                                        arguments[0].tools = [];
                                    }
                                    
                                    var tools = [
                                        "bold", "italic", "underline", "strikethrough", "subscript", "superscript",
                                        "fontName", "fontSize", "foreColor", "backColor",
                                        "justifyLeft", "justifyCenter", "justifyRight", "justifyFull",
                                        "insertUnorderedList", "insertOrderedList", "indent", "outdent",
                                        "createLink", "unlink", "insertImage", "insertFile",
                                        "tableWizard", "createTable", "addColumnLeft", "addColumnRight", "addRowAbove", "addRowBelow", "deleteRow", "deleteColumn",
                                        "formatting", "cleanFormatting",
                                        "insertHtml", "viewHtml",
                                        "print", "pdf"
                                    ];
                                    
                                    for (var i = 0; i < tools.length; i++) {
                                        var tool = tools[i];
                                        
                                        var in_array = false;
                                        for (var j = 0; j < arguments[0].tools.length; j++) {
                                            var atool = arguments[0].tools[j];
                                            if (typeof atool === "string") {
                                                if (atool === tool) {
                                                    in_array = true;
                                                    break;
                                                }
                                            } else {
                                                if (atool.name === tool) {
                                                    in_array = true;
                                                    break;
                                                }
                                            }
                                        }
                                        
                                        if (in_array)
                                            continue;
                                        
                                        arguments[0].tools.push(tool);
                                    }
                                }
                                return oldkendo.apply(this, arguments);
                            }
                        }
                        return kendo;
                    },
                    set: function(x) {
                        kendo = x;
                    }
                })
            }
        }
    });
})();