// ==UserScript==
// @name        新概念符號調整
// @description  特定字串轉換
// @author       John
// @match        *://www.xuexi.la/*
// @match        *://*.xiao84.com/*
// @match        *://www.enfamily.cn/*
// @match        *://blog.sina.com.cn/*
// @match        *://www.xindeng.org/*
// @match        *://www.tingroom.com/*
// @match        *://www.cnblogs.com/*
// @version     0.1
// @license     MIT
// @namespace https://greasyfork.org/users/814278
// @downloadURL https://update.greasyfork.org/scripts/432232/%E6%96%B0%E6%A6%82%E5%BF%B5%E7%AC%A6%E8%99%9F%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/432232/%E6%96%B0%E6%A6%82%E5%BF%B5%E7%AC%A6%E8%99%9F%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var bAuto = true;
    var oSC2TC_regexp = null;

    var aSC2TC = {
    "）":")"
    , "（":"("
    , "”":'"'
    , "“":'"'
    , "？":"?"
    , "！":"!"
    , "／":"/"
    , "～":"~"
    , "；":"; "
    , "……":"..."
    , "．":"."
    , "復數":"複數"
    , "复数":"複數"
    , "面包":"麵包"
    };

    function transText(str) {
        if (!str) {
            return "";
        }
        return traditionalized(str)
    }

    function transBody(pNode) {
        let childs = (pNode) ? pNode.childNodes: document.documentElement.childNodes;

        if (childs) {
            for (var i = 0; i < childs.length; i++) {
                let child = childs.item(i);

                if (/BR|HR|META|SCRIPT|TEXTAREA/.test(child.tagName)) {
                    continue;
                }

                if (child.alt) {
                    let s = transText(child.alt);
                    if (child.alt != s) {
                        child.alt = s;
                    }
                }

                if (child.title) {
                    let s = transText(child.title);
                    if (child.title != s) {
                        child.title = s;
                    }
                }

                if (child.tagName == "INPUT" && child.value !== "" && child.type != "text" && child.type != "search" && child.type != "hidden") {
                    let s = transText(child.value);
                    if (child.value != s) {
                        child.value = s;
                    }
                }else if (child.nodeType == 3) {
                    let s = transText(child.data);
                    if (child.data != s) {
                        child.data = s;
                    }
                }else {
                    transBody(child);
                }
            }
        }
    }

    function traditionalized(s) {
        if (!oSC2TC_regexp) {
            let pattern = [];
            // Construct a RegEx from the dictionary
            for (var name in aSC2TC) {
                if (aSC2TC.hasOwnProperty(name)) {
                    // Escape characters
                    pattern.push(name.replace(/([[^$.|?*+(){}\\])/g, '\\$1'));
                }
            }
            // Concatenate keys, and create a Regular expression:
            let ps = pattern.join('|');
            oSC2TC_regexp = new RegExp(ps, 'g');
        }
        // Call String.replace with a regex, and function argument.
        return s.replace(oSC2TC_regexp, function(match) {
            return aSC2TC[match];
        });
    }

    if (bAuto) {
        setTimeout(function() {
            transBody();
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            var observer = new MutationObserver(function(records) {
                records.map(function(record) {
                    if (record.addedNodes) {
                        [].forEach.call(record.addedNodes, function(item) {
                            transBody(item);
                        });
                    }
                });
            });
            var option = {
                'childList': true,
                'subtree': true
            };
            observer.observe(document.body, option);
        }, 50);
    }
})();