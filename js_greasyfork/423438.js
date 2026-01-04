// ==UserScript==
// @name         MouseHunt - Shop's Helper
// @author       Hazado
// @namespace    https://greasyfork.org/en/scripts/423438
// @version      1.5
// @description  Adds useful features to the shop
// @include      https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/423438/MouseHunt%20-%20Shop%27s%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/423438/MouseHunt%20-%20Shop%27s%20Helper.meta.js
// ==/UserScript==

if (!localStorage.getItem("maxOwnedItems")) {
  localStorage.setItem("maxOwnedItems", "Y");
}

$(document).ready(function () {
  var observerMaxItem = new MutationObserver(callback);
  var observerOptionsMaxItem = {
    childList: true,
    attributes: true,
    subtree: true
  };
  if ($('.mousehuntHud-page-tabHeader.cheese_shoppe').get(0) || $('.mousehuntHud-page-tabHeader.trapsmith').get(0) || $('.mousehuntHud-page-tabHeader.charm_shoppe').get(0) || $('.mousehuntHud-page-tabHeader.general_store').get(0) || $('.mousehuntHud-page-tabHeader.cartographer').get(0) || $('.mousehuntHud-page-tabHeader.kings_cart').get(0)) {
    AddShopPageFeatures();
    hideMaxOwned();
    minimize();
    observerMaxItem.observe($('.mousehuntHud-page-tabContentContainer').get(0), observerOptionsMaxItem);
  } else if ($('.mousehuntHud-page-tabContent.game_settings').get(0)) {
    addSetting();
    observerMaxItem.observe($('.mousehuntHud-page-tabContentContainer').get(0), observerOptionsMaxItem);
  } else if ($('.mousehuntHud-page-tabContentContainer').get(0)) {
    //not on profile at all. probably at camp.
    observerMaxItem.observe($('.mousehuntHud-page-tabContentContainer').get(0), observerOptionsMaxItem);
  } else {
    return false
  }
});

function callback(mutationList, observer) {
  mutationList.forEach(mutation => {
    if (mutation.type == 'attributes') {
      let $nodes = $(mutation.target);
      if ($nodes.hasClass('cheese_shoppe') || $nodes.hasClass('trapsmith') || $nodes.hasClass('charm_shoppe') || $nodes.hasClass('general_store') || $nodes.hasClass('cartographer') || $nodes.hasClass('kings_cart')) {
        AddShopPageFeatures();
        hideMaxOwned();
        minimize();
      } else if ($nodes.hasClass('mousehuntHud-page-tabContent game_settings')) {
        if (!$('div:contains("Hide Max Owned Items in Shop")').get(0)) {
          addSetting()
        }
      }
    }
  })
};

function addSetting() {
  //Add Shop's Helper Header
  $('.mousehuntHud-page-tabContent.game_settings.active').append('<div class="PagePreferences__section"><div class="PagePreferences__title">Shop\'s Helper</div><div class="PagePreferences__separator"></div><div class="PagePreferences__settingsList"></div>')

  //Hide Max owned items
  if (localStorage.getItem("maxOwnedItems") == "Y") {
    $('.PagePreferences__settingsList').eq(4).append('<div class="PagePreferences__setting"><div class="PagePreferences__settingLabel"><div class="name">Hide Max Owned Items in Shop</div><div class="PagePreferences__settingDefault">Hidden</div><div class="PagePreferences__settingDescription">It hides all items you own the max of when enabled.</div></div><div class="settingRow-action"><div class="settingRow-action-inputContainer"><div class="dropdownContainer"><select name="maxOwnedItems" onchange="localStorage.setItem(\'maxOwnedItems\',$(this)[0].value)" style="width: 184px;"><option value="Y" selected="">Hidden</option><option value="NAME">Minimized</option><option value="N">None</option></select></div></div></div></div></div></div>')
  } else if (localStorage.getItem("maxOwnedItems") == "NAME") {
    $('.PagePreferences__settingsList').eq(4).append('<div class="PagePreferences__setting"><div class="PagePreferences__settingLabel"><div class="name">Hide Max Owned Items in Shop</div><div class="PagePreferences__settingDefault">Hidden</div><div class="PagePreferences__settingDescription">It hides all items you own the max of when enabled.</div></div><div class="settingRow-action"><div class="settingRow-action-inputContainer"><div class="dropdownContainer"><select name="maxOwnedItems" onchange="localStorage.setItem(\'maxOwnedItems\',$(this)[0].value)" style="width: 184px;"><option value="Y">Hidden</option><option value="NAME" selected="">Minimized</option><option value="N">None</option></select></div></div></div></div></div></div>')
  } else {
    $('.PagePreferences__settingsList').eq(4).append('<div class="PagePreferences__setting"><div class="PagePreferences__settingLabel"><div class="name">Hide Max Owned Items in Shop</div><div class="PagePreferences__settingDefault">Hidden</div><div class="PagePreferences__settingDescription">It hides all items you own the max of when enabled.</div></div><div class="settingRow-action"><div class="settingRow-action-inputContainer"><div class="dropdownContainer"><select name="maxOwnedItems" onchange="localStorage.setItem(\'maxOwnedItems\',$(this)[0].value)" style="width: 184px;"><option value="Y">Hidden</option><option value="NAME">Minimized</option><option value="N" selected="">None</option></select></div></div></div></div></div></div>')
  }
}

