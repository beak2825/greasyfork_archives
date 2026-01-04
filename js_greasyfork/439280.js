// ==UserScript==
// @name         Steam Community - All Friends Poster, VAC, add
// @icon         http://steamcommunity.com/favicon.ico
// @namespace    User81
// @author       User81
// @version      0.0.3
// @description  Posts a message to all or selected friends, VAC status check, add friends
// @include      /^https?:\/\/steamcommunity.com\/(id\/+[A-Za-z0-9$-_.+!*'(),]+|profiles\/7656119[0-9]{10})\/friends\/?$/
// @run-at       document-idle
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/439280/Steam%20Community%20-%20All%20Friends%20Poster%2C%20VAC%2C%20add.user.js
// @updateURL https://update.greasyfork.org/scripts/439280/Steam%20Community%20-%20All%20Friends%20Poster%2C%20VAC%2C%20add.meta.js
// ==/UserScript==

// ==Configuration==
let delay = 7; // Seconds in between posting profile comments
// ==/Configuration==

// ==Code==
this.$ = this.jQuery = jQuery.noConflict(true);
ToggleManageFriends();
$(".title_bar").before(`
    <div class ="profile_friends title_bar" style="padding: 10px; width: 96%; margin: 8px; display: inline-block;">
    <span id="selected_msg" class="selected_msg hidden">Selected: <span  style="color: #ebebeb;" id="selected_count"> 0 </span>
    <span id="selected_msg" class="selected_msg hidden">Process: <span  style="color: #ebebeb;" id="process_state"></span>
    </span>
    <span class="row"  style="float: right;">
        <span class="dimmed"> Select: </span>
        <span class="selection_type" id="not_vac_submit"><a data-vac="0" style="padding: 10px; color: deeppink;">VAC</a></span>
        <span class="selection_type" id="vac_submit"><a data-vac="1" style="padding: 10px; color: lawngreen;">Not VAC</a></span>
        <span class="selection_type" id="SelectAll" onclick="SelectAll()"><a>All</a></span>
        <span class="selection_type" id="SelectNone" onclick="SelectNone()"><a>None</a></span>
        <span class="selection_type" id="SelectInverse" onclick="SelectInverse()"><a>Inverse</a></span>
        <span class="dimmed"> Speed: </span>
        <input id="speed_requests" style="color:white;border:transparent;max-width:65px;" type="number" value="${delay}">
	</span>
    </div>
    <div class="row commentthread_entry" style="background-color: initial;">
        <div class="commentthread_entry_quotebox">
            <textarea rows="3" class="commentthread_textarea" id="comment_textarea" placeholder="Add a comment" style="overflow: hidden; height: 300px;"></textarea>
        </div>
        <div class="commentthread_entry_submitlink" style="">
            <a class="btn_grey_black btn_small_thin" href="javascript:CCommentThread.FormattingHelpPopup('Profile');">
                <span>Formatting help</span>
            </a>
            <span class="emoticon_container">
                <span class="emoticon_button small" id="emoticonbtn">
                </span>
            </span>
            <span class="btn_green_white_innerfade btn_small" id="comment_submit">
                <span>
                    <i style=" background-repeat: no-repeat; background-size: 16px 190px; padding-left: 25px; background-image: url(https://community.akamai.steamstatic.com/public/images/iconsheet_friends.png?v=5);background-position: 0 -111px;"></i> 
                    Post Comments to Selected Friends
                </span>
            </span>

            <span class="btn_green_white_innerfade btn_small" id="friends_submit" style="float: left;">
            <span class"icon_item icon_all_following"><i class="add_friend_icon"></i>Add Friends</span>
        </div>

    </div>
    <div class="row" id="log" style ="max-height: 200px; overflow: auto;">
        <span id="log_info"></span>
    </div>`);

new CEmoticonPopup($J('#emoticonbtn'), $J('#commentthread_Profile_0_textarea'));


$("#comment_submit").click(() => {

    CheckNumberSpeed(+$("#speed_requests").val());
    const total = $(".selected").length;
    const msg = $("#comment_textarea").val();

    if (total === 0 || msg.length === 0) {
        alert("Please selected 1 or more friends.");
        return;
    }

    $("#log_info, #process_state").html("");
    $(".selected").each((i, elem) => {
        let profileID = $(elem).data("steamid");
        setTimeout(() => $.post(`//steamcommunity.com/comment/Profile/post/${profileID}/-1/`, {
            comment: msg,
            count: 6,
            sessionid: g_sessionID
        }, response => {
            $("#log_info").get()[0].innerHTML += `<br>` + (response.success === false ? response.error : `Successfully posted comment on <a href=\"https://steamcommunity.com/profiles/${profileID}/#commentthread_Profile_${profileID}_0_area">${profileID}</a>`);
            $(`.friend_block_v2[data-steamid=${profileID}]`).removeClass("selected").find(".select_friend_checkbox").prop("checked", false);
            UpdateSelection();
        })
            .fail(() => $("#log_info").get()[0].innerHTML += `<br>Failed to post comment on <a href="http://steamcommunity.com/profiles/${profileID}/"> ${profileID} </a>`)
            .always(() => $("#process_state").html(`<b>Processed ${(i + 1)} out of ${total} friend${(total.length === 1 ? `` : `s`)}.<b>`)), delay * i * 1000);
    });

});


