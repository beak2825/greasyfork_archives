// ==UserScript==
// @name         XuetangX-Transcipt
// @namespace    https://git.panda2134.site/panda_2134/XuetangX-Transcript
// @version      0.2.1
// @description  provide transcript download for xuetangx
// @author       panda_2134
// @match        *://*.xuetangx.com/courses/*/courseware/*/*/
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/390544/XuetangX-Transcipt.user.js
// @updateURL https://update.greasyfork.org/scripts/390544/XuetangX-Transcipt.meta.js
// ==/UserScript==



(function() {
        'use strict';
    $("body").on('DOMSubtreeModified', "div.xmodule_display.xmodule_VideoModule", function() {
    setTimeout(function(){
        function heredoc(fn) {
            return fn.toString().split('\n').slice(1,-1).join('\n') + '\n'
        }

        const transcript_tmpl = heredoc(function() {/*
          <li class="video-tracks video-download-button">
              <a href="DOWNLOAD_HREF">下载字幕</a>
              <div class="a11y-menu-container">
                  <a class="a11y-menu-button" href="#" title=".txt">.txt</a>
                  <ol class="a11y-menu-list">
                    <li class="a11y-menu-item">
                        <a class="a11y-menu-item-link" href="#txt" title="字幕 (.txt) 文件" data-value="txt">
                          字幕 (.txt) 文件
                        </a>
                    </li>
                  </ol>
              </div>
          </li>
        */});
        let isVideo = $("a.seq_video").length > 0;
        if(!isVideo) return;

        let urls = window.location.href.split('/');
        let coursename = urls[4];

        let hasSubtitle = $('li.video-download-button').length > 0;
        if(hasSubtitle) return;

        var HTML = transcript_tmpl.replace('DOWNLOAD_HREF',
                                           '/' + urls[3] + '/' + coursename + '/xblock/' + $('div.vert.vert-0').attr('data-id')
                                           + '/handler/transcript/download');

        if($('.wrapper-downloads').html().length > 35) return;

        var $download = $('.wrapper-downloads').html(HTML),
            $container = $download.find(".video-tracks .a11y-menu-container"),
            $button = $download.find(".a11y-menu-button").on("click", function(event) {
                event.preventDefault()
            });
        $container.on({
            mouseover: function() {
                $(this).addClass("open")
            },
            mouseout: function() {
                $(this).removeClass("open")
            }
        })
    }, 800)}
                )
})();