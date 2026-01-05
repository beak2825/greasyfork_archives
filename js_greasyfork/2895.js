// ==UserScript==
// @name          MOCO Script
// @author        Dzyatko
// @description   MOCO
// @version       0.109
// @include       *support.rosatom.ru*
// @include		  *smreport.rosatom.ru*
// @include		  *support.rosatom.local*
// @include		  *core-s-ssrs01.gk.rosatom.local*
// @grant		  none
// @require		  https://code.jquery.com/jquery-1.11.1.min.js
// @require		  https://cdn.jsdelivr.net/jquery.cookie/1.4.1/jquery.cookie.js
// @require		  https://cdnjs.cloudflare.com/ajax/libs/qtip2/2.2.0/jquery.qtip.min.js
// @require		  https://code.jquery.com/ui/1.11.0/jquery-ui.min.js
// @namespace 	  https://greasyfork.org/users/3057
// @downloadURL https://update.greasyfork.org/scripts/2895/MOCO%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/2895/MOCO%20Script.meta.js
// ==/UserScript==

// https://greasyfork.org/scripts/2895-moco-script/code/MOCO%20Script.user.js


var user;
var debug = false;
$( document ).ready(function() {
	// VARS =========================================================
	remove_context_menu = true;
	debug = true;
	debug = false;
	save_found = 0;
	
	// УДАЛИТЬ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// Прячем родные элементы управления
	//hide_buttons()
	// -----------------------------------------------------------------------------------------
	
	// Общая форма  =====================================================================================================================================
	//Пользователь МОЦО
	//if ($("#cwc_masthead_username").text()!='') {$.cookie('user', $("#cwc_masthead_username").text())}
	if (typeof loggedInUserName !== "undefined") {$.cookie('user', loggedInUserName);}
	user=$.cookie('user');
	// Обновляем устаревшую сессию
	setTimeout(function() { tpzDrillTable('', '%D0%9E%D0%B1%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C', '820');}, 300000);		
	// Добавляем наши стили
	$('head link:last').after("<link rel='stylesheet' type='text/css' href='https://cdnjs.cloudflare.com/ajax/libs/qtip2/2.2.0/jquery.qtip.min.css'/>");
	$('head link:last').after("<link rel='stylesheet' type='text/css' href='https://code.jquery.com/ui/1.11.0/themes/black-tie/jquery-ui.css'/>");
	$('head link:last').after("<link rel='stylesheet' type='text/css' href='https://web.spbaep.local/admin_dvlp/moco/css/my_moco.css'/>");
	$('head link:last').after("<link rel='shortcut icon' href='https://web.spbaep.local/admin_dvlp//tickets/images/bookmarks.png'>");
	// Кнопки управления
	$.ajax ({
		type: "POST",
		url: "https://web.spbaep.local/admin_dvlp/moco/layout/moco_admin_buttons.php",
		//async: false,
		data: {res: "file",
			   type: "send_form"},
		success: function(msg) {
			$("#cwc_masthead_logout_link").replaceWith(msg);}
	});
	
	// Удаляем контекстное меню #cwc_optionsMenu_detail
	if (remove_context_menu & typeof ContextMenu != "undefined" ) {
		ContextMenu.detach('list/list');
		ContextMenu.detach('TableResults recordlist');
		ContextMenu.detach('detail/detail');
		//ContextMenu.detach(null);
	}

	// Выдвигаем кнопку контекстного меню
	//$("#cwc_tray_detail_options").parent().parent().parent().css("background-color", "#123456");
	
	// Инициализация формы дайджеста 
	digest_initialize();
	// Инициализация формы Инцидента 
	im_initialize();
	// Инициализация формы Приостановки
	pause_initialize();
	// Инициализация распределения работ
	distribution_initialize();
	// Инициализация шаблонов
	template_initialize();
	// Инициализация отчетов
	report_initialize();
});	





