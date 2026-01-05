// ==UserScript==
// @name         Follower
// @namespace    http://taringa.net/XQ/
// @version      0.3
// @description  Boton de la mierda esa. Lo borraron en Greasy Fork
// @author       Yo
// @match        http://www.taringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11176/Follower.user.js
// @updateURL https://update.greasyfork.org/scripts/11176/Follower.meta.js
// ==/UserScript==
// Nota: no re responsabilizo de su ignorancia.
/*Fix jQuery*/


var str=/^http:\/\/www\.taringa\.net\/[a-zA-Z0-9]*\/([seguidores]*|[siguiendo]*)$/g;
var str2=/^http:\/\/www\.taringa\.net\/[a-zA-Z0-9]*\/([seguidores]*|[siguiendo]*)\/[0-9]*$/g;
var txt= str.test(document.location.href);
var txt2= str2.test(document.location.href);
if (txt || txt2){
    $('.perfil-content.box').children('.follow-list').prepend('<div class="btn g mogolicos"><div class="btn-text follow-text"><i class="follow"></i>Seguir Usuarios</div></div>');
    $('.mogolicos').click(function(){
        var Cantidad=$('.not-following').length -1;
        $('.not-following').each(function(I){
		$.ajax({
        	        type:'post',
                	data:{'type':'user','obj':$(this).attr('objid'),'action':'follow'},
                	url:'/notificaciones-ajax.php',
                	success:function(e){
                    		if(Cantidad == I){
					alert('Listo papá!');
                    		}
			}
			
		});
	});
    });
}
