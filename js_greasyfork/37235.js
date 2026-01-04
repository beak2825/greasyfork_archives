// ==UserScript==
// @name        VK checker
// @namespace   local
// @description Дополнительная проверка пользователей для рассылки
// @include     http://vk.com/*
// @include     https://vk.com/*
// @include     https://new.vk.com/*
// @version     11
// @grant       none
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/37235/VK%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/37235/VK%20checker.meta.js
// ==/UserScript==
 
console.log("Скрипт vk_checker запущен");

if($("#myprofile").length == 0 && $("#profile").length == 0) {
	
  $("div#quick_login").append("<button class=\"flat_button button_big\" id=\"checker_button\" style=\"margin-top:20px;margin-left:10px;background-color:#63b3a8;\">Проверить<br>пользователей</button>");
  $("div#index_login").append("<button class=\"flat_button button_big\" id=\"checker_button\" style=\"margin-top:20px;margin-left:10px;background-color:#63b3a8;\">Проверить<br>пользователей</button>");
    
	$(document).on("click", "#checker_button", function () {
		checker_open();
    });
	
};

checker_open = function() {
	
	window.checker_started = false;	
	
	if($("form[name='checker']").length == 0) {
	
    var $form_container = null;
    
    $form_container = $("div.login_mobile_promo");
    if($form_container.length == 0) {
      $form_container = $("div.login_mobile_promo_wrap");
    };
     if($form_container.length == 0) {
      $form_container = $("div#content");
    };
  
	  $form_container.html ( "<form method='get' name='checker' action=''>" +
	  "<p><label id='checker_header' for='checker_urls'><strong>Вставьте ссылки с аккаунтами ВК, по одной на строку:</strong></label></p>" +
	  "<p><textarea name='checker_urls' id='checker_urls' rows='21' cols='50'></textarea></p>" +
    "<p><input id='can_write_priv_msg_cb' type='checkbox' checked><label>Отфильтровать тех, у кого отключены сообщения</label></p>" +
    "<p><input id='can_send_friend_rq_cb' type='checkbox' checked><label>Отфильтровать тех, кто не принимает друзей</label></p>" +
    "<p><input id='last_seen_days_cb' type='checkbox' checked><label>Отфильтровать тех, кто не заходил более, чем </label><input id='last_seen_days_max' name='last_seen_days_max' type='number' value='14' min='0' max='365' style='max-width: 3em;'><label> дней</label></p>" +
    "<p><input id='city_cb' type='checkbox' checked><label>Только из города </label><select id='city_sel'><option value='1'>Москва</option><option value='2'>СПб</option></select></p>" +
    "<p><input id='country_excb' type='checkbox' checked><label>Только из РФ</label></p>" +
    "<p><input id='city_excb' type='checkbox'><label>Исключить города </label><textarea id='city_exc' rows='2' cols='50' placeholder='Названия городов через запятую или пробел'></textarea></p>" +
    "<p style='display:none;'><input id='friends_cnt_cb' type='checkbox' checked><label>(НЕ РАБОТАЕТ) Фильтровать по числу друзей, не менее </label><input id='friends_min' type='number' value='1' min='0' style='max-width: 5em;'><label> не более </label><input id='friends_max' type='number' value='99999' min='0' style='max-width: 5em;'></p>" +
	  "<p><input id='checker_start' class='flat_button button_big' style='background-color:#63b3a8;' value='Проверить' type='button'>" +
	  "</p></form>" +
	  "<div id='checker_log'></div>" );
	  
	  $(document).on("click", "#checker_start", function () {
	            checker_start();
	        });
	
	} else {
		$("#checker_start").val("Проверить");
		$("#checker_start").prop('disabled', false);
		$('#checker_urls').val("");		
		$('#checker_log').html("");
    $('#checker_header').html("<strong>Вставьте ссылки с аккаунтами ВК, по одной на строку:</strong>");		
	} 
};

checker_start = function() {
	
	var checker_urls = $('#checker_urls');
	if(checker_urls.length == 0) {
		console.log('Элемент checker_urls не найен @ checker_start()');
		return;
	};

  if($('#city_excb').is(':checked')) {
    window.cities_exclude = $('#city_exc').val().replace(/[,;:]+/g, ',').toUpperCase().split(',');
    window.cities_exclude = window.cities_exclude.map(function(city) {
      return city.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
    });
    console.log(window.cities_exclude);
  };
	
	window.checker_started = true;
	
	window.urls_to_check = checker_urls.val().split('\n').filter(function(e) { return $.trim(e).length > 0 });
	
	console.log('Найдено ' + window.urls_to_check.length + ' строк для обработки');

	$('#checker_log').html("");
	
	window.correct_urls = [];
	window.checker_timers = [];
	window.checker_api_timers = [];
	window.requests_inprocess = 0;
	
	$("#checker_start").val("Идет проверка |");
	$("#checker_start").prop('disabled', true);
	window.checker_progress = 1;
	
	checker_process_next();
	
};

