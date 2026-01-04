// ==UserScript==
// @name        BeeSoc
// @namespace   BeeSoc
// @name:ru     BeeSoc
// @description:ru     Инструмент для Beeline
// @description:en     Tool for Beeline
// @include     https://*.beeline.ru/*
// @version     1.3|0.5
// @grant       none
// @author      NULL|Народ
// @description Инструмент для Beeline
// @downloadURL https://update.greasyfork.org/scripts/391693/BeeSoc.user.js
// @updateURL https://update.greasyfork.org/scripts/391693/BeeSoc.meta.js
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
				12TMDIS10 - 10% на год<br>
				12TMDIS20 - 20% на год<br>
				12TMDIS30 - 30% на год<br>
				12TMDIS40 - 40% на год<br>
				12TMDIS60 - 60% на год<br>
				12TMDIS70 - 70% на год<br>
				12TMDIS80 - 80% на год<br>
				12TMDIS90 - 90% на год<br>
				<br>
				7TMDISC00 - 100% на 7 дней<br>
				2TMDISC00 - 100% на 14 дней<br>
				1TMDISC00 - 100% на 1 месяц<br>
			</td>
			<td>
				<b>Звонки/СМС/Интернет</b><br>
				CVMMGVSR - 100 минут на междугород<br>
				VNS_ZERTM - Ноль на Би России<br>
				BEEUNLRF0 - Безлимитные звонки на Би&emsp;<br>
				SMSUNLRF0 - Безлимитные СМС<br>
				CVMUNLIMC - Безлимитный интернет<br>
				UNL_PRES - Безлимитный интернет<br>
				TM_TETR0 - Раздача WiFi<br>
				4G_PRO182 - Безлимит в 4G-6 мес.<br>
			</td>
			<td>
				<b>Хайвей</b><br>
				TMHWALL5 - 20 ГБ<br>
				TMHWAL5 - 20 ГБ<br>
				TMHWALL4 - 12 ГБ&emsp;<br>
				TMHWAL4 - 12 ГБ<br>
				TMHWALL3 - 8 ГБ<br>
				TMHWAL3 - 8 ГБ<br>
				TMHWALL2 - 4 ГБ<br>
				TMHWAL2 - 4 ГБ<br>
				TMHWALL1 - 1 ГБ<br>
				TMHWAL1 - 1 ГБ<br>
			</td>
			<td>
				<b>Бонус</b><br>
				TMBON_130 - 130 &emsp;<br>
				TMBON_65 - 65 <br>
				TMBON_50 - 50 <br>
				TMBON_40 - 40 <br>
				TMBON_25 - 25 <br>
			</td>
			<td>
				<b>Народные SOC</b><br>
				<b>Присылайте - добавим</b><br>
				<b>narodnyj@pm.me</b><br>
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
$('#zOtvet').show().html('Какая-то ошибка!');
    }
}
	    });
}
</script>
</div>
`);
document.getElementById('URLz').value = "https://"+document.domain+"/mobiledownsale/upsaleconnect";
}