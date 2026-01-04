// ==UserScript==
// @name         Sentry fast delete
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  Add button to quickly delete all found issues
// @author       Cáno
// @match        https://sentry.getprintbox.com/hiddendata/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40935/Sentry%20fast%20delete.user.js
// @updateURL https://update.greasyfork.org/scripts/40935/Sentry%20fast%20delete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var delAllSafe = function() {
        document.querySelector('.chk-select-all').click();
        document.querySelector('.action-delete').click();
    };

    var delAll = function() {
        document.querySelector('.chk-select-all').click();
        document.querySelector('.action-delete').click();
        document.querySelector('.modal-footer .btn-primary').click();
        location.reload();
    };

    var delSelected = function() {
        document.querySelector('.action-delete').click();
        //document.querySelector('.modal-footer .btn-primary').click();
    };

    setInterval(function(){
        if (document.querySelector('.delete-all')) {
        } else if (document.querySelector('.stream-actions-left')) {
            var div = document.createElement('div');
            var html = `
<div class="btn-group">
<a class="btn btn-default btn-sm delete-selected"><span class="icon icon-trash" style="margin-right: 5px"></span>Delete selected
</a>
</div>
`;
            div.innerHTML = html.trim();
            div = div.firstChild;
            document.querySelector('.stream-actions-left').appendChild(div);
            document.querySelector('.delete-selected').onclick = delSelected;

            var div = document.createElement('div');
            var html = `
<div class="btn-group">
<a class="btn btn-default btn-sm delete-all-safe"><span class="icon icon-trash" style="margin-right: 5px"></span>Delete all
</a>
</div>
`;
            div.innerHTML = html.trim();
            div = div.firstChild;

            document.querySelector('.stream-actions-left').appendChild(div);
            document.querySelector('.delete-all-safe').onclick = delAllSafe;

            var div = document.createElement('div');
            var html = `
<div class="btn-group">
<a class="btn btn-default btn-sm delete-all"><span class="icon icon-trash" style="color: red; margin-right: 1px"></span></a>
</div>
`;
            div.innerHTML = html.trim();
            div = div.firstChild;

            document.querySelector('.stream-actions-left').appendChild(div);
            document.querySelector('.delete-all').onclick = delAll;
        }
    },1000);
})();