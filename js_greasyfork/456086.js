// ==UserScript==
// @name           Youtube 雙語字幕下載 v13 (中文+任選的一門雙語,比如英語) (v13 開始自動字幕不再支持雙語，自動字幕只能下載翻譯後的中文)
// @include        https://*youtube.com/*
// @author         Cheng Zheng
// @require        https://code.jquery.com/jquery-1.12.4.min.js
// @version        13
// @copyright      Zheng Cheng
// @grant GM_xmlhttpRequest
// @description   字幕格式是 "中文 \n 英語"（\n 是換行符的意思）
// @license       MIT
// @namespace  https://greasyfork.org/users/5711
// @downloadURL https://update.greasyfork.org/scripts/456086/Youtube%20%E9%9B%99%E8%AA%9E%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BC%89%20v13%20%28%E4%B8%AD%E6%96%87%2B%E4%BB%BB%E9%81%B8%E7%9A%84%E4%B8%80%E9%96%80%E9%9B%99%E8%AA%9E%2C%E6%AF%94%E5%A6%82%E8%8B%B1%E8%AA%9E%29%20%28v13%20%E9%96%8B%E5%A7%8B%E8%87%AA%E5%8B%95%E5%AD%97%E5%B9%95%E4%B8%8D%E5%86%8D%E6%94%AF%E6%8C%81%E9%9B%99%E8%AA%9E%EF%BC%8C%E8%87%AA%E5%8B%95%E5%AD%97%E5%B9%95%E5%8F%AA%E8%83%BD%E4%B8%8B%E8%BC%89%E7%BF%BB%E8%AD%AF%E5%BE%8C%E7%9A%84%E4%B8%AD%E6%96%87%29.user.js
// @updateURL https://update.greasyfork.org/scripts/456086/Youtube%20%E9%9B%99%E8%AA%9E%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BC%89%20v13%20%28%E4%B8%AD%E6%96%87%2B%E4%BB%BB%E9%81%B8%E7%9A%84%E4%B8%80%E9%96%80%E9%9B%99%E8%AA%9E%2C%E6%AF%94%E5%A6%82%E8%8B%B1%E8%AA%9E%29%20%28v13%20%E9%96%8B%E5%A7%8B%E8%87%AA%E5%8B%95%E5%AD%97%E5%B9%95%E4%B8%8D%E5%86%8D%E6%94%AF%E6%8C%81%E9%9B%99%E8%AA%9E%EF%BC%8C%E8%87%AA%E5%8B%95%E5%AD%97%E5%B9%95%E5%8F%AA%E8%83%BD%E4%B8%8B%E8%BC%89%E7%BF%BB%E8%AD%AF%E5%BE%8C%E7%9A%84%E4%B8%AD%E6%96%87%29.meta.js
// ==/UserScript==

