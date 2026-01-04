// ==UserScript==
// @name         google origin image download
// @namespace    http://zxctb.top
// @version      0.3
// @description  快速下载谷歌图片搜索原图
// @author       tao
// @include     /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp|imgres)/
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @run-at       document-idle
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/427394/google%20origin%20image%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/427394/google%20origin%20image%20download.meta.js
// ==/UserScript==

(function(){
    'use strict';

    var allImgPanel = $('#islrg').find('.islrc');

    function handleTag(){
      var aTags = allImgPanel.find('div a.wXeWr[data-lanling-mark!=1]');

      function handleOpen(event, url, el){
        event.stopPropagation();
        event.preventDefault();
        el.text('图片地址已访问').css({ 'color': 'blue' });
        window.open(url);
      }

      function handleDownload(event, el){
        if($(el).attr('href')){
          event.stopPropagation();
          event.preventDefault();
        }

        setTimeout(function(){
          if($(el).find('div[data-lanling-mark=1]').length !== 0){
            $(el).find('div[data-lanling-mark=1]').remove();
          }
          var marked = $('<div data-lanling-mark="1" style="position:absolute;top:10px;left:10px;z-index:9999;background:blue;padding:5px;color:#fff;">正在下载 0%</div>');
          $(el).append(marked);
          var url = $(el).attr('href');
          var query = url.split('?')[1];
          var imgParam = query.split('&')[0];
          var imgUrl = unescape(imgParam.split('=')[1]);
          GM_download({
              url: imgUrl,
              name: escape(imgUrl),
              onprogress: function(e){
                var progress = '';
                if(e.totalSize <= 0){
                  progress = ''
                }else{
                  progress = (e.loaded / e.totalSize) * 100;
                }
                marked.text('正在下载...' + progress.toFixed(2) +'%').css({ 'background': 'blue' });
              },
              onerror: function(){
                var tip = $('<div style="text-decoration:underline;">图片地址</div>');
                tip.on('click', (event) => handleOpen(event, imgUrl, tip));

                marked.text('下载失败，请手动保存！').css({ 'background': 'red' });
                marked.append(tip);
              },
              onload: function(){
                marked.text('下载成功').css({ 'background': 'green' });
              }
          });
        });
      }

      aTags.each(function(){
        var downloadBtn = $('<button style="position:absolute;top:10px;right:10px;z-index:9999;">下载</button>');
        downloadBtn.on('click', (event) => handleDownload(event, this));
        $(this).append(downloadBtn);
        $(this).attr('data-lanling-mark', '1');
      })
    }

    var tagBtn = $('<button style="position:fixed;top:0;left:0;z-index:9999;">添加下载按钮</button>');
    tagBtn.on('click', handleTag);
    $('body').append(tagBtn);
})();