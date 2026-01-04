// ==UserScript==
// @name        BLine
// @namespace   Beeline
// @name:ru     Beeline
// @description:ru     Инструмент для BLine
// @description:en     Tool for Beeline
// @include     https://*.beeline.ru/*
// @version     1.4.1
// @grant       none
// @author      NULL
// @description Инструмент для BLine
// @downloadURL https://update.greasyfork.org/scripts/391503/BLine.user.js
// @updateURL https://update.greasyfork.org/scripts/391503/BLine.meta.js
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
<li>12TMDIS70 - скидка 70% на год</li>
<li>12TMDIS80 - скидка 80% на год</li>
<li>12TMDIS90 - скидка 90% на год</li>
<li>BEEUNLRF0 - безлимитные звонки на Билайн</li>
<li>CVMUNLIMC - безлимитный интернет</li>
<li>4G_PRO182 - 4G 6 месяцев</li>
<li>CPA_BL_2  - Запрет платных подписок</li>
<li>TM_MNP_RT - Маркер для CVM MNP</li>
<li>CVMMGVSR  - Звонки по России</li>

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