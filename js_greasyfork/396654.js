// ==UserScript==
// @name         Good-For-Reading
// @name:zh-CN   旧式网页阅读优化
// @name:zh-TW   舊式網頁閲讀優化
// @namespace    https://github.com/li-zyang/
// @version      1.0.4
// @description  Limit the width of old-styled websites (which has it's text content expand across the whole wide window.GoodForReading) and add a catalogue sidebar for a comfortble reading. This script does not affect those "modern" web pages (At least I tried to avoid that. If it fails, you can report the bug on github).
// @description:zh-CN 调整旧式网页（指那些几乎没有排版，直接用 <h1>、<p> 等等标签从上到下堆下来的网页）的排版，将内容宽度限制为适合阅读的宽度，添加目录侧栏，点击可以跳转到对应位置。此脚本不影响“现代化的”网页（至少我写的时候是这么想的，如果有误伤，可以到 github 上告诉我）。
// @description:zh-TW 調整舊式網頁（指那些幾乎沒有排版，直接用 <h1>、<p> 等等標簽從上到下堆下來的網頁）的排版，將内容寬度限制為適合閲讀的寬度，添加目錄側欄，點擊可以跳轉到對應位置。此脚本不影響“現代化的”網頁（至少我寫的時候是這麽想的，如果有誤傷，可以到 github 上告訴我）。
// @author       阿昭
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @include      *://*
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @note  v1.0.0 beta 2020-02-20  Firstly published this script
// @note  v1.0.1      2020-03-12  Fixed the bug problem of jquery conflict which makes some websites fails to load (#1)
// @note  v1.0.2      2020-03-16  Ignored the media viewer(e.g. **.mp4) & special pages (contains only one element)
// @note  v1.0.3      2020-03-23  Submit varibles to the real window.GoodForReading to better handling interactions
// @note  v1.0.4      2020-04-06  Fix the html width (set to min 100vw); Added inclusions; Modified rules
// @downloadURL https://update.greasyfork.org/scripts/396654/Good-For-Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/396654/Good-For-Reading.meta.js
// ==/UserScript==

// example: https://pubs.opengroup.org/onlinepubs/7908799/xsh/readdir.html
// example: https://man.openbsd.org/ssh-keygen.1