// Инициализация формы дайджеста ========================================================================================================================
function digest_initialize() {
	// Определение формы дайджеста
	//alert($("#X5").val());
	//if ( $("[name='instance/number']").val() == undefined  ) { return false; };
	if ( $("#X5").val() != "To Do"  ) { return false; };
	console.log("Определение формы дайджеста");
	
	// Подсчет кол-ва обращений	
	if ( $("#countField").text() == "32+" && $("#X2").text() =="To Do"  ) {
		exec = $("#countField").next().attr("onclick");
		eval( exec ); }
	if ( typeof $("#countField").text() !== "undefined" ) { $("#X2").text( $("#X2").text() + " [" + $("#countField").text() + "]" ); }
    
	// Ищем колонку с ответсвенным
	if ($("th a span:contains(Исполнитель)").attr("id")!=undefined) {$.cookie('res_col',$("th:contains(Исполнитель)").attr("id"))}
	var	im_col = $("th:contains(Код)").attr("id");
	var	res_col = $("th:contains(Исполнитель)").attr("id");
	var	place_col = $("th:contains(Расположение)").attr("id");
	var	status_col = $("th:contains(Статус)").attr("id");
	
	// Кнопочки для удобства
	$("#X7").css("width", "93%");
	$("#X7Button").after("<img id='me' src='https://web.spbaep.local/admin_dvlp/tickets/images/user-worker.png' title='Объекты на меня' style='cursor:pointer; margin-left: 4px;'>");
	$("body").on('click','#me', function(){ch_layout("Объекты на меня");});
	$("#X7Button").after("<img id='my_group' src='https://web.spbaep.local/admin_dvlp/tickets/images/user-workers.png' title='Объекты на мою РГ' style='cursor:pointer; margin-left: 4px;'>");
	$("body").on('click','#my_group', function(){ch_layout("Объекты на мою РГ");});
	

	// Добавить кнопки действия
	//$('#X13 tr:first').prepend("<th class='TableHeading'>Act</th>");
		
	// Дополнительные кнопки для координатора рабочей группы
	//if ('AnLDzyatko'.search(user) != -1 && user!="") {$.cookie('coord', 'true');}
	// Дополнительные кнопки для координатора рабочей группы
	//if ($.cookie('coord')=='true') {
	var res_select = "";
	$.ajax ({
		type: "POST",
		url: "https://web.spbaep.local/admin_dvlp/moco/actions/responsables.php",
		async: false,
		data: {res: "file",
			   type: "send_form"},
		success: function(msg) {
			res_select = msg;
		}
	});			
	
	//ares_color = "";
	all_moco_ims = "";
	$('#X14 tr:not(:first,:last)').each(function(){
		num=this.id.substr(5);

		// Убираем "(атомпроект)" из расположения
        cut_text = $("span:contains(\(атомпроект\))" ,this).text().replace(" (атомпроект)", ""); 
        $("span:contains(\(атомпроект\))" ,this).text(cut_text);

		// Убираем логин из пользователя
		cut_text = $("td[headers='"+res_col+"'] div a div span" ,this).text().replace(/ \(.+\)/, "");
		$("td[headers='"+res_col+"'] div a div span" ,this).text(cut_text);
		//console.log(cut_text);

		
		// Кнопочки выполнить/приостановить
		actions = "&nbsp;<img id='done_"+num+"' name='"+num+"' class='done_button' src='https://web.spbaep.local/admin/tickets/images/tick.png' style='cursor:pointer;' title='Закрыть инцидент'>";
		if ($("td[headers='" + status_col + "'] span.FormatInputReadonly", this).text() != "Приостановлен") {
			actions += "&nbsp;<img id='pause_"+num+"' name='"+num+"' class='pause_button' src='https://web.spbaep.local/admin/tickets/images/control-pause.png' style='cursor:pointer;' title='Приостановить инцидент'>&nbsp;";}
		//$(this).prepend("<td class='TableCellResults' id='myth_"+num+"'>" + actions + "</td>");
		$("td:first", this).html("<td class='TableCellResults' id='myth_"+num+"'>" + actions + "</td>");
        if ( typeof res_select != "undefined" ) { 
            $("td[headers='" + res_col + "'] span", this).after("<span>" + res_select.replace("res_change_it", "res_" + num) + "</span>");}
		moco_res = $("td[headers='" + res_col + "'] span.FormatInputReadonly", this).text();
        if ( typeof moco_res != "undefined" ) { 
            moco_res_short = moco_res.replace(/ \(.+\)/,"");}
		
		// Дайджест "Объекты на мою РГ"
		if ( $("#X7").val() == "Объекты на мою РГ" || $("#X7").val() == "Объекты на меня") {
			// Кнопочки Исполнителей
			if ( typeof moco_res != "undefined" ) {
				$(".responsible_size :contains('"+moco_res_short+"')", this).attr("selected", "selected");
				// Прячем выбранных пользователей
				if ($(".responsible_size :contains('"+moco_res_short+"'):selected", this).text() == moco_res_short) {
					$("td[headers='" + res_col + "'] span.FormatInputReadonly", this).hide();}
                else if ($.trim($("td[headers='" + res_col + "'] span.FormatInputReadonly", this).text())!="") 
                	{$(".responsible_size", this).hide();};
				if ( $("#X7").val() == "Объекты на мою РГ" ) {
					// Подстветка моих инцидентов
					if (moco_res.search(user)>-1) {$(this).attr("class", $(this).attr("class") + " my_im");}
					// Подстветка инцидентов по исполнителям
					else {
						var no = $(".responsible_size", this).prop('selectedIndex');
						$(this).attr("class", $(this).attr("class") + " im_color_" + no); }
				}
                if (moco_res.replace(/\s+/g, "")=="" && ($("#X27").text()=="Исполнитель")) {
                    $(this).attr("class", $(this).attr("class") + " no_res"); }
			}
			// Затенение инцидентов из Соснового Бора
            if ( typeof place_col != "undefined" ) {
                if ( $("td[headers='" + place_col + "'] div a div span", this).html().search("сосновый_бор")>-1 ) {
                    $(".FormatInputReadonly", this).addClass("sos_bor");
                    $("td[headers='" + res_col + "'] div a div span select", this).addClass("sos_bor");
                }
            }
			
			// Подсветка инцидентов Атомэнергопроект
            if ( typeof place_col != "undefined" ) {
                if ( $("td[headers='" + place_col + "'] div a div span", this).html().search("атомэнергопроект")>-1 ) {
                    $(".FormatInputReadonly", this).addClass("aep");
                    $("td[headers='" + res_col + "'] div a div span select", this).addClass("aep");
                }
            }			
		}
	
	// Анализ инцидентов, синхронизация с TSDB
	all_moco_ims += $("td[headers='" + im_col + "'] span.FormatInputReadonly", this).text() + "; ";
	
	});
	// Обработчик нажатий кнопок
	$("body").on('click','.done_button', function(){
		$.cookie('im_close', 'done');
		$.cookie( 'im_no', $("td[headers='" + im_col + "']", $("#rltr_"+this.name)).text().replace(/\s+/g, '') );
		//console.log ( $("td[headers='" + im_col + "']", $("#rltr_"+this.name)).text().replace(/\s+/g, '') ); return;
		tpzDrilldown(this.name);
	});
	$("body").on('click','.pause_button', function(){
		$.cookie('im_close', 'pause');
		$.cookie( 'im_no', $("td[headers='" + im_col + "']", $("#rltr_"+this.name)).text().replace(/\s+/g, '') );
		tpzDrilldown(this.name);
	});
	$('.responsible_size').change(function() {$.cookie('select_responsable', $(":selected", this).val()); tpzDrilldown($(this).attr("name").replace("res_", ""));});

	// Анализ инцидентов, синхронизация с TSDB
	if ( $("#countField").text() < 33  && user == "AnLDzyatko" && $("#X7").val() == "Объекты на мою РГ") {
		$.ajax ({
			type: "POST",
			url: "https://web.spbaep.local/admin_dvlp/moco/actions/close_moco_closed_tickets.php",
			//async: false,
			data: {all_moco_ims: all_moco_ims,
				   type: "send_form"},
			success: function(msg) {
				if ( msg != "") {
					$("body").append("<div id='dead_im_count' style='display: none'>"+msg+"</div>");
					console.log(msg);
					close_dead_ims();}
				} 
		});
	}
	
}







