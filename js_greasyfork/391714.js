// ==UserScript==
// @name Diagnosis
// @namespace Diagnosis Scripts
// @description Diagnosis for LK
// @match *://lk.mango-office.ru/profile/*/diagnosis*
// @match *://lk.mango-office.ru/profile/*
// @grant none
// @version 0.0.2.20210111
// @downloadURL https://update.greasyfork.org/scripts/391714/Diagnosis.user.js
// @updateURL https://update.greasyfork.org/scripts/391714/Diagnosis.meta.js
// ==/UserScript==

//Подключаем скрипт куки
var my_awesome_script = document.createElement('script');
my_awesome_script.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js');
document.head.appendChild(my_awesome_script);

//функция замены символов в строке
String.prototype.replaceAll = function( token, newToken, ignoreCase ) {var _token; var str = this + ""; var i = -1; if ( typeof token === "string" ) {if ( ignoreCase ) {_token = token.toLowerCase(); while( (i = str.toLowerCase().indexOf(_token, i >= 0 ? i + newToken.length : 0) ) !== -1) {str = str.substring( 0, i ) +newToken +str.substring( i + token.length );}} else {return this.split( token ).join( newToken );}}return str;};

//Создаем ссылку на diagnosis
function createLink() {
  $('.member-info__logo-wrap').attr('href', $('.member-info__logo-wrap').attr('href')+'/diagnosis');
}

//Копирование ЛС по клику на ЛС
//var iteration = 0;
function copyLS() {
  //iteration++;
  //if (iteration>35) {clearInterval(timerCLS);}
  if ($($('#framelk').contents()[0]).find('.val').html()) {
      $($('#framelk').contents()[0]).find('.val').click(function(){
        navigator.clipboard.writeText(this.innerHTML);
      });
      //clearInterval(timerCLS);
  }
}

var timerCLS = setInterval(copyLS, 1000);

