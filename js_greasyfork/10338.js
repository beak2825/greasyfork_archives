// ==UserScript==
// @id             hhFiller
// @name           hhFiller
// @name:ru        hhFiller
// @version        12.2020.8.4
// @namespace      spmbt.github.io/spmbt
// @author         spmbt
// @description    Fill response post for vacation in hh.ru by template
// @description:ru Заполнить отклик на вакансию на hh.ru|moikrug|itmozg|superjob с помощью шаблона
// @include        http://hh.ru/*
// @include        https://hh.ru/*
// @include        https://moikrug.ru/*
// @include        https://itmozg.ru/*
// @include        https://www.superjob.ru/*
// @run-at         document-end
// @update 12 hh.ru
// @update 8 https-hh.ru;
// @update 7 itmozg.ru,superjob.ru added;
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/10338/hhFiller.user.js
// @updateURL https://update.greasyfork.org/scripts/10338/hhFiller.meta.js
// ==/UserScript==
(function(win, u, noConsole, letterTmpl, addTmpl){
if(win != top) return; //не выполнять в фрейме

var site = ({'hh.ru':'hh', 'career.ru':'hh', 'moikrug.ru':'moikrug', 'itmozg.ru':'itmozg', 'www.superjob.ru':'superjob'})[location.host]; //сайт, определяющий способ и правила публикации

var $e = function(g){ //===создать или использовать имеющийся элемент DOM===
//g={el,blck,elA,cl,ht,cs,at,on,apT,prT,bef,aft}
	if(typeof g.el =='function') g.el = g.el.apply(g, g.elA);
	if(!g.el && g.el !==undefined && g.el !='') return g.el; //null|0|false
	var o = g.el = g.el ||'DIV';
	o = g.el = typeof o =='string'? /\W/.test(o) ? $q(o, g.blck) : win.document.createElement(o) : o;
	if(o){ //выполнять, если существует el
		if(g.cl)
			o.className = g.cl;
		if(g.cs)
			$x(o.style, g.cs);
		if(g.ht || g.at){
			var at = g.at ||{}; if(g.ht) at.innerHTML = g.ht;}
		if(at)
			for(var i in at){
				if(i=='innerHTML') o[i] = at[i];
				else o.setAttribute(i, at[i]);}
		if(g.on)
			for(var i in g.on) if(g.on[i])
				o.addEventListener(i, g.on[i],!1);
		g.apT && g.apT.appendChild(o);
		g.prT && (g.prT.firstChild
			? g.prT.insertBefore(o, g.prT.firstChild)
			: g.prT.appendChild(o) );
		g.bef && g.bef.parentNode.insertBefore(o, g.bef);
		g.aft && (g.aft.nextSibling
			? g.aft.parentNode.insertBefore(o, g.aft.nextSibling)
			: g.aft.parentNode.appendChild(o) );
	}
	return o;
}
,$q = function(q, f){ return (f||win.document).querySelector(q);}
,$x = function(el, h){if(h) for(var i in h) el[i] = h[i]; return el;} //===extend===
,$qA = function(q, f){ return (f||win.document).querySelectorAll(q);}
,wcl = function(a){ a = a!==undefined ? a :''; //вывод в консоль (для тестов), с отключением по noConsole ==1
	if(win.console && !noConsole)
		win.console.log.apply(win.console, this instanceof String
			? ["'=="+ this +"'"].concat([].slice.call(arguments))
			: arguments);
}
	/** периодическая проверка условия с увеличением интервала
	 * @constructor
	 * @param{Number} t start period of check
	 * @param{Number} i number of checks
	 * @param{Number} m multiplier of period increment
	 * @param{Function} check event condition
	 * @param{Function} occur event handler
	 */
,Tout = function(h){
	var th = this;
	(function(){
		if((h.dat = h.check() )) //wait of positive result, then occcurense
			h.occur && h.occur();
		else if(h.i-- >0) //next slower step
			th.ww = win.setTimeout(arguments.callee, (h.t *= h.m) );
	})();
}
,resuH =180 //высота списка резюме (hh)
,hhLenLast =0 //число всех копий поля ввода (специфично для hh)
,selMod ='', selModPrev = selMod
,selCopy = function(){ //выделенный текст
	var sel ='';
	if(sel = win.getSelection() +''){
		sel = (sel +'\r\n').replace(/[;.,]\s+(\r?\n)/g,'\r\n').replace(/\r?\n\r?\n/g,'\r\n')
			.replace(/([^\r\n])(\r?\n)/g,'$1 ==да;$2')
			.replace(/(\r?[\n:])\s+==да;/g,'$1');
	};
	return sel;
}, selC, selS;
String.prototype.wcl = wcl; //(для вывода в консоль)

// по нажатию кнопки ответа на вакансию - скопировать выделенный текст (с обработкой):
$e({el:'.HH-VacancyResponsePopup-MainButton', on:{mousedown: selC = function(ev){
	selMod = selCopy(); //'selMod'.wcl(selMod)
}}});
$e({el:'.HH-VacancyResponsePopup-Link', on:{mousedown: selC}});
$e({el:'.HH-VacancyResponsePopup-TopicButton', on:{mousedown: selC}});
$pismo = $q('.HH-Negotiations-Conversation-NewMessage');
var fillTarea = function(){
	if(!selMod){
		selMod = localStorage.lastSel;
		selMod && (localStorage.lastSel ='');
	}
	return (localStorage.tmpl || letterTmpl).replace(/\n?$/,'\n') + (selMod && (addTmpl + selMod)||'');
};
if($pismo)
  $pismo.innerHTML = fillTarea();
if(site =='moikrug') //предлагать подмену ответов при каждом выделении текста
	$e({el:'.job_show_description', on:{mouseup: function(ev){
		var ta = $q('#vacancy_response_body');
		if((selMod = selCopy()) && ta && win.confirm(
				'Обновить область ответов на требования новым выделенным текстом?\n(Все изменения в старом тексте пропадут.)')){
			if(!RegExp(addTmpl).test(ta.value))
				ta.value = ta.value + addTmpl;
			ta.value = ta.value.replace(RegExp('('+addTmpl.replace(/\r/g,'\\\r?').replace(/\n/g,'\\\n') +')([\\s\\S]*)'),'$1') + selMod;
			win.setTimeout(function(){ta.style.height = ta.scrollHeight +'px';},0);
			ta.style.maxHeight ='none';
		}
	}}});
if(site =='superjob') //предлагать подмену ответов при каждом выделении текста
	$e({el:'.VacancyView_details', on:{mouseup: function(ev){
		var ta = $q('.VacancyView_body .VacancySendResumeButton_popup .VacancySendResumeButton_message_textarea');
		if((selMod = selCopy()) && ta && win.confirm(
				'Обновить область ответов на требования новым выделенным текстом?\n(Все изменения в старом тексте пропадут.)')){
			if(!RegExp(addTmpl).test(ta.value))
				ta.value = ta.value + addTmpl;
			ta.value = ta.value.replace(RegExp('('+addTmpl.replace(/\r/g,'\\\r?').replace(/\n/g,'\\\n') +')([\\s\\S]*)'),'$1') + selMod;
			win.setTimeout(function(){ta.style.height = ta.scrollHeight +'px';},0);
			ta.style.maxHeight ='none';
		}
	}}});
$vacaBrand = $q('.vacancy-branded-user-content');
if(/^hh$|itmozg/.test(site)){ //сохранять выделенное
	$e({el: /itmozg/.test(site)?'.margin-bottom-50':'.vacancy-section '+(!$vacaBrand?'.g-user-content':'.vacancy-branded-user-content'),
      on:{mouseup: selS = function(ev){
		if(selMod = selCopy()) //сохранить непустое выделение на случай перехода через "тестовую страницу"
			localStorage.lastSel = selMod; // ...или просто на новую страницу для itmzog
	}}});
	$e({el:'.respond.button.mt-30', on:{mouseup: selS}});
}
if(!localStorage.tmpl && /^Ув\. соискатель/.test(letterTmpl)){ //начальное заполнение шаблона
	//диалог сохранения в localStorage шаблона письма
	//wcl('taTmplBack')
	$e({el: $q('.taTmplBack')||0 //-чтобы создать не более 1 раза
		,cl:'taTmplBack'
		,cs:{position:'fixed', zIndex: 99991, width:'100%', height:'100%', top: 0, background:'rgba(48,48,48,0.4)'}
		,apT: win.document.body
	});
	$e({el: $q('.taTmplOver')||0
		,cl:'taTmplOver'
		,cs:{position:'fixed', zIndex: 99992, width:'98%', height:'80%', margin:'0 1%', top:'12px'}
		,ht:'<div style="width:100%; height:100%; text-align: left; background:rgba(255,255,255,0.5)">'
			+'<div style="display: inline-block; padding: 0 20px; border-bottom: 2px dotted #000; font-size:16px; background:rgba(255,255,255,0.5); color:#333">'
				+'Сообщение от скрипта <a href="https://greasyfork.org/en/scripts/10338-hhfiller" target=_blank><b>hhfiller.user.js</b></a></div>'
			+'<div style="padding: 4px 0; text-align: center; font-size:24px; background:rgba(255,255,255,0.5); color:#777">'+ letterTmpl +'</div>'
			+'<textarea class="taTmpl" style="width:80%; height:80%; margin: 10px 10%;"></textarea><br>'
			+'<div style="text-align: center">'
				+'<button onclick="var d = document, taS = d.querySelectorAll(\'.taTmpl\'), ta = taS[taS.length -1];'
					+'ta && (localStorage.tmpl = ta.value); d.querySelector(\'.taTmplBack\').style.display '
					+'= d.querySelector(\'.taTmplOver\').style.display =\'none\';" style="font-size: 24px">Сохранить</button></div>'
			+'<div style="width:79%; margin: 10px 10%; padding: 10px; font-size:16px; background:rgba(255,255,255,0.5); color:#333">Этот текст будет появляться в поле ответа'
					+ (({hh:' по кнопке "Откликнуться на вакансию"',moikrug:''})[site]||'') +'.<br>'
				+'<a href="http://habrahabr.ru/post/259881/" target=_blank>Подробности</a> <i>(статья о скрипте)</i>.<br>'
				+'Чтобы записать другой шаблон, сотрите прежний командой "localStorage.tmpl=\'\'" в консоли.<br>'
				+'Чтобы <i>отказаться</i> от использования шаблона, отключите скрипт hhFiller в настройках браузера.</div>'
		+'</div>'
		,apT: win.document.body
	});
}

var taChanged =0;
new Tout({t:620, i:2e6, m: 1 //периодическая проверка наличия поля ввода на странице
	,check: ({
		hh: function(){
			var tAreas = $qA('.vacancy-response-popup .bloko-textarea')
				,tLast;
			if(tAreas.length && (!(tLast = tAreas[tAreas.length -1]).value
					|| hhLenLast < tAreas.length && selModPrev != selMod) ){ //если пустое поле ввода - заполнить шаблоном
				if(!tLast.value)
					tLast.value = fillTarea();
				if(selModPrev != selMod){
					if(!RegExp(addTmpl).test(tLast.value))
						tLast.value = tLast.value + addTmpl ;
					tLast.value = tLast.value.replace(RegExp('('+addTmpl.replace(/\r/g,'\\\r?').replace(/\n/g,'\\\n') +')([\\s\\S]*)'),selMod ?'$1':'') + selMod;
				}
				hhLenLast = tAreas.length;
				selModPrev = selMod;
			}
			$e({el: tLast, cs:{height: Math.max(400, win.innerHeight - 220 //растянуть поле ввода для удобства
				- (resuH = ($q('.vacancy-response-popup__resumes')||{}).offsetHeight||resuH)) +'px'}});
			var elTa = $qA('.bloko-toggle__expandable');
			$e({el: elTa.length && elTa[elTa.length -1], cs:{display:'block'}}); //показать свёрнутое поле ввода
			$e({el: '.popup.g-anim-fade.g-anim-fade_in', cs:{top:0}});
			return 0;
		}
		,moikrug: function(){
			var ta = $q('#vacancy_response_body');
			if(ta && !ta.value){
				ta.value = fillTarea();
				win.setTimeout(function(){ta.style.height = ta.scrollHeight +'px';},0); //подправить высоту поля
				ta.style.maxHeight ='none';
			}
			return 0;
		}	
		,superjob: function(){
			var ta = $q('.VacancyView_body .VacancySendResumeButton_popup .VacancySendResumeButton_message_textarea')
				,txt = ($q('.VacancySendResumeContacts_txt span')||{}).innerHTML||'';
			if(ta && !taChanged){
				ta.value = fillTarea().replace(/(Здравствуйте)(!)/,'$1, '+ txt +'$2');
				win.setTimeout(function(){ta.style.height = ta.scrollHeight +'px'; taChanged = 1;},900); //подправить высоту поля
				ta.style.maxHeight ='none';
			}
			return 0;
		}
		,itmozg: function(){
			var ta = $q('#applyForm #text');
			if(ta && !ta.value){
				ta.value = fillTarea();
				win.setTimeout(function(){ta.style.height = ta.scrollHeight +'px';},0); //подправить высоту поля
				ta.style.maxHeight ='none';
			}
			($qA('#resume option')||[{},{}])[1].selected =1; //выбрать первое резюме по списку
			return 0;
		}
})[site]});
(function(css){ //addRules
	if(typeof GM_addStyle !=u) GM_addStyle(css); //Fx,Chr (old)
	else if(typeof addStyle !=u) addStyle(css);
	else //Op and all
		$e({el:'style', apT: $q('head') }).appendChild(document.createTextNode(css)); //не проходит в Опере через $e
})
('.search-result-item__label:not(.g-hidden) +.search-result-description{background-color:#eee}'
+'.search-result-item__label:not(.g-hidden) +.search-result-description .search-result-description__item_primary{margin-bottom:-6px; padding-bottom: 6px;}'
+'div[class*="banner-place"], div[id*="mt_ot"], .b-mainbanner, .related-vacancies-preview{display:none}'
+'.VacancyView_body .VacancySendResumeButton_popup{display:block!important}'
+'.VacancyView_body .VacancySendResumeButton_message, .VacancyView_body .VacancySendResumeButton_message_textarea_bg{height:auto;}'
+'.vacancy-section .bloko-column:nth-child(2){height: 60vh;overflow-y: auto;border-bottom: 1px solid #ccc;box-shadow: 0 4px 6px 4px #ccc;}'
+'@media(min-width:1020px){.main-content .bloko-columns-wrapper .row-content{padding-bottom: 0}}.vacancy-noprint .vacancy-section{margin: 10px 0 0}'
+'.HH-Negotiations-Conversation-NewMessage{width: 900px; height: 540px}');

})(top,'undefined',''
	//Вместо этой строки можно вставить свой шаблон письма.
	//Его же можно сохранить в localStorage в диалоге по запросу скрипта.
	//(Используйте "\n" для перевода текста на новую строку.)
	,'Ув. соискатель! Пожалуйста, заполните это поле шаблоном ответа на вакансию, с учётом ваших индивидуальных качеств.',
'===================================\r\n\
Ответы по вакансии:\r\n');
