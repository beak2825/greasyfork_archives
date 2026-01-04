// ==UserScript==
// @name         reader EH
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       You
// @include      *https://e-hentai.org*
// @include      *https://exhentai.org/*
// @include      file:*Hentai*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394954/reader%20EH.user.js
// @updateURL https://update.greasyfork.org/scripts/394954/reader%20EH.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var getEl = function(q, c) {
	  return (c || document).querySelector(q);
	};
    var getEls = function(q, c) {
        return [].slice.call((c || document).querySelectorAll(q));
    };

    var MLStyles = document.createElement('style');
    MLStyles.dataset.name = 'ml-style-main';
    document.head.appendChild(MLStyles);
    var addStyle = function(id, replace) { //添加class
        var css = [].slice.call(arguments, 2).join('\n');
        if (replace) {
            MLStyles.textContent = css;
        } else {
            MLStyles.textContent += css;
        }
    };

    var toStyleStr = function(obj, selector) { //class转字符串
        var stack = [], key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                stack.push(key + ':' + obj[key]);
            }
        }
        if (selector) {
            return selector + '{' + stack.join(';') + '}';
        } else {
            return stack.join(';');
        }
    };
    var navCss = toStyleStr({
        'text-decoration': 'none',
        'color': 'white',
        'background-color': '#444',
        'padding': '6px 10px',
        'font-size': '500%',
        'border-radius': '5px',
        'transition': '250ms',
        'margin': '3px'
    },
    '.ml-chap-nav');
    //console.log(navCss);

	function change(aa){
        var bb=getEls('tbody>tr>td>a');
        var cc=null;
        if(bb.length!=0){
            console.log(bb[bb.length-1].href);
            cc=bb[bb.length-1].href;
        }
		var div = document.createElement('div');
		//div.innerHTML='<a style = "cursor:pointer;text-decoration:none;position:fixed !important;bottom: 5%;right:50%;" href="javascript:window.opener=null;window.close();">------------Exit------------</a>';
		//div.innerHTML='<a style="cursor:pointer;text-decoration: none; color: white;margin: 8px; background-color: #444; padding: 6px 10px; font-size: 150%; border-radius: 5px;" href="javascript:window.opener=null;window.close();">-- Exit --</a><a href="'+cc+'">NEXT PAGE</a>';
		div.innerHTML='<a class="ml-chap-nav" href="javascript:window.opener=null;window.close();">--- EXIT ---</a>\n<a class="ml-chap-nav" href="'+cc+'">NEXT PAGE</a>';
		//div.style='font-size: 30px; text-align:center; height:60px';
        div.style='position: fixed;right: 30%;z-index: 99;background: #F9EFFC;font-size: 12px;margin: 10px;padding: 14px 18px; border-radius: 5px; display: block;bottom: 20%;visibility: visible;opacity: 0.6;'
		aa.style.fontSize='100px';
   //     aa.style.position='fixed';
		aa.parentNode.insertBefore(div,aa);
	}

	var aa;
	if(aa = getEl('.ptb'))change(aa);
//	if(aa = getEl('.ptt'))change(aa);
    addStyle('main', true, navCss);
	try{
        var x = document.getElementsByClassName("gl3t");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].getElementsByTagName("a")[0].setAttribute("target","_blank");
        }
    }catch(err) {}
    // Your code here...
})();