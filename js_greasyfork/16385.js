// ==UserScript==
// @author         Aq
// @name           DsModDownloader
// @namespace      https://github.com/aqgithub/steamdl/blob/master/DsModDownloader.user.js
// @description    DS/DST mods directly downloader for tieba & steam
// @include        *steamcommunity.com/sharedfiles/filedetails/?id=*
// @include        *tieba.baidu.com/p/*
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_openInTab
// @require        http://code.jquery.com/jquery-1.12.0.min.js
// @supportURL     https://github.com/aqgithub/steamdl/issues
// @version        0.1.2
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/16385/DsModDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/16385/DsModDownloader.meta.js
// ==/UserScript==

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.1.20151003
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */
/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
var saveAs = saveAs || (function (view) {
  'use strict';
  // IE <10 is explicitly unsupported
  if (typeof navigator !== 'undefined' && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return;
  }
  var
  doc = view.document
  // only get URL when necessary in case Blob.js hasn't overridden it yet
  ,
  get_URL = function () {
    return view.URL || view.webkitURL || view;
  },
  save_link = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a'),
  can_use_save_link = 'download' in save_link,
  click = function (node) {
    var event = new MouseEvent('click');
    node.dispatchEvent(event);
  },
  is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent),
  webkit_req_fs = view.webkitRequestFileSystem,
  req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
  throw_outside = function (ex) {
    (view.setImmediate || view.setTimeout) (function () {
      throw ex;
    }, 0);
  },
  force_saveable_type = 'application/octet-stream',
  fs_min_size = 0
  // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
  // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
  // for the reasoning behind the timeout and revocation flow
  ,
  arbitrary_revoke_timeout = 500 // in ms
  ,
  revoke = function (file) {
    var revoker = function () {
      if (typeof file === 'string') { // file is an object URL
        get_URL().revokeObjectURL(file);
      } else { // file is a File
        file.remove();
      }
    };
    if (view.chrome) {
      revoker();
    } else {
      setTimeout(revoker, arbitrary_revoke_timeout);
    }
  },
  dispatch = function (filesaver, event_types, event) {
    event_types = [
    ].concat(event_types);
    var i = event_types.length;
    while (i--) {
      var listener = filesaver['on' + event_types[i]];
      if (typeof listener === 'function') {
        try {
          listener.call(filesaver, event || filesaver);
        } catch (ex) {
          throw_outside(ex);
        }
      }
    }
  },
  auto_bom = function (blob) {
    // prepend BOM for UTF-8 XML and text/* types (including HTML)
    if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob(['﻿',
      blob], {
        type: blob.type
      });
    }
    return blob;
  },
  FileSaver = function (blob, name, no_auto_bom) {
    if (!no_auto_bom) {
      blob = auto_bom(blob);
    }
    // First try a.download, then web filesystem, then object URLs

    var
    filesaver = this,
    type = blob.type,
    blob_changed = false,
    object_url,
    target_view,
    dispatch_all = function () {
      dispatch(filesaver, 'writestart progress write writeend'.split(' '));
    }
    // on any filesys errors revert to saving with object URLs
    ,
    fs_error = function () {
      if (target_view && is_safari && typeof FileReader !== 'undefined') {
        // Safari doesn't allow downloading of blob urls
        var reader = new FileReader();
        reader.onloadend = function () {
          var base64Data = reader.result;
          target_view.location.href = 'data:attachment/file' + base64Data.slice(base64Data.search(/[,;]/));
          filesaver.readyState = filesaver.DONE;
          dispatch_all();
        };
        reader.readAsDataURL(blob);
        filesaver.readyState = filesaver.INIT;
        return;
      }
      // don't create more object URLs than needed

      if (blob_changed || !object_url) {
        object_url = get_URL().createObjectURL(blob);
      }
      if (target_view) {
        target_view.location.href = object_url;
      } else {
        var new_tab = view.open(object_url, '_blank');
        if (new_tab == undefined && is_safari) {
          //Apple do not allow window.open, see http://bit.ly/1kZffRI
          view.location.href = object_url
        }
      }
      filesaver.readyState = filesaver.DONE;
      dispatch_all();
      revoke(object_url);
    },
    abortable = function (func) {
      return function () {
        if (filesaver.readyState !== filesaver.DONE) {
          return func.apply(this, arguments);
        }
      };
    },
    create_if_not_found = {
      create: true,
      exclusive: false
    },
    slice
    ;
    filesaver.readyState = filesaver.INIT;
    if (!name) {
      name = 'download';
    }
    if (can_use_save_link) {
      object_url = get_URL().createObjectURL(blob);
      setTimeout(function () {
        save_link.href = object_url;
        save_link.download = name;
        click(save_link);
        dispatch_all();
        revoke(object_url);
        filesaver.readyState = filesaver.DONE;
      });
      return;
    }
    // Object and web filesystem URLs have a problem saving in Google Chrome when
    // viewed in a tab, so I force save with application/octet-stream
    // http://code.google.com/p/chromium/issues/detail?id=91158
    // Update: Google errantly closed 91158, I submitted it again:
    // https://code.google.com/p/chromium/issues/detail?id=389642

    if (view.chrome && type && type !== force_saveable_type) {
      slice = blob.slice || blob.webkitSlice;
      blob = slice.call(blob, 0, blob.size, force_saveable_type);
      blob_changed = true;
    }
    // Since I can't be sure that the guessed media type will trigger a download
    // in WebKit, I append .download to the filename.
    // https://bugs.webkit.org/show_bug.cgi?id=65440

    if (webkit_req_fs && name !== 'download') {
      name += '.download';
    }
    if (type === force_saveable_type || webkit_req_fs) {
      target_view = view;
    }
    if (!req_fs) {
      fs_error();
      return;
    }
    fs_min_size += blob.size;
    req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
      fs.root.getDirectory('saved', create_if_not_found, abortable(function (dir) {
        var save = function () {
          dir.getFile(name, create_if_not_found, abortable(function (file) {
            file.createWriter(abortable(function (writer) {
              writer.onwriteend = function (event) {
                target_view.location.href = file.toURL();
                filesaver.readyState = filesaver.DONE;
                dispatch(filesaver, 'writeend', event);
                revoke(file);
              };
              writer.onerror = function () {
                var error = writer.error;
                if (error.code !== error.ABORT_ERR) {
                  fs_error();
                }
              };
              'writestart progress write abort'.split(' ').forEach(function (event) {
                writer['on' + event] = filesaver['on' + event];
              });
              writer.write(blob);
              filesaver.abort = function () {
                writer.abort();
                filesaver.readyState = filesaver.DONE;
              };
              filesaver.readyState = filesaver.WRITING;
            }), fs_error);
          }), fs_error);
        };
        dir.getFile(name, {
          create: false
        }, abortable(function (file) {
          // delete file if it already exists
          file.remove();
          save();
        }), abortable(function (ex) {
          if (ex.code === ex.NOT_FOUND_ERR) {
            save();
          } else {
            fs_error();
          }
        }));
      }), fs_error);
    }), fs_error);
  },
  FS_proto = FileSaver.prototype,
  saveAs = function (blob, name, no_auto_bom) {
    return new FileSaver(blob, name, no_auto_bom);
  }
  ;
  // IE 10+ (native saveAs)
  if (typeof navigator !== 'undefined' && navigator.msSaveOrOpenBlob) {
    return function (blob, name, no_auto_bom) {
      if (!no_auto_bom) {
        blob = auto_bom(blob);
      }
      return navigator.msSaveOrOpenBlob(blob, name || 'download');
    };
  }
  FS_proto.abort = function () {
    var filesaver = this;
    filesaver.readyState = filesaver.DONE;
    dispatch(filesaver, 'abort');
  };
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
}(typeof self !== 'undefined' && self
|| typeof window !== 'undefined' && window
|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window
if (typeof module !== 'undefined' && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== 'undefined' && define !== null) && (define.amd != null)) {
  define([], function () {
    return saveAs;
  });
}
// FileSaver END //
(function (w, d) {
  var API_GET_PUBLISHED_FILE_DETAILS = 'http://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v0001/';
  var curDomain = - 1; // 1 - tieba, 0 - steam
  var modDling = 0;
  function getDlUrl(modID, $dlButton) {
    GM_xmlhttpRequest({
      method: 'POST',
      url: API_GET_PUBLISHED_FILE_DETAILS,
      data: 'itemcount=1&publishedfileids[0]=' + modID + '&format=json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      onload: function (response) {
        data = $.parseJSON(response.responseText);
        var fileurl = data.response.publishedfiledetails[0].file_url;
        var filename = data.response.publishedfiledetails[0].title + '.zip';
        if (curDomain) {
          if (fileurl) {
            $dlButton.html('<span class="aq_copy_link">复制下载链接</span> | ').addClass('aq_dl_done').attr({
              'aq_file_name': filename,
              'aq_file_link': fileurl
            });
            $dlButton.append($('<a>', {
              href: fileurl,
              download: filename,
              'class': 'aq_dl_btn',
              text: '直接下载'
            })).append(' | <span class="aq_dl_btn_2">重命名并下载(测试)</span>');
          } 
          else {
            $dlButton.html('无法解析，mod可能已被移除');
          }
        } 
        else {
          if (fileurl) {
            $('#aq-steam-dl-btn').on('click', function () {
              window.location.href = fileurl;
            });
            $('#aq-steam-dl-btn-2:not(.aq_dling)').on('click', function () {
              renameThenDl2($(this), fileurl, filename);
            });
            $('#aq-steam-copy-btn').on('click', function () {
              GM_setClipboard(fileurl);
              alert('已复制到剪贴板\n' + fileurl);
            });
          } 
          else {
            $('.game_area_purchase_game>h1>span').text('mod下载地址解析失败，请重新加载页面');
            $('#aq-steam-dl-btn').hide();
            $('#aq-steam-dl-btn-2').hide();
            $('#aq-steam-copy-btn').hide();
          }
        }
      },
      onerror: function (reponse) {
        console.log('err: ' + reponse);
      }
    });
  }
  function dataToBlob(data, mimeString) {
    var buffer = new Int8Array(new ArrayBuffer(data.length));
    for (var i = 0; i < data.length; i++) {
      buffer[i] = data.charCodeAt(i) & 255;
    }
    try {
      return new Blob([buffer], {
        type: mimeString
      });
    } catch (e1) {
      try {
        var BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;
        if (e.name == 'TypeError' && window.BlobBuilder) {
          bb = new BlobBuilder();
          bb.append([buffer.buffer]);
          return bb.getBlob(mimeString);
        } else if (e.name == 'InvalidStateError') {
          return new Blob([buffer.buffer], {
            type: mimeString
          });
        }
      } catch (e2) {
      }
    }
    return null;
  }
  function renameThenDl2($btn, fileurl, filename) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: fileurl,
      'overrideMimeType': 'text/plain; charset=x-user-defined',
      onload: function (d) {
        saveAs(dataToBlob(d.responseText, 'application/zip'), filename);
      }
    })
  }
  function htmlParser() {
    if (d.domain.toLowerCase().indexOf('baidu.com') > 0) {
      curDomain = 1;
      $(d).on('mouseover', '.d_post_content a:not(.aq_link_parsed),.lzl_content_main a:not(.aq_link_parsed)', function (e) {
        var linkToAnyls = $(this).text();
        var pattern = /steamcommunity.com\D*([0-9]{2,15})/i;
        var modID = pattern.exec(linkToAnyls);
        modID && $(this).after('<span class="aq_id aq_ori_link_hide" style="cursor:default;color:blue;margin-left:3px;margin-right:2px">' + modID[1] + '</span>|<span class="aq_dl" style="cursor:pointer;color:red;margin-left:2px;margin-right:2px;">解析中...</span>|<span class="aq_lnk" style="cursor:pointer;color:blue;margin-left:2px;margin-right:3px">转到steam页面</span>').addClass('aq_link_parsed').hide();
        getDlUrl(modID[1], $(this).next().next());
      });
	  $(d).on('click', '.aq_id', function(e) {
		  $idBtn = $(this);
		  if ($idBtn.hasClass('aq_ori_link_hide')) {
			  $idBtn.removeClass('aq_ori_link_hide').prev().show();
		  }
		  else {
			  $idBtn.addClass('aq_ori_link_hide').prev().hide();
		  }
	  });
      $(d).on('click', '.aq_copy_link', function (e) {
        var fileLink = $(this).parent().attr('aq_file_link');
        GM_setClipboard(fileLink);
        alert('已复制到剪贴板\n' + fileLink);
      });
      $(d).on('click', '.aq_dl_btn_2:not(.aq_dling)', function (e) {
        modDling++;
        var $dlButton2 = $(this).addClass('aq_dling');
        var fileurl = $(this).prev().attr('href');
        var filename = $(this).prev().attr('download');
        $dlButton2.text('下载中...0%');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            $dlButton2.text('重新下载(测试)').removeClass('aq_dling');
            modDling--;
            saveAs(this.response, filename);
          }
        };
        xhr.onprogress = function (progress) {
          if (progress.lengthComputable) {
            var percentComplete = Math.ceil(progress.loaded / progress.total * 1000) / 10;
            $dlButton2.text('下载中...' + percentComplete + '%');
          }
        };
        xhr.open('GET', fileurl);
        xhr.responseType = 'blob';
        xhr.send();
      });
      $(d).on('click', '.aq_lnk', function (e) {
        GM_openInTab('http://steamcommunity.com/sharedfiles/filedetails/?id=' + $(this).prev().prev().text());
      });
    } 
    else if (d.domain.toLowerCase().indexOf('steamcommunity.com') > - 1) {
      curDomain = 0;
      var linkToAnyls = d.URL;
      var pattern = /steamcommunity.com\D*([0-9]{2,15})/i;
      var modID = pattern.exec(linkToAnyls);
      var $btnArea = $('.game_area_purchase_game');
      $btnArea.find('h1').remove();
      var $steamDlBtn = $('<a>', {
        'class': 'btn_green_white_innerfade btn_border_2px btn_medium',
        id: 'aq-steam-dl-btn',
        style: 'position: static!important;margin-right: 10px'
      }).html('<span class="subscribeText" style="padding-left: 15px!important"><div class="subscribeOption subscribe selected">下载</div></span>');
      var $steamDlBtn2 = $steamDlBtn.clone().attr({
        id: 'aq-steam-dl-btn-2'
      }).find('div').text('重命名并下载(小型mod)').end();
      var $steamCopyBtn = $steamDlBtn.clone().attr({
        id: 'aq-steam-copy-btn'
      }).find('div').text('复制下载链接').end();
      $('#SubscribeItemBtn').children('div').hide().end().after($steamDlBtn).after($steamCopyBtn).after($steamDlBtn2);
      getDlUrl(modID[1]);
    } 
    else {
    }
  }
  htmlParser();
}) (window, document, undefined);
