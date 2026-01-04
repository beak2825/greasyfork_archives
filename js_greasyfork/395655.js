// ==UserScript==
// @name           Save webtoon for Toptoon
// @description    Save webtoon zip file
// @namespace https://greasyfork.org/users/3920
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20251124141335
// @downloadURL https://update.greasyfork.org/scripts/395655/Save%20webtoon%20for%20Toptoon.user.js
// @updateURL https://update.greasyfork.org/scripts/395655/Save%20webtoon%20for%20Toptoon.meta.js
// ==/UserScript==

(function() {

    function adderror(url, savename) {
        var downbtn = document.createElement('a');
        downbtn.setAttribute('href', url + "&title=" + savename);
        downbtn.setAttribute('download', savename);
        downbtn.setAttribute('style', 'display:block;margin-left:50px;font-size:12pt;');
        downbtn.innerText = savename;

        var savepage = document.getElementById('savepage');
        if (savepage === undefined || savepage === null) {
            savepage = document.createElement('div');
            savepage.setAttribute('id', 'savepage');
            savepage.setAttribute('style', 'width:100%;position:absolute;z-index:1000;margin-top:65px;');
            document.body.parentElement.insertBefore(savepage, document.body);
        }
        savepage.appendChild(downbtn);
    }

    function deferredAddZip(url, filename, zip) {
        var deferred = $.Deferred();
        JSZipUtils.getBinaryContent(url, function(err, data) {
            if (err) {
                adderror(url, filename);
                deferred.reject(err);
            } else {
                zip.file(filename, data, {
                    binary: true
                });
                deferred.resolve(data);
            }
        });
        return deferred;
    }

    downloadToon = function(filename, zipname) {
/*!

JSZipUtils - A collection of cross-browser utilities to go along with JSZip.
<http://stuk.github.io/jszip-utils>

(c) 2014 Stuart Knightley, David Duponchel
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip-utils/master/LICENSE.markdown.

*/
!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.JSZipUtils=e():"undefined"!=typeof global?global.JSZipUtils=e():"undefined"!=typeof self&&(self.JSZipUtils=e())}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var JSZipUtils = {};
// just use the responseText with xhr1, response with xhr2.
// The transformation doesn't throw away high-order byte (with responseText)
// because JSZip handles that case. If not used with JSZip, you may need to
// do it, see https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
JSZipUtils._getBinaryFromXHR = function (xhr) {
    // for xhr.responseText, the 0xFF mask is applied by JSZip
    return xhr.response || xhr.responseText;
};

// taken from jQuery
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

function createActiveXHR() {
    try {
        return new window.ActiveXObject("Microsoft.XMLHTTP");
    } catch( e ) {}
}

// Create the request object
var createXHR = window.ActiveXObject ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function() {
    return createStandardXHR() || createActiveXHR();
} :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;



JSZipUtils.getBinaryContent = function(path, callback) {
    /*
     * Here is the tricky part : getting the data.
     * In firefox/chrome/opera/... setting the mimeType to 'text/plain; charset=x-user-defined'
     * is enough, the result is in the standard xhr.responseText.
     * cf https://developer.mozilla.org/En/XMLHttpRequest/Using_XMLHttpRequest#Receiving_binary_data_in_older_browsers
     * In IE <= 9, we must use (the IE only) attribute responseBody
     * (for binary data, its content is different from responseText).
     * In IE 10, the 'charset=x-user-defined' trick doesn't work, only the
     * responseType will work :
     * http://msdn.microsoft.com/en-us/library/ie/hh673569%28v=vs.85%29.aspx#Binary_Object_upload_and_download
     *
     * I'd like to use jQuery to avoid this XHR madness, but it doesn't support
     * the responseType attribute : http://bugs.jquery.com/ticket/11461
     */
    try {

        var xhr = createXHR();

        if (/\?/.test(path)) path = `${path}&_=${new Date().getTime()}`;
        xhr.open('GET', path, true);

        // recent browsers
        if ("responseType" in xhr) {
            xhr.responseType = "arraybuffer";
        }

        // older browser
        if(xhr.overrideMimeType) {
            xhr.overrideMimeType("text/plain; charset=x-user-defined");
        }

        xhr.onreadystatechange = function(evt) {
            var file, err;
            // use `xhr` and not `this`... thanks IE
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 0) {
                    file = null;
                    err = null;
                    try {
                        file = JSZipUtils._getBinaryFromXHR(xhr);
                    } catch(e) {
                        err = new Error(e);
                    }
                    callback(err, file);
                } else {
                    callback(new Error("Ajax error for " + path + " : " + this.status + " " + this.statusText), null);
                }
            }
        };
        xhr.setRequestHeader("Accept", "*/*");
//        xhr.setRequestHeader('Pragma', no-cache)
//        xhr.setRequestHeader('Cache Control', no-cache)
        xhr.send();

    } catch (e) {
        callback(new Error(e), null);
    }
};

