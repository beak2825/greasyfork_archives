// ==UserScript==
// @name         Syntactic Sugar Script Tools
// @namespace    synsugarscripttools
// @version      1.1
// @description  Adds additional content to Syntactic Sugar script documents
// @author       Samuel Harbord
// @match        https://docs.google.com/document/d/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396579/Syntactic%20Sugar%20Script%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/396579/Syntactic%20Sugar%20Script%20Tools.meta.js
// ==/UserScript==

var checkSynSugarTimer;
var checkNumPagesTimer;
var numPages = 0;
var numPagesConfirmCount = 0;
var charExp = {};
var charLines = {};
var charAllExp = {};
var pageUpdateDocTimers = {};
var docMutationObserver;
const mutationObserverConfig = { childList: true, subtree: true };
const debug = true;

(function() {
    window.googleDocCallback = function () { return true; };
    addDependencies();
    checkSynSugarTimer = window.setTimeout(checkSynSugar, 500);
})();

function addDependencies() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/js/jquery.nice-select.min.js';
    document.getElementsByTagName('head')[0].appendChild(script);
    var link = document.createElement('link');
    link.rel='stylesheet';
    link.href='https://cdnjs.cloudflare.com/ajax/libs/jquery-nice-select/1.1.0/css/nice-select.min.css';
    var style = document.createElement('style');
    style.type='text/css';
    style.innerHTML = '@font-face { font-family: Lunchtype; src: url(https://syntacticsugar.moe/Resources/Cabin-Regular.ttf); } .ss-exp { line-height: 30px; height: 30px; background-color: rgb(26, 115, 232); border-color: white; } .ss-exp:after { border-color: white; } .ss-exp > .current { color: white; }';
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
    head.appendChild(style);
}

function checkSynSugar() {
    var $docTitle = $(".docs-title-input-label");
    if ($docTitle.length > 0) {
        if (/Syn(?:tactic )?Sugar/i.test($docTitle.text())) {
            checkNumPagesTimer = window.setInterval(checkNumPages, 1000)
        }
        clearInterval(checkSynSugarTimer);
    }
}

function checkNumPages() {
    var $pages = $(".kix-page-content-wrapper");
    var curNumPages = $pages.length;
    if (curNumPages > 0) {
        if (curNumPages > numPages) {
            numPages = curNumPages;
            numPagesConfirmCount = 0;
        } else if (++numPagesConfirmCount == 3) {
            init();
            clearInterval(checkNumPagesTimer);
        }
    }
}

function init() {
    var maxScroll = (numPages - 1) * 1066;
    var $editor = $(".kix-appview-editor");
    $editor.scrollTop(0);
    var scrollTop = 0;
    var pageLoadTimer = window.setInterval(function() {
        $editor.scrollTop((scrollTop = (scrollTop + 1066)));
        if (scrollTop > maxScroll) {
            $editor.scrollTop(0);
            clearInterval(pageLoadTimer);
            addContainer();
            $(".kix-page-paginated").css("overflow", "visible");
            //$(".kix-wordhtmlgenerator-word-node:nth-child(2):contains(|)").css("display", "none");
            addCharLines();
            getAllCharExp(function() {
                docMutationObserver = new MutationObserver(onMutateDoc);
                docMutationObserver.observe($(".kix-paginateddocumentplugin")[0], mutationObserverConfig);
                onUpdateDoc();
            });
        }
    }, 100);
}

function onMutateDoc(mutationsList, observer) {
    var updatedPageIndexes = [];
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            if (!mutation.target.className && (mutation.addedNodes || mutation.removedNodes)) {
                var pageIndex = $(mutation.target).parents(".kix-page-paginated").index();
                if (updatedPageIndexes.indexOf(pageIndex) === -1) {
                    updatedPageIndexes.push(pageIndex);
                    if (Object.keys(pageUpdateDocTimers).indexOf(pageIndex + "") > -1) {
                        clearTimeout(pageUpdateDocTimers[pageIndex]);
                    }
                    pageUpdateDocTimers[pageIndex] = (function(pageIndex_) {
                        return setTimeout(function() {
                            docMutationObserver.disconnect();
                            onUpdateDoc(pageIndex_);
                            docMutationObserver.observe($(".kix-paginateddocumentplugin")[0], mutationObserverConfig);
                        }, 1500);
                    })(pageIndex);
                }
            }/* else if (mutation.target.className === 'kix-lineview') {
                 $(mutation.target).find(".kix-wordhtmlgenerator-word-node").each(function() {
                     if ($(this).text().startsWith("|"))
                         $(this).css("display", "none");
                 });
            }*/
        }
    }
}

