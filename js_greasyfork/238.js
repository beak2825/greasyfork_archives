// ==UserScript==
// @id             4pda.ru-QMS-RTC@scriptish
// @name           4pdaQmsRtc
// @version        1.2
// @namespace      https://greasyfork.org/users/23
// @author         kilowatt36@4pda.ru
// @description    Добавляет возможность передачи файлов напрямую между пользователями на сайте 4pda.ru
// @require        https://cdn.firebase.com/js/client/1.0.6/firebase.js
// @require        https://greasyfork.org/scripts/348/code.user.js
// @include        http://4pda.ru/forum/index.php?act=qms*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/238/4pdaQmsRtc.user.js
// @updateURL https://update.greasyfork.org/scripts/238/4pdaQmsRtc.meta.js
// ==/UserScript==

var $ = unsafeWindow.$;			// нужен jQuery именно из библиотеки QMS, потому что потребуется управлять событиями, связанными с ajax
window.Firebase = Firebase; // в библиотеке RTCMultiConnection автор обращается не к Firebase, а к window.Firebase. Так что вот так.
var connection;
var iwanttosendfile = false;
var sessions = { };
var progressHelper = { };

function printToChat(title, text) {// добавление ложного "нового сообщения" в чат
	var new_row = $(
		'<div data-toggle="checkbox" class="list-group-item">'+
		'<label class="check-item">'+
			'<input type="checkbox" data-toggle="class" data-event="change" data-event-init="1">'+
			'<span class="checkbox">'+
				'<i class="icon-uncheck"></i>'+
				'<i class="icon-check"></i>'+
			'</span>'+
		'</label>'+
		'<div class="time"><b class="read-status read big-dot"></b> '+(new Date())+' </div> <div class="avatar-wrap"><img alt="" class="avatar" data-scroll-init-load="1"></div> '+
			'<strong><span style="color:#FF9900">'+title+'</span></strong><br>'+
			'<div class="msg-content emoticons">'+
				(typeof text === 'string' ? text : '')+
			'</div>'+
		'</div>'
	);
	if (typeof text !== 'string') new_row.find('.msg-content').append(text);			
	
	$('#scroll-thread .scrollframe-body .list-group-item').last().after(new_row);
		
	var pieces = $('#scroll-thread .scrollframe-body').css('transform').split(' ');	// нужно
	pieces[5]=(pieces[5].split(')')[0] - 50)+')';									// для
	$('#scroll-thread .scrollframe-body').css('transform',pieces.join(' '));		// прокрутки
}


function HangHandlers_dialog() {						// Создать UI и повесить все необходимые обработчики на экране диалога
	var inputFile = $('<input id="4pdaQmsRTC" type=file />');
	var button = $('<button id="4pdaQmsRTCbutton">Отправить</button>');
	$('#btn-bb-codes').before('Отправить файл: ').before(inputFile).before(button);
	button.click(function() { // Нажатие на кнопку "отправить"						
		if (Object.getOwnPropertyNames(connection.peers).length === 1) { // Если еще ни одной сессии не было создано, создание сессии, после которой автоматом пойдет отправка файла
			var sessionName = '4pdaSession';
			connection.extra = {
				'session-name': sessionName || 'Anonymous'
			};
			connection.sessionid = sessionName || 'Anonymous';
			connection.maxParticipantsAllowed = 1;
			printToChat('Отправка файла', 'Ожидание соединения с собеседником...');
			connection.open(connection.channel);			
			iwanttosendfile = true;
		} else {// если сессия уже есть, просто отправить
			connection.send($('#4pdaQmsRTC')[0].files[0]);
		}
	});
	$('.icon-back-up').click(HangHandlers_topicchoise); // При щелчке на возврат надо опять расставлять обработчики
} 

function HangHandlers_topicchoise() {					// Повесить все необходимые обработчики на экране выбора темы
	$(document).ajaxComplete(function() {				// Чтобы повесить событие на НОВЫЙ список тем, который загрузится через ajax
		$('#threads-form .list-group-item.text-overflow').each(function(){
			$(this).click(function() {					// щелчок по теме
				$(document).ajaxComplete(function() {	// После загрузки окна диалога
					HangHandlers_dialog();
					$(document).off('ajaxComplete');
				});
			});
		});
		$(document).off('ajaxComplete');				// чтобы функция выше больше не срабатывала при каждом ajax запросе
	});
}

