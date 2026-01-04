// ==UserScript==
// @name         Psnine
// @version      0.2
// @description  P9价格增强插件
// @author       DiamondYuan
// @match        http*://psnine.com/psngame/*
// @grant        none
// @require https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @namespace https://greasyfork.org/users/174952
// @downloadURL https://update.greasyfork.org/scripts/39508/Psnine.user.js
// @updateURL https://update.greasyfork.org/scripts/39508/Psnine.meta.js
// ==/UserScript==
var div
(function () {
  'use strict';
  div = document.querySelector('.ml100')
  var title = document.querySelector('.ml100>p')
  if (!title) {
    return
  }
  name = title.innerText
  post(name)
  search(name, 'JAPAN');
  search(name, 'HONG_KONG');
  search(name, 'UNITED_STATES');
})();


function search(gameName, region) {
  var result;
  $.ajax({
    url: 'https://services.diamondyuan.com/365call-api/api/v1/games?name=' + gameName + '&region=' + region + '&game_content_type=GAMES&page=1&page_size=1',
    type: 'GET',
    async: true,
    timeout: 5000,
    dataType: 'json',
    success: function (data) {
      node = handle(data, region);
      if (node) {
        div.appendChild(handle(data, region))
      }
    },
  })
}

function handle(result, region) {
  console.log(result)
  var node = document.createElement("a");
  const game = result.data.list[0];
  if (!game) {
    return null
  }
  const plusPrice = game.plus_user_price;
  const plusDiscount = game.plus_discount_percentage;
  const name = game.name;
  const rate = result.data.ex_change.rate
  const exchangeName = result.data.ex_change.name
  const cnyPrice = (plusPrice / rate / 100).toFixed(2)
  var url = 'https://365call.diamondyuan.com/playstation/' + game.id + '?region=' + region
  node.href = url
  node.style.display = 'block'
  node.innerText = '原价' + plusPrice / 100 + exchangeName + ' 人民币: ' + cnyPrice + ' 折扣  ' + plusDiscount + '  商品名称 ' + name
  return node
}

function post(name, translate) {
  postDate = {
    name: name,
    translate: document.querySelector('body > div.inner.mt40 > div.main > div.box.pd10 > h1').innerText,
    url: document.URL
  }

  $.ajax({
    url: 'https://services.diamondyuan.com/365call-api/api/v1/psnine',
    type: 'POST',
    async: true,
    timeout: 5000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(postDate),
    success: function () {
      console.log('post success')
    },
    error: function () {
      console.log('post error')
    },
  })
}