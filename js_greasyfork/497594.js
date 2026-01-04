// ==UserScript==
// @name         Tekstredactie Home
// @namespace    https://www.socialdeal.nl/
// @version      1.5
// @description  Stable version
// @author       Me
// @match        https://*.socialdeal.nl/bureaublad/letterkundige.php*
// @match        https://*.socialdeal.be/bureaublad/letterkundige.php*
// @match        https://*.socialdeal.de/bureaublad/letterkundige.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=socialdeal.nl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497594/Tekstredactie%20Home.user.js
// @updateURL https://update.greasyfork.org/scripts/497594/Tekstredactie%20Home.meta.js
// ==/UserScript==

(function() {
  'use strict';

  //START TIMER TO MEASURE CODE DURATION
  console.time("Timer 1");

  //NEW HTML ELEMENTS
  const HTMLfilterCheckboxes = '<p style="color: white; padding: 3px">Filter:<label style="display: inline-block; padding: 3px" for="fltrAfgekeurd"><input style="vertical-align: middle" class="fltrCheckbox" id="fltrAfgekeurd" type="checkbox" value="fltrAfgekeurd">niet afgekeurd</label><label style="display: inline-block; padding: 3px" for="fltrCheckdeal"><input style="vertical-align: middle" class="fltrCheckbox" id="fltrCheckdeal" type="checkbox" value="fltrCheckdeal">niet in keurlijst</label></p>';
  const HTMLpillAfgekeurdRedactiePartOne = '<div class="pill-afgekeurd pill-afgekeurd-redactie" data-dealid=';
  const HTMLpillAfgekeurdRedactiePartTwo = ' style="display: inline-block; position: relative;"><div class="afgekeurd-popup afgekeurd-popup-redactie" style="display: none; position: absolute; justify-content: center; width: 280px; padding: 8px; bottom: 20px; left: 50%; z-index: 10; background-color: #FF798A; border: 1px solid #666666; word-break: break-word; border-radius: 15px; box-shadow: -2px 2px 8px rgba(0,0,0,0.5); max-height: 400px; overflow-y: auto;"></div><span class="pill-afgekeurd-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #FAF9F6; background: #e0453a; cursor: pointer;">Redactie</span></div>';
  const HTMLpillAfgekeurdSSPartOne = '<div class="pill-afgekeurd pill-afgekeurd-ss" data-dealid=';
  const HTMLpillAfgekeurdSSPartTwo = ' style="display: inline-block; position: relative"><div class="afgekeurd-popup afgekeurd-popup-ss" style="display: none; position: absolute; justify-content: center; width: 280px; padding: 8px; bottom: 20px; left: 50%; z-index: 10; background-color: #FF798A; border: 1px solid #666666; word-break: break-word; border-radius: 15px; box-shadow: -2px 2px 8px rgba(0,0,0,0.5); max-height: 400px; overflow-y: auto;"></div><span class="pill-afgekeurd-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #FAF9F6; background: #e0453a; cursor: pointer;">Sales Support</span></div>';
  const HTMLpillAfgekeurdRedactieSSPartOne = '<div class="pill-afgekeurd pill-afgekeurd-redactie" data-dealid=';
  const HTMLpillAfgekeurdRedactieSSPartTwo = ' style="display: inline-block; position: relative"><div class="afgekeurd-popup afgekeurd-popup-redactie" style="display: none; position: absolute; justify-content: center; width: 280px; padding: 8px; bottom: 20px; left: 50%; z-index: 10; background-color: #FF798A; border: 1px solid #666666; word-break: break-word; border-radius: 15px; box-shadow: -2px 2px 8px rgba(0,0,0,0.5); max-height: 400px; overflow-y: auto;"></div><span class="pill-afgekeurd-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #FAF9F6; background: #e0453a; cursor: pointer;">Redactie</span></div><div class="pill-afgekeurd pill-afgekeurd-ss" data-dealid=';
  const HTMLpillAfgekeurdRedactieSSPartThree = ' style="display: inline-block; position: relative"><div class="afgekeurd-popup afgekeurd-popup-ss" style="display: none; position: absolute; justify-content: center; width: 280px; padding: 8px; bottom: 20px; left: 50%; z-index: 10; background-color: #FF798A; border: 1px solid #666666; word-break: break-word; border-radius: 15px; box-shadow: -2px 2px 8px rgba(0,0,0,0.5); max-height: 400px; overflow-y: auto;"></div><span class="pill-afgekeurd-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; margin: 3px 3px 0 0; padding: 2px 12px 2px 12px; text-overflow: ellipsis; color: #FAF9F6; background: #e0453a; cursor: pointer;">Sales Support</span></div>';
  const HTMLvlagTableHeader = '<td width="200" align="center" bgcolor="#BDD7EE"><font face="Arial" size="2">Vlaggen</font></td>';
  const HTMLvlagTableContainer = '<td width="100" bgcolor="#BDD7EE" valign="top" id="vlagTableOuter"></td>';
  const HTMLtoggleButtonToDo = '<div class="toggler" style="display: none; background-color: rgb(189, 215, 238); color: white; width: 100%; text-align: center; cursor: pointer;"><tr style="display: block; margin: -6px 6px -6px -6px"><td style="display: block;"><span style="display: inline-block; transition-property: transform; transition-duration: 0.5s;">&#9660;</span></td></tr></div>';
  const HTMLloadSpinner = '<div class="loader" style="border: 6px solid #f3f3f3; border-radius: 50%; border-top: 6px solid #666666; width: 30px; height: 30px; margin: 20px 0px; animation: spin 700ms linear infinite;"></div>';
  const HTMLloadButtonCross = '<span class="close-button" style="position: absolute; right: 8px; top: -2px; font-size: 30px; color: #696969; opacity: 0.5; cursor: pointer;">×</span>';
  const HTMLpillasaphigh = '<span class="pill-asaphigh-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #FAF9F6; background: #3d85c6; cursor: default;">ASAP (high)</span>';
  const HTMLpillasapmed = '<span class="pill-asapmed-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #5B5B5B; background: #fff700; cursor: default;">ASAP (med)</span>';
  const HTMLpillasaplow = '<span class="pill-asaplow-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #FAF9F6; background: #ff8200; cursor: default;">ASAP (low)</span>';
  const HTMLpillhotelhigh = '<span class="pill-hotelhigh-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #FAF9F6; background: #3d85c6; cursor: default;">Hotel (high)</span>';
  const HTMLpillhotelmed = '<span class="pill-hotelmed-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #5B5B5B; background: #fff700; cursor: default;">Hotel (med)</span>';
  const HTMLpillhotellow = '<span class="pill-hotellow-span" style="align-items: center; font-family: Arial, Helvetica, sans-serif; font-size: 11px; display: inline-block; height: 100%; white-space: nowrap; width: auto; position: relative; border-radius: 100px; line-height: 1; overflow: hidden; padding: 2px 12px 2px 12px; margin: 3px 3px 0 0; text-overflow: ellipsis; color: #FAF9F6; background: #ff8200; cursor: default;">Hotel (low)</span>';


  //CLEAN TABLES
  var $emtpyTable = $('#content > div > table[border="0"][width="100%"][cellspacing="0"][cellpadding="10"]:eq(0)');
  var $dealtable = $('#content > div > table[border="1"][width="100%"][cellpadding="5"][style="border-collapse: collapse"][bordercolor="#666666"]:eq(1)');
  var $dealtableEmptyTH = $dealtable.find('tbody > tr:first td:nth-child(1)');
  var $THredactie = $dealtable.find('tbody > tr:first td:nth-child(2)');
  var $THtodo = $dealtable.find('tbody > tr:nth-child(2) > td:eq(0)');
  var $todoTable = $dealtable.find('tbody > tr:nth-child(3) > td:eq(0)');
  var $todoTableInner = $dealtable.find('tbody > tr:nth-child(3) > td:first > table');
  var $THlogistiekCommercieel = $dealtable.find('tbody > tr:first td:nth-child(3), tbody > tr:first td:nth-child(4)');
  var $THOndernemer = $dealtable.find('tbody > tr:first td:nth-child(5)');
  var $THondernemerGoedgekeurd = $dealtable.find('tbody > tr:nth-child(2) > td:nth-child(13)');
  var $tableOndernemerGoedgekeurd = $dealtable.find('tbody > tr:nth-child(3) > td:nth-child(13)');
  var $THhidden = $dealtable.find('tbody > tr:nth-child(2) > td:nth-child(4), tbody > tr:nth-child(2) > td:nth-child(5), tbody > tr:nth-child(2) > td:nth-child(7), tbody > tr:nth-child(2) > td:nth-child(8), tbody > tr:nth-child(2) > td:nth-child(10), tbody > tr:nth-child(2) > td:nth-child(11)');
  var $tablesHidden = $dealtable.find('tbody > tr:nth-child(3) > td:nth-child(4), tbody > tr:nth-child(3) > td:nth-child(5), tbody > tr:nth-child(3) > td:nth-child(7), tbody > tr:nth-child(3) > td:nth-child(8), tbody > tr:nth-child(3) > td:nth-child(10), tbody > tr:nth-child(3) > td:nth-child(11)');

  $dealtableEmptyTH.hide();
  $THlogistiekCommercieel.attr("colspan", "1");
  $THOndernemer.attr({
    "id": "THondernemer",
    "colspan": "1"
  });
  $THondernemerGoedgekeurd.attr("id", "THondernemerGoedgekeurd").hide();
  $tableOndernemerGoedgekeurd.attr("id", "tableOndernemerGoedgekeurd").hide();
  $THhidden.hide();
  $tablesHidden.hide();
  $todoTableInner.attr("width", "100%");
  $dealtable.attr({
    "id": "dealtable",
    "width": "90%",
    "align": "center"
  }).find('a[href*="final_planning.php"]').remove();
  if ($emtpyTable.find('td').text() == ' ') {
    $emtpyTable.hide();
  }
  $('#content').find('img[src*="https://media.socialdeal.nl/img/team/"]').css("border-radius", "10px");

  //SET CLASS AND DEAL-ID SENDLISTROW
  var sendList = $('#content > div > table[border="1"][width="100%"][cellspacing="0"][cellpadding="5"][style="border-collapse: collapse"][bordercolor="#666666"]:eq(0)');
  var sendListRow = sendList.find('> tbody > tr');
  var todoDeal = $('#content > div > table[border="1"][cellspacing="0"][cellpadding="5"][style="border-collapse: collapse"][bordercolor="#666666"]:eq(1) > tbody > tr:nth-child(3) > td:nth-child(1) > table > tbody > tr');

  const dealTables = document.querySelectorAll('table[border="1"][width][cellspacing="0"][cellpadding="5"][style="border-collapse: collapse"][bordercolor="#666666"]');
  const checkDeal = dealTables[3].querySelectorAll('tr[id*="todo"]');
  const redAfgkrdDeal = dealTables[4].querySelectorAll('tr[id*="todo"]');
  const comAfgkrdDeal = dealTables[7].querySelectorAll('tr[id*="todo"]');
  const ondernemerAfgekeurdDeal = dealTables[13].querySelectorAll('tr[id*="todo"]');

  const checkListDealArr = [];
  const redAfgkrdDealArr = [];
  const comAfgkrdDealArr = [];
  const todoDealsUniqueArr = [];

  //STYLING SENDLIST
  sendList.attr('id', 'sendList').removeAttr('cellpadding bordercolor').wrap('<div id="sendListDiv" style="display: block;"></div>');

  //ADD STATS ICON IN HEADER TODO
  const headerTodo = dealTables[1].querySelector('tr:nth-of-type(2) > td');
  const HTMLstatsIcon = '<img src="https://media.socialdeal.nl/img/stats-icon-bb.png" id="stats-icon" width="16px" style="float: left; cursor: pointer;">';
  headerTodo.firstElementChild.style.marginLeft = "-16px";
  headerTodo.insertAdjacentHTML('afterbegin', HTMLstatsIcon);
  let statsClicks = 0;
  const statsIcon = document.querySelector('#stats-icon');
  statsIcon.addEventListener("click", function() {
    if (statsClicks === 0) {
      loadStats()
      statsClicks++;
    } else {
      document.body.classList.toggle('scroll-off')
      document.querySelector('#stats-modal').classList.toggle('showing');
    }
  });

  //LOOP CHECKDEAL, RED. AFGEKEURD, COMM. AFGEKEURD

  checkDeal.forEach(deal => {
    const dealid = getDigitsFromString(deal.id).toString();
    deal.classList.add("check-deal");
    deal.setAttribute("data-dealid", dealid);
    checkListDealArr.push(dealid);
  });

  redAfgkrdDeal.forEach(deal => {
    const dealid = getDigitsFromString(deal.id).toString();
    const currentTimeBanner = deal.querySelector('td[bgcolor="#FF0000"]');
    const trCity = deal.querySelector('tbody > tr:nth-child(2)');
    const HTMLhourglass = `<td colspan="1" align="left"><div class="pill-afgekeurd pill-afgekeurd-redactie" data-dealid=${dealid} style="display: inline-block; position: relative;"><div class="afgekeurd-popup afgekeurd-popup-redactie" style="display: none; position: absolute; justify-content: center; width: 280px; padding: 8px; bottom: 20px; left: 50%; z-index: 10; background-color: #FF798A; border: 1px solid #666666; word-break: break-word; border-radius: 15px; box-shadow: -2px 2px 8px rgba(0,0,0,0.5); max-height: 400px; overflow-y: auto;"></div><img src="https://media.socialdeal.nl/img/magnifying-glass-icon-bb.png" width="15px" height="15px" style="cursor: pointer;"></div></td>`;
    deal.classList.add("redactie-afgekeurd-deal");
    deal.setAttribute("data-dealid", dealid);
    redAfgkrdDealArr.push(dealid);
    trCity.querySelector('td').colspan = "2";
    trCity.insertAdjacentHTML('afterbegin', HTMLhourglass);
    if (currentTimeBanner !== null) {
      replaceTimeBanner(currentTimeBanner)
    }
  });

  comAfgkrdDeal.forEach(deal => {
    const dealid = getDigitsFromString(deal.id).toString();
    const trCity = deal.querySelector('tbody > tr:nth-child(2)');
    const HTMLhourglass = `<td colspan="1" align="left"><div class="pill-afgekeurd pill-afgekeurd-ss" data-dealid=${dealid} style="display: inline-block; position: relative;"><div class="afgekeurd-popup afgekeurd-popup-ss" style="display: none; position: absolute; justify-content: center; width: 280px; padding: 8px; bottom: 20px; left: 50%; z-index: 10; background-color: #FF798A; border: 1px solid #666666; word-break: break-word; border-radius: 15px; box-shadow: -2px 2px 8px rgba(0,0,0,0.5); max-height: 400px; overflow-y: auto;"></div><img src="https://media.socialdeal.nl/img/magnifying-glass-icon-bb.png" width="15px" height="15px" style="cursor: pointer;"></div></td>`;
    deal.classList.add("salessupport-afgekeurd-deal");
    deal.setAttribute("data-dealid", dealid);
    comAfgkrdDealArr.push(dealid);
    trCity.querySelector('td').colspan = "2";
    trCity.insertAdjacentHTML('afterbegin', HTMLhourglass);
  });

  ondernemerAfgekeurdDeal.forEach(deal => {
    const dealid = getDigitsFromString(deal.id).toString();
    const currentTimeBanner = deal.querySelector('td[bgcolor="#FF0000"]');
    deal.classList.add("ondernemer-afgekeurd-deal");
    deal.setAttribute("data-dealid", dealid);
    if (currentTimeBanner !== null) {
      replaceTimeBanner(currentTimeBanner)
    }
  });

  //CHECK IF SENDLISTDEAL IS CHECKDEAL AND/OR AFGEKEURD (AND SET ATTR)
  sendListRow.each(function() {
    var row = $(this);
    styleSendlistRow(row);

    var url = new URL($(this).find('td > table > tbody > tr > td:nth-child(1) > font > a[href*=deal_edit]').attr('href')).search;
    var dealid = url.substring(22);
    var isCheckDeal = false;
    var isAfgekeurd = false;
    var afgekeurdCount = 0;
    if (checkListDealArr.includes(dealid)) {
      isCheckDeal = true;
    }

    row.find('td > table > tbody > tr > td:not(:first, :last)').each(function() {
      $(this).attr('width', '10%');
      if ($(this).attr("bgcolor") == "#FFC7CE") {
        afgekeurdCount++;
      }
    });

    if (afgekeurdCount > 0) {
      isAfgekeurd = true;
    }

    row.attr({
      "class": "sendListRow",
      "data-dealid": dealid,
      "data-isCheckDeal": isCheckDeal,
      "data-isAfgekeurd": isAfgekeurd
    });

  });

  //SENDLISTFILTER: CHECK LOCAL STORAGE FOR CHECKBOX SETTING AND EXECUTE FILTER
  $(document).ready(function() {
    sendList.before(HTMLfilterCheckboxes);
    var arr = JSON.parse(localStorage.getItem('checked')) || [];
    arr.forEach(function(checked, i) {
      $('.fltrCheckbox').eq(i).prop('checked', checked);
    });
    var fltrAfgekeurd = false;
    var fltrCheckdeal = false;
    if ($("#fltrAfgekeurd").is(':checked')) {
      fltrAfgekeurd = true;
    }
    if ($("#fltrCheckdeal").is(':checked')) {
      fltrCheckdeal = true;
    }
    filterSendList(fltrAfgekeurd, fltrCheckdeal);
  });

  //SENDLISTFILTER: FILTERCODE
  $(document).ready(function() {
    $("#fltrAfgekeurd, #fltrCheckdeal").click(function() {
      var fltrAfgekeurd = false;
      var fltrCheckdeal = false;
      if ($("#fltrAfgekeurd").is(':checked')) {
        fltrAfgekeurd = true;
      }
      if ($("#fltrCheckdeal").is(':checked')) {
        fltrCheckdeal = true;
      }
      var arr = $('.fltrCheckbox').map((i, el) => el.checked).get();
      localStorage.setItem("checked", JSON.stringify(arr));
      filterSendList(fltrAfgekeurd, fltrCheckdeal);
    });
  });

  //TODO-DEALS SET AFGEKEURD STATUS AND FIND DUPLICATES
  todoDeal.each(function() {
    $(this).attr("class", "todoDeal");
    var href = new URL($(this).find('td > table > tbody > tr:nth-child(1)').find('a[href*=deal_aanmaken]').attr('href')).search;
    var dealid = href.substring(26);
    let font = $(this).find('font[color="#FFFFFF"]');
    font[1].parentElement.align = "right";
    let partnerName = font[0].textContent.trim().replace(/ /g, '-');
    let day = font[1].textContent.trim();
    let city = font[2].textContent.trim();
    let nameDay = `${partnerName}-${day}`;
    let afgekeurdStatus;

    //SET AFGEKEURD STATUS
    if (comAfgkrdDealArr.includes(dealid) && redAfgkrdDealArr.includes(dealid)) {
      afgekeurdStatus = "redcomm";
    } else if (redAfgkrdDealArr.includes(dealid)) {
      afgekeurdStatus = "red";
    } else if (comAfgkrdDealArr.includes(dealid)) {
      afgekeurdStatus = "comm";
    } else {
      afgekeurdStatus = "not";
    }
    $(this).attr({
      "data-dealid": dealid,
      "data-afgekeurd": afgekeurdStatus
    });

    //FIND DUPLICATES AND ADD WRAPPER
    if (todoDealsUniqueArr.includes(nameDay)) {
      $(this).find('td:first').css("display", "block");
      if ($(this).attr("data-afgekeurd") == "not") {
        $(this).css({
          "display": "block",
          "outline": "1px solid #666666",
          "margin": "1px 0px"
        }).appendTo($(`div[class="todoDiv"][data-partnerName="${partnerName}"][data-day="${day}"]`));
      } else {
        $(this).css({
          "display": "block",
          "outline": "1px solid #666666",
          "margin": "1px 0px"
        }).prependTo($(`div[class="todoDiv"][data-partnerName="${partnerName}"][data-day="${day}"]`));
      }
    } else {
      todoDealsUniqueArr.push(nameDay);
      $(this).find('td:first').css("display", "block");
      $(this).css({
        "display": "block",
        "outline": "1px solid #666666",
        "margin": "1px 0px"
      }).wrap(`<div class="wrapper"><div class="todoDiv" data-partnerName="${partnerName}" data-day="${day}"></div></div>`);
    }
  });

  //CREATE TABLE VLAGGEN AND LOAD TABLE FROM TO_DO_VLAGGEN.PHP
  $THredactie.attr("colspan", "4");
  $THtodo.after(HTMLvlagTableHeader);
  $todoTable.after(HTMLvlagTableContainer);
  let promiseVlaggenTable = insertVlaggenTable();

  //TODO-DEALS ADD LABELS AFGEKEURD
  $('.todoDeal[data-afgekeurd]').each(function() {
    var $this = $(this);
    var dealid = $this.attr('data-dealid');

    if ($this.attr('data-afgekeurd') == "red") {
      $this.find('tbody > tr:nth-child(2)').after('<tr><td align="left" colspan="3">' + HTMLpillAfgekeurdRedactiePartOne + dealid + HTMLpillAfgekeurdRedactiePartTwo + '</td></tr>');
    } else if ($this.attr('data-afgekeurd') == "comm") {
      $this.find('tbody > tr:nth-child(2)').after('<tr><td align="left" colspan="3">' + HTMLpillAfgekeurdSSPartOne + dealid + HTMLpillAfgekeurdSSPartTwo + '</td></tr>');
    } else if ($this.attr('data-afgekeurd') == "redcomm") {
      $this.find('tbody > tr:nth-child(2)').after('<tr><td align="left" colspan="3">' + HTMLpillAfgekeurdRedactieSSPartOne + dealid + HTMLpillAfgekeurdRedactieSSPartTwo + dealid + HTMLpillAfgekeurdRedactieSSPartThree + '</td></tr>');
    }
  });

  //TODO-DEALS COLLAPSE DUPLICATES
  $('.wrapper').each(function() {

    var deals = $(this).find('.todoDiv > .todoDeal');
    var dealsLength = deals.length;

    if (dealsLength > 1) {

      $(this).append(HTMLtoggleButtonToDo);

      var toggler = $(this).find('.toggler');
      var firstDeal = deals.first();
      var notFirstDeal = deals.not(':first');

      $(this).mouseenter(function() {
        toggler.slideDown(200);
      }).mouseleave(function() {
        toggler.slideUp(200);
      });

      firstDeal.find('tr:eq(1) > td > font:last').append('<span class="badgeDealCount" style="padding: 2px 5px; margin-left: 5px; border-radius: 100%; background-color: #9F9F9F; color: white; cursor: default;">' + dealsLength + '</span>');

      notFirstDeal.slideToggle(200);

      function hiddenDealVisited() {
        var firstDealVisited = firstDeal.find('td').first().attr('bgcolor') == "#FFCC99";
        var notFirstDealVisited = notFirstDeal.find('td[bgcolor="#FFCC99"]').length;
        if (firstDealVisited) return;
        if (!notFirstDealVisited) return;
        firstDeal.find('td').first().css({
          "background-color": "#FFCC99",
          "transition": "background-color 0.3s ease"
        });
      }

      hiddenDealVisited();

      var clicks = 0;

      $(this).click(function(event) {
        var target = $(event.target);
        var wrongTarget = target.parents('.pill-afgekeurd').length;
        if (wrongTarget > 0) return;

        notFirstDeal.slideToggle(250);
        clicks++;
        if (clicks > 1) {
          $(this).find('.toggler > span').css("-webkit-transform", "scale(1, 1)");
          $(this).find('.badgeDealCount').fadeIn(250);
          hiddenDealVisited();
          clicks = 0;
        } else {
          $(this).find('.toggler > span').css("-webkit-transform", "scale(-1, -1)");
          $(this).find('.badgeDealCount').fadeOut(250);
          firstDeal.find('td').first().css("background", "");
        }
      });

      $(this).find('a').click(function(e) {
        e.stopPropagation();
      });
    }
  });

  $todoTable.find('table:first').removeAttr('border bordercolor');

  //POP-UP AFKEURING IN TODO
  $('#content').on("click", ".pill-afgekeurd", function(event) {
    event.stopPropagation();
    var dealid = $(this).attr('data-dealid');
    var popUpDiv;
    var departmentNum;

    if ($(this).hasClass("pill-afgekeurd-redactie")) {
      popUpDiv = $(this).find('.afgekeurd-popup-redactie');
      departmentNum = 1;
    } else if ($(this).hasClass("pill-afgekeurd-ss")) {
      popUpDiv = $(this).find('.afgekeurd-popup-ss');
      departmentNum = 2;
    }

    if (popUpDiv.hasClass("showing")) {
      closeAllPopUps();
    } else {
      closeAllPopUps();
      launchPopUp(dealid, departmentNum, popUpDiv);
    }
  });

  $('#content').on("click", function(event) {
    var afgekeurdPill = $('.pill-afgekeurd');
    if (event.target !== afgekeurdPill) {
      closeAllPopUps();
    }
  });

  //FUNCTIONS

  function filterSendList(fltrAfgekeurd, fltrCheckdeal) {
    $.each($('.sendListRow'), function() {
      var isAfgekeurd = false;
      var isCheckdeal = false;
      var $this = $(this);
      var $thisDiv = $this.closest('div[class="sendListRowDiv"]');
      if ($this.attr('data-isafgekeurd') == "true") {
        isAfgekeurd = true;
      }
      if ($this.attr('data-ischeckdeal') == "true") {
        isCheckdeal = true;
      }
      if (fltrAfgekeurd && !fltrCheckdeal) {
        if (isAfgekeurd) {
          $thisDiv.slideUp('250ms');
        } else {
          $thisDiv.slideDown('250ms');
        }
      } else if (!fltrAfgekeurd && fltrCheckdeal) {
        if (isCheckdeal) {
          $thisDiv.slideUp('250ms');
        } else {
          $thisDiv.slideDown('250ms');
        }
      } else if (fltrAfgekeurd && fltrCheckdeal) {
        if (isAfgekeurd || isCheckdeal) {
          $thisDiv.slideUp('250ms');
        } else {
          $thisDiv.slideDown('250ms');
        }
      } else {
        $thisDiv.slideDown('250ms');
      }
    });
  }

  async function insertVlaggenTable() {

    const vlaggenTableOuter = document.querySelector('#vlagTableOuter');
    const HTMLspinner = `<table align="center"><tbody><tr><td align="center">${HTMLloadSpinner}</td></tr></tbody></table>`;

    vlaggenTableOuter.insertAdjacentHTML('afterbegin', HTMLspinner);

    const vlaggenTable = await getVlaggenTable();

    const child = vlaggenTableOuter.firstElementChild;
    vlaggenTableOuter.removeChild(child);

    const HTMLvlaggenTableInner = `<table border="1" width="100%" cellspacing="0" cellpadding="5" style="border-collapse: collapse" bordercolor="#666666" id="vlagTable"></table>`;
    vlaggenTableOuter.insertAdjacentHTML('afterbegin', HTMLvlaggenTableInner);

    const vlaggenTableInner = document.querySelector('#vlagTable');
    vlaggenTableInner.insertAdjacentElement('afterbegin', vlaggenTable);

    const vlagdeal = document.querySelectorAll('#vlagTable > tbody > tr');

    vlagdeal.forEach(function(vlagdeal) {
      vlagdeal.className = "vlagdeal";
      vlagdeal.querySelector('img[src*="https://media.socialdeal.nl/img/"]').style.borderRadius = "10px";
      vlagdeal.querySelector('tbody > tr').insertAdjacentHTML("afterend", '<tr class="pill-container-row" style="display: none;"><td align="left" colspan="3"></td></tr>');
      const href = vlagdeal.querySelector('a[href*=deal_aanmaken]').search;
      const dealid = new URLSearchParams(href).get("id");
      vlagdeal.setAttribute("data-dealid", dealid);

      if (comAfgkrdDealArr.includes(dealid) || redAfgkrdDealArr.includes(dealid)) {
        addAfgekeurdPill(vlagdeal, dealid);
      }

    });

  }

  async function getVlaggenTable() {

    try {
      const response = await fetch('to_do_vlaggen.php');
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const vlaggenTable = doc.querySelector('#content > div > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(2) > td > font > table > tbody');

      return vlaggenTable;

    } catch (err) {
      console.log("Failed to get vlaggentable");
    }
  }

  function launchPopUp(dealid, departmentNum, el) {

    el.children().remove();
    el.append(HTMLloadSpinner).css({
      "display": "flex",
      "background-color": "#FF798A"
    }).addClass('showing');

    $.get(`deal_aanmaken.php?id=${dealid}`, function(data) {
      var afkeuring = $(data).find(`form[action*="action=add_beoordeling&categorie=${departmentNum}"] > table > tbody > tr:eq(3) > td > table[border="1"][width="100%"][cellspacing="0"][cellpadding="5"][bordercolor="#666666"][style="border-collapse: collapse"] > tbody > tr > td`).first();
      var afkeuringBackgroundColor = afkeuring.attr('bgcolor');
      afkeuring.find('img[src*="https://media.socialdeal.nl/img/team/"]').css("border-radius", "10px");

      el.html(afkeuring.html()).css("background-color", afkeuringBackgroundColor);
      el.append(HTMLloadButtonCross);
      el.find('.close-button').mouseenter(function() {
        $(this).css({
          "opacity": "1",
          "color": "#808080"
        });
      }).mouseleave(function() {
        $(this).css({
          "opacity": "0.5",
          "color": "#696969"
        });
      });

    });
  }

  function closeAllPopUps() {
    $('.afgekeurd-popup.showing').hide().removeClass("showing");
  }

  function addAfgekeurdPill(deal, dealid) {

    const pillContainer = deal.querySelector('.pill-container-row');
    const td = pillContainer.firstElementChild;

    if (comAfgkrdDealArr.includes(dealid)) {
      pillContainer.firstElementChild.insertAdjacentHTML('afterbegin', HTMLpillAfgekeurdSSPartOne + dealid + HTMLpillAfgekeurdSSPartTwo);
    } else if (redAfgkrdDealArr.includes(dealid)) {
      pillContainer.firstElementChild.insertAdjacentHTML('afterbegin', HTMLpillAfgekeurdRedactiePartOne + dealid + HTMLpillAfgekeurdRedactiePartTwo);
    } else if (comAfgkrdDealArr.includes(dealid) && redAfgkrdDealArr.includes(dealid)) {
      pillContainer.firstElementChild.insertAdjacentHTML('afterbegin', HTMLpillAfgekeurdRedactieSSPartOne + dealid + HTMLpillAfgekeurdRedactieSSPartTwo + dealid + HTMLpillAfgekeurdRedactieSSPartThree);
    }

    pillContainer.style.removeProperty('display');

  }

  function addPrioPill(prioVal, deal) {

    if (prioVal === "0") return;

    const pillContainer = deal.querySelector('.pill-container-row');
    pillContainer.style.removeProperty("display");
    let prioElement;

    switch (prioVal) {
      case "7":
        prioElement = HTMLpillasaplow;
        break;
      case "9":
        prioElement = HTMLpillasapmed;
        break;
      case "10":
        prioElement = HTMLpillasaphigh;
        break;
      case "2":
        prioElement = HTMLpillhotellow;
        break;
      case "4":
        prioElement = HTMLpillhotelmed;
        break;
      case "6":
        prioElement = HTMLpillhotelhigh;
        break;
      default:
        prioElement = "<span>Error</span>";
    }

    pillContainer.querySelector('td').insertAdjacentHTML('afterbegin', prioElement);
  }

  function getDigitsFromString(string) {
    var digits = Number(string.replace(/\D/g, ''));
    return digits;
  }

  function minutesToDhm(minutes) {

    var d = Math.floor(minutes / (60 * 24));
    var h = Math.floor(minutes % (60 * 24) / 60);
    var m = Math.floor(minutes % 60);
    var string = returnString(d, h, m);
    return string;

    function returnString(d, h, m) {

      var days = d > 0;
      var sevenDays = d >= 7;
      var hours = h > 0;
      var minutes = m > 0;
      var daysString = d == 1 ? d + " dag" : d + " dgn";

      switch (true) {
        case sevenDays:
          return `${d} dagen`;
        case !days && !hours && minutes:
          return `${m} minuten`;
        case !days && hours && minutes:
          return `${h} uur en ${m} min.`;
        case days && hours && minutes:
          return `${daysString}, ${h} uur en ${m} min.`;
        case !days && hours && !minutes:
          return `${h} uur`;
        case days && hours && !minutes:
          return `${daysString} en ${h} uur`;
        case days && !hours && minutes:
          return `${daysString} en ${m} min.`;
        case days && !hours && !minutes:
          return `${daysString}`;
      }
    }
  }

  function styleSendlistRow(row) {
    row.css("display", "block").wrap('<div class="sendListRowDiv" style="display: block;"></div>');
    row.find('td:first').css("display", "block");
    row.find('table:first').css("margin", "-1px 0px -2px 0px");
    row.find('a[href*=deal_edit]').hide();
    row.find('td > table > tbody > tr > td:last').attr('width', '5%');
    row.find('td > table > tbody > tr > td:first').attr('width', '55%');

    row.find('.dropit-trigger span').each(function() {

      $(this).css({
        "align-items": "center",
        "font-size": "11px",
        "height": "100%",
        "width": "auto",
        "border-radius": "100px",
        "line-height": "1",
        "overflow": "hidden",
        "padding": "2px 8px 2px 8px",
        "margin": "0 3px 0 2px",
        "color": "#FAF9F6",
        "cursor": "default"
      });

      if ($(this).css('background-color') == "rgb(255, 255, 0)") {
        $(this).css({
          "background": "rgb(255 247 0)",
          "color": "#3c3c3c"
        }).text(" Nog geen res. sys. ");
      } else if ($(this).css('background-color') == "rgb(69, 203, 96)") {
        $(this).css("background", "rgb(32, 175, 94)");
      }
    })
  }

  function replaceTimeBanner(currentTimeBanner) {
    const nMinutes = getDigitsFromString(currentTimeBanner.textContent);
    const newTimeBannerText = minutesToDhm(nMinutes);
    const parent = currentTimeBanner.parentElement;
    const newTimeBanner = `<td colspan="3" align="center"><span style="display: inline-flex; align-items: center; justify-content: center; font-family: Arial, Helvetica, sans-serif;font-size: 11.5px;height: 100%;white-space: nowrap;width: 80%;position: relative;border-radius: 100px;overflow: hidden;padding: 2px 12px 2px 12px;margin-top: 2px;text-overflow: ellipsis;color: #FAF9F6;background: #e0453a9c;cursor: default;"><img src="https://media.socialdeal.nl/img/clock-icon-bb.png" width="15px" height="15px" style="margin-right: 5px;"><p>${newTimeBannerText}</p></span></td>`;
    parent.removeChild(currentTimeBanner);
    parent.insertAdjacentHTML('afterbegin', newTimeBanner);
  }

  //

  function loadStats() {
    const HTMLmodal = `
<div id="stats-modal" class="showing">
  <div id="stats-modal-content">
    <select id="stats-daySelect" name="stats-daySelect">
    </select>
    <span id="statsmodal-closebutton">×</span>
    <table id="stats-table">
    </table>
  </div>
</div>
`;

    const CSStext = `
<style>

body.scroll-off {
  overflow: hidden;
  padding-right: 17px;
}

#stats-modal {
  display: none;
  position: fixed;
  z-index: 10;
  padding-top: 10vh;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.4);
  font-size: 14px;
}

#stats-modal.showing {
  display: block;
}

#stats-modal-content {
  background-color: rgb(236, 243, 248);
  padding: 20px;
  width: 600px;
  max-height: 75vh;
  overflow: auto;
  margin: auto;
  border: 1px solid grey;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.5) -2px 2px 8px;
}

#stats-daySelect{
  position: absolute;
}

#statsmodal-closebutton {
  float: right;
  margin-right: -8px;
  font-size: 30px;
  line-height: 0px;
  color: rgb(105, 105, 105);
  opacity: 0.5;
  cursor: pointer;
}

#statsmodal-closebutton:hover {
  opacity: 1;
}

#stats-table {
  border-collapse: collapse;
  margin: auto;
}

#stats-table td,
th {
  border: 1px solid grey;
  text-align: center;
  padding: 5px 10px;
}

#stats-table tr {
  background-color: white;
  margin: auto;
}

#stats-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#stats-table tr:last-of-type {
  font-weight: bold;
}

</style>
`;

    document.querySelector('head').insertAdjacentHTML("beforeend", CSStext);
    const body = document.querySelector('body');
    body.insertAdjacentHTML("beforeEnd", HTMLmodal);
    body.classList.add('scroll-off')

    const modalCloseButton = document.querySelector('#statsmodal-closebutton');
    const statsModal = document.querySelector('#stats-modal');
    const daySelect = document.querySelector('#stats-daySelect');

    const dealstats = getStats();

    addOptionsDaySelect();
    createTable(dealstats);

    modalCloseButton.addEventListener("click", function() {
      statsModal.classList.remove('showing');
      body.classList.remove('scroll-off');
    });

    window.addEventListener("click", function(event) {
      if (event.target !== statsModal) return;
      statsModal.classList.remove('showing');
      body.classList.remove('scroll-off');
    });

    daySelect.addEventListener("input", updateTable);

    function getStats() {

      const dealDays = [];

      document.querySelectorAll('.todoDiv').forEach(deal => {
        dealDays.push(deal.dataset.day);
      });

      const dealDaysSorted = dealDays.sort(function(a, b) {
        return a - b
      });

      const dealcount = dealDaysSorted.reduce((allDeals, deal) => {
        const currCount = allDeals[deal] ?? 0;
        return {
          ...allDeals,
          [deal]: currCount + 1,
        };
      }, {});

      return dealcount;
    }

    function addOptionsDaySelect() {

      let option;

      for (const key in dealstats) {
        const date = dateNumDaysFromNow(parseInt(key));
        option = document.createElement('option');
        option.textContent = `Dag ${key} - ${date}`;
        option.value = key;
        daySelect.appendChild(option);
      }

      daySelect.options[daySelect.options.length - 1].setAttribute('selected', '');
    }

    function createTable(dealstats) {

      const table = document.querySelector('#stats-table');
      const tbody = document.createElement('tbody');
      const header = document.createElement('tr');
      const thDay = document.createElement('th');
      const thDeals = document.createElement('th');
      thDay.textContent = 'Dag';
      thDeals.textContent = 'Aantal deals';
      header.appendChild(thDay);
      header.appendChild(thDeals);
      tbody.appendChild(header);

      let tdKey;
      let tdValue;
      let tr;
      let total = 0;
      const dayValue = parseInt(daySelect.value);

      for (const key in dealstats) {

        if (parseInt(key) > dayValue) break;

        tr = document.createElement('tr');
        tdKey = document.createElement('td');
        tdValue = document.createElement('td');
        tdKey.textContent = `Dag ${key}`;
        tdValue.textContent = dealstats[key];
        tr.appendChild(tdKey);
        tr.appendChild(tdValue);
        tbody.appendChild(tr);
        total += dealstats[key];
      }

      tr = document.createElement('tr');
      tdKey = document.createElement('td');
      tdValue = document.createElement('td');
      tdKey.textContent = `Totaal`;
      tdValue.textContent = total;
      tr.appendChild(tdKey);
      tr.appendChild(tdValue);
      tbody.appendChild(tr);
      table.appendChild(tbody);

    }

    function updateTable() {

      const table = document.querySelector('#stats-table');
      const tbody = table.firstElementChild;
      table.removeChild(tbody);
      createTable(dealstats);

    }

    function dateNumDaysFromNow(days) {

      const dayNames = ["zo", "ma", "di", "wo", "do", "vr", "za"];
      const monthNames = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];

      let date = new Date();
      date.setDate(date.getDate() + days);

      const day = date.getDay();
      const dateNum = date.getDate();
      const month = date.getMonth();

      return `${dayNames[day]}. ${dateNum} ${monthNames[month]}.`;
    }

  }

  //END TIMER TO MEASURE CODE DURATION
  console.timeEnd("Timer 1");

})();