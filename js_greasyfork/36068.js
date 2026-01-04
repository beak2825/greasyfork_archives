// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         7 Cups - Block Noni
// @description  Noni chatlist filter and menu item
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @match        http://www.7cups.com/*
// @run-at       document-start
// @grant        none
// @version      2
// jshint        ignore: start
// @downloadURL https://update.greasyfork.org/scripts/36068/7%20Cups%20-%20Block%20Noni.user.js
// @updateURL https://update.greasyfork.org/scripts/36068/7%20Cups%20-%20Block%20Noni.meta.js
// ==/UserScript==
if (window == parent) {
    (new MutationObserver(function () {
        if (window.$) {
            var jqp = $.post
            $.post = function (url, success) {
                if (url == '/connect/checkConversations.php') return jqp({
                    url: url,
                    success: success,
                    dataType: 'json',
                    converters: {
                        "text json": function (text) {
                            var json = JSON.parse(text)
                            json.conlist = json.conlist.filter(conv => conv.convID != 'Noni')
                            return json
                            }
                        }
                    })
                else return jqp.apply($, arguments)
                }
            this.disconnect()
            }
        })).observe(document.head, {childList: true})

    addEventListener('DOMContentLoaded', function () {
        var a = $('a.dropdown-item[href*=conversation\\.php]')
        if (a.length) a.after(
            a.clone().attr('href', a.attr('href') + '?c=Noni').text('Chat with Noni')
            )
        })
    }
