// ==UserScript==
// @name        Virtonomica:Diyacom_Sale
// @namespace   Violentmonkey Scripts
// @include     http*://virtonomic*.*/*/main/unit/view/*/sale*
// @include     http*://virtonomic*.*/*/main/geo/citylist/*
// @grant       none
// @version     1.0
// @author      -
// @description Модификация страницы "Сбыт"
// @downloadURL https://update.greasyfork.org/scripts/408936/Virtonomica%3ADiyacom_Sale.user.js
// @updateURL https://update.greasyfork.org/scripts/408936/Virtonomica%3ADiyacom_Sale.meta.js
// ==/UserScript==

//    alert('FFF');
  function ENVD_Save(){
        $.ajax({
          url: "https://virtonomica.ru/api/vera/main/geo/region/envd?format=json&region_id=331858", // строка, содержащая URL адрес, на который отправляется запрос
          success: function(data){
//          console.log(data.data);
            window.localStorage.setItem('ENVD', JSON.stringify(data.data));
	  	      var EN = JSON.parse(window.localStorage.getItem('ENVD'));
            for (var key in EN) {
              console.log(EN[key].product_name)
            }
//            EN.each(function(id){
//              console.log(EN[id]);
//              console.log(id);
//            })
          },
          statusCode: {
            200: function () { // выполнить функцию если код ответа HTTP 200
              console.log( "Ok" );
            }
          }
        })
  }
  function SetPrice(inp){
    var sel = '#Price_'+inp;
//    alert(sel);
    $(sel).val(333);
    console.log($(sel));
  };

  var ENVD = JSON.parse(window.localStorage.getItem('ENVD'));

//  Выполняем скрипт после прогрузки страницы
  $(document).ready(function() {

var script = document.createElement("script");
script.textContent = SetPrice.toString();
document.documentElement.appendChild(script);
//    Подправляем ширину колонки
    $('div.edit_field_price > input').css('width', '35%');

//  Получаем селектор на карточку продукта    
    var cards = $('#main-tab > div > div > div.sales-cards');
//  С каждой карточкой выполнем...    
    cards.each(function(id){
//      Получаем id продукта и помечаем карточку для удобства редактирования в дальнейшем
      var product_id = $('form > input[name="product_id"]', this).val();
//      console.log($(this));
      $(this).attr('id', 'Card_'+product_id);

      var Price_Edit = $('div > div > form > div.col-sm-3.text-left > div > input', this);
      Price_Edit.attr('id', 'Price_'+product_id);
      
//      var ss = $('div > div > div.col-sm-4 > div > table > tbody > tr:nth-child(3) > td:nth-child(3)', this)//.text();
      var ss = $('div.table-responsive > table > tbody > tr:nth-child(3) > td:nth-child(2)', this)//.text();

//      console.log(ss);
      ss = /(\d+\.*\d*)/.exec(ss.text().replace(/\s/g, ''));
      if ( ss != null ) { ss = Number(ss[1])+0.01};

//      console.log(ENVD[product_id]['tax']);

      var btn_ss = `<div id="SS_${product_id}" class="btn btn-circle btn-success btn-xs">	cc	</div>`;
      
      Price_Edit.parent().before(btn_ss);
      $(`#SS_${product_id}`).css('margin-right','5px');
      if ( ss != null ) { 
        $(`#SS_${product_id}`).click(function(){Price_Edit.val(ss)});
      }    
      
      var ENVD_Val = Number(ENVD[product_id]['tax']);
      var btn_e = `<div id="E_${product_id}" class="btn btn-circle btn-success btn-xs">	+E(${ENVD_Val})	</div>`;
      Price_Edit.parent().before(btn_e);
      if ( ss != null ) {
        ss = Number(ss);
//        var ep = 0.01+ss/100*ENVD_Val+ss;
//        var ep = ss + ENVD_Val;
//        ep = Number(ep + ss);
        $(`#E_${product_id}`).click(function(){Price_Edit.val(ss + ss / 100 * ENVD_Val)});
      } // else{console.log('ss false', ss)}
      
    });

    
//  $(window).ready(function(){
//    var envd_s = $('#envd > table');
    var price_s = $('#main-tab > div > div > div.sales-cards > div > div > form > div.col-sm-3.text-left > div > input');
    
//    price_s.append($(':button.btn-success'));
//    price_s.add(':button.btn btn-circle btn-success btn-xs');
//    price_s.append('<button class="btn">	+11%	</button>');
//    price_s.after('<button class="btn btn-circle btn-success btn-xs">	+11%	</button>');
  })
