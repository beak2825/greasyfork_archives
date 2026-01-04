// ==UserScript==
// @id             depositfiles_waiter
// @name           depositfiles_downloader
// @namespace      https://openuserjs.org/scripts/Black_Sun/depositfiles_downloader
// @version        5.0.3
// @history        5.0.3 Сразу обновлены ссылки на скачивание и проверку обновлений
// @history        5.0.2 Тестовое изменение, добавил всего одну строчку запуска на старте run-at document-start если перестало работать на FF пишите issue по ссылке выше, строчка для того что бы заработало на Chrome 
// @history        5.0.1 Изменён include, работа гарантируется только на greasemoney
// @history        5.0 Добавлено автоожидание при лимите и исправлена ошибка ссылок с limit=1 на конце (issue by rayman89).
// @history        4.7 Модифицировал код под Greasemonkey, т.к. Scriptish автор походу забросил.
// @history        4.6 Совсем убрал jQuery из скрипта и добавил GM_safeHTMLParser, спасибо KOLANICH за наводку
// @history        4.5.0.1 Updated: Новая ссылка для обновления скрипта
// @history        4.5.0 Настало время ввести новую систему версий и дать грант функциям
// @history        4.4 Добавлена поддержка dfiles.ru
// @history        4.3 И сразу 4.3. Добавлено:Информация о просьбе подождать, и лимите подключений.
// @history        4.2 Добавлено: Автоопределение страны ссылки
// @history        4.1 Небольшой фикс
// @history        4.0 Surprise.
// @history        3.0 Переделан скрипт, теперь нажимает, добавлена инфа в табе о секундах, автоскачивание не работает, т.к. там каптча и, да, её нужно вводить :(
// @history        2.8 Фикс под новый вид кода и добавлена инфа о лимите.
// @history        2.7 Обновлены include
// @history        2.6 Обновил код, добавил настройки и их удаления для Firefox(greasemonkey или scriptish) и Chrome(Tempermonkey), для Оперы настройки остались в коде скрипта в начале.
// @history        2.5 Новый стиль в конце получения ссылки, сама кнопка плюс ссылка и поле с ссылкой
// @history        2.4 Добавлено определение превышения лимита скачивания. Для браузера Opera, программы userjsmanager добавлена ссылка обновления скрипта.
// @history        2.3 Добавлена опция индикации работы скрипта, когда вы думаете что скрипт не работает.
// @history        2.2 Убрано предупреждение о начале запроса, так же уменьшено время ожидания в конце, если не будет работать автоскачивание напишите мне об этом.
// @history        2.1 Исправлены некоторые переменные.
// @history        2.0 Добавлена опция автоматического скачивания после появления кнопки, добавлено описание, изменён namespace скрипта.
// @history        1.0 Релиз.
// @author         Black_Sun
// @description    Автоматически или вручную позволяет скачивать файлы без ожидания.
// @include        /^https?:\/\/(www\.)?(dfiles|depositfiles)\.(ru|com)\/files\/.*$/
// @grant GM_registerMenuCommand
// @grant GM_deleteValue
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/37104/depositfiles_downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/37104/depositfiles_downloader.meta.js
// ==/UserScript==
var uli;
if(this.opera){
	var autodownload=true; 
}
else
{
	GM_registerMenuCommand("Удалить настройку автоскачивания", function() {GM_deleteValue("auto")});
	if(GM_getValue('auto')===undefined)
	{
		if(confirm('Первичная настройка скрипта\n для сброса настройки есть пункт меню в командах скрипта\n\nВы хотите использовать автоскачивание?'))
		{
			var autodownload=true;GM_setValue('auto',true);}else{var autodownload=false;GM_setValue('auto',false);
		}
	}
	else if(GM_getValue('auto')!==undefined){var autodownload=GM_getValue('auto')}
}
document.addEventListener("DOMContentLoaded",function(){
	var gate = new FormData();
	var ss="";
	gate.append("gateway_result", 1);
	var info=document.querySelector("div.violation");
	var divwait = document.createElement('div');
    divwait.innerHTML = 'Пожалуйста подождите, скачивание скоро начнётся.';
	divwait.setAttribute('style','font-size:18px;color:green');
    divwait.id = 'wait';
    info.parentNode.insertBefore(divwait, info);
	var ll=location.href.split('/')[3];
	if(ll.indexOf('files')!=-1){uli='http://dfiles.ru/'+ll+'/'+location.href.split('/')[4]}else{uli=location.href}
	GM_xmlhttpRequest(
	{
		method:"POST",
		data:gate,
		url:uli,
		headers:{
			"User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.8.1.20) DepositFiles/FileManager 0.9.9.206",      
			"Accept":"*/*"
		},
		onload:function(response) 
		{
			if (response.readyState == 4) 
			{
				var doc = new DOMParser().parseFromString(response.responseText, "text/html");
				var ar=doc.getElementsByClassName("repeat")[0];
				var ip=doc.getElementsByClassName("ip")[0];
				var l='';
				if (ar !== undefined) l=ar.getElementsByTagName('a')[0].getAttribute('href');
                if (ip !== undefined)
				{
					clearInterval(ss)
					var st=ip.querySelector('div.ipbg').querySelector('strong').innerHTML.replace(/(.*)(\s[0-9]{1,}\s)(минут)(.*)/ig,"$2");
					st=st*1
					document.getElementById("wait").innerHTML = "<i style='color:blue'>Автозапрос повторится через "+st+" минут(у), не обновляйте страницу</i><br>"+ip.innerHTML;
					setInterval(function(){
						if(st>0)st=st-1
						document.getElementById("wait").innerHTML = "<i style='color:blue'>Автозапрос повторится через "+st+" минут(у), не обновляйте страницу</i><br>"+ip.innerHTML;
					},1*60*1000)
					var timerr=st*1*60*1000;
				    ss=setInterval(function(){dretry()},timerr)
				}
				else
				{
					clearInterval(ss)
					document.getElementById("wait").innerHTML = '<div style="background:lightblue;text-align:center;height:30px;"><a href="'+l+'" style="font-size: 20px;">Download</a></div>';
					if(autodownload)location.href=l;
				}
			} 
		}
	});

function dretry(){
	GM_xmlhttpRequest(
	{
		method:"POST",
		data:gate,
		url:uli,
		headers:{
			"User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; ru; rv:1.8.1.20) DepositFiles/FileManager 0.9.9.206",      
			"Accept":"*/*"
		},
		onload:function(response) 
		{
			if (response.readyState == 4) 
			{
				var doc = new DOMParser().parseFromString(response.responseText, "text/html");
				var ar=doc.getElementsByClassName("repeat")[0];
				var ip=doc.getElementsByClassName("ip")[0];
				var l='';
				if (ar !== undefined) l=ar.getElementsByTagName('a')[0].getAttribute('href');
                if (ip !== undefined)
				{
					clearInterval(ss)
					var st=ip.querySelector('div.ipbg').querySelector('strong').innerHTML.replace(/(.*)(\s[0-9]{1,}\s)(минут)(.*)/ig,"$2");
					st=st*1
					document.getElementById("wait").innerHTML = "<i style='color:blue'>Ошибка, если вы видите это сообщение, значит что-то не так.<br> Автозапрос повторится через "+st+" минут(у), не обновляйте страницу</i><br>"+ip.innerHTML;
					setInterval(function(){
						if(st>0)st=st-1
						document.getElementById("wait").innerHTML = "<i style='color:blue'>Ошибка, если вы видите это сообщение, значит что-то не так.<br> Автозапрос повторится через "+st+" минут(у), не обновляйте страницу</i><br>"+ip.innerHTML;
					},1*60*1000)
					var timerr=st*1*60*1000;
				    ss=setInterval(function(){dretry()},timerr)
				}
				else
				{
					clearInterval(ss)
					document.getElementById("wait").innerHTML = '<div style="background:lightblue;text-align:center;height:30px;"><a href="'+l+'" style="font-size: 20px;">Download</a></div>';
					if(autodownload)location.href=l;
				}
			} 
		}
});
}
},false);