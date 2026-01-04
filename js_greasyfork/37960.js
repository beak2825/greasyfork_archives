// ==UserScript==
// @name         Talibri Tick Wrangler
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Smooth out tick rate to ~5sec
// @author       Gnomez
// @match        *://*.talibri.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37960/Talibri%20Tick%20Wrangler.user.js
// @updateURL https://update.greasyfork.org/scripts/37960/Talibri%20Tick%20Wrangler.meta.js
// ==/UserScript==

window.tickWrangler = {
  stats: [],
  nuclearThreshold: 15000,
  timeoutThreshold: 3000
};

(function() {
  'use strict';
  
  var myIsActive = false;

  var mySkillInterval;
  var mySkillPeriod = 5000;

  var mySkill;
  var myMilestone;
  var myRecipe;
  var myLocation;

  var myPreviousPing = 10000;
  var myPreviousRequestTime = 0;
  
  var myRetry = false;
  var myConsecutiveRetries = 0;
  var myRetryTimer;
  var myFailTimer;

  var myNuclearTimer;

  var mySkillTimerResetInterval;

  var myTheThing;

  var myNumRequests;
  var myNumRetries;
  var myNumRedText;
  var myTotalPing;
  var myStartTime;
  
  window.whatsMyTickrate = function() {
    var ticks = 0;
    var time = 0;
    var requests = 0;
    var ping = 0;
    tickWrangler.stats.forEach(function(session) {
      ticks += session.requests - session.redText;
      time += session.time;
      requests += session.requests;
      ping += session.totalPing;
    });
    if (myNumRequests !== undefined) {
      ticks += myNumRequests - myNumRedText;
      time += Date.now() - myStartTime;
      requests += myNumRequests;
      ping += myTotalPing;
    }
    
    var tickrate = time / ticks / 1000;
    var avgPing = ping / requests / 1000;
    return time === 0 ? "Hard to say..." : `${tickrate} seconds per tick; ${avgPing} average response time`;
  };
  
  function onRequestDone(data) {
    if (!myIsActive) return;
    
    myNumRequests++;
    
    if (data.includes('Something went wrong please refresh the page and try again.') || // premature crafting
        data.includes('You tried to use the skill too quickly after your last tick! Please wait a few seconds and try again.') || // premature component
        data.length < 300)  // HACK the response for premature gathering is uniquely this short
    {
      myRetry = true;
      myNumRedText++;
    }
    
    var newPing = Date.now() - myPreviousRequestTime;
    if (myRetry) {
      myRetry = false;
      myConsecutiveRetries++;
      clearInterval(mySkillInterval);
      let retryDelayMod = myConsecutiveRetries > 3 ? 100 * myConsecutiveRetries : 0;
      myRetryTimer = setTimeout(retry, myPreviousPing - newPing > newPing ? myPreviousPing - newPing - newPing + retryDelayMod : retryDelayMod);
      myNumRetries++;
    }
    else {
      myConsecutiveRetries = 0;
    }
    myPreviousPing = newPing;
    myTotalPing += newPing;
  }

  function onRequestFail(xhr, textStatus, e) {
    if (!myIsActive || textStatus === "abort") return;
    
    myNumRequests++;
    
    stopSkill();
    bootTheThing();
    myFailTimer = setTimeout(startTheThing, mySkillPeriod - tickWrangler.timeoutThreshold);
    myNumRedText++;
  }

  function onNuclearTimer() {
    if (!myIsActive) return;
    
    stopSkill();
    bootTheThing();
    startTheThing();
    console.log('BA-BOOM!!!');
  }
  
  function retry() {
    if (!myIsActive) return;
    
    doTheThing();
    mySkillInterval = setInterval(doTheThing, mySkillPeriod);
  }

  function startTheThing() {
    if (!myIsActive) return;
    
    doTheThing();
    mySkillInterval = setInterval(doTheThing, mySkillPeriod);
  }
  
  function doTheThing() {
    if (!myTheThing) return;
    
    clearTimeout(myNuclearTimer);
    myNuclearTimer = setTimeout(onNuclearTimer, tickWrangler.nuclearThreshold);
    clearTimeout(myRetryTimer);
    clearTimeout(myFailTimer);
    
    myPreviousRequestTime = Date.now();
    window.requestStart = myPreviousRequestTime + 10000; // avoid native latency compensation
    myTheThing();
  }

  function doSkill() {
    $.post({
      url: '/skills/' + mySkill + '/start_gathering.js',
      data: {
        skill_id: mySkill,
        milestone_item_id: myMilestone,
        location_id: myLocation
      },
      timeout: tickWrangler.timeoutThreshold
    }).done(onRequestDone).fail(onRequestFail);
  }

  function doCraft() {
    $('.micro-active__progress').width('100%');
    window.ingredient_arr = [];
    window.ingredient_groups_array = [];
    window.ingredient_groups_selection_array = [];
    for (var o in ingredients) {
      if ('group' == window.ingredients[o].ingredient_type) {
        window.ingredient_groups_array.push(o);
        window.ingredient_groups_selection_array.push(window.ingredients[o].ingredient_id);
      }
      else if ('item' == window.ingredients[o].ingredient_type) {
         window.ingredient_arr.push(window.ingredients[o].ingredient_id);
      }
    }
    
    $.post({
      url: '/craft',
      data: {
        recipe_id: myRecipe,
        ingredients: window.ingredient_arr,
        ingredient_groups: window.ingredient_groups_array,
        ingredient_group_selections: window.ingredient_groups_selection_array,
        quantity: 'c',
        crafts_remaining: 0,
        crafting_spot_id: myLocation
      },
      timeout: tickWrangler.timeoutThreshold
    }).done(onRequestDone).fail(onRequestFail);
  }

  function doComponent() {
    $('.micro-active__progress').width('100%');
    window.ingredient_arr = [];
    window.ingredient_groups_array = [];
    window.ingredient_groups_selection_array = [];
    for (var o in window.ingredients) {
      window.ingredient_groups_array.push(o);
      window.ingredient_groups_selection_array.push(o + '-' + window.ingredients[o].ingredient_id);
    }
    
    $.post({
      url: '/crafting/' + myLocation + '/component',
      data: {
        recipe_id: myRecipe,
        ingredients: window.ingredient_arr,
        ingredient_groups: window.ingredient_groups_array,
        ingredient_group_selections: window.ingredient_groups_selection_array,
        quantity: 'c',
        crafts_remaining: 0,
        crafting_spot_id: myLocation
      },
      timeout: tickWrangler.timeoutThreshold
    }).done(onRequestDone).fail(onRequestFail);
  }

  function bootTheThing() {
    clearInterval(mySkillInterval);
    clearTimeout(myNuclearTimer);
    clearTimeout(myRetryTimer);
    clearTimeout(myFailTimer);
    
    myRetry = false;
    myConsecutiveRetries = 0;
    myPreviousPing = 10000;
    
    myNumRequests = 0;
    myNumRetries = 0;
    myNumRedText = 0;
    myTotalPing = 0;
    myStartTime = Date.now();
    
    clearInterval(mySkillTimerResetInterval);
    mySkillTimerResetInterval = setInterval(function() {
      clearTimeout(window.skill_timer);
    }, 1000);
    
    myIsActive = true;
  }

  function bootSkill(skillId, milestoneId, locationId) {
    bootTheThing();
    
    mySkill = skillId;
    myMilestone = milestoneId;
    myLocation = locationId;
    
    mySkillPeriod = 5000;
    
    myTheThing = doSkill;

    startTheThing();
  }

  function bootCraft(recipe, location) {
    bootTheThing();
    
    myRecipe = recipe;
    myLocation = location;
    
    mySkillPeriod = 5000;
    
    myTheThing = doCraft;
    
    startTheThing();
  }

  function bootComponent(recipe, location) {
    bootTheThing();
    
    myRecipe = recipe;
    myLocation = location;
    
    mySkillPeriod = 5000;
    
    myTheThing = doComponent;
    
    startTheThing();
  }

  startSkill = function(e, t, n) {
    window.milestone_item_id = $(e).parents('div.mastery').find('[name="milestone_item_id"]').val();
    bootSkill(t, window.milestone_item_id, n);
    $('li.active-skill-dropdown').addClass('first-start');
  };

  start_crafting = function(recipe, quantity, craftingSpot) {
    window.crafts_remaining = 0;
    bootCraft(recipe, craftingSpot);
    $('li.active-skill-dropdown').addClass('first-start');
  };

  start_component_crafting = function(recipe, quantity, craftingSpot) {
    window.crafts_remaining = 0;
    bootComponent(recipe, craftingSpot);
    $('li.active-skill-dropdown').addClass('first-start');
  };

  function stopTheThing() {
    myIsActive = false;
    
    clearInterval(mySkillInterval);
    clearTimeout(myNuclearTimer);
    clearTimeout(myRetryTimer);
    clearTimeout(myFailTimer);
    
    myRetry = false;
    myConsecutiveRetries = 0;
    
    clearInterval(mySkillTimerResetInterval);
    
    tickWrangler.stats.push({
      time: Date.now() - myStartTime,
      requests: myNumRequests,
      retries: myNumRetries,
      redText: myNumRedText,
      totalPing: myTotalPing
    });
  }
  stopSkill = function() {
    stopTheThing();
    
    clearTimeout(window.skill_timer);
    clearInterval(window.print_interval);
    window.skill_timer = null;
    $('div#skill_details').empty();
    $('.micro-active__progress').width('0%');
    $('.micro-active__skill').text('None');
    window.active_skill = 'None';
    $('a#active_skill_dropdown').parent('li.dropdown').removeClass('bg-success bg-info').removeClass('bg-danger');
  };

})();