// Инициализация формы Инцидента ========================================================================================================================
function im_initialize() {
	if ( $("[name='instance/number']").val() == undefined  ) { return false; };
	console.log("Определение формы Инцидента");
	//debug = true;
	// VARS =========================================================
	close_im_form = false;
	// Код инцидента:
	im_element = $("[name='instance/number']");
	// Статус:
	status_element = $("#"+$("label:contains('Статус:')").attr('for'));
	if (status_element.val() == "Выполнен") {
		close_im_form = true ; 
		status_element = $("#X31512341232"); }			
	// Контактное лицо:
	contact_element = $("[name='instance/hpc.callback.contact']");
	// Телефоны:
	phone_element = $("[name*='/instance/home.phone']");			//if (close_im_form) { phone_element = $("#X323"); }		
	// Комната:
	room_element = $("[name*='/instance/room']");	 				//	if (close_im_form) { room_element = $("#X325"); }					
	// Пользователь:
	user_element = $("[name='instance/contact.name']");	  			//		if (close_im_form) { user_element = $("#X329"); }					
	// Приоритет:
	priority_element = $("[name='instance/priority.code']");		   		//	if (close_im_form) { priority_element = $("#X348"); }				
	// Исполнитель:
	doer_element = $("[name='instance/hpc.assignee']");	 			//	if (close_im_form) { doer_element = $("#X353Readonly"); } 			
	// Select Исполнитель:
	doer_popup_element = $("#"+$("[name='instance/hpc.assignee']").attr('id')+"Popup");  																			
	// Услуга:
	service_element = $("[name='instance/affected.item']");  			//	if (close_im_form) { service_element = $("#X366"); }				
	// В связанных обращениях вложения.
	attach_element = $("#X6");  																					
	// Время нарушения SLA:
	sla_element = $("[name='instance/next.breach']"); 		//			if (close_im_form) { sla_element = $("#X12"); }						
	// Краткое описание:
	thumbnail_element = $("[name='instance/brief.description']");//			if (close_im_form) { thumbnail_element = $("#X16"); }				
	// Описание:
	text_element = $("[name='instance/action/action']");			//		if (close_im_form) { text_element = $("#X18"); }					
	// Трудозатраты:
	effort_element = $("[name='instance/hpc.time.worked']");//					if (close_im_form) { effort_element = $("#X22"); }					
	// Решение для пользователя:
	solution_for_user_element = $("[name='instance/resolution/resolution']");// 		if (close_im_form) { solution_for_user_element = $("#X25"); }		
	// Код закрытия:
	closing_code_element = $("[name='instance/resolution.code']");// 			if (close_im_form) { closing_code_element = $("#X31"); }			
	// dateTime value="16/04/15 10:04:16"
	reg_date_element = $("[name='instance/open.time']");// 			if (close_im_form) { reg_date_element = $("#278"); }				
	
	// Аналитика 1
	analytics1 = $("[name='instance/ga.analytics.1']");
    // Аналитика Компания
	analytics_comp = $("[name='instance/ga.analytics.company.customer']");
    // Компания
	company = $("[name='instance/hpc.company']");	
	
	// Обновление:
	rejection_text_element =  $("[name='instance/hpc.add.info/hpc.add.info']");//
	// Причина отклонения:
	rejection_reason_element = $("[name='instance/ga.reason.for.rejection']");
	// Название док-та и № пункта, который нарушил сотрудник ЦПП
	document_broked_element = $("[name='instance/pending.reason']");
	
	// Отклонение инцидента
	//alert(rejection_reason_element.val());
	if (rejection_reason_element.val() == "Распределение работ") {
		rejection_reason_element.val("Неверная маршрутизация");
		rejection_text_element.text("Неверная маршрутизация");
		add_template(rejection_text_element, "on_reject", "Шаблоны&nbsp;отклонения&nbsp;инцидентов", "center right", "center left", 0); 
	}
	
	
	if ( typeof im_element.val() == "undefined" ) { return false; }
	//if (im_element.val().search(/IM/i)==-1) {return false;}  alert(im_element.val().search(/IM/i));
	if (user_element.val()=='' && im_element.val().search(/IM/i)==-1 ) {
		setTimeout(function() { im_initialize();}, 1500);
		return false;}
	//console.log("Инициализация формы Инцидента");
	
	// Увеличение выпадающего списка Исполнителей
	doer_popup_element.attr("size", "14");
	
	// Работа с TSDB
	if (im_element.val().search(/IM/i)>-1) {
		sender_info();
		import_from_web_iface();
		add_my_buttons();
		fill_done();
	}
	
	// Закрытие обращения
	if ($.cookie('im_close')=='done' || getParameterByName('ts_action')=='close') { done(); }

	// Пауза обращения
	if ($.cookie('im_close')=='pause' || getParameterByName('ts_action')=='pause') { way_to_pause(); }

	// Выбор ответсвенных
	if ($.cookie('select_responsable')!='null') { 
		select_responsable();
		setTimeout( save_close, 1500 );
	}

	// Кнопка сохранить и закрыть
	if ($.cookie('save_close')!='null') {
		window.location=$.cookie('save_close');
		$.cookie('save_close', null);}
	
	// Закрытие по Ctrl+Enter
	window.onkeydown = function(event) {
      if (event.keyCode==10 ||(event.ctrlKey && event.keyCode==13))
            if ($('#close_tsdb_check').length) {save();} // если есть «записать в TSDB»
            else if ($('#save_close').length ) {save_close();}; // если есть «сохранить и закрыть», то save_close()
  	};  

}



