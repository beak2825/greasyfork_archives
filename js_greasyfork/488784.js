// ==UserScript==
// @name              JumpToUCASS_VPN
// @name:zh-CN        社科VPN跳转
// @author            PeterPanWF
// @description        CNKI JumpToUCASS_VPN
// @description:zh-cn  知网文献社科VPN跳转
// @version           0.1
// @match             *://*cnki.net/*
// @namespace    https://greasyfork.org/users/sisopc
// @grant             unsafeWindow
// @grant             GM_openInTab
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM.getValue
// @grant             GM_setValue
// @grant             GM.setValue
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488784/JumpToUCASS_VPN.user.js
// @updateURL https://update.greasyfork.org/scripts/488784/JumpToUCASS_VPN.meta.js
// ==/UserScript==
(function() {
    /**
    * 遵循开源协议,转载请注明出处谢谢
    * 此脚本参考代码相应位置附有出处
    */
    'use strict';

$(function(){

   	const css = css => {
		const myStyle = document.createElement('style');
        myStyle.textContent = css;
        const doc = document.head || document.documentElement;
		    doc.appendChild(myStyle);
	  }
    css(`#zuihuitao {cursor:pointer; position:fixed; top:100px; left:0px; width:0px; z-index:2147483647; font-size:12px; text-align:left;}
			#zuihuitao .logo { position: absolute;right: 0; width: 1.375rem;padding: 10px 2px;text-align: center;color: red;cursor: auto;user-select: none;border-radius: 0 4px 4px 0;transform: translate3d(100%, 5%, 0);background: yellow;}
			#zuihuitao .die {display:none; position:absolute; left:28px; top:0; text-align:center;background-color:#04B4AE; border:1px solid gray;}
			#zuihuitao .die li{font-size:12px; color:#fff; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray;border-radius: 6px 6px 6px 6px; padding:0 4px; margin:4px 2px;list-style-type: none;}
			#zuihuitao .die li:hover{color:#fff;background:#FE2E64;}
            @media print {body {display: block !important;}}
            *{-webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text;}
			.add{background-color:#FE2E64;}
            .btn-success{position: fixed;font-weight: 400;color: #fff;background-color: #28a745;border-color: #28a745;text-align: center;vertical-align: middle;border: 1px solid transparent;padding: .375rem .75rem;font-size: 1rem;line-height: 1.5;border-radius: .25rem; z-index:2147483647;cursor: pointer;}`);


	  const html = '<div id=\'zuihuitao\'><div class=\'item_text\'><div class=\"logo\"><a id=\"m\">跳转VPN</a></div></div></div>';
    document.body.insertAdjacentHTML('beforebegin', html);
    document.getElementById('zuihuitao').onclick=function(){
      var ucasshost='https://libdb.ucass.edu.cn/piskns.cnki.net';
      //var vpndomain='.vpn.ucass.edu.cn';
      var tmp=location.toString().split(location.host);
      var res=tmp[1];
      console.log(res);
      location.replace(ucasshost+res);
    };
});
})();
