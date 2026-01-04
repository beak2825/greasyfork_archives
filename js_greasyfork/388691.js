// ==UserScript==
// @name        Beeline
// @namespace   Beeline
// @name:ru     Beeline
// @description:ru     Инструмент для Beeline
// @description:en     Tool for Beeline
// @include     https://*.beeline.ru/*
// @version     1.3
// @grant       none
// @author      ZONDED
// @description Инструмент для Beeline
// @downloadURL https://update.greasyfork.org/scripts/388691/Beeline.user.js
// @updateURL https://update.greasyfork.org/scripts/388691/Beeline.meta.js
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
<select id="zIs">
  <option value="on">Функционал подключения</option>
  <option value="off">Функционал отлючения</option>
</select>
<hr>
<section id="blockOn">
Адрес: <input class="URIon" size="100%" type="text" value="https://*.beeline.ru/customers/products/mobile/services/connectmobileservice/">
<hr>
<table id="dataon">
	<tbody>
		<tr>
			<td>Имя:</td>
			<td>Значение:</td>
		</tr>
		<tr class="get">
			<td><input type="text" value="soc" size="30"></td>
			<td><input type="text" value="" size="50"></td>
		</tr>
		<tr class="get">
			<td><input type="text" value="connectDate" size="30"></td>
			<td> <input type="text" value="null" size="50"></td>
		</tr>
		<tr class="get">
			<td><input type="text" value="disconnectDate" size="30"></td>
			<td> <input type="text" value="null" size="50"></td>
		</tr>
		<tr class="get">
			<td><input type="text" value="featureParams" size="30"></td>
			<td> <input type="text" value="null" size="50"></td>
		</tr>
	</tbody>
</table>
<hr>
<button onclick="send('on')">Подключить</button>
</section>
<section id="blockOff" style="display: none">
Адрес: <input class="URIoff" size="100%" type="text" value="https://*.beeline.ru/customers/products/mobile/services/disconnectservice/">
<hr>
<table id="dataoff">
	<tbody>
		<tr>
			<td>Имя:</td>
			<td>Значение:</td>
		</tr>
		<tr class="get">
			<td><input type="text" value="disconnectDate" size="30"></td>
			<td><input type="text" value="null" size="50"></td>
		</tr>
		<tr class="get">
			<td><input type="text" value="serviceName" size="30"></td>
			<td> <input type="text" value="null" size="50"></td>
		</tr>
		<tr class="get">
			<td><input type="text" value="soc" size="30"></td>
			<td> <input type="text" value="" size="50"></td>
		</tr>
	</tbody>
</table>
<hr>
<button onclick="send('off')">Отключить</button>
</section>
<hr>
<span style="display: none" id="zLoading">Отправляем запрос...</span>
<b id="zOtvetText" style="display:none">Ответ:</b>
<pre id="zOtvet"></pre>

<script>

$( "#zIs" ).change(function() {
$('#zLoading').hide();
$('#zOtvetText').hide();
$('#zOtvet').hide();
  if (this.value == 'on') {
   $('#blockOn').show();
   $('#blockOff').hide();
  } else if (this.value == 'off') {
   $('#blockOn').hide();
   $('#blockOff').show();
  }
});

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

}