// Инициализация формы Приостановки ========================================================================================================================
function pause_initialize() {
	// VARS =========================================================
	suspension_reason_element = $("#X2"); 																		// Причина приостановки:
	return_time_element = $("#X5"); 																			// Время возврата:
	justification_element = $("#X12"); 																			// Обоснование
		
	if ($('#X1').text() == 'Причина приостановки:') {
		// Применяем шаблоны приостановки
		add_template(justification_element, "on_pause", "Шаблоны&nbsp;приостановки&nbsp;инцидентов", "top left", "bottom left", 0); }
	else if ($.cookie('im_close')=='pause' || getParameterByName('ts_action')=='pause') { 
		way_to_pause(); }
}


// Инициализация формы Распределния работ ========================================================================================================================
function distribution_initialize() {
	// VARS =========================================================
	group_name_element = $("#X3");																				// Имя:
	if ($('#X1').text() == 'Выберите рабочую группу:') {
		add_template(group_name_element, "on_distribution", "Распределние&nbsp;работ", "top left", "bottom left", 0);
	}
}





// Инициализация Шаблонов ========================================================================================================================
function template_initialize() {
	$("body").on('mouseover','.template_element', function(){		
		$(this).addClass('ticket_template_active');
	});
	$("body").on('mouseout','.template_element', function(){		
		$(this).removeClass('ticket_template_active');
	});
	// Применение шаблона 		//control_element = $(this).attr("control_element");
	$("body").on('click','.template_element', function(){ 
		control_element = eval( $(this).attr("control_element") ) ;
		control_element.val( ($(this).text()) ); 
		control_element.qtip().hide({hide: { delay:1000}});
		control_id_div = $( "#" + $(this).attr("control_id_div") );
		if ( control_id_div.html() != undefined ) {
			$(control_id_div).children("div").each( function () {
				//debug = true;
				if (debug) {console.log( $(this).attr("control_id") + " = " + $(this).attr("control_value") );}
				eval( $(this).attr("control_id") ).val( $(this).attr("control_value") );
				// Функция работает плохо если элемент перезагружающий страницу не находится в конце
				control_id = eval( $(this).attr("control_id") );  //alert( control_id.attr("id") );
				handleOnChange( document.getElementById(control_id.attr("id")), $(this).attr("control_value"));
			});  
		}
	});
}	








