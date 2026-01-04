// ==UserScript==
// @name         MH: Profile+
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.47
// @description  Community requested features for the tabs on your MH profile.
// @grant        GM_xmlhttpRequest
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @connect      http://www.mousehuntgame.com/*
// @connect      https://www.mousehuntgame.com/*
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/381389/MH%3A%20Profile%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/381389/MH%3A%20Profile%2B.meta.js
// ==/UserScript==
//
$(document).ready(function () {
  const debug = localStorage.getItem('ws.debug');
  if (debug == true) {
    console.log('Profile+ Started');
  }
  localStorage.setItem('ws.pfp.sortUorD', 'down');
  loadFunction();

  addStyles(`#tipButton {
        position: absolute;
        top: 3px;
        right: 150px;
        float: right;
    }`);
});

function loadFunction() {
  if ($('.mousehuntHud-page-tabHeader.kings_crowns').hasClass('active')) {
    //On king's crowns tab
    generateCrowns();
  } else if ($('.mousehuntHud-page-tabHeader.items').hasClass('active')) {
    //On item tab
    manageCollected();
  } else if ($('.mousehuntHud-page-tabHeader.profile').hasClass('active')) {
    //On profile tab
    generateProfile();
  } else if ($('.mousehuntHud-page-tabHeader.mice').hasClass('active')) {
    //On mouse Tab
    generateMice();
  } else {
    return false;
  }
}

$(document).ajaxComplete(function (event, xhr, options) {
  if (
    options.url ==
    'https://www.mousehuntgame.com/managers/ajax/users/userData.php'
  ) {
  } else if (
    options.url ==
    'https://www.mousehuntgame.com/managers/ajax/users/userInventory.php'
  ) {
  } else {
    loadFunction();
  }
});

