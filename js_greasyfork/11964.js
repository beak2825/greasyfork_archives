// ==UserScript==
// @name         Denuncias
// @namespace    Anonymous
// @version      2.0
// @description  Crear temas para denuncias 
// @match        http*://www.taringa.net/comunidades/denuncias-t/
//@icon          
// 
// @downloadURL https://update.greasyfork.org/scripts/11964/Denuncias.user.js
// @updateURL https://update.greasyfork.org/scripts/11964/Denuncias.meta.js
// ==/UserScript==

(function() {
    var textyboton = $('<div class="title clearfix" font-size:10px><h2>DENUNCIADOR 5000</h2>TÍtulo del tema<select id="titulos" font-size:12px"><option>No disponible.</option><option>Link prohibidos.</option><option>Para Mi Taringa!.</option><option>Para Taringa! comunidades.</option><option>Contenido no apto.</option><option>Contiene información personal mia o de terceros.</option><option>Otros: no aporta.</option><option>La fuente es incorrecta o no está presente.</option><option>Re-post.</option><option>Categoría incorrecta.</option><option>Título en mayúsculas o llamativo.</option><option>Copyright.</option><option>Variado.</option><option>Para denunciar</option><option>Varios.</option></select>Razón de la denuncia.<select id="razon" font-size:10px"><option> </option><option>Contenido no disponible (Imágenes o links rotos).</option><option>Contenido discriminatorio u ofensivo.</option><option>Contenido para Mi Taringa!.</option><option>Contenido para Taringa! comunidades.</option><option>Contiene imágenes de menores con contenido sexual.</option><option>Contiene imágenes no aptas (Violencia, pornografía, etc.).</option><option>Contiene información personal mia o de terceros.</option><option>Contiene links prohibidos (Descargas, acortadores, referers, spam etc.).</option><option>Contiene virus, código malicioso o intento de fraude.</option><option>Discusión agresiva o no apta en comentarios.</option><option>La fuente es incorrecta o no está presente (Aclarar fuente original).</option><option>Post duplicado (Aclarar post original).</option><option>Publicado en Categoría incorrecta.</option><option>Título en mayúsculas o llamativo.</option><option>Viola derechos de propiedad intelectual/copyright.</option><option>Otros motivos (Aclarar).</option></select>  <textarea id="ID1" class="user-text" tabindex="500" placeholder="[ID1]" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <textarea id="AC1" class="user-text" tabindex="700" placeholder="Título" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> </select>Razón de la denuncia 2.<select id="razon2" font-size:10px"><option> </option><option>Contenido no disponible (Imágenes o links rotos).</option><option>Contenido discriminatorio u ofensivo.</option><option>Contenido para Mi Taringa!.</option><option>Contenido para Taringa! comunidades.</option><option>Contiene imágenes de menores con contenido sexual.</option><option>Contiene imágenes no aptas (Violencia, pornografía, etc.).</option><option>Contiene información personal mia o de terceros.</option><option>Contiene links prohibidos (Descargas, acortadores, referers, spam etc.).</option><option>Contiene virus, código malicioso o intento de fraude.</option><option>Discusión agresiva o no apta en comentarios.</option><option>La fuente es incorrecta o no está presente (Aclarar fuente original).</option><option>Post duplicado (Aclarar post original).</option><option>Publicado en Categoría incorrecta.</option><option>Título en mayúsculas o llamativo.</option><option>Viola derechos de propiedad intelectual/copyright.</option><option>Otros motivos (Aclarar).</option></select>  <textarea id="ID2" class="user-text" tabindex="500" placeholder="[[ID2]" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <textarea id="AC2" class="user-text" tabindex="700" placeholder="Título" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> </select>Razón de la denuncia 3.<select id="razon3" font-size:10px"><option> </option><option>Contenido no disponible (Imágenes o links rotos).</option><option>Contenido discriminatorio u ofensivo.</option><option>Contenido para Mi Taringa!.</option><option>Contenido para Taringa! comunidades.</option><option>Contiene imágenes de menores con contenido sexual.</option><option>Contiene imágenes no aptas (Violencia, pornografía, etc.).</option><option>Contiene información personal mia o de terceros.</option><option>Contiene links prohibidos (Descargas, acortadores, referers, spam etc.).</option><option>Contiene virus, código malicioso o intento de fraude.</option><option>Discusión agresiva o no apta en comentarios.</option><option>La fuente es incorrecta o no está presente (Aclarar fuente original).</option><option>Post duplicado (Aclarar post original).</option><option>Publicado en Categoría incorrecta.</option><option>Título en mayúsculas o llamativo.</option><option>Viola derechos de propiedad intelectual/copyright.</option><option>Otros motivos (Aclarar).</option></select>  <textarea id="ID3" class="emo-text" tabindex="500" placeholder="[ID3]" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <textarea id="AC3" class="user-text" tabindex="700" placeholder="Título" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> Razón de la denuncia 4.<select id="razon4" font-size:10px"><option> </option><option>Contenido no disponible (Imágenes o links rotos).</option><option>Contenido discriminatorio u ofensivo.</option><option>Contenido para Mi Taringa!.</option><option>Contenido para Taringa! comunidades.</option><option>Contiene imágenes de menores con contenido sexual.</option><option>Contiene imágenes no aptas (Violencia, pornografía, etc.).</option><option>Contiene información personal mia o de terceros.</option><option>Contiene links prohibidos (Descargas, acortadores, referers, spam etc.).</option><option>Contiene virus, código malicioso o intento de fraude.</option><option>Discusión agresiva o no apta en comentarios.</option><option>La fuente es incorrecta o no está presente (Aclarar fuente original).</option><option>Post duplicado (Aclarar post original).</option><option>Publicado en Categoría incorrecta.</option><option>Título en mayúsculas o llamativo.</option><option>Viola derechos de propiedad intelectual/copyright.</option><option>Otros motivos (Aclarar).</option></select><textarea id="ID4" class="emo-text" tabindex="500" placeholder="[ID4]" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <textarea id="AC4" class="user-text" tabindex="700" placeholder="Título" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> Razón de la denuncia 5.<select id="razon5" font-size:10px"><option> </option><option>Contenido no disponible (Imágenes o links rotos).</option><option>Contenido discriminatorio u ofensivo.</option><option>Contenido para Mi Taringa!.</option><option>Contenido para Taringa! comunidades.</option><option>Contiene imágenes de menores con contenido sexual.</option><option>Contiene imágenes no aptas (Violencia, pornografía, etc.).</option><option>Contiene información personal mia o de terceros.</option><option>Contiene links prohibidos (Descargas, acortadores, referers, spam etc.).</option><option>Contiene virus, código malicioso o intento de fraude.</option><option>Discusión agresiva o no apta en comentarios.</option><option>La fuente es incorrecta o no está presente (Aclarar fuente original).</option><option>Post duplicado (Aclarar post original).</option><option>Publicado en Categoría incorrecta.</option><option>Título en mayúsculas o llamativo.</option><option>Viola derechos de propiedad intelectual/copyright.</option><option>Otros motivos (Aclarar).</option></select><textarea id="ID5" class="emo-text" tabindex="500" placeholder="[ID5]" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <textarea id="AC5" class="user-text" tabindex="700" placeholder="Título" autocomplete="on" style="width:100px; height: 15px; background: rgb(255, 255, 255);resize: none; "></textarea> <input type="button" id="recos" value="[CREAR.TEMA]" style="height: 40px; background:#054D8A; color: white; "/></div>');
    $('#sidebar').prepend(textyboton)
    
    
    
    function reload() {
        var titulo = $('#titulo-input');
        var tit = $('#titulos').val ();
        var raz = $('#razon').val ();
        var raz2 = $('#razon2').val ();
        var raz3 = $('#razon3').val ();
        var raz4 = $('#razon4').val ();
        var raz5 = $('#razon5').val ();
        var com = $('#markItUp');
        com.val("").click().focus();
        var ext = $('#ID1').val ();
        var esc = $('#ID2').val ();
        var emt = $('#ID3').val ();
        var eml = $('#ID4').val ();
        var emf = $('#ID5').val ();
        var ext1 = $('#AC1').val ();
        var esc2 = $('#AC2').val ();
        var emt3 = $('#AC3').val ();
        var eml4 = $('#AC4').val ();
        var emf5 = $('#AC5').val ();
        var lol = '';
        if(com.val() != ''){
			lol += "";
		}
        lol += '[align=center][img]http://k46.kn3.net/taringa/A/9/B/D/5/5/ro-b0t-cop/049.jpg[/img][/align]' + '\n';
	lol += '[align=center][b]? Causa:[/align]' + '\n';
        lol += '[align=center] ' + raz + ' [/align]' + '\n';
	lol += '[align=center][b]➤ Link 1:[/b] [url=http://www.taringa.net/index.php?postid=' + ext + ']' + ext + '[/url][/align]' + '\n';
        lol += '[align=center][b]>Id: ' + ext + ' - ' + ext1 + '[/b][/align]' +'\n';
        lol += '[align=center][b]______[/b][/align]' + '\n';
        lol += '[align=center] ' + raz2 + '[/align]'+ '\n';
        lol += '[align=center][b]➤ Link 2:[/b] [url=http://www.taringa.net/index.php?postid=' + esc + ']' + esc + '[/url][/align]' + '\n';
        lol += '[align=center][b]>Id: ' + esc + ' - ' + esc2 + '[/b][/align]' +'\n';
        lol += '[align=center][b]______[/b][/align]' + '\n';
        lol += '[align=center] ' + raz3 + '[/align]'+ '\n';
        lol += '[align=center][b]➤ Link 3:[/b] [url=http://www.taringa.net/index.php?postid=' + emt + ']' + emt + '[/url][/align]' + '\n';
        lol += '[align=center][b]>Id: ' + emt + ' - ' + emt3 + '[/b][/align]' +'\n';
        lol += '[align=center][b]______[/b][/align]' + '\n';
        lol += '[align=center] ' + raz4 + '[/align]'+ '\n';
        lol += '[align=center][b]➤ Link 4:[/b] [url=http://www.taringa.net/index.php?postid=' + eml + ']' + eml + '[/url][/align]' + '\n';
        lol += '[align=center][b]>Id: ' + eml + ' - ' + eml4 + '[/b][/align]' +'\n';
        lol += '[align=center][b]______[/b][/align]' + '\n';
        lol += '[align=center] ' + raz5 + '[/align]'+ '\n';
        lol += '[align=center][b]➤ Link 5:[/b] [url=http://www.taringa.net/index.php?postid=' + emf + ']' + emf + '[/url][/align]' + '\n';
        lol += '[align=center][b]>Id: ' + emf + ' - ' + emf5 + '[/b][/align]' +'\n';
        lol += '[align=center][b]______[/b][/align]' + '\n';
        lol += '[align=center]Si me equivoco en algo no te olvides de enviarme un mensaje privado para corregir: [url=http://www.taringa.net/mensajes/a/ro-b0t-cop]✉[/url][/align]' + '\n';
        lol += '[align=center]En caso de ser posts con links de descarga recordar dejar solo las Ids, gracias. ?[/align]'+ '\n';
        lol += '[align=center]Si me equivoco en algo y no contesto MP, avisar a cualquier otro mod conectado que edite el tema. ✎[/align]'+ '\n';
        lol += '[align=center][img]http://k33.kn3.net/taringa/B/0/6/5/C/E/ro-b0t-cop/DD1.jpg[/img][/align]' + '\n';
		lol += '\n';
        com.val(lol).click().focus();
        titulo.val(tit).click().focus();
    } recos.onclick=reload;
    

})();