//Global Minimize
function minimize() {
  if (jQuery._data(document.getElementsByClassName('itemPurchaseView-content-name')[0], 'events') == undefined) {
    $('.itemPurchaseView-container').children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-name').click(function () {
      if ($(this).parents().eq(2).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image').css('display') == "none") {
        localStorage.removeItem("hide_" + $(this).parents().eq(2).attr('data-item-id'));
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image').css('display', "");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemViewStatBlock').css('display', "");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image-trapPreview-link').css('display', "");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-action-container').css('display', "");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-details').css('display', "");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-description').css('display', "");
      } else {
        if ($(this).parents().eq(2).attr('data-item-id')) {
          localStorage.setItem("hide_" + $(this).parents().eq(2).attr('data-item-id'), true);
        }
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image').css('display', "none");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemViewStatBlock').css('display', "none");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image-trapPreview-link').css('display', "none");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-action-container').css('display', "none");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-details').css('display', "none");
        $(this).parents().eq(2).children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-description').css('display', "none");
      }
    });
  }
}

function hideMaxOwned() {
  if (localStorage.getItem("maxOwnedItems") == "Y") {
    $('[class*="own_max"]').css('visibility', "collapse");
    $('[class*="own_max"]').css('margin-bottom', "-2px");
  } else if (localStorage.getItem("maxOwnedItems") == "NAME") {
    $('[class*="own_max"]').children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image').css('display', "none");
    $('[class*="own_max"]').children().children().filter('.itemPurchaseView-image-container').children().filter('.itemViewStatBlock').css('display', "none");
    $('[class*="own_max"]').children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image-trapPreview-link').css('display', "none");
    $('[class*="own_max"]').children().children().filter('.itemPurchaseView-action-container').css('display', "none");
    $('[class*="own_max"]').children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-details').css('display', "none");
    $('[class*="own_max"]').children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-description').css('display', "none");
  }
}

//Search function for each page
function filter(search) {
  $('.shopsPage-header-container').parents().slice(0, 6).filter('.active').children().children().filter('.itemPurchaseView-container').children().children().children().filter('.itemPurchaseView-content-name').each(function () {
    if ($(this).text().toLowerCase().includes(search.toLowerCase())) {
      if (localStorage.getItem("maxOwnedItems") == "Y" && $(this).parents().eq(2).hasClass('own_max')) {}
      else {
        $(this).parents().eq(2).css('visibility', "");
        $(this).parents().eq(2).css('margin-bottom', "");
      }
    } else {
      $(this).parents().eq(2).css('visibility', "collapse");
      $(this).parents().eq(2).css('margin-bottom', "-2px");
    }
  })
}

//Quantity filter for each page
function quantity(search) {
  $('.shopsPage-header-container').parents().slice(0, 6).filter('.active').children().children().filter('.itemPurchaseView-container').each(function () {
    if ((parseInt($(this).attr('data-num-owned')) >= parseInt(search) && parseInt(search) > 0) || localStorage.getItem("hide_" + $(this).attr('data-item-id')) == "true") {
      $(this).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image').css('display', "none");
      $(this).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemViewStatBlock').css('display', "none");
      $(this).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image-trapPreview-link').css('display', "none");
      $(this).children().children().filter('.itemPurchaseView-action-container').css('display', "none");
      $(this).children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-details').css('display', "none");
      $(this).children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-description').css('display', "none");
    } else {
      if (localStorage.getItem("hide_" + $(this).attr('data-item-id')) == "true") {}
      else {
        $(this).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image').css('display', "");
        $(this).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemViewStatBlock').css('display', "");
        $(this).children().children().filter('.itemPurchaseView-image-container').children().filter('.itemPurchaseView-image-trapPreview-link').css('display', "");
        $(this).children().children().filter('.itemPurchaseView-action-container').css('display', "");
        $(this).children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-details').css('display', "");
        $(this).children().children().filter('.itemPurchaseView-content-container').children().filter('.itemPurchaseView-content-description').css('display', "");
      }
    }
  })
}

