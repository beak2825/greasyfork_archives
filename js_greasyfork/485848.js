// ==UserScript==
// @name         CivitAI without BS
// @namespace    aolko
// @version      0.3
// @description  Scrape the BS out of civitai
// @author       aolko
// @license      MIT
// @match        https://*civitai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=civitai.com
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/485848/CivitAI%20without%20BS.user.js
// @updateURL https://update.greasyfork.org/scripts/485848/CivitAI%20without%20BS.meta.js
// ==/UserScript==

/*globals $*/
/*globals jQuery*/

var civit__options = {
    "cleanSocials": true,
    "cleanGreedySections": true,
};

(function($) {
  $.fn.observeChanges = function(callback) {
    const observer = new MutationObserver((mutationsList, observer) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList') {
          callback.call(this);
        }
      });
    });

    return this.each(function() {
      observer.observe(this, { childList: true, subtree: true });
    });
  };
})(jQuery);

(function($) {
  $.fn.exists = function(threshold, callback) {
    if (typeof threshold === 'function') {
      callback = threshold;
      threshold = 0;
    }

    const options = {
      threshold: threshold
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const $element = $(entry.target);
          callback.call($element);
          $element.data('exists', true);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    return this.each(function() {
      const $this = $(this);
      if (!$this.data('exists')) {
        observer.observe(this);
      }
    });
  };
})(jQuery);

var civit__header = `#root > .mantine-Header-root > .mantine-Grid-root`;
var civit__body = `#root > div:nth-child(2) main`;
var civit__footer = `#root .mantine-Footer-root > .mantine-Group-root`;


function civit__cleanHeader(){
    var header = civit__header;
    if(civit__options.cleanGreedySections){
        $(`${header} > .mantine-Grid-col:nth-child(1) a.mantine-UnstyledButton-root.mantine-Button-root[href^="/pricing"]`).remove();
        $(`${header} > .mantine-Grid-col:nth-child(3) .mantine-Group-root:nth-child(2) button:nth-child(1)`).attr("disabled",true);
        $(`${header} > .mantine-Grid-col:nth-child(3) .mantine-UnstyledButton-root > div > .mantine-Text-root`).remove();
    }
    //$(`${header} > .mantine-Grid-col:nth-child(4) :nth-child(4)`).remove();
    $(`${header} > .mantine-Grid-col:nth-child(3) .mantine-Indicator-root:nth-child(6)`).remove();
    $(`${header}`).observeChanges(function() {
        $(this).find(`.mantine-Grid-col:nth-child(3) .mantine-Menu-dropdown`).exists(0, function() {
            $(this).find(`[data-menu-dropdown="true"] > .mantine-Menu-item:contains("Generate images"),
            [data-menu-dropdown="true"] > .mantine-Menu-item:contains("Train a model"),
            [data-menu-dropdown="true"] > .mantine-Menu-item:contains("Create a bounty")`).remove();
        });
    });
}

function civit__cleanNav(){
    var body = civit__body;
    $(`${body} .mantine-Tabs-root:nth-child(1) > .mantine-Tabs-tabsList > a[href^="/bounties"]`).remove();
}

function civit__cleanAds(){
    var body = civit__body;
    $(`${body} > div > div.mantine-Stack-root > div.mantine-Paper-root`).remove();
    $(`${body} > div > div:nth-child(3) > div:nth-child(1) > div`).remove();
    $(body).observeChanges(function() {
      $(this).find(`div > div:nth-child(3) > div > div`).exists(0.1, function() {
          $(this).not(`:last-child`).css({"display": "none"});
      });
    });
    $(`body`).observeChanges(function() {
      $(this).find(`div.mantine-Stack-root > div > div > div.mantine-Paper-root`).exists(0,function(){
        $(this).remove();
      })
      $(this).find(`div > [dir="ltr"] .mantine-14i2dh4`).exists(0, function() {
        $(this).remove();
      });
    });
}

function civit__cleanFooter(){
    var footer = civit__footer;
    $(`${footer} > div:nth-child(2) > a[href^='/content/careers'],
    ${footer} > div:nth-child(2) > a[href^='/advertise-with-us'],
    ${footer} > div:nth-child(2) > a[href^='/wiki'],
    ${footer} > div:nth-child(2) > a[href^='/discord'],
    ${footer} > div:nth-child(2) > a[href^='/twitter'],
    ${footer} > div:nth-child(2) > a[href^='/instagram'],
    ${footer} > div:nth-child(2) > a[href^='/youtube'],
    ${footer} > div:nth-child(2) > a[href^='/tiktok'],
    ${footer} > div:nth-child(2) > a[href^='/reddit'],
    ${footer} > div:nth-child(2) > a[href^='/github'],
    ${footer} > div:nth-child(2) > a[href^='/twitch']
    `).remove();
    $(`${footer} > :last-child`).remove();
}

/*(function() {
    'use strict';

})();*/
$(function() {
    civit__cleanHeader();
    civit__cleanNav();
    civit__cleanAds();
    civit__cleanFooter();
});