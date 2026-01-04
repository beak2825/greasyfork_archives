// ==UserScript==
// @name         GiveAwaySuHelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sollyu
// @icon         https://giveaway.su/favicon-96x96.png
// @match        *://*.giveaway.su/giveaway/view/*
// @connect      steamcommunity.com
// @connect      steampowered.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373175/GiveAwaySuHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/373175/GiveAwaySuHelper.meta.js
// ==/UserScript==

(function() {
    var steamHeper = new SteamHelper();

    function onButtonClickJoin() {
        var button = $(this).text('...')

        GM_xmlhttpRequest({
            url: "https://giveaway.su/action/redirect/" + $(this).attr("data-action-id"),
            method: 'GET',
            onload: function(response) {
                if (response.finalUrl.startsWith('https://store.steampowered.com/curator/')) {
                    var clanID = response.finalUrl.match(/([0-9]+)/);
                    clanID = clanID === null ? null : clanID[1];
                    steamHeper.followCurator(clanID, function(){ button.text('完') })
                }

                else if (response.finalUrl.startsWith('https://steamcommunity.com/groups/')) {
                    steamHeper.joinSteamGroup(response.finalUrl, function(){ button.text('完') })
                }

                else if (response.finalUrl.startsWith('https://store.steampowered.com/app/')) {
                    var appID = response.finalUrl.match(/([0-9]+)/);
                    appID = appID === null ? null : appID[1];
                    steamHeper.addToWishList(appID, function(){ steamHeper.followGame(appID, function() { button.text('完') }) })
                }
            }
        })
    }

    function onButtonClickLeave() {
        var button = $(this).text('...')
        var finishNumber = 0
        var actionSize = GM_getValue(window.location.pathname).length
        $.each(GM_getValue(window.location.pathname), function(index, value) {
           GM_xmlhttpRequest({
                url   : "https://giveaway.su/action/redirect/"+value,
                method: 'GET',
                onload: function(response) {
                    finishNumber = finishNumber + 1
                    console.log(finishNumber)
                    if (finishNumber == actionSize) { button.text('全部已经完成') }

                    if (response.finalUrl.startsWith('https://store.steampowered.com/curator/')) {
                        var clanID = response.finalUrl.match(/([0-9]+)/);
                        clanID = clanID === null ? null : clanID[1];
                        steamHeper.unfollowCurator(clanID, function(){})
                    }else if (response.finalUrl.startsWith('https://steamcommunity.com/groups/')) {
                        steamHeper.getGroupID(response.finalUrl, function(groupID) { steamHeper.leaveSteamGroup(groupID, function(){}) })
                    }else if (response.finalUrl.startsWith('https://store.steampowered.com/app/')) {
                        var appID = response.finalUrl.match(/([0-9]+)/);
                        appID = appID === null ? null : appID[1];
                        steamHeper.removeToWishList(appID, function(){ steamHeper.unfollowGame(appID, function() { }) })
                    }
                },
                onerror: function(response) {
                    finishNumber = finishNumber + 1
                    console.log(finishNumber)
                    if (finishNumber == actionSize) { button.text('全部已经完成') }
                }
            })
        })
    }

    function SteamHelper() {
        this.groupSessionID   = null;
        this.curatorSessionID = null;
        this.wishlistID       = null;
        this.userId           = null;
        this.processUrl       = null;

        this.init = function(callback) {
            var that = this;
            GM_xmlhttpRequest({
                url    : "https://steamcommunity.com/my/groups",
                method: "GET",
                onload: function(response) {
                    // debugger;
                    that.userId          = response.responseText.match(/g_steamID = \"(.+?)\";/);
                    that.groupSessionID  = response.responseText.match(/g_sessionID = \"(.+?)\";/);
                    that.processUrl      = response.responseText.match(/steamcommunity.com\/(id\/.+?|profiles\/[0-9]+)\/friends\//);
                    that.userId          = that.userId     === null ? null : that.userId[1];
                    that.groupSessionID  = that.groupSessionID  === null ? null : that.groupSessionID[1];
                    that.processUrl      = that.processUrl === null ? null : "https://steamcommunity.com/" + that.processUrl[1] + "/home_process";

                    GM_xmlhttpRequest({
                        url   : 'https://store.steampowered.com/wishlist/profiles/',
                        method: 'GET',
                        onload: function(response) {
                            that.curatorSessionID  = response.responseText.match(/g_sessionID = \"(.+?)\";/);
                            that.wishlistID        = response.finalUrl.match(/([0-9]+)/);

                            that.curatorSessionID  = that.curatorSessionID  === null ? null : that.curatorSessionID[1];
                            that.wishlistID        = that.wishlistID        === null ? null : that.wishlistID[1];

                            if($(".giveaway-info-block").find(".text-right").length == 0) {
                                callback(false)
                            }else {
                                var actionID=[]
                                $(".giveaway-info-block").find(".text-right").each(function(index, value){
                                    $(this).append( $('<button type="button" class="btn btn-xs btn-default" data-action-id="' +$(this).parent().attr('data-action-id')+ '">加</button>').click(onButtonClickJoin))
                                    actionID.push($(this).parent().attr('data-action-id'))
                                });
                                GM_setValue(window.location.pathname, actionID)
                                callback(true)
                            }
                        }
                    });
                }
            });
        }

        this.joinSteamGroup = function(groupUrl, callback) {
            var that = this;
            GM_xmlhttpRequest({
                url    : groupUrl,
                method : 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data   : $.param({ action: 'join', sessionID: that.groupSessionID }),
                onload : function(response) {
                    callback()
                }
            });
        }

        this.leaveSteamGroup = function(groupId, callback) {
            var that = this;
            GM_xmlhttpRequest({
                url    : that.processUrl,
                method : 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data   : $.param({ sessionID: that.groupSessionID, action: "leaveGroup", groupId: groupId }),
                onload : function(response) {
                    callback()
                }
            });
        }

        this.followCurator = function(clanID, callback) {
            var that = this;
            GM_xmlhttpRequest({
                url         : 'https://store.steampowered.com/curators/ajaxfollow',
                method      : 'POST',
                headers     : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data        : $.param({ clanid: clanID, follow: '1', sessionid: that.curatorSessionID }),
                onload      : function(response) {
                    callback()
                }
            });
        }

        this.unfollowCurator = function(clanID, callback) {
            var that = this;
            GM_xmlhttpRequest({
                url         : 'https://store.steampowered.com/curators/ajaxfollow',
                method      : 'POST',
                headers     : {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data        : $.param({ clanid: clanID, follow: '0', sessionid: that.curatorSessionID }),
                onload      : function(response) {
                    callback()
                }
            });
        }

        this.followGame = function(appID, callback) {
            var that = this;
            GM_xmlhttpRequest({
                url    : 'https://store.steampowered.com/explore/followgame/',
                method : 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data   : $.param({ appid: appID, sessionid: that.curatorSessionID }),
                onload : function(response) {
                    callback()
                }
            });
        }

        this.unfollowGame = function(appID, callback) {
            var that = this;
            GM_xmlhttpRequest({
                url    : 'https://store.steampowered.com/explore/followgame/',
                method : 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data   : $.param({ appid: appID, sessionid: that.curatorSessionID, unfollow: '1' }),
                onload : function(response) {
                    callback()
                }
            });
        }

        /**
         * Get the numeric ID for a Steam group
         */
        this.getGroupID = function(groupUrl, callback) {
            GM_xmlhttpRequest({
                url    : groupUrl,
                method : "GET",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                onload : function(response) {
                    var group_id = response.responseText.match(/OpenGroupChat\( \'([0-9]+)\'/);
                    group_id = group_id === null ? null : group_id[1];
                    callback(group_id);
                }
            })
        }

        this.addToWishList = function(appID, callback) {
            var that = this;
            GM_xmlhttpRequest({
                url    : 'https://store.steampowered.com/api/addtowishlist',
                method : 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data   : $.param({ appid: appID, sessionid: that.curatorSessionID }),
                onload : function(response) {
                    callback()
                }
            })
        }

        this.removeToWishList = function(appID, callback) {
            var that = this;
            GM_xmlhttpRequest({
                url    : 'https://store.steampowered.com/wishlist/profiles/'+that.wishlistID+'/remove/',
                method : 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                data   : $.param({ appid: appID, sessionid: that.curatorSessionID }),
                onload : function(response) {
                    callback()
                }
            });
        }
    }

    var initButton = $('<button style="width: 100%;" class="btn btn-xs btn-default" >初始化</button>')
    initButton.click(function(){
        initButton.text('...')
        steamHeper.init(function(response) {
            initButton.remove()
            if (response == false) {
                $('.giveaway-info-block').before($('<button style="width: 100%;" class="btn btn-xs btn-default" >全部退出</button>').click(onButtonClickLeave))
            }
        });
    })
    $('.giveaway-info-block').before(initButton)
})();
