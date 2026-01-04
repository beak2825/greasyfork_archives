// ==UserScript==
// @name         Panorama Helper d3.ru
// @namespace    d3.ru
// @version      1.007
// @description  Panorama helper for d3.ru
// @author       Anton aka RichDad
// @match        https://*.d3.ru/*
// @match        https://d3.ru/edit/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/394477/Panorama%20Helper%20d3ru.user.js
// @updateURL https://update.greasyfork.org/scripts/394477/Panorama%20Helper%20d3ru.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PANORAMA_PROTOCOL = 'panorama://';
    const TYPE_POST = 'post';
    const TYPE_COMMENT = 'comment';

    const PANORAMA_BUTTON_CLASS = 'panorama-helper-button0';
    const PANORAMA_SHOWCASE_CLASS = 'panorama-helper-showcase0';

    const IFRAME_SRC = 'https://cdn.pannellum.org/2.5/pannellum.htm#panorama=${img}&${params}';

    // noinspection JSUnresolvedVariable,JSUnresolvedFunction
    let version = (typeof GM_info == 'function' ? GM_info().script.version :
        (typeof GM_info == 'object' ? GM_info.script.version : '?'));

    // noinspection JSUnusedGlobalSymbols
    let Helper = {
        log: function (...args) {
            if (console) console.log(...args);
        },
        debug: function (...args) {
            if (console) console.debug(...args);
        },
        error: function (...args) {
            if (console) {
                const stack = (new Error).stack.split("\n");
                let caller_line = stack.length > 3 ? stack[3] : stack.pop();
                let index = caller_line.indexOf("at ");
                let clean = caller_line.slice(index + 3, caller_line.length);
                console.log('[' + clean + ']', ...args);
            }
        },
        arraysIntersect: function (haystack, arr) {
            return arr.some(function (v) {
                return haystack.indexOf(v) >= 0;
            });
        }
    };

    let PanoramaHelper = {
        isDeveloperMode: true,
        hasClass: function (element, className) {
            if (element && element.className) {
                let classes = element.className.split(' ');
                return classes.indexOf(className) > -1;
            }
            return false;
        },
        hasParentWithAnyClassOf: function (element, classname_arr) {
            if (!element) return false;
            if (element.className) {
                let classes = element.className.split(' ');
                if (Helper.arraysIntersect(classes, classname_arr)) {
                    return true;
                }
            }

            return element.parentNode && PanoramaHelper.hasParentWithAnyClassOf(element.parentNode, classname_arr);
        },
        getParentWithClass: function (element, classname) {
            if (!element) return null;
            if (element.className) {
                let classes = element.className.split(' ');
                if (classes.indexOf(classname) >= 0) {
                    return element;
                }
            }
            return element.parentNode ? PanoramaHelper.getParentWithClass(element.parentNode, classname) : null;
        },
        paramsToUri: function (params) {
            let paramParts = [];
            for (let paramName in params) {
                if (params.hasOwnProperty(paramName)) {
                    paramParts.push(paramName + '=' + params[paramName]);
                }
            }
            return paramParts.join('&');
        },
        prepareIframe: function (params) {
            let iframe = document.createElement('iframe');
            iframe.setAttribute('width', params.w);
            iframe.setAttribute('height', params.h);
            iframe.setAttribute('style', 'border-style:none;');
            iframe.setAttribute('allowfullscreen', '');
            let src = IFRAME_SRC.replace(/\${params}/, PanoramaHelper.paramsToUri({
                haov: params.haov,
                vaov: params.vaov,
                autoLoad: params.autoLoad,
                vOffset: params.vOffset
            })).replace(/\${img}/, params.img);
            iframe.setAttribute('src', src);
            return iframe;
        },
        parsePanoramaHref: function (href) {
            let result = {
                autoLoad: 'true',
                vOffset: 0
            };
            if (href.indexOf(PANORAMA_PROTOCOL) === 0) {
                href = href.substr(PANORAMA_PROTOCOL.length);
                href = href.toLocaleLowerCase();
                href = href.replace(/%20/g, '+');
                const parts = href.replace(/[+.,\/#!$%^&*;:{}=\-_`~()]/g, " ").split(/\s+/);

                // parse TYPE
                if (parts.length) {
                    if (parts[0] === 'post') {
                        result.type = TYPE_POST;
                        parts.shift();
                    } else if (parts[0] === 'comment') {
                        result.type = TYPE_COMMENT;
                        parts.shift();
                    } else {
                        result.type = TYPE_COMMENT;
                    }

                    // parse HAOV
                    if (parts.length) {
                        let haov = parseInt(parts.shift());
                        if (!isNaN(haov) && haov > 0) {
                            result.haov = haov;

                            // parse VAOV
                            if (parts.length) {
                                let vaov = parseInt(parts.shift());
                                if (!isNaN(vaov) && vaov > 0) {
                                    result.vaov = vaov;

                                    // parse vOffset
                                    if (parts.length) {
                                        let vOffset = parseInt(parts.shift());
                                        if (!isNaN(vOffset)) {
                                            result.vOffset = vOffset;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return result;
        },
        addDimensions: function (link, params) {
            let result = Object.assign(Object.create(null), params);
            params.w = 800;
            params.h = 600;
            if (params.type === TYPE_POST) {
                // TODO
            } else if (params.type === TYPE_COMMENT) {
                // TODO
            }
            return result;
        },
        addPostSelector: function (link, params) {
            let result = Object.assign(Object.create(null), params);
            if (PanoramaHelper.hasParentWithAnyClassOf(link, ['b-post__body', 'post_body', 'b-post-cut__post-cut'])) {
                result.type = TYPE_POST;
            }
            return result;
        },
        getPreviousComment: function (link) {
            let parent = link;
            while (parent.parentElement) {
                parent = parent.parentElement;
                if (PanoramaHelper.hasClass(parent, 'b-comment') &&
                    !PanoramaHelper.hasClass(parent, 'b-comment_mode_root')) {
                    return parent;
                }
            }
            return null;
        },
        addImage: function (link, params) {
            let result = Object.assign(Object.create(null), params);
            result.img = '?';
            if (params.type === TYPE_POST) {
                // SEARCH UP
                let post = PanoramaHelper.getParentWithClass(link, 'b-post__body');
                if (post) {
                    let post_image = post.querySelector('img[src]');
                    if (post_image) {
                        result.img = post_image.getAttribute('src');
                    }
                } else {
                    let post_small = PanoramaHelper.getParentWithClass(link, 'b-post-cut');
                    if (post_small) {
                        let post_small_image = post_small.querySelector('img[src]');
                        if (post_small_image) {
                            result.img = post_small_image.getAttribute('src');
                        }
                    } else {
                        let post_feed = PanoramaHelper.getParentWithClass(link, 'post_body');
                        if (post_feed) {
                            let post_feed_image = post_feed.querySelector('img[src]');
                            if (post_feed_image) {
                                result.img = post_feed_image.getAttribute('src');
                            }
                        } else {
                            // SEARCH DOWN
                            let post_image = document.querySelector('.b-post__body img[src]');
                            if (post_image) {
                                result.img = post_image.getAttribute('src');
                            }
                        }
                    }
                }
            } else if (params.type === TYPE_COMMENT) {
                let comment_image = link.parentElement.querySelector('img');
                if (comment_image) {
                    result.img = comment_image.getAttribute('src');
                } else {
                    let previous_comment = PanoramaHelper.getPreviousComment(link);
                    while (previous_comment) {
                        let comment_image = previous_comment.parentElement.querySelector('img');
                        if (comment_image) {
                            result.img = comment_image.getAttribute('src');
                            break;
                        }
                        previous_comment = PanoramaHelper.getPreviousComment(previous_comment);
                    }
                }
            }
            return result;
        },
        convertLinkToButton: function (link) {
            let linkHref = link.getAttribute('href');

            let params = PanoramaHelper.parsePanoramaHref(linkHref);
            params = PanoramaHelper.addPostSelector(link, params);
            params = PanoramaHelper.addDimensions(link, params);
            params = PanoramaHelper.addImage(link, params);

            let div = document.createElement('div');

            let button = document.createElement('button');
            button.innerText = 'Panorama (' + 
                params.type.toUpperCase() + ' ' + params.haov + '/' + params.vaov + (params.vOffset ? '/' + params.vOffset : '') + ')';
            button.onclick = function () {
                let buttonDiv = this.parentElement;
                let w = buttonDiv.offsetWidth;
                let h = Math.floor(w * 3 / 4);
                params.w = w;
                params.h = h;

                let iframe = PanoramaHelper.prepareIframe(params);
                buttonDiv.removeChild(this);
                buttonDiv.appendChild(iframe);
            };
            div.appendChild(button);

            return div;
        },
        appendLinkToButton: function (link) {
            let div = PanoramaHelper.convertLinkToButton(link);
            let linkParent = link.parentElement;
            linkParent.removeChild(link);
            linkParent.appendChild(div);
        },
        checkNewComment: function (commentBody, text) {
            if (!commentBody) return;

            let showcase = commentBody.querySelector('div.' + PANORAMA_SHOWCASE_CLASS);
            if (showcase) {
                showcase.parentElement.removeChild(showcase);
            }

            showcase = document.createElement('div');
            showcase.className = PANORAMA_SHOWCASE_CLASS;
            let textAppended = false;

            let textLines = text.split("\n");
            for (let textLine of textLines) {
                let line = textLine.trim();
                if (line.indexOf(PANORAMA_PROTOCOL) === 0) {
                    if (!textAppended) {
                        showcase.innerText = 'Panorama example:';
                        textAppended = true;
                    }
                    let a = document.createElement('a');
                    a.href = line;
                    showcase.append(a);
                }
            }
            commentBody.append(showcase);
        },
        hasPanoramaLinks: function (element) {
            if (element) {
                let text = element.innerText;
                let textLines = text.split("\n");
                for (let textLine of textLines) {
                    let line = textLine.trim();
                    if (line.indexOf(PANORAMA_PROTOCOL) === 0) {
                        return true;
                    }
                }
            }
            return false;
        },
        developerMode: function () {
            let commentButtons = document.querySelectorAll("span.b-comment__save-button");
            for (let commentButtonContatiner of commentButtons) {
                if (commentButtonContatiner.offsetParent !== null) { // it is visible
                    let commentBody = PanoramaHelper.getParentWithClass(commentButtonContatiner, 'b-comment__body');
                    let wysiwygEditor = commentBody.querySelector('div[contenteditable=true][id^=b-wysiwyg-editor-]');
                    if (!PanoramaHelper.hasPanoramaLinks(wysiwygEditor)) continue;

                    let panoramaButton = commentButtonContatiner.querySelector('div.' + PANORAMA_BUTTON_CLASS);
                    if (!panoramaButton) {
                        let buttonDiv = document.createElement('div');
                        buttonDiv.className = "b-button b-button_size_s b-button_mode_default b-button_color_yellow b-button_icon_false b-button_empty_false b-button_disabled_false " + PANORAMA_BUTTON_CLASS;
                        buttonDiv.innerText = "Panorama example"
                        buttonDiv.onclick = () => {
                            if (commentBody) {
                                if (wysiwygEditor) {
                                    let text = wysiwygEditor.innerText;
                                    PanoramaHelper.checkNewComment(commentBody, text);
                                } else {
                                    Helper.debug('wysiwygEditor?')
                                }
                            } else {
                                Helper.debug('commentBody?')
                            }
                        };
                        commentButtonContatiner.append(" ");
                        commentButtonContatiner.append(buttonDiv);
                    }
                }
            }
        },
        makeButtons: function () {
            let panoramaLinks = document.querySelectorAll("div:not(.b-wysiwyg__editor) > a[href^='" + PANORAMA_PROTOCOL + "']");
            if (panoramaLinks && panoramaLinks.length) {
                for (let i = 0; i < panoramaLinks.length; i++) {
                    PanoramaHelper.appendLinkToButton(panoramaLinks[i]);
                }
            }
            if (PanoramaHelper.isDeveloperMode) {
                PanoramaHelper.developerMode();
            }
        },
        init: function () {
            PanoramaHelper.makeButtons();
            setInterval(PanoramaHelper.makeButtons, 1000);
            Helper.log('[Panorama Helper] Started v.' + version);
        }
    };

    PanoramaHelper.init();

    // noinspection JSUnresolvedVariable
    if (typeof unsafeWindow !== 'undefined') {
        // noinspection JSUnresolvedVariable
        unsafeWindow.PanoramaHelper = PanoramaHelper;
    }

})();