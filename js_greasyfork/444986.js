// ==UserScript==
// @name         Discord Static Avatars
// @namespace    https://files.noodlebox.moe/
// @version      1.0.1
// @description  Animate avatars in the chat area
// @author       Andromeda
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://cdn.jsdelivr.net/lodash/4.17.2/lodash.min.js
// @match        *://*.discord.com/channels/*
// @match        *://*.discord.com/invite/*
// @match        *://*.discord.com/login
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444986/Discord%20Static%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/444986/Discord%20Static%20Avatars.meta.js
// ==/UserScript==

(function ($, _) {
    "use strict";

    // This is super hackish, and will likely break as Discord's internal API changes
    // Anything using this or what it returns should be prepared to catch some exceptions
    const getInternalInstance = e => e[Object.keys(e).find(k => k.startsWith("__reactInternalInstance"))];

    function getOwnerInstance(e, {include, exclude=["Popout", "Tooltip", "Scroller", "BackgroundFlash"]} = {}) {
        if (e === undefined) {
            return undefined;
        }

        // Set up filter; if no include filter is given, match all except those in exclude
        const excluding = include === undefined;
        const filter = excluding ? exclude : include;

        // Get displayName of the React class associated with this element
        // Based on getName(), but only check for an explicit displayName
        function getDisplayName(owner) {
            const type = owner._currentElement.type;
            const constructor = owner._instance && owner._instance.constructor;
            return type.displayName || constructor && constructor.displayName || null;
        }
        // Check class name against filters
        function classFilter(owner) {
            const name = getDisplayName(owner);
            return (name !== null && !!(filter.includes(name) ^ excluding));
        }

        // Walk up the hierarchy until a proper React object is found
        for (let prev, curr=getInternalInstance(e); !_.isNil(curr); prev=curr, curr=curr._hostParent) {
            // Before checking its parent, try to find a React object for prev among renderedChildren
            // This finds React objects which don't have a direct counterpart in the DOM hierarchy
            // e.g. Message, ChannelMember, ...
            if (prev !== undefined && !_.isNil(curr._renderedChildren)) {
                /* jshint loopfunc: true */
                let owner = Object.values(curr._renderedChildren)
                    .find(v => !_.isNil(v._instance) && v.getHostNode() === prev.getHostNode());
                if (!_.isNil(owner) && classFilter(owner)) {
                    return owner._instance;
                }
            }

            if (_.isNil(curr._currentElement)) {
                continue;
            }

            // Get a React object if one corresponds to this DOM element
            // e.g. .user-popout -> UserPopout, ...
            let owner = curr._currentElement._owner;
            if (!_.isNil(owner) && classFilter(owner)) {
                return owner._instance;
            }
        }

        return null;
    }

    $(".theme-dark, .theme-light").on("mouseenter.staticavatars", ".message-group", function () {
        try {
            getOwnerInstance(this, {include: ["MessageGroup"]}).setState({animate: false, animatedAvatar: false});
        } catch (err) {
            //console.error("DiscordStaticAvatars", err);
        }
    });
})(jQuery.noConflict(true), _.noConflict());