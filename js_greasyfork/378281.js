// ==UserScript==
// @name         Hako +
// @namespace    https://greasyfork.org/users/37096/
// @version      0.9
// @description  Hako with more freedom
// @icon         http://ln.hako.re/img/favicon.png?v=3
// @icon64       http://ln.hako.re/img/apple-touch-icon-72x72.png?v=3
// @author       Hồng Minh Tâm
// @match        http*://ln.hako.re/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @connect      hako.re
// @connect      blogspot.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/378281/Hako%20%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/378281/Hako%20%2B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var debug = false;
  var log = debug ? console.log : function () {};
  var isResetValue = true;

  var maxBlocks = 11;
  var currentPage = 1;
  var numPages;

  GM_addStyle([
    '.thumb_attr:hover { white-space: normal !important; }',
    'ul.list-chapters li .chapter-name { white-space: normal; }',
    '.daily-recent_views .top-tab_title.title-active, .sts-bold { background-color: #36a189; }',
    '.no-select { -webkit-user-select: auto; -moz-user-select: auto; -ms-user-select: auto; user-select: auto; cursor: auto; }',
    '.input-go-to-page { padding-right: 20px; padding-left: 20px; width: 100.17px; border-top-left-radius: 100px; border-bottom-left-radius: 100px; height: 31px; }',
    '.button-go-to-page { border-radius: 0; border-top-right-radius: 100px; border-bottom-right-radius: 100px; }',
    '.lds-ring { display: inline-block; position: relative; width: 64px; height: 64px; }',
    '.lds-ring div { box-sizing: border-box; display: block; position: absolute; width: 51px; height: 51px; margin: 6px; border: 6px solid #fff; border-radius: 50%; animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; border-color: #36a189 transparent transparent transparent; }',
    '.lds-ring div:nth-child(1) { animation-delay: -0.45s; }',
    '.lds-ring div:nth-child(2) { animation-delay: -0.3s; }',
    '.lds-ring div:nth-child(3) { animation-delay: -0.15s; }',
    '@keyframes lds-ring { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }'
  ].join('\n'));

  function getUrlParams(name, url) {
    var params = {};
    url.substring(1).replace(/[?&]+([^=&]+)=([^&]*)/gi,
      function (str, key, value) {
        params[key] = value;
      });
    return params[name];
  }

  function editLinkProject() {
    $('.thumb-item-flow').each(function (e) {
      var $thumbItemFlow = $(this);
      var link = $thumbItemFlow.find('.series-title>a:eq(0)').attr('href');
      var $thumb_img = $thumbItemFlow.find('.thumb-wrapper>a:eq(0)');
      $thumb_img.attr('href', link);
    });
  }

  function loadPage(page) {
    var $newChap = $('.translation>main.row:eq(0)');
    $newChap.empty();
    $('<div class="block center text-center"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>').appendTo($newChap);
    GM_xmlhttpRequest({
      method: 'GET',
      url: '//ln.hako.re/danh-sach?truyendich=1&sapxep=capnhat&page=' + page,
      onload: function (response) {
        var $response = $(response.response);
        var $newChapAll = $response.find('.thumb-section-flow>main.row:eq(0)');
        var $paginationFooter = $response.find('.thumb-section-flow>.pagination-footer:eq(0)');
        $newChap.replaceWith($newChapAll);
        var $next = $newChapAll.next();
        if ($next.length === 0) {
          $('<div class="pagination-footer"/>').insertAfter($newChapAll);
        }

        editLinkProject();
        editPaging($paginationFooter);
      }
    });
  }

  function goToPage(page) {
    $('.popup-go-to-page, .translation .pagination-footer').remove();
    loadPage(page);
    document.getElementsByClassName('translation')[0].scrollIntoView();
    return false;
  }

  function popupGotoPage($element) {
    $('.popup-go-to-page').remove();
    var $popupGoToPage = $('<div class="popup-go-to-page"/>');
    $popupGoToPage.css({
        width: 188,
        padding: 10
    });

    var $inputGoToPage = $('<input/>', {
      class: 'input-go-to-page',
      type: 'text',
      autocomplete: 'off',
      placeholder: 'Trang...'
    });
    $inputGoToPage.appendTo($popupGoToPage);
    var $buttonGoToPage = $('<button/>', {
      class: 'button button-green button-go-to-page',
      text: 'Đến'
    });
    $buttonGoToPage.appendTo($popupGoToPage);
    $buttonGoToPage.click(function (e) {
      var page = Number($inputGoToPage.val());
      if (page !== currentPage && page >= 1 && page <= numPages) {
        goToPage(page);
      }
      return false;
    });
    $inputGoToPage.keyup(function (e) {
      if (e.keyCode === 13) {
        $buttonGoToPage.click();
      }
    });
    $popupGoToPage.appendTo('body');

    var offsetTarget = $element.offset();
    var elementHeight = $element.outerHeight();
    var elementWidth = $element.outerWidth();
    var popupGoToPageWidth = $popupGoToPage.outerWidth();
    $popupGoToPage.css({
        position: 'absolute',
        zIndex: 5000,
        left: offsetTarget.left + elementWidth / 2 - popupGoToPageWidth / 2,
        top: offsetTarget.top + elementHeight
    });
    $popupGoToPage.hide().fadeIn();

    $('body').click(function (e) {
      if ($(e.target).closest('.popup-go-to-page').length !== 0) return false;
      $('.popup-go-to-page').fadeOut().remove();
    });
  }

  function createPagination() {
    var $paginationFooter = $('.translation .pagination-footer');

    if (numPages > 1) {
      var html = [];

      var addPageLink = function(page, label, tooltip, isGoToPage) {
        var cls = (page === null && isGoToPage !== true) ? 'disabled' : '';
        cls += ' paging_item';
        if (page === currentPage) {
          cls += ' current';
        }
        if (isGoToPage === true) {
          cls += ' go-to-page';
        }
        if (page !== null && page !== currentPage || isGoToPage === true) {
          html.push('<a title="', tooltip, '" data-page="', page, '" class="', cls, '" href="#', page, '">', label, '</a>');
        } else {
          html.push('<span title="', tooltip, '" data-page="', page, '" class="', cls, '">', label, '</span>');
        }
      }

      html.push('<div class="pagination_wrap">');
      addPageLink((1 === currentPage) ? null : (currentPage - 1), '<i class="fa fa-angle-left" aria-hidden="true"/>', 'Trang trước');
      addPageLink(1, 1, 'Trang đầu tiên');

      var maxPivotPages = Math.round((maxBlocks - 5) / 2);
      var minPage = Math.max(2, currentPage - maxPivotPages);
      var maxPage = Math.min(numPages - 1, currentPage + maxPivotPages * 2 - (currentPage - minPage));
      minPage = Math.max(2, minPage - (maxPivotPages * 2 - (maxPage - minPage)));

      for (var i = minPage; i <= maxPage; i++) {
        var isMore = (i === minPage && i !== 2) || (i === maxPage && i !== numPages - 1);
        if (isMore) {
          addPageLink(null, '&hellip;', null, true);
        } else {
          addPageLink(i, i, 'Trang ' + i);
        }
      }

      addPageLink(numPages, numPages, 'Trang cuối cùng');
      addPageLink((numPages === currentPage) ? null : (currentPage + 1), '<i class="fa fa-angle-right" aria-hidden="true"/>', 'Trang sau');
      html.push('</div>');

      $paginationFooter.html(html.join(''));

      $paginationFooter.find('a:not(.disabled):not(.active)').click(function (e) {
        var $this = $(this);
        if ($this.hasClass('go-to-page')) {
          popupGotoPage($this);
        } else {
          goToPage(Number($this.data('page')));
        }
        return false;
      });
    } else {
      $paginationFooter.empty();
    }
  }

  function editPaging($paginationFooter) {
    var $pagingPrevnext = $paginationFooter.find('.paging_item.next');
    numPages = Number(getUrlParams('page', $pagingPrevnext.attr('href')));
    var $pagingItemCurrent = $paginationFooter.find('.paging_item.current');
    currentPage = Number(getUrlParams('page', $pagingItemCurrent.attr('href')));
    createPagination();
  }

  function loadSearchInput() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: '//ln.hako.re/tim-kiem',
      onload: function (response) {
        var $searchForm = $(response.response).filter('#mainpart').find('.search-form:eq(0)');
        $searchForm.removeClass('col-12');
        $searchForm.addClass('clear');
        $searchForm.css('margin', '0 30px');
        $searchForm.find('.search-advance_toggle').remove();

        var $container = $('#mainpart .index-middle:eq(0) > .container, #mainpart .feature-section:eq(0) > .container');
        $searchForm.prependTo($container);
      }
    });
  }

  function getDataImage(url, callback) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      overrideMimeType: 'text/plain; charset=x-user-defined',
      onload: function (response) {
        var binary = '';
        var responseText = response.responseText;
        var responseTextLen = responseText.length;

        for (var i = 0; i < responseTextLen; i++) {
          binary += String.fromCharCode(responseText.charCodeAt(i) & 255);
        }
        callback('data:image/jpeg;base64,' + btoa(binary));
      },
      onerror: function (response) {

      }
    });
  }

  function getBackgroundImageUrl($element) {
    var bgUrl = $element.css('background-image');
    bgUrl = /url\((['"]?)(.*)\1\)/.exec(bgUrl);
    bgUrl = bgUrl ? bgUrl[2] : '';
    return bgUrl;
  }

  function getAverageRGB(dataImage, callback) {
    var $img = $('<img />', {
      src: dataImage
    });

    var defaultRGB = {
      r: 0,
      g: 0,
      b: 0
    }; // for non-supporting envs

    $img.on('load', function () {
      var blockSize = 5; // only visit every 5 pixels
      var canvas = document.createElement('canvas');
      var context = canvas.getContext && canvas.getContext('2d');
      var data;
      var i = -4;
      var rgb = {
        r: 0,
        g: 0,
        b: 0
      };
      // var count = 0;
      var rgbs = {};
      var rgbStr, averageRGB;

      if (!context) {
        return defaultRGB;
      }

      var height = canvas.height = $img.get(0).naturalHeight || $img.get(0).offsetHeight || $img.get(0).height;
      var width = canvas.width = $img.get(0).naturalWidth || $img.get(0).offsetWidth || $img.get(0).width;

      context.drawImage($img.get(0), 0, 0);
      try {
        data = context.getImageData(0, 0, width, height);
      } catch (e) {
        /* security error, img on diff domain */
        return defaultRGB;
      }

      var length = data.data.length;

      while ((i += blockSize * 4) < length) {
        // var luminance = 0.2126 * data.data[i] + 0.7152 * data.data[i + 1] + 0.0722 * data.data[i + 2];
        averageRGB = (data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3;
        if ( /* luminance < 40 || luminance > 220 || */
          ((averageRGB - 50 <= data.data[i] && averageRGB + 50 >= data.data[i]) &&
            (averageRGB - 50 <= data.data[i + 1] && averageRGB + 50 >= data.data[i + 1]) &&
            (averageRGB - 50 <= data.data[i + 2] && averageRGB + 50 >= data.data[i + 2]))) {
          continue;
        }
        // ++count;
        // rgb.r += data.data[i];
        // rgb.g += data.data[i + 1];
        // rgb.b += data.data[i + 2];
        rgbStr = data.data[i] + ',' + data.data[i + 1] + ',' + data.data[i + 2];
        rgbs[rgbStr] = (rgbs[rgbStr] || 0) + 1;
      }

      // ~~ used to floor values
      // rgb.r = ~~(rgb.r / count);
      // rgb.g = ~~(rgb.g / count);
      // rgb.b = ~~(rgb.b / count);

      log('rgbs: ', rgbs);

      var rgbKeys = Object.keys(rgbs);
      if (rgbKeys.length > 0) {
        var rgbCount = Math.max.apply(Math, rgbKeys.map(function (rgb) { return rgbs[rgb]; }));
        var rgbKeysMax = rgbKeys.filter((rgb) => {
          return rgbs[rgb] === rgbCount;
        });

        var rgbArray = rgbKeysMax[Math.floor(Math.random() * rgbKeysMax.length)].split(',');
        rgb = {
          r: Number(rgbArray[0]),
          g: Number(rgbArray[1]),
          b: Number(rgbArray[2])
        };
        log('rgbKeysMax: ', rgbKeysMax);
        log('count: ', rgbCount);
        log('rgb: ', rgb);

        callback(rgb);
      }
    });
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function createBackgroundColorStyle(color) {
    GM_addStyle([
      '.page-top-group .index-background { background-color: ' + color + ' !important }',
      '#mainpart { background-image: linear-gradient(180deg, ' + color + ' 200px, transparent 0) }'
    ].join('\n'));
  }

  function changeThemeColor(themeColor) {
    var metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.dataset.changeThemeColor = true;
    metaThemeColor.setAttribute("content", themeColor);
  }

  function setBackgroundColor() {
    var bgUrl = getBackgroundImageUrl($('.series-cover .content.img-in-ratio:eq(0)'));

    var colors = GM_getValue('colors', {});
    log('colors', colors);
    if (isResetValue && colors.version !== GM_info.script.version) {
      colors = {};
      colors.version = GM_info.script.version;
      GM_deleteValue('colors');
      log('GM_deleteValue');
    }

    if (colors[bgUrl] && !debug) {
      createBackgroundColorStyle(colors[bgUrl]);
      changeThemeColor(colors[bgUrl]);
    } else {
      getDataImage(bgUrl, function (data) {
        getAverageRGB(data, function (rgbColor) {
          var hexColor = rgbToHex(rgbColor.r, rgbColor.g, rgbColor.b);
          createBackgroundColorStyle(hexColor);
          changeThemeColor(hexColor);
          colors[bgUrl] = hexColor;
          GM_setValue('colors', colors);
        });
      });
    }
  }

  function clickMore() {
    $('.mobile-more').click();
  }

  loadSearchInput();
  var url = window.location.href;
  if (/^http(s)?:\/{2}ln.hako.re(\/([?#].*?)?)?$/i.test(url)) {
    setBackgroundColor();

    loadPage(1);
  } else {
    $('#mature_modal').css('display', 'none');
    if (/^http(s)?:\/{2}ln.hako.re\/(truyen|sang-tac|convert)\/\d+\-[^\/]+(\/t\d+\-[^\/]+)?$/i.test(url)) {
      setBackgroundColor();
      clickMore();
    }
    editLinkProject();
  }
})();