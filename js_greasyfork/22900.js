// ==UserScript==
// @name        iks: virtonomica оптовое строительство (добавил выбор региона и страны)
// @namespace   virtonomica
// @description Автоматический запуск постройки нескольких подразделений одного типа, кроме офисов. origin: https://greasyfork.org/ru/scripts/9228-iks-virtonomica-%D0%BE%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5-%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE
// @include     http*://*virtonomic*.*/*/main/unit/create/*
// @include     http*://*virtonomic*.*/*/main/unit/view/*
// @include     http*://*virtonomic*.*/*/main/company/view/*/*
// @version     10.46
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22900/iks%3A%20virtonomica%20%D0%BE%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE%20%28%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D0%BB%20%D0%B2%D1%8B%D0%B1%D0%BE%D1%80%20%D1%80%D0%B5%D0%B3%D0%B8%D0%BE%D0%BD%D0%B0%20%D0%B8%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D1%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/22900/iks%3A%20virtonomica%20%D0%BE%D0%BF%D1%82%D0%BE%D0%B2%D0%BE%D0%B5%20%D1%81%D1%82%D1%80%D0%BE%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D1%81%D1%82%D0%B2%D0%BE%20%28%D0%B4%D0%BE%D0%B1%D0%B0%D0%B2%D0%B8%D0%BB%20%D0%B2%D1%8B%D0%B1%D0%BE%D1%80%20%D1%80%D0%B5%D0%B3%D0%B8%D0%BE%D0%BD%D0%B0%20%D0%B8%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D1%8B%29.meta.js
// ==/UserScript==

function test(){
  var data = [];
  data.push({"unitCreateData[unit_class]":"2043"
             ,"unitCreateData[unit_type]":"423140"
             ,"unitCreateData[country]":"2931"
             ,"unitCreateData[region]":"2939"
             ,"unitCreateData[city]":"422088"
             ,"unitCreateData[produce]":"423150"
             ,"unitCreateData[produce_bound]":"423145"
             ,"unitCreateData[techno_level]":"1"
             ,"numUnit":"1"
             ,"timeUpClik":"0"
            });
  data.push({"unitCreateData[unit_class]":"2043"
             ,"unitCreateData[unit_type]":"423140"
             ,"unitCreateData[country]":"2931"
             ,"unitCreateData[region]":"2939"
             ,"unitCreateData[city]":"422088"
             ,"unitCreateData[produce]":"423150"
             ,"unitCreateData[produce_bound]":"423145"
             ,"unitCreateData[techno_level]":"1"
             ,"numUnit":"1"
             ,"timeUpClik":"0"
            });
  data.push({"unitCreateData[unit_class]":"2043"
             ,"unitCreateData[unit_type]":"423140"
             ,"unitCreateData[country]":"2931"
             ,"unitCreateData[region]":"2939"
             ,"unitCreateData[city]":"422088"
             ,"unitCreateData[produce]":"423150"
             ,"unitCreateData[produce_bound]":"423145"
             ,"unitCreateData[techno_level]":"1"
             ,"numUnit":"1"
             ,"timeUpClik":"0"
            });

  function setVal(spName, pValue){
    window.localStorage.setItem(spName, JSON.stringify(pValue));
  }
  setVal("nextCreateUnitCount", 1);
  setVal("nextCreateUnits_1", data);
}

