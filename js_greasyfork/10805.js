// ==UserScript==
// @name       Script Reto FA
// @version    1.0
// @description  Añade reto
// @match      http://www.filmaffinity.com/es/mydata.php
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @grant      GM_addStyle
// @copyright  2015+, You
// @namespace https://greasyfork.org/users/2940
// @downloadURL https://update.greasyfork.org/scripts/10805/Script%20Reto%20FA.user.js
// @updateURL https://update.greasyfork.org/scripts/10805/Script%20Reto%20FA.meta.js
// ==/UserScript==

$(document).ready(function() {
    
    GM_addStyle(".cscb {color: #337ab7; font-size: 12px; cursor: pointer; width: 50%; display: inline-block; padding: 4px 0px;}");    
    GM_addStyle("input[type=checkbox] {visibility: hidden;}");
    var txt = "<div class=\"box\" style='height:600px'><div class=\"h\" id='reto_tt' style='margin-bottom: 10px'>Reto cinéfilo</div>";
    
    txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb1\"> Una de más de 3 horas</label>";
    txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb2\"> Una de menos de 80 minutos</label>";
    txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb3\"> Una clásica romántica</label>";
    txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb4\"> Una con antónimos en su título</label>";
    txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb5\"> Una que sea un remake</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb6\"> Una ambientada en un lugar que quieres visitar</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb7\"> Una del 2015</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb8\"> Una que se desarrolla en tu ciudad/región</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb9\"> Una con un número en el título</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb10\"> Una de un director menor de 30 años</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb11\"> Una con críticas malas</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb12\"> Una con personajes no humanos</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb13\"> Una trilogía</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb14\"> Una de tu año nacimiento</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb15\"> Una dirigida por una mujer</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb16\"> Una con triángulo amoroso</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb17\"> Una ambientada en el futuro</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb18\"> Una con una sola palabra en el título</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb19\"> Una ambientada en el instituto</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb20\"> Una compuesta de historias cortas</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb21\"> Una con un color en el título</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb22\"> Una ambientada en un país asiático</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb23\"> Una ambientada en un país sudamericano</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb24\"> Un documental</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb25\"> Un musical</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb26\"> Una ópera prima de un director conocido</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb27\"> Una basada en una novela gráfica</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb28\"> Una de un actor/actriz que te encante y no hayas visto</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb29\"> Una de un director del que no hayas visto antes</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb30\"> Una recomendado por un amig@</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb31\"> Una ganadora del Oscar a mejor película</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb32\"> Una de tu infancia que viste en el cine</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb33\"> Una basada en hechos reales</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb34\"> Una navideña</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb35\"> Una que le encante a tu madre</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb36\"> Una que un personaje tenga tu nombre</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb37\"> Una que te dé miedo</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb38\"> Una que se desarrolle en un solo escenario</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb39\"> Una muda</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb40\"> Una con poster horrible</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb41\"> Una basada en una serie de TV</label>";
	txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id=\"cb42\"> Una que empezaste y nunca acabaste</label>";
    
    txt += "</div>";
    $(".zdates").append(txt);  
        
    $("input[name='reto15']").each(function() {
        $(this).prop('checked', localStorage.getItem($(this).attr('id'))); 

        if($(this).prop('checked'))
            $(this).parent().css('text-decoration', 'line-through');
    });
    
    var marked = $("input:checkbox:checked").length;
    $('#reto_tt').text("Reto cinéfilo 2015 (" + marked + " / 42)");    
    
    $("input[name='reto15']").change(function() {        
        localStorage.setItem($(this).attr('id'), $(this).prop('checked'));

        if($(this).prop('checked'))
            $(this).parent().css('text-decoration', 'line-through');
        else {
            $(this).parent().css('text-decoration', 'none');
            localStorage.removeItem($(this).attr('id'));
        }

        marked = $("input:checkbox:checked").length;
        $('#reto_tt').text("Reto cinéfilo 2015 (" + marked + " / 42)");
    });    
});