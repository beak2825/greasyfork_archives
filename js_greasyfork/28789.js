// ==UserScript==
// @name        Details shim.
// @author tyleruebele | BladeMight(user.js)
// @namespace   !
// @description Adds support for <details> and <summary> tags for unsupported browsers.
// @include     http*
// @include     https*
// @version     1
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28789/Details%20shim.user.js
// @updateURL https://update.greasyfork.org/scripts/28789/Details%20shim.meta.js
// ==/UserScript==

// Style 
var css = "details.details_shim_closed,details.details_shim_open{display:block}details.details_shim_closed>*{display:none}details.details_shim_closed>summary,details.details_shim_open>summary{display:block}details.details_shim_closed>summary:before{display:inline-block;content:\"\\25b6\";padding:0 .1em;margin-right:.4em;font-size:.9em}details.details_shim_open>summary:before{display:inline-block;content:\"\\25bc\";padding:0;margin-right:.35em}";
GM_addStyle(css);
// END Style

// JavaScript

/* Copyright (c) 2006-2013 Tyler Uebele * Released under the MIT license. * latest at https://github.com/tyleruebele/details-shim * minified by Google Closure Compiler */
/**
 * details-shim.js
 * A pure JavaScript (no dependencies) solution to make HTML5
 *  Details/Summary tags work in unsupportive browsers
 *
 * Copyright (c) 2013 Tyler Uebele
 * Released under the MIT license.  See included LICENSE.txt
 *  or http://opensource.org/licenses/MIT
 *
 * latest version available at https://github.com/tyleruebele/details-shim
 */

/**
 * Enable proper operation of <details> tags in unsupportive browsers
 *
 * @param Details details element to shim
 * @returns {boolean} false on error
 */
function details_shim(Details) {
    // For backward compatibility, if no DOM Element is sent, call init()
    if (!Details || !('nodeType' in Details) || !('tagName' in Details)) {
        return details_shim.init();
    }

    var Summary;
    // If we were passed a details tag, find its summary tag
    if ('details' == Details.tagName.toLowerCase()) {
        // Assume first found summary tag is the corresponding summary tag
        Summary = Details.getElementsByTagName('summary')[0];

    // If we were passed a summary tag, find its details tag
    } else if (!!Details.parentNode
        && 'summary' == Details.tagName.toLowerCase()
    ) {
        Summary = Details;
        Details = Summary.parentNode;
    } else {
        // An invalid parameter was passed for Details
        return false;
    }

    // If the details tag is natively supported or already shimmed
    if ('boolean' == typeof Details.open) {
        // If native, remove custom classes
        if (!Details.getAttribute('data-open')) {
            Details.className = Details.className
                .replace(/\bdetails_shim_open\b|\bdetails_shim_closed\b/g, ' ');
        }
        return false;
    }

    // Set initial class according to `open` attribute
    var state = Details.outerHTML
        // OR older firefox doesn't have .outerHTML
        || new XMLSerializer().serializeToString(Details);
    state = state.substring(0, state.indexOf('>'));
    // Read: There is an open attribute, and it's not explicitly empty
    state = (-1 != state.indexOf('open') && -1 == state.indexOf('open=""'))
        ? 'open'
        : 'closed'
    ;
    Details.setAttribute('data-open', state);
    Details.className += ' details_shim_' + state;

    // Add onclick handler to toggle visibility class
    Summary.addEventListener
        ? Summary.addEventListener('click', function() { details_shim.toggle(Details); })
        : Summary.attachEvent && Summary.attachEvent('onclick', function() { details_shim.toggle(Details); })
    ;

    Object.defineProperty(Details, 'open', {
        get: function() {
            return 'open' == this.getAttribute('data-open');
        },
        set: function(state) {
            details_shim.toggle(this, state);
        }
    });

    // wrap text nodes in span to expose them to css
    for (var j = 0; j < Details.childNodes.length; j++) {
        if (Details.childNodes[j].nodeType == 3
            && /[^\s]/.test(Details.childNodes[j].data)
            ) {
            var span = document.createElement('span');
            var text = Details.childNodes[j];
            Details.insertBefore(span, text);
            Details.removeChild(text);
            span.appendChild(text);
        }
    }
} // details_shim()

/**
 * Toggle the open state of specified <details> tag
 * @param Details The <details> tag to toggle
 * @param state   Optional override state
 */
details_shim.toggle = function(Details, state) {
    // If state was not passed, seek current state
    if ('undefined' === typeof state) {
        // new state
        state = Details.getAttribute('data-open') == 'open'
            ? 'closed'
            : 'open'
        ;
    } else {
        // Sanitize the input, expect boolean, force string
        // Expecting boolean means even 'closed' will result in an open
        // This is the behavior of the natively supportive browsers
        state = !!state ? 'open' : 'closed';
    }

    Details.setAttribute('data-open', state);
    // replace previous open/close class
    Details.className = Details.className
        .replace(/\bdetails_shim_open\b|\bdetails_shim_closed\b/g, ' ')
        + ' details_shim_' + state;
};

/**
 * Run details_shim() on each details tag
 */
details_shim.init = function() {
    // Because <details> must include a <summary>,
    //  collecting <summary> tags collects *valid* <details> tags
    var Summaries = document.getElementsByTagName('summary');
    for (var i = 0; i < Summaries.length; i++) {
        details_shim(Summaries[i]);
    }
};

// Run details_shim.init() when the page loads
window.addEventListener
    ? window.addEventListener('load', details_shim.init, false)
    : window.attachEvent && window.attachEvent('onload', details_shim.init)
;
// JavaScript END