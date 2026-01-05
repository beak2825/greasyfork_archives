// ==UserScript==
// @name        MyMunzeeBadges
// @namespace   MyMunzeebadges
// @include     /^https?://www\.munzee\.com/m/.*/badges/$/
// @version     1.0.6
// @grant       none
// @description Profile Badge Layout
// @downloadURL https://update.greasyfork.org/scripts/11664/MyMunzeeBadges.user.js
// @updateURL https://update.greasyfork.org/scripts/11664/MyMunzeeBadges.meta.js
// ==/UserScript==
// 1.0 Launch
jQuery(document).ready(function ($) {
  function handleBatches() {
    var badges = {
      achievements: {
        description: 'Achievement badges',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Perfect 10',
              'Over The Hill',
              'Centurion',
              '1k Day',
              '5k Day',
              '10k Day',
              '25k Day',
              '#1',
              'Top 10',
              'Top 50',
              'Top 100',
              'Winner',
              'First Loser',
              'Lucky',
              'Unlucky',
              'Rover Walker',
              'Rover Mover',
              'Rover Transporter',
              'Easy as Pi',
              'Air Munzee',
            ]
          }
        ]
      },
      captures: {
        description: 'Capture badges',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Seeker',
              'Capture Streak',
              'Capture Super Streak',
              'First Responder',
              'Sampler',
              'ROY G BIV',
              'It\\\'s a Blast!',
              'Dirty Dozen',
              'Hunter',
              'Collector',
              'Hoarder',
              'Curator',
              'Historian',
              '5 by 5',
              'Breakfast',
              'Wifi',
              'Pool',
              'Hotel Bellhop',
              'Hotel Valet',
              'Hotel Concierge'
            ]
          }
        ]
      },
      deploys: {
        description: 'Deploy badges',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Hider',
              'Deploy Streak',
              'Deploy Super Streak',
              'Super Streak',
              'Super Duper ULTRA Streak',
              '5 by 5 deployed',
              '100 Green',
              'Virtual High 5',
              'Watson',
              'Holmes',
              'VardemInn',
              'Foster\\\'s Palace',
              'Founders\\\' Towers',
              'Overview Hotel',
              'Hilly Hotel',
              'Fates Hotel',
              'Family Jewels'
            ]
          }
        ]
      },
      battle: {
        description: 'Battle badges',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Clan Gold',
              'Clan Silver',
              'Clan Bronze',
              'Battle Ready',
              'Warrior',
              'Combat Chuck',
              'SuperChuck'
            ]
          }
        ]
      },
      socials: {
        description: 'Social badges',
        attr: 'data-title',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Social Caterpillar',
              'Social Cocoon',
              'Social Butterfly',
              'Social Princess',
              'Social Queen',
              'Social Tadpole',
              'Social Froglet',
              'Social Frog',
              'Social Prince'
            ]
          }
        ]
      },
      munzee: {
        description: 'Munzee special badges',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Early Bird',
              'Pioneer',
              'Meet the Makers',
              'Reseller',
              'Munzee HQ',
              'MHQ Badge',
              'Grand Opening',
              'Munzee Marketplace',
              'Behind the Wall',
              'Beer Mug 2014',
              'Player Of The Week',
              'Munzee Garden',
              'Meet Matt',
              'The 3rd',
              'Ms. Wheelchair Texas USA 2015',
              'Monthly Video Contest Participant',
              'Monthly Video Contest Winner',
            ]
          }
        ]
      },
      holiday: {
        description: 'Holiday badges',
        searches: [
          {
            attr: 'data-title',
            search: '^=',
            titles: [
              'Christmas ',
              'Oktoberfest',
              'Munzlympics 2014',
              'Copa Do Munzo',
              'Birthday Barker',
              'Munzee turns 3',
              'Fiesta Third',
              'ALS Ice Bucket Challenge',
              'Munzee Munch',
              'Guy Fawkes Day 2014',
              'Eventzee',
              'Come and Take It!',
              'May Flowers',
            ]
          }
        ]
      },
      charity: {
        description: 'Charity badges',
        searches: [
          {
            attr: 'data-title',
            search: '^=',
            titles: [
              'Munzvember ',
              'RMH ',
              'Heart To Heart',
            ]
          }
        ]
      },
      event: {
        description: 'Event badges',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Event Host',
              'Double Fun Host',
              '4th Birthday Host',
              'CoExist',
              'Twice The Fun',
              'MM3',
              'Worlds Collide',
              'MWMB 2014',
              'MHQ Bash 2014',
              'Worlds Collide MHQ',
              'Space Coast',
              '4th Birthday Event',
              '4th Birthday Playdate',
              'Matt Tour',
              'Rob Tour',
              'London Robbed',
              'Merry Munzmas 2014',
              'Rob\\\'s Return',
              'Rob Elk'
            ]
          },
          {
            attr: 'data-content',
            search: '*=',
            titles: [
              'Thanks for having fun in Cologne! Hope you tried some Kölsch!',
              'Thanks for participating, hope you have fun'
            ]
          }
        ]
      },
      eventzeeapp: {
        description: 'Eventzee badges',
        attr: 'data-title',
        searches: [
          {
            attr: 'data-title',
            search: '=',
            titles: [
              'Pin Hole Camera',
              'Instant Camera',
              'Point and Shoot Camera',
              'The Lucky Penny',
              'The Silver Bullets',
              'The Midas Touch',
              'Pliny\\\'s Fool\\\'s Gold',
              'Grizzly Adams\\\' Gold Rush',
              'Blackbeard\\\'s Booty',
              'Fun Flamingo',
              'Social Serpents',
              'Gala Giraffe',
              'Warhol\\\'s Wunderbar',
              'Da Vinci\\\'s Design',
              'Van Gogh\\\'s Vision',
              'Men in Blue',
              'Happy Birthday Munzee, from Eventzee!',
            ]
          }
        ]
      }
                       };
    $('#badges-listing').prepend('<div class="page-header" id="badges-listing-all"><h2><small>Other badges</small></h2></div>');
    $.each(badges, function (key, data) {
      var category = '<div class="page-header" style="padding-bottom: 5px; margin: 10px 0px 0px" id="badges-listing-' + key + '">' +
      '<h2 style="margin: 0px 0px 0px;"><small>' + data['description'] + '</small></h2></div>';
      for (var h = data['searches'].length - 1; h >= 0; h--) {
        var search = data['searches'][h];
        for (var i = search['titles'].length - 1; i >= 0; i--) {
          var badge = $('li.badge-helper[' + search['attr'] + search['search'] + '\'' + search['titles'][i] + '\']');
          if ($(badge).length != 0) {
            if (category != '') {
              $('#badges-listing-all').before(category);
              category = '';
            }
            $('#badges-listing-' + key).after(badge);
          }
        }
      }
    });
  }
  if (window.location.href.substring(window.location.href.length - 8) == '/badges/') {
    handleBatches()
  }
});
