// ==UserScript==
// @name         Guilty Record Lookup for scboy.cc
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Complement the forum's existing guilty record feature
// @author       tianyi
// @include      https://www.scboy.cc/*
// @downloadURL https://update.greasyfork.org/scripts/418693/Guilty%20Record%20Lookup%20for%20scboycc.user.js
// @updateURL https://update.greasyfork.org/scripts/418693/Guilty%20Record%20Lookup%20for%20scboycc.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const $guiltyRecord = $(`
  <div id="guilty-record" style="padding: 5px; background-color: white; border: 1px solid gray; width: 300px; z-index: 999; position: absolute;">
    <li class="media sc-banlog">
      <div class="media-body">
        <div id="confession" class="justify-content-between text-muted">
        </div>
      </div>
    </li>
  </div>
  `).appendTo('body').hide();

  const $confession = $guiltyRecord.find('#confession');
  let currentUID = '';
  let record = '';

  $('img.avatar-3').mouseenter((ev) => {
    const $victim = $(ev.target);
    const uid = $victim.attr('uid');

    if (!uid) {
      return;
    }

    if (uid === currentUID) {
      if (record) {
        showGuiltyRecord($victim);
      }
      return;
    } else {
      currentUID = uid;
    }

    $.xpost('mod-ban_yy.htm', {uid: uid}, (code, msg) => {
      if (code === 0) {
        const confession = $.parseJSON(msg);
        record = '';

        for (let i = 0; i < confession.length; i++) {
          let showInfo = '';
          if (confession[i]['state_fmt'] === '解封') {
            showInfo = '系统 解封';
          } else {
            showInfo = `${confession[i]['admin_username']} ${confession[i]['state_fmt']} 原因: ${confession[i]['remark']}`;
          }
          record += `<p>${confession[i]['opt_date_fmt']} 被 ${showInfo}</p>`;
        }
        if (!record) {
          return;
        }
        $confession.empty().append(`${record}`);

        showGuiltyRecord($victim);
      }
    });
  }).mouseleave(() => {
    $guiltyRecord.hide();
  });

  function showGuiltyRecord($victim) {
    const offset = $victim.offset();
    $guiltyRecord.css({
      top: `${offset.top}px`,
      left: `${offset.left + $victim.outerWidth() + 5}px`
    });
    $guiltyRecord.show();
  }
})();