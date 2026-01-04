// ==UserScript==
// @name         PAWS - Faction Bank Request
// @namespace    https://www.tornpaws.uk
// @version      1.5.1
// @description  To request money from faction bank.
// @author       lonerider543
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/407355/PAWS%20-%20Faction%20Bank%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/407355/PAWS%20-%20Faction%20Bank%20Request.meta.js
// ==/UserScript==

const targetNode = document.getElementById('header-root')
const config = { attributes: true, childList: true, subtree: true };

var execute = true;

Number.prototype.format_thousand_seperator = function(n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

const replaceAll = (string, search, replace) => {
    return string.split(search).join(replace);
  }

const callback = function(mutationsList, observer) {
    if (!execute) return;
    add_request()
};

function add_request() {
    execute = false;

    $('ul.settings-menu')
    .append('<li class="server-info" id="faction-req-wrap" style="text-shadow: none; background-color: #f2f2f2; color: #333; padding: 5px; width: auto"><span style="margin: 5px 0; padding: 5px">Request Faction Money</span><div class="input-money-group" id="faction-req-group"><input type="text" class="input-money" id="faction-req-v" style="width: 120px; border-radius: 5px; margin: 2px 0 5px 0"><input type="hidden" class="input-money" id="faction-req-h"></div><br><span class="btn-wrap silver" style="padding: 0"><span class="btn"><input type="submit" class="torn-btn disabled" value="REQUEST" id="faction-req-btn" style="width: auto; height: auto"></span></span></li>')

    var request_enabled = false;

    $('input#faction-req-v').on('input', function() {
        var value = replaceAll($('input#faction-req-v').val(), /[,]/, '');
        var dot_index, zero_repeat, formatted;

        if (/^[0-9]+$/.test(value)) {
            formatted = parseInt(value).format_thousand_seperator();
            $('div#faction-req-group').attr("class", "input-money-group success");
            $('input#faction-req-v').val(formatted);
            $('input#faction-req-h').attr("value", value);

            $('input#faction-req-btn').attr("class", "torn-btn");
            request_enabled = true;

        } else if (value == '') {
            $('div#faction-req-group').attr("class", "input-money-group");
            $('input#faction-req-h').attr("value", '');

            $('input#faction-req-btn').attr("class", "torn-btn disabled");
            request_enabled = false;

        } else if (/^[0-9]+$/.test(value.substring(0, value.length-1)) && /[bkm]/.test(value.substring(value.length-1))) {
            if (value[value.length-1] == 'k') {
                value = value.substring(0, value.length-1) + '000';
            } else if (value[value.length-1] == 'm') {
                value = value.substring(0, value.length-1) + '000000';
            } else if (value[value.length-1] == 'b') {
                value = value.substring(0, value.length-1) + '000000000';
            }

            formatted = parseInt(value).format_thousand_seperator();
            $('div#faction-req-group').attr("class", "input-money-group success");
            $('input#faction-req-v').val(formatted);
            $('input#faction-req-h').attr("value", value);

            $('input#faction-req-btn').attr("class", "torn-btn");
            request_enabled = true;

        } else if (/^[0-9]+[.][0-9]{1,3}[k]$/.test(value)) {
            dot_index = value.indexOf('.');
            zero_repeat = 5 - (value.length - dot_index);

            value = value.replace('.', '');
            value = value.substring(0, value.length-1) + '0'.repeat(zero_repeat);

            formatted = parseInt(value).format_thousand_seperator();
            $('div#faction-req-group').attr("class", "input-money-group success");
            $('input#faction-req-v').val(formatted);
            $('input#faction-req-h').attr("value", value);

            $('input#faction-req-btn').attr("class", "torn-btn");
            request_enabled = true;

        } else if (/^[0-9]+[.][0-9]{1,6}[m]$/.test(value)) {
            dot_index = value.indexOf('.');
            zero_repeat = 8 - (value.length - dot_index);

            value = value.replace('.', '');
            value = value.substring(0, value.length-1) + '0'.repeat(zero_repeat);

            formatted = parseInt(value).format_thousand_seperator();
            $('div#faction-req-group').attr("class", "input-money-group success");
            $('input#faction-req-v').val(formatted);
            $('input#faction-req-h').attr("value", value);

            $('input#faction-req-btn').attr("class", "torn-btn");
            request_enabled = true;

        } else if (/^[0-9]+[.][0-9]{1,9}[b]$/.test(value)) {
            dot_index = value.indexOf('.');
            zero_repeat = 11 - (value.length - dot_index);

            value = value.replace('.', '');
            value = value.substring(0, value.length-1) + '0'.repeat(zero_repeat);

            formatted = parseInt(value).format_thousand_seperator();
            $('div#faction-req-group').attr("class", "input-money-group success");
            $('input#faction-req-v').val(formatted);
            $('input#faction-req-h').attr("value", value);

            $('input#faction-req-btn').attr("class", "torn-btn");
            request_enabled = true;

        } else {
            $('div#faction-req-group').attr("class", "input-money-group error");
            $('input#faction-req-v').val(value);
            $('input#faction-req-h').attr("value", replaceAll(value, /[^0-9]/, ''));

            $('input#faction-req-btn').attr("class", "torn-btn disabled");
            request_enabled = false;
        }
    })

    $('input#faction-req-btn').on('click', function() {
        if (request_enabled) {
            var chatData = JSON.parse($('div#websocketConnectionData').text());
            var user_name = chatData['playername'];
            var user_id = chatData['userID'];
            var amount = $('input#faction-req-h').val();

            request_enabled = false;
            $('input#faction-req-btn').attr("class", "torn-btn disabled");

            var key = replaceAll(user_name, /[0-9-_]/, '');
            var secret = 'LwHhOCXBziayVKqZIhQa';
            var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
            var token = '';

            for (var i = 0; i < secret.length; i++)
            {
                let index = i % key.length;
                let index_char = key[index];
                let secret_char = secret[i];

                let crypt_index = alphabet.indexOf(index_char);
                let secret_index = alphabet.indexOf(secret_char);

                let encrypt_index = (crypt_index + secret_index) % alphabet.length;
                let encrypt_char = alphabet[encrypt_index];

                token += encrypt_char;
            }

            var req_data = {
                'user_name': user_name,
                'user_id': user_id,
                'amount': amount,
                'token': token
            }

            GM_xmlhttpRequest({
                method: "POST",
                url: 'https://www.tornpaws.uk/bankreq/',
                headers: {
                    'content-type': 'application/json'
                },
                data: JSON.stringify(req_data),
                onload: (response) => {
                    console.log(response);
                    var response_data = JSON.parse(response.responseText);
                    if (response_data['success'] == 'true') {
                        $('div#faction-req-response').remove();
                        $('li#faction-req-wrap')
                        .append(`<div id="faction-req-response" style="color: #007800; margin: 5px 0 0 0">${response_data['message']}</div>`);
                        $('input#faction-req-v').val("");
                        $('input#faction-req-h').attr("value", '');
                        $('div#faction-req-group').attr("class", "input-money-group");
                    } else {
                        $('div#faction-req-response').remove();
                        $('li#faction-req-wrap')
                        .append(`<div id="faction-req-response" style="color: #780000; margin: 5px 0 0 0">${response_data['message']}</div>`);
                    }
                    request_enabled = true;
                    $('input#faction-req-btn').attr("class", "torn-btn");
                }
            });
        }
    })
}

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);