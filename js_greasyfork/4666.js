// ==UserScript==
// @name        jNP tweaks bundle
// @namespace   cz.etnetera.caplygin-michal
// @description save without reload, accesskeys, title
// @include     http://*/edit/*
// @include     https://*/edit/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @version     1.2.1
// @downloadURL https://update.greasyfork.org/scripts/4666/jNP%20tweaks%20bundle.user.js
// @updateURL https://update.greasyfork.org/scripts/4666/jNP%20tweaks%20bundle.meta.js
// ==/UserScript==
/*
TOC ^\s*§.* 

	§ Odvolání transakce: předvybrat checkbox („Víme , co děláme!“) 
	§ focus do hlavího formululáře po načtení
	§ accesskey na odejít, "návrat na seznam položek": Q
	§ submit na pozadí (bez ajaxu), accesskey "S" (nebo jiným, pokud už byl obsazený)
	§ textarea : vypnout zalamování
	§ accesskey pro 'save and close' (D)
	§ zavřít 'ovládací panely' on load (geeeez)
	§ editační linky pro všechny položky v breadcrumbs
	§ označit sebereference
	§ přidat link na vstup DO assetu z editace, i když jinak nemá být browsovatelný
	§ zvýraznit aktuální editovanou položku (v levém menu)
	§ inputy: @name přidat do @title [případně zobrazit skryté] 
	§ držet session co to dá

last-modified (orientačně) 2014-12-18 čtvrtek 15:14:53
*/

