// ==UserScript==
// @name         Fembed Helper
// @namespace    http://fembed.net/
// @version      1.2.2
// @description  Hello to fembed but Bye to Ads
// @author       Me
// @match        https://dash.fembed.net/*
// @downloadURL https://update.greasyfork.org/scripts/395774/Fembed%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/395774/Fembed%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('div[data-id]').each(function () {
        var dataId = $(this).attr("data-id");
        var buttons = $(this).find(".buttons").first();
        buttons.append(createNewButton(dataId));
    });

    $(document).on('click', '.modal-close, .modal-background, .btn-close', function() {
        $(this).closest('#tarojs-player').remove();
        $(this).closest('.modal').removeClass('is-active');
    });
})();

function createNewButton(dataId) {
    var btn = $("<button class=\"button is-small is-primary is-rounded\"></button>")
        .attr("data-id", dataId)
        .append('<span class="icon ioom"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M10,16.5V7.5L16,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"></path></svg></span>')
        .append('<span class="is-hidden-mobile">Play</span>');

    btn.click(function () {
        var self = $(this);
        var dataId = self.attr("data-id");
        self.addClass("is-loading");

        $.post('/video/scene', { csrf_token: tarojs.csrf, id: dataId }, function (res) {
            if (!res.success) {
                tarojs.showAlert(res.data);
                return false;
            }
            //console.log(res.data);
            showPlayer(res.data);
            self.removeClass("is-loading");
        });
    });

    return btn;
}

function showPlayer(url) {
    var html = '<div class="modal-background"></div>';
    html += '<div class="modal-card">';
    html += '<section class="modal-card-body">';
    html += '<p class = "image is-16by9">';
    html += '<video id="player" crossorigin controls><source type="video/mp4" src="' + url + '"></video>';
    html += '</p>';
    html += '<div class="buttons is-centered pt-1"><button class="button is-primary btn-close"><span class="icon"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"></path></svg></span><span>Close</span></button></div>';
    html += '</section>';
    html += '</div><button class="modal-close is-large"></button>';
    html += '</div>';
    if (!$("#tarojs-player").length) {
        $('body').append('<div class="modal is-active" id="tarojs-player">' + html + '</div>');
    } else {
        $('#tarojs-player').addClass('is-active').html(html);
    }
}