/**************************************************/
var run = function() {
  
  function getVal(spName){
    return JSON.parse(window.localStorage.getItem(spName));
  }
  function setVal(spName, pValue){
    window.localStorage.setItem(spName, JSON.stringify(pValue));
  }
  function delVal(spName){
    window.localStorage.removeItem(spName);
  }
  function getLocale() {
    return (document.location.hostname === 'virtonomica.ru') ? 'ru' : 'en';
  }
  function getRealm(){
    var svHref = window.location.href;
    var matches = svHref.match(/\/(\w+)\/main\//);
    return matches[1];
  }	
  function getCountry(numOfAddition) {
    return $('#choose_country_'+ numOfAddition).val();
  }
  function getRegion(numOfAddition) {
    return $('#choose_region_'+ numOfAddition).val();
  }
  function loadCountries(callback, numOfAddition) {
    var realm = getRealm();
    var suffix = (getLocale() == 'en') ? '_en' : '';

    $.getJSON('https://cobr123.github.io/by_trade_at_cities/'+realm+'/countries'+suffix+'.json', function (data) {
      var output = '';

      $.each(data, function (key, val) {
        output += '<option value="'+val.i+'">'+val.c+'</option>';
      });

      $('#choose_country_'+ numOfAddition).html(output).trigger("chosen:updated");
      
      if(typeof(callback) === 'function') {
        callback();
      } else {
        loadRegions(callback, numOfAddition);
      }
    });
    return false;
  }
  function loadRegions(callback, numOfAddition) {
    var realm = getRealm();

    var svCountryId = getCountry(numOfAddition);
    var locale = getLocale();
    var suffix = (locale == 'en') ? '_en' : '';
    var allRegions = (locale == 'en') ? 'All regions' : 'Все регионы';

    $.getJSON('https://cobr123.github.io/by_trade_at_cities/'+realm+'/regions'+suffix+'.json', function (data) {
      var output = '<option value="" selected="">'+allRegions+'</option>';

      if (svCountryId == null || svCountryId == '') {
        $.each(data, function (key, val) {
          output += '<option value="'+val.i+'">'+val.c+'</option>';
        });
      } else {
        $.each(data, function (key, val) {
          if(val.ci == svCountryId){
            output += '<option value="'+val.i+'">'+val.c+'</option>';
          }
        });
      }

      $('#choose_region_'+ numOfAddition).html(output).trigger("chosen:updated");
      
      if(typeof(callback) === 'function') {
        callback();
      } else {
        loadTowns(callback, numOfAddition);
      }
    });
    return false;
  }
  function updateTotalBuildCnt() {
    var total_build_cnt = 0;
    var impNumUnitMain = parseInt($('#impNumUnit').val()) || 0;
    total_build_cnt += impNumUnitMain; 
    
    $('select[id^="choose_town"]').each( function() {
      var sel = $(this);
      var suf = sel.attr('id').substr('choose_town'.length);
      var impNumUnit = parseInt($('#impNumUnit' + suf).val()) || 0;
      
      if(sel.val() == ''){
        var current = impNumUnit * ($('> option', sel).length - 1);
        total_build_cnt += current; 
      } else {
        total_build_cnt += impNumUnit; 
      }
    });
    $('#total_build_cnt').val(total_build_cnt); 
  }
  function loadTowns(callback, numOfAddition) {
    var realm = getRealm();

    var svCountryId = getCountry(numOfAddition);
    var svRegionId = getRegion(numOfAddition);
    var locale = getLocale();
    var suffix = (locale == 'en') ? '_en' : '';
    var allTowns = (locale == 'en') ? 'All cities' : 'Все города';
    
    $.getJSON('https://cobr123.github.io/by_trade_at_cities/'+realm+'/cities'+suffix+'.json', function (data) {
      var output = '';
      var cnt = 0;

      $.each(data, function (key, val) {
        if(svRegionId != null && svRegionId != '' && val.ri == svRegionId){
          output += '<option value="'+val.i+'" region_id="'+val.ri+'" country_id="'+val.ci+'">'+val.c+'</option>';
          ++cnt;
        } else if(svCountryId != null && svCountryId != '' && val.ci == svCountryId && (svRegionId == null || svRegionId == '')){
          output += '<option value="'+val.i+'" region_id="'+val.ri+'" country_id="'+val.ci+'">'+val.c+'</option>';
          ++cnt;
        } else if((svCountryId == null || svCountryId == '') && (svRegionId == null || svRegionId == '')){
          output += '<option value="'+val.i+'" region_id="'+val.ri+'" country_id="'+val.ci+'">'+val.c+'</option>';
          ++cnt;
        }
      });
      output = '<option value="" selected="" region_id="" country_id="">'+allTowns+' ('+ cnt +')</option>' + output;

      $('#choose_town_'+ numOfAddition).html(output).trigger("chosen:updated");
      
      updateTotalBuildCnt();
      if(typeof(callback) === 'function') {
        callback();
      }
    });
    return false;
  }
  $(document).keydown(function(e) {
    if( e.keyCode === 27 ) {
      delVal("createUnit");
      delVal("newUnit");
      delVal("nextCreateUnitCount");
    }
  });
    
  var cooki = getVal("createUnit"),
      nextCreateUnitCount = getVal("nextCreateUnitCount"),
      nextCreateUnits = getVal("nextCreateUnits_" + nextCreateUnitCount),
      o = {};
  
  //console.log('cooki = ' + cooki);
  //if(nextCreateUnits){
  //  console.log('nextCreateUnits = ' + true);
  //}
  if (nextCreateUnits) {
    var tmpArr = nextCreateUnits;
    //console.log('tmpArr = ' + tmpArr);
    console.log('nextCreateUnits.length = ' + tmpArr.length);
    
    if (tmpArr.length > 0) {
      //The shift() method removes the first item of an array, and returns that item.
      var nextUnit = tmpArr.shift();
      var getNext = false;
      
      if (cooki) {
        o = cooki;
        if(parseInt(o["numUnit"]) <= 0) {
           getNext = true;
        }
      } else {
        getNext = true;
      }
      if(getNext){
        cooki = nextUnit;
        //console.log('cooki = ' + cooki);
        setVal("createUnit", cooki);
        if(tmpArr.length == 0){
          delVal("nextCreateUnits_" + nextCreateUnitCount );
          setVal("nextCreateUnitCount", parseInt(nextCreateUnitCount) - 1 );
        } else {
          setVal("nextCreateUnits_" + nextCreateUnitCount, tmpArr );
        }
      }
    }
  }
  
  
  if (cooki) {
    o = cooki;
    
    var n = parseInt(o["numUnit"]),
        timeUpClik = parseInt(o["timeUpClik"]) *1000;
    
    console.log('numUnit = ' + n);
    if(n>0) {
      var prov = 1;
      $("input:radio").each( function() {
        if ( o[ $(this).attr('name') ] ) {
          if ( $(this).val() == o[ $(this).attr('name') ] ) {
            prov = 0;
            $.when(this).then(function(id){
              $(id).prop('checked','checked');
            }).then(function(id){
              if(timeUpClik > 0) setTimeout( function(){ $('input.button250[name="next"]').click(); }, timeUpClik);
              else $('input.button250[name="next"]').click();
            });
          }
        } else if( window.location.href.indexOf('/main/unit/create/') + 1 ) delVal("createUnit");
      });

      $('input.button250[name!="next"]').each( function() {
        prov = 0;
        o["numUnit"] = n - 1;
        setVal("createUnit",  o );
        var numberOfUnitsTitle = (getLocale() == 'en') ? 'Number of units' : 'Количество подразделений';
        $("div#mainContent > table > tbody > tr > td > form > table.list").append('<th>' + numberOfUnitsTitle + '</th><td style="color:blue">&nbsp;<b>' + n + '</b></td>');
        // если вы хотите подтверждать вручную создание подразделений
        // при последней стадии то заблокируйте две строки ниже;
        // поставив перед ними две косые //
        if(timeUpClik > 0) setTimeout( $(this).click(), timeUpClik);
        else $(this).click();
      });
      
      $('a:has(img[src="/img/icon/unit_build.png"])').each(function() {
        prov = 0;
        $(this).attr("href", $(this).attr("href") + "?old");
        if(timeUpClik > 0) setTimeout( this.click(), timeUpClik);
        else this.click();
      });
      if ( prov > 0 ) {
        $('a:contains("Предприятия")').each(function() {
          if(timeUpClik > 0) setTimeout( this.click(), timeUpClik);
          else this.click();
        });
      }
      
    } else {
      delVal("createUnit");
      $('a:contains("Строящиеся")').each(function() {
        if(timeUpClik > 0) setTimeout( this.click(), timeUpClik);
        else this.click();
      });
      $('a:contains("Under construction")').each(function() {
        if(timeUpClik > 0) setTimeout( this.click(), timeUpClik);
        else this.click();
      });
    }
  } else {
    // Запомним параметры создаваемых подразделений
    cooki = getVal("newUnit");
    if (cooki) o = cooki;
    
  //скрываем чтобы не возникало вопросов по правильному выбору
  if (/\/\w+\/main\/unit\/create\/\d+\/step1-type-select/.test(window.location)) {
    $('#product-all').hide();
    $('ul[class="category_select"]').hide();
    $('div[class="new_down"]').hide();
    $('div[class="hr_boldest"]').hide();
    //
    $('input[id^="utp-"]').click(function() {
          var ed = $(this);
          o[ ed.attr('name') ] = ed.val();
          setVal("newUnit",  o );
        });
  }
    $("td:contains('образованности')").next().each(function() {
      $('div#mainContent > table > tbody > tr > td > form > table.list > tbody > tr').each(function() {
        if( $(this).find('td > input:radio') ) {
          var n = parseFloat( $(this).find('td:nth-child(4)').html() );
          if(n>0){
            var n1 = $(this).find('td:nth-child(5)').html().replace(/\s+/g, '').replace(/\$/g, '');
            n1 = parseFloat( n1 );
            $(this).find('td:nth-child(4)').append('&nbsp;&nbsp;<span title="цена за единицу образованости" style="font-size:x-small; color:blue">(1<span style="color:#000">/$</span>'+(n1/n).toFixed(2)+')</span>');
          }
        }
      });
    });
                                              
    $("input:radio").click( function() {
      $('table.list > tbody:nth-child(1) > tr:nth-child(1):contains("Технология")').each( function() {
        var alertTitle = (getLocale() == 'en') ? 'You do want to buy technology you not studied?' : 'Вы хотите купить не изученную вами технологию?';
        if( parseFloat( $("input:radio:checked").parent().next().next().text().replace(/\s+/g, '').replace(/\$/, '') ) > 0) alert(alertTitle);
      });
      if( $(this).attr('name') == "unitCreateData[unit_class]" ) o = {};
    });
  
    var addition_num = 0;
    
    var additionallyTitle = (getLocale() == 'en') ? 'Additional' : 'Дополнительно';
    var addAdditionallyTitle = (getLocale() == 'en') ? 'Add an additional' : 'Добавить дополнительно';
    var delAdditionallyTitle = (getLocale() == 'en') ? 'Delete an additional' : 'Удалить дополнительно';
    var countryTitle = (getLocale() == 'en') ? 'Country' : 'Страна';
    var regionTitle = (getLocale() == 'en') ? 'Region' : 'Регион';
    var townTitle = (getLocale() == 'en') ? 'City' : 'Город';
    var totalNewUnitsTitle = (getLocale() == 'en') ? 'Total new units' : 'Всего новых юнитов';
    
    // Установим количество создаваемых подразделений
    $('input.button250[name!="next"]').each( function() {
      if (o["unitCreateData[unit_class]"] != "1815") {
        var n = 1; 
        if (o["numUnit"] ) n = parseInt(o["numUnit"]);
        else o["numUnit"] = n;
        
        var numberOfUnitsTitle = (getLocale() == 'en') ? 'Number of units' : 'Количество подразделений';
        var latencyTitle = (getLocale() == 'en') ? 'Latency (sec.) between click in transitions' : 'Задержка сек. клика при переходах';
        
        var paramList = $("div#mainContent > table > tbody > tr > td > form > table.list");
        paramList.append('<tr><th>'+ numberOfUnitsTitle +'</th><td><input type="text" value="' + n + '" id="impNumUnit" style="width: 100%"></input></td></tr>'
                         +'<tr><th>'+ latencyTitle +'</th><td><input type="text" value="0" id="impTimeUpClik" style="width: 100%"></input></td></tr>'
                         +''
                         +'<tr><th>&nbsp;</th><td><input type="button" id="add_addition" style="width: 100%" value="'+ addAdditionallyTitle +'"></input></td></tr>'
                         +'<tr><th>'+ totalNewUnitsTitle +'</th><td><input id="total_build_cnt" value="1" style="width: 100%" readonly></input></td></tr>'
                        );
        
        function loadCountriesRegionsTowns(numOfAddition) {
          var loadTownsCallback = function() {
            if(numOfAddition == 1) {
              $('#choose_town_'+ numOfAddition).val(o["unitCreateData[city]"]);
            }
            updateTotalBuildCnt();
          };
          var loadRegionsCallback = function() {
            if(numOfAddition == 1) {
              $('#choose_region_'+ numOfAddition).val(o["unitCreateData[region]"]);
            }
            loadTowns(loadTownsCallback, numOfAddition);
          };
          var loadCountryCallback = function() {
            if(numOfAddition == 1) {
              $('#choose_country_'+ numOfAddition).val(o["unitCreateData[country]"]);
            }
            loadRegions(loadRegionsCallback, numOfAddition);
          };
          loadCountries(loadCountryCallback, numOfAddition);
          
          $('#choose_town_'+ numOfAddition).change(function(){
            updateTotalBuildCnt();
          });
          $('#choose_country_'+ numOfAddition).change(function(){
            loadRegions(null, numOfAddition);
          });
          $('#choose_region_'+ numOfAddition).change(function(){
            loadTowns(null, numOfAddition);
          });
        }
        $('#add_addition').bind("change keyup input click", function() { 
          ++addition_num;
          $('#add_addition').parent().parent().before('<tr><th>'+ additionallyTitle +' '+ addition_num +'</th><td id="addition_build_'+ addition_num +'">'
                         + countryTitle +'<select id="choose_country_'+ addition_num +'" style="width: 100%"></select><br>'
                         + regionTitle +'<select id="choose_region_'+ addition_num +'" style="width: 100%"></select><br>'
                         + townTitle +'<select id="choose_town_'+ addition_num +'" style="width: 100%"></select><br>'
                         + numberOfUnitsTitle +'<input type="text" value="' + n + '" id="impNumUnit_'+ addition_num +'" style="width: 100%"></input><br>'
                         +'<input type="button" id="del_addition_'+ addition_num +'" style="width: 100%" value="'+ delAdditionallyTitle +' '+ addition_num +'"></input></td></tr>'
                                                          );
          loadCountriesRegionsTowns(addition_num);
          $('#del_addition_'+ addition_num).bind("change keyup input click", function() { 
            $(this).parent().parent().remove();
            updateTotalBuildCnt();
          });
        });
      }
    });
	  // Пропускаем только цифры
   	var numVal = function(v, v1) {
      var num = $(v).val().replace(/[^0-9]/g, '') || 0;
      $(v).val( num );
      o[v1] = num;
    };
   	$('#impNumUnit').bind("change keyup input click", function() { 
      numVal(this, "numUnit");
      updateTotalBuildCnt();
    });
   	$('#impTimeUpClik').bind("change keyup input click", function() { 
      numVal(this, "timeUpClik");
    });
    
    //
    $("input.button250").click( function() {
      if ($(this).attr('name') == "next") {
        $("input:radio:checked").each( function() {
          o[ $(this).attr('name') ] = $(this).val();
        });
        setVal("newUnit",  o );
      } else {
        delVal("newUnit");

        var dataNextUnitList = [];
        var impNumUnit = parseInt($('#impNumUnit').val());

        $('select[id^="choose_town"]').each( function() {
          var sel = $(this);
          var suf = sel.attr('id').substr('choose_town'.length);
          var impNumUnitAdd = parseInt($('#impNumUnit' + suf).val());
          if(sel.val() == ''){
            $('> option', sel).each( function() {
              var option = $(this);
              if(option.attr('value') != ''){
                var tmp = {
                  "unitCreateData[country]": option.attr('country_id')
                  ,"unitCreateData[region]": option.attr('region_id')
                  ,"unitCreateData[city]": option.attr('value')
                  ,"numUnit": impNumUnitAdd
                };
                // Merge defaults and options, without modifying defaults
                var item = $.extend( {}, o, tmp );
                dataNextUnitList.push(item);
              }
            });
          } else {
            var option = $("> option:selected", sel);
            var tmp = {
              "unitCreateData[country]": option.attr('country_id')
              ,"unitCreateData[region]": option.attr('region_id')
              ,"unitCreateData[city]": option.attr('value')
              ,"numUnit": impNumUnitAdd
            };
            // Merge defaults and options, without modifying defaults
            var item = $.extend( {}, o, tmp );
            dataNextUnitList.push(item);
          }
        });
        //alert(JSON.stringify( data ));
        var i, j, temparray, chunk = 10, cnt = 0;
        for (i = 0, j = dataNextUnitList.length; i < j; i += chunk) {
          temparray = dataNextUnitList.slice(i, i + chunk);
          // do whatever
          ++cnt;
          setVal("nextCreateUnits_" + cnt,  temparray );
        }
        setVal("nextCreateUnitCount",  cnt );
        if(parseInt(o['numUnit']) > 0) {
          o['numUnit'] = parseInt(o['numUnit']) - 1;
        }
        setVal("createUnit", o );
        var alertTitle = (getLocale() == 'en') ? 'Press Esc to cancel the script' : 'Для отмены работы скрипта нажмите клавишу Esc';
        alert(alertTitle);
      }
    });
  
  }
}

function getVal(spName){
  return JSON.parse(window.localStorage.getItem(spName));
}
if(window.top == window && ( getVal('createUnit') || window.location.href.indexOf('main/unit/create') + 1 ) ) {
    var script = document.createElement('script');
    script.textContent = ' (' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}