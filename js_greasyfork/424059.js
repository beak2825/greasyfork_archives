// ==UserScript==
// @name         DiscordEmoji EmojiAdder
// @namespace    https://cirno.pw
// @version      0.1
// @description  Adds a button that will automatically add emoji to your servers for you from DiscordEmoji.com.
// @author       ExtraConcentratedJuice
// @license      MIT
// @match        https://discordemoji.com/category/*
// @match        https://discordemoji.com/search.php
// @match        https://discordemoji.com/
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/jquery.initialize@1.2.0/jquery.initialize.min.js
// @downloadURL https://update.greasyfork.org/scripts/424059/DiscordEmoji%20EmojiAdder.user.js
// @updateURL https://update.greasyfork.org/scripts/424059/DiscordEmoji%20EmojiAdder.meta.js
// ==/UserScript==

(function()
{
    'use strict';

    const TOKEN_KEY = 'emojiadder_token';
    const GUILD_KEY = 'emojiadder_guild';
    var count = 0;

    function toast(title, message)
    {
        iziToast.show({
            class: 'dark-toast',
            theme: 'dark',
            progressBar: false,
            title: title,
            message: message,
            position: 'bottomCenter'
        });
    }

    function addButton()
    {
        $('div.meta > div.float-right').each(function(index)
        {
            if (!$(this).find('.fa-plus-circle').length)
            {
                let name = $(this).closest('.emoji-card').find('.card-img-top').find('img').attr('alt');

                let url = $(this).parent().find('.download').attr('href');
                $(this).append('&nbsp; <a id="addButton' + count + '"><i class="fas fa-plus-circle" style="cursor: pointer; color: #52bd8c;" data-url="' + url+ '" data-name="' + name + '"></i></a>');

                $('#addButton' + count).click(function()
                {
                    console.log('xd');
                    toast('Alert', 'Preparing to add :' + name + ': to your server...');
                    getBase64FromImage(url, function(data, size)
                    {
                        size = size * 0.0009765625;
                        if (size > 256)
                        {
                            toast('Emoji Too Large', 'The emoji :' + name + ': is over 256kb. Discord\'s max emoji size is 256kb. Go bother Kohai (DiscordEmoji developer) to fix it.')
                            return;
                        }
                        let xhr = new XMLHttpRequest();
                        xhr.open('POST', 'https://canary.discordapp.com/api/v6/guilds/' + GM_getValue(GUILD_KEY, '') + '/emojis');
                        xhr.setRequestHeader('Authorization', GM_getValue(TOKEN_KEY, ''));
                        xhr.setRequestHeader('Content-Type', 'application/json');

                        xhr.onreadystatechange = function()
                        {
                            if (xhr.readyState == XMLHttpRequest.DONE)
                            {
                                let respCode = xhr.status;
                                let resp = JSON.parse(xhr.responseText);

                                switch(respCode)
                                {
                                    case 400:
                                        toast('400 Bad Request', 'The emoji failed to submit to Discord. ' + (resp.message || 'Unspecified error.'));
                                        break;
                                    case 401:
                                        toast('401 Unauthorized', 'You are not logged in. Click the cog on the bottom right corner to configure this extension.');
                                        break;
                                    case 403:
                                        toast('403 Forbidden', 'You are not authorized to submit emojis to this guild. Check your token, check your guild ID. Click the cog icon on the bottom right.');
                                        break;
                                    case 429:
                                        toast('429 Ratelimited', 'Discord has ratelimited you from uploading emojis. Try again later.');
                                        break;
                                    case 201:
                                        toast('Success', 'Successfully added :' + name + ': to your server!');
                                        break;
                                    default:
                                        toast('Unexpected Error', 'An unexpected status code was received from Discord. Whatever it is, it probably isn\'t good. Try again, I guess.');
                                        break;
                                }
                            }
                        }
                        xhr.send(JSON.stringify(
                            {
                                'name': name,
                                'image': data
                            }
                        ));
                    });
                });

                count++;
            }
        });
    }

    function getBase64FromImage(url, callback)
    {
        let xhr = new XMLHttpRequest();
        xhr.onload = function()
        {
            let reader = new FileReader();
            let size = xhr.getResponseHeader('content-length');
            reader.onloadend = function()
            {
                callback(reader.result, size);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    function configure()
    {
        let token = prompt('Enter your Discord user token. Don\'t know how to get it?\nhttps://github.com/TheRacingLion/Discord-SelfBot/wiki/Discord-Token-Tutorial', GM_getValue(TOKEN_KEY, ''));
        let guild = prompt('Enter the Guild ID of your server. Don\'t know how to get it?\nhttps://support.discordapp.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-', GM_getValue(GUILD_KEY, ''));
        GM_setValue(TOKEN_KEY, token);
        GM_setValue(GUILD_KEY, guild);
        alert('Set your token to: ' + token + '\nSet your guild ID to: ' + guild);
    }
    $(document).ready( function() {
        $('body').append('<button id="emojiAdderConfigure" class="btn" style="position: fixed; bottom: 5px; right: 5px;"><i class="fas fa-cog"></i></button>');
        $('#emojiAdderConfigure').click(configure);
        $.initialize('.emoji-card', addButton);
});
})();