if ((location.href.split('/')[3] == 'profile')&&(location.href.split('/')[6] != 'diagnosis')) {
  setTimeout(createLink, 1000);
} else {
  
  document.getElementsByClassName('footer')[0].innerHTML = '<img style="position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%);" src="http://192.168.2.153/dashboard/images/diagnosis_preloader.gif" />';
  document.getElementsByClassName('wrap')[0].innerHTML = '';

  var styles = '.wrap{position: fixed; left: 30%; width: 70%; height: 99%; bottom: 0px;} summary{font-size: 20px;}.footer{height: calc(100vh - 110px); padding-top: 15px;}body {background: #fafafa;} li.tab {display: inline-flex; width: 80px; height: 40px; border-top: 1px solid #009933; border-bottom: 1px solid #fff;  margin: 0 0 -1px; font-weight: 600; text-align: center; color: #aaa; border: 0px solid #ddd; border-width: 1px 1px 1px 1px; background: #f1f1f1; border-radius: 3px 3px 0 0; box-sizing: border-box;} li.tab>a {width: 100%; height: 100%;} li.content{display: block;} .tabs-content {width:30%; height:100%; overflow:hidden;}.tabs-content ul { list-style: none; height: 100%; overflow: scroll;}.tabs-content ul li {width:100%; height:300px;}';

  //Получаем ID и код продукта
  var product_code = location.href.split('/')[4];
  var product_id = location.href.split('/')[5];
  //Коды продуктов ДКТ
  var dct_product_id;// = [];
  //Тариф ДКТ
  var tarif;
  //Список виджетов
  var widgets;
  //Готовность виджетов ДКТ
  var widready = [];
  //метрика
  var metrikas = [];
  //Строки вывода
  var dct_options_string; //ДКТ общая строка
  var dct_strings = []; //ДКТ массив строк по каждому виджету
  var sipuac_options_string; //Акт. SIP
  var users_option_string; //Сотрудники
  var group_option_string; //Группы
  var vats_select_string = ''; //Список ВАТСей
  var actionlog_string ='<b><a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/actions-log\'">Журнал действий</a> за сегодня:</b><br>'; //Журнал действий
  //Список utm_campaign и utm_term
  var campaigns;
  var terms;
  //Список сотрудников
  var members;
  //Регистрации SIP-ов
  var sipregs;
  //Настройки всех сотрудников
  var members_settings;
  //Триггерные переменные
  var dct_loaded = false;


  //Делает строку даты пригодной для выгрузки ДКТ и журнала действий
  function dts(d) {
      day = d.getDate();
      if (day<10) day = '0'+day;
      month = d.getMonth();
      month++;
      if (month<10) month = '0'+month;
      year = d.getFullYear();
      return ''+day+'.'+month+'.'+year;
  }
  
  //отображает информацию о настройках правил записи разговоров и месте в облачном хранилище
  function rec_and_storage() { 
      $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/additional-settings/cloud-storage', function(data) {
          $html = $(data); 
          $('#cloudstorage').html('<b><a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/additional-settings/cloud-storage\'">Облачное хранилище</a>:</b><br>'+$html.find("#use").html());});
      $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording/settings', function(data) {
          $html = $(data); 
          if ($html.find('select#firec_dest > option:selected').html() != 'Только в облачном хранилище') {var recmails = '<br>E-mail: '+$html.find('#fsrec_mail').val();} else {var recmails = '';}
          rec_active = $html.find('[name="id"]:checked');
          if (rec_active.attr('data-name') === undefined) {
              $('#callrecs').html('<b><a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording\'">Запись разговоров</a> отключена</b>');
          } else {
              $('#callrecs').html('<b><a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording\'">Запись разговоров</a>:</b><br><span id="rec_set"></span><br>'+$html.find('select#firec_dest > option:selected').html()+recmails);
          }
          $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording/rules', function(data) {
              $html = $(data);
              if ($html.find('.active.saved a').text().trim() == 'Записывать все звонки') {
                  rec_settings = $html.find('.active.saved a').text().trim()+' (';
                  rec_directions = $html.find('.direction-list:eq(0) input');
                  rec_directions.each(function(){
                      if ($(this).attr('checked')) rec_settings += $(this).parent().children('label').html()+', ';
                  });
                  rec_settings = rec_settings.substr(0, rec_settings.length - 2)+')';
              } else if ($html.find('.active.saved a').text().trim() == 'Ничего не записывать') {
                  rec_settings = '<b>Ничего не записывать</b>';
              } else {
                  rec_settings = 'Запись разговоров ведется по правилам: <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording/rules\'">правила</a>';
              }
              $('#rec_set').html(rec_settings);
          });
      });

  }
  
  //Отображает журнал действий за сегодня
  function getActionLog(h) {
      $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/get-action-log-data?hash='+h, function( data ) {
          if (JSON.parse(data).status != 'complete') {var hs = h; setTimeout(getActionLog(hs), 500);} else { 
              if ($($(JSON.parse(data).output).find('tbody').html()).find('td:last-child').length == 0) {
                  actionlog_string = '<b><a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/actions-log\'">Журнал действий</a> за сегодня</b> пуст<br>';
                  $('#actionlog').html(actionlog_string);
              } else {
                  $($(JSON.parse(data).output).find('tbody').html()).find('td:last-child').each(function(){actionlog_string += $(this).html()+'<br>'; $('#actionlog').html(actionlog_string);});
              }
          }
      });
  }
  
 
  //Отображает основную информацию аккаунта и список ВАТСей, облачное хранилище, журнал действий за сегодня, ПМа
  function show_main() {
      $.ajax({
        type: "POST", success: function(e){
          $('#one_main').html("<b>Название:</b> "+e.data.customer.fspersonname+"<br><b>Версия:</b> "+e.data.currentProduct.fsplan_name+"<br><b>Основной e-mail:</b> "+e.data.customer.fsemail+'<br><br><b>ПМ: </b> <span id="personal_jesus">загружается</span>'); 
          if (e.data.sets.length == 1) {$('#vats_select').hide(); $('.footer').css('height','calc(100vh - 49px)');} else {e.data.sets.forEach(function(vats){vats_select_string += '<option '+(vats.id == product_id ? 'selected' : '')+' name="'+vats.id+'">'+vats.name+'</option>'}); 
              $('#vats_select').html(vats_select_string); 
          }
        $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/feedback', function( data ) {
            $('#personal_jesus').html($(data).find('.b-manager-full-name').html());
        });
        }, url: 'https://api-header.mango-office.ru//api/menu',
        data: {app: "ics", auth_token: $.cookie('auth_token'), locale: "ru", prod_code: product_code, prod_id: product_id}
      });
      rec_and_storage();
      var date = new Date();
      var dates = dts(date);
      $.ajax({type: "POST", success: function(e){
           getActionLog(e.hash);
      }, url: 'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/prepare-action-log-data', data: {"filter-period": "today", "filter-start-date": dates, "filter-end-date": dates, "clue": ""}
      });
  }
  
  function show_dct() {
      dct_loaded = true;
      var x=0; widready.forEach(function(a){if (a == true) {x++;}});
      if (x == widready.length) {
          if (dct_product_id) {
              dct_strings.forEach(function(ds) {dct_options_string += ds+'</p></details>';});
              $('#dct').html(dct_options_string);
          } else {
              $('#dct').html('У клиента нет ДКТ');
          }
      } else {setTimeout(show_dct, 2000);}
  }
  
  function show_dct_once_again() {
    if (dct_loaded) {
       if (dct_product_id) {
           $('#dct').html(dct_options_string);
       } else {
           $('#dct').html('У клиента нет ДКТ');
       }
    } else {show_dct();}
  }
  
  function getDCT() {
              $.get('https://lk.mango-office.ru/profile/'+product_code+'/'+product_id+'/api/products', function( data ) {
              data.some(function(el,i) {
                  if ((el.brand == "dct")&&(el.linked == product_id)) {
                      dct_product_id = el.id;
                      return el;
                  }
              });
              if (dct_product_id) {
              //получаем интеграцию с метрикой
                $.get('https://lk.mango-office.ru/ct/api/v1/'+dct_product_id+'/integrations/tokens/metrika', function( data ) {
                    data.data.forEach(function(e) {
                      metrikas[e.id] = e.params;
                    });
                });
                //Добавим кнопки ДКТ в верхнее меню быстрого доступа (dct_buttons)
                $('#dct_buttons').html('<a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/'+dct_product_id+'\'">ДКТ</a> <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/'+dct_product_id+'/widgets/list\'">Сайты</a> ');
                  //Получаем тариф
                  $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/tariff', function( data ) {
                      tarif = data;
                      //Получаем список виджетов
                      $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/previews', function( data ) {
                          widgets = data;
                          //Выводим информацию
                          dct_options_string = 'Тариф: '+tarif+'<br>';
                          widgets.forEach(function(e) {
                              widready.push(e.widget_id);
                              dct_strings[e.widget_id] = '';
                              dct_strings[e.widget_id] += '<details><summary>'+e.widget_id+' '+e.name+'</summary><p>Название: <a href="http://'+e.name+'" target="_blank">'+e.name+'</a><br>Подключен: '+e.created+'<br>Время закрепления: '+e.expire+'';
                              $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/widgets/'+e.widget_id, function( data ) {
                                  dct_strings[e.widget_id] += '<br>Регион: '+data.default_region.region_name+'<br><br>Подключенные интеграции:<br>';
                                  var int = data.integrations;
                                  for(var k in int) {
                                      if (int[k].integration_id != null) {
                                          dct_strings[e.widget_id] += '<a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/'+dct_product_id+'/widgets/'+e.widget_id+'/integrations/'+k+'\'">'+k+'</a>';
                                          if (k == 'adwords') {
                                              var adw = int[k].params;
                                              for(var j in adw) {
                                                  dct_strings[e.widget_id] += '<br>Аккаунт '+adw[j].login+' подключен: '+adw[j].token_created+', последняя синхронизация: '+adw[j].sync_time+' ('+adw[j].integration_error+')';
                                              }
                                          }
                                          if (k == 'metrika') {

                                            //int[k].params.integratorTokenId
                                            dct_strings[e.widget_id] += '<br>Аккаунт '+int[k].account+' подключен: '+metrikas[int[k].params.integratorTokenId].created+', последняя синхронизация: '+int[k].params.sync_time+' <a href="http://192.168.2.153/dashboard/logi_metriki?login='+int[k].account+'&token='+metrikas[int[k].params.integratorTokenId].token+'" target="_blank">Смотреть логи</a>';
                                            
                                          }
                                          if (k == 'direct') {
                                              var di = int[k].params;
                                              for(var j in di) {
                                                  dct_strings[e.widget_id] += '<br>Аккаунт '+di[j].login+' подключен: '+di[j].token_created+', последняя синхронизация: '+di[j].sync_time+' ('+di[j].integration_error+') <a href="http://192.168.2.153/dashboard/yandex_direct_urls?login='+di[j].login+'&token='+di[j].token+'" target="_blank">Смотреть ссылки</a>';
                                              }
                                          }
                                          if (k == 'ga') {
                                              dct_strings[e.widget_id] += ' '+int[k].account;
                                          }
                                          dct_strings[e.widget_id] += '<hr>';
                                      }
                                  }
                                  var date = new Date();
                                  var dateEnd = dts(date);
                                  date.setDate(date.getDate()-5);
                                  var dateStart = dts(date);
                                  dct_strings[e.widget_id] += 'Информация по полученным из переходов меткам за последние 6 дней:<br>';
                                  $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/reports/general?widgetId='+e.widget_id+'&dateStart='+dateStart+'&dateEnd='+dateEnd+'&pageCount=20&sortBy=sessions&sortOrder=desc&groupType=campaign&timeZoneOffset=3', function( data ) {
                                      data.rows.forEach(function(r) {campaigns += r.item+', '});
                                      if (campaigns) campaigns = campaigns.substr(0,campaigns.length-2);
                                      dct_strings[e.widget_id] += '<br><b>UTM_campaign:</b> '+campaigns;
                                      $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/reports/general?widgetId='+e.widget_id+'&dateStart='+dateStart+'&dateEnd='+dateEnd+'&pageCount=20&sortBy=sessions&sortOrder=desc&groupType=term&callType=1&timeZoneOffset=3', function( data ) {
                                          data.rows.forEach(function(r) {terms += r.item+', '});
                                          if (terms) {terms = terms.substr(0,terms.length-2);}
                                          dct_strings[e.widget_id] += '<br><b>UTM_term:</b> '+terms;
                                          $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/reports/calls?widgetId='+e.widget_id+'&dateStart='+dateStart+'&dateEnd='+dateEnd+'&pageCount=10&sortBy=called&sortOrder=desc&groupType=campaign&timeZoneOffset=3', function( data ) {
                                            var index = widready.indexOf(e.widget_id); 
                                            widready[index] = true;
                                            setTimeout(show_dct_once_again, 5000);  
                                            dct_strings[e.widget_id] += '<br><b>Звонков за последние 6 дней:</b> '+data.rows.length+'<hr>';
                                              for(var l in data.rows) {
                                                  if (data.rows[l].first_url != null) {
                                                      dct_strings[e.widget_id] += 'Адрес сайта: <a href="'+data.rows[l].first_url.split('/')[0]+'//'+data.rows[l].first_url.split('/')[2]+'" target="_blank">'+data.rows[l].first_url.split('/')[2]+'</a>';
                                                      return data.rows[l].first_url;
                                                  }
                                              }

                                              //dct_loaded = true;
                                              //dct_strings[e.widget_id] += '</p></details>';
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              }
          });
  }
  
  function showPage() {
      $('footer').html('<script>$("#vats_select").change(function(){location.href="https://lk.mango-office.ru/profile/'+product_code+'/"+$("#vats_select option:selected").attr("name")+"/diagnosis";});</script><style>'+styles+'</style><select id="vats_select" style="margin-left: 50px;width: 20%;margin-bottom: 40px;"></select><ul class="tabs"><li class="tab"><a data-href="#one">Основное</a></li><li class="tab"><a data-href="#dct">ДКТ</a></li><li class="tab"><a data-href="#two">Акт.SIP-ы</a></li><li class="tab"><a data-href="#three">Сотрудники</a></li><li class="tab"><a data-href="#four">Группы</a></li></ul><div class="tabs-content"><ul>  <li class="content" id="one"><span id="one_main">ЗАГРУЖАЕТСЯ: Основная информация</span><hr><p id="cloudstorage">ЗАГРУЖАЕТСЯ: Облачное хранилище</p><hr><p id="callrecs">ЗАГРУЖАЕТСЯ: Записи разговоров</p><hr><span id="actionlog">ЗАГРУЖАЕТСЯ: Журнал действий</span></li>  <li class="content" id="dct">Информация по ДКТ загружается</li>  <li class="content" id="two">У клиента нет активных SIP-ов</li>  <li class="content" id="three">Список сотрудников загружается</li>  <li class="content" id="four">Список групп загружается</li>  </ul></div>');
      $('#dct').hide();
      $('#two').hide();
      $('#three').hide();
      $('#four').hide();
      show_main(); 
      $('#three').css('opacity', 0.05);
    
      //Показывает фрейм с ЛК и кнопками быстрого доступа
      document.getElementsByClassName('wrap')[0].innerHTML = '<p><a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/vats\'">Обзорная панель</a> <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/index\'">Сотрудники</a> <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/grouped\'">Группы</a> <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-fwd-settings/overview\'">Схема</a> <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/stats\'">История</a> <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording\'">Записи</a> <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/additional-settings/cloud-storage\'">Облачное хранилище</a> <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/actions-log\'">Журнал действий</a> | <span id="dct_buttons"></span></p><iframe onload="$(this).css(\'opacity\',\'1\');" id="framelk" src="https://lk.mango-office.ru/'+product_code+'/'+product_id+'/vats" style="width: 100%; height: 97%;" align="left">Ваш браузер не поддерживает плавающие фреймы!</iframe>';
    
      //Функция загрузки списка сотрудников в группе при клике на имя группы
      function clickGroupInfo() {
        $('summary.groups').click(function() {
           if ($(this).parent().attr('open') != 'open') {
              $(this).css('font-weight', 'bold');
              var group_id = $(this).parent().attr('data-id'); console.log(group_id);
              $('#g'+group_id).html(getGroupInfo(group_id)); console.log(getGroupInfo(group_id));
           } else {
              $(this).css('font-weight', 'normal');
              }
        });
      }
    
        function getGroupInfo(grn) {
      //передать id группы
      //вывести найденных сотрудников по id группы (в id элемента)
      var grs = '';
        members_settings.forEach(op=>{
           //console.log(op.operator_groups);
           if (op.operator_groups[grn] != undefined) grs += op.name+'<br>'; console.log(grs);
        });
      return grs;
      /*
        $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/grouped', function(data) {
            //console.log(JSON.parse($(data).find('#point-members-members-data').html()));
            var o = JSON.parse($(data).find('#point-members-members-data').html());
            o.forEach(op=>{
                //console.log(op.operator_groups);
                if (op.operator_groups[1013234] != undefined) console.log(op.name)
            });
        });
      */
    }
    
      //Функция загрузки информации о сотруднике при клике на его имя
      function clickUserInfo() {
          $('#three').css('opacity', 1);
          $('summary.users').click(function() {
              if ($(this).parent().attr('open') != 'open') {
                  $(this).css('font-weight', 'bold');
                  $(this).css('font-size', '16px');
                  var member_id = $(this).parent().attr('data-id');
                  //member_id = parseInt(member_id, 10);
                  var member_settings = members_settings.filter(function(m){
                      return m.id === parseInt(member_id, 10);
                  });

                  //console.log(member_settings[0]);

                  if (member_settings[0].use_status == 1) {$('#'+member_id).html('<b>Учитывать статус КЦ:</b> включено<br>');} else {$('#'+member_id).html('<b>Учитывать статус КЦ:</b> выключено<br>');}
                  member_settings[0].numbers.forEach(function(mn){
                      if (mn.schedule.length == 0) {var shed = 'нет';} else {var shed = 'есть';}
                      $('#await'+mn.id).html('<b>Ожидание:</b> '+mn.wait_time+'<br><b>Расписание:</b> '+shed+'<hr>');
                  });
                  
                  var xabid = $(this).parent().children('#billingid').text();
                  var item_sip = sipregs.find(x => x.abonent_id === xabid).sip; console.log(item_sip);
                  var sip_regs = '';
                  var item_class;
                  var item_c_sip;
                  item_sip.forEach(function(e) {
                      item_c_sip = e.uname;
                      item_class = item_c_sip.replaceAll('.', '_').replaceAll('@', '_');
                      sip_regs += ' ['+e.uac+']'
                  });
                  $('.'+item_class).html(item_c_sip+sip_regs);
                  
                  //$(this).parent('details').children('p').html('Answer for request there');
              } else {
                  $(this).css('font-weight', 'normal');
                  $(this).css('font-size', '15px');
              }
          });
      }
    setTimeout(clickUserInfo, 3000);
    setTimeout(clickGroupInfo, 3000);
    

    
    $('.tab > a').click(function(e){
        $('#one').hide();
        $('#dct').hide();
        $('#two').hide();
        $('#three').hide();
        $('#four').hide();
        $($(this).attr('data-href')).show();
      if ($(this).attr('data-href') == '#dct') {show_dct_once_again();}
    });
  }
  


  window.onload = function() {
      if ((location.href.split('/')[3] == 'profile')&&(location.href.split('/')[6] != 'diagnosis')) {
          $('.member-info__logo-wrap').attr('href', $('.member-info__logo-wrap').attr('href')+'/diagnosis');
      } else {
          document.title = 'Диагностика';
          //Вкладка ДКТ
          getDCT(); //dct was here
          //Вторая вкладка - генсипы
          sipuac_options_string = 'Активные SIP по клиенту<br>';
          $.isSubstring = function(haystack, needle) {
            return haystack.indexOf(needle) !== -1;
          };
          
          $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/mango-numbers/numbers', function(data) {
              $html = $(data); 
              if ($html.find(".number [data-sip]").length > 0) {
                  $html.find(".number [data-sip]").each(function(){
                      if ($.isSubstring($(this).attr('data-sip'), "@")) {
                          $.ajax({type: "POST", success: function(e){
                              if (JSON.parse(e).line.sip_uac_settings) sipuac_options_string += '<details><summary style="font-size: 15px;">'+JSON.parse(e).line.number_title+' ('+JSON.parse(e).line.abonent_name+') <a href="http://192.168.2.153/dashboard/sipuac_logs?sip='+JSON.parse(e).line.sip_uac_settings.aor+'" target="_blank">Проверить</a><br></summary><p>'+'<b>Комментарий:</b> '+JSON.parse(e).line.number_desc+'<br><b>Исходящий номер:</b> '+(JSON.parse(e).line.ani_number.substr(0,4) == 'user' ? '(SIP) ' : '(DID) ')+JSON.parse(e).line.ani_number+'<br><b>Настройки</b><br><b>Логин:</b> '+JSON.parse(e).line.sip_uac_settings.remote_sip_user+'<br><b>Сервер:</b> '+JSON.parse(e).line.sip_uac_settings.server+'<br><b>Пароль:</b> '+JSON.parse(e).line.sip_uac_settings.remote_sip_password+'<br><b>SIP:</b> '+JSON.parse(e).line.sip_uac_settings.aor+'</p><hr></details>';
                              $('#two').html(sipuac_options_string);
                          }, url: 'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/main-uri/get', data: {abonent_id: $(this).attr('data-abonent_id')}});
                      }
                  });
              } else {
                  sipuac_options_string = 'У клиента нет активных SIP-ов'; 
                  $('#two').html(sipuac_options_string);
              }
          });
          //Третья вкладка - сотрудники
          $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/index', function(data) {
              $html = $(data);
              members_settings = JSON.parse($html.find("#b-members-data").html());
            console.log(members_settings);
          });
          users_option_string = 'Список сотрудников<br><p><input type="text" class="form-control pull-right" id="search" placeholder="Поиск"></p><script>$(document).ready(function(){$("#search").keyup(function(){_this = this;$.each($("summary"), function() {if(($(this).parent().text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)&&($(this).parent().children("p").html().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)) {$(this).parent().hide();} else {$(this).parent().show();}});});});</script><br>';
          $.get('https://lk.mango-office.ru/profile/'+product_code+'/'+product_id+'/api/members/', function( data ) {
              data.forEach(function(u) {
                  if (u.active == "1") {
                      users_option_string += '<details data-id="'+u.id+'"><summary class="users" style="font-size: 15px;">'+u.abonent.name+' ('+u.extension+') <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/index/autoopen/'+u.id+'\'">карточка</a></summary><p>'+'<span id="'+u.id+'"></span><b>Роль: </b>'+u.abonent.role.name+'<hr>';
                      users_option_string += 'id (WA): '+u.id+'<br>';
                      users_option_string += 'id (биллинг): <span id="billingid">'+u.abonent.id+'</span><br><hr>';
                      u.numbers.forEach(function(unum){
                          users_option_string += '<span id="'+unum.id+'" class="'+unum.number.replaceAll('.', '_').replaceAll('@', '_')+'"';
                          if (unum.active == false) {users_option_string +=' style="color: #f500008a;">(не активен) '+unum.number;} else {users_option_string +='>'+unum.number;}
                          users_option_string += '</span>';
                          if (unum.number.indexOf('@') > -1) {users_option_string += ' <a href="http://webadmin.mango.local:8088/wa/?sip='+unum.number+'#p=sswa-module-sip-sessions-cluster" target="_blank">Р</a> <a href="http://logs.mango.local/?type=sip-registrar&value='+unum.number+'" target="_blank">Л</a> <a href="http://logs.mango.local/?type=sip-balancer&value='+unum.number+'" target="_blank">Б</a>';}
                          users_option_string += '<br><span id="await'+unum.id+'"></span>';
                      });
                      $.get('https://lk.mango-office.ru/profile/'+product_code+'/'+product_id+'/api/presence', function( data ) {
                         sipregs = data;
                      });
                      users_option_string += '</p></details>'; $('#three').html(users_option_string);
                  }
              });
          });
          //Четвертая вкладка - группы
          group_option_string = 'Группы<br>';
          $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/grouped', function(data) {
              var groups = JSON.parse($(data).find('#point-members-groups-data').html());
              groups.forEach(g => {
                group_option_string += '<details data-id="'+g.id+'"><summary class="groups">'+g.name+' ('+g.transfer_number+') <a onclick="$(\'#framelk\').css(\'opacity\',\'0.2\'); framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/grouped/autoopen/'+g.id+'\'">карточка</a></summary><p>ID группы: '+g.id+'<hr>Список сотрудников:<br><span id="g'+g.id+'"></span></p><hr></details>';
                $('#four').html(group_option_string);
              });
          });
        
          //Покажем загруженную страницу 
          setTimeout(showPage, 100);
      }
  };
}