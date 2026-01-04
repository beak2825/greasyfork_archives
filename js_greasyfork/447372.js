// ==UserScript==
// @name         让 Flowus 多维表单元格显示颜色
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      MIT
// @description  当单元格的内容是 #AABBCC 这样的颜色值时，给单元格背景上色！
// @author       luobo25
// @match        https://flowus.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flowus.cn
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/447372/%E8%AE%A9%20Flowus%20%E5%A4%9A%E7%BB%B4%E8%A1%A8%E5%8D%95%E5%85%83%E6%A0%BC%E6%98%BE%E7%A4%BA%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/447372/%E8%AE%A9%20Flowus%20%E5%A4%9A%E7%BB%B4%E8%A1%A8%E5%8D%95%E5%85%83%E6%A0%BC%E6%98%BE%E7%A4%BA%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const r = /(?<rgb>#[0-9A-F]{3,8})( +(?<alpha>\d+)%)?/i

    // alpha: float, 0 -> 1
    var setAlpha = function(rgb, alpha) {
        var a = "00" + (Math.round(alpha * 255).toString(16))
        a = a.substring(a.length - 2, a.length)
        return "#"+ rgb.substring(1, 7) + a
    }

    var colorLight = function(argb) {
        var r = argb.substring(1, 3)
        var g = argb.substring(3, 5)
        var b = argb.substring(5, 7)
        var a = argb.substring(7, 9)
        var af = (parseInt(a, 16) / 255.0)
        return (parseInt(r, 16) + parseInt(g, 16) + parseInt(b, 16)) * af + (1 - af) * (255 * 3) // 加上透过白色的亮度
    }

    var addColor = function(element) {
        var text = element.textContent
        var m = text.match(r)
        if (m != null && m.groups != null && m.groups.rgb != null) {
            var alpha = m.groups.alpha != null ? parseInt(m.groups.alpha) / 100.0 : 1
            var argb = setAlpha(m.groups.rgb, alpha)
            element.style.background = argb
            var l = colorLight(argb)
            if (l < 384) {
                element.style.color = "#FFF"
            } else {
                element.style.color = "#000"
            }
        }
    }

    var isTable = function(n) {
        return n.tagName != null && n.tagName.toLowerCase() == "table"
    }

    var isTD = function(n) {
        return n.tagName != null && n.tagName.toLowerCase() == "td"
    }

    var findTD = function(path) {
        for (var i = 0; i < path.length; i++) {
            var n = path[i]
            if (n.tagName != null && n.tagName.toLowerCase() == "td") {
                return n
            }
        }
        return null
    }

    var isP2 = function(n) {
        return (n.tagName != null && n.tagName.toLowerCase() == "div" && n.attributes['data-property-id'] != null)
    }

    var findP2 = function(path) {
        for (var i = 0; i < path.length; i++) {
            var n = path[i]
            if (isP2(n)) {
                return n
            }
        }
        return null
    }

    var f = function(event) {
        var td = findTD(event.path)
        if (td != null) {
            addColor(td)
        } else {
            var path = event.path
            var first = path[0]
            if (first.children != null && first.children.length > 0) {
                path = [first.children[0]].concat(path)
            }
            var p2 = findP2(path)
            if (p2 != null) {
                addColor(p2)
            }
        }
    }

    document.addEventListener('DOMSubtreeModified', f)

    var recurFind = function(n) {
        if (isTable(n)) {
            observer.observe(n)
        } else if (isTD(n) || isP2(n)) {
            addColor(n)
        } else {
            if (n.children != null && n.children.length > 0) {
                var arr = n.children
                for (var i = 0; i < arr.length; i++) {
                    recurFind(arr[i])
                }
            }
        }
    }

    var body = document.getElementsByTagName("body")[0]

    var targetNode = body
    var observerOptions = {
        childList: true,
        attributes: false,
        subtree: true,
        characterData: true
    }

    function callback(mutationList, observer) {
        mutationList.forEach((mutation) => {
            switch(mutation.type) {
                case 'attributes':
                case 'characterData':
                case 'subtree':
                case 'childList':
                    var added = mutation.addedNodes
                    if (added != null) {
                        added.forEach(x => recurFind(x, 0))
                    }
                    break;
            }
        });
    }
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, observerOptions);

})();