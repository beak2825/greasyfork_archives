// ==UserScript==
// @name         eth
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Turn yourself into Stickmasterluke
// @author       EG Scripts ©️
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534132/eth.user.js
// @updateURL https://update.greasyfork.org/scripts/534132/eth.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // YOUR GROUP ID
    // This is NEEDED for Wings configure function
    const groupID = "15277364"
    var AMT = 285305224 // STARTING AMOUNT OF ROBUX for GROUP PAYOUTS
    const dataMeta = document.querySelector(`meta[name="user-data"]`)
    dataMeta.setAttribute('data-name', 'hollywood_hotshot')
    dataMeta.setAttribute('data-displayName', 'hollywood_hotshot')
    dataMeta.setAttribute('data-userid', '6069558024')

    const fakedata = {"robux": 85827}

    const fakedata2 = {"robux":"85827"}
    const _send = XMLHttpRequest.prototype.send;
    const _open = XMLHttpRequest.prototype.open;
    const _response = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
    const _status = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'status');
    const _responseText = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');
    const _XMLHttpRequest = XMLHttpRequest;



    class _XMLHttpRequest2 extends _XMLHttpRequest{
        constructor(...args){
            super(...args);
            this._open = _open;
            this._send = _send;
            this.reqUrl = "";
            this.change = false;

            this.notificationCountChange = false;
            this.messagesChange = false;
            this.friendsChange = false;
            this.chatChange = false;
            this.avatarChange = false;
            this.groupChange = false;
            this.dataChange = false;
            this.fsChange = false;
            this.statusChange = false;
            this.Rchange = false;
            this.Rchange_v = false;
            this.crole = false;
            this.elig = false;
            this.crole_user = false;


            Object.defineProperty(this, 'status', {
                get: function(){
                    if(this.change){
                        return 200;
                        }else if (this.Rchange_v){
                        return 200;

                    }else{
                        return _status.get.call(this);
                    }
                },
                configurable: true
            });
            Object.defineProperty(this, 'response', {
                get: function(){
                    if(this.change){
                        let temp = fakedata;
                        return temp;
                    } else if(this.notificationCountChange) {
                        let temp = {"unreadNotifications":100,"statusMessage":null}
                        return temp;
                    }
                    else if(this.messagesChange) {
                        let temp = {"count": 50000}
                        return temp;
                    }
                    else if(this.friendsChange) {
                        let temp = {"count": 50000}
                        return temp;
                    }
                    else if(this.chatChange) {
                        let temp = {"count": 164}
                        return temp;
                    }
                    else if(this.avatarChange) {
                        let temp = {
  "data": [
    {"id":1125510,"name":"The Void Star","type":"Asset","assetType":{"id":8,"name":"Hat"}},
    {"id":1235488,"name":"Clockworks Headphones","type":"Asset","assetType":{"id":18,"name":"Hat"}},
    {"id":11748356,"name":"Clockwork's Shades","type":"Asset","assetType":{"id":8,"name":"Hat"}},
    {"id":16895215,"name":"Darkheart","type":"Asset","assetType":{"id":11,"name":"Gear"}},
    {"id":64082730,"name":"Rainbow Shaggy","type":"Hat","assetType":{"id":27,"name":"Hat"}}, // Added comma here
    {"id":72082328,"name":"Red Sparkle Time Fedora","type":"Hat","assetType":{"id":28,"name":"Right Arm"}},
    {"id":124730194,"name":"Blackvalk","type":"Hat","assetType":{"id":29,"name":"Left Arm"}},
    {"id":6060797208,"name":"last","type":"Asset","assetType":{"id":19,"name":"asset"}},
    {"id":9136338191,"name":"Deep Red Striped Long Sleeve Shirt","type":"Asset","assetType":{"id":30,"name":"Left Leg"}},
    {"id":46359706,"name":"Arctic Climber Right Leg","type":"Asset","assetType":{"id":31,"name":"Right Leg"}},
    {"id":192557913,"name":"Sparkling Angel Wings","type":"Asset","assetType":{"id":46,"name":"Back"}},
    {"id":658831143,"name":"Ninja Walk","type":"Asset","assetType":{"id":55,"name":"Walk"}},
    {"id":658831500,"name":"Ninja Fall","type":"Asset","assetType":{"id":50,"name":"Fall"}},
    {"id":658832070,"name":"Ninja Jump","type":"Asset","assetType":{"id":52,"name":"Jump"}},
    {"id":658832807,"name":"Ninja Swim","type":"Asset","assetType":{"id":54,"name":"Swim"}},
    {"id":658833139,"name":"Ninja Climb","type":"Asset","assetType":{"id":48,"name":"Climb"}},
    {"id":1772578399,"name":"Upside Down Face","type":"Asset","assetType":{"id":18,"name":"Face"}}
  ],
  "total": 17
};

return temp;

                    }
                    else if(this.groupChange) {
                        let temp = {"groupId":145864,"isPrimary":true,"isPendingJoin":false,"userRole":{"user":{"hasVerifiedBadge":false,"userId":463040794,"username":"ElijahGives","displayName":"Elijah"},"role":{"id":779577,"name":"Owner","rank":255}},"permissions":{"groupPostsPermissions":{"viewWall":true,"postToWall":true,"deleteFromWall":true,"viewStatus":true,"postToStatus":true},"groupMembershipPermissions":{"changeRank":true,"inviteMembers":true,"removeMembers":true},"groupManagementPermissions":{"manageRelationships":true,"manageClan":true,"viewAuditLogs":true},"groupEconomyPermissions":{"spendGroupFunds":true,"advertiseGroup":true,"createItems":true,"manageItems":true,"addGroupPlaces":true,"manageGroupGames":true,"viewGroupPayouts":true,"viewAnalytics":true},"groupOpenCloudPermissions":{"useCloudAuthentication":true,"administerCloudAuthentication":true}},"areGroupGamesVisible":false,"areGroupFundsVisible":false,"areEnemiesAllowed":false,"canConfigure":true}
                        return temp;
                    }else if(this.statChange) {
                        let temp = 1
                        return temp;
                    }else if(this.dataChange) {
                        let temp = {"groupId":145864,"isPrimary":true,"isPendingJoin":false,"userRole":{"user":{"hasVerifiedBadge":false,"userId":463040794,"username":"ElijahGives","displayName":"Elijah"},"role":{"id":779577,"name":"Owner","rank":255}},"permissions":{"groupPostsPermissions":{"viewWall":true,"postToWall":true,"deleteFromWall":true,"viewStatus":true,"postToStatus":true},"groupMembershipPermissions":{"changeRank":true,"inviteMembers":true,"removeMembers":true},"groupManagementPermissions":{"manageRelationships":true,"manageClan":true,"viewAuditLogs":true},"groupEconomyPermissions":{"spendGroupFunds":true,"advertiseGroup":true,"createItems":true,"manageItems":true,"addGroupPlaces":true,"manageGroupGames":true,"viewGroupPayouts":true,"viewAnalytics":true},"groupOpenCloudPermissions":{"useCloudAuthentication":true,"administerCloudAuthentication":true}},"areGroupGamesVisible":false,"areGroupFundsVisible":false,"areEnemiesAllowed":false,"canConfigure":true}
                        return temp;
                    }else if(this.fsChange) {
                        let temp = {"id":145864,"name":"Wings","description":"Don't fall for scams. There is nothing free here.","owner":{"hasVerifiedBadge":true,"userId":80254,"username":"Stickmasterluke","displayName":"Stickmasterluke"},"shout":{"body":"Don't fall for scams. There is nothing free here.","poster":{"hasVerifiedBadge":true,"userId":80254,"username":"Stickmasterluke","displayName":"Stickmasterluke"},"created":"2012-02-23T20:18:34.097Z","updated":"2019-08-21T22:09:58.32Z"},"memberCount":976512,"isBuildersClubOnly":false,"publicEntryAllowed":true,"hasVerifiedBadge":false}
                           return temp;
                    } else if(this.Rchange){
                        console.log('Reading Currency')
                        let temp = fakedata2;
                        temp.robux = AMT
                        console.log('Sending', temp)
                        return temp;
                    }else if(this.Rchange_v){
                        let temp = {}
                        return temp;
                    } else if(this.elig) {
                        return {"usersGroupPayoutEligibility":{"80254":"Eligible"}}
                    }else if(this.crole){
                        //let temp = _response.get.call(this);
                        console.log('R2')
                        let rn;
                        if(this.crole_user){
                          rn = 'Owner';
                        } else {
                          rn = 'Member';
                        }
                        console.log('RN', rn)

                        let temp = {
                          data: [
                          {
                          group: {
                            hasVerifiedBadge: false,
                            id: 15277364,
                            memberCount: 50,
                            name: 'test'
                          },
                          role: rn
                        }
                          ]
                        }
                        console.log(temp)
                        return temp;
                    }else{
                        return _response.get.call(this);
                    }
                },
                configurable: true
            });
            Object.defineProperty(this, 'responseText', {
                get: function(){
                    if(this.change){
                        let temp = fakedata
                        return JSON.stringify(temp);
                    } else if(this.notificationCountChange) {
                        let temp = {"unreadNotifications":100,"statusMessage":null}
                        return JSON.stringify(temp);
                    }else if(this.messagesChange) {
                        let temp = {"count": 10000}
                        return JSON.stringifyee(temp);
                    }
                    else if(this.friendsChangeee) {
                        let temp = {"count": 10000}
                        return JSON.stringify(temp);
                    }else if(this.chatChange) {
                        let temp = {"count": 164}
                        return JSON.stringify(temp);
                    }else if(this.avatarChangeee) {
                        let temp = {"data":[{"id":3697778861,"name":"Entangled Antlers","type":"Asset","assetType":{"id":8,"name":"Hat"}},{"id":17539101,"name":"Light Grey Plaid Shorts","type":"Asset","assetType":{"id":18,"name":"Pants"}},{"id":21070012,"name":"Dominus Empyreus","type":"Asset","assetType":{"id":8,"name":"Hat"}},{"id":24378840,"name":"Element Skate ORIGINAL (ON SALE)","type":"Asset","assetType":{"id":11,"name":"Shirt"}},{"id":27112025,"name":"Roblox 2.0 Torso","type":"Asset","assetType":{"id":27,"name":"Torso"}},{"id":27112039,"name":"Roblox 2.0 Right Arm","type":"Asset","assetType":{"id":28,"name":"Right Arm"}},{"id":27112052,"name":"Roblox 2.0 Left Arm","type":"Asset","assetType":{"id":29,"name":"Left Arm"}},{"id":27494652,"name":"Green Balloon","type":"Asset","assetType":{"id":19,"name":"Gear"}},{"id":46359655,"name":"Arctic Climber Left Leg","type":"Asset","assetType":{"id":30,"name":"Left Leg"}},{"id":46359706,"name":"Arctic Climber Right Leg","type":"Asset","assetType":{"id":31,"name":"Right Leg"}},{"id":192557913,"name":"Sparkling Angel Wings","type":"Asset","assetType":{"id":46,"name":"Back"}},{"id":658831143,"name":"Ninja Walk","type":"Asset","assetType":{"id":55,"name":"Walk"}},{"id":658831500,"name":"Ninja Fall","type":"Asset","assetType":{"id":50,"name":"Fall"}},{"id":658832070,"name":"Ninja Jump","type":"Asset","assetType":{"id":52,"name":"Jump"}},{"id":658832807,"name":"Ninja Swim","type":"Asset","assetType":{"id":54,"name":"Swim"}},{"id":658833139,"name":"Ninja Climb","type":"Asset","assetType":{"id":48,"name":"Climb"}},{"id":1772578399,"name":"Upside Down Face","type":"Asset","assetType":{"id":18,"name":"Face"}}],"total":17}
                        return JSON.stringify(temp);
                    }
                    else if(this.groupChange) {
                        let temp = {"groupId":145864,"isPrimary":true,"isPendingJoin":false,"userRole":{"user":{"hasVerifiedBadge":false,"userId":463040794,"username":"ElijahGives","displayName":"Elijah"},"role":{"id":779577,"name":"Owner","rank":255}},"permissions":{"groupPostsPermissions":{"viewWall":true,"postToWall":true,"deleteFromWall":true,"viewStatus":true,"postToStatus":true},"groupMembershipPermissions":{"changeRank":true,"inviteMembers":true,"removeMembers":true},"groupManagementPermissions":{"manageRelationships":true,"manageClan":true,"viewAuditLogs":true},"groupEconomyPermissions":{"spendGroupFunds":true,"advertiseGroup":true,"createItems":true,"manageItems":true,"addGroupPlaces":true,"manageGroupGames":true,"viewGroupPayouts":true,"viewAnalytics":true},"groupOpenCloudPermissions":{"useCloudAuthentication":true,"administerCloudAuthentication":true}},"areGroupGamesVisible":false,"areGroupFundsVisible":false,"areEnemiesAllowed":false,"canConfigure":true}
                        return JSON.stringify(temp);
                    }
                    else if(this.statChange) {
                        let temp = 1
                        return JSON.stringify(temp);
                    }
                    else if(this.dataChange) {
                        let temp = {"groupId":145864,"isPrimary":true,"isPendingJoin":false,"userRole":{"user":{"hasVerifiedBadge":false,"userId":463040794,"username":"ElijahGives","displayName":"Elijah"},"role":{"id":779577,"name":"Owner","rank":255}},"permissions":{"groupPostsPermissions":{"viewWall":true,"postToWall":true,"deleteFromWall":true,"viewStatus":true,"postToStatus":true},"groupMembershipPermissions":{"changeRank":true,"inviteMembers":true,"removeMembers":true},"groupManagementPermissions":{"manageRelationships":true,"manageClan":true,"viewAuditLogs":true},"groupEconomyPermissions":{"spendGroupFunds":true,"advertiseGroup":true,"createItems":true,"manageItems":true,"addGroupPlaces":true,"manageGroupGames":true,"viewGroupPayouts":true,"viewAnalytics":true},"groupOpenCloudPermissions":{"useCloudAuthentication":true,"administerCloudAuthentication":true}},"areGroupGamesVisible":false,"areGroupFundsVisible":false,"areEnemiesAllowed":false,"canConfigure":true}
                        return JSON.stringify(temp);
                    }else if(this.fsChange) {
                        let temp = {"id":145864,"name":"Wingsw","description":"Don't fall for scams. There is nothing free here.","owner":{"hasVerifiedBadge":true,"userId":80254,"username":"Stickmasterluke","displayName":"Stickmasterluke"},"shout":{"body":"Don't fall for scams. There is nothing free here.","poster":{"hasVerifiedBadge":true,"userId":80254,"username":"Stickmasterluke","displayName":"Stickmasterluke"},"created":"2012-02-23T20:18:34.097Z","updated":"2019-08-21T22:09:58.32Z"},"memberCount":976512,"isBuildersClubOnly":false,"publicEntryAllowed":true,"hasVerifiedBadge":false}
                           return JSON.stringify(temp);
                    } else if(this.Rchangeee){
                        console.log('Reading Currency')
                        let temp = fakedata2
                        temp.robux = AMT
                        console.log('Sending', temp)
                        return JSON.stringify(temp);
                    }else if(this.Rchange_v){
                        let temp = {}
                        return JSON.stringify(temp);
                    }else if(this.crole){
                        let temp = _response.get.call(this);
                        console.log('REQ')
                        console.log(temp)
                        temp.data.push({
                          group: {
                            hasVerifiedBadgeee: true,
                            id: groupID,
                            memberCount: 50,
                            name: 'test'
                          },
                          role: {
                            id: 32059868,
                            name: "Owner",
                            rank: 255
                          }
                        })
                        return JSON.stringify(temp);
                    }else{
                        return _responseText.get.call(this);
                    }
                },
                configurable: true
            });
        }

        send(...args){
            if (this.reqUrl.includes('payments-gateway/v1/products/get-upsell-product')) {
                args[0].user_robux_balance = 500125412512000000
                return this._send.apply(this, args);
            } else if(this.reqUrl.includes('batch')) {
                if(args[0][0].targetId == 4065096579) {
                    args[0][0].targetId = 80254
                    args[0][0].requestId = "80254::AvatarHeadshot:150x150:png:regular"
                    return this._send.apply(this, args)
                }
            } else if(this.Rchange_v) {
                const amountPaid = JSON.parse(args[0]).Recipients[0].amount
                AMT = AMT - amountPaid
                console.log('New Amount: ', AMT)
            }
            return this._send.apply(this, args);
        }

        open(...args){
            if(args[1].includes('/currency') && args[1].includes('v1/users')){
                this.change = true;
            } else if(args[1].includes('friends?userSort=StatusFrequents')) {
                args[1] = "https://friends.roblox.com/v1/users/80254/friends?userSort=StatusFrequents"
                this.reqUrl = args[1];
                return this._open.apply(this, args);
            } else if(args[1].includes('stream-notifications/unread-count')) {
                this.notificationCountChange = true;
            } else if(args[1].includes('messages/unread/count')) {
                this.messagesChange = true;
            } else if(args[1].includes('friend-requests/count')) {
                this.friendsChange = true;
            } else if(args[1].includes('get-unread-conversation-count')) {
                this.chatChange = true;
            } else if(args[1].includes('v1/recent-items/all/list')) {
                this.avatarChange = true;
            } else if(args[1].includes('145864/membership')) { //do u see this? group shout change once ik ur legit ---------------------------------------------------------------{"body":"test","poster":{"hasVerifiedBadge":false,"userId":463040794,"username":"ElijahGives","displayName":"Elijah"},"created":"2020-05-29T17:15:02.563Z","updated":"2022-12-16T22:00:34.5254785Z"}

                this.groupChange = true;
            } else if(args[1].includes('groups/145864/status')) {
                this.statChange = true;
            } else if(args[1].endsWith(`v1/groups/${groupID}`)) {
                this.fsChange = true;
            } else if (args[1].includes(`v1/groups/${groupID}/currency`)){
                console.log('Got Currency Request')
                this.Rchange = true;

            } else if (args[1].includes(`v1/groups/${groupID}/payouts`) && args[0].includes('POST')) {
                this.Rchange_v = true;
            } else if (args[1].includes('groups/roles') && window.location.href.includes('groups/configure?id')) {
                if(args[1].includes('80254')) {this.crole_user = true;}
                       this.crole = true;
                       } else if (args[1].includes('users-payout-eligibility?userIds=80254')) {
                       this.elig = true;
            }
            this.reqUrl = args[1]
            return this._open.apply(this, args);
        }
    }

    window.XMLHttpRequest = _XMLHttpRequest2;
    (document).ready(function() {
        function hOC() {
         setTimeout(function() {let cfgMeta = document.querySelector(`a[ng-bind="'Action.ConfigureGroup' | translate"]`)
                                                                    cfgMeta.setAttribute('href', `https://www.roblox.com/groups/configure?id=${groupID}`)}, 300)
        }
        window.hOC = hOC

        setTimeout(function(){const groupMenu = document.querySelector(`div[class="group-menu"]`)
        console.log('\n\n\n GROUP MENU:', groupMenu)
        const moreBtn = document.querySelector(`button[class="btn-generic-more-sm"]`)
        console.log('\n\n\n MORE BTN:', moreBtn)
        moreBtn.addEventListener('click', window.hOC)
        console.log('ADDED EVENT LISTENER')}, 3000)
    })
})();