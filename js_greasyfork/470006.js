// ==UserScript==
// @name         SteamGroupBlocker
// @namespace    https://greasyfork.org/users/191481
// @version      0.1.1
// @description  Block all member of a steam group
// @author       Zeper
// @match        https://steamcommunity.com/groups/*/members
// @match        https://steamcommunity.com/groups/*/members/
// @grant        GM_xmlhttpRequest
// @connect      steamcommunity.com
// @downloadURL https://update.greasyfork.org/scripts/470006/SteamGroupBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/470006/SteamGroupBlocker.meta.js
// ==/UserScript==

var IsDebug = false;
var xhr = new XMLHttpRequest();
var parser = new DOMParser();
var GroupMembers = [];
var MemberCount = 0;
var GroupName = "";
var NextPageNum = 1;
var Action = "block";
var HasBlockBtnBeenPressed = false;
// Error
var ErrorCount = 0;
var RetryOverError = 1;
var NetErrorCount = 0;
var RetryOverNetError = 3;
var timestamp = 0;
var minDelay = 30000;

function EndOfScript(){
        HasBlockBtnBeenPressed = false;
        NextPageNum = 1;
        console.log("[SteamGroupBlocker] End of script, all members should have been "+Action+".");
        alert("[SteamGroupBlocker] End of script, all members should have been "+Action+".");
        return;
}

function GetGroupMembers(){
    if (NextPageNum == 0) {
        EndOfScript();
    } else {
        if (IsDebug){console.log("[SteamGroupBlocker] PageNum : "+NextPageNum);}
        GM_xmlhttpRequest ( {
            method:     "GET",
            url:        "http://steamcommunity.com/groups/"+GroupName+"/memberslistxml/?xml=1&p="+NextPageNum.toString(),
            onreadystatechange :     function (response) {
                if (response.readyState == 4 && response.status == 200) {
                    if (IsDebug){console.log(response.responseText);}
                    var xmlDoc = parser.parseFromString(response.responseText,"text/xml");
                    var SteamID64 = xmlDoc.getElementsByTagName("steamID64");
                    if (MemberCount == 0) {
                        var MemberCounts = xmlDoc.getElementsByTagName("memberCount");
                        for (let Counts of MemberCounts) {
                            if (Counts.parentNode.localName == "memberList") {
                                MemberCount = parseInt(Counts.innerHTML);
                            }
                        }
                        if (IsDebug){console.log("[SteamGroupBlocker] MemberCount : "+ JSON.stringify(MemberCount));}
                        if (MemberCount >= 1000) {
                            HasBlockBtnBeenPressed = false;
                            console.warn("[SteamGroupBlocker] This group has a lot of member it will take time to "+Action+" all of them. At best 1000 users per 30 seconds.");
                            console.warn("[SteamGroupBlocker] if you realy want to do it anyway click once more on the "+Action+" button");
                            alert("[SteamGroupBlocker] This group has a lot of member it will take time to "+Action+" all of them. At best 1000 users per 30 seconds.");
                            alert("[SteamGroupBlocker] if you realy want to do it anyway click once more on the "+Action+" button");
                            return;
                        }
                    }
                    for (let item of SteamID64) {
                        GroupMembers.push(item.innerHTML);
                    }
                    if (IsDebug){
                        console.log(GroupMembers);
                    }
                    var NextPage = xmlDoc.getElementsByTagName("nextPageLink");
                    if (NextPage.length > 0){
                        NextPage = NextPage[0].childNodes[0].data;
                        var NextPageUrl = new URLSearchParams(NextPage);
                        NextPageNum = NextPageUrl.get('p');
                    } else { NextPageNum = 0}
                    ActionOnSteamID();
                }
            }
        } );
    }
}