/*
  友情提示:
    如果本腳本不能使用，有一定概率是因為 jQuery 的 CDN 在你的網路環境下無法載入，
    就是文件頂部的這一句有問題：
    @require        https://code.jquery.com/jquery-1.12.4.min.js

    解決辦法：去網上隨便找一個 jQuery 的 CDN 地址，替換掉這個，比如
    https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.js
    https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js

  作者聯系方式:
    QQ 1003211008
    郵件 guokrfans@gmail.com
    Github@1c7

  使用場景:
    此文件僅針對於 Tampermonkey (Chrome 上的一款插件)
    (意思是需要安裝在 Tampermonkey 里來運行)

  解決什麼問題：
    下載中外雙語的字幕，格式是 中文 \n 外語, \n 是換行符的意思
  
  術語說明：
    auto 自動字幕
    closed 完整字幕 (或者叫人工字幕也可以)

  原理說明: 
    對於"完整字幕", Youtube 返回的時間軸完全一致，因此只需要結合在一起即可，相對比較簡單。
    對於"自動字幕"，中文是一個個句子，英文是一個個單詞，格式不同，時間軸也不同
    因此，會基於中文的句子時間（時間軸），把英文放進去
  
  特別感謝:
    ytian(tianyebj)：解決英文字幕匹配錯誤的問題 (https://github.com/1c7/Youtube-Auto-Subtitle-Download/pull/11)

  備忘:
    如果要把字元串保存下來, 使用: 
    downloadString(srt_string, "text/plain", file_name);

  用於測試的視頻: 
    https://www.youtube.com/watch?v=JfBZfnkg1uM
  

  2021-12-21 把 v12 升級到 v13
    有多名用戶分別在微博，微信，郵件，greasyfork, 四個渠道向我反饋了無法使用問題。
    此時版本是 v12
    測試視頻1
      https://www.youtube.com/watch?v=OWaFPsVa3ig&t=16s (有1個字幕，英語(自動生成))
      綠色下拉菜單里選擇 option "中文 + 英語 (自動生成)" 的確沒有任何反應，無法下載。
      實測發現: 英文字幕長度 284行，中文字幕長度 162行，沒法一一對應，所以出錯了。
    測試視頻2
      https://www.youtube.com/watch?v=3RkhZgRNC1k (有2個字幕，英語（美國），英語(自動生成))
      如果是中文+英語（美國） 那麼兩個都是885行，可以正常下載
      但是 中文+英語（自動生成），英語是937行，中文是471行。
    結論：
      如果是中文+完整字幕，那麼長度是一一對應的。沒問題
      如果是中文+自動生成字幕，那麼長度不一樣，就會有問題。
    解決辦法：
      如果是自動字幕，只下載中文。
      完整字幕不需要做額外修改，保留現在這樣就行，可以正常工作。
*/
(function () {

  // Config
  var NO_SUBTITLE = '無字幕';
  var HAVE_SUBTITLE = '下載雙語字幕 (中文+外語)';
  const NEW_LINE = '\n'
  const BUTTON_ID = 'youtube-dual-lang-downloader-by-1c7-last-update-2020-12-3'
  // Config

  var HASH_BUTTON_ID = `#${BUTTON_ID}`

  // initialize
  var first_load = true; // indicate if first load this webpage or not
  var youtube_playerResponse_1c7 = null; // for auto subtitle
  unsafeWindow.caption_array = []; // store all subtitle

  // trigger when first load
  $(document).ready(function () {
    start();
  });

  // Explain this function: we repeatly try if certain HTML element exist, 
  // if it does, we call init()
  // if it doesn't, stop trying after certain time
  function start() {
    var retry_count = 0;
    var RETRY_LIMIT = 20;
    // use "setInterval" is because "$(document).ready()" still not enough, still too early
    // 330 work for me.
    if (new_material_design_version()) {
      var material_checkExist = setInterval(function () {
        if (document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer').length) {
          init();
          clearInterval(material_checkExist);
        }
        retry_count = retry_count + 1;
        if (retry_count > RETRY_LIMIT) {
          clearInterval(material_checkExist);
        }
      }, 330);
    } else {
      var checkExist = setInterval(function () {
        if ($('#watch7-headline').length) {
          init();
          clearInterval(checkExist);
        }
        retry_count = retry_count + 1;
        if (retry_count > RETRY_LIMIT) {
          clearInterval(checkExist);
        }
      }, 330);
    }
  }

  // trigger when loading new page 
  // (actually this would also trigger when first loading, that's not what we want, that's why we need to use firsr_load === false)
  // (new Material design version would trigger this "yt-navigate-finish" event. old version would not.)
  var body = document.getElementsByTagName("body")[0];
  body.addEventListener("yt-navigate-finish", function (event) {
    if (current_page_is_video_page() === false) {
      return;
    }
    youtube_playerResponse_1c7 = event.detail.response.playerResponse; // for auto subtitle
    unsafeWindow.caption_array = []; // clean up (important, otherwise would have more and more item and cause error)

    // if use click to another page, init again to get correct subtitle
    if (first_load === false) {
      remove_subtitle_download_button();
      init();
    }
  });

  // trigger when loading new page
  // (old version would trigger "spfdone" event. new Material design version not sure yet.)
  window.addEventListener("spfdone", function (e) {
    if (current_page_is_video_page()) {
      remove_subtitle_download_button();
      var checkExist = setInterval(function () {
        if ($('#watch7-headline').length) {
          init();
          clearInterval(checkExist);
        }
      }, 330);
    }
  });

  // return true / false
  // Detect [new version UI(material design)] OR [old version UI]
  // I tested this, accurated.
  function new_material_design_version() {
    var old_title_element = document.getElementById('watch7-headline');
    if (old_title_element) {
      return false;
    } else {
      return true;
    }
  }

  // return true / false
  function current_page_is_video_page() {
    return get_video_id() !== null;
  }

  // return string like "RW1ChiWyiZQ",  from "https://www.youtube.com/watch?v=RW1ChiWyiZQ"
  // or null
  function get_video_id() {
    return getURLParameter('v');
  }

  //https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
  function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
  }

  function remove_subtitle_download_button() {
    $(HASH_BUTTON_ID).remove();
  }

  // 把 console.log 包裝一層, 方便"開啟"/"關閉"
  // 這樣可以在代碼里遺留很多 console.log，實際運行時"關閉"掉不輸出, 調試時"開啟"
  // function logging(...args) {
  //   if(typeof(console) !== 'undefined') {
  //     console.log(...args);
  //   }
  // }

  function init() {
    inject_our_script();
    first_load = false;
  }

  function inject_our_script() {
    var div = document.createElement('div'),
      select = document.createElement('select'),
      option = document.createElement('option'),
      controls = document.getElementById('watch7-headline'); // Youtube video title DIV

    div.setAttribute('style', `display: table; 
margin-top:4px;
border: 1px solid rgb(0, 183, 90); 
cursor: pointer; color: rgb(255, 255, 255); 
border-top-left-radius: 3px; 
border-top-right-radius: 3px; 
border-bottom-right-radius: 3px; 
border-bottom-left-radius: 3px; 
background-color: #00B75A;
`);

    div.id = BUTTON_ID;
    div.title = 'Youtube Subtitle Downloader'; // display when cursor hover

    select.id = 'captions_selector';
    select.disabled = true;
    select.setAttribute('style', `display:block; 
border: 1px solid rgb(0, 183, 90); 
cursor: pointer; 
color: rgb(255, 255, 255); 
background-color: #00B75A;
padding: 4px;
`);

    option.textContent = 'Loading...';
    option.selected = true;
    select.appendChild(option);

    // 下拉菜單里，選擇一項後觸發下載
    select.addEventListener('change', function () {
      download_subtitle(this);
    }, false);

    div.appendChild(select); // put <select> into <div>

    // Put the div into page: new material design
    var title_element = document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer');
    if (title_element) {
      $(title_element[0]).after(div);
    }
    // Put the div into page: old version
    if (controls) {
      controls.appendChild(div);
    }

    load_language_list(select);

    // <a> element is for download
    var a = document.createElement('a');
    a.style.cssText = 'display:none;';
    a.setAttribute("id", "ForSubtitleDownload");
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(a);
  }

  // Trigger when user select <option>
  async function download_subtitle(selector) {
    console.log('進入download_subtitle');
    // if user select first <option>
    // we just return, do nothing.
    if (selector.selectedIndex == 0) {
      return;
    }

    // 核心概念
    // 對於完整字幕而言，英文和中文的時間軸是一致的，只需要一行行的 match 即可

    // 但是對於自動字幕就不是這樣了，"自動字幕的英文"只能拿到一個個單詞的開始時間和結束時間
    // "自動字幕的中文"只能拿到一個個句子
    // 現在的做法是，先拿到中文，處理成 SRT 格式，
    // 然後去拿英文，然後把英文的每個詞，拿去和中文的每個句子的開始時間和結束時間進行對比
    // 如果"英文單詞的開始時間"在"中文句子的開始-結束時間"區間內，那麼認為這個英文單詞屬於這一句中文

    // 2021-8-11 更新
    // 自動字幕的改了，和完整字幕一樣了。

    var caption = caption_array[selector.selectedIndex - 1]; // because first <option> is for display, so index-1 
    var lang_code = caption.lang_code;
    var lang_name = caption.lang_name;

    // 初始化2個變量
    var origin_url = null;
    var translated_url = null;

    // if user choose auto subtitle 
    // 如果用戶選的是自動字幕
    if (caption.lang_code == 'AUTO') {
      origin_url = get_auto_subtitle_xml_url();
      translated_url = origin_url + '&tlang=zh-Hant'
      var translated_xml = await get(translated_url);
      var translated_srt = parse_youtube_XML_to_object_list(translated_xml)
      var srt_string = object_array_to_SRT_string(translated_srt)
      var title = get_file_name(lang_name);
      downloadString(srt_string, "text/plain", title);
  
      // after download, select first <option>
      selector.options[0].selected = true;
      return; // 別忘了 return
    }
    
    // 如果用戶選的是完整字幕
    origin_url = await get_closed_subtitle_url(lang_code)
    translated_url = origin_url + '&tlang=zh-Hant'

    var original_xml = await get(origin_url);
    var translated_xml = await get(translated_url);

    // 根據時間軸融合這倆
    var original_srt = parse_youtube_XML_to_object_list(original_xml)
    var translated_srt = parse_youtube_XML_to_object_list(translated_xml)
    var dual_language_srt = merge_srt(original_srt, translated_srt);

    var srt_string = object_array_to_SRT_string(dual_language_srt)
    var title = get_file_name(lang_name);
    downloadString(srt_string, "text/plain", title);

    // after download, select first <option>
    selector.options[0].selected = true;
  }

  // 把兩個語言的 srt 數組組合起來，
  // 比如把英文和中文的組合起來。
  // 這個函數假設兩個數組的長度是一模一樣的。如果不一樣就會出錯，比如 srt_A 是 284 個，srt_B 是 164 個元素。
  function merge_srt(srt_A, srt_B) {
    var dual_language_srt = [];

    for (let index = 0; index < srt_A.length; index++) {
      const element_A = srt_A[index];
      const element_B = srt_B[index];

      var text = element_B.text + NEW_LINE + element_A.text; // 中文 \n 英文
      var item = {
        startTime: element_A.startTime,
        endTime: element_A.endTime,
        text: text,
      };

      dual_language_srt.push(item);
    }
    return dual_language_srt;
  }


  // Return something like: "(English)How Did Python Become A Data Science Powerhouse?.srt"
  function get_file_name(x) {
    return `(${x})${get_title()}.srt`;
  }

  // Detect if "auto subtitle" and "closed subtitle" exist
  // And add <option> into <select>
  // 加載語言列表
  function load_language_list(select) {
    // auto
    var auto_subtitle_exist = false; // 自動字幕是否存在(默認 false)

    // closed
    var closed_subtitle_exist = false;

    // get auto subtitle
    var auto_subtitle_url = get_auto_subtitle_xml_url();
    if (auto_subtitle_url != false) {
      auto_subtitle_exist = true;
    }

    // if there are "closed" subtitle?
    var captionTracks = get_captionTracks()
    if (captionTracks != undefined && typeof captionTracks === 'object' && captionTracks.length > 0) {
      closed_subtitle_exist = true;
    }

    // if no subtitle at all, just say no and stop
    if (auto_subtitle_exist == false && closed_subtitle_exist == false) {
      select.options[0].textContent = NO_SUBTITLE;
      disable_download_button();
      return false;
    }

    // if at least one type of subtitle exist
    select.options[0].textContent = HAVE_SUBTITLE;
    select.disabled = false;

    var option = null; // for <option>
    var caption_info = null; // for our custom object

    // 自動字幕
    if (auto_subtitle_exist) {
      var auto_sub_name = get_auto_subtitle_name()
      var lang_name = `${auto_sub_name} 翻譯的中文`
      caption_info = {
        lang_code: 'AUTO', // later we use this to know if it's auto subtitle
        lang_name: lang_name // for display only
      };
      caption_array.push(caption_info);

      option = document.createElement('option');
      option.textContent = caption_info.lang_name;
      select.appendChild(option);
    }

    // if closed_subtitle_exist
    if (closed_subtitle_exist) {
      for (var i = 0, il = captionTracks.length; i < il; i++) {
        var caption = captionTracks[i];
        if (caption.kind == 'asr') {
          continue
        }
        let lang_code = caption.languageCode
        let lang_translated = caption.name.simpleText
        var lang_name = `中文 + ${lang_code_to_local_name(lang_code, lang_translated)}`
        caption_info = {
          lang_code: lang_code, // for AJAX request
          lang_name: lang_name, // display to user
        };
        caption_array.push(caption_info);
        // 注意這里是加到 caption_array, 一個全局變量, 待會要靠它來下載
        option = document.createElement('option');
        option.textContent = caption_info.lang_name;
        select.appendChild(option);
      }
    }
  }

  // 禁用下載按鈕
  function disable_download_button() {
    $(HASH_BUTTON_ID)
      .css('border', '#95a5a6')
      .css('cursor', 'not-allowed')
      .css('background-color', '#95a5a6');
    $('#captions_selector')
      .css('border', '#95a5a6')
      .css('cursor', 'not-allowed')
      .css('background-color', '#95a5a6');

    if (new_material_design_version()) {
      $(HASH_BUTTON_ID).css('padding', '6px');
    } else {
      $(HASH_BUTTON_ID).css('padding', '5px');
    }
  }

  // 處理時間. 比如 start="671.33"  start="37.64"  start="12" start="23.029"
  // 處理成 srt 時間, 比如 00:00:00,090    00:00:08,460    00:10:29,350
  function process_time(s) {
    s = s.toFixed(3);
    // 超棒的函數, 不論是整數還是小數都給弄成3位小數形式
    // 舉個柚子:
    // 671.33 -> 671.330
    // 671 -> 671.000
    // 注意函數會四捨五入. 具體讀文檔

    var array = s.split('.');
    // 把開始時間根據句號分割
    // 671.330 會分割成數組: [671, 330]

    var Hour = 0;
    var Minute = 0;
    var Second = array[0]; // 671
    var MilliSecond = array[1]; // 330
    // 先聲明下變量, 待會把這幾個拼好就行了

    // 我們來處理秒數.  把"分鐘"和"小時"除出來
    if (Second >= 60) {
      Minute = Math.floor(Second / 60);
      Second = Second - Minute * 60;
      // 把 秒 拆成 分鐘和秒, 比如121秒, 拆成2分鐘1秒

      Hour = Math.floor(Minute / 60);
      Minute = Minute - Hour * 60;
      // 把 分鐘 拆成 小時和分鐘, 比如700分鐘, 拆成11小時40分鐘
    }
    // 分鐘，如果位數不夠兩位就變成兩位，下麵兩個if語句的作用也是一樣。
    if (Minute < 10) {
      Minute = '0' + Minute;
    }
    // 小時
    if (Hour < 10) {
      Hour = '0' + Hour;
    }
    // 秒
    if (Second < 10) {
      Second = '0' + Second;
    }
    return Hour + ':' + Minute + ':' + Second + ',' + MilliSecond;
  }

  // Copy from: https://gist.github.com/danallison/3ec9d5314788b337b682
  // Thanks! https://github.com/danallison
  // Work in Chrome 66
  // Test passed: 2018-5-19
  function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], {
      type: fileType
    });
    var a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 1500);
  }

  // https://css-tricks.com/snippets/javascript/unescape-html-in-js/
  // turn HTML entity back to text, example: &quot; should be "
  function htmlDecode(input) {
    var e = document.createElement('div');
    e.class = 'dummy-element-for-tampermonkey-Youtube-cn-other-subtitle-script-to-decode-html-entity-2021-8-11';
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  // 獲得自動字幕的地址
  // return URL or null;
  // later we can send a AJAX and get XML subtitle
  // 例子輸出: https://www.youtube.com/api/timedtext?v=JfBZfnkg1uM&asr_langs=de,en,es,fr,it,ja,ko,nl,pt,ru&caps=asr&exp=xftt,xctw&xorp=true&xoaf=5&hl=zh-TW&ip=0.0.0.0&ipbits=0&expire=1628691971&sparams=ip,ipbits,expire,v,asr_langs,caps,exp,xorp,xoaf&signature=55984444BD75E34DB9FE809058CCF7DE5B1AB3B5.193DC32A1E0183D8D627D229C9C111E174FF56FF&key=yt8&kind=asr&lang=en
  /*
    如果直接訪問這個地址，裡面的格式是 XML，比如
    <transcript>
      <text start="0.589" dur="6.121">hello in this video I would like to</text>
      <text start="3.6" dur="5.88">share what I&#39;ve learned about setting up</text>
      <text start="6.71" dur="5.08">shadows and shadow casting and shadow</text>
      <text start="9.48" dur="5.6">occlusion and stuff like that in a</text>
    </transcript>
  */
  function get_auto_subtitle_xml_url() {
    try {
      var captionTracks = get_captionTracks();
      for (var index in captionTracks) {
        var caption = captionTracks[index];
        if (typeof caption.kind === 'string' && caption.kind == 'asr') {
          return captionTracks[index].baseUrl;
        }
        // ASR – A caption track generated using automatic speech recognition.
        // https://developers.google.com/youtube/v3/docs/captions
      }
    } catch (error) {
      return false;
    }
  }

  // Input: lang_code like 'en'
  // Output: URL (String)
  async function get_closed_subtitle_url(lang_code) {
    try {
      var captionTracks = get_captionTracks()
      for (var index in captionTracks) {
        var caption = captionTracks[index];
        if (caption.languageCode === lang_code && caption.kind != 'asr') {
          var url = captionTracks[index].baseUrl;
          return url
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // 把 ajax 請求簡單 wrap 一下方便使用
  // Usage: var result = await get(url)
  function get(url) {
    return $.ajax({
      url: url,
      type: 'get',
      success: function (r) {
        return r
      },
      fail: function (error) {
        return error
      }
    });
  }

  // Input: XML (provide by Youtube)
  // Output: Array of object
  // each object look like: 
  /*
    {
      startTime: "",
      endTime: "",
      text: ""
    }
  */
  // it's intermediate representation for SRT
  function parse_youtube_XML_to_object_list(youtube_xml_string) {
    if (youtube_xml_string === '' || youtube_xml_string === undefined || youtube_xml_string === null) {
      return false;
    }
    var result_array = []
    var text_nodes = youtube_xml_string.getElementsByTagName('text');
    var len = text_nodes.length;
    for (var i = 0; i < len; i++) {
      var text = text_nodes[i].textContent.toString();
      text = text.replace(/(<([^>]+)>)/ig, ""); // remove all html tag.
      text = htmlDecode(text);

      var attr_start = text_nodes[i].getAttribute('start'); // 開始時間
      var attr_dur = text_nodes[i].getAttribute('dur');

      var start = parseFloat(attr_start)
      var dur = parseFloat(attr_dur)
      var end = start + dur; // 結束時間

      // 如果下一行的"開始時間", 在當前行的"結束時間"之後，那麼代表這一行和下一行沒有串列。屏幕上不會同時顯示兩行字幕。  
      // 如果下一行的"開始時間"，早於當前行的"結束時間"，那麼我們把當前行的結束時間，改為下一行的開始時間
      var next_line_index = i + 1;
      if (next_line_index < len) {
        var next_line = text_nodes[next_line_index]
        var next_line_attr_start = next_line.getAttribute('start');
        var next_line_start = parseFloat(next_line_attr_start)
        if (end > next_line_start){
          end = next_line_start
        }
      }

      var start_time = process_time(parseFloat(start));
      var end_time = process_time(parseFloat(end));

      var item = {
        startTime: start_time,
        endTime: end_time,
        text: text
      }
      result_array.push(item)
    }

    return result_array
  }


  /*
    Input: [ {startTime: "", endTime: "", text: ""}, {...}, {...} ]
    Output: SRT
  */
  function object_array_to_SRT_string(object_array) {
    var result = '';
    var BOM = '\uFEFF';
    result = BOM + result; // store final SRT result

    for (var i = 0; i < object_array.length; i++) {
      var item = object_array[i]
      var index = i + 1;
      var start_time = item.startTime
      var end_time = item.endTime
      var text = item.text

      var new_line = NEW_LINE;
      result = result + index + new_line;

      result = result + start_time;
      result = result + ' --> ';
      result = result + end_time + new_line;

      result = result + text + new_line + new_line;
    }

    return result;
  }

  // return "English (auto-generated)" or a default name;
  function get_auto_subtitle_name() {
    try {
      var captionTracks = get_captionTracks();
      for (var index in captionTracks) {
        var caption = captionTracks[index];
        if (typeof caption.kind === 'string' && caption.kind == 'asr') {
          return captionTracks[index].name.simpleText;
        }
      }
      return 'Auto Subtitle';
    } catch (error) {
      return 'Auto Subtitle';
    }
  }

  // return player_response
  // or return null
  function get_youtube_data(){
    return document.getElementsByTagName("ytd-app")[0].data.playerResponse
  }

  function get_captionTracks() {
    let data = get_youtube_data();
    var captionTracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks
    return captionTracks
  }

  // Input a language code, output that language name in current locale
  // 如果當前語言是中文簡體, Input: "de" Output: 德語
  // if current locale is English(US), Input: "de" Output: "Germany"
  function lang_code_to_local_name(languageCode, fallback_name) {
    try {
      var captionTracks = get_captionTracks()
      for (var i in captionTracks) {
        var caption = captionTracks[i];
        if (caption.languageCode === languageCode) {
          let simpleText = captionTracks[i].name.simpleText;
          if (simpleText) {
            return simpleText
          } else {
            return fallback_name
          }
        }
      }
    } catch (error) {
      return fallback_name
    }
  }

  // 獲取當前視頻的標題 (String), 比如 "How Does the Earth Move? Crash Course Geography #5"
  // https://www.youtube.com/watch?v=ljjLV-5Sa98
  // 獲取視頻標題
  function get_title() {
    // 方法1：先嘗試拿到標題
    var title_element = document.querySelector(
      "h1.title.style-scope.ytd-video-primary-info-renderer"
    );
    if (title_element != null) {
      var title = title_element.innerText;
      // 能拿到就返回
      if (title != undefined && title != null && title != "") {
        return title;
      }
    }
    // 方法2：如果方法1失效用這個
    return ytplayer.config.args.title; // 這個會 delay, 如果頁面跳轉了，這個獲得的標題還是舊的
  }

})();