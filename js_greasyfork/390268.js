// ==UserScript==
// @name         Add Trello Button
// @version      1.1
// @description  Añade trello a los tickets
// @author       SirFerra
// @match        http://soporte.flexxus.com.ar/requests/show/index/id/*
// @grant        none
// @updateUrl    https://greasyfork.org/es/scripts/390268-add-trello-button
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/390268/Add%20Trello%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/390268/Add%20Trello%20Button.meta.js
// ==/UserScript==

/* Escribí tu token acá */
var TuToken= ''

/* Lo generás con este link. Vos tranquilo
https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Server%20Token&key=6b3e1745ff9c1e2eb51ff9d2f6cd421c
*/

var btn = '<div id="trello" class="requestViewAction" title="Trello"><img src="https://a.trellocdn.com/prgb/dist/images/header-logo-2x.01ef898811a879595cea.png" style="width: 61px;height: auto;padding-top: 8px;"/></div>';
$('.requestViewActions').append(btn);

$('#trello').colorbox({
	html:`<div id="TrelloBox">
    <style>
    #TrelloBox input{
        margin-bottom:3px;
    }
</style><h1 style="padding:30px 30px 0px;display: table;margin-left: auto;margin-right: auto;">Crear tarjeta en Trello</h1>
	<div id="content" style="padding:20px 40px 10px;width: 400px;display: flex;">
        <div id="userAgent" style="width:47%">
            <input type="radio" name="agent" value="ariel" required checked>   Ariel<br>
            <input type="radio" name="agent" value="cesar">   César<br>
            <input type="radio" name="agent" value="guille">   Guille<br>
            <input type="radio" name="agent" value="lean">   Lean<br>
            <input type="radio" name="agent" value="mauri">   Mauri<br>
        </div>
        <div id="type" style="width: 47%;">
            <input type="radio" name="type" value="site" required checked>  Temas con el server<br>
            <input type="radio" name="type" value="config">  Configuración Presta<br>
            <input type="radio" name="type" value="sincro">   Sincro<br>
            <input type="radio" name="type" value="css">   Diseño TPL/css mod<br>
            <input type="radio" name="type" value="dev">   Desarrollo a medida<br>
            <input type="radio" name="type" value="other">   Otro servicio<br>
        </div>
    </div>
    <div class="popupOptions">
<a id="btnTrello" style="cursor: pointer;float: right;background: #344456;margin-right: 40px;margin-bottom:30px;color: #fff;" class="btn">Enviar a Trello</a>
</div>

</div><script>$('#btnTrello').click(()=>{
const token= '${TuToken}'
const keyTrello = '6b3e1745ff9c1e2eb51ff9d2f6cd421c';
const urlSoporteFlexxus = "http://soporte.flexxus.com.ar/requests/show/index/id/";

const idBoardDesarollo = 'fU8FuZwl';
const idBoardTest= 'OSN6wyaX';

const idCardCoso = '5ae2640d8dc583715d6b86ca';
const idCardAsignados = '5a7af3f5f1083724255f2a87';

const services ={"site": "5d83712de5d3d019712ff23f","config": "5d83714f482a962b3a98fc01","sincro": "5d837158fe0a534e87a7c7ce","css": "5d837165fcda98711cb9fbb0","dev": "5d83716f84cde72a75e3dded",}
const users = {'ariel':'540b4097f0d797bbfc932b58','cesar':'55ba7a3d52e12de2e6bc0f61','guille':'5a7b19ae623921de32320735','lean':'5ae26407cbf23984a1e9a594','mauri':'58000f9f2d3e001e2c6f5059'}
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log(this.responseText);
        }
    });
    var numt = $('.requestViewId').text().replace('#','');
    var name = $('.requestViewTitle').text() + " #" +numt;
    var agent = $('[name="agent"]:checked').val();
    var service= $('[name="type"]:checked').val();
    var desc = urlSoporteFlexxus + numt;
    var date = new Date($('div[title^="Resolución"] .itemCont span').data('countdown')* 1000)
    var month = parseInt(date.getMonth())+1
    var url = "https://api.trello.com/1/cards?name=" + name;
    url += "&desc="+ desc
    url += "&pos=top"
    url += "&idList="+idCardAsignados
    url += "&keepFromSource=all"
    url += "&key=" + keyTrello
    url += "&token=" + token;
    url += "&idMembers=" + users[agent]
    url += "&idLabels=" +services[service]
    url = encodeURI(url);
    url = url.replace('#','%23');
    xhr.open("POST",url);
    xhr.send(data);
    $.colorbox.close();
})</script>`,
})

// el date, está comentado porque anda para el culito
//url += "&due=" + date.getFullYear() + "-" + ("0" + month).slice(-2) + "-" + ("0" + date.getDate()).slice(-2)