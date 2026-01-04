// ==UserScript==
// @name        RMOE
// @namespace   RM_OE
// @match       *://redmine.mango.local/issues/*
// @grant       none
// @version     1.21
// @author      -
// @description 17.02.2020, 12:03:38
// @downloadURL https://update.greasyfork.org/scripts/396551/RMOE.user.js
// @updateURL https://update.greasyfork.org/scripts/396551/RMOE.meta.js
// ==/UserScript==

var apikey;
$.get('http://redmine.mango.local/my/api_key', function(data) {
apikey = $(data).find('.box pre').html();
});

var issue_id = $('.pdf')[0].href.split('/')[4].split('.')[0];

var prevCF = $('.cf_105 .value').html();

$('.cf_105 .value').html('<select id="cf_105_list" class="list_cf"><option selected="selected" value=""></option><option value="Ошибка ПО">Ошибка ПО</option><option value="Проблема в требованиях">Проблема в требованиях</option><option value="Инфраструктурная проблема">Инфраструктурная проблема</option><option value="Ошибка использования">Ошибка использования</option><option value="Дубликат">Дубликат</option><option value="Внешние факторы">Внешние факторы</option><option value="Новое продуктовое свойство">Новое продуктовое свойство</option></select>')

$('#cf_105_list')[0].selectedIndex = $('[value="'+prevCF+'"]')[1].index;
if (prevCF == '') $('#cf_105_list')[0].selectedIndex = 0;

$('#cf_105_list').change(function(t) {change_cf105(t.target[t.target.selectedIndex].value)})

function change_cf105(val) {
    /*if (val == 'Новое продуктовое свойство') {
        var data = JSON.stringify({"issue":{"custom_fields":[{"value":val,"id":105},{"value":"906","id":128}]}});
    } else {
        var data = JSON.stringify({"issue":{"custom_fields":[{"value":val,"id":105},{"value":"","id":128}]}});
    }*/
    
    var data = JSON.stringify({"issue":{"custom_fields":[{"value":val,"id":105}]}});
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("PUT", "http://redmine.mango.local/issues/"+issue_id+".json?key="+apikey);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  /*if (val == 'Новое продуктовое свойство') {
    $('.cf_128 .value').html('<a class="user active" href="/users/906">Группа опытной эксплуатации</a>');
  } else {
    $('.cf_128 .value').html('');
  }*/
}

function change_cf128() {
    var data = JSON.stringify({"issue":{"custom_fields":[{"value":"906","id":128}]}});

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("PUT", "http://redmine.mango.local/issues/"+issue_id+".json?key="+apikey);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  $('.cf_128 .value').html('<a class="user active" href="/users/906">Группа опытной эксплуатации</a>');
  document.getElementById('issue_custom_field_values_128').value = 906;
}

function change_status() {
  var data = JSON.stringify({"issue":{"status_id":5}});
                             var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("PUT", "http://redmine.mango.local/issues/"+issue_id+".json?key="+apikey);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
  $('.status .value').html('Закрыт');
  $('.status .label').html('Статус: ');
}

$('.cf_128 .label').html('Инициатор: <a id="to_oe">Поставить нас</a>');
$('#to_oe').click(function(){change_cf128()});

$('.status .label').html('Статус: <a id="close_issue">Закрыть</a>');
$('#close_issue').click(function(){change_status()});