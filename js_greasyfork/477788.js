// ==UserScript==
// @name         Too Lazy To Learn
// @namespace    http://reddit.com/r/streetfighter
// @version      0.1
// @description  This is dumb
// @author       http://reddit.com/u/SweetScientist
// @match        *://reddit.com/*
// @match        *://*.reddit.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477788/Too%20Lazy%20To%20Learn.user.js
// @updateURL https://update.greasyfork.org/scripts/477788/Too%20Lazy%20To%20Learn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const css = `
[data-tooltip] {
  border-bottom: 1px dotted;
  position: relative;
  z-index: 2;
  cursor: pointer;
}

/* Hide the tooltip content by default */
[data-tooltip]:before,
[data-tooltip]:after {
  visibility: hidden;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
  filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=0);
  opacity: 0;
  pointer-events: none;
}

/* Position tooltip above the element */
[data-tooltip]:before {
  position: absolute;
  bottom: 150%;
  left: 50%;
  margin-bottom: 5px;
  margin-left: -80px;
  padding: 7px;
  width: 160px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background-color: #000;
  background-color: hsla(0, 0%, 20%, 0.9);
  color: #fff;
  content: attr(data-tooltip);
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
}

/* Triangle hack to make tooltip look like a speech bubble */
[data-tooltip]:after {
  position: absolute;
  bottom: 150%;
  left: 50%;
  margin-left: -5px;
  width: 0;
  border-top: 5px solid #000;
  border-top: 5px solid hsla(0, 0%, 20%, 0.9);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  content: " ";
  font-size: 0;
  line-height: 0;
}

/* Show tooltip content on hover */
[data-tooltip]:hover:before,
[data-tooltip]:hover:after {
  visibility: visible;
  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
  filter: progid: DXImageTransform.Microsoft.Alpha(Opacity=100);
  opacity: 1;
}
`;

    var head = document.head;
    var style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);

    const replacements = [
        [/236 ?([^ ]+)/g, 'QCF $1'],
        [/214 ?([^ ]+)/g, 'QCB $1'],
        [/623 ?([^ ]+)/g, '$1 DP'],
        [/5 ?([^ ]+)/g, '$1'],
        [/2 ?([^ ]+)/g, 'cr.$1'],
    ];

    const walker = document.createNodeIterator(
        document.body,
        NodeFilter.SHOW_TEXT,
        node => {
            for (var i = 0; i < replacements.length; i++) {
                if (node.nodeValue.match(replacements[i][0])) {
                    return NodeFilter.FILTER_ACCEPT;
                }
            }

            return NodeFilter.FILTER_SKIP;
       }
    );

    var node;
    while (node = walker.nextNode()) {
        var node_text = node.nodeValue;

        for (var i = 0; i < replacements.length; i++) {
            if (node_text.match(replacements[i][0])) {
                node_text = node_text.replaceAll(replacements[i][0], `<span data-tooltip="Numpad: $&">${replacements[i][1]}</span>`);
                break; // don't recursively replace things and cause an endless loop
            }
        }

        var span = document.createElement("span");
        span.innerHTML = node_text;
        node.replaceWith(span);
    }
})();