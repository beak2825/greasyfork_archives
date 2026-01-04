// ==UserScript==
// @name         露天搜尋自動排序
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  露天搜尋自動排序 - 價錢由低至高
// @author       You
// @match        https://www.ruten.com.tw
// @include      /find.ruten.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377652/%E9%9C%B2%E5%A4%A9%E6%90%9C%E5%B0%8B%E8%87%AA%E5%8B%95%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/377652/%E9%9C%B2%E5%A4%A9%E6%90%9C%E5%B0%8B%E8%87%AA%E5%8B%95%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
  var url = document.location.href;
  if (url.match(/.*&sort=.*/) == null && url.match(/.*find.*/) != null) {
    document.location.href = url + '&sort=prc%2Fac'
  } else if (url.match(/.*&sort=.*/) != null && url.match(/.*find.*/) != null) {
    $(document).off('click', '#topSearchButton')
      .off('click', '#searchButton')
    $(document).on('click', '#topSearchButton', function (e) {
      e.preventDefault();
      var k = $('#topSearchInput').val();
      if (k.replace(/\s/g, '').length > 0) {
        var _href = window.location.pathname + '?' + $.param({
          q: k, sort: 'prc/ac'
        });
        $('#topSearchInput').attr('value', '');
        history.pushState(_href, '', _href);
        $(window).trigger('popstate', [_href]);
      } else {
        alert('請輸入查詢關鍵字');
        $('#topSearchInput').trigger('focus');
      }
    }).on('click', '#searchButton', function (e) {
      e.preventDefault();
      var k = $('#searchInput').val();
      var _objParams = {};
      if (k.replace(/\s/g, '').length > 0 && $.inArray($('#searchForm option:selected').val(), ['q', 'q.id', 'q.seller']) > -1) {
        if ($('#searchForm option:selected').val() == 'q') {
          var _href = window.location.pathname + '?' + $.param({
            q: k, sort: 'prc/ac'
          });
          history.pushState(_href, '', _href);
          $(window).trigger('popstate', [_href]);
        } else {
          $(document).data('BackState', window.location.pathname + window.location.search);
          _objParams[$('#searchForm option:selected').val()] = k;
          var _href = window.location.pathname + '?' + $.param(_objParams);
          history.pushState(_href, '', _href);
          $(window).trigger('popstate', [_href]);
        }
      } else if ($.isNumeric($('#searchForm option:selected').val())) {
        if ($('#searchForm option:selected').val() == '0') {
          if (k.replace(/\s/g, '').length > 0) {
            _objParams = {
              q: k, sort: 'prc/ac'
            };
          } else {
            alert('請輸入查詢關鍵字');
            $('#searchInput').trigger('focus');
            return false;
          }
        } else {
          if (k.replace(/\s/g, '').length > 0) {
            _objParams = {
              cateid: $('#searchForm option:selected').val(),
              q: k, sort: 'prc/ac'
            };
          } else {
            if ($('#searchForm option:selected').val().length == 4) {
              window.location.href = '{0}/category/main?{1}'.format(ruten.CLASS_HOST, $('#searchForm option:selected').val());
            } else {
              window.location.href = '/c/{0}'.format($('#searchForm option:selected').val());
            }
            return false;
          }
        }
        var _href = window.location.pathname + '?' + $.param(_objParams);
        history.pushState(_href, '', _href);
        $(window).trigger('popstate', [_href]);
      } else {
        alert('請輸入查詢關鍵字');
        $('#searchInput').trigger('focus');
      }
    })
  }
})();