checker_process_next = function() {
	
  var user_ids = [];
  var user_ids_s = "";
	
	if(!window.checker_started) return;
	
  console.log("checker_process_next");
  
	if(window.urls_to_check.length == 0) { //нечего более открывать - сообщение + выход
		
		checker_stop();
		return;
		
	};
	
  var batch = 100; //обрабатывать за раз по 100 пользователей
  if(window.urls_to_check.length < batch) {
    batch = window.urls_to_check.length;
  }
  
  for(var i = 0; i < batch; i++) {
  
  	var s = $.trim(window.urls_to_check[i]);
    var user_id;

  	if(/^[a-z0-9\._]+$/.test(s)) { //содержит только символы, цифры, точки и подчеркивания - это vk id
  		user_id = s;
  	} else if(s.substr(0,14)=='http://vk.com/') {
	  	user_id = s.slice(14);
    } else if(s.substr(0,15)=='https://vk.com/') { //проверка начала url
	  	user_id = s.slice(15);
	  } else {
	  	checker_log(s + " - некорректная ссылка", "red");
	  	//window.checker_timers.push(setTimeout(checker_process_next, 1)); //переходим к следующему с мин.задержкой
	  	continue;
	  };

  	if(!/^[a-z0-9\._]+$/.test(user_id) || user_id.length > 30) { //проверка конца url - должен сод. лат.буквы, цифры, _ или . // на всякий случай проверка длины
	  	checker_log(s + " - некорректная ссылка", "red");
		  //window.checker_timers.push(setTimeout(checker_process_next, 1)); //переходим к следующему с мин.задержкой
	  	continue;
  	}
    
    user_ids.push(user_id);
    
    if(user_ids.length === 0) {
      user_ids_s = user_id;
    } else {
      user_ids_s = user_ids + ',' + user_id;
    }
    
  }

 	window.urls_to_check.splice(0, batch);

  if(user_ids.length > 0) {
	  checker_get_user_data(user_ids, user_ids_s, 1);
	};
  
	window.checker_timers.push(setTimeout(checker_process_next, 1000 /*350*/)); // чуть менее 3шт в сек.
		
};

checker_get_user_data = function(user_ids,user_ids_s,attempt) {

	var next = attempt + 1;
	
	if(attempt == 1) {
		window.requests_inprocess++;
	};
	
	//запрос данных пользователя через VK API
	var api_url = "https://api.vk.com/method/users.get?user_ids=" + user_ids_s + "&fields=domain,sex,city,country,has_photo,online,can_write_private_message,can_send_friend_request,last_seen,counters&lang=ru&v=5.69";

	//console.log('Запрос данных пользователя ' + user_id + ' через API');

	$.ajax({
		url: api_url,
		dataType: "jsonp",
		timeout: 10000, //таймаут 10сек
		success: function(data, textStatus, jqXHR) {
			checker_user_data_loaded(user_ids, user_ids_s, data, attempt);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			checker_log(s + " - проблема со связью, повтор через 10сек", "red");
			console.log(s + " - ошибка запроса VK API: " + textStatus);
			//запускаем заново с задержкой
			window.checker_api_timers.push(setTimeout(checker_get_user_data, 10000, user_ids, user_ids_s, next)); //с задержкой еще 10 сек
		}
	});
		
};