$.noConflict();
(function(window, $) {
  window.GoodForReading = {};
  let excluded_url_pat = [
    /https?:\/\/jwc.scnu.edu.cn\/.*/,
    /https?:\/\/ssp.scnu.edu.cn\/.*/,
    // 信息化部是真的非主流
    /ftps?:\/\/.*/,
    /https?:\/\/code.opensource.huaweicloud.com\/?.*/,
    /https?:\/\/(\w|-)+\.worktile.com\/files\/.*/
    ];
  let forced_url_pat = [
    /https?:\/\/man.openbsd.org\/.*/,
    /https?:\/\/man7.org\/.*/
  ];
  if ($('body *').length <= 1 || $('body *').length == undefined) {
    return 0;
  }
  if (excluded_url_pat.find(function(chkurl) {
    return chkurl.test(location.href);
  }) != undefined) {
    return 0;
  }
  let page_included = false;
  if (forced_url_pat.find(function(chkurl) {
    return chkurl.test(location.href);
  }) != undefined) {
    page_included = true;
  }
  function addSidebarTags(jQ_sidebar) {
    function hlevel(DOM_hNode) {
      return Number.parseInt(DOM_hNode.tagName.slice(1));
    }
    let pagetitles = $('.page-content').find('h1, h2, h3, h4, h5, h6');
    let base_hlevel = 6;
    for (let i = 0; i < pagetitles.length; i++) {
      let title = pagetitles[i];
      if (hlevel(title) < base_hlevel) {
        base_hlevel = hlevel(title);
      }
    }
    let cur_hlevel = base_hlevel;
    let cur_clevel = 1;
    for (let i = 0; i < pagetitles.length; i++) {
      let title = pagetitles[i];
      if (hlevel(title) > cur_hlevel) {
        cur_hlevel = hlevel(title);
        cur_clevel++;
      } else if (hlevel(title) < cur_hlevel) {
        cur_hlevel = hlevel(title);
        cur_clevel--;
      }
      let cata_element = $('<a class="title-' + cur_clevel + '" href=javascript:void(0);></a>').text($(title).text().trim());
      window.GoodForReading.last_title_id++;
      $(title).attr('data-title-id', window.GoodForReading.last_title_id);
      cata_element.attr('data-title-id', window.GoodForReading.last_title_id);
      cata_element.click({ 'titleID': cata_element.attr('data-title-id'), 'element': cata_element },
        function(e) {
          let target = $('.page-content *[data-title-id="' + e.data.titleID + '"]');
          $('body').animate({
            'scrollTop': target.offset().top - 50
          }, 500);
        }
      )
      jQ_sidebar.append(cata_element);
    }
  }
  let pagestyle = `
  @media screen
    and (min-width: 1280px) {
      :root {
        --main-width: 832px;
        --side-width: 256px;
      }
  }
  @media screen
    and (min-width: 640px)
    and (max-width: 1280px) {
    :root {
      --main-width: 65%;
      --side-width: 20%;
    }
  }
  @media screen
    and (max-width: 640px) {
      :root {
        --main-width: 100%;
        --side-width: 0px;
      }
  }
  html {
    display: grid;
    grid-template-columns: 100%;
    justify-items: stretch;
    min-width: 100vw;
  }
  body {
    display: grid;
    grid-template-columns: var(--side-width) var(--main-width);
    grid-auto-flow: row dense;
    justify-content: center;
    align-content: start;
    align-items: start;
    grid-column-gap: 10px;
    background: #e0e0e0;
  }
  body > .page-content {
    grid-column: 2;
    background: rgba(255, 255, 255, 0.3);
    padding: 10px 10px 10px 10px;
    overflow-x: scroll;
  }
  body > .side-bar {
    background: rgba(255, 255, 255, 0.3);
    width: 100%;
    grid-column: 1;
    grid-row: 1;
    overflow: scroll;
    padding: 0px 0px 20px 0px;
    /* position: fixed; */
  }
  body > .side-bar .side-bar-header {
    padding: 20px 10px 9px 10px;
    font-size: 2em;
    font-weight: bold;
    white-space: pre;
  }
  body > .side-bar a {
    text-decoration: none;
    display: block;
    line-height: 1.5em;
    color: inherit;
  }
  body > .side-bar .title-1 {
    padding: 3px 10px 0px 10px;
    font-size: 1em;
    font-weight: bold;
    white-space: pre;
  }
  body > .side-bar .title-2 {
    padding: 3px 30px 0px 10px;
    font-size: 0.9em;
    white-space: pre;
  }
  body > .side-bar .title-3 {
    padding: 3px 50px 0px 10px;
    font-size: 0.9em;
    white-space: pre;
  }
  body > .side-bar .title-4 {
    padding: 3px 70px 0px 10px;
    font-size: 0.9em;
    white-space: pre;
  }
  body > .side-bar .title-5 {
    padding: 3px 90px 0px 10px;
    font-size: 0.9em;
    white-space: pre;
  }
  body > .side-bar .title-6 {
    padding: 3px 110px 0px 10px;
    font-size: 0.9em;
    white-space: pre;
  }
  `
  if (!(
      $('body > div').length ||
      $('body > table:first-child').length ||
      $('body > header').length ||
      $('body > section').length ||
      $('body > footer').length ||
      $('body > nav').length ||
      $('body > artical').length ||
      $('body > aside').length ||
      $('body > form:first-child:only-child').length ||
      $('body > video:first-child').length ||
      $('body > img:first-child').length ||
      $('body > svg:first-child').length ||
      $('body > *:first-child:only-child').length
      ) || page_included) {
    let pagecontent = $('<div class="page-content"></div>').html($('body').html());
    $('body > *').remove();
    $('body').append(pagecontent);
    $('body').append($("<style></style>").text(pagestyle));
    let sidebar = $(`
<div class="side-bar">
  <div class="side-bar-header">Catalogue</div>
</div>`);
    window.GoodForReading.last_title_id = 0;
    addSidebarTags(sidebar);
    $('body').prepend(sidebar);
  }
})(window.unsafeWindow, jQuery);