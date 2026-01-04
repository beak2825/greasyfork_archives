// ==UserScript==
// @name Bilibili屏蔽首页上不想看的视频
// @namespace Max's Scripts
// @version 1.3.3
// @author Max
// @license MIT
// @include https://www.bilibili.com/*
// @require http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant none
// @description 有的视频真的不想点开,比如恐怖的,连预览都不想看到,但却总是出现在首页上。现在点击视频预览图右上角的x,不喜欢的视频就会被移除,并被记录在localStorage里,以后都不会再出现在首页了。此操作记录在存本机浏览器,无法应用在别的电脑上,而且如果清除了本机浏览器缓存的话,操作记录也会被重置。
// @downloadURL https://update.greasyfork.org/scripts/373024/Bilibili%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E4%B8%8A%E4%B8%8D%E6%83%B3%E7%9C%8B%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/373024/Bilibili%E5%B1%8F%E8%94%BD%E9%A6%96%E9%A1%B5%E4%B8%8A%E4%B8%8D%E6%83%B3%E7%9C%8B%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
$('head').append(`<style>
  .bili-x-card {position: relative;}
  .bili-x-card > .x {position:absolute !important;width:15px;height:15px;top:0;right:0;font-size:15px;text-align:center;line-height:12px;color:#fff;cursor:pointer;z-index:99;display:none}
  .bili-x-card:hover > .x {display:block}
</stlye>`);
localStorage.blacklist = localStorage.blacklist || []
localStorage.keywords = localStorage.keywords || []
var findId = (module) => {
  let a = $('> .bili-video-card__wrap > a, > .bili-live-card__wrap > a, > .bili-movie-card__wrap > a, > .bili-cheese-card__wrap > a, .cover-container > a, > a', module).get(0);
  let id = '';
  if(a)
    id = ((a.dataset && a.dataset['data-target-url'] || a.href).match(/(BV[0-9a-zA-Z]+|space\.bilibili\.com\/\d+|live\.bilibili\.com\/\d+|manga\.bilibili\.com\/detail\/mc\d+|\/play\/[0-9a-zA-Z]+)|\/activity-[0-9a-zA-Z]+/g) || [null])[0];
  return id
}
setInterval(function(){
  let cards = $('.bili-video-card, .bili-live-card, .bili-bangumi-card, .bili-movie-card, .bili-manga-card, .bili-cheese-card, .floor-single-card');
  let blacklist = localStorage.blacklist.split(',');
  let keywords = localStorage.keywords.split(',');
  cards.each((i, c)=>{
    let card = $(c);
    //if(card.is(':empty'))
    //  return;
    let xid = card.attr('xid');
    if(xid){
      if(blacklist.includes(xid)){
        card.parents('.feed-card,.bili-feed-card').remove();
        console.log('removed', xid.toString());
      }
    } else {
      let x = $('<div class=x>x</div>')
        .click(function(e){
          let card = this.parentNode;
          let id = findId(card);
          if(!id)return false;
          if(id.match(/\?/))
            id = id.slice(0, id.indexOf('?'))
          blacklist.push(id);
          localStorage.setItem('blacklist', blacklist);
          $(card).parents('.feed-card,.bili-feed-card').remove();
          console.log('removed', id.toString())
          e.stopPropagation();
          if(card.href){
            card.href = 'javascript:void(0)'
            card.target = '_self'
          }
        });
      if(!card.hasClass('bili-x-card'))
        card.addClass('bili-x-card').append(x).attr('xid', findId(card.get(0)));
    }
  });
  $('.feed-card,.bili-feed-card').filter((i, card) => !card.querySelector('a')).remove()
  $('.bili-video-card__info--ad-img').parents('.feed-card').remove()
}, 1000)