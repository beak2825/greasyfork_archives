// ==UserScript==
// @name         Sliding Navbar for douban
// @name:zh-CN   豆瓣悬停式导航栏
// @namespace    caomu.douban.sliding.navbar
// @version      0.4
// @description  Add Sliding Sub-Navbar for douban.com
// @description:zh-CN 为豆瓣增加悬停式二级导航
// @author       footroot <caomu>
// @include      https://*.douban.com/*
// @include      http://*.douban.com/*
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/24984/Sliding%20Navbar%20for%20douban.user.js
// @updateURL https://update.greasyfork.org/scripts/24984/Sliding%20Navbar%20for%20douban.meta.js
// ==/UserScript==

var cssStr =
'.bn-sp a[data-moreurl-dict]{color:#d5d5d5 !important}'
+'.bn-sp a[data-moreurl-dict]:hover{color:#fff !important}'
+'.subnav{position: absolute !important;left: -999em !important;display: block !important;z-index:90 !important;padding: 10px 0; border: 1px solid #e6e6e6; background: #fff; white-space: nowrap; top: 28px;}'
+'.subnav{} .bn-sp:hover .subnav {left: auto !important;display: block !important}'
+'.subnav a {color: #3d3d3d !important;display: block !important;padding: 0 20px !important;line-height: 28px !important;}'
+'.subnav a:hover {background-color: #f6f6f6 !important;}'

GM_addStyle(cssStr)

var _uid = $('.global-nav-items ul li a').data('moreurl-dict').uid;
var _mine = (_uid === "0") ? "mine" : "people/" + _uid;
$('.top-nav-doubanapp').hide();

var _navList = {
  'main': [
    {'name':'浏览发现', 'link':'explore'},
    {'name':'发现条目', 'link':'subject/explore'},
    {'name':'移动应用', 'link':'app'},
    {'name':'游戏', 'link':'game'},
    {'name':'线上活动', 'link':'online'},
    {'name':'我的主页', 'link':'mine'},
    {'name':'广播', 'link':'mine/statuses'},
    {'name':'相册', 'link':'mine/photos'},
    {'name':'日记', 'link':'mine/notes'},
    {'name':'喜欢', 'link':_mine + '/likes'},
    {'name':'豆列', 'link':'mine/doulists'},
    {'name':'地方', 'link':'trip/mine'}
  ],
  'book': [
    {'name':'我读', 'link':'mine'},
    {'name':'书评', 'link':_mine + '/reviews'},
    {'name':'笔记', 'link':_mine + '/annotation'},
    {'name':'豆列', 'link':_mine + '/doulists'},
    {'name':'动态', 'link':'updates'},
    {'name':'豆瓣猜', 'link':'recommended'},
    {'name':'分类浏览', 'link':'tag'},
    {'name':'购书单', 'link':'cart'},
    {'name':'排行榜', 'link':'chart'},
    {'name':'书评专区', 'link':'review/best'}
  ],
  'movie':[
    {'name':'我看', 'link':'mine'},
    {'name':'影评', 'link':_mine + '/reviews'},
    {'name':'问答', 'link':_mine + '/question'},
    {'name':'豆列', 'link':_mine + '/doulists'},
    {'name':'影讯', 'link':'nowplaying'},
    {'name':'选电影', 'link':'explore'},
    {'name':'电视剧', 'link':'tv'},
    {'name':'排行榜', 'link':'chart'},
    {'name':'豆瓣猜', 'link':'recommended'},
    {'name':'分类', 'link':'tag'},
    {'name':'热门影评', 'link':'review/best'}
  ],
  'music':[
    {'name':'我听', 'link':'mine'},
    {'name':'音乐动态', 'link':_mine + '/update'},
    {'name':'乐评', 'link':_mine + '/reviews'},
    {'name':'我的歌单', 'link':_mine + '/programme'},
    {'name':'豆列', 'link':_mine + '/doulists'},
    {'name':'音乐人', 'link':'artists'},
    {'name':'专题', 'link':'topics'},
    {'name':'排行榜', 'link':'chart'},
    {'name':'豆瓣猜', 'link':'recommended'},
    {'name':'分类浏览', 'link':'tag'},
    {'name':'最新乐评', 'link':'review/latest'},
    {'name':'歌单', 'link':'programmes'}
  ],
  'location':[
    {'name':'我的同城', 'link':'mine'},
    {'name':'近期活动', 'link':'evets'},
    {'name':'舞台剧', 'link':'drama'},
    {'name':'剧评', 'link':'drama/review/best'}
  ],
  'group':[
    {'name':'我的小组', 'link':'mine'},
    {'name':'加入', 'link':_mine + '/joins'},
    {'name':'发起', 'link':_mine + '/publish'},
    {'name':'回应', 'link':_mine + '/reply'},
    {'name':'喜欢', 'link':_mine + '/likes'},
    {'name':'推荐', 'link':_mine + '/recommendations'},
    {'name':'话题精选', 'link':'explore'}
  ],
  'read':[
    {'name':'我的订阅', 'link':'subscriptions'},
    {'name':'最近阅读', 'link':'reader'},
    {'name':'购物车', 'link':'account/wishlist'}
  ],
  'fm':[
    {'name':'兆赫', 'link':'explore/channels'},
    {'name':'歌单', 'link':'explore/songlists'},
    {'name':'我的FM', 'link':'mine'}
  ],
  'commodity':[
    {'name':'我的东西', 'link':_mine},
    {'name':'豆列', 'link':'doulists'},
    {'name':'海淘', 'link':'haitao'},
    {'name':'图文', 'link':'articles'}
  ],
  'market':[
    {'name':'个人中心', 'link':'people'},
    {'name':'购物车', 'link':'cart'}
  ]
};

function init(){
  var aInLi = $('.global-nav-items ul li').children('a[data-moreurl-dict]');
  aInLi.parent().addClass('bn-sp');
  aInLi.each(function(){
    var _t = $(this), _dict = _t.data('moreurl-dict');
    if(_dict){
      var _from = _dict.from;
      var _navClass = _from.replace('top-nav-click-','');
      newSubNav(_t, _navClass);
    }
  })
}

function newSubNav(that, navClass){
  var _t = that, _nc = navClass, _nl = _navList[_nc], _loc = _t.prop('origin') + _t.prop('pathname');
  _loc = _loc.replace(/\/$/,'') + '/';
  var _targetOn = _t.parent().hasClass('on'), _target = _targetOn ? '' : '_blank'
  if (_nl){
    _t.after($('<div class="more-items subnav nav-' + _nc + '">'));
    $('.nav-' + _nc).append($('<table>'));
    for (var i in _nl) {
      var _str = '<tr><td><a href="' + _loc + _nl[i].link
      + '" target="'+_target+'">' + _nl[i].name + '</a></td></tr>'
      _t.next().children('table').append($(_str))
    }
  }
}

var _nav = $('#db-global-nav');
if(_nav.length > 0){
  init();
}
