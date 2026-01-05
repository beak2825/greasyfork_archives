// ==UserScript==
// @name           Virtonomica: Подсветка в отчете по производству
// @namespace      virtonomica
// @include        http*://*virtonomic*.*/*/main/company/view/*/sales_report/by_produce
// @include        http*://*virtonomic*.*/*/main/company/view/*/sales_report/by_consume
// @description    Подсветка по качу производства относительно среднереалмового в отчете по производству
// @version        1.6
// @downloadURL https://update.greasyfork.org/scripts/23886/Virtonomica%3A%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B5%20%D0%BF%D0%BE%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/23886/Virtonomica%3A%20%D0%9F%D0%BE%D0%B4%D1%81%D0%B2%D0%B5%D1%82%D0%BA%D0%B0%20%D0%B2%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%D0%B5%20%D0%BF%D0%BE%20%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D1%83.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  function getLocale() {
    return (document.location.hostname === 'virtonomica.ru') ? 'ru' : 'en';
  }
  function getRealm(){
    var svHref = window.location.href;
    var matches = svHref.match(/\/(\w+)\/main\/company\/view\//);
    return matches[1];
  }
  var avProductIdByImgSrc = [];
  function mainByProduce(){
    //#mainContent > div:nth-child(10) > a > div:nth-child(1) > span:nth-child(5)
    //#mainContent > div:nth-child(10) > a > div:nth-child(1) > span:nth-child(6)
    var path1 = '> a.c_row > div:nth-child(1) > span:nth-child(5)';
    var path2 = '> a.c_row > div:nth-child(1) > span:nth-child(6)';
    var path3 = '> a.c_row > div:nth-child(1) > span:nth-child(2) > img';
    var rows = [];
    var redCnt = 0;
    var greenCnt = 0;
 	var realm = getRealm();

    $('div:has(a.c_row):has(div):has(span.c_qty)').each(function(){
      var row = $(this); 
      var cell1 = $(path1, row); 
      var cell2 = $(path2, row); 
      var id_product = avProductIdByImgSrc[$(path3, row).attr('src')];
      var val1 = parseFloat(cell1.text());
      var val2 = parseFloat(cell2.text());
      if(val1 > val2 || val2 > val1) {
        if(val1 < val2) {
          cell1.css('color','red'); 
          redCnt += 1;
        } else {
          cell1.css('color','green');
          greenCnt += 1;
        }
      	cell1.append('&nbsp;<a name="open_calc_avg" target="_blank" href="http://cobr123.github.io/production_above_average/#id_product='+ id_product +'&realm='+ realm +'&sort_col_id=cost&sort_dir=asc">&nbsp;&nbsp;&nbsp;</a>');
        
        //console.log(val1 +' : '+ val2);
        row.attr('qty_diff', val1 - val2 );
        rows.push(row);
      }
    });
    $('a[name="open_calc_avg"]').click(function(){
      var href = $(this).attr('href');
      window.open(href, '');
      return false;
    });

    $('div > span.c_qlt').first().append('<br>(<span style="color: red; font-weight: bold;">'+ redCnt +'</span>/<span style="color: green; font-weight: bold;">'+ greenCnt +'</span>)');

    rows.sort(function(a, b) {
      var val1 = parseFloat($(a).attr('qty_diff'));
      var val2 = parseFloat($(b).attr('qty_diff'));
      return val1 - val2;
    });

    $(rows).each(function() {
      var row = $(this);
      $('#mainContent').append(row);
    });
  }
  
  function mainByConsume(){
    var path1 = '> a.c_row > div:nth-child(1) > span:nth-child(5)';
    var path2 = '> a.c_row > div:nth-child(1) > span:nth-child(6)';
    var path3 = '> a.c_row > div:nth-child(1) > span:nth-child(2) > img';
 	var realm = getRealm();

    $('div:has(a.c_row):has(div):has(span.c_qty)').each(function(){
      var row = $(this); 
      var cell1 = $(path1, row); 
      var cell2 = $(path2, row); 
      var id_product = avProductIdByImgSrc[$(path3, row).attr('src')];
      var val1 = parseFloat(cell1.text());
      var val2 = parseFloat(cell2.text());
      cell1.append('&nbsp;<a name="open_calc_avg" target="_blank" href="http://cobr123.github.io/production_above_average/#id_product='+ id_product +'&realm='+ realm +'&sort_col_id=cost&sort_dir=asc">&nbsp;&nbsp;&nbsp;</a>');
    });
    $('a[name="open_calc_avg"]').click(function(){
      var href = $(this).attr('href');
      window.open(href, '');
      return false;
    });
  }
  
  function preMain(callback){
    var locale = getLocale();
    var realm = getRealm();
    var suffix = (locale === 'en') ? '_en' : '';
    var svUrl = 'https://cobr123.github.io/industry/'+ realm +'/materials'+ suffix +'.json';
    $.getJSON(svUrl, function (data) {
      console.log(svUrl);
      $.each(data, function (key, val) {
        avProductIdByImgSrc[val.s] = val.i;
      });
      callback();
    })
      .fail(function() {
      console.log('error');
    });
  }
  if (/\w*virtonomic\w*.\w*\/\w+\/main\/company\/view\/\w+\/sales_report\/by_produce/.test(window.location)
     ) {
    preMain(mainByProduce);
  } else if (/\w*virtonomic\w*.\w*\/\w+\/main\/company\/view\/\w+\/sales_report\/by_consume/.test(window.location)
     ) {
    preMain(mainByConsume);
  }
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}