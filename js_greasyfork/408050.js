// ==UserScript==
// @name        Virtonomica:Diyacom_Supply
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.7
// @author      Diyacom
// @description Модификация страницы "Снабжение"
// @include     http*://*virtonomic*.*/*/main/unit/view/*/supply*
// @include     http*://*virtonomic*.*/api/*/main/unit/supply/summary*
// @include        http*://*virtonomic*.*/api/*/main/unit/supply/set*
// @match       https://virtonomica.ru/api/vera/main/unit/supply/summary
// @downloadURL https://update.greasyfork.org/scripts/408050/Virtonomica%3ADiyacom_Supply.user.js
// @updateURL https://update.greasyfork.org/scripts/408050/Virtonomica%3ADiyacom_Supply.meta.js
// ==/UserScript==

  var run = function () {

    var href = location.href;
    var id_shop = /(\d+)/.exec(location.href)[0];
 	  var realm = href.replace('https://virtonomica.ru/','');
    realm = realm.substr(0,4);
 	  var link_api = `https://virtonomica.ru/api/${realm}/main/unit/summary?id=${id_shop}`;

    function p_q_f(price, quality) {
      if (price == undefined){
        return;      }
      if (!parseInt(price) && price != '' ) {
        price = price.replace(/\s/g, '');
        price = /(\d+\.*\d*)/.exec(price);
        price = price[1];
      }
      if (!parseInt(quality) && quality != '' ) {
        quality = quality.replace(/\s/g, '');
        quality = /(\d+\.\d+)/.exec(quality);
        if ( quality != null ) {
          quality = quality[1];
        } else return '';
      }
      return (price / quality).toFixed(2);
    }

    function Edit_item(selector){
      var price_s = $("td.text-right.text-middle.offer_price", selector);
      if (price_s.text().length > 0 ) {
        var price_a = /(\d+\.*\d*)/.exec(price_s.text().replace(/\s/g, ''));
        if ( price_a != null ) {
          var price = price_a[1];
          
          var quality_s = $("td.text-right.text-middle.quality", selector);
          if (quality_s.text().length > 0 ) {
            var quality_a = /(\d+\.\d+)/.exec(quality_s.text());
            if ( quality_a != null ) {
              quality = quality_a[1];
          if ( quality != null ) {
          };
          var p_q = (price / quality).toFixed(2);
          console.log(price, quality );
          price_s.append('<span> / '+p_q+'</span>').css('color', 'blue');
            };
          };
        } else {console.log('false price_a', price_s.text().replace(/\s/g, ''))}
      }
    };
    function Edit_card(selector){
            $('thead > tr > th:nth-child(4)', selector).after('<th class="mob-hide">Ц/К</th>');
            var line = $('tbody > tr', selector);
            line.each(function(id){
              var price_s = $('td.text-right.text-middle.offer_price', this)
              var price = price_s.text();
              var quality = $('td.text-right.text-middle.quality', this).text();
              var p_q = p_q_f(price, quality);
              p_q = $(`<td class="mob-hide">${p_q}</td>`).css('color', 'blue').addClass('text-middle')
              price_s.after(p_q)
            })
    }

    var TC = document.querySelector('div#wrapper');
    if (TC != null) {
      Edit_card(TC);
    }
    var OC = new MutationObserver(function(MC) {
      MC.forEach(function(m_c) {
        if (m_c.addedNodes.length > 1) {
          m_c.addedNodes.forEach(function(mc_an) {
            if (mc_an.nodeName == 'DIV') {
              TC = document.querySelector('div.tabbable-custom');
            }
          })
        }
      })
//      console.log('MC.addedNodes', MC.addedNodes);
      
    })
    var CC = { attributes: false, childList: true, characterData: false, subtree: true }
    OC.observe(TC, CC);
    
    $(window).load(function(){
//    $(document).ready(function() {
//    $(document).load(function() {

      var target_card = document.querySelector('div#mainContent');
//      console.log(target_card);
//      console.log(target_card.childNodes);

      if (target_card != null) {
           Edit_card(target_card);
      }
      var observer_card = new MutationObserver(function(mutations_card) {
//        console.log('MC', mutations_card);
        mutations_card.forEach(function(mutation_card) {
          if (mutation_card.addedNodes.length > 3) {
//            console.log(mutation_card.addedNodes);
            mutation_card.addedNodes.forEach(function(card) {
//              console.log(card);
              card = $('div.col-sm-12 > div.table-responsive', card);
              if (card.length > 0) {
//                console.log(card);
                Edit_card(card);
              } //else {console.log('l=0', card)} 

            })
          }
        })
      })
      var config_card = { attributes: false, childList: true, characterData: false, subtree: true }
//      console.log(target_card, config_card)
      observer_card.observe(target_card, config_card);

  

   // Отслеживаем нажатие кнопки "заказ"
      var target = document.querySelector('div.modal');
       // создаем экземпляр наблюдателя
      var observer = new MutationObserver(function(mutations) {
        var modal = $('#materials-offer-list > div > table', target);
//          console.log(modal);
          mutations.forEach(function(mutation) {
//            console.log(mutation.addedNodes.length);
            if (mutation.type == 'childList' && mutation.addedNodes.length > 1) {
              console.log('Debug', mutation);
              mutation.addedNodes.forEach(function(mc_an) {
                if (mc_an.nodeName == 'DIV') {
                  console.log('mc_an = ', mc_an);
                  console.log($('thead > tr', this));
                  console.log('DL = ', $('div.table-responsive').length)
                  $('thead > tr', mc_an).append('<th class="mob-hide">Ц/К</th>');
                }
              })
                

//            console.log('Debug', $('thead', modal));
            var line = $('tbody > tr', modal);
            line.each(function(id){
              var price = $('td.text-right.text-middle.money.trans-price-total', this).text();
              var quality = $('td.text-right.text-middle.money.trans-quality', this).text();
              var p_q = p_q_f(price, quality);
              $(this).append(`<td class="mob-hide" style = "background-color:#e4fffe">${p_q}</td>`);
            })
          }
          });    
      });
      // настраиваем наблюдатель
      var config = { attributes: false, childList: true, characterData: false, subtree: true }
      // передаем элемент и настройки в наблюдатель
      observer.observe(target, config);
      // позже можно остановить наблюдение
//      observer.disconnect();      
    });
  };
run();
/*  
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
*/