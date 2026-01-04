// ==UserScript==
// @name           hwm_transfer_arts
// @author         heroeswm
// @namespace      heroeswm
// @description     передать арты из инвентаря сразу кучей)))
// @version        4.0
// @encoding 	   utf-8
// @include        http://178.248.235.15/inventory.php*
// @include        https://www.heroeswm.ru/inventory.php*
// @include        https://www.lordswm.com/inventory.php*
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_log
// @grant          GM_openInTab
// @grant          GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459016/hwm_transfer_arts.user.js
// @updateURL https://update.greasyfork.org/scripts/459016/hwm_transfer_arts.meta.js
// ==/UserScript==

// (c) 2022, Гроза_ГВД
// (c) 2015-2018, other
// (c) 2011-2015, demin
// (c) 2010, xo4yxa

(function() {

var version = '4.00';


if (typeof GM_getValue != 'function') {
	this.GM_getValue=function (key,def) {return localStorage[key] || def;};
	this.GM_setValue=function (key,value) {return localStorage[key]=value;};
	this.GM_deleteValue=function (key) {return delete localStorage[key];};
}


var url_cur = location.href;
var url = location.protocol+'//'+location.hostname+'/';

if (typeof GM_xmlhttpRequest != 'function') {
		this.GM_xmlhttpRequest=function (details) {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function() {
				var responseState = {
					responseXML:(xmlhttp.readyState==4 ? xmlhttp.responseXML : ''),
					responseText:(xmlhttp.readyState==4 ? xmlhttp.responseText : ''),
					readyState:xmlhttp.readyState,
					responseHeaders:(xmlhttp.readyState==4 ? xmlhttp.getAllResponseHeaders() : ''),
					status:(xmlhttp.readyState==4 ? xmlhttp.status : 0),
					statusText:(xmlhttp.readyState==4 ? xmlhttp.statusText : '')
				}
				if (details["onreadystatechange"]) {
					details["onreadystatechange"](responseState);
				}
				if (xmlhttp.readyState==4) {
					if (details["onload"] && xmlhttp.status>=200 && xmlhttp.status<300) {
						details["onload"](responseState);
					}
					if (details["onerror"] && (xmlhttp.status<200 || xmlhttp.status>=300)) {
						details["onerror"](responseState);
					}
				}
			}
			try {
			  //cannot do cross domain
			  xmlhttp.open(details.method, details.url);
			} catch(e) {
			  if( details["onerror"] ) {
				//simulate a real error
				details["onerror"]({responseXML:'',responseText:'',readyState:4,responseHeaders:'',status:403,statusText:'Forbidden'});
			  }
			  return;
			}
			if (details.headers) {
				for (var prop in details.headers) {
					xmlhttp.setRequestHeader(prop, details.headers[prop]);
				}
			}
			xmlhttp.send((typeof(details.data)!='undefined')?details.data:null);
		}
}

dressid_regexp = /art_id=(\d+)/
transed_regexp = /art_transfer.php\?id=(\d+)/
returned_regexp = /inventory.php\?art_return=(\d+)/
prochka_regexp = ( url.match('lordswm') ? /<li>Durability: (\d+)\/(\d+)/ : /<li>\u041f\u0440\u043e\u0447\u043d\u043ec\u0442\u044c: (\d+)\/(\d+)/ );
prochka_regexp2 = ( url.match('lordswm') ? /<li>Durability: <font color="red">(\d+)<\/font>\/(\d+)/ : /<li>\u041f\u0440\u043e\u0447\u043d\u043ec\u0442\u044c: <font color="red">(\d+)<\/font>\/(\d+)/ );

	var trans=[];
	var snart=[];
	for(var i=0x410;i<=0x44F;i++)
	{
		trans[i]=i-0x350;
		snart[i-0x350] = i;
	}
	trans[0x401]= 0xA8;
	trans[0x451]= 0xB8;
	snart[0xA8] = 0x401;
	snart[0xB8] = 0x451;

	urlencode = function(str)
	{
		var ret=[];
		for(var i=0;i<str.length;i++)
		{
			var n=str.charCodeAt(i);
			if(typeof trans[n]!='undefined')
			n = trans[n];
			if (n <= 0xFF)
			ret.push(n);
		}

		return escape(String.fromCharCode.apply(null,ret));
	}

	urldecode = function(str)
	{
		var ret=[];
		str = unescape(str);
		for(var i=0;i<str.length;i++)
		{
			var n=str.charCodeAt(i);
			if(typeof snart[n]!='undefined')
			n = snart[n];
			ret.push(n);
		}
		return String.fromCharCode.apply(null,ret);
	}

	var scripts = document.querySelectorAll("script");
	var sign;
	for ( var i=scripts.length; i--; ) {
		sign = /sign=([a-z0-9]+)/.exec( scripts[i].innerHTML );
		if ( sign ) {
			sign = sign[1];
			break;
		}
	}

	var trade_a = getI( "//a[contains(@href, 'trade_cancel.php')]" ).snapshotItem(0) ;
	if( trade_a )
	{
		trade_tr = document.createElement( 'tr' )
		trade_td = document.createElement( 'td' )
		trade_td.setAttribute( "colspan" , 2 ) ;
		trade_td.setAttribute( "align" , "right" ) ;
		trade_td.innerHTML = '<a href="javascript:void(0);" id="trade_cancel"><b>\u041e\u0442\u043c\u0435\u043d\u0438\u0442\u044c \u0412\u0441\u0435</b>'
		trade_tr.appendChild( trade_td )
		trade_a.parentNode.parentNode.parentNode.parentNode.appendChild( trade_tr )
		$("trade_cancel").addEventListener( "click", trade_cancel , false );
	}

	// var kukla_tbl = getI( "//table[contains(@background, 'i/kukla')]" ).snapshotItem(0) ;
	var seperator = document.getElementsByClassName('inv_separator3')[0];
	if( seperator )
	{
		//o1 = kukla_tbl.parentNode.parentNode.parentNode ;

		tr = document.createElement( 'tr' );
		td = document.createElement( 'td' );
		td.className = 'wb' ;
		td.setAttribute( 'colspan' , 2 ) ;
		td.setAttribute( 'align' , 'center' ) ;
		td.setAttribute( 'width' , '1%' ) ;

		var btsend = '' ;
		if( GM_getValue( "setbtsend" ) && GM_getValue( "setbtsend" ) == 1 )
		{
			btsend = '<input type="submit" id="trans_send" style="font-size: 14px;padding: 0;" value="\u041f\u0435\u0440\u0435\u0434\u0430\u0442\u044c" title="\u041f\u0435\u0440\u0435\u0434\u0430\u0442\u044c \u0432 \u0440\u0430\u0441\u043f\u043e\u0440\u044f\u0436\u0435\u043d\u0438\u0435 \u0437\u0430 1 \u0437\u043e\u043b\u043e\u0442\u043e\u0439"> '
		}

		td.innerHTML = '<style>#thistf A{text-decoration:none;font-size:10px;} #thistf A:hover{color:#00f;}</style><table style="display: contents;" width="100%"><form action="" method="POST" onSubmit="return false;"><tr><td>\u0418\u043c\u044f</td><td>\u0414\u043d\u0438</td><td><a href="javascript:void(0);" id="day_1_battle">\u0411\u043e\u0438</a></td><td id="tsum0">1\u0437</td><td id="tsum1">\u04261</td><td id="tsum2">\u04262</td><td id="tsum3">\u04263</td><td id="tsum4">\u0412\u041f</td><td></td></tr><tr><td><input id="trans_nick" name="trans_nick" value="" style="width: 60px" size="5"></td><td><input id="trans_time" value=0  style="width: 35px" size="1"></td><td><input id="trans_count" value=1  style="width: 35px" size="1"></td><td><input type="radio" name="sum" checked="true" value="0" id="sum0"></td><td><input type="radio" name="sum" value="1" id="sum1"></td><td><input type="radio" name="sum" value="2" id="sum2"></td><td><input type="radio" name="sum" value="3" id="sum3"></td><td><input type="radio" name="sum" value="4" id="sum4"></td></tr><tr><td colspan="8" align="right"><span id="place4return"></span>'+btsend+'<input type="submit" style="font-size: 14px;padding: 0;" id="trans_rem" value="\u0420\u0435\u043c\u043e\u043d\u0442" title="\u041f\u0435\u0440\u0435\u0434\u0430\u0442\u044c \u043d\u0430 \u0440\u0435\u043c\u043e\u043d\u0442 \u0437\u0430 1 \u0437\u043e\u043b\u043e\u0442\u043e\u0439"> <input type="submit" id="trans_a" value="\u0410\u0440\u0435\u043d\u0434\u0430" style="font-size: 14px;padding: 0;" title="\u0421\u0434\u0430\u0442\u044c \u0432 \u0430\u0440\u0435\u043d\u0434\u0443"></td></tr></form></table>' ;
		tr.appendChild( td ) ;
		insertAfter(seperator, tr);

		if( ( type_sum = GM_getValue( "hwm_takeoffon_type_sum" ) ) )
		{
			$('sum'+type_sum).setAttribute( "checked", "on" ) ;
			$('tsum'+type_sum).style.fontWeight = "bold"
			$('tsum'+type_sum).style.color = "#ff0000"
		if (type_sum==4) {$('trans_count').value=0}
			else {$('trans_count').value=1}
		}

		$('sum0').addEventListener( "click", set_type_sum , false );
		$('sum1').addEventListener( "click", set_type_sum , false );
		$('sum2').addEventListener( "click", set_type_sum , false );
		$('sum3').addEventListener( "click", set_type_sum , false );
		$('sum4').addEventListener( "click", set_type_sum , false );

		$("trans_a").addEventListener( "click", trans_on , false );
		$("trans_rem").addEventListener( "click", trans_rem , false );
		if( btsend != '' )
			$("trans_send").addEventListener( "click", trans_send , false );
		$("day_1_battle").addEventListener( "click", daybattle_form , false );

		// вернуть арты
		var return_a = document.querySelector('.inventory_item_in_rent,.inventory_item_finished_rent');
		if( return_a )
		{
			$("place4return").innerHTML='<input type="button" id="return_inp" style="font-size: 14px;padding: 0;" value="\u0412\u0435\u0440\u043d\u0443\u0442\u044c"> ';
			$("return_inp").addEventListener( "click", return_go , false );
		}

		tr = document.createElement( 'tr' );
		td = document.createElement( 'td' );
		td.className = 'wb' ;
		td.setAttribute( 'colspan' , 2 ) ;
		td.setAttribute( 'align' , 'center' ) ;
		td.setAttribute( 'style' , 'display:block' ) ;
	td.innerHTML = '<b>\u041f\u0435\u0440\u0435\u0434\u0430\u0447\u0438:</b> (<a href="pl_info.php?id=15091">by Demin</a>)<div style="float:right;margin:0 5px;cursor:pointer;font-weight:bold;" title="\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438" id="jsset">?</div>' ;    	tr.appendChild( td ) ;
		// o1.insertBefore( tr , o1.firstChild.nextSibling )
		// .insertAfter( tr );
		insertAfter(seperator, tr);

		$("jsset").addEventListener( "click", setting , false );
	}

	var price_List = new Array();


function initAll() {
	// var anchors = getI( "//a[contains(@href, 'art_transfer.php')]" ) ;
	var anchors = document.querySelectorAll('.inventory_block .arts_info') ;
	for( var i = 0; i < anchors.length; i++ )
	{
		var el = anchors[i];
		var hint = el.parentNode.querySelectorAll('.arts_info img')[1].getAttribute('hint');
		// var name = hint.substr(0, hint.indexOf(' [') > 0 ? hint.indexOf(' [') : hint.indexOf(' <br'));
		var art_idx = el.parentNode.parentNode.getAttribute('art_idx');
		var art = arts[art_idx];
		var art_id = art['id'];
		var title = hint.substr(0, hint.indexOf(' <br'));
		var name2 =  art['art_id']; //art['art_id'] либо art['name']


		// params = transed_regexp.exec( el.href ) ;
			// art_id = params[1] ;

			price_a = document.createElement( 'a' );
			price_a.innerHTML = '\u0446\u0435\u043d\u044b' ;
			price_a.setAttribute( "art_id" , art_id )
			price_a.id = "id_price_a"+art_id;
			price_a.href = 'javascript:void(0);' ;
			price_a.addEventListener( "click", price_form , false );

			// need = el.parentNode.parentNode.parentNode.parentNode.firstChild.firstChild.nextSibling.firstChild.firstChild.firstChild.firstChild
			//
			// title = need.querySelector("b").innerHTML;
			// name2 = /id=([a-z0-9_-]+)/.exec( need.innerHTML )[1];


			price_a.setAttribute( "art_name" , name2 )
			price_a.setAttribute( "art_title" , title )


	// if (prochka_regexp.exec( el.parentNode.parentNode.parentNode.parentNode.firstChild.nextSibling.firstChild.innerHTML )){
	// 		art_pr = prochka_regexp.exec( el.parentNode.parentNode.parentNode.parentNode.firstChild.nextSibling.firstChild.innerHTML )
	// }
	// else {
	// 		art_pr = prochka_regexp2.exec( el.parentNode.parentNode.parentNode.parentNode.firstChild.nextSibling.firstChild.innerHTML )
	// }
			//макс прочка
			price_a.setAttribute( "art_pr" , art['durability2'] )

			// need1 = el.parentNode.parentNode.parentNode.parentNode.firstChild.firstChild.nextSibling.firstChild.firstChild.firstChild.nextSibling.lastChild;
			// need1.style.cssText = 'white-space: nowrap;';

			sp = document.createElement( 'span' );
			sp.id = "span_dress_id_" + art_id ;
			sp.style = "display: none";
			// el.parentNode.parentNode.appendChild(sp);
			// need1.appendChild( sp ) ;

			inp = document.createElement( 'input' );
			inp.type = "checkbox" ;
			inp.name = "dress_id" ;
			inp.value = art_id ;
			inp.id = "dress_id_" + art_id ;
			inp.setAttribute( 'art_pr' , art['durability1'] ) //текущая прочка
			inp.checked = false ;
			// el.insertBefore( inp , need1.firstChild.nextSibling ) ;
		sp.appendChild(inp);


			if( ( price_art_id = GM_getValue( "hwm_takeoffon_price_"+art_id ) ) && price_art_id.indexOf( ';0;0;0;0;' ) < 0 )
			{
				price_a.style.fontWeight = "bold"
				price_a.style.color = "#006400"
			} else if( ( price_art_name = GM_getValue( "hwm_takeoffon_price_"+name2 ) ) && price_art_name.indexOf( ';0;0;0;0;' ) < 0 )
			{
				price_a.style.fontWeight = "bold"
				price_a.style.color = "#4169E1"
			} else
			{
				price_a.style.color = "#808080"
			}

			// el.parentNode.insertBefore( price_a , el.nextSibling ) ;
			// el.parentNode.insertBefore( document.createTextNode( ' : ' ) , el.nextSibling ) ;
			sp.appendChild(price_a);
			el.parentNode.parentNode.appendChild(sp);
		}


	// var anc_ret = getI( "//a[contains(@href, 'art_return=')]" ) ;
	// var anc_ret = document.querySelectorAll('.inventory_item_in_rent33,.inventory_item_finished_rent33');
	// for( var i = 0; i < anc_ret.length; i++ )
	// {
	//
	// 	var el = anc_ret[i];
	// 	var hint = el.parentNode.querySelector('.arts_info img').getAttribute('hint');
	// 	var name = hint.substr(0, hint.indexOf(' [') > 0 ? hint.indexOf(' [') : hint.indexOf(' <br'));
	// 	var art_idx = el.parentNode.getAttribute('art_idx');
	// 	var art = arts[art_idx];
	// 	var art_id = art['id'];
	// 		sp = document.createElement( 'span' );
	// 		sp.id = "span_dress_id_" + art_id ;
	// 		// sp.style = "display: none";
	//
	// 		inp = document.createElement( 'input' );
	// 		inp.type = "checkbox" ;
	// 		inp.name = "dress_id" ;
	// 		inp.value = art_id ;
	// 		inp.id = "dress_id_" + art_id ;
	// 		inp.checked = false ;
	//
	// 		// sp.appendChild( inp ) ;
	// 		// el.parentNode.appendChild(sp);
	// 	}
	replaceLinks();
}

//+ Copyright (c) demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )

// var add_click_div = document.createElement('div');
// add_click_div.id = "click_div";
// add_click_div.style.display = "none";
// document.querySelector("body").appendChild(add_click_div);
//
// addEvent($("click_div"), "click", initAll);
//
// function inj_inv_372() {
// 	var inj_372 = window["show_arts_by_cat"];
// 	window["show_arts_by_cat"] = function(cat,r) {
// 		inj_372(cat,r);
// 		document.querySelector("div[id='click_div']").click();
// 	}
// }
//
// var elem = document.createElement('script');
// elem.type = "text/javascript";
// elem.innerHTML = inj_inv_372.toString()+"inj_inv_372()";
// document.querySelector("head").appendChild(elem);

initAll();
// replaceLinks();

function initAllTimeout() {
	setTimeout(function() {
		initAll();
	}, 700);
}

//new
var tabs = document.querySelectorAll('.filter_tabs_block')
for(var i = 0; i<tabs.length; i++) {
	removeEvent(tabs[i], 'click', initAll);
	addEvent(tabs[i], 'click', initAll);
}

var tabs = document.querySelectorAll('.inv_slot_hover')
for(var i = 0; i<tabs.length; i++) {
	removeEvent(tabs[i], 'click', initAllTimeout);
	addEvent(tabs[i], 'click', initAllTimeout);
}

//- Copyright (c)

//+
function set_type_sum()
{
	if( ( old = GM_getValue( "hwm_takeoffon_type_sum" ) ) )
	{
		$("tsum"+old).style.fontWeight = "normal"
		$('tsum'+old).style.color = "#592C08"
	}

	GM_setValue( "hwm_takeoffon_type_sum" , this.value );
	$("tsum"+this.value).style.fontWeight = "bold"
	$('tsum'+this.value).style.color = "#ff0000"

	if (this.value==4) {$('trans_count').value=0}
		else {$('trans_count').value=1}
}
//-

//+
returned = false ;
function return_go()
{
	// var need_a = getI( "//a[contains(@href, 'inventory.php?art_return=')]" ) ;
	var need_a = document.querySelectorAll('.inventory_item_in_rent,.inventory_item_finished_rent');
	// returned_regexp = /art_return=(\d+)/
	for( var i=0; i<need_a.length; i++)
	{
		var hint = need_a[i].parentNode.querySelector('.arts_info img').getAttribute('hint');
		// var name = hint.substr(0, hint.indexOf(' [') > 0 ? hint.indexOf(' [') : hint.indexOf(' <br'));
		// var art_id = getIDByName(name);
		var art_idx = need_a[i].parentNode.getAttribute('art_idx');
		var art = arts[art_idx];
		var art_id = art['id'];

		// var this_a = need_a.snapshotItem(i);
		// var art_id =  returned_regexp.exec( this_a.href ) ;

		if( $("dress_id_"+art_id) && $("dress_id_"+art_id).type == "checkbox" && $("dress_id_"+art_id).checked )
		{
			//new. make url of return item to owner;
			//inventory.php?art_return=389307115&art=mgear&to=1596302
			var href = 'inventory.php?art_return='+art_id+'&art='+art['art_id']+'&to='+art['owner'];
			returned = true ;
			$("span_dress_id_"+art_id).innerHTML = loader();
			GM_xmlhttpRequest
			({
				method:"GET",
				url: href ,
				onload:function(res)
				{
					// $("dress_id_"+art_id).type = "radio" ;
					// $("dress_id_"+art_id).selected = true ;
					return_go() ;
				}
			});
			return;
		}
	}
	if( returned ) window.location.href = url_cur ;
}
//-

//+
traded = false ;
function trade_cancel()
{
	var inputs = document.getElementsByTagName('a');
	for( var i = 0; i < inputs.length; i++ )
	{
		var inp = inputs[i];
		if( inp.href.indexOf( 'trade_cancel.php' ) > -1 )
		{
			traded = true ;
			inp.parentNode.innerHTML = loader();
			GM_xmlhttpRequest
			({
				method:"GET",
				url: inp.href ,
				onload:function(res)
				{
					trade_cancel() ;
				}
			});
			return;
		}
	}
	if( traded ) window.location.href = url_cur ;
}
//-

//+
transed = false ;
function trans_on()
{
	var inputs = document.getElementsByTagName('input');


	if( $('sum1') && $('sum1').checked )
	{
		gold = 1 ;
	} else if( $('sum2') && $('sum2').checked )
	{
		gold = 2 ;
	} else if( $('sum3') && $('sum3').checked )
	{
		gold = 3 ;
	} else if( $('sum4') && $('sum4').checked )
	{
		gold = 4 ;
	} else
	{
		gold = 0 ;
	}


	var day_time = 0 ;
	if( gold == 4 )
	{
		day_time = 30 ;
		if( $('trans_time') && $('trans_time').value != 0 )
		{
			day_time = $('trans_time').value
			day_time = day_time.split(',').join('.')
		}
	} else if( $('trans_time') && $('trans_time').value != 0 )
	{
		var day_time = $('trans_time').value
		day_time = day_time.split(',').join('.')
	} else if( ( day1battle = GM_getValue( "hwm_takeoffon_day1battle" ) ) )
	{
		var days = day1battle.split(';') ;
		if( days[$('trans_count').value] )
		{
			day_time = days[$('trans_count').value]
			day_time = day_time.split(',').join('.')
		} else
			day_time = 0
	}
	for( var i = 0; i < inputs.length; i++ )
	{
		var inp = inputs[i];
		if( inp.type == "checkbox" && inp.name == "dress_id" && inp.checked )
		{
			transed = true ;
			var art_id = inp.value ;


			if( (gold == 4) && $('trans_count').value==0 )

			{
				bcount = inp.getAttribute( 'art_pr' )
			} else
			{
				bcount = $('trans_count').value
			}


			if( gold == 0 )

			{
				sum = 1
			} else
			{
				if( ( price = GM_getValue( "hwm_takeoffon_price_"+art_id ) ) && price.indexOf( ';0;0;0;0;' ) < 0 )

				{
					price_arr = price.split(';');
					sum0 = price_arr[gold]
				} else if( $("id_price_a"+art_id) && ( art_name = $("id_price_a"+art_id).getAttribute( "art_name" ) ) && ( price = GM_getValue( "hwm_takeoffon_price_"+art_name ) ) && price.indexOf( ';0;0;0;0;' ) < 0 )

				{
					price_arr = price.split(';');
					sum0 = price_arr[gold]
				} else
				{
					sum0 = 1
				}
				sumN = sum0 * ( bcount > 0 ? bcount : 1 )

//					sum = sumN + Math.max( 1 , Math.round( sumN * 0.01 ) )
				if( GM_getValue( "setnalog" ) && GM_getValue( "setnalog" ) == 1 && sumN > 0 )
					sum = Math.max( 1 , Math.round( sumN / 0.99 ) )
				else
					sum = sumN
			}
if (sum > 0) {
			$("span_dress_id_"+art_id).innerHTML = loader();

			GM_xmlhttpRequest
			({
				method:"POST",
				url: url+"art_transfer.php" ,
				headers:
				{
					'Content-Type'		: 'application/x-www-form-urlencoded' ,
					'Referer'			: url+'art_transfer.php?id='+art_id ,
				},
				data: 'id='+art_id+'&nick='+urlencode($('trans_nick').value)+'&gold='+sum+'&wood=0&ore=0&mercury=0&sulphur=0&crystal=0&gem=0&sendtype=2&dtime='+day_time+'&bcount='+bcount+'&art_id=&sign='+get_sign() ,
				onload:function(res)
				{
					inp.type = "radio" ;
					inp.selected = true ;
					$("span_dress_id_"+art_id).innerHTML = '' ;
					trans_on() ;
				}
			});
			return;
}
else
{
alert(art_name+' \u043d\u0435 \u043f\u0435\u0440\u0435\u0434\u0430\u043d');
inp.type = "radio" ;
inp.selected = true ;
}
		}
	}
	if( transed ) window.location.href = url_cur ;
}
//-

//+
function trans_rem()
{
	var inputs = document.getElementsByTagName('input');
	for( var i = 0; i < inputs.length; i++ )
	{
		var inp = inputs[i];
		if( inp.type == "checkbox" && inp.name == "dress_id" && inp.checked )
		{
			transed = true ;
			var art_id = inp.value ;
			$("span_dress_id_"+art_id).innerHTML = loader();
			GM_xmlhttpRequest
			({
				method: "POST" ,
				url: url+"art_transfer.php" ,
				headers:
				{
					'Content-Type'		: 'application/x-www-form-urlencoded' ,
					'Referer'			: url+'art_transfer.php?id='+art_id ,
				},

				data: 'id='+art_id+'&nick='+urlencode($('trans_nick').value)+'&gold=0&wood=0&ore=0&mercury=0&sulphur=0&crystal=0&gem=0&sendtype=2&dtime=0.004&bcount=0&rep=on&art_id=&sign='+get_sign() ,
				onload:function(res)
				{
					inp.type = "radio" ;
					inp.selected = true ;
					$("span_dress_id_"+art_id).innerHTML = '' ;
					trans_rem() ;
				}
			});
			return;
		}
	}
	if( transed ) window.location.href = url_cur ;
}
//-

//+
function trans_send()
{
	var inputs = document.getElementsByTagName('input');
	for( var i = 0; i < inputs.length; i++ )
	{
		var inp = inputs[i];
		if( inp.type == "checkbox" && inp.name == "dress_id" && inp.checked )
		{
			transed = true ;
			var art_id = inp.value ;
			$("span_dress_id_"+art_id).innerHTML = loader();
			GM_xmlhttpRequest
			({
				method: "POST" ,
				url: url+"art_transfer.php" ,
				headers:
				{
					'Content-Type'		: 'application/x-www-form-urlencoded' ,
					'Referer'			: url+'art_transfer.php?id='+art_id ,
				},

				data: 'id='+art_id+'&nick='+urlencode($('trans_nick').value)+'&gold=1&wood=0&ore=0&mercury=0&sulphur=0&crystal=0&gem=0&sendtype=1&dtime=0&bcount=0&art_id=&sign='+get_sign() ,
				onload:function(res)
				{
					inp.type = "radio" ;
					inp.selected = true ;
					$("span_dress_id_"+art_id).innerHTML = '' ;
					trans_send() ;
				}
			});
			return;
		}
	}
	if( transed ) window.location.href = url_cur ;
}
//-

//+
function daybattle_form()
{
	var bg = $('bgOverlay');
	var bgc = $('bgCenter');
	var bg_height = ScrollHeight();

	if ( !bg )
	{
		bg = document.createElement('div');
		document.body.appendChild( bg );

		bgc = document.createElement('div');
		document.body.appendChild( bgc );
	}

		bg.id = 'bgOverlay';
		bg.style.position = 'absolute';
		bg.style.left = '0px';
		bg.style.width = '100%';
		bg.style.background = "#000000";
		bg.style.opacity = "0.5";
		bg.style.zIndex = "7";

		bgc.id = 'bgCenter';
		bgc.style.position = 'absolute';
		bgc.style.left = ( ( ClientWidth() - 400 ) / 2 ) + 'px';
		bgc.style.width = '400px';
		bgc.style.background = "#F6F3EA";
		bgc.style.zIndex = "8";

	addEvent(bg, "click", form_close);

	var day1battle_ = GM_getValue( "hwm_takeoffon_day1battle" ) ;
	if( !day1battle_ )
		day1battle = new Array();
	else
		day1battle = day1battle_.split(';')

	var form = '<div style="border:1px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close" title="Close">x</div><center><table><tr><td colspan="4"><b>\u0412\u0440\u0435\u043c\u044f \u043d\u0430 \u0431\u043e\u0438 \u0432 \u0434\u043d\u044f\u0445 (1 \u0447\u0430\u0441 ~ 0,042 \u0434\u043d\u044f)</b></td></tr>'
	for( var i=1;i<11;i++)
	{
		form += '<tr>'+
'<td>'+i+'</td><td><input id="day_cnt'+i+'" size="5" value="'+( day1battle[i] ? day1battle[i] : 0 )+'"></td>'+
'<td>'+(10+i)+'</td><td><input id="day_cnt'+(10+i)+'" size="5" value="'+( day1battle[10+i] ? day1battle[10+i] : 0 )+'"></td>'+
'</tr>'
	}
	form += '<tr><td colspan="4" align="center"><input type="button" id="form_o" value="\u0423\u0441\u0442\u0430\u043d\u043e\u0432\u0438\u0442\u044c"></td></tr></table></center></div>' ;

	bgc.innerHTML = form;

	$("bt_close").addEventListener( "click", form_close , false );
	$('form_o').addEventListener( "click", daybattle_set , false );

	bg.style.top = '0px';
	bg.style.height = bg_height + 'px';
	bgc.style.top = ( window.pageYOffset + 150 ) + 'px';
	bg.style.display = '';
	bgc.style.display = '';
}
//-

//+
function daybattle_set()
{
	day1battle = '0;'
	for(var i=1;i<21;i++)
	{
		day1battle += ''+$('day_cnt'+i).value+';'
	}
	GM_setValue( "hwm_takeoffon_day1battle" , day1battle ) ;
	form_close() ;
}
//-

//+
function price_form(e)
{
	// check if item is in rent.
	var rent = e.target.parentNode.parentNode.parentNode.firstChild;
	if(rent.classList.contains('inventory_item_in_rent') || rent.classList.contains('inventory_item_finished_rent')) {
		return true;
	}

	var el = e.target.parentNode.parentNode.nextSibling.lastChild
	title = el.getAttribute( "art_title" )
	name2 = el.getAttribute( "art_name" )
	art_id = el.getAttribute( "art_id" )
	art_pr = el.getAttribute( "art_pr" )


	var bg = $('bgOverlay');
	var bgc = $('bgCenter');
	var bg_height = ScrollHeight();

	if ( !bg )
	{
		bg = document.createElement('div');
		document.body.appendChild( bg );

		bgc = document.createElement('div');
		document.body.appendChild( bgc );
	}

		bg.id = 'bgOverlay';
		bg.style.position = 'absolute';
		bg.style.left = '0px';
		bg.style.width = '100%';
		bg.style.background = "#000000";
		bg.style.opacity = "0.5";
		bg.style.zIndex = "7";

		bgc.id = 'bgCenter';
		bgc.style.position = 'absolute';
		bgc.style.left = ( ( ClientWidth() - 400 ) / 2 ) + 'px';
		bgc.style.width = '400px';
		bgc.style.background = "#F6F3EA";
		bgc.style.zIndex = "8";

	addEvent(bg, "click", form_close);


	var price_c1 = price_c2 = price_c3 = price_c4 = 0 ;
	var st_i = st_n = '' ;
	if( ( price = GM_getValue( "hwm_takeoffon_price_"+art_id ) ) && price.indexOf( ';0;0;0;0;' ) < 0 )
	{
		st_i = ' style="color:#006400;"'
		price_arr = price.split(';');
		price_c1 = price_arr[1]
		price_c2 = price_arr[2]
		price_c3 = price_arr[3]
		price_c4 = price_arr[4]
	} else if( ( price = GM_getValue( "hwm_takeoffon_price_"+name2 ) ) && price.indexOf( ';0;0;0;0;' ) < 0 )
	{
		st_n = ' style="color:#6495ED;"'
		price_arr = price.split(';');
		price_c1 = price_arr[1]
		price_c2 = price_arr[2]
		price_c3 = price_arr[3]
		price_c4 = price_arr[4]
	}

	bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close" title="Close">x</div><center><table><tr><td colspan="2"><b id="art_title"'+st_i+'>'+title+'</b> <i id="art_name"'+st_n+'>('+name2+')'+'</i></td></tr><tr><td>[\u04261] 1 \u0431\u043e\u0439</td><td><input id="art_c1" value="'+price_c1+'"></td></tr><tr><td>[\u04262] \u041e\u043f\u0442</td><td><input id="art_c2" value="'+price_c2+'"></td></tr><tr><td>[\u04263] \u041e\u0441\u043e\u0431\u0430\u044f&nbsp;</td><td><input id="art_c3" value="'+price_c3+'"></td></tr><tr><td>[\u0412\u041f] \u0412\u0441\u044f \u043f\u0440\u043e\u0447\u043a\u0430&nbsp;</td><td><input id="art_c4" value="'+price_c4+'"></td></tr><tr><td colspan="2" align="center"><input type="button" art_id="'+art_id+'" id="form_oi" value="\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u043e"> <input type="button" art_name="'+name2+'" id="form_on" value="\u0412\u0441\u0435\u043c \u0442\u0430\u043a\u0438\u043c"></td></tr></table></center></div>' ;

	$("bt_close").addEventListener( "click", form_close , false );
	$('form_oi').addEventListener( "click", price_set_id , false );
	$('form_on').addEventListener( "click", price_set_name , false );

	bg.style.top = '0px';
	bg.style.height = bg_height + 'px';
	bgc.style.top = ( window.pageYOffset + 150 ) + 'px';
	bg.style.display = '';
	bgc.style.display = '';
	$('art_c1').focus();
}
//-

//+
function form_close()
{
	var bg = $('bgOverlay');
	var bgc = $('bgCenter');
	bg.parentNode.removeChild(bg);
	bgc.parentNode.removeChild(bgc);
}
//-

//+
function price_set_id()
{
	var art_id = this.getAttribute( "art_id" ) ;
	price = $('art_title').innerHTML+';'+$('art_c1').value+';'+$('art_c2').value+';'+$('art_c3').value+';'+$('art_c4').value+';'
	var price_old = GM_getValue( "hwm_takeoffon_price" ) ;
	if( !price_old || price_old.indexOf( ';' + art_id + ';' ) < 0 )
	{
		price_new = ( price_old ? price_old : '' ) + ';' + art_id + ';' ;
		GM_setValue( "hwm_takeoffon_price" , price_new ) ;
	}
	GM_setValue( "hwm_takeoffon_price_"+art_id , price ) ;

	var price_a_obj = $("id_price_a"+art_id) ;
	if( price.indexOf( ';0;0;0;0;' ) < 0 )
	{
		price_a_obj.style.fontWeight = "bold"
		price_a_obj.style.color = "#006400"
	} else
	{
		if( ( this_name = price_a_obj.getAttribute( 'art_name' ) ) && ( this_price = GM_getValue( "hwm_takeoffon_price_"+this_name ) ) && this_price.indexOf( ';0;0;0;0;' ) < 0 )
		{
			price_a_obj.style.fontWeight = "bold"
			price_a_obj.style.color = "#6495ED"

		} else
		{
			price_a_obj.style.color = "#808080" ;
			price_a_obj.style.fontWeight = "normal"
		}
	}

	form_close() ;
}
//-

//+
function price_set_name()
{
	var art_name = this.getAttribute( "art_name" ) ;
	price = $('art_title').innerHTML+';'+$('art_c1').value+';'+$('art_c2').value+';'+$('art_c3').value+';'+$('art_c4').value+';'
	var price_old = GM_getValue( "hwm_takeoffon_price_name" ) ;
	if( !price_old || price_old.indexOf( ';' + art_name + ';' ) < 0 )
	{
		price_new = ( price_old ? price_old : '' ) + ';' + art_name + ';' ;
		GM_setValue( "hwm_takeoffon_price_name" , price_new ) ;
	}
	GM_setValue( "hwm_takeoffon_price_"+art_name , price ) ;

	var need_a = getI( "//a[contains(@href, 'javascript:void(0);')]" ) ;
	if( price.indexOf( ';0;0;0;0;' ) < 0 )

	{
		for(var i=0; i < need_a.snapshotLength; i++)

		{
			this_a = need_a.snapshotItem(i);
			if( ( this_id = this_a.getAttribute( 'art_id' ) ) && ( this_price =  GM_getValue( "hwm_takeoffon_price_"+this_id ) ) && this_price.indexOf( ';0;0;0;0;' ) < 0 )

			{
			} else if( ( this_name = this_a.getAttribute( 'art_name' ) ) && this_name == art_name )

			{
				this_a.style.fontWeight = "bold"
				this_a.style.color = "#6495ED"
			}
		}

	} else

	{
		for(var i=0; i < need_a.snapshotLength; i++)
		{
			this_a = need_a.snapshotItem(i);
			if( ( this_id = this_a.getAttribute( 'art_id' ) ) && ( this_price =  GM_getValue( "hwm_takeoffon_price_"+this_id ) ) && this_price.indexOf( ';0;0;0;0;' ) < 0 )

			{
			} else if( ( this_name = this_a.getAttribute( 'art_name' ) ) && this_name == art_name )

			{
				this_a.style.fontWeight = "normal"
				this_a.style.color = "#808080"
			}
		}
	}
	form_close() ;
}
//-


//+
function setting()
{
	var bg = $('bgOverlay');
	var bgc = $('bgCenter');
	var bg_height = ScrollHeight();

	if ( !bg )
	{
		bg = document.createElement('div');
		document.body.appendChild( bg );

		bgc = document.createElement('div');
		document.body.appendChild( bgc );
	}

		bg.id = 'bgOverlay';
		bg.style.position = 'absolute';
		bg.style.left = '0px';
		bg.style.width = '100%';
		bg.style.background = "#000000";
		bg.style.opacity = "0.5";
		bg.style.zIndex = "7";

		bgc.id = 'bgCenter';
		bgc.style.position = 'absolute';
		bgc.style.left = ( ( ClientWidth() - 650 ) / 2 ) + 'px';
		bgc.style.width = '650px';
		bgc.style.background = "#F6F3EA";
		bgc.style.zIndex = "8";

	addEvent(bg, "click", form_close);

if ( url.match('lordswm') ) {

var st_author = 'Script author';

} else {

var st_author = '\u0410\u0432\u0442\u043E\u0440 \u0441\u043A\u0440\u0438\u043F\u0442\u0430';

}

bgc.innerHTML = '<div style="border:1px solid #abc;padding:5px;margin:2px;"><div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close" title="Close">x</div><table>'+
'<tr><td>\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 передачи артов пачкой<br><br></td></tr>'+
'<tr><td><label for="chsetnalog" style="cursor:pointer;"><input type="checkbox" id="chsetnalog"> \u0443\u0447\u0438\u0442\u044b\u0432\u0430\u0442\u044c \u043d\u0430\u043b\u043e\u0433 \u0432 1% \u043f\u0440\u0438 \u043f\u0435\u0440\u0435\u0434\u0430\u0447\u0435 \u0432 \u0430\u0440\u0435\u043d\u0434\u0443</label></td></tr><tr><td><label for="chsetbtsend" style="cursor:pointer;"><input type="checkbox" id="chsetbtsend"> \u043f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u043a\u043d\u043e\u043f\u043a\u0443 "\u041f\u0435\u0440\u0435\u0434\u0430\u0442\u044c"</label></td></tr>'+
'</table><table width=100%>'+
'<tr><td style="text-align:right">'+st_author+': <a href="pl_info.php?id=130">xo4yxa</a> & <a href="pl_info.php?id=15091">Demin</a></td></tr>'+
'</table></div>';

	$("bt_close").addEventListener( "click", form_close , false );

	var chsetnalog = $('chsetnalog')
	chsetnalog.checked = ( GM_getValue( "setnalog" ) && GM_getValue( "setnalog" ) == 1 ) ? 'checked' : '' ;
	chsetnalog.addEventListener( "click", setChNalog , false );

	var chsetbtsend = $('chsetbtsend')
	chsetbtsend.checked = ( GM_getValue( "setbtsend" ) && GM_getValue( "setbtsend" ) == 1 ) ? 'checked' : '' ;
	chsetbtsend.addEventListener( "click", setChBtsend , false );

	bg.style.top = '0px';
	bg.style.height = bg_height + 'px';
	bgc.style.top = ( window.pageYOffset + 150 ) + 'px';
	bg.style.display = '';
	bgc.style.display = '';
}
//-


function setChNalog()
{
	if( GM_getValue( "setnalog" ) && GM_getValue( "setnalog" ) == 1 )
		GM_setValue( "setnalog" , 0 );
	else
		GM_setValue( "setnalog" , 1 );
}
function setChBtsend()
{
	if( GM_getValue( "setbtsend" ) && GM_getValue( "setbtsend" ) == 1 )
		GM_setValue( "setbtsend" , 0 );
	else
		GM_setValue( "setbtsend" , 1 );
}

function checkItem(e)
{
	var item = e.target.parentNode;
	var checkbox = item.parentNode.nextSibling.firstChild;
	if(checkbox.checked) {
		checkbox.checked = false;
		item.style.opacity = 1;
	}else {
		checkbox.checked = true;
		item.style.opacity = 0.5;
	}
}

function loader() {
return '<img border="0" align="absmiddle" height="13" src="data:image/gif;base64,'+
'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'+
'fySDhGYQdDWGQyUhADs=">';
}

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}


function ClientHeight() {
	return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientHeight:document.body.clientHeight;
}

function ClientWidth() {
	return document.compatMode=='CSS1Compat' && document.documentElement?document.documentElement.clientWidth:document.body.clientWidth;
}

function ScrollHeight() {
	return Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
}

function $(id) { return document.querySelector("#"+id); }

function addEvent(elem, evType, fn) {
	if (elem.addEventListener) {
		elem.addEventListener(evType, fn, false);
	}
	else if (elem.attachEvent) {
		elem.attachEvent("on" + evType, fn);
	}
	else {
		elem["on" + evType] = fn;
	}
}

function removeEvent(elem, evType, fn) {
	if(elem){
		if (elem.removeEventListener)
			elem.removeEventListener(evType, fn, false);
		if (elem.detachEvent)
			elem.detachEvent("on" + evType, fn);
		if(elem.removeEvent)
			elem.removeEvent("on" + event, fn);
		if(elem["on" + evType] == fn)
			elem["on" + evType] = null;
	}
}


function get_sign() {
	var sign, pos, el;
	var ems = document.querySelectorAll("script");
	if (ems.length != 0) {
		for (var k=0; k < ems.length; k++) {
			el = ems[k].text;
			pos = el.indexOf('player_nick');
			if (pos != -1) 	{
				el = el.substring(el.indexOf('sign'));
				el = el.substring(0,el.indexOf(';'));
				sign = el.split("'")[1];
//				alert(sign);
			}
		}
	}
	return sign;
}

function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function getIDByName(name){
	for (var i = 0; i < arts.length; i++) {
		if (arts[i]['name'] == name) {
			return arts[i]['id'];
		}
	}
}

function getArtInfoByName(name){
	for (var i = 0; i < arts.length; i++) {
		if (arts[i]['name'] == name) {
			arts[i]['idx'] = i;
			return arts[i];
		}
	}
}

function replaceLinks(){
	var links = document.querySelectorAll('.inventory_block .arts_info');
	for (var i = 0; i < links.length; i++){
		var link = links[i];
		removeEvent(link, 'click', handle_click_price_form);
		addEvent(link, 'click', handle_click_price_form);
	}
}

function handle_click_price_form(e){
	if (e.altKey){
		price_form(e);
	}

	if (e.shiftKey){
		checkItem(e);
	}
}

////////////////////////// PRODUCTION CODE (inventory.js) //////////////////////////
dress_handle = function()
{
	var obj = this;

	if (obj.readyState == 4)
	{
		var txt = obj.responseText;

		if (txt == 'fail' || txt.length > 5000)
		{
			window.location = 'inventory.php?1' + add_url;
			return 0;
		}
		else if (txt)
		{
			var data = obj.responseText.split('|');

			if (data && data[0])
			{
				if (data[0] == 'gift_box_opened_refresh' && data[1])
				{
					window.location = 'inventory.php?gift_box_opened=' + data[1] + add_url;
					return 0;
				}

				if (data.length > 20)
				{
					window.location = 'inventory.php?1' + add_url;
					return 0;
				}

				refresh_pl_params(data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11]);

				for (var i = 0; i < arts_c; i++)
					if (arts[i]["id"] == data[1])
					{
						document.getElementById('slot' + data[0]).innerHTML = arts[i]['html'];
						document.getElementById('slot' + data[0]).onclick = try_undress;
						document.getElementById('slot' + data[0]).setAttribute('art_id', arts[i]["id"]);

						arts[i]['dressed'] = data[0];

						if (slots[data[0]] > 0) inv_remove_dress_attr_from_array_by_id(slots[data[0]]);
						slots[data[0]] = arts[i]['id'];
						break;
					}
			}

			show_arts_in_category();
			hide_hwm_hint(this, true);
			//this is why the function is here.
			initAll();
		}
	}
}

})();

