// ==UserScript==
// @name        iRacing no oval
// @namespace   drinkto.me
// @description Userscript for iRacing that hides content that is oval-based.  This is opinionated, so YMMV.
// @include     https://members.iracing.com/jforum/forums/list.page
// @include     https://members.iracing.com/membersite/member/*
// @version     10
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3753/iRacing%20no%20oval.user.js
// @updateURL https://update.greasyfork.org/scripts/3753/iRacing%20no%20oval.meta.js
// ==/UserScript==
var load, execute, loadAndExecute, executeJQuery
;(load = function(a, b, c) {
  var d
  ;(d = document.createElement('script')),
    d.setAttribute('src', a),
    b != null && d.addEventListener('load', b),
    c != null && d.addEventListener('error', c),
    document.body.appendChild(d)
  return d
}),
  (execute = function(a) {
    var b, c
    typeof a == 'function' ? (b = '(' + a + ')();') : (b = a),
      (c = document.createElement('script')),
      (c.textContent = b),
      document.body.appendChild(c)
    return c
  }),
  (loadAndExecute = function(a, b) {
    return load(a, function() {
      return execute(b)
    })
  }),
  (executeJQuery = function(a) {
    if (typeof jQuery == 'undefined') {
      var jqUrl = '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js'
      loadAndExecute(jqUrl, a)
    } else {
      execute(a)
    }
  })