// Функциии ===============================================================================================================================================
// Изменение фильтра таблицы заявок
function ch_layout(lay) {
	$("#X7").val(lay);	//$("#X7").text(lay);
	handleOnChange(document.getElementById('X7'), lay)
}

// Информация об отправителе
function sender_info() {
	phone_element.css( "color", "#CCCCCC" );
	room_element.css( "color", "#CCCCCC" );
	// Пользователь
	//alert( user_element.val() );
	$.ajax ({
		type: "POST",
		url: "https://web.spbaep.local/admin_dvlp/tickets/actions/search.php",
		//async: false,
		data: {
			moco_sender: user_element.val(),
			type: "send_form"},
		success: function(msg) {	
			//alert( msg );
			user_element.parent().parent().parent().after("<div id='user_info' style='position:absolute; top:264px; left:0%; width:43%; height:19px; z-index:200;'>"+msg+"</div>");
		}
	});
	// Контакное лицо
	$.ajax ({
		type: "POST",
		url: "https://web.spbaep.local/admin_dvlp/tickets/actions/search.php",
		data: {
			moco_sender: contact_element.val(),
			type: "send_form"},
		success: function(msg) {	
			contact_element.qtip({
				style: {
					classes: 'qtip-dark  tipStyle',
					tip: {
						offset: 0
					}			
				},
				content: {
					text: msg},
				position: {
					my: 'bottom left',
					at: 'top right'
				}				
			});	
			//contact_element.qtip().show();
		}
	});
	
	
}

