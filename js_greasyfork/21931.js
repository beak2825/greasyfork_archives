// ==UserScript==
// @name         Blogger Editor IMG helper
// @namespace    http://llorxscript.blogspot.com.es/
// @version      0.1
// @description  Help adding/removing classes to your images and automatically remove anchor links.
// @author       Llorx
// @match        https://www.blogger.com/blogger.g*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21931/Blogger%20Editor%20IMG%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/21931/Blogger%20Editor%20IMG%20helper.meta.js
// ==/UserScript==

var config = {
    removeAnchor: true,
    classes: {
        gif: {
            color: "red",
            unique: true
        },
        img: {
            color: "blue",
            unique: true
        },
    }
};

(function() {
    'use strict';
    var lastImg;
    var interval = setInterval(function() {
        var target = document.querySelector('#postingComposeBox');
        if (target && target.contentDocument) {
            var header = target.contentDocument.head;
            target = target.contentDocument.querySelector('#postingComposeBox');
            if (header && target) {
                var style = document.createElement('style');
                style.type = 'text/css';
                var st = [];
                for (var className in config.classes) {
                    if (config.classes.hasOwnProperty(className)) {
                        var cl = config.classes[className];
                        st += "."+className+" {border-radius:10px; border: 5px solid "+cl.color+";} ";
                    }
                }
                style.appendChild(document.createTextNode(st));
                header.appendChild(style);
                clearInterval(interval);
                changes(target);
            }
        }
    }, 1000);

    function changes(target) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (config.removeAnchor) {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        if (!mutation.addedNodes[i].querySelectorAll) {
                            continue;
                        }
                        var all = mutation.addedNodes[i].querySelectorAll("a > img");
                        for (var ii = 0; ii < all.length; ii++) {
                            var n = all[ii];
                            var a = n.parentNode;
                            if (a.href == n.src) {
                                var p = a.parentNode;
                                p.insertBefore(n, a);
                                p.removeChild(a);
                            }
                        }
                    }
                }
                if (mutation.target.nodeName && mutation.target.nodeName.toLowerCase() == 'img') {
                    lastImg = mutation.target;
                }
            });
        });
        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                if (!mutation.addedNodes[i].querySelector) {
                    continue;
                }
                var el = mutation.addedNodes[i].querySelector("[id='tr_sizes-div']");
                if (!el || el.getAttribute("data-customimg")) {
                    return;
                }
                el.setAttribute("data-customimg", "true");
                for (var className in config.classes) {
                    if (config.classes.hasOwnProperty(className)) {
                        var cl = config.classes[className];
                        (function(className, cl) {
                            var classClick = document.createElement("span");
                            classClick.style.cursor = "pointer";
                            classClick.style.textDecoration = "underline";
                            classClick.style.color = "#0000cc";
                            cl.check = function() {
                                if (!lastImg) {
                                    return;
                                }
                                if (hasClass(lastImg, className)) {
                                    classClick.innerHTML = "REMOVE " + className;
                                } else {
                                    classClick.innerHTML = "SET " + className;
                                }
                            };
                            setTimeout(cl.check, 1);
                            classClick.onclick = function() {
                                if (!lastImg) {
                                    return;
                                }
                                var cls = lastImg.className;
                                if (!cls) {
                                    cls = "";
                                }
                                cls = cls.split(" ");
                                if (cls.indexOf(className) > -1) {
                                    cls.splice(cls.indexOf(className), 1);
                                } else {
                                    cls.push(className);
                                }
                                if (cl.unique) {
                                    for (var cName in config.classes) {
                                        if (config.classes.hasOwnProperty(cName) && className != cName) {
                                            var c = config.classes[cName];
                                            if (c.unique) {
                                                if (cls.indexOf(cName) > -1) {
                                                    cls.splice(cls.indexOf(cName), 1);
                                                }
                                            }
                                        }
                                    }
                                }
                                while (cls.indexOf("") > -1) {
                                    cls.splice(cls.indexOf(""), 1);
                                }
                                lastImg.className = cls.join(" ");
                                if (lastImg.className === "") {
                                    lastImg.removeAttribute("class");
                                }
                                for (var cN in config.classes) {
                                    if (config.classes.hasOwnProperty(cN)) {
                                        config.classes[cN].check();
                                    }
                                }
                            };
                            el.insertBefore(document.createTextNode(" | "), el.firstChild);
                            el.insertBefore(classClick, el.firstChild);
                        })(className, cl);
                    }
                }
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    function hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }
})();