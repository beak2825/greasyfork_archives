// ==UserScript==
// @name         Twitch Enhancer
// @name:en      Twitch Enhancer
// @name:ja      Twitch Enhancer
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-02-24
// @description  aiueo
// @description:en aiueo
// @description:ja aiueo
// @author       ぐらんぴ
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527762/Twitch%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/527762/Twitch%20Enhancer.meta.js
// ==/UserScript==

const origFetch = window.fetch;
window.fetch = async function(url, init) {
    let res = await origFetch(url, init);
    // Check for null body status codes
    if(res.status === 204 || res.status === 205) {
        return res; // Return the response as is for these status codes
    }
    let data;
    try{
        // Check if the response is not empty before parsing
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
    }catch(err){
        console.log('Failed to parse JSON:', err);
        return res;
    }

    // console.log(url, data, data.length);
    try{
        if(url.startsWith('https://edge.ads.twitch.tv/ads')){//Prime Pop-up
            data = '';
        }
        if(url == 'https://gql.twitch.tv/gql#origin=twilight'){// twilight
            data.forEach(i =>{
                // login
                if(i.extensions.operationName == 'CoreActionsCurrentUser'){
                    i.data.currentUser.roles.isStaff = true
                }
                if(i.extensions.operationName == 'FrontPageNew_User'){// followedGames
                    i.data.currentUser.roles.isStaff = true
                }
                // moderator
                if(i.extensions.operationName == "PlayerTrackingContextQuery"){
                    i.data.currentUser.hasTurbo = true
                    i.data.currentUser.isStaff = true
                    i.data.user.self.isModerator = true
                    i.data.user.self.subscriptionBenefit = true
                    i.data.user.subscriptionProducts[0].hasAdFree = true
                    i.data.user.subscriptionProducts[1].hasAdFree = true
                    i.data.user.subscriptionProducts[2].hasAdFree = true
                }
                if(i.extensions.operationName == 'ChatRestrictions'){
                    i.data.channel.self.isFirstTimeChatter = true
                    i.data.channel.self.isModerator = true
                    i.data.channel.self.isVIP = true
                    i.data.channel.self.subscriptionBenefit = true
                    i.data.currentUser.isPhoneNumberVerified = true
                }
                if(i.extensions.operationName == "CommunityPointsRewardRedemptionContext"){
                    i.data.community.self.isModerator = true
                    i.data.community.self.subscriptionBenefit = true
                }
                if(i.extensions.operationName == 'ChannelPointsContext'){
                    i.data.community.self.isModerator = true
                }
                if(i.extensions.operationName == 'Chat_ChannelData'){
                    i.data.channel.self.isEditor = true
                    i.data.channel.self.isModerator = true
                    i.data.channel.self.isVIP = true
                }
                if(i.extensions.operationName == 'StreamChat'){
                    i.data.channel.self.isChannelMember = true
                    i.data.channel.self.isModerator = true
                    i.data.channel.self.subscriptionBenefit = true
                }
                if(i.extensions.operationName == 'CurrentUserModeratorStatus'){
                    i.data.user.self.isModerator = true
                }
                if(i.extensions.operationName == 'ChannelPollContext_GetViewablePoll'){
                    i.data.channel.self.isEditor = true
                    i.data.channel.self.isModerator = true
                }
            });
        }
    }catch(err){
        console.log('err modifying data:', err);
    }

    return new Response(JSON.stringify(data), {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
    });
};

const origAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(...args){
    try{
        if(args[0].className.includes('ScCoreButton-sc-ocjdkq-0')){// Auto Channel Points Claimer
            document.querySelectorAll(".claimable-bonus__icon")[0].click()
        }
        }catch(err){// console.log(err);
       }
    return origAppendChild.apply(this, args);
};