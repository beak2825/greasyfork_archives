// ==UserScript==
// @name        Deviant Helper
// @namespace   deviant_helper
// @author      Dediggefedde, Peter Grand, Royce
// @description A helper tool, please note that i have merged 2 scripts da_Ignore, Deviant Blocker and slightly modified and added some small feature, but the credit goes to the original authors.
// @license     GNU GPLv3
// @match       http://*.deviantart.com/*
// @match       https://*.deviantart.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @version     1.1
/* @run-at      document-start */
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.log
// @downloadURL https://update.greasyfork.org/scripts/392190/Deviant%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/392190/Deviant%20Helper.meta.js
// ==/UserScript==

/*
Hide Tags/Description:

DiFi.pushPost("DeviationView","getExtrasHTML",["501848540","",{},{"is_referred":0,"origin":"dynamic_nav_click","is_new_tab":1}],function(success, data){
   console.log(data.response.content.html_col1.split("http://www.deviantart.com/tag/").length);
   //tag-count
});
DiFi.send();
*/

var data_variable = "ignore_list";
var ignore_list = [];
var settings = {};

// Load settings asynchronously
async function load_ignore() {
  var ignore_list_data = await GM.getValue(data_variable, null);
  if (ignore_list_data != null) ignore_list = ignore_list_data.split('\n');
  ignore_list = ignore_list.filter(function (x) { return x.length > 0; });
}
async function load_settings() {
  var settings_data = await GM.getValue('settings', null);
  if (settings_data != null) settings = $.parseJSON(settings_data);

  if (settings.hide_comments == null) settings.hide_comments = false;
  if (settings.hide_messages == null) settings.hide_messages = false;
  if (settings.delete_messages == null) settings.delete_messages = false;
  if (settings.hide_profile == null) settings.hide_profile = false;
  if (settings.hide_deviations == null) settings.hide_deviations = false;
}

// Extract the url into components
function extract_url() {
  var full_url = decodeURIComponent(window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + window.location.search)
    .replace(/\/+$/, '');
  var url = {
    normal_url: full_url,
    filter_url: full_url
  };

  var pattern = /(.+?\?q=)(.*)/;
  var match = pattern.exec(full_url);
  if (match) {
    var base_path = match[1];
    var offset = '';
    var filter_by = '';

    var search = match[2].split('&');
    if (search.length == 2) {
      offset = '&' + search[1];
    }
    search = search[0];

    if (ignore_list.length > 0) {
      filter_by = '+-by:(' + ignore_list.join('+OR+') + ')';
    }

    search = search.split('+-by:')[0];

    url.normal_url = base_path + search;// + offset;
    url.filter_url = base_path + search + filter_by;// + offset;
  }
  return url;
}

// Save the ignore list
async function save_ignore_list() {
  ignore_list = $.unique(ignore_list).filter(function (param) { return $.trim(param).length > 0; });
  await GM.setValue(data_variable, ignore_list.join("\n"));
}

// Add a user to ignore list
async function add_to_ignore(userid) {
  await load_ignore();
  ignore_list.push(userid);
  await save_ignore_list();
}

// Remove a user from ignore list
async function remove_from_ignore(userid) {
  await load_ignore();
  var index = ignore_list.indexOf(userid);
  if (index > -1) {
    ignore_list.splice(index, 1);
    await save_ignore_list();
    return true;
  } else return false;
}

// Toggle a user in ignore list
async function toggle_ignore(userid) {
  var removed = await remove_from_ignore(userid);
  if (!removed) await add_to_ignore(userid);
}

//Set the visbility of images based on userid
function update_visibility(images) {
  if (images == null || images == undefined)
    images = $('img').filter(function () {
      return $(this).attr('data-userid');
    });
  images.css('visibility', function () {
    var userid = $(this).attr('data-userid');
    if (ignore_list.indexOf(userid) > -1) {
        $(this).closest('span.thumb').css('display', 'none');
        return "hidden";
    } else {
        return "visible";
    }
  });
}

