// ==UserScript==
// @name         自动打开字幕
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  包括切换分P后也自动打开字幕，可自由切换是否只在有分P的视频生效。  
// @author       aotmd
// @match        https://www.bilibili.com/video/*
// @noframes
// @license MIT
// @run-at document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499054/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/499054/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==


( function() {
    let setting={
        /*true或者false*/
        只在有分P的视频生效:true
    }
    addLoadEvent( () => {
        window.setTimeout( () => {
            if(setting.只在有分P的视频生效&&!document.querySelector("#multi_page"))return;

            var flag = setInterval( () => {
                if ( !document.querySelector( "div.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle > div.bpx-player-ctrl-btn-icon > span" ) ) return;
                document.querySelector( "div.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle > div.bpx-player-ctrl-btn-icon > span" ).click();
                clearInterval( flag );
            }, 1 );

            var video = document.querySelector( "div.bpx-player-video-perch > div > video" );
            video.addEventListener( 'loadedmetadata', function() {
                setTimeout( () => {
                    document.querySelector( "div.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle > div.bpx-player-ctrl-btn-icon > span" ).click();
                }, 1000 )
            } );
        }, 1000 );
    } );
    // 等待网页完成加载
    window.addEventListener( 'load', function() {
        // 加载完成后执行的代码
    }, false );
    //仅第一次进入网页时加载代码.
    const {
        href
    } = window.location;
    const alreadyLoaded = JSON.parse( localStorage.loaded || '[]' );
    if ( !alreadyLoaded.includes( href ) ) {
        alreadyLoaded.push( href );
        localStorage.loaded = JSON.stringify( alreadyLoaded );
        window.addEventListener( 'load', () => {
            // 加载完成后执行的代码
        } );
    }
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

    //添加css样式
    function addStyle( rules ) {
        let styleElement = document.createElement( 'style' );
        styleElement[ "type" ] = 'text/css';
        document.getElementsByTagName( 'head' )[ 0 ].appendChild( styleElement );
        styleElement.appendChild( document.createTextNode( rules ) );
    }
} )();