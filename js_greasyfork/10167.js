// ==UserScript==
// @name         가격 비교를 위한 열 추가 g, 가격 with Firefox | 이마트
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        http://emart.ssg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10167/%EA%B0%80%EA%B2%A9%20%EB%B9%84%EA%B5%90%EB%A5%BC%20%EC%9C%84%ED%95%9C%20%EC%97%B4%20%EC%B6%94%EA%B0%80%20g%2C%20%EA%B0%80%EA%B2%A9%20with%20Firefox%20%7C%20%EC%9D%B4%EB%A7%88%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/10167/%EA%B0%80%EA%B2%A9%20%EB%B9%84%EA%B5%90%EB%A5%BC%20%EC%9C%84%ED%95%9C%20%EC%97%B4%20%EC%B6%94%EA%B0%80%20g%2C%20%EA%B0%80%EA%B2%A9%20with%20Firefox%20%7C%20%EC%9D%B4%EB%A7%88%ED%8A%B8.meta.js
// ==/UserScript==

$(document).ready(function(){
    /**/
    $('.lst_item col[style="width:540px;"]').after('<col style="width:50px;" />')
    $('table th span:contains("상품정보")').parents('th').after('<th scope="col">무게</th>');
    
    
    $('.lst_item .item_info .title').each(function(key, el){
      try {
      var $title = $(el).find('a:last()');
      var gramInfo = $title.text().match(/[\,.0-9]+(g|kg)/g) ? $title.text().match(/[\,.0-9]+(g|kg)/g).pop().replace(',','') : '직접확인';
      
      if(gramInfo.match(/kg/g)){
        gramInfo = parseInt(gramInfo)*1000;
      }
       
      gramInfo = gramInfo.replace('kg','').replace('g','');
    
      $title.parents("td").after('<td>'+gramInfo+'</td>');
      } catch(e) {console.log('error', e)}
    });
    
    $('.lst_item .item_info .price').each(function(key, el){
      var price = $(el).find('strong').text().replace(',','');
      $(el).parents('td').text(price);
    });
    /**/
});