function add_buttons() {
  // Check and add Ignore button to the button bar on profile page
  if ($("div.catbar").length > 0) {
    if ($("#da_ignore_button").length == 0) {
      var userid = $("#deviant a.username").html();
      var button_bar = $("div.gmbutton2town.moarbuttons");
      button_bar.prepend($('<a id="da_ignore_button" class="gmbutton2 gmbutton2qn2r" title="Add to your ignore-list" href="#"><i class="icon i27"></i><span>Ignore</span><b></b></a>'));

      var ignore_button = $('#da_ignore_button');
      ignore_button.find('span').html(button_text());
      ignore_button.click(function () {
        toggle_ignore(userid).then(() => ignore_button.find('span').html(button_text()));
      });

      $('a.devwatch').click(function () {
        poll_watch_modal();
      });
    }

  }

  function poll_watch_modal() {
    var modal = $('div#modalspace:visible');
    if (modal.length > 0) {
      if (modal.find('#watch_select_all').length == 0) {
        var button = $('<a id="watch_select_all" class="smbutton smbutton-size-default smbutton-shadow smbutton-pale">Select All/None</a>');
        modal.find('div.modal-button-holder').append(button);
        button.click(function () {
          var boxes = modal.find('input[type=checkbox]');
          var selected = modal.find('input:checked');
          if (selected.length > 0) boxes.prop('checked', false);
          else boxes.prop('checked', true);
        });
      }
    } else setTimeout(poll_watch_modal, 500);
  }

  // Check and add filter buttons on browse page
  var active_item = $("a.navbar-menu-item.active");
  if (active_item.length > 0) {
    if (active_item.html() == "Browse") {
      var nav_menu = $("div.navbar-menu-inner-scroll");
      nav_menu.append($('<span class="navbar-menu-item navbar-menu-separator"></span>'));

      // Add filter button
      nav_menu.append($('<a id="da_filter_button" class="navbar-menu-item" title="Filter Authors" href="#"><span>Filter Authors</span></a>')
        .click(function () {
          load_ignore().then(() => window.location = extract_url().filter_url);
        })
      );

      // Add remove filter button
      nav_menu.append($('<a id="da_unfilter_button" class="navbar-menu-item" title="Remove Author Filter" href="#"><span>Remove Filter</span></a>')
        .click(function () {
          window.location = extract_url().normal_url;
        })
      );
    }
  }

  function button_text() {
    var text = 'Ignore';
    if (ignore_list.indexOf(userid) > -1)
      text = 'Reset';
    return text;
  }
}

// Find images and add a block button, block ignored user images
function scan_images() {
  var active_item = $("a.navbar-menu-item.active");
  if (active_item.length > 0) {
    if (active_item.html() == "Browse") {
      var new_images = $('img').filter(function () {
        if ($(this).attr('data-sigil') && !$(this).attr('data-blocked')) return true;
        else return false;
      });
      new_images.attr('data-blocked', 0);
      new_images.attr('data-userid', function () {
        return $(this).parents('span.thumb').find('a.username').html();
      });

      new_images.parents('span.thumb')
        .append(function () {
          var userid = $(this).find('a.username').html();
          var button = $('<input/>').attr({
            type: "button",
            style: "bottom:0px; right:0px; opacity:0.6; z-index:99; position:absolute;",
            title: "Add/Remove from ignore list",
            value: "x"
          });
          button.click(function (event) {
            event.preventDefault();
            toggle_ignore(userid).then(function () {
              update_visibility();
            });
            event.cancelBubble = true;
            event.stopPropagation();
          });
          return button;
        });
      update_visibility(new_images);
    }
  }
}


// Add settings?
if (location.href.indexOf('https://www.deviantart.com/settings') == 0) {
  var ignore_menu = $('<li><a href="#">Deviant Helper</a></li>');

  var settings_html = `
  <div class="fooview ch">
    <div class="fooview-inner">
      <h3>Ignore Users</h3>
      <span>Separate usernames by linebreaks!</span>
      <fieldset style="border:none;padding:0;">
        <textarea cols="70" rows="4" class="itext_uplifted" id="da_ignore_textarea"/>
      </fieldset>
    </div>
    <div class="buttons ch hh" id="submit">
      <div style="text-align:right" class="rr">
        <a class="smbutton smbutton-green" href="javascript:void(0)">
          <span id="da_ignore_saveblocklist">Save</span>
        </a>
      </div>
    </div>
  </div>
  `;

  $('#settings_public').parent().after(ignore_menu);
  ignore_menu.find('a').click(function () {
    load_ignore().then(function () {  
      $('a.active').removeClass('active');
      $(this).addClass('active');
      $('div.settings_form').html(settings_html);
      $('#da_ignore_textarea').html(ignore_list.join('\n'));
      $('#da_ignore_saveblocklist').click(() => {
        ignore_list = $('#da_ignore_textarea').val().split('\n');
        save_ignore_list().then(alert('List saved!'));
      });
    });
  });
}

var future = load_ignore();
future.then(load_settings);
future.then(function () {
  setInterval(scan_images, 1000);
});
future.then(add_buttons);
