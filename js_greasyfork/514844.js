// ==UserScript==
// @name         Torn Debug Item Finder
// @namespace    torn.debug.item.finder
// @version      2024-10-30
// @description  Adds a test item and item ID textbox to find new items
// @author       Heasley
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/514844/Torn%20Debug%20Item%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/514844/Torn%20Debug%20Item%20Finder.meta.js
// ==/UserScript==
const start_num = 1448;

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      if (mutation.target && mutation.target.nodeName && mutation.target.nodeName === "UL") {
        if (mutation.target.parentElement && mutation.target.parentElement.id && mutation.target.parentElement.id == "category-wrap") {
          //if (mutation.previousSibling != null) return;

          if (mutation.addedNodes[0].firstChild && mutation.addedNodes[0].firstChild.className && mutation.addedNodes[0].firstChild.className.includes("ajax-placeholder")) return;

          if (mutation.addedNodes[0].firstChild && mutation.addedNodes[0].firstChild.className && mutation.addedNodes[0].firstChild.className.includes("ajax-item-loader")) return;

          if (mutation.addedNodes[0].firstChild && mutation.addedNodes[0].firstChild.className && mutation.addedNodes[0].firstChild.className.includes("ajax-preloader")) return;

          if (mutation.addedNodes[0] && mutation.addedNodes[0].className && mutation.addedNodes[0].className.includes("ajax-item-loader")) return;


          for (const element of mutation.addedNodes) {
            if (!element) return;


             console.log(mutation);

              if ($('ul#collectibles-items').length && !$('#wb-test-item').length) {
                  insertTestItem();
              }
          }//for
        }
      }
    }
  })
});


(function() {
    'use strict';
    initObserver();
    insertFloatingDebugMenu();
})();

function insertFloatingDebugMenu() {
     const debug_menu = `<span id="wb-debug" class="wb-debug-menu">
     <label for="wb_debug">Enter item ID:</label>
     <input type="number" id="wb_debug" name="wb_debug" value="${start_num}" />
     </span>`;
    if ($('#wb-debug').length) {
        return;
    }
    $('body').append(debug_menu);

    $('#wb_debug').on('change',function() {
       const num = $(this).val();
       var src = `/images/items/${num}/medium.png`;
       var srcset = `/images/items/${num}/medium.png 1x, /images/items/${num}/medium@2x.png 2x, /images/items/${num}/medium@3x.png 3x, /images/items/${num}/medium@4x.png 4x`;
       var test_item = $('#wb-test-item');

       test_item.attr('data-item', num);
       test_item.attr('data-rowkey', `g${num}`);
       test_item.find('.item-plate .torn-item').attr('src',src);
       test_item.find('.item-plate .torn-item').attr('srcset',srcset);
       test_item.find('.title-wrap .image-wrap > img').attr('src',src);
       test_item.find('.title-wrap .image-wrap > img').attr('srcset',srcset);
    });
}

function insertTestItem() {
    const test_item = `
<li id="wb-test-item" class="last-row" data-class="" data-equipped="false" data-loaded="0" data-item="${start_num}" data-rowkey="g${start_num}" data-category="Collectible" data-sort="1 a Test Item" data-qty="1">
            <div class="thumbnail-wrap" tabindex="0" aria-label="a Test Item">
    <div class="thumbnail">
        <span class="item-plate glow-purple">
            <img class="torn-item medium" src="/images/items/${start_num}/medium.png" srcset="/images/items/${start_num}/medium.png 1x, /images/items/${start_num}/medium@2x.png 2x, /images/items/${start_num}/medium@3x.png 3x, /images/items/${start_num}/medium@4x.png 4x" alt="a Test Item">
        </span>
        <div class="item-amount qty"></div>
        <div class="hover">
            <button aria-label="Show info: a Test Item" class="item-info wai-btn" tabindex="0"></button>
            <button aria-label="Show options a Test Item" class="item-options wai-btn" tabindex="0"></button>
                        <div class="clear"></div>
        </div>
    </div>
</div>

<div class="title-wrap">
    <div class="title left">
	<span class="image-wrap glow-purple">
                    <img class="torn-item medium" src="/images/items/${start_num}/medium.png" srcset="/images/items/${start_num}/medium.png 1x, /images/items/${start_num}/medium@2x.png 2x, /images/items/${start_num}/medium@3x.png 3x, /images/items/${start_num}/medium@4x.png 4x" alt="a Test Item">

	</span>
        <span class="name-wrap">
	   <span class="qty bold d-hide"></span>
	   <span class="name">a Test Item</span>
	   <span class="qty bold t-hide"></span>
	</span>
            </div>
</div>
            <div class="clear"></div>
            <div class="view-item-info">
                <div class="clear"></div>
                <div class="item-cont">
                    <div class="item-wrap">
                    <span class="info-msg">
                        <p>
                            <span class="ajax-preloader m-top10 left "></span>
                        </p>
                    </span>
                        <button aria-label="Close" class="close-icon wai-btn"></button>
                    </div>
                </div>
            </div>
        </li>
`;



    $('ul#collectibles-items').append(test_item);
}


function initObserver() {
  var target = document.querySelector('div.items-wrap');
  if (target && !target.classList.contains("re_obsinit")) {
    target.classList.add("re_obsinit");
    observer.observe(target, {attributes: false, childList: true, characterData: false, subtree:true});
  }
}


GM_addStyle(`
.wb-debug-menu {
    z-index: 99999;
    height: 50px;
    width: 145px;
    color: #ff5722;
    cursor: pointer;
    right: 0px;
    top: 170px !important;
    padding: 11px 30px 11px 10px;
    box-sizing: border-box;
    border: 1px solid var(--default-panel-divider-outer-side-color);
    position: fixed;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);

    display: flex;
    justify-content: space-between;
    align-items: center;
    text-shadow: var(--default-tabs-text-shadow);
    background: var(--info-msg-bg-gradient);
    box-shadow: var(--default-tabs-box-shadow);
    border-radius: 5px;
    overflow: hidden
}

#wb_debug {
    width: 55px;
    height: 20px;
    line-height: 20px;
    border-radius: 3px;
}

`);