checker_user_data_loaded = function(user_ids, user_ids_s, data, attempt) {

	var next = attempt + 1;
	
	if(!window.checker_started) return;
	
  //console.log("checker_user_data_loaded");

	if(data.error) {
		if(data.error.error_code == "113") {     //бывает только когда запрошен 1 пользователь и он - не пользователь
			checker_log(user_ids[0] + " - не пользователь VK", "orange");
			window.requests_inprocess--;
		} else {
			checker_log(user_ids_s + " - ошибка ВК, повтор через 10сек", "red");
			console.log(user_ids_s + " - ошибка запроса VK API: " + data.error.error_code + " " + data.error.error_msg);
			//запускаем заново с задержкой
			window.checker_api_timers.push(setTimeout(checker_get_user_data, 10000, user_ids, user_ids_s, next)); //с задержкой еще 10 сек			
		};
		return;
	};
	
	if(!data.response) {
		checker_log(user_ids_s + " - проблема со связью, повтор через 10сек", "red");
		console.log(user_ids_s + " - пришел кривой ответ от VK API");
		//запускаем заново с задержкой
		window.checker_api_timers.push(setTimeout(checker_get_user_data, 10000, user_ids, user_ids_s, next)); //с задержкой еще 10 сек			
		return;
	};

  for(var i = 0; i < user_ids.length; i++) {
  
    var s = user_ids[i];
    //console.log("обрабатываем " + s);
    
    var user_data = find_user_data(s, data.response); 
    if(user_data === null) { //пользователя нет в вых.данных - это был и не пользователь воввсе
			checker_log(s + " - не пользователь VK", "orange");
      continue;
    };

    //console.log(user_data);

    var log_prefix = s + " - " + user_data.first_name + " " + user_data.last_name;
    if(user_data.city) {
      log_prefix = log_prefix + ", " + user_data.city.title;
    }   
	
   	if(user_data.deactivated == "banned") {
   		checker_log(log_prefix + " - аккаунт забанен", "orange");
   		continue;
   	};

  	if(user_data.deactivated == "deleted") {
	  	checker_log(log_prefix + " - аккаунт удален", "orange");
   		continue;
  	};
	        
    if($('#can_write_priv_msg_cb').is(':checked')) {
	    if(user_data.can_write_private_message != 1) {
		    checker_log(log_prefix + " - отключены сообщения", "orange");
		    continue;
	    }
    };

    if($('#can_send_friend_rq_cb').is(':checked')) {
	    if(user_data.can_send_friend_request != 1) {
		    checker_log(log_prefix + " - не принимает друзей", "orange");
  		  continue;
	    }
    };

    if($('#city_cb').is(':checked')) {
      if(!user_data.country || user_data.country.id != 1 || !user_data.city || user_data.city.id != $('#city_sel').val()) {
  	  	if(!user_data.country) {
          checker_log(log_prefix + " - не указана страна", "orange");
        } else if(!user_data.city) {
          checker_log(log_prefix + " - не указан город", "orange");
        } else {
          checker_log(log_prefix + " - отфильтровано по городу", "orange");
        }
		    continue;
      }
    };

    if($('#country_excb').is(':checked')) {
      if(!user_data.country || user_data.country.id != 1) {
  	  	if(!user_data.country) {
          checker_log(log_prefix + " - не указана страна", "orange");
  	  	} else {
          checker_log(log_prefix + " - не из РФ", "orange");
        }
		    continue;
      }
    };

    if($('#city_excb').is(':checked')) {
      if(!user_data.city || window.cities_exclude.indexOf(user_data.city.title.toUpperCase()) >= 0 ) {
  	  	if(!user_data.city) {
          checker_log(log_prefix + " - не указан город", "orange");
        } else {
          checker_log(log_prefix + " - отфильтровано по городу", "orange");
        }  
		    continue;
      }
    };

  	var last_seen_days;
		var phrase;
    
  	if(user_data.online) {
  		checker_log(log_prefix + " - Online", "green");
  	} else {
	  	last_seen_days = Math.floor(( vk.ts - user_data.last_seen.time ) / 3600 / 24);
		
      if($('#last_seen_days_cb').is(':checked')) {
	  	  if(last_seen_days > parseInt($('#last_seen_days_max').val())) {
          phrase = "давно не заходил";
          if(user_data.sex == 1) {
            phrase = phrase + 'а';
          };
		      checker_log(log_prefix + " - " + phrase + " (" + last_seen_days.toString() + " дн.)", "orange");
    	    continue;
  		  }
      };
      
      phrase = 'был';
      if(user_data.sex == 1) {
        phrase = phrase + 'а';
      };
		
  		if(last_seen_days == 0) {
	  		checker_log(log_prefix + " - " + phrase + " сегодня", "green");			
   		} else {
		  	checker_log(log_prefix + " - " + phrase + " " + last_seen_days.toString() + " дн. назад", "green");			
	  	}
  	};
  	
  	window.correct_urls.push("https://vk.com/" + s);

  };
  
	window.requests_inprocess--;
	
};

function find_user_data(user_id, response) {
  for(var i = 0; i < response.length; i++) {
    if(user_id == response[i].domain || user_id == "id" + response[i].id.toString()) {
      return response[i];
    }
  }
  return null;
};

function checker_log(message, color) {
	
	var log = $( '#checker_log' );
	
	if(log.length == 0) {
		console.log('Элемент checker_log не найден');
		return;
	};
	
	$('<div/>', {
		text: message,
		style: "color:"+ color + ";"
	}).appendTo(log);
	
	switch (window.checker_progress) {
	case 1:
		$("#checker_start").val("Идет проверка |");
		window.checker_progress = 2;
		break
	case 2:
		$("#checker_start").val("Идет проверка /");
		window.checker_progress = 3;
		break
	case 3:
		$("#checker_start").val("Идет проверка -");
		window.checker_progress = 4;
		break
	case 4:
		$("#checker_start").val("Идет проверка \\");
    	window.checker_progress = 1;
		break
	default:
		window.checker_progress = 1;
	}
		
};

checker_stop = function() {
	
	if(!window.checker_started) return;
	
	if(window.requests_inprocess <= 0) {
		checker_log("Проверка завершена", "green");
		
		$("#checker_start").val("Проверка завершена");
    $("#checker_header").html("<strong>Скопируйте себе полученный список:</strong>");
		
		// Формируем список корректных url
		var urls = "";
		for(var i=0;i<correct_urls.length;i++) {
			if(correct_urls[i] != "") urls = urls + correct_urls[i] + '\n';
		};
		$('#checker_urls').val(urls);
		
		window.checker_started = false;
		
		return;		
	} else {
		window.checker_timers.push(setTimeout(checker_stop, 1000)); //ожидание завершения ajax и таймеров
	}
};