function import_from_web_iface() {
	//return;
	//alert( user + " - " + $.cookie('select_responsable') + " - " + $("#X352").val() + " - " + im_element.val());
	// Добавляем инцидент в TSDB
	$.ajax ({
		type: "POST",
		url: "https://web.spbaep.local/admin_dvlp/moco/actions/import_from_web_iface.php",
		//async: false,
		data: {
			moco_user: $.cookie('user'),
			moco_id: im_element.val(),
			status: status_element.val(),
			contact: contact_element.val(),
			user: user_element.val(),
			priority: priority_element.val(),
			doer: doer_element.val(),
			sla: sla_element.val(),
			thumbnail: thumbnail_element.val(),
			text: text_element.val(),
			solution_for_user: solution_for_user_element.val(),
			reg_date: reg_date_element.val(),
			debug: debug,
			//async: false,
			type: "send_form"},
		success: function(msg) {
			//debug = true;
			if (debug) { console.log(msg); }
			if (msg=="") {alert("Проверьте добавлены ли сайты web.spbaep.local sn59-1.spbaep.ru в доверенную зону.");}
			$("#popHelp").before("<fieldset id='tsdb_div' style='position:absolute; top:880px; left:0%; width: 98%;' onclick='show_hide_tsdb();'><legend class='pointer' id='tsdb_legend'>TSDB</legend></fieldset>");
			if (debug) {$("#tsdb_div").append("<pre>"+msg+"</pre>");}
			$("#tsdb_div").append("<iframe style='width: 100%; height: 1200px; border: 1px; display: block;'  src='https://web.spbaep.local/admin_dvlp/tickets/edit_ticket.php?moco_id="+im_element.val()+"&moco_sender="+user_element.val().replace(/ \(.+/g, "")+"&moco_user=" + $.cookie('user') + "' id='tsdb_iframe'></iframe>");
			$("body").on("click","#tsdb_legend", function(){show_hide_tsdb()});
			$('body,html').animate({scrollTop: 0}, 1000); 
			//$("#X2").focus();			
			//$("#tsdb_iframe").show();
		}
	});	
}


// Форма Системы учета заявок
function show_hide_tsdb() {
	var ob=document.getElementById('tsdb_iframe');
	if( ob.style.display=='none') { ob.style.display='block'; }
    else  { ob.style.display='none'; }
}


// Блок Моих элементов управления
function add_my_buttons() {
	// Добавляем блок с нашими кнопками и дебаг div
	button_div = "<div id='my_buttons' style='position:absolute; top:650px; left:0%; width: 100%;'></div>";
	$("#popHelp").after(button_div);
	// Добавляем конопочку "Сохранить и закрыть"
	button = "<div id='save_close_div' class='toolbarButton' style='margin: 2px 4px 2px 0px; float:left;'><a class='toolbarButton' href='#' title='Сохранить и закрыть запись инцидента.' tabindex='11' id='save_close' name='Save_close'><img src='images/obj16/tdefault.gif'/>Сохранить и закрыть</a></div>";
	$("#my_buttons").append(button);
	$("body").on("click","a[name='Save_close']", function(){save_close()});

	// Добавляем конопочку "Сохранить"
	button = "<div class='toolbarButton' style='margin: 2px 4px 2px 0px; float:left;'><a class='toolbarButton' href='#' title='Сохранить запись инцидента.' tabindex='11' id='my_save' name='my_save'><img src='images/obj16/tdefault.gif'/>Сохранить</a></div>";
	$("#my_buttons").append(button);
	
	// Добавляем конопочку "Тест"
	make_test = false;
	if (make_test) {
		test_button = "<div class='toolbarButton' style='margin: 2px 4px 2px 0px; float:left;'><a class='toolbarButton' href='#' title='Тестировать сохранение записи инцидента.' tabindex='11' id='my_test' name='my_test'><img src='images/obj16/tdefault.gif'/>Тест</a></div>";
		$("#my_buttons").append(test_button);
		$("body").on("click","a[name='my_test']", function(){save("make_test")});
	}
	$("body").on("click","a[name='my_save']", function(){save()});
}


function hide_buttons() {
	//return; 
	console.log(save_found + ":удаляем кнопку сохранить")
	// Отладить - НЕ РАБОТАЕТ
	//user_element = $("#X332"); //if (close_im_form) { user_element = $("#X315"); }								// Пользователь:
	//if (user_element.val()=='' && im_element.val().search(/IM/i)==-1 ) {
	var save_timerId = setTimeout(function() { hide_buttons();}, 1500);
//		return false;}
	obj = $("a[title='Сохранить запись инцидента.  Ctrl+F4']").parent();
	if (save_found > 5) {clearTimeout(save_timerId);}
	save_found = save_found + 1;
	if ( typeof obj.html() != "undefined" ) {
		
		console.log(save_found + ":" + obj.html() + ' - removed : ');
		obj.remove();
	}
}


function save_close() {
	$.cookie('save_close', $("a[title='Закрыть']").attr("href"));
	top.detail.tpzExecute('4',null,'detail');void(0);}


function save(test) {	// Закрываем заявку в TSDB
	make_test="";
	if (test=="make_test") {make_test=true;}
	if ($("#close_tsdb_check").is(':checked')) {
		$.ajax ({
			type: "POST",
			url: "https://web.spbaep.local/admin_dvlp/moco/actions/close_tsdb_ticket.php",
			async: false,
			data: {
				moco_id: im_element.val(),
				solution_for_user: solution_for_user_element.val(),
				make_test: make_test,
				async: false,
				type: "send_form"},
			success: function(msg) {
				if (test=="make_test") {console.log(msg); alert (msg + "\nSEE JAVASCRIPT CONSOLE."); }
				else {
					if (msg.search('sucess')>-1) {
						top.detail.tpzExecute('4',null,'detail');void(0);
					}
					else {alert ("Ошибка закрытия заявки TSDB: \n" + msg);}
				}
			}
		});		
	}
	else {
		top.detail.tpzExecute('4',null,'detail');void(0);
	}
}

function done() { 	// Меняем форму закрытия инцидента
	//log("IM TO CLOSE: " + $.cookie('im_no') + " - " + $("a[title='В работу  Alt+F6']").attr("title").search("В работу  Alt+F6")); //return;
	if ( $.cookie('im_no') != im_element.val() ) {
		$.cookie('im_no', null);
		$.cookie('im_close', null);
		return;}
	if ( $("a[title='В работу  Alt+F6']").attr("title") == "В работу  Alt+F6") { 
		//alert("32");
		top.detail.tpzExecute('6',null,'detail');void(0); 
		//return; 
	}
	else if ( $("[title='Выполнить  Alt+F6']").attr("title") == "Выполнить  Alt+F6" ) { 
		
		top.detail.tpzExecute('6',null,'detail');void(0);
		$.cookie('im_close', null);
		return; }
}


function way_to_pause() { 	// Меняем форму приостановки инцидента
	if ( $.cookie('im_no') != im_element.val() ) {
		$.cookie('im_no', null);
		$.cookie('im_close', null);
		return;}
	if ( $("[title='В работу  Alt+F6']").attr("title") == "В работу  Alt+F6") { 
		//alert("123");
		top.detail.tpzExecute('6',null,'detail');void(0); 
		return; }
	else if ( $("[title='Приостановить']").attr("title") == "Приостановить" ) { 
		$.cookie('im_close', null);
		top.detail.tpzExecute('20',null,'detail');void(0);
		return; }
}

function add_template(element, action, text, position_my, position_at, offset) {
	element.attr("title", 'https://web.spbaep.local/admin_dvlp/moco/layout/moco_templates.php');
	element.qtip({
		prerender: true,
		style: {
			classes: 'qtip-dark tipStyle',
			tip: {
				offset: offset
			}			
		},
		content: {
			text: 'загрузка',
			ajax: { url: 'https://web.spbaep.local/admin_dvlp/moco/layout/moco_templates.php?action=' + action }, 
			title: {
				text: text
			}
		},
		show: {	
			event: 'mouseenter',
			delay: 100 },
		hide: { delay:500, fixed:true},
		position: {
			my: position_my,
			at: position_at,
			effect: false,
		}
	});	
}

function fill_done() {
	add_template(solution_for_user_element, "on_close", "Шаблоны&nbsp;закрытия&nbsp;инцидентов", "right center", "center left", 150)
	// Переназначение услуги
	add_template(service_element, "on_service", "Шаблоны&nbsp;изменения&nbsp;услуги", "top left", "bottom left", 0);

	if (close_im_form) {

		$("#save_close_div").hide();
		// Изменение функции закрытия инцидента
		close_tsdb_button="<label for='close_tsdb_check'>Закрыть в TSDB</label><input type='checkbox' id='close_tsdb_check' checked='checked'>";
		$("#my_buttons").append(close_tsdb_button);

		// Применяем шаблоны закрытия
		if (effort_element.val() == "") {effort_element.val('1 час');}
		if (solution_for_user_element.val() == "") {solution_for_user_element.val('Работы по обращению проведены, проблема устранена.');}
		if (closing_code_element.val() == "") {closing_code_element.val('решено');}
		if (analytics_comp.val() == "" && service_element.val() == "CLB.6") {analytics_comp.val(company.val());}
		if (analytics1.val() == "" && service_element.val() == "CLB.6") {analytics1.val('Портал и сайт ГК');}
	}	
}


function select_responsable() {	// Выбор ответсвенных
	doer_element.val($.cookie('select_responsable'));
	$.cookie('select_responsable', null);
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


// Анализ инцидентов, синхронизация с TSDB
function close_dead_ims() {
	//alert( $("#dead_im_count").val() );
	$("#dead_im_count").after("<div id='dead_im_remove_dialog' style='display: none' title='Внимание'><p><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span><span id='dialog-confirm-text'>Обнаружено: "+$("#dead_im_count").html()+" инцидент(ов) импортированых из МОЦО и не закрытых в TSDB</span></p></div>");
		
	$( "#dead_im_remove_dialog" ).dialog({
		autoOpen: false,
		height: 200,
		width: 400,
        resizable: false,
		buttons: {
			"Удалить": function() {
				close_dead_ims_true();
			},
			"Отменить": function() {
				$( this ).dialog( "close" );
			}
		}
	});	
	$("#dead_im_remove_dialog").dialog("open");
}
function close_dead_ims_true() {
	$.ajax ({
		type: "POST",
		url: "https://web.spbaep.local/admin_dvlp/moco/actions/close_moco_closed_tickets.php",
		data: {all_moco_ims: all_moco_ims,
			   moco_user: $.cookie('user'),
			   clear_dead: true,
			   type: "send_form"},
		success: function(msg) {
			console.log(msg);
			$("#dead_im_remove_dialog").dialog( "close" );
		} 
	});
}





























// Раздел Оптимизации отчетов


function report_initialize() {
	control="IM"; // IM/SD - Контроль по инциденту/обращению
	console.log(document.title);
	// 10.07. Доска управления функционального направления
	if ( document.title.indexOf("DashboardFunctionalDerection") > -1  ) { 
		console.log("Автоматизация отчета '10.07. Доска управления функционального направления'");
		$("#ReportViewerControl_ctl04_ctl03_ddValue").val('6');
		setTimeout(function(){    window.location.reload(1); }, 300000);	
		setTimeout('__doPostBack(\'ReportViewerControl$ctl04$ctl03$ddValue\',\'\')', 0);
		setTimeout(function(){  
			$('#ReportViewerControl_ctl04_ctl07_ddDropDownButton').trigger('click');
			$('#ReportViewerControl_ctl04_ctl07_divDropDown_ctl00').trigger('click');
			$('#ReportViewerControl_ctl04_ctl07_divDropDown_ctl00').trigger('click');
			//alert( $("label:contains(атомпроект):contains(2)").prev("input").attr("id"));
			$("label:contains(атомпроект):contains(2)").prev("input").trigger('click');
			$('#ReportViewerControl_ctl04_ctl07_ddDropDownButton').trigger('click');
		}, 1000);
		setTimeout(function(){  
			$('#ReportViewerControl_ctl04_ctl09_ddDropDownButton').trigger('click');
			if ( $("#ReportViewerControl_ctl04_ctl09_divDropDown_ctl00").attr('checked') != "checked" ) {
				$("#ReportViewerControl_ctl04_ctl09_divDropDown_ctl00").trigger('click');
			};
			$('#ReportViewerControl_ctl04_ctl09_ddDropDownButton').trigger('click');
			$('#ReportViewerControl_ctl04_ctl00').trigger('click');
		}, 3000);
	}

	
	// 10.03. Доска управления рабочей группой
	if ( document.title.indexOf("DashboardCoordinatorWorkGroup") > -1  ) { 
		setTimeout(function(){    window.location.reload(1); }, 300000);	
	}
	
	
	// 1.11. Динамика трудоемкости по подразделению (месяц)
	else if ( document.title.indexOf("NEW_NU_Density_day") > -1 ) { 
		console.log("Автоматизация отчета '1.11. Динамика трудоемкости по подразделению (месяц)'");
		if  ( control == "IM" ) {
			$('#ReportViewerControl_ctl04_ctl19_ddValue').val('2');
			setTimeout('__doPostBack(\'ReportViewerControl$ctl04$ctl19$ddValue\',\'\')', 0)
		}
		setTimeout(function(){  
			$('#ReportViewerControl_ctl04_ctl03_ddDropDownButton').trigger('click');
			$("label:contains(санкт_петербург)").prev("input").trigger('click');
			$('#ReportViewerControl_ctl04_ctl03_ddDropDownButton').trigger('click');
			setTimeout(function(){  
				$('#ReportViewerControl_ctl04_ctl13_ddDropDownButton').trigger('click');
				$("label:contains((СПбАЭП))").prev("input").trigger('click');
				$('#ReportViewerControl_ctl04_ctl13_ddDropDownButton').trigger('click');
				setTimeout(function(){  
					$('#ReportViewerControl_ctl04_ctl00').trigger('click');
				}, 1000);				
			}, 1000);
		}, 1000);


	}
	
	// 1.10. Динамика трудоемкости по подразделению (год)
	else if ( document.title.indexOf("NEW_NU_Density") > -1 ) { 
		console.log("Автоматизация отчета '1.10. Динамика трудоемкости по подразделению (год)'");
		$('#ReportViewerControl_ctl04_ctl07_ddDropDownButton').trigger('click');
		//alert ('12');
		$("label:contains(санкт_петербург)").prev("input").trigger('click');
		$('#ReportViewerControl_ctl04_ctl07_ddDropDownButton').trigger('click');
		if  ( control == "IM" ) {
			$('#ReportViewerControl_ctl04_ctl23_ddValue').val('2');
			setTimeout('__doPostBack(\'ReportViewerControl$ctl04$ctl23$ddValue\',\'\')', 0)
		}
		$('#ReportViewerControl_ctl04_ctl03_ddDropDownButton').trigger('click');
		$("label:contains(санкт_петербург)").prev("input").trigger('click');
		$('#ReportViewerControl_ctl04_ctl03_ddDropDownButton').trigger('click');
		setTimeout(function(){  
			$('#ReportViewerControl_ctl04_ctl17_ddDropDownButton').trigger('click');
			$("label:contains((СПбАЭП))").prev("input").trigger('click');
			$('#ReportViewerControl_ctl04_ctl17_ddDropDownButton').trigger('click');
			setTimeout(function(){  
				$('#ReportViewerControl_ctl04_ctl00').trigger('click');
			}, 2000);				
		}, 1000);
	}	

		
	// 1.07. Отчет по качеству
	else if ( document.title.indexOf("NU_judgment") > -1 ) { 
		console.log("Автоматизация отчета '1.07. Отчет по качеству'");
		setTimeout(function(){  
			$('#ReportViewerControl_ctl04_ctl07_ddDropDownButton').trigger('click');
			$("label:contains(санкт_петербург)").prev("input").trigger('click');
			$('#ReportViewerControl_ctl04_ctl07_ddDropDownButton').trigger('click');
		}, 1000);
		setTimeout(function(){  
			$('#ReportViewerControl_ctl04_ctl00').trigger('click');
		}, 3000);
	}	
	
	// Отчет по приостановкам
	else if ( document.title.indexOf("KPI_RWP_ByDept") > -1 ) {
		console.log("Автоматизация отчета 'KPI_RWP - Report Viewer'");
		$('#ctl32_ctl04_ctl07_ddDropDownButton').trigger('click');
		$("label:contains(санкт_петербург)").prev("input").trigger('click');
		$('#ctl32_ctl04_ctl07_ddDropDownButton').trigger('click');
			
		setTimeout(function(){  
			$('#ctl32_ctl04_ctl11_ddDropDownButton').trigger('click');
			$("label:contains((СПбАЭП))").prev("input").trigger('click');
			$('#ctl32_ctl04_ctl11_ddDropDownButton').trigger('click');
			setTimeout(function(){  
				$('#ctl32_ctl04_ctl00').trigger('click');
			}, 4000);				
		}, 1000);			
	}	
	
	
	else { return false; };
}



















