// ==UserScript==
// @name        VK checker
// @namespace   local
// @description Дополнительная проверка пользователей для рассылки
// @include     http://vk.com/*
// @include     https://vk.com/*
// @include     https://new.vk.com/*
// @version     4
// @grant       none
// @require     https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/37202/VK%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/37202/VK%20checker.meta.js
// ==/UserScript==
 
console.log("Скрипт vk_checker запущен");

if($("#myprofile").length == 0 && $("#profile").length == 0) {
	
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
	
	window.checker_started = true;
	
	window.urls_to_check = checker_urls.val().split('\n').filter(function(e) { return $.trim(e).length > 0 });
	
	console.log('Найдено ' + window.urls_to_check.length + ' строк для обработки');

	$('#checker_log').html("");
	
	window.correct_urls = [];
	window.checker_timers = [];
	window.checker_api_timers = [];
	window.urls_inprocess = 0;
	
	$("#checker_start").val("Идет проверка |");
	$("#checker_start").prop('disabled', true);
	window.checker_progress = 1;
	
	checker_process_next();
	
};

checker_process_next = function() {
	
	var user_id;
	
	if(!window.checker_started) return;
	
	if(window.urls_to_check.length == 0) { //нечего более открывать - сообщение + выход
		
		checker_stop();
		return;
		
	};
	
	var s = $.trim(window.urls_to_check[0]);
	window.urls_to_check.splice(0,1);

	if(/^[a-z0-9\._]+$/.test(s)) { //содержит только символы, цифры, точки и подчеркивания -
        //это vk id
		user_id = s;
	} else if(s.substr(0,14)!='http://vk.com/'){ //проверка начала url
		checker_log(s + " - некорректная ссылка", "red");
		window.checker_timers.push(setTimeout(checker_process_next, 1)); //переходим к следующему с мин.задержкой
		return;
	} else {
		user_id = s.slice(14);
		
		if(!/^[a-z0-9\._]+$/.test(user_id)) { //проверка конца url - должен сод. лат.буквы, цифры, _ или .
			checker_log(s + " - некорректная ссылка", "red");
			window.checker_timers.push(setTimeout(checker_process_next, 1)); //переходим к следующему с мин.задержкой
			return;
		}
	};

	//console.log('user_id = ' + user_id);

	checker_get_user_data(s, user_id, 1);
	
	window.checker_timers.push(setTimeout(checker_process_next, 350)); // чуть менее 3шт в сек.
		
};

checker_get_user_data = function(s,user_id,attempt) {

	var next = attempt + 1;
	
	if(attempt == 1) {
		window.urls_inprocess++;
	};
	
	//запрос данных пользователя через VK API
	var api_url = "https://api.vk.com/method/users.get?user_ids=" + user_id + "&fields=sex,city,country,has_photo,online,domain,can_write_private_message,last_seen&lang=ru";

	//console.log('Запрос данных пользователя ' + user_id + ' через API');

	$.ajax({
		url: api_url,
		dataType: "jsonp",
		timeout: 10000, //таймаут 10сек
		success: function(data, textStatus, jqXHR) {
			checker_user_data_loaded(s, user_id, data, attempt);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			checker_log(s + " - проблема со связью, повтор через 10сек", "red");
			console.log(s + " - ошибка запроса VK API: " + textStatus);
			//запускаем заново с задержкой
			window.checker_api_timers.push(setTimeout(checker_get_user_data, 10000, s, user_id, next)); //с задержкой еще 10 сек
		}
	});
		
};

checker_user_data_loaded = function(s, user_id, data, attempt) {

	var next = attempt + 1;
	
	if(!window.checker_started) return;
	
	if(data.error) {
		if(data.error.error_code == "113") {
			checker_log(s + " - не пользователь VK", "orange");
			window.urls_inprocess--;
		} else {
			checker_log(s + " - ошибка ВК, повтор через 10сек", "red");
			console.log(s + " - ошибка запроса VK API: " + data.error.error_code + " " + data.error.error_msg);
			//запускаем заново с задержкой
			window.checker_api_timers.push(setTimeout(checker_get_user_data, 10000, s, user_id)); //с задержкой еще 10 сек			
		};
		return;
	};
	
	if(!data.response) {
		checker_log(s + " - проблема со связью, повтор через 10сек", "red");
		console.log(s + " - пришел кривой ответ от VK API");
		//запускаем заново с задержкой
		window.checker_api_timers.push(setTimeout(checker_get_user_data, 10000, s, user_id)); //с задержкой еще 10 сек			
		return;
	};

	var user_data = data.response[0];
	
	if(user_data.deactivated == "banned") {
		checker_log(s + " - " + user_data.first_name + " " + user_data.last_name + " - забанен", "orange");
		window.urls_inprocess--;
		return;
	};

	if(user_data.deactivated == "deleted") {
		checker_log(s + " - " + user_data.first_name + " " + user_data.last_name + " - удален", "orange");
		window.urls_inprocess--;
		return;
	};
	
	if(user_data.can_write_private_message != 1) {
		checker_log(s + " - " + user_data.first_name + " " + user_data.last_name + " - отключены сообщения", "orange");
		window.urls_inprocess--;
		return;
	};
	
	var last_seen_days;
		
	if(user_data.online) {
		checker_log(s + " - " + user_data.first_name + " " + user_data.last_name + " - Online", "green");
	} else {
		last_seen_days = Math.floor(( vk.ts - user_data.last_seen.time ) / 3600 / 24);
		
		if(last_seen_days > 14) {
			checker_log(s + " - " + user_data.first_name + " " + user_data.last_name + " - заброшен (" + last_seen_days.toString() + " дн.)", "orange");
			window.urls_inprocess--;
			return;
		};
		
		if(last_seen_days == 0) {
			checker_log(s + " - " + user_data.first_name + " " + user_data.last_name + " - был сегодня", "green");			
		} else {
			checker_log(s + " - " + user_data.first_name + " " + user_data.last_name + " - был " + last_seen_days.toString() + " дн. назад", "green");			
		}
	};
		
	window.correct_urls.push(s);
	window.urls_inprocess--;
	
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
	
	if(window.urls_inprocess <= 0) {
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




