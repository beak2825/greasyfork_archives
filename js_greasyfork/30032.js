// ==UserScript==
// @name           导出歌单
// @description  导出虾米 qq歌单为kgl格式 以便导入网易云
// @version        1.1
// @author         糖果君
// @include        http://www.xiami.com/collect/*
// @include        https://y.qq.com/n/yqq/playlist/*
// @run-at         document-end
// @namespace https://greasyfork.org/users/63579
// @downloadURL https://update.greasyfork.org/scripts/30032/%E5%AF%BC%E5%87%BA%E6%AD%8C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/30032/%E5%AF%BC%E5%87%BA%E6%AD%8C%E5%8D%95.meta.js
// ==/UserScript==
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
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
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
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
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
				}
			;
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
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
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

	FS_proto.abort = function(){};
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
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define("FileSaver.js", function() {
    return saveAs;
  });
}


function request(callback, url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onload = function () {
        if (location.host == xiamihost) {
            callback(JSON.parse(this.responseText));
        } else if (location.host == qqhost) {
            callback(JSON.parse(this.responseText.substring(13, this.responseText.length - 1)));
        }
    };
    xhr.send();
}
function check(str) {
    return str.replace(/</g, '&lt;') .replace(/>/g, '&gt;') .replace(/&/g, '&amp;') .replace(/\'/g, '&apos;') .replace(/\"/g, '&quot;');
}
function xiamiXml(listname) {
    var id = location.pathname.match(/([0-9]+)/) [1];
    var url = 'http://www.xiami.com/collect/ajax-get-list?';
    var tp = 1;
    var xml = "<?xml version='1.0' encoding='utf - 8'?><List ListName='xiami-" + listname + "'>";
    for (var p = 1; p < tp + 1; p++) {
        request(function (result) {
            if (result.state == 0)
            {
                tp = result.result.total_page;
                songlist = result.result.data;
                var song;
                for (var i = 0; i < songlist.length; i++)
                {
                    song = songlist[i];
                    xml += '<File><FileName>' +song.artist_name + '-' + song.name + '.mp3</FileName></File>';
                }
            }
        }, url + 'id=' + id + '&p=' + p);
    }
    xml += '</List>';
    return xml;
}
function qqXml(listname) {
    var id = location.pathname.match(/([0-9]+)/) [1];
    var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?';
    var xml = "<?xml version='1.0' encoding='utf - 8'?><List ListName='qq-" + listname + "'>";
    request(function (result) {
        if (result.cdlist)
        {
            var songlist = result.cdlist[0].songlist;
            var song;
            var singername = '';
            var singernum = 1;
            for (var i = 0; i < songlist.length; i++)
            {
                song = songlist[i];
                singernum = song.singer.length;
                if (singernum > 1) {
                    for (var j = 0; j < singernum - 1; j++)
                    {
                        singername += song.singer[j].name + "、";
                    }
                }
                singername += song.singer[singernum - 1].name;
                xml += '<File><FileName>' + check(song.singer[0].name + ' - ' + song.songname) + '.mp3</FileName></File>';
            }
        }
    }, url + 'disstid=' + id + '&utf8=1&type=1');
    xml += '</List>';
    return xml;
}
function XiamiInit(listname) {
    var link = document.createElement('a');
    link.className = 'cd_download';
    link.innerHTML = '<span>导出歌单为kgl</span>';
    link.onclick = function () {
        var kgl = xiamiXml(listname);
        var blob = new Blob([kgl], {
            type: 'text/plain;charset=utf-8'
        });
        saveAs(blob, listname + '.kgl');
    };
    document.getElementsByClassName('dt') [0].appendChild(link);
}
function qqInit(listname) {
    var link = document.createElement('a');
    link.className = 'mod_btn';
    link.innerHTML = '<span>导出歌单为kgl</span>';
    link.onclick = function () {
        var kgl = qqXml(listname);
        var blob = new Blob([kgl], {
            type: 'text/plain;charset=utf-8'
        });
        saveAs(blob, listname + '.kgl');
    };
    document.getElementsByClassName(' data__actions') [0].appendChild(link);
}

var host = location.host;
var listname = document.title.replace('歌单 - 虾米音乐', '') .replace('- QQ音乐 - 听我想听的歌!', '');
var qqhost = 'y.qq.com';
var xiamihost = 'www.xiami.com';


if (host == qqhost)
{
    qqInit(listname);
} else if (host == xiamihost) {
    XiamiInit(listname);
} 