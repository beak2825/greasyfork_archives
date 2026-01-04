// ==UserScript==
// @name         虚拟宝库列表页
// @namespace    http://leochan.me
// @version      2.0
// @description  虚拟宝库列表页面标注已经回复的单页
// @author      Leo Chan
// @match        http://www.xunibaoku.com/forum-*-*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392834/%E8%99%9A%E6%8B%9F%E5%AE%9D%E5%BA%93%E5%88%97%E8%A1%A8%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/392834/%E8%99%9A%E6%8B%9F%E5%AE%9D%E5%BA%93%E5%88%97%E8%A1%A8%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addStyle(obj){
        obj.setAttribute('style','color:#000000;font-size:18px;font-weight:700;');
    }
    function getName(s){
        var a = s.split('/'), l = a.length, n;
        l = l - 1;
        n = a[l];
        return n.replace('thread-','').split('.html')[0];
    }
    function getUrl(o){
        var u = o.getAttribute('href');
        return u || 'none';
    }
    function addMark( t ){
        var uri = getUrl( t ), mark = getName(uri);
        localStorage.setItem(mark,1);
    }
	function getDateTime(){
		var today = new Date(), y = today.getFullYear(), m = today.getMonth() + 1, d = today.getDate(), hh = today.getHours();
		if( m < 10 ){
			m = '0' + m;
		}
		if( d < 10 ){
			d = '0' + d;
		}
		if( hh < 10 ){
			hh = '0' + hh;
		}
		return 'count_now_' + y + '' + m + '' + d + '' + hh;
	}
	function getCountByDateTime(){
		var c = localStorage.getItem( getDateTime() );
		c = c || 0;
		return c < 10;
	}
    function doList(){
        var objs = document.querySelectorAll('tbody[id^="normalthread_"] a.xst'), length = objs.length, url;
		if(length>0){
		   objs.forEach( function( item, index ){
			   url = getUrl(item);
			   url = url.replace( /[\d]+\.html/gm, '1.html' );
			   if( localStorage.getItem(getName(url)) == 1 ){
				   addStyle(item);
			   }
		   } );
		}
    }
	function haveARest( tip ){
		tip = tip || '每小时最多处理8个，下一小时的0分解锁';
		var d = document.createElement( 'div' ), t = document.createTextNode( tip ), b = document.createElement( 'div' );
		b.setAttribute( 'id', 'auto-rest-bg' );
		b.style.cssText = 'background:rgba(0,0,0,0.5);height:100vh;width:100vw;position:fixed;z-index:98;top:0;left:0;';
		d.setAttribute( 'id', 'auto-rest-tip' );
		d.style.cssText = 'padding:15px 30px;background:#fff;border:5px solid rgba(0,0,0,0.5);text-align:center;line-height:50px;width:240px;position:fixed;z-index:99;top:50%;left:50%;margin-top:-45px;margin-left:-155px;';
		d.appendChild(t);
		document.querySelectorAll( 'body' )[0].appendChild(b);
		document.querySelectorAll( 'body' )[0].appendChild(d);
	}
	function doRest(){
		if( !getCountByDateTime() ){
			if( !document.getElementById( 'auto-rest-tip' ) ){
				haveARest();
			}
		}else{
			if( document.getElementById( 'auto-rest-tip' ) ){
				document.getElementById('auto-rest-bg').remove();
				document.getElementById('auto-rest-tip').remove();
			}
		}
	}
	setatarget(1);
	doList();
	setInterval( function(){
		doList();
		doRest();
	}, 3000 );
})();