executeJQuery(function() {
  // On membersite, make 'series' link always go to the road filter
  $("td.simpleNav ul li a[href='/membersite/member/Series.do']").attr(
    'href',
    '/membersite/member/Series.do?cat=2',
  )

  // Give some indication that this is not the full list on forum home.
  $('.homeLink').text('Forum List (no oval)')

  //-----------------------------------------------------
  //
  //  Show countdown timer and number registered drivers in title (contributed by @kutu)
  //
  if ('racingpaneldata' in this && racingpaneldata.session) {
    var originalTitle = document.title
    setInterval(function() {
      var numRegistered = $('#racingpanel_session_numregistered')
      var countdownTimer = $('#racingpanel_countdown_timer')
      if (numRegistered.length && countdownTimer.length) {
        document.title = numRegistered.text() + ' ' + countdownTimer.text() + ' ' + originalTitle
      } else {
        document.title = originalTitle
      }
    }, 1000)
  }

  //-----------------------------------------------------
  //
  //  Remove ovals and ineligible series from dropdown menu (contributed by @kutu)
  //
  var seriesDrop = $('#datSeriesSelectorDropdown optgroup')
  if (seriesDrop.length) {
    // remove ovals
    var eligibles = seriesDrop[0].children
    var isOvalSection
    var toRemove = []
    $.each(eligibles, function(index, value) {
      // search for oval section
      if (value.disabled) {
        if (/Oval$/.test(value.text)) isOvalSection = true
        if (/Road$/.test(value.text)) isOvalSection = false
      }

      if (isOvalSection || value.disabled || value.value == 0) {
        // if we currently in oval's section
        // or current option is disabled
        // or current option is "No matching series"
        toRemove.push(value)
      } else {
        // trim spaces
        value.text = value.text.replace(/^\s*/, '')
      }
    })

    // remove not needed options
    $.each(toRemove, function(index, value) {
      value.remove()
    })

    // remove ineligible
    seriesDrop[1].remove()

    // remove root tree and select series
    var dropdown = seriesDrop[0].parentElement
    var selectedValue = dropdown.selectedOptions[0].value
    $('#datSeriesSelectorDropdown').append(eligibles)
    seriesDrop[0].remove()
    $.each(dropdown.children, function(index, value) {
      if (value.value == selectedValue) dropdown.selectedIndex = index
    })
  }

  //-----------------------------------------------------
  //
  //  Filter the hosted sessions by road tracks.
  //      See the filter_tracks.js to generate the array.
  //
  if (window.location.pathname.indexOf('/HostedSessions.do') > 0) {
    setInterval(function() {
      while ($('.hosted_sessions_table_info').length <= 0) {
        sleep(500)
        console.log('Waiting for table to show up...')
      }

      // Change something to indicate this is filtered.
      $("tr th a[name='Track']").text('Track (road only)')

      // Generated output
      var ovalTracks = [
        53, // Atlanta Motor Speedway [Oval]
        225, // Auto Club Speedway [Oval]
        101, // Bristol Motor Speedway []
        143, // Centripetal Circuit []
        40, // Charlotte Motor Speedway - 2016 [Oval]
        123, // Chicagoland Speedway []
        15, // Concord Speedway []
        115, // Darlington Raceway []
        191, // Daytona International Speedway [Oval]
        27, // Daytona International Speedway - 2007 [Oval]
        162, // Dover International Speedway []
        273, // Eldora Speedway []
        20, // Homestead Miami Speedway [Oval]
        169, // Iowa Speedway [Oval]
        214, // Kansas Speedway [Oval]
        188, // Kentucky Speedway [Oval]
        201, // Langley Speedway []
        17, // Lanier National Speedway []
        103, // Las Vegas Motor Speedway [Oval]
        33, // Martinsville Speedway []
        276, // Michigan International Speedway []
        124, // Michigan International Speedway - 2014 []
        131, // New Hampshire Motor Speedway [Oval]
        190, // New Smyrna Speedway []
        12, // Oxford Plains Speedway []
        104, // Phoenix International Raceway - 2008 [Oval]
        277, // Pocono Raceway []
        136, // Pocono Raceway - 2011 [Oval]
        31, // Richmond Raceway []
        203, // Rockingham Speedway [Oval]
        14, // South Boston Speedway []
        116, // Talladega Superspeedway []
        121, // Texas Motor Speedway [Oval]
        94, // The Milwaukee Mile []
        161, // Thompson Speedway Motorsports Park [Oval]
        16, // USA International Speedway []
      ]

      function getURLParameter(url, name) {
        return (
          decodeURIComponent(
            (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [
              ,
              '',
            ])[1].replace(/\+/g, '%20'),
          ) || null
        )
      }

      // Iterate over each td that contains a link to a track, compare to known roadTracks and remove if not listed above.
      // /membersite/member/TrackDetail.do?trkid=107
      $("table tr td div div a[href*='/membersite/member/TrackDetail.do?trkid']").each(function(
        index,
      ) {
        var href = $(this).attr('href')
        var trackID = parseInt(getURLParameter(href, 'trkid'))
        var text = $(this).text()
        var isOval = -1 != $.inArray(trackID, ovalTracks)
        var isUnwantedRow = text == 'Track Info' || text == ''
        //console.log("track["+ trackID + "]: " + isOval + " - " + $(this).text())

        if (isOval && !isUnwantedRow) {
          tr = $(this)
            .parent()
            .parent()
            .parent()
            .parent()
          //console.log(tr);
          console.log('Removing track[' + trackID + ']: ' + isOval + ' - ' + text)
          tr.remove()
        }
      })
    }, 1000)
  }

  //-----------------------------------------------------
  //
  //  Only execute the following if we are on the forum list page
  //
  if (window.location.pathname.indexOf('/list.page') <= 0) return
  else console.log('Skipping forum list pruning.')

  function toggleForumRowByText(forums) {
    $.each(forums, function(index, value) {
      e = $("td:contains('" + value + "')")
      e.parent().toggle()
      console.log('Removed: ' + value)
    })
  }

  function toggleForumRowByPage(forums) {
    $.each(forums, function(index, value) {
      e = $("td a[href*='/" + value + ".page']")
      text = e.text()
      e.parent()
        .parent()
        .toggle()
      console.log('Removed: ' + value + '.page - ' + text)
    })
  }

  /**
   * Remove oval
   */
  var ovalPages = [
    '619',
    '620',
    '635',
    '621',
    '3713',
    '624',
    '2911',
    '629',
    '637',
    '623',
    '631',
    '632',
    '5511',
    '6312',
    '8711',
  ]

  toggleForumRowByPage(ovalPages)
  toggleForumRowByText(['Oval Racing'])

  // toggle back on dirt oval
  // toggleForumRowByText(['Dirt Oval Racing'])

  /**
   * Remove oval
   */
  var dirtOvalPages = [
    '13915',
    '14511',
    '13916',
    '14512',
    '13917',
    '13918',
    '13912',
    '15511',
    '13713',
    '13913',
    '13911',
    '13914',
    '15311',
  ]

  toggleForumRowByPage(dirtOvalPages)

  /******************************************************
   * OPINIONATED removal below here, just oval is above
   */

  /**
   * Remove club
   */
  // club general discussion
  $("td:contains('Club Discussion Area')")
    .parent()
    .next()
    .remove()
  var clubHeaders = ['Club Discussion Area', 'Club News', 'Club Stats', 'Setup Garage']
  toggleForumRowByText(clubHeaders)

  /**
   * Racing and championships (selected ones only)
   */
  var racingAndChampionshipsPages = [
    '644', // world champ
    '645', // pro
    '647', // licenses, ratings and scoring
    '648', // racing your latest race
    '649', // video and screenshot showcase
    '643', // world cup of iracing
    '9711', // iracers with physical challenges
    '3511', // new tire model discussion
    '605', // staff announcements (just maintenance)
    '646', // world tour and special events
    '12311', // job openings
    '9111', // pinned announcements
    '10512', // iracing.com world chanmpionship grand prix
    '8311', // other gaming
    '16314', // rallycross
    '8111', // road warrior
    '10513', // VRS
    '15111', // WCS
    '16313', // world of outlaws
    '16912', // nascar ignite
  ]

  toggleForumRowByPage(racingAndChampionshipsPages)

  /**
   * Club and Regional
   */
  var regionalHeaders = ['Regional Competitions Discussion']
  var regionalPages = ['4111']

  toggleForumRowByText(regionalHeaders)
  toggleForumRowByPage(regionalPages)

  /**
   * Paint
   */
  //    var paintHeaders = ["The Paint Booth"];
  //    var paintPages = ["639", "640"];
  //    toggleForumRowByText(paintHeaders);
  //    toggleForumRowByPage(paintPages);

  /**
   * Technical and Help
   */
  var techPages = [
    '618', // tech - other
    '617', // camera files
    '6912', // linux
    '6911', // osx
  ]
  toggleForumRowByPage(techPages)
})
