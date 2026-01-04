// ==UserScript==
// @name DCT Diagnosis
// @namespace DCT Diagnosis Scripts
// @description Diagnosis for LK Mango Office
// @match *://lk.mango-office.ru/profile/*/diagnosis*
// @match *://lk.mango-office.ru/profile/*
// @grant none
// @version 0.0.1.20191016132456
// @downloadURL https://update.greasyfork.org/scripts/391259/DCT%20Diagnosis.user.js
// @updateURL https://update.greasyfork.org/scripts/391259/DCT%20Diagnosis.meta.js
// ==/UserScript==

//Подключаем скрипт куки
var my_awesome_script = document.createElement('script');
my_awesome_script.setAttribute('src','https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js');
document.head.appendChild(my_awesome_script);

//Создаем ссылку на diagnosis
function createLink() {
  $('.member-info__logo-wrap').attr('href', $('.member-info__logo-wrap').attr('href')+'/diagnosis');
}

//Копирование ЛС по клику на ЛС
var iteration = 0;
function copyLS() {
  iteration++;
  if (iteration>90) {clearInterval(timerCLS);}
  if ($($('#framelk').contents()[0]).find('.val').html()) {
      $($('#framelk').contents()[0]).find('.val').click(function(){
        navigator.clipboard.writeText(this.innerHTML);
      });
      clearInterval(timerCLS);
  }
}

