// ==UserScript==
// @name         Stud.IP message tagger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add bulk tagging and untagging mechanism to message list
// @author       Michael Chen
// @match        https://e-learning.tuhh.de/studip/dispatch.php/messages/*
// @icon         https://www.google.com/s2/favicons?domain=tuhh.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424336/StudIP%20message%20tagger.user.js
// @updateURL https://update.greasyfork.org/scripts/424336/StudIP%20message%20tagger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("head").append($(`
  <style>
  #tag_name_add_extension, #tag_name_remove_extension {
    box-sizing: border-box;border: 1px solid #7e92b0;border-right-width: 30px;float: left;height: 22px;width: 100%;
  }
  .sidebar-tagging .tagging {
    list-style: none;margin: 0;padding: 0;
  }
  .sidebar-tagging input[type=submit] {
    font: 0/0 a;
    color: transparent;
    text-shadow: none;
    background-color: transparent;
    border: 0;
    width: 29px;
    height: 20px;
    background-size: 16px;
    float: left;
    background-position: center 3px;
    background-repeat: no-repeat;
    vertical-align: top;
    margin-left: -30px;
  }
  .sidebar-tagging.remove_tag input[type=submit] {
    background-image: url(https://e-learning.tuhh.de/studip/assets/images/icons/white/remove.svg);
  }
  .sidebar-tagging.add_tag input[type=submit] {
    background-image: url(https://e-learning.tuhh.de/studip/assets/images/icons/white/add.svg);
  }
  </style>`));
    const tagging_widget = $(`<div class="sidebar-widget">
  <div class="sidebar-widget-header">Tagging</div>
  <div class="sidebar-widget-content">
    <form class="sidebar-tagging add_tag" action="javascript:void(0);">
      <ul class="tagging">
        <li>
          <label for="tag_name_add_extension" style="display:none;">Add Tag</label>
          <input type="text" id="tag_name_add_extension" name="tagname" value="" placeholder="Add Tag">
          <input type="submit" value="Add">
        </li>
      </ul>
    </form>
    <form class="sidebar-tagging remove_tag" action="javascript:void(0);">
      <ul class="tagging">
        <li>
          <label for="tag_name_remove_extension" style="display:none;">Remove Tag</label>
          <input type="text" id="tag_name_remove_extension" name="tagname" value="" placeholder="Remove Tag">
          <input type="submit" value="Remove">
        </li>
      </ul>
    </form>
  </div>
</div>`);
    const tagging_form = tagging_widget.find(".add_tag");
    const tagging_value = tagging_form.find("#tag_name_add_extension");
    const untagging_form = tagging_widget.find(".remove_tag");
    const untagging_value = untagging_form.find("#tag_name_remove_extension");

    function getCheckedMessageIds() {
        var messages = $("#messages").find("input[type=checkbox").filter(function(i) { return $( this ).attr("id") == undefined; });
        messages = messages.filter(function(i) { return $( this )[0].checked; });
        return Array.from(messages.map(function(i) { return $(this).val(); }));
    }

    tagging_form.on("submit", function(e) {
        e.preventDefault();
        const tagname = tagging_value.val();
        const urls = getCheckedMessageIds().map(id => `https://e-learning.tuhh.de/studip/dispatch.php/messages/tag/${id}`);
        Promise.all(urls.map(url => $.post(url, { add_tag: tagname }))).then(function() {location.reload();});
    });
    untagging_form.on("submit", function(e) {
        e.preventDefault();
        const tagname = untagging_value.val();
        const urls = getCheckedMessageIds().map(id => `https://e-learning.tuhh.de/studip/dispatch.php/messages/tag/${id}`);
        Promise.all(urls.map(url => $.post(url, { remove_tag: tagname }))).then(function() {location.reload();});
    });

    $(".sidebar").append(tagging_widget);
})();