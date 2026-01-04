// ==UserScript==
// @name         Mturk PandaPush
// @version      0.3
// @description  Mturk PandaPush; Pushbullet/Telegram for Panda Crazy
// @author       Skar3
// @include     https://worker.mturk.com/requesters/PandaPush/projects
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @require     https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js
// @require     https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/js/bootstrap.min.js
// @require     https://greasyfork.org/scripts/401969-pushbullet-js/code/pushbullet-js.js?version=797701
// @resource    BootstrapCSS          https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/541458
// @downloadURL https://update.greasyfork.org/scripts/401967/Mturk%20PandaPush.user.js
// @updateURL https://update.greasyfork.org/scripts/401967/Mturk%20PandaPush.meta.js
// ==/UserScript==


document.head.appendChild(cssElement(GM_getResourceURL ("BootstrapCSS")));
document.title = 'PandaPush';

function cssElement(url) {
    var link = document.createElement("link");
    link.href = url;
    link.rel="stylesheet";
    link.type="text/css";
    return link;
}


(function() {
    'use strict';

    function methodVisibility(value) {
        if (value == 0) {
            $("#telegram-group-1").hide();
            $("#telegram-group-2").hide();
            $("#pushbullet-group").show();
        }else {
            $("#pushbullet-group").hide();
            $("#telegram-group-1").show();
            $("#telegram-group-2").show();
        }
    }

    function initPage() {
        var pageHtml = '<header><nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">' +
            '<a class="navbar-brand" href="#">PandaPush</a>' +
            '</nav>' +
            '</header>' +
            '<main role="main" class="flex-shrink-0"><div class="container" style="padding-top: 60px;">'+
            '<div style="position: absolute; top: 65px; right: 10px;">' +
            '<div id="toast-success" class="toast" role="alert" aria-live="polite" aria-atomic="true" data-delay="10000">' +
                '<div class="toast-header">' +
                    '<strong class="mr-auto">Success!</strong>' +
                    '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                '</div>' +
                '<div class="toast-body">' +
                    'The settings have been saved.' +
                '</div>' +
            '</div>' +
            '</div>' +
            '<form>' +
            '<div class="form-group">' +
                '<label for="pushMethod">Method</label>' +
                '<select class="custom-select" id="pushMethodSelect">' +
                    '<option value="0" selected>Pusbullet</option>' +
                    '<option value="1">Telegram</option>' +
                '</select>' +
            '</div>' +
            '<div id="pushbullet-group" class="form-group">' +
                '<label for="pushbulletApi">Pushbullet API Key</label>' +
                '<input type="text" class="form-control" id="pushbulletApi">' +
            '</div>' +
            '<div id="telegram-group-1" class="form-group" style="display:none;">' +
                '<label for="telegramApi">Telegram Bot API Key</label>' +
                '<input type="text" class="form-control" id="telegramApi">' +
                '<small id="telegramApiHelp" class="form-text text-muted">Contact <a href="https://telegram.me/BotFather" target="_blank">@BotFather</a>, create a bot and get an API Key</small>' +
            '</div>' +
            '<div id="telegram-group-2" class="form-group" style="display:none;">' +
                '<label for="telegramChat">Telegram Chat ID</label>' +
                '<input type="text" class="form-control" id="telegramChat">' +
                '<small id="telegramChatHelp" class="form-text text-muted">Find your Telegram Chat ID and insert here, send a message to your bot and look <a href="https://pupli.net/2019/02/get-chat-id-from-telegram-bot/" target="_blank">here</a> (2,3,4)</small>' +
            '</div>' +
            '<div class="form-group">' +
                '<label for="enablePush">Enable</label>' +
                '<input type="checkbox" checked class="form-control" id="enablePush">' +
            '</div>' +
            '<a href="#" id="api-save" class="btn btn-primary">Save</button>' +
            '</form>' +
            '</div></main>';
        $("body").addClass('d-flex flex-column h-100');
        $("body").html(pageHtml);

        $("#api-save").on( "click", function() {
            localStorage.setItem("PANDAPUSH_api_key", $("#pushbulletApi").val());
            localStorage.setItem("PANDAPUSH_telegram_api_key", $("#telegramApi").val());
            localStorage.setItem("PANDAPUSH_telegram_chat_id", $("#telegramChat").val());
            localStorage.setItem("PANDAPUSH_method", $("#pushMethodSelect").val());
            $("#toast-success").toast('show');
        });

        $("#pushMethodSelect").on( "change", function() {
            methodVisibility($(this).val());
        });

        var key = localStorage.getItem("PANDAPUSH_api_key");
        if (key != null) {
            $("#pushbulletApi").val(key);
        }

        var t_key = localStorage.getItem("PANDAPUSH_telegram_api_key");
        if (t_key != null) {
            $("#telegramApi").val(t_key);
        }

        var t_chat = localStorage.getItem("PANDAPUSH_telegram_chat_id");
        if (t_chat != null) {
            $("#telegramChat").val(t_chat);
        }

        var push_method = localStorage.getItem("PANDAPUSH_method");
        if (push_method != null) {
            $("#pushMethodSelect").val(push_method);
            methodVisibility(push_method);
        }
    }

    var senthits = [];


    function sendPush(hit) {
        PushBullet.APIKey = $("#pushbulletApi").val();
        var pushBody = 'PAY: ' + hit.pay + "\r\nDURATION: " + hit.duration + "\r\n " + hit.description;
        PushBullet.push("link", null, null, {title: "ACCEPTED: " + hit.title, url: hit.continueURL, body: pushBody}, function(err, res) {
            if(err) {
                throw err;
            } else {
                console.log("Push sent");
            }
        });
    }

    function sendTelegramPush(hit) {
        var pushBody = '<b>ACCEPTED: ' + hit.title + '</b>\r\nPAY: ' + hit.pay + "\r\nDURATION: " + hit.duration + "\r\n" +
            hit.description + "\r\n<a href='" + hit.continueURL + "'>Continue Work</a>";

        var data = JSON.stringify({
            chat_id: $("#telegramChat").val(),
            text: pushBody,
            parse_mode: 'html',
        });


        GM_xmlhttpRequest ({
            method:     'POST',
            url:        "https://api.telegram.org/bot" + $("#telegramApi").val() + "/sendMessage",
            headers: {
                "Content-Type": "application/json",
                'Content-Length': data.length
            },
            data: data,
            onload:     function (responseDetails) {
                console.log("Push sent");
            }
        });
    }

    function getPandaQueue() {
        var queue = localStorage.getItem("JR_QUEUE_StoreData");
        if (queue != null) {
            queue = JSON.parse(queue);
            for (var i=0; i < queue.queue.length; i++) {
                var hit = queue.queue[i];
                if (senthits.indexOf(hit.assignmentId) == -1) {
                    if ($('#enablePush').is(":checked")) {
                        if ($("#pushMethodSelect").val() == 0) {
                            sendPush(hit);
                        }else {
                            sendTelegramPush(hit);
                        }
                        senthits.push(hit.assignmentId);
                    }
                }
            }
        }
    }

    setTimeout(function(){
    	console.log('PandPush loaded');
        initPage();
        setInterval(getPandaQueue, 1000);
    }, 1000);
})();