var timerCLS = setInterval(copyLS, 700);

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
  //Строки вывода
  var dct_options_string; //ДКТ общая строка
  var dct_strings = []; //ДКТ массив строк по каждому виджету
  var sipuac_options_string; //Акт. SIP
  var users_option_string; //Сотрудники
  var vats_select_string = ''; //Список ВАТСей
  var actionlog_string ='<b><a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/actions-log\'">Журнал действий</a> за сегодня:</b><br>'; //Журнал действий
  //Список utm_campaign и utm_term
  var campaigns;
  var terms;
  //Список сотрудников
  var members;
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
          $('#cloudstorage').html('<b><a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/additional-settings/cloud-storage\'">Облачное хранилище</a>:</b><br>'+$html.find("#use").html());});
      $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording/settings', function(data) {
          $html = $(data); 
          if ($html.find('select#firec_dest > option:selected').html() != 'Только в облачном хранилище') {var recmails = '<br>E-mail: '+$html.find('#fsrec_mail').val();} else {var recmails = '';}
          rec_active = $html.find('[name="id"]:checked');
          if (rec_active.attr('data-name') === undefined) {
              $('#callrecs').html('<b><a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording\'">Запись разговоров</a> отключена</b>');
          } else {
              $('#callrecs').html('<b><a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording\'">Запись разговоров</a>:</b><br><span id="rec_set"></span><br>'+$html.find('select#firec_dest > option:selected').html()+recmails);
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
                  rec_settings = 'Запись разговоров ведется по правилам: <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording/rules\'">правила</a>';
              }
              $('#rec_set').html(rec_settings);
          });
      });

  }
  
  function getActionLog(h) {
      $.get('https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/get-action-log-data?hash='+h, function( data ) {
          if (JSON.parse(data).status != 'complete') {var hs = h; setTimeout(getActionLog(hs), 500); console.log('not completed');} else { 
              if ($($(JSON.parse(data).output).find('tbody').html()).find('td:last-child').length == 0) {
                  actionlog_string = '<b><a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/actions-log\'">Журнал действий</a> за сегодня</b> пуст<br>';
                  $('#actionlog').html(actionlog_string);
              } else {
                  $($(JSON.parse(data).output).find('tbody').html()).find('td:last-child').each(function(){actionlog_string += $(this).html()+'<br>'; $('#actionlog').html(actionlog_string);});
              }
          }
      });
  }
  //Отображает основную информацию аккаунта и список ВАТСей, облачное хранилище, журнал действий за сегодня
  function show_main() {
      $.ajax({
        type: "POST", success: function(e){
          $('#one_main').html("<b>Название:</b> "+e.data.customer.fspersonname+"<br><b>Версия:</b> "+e.data.currentProduct.fsplan_name+"<br><b>Основной e-mail:</b> "+e.data.customer.fsemail); 
          if (e.data.sets.length == 1) {$('#vats_select').hide(); $('.footer').css('height','calc(100vh - 49px)');} else {e.data.sets.forEach(function(vats){vats_select_string += '<option '+(vats.id == product_id ? 'selected' : '')+' name="'+vats.id+'">'+vats.name+'</option>'}); 
          $('#vats_select').html(vats_select_string);
        }}, url: 'https://api-header.mango-office.ru//api/menu',
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
      //if (dct_loaded === false) {setTimeout(show_dct, 1000);} else {
      if (dct_product_id) {
          dct_strings.forEach(function(ds) {dct_options_string += ds+'</p></details>';});
          $('#dct').html(dct_options_string);
     } else {
       $('#dct').html('У клиента нет ДКТ');
     }
  }
  
  function showPage() {
      $('footer').html('<script>$("#vats_select").change(function(){location.href="https://lk.mango-office.ru/profile/'+product_code+'/"+$("#vats_select option:selected").attr("name")+"/diagnosis";});</script><style>'+styles+'</style><select id="vats_select" style="margin-left: 50px;width: 20%;margin-bottom: 40px;"></select><ul class="tabs"><li class="tab"><a data-href="#one">Основное</a></li><li class="tab"><a data-href="#dct">ДКТ</a></li><li class="tab"><a data-href="#two">Акт.SIP-ы</a></li><li class="tab"><a data-href="#three">Сотрудники</a></li><li class="tab"><a data-href="#four">4</a></li></ul><div class="tabs-content"><ul>  <li class="content" id="one"><span id="one_main">ЗАГРУЖАЕТСЯ: Основная информация</span><hr><p id="cloudstorage">ЗАГРУЖАЕТСЯ: Облачное хранилище</p><hr><p id="callrecs">ЗАГРУЖАЕТСЯ: Записи разговоров</p><hr><span id="actionlog">ЗАГРУЖАЕТСЯ: Журнал действий</span></li>  <li class="content" id="dct">Информация по ДКТ загружается</li>  <li class="content" id="two">У клиента нет активных SIP-ов</li>  <li class="content" id="three">Содержимое 3-й вкладки</li>  <li class="content" id="four">Содержимое 4-й вкладки</li>  </ul></div>');
      $('#dct').hide();
      $('#two').hide();
      $('#three').hide();
      $('#four').hide();
      setTimeout(show_dct, 5000);
      show_main();

      //Показывает фрейм с ЛК и кнопками быстрого доступа
      document.getElementsByClassName('wrap')[0].innerHTML = '<p><a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/vats\'">Обзорная панель</a> <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/index\'">Сотрудники</a> <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/grouped\'">Группы</a> <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-fwd-settings/overview\'">Схема</a> <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/stats\'">История</a> <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/call-recording\'">Записи</a> <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/additional-settings/cloud-storage\'">Облачное хранилище</a> <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/security/actions-log\'">Журнал действий</a></p><iframe id="framelk" src="https://lk.mango-office.ru/'+product_code+'/'+product_id+'/vats" style="width: 100%; height: 97%;" align="left">Ваш браузер не поддерживает плавающие фреймы!</iframe>';
    
      //Функция загрузки информации о сотруднике при клике на его имя
      $('summary.users').click(function() {
          if ($(this).parent().attr('open') != 'open') {
              
              var member_id = $(this).parent().attr('data-id');
              //member_id = parseInt(member_id, 10);
              var member_settings = members_settings.filter(function(m){
                  return m.id === parseInt(member_id, 10);
              });
            
              console.log(member_settings[0]);
            
              $('#'+member_id).html('');
              member_settings[0].numbers.forEach(function(mn){
                  $('#'+mn.id).html($('#'+mn.id).html()+'<br><b>Ожидание:</b> '+mn.wait_time+'<br>');
              });
              //$(this).parent('details').children('p').html('Answer for request there');
          }
      });
    
      $('.tab > a').click(function(e){
          $('#one').hide();
          $('#dct').hide();
          $('#two').hide();
          $('#three').hide();
          $('#four').hide();
          $($(this).attr('data-href')).show();
      });
  }
  


  window.onload = function() {
      if ((location.href.split('/')[3] == 'profile')&&(location.href.split('/')[6] != 'diagnosis')) {
          $('.member-info__logo-wrap').attr('href', $('.member-info__logo-wrap').attr('href')+'/diagnosis');
      } else {
          document.title = 'Диагностика';
          $.get('https://lk.mango-office.ru/profile/'+product_code+'/'+product_id+'/api/products', function( data ) {
              data.some(function(el,i) {
                  if ((el.brand == "dct")&&(el.linked == product_id)) {
                      dct_product_id = el.id;
                      return el;
                  }
              });
              if (dct_product_id) {
                  //Получаем тариф
                  $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/tariff', function( data ) {
                      tarif = data;
                      //Получаем список виджетов
                      $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/previews', function( data ) {
                          widgets = data;
                          //Выводим информацию
                          dct_options_string = 'Тариф: '+tarif+'<br>';
                          widgets.forEach(function(e) {
                              dct_strings[e.widget_id] = '';
                              dct_strings[e.widget_id] += '<details><summary>'+e.widget_id+' '+e.name+'</summary><p>Название: <a href="http://'+e.name+'" target="_blank">'+e.name+'</a><br>Подключен: '+e.created+'<br>Время закрепления: '+e.expire+'';
                              $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/widgets/'+e.widget_id, function( data ) {
                                  dct_strings[e.widget_id] += '<br>Регион: '+data.default_region.region_name+'<br><br>Подключенные интеграции:<br>';
                                  var int = data.integrations;
                                  for(var k in int) {
                                      if (int[k].integration_id != null) {
                                          dct_strings[e.widget_id] += '<a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/'+dct_product_id+'/widgets/'+e.widget_id+'/integrations/'+k+'\'">'+k+'</a>';
                                          if (k == 'adwords') {
                                              var adw = int[k].params;
                                              for(var j in adw) {
                                                  dct_strings[e.widget_id] += '<br>Аккаунт '+adw[j].login+' подключен: '+adw[j].token_created+', последняя синхронизация: '+adw[j].sync_time+' ('+adw[j].integration_error+')';
                                              }
                                          }
                                          if (k == 'metrika') {dct_strings[e.widget_id] += '<br>Аккаунт '+int[k].account+' подключен: '+int[k].params.token_created+', последняя синхронизация: '+int[k].params.sync_time+' <a href="http://192.168.2.153/dashboard/logi_metriki?login='+int[k].account+'&token='+int[k].params.token+'" target="_blank">Смотреть логи</a>';}
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
                                          if (terms) terms = terms.substr(0,terms.length-2);
                                          dct_strings[e.widget_id] += '<br><b>UTM_term:</b> '+terms;
                                          $.get('https://lk.mango-office.ru/ics/api/'+dct_product_id+'/calltracking/reports/calls?widgetId='+e.widget_id+'&dateStart='+dateStart+'&dateEnd='+dateEnd+'&pageCount=10&sortBy=called&sortOrder=desc&groupType=campaign&timeZoneOffset=3', function( data ) {
                                              dct_strings[e.widget_id] += '<br><b>Звонков за последние 6 дней:</b> '+data.rows.length+'<hr>';
                                              for(var l in data.rows) {
                                                  if (data.rows[l].first_url != null) {
                                                      dct_strings[e.widget_id] += 'Адрес сайта: <a href="'+data.rows[l].first_url.split('/')[0]+'//'+data.rows[l].first_url.split('/')[2]+'" target="_blank">'+data.rows[l].first_url.split('/')[2]+'</a>';
                                                      return data.rows[l].first_url;
                                                  }
                                              }
                                              //dct_strings[e.widget_id] += '</p></details>';
                                          });
                                      });
                                  });
                              });
                          });
                          dct_loaded = true;
                      });
                  });
              }
          });
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
          });
          users_option_string = 'Список сотрудников<br><p><input type="text" class="form-control pull-right" id="search" placeholder="Поиск"></p><script>$(document).ready(function(){$("#search").keyup(function(){_this = this;$.each($("summary"), function() {if(($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)&&($(this).parent().children("p").html().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)) {$(this).parent().hide();} else {$(this).parent().show();}});});});</script><br>';
          $.get('https://lk.mango-office.ru/profile/'+product_code+'/'+product_id+'/api/members/', function( data ) {
              data.forEach(function(u) {
                  if (u.active == "1") {
                      users_option_string += '<details data-id="'+u.id+'"><summary class="users" style="font-size: 15px;">'+u.abonent.name+' ('+u.extension+') <a onclick="framelk.src=\'https://lk.mango-office.ru/'+product_code+'/'+product_id+'/members/index/autoopen/'+u.id+'\'">карточка</a></summary><p>'+'<span id="'+u.id+'"></span><b>Роль: </b>'+u.abonent.role.name+'<hr>';
                      users_option_string += 'id (WA): '+u.id+'<br>';
                      users_option_string += 'id (биллинг): '+u.abonent.id+'<br>';
                      u.numbers.forEach(function(unum){
                          users_option_string += '<span id="'+unum.id+'"';
                          if (unum.active == false) {users_option_string +=' style="color: #f500008a;">(не активен) '+unum.number;} else {users_option_string +='>'+unum.number;}
                          users_option_string += '</span><br>';
                      })
                      users_option_string += '</p></details>'; $('#three').html(users_option_string);
                  }
              });
          });
          
          //Покажем загруженную страницу 
          setTimeout(showPage, 100);
      }
  };
}