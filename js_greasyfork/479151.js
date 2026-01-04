// ==UserScript==
// @name         codespam helper
// @namespace    http://tampermonkey.net/
// @version      Alpha-v6
// @description  change klu or bruteforce to true depending on which one you want to do
// @author       jasontime12345
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chrome.com
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479151/codespam%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/479151/codespam%20helper.meta.js
// ==/UserScript==

// @ts-check
/// <reference path="./types.d.ts" />

window.addEventListener('load', function() {
    (function() {
        'use strict';
        // FILL IN THE FOLLOWING VARIABLES AS NEEDED

        // In browser discord, press CTRL+SHIFT+I
        // Navigate to Network on the top bar
        // Then send a message and you should see a "messages" pop up in Name
        // Click that, scroll down to Request Headers, and copy the code to the right of Authorization and paste it into authHeader
        // An example authHeader below is provided. DO NOT SHARE THIS VALUE!
        var authHeader = 'ABCdEfG0HIJ1Klm2NIopQRS3TU.VWXYZa.Bcd4e5FGhIjkLmnoP6qRST-uVwX7yzAbCdeFGH'

        //true or false
        var klu = true
        var over_night_klu = true // change this if you want it to run overnight or not


        var bruteForce = false

        // name of character (capitalization does not matter)
        var charName = ''

        // THESE ARE ONLY NECESSARY FOR DOING KLU SPAM
        var numAlreadyClaimed = 0 // works for any drop number not just SP anymore

        // THESE ARE ONLY NECESSARY FOR DOING BRUTEFORCE
        var root = 'v26' // the characters before the major branch
        var majorBranch = 'm'



        // ONCE YOU FINISH, SAVE BY PRESSING CTRL + S AND RELOAD YOUR BROWSER DISCORD (make sure you are focused on the channel you want to userbot in before reloading)




        // YOU CAN JUST CLOSE THE BLOCK RIGHT BELOW BY CLICKING ON THE TRIANGLE TO THE RIGHT OF THE LINE NUMBER
        {
            var gid = '' // Current guild id
            var cid = '' // Current channel id
            var autoUpdateToken = true // Should the token be updated automatically when a request with the token is intercepted?

            // Call this to update `cid` and `gid` to current channel and guild id
            var update_guildId_and_channelId_withCurrentlyVisible = (log = true) => {
                gid = window.location.href.split('/').slice(4)[0]
                cid = window.location.href.split('/').slice(4)[1]
                if (log) {
                    console.log(`\`gid\` was set to the guild id you are currently looking at (${gid})`)
                    console.log(`\`cid\` was set to the channel id you are currently looking at (${cid})`)
                }
            }
            var id = update_guildId_and_channelId_withCurrentlyVisible

            /** @type {import('./types').api['delay']} */
            var delay = ms => new Promise(res => setTimeout(res, ms))
            // prettier-ignore
            var qs = obj => Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('&')


            /** @type {import('./types').api['apiCall']} */
            var apiCall = (apiPath, body, method = 'GET', options = {}) => {
                // if (!authHeader) throw new Error("The authorization token is missing. Did you forget to set it? `authHeader = 'your_token'`")

                // @ts-ignore
                if (!authHeader) {
                    if (!XMLHttpRequest_setRequestHeader) {
                        var XMLHttpRequest_setRequestHeader = XMLHttpRequest.prototype.setRequestHeader
                        }

                    // Auto update the authHeader when a request with the token is intercepted
                    XMLHttpRequest.prototype.setRequestHeader = function () {
                        if (autoUpdateToken && arguments[0] === 'Authorization' && authHeader !== arguments[1]) {
                            authHeader = arguments[1]
                            console.log(`Updated the Auth token! <${authHeader.slice(0, 30)}...>`)
                        }
                        XMLHttpRequest_setRequestHeader.apply(this, arguments)
                    }
                }

                const fetchOptions = {
                    body: body ? body : undefined,
                    method,
                    headers: {
                        Accept: '*/*',
                        'Accept-Language': 'en-US',
                        Authorization: authHeader,
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9015 Chrome/108.0.5359.215 Electron/22.3.12 Safari/537.36',
                        'X-Super-Properties': btoa(
                            JSON.stringify({
                                os: 'Windows',
                                browser: 'Discord Client',
                                release_channel: 'stable',
                                client_version: '1.0.9015',
                                os_version: '10.0.22621',
                                os_arch: 'x64',
                                system_locale: 'en-US',
                                browser_user_agent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) discord/1.0.9015 Chrome/108.0.5359.215 Electron/22.3.12 Safari/537.36',
                                browser_version: '22.3.12',
                                client_build_number: 216385,
                                native_build_number: 34898,
                                client_event_source: null,
                            }),
                        ),
                    },
                    ...options,
                }
                const isFormData = body?.constructor?.name === 'FormData'
                if (!isFormData) {
                    fetchOptions.headers['Content-Type'] = 'application/json'
                    fetchOptions.body = JSON.stringify(body)
                }
                return fetch(`https://discord.com/api/v9${apiPath}`, fetchOptions)
                    .then(res => res.json().catch(() => {}))
                    .catch(console.error)
            }


            /** @type {import('./types').api} */
            var api = {
                getMessages: (channelOrThreadId, limit = 100, params = {}) => apiCall(`/channels/${channelOrThreadId}/messages?limit=${limit ?? 100}&${qs(params)}`),
                sendMessage: (channelOrThreadId, message, tts, body = {}) => apiCall(`/channels/${channelOrThreadId}/messages`, { content: message, tts: !!tts, ...body }, 'POST'),
                replyToMessage: (channelOrThreadId, repliedMessageId, message, tts, body = {}) =>
                apiCall(`/channels/${channelOrThreadId}/messages`, { content: message, message_reference: { message_id: repliedMessageId }, tts: !!tts, ...body }, 'POST'),
                editMessage: (channelOrThreadId, messageId, newMessage, body = {}) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}`, { content: newMessage, ...body }, 'PATCH'),
                deleteMessage: (channelOrThreadId, messageId) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}`, null, 'DELETE'),

                createThread: (channelId, toOpenThreadInmessageId, name, autoArchiveDuration = 1440, body = {}) =>
                apiCall(`/channels/${channelId}/messages/${toOpenThreadInmessageId}/threads`, { name, auto_archive_duration: autoArchiveDuration, location: 'Message', type: 11, ...body }, 'POST'),
                createThreadWithoutMessage: (channelId, name, autoArchiveDuration = 1440, body = {}) =>
                apiCall(`/channels/${channelId}/threads`, { name, auto_archive_duration: autoArchiveDuration, location: 'Message', type: 11, ...body }, 'POST'),
                deleteThread: threadId => apiCall(`/channels/${threadId}`, null, 'DELETE'),

                // Use this generator: https://discord.club/dashboard
                // Click `+` at the bottom in the embed section then copy the `embed` key in the JSON output.
                // Does not work with user account anymore!
                sendEmbed: (channelOrThreadId, embed = { title: 'Title', description: 'Description' }) => apiCall(`/channels/${channelOrThreadId}/messages`, { embed }, 'POST'),

                getRoles: guildId => apiCall(`/guilds/${guildId}/roles`),
                createRole: (guildId, name) => apiCall(`/guilds/${guildId}/roles`, { name }, 'POST'),
                deleteRole: (guildId, roleId) => apiCall(`/guilds/${guildId}/roles/${roleId}`, null, 'DELETE'),

                getBans: guildId => apiCall(`/guilds/${guildId}/bans`),
                banUser: (guildId, userId, reason) => apiCall(`/guilds/${guildId}/bans/${userId}`, { delete_message_days: '7', reason }, 'PUT'),
                unbanUser: (guildId, userId) => apiCall(`/guilds/${guildId}/bans/${userId}`, null, 'DELETE'),
                kickUser: (guildId, userId) => apiCall(`/guilds/${guildId}/members/${userId}`, null, 'DELETE'),

                addRole: (guildId, userId, roleId) => apiCall(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, null, 'PUT'),
                removeRole: (guildId, userId, roleId) => apiCall(`/guilds/${guildId}/members/${userId}/roles/${roleId}`, null, 'DELETE'),

                auditLogs: guildId => apiCall(`/guilds/${guildId}/audit-logs`),

                getChannels: guildId => apiCall(`/guilds/${guildId}/channels`),
                createChannel: (guildId, name, type) => apiCall(`/guilds/${guildId}/channels`, { name, type }, 'POST'),
                deleteChannel: channelId => apiCall(`/channels/${channelId}`, null, 'DELETE'),
                getChannel: channelOrThreadId => apiCall(`/channels/${channelOrThreadId}`),

                pinnedMessages: channelId => apiCall(`/channels/${channelId}/pins`),
                addPin: (channelId, messageId) => apiCall(`/channels/${channelId}/pins/${messageId}`, null, 'PUT'),
                deletePin: (channelId, messageId) => apiCall(`/channels/${channelId}/pins/${messageId}`, null, 'DELETE'),

                listEmojis: guildId => apiCall(`/guilds/${guildId}/emojis`),
                getEmoji: (guildId, emojiId) => apiCall(`/guilds/${guildId}/emojis/${emojiId}`),
                createEmoji: (guildId, name, image, roles) => apiCall(`/guilds/${guildId}`, { name, image, roles }, 'POST'),
                editEmoji: (guildId, emojiId, name, roles) => apiCall(`/guilds/${guildId}/${emojiId}`, { name, roles }, 'PATCH'),
                deleteEmoji: (guildId, emojiId) => apiCall(`/guilds/${guildId}/${emojiId}`, null, 'DELETE'),

                searchSlashCommand: (channelOrThreadId, search) => apiCall(`/channels/${channelOrThreadId}/application-commands/search?type=1&query=${search}&limit=25&include_applications=true`),
                sendSlashCommand: (guildId, channelOrThreadId, command, commandOptions = []) => {
                    const formData = new FormData()
                    formData.append(
                        'payload_json',
                        JSON.stringify({
                            type: 2,
                            application_id: command.application_id,
                            guild_id: guildId,
                            channel_id: channelOrThreadId,
                            session_id: 'requiredButUnchecked',
                            nonce: Math.floor(Math.random() * 1000000) + '',
                            data: {
                                ...command,
                                options: commandOptions,
                                application_command: {
                                    ...command,
                                },
                            },
                        }),
                    )
                    return apiCall('/interactions', formData, 'POST')
                },

                changeNick: (guildId, nick) => apiCall(`/guilds/${guildId}/members/@me/nick`, { nick }, 'PATCH'),
                leaveServer: guildId => apiCall(`/users/@me/guilds/${guildId}`, null, 'DELETE'),

                getServers: () => apiCall(`/users/@me/guilds`),
                getGuilds: () => apiCall(`/users/@me/guilds`),
                listCurrentUserGuilds: () => apiCall('/users/@me/guilds'),

                getDMs: () => apiCall(`/users/@me/channels`),
                getUser: userId => apiCall(`/users/${userId}`),

                getDirectFriendInviteLinks: () => apiCall(`/users/@me/invites`),
                createDirectFriendInviteLink: () => apiCall(`/users/@me/invites`, null, 'POST'),
                deleteDirectFriendInviteLinks: () => apiCall(`/users/@me/invites`, null, 'DELETE'),

                getCurrentUser: () => apiCall('/users/@me'),
                editCurrentUser: (username, bio, body = {}) => apiCall('/users/@me', { username: username ?? undefined, bio: bio ?? undefined, ...body }, 'PATCH'),

                setCustomStatus: (emojiId, emojiName, expiresAt, text) =>
                apiCall(`/users/@me/settings`, { custom_status: { emoji_id: emojiId, emoji_name: emojiName, expires_at: expiresAt, text: text } }, 'PATCH'),
                deleteCustomStatus: () => apiCall(`/users/@me/settings`, { custom_status: { expires_at: new Date().toJSON() } }, 'PATCH'),

                listReactions: (channelOrThreadId, messageId, emojiUrl) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}/reactions/${emojiUrl}/@me`),
                addReaction: (channelOrThreadId, messageId, emojiUrl) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}/reactions/${emojiUrl}/@me`, null, 'PUT'),
                deleteReaction: (channelOrThreadId, messageId, emojiUrl) => apiCall(`/channels/${channelOrThreadId}/messages/${messageId}/reactions/${emojiUrl}/@me`, null, 'DELETE'),

                typing: channelOrThreadId => apiCall(`/channels/${channelOrThreadId}/typing`, null, 'POST'),

                delay,
                apiCall,
                id,
                update_guildId_and_channelId_withCurrentlyVisible,
                getConfig: () => Object.freeze({ authHeader, autoUpdateToken, guildId: gid, channelId: cid, gid, cid }),
                setConfigAuthHeader: token => (authHeader = token),
                setConfigAutoUpdateToken: bool => (autoUpdateToken = bool),
                setConfigGid: id => (gid = id),
                setConfigGuildId: id => (gid = id),
                setConfigCid: id => (cid = id),
                setConfigChannelId: id => (cid = id),
            }

            console.log('\n\n\n\nSelfbot loaded! Use it like this: `await api.someFunction()`')
            console.log('Abusing this could get you banned from Discord, use at your own risk!')
            console.log()
            console.log(
                'This script does **not** work with bot accounts! ' +
                'If you have a bot account, use Node.js (or a proper lib like discord.js!) with the modified script ' +
                'https://github.com/rigwild/discord-self-bot-console/discussions/4#discussioncomment-1438231',
            )
            console.log()
            console.log('Use the `id()` function to update the variable `gid` guild id and `cid` channel id to what you are currently watching.')
            console.log('https://github.com/rigwild/discord-self-bot-console')

            id(false)

            // Do not replace configuration when reusing script in same context
            // @ts-ignore

            if (!module) {
                // Allow pasting this script in the console
                // @ts-ignore
                var module = {}
                }
            module.exports = { api, id, delay, update_guildId_and_channelId_withCurrentlyVisible }






            // my code below








            function charFound(user, message) {
                if (message.type == 19 && message.embeds.length == 1 && message.referenced_message.author.id==user.id) {
                    let msgContent = message.embeds[0].description
                    if (msgContent.toLowerCase().indexOf(charName) != -1) {
                        return true
                    }
                }
                return false
            }

            charName = charName.toLowerCase()

            if (bruteForce) {
                ;(async () => {
                    const user = await api.getCurrentUser()

                    api.update_guildId_and_channelId_withCurrentlyVisible()
                    let channelId = api.getConfig().channelId

                    // kci kv kwi
                    let orderArr = "mv0qh2wk5bjn1z4pr3g9fl8t7dsx6c".split("")
                    let comboArr = [] // this will be the unique combos of the minor branch + 2 leaves, will be 27000 long
                    for (let minorBranch = 0; minorBranch < orderArr.length; minorBranch++) {
                        for (let leaf1 = 0; leaf1 < orderArr.length; leaf1++) {
                            for (let leaf2 = 0; leaf2 < orderArr.length; leaf2++) {
                                comboArr.push(orderArr[minorBranch] + orderArr[leaf1] + orderArr[leaf2])
                            }
                        }
                    }

                    let rootExtend = root + majorBranch
                    for (let i = 0; i < comboArr.length; i+=30) {
                        await api.sendMessage(channelId, `kwi ` + rootExtend + comboArr[i])
                        await api.delay(3366)
                        await api.sendMessage(channelId, `kv ` + rootExtend + comboArr[i+10])
                        await api.delay(3366)
                        await api.sendMessage(channelId, `kci ` + rootExtend + comboArr[i+20])
                        await api.delay(3366)
                    }
                })()
            }

            if (klu) {
                ;(async () => {
                    var user = await api.getCurrentUser()

                    api.update_guildId_and_channelId_withCurrentlyVisible()
                    let channelId = api.getConfig().channelId

                    let found = false
                    while (!found) {
                        await api.sendMessage(channelId, `klu ` + charName)
                        let message = ``
                        let time = ``
                        let delay = 0;
                        for (let i = 0; i < 10; i++) {
                            await api.delay(100)
                            delay += 100
                            let messages = await api.getMessages(channelId, 1)
                            let curr = messages[0]
                            if (curr.type == 19 && curr.embeds.length == 1 && curr.referenced_message.author.id==user.id) {
                                message = curr.embeds[0].description
                                time = curr.timestamp
                                break
                            }
                        }
                        if (message != ``) {
                            let start = message.indexOf("Total claimed")
                            if (start != -1) {
                                let from_start = message.substring(start + 18)
                                let end = from_start.indexOf("*")
                                if (parseInt(message.substring(start + 18, start + 18 + end)) > numAlreadyClaimed) {
                                    await api.sendMessage(channelId, `@everyone ` + charName + ` print ` + (numAlreadyClaimed + 1) + ` dropped, ± 10 seconds at time: <t:` + Math.floor(new Date(time).getTime() / 1000) + `:T>`)
                                    await api.sendMessage("1170995084884443198", charName + ` print ` + (numAlreadyClaimed + 1) + ` dropped, ± 10 seconds at time: <t:` + Math.floor(new Date(time).getTime() / 1000) + `:T>`)
                                    if (over_night_klu) {
                                        numAlreadyClaimed = parseInt(message.substring(start + 18, start + 18 + end))
                                    } else {
                                        break
                                    }
                                }
                            }
                        }
                        await api.delay(10100-delay)
                    }
                })()
            }
        }
    })();
}, false);