function AddShopPageFeatures() {
  //Adds Search Box to each page
  if ($('.shopsPage-header-container').parents().slice(0, 6).children().filter('.mousehuntHud-page-subTabHeader-container').has('input').length == 0) {
    $('.shopsPage-header-container').parents().slice(0, 6).children().filter('.mousehuntHud-page-subTabHeader-container').append('<input data-filter="search" type="text" value="" maxlength="20" placeholder="Search" style="float: right;width: 100px">');
    $('.shopsPage-header-container').parents().slice(1, 4).children().filter('.shopsPage-header-container').after('<div class="mousehuntHud-page-subTabHeader-container"  style="margin-bottom: 44px;"><input data-filter="search" type="text" value="" maxlength="20" placeholder="Search" style="float: right;width: 100px"></div>');
    $('.shopsPage-header-container').parents().slice(5).children().filter('.shopsPage-header-container').after('<div class="mousehuntHud-page-subTabHeader-container"  style="margin-bottom: 44px;"><input data-filter="search" type="text" value="" maxlength="20" placeholder="Search" style="float: right;width: 100px"></div>');
    $('.shopsPage-header-container').parents().slice(0, 6).children().filter('.mousehuntHud-page-subTabHeader-container').children().filter('input').filter("[placeholder='Search']").on("input", function () {
      filter($(this).val());
    });

    //Adds Quantity filter to each page
    $('.shopsPage-header-container').parents().slice(0, 6).children().filter('.mousehuntHud-page-subTabHeader-container').children().filter('input').before('<input data-filter="search" type="text" value="" maxlength="5" placeholder="Quantity" title="Will minimize any item of equal or greater quantity" style="float: right;width: 50px">');
    $('.shopsPage-header-container').parents().slice(0, 6).children().filter('.mousehuntHud-page-subTabHeader-container').children().filter('input').filter("[placeholder='Quantity']").on("input", function () {
      localStorage.setItem('hide_quantity_' + $('.shopsPage-header-container').parents().slice(0, 6).filter('.active').attr('data-tab'), $(this).val());
      quantity($(this).val());
    });

    //Adds Buy Max link
    $('.itemPurchaseView-action-form.clear-block').append('<a href="#" class="itemPurchaseView-action-form-button max" onclick="$(this).parents().filter(\'.itemPurchaseView-action-state.view\').children().filter(\'.itemPurchaseView-action-form.clear-block\').children().filter(\'.itemPurchaseView-action-quantity\').children().filter(\'input\').val(parseInt($(this).parents().filter(\'.itemPurchaseView-action-state.view\').children().filter(\'.itemPurchaseView-action-purchaseHelper\').children().filter(\'.itemPurchaseView-action-purchaseHelper-maxPurchases-container\').children().filter(\'.itemPurchaseView-action-maxPurchases\').text().replaceAll(\',\', \'\')) || 0); app.pages.ShopsPage.confirmPurchase(this); return false;" style="height: 0px;">Buy Max</a>');
  }

  //Sets Quantity filter to saved variable
  $('.shopsPage-header-container').parents().slice(0, 6).children().filter('.mousehuntHud-page-subTabHeader-container').children().filter('input').filter("[placeholder='Quantity']").val(parseInt(localStorage.getItem('hide_quantity_' + $('.shopsPage-header-container').parents().slice(0, 6).filter('.active').attr('data-tab'))) || 0);
  //Performs First Filter
  quantity(parseInt(localStorage.getItem('hide_quantity_' + $('.shopsPage-header-container').parents().slice(0, 6).filter('.active').attr('data-tab'))) || 0);

  //Hides/Shows Buy Max Button
  $('.itemPurchaseView-action-form-button.max').parents().filter('.itemPurchaseView-container').each(function () {
    if ($(this).hasClass('cannot_buy')) {
      $(this).children().children().filter('.itemPurchaseView-action-container').children().filter('.itemPurchaseView-action-state.view').children().filter('.itemPurchaseView-action-form.clear-block').children().filter('.itemPurchaseView-action-form-button.max').css('display', "none")
    } else {
      $(this).children().children().filter('.itemPurchaseView-action-container').children().filter('.itemPurchaseView-action-state.view').children().filter('.itemPurchaseView-action-form.clear-block').children().filter('.itemPurchaseView-action-form-button.max').css('display', "")
    }
  });
}