function addStyles(css) {
  // Check to see if the existing element exists.
  const existingStyles = document.getElementById('ws-profile-plus-styles');

  // If so, append our new styles to the existing element.
  if (existingStyles) {
    existingStyles.innerHTML += css;
    return;
  }

  const style = document.createElement('style');
  style.id = 'ws-profile-plus-styles';
  style.innerHTML = css;
  document.head.appendChild(style);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Profile TAB
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateProfile() {
  //With the mhcc level, an egg, a checkmark, a crown, a star
  const debug = localStorage.getItem('ws.debug');
  let userID = '';
  const myProfileLink = $('.mousehuntHud-shield').attr('href');
  let maybeYourFriend = '';
  let eggMaster = localStorage.getItem('ws.pfp.eggMaster');
  if ($('.userInteractionButtonsView-relationship').get(0)) {
    userID = $('.userInteractionButtonsView-relationship').attr(
      'data-recipient-snuid'
    );
    maybeYourFriend = userID;
  } else if (myProfileLink) {
    if (myProfileLink.search('snuid=') == -1) {
      if (debug == true) {
        console.log('Your SNUID Not Found', myProfileLink);
      }
      return false;
    } else {
      userID = myProfileLink.split('snuid=')[1].split('&tab=')[0];
    }
  } else {
    if (debug == true) {
      console.log('SNUID Not Found', myProfileLink, userID);
    }
    return false;
  }
  localStorage.setItem('ws.pfp.eggMaster', '');
  const dataItemOfInterest = ['is_egg_master', 'not_a_real_field'];
  hg.utils.User.getUserData([userID], dataItemOfInterest, function (data) {
    eggMaster = localStorage.setItem('ws.pfp.eggMaster', data[0].is_egg_master);
  });
  setTimeout(flexEggMaster, 1000);
  if (debug == true) {
    console.log('Profile Tab', userID, eggMaster);
  }
  //stop the silly hyperlink on the hunter ID
  const hunterID = $('.hunterInfoView-idCardBlock-secondaryHeader').children();
  hunterID.removeAttr('href').removeAttr('onclick');
  //
  //tipping/misc
  if (maybeYourFriend) {
    const yourFriendsProfile = $('.friendsPage-friendRow-content');
    if ($('#tipButton').get(0)) {
      return false;
    } else {
      const tipButton = document.createElement('button');
      tipButton.id = 'tipButton';
      tipButton.title = 'Tip this hunter 10 SB+';
      tipButton.classList.add('mousehuntActionButton', 'tiny');

      const tipButtonText = document.createElement('span');
      tipButtonText.innerHTML = 'Tip 10 SB+';

      tipButton.appendChild(tipButtonText);
      yourFriendsProfile.prepend(tipButton);
    }
  } else if ($('.friendsProfileView-selfStats').get(0)) {
    const randomFriend = $('.friendsProfileView-randomFriend');
    const randoSNUID = randomFriend
      .attr('href')
      .split('snuid=')[1]
      .split('&tab=')[0];
    hg.utils.User.getUserData(
      [randoSNUID],
      ['not_a_real_field'],
      function (data) {
        randomFriend.text('Visit Random Friend (' + data[0].name + ')');
      }
    );
  }
}

function flexEggMaster() {
  const eggMaster = localStorage.getItem('ws.pfp.eggMaster');
  if (eggMaster == 'true') {
    if ($('.eggMasterIcon').length > 0) return;
    const hunterID = $('.friendsPage-friendRow-titleBar');
    const eggMasterIcon = document.createElement('div');
    eggMasterIcon.classList.add('eggMasterIcon');
    $(eggMasterIcon).attr('title', 'Is an Egg Master');
    $(eggMasterIcon).css({
      'background-size': '25px 25px',
      'background-image':
        "url('https://www.mousehuntgame.com/images/items/convertibles/transparent_thumb/3ada6ff18f89d020908e35fee2de7a45.png')",
      width: '25px',
      height: '25px',
      float: 'right',
      'margin-right': '7px',
    });
    hunterID.append(eggMasterIcon);
  }
}

$(document).on('click', '#tipButton', function () {
  const debug = localStorage.getItem('ws.debug');
  const receivingHunter = $('.userInteractionButtonsView-relationship').attr(
    'data-recipient-snuid'
  );
  const receivingName = $('.friendsPage-friendRow-titleBar-name').attr(
    'data-text'
  );
  const sendingHunter = user.unique_hash;
  const url =
    'https://www.mousehuntgame.com/managers/ajax/users/supplytransfer.php?/sn=Hitgrab&hg_is_ajax=1&receiver=' +
    receivingHunter +
    '&uh=' +
    sendingHunter +
    '&item=super_brie_cheese&item_quantity=10';
  GM_xmlhttpRequest({
    method: 'POST',
    url: url,
    onload: function (response) {
      if (debug == true) {
        console.log('Tip Sent', receivingName, receivingHunter);
      }
      alert('10 SB+ sent to ' + receivingName);
    },
    onerror: function (response) {
      if (debug == true) {
        console.log('Tip No Good, Error', receivingName, receivingHunter, url);
      }
      alert('Error, nothing sent');
    },
  });
});

$(document).on(
  'click',
  '.hunterInfoView-idCardBlock-secondaryHeader',
  function () {
    const debug = localStorage.getItem('ws.debug');
    const copiedID = $('.hunterInfoView-hunterId').find('span').text();
    if (debug == true) {
      console.log('ID Copied', copiedID);
    }
    GM_setClipboard(copiedID);
  }
);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Mouse TAB
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
function sumCategoryStats(category) {
  const categoryName = $(category).find('.mouseListView-categoryContent-name');
  const categoryTest = $(category).find(
    '.mouseListView-categoryContent-description'
  );
  let categoryCatches = 0;
  let categoryMisses = 0;
  const categoryMice = $(category).find(
    '.mouseListView-categoryContent-subgroup-mouse.stats:not(.header)'
  );
  categoryMice.each(function (i) {
    const thisCatches = parseInt(
      $(this).find('.catches').text().replace(',', ''),
      10
    );
    const thisMisses = parseInt(
      $(this).find('.misses').text().replace(',', ''),
      10
    );
    categoryCatches += thisCatches;
    categoryMisses += thisMisses;
  });
  const categoryTotal = categoryCatches + categoryMisses;
  let categoryStats = $(category).find('.categoryStats');
  if ($(categoryStats).length > 0) {
  } else {
    categoryStats = document.createElement('div');
    categoryStats.classList.add('categoryStats');
    $(categoryStats).insertAfter(categoryTest);
  }
  $(categoryStats).text(
    'Category Stats [Catches: ' +
      categoryCatches.toLocaleString() +
      ', Misses: ' +
      categoryMisses.toLocaleString() +
      ', Total: ' +
      categoryTotal.toLocaleString() +
      ']'
  );
  $(categoryStats).css({
    fontSize: '16px',
    'margin-top': '3px',
  });
}

function generateMice() {
  const allMice = $(
    '.mouseListView-categoryContent-subgroup-mouse.stats:not(.header)'
  );
  const statsHeader = $(
    '.mouseListView-categoryContent-subgroup-mouse.stats.header'
  );
  allMice.each(function (i) {
    const thisThumb = $(this).find(
      '.mouseListView-categoryContent-subgroup-mouse-thumb'
    );
    const thisCatches = parseInt(
      $(this).find('.catches').text().replace(',', ''),
      10
    );
    const thisMisses = parseInt(
      $(this).find('.misses').text().replace(',', ''),
      10
    );
    const thisCrown = setCrownBorder(thisThumb, thisCatches);
  });
  $(statsHeader).css({
    cursor: 'pointer',
  });
  $('.mouseListView-categoryContent-subgroup-mouse.stats.header').on(
    'click',
    '.mouseListView-categoryContent-subgroup-mouse-stats',
    function () {
      SortMice(this);
    }
  );
  const theseCategories = $(
    '.mouseListView-categoryContent-category.all.active'
  );
  theseCategories.each(function (i) {
    sumCategoryStats(this);
  });
}

function SortMice(sortBy) {
  const sortUorD = localStorage.getItem('ws.pfp.sortUorD');
  let sortKey = '';
  if ($(sortBy).hasClass('name')) {
    sortKey = '.name';
  } else if ($(sortBy).hasClass('catches')) {
    sortKey = '.catches';
  } else if ($(sortBy).hasClass('misses')) {
    sortKey = '.misses';
  } else if ($(sortBy).hasClass('average_weight')) {
    sortKey = '.average_weight';
  } else if ($(sortBy).hasClass('heaviest_catch')) {
    sortKey = '.heaviest_catch';
  }
  if (sortUorD == 'up') {
    sortMiceBy(sortKey, 'down');
    localStorage.setItem('ws.pfp.sortUorD', 'down');
  } else {
    sortMiceBy(sortKey, 'up');
    localStorage.setItem('ws.pfp.sortUorD', 'up');
  }
}

function setCrownBorder(thumb, catches, expanded) {
  let top = '';
  let bottom = '';
  let crown = 'n';
  if (catches >= 2500) {
    top = '#c4eae6';
    bottom = '#63b9cf';
    crown = 'd';
  } else if (catches >= 1000) {
    top = '#9191ff';
    bottom = '#1d1781';
    crown = 'p';
  } else if (catches >= 500) {
    top = '#ffe589';
    bottom = '#b67800';
    crown = 'g';
  } else if (catches >= 100) {
    top = '#d1d7e9';
    bottom = '#66718b';
    crown = 's';
  } else if (catches >= 10) {
    top = '#f0c693';
    bottom = '#8d4823';
    crown = 'b';
  } else {
    //no crown
    top = '#ab9f92';
    bottom = '#251B0A';
  }
  let background = '';
  if (expanded === 'C') {
    background = '#c1d5e0';
  } else {
    background = '#fafafa';
  }
  $(thumb).css({
    cursor: 'pointer',
    'background-color': background,
    'border-style': 'solid',
    'border-width': '4px',
    'border-radius': '4px',
    'border-top-color': top,
    'border-left-color': top,
    'border-bottom-color': bottom,
    'border-right-color': bottom,
  });
  return crown;
}

function sortMiceBy(key, UD) {
  let activeGrouping = $(
    '.mousehuntHud-page-subTabContent.active[data-template-file="AdversariesPage"]'
  );
  let activeSubGroup = '';
  if (
    $('.mouseListView-categoryContent-category.active.hasFilter.caught')
      .length > 0
  ) {
    activeSubGroup = $(activeGrouping).find(
      '.mouseListView-categoryContent-category.active.hasFilter.caught'
    );
  } else if (
    $('.mouseListView-categoryContent-category.active.hasFilter.uncaught')
      .length > 0
  ) {
    activeSubGroup = $(activeGrouping).find(
      '.mouseListView-categoryContent-category.active.hasFilter.uncaught'
    );
  } else {
    activeSubGroup = $(activeGrouping).find(
      '.mouseListView-categoryContent-category.all.active'
    );
  }
  const mouseContainer = $(activeSubGroup).find(
    '.mouseListView-categoryContent-subgroupContainer'
  );
  const allMice = $(activeSubGroup).find(
    '.mouseListView-categoryContent-subgroup-mouse.stats:not(.header)'
  );
  $(allMice)
    .sort(function (a, b) {
      if (key == '.name') {
        a = $(a).find(key).text();
        b = $(b).find(key).text();
      } else if (key == '.catches' || key == '.misses') {
        a = parseInt($(a).find(key).text().replace(',', ''), 10);
        b = parseInt($(b).find(key).text().replace(',', ''), 10);
      } else if (key == '.average_weight' || key == '.heaviest_catch') {
        a = parseUntits($(a).find(key).text());
        b = parseUntits($(b).find(key).text());
      }
      if (UD == 'up' && a > b) {
        return -1;
      } else if (UD == 'up' && a < b) {
        return 1;
      } else if (UD == 'down' && a < b) {
        return -1;
      } else if (UD == 'down' && a > b) {
        return 1;
      }
    })
    .appendTo(mouseContainer);
}

function parseUntits(unitString) {
  let oz = 0;
  const rawNumArray = unitString
    .replace(' lb. ', ',')
    .replace(' oz.', '')
    .split(',');
  if (rawNumArray.length == 1) {
    oz = parseInt(rawNumArray[0], 10);
  } else {
    oz = 16 * parseInt(rawNumArray[0], 10) + parseInt(rawNumArray[1], 10);
  }
  return oz;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Crowns TAB
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function generateCrowns() {
  const debug = localStorage.getItem('ws.debug');
  if (debug == true) {
    console.log(
      'Crowns Tab',
      localStorage.getItem('Lock Favorites'),
      localStorage.getItem('ShowCommunityRanks')
    );
  }
  buildToolbar();
  decorate();
  if (
    localStorage.getItem('Lock Favorites') == 'Y' &&
    $('.mouseCrownsView-group-mouse-favouriteButton').length > 0
  ) {
    lockFavorites();
  }
  if (localStorage.getItem('ShowCommunityRanks') == 'Y') {
    hg.utils.MouseUtil.getMouseNames(function (data) {
      const numMice = Object.keys($(data)[0]).length - 2;
      localStorage.setItem('ws.mh.pfp.numMice', numMice);
      if (debug == true) {
        console.log('Total Mice', numMice);
      }
      showCommunityRanks();
    });
  }
  if (localStorage.getItem('ShowPowerCrowns') == 'Y') {
    showPowerCrowns();
  }
}

function buildToolbar() {
  if ($('.toolBar').length > 0) return;
  const toolBar = document.createElement('div');
  toolBar.classList.add('toolBar');

  // Lock Favs CB
  const lockFavs = document.createElement('input');
  lockFavs.type = 'checkbox';
  lockFavs.name = 'lockFavs';
  lockFavs.value = '';
  lockFavs.id = 'lockFavs';
  if (localStorage.getItem('LockFavs') == 'Y') {
    lockFavs.checked = 'Yes';
  } else {
    lockFavs.checked = '';
  }

  const lockFavsLabel = document.createElement('label');
  lockFavsLabel.htmlFor = 'lockFavsLabel';
  lockFavsLabel.appendChild(document.createTextNode('Lock Favorites'));
  if ($('.mouseCrownsView-group-mouse-favouriteButton').length > 0) {
    toolBar.appendChild(lockFavs);
    toolBar.appendChild(lockFavsLabel);
  }
  // Community Ranks CB
  const communityRanks = document.createElement('input');
  communityRanks.type = 'checkbox';
  communityRanks.name = 'communityRanks';
  communityRanks.value = '';
  communityRanks.id = 'communityRanks';
  communityRanks.checked = '';
  if (localStorage.getItem('ShowCommunityRanks') == 'Y') {
    communityRanks.checked = 'Yes';
  } else {
    communityRanks.checked = '';
  }
  const communityRanksLabel = document.createElement('label');
  communityRanksLabel.htmlFor = 'communityRanksLabel';
  communityRanksLabel.appendChild(
    document.createTextNode('Show Crown Summary  ')
  );
  toolBar.appendChild(communityRanks);
  toolBar.appendChild(communityRanksLabel);
  // Power Crowns CB
  const powerCrowns = document.createElement('input');
  powerCrowns.type = 'checkbox';
  powerCrowns.name = 'powerCrowns';
  powerCrowns.value = '';
  powerCrowns.id = 'powerCrowns';
  powerCrowns.checked = '';
  if (localStorage.getItem('ShowPowerCrowns') == 'Y') {
    powerCrowns.checked = 'Yes';
  } else {
    powerCrowns.checked = '';
  }
  const powerCrownsLabel = document.createElement('label');
  powerCrownsLabel.htmlFor = 'powerCrownsLabel';
  powerCrownsLabel.appendChild(document.createTextNode('Show Power Crowns  '));
  toolBar.appendChild(powerCrowns);
  toolBar.appendChild(powerCrownsLabel);
  //Copy Crown Button
  const copyCrownsButton = document.createElement('button');
  copyCrownsButton.id = 'copyCrownsButton';
  if ($('.mouseCrownsView-group-mouse-favouriteButton').length > 0) {
    copyCrownsButton.addEventListener('click', copyMyCrowns);
  } else {
    copyCrownsButton.addEventListener('click', copyCrowns);
  }
  $(copyCrownsButton).attr('title', 'Copy Crowns to Clipboard');
  toolBar.appendChild(copyCrownsButton);
  $(copyCrownsButton).css({
    cursor: 'pointer',
    'border-style': 'solid',
    'border-color': 'grey',
    'border-width': '2px',
    'background-image':
      "url('https://cdn3.iconfinder.com/data/icons/files-folders-line/100/copy-512.png')",
    'background-repeat': 'no-repeat',
    'background-size': 'contain',
    width: '35px',
    height: '35px',
  });
  // Last
  let crownBreak = $('.mouseCrownsView-group.favourite').css({
    'margin-bottom': '40px',
  });
  crownBreak.append(toolBar);
  $('.toolBar').css({
    float: 'right',
  });
}

/********** Lock Favs **********/
$(document).on('change', '#lockFavs', function () {
  if (
    window.location.href.includes('profile.php') &&
    $('.mousehuntHud-page-tabHeader.kings_crowns').hasClass('active')
  ) {
    // Check to see if the cb was JUST checked
    if (this.checked) {
      // Put the checked value into storage
      localStorage.setItem('LockFavs', 'Y');
      lockFavs.checked = 'Yes';
      lockFavorites();
    } else {
      // Put the checked value into storage
      localStorage.setItem('LockFavs', 'N');
      lockFavs.checked = '';
      unlockFavorites();
    }
  }
});

function lockFavorites() {
  localStorage.setItem('Lock Favorites', 'Y');
  if ($('.mouseCrownsView-group-mouse-favouriteButton').length < 0) {
    localStorage.setItem('LockFavs', 'N');
    lockFavs.checked = '';
    return;
  }
  const allMice = $('.mouseCrownsView-group-mouse').find(
    '.mouseCrownsView-group-mouse-favouriteButton'
  );
  allMice.css('pointer-events', 'none');
}

function unlockFavorites() {
  localStorage.setItem('Lock Favorites', 'N');
  const allMice = $('.mouseCrownsView-group-mouse').find(
    '.mouseCrownsView-group-mouse-favouriteButton'
  );
  allMice.css('pointer-events', 'auto');
  $('.mouseCrownsView-crown.favourite').css({
    'background-image':
      "url('https://www.mousehuntgame.com/images/ui/camp/trap/star_favorite.png')",
    display: 'inline-block',
    'vertical-align': 'middle',
    width: '50px',
    height: '50px',
    'margin-right': '5px',
    'background-repeat': 'no-repeat',
    'background-position': '50% 50%',
    'background-size': 'contain',
  });
}

/********** Community Ranks **********/
$(document).on('change', '#communityRanks', function () {
  if (
    window.location.href.includes('profile.php') &&
    $('.mousehuntHud-page-tabHeader.kings_crowns').hasClass('active')
  ) {
    // Check to see if the cb was JUST checked
    if (this.checked) {
      // Put the checked value into storage
      localStorage.setItem('ShowCommunityRanks', 'Y');
      communityRanks.checked = 'Yes';
      showCommunityRanks();
    } else {
      // Put the checked value into storage
      localStorage.setItem('ShowCommunityRanks', 'N');
      communityRanks.checked = '';
      hideCommunityRanks();
    }
  }
});

function showCommunityRanks() {
  const debug = localStorage.getItem('ws.debug');
  const totalMice = localStorage.getItem('ws.mh.pfp.numMice');
  if ($('.mouseCrownsView-group-header.community').length > 0) {
    return;
  }
  const crownBreak = $('.mouseCrownsView-group.favourite');
  const communityCrownHeader = $('.mouseCrownsView-group-header')
    .first()
    .clone();
  communityCrownHeader.addClass('community');
  communityCrownHeader.css({
    //'height': '65px',
    padding: '3px',
    'margin-bottom': '10px',
  });
  communityCrownHeader
    .find('.mouseCrownsView-crown')
    .removeClass('favourite')
    .addClass('community')
    .css({
      'background-image': "url('https://icon-library.com/images/138339.png')",
      'background-repeat': 'no-repeat',
      'background-size': '40px 40px',
    });
  communityCrownHeader.find('.mouseCrownsView-group-header-subtitle');
  communityCrownHeader
    .find('.mouseCrownsView-group-header-name')
    .text('Crown Summary')
    .css({
      'font-weight': 'bold',
    });
  communityCrownHeader.insertAfter(crownBreak);
  const allUncrowned = $('.mouseCrownsView-group.none').find(
    '.mouseCrownsView-group-mouse'
  );
  const allBronze = $(
    '.mouseCrownsView-group.bronze,.mouseCrownsView-group.silver,.mouseCrownsView-group.gold,.mouseCrownsView-group.platinum,.mouseCrownsView-group.diamond'
  ).find('.mouseCrownsView-group-mouse');
  const allSilver = $(
    '.mouseCrownsView-group.silver,.mouseCrownsView-group.gold,.mouseCrownsView-group.platinum,.mouseCrownsView-group.diamond'
  ).find('.mouseCrownsView-group-mouse');
  const allGold = $(
    '.mouseCrownsView-group.gold,.mouseCrownsView-group.platinum,.mouseCrownsView-group.diamond'
  ).find('.mouseCrownsView-group-mouse');
  const allPlat = $(
    '.mouseCrownsView-group.platinum,.mouseCrownsView-group.diamond'
  ).find('.mouseCrownsView-group-mouse');
  const allDiamond = $('.mouseCrownsView-group.diamond').find(
    '.mouseCrownsView-group-mouse'
  );
  const bronzeCrowns = allBronze.length;
  const silverCrowns = allSilver.length;
  const goldCrowns = allGold.length;
  const platCrowns = allPlat.length;
  const diamondCrowns = allDiamond.length;
  const uncrowned = totalMice - bronzeCrowns;
  if (debug == true) {
    console.log(
      'Crown Counts',
      uncrowned,
      bronzeCrowns,
      silverCrowns,
      goldCrowns,
      platCrowns,
      diamondCrowns
    );
  }
  const bronzeLink =
    'https://docs.google.com/spreadsheets/d/19_wHCkwiT5M6LS7XNLt4NYny98fjpg4UlHbgOD05ijw/pub?fbclid=IwAR3a1Ku2xTl1mIDksUr8Lk5ORMEnuv7jnvIy9K6OBeziG6AyvYYlZaIQkHY';
  const silverLink =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQG5g3vp-q7LRYug-yZR3tSwQzAdN7qaYFzhlZYeA32vLtq1mJcq7qhH80planwei99JtLRFAhJuTZn/pubhtml?fbclid=IwAR3sPXNLloGnFk324a0HShroP1E-sNcnQBlRTjJ7gScWTWosqmXv5InB_Ns';
  const goldLink =
    'https://docs.google.com/spreadsheets/d/10OGD5OYkGIEAbiez7v92qU5Fdul0ZtCRgEjlECkwZJE/pubhtml?gid=478731024&single=true&fbclid=IwAR28w7IQyMp91I62CR3GOILpbeLwgKaydIoQimMNm7j3S0DL8Mj_IsRpGD4';
  const rankSummary = $("<div class='rank summary'</div>");
  rankSummary.css({
    'font-size': '11.75px',
  });
  communityCrownHeader.append(rankSummary);
  const uncrownedText = document.createTextNode(
    'Uncrowned: ' +
      uncrowned +
      ' (' +
      ((uncrowned / totalMice) * 100).toFixed(2) +
      '%) | '
  );
  $(rankSummary).attr('title', 'Mobster and Leprechaun excluded from counts');
  const bronzeText = document.createTextNode(
    'Bronze: ' +
      bronzeCrowns +
      ' (' +
      ((bronzeCrowns / totalMice) * 100).toFixed(2) +
      '%) | '
  );
  const silverText = document.createTextNode(
    'Silver: ' +
      silverCrowns +
      ' (' +
      ((silverCrowns / totalMice) * 100).toFixed(2) +
      '%) | '
  );
  const goldText = document.createTextNode(
    'Gold: ' +
      goldCrowns +
      ' (' +
      ((goldCrowns / totalMice) * 100).toFixed(2) +
      '%) | '
  );
  const platText = document.createTextNode(
    'Platinum: ' +
      platCrowns +
      ' (' +
      ((platCrowns / totalMice) * 100).toFixed(2) +
      '%) | '
  );
  const diamondText = document.createTextNode(
    'Diamond: ' +
      diamondCrowns +
      ' (' +
      ((diamondCrowns / totalMice) * 100).toFixed(2) +
      '%)'
  );
  const aBronze = document.createElement('a');
  aBronze.appendChild(bronzeText);
  aBronze.title = '90% Crowned Scoreboard';
  aBronze.href = bronzeLink;
  $(aBronze).attr('target', '_blank');
  const aSilver = document.createElement('a');
  aSilver.appendChild(silverText);
  aSilver.title = 'MHCC Scoreboard';
  aSilver.href = silverLink;
  $(aSilver).attr('target', '_blank');
  const aGold = document.createElement('a');
  aGold.appendChild(goldText);
  aGold.title = 'MHCC Elite Scoreboard';
  aGold.href = goldLink;
  $(aGold).attr('target', '_blank');
  $(rankSummary)
    .append(uncrownedText)
    .append(aBronze)
    .append(aSilver)
    .append(aGold)
    .append(platText)
    .append(diamondText);
}

function hideCommunityRanks() {
  if ($('.mouseCrownsView-group-header.community').length > 0) {
    $('.mouseCrownsView-group-header.community').remove();
  }
}

/********** Power Crowns **********/
$(document).on('change', '#powerCrowns', function () {
  if (
    window.location.href.includes('profile.php') &&
    $('.mousehuntHud-page-tabHeader.kings_crowns').hasClass('active')
  ) {
    if (this.checked) {
      localStorage.setItem('ShowPowerCrowns', 'Y');
      powerCrowns.checked = 'Yes';
      decorate();
      showPowerCrowns();
    } else {
      localStorage.setItem('ShowPowerCrowns', 'N');
      powerCrowns.checked = '';
      hidePowerCrowns();
    }
  }
});

function populatePowerCrowns(mouse) {
  const mouseName = $(mouse).find('.mouseCrownsView-group-mouse-name').text();
  if (mouseName == '-- Empty --') {
    return false;
  }
  let powerType = getMousePowerType(mouseName);
  let icon = 'https://www.mousehuntgame.com/images/powertypes/parental.png';
  let iconClass = '';
  if (powerType == 'normal') {
    powerType = 'multi';
    iconClass = 'pt ' + powerType;
  } else if (powerType == 'event') {
    iconClass = 'pt event';
    icon =
      'https://www.mousehuntgame.com/images/items/skins/73c91f2016a313406553794587625e24.jpg';
  } else if (powerType == 'prize') {
    iconClass = 'pt prize';
    icon =
      'https://www.mousehuntgame.com/images/items/convertibles/80cf614cbec2ec3d739502bd45c93ab3.gif?cv=2';
  } else {
    icon =
      'https://www.mousehuntgame.com/images/powertypes/' + powerType + '.png';
    iconClass = 'pt ' + powerType;
  }
  const label = $(mouse).find('.mouseCrownsView-group-mouse-label');
  if ($(label).find('img').length > 0) {
  } else {
    $(label).append(
      $('<img>', {
        class: iconClass,
        src: icon,
        title: powerType,
      })
    );
    $(label).find('img').css({
      width: '17.5px',
      height: '17.5px',
      'margin-left': '1px',
    });
  }
}

function showPowerCrowns() {
  const debug = localStorage.getItem('ws.debug');
  localStorage.setItem('ws.mh.pfp.ptProps', JSON.stringify({}));
  if ($('.mouseCrownsView-group-header.powerCrown').length > 0) {
    return;
  }
  let crownBreak = $('.mouseCrownsView-group.favourite');
  if ($('.mouseCrownsView-group-header.community').length > 0) {
    crownBreak = $('.mouseCrownsView-group-header.community');
  }
  const powerCrownHeader = $('.mouseCrownsView-group-header').first().clone();
  powerCrownHeader.addClass('powerCrown');
  powerCrownHeader
    .find('.mouseCrownsView-crown')
    .removeClass('favourite')
    .addClass('powerCrown')
    .css({
      'background-image':
        "url('https://icon-library.com/images/off-icon/off-icon-12.jpg')",
      'background-repeat': 'no-repeat',
      'background-size': '40px 40px',
    });
  powerCrownHeader.find('.mouseCrownsView-group-header-subtitle');
  powerCrownHeader
    .find('.mouseCrownsView-group-header-name')
    .text('Power Crowns')
    .css({
      'font-weight': 'bold',
    });
  powerCrownHeader.insertAfter(crownBreak);
  const ptBtnGroup = $("<div class='btn-group' id='powerTypeBtns'></div>");
  const powerTypes = [
    'arcane',
    'draconic',
    'forgotten',
    'hydro',
    'law',
    'physical',
    'rift',
    'shadow',
    'tactical',
    'parental',
    'event',
    'prize',
  ];
  powerTypes.forEach(function (type, index) {
    const thisBtn = document.createElement('button');
    let icon = '';
    let title = type;
    let masterText = '';
    if (type == 'parental') {
      $(thisBtn).addClass('ptbtn multi');
      icon = 'https://www.mousehuntgame.com/images/powertypes/' + type + '.png';
      title = 'multi';
      masterText = 'Master of Multi!';
    } else if (type == 'event') {
      $(thisBtn).addClass('ptbtn ' + type);
      icon =
        'https://www.mousehuntgame.com/images/items/skins/73c91f2016a313406553794587625e24.jpg';
      masterText = 'Master of Events!';
    } else if (type == 'prize') {
      $(thisBtn).addClass('ptbtn ' + type);
      icon =
        'https://www.mousehuntgame.com/images/items/convertibles/80cf614cbec2ec3d739502bd45c93ab3.gif?cv=2';
      masterText = 'Master of Cheating because this is impossible :/';
    } else {
      $(thisBtn).addClass('ptbtn ' + type);
      icon = 'https://www.mousehuntgame.com/images/powertypes/' + type + '.png';
      masterText =
        'Master of ' + type.charAt(0).toUpperCase() + type.substring(1) + '!';
    }
    const powerTypeData = getPowerTypeTotals(type);
    const powerTypeIcon = $('<img>', {
      src: icon,
      title: title,
      width: '35',
      height: '35',
    });
    $(thisBtn).append(powerTypeIcon);
    //
    const countText = document.createElement('div');
    $(countText).append(powerTypeData[0]);
    //
    if (powerTypeData[2]) {
      const masterBtn = $('<img>', {
        src: 'https://www.mousehuntgame.com/images/ui/crowns/crown_silver.png?asset_cache_version=2',
        title: masterText,
      });
      $(thisBtn).append(masterBtn);
      $(masterBtn).css({
        position: 'relative',
        top: '-12px',
        left: '-5px',
        float: 'right',
      });
      $(powerTypeIcon).css({
        position: 'relative',
        top: '0px',
        left: '-5px',
      });
      $(countText).css({
        float: 'left',
        position: 'relative',
        top: '-12px',
        left: '0px',
        width: '100%',
      });
    } else {
      const percentText = document.createElement('div');
      $(percentText).append(powerTypeData[1]);
      $(percentText).css({
        position: 'relative',
        top: '-35px',
        left: '40px',
        width: '55%',
      });
      $(thisBtn).append(percentText);
      $(powerTypeIcon).css({
        position: 'relative',
        left: '-40px',
      });
      $(countText).css({
        position: 'relative',
        top: '-20px',
        left: '0px',
        width: '100%',
      });
    }
    $(thisBtn).append(countText);
    $(thisBtn).css({
      cursor: 'pointer',
      'background-color': '#008CBA',
      'border-radius': '4px',
      'font-size': '16px',
      padding: '7.5px 2.5px',
      height: '67.5px',
      width: '16.666666666666666666%',
    });
    $(thisBtn).on('click', function () {
      let ptProps = JSON.parse(localStorage.getItem('ws.mh.pfp.ptProps'));
      const type = $(this).attr('class').replace('ptbtn ', '');
      let allMice = $('.mouseCrownsView-group:not(.favourite)').find('.pt');
      $(allMice).parent().parent().parent().show();
      if (ptProps[type] == 'Show') {
        Object.keys(ptProps).forEach((e) => (ptProps[e] = 'Show'));
        ptBtnGroup.find('button').css({
          'border-color': 'black',
        });
        ptProps[type] = 'All';
      } else {
        Object.keys(ptProps).forEach((e) => (ptProps[e] = 'Hide'));
        ptBtnGroup.find('button').not(this).css({
          'border-color': 'black',
        });
        $(this).css({
          'border-color': '#f44336',
        });
        ptProps[type] = 'Show';
        $(allMice)
          .not('.pt.' + type)
          .parent()
          .parent()
          .parent()
          .hide();
      }
      localStorage.setItem('ws.mh.pfp.ptProps', JSON.stringify(ptProps));
    });
    $(ptBtnGroup).append(thisBtn);
  });
  powerCrownHeader.append(ptBtnGroup);
}

function getPowerTypeTotals(type) {
  const debug = localStorage.getItem('ws.debug');
  if (type == 'parental') {
    type = 'multi';
  }
  const totalMice = {
    arcane: 78,
    draconic: 67,
    forgotten: 87,
    hydro: 204,
    law: 68,
    physical: 79,
    rift: 142,
    shadow: 91,
    tactical: 121,
    multi: 138,
    event: 168,
    prize: 2,
  };
  const num = $(
    '.mouseCrownsView-group:not(.favourite):not(.none):not(.bronze)'
  ).find('.pt.' + type).length;
  const percent = ((num / totalMice[type]) * 100).toFixed(2);
  let result = [];
  result.push('' + num + ' of ' + totalMice[type]);
  if (num == totalMice[type]) {
    //result.push('isMaster');
  }
  result.push(' ' + percent + '% ');
  if (debug == true) {
    console.log(type, num, percent, result);
  }
  return result;
}

$(document).on(
  'click',
  '.mouseCrownsView-group-header.powerCrown',
  function (e) {
    const eventTarget = $(e.target).attr('class');
    const btnGroup = $(this).find('.btn-group');
    if (e.target === e.currentTarget) {
      btnGroup.toggle();
    } else if (eventTarget === 'mouseCrownsView-crown powerCrown') {
      btnGroup.toggle();
    } else if (eventTarget === 'mouseCrownsView-group-header-name') {
      btnGroup.toggle();
    }
  }
);

function getMousePowerType(mouseName) {
  const miceMap = {
    'Abominable Snow': 'normal',
    'Absolute Acolyte': 'rift',
    Acolyte: 'forgotten',
    'Admiral Arrrgh': 'event',
    'Admiral Cloudbeard': 'normal',
    Aether: 'tactical',
    Aged: 'physical',
    'Agent M': 'law',
    'Agitated Gentle Giant': 'rift',
    Alchemist: 'hydro',
    Alnilam: 'tactical',
    Alnitak: 'hydro',
    'Alpha Weremouse': 'shadow',
    'Amplified Brown': 'rift',
    'Amplified Grey': 'rift',
    'Amplified White': 'rift',
    'Ancient of the Deep': 'hydro',
    'Ancient Scribe': 'forgotten',
    Angelfish: 'hydro',
    Angler: 'hydro',
    'Angry Aphid': 'tactical',
    'Angry Train Staff': 'law',
    Aquos: 'shadow',
    'Arcana Overachiever': 'arcane',
    'Arcane Master Sorcerer': 'arcane',
    'Arcane Summoner': 'arcane',
    'Arch Champion Necromancer': 'rift',
    Archer: 'tactical',
    'Architeuthulhu of the Abyss': 'hydro',
    'Aristo-Cat Burglar': 'law',
    'Armored Archer': 'rift',
    'Artillery Commander': 'arcane',
    'Ascended Elder': 'rift',
    'Ash Golem': 'forgotten',
    Assassin: 'tactical',
    'Assassin Beast': 'rift',
    'Astrological Astronomer': 'shadow',
    'Audacious Alchemist': 'shadow',
    'Automated Sentry': 'rift',
    'Automated Stone Sentry': 'forgotten',
    Automorat: 'law',
    'Baba Gaga': 'event',
    'Balack the Banished': 'forgotten',
    'Ballroom Blitzers': 'physical',
    Bandit: 'physical',
    Bark: 'hydro',
    Barkshell: 'hydro',
    'Barmy Gunner': 'hydro',
    'Barnacle Beautician': 'hydro',
    'Baroness Von Bean': 'physical',
    'Baroque Dancer': 'physical',
    Barracuda: 'hydro',
    Bartender: 'law',
    Bat: 'shadow',
    'Battering Ram': 'normal',
    'Battle Cleric': 'forgotten',
    Beachcomber: 'hydro',
    Bear: 'tactical',
    'Bearded Elder': 'draconic',
    'Beast Tamer': 'tactical',
    Berserker: 'tactical',
    Berzerker: 'rift',
    Betta: 'hydro',
    'Big Bad Behemoth Burroughs': 'rift',
    'Big Bad Burroughs': 'normal',
    'Bilged Boatswain': 'hydro',
    Biohazard: 'hydro',
    Bionic: 'normal',
    Birthday: 'event',
    'Bitter Grammarian': 'forgotten',
    'Bitter Root': 'normal',
    'Black Diamond Racer': 'event',
    'Black Mage': 'shadow',
    'Black Powder Thief': 'law',
    'Black Widow': 'normal',
    Blacksmith: 'normal',
    'Bloomed Sylvan': 'rift',
    'Bog Beast': 'hydro',
    'Bonbon Gummy Globlin': 'event',
    Bookborn: 'tactical',
    Bookworm: 'shadow',
    'Borean Commander': 'event',
    Bottled: 'hydro',
    'Bottom Feeder': 'hydro',
    'Boulder Biter': 'rift',
    'Bounty Hunter': 'law',
    Brawny: 'rift',
    Breakdancer: 'event',
    'Breeze Borrower': 'normal',
    Briegull: 'hydro',
    Brimstone: 'shadow',
    'Broomstick Bungler': 'arcane',
    'Brothers Grimmaus': 'forgotten',
    Brown: 'normal',
    Bruticle: 'hydro',
    'Bruticus the Blazing': 'draconic',
    Buccaneer: 'hydro',
    Buckethead: 'event',
    'Budrich Thornborn': 'physical',
    Builder: 'event',
    'Bulwark of Ascent': 'rift',
    Burglar: 'law',
    'Burly Bruiser': 'draconic',
    'Cabin Boy': 'hydro',
    'Cagey Countess': 'physical',
    Calalilly: 'hydro',
    Calligraphy: 'event',
    Camoflower: 'hydro',
    Camofusion: 'hydro',
    'Candy Cane': 'event',
    'Candy Cat': 'event',
    'Candy Goblin': 'event',
    Cannonball: 'law',
    Captain: 'hydro',
    'Captain Cannonball': 'event',
    'Captain Cloudkicker': 'tactical',
    'Captain Croissant': 'normal',
    'Caravan Guard': 'normal',
    Cardshark: 'law',
    'Carefree Cook': 'event',
    'Careless Catfish': 'hydro',
    Caretaker: 'tactical',
    'Carmine the Apothecary': 'hydro',
    Carnivore: 'hydro',
    'Carrion Medium': 'rift',
    Cavalier: 'tactical',
    'Cavern Crumbler': 'forgotten',
    'Celestial Summoner': 'shadow',
    'Cell Sweeper': 'physical',
    Centaur: 'tactical',
    'Centaur Ranger': 'rift',
    'Chafed Cellist': 'physical',
    'Chamber Cleaver': 'rift',
    Chameleon: 'tactical',
    Champion: 'hydro',
    'Champion Danseuse': 'rift',
    'Champion Thief': 'rift',
    'Charming Chimer': 'arcane',
    'Cheat Sheet Conjurer': 'shadow',
    'Cheesy Party': 'event',
    Cherry: 'tactical',
    'Cherry Sprite': 'rift',
    'Chess Master': 'tactical',
    'Chip Chiseler': 'shadow',
    Chipper: 'hydro',
    Chitinous: 'shadow',
    'Chocolate Gold Foil': 'event',
    'Chocolate Overload': 'event',
    'Christmas Tree': 'event',
    Chrono: 'forgotten',
    Chronomaster: 'rift',
    Cinderstorm: 'draconic',
    'Circuit Judge': 'law',
    'City Noble': 'hydro',
    'City Worker': 'hydro',
    'Class Clown': 'arcane',
    'Classroom Disrupter': 'shadow',
    'Classroom Keener': 'shadow',
    'Clockwork Samurai': 'normal',
    'Clockwork Timespinner': 'rift',
    'Cloud Collector': 'normal',
    'Cloud Miner': 'normal',
    'Cloud Strider': 'hydro',
    Clownfish: 'hydro',
    Clump: 'rift',
    'Clumsy Carrier': 'hydro',
    'Clumsy Chemist': 'normal',
    'Clumsy Cupbearer': 'physical',
    'Coal Shoveller': 'law',
    Cobweb: 'event',
    'Coco Commander': 'event',
    'Coffin Zombie': 'shadow',
    'Confused Courier': 'event',
    Conjurer: 'tactical',
    Conqueror: 'tactical',
    'Constructively Critical Artist': 'arcane',
    'Consumed Charm Tinkerer': 'normal',
    Cook: 'hydro',
    Coral: 'hydro',
    'Coral Cuddler': 'hydro',
    'Coral Dragon': 'hydro',
    'Coral Gardener': 'hydro',
    'Coral Guard': 'hydro',
    'Coral Harvester': 'hydro',
    'Coral Queen': 'hydro',
    'Core Sample': 'normal',
    'Cork Defender': 'draconic',
    Corkataur: 'draconic',
    'Corky the Collector': 'draconic',
    'Corridor Bruiser': 'forgotten',
    Corrupt: 'arcane',
    'Corrupt Commodore': 'hydro',
    'Costumed Dog': 'event',
    'Costumed Dragon': 'event',
    'Costumed Horse': 'event',
    'Costumed Monkey': 'event',
    'Costumed Ox': 'event',
    'Costumed Pig': 'event',
    'Costumed Rabbit': 'event',
    'Costumed Rat': 'event',
    'Costumed Rooster': 'event',
    'Costumed Sheep': 'event',
    'Costumed Snake': 'event',
    'Costumed Tiger': 'event',
    'Count Vampire': 'rift',
    'Covetous Coastguard': 'hydro',
    Cowardly: 'normal',
    Cowbell: 'tactical',
    Crabolia: 'hydro',
    'Crag Elder': 'forgotten',
    'Craggy Ore': 'normal',
    'Cranky Caterpillar': 'rift',
    'Crate Camo': 'law',
    'Crazed Cultivator': 'tactical',
    'Crazed Goblin': 'rift',
    'Creepy Marionette': 'event',
    'Crimson Commander': 'normal',
    'Crimson Ranger': 'physical',
    'Crimson Titan': 'physical',
    'Crimson Watch': 'physical',
    'Croquet Crusher': 'law',
    'Crown Collector': 'normal',
    'Crystal Behemoth': 'forgotten',
    'Crystal Cave Worm': 'forgotten',
    'Crystal Controller': 'forgotten',
    'Crystal Golem': 'forgotten',
    'Crystal Lurker': 'forgotten',
    'Crystal Observer': 'forgotten',
    'Crystal Queen': 'forgotten',
    Crystalback: 'forgotten',
    'Crystalline Slasher': 'forgotten',
    Cumulost: 'forgotten',
    'Cupcake Camo': 'event',
    'Cupcake Candle Thief': 'event',
    'Cupcake Cutie': 'event',
    'Cupcake Runner': 'event',
    Cupid: 'tactical',
    'Curious Chemist': 'tactical',
    Cursed: 'arcane',
    'Cursed Crusader': 'rift',
    'Cursed Enchanter': 'arcane',
    'Cursed Engineer': 'arcane',
    'Cursed Librarian': 'arcane',
    'Cursed Taskmaster': 'arcane',
    'Cursed Thief': 'arcane',
    'Cute Cloud Conjurer': 'hydro',
    'Cute Crate Carrier': 'law',
    Cutpurse: 'rift',
    'Cutthroat Cannoneer': 'normal',
    'Cutthroat Pirate': 'normal',
    Cuttle: 'hydro',
    'Cyber Miner': 'rift',
    'Cybernetic Specialist': 'rift',
    Cyborg: 'rift',
    Cycloness: 'arcane',
    Cyclops: 'tactical',
    'Cyclops Barbarian': 'rift',
    'Dance Party': 'event',
    Dancer: 'tactical',
    'Dancing Assassin': 'rift',
    'Dangerous Duo': 'law',
    'Dark Magi': 'arcane',
    'Dark Templar': 'forgotten',
    'Dashing Buccaneer': 'hydro',
    'Dastardly Duchess': 'physical',
    'Data Devourer': 'shadow',
    'Davy Jones': 'shadow',
    'Dawn Guardian': 'arcane',
    Daydreamer: 'normal',
    'Decrepit Tentacle Terror': 'normal',
    Deep: 'hydro',
    'Deep Sea Diver': 'hydro',
    Defender: 'tactical',
    Dehydrated: 'hydro',
    Demolitions: 'normal',
    'Deranged Deckhand': 'hydro',
    Derpicorn: 'physical',
    Derpshark: 'hydro',
    'Derr Chieftain': 'physical',
    'Derr Lich': 'forgotten',
    'Desert Archer': 'physical',
    'Desert Architect': 'normal',
    'Desert Nomad': 'normal',
    'Desert Soldier': 'physical',
    Desperado: 'law',
    Destructoy: 'event',
    'Devious Gentleman': 'law',
    Diamond: 'normal',
    Diamondhide: 'forgotten',
    'Diminutive Detainee': 'physical',
    Dinosuit: 'event',
    'Dire Lycan': 'event',
    'Dirt Thing': 'forgotten',
    'Dojo Sensei': 'tactical',
    Doktor: 'rift',
    'Double Black Diamond Racer': 'event',
    'Draconic Warden': 'draconic',
    Dragon: 'draconic',
    Dragonbreather: 'draconic',
    Dragoon: 'draconic',
    'Dread Knight': 'rift',
    'Dread Pirate Mousert': 'hydro',
    'Dream Drifter': 'rift',
    Drudge: 'forgotten',
    Drummer: 'tactical',
    'Dumpling Chef': 'tactical',
    'Dumpling Delivery': 'rift',
    Dunehopper: 'shadow',
    'Dungeon Master': 'physical',
    Dwarf: 'normal',
    'Eagle Owl': 'tactical',
    Eclipse: 'forgotten',
    Eel: 'hydro',
    Effervescent: 'tactical',
    'Egg Painter': 'event',
    'Egg Scrambler': 'event',
    Eggscavator: 'event',
    'Eggsplosive Scientist': 'event',
    'Eggsquisite Entertainer': 'event',
    'El Flamenco': 'event',
    Elder: 'hydro',
    Elf: 'event',
    'Elite Guardian': 'hydro',
    'Elixir Maker': 'rift',
    'Elub Chieftain': 'hydro',
    'Elub Lich': 'forgotten',
    'Elven Princess': 'tactical',
    'Emberstone Scaled': 'draconic',
    'Empyrean Appraiser': 'normal',
    'Empyrean Empress': 'normal',
    'Empyrean Geologist': 'normal',
    'Empyrean Javelineer': 'draconic',
    'Enchanted Chess Club Champion': 'arcane',
    Enginseer: 'hydro',
    'Enlightened Labourer': 'rift',
    'Enslaved Spirit': 'shadow',
    'Epoch Golem': 'rift',
    'Escape Artist': 'physical',
    'Essence Collector': 'arcane',
    'Essence Guardian': 'arcane',
    'Ethereal Enchanter': 'arcane',
    'Ethereal Engineer': 'arcane',
    'Ethereal Guardian': 'forgotten',
    'Ethereal Librarian': 'arcane',
    'Ethereal Thief': 'arcane',
    'Evil Scientist': 'rift',
    'Excitable Electric': 'rift',
    'Exo-Tech': 'forgotten',
    Explorator: 'physical',
    'Extreme Everysports': 'normal',
    'Factory Technician': 'event',
    Fairy: 'tactical',
    'Fall Familiar': 'shadow',
    'Fallen Champion Footman': 'rift',
    'Falling Carpet': 'normal',
    Farmhand: 'normal',
    Farrier: 'law',
    Featherlight: 'arcane',
    Fencer: 'tactical',
    'Fete Fromager': 'event',
    'Fetid Swamp': 'shadow',
    Fibbocchio: 'forgotten',
    Fiddler: 'tactical',
    Field: 'normal',
    Fiend: 'hydro',
    'Fiery Crusher': 'shadow',
    Finder: 'tactical',
    Firebreather: 'tactical',
    Firefly: 'tactical',
    'Flamboyant Flautist': 'forgotten',
    'Flame Archer': 'physical',
    'Flame Ordnance': 'arcane',
    'Flame Warrior': 'physical',
    'Floating Spore': 'normal',
    Flutterby: 'tactical',
    'Fluttering Flutist': 'arcane',
    Flying: 'normal',
    Fog: 'normal',
    'Force Fighter Blue': 'event',
    'Force Fighter Green': 'event',
    'Force Fighter Pink': 'event',
    'Force Fighter Red': 'event',
    'Force Fighter Yellow': 'event',
    'Forgotten Elder': 'forgotten',
    'Fortuitous Fool': 'normal',
    Foxy: 'tactical',
    'Free Skiing': 'event',
    'Frightened Flying Fireworks': 'event',
    'Frigid Foreman': 'event',
    Frog: 'tactical',
    'Frost King': 'event',
    Frostbite: 'hydro',
    'Frostlance Guard': 'hydro',
    'Frostwing Commander': 'hydro',
    'Frosty Snow': 'normal',
    Frozen: 'normal',
    Fuel: 'law',
    "Ful'Mina the Mountain Queen": 'draconic',
    'Fungal Frog': 'rift',
    'Fungal Spore': 'hydro',
    'Fungal Technomorph': 'forgotten',
    Funglore: 'normal',
    'Fuzzy Drake': 'draconic',
    Gargantuamouse: 'draconic',
    Gargoyle: 'arcane',
    'Gate Guardian': 'arcane',
    'Gate Keeper': 'physical',
    'Gelatinous Octahedron': 'hydro',
    Gemorpher: 'forgotten',
    'Gemstone Worshipper': 'forgotten',
    'General Drheller': 'hydro',
    'Gentleman Caller': 'law',
    Ghost: 'shadow',
    'Ghost Pirate Queen': 'event',
    'Giant Snail': 'shadow',
    'Gilded Leaf': 'rift',
    Gingerbread: 'event',
    'Glacia Ice Fist': 'event',
    Gladiator: 'physical',
    'Glamorous Gladiator': 'physical',
    'Glass Blower': 'normal',
    Glazy: 'event',
    Glitchpaw: 'normal',
    'Gluttonous Zombie': 'shadow',
    Goblin: 'shadow',
    Gold: 'normal',
    Goldleaf: 'tactical',
    Golem: 'arcane',
    'Goliath Field': 'rift',
    Gorgon: 'arcane',
    'Gourd Ghoul': 'event',
    Gourdborg: 'event',
    'Grampa Golem': 'shadow',
    'Grand Master of the Dojo': 'rift',
    Grandfather: 'tactical',
    Granite: 'normal',
    'Granny Spice': 'arcane',
    'Grave Robber': 'event',
    'Great Giftnapper': 'event',
    'Great Winter Hunt Impostor': 'event',
    'Greedy Al': 'event',
    Greenbeard: 'forgotten',
    Grey: 'normal',
    'Grey Recluse': 'event',
    Greyrun: 'rift',
    'Grit Grifter': 'tactical',
    'Grizzled Silth': 'rift',
    'Ground Gavaleer': 'physical',
    Grubling: 'shadow',
    'Grubling Herder': 'shadow',
    Grunt: 'physical',
    Guardian: 'physical',
    Guppy: 'hydro',
    'Guqin Player': 'tactical',
    Gyrologer: 'tactical',
    'Hall Monitor': 'normal',
    'Hans Cheesetian Squeakersen': 'forgotten',
    Hapless: 'tactical',
    'Hapless Marionette': 'normal',
    'Harbinger of Death': 'rift',
    Hardboiled: 'event',
    'Hardworking Hauler': 'law',
    'Hare Razer': 'event',
    Harpy: 'shadow',
    'Harvest Harrier': 'shadow',
    Harvester: 'shadow',
    Hazmat: 'hydro',
    Healer: 'physical',
    'Heart of the Meteor': 'arcane',
    'Heavy Blaster': 'hydro',
    'Herbaceous Bravestalk': 'physical',
    Herc: 'physical',
    'High Roller': 'event',
    'Hired Eidolon': 'forgotten',
    Hoarder: 'event',
    Hollowed: 'event',
    'Hollowed Minion': 'event',
    Hollowhead: 'event',
    'Homeopathic Apothecary': 'normal',
    Hookshot: 'law',
    Hope: 'tactical',
    'Horned Cork Hoarder': 'draconic',
    'Hot Head': 'tactical',
    'Humphrey Dumphrey': 'forgotten',
    Huntereater: 'forgotten',
    Hurdle: 'normal',
    Hydra: 'normal',
    Hydrologist: 'hydro',
    Hydrophobe: 'physical',
    'Hypnotized Gunslinger': 'arcane',
    'Ice Regent': 'forgotten',
    'Iceberg Sculptor': 'event',
    Iceblade: 'hydro',
    Iceblock: 'hydro',
    Icebreaker: 'hydro',
    Icewing: 'hydro',
    Icicle: 'hydro',
    Ignatia: 'draconic',
    Ignis: 'shadow',
    'Illustrious Illusionist': 'arcane',
    Impersonator: 'physical',
    'Incompetent Ice Climber': 'hydro',
    'Industrious Digger': 'normal',
    'Inferna the Engulfed': 'arcane',
    'Inferno Mage': 'hydro',
    Infiltrator: 'tactical',
    'Invisible Fashionista': 'arcane',
    'Itty Bitty Rifty Burroughs': 'rift',
    'Itty-Bitty Burroughs': 'normal',
    Jellyfish: 'hydro',
    'Jovial Jailor': 'physical',
    Joy: 'event',
    Juliyes: 'normal',
    Jurassic: 'shadow',
    "Kalor'ignis of the Geyser": 'draconic',
    Karmachameleon: 'rift',
    Keeper: 'arcane',
    "Keeper's Assistant": 'arcane',
    'Key Master': 'physical',
    'King Grub': 'shadow',
    'King Scarab': 'shadow',
    'Kite Flyer': 'normal',
    Knight: 'tactical',
    Koimaid: 'hydro',
    'Kung Fu': 'tactical',
    'Lab Technician': 'hydro',
    'Lady Coldsnap': 'hydro',
    Lambent: 'rift',
    'Lambent Crystal': 'normal',
    'Lancer Guard': 'draconic',
    'Land Loafer': 'tactical',
    'Lasso Cowgirl': 'law',
    'Launchpad Labourer': 'normal',
    Lawbender: 'law',
    'Leafton Beanwell': 'physical',
    Leprechaun: 'prize',
    'Lethargic Guard': 'physical',
    Leviathan: 'hydro',
    Lich: 'arcane',
    'Lightning Rod': 'normal',
    'Limestone Miner': 'normal',
    'Little Bo Squeak': 'forgotten',
    'Little Miss Fluffet': 'forgotten',
    'Living Ice': 'hydro',
    'Living Salt': 'hydro',
    'Loathsome Locust': 'tactical',
    Lockpick: 'physical',
    Longtail: 'normal',
    'Lord Splodington': 'hydro',
    Lost: 'forgotten',
    'Lost Legionnaire': 'forgotten',
    'Lovely Sports': 'normal',
    Lucky: 'event',
    Lumahead: 'normal',
    Lumberjack: 'normal',
    'Lumi-lancer': 'rift',
    'Lunar Red Candle Maker': 'event',
    Lycan: 'shadow',
    Lycanoid: 'rift',
    M400: 'normal',
    M1000: 'normal',
    'Mad Elf': 'event',
    "Madame d'Ormouse": 'forgotten',
    'Mage Weaver': 'normal',
    Magic: 'normal',
    'Magic Champion': 'rift',
    'Magical Multitasker': 'shadow',
    'Magma Carrier': 'shadow',
    Magmarage: 'hydro',
    'Magmatic Crystal Thief': 'law',
    'Magmatic Golem': 'law',
    'Mairitime Pirate': 'normal',
    'Maize Harvester': 'event',
    'Malevolent Maestro': 'physical',
    'Malicious Marquis': 'physical',
    Mammoth: 'hydro',
    'Manaforge Smith': 'forgotten',
    Manatee: 'hydro',
    'Market Guard': 'normal',
    'Market Thief': 'law',
    Martial: 'rift',
    'Masked Pikeman': 'forgotten',
    'Master Burglar': 'law',
    'Master Exploder': 'rift',
    'Master of the Cheese Belt': 'tactical',
    'Master of the Cheese Claw': 'tactical',
    'Master of the Cheese Fang': 'tactical',
    'Master of the Chi Belt': 'rift',
    'Master of the Chi Claw': 'rift',
    'Master of the Chi Fang': 'rift',
    'Master of the Dojo': 'tactical',
    'Matriarch Gander': 'forgotten',
    'Matron of Machinery': 'forgotten',
    'Matron of Wealth': 'forgotten',
    'Mecha Tail': 'rift',
    Medicine: 'rift',
    'Melancholy Merchant': 'normal',
    'Melodramatic Minnow': 'hydro',
    'Menace of the Rift': 'rift',
    Mermouse: 'hydro',
    Mermousette: 'hydro',
    Mershark: 'hydro',
    'Meteorite Golem': 'arcane',
    'Meteorite Miner': 'law',
    'Meteorite Mover': 'law',
    'Meteorite Mystic': 'arcane',
    'Meteorite Snacker': 'law',
    Micro: 'rift',
    'Mighty Mite': 'tactical',
    'Mighty Mole': 'rift',
    'Mild Spicekin': 'draconic',
    'Militant Samurai': 'rift',
    Mimic: 'forgotten',
    'Mind Tearer': 'forgotten',
    Miner: 'normal',
    'Mining Materials Manager': 'law',
    Mintaka: 'physical',
    'Mischievous Meteorite Miner': 'law',
    'Mischievous Wereminer': 'shadow',
    Miser: 'event',
    'Misfortune Teller': 'arcane',
    'Missile Toe': 'event',
    'Mist Maker': 'hydro',
    'Mixing Mishap': 'shadow',
    'Mlounder Flounder': 'hydro',
    Mobster: 'prize',
    Mole: 'normal',
    'Molten Midas': 'forgotten',
    Monarch: 'tactical',
    Monk: 'tactical',
    'Monsoon Maker': 'shadow',
    Monster: 'normal',
    'Monster of the Meteor': 'arcane',
    'Monster Tail': 'hydro',
    'Monstrous Abomination': 'rift',
    'Monstrous Black Widow': 'rift',
    'Monstrous Midge': 'tactical',
    Moosker: 'tactical',
    'Mossy Moosker': 'rift',
    'Mouldy Mole': 'normal',
    Mountain: 'normal',
    'Mousataur Priestess': 'event',
    'Mouse of Elements': 'rift',
    'Mouse of Winter Future': 'event',
    'Mouse of Winter Past': 'event',
    'Mouse of Winter Present': 'event',
    'Mouse With No Name': 'law',
    'Mousevina von Vermin': 'shadow',
    Moussile: 'event',
    Mummy: 'shadow',
    Mush: 'normal',
    'Mush Monster': 'forgotten',
    'Mushroom Harvester': 'forgotten',
    'Mushroom Sprite': 'normal',
    'Mutant Mongrel': 'hydro',
    'Mutant Ninja': 'hydro',
    'Mutated Behemoth': 'hydro',
    'Mutated Brown': 'normal',
    'Mutated Grey': 'normal',
    'Mutated Mole': 'normal',
    'Mutated Siblings': 'hydro',
    'Mutated White': 'normal',
    'Mysterious Traveller': 'law',
    Mystic: 'hydro',
    'Mystic Bishop': 'tactical',
    'Mystic Guardian': 'forgotten',
    'Mystic Herald': 'forgotten',
    'Mystic King': 'tactical',
    'Mystic Knight': 'tactical',
    'Mystic Pawn': 'tactical',
    'Mystic Queen': 'tactical',
    'Mystic Rook': 'tactical',
    'Mystic Scholar': 'forgotten',
    'Mythical Giant King': 'physical',
    'Mythical Master Sorcerer': 'normal',
    Mythweaver: 'forgotten',
    'Nachore Golem': 'shadow',
    'Nachous the Molten': 'shadow',
    Narrator: 'tactical',
    Naturalist: 'rift',
    'Naughty Nougat': 'event',
    Necromancer: 'hydro',
    'Nefarious Nautilus': 'hydro',
    'Nerg Chieftain': 'tactical',
    'Nerg Lich': 'forgotten',
    "New Year's": 'event',
    Nibbler: 'normal',
    'Nice Knitting': 'event',
    'Night Shift Materials Manager': 'shadow',
    'Night Watcher': 'arcane',
    Nightfire: 'arcane',
    Nightmancer: 'shadow',
    'Nightshade Flower Girl': 'normal',
    'Nightshade Fungalmancer': 'forgotten',
    'Nightshade Maiden': 'normal',
    'Nightshade Masquerade': 'normal',
    'Nightshade Nanny': 'forgotten',
    Nimbomancer: 'hydro',
    Ninja: 'tactical',
    'Nitro Racer': 'event',
    Nomad: 'tactical',
    'Nomadic Warrior': 'rift',
    Nugget: 'normal',
    Nutcracker: 'event',
    'Obstinate Oboist': 'physical',
    Octomermaid: 'hydro',
    "Ol' King Coal": 'event',
    'Old One': 'hydro',
    'Old Spice Collector': 'arcane',
    'One-Mouse Band': 'rift',
    'Onion Chopper': 'event',
    Ooze: 'arcane',
    'Ore Chipper': 'shadow',
    Ornament: 'event',
    'Outbreak Assassin': 'hydro',
    Outlaw: 'law',
    'Over-Prepared': 'hydro',
    Overcaster: 'shadow',
    'Oxygen Baron': 'hydro',
    Pack: 'hydro',
    Page: 'tactical',
    Paladin: 'arcane',
    'Paladin Weapon Master': 'forgotten',
    'Pan Slammer': 'event',
    'Para Para Dancer': 'event',
    'Paragon of Arcane': 'arcane',
    'Paragon of Dragons': 'draconic',
    'Paragon of Forgotten': 'forgotten',
    'Paragon of Shadow': 'shadow',
    'Paragon of Strength': 'physical',
    'Paragon of Tactics': 'tactical',
    'Paragon of the Lawless': 'law',
    'Paragon of Water': 'hydro',
    'Parlour Player': 'law',
    'Party Head': 'event',
    Passenger: 'law',
    Pathfinder: 'tactical',
    'Peaceful Prisoner': 'physical',
    Pearl: 'hydro',
    'Pearl Diver': 'hydro',
    Pebble: 'normal',
    'Peevish Piccoloist': 'physical',
    'Peggy the Plunderer': 'normal',
    Penguin: 'hydro',
    'Pernicious Prince': 'physical',
    'Perpetual Detention': 'arcane',
    Phalanx: 'tactical',
    'Phase Zombie': 'rift',
    Photographer: 'law',
    'Pie Thief': 'law',
    Pinchy: 'hydro',
    Pinkielina: 'forgotten',
    Pintail: 'event',
    Pirate: 'hydro',
    'Pirate Anchor': 'hydro',
    'Plague Hag': 'hydro',
    'Plotting Page': 'physical',
    'Plutonium Tentacle': 'rift',
    'Pneumatic Dirt Displacement': 'rift',
    Pocketwatch: 'physical',
    'Polar Bear': 'hydro',
    'Pompous Perch': 'hydro',
    'Portable Generator': 'rift',
    'Portal Paladin': 'rift',
    'Portal Plunderer': 'rift',
    'Portal Pursuer': 'rift',
    'Possessed Armaments': 'rift',
    'Praetorian Champion': 'rift',
    Present: 'event',
    'Prestigious Adventurer': 'rift',
    'Prestigious Prestidigitator': 'shadow',
    Primal: 'shadow',
    'Princess and the Olive': 'forgotten',
    'Princess Fist': 'hydro',
    Prospector: 'law',
    Protector: 'hydro',
    Prototype: 'rift',
    Puddlemancer: 'physical',
    Puffer: 'hydro',
    Pugilist: 'normal',
    'Pump Raider': 'law',
    'Pumpkin Head': 'shadow',
    'Pumpkin Hoarder': 'event',
    'Puppet Champion': 'rift',
    'Puppet Master': 'normal',
    Puppetto: 'rift',
    'Pygmy Wrangler': 'shadow',
    Pyrehyde: 'draconic',
    Pyrite: 'law',
    'Queen Quesada': 'law',
    'Queso Extractor': 'law',
    Quesodillo: 'shadow',
    Quillback: 'normal',
    'Radioactive Ooze': 'rift',
    'Rain Collector': 'shadow',
    'Rain Summoner': 'shadow',
    'Rain Wallower': 'shadow',
    'Rainbow Racer': 'event',
    Rainmancer: 'shadow',
    'Rainwater Purifier': 'normal',
    'Rambunctious Rain Rumbler': 'draconic',
    'Rancid Bog Beast': 'rift',
    'Ravenous Zombie': 'shadow',
    'Raw Diamond': 'rift',
    'Reality Restitch': 'event',
    'Realm Ripper': 'arcane',
    'Reanimated Carver': 'forgotten',
    Reaper: 'arcane',
    'Record Keeper': 'rift',
    "Record Keeper's Assistant": 'rift',
    'Red Coat Bear': 'rift',
    'Red Envelope': 'event',
    'Red-Eyed Watcher Owl': 'rift',
    'Regal Spearman': 'draconic',
    Reinbo: 'event',
    'Relic Hunter': 'normal',
    Renegade: 'physical',
    'Retired Minotaur': 'forgotten',
    'Reveling Lycanthrope': 'shadow',
    Revenant: 'rift',
    Ribbon: 'event',
    'Richard the Rich': 'normal',
    'Ridiculous Sweater': 'event',
    'Rift Bio Engineer': 'rift',
    'Rift Guardian': 'rift',
    'Rift Tiger': 'rift',
    Rifterranian: 'rift',
    Riftweaver: 'rift',
    Riptide: 'normal',
    Robat: 'rift',
    'Rock Muncher': 'normal',
    Rocketeer: 'tactical',
    Rockstar: 'event',
    Rogue: 'physical',
    Romeno: 'normal',
    Romeo: 'normal',
    'Root Rummager': 'tactical',
    'RR-8': 'forgotten',
    'Rubble Rouser': 'shadow',
    'Rubble Rummager': 'shadow',
    Ruffian: 'law',
    'S.N.O.W. Golem': 'event',
    Saboteur: 'hydro',
    'Sacred Shrine': 'arcane',
    'Saloon Gal': 'law',
    'Salt Water Snapper': 'hydro',
    'Saltwater Axolotl': 'hydro',
    Samurai: 'tactical',
    'Sand Cavalry': 'tactical',
    'Sand Colossus': 'shadow',
    'Sand Dollar Diver': 'hydro',
    'Sand Dollar Queen': 'hydro',
    'Sand Pilgrim': 'shadow',
    'Sand Sifter': 'hydro',
    Sandmouse: 'event',
    'Sandwing Cavalry': 'tactical',
    Sanguinarian: 'forgotten',
    Sarcophamouse: 'shadow',
    'Sassy Salsa Dancer': 'physical',
    Scarab: 'shadow',
    Scarecrow: 'shadow',
    'Scarlet Revenger': 'normal',
    Scavenger: 'arcane',
    'Scheming Squire': 'physical',
    'School of Mish': 'hydro',
    'Scorned Pirate': 'event',
    Scout: 'hydro',
    'Scrap Metal Monster': 'hydro',
    Scribe: 'physical',
    Scrooge: 'event',
    Scruffy: 'normal',
    Seadragon: 'hydro',
    'Seasoned Islandographer': 'tactical',
    Seer: 'physical',
    'Sentient Slime': 'rift',
    Sentinel: 'physical',
    'Serpent Monster': 'hydro',
    Serpentine: 'shadow',
    'Shackled Servant': 'rift',
    'Shade of the Eclipse': 'rift',
    'Shadow Master Sorcerer': 'shadow',
    'Shadow Sage': 'shadow',
    'Shadow Stalker': 'forgotten',
    Shaman: 'tactical',
    'Shaolin Kung Fu': 'rift',
    'Shard Centurion': 'rift',
    Sharpshooter: 'law',
    'Shattered Carmine': 'hydro',
    'Shattered Obsidian': 'forgotten',
    Shelder: 'hydro',
    Shinobi: 'rift',
    Shipwrecked: 'hydro',
    Shopkeeper: 'law',
    Shortcut: 'event',
    'Shorts-All-Year': 'event',
    Shroom: 'hydro',
    Silth: 'hydro',
    Silvertail: 'normal',
    'Sinister Egg Painter': 'event',
    'Sinister Squid': 'hydro',
    'Sir Fleekio': 'forgotten',
    Siren: 'hydro',
    'Sizzle Pup': 'draconic',
    'Skeletal Champion': 'rift',
    Skeleton: 'arcane',
    'Sky Dancer': 'arcane',
    'Sky Glass Glazier': 'arcane',
    'Sky Glass Sorcerer': 'arcane',
    'Sky Glider': 'arcane',
    'Sky Greaser': 'normal',
    'Sky Highborne': 'arcane',
    'Sky Squire': 'physical',
    'Sky Surfer': 'hydro',
    'Sky Swordsman': 'physical',
    Skydiver: 'normal',
    'Slay Ride': 'event',
    Slayer: 'tactical',
    'Sleep Starved Scholar': 'arcane',
    Sleepwalker: 'event',
    'Sleepy Merchant': 'law',
    Slimefist: 'hydro',
    'Slope Swimmer': 'normal',
    Sludge: 'hydro',
    'Sludge Scientist': 'normal',
    'Sludge Soaker': 'hydro',
    'Sludge Swimmer': 'hydro',
    Smoldersnap: 'draconic',
    'Smug Smuggler': 'physical',
    'Snake Charmer': 'normal',
    Snooty: 'event',
    'Snow Boulder': 'event',
    'Snow Bowler': 'hydro',
    'Snow Fort': 'event',
    'Snow Golem Architect': 'event',
    'Snow Golem Jockey': 'event',
    'Snow Scavenger': 'event',
    'Snow Slinger': 'hydro',
    'Snow Sniper': 'hydro',
    'Snow Soldier': 'hydro',
    'Snow Sorceress': 'event',
    'Snowball Hoarder': 'event',
    Snowblind: 'hydro',
    Snowblower: 'event',
    Snowflake: 'event',
    Snowglobe: 'event',
    'Sock Puppet Ghost': 'normal',
    'Soldier of the Shade': 'rift',
    'Solemn Soldier': 'forgotten',
    Soothsayer: 'hydro',
    Sorcerer: 'arcane',
    'Soul Binder': 'forgotten',
    'Space Party-Time Plumber': 'event',
    'Spear Fisher': 'hydro',
    'Spectral Butler': 'event',
    'Spectral Swashbuckler': 'event',
    Spectre: 'arcane',
    Speedy: 'normal',
    Spellbinder: 'physical',
    'Spheric Diviner': 'forgotten',
    'Spice Farmer': 'arcane',
    'Spice Finder': 'arcane',
    'Spice Merchant': 'normal',
    'Spice Raider': 'arcane',
    'Spice Reaper': 'arcane',
    'Spice Seer': 'arcane',
    'Spice Sovereign': 'arcane',
    Spider: 'arcane',
    'Spiked Burrower': 'normal',
    'Spiky Devil': 'shadow',
    'Spirit Fox': 'rift',
    'Spirit Light': 'event',
    'Spirit of Balance': 'rift',
    'Spiritual Steel': 'rift',
    'Splintered Stone Sentry': 'forgotten',
    Spore: 'hydro',
    'Spore Muncher': 'normal',
    'Spore Salesman': 'normal',
    Sporeticus: 'normal',
    'Sporty Ski Instructor': 'event',
    Spotted: 'normal',
    'Spring Familiar': 'physical',
    'Spring Sprig': 'event',
    'Sprinkly Sweet Cupcake Cook': 'event',
    'Spry Sky Explorer': 'forgotten',
    'Spry Sky Seer': 'forgotten',
    Spud: 'normal',
    Squeaken: 'hydro',
    'Squeaker Bot': 'normal',
    'Squeaker Claws': 'event',
    'Stack of Thieves': 'law',
    'Stagecoach Driver': 'law',
    Stalagmite: 'forgotten',
    Stealth: 'physical',
    'Steam Grip': 'physical',
    'Steam Sailor': 'draconic',
    Steel: 'normal',
    'Steel Horse Rider': 'law',
    Stickybomber: 'hydro',
    Stinger: 'tactical',
    Stingray: 'hydro',
    Stocking: 'event',
    'Stone Cutter': 'normal',
    'Stone Maiden': 'forgotten',
    'Stonework Warrior': 'shadow',
    'Stormsurge the Vile Tempest': 'draconic',
    Stoutgear: 'law',
    Stowaway: 'law',
    Stratocaster: 'shadow',
    'Strawberry Hotcakes': 'hydro',
    'Stuck Snowball': 'event',
    'Student of the Cheese Belt': 'tactical',
    'Student of the Cheese Claw': 'tactical',
    'Student of the Cheese Fang': 'tactical',
    'Student of the Chi Belt': 'rift',
    'Student of the Chi Claw': 'rift',
    'Student of the Chi Fang': 'rift',
    'Stuffy Banker': 'law',
    'Suave Pirate': 'normal',
    Subterranean: 'normal',
    'Sugar Rush': 'event',
    'Sultry Saxophonist': 'physical',
    'Summer Mage': 'tactical',
    'Summoning Scholar': 'forgotten',
    'Sunken Banshee': 'hydro',
    'Sunken Citizen': 'hydro',
    'Super FighterBot MegaSupreme': 'event',
    'Super Mega Mecha Ultra RoboGold': 'rift',
    Supernatural: 'rift',
    'Supply Hoarder': 'law',
    'Supreme Sensei': 'rift',
    'Surgeon Bot': 'rift',
    Swabbie: 'hydro',
    'Swamp Runner': 'hydro',
    'Swamp Thang': 'event',
    'Swarm of Pygmy Mice': 'shadow',
    Swashblade: 'hydro',
    Sylvan: 'tactical',
    'Tackle Tracker': 'hydro',
    Tadpole: 'hydro',
    Taleweaver: 'hydro',
    Tanglefoot: 'physical',
    'Tech Golem': 'forgotten',
    'Tech Ravenous Zombie': 'rift',
    'Technic Bishop': 'tactical',
    'Technic King': 'tactical',
    'Technic Knight': 'tactical',
    'Technic Pawn': 'tactical',
    'Technic Queen': 'tactical',
    'Technic Rook': 'tactical',
    'Teenage Vampire': 'event',
    'Telekinetic Mutant': 'hydro',
    'Teleporting Truant': 'shadow',
    Tentacle: 'hydro',
    Terra: 'shadow',
    'Terrible Twos': 'event',
    'Terrified Adventurer': 'rift',
    'Terror Knight': 'arcane',
    'The Menace': 'hydro',
    'The Total Eclipse': 'rift',
    'Theurgy Warden': 'physical',
    Thirsty: 'hydro',
    Thistle: 'hydro',
    Thorn: 'hydro',
    'Thunder Strike': 'draconic',
    'Thundering Watcher': 'draconic',
    '⚡Thunderlord⚡': 'draconic',
    'Tidal Fisher': 'shadow',
    Tiger: 'tactical',
    'Time Punk': 'event',
    'Time Tailor': 'event',
    'Time Thief': 'event',
    'Timeless Lich': 'rift',
    'Timelost Thaumaturge': 'rift',
    'Timeslither Pythoness': 'rift',
    'Timid Explorer': 'rift',
    Tiny: 'normal',
    'Tiny Dragonfly': 'draconic',
    'Tiny Saboteur': 'law',
    'Tiny Toppler': 'shadow',
    'Titanic Brain-Taker': 'event',
    'Toboggan Technician': 'event',
    'Tomb Exhumer': 'event',
    'Tome Sprite': 'tactical',
    'Tonic Salesman': 'law',
    'Totally Not Tax Fraud': 'normal',
    'Toxic Avenger': 'rift',
    'Toxic Warrior': 'hydro',
    Toxikinetic: 'rift',
    Toy: 'event',
    'Toy Sylvan': 'normal',
    'Toy Tinkerer': 'event',
    Trailblazer: 'physical',
    'Train Conductor': 'law',
    'Train Engineer': 'law',
    Trampoline: 'normal',
    'Travelling Barber': 'law',
    'Treacherous Tubaist': 'physical',
    Treant: 'tactical',
    'Treant Queen': 'rift',
    'Treasure Brawler': 'forgotten',
    'Treasure Hoarder': 'hydro',
    'Treasure Keeper': 'hydro',
    Treasurer: 'event',
    Treat: 'event',
    'Tree Troll': 'rift',
    'Tri-dra': 'rift',
    Trick: 'event',
    'Tricky Witch': 'event',
    'Triple Lutz': 'event',
    Tritus: 'hydro',
    Troll: 'shadow',
    Tumbleweed: 'law',
    'Tundra Huntress': 'event',
    'Turret Guard': 'hydro',
    'Twisted Carmine': 'hydro',
    'Twisted Fiend': 'shadow',
    'Twisted Hotcakes': 'hydro',
    'Twisted Lilly': 'hydro',
    'Twisted Treant': 'rift',
    'Tyrannical Thaumaturge': 'arcane',
    'Uncoordinated Cauldron Carrier': 'shadow',
    Undertaker: 'law',
    'Unwavering Adventurer': 'rift',
    'Upper Class Lady': 'law',
    'Urchin King': 'hydro',
    Vampire: 'shadow',
    Vanguard: 'physical',
    Vanquisher: 'hydro',
    Vaporior: 'draconic',
    'Vicious Vampire Squid': 'hydro',
    'Vigilant Ward': 'rift',
    'Vincent the Magnificent': 'event',
    'Vindictive Viscount': 'physical',
    Vinetail: 'physical',
    'Vinneus Stalkhome': 'physical',
    'Violent Violinist': 'physical',
    'Violet Stormchild': 'draconic',
    Walker: 'tactical',
    'Wandering Monk': 'rift',
    'Warden of Fog': 'normal',
    'Warden of Frost': 'normal',
    'Warden of Rain': 'normal',
    'Warden of Wind': 'normal',
    'Warehouse Manager': 'law',
    'Warming Wyvern': 'draconic',
    Warmonger: 'physical',
    'Water Nymph': 'hydro',
    'Water Sprite': 'rift',
    'Water Wielder': 'hydro',
    'Wave Racer': 'normal',
    Wealth: 'rift',
    'Wealthy Werewarrior': 'shadow',
    Werehauler: 'shadow',
    Wereminer: 'shadow',
    Whelpling: 'draconic',
    'Whimsical Waltzer': 'physical',
    Whirleygig: 'shadow',
    White: 'normal',
    'White Mage': 'arcane',
    'Wicked Witch of Whisker Woods': 'tactical',
    Wiggler: 'tactical',
    Wight: 'arcane',
    'Wild Chainsaw': 'event',
    'Wily Weevil': 'tactical',
    'Wind Warrior': 'arcane',
    'Wind Watcher': 'arcane',
    'Windy Farmer': 'normal',
    'Winged Harpy': 'rift',
    'Winter Games': 'normal',
    'Winter Mage': 'hydro',
    'Withered Remains': 'rift',
    Wolfskie: 'hydro',
    Wordsmith: 'physical',
    Worker: 'tactical',
    'Worried Wayfinder': 'tactical',
    'Wound Up White': 'normal',
    'Wrathful Warden': 'physical',
    'Wreath Thief': 'event',
    Yeti: 'hydro',
    'Young Prodigy Racer': 'event',
    'Zealous Academic': 'shadow',
    Zephyr: 'shadow',
    Zombie: 'shadow',
    'Zombot Unipire': 'event',
    'Zombot Unipire the Third': 'rift',
    'Zurreal the Eternal': 'tactical',
    'Squire Sizzleton': 'draconic',
    'Torchbearer Tinderhelm': 'draconic',
    'Colonel Crisp': 'draconic',
    'Crematio Scorchworth': 'draconic',
    'Flamina Cinderbreath': 'draconic',
    'Combustius Furnaceheart': 'draconic',
    'Incendarius the Unquenchable': 'draconic',
    'Sulfurious the Raging Inferno': 'draconic',
    'Frostnip Icebound': 'draconic',
    'Blizzara Winterosa': 'draconic',
    'Iciclesius the Defender': 'draconic',
    'Rimeus Polarblast': 'draconic',
    'Frigidocius Coldshot': 'draconic',
    'Chillandria Permafrost': 'draconic',
    'Avalancheus the Glacial': 'draconic',
    'Arcticus the Biting Frost': 'draconic',
    'Goopus Dredgemore': 'draconic',
    'Noxio Sludgewell': 'draconic',
    'Dreck Grimehaven': 'draconic',
    'Malignus Vilestrom': 'draconic',
    'Venomona Festerbloom': 'draconic',
    'Belchazar Banewright': 'draconic',
    'Pestilentia the Putrid': 'draconic',
    'Corrupticus the Blight Baron': 'draconic',
    'Tranquilia Protecticus': 'draconic',
    'Absolutia Harmonius': 'draconic',
    'Magnatius Majestica': 'draconic',
    'Supremia Magnificus': 'draconic',
    "Three'amat the Mother of Dragons": 'draconic',
    'Mythical Dragon Emperor': 'draconic',
    'Bark Burner': 'tactical',
    'Sap Stealer': 'tactical',
    'Branch Breaker': 'tactical',
    'Moss Comber': 'tactical',
    'Sardonic Sapling': 'tactical',
    'Twisted Twig': 'tactical',
    'Sour Sprout': 'tactical',
    'Maniacal Maple': 'tactical',
    'Brash Birch': 'tactical',
    'Wailing Willow': 'tactical',
    'Furious Fir': 'tactical',
    'Heinous Hemlock': 'tactical',
    'Rampaging Redwood': 'tactical',
    'Herbicidal Maniac': 'tactical',
    'Blight Incarnate': 'tactical',
    'Crusty Crab': 'hydro',
    'Abrasive Abalone': 'hydro',
    'Scornful Scallop': 'hydro',
    'Barbaric Barnacle': 'hydro',
    'Anguished Anemone': 'hydro',
    'Menacing Medusozoa': 'hydro',
    'Belligerent Berghia': 'hydro',
    'Loutish Loach': 'hydro',
    'Pesky Pleco': 'hydro',
    'Shifty Shrimp': 'hydro',
    'Killer Krill': 'hydro',
    'Chaotic Chiton': 'hydro',
    'Muscular Mussel': 'hydro',
    'Nyagarha the Falls Guardian': 'hydro',
    'Ancient Wisdom Keeper': 'hydro',
  };
  if (miceMap[mouseName] == undefined) {
    console.warn('Mouse not found', mouseName, miceMap[mouseName]);
  }
  return miceMap[mouseName];
}

function hidePowerCrowns() {
  if ($('.mouseCrownsView-group-header.powerCrown').length > 0) {
    $('.mouseCrownsView-group-header.powerCrown').remove();
    $('.mouseCrownsView-group:not(.favorite)').find('.pt').remove();
  }
}

/********** Copy Crowns **********/
function copyMyCrowns() {
  const debug = localStorage.getItem('ws.debug');
  hg.utils.MouseUtil.getHuntingStats(function (data) {
    let statArray = [];
    data.forEach(function (arrayItem, index) {
      const mouseName = correctMouseName(arrayItem.name);
      const catches = arrayItem.num_catches;
      const misses = arrayItem.num_misses;
      statArray[index] = [mouseName, catches, misses];
    });
    if (debug == true) {
      console.log('My Mice Array', statArray);
    }
    let finalTable = statArray.map((e) => e.join(',')).join('\n');
    GM_setClipboard(finalTable);
    const copyCrownsButton = $('#copyCrownsButton');
    copyCrownsButton.css({
      'border-style': 'solid',
      'border-color': '#f44336',
      'border-width': '2px',
    });
    setTimeout(function () {
      copyCrownsButton.css({
        'border-style': 'solid',
        'border-color': 'grey',
        'border-width': '1px',
      });
    }, 1000);
  });
}

function copyCrowns() {
  const debug = localStorage.getItem('ws.debug');
  const allMice = $(
    '.mouseCrownsView-group.none,.mouseCrownsView-group.bronze,.mouseCrownsView-group.silver,.mouseCrownsView-group.gold,.mouseCrownsView-group.platinum,.mouseCrownsView-group.diamond'
  ).find('.mouseCrownsView-group-mouse');
  let miceArray = [];
  allMice.each(function (i) {
    let $mouse = correctMouseName(
      $(this).find('.mouseCrownsView-group-mouse-name').text()
    );
    let $count = parseInt(
      $(this)
        .find('.mouseCrownsView-group-mouse-catches')
        .text()
        .replace(',', ''),
      10
    );
    miceArray[i] = [$mouse, $count];
  });
  // need to sort uncrowned by # instead of Alpha
  if (debug == true) {
    console.log('Their Mice Array', miceArray);
  }
  let finalTable = miceArray.map((e) => e.join(',')).join('\n');
  GM_setClipboard(finalTable);
  const copyCrownsButton = $('#copyCrownsButton');
  copyCrownsButton.css({
    'border-style': 'solid',
    'border-color': 'grey',
    'border-width': '1px',
  });
  setTimeout(function () {
    copyCrownsButton.css({
      'border-style': 'solid',
      'border-color': 'grey',
      'border-width': '1px',
    });
  }, 1000);
}

function correctMouseName(mouseName) {
  mouseName = mouseName.replace(' Mouse', '');
  let newMouseName = '';
  if (mouseName == "Ful'Mina, The Mountain Queen") {
    newMouseName = "Ful'mina the Mountain Queen";
  } else if (mouseName == 'Inferna, The Engulfed') {
    newMouseName = 'Inferna the Engulfed';
  } else if (mouseName == 'Nachous, The Molten') {
    newMouseName = 'Nachous the Molten';
  } else if (mouseName == 'Stormsurge, the Vile Tempest') {
    newMouseName = 'Stormsurge the Vile Tempest';
  } else if (mouseName == 'Bruticus, the Blazing') {
    newMouseName = 'Bruticus the Blazing';
  } else if (mouseName == 'Vincent, The Magnificent') {
    newMouseName = 'Vincent The Magnificent';
  } else if (mouseName == 'Corky, the Collector') {
    newMouseName = 'Corky the Collector';
  } else if (mouseName == "Ol' King Coal") {
    newMouseName = 'Ol King Coal';
  } else if (mouseName == 'Dread Piratert') {
    newMouseName = 'Dread Pirate Mousert';
  } else {
    newMouseName = mouseName;
  }
  return newMouseName;
}

function decorate() {
  let collapseProps = JSON.parse(
    localStorage.getItem('ws.mh.pfp.collapseProps')
  );
  if (collapseProps) {
  } else {
    collapseProps = {
      none: 'E',
      bronze: 'E',
      silver: 'E',
      gold: 'E',
      platinum: 'E',
      diamond: 'E',
      favourite: 'E',
    };
    localStorage.setItem(
      'ws.mh.pfp.collapseProps',
      JSON.stringify(collapseProps)
    );
  }
  let uncrowned = $('.mouseCrownsView-group.none').find(
    '.mouseCrownsView-crown.none'
  );
  $(uncrowned).css({
    'background-image':
      "url('https://cdn-icons-png.flaticon.com/512/3281/3281316.png')",
    'background-repeat': 'no-repeat',
    'background-size': 'contain',
  });
  let favorites = $('.mouseCrownsView-group-mouse');
  $(favorites).each(function (i) {
    const image = $(this).find('.mouseCrownsView-group-mouse-image');
    const catches = parseInt(
      $(this)
        .find('.mouseCrownsView-group-mouse-catches')
        .text()
        .replace(',', ''),
      10
    );
    setCrownBorder(image, catches);
    if (localStorage.getItem('ShowPowerCrowns') == 'Y') {
      populatePowerCrowns(this);
    }
  });
  $('.mouseCrownsView-group').each(function (index) {
    const thisCrown = $(this)
      .attr('class')
      .replace('mouseCrownsView-group ', '');
    const isHeaderExpanded = collapseProps[thisCrown];
    if (isHeaderExpanded == 'E') {
      $(this).find('.mouseCrownsView-group-mice').removeClass('hidden');
    } else {
      $(this).find('.mouseCrownsView-group-mice').addClass('hidden');
    }
    const header = $(this).find('.mouseCrownsView-group-header');
    let catches = header.find('.mouseCrownsView-group-header-subtitle').text();
    catches = parseInt(
      catches
        .replace('Earned at ', '')
        .replace(' catches', '')
        .replace(',', ''),
      10
    );
    setCrownBorder(header, catches, isHeaderExpanded);
  });
}

$(document).on(
  'click',
  '.mouseCrownsView-group-header:not(.community):not(.powerCrown)',
  function (e) {
    showHideCrowns($(this).parent());
  }
);

function showHideCrowns(thisGroup) {
  let collapseProps = JSON.parse(
    localStorage.getItem('ws.mh.pfp.collapseProps')
  );
  const thisCrown = $(thisGroup)
    .attr('class')
    .replace('mouseCrownsView-group ', '');
  const theseMice = $(thisGroup).find('.mouseCrownsView-group-mice');
  if (theseMice.hasClass('hidden')) {
    collapseProps[thisCrown] = 'E';
  } else {
    collapseProps[thisCrown] = 'C';
  }
  theseMice.toggle();
  localStorage.setItem(
    'ws.mh.pfp.collapseProps',
    JSON.stringify(collapseProps)
  );
  decorate();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ITEMS TAB
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function manageCollected() {
  let itemContainer = $('.hunterProfileItemsView-content-padding');
  //Hide LE Layout
  if ($('.hideLeContainer').length == 0) {
    let hideLeContainer = document.createElement('div');
    hideLeContainer.classList.add('hideLeContainer');
    let hideLeCb = document.createElement('input');
    hideLeCb.type = 'checkbox';
    hideLeCb.name = 'hideLeCb';
    hideLeCb.value = '';
    hideLeCb.id = 'hideLeCb';
    hideLeCb.checked = '';
    if (localStorage.getItem('hideLeItems') == 'Y') {
      hideLeCb.checked = 'Yes';
    } else {
      hideLeCb.checked = '';
    }
    let hideLeLabel = document.createElement('label');
    hideLeLabel.htmlFor = 'hideLeLabel';
    hideLeLabel.appendChild(document.createTextNode('Hide LE  Items'));
    hideLeContainer.append(hideLeCb);
    hideLeContainer.append(hideLeLabel);
    $(itemContainer).prepend(hideLeContainer);
    $(hideLeContainer).css({
      width: '100%',
    });
    $(hideLeLabel).css({
      fontSize: '14px',
      width: '80%',
    });
    $(hideLeCb).css({
      width: '5%',
    });
  }
  if (localStorage.getItem('hideLeItems') == 'Y') {
    hideLeItems();
  }
  let allTypes = $('.hunterProfileItemsView-categoryContent');
  let allItems = $(allTypes).children();
  allItems.click(function () {
    hg.views.ItemView.show($(this).attr('data-type'));
  });
}

function hideLeItems() {
  let allTypes = $('.hunterProfileItemsView-categoryContent.active');
  let allCollected = $(allTypes)
    .find('.hunterProfileItemsView-categoryContent-item.collected')
    .not('.limited_edition');
  let allUncollected = $(allTypes).find(
    '.hunterProfileItemsView-categoryContent-item.uncollected'
  );
  let collectedLe = $(allTypes).find(
    '.hunterProfileItemsView-categoryContent-item.collected.limited_edition'
  );
  let activeTab = $('.hunterProfileItemsView-filter').filter('.active');
  if ($(activeTab).hasClass('collected')) {
    $(allCollected).show();
    $(allUncollected).hide();
    $(collectedLe).hide();
  } else if ($(activeTab).hasClass('uncollected')) {
    $(allCollected).hide();
    $(allUncollected).show();
    $(collectedLe).hide();
  } else if ($(activeTab).hasClass('limited_edition')) {
    $(allCollected).hide();
    $(allUncollected).hide();
    $(collectedLe).show();
  } else if ($(activeTab).hasClass('all')) {
    $(allCollected).show();
    $(allUncollected).show();
    $(collectedLe).hide();
  }
}

function showLeItems() {
  let allTypes = $('.hunterProfileItemsView-categoryContent.active');
  let allCollected = $(allTypes)
    .find('.hunterProfileItemsView-categoryContent-item.collected')
    .not('.limited_edition');
  let allUncollected = $(allTypes).find(
    '.hunterProfileItemsView-categoryContent-item.uncollected'
  );
  let collectedLe = $(allTypes).find(
    '.hunterProfileItemsView-categoryContent-item.collected.limited_edition'
  );
  let activeTab = $('.hunterProfileItemsView-filter').filter('.active');
  if ($(activeTab).hasClass('collected')) {
    $(allCollected).show();
    $(allUncollected).hide();
    $(collectedLe).show();
  } else if ($(activeTab).hasClass('uncollected')) {
    $(allCollected).hide();
    $(allUncollected).show();
    $(collectedLe).hide();
  } else if ($(activeTab).hasClass('limited_edition')) {
    $(allCollected).hide();
    $(allUncollected).hide();
    $(collectedLe).show();
  } else if ($(activeTab).hasClass('all')) {
    $(allCollected).show();
    $(allUncollected).show();
    $(collectedLe).show();
  }
}

//Weapons Tab
$(document).on('click', "[data-category='weapon']", function () {
  if (localStorage.getItem('hideLeItems') == 'Y') {
    hideLeItems();
  } else {
    showLeItems();
  }
});
//Bases Tab
$(document).on('click', "[data-category='base']", function () {
  if (localStorage.getItem('hideLeItems') == 'Y') {
    hideLeItems();
  } else {
    showLeItems();
  }
});
//Maps Tab
$(document).on('click', "[data-category='map_piece']", function () {
  if (localStorage.getItem('hideLeItems') == 'Y') {
    hideLeItems();
  } else {
    showLeItems();
  }
});
//Collectible Tab
$(document).on('click', "[data-category='collectible']", function () {
  if (localStorage.getItem('hideLeItems') == 'Y') {
    hideLeItems();
  } else {
    showLeItems();
  }
});
//Skin Tab
$(document).on('click', "[data-category='skin']", function () {
  if (localStorage.getItem('hideLeItems') == 'Y') {
    hideLeItems();
  } else {
    showLeItems();
  }
});
//Collected tab
$(document).on(
  'click',
  '.hunterProfileItemsView-filter.collected',
  function () {
    if (localStorage.getItem('hideLeItems') == 'Y') {
      hideLeItems();
    } else {
      showLeItems();
    }
  }
);
//Uncollected tab
$(document).on(
  'click',
  '.hunterProfileItemsView-filter.uncollected',
  function () {
    if (localStorage.getItem('hideLeItems') == 'Y') {
      hideLeItems();
    } else {
      showLeItems();
    }
  }
);
//Limited Edition Tab
$(document).on(
  'click',
  '.hunterProfileItemsView-filter.limited_edition',
  function () {
    if (localStorage.getItem('hideLeItems') == 'Y') {
      hideLeItems();
    } else {
      showLeItems();
    }
  }
);
//All Tab
$(document).on('click', '.hunterProfileItemsView-filter.all', function () {
  if (localStorage.getItem('hideLeItems') == 'Y') {
    hideLeItems();
  } else {
    showLeItems();
  }
});

/********** Layout Opt-In **********/
$(document).on('change', '#hideLeCb', function () {
  // Check to see if the cb was JUST checked
  if (this.checked) {
    // Put the checked value into storage
    localStorage.setItem('hideLeItems', 'Y');
    this.checked = 'Yes';
    manageCollected();
  } else {
    // Put the checked value into storage
    localStorage.setItem('hideLeItems', 'N');
    this.checked = '';
    showLeItems();
  }
});
