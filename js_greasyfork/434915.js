// ==UserScript==
// @name         色图查重插件
// @namespace    esetu
// @version      0.3.6
// @description  根据本地图片标记重复的图片背景红色
// @author       erinilis
// @include      *://yande.re/*
// @include      *://konachan.com/*
// @include      *://gelbooru.com/index.php?page=post*
// @include      *://danbooru.donmai.us/*
// @include      *://chan.sankakucomplex.com/*
// @include      *://idol.sankakucomplex.com/*
// @include      *://rule34.xxx/index.php?page=post*
// @include      *://xbooru.com/index.php*
// @include      *://safebooru.donmai.us/posts*
// @match        *://*.iwara.tv/*
// @exclude      *://staging.iwara.tv/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434915/%E8%89%B2%E5%9B%BE%E6%9F%A5%E9%87%8D%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/434915/%E8%89%B2%E5%9B%BE%E6%9F%A5%E9%87%8D%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}


(function () {
  "use strict";

  let SERVER_URL = "http://127.0.0.1:7768/"


  let check_md5 = function (md5, element) {
      $.getJSON(SERVER_URL + 'check_md5/' + md5).then((result)=>{
          if(result.retcode == 0) {
              $(element).css("backgroundColor", "darkred")
              // .append(`<a href="file://${result.file}" target="_blank" style="float: left;word-break: break-all;">${result.file}</a>`)
          }
      })
  }

  let handler_arr = function (arr, callback) {
      for (let i = 0; i < arr.length; i++) {
          let src = $("img", arr[i]).attr("src");
          check_md5(callback(src), arr[i])
      }
  }

  let url2md5 = function (url) {
      let tmp = url.split("/");
      let filename = tmp[tmp.length - 1].split("?")[0].replace(/\..+/, "");
      let regex = /thumbnail_(\w+)/gm;
      let md5 = regex.exec(filename)
      return md5 ? md5[1] : filename
  }

  let gelbooru_hanlder = function (arr) { 
      console.log('gelbooru_hanlder')
      handler_arr(arr, function (src) {
          let regex = /thumbnail_(\w+)/gm;
          let md5 = regex.exec(src)
          if (md5) {
              return md5[1]
          }
      })
  }

  let sankakucomplex_handler = function (arr) {
      console.log('sankakucomplex_handler')
      handler_arr(arr, url2md5)
  }

  let danbooru_handler = function (arr) {
      console.log('danbooru_handler')
      handler_arr(arr, url2md5)
  }

  let gelbooru_list = $(".thumbnail-preview");
  let sankakucomplex_list = $(".thumb")
  let danbooru_list = $('.post-preview')

  if (gelbooru_list?.length) {
      gelbooru_hanlder(gelbooru_list)
  } else if (sankakucomplex_list?.length) {
      sankakucomplex_handler(sankakucomplex_list)
  } else if (danbooru_list?.length) {
      danbooru_handler(danbooru_list)
  }
  
  
  // iwara
  let iwara = /iwara.tv\/?(\w+)?/gm;
  let iwara_match = iwara.exec(window.location.href);
  
  if (iwara_match) {
      console.log('iwara video page')
      waitForKeyElements (
        ".videoTeaser__thumbnail", 
          function () {
            let videos = $(".videoTeaser__thumbnail")
            let md5_regex = /\/video\/(\w+)/;

            for (let i = 0; i < videos.length; i++) {
                let src = $(videos[i]).attr("href");
                let md5 = md5_regex.exec(src)[1]
                check_md5(md5, videos[i].parentElement.parentElement)
             }
          }
    );
      
  }
    
    
  //////////////////
  // 超分辨率插件
  
    let url = window.location.href;

    let default_tool_html = function (orig_img_title, orig_img_url) {
        return `
        <style>
            .post-tools {
                padding: 0px 0px 10px 10px;
            }
            .post-tools p {
                margin-left: 5px;
            }
            .ncnn_button {
                margin-left: 5px;
                margin-top: 5px;
                color: #ff761c;
            }
            .ncnn_button:hover {
                background-color: #ffffe0;
            }
            #ncnn_result {
                padding: 0px 0px 10px 10px;
            }
        </style>
        <script application/javascript>
        $(function() {
            $.getJSON('${SERVER_URL}ncnn_config').then((ncnn_config) => {
                window.ncnn_config = ncnn_config
                let ncnn_modal = $("#ncnn_model")
                for (let name in ncnn_config) {
                    let info = ncnn_config[name]
                    ncnn_modal.append('<option value="' + name + '">' + info.title + '</option>')
                }

                window.on_change_ncnn_model = function () {
                    let ncnn_modal = $("#ncnn_model").val()
                    let ncnn_buttons = $("#ncnn_buttons")
                    ncnn_buttons.html('')
                    let scales = window.ncnn_config[ncnn_modal].scales.split(" ")
                    for (let key in scales) {
                        let scale = scales[key]
                        if (!isNaN(scale)) {
                            ncnn_buttons.append('<button class="ncnn_button" onclick="window.ncnn_vulkan(' + scale + ')">超分放大 x' + scale + '</button>')
                        }
                    }
                }

                window.on_change_ncnn_model()

                window.ncnn_vulkan = function (scale) {
                    $(".ncnn_button").attr("disabled", true)
                    let ncnn_modal = $("#ncnn_model").val()
                    
                    $.post('${SERVER_URL}ncnn_vulkan', data={scale, modal: ncnn_modal, url: "${orig_img_url}"}).then((result) => {
                        let ncnn_status = $("#ncnn_status")
                        let ncnn_info = $("#ncnn_info")
                        ncnn_status.html('状态: ' + result.msg)
                        ncnn_info.html('')
                        if (result.retcode == 0) {
                            let wait = window.setInterval(function () {
                                $.getJSON('${SERVER_URL}get_ncnn_vulkan_status/' + result.task_id).then((result) => {
                                    if (result.retcode == 0) {
                                        ncnn_status.html('状态: ' + result.msg)
                                        $(".ncnn_button").attr("disabled", false)
                                        if (result?.info) {
                                            window.clearTimeout(wait)
                                            ncnn_info.html('文件名: ' + result.info.name + '<br>文件大小: ' + result.info.size + '<br><a href=${SERVER_URL}' + 'ncnn_result_image/' + result.info.name + ' target="_blank">点击查看 ' + result.info.width + 'x' + result.info.height + ' (' + result.info.format + ')' + '</a>')
                                        }
                                    }
                                })
                            }, 1000)
                            
                        }
                    })
                }
            })

        });
        </script>
        <div class="post-tools">
            <p><a href="${orig_img_url}" target="_blank">查看原图: ${orig_img_title}</a>
                <label for="ncnn_model" style="margin-left: 5px;">超分模型:</label>
                <select id="ncnn_model" style="padding: unset;" onchange="window.on_change_ncnn_model()" ></select>
            </p>
            <div id="ncnn_buttons">
            </div>
        </div>
        <div id="ncnn_result">
            <p id="ncnn_status"></p>
            <div id="ncnn_info"></div>
        </div>
        `
    }
    
    // sankakucomplex
    let sankakucomplex = /sankakucomplex.com(\/.+)?\/post\/show.+/gm;
    let sankakucomplex_match = sankakucomplex.exec(url);
    if (sankakucomplex_match) {
        console.log('sankakucomplex image page')
        let highres = $("#highres")
        let orig_img_title = highres.html()
        let orig_img_url = 'https:' + highres.attr("href")

        let post_content = $("#post-content")

        post_content.before(default_tool_html(orig_img_title, orig_img_url))

    }

    // yande.re
    let yandere = /yande.re\/post\/show\/(\d+)/gm;
    let yandere_match = yandere.exec(url);

    // konachan
    let konachan = /konachan.com\/post\/show\/(\d+)/gm;
    let konachan_match = konachan.exec(url);

    if (yandere_match || konachan_match) {
        console.log('yande image page')
        let image = $("#image")
        let orig_img_width = image.attr("large_width")
        let orig_img_height = image.attr("large_height")
        let orig_img_url = $("#png").attr("href") || $("#highres").attr("href")
        let orig_img_size_regex = /.+(\(.+)/gm
        let orig_img_size = orig_img_size_regex.exec($("#png").html() || $("#highres").html())[1]
        let orig_img_title = orig_img_width + 'x' + orig_img_height + ' ' + orig_img_size

        image.before(default_tool_html(orig_img_title, orig_img_url))
    }

    // gelbooru
    let gelbooru = /gelbooru.com\/index.php\?page=post(\/.+)?/gm;
    let gelbooru_match = gelbooru.exec(url);

    //danbooru
    let danbooru = /danbooru.donmai.us\/posts\/(\d+)/gm;
    let danbooru_match = danbooru.exec(url);

    // safebooru
    let safebooru = /safebooru.donmai.us\/posts(\/.+)?/gm;
    let safebooru_match = safebooru.exec(url);

    if (gelbooru_match || danbooru_match || safebooru_match) {
        console.log('gelbooru image page')
        let image = $(".image-container")[0]
        let orig_img_width = image.getAttribute("data-width")
        let orig_img_height = image.getAttribute("data-height")
        let orig_img_url = $('[rel="noopener"]').attr('href') || $("#highres").attr('href') || image.getAttribute("data-file-url")
        let orig_img_ext = image.getAttribute("data-file-ext")?.substring(1)
        if (!orig_img_ext) {
            orig_img_ext = orig_img_url.split('.').pop()
        }
        let orig_img_title = orig_img_width + 'x' + orig_img_height + ' (' + orig_img_ext.toUpperCase() + ')'
        $(".image-container").before(default_tool_html(orig_img_title, orig_img_url))
    }

    // rule34
    let rule34 = /rule34.xxx\/index.php\?page=post(\/.+)?/gm;
    let rule34_match = rule34.exec(url);

    // xbooru
    let xbooru = /xbooru.com\/index.php\?page=post(\/.+)?/gm;
    let xbooru_match = xbooru.exec(url);
    
    if (rule34_match || xbooru_match) {
        console.log('rule34 image page')
        let image = $("#image")
        let orig_img_width = image.attr("width")
        let orig_img_height = image.attr("height")
        let orig_img_url = $("[property='og:image']").attr("content") || image.attr("src")
        let orig_img_title = orig_img_width + 'x' + orig_img_height + ' (' + orig_img_url.split('.').pop().toUpperCase().substring(0,3) + ')'
        image.before(default_tool_html(orig_img_title, orig_img_url))
    }
})();