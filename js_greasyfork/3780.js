// ==UserScript==
// @name        taobao_fixed
// @namespace   tbpu
// @description For TaoBao Fix web
// @match       http://detail.tmall.com/*
// @match       https://detail.tmall.com/*
// @match       http://*.tmall.com/*
// @match       https://*.tmall.com/*
// @match       *.taobao.com/*
// @version     1.7.1
// @copyright   2018, mesak (https://openuserjs.org/users/mesak)
// @supportURL  https://greasyfork.org/zh-TW/scripts/3780-taobao-fixed
// @license     MIT
// @updateUrl   https://openuserjs.org/meta/mesak/taobao_fixed.meta.js
// @downloadURL https://update.greasyfork.org/scripts/3780/taobao_fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/3780/taobao_fixed.meta.js
// ==/UserScript==
String.prototype.repeat = function(n) { return Array(n + 1).join(this);};
String.prototype.downcase = function() { return this.toLowerCase(); };
String.prototype.upcase = function() { return this.toUpperCase();};
String.prototype.find = function(str) { return this.indexOf(str);};
String.prototype.has = function(str) { return (this.indexOf(str)) >= 0;};
NodeList.prototype.forEach = Array.prototype.forEach;
var sPageUrl = window.location.href.toLowerCase();
//J_DeleteItem
function get_item(id){
    return 'https://item.taobao.com/item.htm?id=' + id;
}

if( sPageUrl.has('m.intl.taobao.com') ){
	let q = sPageUrl.match(/id=(\d+)/);
	if( q.length > 0 ){
        location.href = get_item(q[1]);
	}
}
if( sPageUrl.has('detail.m.tmall.com') ){
	let q = sPageUrl.match(/id=(\d+)/);
	if( q.length > 0 ){
        location.href = get_item(q[1]);
	}
}
if( sPageUrl.has('tw.taobao.com/item') ){
	let q = sPageUrl.match(/item\/(\d+)/);
	if( q.length > 0 ){
        location.href = get_item(q[1]);
	}
}

if( sPageUrl.has('world.taobao.com/item') ){
	let q = sPageUrl.match(/item\/(\d+)/);
	if( q.length > 0 ){
        //console.log( get_item(q[1]) );
        location.href = get_item(q[1]);
	}
}
if( sPageUrl.has('world.tmall.com/item') ){
	let q = sPageUrl.match(/item\/(\d+)/);
	if( q.length > 0 ){
        location.href = get_item(q[1]);
	}
}
if( sPageUrl.has('error1.html?c=404') && sPageUrl.has('findgoods_router.php') )
{
	let q = sPageUrl.match(/\&id=(\d+)/);
	if( q.length > 0 ){
        location.href = get_item(q[1]);
	}
}
//console.log(sPageUrl);
if( sPageUrl.has('remark_seller') || sPageUrl.has('remarkseller') )
{
	var radioGood = document.querySelectorAll('.rate-list .good-rate');
	radioGood.forEach(function(objRadio,radIndex){
		objRadio.checked = true;
	});
	var radioPrivacy = document.querySelectorAll('.rate-list .privacy-control');
	radioPrivacy.forEach(function(objRadio,radIndex){
		objRadio.checked = true;
	});
	var radioStart = document.querySelectorAll('.itemlist .stars input[value="5"]');
	radioStart.forEach(function(objRadio,radIndex){
		objRadio.checked = true;
	});
}
function getFavListItem( el )
{
    let parent = null;
    let p = el.parentNode;
    while (p !== document) {
        let o = p;
        if( o.classList.contains('J_FavListItem') )
        {
            parent = o;
        }
        p = o.parentNode;
    }
    return parent;
}
if( sPageUrl.has('shoucang.taobao.com') )
{
    document.querySelector('#content').addEventListener('click', function(e) {
        if( e.target.classList.contains('J_DeleteItem') )
        {
            let p = getFavListItem( e.target ).querySelector('.J_DeleteItem_Ok').click();
            //let ok = p.querySelector('.J_DeleteItem_Ok');
            /*
            window.setTimeout(function(){
                ok.click();
            },100)
            */
            //console.log(   );
            //'J_FavListItem'
        }
    });
}
if( sPageUrl.has('item.taobao.com') || sPageUrl.has('detail.tmall.com') )
{
	let q = sPageUrl.match(/&id=(\d+)/);
	if( q.length > 0 ){
		history.replaceState(null, null, 'item.htm?id='+q[1] );
	}
}else if ( sPageUrl.has('s.taobao.com') ){
	var query = '';
	if( sPageUrl.has('q=') )
	{
		let q = sPageUrl.match(/q=[^&(!#)]+/);
		query += '?' + q[0];
	}
	if( sPageUrl.has('cat=') ){
		let q = sPageUrl.match(/cat=[\d+]+/);
		query += '&' + q[0];
	}
	if( sPageUrl.has('sort=') ){
		let q = sPageUrl.match(/sort=[^&]+/);
		query += '&' + q[0];
	}
	if( sPageUrl.has('tab=') ){
		var q = sPageUrl.match(/tab=(all|mall|old)/);
		if(q[0] !=='tab=all')
		{
			query += '&' + q[0];
		}
	}
	if( sPageUrl.has('s=') )
	{
		let q = sPageUrl.match(/s=(\d+)+/);
		query += '&' + q[0];
	}
	if( query !== '' ){
		history.replaceState(null, null, 'search'+query);
	}
}
document.querySelectorAll('a[href^="//cart.taobao.com/cart.htm"').forEach((node)=>{
   if(node.getAttribute('href').indexOf('mini')){
       node.setAttribute('href','https://world.taobao.com/cart/cart.htm')
   }
})

document.querySelectorAll('#J_isku li > a').forEach(function(n){
	if(n.style.background !== '')
	{
		n.style.backgroundPositionX = '0px';
		n.style.paddingLeft = '32px';
		let text = n.querySelector('span').innerHTML;
		n.innerHTML = text + '<span>'+text+'</span>';
	}
});

document.getElementById('page').addEventListener("DOMNodeInserted", function (e) {
    if( e.target.className == 'tb-content' ){
        var elements = e.target.querySelectorAll('img'); //[data-ks-lazyload]
		for (var i = 0; i < elements.length; i++)
		{
		    elements[i].src = elements[i].getAttribute('data-ks-lazyload');
		    elements[i].removeAttribute('data-ks-lazyload');
		}
    }
}, true);