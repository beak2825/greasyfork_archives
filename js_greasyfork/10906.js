/* global window, document, jQuery */

// ==UserScript==
// @name         Pixiv hover zoom
// @namespace    https://github.com/rplus
// @version      1.1.2
// @description  hover zoom for Pixiv
// @author       Rplus
// @include      http://www.pixiv.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10906/Pixiv%20hover%20zoom.user.js
// @updateURL https://update.greasyfork.org/scripts/10906/Pixiv%20hover%20zoom.meta.js
// ==/UserScript==

;(function(window, document, $) {
  'use strict';

  var phzw = $('#pixiv-hz-wrap');
  var phzwPos = [];
  var phzwPattern = /member_illust\.php\?mode=medium&illust_id=(\d+)/;
  var phzwAPI = '//www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=';
  var phzwAPICache = {};
  var imgSize = 'm'; // size: '240mw', m', 'big'
  var body = document.body;
  var isAutoLoadNextPage = true;
  var pager = {};

  var phzwToggle = function(_switch) {
    if (_switch) {
      phzw.css({
        'top': phzwPos[0],
        'left': phzwPos[1],
        'opacity': 1,
        'visibility': 'visible',
        'transform': 'translateX(' + phzwPos[2] + '%)'
      });
    } else {
      if ('0' !== phzw[0].style.opacity) {
        phzw.css({
          'visibility': 'hidden',
          'opacity': 0
        });
      }
    }
  };

  var getAllId = function() {
    var ids = [];

    $.each($('#wrapper').find('a'), function() {
      var _href = $(this).attr('href');
      var _match = _href && _href.match(phzwPattern);
      if (_match) {
        ids.push(_match.pop());
      }
    });

    return ids;
  };

  var pullIdsData = function(idsArr) {
    var deferred = $.Deferred();

    $.getJSON(phzwAPI + idsArr.join())
      .done(function(data) {

        if (!data.error) {
          for (var _item in data.body) {
            if (data.body.hasOwnProperty(_item)) {
              phzwAPICache[_item] = data.body[_item];
            }
          }
          deferred.resolve(); //update state
        } else {
          deferred.reject();
        }

      })
      .fail(function() {
        deferred.reject();
      });

    return deferred.promise();
  };

  var render = function(_id) {
    var data = phzwAPICache[_id];
    if (!data) { return; }

    if (_id !== phzw.data('id')) {
      var tpl = '<a href="/member_illust.php?mode=medium&illust_id=' + _id + '"><img src="' + data.url[imgSize] + '" title="' + data.illust_title + '"></a>';
      phzw.html(tpl);

      phzw.data('id', _id);
    }

    phzwToggle(true);
  };

  var updatePos = function(ele) {
    var eleRect = ele.getBoundingClientRect();
    phzwPos = [eleRect.top + body.scrollTop + eleRect.height, eleRect.left, -100 * eleRect.left / body.scrollWidth];
  };

  $(function() {

    // phzw init
    if (!phzw.length) {
      $(body).append('<div id="pixiv-hz-wrap" />');
      phzw = $('#pixiv-hz-wrap').css({
        'position': 'absolute',
        'visibility': 'hidden',
        'opacity': 0,
        'box-shadow': '0 0 0 3px #fff, 0 0 3px 3px',
        'transition': 'all .3s',
        'z-index': '1000'
      });

      phzw.on('mouseenter', function() {
        phzw.one('mouseleave', function() {
          phzwToggle(false);
        });
      });
    }

    // delay pre-load data in page
    setTimeout(function() {
      pullIdsData(getAllId());
    }, 1000);

    $('#wrapper').on('mouseenter.phzw', 'a', function(e) {
      var _match = $(this).attr('href').match(phzwPattern);

      if (!_match) { return; }

      var _id = _match.pop();

      e.stopPropagation();
      updatePos(this);

      if (phzwAPICache[_id]) {
        render(_id);
      } else {
        $.when(pullIdsData([_id]))
          .then(function() {
            render(_id);
          });
      }
    });

    $(document).on('click.phzw', function() {
      phzwToggle(false);
    });

    if (isAutoLoadNextPage) {
      pager.container = $('.pager-container').eq(0);

      if (!pager.container.length) { return; }

      pager.current = pager.container.find('li.current').text();
      pager.baseHref = pager.container.find('a')[0].href.replace(/&p=\d+/, '');
      pager.parent = $('._image-items').eq(0).parent();

      var autoLoadNextPage = function() {
        var nextPage = pager.current * 1 + 1;
        var nextPageHref = pager.baseHref + '&p=' + nextPage;
        var separator = '<hr style="border: 1px dashed #ccc" /><a href="' + nextPageHref + '">::: page: ' + nextPage + '</a>';

        if (nextPage > pager.max) {
          $(window).off('scroll.autoLoadNextPage');
          return;
        }

        // prepare a div container for ajax lond next-page content
        $('<div />').appendTo( pager.parent.append(separator) )
          .load(nextPageHref + ' ._image-items', function(_html) {
            pager.current = nextPage;
            pager.loading = false;

            // check for max page
            var nextPagerLists = _html.match(/pager-container.+?(<ul .+?<\/ul>)/).pop();
            pager.max = $(nextPagerLists).find('li').last().text() * 1;
          });
      };

      $(window).on('scroll.autoLoadNextPage', function() {
        if (!pager.loading && (pager.parent[0].getBoundingClientRect().bottom < document.documentElement.clientHeight * .3)) {
          pager.loading = true;
          autoLoadNextPage();
        }
      });
    }

    $('.link-item').eq(0).prepend('<button>-♥ preload all ♥-</button>').find('button').on('click', function(e) {
      e.preventDefault();

      $.when(pullIdsData(getAllId()))
        .then(function() {
          $.each(phzwAPICache, function(key, val) {
            // forcedly preload
            $('<img src="' + val.url[imgSize] + '">');
          });
        });

    });
  });

})(window, document, jQuery, undefined);
