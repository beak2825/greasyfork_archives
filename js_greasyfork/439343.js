// ==UserScript==
// @name         MH Region Quick Travel
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.6.9
// @description  Adds a travel toolbar to the HUD to make traveling between areas in the same region quicker and easier
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
//
// @downloadURL https://update.greasyfork.org/scripts/439343/MH%20Region%20Quick%20Travel.user.js
// @updateURL https://update.greasyfork.org/scripts/439343/MH%20Region%20Quick%20Travel.meta.js
// ==/UserScript==
$(document).ready(function () {
  const debug = localStorage.getItem('ws.debug');
  if (debug == true) {
    console.log('Region Quick Travel Started');
  }
  loadFunction();
});

$(document).ajaxComplete(function (event, xhr, options) {
  //console.log(options.url);
  let properties = JSON.parse(localStorage.getItem('ws.mh.travel.props'));
  if (
    options.url ==
    'https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php'
  ) {
    properties.previousLocation = properties.currentLocation;
    localStorage.setItem('ws.mh.travel.props', JSON.stringify(properties));
    loadFunction();
  }
});

function loadFunction() {
  getData();
  setTimeout(buildTravelBar, 700);
}

function getData() {
  const debug = localStorage.getItem('ws.debug');
  let properties = JSON.parse(localStorage.getItem('ws.mh.travel.props'));
  if (properties) {
  } else {
    properties = {};
  }
  const userID = user.sn_user_id;
  const dataItemOfInterest = ['region_name', 'not_a_real_field'];
  hg.utils.User.getUserData([userID], dataItemOfInterest, function (data) {
    properties.currentRegion = data[0].region_name;
    properties.currentLocation = user.environment_type;
    localStorage.setItem('ws.mh.travel.props', JSON.stringify(properties));
    if (debug == true) {
      console.log('props', properties);
    }
  });
}

function buildTravelBar() {
  if ($('.travelBarContainer').length > 0) {
    $('.travelBarContainer').remove();
  }
  const mousehuntHud = $('#hudLocationContent');
  const travelBarContainer = document.createElement('div');
  travelBarContainer.classList.add('travelBarContainer');
  $(travelBarContainer).css({
    float: 'left',
    'text-align': 'left',
    width: '97%',
    height: '25px',
    margin: '5px',
    padding: '2px',
    background:
      'linear-gradient(90deg, rgba(215,215,215,1) 2%, rgba(213,213,215,1) 71%, rgba(228,228,228,1) 100%)',
    border: '2px solid black',
  });
  mousehuntHud.after(travelBarContainer);
  let properties = JSON.parse(localStorage.getItem('ws.mh.travel.props'));
  const regionAreas = getRegionLocations(
    properties.currentRegion,
    properties.previousLocation
  );
  //console.log(regionAreas)
  regionAreas.forEach(function (array) {
    let thisTag = Object.keys(array)[0];
    let thisName = array[thisTag];
    if (thisTag == properties.currentLocation) {
    } else {
      const thisButton = document.createElement('button');
      thisButton.id = 'regionTravelButton';
      $(thisButton).attr('destination', thisTag);
      $(thisButton).addClass('mousehuntActionButton small');
      const title = 'Travel to ' + thisName;
      $(thisButton).attr('title', title);
      const travelText = document.createElement('span');
      $(travelText).addClass('travelText').text(thisName).css({
        'font-size': '10px',
      });
      $(thisButton).css({
        padding: '2px',
        marginRight: '4px',
        width: '12.5%',
      });
      $(thisButton).append(travelText);
      travelBarContainer.append(thisButton);
    }
  });
  if (properties.previousLocation) {
    const returnButton = document.createElement('button');
    returnButton.id = 'returnButton';
    if (properties.previousLocation) {
      $(returnButton).attr('destination', properties.previousLocation);
    }
    $(returnButton).addClass('mousehuntActionButton small');
    const title =
      'Return to previous location: ' +
      getLocationNames(properties.previousLocation);
    $(returnButton).attr('title', title);
    const returnText = document.createElement('span');

    $(returnText).addClass('travelText').text('Go Back').css({
      'font-size': '10px',
    });
    $(returnButton).css({
      marginLeft: '10px',
      marginRight: '2px',
      padding: '2px',
      float: 'right',
    });
    $(returnButton).append(returnText);
    travelBarContainer.append(returnButton);
  }
}

$(document).on('click', '#regionTravelButton, #returnButton', function () {
  const debug = localStorage.getItem('ws.debug');
  let properties = JSON.parse(localStorage.getItem('ws.mh.travel.props'));
  properties.previousLocation = user.environment_type;
  localStorage.setItem('ws.mh.travel.props', JSON.stringify(properties));
  if (debug == true) {
    console.log(properties);
  }
  app.pages.TravelPage.travel($(this).attr('destination'));
});

