// ==UserScript==
// @name           HistogramHeatGraph.user.js
// @namespace      https://gist.github.com/ishitsuka/10175564
// @version        0.20150308
// @description    ニコニコ動画でコメントの盛り上がりをグラフで表示
// @match          http://www.nicovideo.jp/watch/*
// @include        http://www.nicovideo.jp/watch/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3214/HistogramHeatGraphuserjs.user.js
// @updateURL https://update.greasyfork.org/scripts/3214/HistogramHeatGraphuserjs.meta.js
// ==/UserScript==

(function() {

  var style = document.createElement('style'),
      styleText = function() {/*

    #playerContainer {
      text-align: left;
    }
    #playerTabWrapper + div {
      background: repeating-linear-gradient(to top, #000, #222 10px);
      border: 1px solid #000;
      border-top: 0;
      float: left;
      font-size: 0;
      white-space: nowrap;
      width: 670px;
    }
    #playerTabWrapper + div div {
      display: inline-block;
    }
    #playerTabWrapper + div div:hover {
      background: rgba(255, 255, 255, .1);
      -webkit-filter: hue-rotate(180deg);
      filter: hue-rotate(180deg);
    }
    #playerContainer > a {
      cursor: pointer;
      margin-left: 10px;
      text-shadow: rgba(0, 0, 0, .2) 0 1px;
    }
    #comment-list {
      background: #000;
      color: #fff;
      font-size: 12px;
      line-height: 1.25;
      padding: 4px 4px 0;
      pointer-events: none;
      position: absolute;
      z-index: 9999;
    }
    .size_normal #playerTabWrapper + div {
      transform: scaleX(1.336);
      transform-origin: 0;
    }
    .size_normal #playerContainer > a {
      margin-left: 236px;
    }
    .size_small #playerTabWrapper + div,
    .size_small #playerContainer > a,
    #comment-list:empty {
      display: none;
    }

  */};
  styleText = styleText.toString().match(/\/\*([^]*)\*\//)[1];
  style.appendChild(document.createTextNode(styleText));
  document.body.appendChild(style);

  var setScript = function() {

    var setElement = function() {
      $('#playerContainer')
          .append('<div>')
          .append('<a>');
      $('<div>')
          .attr('id', 'comment-list')
          .appendTo('body');
    };

    var setContent = function(barTimeInterval) {

      var videoTotalTime = $('#external_nicoplayer')[0].ext_getTotalTime(),
          barIndex = Math.ceil(videoTotalTime / barTimeInterval),
          listMessages = [],
          listCounts = [],
          barTimePoint = 0,
          listTimes = [],
          lastBarTimeIntervalGap = barTimeInterval - videoTotalTime % barTimeInterval | 0;

      var comments = require('watchapp/init/PlayerInitializer').rightSidePanelViewController;
      comments = comments.getPlayerPanelTabsView()._commentPanelView.getComments().getData();
      comments.some(function(e) {
        if (e.vpos / 1000 > videoTotalTime + 1) {
          videoTotalTime += 10;
          return true;
        }
      });

      for (var i = 0; i < barIndex; i++) {

        listMessages[i] = [];
        listCounts[i] = 0;

        comments.forEach(function(e) {
          var thisTimePoint = e.vpos / 1000;
          if (barTimePoint <= thisTimePoint && thisTimePoint < barTimeInterval + barTimePoint) {
            listMessages[i].push(e);
            listCounts[i]++;
          }
        });

        listMessages[i].sort(function(a, b) { return a.vpos - b.vpos; }).
            forEach(function(e, j) {
              listMessages[i][j] = e.message.replace(/"|<|&lt;/g, ' ').replace(/\n/g, '<br>');
            });
        listMessages[i] = listMessages[i].join('<br>');

        var min = barTimePoint / 60 | 0,
            sec = barTimePoint - min * 60;
        if (sec < 10) sec = '0' + sec;
        listTimes[i] = min + ':' + sec + '-';
        if (i > barIndex - 2) barTimePoint -= lastBarTimeIntervalGap;
        min = (barTimeInterval + barTimePoint) / 60 | 0;
        sec = barTimeInterval + barTimePoint - min * 60;
        if (sec < 10) sec = '0' + sec;
        listTimes[i] += min + ':' + sec;

        barTimePoint += barTimeInterval;

      }

      var listCountMax = Math.max.apply(null, listCounts),
          graphHeight = listCountMax > 10 ? listCountMax : 10,
          playerWidth = 670,
          barColors = [
              '126da2', '1271a8', '1275ae', '1279b4', '137dba',
              '1381c0', '1385c6', '1489cc', '148dd2', '1491d8'
          ],
          barColorRatio = (barColors.length - 1) / listCountMax,
          lastBarWidthRatio = videoTotalTime % barTimeInterval / barTimeInterval,
          barWidth = playerWidth / (lastBarWidthRatio + barIndex - 1),
          $graph = $('#playerTabWrapper').next(),
          $list = $('#comment-list');

      $('#playerContainerWrapper').css('padding-bottom', graphHeight + 11);
      $('.miniBannerAdCloseButton').trigger('click');
      $graph.empty();

      for (i = 0; i < barIndex; i++) {

        var barColor = barColors[listCounts[i] * barColorRatio | 0],
            barBackground = 'linear-gradient(to top,' +
                '#' + barColor + ',' +
                '#' + barColor + ' ' + listCounts[i] + 'px,' +
                'transparent ' + listCounts[i] + 'px,' +
                'transparent)';
        var barText = listCounts[i] ?
            listMessages[i] + '<br><br>' + listTimes[i] + ' コメ ' + listCounts[i] : '';

        if (i > barIndex - 2) barWidth *= lastBarWidthRatio;

        $('<div>')
            .css('background-image', barBackground)
            .data('text', barText)
            .height(graphHeight)
            .width(barWidth)
            .appendTo($graph);

      }

      $graph.children().on({
        'mouseenter': function(e) {
          $list
              .css({
                'left': e.pageX,
                'top': $graph.offset().top - $list.height() - 10
              })
              .html($(this).data('text'));
        },
        'mousemove': function(e) {
          $list.offset({
            'left': e.pageX,
            'top': $graph.offset().top - $list.height() - 10
          });
        },
        'mouseleave': function() { $list.empty(); }
      });

      var $lastBar = $graph.children().last(),
          aaa = $graph.offset().left - $lastBar.offset().left,
          lastBarWidth = $('#playerNicoplayer').width() < 898 ? aaa + 671 : (aaa + 897) * 672 / 898;
      $lastBar.width(lastBarWidth > 1 ? lastBarWidth : 1);

      $graph.next()
          .on('click', function(e) { setContent(e.ctrlKey ? 60 : 10); })
          .text('コメ ' + comments.length);

      navigator.userAgent.match(/Chrome/) && $list.css('background', 'rgba(0, 0, 0, .5)');

    };

    var npc = require('watchapp/model/player/NicoPlayerConnector');
    require('advice').after(npc, 'onCommentListInitialized', function() {
      !$('#comment-list')[0] && setElement();
      setTimeout(setContent, 1000, 10);
    });

  };

  setTimeout(function() {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('(' + setScript + ')()'));
    document.body.appendChild(script);
  }, 100);

})();