// ==UserScript==
// @name         ivnote-web-clipper
// @version      0.8.1
// @description  Choose your favorite DOM node and its content will be automatically copied to the clipboard in markdown format
// @author       Ivan Jiang
// @match        http://*/*
// @match        https://*/*
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/to-markdown/3.0.3/to-markdown.min.js
// @namespace http://ivnote.xyz
// @downloadURL https://update.greasyfork.org/scripts/24509/ivnote-web-clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/24509/ivnote-web-clipper.meta.js
// ==/UserScript==

/* globals GM_addStyle, toMarkdown */
GM_addStyle(` .ivnote-web-clipper-hover { background: rgba(124, 201, 191, .7); }
.ivnote-web-clipper-icon {
  position: fixed; bottom: 15px; right: 15px;
  height: 50px; width: 50px; border-radius: 50%;
  background: RGBA(124, 201, 191, .6) url('https://github.com/iplus26/ivnote/raw/master/web-clipper/toggle-icon.png') no-repeat center center / 80%;
  opacity: .7; cursor: pointer;
  transition: all .3s ease-in-out;
  z-index: 9999;
}
.ivnote-web-clipper-icon.ivnote-web-clipper-enable {
  opacity: 1; transform: rotate(180deg);
  right: 50px;
}
.ivnote-web-clipper-icon:hover {
  opacity: 1;
  transform: rotate(180deg)
}`);

(function() {
'use strict';

// Utils =========================================================================
var classCache = {};

var _ = {
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
};

function hasClass(node, name) {
    if (!name) {
        return false;
    }
    return classRE(name).test(className(node));
}

function addClass(node, name) {
    if (!name) {
        return node;
    }
    if (!('className' in node)) {
        return;
    }
    var classList = [];
    var cls = className(node); // get node's className
    name.split(/\s+/g).forEach(function(klass) {
        if (!hasClass(node, klass)) {
            classList.push(klass);
        }
    });
    return classList.length && className(node, cls + (cls ? ' ' : '') + classList.join(' '));
}

function removeClass(node, name) {
    if (!('className' in node)) {
        return;
    }
    if (name === undefined) {
        return className(node, '');
    }
    let cls = className(node);
    name.split(/\s+/g)
        .forEach((klass) => cls = cls.replace(classRE(klass), ' '));
    className(node, cls.trim());
}

function classRE(name) {
    return name in classCache ?
        classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
}
// access className property while respecting SVGAnimatedString
function className(el, value) {
    var klass = el.className || '',
        svg = klass && klass.baseVal !== undefined;

    // get className
    if (value === undefined) {
        return svg ? klass.baseVal : klass;
    }

    // set className
    return svg ? (klass.baseVal = value) : (el.className = value);
}

// Toggle icon =====================================================================
var toggle = document.createElement('div');
toggle.className = "ivnote-web-clipper-icon";
document.body.appendChild(toggle);

var enable = false;

toggle.addEventListener('click', function(e) {
  if (_.hasClass(toggle, 'ivnote-web-clipper-enable')) {
    // turn it off
    _.removeClass(toggle, 'ivnote-web-clipper-enable');
    enable = false;
  } else {
    // turn it on
    _.addClass(toggle, 'ivnote-web-clipper-enable');
    enable = true;
  }
  e.stopPropagation();
});

// Manipulate the doms ==============================================================
document.addEventListener('mouseover', function(e) {
    if (enable) _.addClass(e.target, 'ivnote-web-clipper-hover');
});

document.addEventListener('mouseout', function(e) {
    if (enable) {
        _.removeClass(e.target, 'ivnote-web-clipper-hover');

        // To be safe
        var select = document.querySelectorAll('.ivnote-web-clipper-hover');
        Array.prototype.slice.call(select).forEach(function(el) { _.removeClass(el, 'ivnote-web-clipper-hover'); });
    }
});

document.addEventListener('click', function(e) {
    if (enable) {
        var el = e.target;

        var fRemoveContent   = function() { return '' }
        var fRemoveInlineTag = function(content) { return content }
        var fRemoveBlockTag  = function(content) { return '\n\n' + content + '\n\n' }

        var generalConverters = [
            // Originally, toMarkdown keeps the tag name of block level elements. 
            {
                filter: ['article', 'div'],
                replacement: fRemoveBlockTag
            },
            {
                filter: ['span'],
                replacement: fRemoveInlineTag
            },
            {
                filter: ['style', 'script'],
                replacement: fRemoveContent
            },
            {
                filter: function(node) {
                    return node.nodeName === 'A' && !node.getAttribute('href');
                },
                replacement: fRemoveInlineTag
            },
            // More cases to create the TR spec.
            {
                filter: 'tr',
                replacement: function(content, node) {
                    var borderCells = '';
                    var alignMap = {
                        left: ':--',
                        right: '--:',
                        center: ':-:'
                    };

                    var headRow = node.parentNode.nodeName === 'THEAD';

                    // Assume ths in first tr in tbody are header cells. (Issue #89)
                    headRow = headRow || node.parentNode.nodeName === 'TBODY' && !node.previousSibling && !node.parentNode.previousSibling;

                    if (headRow) {
                        for (var i = 0; i < node.childNodes.length; i++) {
                            var align = node.childNodes[i].attributes.align;
                            var border = '---';

                            if (align) {
                                border = alignMap[align.value] || border;
                            }

                            borderCells += cell(border, node.childNodes[i]);
                        }
                    }
                    return '\n' + content + (borderCells ? '\n' + borderCells : '');
                }
            }
        ];

        var particularWebsitesConverters = [
            {
                filter: function(node) {
                    return node.nodeName === 'BR' && /^(.+\.)?zhihu.com$/gi.test(location.host)
                },
                replacement: function() {
                    return '\n\n'
                }
            }
        ];

        var markdown = '*The note is clipped from [here](' + location.href + ').*\n\n' +
            (document.title && !el.querySelector('h1') ? '#' + document.title + '\n\n' : '') +
            toMarkdown(el.outerHTML, {
                gfm: true,
                converters: particularWebsitesConverters.concat(generalConverters)
            });
        copyTextToClipboard(markdown);
    }
});

// Internal function of to-markdown
function cell (content, node) {
  var index = Array.prototype.indexOf.call(node.parentNode.childNodes, node);
  var prefix = ' ';
  if (index === 0) prefix = '| ';
  return prefix + content + ' |';
}

// Copy to the clipboard ============================================================
// Copyright (c) Dean Taylor. Original post: http://stackoverflow.com/a/30810322/4158282
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }
  document.body.removeChild(textArea);
}

})();