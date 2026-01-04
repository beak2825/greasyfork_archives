// ==UserScript==
// @name         QQ,微博短链接直接跳转
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  跳过垃圾非官方页面的提示
// @author       aotmd
// @match        https://c.pc.qq.com/*
// @match        http://t.cn/*
// @license MIT
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/428923/QQ%2C%E5%BE%AE%E5%8D%9A%E7%9F%AD%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/428923/QQ%2C%E5%BE%AE%E5%8D%9A%E7%9F%AD%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
( function() {
/*QQ提示*/
if ( /https:\/\/c\.pc\.qq\.com\/.+/.test( location.href ) ) {
    try {
        let pfurl=getQueryString( "pfurl" );
        if(pfurl!=null){
            window.location.href = decodeURIComponent( getQueryString( "pfurl" ) )
        }
    } catch ( e ) {}
}
    addLoadEvent( () => {
        window.setTimeout( () => {
            /*QQ提示*/
            if ( /https:\/\/c\.pc\.qq\.com\/.+/.test( location.href ) ) {
                window.location.href = document.querySelector( "#url" ).innerText;
            }
            /*微博短链提示*/
            if ( /http:\/\/t\.cn\/.+/.test( location.href ) ) {
                window.location.href = document.querySelector( ".open-url>a" ).href;
            }
        }, 0 );
    } );

    addStyle( `` );

    /**
     * 添加浏览器执行事件
     * @param func 无参匿名函数
     */
    function addLoadEvent( func ) {
        let oldOnload = window.onload;
        if ( typeof window.onload != 'function' ) {
            window.onload = func;
        } else {
            window.onload = function() {
                try {
                    oldOnload();
                } catch ( e ) {
                    console.log( e );
                } finally {
                    func();
                }
            }
        }
    }
    /**
     * 获取get传的参数
     * @param name 参数名称
     * @returns {string|null}
     */
    function getQueryString( name ) {
        var reg = new RegExp( "(^|&)" + name + "=([^&]*)(&|$)", "i" );
        var r = decodeURI( window.location.search ).substr( 1 ).match( reg );
        if ( r != null ) return ( r[ 2 ] );
        return null;
    }
    //添加css样式
    function addStyle( rules ) {
        let styleElement = document.createElement( 'style' );
        styleElement[ "type" ] = 'text/css';
        document.getElementsByTagName( 'head' )[ 0 ].appendChild( styleElement );
        styleElement.appendChild( document.createTextNode( rules ) );
    }
} )();