// ==UserScript==
// @name         Last.fm Bulk Delete Scrobbles
// @description  This script allows a bulk delete of Last.fm scrobbles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       xXMrJackXx
// @match        https://*.last.fm/user/*
// @exclude      https://*.last.fm/user/*/loved
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/370386/Lastfm%20Bulk%20Delete%20Scrobbles.user.js
// @updateURL https://update.greasyfork.org/scripts/370386/Lastfm%20Bulk%20Delete%20Scrobbles.meta.js
// ==/UserScript==

GM_addStyle(`
.batch-button {
  width: 100px;
  margin-right: 10px;
  border-radius: 6px;
  outline: none;
}
`);

const observer = new MutationObserver(() => $('.chartlist') && process());

// clear localStorage on first load
localStorage.clear();
process();
registerPJax();

function init() {
    var main = $(".col-main");
    var div = $("<div id='batchDeleteButtons'>");
    main.prepend(div);

    // add delete button
    var deleteButton = $('<input type="button" value="Delete" class="batch-button"/>');
    deleteButton.click(function() {
        $('table.chartlist').find('input:checked').each(function() {
            // find delete button and simulate a click of every checked checkbox
            var del = this.closest('tr').querySelector('[data-ajax-form-sets-state="deleted"]');
            del && del.click();
            // remove from localStorage
            localStorage.removeItem(this.id);
            // remove checkbox
            this.remove();
        });
    });
    div.prepend(deleteButton);

    // add check/uncheck all button
    var checkButton = $('<input type="button" value="Check all" data-type="check" class="batch-button"/>');
    checkButton.click(function() {
        var cbs = $(main).find('input.batch-checkbox');
        if($(this).attr('data-type') == 'check') {
            $(this).attr('data-type', 'uncheck');
            $(this).val('Uncheck all');
            cbs.prop('checked', true);
            // add every checkbox id to the localStorage
            cbs.each(function() {
                localStorage.setItem(this.id, this.id);
            });
        } else {
            $(this).attr('data-type', 'check');
            $(this).val('Check all');
            cbs.prop('checked', false);
            // remove every checkbox id from the localStorage
            cbs.each(function() {
                localStorage.removeItem(this.id);
            });
        }
    });
    div.prepend(checkButton);
}

function process() {
    observer.disconnect();

    // add checkboxes for every not already deleted entries
    $('tr[data-ajax-form-state!="deleted"] .chartlist-play').each(function() {
        var track = $(this).siblings('.chartlist-name').find('a.link-block-target').attr('title');
        var timestamp = $(this).siblings('.chartlist-timestamp').find('span[title]').attr('title');
        if (track != undefined && timestamp != undefined) {
            // combination of timestamp and track title should be unique
            var id = normalizeString(timestamp + track);
            var cb = $('<input type="checkbox" class="batch-checkbox" id="' + id + '"/>');
            cb.click(function() {
                if (this.checked) {
                    // add checkbox id to localStorage
                    localStorage.setItem(id, id);
                }
                else {
                    // remove checkbox id from localStorage
                    localStorage.removeItem(id);
                }
            });
            // add checkbox as new first column
            $('<td style="width: 50px;"/>').append(cb).insertBefore($(this));
        }
    });

    // reload localStorage items
    var keys = Object.keys(localStorage), i = keys.length;
    while (i--) {
        // check every checkbox that is contained in the localStorage
        var id = keys[i];
        var cb = $('#' + id);
        if (cb.length) {
            cb.prop('checked', true);
        }
    }

    if ($('.chartlist tbody').length) {
        observer.takeRecords();
        observer.observe($('.chartlist tbody')[0], {childList: true});

        // add buttons only if not already present
        if ($('#batchDeleteButtons').length == 0) {
            init();
        }
    }
}

function registerPJax() {
    document.addEventListener('pjax:end:batch-delete', process);
    window.addEventListener('load', function onLoad() {
        window.removeEventListener('load', onLoad);
        unsafeWindow.jQuery(unsafeWindow.document).on('pjax:end', exportFunction(() => document.dispatchEvent(new CustomEvent('pjax:end:batch-delete')), unsafeWindow));
    });
}

function normalizeString(str) {
    return str.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-')
}
