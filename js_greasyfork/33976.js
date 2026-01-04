// ==UserScript==
// @name         Redmine Extra
// @namespace    https://github.com/j4ckth3r1pp3r
// @version      0.95
// @description  Overview in tasks, spent time by date/task, fancybox on images, extra links, auto update info
// @author       J4ck Th3 R1pp3r
// @match        https://redmine.tsn-media.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.js
// @downloadURL https://update.greasyfork.org/scripts/33976/Redmine%20Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/33976/Redmine%20Extra.meta.js
// ==/UserScript==

(function() {
    var overviewLink = $('a.overview').attr('href') || '',
    links = {'Add your own': '#'},
    updateInterval,
    intervalUpdate = localStorage.getItem('intervalUpdate') || 1;
    updateTurn = localStorage.getItem('autoUpdate') || 0,
    projectKeyArray = overviewLink.match(/projects\/(.*)/) || ['', ''],
    projectKey = projectKeyArray[1],
    allImagesSelector = 'a[href$=".gif"], a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".bmp"]',
    spentTimeLink = $('.spent-time').find('a').attr('href'),
    yourSpentTimeContainer = $('.estimated-hours').length ? $('.cf_6') : $('.fixed-version'),
    isIssuePage = !!location.pathname.match(/issues\/\d*$/),
    myTasksWithPriorityLink = '/issues?query_id=16',
    todayYourSpentTimeLink = '/time_entries?utf8=✓&f[]=spent_on&op[spent_on]=t&f[]=user_id&op[user_id]==&v[user_id][]=me&f[]=&c[]=project&c[]=spent_on&c[]=user&c[]=activity&c[]=issue&c[]=comments&c[]=hours',
    onlyYourSpentTimeLink = spentTimeLink+'/?utf8=✓&f[]=spent_on&op[spent_on]=*&f[]=user_id&op[user_id]==&v[user_id][]=me&f[]=&c[]=project&c[]=spent_on&c[]=user&c[]=activity&c[]=issue&c[]=comments&c[]=hours';

$('head').append(`
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.1.25/jquery.fancybox.min.css" />
  <style>
  #overview {
    background-color: rgba(0,0,0,0.1);
    padding: 1px 10px;
    border-radius: 5px;
  }
  .relative {
    position: relative;
  }
  .journal.has-notes.has-details {
    overflow: auto;
    border-bottom-color: rgba(0, 0, 0, 0.2);
    border-bottom-width: 1px;
    border-bottom-style: solid;
    margin-bottom: 10px;
  }
  #top-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 99%;
    z-index: 99;
  }
  #header {
    padding-top: 30px;
  }
  .my-tasks-link:after {
    display: inline-block;
    content: attr(data-tasks);
    background-color: #c4434f;
    padding: 3px;
    width: 8px;
    height: 8px;
    text-align: center;
    font-size: 8px;
    border-radius: 50%;
    margin-left: 5px;
  }
  .my-tasks-popup,
  .my-spent-time-popup {
    position: fixed;
    width: 100%;
    left: 0px;
    top: 20px;
    background-color: #fff;
    display: none;
    z-index: 9999;
    -webkit-box-shadow: 0px 10px 22px -6px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 10px 22px -6px rgba(0,0,0,0.75);
    box-shadow: 0px 10px 22px -6px rgba(0,0,0,0.75);
  }
  .my-tasks-popup .fixed_version,
  .my-tasks-popup .parent,
  .my-tasks-popup thead tr th:last-child,
  .my-tasks-popup thead tr th:nth-child(6),
  .my-tasks-popup .assigned_to,
  .my-tasks-popup thead tr th:nth-child(8) {
    display: none;
  }

  #top-menu li:before {
    content: "| ";
    display: inline-block;
    padding-right: 9px;
  }

  #top-menu li:nth-child(1):before,
  #top-menu li:nth-child(2):before,
  #top-menu li:nth-child(3):before,
  #top-menu li:nth-child(4):before {
    display: none;
  }

  .custom-links-wrapper {
    display: inline-block;
  }
  .custom-links-wrapper a:after {
    display: inline-block;
    content: ", ";
  }
  .custom-links-wrapper a:after {
    display: inline-block;
    content: ", ";
  }
  .custom-links-wrapper a:nth-last-child(1):after {
    display: none;
  }
  #j4ck-settings {
    display: none;
    min-width: 500px;
    background-color: #ffd;
    -webkit-box-shadow: 0px 10px 22px -6px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 10px 22px -6px rgba(0,0,0,0.75);
    box-shadow: 0px 10px 22px -6px rgba(0,0,0,0.75);
    border-radius: 20px;
  }
  .fancybox-close-small:focus:after {
    outline: none;
  }
  .btn {
    background: #628db6;
    border-width: 0;
    color: #fff;
    text-decoration: none;
    padding: 7px 20px;
    line-height: 1.5;
    border-radius: 20px;
    text-transform: uppercase;
    font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 80%;
    font-weight: 700;
    margin: 5px 5px 5px 0;
    display: inline-block;
    cursor: pointer;
    outline: none;
    transition: all .2s ease-in-out;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .btn.red {
    background: #c4434f;
  }
  .btn.green {
    background: #1ba81b;
  }
  .btn.disabled,
  .link-wrapper:nth-child(1) [data-direction="up"],
  .link-wrapper:nth-last-child(1) [data-direction="down"] {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn.arrow {
    padding: 7px 10px;
    background: #2b5079;
    cursor: pointer;
  }
  .hiddenbutton {
    display: none;
  }
  .link-wrapper input,
  .update input {
    border: 0;
    border-bottom: 2px solid #1976D2;
    font-size: 14px;
    line-height: 20px;
    height: 15px;
    text-align: left;
    padding: 6px;
    background: transparent;
    color: #2d4151;
    outline: none;
  }
  .link-wrapper input::placeholder,
  .update input::placeholder {
    color: #3492ef;
  }
  .link-wrapper input:focus,
  .update input:focus {
   outline: 0;
	 color: #0069bf;
  }
  .saved-info {
    display: none;
    font-weight: bold;
    color: #1ba81b;
  }
  .update {
    margin-bottom: 10px;
  }
  .update label {
    font-weight: bold;
  }
  .update [for="auto-update"] {
    padding-left: 5px;
    position: relative;
    top: 1px;
  }
  .update [for="interval-update"] {
    margin-top: 10px;
    position: absolute;
    top: -25px;
  }
  .update .relative {
    display: inline-block;
    margin-left: 56px;
  }
  #interval-update:after {
    display: inline-block;
    content: 'Interval (min)';
  }
  </style>
`);

// Add Your Spent Time
$('.cf_6').eq(1).after('<td></td>');
$('.cf_6').eq(1).after('<th></th>');
yourSpentTimeContainer.next('th').text('Your spent time:');
yourSpentTimeContainer.next().next('td').html(`<a href="${onlyYourSpentTimeLink}">-:-- hours</a>`);

function onlyYourSpentTimeUpdate() {
  $.get(onlyYourSpentTimeLink, function (data) {
    var yourSpentTime = getSpentTime(data);
    yourSpentTimeContainer.next().next('td').find('a').text(yourSpentTime);
  });
}

// Add Overview info to right sidebar
function addOverView() {
  $.get(overviewLink, function (data) {
    $('#watchers').after('<div id="overview"><h3 class="title">Overview</h3></div>');

    $('#overview').find('h3').after($(data).find('.splitcontentleft').html());
    $('#overview').find('a').attr('target', '_blank');
  });
}

// Add Today Spent Time To Header
$('#top-menu').find('ul').eq(1).append(`
  <li class="today-spent">
    Today spent time:
    <a href="#" target="_blank">-.-- hours</a>
  </li>
  `);

$('body').append('<div class="my-spent-time-popup"></div>');
$('.today-spent').find('a').click(function (e) {
  e.preventDefault();

  $('.my-spent-time-popup').slideToggle();
});

function todaySpentTimeUpdate() {
  $.get(todayYourSpentTimeLink, function (data) {
    var todaySpentTime = getSpentTime(data),
        todaySpentTimeTable = $(data).find('.autoscroll');

    $('.my-spent-time-popup').html(todaySpentTimeTable);

    $('#top-menu').find('.today-spent a').attr('href', todayYourSpentTimeLink).html(todaySpentTime);

  });
}

// Add My Tasks Menu
$('#top-menu').find('ul').eq(1).append('<li class="my-tasks-button"><a href="#" class="my-tasks-link"  data-tasks="-">My tasks</a></li>');
$('body').append('<div class="my-tasks-popup"></div>');
$('.my-tasks-button').find('a').click(function (e) {
  e.preventDefault();

  $('.my-tasks-popup').slideToggle();
});

function myTasksUpdate() {
  $.get(myTasksWithPriorityLink, function (data) {
    var myTasks = $(data).find('.autoscroll'),
        tasksQuantity = $(myTasks).find('.list.issues tbody tr[id^=issue-]').length;

    $('.my-tasks-popup').html(myTasks);

    $('.my-tasks-link').attr('data-tasks', tasksQuantity);
  });
}

$(window).scroll(function () {
  $('.my-tasks-popup, .my-spent-time-popup').slideUp();
});

// Close My Tasks window when clicked areo out.
$('#wrapper').click(function (e) {
  if (!$(e.target).is('.my-tasks-link'))   $('.my-tasks-popup').slideUp();
  if (!$(e.target).is('.today-spent a'))   $('.my-spent-time-popup').slideUp();
});

// Add last update time
$('#top-menu').find('ul').eq(1).append(`<li class="last-update">Last update: <span>--:--:--</span> <a href="#" class="last-update-button">(Update)</a></li>`);

function lastTimeUpdate() {
  $('.last-update').find('span').text(getCurrentTime());
}

// Custom links
function addMyLinks() {
  var linksString = localStorage.getItem(projectKey);
  if (linksString) links = JSON.parse(linksString);

  if (!$('.custom-links-wrapper').length)
    $('#top-menu').find('ul').eq(1).append(`<li class="custom-links"><span>Custom Links:</span> <div class="custom-links-wrapper"></div></li>`);

  if (!$('.links-wrapper').length)
    $('#j4ck-settings').find('.content').append('<div class="settings-links"><h3>Menu Items</h3><div class="links-wrapper"></div></div>');

  $('.custom-links-wrapper').html('');
  $('#j4ck-settings').find('.links-wrapper').html('');
  for(var key in links) {
    $('.custom-links-wrapper').append(`<a href="${links[key]}" title="${links[key]}" target="_blank">${key}</a>`);
    $('#j4ck-settings').find('.links-wrapper').append(`
      <div class="link-wrapper">
        <button class="btn arrow" data-action="move" data-direction="down">▼</button>
        <button class="btn arrow" data-action="move" data-direction="up">▲</button>
        <input name="key" placeholder="Name" value="${key}">
        <input name="label" placeholder="Link" value="${links[key]}">
        <button class="btn green" data-action="add-link">Add</button>
        <button class="btn red" data-action="delete-link">Delete</button>
      </div>
    `);
  }

  // Open settings on "Add your own"
  $('.custom-links').on('click', 'a:contains("Add your own")', function (e) {
    e.preventDefault();
    $('.settings-button').click();
  });
}

// Settings
$('body').append('<div id="j4ck-settings"><h2>Settings</h2><div class="content"></div><button class="btn" data-action="save">Save</button></div>');
$('<p class="saved-info">Saved!</p>').insertBefore('[data-action="save"]');

$('#top-menu').find('ul').eq(1).append(`<li class="settings"><a data-fancybox data-src="#j4ck-settings" href="javascript:;" class="settings-button">Settings</a></li>`);

// Save Settings
$('#j4ck-settings').find('[data-action="save"]').click(function () {
  if ($('.settings-links').length) {
    links = {};
    $('#j4ck-settings').find('.link-wrapper').each(function () {
      var key = $(this).find('[name="key"]').val(),
          label = $(this).find('[name="label"]').val();
      if (key && label) links[key] = label;
    });
    if (!Object.keys(links).length) links['Add'] = '#';
    localStorage.setItem(projectKey, JSON.stringify(links));
    addMyLinks();
  }

  // save autoUpdate
  updateTurn = ($('#auto-update').prop('checked')) ? 1 : 0;
  localStorage.setItem('autoUpdate', updateTurn);

  // save interval-update and refresh page when interval changed
  if (intervalUpdate != $('#interval-update').val()) {
    setTimeout(function() {
      location.reload();
    }, 1000);
  }
  intervalUpdate = $('#interval-update').val();
  localStorage.setItem('intervalUpdate', intervalUpdate);


  $('.saved-info').fadeIn();
  updateInfo();
  setTimeout(function() {
    $.fancybox.close();
    $('.saved-info').hide();
  }, 1000);
});

// Actions Del/Add
$('#j4ck-settings').on('click', '[data-action="delete-link"]', function (e) {
  e.preventDefault();
  $(this).parent().slideUp(400, function () {
    $(this).remove();
    checkIfItemOneAndHideDeleteButton();
  });

});

// Action Change Order
$('#j4ck-settings').on('click', '[data-action^="move"]', function (e) {
  e.preventDefault();
  var self = $(this),
      wrapper = $(this).parent(),
      allLinksCount = wrapper.parent().find('.link-wrapper').length,
      wrapperPrev = wrapper.prev(),
      wrapperNext = wrapper.next(),
      direction = self.data('direction');

  if (direction == 'up') wrapper.insertBefore(wrapperPrev);
  else if (direction == 'down') wrapper.insertAfter(wrapperNext);
  console.log(allLinksCount);
});

$('#j4ck-settings').on('keyup', 'input', function (e) {
  if (e.which==13) $('#j4ck-settings').find('[data-action="save"]').click();
});

$('.settings').find('a').click(function () {
  checkIfItemOneAndHideDeleteButton();
});

$('#j4ck-settings').on('click', '[data-action="add-link"]', function (e) {
  e.preventDefault();
  $(this).parent().clone().addClass('hiddenbutton').insertAfter($(this).parent());
  $('.hiddenbutton').find('input').val('');
  $('.hiddenbutton').slideDown(400, function () {
    $(this).removeClass('hiddenbutton').attr('style', '');
  });

  checkIfItemOneAndHideDeleteButton();
});

$('#j4ck-settings').on('keyup', 'input', checkIfItemOneAndHideDeleteButton);

function checkIfItemOneAndHideDeleteButton() {
  var cantDelete = false;

  $('[name="key"], [name="label"]').each(function () {
    if (!$(this).val().length) cantDelete = true;
  });

  if ($('[data-action="delete-link"]').length == 1) $('[data-action="delete-link"]').addClass('disabled').prop('disabled', 1);
  else if (!cantDelete) $('[data-action="delete-link"]').removeClass('disabled').prop('disabled', 0);
}


// Add Fancybox
$(allImagesSelector).fancybox();

// Update Fancybox selector when Preview clicked
$('a:contains("Preview")').click(function () {
  setTimeout(function() {
    $(allImagesSelector).fancybox();
  }, 1000);
});

// Update All info
$('.last-update-button').click(updateInfo);
function updateInfo(e) {
  if (typeof e !== 'undefined') e.preventDefault();
  todaySpentTimeUpdate();
  myTasksUpdate();
  lastTimeUpdate();
  updaterInterval();
  if (isIssuePage) {
    onlyYourSpentTimeUpdate();
  };
}

// Update with interval
$('#j4ck-settings').find('.content').prepend('<div class="update"><h3>Update</h3></div>');
$('#j4ck-settings').find('.update').append('<input type="checkbox" name="auto-update" id="auto-update" value="1"><label for="auto-update">Auto update</label>');
$('#j4ck-settings').find('.update').append(`
  <div class="relative">
    <label for="interval-update">Interval (min)</label>
    <input type="number" name="interval-update" id="interval-update" value="${intervalUpdate}">
  </div>`);
$('#j4ck-settings').find('#auto-update').prop('checked', (updateTurn == 1) ? 1 : 0);

function updaterInterval() {
  if (!updateInterval && updateTurn) {
    updateInterval = setInterval(function() {
      updateInfo();
    }, (intervalUpdate*60000));
  } else {
    if (updateTurn == 0 && updateInterval) {
      clearInterval(updateInterval);
      updateInterval = false;
    }
  }
}

// Paster clipboard with "screenshot" wrapper
function typeInTextarea(el, newText, delay = 0) {
  var start = el.prop("selectionStart");
  var end = el.prop("selectionEnd");
  var text = el.val();
  var before = text.substring(0, start);
  var after  = text.substring(end, text.length);
  el.val(before + newText + after);
  el[0].selectionStart = el[0].selectionEnd = start + newText.length + delay
  el.focus();
}

// Ctrl - 17
// Alt - 18
// V - 86
var ctrlAltC ={};
$('body').on('keydown', 'input, textarea', function (e) {
  ctrlAltC[e.keyCode] = true;
}).on('keyup', 'input, textarea', function (e) {
  var self = $(this);
  if (ctrlAltC[86] && ctrlAltC[17] && ctrlAltC[18]) {
    typeInTextarea($(this), ' ( "screenshot": )', -2);
  }
  ctrlAltC[e.keyCode] = false;
});


function getSpentTime(data) {
  return $(data).find('.hours.hours-int').text()+$(data).find('.hours.hours-dec').text()+' hours';
}

function getCurrentTime() {
  var dt = new Date();
  return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
}

$(document).ready(function () {
  todaySpentTimeUpdate();
  myTasksUpdate();
  lastTimeUpdate();
  updaterInterval();
  if (isIssuePage) {
    addOverView();
    addMyLinks();
    onlyYourSpentTimeUpdate();
  };
});
})();