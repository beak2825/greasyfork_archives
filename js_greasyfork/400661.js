// ==UserScript==
// @name            ReloadSuppression_tameshiyo.me
// @name:ja         リロードちょい待ち！(tameshiyo.me用)
// @namespace       https://furyutei.work
// @license         MIT
// @version         0.0.1
// @description     Suppress unexpected reloads in tameshiyo.me
// @description:ja  楽園WEB増刊等(tameshiyo.me)での予期せぬリロードを抑制
// @author          furyu
// @match           http*://*.tameshiyo.me/*
// @grant           none
// @compatible      chrome
// @compatible      firefox
// @supportURL      https://github.com/furyutei/ReloadSuppression_tameshiyo.me/issues
// @contributionURL https://memo.furyutei.work/about#%E6%B0%97%E3%81%AB%E5%85%A5%E3%81%A3%E3%81%9F%E5%BD%B9%E3%81%AB%E7%AB%8B%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%8A%E6%B0%97%E6%8C%81%E3%81%A1%E3%81%AF%E3%82%AE%E3%83%95%E3%83%88%E5%88%B8%E3%81%A7
// @downloadURL https://update.greasyfork.org/scripts/400661/ReloadSuppression_tameshiyome.user.js
// @updateURL https://update.greasyfork.org/scripts/400661/ReloadSuppression_tameshiyome.meta.js
// ==/UserScript==

( () => {
const
    patch_func = () => {
        const
            setTimeoutOrig = window.setTimeout;
        
        window.setTimeout = function ( func, delay ) {
            if ( ( delay < 1000 ) && ( 0 <= func.toString().indexOf( '"pjax:timeout"' ) ) ) {
                // function(){l("pjax:timeout",[t,e])&&t.abort("timeout")}
                delay = 30000; // 650ms待ち(2020/04/09現在)→30秒待ち
            }
            setTimeoutOrig.call( this, func, delay );
        }
    },
    script = document.createElement( 'script' );

script.async = false;
script.textContent = '(' + patch_func.toString() +')();';
document.documentElement.appendChild( script );
} )();
