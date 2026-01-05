// ==UserScript==
// @name        [deprecated] muahahaha tusubtitulo/subswiki
// @namespace   muahahaha
// @include     http://www.tusubtitulo.com/show/*
// @include     http://www.tusubtitulo.com/serie/*
// @include     http://www.tusubtitulo.com/season/*
// @include     https://www.tusubtitulo.com/show/*
// @include     https://www.tusubtitulo.com/serie/*
// @include     https://www.tusubtitulo.com/season/*
// @include     http://www.subswiki.com/show/*
// @include     http://www.subswiki.com/serie/*
// @include     http://www.subswiki.com/season/*
// @version     1.8.1
// @grant       GM_addStyle
// @run-at      document-end
// @description tusubtitulo/subswiki es-es o es-lat
// @downloadURL https://update.greasyfork.org/scripts/12988/%5Bdeprecated%5D%20muahahaha%20tusubtitulosubswiki.user.js
// @updateURL https://update.greasyfork.org/scripts/12988/%5Bdeprecated%5D%20muahahaha%20tusubtitulosubswiki.meta.js
// ==/UserScript==
var parametrizacion={
	tipo_parte_url:3
	,tipo_parte_url_valor_s:'show'
	,tipo_parte_url_valor_t:'season'
	,tipo_parte_url_valor_c:'serie'
	,nombre_script:'muahahaha_tusubtitulo'
	,serie_parte_url:4
	,patron_url:/[^a-z0-9]/g
	,selector_ul:null
	,caja_agregada:null
	,caja_contenedora:null
	,selector_li:null
	,estilo_resaltado_a_before:'content:\'[\';'
	,estilo_resaltado_a:'font-weight:bolder;'
	,estilo_resaltado_a_after:'content:\']\';'
	,estilo_resaltado_li:'background:chucknorris;background:#c00000;'
	,valores_validos:['nd','ES','LAT']
	,etiquetas:{'Español (España)':'ES','Español (Latinoamérica)':'LAT'}
	,selector_listado:'#episodes'
	,selector_listado_x:'td.language'
	,alert_reload_off:'Volvio '
};
if(location.hostname==='www.subswiki.com'){
	parametrizacion.selector_ul='table tbody';
	parametrizacion.caja_agregada=document.createElement('tr');
	parametrizacion.caja_contenedora=parametrizacion.caja_agregada.appendChild(
		document.createElement('td')
	);
	parametrizacion.caja_contenedora.setAttribute('colspan','3');
	parametrizacion.caja_contenedora.setAttribute('align','right');
	parametrizacion.selector_li='td.language';
}
else/*if(location.hostname==='www.tusubtitulo.com')*/{
	parametrizacion.selector_ul='ul.navi';
	parametrizacion.caja_agregada=document.createElement('li');
	parametrizacion.caja_contenedora=parametrizacion.caja_agregada;
	parametrizacion.selector_li='li.li-idioma';
}
/*fin parametrizacion*/
function arrancar1(){
	var ls=location.href.split('/');
	if(location.hostname==='www.tusubtitulo.com'&&document.title===''){
		localStorage.setItem(parametrizacion.nombre_script,'reload');
		document.body.innerHTML+='<br><br>'+(new Date());
		setTimeout(function(){location.reload();},360000);
	}
	else if(
		localStorage.getItem(parametrizacion.nombre_script)==='reload'
	){
		localStorage.removeItem(parametrizacion.nombre_script);
		alert(parametrizacion.alert_reload_off+location.hostname);
		location.reload();
	}
	else if(
		ls[parametrizacion.tipo_parte_url]===parametrizacion.tipo_parte_url_valor_s
		||ls[parametrizacion.tipo_parte_url]===parametrizacion.tipo_parte_url_valor_t
	){
		var x1=document.querySelector(parametrizacion.selector_listado+' a[href*="'+ls.slice(
			1,parametrizacion.tipo_parte_url).join('/')+'/'+parametrizacion.tipo_parte_url_valor_c+'/"]');
		if(x1){
			ls=x1.href.split('/');
			arrancar2(ls);
		}
		else{
			setTimeout(function(){arrancar1();},1000);
		}
	}
	else/*if(ls[parametrizacion.tipo_parte_url]===parametrizacion.tipo_parte_url_valor_c)*/{
		arrancar2(ls);
	}
}
function arrancar2($ls){
	var serie_actual=unescape($ls[parametrizacion.serie_parte_url]
	).toLocaleLowerCase().replace(parametrizacion.patron_url,'');
	var valor_actual=localStorage.getItem(parametrizacion.nombre_script+'_'+serie_actual);
	if(parametrizacion.valores_validos.indexOf(valor_actual)===-1){valor_actual=parametrizacion.valores_validos[0];}
	var estilo='';
	for(var i=1;i<parametrizacion.valores_validos.length;i++){
		estilo+=',body[data-'+parametrizacion.nombre_script+'="'+parametrizacion.valores_validos[i]+'"]';
		estilo+=' '+parametrizacion.selector_li+'[data-'+parametrizacion.nombre_script+'="'+parametrizacion.valores_validos[i]+'"]';
		estilo+=',body[data-'+parametrizacion.nombre_script+'="'+parametrizacion.valores_validos[i]+'"]';
		estilo+=' '+parametrizacion.selector_listado_x+'[data-'+parametrizacion.nombre_script+'="'+parametrizacion.valores_validos[i]+'"]';
	}delete(i);
	estilo=estilo.substr(1)+'{'+parametrizacion.estilo_resaltado_li+'}';
	GM_addStyle('*[data-script="'+parametrizacion.nombre_script+'"]{'+parametrizacion.estilo_resaltado_a+'}');
	GM_addStyle('*[data-script="'+parametrizacion.nombre_script+'"]::before{'+parametrizacion.estilo_resaltado_a_before+'}');
	GM_addStyle('*[data-script="'+parametrizacion.nombre_script+'"]::after{'+parametrizacion.estilo_resaltado_a_after+'}');
	GM_addStyle(estilo);
	document.body.dataset[parametrizacion.nombre_script]=valor_actual;
	[].slice.call(document.querySelectorAll(parametrizacion.selector_li)).forEach(function(v){
		if(parametrizacion.etiquetas[v.textContent.trim()]){
			v.dataset[parametrizacion.nombre_script]=parametrizacion.etiquetas[v.textContent.trim()];
		}
	});
	[].slice.call(document.querySelectorAll(parametrizacion.selector_listado_x)).forEach(function(v){
		if(parametrizacion.etiquetas[v.textContent.trim()]){
			v.dataset[parametrizacion.nombre_script]=parametrizacion.etiquetas[v.textContent.trim()];
		}
	});
	document.querySelector(parametrizacion.selector_ul).appendChild(parametrizacion.caja_agregada);
	var boton=parametrizacion.caja_contenedora.appendChild(document.createElement('a'));
	boton.href='#';
	boton.dataset.script=parametrizacion.nombre_script;
	boton.dataset.variable=parametrizacion.nombre_script+'_'+serie_actual;
	boton.dataset.valores=parametrizacion.valores_validos.join(' ');
	boton.dataset.valor=valor_actual;
	boton.appendChild(document.createTextNode(valor_actual));
	boton.onclick=function(){
		var valor=this.textContent;
		var valores=this.dataset.valores.split(' ');
		valores=valores.concat(valores[0]);
		valor=valores[1+valores.indexOf(valor)];
		if(valor===valores[0]){
			localStorage.removeItem(this.dataset.variable);
		}
		else{
			localStorage.setItem(this.dataset.variable,valor);
		}
		this.innerHTML=valor;
		this.dataset.valor=valor;
		document.body.dataset[this.dataset.script]=valor;
		return false;
	};
}
unsafeWindow.parametrizacion=parametrizacion;
unsafeWindow.arrancar1=arrancar1;
unsafeWindow.arrancar2=arrancar2;
arrancar1();
