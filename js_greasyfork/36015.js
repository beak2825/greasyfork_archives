// ==UserScript==
// @name         TabsOfAvabur
// @namespace    Reltorakii.magic
// @version      3.1
// @description  Tabs the channels it finds in chat, can be sorted, with notif for new messages
// @author       Reltorakii
// @match        https://*.avabur.com/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36015/TabsOfAvabur.user.js
// @updateURL https://update.greasyfork.org/scripts/36015/TabsOfAvabur.meta.js
// ==/UserScript==
/* jshint -W097 */
/* jshint -W043 */
"use strict";

(function($) {

    var options                 = {
        scriptSettings  : {
            purge                       : true,
            channel_remove              : false,
            preview                     : true,
            preview_reset               : false,
            group_wires                 : false,
            at_username                 : true,
            join_channel_link           : true,
            auto_join                   : false,
            profile_tooltip_nickname    : true,
            profile_tooltip_mention     : true,
            profile_tooltip_quickscope  : true
        },
        channelsSettings    : {
            channelMerger       : {
                groups              : [],
                mapping             : {},
                defaultChannels     : {}
            },
            mutedChannels   : []
        },
        version: "3.1"
    };
    var groupsMap               = {};
    var channelLog              = {};
    var mainChannelID           = "2";
    var currentChannel          = "Main";
    var ServerMessagesChannel   = "SML_325725_2338723_CHC";
    var CMDResposeChannel       = "CMDRC_4000_8045237_CHC";
    var WhispersChannel         = "UW_7593725_3480021_CHC";
    var WiresChannel            = "WC_0952340_3245901_CHC";
    var MergedChannelsGroup     = "MCG_105704_4581101_CHC";

    var GlobalChannel           = 1000000000;
    var EventChannel            = 2000000000;
    var chatDirection           = "up";

    var scriptChannels          = [ServerMessagesChannel, CMDResposeChannel, WhispersChannel, WiresChannel];

    var showedMoTD              = false;
    var lastMoTDContent         = "";

    var showingReconnectMsg     = false;
    var internalUpdateUrl       = "https://api.github.com/repos/edvordo/TabsOfAvabur/contents/TabsOfAvabur.user.js";

    var hovering;
    var hoveringOverTab;

    var checkForUpdateTimer     = 0;

    function returnCustomID(channel, resolved, cname, on) {
        var obj =  {
            cID: channel, 
            res: resolved, 
            name: cname, 
            on: typeof on !== "undefined" ? on : name
        };
        return obj;
    }

    function resolveChannelID(channel) {
        var channelID;
        var origChannelName = channel;
        var resolved = true;
        if (channel === "GLOBAL") {
            channel = "Global";
        } else if (channel === "CLAN") {
            channel = "Clan";
        } else if (channel.substr(0,4) === "AREA") {
            channel = "Area";
        } else if (channel === "HELP") {
            channel = "Help";
        } else if (channel === "STAFF") {
            channel = "Staff";
        } else if (channel === "TRADE") {
            channel = "Trade";
        } else if (channel === "Market") {
            return returnCustomID(CMDResposeChannel, true, "");//  info channel changes this later
        } else if (channel === "Whispers Log") {
            return returnCustomID(WhispersChannel, true, channel, origChannelName);
        } else if (channel === "Wires Log") {
            return returnCustomID(WiresChannel, true, channel, origChannelName);
        } else if (channel === "Server Messages") {
            return returnCustomID(ServerMessagesChannel, true, channel, origChannelName);
        } else if (channel.match(/^Level:\s+[0-9]+/)) {
            return returnCustomID(CMDResposeChannel, true, "", origChannelName);//  info channel changes this later
        }
        var map = {
            "Global": "GLOBAL",
            "Clan": "CLAN",
            "Area": "AREA",
            "Help": "HELP",
            "Staff": "STAFF",
            "Trade": "TRADE"
        };
        if (typeof map[origChannelName] !== "undefined") {
            origChannelName = map[origChannelName];
        }

        channelID = 0;
        $("select#chatChannel option").each(function(i,e){
            var n = $(e).attr("name");
            if (n==="channel"+channel) {
                channelID = $(e).attr("value");
            }
        });
        if (options.channelsSettings.channelMerger.groups.indexOf(origChannelName) !== -1) {
            channelID = MergedChannelsGroup + "_MCGID_" + groupsMap[origChannelName];
        }

        if (origChannelName == "GLOBAL"){
            channelID = GlobalChannel;
        }
        if (origChannelName == "Event"){
            channelID = EventChannel;
        }

        if (channelID === 0) {
            resolved = false;
            channelID = "2";// Main
        }

        return returnCustomID(channelID, resolved, channel, origChannelName);
    }

    function resolveChannelColor(channelID, channelName) {
        var color = "";
        try {
            color = $(".chatChannel[data-id=\"" + channelName + "\"]").css("background-color");
        } catch (e) {
            color = "";
        }
        if (color === "" || typeof color === "undefined") {
            $(".chatChannel").each(function(i,e){
                if ($(e).attr("data-id") === channelName) {
                    color = $(e).css("background-color");
                }
            });
        }
        if (channelID === ServerMessagesChannel) {
            color = "#007f23";
        } else if (channelID === CMDResposeChannel) {
            color = "#317D80";
        } else if (channelID === WhispersChannel) {
            color = "#DE3937"; //FF3
        } else if (channelID === WiresChannel) {
            color = "#39DE37"; //FF3
        }
        return color;
    }

    function updateChannelList(channel) {
        var tab = $("#channelTab" + channel.channelID);
        if (tab.length === 0) {
            if (channel.muted) {
                return;
            }
            $("<div>")
                .attr("id", "channelTab" + channel.channelID)
                .attr("data-channel", channel.channelID)
                .addClass("border2 ui-element channelTab")
                .css({
                    color: channel.channelColor
                })
                .appendTo("#channelTabList");
            tab = $("#channelTab" + channel.channelID);
        }
        var channelTabLabel = "#"+channel.channelName;
        tab.text(channelTabLabel).css({color: channel.channelColor});
        if (channel.newMessages && !channel.muted) {

            if ($(".Ch"+channel.channelID+"Badge").length === 0) {
            var badge = $("<span>")
                .addClass("ChBadge")
                .addClass("border2")
                .addClass("Ch"+channel.channelID+"Badge")
                .text(channel.newMessagesCount)
                .appendTo("#channelTab"+channel.channelID);
            } else {
                $(".Ch"+channel.channelID+"Badge").text(channel.newMessagesCount);
            }
        }
        if (channel.muted) {
            $("<span>")
                .addClass("ChBadge fa fa-times border2 ui-element")
                .appendTo("#channelTab"+channel.channelID);
        }
    }

    function addSettingsTab() {
        $("<div>")
            .attr("id", "ToASettings")
            .addClass("border2 ui-element ToASettings")
            .prependTo("#channelTabList");
        $("<span>")
            .addClass("fa")
            .addClass("fa-cogs")
            .css({
                color: "#ffd700",
                fontWeight: 500
            })
            .appendTo("#ToASettings");
    }

    function randomInt(min, max) {
        return Math.round( Math.random() * ( max - min ) ) + min;
    }

    function randomColor() {
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += Math.floor(Math.random()*15).toString(16);
        }
        return color;
    }

    function randomName(min, max) {
        var a = "aeiou".split("");
        var b = "rtzpsdfghklmnbvc".split("");
        var l = randomInt(min, max);
        var name = "";
        for (var i = 0; i < l; i++)
        {
            var charset = i % 2 === 0 ? a : b;
            if ( i === 0 )
            {
                charset = Math.random() < 0.5 ? a : b;
            }
            var letter = charset[randomInt(0, charset.length - 1)];
            name += i === 0 ? letter.toUpperCase() : letter;
        }
        return name;
    }

    function ucfirst(str) {
        var result  = "";
        var first   = str.charAt(0).toUpperCase();

        return first + str.substr(1);
    }

    function loadDependencies() {
        //<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
        $("<link>")
            .attr({
                rel: "stylesheet",
                href: "//maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"
            })
            .appendTo("head");
    }

    function prepareHTML() {
        $("<div>")
            .attr("id", "channelTabListWrapper")
            .insertBefore("#chatMessageListWrapper");
        $("<div>")
            .attr("id", "channelTabList")
            .appendTo("#channelTabListWrapper");

        /**
         * Preview channel
         */
         $("<div>")
            .attr("id", "channelPreviewWrapper")
            .addClass("border2")
            .addClass("ui-element")
            .appendTo("body");

        $("<h5>")
            .css("text-align", "center")
            .appendTo("#channelPreviewWrapper");

        $("<div>")
            .attr("id", "channelPreviewActions")
            .appendTo("#channelPreviewWrapper");

        $("<span>")
            .addClass("border2 ui-element fa fa-check sapphire cpa")
            .attr("id", "CPAReset")
            .attr("title", "Mark as read")
            .appendTo("#channelPreviewActions");

        $("<span>")
            .addClass("border2 ui-element fa fa-eraser emerald cpa")
            .attr("id", "CPAPurge")
            .attr("title", "Clear channel of all messages")
            .appendTo("#channelPreviewActions");

        $("<span>")
            .addClass("border2 ui-element fa fa-unlink ruby cpa")
            .attr("id", "CPARemove")
            .attr("title", "Clear the channel and remove it from tabs\nIf any new messages pop into it, it will come back.")
            .appendTo("#channelPreviewActions");

        $("<div>")
            .attr("id", "channelPreviewContent")
            .appendTo("#channelPreviewWrapper");

        $("<div>")
            .attr("id", "channelPreviewMessages")
            .css({
                padding:"2px",
            })
            .appendTo("#channelPreviewContent");
        $("#channelPreviewContent").mCustomScrollbar({scrollInertia: 250,mouseWheel:{scrollAmount: 40}});

        /**
         * context menu
         */

         $("<div>")
            .attr("id", "channelTabContextMenu")
            .addClass("ui-element navSection")
            .appendTo("body");

        $("<a>")
            .attr("id", "chTabCTMenuMute")
            .text("Mute channel")
            .addClass("cctmButton")
            .appendTo("#channelTabContextMenu");

        $("<span>")
            .addClass("ui-element fa fa-bell-slash titanium")
            .prependTo("#chTabCTMenuMute");

        $("<a>")
            .attr("id", "chTabCTMenuUnMute")
            .text("Un-mute channel")
            .addClass("cctmButton")
            .appendTo("#channelTabContextMenu");

        $("<span>")
            .addClass("ui-element fa fa-bell platinum")
            .prependTo("#chTabCTMenuUnMute");

        $("<a>")
            .attr("id", "chTabCTMenuReset")
            .text("Mark as read")
            .addClass("cctmButton")
            .appendTo("#channelTabContextMenu");

        $("<span>")
            .addClass("ui-element fa fa-check sapphire")
            .prependTo("#chTabCTMenuReset");

        $("<a>")
            .attr("id", "chTabCTMenuLast")
            .text("Show history")
            .addClass("cctmButton")
            .appendTo("#channelTabContextMenu");

        $("<span>")
            .addClass("ui-element fa fa-history materials")
            .prependTo("#chTabCTMenuLast");

        $("<a>")
            .attr("id", "chTabCTMenuPurge")
            .text("Purge messages")
            .addClass("cctmButton")
            .appendTo("#channelTabContextMenu");

        $("<span>")
            .addClass("ui-element fa fa-eraser emerald")
            .prependTo("#chTabCTMenuPurge");

        $("<a>")
            .attr("id", "chTabCTMenuRemove")
            .text("Remove from tabs")
            .addClass("cctmButton")
            .appendTo("#channelTabContextMenu");

        $("<span>")
            .addClass("ui-element fa fa-unlink ruby")
            .prependTo("#chTabCTMenuRemove");

        $("<a>")
            .attr("id", "chTabCTMenuLeave")
            .text("Leave channel")
            .addClass("cctmButton")
            .appendTo("#channelTabContextMenu");

        $("<span>")
            .addClass("ui-element fa fa-arrow-right diamond")
            .prependTo("#chTabCTMenuLeave");

        $("<a>")
            .attr("id", "chTabCTMenuColor")
            .text("Change color")
            .addClass("cctmButton")
            .appendTo("#channelTabContextMenu");

        $("<span>")
            .addClass("ui-element fa fa-crosshairs crystals")
            .prependTo("#chTabCTMenuColor");


        $("#channelTabContextMenu").hide();

        /**
         * settings
         */
        $("<div>")
            .attr("id", "ToASettingsWindow")
            .addClass("border2 ui-element")
            .appendTo("body");

        $("<h5>")
            .css("text-align", "center")
            .text("TabsOfAvabur v"+options.version+" - Settings")
            .appendTo("#ToASettingsWindow");

        $("<div>")
            .attr("id","ToASWMenu")
            .appendTo("#ToASettingsWindow");

        var t = $("<div>")
            .addClass("col-sm-6 text-center");

        var l = t.clone().appendTo("#ToASWMenu");
        var r = t.clone().appendTo("#ToASWMenu");

        $("<button>")
            .attr("type", "button")
            .attr("id", "ToAScriptOptions")
            .addClass("btn btn-primary btn-block")
            .text("Script options")
            .appendTo(l);

        $("<button>")
            .attr("type", "button")
            .attr("id", "ToAChannelMerger")
            .addClass("btn btn-primary btn-block")
            .text("(WIP) Channel Manager")
            .appendTo(r);

        $("<div>").addClass("clearfix").appendTo("#ToASettingsWindow");

        $("<div>")
            .attr("id", "ToASettingsWindowContent")
            .appendTo("#ToASettingsWindow");

        $("<div>")
            .attr("id", "ToASettingsScriptSettings")
            .appendTo("#ToASettingsWindowContent");

        var st  = $("<h6>").addClass("text-center");
        var t2  = $("<label>");
        var t2a = $("<input>").attr({"type":"checkbox"}).addClass("settingsChanger");
        var t2w = t.clone().removeClass("text-center");

        st.clone().text("Script settings").appendTo("#ToASettingsScriptSettings");
        // purge channel
        t2w.clone()
            .append(
                t2.clone()
                    .text(" Allow channel message purging")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","purge")
                            .prop("checked", options.scriptSettings.purge)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");
        // purge and remove
        t2w.clone()
            .append(
                t2.clone()
                    .text(" Allow removing channel form tabs")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","channel_remove")
                            .prop("checked", options.scriptSettings.channel_remove)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // preview
        t2w.clone()
            .append(
                t2.clone()
                    .text(" Preview channel on tab hover")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","preview")
                            .prop("checked", options.scriptSettings.preview)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // mark read
        t2w.clone()
            .append(
                t2.clone()
                    .text(" Allow marking channels as read")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","preview_reset")
                            .prop("checked", options.scriptSettings.preview_reset)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // mark read
        t2w.clone()
            .append(
                t2.clone()
                    .text(" Group wires into their own channel")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","group_wires")
                            .prop("checked", options.scriptSettings.group_wires)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // @mention
        t2w.clone()
            .append(
                t2.clone()
                    .text(" Make @username clickable")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","at_username")
                            .prop("checked", options.scriptSettings.at_username)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // /join channel password
        t2w.clone()
            .append(
                t2.clone()
                    .html(" Make '/join channel' clickable. <span class='fa fa-info-circle ToATooltip' title='After you click on the link, the chat message will be filled with a /join channel text.' data-toggle='tooltip' data-placement='top' data-html='true'></span>")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","join_channel_link")
                            .prop("checked", options.scriptSettings.join_channel_link)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // /join channel password
        t2w.clone()
            .append(
                t2.clone()
                    .html(" Autojoin clicked channel. <span class='fa fa-info-circle ToATooltip' title='This is designed to work with the previous option to replace the /join <a>channel</a> message.<br>If this option is enabled, the prefilled message to join a channel will be automatically sent.' data-toggle='tooltip' data-placement='top' data-html='true'></span>")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","auto_join")
                            .prop("checked", options.scriptSettings.auto_join)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // profileOptionsTooltip - Nickname
        t2w.clone()
            .append(
                t2.clone()
                    .html(" Enable Ni[c]kname shortcut")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","profile_tooltip_nickname")
                            .prop("checked", options.scriptSettings.profile_tooltip_nickname)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // profileOptionsTooltip - @mention
        t2w.clone()
            .append(
                t2.clone()
                    .html(" Enable @m[e]ntion shortcut")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","profile_tooltip_mention")
                            .prop("checked", options.scriptSettings.profile_tooltip_mention)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        // profileOptionsTooltip - Nickname
        t2w.clone()
            .append(
                t2.clone()
                    .html(" Enable [Q]uickscope shortcut")
                    .prepend(
                        t2a.clone()
                            .attr("data-setting","profile_tooltip_quickscope")
                            .prop("checked", options.scriptSettings.profile_tooltip_quickscope)
                    )
            )
            .appendTo("#ToASettingsScriptSettings");

        $("<div>").addClass("clearfix").appendTo("#ToASettingsScriptSettings");

        $("<div>")
            .attr("id", "ToASettingsChannelMerger")
            .appendTo("#ToASettingsWindowContent");

        st.clone().text("Muted channels").appendTo("#ToASettingsChannelMerger");

        /**
         * muted channels content added on settings window open
         */

        $("<div>")
            .attr("id", "ToASChMMutedChannelsHolder")
            .addClass("border2 ui-element ToASChannelsHolder")
            .appendTo("#ToASettingsChannelMerger");

        // clearfix muted channels
        $("<div>").addClass("clearfix").appendTo("#ToASettingsWindow");

        /**
         * channel merger content added on setting window open
         */
        st.clone().text("Channel Merger").appendTo("#ToASettingsChannelMerger");

        // holder for all channels - script created ones
        $("<div>")
            .attr("id", "ToASChMMergedChannelsHolder")
            .addClass("border2 ui-element ToASChannelsHolder incsort")
            .appendTo("#ToASettingsChannelMerger")
            .before(t2.clone().text("Available Channels:"));

        // holder for groups
        $("<div>")
            .attr("id", "ToASChMMergedChannelsGroupsHolder")
            .addClass("ui-element ToASChannelsHolder")
            .appendTo("#ToASettingsChannelMerger")
            .before();
        var chgl = t2.clone().text("Channel Groups:").insertBefore("#ToASChMMergedChannelsGroupsHolder");
        $("<button>").addClass("fa fa-plus btn btn-primary emerald pull-right btn-xs").attr("id", "ToASChMAddGroup").insertAfter(chgl);

        // clearfix channel merger
        $("<div>").addClass("clearfix").appendTo("#ToASettingsChannelMerger");

        // clearfix settings window
        $("<div>").addClass("clearfix").appendTo("#ToASettingsWindow");

        $("<div>")
            .attr("id", "ToASettingsSaved")
            .text("Settings have been saved and are applied")
            .addClass("text-center small")
            .appendTo("#ToASettingsWindow");

        // close button
        $("<span>")
            .attr("id", "ToASettingsWindowClose")
            .addClass("fa fa-times border2 ui-element")
            .appendTo("#ToASettingsWindow");

        /**
         * profile tooltip extras
         */
        var ToAExtraDivider = $("<span>").text(" · ");

        ToAExtraDivider.clone().addClass("ToAPONickname").toggleClass("hidden", !options.scriptSettings.profile_tooltip_nickname).appendTo("#profileOptionTooltip");
        $("<a>").addClass("ToAPONickname").toggleClass("hidden", !options.scriptSettings.profile_tooltip_nickname).text("Ni[c]kname").attr("id", "profileOptionNick").appendTo("#profileOptionTooltip");

        ToAExtraDivider.clone().addClass("ToAPOMention").toggleClass("hidden", !options.scriptSettings.profile_tooltip_mention).appendTo("#profileOptionTooltip");
        $("<a>").addClass("ToAPOMention").toggleClass("hidden", !options.scriptSettings.profile_tooltip_mention).text("@m[e]ntion").attr("id", "profileOptionAt").appendTo("#profileOptionTooltip");

        ToAExtraDivider.clone().addClass("ToAPOQuickscope").toggleClass("hidden", !options.scriptSettings.profile_tooltip_quickscope).appendTo("#profileOptionTooltip");
        $("<a>").addClass("ToAPOQuickscope").toggleClass("hidden", !options.scriptSettings.profile_tooltip_quickscope).text("[Q]uickscope").attr("id", "profileOptionQuickScope").appendTo("#profileOptionTooltip");

        // init
        $("#ToASettingsWindow").hide();
        $("#ToASettingsScriptSettings").hide();
        $("#ToASettingsChannelMerger").hide();
        $("#ToASettingsSaved").hide();
        $(".ToATooltip").tooltip();
        $("#ToASettingsWindow").draggable({handle:"h5"});
        /**
         * CSS
         */
        $("<style>").text(""+
            "#channelTabListWrapper{margin-bottom: -1px;position: relative;}#channelTabList{overflow: hidden;border-radius: 4px 4px 0 0;font-size: 9pt;}\n"+
            ".ToASettings, .channelTab{cursor: pointer;margin: 2px 2px 0 2px;border-radius: 4px 4px 0 0;display: inline-block;padding: 2px 5px;position:relative;}\n"+
            "#chatMessageList li:not(.processed){display: none;}\n"+
            "/*#chatMessageList li.processed{display: list-item;}*/\n"+
            ".ChBadge{display:inline-block;margin-left:3px;padding:1px 4px;font-size:7pt;vertical-align:top;border-color:green!important;color:#fff !important;}\n"+
            ".muted-badge{position:absolute;left:5px;top:5px;}\n"+
            ".mCSB_scrollTools.mCSB_scrollTools_horizontal{top:15px!important;}\n"+
            ".mCSB_horizontal.mCSB_inside>.mCSB_container{margin-bottom: 0 !important;}\n"+
            "#channelPreviewWrapper{position:absolute;font-size:9pt;min-width:350px;max-width:500px;background-color:rgba(0,0,0,.75)!important;}\n"+
            "#channelPreviewContent{max-height: 250px;overflow-y: hidden;}\n"+
            "#channelPreviewActions{position:absolute;right:2px;top:2px;}\n"+
            ".cpa{display:inline-block;margin-left:2px;padding: 1px 3px;font-size:9pt;vertical-align:top;cursor:pointer;}\n"+
            "#channelTabContextMenu{position:absolute;width:175px;background-color:rgba(0,0,0,.75)!important;}\n"+
            ".cctmButton{text-align:left!important;}\n"+
            "#ToASettingsWindow{position:absolute!important;width:50%;min-width: 500px;top:150px;left:25%;background-color:rgba(0,0,0,.75)!important;z-index:150;}\n"+
            ".cctmButton>span{margin: 0 15px 0 5px;font-size:8.5pt;padding:2px;}\n"+
            "#channelTabContextMenu .cctmButton {display:block;width:100%;border-left:0;}\n"+
            "#ToASettingsWindowContent label{font-size:10pt;}\n"+
            "#ToASettingsWindowContent {padding-top:5px;}\n"+
            "#ToASettingsWindowClose{position:absolute;right:2px;top:2px;color:#f00;padding:1px 4px;cursor:pointer;}\n"+
            ".ToASChannelsHolder{padding: 2px;margin:3px auto;width:97%;}\n"+
            ".ChMChannelWrapper{display:inline-block;margin:1px 2px;padding:1px 4px;font-size:10pt;}\n"+
            ".ChMMChX{margin-right:4px;padding:1px 2px;cursor:pointer;}\n"+
            "#ToASettingsWindow .tooltip{width:350px;}\n"+
            "#ToASettingsWindow .tooltip-inner{max-width:100%;}\n"+
            ".hand{curson: pointer;}\n"+
            "#ToASChMAddGroup, .ToASChMChGRemove{margin-top: 0;}\n"+
            ".incsort{border-radius: 0 !important; margin: 3px 1px; padding: 2px;}\n"+
            ".chTabSelected {background-image: " + $("#navigationWrapper > h5").css("background-image")+" !important;}\n"+
            "#ToASChMMergedChannelsGroupsHolder > .incsort > span:nth-of-type(1) {border-left-width: 7px !important;}\n"+
            "@media screen and (max-width:768px){#ToASettingsWindow{left:5%;}}")
        .appendTo("body");
    }

    var SSN = 0;
    function saveOptions() {
        clearTimeout(SSN);
        var opts = JSON.stringify(options);
        localStorage.setItem("ToAOPTS", opts);
        $("#ToASettingsSaved").show();
        SSN = setTimeout(function(){
            $("#ToASettingsSaved").fadeOut();
        }, 3E3);
    }

    function changeSetting(e) {
        var setting = $(e).attr("data-setting");
        options.scriptSettings[setting] = $(e).prop("checked");
        var match = setting.match("^profile_tooltip_([a-z]+)");
        if (match !== null) {
            var POOption = ucfirst(match[1]);
            $(".ToAPO"+POOption).toggleClass("hidden");
        }
        saveOptions();
    }

    function resetUnreadCount() {
        var channelID                           = hoveringOverTab;
        channelLog[channelID].newMessages       = false;
        channelLog[channelID].newMessagesCount  = 0;
        updateChannelList(channelLog[channelID]);
        $("#channelPreviewWrapper").hide();
        $("#channelTabContextMenu").hide();
    }

    function purgeChannel(andRemove,confirmToo) {
        andRemove       = typeof andRemove==="undefined"?options.scriptSettings.channel_remove:andRemove;
        confirmToo      = typeof confirmToo==="undefined"?false:confirmToo;
        var channelID   = hoveringOverTab;
        var channelName = channelLog[channelID].channelName;
        var confirmText = "Are you sure you want purge the \""+channelName+"\" channel"+(andRemove?" and remove it from tabs":"")+"?\nThis only affects your screen.";
        if (confirmToo || window.confirm(confirmText)){
            $(".chc_"+channelID).remove();
            resetUnreadCount();
            if (andRemove) {
                $("#channelTab"+channelID).remove();
                //delete channelLog[channelID];
                $("#channelTabMain").click();
                $("#channelPreviewWrapper").hide();
            }

        }
    }

    function loadOptions(){
        var stored = localStorage.getItem("ToAOPTS");
        try {
            var parsed = JSON.parse(stored);
            if (typeof parsed.scriptSettings !== "undefined"){
                if (typeof parsed.scriptSettings.purge !== "undefined") {
                    options.scriptSettings.purge = !!parsed.scriptSettings.purge;
                }
                if (typeof parsed.scriptSettings.channel_remove !== "undefined") {
                    options.scriptSettings.channel_remove = !!parsed.scriptSettings.channel_remove;
                }
                if (typeof parsed.scriptSettings.preview !== "undefined") {
                    options.scriptSettings.preview = !!parsed.scriptSettings.preview;
                }
                if (typeof parsed.scriptSettings.preview_reset !== "undefined") {
                    options.scriptSettings.preview_reset = !!parsed.scriptSettings.preview_reset;
                }
                if (typeof parsed.scriptSettings.group_wires !== "undefined") {
                    options.scriptSettings.group_wires = !!parsed.scriptSettings.group_wires;
                }
                if (typeof parsed.scriptSettings.at_username !== "undefined") {
                    options.scriptSettings.at_username = !!parsed.scriptSettings.at_username;
                }
                if (typeof parsed.scriptSettings.join_channel_link !== "undefined") {
                    options.scriptSettings.join_channel_link = !!parsed.scriptSettings.join_channel_link;
                }
                if (typeof parsed.scriptSettings.auto_join !== "undefined") {
                    options.scriptSettings.auto_join = !!parsed.scriptSettings.auto_join;
                }
                if (typeof parsed.scriptSettings.profile_tooltip_nickname !== "undefined") {
                    options.scriptSettings.profile_tooltip_nickname = !!parsed.scriptSettings.profile_tooltip_nickname;
                }
                if (typeof parsed.scriptSettings.profile_tooltip_mention !== "undefined") {
                    options.scriptSettings.profile_tooltip_mention = !!parsed.scriptSettings.profile_tooltip_mention;
                }
                if (typeof parsed.scriptSettings.profile_tooltip_quickscope !== "undefined") {
                    options.scriptSettings.profile_tooltip_quickscope = !!parsed.scriptSettings.profile_tooltip_quickscope;
                }
            }
            if (typeof parsed.channelsSettings !== "undefined" && typeof parsed.version !== "undefined") {
                if (typeof parsed.channelsSettings.mutedChannels !== "undefined" && Array.isArray(parsed.channelsSettings.mutedChannels)) {
                    options.channelsSettings.mutedChannels = parsed.channelsSettings.mutedChannels;
                }
                if (typeof parsed.channelsSettings.channelMerger !== "undefined") {
                    if (typeof parsed.channelsSettings.channelMerger.groups !== "undefined" && Array.isArray(parsed.channelsSettings.channelMerger.groups)) {
                        for (var ccg in parsed.channelsSettings.channelMerger.groups) {
                            var groupName = parsed.channelsSettings.channelMerger.groups[ccg];
                            if (typeof groupName === "string" && options.channelsSettings.channelMerger.groups.indexOf(groupName) === -1) {
                                options.channelsSettings.channelMerger.groups.push(groupName);
                                groupsMap[groupName] = randomName(3,5) + "_" + randomInt(5,9);
                            }
                        }
                    }
                    if (typeof parsed.channelsSettings.channelMerger.mapping !== "undefined" && typeof parsed.channelsSettings.channelMerger.mapping === "object") {
                        options.channelsSettings.channelMerger.mapping = parsed.channelsSettings.channelMerger.mapping;
                    }
                    if (typeof parsed.channelsSettings.channelMerger.defaultChannels !== "undefined" && typeof parsed.channelsSettings.channelMerger.defaultChannels === "object") {
                        options.channelsSettings.channelMerger.defaultChannels = parsed.channelsSettings.channelMerger.defaultChannels;
                    }
                }
            }
            //$.extend(true, options, parsed || {});
            saveOptions();
        } catch(e) {
            localStorage.removeItem("ToAOPTS");
            // console.log(e);
        }
    }

    function createChannelEntry(newChannel, newChannelID, newChannelColor) {
        channelLog[newChannelID] = {
            channelName: newChannel,
            channelID: newChannelID,
            channelColor: newChannelColor,
            messages: 0,
            newMessages: false,
            newMessagesCount: 0,
            muted: options.channelsSettings.mutedChannels.indexOf(newChannel) !== -1
        };
    }

    function loadAllChannels() {
        $("#chatChannel option").each(function(i,e){
            var channelName     = $(e).text();
            var channelInfo     = resolveChannelID(channelName);
            var channelID       = channelInfo.cID;
            var channelColor    = resolveChannelColor(channelID, channelInfo.name);
            if (typeof channelLog[channelID] === "undefined") {
                createChannelEntry(channelInfo.on, channelID, channelColor);
            }
        });
        if (typeof channelLog[GlobalChannel] === "undefined") {
            createChannelEntry("GLOBAL", GlobalChannel, resolveChannelColor(GlobalChannel, "Global"));
        }
        if (typeof channelLog[EventChannel] === "undefined") {
            createChannelEntry("Event", EventChannel, resolveChannelColor(EventChannel, "Event"));
        }
    }

    function quickScopeUser(){
        if (!options.scriptSettings.profile_tooltip_quickscope) {
            return false;
        }
        $("#chatMessage").text("/whois "+$("#profileOptionTooltip").attr("data-username"));
        $("#chatSendMessage").click();
        $("#profileOptionTooltip").hide();
        setTimeout(function(){$("#channelTab"+CMDResposeChannel).click();},1000);
    }

    function mentionUser() {
        if (!options.scriptSettings.profile_tooltip_mention) {
            return false;
        }
        $("#chatMessage").append(" @"+$("#profileOptionTooltip").attr("data-username")).focus();
        $("#profileOptionTooltip").hide();
    }

    function nicknameUser() {
        if (!options.scriptSettings.profile_tooltip_nickname) {
            return false;
        }
        var username = $("#profileOptionTooltip").attr("data-username");
        $.confirm({
            "title"     : "Nickname for "+username,
            "message"   : "<input type=\"text\" id=\"ToASPONicknameName\" style=\"width:100%;\" placeholder=\"Leave blank to unnickname\">",
            "buttons"   : {
                "Nickname"       : {
                    "class"     : "green",
                    "action"    : function() {
                        var newNick = $("#ToASPONicknameName").val();
                        if (newNick.match(/^\s*$/)) {
                            $("#chatMessage").text("/unnickname "+username);
                        } else {
                            $("#chatMessage").text("/nickname "+username+" "+newNick);
                        }
                        $("#chatSendMessage").click();
                    }
                },
                "Cancel"       : {
                    "class"     : "red",
                    "action"    : function() {
                    }
                }
            }
        });
        setTimeout(function() {
            $("#ToASPONicknameName").val("").focus();
        }, 500);
    }

    function isScriptChannel(channelID) {
        return scriptChannels.indexOf(channelID) !== -1;
    }

    function updateGroupName() {
        var newName     = $(this).val();
        var groupID     = $(this).attr("data-gnid");
        var origName    = options.channelsSettings.channelMerger.groups[groupID];
        var origGID     = groupsMap[origName];
        delete groupsMap[origName];
        groupsMap[newName] = origGID;
        options.channelsSettings.channelMerger.groups[groupID] = newName;
        $(this).parent().attr("data-group", newName);
        for (var x in options.channelsSettings.channelMerger.mapping) {
            if (options.channelsSettings.channelMerger.mapping[x] === origName) {
                options.channelsSettings.channelMerger.mapping[x] = newName;
            }
        }
        var groupChannelID = MergedChannelsGroup + "_MCGID_" + groupsMap[newName];
        if (typeof channelLog[groupChannelID] !== "undefined") {
            channelLog[groupChannelID].channelName = newName;
            updateChannelList(channelLog[groupChannelID]);
        }
        saveOptions();
    }

    function addChannelGroup(i, name) {
        var mcgw    = $("<div>").addClass("border2 incsort input-group");

        var mcgigb  = $("<div>").addClass("input-group-btn");

        var mcgdb   = $("<button>").addClass("ToASChMChGRemove btn btn-primary btn-xs ruby");
        var mcgn    = $("<input>").attr({type:"text",name:"mcg_cn"}).addClass("ToASChMmcgName");

        var mcgID = MergedChannelsGroup + "_MCGID_" + groupsMap[name];
        var wrapper = mcgw.clone().attr({"id": mcgID,"data-group": name}).appendTo("#ToASChMMergedChannelsGroupsHolder");

        var igb = mcgigb.clone().appendTo(wrapper);
        mcgdb.clone().attr("data-gnid", i).html("<i class=\"fa fa-times\"></i>").appendTo(igb);
        mcgn.clone().val(name).attr("data-gnid", i).appendTo(wrapper);
    }

    function handleAjaxSuccess(a,res,req,json) {
        var decide = "";
        var valid = ["up", "down"];
        if (json.hasOwnProperty("cs")) {
            if (valid.indexOf(json.cs) !== -1) {
                
                decide = json.cs;
            }
        } else if (json.hasOwnProperty("p") && json.p.hasOwnProperty("chatScroll")) {
            if (valid.indexOf(json.p.chatScroll) !== -1) {
                decide = json.p.chatScroll;
            }
        }
        if (decide !== "") {
            chatDirection = decide;
        }
    }

    function versionCompare(v1, v2) {
        var regex   = new RegExp("(\.0+)+");
            v1      = v1.replace(regex, "").split(".");
            v2      = v2.replace(regex, "").split(".");
        var min     = Math.min(v1.length, v2.length);

        var diff = 0;
        for (var i = 0; i < min; i++) {
            diff = parseInt(v1[i], 10) - parseInt(v2[i], 10);
            if (diff !== 0) {
                return diff;
            }
        }

        return v1.length - v2.length;
    }

    function checkForUpdate() {
        var version = "";
        $.get(internalUpdateUrl).done(function(res){
            var match = atob(res.content).match(/\/\/\s+@version\s+([^\n]+)/);
                version = match[1];

            if (versionCompare(options.version, version) < 0) {
                var message = "<li class=\"chat_notification\">TabsOfAvabur has been updated to version "+version+"! <a href=\"https://github.com/edvordo/TabsOfAvabur/raw/master/TabsOfAvabur.user.js\" target=\"_blank\">Update</a> | <a href=\"https://github.com/edvordo/TabsOfAvabur/releases\" target=\"_blank\">Changelog</a></li>";
                if (chatDirection === "up") {
                    $("#chatMessageList").prepend(message);
                } else {
                    $("#chatMessageList").append(message);
                    $("#chatMessageWrapper").mCustomScrollbar("scrollTo", "bottom");
                }
            } else {
                checkForUpdateTimer = setTimeout(checkForUpdate, 24*60*60*1000);
            }
        });
    }

    function loadMessages(t) {
        if ($("#chatChannel option").length > 2) {
            $("#chatMessageList li:not(.processed)").each(function(i,e){
                var plainText       = $(e).text();
                // lets get rid of staff stuff
                plainText           = plainText.replace(/^\[X\]\s*/, "");
                // now clean up spaces
                plainText           = plainText.replace(/\s+/g, " ");
                // default message format [11:11:11] [Channel] (optional) the rest of the message
                var defaultMsg      = plainText.match(/^\[([^\]]+)\]\s*(\[([^\]]+)\])?\s*(.*)/);
                // clan MoTD: [11 Nov, 1111] Clan Message of the Day:
                var isClanMoTD      = plainText.replace(/^\[[0-9]+\s+[a-zA-Z]+\,\s*[0-9]+\]\s*/, "").indexOf("Clan Message of the Day:") === 0;
                // clan MoTD: [11 Nov, 1111] Message of the Day:
                var isRoAMoTD       = plainText.replace(/^\[[0-9]+\s+[a-zA-Z]+\,\s*[0-9]+\]\s*/, "").indexOf("Message of the Day:") === 0;
                // Staff Server Messages [11:11:11] [ Whatever the hell. ]
                var isServerMsg     = plainText.match(/^\[[^\]]+\]\s*\[\s+.*\s+]$/);
                // whisper detection
                var isWhisper       = plainText.match(/^\[[^\]]+\]\s*Whisper\s*(to|from)\s*([^:]+)/);
                    isWhisper       = isWhisper && $(this).closest("li").find("span:eq(2)").text().indexOf("Whisper") === 0;
                // wire detection
                var isWire          = plainText.match(/^\[[^\]]+\]\s*(You|[a-zA-Z]+)\s*wired\s*.*\s*(you|[a-zA-Z]+)\.$/);
                // [11:11:11] Username sent a whatever to you.

                var isChatNotif     = $(e).children(".chat_notification").length > 0 || $(e).hasClass("chat_notification");
                var isChatReconnect = $(e).attr("id") === "websocket_reconnect_line";

                var channel = "";
                if (currentChannel.match(/^[0-9]+$/)){
                    channel = channelLog[currentChannel].channelName;
                } else if (currentChannel.indexOf(MergedChannelsGroup) === 0) {
                    channel = channelLog[currentChannel].channelName;
                } else if (scriptChannels.indexOf(currentChannel) !== -1) {
                    channel = channelLog[currentChannel].channelName;
                } else {
                    channel = currentChannel;
                }
                // var channel         = currentChannel=="Main" ? currentChannel : ;
                var channelInfo     = resolveChannelID(channel);

                if (defaultMsg !== null) {
                    channel         = typeof defaultMsg[3] === "undefined" ? "Main" : defaultMsg[3];
                    if (channel !== "Main") {
                        var validate = $(this).closest("li").find("span:eq(2)").text() === "[";
                        var quickscopeinfo = channel.match(/^Level:\s+[0-9]+/);
                        if (!validate && quickscopeinfo === null) {
                            channel = "Main";
                        }
                    }
                    channelInfo     = resolveChannelID(channel);
                }
                if (isClanMoTD) {
                    channel         = "CLAN";
                    channelInfo     = resolveChannelID(channel);
                } else if (isServerMsg){
                    channel         = "Server Messages";
                    channelInfo     = resolveChannelID(channel);
                } else if (isWhisper){
                    channel         = "Whispers Log";
                    channelInfo     = resolveChannelID(channel);
                } else if (isWire && options.scriptSettings.group_wires){
                    channel         = "Wires Log";
                    channelInfo     = resolveChannelID(channel);
                }
                var channelID       = channelInfo.cID;
                    channel         = channelInfo.on;
                if (
                    channelID !== CMDResposeChannel &&
                    channelID !== ServerMessagesChannel &&
                    channelID !== WiresChannel &&
                    ( isChatNotif || isChatReconnect)
                ) {

                    channelID       = channelInfo.cID;
                }
                // console.log("chinfo:");
                // console.log(channelInfo);
                if (channelID === CMDResposeChannel){
                    channel         = "Info Channel";
                }
                var channelColor    = resolveChannelColor(channelID, channelInfo.name);

                if (typeof options.channelsSettings.channelMerger.mapping[channel] !== "undefined") {
                    var groupName   = options.channelsSettings.channelMerger.mapping[channel];
                    var groupID     = options.channelsSettings.channelMerger.groups.indexOf(groupName);
                    channelID       = MergedChannelsGroup + "_MCGID_" + groupsMap[groupName];
                    channel         = groupName;
                    channelColor    = randomColor();
                }
                 // console.log("cl",currentChannel, "cID", channelID);
                if (currentChannel != channelID){
                    $(e).addClass("hidden");
                } /*else {
                    $(e).show();
                }*/
                $(e).addClass("processed");
                $(e).addClass("chc_" + channelID);
                if (typeof channelLog[channelID] === "undefined") {
                    createChannelEntry(channel, channelID, channelColor);
                    /*channelLog[channelID] = {
                        channelName: channel,
                        channelID: channelID,
                        channelColor: channelColor,
                        messages: 0,
                        newMessages: false,
                        newMessagesCount: 0,
                        muted: options.channelsSettings.mutedChannels.indexOf(channel) !== -1
                    };*/
                }
                if (channelID != currentChannel){
                    channelLog[channelID].newMessages = true;
                    channelLog[channelID].newMessagesCount++;
                }
                channelLog[channelID].messages++;
                if (options.channelsSettings.mutedChannels.indexOf(channel) !== -1){
                    $(e).remove();
                }

                if (options.scriptSettings.at_username) {
                    $(e).html($(e).html().replace(/\@([a-zA-Z]+)/g,"@<a class=\"profileLink\">$1</a>"));
                }

                if (options.scriptSettings.join_channel_link) {
                    $(e).html($(e).html().replace(/\/join\s+([^\s]+)\s*([^\s<]+)?/, "/join <a class=\"joinChannel\">$1</a> <span class=\"jcPWD\">$2</span>"));
                }

                if (plainText.match(/tabs\s+of\s+avabur/i) !== null) {
                    clearTimeout(checkForUpdateTimer);
                    checkForUpdateTimer = setTimeout(checkForUpdate, randomInt(30, 120) * 1000);
                }

                updateChannelList(channelLog[channelID]);
            });
        }

        if (typeof t === "undefined") {
            setTimeout(loadMessages, 500);
        }
        if ($("#chatWrapper>div:nth-child(2)").attr("id") === "chatMessageWrapper") {
            $("#channelTabListWrapper").insertBefore("#chatMessageListWrapper");
        }
    }

    function init() {
        loadOptions();
        loadDependencies();
        prepareHTML();
        addSettingsTab();
        loadMessages();

        $("#channelTabListWrapper").mCustomScrollbar({axis:"x",advanced:{autoExpandHorizontalScroll:true}});
        $("#channelTabList").sortable({items:".channelTab",distance: 5});
        $("#channelTabList").disableSelection();
        setTimeout(function(){$("#channelTabList > div:nth-child(2)").click();},2000);
        checkForUpdateTimer = setTimeout(checkForUpdate,30000);
    }

    $(document).on("ajaxSuccess", handleAjaxSuccess);

    $(document).on("change", ".settingsChanger", function(e){
        changeSetting(this);
    });

    $(document).on("click", ".channelTab", function(e){
        $(".channelTab").removeClass("chTabSelected");
        var channelID = $(this).attr("data-channel");
        channelLog[channelID].newMessages = false;
        channelLog[channelID].newMessagesCount = 0;
        updateChannelList(channelLog[channelID]);
        // $(".processed").hide();
        $("#chatMessageList > li:not(.hidden)").addClass("hidden");
        $(".chc_"+channelID).removeClass("hidden");
        $("#channelTab"+channelID).addClass("chTabSelected");
        $("#channelPreviewWrapper").hide();
        currentChannel = channelID;
        if (channelID.match(/^[0-9]+$/) === null) {
            var groupName = channelLog[channelID].channelName;
            if (options.channelsSettings.channelMerger.groups.indexOf(groupName) !== -1) {
                if (typeof options.channelsSettings.channelMerger.defaultChannels[groupName] !== "undefined") {
                    channelID = resolveChannelID(options.channelsSettings.channelMerger.defaultChannels[groupName]).cID;
                }
            }
        }
        var channelOption = $("#chatChannel option[value="+channelID+"]");
        if (channelOption.length > 0){
            $("#chatChannel").val(channelID);
        }
        if (chatDirection === "down") {
            setTimeout(function(){
                $("#chatMessageListWrapper").mCustomScrollbar("scrollTo",  "bottom");
            }, 500);
        }
    });

    $(document).on("click", "#CPAReset, #chTabCTMenuReset", function(){
        resetUnreadCount();
    });

    $(document).on("click", "#CPAReset, #chTabCTMenuLast", function(){
        var channelName = channelLog[hoveringOverTab].channelName;
        var msg = "/last "+channelName;
        if (channelName === "CLAN") {
            msg = "/c /last";
        } else if (options.channelsSettings.channelMerger.groups.indexOf(channelName) !== -1) {
            if (typeof options.channelsSettings.channelMerger.defaultChannels[channelName] !== "undefined") {
                msg = "/last " + options.channelsSettings.channelMerger.defaultChannels[channelName];
            }
        } else if (channelName === "Whispers Log") {
            msg = "/w /last";
        } else if (scriptChannels.indexOf(hoveringOverTab) !== -1) {
            return false;
        }
        $("#chatMessage").text(msg);
        $("#chatSendMessage").click();
    });

    $(document).on("click", "#CPAPurge, #chTabCTMenuPurge", function(){
        var confirmToo = $(this).attr("id") === "chTabCTMenuPurge";
        purgeChannel(false, confirmToo);
    });

    $(document).on("click", "#CPARemove, #chTabCTMenuRemove", function(){
        var confirmToo = $(this).attr("id") === "chTabCTMenuRemove";
        purgeChannel(true, confirmToo);
    });

    $(document).on("click", "#chTabCTMenuLeave", function(){
        var channelName = channelLog[hoveringOverTab].channelName;
        purgeChannel(true, true);
        $("#chatMessage").text("/leave " + channelName);
        $("#chatSendMessage").click();
    });

    $(document).on("click", "#chTabCTMenuColor", function(){
        if (hoveringOverTab.indexOf(MergedChannelsGroup) !== -1) {
            var color = randomColor();
            channelLog[hoveringOverTab].channelColor = color;
            updateChannelList(channelLog[hoveringOverTab]);
        } else {
            $.alert("Tab color change failed! Please try again!", "Group tab color change");
        }
    });

    $(document).on("click", "#chTabCTMenuMute", function(){
        if (typeof hoveringOverTab === "undefined"){
            return;
        }
        var channel = channelLog[hoveringOverTab].channelName;
        if (options.channelsSettings.mutedChannels.indexOf(channel) === -1) {
            options.channelsSettings.mutedChannels.push(channel);
            saveOptions();
        }
        channelLog[hoveringOverTab].muted = true;
        updateChannelList(channelLog[hoveringOverTab]);
    });

    $(document).on("click", "#chTabCTMenuUnMute", function(){
        if (typeof hoveringOverTab === "undefined"){
            return;
        }
        var channel = channelLog[hoveringOverTab].channelName;
        var pos = options.channelsSettings.mutedChannels.indexOf(channel);
        if (pos !== -1) {
            options.channelsSettings.mutedChannels.splice(pos,1);
            saveOptions();
        }
        channelLog[hoveringOverTab].muted = false;
        updateChannelList(channelLog[hoveringOverTab]);
    });

    $(document).on("mouseover", ".channelTab", function(e){
        clearTimeout(hovering);
        var channelID       = $(this).attr("data-channel");
        hoveringOverTab     = channelID;
        if (!options.scriptSettings.preview){
            return;
        }
        var channelName     = channelLog[channelID].channelName;

        var channelPreviewWrapper = $("#channelPreviewWrapper");

        var channelTabHolder    = $(this);

        var cssOptions = {
            top: ($(this).offset().top + 25)+"px"
        };
        var previewContent = "There are no new messages in this channel!";
        if (channelLog[channelID].newMessages === true) {
            var previewMessages = [];
            $(".chc_"+channelID).each(function(i,e){
                if (i < channelLog[channelID].newMessagesCount){
                    previewMessages.push($(e).html());
                }
            });
            previewContent = previewMessages.join("<br>");
        }

        $("#channelPreviewMessages").html(previewContent);

        if ($(this).offset().left > $(document).width() / 2){
            cssOptions.left = ($(this).offset().left - channelPreviewWrapper.width() + 50)+"px";
        } else {
            cssOptions.left = ($(this).offset().left + 50)+"px";
        }
        channelPreviewWrapper
            .css(cssOptions)
            .children("h5")
                .text("'"+channelName+"' preview");

        if (options.scriptSettings.preview_reset){
            $("#CPAReset").show();
        } else {
            $("#CPAReset").hide();
        }
        if (options.scriptSettings.purge){
            $("#CPAPurge").show();
        } else {
            $("#CPAPurge").hide();
        }
        if (options.scriptSettings.channel_remove){
            $("#CPARemove").show();
        } else {
            $("#CPARemove").hide();
        }
    });

    $(document).on("mouseover", function(e){
        clearTimeout(hovering);
        if (typeof hoveringOverTab !== "undefined" && typeof channelLog[hoveringOverTab] !== "undefined") {

            var channelTab              = $("#channelTab" + hoveringOverTab);
            var channelPreviewWrapper   = $("#channelPreviewWrapper");
            var shouldShow              = channelLog[hoveringOverTab].newMessages === true;
            var OpenAndKeep             = $(e.target).closest(channelTab).length || $(e.target).closest(channelPreviewWrapper).length;
            var delay                   = OpenAndKeep ? 500 : 250;
            hovering = setTimeout(function(){
                if (options.scriptSettings.preview && OpenAndKeep && shouldShow) {
                    channelPreviewWrapper.show(0, function(){
                        if (chatDirection === "down") {
                            $("#channelPreviewContent").mCustomScrollbar("scrollTo",  "bottom");
                        }
                    });

                    
                } else {
                    channelPreviewWrapper.hide();
                }
            }, delay);
        }
    });

    $(document).on("contextmenu", ".channelTab", function(e){
        e.preventDefault();
        var cssOptions = {
            top: e.pageY+"px"
        };

        if ($(this).offset().left > $(document).width() / 2){
            cssOptions.left = (e.pageX - $(this).width())+"px";
        } else {
            cssOptions.left = e.pageX+"px";
        }

        if (options.scriptSettings.preview_reset){
            $("#chTabCTMenuReset").show();
        } else {
            $("#chTabCTMenuReset").hide();
        }
        if (options.scriptSettings.purge){
            $("#chTabCTMenuPurge").show();
        } else {
            $("#chTabCTMenuPurge").hide();
        }
        if (options.scriptSettings.channel_remove){
            $("#chTabCTMenuRemove").show();
        } else {
            $("#chTabCTMenuRemove").hide();
        }

        if (options.channelsSettings.mutedChannels.indexOf(channelLog[hoveringOverTab].channelName) !== -1){
            $("#chTabCTMenuUnMute").show();
            $("#chTabCTMenuMute").hide();
        } else {
            $("#chTabCTMenuMute").show();
            $("#chTabCTMenuUnMute").hide();
        }

        if (hoveringOverTab.match(/^[a-z]+/i)) {
            $("#chTabCTMenuLeave").hide();
            if (hoveringOverTab.indexOf(MergedChannelsGroup) !== -1) {
                $("#chTabCTMenuColor").show();
            } else {
                $("#chTabCTMenuColor").hide();
            }
        } else {
            $("#chTabCTMenuColor").hide();
            $("#chTabCTMenuLeave").show();
        }

        if (scriptChannels.indexOf(hoveringOverTab) !== -1 && hoveringOverTab !== WhispersChannel) {
            $("#chTabCTMenuLast").hide();
        } else {
            $("#chTabCTMenuLast").show();
        }
        // $("#chTabCTMenuColor").hide();

        $("#channelTabContextMenu").css(cssOptions).show();
        $("#channelPreviewWrapper").hide();
        return false;
    });

    $(document).on("click", "#ToASettings", function(){
        $("#modalBackground").show();
        $("#ToASettingsWindow").show();
        loadAllChannels();
        
        /**
         * load muted channel
         */

        var mchw    = $("<span>").addClass("ChMChannelWrapper border2");
        var mchx    = $("<span>").addClass("ChMMChX ui-element fa fa-times ruby");

        $("#ToASChMMutedChannelsHolder").html("");
        $("#ToASChMMergedChannelsHolder").html("");
        $("#ToASChMMergedChannelsGroupsHolder").html("");
        var channelName = "";
        for (var i in options.channelsSettings.mutedChannels) {
                channelName = options.channelsSettings.mutedChannels[i];
            var holder      = mchw.clone().append(channelName).appendTo("#ToASChMMutedChannelsHolder");
            mchx.clone().attr("data-channel", channelName).prependTo(holder);
        }
        channelName = "";

        $("#ToASChMMergedChannelsGroupsHolder").html("");
        for (var j in options.channelsSettings.channelMerger.groups){
            var mcggn = options.channelsSettings.channelMerger.groups[j];
            addChannelGroup(j, mcggn);
        }
        for (var channelID in channelLog) {
            if (!channelID.match(/^[0-9]+$/)) {
                continue;
            }
            var channelInfo     = channelLog[channelID];
                channelName     = channelInfo.channelName;
            var channelBlob     = mchw.clone().attr("data-channel", channelName).text(channelName);
            if (typeof options.channelsSettings.channelMerger.mapping[channelName] !== "undefined") {
                var grouppedInto    = options.channelsSettings.channelMerger.mapping[channelName];
                var mcgGroupID      = options.channelsSettings.channelMerger.groups.indexOf(grouppedInto);
                    mcgGroupID      = MergedChannelsGroup + "_MCGID_" + groupsMap[grouppedInto];
                if (options.channelsSettings.channelMerger.defaultChannels[grouppedInto] === channelName) {
                    channelBlob.insertAfter("#"+mcgGroupID+" > input");
                } else {
                    channelBlob.appendTo("#"+mcgGroupID);
                }
            } else {
                channelBlob.appendTo("#ToASChMMergedChannelsHolder");
            }
        }
        channelName = "";
        $(".incsort").sortable({
            items: "span",
            connectWith: ".incsort",
            receive: function(i,e) {
                    channelName = $(e.item[0]).attr("data-channel");
                var groupName   = $(this).attr("data-group");
                if (typeof groupName === "undefined") {
                    delete options.channelsSettings.channelMerger.mapping[channelName];
                } else {
                    options.channelsSettings.channelMerger.mapping[channelName] = groupName;
                }
                saveOptions();
            },
            update: function(i,e){
                var groupName   = $(this).attr("data-group");
                if (typeof groupName !== "undefined") {
                    var channels = $(i.target).children("span");
                    var channelName = $(channels[0]).attr("data-channel");
                    options.channelsSettings.channelMerger.defaultChannels[groupName] = channelName;
                    saveOptions();
                } // else branch makes no sense :)
            }
        }).disableSelection();
    });

    $(document).on("click", ".ChMMChX", function(){
        var channel             = $(this).attr("data-channel");
        var channelID           = resolveChannelID(channel).cID;
        channelLog[channelID].muted  = false;
        updateChannelList(channelLog[channelID]);
        var pos = options.channelsSettings.mutedChannels.indexOf(channel);
        if (pos !== -1) {
            options.channelsSettings.mutedChannels.splice(pos,1);
        }
        $(this).parent().fadeOut("slow", function(){
            $(this).remove();
        });
        saveOptions();
    });

    $(document).on("click", ".joinChannel", function(){
        // trim(",");
        var chn = $(this).text().replace(/^,+|,+$/gm,"");
        $("#chatMessage").text("/join "+ chn);
        var pwd = $(this).parent().find(".jcPWD").text();
        $("#chatMessage").append(" " + pwd);
        if (options.scriptSettings.auto_join) {
            $("#chatSendMessage").click();
        }
    });

    $(document).on("click", function(e){
        $("#channelTabContextMenu").hide();
        var settings = $("#ToASettingsWindow");
        if (
            !$(e.target).closest("#ToASettingsWindow").length &&
            !$(e.target).closest("#ToASettings").length &&
            !$(e.target).closest("#confirmOverlay").length &&
            !$(e.target).closest(".replenishStamina").length || 
            $(e.target).closest("#ToASettingsWindowClose").length) {

                settings.hide();
                $("#ToASettingsChannelMerger").hide();
                $("#ToASettingsScriptSettings").hide();
            if ($(e.target).closest("#ToASettingsWindowClose").length) {
                $("#modalBackground").fadeOut();
            }
        }
    });

    $(document).on("click", "#ToAScriptOptions, #ToAChannelMerger", function(){
        var id = $(this).attr("id");
        if (id === "ToAScriptOptions") {
            $("#ToASettingsChannelMerger").slideUp(function(){
                $("#ToASettingsScriptSettings").slideDown();
            });
        } else {
            $("#ToASettingsScriptSettings").slideUp(function(){
                $("#ToASettingsChannelMerger").slideDown();
            });
        }
    });

    $(document).on("click", "#profileOptionQuickScope", quickScopeUser);
    $(document).on("click", "#profileOptionAt", mentionUser);
    $(document).on("click", "#profileOptionNick", nicknameUser);

    $(document).on("keydown", function(e){
        var keys = {
            Q: 81, // [Q]uickscope
            C: 67, // Ni[c]kname
            E: 69 // @m[e]ntion
        };
        var key = e.which;
        if ($("#profileOptionTooltip").css("display")==="block") {

            if (key === keys.Q) {
                quickScopeUser();
            } else if (key === keys.E) {
                mentionUser();
                e.preventDefault();
            } else if (key === keys.C) {
                nicknameUser();
            }
        }
    });

    // on blur ... hmm
    $(document).on("change", ".ToASChMmcgName", updateGroupName);

    $(document).on("click", "#ToASChMAddGroup", function(){
        $.confirm({
            "title"     : "New Group Name",
            "message"   : "<input type=\"text\" id=\"ToASChMNewgroupName\" style=\"width:100%;\">",
            "buttons"   : {
                "Create"       : {
                    "class"     : "green",
                    "action"    : function() {
                        var groupName = $("#ToASChMNewgroupName").val();
                        if (groupName.match(/^\s*$/)){
                            groupName = randomName(7,13);
                        }
                        options.channelsSettings.channelMerger.groups.push(groupName);
                        groupsMap[groupName] = randomName(3,5) + "_" + randomInt(5,9);
                        $("#ToASettings").click();
                    }
                },
                "Cancel"       : {
                    "class"     : "red",
                    "action"    : function() {
                    }
                }
            }
        });
        $("#ToASChMNewgroupName").focus();
    });

    $(document).on("click", ".ToASChMChGRemove", function() {
        var elem = $(this);
        $.confirm({
            "title"     : "Group Delete Confirmation",
            "message"   : "Are you sure you want to remove this channel group?",
            "buttons"   : {
                "Yes"       : {
                    "class"     : "green",
                    "action"    : function() {
                        var groupID = elem.attr("data-gnid");

                        var groupName = options.channelsSettings.channelMerger.groups[groupID];

                        for (var x in options.channelsSettings.channelMerger.mapping) {
                            if (options.channelsSettings.channelMerger.mapping[x] === groupName) {
                                delete options.channelsSettings.channelMerger.mapping[x];
                            }
                        }

                        options.channelsSettings.channelMerger.groups.splice(groupID, 1);

                        var groupChannelID = MergedChannelsGroup + "_MCGID_" + groupsMap[groupName];
                        $("#channelTab"+groupChannelID).remove();
                        delete channelLog[groupChannelID];
                        delete groupsMap[groupName];
                        delete options.channelsSettings.channelMerger.defaultChannels[groupName];
                        $("#chatMessageList li").attr("class", "");
                        saveOptions();
                        $("#channelTabList > div:nth-child(2)").click();
                        loadMessages("reload");
                        $("#ToASettings").click();
                    }
                },
                "No"       : {
                    "class"     : "red",
                    "action"    : function() {
                    }
                }
            }
        });
    });

    init();
}(jQuery));