$("#friends_submit").click(() => {
    
    CheckNumberSpeed(+$("#speed_requests").val());
    const total = $(".selected").length;
    if (total === 0) {
        alert("Please make sure you  selected 1.");
        return;
    }
    $("#log_info, #process_state").html("");
    $(".selected").each((i, elem) => {
        let profileID = $(elem).data("steamid");
        setTimeout(() => $.post(`//steamcommunity.com/actions/AddFriendAjax`, {
            sessionID: g_sessionID,
            steamid: profileID,
            accept_invite: 0,
        }, response => {
            $("#log_info").get()[0].innerHTML += `<br>` + (response.success === false ? response.error : `Successfully add user <a href=\"https://steamcommunity.com/profiles/${profileID}">${profileID}</a>`);
            $(`.friend_block_v2[data-steamid=${profileID}]`).removeClass("selected").find(".select_friend_checkbox").prop("checked", false);
            UpdateSelection();
        })
            .fail(() => $("#log_info").get()[0].innerHTML += `<br> Failed add friend on <a href="http://steamcommunity.com/profiles/${profileID}/"> ${profileID} </a>`)
            .always(() => $("#process_state").html(`<b>Processed ${(i + 1)} out of ${total} Add friend${(total.length === 1 ? `` : `s`)}.<b>`)), delay * i * 1000);
    });

});

$(".selectable,  #SelectAll, #SelectNone, #SelectInverse, #not_vac_submit").click(() => {
    const total = $(".selected").length;
    if (total === 0) {
        $( '#selected_count' ).html( 0 );
        return;
    }
});


$("#vac_submit, #not_vac_submit").click((e) => {

    CheckNumberSpeed(+$("#speed_requests").val());
    const selectVac = $(e.target).data("vac");
    $("#log_info, #process_state").html("");
    let profileID = '';
    let arrId =[];
    let start = 100;
    let doomSize = $(".friend_block_v2").length;
    let arrCount = Math.ceil(doomSize/start);
/*     console.log(doomSize); */
    if (doomSize > 0) {
        $(".friend_block_v2").each((i, elem) => {
                profileID = $(elem).data("steamid");
                arrId = [...arrId,  profileID];
        });

        let rangeVal = (arr, start, arrCount) => {
            let newArr = [];
            for (let i = 0; i < arrCount; i++) {
                let removed = arr.splice(0, start).join(',');
                newArr = [...newArr, removed];
            }
            return newArr;
        }

        $.each(rangeVal(arrId, start, arrCount), (idArr, idString) => {
            const countRequest = (idArr+1)*start;
            
            setTimeout(() => $.get(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=5DA40A4A4699DEE30C1C9A7BCE84C914&steamids=${idString}`,
            response => {
                $("#log_info").get()[0].innerHTML += (response.success === false ? response.error : '');

                    $.each(response.players, (idJson, playersInfo) => {
                            let UsersBans = displayBans(playersInfo);
                            $(`.friend_block_v2[data-steamid=${playersInfo.SteamId}]`).get()[0].innerHTML += UsersBans.banInfo;
                            if (UsersBans.ban === selectVac) {
                                $J(`.friend_block_v2[data-steamid=${playersInfo.SteamId}]`).removeClass("selected").css({"height": "auto"}).find(".select_friend_checkbox").prop("checked", false);
                                UpdateSelection();
                            }else{
                                $J( ".friend_block_v2[data-steamid=" + playersInfo.SteamId+ "]").addClass( 'selected' ).css({"height": "auto"}).find(".select_friend_checkbox").prop( 'checked', true );
                                UpdateSelection();
                            }
                    });
                    ToggleManageFriends();
            })
                .fail(() => $("#log_info").get()[0].innerHTML += `<br> Failed to check bans`)
                .always(() => $("#process_state").html(`<b>Processed ${( countRequest < doomSize ? countRequest : doomSize)} out of ${doomSize} Check vac. <b>`)), delay * idArr * 1000);
        });
    }
});

function CheckNumberSpeed (number) {
    if (Number.isInteger(number)) {
        delay = number;
    }
}

function displayBans(playersInfo){
    let BanHistory ="";
    let banInfo="";
    if (playersInfo.CommunityBanned) {
        BanHistory += `<br><b style="color : red;">Community Banned</b> <br>`;
    }
    if(playersInfo.VACBanned){
        BanHistory += `<br><b style="color:red;">VAC Banned</b> ${playersInfo.NumberOfVACBans} <br>`;
    }
    if(playersInfo.DaysSinceLastBan !== 0){
        BanHistory += `<br><b style="color:red;">Last Ban</b> ${playersInfo.DaysSinceLastBan} <br>`;
    }
    if(playersInfo.NumberOfGameBans !== 0){
        BanHistory += `<br><b style="color:red;">Game Bans</b> ${playersInfo.NumberOfGameBans} <br>`;
    }
    if(playersInfo.EconomyBan !== "none"){
        BanHistory += `<br><b style="color:red;">Economy Ban</b>`;
    }
    banInfo = `<div class="friend_block_content">${BanHistory}</div>`;
    if (BanHistory.length !== 0) {
        return  {banInfo, ban: 1};
    }
    BanHistory ='<b style="color:green;">Not bans</b>';
    banInfo = `<div class="friend_block_content">${BanHistory}</div>`;
    return {banInfo, ban: 0};
}