function getRegionLocations(currentRegion) {
  let regionAreas = [];
  let tags = [];
  if (currentRegion == 'Gnawnia') {
    tags = ['meadow', 'town_of_gnawnia', 'windmill', 'harbour', 'mountain'];
  } else if (currentRegion == 'Valour') {
    tags = ['kings_arms', 'tournament_hall', 'kings_gauntlet'];
  } else if (currentRegion == 'Whisker Woods') {
    tags = ['calm_clearing', 'great_gnarled_tree', 'lagoon'];
  } else if (currentRegion == 'Burroughs') {
    tags = [
      'laboratory',
      'mousoleum',
      'town_of_digby',
      'bazaar',
      'pollution_outbreak',
      'halloween_event_location',
    ];
  } else if (currentRegion == 'Furoma') {
    tags = ['training_grounds', 'dojo', 'meditation_room', 'pinnacle_chamber'];
  } else if (currentRegion == 'Bristle Woods') {
    tags = ['catacombs', 'forbidden_grove'];
  } else if (currentRegion == 'Tribal Isles') {
    tags = [
      'cape_clawed',
      'elub_shore',
      'nerg_plains',
      'derr_dunes',
      'jungle_of_dread',
      'dracano',
      'balacks_cove',
    ];
  } else if (currentRegion == 'Varmint Valley') {
    tags = ['claw_shot_city', 'train_station', 'fort_rox'];
  } else if (currentRegion == 'Queso Canyon') {
    tags = ['queso_river', 'queso_plains', 'queso_quarry', 'queso_geyser'];
  } else if (currentRegion == 'Rodentia') {
    tags = [
      'ss_huntington_ii',
      'seasonal_garden',
      'zugzwang_tower',
      'zugzwang_library',
      'slushy_shoreline',
      'iceberg',
      'sunken_city',
    ];
  } else if (currentRegion == 'Sandtail Desert') {
    tags = [
      'desert_warpath',
      'desert_city',
      'desert_oasis',
      'lost_city',
      'sand_dunes',
    ];
  } else if (currentRegion == 'Hollow Heights') {
    tags = [
      'fungal_cavern',
      'labyrinth',
      'ancient_city',
      'moussu_picchu',
      'floating_islands',
    ];
  } else if (currentRegion == 'Folklore Forest') {
    tags = [
      'foreword_farm',
      'prologue_pond',
      'table_of_contents',
      'bountiful_beanstalk',
      'school_of_sorcery',
      'draconic_depths',
      'afterword_acres',
      'epilogue_falls',
    ];
  } else if (currentRegion == 'Rift Plane') {
    tags = [
      'rift_gnawnia',
      'rift_burroughs',
      'rift_whisker_woods',
      'rift_furoma',
      'rift_bristle_woods',
      'rift_valour',
    ];
  } else if (currentRegion == 'Great Winter Taiga') {
    tags = [
      'winter_hunt_grove',
      'winter_hunt_workshop',
      'winter_hunt_fortress',
    ];
  }
  tags.forEach(function (loc) {
    const thisLocation = {};
    thisLocation[loc] = getLocationNames(loc);
    regionAreas.push(thisLocation);
  });
  return regionAreas;
}

function getLocationNames(tag) {
  const locNames = {
    meadow: 'Meadow',
    town_of_gnawnia: 'Town of Gnawnia',
    windmill: 'Windmill',
    harbour: 'Harbour',
    mountain: 'Mountain',
    kings_arms: "King's Arms",
    tournament_hall: 'Tournament Hall',
    kings_gauntlet: "King's Gauntlet",
    calm_clearing: 'Calm Clearing',
    great_gnarled_tree: 'Great Gnarled Tree',
    lagoon: 'Lagoon',
    laboratory: 'Laboratory',
    mousoleum: 'Mousoleum',
    town_of_digby: 'Town of Digby',
    bazaar: 'Bazaar',
    pollution_outbreak: 'Toxic Spill',
    training_grounds: 'Training Grounds',
    dojo: 'Dojo',
    meditation_room: 'Meditation Room',
    pinnacle_chamber: 'Pinnacle Chamber',
    catacombs: 'Catacombs',
    forbidden_grove: 'Forbidden Grove',
    cape_clawed: 'Cape Clawed',
    elub_shore: 'Elub Shore',
    nerg_plains: 'Nerg Plains',
    derr_dunes: 'Derr Dunes',
    jungle_of_dread: 'Jungle of Dread',
    dracano: 'Dracano',
    balacks_cove: "Balack's Cove",
    claw_shot_city: 'Claw Shot City',
    train_station: 'Gnawnian Express Station',
    fort_rox: 'Fort Rox',
    queso_river: 'Queso River',
    queso_plains: 'Prickly Plains',
    queso_quarry: 'Cantera Quarry',
    queso_geyser: 'Queso Geyser',
    ss_huntington_ii: 'SSH IV',
    seasonal_garden: 'Seasonal Garden',
    zugzwang_tower: "Zugzwang's Tower",
    zugzwang_library: 'Crystal Library',
    slushy_shoreline: 'Slushy Shoreline',
    iceberg: 'Iceberg',
    sunken_city: 'Sunken City',
    desert_warpath: 'Fiery Warpath',
    desert_city: 'Muridae Market',
    desert_oasis: 'Living Garden',
    lost_city: 'Lost City',
    sand_dunes: 'Sand Dunes',
    fungal_cavern: 'Fungal Cavern',
    labyrinth: 'Labyrinth',
    ancient_city: 'Zokor',
    moussu_picchu: 'Moussu Picchu',
    floating_islands: 'Floating Islands',
    foreword_farm: 'Foreword Farm',
    prologue_pond: 'Prologue Pond',
    table_of_contents: 'Table of Contents',
    bountiful_beanstalk: 'Bountiful Beanstalk',
    school_of_sorcery: 'School of Sorcery',
    draconic_depths: 'Draconic Depths',
    afterword_acres: 'Afterword Acres',
    epilogue_falls: 'Epilogue Falls',
    rift_gnawnia: 'Gnawnia Rift',
    rift_burroughs: 'Burroughs Rift',
    rift_whisker_woods: 'Whisker Woods Rift',
    rift_furoma: 'Furoma Rift',
    rift_bristle_woods: 'Bristle Woods Rift',
    rift_valour: 'Valour Rift',
    winter_hunt_grove: 'Cinnamon Hill',
    winter_hunt_workshop: 'Golem Workshop',
    winter_hunt_fortress: 'Ice Fortress',
    halloween_event_location: 'Gloomy Greenwood',
  };
  return locNames[tag];
}
