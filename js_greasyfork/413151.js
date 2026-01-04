// ==UserScript==
// @name        Tattermunge
// @include     https://wear.jp/item/*
// @version     1
// @description:ja 人気商品の古着を探してみませんか？
// @license      MIT
// @namespace https://greasyfork.org/users/694820
// @description 人気商品の古着を探してみませんか？
// @downloadURL https://update.greasyfork.org/scripts/413151/Tattermunge.user.js
// @updateURL https://update.greasyfork.org/scripts/413151/Tattermunge.meta.js
// ==/UserScript==


console.time('timer1');
 (function(doc) {
  'use strict';

  var matchHost = {

   'ヤフオク': function () {
    return {x: "http://auctions.search.yahoo.co.jp/search?auccat=&tab_ex=commerce&ei=utf-8&aq=-1&oq=&sc_i=&fr=auc_top&p=" ,y: "ヤフオク"};
   },

  'メルカリ': function () {
    return {x: "https://www.mercari.com/jp/search/?keyword=" ,y: "メルカリ"};
   },

   'ラクマ': function () {
    return {x: "https://fril.jp/search/" ,y: "ラクマ"};
   }
  };

  //var check = function() {
    setTimeout(function(){

   if (!doc.querySelector('ec_list ul')) {

    var div = doc.createElement('div');
        div.setAttribute('class', 'ec_list');
    var ul = doc.createElement('ul');
    var li = doc.createElement('li');

    ul.appendChild(li);
    div.appendChild(ul);
    doc.querySelector('.ec_list').appendChild(div);

   }
   var text = doc.querySelector('#item_info h1').firstChild.nodeValue;
    var forming =  text.replace(/[<\[【［＜(].+?[】］＞\])>]/g, "").replace(/[^ぁ-んァ-ヶ亜-熙a-z-ー0-9]/ig, " ");
    var domains = ["ヤフオク", "メルカリ", "ラクマ"];
    var fragment = doc.createDocumentFragment();
    var a = doc.createElement('a');
        a.setAttribute('target', '_blank');
    var p = doc.createElement('p');
        p.setAttribute('class', 'shop_name');

    for (var domain of domains) {
     var a = a.cloneNode(false);
         a.setAttribute('href', matchHost[domain]().x + forming);
     var p = p.cloneNode(false);
         p.appendChild(doc.createTextNode(matchHost[domain]().y+'で購入する'));

     a.appendChild(p);
     fragment.appendChild(a);
    }
    doc.querySelector('.ec_list ul li:last-child').appendChild(fragment);
  //};
}, 0);
   //setTimeout(check , 0);
})(document);

console.timeEnd('timer1');