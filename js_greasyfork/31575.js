// ==UserScript==
// @name         line-sticker-to-zip
// @name:ja         line-sticker-to-zip
// @name:en         line-sticker-to-zip
// @version      0.0.1
// @description  Pack all line-stickers to one zip file
// @description:ja  Pack all line-stickers to one zip file
// @description:en  Pack all line-stickers to one zip file
// @author       freypy
// @match        https://store.line.me/stickershop/product/*
// @grant        none
// @require      https://cdn.bootcss.com/jszip/3.1.3/jszip.js
// @namespace https://greasyfork.org/users/11647
// @downloadURL https://update.greasyfork.org/scripts/31575/line-sticker-to-zip.user.js
// @updateURL https://update.greasyfork.org/scripts/31575/line-sticker-to-zip.meta.js
// ==/UserScript==
(function($) {
    'use strict';
    var buttonHtml = `
  <a class="MdBtn01 mdBtn01" id="line-sticker-downloader-button" style="
    position: fixed;
    z-index: 9999;
    right: 30px;
    bottom: 0;
    background-color:#ff8cd9;
    ">
    <span class="mdBtn01Inner">
      <span class="mdBtn01Txt">打包贴图</span>
    </span>
  </a>
  `;
    var zip = new JSZip();
    var stickers = zip.folder("stickers");
    var imgs = [];
    // function onclick() {
    // console.log('&', $);
    (function initFileSaver() {
        /* FileSaver.js
         * A saveAs() FileSaver implementation.
         * 1.3.2
         * 2016-06-16 18:25:19
         *
         * By Eli Grey, http://eligrey.com
         * License: MIT
         *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
         */

        /*global self */
        /*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

        /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

        var saveAs = saveAs || (function(view) {
            "use strict";
            // IE <10 is explicitly unsupported
            if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
                return;
            }
            var
                doc = view.document
                // only get URL when necessary in case Blob.js hasn't overridden it yet
                ,
                get_URL = function() {
                    return view.URL || view.webkitURL || view;
                },
                save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
                can_use_save_link = "download" in save_link,
                click = function(node) {
                    var event = new MouseEvent("click");
                    node.dispatchEvent(event);
                },
                is_safari = /constructor/i.test(view.HTMLElement),
                is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
                throw_outside = function(ex) {
                    (view.setImmediate || view.setTimeout)(function() {
                        throw ex;
                    }, 0);
                },
                force_saveable_type = "application/octet-stream"
                // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
                ,
                arbitrary_revoke_timeout = 1000 * 40 // in ms
                ,
                revoke = function(file) {
                    var revoker = function() {
                        if (typeof file === "string") { // file is an object URL
                            get_URL().revokeObjectURL(file);
                        } else { // file is a File
                            file.remove();
                        }
                    };
                    setTimeout(revoker, arbitrary_revoke_timeout);
                },
                dispatch = function(filesaver, event_types, event) {
                    event_types = [].concat(event_types);
                    var i = event_types.length;
                    while (i--) {
                        var listener = filesaver["on" + event_types[i]];
                        if (typeof listener === "function") {
                            try {
                                listener.call(filesaver, event || filesaver);
                            } catch (ex) {
                                throw_outside(ex);
                            }
                        }
                    }
                },
                auto_bom = function(blob) {
                    // prepend BOM for UTF-8 XML and text/* types (including HTML)
                    // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
                    if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                        return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type });
                    }
                    return blob;
                },
                FileSaver = function(blob, name, no_auto_bom) {
                    if (!no_auto_bom) {
                        blob = auto_bom(blob);
                    }
                    // First try a.download, then web filesystem, then object URLs
                    var
                        filesaver = this,
                        type = blob.type,
                        force = type === force_saveable_type,
                        object_url, dispatch_all = function() {
                            dispatch(filesaver, "writestart progress write writeend".split(" "));
                        }
                        // on any filesys errors revert to saving with object URLs
                        ,
                        fs_error = function() {
                            if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                                // Safari doesn't allow downloading of blob urls
                                var reader = new FileReader();
                                reader.onloadend = function() {
                                    var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                                    var popup = view.open(url, '_blank');
                                    if (!popup) view.location.href = url;
                                    url = undefined; // release reference before dispatching
                                    filesaver.readyState = filesaver.DONE;
                                    dispatch_all();
                                };
                                reader.readAsDataURL(blob);
                                filesaver.readyState = filesaver.INIT;
                                return;
                            }
                            // don't create more object URLs than needed
                            if (!object_url) {
                                object_url = get_URL().createObjectURL(blob);
                            }
                            if (force) {
                                view.location.href = object_url;
                            } else {
                                var opened = view.open(object_url, "_blank");
                                if (!opened) {
                                    // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                                    view.location.href = object_url;
                                }
                            }
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                            revoke(object_url);
                        };
                    filesaver.readyState = filesaver.INIT;

                    if (can_use_save_link) {
                        object_url = get_URL().createObjectURL(blob);
                        setTimeout(function() {
                            save_link.href = object_url;
                            save_link.download = name;
                            click(save_link);
                            dispatch_all();
                            revoke(object_url);
                            filesaver.readyState = filesaver.DONE;
                        });
                        return;
                    }

                    fs_error();
                },
                FS_proto = FileSaver.prototype,
                saveAs = function(blob, name, no_auto_bom) {
                    return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
                };
            // IE 10+ (native saveAs)
            if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
                return function(blob, name, no_auto_bom) {
                    name = name || blob.name || "download";

                    if (!no_auto_bom) {
                        blob = auto_bom(blob);
                    }
                    return navigator.msSaveOrOpenBlob(blob, name);
                };
            }

            FS_proto.abort = function() {};
            FS_proto.readyState = FS_proto.INIT = 0;
            FS_proto.WRITING = 1;
            FS_proto.DONE = 2;

            FS_proto.error =
                FS_proto.onwritestart =
                FS_proto.onprogress =
                FS_proto.onwrite =
                FS_proto.onabort =
                FS_proto.onerror =
                FS_proto.onwriteend =
                null;

            return saveAs;
        }(
            typeof self !== "undefined" && self ||
            typeof window !== "undefined" && window ||
            this.content
        ));
        // `self` is undefined in Firefox for Android content script context
        // while `this` is nsIContentFrameMessageManager
        // with an attribute `content` that corresponds to the window

        window.saveAs = saveAs;
    })();

    function getURL() {
        //     var firstAndLastNode = Array.prototype.slice.call($('ul.FnSticker_animation_list_img li:first-child span,ul.FnSticker_animation_list_img li:last-child span'));

        var firstAndLastNode = Array.prototype.slice.call($('ul.mdCMN09Ul li:first-child span,ul.mdCMN09Ul li:last-child span'));
        var prefix = ""; //url前缀
        var extension = ".png";
        // console.log(firstAndLastNode);
        firstAndLastNode.forEach(function(value, index, array) {
            var backgroundImage = value.style.backgroundImage;
            // lastIndex = backgroundImage.lastIndexOf('/');

            var patern = new RegExp(/url\("(.*\/)(\d+)\/.*\/.*(\.[a-z]+);/);
            var r = patern.exec(backgroundImage);
            //前缀
            prefix = r[1]; //前缀
            //id
            firstAndLastNode[index] = r[2];
            //扩展名
            extension = r[3];
        });
        if (firstAndLastNode.length <= 1) {
            console.error('No Matched Nodes');
            return;
        }
        var patern = new RegExp(/.*\/(\d+)\/.*\/.*(\.[a-z]+)/);


        return {
            first: Number.parseInt(firstAndLastNode[0]),
            last: Number.parseInt(firstAndLastNode[1]),
            prefix: prefix,
            extension: extension
        };
    }

    function download(url, callback) {
        console.log('Start download!');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                //this.response is what you're looking for
                callback(this.response);
            }
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    var urls = getURL();
    if (!urls) {
        return;
    }

    function selectSingle(xpath_exp) {
        return document.evaluate(xpath_exp, document, null,
            XPathResult.ANY_TYPE,
            null).iterateNext();
    }
    //is Downloading
    var isDownloading = false;

    //appendButton
    $('body').prepend(buttonHtml);
    var title = selectSingle('//*[@id=\"FnStickerDetail\"]/div[1]/div[1]/div[2]/h3').textContent;

    $('#line-sticker-downloader-button').click(function(event) {
        zip = new JSZip();
        stickers = zip.folder("stickers");
        imgs = [];

        if (isDownloading) return;
        var $button = $(this);
        isDownloading = true;

        $button.find('.mdBtn01Txt').text('下载中');
        (Promise.resolve(urls))
        .then(function(ids) {
                if (ids.first > ids.last) {
                    var temp = first;
                    first = last;
                    last = temp;
                }
                var promiseArray = [];
                for (var i = ids.first; i <= ids.last; i++) {
                    // console.log(ids.prefix + i + "/android/sticker.png");
                    (function(i) {
                        var promise = (new Promise(function(resolve, reject) {
                                download(ids.prefix + i + "/android/sticker.png", function(blob) {
                                    resolve(blob);
                                });
                            }))
                            .then(function(blob) {
                                imgs.push([i, blob]);
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                        promiseArray.push(promise);
                    })(i);
                }
                return Promise.all(promiseArray);
            })
            .then(function() {
                for (var v in imgs) {
                    stickers.file(imgs[v][0] + '.png', imgs[v][1], { binary: true });
                }
                try {
                    console.log('Packing stickers png file to zip...');
                    zip.generateAsync({ type: "blob" }).then(function(content) {
                        var title = selectSingle('//*[@id=\"FnStickerDetail\"]/div[1]/div[1]/div[2]/h3').textContent;
                        console.log('Save as ' + title, zip + '.zip');
                        saveAs(content, title + ".zip");
                    });
                } catch (error) {
                    console.log(error);
                }
                $button.find('.mdBtn01Txt').text('打包完毕');
                setTimeout(function() {
                    $button.find('.mdBtn01Txt').text('打包贴图');
                }, 3000);
            })
            .catch(function(err) {
                $button.find('.mdBtn01Txt').text('下载错误!');
                console.log(err);
            })
            .then(function() {
                isDownloading = false;
            });

    });

})(jQuery);