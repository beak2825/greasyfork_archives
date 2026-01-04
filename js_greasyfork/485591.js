// ==UserScript==
// @name            oo.pe redirection remover
// @name:ko         oo.pe 리디렉션 제거기
// @namespace       OOPE_REMOVER_V1
// @match           https://arca.live/b/*
// @run-at          document-end
// @version         1.24
// @author          Laria
// @description     remove oo.pe redirection in Arca.live
// @description:ko  아카라이브 oo.pe 리디렉션을 제거합니다.
// @supportURL      https://greasyfork.org/scripts/485591
// @icon            https://www.google.com/s2/favicons?sz=64&domain=oo.pe
// @license         MIT
// @encoding        utf-8
// @downloadURL https://update.greasyfork.org/scripts/485591/oope%20redirection%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/485591/oope%20redirection%20remover.meta.js
// ==/UserScript==

/*
 * Note: Please install with greasyfork, it will update automatically..
 *
 * More info. https://greasyfork.org/scripts/485591
 *
*/

/*
 * == Change log ==
 * 1.0 - release
 * 1.1 - add retry
 * 1.2 - detect comment reload
 * 1.21 - apply link's description
 * 1.22 - check article comment before register event listner, retry 7 -> 10
 * 1.23 - add site:unsafelink(unsafelink.com)
 * 1.24 - remove all listener on exrenal link (to remove redirection modal)
 */

//root
(function() {
  'use strict';

  //target list
  const targetList = [
    'oo.pe',
    'unsafelink.com', //added in 1.23
  ];

  function resolveLink(tar = 'all') {
    function _resolveLink(_container, _link) {
      function _res(_tar) {
        //tokenizing
        const token = _tar.split('/');
        //search oo.pe prefix
        const pref = token.indexOf(_link);
        //join link after prefix
        return token.slice(pref + 1).join('/');
      }
      //search link include 'oo.pe'
      _container.querySelectorAll(`a[href*="${_link}"]`).forEach(function(src) {
        try {
          src.title = _res(src.title);
          src.href = _res(src.href);
        } catch (_) {}
      });
      //remove popup modal listner
      _container.querySelectorAll('a.external').forEach((_tar)=>{
        _tar.parentNode.replaceChild(_tar.cloneNode(true), _tar);
      });

    }
    //no target -> body and comment
    if(tar == 'all') {
      resolveLink('.article-body');
      resolveLink('.article-comment');
    } else {
      //try to resolve registered link
      targetList.forEach((_tarLink)=>{_resolveLink(document.querySelector(tar), _tarLink);});
    }
  }
  //try entire
  resolveLink();

  //repeat resolve
  setTimeout(() => {
    resolveLink();
  }, 50);

  //add event listner when refresh comment after 0.2sec
  setTimeout(() => {
    resolveLink();
    if(document.querySelector('.article-comment')) {
      //resolve link when comment reload
      document.querySelector('.article-comment').querySelector('.newcomment-alert').addEventListener('click', (event) => {
        event.preventDefault();
        //try to resole while server connection pending (1000ms)
        for (let i = 1; i <= 10; i++) {
          setTimeout(() => {
            resolveLink('.article-comment');
          }, 100 * i);
        }
      });
    }
  }, 200);
})();
