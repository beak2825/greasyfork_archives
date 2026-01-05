// ==UserScript==
// @name          Скан продуктов города с сортировкой
// @namespace     Скан продуктов города с сортировкой
// @version 	   0.01
// @description   Скан продуктов города
// @include       http://virtonomic*.*/*/main/globalreport/marketing/by_trade_at_cities/*/*/*/*
// @include       http://virtonomic*.*/*/main/globalreport/marketing/by_trade_at_cities/*
// @require https://greasyfork.org/scripts/20744-sortable/code/sortable.js?version=132520
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/20745/%D0%A1%D0%BA%D0%B0%D0%BD%20%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0%20%D1%81%20%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/20745/%D0%A1%D0%BA%D0%B0%D0%BD%20%D0%BF%D1%80%D0%BE%D0%B4%D1%83%D0%BA%D1%82%D0%BE%D0%B2%20%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%D0%B0%20%D1%81%20%D1%81%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%BE%D0%B9.meta.js
// ==/UserScript==

var run = function () {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  
  
        // var script = document.createElement("script");
        // script.src = 'http://phrogz.net/JS/sorTable/jquery.sortable.js';
        // script.onload = onLoad;
        // document.getElementsByTagName("head")[0].appendChild(script);


  //$('head').append('<script type="text/javascript" src="jquery-latest.js"></script>');
  //  $('head').append('<script type="text/javascript" src="jquery.tablesorter.js"></script>');
  
//	$('head').append('<script type="text/javascript" src="http://phrogz.net/JS/sorTable/jquery.sortable.js"></script>');

  $('table.grid:eq(0)').before('<input id="prod" class="prod" type="button" value="Сканировать отдел!">');
  $('table.grid:eq(0)').before('<input id="prod2" class="prod2" type="button" value="Сканировать по продукту!">');
  $('table.grid:eq(0)').before('<input id="vr" class="vr" type="button" value="Подсчитать емкость">');
  $('table.grid:eq(0)').before('<input id="prov" class="prov" type="button" value="Очистить хранилище">');
  $('table.grid:eq(0)').before('<input id="show" class="show" type="button" value="Показать данные из хранилища">');

  //*****************************************
  i = 0
  function timed() {
    var divprod = $('div#__products_list');
    var spanprod = $('span', divprod);
    if (i < spanprod.length) {

      var Murl = $("a", spanprod.eq(i)).attr("href");
      //   console.log(Murl)
      $.ajax({
        url : Murl,
        async : false,
        type : 'post',
        success : function (data) {

          var Vrin = $('table.grid:eq(0)>tbody>tr:eq(0)>td:eq(4)', data).text().replace(/\s/g, ""); //русский поиск
          Vrin = parseFloat(Vrin);
          var nazv = $('table.grid:eq(0)>tbody>tr:eq(0)>td:eq(0)>img', data).attr("alt");
          //		console.log(Vrin)
          var Prodgorod = JSON.parse(localStorage.getItem("Prodgorod"));
          if (Prodgorod == null)
            Prodgorod = {};
          var nameprodgorod = nazv;
          if (Prodgorod[nameprodgorod] == null)
            Prodgorod[nameprodgorod] = new Object();
          Prodgorod[nameprodgorod] = Vrin;
          localStorage.setItem("Prodgorod", JSON.stringify(Prodgorod));
          var procm = $('td:contains("Местные поставщики")', data).next().next().text().replace(/\s/g, ""); //русский поиск
          // console.log(procM)
          procm = parseFloat(procm);
          //console.log(procM)
          var kachm = $('table.grid:eq(1)>tbody>tr:eq(2)>td:eq(0)', data).text().replace(/\s/g, ""); //русский поиск
          // console.log(procM)
          kachm = parseFloat(kachm);
          var pricem = $('table.grid:eq(1)>tbody>tr:eq(1)>td:eq(0)', data).text().replace(/\s/g, "").replace(/\$/g, ""); //русский поиск
          // console.log(procM)
          pricem = parseFloat(pricem);
          var emk = pricem * Vrin;
          emk = emk.toFixed(0);
          emk = emk.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
          $('table#scan').append('<tr><td>' + nazv + '</td><td>' + Vrin + '</td><td>' + procm + '</td><td>' + kachm + '</td><td>' + pricem + '</td><td class="emkr">' + emk + '</td></tr>');

          $('table#scan tr').css({
            'background' : '#e1e5df',
          })
        }
      })
      //    }
      i = i + 1
        setTimeout(function () {
          timed();
        }, 3000);
    } else {
      alert('Скан закончен')
      return;
    }
  }
  //*********************************скан по продукту

  z = 1
  function timed2() {
    var divsity = $('div#mainContent>fieldset>table:eq(1)>tbody>tr>td:eq(4)>select');
    //console.log( divsity.length)
    var idgor = $('option', divsity);
    //  console.log( idgor.length)
    var Murl = $(idgor.eq(z)).attr("value");
    var gorod = $(idgor.eq(z)).text();
    //console.log(Murl)
    // console.log(gorod)
    if (z < idgor.length) {

      var Murl2 = window.location.href + Murl;
      //   console.log(Murl)
      $.ajax({
        url : Murl2,
        async : false,
        type : 'post',
        success : function (data) {

          var Vrin = $('table.grid:eq(0)>tbody>tr:eq(0)>td:eq(4)', data).text().replace(/\s/g, ""); //русский поиск
          Vrin = parseFloat(Vrin);
          var nazv = $('table.grid:eq(0)>tbody>tr:eq(0)>td:eq(0)>img', data).attr("alt");
          //		console.log(Vrin)
          var procm = $('td:contains("Местные поставщики")', data).next().next().text().replace(/\s/g, ""); //русский поиск
          // console.log(procM)
          procm = parseFloat(procm);
          //console.log(procM)
          var kachm = $('table.grid:eq(1)>tbody>tr:eq(2)>td:eq(0)', data).text().replace(/\s/g, ""); //русский поиск
          //  // console.log(procM)
          kachm = parseFloat(kachm);
          var pricem = $('table.grid:eq(1)>tbody>tr:eq(1)>td:eq(0)', data).text().replace(/\s/g, "").replace(/\$/g, ""); //русский поиск
          // console.log(procM)
          pricem = parseFloat(pricem);
          $('table#scan').append('<tr><td>' + gorod + '</td><td>' + Vrin + '</td><td>' + procm + '</td><td>' + kachm + '</td><td>' + pricem + '</td></tr>');

          $('table#scan tr').css({
            'background' : '#e1e5df',
          })

        }
      })
      z = z + 1
        setTimeout(function () {
          timed2();
        }, 3000);
    } else {
      alert('Скан закончен')
      return;
    }
  }

  $("#prod").click(function () {
    $('table.grid:eq(0)').before('<table id="scan" class="sortable"><th>Продукт </th><th class="sort-quantity sortable">Количество</th><th>%местных</th><th>кач местных</th><th class="sort-pricelocal sortable">цена местных</th><th>Емкость рынка</th></table>');

    //css таблицы
    $('table#scan').css({
      'border' : '1px solid #d5d7d4',
    })

    $('table#scan th').css({
      'background' : '#e1e5df',

    })
    //    console.log(spanprod.length)

    //  for(  i=0; i< spanprod.length; i++) {
    setTimeout(function () {
      timed();
    }, 3000);
  })

  $("#prod2").click(function () {
    $('table.grid:eq(0)').before('<table id="scan" class="sortable"><th  >Город</th><th class="sort-quantity sortable">Количество</th><th>%местных</th><th>кач местных</th><th class="sort-pricelocal sortable">цена местных</th></table>');

    //css таблицы
    $('table#scan').css({
      'border' : '1px solid #d5d7d4',
    })

    $('table#scan th').css({
      'background' : '#e1e5df',

    })
    //    console.log(spanprod.length)

    //  for(  i=0; i< spanprod.length; i++) {
    setTimeout(function () {
      timed2();
    }, 3000);
  })

  $("#vr").click(function () {
    var sum = 0;
    $('.emkr').each(function () {
      sum += Number($(this).text().replace(/\D+/g, "").replace(/\s/g, ""));
    });
    sum = sum.toFixed(0);
    sum = sum.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    alert(sum)
  })

  $("#prov").click(function () {
    localStorage.removeItem("Prodgorod");
  })
  
  $("#show").click(function(){
	  var nazv = $('table.grid:eq(0)>tbody>tr:eq(0)>td:eq(0)>img', data).attr("alt");
	console.log(localStorage.getItem("Prodgorod") ) 
  })

}

if (window.top == window) {
//  this.$ = this.jQuery = jQuery.noConflict(true);
  var script = document.createElement("script");
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}