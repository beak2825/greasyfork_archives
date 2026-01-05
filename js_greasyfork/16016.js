// ==UserScript==
// @name         Renren Ad Remover
// @namespace    Ad Remover
// @version      0.1
// @description  Remove ads on renren.com
// @author       X.Zhao
// @match        http://*.renren.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16016/Renren%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/16016/Renren%20Ad%20Remover.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function remover(name, callback) {
    var $ = window.jQuery;
    if (isEmpty($) || isEmpty($(name))) {
        setTimeout(function() {
                remover(name);
            }, 500);
    } else {
        if (isEmpty(callback)) {
            // default callback is clear html content and set "display: none".
            $(name).html('').hide();
        } else {
            callback($(name));
        }
    }
}

function main() {
    remover('.nx-content .advert-box');
    remover('.advert-box.side-item');
    remover('#recommendArea');
    remover('#right-fix-info');
    remover('#huatiBox', function(obj) {
        setInterval(function() {
            obj.hide();
        }, 500);
    });
    remover('.advert-box.advert-box-alien');
    remover('.advert-box.advert-box-drift');
}

main();