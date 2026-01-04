// ==UserScript==
// @name           Virtonomica: вывоз остатков через отчет "Движение товаров - Запасы"
// @version        0.6
// @include        http*://*virtonomic*.*/*/main/company/view/*/sales_report/by_storages
// @description    Добавляет кнопки вывоза остатков в отчет "Движение товаров - Запасы"
// @author         cobra3125
// @namespace      virtonomica
// @downloadURL https://update.greasyfork.org/scripts/35500/Virtonomica%3A%20%D0%B2%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%BA%D0%BE%D0%B2%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%20%22%D0%94%D0%B2%D0%B8%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%BE%D0%B2%20-%20%D0%97%D0%B0%D0%BF%D0%B0%D1%81%D1%8B%22.user.js
// @updateURL https://update.greasyfork.org/scripts/35500/Virtonomica%3A%20%D0%B2%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%BE%D1%81%D1%82%D0%B0%D1%82%D0%BA%D0%BE%D0%B2%20%D1%87%D0%B5%D1%80%D0%B5%D0%B7%20%D0%BE%D1%82%D1%87%D0%B5%D1%82%20%22%D0%94%D0%B2%D0%B8%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%82%D0%BE%D0%B2%D0%B0%D1%80%D0%BE%D0%B2%20-%20%D0%97%D0%B0%D0%BF%D0%B0%D1%81%D1%8B%22.meta.js
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
  function getLast(str){
    var matches = str.match(/\/(\d+)$/);
    return matches[1];
  }
  function addStockList(opCell, idapUnit, idpProduct, idpBrand){
    if(idapUnit.length === 0){
      console.log( "idapUnit.length === 0" );
      return;
    }
    var idvUnit = idapUnit.pop();
    $.get('/'+ getRealm() +'/window/unit/view/'+ idvUnit +'/product_move_to_warehouse/'+ idpProduct +'/' + idpBrand, function(data){
      var stockSelectorOptions = '';
      $('table.list > tbody > tr > td:nth-child(3) > a:has(img)', data).each(function(){
        var link = $(this);
        var idvStock = getLast(link.attr('href'));
        var svPlace = $('> td:nth-child(2)', link.parent().parent()).text();
        var svOnStockHeader = $('> tr:nth-child(1) > th:nth-child(5) > div > table > tbody > tr > td.title-ordertool', link.parent().parent().parent()).text();
        var svOnStock = $('> td:nth-child(5)', link.parent().parent()).text();
        stockSelectorOptions = stockSelectorOptions + '<option stock="'+ idvStock + '">'+ svPlace +', '+ svOnStockHeader +': '+ svOnStock +'</option>';
      });
      if(stockSelectorOptions === '' && idapUnit.length > 0){
        console.log( "stockSelectorOptions === '', idapUnit.length = " + idapUnit.length);
        addStockList(opCell, idapUnit, idpProduct, idpBrand);
      } else {
        stockSelectorOptions = stockSelectorOptions || '<option stock="">У вашей компании нет складов, на которые можно было бы вывезти этот товар!</option>';
        opCell.append('<select name="stock_list">'+ stockSelectorOptions +'</select>'); 
      }
    });
  }
  function returnToStock(idpUnitFrom, idpStockTo, idpProduct, idpBrand, npQtyToMove){
    if (npQtyToMove > 0 && idpStockTo != ''){
      var svUrl = '/'+ getRealm() +'/window/unit/view/'+ idpUnitFrom +'/product_move_to_warehouse/'+ idpProduct +'/'+ idpBrand;
      var data = {};
      data['qty'] = npQtyToMove;
      data['unit'] = idpStockTo;

      $.post( svUrl, data )
        .done(function() {
        console.log( "returnToStock success" );
      })
        .fail(function() {
        console.log( "returnToStock error" );
      });
    } else {
      console.log('npQtyToMove < 0; '+ npQtyToMove);
      console.log('idpStockTo = "'+ idpStockTo +'"');
    }
  }
  function toNumber(spSum){
    return parseFloat(spSum.replace('$','').replace(/\s+/g,''),10);
  }
  //резделитель разрядов
  function commaSeparateNumber(val, sep){
    var separator = sep || ' ';
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1"+separator);
    }
    return val;
  }
  //убираем с названия товара обработчик клика, чтобы не скрывался список при выборе склада
  $('div > a.c_row > div > span.c_name').click(function(){
    var row = $(this).parent().parent().parent();
    var listVisible = $('> div.c_row_l', row).is(':visible');
    if(listVisible){
      return false;
    } else {
      return true;
    }
  });
  
  //кнопки перед таблицей
  var btnPanel = $('<div id="btns_before_table">');
  
  var btn_select_visible_unit_rows = $('<input id="btn_select_visible_unit_rows" type="button" value="Выделить подразделения для вывоза остатков на склад">');
  btn_select_visible_unit_rows.click(function(){
    $('a.c_row > div:visible:has(span:nth-child(3):not(:has(input)))').each(function(){
      var parentRow = $(this);
      var parentParentRow = parentRow.parent().parent();
      if($('> div.c_row_l:visible > div', parentParentRow).length > 0){
        var nameCell = $('> span:nth-child(3)', parentRow);
        var matches  = $('> div.c_row_l:visible', parentParentRow).attr('id').match(/(\d+)_(\d+)/);
        var idvProduct = matches[1];
        var idvBrand = matches[2];
        var idavUnit = [];
        $('> div.c_row_l:visible > div > span:nth-child(3) > a', parentParentRow).each(function(){
          var unitRow = $(this).parent().parent();
          if($('> span:nth-child(2) > a > img', unitRow).attr('src').indexOf('warehouse') === -1){
            var idvUnit = getLast($(this).attr('href'));
            idavUnit.push(idvUnit);
          }
        });
        console.log(idvProduct +'_'+ idvBrand +'_'+ idavUnit.length);

        //nameCell.append('&nbsp;<input name="parent_unit_for_return" type="checkbox" checked>')
        nameCell.append(',&nbsp;оставить&nbsp;кол-во&nbsp;<input name="parent_qty_for_leave" type="number" value="0" style="width: 6em;">');
        addStockList(nameCell, idavUnit, idvProduct, idvBrand);
      }
    });
    
    $('div.c_row_l:visible > div:has(span:nth-child(1):not(:has(input)))').each(function(){
      var unitRow = $(this);
      if($('> span:nth-child(2) > a > img', unitRow).attr('src').indexOf('warehouse') === -1){
        $('> span:nth-child(1)', unitRow).append('&nbsp;<input name="unit_for_return" type="checkbox">');
        $('> span:nth-child(3)', unitRow).append(',&nbsp;оставить&nbsp;кол-во&nbsp;<input name="qty_for_leave" type="number" value="0" style="width: 6em;">');
      }
    });
    
    /*$('input[name="parent_unit_for_return"]').click(function(){
      console.log('click');
      var newVal = $(this).is(':checked');
      var parentRow = $(this).parent().parent().parent().parent();
      $('> div.c_row_l:visible > div > span:nth-child(1) > input[name="unit_for_return"]', parentRow).each(function(){
        $(this).attr('checked', newVal);
      });
    });*/
    
    $('input[name="parent_qty_for_leave"]').change(function(){
      var newVal = parseFloat($(this).val(),10) || 0;
      var parentRow = $(this).parent().parent().parent().parent();
      $('> div.c_row_l:visible > div > span:nth-child(3) > input[name="qty_for_leave"]', parentRow).each(function(){
        $(this).val(newVal);
      });
    });
  });
  btnPanel.append(btn_select_visible_unit_rows);
  
  var btn_return_from_selected_units = $('<input id="btn_return_from_selected_units" type="button" value="Вывезти остатки на склад">');
  btn_return_from_selected_units.click(function(){
    var checkedRows = $('div.c_row_l:visible:has(div > span:nth-child(1) > input:checked)');
    if(checkedRows.length > 0 && confirm('Переместить запасы "'+ checkedRows.length +'" товаров(а) на склад?')){
      checkedRows.each(function(){
        var row = $(this);
        var idvStockTo = $('> a.c_row > div > span.c_name > select[name="stock_list"] > option:selected', row.parent()).attr('stock');
        var matches  = row.attr('id').match(/(\d+)_(\d+)/);
        var idvProduct = matches[1];
        var idvBrand = matches[2];
        $('> div:has(span:nth-child(3) > a)', row).each(function(){
          var subRow = $(this);
          if($('> span:nth-child(1) > input[name="unit_for_return"]', subRow).is(':checked')){
            var idvUnitFrom = getLast($('> span:nth-child(3) > a', subRow).first().attr('href'));
            var nvQtyToLeave = toNumber($('> span:nth-child(3) > input[name="qty_for_leave"]', subRow).val());
            var nvQtyToMove = toNumber($('> span:nth-child(4)', subRow).text()) - nvQtyToLeave;
            returnToStock(idvUnitFrom, idvStockTo, idvProduct, idvBrand, nvQtyToMove);
            $('> span:nth-child(4)', subRow).html('<b>'+ commaSeparateNumber(nvQtyToLeave) +'</b>');
          }
        });
      });
    }
  });
  btnPanel.append('&nbsp;').append(btn_return_from_selected_units);
  $('div:nth-child(9) > span.c_qty').first().parent().before(btnPanel);

  /*
  var path1 = '> a.c_row > div:nth-child(1) > span:nth-child(2)';
  var path2 = '> a.c_row_1 > div:nth-child(1) > span:nth-child(2)';
  $('div:has(a.c_row):has(div):has(span.c_qty)').each(function(){
    var row = $(this); 
    
    //var id_product = avProductIdByImgSrc[$(path3, row).attr('src')];
    $(path1, row).append('&nbsp;<input name="select_all_for_return" type="checkbox">');
    $(path2, row).append('&nbsp;<input name="select_all_for_return" type="checkbox">');
  });

  $('input[name="select_all_for_return"]').click(function(){
    var row = $(this).closest('tr');
    var checked = $(this).is(':checked');
    var href = $(this).attr('href');
    var next = row.next();
    while (next.length > 0 && !next.hasClass('p_title')) {
      $('> td:nth-child(1) > input[type="checkbox"]', next).attr('checked', checked);
      next = next.next();
    }
  });
	$('#mainContent > div:nth-child(10) > a > div:nth-child(2) > span:nth-child(2) > img').each(function(){
      var img = $(this);
      var box = $('<input name="select_all_for_return" type="checkbox" style="float:left;">').click(function(){
        var row = $(this).closest('tr');
        var checked = $(this).is(':checked');
        var next = row.next();
        while (next.length > 0 && !next.hasClass('p_title')) {
          $('> td:nth-child(1) > input[type="checkbox"]', next).attr('checked', checked);
          next = next.next();
        }
      });
      img.after(box);
    });
    */
}

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}