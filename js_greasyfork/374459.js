// ==UserScript==
// @name         pixivの作品一覧をトリミングせずに表示
// @namespace    https://armedpatriot.blog.fc2.com/
// @version      1.3.1
// @description  pixivのプロフィール画面(ユーザーのイラストやマンガが一覧表示される画面)と、作品画面の下に表示される作者の作品一覧内の作品が、正方形にトリミングされて表示されるのを防止します。
// @author       Patriot
// @homepageURL  https://armedpatriot.blog.fc2.com/
// @run-at       document-end
// @match        https://www.pixiv.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374459/pixiv%E3%81%AE%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7%E3%82%92%E3%83%88%E3%83%AA%E3%83%9F%E3%83%B3%E3%82%B0%E3%81%9B%E3%81%9A%E3%81%AB%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/374459/pixiv%E3%81%AE%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7%E3%82%92%E3%83%88%E3%83%AA%E3%83%9F%E3%83%B3%E3%82%B0%E3%81%9B%E3%81%9A%E3%81%AB%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const isCustomThumbTrim=true,// サムネイルクロップ機能が使われている作品であってもトリミングしない場合はtrue、トリミングを維持する場合はfalseにしてください
          illustSelector="[src^='https://i.pximg.net/c/']",
          replacedClassTag="trim_removed",
          illustUnreplacedSelector=`${illustSelector}:not(.${replacedClassTag})`;

    //
    // イラストを正方形にトリミングしないためのCSSを追加
    //
    let styleElement = document.createElement('style');
    document.getElementsByTagName('head')[0].appendChild(styleElement);
    let css = styleElement.sheet;
    css.insertRule(`${illustSelector}{object-fit:contain!important;}`, css.cssRules.length);

    //
    // トリミングされているイラストを、トリミングされていないイラストのサムネイルに置き換えるループ
    //
    if(isCustomThumbTrim){
        setInterval(//TODO: 画像が読み込まれるタイミングが分からないので、ひとまず無限ループ
            ()=>{// 全ての箇所に適用できるようなMutationObserverの利用は、親コンテナ要素に統一性が無いので難しい
                Array.from(document.querySelectorAll(illustUnreplacedSelector)).forEach(e=>{
                    e.src=e.src.replace(/250x250_.+?\//, "240x240/").replace(/288x288_.+?\//, "360x360_70/").replace("custom-thumb", "img-master").replace(/(square|custom)1200/, "master1200");
                    e.classList.add(replacedClassTag);
                });
            },
            300
        );
    }else{
        setInterval(//TODO: 画像が読み込まれるタイミングが分からないので、ひとまず無限ループ
            ()=>{// 全ての箇所に適用できるようなMutationObserverの利用は、親コンテナ要素に統一性が無いので難しい
                Array.from(document.querySelectorAll(illustUnreplacedSelector)).forEach(e=>{
                    e.src=e.src.replace(/250x250_.+?\//, "240x240/").replace("square1200", "master1200");
                    e.classList.add(replacedClassTag);
                });
            },
            300
        );
    }
})();