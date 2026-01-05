// ==UserScript==
// @name         Findthisplace.org
// @namespace    dirty.ru
// @version      2.009
// @description  Findthisplace.org helper
// @author       Anton
// @match        *findthisplace.d3.ru/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26917/Findthisplaceorg.user.js
// @updateURL https://update.greasyfork.org/scripts/26917/Findthisplaceorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (console) console.log('Hello, Findthisplace');
    
    var _getPostId = function() {
        return unsafeWindow.entryStorages[unsafeWindow.pageName].post.id;
    };

    var _onButtonClick = function() {
        var $refreshButton = $(this);
        var url = 'https://findthisplace.org/refresh/' + _getPostId();
        if (console) console.log('Findthisplace: ' + url);
        $refreshButton.text('подождите...');
        $.ajax({
            url: url,
            cache: false,
            success: function(data) {
                $refreshButton.text('Обновить ответившего');
                if (typeof data === 'object') {
                    if (data.responseCode === 0) {
                        alert('Обновлено. Ответил: ' + data.solverAfter);
                    } else {
                        alert('НЕ обновлено. Ошибка сервера: ' + data.responseDescription);
                    }
                }
            },
            error: function (x, code, err) {
                if (console) console.log('Ошибка запроса код ' + code + ': ' + err);
                $refreshButton.text('Обновить ответившего');
                alert('НЕ обновлено. Ошибка браузера код ' + code +': ' + err);
            }
        });
    };

    var _addButton = function() {
        if ($('span[data-post-id]').length === 0) {
            if (console) console.log('Findthisplace: appending button');
            var $sidebarContainer = $('section.b-sidebar__item[data-uid=info]');
            if ($sidebarContainer && $sidebarContainer.length > 0) {
                var $refreshButton = $('<span class="b-button b-button_size_m b-button_mode_default b-button_color_blue b-button_icon_true b-button_empty_false b-button_disabled_false s-header__post-editor-button" style="cursor:pointer">Обновить ответившего</span>');
                $refreshButton.attr('data-post-id', _getPostId());
                $sidebarContainer.append($refreshButton);
                $refreshButton.on("click", _onButtonClick);
            }
        }
    }

    setTimeout(function() {
        setInterval(function() {
            _addButton();
        }, 1000);
    }, 2000);
})();