function onUpdateDoc(pageIndex) {
    $((pageIndex ? ".kix-page-paginated:nth(" + pageIndex + ") " : "") + ".ss-exp").remove();
    updateTextBounds(pageIndex);
    updateParagraphIndexes();
    addCharLines();
    addExp(pageIndex);
}

function addCharLines() {
    charLines = {};
    $(".kix-lineview").each(function() {
        var text = $(this).children(".kix-lineview-content").text().replace(new RegExp("\u200c", 'g'), "").trim();
        if (/^[a-z0-9 ]+(?:\|[^:]+)?:/i.test(text) && $(this).find(".kix-lineview-decorations").length == 0) {
            var colonIndex = text.indexOf(":");
            var vertBarIndex = text.indexOf("|");
            var char = text.slice(0, vertBarIndex > -1 ? Math.min(colonIndex, vertBarIndex) : colonIndex).trim();
            var exp = null;
            if (!charLines[char]) {
                charLines[char] = [];
            }
            if (vertBarIndex > -1 && vertBarIndex < colonIndex) {
                exp = text.slice(vertBarIndex + 1, colonIndex);
            }
            charLines[char].push({"exp": exp, "line": $(this), "pageIndex": $(this).parents(".kix-page-paginated").index()});
        }
    });
}

function getAllCharExp(callback) {
    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbxIqiAe_fSuyHK-zPc9R-JiwYsyfENCF7Kmqs-oTh92U_FcsBZM/exec",
        method: "GET",
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        dataType: "jsonp",
        jsonpCallback: "on_result",
        data: {
            "action": "getExpressions",
            "chars": Object.keys(charLines).join(",")
        },
        success: function(data) {
            var chars = Object.keys(data);
            for (var c in chars) {
                charAllExp[chars[c]] = data[chars[c]];
            }
            callback();
        }
    });
}

function addExp(pageIndex) {
    if (!pageIndex) {
        charExp = {};
    }
    for (var c in charLines) {
        var pageLineFound = false;
        for (var l in charLines[c]) {
            var charLine = charLines[c][l];
            if (pageIndex) {
                if (charLine.pageIndex < pageIndex) {
                    continue;
                } else if (!pageLineFound) {
                    pageLineFound = true;
                    var lastExp = "normal";
                    for (var l2 = l - 1; l2 >= 0; l2--) {
                        if (charLines[c][l2].exp) {
                            lastExp = charLines[c][l2].exp;
                            break;
                        }
                    }
                    charExp[c] = lastExp;
                }
            }
            addExpToLine(c, charLine.exp, $(charLine.line), l);
        }
    }
    if (!pageIndex) {
        $(document).on("click", ".nice-select.ss-exp .option", function() {
            var $select = $(this).parents(".ss-exp").prev();
            var char = $select.data("char");
            var lineIndex = $select.data("lineIndex");
            var val = $(this).data("value");
            var l;
            var charLine;
            charLines[char][lineIndex].exp = val || null;
            updateLineExp(charLines[char][lineIndex].line, val);
            if (!val) {
                var exp = "normal";
                if (lineIndex > 0) {
                    for (l = lineIndex - 1; l >= 0; l--) {
                        charLine = charLines[char][l];
                        if (charLine.exp) {
                            exp = charLine.exp;
                            break;
                        }
                    }
                }
                var $currentLabel = $(this).parents(".ss-exp").find(".current");
                window.setTimeout(function() {
                    $currentLabel.text(exp.slice(0, 1).toUpperCase() + exp.slice(1));
                }, 10);
                val = exp;
            }

            if (lineIndex < charLines[char].length) {
                for (l = lineIndex + 1; l < charLines[char].length; l++) {
                    charLine = charLines[char][l];
                    if (!charLine.exp) {
                        $('select.ss-exp[data-char="' + char + '"][data-line-index="' + l + '"]').val(val).next().find(".current").text((val.slice(0, 1).toUpperCase() + val.slice(1)));
                    } else {
                        break;
                    }
                }
            }
        });
    }
}

