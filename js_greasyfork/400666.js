// ==UserScript==
// @name            AlphaKaikin
// @name:ja         α解禁
// @namespace       https://furyutei.work
// @license         MIT
// @version         0.0.1
// @description     Enables range selection and context menu display in the body of the Alphapolis novel
// @description:ja  アルファポリス小説本文の範囲選択やコンテキストメニュー表示等を可能に
// @author          furyu
// @match           https://www.alphapolis.co.jp/novel/*
// @grant           none
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/AlphaKaikin/issues
// @contributionURL https://memo.furyutei.work/about#%E6%B0%97%E3%81%AB%E5%85%A5%E3%81%A3%E3%81%9F%E5%BD%B9%E3%81%AB%E7%AB%8B%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%8A%E6%B0%97%E6%8C%81%E3%81%A1%E3%81%AF%E3%82%AE%E3%83%95%E3%83%88%E5%88%B8%E3%81%A7
// @downloadURL https://update.greasyfork.org/scripts/400666/AlphaKaikin.user.js
// @updateURL https://update.greasyfork.org/scripts/400666/AlphaKaikin.meta.js
// ==/UserScript==

( () => {
const
    remove_copyguard = () => {
        $( window ).on( 'focusout', ( event ) => event.stopImmediatePropagation() );
        let handlers = $._data( window ).events.focusout;
        handlers.unshift( handlers.pop() );
        $( '#novelBoby' ).css( 'user-select', '' );
        delete document.oncopy;
        delete document.onselectstart;
        delete document.oncontextmenu;
        document.addEventListener( 'copy', ( event ) => event.stopPropagation(), true );
        document.addEventListener( 'selectstart', ( event ) => event.stopPropagation(), true );
        document.addEventListener( 'contextmenu', ( event ) => event.stopPropagation(), true );
    },
    script = document.createElement( 'script' );

script.async = false;
script.textContent = '(' + remove_copyguard.toString() +')();';
document.documentElement.appendChild( script );
} )();
