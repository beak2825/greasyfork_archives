// ==UserScript==
// @name        QuickShards for Melvor Idle
// @description Allows the user to quickly purchase summoning shards from the summoning screen.
// @version     1.4.0
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @grant       none
// @license     MIT
// @namespace   https://github.com/ChaseStrackbein/melvor-idle-quickshards
// @downloadURL https://update.greasyfork.org/scripts/428146/QuickShards%20for%20Melvor%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/428146/QuickShards%20for%20Melvor%20Idle.meta.js
// ==/UserScript==

const main = (() => {
  let initialized = false;
  let summoningShardIds = [];
  let summoningShardShopCategory;
  let summoningShardShopIds;
  let showQuickShards = false;
  let buyQuantity = 1;
  let ignoreBank = false;
  let shardsToBuy = [];
  let shardIcons = [];
  const observer = new MutationObserver(update);

  // Cached jQuery objects
  let $eyecon;
  let $body;
  let $itemContainer;
  let $totalCostContainer;
  let $buyButton;

  function init () {
    if (initialized) return;

    if (!$('#summoning-creation-element').length) {
      setTimeout(() => init()), 50;
      return;
    }

    summoningShardIds = [
      CONSTANTS.item.Summoning_Shard_Black,
      CONSTANTS.item.Summoning_Shard_Blue,
      CONSTANTS.item.Summoning_Shard_Gold,
      CONSTANTS.item.Summoning_Shard_Green,
      CONSTANTS.item.Summoning_Shard_Red,
      CONSTANTS.item.Summoning_Shard_Silver
    ];
    summoningShardShopCategory = getSummoningShardShopCategory();
    summoningShardShopIds = getSummoningShardShopIds();

    loadPrefs();

    inject(buildBlock());

    observer.observe(summoningArtisanMenu.haves.iconContainer, { childList: true });

    initialized = true;
    console.log('QuickShards initialized');
  }

  function loadPrefs () {
    const prefs = JSON.parse(localStorage.getItem('bqs-prefs'));

    if (!prefs) return;

    if (prefs.buyQuantity !== undefined) buyQuantity = prefs.buyQuantity;
    if (prefs.showQuickShards !== undefined) showQuickShards = prefs.showQuickShards;
    if (prefs.ignoreBank !== undefined) ignoreBank = prefs.ignoreBank;
  }

  function savePrefs () {
    const prefs = {
      buyQuantity,
      showQuickShards,
      ignoreBank
    };

    localStorage.setItem('bqs-prefs', JSON.stringify(prefs));
  }

  function onToggleQuickShards () {
    showQuickShards = !showQuickShards;
    savePrefs();

    $eyecon.toggleClass('fa-eye', showQuickShards).toggleClass('fa-eye-slash', !showQuickShards);
    $body.toggleClass('d-none', !showQuickShards);
  }

  function onIgnoreBankChange () {
    ignoreBank = !ignoreBank;
    savePrefs();
    update();
  }

  function onCustomQuantity (e) {
    const quantity = parseInt(e.target.value);
    if (isNaN(quantity)) return;
    setBuyQuantity(quantity);
  }

  function setBuyQuantity (quantity) {
    buyQuantity = quantity;
    $buyButton.text(`Buy x${buyQuantity}`);
    savePrefs();
    update();
  }

  function buy() {
    if (buyQuantity < 1) return;
    if (!shardsToBuy.length) return;
    
    const originalBuyQty = buyQty;
    
    for (const shard of shardsToBuy) {
      if (!shard.quantity) continue;
      
      buyQty = shard.quantity;
      buyShopItem(summoningShardShopCategory, summoningShardShopIds[shard.id], true);
    }
    
    buyQty = originalBuyQty;
    
    update();
  }

  function update () {
    calculateShardsToBuy();
    updateItemContainer();
    updateTotalCostContainer();
  }

  function calculateShardsToBuy () {
    if (!game.summoning.selectedRecipe) {
      shardsToBuy = [];
      return;
    }

    const recipe = game.summoning.getCurrentRecipeCosts();
    
    shardsToBuy = [];
    
    for (const [itemId, qty] of recipe._items) {
      if (!summoningShardIds.includes(itemId)) continue;
      
      let quantityToBuy = qty * buyQuantity;
      if (!ignoreBank) quantityToBuy = Math.max(quantityToBuy - getBankQty(itemId), 0);
      
      shardsToBuy.push({
        id: itemId,
        cost: SHOP.Materials.find(i => i.contains?.items?.some(c => c[0] === itemId)).cost.gp,
        quantity: quantityToBuy
      });
    }
  }

  function calculateMaxCraftQuantity() {
    if (!game.summoning.selectedRecipe) {
      shardsToBuy = [];
      return;
    }

    const recipe = game.summoning.getCurrentRecipeCosts();
    
    const maxCraftAmounts = [];
    
    for (const [itemId, qty] of recipe._items) {
      if (summoningShardIds.includes(itemId)) continue;
      
      const quantityAvailable = getBankQty(itemId);
      
      maxCraftAmounts.push(Math.floor(quantityAvailable / qty));
    }
    if (recipe._sc) {
      maxCraftAmounts.push(Math.floor(player.slayercoins / recipe._sc));
    }
    
    return Math.min(...maxCraftAmounts);
  }

  function updateItemContainer () {
    shardIcons.forEach(icon => icon.destroy());
    shardIcons = [];
    
    if (!shardsToBuy.length) {
      $itemContainer.html('-');
      return;
    }

    $itemContainer.html('');
    for (const shard of shardsToBuy) {
      shardIcons.push(new ItemQtyIcon($itemContainer.get(0), shard.id, shard.quantity));
    }
  }

  function updateTotalCostContainer () {
    if (!shardsToBuy.length) {
      $totalCostContainer
        .removeClass('text-success text-danger')
        .text('-');
      $buyButton.prop('disabled', true);
      return;
    }

    const totalCost = shardsToBuy.reduce((acc, shard) => acc + (shard.cost * shard.quantity), 0);
    const canBuy = totalCost <= gp;
    $totalCostContainer
      .toggleClass('text-success', canBuy)
      .toggleClass('text-danger', !canBuy)
      .text(formatNumber(totalCost));
    $buyButton.prop('disabled', !canBuy);
  }

  function getSummoningShardShopCategory () {
    return Object.keys(SHOP).find(cat => SHOP[cat].some(item => item.name === items[summoningShardIds[0]].name));
  }

  function getSummoningShardShopIds () {
    const shopIds = {};
    for (const shardId of summoningShardIds) {
      shopIds[shardId] = SHOP[summoningShardShopCategory].indexOf(SHOP[summoningShardShopCategory].find(shopItem => shopItem.name === items[shardId].name));
    }
    return shopIds;
  }

  function inject (block) {
    summoningArtisanMenu.container.insertBefore(block.get(0), summoningArtisanMenu.productsCol);
  }

  function buildBlock () {
    const block = build('div', 'col-12 block block-rounded-double bg-combat-inner-dark pt-2 pb-1 text-center');
    block.append(buildHeader());
    block.append(buildBody());

    return block;
  }

  function buildHeader () {
    const header = build('div', 'block-header block-header-default pointer-enabled',
      { style: 'background: transparent!important;' })
      .on('click', onToggleQuickShards);

    const h3 = build('h3', 'block-title text-left')
      .text('Quick Buy Shards');

    const options = build('div', 'block-options');
        
    $eyecon = build('i', 'far', { id: 'shop-icon-open-bqs' }).toggleClass('fa-eye', showQuickShards).toggleClass('fa-eye-slash', !showQuickShards);

    header.append(h3).append(options.append($eyecon));

    return header;
  }

  function buildBody () {
    $body = build('div', 'row no-gutters', { id: 'shop-cat-bqs' }).toggleClass('d-none', !showQuickShards);

    $body
      .append(buildQuickShardItems())
      .append(build('div', 'col-12 row no-gutters justify-content-center align-items-center')
        .append(buildTotalCost())
        .append(buildBuyButtonGroup()))
      .append(build('div', 'col-12')
        .append(buildIgnoreBank()));

    return $body;
  }

  function buildQuickShardItems () {
    const itemContainer = build('div', 'row justify-content-center').text('-');
    $itemContainer = itemContainer;

    return build('div', 'col-12 mb-3')
        .append(build('div', 'col-12')
          .append(itemContainer));
  }

  function buildTotalCost () {
    const totalCostHeader = build('h5', 'font-w-600 font-size-sm mb-1').text('Total Cost');
    const gpIcon = build('img', 'skill-icon-xs m-1', { src: CDNDIR + 'assets/media/main/coins.svg' });
    const totalCostContainer = build('mr-2').text('-');
    $totalCostContainer = totalCostContainer;

    return build('div', 'col-12 col-sm-auto').css('minWidth', '100px')
      .append(totalCostHeader)
      .append(build('div', 'col-12')
        .append(gpIcon)
        .append(totalCostContainer));
  }

  function buildBuyButtonGroup () {
    const buyButtonGroup = build('div', 'btn-group');
    const buyButton = build('button', 'btn btn-primary', { disabled: true }).text(`Buy x${buyQuantity}`)
      .on('click', buy);
    $buyButton = buyButton;
    const dropdownButton = build('button', 'btn btn-primary dropdown-toggle dropdown-toggle-split', null, {
      'data-toggle': 'dropdown',
      'aria-haspopup': true,
      'aria-expanded': false
    });
    const dropdownMenu = build('div', 'dropdown-menu dropdown-menu-right font-size-sm');
    for (let quantity of [1, 10, 100, 1000]) {
      dropdownMenu.append(
        build('a', 'dropdown-item pointer-enabled').text('x' + quantity)
        .on('click', () => setBuyQuantity(quantity)));
    }
    dropdownMenu.append(
      build('a', 'dropdown-item pointer-enabled').text('Max')
      .on('click', () => setBuyQuantity(calculateMaxCraftQuantity())));
    dropdownMenu.append(build('div', 'dropdown-divider', { role: 'separator' }));

    const customQuantityLabel = build('label', null, { for: 'bqs-quantity-custom-amount' }).text('Custom Amount:');
    const customQuantityInput = build('input', 'form-control', {
      name: 'bqs-quantity-custom-amount',
      placeholder: 100
    }).on('input', onCustomQuantity);
    dropdownMenu.append(
      build('div', 'p-2 form-group').append(customQuantityLabel).append(customQuantityInput));

    buyButtonGroup.append(buyButton).append(dropdownButton).append(dropdownMenu);

    return build('div', 'col-12 col-sm-auto')
      .append(buyButtonGroup);
  }

  function buildIgnoreBank () {
    const ignoreBankInput = build('input', 'custom-control-input', {
        type: 'checkbox',
        id: 'bqs-ignore-bank',
        name: 'bqs-ignore-bank'
      }).prop('checked', ignoreBank)
      .on('change', onIgnoreBankChange);
    const ignoreBankLabel = build('label', 'custom-control-label', { for: 'bqs-ignore-bank' }).text('Ignore shards in bank');

    return build('div', 'custom-control custom-checkbox custom-control-inline form-control-sm')
      .append(ignoreBankInput)
      .append(ignoreBankLabel);
  }

  function build (el, classes, props, attrs) {
    const element = $('<' + el + '>');
    if (classes) element.addClass(classes);
    if (props) element.prop(props);
    if (attrs) element.attr(attrs);

    return element;
  }

  init();
})();

(() => {
  const load = () => {
    const isGameLoaded = (window.isLoaded && !window.currentlyCatchingUp) ||
      (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp);
      
    if (!isGameLoaded) {
      setTimeout(load, 50);
      return;
    }

    inject();
  }

  const inject = () => {
      const scriptId = 'bqs-main';

      const previousScript = document.getElementById(scriptId);
      if (previousScript) previousScript.remove();

      const script = document.createElement('script');
      script.id = scriptId;
      script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;

      document.body.appendChild(script);
  }

  load();
})();