// ==UserScript==
// @name         swagger ui wide mode
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Swagger UI 宽屏切换⇋
// @author       zxy
// @match        http://*/swagger-ui.html*
// @include        /.*\/swagger-ui\.html.*/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441056/swagger%20ui%20wide%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/441056/swagger%20ui%20wide%20mode.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //默认宽屏
    $('.swagger-ui-wrap').css('max-width','2000px');

  function createExpand () {
    document.querySelector('#api_selector').insertAdjacentHTML('beforeend', '<div class="input"><a id="wideNarrowBtn" class="header__btn" href="#" data-sw-translate="">WideMode⇋</a></div>');
    document.querySelector('#wideNarrowBtn').onclick = narrow
    function wide() {
        $('.swagger-ui-wrap').css('max-width','2000px');
        document.querySelector('#wideNarrowBtn').onclick = narrow
    }
    function narrow() {
        $('.swagger-ui-wrap').css('max-width','960px');
        document.querySelector('#wideNarrowBtn').onclick = wide
    }
  }


  createExpand();

})();