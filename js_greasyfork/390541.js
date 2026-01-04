// ==UserScript==
// @name         张大妈什么值得买页面快捷键
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  张大妈什么值得买页面快捷键功能
// @author       山岚
// @match        *://faxian.smzdm.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390541/%E5%BC%A0%E5%A4%A7%E5%A6%88%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E9%A1%B5%E9%9D%A2%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/390541/%E5%BC%A0%E5%A4%A7%E5%A6%88%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E9%A1%B5%E9%9D%A2%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Start
/**

==========说明书==========
目前支持在“全部好价”等商品页面使用
1. ←翻页
2. →翻页

*/
$( document )
    .keyup( function ( e ) {
        let eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        // var eCode = e;
        let pageLength = $( '.page-turn' ).length;
        switch (eCode) {
            //右方向键
            case 39 :
                // 当只有一个，按下→，那就选下标0的
                if (pageLength === 1) {
                    $( '.page-turn' )[0]
                        .click();
                    // console.log( '右方向键' );
                }
                // 如果有2个，还是→，那么肯定选第二个，也就是下标1
                else if (pageLength === 2) {
                    $( '.page-turn' )[1]
                        .click();
                    // console.log( '右方向键' );
                }
                break;
            //左方向键
            case 37 :
                // 不管是1个还是2个，都默认0下标的
                if (pageLength === 1) {
                    alert( '已经是在第一页啦' )
                } else if (pageLength === 2) {
                    $( '.page-turn' )[0]
                        .click();
                    // console.log( '左方向键' );
                }
                break;
            default:
            // let keychar = String.fromCharCode( eCode );
            // console.info( '按键对象=', e, '--键码=', e.keyCode, '，--按键值=', 'keytyep=', e.key );
        }
    } );




    //End
})();