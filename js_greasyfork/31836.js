// ==UserScript==
// @name         Line sticker downloader
// @version      0.0.1
// @description  Just download sticker from Line
// @author       EThaiZone
// @match        https://store.line.me/stickershop/product/*
// @grant        none
// @namespace https://greasyfork.org/users/3747
// @downloadURL https://update.greasyfork.org/scripts/31836/Line%20sticker%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/31836/Line%20sticker%20downloader.meta.js
// ==/UserScript==
(function($) {
    'use strict';

    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };
    
    function checkStatus(url, callback) {
        $.ajax({ cache: false,
                url: url,
                success: function (data) {
                    callback(200);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    callback(xhr.status);
                }
               });
    }

    function createButton(text, url, filename, color) {
        if (! url) {
            url = "#";
            filename = "";
            color = '375667';
        } else {
            url = `href="` + url + `"`;
            filename = `download="` + filename + `.zip" title="Click right to save as for proper filename."`;
        }
        
        if (! color) {
            color = '00a4ff';
        }
        

        var buttonHtml = `
  <a class="MdBtn01 mdBtn01" ` + url + filename + ` style="
    z-index: 9999;
    background-color: #` + color + `;
    padding: 0 10px 0 10px;
    ">
    <span class="mdBtn01Inner">
      <span class="mdBtn01Txt">` + text + `</span>
    </span>
  </a>
  `;

        //appendButton
        $('#btnHolder').prepend(buttonHtml);
    }
    
    var btnHolder = `<div style="
    position: fixed;
    z-index: 9999;
    right: 20px;
    bottom: 20px;
    "
id="btnHolder"
>
    </div>`;
    
    $('body').prepend(btnHolder);

    var matches = window.location.href.match(/stickershop\/product\/([0-9]+)\//);
    var stickID = matches[1];
    
    var productMetaUrl = 'https://sdl-stickershop.line.naver.jp/stickershop/v1/product/' + stickID + '/LINEStorePC/productInfo.meta';
    var animatedUrl = 'http://dl.stickershop.line.naver.jp/products/0/0/1/' + stickID + '/iphone/stickerpack@2x.zip';
    var normalUrl = 'http://dl.stickershop.line.naver.jp/products/0/0/1/' + stickID + '/iphone/stickers@2x.zip';

    $.ajax({ cache: false,
            url: productMetaUrl,
            success: function (data) {
                if (! data.stickerResourceType) {
                    createButton("Sticker meta has changed format.");
                } else {
                    var filename = stickID;
                    if (typeof data.title.en === "string") {
                        filename = stickID + "_" + data.title.en;
                        filename = filename.trim().replace(/[^a-z0-9]/gi, ' ').replaceAll(/\s+/, '_').toLowerCase().trim();
                    }
                    if (data.stickerResourceType !== 'STATIC') {
                        createButton("Download (Animated)", animatedUrl, filename + "_animated", '79ce43');
                    }
                    
                    createButton("Download (Normal)", normalUrl, filename);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                createButton("Can't fetch Sticker meta.");
            }
           });

})(jQuery);