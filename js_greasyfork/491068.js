// ==UserScript==
// @name         Discord Auth Scope and Permission Purger
// @namespace    http://github.com/Bluscream
// @version      1.0
// @description Combines functionality to purge bot permissions and purge "guilds.join" user auth scope
// @author       Bluscream, phind.com
// @match        *://discord.com/oauth2/authorize?*permissions=*
// @match        *://discord.com/oauth2/authorize?*scope=*
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/491068/Discord%20Auth%20Scope%20and%20Permission%20Purger.user.js
// @updateURL https://update.greasyfork.org/scripts/491068/Discord%20Auth%20Scope%20and%20Permission%20Purger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const permissionFlags = [
        { id: 0, flag: 1 << 0, description: "Create Instant Invite", channelType: "T, V, S" },
        { id: 1, flag: 1 << 1, description: "Kick Members", channelType: "" },
        { id: 2, flag: 1 << 2, description: "Ban Members", channelType: "" },
        { id: 3, flag: 1 << 3, description: "Administrator", channelType: "" },
        { id: 4, flag: 1 << 4, description: "Manage Channels", channelType: "T, V, S" },
        { id: 5, flag: 1 << 5, description: "Manage Guild", channelType: "" },
        { id: 6, flag: 1 << 6, description: "Add Reactions", channelType: "T, V, S" },
        { id: 7, flag: 1 << 7, description: "View Audit Log", channelType: "" },
        { id: 8, flag: 1 << 8, description: "Priority Speaker", channelType: "V" },
        { id: 9, flag: 1 << 9, description: "Stream", channelType: "V, S" },
        { id: 10, flag: 1 << 10, description: "View Channel", channelType: "T, V, S" },
        { id: 11, flag: 1 << 11, description: "Send Messages", channelType: "T, V, S" },
        { id: 12, flag: 1 << 12, description: "Send TTS Messages", channelType: "T, V, S" },
        { id: 13, flag: 1 << 13, description: "Manage Messages", channelType: "T, V, S" },
        { id: 14, flag: 1 << 14, description: "Embed Links", channelType: "T, V, S" },
        { id: 15, flag: 1 << 15, description: "Attach Files", channelType: "T, V, S" },
        { id: 16, flag: 1 << 16, description: "Read Message History", channelType: "T, V, S" },
        { id: 17, flag: 1 << 17, description: "Mention Everyone", channelType: "T, V, S" },
        { id: 18, flag: 1 << 18, description: "Use External Emojis", channelType: "T, V, S" },
        { id: 19, flag: 1 << 19, description: "View Guild Insights", channelType: "" },
        { id: 20, flag: 1 << 20, description: "Connect", channelType: "V, S" },
        { id: 21, flag: 1 << 21, description: "Speak", channelType: "V" },
        { id: 22, flag: 1 << 22, description: "Mute Members", channelType: "V, S" },
        { id: 23, flag: 1 << 23, description: "Deafen Members", channelType: "V" },
        { id: 24, flag: 1 << 24, description: "Move Members", channelType: "V, S" },
        { id: 25, flag: 1 << 25, description: "Use Voice Activity", channelType: "V" },
        { id: 26, flag: 1 << 26, description: "Change Nickname", channelType: "" },
        { id: 27, flag: 1 << 27, description: "Manage Nicknames", channelType: "" },
        { id: 28, flag: 1 << 28, description: "Manage Roles", channelType: "T, V, S" },
        { id: 29, flag: 1 << 29, description: "Manage Webhooks", channelType: "T, V, S" },
        { id: 30, flag: 1 << 30, description: "Manage Guild Expressions", channelType: "" },
        { id: 31, flag: 1 << 31, description: "Use Application Commands", channelType: "T, V, S" },
        { id: 32, flag: 1 << 32, description: "Request to Speak", channelType: "S" },
        { id: 33, flag: 1 << 33, description: "Manage Events", channelType: "V, S" },
        { id: 34, flag: 1 << 34, description: "Manage Threads", channelType: "T" },
        { id: 35, flag: 1 << 35, description: "Create Public Threads", channelType: "T" },
        { id: 36, flag: 1 << 36, description: "Create Private Threads", channelType: "T" },
        { id: 37, flag: 1 << 37, description: "Use External Stickers", channelType: "T, V, S" },
        { id: 38, flag: 1 << 38, description: "Send Messages in Threads", channelType: "T" },
        { id: 39, flag: 1 << 39, description: "Use Embedded Activities", channelType: "V" },
        { id: 40, flag: 1 << 40, description: "Moderate Members", channelType: "" },
        { id: 41, flag: 1 << 41, description: "View Creator Monetization Analytics", channelType: "" },
        { id: 42, flag: 1 << 42, description: "Use Soundboard", channelType: "V" },
        { id: 43, flag: 1 << 43, description: "Create Guild Expressions", channelType: "" },
        { id: 44, flag: 1 << 44, description: "Create Events", channelType: "V, S" },
        { id: 45, flag: 1 << 45, description: "Use External Sounds", channelType: "V" },
        { id: 46, flag: 1 << 46, description: "Send Voice Messages", channelType: "T, V, S" },
    ];

    // Settings for disabling the script or its parts
    const disableScript = GM_getValue('Disable Script', false);
    const disableBotPermissionPurge = GM_getValue('Disable bot auth permissions check', false);
    const disableUserAuthScopePurge = GM_getValue('Disable user auth "guilds.join" check', false);

    async function parsePermissions(raw) {
        let permissions = [];
        for (const permission of permissionFlags) {
            if ((raw & permission.flag) === permission.flag) {
                permissions.push(permission);
            }
        }
        return permissions;
    }

    function buildRawPermissions(permissions) {
        let raw = 0;
        for (const permission of permissions) {
            raw |= permission.flag;
        }
        return raw;
    }
    // Function to show confirmation dialog for bot permissions
    function showBotPermissionConfirmationDialog(rawPermissions) {
        return new Promise((resolve) => {
            parsePermissions(rawPermissions).then(permissions => {
                console.log(`Permissions: ${permissions}`);
                const rebuiltPermissions = buildRawPermissions(permissions);
                console.log(`Rebuilt Permissions: ${rebuiltPermissions}`);
                if (rebuiltPermissions !== rawPermissions) {
                    console.error(`rebuilt permissions do not match original permissions!`);
                }
                let confirmText = `The bot would have the following ${permissions.length} permissions (${rebuiltPermissions}):\n`;
                for (const permission of permissions) {
                    confirmText += ` - ${permission.description}`;
                    if (permission.channelType) {
                        confirmText += ` (${permission.channelType})`;
                    }
                    confirmText += '\n';
                }
                console.log(confirmText);
                const autoPurge = GM_getValue('Automatically remove bot auth permissions', false);
                if (autoPurge) {
                    resolve(true);
                } else {
                    const confirmation = window.confirm(confirmText);
                    resolve(confirmation);
                }
                });
        });
    }

    // Function to check if the scope contains 'guilds.join'
    function hasGuildsJoinScopes(scopes) {
        return scopes.includes('guilds.join');
    }
    // Function to remove 'guilds.join' from the scope
    function removeGuildsJoinScopes(scopes) {
        const filteredScopes = scopes.filter(s => s !== 'guilds.join');
        return filteredScopes.join(' '); // Rejoin with space as separator (gets converted to +)
    }
    // Function to show confirmation dialog for user auth scopes
    function showUserAuthScopeConfirmationDialog() {
        return new Promise((resolve) => {
            const autoPurge = GM_getValue('Automatically remove "guilds.join" from user auth scope', false);
            if (autoPurge) {
                resolve(true);
            } else {
                const confirmation = window.confirm('The scope includes "guilds.join". Do you want to remove it?');
                resolve(confirmation);
            }
        });
    }

    // Intercept the URL and show confirmation dialogs
    const url = new URL(window.location.href);
    const permissions = parseInt(url.searchParams.get('permissions'), 10);
    const scope = url.searchParams.get('scope');

    if (!disableScript) {
        if (permissions && !disableBotPermissionPurge) {
            showBotPermissionConfirmationDialog(permissions).then((confirmed) => {
                if (confirmed) {
                    url.searchParams.set('permissions', '0');
                    window.location.href = url.toString();
                }
            });
        }
        if (!disableUserAuthScopePurge) {
            const scopes = scope.split(/[ +%20]/); // Split by space, plus, or encoded space
            if (hasGuildsJoinScopes(scopes)) {
                showUserAuthScopeConfirmationDialog().then((confirmed) => {
                    if (confirmed) {
                        const newScope = removeGuildsJoinScopes(scopes);
                        url.searchParams.set('scope', newScope);
                        window.location.href = url.toString();
                    }
                });
            }
        }
    }
})();