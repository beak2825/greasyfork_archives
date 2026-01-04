// ==UserScript==
// @name         虚拟宝库详情页
// @namespace    https://leochan.me
// @version      2.0
// @description  自动回复一下内容
// @author       Leo
// @include     *://pan.baidu.com/share/init?*
// @include     http://www.xunibaoku.com/thread-*-*-*.html
// @include     http://www.xunibaoku.com/thread-*-*-*.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392833/%E8%99%9A%E6%8B%9F%E5%AE%9D%E5%BA%93%E8%AF%A6%E6%83%85%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/392833/%E8%99%9A%E6%8B%9F%E5%AE%9D%E5%BA%93%E8%AF%A6%E6%83%85%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function isBaidu(){
		return location.href.match( /((?:https?:\/\/)?(?:yun|pan|eyun).baidu.com\/(?:s\/\w*|share\/(\w|-)*))/g );
	}
	function triggerEvent( obj, event, option ){
		var ev;
		//option = option || {"bubbles":true, "cancelable":true};
		if( option ){
			ev = new Event(event, option);
		}else{
			ev = new Event(event);
		}
		obj.dispatchEvent(ev);
	}
	function setSelectValue(){
		var s = document.getElementById( 'ct_fastpost' ), o = s.querySelectorAll( 'option' ), l = o.length, i = randomNum( 0, l - 1 );
		o[i].selected = true;
	}
	function openUrl( href, target ) {
		target = target || 0;
		target = target === 0 ? '_self' : '_blank';
		Object.assign( document.createElement( 'a' ), {
			target: target,
			href,
		} ).click();
	}
	function openTip( tip ){
		tip = tip || '提取链接成功，页面将自动跳转';
		var d = document.createElement( 'div' ), t = document.createTextNode( tip );
		d.style.cssText = 'padding:15px 30px;background:#fff;border:5px solid rgba(0,0,0,0.5);text-align:center;line-height:50px;width:240px;position:fixed;top:50%;left:50%;margin-top:-45px;margin-left:-155px;';
		d.appendChild(t);
		document.querySelectorAll( 'body' )[0].appendChild(d);
	}
	function closePage(){
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
        } else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    }
	function copyToClipboard( str ){
        var e = document.createElement( 'textarea' );
        e.value = str;
        e.setAttribute( 'readonly', '' );
        e.style = { position: 'absolute', left: '-9999px' };
        document.body.appendChild( e );
        e.select();
        document.execCommand( 'copy' );
        document.body.removeChild( e );
		openTip();
		setTimeout( function(){
		  closePage();
		}, 10000 );
    }
	function Link(){
        this.url = null;
        this.password = null;
        this.addLink = function(link, password) {
            this.url = link;
            this.password = password;
        };
    }
	function activiteLink(obj, linkList) {
        var docu = obj.innerHTML, length = linkList.length;
		if( length > 0 ){
			for (var i = 0; i < length; i++) {
				docu = docu.replace(new RegExp(linkList[i].url+"(?=[^#])", "gm"),"<a target='_blank' class='btn btn-url' style='color:#d00' href='" + linkList[i].url + '#' + linkList[i].password + "'>马上保存</a> ");
			}
			obj.innerHTML = docu;
		}
    }
	function doAllAction(selector,linkList){
		var elements = document.querySelectorAll(selector);
		Array.prototype.forEach.call(elements, function(el, i){
			activiteLink(el, linkList);
		});
	}
	function getLink(){
		var linkList = new Array();
		if (isBaidu()) {
			var password = location.href.match(new RegExp("(#\\w{4})$", "gm"));
			if(password == null){
				openTip( '没有发现密码' );
			}else{
				password +="";
				password = password.substring(1);
				document.querySelectorAll( 'input[type="text"]' )[0].value = password;
				document.querySelectorAll( ".g-button-right" )[0].click();
			}
		} else {
			var docText = document.querySelectorAll('body')[0].textContent, regRuleLink = "((?:https?:\\/\\/)?(?:yun|pan|eyun).baidu.com\\/(?:s\\/(\\w|-)*|share\\/\\S*\\d)(#\\w{4})?)", regSplit = "\\s*(密|密码|提取码|访问码|提取密码|访问密码)(\\s|\\:|：)*(本帖隐藏的内容)?", regRulePwd = "\\w{4}", regRuleTotal = regRuleLink +"("+ regSplit + regRulePwd+")?", regExp = new RegExp(regRuleTotal, "gm"), shareArray = docText.match(regExp), urlArray = new Array(), urlExp = new RegExp(regRuleLink, "gm"), pswExp = new RegExp(regSplit + regRulePwd, "gm"), pswArr = new Array();
			if (shareArray != null) {
				for (var i = 0; i < shareArray.length; i++) {
					if (urlArray.indexOf(shareArray[i].match(urlExp)[0]) == -1) {
						var link = new Link();
						link.url = shareArray[i].match(urlExp)[0];
						if(shareArray[i].match(pswExp) != null){
							link.password = shareArray[i].match(pswExp)[0];
						}else{
							link.password = "";
						}
						linkList.push(link);
					}
				}
                var pswArray = new Array();
                for (var ii = 0; ii < linkList.length; ii++) {
                    var li = linkList[ii];
                    if(li.password!=""){
                        li.password = li.password.match(new RegExp(regRulePwd, "gm"))[0];
                    }
                }
				doAllAction('.t_f',linkList);
				doAllAction('.ratl',linkList);
				doAllAction('.entry',linkList);
                addMark();
                if( linkList.length === 1 ){
                    openUrl( linkList[0].url + '#' + linkList[0].password );
                }else if( linkList.length > 1 ){
                    openUrl( linkList[0].url + '#' + linkList[0].password, 1 );
                }
			}
		}
	}
	function copyData(){
		var h = document.querySelectorAll( '.showhide' ), d = 0, link, content, match, mark;
		h.forEach( function( item, index ){
			if( d === 0 && item.querySelectorAll( 'a[href^="https://pan.baidu.com/s"]' ).length > 0 ){
				link = item.querySelectorAll( 'a[href^="https://pan.baidu.com/s"]' )[0].getAttribute( 'href' );
				content = item.innerHTML;
				d = 1;
			}
		} );
		if( d === 1 ){
			match = content.split( '提取码: ' );
			if( match.length > 1 ){
				mark = link + '#' + match[1].substr(0,4);
                console.log( mark );
				copyToClipboard(mark);
			}
		}
	}

    function getName(s){
        var a = s.split('/'), l = a.length, n;
        l = l - 1;
        n = a[l];
        return n.replace('thread-','').replace( /[\d]+\.html/gm, '1.html' ).split('.html')[0];
    }
	function scrollTo(){
		window.scroll({
			behavior: 'smooth',
			left: 0,
			top: document.getElementById( 'fastpostmessage' ).offsetTop
		});
	}
    function autoReply(){
		var btns = document.querySelectorAll( '.locked a[onclick^="showWindow"]' );
		if( btns.length > 0 ){
			//triggerEvent( document.getElementById( 'ct_fastpost' ), 'click' );
			document.getElementById( 'ct_fastpost' ).click();
			setSelectValue();
			triggerEvent( document.getElementById( 'ct_fastpost' ), 'change' );
			//document.getElementById( 'ct_fastpost' ).change();
			//triggerEvent( document.getElementById( 'ct_fastpost' ), 'blur' );
			document.getElementById( 'ct_fastpost' ).blur();
			addMark();
			//triggerEvent( document.getElementById( 'fastpostsubmit' ), 'mouseover' );
			triggerEvent( document.getElementById( 'fastpostsubmit' ), 'mouseover' );
			//document.getElementById( 'fastpostsubmit' ).mouseover();
			//triggerEvent( document.getElementById( 'fastpostsubmit' ), 'click' );
			document.getElementById( 'fastpostsubmit' ).click();
		}
	}
	function randomNum( minNum, maxNum ){
		switch( arguments.length ){
			case 1:
				return parseInt(Math.random()*minNum+1,10);
				break;
			case 2:
				return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
				break;
			default:
				return 0;
		}
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
	function increseTime(){
		var m = getDateTime(), t = localStorage.getItem( m );
		if( t ){
			t = parseInt( t ) + 1;
		}else{
			t = 1;
		}
		localStorage.setItem( m, t );
	}
	function addMark(){
        localStorage.setItem(getName(location.href.replace( /[\d]+\.html/gm, '1.html' )),1);
    }
	function selectContent(){
		var s = document.getElementById( 'ct_fastpost' ), o = s.querySelectorAll( 'option' ), l = o.length, i = randomNum( 0, l - 1 );
		document.getElementById('fastpostmessage').value = o[i].textContent;
	}
	function clickSubmit(){
		document.getElementById('fastpostsubmit').click();
	}
	if( !isBaidu() ){
		setTimeout( function(){
			autoReply();
		}, randomNum( 2000, 6000 ) );
	}
	getLink();
	document.getElementById( 'fastpostform' ).addEventListener( 'submit', function(){
		setTimeout( function(){
			increseTime();
			document.getElementById('pt').firstElementChild.lastElementChild.click();
		}, randomNum( 2000, 6000 ) );
	} )
})();