function ActionOnSteamID(){
    if (ErrorCount > RetryOverError) {
        throw new Error("[SteamGroupBlocker] Too much error when trying to block users, script will stop.");
        return;
    } else if (NetErrorCount > RetryOverNetError) {
        throw new Error("[SteamGroupBlocker] Too much network error when trying to block users maybe you are rate limited, script will stop.");
        return;
    } else {
        if (GroupMembers.length > 0) {
            var delay = 1;
            var steamIDstring = ""
            GroupMembers.forEach(steamID => {
                steamIDstring += "&steamids%5B%5D="+steamID;
            });
            if (IsDebug){console.log("[SteamGroupBlocker] steamIDstring : "+steamIDstring);}
            timestamp = Date.now();
            console.log("[SteamGroupBlocker] Sending "+Action+" request.");
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://steamcommunity.com/profiles/'+g_steamID+'/friends/action',
                data: "sessionid="+g_sessionID.toString()+"&steamid="+g_steamID+"&ajax=1&action="+Action+steamIDstring,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With':	'XMLHttpRequest'
                },
                onreadystatechange :     function (response) {
                    if (response.readyState == 4) {
                        if (response.status == 200) {
                            NetErrorCount = 0;
                            var jsonResponse = JSON.parse(response.responseText);
                            if (IsDebug){console.log("[SteamGroupBlocker] Block response : "+response.responseText);}
                            if (IsDebug){console.log("[SteamGroupBlocker] Block response success : "+jsonResponse.success);}
                            if (jsonResponse.success == 1) {
                                ErrorCount = 0;
                                GroupMembers.length = 0;
                                if (NextPageNum == 0) {
                                    EndOfScript();
                                    return;
                                }
                            } else {
                                ErrorCount++;
                            }
                            if ((Date.now() - timestamp) < minDelay) {delay = (minDelay-(Date.now() - timestamp))}
                            console.log("[SteamGroupBlocker] Waiting : "+delay+" ms before next step...");
                            setTimeout(() => {ActionOnSteamID();}, delay);
                        } else {
                            NetErrorCount++;
                            setTimeout(() => {ActionOnSteamID();}, minDelay);
                        }
                    }
                }
            });
        } else if (NextPageNum == 0) {
            EndOfScript();
        } else {
            GetGroupMembers();
        }
    }
}


function BlockBtnPressed(){
    if (HasBlockBtnBeenPressed) {
        console.warn("[SteamGroupBlocker] Button already pressed.");
        return;
    } else {
        HasBlockBtnBeenPressed = true;
        Action = "block";
        GetGroupMembers();
    }
}


function UnBlockBtnPressed(){
    if (HasBlockBtnBeenPressed) {
        console.warn("[SteamGroupBlocker] Button already pressed.");
        return;
    } else {
        HasBlockBtnBeenPressed = true;
        Action = "unblock";
        GetGroupMembers();
    }
}

function DoGUI(){
    let BlockBtn = document.createElement('button');
    BlockBtn.className = ('btn_darkred_white_innerfade btn_medium');
    let BlockText = document.createElement('span');
    BlockText.append('BLOCK ALL USERS');
    BlockBtn.appendChild(BlockText);
    BlockBtn.addEventListener("click", BlockBtnPressed , false);
    document.querySelector("#searchEditForm > button").after(BlockBtn)
    let UnBlockBtn = document.createElement('button');
    UnBlockBtn.className = ('btn_darkblue_white_innerfade btn_medium');
    let UnBlockText = document.createElement('span');
    UnBlockText.append('UNBLOCK ALL USERS');
    UnBlockBtn.appendChild(UnBlockText);
    UnBlockBtn.addEventListener("click", UnBlockBtnPressed , false);
    BlockBtn.after(UnBlockBtn)
}

function Init(){
    let regex = /https:\/\/steamcommunity\.com\/groups\/([^;]+)\/members/;
    GroupName = window.document.baseURI.match(regex)[1];
    console.log("[SteamGroupBlocker] GroupName : "+GroupName);
    if (g_steamID === false) {
        throw new Error("[SteamGroupBlocker] You need to be logged into steam.");
        return;
    }
    DoGUI();
}

Init();