// ==UserScript==
// @name          HWM cyfral strength
// @description   cyfral strength
// @version       0.04
// @namespace     Sweag
// @include       https://www.heroeswm.ru/home.php
// @include       https://www.heroeswm.ru/pl_info.php?*
// @include       https://www.heroeswm.ru/inventory.php
// @include       https://www.heroeswm.ru/sklad_info.php*
// @downloadURL https://update.greasyfork.org/scripts/40035/HWM%20cyfral%20strength.user.js
// @updateURL https://update.greasyfork.org/scripts/40035/HWM%20cyfral%20strength.meta.js
// ==/UserScript==


var url = 'https://www.heroeswm.ru/' ;
var url_cur = location.href ;
var item_hard_regexp = /: (\d+)\/(\d+)/;
var item_name_regexp = /uid=(\d+)/;
//var item_id_regexp = /pull_off=(\d+)/;

if( url_cur == 'https://www.heroeswm.ru/inventory.php' )
{
	//var els = getI( "//a[contains(@href, 'art_info.php')]" ) ;
    var els = getI( "//img[not(@id)]" ) ;
	var elo = '' ;
    for( var i = 0; i < els.snapshotLength; i++ )
	{
		var el = els.snapshotItem(i);
		an = item_hard_regexp.exec( el.parentNode.innerHTML ) ;
		//alert(an + el.parentNode.innerHTML);
        if( an )
		{
			if( elo == an[1] )
				continue;
			else
				elo = an[1];
		p = item_hard_regexp.exec( el.parentNode.innerHTML ) ;
		d = document.createElement( 'div' );
		d.innerHTML = p[1] ;
		d.style.fontSize = '9px' ;
		d.style.padding = '0px 1px' ;
		d.style.border = '1px solid #eecd59' ;
		d.style.margin = '2px' ;
		if(p[1]<4)d.style.background = '#F11' ; else d.style.background = '#FFF' ;
		d.style.position = 'absolute' ;
		el.parentNode.insertBefore( d , el ) ;
        }
	}
} else
{
	var els = getI( "//a[contains(@href, 'art_info.php')]" ) ;
	var elo = '' ;
	for( var i = 0; i < els.snapshotLength; i++ )
	{
		var el = els.snapshotItem(i);
		an = item_name_regexp.exec( el.href ) ;
		if( an )
		{
			if( elo == an[1] )
				continue;
			else
				elo = an[1];
		}
        p = item_hard_regexp.exec( el.parentNode.innerHTML ) ;
		d = document.createElement( 'div' );
		d.innerHTML = p[1] ;
		d.style.fontSize = '9px' ;
		d.style.padding = '0px 1px' ;
		d.style.border = '1px solid #eecd59' ;
		d.style.margin = '2px' ;
		if(p[1]<4)d.style.background = '#F11' ; else d.style.background = '#FFF' ;
		d.style.position = 'absolute' ;
		el.parentNode.insertBefore( d , el ) ;
	}
}

function getI(xpath,elem){return document.evaluate(xpath,(!elem?document:elem),null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);}
function $( id ) { return document.getElementById( id ); }