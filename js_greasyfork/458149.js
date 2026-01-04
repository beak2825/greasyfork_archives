// ==UserScript==
// @name         TikTok 视频链接获取用户账号名&文案
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  复制 tiktok 用户名&文案
// @author       helloworld
// @match        https://www.tiktok.com/@*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at       document-end
// @resource    jqueryBaseCSS https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/themes/base/jquery-ui.min.css
// @resource    jqueryToastCSS https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.css
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @downloadURL https://update.greasyfork.org/scripts/458149/TikTok%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E8%B4%A6%E5%8F%B7%E5%90%8D%E6%96%87%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/458149/TikTok%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E8%B4%A6%E5%8F%B7%E5%90%8D%E6%96%87%E6%A1%88.meta.js
// ==/UserScript==


var newCSS = GM_getResourceText ("jqueryToastCSS");
GM_addStyle (newCSS);


(() => {
  "use strict";

  console.log('插件代码开始');


  function copyToClipboard(e, text) {
    if(!text) return

    var copy = function (e) {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', text);
      } else if (window.clipboardData) {
        window.clipboardData.setData('Text', text);
      }
    }
    window.addEventListener('copy', copy);
    document.execCommand('copy');
    window.removeEventListener('copy', copy);
  }


  $(function(){
    console.log("jquery版本号：" + $.fn.jquery);
    $('body').append('<button id="getUsernameBtn" style="height: 48px;position: fixed; z-index: 100000; top: 10px;left: 750px;cursor: pointer;background: red;color: white;border: none;border-radius: 5px;box-shadow: 1px 1px 10px black;">复制用户账号</button>')



    function getVideoIdFromURL(videoId)
    {
        let url = document.location.href
        let regexp = /https:\/\/www\.tiktok\.com\/@.*\/video\/(\d+)/
        let matchs = url.match(regexp)
        let currentId = matchs ? matchs[1] : ''
        return currentId
    }


    function getCurrVideoInfoFromUNIVERSAL_DATA_FOR_REHYDRATION()
    {
        var text = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__')[0].innerText
        if (!text.length) {
            return;
        }

        var json = JSON.parse(text)
        console.log(json)

        var videoInfo = json["__DEFAULT_SCOPE__"]["webapp.video-detail"]["itemInfo"]["itemStruct"]
        return videoInfo
    }


    

    function getNickname() {

      let username = $('[data-e2e=browser-nickname]>span')[0]?.innerText
      console.log(username)

      if(!username) {

        // 尝试用 UNIVERSAL_DATA_FOR_REHYDRATION 里提取
        let videoInfo = getCurrVideoInfoFromUNIVERSAL_DATA_FOR_REHYDRATION()


        if(getVideoIdFromURL() !== videoInfo.id) {
            console.log(getVideoIdFromURL(), "url 有变")

              $.toast({
                heading: 'url 有变',
                text: '请刷新当前页面，再点击按钮',
                showHideTransition: 'slide',
                icon: 'error',
                hideAfter: 5000,
            })

            return '';
        }

        username = videoInfo.author.nickname
        console.log(username)
      }

      return username
    }


    $('#getUsernameBtn').on('click', function(e){
      console.log('点击我干嘛？')

        let username = getNickname()
        copyToClipboard(e, username)

        $.toast({
            heading: '复制成功',
            text: username,
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: 5000,
        })
    })
    
    


    function getDescription() {

      let description = $('[data-e2e=browse-video-desc]')[0]?.innerText
      console.log(description)

      if(!description) {

        // 尝试用 UNIVERSAL_DATA_FOR_REHYDRATION 里提取
        let videoInfo = getCurrVideoInfoFromUNIVERSAL_DATA_FOR_REHYDRATION()


        if(getVideoIdFromURL() !== videoInfo.id) {
            console.log(getVideoIdFromURL(), "url 有变")

              $.toast({
                heading: 'url 有变',
                text: '请刷新当前页面，再点击按钮',
                showHideTransition: 'slide',
                icon: 'error',
                hideAfter: 5000,
            })

            return '';
        }

        description = videoInfo.desc
        console.log(description)
      }



      return description
    }
    
    

    $('body').append('<button id="getDescriptionBtn" style="height: 48px;position: fixed; z-index: 100000; top: 10px;left: 862px;cursor: pointer;background: purple;color: white;border: none;border-radius: 5px;box-shadow: 1px 1px 10px black;">复制文案内容</button>')


    $('#getDescriptionBtn').on('click', function(e){
      console.log('点击我干吖？')

      let description = getDescription()

        copyToClipboard(e, description)

        $.toast({
            heading: '复制成功',
            text: description,
            showHideTransition: 'slide',
            icon: 'success',
            hideAfter: 5000,
        })
    })
  })

})();