function createConnection(peer) {						// создание нового connection в соответствии с id собеседника

	connection = new RTCMultiConnection([peer, $('.i-code').attr('href').split('=')[1]].sort().join('_'));
	connection.session = {
		data: true
	};
	
	connection.autoSaveToDisk = false;
	sessions = { };
	progressHelper = { };
	iwanttosendfile = false;
	
	connection.onNewSession = function(session) {
		if (sessions[session.sessionid]) return;
		sessions[session.sessionid] = session;		
		console.log('new session: '+session.extra['session-name']);
		connection.join(session);			// при каждом создании сессии присоединяемся к ней, не спрашивая разрешения (это же удобно!)
	};

	connection.onmessage = function(e) {
		console.debug(e.userid, 'posted', e.data);
		console.log('latency:', e.latency, 'ms');
	};

	connection.onclose = function(e) {
		console.log('Data connection is closed between you and ' + e.userid);
	};

	connection.onleave = function(e) {
		console.log(e.userid + ' left the session.');
	};

	// когда собеседник подтверждает наш запрос на присоединение к сесси (а это делается автоматически)
	connection.onopen = function() {
		if (iwanttosendfile) {
			connection.send($('#4pdaQmsRTC')[0].files[0]);
			$('#4pdaQmsRTC').val('');
		}
		iwanttosendfile = false;
		//console.log('connection.onopen');
	};
	
	function updateLabel(progress, label) {
		if (progress.position == -1) return;
		var position = +progress.position.toFixed(2).split('.')[1] || 100;
		label.innerHTML = position + '%';
	}
	connection.onFileProgress = function(chunk) {
		var helper = progressHelper[chunk.uuid];
		helper.progress.value = chunk.currentPosition || chunk.maxChunks || helper.progress.max;
		updateLabel(helper.progress, helper.label);
	};
	
	connection.onFileStart = function(file) {
		var div = document.createElement('div');
		div.title = file.name;
		div.innerHTML = '<label id="RTCLabel">0%</label> <progress></progress>';
		printToChat('Передача файла',div);
		progressHelper[file.uuid] = {
			div: div,
			progress: div.querySelector('progress'),
			label: div.querySelector('#RTCLabel')
		};
		progressHelper[file.uuid].progress.max = file.maxChunks;
	};

	connection.onFileEnd = function(file) {
		progressHelper[file.uuid].div.innerHTML = '<a href="' + file.url + '" target="_blank" download="' + file.name + '">' + file.name + '</a>';
	};



	connection.connect(connection.channel); 
}


///////////////////////////////		MAIN	////////////////////////////////////////////

/* у firebase такая замечательна клиентская библиотека.
   Создает в документе скрытый iframe и грузит туда скрипт, вызывающий parent.window["somefunc"]
   Просто офигеть. Так что надо сделать перенаправлялочку для этих функций. (требуется только для работоспособности в юзерскрипте)
*/
function inject_FbFunctions(funcnum) {	
	if (typeof(window["pLPCommand"+funcnum]) == 'function' && typeof(window["pRTLPCB"+funcnum]) == 'function') {
		unsafeWindow.window["pLPCommand"+funcnum] = window["pLPCommand"+funcnum];
		unsafeWindow.window["pRTLPCB"+funcnum] = window["pRTLPCB"+funcnum];
		//console.log(funcnum+" ready");
	}
	else
		setTimeout(function(){inject_FbFunctions(funcnum);},50);
}

for (var i=1; i<8; i++) { inject_FbFunctions(i); }

// Если пользователь зашел сразу на страницу диалога или выбора темы, то сразу создаем соединение.	
if (location.href.indexOf("&mid=") != -1) {
	createConnection(location.href.split("&mid=")[1].split("&")[0]);
	if (location.href.indexOf("&t=") != -1) {
		HangHandlers_dialog();
	} else {
		HangHandlers_topicchoise();
	}
} else {
	createConnection('4pda-temp');
}

// При щелчке на пользователя слева пусть создается соединение с этим пользователем.
$('#contacts .list-group-item.text-overflow').each(function(){
	$(this).click(function() { // Щелчок по имени пользователя
		var peer = $(this).attr('data-member-id');
		createConnection(peer);
		if (peer > 0) { HangHandlers_topicchoise(); }
	});
});