;(function (){
// anonymous wrapper; není potřeba (GM skript má vlastní sandbox) ale pro strict mode se hodí
"use strict";

/*
	¶ poor mans' log
*/
function lg(txt) {
//	console.log('JNP editor: ' + txt);
}

/*
	¶ pouze v nejvrchnějším framu
*/
if ( window != top ) {
	lg('terminating; do not run in iframes');
	return
}

/*
//	§ titulek stránky: smysluplnější informace
    %asset_name% (%project_name% @ %site_name%)
*/
;(function()
{	return false // ve vetisu vůbec, zatim vypínám
;	var asset_name = getElsProp('.assetName','title') || ''
;	if ( !asset_name )
	{	var breadcrumbs = document.querySelectorAll('.breadcrumbs a')
	;	if ( breadcrumbs && breadcrumbs.length >= 2 )
		{	asset_name = breadcrumbs[breadcrumbs.length-2].innerHTML // poslední je editace assetu
		}
	} 
;	var project_name = getElsProp('#projectInfo a[href$="$ProjectInfo-changeProject"]')
;	var site_name = getElsProp('#projectInfo a[href$="$ProjectInfo-changeSite"]')
// ;	var main_heading = getElsProp('h1 > span','innerHTML')
;	var title_original = document.title.replace(/ (\| )?jNetPublish/,'')
;	document.title = 
	[	title_original 
	,	' ' 
// 	,	main_heading
// 	,	' '
	,	asset_name 
// 	,	project_name
// 	,	' @ '
	,	site_name ? ' ('+site_name+')' : ''
	].join('')

;	function getElsProp( querySelector, property ) 
	{	property = property || 'innerHTML'
	;	var el = document.querySelector(querySelector)
	;	if ( !el || ('undefined' == typeof el[property]) ) return false
	;	return el[property]
	}
})();

/*
	§ Odvolání transakce: předvybrat checkbox („Víme , co děláme!“) 
*/
;(function()
{	if( -1 == document.URL.indexOf('TransactionListPage-undoTransaction?tid=') ) return
;	var ch = document.querySelector('input[type="checkbox"]')
;	ch.click()
;	ch.focus()
})();

/*
	§ focus do hlavího formululáře po načtení
*/
;(function()
{	"use strict"
;	if( 0 < document.URL.indexOf('newAsset') ) 
	{	document.querySelector('input[name="asset_name"]').focus()
	;	return
	}
;	var cnt = document.getElementsByClassName('master-content')
;	if( !cnt || !cnt.length) return
;	cnt = cnt[0].getElementsByTagName('form')
;	if( !cnt || !cnt.length) return
;	cnt = cnt[0]
;	var i = -1, el
;	while( el = cnt.elements[++i] )
	{	if( el.type != 'hidden' && el.id.indexOf('date') == -1 && el.tagName == 'input' )
		{	el.focus()
		;	break
		}
	}
// ;	console.log(el)
})();

/*
	§ accesskey na odejít, "návrat na seznam položek": Q
*/
;(function()
{	"use strict"
	var tmp = document.querySelector('.last.right > a');
	if( !tmp ) return
	tmp.setAttribute('accesskey','q');
})();

/*
	§ submit na pozadí (bez ajaxu), accesskey "S" (nebo jiným, pokud už byl obsazený)
	hurá, máme svůj focus a neztrácáme undo!
*/
;(function( opts )
{	"use strict"
;	var	i_name = '___artificial_iframe_from_script_'
	,	i_className = 'artificial_iframe_for_background_submitting'
	,	css_block = 'width: 100%; display: block; -moz-box-sizing: border-box; box-sizing: border-box; '
	,	i_style_core = css_block + 'border: 3px solid ThreeDShadow; '
	,	i_style_initial = i_style_core + 'height: 0em; '
	,	i_style_active  = i_style_core + 'height: 8em; '
	,	b_style = css_block
	,	accesskey_buffer = 'submitncakgrond'.split('') // unique characters from 'submit in background'
;	if( 0 == window.name.indexOf(i_name) )
	{	return	false
	}
;	function make_button()
	{	var b = document.createElement('button')
	;	b.type = 'submit'
	;	b.onfocus = b_onfocus
	;	b.onblur = b_onblur
	;	b.onclick = b_onclick
	;	var acc = accesskey_buffer.shift()
	;	b.setAttribute('accesskey',acc)
	;	b.innerHTML = b.orig_html = 'submit in background'.replace(acc,'<u>'+acc+'</u>')
	;	b.style.cssText = b_style
	// hm, rozbije;	b.name = 'action:save' // bez tohodle nefunguje ukládání článků, snad to nerozbije nic jinde
	;	return	b
	}
;	function make_iframe( idx )
	{	var i = document.createElement('iframe')
	;	i.name = i_name + idx
	;	i.className = i_className
	;	i.style.cssText = i_style_initial
// 	;	i.setAttribute('tabindex',-1)
	;	return	i
	}
;	function b_onfocus ()
	{	this.form.target = this.form.artificial_target
	}
;	function b_onblur ()
	{	this.form.target = this.form.original_target
	}
;	function b_onclick ()
	{	this.frame.onload = i_onload
	;	this.frame.style.cssText = i_style_active
	;	this.frame.style.borderColor = 'blue'
	;	this.innerHTML = '[saving]'
// 	;	this.form.submit()
// 	;	return false
	}
;	function i_onload ()
	{	var b = this.button 
	;	b.innerHTML = b.orig_html
	;	this.style.borderColor = 'green'
	;	if( b.form.previousFocused ) b.form.previousFocused.focus()
	}
;	function add_iframe_and_button ( form, idx )
	{	var i = make_iframe( idx )
	;	var b = make_button()
	;	var origSubmit = form.querySelector('#button-SAVE')
	;	b.frame = i
	;	i.button = b
	;	if(origSubmit)
		{	b.name = origSubmit.name || ''
		;	b.value = origSubmit.value || ''
		}
	;	form.appendChild( i )
	;	form.artificial_target = i.name
	;	form.original_target = form.target
	;	form.appendChild( b )
	;	form.appendChild( i )
	;	form.addEventListener
		(	'blur'
		,	function( e )
			{	this.previousFocused = e.target
			}
		,	true
		)
	}
;	function should_be_background_submitable ( f )
	{	return	opts.form_checker
				?	opts.form_checker( f )
				:	true
	}
;	var	fi = -1
	,	f
;	while( f = document.forms[++fi] )
	{	if( false == should_be_background_submitable( f ) )
			continue
	;	add_iframe_and_button( f, fi )
	}
})
(	{	form_checker
		:	function( f )
			{	// pokud form obsahuje textareu nebo více textových inputů,
				// bude nejspíš stát za to mít možnost submitovat ho bokem
				return f.getElementsByTagName('textarea').length 
				|| 1 < f.querySelectorAll('input[type="text"],input:not([type])').length
			//	případně je možné konrolovat name nebo cokoli
 			;	return	/^(editorForm|(layoutDefinitionRules|asset(Template)?)Editor)$/
 						.test( f.name )
			}
	}
);

/*
	§ textarea : vypnout zalamování
*/
;(function()
{	"use strict"
;	var tas = document.getElementsByTagName('textarea')
	,	ta
	,	i = -1
;	while( ta = tas[++i] )
	{	ta.setAttribute('wrap','off');
	;	// hurá, už není potřeba je vyndavat a zandavat v DOMu, weee!1!
	}
})();


/*
	§ accesskey pro 'save and close' (D)
*/
;(function()
{	var sc = document.querySelector('input[name="saveandclose"]')
;	if( !sc ) return
;	sc.title = 'accsesskey: d'
;	sc.setAttribute('accesskey','d')
;	// @todo: zviditelnit, pokud možno bez závislosti na accesskeys-reveal.user.js
})();


/*
	§ zavřít 'ovládací panely' on load (geeeez)
		(jsou přestylované do panelu, tak by zavázely)
*/
;(function()
{	var fň = document.querySelector('[class*="collapse"][onclick*="toggleDockContents"][onclick*="controlPanel"]')
;	if( fň ) fň.click() 
})();


/*
	§ editační linky pro všechny položky v breadcrumbs
*/
;(function()
{	"use strict"
;	var lnks = Array.prototype.slice.call(
		document.querySelectorAll('.breadcrumbs a[href*=selectSection],.bread a[href*=selectSection]')
	)
;	var picHTML
;	var pic = document.querySelector('a[href*="EditorPage-init"] > img:only-child')
;	if( pic ) 
	{	picHTML = pic.parentNode.innerHTML
	} else 
	{	picHTML = '<img alt="[edit]" src="../images/icons/actions/edit-16.png" onerror="this.src=\'../images/edit-small.gif\';this.onerror=\'\'" onload="this.removeAttribute(\'alt\');">'
	}
;	var li = -1, lnk, edhref
;	while( lnk = lnks[++li] )
	{	var sectId = lnk.href.match(/sectionId=(\d+)/)[1]
	;	var edhref = lnk.href.replace(/\/edit\/.*?\?sectionId=(\d+).*/,'/edit/EditorPage-init?assetId=$1')
	;	if( document.querySelector('[class*=bread] a[href*="assetId='+sectId+'"]') )
			continue // ten link už tu je, tak neduplikovat
	;	var edlnk = lnk.cloneNode( true )
	;	edlnk.innerHTML = picHTML
	;	edlnk.setAttribute
		(	'href'
		,	edhref
		)
	;	lnk.parentNode.insertBefore(edlnk,lnk.nextSibling) 
	}
})();

/*
	§ označit sebereference
	§ přidat link na vstup DO assetu z editace, i když jinak nemá být browsovatelný
	hodí se zejména pro arrangementy a články s doplňky
	§ zvýraznit aktuální editovanou položku (všude)
	TODO: (VETIS) `poslední zobrazené` pamatovat na klientu a zobrazovat 
*/
;(function()
{	var edited = document.querySelector('input[name="assetId"]')
;	var assetID
;	var assetIDrgx
;	if( edited )
	{	assetID = edited.value
	} else
	{	edited = document.querySelector('h1 small') // VETIS
	;	if( !edited ) edited = document.querySelector('#edited-asset-header small') // LIMOS
	;	if ( edited )
		{	assetIDrgx = /^#(\d+)$/
		;	if( assetIDrgx.test(edited.innerHTML) )
			{	assetID = edited.innerHTML.match(assetIDrgx)[1]
			}   
		}
	}
;	if( !assetID )
		return
;	var selector = 'input[value="' + assetID + '"]'
;	var inps = document.querySelectorAll( 'table.list ' + selector )
;	var i = -1, inp, row
;	while( inp = inps[++i] )
	{	row = inp.parentNode
	;	while( row.tagName != 'TR' ) { row = row.parentNode } 
	;	row.className += ' self_referrence'
	}
//	.../edit/EditorPage-init?assetId=240274
;	var btns = document.querySelectorAll( 'a[href$="EditorPage-init?assetId='+ assetID +'"]' ), btn, i = -1
;	while( btn = btns[++i] )
	{	btn.className += ' self_referrence'
	}
;	if( document.querySelector('.breadcrumbs a[href*="sectionId='+assetID+'"]') )
		return
;	var some_link = document.querySelector('.breadcrumbs a[href*="sectionId="]')
;	var this_url = some_link.href.replace(/sectionId=\d+/,'sectionId='+assetID)
;	var brc = document.querySelector('.breadcrumbs')
;	brc.appendChild( document.createTextNode(' » ') )
;	var a_in = brc.appendChild( some_link.cloneNode() ) // link
;	a_in.href = this_url
;	a_in.style.fontSize = '0.8em'
;	var assetName = document.querySelector('.assetName')
;	assetName = assetName ? assetName.title : '(inside)'
;	a_in.innerHTML = assetName
// ;	var s = document.createElement('style')
// ;	s.innerHTML = selector + '{background-color: #ff9 !important;}'
// ;	document.body.appendChild( s )
})();

/*
	§ inputy: @name přidat do @title [případně zobrazit skryté] 
	hlavně pro `asset_type` a `content_variant` inputy
*/
;(function()
{	"use strict"
;	if(0) return
;	var inps = document.querySelectorAll('input,button,select,textarea')
	,	i = -1
	,	inp
;	while(inp = inps[++i]){
		if (inp.title) inp.title += ' | name: '
		inp.title += inp.name;
		if( inp.type == 'hidden') {
// 			inp.type = 'text';
// 			inp.classList.add('hidden_input');
		} else if ( inp.type == 'button' || inp.type == 'radio') {
			inp.title += ' = ' + inp.value;
			if ( inp.onclick ) inp.title += ', ' + inp.onclick 
		}
	}
})();

/*
	§ držet session co to dá
	(polling na stránku s verzí. prasárna, ale což.)
*/
;(function()
{	"use strict"
;	var edit_url_rx = /\/edit\/.*/
;	var current_url = document.URL
;	if( false == edit_url_rx.test(current_url) ) return
	// je to sice i v @include tohodle GM scriptu, ale pro sichr a portabilitu
;	var ping_interval_ms = 1000 * 60 * 2 
	// session timeout pod dvě minuty snad nikde nebude (?) 
;	var ping_url = current_url.replace( edit_url_rx, '/edit/VersionPage')
	// otázka, jaké URL prodlužuje session a není výkonnostně náročné
	// bude zároveň klíčem GM_getValue timestampu posledního pingu
;	var ping_pic = document.createElement('img')
;	ping_pic.style.display = 'none'
	// prohlížeč si na bude sahat, i když takhle není vidět
	// src ale dostne až po prvním intervalu: hned po načtení stránky by to nemělo smysl (session je čerstvá)
;	ping_pic.setAttribute
	(	'data-info'
	,	'GM scriptem injektovaný pic na udržení session: v intervalu '
		+ ( ping_interval_ms / 1000 / 60 ) 
		+ ' min se (pře)nastaví src na `'
		+ ping_url
		+ '` (pokud se session neprodloužila jinde).'
	)
;	document.body.appendChild(ping_pic)
;	var interval_id = window.setInterval( ping, ping_interval_ms )
	// tj první ping se zkusí "až za chvíli", pokud se "před chvílí" už nějaký (jinde) nepustil 
;	GM_setValue(ping_url, now_timestamp())
;	function now_timestamp(){
		return new Date().getTime()
	}
;	function ping()
	{	var now = now_timestamp()
	;	var last_ping = GM_getValue( ping_url, 0 )
	;	if( now - last_ping >= ping_interval_ms )
		{	ping_pic.src = ping_url 
			// je to tak. přiřazení toho samého URL taky MÁ odeslat request
			// (kdyby to přestalo fungovat, timestampovat a omluvit se cachím) 
		;	GM_setValue(ping_url, now)
		;	console.info('pinged')
		} else {
		;	console.info('not gonna ping')
		}
	// …aby si při více tabech na stejné doméně nepingalo zbytečně často
	// tj z jednoho *browseru*
	// se na jednu *doménu*
	// bude pingat *maximálně jednou za interval*
	// a nikdy častěji  
	}
})();




})(); // anon wrapper
// EOF