// export
module.exports = JSZipUtils;

// enforcing Stuk's coding style
// vim: set shiftwidth=4 softtabstop=4:

},{}]},{},[1])
(1)
});
;
        var savepage = document.getElementById('savepage');
        if (savepage !== null) {
            savepage.outerHTML = "";
        }

        var page = 1;
        var zip = new JSZip();
        var deferreds = [];

        // find every checked item
        var imglist = document.getElementsByClassName('c_img');
        [].forEach.call(imglist, function(el) {
            var img = el.getElementsByClassName('document_img');
            [].forEach.call(img, function(el) {
                var $this = $(this);
                let url = (el.src || el.getAttribute('data-src'));
                url = url.replace(/^http:/g, "https:");// + "&title=" + encodeURIComponent(filename + '_' + page + '.jpg').replace(/'/g, "%27");

                deferreds.push(deferredAddZip(url, filename + '_' + page + '.jpg', zip));
                ++page;
            });
        });

        // when everything has been downloaded, we can trigger the dl
        $.when.apply($, deferreds).done(function() {
            zip.generateAsync({
                    type: "blob"
                })
                .then(function(content) {
                    // see FileSaver.js
                    saveAs(content, zipname);
                });

            adderror("", "done !");
        }).fail(function(err) {
            adderror("", err);
        });

        return false;
    };


    function start() {
        var bWait = false;
        if (typeof(jQuery) == 'undefined') {
            var jquery = document.createElement('script');
            jquery.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js';
            document.body.appendChild(jquery);
            bWait = true;
        }

        if (typeof(JSZip) == 'undefined') {
            var jscript = document.createElement('script');
            jscript.src = 'https://stuk.github.io/jszip/dist/jszip.js';
            document.body.appendChild(jscript);
            bWait = true;
        }
/*
        if (typeof(JSZipUtils) == 'undefined') {
            var jscript = document.createElement('script');
            jscript.src = 'https://stuk.github.io/jszip-utils/dist/jszip-utils.js';
            document.body.appendChild(jscript);
            bWait = true;
        }
*/
        if (typeof(saveAs) == 'undefined') {
            var jscript = document.createElement('script');
            jscript.src = 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js';
            document.body.appendChild(jscript);
            bWait = true;
        }

        if (bWait) {
            setTimeout(start, 100);
            return;
        }

        var url = document.location.href;
        var filename = "";
        var zipname = "";
        if (/gmtv.aspw/g.test(url)) {
            let title = document.getElementsByClassName('title');
            let maintitle = title[0].textContent;

            let desc = document.getElementsByClassName('desc');
            let ep = desc[0].textContent;

            filename = maintitle + ' ' + ep;
            zipname = maintitle + ' ' + ep + '.zip';
        } else if (/toptoon.com/g.test(url)) {
            let title = document.getElementsByClassName('title');
            let maintitle = title[0].textContent;

            let desc = document.getElementsByClassName('episode_title');
            let ep = desc[0]['childNodes'][0].textContent; //desc[0].textContent;

            let subtitle = "";
            if (desc[0]['childNodes'].length > 1) {
            //var sub = document.getElementsByClassName('episode_subtitle');
                subtitle = desc[0]['childNodes'][1].textContent; //sub[0].textContent;
                subtitle = subtitle.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/%/g, "％");
            }

            filename = maintitle + ' ' + ep + ' ' + subtitle;
            zipname = maintitle + ' ' + ep + '.zip';
        } else {
            return;
        }

        filename = filename.replace(/[\\\/:\*\?"<>\|]/, "_");
        downloadToon(filename, zipname);
    }

    start();
})();