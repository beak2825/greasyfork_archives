// ==UserScript==
// @name       hide douban feeds
// @namespace  http://houkanshan.github.io/
// @version    0.6.0
// @description  I dont care.
// @match      http*://www.douban.com/*
// @require     http://libs.baidu.com/underscore/1.3.3/underscore-min.js
// @require    http://libs.baidu.com/jquery/2.0.3/jquery.min.js
// @copyright  2014+, Houkanshan
// @downloadURL https://update.greasyfork.org/scripts/4562/hide%20douban%20feeds.user.js
// @updateURL https://update.greasyfork.org/scripts/4562/hide%20douban%20feeds.meta.js
// ==/UserScript==
//
// GistID: 3a48bf702e115e1ae966

var blockedCSS = (function () {/*
.blocked-feed .mod {
  height: 54px;
  overflow: hidden;
  opacity: 0.2;
  margin-bottom: 14px;
}
.blocked-feed .action-block:before {
  content: '+';
}
.action-block:before {
  content: '×';
  float: right;
  color: #ebebeb;
  margin-top: -16px;
  height: 12px;
  width: 12px;
  line-height: 12px;
  vertical-align: middle;
  display: block;
  cursor: pointer;
}
.status-wrapper .others {
  bottom: auto!important;
  position: static!important;
  width: 100%;
}
.status-wrapper .actions {
  display: block!important;
  position: static!important;
}
.status-real-wrapper .actions {
  padding-bottom: 0;
}
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
insertCSS(blockedCSS)


var softBlockWords = ['李易峰', '股市', '套牢', '大盘', '调整', '跌停', '大跌', '跳水', '跌', '抄底', '做空', '月饼', '发工资', '某荚', '贵荚', '豌豆荚', '宋冬野', '烂体验体验站']
var hardBlockWords = ['要参加线上活动', '八卦来了']
var blockIdKey = 'blocked_feed_ids'
var blockIds = localStorage[blockIdKey] ? JSON.parse(localStorage[blockIdKey]) : []
var whiteWords = []

var listSel = '.stream-items'
var feedSel = '[data-sid]'
var idBlockedSel = '[data-sid="' + blockIds.join('"], [data-sid="') + '"]'

var list = $(listSel)
var feeds = list.find(feedSel)
var blockedFeeds = list.find(idBlockedSel)

//$('.status-wrapper').find('.actions').attr('style', 'position:static!important;display:block!important').end()
$('.status-real-wrapper').off('click').css('margin-top', 0)

blockedFeeds =  blockedFeeds.add(feeds.filter(function(i, el) {
  var text = el.textContent
  var hardRemove = _.some(hardBlockWords, function(word) {
    return text.match(word)
  })
  if (hardRemove) {
    el.remove()
    return false
  }
  return _.some(softBlockWords, function(word) {
    return text.match(word)
  }) && !_.some(whiteWords, function(word) {
    return text.match(word)
  })
}))

blockedFeeds.addClass('blocked-feed')
feeds.prepend('<span class="action-block">')

list.on('click', '.action-block', function(e){
  var el = $(e.currentTarget)
  var feed = el.closest(feedSel)
  var sid = feed.data('sid')
  var hasBlocked = feed.is('.blocked-feed')

  if (hasBlocked) {
    blockIds = _.without(blockIds, sid)
    localStorage[blockIdKey] = JSON.stringify(blockIds)
    feed.removeClass('blocked-feed')
  } else {
    blockIds.push(sid)
    localStorage[blockIdKey] = JSON.stringify(blockIds)
    feed.addClass('blocked-feed')
  }
})

list.on('click', '.blocked-feed', function(e) {
  var el = $(e.currentTarget)
  el.removeClass('blocked-feed')
})


function insertCSS(css, options) {

    var elem = document.createElement('style');
    elem.setAttribute('type', 'text/css');

    if ('textContent' in elem) {
      elem.textContent = css;
    } else {
      elem.styleSheet.cssText = css;
    }

    var head = document.getElementsByTagName('head')[0];
    if (options && options.prepend) {
        head.insertBefore(elem, head.childNodes[0]);
    } else {
        head.appendChild(elem);
    }
};