// ==UserScript==
// @name        LockD&DMail
// @namespace   Dreadcast
// @version     2.0.0
// @author      Odul, Isilin/Pelagia
// @match       https://www.dreadcast.net/Main
// @description Bloque le drag and drop sur la messagerie
// @license     https://github.com/Isilin/dreadcast-scripts?tab=GPL-3.0-1-ov-file
// @require     https://update.greasyfork.org/scripts/507382/Dreadcast%20Development%20Kit.user.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/520823/LockDDMail.user.js
// @updateURL https://update.greasyfork.org/scripts/520823/LockDDMail.meta.js
// ==/UserScript==

$(() => {
  const style = `
    #lock_message i.fa-lock-open {
      color: #999 !important;
    }

    #lock_message i.fa-lock {
      color: #a90f0f !important;
    }

    #lock_message {
      position: absolute;
      right: 0px;
      top: 5px;
      align-content: center;
    }

    #lock_message:has(i.fa-lock) {
      border: 1px solid #a90f0f;
    }

    #lock_message:has(i.fa-lock-open) {
      border: 1px solid #999;
    }
  `;

  const LOCK_TAG = 'dd_message_lock';

  let isLocked;

  const syncParams = () => {
    isLocked = DC.LocalMemory.get(LOCK_TAG);
  };

  const initPersistence = () => {
    DC.LocalMemory.init(LOCK_TAG, true);

    syncParams();
  };

  const loadUI = () => {
    MenuMessagerie.prototype.handleDrag = function () {
      $('#liste_messages .message:not(.ui-draggable)').draggable({
        cursorAt: {
          top: 0,
          left: -20,
        },
        helper: function () {
          var a = $('#liste_messages .content input:checked').length;
          return $(
            '<div id="dragged_msg"><span>' + (a ? a : '') + '</span></div>',
          );
        },
        start: function () {
          if ($('.fas', '#lock_message').hasClass('fa-lock-open'))
            return '-1' == $('#current_folder').attr('data-id')
              ? !1
              : (!$(this).hasClass('selected') &&
                  $('#liste_messages').length &&
                  nav.getMessagerie().messageUnselectAll(),
                void (
                  $('#folder_list:hidden').length &&
                  $('#liste_messages .folder_list').trigger('click')
                ));
        },
        stop: function () {
          if ($('.fas', '#lock_message').hasClass('fa-lock-open'))
            $('#liste_messages .folder_list').trigger('click');
        },
      });
    };

    $('#zone_messagerie').append(
      DC.UI.Button(
        'lock_message',
        isLocked
          ? '<i class="fas fa-lock" />'
          : '<i class="fas fa-lock-open" />',
        function () {
          if ($('.fas', this).hasClass('fa-lock')) {
            $('.fas', this).removeClass('fa-lock').addClass('fa-lock-open');
            DC.LocalMemory.set(LOCK_TAG, false);
          } else {
            $('.fas', this).removeClass('fa-lock-open').addClass('fa-lock');
            DC.LocalMemory.set(LOCK_TAG, true);
          }
        },
      ),
    );
  };

  $(document).ready(() => {
    initPersistence();

    loadUI();
    DC.Style.apply(style);
  });
});