function addExpToLine(char, exp, $line, lineIndex) {
    if (char != "MC") {
        if (Object.keys(charExp).indexOf(char) === -1)
            charExp[char] = "normal";
        if (exp)
            charExp[char] = exp;
        else
            exp = charExp[char];
        var $expSelect = $('<select class="ss-exp" style="position: absolute;" data-char="' + char + '" data-line-index="' + lineIndex + '"><option value="">Not Set</option></select>');
        for (var e in charAllExp[char]) {
            var charExpr = charAllExp[char][e];
            $expSelect.append('<option' + (charExpr === exp.toLowerCase() ? ' selected' : '') + ' value="' + charExpr + '">' + charExpr.slice(0, 1).toUpperCase() + charExpr.slice(1) + '</option>');
        }
        $expSelect.prependTo($line);
        $expSelect = $expSelect.niceSelect().next();
        $expSelect.css({"position": "absolute", "top": "-6px", "left": ($expSelect[0].offsetLeft - ($expSelect.innerWidth() + 16)) + "px"});
    }
}

function updateLineExp($line, exp) {
    var path = window.location.href;
    var docId = path.slice(path.indexOf("/d/") + 3, path.indexOf("/edit"));
    $.ajax({
        url: "https://script.google.com/macros/s/AKfycbxIqiAe_fSuyHK-zPc9R-JiwYsyfENCF7Kmqs-oTh92U_FcsBZM/exec",
        method: "GET",
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        dataType: "jsonp",
        jsonpCallback: "on_result",
        data: {
            "action": "updateDocLineExp",
            "docId": docId,
            "paragraphIndex": $line.parent(".kix-paragraphrenderer").data("paragraphIndex"),
            "lineIndex": $line.data("lineIndex"),
            "exp": exp.slice(0, 1).toUpperCase() + exp.slice(1)
        },
        success: function(data) {
        }
    });
}

function addContainer() {
    var $container = $('<div id="ss-container" style="width: 924px; position: absolute; opacity: 0;"><span id="ss-container-text" style="margin: 0; font-family: Lunchtype; font-size: 36px; word-spacing: 1px; letter-spacing: 1.85px;"></span></div>');
    $("body").prepend($container);
}

function updateTextBounds(pageIndex) {
    $((pageIndex ? ".kix-page-paginated:nth(" + pageIndex + ") " : "") + ".kix-paragraphrenderer").each(function() {
        var text = "";
        $(this).find(".kix-lineview").each(function() {
            var lineText = $(this).children(".kix-lineview-content").text().replace(new RegExp("\u200c", 'g'), "");
            if (/^[^@:"“]+(:|\|)/.test(lineText)) {
                lineText = lineText.slice(lineText.indexOf(":") + 2);
            }
            text += (text ? " " : "") + lineText.trim();
        });
        $("#ss-container-text").html(text);
        var height = $("#ss-container-text").innerHeight();
        var lines = Math.floor(height / 41);
        if (lines > 3) {
            if (debug) {
                console.log(text);
            }
            var charThreshold = text.length;
            do {
                $("#ss-container-text").html(text.slice(0, --charThreshold));
                height = $("#ss-container-text").innerHeight();
                lines = Math.floor(height / 41);
            } while (lines > 3);
            var charCount = 0;
            var isOverLimit = false;
            $(this).find(".kix-wordhtmlgenerator-word-node").each(function() {
                text = $(this).text();
                var isFirstLine = charCount == 0;
                if ((charCount = (charCount + text.length)) > charThreshold) {
                    if (isOverLimit) {
                        $(this).html('<span class="ss-highlight" style="color: red !important;">' + $(this).html() + '</span>');
                    } else {
                        isOverLimit = true;
                        var extraChars = charCount - charThreshold;
                        var overLimitIndex = $(this).text().length - extraChars;
                         $(this).html($(this).html().slice(0, overLimitIndex) + '<span class="ss-highlight" style="color: red !important;">' + $(this).html().slice(overLimitIndex) + '</span>');
                    }
                } else if (isFirstLine) {
                    var colonIndex = text.indexOf(":");
                    var quoteIndex = text.indexOf("“");
                    if (colonIndex > -1 && quoteIndex > -1 && quoteIndex > colonIndex) {
                        charCount -= quoteIndex;
                    }
                }
            });
        }
    });
}

function updateParagraphIndexes() {
    var paragraphCount = 0;
    $(".kix-page-content-wrapper .kix-paragraphrenderer").each(function() {
        if (debug) {
            $(this).attr("data-paragraph-index", paragraphCount);
        }
        $(this).data("paragraphIndex", paragraphCount++);
        var lineCount = 0;
        $(this).find(".kix-lineview").each(function() {
            if (debug) {
                $(this).attr("data-line-index", lineCount);
            }
            $(this).data("lineIndex", lineCount++);
        });
    });
}