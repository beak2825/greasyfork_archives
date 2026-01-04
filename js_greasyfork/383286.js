// ==UserScript==
// @name        Tsumino Tweaks
// @description Offline tag search support, nhentai/Hentai2Read links on a book information page and click popup disabling
// @namespace   xspeed.net
// @license     MIT
// @version     8
// @icon        https://cdn.discordapp.com/icons/167128230908657664/b2089ee1d26a7e168d63960d6ed31b66.png
// @match       *://www.tsumino.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383286/Tsumino%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/383286/Tsumino%20Tweaks.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // https://gist.github.com/IceCreamYou/8396172
  function distDamerauLevenshtein(source, target) {
    if (!source) return target ? target.length : 0;
    else if (!target) return source.length;

    var m = source.length, n = target.length, INF = m+n, score = new Array(m+2), sd = {};
    for (var i = 0; i < m+2; i++) score[i] = new Array(n+2);
    score[0][0] = INF;
    for (var i = 0; i <= m; i++) {
        score[i+1][1] = i;
        score[i+1][0] = INF;
        sd[source[i]] = 0;
    }
    for (var j = 0; j <= n; j++) {
        score[1][j+1] = j;
        score[0][j+1] = INF;
        sd[target[j]] = 0;
    }

    for (var i = 1; i <= m; i++) {
        var DB = 0;
        for (var j = 1; j <= n; j++) {
            var i1 = sd[target[j-1]],
                j1 = DB;
            if (source[i-1] === target[j-1]) {
                score[i+1][j+1] = score[i][j];
                DB = j;
            }
            else {
                score[i+1][j+1] = Math.min(score[i][j], Math.min(score[i+1][j], score[i][j+1])) + 1;
            }
            score[i+1][j+1] = Math.min(score[i+1][j+1], score[i1] ? score[i1][j1] + (i-i1-1) + 1 + (j-j1-1) : Infinity);
        }
        sd[source[i-1]] = i;
    }
    return score[m+1][n+1];
  }
  
  var cleanTitle = str => str.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
  
  var jsonError = data => alert(JSON.stringify(data));
  
  unsafeWindow.open = function() {
      console.error('Blocked window.open', Array.prototype.slice.apply(arguments));
      return { }
  };

  unsafeWindow.showModalDialog = function() {
      console.error('Blocked window.showModalDialog', Array.prototype.slice.apply(arguments));
      return { }
  };
  
  String.prototype.removeAfter = function(char) {
    var ix = this.indexOf(char);
    return ix == -1 ? this : this.substring(0, ix);
  }
  
  if (location.href.indexOf('/entry/') != -1) {

    var title = $('#Title').text().removeAfter('/').removeAfter('|').trim();
    var artist = $('a[data-type="Artist"]').text().trim().removeAfter('|').removeAfter('\n').trim();

    $('#backToIndex').remove();
    $('#btnMakeAccount').remove();
    $('#downloadBtnBlocked').remove();

    var createButton = function(btnText, btnTitle, linkUrl) {
      var btn = $('<a href="' + linkUrl + '" id="btnReadNH" class="book-read-button button-stack"><i class="fa fa-arrow-circle-right"></i> ' + btnText + '</a>').insertAfter('#btnReadOnline');
      btn.mouseover(function() {
        btn.tooltip({
          trigger: 'focus',
          delay: {
            "show": 500,
            "hide": 100
          },
          html: true,
          title: btnTitle
        });
        btn.focus();
      });
      btn.mouseout(() => btn.blur());
    }
    
    var onNH = function(resp) {
      var respDoc = $(resp.responseText);
      var cover = respDoc.find('.cover');
      if (cover && cover.attr('href')) {
        cover = cover.map((i, elem) => ({ link: $(elem).attr('href'), title: cleanTitle($(elem).find('.caption').text()), score: distDamerauLevenshtein(title, cleanTitle($(elem).find('.caption').text())) }));
        cover.sort((x, y) => x.score - y.score);
        createButton('nhentai', cover[0].title, 'https://nhentai.net' + cover[0].link + '1/');
      }
    }

    var onH2R = function(resp) {
      var respJson = JSON.parse(resp.responseText);
      var suggestions = respJson.response.suggestions;
      if (suggestions.length > 0) {
        createButton('Hentai2Read', suggestions[0].value, suggestions[0].slug + '1/');
      }
    }

    GM_xmlhttpRequest({
      method: "GET",
      url: 'https://nhentai.net/search/?q=english+' + artist.replace(' ', '+') + '+' + title.replace(/[^a-z0-9+]+/gi, '+'),
      onload: onNH,
      onerror: jsonError
    });

    GM_xmlhttpRequest({
      method: "POST",
      url: 'https://hentai2read.com/api',
      data: 'controller=search&action=all&query=' + encodeURIComponent(title.replace(/\s+#?\d\s*$/, '')),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      onload: onH2R,
      onerror: jsonError
    });
  }

  else {

    var tagSearch = $('#tagDataSearch');
    if (tagSearch.length) {

      var tagMode = false;
      var tagData = GM_getValue('tagData', '[]');
      var tagList = JSON.parse(tagData);
      var oldAdapter = null;

      var offlineQuery = function(params, callback) {
        var res = [];

        if (params && params.term && params.term.length != 0) {
          var term = params.term.toLowerCase();

          for (var tag of tagList) {
            if (tag[0].toLowerCase().indexOf(term) != -1) {
              res.push(tag[0]);
              if (res.length > 4) break;
            }
          }
        }

        callback({ results: res.map(x => ({ key: 0, text: x, id: x })) });
      };

      tagSearch.next().html('<button id="tagsRefresh" type="button" class="book-read-button" style="padding: 5px 10px; margin: 5px 0;">Refresh tag list</button> Loaded tags: <span id=tagsCount>0</span>')

      $('#tagsCount').text(Object.keys(tagList).length);

      $('#selTagType').change(function() {

        var selData = $('#selTagValue').data('select2');

        if ($(this).val() == 1 && !tagMode) {
          oldAdapter = selData.dataAdapter.query;
          tagMode = true;
          selData.dataAdapter.query = offlineQuery;
        }
        else if (tagMode) {
          selData.dataAdapter.query = oldAdapter;
          tagMode = false;
        }

      });

      $('#btnSearch').one('click', function() {
        $('#selTagType').change();
      });

      $('#tagsRefresh').click(function() {

        this.disabled = true;
        $('#tagsCount').text('0...');

        var onload = function(resp) {
          var respDoc = JSON.parse(resp.responseText);
          
          tagList = [];

          for (var i = 0; i < respDoc.length; ++i) {
            if (respDoc[i].type == "Tag") {
              var id = respDoc[i].text.trim();
              if (id.length > 0) tagList.push([id, 1]);
            }
          }

          $('#tagsCount').text(Object.keys(tagList).length);
          GM_setValue('tagData', JSON.stringify(tagList));

          $('#tagsRefresh').prop('disabled', false);

        };

        GM_xmlhttpRequest({ method: "GET", url: 'https://www.tsumino.com/api/Tag/GetAllDefinableTags', onload: onload, onerror: jsonError });

      });
    }
  }
})();