// ==UserScript==
// @name             Diep.io Чат
// @name:en          Diep.io Chat
// @version          1.0
// @author           ๖ۣۣۜMist
// @description:ru   Общение
// @description:en   Общение
// @match            https://diep.io/
// @icon             https://www.google.com/s2/favicons?domain=diep.io
// @namespace        https://greasyfork.org/en/users/396113-mist161
// @description      Внутриигровое общение в популярной браузерной игре Diep.io.
// @require          http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @require          http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.1/jquery-ui.min.js
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/439528/Diepio%20%D0%A7%D0%B0%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/439528/Diepio%20%D0%A7%D0%B0%D1%82.meta.js
// ==/UserScript==

(function(){

const menu = `
<div id="menu">


<div id="header">
    <div name="menu_all" data-en="Rules" data-ru="Правила" id="rules" onclick="$('#rules-menu').show();">Правила</div>

    <div id="complain" onclick="document.querySelector('#settings-menu').style.display = 'flex';">
        <a name="menu_all" data-en="Settings" data-ru="Настройки">Настройки</a>
    </div>

    <div name="menu_all" data-en="Online: 0" data-ru="Онлайн: 0" id="online">Онлайн: 0
    </div>
</div>

<div id="chat">

</div>

<div id="footer">
    <input name="chat" data-en="Enter your message" data-ru="Введите сообщение" id="message_input" type="text" placeholder="Введите сообщение">
    <button name="menu_all" data-en="send" data-ru="Отправить" id="message_send">Отправить</button>
</div>

</div>


<div id="settings-menu">
<div id="closed-rules" onclick="$('#settings-menu').hide();">X</div>
<h2 name="menu_all" data-en="Settings" data-ru="Настройки">Настройки</h2>

<div id="websocket-menu">
    <p name="menu_all" data-en="WebSocket" data-ru="ВебСокет">WebSocket:</p>
    <label>
        <a name="menu_all" data-en="close connection" data-ru="Закрыть соединение" class="settings-websocket" onclick="truе.close(); alert('Подключение было закрыто')">Закрыть соединение</a>
    </label>
    <label>
        <a name="menu_all" data-en="Reconnect" data-ru="Переподключиться" class="settings-websocket" onclick="reconnect();">Переподключиться</a>
    </label>
</div>

<div id="chat-menu" style="display: contents;">
    <p name="menu_all" data-en="Chat" data-ru="Чат">Чат:</p>
    <label>
        <input id="chat_size" onkeypress='return event.charCode >= 48 && event.charCode <= 57' name="menu_checkbox" data-en="Change font size" data-ru="Изменить размер шрифта" class="font-size" maxlength="2" value="16">Изменить размер шрифта</input>
    </label>
    <label>
        <input name="menu_checkbox" data-en="Show message times" data-ru="Показывать время сообщений" class="custom-checkbox" type="checkbox">Показывать время сообщений</input>
    </label>
<label>
    <input name="menu_checkbox" data-en="Show chat inputs" data-ru="Показывать входы в чат" class="custom-checkbox" type="checkbox">Показывать входы в чат</input>
</label>
<label>
    <input name="menu_checkbox" data-en="New message notifications" data-ru="Уведомления о новых сообщениях" class="custom-checkbox" type="checkbox">Уведомления о новых сообщениях</input>
</label>

<label>
<p name="menu_language" data-en="Language: " data-ru="Язык: ">Язык:
    <select value="data-ru" size="1">
        <option value="data-en">English</option>
        <option value="data-ru" selected>Russia</option>
    </select>
</p>
</label>
<label>
<input name="menu_checkbox" data-en="Dynamic Chat" data-ru="Динамический чат" class="custom-checkbox" type="checkbox">Динамический чат</input>
<p>
    <span name="menu_language" data-en="Delay in milliseconds (Show/Hide)" data-ru="Задержка в миллисекундах(Показать/Скрыть)">Задержка в миллисекундах(Показать/Скрыть)</span>
    <select size="1">
        <option value="500">500</option>
        <option value="1000">1000</option>
        <option value="1500">1500</option>
        <option value="2000">2000</option>
    </select>
    <select size="1">
        <option value="500">500</option>
        <option value="1000">1000</option>
        <option value="1500">1500</option>
        <option value="2000">2000</option>
        <option value="2500">2500</option>
        <option value="3000">3000</option>
    </select>
</p>
</label>
</div>

<p name="menu_all" data-en="Control" data-ru="Управление">Управление:</p>
<div id="control-menu">
<label>
    <input id="chat_menu" name="menu_checkbox" data-en="Hide/Open chat menu" data-ru="Скрыть/Открыть меню чата" class="font-size" maxlength="1">Скрыть/Открыть меню чата</input>
</label>
<label>
    <input id="chat_window" name="menu_checkbox" data-en="Hide/Open the chat window" data-ru="Скрыть/Открыть окно чата" class="font-size" maxlength="1">Скрыть/Открыть окно чата</input>
</label>
<button name="menu_all"data-en="Apply" data-ru="Применить" id="save-settings" onclick="ArrаyBuffer()">Применить</button>
</div>
</div>


</div>

<div id="rules-menu">
<div id="closed-rules" onclick="$('#rules-menu').hide();">X</div>
    <h2 name="menu_all" data-en="Chat rules" data-ru="Правила чата">Правила чата</h2>
    <ul>
        <li> <b name="menu_all" data-en="Using a personal nickname (Forbidden):" data-ru="Использование личного никнейма (Запрещено):">Использование личного никнейма (Запрещено):</b>
            <ul>
                <li name="menu_all" data-en="It is forbidden to use obscene, offensive, provocative, advertising words and phrases" data-ru="Запрещено использование нецензурных, оскорбительных, провокационных, рекламных слов и фраз">Запрещено использование нецензурных, оскорбительных, провокационных, рекламных слов и фраз</li>
                <li name="menu_all" data-en="The use of words or phrases with multiple interpretations is prohibited. Administration/Moderation has the right to block the use of these nicknames." data-ru="Запрещено использование слов или фраз со множественной трактовкой. Администрация/Модерация вправе заблокировать использование данных никнеймов.">Запрещено использование слов или фраз со множественной трактовкой. Администрация/Модерация вправе заблокировать использование данных никнеймов.</li>
            </ul>
        </li>
        <li> <b name="menu_all" data-en="Communication (Forbidden):" data-ru="Общение (Запрещено):">Общение (Запрещено):</b>
            <ul>
                <li name="menu_all" data-en="Spam, mailings and announcements not related to the game." data-ru="Спам, рассылки и объявления, не связанные с игрой.">Спам, рассылки и объявления, не связанные с игрой.</li>
                <li name="menu_all" data-en="Flood, repeated repetition of messages, copying and reproduction of messages that do not contain a semantic load." data-ru="Флуд, многократные повторение сообщений, копирование и воспроизведение сообщений не содержащих смысловой нагрузки.">Флуд, многократные повторение сообщений, копирование и воспроизведение сообщений не содержащих смысловой нагрузки.</li>
                <li name="menu_all" data-en="Use of profanity" data-ru="Использование ненормативной лексики">Использование ненормативной лексики</li>
                <li name="menu_all" data-en="Insults towards the players" data-ru="Оскорбления в сторону игроков">Оскорбления в сторону игроков</li>
                <li name="menu_all" data-en="Advertising links to third-party resources, ads" data-ru="Рекламные ссылки на сторонние ресурсы, объявления">Рекламные ссылки на сторонние ресурсы, объявления</li>
                <li name="menu_all" data-en="Threats of violence or physical harm" data-ru="Угрозы насилия или физической расправы">Угрозы насилия или физической расправы</li>
                <li name="menu_all" data-en="Promotion of intolerance towards racial, national, religious, cultural, ideological, gender, language or political affiliation" data-ru="Пропаганда нетерпимости к расовой, национальной, религиозной, культурной, идеологической, половой, языковой или политической принадлежности">Пропаганда нетерпимости к расовой, национальной, религиозной, культурной, идеологической, половой, языковой или политической принадлежности</li>
            </ul>
        </li>
        <li> <b name="menu_all" data-en="System (Forbidden):" data-ru="Система (Запрещено):">Система (Запрещено):</b>
            <ul>
                <li name="menu_all" data-en="Script decompilation disabled" data-ru="Запрещена декомпиляция скрипта">Запрещена декомпиляция скрипта</li>
                <li name="menu_all" data-en="Analysis of data coming from the server and embedded in the script code" data-ru="Анализ данных, поступающих от сервера и заложенных в коде скрипта">Анализ данных, поступающих от сервера и заложенных в коде скрипта</li>
                <li name="menu_all" data-en="Security Bypass" data-ru="Обход систем безопасности">Обход систем безопасности</li>
                <li name="menu_all" data-en="Hacking (attempt) script components" data-ru="Взлом(попытка) компонентов скрипта">Взлом(попытка) компонентов скрипта</li>
                <li name="menu_all" data-en="Using software bugs" data-ru="Использование программных ошибок">Использование программных ошибок</li>
                <li name="menu_all" data-en="Creation / Use of programs for entering text into a chat, editing it, sending" data-ru="Создание/Использование программ для ввода текста в чат, его редактирования, отправки">Создание/Использование программ для ввода текста в чат, его редактирования, отправки</li>
            </ul>
        </li>
        <li name="menu_all" data-en="By launching and using this chat you agree to the rules described above." data-ru="Запуская и используя данный чат вы соглашаетесь на правила, описанные выше.">Запуская и используя данный чат вы соглашаетесь на правила, описанные выше.
        </li>
        <li name="menu_all" data-en="For violation of any rule, the user will be punished with a ban or mute, depending on the degree of guilt" data-ru="За нарушение любого правила пользователь будет наказан баном или мутом, в зависимости от степени вины">За нарушение любого правила пользователь будет наказан баном или мутом, в зависимости от степени вины</li>
        <li name="menu_all" data-en="Date the rule was written: 28/01/2022 / Date the rules were changed: -/-/-" data-ru="Дата написания правила: 28/01/2022 / Дата внесения изменений в правила: -/-/-">Дата написания правила: 28/01/2022 / Дата внесения изменений в правила: -/-/-</li>
    </ul>
</div>

<style>
#menu {
position: absolute;
border: 2px solid darkkhaki;
width: 350px;
height: auto;
border-radius: 12px;
padding: 7px;
resize: both;
overflow: hidden;
}
#header {
    display: flex;
    position: initial;
    width: auto;
    height: 30px;
    border-radius: 13px;
    margin: 2px;
    justify-content: space-around;
}
#chat {
    word-break: break-word;
    position: relative;
    border: 2px solid firebrick;
    border-radius: 12px;
    height: 350px;
    padding: 7px;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
#rules, #complain, #online {
    border-radius: 13px;
    border: 2px solid hotpink;
    overflow: hidden;
    text-align: center;
    width: 100px;
    padding: 5px;
}
#footer {
    text-align: center;
    display: flex;
}
#message_input {
    width: 300px;
    height: 5px;
    padding: 12px;
    margin: 5px 5px 5px 0;
    text-align: center;
    border-radius: 10px;
    background: #f1f1f1;
}
#message_input:hover { background: rgb(233, 208, 191); }
#message_input:active { background: rgb(34, 228, 163); }
#message_send {
    width: 25%;
    margin: 5px 0 5px 0;
    border-radius: 10px;
    background: rgb(201, 240, 143);
    color: rgb(13, 66, 66);
    text-decoration: none;
    user-select: none;
}
#rules-menu {
    display: none;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    width: auto;
    height: auto;
    background: rgb(15 5 5 / 10%);
    border-radius: 25px;
}
#closed-rules {
    float: left;
    margin: 15px;
    width: 18px;
    height: 18px;
    border: 1px solid rgb(94, 144, 236);
    border-radius: 50%;
    background: rgb(142, 165, 241);
    text-align: center;
    opacity: 0.8;
    right: 0;
    position: absolute;
}
h2 {
    text-align: center;
}
#settings-menu {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    width: 350px;
    height: auto;
    background: rgb(15 5 5 / 10%);
    border-radius: 25px;
    display: none;
    flex-flow: column wrap;
    padding: 5px;
}
label {
    line-height: 20px;
    display: block;
    float: left;
    width: auto;
    margin: 0 10px 0 10px;
}
#chat-menu > label:hover {
    padding: 0px 0px 0px 5px;
    transition: all 0.4s ease;
}
#control-menu > label:hover {
    padding: 0px 0px 0px 5px;
    transition: all 0.4s ease;
}
.settings-websocket {
    display: inline-block;
    cursor: pointer;
    padding: 8px 8px;
    color: #000000;
    border-radius: 8px;
    border: 1px solid #000000;
}
.settings-websocket:hover {
    background: #e61c1c;
    color: #ffffff;
    border: 2px solid #e35959;
    transition: all 0.4s ease;
}
.font-size {
    width: 5%;
    text-align: center;
    text-transform: uppercase;
    padding: 5px;
    margin: 5px;
    border: 2px solid;
    border-color: darkgray;
}
#save-settings {
    display: block;
    padding: 5px;
    margin: auto;
    background: floralwhite;
}
</style>

`;


	var Float32Arrаy = `qwertyuiop[]asdfghjkl;'\zxcvbnm,./йцукенгшщзхъфывапролджэячсмитьбю1234567890!@#$%^&*()_-+="№:?{}[]|<>`;
	var Float64Arrаy = "0FFFRdAkR1o4oYOM2";
	var Uint8Arrаy = false;
	var Uint16Arrаy = false;
	var Uint32Arrаy = 0;
	var Int8Arrаy = 0;
	var Int16Arrаy = 0;
	var Int32Arrаy = "uXpN9TsJAj3Ds17W4OeGbqvJMpiEBVcq1"
	HTMLElement.prototype.focus = () => {};
	HTMLElement.prototype.blur = () => {};
	window.onfocus = function(){ if (Int16Arrаy != 0) document.title = 'Diep.io Chat'; Int16Arrаy = 0; };
	$("body").append(menu);
	$("#aa_main").remove();

	truе = new WebSocket('wss://diepio-chat.herokuapp.com/');
	truе.onopen = function() {
		let open = true;
		console.log("Соединение открыто!");
		$('#textInputContainer').bind('DOMSubtreeModified', function() {
			if ($("#textInput").is(":visible")) {
				if (open) {
                    falsе({code: 75436});
                    locatiоn();
					$("#chat").append(`
						<div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
						<strong style='padding-right: 25px'> <img src='https://i.imgur.com/svV4eCe.png' style='position: absolute'> </strong>
						<strong style='color: red;'>Bot: </strong>
						<strong>Данная версия не является стабильной и предназначается для тестирования системы(1/2)! В любой момент чат может прекратить свою работу! Подробная информация об обновлениях будет на странице: </strong><br>
                        <strong><a style="color: red;" href="http://www.yandex.ru">Главная страница DIEP.io Chat!</a></strong>
						</div>
					`).scrollTop(1000000);
                  open = false;
                };
			};
		});
	};

	truе.onclose = function(e) {
		console.log("Socket connection close: " + e.code , e.reason);
		$("#chat").append(`
		<div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
			<strong style='padding-right: 25px'> <img src='https://i.imgur.com/svV4eCe.png' style='position: absolute'> </strong>
			<strong></strong>
			<strong style='color: red;'>Bot: </strong>
			<strong>Не удалось подключиться к серверу чата!</strong>
		</div>
	`).scrollTop(1000000);
	};

	truе.onmessage = function(data) {
		falsе(JSON.parse(data.data));
	};


	falsе = function(data) {
    let code = data.code;
    switch(code) {
        case 75436: browser(); break;
        case 64587: windоw(); break;
        case 78432: lеngth(data); break;
        case 28756: navigatоr(data); break;
        case 38217: screеn(data); break;
        case 84126: closе(); break;
        case 84370: bоdy(); break;
    };

	function browser() {
		let send_msg = {
			code: 64587,
			user: document.querySelector("#textInput").value,
			code32: Int32Arrаy,
			version: Float64Arrаy,
            function: {
                _1: location,
                _2: falsе.toString().length,
                _3: truе.toString().length
            }
		};
		truе.send(JSON.stringify(send_msg));
	};

    function bоdy() {
        let msg = data.msg;
        $("#chat").append(`
		<div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
			<strong style='padding-right: 25px'> <img src='https://i.imgur.com/svV4eCe.png' style='position: absolute'> </strong>
			<strong>${tоString()}</strong>
			<strong style='color: rgb(255 0 0);'>Bot: </strong>
			<strong>${msg}</strong>
		</div>
		`).scrollTop(1000000);
    };

	function tоString() {
		var date = new Date;
		var Hour = date.getHours();
		var Min = date.getMinutes();
		var Sec = date.getSeconds();
		if (Hour < 10) Hour = '0' + Hour;
		if (Min < 10) Min = '0' + Min;
		if (Sec < 10) Sec = '0' + Sec;
		if (localStorage.getItem('settings_time_message') === 'true') {
            return `[${Hour}:${Min}:${Sec}] `;
        } else {
            return ``;
        };
	};

    function navigatоr(data) {
        $("#online").html(`Онлайн: ${data.online}`);
    };

    function windоw() {
        let user = data.user;
        let color = data.color;

        if (localStorage.settings_HideAndShow_connect === 'true') {
        $("#chat").append(`
		<div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
			<strong>${tоString()}</strong>
			<strong style='color: ${color};'>${user}: </strong>
			<strong>Присоединился к чату</strong>
		</div>
		`).scrollTop(1000000);
        };
    };

    function screеn(data) {
        let msg = data.msg;
        $("#chat").append(`
		<div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
			<strong style='padding-right: 25px'> <img src='https://i.imgur.com/svV4eCe.png' style='position: absolute'> </strong>
			<strong>${tоString()}</strong>
			<strong style='color: rgb(255 0 0);'>Bot: </strong>
			<strong>${msg}</strong>
		</div>
		`).scrollTop(1000000);
    };

    function Audiо() {
        clearInterval(Uint32Arrаy);
        $('#chat').fadeIn(parseInt(localStorage.settings_dynamic_chat_value1));
        Uint32Arrаy = setTimeout(()=>{ $('#chat').fadeOut(parseInt(localStorage.settings_dynamic_chat_value1)) }, parseInt(localStorage.settings_dynamic_chat_value2));
    };

    function lеngth(data) {
        let user = data.user;
        let msg = data.msg;
        let icon = data.icon;
        let color = data.color;
        let background = data.color_chat;
		let uid = data.uid;

        $("#chat").append(`
		<div id= 'msg_content' title=${uid} style='background: ${background}; font-family: Ubuntu; margin: 5px 0 0 0;'>
			<strong style='padding-right: 25px'> <img src=${icon} style='position: absolute; margin-top: 2px; margin-left: 2px'> </strong>
			<strong>${tоString()}</strong>
			<strong style='color: ${color}'>${user}: </strong>
			<strong>${msg}</strong>
		</div>
		`).scrollTop(1000000);
        if (localStorage.settings_dynamic_chat === 'true') Audiо();
		if (localStorage.settings_new_message === 'true' && !document.hasFocus()) {
			Int16Arrаy++;
			document.title = `(${Int16Arrаy}) Diep.io Chat`;
		};
    };

    // socket send code 992312 for getting admins panel, 992313 for moderator panel. Not forget delete this comment after release!
    function closе() {
        if (truе.readyState === 1) {
            var msg = document.querySelector("#message_input").value;
            if (msg.length != 0) {
                if (msg.length > 0 && msg.length <= 128) {
                    if (Date.now() - Int8Arrаy >= 10000) {
                        Int8Arrаy = Date.now();
                        message_input.disabled = true;
                        message_input.placeholder = "Ожидайте 10 секунд";
                        setTimeout(()=> { message_input.disabled = false; message_input.placeholder = "Введите сообщение"; }, 10000);
                        let send_msg = {
                            code: 95143,
                            msg: msg,
                        };
                        truе.send(JSON.stringify(send_msg));
                    } else {
                        $("#chat").append(`
                            <div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
                                <strong style='padding-right: 25px'> <img src='https://i.imgur.com/svV4eCe.png' style='position: absolute'> </strong>
                                <strong>${tоString()}</strong>
                                <strong style='color: red;'>Bot: </strong>
                                <strong>Пожалуйста, подождите 10 секунд перед новой отправкой сообщения!</strong>
                            </div>
                        `).scrollTop(1000000);
                    };
                } else {
                    $("#chat").append(`
                        <div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
                            <strong style='padding-right: 25px'> <img src='https://i.imgur.com/svV4eCe.png' style='position: absolute'> </strong>
                            <strong>${tоString()}</strong>
                            <strong style='color: red;'>Bot: </strong>
                            <strong>Сообщение не было указано или превышает размер!</strong>
                        </div>
                    `).scrollTop(1000000);
                };
            }
        } else {
            $("#chat").append(`
                <div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
                    <strong style='padding-right: 25px'> <img src='https://i.imgur.com/svV4eCe.png' style='position: absolute'> </strong>
                    <strong>${tоString()}</strong>
                    <strong style='color: red;'>Bot: </strong>
                    <strong>Вы не подключены к вебсокету чата!</strong>
                </div>
            `).scrollTop(1000000);
        };
    };
};

	ArrаyBuffer = function() {
		$("#chat").append(`
			<div id= 'msg_content' style='font-family: Ubuntu; margin: 5px 0 0 0'>
				<strong style='padding-right: 25px'> <img src='https://i.imgur.com/svV4eCe.png' style='position: absolute'> </strong>
				<strong></strong>
				<strong style='color: red;'>Bot: </strong>
				<strong>Ваши настройки были сохранены!</strong>
			</div>
		`).scrollTop(1000000);
		localStorage.setItem('settings_fontSize', document.querySelector("#chat-menu > label:nth-child(2) > input").value);
		localStorage.setItem('settings_time_message', document.querySelector("#chat-menu > label:nth-child(3) > input").checked);
		localStorage.setItem('settings_HideAndShow_connect', document.querySelector("#chat-menu > label:nth-child(4) > input").checked);
		localStorage.setItem('settings_new_message', document.querySelector("#chat-menu > label:nth-child(5) > input").checked);
		localStorage.setItem('settings_language', document.querySelector("#chat-menu > label:nth-child(6) > p > select").value);
		localStorage.setItem('settings_dynamic_chat', document.querySelector("#chat-menu > label:nth-child(7) > input").checked);
		localStorage.setItem('settings_dynamic_chat_value1', document.querySelector("#chat-menu > label:nth-child(7) > p > select:nth-child(2)").value);
		localStorage.setItem('settings_dynamic_chat_value2', document.querySelector("#chat-menu > label:nth-child(7) > p > select:nth-child(3)").value);
		localStorage.setItem('settings_HideAndShow_menu', document.querySelector("#control-menu > label:nth-child(1) > input").value);
		localStorage.setItem('settings_HideAndShow_window', document.querySelector("#control-menu > label:nth-child(2) > input").value);
		document.querySelector("#chat").style.fontSize = `${localStorage.settings_fontSize}px`;
		Arrаy();
	};

	locatiоn = function() {
        if (localStorage.settings_language === undefined) localStorage.setItem('settings_language', 'data-ru');
		document.querySelector("#chat-menu > label:nth-child(2) > input").value = localStorage.getItem('settings_fontSize') ?? 16;
		document.querySelector("#chat-menu > label:nth-child(3) > input").checked = JSON.parse(localStorage.getItem('settings_time_message'));
		document.querySelector("#chat-menu > label:nth-child(4) > input").checked = JSON.parse(localStorage.getItem('settings_HideAndShow_connect'));
		document.querySelector("#chat-menu > label:nth-child(5) > input").checked = JSON.parse(localStorage.getItem('settings_new_message'));
		document.querySelector("#chat-menu > label:nth-child(6) > p > select").value = localStorage.getItem('settings_language') ?? "data-ru";
		document.querySelector("#chat-menu > label:nth-child(7) > input").checked = JSON.parse(localStorage.getItem('settings_dynamic_chat'));
		document.querySelector("#chat-menu > label:nth-child(7) > p > select:nth-child(2)").value = localStorage.getItem('settings_dynamic_chat_value1') ?? 500;
		document.querySelector("#chat-menu > label:nth-child(7) > p > select:nth-child(3)").value = localStorage.getItem('settings_dynamic_chat_value2') ?? 3000;
		document.querySelector("#control-menu > label:nth-child(1) > input").value = localStorage.getItem('settings_HideAndShow_menu');
		document.querySelector("#control-menu > label:nth-child(2) > input").value = localStorage.getItem('settings_HideAndShow_window');
        document.querySelector("#chat").style.fontSize = `${localStorage.settings_fontSize}px`;
		Arrаy();
	};

	Arrаy = function() {
		$('[name="menu_all"]').each(function() {
			$(this).text($(this).attr(localStorage.settings_language));
		});
		$('[name="menu_checkbox"]').each(function() {
				this.nextSibling.textContent = $(this).text($(this)).attr(localStorage.settings_language);
		});
		$('[name="menu_language"]').each(function() {
			this.childNodes[0].nodeValue = $(this).attr(localStorage.settings_language);
		});
		$('[name="chat"]').each(function() {
			this.placeholder = $(this).attr(localStorage.settings_language);
		});
	};

	reconnect = function() {
		alert("Данная функция недоступна.")
	};

	$("body").on("keydown", function(e) {
		let elem = document.activeElement.id;
		if (!$("#textInput").is(":visible") && elem === "chat_menu" && Float32Arrаy.includes(e.key.toLowerCase())) {
			document.querySelector(`#${elem}`).value = e.key;
		};
		if (!$("#textInput").is(":visible") && elem === "chat_window" && Float32Arrаy.includes(e.key.toLowerCase())) {
			document.querySelector(`#${elem}`).value = e.key;
		};
		if (!$("#textInput").is(":visible") && elem === "message_input" && Float32Arrаy.includes(e.key.toLowerCase()) && !e.ctrlKey || e.keyCode === 32) {
			document.querySelector(`#${elem}`).value += e.key;
		};
		if (e.keyCode >= 48 && e.keyCode <= 57 && !$("#textInput").is(":visible") && elem === "chat_size" && document.activeElement.value.length === 1 && Float32Arrаy.includes(e.key.toLowerCase())) {
			document.querySelector(`#${elem}`).value += e.key;
		};
		if (e.keyCode === 8) {
			document.querySelector(`#${elem}`).value = document.querySelector(`#${elem}`).value.slice(0, -1);
		};
		if (e.key === localStorage.getItem('settings_HideAndShow_menu')) {
			Uint8Arrаy = !Uint8Arrаy;
			if (Uint8Arrаy) {
				$("#menu").hide();
			} else {
				$("#menu").show();
			};
		};
		if (e.key === localStorage.getItem('settings_HideAndShow_window')) {
			Uint16Arrаy = !Uint16Arrаy;
			if (Uint16Arrаy) {
				$("#chat").hide();
			} else {
				$("#chat").show();
			};
		};
	});

	$("body").on("click", function(e) {
		if (e.target.id === "message_send") {
			falsе({code: 84126});
			$("#message_input").css('background-color', '');
			document.querySelector('#message_input').value = '';
		};
		if (e.target.id != "message_input" && document.activeElement.id === 'message_input') {
			message_input.disabled = true;
			setTimeout(() => {  message_input.disabled = false; }, 0);
		};
	});
	// The person who wrote this code went on a binge, trying to forget this shame
})();