// ==UserScript==
// @name         Average Coverage
// @namespace    TamHM3
// @version      1.0.8
// @description  Average Coverage Description
// @author       Hồng Minh Tâm
// @include      */coverage/*html/**/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @require      https://greasyfork.org/scripts/30368-highlight-words-jquery-library/code/Highlight%20Words%20Jquery%20Library.js?version=199098
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/367747/Average%20Coverage.user.js
// @updateURL https://update.greasyfork.org/scripts/367747/Average%20Coverage.meta.js
// ==/UserScript==

(function () {
  'use strict';
  GM_addStyle([
    '@import url(https://use.fontawesome.com/releases/v5.1.0/css/all.css);',
    '@import url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome-animation/0.2.1/font-awesome-animation.min.css);',
    '.animated { animation-duration: 1s; animation-fill-mode: both; }',
    '@keyframes flash { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: 0; } }',
    '.flash { animation-name: flash; }',
    '.scroll-marker-wrapper { position: fixed; width: 8px; height: 8px; background-color: #F6C6CE; border-radius: 50%; right: 0; display: block; margin: 0; padding: 0; }',
    '.scroll-marker { position: relative; width: 100%; height: 100%; right: 0; left: 0; top: 0; bottom: 0; }',
    '[data-tooltip] { position: relative; cursor: pointer; }',
    '[data-tooltip]:before, [data-tooltip]:after { position: absolute; visibility: hidden; opacity: 0; transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out, transform 0.2s cubic-bezier(0.71, 1.7, 0.77, 1.24); transform: translate3d(0, 0, 0); pointer-events: none; }',
    '.tooltip-show:before, .tooltip-show:after, [data-tooltip]:hover:before, [data-tooltip]:hover:after, [data-tooltip]:focus:before, [data-tooltip]:focus:after { visibility: visible; opacity: 1; transform: translateY(-12px); }',
    '[data-tooltip]:before { z-index: 1001; border: 6px solid transparent; background: transparent; content: ""; margin-left: -6px; margin-bottom: -12px; border-top-color: hsla(0, 0%, 20%, 0.9); }',
    '[data-tooltip]:after { z-index: 1000; padding: 8px; max-width: 460px; background-color: hsla(0, 0%, 20%, 0.9); color: #fff; content: attr(data-tooltip); font-size: 14px; line-height: 1.2; white-space: pre; text-overflow: ellipsis; overflow: hidden; font-family: Consolas, \'Courier New\', monospace; margin-left: -80px; min-height: 32px; }',
    '[data-tooltip]:before, [data-tooltip]:after { bottom: 100%; left: 50%; }',
    '.tooltip-left:before, .tooltip-left:after { right: 100%; bottom: 50%; left: auto; }',
    '.tooltip-left:before { margin-left: 0; margin-right: -12px; margin-bottom: 0; border-top-color: transparent; border-left-color: hsla(0, 0%, 20%, 0.9); }',
    '.tooltip-show:before, .tooltip-show:after, .tooltip-left:hover:before, .tooltip-left:hover:after, .tooltip-left:focus:before, .tooltip-left:focus:after { transform: translateX(-12px); }',
    '.tooltip-left:before { top: -2px }',
    '.tooltip-left:after { margin-left: 0; margin-bottom: -16px; }',
    '.cstat-no .tooltip-left:before, .fstat-no .tooltip-left:before, .cbranch-no .tooltip-left:before, .cbranch-no .tooltip-left:before {  border-left-color: #ec8395; }',
    '.cstat-no [data-tooltip]:after, .fstat-no [data-tooltip]:after, .cbranch-no [data-tooltip]:after, .cbranch-no [data-tooltip]:after { background-color: #ec8395; }',
    '.cbranch-no .tooltip-left:before { border-left-color: #f1c40f; }',
    '.cbranch-no [data-tooltip]:after { background-color: #f1c40f;  }',
    '.missing-if-branch.scroll-marker-wrapper { background-color: #333; margin-right: 10px; }',
    '.missing-if-branch .tooltip-left:before { border-left-color: #333; }',
    '.missing-if-branch [data-tooltip]:after { background-color: #333; color: yellow; }',
    '.sidebar { position: fixed; top: 0; bottom: 0; left: 0; display: flex; }',
    '.sidebar.sidebar-show { width: 25%; border-right: 1px solid #cac4c4; }',
    '.sidebar-body { margin-left: 12px; }',
    '.sidebar-body.sidebar-show { margin-left: 25%; }',
    '.sidebar .sidebar-content { flex: 1; background-color: #fff; width: 0; display: flex; flex-direction: column; overflow: auto; }',
    '.sidebar .sidebar-content .sidebar-function-list { list-style-type: none; margin: 0; padding: 0; overflow: auto; flex: 1; }',
    '.sidebar .sidebar-content .sidebar-function-item { cursor: pointer; padding: 8px 16px; display: list-item; border-radius: 0; margin: 0; }',
    '.sidebar .sidebar-content .sidebar-function-item:hover { background-color: #ccc !important; }',
    '.sidebar .sidebar-content .sidebar-filter-input { width: 100%; padding: 8px 8px 8px 16px; color: #000; background-color: #fff; border: 1px solid #ccc; border-left: 0; border-right: 0; }',
    '.sidebar .sidebar-content .sidebar-filter-input::-webkit-input-placeholder { font-family: Arial, Helvetica, sans-serif, Font Awesome\\ 5 Free; font-weight: 700; }',
    '.sidebar .sidebar-content .sidebar-filter-input::-moz-placeholder { font-family: Verdana, sans-serif, Font Awesome\\ 5 Free; font-weight: 700; }',
    '.sidebar .sidebar-content .sidebar-filter-input::-ms-input-placeholder { font-family:  Verdana, sans-serif, Font Awesome\\ 5 Free; font-weight: 700; }',
    '.sidebar .sidebar-content .sidebar-filter-input:not(:placeholder-shown) { background-color: #FFFF88; }',
    '.sidebar .sidebar-content .sidebar-filter-input[type="search"]::-webkit-search-cancel-button { -webkit-appearance: searchfield-cancel-button; }',
    '.sidebar .sidebar-button { cursor: pointer; width: 12px; height: 100%; background-color: #eaeaea; display: flex; align-items: center; justify-content: center; border-right: 1px solid #cac4c4; }',
    '.sidebar .sidebar-button:hover { background-color: #ccc; }',
    '.sidebar .sidebar-button .fa-sidebar-button:before { content: "\\f0da"; }',
    '.sidebar.sidebar-show .sidebar-button .fa-sidebar-button:before { content: "\\f0d9"; }',
    '.sidebar .sidebar-drag { width: 4px; margin-left: -4px; background: transparent; cursor: e-resize; display: none; }',
    '.sidebar.sidebar-show .sidebar-drag { display: block; }',
    '.highlight { background-color: #FFFF88; color: #000; }'
  ].join('\n'));

  var url = window.location.href;
  var $body = $('body');
  var $page = $("html, body");
  var limit = 90;

  applyCoverageFile();
  if (url.indexOf('/index.html') > -1) {
    applyCoverageSummary();
  } else {
    applyCheckFile();
  }

  function createIcon(classIcon, stylePrefix) {
    var $icon = $('<i/>', {
      class: 'fa-' + classIcon
    });
    if (stylePrefix === undefined) {
      stylePrefix = 'fas';
    }
    $icon.addClass(stylePrefix);
    return $icon;
  }

  function applyCoverageFile() {
    var coverFile = $('.clearfix .strong').map(function () {
      return Number($(this).text().match(/[\d.]+(?=%)/g));
    }).get();
    var avgCover = coverFile.reduce(function (a, b) {
      return a + b;
    }, 0) / 4;
    var $avgCoverFile = $('<div/>', {
      class: 'fl pad1y space-right2'
    }).appendTo($('.clearfix'));
    var $avgCoverStrongFile = $('<span/>', {
      class: 'strong',
      text: avgCover.toFixed(2) + '% '
    });
    $avgCoverStrongFile.appendTo($avgCoverFile);
    var $avgCoverQuietFile = $('<span/>', {
      class: 'quiet',
      text: 'Average'
    });
    $avgCoverQuietFile.appendTo($avgCoverFile);
  }

  function applyCoverageSummary() {
    var $tableCover = $('.coverage-summary:eq(0)');
    var $theadCover = $tableCover.find('thead');
    var $tbodyCover = $tableCover.find('tbody');

    var $thCoverHead = $('<th/>', {
      text: 'Average'
    });
    $thCoverHead.attr('data-col', 'average');
    $thCoverHead.attr('data-type', 'number');
    $thCoverHead.attr('data-fmt', 'pct');
    $thCoverHead.addClass('pct');
    $thCoverHead.appendTo($theadCover.find('tr'));

    $tbodyCover.find('tr').each(function () {
      var $tr = $(this);
      var coverFile = $tr.find('.pct').map(function () {
        return Number($(this).data('value'));
      }).get();
      var avgCover = coverFile.reduce(function (a, b) {
        return a + b;
      }, 0) / 4;
      var $avgCoverFile = $('<td/>', {
        text: avgCover.toFixed(2) + '%'
      });
      $avgCoverFile.attr('data-value', avgCover.toFixed(2));
      $avgCoverFile.addClass('pct');
      $avgCoverFile.addClass(avgCover < limit ? 'low' : 'high');
      $avgCoverFile.appendTo($tr);
    });
  }

  function applyCheckFile() {
    $.fn.reverse = [].reverse;

    var scrollWidth = 17;
    var windowHeight = $(window).height();
    var documentHeight = $(document).height();
    var scrollMarkers = [];
    var $notCovers = $('.cstat-no, .fstat-no, .cbranch-no, .missing-if-branch');
    var maskFunctionNewLine = /(\n\s*)(([a-zA-Z]+\s)?((get|set)+\s)?([a-zA-Z]\w*))\b(?=\((((\@Inject\(\w+\))?[\n\w :,=?\[\]\<\>]|\/\/.+)*)\)([\w :\[\]\<\>]*){([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}])*})*})*})*})*})*})*})*})/;
    var maskFunction = /([a-zA-Z]+\s)?((get|set)+\s)?([a-zA-Z]\w*)\b(?=\((((\@Inject\(\w+\))?[\n\w :,=?\[\]\<\>]|\/\/.+)*)\)([\w :\[\]\<\>]*){([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}])*})*})*})*})*})*})*})*})/;
    var maskFunctionG = /\n\s*([a-zA-Z]+\s)?((get|set)+\s)?([a-zA-Z]\w*)\b(?=\((((\@Inject\(\w+\))?[\n\w :,=?\[\]\<\>]|\/\/.+)*)\)([\w :\[\]\<\>]*){([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}]|{([^{}])*})*})*})*})*})*})*})*})/g;

    var ScrollMarker = (function () {
      function ScrollMarker($notCover) {
        this.$notCover = $notCover;
        this.notCoverCenterY = $notCover.offset().top + $notCover.height() / 2;
        this.notCoverText = $.trim(this.$notCover.text());

        this.$scrollMarkerWrapper = $('<div/>', {
          class: 'scroll-marker-wrapper'
        }).appendTo($body);
        this.$scrollMarkerWrapper.addClass(this.$notCover.prop('class'));
        this.scrollMarkerWrapperHeight = this.$scrollMarkerWrapper.height();

        this.$scrollMarker = $('<div/>', {
          class: 'tooltip-left scroll-marker'
        }).appendTo(this.$scrollMarkerWrapper);
        this.$scrollMarker.attr('data-tooltip', this.notCoverText);
        this.$scrollMarker.on('click', function () {
          $notCovers.removeClass('flash');

          $page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
            $page.stop();
          });

          $page.animate({
            scrollTop: this.getScrollTop()
          }, 'slow', function () {
            $page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
          }).promise().done(function () {
            this.$notCover.addClass('flash');
          }.bind(this));
        }.bind(this));

        this.updatePosition();
      }
      ScrollMarker.prototype.updatePosition = function () {
        this.scrollMarkerTop = this.notCoverCenterY * (windowHeight - scrollWidth * 2) / documentHeight + scrollWidth - this.scrollMarkerWrapperHeight / 2;
        this.$scrollMarkerWrapper.css({
          top: this.scrollMarkerTop
        });
      };
      ScrollMarker.prototype.getScrollTop = function () {
        return this.notCoverCenterY - windowHeight / 5;
      };
      return ScrollMarker;
    }($notCovers));

    $notCovers.each(function () {
      var $notCover = $(this);
      var scrollMarker = new ScrollMarker($notCover);
      scrollMarkers.push(scrollMarker);
    });

    $(window).on('resize', function () {
      windowHeight = $(window).height();
      $.each(scrollMarkers, function (index, scrollMarker) {
        scrollMarker.updatePosition();
      });
    });

    $notCovers.addClass('animated');
    // $(window).on('load', function () {
    //   initSideBar();
    // });

    function elementLoaded(el, cb) {
      if ($(el).length) {
        cb($(el));
      } else {
        setTimeout(function () {
          elementLoaded(el, cb);
        }, 500);
      }
    }

    elementLoaded('.pln, .str, .kwd, .com, .typ, .lit, .pun,.opn,.clo, .tag, .atn, .atv, .dec,.var, .fun', function (el) {
      initSideBar();
    });

    function getFunctionList(callback) {
      var $contentFile = $('.prettyprint:eq(0)');
      var functionItemLength = $contentFile.text().match(maskFunctionG).length;
      var $contentFileChildren = $contentFile.children();
      var contentContainFunction = [];
      var contentFunctions = [];
      var $contentContainFunction, $contentFunction;
      var contentFunction, functionItem, funtionMatch;
      $contentFileChildren.reverse().each(function () {
        contentContainFunction.unshift(this);
        $contentContainFunction = $(contentContainFunction);
        if (maskFunctionNewLine.test($contentContainFunction.text())) {
          contentFunction = [];
          $contentContainFunction.each(function () {
            contentFunction.push(this);
            $contentFunction = $(contentFunction);
            if (maskFunctionNewLine.test($contentFunction.text())) {
              if (maskFunction.test($contentFunction.slice(1).text())) {
                functionItem = {
                  text: $contentFunction.slice(1).text().match(maskFunction)[0],
                  items: $contentFunction.slice(1)
                };
              } else {
                functionItem = {
                  text: $contentFunction.text().match(maskFunction)[0],
                  items: $contentFunction
                };
              }
              contentFunctions.unshift(functionItem);
              contentFunction = [];
              if (callback) callback(functionItem);
              return false;
            }
          });
          contentContainFunction = [];
        }
        if (contentFunctions.length === functionItemLength) {
          return false;
        }
      });
      return contentFunctions;
    }

    function initSideBar() {
      var sideBarWidth = GM_getValue('sideBarWidth', '25%');
      $body.addClass('sidebar-body');
      var $sideBar = $('<div/>', {
        class: 'sidebar'
      });
      $sideBar.appendTo($body);
      var $sideBarContent = $('<div/>', {
        class: 'sidebar-content'
      });
      var $sideBarButton = $('<div/>', {
        class: 'sidebar-button'
      }).appendTo($sideBar);
      $sideBarButton.append(createIcon('sidebar-button'));
      $sideBarButton.click(function () {
        if ($sideBar.hasClass('sidebar-show')) {
          $sideBar.removeClass('sidebar-show');
          $sideBar.css('width', '');
          $body.removeClass('sidebar-show');
          $body.css('margin-left', '');
        } else {
          $sideBar.addClass('sidebar-show');
          $sideBar.css('width', sideBarWidth);
          $body.addClass('sidebar-show');
          $body.css('margin-left', sideBarWidth);
        }
      });
      $sideBarContent.appendTo($sideBar);
      var $sideBarFunctionList = $('<ul/>', {
        class: 'sidebar-function-list'
      });
      $sideBarFunctionList.appendTo($sideBarContent);

      getFunctionList(function (functionItem) {
        var $sideBarFunctionItem = $('<li/>', {
          class: 'sidebar-function-item'
        });
        var $noCoverFunction = functionItem.items.filter('.cstat-no, .fstat-no, .cbranch-no, .missing-if-branch');
        if ($noCoverFunction.length > 0) {
          if ($noCoverFunction.filter('.cbranch-no').length === $noCoverFunction.length) {
            $sideBarFunctionItem.addClass($noCoverFunction.filter('.cbranch-no').first().prop('class'));
          } else if ($noCoverFunction.filter('.missing-if-branch').length === $noCoverFunction.length) {
            $sideBarFunctionItem.addClass($noCoverFunction.filter('.missing-if-branch').first().prop('class'));
          } else {
            $sideBarFunctionItem.addClass($noCoverFunction.filter(':not(.cbranch-no, .missing-if-branch)').first().prop('class'));
          }
        }
        $sideBarFunctionItem.prependTo($sideBarFunctionList);
        $sideBarFunctionItem.text(functionItem.text);
        $sideBarFunctionItem.click(function () {
          $page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function () {
            $page.stop();
          });

          $page.animate({
            scrollTop: functionItem.items.offset().top - windowHeight / 5
          }, 'slow', function () {
            $page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
          });
        });
      });

      var $inputFilter = $('<input/>', {
        type: 'search',
        class: 'sidebar-filter-input',
        placeholder: $('<div/>').html('&#xf0b0; Filter').html()
      }).prependTo($sideBarContent);
      $inputFilter.on('input', function (e) {
        var filterValue = $(this).val().toLowerCase();
        $sideBarFunctionList.find('.sidebar-function-item').each(function (index, item) {
          $(item).unhighlight().highlight(filterValue);
          if ($(item).text().toLowerCase().indexOf(filterValue) > -1) {
            $(item).show();
          } else {
            $(item).hide();
          }
        });
      });

      var $sideBarDrag = $('<div/>', {
        class: 'sidebar-drag'
      }).appendTo($sideBar);
      $sideBarDrag.on('mousedown.sidebar-drag', function (e) {
        e.preventDefault();
        $(document).on('mousemove.sidebar-drag', function (e) {
          sideBarWidth = e.pageX + 2;
          $sideBar.css("width", sideBarWidth);
          $body.css("margin-left", sideBarWidth);
          GM_setValue('sideBarWidth', sideBarWidth);
        });
      });
      $sideBarDrag.on('dblclick', function (e) {
        e.preventDefault();
        $sideBar.css('width', '');
        $body.css('margin-left', '');
        sideBarWidth = '25%';
        GM_deleteValue('sideBarWidth');
      });
      $(document).on('mouseup.sidebar-drag', function (e) {
        $(document).off('mousemove.sidebar-drag');
      });
    }
  }
})();